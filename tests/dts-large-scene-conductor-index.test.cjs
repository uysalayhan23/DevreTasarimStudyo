'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Leads=require('../dist/probe-leads.js');
const Lines=require('../dist/conductors.js');
const byId={
 device:{id:'device',kind:'relay',pins:[{id:'A'},{id:'B'}]},
 probe:{id:'probe',probeColor:'red',pins:[{id:'PLUG'}]},
 meter:{id:'meter',kind:'multimeter',pins:[{id:'COM'},{id:'V'},{id:'10A'}]},
 plc:{id:'plc',isPLC:true,pins:[{id:'Q1'},{id:'M'}]},
 dc:{id:'dc',kind:'supply-dc-plus',pins:[{id:'P'},{id:'M'}]}
};
function fixture(n=400,wires=800){
 const components=Array.from({length:n},(_,i)=>({id:'c'+i,typeId:'device'}));
 components.push({id:'probe1',typeId:'probe'},{id:'meter1',typeId:'meter'},
  {id:'cpu',typeId:'plc'},{id:'dc',typeId:'dc'});
 const all=Array.from({length:wires},(_,i)=>({
  id:'w'+i,from:{c:'c'+(i%n),p:'A'},to:{c:'c'+((i+1)%n),p:'B'},
  color:'#808080',role:'CONTROL'
 }));
 all.push(
  {id:'probe-wire',from:{c:'probe1',p:'PLUG'},to:{c:'meter1',p:'V'},color:'#111827',role:'CONTROL'},
  {id:'plc-wire',from:{c:'cpu',p:'Q1'},to:{c:'c0',p:'B'},color:'#808080',role:'CONTROL'},
  {id:'dc-wire',from:{c:'dc',p:'P'},to:{c:'c1',p:'A'},color:'#808080',role:'CONTROL'}
 );
 return {components,wires:all};
}
test('large 400-device/800-wire native synchronization avoids repeated component linear scans',()=>{
 const p=fixture();
 p.components.find=()=>{throw Error('quadratic component lookup on render')};
 assert.deepEqual(Lines.synchronize(p,byId),[]);
 assert.equal(p.wires.at(-3).role,'MEASURE');
});
test('native probe preparation uses one lookup index and keeps the red jack',()=>{
 const p=fixture(100,200);
 p.components.find=()=>{throw Error('linear lookup during preparation')};
 Leads.prepare(p,byId);
 assert.equal(p.wires.at(-3).probeLead,true);
 assert.equal(p.wires.at(-3).color,'#e53935');
 assert.equal(p.components.at(-3)._redProbeJack,'V');
});
test('native sync keeps fixed DC positive and PLC Q1 terminal identity',()=>{
 const p=fixture(20,40);Lines.synchronize(p,byId);
 const dc=p.wires.at(-1),plc=p.wires.at(-2);
 assert.equal(dc.color,'#e53935');
 assert.equal(dc.role,'+24V');
 assert.equal(plc.from.p,'Q1');
 assert.equal(p.components.find(c=>c.id==='cpu')._terminalLines.Q1.color,plc.color);
});
test('fresh index reflects component type changes between synchronizations',()=>{
 const p={components:[{id:'a',typeId:'device'},{id:'b',typeId:'device'}],
  wires:[{id:'x',from:{c:'a',p:'PLUG'},to:{c:'b',p:'A'},color:'#808080',role:'CONTROL'}]};
 Lines.synchronize(p,byId);
 assert.equal(p.wires[0].probeLead,undefined);
 p.components[0].typeId='probe';
 Lines.synchronize(p,byId);
 assert.equal(p.wires[0].probeLead,true);
 assert.equal(p.wires[0].color,'#e53935');
});
test('duplicate component IDs preserve first-match probe interpretation',()=>{
 const p={components:[{id:'dup',typeId:'probe'},{id:'dup',typeId:'device'},{id:'meter',typeId:'meter'}],
  wires:[{id:'x',from:{c:'dup',p:'PLUG'},to:{c:'meter',p:'COM'},color:'#808080'}]};
 Leads.prepare(p,byId);
 assert.equal(p.wires[0].probeLead,true);
 assert.equal(p.wires[0].color,'#e53935');
});
test('malformed catalog remains fail closed and marks affected wire conflict',()=>{
 const p={components:[{id:'a',typeId:'bad'},{id:'b',typeId:'device'}],
  wires:[{id:'x',from:{c:'a',p:'A'},to:{c:'b',p:'B'},color:'#808080'}]};
 const result=Lines.synchronize(p,{...byId,bad:{kind:'relay',pins:[null]}});
 assert.equal(result.length,1);
 assert.equal(p.wires[0]._lineConflict,true);
});
test('standalone probe identity lookup works without an index',()=>{
 const p=fixture(5,10),w=p.wires.at(-3);
 assert.equal(Leads.info(p,byId,w).role,'MEASURE');
 assert.equal(Leads.info(p,byId,p.wires[0]),null);
});
test('repeated synchronization preserves wire colors and measurement identity',()=>{
 const p=fixture(30,60);Lines.synchronize(p,byId);
 const before=p.wires.map(w=>[w.id,w.color,w.role,!!w.probeLead]);
 Lines.synchronize(p,byId);
 assert.deepEqual(p.wires.map(w=>[w.id,w.color,w.role,!!w.probeLead]),before);
 assert.equal(p.wires.at(-3).role,'MEASURE');
});
