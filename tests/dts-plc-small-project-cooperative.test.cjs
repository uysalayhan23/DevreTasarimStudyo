'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','dist','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
const begin=app.indexOf('    if(progressive&&sceneWires.length>0){'),end=app.indexOf('\n  }\n\n  function paletteColors()',begin);
assert.ok(begin>=0&&end>begin,'native progressive paint block');
const code=app.slice(begin,end);
function run(count,{cancel=false,reuse=false,steps=24}={}){
 const queue=[],events=[],state={finished:0,tasks:0,ticks:0};
 const wires=Array.from({length:count},(_,i)=>({id:'w'+i,from:{c:'a',p:'1'},to:{c:'b',p:'2'},points:[]}));
 const ctx={sceneWires:wires,progressive:true,reuseRoutes:reuse?new Map(wires.map(w=>[w.id,[{x:0,y:0},{x:20,y:0}]])):null,
 scenePaintGeneration:1,paintGeneration:1,pendingScenePaint:0,
 window:{DTSDragPreview:{route:()=>[{x:0,y:0},{x:10,y:0}]}},
 endpointInfo:()=>({pos:{x:0,y:0},stub:{x:0,y:0}}),
 renderWire:(w,i,points,preview=false)=>events.push({id:w.id,preview,points}),
 routePointsIter:function*(from,to,manual){state.tasks++;for(let i=0;i<steps;i++)yield;return [{x:0,y:0},{x:20,y:0}]},
 finishScene:()=>{state.finished++},
 requestAnimationFrame:fn=>{queue.push(fn);return queue.length},performance:{now:()=>state.ticks++}};
 Function('ctx','with(ctx){'+code+'}')(ctx);
 const immediate={frames:queue.length,previews:events.filter(e=>e.preview).length,finals:events.filter(e=>!e.preview).length,finished:state.finished};
 if(cancel)ctx.scenePaintGeneration++;
 let frames=0;while(queue.length&&frames<2000){frames++;queue.shift()()}
 assert.ok(frames<2000,'cooperative paint terminates');
 return {immediate,frames,events,finished:state.finished,tasks:state.tasks};
}
test('one expensive cable is visible before routing and never blocks the first paint',()=>{
 const r=run(1,{steps:480});assert.equal(r.immediate.previews,1);assert.equal(r.immediate.finals,0);
 assert.equal(r.immediate.frames,1);assert.equal(r.immediate.finished,0);
 assert.equal(r.events.filter(e=>!e.preview).length,1);assert.equal(r.finished,1);assert.ok(r.frames>1);
});
test('four wires have immediate previews and deferred A-star',()=>{
 const r=run(4,{steps:100});assert.equal(r.immediate.previews,4);assert.equal(r.immediate.finals,0);
 assert.equal(r.events.filter(e=>!e.preview).length,4);assert.equal(r.finished,1);
});
test('five wires keep their prior progressive behavior',()=>{
 const r=run(5);assert.equal(r.immediate.previews,5);assert.equal(r.immediate.finals,0);
 assert.equal(r.events.filter(e=>!e.preview).length,5);assert.equal(r.finished,1);
});
test('empty scene completes immediately',()=>{
 const r=run(0);assert.equal(r.immediate.frames,0);assert.equal(r.finished,1);assert.equal(r.tasks,0);
});
test('cancelled generation cannot paint stale routes or overlays',()=>{
 const r=run(4,{cancel:true});assert.equal(r.immediate.previews,4);
 assert.equal(r.events.filter(e=>!e.preview).length,0);assert.equal(r.finished,0);
});
test('unchanged cached routes finalize without A-star',()=>{
 const r=run(4,{reuse:true});assert.equal(r.immediate.previews,4);
 assert.equal(r.events.filter(e=>!e.preview).length,4);assert.equal(r.tasks,0);assert.equal(r.finished,1);
});
test('actual A-star can require hundreds of cooperative yields for a single cable',()=>{
 const a=app.indexOf('  function routeHeapBetter('),b=app.indexOf('  function markRoute(',a);assert.ok(a>=0&&b>a);
 const obstacles=[{left:390,right:660,top:1240,bottom:1500},{left:1580,right:1980,top:1240,bottom:1420},{left:260,right:740,top:430,bottom:780},{left:2140,right:2420,top:850,bottom:1280},{left:1180,right:1500,top:660,bottom:890},{left:2480,right:2990,top:290,bottom:730},{left:710,right:940,top:1310,bottom:1750},{left:550,right:730,top:540,bottom:890}];
 const routing=vm.runInNewContext('const GRID=10,SHEET_W=3200,SHEET_H=2100,cleanPoints=p=>p;'+app.slice(a,b)+';({gridRouteIter})',{routeObstacles:obstacles,routingUsage:new Map()},{timeout:5000});
 const task=routing.gridRouteIter({x:100,y:1000},{x:3000,y:1000},0);
 let step,yields=0;do{step=task.next();if(!step.done)yields++;assert.ok(yields<2600)}while(!step.done);
 assert.ok(yields>100,'a single route can be expensive');assert.equal(step.value[0].x,100);assert.equal(step.value.at(-1).x,3000);
});
test('offline revision, PLC identity, solver and layer contracts stay present',()=>{
 assert.ok(html.includes('app.js?rev=20261030-small-project-cooperative1'));
 assert.ok(app.includes('Lines.synchronize(project,byId)'));assert.ok(app.includes('Simulation.clear(project)'));
 assert.ok(app.includes('SceneLayers.split(project.components,byId,Leads.floating)'));
 assert.ok(app.includes('render(false,true,!cancelled&&dragPreview?reusableRoutesAfterComponentMove(ids,plan):null)'));
 assert.ok(app.includes('if(scenePaintGeneration!==paintGeneration)return'));
});
