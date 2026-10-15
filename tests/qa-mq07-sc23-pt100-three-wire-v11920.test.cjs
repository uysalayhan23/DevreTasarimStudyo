'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Sim=require('../dist/simulation.js'),Thermal=require('../dist/thermal.js');
const L=QA.curriculum(),defs=QA.catalog(),scene=L.byId['sensor-analog-apps-src-04'];
const pt=p=>p.components.find(c=>c.id==='pt'),ctl=p=>p.components.find(c=>c.id==='ctl');
function sample(temperature,option=''){
 const p=JSON.parse(JSON.stringify(scene.project));pt(p).temperature=temperature;
 if(option==='swap'){const b1=p.wires.find(w=>w.from.c==='pt'&&w.from.p==='B1'),b2=p.wires.find(w=>w.from.c==='pt'&&w.from.p==='B2');const a=b1.to.p;b1.to.p=b2.to.p;b2.to.p=a}
 if(option.startsWith('cut-'))p.wires=p.wires.filter(w=>w.from.c!=='pt'||w.from.p!==option.slice(4));
 if(option==='wrong')p.wires.find(w=>w.from.c==='pt'&&w.from.p==='A').to.p='8';
 if(option==='power-cut')p.wires=p.wires.filter(w=>w.from.c!=='g1'||w.from.p!=='L');
 const r=Sim.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
 return {r,p,c:ctl(p)._controller};
}
test('SC23 three-wire real sensor terminal graph and display-only PT100 controller',()=>{
 assert.equal(scene.kind,'wiring');assert.equal(scene.project.components.length,3);assert.equal(scene.project.wires.length,5);
 assert.equal(scene.steps.length,5);assert.equal(defs['sensor-pt100'].ptWires,3);
 assert.equal(ctl(scene.project).mq07Pt100ThreeWireInput,true);
 assert.equal(ctl(scene.project).instrumentSettings.input,'PT100');
 assert.equal(ctl(scene.project).instrumentSettings.displayOnly,'on');
 for(const [a,pin,b,t] of [['pt','A','ctl','10'],['pt','B1','ctl','8'],['pt','B2','ctl','9']])
  assert.ok(scene.project.wires.some(w=>w.from.c===a&&w.from.p===pin&&w.to.c===b&&w.to.p===t));
});
test('SC23 original numeric solver ideal PT100 resistance temperature at 0 25 100 C',()=>{
 for(const [t,ohms] of [[0,100],[25,109.73465625],[100,138.5055]]){
  const x=sample(t);assert.equal(x.c.error,'');assert.equal(x.c.displayOnly,true);
  assert.ok(Math.abs(x.c.pv-t)<.01);assert.ok(Math.abs(Thermal.resistance(t)-ohms)<.0001);
  assert.equal(x.c.main,false);assert.equal(x.c.ssr,false);
 }
});
test('SC23 equivalent third lead swap remains valid, missing and wrong lead never returns PV',()=>{
 let x=sample(100,'swap');assert.equal(x.c.error,'');assert.ok(Math.abs(x.c.pv-100)<.01);
 for(const opt of ['cut-A','cut-B1','cut-B2','wrong','power-cut']){
  x=sample(100,opt);assert.ok(x.c.error,'expected error: '+opt);
  assert.equal(x.c.main,false);assert.equal(x.c.ssr,false);
 }
});
test('SC11 SC22 locked sources remain and physical acceptance is never inferred',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.byId['sensor-analog-apps-src-01'].project.components.length,13);
 assert.equal(L.byId['sensor-analog-apps-src-02'].project.components.length,13);
 assert.equal(L.byId['sensor-analog-apps-src-03'].project.components.length,6);
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 assert.equal(scene.pedagogyReview.physicalAcceptance,false);
 assert.equal(scene.pedagogyReview.mq07Pt100ThreeWire.physicalLeadCompensationVerified,false);
});
