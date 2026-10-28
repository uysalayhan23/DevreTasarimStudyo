'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Metadata=require('../dist/physical-metadata.js');
const rows=Object.values(Metadata.componentMap);
test('existing provenance statuses remain accepted',()=>{for(const row of rows)assert.equal(Metadata.validateMapping(row).ok,true);});
test('unknown provenance status is rejected',()=>assert.equal(Metadata.validateMapping({...rows[0],visualSourceStatus:'nonsense'}).ok,false));
test('whitespace visual source filename is rejected',()=>assert.equal(Metadata.validateMapping({...rows[0],visualSourceFile:'   '}).ok,false));
test('valid source filename remains accepted',()=>assert.equal(Metadata.validateMapping({...rows[0],visualSourceFile:'manufacturer-front.png'}).ok,true));
