'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Fast=require('../dist/drag-preview.js');
const Select=require('../dist/selection.js');
const root=path.join(__dirname,'..','dist');
function node(dataset={}){return {dataset,attr:{},setAttribute(k,v){this.attr[k]=String(v)},querySelectorAll(){return []},querySelector(){return null}}}
function group(id,overlay=null){const paths=[node(),node()],label=node();return {dataset:{wire:id,...(overlay?{terminalOverlay:overlay}:{})},paths,label,querySelectorAll(){return paths},querySelector(s){return s==='.wire-role-label'?label:null}}}
function sceneFor(components,groups=[],junctions=[]){const nodes=components.map(c=>node({id:c.id})),joined=junctions.map(j=>node({junction:j.id}));return {nodes,joined,querySelectorAll(s){if(s==='g.component,[data-component-backdrop],[data-note-owner]')return nodes;if(s==='[data-junction]')return joined;if(s==='g[data-wire]')return groups;throw Error('Bad selector '+s)}}}
function harness(grouped=false,opts={}){
 const a={id:'a',typeId:'plc',x:50,y:60},b={id:'b',typeId:'switch',x:130,y:60},c={id:'c',typeId:'lamp',x:250,y:100};
 const w1={id:'w1',from:{c:'a',p:'A'},to:{c:'b',p:'B'},points:[]},w2={id:'w2',from:{c:'b',p:'A'},to:{c:'c',p:'B'},points:[]};
 const j={id:'j',x:80,y:150};const project={components:[a,b,c],junctions:grouped?[j]:[],wires:[w1,w2]};
 const ids=grouped?['a','b']:['a'];const defs={plc:{w:60,h:80,pins:[{id:'A',side:'right'}]},switch:{w:40,h:40,pins:[{id:'A',side:'left'},{id:'B',side:'right'}]},lamp:{w:30,h:30,pins:[{id:'B',side:'left'}]}};
 const groups=[group('w1',opts.overlay?'a':null),group('w2')];const scene=sceneFor([a,b,c],groups,project.junctions);
 const plan=Select.beginMove(project,ids,defs);
 const ends=ref=>{const c=project.components.find(c=>c.id===ref.c);const p={x:c.x,y:c.y};return {pos:p,stub:{x:p.x+10,y:p.y}}};
 const helper=Fast.create(scene,project,ids,plan,ends,pts=>'M'+pts.map(p=>`${p.x},${p.y}`).join(' L'));
 return {a,b,c,project,scene,plan,helper,groups,ids,defs,ends};
}
test('snap target geometry is cached once and preserves pin order',()=>{
 const h=harness();let transforms=0;
 const anchors=Fast.snapAnchors(h.project,h.ids,h.defs,()=>false,(c,d,p)=>{transforms++;return {x:c.x,y:c.y}},s=>s);
 assert.equal(transforms,3);assert.equal(anchors.length,3);assert.deepEqual(anchors.map(p=>p.side),['left','right','left']);
 for(let i=0;i<100;i++)assert.equal(anchors.length,3);assert.equal(transforms,3);
});
test('snap cache excludes moving and floating components',()=>{
 const h=harness(true);const anchors=Fast.snapAnchors(h.project,h.ids,h.defs,d=>d===h.defs.lamp,(c,d,p)=>({x:c.x,y:c.y}),s=>s);
 assert.deepEqual(anchors,[]);
});
test('live simulation fast preview only for supported single PLC',()=>{
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8'),s=app.slice(app.indexOf('function beginComponentDrag(c,e){'),app.indexOf('function operateInstallation('));
 assert.match(s,/running&&ids\.length===1&&byId\[c\.typeId\]\?\.isPLC===true&&window\.DTSLadderRuntime\?\.supportedPLC\?\.\(byId\[c\.typeId\]\)===true/);
 assert.match(s,/\(!running\|\|plcLiveMove\)&&window\.DTSDragPreview/);
 assert.match(s,/dragPreview\?dragPreview\.refresh\(\):render\(\)/);
 assert.match(s,/if\(moved\)\{render\(\);scheduleSave\(\)\}/);
});
test('magnetic snapping keeps existing constrain and exact terminals',()=>{
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
 assert.match(app,/function snapDraggedComponent\(c,stationaryAnchors=null\)/);
 assert.match(app,/snapDraggedComponent\(c,snapAnchors\)/);
 assert.match(app,/Selection\.constrain\(plan,delta\.x\+c\.x-x,delta\.y\+c\.y-y,GRID,SHEET_W,SHEET_H\)/);
});
test('PLC preview shifts material and attached cable without touching unrelated routes',()=>{
 const h=harness();assert.ok(h.helper);Select.applyMove(h.plan,{x:60,y:20});h.helper.refresh();
 assert.equal(h.a.x,110);assert.equal(h.scene.nodes[0].attr.transform,'translate(110 80)');
 assert.equal(h.scene.nodes[1].attr.transform,undefined);assert.match(h.groups[0].paths[0].attr.d,/110,80/);
 assert.equal(h.groups[1].paths[0].attr.d,undefined);
});
test('group preview follows all selected components and preserves others',()=>{
 const h=harness(true);assert.ok(h.helper);Select.applyMove(h.plan,{x:30,y:10});h.helper.refresh();
 assert.equal(h.scene.nodes[0].attr.transform,'translate(80 70)');assert.equal(h.scene.nodes[1].attr.transform,'translate(160 70)');
 assert.equal(h.scene.nodes[2].attr.transform,undefined);
});
test('moved clipped terminal overlay safely falls back to original full renderer',()=>{
 const h=harness(false,{overlay:true});assert.equal(h.helper,null);
});
test('attached probe lead safely falls back to original renderer',()=>{
 const h=harness();h.project.wires.push({id:'probe',probeLead:true,from:{c:'a',p:'TIP'},to:{c:'c',p:'A'}});
 assert.equal(Fast.create(h.scene,h.project,h.ids,h.plan,h.ends,()=>''),null);
});
test('group cancel restores original positions and original wire metadata',()=>{
 const h=harness(true),saved=JSON.stringify(h.project);Select.applyMove(h.plan,{x:50,y:20});h.helper.refresh();
 Select.restore(h.plan);assert.equal(JSON.stringify(h.project),saved);h.helper.refresh();assert.equal(h.scene.nodes[0].attr.transform,'translate(50 60)');
});
test('real native Ladder logic remains independent of movement preview',()=>{
 const Ladder=require('../dist/ladder-runtime.js');
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const result=Ladder.scan(p,{I1:true},{},1,{inputCount:2,outputCount:2});
 assert.equal(result.ok,true);assert.equal(result.memory.values.Q1,true);
});
test('invalid route and missing scene are fail-closed without project mutation',()=>{
 const h=harness(),saved=JSON.stringify(h.project);
 assert.equal(Fast.create(null,h.project,h.ids,h.plan,h.ends,()=>''),null);
 assert.equal(Fast.route({pos:{x:0,y:0},stub:{x:Infinity,y:0}},{pos:{x:1,y:1},stub:{x:1,y:0}}),null);
 assert.equal(JSON.stringify(h.project),saved);
});
test('cached magnetic snap has same positions as original repeated target sampling',()=>{
 const vm=require('node:vm'),app=fs.readFileSync(path.join(root,'app.js'),'utf8');
 const a=app.indexOf('function snapDraggedComponent(c,stationaryAnchors=null){'),b=app.indexOf('function cleanPoints(',a);
 assert.ok(a>=0&&b>a);const source=app.slice(a,b);
 function fixture(){
  const moving={id:'m',typeId:'moving',x:100,y:100,rotation:0};
  const others=[{id:'a',typeId:'stationary',x:147,y:115,rotation:0},{id:'b',typeId:'stationary',x:200,y:200,rotation:0}];
  const byId={moving:{pins:[{id:'1',side:'top',x:0,y:0},{id:'2',side:'left',x:8,y:14}]},stationary:{pins:[{id:'3',side:'top',x:-42,y:0},{id:'4',side:'left',x:0,y:0}]}};
  const project={components:[moving,...others]};let calls=0;
  const portPosition=(c,d,p)=>{calls++;return {x:c.x+p.x,y:c.y+p.y}};
  const context={byId,project,selectedIds:new Set(['m']),Leads:{floating:()=>false},portPosition,rotatedSide:s=>s,alignmentGuides:[]};
  vm.runInNewContext(source+';globalThis.snap=snapDraggedComponent;',context);
  return {moving,project,byId,context,portPosition,calls:()=>calls};
 }
 const slow=fixture(),fast=fixture(),anchors=Fast.snapAnchors(fast.project,['m'],fast.byId,()=>false,fast.portPosition,s=>s);
 for(let dx=0;dx<40;dx+=4){
  slow.moving.x=100+dx;fast.moving.x=100+dx;
  slow.context.snap(slow.moving);fast.context.snap(fast.moving,anchors);
  assert.equal(slow.moving.x,fast.moving.x);assert.equal(slow.moving.y,fast.moving.y);
  assert.equal(JSON.stringify(slow.context.alignmentGuides),JSON.stringify(fast.context.alignmentGuides));
 }
 assert.ok(slow.calls()>fast.calls());
});
test('internal junction follows group movement and external body stays anchored',()=>{
 const a={id:'a',typeId:'dev',x:50,y:60},b={id:'b',typeId:'dev',x:130,y:60},c={id:'c',typeId:'dev',x:270,y:90},j={id:'j',x:90,y:110};
 const project={components:[a,b,c],junctions:[j],wires:[
  {id:'wa',from:{c:'a',p:'X'},to:{j:'j'},points:[]},
  {id:'wb',from:{j:'j'},to:{c:'b',p:'X'},points:[]},
  {id:'other',from:{c:'b',p:'Y'},to:{c:'c',p:'X'},points:[]}
 ]},ids=['a','b'],defs={dev:{w:30,h:30,pins:[{id:'X'},{id:'Y'}]}};
 const groups=[group('wa'),group('wb'),group('other')],scene=sceneFor(project.components,groups,[j]);
 const plan=Select.beginMove(project,ids,defs,{});
 assert.equal(plan.positioned.some(x=>x.node===j),true);
 const endpoint=ref=>{const p=ref.j?j:project.components.find(c=>c.id===ref.c);return {pos:{x:p.x,y:p.y},stub:{x:p.x,y:p.y}}};
 const preview=Fast.create(scene,project,ids,plan,endpoint,p=>p.map(k=>k.x+','+k.y).join(' '));
 assert.ok(preview);Select.applyMove(plan,{x:30,y:20});preview.refresh();
 assert.equal(j.x,120);assert.equal(j.y,130);assert.equal(scene.joined[0].attr.cx,'120');assert.equal(scene.joined[0].attr.cy,'130');
 assert.equal(c.x,270);Select.restore(plan);assert.equal(j.x,90);
});
