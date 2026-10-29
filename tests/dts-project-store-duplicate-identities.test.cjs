'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Projects=require('../dist/project-store.js');
const base=()=>({version:7,workspaceMode:'control',components:[{id:'c',typeId:'lamp-green',x:20,y:30}],
 junctions:[{id:'j',x:100,y:110}],wires:[{id:'w1',from:{c:'c',p:'A'},to:{j:'j'}}]});
const imported=p=>Projects.parse(JSON.stringify(p));
test('P0-04 valid named components, junctions and wires import without mutation',()=>{
 const data=base(),original=JSON.stringify(data);
 assert.equal(imported(data).wires[0].id,'w1');
 assert.equal(JSON.stringify(data),original);
});
test('P0-04 duplicate junction IDs are rejected, even with different coordinates',()=>{
 const data=base();data.junctions.push({id:'j',x:200,y:300});
 assert.throws(()=>imported(data),/birleşim noktası kimliği tekrarlanıyor/);
});
test('P0-04 blank component IDs are rejected before a phantom reference can be resolved',()=>{
 for(const id of ['', '   ']){const p=base();p.components[0].id=id;
  assert.throws(()=>imported(p),/eleman kimliği/);}
});
test('P0-04 blank junction IDs are rejected',()=>{
 for(const id of ['', '  ']){const p=base();p.junctions[0].id=id;
  assert.throws(()=>imported(p),/birleşim noktaları/);}
});
test('P0-04 repeated cable IDs are rejected without changing endpoints',()=>{
 const p=base();p.wires.push({...p.wires[0]});
 assert.throws(()=>imported(p),/kablo kimliği geçersiz veya tekrarlanıyor/);
});
test('P0-04 existing wire with blank ID cannot be given a false independent identity',()=>{
 const p=base();p.wires[0].id='';
 assert.throws(()=>imported(p),/kablo kimliği geçersiz/);
});
test('P0-04 legacy unnamed wire and numeric wire identities still migrate',()=>{
 const a=base();delete a.wires[0].id;
 assert.equal(imported(a).wires[0].id,undefined);
 const b=base();b.wires[0].id=9;b.components[0].id=1;b.wires[0].from.c=1;
 assert.equal(imported(b).wires[0].id,'9');assert.equal(imported(b).components[0].id,'1');
});
test('P0-04 bundled protected panel continues to parse without unlocking readonly state',()=>{
 const p=JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'),'utf8'));
 const parsed=imported(p);
 assert.equal(parsed.panel.items.length,15);assert.equal(Projects.isProtected(parsed),true);
});
