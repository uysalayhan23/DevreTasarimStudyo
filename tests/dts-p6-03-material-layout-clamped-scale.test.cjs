'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Physical=require('../dist/physical-metadata.js');
const base={id:'main-contact',materialAsset:'siemens-contactor',w:90,h:116,pins:[]};
const audit=materialScale=>Physical.materialLayoutAudit([{id:'A',typeId:base.id,x:0,y:0,materialScale}],{[base.id]:base}).rows[0];
test('P6-03 verified material overlap envelope matches renderer 3x upper zoom',()=>{
 assert.equal(Physical.get(base).sourceStatus,'verified');
 const row=audit(10);assert.equal(row.width,270);assert.equal(row.height,348);
});
test('P6-03 verified material minimum scale follows renderer 0.25x',()=>{
 assert.equal(audit(.01).width,22.5);assert.equal(audit(.01).height,29);
});
test('P6-03 ordinary 2x scale remains unchanged',()=>{
 assert.equal(audit(2).width,180);assert.equal(audit(2).height,232);
});
