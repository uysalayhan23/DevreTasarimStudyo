'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Physical=require('../dist/physical-metadata.js');
const d={id:'main-contact',materialAsset:'siemens-contactor',w:90,h:116,pins:[{id:'A',x:45,y:58}]};
test('invalid mm to scene factor cannot corrupt verified body and terminals',()=>{
 for(const units of [Infinity,-Infinity,NaN,0,-2]){
  const p=Physical.materialDefinition(d,{sceneUnitsPerMm:units});
  assert.deepEqual([p.w,p.h,p.pins[0].x,p.pins[0].y],[90,116,45,58]);
 }
});
test('canonical default stays 2 scene units per millimeter',()=>{
 const p=Physical.materialDefinition(d);
 assert.deepEqual([p.w,p.h,p._materialSceneUnitsPerMm],[90,116,2]);
});
test('valid explicit conversion remains supported',()=>{
 const p=Physical.materialDefinition(d,{sceneUnitsPerMm:4});
 assert.deepEqual([p.w,p.h,p.pins[0].x,p.pins[0].y],[180,232,90,116]);
});
