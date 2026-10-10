#!/usr/bin/env python3
"""Package the explicit Windows runtime allowlist and verify every extracted byte. Stdlib only."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parent.parent
EXCLUDED_DIRS = {'.git', 'build', 'node_modules', '__pycache__'}
EXCLUDED_FILES = {'.DS_Store', 'Thumbs.db', 'Desktop.ini', '.env'}

RUNTIME_PREFIXES = ('dist/', 'Ornekler/', 'Kaydedilen_Projeler/', 'third_party/')
RUNTIME_FILES = {
    'BASLAT.bat',
    'BASLAT.html',
    'KULLANIM.txt',
    'README.md',
    'ACS800_KILAVUZU.md',
    'V20_KILAVUZU.md',
    'YENILIKLER_v1.19.0.md',
    'Belgeler/ABB_ACS800_FW_RevL.pdf',
    'Belgeler/ABB_ACS800_HW_RevF.pdf',
}
RUNTIME_PROFILE = 'runtime-allowlist-v1'


def excluded(name):
    parts = PurePosixPath(name).parts
    return any(p in EXCLUDED_DIRS for p in parts) or parts[-1] in EXCLUDED_FILES or parts[-1].startswith('.env.') or parts[-1].endswith('.pyc')


def runtime_allowed(name):
    return name in RUNTIME_FILES or any(name.startswith(prefix) for prefix in RUNTIME_PREFIXES)


def source_files():
    if (ROOT / '.git').exists():
        result = subprocess.run(['git', 'ls-files', '-z', '--cached'], cwd=ROOT, check=True, capture_output=True)
        names = sorted(set(result.stdout.decode('utf-8').split('\0')) - {''})
        untracked = subprocess.run(['git', 'ls-files', '--others', '--exclude-standard'], cwd=ROOT, check=True, capture_output=True, text=True).stdout.strip()
        if untracked:
            print('Uyarı: izlenmeyen dosyalar pakete eklenmedi. Yeni teslim dosyalarını git add ile ekleyin:\n' + untracked)
    else:
        names = sorted(p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file())
    names = [n for n in names if not excluded(n) and runtime_allowed(n)]
    if not names:
        raise RuntimeError('Paketlenecek dosya yok.')
    for name in names:
        p = PurePosixPath(name)
        if p.is_absolute() or '..' in p.parts or '\\' in name:
            raise RuntimeError('Güvenli olmayan yol: ' + name)
        local = ROOT / name
        if local.is_symlink() or not local.is_file() or not local.resolve().is_relative_to(ROOT):
            raise RuntimeError('Eksik dosya veya desteklenmeyen bağlantı: ' + name)
    for required in ('BASLAT.bat', 'BASLAT.html', 'dist/index.html', 'dist/app.js', 'KULLANIM.txt', 'README.md', 'third_party/arduino/LICENSE-LGPL-2.1.txt'):
        if required not in names:
            raise RuntimeError('Gerekli dosya listede yok: ' + required)
    return names


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, help='ZIP yolu; varsayılan build/ klasörü')
    parser.add_argument('--list', action='store_true', help='ZIP üretmeden runtime allowlistini JSON olarak yazdır')
    args = parser.parse_args()
    names = source_files()
    if args.list:
        print(json.dumps({'profile': RUNTIME_PROFILE, 'files': len(names), 'entries': names}, ensure_ascii=False, indent=2))
        return
    version = re.search(r'''APP_VERSION\s*=\s*['"]([^'"]+)''', (ROOT / 'dist/app.js').read_text(encoding='utf-8')).group(1)
    dest = args.output or ROOT / 'build' / ('Devre_Tasarim_Studyosu_v' + version + '_Windows.zip')
    dest = dest.resolve()
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest == ROOT or any((ROOT / name).resolve() == dest for name in names):
        raise RuntimeError('Çıktı bir kaynak dosyanın üzerine yazamaz.')
    entries = []
    with zipfile.ZipFile(dest, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6, allowZip64=False) as z:
        for name in names:
            data = (ROOT / name).read_bytes()
            info = zipfile.ZipInfo('Devre_Tasarim_Studyosu/' + name, date_time=(1980, 1, 1, 0, 0, 0))
            info.create_system = 0
            info.external_attr = 0x20
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data, compresslevel=6)
            entries.append({'path': name, 'bytes': len(data), 'sha256': digest(data)})
    with zipfile.ZipFile(dest) as z, tempfile.TemporaryDirectory(prefix='dts-zip-verify-') as temp:
        if z.testzip() is not None:
            raise RuntimeError('ZIP CRC kontrolü başarısız.')
        expected_names = {'Devre_Tasarim_Studyosu/' + e['path'] for e in entries}
        if set(z.namelist()) != expected_names or len(z.namelist()) != len(entries):
            raise RuntimeError('ZIP dosya listesi farklı.')
        z.extractall(temp)
        for e in entries:
            data = (Path(temp) / 'Devre_Tasarim_Studyosu' / e['path']).read_bytes()
            if digest(data) != e['sha256'] or len(data) != e['bytes']:
                raise RuntimeError('Çıkarılan dosya farklı: ' + e['path'])
    report = {'profile': RUNTIME_PROFILE, 'version': version, 'zip': dest.name, 'files': len(entries), 'bytes': dest.stat().st_size, 'sha256': digest(dest.read_bytes()), 'crc': 'passed', 'extractedFileHashes': 'passed', 'entries': entries}
    dest.with_suffix('.sha256').write_text(report['sha256'] + '  ' + dest.name + '\n', encoding='utf-8')
    dest.with_suffix('.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k: v for k, v in report.items() if k != 'entries'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
