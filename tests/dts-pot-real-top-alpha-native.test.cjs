'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Mat=require('../dist/materials-v111.js');
const Symbols=require('../dist/symbols.js');
const Sim=require('../dist/simulation.js');
const directory=path.join(__dirname,'../dist/assets/products');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);
const defs=Object.fromEntries(Array.from(ctx.window.COMPONENT_LIBRARY,d=>[d.id,d]));
const d=defs.potentiometer;
const display=c=>Mat.markup(d,{id:'pot-1',...c});

test('original top-down photo stays in repository; scene gets real transparent WebP, not illustrative SVG',()=>{
 const original=fs.readFileSync(path.join(directory,'pot-front-v111.png'));
 assert.deepEqual(Array.from(original.subarray(0,8)),[137,80,78,71,13,10,26,10]);
 assert.equal(original.readUInt32BE(16),1254);
 assert.equal(original.readUInt32BE(20),1254);
 const file=fs.readFileSync(path.join(directory,'pot-top-transparent.webp'));
 assert.equal(file.toString('ascii',0,4),'RIFF');
 assert.equal(file.toString('ascii',8,12),'WEBP');
 assert.equal(file.toString('ascii',12,16),'VP8X');
 assert.ok(file[20]&16,'real pixel alpha channel is required');
 assert.equal(file.readUIntLE(24,3)+1,1254);
 assert.equal(file.readUIntLE(27,3)+1,1254);
 assert.ok(file.length>50000&&file.length<1500000,'photo should be compressed but detailed');
});

test('all photo instances use the actual alpha asset, while both real-photo knob and housing remain visible',()=>{
 for(const p of [0,50,75,100]){
  const art=display({potentiometer:p,potMax:10000});
  assert.equal((art.match(/pot-top-transparent\.webp/g)||[]).length,2);
  assert.doesNotMatch(art,/pot-front-v111\.png|preserveAspectRatio="none"|data-view="top-orthographic"/);
  assert.match(art,/viewBox="95 85 1060 1060"/);
  assert.match(art,/circle cx="627" cy="615" r="521"/);
  assert.match(art,/data-pot-knob="1" role="slider"/);
  assert.match(art,new RegExp('aria-valuenow="'+p+'"'));
  assert.match(art,new RegExp('rotate\\('+(-135+p*2.7)+' 627 627\\)'));
  assert.ok(art.includes(Math.round(10000*p/100)+' Ω'));
 }
});

test('three real catalog electrical terminal coordinates remain unchanged through native symbol renderer',()=>{
 assert.deepEqual([d.w,d.h],[160,180]);
 assert.deepEqual(Array.from(d.pins,p=>[p.id,p.x,p.y]),[['1',0,90],['2',160,90],['3',80,180]]);
 for(const rotation of [0,90,180,270]){
   const component={id:'pot-1',rotation,potentiometer:75};
   const svg=Symbols.markup(d,component,{mode:'material'});
   for(const pin of d.pins){const pt=Symbols.rotatedPoint(pin,d,rotation);
    assert.match(svg,new RegExp('data-port="'+pin.id+'"[\\s\\S]*?<circle class="port-hit" cx="'+pt.x+'" cy="'+pt.y+'"'));
   }
 }
});

test('native electric simulation and incremental potentiometer value remain functional',()=>{
 const source={id:'s',typeId:'supply-dc-plus'};
 const pot={id:'pot',typeId:'potentiometer',potentiometer:75,potMax:10000};
 const project={components:[source,pot],wires:[],junctions:[]};
 Sim.solve(project,defs);
 const svg=display(pot);
 assert.match(svg,/7500 Ω/);
 assert.equal(pot.potentiometer,75);
 assert.equal(d.pins.length,3);
});

test('already approved UT33D+ image and controls remain untouched',()=>{
 const meter=require('../dist/materials-v115.js').markup({id:'unit-ut33d-plus',kind:'multimeter',w:180,h:340},{id:'meter',meterPosition:7,meterBacklight:true,_meter:{display:'12.34',unit:'V'}});
 assert.match(meter,/ut33d-front-transparent\.webp/);
 assert.equal([...meter.matchAll(/data-meter-position="\d+"/g)].length,20);
 assert.match(meter,/data-meter-action="hold"/);
 assert.match(meter,/data-meter-action="light"/);
});
