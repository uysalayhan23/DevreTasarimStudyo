(function(root){
 'use strict';
 // Discoverable search shortcut only; no editor, simulation or lesson mutations.
 function init(doc=root.document,env=root){
  const input=doc?.getElementById?.('searchInput');
  if(!input||input.dataset.dtsSearchUxReady==='1')return false;
  input.dataset.dtsSearchUxReady='1';
  function blocked(){
   return doc.body?.classList?.contains('dashboard-open')||
    env.DTSStudio?.isHome||env.DTSStudio?.safety?.visible||
    doc.getElementById('modal')?.hidden===false||
    doc.getElementById('arduinoIdeModal')?.hidden===false||
    doc.getElementById('hc05GuideModal')?.hidden===false||
    doc.getElementById('safetyModal')?.hidden===false||
    doc.getElementById('dtsLadderOverlay')?.hidden===false||
    doc.getElementById('dtsTerminalDraftOverlay')?.hidden===false;
  }
  doc.addEventListener('keydown',function(e){
   if(e.defaultPrevented||!(e.ctrlKey||e.metaKey)||e.altKey||e.shiftKey||e.isComposing||e.keyCode===229||String(e.key).toLowerCase()!=='k'||blocked())return;
   const active=doc.activeElement;
   if(active&&active!==input&&
     (['INPUT','TEXTAREA','SELECT'].includes(active.tagName)||active.isContentEditable))return;
   e.preventDefault();
   // Ctrl+K must reveal its target even if simulation focus collapsed the library.
   if(doc.body?.classList?.contains('library-collapsed'))doc.body.classList.remove('library-collapsed');
   input.focus();
   if(input.value)input.select();
  });
  input.addEventListener('keydown',function(e){
   if(e.defaultPrevented||blocked()||e.key!=='Escape'||e.isComposing||e.keyCode===229)return;
   e.preventDefault();e.stopPropagation();
   if(input.value){
    input.value='';
    const E=doc.defaultView?.Event||root.Event;
    input.dispatchEvent(new E('input',{bubbles:true}));
   }else input.blur();
  });
  return true;
 }
 const api={init};
 if(typeof module==='object'&&module.exports)module.exports=api;
 else if(root.document){root.DTSLibrarySearchUX=api;init(root.document,root)}
})(typeof window==='undefined'?globalThis:window);
