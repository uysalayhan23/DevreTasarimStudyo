'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Connection=require('../dist/connection-list.js');
const Material=require('../dist/material-list.js');
const base=()=>({workspaceMode:'control',components:[
 {id:'a',typeId:'x',ref:'A1'},{id:'b',typeId:'y',ref:'B1'}],
 junctions:[],wires:[{id:'W1',from:{c:'a',p:'1'},to:{c:'b',p:'2'}}]});
const defs=()=>({x:{pins:[{id:'1'},{id:'3'}]},y:{pins:[{id:'2'},{id:'4'}]}});
test('P3-03 single documented source and destination pins remain exportable',()=>{
 const p=base(),before=JSON.stringify(p),result=Connection.audit(p,defs());
 assert.equal(result.ok,true);assert.equal(result.rows.length,1);
 assert.equal(result.rows[0].fromPin,'1');
 assert.equal(JSON.stringify(p),before);
 assert.match(Connection.csv(p,defs(),null,Material.cell),/W1/);
});
test('P3-03 repeated source terminal ID blocks ambiguous connection export',()=>{
 const d=defs();d.x.pins.push({id:'1'});const result=Connection.audit(base(),d);
 assert.equal(result.ok,false);assert.equal(result.rows.length,0);
 assert.throws(()=>Connection.csv(base(),d,null,Material.cell),/terminal referansı/);
});
test('P3-03 repeated destination terminal ID blocks ambiguous connection export',()=>{
 const d=defs();d.y.pins.push({id:'2'});
 assert.equal(Connection.audit(base(),d).ok,false);
});
test('P3-03 duplicate unrelated terminal does not invent a different linked terminal',()=>{
 const d=defs();d.x.pins.push({id:'3'});
 const out=Connection.audit(base(),d);
 assert.equal(out.ok,true);assert.equal(out.rows[0].fromPin,'1');
});
test('P3-03 invalid terminal records do not crash the schedule',()=>{
 const d=defs();d.x.pins.unshift(null);
 assert.equal(Connection.audit(base(),d).ok,true);
});
