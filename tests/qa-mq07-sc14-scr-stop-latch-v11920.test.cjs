'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const curriculum=QA.curriculum(),byId=QA.catalog();
const lesson=curriculum.byId['electronic-switching-src-14'];
const clone=x=>JSON.parse(JSON.stringify(x));
const part=(p,id)=>p.components.find(c=>c.id===id);
function frame(p,gate=false,stop=false){
 part(p,'sg').state=gate;
 part(p,'sp').state=stop;
 const r=Solver.solve(p,byId,{now:1000});
 assert.equal(r.stable,true);
 assert.equal(r.blocked,false);
 assert.equal(r.shortCircuit,false);
 const q=part(p,'q1'),h=part(p,'h1');
 return {gate:!!gate,stop:!!stop,scr:!!q._thyristorOn,latch:!!q._scrLatched,lamp:!!h._active,
  gateV:q._scrGateVoltage,holdingA:q._scrHoldingCurrentA};
}

test('SC14 physical TYN612RG with independent gate and STOP contacts',()=>{
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project,q=part(p,'q1'),d=byId[q.typeId];
 assert.equal(q.typeId,'tyn612rg-scr');
 assert.equal(q.mq07ScrHoldLesson,true);
 assert.equal(d.kind,'scr');
 assert.ok(Number(d.holdingCurrent)>0);
 assert.equal(p.wires.length,7);
 assert.equal(part(p,'sg').typeId,'push-no');
 assert.equal(part(p,'sp').typeId,'push-nc');
 for(const pin of ['G','A','K'])assert.ok(d.pins.some(x=>x.id===pin));
 for(const w of p.wires)for(const endpoint of [w.from,w.to]){
  const component=part(p,endpoint.c);
  assert.ok(component,endpoint.c);
  assert.ok(byId[component.typeId].pins.some(x=>x.id===endpoint.p),endpoint.c+'/'+endpoint.p);
 }
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
});

test('SC14 gate pulse holds; STOP releases and requires new gate pulse',()=>{
 const p=clone(lesson.project);
 let x=frame(p,false,false);
 assert.deepEqual([x.lamp,x.latch],[false,false]);
 x=frame(p,true,false);
 assert.deepEqual([x.lamp,x.latch],[true,true]);
 assert.ok(x.gateV>=0.7);
 assert.ok(x.holdingA>=byId[part(p,'q1').typeId].holdingCurrent);
 x=frame(p,false,false);
 assert.equal(x.gateV,0);
 assert.deepEqual([x.lamp,x.latch],[true,true]);
 x=frame(p,false,true);
 assert.deepEqual([x.lamp,x.latch],[false,false]);
 x=frame(p,false,false);
 assert.deepEqual([x.lamp,x.latch],[false,false]);
 x=frame(p,true,false);
 assert.deepEqual([x.lamp,x.latch],[true,true]);
});

test('SC14 removing the gate wire does not stop an already latched SCR',()=>{
 const p=clone(lesson.project);
 frame(p,true,false);frame(p,false,false);
 p.wires=p.wires.filter(w=>!(w.from.c==='rg'&&w.from.p==='2'&&w.to.c==='q1'&&w.to.p==='G'));
 const x=frame(p,false,false);
 assert.equal(x.gateV,0);
 assert.equal(x.lamp,true);
 assert.equal(x.latch,true);
});

test('SC14 removing DC anode or cathode path releases SCR latch, no automatic restart',()=>{
 for(const [a,ap,b,bp] of [
  ['g1','P','sp','11'],['sp','12','h1','X1'],
  ['h1','X2','q1','A'],['q1','K','g1','M']
 ]){
  const p=clone(lesson.project);
  frame(p,true,false);frame(p,false,false);
  const wires=clone(p.wires);
  p.wires=p.wires.filter(w=>!(w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  let x=frame(p,false,false);
  assert.deepEqual([x.lamp,x.latch],[false,false],a+'/'+ap+' → '+b+'/'+bp);
  p.wires=wires;
  x=frame(p,false,false);
  assert.deepEqual([x.lamp,x.latch],[false,false],a+'/'+ap+' reconnected');
  assert.equal(frame(p,true,false).lamp,true);
 }
});

test('SC14 insufficient holding load current or solver reset prevents spontaneous restart',()=>{
 const p=clone(lesson.project);
 part(p,'h1').resistance=1000;
 const gate=frame(p,true,false);
 assert.equal(gate.latch,false,'current below virtual holding threshold');
 assert.equal(frame(p,false,false).lamp,false);
 const original=clone(lesson.project);
 frame(original,true,false);frame(original,false,false);
 Solver.clear(original);
 assert.equal(part(original,'q1')._scrLatched,undefined);
 assert.equal(frame(original,false,false).lamp,false);
});

test('SC14 STOP is a power interrupter, not a fake gate-OFF command',()=>{
 const p=clone(lesson.project);
 frame(p,true,false);
 const x=frame(p,true,true);
 assert.equal(x.lamp,false);
 assert.equal(x.latch,false);
 // Holding the gate while the STOP contact is restored is an intentional new trigger.
 assert.equal(frame(p,true,false).lamp,true);
});
