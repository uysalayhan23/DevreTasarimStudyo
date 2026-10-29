'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),A=require('../dist/wire-diagnostics.js');
test('component ID diagnostics do not advertise non-existent cable focus',()=>{
 const html=A.markup({total:1,checked:0,truncated:false,issues:[{wire:'Bileşen',kind:'duplicate-component-id',message:'Tekrar'}]});
 assert.doesNotMatch(html,/data-audit-wire/);assert.match(html,/Bileşen/);
});
test('junction ID diagnostics do not advertise non-existent cable focus',()=>{
 const html=A.markup({total:1,checked:0,truncated:false,issues:[{wire:'Düğüm',kind:'duplicate-junction-id',message:'Tekrar'}]});
 assert.doesNotMatch(html,/data-audit-wire/);
});
test('real wire faults retain focus control',()=>{
 const html=A.markup({total:1,checked:1,truncated:false,issues:[{wire:'w1',kind:'unknown-pin',message:'Yanlış uç'}]});
 assert.match(html,/data-audit-wire="w1"/);
});
test('untrusted error content remains escaped',()=>{
 const html=A.markup({total:1,checked:0,truncated:false,issues:[{wire:'<img>',kind:'missing-component-id',message:'<script>'}]});
 assert.doesNotMatch(html,/<img>|<script>/);
});
