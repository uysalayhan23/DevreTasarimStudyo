'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Simulation=require('../dist/simulation.js');
const Clamp=require('../dist/clamp-meter.js');
const Catalog=require('../dist/catalog.js');

function library(){
 const ctx={window:{}};
 for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js'])vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+file),'utf8'),ctx);
 return ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY);
}
const byId=Object.fromEntries(library().map(d=>[d.id,d]));
const project=()=>({version:7,workspaceMode:'control',components:[
 {id:'g',typeId:'supply-1p',x:0,y:0,rotation:0,ref:'G1',label:'230 VAC'},
 {id:'r',typeId:'resistor',x:300,y:0,rotation:0,ref:'R1',label:'230 Ω',resistance:230},
 {id:'cl',typeId:'unit-ut200a',x:150,y:200,rotation:0,ref:'P1',label:'UT200A',meterPosition:1,clampedWireId:'w1',clampT:.5}
],wires:[
 {id:'w1',from:{c:'g',p:'L'},to:{c:'r',p:'1'},color:'#e53935',role:'L1',size:'1.5',points:[]},
 {id:'w2',from:{c:'r',p:'2'},to:{c:'g',p:'N'},color:'#1e88e5',role:'N',size:'1.5',points:[]}
],junctions:[],colorRoles:{}});

test('UT200A exposes only the verified 2/20/200 A AC clamp ranges',()=>{
 assert.deepEqual(Clamp.ranges.filter(x=>x[0]==='ACA').map(x=>x[1]),[2,20,200]);
 assert.equal(byId['unit-ut200a'].clampJawMm,28);assert.equal(byId['unit-ut200a'].displayCount,2000);
 assert.ok(!Clamp.ranges.some(x=>x[0]==='ACA'&&x[1]===600));
});

test('UT200A clamp reads about 1 A RMS without inserting a series meter',()=>{
 const p=project(),r=Simulation.solve(p,byId,{now:0});assert.equal(r.blocked,false);assert.equal(r.shortCircuit,false);
 const cl=p.components.find(c=>c.id==='cl');assert.equal(cl._clamp.warning,'');assert.equal(cl._clamp.unit,'A');assert.ok(Math.abs(cl._clamp.value-1)<0.02,cl._clamp.value);assert.match(cl._clamp.display,/1\.000/);
 assert.equal(p.wires.length,2);assert.ok(!p.wires.some(w=>w.from.c==='cl'||w.to.c==='cl'),'clamp current must not split the conductor');
});

test('UT200A does not pretend its clamp can measure DC current',()=>{
 const p=project();p.components[0].typeId='supply-dc-plus';p.wires[0].from.p='P';p.wires[1].to.p='M';Simulation.solve(p,byId,{now:0});
 assert.match(p.components.find(c=>c.id==='cl')._clamp.warning,/yalnız AC akım/i);
});


test('UT200A probe functions use physical red/black probes and measure AC voltage',()=>{
 const p={version:7,workspaceMode:'arduino',components:[
  {id:'g',typeId:'supply-1p',x:0,y:0,rotation:0,ref:'G1'},
  {id:'cl',typeId:'unit-ut200a',x:200,y:200,rotation:0,ref:'P1',meterPosition:4},
  {id:'red',typeId:'test-probe-red',x:450,y:160,rotation:0,ref:'PR',probeFor:'cl',probeTarget:{c:'g',p:'L'}},
  {id:'black',typeId:'test-probe-black',x:450,y:260,rotation:0,ref:'PB',probeFor:'cl',probeTarget:{c:'g',p:'N'}}
 ],wires:[
  {id:'pr',from:{c:'cl',p:'V'},to:{c:'red',p:'PLUG'},points:[]},
  {id:'pb',from:{c:'cl',p:'COM'},to:{c:'black',p:'PLUG'},points:[]}
 ],junctions:[],colorRoles:{}};
 const r=Simulation.solve(p,byId,{now:0});assert.equal(r.blocked,false);
 const cl=p.components.find(c=>c.id==='cl');assert.equal(cl._clamp.warning,'');assert.equal(cl._clamp.unit,'V');assert.ok(Math.abs(cl._clamp.value-230)<1,cl._clamp.value);
});

test('application loop treats UT200A as a live Arduino measurement device and surfaces clamp warnings',()=>{
 const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
 assert.match(app,/\['multimeter','clamp-meter'\]\.includes\(byId\[c\.typeId\]\?\.kind\)/);
 assert.match(app,/c\._meter\|\|c\._clamp/);
 assert.match(app,/UT200A · Ölçüm uyarısı/);
});


test('UT200A is available through electrical, PLC and Arduino catalog filters and all measurement areas',()=>{
 const d=byId['unit-ut200a'];assert.ok(d);
 for(const category of ['electrical','plc','arduino'])assert.equal(Catalog.matches(d,{category}),true,category);
 for(const area of ['control','panel','building','automation','measurement','electronics','motor'])assert.equal(Catalog.matches(d,{category:'electrical',area}),true,area);
});

test('UT200A resistance and continuity functions work through its physical probes on an unpowered resistor',()=>{
 const make=(resistance,continuity=false)=>({version:7,workspaceMode:'control',components:[
  {id:'r',typeId:'resistor',x:0,y:0,rotation:0,ref:'R1',resistance},
  {id:'cl',typeId:'unit-ut200a',x:250,y:200,rotation:0,ref:'P1',meterPosition:continuity?7:6,meterContinuity:continuity},
  {id:'red',typeId:'test-probe-red',x:500,y:150,rotation:0,ref:'PR',probeFor:'cl',probeTarget:{c:'r',p:'1'}},
  {id:'black',typeId:'test-probe-black',x:500,y:260,rotation:0,ref:'PB',probeFor:'cl',probeTarget:{c:'r',p:'2'}}
 ],wires:[
  {id:'pr',from:{c:'cl',p:'V'},to:{c:'red',p:'PLUG'},points:[]},
  {id:'pb',from:{c:'cl',p:'COM'},to:{c:'black',p:'PLUG'},points:[]}
 ],junctions:[],colorRoles:{}});
 const ohm=make(1000);Simulation.solve(ohm,byId,{now:0});const m1=ohm.components.find(c=>c.id==='cl');assert.equal(m1._clamp.warning,'');assert.ok(Math.abs(m1._clamp.value-1000)<1);assert.equal(m1._clamp.unit,'kΩ');
 const cont=make(5,true);Simulation.solve(cont,byId,{now:0});const m2=cont.components.find(c=>c.id==='cl');assert.equal(m2._clamp.warning,'');assert.equal(m2._clamp.beep,true);assert.ok(Math.abs(m2._clamp.value-5)<.1);
});

test('UT200A diode mode reports the modeled forward drop through red and black probes',()=>{
 const p={version:7,workspaceMode:'control',components:[
  {id:'d',typeId:'diode',x:0,y:0,rotation:0,ref:'D1'},
  {id:'cl',typeId:'unit-ut200a',x:250,y:200,rotation:0,ref:'P1',meterPosition:7,meterContinuity:false},
  {id:'red',typeId:'test-probe-red',x:500,y:150,rotation:0,ref:'PR',probeFor:'cl',probeTarget:{c:'d',p:'A'}},
  {id:'black',typeId:'test-probe-black',x:500,y:260,rotation:0,ref:'PB',probeFor:'cl',probeTarget:{c:'d',p:'K'}}
 ],wires:[
  {id:'pr',from:{c:'cl',p:'V'},to:{c:'red',p:'PLUG'},points:[]},
  {id:'pb',from:{c:'cl',p:'COM'},to:{c:'black',p:'PLUG'},points:[]}
 ],junctions:[],colorRoles:{}};
 Simulation.solve(p,byId,{now:0});const cl=p.components.find(c=>c.id==='cl');assert.equal(cl._clamp.warning,'');assert.ok(cl._clamp.value>.6&&cl._clamp.value<.8,cl._clamp.value);assert.equal(cl._clamp.unit,'V');
});
