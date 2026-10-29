(function(root){
 'use strict';
 // UI-only deferred SVG preview. Every catalog card and its input handlers remain mounted.
 function create(Observer=root.IntersectionObserver){
  let observer=null;
  function disconnect(){if(observer){observer.disconnect();observer=null}}
  function render(container,byId,makePreview){
   disconnect();
   const pending=container.querySelectorAll('[data-preview-type]');
   const hydrate=node=>{
    if(!node?.isConnected||!node.dataset?.previewType)return;
    const d=byId[node.dataset.previewType];
    if(!d)return;
    node.innerHTML=makePreview(d);
    node.removeAttribute('data-preview-type');
   };
   if(typeof Observer!=='function'){
    // Old browsers keep the original eager thumbnails, never blank cards.
    pending.forEach(hydrate);
    return;
   }
   const current=new Observer(entries=>{
    // A pending callback from an old filter/appearance view must be ignored.
    if(observer!==current)return;
    for(const entry of entries){
     if(!entry.isIntersecting)continue;
     hydrate(entry.target);
     current.unobserve(entry.target);
    }
   },{root:container,rootMargin:'160px 0px'});
   observer=current;
   pending.forEach(n=>current.observe(n));
  }
  return Object.freeze({render,disconnect});
 }
 const api=Object.freeze({create});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.DTSLibraryPreviews=api;
})(typeof window==='undefined'?globalThis:window);
