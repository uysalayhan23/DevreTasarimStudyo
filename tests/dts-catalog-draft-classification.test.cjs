'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Catalog=require('../dist/catalog.js');
test('custom draft without kind is classified without crash',()=>assert.equal(Catalog.classification({id:'draft',name:'Draft'}).group,'drawing'));
test('real contactor retains group',()=>assert.equal(Catalog.classification({id:'real',name:'Contactor',kind:'contactor3'}).group,'contactors'));
test('PLC draft without name is classified without crash',()=>assert.equal(Catalog.classification({id:'draft-plc',kind:'plc',isPLC:true}).group,'plc-accessories'));
test('named CPU retains CPU classification',()=>assert.equal(Catalog.classification({id:'cpu',name:'CPU 1211C',kind:'plc',isPLC:true}).group,'cpu'));
