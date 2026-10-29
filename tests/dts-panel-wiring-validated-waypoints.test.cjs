'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Wiring=require('../dist/panel-wiring.js');
const defs={
 a:{id:'a',kind:'lamp',w:80,h:80,pins:[{id:'A',x:80,y:40,side:'right'}]},
 b:{id:'b',kind:'lamp',w:80,h:80,pins:[{id:'B',x:0,y:40,side:'left'}]}
};
const panel=()=>({width:600,height:500,items:[
 {id:'a',typeId:'a',x:30,y:80,w:80,h:80,depth:10,mount:'plate'},
 {id:'b',typeId:'b',x:300,y:80,w:80,h:80,depth:10,mount:'plate'}
],rails:[],ducts:[],wires:[]});
const from={c:'a',p:'A'},to={c:'b',p:'B'};
const add=(p,waypoints=[])=>Wiring.connect(p,defs,from,to,'#e53935','1,5 mm²',waypoints);
test('P3-01 malformed or missing waypoint objects never throw or modify the panel',()=>{
 for(const waypoints of [null,[null],[{x:NaN,y:40,surface:'plate'}],
  [{x:50,y:40,surface:'invalid'}],[{x:20000,y:40,surface:'plate'}]]){
  const p=panel(),before=JSON.stringify(p),result=add(p,waypoints);
  assert.equal(result.ok,false);assert.equal(JSON.stringify(p),before);
 }
});
test('P3-01 unusually large waypoint sequences are rejected without side effects',()=>{
 const p=panel(),before=JSON.stringify(p),waypoints=Array.from({length:1001},(_,i)=>({x:i,y:40,surface:'plate'}));
 assert.equal(add(p,waypoints).ok,false);assert.equal(JSON.stringify(p),before);
});
test('P3-01 ordinary direct panel wiring remains supported',()=>{
 const p=panel(),result=add(p);
 assert.equal(result.ok,true,result.reason);
 assert.equal(p.wires.length,1);assert.equal(result.wire.from.p,'A');assert.equal(result.wire.to.p,'B');
});
test('P3-01 genuine manual waypoints still create routable cables',()=>{
 const p=panel(),result=add(p,[{x:250,y:50,surface:'plate'}]);
 assert.equal(result.ok,true,result.reason);assert.equal(result.wire.points[0].surface,'plate');
});
test('P6-01 incomplete physical panel dimensions do not produce phantom terminal coordinates',()=>{
 const item=panel().items[0];
 for(const invalid of [{...defs.a,w:0},{...defs.a,h:0},{...defs.a,w:NaN}]){
  assert.deepEqual(Wiring.ports(item,invalid),[]);
 }
 assert.deepEqual(Wiring.ports({...item,w:0},defs.a),[]);
});
test('P6-01 undefined manufacturer pin positions do not become fabricated zero coordinates',()=>{
 const item=panel().items[0],invalid={...defs.a,pins:[{id:'A',x:null,y:40,side:'top'}]};
 assert.deepEqual(Wiring.ports(item,invalid),[]);
});
test('P6-01 valid terminal geometry and actual numeric zero coordinates remain supported',()=>{
 const item=panel().items[0],pin=Wiring.ports(item,defs.a)[0];
 assert.equal(pin.x,110);assert.equal(pin.y,120);assert.equal(pin.z,30);
 const edge=Wiring.ports(item,{...defs.a,pins:[{id:'Z',x:0,y:0,side:'left'}]});
 assert.equal(edge.length,1);assert.equal(edge[0].x,30);assert.equal(edge[0].y,80);
});
