'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const Brief=require('../dist/component-brief.js');
test('selected model card shows only catalog-backed fields',()=>{
 const d={name:'Test PLC',model:'V1',kind:'plc',pins:[{id:'X1',label:'DI 0',signalType:'DI'},{id:'X2',label:'Q 0',signalType:'DO'}]};
 const item=Brief.model(d,{id:'u'});assert.equal(item.name,'Test PLC');
 assert.deepEqual(item.terminals.map(p=>p.id),['X1','X2']);assert.match(Brief.markup(item),/DI 0/);
});
test('empty selection hides summary and untrusted catalog markup is escaped',()=>{
 assert.equal(Brief.model(null,null),null);
 const item=Brief.model({name:'<img src=x>',kind:'lamp',pins:[{id:'<svg>',label:'<script>'}]},{id:'x'});
 assert.doesNotMatch(Brief.markup(item),/<img|<svg>|<script>/);
});
test('large PLC shows bounded pin samples without inventing addresses',()=>{
 const d={name:'PLC',kind:'plc',pins:Array.from({length:30},(_,i)=>({id:'X'+i}))};
 const row=Brief.model(d,{id:'x'});assert.equal(row.totalPins,30);assert.equal(row.terminals.length,8);
});
