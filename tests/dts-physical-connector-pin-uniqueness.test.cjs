'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/physical-metadata.js');
const verified=Object.values(M.componentMap).find(m=>m.connectorPinAssignment);
test('existing verified connector mapping remains valid',()=>assert.equal(M.validateMapping(verified).ok,true));
test('duplicate physical connector pin number is rejected',()=>{
 const m=JSON.parse(JSON.stringify(verified)),k=Object.keys(m.connectorPinAssignment);
 m.connectorPinAssignment[k[1]]=m.connectorPinAssignment[k[0]];
 const result=M.validateMapping(m);assert.equal(result.ok,false);assert.equal(result.reason,'connectorPinAssignment');
});
test('nonpositive physical connector pin number is rejected',()=>{
 const m=JSON.parse(JSON.stringify(verified)),k=Object.keys(m.connectorPinAssignment);
 m.connectorPinAssignment[k[0]]=0;assert.equal(M.validateMapping(m).ok,false);
});
