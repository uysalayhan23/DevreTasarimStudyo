'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const lim={inputCount:6,outputCount:4};
const r=(id,type,ref,contact='I1')=>({id,paths:[[{type:'NO',ref:contact}]],coil:{type,ref}});
const p=(...rungs)=>({version:1,rungs});
test('formerly SET Q1 becomes OFF with only inactive RESET Q1 remaining',()=>{
 const mem={};assert.equal(L.scan(p(r('a','SET','Q1')),{I1:true},mem,1,lim).outputs.Q1,true);
 assert.equal(L.scan(p(r('b','RESET','Q1')),{I1:false},mem,2,lim).outputs.Q1,false);
});
test('former OUT Q1 cannot stay ON when its only remaining command is RESET',()=>{
 const mem={};L.scan(p(r('a','OUT','Q1')),{I1:true},mem,1,lim);
 assert.equal(L.scan(p(r('b','RESET','Q1')),{I1:false},mem,2,lim).outputs.Q1,false);
});
test('legacy seeded Q1 does not become a phantom physical output',()=>{
 const mem={values:{Q1:true}};
 assert.equal(L.scan(p(r('b','RESET','Q1')),{I1:false},mem,1,lim).outputs.Q1,false);
});
test('same-program SET and RESET preserve legitimate latches and reset activation',()=>{
 const pg=p(r('a','SET','Q1','I1'),r('b','RESET','Q1','I2')),mem={};
 assert.equal(L.scan(pg,{I1:true,I2:false},mem,1,lim).outputs.Q1,true);
 assert.equal(L.scan(pg,{I1:false,I2:false},mem,2,lim).outputs.Q1,true);
 assert.equal(L.scan(pg,{I1:false,I2:true},mem,3,lim).outputs.Q1,false);
});
test('another assigned Q output cannot keep unrelated RESET-only Q energized',()=>{
 const mem={values:{Q1:true,Q2:true}};
 const out=L.scan(p(r('q','OUT','Q2','I2'),r('reset','RESET','Q1','I1')),{I2:true,I1:false},mem,1,lim).outputs;
 assert.equal(out.Q1,false);assert.equal(out.Q2,true);
});
test('RESET-only M retains independently owned memory behavior',()=>{
 const mem={values:{M7:true}};
 const program=p(r('r','RESET','M7'),r('q','OUT','Q1','M7'));
 assert.equal(L.scan(program,{I1:false},mem,1,lim).outputs.Q1,true);
 assert.equal(L.scan(program,{I1:true},mem,2,lim).outputs.Q1,false);
});
test('offline runtime has refreshed local cache revision',()=>{
 const fs=require('node:fs'),path=require('node:path');
 assert.match(fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8'),/ladder-runtime\.js\?rev=20261028-q-reset-owner1/);
});
