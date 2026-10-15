'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['electronic-switching-src-15'];
const clone=x=>JSON.parse(JSON.stringify(x));
const comp=(p,id)=>p.components.find(x=>x.id===id);
function sample(project,deg){
 // 50 Hz: 360 degrees / 20 ms = 18 degrees/ms
 return Native.solveSc15AcCycle(project,defs,{now:deg/(Number(comp(project,'ac1').frequencyHz)*.36)});
}
test('SC15 uses a low-voltage virtual AC source, a distinct phase trigger and TYN612RG SCR',()=>{
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project;
 assert.equal(p.wires.length,7);
 assert.equal(comp(p,'ac1').typeId,'virtual-isolated-ac-12v');
 assert.equal(comp(p,'trg1').typeId,'virtual-ac-scr-trigger-v1');
 assert.equal(comp(p,'q1').typeId,'tyn612rg-scr');
 assert.equal(comp(p,'ac1').rmsVoltage,12);
 assert.equal(comp(p,'ac1').frequencyHz,50);
 assert.equal(comp(p,'trg1').triggerAngleDeg,90);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 for(const item of p.components){
  const d=defs[item.typeId];
  assert.ok(d,'missing catalog '+item.typeId);
  for(const pin of d.pins)assert.equal(typeof pin.id,'string');
 }
 for(const wire of p.wires){
  for(const end of [wire.from,wire.to]){
   const c=comp(p,end.c);assert.ok(c,end.c);
   assert.ok(defs[c.typeId].pins.some(pin=>pin.id===end.p),end.c+'/'+end.p);
  }
 }
 const source=defs['virtual-isolated-ac-12v'],trigger=defs['virtual-ac-scr-trigger-v1'];
 assert.equal(source.kind,'ac-virtual-source');
 assert.equal(trigger.kind,'ac-scr-trigger');
 assert.deepEqual(Array.from(source.pins,p=>p.id),['AC','RET']);
 assert.deepEqual(Array.from(trigger.pins,p=>p.id),['AC','RET','OUT']);
 assert.equal(trigger.realPackage,null);
});

test('SC15 90° trigger creates positive SCR half-wave and commutates at zero crossing',()=>{
 const p=clone(lesson.project);
 for(const deg of [0,45,89]){
  const r=sample(p,deg);
  assert.equal(r.result.stable,true);
  assert.equal(r.result.shortCircuit,false);
  assert.equal(r.verified,true);
  assert.equal(r.loadV,0,'no conduction before phase trigger: '+deg);
 }
 const pulse=sample(p,90);
 assert.equal(pulse.gateV,5);
 assert.ok(pulse.loadV>0);
 assert.ok(pulse.currentA>0);
 const after=sample(p,120);
 assert.equal(after.gateV,0);
 assert.ok(after.loadV>0,'latch holds after gate pulse');
 for(const deg of [180,225,270,359]){
  const r=sample(p,deg);
  assert.equal(r.loadV,0,'negative half-wave must not conduct');
  assert.equal(r.currentA,0);
  assert.equal(comp(p,'q1')._thyristorOn,false);
 }
 const zero=sample(p,180);
 assert.equal(zero.zeroCrossing,true);
 const next=sample(p,450);
 assert.ok(next.loadV>0,'next positive half needs repeated synchronized gate pulse');
});
test('SC15 phase angle controls computed load RMS without fabricated electrical values',()=>{
 const p=clone(lesson.project),rms=[];
 for(const alpha of [0,45,90,135,170]){
  comp(p,'trg1').triggerAngleDeg=alpha;
  const result=sample(p,120);
  assert.equal(result.verified,true);
  rms.push(result.rmsV);
 }
 assert.ok(rms[0]>rms[1]);
 assert.ok(rms[1]>rms[2]);
 assert.ok(rms[2]>rms[3]);
 assert.ok(rms[3]>=rms[4]);
 assert.ok(rms[0]>0&&rms[0]<12,'single SCR half-wave cannot exceed source RMS');
 assert.equal(rms[4],0,'170° late trigger below holding current threshold');
});
test('SC15 disconnected electrical AC, reference, gate or load path fails closed',()=>{
 const wires=[['ac1','AC','h1','X1'],['h1','X2','q1','A'],['q1','K','ac1','RET'],
              ['ac1','AC','trg1','AC'],['ac1','RET','trg1','RET'],
              ['trg1','OUT','rg','1'],['rg','2','q1','G']];
 for(const [a,ap,b,bp] of wires){
  const p=clone(lesson.project);
  p.wires=p.wires.filter(w=>!(w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  const r=sample(p,120);
  assert.equal(r.verified,false,a+'/'+ap+' > '+b+'/'+bp);
  assert.equal(r.rmsV,0);
  assert.equal(comp(p,'h1')._active,false);
 }
});
test('SC15 invalid supply, angle, disabled trigger and disconnected phase are not accepted',()=>{
 const invalid=[
  p=>comp(p,'ac1').sourceEnabled=false,
  p=>comp(p,'trg1').triggerEnabled=false,
  p=>comp(p,'trg1').triggerAngleDeg=200,
  p=>comp(p,'trg1').triggerAngleDeg='90',
  p=>comp(p,'trg1').pulseWidthDeg=0,
  p=>comp(p,'ac1').rmsVoltage=230,
  p=>comp(p,'ac1').frequencyHz=0,
  p=>comp(p,'h1').resistance=0
 ];
 for(const change of invalid){const p=clone(lesson.project);change(p);const r=sample(p,120);
  assert.equal(r.verified,false);
  assert.equal(r.rmsV,0);
 }
});
test('SC15 STOP/clear resets transient phase and SCR waveform state',()=>{
 const p=clone(lesson.project);
 sample(p,90);
 assert.ok(comp(p,'trg1')._sc15Wave?.length);
 Native.clear(p);
 assert.equal(comp(p,'trg1')._sc15Wave,undefined);
 assert.equal(comp(p,'h1')._sc15OutputRmsV,undefined);
 assert.equal(comp(p,'q1')._sc15CurrentA,undefined);
});
