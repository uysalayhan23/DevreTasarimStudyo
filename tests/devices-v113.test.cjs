const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('../dist/symbols.js'),Sensors=require('../dist/sensors.js'),Sim=require('../dist/simulation.js'),M=require('../dist/materials.js'),{createApp}=require('./helpers/offline-dom.cjs');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const lib=S.prepareLibrary(require('../dist/design-library.js').extend(JSON.parse(JSON.stringify(ctx.window.COMPONENT_LIBRARY)))),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
function reed(type='reed-no'){
 const pins=type==='reed-no'?['13','14']:['21','22'];
 return {version:7,workspaceMode:'control',components:[{id:'s',typeId:'supply-dc-plus',x:100,y:100},{id:'b',typeId:type,x:400,y:200,sensing:{distance:20,range:10,offset:0,face:'right'}},{id:'h',typeId:'lamp-green',x:800,y:200}],wires:[['s','P','b',pins[0]],['b',pins[1],'h','X1'],['h','X2','s','M']].map(([c,p,d,q],i)=>({id:'w'+i,from:{c,p},to:{c:d,p:q}})),junctions:[]};
}
test('passive reed set switches a real lamp by magnet proximity, including NC and misalignment',()=>{
 for(const type of ['reed-no','reed-nc']){const p=reed(type),b=p.components[1],h=p.components[2];assert.equal(byId[type].pins.length,2);Sim.solve(p,byId);assert.equal(h._active,type==='reed-nc');b.sensing.distance=5;Sim.solve(p,byId);assert.equal(h._active,type==='reed-no');b.sensing.offset=12;Sim.solve(p,byId);assert.equal(h._active,type==='reed-nc');b.sensing.offset=0;b.state=true;b.sensing.distance=30;Sim.solve(p,byId);assert.equal(h._active,type==='reed-nc');}
});
test('reed magnet drag respects rotation and supports persistent independent magnet position',()=>{
 for(const rotation of [0,90,180,270]){const c={id:'r',rotation,sensing:{distance:20,range:10,face:'right'}},d=byId['reed-no'],start=Sensors.beginDrag(c,d);Sensors.drag(c,d,start,{x:-60*start.worldV.x,y:-60*start.worldV.y});assert.equal(Sensors.settings(c,d).distance,8);assert.equal(Sensors.detect(c,d).detected,true);const saved=JSON.parse(JSON.stringify(c));assert.equal(Sensors.detect(saved,d).detected,true);assert.match(Sensors.markup(saved,d),/data-sensor-target="r"/);assert.match(Sensors.markup(saved,d),/reed-mr228b-v113.jpg/);}
});
test('editor mouse drag moves only magnet, scales delta, persists and cancels cleanly',()=>{
 const p=reed(),b=p.components[1];b.materialScale=2;b.rotation=90;const a=createApp({appearance:'material',project:p}),old=a.save().components[1];
 a.$('#scene [data-sensor-target="b"]').emit('pointerdown',{clientX:500,clientY:400});a.window.emit('pointermove',{clientX:500,clientY:280});a.window.emit('pointerup',{buttons:0,clientX:500,clientY:280});const c=a.save().components[1];assert.equal(c.sensing.distance,8);assert.deepEqual([c.x,c.y,c.rotation,c.materialScale],[old.x,old.y,old.rotation,old.materialScale]);assert.equal(a.$('#propSensorTarget').disabled,true);
 a.$('#scene [data-sensor-target="b"]').emit('pointerdown',{clientX:500,clientY:280});a.window.emit('pointermove',{clientX:500,clientY:350});a.window.emit('pointercancel',{});assert.equal(a.save().components[1].sensing.distance,8);a.window.DTSStudio.load(a.save());assert.equal(a.save().components[1].sensing.distance,8);a.$('#simulateBtn').click();assert.ok(a.$('#scene .component[data-id="h"]').classList.contains('active'));
});
test('fuse rows have two-unit gaps, aligned pins and independent electrical contacts',()=>{
 for(const base of ['fused-disconnect','fuse-switch'])for(let n=1;n<=6;n++){const d=byId[n===1?base:base+'-'+n];assert.equal(d.w,n*40);assert.equal(d.pins.length,n*2);for(let i=0;i<n;i++)assert.equal(d.pins[i*2].x,20+40*i);const art=M.markup(d,{id:'f',fuseOpen:[false,true]});assert.equal((art.match(/width="38" height="148"/g)||[]).length,n);const pairs=Sim.conductingPairs({fuseOpen:[false,true]},d,new Map(),new Set());assert.equal(pairs.length,n-(n>1?1:0));assert.ok(!pairs.some(([a])=>a==='3'));}
});
test('verified Siemens protection devices use exact local photos while unverified 1P thermal-magnetic stays representative',()=>{
 const exactIds=new Set(['mcb-1p','mcb-2p','mcb-3p','disconnect-1p','thermal-magnetic']);
 for(const d of lib.filter(d=>['breaker','breaker2','breaker3','thermal-magnetic'].includes(d.kind))){
  const closed=M.markup(d,{state:false}),opened=M.markup(d,{state:true});
  if(exactIds.has(d.id)){
   if(d.id==='thermal-magnetic')assert.match(closed,/siemens-3rv2011-1ja10-cad-front\.svg/,d.id);else if(d.id==='disconnect-1p')assert.match(closed,/siemens-5tl1163-0-user-front\.webp/,d.id);else assert.match(closed,/siemens-.*-v113.png/,d.id);
   assert.equal(d.visualInfo?.match,'exact',d.id);
   assert.ok(d.siemensPhoto,d.id);
  }else if(d.id==='thermal-magnetic-1p'){
   assert.doesNotMatch(closed,/siemens-mcb1-v113.png/);
   assert.match(closed,/data-material="front-thermal-magnetic-1p"/);
   assert.equal(d.visualInfo?.match,'representative');
   assert.equal(d.siemensPhoto,undefined);
   assert.equal(d.brand,undefined);
  }
  assert.notEqual(closed,opened,d.id);
  assert.ok(Sim.conductingPairs({state:false},d,new Map(),new Set()).length>0,d.id);
  assert.equal(Sim.conductingPairs({state:true},d,new Map(),new Set()).filter(([a])=>!['95'].includes(a)).length,0,d.id);
  for(const [,file]of closed.matchAll(/href="(assets\/[^"]+)"/g))assert.ok(fs.existsSync(require('node:path').join(__dirname,'../dist',file)),d.id+':'+file);
 }
 for(const id of ['limit-no','limit-nc','mechanical-control','mechanical-latching']){const art=M.markup(byId[id],{state:true});assert.match(art,/limit-sem121-v113.jpg/);assert.match(art,/roller-lever[^>]*rotate\(90/);}
});
