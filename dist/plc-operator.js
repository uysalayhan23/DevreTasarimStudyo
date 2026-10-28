(function(root){
 'use strict';
 // Read-only operator panel for verified DTS virtual PLCs; NOT a real-world PLC HMI.
 const Monitor=typeof module==='object'&&module.exports?require('./ladder-monitor.js'):root?.DTSLadderMonitor;
 const Ladder=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function supportedDevices(project,byId){
  return (Array.isArray(project?.components)?project.components:[]).filter(c=>
   c&&Ladder?.supportedPLC?.(byId?.[c.typeId]));
 }
 function state(project,byId,running,selectedId){
  const choices=supportedDevices(project,byId);
  const c=choices.find(x=>String(x.id)===String(selectedId))||choices[0]||null;
  if(!c)return {selection:null,choices:[],status:'Bu projede desteklenen sanal PLC bulunamadı.',info:null};
  const d=byId[c.typeId];
  // A configured Ladder object is not evidence that its program is executable.
  // Respect the actual supported CPU's terminal counts before showing live values.
  const valid=c.plcProgram==='dts-ladder-v1'?Ladder.validate(c.ladderProgram,{
   inputCount:(d.pins||[]).filter(p=>p.signalType==='DI').length,
   outputCount:(d.pins||[]).filter(p=>p.signalType==='DO').length
  }):null;
  const info=Monitor.snapshot(c,d,running,valid?.ok===true,valid&&!valid.ok?valid.error:null);
  const descriptions=choices.map(x=>({id:String(x.id),name:String(x.label||x.ref||byId[x.typeId]?.name||x.typeId||'PLC')}));
  return {selection:String(c.id),choices:descriptions,status:info.message,info};
 }
 function markup(result){
  const s=result||{};
  const select=(s.choices||[]).length?'<label>PLC seç <select id="dtsOperatorSelect" aria-label="İzlenecek sanal PLC">'+
   s.choices.map(o=>'<option value="'+escape(o.id)+'" '+(o.id===s.selection?'selected':'')+'>'+escape(o.name)+'</option>').join('')+'</select></label>':'';
  return select+(s.info?'<div id="dtsOperatorSignals">'+Monitor.markup(s.info)+'</div>':
   '<p class="dts-operator-empty">'+escape(s.status||'PLC bekleniyor')+'</p>')+
   '<p class="dts-operator-caution">Yalnız sanal I/O izleme. Q mantık değeri, yükün enerjilendiğini kanıtlamaz. Gerçek PLC kontrolü veya çıkış zorlaması yoktur.</p>';
 }
 function init(doc=root.document,editor=root.DTSEditor){
  const btn=doc?.getElementById?.('dtsOperatorBtn');
  if(!btn||!editor||!Monitor||!Ladder)return false;
  if(btn.dataset.ready)return true;
  btn.dataset.ready='1';
  const panel=doc.createElement('section');
  panel.id='dtsOperatorPanel';panel.className='dts-operator-panel';
  panel.setAttribute('role','region');panel.setAttribute('aria-label','Sanal PLC operatör izleme paneli');
  panel.hidden=true;
  panel.innerHTML='<div class="dts-operator-heading"><strong>▣ Sanal PLC I/O</strong><button type="button" id="dtsOperatorClose" aria-label="PLC panelini kapat">×</button></div><div id="dtsOperatorContent"></div>';
  doc.body.appendChild(panel);
  btn.setAttribute('aria-controls','dtsOperatorPanel');btn.setAttribute('aria-pressed','false');
  const content=panel.querySelector('#dtsOperatorContent');
  let timer=null,selectedId=null,optionKey='';
  function close(){
   panel.hidden=true;btn.setAttribute('aria-pressed','false');
   if(timer!==null){root.clearInterval(timer);timer=null}
  }
  function refresh(){
   if(panel.hidden||doc.body.classList.contains('dashboard-open')){close();return}
   const info=state(editor.getProject(),editor.byId,editor.running,selectedId);
   selectedId=info.selection;
   const nextKey=JSON.stringify([info.choices,info.selection]);
   if(optionKey!==nextKey){
    content.innerHTML=markup(info);optionKey=nextKey;
   }else{
    const signals=content.querySelector('#dtsOperatorSignals');
    if(signals&&info.info){
     const next=Monitor.markup(info.info);
     if(signals.innerHTML!==next)signals.innerHTML=next;
    }
   }
  }
  function open(){
   if(doc.body.classList.contains('dashboard-open'))return false;
   panel.hidden=false;btn.setAttribute('aria-pressed','true');
   optionKey='';refresh();
   if(timer===null)timer=root.setInterval(refresh,350);
   return true;
  }
  btn.addEventListener('click',()=>panel.hidden?open():close());
  panel.querySelector('#dtsOperatorClose').addEventListener('click',()=>{close();btn.focus()});
  content.addEventListener('change',event=>{
   if(event.target?.id==='dtsOperatorSelect'){
    selectedId=event.target.value;optionKey='';refresh();
   }
  });
  panel.addEventListener('keydown',event=>{
   if(event.key==='Escape'){close();btn.focus();event.stopPropagation()}
  });
  root.DTSOperatorPanel=Object.freeze({open,close,refresh});
  return true;
 }
 const api=Object.freeze({state,markup,supportedDevices,init});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else if(root?.document)root.DTSOperatorPanelBootstrap=api,init(root.document,root.DTSEditor);
})(typeof window==='undefined'?globalThis:window);
