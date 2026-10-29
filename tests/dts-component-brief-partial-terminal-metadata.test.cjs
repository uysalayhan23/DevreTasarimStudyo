'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const B=require('../dist/component-brief.js');
const valid={id:'sensor-inductive',name:'Sanal sensör',kind:'sensor',sensorPrinciple:'inductive',pins:[{id:'A',side:'left',x:0,y:10}]};
test('sensor card survives a missing pin collection without manufacturing terminal IDs',()=>{
 const d={...valid,pins:null},card=B.model(d,{id:'S1',sensing:{range:5}});
 assert.equal(card.totalPins,0);assert.equal(card.terminals.length,0);
 assert.match(card.note,/bulunamadı/);assert.ok(card.parameters.length>=2);
});
test('sensor card skips corrupt terminal rows while retaining genuine pins',()=>{
 const d={...valid,pins:[null,valid.pins[0],{label:'unknown'}]};
 const original=JSON.stringify(d),card=B.model(d,{id:'S1',sensing:{range:5}});
 assert.equal(card.terminals.length,1);assert.equal(card.terminals[0].id,'A');
 assert.match(card.note,/Geçersiz 2 uç kaydı/);
 assert.equal(JSON.stringify(d),original);
});
test('known virtual sensor settings remain visible on partial card',()=>{
 const card=B.model({...valid,pins:[null,...valid.pins]},{id:'S1',sensing:{range:5,distance:2}});
 assert.equal(card.parameters.find(x=>x.label==='Sanal algılama aralığı').value,'5 mm');
 assert.equal(card.parameters.find(x=>x.label==='Sanal hedef uzaklığı').value,'2 mm');
});
test('fully verified catalog pin count retains original summary',()=>{
 const card=B.model(valid,{id:'S1'});
 assert.equal(card.note,'Toplam 1 uç');assert.equal(card.terminals[0].id,'A');
});
test('incomplete metadata stays escaped in device card HTML',()=>{
 const card=B.model({...valid,name:'<script>',pins:[null,{id:'<img>',label:'<svg>',side:'right'}]},{id:'S1'});
 const html=B.markup(card);assert.doesNotMatch(html,/<script>|<img>|<svg>/);
});
