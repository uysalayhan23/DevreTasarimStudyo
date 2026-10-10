const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const V=require('../dist/v20.js'),Sim=require('../dist/simulation.js'),Store=require('../dist/project-store.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);
const B=Object.fromEntries(ctx.window.COMPONENT_LIBRARY.map(d=>[d.id,d])),near=(a,b,t=.001)=>assert.ok(Math.abs(a-b)<t,`${a} ≠ ${b}`);
function setup(){
 const g={id:'g',typeId:'supply-1p'},v={id:'v',typeId:V.id},m={id:'m',typeId:'motor-3p',motorConnection:'delta'},p={components:[g,v,m],wires:[],junctions:[]};V.create(v);
 const wire=(a,b,c,d)=>{const w={id:'w'+p.wires.length,from:{c:a,p:b},to:{c,p:d}};p.wires.push(w);return w;};
 wire('g','L','v','L1');wire('g','N','v','N');for(const pin of ['U','V','W'])wire('v',pin,'m',pin);
 const add=(id,typeId,extra={})=>{const c={id,typeId,...extra};p.components.push(c);return c;};
 const solve=now=>{const r=Sim.solve(p,B,{now});assert.equal(r.stable,true);return r;};
 return {g,v,m,p,wire,add,solve};
}
test('BOP ramps once per time step, reverse crosses zero, voltage/frequency reaches the connected motor',()=>{
 const t=setup();V.set(t.v,'P1040',50);V.action(t.v,'run');t.solve(0);t.solve(5000);near(t.v._v20.hz,25);near(t.v._v20.voltage,115);assert.equal(t.m._spin,1);near(t.m._motorHz,25);
 for(let i=0;i<4;i++)t.solve(5000);near(t.v._v20.hz,25);t.solve(10000);near(t.v._v20.hz,50);
 V.action(t.v,'reverse');t.solve(10000);near(t.v._v20.hz,50);t.solve(15000);near(t.v._v20.hz,25);t.solve(20000);near(t.v._v20.hz,0);assert.equal(t.m._active,false);t.solve(25000);near(t.v._v20.hz,-25);assert.equal(t.m._spin,-1);
 V.action(t.v,'stop');t.solve(25000);t.solve(30000);near(t.v._v20.hz,0);V.action(t.v,'run');t.solve(30000);t.solve(35000);near(t.v._v20.hz,-25);
});
test('output voltage can be read between U and V with existing voltmeter',()=>{
 const t=setup(),meter=t.add('vm','meter-voltmeter');t.wire('v','U','vm','1');t.wire('v','V','vm','2');V.set(t.v,'P1040',50);V.action(t.v,'run');t.solve(0);t.solve(10000);near(meter._voltageValue,230);
});
test('mains disconnect removes every output and quick commissioning inhibits running',()=>{
 const t=setup();V.set(t.v,'P0010',1);V.set(t.v,'P1040',50);V.action(t.v,'run');t.solve(0);t.solve(10000);assert.equal(t.v._v20.status,'DEVREYE ALMA');assert.equal(t.m._active,false);
 V.action(t.v,'finish');t.solve(20000);assert.equal(t.m._active,true);t.p.wires.splice(1,1);t.solve(20001);assert.equal(t.v._v20.powered,false);assert.equal(t.m._active,false);near(t.v._v20.ao,0);
});
test('PNP and NPN both require DIC and honor terminal RUN/REVERSE',()=>{
 for(const npn of [false,true]){const t=setup();V.applyMacro(t.v,'Cn002');V.set(t.v,'P1000',1);V.set(t.v,'P1040',40);t.wire('v',npn?'14':'13','v','8');t.solve(0);t.solve(10000);assert.equal(t.m._active,false);
 t.wire('v','12','v',npn?'13':'14');t.solve(10000);t.solve(20000);near(t.v._v20.hz,40);t.wire('v',npn?'14':'13','v','9');t.solve(20000);t.solve(40000);near(t.v._v20.hz,-40);assert.equal(t.m._spin,-1);}
});
test('AI1 potentiometer uses the actual resistive divider; unplugging the wiper loses the setpoint',()=>{
 const t=setup();V.applyMacro(t.v,'Cn002');t.wire('v','12','v','14');t.wire('v','13','v','8');t.add('pot','potentiometer',{potentiometer:50,potMax:1000});t.wire('v','1','pot','1');t.wire('v','5','pot','3');const w=t.wire('v','2','pot','2');t.solve(0);t.solve(10000);near(t.v._v20.hz,24.93765586);t.p.wires=t.p.wires.filter(x=>x!==w);t.solve(10000);t.solve(20000);near(t.v._v20.hz,0);
});
test('4–20mA through a real current source reaches AI2 and wire break latches F80',()=>{
 const t=setup();t.add('dc','supply-dc-plus');t.add('signal','sensor-temperature-humidity',{instrumentSettings:{temperature:20,humidity:50,measurement:'both',output:'4-20mA'}});
 t.wire('dc','P','signal','+');t.wire('dc','M','signal','−');const out=t.wire('signal','T','v','3');t.wire('signal','−','v','5');V.set(t.v,'P0756.1',3);V.set(t.v,'P1000',7);V.action(t.v,'run');t.solve(0);t.solve(10000);near(t.v._v20.ai[1].raw,12);near(t.v._v20.hz,25);
 t.p.wires=t.p.wires.filter(w=>w!==out);t.solve(10001);assert.equal(t.v._v20.fault,'F80');V.action(t.v,'reset');t.solve(10002);assert.equal(t.v._v20.fault,'F80');t.p.wires.push(out);V.action(t.v,'reset');t.solve(10003);assert.equal(t.v._v20.fault,'');assert.equal(t.m._active,false);
});
test('AO1 is a measurable current output; 500 ohm burden produces 0–10V',()=>{
 const t=setup(),a=t.add('a','meter-ammeter'),r=t.add('r','resistor',{resistance:500}),vmeter=t.add('vm','meter-voltmeter');t.wire('v','4','a','1');t.wire('a','2','r','1');t.wire('r','2','v','5');t.wire('r','1','vm','1');t.wire('r','2','vm','2');V.set(t.v,'P1040',25);V.action(t.v,'run');t.solve(0);t.solve(10000);near(a._currentValue,.01,.000001);near(vmeter._voltageValue,5,.002);
 V.set(t.v,'P0778',4);t.solve(10000);near(a._currentValue,.012,.000001);near(vmeter._voltageValue,6,.002);
});
test('DO1 and DO2 operate external lamps as isolated switch outputs',()=>{
 const t=setup();t.add('dc','supply-dc-plus');const run=t.add('run','lamp-green'),fault=t.add('fault','lamp-red');t.wire('dc','P','v','15');t.wire('v','16','run','X1');t.wire('run','X2','dc','M');t.wire('dc','P','v','19');t.wire('v','17','fault','X1');t.wire('fault','X2','dc','M');t.solve(0);assert.equal(run._active,false);assert.equal(fault._active,false);
 V.set(t.v,'P1040',30);V.action(t.v,'run');t.solve(0);t.solve(10000);assert.equal(run._active,true);t.v.v20.temperature=105;t.solve(10001);assert.equal(t.v._v20.fault,'F4');assert.equal(run._active,false);assert.equal(fault._active,true);
});
test('shorted output and abnormal mains report F1/F2/F3 without running motor',()=>{
 for(const [voltage,fault] of [[150,'F3'],[280,'F2']]){const t=setup();t.g.phaseVoltages={L:voltage};V.action(t.v,'run');t.solve(0);assert.equal(t.v._v20.fault,fault);assert.equal(t.m._active,false);}
 const t=setup();t.wire('v','U','v','V');V.set(t.v,'P1040',50);V.action(t.v,'run');t.solve(0);assert.equal(t.v._v20.fault,'F1');assert.equal(t.m._active,false);
});
test('parameter limits, stopped-only edits, quick commissioning and reset are enforced',()=>{
 const t=setup();assert.equal(V.set(t.v,'P1082',551).ok,false);assert.equal(V.set(t.v,'P1080',51).ok,false);assert.equal(V.set(t.v,'P0759.0',0).ok,false);assert.equal(V.set(t.v,'P0700',99).ok,false);
 V.set(t.v,'P1040',50);V.action(t.v,'run');t.solve(0);t.solve(10000);assert.equal(V.set(t.v,'P0700',2).ok,false);assert.equal(V.applyMacro(t.v,'Cn003').ok,false);assert.equal(V.set(t.v,'P1121',1).ok,true);V.action(t.v,'off2');t.solve(10000);near(t.v._v20.hz,0);
 assert.equal(V.action(t.v,'factory').ok,false);V.set(t.v,'P0010',30);assert.equal(V.action(t.v,'factory').ok,true);assert.equal(t.v.v20.params.P1121,10);
});
test('all supported macros map DI terminals, direct/binary frequencies and three-wire latching',()=>{
 const input={voltage:230,ai:[5,0],di:[false,false,false,false],motorConnected:true};
 const check=(macro,di,expected)=>{const c={};V.create(c);V.applyMacro(c,macro);V.tick(c,{...input,di},0);const s=V.tick(c,{...input,di},20000);near(s.target,expected);};
 check('Cn003',[true,true,true,false],25);check('Cn004',[true,true,false,false],25);check('Cn005',[true,true,false,false],10);check('Cn005',[true,false,false,false],25);
 for(const macro of ['Cn006','Cn007']){const c={};V.create(c);V.applyMacro(c,macro);V.set(c,'P1040',30);V.tick(c,{...input,di:[true,false,false,false]},0);V.tick(c,{...input,di:[true,true,false,false]},1000);let s=V.tick(c,{...input,di:[true,false,false,false]},10000);assert.equal(s.running,true,macro);s=V.tick(c,{...input,di:[false,false,false,false]},20000);assert.equal(s.running,false,macro);}
});
test('PID reference and measured feedback affect target, and JOG releases through its ramp',()=>{
 const c={};V.create(c);V.applyMacro(c,'Cn008');V.set(c,'P0756.1',0);V.set(c,'P2280',1);const i={voltage:230,ai:[5,2],di:[true,false,false,false],motorConnected:true};V.tick(c,i,0);near(V.tick(c,i,10000).target,15);near(V.tick(c,{...i,ai:[5,4]},20000).target,5);
 const t=setup();V.action(t.v,'jog');t.solve(0);t.solve(2000);near(t.v._v20.hz,5);V.action(t.v,'jog-release');t.solve(2000);t.solve(4000);near(t.v._v20.hz,0);
});
test('V20 saved settings persist while runtime state is excluded and legacy pins/settings migrate',()=>{
 const t=setup();t.v.v20.params.P1120=3;t.solve(0);const clean=Store.clean(t.p);assert.equal(clean.components.find(c=>c.id==='v').v20.params.P1120,3);assert.equal(clean.components.find(c=>c.id==='v')._v20,undefined);
 const c={driveControl:'local',driveRun:true,driveFrequency:37,driveReverse:true};const before=JSON.stringify(c);assert.equal(V.peek(c).params.P1040,37);assert.equal(JSON.stringify(c),before);V.config(c);assert.equal(c.v20.params.P0700,1);assert.equal(c.v20.reverse,true);for(const pin of ['13b','14b'])assert.ok(B[V.id].pins.some(p=>p.id===pin));
});
test('all four shipped V20 workshops use valid ports and achieve their expected speed',()=>{
 const examples={window:{DTSStarterProjects:{}}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/starter-v116.js'),'utf8'),examples);
 for(const [name,p] of Object.entries(examples.window.DTSStarterProjects)){
  for(const w of p.wires)for(const end of [w.from,w.to])assert.ok(B[p.components.find(c=>c.id===end.c).typeId].pins.some(pin=>pin.id===end.p),name+' '+JSON.stringify(end));
  const v=p.components.find(c=>c.typeId===V.id),run=p.components.find(c=>c.id==='run');if(run)run.state=true;else V.action(v,'run');Sim.solve(p,B,{now:0});const result=Sim.solve(p,B,{now:10000});assert.equal(result.stable,true);assert.equal(result.shortCircuit,false);assert.equal(p.components.find(c=>c.id==='motor')._active,true);near(v._v20.hz,{v20bop:35,v20pot:24.93765586,v20npn:30,v20current:25}[name],.002);
 }
});
test('existing analog level sensor can supply V20 AI1 from the internal 24 V source',()=>{
 const t=setup();t.add('level','sensor-level-analog',{analogPosition:50,analogMode:'current'});t.wire('v','13','level','+');t.wire('v','14','level','−');t.wire('level','Q','v','2');V.set(t.v,'P0756.0',3);V.set(t.v,'P1000',2);V.action(t.v,'run');t.solve(0);t.solve(10000);near(t.v._v20.ai[0].raw,12);near(t.v._v20.hz,25);
});
test('a series ammeter in a V20 motor phase agrees with the displayed estimated current; open windings draw none',()=>{
 for(const mode of ['star','delta']){const t=setup();t.m.motorConnection=mode;const a=t.add('amps','meter-ammeter');t.p.wires=t.p.wires.filter(w=>!(w.from.c==='v'&&w.from.p==='U'));t.wire('v','U','amps','1');t.wire('amps','2','m','U');V.set(t.v,'P1040',40);V.action(t.v,'run');t.solve(0);t.solve(10000);near(a._currentValue,t.v._v20.current,.001);t.m.motorConnection='external';t.solve(11000);assert.equal(t.m._active,false);near(t.v._v20.current,0);near(a._currentValue,0);}
});
