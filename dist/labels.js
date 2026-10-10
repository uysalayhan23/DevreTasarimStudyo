(function(root){
  'use strict';
  // Absolute anchors in the component's unrotated sheet coordinate frame.
  // A user-placed annotation follows translation, but never rotates with a device.
  function valid(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)}
  function position(c,key,base){const p=c.labelPositions?.[key];return valid(p)?{x:p.x,y:p.y}:{x:base.x,y:base.y}}
  function sanitize(c){
    if(!c.labelPositions||typeof c.labelPositions!=='object'){delete c.labelPositions;return c}
    c.labelPositions=Object.fromEntries(Object.entries(c.labelPositions).filter(([k,p])=>k.length<100&&valid(p)).map(([k,p])=>[k,{x:p.x,y:p.y}]));return c;
  }
  function begin(c,key,base,client,zoom){return {key,anchor:position(c,key,base),client:{x:client.x,y:client.y},zoom:Number.isFinite(zoom)&&zoom>0?zoom:1}}
  function move(c,drag,client){
    const p={x:Math.round((drag.anchor.x+(client.x-drag.client.x)/drag.zoom)*100)/100,y:Math.round((drag.anchor.y+(client.y-drag.client.y)/drag.zoom)*100)/100};
    c.labelPositions={...(c.labelPositions||{}),[drag.key]:p};return p;
  }
  function reset(c,key){if(key&&c.labelPositions)delete c.labelPositions[key];else delete c.labelPositions}
  const api={position,sanitize,begin,move,reset};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSLabels=api;
})(typeof window==='undefined'?globalThis:window);
