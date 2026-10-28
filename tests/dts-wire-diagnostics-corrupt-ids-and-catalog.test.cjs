'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Audit=require('../dist/wire-diagnostics.js');
const catalog={s:{pins:[null,{id:'1'},{id:'2'}]}};
const base={components:[{id:'s',typeId:'s'}],junctions:[]};
test('duplicated cable IDs are diagnosed without changing conductors',()=>{
 const wires=[{id:'w',from:{c:'s',p:'1'},to:{c:'s',p:'2'}},{id:'w',from:{c:'s',p:'2'},to:{c:'s',p:'1'}}];
 const original=JSON.stringify(wires),result=Audit.scan({...base,wires},catalog);
 assert.equal(result.issues.filter(x=>x.kind==='duplicate-wire-id').length,1);
 assert.equal(result.checked,2);assert.equal(JSON.stringify(wires),original);
});
test('missing cable ID is reported independently of terminal validity',()=>{
 const report=Audit.scan({...base,wires:[{from:{c:'s',p:'1'},to:{c:'s',p:'2'}}]},catalog);
 assert.equal(report.issues[0].kind,'missing-wire-id');
});
test('null pin records never crash or accidentally match a terminal',()=>{
 const ok=Audit.scan({...base,wires:[{id:'w',from:{c:'s',p:'1'},to:{c:'s',p:'2'}}]},catalog);
 assert.equal(ok.total,0);
 const bad=Audit.scan({...base,wires:[{id:'w',from:{c:'s',p:'9'},to:{c:'s',p:'2'}}]},catalog);
 assert.equal(bad.issues[0].kind,'unknown-pin');
});
test('corrupt components/junctions collections produce diagnostics without throwing',()=>{
 const report=Audit.scan({components:{},junctions:{},wires:[{id:'w',from:{c:'s',p:'1'},to:{j:'missing'}}]},catalog);
 assert.equal(report.checked,1);
 assert.deepEqual(report.issues.map(i=>i.kind),['missing-component','unknown-junction']);
});
