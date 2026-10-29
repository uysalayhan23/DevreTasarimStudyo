'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','dist','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
const begin=app.indexOf('  function routeHeapBetter('),end=app.indexOf('  function routePoints(',begin);
assert.ok(begin>0&&end>begin,'native routing core exists');
const core=app.slice(begin,end);
function make(obstacles=[]){
  const usage=new Map();
  const routing=vm.runInNewContext('const GRID=10,SHEET_W=3200,SHEET_H=2100,cleanPoints=p=>p;'+core+';({gridRouteIter,markRoute})',
    {routeObstacles:obstacles,routingUsage:usage},{timeout:3000});
  return {...routing,usage};
}
function run(task,max=2600){
  let step,yields=0;
  do{step=task.next();if(!step.done)yields++;assert.ok(yields<max,'route must terminate')}while(!step.done);
  return {points:JSON.parse(JSON.stringify(step.value)),yields};
}
function safe(points,from,to,obstacles=[]){
  assert.equal(JSON.stringify(points[0]),JSON.stringify(from));
  assert.equal(JSON.stringify(points.at(-1)),JSON.stringify(to));
  for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i],dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y);
    assert.ok(!dx||!dy,'orthogonal segment only');
    const steps=(Math.abs(b.x-a.x)+Math.abs(b.y-a.y))/10;
    for(let n=1;n<=steps;n++){
      const x=a.x+dx*10*n,y=a.y+dy*10*n;
      assert.ok(!obstacles.some(o=>x>o.left&&x<o.right&&y>o.top&&y<o.bottom),'must not cross device body');
    }
  }
}
test('eight existing long cables reuse the clear PLC corridor without A-star',()=>{
  const r=make(),from={x:100,y:1000},to={x:3000,y:1000};
  for(let i=0;i<8;i++){
    const {points,yields}=run(r.gridRouteIter(from,to,0));
    assert.equal(yields,0,'shared clear path must not expand A-star');
    assert.equal(points.length,2);safe(points,from,to);
    r.markRoute(points);
  }
  assert.equal(r.usage.get('1500,1000'),8,'each physical cable remains independently recorded');
});
test('repeated clear right-angle cable respects terminal direction and exact endpoints',()=>{
  const r=make(),from={x:100,y:900},to={x:2600,y:1500};
  for(let i=0;i<6;i++){
    const {points,yields}=run(r.gridRouteIter(from,to,0));
    assert.equal(yields,0);safe(points,from,to);
    assert.ok(points[1].x>points[0].x&&points[1].y===points[0].y);
    r.markRoute(points);
  }
});
test('real material obstacle remains impassable even after prior cable routing',()=>{
  const obstacle={left:300,right:2400,top:100,bottom:1950};
  const r=make([obstacle]),from={x:100,y:1000},to={x:2900,y:1000};
  for(let i=0;i<4;i++){
    const {points,yields}=run(r.gridRouteIter(from,to,0));
    assert.ok(yields<100,'safe corridor does not need full wavefront');
    safe(points,from,to,[obstacle]);
    r.markRoute(points);
  }
});
test('scene continues to paint provisional wires, replace in place and respect frame budget',()=>{
  assert.match(app,/if\(preview\)renderWire\(wire,i,preview,true\)/);
  assert.match(app,/const result=routingTask\.next\(\)/);
  assert.match(app,/performance\.now\(\)-started<8/);
  assert.match(app,/if\(scenePaintGeneration!==paintGeneration\)return/);
  assert.match(app,/prior\.replaceWith\(g\)/);
  assert.match(app,/render\(false,true,!cancelled&&dragPreview\?reusableRoutesAfterComponentMove\(ids,plan\):null\)/);
});
test('electrical identity, wire color, undo and layer ordering are not replaced by routing shortcut',()=>{
  assert.match(app,/Lines\.synchronize\(project,byId\)/);
  assert.match(app,/const layers=SceneLayers\.split\(project\.components,byId,Leads\.floating\)/);
  assert.match(app,/stroke="\$\{w\.color\}"/);
  assert.match(app,/function undo\(\)/);
  assert.match(app,/function redo\(\)/);
  assert.match(app,/Simulation\.clear\(project\)/);
  assert.ok(html.includes('app.js?rev=20261030-shared-clear-corridor1'));
});
