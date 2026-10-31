'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const base=()=>({name:'Test',version:7,workspaceMode:'control',components:[],wires:[]});
function storage(fail=()=>false){const rows=new Map();return {rows,getItem:k=>rows.get(k)||null,setItem(k,v){if(fail(k))throw Error('quota');rows.set(k,String(v))},removeItem:k=>rows.delete(k)}}
test('P0-04: rejected draft write leaves generated ID and timestamp uncommitted',async()=>{
  const p=base(),s=storage(k=>k.startsWith('dts-project:'));
  await assert.rejects(Projects.create({storage:s,indexedDB:null}).put(p),/quota/);
  assert.equal(p.projectId,undefined);assert.equal(p.updatedAt,undefined);
});
test('P0-04: oversized draft leaves caller unchanged',async()=>{
  const p={...base(),name:'A'.repeat(21*1024*1024)};
  await assert.rejects(Projects.create({storage:storage(),indexedDB:null}).put(p),/20 MB/);
  assert.equal(p.projectId,undefined);assert.equal(p.updatedAt,undefined);
});
test('P0-04: successful draft commits ID, timestamp and reopens',async()=>{
  const p=base(),s=storage(),store=Projects.create({storage:s,indexedDB:null});
  const copy=await store.put(p);
  assert.ok(p.projectId);assert.equal(p.projectId,copy.projectId);assert.equal(p.updatedAt,copy.updatedAt);
  assert.equal((await store.get(copy.projectId)).name,'Test');
});
test('P0-04: numeric legacy project ID zero stays stable',async()=>{
  const p={...base(),projectId:0},s=storage();await Projects.create({storage:s,indexedDB:null}).put(p);
  assert.equal(p.projectId,0);assert.ok(s.rows.has('dts-project:0'));
});
test('P0-04: protected examples are not persisted or mutated',async()=>{
  const p={...base(),defaultTemplate:{id:'example-1',readOnly:true}},s=storage();
  await Projects.create({storage:s,indexedDB:null}).put(p);
  assert.equal(p.projectId,undefined);assert.equal(s.rows.size,0);
});
test('P0-04: failed index update does not orphan a persisted generated ID',async()=>{
  const p=base(),s=storage(k=>k==='dts-project-index');
  await assert.rejects(Projects.create({storage:s,indexedDB:null}).put(p),/quota/);
  assert.ok(p.projectId);assert.ok(s.rows.has('dts-project:'+p.projectId));
});
