'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const DIST=path.resolve(__dirname,'../dist');
function physicalLibrary(){const ctx={window:{COMPONENT_LIBRARY:[]}};vm.runInNewContext(fs.readFileSync(path.join(DIST,'electronics-ics-v11920.js'),'utf8'),ctx);return ctx.window.COMPONENT_LIBRARY}
const lib=physicalLibrary(),byId=Object.fromEntries(lib.map(d=>[d.id,d])),Digital=require('../dist/digital-ic-runtime-v11920.js');
function net(values={}){return {dcVoltage(c,a,b){const av=values[String(a)],bv=values[String(b)];return Number.isFinite(av)&&Number.isFinite(bv)?av-bv:null}}}
function powered(d,extra={}){const v={...extra};if(d.supplyPins){v[String(d.supplyPins.negative)]=0;v[String(d.supplyPins.positive)]=5}return v}
test('real electronics remain orthographic while five virtual instruments never claim physical packaging',()=>{
 const virtualIds=new Set([
  'virtual-pwm-generator-v1','virtual-isolated-ac-12v','virtual-ac-scr-trigger-v1',
  'virtual-ac-triac-trigger-v1','virtual-opto-flasher-timer-v1'
 ]);
 assert.ok(lib.length>=33,lib.length);
 assert.equal(lib.filter(d=>d.virtualInstrument).length,virtualIds.size);
 for(const d of lib){
  assert.equal(d.arduinoShared,true,d.id);
  assert.ok(d.pins?.length>=2,d.id);
  assert.equal(new Set(d.pins.map(p=>p.id)).size,d.pins.length,d.id+' duplicate terminals');
  if(virtualIds.has(d.id)){
   assert.equal(d.virtualInstrument,true,d.id);
   assert.equal(d.realPackage,null,d.id+' must not impersonate a manufacturer package');
   assert.equal(d.manufacturerGeometryAccepted,false,d.id);
  }else{
   assert.notEqual(d.virtualInstrument,true,d.id+' undeclared virtual instrument');
   assert.equal(d.realPackage?.topView,true,d.id);
   assert.equal(d.realPackage?.orthographic,true,d.id);
   assert.equal(d.realPackage?.transparentBackground,true,d.id);
  }
 }
});
test('MOC3021 PDIP-6 top-view pins remain identifiable without physical safety acceptance',()=>{
 const d=byId['moc3021-opto-triac'];
 assert.ok(d,'MOC3021 catalog entry missing');
 assert.equal(d.realPackage?.type,'PDIP-6');
 assert.equal(d.realPackage?.pins,6);
 assert.equal(d.realPackage?.topView,true);
 assert.equal(d.realPackage?.orthographic,true);
 assert.equal(d.realPackage?.transparentBackground,true);
 assert.deepEqual(Array.from(d.pins,p=>String(p.id)),['1','2','4','6']);
 assert.deepEqual(Array.from(d.pins,p=>p.physicalPin),[1,2,4,6]);
 assert.equal(d.virtualOpticalCoupling,true);
 assert.equal(d.manufacturerGeometryAccepted,false);
 assert.notEqual(d.virtualInstrument,true);
});
test('Arduino workspace and catalog accept shared electronics',()=>{const W=require('../dist/workspaces.js'),C=require('../dist/catalog.js');for(const d of lib){assert.equal(W.includes(d,'arduino'),true,d.id);assert.equal(C.matches(d,{category:'arduino'}),true,d.id)}})
test('SN74HC00 NAND truth table',()=>{const d=byId.sn74hc00n,c={};for(const [a,b,y] of [[0,0,1],[0,1,1],[1,0,1],[1,1,0]]){Digital.clear(c);const s=Digital.evaluate(c,d,net(powered(d,{'1':a?5:0,'2':b?5:0})),0);assert.equal(s.outputs['3'].logic,y)}})
test('SN74HC74 captures D on rising edge',()=>{const d=byId.sn74hc74n,c={},v=powered(d,{'1':5,'4':5,'13':5,'10':5,'3':0,'2':5,'11':0,'12':0});Digital.evaluate(c,d,net(v),0);v['3']=5;const s=Digital.evaluate(c,d,net(v),1);assert.equal(s.outputs['5'].logic,1)})
test('SN74HC595 shift and latch',()=>{const d=byId.sn74hc595n,c={},v=powered(d,{'10':5,'13':0,'11':0,'12':0,'14':5});Digital.evaluate(c,d,net(v),0);v['11']=5;Digital.evaluate(c,d,net(v),1);v['11']=0;Digital.evaluate(c,d,net(v),2);v['12']=5;const s=Digital.evaluate(c,d,net(v),3);assert.equal(s.outputs['15'].logic,1)})
test('ADC0804 midscale conversion and DAC0808 current output',()=>{let d=byId.adc0804lcn,c={},v=powered(d,{'1':0,'2':5,'3':0,'6':2.5,'7':0,'9':2.5});Digital.evaluate(c,d,net(v),0);v['3']=5;Digital.evaluate(c,d,net(v),1);let s=Digital.evaluate(c,d,net(v),1.2);assert.ok(s.data>=127&&s.data<=128,s.data);d=byId.dac0808lcn;c={referenceResistance:5000};v=powered(d,{'14':5,'15':0,'5':5,'6':5,'7':5,'8':5,'9':5,'10':5,'11':5,'12':5});s=Digital.evaluate(c,d,net(v),0);assert.ok(Math.abs(s.analogCurrentA-(.001*255/256))<1e-9,s.analogCurrentA)})
test('tutorial physical placeholders are removed by final pedagogy pass',()=>{const ctx={window:{}};for(const file of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-source-outline.js','tutorial-pedagogy.js'])vm.runInNewContext(fs.readFileSync(path.join(DIST,file),'utf8'),ctx);const generic=new Set(['tutorial-mosfet','tutorial-igbt','tutorial-scr','tutorial-triac','tutorial-diac','tutorial-opamp','tutorial-logic-and','tutorial-logic-or','tutorial-logic-not','tutorial-logic-buffer','tutorial-logic-nand','tutorial-logic-nor','tutorial-logic-xor','tutorial-logic-xnor','tutorial-ff-rs','tutorial-ff-jk','tutorial-ff-d','tutorial-ff-t','tutorial-adc','tutorial-dac','tutorial-logic-mux','tutorial-logic-demux','tutorial-logic-decoder','tutorial-logic-encoder','tutorial-full-adder','tutorial-comparator','tutorial-diode','tutorial-fet','tutorial-crystal','tutorial-microphone','tutorial-speaker']);const offenders=[];for(const l of ctx.window.DTSTutorialLessons.lessons)for(const c of l.project?.components||[])if(generic.has(c.typeId))offenders.push(l.id+':'+c.typeId);assert.deepEqual(offenders,[])})

test('LM358 lesson uses the full physical PDIP-8 package and actual A-channel pins',()=>{
 const ctx={window:{}};
 for(const file of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-source-outline.js','tutorial-pedagogy.js'])vm.runInNewContext(fs.readFileSync(path.join(DIST,file),'utf8'),ctx);
 const lesson=ctx.window.DTSTutorialLessons.lessons.find(l=>/Eviren yükselteç DC giriş/i.test(l.title));
 assert.ok(lesson,'inverting amplifier lesson');
 const u1=lesson.project.components.find(x=>x.id==='u1');
 assert.equal(u1.typeId,'lm358p-dip8');assert.equal(u1.ref,'U1');
 const endpoints=lesson.project.wires.flatMap(w=>[w.from,w.to]).filter(e=>e.c==='u1').map(e=>String(e.p));
 for(const pin of ['1','2','3','4','8'])assert.ok(endpoints.includes(pin),'LM358 physical pin '+pin);
 for(const legacy of ['OUT','IN-','IN+','V-','V+'])assert.ok(!endpoints.includes(legacy),'legacy endpoint '+legacy);
});

test('real-package rendering cannot fall back to a white product-photo card',()=>{
 const symbols=fs.readFileSync(path.join(DIST,'symbols.js'),'utf8');
 const materials=fs.readFileSync(path.join(DIST,'materials.js'),'utf8');
 assert.match(symbols,/d\.realPackage\?Materials\.markup\(d,c\):d\.productVisualUrl/);
 assert.doesNotMatch(symbols,/real-product-photo"><rect[^>]+fill="#fff"/);
 assert.match(materials,/data-real-package="PDIP"/);
 assert.match(materials,/data-real-package="TO-126"/);
 assert.match(materials,/data-real-package="LDR-5MM"/);
});

test('legacy LM358 A-unit is hidden and project migration maps it to full PDIP-8',()=>{
 const source=fs.readFileSync(path.join(DIST,'electronics-library-v119.js'),'utf8');
 const catalog=fs.readFileSync(path.join(DIST,'catalog.js'),'utf8');
 const app=fs.readFileSync(path.join(DIST,'app.js'),'utf8');
 assert.match(source,/lm358p-opamp-a[\s\S]{0,500}catalogHidden:true[\s\S]{0,120}legacyAliasTo:'lm358p-dip8'/);
 assert.match(catalog,/d\.catalogHidden!==true/);
 assert.match(app,/legacyLm358/);assert.match(app,/'OUT':'1','IN-':'2','IN\+':'3','V-':'4','V\+':'8'/);
});


test('Arduino IC and optocoupler packages use the same transparent orthographic physical standard',()=>{
 const ctx={window:{COMPONENT_LIBRARY:[]}};
 vm.runInNewContext(fs.readFileSync(path.join(DIST,'arduino-library.js'),'utf8'),ctx);
 const parts=ctx.window.COMPONENT_LIBRARY.filter(d=>d.arduinoRole==='ne555'||d.kind==='arduino-ic'||d.arduinoRole==='opto'||d.arduinoRole==='transistor-to126'||d.arduinoRole==='transistor-to92');
 assert.ok(parts.length>=14,parts.length);
 for(const d of parts){
  assert.equal(d.realPackage?.topView,true,d.id+' top view');
  assert.equal(d.realPackage?.orthographic,true,d.id+' orthographic');
  assert.equal(d.realPackage?.transparentBackground,true,d.id+' transparent');
  for(const p of d.pins)assert.ok(Number.isFinite(Number(p.physicalPin)),d.id+' physical pin '+p.id);
 }
 const source=fs.readFileSync(path.join(DIST,'arduino-library.js'),'utf8');
 assert.doesNotMatch(source,/transistor-to126-real-photo/);
 assert.doesNotMatch(source,/vistronica\.com\/.*bd13|vistronica\.com\/.*bd14/i);
});

test('active electronics libraries have no external product-photo dependency',()=>{
 const electronics=fs.readFileSync(path.join(DIST,'electronics-library-v119.js'),'utf8');
 const physical=fs.readFileSync(path.join(DIST,'electronics-ics-v11920.js'),'utf8');
 assert.doesNotMatch(electronics,/productVisualUrl\s*:/);
 assert.doesNotMatch(physical,/productVisualUrl\s*:/);
});

test('browser boot order loads real IC library and runtime',()=>{const html=fs.readFileSync(path.join(DIST,'index.html'),'utf8');assert.ok(html.indexOf('electronics-ics-v11920.js')>0);assert.ok(html.indexOf('digital-ic-runtime-v11920.js')>0);assert.ok(html.indexOf('digital-ic-runtime-v11920.js')<html.indexOf('simulation.js'))});
