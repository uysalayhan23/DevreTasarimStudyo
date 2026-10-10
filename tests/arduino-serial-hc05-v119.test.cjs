const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const Lib=require('../dist/arduino-library.js');
const Examples=require('../dist/arduino-examples.js');
const Arduino=require('../dist/arduino-runtime.js');
const byId=Object.fromEntries(Lib.components.map(x=>[x.id,x]));
const C=(id,typeId,extra={})=>({id,typeId,x:0,y:0,rotation:0,label:id,ref:id.toUpperCase(),state:false,...extra});
const W=(id,a,ap,b,bp)=>({id,from:{c:a,p:ap},to:{c:b,p:bp},points:[],color:'#333'});
const project=(code,extras=[],wires=[])=>({workspaceMode:'arduino',components:[C('uno','arduino-uno',{arduinoSketch:code}),...extras],wires,junctions:[],colorRoles:{}});

test('LCD 2x16 exposes the full HD44780 16-pin header',()=>{
  const lcd=byId['arduino-lcd1602'];assert.ok(lcd);assert.equal(lcd.arduinoRole,'lcd1602');assert.equal(lcd.pins.length,16);
  assert.deepEqual(lcd.pins.map(p=>p.id),['VSS','VDD','VO','RS','RW','E','D0','D1','D2','D3','D4','D5','D6','D7','A','K']);
});

test('LiquidCrystal 4-bit sketch drives the simulated 16x2 display',()=>{
  const code='#include <LiquidCrystal.h>\nLiquidCrystal lcd(12,11,5,4,3,2);\nvoid setup(){ lcd.begin(16,2); lcd.print("Merhaba"); lcd.setCursor(0,1); lcd.print("Yakub"); }\nvoid loop(){ delay(100); }';
  const lcd=C('lcd','arduino-lcd1602'),p=project(code,[lcd],[['D12','RS'],['D11','E'],['D5','D4'],['D4','D5'],['D3','D6'],['D2','D7']].map((x,i)=>W('l'+i,'uno',x[0],'lcd',x[1])));
  Arduino.tick(p,byId,{now:0});Arduino.tick(p,byId,{now:20});
  assert.equal(p.components[0]._arduinoError,'');assert.equal(lcd._arduinoDisplayLines[0].trim(),'Merhaba');assert.equal(lcd._arduinoDisplayLines[1].trim(),'Yakub');
});

test('official LiquidCrystal HelloWorld opens with a wired LCD and runs',()=>{
  const ex=Examples.catalog.find(x=>x.sourcePath==='examples/HelloWorld/HelloWorld.ino');assert.ok(ex);
  const p=Arduino.exampleProject(ex.id,'lcd-official');for(const t of [0,20,1000,1020,2000,2020])Arduino.tick(p,byId,{now:t});
  const lcd=p.components.find(c=>c.typeId==='arduino-lcd1602');assert.ok(lcd);assert.equal(p.components[0]._arduinoError,'');assert.match(lcd._arduinoDisplayLines[0],/hello, world!/);
});

test('Serial Monitor supports begin, print/write, receive and line endings',()=>{
  const code='void setup(){ Serial.begin(9600); Serial.println("READY"); }\nvoid loop(){ if(Serial.available()>0){ int x=Serial.read(); Serial.write(x); } delay(10); }';
  const p=project(code);Arduino.tick(p,byId,{now:0});
  Arduino.serialMonitorSend(p.components[0],'Q','nl',9600);Arduino.tick(p,byId,{now:20});Arduino.tick(p,byId,{now:40});
  const good=Arduino.serialState(p.components[0],9600);assert.match(good.text,/READY\r\nQ\n/);assert.equal(good.programBaud,9600);
  const wrong=Arduino.serialState(p.components[0],115200);assert.notEqual(wrong.text,good.text);
});

test('HC-05 supports SoftwareSerial bidirectionally and exposes STATE',()=>{
  const hc=C('hc','arduino-hc05'),code='#include <SoftwareSerial.h>\nSoftwareSerial BT(10,11);\nvoid setup(){ Serial.begin(9600); BT.begin(9600); }\nvoid loop(){ if(BT.available()>0){ int x=BT.read(); Serial.write(x); } delay(10); }';
  const p=project(code,[hc],[W('a','uno','D10','hc','TXD'),W('b','uno','D11','hc','RXD')]);
  Arduino.tick(p,byId,{now:0});Arduino.hc05Receive(hc,'Z',9600,byId['arduino-hc05']);Arduino.tick(p,byId,{now:20});Arduino.tick(p,byId,{now:40});
  assert.equal(Arduino.serialState(p.components[0],9600).text,'Z');assert.equal(Arduino.hc05State(hc,byId['arduino-hc05']).connected,true);
});

test('HC-05 AT mode responds at 38400 and stores module settings',()=>{
  const hc=C('hc','arduino-hc05',{hc05AtMode:true}),code='#include <SoftwareSerial.h>\nSoftwareSerial BT(10,11);\nvoid setup(){ Serial.begin(9600); BT.begin(38400); BT.println("AT"); }\nvoid loop(){ if(BT.available()>0){ int x=BT.read(); Serial.write(x); } delay(10); }';
  const p=project(code,[hc],[W('a','uno','D10','hc','TXD'),W('b','uno','D11','hc','RXD')]);for(const t of [0,20,40,60])Arduino.tick(p,byId,{now:t});
  assert.match(Arduino.serialState(p.components[0],9600).text,/OK\r\n/);assert.equal(Arduino.hc05State(hc,byId['arduino-hc05']).activeBaud,38400);
});

test('official SoftwareSerial example auto-builds an HC-05 circuit at its 4800 baud',()=>{
  const ex=Examples.catalog.find(x=>x.sourcePath==='libraries/SoftwareSerial/examples/SoftwareSerialExample/SoftwareSerialExample.ino');assert.ok(ex);
  const p=Arduino.exampleProject(ex.id,'soft-official');for(const t of [0,20,40])Arduino.tick(p,byId,{now:t});
  const hc=p.components.find(c=>c.typeId==='arduino-hc05');assert.ok(hc);assert.equal(hc.hc05Baud,4800);assert.equal(p.components[0]._arduinoError,'');
  const bytes=Arduino.hc05TakeTx(hc,4800,byId['arduino-hc05']);assert.equal(String.fromCharCode(...bytes),'Hello, world?\r\n');
});

test('embedded IDE includes realistic serial monitor and optional Web Serial HC-05 bridge',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),js=fs.readFileSync(path.join(root,'dist/arduino-ide.js'),'utf8'),css=fs.readFileSync(path.join(root,'dist/arduino.css'),'utf8');
  for(const id of ['arduinoSerialBaud','arduinoSerialInput','arduinoSerialEnding','arduinoSerialSend','hc05BridgeModule','hc05PcConnect','hc05VirtualSend','hc05Terminal'])assert.ok(html.includes('id="'+id+'"'),id);
  for(const token of ['navigator.serial.requestPort','serialMonitorSend','hc05Receive','hc05TakeTx'])assert.ok(js.includes(token),token);
  assert.equal(/\.simulate\s*[{,:]/.test(css),false,'Arduino CSS must not restyle locked simulation button');
});


test('Web Serial bridge stays pinned to the HC-05 selected at connect time',()=>{
  const js=fs.readFileSync(path.join(root,'dist/arduino-ide.js'),'utf8');
  assert.ok(js.includes('function bridgeHC05()'));
  assert.ok(js.includes('const c=bridgeHC05();if(!c)return'));
  assert.ok(js.includes("$('#hc05BridgeModule').disabled=true"));
  assert.ok(js.includes("if(module)module.disabled=false"));
  assert.ok(js.includes("PC Bluetooth/COM bağlantısı kesildi"));
  assert.ok(js.includes("root.navigator?.serial?.addEventListener?.('disconnect'"));
});


test('floating Serial Monitor stays independent from the IDE overlay',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),js=fs.readFileSync(path.join(root,'dist/arduino-ide.js'),'utf8'),css=fs.readFileSync(path.join(root,'dist/arduino.css'),'utf8');
  for(const id of ['serialMonitorBtn','serialMonitorPopup','serialPopupBoard','serialPopupBaud','serialPopupConsole','serialPopupInput','serialPopupEnding','serialPopupSend','serialPopupClear'])assert.ok(html.includes('id="'+id+'"'),id);
  for(const token of ['openSerialMonitor','closeSerialMonitor','refreshSerialPopup','serialMonitorSend','beginSerialPopupDrag'])assert.ok(js.includes(token),token);
  assert.ok(css.includes('.serial-monitor-popup'));assert.ok(css.includes('resize:both'));
});
