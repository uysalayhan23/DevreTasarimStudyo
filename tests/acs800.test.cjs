const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const A=require('../dist/acs800.js'),Sim=require('../dist/simulation.js'),Store=require('../dist/project-store.js'),Symbols=require('../dist/symbols.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);const B=Object.fromEntries(ctx.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
const near=(a,b,t=.005)=>assert.ok(Math.abs(a-b)<t,`${a} ≠ ${b}`);
function setup(){
 const g={id:'g',typeId:'supply-3p'},v={id:'v',typeId:A.id},m={id:'m',typeId:'motor-3p',motorConnection:'star'},p={components:[g,v,m],wires:[],junctions:[]};A.create(v);
 const wire=(a,b,c,d)=>{const w={id:'w'+p.wires.length,from:{c:a,p:b},to:{c,p:d}};p.wires.push(w);return w;};
 ['U1','V1','W1'].forEach((x,i)=>wire('g','L'+(i+1),'v',x));['U2','V2','W2'].forEach((x,i)=>wire('v',x,'m',['U','V','W'][i]));
 const add=(id,typeId,extra={})=>{const c={id,typeId,...extra};p.components.push(c);return c;};
 const solve=now=>{const r=Sim.solve(p,B,{now});assert.equal(r.stable,true,JSON.stringify(r));return r;};
 const start=()=>{v.acs800.reference=1480;A.action(v,'run');solve(0);solve(20000);};return {g,v,m,p,wire,add,solve,start};
}
test('R5 real sockets, 6 DI + DIIL, 3 AI, 2 AO and 3 changeover relays have unique matching drawing ports',()=>{
 const d=B[A.id];assert.equal(A.rating.frame,'R5');assert.equal(A.rating.model,'ACS800-04-0075-3');assert.equal(d.pins.length,47);assert.equal(new Set(d.pins.map(p=>p.id)).size,47);assert.deepEqual(d.pins.map(p=>p.id).sort(),d.materialPins.map(p=>p.id).sort());
 assert.equal(d.pins.filter(p=>p.block==='X21').length,12);assert.equal(d.pins.filter(p=>p.block==='X22').length,11);
 const power=d.materialPins.filter(p=>!p.block).sort((a,b)=>a.x-b.x).map(p=>p.id);assert.deepEqual(Array.from(power),['PE','U1','V1','W1','R-','R+','UDC-','U2','V2','W2','PE2']);
});
test('local reference ramps once, drives real motor, reverse crosses zero and scalar mode uses Hz',()=>{
 const t=setup();A.set(t.v,'10.03',3);t.v.acs800.reference=1480;A.action(t.v,'run');t.solve(0);t.solve(10000);near(t.v._acs800.hz,1500/1480*25);assert.equal(t.m._spin,1);t.solve(10000);near(t.v._acs800.hz,1500/1480*25);t.solve(20000);near(t.v._acs800.hz,50);near(t.m._motorHz,50);A.action(t.v,'reverse');t.solve(20000);t.solve(60000);near(t.v._acs800.hz,-50);assert.equal(t.m._spin,-1);
 A.action(t.v,'stop');t.solve(60000);A.set(t.v,'99.04',65535);t.v.acs800.reference=25;A.action(t.v,'run');t.solve(60000);t.solve(80000);near(t.v._acs800.hz,-25);
});
test('panel STOP is ineffective in REMOTE terminal control, DI direction needs REQUEST',()=>{
 const t=setup();t.v.acs800.local=false;A.set(t.v,'11.03',1);t.v.acs800.reference=1480;t.wire('v','X22:7','v','X22:1');t.wire('v','X22:7','v','X22:2');t.solve(0);t.solve(20000);near(t.v._acs800.hz,50);assert.equal(A.action(t.v,'stop').ok,false);t.solve(21000);assert.equal(t.m._active,true);
 t.p.wires.pop();t.p.wires.pop();t.solve(21000);A.set(t.v,'10.03',3);t.wire('v','X22:7','v','X22:1');t.wire('v','X22:7','v','X22:2');t.solve(21000);t.solve(41000);near(t.v._acs800.hz,-50);A.action(t.v,'local');A.action(t.v,'stop');t.solve(41000);assert.equal(t.m._active,false);
});
test('DIIL factory bridge, external interlock, OFF3 ramp, and restart edge follow manual',()=>{
 const t=setup();A.set(t.v,'21.09',2);A.set(t.v,'22.07',4);t.start();t.v.acs800.diilBridge=false;t.solve(20000);t.solve(22000);assert.ok(t.v._acs800.hz>0&&t.v._acs800.hz<26);t.solve(24000);near(t.v._acs800.hz,0);assert.equal(t.v._acs800.restart,true);t.wire('v','X22:7','v','X22:11');t.solve(30000);near(t.v._acs800.hz,0);A.action(t.v,'stop');t.solve(30000);A.action(t.v,'run');t.solve(30000);t.solve(50000);near(t.v._acs800.hz,50);
});
test('AI1 actual potentiometer divider requires its differential return',()=>{
 const t=setup();t.v.acs800.local=false;t.wire('v','X22:7','v','X22:1');t.add('pot','potentiometer',{potMax:1000,potentiometer:50});t.wire('v','X21:1','pot','1');t.wire('v','X21:2','pot','3');t.wire('pot','2','v','X21:3');t.solve(0);t.solve(30000);near(t.v._acs800.hz,0);t.wire('v','X21:4','v','X21:2');t.solve(30000);t.solve(60000);near(t.v._acs800.ai[0].raw,4.99376);near(t.v._acs800.hz,4.99376/10*1500/1480*50);
});
test('AI2 current burden, 4–20 mA scaling and analog-loss fault work on real connections',()=>{
 const t=setup();t.add('dc','supply-dc-plus');t.add('signal','sensor-temperature-humidity',{instrumentSettings:{temperature:20,humidity:50,measurement:'both',output:'4-20mA'}});t.wire('dc','P','signal','+');t.wire('dc','M','signal','−');const out=t.wire('signal','T','v','X21:5');t.wire('signal','−','v','X21:6');t.wire('v','X22:7','v','X22:1');t.v.acs800.local=false;A.set(t.v,'11.03',3);A.set(t.v,'13.06',2);t.solve(0);t.solve(30000);near(t.v._acs800.ai[1].raw,12);near(t.v._acs800.hz,1500/1480*25);
 t.p.wires=t.p.wires.filter(w=>w!==out);t.solve(30001);assert.equal(t.v._acs800.fault,'8110');A.action(t.v,'reset');t.solve(30002);assert.equal(t.v._acs800.fault,'8110');t.p.wires.push(out);A.action(t.v,'reset');t.solve(30003);assert.equal(t.v._acs800.fault,'');
});
test('AO1 and AO2 are independent measurable current loops with 700-ohm capacity',()=>{
 const t=setup();for(let i=0;i<2;i++){t.add('a'+i,'meter-ammeter');t.add('r'+i,'resistor',{resistance:500});t.add('vm'+i,'meter-voltmeter');t.wire('v','X21:'+(9+2*i),'a'+i,'1');t.wire('a'+i,'2','r'+i,'1');t.wire('r'+i,'2','v','X21:'+(10+2*i));t.wire('r'+i,'1','vm'+i,'1');t.wire('r'+i,'2','vm'+i,'2');}
 A.set(t.v,'15.04',0);A.set(t.v,'15.09',0);t.start();near(t.p.components.find(c=>c.id==='a0')._currentValue,.020,1e-5);near(t.p.components.find(c=>c.id==='a1')._currentValue,.010,1e-5);near(t.p.components.find(c=>c.id==='vm0')._voltageValue,10,.01);
 A.set(t.v,'15.08',2);t.solve(20000);near(t.p.components.find(c=>c.id==='a1')._currentValue,.012,1e-5);
});
test('three dry relays really switch NC/C/NO and RO delays use elapsed time',()=>{
 const t=setup();t.add('dc','supply-dc-plus');for(let i=0;i<3;i++){t.add('h'+i,'lamp-green');t.wire('dc','P','v','X'+(25+i)+':2');t.wire('v','X'+(25+i)+':3','h'+i,'X1');t.wire('h'+i,'X2','dc','M');}
 A.set(t.v,'14.06',2);t.solve(0);assert.equal(t.p.components.find(c=>c.id==='h0')._active,true);assert.equal(t.p.components.find(c=>c.id==='h1')._active,false);assert.equal(t.p.components.find(c=>c.id==='h2')._active,true);A.action(t.v,'run');t.solve(0);t.solve(1000);assert.equal(t.p.components.find(c=>c.id==='h1')._active,false);t.solve(2000);assert.equal(t.p.components.find(c=>c.id==='h1')._active,true);t.v.acs800.temperature=105;t.solve(2001);assert.equal(t.v._acs800.fault,'4210');assert.equal(t.p.components.find(c=>c.id==='h2')._active,false);
});
test('three-wire pulse latch, stop and constant speed bit selection',()=>{
 const t=setup();A.set(t.v,'10.01',5);t.v.acs800.local=false;A.set(t.v,'11.03',1);t.v.acs800.reference=1200;const stop=t.wire('v','X22:7','v','X22:2');t.solve(0);const start=t.wire('v','X22:7','v','X22:1');t.solve(1);t.p.wires=t.p.wires.filter(w=>w!==start);t.solve(30000);assert.equal(t.m._active,true);t.wire('v','X22:7','v','X22:5');t.wire('v','X22:7','v','X22:6');t.solve(30000);t.solve(60000);near(t.v._acs800.rpm,900);t.p.wires=t.p.wires.filter(w=>w!==stop);t.solve(60000);assert.equal(t.m._active,false);
});
test('run enable, external error and parameter locking are effective',()=>{
 const t=setup();A.set(t.v,'16.01',4);t.start();assert.equal(t.m._active,false);t.wire('v','X22:7','v','X22:3');t.solve(20000);t.solve(40000);assert.equal(t.m._active,true);assert.equal(A.set(t.v,'99.06',120).ok,false);A.set(t.v,'30.03',5);t.solve(40001);assert.equal(t.v._acs800.fault,'9000');t.wire('v','X22:7','v','X22:4');A.action(t.v,'reset');t.solve(40002);assert.equal(t.v._acs800.fault,'');A.set(t.v,'16.02',65535);assert.equal(A.set(t.v,'22.02',2).ok,false);A.set(t.v,'16.03',358);assert.equal(A.set(t.v,'22.02',2).ok,true);
});
test('input missing phase, voltage limits and shorted output trip the drive',()=>{
 for(const [voltage,code] of [[100,'3220'],[350,'3210']]){const t=setup();t.g.phaseVoltages={L1:voltage,L2:voltage,L3:voltage};t.start();assert.equal(t.v._acs800.fault,code);assert.equal(t.m._active,false);}
 const t=setup();t.p.wires.splice(2,1);t.start();assert.equal(t.v._acs800.fault,'3130');const s=setup();s.wire('v','U2','v','V2');s.start();assert.equal(s.v._acs800.fault,'2310');
});
test('external X23 supply keeps RMIO alive without energizing motor',()=>{
 const t=setup();t.p.wires=t.p.wires.slice(3);t.add('dc','supply-dc-plus');t.wire('dc','P','v','X23:1');t.wire('dc','M','v','X23:2');A.set(t.v,'16.09',2);t.start();assert.equal(t.v._acs800.board,true);assert.equal(t.v._acs800.powered,false);assert.equal(t.m._active,false);assert.equal(t.v._acs800.fault,'');
});
test('PID macro uses selected external location, AI2 feedback and active PID tuning',()=>{
 const c={};A.create(c);A.applyMacro(c,3);A.set(c,'40.13',1);c.acs800.local=false;const input={voltage:400,phases:3,ai:[5,.5,0],di:[false,false,true,false,true,true],diil:true,motorConnected:true};A.tick(c,input,0);let s=A.tick(c,input,30000);near(s.target,25*1500/1480/100*50);s=A.tick(c,{...input,ai:[5,1,0]},60000);near(s.target,0);
});
test('macro/user settings survive serialization while simulation state is removed; renders remain pure',()=>{
 const t=setup();A.set(t.v,'22.02',3);A.applyMacro(t.v,7);A.set(t.v,'22.02',4);A.applyMacro(t.v,6);assert.equal(t.v.acs800.params['22.02'],3);t.solve(0);const saved=Store.clean(t.p).components.find(c=>c.id==='v');assert.ok(saved.acs800);assert.equal(saved._acs800,undefined);const before=JSON.stringify(t.v);for(const mode of ['iec','material']){const svg=Symbols.markup(B[A.id],t.v,{mode});assert.match(svg,/data-acs800-action="params"/);assert.match(svg,/data-port="X22:11"/);}assert.equal(JSON.stringify(t.v),before);
});
test('isolated digital groups require J1 or an explicit return; mains phase order does not reverse an inverter',()=>{
 const t=setup();t.v.acs800.local=false;t.v.acs800.j1=false;A.set(t.v,'11.03',1);t.v.acs800.reference=1480;t.wire('v','X22:7','v','X22:1');t.solve(0);t.solve(20000);assert.equal(t.m._active,false);
 t.wire('v','X22:9','v','X22:10');t.solve(20000);t.solve(40000);assert.equal(t.m._spin,1);[t.p.wires[0].from.p,t.p.wires[1].from.p]=[t.p.wires[1].from.p,t.p.wires[0].from.p];t.solve(50000);assert.equal(t.m._spin,1);
});
test('line voltmeter and series ammeter follow the motor output, disconnected motor has no current',()=>{
 const t=setup(),am=t.add('am','meter-ammeter'),vol=t.add('vol','meter-voltmeter');t.p.wires=t.p.wires.filter(w=>!(w.from.c==='v'&&w.from.p==='U2'));t.wire('v','U2','am','1');t.wire('am','2','m','U');t.wire('v','U2','vol','1');t.wire('v','V2','vol','2');t.start();near(vol._voltageValue,230*Math.sqrt(3));near(am._currentValue,t.v._acs800.current,.05);t.p.wires=t.p.wires.filter(w=>w.to.c!=='m');t.solve(21000);near(t.v._acs800.current,0);
});
test('relay coils drop immediately on total power loss even with an off-delay',()=>{
 const t=setup();A.set(t.v,'14.05',10);t.solve(0);assert.equal(t.v._acs800.ro[0],true);t.p.wires=t.p.wires.slice(3);t.solve(1);assert.equal(t.v._acs800.ro[0],false);
});
test('four shipped ACS800 workshops contain valid sockets and reach measurable working states',()=>{
 const ctx={window:{DTSStarterProjects:{}}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/starter-v117.js'),'utf8'),ctx);
 for(const [name,raw] of Object.entries(ctx.window.DTSStarterProjects)){
  const p=JSON.parse(JSON.stringify(raw)),v=p.components.find(c=>c.typeId===A.id);for(const w of p.wires)for(const e of [w.from,w.to])assert.ok(B[p.components.find(c=>c.id===e.c).typeId].pins.some(t=>t.id===e.p),name+': '+JSON.stringify(e));
  const run=p.components.find(c=>c.id==='run');if(run)run.state=true;else A.action(v,'run');for(const now of [0,30000,60000])assert.equal(Sim.solve(p,B,{now}).stable,true,name);assert.equal(v._acs800.fault,'',name);assert.ok(v._acs800.hz>0,name);assert.equal(p.components.find(c=>c.id==='motor')._spin,1,name);
 }
});
