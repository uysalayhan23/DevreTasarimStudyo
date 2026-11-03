'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const Mat=require('../dist/materials-v113.js');
const MaterialInfo=require('../dist/materials.js');
const Sensors=require('../dist/sensors.js');
const Symbols=require('../dist/symbols.js');
const Simulation=require('../dist/simulation.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const defs=Object.fromEntries(Array.from(ctx.window.COMPONENT_LIBRARY,d=>[d.id,d]));
const c=(id,rotation=0)=>({id:'reed-1',typeId:id,x:310,y:230,rotation,sensing:{distance:5,range:10,face:'right',offset:0}});
for(const type of ['reed-no','reed-nc'])test('P5-03 '+type+' uses clearly representative orthographic sensor body, not perspective product image',()=>{
 const d=defs[type],svg=Mat.markup(d,c(type));
 assert.match(svg,/data-material="top-plan-reed-(?:no|nc)"/);
 assert.match(svg,/class="reed-top-plan" data-view="top-orthographic" data-visual-match="representative"/);
 assert.match(svg,/TEMSİLİ · ÜSTTEN/);
 assert.doesNotMatch(svg,/<image\b|reed-mr228b-v113\.jpg|preserveAspectRatio="none"/);
 assert.match(svg,/M40 0V18/);assert.match(svg,/M40 82V100/);
 assert.deepEqual([d.w,d.h],[80,100]);
 assert.equal(MaterialInfo.info(d).match,'representative','visible orthographic drawing must never claim manufacturer-exact pixels');
 assert.match(MaterialInfo.info(d).note,/orthographic-top-plan/);
 assert.equal(MaterialInfo.info(d).source,d.visualInfo.source,'manufacturer identity source is preserved');
 assert.deepEqual(Array.from(d.pins,p=>[p.id,p.x,p.y]),type==='reed-no'?[['13',40,0],['14',40,100]]:[['21',40,0],['22',40,100]]);
});
test('P5-03 draggable magnet is independently drawn as a top-down shape, preserving hit target and distance label',()=>{
 const d=defs['reed-no'];
 for(const rotation of [0,90,180,270]){
  const state=c(d.id,rotation),svg=Sensors.markup(state,d);
  assert.match(svg,/class="sensor-target" data-sensor-target="reed-1"/);
  assert.match(svg,/role="button" tabindex="0" aria-label="Kablosuz mıknatısı sürükleyin"/);
  assert.match(svg,/class="reed-magnet-top" data-view="top-orthographic"/);
  assert.match(svg,/Mıknatıs · 5\.0 mm/);
  assert.match(svg,/class="target-hit" x="-29" y="-29" width="58" height="58" rx="4" fill="transparent"/);
  assert.doesNotMatch(svg,/<image\b|reed-mr228b-v113\.jpg/);
  assert.equal(Sensors.detect(state,d).detected,true);
 }
});
test('P5-03 real cable terminal positions remain exact through all quarter rotations and scales',()=>{
 for(const type of ['reed-no','reed-nc'])for(const rotation of [0,90,180,270])for(const materialScale of [.5,1,2]){
  const d=defs[type],state={...c(type,rotation),materialScale};
  const svg=Symbols.markup(d,state,{mode:'material'});
  for(const pin of d.pins){
   const p=Symbols.terminalPosition(state,d,pin);
   assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
   assert.match(svg,new RegExp('data-port="'+pin.id+'"[\\s\\S]*?<circle class="port-hit" cx="'+Symbols.rotatedPoint(pin,d,rotation).x+'" cy="'+Symbols.rotatedPoint(pin,d,rotation).y+'"'));
  }
 }
});
test('P5-03 electrical NO/NC reed switching stays native and reversible',()=>{
 for(const type of ['reed-no','reed-nc']){
  const pins=type==='reed-no'?['13','14']:['21','22'];
  const s={id:'s',typeId:'supply-dc-plus'},r=c(type),lamp={id:'l',typeId:'lamp-green'};
  const wires=[['s','P','reed-1',pins[0]],['reed-1',pins[1],'l','X1'],['l','X2','s','M']].map(([a,p,b,q],i)=>({id:'w'+i,from:{c:a,p},to:{c:b,p:q}}));
  const project={components:[s,r,lamp],wires,junctions:[]};
  for(const distance of [20,5,20]){r.sensing.distance=distance;Simulation.solve(project,defs);assert.equal(lamp._active,type==='reed-no'?distance===5:distance!==5);}
 }
});
test('P5-03 unchanged photo-based limit-switch branch remains functional',()=>{
 const d=defs['limit-no'];
 assert.match(Mat.markup(d,{id:'limit1'}),/limit-sem121-v113\.jpg/);
});
