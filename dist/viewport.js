(function(root){
  'use strict';
  function panFrom(start,dx,dy){const x=Number.isFinite(start?.x)?start.x:0,y=Number.isFinite(start?.y)?start.y:0;const nx=x+(Number.isFinite(dx)?dx:0),ny=y+(Number.isFinite(dy)?dy:0);return {x:Number.isFinite(nx)?nx:x,y:Number.isFinite(ny)?ny:y,zoom:start.zoom}}
  function zoomAt(view,newZoom,anchor){
    const current=Number.isFinite(view.zoom)&&view.zoom>0?view.zoom:1;
    const zoom=Number.isFinite(newZoom)?Math.min(4,Math.max(.2,newZoom)):current,ratio=zoom/current;
    const vx=Number.isFinite(view.x)?view.x:0,vy=Number.isFinite(view.y)?view.y:0;
    const ax=Number.isFinite(anchor?.x)?anchor.x:vx,ay=Number.isFinite(anchor?.y)?anchor.y:vy;
    const nx=ax-(ax-vx)*ratio,ny=ay-(ay-vy)*ratio;
    return {x:Number.isFinite(nx)?nx:vx,y:Number.isFinite(ny)?ny:vy,zoom};
  }
  function toWorld(view,point){const zoom=Number.isFinite(view.zoom)&&view.zoom>0?view.zoom:1;const vx=Number.isFinite(view.x)?view.x:0,vy=Number.isFinite(view.y)?view.y:0;const x=Number.isFinite(point?.x)?point.x:vx,y=Number.isFinite(point?.y)?point.y:vy;return {x:(x-vx)/zoom,y:(y-vy)/zoom}}
  function clientToWorld(view,event,rect,scroll={x:0,y:0}){
    const left=Number.isFinite(rect?.left)?rect.left:0,top=Number.isFinite(rect?.top)?rect.top:0;
    const clientX=Number.isFinite(event?.clientX)?event.clientX:left,clientY=Number.isFinite(event?.clientY)?event.clientY:top;
    return toWorld(view,{x:clientX-left+(Number.isFinite(Number(scroll?.x))?Number(scroll.x):0),y:clientY-top+(Number.isFinite(Number(scroll?.y))?Number(scroll.y):0)});
  }
  const api={panFrom,zoomAt,toWorld,clientToWorld};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSViewport=api;
})(typeof window==='undefined'?globalThis:window);
