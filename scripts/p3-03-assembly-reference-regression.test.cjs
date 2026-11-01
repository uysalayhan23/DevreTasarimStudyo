'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const current=require('./connection-list.js');
const candidate=require('./connection-list-candidate.js');
const assemblies=require('./assemblies.js');
const defs={coil:{id:'coil',kind:'coil-pulse',w:120,h:120,pins:[{id:'A1'},{id:'A2'}]},switch:{pins:[{id:'1'},{id:'2'}]},'contact-no':{pins:[{id:'13'},{id:'14'}]}};
function project(){return {workspaceMode:'control',name:'Assembly QA',components:[{id:'c1',ref:'K1',typeId:'coil',x:0,y:0},{id:'c2',ref:'S1',typeId:'switch',x:100,y:0}],junctions:[],wires:[{id:'W1',from:{c:'c2',p:'1'},to:{c:'c1',p:'A1'}},{id:'W2',from:{c:'c2',p:'2'},to:{c:'aux1',p:'13'}}]}}
function built(){const p=project();assemblies.add(p,p.components[0],defs.coil,defs,()=>'aux1');return p}
const check=(p,api=candidate)=>api.audit(p,defs);
test('exact original source incorrectly rejects a real assembly from DTSAssemblies.add',()=>{const p=built(),r=check(p,current);assert.equal(r.ok,false);assert.match(r.errors.join(' '),/Tekrarlı IEC/)});
test('candidate exports a real parent and its auxiliary contact without changing topology',()=>{const p=built(),before=JSON.stringify(p),r=check(p);assert.equal(r.ok,true);assert.equal(r.rows.length,2);assert.equal(r.rows.find(x=>x.id==='W2').toRef,'K1');assert.equal(JSON.stringify(p),before)});
test('candidate allows CSV with independent terminal IDs but shared IEC parent reference',()=>{const p=built();const csv=candidate.csv(p,defs,null,v=>JSON.stringify(v));assert.match(csv,/W2/);assert.match(csv,/aux1/);assert.match(csv,/K1/)});
test('candidate accepts an auxiliary listed before its parent',()=>{const p=built();p.components.unshift(p.components.pop());assert.equal(check(p).ok,true)});
test('candidate accepts multiple auxiliary contacts of one parent',()=>{const p=built();p.components.push({...p.components[2],id:'aux2'});assert.equal(check(p).ok,true)});
test('candidate rejects an independent device that copies the parent reference',()=>{const p=built();p.components[1].ref='K1';const r=check(p);assert.equal(r.ok,false);assert.match(r.errors.join(' '),/Tekrarlı IEC/)});
test('candidate rejects an independent device with Unicode NFKC equivalent ref',()=>{const p=built();p.components[1].ref='Ｋ１';assert.equal(check(p).ok,false)});
test('candidate rejects a second unrelated assembly using the same IEC ref',()=>{const p=built();p.components.push({id:'c3',ref:'K1',typeId:'coil'});p.components.push({id:'aux3',ref:'K1',typeId:'contact-no',auxFor:'c3'});assert.equal(check(p).ok,false)});
test('candidate does not excuse an orphan auxiliary with a copied ref',()=>{const p=built();p.components[2].auxFor='absent';assert.equal(check(p).ok,false)});
test('candidate does not excuse an auxiliary whose ref disagrees with its parent',()=>{const p=built();p.components[2].ref='S1';assert.equal(check(p).ok,false)});
test('candidate does not excuse nested or circular auxiliary parent chains',()=>{const p=built();p.components[0].auxFor='aux1';assert.equal(check(p).ok,false)});
test('candidate preserves panel independent IEC reference protection',()=>{const p=built();p.workspaceMode='panel';p.panel={items:[{id:'a',ref:'K1',typeId:'coil'},{id:'b',ref:'K1',typeId:'contact-no',auxFor:'a'}],wires:[]};assert.equal(candidate.audit(p,defs).ok,false)});
test('candidate keeps independent unique refs and endpoints unchanged',()=>{const p=project();p.wires.pop();assert.equal(check(p).ok,true)});
test('candidate still rejects repeated terminal IDs',()=>{const p=built(),bad={...defs,'contact-no':{pins:[{id:'13'},{id:'13'}]}};assert.equal(candidate.audit(p,bad).ok,false)});
test('candidate rejects duplicate device identity independently of shared IEC ref',()=>{const p=built();p.components.push({...p.components[0]});assert.equal(check(p).ok,false)});
test('candidate rejects invalid wire endpoint independently of shared IEC ref',()=>{const p=built();p.wires[1].to.p='missing';assert.equal(check(p).ok,false)});
test('real DTSAssemblies.sync preserves the same parent IEC ref after a rename',()=>{const p=built();p.components[0].ref='K3';assemblies.sync(p,defs,'iec');assert.equal(p.components[2].ref,'K3');assert.equal(check(p).ok,true)});
test('real DTSAssemblies.sync does not conceal an independent conflicting device ref',()=>{const p=built();p.components[0].ref='S1';assemblies.sync(p,defs,'iec');assert.equal(p.components[2].ref,'S1');assert.equal(check(p).ok,false)});
