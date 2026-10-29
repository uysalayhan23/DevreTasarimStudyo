'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Brief=require('../dist/component-brief.js');
const device={name:'Özgün PLC',kind:'plc'};
test('P7-01: duplicate terminal IDs are not shown as two physical terminals',()=>{
 const d={...device,pins:[{id:'X1',label:'I0'},{id:'X1',label:'I1'},{id:'X2',label:'Q0'}]};
 const item=Brief.model(d,{id:'P1'});
 assert.deepEqual(item.terminals.map(p=>p.id),['X1','X2']);
 assert.equal(item.totalPins,2);
 assert.match(item.note,/Geçersiz 1 uç kaydı/);
});
test('P7-01: catalog terminal IDs are preserved exactly, without whitespace matching',()=>{
 const d={...device,pins:[{id:'X1'},{id:'x1'},{id:' X1 '}]};
 assert.deepEqual(Brief.model(d,{id:'P1'}).terminals.map(p=>p.id),['X1','x1',' X1 ']);
});
test('P7-01: valid unique terminals retain original count and label',()=>{
 const item=Brief.model({...device,pins:[{id:'1',label:'A1'},{id:'2',label:'A2'}]},{id:'K1'});
 assert.equal(item.note,'Toplam 2 uç');assert.deepEqual(item.terminals.map(p=>p.label),['A1','A2']);
});
test('P7-01: malformed and duplicate rows are counted but not displayed',()=>{
 const item=Brief.model({...device,pins:[null,{id:'A'},{id:'A'},{label:'missing'},{id:'B'}]},{id:'P1'});
 assert.equal(item.totalPins,2);assert.match(item.note,/Geçersiz 3 uç kaydı/);
});
test('P7-01: duplicate escaped terminal markup cannot inject HTML',()=>{
 const item=Brief.model({...device,pins:[{id:'<img>',label:'<svg>'},{id:'<img>',label:'<script>'}]},{id:'P1'});
 const html=Brief.markup(item);
 assert.equal(item.totalPins,1);assert.doesNotMatch(html,/<img>|<svg>|<script>/);
});
