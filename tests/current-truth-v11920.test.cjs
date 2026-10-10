const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

test('WP-014 current-truth documents point to v1.19.20 as active development',()=>{
  const readme=read('README.md');
  const dev=read('docs/GELISTIRME.md');
  const status=read('docs/DURUM_VE_SINIRLAR.md');

  assert.match(readme,/Aktif kalite\/geliştirme dalı:\*\* `v1\.19\.20`/);
  assert.match(dev,/aktif kalite\/geliştirme dalı yalnız `v1\.19\.20`/);
  assert.match(status,/\*\*Aktif kalite\/geliştirme:\*\* `v1\.19\.20`/);

  assert.doesNotMatch(readme,/aktif geliştirme dalı \*\*v1\.19\.0\*\*/i);
  assert.doesNotMatch(status,/Aktif geliştirme \/ indirme:\*\* `v1\.19\.1`/);
});

test('WP-014 current README does not present historical fixed test counts as current status',()=>{
  const readme=read('README.md');
  assert.match(readme,/Actions → Test ve Windows ZIP/);
  assert.match(readme,/Güncel test sayısı sabit bir README değeri değildir/);
  assert.doesNotMatch(readme,/28 Eylül 2026 durumu:\*\*/);
});

test('WP-014 default-branch limitation is explicit until repository setting can be changed',()=>{
  const readme=read('README.md');
  const status=read('docs/DURUM_VE_SINIRLAR.md');
  assert.match(readme,/default branch hâlâ `main`/);
  assert.match(status,/default branch hâlâ `main`/);
  assert.match(readme,/önce `v1\.19\.20` dalına geçin/);
});


test('P2-004 history index classifies legacy root record families without moving or re-authorizing them',()=>{
  const history=read('docs/HISTORY_INDEX.md');
  assert.match(history,/ARCHIVE|Tarihsel kayıt indeksi/i);
  for(const family of ['DOGRULAMA_v\\*\\.json','DOSYA_LISTESI_v\\*\\.json','YENILIKLER_v\\*\\.md','final-v\\*\\.txt','GORSEL_KAYNAKLARI_v\\*\\.md']){
    assert.match(history,new RegExp(family));
  }
  assert.match(history,/README\.md/);
  assert.match(history,/docs\/DURUM_VE_SINIRLAR\.md/);
  assert.match(history,/docs\/MASTER_DUZELTME_LISTESI_V1\.19\.20\.md/);
  const root=fs.readdirSync('.').filter(name=>fs.statSync(name).isFile());
  const historical=root.filter(name=>/^DOGRULAMA_v.*\.json$|^DOSYA_LISTESI_v.*\.json$|^YENILIKLER_v.*\.md$|^final-v.*\.txt$|^GORSEL_KAYNAKLARI_v.*\.md$|^GORSEL_VE_TEKNIK_KAYNAKLAR_v.*\.md$/.test(name));
  assert.ok(historical.length>0);
  assert.ok(historical.every(name=>!['README.md','KULLANIM.txt'].includes(name)));
});
