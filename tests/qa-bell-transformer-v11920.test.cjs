'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {audit}=require('../scripts/qa-bell-transformer-v11920.cjs');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const fs=require('node:fs'),path=require('node:path');
test('every present bell teaching circuit uses isolated virtual 12VAC transformer',()=>{
 const result=audit();assert.equal(result.status,'PASS',JSON.stringify(result.issues));
 assert.ok(result.count>=6);assert.equal(result.phasePasses,result.phaseChecks);
 assert.ok(result.lessonIds.includes('bells-4'));
 assert.equal(result.physicalAcceptance,false);assert.equal(result.windowsAcceptance,'NOT_RUN');
});
test('four canonical variations and three-call installation lesson have authentic buttons and cable returns',()=>{
 const L=QA.curriculum();
 for(let n=1;n<=4;n++){const p=L.byId['bells-'+n].project;
  assert.equal(p.components.filter(c=>['bell-push','bell-light-push'].includes(c.typeId)).length,n);
  assert.equal(p.wires.length,2*n+1);
  assert.ok(!p.components.some(c=>c.typeId==='supply-1p'))}
 const three=L.byId['installation-systems-src-06'];
 assert.equal(three.project.components.filter(c=>c.typeId==='bell-push').length,3);
 assert.equal(three.project.wires.length,7);
 assert.match(three.explanation,/B2 ve B3/);
});
test('legacy mains bell cannot run without transformer, and warning is explicit',()=>{
 const L=QA.curriculum(),defs=QA.catalog();
 const p=JSON.parse(JSON.stringify(L.byId['bells-1'].project));
 const tr=p.components.find(c=>c.typeId==='bell-transformer');tr.typeId='supply-1p';
 for(const w of p.wires)for(const r of [w.from,w.to])if(r.c===tr.id){if(r.p==='S1')r.p='L';if(r.p==='S2')r.p='N'}
 p.components.find(c=>c.id==='b0').state=true;
 const s=Simulation.solve(p,defs,{now:1000});
 assert.equal(s.blocked,true);assert.equal(s.reason,'bell-transformer-required');
 assert.match(s.safetyWarning,/zil trafosu gereklidir/i);
 const fake={lessons:[{id:'bad-bell',project:p}]};
 const bad=audit({L:fake,defs});
 assert.equal(bad.status,'FAIL');
 assert.ok(bad.issues.some(x=>x.code==='TRAFO_REQUIRED'));
 assert.ok(bad.issues.some(x=>x.code==='DIRECT_MAINS_FORBIDDEN'));
});
test('manifest is locked and explains internal non-wireable primary',()=>{
 const f=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/BELL_TRANSFORMER_MODEL_LOCKED.json'),'utf8'));
 assert.equal(f.locked,true);assert.equal(f.educationalModel.secondary.rmsVoltage,12);
 assert.equal(f.educationalModel.primary.includes('no externally wireable mains'),true);
 assert.equal(f.rejected.directMainsPhaseToBell,true);
});
