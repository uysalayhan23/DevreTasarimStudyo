'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Library=require('../dist/arduino-library.js'),Runtime=require('../dist/arduino-runtime.js');
const byId=Object.fromEntries(Library.components.map(x=>[x.id,x]));
const C=(id,typeId,extra={})=>({id,typeId,x:0,y:0,rotation:0,label:id,ref:id.toUpperCase(),state:false,...extra});let wi=0;
const W=(a,ap,b,bp)=>({id:'is'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},points:[],color:'#d32f2f'});
const P=(sketch,components,wires)=>({version:7,workspaceMode:'arduino',components:[C('uno','arduino-uno',{arduinoSketch:sketch}),...components],wires,junctions:[]});
const run=(p,t=[0,5,10,20,50])=>{for(const now of t)Runtime.tick(p,byId,{now});assert.equal(p.components[0]._arduinoError||'','');return p};

test('flame, LDR and reed environmental states reach Arduino pins',()=>{
 const f=run(P('int a=0;int d=0;void setup(){pinMode(2,INPUT);}void loop(){a=analogRead(A0);d=digitalRead(2);delay(1);}',[C('f','arduino-flame',{flamePresent:true,arduinoValue:900})],[W('uno','A0','f','AO'),W('uno','D2','f','DO')]));assert.equal(f.components[0]._arduinoRuntime.vars.a,900);assert.equal(f.components[0]._arduinoRuntime.vars.d,1);
 const l=run(P('int a=0;void setup(){}void loop(){a=analogRead(A0);delay(1);}',[C('l','arduino-ldr',{ldrCover:100,arduinoValue:120})],[W('uno','A0','l','AO')]));assert.equal(l.components[0]._arduinoRuntime.vars.a,120);
 const r=run(P('int d=0;void setup(){pinMode(2,INPUT);}void loop(){d=digitalRead(2);delay(1);}',[C('r','arduino-reed',{reedMagnet:100,state:true})],[W('uno','D2','r','DO')]));assert.equal(r.components[0]._arduinoRuntime.vars.d,1);
});
test('DHT11 bars feed standard DHT object through DATA',()=>{
 const p=run(P('#include <DHT.h>\n#define DHTPIN 2\n#define DHTTYPE DHT11\nDHT dht(DHTPIN,DHTTYPE);float t=0;float h=0;void setup(){dht.begin();}void loop(){t=dht.readTemperature();h=dht.readHumidity();delay(1);}',[C('dht','arduino-dht11',{arduinoValue:37,arduinoHumidity:68})],[W('uno','D2','dht','DATA')]));assert.equal(p.components[0]._arduinoRuntime.vars.t,37);assert.equal(p.components[0]._arduinoRuntime.vars.h,68);
});
test('encoder, joystick and RGB values reach/read Arduino pins',()=>{
 const e=run(P('int c=0;int d=0;void setup(){pinMode(2,INPUT);pinMode(3,INPUT);}void loop(){c=digitalRead(2);d=digitalRead(3);delay(1);}',[C('e','arduino-rotary-encoder',{_encoderCLK:1,_encoderDT:0,encoderAngle:90})],[W('uno','D2','e','CLK'),W('uno','D3','e','DT')]));assert.equal(e.components[0]._arduinoRuntime.vars.c,1);assert.equal(e.components[0]._arduinoRuntime.vars.d,0);
 const j=run(P('int x=0;int y=0;void setup(){}void loop(){x=analogRead(A0);y=analogRead(A1);delay(1);}',[C('j','arduino-joystick',{arduinoX:900,arduinoY:120})],[W('uno','A0','j','VRX'),W('uno','A1','j','VRY')]));assert.equal(j.components[0]._arduinoRuntime.vars.x,900);assert.equal(j.components[0]._arduinoRuntime.vars.y,120);
 const rgb=run(P('void setup(){pinMode(9,OUTPUT);pinMode(10,OUTPUT);pinMode(11,OUTPUT);}void loop(){analogWrite(9,255);analogWrite(10,128);analogWrite(11,32);delay(1);}',[C('rgb','arduino-rgb-led')],[W('uno','D9','rgb','R'),W('uno','D10','rgb','G'),W('uno','D11','rgb','B')]));assert.deepEqual(rgb.components[1]._arduinoRGB,{r:255,g:128,b:32});
});
