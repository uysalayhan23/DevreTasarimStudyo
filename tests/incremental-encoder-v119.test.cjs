'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Encoder=require('../dist/incremental-encoder.js'),ArduinoLib=require('../dist/arduino-library.js'),Arduino=require('../dist/arduino-runtime.js');
const Workspaces=require('../dist/workspaces.js'),Catalog=require('../dist/catalog.js'),Simulation=require('../dist/simulation.js');

const scope={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),scope);Encoder.installMechanicalPins(scope.window.COMPONENT_LIBRARY);
const shared=scope.window.COMPONENT_LIBRARY.find(d=>d.id==='encoder-incremental');
const byId=Object.fromEntries([...ArduinoLib.components,shared].map(d=>[d.id,d]));
let wi=0;
const W=(a,ap,b,bp)=>({id:'ew'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},points:[],color:'#d32f2f',role:'SIGNAL'});

test('38 mm photoelectric encoder keeps uploaded document pinout and limits',()=>{
 assert(shared&&shared.incrementalEncoder38mm);
 assert.equal(shared.kind,'incremental-encoder');assert.equal(shared.outputType,'NPN');assert.equal(shared.openCollector,true);
 assert.deepEqual(Array.from(shared.encoderPprOptions),[100,360,400,600,1000]);
 assert.deepEqual([shared.encoderSupplyMin,shared.encoderSupplyMax],[5,24]);
 assert.equal(shared.encoderMaxCurrentMa,40);assert.equal(shared.encoderMaxResponseHz,100000);
 assert.equal(shared.encoderMaxRpm,3000);assert.equal(shared.encoderMechanicalMaxRpm,5000);
 assert.deepEqual(Array.from(shared.pins,p=>[p.id,p.label]),[
  ['+','RED · +V · Pin 1'],['−','BLACK · 0V · Pin 4'],['SHIELD','SHIELD · Pin 9'],
  ['A','GREEN · A · Pin 5'],['B','WHITE · B · Pin 3'],['Z','YELLOW · Z · Pin 8'],['SHAFT','SHAFT · mekanik mil']
 ]);
 assert.match(shared.visualInfo.source,/Photoelectric Incremental Rotary Encoder\.pdf/);
});

test('the same encoder is visible in both control and Arduino libraries',()=>{
 assert.equal(Workspaces.includes(shared,'control'),true);
 assert.equal(Workspaces.includes(shared,'arduino'),true);
 const item={...shared,classification:Catalog.classification(shared)};
 assert.equal(Catalog.matches(item,{category:'arduino'}),true);
});

test('A/B quadrature reverses phase order and Z is one index pulse per revolution',()=>{
 const base={encoderPPR:100,encoderRPM:0,encoderAuto:false,encoderMechanicalAngle:0};
 const q=360/(100*4),s0=Encoder.state({...base},shared,0,false),s1=Encoder.state({...base,encoderMechanicalAngle:q},shared,0,false),s2=Encoder.state({...base,encoderMechanicalAngle:2*q},shared,0,false),sr=Encoder.state({...base,encoderMechanicalAngle:-q},shared,0,false);
 assert.deepEqual([s0.A,s0.B,s0.Z],[1,1,0]);
 assert.deepEqual([s1.A,s1.B,s1.Z],[0,1,1]);
 assert.deepEqual([s2.A,s2.B,s2.Z],[0,0,1]);
 assert.deepEqual([sr.A,sr.B,sr.Z],[1,0,1]);
 const oneTurn=Encoder.state({...base,encoderMechanicalAngle:360},shared,0,false);assert.equal(oneTurn.Z,0);
});

test('document PPR/rpm combinations respect response-frequency model and warn above allowable rpm',()=>{
 const a=Encoder.state({encoderPPR:1000,encoderRPM:3000,encoderMechanicalAngle:0},shared,1000,false);
 assert.equal(a.pulseHz,50000);assert.equal(a.overspeed,false);assert.equal(a.responseOver,false);
 const b=Encoder.state({encoderPPR:1000,encoderRPM:5000,encoderMechanicalAngle:0},shared,1000,false);
 assert.ok(Math.abs(b.pulseHz-83333.33333333333)<.001);assert.equal(b.overspeed,true);assert.equal(b.responseOver,false);
 assert.equal(Encoder.supply({},shared,{dcVoltage:()=>24}),'ok');assert.equal(Encoder.supply({},shared,{dcVoltage:()=>5}),'ok');assert.equal(Encoder.supply({},shared,{dcVoltage:()=>-24}),'reversed');
});

test('Arduino INPUT_PULLUP reads real NPN open-collector A B Z levels',()=>{
 const q=360/(100*4),uno={id:'u',typeId:'arduino-uno',x:0,y:0,rotation:0,ref:'ARD1',state:false,
  arduinoSketch:'void setup(){pinMode(2,INPUT_PULLUP);pinMode(3,INPUT_PULLUP);pinMode(4,INPUT_PULLUP);} void loop(){int va=digitalRead(2);int vb=digitalRead(3);int vz=digitalRead(4);delay(10);}'};
 const enc={id:'e',typeId:'encoder-incremental',x:0,y:0,rotation:0,ref:'ENC1',state:false,encoderPPR:100,encoderRPM:0,encoderAuto:false,encoderMechanicalAngle:q};
 const p={version:7,workspaceMode:'arduino',components:[uno,enc],wires:[W('u','5V','e','+'),W('u','GND','e','−'),W('u','D2','e','A'),W('u','D3','e','B'),W('u','D4','e','Z')],junctions:[]};
 const r=Arduino.tick(p,byId,{now:1000});assert.deepEqual(r.errors,[]);assert.equal(enc._encoderPowered,true);assert.equal(enc._encoderSupply,'ok');
 assert.deepEqual([enc._encoderA,enc._encoderB,enc._encoderZ],[0,1,1]);
 assert.deepEqual([uno._arduinoRuntime.vars.va,uno._arduinoRuntime.vars.vb,uno._arduinoRuntime.vars.vz],[0,1,1]);
 assert.equal(enc._encoderPullupWarning||false,false);
});

test('Arduino attachInterrupt/digitalPinToInterrupt encoder ISR fires even during delay',()=>{
 const q=360/(100*4),uno={id:'ui',typeId:'arduino-uno',x:0,y:0,rotation:0,ref:'ARD2',state:false,
  arduinoSketch:'volatile long count=0;\nvoid encoderA(){ count++; }\nvoid setup(){pinMode(2,INPUT_PULLUP);pinMode(3,INPUT_PULLUP);attachInterrupt(digitalPinToInterrupt(2),encoderA,CHANGE);}\nvoid loop(){delay(1000);}'};
 const enc={id:'ei',typeId:'encoder-incremental',x:0,y:0,rotation:0,ref:'ENC2',state:false,encoderPPR:100,encoderRPM:0,encoderAuto:false,encoderMechanicalAngle:0};
 const p={version:7,workspaceMode:'arduino',components:[uno,enc],wires:[W('ui','5V','ei','+'),W('ui','GND','ei','−'),W('ui','D2','ei','A'),W('ui','D3','ei','B')],junctions:[]};
 Arduino.tick(p,byId,{now:0});assert.equal(uno._arduinoRuntime.vars.count,0);assert.equal(uno._arduinoRuntime.waitUntil,1000);
 enc.encoderMechanicalAngle=q;Arduino.tick(p,byId,{now:20});assert.equal(uno._arduinoRuntime.vars.count,1);assert.equal(uno._arduinoRuntime.waitUntil,1000);
});

test('control simulation exposes only active NPN open-collector sink channels',()=>{
 const c={id:'enc',typeId:'encoder-incremental',encoderPPR:100,encoderRPM:0,encoderAuto:false,encoderMechanicalAngle:360/(100*4)};
 Encoder.state(c,shared,0,false);
 const pairs=Simulation.conductingPairs(c,shared,new Map(),new Set(['enc']));
 assert.deepEqual(pairs,[['−','A']]);
 c.encoderMechanicalAngle=2*360/(100*4);Encoder.state(c,shared,0,false);
 assert.deepEqual(Simulation.conductingPairs(c,shared,new Map(),new Set(['enc'])).sort(),[['−','A'],['−','B']].sort());
});

test('material artwork has a draggable shaft and document-specific NPN label',()=>{
 const c={id:'enc',encoderPPR:100,encoderRPM:0,encoderAuto:false,encoderMechanicalAngle:0,_encoderPowered:true};
 const svg=Encoder.markup(c,shared);assert.match(svg,/data-industrial-encoder-shaft/);assert.match(svg,/data-encoder-jog="1"/);assert.match(svg,/data-encoder-jog="-1"/);assert.match(svg,/NPN OPEN COLLECTOR/);assert.match(svg,/100 PPR/);assert.match(svg,/rotate\(0 92 31\)/);
 const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');assert.match(app,/data-industrial-encoder-shaft/);assert.match(app,/industrial-encoder/);
});


test('motor shaft coupling transfers actual signed RPM and pulse rate to encoder',()=>{
 const motorDef={id:'mdef',kind:'motor3',w:160,h:120,pins:[{id:'U'},{id:'V'},{id:'W'}]};
 const encDef={...shared,pins:shared.pins.map(x=>({...x}))};Encoder.installMechanicalPins([encDef,motorDef]);
 assert.ok(motorDef.pins.some(p=>p.id==='SHAFT'&&p.mechanical));assert.ok(encDef.pins.some(p=>p.id==='SHAFT'&&p.mechanical));
 const motor={id:'m',typeId:'mdef',ref:'M1',_active:true,_motorRPM:900,_spin:1},enc={id:'e',typeId:encDef.id,encoderPPR:100,encoderMechanicalAngle:0,encoderRPM:0};
 const project={components:[motor,enc],wires:[{id:'mw',mechanical:true,role:'MECHANICAL',from:{c:'m',p:'SHAFT'},to:{c:'e',p:'SHAFT'}}]};
 const defs={mdef:motorDef,[encDef.id]:encDef};
 let st=Encoder.syncMotor(enc,encDef,project,defs,1000,false);assert.equal(st.rpm,900);assert.equal(st.pulseHz,1500);assert.equal(enc._encoderMotorId,'m');
 motor._spin=-1;st=Encoder.syncMotor(enc,encDef,project,defs,1100,false);assert.equal(st.rpm,-900);assert.equal(st.pulseHz,1500);
});

test('uncoupled manual arrows accelerate in both directions and keep continuous RPM',()=>{
 const c={encoderPPR:100,encoderRPM:0,encoderAuto:true,encoderMechanicalAngle:0};
 const a=Encoder.manualAdjust(c,shared,1,0,0);assert.equal(a.rpm,25);
 const b=Encoder.manualAdjust(c,shared,1,1000,10);assert.ok(b.rpm>25);
 const before=b.rpm,advanced=Encoder.state(c,shared,1010,true);assert.equal(advanced.rpm,before);assert.ok(c.encoderMechanicalAngle>0);
 Encoder.manualAdjust(c,shared,-1,5000,1020);Encoder.manualAdjust(c,shared,-1,5000,1030);assert.ok(c.encoderRPM<before);
});

test('mechanical SHAFT links are isolated from the electrical conductor graph and rendered distinctly',()=>{
 const conductors=fs.readFileSync(require.resolve('../dist/conductors.js'),'utf8'),app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),sim=fs.readFileSync(require.resolve('../dist/simulation.js'),'utf8');
 assert.match(conductors,/w\.mechanical&&|!w\.mechanical/);assert.match(conductors,/MECHANICAL/);
 assert.match(sim,/!w\.mechanical&&w\.role!=='MECHANICAL'/);assert.match(sim,/syncMotor/);assert.match(sim,/motorCoupling/);
 assert.match(app,/mechanicalPair/);assert.match(app,/role:'MECHANICAL'/);assert.match(app,/data-encoder-jog/);assert.match(app,/Mekanik SHAFT bağlantısı/);
});
