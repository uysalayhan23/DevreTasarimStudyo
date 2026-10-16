'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
for(const id of ['electronic-switching-src-14','electronic-switching-src-16'])test(id+' NC STOP physical 21/22 pins and truthful legend',()=>{
 const l=L.byId[id],p=l.project,sp=p.components.find(c=>c.id==='sp');
 assert.equal(sp.typeId,'push-nc');
 assert.equal(Array.from(defs[sp.typeId].pins,p=>p.id).join(','),'21,22');
 assert.ok(p.wires.some(w=>w.from.c==='g1'&&w.from.p==='P'&&w.to.c==='sp'&&w.to.p==='21'));
 assert.ok(p.wires.some(w=>w.from.c==='sp'&&w.from.p==='22'&&w.to.c==='h1'&&w.to.p==='X1'));
 assert.equal(p.wires.some(w=>(w.from.c==='sp'||w.to.c==='sp')&&(w.from.p==='11'||w.from.p==='12'||w.to.p==='11'||w.to.p==='12')),false);
 assert.match(l.explanation,/SP\/21–22/);
});
test('SC16 DC TRIAC recognizes canonical STOP and requires retrigger after STOP',()=>{
 const p=structuredClone(L.byId['electronic-switching-src-16'].project),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 c.sg.state=true;c.sp.state=false;
 let r=Native.solveSc16DcCycle(p,defs,{now:100});assert.equal(r.verified,true);assert.equal(c.q1._triacLatched,true);
 c.sg.state=false;r=Native.solveSc16DcCycle(p,defs,{now:200});assert.equal(r.verified,true);assert.equal(c.h1._active,true);
 c.sp.state=true;r=Native.solveSc16DcCycle(p,defs,{now:300});assert.equal(r.verified,true);assert.equal(c.q1._triacLatched,false);
 c.sp.state=false;r=Native.solveSc16DcCycle(p,defs,{now:400});assert.equal(r.verified,true);assert.equal(c.h1._active,false);
});
test('whole 1655 source catalogue has no invalid terminal endpoints',()=>{
 const a=QA.audit();assert.equal(a.total,1655);
 assert.equal(a.invalidWireEndpoints.length,0);
 assert.equal(a.missingDefinitions.length,0);
 assert.equal(a.errors.length,0);
 // No full PASS asserted: other pedagogical-review counters remain independently open.
});
