'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const W=require('../dist/workspaces.js'),Catalog=require('../dist/catalog.js'),Design=require('../dist/design-library.js'),Material=require('../dist/materials-v111.js');
test('one existing isolated 12 VAC bell transformer appears in building bell catalog, without a duplicate',()=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);
 const lib=Catalog.prepare(Design.extend(ctx.window.COMPONENT_LIBRARY));
 const bells=lib.filter(x=>x.id==='bell-transformer');assert.equal(bells.length,1);
 const d=bells[0];assert.equal(d.tutorialOnly,true);assert.equal(d.defaultVoltage,12);
 assert.deepEqual(Array.from(d.pins,p=>p.id),['S1','S2']);
 assert.equal(d.classification.group,'bell-circuits');
 assert.equal(W.includes(d,'building'),true);assert.equal(Catalog.matches(d,{area:'building',category:'electrical'}),true);
 assert.match(Material.markup(d,{id:'bell-preview'}),/SANAL 12 V~/);
 const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(app,/\(!d\.tutorialOnly\|\|d\.id==='bell-transformer'\)/);
});
test('four-band resistor colors track ohms, multiplier and tolerance',()=>{
 const rows=[
  [1000,5,['kahverengi','siyah','kırmızı','altın']],
  [10000,5,['kahverengi','siyah','turuncu','altın']],
  [4700,5,['sarı','mor','kırmızı','altın']],
  [220,5,['kırmızı','kırmızı','kahverengi','altın']],
  [0.47,10,['sarı','mor','gümüş','gümüş']],
  [1000,1,['kahverengi','siyah','kırmızı','kahverengi']]
 ];
 for(const [ohms,tolerance,names] of rows){
  const code=Material.resistorColorBands(ohms,tolerance);
  assert.deepEqual(code.names,names);assert.equal(code.colors.length,4);
 }
 assert.equal(Material.resistorColorBands(0.01,5),null);
 assert.equal(Material.resistorColorBands(-1,5),null);
});
test('horizontal and vertical material stripes rerender from editable resistance, source is immutable',()=>{
 const d={id:'resistor',kind:'resistor',w:100,h:80},c={id:'R1',resistance:1000};
 const old=JSON.stringify(c);
 const first=Material.markup(d,c);
 assert.match(first,/data-color-code="kahverengi,siyah,kırmızı,altın"/);
 c.resistance=10000;
 const second=Material.markup(d,c);
 assert.match(second,/data-color-code="kahverengi,siyah,turuncu,altın"/);
 assert.notEqual(first,second);
 c.resistorTolerancePercent=10;
 assert.match(Material.markup({...d,_verticalTransform:true},c),/data-color-code="kahverengi,siyah,turuncu,gümüş"/);
 assert.equal(old,JSON.stringify({id:'R1',resistance:1000}));
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(html,/id="propResistorTolerance"/);
 assert.match(app,/resistorTolerancePercent=Number\(e\.target\.value\);render\(true\)/);
});
