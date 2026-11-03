'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Panel=require('../dist/panel.js');
const Wiring=require('../dist/panel-wiring.js');
const byId={relay:{id:'relay',w:40,h:50,pins:[{id:'OUT',x:40,y:25,side:'right'}]},lamp:{id:'lamp',w:40,h:50,pins:[{id:'IN',x:0,y:25,side:'left'}]}};
const clone=x=>JSON.parse(JSON.stringify(x));
function fixture(){
 const p={width:600,height:800,depth:220,doorAngle:105,rails:[],ducts:[
  {id:'duct-1',x:130,y:210,width:30,length:160,vertical:false},
  {id:'duct-2',x:65,y:410,width:30,length:110,vertical:false}],
  items:[{id:'i1',typeId:'relay',x:50,y:80,w:40,h:50,mount:'plate',depth:30},
   {id:'i2',typeId:'lamp',x:410,y:80,w:40,h:50,mount:'plate',depth:30}],wires:[]};
 const wire={id:'wire-1',from:{c:'i1',p:'OUT'},to:{c:'i2',p:'IN'},color:'#ff0000',size:'1,5 mm²',
  points:Wiring.accessoryPoints(p.ducts[0]),accessoryId:'duct-1'};
 p.wires.push(wire);
 return {p,wire,route:()=>Wiring.routes(p,byId,wire)};
}
function move(p){p.ducts[0].x=180;p.ducts[0].y=270}

test('P1-16 negative: removing moved cable duct keeps its last visible route',()=>{
 const f=fixture(),old=f.route();assert.equal(old.length,1);
 move(f.p);const current=f.route();assert.equal(current.length,1);assert.notDeepEqual(current,old);
 Panel.remove(f.p,['duct-1']);
 assert.deepEqual(f.route(),current,'Cable must not jump to previous accessory coordinates');
});
test('P1-16 negative: deleted duct leaves no dangling wire accessory ID',()=>{
 const f=fixture();move(f.p);Panel.remove(f.p,['duct-1']);
 assert.equal(Object.hasOwn(f.wire,'accessoryId'),false);
 assert.deepEqual(f.wire.points,Wiring.accessoryPoints({id:'duct-1',x:180,y:270,width:30,length:160,vertical:false}));
});
test('P1-16 positive: plain wire attributes and component terminals survive duct deletion',()=>{
 const f=fixture();move(f.p);const before=clone(f.wire),parts=clone(f.p.items);
 Panel.remove(f.p,['duct-1']);
 assert.equal(f.p.wires.length,1);assert.equal(f.wire.color,before.color);assert.equal(f.wire.size,before.size);
 assert.deepEqual(f.wire.from,before.from);assert.deepEqual(f.wire.to,before.to);assert.deepEqual(f.p.items,parts);
});
test('P1-16 positive: deleting unrelated duct does not unlink referenced duct',()=>{
 const f=fixture();const original=f.route();Panel.remove(f.p,['duct-2']);
 assert.equal(f.wire.accessoryId,'duct-1');assert.deepEqual(f.route(),original);
});
test('P1-16 positive: no duct movement still preserves displayed cable route',()=>{
 const f=fixture(),old=f.route();Panel.remove(f.p,['duct-1']);
 assert.deepEqual(f.route(),old);
});
test('P1-16 positive: removing both duct and cable actually removes cable',()=>{
 const f=fixture();Panel.remove(f.p,['duct-1','wire-1']);
 assert.deepEqual(f.p.wires,[]);assert.equal(f.p.ducts.length,1);
});
test('P1-16 positive: removing an endpoint removes wire rather than preserving a ghost',()=>{
 const f=fixture();Panel.remove(f.p,['i1']);
 assert.equal(f.p.wires.length,0);assert.equal(f.p.items.length,1);
});
test('P1-16 positive: removing a rail unmounts its item while cable stays attached',()=>{
 const f=fixture();f.p.rails=[{id:'rail-1',x:40,y:150,length:300}];
 f.p.items[0].mount='rail';f.p.items[0].railId='rail-1';
 Panel.remove(f.p,['rail-1']);
 assert.equal(f.p.items[0].mount,'plate');assert.equal(Object.hasOwn(f.p.items[0],'railId'),false);
 assert.equal(f.p.wires.length,1);
});
test('P1-16 negative: moved route survives JSON roundtrip and panel normalize after duct removal',()=>{
 const f=fixture();move(f.p);const current=f.route();Panel.remove(f.p,['duct-1']);
 const reopened=Panel.normalize(clone(f.p),byId);
 assert.deepEqual(Wiring.routes(reopened,byId,reopened.wires[0]),current);
 assert.equal(Object.hasOwn(reopened.wires[0],'accessoryId'),false);
});
test('P1-16 positive: deleting a gland accessory maintains last live cable path',()=>{
 const f=fixture();f.p.ducts[0].kind='gland';move(f.p);const before=f.route();
 Panel.remove(f.p,['duct-1']);assert.deepEqual(f.route(),before);
});
