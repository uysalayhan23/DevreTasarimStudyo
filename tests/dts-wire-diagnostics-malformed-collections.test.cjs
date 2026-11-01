'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const Audit=require('../dist/wire-diagnostics.js');
const catalog={switch:{pins:[{id:'A'},{id:'B'}]},lamp:{pins:[{id:'P'},{id:'N'}]}};
const good={components:[{id:'s',typeId:'switch'},{id:'l',typeId:'lamp'}],junctions:[],wires:[{id:'w1',from:{c:'s',p:'A'},to:{c:'l',p:'P'}}]};
const has=(report,kind)=>report.issues.some(issue=>issue.kind===kind);
test('P3-04 malformed wires collection fails closed and does not mutate project',()=>{
 const project={...good,wires:{unexpected:true}},before=structuredClone(project);
 const report=Audit.scan(project,catalog);
 assert.equal(has(report,'invalid-wires'),true);
 assert.ok(report.total>0);
 assert.doesNotMatch(Audit.markup(report),/data-audit-wire="Kablo"/);
 assert.deepEqual(project,before);
});
test('P3-04 malformed components collection is diagnosed without false clean report',()=>{
 const report=Audit.scan({...good,components:{unexpected:true},wires:[]},catalog);
 assert.equal(has(report,'invalid-components'),true);
 assert.doesNotMatch(Audit.markup(report),/data-audit-wire="Bileşen"/);
});
test('P3-04 malformed component entry cannot silently disappear from diagnostics',()=>{
 const report=Audit.scan({...good,components:[...good.components,null],wires:[]},catalog);
 assert.equal(has(report,'invalid-component'),true);
 assert.doesNotMatch(Audit.markup(report),/data-audit-wire="Bileşen"/);
});
test('P3-04 invalid wire entry has no fake wire-focus button',()=>{
 const report=Audit.scan({...good,wires:[null]},catalog);
 assert.equal(has(report,'invalid-wire'),true);
 assert.doesNotMatch(Audit.markup(report),/data-audit-wire="Kablo"/);
});
test('P3-04 valid catalog wire stays clean, broken wire stays focusable and mark remains read-only',()=>{
 assert.equal(Audit.scan(good,catalog).total,0);
 const broken={...good,wires:[{...good.wires[0],to:{c:'l',p:'BAD'}}]};
 const snapshot=structuredClone(broken),report=Audit.scan(broken,catalog);
 assert.equal(has(report,'unknown-pin'),true);
 assert.match(Audit.markup(report),/data-audit-wire="w1"/);
 const toggles=[],scene={querySelectorAll:()=>[{dataset:{wire:'w1'},classList:{toggle:(name,value)=>toggles.push([name,value])}}]};
 assert.equal(Audit.mark(scene,report),1);
 assert.deepEqual(toggles,[['dts-wire-audit-highlight',true]]);
 assert.deepEqual(broken,snapshot);
});
