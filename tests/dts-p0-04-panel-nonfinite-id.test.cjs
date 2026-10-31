'use strict';
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const base=()=>({version:7,projectId:'p0-04-panel-id',components:[],wires:[],panel:{items:[{id:'a'},{id:'b'}],wires:[]}});
let count=0;
const test=(name,fn)=>{fn();count++};
test('modern panel',()=>assert.doesNotThrow(()=>Store.validate(base())));
for(const id of [NaN,Infinity,-Infinity]){
  test('reject nonfinite panel item '+String(id),()=>{const p=base();p.panel.items[0].id=id;assert.throws(()=>Store.validate(p),/Pano malzeme kimliği/);});
  test('reject nonfinite panel wire '+String(id),()=>{const p=base();p.panel.wires=[{id,from:{c:'a',p:'1'},to:{c:'b',p:'2'}}];assert.throws(()=>Store.validate(p),/Pano kablo kimliği/);});
}
for(const id of [0,7]){
  test('allow finite legacy panel item '+id,()=>{const p=base();p.panel.items[0].id=id;assert.doesNotThrow(()=>Store.validate(p));});
  test('allow finite legacy panel wire '+id,()=>{const p=base();p.panel.wires=[{id,from:{c:'a',p:'1'},to:{c:'b',p:'2'}}];assert.doesNotThrow(()=>Store.validate(p));});
}
test('allow unnamed legacy panel wire',()=>{const p=base();p.panel.wires=[{from:{c:'a',p:'1'},to:{c:'b',p:'2'}}];assert.doesNotThrow(()=>Store.validate(p));});
test('reject numeric/text duplicate item',()=>{const p=base();p.panel.items[0].id=7;p.panel.items[1].id='7';assert.throws(()=>Store.validate(p),/Pano malzeme kimliği/);});
test('allow modern named wire',()=>{const p=base();p.panel.wires=[{id:'w',from:{c:'a',p:'1'},to:{c:'b',p:'2'}}];assert.doesNotThrow(()=>Store.validate(p));});
test('legacy numeric IDs survive JSON roundtrip',()=>{const p=base();p.panel.items[0].id=0;p.panel.wires=[{id:7,from:{c:'0',p:'1'},to:{c:'b',p:'2'}}];const loaded=Store.parse(JSON.stringify(p));assert.equal(loaded.panel.items[0].id,0);assert.equal(loaded.panel.wires[0].id,7);});
if(count!==15)throw Error('Expected 15 tests, got '+count);
console.log(count+'/15 PASS — P0-04 panel finite IDs');
