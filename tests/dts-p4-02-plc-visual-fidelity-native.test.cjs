'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const Materials=require('../dist/materials.js');
const Photos=require('../dist/plc-photo-data.js');
const Simulation=require('../dist/simulation.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const library=ctx.window.COMPONENT_LIBRARY;
const byId=Object.fromEntries(library.map(d=>[d.id,d]));
const asset=d=>Materials.assets[Materials.family(d)];

test('original catalog retains 703 unique component definitions',()=>{
 assert.equal(library.length,703);assert.equal(Object.keys(byId).length,703);
});
test('P4-02 family image metadata is not demoted to generic representative',()=>{
 const d=byId['plc-10-0'];assert.equal(d.isPLC,true);assert.equal(Photos[d.id],undefined);
 assert.equal(asset(d).match,'family');assert.equal(Materials.info(d).match,'family');
 assert.equal(Materials.info(d).source,asset(d).source);
});
test('P4-02 exact article image metadata is not demoted to representative',()=>{
 const d=byId['plc-10-4'];assert.equal(Photos[d.id],undefined);
 assert.equal(asset(d).match,'exact');assert.equal(Materials.info(d).match,'exact');
 assert.equal(Materials.info(d).model,asset(d).model);
});
test('all PLC catalog assets without photo overrides preserve declared fidelity',()=>{
 const entries=library.filter(d=>d.isPLC&&!Photos[d.id]&&asset(d)?.match);
 assert.ok(entries.length>=80);
 for(const d of entries)assert.equal(Materials.info(d).match,asset(d).match,d.id);
});
test('photo-specific family evidence remains authoritative',()=>{
 const d=byId['plc-0-10'];assert.ok(Photos[d.id]);
 assert.equal(Materials.info(d).match,Photos[d.id].match);
 assert.equal(Materials.info(d).source,Photos[d.id].source);
});
test('explicit catalog visualInfo remains authoritative over asset metadata',()=>{
 const d={...byId['plc-10-4'],visualInfo:{match:'representative',model:'manual review',source:'review'}};
 assert.deepEqual(Materials.info(d),d.visualInfo);
});
test('missing image evidence stays representative rather than invented exact',()=>{
 const d={id:'unknown-plc-p4-02',isPLC:true,name:'Unknown',w:116};
 assert.equal(Materials.info(d).match,'representative');
});
test('visual classification does not mutate 703 catalog or electrical pin definitions',()=>{
 const d=byId['plc-10-4'],before=JSON.stringify(d);
 Materials.info(d);assert.equal(JSON.stringify(d),before);
});
test('original Simulation.solve remains stable for positive and disconnected catalog fixtures',()=>{
 const resistor=byId.resistor;assert.ok(resistor?.pins?.length);
 for(const project of [
  {components:[{id:'R1',typeId:'resistor',x:0,y:0}],wires:[]},
  {components:[],wires:[]}
 ]){
  const r=Simulation.solve(project,byId,{now:0});assert.equal(r.blocked,false);assert.equal(r.stable,true);
 }
});
