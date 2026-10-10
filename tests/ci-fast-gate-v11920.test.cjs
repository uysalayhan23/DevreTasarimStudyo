const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const Scope=require('../scripts/ci-scope-v11920.cjs');
const Docs=require('../scripts/check-docs-fast-v11920.cjs');
const Integrity=require('../scripts/check-v11920-integrity.cjs');

test('WP-018 docs-only classifier is deliberately narrow',()=>{
  for(const p of [
    'docs/MASTER_QUALITY_AUDIT_V3_AGENT_CROSSCHECK.md',
    'docs/AGENT_OPERASYON_PANOSU_V1.19.20.md',
    'V1.19.20_AGENT_TEAM_WORKFLOW_LOCKED.md'
  ])assert.equal(Scope.isFastDoc(p),true,p);

  for(const p of [
    'README.md','KULLANIM.txt','AGENTS.md','BASLAT.bat','BASLAT.html',
    'dist/app.js','tests/regression.test.cjs','scripts/package.py',
    'Ornekler/K1_S2_Muhurleme.odsdevre','Kaydedilen_Projeler/01_Kumanda_Muhurleme.odsdevre',
    '.github/workflows/check.yml','Belgeler/manual.pdf','URUN_GORSEL_KAYNAKLARI.txt'
  ])assert.equal(Scope.isFastDoc(p),false,p);
});

test('WP-018 path sets skip full CI only when every changed path is fast documentation',()=>{
  const docs=Scope.classifyPaths(['docs/A.md','V1.19.20_TEST_LOCKED.md']);
  assert.deepEqual({full:docs.full,docsOnly:docs.docsOnly,reason:docs.reason},{full:false,docsOnly:true,reason:'docs-only'});
  const mixed=Scope.classifyPaths(['docs/A.md','dist/app.js']);
  assert.deepEqual({full:mixed.full,docsOnly:mixed.docsOnly,reason:mixed.reason},{full:true,docsOnly:false,reason:'runtime-or-quality-change'});
  const empty=Scope.classifyPaths([]);
  assert.equal(empty.full,true);
});

test('WP-018 manual dispatch and missing diff base remain conservative full-CI cases',()=>{
  const sha='a'.repeat(40);
  assert.equal(Scope.classify({eventName:'workflow_dispatch',base:'',head:sha}).full,true);
  assert.equal(Scope.classify({eventName:'push',base:'0'.repeat(40),head:sha}).full,true);
  assert.equal(Scope.classify({eventName:'push',base:'bad',head:sha}).full,true);
});

test('fast documentation validator accepts the current audit corpus',()=>{
  const result=Docs.main();
  assert.ok(result.files>0);
});

test('WP-017 immutable boundary protects the WP-018 scope and fast-doc scripts',()=>{
  for(const p of ['scripts/ci-scope-v11920.cjs','scripts/check-docs-fast-v11920.cjs'])assert.ok(Integrity.PROTECTED.includes(p),p);
});

test('WP-017/WP-018 workflow uses a pinned immutable baseline, never bootstrap mode',()=>{
  const yml=fs.readFileSync('.github/workflows/check.yml','utf8');
  assert.doesNotMatch(yml,/DTS_LOCK_BASELINE_COMMIT:\s*BOOTSTRAP/);
  const m=yml.match(/DTS_LOCK_BASELINE_COMMIT:\s*([0-9a-f]{40})/);
  assert.ok(m,'immutable baseline SHA missing');
  assert.notEqual(m[1],'0'.repeat(40));
});

test('workflow has a fast gate and full jobs depend on its scope output without cancelling prior runs',()=>{
  const yml=fs.readFileSync('.github/workflows/check.yml','utf8');
  assert.match(yml,/fast-gate:/);
  assert.match(yml,/id:\s*scope/);
  assert.match(yml,/node scripts\/ci-scope-v11920\.cjs/);
  assert.match(yml,/node scripts\/check-docs-fast-v11920\.cjs/);
  assert.match(yml,/validate-and-package:[\s\S]*needs:\s*fast-gate[\s\S]*if:\s*needs\.fast-gate\.outputs\.full == 'true'/);
  assert.match(yml,/windows-launcher-smoke:[\s\S]*needs:\s*fast-gate[\s\S]*if:\s*needs\.fast-gate\.outputs\.full == 'true'/);
  assert.match(yml,/cancel-in-progress:\s*false/);
});
