'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Dold=require('../dist/dold-safety.js');

function loadLibrary(){
 const scope={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),scope);
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/dold-library.js'),'utf8'),scope);
 return scope.window.COMPONENT_LIBRARY;
}
test('DOLD runtime/library/example modules parse',()=>{
 for(const p of ['../dist/dold-safety.js','../dist/dold-library.js','../dist/dold-examples.js','../dist/norms.js','../dist/symbols.js','../dist/simulation.js','../dist/app.js']){
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(require.resolve(p),'utf8'),{filename:p}));
 }
});
test('uploaded DOLD product families and documented variants exist with guides and straight-on assets',()=>{
 const lib=loadLibrary(),ids=['dold-bg5933-22','dold-bh5933-48','dold-bn5930-48','dold-bo5988-47','dold-bo5988-61','dold-bo5988-62','dold-lg5925-02','dold-lg5925-04','dold-lg5925-48','dold-ne5021-02'];
 for(const id of ids){const d=lib.find(x=>x.id===id);assert.ok(d,id);assert.equal(d.orientation,'front');assert.ok(d.doldAsset,/asset/.test(id)?id:d.doldAsset);assert.ok(d.deviceGuide?.purpose);assert.ok(d.deviceGuide?.connections?.length);if(d.doldSafety){assert.equal(d.productVisualExact,true,id+' exact visual');assert.equal(d.productVisualType,'manufacturer-referenced-orthographic-front',id+' visual type');assert.match(d.productVisualSource,/DOLD üretici ürün görseli/,id+' source');assert.equal(d.schematicLiveContacts,true,id+' live contacts')}}
 const bg=lib.find(x=>x.id==='dold-bg5933-22'),bh=lib.find(x=>x.id==='dold-bh5933-48'),bn=lib.find(x=>x.id==='dold-bn5930-48');
 assert.deepEqual(Array.from(bg.doldOutputs,x=>[x.a,x.b,x.normal]),[['13','14','NO'],['23','24','NO'],['31','32','NC']]);
 assert.deepEqual(Array.from(bh.doldOutputs,x=>[x.a,x.b,x.normal]),[['13','14','NO'],['23','24','NO'],['33','34','NO'],['41','42','NC']]);
 assert.deepEqual(Array.from(bn.doldOutputs,x=>[x.a,x.b,x.normal]),[['13','14','NO'],['23','24','NO'],['33','34','NO'],['41','42','NC']]);
});
test('BO 5988 and LG 5925 documented output variants are distinct',()=>{
 const lib=loadLibrary(),g=id=>lib.find(x=>x.id===id);
 assert.equal(g('dold-bo5988-61').doldOutputs.filter(x=>x.role==='safety').length,6);
 assert.ok(g('dold-bo5988-61').doldOutputs.some(x=>x.a==='81'&&x.b==='82'&&x.normal==='NC'));
 assert.ok(g('dold-bo5988-62').doldOutputs.some(x=>x.a==='83'&&x.b==='84'&&x.normal==='NO'));
 assert.ok(g('dold-bo5988-47').doldOutputs.some(x=>x.a==='77'&&x.b==='78'&&x.role==='delayed'));
 assert.equal(g('dold-lg5925-02').doldOutputs.filter(x=>x.normal==='NO').length,2);
 assert.equal(g('dold-lg5925-04').doldOutputs.filter(x=>x.normal==='NO').length,4);
 assert.equal(g('dold-lg5925-48').doldOutputs.filter(x=>x.normal==='NO').length,3);
 assert.ok(g('dold-lg5925-48').doldOutputs.some(x=>x.a==='41'&&x.b==='42'&&x.normal==='NC'));
});
test('two-hand relay enforces release-before-start and 500 ms simultaneity',()=>{
 const lib=loadLibrary(),d=lib.find(x=>x.id==='dold-bg5933-22'),c={id:'bg'},state={s11:false,s21:false,fb:true};
 const at=(_c,p)=>p==='S11'&&state.s11?[{domain:'dold:bg:+',leg:'+'}]:p==='S21'&&state.s21?[{domain:'dold:bg:0',leg:'0'}]:p==='Y2'&&state.fb?[{domain:'dold:bg:feedback',leg:'+'}]:[];
 const net={voltage:()=>true,at};
 assert.equal(Dold.evaluate(c,d,net,0).active,false);
 state.s11=true;state.s21=true;assert.equal(Dold.evaluate(c,d,net,100).active,true);
 state.s11=false;state.s21=false;Dold.evaluate(c,d,net,200);
 state.s11=true;Dold.evaluate(c,d,net,300);state.s21=true;
 const late=Dold.evaluate(c,d,net,900);assert.equal(late.active,false);assert.match(late.status,/SENKRON/);
});
test('safety output links change NO/NC state and preserve off-delay pair',()=>{
 const lib=loadLibrary(),bn=lib.find(x=>x.id==='dold-bn5930-48'),bo=lib.find(x=>x.id==='dold-bo5988-47');
 assert.ok(Dold.links({},bn,false,0).some(x=>x[0]==='41'&&x[1]==='42'));
 assert.ok(!Dold.links({},bn,false,0).some(x=>x[0]==='13'&&x[1]==='14'));
 assert.ok(Dold.links({},bn,true,0).some(x=>x[0]==='13'&&x[1]==='14'));
 const c={_doldMemory:{delayUntil:2000}};
 assert.ok(Dold.links(c,bo,false,1000).some(x=>x[0]==='77'&&x[1]==='78'));
 assert.ok(!Dold.links(c,bo,false,2500).some(x=>x[0]==='77'&&x[1]==='78'));
});
test('document atlas, visible grid, exact schematics and protected starter hooks are wired',()=>{
 const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
 assert.match(html,/minorGrid[^\n]*#dde4ec[^\n]*0\.85/);assert.match(html,/majorGrid[^\n]*#c5cfdb[^\n]*1\.15/);
 for(let i=0;i<6;i++)assert.match(html,new RegExp('dold-atlas-'+i+'\\.js'));
 assert.match(html,/data-example="dold_bg5933"/);assert.match(html,/data-example="encoder_arduino_119"/);
 const norms=fs.readFileSync(require.resolve('../dist/norms.js'),'utf8');assert.match(norms,/doldSafety.*schematicMarkup/);assert.match(norms,/incrementalEncoder38mm.*encoderSchematicMarkup/);
 const studio=fs.readFileSync(require.resolve('../dist/studio.js'),'utf8');assert.match(studio,/Object\.entries\(window\.DTSStarterProjects/);assert.match(studio,/Object\.freeze/);
});
test('KY-040 remains the original separate Arduino rotary encoder',()=>{
 const a=fs.readFileSync(require.resolve('../dist/arduino-library.js'),'utf8');
 assert.match(a,/arduino-rotary-encoder/);assert.match(a,/KY-040/);
 assert.match(a,/arduinoRole:'encoder'/);assert.doesNotMatch(a,/arduino-rotary-encoder[^\n]{0,500}industrial-encoder/);
});


test('DOLD material view is a straight-on manufacturer-referenced front with real terminal labels',()=>{
 const lib=loadLibrary(),def=lib.find(x=>x.id==='dold-bg5933-22'),m=Dold.materialMarkup({_doldEval:{powered:true,active:false,status:'START BEKLİYOR'}},def);
 assert.match(m,/dold-manufacturer-orthographic/);assert.match(m,/data-product-visual="manufacturer-referenced-front"/);assert.match(m,/DOLD/);assert.match(m,/SAFEMASTER/);assert.match(m,/data-terminal-label="A1"/);assert.match(m,/data-terminal-label="13"/);
 assert.doesNotMatch(m,/dold-live-contact/);
});

test('DOLD schematic view keeps manufacturer schematic reference and draws documented live contact pairs',()=>{
 const lib=loadLibrary(),d=lib.find(x=>x.id==='dold-bo5988-47'),c={_doldEval:{powered:true,active:false,status:'START BEKLİYOR'},_doldMemory:{delayUntil:0}};
 const idle=Dold.schematicMarkup(c,d);
 assert.match(idle,/dold-manufacturer-schematic-reference/);assert.match(idle,/DOLD DATASHEET DEVRESİ/);assert.match(idle,/dold-live-contact/);assert.match(idle,/13–14/);assert.match(idle,/81–82/);assert.match(idle,/77–78/);
 assert.match(idle,/data-contact-pair="13-14" data-contact-state="open"/);
 assert.match(idle,/data-contact-pair="81-82" data-contact-state="closed"/);
});

test('DOLD forced contacts visibly move when relay output state changes, including off-delay',()=>{
 const lib=loadLibrary(),d=lib.find(x=>x.id==='dold-bo5988-47'),c={_doldEval:{powered:true,active:false,status:'START BEKLİYOR'},_doldMemory:{delayUntil:0}};
 const idle=Dold.schematicMarkup(c,d);
 c._doldEval={powered:true,active:true,status:'ÇALIŞIYOR'};const run=Dold.schematicMarkup(c,d);
 assert.match(run,/data-contact-pair="13-14" data-contact-state="closed"/);
 assert.match(run,/data-contact-pair="81-82" data-contact-state="open"/);
 assert.match(run,/animateTransform/);
 c._doldEval={powered:true,active:false,status:'START BEKLİYOR'};c._doldMemory.delayUntil=Date.now()+5000;
 assert.equal(Dold.outputClosed(c,d,d.doldOutputs.find(o=>o.a==='77'&&o.b==='78'),Date.now()),true);
});


test('DOLD schematic keeps the actual datasheet circuit as the primary drawing with no invented logic block',()=>{
 const lib=loadLibrary(),def=lib.find(x=>x.id==='dold-bn5930-48'),svg=Dold.schematicMarkup({_doldEval:{powered:true,active:false,status:'START BEKLİYOR'}},def);
 assert.match(svg,/dold-schematic-exact-live/);assert.match(svg,/dold-manufacturer-schematic-reference/);assert.doesNotMatch(svg,/DOLD SAFEMASTER emniyet mantığı/);assert.doesNotMatch(svg,/zorlamalı mekanik bağlantı/);
});


test('safety-estop-2nc and two-hand button share the requested 36 x 46 mm frame and 29 mm actuator',()=>{
 const lib=loadLibrary();
 for(const [id,asset] of [['safety-estop-2nc','emergency-stop'],['safety-button-2no2nc','green-pushbutton']]){
  const d=lib.find(x=>x.id===id);assert.ok(d,id);
  assert.equal(d.w,72,id+' width');assert.equal(d.h,92,id+' height');
  assert.deepEqual({...d.physicalDimensionsMm},{width:36,height:46,shape:'rect'});
  assert.equal(d.buttonActuatorDiameterMm,29);assert.equal(d.buttonActuatorDiameterScene,58);
  assert.equal(d.materialAsset,asset);assert.equal(d.liveMaterial,true);
  for(const p of d.pins){assert.ok(p.x>=0&&p.x<=d.w,id+':'+p.id+':x');assert.ok(p.y>=0&&p.y<=d.h,id+':'+p.id+':y');}
 }
});
