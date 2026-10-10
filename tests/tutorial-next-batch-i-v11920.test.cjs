'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
const topics=['control-combinations','loop-420','loop-powered','active-passive'];
test('Batch I preserves original 16 canonical circuits and loads 104 rich lessons',()=>{
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 for(const f of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js'])vm.runInNewContext(read(f),ctx);
 const ids=topics.flatMap(t=>[1,2,3,4].map(i=>t+'-'+i));
 const prior=new Map(ids.map(id=>[id,JSON.stringify({components:L.byId[id].project.components,wires:L.byId[id].project.wires,steps:L.byId[id].steps})]));
 vm.runInNewContext(read('tutorial-next-batch-i.js'),ctx);
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,104);
 assert.equal(new Set(ids.map(id=>L.byId[id].measurementUpgrade.question)).size,16);
 for(const id of ids){const l=L.byId[id];assert.equal(JSON.stringify({components:l.project.components,wires:l.project.wires,steps:l.steps}),prior.get(id),id);assert.equal(l.pedagogyReview.visualAcceptance,false);assert.equal(l.pedagogyReview.simulationAcceptance,false);}
});
test('Batch I loader follows H; separate simulator verification remains a release gate',()=>{
 const m=read('tutorial-mode.js');
 assert.ok(m.indexOf('tutorial-next-batch-i.js?v=1.19.20-next-batch-i1')>m.indexOf('tutorial-installation-batch-h.js?v=1.19.20-installation-batch-h1'));
});
