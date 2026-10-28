'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/physical-metadata.js');
test('manufacturer evidence rejects misleading userinfo host',()=>{const x=Object.values(M.products)[0];assert.equal(M.validateProduct({...x,sourceUrl:'https://trusted.example@evil.example/manual'}).ok,false);});
test('valid product and component evidence remains accepted',()=>{for(const p of Object.values(M.products))assert.equal(M.validateProduct(p).ok,true);for(const m of Object.values(M.componentMap))assert.equal(M.validateMapping(m).ok,true);});
test('terminal identity evidence rejects userinfo authority',()=>{const x=Object.values(M.componentMap)[0];assert.equal(M.validateMapping({...x,terminalIdentityStatus:'verified',terminalIdentitySourceUrl:'https://trusted.example@evil.example/spec'}).ok,false);});
