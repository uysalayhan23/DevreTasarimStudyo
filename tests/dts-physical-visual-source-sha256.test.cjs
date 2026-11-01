'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Metadata=require('../dist/physical-metadata.js');
const base=Metadata.componentMap['disconnect-1p'];
function accepted(value){assert.deepEqual(Metadata.validateMapping(value),{ok:true});}
function rejected(value){assert.deepEqual(Metadata.validateMapping(value),{ok:false,reason:'visualSourceSha256'});}
test('P5-01 existing manufacturer mappings retain validation',()=>{for(const row of Object.values(Metadata.componentMap))assert.equal(Metadata.validateMapping(row).ok,true);});
test('P5-01 valid lowercase SHA-256 remains accepted',()=>accepted({...base,visualSourceSha256:'a'.repeat(64)}));
test('P5-01 absent optional SHA-256 remains accepted',()=>{const row={...base};delete row.visualSourceSha256;accepted(row);});
test('P5-01 explicit undefined SHA-256 remains optional',()=>accepted({...base,visualSourceSha256:undefined}));
test('P5-01 short digest rejected',()=>rejected({...base,visualSourceSha256:'a'.repeat(63)}));
test('P5-01 long digest rejected',()=>rejected({...base,visualSourceSha256:'a'.repeat(65)}));
test('P5-01 nonhex digest rejected',()=>rejected({...base,visualSourceSha256:'g'.repeat(64)}));
test('P5-01 uppercase digest rejected (canonical lowercase)',()=>rejected({...base,visualSourceSha256:'A'.repeat(64)}));
test('P5-01 leading whitespace rejected',()=>rejected({...base,visualSourceSha256:' '+'a'.repeat(64)}));
test('P5-01 trailing whitespace rejected',()=>rejected({...base,visualSourceSha256:'a'.repeat(64)+' '}));
test('P5-01 null digest rejected',()=>rejected({...base,visualSourceSha256:null}));
test('P5-01 numeric digest rejected',()=>rejected({...base,visualSourceSha256:123}));
test('P5-01 object digest rejected',()=>rejected({...base,visualSourceSha256:{}}));
test('P5-01 array digest rejected',()=>rejected({...base,visualSourceSha256:[]}));
