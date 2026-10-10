'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function lessons(){
 require('../dist/tutorial-lessons.js');
 const outlined=require('../dist/tutorial-source-outline.js');
 const ctx={window:{DTSTutorialLessons:outlined}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),ctx);
 return ctx.window.DTSTutorialLessons;
}
const pinKey=e=>String(e.c)+'/'+String(e.p);
const edgeKey=x=>pinKey(x.from)+'>'+pinKey(x.to);
test('LM358P physical PDIP-8 migration updates guided lesson steps as well as real wires',()=>{
 const l=lessons().byId['sensor-analog-apps-src-01'];
 assert.ok(l,'NTC comparator lab missing');
 const d=l.project.components.find(x=>x.id==='u1');
 assert.equal(d.typeId,'lm358p-dip8');
 const valid=new Set(['1','2','3','4','8']);
 const wiring=new Set(l.project.wires.map(edgeKey));
 assert.ok(l.steps.some(x=>x.to.c==='u1'),'must guide real IC pins');
 for(const step of l.steps){
  assert.ok(wiring.has(edgeKey(step)),'guide wire not in physical project: '+edgeKey(step));
  for(const endpoint of [step.from,step.to])if(endpoint.c==='u1')assert.ok(valid.has(String(endpoint.p)),'old LM358 logical port '+endpoint.p);
 }
 for(const wire of l.project.wires)for(const endpoint of [wire.from,wire.to])if(endpoint.c==='u1')assert.ok(valid.has(String(endpoint.p)));
});
