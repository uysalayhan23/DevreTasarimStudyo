'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-10',lesson=L.byId[id];
const copy=v=>JSON.parse(JSON.stringify(v)),part=(p,id)=>p.components.find(c=>c.id===id);
function solve(p,on){
 part(p,'sw').state=on;
 const r=Native.solve(p,defs,{now:1000}),vg=part(p,'vg')._meter,vl=part(p,'vl')._meter;
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
 assert.equal(vg.warning,'');assert.equal(vl.warning,'');
 return {on:!!part(p,'q1')._active,gate:vg.value,load:vl.value,lamp:!!part(p,'h1')._active};
}
test('real catalog G/D/S and 12 wired terminals, two real virtual UT33D+ probe pairs',()=>{
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.components.length,12);assert.equal(lesson.project.wires.length,12);
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,null);
 assert.equal(lesson.pedagogyReview.mosfetHealthVirtual.realManufacturerDiagnosis,false);
 for(const k of ['physicalAcceptance','manufacturerCalibrationVerified','independentPedagogicalAcceptance','windowsVisualAcceptance'])assert.equal(lesson.pedagogyReview[k],false,k);
 assert.equal(part(lesson.project,'q1').typeId,'irf540n-mosfet');
 assert.deepEqual(Array.from(defs['irf540n-mosfet'].pins,x=>x.id),['G','D','S']);
 const wires=lesson.project.wires.map(w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p);
 for(const p of ['rg/2>q1/G','rp/1>q1/G','q1/S>g1/M','h1/X2>q1/D','vg/V>vg-red/PLUG','vg/COM>vg-black/PLUG','vl/V>vl-red/PLUG','vl/COM>vl-black/PLUG'])assert.ok(wires.includes(p),p);
 for(const [probe,id,terminal] of [['vg-red','q1','G'],['vg-black','q1','S'],['vl-red','h1','X1'],['vl-black','h1','X2']])assert.deepEqual(part(lesson.project,probe).probeTarget,{c:id,p:terminal});
 for(const id of ['vg','vl'])assert.equal(part(lesson.project,id).meterPosition,3);
});
test('original native MOSFET solver: off/on/off with gate and load measured, not fake animation',()=>{
 const p=copy(lesson.project),off=solve(p,false),on=solve(p,true),again=solve(p,false);
 assert.ok(!off.on&&!off.lamp&&Math.abs(off.gate)<.01&&Math.abs(off.load)<.01);
 assert.ok(on.on&&on.lamp&&on.gate>11&&on.gate<12&&on.load>11.9&&on.load<12.01);
 assert.ok(!again.on&&!again.lamp&&Math.abs(again.gate)<.01&&Math.abs(again.load)<.01);
});
test('open gate fails closed; D-S simulated bridge is unintended ON, not physical diagnosis',()=>{
 const p=copy(lesson.project);p.wires=p.wires.filter(w=>!(w.from.c==='rg'&&w.to.c==='q1'));
 const lost=solve(p,true);assert.ok(!lost.on&&!lost.lamp&&Math.abs(lost.load)<.01);
 const b=copy(lesson.project);b.wires.push({id:'virtual-bypass',from:{c:'q1',p:'D'},to:{c:'q1',p:'S'},role:'CONTROL',points:[]});
 const bypass=solve(b,false);assert.ok(!bypass.on&&bypass.lamp&&bypass.load>11.9);
});
test('MQ07 teaching UI calls native solver in OFF→ON→OFF order',()=>{
 const p=copy(lesson.project);p.tutorialLesson={id,phase:'demo',step:0,lastFeedback:''};let renders=0;
 const w={DTSTutorialLessons:L,CCSSimulation:Native,
  document:{readyState:'loading',addEventListener(){},querySelector(){return null}},
  DTSEditor:{byId:defs,getProject(){return p},render(){renders++}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','dist','tutorial-mode.js'),'utf8'),{window:w},{filename:'tutorial-mode.js'});
 for(const mode of ['off','on','off']){assert.equal(w.DTSTutorialMode.setMosfetHealthPhase(p,mode),true);assert.match(p.tutorialLesson.lastFeedback,/Fiziksel ürün sağlamlığı doğrulanmadı/)}
 assert.equal(renders,3);
 assert.equal(w.DTSTutorialMode.topologyReviewNotice(lesson),'');
});
test('full original 1655 lesson, 940 catalog and 732/732 stable native solver regression',()=>{
 const a=QA.audit({L,defs,Simulation:Native});
 assert.equal(a.status,'PASS');assert.equal(a.total,1655);assert.equal(a.rich,136);
 assert.equal(a.definitionCount,940);assert.equal(a.withWires,732);assert.equal(a.stable,732);
 assert.equal(L.mq07Batch200.reviewIds.length,48);
 assert.equal(L.mq07Batch200.reviewIds.some(x=>x.id===id),false);
 for(const k of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','shortCircuits','blocked','unstable','errors','duplicateIds'])assert.deepEqual(a[k],[],k);
});
