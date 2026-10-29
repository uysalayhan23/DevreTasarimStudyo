'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const Audit=require('../dist/wire-diagnostics.js');
const catalog={switch:{pins:[{id:'A'},{id:'B'}]},lamp:{pins:[{id:'P'},{id:'N'}]}};
const circuit={components:[{id:'s',typeId:'switch'},{id:'l',typeId:'lamp'}],junctions:[{id:'j'}],
 wires:[{id:'w1',from:{c:'s',p:'A'},to:{c:'l',p:'P'}}]};
test('known catalog terminals and junctions are structurally valid',()=>{
 assert.equal(Audit.scan(circuit,catalog).total,0);
 assert.equal(Audit.scan({...circuit,wires:[{id:'wj',from:{j:'j'},to:{c:'s',p:'B'}}]},catalog).total,0);
});
test('dangling wires are reported without mutating the project',()=>{
 const original=structuredClone(circuit);
 const report=Audit.scan({...circuit,wires:[{id:'w',from:{c:'deleted',p:'A'},to:{c:'l',p:'P'}}]},catalog);
 assert.equal(report.issues[0].kind,'missing-component');assert.deepEqual(circuit,original);
});
test('invalid pin and missing node get concrete diagnosis',()=>{
 assert.equal(Audit.scan({...circuit,wires:[{id:'w',from:{c:'s',p:'BAD'},to:{c:'l',p:'P'}}]},catalog).issues[0].kind,'unknown-pin');
 assert.equal(Audit.scan({...circuit,wires:[{id:'w',from:{j:'missing'},to:{c:'l',p:'P'}}]},catalog).issues[0].kind,'unknown-junction');
});
test('output is escaped and never claims electrical acceptance',()=>{
 const good=Audit.markup(Audit.scan(circuit,catalog));assert.match(good,/güvenlik kabulü değildir/);
 const bad=Audit.markup({total:1,checked:1,truncated:false,issues:[{wire:'<img>',message:'<script>'}]});
 assert.doesNotMatch(bad,/<img>|<script>/);
});
// Malformed junctions must not produce a false clean report or fake wire-focus buttons.
test('P3-04 malformed junction collection fails closed',()=>{
 const report=Audit.scan({...circuit,junctions:{bad:true}},catalog);
 assert.equal(report.issues[0].kind,'invalid-junctions');
 assert.equal(report.total,1);
});
test('P3-04 empty junction ID is diagnosed',()=>{
 const report=Audit.scan({...circuit,junctions:[{id:'j'},{id:'  '}]},catalog);
 assert.ok(report.issues.some(i=>i.kind==='missing-junction-id'));
});
test('P3-04 missing junction object is diagnosed',()=>{
 const report=Audit.scan({...circuit,junctions:[null,{id:'j'}]},catalog);
 assert.ok(report.issues.some(i=>i.kind==='missing-junction-id'));
});
test('P3-04 junction-only errors do not create fake wire focus buttons',()=>{
 const report=Audit.scan({...circuit,junctions:[{id:'j'},{}]},catalog);
 assert.doesNotMatch(Audit.markup(report),/data-audit-wire="Düğüm"/);
});
