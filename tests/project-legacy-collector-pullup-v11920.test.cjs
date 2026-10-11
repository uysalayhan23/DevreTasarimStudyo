'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Projects=require('../dist/project-store.js');
const Lessons=require('../dist/tutorial-lessons.js');
const project=()=>structuredClone(Lessons.byId['open-collector-3'].project);
const old=()=>{
 const p=project(),resistor=p.components.find(c=>c.id==='r');
 assert.equal(resistor.resistance,10000);
 resistor.resistance=1000;
 const branch=p.wires.find(w=>w.to?.c==='r'&&w.to?.p==='1');
 assert.ok(branch);branch.from={c:'g1',p:'P'};
 return p;
};
test('legacy 1k PNP pull-up is detected but the new 10k pull-down is not',()=>{
 const previous=old(),correct=project(),before=JSON.stringify(previous);
 assert.equal(Projects.legacyCollectorPullup(previous),true);
 const warnings=Projects.compatibilityWarnings(previous);
 assert.equal(warnings.length,1);
 assert.equal(warnings[0].code,'MQ-P1-016-LEGACY-PNP-PULLUP');
 assert.match(warnings[0].message,/Kaydınız değiştirilmedi/);
 assert.match(warnings[0].message,/Open Collector/);
 assert.equal(JSON.stringify(previous),before,'read-only diagnostic must not modify saved circuits');
 assert.equal(Projects.legacyCollectorPullup(correct),false);
 assert.deepEqual(Projects.compatibilityWarnings(correct),[]);
});
test('legacy detection is orientation-neutral and limited to complete electrical topology',()=>{
 const p=old();
 for(const w of p.wires){const tmp=w.from;w.from=w.to;w.to=tmp}
 assert.equal(Projects.legacyCollectorPullup(p),true,'wire direction must not alter warning');
 p.components.find(c=>c.id==='s').typeId='autonics-pr12-npn';
 assert.equal(Projects.legacyCollectorPullup(p),false,'different sensor is not old PNP');
 const other=old();
 other.wires=other.wires.filter(w=>!(w.from.c==='h'&&w.from.p==='X2'));
 assert.equal(Projects.legacyCollectorPullup(other),false,'unrelated incomplete circuit must not trigger');
 for(const x of [null,{},[],{components:[],wires:[]}]){
  assert.equal(Projects.legacyCollectorPullup(x),false);
  assert.deepEqual(Projects.compatibilityWarnings(x),[]);
 }
});
test('legacy imported project schema is preserved, without implicit connection migrations',()=>{
 const p=old(),before=JSON.stringify(p);
 const migrated=Projects.parse(before);
 assert.equal(Projects.legacyCollectorPullup(migrated),true);
 assert.equal(migrated.components.find(c=>c.id==='r').resistance,1000);
 assert.ok(migrated.wires.some(w=>w.from.c==='g1'&&w.from.p==='P'&&w.to.c==='r'&&w.to.p==='1'));
 assert.equal(JSON.stringify(p),before);
 assert.equal(JSON.stringify(Projects.clean(migrated)),before);
});
test('studio warns on project load without silently changing connections or bypassing editor',()=>{
 const studio=fs.readFileSync(path.resolve(__dirname,'../dist/studio.js'),'utf8');
 assert.match(studio,/function showLegacyCircuitWarning\(project\)/);
 assert.match(studio,/Projects\.compatibilityWarnings\?\.\(project\)/);
 assert.match(studio,/body\.textContent=found\[0\]\.message/);
 assert.match(studio,/showEditor\(\);[\s\S]*?showLegacyCircuitWarning\(project\)/);
 const notice=studio.slice(studio.indexOf('function showLegacyCircuitWarning('),studio.indexOf('function load(project)',studio.indexOf('function showLegacyCircuitWarning(')));
 assert.doesNotMatch(notice,/\.wires\s*=|\.components\s*=|resistance\s*=|E\.load/);
});
