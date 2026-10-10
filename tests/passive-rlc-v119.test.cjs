'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),Sim=require('../dist/simulation.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const by=Object.fromEntries(ctx.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
const wire=(a,p,b,q)=>({from:{c:a,p},to:{c:b,p:q}}),near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<=t,String(a)+' != '+String(b));
function project(components,wires){return {components,wires,junctions:[]}}
test('R, C and L use 50 Hz phasor impedance and series voltage division',()=>{
 const p=project([{id:'s',typeId:'supply-1p'},{id:'r',typeId:'resistor',resistance:1000},{id:'c',typeId:'capacitor',capacitance:100e-6}],
  [wire('s','L','r','1'),wire('r','2','c','1'),wire('c','2','s','N')]);
 assert.equal(Sim.solve(p,by,{now:0}).stable,true);
 near(p.components[2]._currentValue,230/Math.hypot(1000,1/(2*Math.PI*50*100e-6)));
 near(p.components[2]._voltageValue,p.components[2]._currentValue/(2*Math.PI*50*100e-6));
 const q=project([{id:'s',typeId:'supply-1p'},{id:'l',typeId:'reactor',inductance:.15}],
  [wire('s','L','l','1'),wire('l','2','s','N')]);
 assert.equal(Sim.solve(q,by,{now:0}).stable,true);
 near(q.components[1]._currentValue,230/(2*Math.PI*50*.15));
});
test('DC capacitor charging and inductor current advance with elapsed simulation time',()=>{
 const c=project([{id:'s',typeId:'supply-dc-plus'},{id:'r',typeId:'resistor',resistance:1000},{id:'c',typeId:'capacitor',capacitance:100e-6}],
  [wire('s','P','r','1'),wire('r','2','c','1'),wire('c','2','s','M')]);
 assert.equal(Sim.solve(c,by,{now:0}).stable,true);near(c.components[2]._voltageValue,8);near(c.components[2]._currentValue,.016);
 Sim.solve(c,by,{now:50});near(c.components[2]._voltageValue,13.3333333333);near(c.components[2]._currentValue,.0106666666667);
 const l=project([{id:'s',typeId:'supply-dc-plus'},{id:'l',typeId:'reactor',inductance:.15}],
  [wire('s','P','l','1'),wire('l','2','s','M')]);
 Sim.solve(l,by,{now:0});near(l.components[1]._currentValue,8);Sim.solve(l,by,{now:50});near(l.components[1]._currentValue,16);
});
test('diode passes forward DC with a 0.7 V drop and blocks reverse DC',()=>{
 const f=project([{id:'s',typeId:'supply-dc-plus'},{id:'d',typeId:'diode'},{id:'r',typeId:'resistor',resistance:1000}],
  [wire('s','P','d','A'),wire('d','K','r','1'),wire('r','2','s','M')]);
 assert.equal(Sim.solve(f,by,{now:0}).stable,true);near(f.components[1]._voltageValue,.70116494,.002);near(f.components[1]._currentValue,.0233,.001);
 const rev=project([{id:'s',typeId:'supply-dc-plus'},{id:'d',typeId:'diode'},{id:'r',typeId:'resistor',resistance:1000}],
  [wire('s','P','r','1'),wire('r','2','d','K'),wire('d','A','s','M')]);
 assert.equal(Sim.solve(rev,by,{now:0}).stable,true);near(rev.components[1]._currentValue,0);near(rev.components[1]._voltageValue,24);
});
test('LED uses a forward drop and the bridge rectifier reports full-wave average DC',()=>{
 const led=project([{id:'s',typeId:'supply-dc-plus'},{id:'d',typeId:'led'},{id:'r',typeId:'resistor',resistance:1000}],
  [wire('s','P','d','A'),wire('d','K','r','1'),wire('r','2','s','M')]);
 assert.equal(Sim.solve(led,by,{now:0}).stable,true);near(led.components[1]._voltageValue,2.0019,.002);near(led.components[1]._currentValue,.022,.001);
 const bridge=project([{id:'s',typeId:'supply-1p'},{id:'b',typeId:'rectifier'},{id:'r',typeId:'resistor',resistance:1000}],
  [wire('s','L','b','~1'),wire('s','N','b','~2'),wire('b','+','r','1'),wire('r','2','b','−')]);
 assert.equal(Sim.solve(bridge,by,{now:0}).stable,true);near(bridge.components[2]._currentValue,(2*Math.SQRT2/Math.PI*230)/1000,1e-6);
});

