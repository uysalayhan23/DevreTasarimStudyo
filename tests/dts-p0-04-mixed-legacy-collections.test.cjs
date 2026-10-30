'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const c={id:'a',typeId:'lamp-green',x:10,y:20};
const w={id:'w',from:{c:'a',p:'X1'},to:{c:'a',p:'X2'}};
const base=()=>({name:'Kayıt',version:7,components:[],wires:[]});
const parse=p=>Projects.parse(JSON.stringify(p));

test('legacy devices without modern components are preserved',()=>{
  const p=base();delete p.components;p.devices=[c];
  assert.equal(parse(p).components.length,1);
});
test('legacy connections without modern wires are preserved',()=>{
  const p=base();delete p.wires;p.connections=[w];
  assert.equal(parse(p).wires.length,1);
});
test('modern-only components and wires stay readable',()=>{
  const p={...base(),components:[c],wires:[w]};
  assert.equal(parse(p).components.length,1);assert.equal(parse(p).wires.length,1);
});
test('empty duplicate legacy lists remain compatible',()=>{
  const p={...base(),devices:[],connections:[]};
  assert.equal(parse(p).components.length,0);
});
test('identical duplicate components remain compatible',()=>{
  assert.equal(parse({...base(),components:[c],devices:[c]}).components.length,1);
});
test('identical duplicate wires remain compatible',()=>{
  assert.equal(parse({...base(),wires:[w],connections:[w]}).wires.length,1);
});
test('non-empty devices cannot disappear behind empty components',()=>{
  assert.throws(()=>parse({...base(),devices:[c]}),/çelişkili/);
});
test('non-empty connections cannot disappear behind empty wires',()=>{
  assert.throws(()=>parse({...base(),connections:[w]}),/çelişkili/);
});
test('conflicting non-empty component collections are rejected',()=>{
  assert.throws(()=>parse({...base(),components:[c],devices:[{...c,id:'b'}]}),/çelişkili/);
});
test('conflicting non-empty wire collections are rejected',()=>{
  assert.throws(()=>parse({...base(),wires:[w],connections:[{...w,id:'other'}]}),/çelişkili/);
});
test('malformed legacy collections remain rejected',()=>{
  assert.throws(()=>parse({...base(),devices:'invalid'}),/geçersiz/);
});
test('future schema versions remain rejected',()=>{
  assert.throws(()=>parse({...base(),version:99}),/daha yeni/);
});
