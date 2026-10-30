'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','dist','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
const from=app.indexOf('  function routeHeapBetter('),to=app.indexOf('  function routePoints(',from);
assert.ok(from>0&&to>from);
const core=app.slice(from,to);
function make(obstacles=[],usage=new Map()){
  return vm.runInNewContext('const GRID=10,SHEET_W=3200,SHEET_H=2100,cleanPoints=p=>p;'+core+';({gridRouteIter,markRoute})',
    {routeObstacles:obstacles,routingUsage:usage},{timeout:3000});
}
function run(task){
  let result,yields=0;
  do{result=task.next();if(!result.done)yields++;assert.ok(yields<2600,'routing should finish')}while(!result.done);
  return {path:JSON.parse(JSON.stringify(result.value)),yields};
}
const body={left:1350,right:1700,top:900,bottom:1200};
const source={x:200,y:1000},trapped={x:1500,y:1000};
test('enclosed PLC terminal endpoint does not trigger 160k A-star search',()=>{
  const r=make([body]),result=run(r.gridRouteIter(source,trapped,0));
  assert.equal(result.yields,0);
  assert.deepEqual(result.path,[source,{x:850,y:1000},{x:850,y:1000},trapped]);
});
test('four trapped cables do not spend thousands of animation yields',()=>{
  const usage=new Map(),r=make([body],usage);
  for(let i=0;i<4;i++){
    const result=run(r.gridRouteIter(source,trapped,0));
    assert.equal(result.yields,0);
    assert.deepEqual(result.path.at(-1),trapped);
    r.markRoute(result.path);
  }
  assert.equal(usage.get('1500,1000'),4);
});
test('reachable adjacent terminal remains connected',()=>{
  const r=make([body]),start={x:1500,y:1000},goal={x:1510,y:1000};
  const result=run(r.gridRouteIter(start,goal,0));
  assert.equal(result.yields,0);
  assert.deepEqual(result.path,[start,goal]);
});
test('normal large obstacle still takes an orthogonal safe detour',()=>{
  const obstacle={left:300,right:2400,top:100,bottom:1950};
  const from={x:100,y:1000},to={x:2900,y:1000};
  const result=run(make([obstacle]).gridRouteIter(from,to,0));
  assert.ok(result.yields<100);
  assert.deepEqual(result.path[0],from);
  assert.deepEqual(result.path.at(-1),to);
  for(let i=1;i<result.path.length;i++){
    const a=result.path[i-1],b=result.path[i],dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y);
    assert.ok(!dx||!dy);
    for(let n=1;n<=(Math.abs(b.x-a.x)+Math.abs(b.y-a.y))/10;n++){
      const x=a.x+dx*10*n,y=a.y+dy*10*n;
      assert.ok(!(x>obstacle.left&&x<obstacle.right&&y>obstacle.top&&y<obstacle.bottom));
    }
  }
});
test('clear shared corridor still uses no yields',()=>{
  const r=make(),from={x:100,y:1000},to={x:3000,y:1000};
  for(let i=0;i<6;i++){const result=run(r.gridRouteIter(from,to,0));assert.equal(result.yields,0);assert.deepEqual(result.path,[from,to]);r.markRoute(result.path)}
});
test('progressive preview, PLC identity, wire color and layer guards are untouched',()=>{
  assert.match(app,/if\(preview\)renderWire\(wire,i,preview,true\)/);
  assert.match(app,/Lines\.synchronize\(project,byId\)/);
  assert.match(app,/SceneLayers\.split\(project\.components,byId,Leads\.floating\)/);
  assert.match(app,/stroke="\$\{w\.color\}"/);
  assert.match(app,/if\(scenePaintGeneration!==paintGeneration\)return/);
  assert.match(app,/Simulation\.clear\(project\)/);
});
test('offline HTML loads updated route code',()=>{
  assert.ok(html.includes('app.js?rev=20261030-trapped-endpoint-fastfail1'));
});
