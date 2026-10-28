(function(root){
 'use strict';
 // Visual presentation only; never changes the electrical solver, wires or pin definitions.
 function measurementDevice(d){
  const kind=String(d?.kind||'').toLowerCase();
  return !!d&&(!!d.probeColor||kind==='multimeter'||kind==='clamp-meter'||
   /^(?:meter-|voltmeter$|ammeter$|oscilloscope$|scope$|power-analyzer$|energy-analyzer$|logic-analyzer$|frequency-meter$)/.test(kind));
 }
 function split(components,byId,floating){
  const ordinary=[],measuring=[];
  for(const c of Array.isArray(components)?components:[]){
   const d=byId?.[c?.typeId];
   if(!d)continue;
   (measurementDevice(d)||(typeof floating==='function'&&floating(d))?measuring:ordinary).push(c);
  }
  return {ordinary,measuring};
 }
 const api=Object.freeze({measurementDevice,split});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.DTSSceneLayerOrder=api;
})(typeof window==='undefined'?globalThis:window);
