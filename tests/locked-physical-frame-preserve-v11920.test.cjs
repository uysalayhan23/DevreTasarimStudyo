'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Symbols=require('../dist/symbols.js');
const Design=require('../dist/design-library.js');

test('editor preparation does not snap the locked real-mm frame and terminal points to 20-unit grid',()=>{
  const ctx={window:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
  const original=Design.extend(ctx.window.COMPONENT_LIBRARY);
  const expected=new Map(original.filter(d=>d.physicalScaleSource==='workspace-space-v1:user-locked')
    .map(d=>[d.id,{w:d.w,h:d.h,pins:d.pins.map(p=>({id:p.id,x:p.x,y:p.y}))}]));
  const prepared=Symbols.prepareLibrary(original);
  for(const id of ['coil-relay-dc','motor-protection-relay','mcb-1p','mcb-3p','temperature-controller','converter-pressure']){
    const actual=prepared.find(d=>d.id===id),before=expected.get(id);
    assert.ok(actual&&before,'Missing user-locked product '+id);
    assert.equal(actual.w,before.w,id+' physical width');
    assert.equal(actual.h,before.h,id+' physical height');
    assert.deepEqual(actual.pins.map(p=>({id:p.id,x:p.x,y:p.y})),before.pins,id+' physical terminals');
    assert.equal(actual.physicalDimensionsMm.width*2,actual.w,id+' mm width');
    assert.equal(actual.physicalDimensionsMm.height*2,actual.h,id+' mm height');
  }
});
