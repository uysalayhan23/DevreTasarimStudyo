'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/physical-metadata.js');
const key='main-contact',map=M.componentMap[key];
const bad={id:key,w:100,h:10,[map.assetIdentityField||'materialAsset']:map.assetIdentityValue||map.assetKey};
test('infinite aspect tolerance does not mark distorted physical device consistent',()=>assert.equal(M.materialScaleAudit(bad,{aspectTolerance:Infinity}).status,'distorted-aspect'));
test('normal physical aspect tolerance still finds distortion',()=>assert.equal(M.materialScaleAudit(bad).status,'distorted-aspect'));
