'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=n=>fs.readFileSync(path.join(__dirname,'../dist',n),'utf8');
const overlays=['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js',
 'tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js',
 'tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js',
 'tutorial-next-batch-i.js','tutorial-sensor-batch-j.js','tutorial-motor-batch-k.js',
 'tutorial-dual-dc-batch-l.js','tutorial-topic-review-batch-m.js'];
function stage(){
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
 const context={window:{DTSTutorialLessons:L}};
 for(const name of overlays)vm.runInNewContext(read(name),context,{filename:name});
 return {L,context};
}
test('1519 practical guides follow real lesson source graphs and preserve 136 rich accepted lessons',()=>{
 const {L,context}=stage();
 const graphs=new Map(L.lessons.map(x=>[x.id,JSON.stringify(x.project)]));
 const rich=new Map(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').map(x=>[x.id,JSON.stringify(x)]));
 vm.runInNewContext(read('tutorial-practice-guide-batch-n.js'),context,{filename:'tutorial-practice-guide-batch-n.js'});
 assert.equal(L.count,1655);assert.equal(L.practiceGuideBatchN.scanned,1519);
 assert.equal(L.practiceGuideBatchN.guides,1519);
 assert.equal(L.practiceGuideBatchN.richPreserved,136);
 assert.equal(L.practiceGuideBatchN.withoutMatchedLinks.length,0);
 assert.equal(L.practiceGuideBatchN.wired+L.practiceGuideBatchN.referenceOnly,1519);
 assert.equal(L.practiceGuideBatchN.wired,525,'525 guided virtual circuit practices');
 assert.equal(L.practiceGuideBatchN.referenceOnly,994,'994 references, including 71 schematic-only');
 assert.equal(L.practiceGuideBatchN.referenceWithWires,71,'reference drawings must not be presented as tested wiring');
 assert.equal(L.lessons.filter(l=>l.practiceGuide?.method==='reference-only').length,923);
 assert.equal(L.lessons.filter(l=>l.practiceGuide?.method==='reference-with-wires').length,71);
 assert.equal(L.lessons.filter(l=>l.practiceGuide?.method==='virtual-circuit-check').length,525);

 for(const lesson of L.lessons){
  assert.equal(JSON.stringify(lesson.project),graphs.get(lesson.id),'canonical project mutated '+lesson.id);
  if(rich.has(lesson.id)){assert.equal(JSON.stringify(lesson),rich.get(lesson.id));continue}
  const p=lesson.practiceGuide;
  assert.ok(p,'Guide missing '+lesson.id);
  assert.equal(p.virtualOnly,true);assert.equal(p.physicalTestAccepted,false);
  assert.equal(p.fullyRich,false);assert.equal(p.canonicalGraphUnchanged,true);
  assert.ok(p.steps.length>=3&&p.steps.every(x=>typeof x==='string'&&x.trim().length>12),lesson.id);
  assert.ok(p.steps.every(x=>!/<script\b|javascript:|onerror\s*=|onload\s*=/i.test(x)),lesson.id+' unsafe HTML in steps');
  assert.ok(p.observations.length>=1,lesson.id);
  assert.ok(p.steps.every(x=>!/<iframe\b|<object\b|<embed\b|<svg\b|<math\b|srcdoc\s*=|on[a-z]+\s*=/i.test(x)),lesson.id+' unsafe embedded content');
  assert.ok(p.observations.every(x=>typeof x==='string'&&x.trim().length>0),lesson.id+' empty observation');
  assert.ok(p.observations.every(x=>!/<script\b|javascript:|onerror\s*=|onload\s*=/i.test(x)),lesson.id+' unsafe HTML in observations');
  assert.ok(p.observations.every(x=>!/<iframe\b|<object\b|<embed\b|<svg\b|<math\b|srcdoc\s*=|on[a-z]+\s*=/i.test(x)),lesson.id+' unsafe embedded observation');
  if(p.method==='reference-only')assert.match(p.steps.join(' '),/doğrulanmış kablolu deney şeması bulunmuyor/);
  else if(p.method==='reference-with-wires')assert.match(p.steps.join(' '),/konu kontrolü \/ referans şemasıdır/);
  else assert.ok(p.observations.some(x=>x.includes('→')),lesson.id);
 }
});
test('Batch N is idempotent and visible in the coach without misrepresenting physical QA',()=>{
 const {L,context}=stage();
 const code=read('tutorial-practice-guide-batch-n.js');
 vm.runInNewContext(code,context);
 const before=L.lessons.map(x=>JSON.stringify(x.practiceGuide));
 vm.runInNewContext(code,context);
 assert.deepEqual(L.lessons.map(x=>JSON.stringify(x.practiceGuide)),before);
 const mode=read('tutorial-mode.js');
 assert.match(mode,/tutorial-practice-guide-batch-n\.js\?v=/);
 assert.match(mode,/tutorial-virtual-practice/);
 assert.match(mode,/l\.practiceGuide\.observations/);
 assert.match(mode,/esc\(x\)/);
});
