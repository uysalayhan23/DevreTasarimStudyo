(function(root){
  'use strict';
  function panFrom(start,dx,dy){return {x:start.x+(Number.isFinite(dx)?dx:0),y:start.y+(Number.isFinite(dy)?dy:0),zoom:start.zoom}}
  function zoomAt(view,newZoom,anchor){
    const current=Number.isFinite(view.zoom)&&view.zoom>0?view.zoom:1;
    const zoom=Number.isFinite(newZoom)?Math.min(4,Math.max(.2,newZoom)):current,ratio=zoom/current;
    const ax=Number.isFinite(anchor?.x)?anchor.x:view.x,ay=Number.isFinite(anchor?.y)?anchor.y:view.y;
    return {x:ax-(ax-view.x)*ratio,y:ay-(ay-view.y)*ratio,zoom};
  }
  function toWorld(view,point){const zoom=Number.isFinite(view.zoom)&&view.zoom>0?view.zoom:1;return {x:(point.x-view.x)/zoom,y:(point.y-view.y)/zoom}}
  function clientToWorld(view,event,rect,scroll={x:0,y:0}){
    return toWorld(view,{x:event.clientX-rect.left+(Number.isFinite(Number(scroll?.x))?Number(scroll.x):0),y:event.clientY-rect.top+(Number.isFinite(Number(scroll?.y))?Number(scroll.y):0)});
  }
  const api={panFrom,zoomAt,toWorld,clientToWorld};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSViewport=api;
})(typeof window==='undefined'?globalThis:window);
