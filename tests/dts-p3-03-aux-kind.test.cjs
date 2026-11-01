'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {audit,csv}=require('../dist/connection-list.js');
const defs={
 coil:{id:'coil',kind:'coil-pulse',pins:[{id:'A1'},{id:'A2'}]},
 overload:{id:'overload',kind:'overload',pins:[{id:'95'},{id:'96'}]},
 vpr:{id:'voltage-protection-relay',kind:'relay-protection',pins:[{id:'A1'},{id:'A2'}]},
 switch:{id:'switch',kind:'switch',pins:[{id:'1'},{id:'2'}]},
 'contact-no':{id:'contact-no',pins:[{id:'13'},{id:'14'}]},
 'thermal-contact-nc':{id:'thermal-contact-nc',pins:[{id:'95'},{id:'96'}]},
 'protection-changeover':{id:'protection-changeover',pins:[{id:'11'},{id:'12'}]}
};
const p=(parent='coil',child='contact-no')=>({workspaceMode:'control',components:[
 {id:'parent',typeId:parent,ref:'K1'}, {id:'aux',typeId:child,ref:'K1',auxFor:'parent'},
 {id:'switch',typeId:'switch',ref:'S1'}
],junctions:[],wires:[{id:'W1',from:{c:'switch',p:'1'},to:{c:'aux',p:defs[child].pins[0].id}}]});
test('real coil auxiliary is accepted',()=>{assert.equal(audit(p(),defs).ok,true)});
test('real overload auxiliary is accepted',()=>{assert.equal(audit(p('overload','thermal-contact-nc'),defs).ok,true)});
test('real voltage protection auxiliary is accepted',()=>{assert.equal(audit(p('vpr','protection-changeover'),defs).ok,true)});
test('fake switch marked auxFor cannot borrow parent IEC ref',()=>{assert.equal(audit(p('coil','switch'),defs).ok,false)});
test('wrong auxiliary type cannot borrow parent IEC ref',()=>{assert.equal(audit(p('coil','thermal-contact-nc'),defs).ok,false)});
test('non-assembly parent cannot authorize a contact with same IEC ref',()=>{assert.equal(audit(p('switch','contact-no'),defs).ok,false)});
test('unknown parent catalog definition cannot authorize IEC ref sharing',()=>{const q=p();delete defs.__unused;const bad={...defs};delete bad.coil;assert.equal(audit(q,bad).ok,false)});
test('independent duplicate IEC refs remain rejected',()=>{const q=p();q.components[2].ref='K1';assert.equal(audit(q,defs).ok,false)});
test('real auxiliary CSV preserves independent device and terminal IDs',()=>{const q=p();const s=csv(q,defs,null,v=>JSON.stringify(v));assert.match(s,/"aux"/);assert.match(s,/"K1"/);assert.match(s,/"13"/)});
test('panel mode does not permit shared IEC refs via auxFor',()=>{const q=p();q.workspaceMode='panel';q.panel={items:q.components,wires:q.wires};assert.equal(audit(q,defs).ok,false)});
test('same-parent Unicode-equivalent refs are accepted',()=>{const q=p();q.components[1].ref='Ｋ１';assert.equal(audit(q,defs).ok,true)});
