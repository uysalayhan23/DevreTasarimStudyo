'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Norms=require('../dist/norms.js');
const Materials=require('../dist/materials.js');
const Arduino=require('../dist/arduino-library.js');
const Curated=require('../dist/tutorial-lessons.js');

function finalLessons(){
 require('../dist/tutorial-lessons.js');
 const outline=require('../dist/tutorial-source-outline.js');
 const ctx={window:{DTSTutorialLessons:outline}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),ctx);
 return ctx.window.DTSTutorialLessons;
}
function runtimeLibrary(){
 const ctx={window:{}};
 for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+file),'utf8'),ctx);
 const lib=ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY);
 for(const d of Arduino.components)if(!lib.some(x=>x.id===d.id))lib.push(d);
 return lib;
}

const Lessons=finalLessons();
const library=runtimeLibrary();
const byId=new Map(library.map(d=>[d.id,d]));

test('automatic lesson audit: every source topic is represented by complete lessons with unique ids',()=>{
 const ids=new Set();
 for(const t of Lessons.topics){
  const rows=Lessons.lessons.filter(l=>l.topicId===t.topicId);
  assert.ok(rows.length,`${t.topicId}: no lesson`);
  for(const l of rows){
   assert.ok(!ids.has(l.id),`duplicate lesson id ${l.id}`);ids.add(l.id);
   assert.ok(l.title?.trim(),`${l.id}: missing title`);
   assert.ok(l.project?.components?.length,`${l.id}: missing teaching components`);
   assert.ok(l.summary?.trim()&&l.explanation?.trim(),`${l.id}: missing topic/explanation text`);
   assert.equal(l.project.tutorialLesson.id,l.id,`${l.id}: project lesson reference mismatch`);
  }
 }
 assert.equal(ids.size,Lessons.lessons.length);
});

test('automatic lesson audit: every used component renders a schematic symbol and a material visual',()=>{
 const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
 const scriptPos=name=>{const i=html.indexOf(name);assert.ok(i>=0,'missing script '+name);return i};
 assert.ok(scriptPos('hcfa-drive-img-0.js')<scriptPos('hcfa-material-assets.js'));
 assert.ok(scriptPos('product-assets.js')<scriptPos('hcfa-material-assets.js'));
 assert.ok(scriptPos('hcfa-material-assets.js')<scriptPos('materials.js?rev='));
 const fragments={window:{}};
 for(const family of ['drive','motor'])for(let i=0;i<(family==='drive'?3:4);i++)
  vm.runInNewContext(fs.readFileSync(require.resolve(`../dist/hcfa-${family}-img-${i}.js`),'utf8'),fragments);
 const hcfaAssets=require('../dist/hcfa-material-assets.js').assets(fragments.window);
 Object.assign(Materials.assets,hcfaAssets);
 const allLessonSets=[...Lessons.lessons,...Curated.lessons];
 const types=new Set(allLessonSets.flatMap(l=>l.project.components.map(c=>c.typeId)));
 for(const typeId of types){
  const d=byId.get(typeId);assert.ok(d,`missing runtime library entry: ${typeId}`);
  assert.ok(d.pins?.length||d.visualOnly||d.diagramOnly,`${typeId}: no terminal/symbol definition`);
  for(const c of allLessonSets.flatMap(l=>l.project.components.filter(x=>x.typeId===typeId)).slice(0,1)){
   const symbol=Norms.drawing(d,c,'IEC');assert.ok(symbol?.body?.trim(),`${typeId}: schematic symbol renderer returned empty output`);
   const visual=Materials.markup(d,c);assert.ok(typeof visual==='string'&&visual.includes('<'),`${typeId}: material renderer returned empty output`);
  }
 }
 assert.ok(hcfaAssets['hcfa-x2ea040a-front'],'HCFA servo-drive image unavailable');
 assert.ok(hcfaAssets['hcfa-x2mh040-front'],'HCFA servo-motor image unavailable');
});
