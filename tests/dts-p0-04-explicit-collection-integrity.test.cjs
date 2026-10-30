'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

function reopen(project){return Projects.parse(JSON.stringify(project));}
for(const [name,project] of [
  ['explicit string components',{version:7,components:'damaged',wires:[]}],
  ['explicit null components',{version:7,components:null,wires:[]}],
  ['explicit object wires',{version:7,components:[],wires:{}}],
  ['explicit null wires',{version:7,components:[],wires:null}],
  ['explicit string junctions',{version:7,components:[],wires:[],junctions:'damaged'}],
  ['invalid legacy devices',{version:5,devices:{},connections:[]}],
  ['invalid legacy connections',{version:5,devices:[],connections:'damaged'}]
])test('P0-04 rejects '+name+' rather than opening a silently emptied project',()=>{
  const before=JSON.stringify(project);
  assert.throws(()=>reopen(project),/Proje (components|wires|junctions|devices|connections) listesi geçersiz/);
  assert.equal(JSON.stringify(project),before);
});
for(const [name,project] of [
  ['current v7',{version:7,components:[{id:'r1',typeId:'resistor'}],wires:[]}],
  ['legacy v5 aliases',{version:5,devices:[{id:1,type:'resistor'}],connections:[{id:2,from:{c:1,p:'A'},to:{c:1,p:'B'}}]}],
  ['empty legacy aliases',{version:5,devices:[],connections:[]}],
  ['panel-only legacy',{version:5,panel:{items:[],wires:[]}}],
  ['missing wires',{version:7,components:[]}],
  ['missing components',{version:7,wires:[]}],
  ['missing legacy junctions',{version:5,devices:[],connections:[]}]
])test('P0-04 preserves '+name+' and valid missing-array defaults',()=>{
  const before=JSON.stringify(project);
  const p=reopen(project);
  assert.ok(Array.isArray(p.components));
  assert.ok(Array.isArray(p.wires));
  assert.ok(Array.isArray(p.junctions));
  assert.equal(JSON.stringify(project),before);
});
