const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const Examples=require('../dist/arduino-examples.js');
const Arduino=require('../dist/arduino-runtime.js');

test('official Arduino example catalog contains exact-source protected entries',()=>{
  assert.equal(Examples.count,109);
  assert.equal(Examples.catalog.every(x=>x.official===true&&x.readOnly===true),true);
  assert.equal(Examples.catalog.every(x=>typeof x.code==='string'&&x.code.length>20&&x.sourceRepo&&x.sourcePath&&x.sourceUrl),true);
  for(const category of ['Built-in · 01.Basics','Built-in · 09.USB','Standard Library · EEPROM','Standard Library · Wire','Standard Library · Servo','Standard Library · LiquidCrystal','Standard Library · Stepper','Standard Library · SD'])assert.ok(Examples.categories.includes(category),category);
});

test('legacy core aliases resolve to original official sketches',()=>{
  for(const id of ['blink','bare-minimum','analog-read-serial','button','fade-led','tone-melody','ping','servo-sweep'])assert.ok(Examples.byId[id]?.official,id);
  assert.match(Examples.byId.blink.sourcePath,/01\.Basics\/Blink\/Blink\.ino$/);
  assert.match(Examples.byId['servo-sweep'].sourcePath,/examples\/Sweep\/Sweep\.ino$/);
});

test('official example project marks the UNO program read-only while blank project stays editable',()=>{
  const p=Arduino.exampleProject('blink','official-test'),uno=p.components.find(c=>c.typeId==='arduino-uno');
  assert.ok(uno.arduinoOfficialExample?.readOnly);assert.equal(uno.arduinoOfficialExample.id,Examples.byId.blink.id);
  const blank=Arduino.exampleProject('blank','blank-test'),blankUno=blank.components.find(c=>c.typeId==='arduino-uno');
  assert.equal(blankUno.arduinoOfficialExample,undefined);
});

test('save as copy clears official protection but retains source trace',()=>{
  const store=new Map(),storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
  const p=Arduino.exampleProject('blink','copy-test'),uno=p.components[0],source=uno.arduinoOfficialExample;
  const row=Arduino.saveBoard(storage,{name:'Blink · Çalışma kopyam',sketch:uno.arduinoSketch,sourceExample:source});
  Arduino.applySaved(uno,row);
  assert.equal(uno.arduinoOfficialExample,undefined);assert.equal(uno.arduinoBoardId,row.id);assert.equal(uno.arduinoSourceExample.id,source.id);
});

test('IDE exposes protected-example Save / Save As flow and leaves simulation styling alone',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),js=fs.readFileSync(path.join(root,'dist/arduino-ide.js'),'utf8'),css=fs.readFileSync(path.join(root,'dist/arduino.css'),'utf8');
  for(const token of ['id="arduinoOfficialBanner"','id="arduinoSaveProgram"','id="arduinoSaveAsProgram"','id="arduinoUpload"'])assert.ok(html.includes(token),token);
  for(const token of ['Hazır Arduino örneği korunuyor','Farklı Kaydet','readOnly=locked','arduinoOfficialExample'])assert.ok(js.includes(token),token);
  assert.equal(/\.simulate\s*[{,:]/.test(css),false,'Arduino CSS must not restyle locked simulation button');
});

test('official Blink source remains runnable by the basic virtual UNO engine',()=>{
  const r=Arduino.verify(Examples.byId.blink.code);assert.equal(r.ok,true,r.message);
});


test('Arduino IDE launcher exists only in the right properties panel for the selected UNO',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
  const app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
  const ide=fs.readFileSync(path.join(root,'dist/arduino-ide.js'),'utf8');
  assert.equal(html.includes('id="arduinoIdeBtn"'),false,'left library IDE button must not exist');
  assert.ok(html.includes('id="arduinoSelectedIde"'),'right properties IDE button must exist');
  assert.ok(app.includes("$('#arduinoSelectedIde').hidden=!d.arduinoBoard"));
  assert.equal(app.includes("$('#arduinoIdeBtn')"),false);
  assert.equal(ide.includes("$('#arduinoIdeBtn')"),false);
});
