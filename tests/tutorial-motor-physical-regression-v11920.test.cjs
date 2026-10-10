'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const L=require('../dist/tutorial-lessons.js');
const S=require('../dist/simulation.js');
const dir=path.join(__dirname,'../dist');
function library(){
 const vm=require('node:vm'),ctx={window:{}};
 for(const n of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js']){
  vm.runInNewContext(fs.readFileSync(path.join(dir,n),'utf8'),ctx);
 }
 return Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
}
const lesson=(topic,n)=>structuredClone(L.byId[topic+'-'+n].project);
const has=(p,from,fp,to,tp)=>p.wires.some(w=>w.from.c===from&&w.from.p===fp&&w.to.c===to&&w.to.p===tp);
test('forward/reverse: STOP ahead of both coils, cross NC behind STOP, seal-in and opposite phase sequence',()=>{
 for(let n=1;n<=4;n++){
  const p=lesson('motor-forward-reverse',n);
  for(const [a,ap,b,bp] of [
   ['g1','L1','stop','21'],['stop','22','lockR','21'],['stop','22','lockF','21'],
   ['lockR','22','startF','13'],['lockR','22','holdF','13'],['startF','14','coilF','A1'],['holdF','14','coilF','A1'],
   ['lockF','22','startR','13'],['lockF','22','holdR','13'],['startR','14','coilR','A1'],['holdR','14','coilR','A1'],
   ['coilF','A2','g1','N'],['coilR','A2','g1','N']
  ])assert.ok(has(p,a,ap,b,bp),n+' '+a+'/'+ap+' '+b+'/'+bp);
  assert.equal(p.components.find(c=>c.id==='lockR').ref,'K2');
  assert.equal(p.components.find(c=>c.id==='lockF').ref,'K1');
  assert.deepEqual(['U','V','W'].map(x=>p.wires.find(w=>w.from.c==='mainF'&&w.to.c==='motor'&&w.to.p===x)?.from.p),['2','4','6']);
  const reverse=['2','4','6'].map(out=>p.wires.find(w=>w.from.c==='mainR'&&w.from.p===out&&w.to.c==='motor')?.to.p);
  assert.deepEqual(reverse,n<=2?['W','V','U']:['V','U','W']);
  assert.ok(has(p,'g1','PE','motor','PE'));
 }
});
test('star/delta: timer, mutual NC interlocks and three correct cross-winding delta connections',()=>{
 for(let n=2;n<=4;n++){
  const p=lesson('motor-star-delta',n);
  for(const [a,ap,b,bp] of [
   ['stop','22','start','13'],['stop','22','hold','13'],['coilMain','A1','timer','A1'],
   ['timerNC','22','lockDelta','21'],['lockDelta','22','coilStar','A1'],
   ['timerNO','14','lockStar','21'],['lockStar','22','coilDelta','A1'],
   ['star','2','star','4'],['star','4','star','6'],
   ['delta','2','motor','W2'],['delta','4','motor','U2'],['delta','6','motor','V2'],
   ['g1','PE','motor','PE']
  ])assert.ok(has(p,a,ap,b,bp),n+' '+a+'/'+ap+' '+b+'/'+bp);
  assert.equal(p.components.find(c=>c.id==='lockDelta').ref,'K3');
  assert.equal(p.components.find(c=>c.id==='lockStar').ref,'K2');
  assert.equal(p.components.find(c=>c.id==='timer').delayValue,[0,2,4,6][n-1]);
 }
});
test('four forward/reverse canonical projects are structurally preserved and solver reports no short circuit at rest',()=>{
 const defs=library();
 for(let n=1;n<=4;n++){
  const p=lesson('motor-forward-reverse',n),res=S.solve(p,defs,{now:0});
  assert.equal(res.shortCircuit,false,'forward/reverse '+n);
  assert.equal(res.blocked,false,'forward/reverse '+n);
 }
});
test('all star/delta canonical projects have nonshorted rest-state solver',()=>{
 const defs=library();
 for(let n=1;n<=4;n++){
  const p=lesson('motor-star-delta',n),res=S.solve(p,defs,{now:0});
  assert.equal(res.shortCircuit,false,'star/delta '+n);
  assert.equal(res.blocked,false,'star/delta '+n);
 }
});

test('forward/reverse sequential START release STOP and opposite START: never energize opposing coils together',()=>{
 const defs=library();
 for(let n=1;n<=4;n++){
  const p=lesson('motor-forward-reverse',n);
  const byId=Object.fromEntries(p.components.map(c=>[c.id,c]));
  const steps=[
   [false,false,false,'rest'],
   [true,false,false,'forward-start'],
   [false,false,false,'forward-held'],
   [false,false,true,'stop-forward'],
   [false,true,false,'reverse-start'],
   [false,false,false,'reverse-held'],
   [false,false,true,'stop-reverse']
  ];
  for(let i=0;i<steps.length;i++){
   const [f,r,stop,name]=steps[i];
   byId.startF.state=f;byId.startR.state=r;byId.stop.state=stop;
   const result=S.solve(p,defs,{now:i*300+100});
   assert.equal(result.blocked,false,n+' '+name);
   assert.equal(result.shortCircuit,false,n+' '+name);
   assert.equal(!!byId.coilF._active&&!!byId.coilR._active,false,n+' both coils energized '+name);
  }
 }
});
test('automatic star/delta transition: K2 and K3 coils are mutually exclusive around timing boundary and STOP',()=>{
 const defs=library();
 for(let n=2;n<=4;n++){
  const p=lesson('motor-star-delta',n),byId=Object.fromEntries(p.components.map(c=>[c.id,c]));
  const delay=byId.timer.delayValue*1000;
  for(const [now,start,stop,phase] of [[0,false,false,'rest'],[100,true,false,'start'],[300,false,false,'latched'],[delay-1,false,false,'before'],[delay+100,false,false,'after'],[delay+300,false,true,'stop']]){
   byId.start.state=start;byId.stop.state=stop;
   const result=S.solve(p,defs,{now});
   assert.equal(result.shortCircuit,false,n+' '+phase);
   assert.equal(result.blocked,false,n+' '+phase);
   assert.equal(!!byId.coilStar._active&&!!byId.coilDelta._active,false,n+' K2/K3 overlap at '+phase);
  }
 }
});
