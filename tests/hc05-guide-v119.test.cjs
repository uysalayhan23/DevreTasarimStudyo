const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('HC-05 selection exposes a work-note button and dedicated guide modal',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
  for(const id of ['hc05WorkNote','hc05GuideModal','hc05GuideClose','hc05GuideDone'])assert.ok(html.includes('id="'+id+'"'),id);
  assert.ok(app.includes("btNote.hidden=arduinoRole!=='bluetooth-hc05'"));
  assert.ok(app.includes("$('#hc05WorkNote').onclick=openHC05Guide"));
});
test('HC-05 guide documents run, AT and PC Bluetooth COM steps',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
  for(const token of ['Normal veri modu','AT / KEY modu','PC Bluetooth / COM ile dış dünya','Sanal eş cihaz → Bluetooth','SoftwareSerial BT(10, 11)'])assert.ok(html.includes(token),token);
});
test('HC-05 guide styling does not touch the locked simulation button',()=>{
  const css=fs.readFileSync(path.join(root,'dist/arduino.css'),'utf8');
  assert.equal(/\.simulate\s*[{,:]/.test(css),false);
});
