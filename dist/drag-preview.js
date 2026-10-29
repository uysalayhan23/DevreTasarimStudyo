(function(root){
 'use strict';
 // Visual-only drag preview. Full obstacle-aware routing still runs on drop.
 const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
 const same=(a,b)=>a.x===b.x&&a.y===b.y;
 function route(a,b,manual=[]){
  if(!finite(a?.pos)||!finite(a?.stub)||!finite(b?.pos)||!finite(b?.stub))return null;
  const points=[];
  const push=p=>{if(finite(p)&&(!points.length||!same(points[points.length-1],p)))points.push({x:p.x,y:p.y})};
  const connect=p=>{
   if(!finite(p))return;
   const last=points[points.length-1];
   if(last&&last.x!==p.x&&last.y!==p.y)push({x:p.x,y:last.y});
   push(p);
  };
  for(const p of a.lead||[a.pos])push(p);
  connect(a.stub);
  for(const p of Array.isArray(manual)?manual:[]){if(!finite(p))return null;connect(p)}
  connect(b.stub);
  const tail=b.lead?[...b.lead].reverse():[b.pos];
  for(const p of tail)connect(p);
  return points.length>=2?points:null;
 }
 function create(scene,project,ids,plan,endpoints,roundedPath){
  if(!scene||typeof scene.querySelectorAll!=='function'||typeof endpoints!=='function'||typeof roundedPath!=='function')return null;
  const moved=new Set(ids);
  const junctions=new Set((plan?.positioned||[]).filter(p=>!p.node?.typeId).map(p=>p.node.id));
  const nodes=new Map();
  for(const g of scene.querySelectorAll('g.component,[data-component-backdrop],[data-note-owner]')){
   const id=g.dataset?.id||g.dataset?.componentBackdrop||g.dataset?.noteOwner;
   if(!moved.has(id))continue;
   if(!nodes.has(id))nodes.set(id,[]);
   nodes.get(id).push(g);
  }
  const jNodes=new Map();
  for(const g of scene.querySelectorAll('[data-junction]'))if(junctions.has(g.dataset?.junction))jNodes.set(g.dataset.junction,g);
  const wires=[];
  const groups=new Map();
  for(const g of scene.querySelectorAll('g[data-wire]')){
   const id=g.dataset?.wire;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(g);
  }
  for(const w of project.wires||[]){
   if(w.probeLead)continue;
   const touches=e=>moved.has(e?.c)||junctions.has(e?.j);
   if(touches(w.from)||touches(w.to))wires.push({wire:w,groups:groups.get(w.id)||[]});
  }
  const items=(project.components||[]).filter(c=>moved.has(c.id));
  const movedJ=(project.junctions||[]).filter(j=>junctions.has(j.id));
  function refresh(){
   for(const c of items)for(const g of nodes.get(c.id)||[])g.setAttribute('transform','translate('+c.x+' '+c.y+')');
   for(const j of movedJ){const g=jNodes.get(j.id);if(g){g.setAttribute('cx',j.x);g.setAttribute('cy',j.y)}}
   for(const {wire:w,groups:gs} of wires){
    const p=route(endpoints(w.from),endpoints(w.to),w.points);
    if(!p)continue;
    const d=roundedPath(p);
    let longest=0,label=p[0];
    for(let i=1;i<p.length;i++){
     const a=p[i-1],b=p[i],len=Math.hypot(b.x-a.x,b.y-a.y);
     if(len>longest){longest=len;label={x:(a.x+b.x)/2,y:(a.y+b.y)/2-6}}
    }
    for(const g of gs){
     for(const path of g.querySelectorAll('path.wire,path.wire-outline,path.wire-hit,path.mechanical-shaft-link'))path.setAttribute('d',d);
     const text=g.querySelector('.wire-role-label');if(text){text.setAttribute('x',label.x);text.setAttribute('y',label.y)}
    }
   }
  }
  return Object.freeze({refresh,wireCount:wires.length,componentCount:items.length});
 }
 const api=Object.freeze({route,create});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.DTSDragPreview=api;
})(typeof window==='undefined'?globalThis:window);
