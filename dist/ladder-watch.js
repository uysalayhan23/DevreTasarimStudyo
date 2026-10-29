(function(root){
 'use strict';
 // Pure read-only PLC/Ladder watch. No project mutation, simulation commands or fake I/O.
 const Ladder=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root.DTSLadderRuntime;
 const Editor=typeof module==='object'&&module.exports?require('./ladder-editor.js'):root.DTSLadderEditorBootstrap;
 const Monitor=typeof module==='object'&&module.exports?require('./ladder-monitor.js'):root.DTSLadderMonitor;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const validInputs=d=>(d?.pins||[]).filter(p=>p.signalType==='DI');
 const validOutputs=d=>(d?.pins||[]).filter(p=>p.signalType==='DO');
 function choices(project,byId){
  return (project?.components||[]).filter(c=>{
   const d=byId?.[c.typeId];
   return Ladder?.supportedPLC?.(d)===true;
  });
 }
 function read(editor,id){
  const project=editor?.getProject?.(),supported=choices(project,editor?.byId);
  const cpu=supported.find(c=>c.id===id)||supported[0];
  if(!cpu)return {available:supported,live:false,message:'Doğrulanmış Ladder PLC bulunamadı.',rungs:[]};
  const d=editor.byId[cpu.typeId],program=cpu.ladderProgram;
  const limits={inputCount:validInputs(d).length,outputCount:validOutputs(d).length};
  const valid=cpu.plcProgram==='dts-ladder-v1'&&Ladder?.validate?.(program,limits)?.ok===true;
  const io=Monitor.snapshot(cpu,d,editor.running,valid);
  const rows=valid?Editor.monitorRows(program,program,cpu._dtsLadderTraces,editor.running,cpu.plcProgram,cpu._plcRuntime?.powered,cpu._dtsLadderError,cpu._plcRuntime?.program):[];
  const live=valid&&io.live===true&&rows.length===program.rungs.length&&rows.every(r=>Array.isArray(r.pathStates));
  // Only expose real physical DI and validated scan values while native scan is healthy.
  const values=live?{...(cpu._dtsLadderMemory?.values||{})}:null;
  if(live)validInputs(d).forEach((p,i)=>{values['I'+(i+1)]=io.inputs[i].value===true});
  return {available:supported,cpu,program,rows,live,values,io,limits,
   message:!valid?'Önce geçerli Ladder programını kaydedin.':io.message};
 }
 function contactState(contact,values,live){
  if(!live||!contact||!values||!Object.prototype.hasOwnProperty.call(values,contact.ref))return null;
  const bit=values[contact.ref]===true;
  return contact.type==='NC'?!bit:bit;
 }
 function rungHtml(rung,row,values,live,i){
  const paths=Array.isArray(rung.paths)?rung.paths:[];
  const pathMarkup=paths.map((path,pi)=>{
   const pathOn=live&&row?.pathStates?.[pi]===true;
   return '<div class="dts-watch-path '+(pathOn?'is-on':'')+'" data-path="'+i+':'+pi+'">'+
    '<span class="dts-watch-rail" aria-hidden="true">┃─</span>'+ (pi?'<small>VEYA</small>':'')+
    (path.length?path.map(contact=>{
      const on=contactState(contact,values,live),onClass=on===true?'is-on':on===false?'is-off':'is-unknown';
      const sym=contact.type==='NC'?'─|/|─':'─| |─';
      return '<span class="dts-watch-contact '+onClass+'" data-ref="'+esc(contact.ref)+'" aria-label="'+esc(contact.ref+' '+contact.type+(on===null?' bilinmiyor':on?' iletimde':' açık'))+'"><span>'+sym+'</span><b>'+esc(contact.ref)+'</b></span>';
    }).join('<span class="dts-watch-wire">─</span>'):'<span class="dts-watch-empty">Boş · açık devre</span>')+
    '<span class="dts-watch-rail" aria-hidden="true">─┃</span></div>';
  }).join('');
  const coil=rung.coil||{},coilOn=live&&row?.value===true;
  const ref=coil.type==='NOP'?'Çıkış yok':(coil.ref||'?');
  const value=live?Editor.signalText(row):'—';
  return '<article class="dts-watch-network" data-network="'+esc(rung.id)+'">'+
   '<header><strong>Network '+(i+1)+'</strong><span>'+(live?(row?.active?'Akış var':'Bekliyor'):'Canlı veri yok')+'</span></header>'+
   '<div class="dts-watch-circuit"><div class="dts-watch-paths">'+pathMarkup+'</div>'+
   '<div class="dts-watch-result '+(coilOn?'is-on':'')+'"><small>'+esc(coil.type||'NOP')+'</small><strong>'+esc(ref)+'</strong><span>'+esc(value)+'</span></div></div>'+ 
   (rung.comment?'<p>'+esc(rung.comment)+'</p>':'')+'</article>';
 }
 function markup(view){
  if(!view?.cpu)return '<p class="dts-watch-note">'+esc(view?.message||'PLC bulunamadı')+'</p>';
  if(!view.program||!Array.isArray(view.program.rungs))return '<p class="dts-watch-note">'+esc(view.message)+'</p>';
  return '<div class="dts-watch-status '+(view.live?'is-live':'')+'" role="status">'+esc(view.live?'● Canlı · proje butonlarını kullanabilirsiniz':view.message)+'</div>'+ 
    view.program.rungs.map((r,i)=>rungHtml(r,view.rows[i],view.values,view.live,i)).join('');
 }
 function init(doc=root.document,editor=root.DTSEditor){
  const button=doc?.getElementById?.('dtsLadderWatchBtn');
  if(!button||!editor||!Ladder||!Editor||!Monitor)return false;
  if(button.dataset.ready)return true;
  button.dataset.ready='1';
  const panel=doc.createElement('aside');panel.id='dtsLadderWatch';panel.className='dts-ladder-watch';panel.hidden=true;
  panel.setAttribute('aria-label','Canlı Ladder program izleme');
  panel.innerHTML='<header class="dts-watch-heading"><strong>◉ Canlı Ladder</strong><button type="button" data-watch="close" aria-label="İzleme penceresini kapat">×</button></header><div class="dts-watch-toolbar"><label>PLC <select id="dtsWatchCPU" aria-label="İzlenen PLC"></select></label></div><div class="dts-watch-body" aria-live="off"></div>';
  doc.body.appendChild(panel);
  const body=panel.querySelector('.dts-watch-body'),select=panel.querySelector('#dtsWatchCPU');
  let timer=null,id=null,lastKey=null,location=null;
  function refresh(){
   if(panel.hidden)return;
   const v=read(editor,id);
   if(v.cpu)id=v.cpu.id;
   const options=v.available.map(c=>[c.id,c.ref||c.label||editor.byId[c.typeId].name]);
   const optionKey=JSON.stringify(options);
   if(select.dataset.options!==optionKey){select.innerHTML=options.map(([key,label])=>'<option value="'+esc(key)+'">'+esc(label)+'</option>').join('');select.dataset.options=optionKey}
   select.value=id||'';
   const key=JSON.stringify([id,v.live,v.message,v.program,v.rows,v.values]);
   if(key!==lastKey){const scroll=body.scrollTop;lastKey=key;body.innerHTML=markup(v);body.scrollTop=scroll}
  }
  function open(requested){
   if(panel.hidden){panel.hidden=false;button.setAttribute('aria-pressed','true')}
   if(typeof requested==='string')id=requested;
   lastKey=null;refresh();
   if(timer===null)timer=root.setInterval(refresh,160);
   return true;
  }
  function close(){panel.hidden=true;button.setAttribute('aria-pressed','false');if(timer!==null){root.clearInterval(timer);timer=null}lastKey=null}
  button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>panel.hidden?open():close());
  panel.addEventListener('click',e=>{if(e.target.closest?.('[data-watch="close"]'))close()});
  select.addEventListener('change',()=>{id=select.value;lastKey=null;refresh()});
  // Drag only the header; no full-page backdrop, focus trap or interception of circuit controls.
  const heading=panel.querySelector('.dts-watch-heading');
  heading.addEventListener('pointerdown',e=>{
   if(e.button!==0||e.target.closest?.('button'))return;
   e.preventDefault();
   const box=panel.getBoundingClientRect(),dx=e.clientX-box.left,dy=e.clientY-box.top;
   location={dx,dy};heading.setPointerCapture?.(e.pointerId);
  });
  heading.addEventListener('pointermove',e=>{
   if(!location)return;
   const x=Math.max(0,Math.min(root.innerWidth-panel.offsetWidth,e.clientX-location.dx)),y=Math.max(0,Math.min(root.innerHeight-70,e.clientY-location.dy));
   panel.style.left=x+'px';panel.style.top=y+'px';panel.style.right='auto';
  });
  const end=()=>{location=null};heading.addEventListener('pointerup',end);heading.addEventListener('pointercancel',end);
  root.DTSLadderWatch=Object.freeze({open,close,refresh,visible:()=>!panel.hidden});return true;
 }
 const api={choices,read,contactState,rungHtml,markup,init};
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root?.document)init(root.document,root.DTSEditor);
})(typeof window==='undefined'?globalThis:window);
