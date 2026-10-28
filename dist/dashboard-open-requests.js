(function(root){
'use strict';
// Only the latest user selection may load a dashboard project.
function create(){
 let current=0;
 return Object.freeze({
  begin(){return ++current},
  invalidate(){current++},
  isCurrent(ticket){return Number.isSafeInteger(ticket)&&ticket>0&&ticket===current}
 });
}
const api=Object.freeze({create});
if(typeof module==='object'&&module.exports)module.exports=api;
else root.DTSDashboardOpenRequests=api;
})(typeof window==='undefined'?globalThis:window);
