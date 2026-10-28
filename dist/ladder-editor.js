(function(root){
 'use strict';
 // Original DTS Ladder editor. Only edits the user's virtual PLC program; never imports Siemens code.
 const L=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 const Diagram=typeof module==='object'&&module.exports?require('./ladder-diagram.js'):root?.DTSLadderDiagram;
 const Monitor=typeof module==='object'&&module.exports?require('./ladder-monitor.js'):root?.DTSLadderMonitor;
 const ProgramIO=typeof module==='object'&&module.exports?require('./ladder-program-io.js'):root?.DTSLadderProgramIO;
 const Examples=typeof module==='object'&&module.exports?require('./ladder-examples.js'):root?.DTSLadderExamples;
 const FBDView=typeof module==='object'&&module.exports?require('./fbd-view.js'):root?.DTSFBDView;
 const Toolbox=typeof module==='object'&&module.exports?require('./ladder-toolbox.js'):root?.DTSLadderToolbox;
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // LAD and FBD use exactly the same allowed native output addresses.
 function coilSelectOptions(type,limits={},candidates=[]){
  const names=FBDView.refsFor(type,limits);
  const labels=new Map(candidates.map(c=>[c.ref,c.label]));
  return names.map(ref=>({value:ref,label:labels.get(ref)||ref}));
 }
 const clone=x=>JSON.parse(JSON.stringify(x));
 // Undo/Redo is local to the Ladder draft; it never modifies the saved circuit.
 function createDraftHistory(initial,maxSteps=50){
  let steps=[clone(initial)],index=0;
  const limit=Math.max(2,Math.min(100,Number.isInteger(maxSteps)?maxSteps:50));
  const current=()=>clone(steps[index]);
  return Object.freeze({
   current,
   push(next){
    if(JSON.stringify(next)===JSON.stringify(steps[index]))return false;
    steps=steps.slice(0,index+1);
    steps.push(clone(next));
    if(steps.length>limit)steps.shift();
    index=steps.length-1;
    return true;
   },
   undo(){if(index===0)return null;index--;return current()},
   redo(){if(index>=steps.length-1)return null;index++;return current()},
   canUndo:()=>index>0,canRedo:()=>index<steps.length-1
  });
 }
 // Unsaved drafts are scoped to the actual project object and component ID.
 // A changed saved-program baseline invalidates the old draft on reopening.
 function createDraftSessions(){
  const projects=new WeakMap();
  function entries(project){
   if(!project||typeof project!=='object')throw Error('Ladder projesi bulunamadı.');
   let per=projects.get(project);
   if(!per){per=new Map();projects.set(project,per)}
   return per;
  }
  return Object.freeze({
   forComponent(project,component,initial){
    const per=entries(project),baseline=JSON.stringify(component.ladderProgram??null);
    const previous=per.get(component.id);
    if(previous&&previous.component===component&&previous.baseline===baseline)return previous.history;
    const history=createDraftHistory(initial);
    per.set(component.id,{component,baseline,history});
    return history;
   },
   forget(project,component){if(project&&typeof project==='object')projects.get(project)?.delete(component.id)}
  });
 }
 // Simulation can start only for a saved, current Ladder program and an enabled native simulator.
 function canStartLadder(c,draft,running,simButton){
  if(running)return true;
  return !!simButton&&!simButton.disabled&&c?.plcProgram==='dts-ladder-v1'&&
    !!c.ladderProgram&&JSON.stringify(draft)===JSON.stringify(c.ladderProgram);
 }
 // A File.text() Promise may finish after the modal closes or the user chooses another PLC.
 // Never apply an async import to a different component or a replaced project instance.
 function importContextMatches(source,latest,projectAtStart,currentProject,dialogVisible){
  return !!source&&source===latest&&!!projectAtStart&&projectAtStart===currentProject&&!!dialogVisible;
 }
 const pins=(d,t)=>(d?.pins||[]).filter(p=>p.signalType===t);
 const supported=(editor)=>editor?.getProject?.()?.components?.filter(c=>L?.supportedPLC?.(editor.byId?.[c.typeId])&&pins(editor.byId[c.typeId],'DI').length&&pins(editor.byId[c.typeId],'DO').length)||[];
 const starter=()=>({version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'Q1'},{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}}
 ]});
 // Only saved, currently running programs may display live signals.
 function monitorRows(draft,saved,traces,running,mode){
  const rows=Array.isArray(draft?.rungs)?draft.rungs:[];
  const live=!!running&&mode==='dts-ladder-v1'&&JSON.stringify(draft)===JSON.stringify(saved);
  const byId=new Map((live&&Array.isArray(traces)?traces:[]).map(t=>[t.id,t]));
  return rows.map(r=>{
   const t=live?byId.get(r.id):null;
   return {active:!!t?.active,value:t?!!t.value:null,count:Number.isInteger(t?.count)?t.count:null,
    pathStates:Array.isArray(t?.pathStates)&&t.pathStates.length===r.paths.length?t.pathStates.map(Boolean):null,
    status:!running?'Simülasyon kapalı':!live?'Taslak izlenmiyor · kayıtlı program farklı':!t?'Sinyal bekleniyor':t.active?'AKTİF':'Pasif'};
  });
 }
 // Stable control identities let rerenders keep keyboard focus on the same Ladder field.
 function focusKey(el){
  if(!el)return '';
  if(el.id)return 'id:'+el.id;
  const d=el.dataset||{};
  if(d.fbdToggleContact)return 'fbd-toggle:'+d.fbdToggleContact;
   if(d.fbdCoilField)return 'fbd-coil:'+d.fbdCoilField+':'+(d.r??'');
  const kind=d.field?'field:'+d.field:d.action?'action:'+d.action:'';
  return kind?kind+':'+(d.r??'')+':'+(d.p??'')+':'+(d.c??''):'';
 }
 // Keep keyboard navigation inside the dialog; disabled controls are never targets.
 function trapModalTab(e,dialog,doc){
  if(e.key!=='Tab'||!dialog)return false;
  const items=Array.from(dialog.querySelectorAll('button,select,input,[tabindex]')).filter(el=>
   !el.disabled&&!el.hidden&&el.tabIndex>=0&&el.getAttribute?.('aria-hidden')!=='true'&&typeof el.focus==='function');
  if(!items.length){e.preventDefault();dialog.focus();return true}
  const first=items[0],last=items[items.length-1],current=doc.activeElement;
  const outside=!dialog.contains(current)||current===dialog;
  if(outside||(e.shiftKey?current===first:current===last)){
   e.preventDefault();(e.shiftKey?last:first).focus();return true;
  }
  return false;
 }
 function signalText(row){return row.value===null?'—':(row.value?'1':'0')+(row.count===null?'':' · Sayaç '+row.count);}
 function stateFor(c,editor){
  const d=editor.byId[c.typeId];
  return {c,d,inputs:pins(d,'DI'),outputs:pins(d,'DO'),
   draft:L?.validate(c.ladderProgram,{inputCount:pins(d,'DI').length,outputCount:pins(d,'DO').length}).ok?clone(c.ladderProgram):L.blank()};
 }
 function init(doc=root.document,editor=root.DTSEditor){
  const btn=doc?.getElementById?.('dtsLadderBtn');
  if(!btn||!L||!editor)return false;
  if(btn.dataset.ready)return true;
  btn.dataset.ready='1';
  const overlay=doc.createElement('div');
  overlay.id='dtsLadderOverlay';overlay.className='dts-ladder-overlay';overlay.hidden=true;
  overlay.setAttribute('role','presentation');doc.body.appendChild(overlay);
  let active=null,monitorTimer=null,returnFocus=null,diagramMode='ladder',selectedTool=null,focusedNetwork=null;
  const closedNetworks=new Set();
  const sessions=createDraftSessions();
  const available=()=>supported(editor);
  const limits=()=>({inputCount:active?.inputs.length||0,outputCount:active?.outputs.length||0});
  const draw=(r,options)=>(diagramMode==='fbd'?FBDView:Diagram).render(r,options);
  function choices(){
   if(!active)return[];
   return [
    ...active.inputs.map((p,i)=>({ref:'I'+(i+1),label:'I'+(i+1)+' · '+p.id})),
    ...active.outputs.map((p,i)=>({ref:'Q'+(i+1),label:'Q'+(i+1)+' · '+p.id})),
    ...Array.from({length:8},(_,i)=>({ref:'M'+(i+1),label:'M'+(i+1)+' · Bellek'})),
    ...Array.from({length:4},(_,i)=>({ref:'T'+(i+1),label:'T'+(i+1)+' · Zamanlayıcı'})),
    ...Array.from({length:4},(_,i)=>({ref:'C'+(i+1),label:'C'+(i+1)+' · Sayaç'}))
   ];
  }
  const select=(value,values,attrs)=>'<select '+attrs+'>'+values.map(o=>'<option value="'+escape(o.value)+'" '+(value===o.value?'selected':'')+'>'+escape(o.label)+'</option>').join('')+'</select>';
  const asOptions=arr=>arr.map(x=>({value:x.ref,label:x.label}));
  const refOptions=(forCoil,type)=>{
   const c=choices();
   if(!forCoil)return asOptions(c);
   return coilSelectOptions(type,limits(),c);
  };
  function render(){
   if(!active)return;
   const priorFocus=overlay.contains(doc.activeElement)?focusKey(doc.activeElement):'';
   const oldScroll=overlay.querySelector('.dts-ladder-rungs')?.scrollTop||0;
   const cp=available(),valid=L.validate(active.draft,limits()),views=monitorRows(active.draft,active.c.ladderProgram,active.c._dtsLadderTraces,editor.running,active.c.plcProgram);
   const live=!!editor.running&&active.c.plcProgram==='dts-ladder-v1'&&JSON.stringify(active.draft)===JSON.stringify(active.c.ladderProgram);
   const liveBits=live?active.c._dtsLadderMemory?.values:null;
   const runAction=editor.running?'■ Durdur':'▶ Simüle et';
   const canRun=canStartLadder(active.c,active.draft,editor.running,doc.getElementById('simulateBtn'));
   const selectPLC=select(active.c.id,cp.map(c=>({value:c.id,label:c.label||editor.byId[c.typeId]?.name||c.typeId})), 'id="dtsLadderTarget" aria-label="PLC seç"');
   const options=Examples.list(limits());
   const exampleSelect=select(options[0]?.id,options.map(item=>({value:item.id,label:item.title})), 'id="dtsLadderExample" aria-label="Örnek Ladder programı"');
   overlay.innerHTML='<section class="dts-ladder-dialog" role="dialog" aria-modal="true" aria-label="PLC Ladder programla" tabindex="-1">'+
    '<header class="dts-ladder-header"><div><strong>PLC Ladder · DTS</strong><small>Özgün sanal Ladder · Gerçek LOGO! dosyası değildir</small></div>'+
    '<button type="button" data-action="close" aria-label="Kapat">×</button></header>'+
    '<div class="dts-ladder-toolbar"><label>PLC '+selectPLC+'</label>'+
    '<button type="button" data-action="undo" '+(active.history.canUndo()?'':'disabled')+' aria-label="Ladder geri al">↶ Geri al</button>'+
    '<button type="button" data-action="redo" '+(active.history.canRedo()?'':'disabled')+' aria-label="Ladder yinele">↷ Yinele</button>'+
    '<button type="button" data-action="add-rung">+ Rung</button>'+ 
    '<button type="button" data-action="toggle-diagram" aria-pressed="'+(diagramMode==='fbd')+'">'+(diagramMode==='fbd'?'LAD görünümü':'FBD görünümü')+'</button>'+
    '<label class="dts-ladder-examples">Örnek program '+exampleSelect+'</label>'+ 
    '<button type="button" data-action="load-example" '+(options.length?'':'disabled')+'>Örneği taslağa al</button>'+ 
    '<button type="button" data-action="export-program">Dışa aktar</button>'+ 
    '<button type="button" data-action="import-program">İçe aktar</button>'+ 
    '<input type="file" id="dtsLadderImport" accept=".dtsladder,.json" hidden>'+
    '<button type="button" data-action="save" class="dts-ladder-primary">Programı kaydet</button>'+ 
    '<button type="button" data-action="toggle-sim" '+(canRun?'':'disabled title="Önce Ladder programını kaydet ve devreyi doğrula"')+'>'+runAction+'</button></div>'+
    '<div class="dts-ladder-toolbox" role="group" aria-label="Ladder araç paleti" '+(diagramMode==='fbd'?'hidden':'')+'><strong>Komut paleti</strong><small>Kontak veya bloğu Network üzerine sürükleyin. Alternatif: paletten seçin, ekleme alanına tıklayın.</small><div class="dts-ladder-tool-list">'+
    Toolbox.tools.map(t=>'<button type="button" draggable="true" data-tool-id="'+t.id+'" aria-pressed="'+(selectedTool===t.id)+'" title="'+escape(t.label)+' sürükle veya seç"><span class="dts-tool-symbol">'+escape(t.symbol)+'</span><span>'+escape(t.label)+'</span></button>').join('')+
    '</div></div>'+ 
    '<div id="dtsLadderLivePanel" class="dts-ladder-live" aria-label="Sanal PLC durumları">'+Monitor.markup(Monitor.snapshot(active.c,active.d,editor.running,live))+'</div>'+ 
    '<div class="dts-ladder-hint">Sanal girişler I1, I2… · Sanal çıkışlar Q1, Q2… · M bellek, T zamanlayıcı, C sayaç. Kontaklar seri AND, paralel yollar OR çalışır. Gerçek tesisat güvenlik denetimi değildir.</div>'+
    '<main class="dts-ladder-rungs"><div class="dts-ladder-networks-bar"><strong>'+active.draft.rungs.length+' Network · LAD</strong>'+(focusedNetwork?'<button type="button" data-action="all-networks">▣ Tüm Networkleri göster</button>':'<span>Her Network ayrı bir çalışma penceresidir.</span>')+'</div>'+active.draft.rungs.map((r,ri)=>{
      const monitored=views[ri];
      return '<article class="dts-ladder-rung '+(monitored?.active?'active':'')+'" '+(focusedNetwork&&focusedNetwork!==r.id?'hidden':'')+'><div class="dts-ladder-rung-title"><strong>Network '+(ri+1)+' · '+escape(r.id)+'</strong><input type="text" class="dts-ladder-comment-field" maxlength="100" placeholder="Network açıklaması…" aria-label="'+escape(r.id)+' açıklaması" data-field="rung-comment" data-r="'+ri+'" value="'+escape(r.comment||'')+'"><span data-monitor="status">'+escape(monitored.status)+'</span><button type="button" data-action="toggle-network" data-r="'+ri+'" aria-expanded="'+!closedNetworks.has(r.id)+'">'+(closedNetworks.has(r.id)?'▣ Aç':'▾ Daralt')+'</button><button type="button" data-action="focus-network" data-r="'+ri+'">'+(focusedNetwork===r.id?'Tümüne dön':'⛶ Tek pencere')+'</button><button type="button" data-action="remove-rung" data-r="'+ri+'" '+(active.draft.rungs.length===1?'disabled':'')+'>Satırı sil</button></div><div class="dts-ladder-network-body" '+(closedNetworks.has(r.id)?'hidden':'')+'>'+
       '<div class="dts-ladder-diagram" data-drop-kind="network" data-r="'+ri+'" data-diagram="'+ri+'" title="Paletten öğeyi buraya bırakın">'+draw(r,{index:ri,live:!!liveBits&&Array.isArray(monitored.pathStates),values:liveBits,pathStates:monitored.pathStates,coilValue:monitored.value,limits:limits()})+'</div>'+ 
       '<div class="dts-ladder-branches">'+r.paths.map((path,pi)=>'<div class="dts-ladder-path"><span class="dts-path-label">'+(pi?'VEYA':'EĞER')+'</span>'+
        path.map((contact,ci)=>'<div class="dts-ladder-contact"><span>—[ '+(contact.type==='NC'?'/':'')+' ]—</span>'+
        select(contact.type,[{value:'NO',label:'NO'},{value:'NC',label:'NC'}],'data-field="contact-type" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'"')+
        select(contact.ref,asOptions(choices()),'data-field="contact-ref" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'"')+
        '<button type="button" data-action="remove-contact" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'" '+(path.length===1?'disabled':'')+' aria-label="Kontağı sil">×</button></div>').join('')+
        '<button type="button" data-action="add-contact" data-r="'+ri+'" data-p="'+pi+'" '+(path.length>=12?'disabled':'')+'>+ Seri</button>'+
        '<button type="button" class="dts-ladder-dropzone" data-drop-kind="contact" data-r="'+ri+'" data-p="'+pi+'" data-i="'+path.length+'" '+(path.length>=12?'disabled':'')+' title="Bu seri kola kontak bırakın">⇣ Kontak bırak</button>'+
        (pi?'<button type="button" data-action="remove-path" data-r="'+ri+'" data-p="'+pi+'">Yolu sil</button>':'')+
        '</div>').join('')+
       '<button type="button" data-action="add-path" data-r="'+ri+'" '+(r.paths.length>=8?'disabled':'')+'>+ Paralel yol</button></div>'+
       '<div class="dts-ladder-coil"><span>SONUÇ →</span><button type="button" class="dts-ladder-dropzone" data-drop-kind="coil" data-r="'+ri+'" title="Buraya bobin, timer veya counter bırakın">⇣ Bobin / Blok bırak</button>'+
       select(r.coil.type,['OUT','SET','RESET','TON','TOF','TP','CTU','CTD'].map(v=>({value:v,label:v})),'data-field="coil-type" data-r="'+ri+'"')+
       select(r.coil.ref,refOptions(true,r.coil.type),'data-field="coil-ref" data-r="'+ri+'"')+
       (['TON','TOF','TP'].includes(r.coil.type)?'<label>Süre (ms) <input type="number" min="1" max="600000" value="'+escape(r.coil.presetMs||1000)+'" data-field="presetMs" data-r="'+ri+'"></label>':'')+
       (['CTU','CTD'].includes(r.coil.type)?'<label>Hedef <input type="number" min="1" max="65535" value="'+escape(r.coil.preset||1)+'" data-field="preset" data-r="'+ri+'"></label>':'')+
       '<strong class="dts-ladder-signal" data-monitor="value">'+escape(signalText(monitored))+'</strong>'+
       '</div></div></article>';
     }).join('')+'</main>'+
     '<footer class="dts-ladder-footer"><span id="dtsLadderValidation" role="status">'+(valid.ok?'Program kontrolü: uygun.':escape(valid.error))+'</span><button type="button" data-action="close">Kapat</button></footer>'+
     '</section>';
   const newList=overlay.querySelector('.dts-ladder-rungs');if(newList)newList.scrollTop=oldScroll;
   if(priorFocus){
    const next=Array.from(overlay.querySelectorAll('button,select,input')).find(el=>!el.disabled&&focusKey(el)===priorFocus);
    if(next)next.focus();else overlay.querySelector('.dts-ladder-dialog')?.focus();
   }
  }
  function close(){
   overlay.hidden=true;active=null;
   if(monitorTimer){root.clearInterval(monitorTimer);monitorTimer=null}
   const target=returnFocus?.isConnected&&typeof returnFocus.focus==='function'?returnFocus:btn;
   returnFocus=null;target.focus?.();
  }
  function open(which){
   const items=available();
   if(!items.length){editor.toast?.('Şu an yalnız native testi doğrulanmış Siemens CPU 1211C DC/DC/DC için Ladder açılabilir.');return false}
   const target=items.find(c=>c.id===which)||items[0];
   const firstOpen=overlay.hidden;
   if(firstOpen){returnFocus=doc.activeElement;diagramMode='ladder';selectedTool=null;focusedNetwork=null;closedNetworks.clear();}
   active=stateFor(target,editor);
   active.history=sessions.forComponent(editor.getProject(),target,active.draft);
   active.draft=active.history.current();
   overlay.hidden=false;render();
   // Initial open enters the dialog; switching PLC keeps keyboard focus on its selector.
   overlay.querySelector(firstOpen?'.dts-ladder-dialog':'#dtsLadderTarget')?.focus();
   if(!monitorTimer)monitorTimer=root.setInterval(()=>{
    if(overlay.hidden||!active)return;
    const views=monitorRows(active.draft,active.c.ladderProgram,active.c._dtsLadderTraces,editor.running,active.c.plcProgram);
    overlay.querySelectorAll('.dts-ladder-rung').forEach((el,i)=>{
     const row=views[i];if(!row)return;
     el.classList.toggle('active',row.active);
     const status=el.querySelector('[data-monitor="status"]'),value=el.querySelector('[data-monitor="value"]');
     if(status)status.textContent=row.status;
     if(value)value.textContent=signalText(row);
     const diagram=el.querySelector('[data-diagram]'),shown=editor.running&&active.c.plcProgram==='dts-ladder-v1'&&
       JSON.stringify(active.draft)===JSON.stringify(active.c.ladderProgram);
     const bits=shown?active.c._dtsLadderMemory?.values:null;
     if(diagram){
      const key=JSON.stringify([!!bits,bits||{},row.active,row.value,row.pathStates]);
      if(diagram.dataset.signalKey!==key&&!(diagramMode==='fbd'&&diagram.contains(doc.activeElement)&&doc.activeElement?.matches?.('[data-fbd-coil-field]'))){
       diagram.innerHTML=draw(active.draft.rungs[i],{index:i,live:!!bits&&Array.isArray(row.pathStates),values:bits,pathStates:row.pathStates,coilValue:row.value,limits:limits()});
       diagram.dataset.signalKey=key;
      }
     }
    });
    const liveSaved=!!editor.running&&active.c.plcProgram==='dts-ladder-v1'&&
      JSON.stringify(active.draft)===JSON.stringify(active.c.ladderProgram);
    const hud=overlay.querySelector('#dtsLadderLivePanel');
    if(hud){
      const info=Monitor.snapshot(active.c,active.d,editor.running,liveSaved);
      const stateKey=JSON.stringify(info);
      if(hud.dataset.snapshotKey!==stateKey){hud.innerHTML=Monitor.markup(info);hud.dataset.snapshotKey=stateKey}
    }
    const simAction=overlay.querySelector('[data-action="toggle-sim"]');
    if(simAction){
      // Reuse the saved-program start gate: liveSaved is false whenever stopped.
      // The timer must not disable a valid program's Start button after 300 ms.
      const nativeSim=doc.getElementById('simulateBtn');
      simAction.disabled=!canStartLadder(active.c,active.draft,editor.running,nativeSim);
      simAction.textContent=editor.running?'■ Durdur':'▶ Simüle et';
    }
   },300);
   return true;
  }
  function save(){
   if(!active)return false;
   if(editor.running){editor.toast?.('Ladder programını değiştirmek için simülasyonu durdurun.');return false}
   const valid=L.validate(active.draft,limits());
   if(!valid.ok){editor.toast?.('Ladder: '+valid.error);return false}
   if(!editor.guardEdit?.()||!editor.snapshot?.())return false;
   active.c.ladderProgram=clone(active.draft);active.c.plcProgram='dts-ladder-v1';
   sessions.forget(editor.getProject(),active.c);
   editor.render?.();editor.scheduleSave?.();root.DTSStudio?.markDirty?.();
   editor.toast?.('PLC Ladder programı kaydedildi · Projeyi de kaydetmeyi unutmayın.');
   close();return true;
  }
  function addFromPalette(id,zone){
   if(!active||diagramMode!=='ladder')return false;
   if(editor.running){editor.toast?.('Önce simülasyonu durdurup programı düzenleyin.');return false}
   const target={r:Number(zone.dataset.r),kind:zone.dataset.dropKind};
   if(zone.dataset.p!==undefined)target.p=Number(zone.dataset.p);
   if(zone.dataset.i!==undefined)target.i=Number(zone.dataset.i);
   const result=Toolbox.apply(active.draft,id,target,limits());
   if(!result.ok){editor.toast?.(result.error);return false}
   active.draft=result.program;active.history.push(result.program);
   closedNetworks.delete(result.rungId);
   selectedTool=null;render();return true;
  }
  function action(button){
   if(!active)return;
   const type=button.dataset.action,r=Number(button.dataset.r),p=Number(button.dataset.p),c=Number(button.dataset.c);
   if(type==='close'){close();return}
   if(type==='save'){save();return}
   if(type==='toggle-diagram'){diagramMode=diagramMode==='fbd'?'ladder':'fbd';selectedTool=null;render();return}
   if(type==='toggle-network'){
    const id=active.draft.rungs[r]?.id;if(!id)return;
    if(closedNetworks.has(id))closedNetworks.delete(id);else closedNetworks.add(id);
    render();return;
   }
   if(type==='focus-network'){
    const id=active.draft.rungs[r]?.id;if(!id)return;
    focusedNetwork=focusedNetwork===id?null:id;closedNetworks.delete(id);render();return;
   }
   if(type==='all-networks'){focusedNetwork=null;render();return}
   if(type==='import-program'){
    overlay.querySelector('#dtsLadderImport')?.click();return;
   }
   if(type==='export-program'){
    try{
     const data=ProgramIO.serialize(active.draft,limits(),active.c.label||active.c.id);
     const file=new Blob([data],{type:'application/json'});
     const url=root.URL.createObjectURL(file),a=doc.createElement('a');
     a.href=url;a.download='dts-ladder-program.dtsladder';a.hidden=true;doc.body.appendChild(a);
     try{a.click()}finally{a.remove();root.setTimeout(()=>root.URL.revokeObjectURL(url),0)}
     editor.toast?.('DTS Ladder dosyası dışa aktarıldı.');
    }catch(ex){editor.toast?.(ex.message)}
    return;
   }
   if(type==='toggle-sim'){
    const sim=doc.getElementById('simulateBtn');
    if(canStartLadder(active.c,active.draft,editor.running,sim)&&sim&&!sim.disabled)sim.click();
    render();return;
   }
   if(type==='undo'||type==='redo'){
    const next=type==='undo'?active.history.undo():active.history.redo();
    if(next){active.draft=next;render()}
    return;
   }
   if(type==='starter'){active.draft=starter();active.history.push(active.draft);render();return}
   if(type==='load-example'){
    const id=overlay.querySelector('#dtsLadderExample')?.value;
    try{
     // This is a draft only; saved PLC program and native runtime are unchanged.
     const sample=Examples.build(id,limits());
     active.draft=sample;active.history.push(sample);render();
     editor.toast?.('Örnek taslağa alındı. Kendi PLC programın için Kaydet.');
    }catch(error){editor.toast?.(error.message||'Örnek yüklenemedi')}
    return;
   }
   if(type==='add-rung'){if(active.draft.rungs.length>=32)return;
    const used=new Set(active.draft.rungs.map(x=>x.id));let n=1;while(used.has('R'+n))n++;
    active.draft.rungs.push({id:'R'+n,paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}});}
   else if(type==='remove-rung'){if(active.draft.rungs.length>1){const id=active.draft.rungs[r]?.id;active.draft.rungs.splice(r,1);closedNetworks.delete(id);if(focusedNetwork===id)focusedNetwork=null;}}
   else if(type==='add-path'){if(active.draft.rungs[r].paths.length<8)active.draft.rungs[r].paths.push([{type:'NO',ref:'I1'}]);}
   else if(type==='remove-path'){if(active.draft.rungs[r].paths.length>1)active.draft.rungs[r].paths.splice(p,1);}
   else if(type==='add-contact'){const path=active.draft.rungs[r].paths[p];if(path.length<12)path.push({type:'NO',ref:'I1'});}
   else if(type==='remove-contact'){const path=active.draft.rungs[r].paths[p];if(path.length>1)path.splice(c,1);}
   active.history.push(active.draft);render();
  }
  function activateDiagramTarget(element){
   const node=element?.closest?.('[data-ladder-contact],[data-ladder-coil]');
   if(!node||!overlay.contains(node))return false;
   let target=null;
   const encoded=node.dataset.ladderContact;
   if(encoded){
    const [r,p,c]=encoded.split(':').map(Number);
    target=overlay.querySelector('select[data-field="contact-ref"][data-r="'+r+'"][data-p="'+p+'"][data-c="'+c+'"]');
   }else{
    target=overlay.querySelector('select[data-field="coil-ref"][data-r="'+Number(node.dataset.ladderCoil)+'"]');
   }
   if(target){target.focus();return true}
   return false;
  }
  overlay.addEventListener('click',e=>{
   const structure=e.target.closest?.('[data-fbd-structure]');
   if(structure&&overlay.contains(structure)){
    if(diagramMode!=='fbd'||!active)return;
    const result=FBDView.editStructure(active.draft,structure.dataset.fbdStructure,structure.dataset.fbdPosition,limits());
    if(!result.ok){editor.toast?.(result.error);return}
    active.draft=result.program;active.history.push(active.draft);render();return;
   }
   const polarity=e.target.closest?.('[data-fbd-toggle-contact]');
   if(polarity&&overlay.contains(polarity)){
    // The FBD view edits the same draft as LAD; the saved program is never updated by a click.
    if(diagramMode!=='fbd'||!active)return;
    const result=FBDView.toggleContact(active.draft,polarity.dataset.fbdToggleContact,limits());
    if(!result.ok){editor.toast?.(result.error);return}
    active.draft=result.program;
    active.history.push(active.draft);
    render();return;
   }
   if(activateDiagramTarget(e.target))return;
   const tile=e.target.closest?.('[data-tool-id]');
   if(tile&&overlay.contains(tile)){
    selectedTool=selectedTool===tile.dataset.toolId?null:tile.dataset.toolId;render();return;
   }
   const zone=e.target.closest?.('[data-drop-kind]');
   if(zone&&overlay.contains(zone)&&selectedTool&&diagramMode==='ladder'){addFromPalette(selectedTool,zone);return}
   if(e.target===overlay){close();return}
   const b=e.target.closest('[data-action]');if(b&&overlay.contains(b))action(b);
  });
  overlay.addEventListener('dragstart',e=>{
   const tile=e.target.closest?.('[data-tool-id]');
   if(!tile||!active||diagramMode!=='ladder'||editor.running||!e.dataTransfer)return;
   if(!Toolbox.byId(tile.dataset.toolId))return;
   e.dataTransfer.effectAllowed='copy';
   e.dataTransfer.setData('text/plain','DTS-LAD:'+tile.dataset.toolId);
  });
  overlay.addEventListener('dragover',e=>{
   const zone=e.target.closest?.('[data-drop-kind]');
   if(!zone||!active||editor.running||diagramMode!=='ladder'||zone.disabled)return;
   if(!Array.from(e.dataTransfer?.types||[]).includes('text/plain'))return;
   e.preventDefault();e.dataTransfer.dropEffect='copy';zone.classList.add('dts-ladder-drop-hover');
  });
  overlay.addEventListener('dragleave',e=>e.target.closest?.('[data-drop-kind]')?.classList.remove('dts-ladder-drop-hover'));
  overlay.addEventListener('drop',e=>{
   const zone=e.target.closest?.('[data-drop-kind]');
   if(!zone||diagramMode!=='ladder'||zone.disabled)return;
   e.preventDefault();zone.classList.remove('dts-ladder-drop-hover');
   const data=e.dataTransfer?.getData('text/plain')||'';
   if(data.startsWith('DTS-LAD:'))addFromPalette(data.slice(8),zone);
  });
  overlay.addEventListener('change',async e=>{
   if(e.target.id==='dtsLadderImport'){
    const file=e.target.files?.[0],target=active,originalProject=editor.getProject();
    if(file&&target){
     try{
      if(file.size>ProgramIO.maxBytes)throw Error('Ladder program dosyası 512 KB sınırını aşıyor.');
      // Snapshot limits before asynchronous file reading; never read a newly selected PLC's limits.
      const originalLimits={inputCount:target.inputs.length,outputCount:target.outputs.length};
      const raw=await file.text();
      if(!importContextMatches(target,active,originalProject,editor.getProject(),!overlay.hidden)){
       editor.toast?.('İçe aktarma iptal: PLC veya proje değişti. Program değiştirilmedi.');
      }else{
       const draft=ProgramIO.parse(raw,originalLimits);
       target.draft=draft;target.history.push(draft);render();
       editor.toast?.('Ladder dosyası taslağa alındı. PLC programını değiştirmek için Kaydet.');
      }
     }catch(ex){editor.toast?.(ex.message)}
    }
    e.target.value='';return;
   }
   if(e.target.id==='dtsLadderTarget'){open(e.target.value);return}
   const {field,r,p,c,fbdCoilField}=e.target.dataset;
   if(fbdCoilField){
    if(diagramMode!=='fbd'||!active)return;
    const nextValue=['presetMs','preset'].includes(fbdCoilField)?
      (e.target.value.trim()===''?NaN:Number(e.target.value)):e.target.value;
    const result=FBDView.editCoil(active.draft,Number(r),{[fbdCoilField]:nextValue},limits());
    if(!result.ok){editor.toast?.(result.error);render();return}
    active.draft=result.program;active.history.push(active.draft);render();return;
   }
   if(!field||!active)return;
   const rung=active.draft.rungs[Number(r)];
   if(field==='rung-comment')rung.comment=String(e.target.value||'').slice(0,100);
   else if(field==='contact-type'||field==='contact-ref'){
    const contact=rung.paths[Number(p)][Number(c)];
    contact[field==='contact-type'?'type':'ref']=e.target.value;
   }else if(field==='coil-type'){
    rung.coil.type=e.target.value;
    rung.coil.ref=refOptions(true,rung.coil.type)[0]?.value||'Q1';
    if(['TON','TOF','TP'].includes(rung.coil.type))rung.coil.presetMs=1000;
    if(['CTU','CTD'].includes(rung.coil.type))rung.coil.preset=1;
   }else if(field==='coil-ref')rung.coil.ref=e.target.value;
   else if(field==='presetMs'||field==='preset')rung.coil[field]=Number(e.target.value);
   active.history.push(active.draft);render();
  });
  overlay.addEventListener('keydown',e=>{
   if((e.key==='Enter'||e.key===' ')&&e.target.closest?.('[data-ladder-contact],[data-ladder-coil]')){
    if(activateDiagramTarget(e.target))e.preventDefault();
    e.stopPropagation();return;
   }
   if(e.key==='Tab'){trapModalTab(e,overlay.querySelector('.dts-ladder-dialog'),doc);e.stopPropagation();return}
   const key=String(e.key).toLowerCase(),modifier=(e.ctrlKey||e.metaKey)&&!e.altKey;
   const editing=/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||'');
   if(modifier&&!editing&&(key==='z'||key==='y')){
    const redo=key==='y'||(key==='z'&&e.shiftKey);
    const next=redo?active?.history.redo():active?.history.undo();
    if(next){active.draft=next;render()}
    e.preventDefault();e.stopPropagation();return;
   }
   if(e.key==='Escape'){e.preventDefault();close()}
   e.stopPropagation();
  });
  overlay.addEventListener('pointerdown',e=>e.stopPropagation());
  btn.addEventListener('click',()=>open());
  // Double-click a PLC body to access its program; leave normal click/drag behavior alone.
  doc.getElementById('scene')?.addEventListener('dblclick',e=>{
   const id=e.target.closest?.('[data-id]')?.dataset?.id;
   if(id&&available().some(c=>c.id===id)){e.preventDefault();open(id)}
  });
  root.DTSLadderEditor=Object.freeze({open,close,save,supported:()=>available().length});
  return true;
 }
 const api={init,supported,starter,stateFor,monitorRows,signalText,createDraftHistory,createDraftSessions,focusKey,trapModalTab,canStartLadder,importContextMatches,coilSelectOptions};
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root?.document)root.DTSLadderEditorBootstrap=api,init(root.document,root.DTSEditor);
})(typeof window==='undefined'?globalThis:window);
