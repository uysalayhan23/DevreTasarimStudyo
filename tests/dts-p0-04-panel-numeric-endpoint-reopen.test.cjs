'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const PanelWiring=require('../dist/panel-wiring.js');

const legacy=(first=7,second=8)=>({
 version:7,workspaceMode:'panel',components:[],wires:[],
 panel:{
  items:[{id:first,typeId:'resistor',x:10,y:10,w:20,h:10},{id:second,typeId:'lamp-green',x:50,y:10,w:20,h:10}],
  rails:[],ducts:[],
  wires:[{id:9,from:{c:first,p:'1'},to:{c:second,p:'X1'},points:[]}]
 }
});
const reopen=project=>Projects.parse(JSON.stringify(project));

test('P0-04 legacy numeric panel endpoint owners reopen',()=>{
 const p=reopen(legacy());
 assert.equal(p.panel.wires[0].from.c,'7');
 assert.equal(p.panel.wires[0].to.c,'8');
});
test('P0-04 numeric zero owner remains valid',()=>{
 assert.equal(reopen(legacy(0,8)).panel.wires[0].from.c,'0');
});
test('P0-04 legacy panel is editable with matching item and wire IDs',()=>{
 const p=reopen(legacy());
 PanelWiring.normalize(p.panel);
 assert.equal(p.panel.items[0].id,p.panel.wires[0].from.c);
 assert.equal(p.panel.items[1].id,p.panel.wires[0].to.c);
});
test('P0-04 mixed numeric and string identities reopen',()=>{
 const p=reopen(legacy(7,'8'));
 assert.equal(p.panel.wires[0].from.c,'7');
 assert.equal(p.panel.wires[0].to.c,'8');
});
test('P0-04 missing numeric owner remains rejected',()=>{
 const p=legacy();p.panel.wires[0].from.c=99;
 assert.throws(()=>reopen(p),/Pano kablo uç referansı geçersiz/);
});
test('P0-04 numeric and string duplicate owners remain rejected',()=>{
 const p=legacy();p.panel.items.push({id:'7',typeId:'resistor'});
 assert.throws(()=>reopen(p),/Pano malzeme kimliği eksik veya tekrarlı/);
});
test('P0-04 missing pin remains rejected',()=>{
 const p=legacy();p.panel.wires[0].from={c:7};
 assert.throws(()=>reopen(p),/Pano kablo uç referansı geçersiz/);
});
test('P0-04 modern string identities remain unchanged',()=>{
 const p=reopen(legacy('7','8'));
 assert.equal(p.panel.wires[0].from.c,'7');
 assert.equal(p.panel.wires[0].to.c,'8');
});
test('P0-04 reopening does not mutate caller-owned source',()=>{
 const p=legacy();reopen(p);
 assert.equal(typeof p.panel.wires[0].from.c,'number');
});
