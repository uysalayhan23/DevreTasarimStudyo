'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Lib={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),Lib);
const byId=Object.fromEntries(Array.from(Lib.window.COMPONENT_LIBRARY,d=>[d.id,d]));
const Mat111=require('../dist/materials-v111.js');
const Mat113=require('../dist/materials-v113.js');
const Mat115=require('../dist/materials-v115.js');
const Sensors=require('../dist/sensors.js');
const Physical=require('../dist/physical-metadata.js');
const Twin=require('../dist/digital-twin.js');
const Simulation=require('../dist/simulation.js');
const isPhoto=source=>/<image\b/.test(source);

test('3NP1133 original photographic product face restored for both cover positions without stretching',()=>{
 const d=byId['nh-fuse-holder'];assert.ok(d);assert.deepEqual([d.w,d.h],[211.6,404]);
 for(const state of [false,true]){
  const art=Mat111.markup(d,{id:'nh-1',state,nhFuses:[true,true,true]});
  assert.ok(isPhoto(art));assert.match(art,/assets\/products\/nh-holder-front-v111\.png/);
  assert.match(art,/width="211\.6" height="404" viewBox="27 0 126 240" preserveAspectRatio="xMidYMid meet"/);
  assert.match(art,/viewBox="105 180 785 1350" preserveAspectRatio="xMidYMid meet"/);
  assert.match(art,/class="nh-lid"/);
  assert.doesNotMatch(art,/nh-top-plan|data-view="top-orthographic"|scale\(1 0\.32\)|preserveAspectRatio="none"/);
 }
 assert.deepEqual(Array.from(d.pins,p=>p.id),['1','2','3','4','5','6']);
});

test('WAZ5 exact stored photograph restored, proportional original crop, manufacturer footprint unchanged',()=>{
 const d=byId['converter-pressure'];assert.ok(d);assert.deepEqual([d.w,d.h],[35,184.8]);
 const s=Mat115.markup(d,{id:'waz-photo'});
 assert.ok(isPhoto(s));assert.match(s,/waz5-front-transparent\.webp/);
 assert.match(s,/class="waz5-physical-envelope"/);
 assert.match(s,/viewBox="0 0 160 949" preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(s,/waz5-top-plan|data-view="orthographic-top"|preserveAspectRatio="none"/);
 assert.equal(d.pins.length,12);
 const p=Physical.get(d);assert.deepEqual([p.widthMm,p.heightMm,p.depthMm],[17.5,92.4,112.4]);
 assert.equal(p.visualMatchStatus,'exact');
 assert.equal(p.visualOrientationStatus,'source-image-derived-front');
 assert.equal(Physical.panelEligibility(d).eligible,false);
 const twin=Twin.record(d);assert.match(twin.visual.runtimeFile,/waz5-front-transparent\.webp$/);
});

test('reed NO/NC original photo and draggable magnet photo restored, with unchanged ports and drag',()=>{
 for(const id of ['reed-no','reed-nc']){
  const d=byId[id];assert.ok(d);
  const c={id:'reed1',typeId:id,rotation:90,sensing:{distance:5,range:10,face:'right',offset:0}};
  const face=Mat113.markup(d,c),target=Sensors.markup(c,d);
  assert.ok(isPhoto(face));assert.ok(isPhoto(target));
  assert.match(face,/reed-mr228b-v113\.jpg/);assert.match(target,/reed-mr228b-v113\.jpg/);
  assert.match(face,/viewBox="87 0 324 327"/);assert.match(target,/viewBox="214 205 214 187"/);
  assert.match(target,/data-sensor-target="reed1"/);
  assert.doesNotMatch(face,/reed-top-plan|data-view="top-orthographic"/);
  assert.doesNotMatch(target,/reed-magnet-top/);
  assert.deepEqual([d.w,d.h],[80,100]);
  assert.deepEqual(Array.from(d.pins,p=>[p.id,p.x,p.y]),id==='reed-no'?[['13',40,0],['14',40,100]]:[['21',40,0],['22',40,100]]);
  assert.equal(Sensors.detect(c,d).detected,true);
 }
});

test('WSI 3-slot fuse product photograph and its already fixed proportional fit remain unchanged',()=>{
 const d=byId['fuse-switch-3'];assert.ok(d);assert.equal(d.fuseSlots,3);
 const a=Mat111.markup(d,{id:'wsi',fuseOpen:{0:true}});
 assert.equal((a.match(/wsi-top-v111\.png/g)||[]).length,6);
 assert.equal((a.match(/preserveAspectRatio="xMidYMid meet"/g)||[]).length,3);
 assert.doesNotMatch(a,/wsi-top-plan|preserveAspectRatio="none"/);
 assert.equal((a.match(/data-fuse-slot=/g)||[]).length,3);
});

test('photo restoration does not alter verified electrical lamp simulation',()=>{
 const s={id:'s',typeId:'supply-dc-plus'},lamp={id:'lamp',typeId:'lamp-green'},wires=[
 {id:'a',from:{c:'s',p:'P'},to:{c:'lamp',p:'X1'}},
 {id:'b',from:{c:'lamp',p:'X2'},to:{c:'s',p:'M'}}];
 const project={components:[s,lamp],wires,junctions:[]};
 Simulation.solve(project,byId);assert.equal(lamp._active,true);
});
