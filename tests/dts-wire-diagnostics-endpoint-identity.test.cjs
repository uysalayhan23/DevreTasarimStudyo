'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const A=require('../dist/wire-diagnostics.js');
const defs={sensor:{pins:[{id:'A'},{id:'B'}]}};
const base={components:[{id:'s',typeId:'sensor'}],junctions:[{id:'j'}]};
test('same physical terminal with reordered object keys is reported',()=>{
 const project={...base,wires:[{id:'w',from:{c:'s',p:'A'},to:{p:'A',c:'s'}}]};
 const r=A.scan(project,defs);assert.equal(r.total,1);
 assert.equal(r.issues[0].kind,'same-endpoint');assert.equal(project.wires[0].to.p,'A');
});
test('junction-to-same-junction detects optional metadata but not a different junction',()=>{
 const s={...base,wires:[{id:'jw',from:{j:'j'},to:{j:'j',x:32}}]};
 assert.equal(A.scan(s,defs).issues[0].kind,'same-endpoint');
 assert.equal(A.sameEndpoint({j:'j'},{j:'other'}),false);
});
test('normal different terminal or different component is not falsely reported',()=>{
 const s={...base,wires:[{id:'ok',from:{c:'s',p:'A'},to:{p:'B',c:'s'}}]};
 assert.equal(A.scan(s,defs).total,0);
 assert.equal(A.sameEndpoint({c:'s',p:'A'},{c:'another',p:'A'}),false);
});
test('missing or invalid endpoints keep original diagnostic rather than same-endpoint',()=>{
 const s={...base,wires:[{id:'w',from:{c:'s',p:'A'},to:{p:'WRONG',c:'s'}}]};
 const report=A.scan(s,defs);
 assert.equal(report.issues[0].kind,'unknown-pin');
 assert.equal(report.issues.some(i=>i.kind==='same-endpoint'),false);
});
test('matching valid integer/string IDs cannot be hidden by JSON key order',()=>{
 assert.equal(A.sameEndpoint({c:10,p:'X'},{p:'X',c:'10'}),true);
 assert.equal(A.sameEndpoint({j:123},{j:'123',note:'junction'}),true);
});
