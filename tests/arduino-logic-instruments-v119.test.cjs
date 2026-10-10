'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Library=require('../dist/arduino-library.js'),Runtime=require('../dist/arduino-runtime.js'),Audio=require('../dist/audio.js');
const byId=Object.fromEntries(Library.components.map(x=>[x.id,x]));
let wi=0;
const C=(id,typeId,extra={})=>({id,typeId,x:0,y:0,rotation:0,label:id,ref:id.toUpperCase(),state:false,...extra});
const W=(a,ap,b,bp)=>({id:'logicw'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},points:[],color:'#d32f2f',role:'SIGNAL'});
const P=(sketch,components=[],wires=[])=>({version:7,workspaceMode:'arduino',components:[C('uno','arduino-uno',{arduinoSketch:sketch}),...components],wires,junctions:[]});
const link=(p,a,ap,b,bp)=>p.wires.push(W(a,ap,b,bp));
const power=(p,id,vcc='VCC',gnd='GND')=>{link(p,'uno','5V',id,vcc);link(p,'uno','GND',id,gnd)};
const run=(p,times=[0,20,50,100])=>{for(const now of times)Runtime.tick(p,byId,{now});assert.equal(p.components.find(c=>c.typeId==='arduino-uno')?._arduinoError||'','');return p};

test('rain and soil sensor physical interaction decisions are locked',()=>{
  const rain=byId['arduino-rain'],soil=byId['arduino-soil'];
  assert.ok(rain.pins.every(p=>p.side==='left'&&p.x===0));
  assert.ok(soil.pins.every(p=>p.side==='right'&&p.x===soil.w));
  assert.equal(soil.soilInteractive,true);
  const dry=Library.art(soil,{soilProbeDepth:0,arduinoValue:220}),wet=Library.art(soil,{soilProbeDepth:90,arduinoValue:900});
  assert.match(dry,/data-soil-probe/);assert.match(dry,/PROB KURU/);assert.match(wet,/PROB ISLAK/);assert.match(wet,/AO: 900/);
  const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
  assert.match(app,/data-soil-probe/);assert.match(app,/soilProbeDepth/);assert.match(app,/220\+wet\*760/);
});

test('new IC and virtual instrument packages are present with real package redraw metadata',()=>{
  const expected={
    'arduino-cd4511':16,'arduino-74hc595':16,'arduino-cd4017':16,'arduino-mcp23017':28,
    'arduino-max7219':24,'arduino-max232':16,'arduino-oscilloscope':3,'arduino-signal-generator':2
  };
  for(const [id,count] of Object.entries(expected)){const d=byId[id];assert.ok(d,id);assert.equal(d.pins.length,count,id);assert.ok(Library.art(d,{}).length>100,id+' art')}
  assert.match(byId['arduino-cd4511'].visualInfo.source,/TI CD4511B/);
  assert.match(byId['arduino-mcp23017'].visualInfo.source,/Microchip/);
  assert.match(byId['arduino-max7219'].visualInfo.source,/Analog Devices/);
  assert.match(byId['arduino-max232'].visualInfo.source,/Texas Instruments/);
});

test('Arduino buzzer tone frequency reaches the audio alarm model',()=>{
  const p=P('void setup(){tone(8,1234);} void loop(){delay(1000);}',[C('bz','arduino-buzzer')],[W('uno','D8','bz','SIG'),W('uno','5V','bz','VCC'),W('uno','GND','bz','GND')]);
  run(p,[0]);const bz=p.components[1],state=Audio.state(p,byId,true);
  assert.equal(bz._arduinoTone,1234);assert.equal(bz._active,true);assert.deepEqual(state.alarms.get('bz'),{type:'buzzer',frequency:1234});
});

test('CD4511, 74HC595 and CD4017 execute their real digital logic paths',()=>{
  const d4511=P('void setup(){pinMode(2,OUTPUT);pinMode(3,OUTPUT);pinMode(4,OUTPUT);pinMode(5,OUTPUT);digitalWrite(2,HIGH);digitalWrite(3,LOW);digitalWrite(4,HIGH);digitalWrite(5,LOW);} void loop(){delay(1000);}',[C('ic','arduino-cd4511')]);
  power(d4511,'ic','VDD','VSS');link(d4511,'uno','5V','ic','LT');link(d4511,'uno','5V','ic','BI');link(d4511,'uno','GND','ic','LE');for(const [pin,name] of [['D2','A'],['D3','B'],['D4','C'],['D5','D']])link(d4511,'uno',pin,'ic',name);
  run(d4511,[0]);assert.equal(d4511.components[1]._cd4511Digit,5);assert.equal(d4511.components[1]._arduinoLogicOutputs.a,255);assert.equal(d4511.components[1]._arduinoLogicOutputs.b,0);

  const sr=P('void setup(){pinMode(2,OUTPUT);pinMode(3,OUTPUT);pinMode(4,OUTPUT);digitalWrite(4,LOW);shiftOut(2,3,MSBFIRST,0xA5);digitalWrite(4,HIGH);} void loop(){delay(1000);}',[C('ic','arduino-74hc595')]);
  power(sr,'ic');link(sr,'uno','5V','ic','SRCLR');link(sr,'uno','GND','ic','OE');link(sr,'uno','D2','ic','SER');link(sr,'uno','D3','ic','SRCLK');link(sr,'uno','D4','ic','RCLK');
  run(sr,[0]);assert.equal(sr.components[1]._hc595Latch,0xA5);assert.equal(sr.components[1]._arduinoLogicOutputs.QA,255);assert.equal(sr.components[1]._arduinoLogicOutputs.QB,0);

  const ctr=P('void setup(){pinMode(2,OUTPUT);pinMode(3,OUTPUT);digitalWrite(3,LOW);} void loop(){digitalWrite(2,HIGH);delay(10);digitalWrite(2,LOW);delay(10);}',[C('ic','arduino-cd4017')]);
  power(ctr,'ic','VDD','VSS');link(ctr,'uno','D2','ic','CLOCK');link(ctr,'uno','D3','ic','RESET');link(ctr,'uno','GND','ic','INHIBIT');
  run(ctr,[0,20,40]);assert.equal(ctr.components[1]._cd4017Count,2);assert.equal(ctr.components[1]._arduinoLogicOutputs.Q2,255);
});

test('MCP23017 accepts register-level Wire I2C writes at address 0x20',()=>{
  const p=P('void setup(){Wire.begin();Wire.beginTransmission(0x20);Wire.write(0x00);Wire.write(0x00);Wire.endTransmission();Wire.beginTransmission(0x20);Wire.write(0x14);Wire.write(0xA5);Wire.endTransmission();} void loop(){delay(1000);}',[C('ic','arduino-mcp23017')]);
  power(p,'ic','VDD','VSS');link(p,'uno','A4','ic','SDA');link(p,'uno','A5','ic','SCL');for(const x of ['A0','A1','A2'])link(p,'uno','GND','ic',x);link(p,'uno','5V','ic','RESET');
  run(p,[0]);const ic=p.components[1];assert.equal(ic._mcpRegs[0],0);assert.equal(ic._mcpRegs[20],0xA5);assert.equal(ic._arduinoLogicOutputs.GPA0,255);assert.equal(ic._arduinoLogicOutputs.GPA1,0);assert.equal(ic._arduinoLogicOutputs.GPA7,255);
});

test('MAX7219 accepts DIN CLK LOAD register frames and MAX232 inverts TTL/RS232 logic',()=>{
  const mx=P('void setup(){pinMode(10,OUTPUT);pinMode(11,OUTPUT);pinMode(13,OUTPUT);digitalWrite(10,LOW);shiftOut(11,13,MSBFIRST,0x0C);shiftOut(11,13,MSBFIRST,0x01);digitalWrite(10,HIGH);digitalWrite(10,LOW);shiftOut(11,13,MSBFIRST,0x01);shiftOut(11,13,MSBFIRST,0x3F);digitalWrite(10,HIGH);} void loop(){delay(1000);}',[C('ic','arduino-max7219')]);
  link(mx,'uno','5V','ic','VCC');link(mx,'uno','GND','ic','GND1');link(mx,'uno','GND','ic','GND2');link(mx,'uno','D11','ic','DIN');link(mx,'uno','D13','ic','CLK');link(mx,'uno','D10','ic','LOAD');
  run(mx,[0]);assert.equal(mx.components[1]._max7219Regs[12],1);assert.equal(mx.components[1]._max7219Digits[0],0x3F);

  const rs=P('void setup(){pinMode(2,OUTPUT);digitalWrite(2,HIGH);} void loop(){delay(1000);}',[C('ic','arduino-max232')]);
  power(rs,'ic');link(rs,'uno','D2','ic','T1IN');run(rs,[0]);assert.equal(rs.components[1]._arduinoLogicOutputs.T1OUT,0);assert.equal(rs.components[1]._arduinoLogicOutputs.T2OUT,255);
});

test('signal generator feeds a live oscilloscope trace',()=>{
  const gen=C('gen','arduino-signal-generator',{generatorWaveform:'sine',generatorFrequency:50,generatorAmplitude:5,generatorOffset:0});
  const osc=C('osc','arduino-oscilloscope',{scopeTimeMs:40});
  const p={version:7,workspaceMode:'arduino',components:[gen,osc],wires:[W('gen','OUT','osc','CH1'),W('gen','GND','osc','GND')],junctions:[]};
  Runtime.tick(p,byId,{now:1234});assert.ok(osc._scopeTrace1.length>=80);assert.ok(Math.min(...osc._scopeTrace1)<0.1);assert.ok(Math.max(...osc._scopeTrace1)>4.9);assert.equal(osc._scopeFrequency1,50);assert.ok(osc._scopeStats1.vpp>4.9);assert.ok(osc._scopeStats1.rms>2.9&&osc._scopeStats1.rms<3.2);
});


test('signal generator supports enable waveform duty offset phase and Arduino analog sampling',()=>{
  const gen=C('gen','arduino-signal-generator',{generatorEnabled:true,generatorWaveform:'square',generatorFrequency:100,generatorAmplitude:3,generatorOffset:1,generatorDuty:25,generatorPhaseDeg:0});
  const uno=C('uno2','arduino-uno',{arduinoSketch:'void setup(){} void loop(){int x=analogRead(A0);delay(10);}'});
  const p={version:7,workspaceMode:'arduino',components:[gen,uno],wires:[W('gen','OUT','uno2','A0'),W('gen','GND','uno2','GND')],junctions:[]};
  Runtime.tick(p,byId,{now:1});assert.equal(gen._signalMin,1);assert.equal(gen._signalMax,4);assert.equal(gen._signalVpp,3);assert.equal(gen._signalFrequency,100);
  Runtime.tick(p,byId,{now:3});assert.ok(gen._signalVoltage===1||gen._signalVoltage===4);
  gen.generatorWaveform='sawtooth';gen.generatorPhaseDeg=180;Runtime.tick(p,byId,{now:5});assert.ok(gen._signalVoltage>=1&&gen._signalVoltage<=4);
  gen.generatorEnabled=false;Runtime.tick(p,byId,{now:6});assert.equal(gen._signalVoltage,0);assert.equal(gen._signalFrequency,0);assert.equal(gen._active,false);
});

test('oscilloscope handles dual channel AC DC coupling trigger and automatic measurements',()=>{
  const g1=C('g1','arduino-signal-generator',{generatorWaveform:'sine',generatorFrequency:100,generatorAmplitude:4,generatorOffset:1,generatorEnabled:true});
  const g2=C('g2','arduino-signal-generator',{generatorWaveform:'square',generatorFrequency:250,generatorAmplitude:5,generatorOffset:0,generatorDuty:20,generatorEnabled:true});
  const osc=C('osc2','arduino-oscilloscope',{scopeTimeMs:40,scopeChannel1:true,scopeChannel2:true,scopeCoupling1:'DC',scopeCoupling2:'AC',scopeTriggerMode:'auto',scopeTriggerSource:'CH2',scopeTriggerEdge:'rising',scopeTriggerLevel:2.5});
  const p={version:7,workspaceMode:'arduino',components:[g1,g2,osc],wires:[W('g1','OUT','osc2','CH1'),W('g2','OUT','osc2','CH2'),W('g1','GND','osc2','GND'),W('g2','GND','osc2','GND')],junctions:[]};
  Runtime.tick(p,byId,{now:500});assert.equal(osc._scopeGrounded,true);assert.equal(osc._scopeFrequency1,100);assert.equal(osc._scopeFrequency2,250);assert.ok(osc._scopeStats1.vpp>3.9);assert.ok(osc._scopeStats2.vpp>4.9);assert.ok(Math.abs(osc._scopeStats2.avg)<.05);assert.equal(osc._scopeTriggered,true);
  osc.scopeTriggerEdge='falling';Runtime.tick(p,byId,{now:520});assert.equal(osc._scopeTriggered,true);
  osc.scopeTriggerMode='free';Runtime.tick(p,byId,{now:540});assert.equal(osc._scopeTriggered,false);
});

test('oscilloscope reads Arduino PWM and tone signals with known frequency',()=>{
  const uno=C('uno3','arduino-uno',{arduinoSketch:'void setup(){pinMode(6,OUTPUT);analogWrite(6,128);tone(8,1234);} void loop(){delay(1000);}'});
  const osc=C('osc3','arduino-oscilloscope',{scopeTimeMs:20,scopeChannel1:true,scopeChannel2:true,scopeCoupling1:'DC',scopeCoupling2:'DC',scopeTriggerMode:'free'});
  const p={version:7,workspaceMode:'arduino',components:[uno,osc],wires:[W('uno3','D6','osc3','CH1'),W('uno3','D8','osc3','CH2'),W('uno3','GND','osc3','GND')],junctions:[]};
  Runtime.tick(p,byId,{now:100});assert.ok(Math.abs(osc._scopeFrequency1-980)<1);assert.equal(osc._scopeFrequency2,1234);assert.ok(osc._scopeStats1.vpp>4.9);assert.ok(osc._scopeStats2.vpp>4.9);
});

test('oscilloscope requires a common ground reference',()=>{
  const gen=C('g3','arduino-signal-generator',{generatorWaveform:'sine',generatorFrequency:50,generatorAmplitude:5,generatorOffset:0});
  const osc=C('osc4','arduino-oscilloscope',{scopeTimeMs:40});
  const p={version:7,workspaceMode:'arduino',components:[gen,osc],wires:[W('g3','OUT','osc4','CH1')],junctions:[]};
  Runtime.tick(p,byId,{now:100});assert.equal(osc._scopeGrounded,false);assert.ok(osc._scopeTrace1.every(v=>v===0));assert.equal(osc._scopeStats1.vpp,0);
});
