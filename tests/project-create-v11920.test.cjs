const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('P2-002 new project button delegates to the single DTSEditor.create controller and never recreates schema v6 inline',()=>{
  const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
  const handler=app.match(/\$\('#newBtn'\)\.onclick=\(\)=>modal\([\s\S]{0,900}?toast\('Yeni proje açıldı'\)\}\);/);
  assert.ok(handler,'newBtn handler');
  assert.match(handler[0],/window\.DTSEditor\.create\(mode/);
  assert.doesNotMatch(handler[0],/version\s*:\s*6/);
  assert.match(app,/create\(mode,name\)[\s\S]{0,700}?version:7/);
  assert.equal((app.match(/\$\('#newBtn'\)\.onclick/g)||[]).length,1);
});
