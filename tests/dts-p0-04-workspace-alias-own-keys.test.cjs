'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const p=(mode,version=7)=>({projectId:'p1',name:'Workspace',version,workspaceMode:mode,components:[],wires:[]});
test('P0-04 inherited Object keys stay string workspace names',()=>{
 for(const mode of ['__proto__','constructor','toString','hasOwnProperty']){
  const opened=Projects.parse(JSON.stringify(p(mode)));
  assert.equal(opened.workspaceMode,mode);
  assert.equal(JSON.parse(JSON.stringify(opened)).workspaceMode,mode);
 }
});
test('P0-04 workspace migration does not corrupt inherited names',()=>{
 for(const version of [5,6,7]){
  assert.equal(Projects.parse(JSON.stringify(p('__proto__',version))).workspaceMode,'__proto__');
  assert.equal(Projects.parse(JSON.stringify(p('constructor',version))).workspaceMode,'constructor');
 }
});
test('P0-04 own legacy workspace aliases still normalize',()=>{
 for(const [name,expected] of Object.entries({
  installation:'building',tesisat:'building',cabinet:'panel',pano:'panel',
  'arduino-workshop':'arduino',kumanda:'control'
 })){
  assert.equal(Projects.parse(JSON.stringify(p(name))).workspaceMode,expected);
 }
});
test('P0-04 standard and unknown names retain their values',()=>{
 for(const name of ['control','building','panel','arduino','custom-mode']){
  assert.equal(Projects.parse(JSON.stringify(p(name))).workspaceMode,name);
 }
});
test('P0-04 missing workspace keeps existing mode inference',()=>{
 assert.equal(Projects.parse(JSON.stringify(p(undefined))).workspaceMode,'control');
 assert.equal(Projects.parse(JSON.stringify({...p(undefined),panel:{}})).workspaceMode,'panel');
 assert.equal(Projects.parse(JSON.stringify({...p(undefined),components:[{id:'a',typeId:'arduino-uno'}]})).workspaceMode,'arduino');
});
