'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=x=>fs.readFileSync(path.join(__dirname,'../dist',x),'utf8');
test('Batch K keeps twelve authentic BERO and motor graphs, 132 rich coding tags',()=>{
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 for(const f of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js','tutorial-next-batch-i.js','tutorial-sensor-batch-j.js'])vm.runInNewContext(read(f),ctx);
 const ids=['bero','motor-forward-reverse','motor-star-delta'].flatMap(t=>[1,2,3,4].map(n=>t+'-'+n));
 const before=ids.map(id=>JSON.stringify({components:L.byId[id].project.components,wires:L.byId[id].project.wires,steps:L.byId[id].steps}));
 vm.runInNewContext(read('tutorial-motor-batch-k.js'),ctx);
 assert.equal(L.lessons.length,1655);assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,132);
 ids.forEach((id,i)=>{const x=L.byId[id];assert.equal(JSON.stringify({components:x.project.components,wires:x.project.wires,steps:x.steps}),before[i],id);assert.equal(x.pedagogyReview.visualAcceptance,false);assert.equal(x.pedagogyReview.simulationAcceptance,false);});
});
test('Batch K is loaded after J and keeps renderer untouched',()=>{
 const m=read('tutorial-mode.js');assert.ok(m.indexOf('tutorial-motor-batch-k.js?v=1.19.20-motor-batch-k1')>m.indexOf('tutorial-sensor-batch-j.js?v=1.19.20-sensor-batch-j2'));
 assert.doesNotMatch(read('tutorial-motor-batch-k.js'),/\.innerHTML|#viewport|\.push\(W\(/);
});
