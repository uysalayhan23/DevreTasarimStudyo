'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Simulation=require('../dist/simulation.js');
function setup(){
 const ctx={window:{}};
 for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js']){
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+file),'utf8'),ctx);
 }
 const byId=Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
 require('../dist/tutorial-lessons.js');
 const lessons={window:{DTSTutorialLessons:require('../dist/tutorial-source-outline.js')}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),lessons);
 return {byId,lessons:lessons.window.DTSTutorialLessons};
}
test('series and parallel labs have four movable probes with one lead per meter jack',()=>{
 const {lessons}=setup();
 for(const id of ['dc-circuits-src-07','dc-circuits-src-08']){
  const l=lessons.byId[id],p=l.project;
  assert.equal(l.pedagogyReview.physicalProbes,true,id);
  for(const meterId of ['a','v1']){
   for(const color of ['red','black']){
    const probe=p.components.find(c=>c.id===meterId+'-'+color),jack=color==='black'?'COM':p.components.find(c=>c.id===meterId).meterPosition===9?'10A':'V';
    assert.equal(probe.typeId,'test-probe-'+color,id+' '+meterId+' '+color);
    assert.ok(probe.probeTarget?.c&&probe.probeTarget?.p,id+' '+probe.id+' movable tip');
    const lead=p.wires.filter(w=>(w.from?.c===meterId&&w.from?.p===jack&&w.to?.c===probe.id&&w.to?.p==='PLUG')||(w.to?.c===meterId&&w.to?.p===jack&&w.from?.c===probe.id&&w.from?.p==='PLUG'));
    assert.equal(lead.length,1,id+' '+probe.id+' single jack lead');
   }
  }
  assert.ok(l.steps.length>0,id+' functional guided steps');
  const keys=new Set(p.wires.map(w=>JSON.stringify([w.from,w.to])));
  for(const step of l.steps)assert.ok(keys.has(JSON.stringify([step.from,step.to])),id+' guide must describe existing wire');
 }
});
test('series and parallel rich probe measurements are nonzero, electrically stable, and movable',()=>{
 const {byId,lessons}=setup();
 for(const [id,expectedCurrent,expectedVoltage] of [['dc-circuits-src-07',.0748,7.48],['dc-circuits-src-08',.349,24]]){
  const p=lessons.byId[id].project;
  const first=Simulation.solve(p,byId,{now:0});
  assert.equal(first.stable,true,id);assert.equal(first.blocked,false,id);assert.equal(first.shortCircuit,false,id);
  const amps=p.components.find(c=>c.id==='a'),volts=p.components.find(c=>c.id==='v1');
  const currentA=amps._meter.value; // Runtime stores SI amperes; mA is display only.
  assert.ok(Math.abs(currentA-expectedCurrent)<.005,id+' expected current');
  assert.ok(Math.abs(volts._meter.value-expectedVoltage)<.12,id+' resistor voltage');
  p.components.find(c=>c.id==='v1-red').probeTarget={c:'g',p:'P'};
  p.components.find(c=>c.id==='v1-black').probeTarget={c:'g',p:'M'};
  const moved=Simulation.solve(p,byId,{now:200});
  assert.equal(moved.blocked,false,id+' moved probes must not block simulation');
  assert.ok(Math.abs(volts._meter.value-24)<.03,id+' relocated probes measure source voltage');
 }
});
