'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/physical-metadata.js');
test('existing product and mapping evidence remains valid',()=>{for(const x of Object.values(M.products))assert.equal(M.validateProduct(x).ok,true);for(const x of Object.values(M.componentMap))assert.equal(M.validateMapping(x).ok,true);});
test('verified profile requires source URL hostname',()=>{const x=Object.values(M.products).find(v=>v.profileStatus==='verified');assert.equal(M.validateProduct({...x,profileSourceUrl:'https://'}).ok,false);});
test('verified terminal geometry requires source URL hostname',()=>{const x=Object.values(M.componentMap).find(v=>v.terminalGeometryStatus==='verified');assert.equal(M.validateMapping({...x,terminalSourceUrl:'https://'}).ok,false);});
test('verified panel terminal identity requires source URL hostname',()=>{const x=Object.values(M.componentMap).find(v=>v.panelTerminals?.length);if(x)assert.equal(M.validateMapping({...x,terminalIdentitySourceUrl:'https://'}).ok,false);});
test('verified connector identity requires source URL hostname',()=>{const x=Object.values(M.componentMap).find(v=>v.connectorIdentityStatus==='verified');assert.ok(x);assert.equal(M.validateMapping({...x,connectorSourceUrl:'https://'}).ok,false);});
