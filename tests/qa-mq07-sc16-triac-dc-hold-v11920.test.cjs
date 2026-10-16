'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['electronic-switching-src-16'];
const clone=x=>JSON.parse(JSON.stringify(x));
const c=(p,id)=>p.components.find(x=>x.id===id);
function frame(p,gate=false,stop=false){
 c(p,'sg').state=gate;c(p,'sp').state=stop;
 const result=Native.solveSc16DcCycle(p,defs,{now:1000});
 assert.equal(result.result.stable,true);
 assert.equal(result.result.shortCircuit,false);
 assert.equal(result.result.blocked,false);
 return {verified:result.verified,gateWired:result.gateWired,lamp:!!c(p,'h1')._active,
  current:result.currentA,gateV:result.gateV,latch:!!c(p,'q1')._triacLatched};
}
function cut(p,a,ap,b,bp){
 p.wires=p.wires.filter(w=>!(w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
}

test('SC16 uses real named BTA16 MT1/MT2/G, insulated front and seven electrical wires',()=>{
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project,triac=c(p,'q1'),def=defs[triac.typeId];
 assert.equal(triac.typeId,'bta16-600b-triac');
 assert.equal(def.kind,'triac');
 assert.deepEqual(Array.from(def.pins,p=>p.id),['MT1','MT2','G']);
 assert.deepEqual(Array.from(def.pins,p=>p.physicalPin),[1,2,3]);
 assert.equal(def.realPackage.type,'TO-220AB Insulated');
 assert.equal(def.manufacturerGeometryAccepted,false);
 assert.equal(p.wires.length,7);
 assert.equal(c(p,'sg').typeId,'push-no');
 assert.equal(c(p,'sp').typeId,'push-nc');
 assert.equal(triac.mq07DcTriacLesson,true);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.virtualDcBehavior.acBidirectionalVerified,false);
 for(const part of p.components)assert.ok(defs[part.typeId],part.typeId);
 for(const wire of p.wires)for(const end of [wire.from,wire.to]){
  assert.ok(defs[c(p,end.c).typeId].pins.some(pin=>pin.id===end.p),end.c+'/'+end.p);
 }
});

test('BTA16 insulated TO-220AB front uses correct names without motor mechanics',()=>{
 const Materials=require('../dist/materials.js');
 const html=Materials.markup(defs['bta16-600b-triac'],{id:'q1'});
 assert.match(html,/data-real-package="TO-220AB-INSULATED"/);
 assert.match(html,/data-front-view="orthographic"/);
 assert.match(html,/BTA16/);
 for(const pin of ['MT1','MT2','G'])assert.ok(html.includes('>'+pin+'</text>'),pin);
 assert.ok(!/SHAFT|motion-indicator/i.test(html));
});
test('SC16 DC gate pulse latches current through the load after release',()=>{
 const p=clone(lesson.project);
 let r=frame(p,false,false);
 assert.equal(r.verified,true);
 assert.deepEqual([r.lamp,r.latch,r.current],[false,false,0]);
 r=frame(p,true,false);
 assert.deepEqual([r.lamp,r.latch,r.current],[true,true,.1]);
 assert.equal(r.gateV,12);
 r=frame(p,false,false);
 assert.equal(r.gateV,0);
 assert.equal(r.lamp,true);
 assert.equal(r.latch,true);
 assert.equal(r.current,.1);
});

test('SC16 STOP interrupts the DC main current and requires a fresh SG pulse',()=>{
 const p=clone(lesson.project);
 frame(p,true,false);frame(p,false,false);
 let r=frame(p,false,true);
 assert.deepEqual([r.lamp,r.latch,r.current],[false,false,0]);
 r=frame(p,false,false);
 assert.deepEqual([r.lamp,r.latch,r.current],[false,false,0]);
 r=frame(p,true,false);
 assert.equal(r.lamp,true);
 assert.equal(r.latch,true);
 r=frame(p,true,true);
 assert.equal(r.latch,false);
 assert.equal(frame(p,true,false).latch,true,'gate held through STOP is a new trigger');
});

test('SC16 disconnecting gate prevents firing but cannot unlatch an already-on DC TRIAC',()=>{
 const gateWires=[['g1','P','sg','13'],['sg','14','rg','1'],['rg','2','q1','G']];
 for(const [a,ap,b,bp] of gateWires){
  const fresh=clone(lesson.project);
  cut(fresh,a,ap,b,bp);
  const off=frame(fresh,true,false);
  assert.equal(off.verified,false);
  assert.equal(off.lamp,false);
  const on=clone(lesson.project);
  frame(on,true,false);frame(on,false,false);
  cut(on,a,ap,b,bp);
  const kept=frame(on,false,false);
  assert.equal(kept.gateWired,false);
  assert.equal(kept.lamp,true,'gate removal after latching: '+a+'/'+ap);
  assert.equal(kept.latch,true);
 }
});

test('SC16 power supply, STOP, load, MT1/MT2 cuts release the DC latch',()=>{
 const powerWires=[['g1','P','sp','21'],['sp','22','h1','X1'],
  ['h1','X2','q1','MT2'],['q1','MT1','g1','M']];
 for(const [a,ap,b,bp] of powerWires){
  const p=clone(lesson.project);
  frame(p,true,false);frame(p,false,false);
  const wires=clone(p.wires);
  cut(p,a,ap,b,bp);
  let state=frame(p,false,false);
  assert.equal(state.latch,false,a+'/'+ap+' > '+b+'/'+bp);
  assert.equal(state.lamp,false);
  assert.equal(state.current,0);
  p.wires=wires;
  state=frame(p,false,false);
  assert.equal(state.lamp,false,'no spontaneous reset to ON when reconnected');
  assert.equal(frame(p,true,false).lamp,true);
 }
});

test('SC16 virtual holding-current gate is not a manufacturer-certified rating',()=>{
 const p=clone(lesson.project);
 c(p,'h1').resistance=1000; // 12/1000 = 12 mA below virtual 30 mA threshold.
 const r=frame(p,true,false);
 assert.equal(r.verified,true);
 assert.equal(r.lamp,false);
 assert.equal(r.latch,false);
 assert.equal(frame(p,false,false).lamp,false);
});
test('SC16 invalid DC settings and reset fail closed',()=>{
 const edits=[
  p=>c(p,'g1').dcVoltage='12',p=>c(p,'g1').dcVoltage=230,
  p=>c(p,'h1').resistance=0,p=>c(p,'rg').resistance=0,
  p=>c(p,'q1').mq07VirtualHoldingCurrentA=-1
 ];
 for(const edit of edits){const p=clone(lesson.project);edit(p);
  const r=frame(p,true,false);
  assert.equal(r.verified,false);
  assert.equal(r.lamp,false);
 }
 const p=clone(lesson.project);
 frame(p,true,false);frame(p,false,false);
 Native.clear(p);
 assert.equal(c(p,'q1')._triacLatched,undefined);
 assert.equal(c(p,'h1')._sc16CurrentA,undefined);
 assert.equal(frame(p,false,false).lamp,false);
});
