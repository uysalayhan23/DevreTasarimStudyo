'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const dir=path.resolve(__dirname,'../dist'),read=file=>fs.readFileSync(path.join(dir,file),'utf8');
const chain=[...read('tutorial-mode.js').matchAll(/await loadScript\('([^']+\.js)\?v=[^']+'\)/g)].map(m=>m[1]);
const files=chain.slice(0,chain.indexOf('tutorial-next50-guidance.js')+1);
const protectedIds={
 'tutorial-measurement-native-batch-p.js':['measurement-workshop-src-03','measurement-workshop-src-04','measurement-workshop-src-05','measurement-workshop-src-06','measurement-workshop-src-07','measurement-workshop-src-10'],
 'tutorial-dc-native-batch-o.js':['dc-circuits-src-06','dc-circuits-src-07','dc-circuits-src-08','dc-circuits-src-09','dc-circuits-src-10','measurement-workshop-src-01','measurement-workshop-src-02'],
 'tutorial-installation-pe-batch-q.js':['installation-grounding-src-01','installation-grounding-src-02','installation-grounding-src-03','installation-grounding-src-04'],
 'tutorial-installation-safety-batch-r.js':['installation-grounding-src-05','installation-grounding-src-06','installation-grounding-src-07','installation-grounding-src-08','installation-grounding-src-09','installation-grounding-src-10'],
 'tutorial-installation-source-batch-s.js':['installation-systems-src-01','installation-systems-src-02','installation-systems-src-03','installation-systems-src-04','installation-systems-src-05','installation-systems-src-06'],
 'tutorial-installation-systems-batch-t.js':['installation-systems-src-07','installation-systems-src-08','installation-systems-src-09','installation-systems-src-10','installation-systems-src-11','installation-systems-src-12'],
 'tutorial-schmitt-hysteresis-batch-aj.js':['electronic-component-basics-outline-046']
};
test('46 source modules load without rewriting protected canonical graphs, guided steps or review state',()=>{
 const ctx={window:{}};vm.runInNewContext(read('tutorial-lessons.js'),ctx);
 assert.ok(files.length>=46,'source loader chain missing');
 for(const file of files){
  const ids=protectedIds[file]||[];
  const before=ids.map(id=>{const l=ctx.window.DTSTutorialLessons.byId[id];assert.ok(l,id);return JSON.stringify([l.project,l.steps,l.pedagogyReview]);});
  vm.runInNewContext(read(file),ctx,{filename:file,timeout:4000});
  ids.forEach((id,i)=>{const l=ctx.window.DTSTutorialLessons.byId[id];assert.equal(JSON.stringify([l.project,l.steps,l.pedagogyReview]),before[i],file+' changed '+id);});
 }
 assert.equal(ctx.window.DTSTutorialLessons.lessons.length,1655);
 for(const flag of ['_nativeDcBatchO','_virtualPeBatchQCanonicalPreserved','_installationSafetyBatchRProtected','_installationSourceBatchSCanonicalPreserved','_installationSystemsBatchTCanonicalPreserved','_schmittDIP8PhysicalPreserved'])assert.equal(ctx.window.DTSTutorialLessons[flag],true,flag);
});
test('SC223-242 are 20 independently described conceptual cards; native, quiz and source graph remain locked',()=>{
 const L=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs').curriculum();
 const rows=L.lessons.slice(222,242);
 const saved=rows.map(l=>JSON.stringify([l.project,l.steps,l.quiz,l.pedagogyReview]));
 const oldSteps=rows.map(l=>l.beginnerSteps?.length||0),oldDescriptions=rows.map(l=>l.explanation);
 const ctx={window:{DTSTutorialLessons:L}};
 vm.runInNewContext(read('tutorial-sc223-sc242-stories.js'),ctx);
 const unique=new Set();
 rows.forEach((l,i)=>{
  assert.equal(l.sc223Sc242StoryVersion,'20261024-sc223-sc242-v1');
  assert.equal(l.kind,'quiz');assert.equal(l.project.referenceOnly,true);assert.equal(l.project.wires.length,0);assert.equal(l.steps.length,0);
  assert.equal(JSON.stringify([l.project,l.steps,l.quiz,l.pedagogyReview]),saved[i]);
  assert.equal(l.beginnerSteps.length,oldSteps[i]+2);assert.ok(l.explanation.endsWith(oldDescriptions[i]));
  assert.ok(!unique.has(l.beginnerSteps[0]));unique.add(l.beginnerSteps[0]);
 });
 assert.equal(unique.size,20);
 vm.runInNewContext(read('tutorial-sc223-sc242-stories.js'),ctx);
 assert.equal(rows[0].beginnerSteps.length,oldSteps[0]+2);
 const a=chain.indexOf('tutorial-sc203-sc222-specific.js'),b=chain.indexOf('tutorial-sc223-sc242-stories.js');
 assert.ok(a>=0&&b>a,'new concepts must load after prior accepted audio curriculum');
});
