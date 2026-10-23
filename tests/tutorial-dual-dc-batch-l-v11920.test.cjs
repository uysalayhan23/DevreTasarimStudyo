'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
test('Batch L preserves 4 dual DC canonical networks and yields 136 rich lessons',()=>{
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 const files=['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js','tutorial-next-batch-i.js','tutorial-sensor-batch-j.js','tutorial-motor-batch-k.js'];
 for(const f of files)vm.runInNewContext(read(f),ctx);
 const ids=[1,2,3,4].map(n=>'dual-dc-'+n),before=ids.map(id=>JSON.stringify({components:L.byId[id].project.components,wires:L.byId[id].project.wires,steps:L.byId[id].steps}));
 vm.runInNewContext(read('tutorial-dual-dc-batch-l.js'),ctx);
 assert.equal(L.lessons.length,1655);assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 ids.forEach((id,i)=>{const lesson=L.byId[id];assert.equal(JSON.stringify({components:lesson.project.components,wires:lesson.project.wires,steps:lesson.steps}),before[i],id);assert.equal(lesson.pedagogyReview.visualAcceptance,false);assert.equal(lesson.pedagogyReview.simulationAcceptance,false);});
});
test('Batch L is present in tutorial loader after motor Batch K',()=>{
 const s=read('tutorial-mode.js');assert.match(s,/tutorial-motor-batch-k\.js\?v=[^'\"]+/);assert.match(s,/tutorial-dual-dc-batch-l\.js\?v=[^'\"]+/);assert.ok(s.indexOf('tutorial-dual-dc-batch-l.js?v=')>s.indexOf('tutorial-motor-batch-k.js?v='));
});


test('Batch L: four physical DC graphs remain nonshorted and nonblocked under the real solver at rest',()=>{
 const Simulation=require('../dist/simulation.js');
 const ctx={window:{}};
 for(const filename of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])
  vm.runInNewContext(read(filename),ctx,{filename});
 const definitions=Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
 const source=require('../dist/tutorial-source-outline.js');
 for(let n=1;n<=4;n++){
  const project=structuredClone(source.byId['dual-dc-'+n].project);
  const result=Simulation.solve(project,definitions,{now:0});
  assert.equal(result.blocked,false,'dual-dc-'+n+' blocked');
  assert.equal(result.shortCircuit,false,'dual-dc-'+n+' short circuit');
 }
});
test('Batch L: isolation is explicit and common references occur only in intended variants',()=>{
 const L=require('../dist/tutorial-source-outline.js');
 for(let n=1;n<=4;n++){
  const p=L.byId['dual-dc-'+n].project;
  const common=p.wires.some(w=>w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='g2'&&w.to.p==='M');
  if(n===1||n===3){
   assert.equal(p.intentionalElectricalIslands,2,'dual-dc-'+n+' island contract');
   assert.equal(common,false,'dual-dc-'+n+' must remain isolated');
  }else{
   assert.equal(common,true,'dual-dc-'+n+' must share intended 0V reference');
  }
 }
});

// SC079: nonshorted simulator state alone does not certify a missing common 0 V lead.
test('SC079 common reference: positive wiring and disconnected-ground negative control',()=>{
 const source=require('../dist/tutorial-source-outline.js');
 const original=structuredClone(source.byId['dual-dc-2'].project);
 const common=p=>p.wires.filter(w=>(w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='g2'&&w.to.p==='M')||(w.from.c==='g2'&&w.from.p==='M'&&w.to.c==='g1'&&w.to.p==='M'));
 assert.equal(common(original).length,1,'SC079 needs exactly one common 0 V reference');
 const disconnected=structuredClone(original);disconnected.wires=disconnected.wires.filter(w=>!common(original).some(c=>c.id===w.id));
 assert.equal(common(disconnected).length,0,'negative control must remove the common reference');
 assert.equal(original.wires.length,5);assert.equal(disconnected.wires.length,4);
 assert.ok(original.wires.some(w=>w.from.c==='g1'&&w.from.p==='P'&&w.to.c==='s'&&w.to.p==='BN'));
 assert.ok(original.wires.some(w=>w.from.c==='s'&&w.from.p==='BU'&&w.to.c==='g1'&&w.to.p==='M'));
 assert.ok(original.wires.some(w=>w.from.c==='g2'&&w.from.p==='P'&&w.to.c==='h'&&w.to.p==='X1'));
 assert.ok(original.wires.some(w=>w.from.c==='h'&&w.from.p==='X2'&&w.to.c==='s'&&w.to.p==='BK'));
});
