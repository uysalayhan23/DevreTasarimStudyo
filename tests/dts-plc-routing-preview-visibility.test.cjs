'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','dist','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
function sourceBetween(begin,end){
  const a=app.indexOf(begin),b=app.indexOf(end,a);
  assert.ok(a>=0&&b>a,'actual source block exists: '+begin);
  return app.slice(a,b);
}
test('provisional PLC cable is visible immediately and replaced in place',()=>{
  const code=sourceBetween('  function renderWire(w,index,reusedPoints=null,preview=false){','  function wireStyle(w)');
  const h=new Function(`
    const children=[],scene={appendChild(node){children.push(node);node.parentNode=scene}};
    const svg=(_tag,attrs)=>({
      dataset:{wire:attrs['data-wire']},innerHTML:'',parentNode:null,
      replaceWith(next){const i=children.indexOf(this);if(i<0)throw Error('old cable missing');children[i]=next;next.parentNode=scene;this.parentNode=null}
    });
    const els={scene},project={colorVoltages:{}},Lines={voltageLabel(){return''}};
    const colorNames={},selectedWire=null,reconnecting=null;
    let renderedWirePoints={},renderedWireNodes=new Map(),routingPreviewIds=new Set(),marks=0;
    const routePoints=()=>[],roundedPath=points=>JSON.stringify(points),wireLabelPoint=()=>({x:0,y:0});
    const wireStyle=()=>'',roleName=x=>x,flowClass=()=>'',esc=x=>String(x),markRoute=()=>{marks++};
    ${code}
    const wire={id:'w1',color:'#e53935',role:'CONTROL',size:'1.5',from:{},to:{}};
    const preview=[{x:0,y:0},{x:100,y:0}],actual=[{x:0,y:0},{x:20,y:0},{x:20,y:100}];
    renderWire(wire,0,preview,true);
    if(children.length!==1||!children[0].dataset.routingPreview||marks!==0||routingPreviewIds.size!==1)throw Error('provisional render failed');
    renderWire(wire,0,actual,false);
    return {count:children.length,ready:routingPreviewIds.size===0,marks,geometry:renderedWirePoints.w1,actual};
  `)();
  assert.equal(h.count,1);
  assert.equal(h.ready,true);
  assert.equal(h.marks,1);
  assert.deepEqual(h.geometry,h.actual);
});
test('progressive render paints all previews before expensive routing',()=>{
  const render=sourceBetween('  let pendingScenePaint=0,scenePaintGeneration=0;','  function paletteColors()');
  const fill=render.indexOf('if(preview)renderWire(wire,i,preview,true)');
  const frame=render.indexOf('pendingScenePaint=requestAnimationFrame(paintBatch)');
  assert.ok(fill>=0&&frame>fill);
  assert.ok(render.includes('if(scenePaintGeneration!==paintGeneration)return'));
});
test('unverified provisional paths cannot become final cached wire geometry',()=>{
  const helper=sourceBetween('  function reusableRoutesAfterComponentMove(ids,plan){','  function beginComponentDrag(c,e){');
  assert.ok(helper.includes('routingPreviewIds.has(w.id)'));
  assert.ok(app.includes('if(reusedPoints&&!preview)markRoute(points)'));
});
test('panel switch cancels old cable routing and Edge loads updated code',()=>{
  assert.ok(app.includes("if(pendingScenePaint){cancelAnimationFrame(pendingScenePaint);pendingScenePaint=0}++scenePaintGeneration;running=false"));
  assert.ok(html.includes('app.js?rev=20261030-small-project-cooperative1'));
});
