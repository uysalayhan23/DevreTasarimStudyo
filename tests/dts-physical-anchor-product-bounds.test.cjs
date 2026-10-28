'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/physical-metadata.js');
const sample=()=>JSON.parse(JSON.stringify(Object.values(M.componentMap).find(x=>x.terminalGeometryStatus==='verified')));
test('existing physical mapping contracts remain valid',()=>{for(const x of Object.values(M.componentMap))assert.equal(M.validateMapping(x).ok,true);});
test('verified terminal beyond product width must be rejected',()=>{const x=sample(),k=Object.keys(x.terminalAnchors)[0];x.terminalAnchors[k].xMm=M.products[x.productKey].widthMm+1;assert.equal(M.validateMapping(x).ok,false);});
test('verified terminal beyond product height must be rejected',()=>{const x=sample(),k=Object.keys(x.terminalAnchors)[0];x.terminalAnchors[k].yMm=M.products[x.productKey].heightMm+1;assert.equal(M.validateMapping(x).ok,false);});
