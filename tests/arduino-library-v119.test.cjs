const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const Arduino=require('../dist/arduino-library.js');
const Workspaces=require('../dist/workspaces.js');
const Catalog=require('../dist/catalog.js');

const by=Object.fromEntries(Arduino.components.map(d=>[d.id,d]));

test('Arduino library parts expose both schematic and material views',()=>{
  for(const d of Arduino.components){
    const c={id:'x',ref:'X1',label:d.name};
    const s=Arduino.schematic(d,c,'IEC'),m=Arduino.art(d,c);
    assert.ok(s&&typeof s.body==='string'&&s.body.length>20,d.id+' schematic');
    assert.ok(typeof m==='string'&&m.length>20,d.id+' material');
  }
});

test('datasheet-derived semiconductor pinouts are preserved per uploaded document',()=>{
  assert.deepEqual(by['arduino-bc327'].pinMap,{'1':'C','2':'B','3':'E'});
  assert.equal(by['arduino-bc327'].datasheet.vceo,45);
  assert.equal(by['arduino-bc327'].datasheet.icMax,.8);

  assert.deepEqual(by['arduino-bd139'].pinMap,{'1':'B','2':'C','3':'E'});
  assert.equal(by['arduino-bd139'].datasheet.package,'SOT-32 / TO-126');
  assert.equal(by['arduino-bd139'].datasheet.vceo,80);

  assert.deepEqual(by['arduino-bd140'].pinMap,{'1':'B','2':'C','3':'E'});
  assert.equal(by['arduino-bd140'].datasheet.package,'SOT-32');
  assert.equal(by['arduino-bd140'].datasheet.vceo,80);
});

test('TLP521 variants preserve channel count and package pin count',()=>{
  assert.equal(by['arduino-tlp521-1'].channels,1);assert.equal(by['arduino-tlp521-1'].pins.length,4);
  assert.equal(by['arduino-tlp521-2'].channels,2);assert.equal(by['arduino-tlp521-2'].pins.length,8);
  assert.equal(by['arduino-tlp521-4'].channels,4);assert.equal(by['arduino-tlp521-4'].pins.length,16);
  for(const id of ['arduino-tlp521-1','arduino-tlp521-2','arduino-tlp521-4']){
    assert.equal(by[id].datasheet.vceo,55);assert.equal(by[id].datasheet.isolationVrms,2500);
  }
});

test('0.91 inch yellow SSD1306 OLED and adjustable bench supply are present',()=>{
  const oled=by['arduino-oled-091-yellow'],supply=by['arduino-bench-supply'];
  assert.ok(oled);assert.match(oled.model,/128x32/);assert.deepEqual(oled.pins.map(p=>p.id),['GND','VCC','SCL','SDA']);
  assert.ok(supply);assert.equal(supply.defaultVoltage,5);assert.equal(supply.defaultCurrentLimit,1);
  assert.deepEqual(supply.pins.map(p=>p.id),['P','M']);
});

test('Arduino workspace also accepts base resistor capacitor diode and potentiometer',()=>{
  for(const d of [{id:'resistor',kind:'resistor'},{id:'capacitor',kind:'capacitor'},{id:'diode',kind:'diode'},{id:'potentiometer',kind:'potentiometer'}]){
    assert.equal(Workspaces.includes(d,'arduino'),true,d.id);
    assert.equal(Catalog.matches({...d,name:d.id,model:d.id,classification:Catalog.classification(d)},{category:'arduino'}),true,d.id);
  }
});


test('UNO R3 exposes official user headers and ICSP terminals',()=>{
  const uno=by['arduino-uno'];
  for(const id of ['D0','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','A0','A1','A2','A3','A4','A5','SDA','SCL','AREF','IOREF','RESET','3V3','5V','GND','GND2','VIN','ICSP_CIPO','ICSP_COPI','ICSP_SCK','ICSP_RESET','ICSP_5V','ICSP_GND']) assert.ok(uno.pins.some(p=>p.id===id),id);
});

test('breadboard is electrically grouped by five-hole strips and rails',()=>{
  const bb=by['arduino-breadboard'];assert.ok(bb);assert.equal(bb.hidePinLabels,true);
  for(const id of ['A1','E1','F1','J1','A30','J30','PT1','PT10','NB1','NB10'])assert.ok(bb.pins.some(p=>p.id===id),id);
  const link=s=>bb.arduinoPassThrough.some(x=>x[0]===s[0]&&x[1]===s[1]);
  assert.ok(link(['A1','B1']));assert.ok(link(['D30','E30']));assert.ok(link(['F1','G1']));assert.ok(link(['PT1','PT2']));
});


test('UNO R3 A000066 CAD geometry keeps exact header ordering and positions',()=>{
  const uno=by['arduino-uno'],pin=id=>uno.pins.find(p=>p.id===id);
  assert.equal(uno.preservePinGeometry,true);
  assert.deepEqual([uno.w,uno.h],[360,280]);
  assert.equal(uno.pins.length,44);
  assert.equal(pin('D0').side,'top');assert.equal(pin('D1').side,'top');
  assert.ok(pin('SCL').x<pin('SDA').x&&pin('SDA').x<pin('AREF').x&&pin('AREF').x<pin('D13').x);
  assert.ok(pin('D13').x<pin('D8').x&&pin('D8').x<pin('D7').x&&pin('D7').x<pin('D0').x);
  assert.ok(pin('NC').x<pin('IOREF').x&&pin('IOREF').x<pin('RESET').x&&pin('RESET').x<pin('VIN').x&&pin('VIN').x<pin('A0').x&&pin('A0').x<pin('A5').x);
  assert.equal(pin('D0').y,19.7);assert.equal(pin('A5').y,261);
  assert.equal(pin('ICSP_CIPO').x,326.1);assert.equal(pin('ICSP_CIPO').y,121.3);
  assert.equal(pin('USBICSP_RESET').x,86.7);assert.equal(pin('USBICSP_RESET').y,36.2);
  for(const id of ['USBICSP_CIPO','USBICSP_5V','USBICSP_SCK','USBICSP_COPI','USBICSP_RESET','USBICSP_GND'])assert.ok(pin(id),id);
});

test('UNO R3 material and symbol artwork follow the A000066 top-view layout',()=>{
  const uno=by['arduino-uno'],s=Arduino.schematic(uno,{ref:'ARD1'},'IEC').body,m=Arduino.art(uno,{_arduinoPins:{D13:1},_arduinoStatus:'RUN'});
  for(const token of ['DIGITAL / PWM ~','POWER','ANALOG IN','ATmega16U2 ICSP','D13/SCK','D0/RX'])assert.ok(s.includes(token),token);
  for(const token of ['DIGITAL (PWM ~)','POWER','ANALOG IN','ATMEGA328P','16U2','ICSP1','TX','RX','ON'])assert.ok(m.includes(token),token);
  assert.equal(uno.hideMaterialPinLabels,true);assert.equal(uno.hideSymbolPinLabels,true);
});

test('UNO duplicated power and communication headers remain electrically paired',()=>{
  const uno=by['arduino-uno'],link=(a,b)=>uno.arduinoPassThrough.some(x=>(x[0]===a&&x[1]===b)||(x[0]===b&&x[1]===a));
  assert.ok(link('A4','SDA'));assert.ok(link('A5','SCL'));assert.ok(link('5V','IOREF'));
  assert.ok(link('D11','ICSP_COPI'));assert.ok(link('D12','ICSP_CIPO'));assert.ok(link('D13','ICSP_SCK'));
  assert.ok(link('GND','ICSP_GND'));assert.ok(link('GND','USBICSP_GND'));
});


test('UNO wiring stays above the board and uses free XY route dragging',()=>{
  const app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8'),css=fs.readFileSync(path.join(root,'dist/styles.css'),'utf8');
  assert.ok(app.includes("function wireFreeDrag(w)"));
  assert.ok(app.includes("project.workspaceMode==='arduino'"));
  assert.ok(app.includes("byId[c.typeId]?.arduinoBoard).forEach"));
  assert.ok(app.includes("wire-segment-free"));
  assert.ok(app.includes("Arduino kablosu istediğiniz yöne taşındı"));
  assert.ok(css.includes(".wire-segment-handle.wire-segment-free"));
});


test('Mete Hoca 37-piece set references drive matched KY module redraws',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const expected={
    'arduino-joystick':'KY-023','arduino-relay-1ch':'KY-019','arduino-sound-sensor':'KY-037 / KY-038',
    'arduino-flame':'KY-026','arduino-reed':'KY-021','arduino-ldr':'KY-018','arduino-dht11':'KY-015',
    'arduino-rotary-encoder':'KY-040','arduino-buzzer':'KY-012 / KY-006','arduino-rgb-led':'KY-016','arduino-button':'KY-004'
  };
  for(const [id,code] of Object.entries(expected)){
    assert.ok(by[id],id);assert.ok(by[id].visualInfo?.source?.includes('Mete Hoca'),id);
    const art=Arduino.art(by[id],{});assert.ok(art.includes(code.split(' / ')[0]),id+' '+code);
    assert.ok(art.includes('arduino-orthographic'),id);assert.ok(art.includes('photo-redraw'),id);
  }
  assert.equal(by['arduino-sound-sensor'].pins.length,4);
  assert.equal(by['arduino-flame'].pins.length,4);
  assert.equal(by['arduino-sound-sensor'].dualDigital,true);
  assert.equal(by['arduino-flame'].dualDigital,true);
});


test('Arduino library keeps the MB-102 breadboard available',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const bb=by['arduino-breadboard'];
  assert.ok(bb,'arduino-breadboard');
  assert.equal(bb.arduinoRole,'breadboard');
  assert.equal(bb.arduinoGroup,'arduino-prototyping');
  assert.match(bb.name,/MB-102/);
  assert.match(bb.searchTerms,/protoboard/);
  assert.ok(bb.arduinoPassThrough.length>100);
});


test('advanced Arduino modules include LCD I2C, HW-131, NE555, A4988, NEMA17 and working 7-segment visuals',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  for(const id of ['arduino-lcd1602','arduino-lcd-i2c-backpack','arduino-lcd1602-i2c','arduino-hw131','arduino-ne555','arduino-a4988','arduino-nema17','arduino-servo-sg90','arduino-stepper-28byj','arduino-7segment','arduino-hc06'])assert.ok(by[id],id);
  assert.equal(by['arduino-7segment'].pins.length,10);
  assert.equal(by['arduino-a4988'].pins.length,16);
  assert.equal(by['arduino-ne555'].pins.length,8);
  const servo=Arduino.art(by['arduino-servo-sg90'],{_arduinoServoAngle:135});assert.ok(servo.includes('rotate(45'));
  const nema=Arduino.art(by['arduino-nema17'],{_arduinoStepperAngle:90});assert.ok(nema.includes('rotate(90'));
  const seg=Arduino.art(by['arduino-7segment'],{_sevenSegments:{A:true,B:true}});assert.ok(seg.includes('#ff2a1a'));
  const lcd=Arduino.art(by['arduino-lcd1602-i2c'],{_arduinoDisplayLines:['MERHABA','ARDUINO']});assert.ok(lcd.includes('PCF8574'));
});


test('LiquidCrystal_I2C runtime path and blue LCD material are present',()=>{
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  assert.ok(rt.includes("kind:'lcd1602i2c'"));
  assert.ok(rt.includes("arduinoRole!=='lcd1602-i2c'"));
  assert.ok(rt.includes("lcdBacklight(name,on)"));
  assert.ok(rt.includes("method==='backlight'"));
  const art=Arduino.art(by['arduino-lcd1602-i2c'],{_arduinoDisplayLines:['HELLO','I2C'],_arduinoLcdBacklight:true});
  assert.ok(art.includes('#0b62a7'));
  assert.ok(art.includes('PCF8574'));
});


test('7-segment runtime derives A-G and DP from Arduino outputs and common mode',()=>{
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  assert.ok(rt.includes("else if(r==='sevenseg')"));
  assert.ok(rt.includes("common==='anode'?o.value===0:o.value>0"));
  assert.ok(rt.includes("['A','B','C','D','E','F','G','DP']"));
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  assert.equal(by['arduino-7segment'].pins.find(x=>x.id==='GND').label,'COM1');
  assert.equal(by['arduino-7segment'].pins.find(x=>x.id==='COM2').label,'COM2');
});


test('SG90 Servo.write and writeMicroseconds drive the animated horn model',()=>{
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  assert.ok(rt.includes('servoWriteMicroseconds'));
  assert.ok(rt.includes('clamp(us,500,2400,1450)'));
  assert.ok(rt.includes('_arduinoServoPulseUs'));
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const a0=Arduino.art(by['arduino-servo-sg90'],{_arduinoServoAngle:0});
  const a180=Arduino.art(by['arduino-servo-sg90'],{_arduinoServoAngle:180});
  assert.ok(a0.includes('rotate(-90'));
  assert.ok(a180.includes('rotate(90'));
});


test('Stepper and A4988/NEMA17 runtime support movement instead of reference-only visuals',()=>{
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  for(const token of ["kind:'stepper'","kind:'accelStepper'",'stepperStep','accelRunToPosition',"r==='a4988'","r==='stepper'","arduinoRole!=='stepper-nema17'"])assert.ok(rt.includes(token),token);
  assert.ok(rt.includes("'111':16"));
  assert.ok(rt.includes("wired('VMOT')&&wired('GNDM')&&wired('VDD')&&wired('GND')"));
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const m=Arduino.art(by['arduino-stepper-28byj'],{_arduinoStepperAngle:120,_arduinoCoils:[1,0,1,0]});assert.ok(m.includes('rotate(120'));
  const n=Arduino.art(by['arduino-nema17'],{_arduinoStepperAngle:-45});assert.ok(n.includes('rotate(-45'));
});


test('HW-131 models source, rail jumpers and direct short-circuit state',()=>{
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  assert.ok(rt.includes("arduinoRole==='breadboard-power'"));
  assert.ok(rt.includes("c._hw131Outputs={left:"));
  assert.ok(rt.includes("c._hw131Short=short"));
  assert.ok(rt.includes("join(key(c.id,'L+'),key(c.id,'5V'))"));
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const art=Arduino.art(by['arduino-hw131'],{hw131On:true,_hw131Powered:true,hw131Left:'5',hw131Right:'3.3'});
  assert.ok(art.includes('HW-131 / MB102'));
  assert.ok(art.includes('#74ff72'));
});


test('NE555 has logic, astable and monostable runtime behavior',()=>{
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  assert.ok(rt.includes("r==='ne555'&&p==='OUT'"));
  assert.ok(rt.includes("mode==='astable'"));
  assert.ok(rt.includes(".693*(ra+rb)*cap*1000"));
  assert.ok(rt.includes("mode==='monostable'"));
  assert.ok(rt.includes("1.1*rb*cap*1000"));
  assert.ok(rt.includes("reset===0"));
  assert.ok(rt.includes("c._ne555Discharge=!out"));
});


test('HC-05 and HC-06 are distinct SPP/UART modules with correct roles',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  assert.equal(by['arduino-hc05'].supportsAt,true);
  assert.equal(by['arduino-hc06'].supportsAt,false);
  assert.equal(by['arduino-hc06'].pins.length,4);
  const a=Arduino.art(by['arduino-hc05'],{hc05Name:'HC-05'});
  const b=Arduino.art(by['arduino-hc06'],{hc05Name:'HC-06'});
  assert.ok(a.includes('MASTER/SLAVE'));
  assert.ok(a.includes('>AT<')||a.includes('>AT</text>'));
  assert.ok(b.includes('SLAVE'));
  assert.equal(b.includes('>AT</text>'),false);
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  assert.ok(rt.includes("d.supportsAt===false)c.hc05AtMode=false"));
});


test('simple #define constants keep official Stepper MotorKnob executable',()=>{
  const rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  assert.ok(rt.includes("#define\\s+([A-Za-z_]\\w*)"));
  const Examples=require('../dist/arduino-examples.js');
  for(const title of ['MotorKnob','stepper_oneRevolution','stepper_oneStepAtATime','stepper_speedControl']){
    const e=Examples.catalog.find(x=>x.title===title);
    assert.ok(e,title);assert.equal(e.simSupport,'full',title);
  }
});


test('orthographic photo-reference redraws replace generic boxes for key Arduino modules',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const ids=['arduino-hcsr04','arduino-l298n','arduino-dc-motor','arduino-lm35','arduino-mq2','arduino-pir','arduino-soil','arduino-rain','arduino-oled-i2c','arduino-neopixel','arduino-keypad4x4','arduino-rtc-ds3231','arduino-mpu6050','arduino-sd-module','arduino-nrf24','arduino-hx711'];
  for(const id of ids){
    assert.ok(by[id],id);
    const art=Arduino.art(by[id],{});
    assert.ok(art.includes('arduino-orthographic'),id);
    assert.equal(art.includes('arduino-material"><rect x="6" y="6"'),false,id);
  }
});


test('small Arduino parts also use flat orthographic photo-reference redraws',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  for(const id of ['arduino-led','arduino-pot','arduino-oled-091-yellow']){
    const art=Arduino.art(by[id],{potentiometer:50});
    assert.ok(art.includes('arduino-orthographic'),id);
  }
});


test('KY sensor family is rendered as true flat orthographic PCB, not pseudo-isometric',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  for(const id of ['arduino-rgb-led','arduino-button','arduino-ldr','arduino-sound-sensor','arduino-flame','arduino-reed','arduino-dht11','arduino-joystick','arduino-rotary-encoder','arduino-buzzer','arduino-relay-1ch']){
    const art=Arduino.art(by[id],{});
    assert.ok(art.includes('arduino-orthographic'),id);
    assert.ok(art.includes('photo-redraw'),id);
    assert.equal(art.includes(' l15 -8'),false,id);
  }
});


test('requested Arduino sensor geometry uses physical pin positions and interactive handles',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const hs=by['arduino-hcsr04'];assert.deepEqual(hs.pins.map(p=>[p.id,p.x,p.y]),[['VCC',40,102],['TRIG',60,102],['ECHO',80,102],['GND',100,102]]);
  const lm=by['arduino-lm35'];assert.deepEqual(lm.pins.map(p=>[p.id,p.x,p.y]),[['VCC',35,96],['AO',55,96],['GND',75,96]]);
  const resistor=Arduino.art(by['arduino-resistor-220'],{});assert.ok(resistor.includes('stroke="#111"'));
  const checks={'arduino-flame':'data-flame-toggle','arduino-reed':'data-reed-magnet','arduino-ldr':'data-ldr-cover','arduino-dht11':'data-dht-control','arduino-joystick':'data-joystick-handle','arduino-rotary-encoder':'data-encoder-knob','arduino-pot':'data-pot-slider'};
  for(const [id,token] of Object.entries(checks))assert.ok(Arduino.art(by[id],{}).includes(token),id+' '+token);
});


test('interactive Arduino controls are wired to app/runtime fields',()=>{
  const app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8'),rt=fs.readFileSync(path.join(root,'dist/arduino-runtime.js'),'utf8');
  for(const token of ['data-flame-toggle','data-dht-control','data-pot-slider','data-ldr-cover','data-reed-magnet','data-encoder-knob','data-joystick-handle'])assert.ok(app.includes(token),token);
  assert.ok(app.includes('c.flamePresent?900:80'));
  assert.ok(app.includes('c.state=c.reedMagnet>=65'));
  assert.ok(app.includes('c.arduinoValue=Math.round(900-c.ldrCover*7.8)'));
  assert.ok(rt.includes("kind:'dht'"));
  assert.ok(rt.includes('dhtTemperature(name)'));
  assert.ok(rt.includes("r==='encoder'"));
});


test('motors Bluetooth and transistor terminals match physical redraw geometry',()=>{
 const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
 assert.deepEqual(by['arduino-dc-motor'].pins.map(p=>[p.id,p.x,p.y]),[['+',52,112],['-',98,112]]);
 assert.equal(by['arduino-dc-motor'].refPrefix,'M');
 assert.deepEqual(by['arduino-nema17'].pins.map(p=>[p.id,p.x,p.y]),[['A1',45,146],['A2',65,146],['B1',85,146],['B2',105,146]]);
 assert.deepEqual(by['arduino-bc327'].pins.map(p=>[p.x,p.y]),[[37,102],[56,102],[75,102]]);
 assert.deepEqual(by['arduino-bd139'].pins.map(p=>[p.x,p.y]),[[42,116],[63,116],[84,116]]);
 assert.deepEqual(by['arduino-bd140'].pins.map(p=>[p.x,p.y]),[[42,116],[63,116],[84,116]]);
 for(const id of ['arduino-dc-motor','arduino-nema17','arduino-servo-sg90','arduino-hc05','arduino-hc06']){
   const art=Arduino.art(by[id],{});assert.ok(art.includes('arduino-orthographic'),id);
 }
});


test('PCF8574 backpack exposes standard LCD1602 16-pin connection header and TLP521 uses physical DIP redraw',()=>{
 const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
 const bp=by['arduino-lcd-i2c-backpack'],lcdPins=['VSS','VDD','VO','RS','RW','E','D0','D1','D2','D3','D4','D5','D6','D7','A','K'];
 assert.equal(bp.pins.length,20);
 for(const p of lcdPins)assert.ok(bp.pins.some(x=>x.id===p),p);
 assert.ok(Arduino.art(bp,{}).includes('lcd-i2c-backpack-photo-redraw'));
 for(const id of ['arduino-tlp521-1','arduino-tlp521-2','arduino-tlp521-4']){
   const art=Arduino.art(by[id],{});assert.ok(art.includes('tlp521-photo-redraw'));assert.ok(art.includes('TOSHIBA'));
 }
});


test('requested Arduino terminals are aligned on the left edge',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x]));
  const expected={
    'arduino-pot':['VCC','SIG','GND'],
    'arduino-dht11':['VCC','DATA','GND'],
    'arduino-mq2':['VCC','AO','GND'],
    'arduino-hc05':['STATE','RXD','TXD','GND','VCC','EN']
  };
  for(const [id,pins] of Object.entries(expected)){
    const d=by[id];assert.ok(d,id);
    assert.deepEqual(d.pins.map(p=>p.id),pins,id+' pin order');
    for(const p of d.pins){assert.equal(p.x,0,id+' '+p.id+' x');assert.equal(p.side,'left',id+' '+p.id+' side')}
  }
});


test('HC-05 visible header legs align with its real left terminal coordinates',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x])),d=by['arduino-hc05'],art=Arduino.art(d,{});
  assert.deepEqual(d.pins.map(p=>p.y),[16,34,52,70,88,106]);
  assert.equal(d.pins.every(p=>p.x===0&&p.side==='left'),true);
  assert.ok(art.includes('hc05-left-header'));
  for(const y of [16,34,52,70,88,106])assert.ok(art.includes('M0 '+y+'H12'),'visual lead y='+y);
});


test('20 kg loadcell has a physical four-wire bridge and direct load arrow',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x])),d=by['arduino-loadcell-20kg'];
  assert.ok(d);assert.equal(d.loadCapacity,20);
  assert.deepEqual(d.pins.map(p=>p.id),['E+','E-','A+','A-']);
  const art=Arduino.art(d,{id:'lc1',loadWeight:10});
  assert.ok(art.includes('loadcell20-photo-redraw'));
  assert.ok(art.includes('data-load-handle="lc1"'));
  assert.ok(art.includes('10.0 kg'));
});


test('MAX485 uses the official DIP-8 pin order and physical top-view redraw',()=>{
  const by=Object.fromEntries(Arduino.components.map(x=>[x.id,x])),d=by['arduino-max485'];
  assert.ok(d);assert.deepEqual(d.pins.map(p=>p.id),['RO','RE','DE','DI','VCC','B','A','GND']);
  const art=Arduino.art(d,{});assert.ok(art.includes('max485-dip8-photo-redraw'));assert.ok(art.includes('MAX485'));
});


test('signal generator does not get the motor rotation overlay',()=>{
  const Symbols=require('../dist/symbols.js'),d=by['arduino-signal-generator'];
  assert.ok(d);assert.equal(d.arduinoRole,'signal-generator');
  assert.equal(Symbols.motionMarkup(d,{_spin:0},false,'material'),'');
  const rotatingGenerator={...d,id:'test-real-generator',arduinoRole:'',kind:'generator',w:120,h:100};
  assert.match(Symbols.motionMarkup(rotatingGenerator,{_spin:1},false,'material'),/motion-indicator/);
});
