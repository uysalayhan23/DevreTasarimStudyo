'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const text=fs.readFileSync(path.join(__dirname,'../dist/tutorial-mode.js'),'utf8');
const begin=text.indexOf('function checkedLessonProject(l){'),end=text.indexOf('\nasync function open(id){',begin);
assert.ok(begin>=0&&end>begin,'actual lesson-open guard must exist');
const make=vm.runInNewContext('(function(clone){return '+text.slice(begin,end)+';})')((x)=>JSON.parse(JSON.stringify(x)));
const curriculum=QA.curriculum();
test('SC48/SC49 canonical LM358 DIP8 RC lessons pass actual opening gate',()=>{
 for(const id of ['opamp-apps-src-13','opamp-apps-src-14']){
  const l=curriculum.byId[id];
  assert.ok(l);
  const p=make(l);
  assert.equal(p.tutorialLesson.id,id);
  assert.ok(p.components.some(c=>c.typeId==='lm358p-dip8'));
  assert.ok(p.components.some(c=>c.typeId==='capacitor'));
  assert.ok(p.wires.length>0);
 }
});
test('SC48 guard still rejects unrelated no-LM358 project',()=>{
 const bad=JSON.parse(JSON.stringify(curriculum.byId['opamp-apps-src-13']));
 bad.project.components=bad.project.components.filter(c=>c.typeId!=='lm358p-dip8');
 assert.throws(()=>make(bad),/gerçek LM358\/R-C devresi bulunamadı/);
});
