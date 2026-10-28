'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../dist/conductors.js');
const project={components:[{id:'A',typeId:'a'}],wires:[],junctions:[]};
function analyze(pins){return C.analyze(project,{a:{id:'a',kind:'terminal',pins}})}
test('direct analysis rejects malformed terminal metadata',()=>assert.equal(analyze({bad:true}).invalidCatalog,true));
test('direct analysis rejects null pin entries',()=>assert.equal(analyze([{id:'1'},null]).invalidCatalog,true));
test('direct analysis preserves valid pin entries',()=>assert.equal(analyze([{id:'1'}]).invalidCatalog,undefined));
test('synchronize reports invalid catalog without claiming valid net',()=>{const p={components:[{id:'A',typeId:'a'}],wires:[],junctions:[]};assert.ok(C.synchronize(p,{a:{id:'a',kind:'terminal',pins:[null]}}).length>0);});
