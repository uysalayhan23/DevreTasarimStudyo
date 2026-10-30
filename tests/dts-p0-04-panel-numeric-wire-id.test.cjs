'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const Panel=require('../dist/panel.js');

function fixture(id=17){
 return {version:7,workspaceMode:'panel',components:[],wires:[],junctions:[],
  panel:{items:[
   {id:'a',typeId:'lamp-green',x:10,y:10,w:20,h:20,depth:5,mount:'plate'},
   {id:'b',typeId:'lamp-green',x:60,y:10,w:20,h:20,depth:5,mount:'plate'}
  ],rails:[],ducts:[],wires:[
   {id,from:{c:'a',p:'1'},to:{c:'b',p:'2'},points:[]}
  ]}};
}
const imported=p=>Projects.parse(JSON.stringify(p)).panel;

test('P0-04 numeric legacy cable ID stays unchanged in the imported file model',()=>{
 assert.equal(imported(fixture()).wires[0].id,17);
});
test('P0-04 editable panel normalizes legacy numeric wire ID without losing endpoints',()=>{
 const original=imported(fixture()),ready=Panel.normalize(original);
 assert.equal(ready.wires[0].id,'17');
 assert.deepEqual(ready.wires[0].from,{c:'a',p:'1'});
 assert.deepEqual(ready.wires[0].to,{c:'b',p:'2'});
 assert.equal(Panel.normalize(JSON.parse(JSON.stringify(ready))).wires[0].id,'17');
});
test('P0-04 numeric zero and existing string cable identities remain editable',()=>{
 assert.equal(Panel.normalize(imported(fixture(0))).wires[0].id,'0');
 assert.equal(Panel.normalize(imported(fixture('wire-1'))).wires[0].id,'wire-1');
});
test('P0-04 numeric/string cable collision is rejected before editing',()=>{
 const p=fixture();p.panel.wires.push({...p.panel.wires[0],id:'17'});
 assert.throws(()=>imported(p),/Pano kablo kimliği/);
});
test('P0-04 orphan endpoint remains rejected rather than opening a phantom cable',()=>{
 const p=fixture();p.panel.wires[0].to.c='missing';
 assert.throws(()=>imported(p),/Pano kablo uç referansı/);
});
test('P0-04 numeric panel item cannot masquerade as a string terminal owner',()=>{
 const p=fixture();p.panel.items[0].id=17;p.panel.wires[0].from.c='17';
 assert.throws(()=>imported(p),/Pano kablo uç referansı/);
});
test('P0-04 nonfinite wire identity is not silently normalized',()=>{
 const p=fixture();p.panel.wires[0].id=Infinity;
 assert.throws(()=>Panel.normalize(imported(p)),/Pano kablosunun bağlı olduğu terminal/);
});
