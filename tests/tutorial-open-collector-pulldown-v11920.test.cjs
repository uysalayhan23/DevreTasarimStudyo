'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
const L=require('../dist/tutorial-lessons.js');
const Simulation=require('../dist/simulation.js');

function definitions(){
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'dist/library.js'),'utf8'),context,{filename:'dist/library.js'});
 const items=context.window.COMPONENT_LIBRARY;
 assert.ok(Array.isArray(items)&&items.length>500,'Use actual product library, not mock components');
 const byId=Object.fromEntries(items.map(d=>[d.id,d]));
 for(const id of ['proximity','autonics-pr12-npn','supply-dc-plus','lamp-green','resistor'])
  assert.ok(byId[id],'Real source library missing '+id);
 return byId;
}
function run(byId,n,sensed){
 const project=structuredClone(L.byId['open-collector-'+n].project);
 project.components.find(c=>c.id==='s').state=sensed;
 const result=Simulation.solve(project,byId,{now:sensed?300:0});
 assert.equal(result.blocked,false,'blocked open-collector-'+n);
 assert.equal(result.stable,true,'unstable open-collector-'+n);
 assert.equal(result.shortCircuit,false,'shorted open-collector-'+n);
 const lamp=project.components.find(c=>c.id==='h'),resistor=project.components.find(c=>c.id==='r');
 return {project,result,lamp,resistor,lampCurrent:Number(lamp._currentValue)||0,resCurrent:Number(resistor?._currentValue)||0};
}
test('PNP variant 3 uses 10k BK-to-0V pull-down, no independent +24V resistor feed',()=>{
 const p=L.byId['open-collector-3'].project,r=p.components.find(c=>c.id==='r');
 assert.equal(p.components.find(c=>c.id==='s').typeId,'proximity');
 assert.equal(r?.resistance,10000);
 assert.equal(p.wires.length,6);
 assert.ok(p.wires.some(w=>w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='r'&&w.to.p==='1'));
 assert.ok(p.wires.some(w=>w.from.c==='r'&&w.from.p==='2'&&w.to.c==='s'&&w.to.p==='BK'));
 assert.ok(!p.wires.some(w=>w.from.c==='g1'&&w.from.p==='P'&&w.to.c==='r'));
 assert.equal(L.byId['open-collector-3'].steps.length,p.wires.length,'guided steps must match corrected source');
});
test('exact native simulator fixes phantom current on PNP OFF and preserves output ON',()=>{
 const byId=definitions(),off=run(byId,3,false),on=run(byId,3,true);
 assert.ok(Math.abs(off.lampCurrent)<1e-6,'OFF PNP indicator must draw no current');
 assert.ok(Math.abs(off.resCurrent)<1e-6,'OFF pull-down must not consume current');
 assert.equal(off.lamp._active,false);
 assert.ok(Math.abs(on.lampCurrent-.024)<.003,'ON indicator expected ~24 mA in educational model');
 assert.ok(Math.abs(on.resCurrent-.0024)<.001,'ON 10k pull-down expected ~2.4 mA');
 assert.equal(on.lamp._active,true);
});
test('three other open-collector variants keep prior topology and switch behavior',()=>{
 const byId=definitions();
 for(const n of [1,2,4]){
  const p=L.byId['open-collector-'+n].project;
  assert.equal(p.wires.length,n===4?6:4);
  const r=p.components.find(c=>c.id==='r');
  if(n===4){
   assert.equal(r?.resistance,1000);
   assert.ok(p.wires.some(w=>w.from.c==='g1'&&w.from.p==='P'&&w.to.c==='r'));
  }else assert.equal(r,undefined);
  const off=run(byId,n,false),on=run(byId,n,true);
  assert.equal(off.lamp._active,false,'unexpected ON at rest '+n);
  assert.equal(on.lamp._active,true,'sensor cannot energize H1 '+n);
 }
});
