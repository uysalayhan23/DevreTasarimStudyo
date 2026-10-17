const test=require('node:test');
const assert=require('node:assert/strict');
const cp=require('node:child_process');

function manifest(){
  // Windows Python Launcher (py -3) is preferred over the python3 Store alias.
  const candidates=process.platform==='win32'
    ? [['py',['-3']],['python',[]],['python3',[]]]
    : [['python3',[]],['python',[]]];
  for(const [executable,prefix] of candidates){
    try{
      const text=cp.execFileSync(executable,[...prefix,'scripts/package.py','--list'],{encoding:'utf8',maxBuffer:8*1024*1024});
      return JSON.parse(text);
    }catch(error){
      if(error.code==='ENOENT'||/Python bulunamad|Python was not found/i.test(String(error.stderr||error.message)))continue;
      throw error;
    }
  }
  throw Error('Python 3 bulunamadı. Windows için py -3 veya python; diğer sistemlerde python3 gereklidir.');
}

test('WP-019 Windows runtime package uses an explicit end-user allowlist',()=>{
  const m=manifest(),entries=m.entries;
  assert.equal(m.profile,'runtime-allowlist-v1');
  assert.ok(entries.length>400&&entries.length<550,entries.length);
  for(const required of [
    'BASLAT.bat','BASLAT.html','KULLANIM.txt','README.md',
    'dist/index.html','dist/app.js','dist/library.js','dist/materials-v113.js','dist/materials-v115.js',
    'dist/assets/products/siemens-5sl6116-7-user-front-v11920.webp','dist/assets/products/omron-my-relay-v11920.webp',
    'Ornekler/K1_S2_Muhurleme.odsdevre',
    'Kaydedilen_Projeler/01_Kumanda_Muhurleme.odsdevre',
    'third_party/arduino/LICENSE-LGPL-2.1.txt',
    'Belgeler/ABB_ACS800_FW_RevL.pdf','Belgeler/ABB_ACS800_HW_RevF.pdf'
  ])assert.ok(entries.includes(required),required);
});

test('WP-019 runtime package excludes developer, CI and historical audit payload',()=>{
  const entries=manifest().entries;
  for(const prefix of ['tests/','scripts/','tools/','docs/','.github/']){
    assert.equal(entries.some(x=>x.startsWith(prefix)),false,prefix);
  }
  for(const file of [
    'AGENTS.md','DOGRULAMA_v1.18.0.json','DOSYA_LISTESI_v1.18.0.json',
    'V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md',
    'Belgeler/v1.18_referanslar/kutuphane_onizleme.png'
  ])assert.equal(entries.includes(file),false,file);
});

test('WP-019 package manifest contains only documented runtime roots',()=>{
  const entries=manifest().entries;
  const exact=new Set([
    'BASLAT.bat','BASLAT.html','KULLANIM.txt','README.md',
    'ACS800_KILAVUZU.md','V20_KILAVUZU.md','YENILIKLER_v1.19.0.md',
    'Belgeler/ABB_ACS800_FW_RevL.pdf','Belgeler/ABB_ACS800_HW_RevF.pdf'
  ]);
  const prefixes=['dist/','Ornekler/','Kaydedilen_Projeler/','third_party/'];
  for(const path of entries)assert.ok(exact.has(path)||prefixes.some(p=>path.startsWith(p)),path);
});
