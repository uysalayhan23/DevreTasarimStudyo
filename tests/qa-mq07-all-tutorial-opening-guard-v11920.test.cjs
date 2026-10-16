'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const source=fs.readFileSync(path.join(__dirname,'../dist/tutorial-mode.js'),'utf8');
const start=source.indexOf('function cleanProject(l){');
const end=source.indexOf('\nasync function open(id){',start);
assert.ok(start>=0&&end>start,'actual tutorial open guard is available');
const context={clone:x=>JSON.parse(JSON.stringify(x))};vm.createContext(context);
vm.runInContext(source.slice(start,end),context);
test('MQ-12 all 1655 tutorial projects pass actual checkedLessonProject source gate',()=>{
 const L=QA.curriculum();assert.equal(L.lessons.length,1655);
 for(const lesson of L.lessons){
  let p;
  assert.doesNotThrow(()=>{p=context.checkedLessonProject(lesson)},'open '+lesson.id);
  assert.equal(p.tutorialLesson.id,lesson.id);
  assert.equal(p.projectId,'tutorial-session-'+lesson.id);
 }
});
for(const [id,type] of [['electronic-switching-src-16','bta16-600b-triac'],['opamp-apps-src-13','lm358p-dip8'],['opamp-apps-src-14','lm358p-dip8']]){
 test(id+' opening guard rejects missing canonical device',()=>{
  const lesson=JSON.parse(JSON.stringify(QA.curriculum().byId[id]));
  lesson.project.components=lesson.project.components.filter(x=>x.typeId!==type);
  assert.throws(()=>context.checkedLessonProject(lesson));
 });
}
