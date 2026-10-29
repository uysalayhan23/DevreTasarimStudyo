'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const A=require('../dist/wire-diagnostics.js'),defs={sw:{pins:[{id:'A'},{id:'B'}]}};
test('duplicate component ids are diagnosed',()=>assert.equal(A.scan({components:[{id:'c',typeId:'sw'},{id:'c',typeId:'sw'}]},defs).issues[0].kind,'duplicate-component-id'));
test('duplicate junction ids are diagnosed',()=>assert.equal(A.scan({junctions:[{id:'j'},{id:'j'}]},defs).issues[0].kind,'duplicate-junction-id'));
test('missing component identity cannot match string undefined',()=>{
 const report=A.scan({components:[{typeId:'sw'}],wires:[{id:'w',from:{c:'undefined',p:'A'},to:{c:'undefined',p:'B'}}]},defs);
 assert.ok(report.issues.some(x=>x.kind==='missing-component-id'));assert.ok(report.issues.some(x=>x.kind==='missing-component'));
});
test('ordinary valid wired component remains free of diagnostics',()=>assert.equal(A.scan({components:[{id:'c',typeId:'sw'}],wires:[{id:'w',from:{c:'c',p:'A'},to:{c:'c',p:'B'}}]},defs).total,0));
