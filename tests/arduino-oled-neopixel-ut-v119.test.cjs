'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Workspaces=require('../dist/workspaces.js'),Catalog=require('../dist/catalog.js'),ArduinoLib=require('../dist/arduino-library.js'),Arduino=require('../dist/arduino-runtime.js'),Simulation=require('../dist/simulation.js'),Assemblies=require('../dist/assemblies.js');

const byArduino=Object.fromEntries(ArduinoLib.components.map(d=>[d.id,d]));
let wi=0;
const W=(a,ap,b,bp)=>({id:'w'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},points:[],color:'#d32f2f',role:'SIGNAL'});
const C=(id,typeId,extra={})=>({id,typeId,x:0,y:0,rotation:0,ref:id.toUpperCase(),label:id,state:false,...extra});

test('Arduino catalog exposes logic/instrument groups and shared UT33D+ tools',()=>{
  assert.ok(Catalog.groups.some(([id])=>id==='arduino-logic'));
  assert.ok(Catalog.groups.some(([id])=>id==='arduino-instruments'));
  for(const d of [
    {id:'unit-ut33d-plus',kind:'multimeter'},
    {id:'test-probe-red',kind:'test-probe'},
    {id:'test-probe-black',kind:'test-probe'}
  ]){
    assert.equal(Workspaces.includes(d,'arduino'),true,d.id);
    assert.equal(Catalog.matches({...d,name:d.id,model:d.id,classification:Catalog.classification(d)},{category:'arduino'}),true,d.id);
  }
  for(const id of ['arduino-oscilloscope','arduino-signal-generator']){
    const d=byArduino[id];assert.ok(d,id);
    assert.ok(Catalog.groups.some(([g])=>g===d.arduinoGroup),id+' group');
  }
});

test('adding the same UT33D+ assembly creates both movable probes in Arduino workspace too',()=>{
  let n=0;const uid=p=>p+(++n);
  const meterDef={id:'unit-ut33d-plus',kind:'multimeter',w:180,h:300,pins:[{id:'COM'},{id:'V'},{id:'10A'}]};
  const byId={'unit-ut33d-plus':meterDef,'test-probe-red':{id:'test-probe-red',probeColor:'red',pins:[{id:'PLUG'},{id:'TIP'}]},'test-probe-black':{id:'test-probe-black',probeColor:'black',pins:[{id:'PLUG'},{id:'TIP'}]}};
  const meter=C('m','unit-ut33d-plus',{x:100,y:100,meterPosition:4}),p={workspaceMode:'arduino',components:[meter],wires:[],junctions:[]};
  Assemblies.add(p,meter,meterDef,byId,uid);
  assert.equal(p.components.filter(c=>c.probeFor==='m').length,2);
  assert.ok(p.wires.some(w=>[w.from,w.to].some(e=>e.c==='m'&&e.p==='COM')));
  assert.ok(p.wires.some(w=>[w.from,w.to].some(e=>e.c==='m'&&e.p==='V')));
});

test('UT33D+ measures Arduino 5 V output with the original multimeter engine',()=>{
  const uno={id:'arduino-uno',kind:'arduino-board',arduinoBoard:true,pins:['5V','3V3','GND','GND2','D6'].map(id=>({id}))};
  const meter={id:'unit-ut33d-plus',kind:'multimeter',pins:['COM','V','10A'].map(id=>({id}))};
  const byId={'arduino-uno':uno,'unit-ut33d-plus':meter};
  const u=C('u','arduino-uno',{_arduinoRuntime:{outputs:{D6:255}}}),m=C('m','unit-ut33d-plus',{meterPosition:4});
  const p={version:7,workspaceMode:'arduino',components:[u,m],wires:[W('m','V','u','D6'),W('m','COM','u','GND')],junctions:[]};
  const r=Simulation.solve(p,byId,{now:1000,appearance:'material'});
  assert.equal(r.stable,true);assert.equal(m._meter.warning,'');assert.ok(Math.abs(m._meter.value-5)<0.02,m._meter.value);assert.equal(m._meter.unit,'V');
});

test('UT33D+ keeps resistance and diode functions in Arduino workspace',()=>{
  const meter={id:'unit-ut33d-plus',kind:'multimeter',pins:['COM','V','10A'].map(id=>({id}))};
  const resistor={id:'arduino-resistor-1k',kind:'resistor',pins:[{id:'1'},{id:'2'}]};
  const diode={id:'arduino-diode-1n4148',kind:'diode',pins:[{id:'A'},{id:'K'}]};
  {
    const byId={'unit-ut33d-plus':meter,'arduino-resistor-1k':resistor},m=C('m','unit-ut33d-plus',{meterPosition:15}),r=C('r','arduino-resistor-1k',{resistance:1000});
    const p={version:7,workspaceMode:'arduino',components:[m,r],wires:[W('m','V','r','1'),W('m','COM','r','2')],junctions:[]};
    Simulation.solve(p,byId,{now:1000});assert.equal(m._meter.warning,'');assert.ok(Math.abs(m._meter.value-1000)<2,m._meter.value);assert.equal(m._meter.unit,'kΩ');
  }
  {
    const byId={'unit-ut33d-plus':meter,'arduino-diode-1n4148':diode},m=C('m','unit-ut33d-plus',{meterPosition:13,meterContinuity:false}),d=C('d','arduino-diode-1n4148');
    const p={version:7,workspaceMode:'arduino',components:[m,d],wires:[W('m','V','d','A'),W('m','COM','d','K')],junctions:[]};
    Simulation.solve(p,byId,{now:1000});assert.equal(m._meter.warning,'');assert.ok(Math.abs(m._meter.value-.65)<.01,m._meter.value);assert.equal(m._meter.unit,'V');
  }
});

test('UT33D+ measures Arduino series DC current',()=>{
  const uno={id:'arduino-uno',kind:'arduino-board',arduinoBoard:true,pins:['5V','GND'].map(id=>({id}))};
  const meter={id:'unit-ut33d-plus',kind:'multimeter',pins:['COM','V','10A'].map(id=>({id}))};
  const resistor={id:'arduino-resistor-1k',kind:'resistor',pins:[{id:'1'},{id:'2'}]};
  const byId={'arduino-uno':uno,'unit-ut33d-plus':meter,'arduino-resistor-1k':resistor};
  const u=C('u','arduino-uno'),m=C('m','unit-ut33d-plus',{meterPosition:10}),r=C('r','arduino-resistor-1k',{resistance:1000});
  const p={version:7,workspaceMode:'arduino',components:[u,m,r],wires:[W('u','5V','m','V'),W('m','COM','r','1'),W('r','2','u','GND')],junctions:[]};
  Simulation.solve(p,byId,{now:1000});assert.equal(m._meter.warning,'');assert.ok(m._meter.value>.0048&&m._meter.value<.0051,m._meter.value);assert.equal(m._meter.unit,'mA');
});

test('NeoPixel pins are left-aligned and Adafruit_NeoPixel show() transfers requested RGB',()=>{
  const px=byArduino['arduino-neopixel'];assert.ok(px.pins.every(p=>p.side==='left'&&p.x===0));
  const sketch='#include <Adafruit_NeoPixel.h>\nAdafruit_NeoPixel strip(1,6,NEO_GRB + NEO_KHZ800);\nvoid setup(){strip.begin();strip.setPixelColor(0,strip.Color(255,20,40));strip.show();}\nvoid loop(){delay(1000);}';
  const u=C('u','arduino-uno',{arduinoSketch:sketch}),led=C('px','arduino-neopixel');
  const p={version:7,workspaceMode:'arduino',components:[u,led],wires:[W('u','D6','px','DIN'),W('u','5V','px','5V'),W('u','GND','px','GND')],junctions:[]};
  Arduino.tick(p,byArduino,{now:1000});assert.equal(u._arduinoError||'','');assert.deepEqual(led._arduinoRGB,{r:255,g:20,b:40});assert.equal(led._neopixelPowered,true);
});

test('both SSD1306 OLED sizes render readable Adafruit_SSD1306 text buffers',()=>{
  for(const [id,h] of [['arduino-oled-i2c',64],['arduino-oled-091-yellow',32]]){
    const sketch='#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\nAdafruit_SSD1306 display(128,'+h+',&Wire,-1);\nvoid setup(){display.begin(SSD1306_SWITCHCAPVCC,0x3C);display.clearDisplay();display.setTextSize(1);display.setTextColor(SSD1306_WHITE);display.setCursor(0,0);display.println(F("Merhaba OLED"));display.print("Deger: ");display.println(42);display.display();}\nvoid loop(){delay(1000);}';
    const u=C('u','arduino-uno',{arduinoSketch:sketch}),o=C('o',id);
    const p={version:7,workspaceMode:'arduino',components:[u,o],wires:[W('u','A4','o','SDA'),W('u','A5','o','SCL'),W('u','5V','o','VCC'),W('u','GND','o','GND')],junctions:[]};
    Arduino.tick(p,byArduino,{now:1000});assert.equal(u._arduinoError||'','',id);assert.equal(o._arduinoDisplayLines[0],'Merhaba OLED',id);assert.equal(o._arduinoDisplayLines[1],'Deger: 42',id);assert.equal(o._active,true,id);
    const art=ArduinoLib.art(byArduino[id],o);assert.match(art,/Merhaba OLED/);assert.match(art,/Deger: 42/);
  }
});

test('previously added Arduino passives are all present and drawable',()=>{
  for(const id of ['arduino-resistor-220','arduino-resistor-1k','arduino-capacitor-100n','arduino-capacitor-100u','arduino-diode-1n4148','arduino-diode-1n4007']){
    assert.ok(byArduino[id],id);assert.ok(ArduinoLib.art(byArduino[id],{}).length>80,id);
  }
});

test('Arduino workspace activates the electrical solver when a shared UNI-T multimeter or clamp meter is present',()=>{
  const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
  assert.match(app,/const arduinoMeter=project\.workspaceMode==='arduino'/);
  assert.match(app,/\['multimeter','clamp-meter'\]\.includes\(byId\[c\.typeId\]\?\.kind\)/);
});
