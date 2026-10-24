'use strict';
// Scoped virtual PLC motor test: power-loss restart inhibit vs ordinary 3 s delayed STOP.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const clone=x=>structuredClone(x),part=(p,id)=>p.components.find(c=>c.id===id);
const target=L.byId['plc-hardware-programming-src-21'];
function fixture(sc=331){const l=L.lessons[sc-1];return clone(l.project)}
function run(p,at,expected){const result=Native.solve(p,defs,{now:at});
 assert.ok(result.stable&&!result.blocked&&!result.shortCircuit,'unstable native state at '+at+': '+(result.reason||''));
 assert.equal(!!part(p,'motor')._active,expected,'motor mismatch at '+at);
 return result}
function cutSupply(p){
 const wires=p.wires.filter(w=>w.from?.c==='ps'&&w.from?.p==='P'&&w.to?.c==='plc'&&w.to?.p==='X10:1');
 assert.equal(wires.length,1,'missing exact PLC +24 V terminal wire');
 p.wires=p.wires.filter(w=>!wires.includes(w));return wires[0]
}
test('SC331 original 8-part 18-wire catalogue circuit and REVIEW lock retained',()=>{
 assert.equal(target.kind,'wiring');
 assert.equal(target.project.components.length,8);assert.equal(target.project.wires.length,18);
 assert.equal(part(target.project,'plc').plcProgram,'delayed-stop-sc202');
 assert.notEqual(target.pedagogyReview?.physicalAcceptance,true);
 assert.notEqual(target.pedagogyReview?.nativeDynamicAcceptance,true);
 for(const w of target.project.wires)for(const end of [w.from,w.to]){
  const d=defs[part(target.project,end.c)?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===end.p),'unknown catalog pin '+end.c+'/'+end.p);
 }
});
test('SC331 normal NC STOP still releases Q0 after exactly 3s',()=>{
 const p=fixture();run(p,1000,false);
 part(p,'start').state=true;run(p,1100,true);
 part(p,'start').state=false;run(p,1200,true);
 part(p,'stop').state=true;run(p,1300,true);
 run(p,4299,true);run(p,4300,false);
 part(p,'stop').state=false;run(p,4400,false);
 part(p,'start').state=true;run(p,4500,true);
});
test('SC331 PLC power loss cancels latch and restoration requires fresh START',()=>{
 const p=fixture();part(p,'start').state=true;run(p,1100,true);
 part(p,'start').state=false;run(p,1200,true);
 const missing=cutSupply(p);run(p,1300,false);
 assert.equal(!!part(p,'plc')._plcLatch,false);
 p.wires.push(missing);run(p,1400,false);run(p,1500,false);
 part(p,'start').state=true;run(p,1600,true);
});
test('SC331 START held across power loss does not restart without release',()=>{
 const p=fixture();part(p,'start').state=true;run(p,1100,true);
 part(p,'start').state=false;run(p,1200,true);
 const missing=cutSupply(p);run(p,1300,false);
 part(p,'start').state=true;run(p,1400,false);
 p.wires.push(missing);run(p,1500,false);run(p,1600,false);
 part(p,'start').state=false;run(p,1700,false);
 part(p,'start').state=true;run(p,1800,true);
});
test('SC322 default PLC start/stop program keeps existing power-loss behavior',()=>{
 const p=fixture(322);part(p,'start').state=true;run(p,1100,true);
 part(p,'start').state=false;run(p,1200,true);
 const missing=cutSupply(p);run(p,1300,false);
 p.wires.push(missing);run(p,1400,false);
 part(p,'start').state=true;run(p,1500,true);
});
test('SC331 PLC output cable interruption cuts motor despite latched program',()=>{
 const p=fixture();part(p,'start').state=true;run(p,1100,true);
 part(p,'start').state=false;run(p,1200,true);
 const broken=p.wires.filter(w=>w.from?.c==='plc'&&w.from?.p==='X12:3'&&w.to?.c==='coil');
 assert.equal(broken.length,1);p.wires=p.wires.filter(w=>!broken.includes(w));
 run(p,1300,false);assert.equal(part(p,'plc')._plcRuntime.outputs['X12:3'],true);
});
