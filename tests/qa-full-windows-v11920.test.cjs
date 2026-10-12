'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('MQ-00 one-click full QA runs all Node, H-L browser and UT200A browser stages',()=>{
 const bat=read('QA_TAM_PROJE_CALISTIR.bat');
 const ps=read('scripts/qa-full-windows-v11920.ps1');
 assert.match(bat,/powershell\.exe -NoProfile -ExecutionPolicy Bypass -File/);
 assert.match(bat,/qa-full-windows-v11920\.ps1/);
 assert.match(bat,/exit \/b %CODE%/);
 for(const part of ['scripts/run-tests.cjs','qa-hl64-windows-v11920.ps1','qa-mq05-ut200a-windows-v11920.ps1',
  'full_node','hl64_zip','ut200a_zip','Get-FileHash','SHA256','run-summary.json','Compress-Archive','FreshZip',
  'QA_TAM_PROJE_SONUC_'])
  assert.ok(ps.includes(part),'Missing full QA gate '+part);
 assert.match(ps,/\$Report\.node_full -eq 0 -and \$Report\.hl64 -eq 0 -and \$Report\.ut200a -eq 0/);
 assert.match(ps,/if\(\$Report\.status -ne 'PASS'\)\{exit 1\}/);
 assert.doesNotMatch(ps,/gh workflow run|workflow_dispatch|actions\/workflows|git push/);
});
test('MQ-00 QA is separate from offline launcher and never trusts old screenshot bundles',()=>{
 const ps=read('scripts/qa-full-windows-v11920.ps1');
 const launcher=read('BASLAT.bat');
 assert.match(launcher,/file:\/\/\//);
 assert.ok(ps.includes('LastWriteTime -ge $After.AddSeconds(-1)'));
 assert.ok(ps.includes("'dist\\tutorial-topic-review-batch-m.js'"));
 assert.ok(ps.includes("'dist\\project-store.js'"));
 assert.ok(ps.includes("'dist\\studio.js'"));
 assert.match(ps,/source-hashes\.json/);
 for(const folder of ['dist','tests','scripts'])assert.ok(ps.includes("'"+folder+"'"),'Source provenance missing folder '+folder);
 assert.match(ps,/Get-ChildItem -LiteralPath \$Folder -File/);
 assert.match(ps,/\$Report\.hash_file_count=\$Hashes\.Count/);
 assert.match(ps,/if\(\$Report\.status -ne 'PASS'\)\{exit 1\}/);
});


test('full Windows gate incorporates native 722 sequence evidence and refuses unverified probe output',()=>{
 const ps=read('scripts/qa-full-windows-v11920.ps1');
 for(const item of ['qa-tutorial-722-sequential-v11920.cjs','qa-tutorial-722-sequential-v11920.test.cjs',
  'qa-tutorial-722-sequential-report.json','SeqInfo.stabilityStatus','SeqInfo.behaviorStatus',
  '722 sequential electrical stability did not PASS','requires separate virtual-probe/browser QA'])
  assert.ok(ps.includes(item),'Missing 722 QA coverage: '+item);
 assert.match(ps,/\$SeqInfo\.behaviorStatus -ne 'PASS'/);
 assert.match(ps,/LastWriteTime -ge \$FullSince\.AddSeconds\(-1\)/);
});


test('full Windows acceptance bundles and checks fresh 1519 pedagogy source report',()=>{
 const ps=read('scripts/qa-full-windows-v11920.ps1');
 for(const part of ['qa-tutorial-practice-1519-v11920.cjs',
  'qa-tutorial-practice-1519-v11920.test.cjs',
  'qa-tutorial-practice-1519-report.json',
  'PedagogyInfo.sourceStatus','Fresh 1519 practice guide QA report missing'])
  assert.ok(ps.includes(part),'Missing pedagogy full QA gate: '+part);
 assert.match(ps,/\$PedagogyInfo\.sourceStatus -ne 'PASS'/);
 assert.match(ps,/\$FullSince\.AddSeconds\(-1\)/);
});
