'use strict';
// Historical "reference only" tests must not erase later terminalized two-BD139 lessons.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[
 ['SC58','oscillator-filter-apps-src-06','tek kararlı',21,1],
 ['SC59','oscillator-filter-apps-src-07','çift kararlı',20,0],
 ['SC60','oscillator-filter-apps-src-08','kararsız',14,2]
];
for(const [sc,id,term,wires,capacitors] of rows)test(sc+' original two-BD139 graph stays wired; physical acceptance remains pending',()=>{
 const lesson=L.byId[id],p=lesson?.project;
 assert.ok(lesson&&p);assert.ok(lesson.title.toLocaleLowerCase('tr-TR').includes(term));
 assert.equal(lesson.kind,'wiring');assert.equal(p.referenceOnly===true,false);
 assert.equal(p.wires.length,wires);assert.equal(lesson.steps.length,wires);
 assert.equal(p.components.filter(c=>c.typeId==='bd139-npn').length,2);
 assert.equal(p.components.filter(c=>c.typeId==='capacitor').length,capacitors);
 assert.ok(p.components.some(c=>c.typeId==='arduino-bench-supply'));
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 for(const w of p.wires)for(const e of [w.from,w.to]){
  const c=p.components.find(x=>x.id===e.c),d=defs[c?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===e.p),id+' '+e.c+'/'+e.p);
 }
 assert.equal(lesson.pedagogyReview?.physicalAcceptance,false);
 assert.notEqual(lesson.pedagogyReview?.nativeDynamicAcceptance,true);
 assert.notEqual(lesson.pedagogyReview?.windowsVisualAcceptance,true);
});
