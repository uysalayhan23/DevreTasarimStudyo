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
 const s=read('tutorial-mode.js');assert.ok(s.indexOf('tutorial-dual-dc-batch-l.js?v=1.19.20-dual-dc-batch-l1')>s.indexOf('tutorial-motor-batch-k.js?v=1.19.20-motor-batch-k1'));
});
