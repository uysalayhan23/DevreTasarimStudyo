'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const Panel=require('../dist/panel-wiring.js');
const fixture=()=>({version:7,projectId:'legacy',components:[],wires:[],junctions:[],panel:{
 items:[{id:7,typeId:'x'},{id:8,typeId:'x'}],rails:[],ducts:[],
 wires:[{id:12,from:{c:'7',p:'A'},to:{c:'8',p:'B'}}]
}});
test('legacy numeric part owner loads without rewriting source IDs',()=>{
 const p=Store.parse(JSON.stringify(fixture()));assert.equal(p.panel.items[0].id,7);
});
test('editable panel normalizes numeric part and cable IDs together',()=>{
 const p=Store.parse(JSON.stringify(fixture())).panel;Panel.normalize(p);
 assert.equal(p.items[0].id,'7');assert.equal(p.wires[0].id,'12');
 assert.equal(p.wires[0].from.c,'7');
});
test('already-string part owner remains stable',()=>{
 const p=fixture();p.panel.items.forEach(i=>i.id=String(i.id));
 Panel.normalize(p.panel);assert.equal(p.panel.items[0].id,'7');
});
test('unknown part owner is rejected',()=>{
 const p=fixture();p.panel.wires[0].to.c='99';
 assert.throws(()=>Store.parse(JSON.stringify(p)),/Pano kablo uç/);
});
test('numeric and string duplicate part IDs are rejected',()=>{
 const p=fixture();p.panel.items[1].id='7';
 assert.throws(()=>Store.parse(JSON.stringify(p)),/tekrarlı/);
});
test('cable ID must not collide with part ID',()=>{
 const p=fixture();p.panel.wires[0].id='7';
 assert.throws(()=>Store.parse(JSON.stringify(p)),/tekrarlı/);
});
test('missing terminal ID is rejected',()=>{
 const p=fixture();p.panel.wires[0].from.p=null;
 assert.throws(()=>Store.parse(JSON.stringify(p)),/Pano kablo uç/);
});
test('regular control workspace remains readable',()=>{
 const p=Store.parse(JSON.stringify({version:7,components:[],wires:[],junctions:[]}));
 assert.equal(p.wires.length,0);
});
