'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {inspect,load}=require('./catalog-visual-geometry-audit.cjs');
test('real baseline catalog is exhaustively inspected',()=>{const items=load();assert.equal(items.length,703);assert.equal(inspect(items).total,703)});
test('rejects duplicate pin identities and out-of-bound terminal positions',()=>{const result=inspect([{id:'x',w:100,h:100,pins:[{id:'1',x:0,y:0},{id:'1',x:101,y:40}]}]);assert.deepEqual(result.issues.map(i=>i.issue),['duplicate-pin-id','pin-outside-footprint'])});
test('rejects invalid sizing and calibration',()=>{const x=inspect([{id:'x',w:0,h:100,pins:[]},{id:'y',w:100,h:100,pins:[],runtimeVisualCalibration:{targetFrameMm:{width:0,height:10}}}]);assert.deepEqual(x.issues.map(i=>i.issue),['invalid-footprint','invalid-calibration'])});
test('does not declare a physical scale error without manufacturer evidence',()=>{assert.equal(inspect([{id:'x',w:180,h:240,pins:[{id:'1',x:20,y:0}]}]).issues.length,0)});

