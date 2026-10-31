(function(root){
 'use strict';
 // Pure presentation controller. Never changes project, circuit, camera, or PLC state.
 function create(doc,win,panelAPI){
  if(!doc||!panelAPI||typeof panelAPI.getState!=='function'||typeof panelAPI.setState!=='function')return null;
  const body=doc.body,button=doc.getElementById('dtsFullModeBtn'),badge=doc.getElementById('dtsFocusBadge'),sim=doc.getElementById('simulateBtn');
  if(!body||!button||!sim)return null;
  let running=false,full=false,before=null,nativeRequested=false;
  function focused(){return running||full}
  function apply(){
   body.classList.toggle('dts-sim-focus',running&&!full);
   body.classList.toggle('dts-full-mode',full);
   if(focused()){
    if(!before)before=panelAPI.getState();
    // Let the user keep changing the properties panel while in full/simulation mode.
    // On leaving focus, restore the original panel snapshot.
    panelAPI.setState({libraryCollapsed:!full,propertiesVisible:!!panelAPI.getState().propertiesVisible});
   }else if(before){
    panelAPI.setState(before);before=null;
   }
   button.setAttribute('aria-pressed',String(full));
   button.textContent=full?'⤢ Standart görünüm':'⛶ Tam sayfa';
   button.title=full?'Standart görünüme dön (Esc)':'Çalışma alanını tam sayfa yap';
   if(badge)badge.hidden=!running||full;
  }
  function setRunning(next){
   const newValue=!!next;
   if(newValue===running)return false;
   running=newValue;apply();return true;
  }
  function exitNative(){
   if(nativeRequested&&doc.fullscreenElement===doc.documentElement&&typeof doc.exitFullscreen==='function'){
    try{const p=doc.exitFullscreen();p?.catch?.(()=>{});}catch{}
   }
   nativeRequested=false;
  }
  function setFull(next){
   if(!!next===full)return false;
   full=!!next;apply();
   if(!full)exitNative();
   return true;
  }
  function toggleFull(){
   // Entering fullscreen is blocked by dialogs, but exiting must ALWAYS remain possible.
   if(full)return setFull(false);
   if(body.classList.contains('dashboard-open')||win.DTSStudio?.safety?.visible||
    ['modal','arduinoIdeModal','hc05GuideModal','safetyModal','dtsLadderOverlay','dtsTerminalDraftOverlay']
     .some(id=>doc.getElementById(id)?.hidden===false))return false;
   setFull(true);
   // The CSS full-workspace mode remains available if the browser refuses native fullscreen on file://.
   if(typeof doc.documentElement?.requestFullscreen==='function'){
    try{
     const result=doc.documentElement.requestFullscreen();
     nativeRequested=true;
     result?.then?.(()=>{
      // A native fullscreen request can finish AFTER the user exits CSS full mode.
      // Never leave a delayed browser fullscreen active after switching to standard view.
      if(!full&&doc.fullscreenElement===doc.documentElement&&typeof doc.exitFullscreen==='function'){
       try{doc.exitFullscreen()?.catch?.(()=>{})}catch{}
      }
     },()=>{nativeRequested=false});
    }catch{nativeRequested=false}
   }
   return true;
  }
  button.addEventListener('click',toggleFull);
  doc.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&full){setFull(false);e.preventDefault();}
  });
  doc.addEventListener('fullscreenchange',()=>{
   if(!doc.fullscreenElement&&nativeRequested&&full){
    nativeRequested=false;setFull(false);
   }
  });
  function syncSimulation(){
   const active=!sim.disabled&&sim.classList.contains('running');
   setRunning(active);
  }
  const Observer=win.MutationObserver;
  if(typeof Observer==='function'){
   const observer=new Observer(syncSimulation);
   observer.observe(sim,{attributes:true,attributeFilter:['class','disabled']});
  }
  syncSimulation();
  return Object.freeze({setRunning,setFull,toggleFull,getState:()=>({running,full,focus:focused(),hasPanelSnapshot:!!before})});
 }
 const api={create};
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root?.document){root.DTSWorkspaceModes=api;create(root.document,root,root.DTSWorkspacePanelUI)}
})(typeof window==='undefined'?globalThis:window);
