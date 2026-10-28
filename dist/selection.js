(function(root){
  'use strict';
  function isEditing(element){return !!element&&(['INPUT','TEXTAREA','SELECT'].includes(element.tagName)||!!element.isContentEditable)}
  function bounds(c,d){
    d={...d,w:d.w*(c.materialScale||1),h:d.h*(c.materialScale||1)};
    const quarter=Math.abs(c.rotation||0)%180===90,w=quarter?d.h:d.w,h=quarter?d.w:d.h;
    return {left:c.x+d.w/2-w/2,right:c.x+d.w/2+w/2,top:c.y+d.h/2-h/2,bottom:c.y+d.h/2+h/2};
  }
  function rectangle(a,b){return {left:Math.min(a.x,b.x),right:Math.max(a.x,b.x),top:Math.min(a.y,b.y),bottom:Math.max(a.y,b.y)}}
  function inBox(components,byId,a,b){
    const r=rectangle(a,b);
    return components.filter(c=>{const d=byId[c.typeId];if(!d)return false;const q=bounds(c,d);return q.right>=r.left&&q.left<=r.right&&q.bottom>=r.top&&q.top<=r.bottom}).map(c=>c.id);
  }
  function clicked(current,id,additive=false){
    const next=new Set(current);
    if(additive){next.has(id)?next.delete(id):next.add(id);return next}
    return next.has(id)?next:new Set([id]);
  }
  function beginMove(project,ids,byId,routes={}){
    const selected=new Set(ids),components=project.components.filter(c=>selected.has(c.id)),movingJunctions=new Set();
    // A whole junction network follows the group only when every connected
    // device follows it. Shared external branches remain anchored in place.
    const visited=new Set();
    for(const j of project.junctions||[]){
      if(visited.has(j.id))continue;
      const cluster=new Set(),owners=new Set(),queue=[j.id];let incomplete=false;
      while(queue.length){const id=queue.pop();if(cluster.has(id))continue;cluster.add(id);visited.add(id);
        for(const wire of project.wires){if(wire.from?.j!==id&&wire.to?.j!==id)continue;
          for(const end of [wire.from,wire.to]){if(end?.c)owners.add(end.c);else if(end?.j&&!cluster.has(end.j))queue.push(end.j);else if(!end?.j)incomplete=true}
        }
      }
      if(!incomplete&&owners.size&&[...owners].every(id=>selected.has(id)))for(const id of cluster)movingJunctions.add(id);
    }
    const moves=end=>selected.has(end?.c)||movingJunctions.has(end?.j);
    const wires=project.wires.filter(w=>moves(w.from)&&moves(w.to)).map(w=>({wire:w,original:w.points===undefined?undefined:w.points.map(p=>({...p})),points:(routes[w.id]?.slice(1,-1)||w.points||[]).map(p=>({...p}))}));
    const positioned=components.map(c=>({node:c,x:c.x,y:c.y,labelPositions:c.labelPositions?JSON.parse(JSON.stringify(c.labelPositions)):undefined})).concat((project.junctions||[]).filter(j=>movingJunctions.has(j.id)).map(j=>({node:j,x:j.x,y:j.y})));
    const boxes=components.map(c=>bounds(c,byId[c.typeId])).concat(positioned.filter(p=>!p.node.typeId).map(p=>({left:p.x,right:p.x,top:p.y,bottom:p.y})),positioned.flatMap(p=>Object.values(p.labelPositions||{}).filter(v=>Number.isFinite(v?.x)&&Number.isFinite(v?.y)).map(v=>({left:v.x,right:v.x,top:v.y,bottom:v.y}))),wires.flatMap(w=>w.points.map(p=>({left:p.x,right:p.x,top:p.y,bottom:p.y}))));
    return {positioned,wires,left:Math.min(...boxes.map(b=>b.left)),top:Math.min(...boxes.map(b=>b.top)),right:Math.max(...boxes.map(b=>b.right)),bottom:Math.max(...boxes.map(b=>b.bottom))};
  }
  function constrain(plan,dx,dy,grid=10,width=2400,height=1500){
    const snap=v=>Math.round(v/grid)*grid;
    const axis=(v,low,high)=>Math.max(Math.ceil(low/grid)*grid,Math.min(Math.floor(high/grid)*grid,snap(v)));
    // A selection wider than the sheet cannot fit fully; allow movement
    // between its visible edges instead of locking it to zero displacement.
    const range=(start,end,size)=>end-start>size?[size-end,-start]:[Math.min(0,-start),Math.max(0,size-end)];
    const [left,right]=range(plan.left,plan.right,width),[top,bottom]=range(plan.top,plan.bottom,height);
    return {x:axis(dx,left,right),y:axis(dy,top,bottom)};
  }
  function applyMove(plan,delta){
    for(const p of plan.positioned){p.node.x=p.x+delta.x;p.node.y=p.y+delta.y;if(p.labelPositions)p.node.labelPositions=Object.fromEntries(Object.entries(p.labelPositions).map(([k,v])=>[k,{x:v.x+delta.x,y:v.y+delta.y}]))}
    for(const w of plan.wires)w.wire.points=w.points.map(p=>({x:p.x+delta.x,y:p.y+delta.y}));
  }
  function restore(plan){
    for(const p of plan.positioned){p.node.x=p.x;p.node.y=p.y;if(p.labelPositions)p.node.labelPositions=JSON.parse(JSON.stringify(p.labelPositions));else if(p.node.typeId)delete p.node.labelPositions}
    for(const w of plan.wires){if(w.original===undefined)delete w.wire.points;else w.wire.points=w.original.map(p=>({...p}))}
  }
  const api={bounds,rectangle,inBox,clicked,beginMove,constrain,applyMove,restore,isEditing};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSSelection=api;
})(typeof window==='undefined'?globalThis:window);
