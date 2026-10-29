'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Preview=require('../dist/drag-preview.js');
const Selection=require('../dist/selection.js');
const root=path.join(__dirname,'..','dist');
function node(dataset={}){return {dataset,attr:{},setAttribute(k,v){this.attr[k]=String(v)},querySelectorAll(){return []},querySelector(){return null}}}
function group(id){const paths=[node(),node(),node()],label=node();return {dataset:{wire:id},paths,label,querySelectorAll(selector){assert.match(selector,/path\.wire/);return paths},querySelector(selector){return selector==='.wire-role-label'?label:null}}}
function scenario(){
 const cpu={id:'cpu',typeId:'plc',x:100,y:80},lamp={id:'lamp',typeId:'lamp',x:600,y:80},other={id:'other',typeId:'lamp',x:700,y:220};
 const project={components:[cpu,lamp,other],junctions:[],wires:[{id:'cable',from:{c:'cpu',p:'Q1'},to:{c:'lamp',p:'A'},points:[]},{id:'other-wire',from:{c:'lamp',p:'B'},to:{c:'other',p:'A'},points:[]}]};
 const cpuNode=node({id:'cpu'}),back=node({componentBackdrop:'cpu'}),note=node({noteOwner:'cpu'}),lampNode=node({id:'lamp'}),wire=group('cable'),unrelated=group('other-wire');
 const scene={querySelectorAll(selector){if(selector==='g.component,[data-component-backdrop],[data-note-owner]')return [cpuNode,back,note,lampNode];if(selector==='[data-junction]')return [];if(selector==='g[data-wire]')return [wire,unrelated];throw Error(selector)}};
 const defs={plc:{w:140,h:260,pins:[{id:'Q1'}]},lamp:{w:40,h:40,pins:[{id:'A'},{id:'B'}]}};
 const selection=Selection.beginMove(project,['cpu'],defs,{});
 const ends=ref=>{const c=project.components.find(c=>c.id===ref.c);const p={x:c.x+(ref.p==='B'?20:0),y:c.y};return {pos:p,stub:{x:p.x+10,y:p.y}}};
 const helper=Preview.create(scene,project,['cpu'],selection,ends,pts=>'M'+pts.map(p=>`${p.x},${p.y}`).join(' L'));
 return {cpu,lamp,project,scene,selection,helper,cpuNode,back,note,wire,unrelated};
}
test('cheap preview follows PLC DOM without changing saved electrical endpoints',()=>{
 const s=scenario(),original=JSON.stringify(s.project.wires);
 Selection.applyMove(s.selection,{x:60,y:30});s.helper.refresh();
 assert.equal(s.cpuNode.attr.transform,'translate(160 110)');assert.equal(s.back.attr.transform,'translate(160 110)');assert.equal(s.note.attr.transform,'translate(160 110)');
 assert.equal(s.wire.paths[0].attr.d,s.wire.paths[1].attr.d);
 assert.equal(s.unrelated.paths[0].attr.d,undefined);
 assert.equal(JSON.stringify(s.project.wires),original);
});
test('frame does not call native gridRoute or redraw unrelated devices',()=>{
 const s=scenario();for(let i=1;i<=60;i++){Selection.applyMove(s.selection,{x:i*2,y:i});s.helper.refresh()}
 assert.equal(s.helper.wireCount,1);assert.equal(s.cpuNode.attr.transform,'translate(220 140)');
 assert.equal(s.lamp.x,600);assert.equal(s.unrelated.paths[0].attr.d,undefined);
});
test('cancelling restores original geometry and a following refresh follows restored state',()=>{
 const s=scenario();Selection.applyMove(s.selection,{x:50,y:10});s.helper.refresh();
 Selection.restore(s.selection);s.helper.refresh();assert.equal(s.cpu.x,100);assert.equal(s.cpuNode.attr.transform,'translate(100 80)');
});
test('wire preview preserves right-angle geometry and exact terminals',()=>{
 const p=Preview.route({pos:{x:10,y:20},stub:{x:20,y:20}},{stub:{x:90,y:75},pos:{x:100,y:75}});
 assert.deepEqual(p[0],{x:10,y:20});assert.deepEqual(p.at(-1),{x:100,y:75});
 for(let i=1;i<p.length;i++)assert.ok(p[i].x===p[i-1].x||p[i].y===p[i-1].y);
});
test('manual fixed points remain checkpoints without expensive rerouting',()=>{
 const p=Preview.route({pos:{x:0,y:0},stub:{x:10,y:0}},{stub:{x:100,y:100},pos:{x:110,y:100}},[{x:40,y:30},{x:60,y:40}]);
 assert.ok(p.some(q=>q.x===40&&q.y===30));assert.ok(p.some(q=>q.x===60&&q.y===40));
});
test('invalid legacy manual point never creates a malformed SVG path',()=>{
 assert.equal(Preview.route({pos:{x:0,y:0},stub:{x:5,y:0}},{pos:{x:20,y:0},stub:{x:15,y:0}},[{x:NaN,y:10}]),null);
});
test('invalid endpoint also skips visual route without touching project wiring',()=>{
 assert.equal(Preview.route({pos:{x:Infinity,y:0},stub:{x:5,y:0}},{pos:{x:20,y:0},stub:{x:15,y:0}}),null);
});
test('unconnected and untouched wires are not regenerated during dragging',()=>{
 const s=scenario();s.helper.refresh();assert.equal(s.unrelated.paths.every(p=>p.attr.d===undefined),true);
});
test('app schedules lightweight preview on RAF and exact full render only at finish',()=>{
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
 const start=app.indexOf('function beginComponentDrag(c,e){'),end=app.indexOf('function operateInstallation(',start);assert.ok(start>=0&&end>start);const fn=app.slice(start,end);
 assert.match(fn,/DTSDragPreview\?\.create\?\./);assert.match(fn,/dragPreview\?dragPreview\.refresh\(\):render\(\)/);
 assert.match(fn,/if\(moved\)\{render\(\);scheduleSave\(\)\}/);
 assert.match(fn,/if\(cancelled&&moved\)\{Selection\.restore\(plan\);history\.pop\(\);future=oldFuture\}/);
});
test('running simulation keeps native fallback, with single verified PLC-only preview',()=>{
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');const fn=app.slice(app.indexOf('function beginComponentDrag(c,e){'),app.indexOf('function operateInstallation('));
 assert.match(fn,/plcLiveMove=running&&ids\.length===1&&byId\[c\.typeId\]\?\.isPLC===true/);
 assert.match(fn,/window\.DTSLadderRuntime\?\.supportedPLC\?\.\(byId\[c\.typeId\]\)===true/);
 assert.match(fn,/\(!running\|\|plcLiveMove\|\|passiveLiveMove\)&&window\.DTSDragPreview/);
 assert.match(fn,/dragPreview\?dragPreview\.refresh\(\):render\(\)/);
});
test('offline script loads before app and no external request added',()=>{
 const index=fs.readFileSync(path.join(root,'index.html'),'utf8');const a=index.indexOf('drag-preview.js?rev=20261029-drag-fast1'),b=index.indexOf('app.js?rev=20261029-drag-fast1');
 assert.ok(a>=0&&b>a);
 const helper=fs.readFileSync(path.join(root,'drag-preview.js'),'utf8');assert.doesNotMatch(helper,/fetch\(|XMLHttpRequest|eval\(/);
});
