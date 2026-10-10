'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Physical=require('../dist/physical-metadata.js');

test('WAZ5 metadata must match actual device identity before exposing verified manufacturer dimensions',()=>{
  const ctx={window:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
  const d=ctx.window.COMPONENT_LIBRARY.find(c=>c.id==='converter-pressure');
  assert.ok(d);
  assert.equal(d.instrument,'waz5');
  const record=Physical.get(d);
  assert.ok(record,'verified WAZ5 must resolve its physical catalog mapping');
  assert.equal(record.productKey,'weidmuller-8540300000');
  assert.equal(record.sourceStatus,'verified');
  assert.equal(record.widthMm,17.5);
  assert.equal(record.heightMm,92.4);
  assert.equal(record.depthMm,112.4);
  assert.equal(d.w,35);
  assert.equal(d.h,184.8);
  assert.equal(Physical.panelEligibility(d).eligible,false,'no unverified panel promotion');
  assert.equal(Physical.get({...d,instrument:'unverified-device'}),null,'wrong instrument cannot inherit WAZ5 data');
  assert.equal(Physical.get({...d,instrument:undefined}),null,'missing identity fails closed');
});
