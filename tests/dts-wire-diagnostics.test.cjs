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
 assert.equal(Audit.scan({...circuit,wires:[{from:{c:'s',p:'BAD'},to:{c:'l',p:'P'}}]},catalog).issues[0].kind,'unknown-pin');
 assert.equal(Audit.scan({...circuit,wires:[{from:{j:'missing'},to:{c:'l',p:'P'}}]},catalog).issues[0].kind,'unknown-junction');
});
test('output is escaped and never claims electrical acceptance',()=>{
 const good=Audit.markup(Audit.scan(circuit,catalog));assert.match(good,/güvenlik kabulü değildir/);
 const bad=Audit.markup({total:1,checked:1,truncated:false,issues:[{wire:'<img>',message:'<script>'}]});
 assert.doesNotMatch(bad,/<img>|<script>/);
});
