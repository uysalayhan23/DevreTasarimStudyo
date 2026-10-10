(function(root){
  'use strict';
  function panFrom(start,dx,dy){return {x:start.x+dx,y:start.y+dy,zoom:start.zoom}}
  function zoomAt(view,newZoom,anchor){
    const zoom=Math.min(4,Math.max(.2,newZoom)),ratio=zoom/view.zoom;
    return {x:anchor.x-(anchor.x-view.x)*ratio,y:anchor.y-(anchor.y-view.y)*ratio,zoom};
  }
  function toWorld(view,point){return {x:(point.x-view.x)/view.zoom,y:(point.y-view.y)/view.zoom}}
  function clientToWorld(view,event,rect,scroll={x:0,y:0}){
    return toWorld(view,{x:event.clientX-rect.left+(Number(scroll.x)||0),y:event.clientY-rect.top+(Number(scroll.y)||0)});
  }
  const api={panFrom,zoomAt,toWorld,clientToWorld};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSViewport=api;
})(typeof window==='undefined'?globalThis:window);
