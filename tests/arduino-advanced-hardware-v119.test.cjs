'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Library=require('../dist/arduino-library.js'),Runtime=require('../dist/arduino-runtime.js');
const byId=Object.fromEntries(Library.components.map(x=>[x.id,x]));
const C=(id,typeId,extra={})=>({id,typeId,x:0,y:0,rotation:0,label:id,ref:id.toUpperCase(),state:false,...extra});
let wi=0;const W=(a,ap,b,bp)=>({id:'advw'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},points:[],color:'#d32f2f'});
const P=(sketch,components=[],wires=[])=>({version:7,workspaceMode:'arduino',components:[C('uno','arduino-uno',{arduinoSketch:sketch}),...components],wires,junctions:[]});
const run=(p,times=[0,20,50,100,250])=>{for(const now of times)Runtime.tick(p,byId,{now});assert.equal(p.components[0]._arduinoError||'','');return p};

test('LCD1602 I2C writes two lines with backlight',()=>{
 const p=P('#include <LiquidCrystal_I2C.h>\nLiquidCrystal_I2C lcd(0x27,16,2);\nvoid setup(){lcd.init();lcd.backlight();lcd.setCursor(0,0);lcd.print("MERHABA");lcd.setCursor(0,1);lcd.print("I2C");}\nvoid loop(){delay(1);}',[C('lcd','arduino-lcd1602-i2c')],[W('uno','A4','lcd','SDA'),W('uno','A5','lcd','SCL'),W('uno','5V','lcd','VCC'),W('uno','GND','lcd','GND')]);run(p);const lcd=p.components[1];assert.match(lcd._arduinoDisplayLines[0],/^MERHABA/);assert.match(lcd._arduinoDisplayLines[1],/^I2C/);assert.equal(lcd._arduinoLcdBacklight,true);
});

test('7segment, SG90 and Stepper produce visible runtime state',()=>{
 const seg=P('void setup(){pinMode(2,OUTPUT);pinMode(3,OUTPUT);digitalWrite(2,HIGH);digitalWrite(3,HIGH);} void loop(){delay(1);}',[C('seg','arduino-7segment')],[W('uno','D2','seg','A'),W('uno','D3','seg','B'),W('uno','GND','seg','GND')]);run(seg);assert.equal(seg.components[1]._sevenSegments.A,true);assert.equal(seg.components[1]._sevenSegments.B,true);
 const servo=P('#include <Servo.h>\nServo s; void setup(){s.attach(9);s.writeMicroseconds(2400);} void loop(){delay(1);}',[C('s','arduino-servo-sg90')],[W('uno','D9','s','SIG'),W('uno','5V','s','VCC'),W('uno','GND','s','GND')]);run(servo);assert.equal(Math.round(servo.components[1]._arduinoServoAngle),180);
 const st=P('#include <Stepper.h>\n#define STEPS 2048\nStepper m(STEPS,8,9,10,11); void setup(){m.setSpeed(10);} void loop(){m.step(8);delay(10);}',[C('m','arduino-stepper-28byj')],[W('uno','D8','m','IN1'),W('uno','D9','m','IN2'),W('uno','D10','m','IN3'),W('uno','D11','m','IN4'),W('uno','5V','m','VCC'),W('uno','GND','m','GND')]);run(st,[0,50,100,200,500]);assert.notEqual(st.components[1]._arduinoStepperAngle,0);
});

test('A4988 drives NEMA17 only with logic and motor power wired',()=>{
 const p=P('void setup(){pinMode(2,OUTPUT);pinMode(3,OUTPUT);digitalWrite(3,HIGH);} void loop(){digitalWrite(2,HIGH);delay(1);digitalWrite(2,LOW);delay(1);}',[C('drv','arduino-a4988'),C('motor','arduino-nema17'),C('ps','arduino-bench-supply')],[W('uno','D2','drv','STEP'),W('uno','D3','drv','DIR'),W('uno','5V','drv','VDD'),W('uno','GND','drv','GND'),W('ps','P','drv','VMOT'),W('ps','M','drv','GNDM'),W('drv','1A','motor','A1'),W('drv','1B','motor','A2'),W('drv','2A','motor','B1'),W('drv','2B','motor','B2')]);run(p,[0,2,4,6,8,10]);assert.equal(p.components[1]._a4988Enabled,true);assert.notEqual(p.components[2]._arduinoStepperAngle,0);
});

test('HW131, NE555 and HC06 state models are active',()=>{
 const hw=P('void setup(){delay(1);} void loop(){delay(1);}',[C('hw','arduino-hw131',{hw131On:true,hw131Left:'5',hw131Right:'3.3'})],[W('uno','5V','hw','USB5V')]);run(hw);assert.equal(hw.components[1]._hw131Powered,true);assert.equal(hw.components[1]._hw131Outputs.left,5);assert.equal(hw.components[1]._hw131Outputs.right,3.3);
 const t=P('void setup(){delay(1);} void loop(){delay(1);}',[C('t','arduino-ne555',{ne555Mode:'astable',ne555RaK:1,ne555RbK:10,ne555Cuf:1})]);run(t,[0,5,10,20,30]);assert.ok(t.components[1]._ne555Frequency>60);assert.ok(t.components[1]._ne555Frequency<80);
 const bt=P('void setup(){delay(1);} void loop(){delay(1);}',[C('bt','arduino-hc06',{hc05AtMode:true})]);run(bt);assert.equal(bt.components[1].hc05AtMode,false);assert.equal(bt.components[1]._hcBluetoothRole,'slave');
});


test('separate PCF8574 backpack can drive a normal LCD1602 through its 16-pin header',()=>{
 const pins=['VSS','VDD','VO','RS','RW','E','D0','D1','D2','D3','D4','D5','D6','D7','A','K'];
 const components=[C('bp','arduino-lcd-i2c-backpack',{i2cAddress:39}),C('lcd','arduino-lcd1602')];
 const wires=[W('uno','A4','bp','SDA'),W('uno','A5','bp','SCL'),W('uno','5V','bp','VCC'),W('uno','GND','bp','GND'),...pins.map(p=>W('bp',p,'lcd',p))];
 const p=P('#include <LiquidCrystal_I2C.h>\nLiquidCrystal_I2C lcd(0x27,16,2);\nvoid setup(){lcd.init();lcd.backlight();lcd.print("BACKPACK OK");}\nvoid loop(){delay(1);}',components,wires);
 run(p);assert.match(p.components[2]._arduinoDisplayLines[0],/^BACKPACK OK/);assert.equal(p.components[2]._arduinoLcdBacklight,true);
});


test('20 kg loadcell changes HX711 raw and get_units output',()=>{
 const p=P('#include <HX711.h>\nHX711 scale;\nfloat kg=0;long raw=0;\nvoid setup(){scale.begin(2,3);scale.set_scale(400000);}\nvoid loop(){raw=scale.read();kg=scale.get_units(5);delay(1);}',[C('hx','arduino-hx711'),C('lc','arduino-loadcell-20kg',{loadWeight:7.5})],[W('uno','D2','hx','DT'),W('uno','D3','hx','SCK'),W('uno','5V','hx','VCC'),W('uno','GND','hx','GND'),W('hx','E+','lc','E+'),W('hx','E-','lc','E-'),W('hx','A+','lc','A+'),W('hx','A-','lc','A-')]);
 run(p);assert.equal(p.components[0]._arduinoRuntime.vars.raw,3000000);assert.equal(p.components[0]._arduinoRuntime.vars.kg,7.5);
});


test('two MAX485 transceivers exchange SoftwareSerial data on a half-duplex A/B bus',()=>{
 const tx='#include <SoftwareSerial.h>\nSoftwareSerial bus(2,3);\nvoid setup(){pinMode(4,OUTPUT);digitalWrite(4,HIGH);bus.begin(9600);bus.write(65);}\nvoid loop(){delay(1);}';
 const rx='#include <SoftwareSerial.h>\nSoftwareSerial bus(2,3);\nint received=-1;\nvoid setup(){pinMode(4,OUTPUT);digitalWrite(4,LOW);bus.begin(9600);}\nvoid loop(){if(bus.available()){received=bus.read();}delay(1);}';
 const p={version:7,workspaceMode:'arduino',components:[C('u1','arduino-uno',{arduinoSketch:tx}),C('m1','arduino-max485'),C('u2','arduino-uno',{arduinoSketch:rx}),C('m2','arduino-max485')],wires:[],junctions:[]};
 const link=(a,ap,b,bp)=>p.wires.push(W(a,ap,b,bp));
 link('u1','D2','m1','RO');link('u1','D3','m1','DI');link('u1','D4','m1','DE');link('u1','D4','m1','RE');link('u1','5V','m1','VCC');link('u1','GND','m1','GND');
 link('u2','D2','m2','RO');link('u2','D3','m2','DI');link('u2','D4','m2','DE');link('u2','D4','m2','RE');link('u2','5V','m2','VCC');link('u2','GND','m2','GND');
 link('m1','A','m2','A');link('m1','B','m2','B');
 run(p,[0,10,20,40]);assert.equal(p.components[2]._arduinoRuntime.vars.received,65);
});
