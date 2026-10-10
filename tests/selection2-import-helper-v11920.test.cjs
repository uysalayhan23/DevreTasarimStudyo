const test=require('node:test');
const assert=require('node:assert/strict');
const Import=require('../scripts/selection2-import-asset.cjs');

test('Selection2 import helper knows only the six currently blocked products',()=>{
  assert.deepEqual(Object.keys(Import.PRODUCTS),[
    'siemens-3rt2016-1bb41',
    'siemens-3rv2011-1ja10',
    'siemens-5tl1163-0',
    'weidmuller-2466870000',
    'rittal-3241100',
    'sick-wtb4-3p2161'
  ]);
});

test('visual intake is fail-closed on identity, orientation, authority and HTTPS provenance',()=>{
  const base={
    product:'siemens-3rv2011-1ja10',
    ext:'.jpg',
    orientation:'orthographic-front',
    exactModel:true,
    sourceAuthority:'supplier',
    sourceUrl:'https://example.invalid/3rv.jpg'
  };
  assert.deepEqual(Import.validateVisual(base),[]);
  assert.ok(Import.validateVisual({...base,orientation:'front-perspective'}).includes('orthographic-front-required'));
  assert.ok(Import.validateVisual({...base,exactModel:false}).includes('exact-model-proof-required'));
  assert.ok(Import.validateVisual({...base,sourceAuthority:'unknown'}).includes('manufacturer-or-supplier-authority-required'));
  assert.ok(Import.validateVisual({...base,sourceUrl:'http://example.invalid/a.jpg'}).includes('https-source-url-required'));
});

test('CAD intake is scoped to exact PROtop evidence and never implies promotion',()=>{
  const good={
    product:'weidmuller-2466870000',
    ext:'.step',
    exactModel:true,
    sourceUrl:'https://example.invalid/2466870000.step'
  };
  assert.deepEqual(Import.validateCad(good),[]);
  assert.ok(Import.validateCad({...good,product:'siemens-3rv2011-1ja10'}).includes('cad-import-currently-scoped-to-protop'));
  assert.ok(Import.validateCad({...good,ext:'.png'}).includes('unsupported-cad-extension'));
  assert.ok(Import.validateCad({...good,exactModel:false}).includes('exact-model-proof-required'));
});
