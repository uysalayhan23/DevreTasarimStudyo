'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Metadata=require('../dist/physical-metadata.js');
const mappings=Object.values(Metadata.componentMap);
test('existing catalog physical mappings remain valid',()=>{for(const m of mappings)assert.equal(Metadata.validateMapping(m).ok,true);});
test('whitespace-only visual asset key is rejected',()=>{
 const m={...mappings[0],assetKey:'  '};assert.equal(Metadata.validateMapping(m).ok,false);
});
test('whitespace-only provenance identity is rejected',()=>{
 const m={...mappings[0],assetIdentityField:'materialAsset',assetIdentityValue:'  '};assert.equal(Metadata.validateMapping(m).ok,false);
});
test('valid provenance identity remains accepted',()=>{
 const m={...mappings[0],assetIdentityField:'materialAsset',assetIdentityValue:'valid-asset'};assert.equal(Metadata.validateMapping(m).ok,true);
});
