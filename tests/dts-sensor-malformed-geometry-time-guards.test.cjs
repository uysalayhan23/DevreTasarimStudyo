'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Sensors=require('../dist/sensors.js');
const definition=()=>({id:'virtual-inductive',kind:'sensor',sensorPrinciple:'inductive',
 w:50,h:40,pins:[{id:'P',side:'left'}]});
const target=()=>({id:'sensor1',rotation:0,sensing:{range:5,target:'metal',auto:true,distance:5,offset:3}});
test('P1 missing manufacturer pin collection keeps sensor settings editable',()=>{
 for(const pins of [null,undefined,{}]){
  const d={...definition(),pins};
  const s=Sensors.settings(target(),d);
  assert.equal(s.face,'right');assert.equal(s.target,'metal');assert.equal(s.range,5);
 }
});
test('P1 malformed individual pin rows cannot crash the virtual sensor face picker',()=>{
 const d={...definition(),pins:[null,{side:'left'},undefined,{side:'top'}]};
 assert.equal(Sensors.settings(target(),d).face,'right');
});
test('P1 paused, negative and nonfinite animation steps preserve target settings exactly',()=>{
 for(const dt of [NaN,Infinity,-Infinity,0,-1]){
  const c=target(),before=JSON.stringify(c);
  assert.equal(Sensors.advance(c,definition(),dt),false);
  assert.equal(JSON.stringify(c),before);
 }
});
test('P1 missing or nonfinite pointer vectors cannot reset sensor target positions',()=>{
 const d=definition(),c=target(),start=Sensors.beginDrag(c,d),before=JSON.stringify(c);
 for(const delta of [null,{x:NaN,y:2},{x:Infinity,y:0},{x:10,y:undefined}]){
  Sensors.drag(c,d,start,delta);assert.equal(JSON.stringify(c),before);
 }
});
test('P1 nonfinite pointer start anchor is ignored without editing saved settings',()=>{
 const c=target(),d=definition(),start=Sensors.beginDrag(c,d),before=JSON.stringify(c);
 start.s.mm=NaN;Sensors.drag(c,d,start,{x:10,y:0});
 assert.equal(JSON.stringify(c),before);
});
test('P1 legitimate automatic animation still moves and crosses detection boundary',()=>{
 const c=target(),d=definition(),initial=c.sensing.distance;
 assert.equal(Sensors.advance(c,d,.05),true);
 assert.notEqual(c.sensing.distance,initial);
 const states=new Set();
 for(let n=0;n<120;n++){Sensors.advance(c,d,.05);states.add(Sensors.detect(c,d).detected)}
 assert.ok(states.has(true));assert.ok(states.has(false));
});
test('P1 valid rotated target drag updates physical distance and offset',()=>{
 const d=definition(),c=target(),start=Sensors.beginDrag(c,d);
 Sensors.drag(c,d,start,{x:10,y:5});
 assert.equal(c.sensing.distance,7);assert.equal(c.sensing.offset,4);
 assert.equal(c.sensing.auto,false);
});
test('P1 valid sensor catalog terminals remain immutable after settings, drag and animation',()=>{
 const d=definition(),original=JSON.stringify(d),c=target(),start=Sensors.beginDrag(c,d);
 Sensors.settings(c,d);Sensors.drag(c,d,start,{x:5,y:0});Sensors.advance({...c,sensing:{...c.sensing,auto:true}},d,.05);
 assert.equal(JSON.stringify(d),original);
});
