'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,'dist',name),'utf8');
const batches={
 H:['commutator','two-way','intermediate','bells'],
 I:['control-combinations','loop-420','loop-powered','active-passive'],
 J:['pnp-npn','inductive-capacitive','source-sink','open-collector'],
 K:['bero','motor-forward-reverse','motor-star-delta'],
 L:['dual-dc']
};
const ids=Object.values(batches).flat().flatMap(topic=>[1,2,3,4].map(n=>topic+'-'+n));
function library(){
 const ctx={window:{}};
 for(const name of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(name),ctx,{filename:name});
 return Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(x=>[x.id,x]));
}
function loaded(){
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 const files=['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js','tutorial-next-batch-i.js','tutorial-sensor-batch-j.js','tutorial-motor-batch-k.js','tutorial-dual-dc-batch-l.js'];
 for(const name of files)vm.runInNewContext(read(name),ctx,{filename:name});
 return L;
}
test('64/64 H-L lessons expose unique projects, guided wiring and review content',()=>{
 const L=loaded();assert.equal(ids.length,64);assert.equal(new Set(ids).size,64,'duplicate lesson identifiers');assert.equal(L.lessons.length,1655);
 const projects=ids.map(id=>L.byId[id]?.project?.projectId);
 assert.ok(projects.every(Boolean),'missing project identifiers');
 assert.equal(new Set(projects).size,64,'duplicate lesson project identifiers');
 for(const id of ids){
  const lesson=L.byId[id];assert.ok(lesson,id);
  assert.equal(lesson.designStandard,'rich-reference-v1',id);
  assert.ok(lesson.measurementUpgrade?.task?.length>25,id);
  assert.ok(lesson.quiz?.options?.length===3,id);
  assert.equal(lesson.pedagogyReview.visualAcceptance,false,id);
  assert.equal(lesson.pedagogyReview.simulationAcceptance,false,id);
  assert.ok(lesson.project.components.length>0,id);
  assert.equal(lesson.steps.length,lesson.project.wires.length,id);
  const terminals=new Set(lesson.project.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p].join('|')));
  for(const step of lesson.steps)assert.ok(terminals.has([step.from.c,step.from.p,step.to.c,step.to.p].join('|')),id);
  assert.equal(new Set(lesson.steps.map(s=>[s.from.c,s.from.p,s.to.c,s.to.p].join('|'))).size,lesson.project.wires.length,id+' missing or repeated guided wire');
 }
});
test('64/64 H-L lesson projects pass simulator initial-state no-short/no-block checks',()=>{
 const L=loaded(),defs=library(),Simulation=require('../dist/simulation.js');
 for(const id of ids){
  const p=JSON.parse(JSON.stringify(L.byId[id].project)),result=Simulation.solve(p,defs,{now:0});
  assert.equal(result.shortCircuit,false,id+' short circuit');
  assert.equal(result.blocked,false,id+' blocked');
 }
});
test('64 H-L lessons are reachable in tutorial UI and have existing coach/quiz display hooks',()=>{
 const ui=read('tutorial-mode.js'),bootstrap=read('tutorial-bootstrap.js');
 assert.match(ui,/function open\(id\)/);
 assert.match(ui,/data-tutorial-open/);
 assert.match(ui,/measurementUpgradeCard\(l,s,project\)\+noteHtml/);
 assert.match(ui,/data-measurement-upgrade-answer/);
 assert.match(ui,/tutorial-dual-dc-batch-l\.js\?v=/);
 assert.match(bootstrap,/tutorial-mode\.js\?v=/);
});
