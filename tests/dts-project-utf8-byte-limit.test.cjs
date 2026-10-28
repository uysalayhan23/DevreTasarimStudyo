'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const limitMessage=/20 MB/;
const oversized={version:7,components:[],wires:[],name:'界'.repeat(7_000_000)};
const storage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
test('valid small project still parses',()=>{
 const parsed=Projects.parse(JSON.stringify({version:7,components:[],wires:[],name:'Deneme'}));
 assert.equal(parsed.name,'Deneme');
});
test('UTF-8 bytes, not UTF-16 units, enforce project parse limit',()=>{
 const raw=JSON.stringify(oversized);
 assert.ok(raw.length<20*1024*1024);
 assert.throws(()=>Projects.parse(raw),limitMessage);
});
test('oversized project cannot enter local draft persistence',async()=>{
 const store=Projects.create({storage,indexedDB:null,env:{}});
 await assert.rejects(store.put(oversized),limitMessage);
});
test('oversized project cannot be saved through file picker',async()=>{
 const store=Projects.create({storage,indexedDB:null,env:{}});
 await assert.rejects(store.save(oversized),limitMessage);
});
test('oversized project cannot be downloaded without file picker',()=>{
 const store=Projects.create({storage,indexedDB:null,env:{}});
 assert.throws(()=>store.download(oversized),limitMessage);
});
