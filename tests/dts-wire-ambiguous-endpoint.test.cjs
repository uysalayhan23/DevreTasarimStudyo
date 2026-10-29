'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Audit=require('../dist/wire-diagnostics.js');
const catalog={switch:{pins:[{id:'A'},{id:'B'}]},lamp:{pins:[{id:'P'},{id:'N'}]}};
const base={components:[{id:'s',typeId:'switch'},{id:'l',typeId:'lamp'}],junctions:[{id:'j'}]};
const wire=(from,to)=>({id:'w1',from,to});
test('P3-01 ordinary catalog terminal and junction endpoints remain valid',()=>{
 const a=Audit.scan({...base,wires:[wire({c:'s',p:'A'},{c:'l',p:'P'})]},catalog);
 const b=Audit.scan({...base,wires:[wire({j:'j'},{c:'s',p:'B'})]},catalog);
 assert.equal(a.total,0);assert.equal(b.total,0);
});
test('P3-01 mixed junction and terminal endpoint is diagnosed',()=>{
 const w=wire({j:'j',c:'s',p:'A'},{c:'l',p:'P'}),before=JSON.stringify(w);
 const r=Audit.scan({...base,wires:[w]},catalog);
 assert.equal(r.issues[0].kind,'ambiguous-endpoint');
 assert.equal(JSON.stringify(w),before);
});
test('P3-01 partially mixed junction and component reference is diagnosed',()=>{
 const r=Audit.scan({...base,wires:[wire({j:'j',c:'s'},{c:'l',p:'P'})]},catalog);
 assert.equal(r.issues[0].kind,'ambiguous-endpoint');
});
test('P3-01 mixed terminal on destination is not silently accepted',()=>{
 const r=Audit.scan({...base,wires:[wire({c:'s',p:'A'},{j:'j',p:'N'})]},catalog);
 assert.equal(r.issues[0].kind,'ambiguous-endpoint');
});
test('P3-01 invalid junction without mixed fields remains unknown-junction',()=>{
 const r=Audit.scan({...base,wires:[wire({j:'missing'},{c:'l',p:'P'})]},catalog);
 assert.equal(r.issues[0].kind,'unknown-junction');
});
