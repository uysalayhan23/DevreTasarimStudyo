'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),Brief=require('../dist/component-brief.js');
const d={id:'sensor-inductive',name:'Yakınlık sensörü',kind:'sensor',sensorPrinciple:'inductive',sensingRange:4,pins:[{id:'BN',side:'left'},{id:'BU',side:'left'},{id:'BK',side:'right'}]};
test('sensor card exposes real virtual range, target, distance and automation',()=>{
 const model=Brief.model(d,{ref:'B1',sensing:{target:'metal',range:8,distance:3.5,auto:true}});
 const html=Brief.markup(model);
 assert.equal(model.parameters.length,4);
 assert.match(html,/Metal parça/);assert.match(html,/8 mm/);
 assert.match(html,/3,5 mm/);assert.match(html,/Otomatik hareket/);
 assert.match(html,/Açık/);
});
test('non-sensor component shows no fabricated sensor settings',()=>{
 const m=Brief.model({id:'r',name:'Direnç',kind:'resistor',pins:[{id:'1'},{id:'2'}]},{ref:'R1'});
 assert.deepEqual(m.parameters,[]);assert.doesNotMatch(Brief.markup(m),/Sanal sensör parametreleri/);
});
test('malformed range and target use validated sensor defaults',()=>{
 const html=Brief.markup(Brief.model(d,{sensing:{target:'<img>',range:'invalid',distance:-999}}));
 assert.match(html,/Hedef yok/);assert.match(html,/4 mm/);assert.match(html,/0 mm/);assert.doesNotMatch(html,/<img/);
});
test('read-only card does not change the stored sensor setting',()=>{
 const c={ref:'B1',sensing:{target:'metal',range:7,distance:2,auto:false}};
 const data=JSON.stringify(c);Brief.markup(Brief.model(d,c));assert.equal(JSON.stringify(c),data);
});
test('catalogue and user-supplied text stays HTML escaped',()=>{
 const html=Brief.markup(Brief.model({...d,name:'<script>x</script>'},{ref:'<b>',sensing:{target:'metal',range:8,distance:2}}));
 assert.doesNotMatch(html,/<script>|<b>/);assert.match(html,/&lt;script&gt;/);assert.match(html,/Cihaz: &lt;b&gt;/);
});
