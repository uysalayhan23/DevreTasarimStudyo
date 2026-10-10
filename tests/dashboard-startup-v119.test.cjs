const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('library card handlers use the multi-element selector',()=>{
  const app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
  const bad="    $('.component-card').forEach(";
  const good="    $$('.component-card').forEach";
  assert.equal(app.split(bad).length-1,0);
  assert.equal(app.split(good).length-1,2);
});
test('editor export remains present for studio dashboard binding',()=>{
  const app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
  assert.ok(app.includes('window.DTSEditor={'));
});
