'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/physical-metadata.js');
test('all existing manufacturer records retain valid source URLs',()=>{for(const r of Object.values(M.products))assert.equal(M.validateProduct(r).ok,true);});
test('a bare HTTPS scheme is not manufacturer evidence',()=>{const r={...Object.values(M.products)[0],sourceUrl:'https://'};assert.equal(M.validateProduct(r).ok,false);});
test('all existing physical component mappings still validate',()=>{for(const m of Object.values(M.componentMap))assert.equal(M.validateMapping(m).ok,true);});
test('a bare HTTPS scheme is not terminal identity evidence',()=>{const m={...Object.values(M.componentMap)[0],terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://'};assert.equal(M.validateMapping(m).ok,false);});
