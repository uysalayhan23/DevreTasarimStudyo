'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','dist','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
const from=app.indexOf('  function routeHeapBetter(');
const to=app.indexOf('  function markRoute(',from);
assert.ok(from>0&&to>from,'routing functions are present in the real app');
const core=app.slice(from,to);
function makeRouting(obstacles=[],usage=new Map()){
  return vm.runInNewContext(
    'const GRID=10,SHEET_W=3200,SHEET_H=2100,cleanPoints=p=>p;'+core+';({gridRoute,gridRouteIter})',
    {routeObstacles:obstacles,routingUsage:usage},{timeout:3000});
}
function equalPath(a,b){assert.equal(JSON.stringify(a),JSON.stringify(b));}
function safePath(points,start,goal,obstacles){
  assert.deepEqual({...points[0]},start);assert.deepEqual({...points[points.length-1]},goal);
  for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i],dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y);
    assert.ok(!dx||!dy,'no diagonal cable segment');
    const steps=(Math.abs(b.x-a.x)+Math.abs(b.y-a.y))/10;
    for(let k=1;k<=steps;k++){
      const x=a.x+dx*10*k,y=a.y+dy*10*k;
      assert.ok((x===goal.x&&y===goal.y)||!obstacles.some(o=>x>o.left&&x<o.right&&y>o.top&&y<o.bottom),'cable must avoid material body');
    }
  }
}
test('real application JavaScript parses',()=>assert.doesNotThrow(()=>new vm.Script(app)));
test('cooperative routing preserves the synchronous route across yields',()=>{
  const obs=[{left:300,right:2400,top:100,bottom:1950}],routing=makeRouting(obs);
  const start={x:100,y:1000},goal={x:2900,y:1000};
  const expected=routing.gridRoute(start,goal,0),gen=routing.gridRouteIter(start,goal,0);
  let result,yields=0;do{result=gen.next();yields++}while(!result.done);
  equalPath(expected,result.value);assert.ok(yields>1,'long work yields control to UI');safePath(expected,start,goal,obs);
});
test('large rectangular PLC and several obstacles use safe short orthogonal corridors',()=>{
  const samples=[
    [{x:100,y:1000},{x:2900,y:1000},0,[{left:300,right:2400,top:100,bottom:1950}]],
    [{x:100,y:1000},{x:2900,y:1000},0,[{left:400,right:600,top:800,bottom:1200},{left:1100,right:1400,top:750,bottom:1350},{left:2000,right:2300,top:700,bottom:1450}]],
    [{x:500,y:350},{x:1800,y:500},0,[{left:700,right:1400,top:300,bottom:900}]]
  ];
  for(const [start,goal,preferred,obstacles] of samples){
    const points=makeRouting(obstacles).gridRoute(start,goal,preferred);
    assert.ok(points.length<=5,'open corridor avoids full A-star search');
    safePath(points,start,goal,obstacles);
  }
});
test('unsafe shortcuts fall through to existing routing logic',()=>{
  const obstacles=[{left:480,right:800,top:480,bottom:600}],start={x:500,y:500},goal={x:1800,y:900};
  const routing=makeRouting(obstacles),expected=routing.gridRoute(start,goal,0),task=routing.gridRouteIter(start,goal,0);
  let step;do{step=task.next()}while(!step.done);
  equalPath(expected,step.value);
});
test('project opening and drop use cancellable cooperative routing',()=>{
  assert.ok(app.includes('const result=routingTask.next()'));
  assert.ok(app.includes('if(scenePaintGeneration!==paintGeneration)return'));
  assert.ok(app.includes('cancelAnimationFrame(pendingScenePaint)'));
  assert.ok(app.includes('reusableRoutesAfterComponentMove(ids,plan)'));
  assert.ok(app.includes('render(false,true)'));
  assert.ok(html.includes('app.js?rev=20261030-cooperative-corridors-2'));
});
