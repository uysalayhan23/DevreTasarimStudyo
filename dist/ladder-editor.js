(function(root){
 'use strict';
 // Original DTS Ladder editor. Only edits the user's virtual PLC program; never imports Siemens code.
 const L=root?.DTSLadderRuntime;
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clone=x=>JSON.parse(JSON.stringify(x));
 const pins=(d,t)=>(d?.pins||[]).filter(p=>p.signalType===t);
 const supported=(editor)=>editor?.getProject?.()?.components?.filter(c=>L?.supportedPLC?.(editor.byId?.[c.typeId])&&pins(editor.byId[c.typeId],'DI').length&&pins(editor.byId[c.typeId],'DO').length)||[];
 const starter=()=>({version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'Q1'},{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}}
 ]});
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
  let active=null,monitorTimer=null;
  const available=()=>supported(editor);
  const limits=()=>({inputCount:active?.inputs.length||0,outputCount:active?.outputs.length||0});
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
   if(['TON','TOF','TP'].includes(type))return asOptions(c.filter(x=>/^T/.test(x.ref)));
   if(['CTU','CTD'].includes(type))return asOptions(c.filter(x=>/^C/.test(x.ref)));
   return asOptions(c.filter(x=>/^[QM]/.test(x.ref)));
  };
  function render(){
   if(!active)return;
   const cp=available(),valid=L.validate(active.draft,limits());
   const selectPLC=select(active.c.id,cp.map(c=>({value:c.id,label:c.label||editor.byId[c.typeId]?.name||c.typeId})), 'id="dtsLadderTarget" aria-label="PLC seç"');
   overlay.innerHTML='<section class="dts-ladder-dialog" role="dialog" aria-modal="true" aria-label="PLC Ladder programla" tabindex="-1">'+
    '<header class="dts-ladder-header"><div><strong>PLC Ladder · DTS</strong><small>Özgün sanal Ladder · Gerçek LOGO! dosyası değildir</small></div>'+
    '<button type="button" data-action="close" aria-label="Kapat">×</button></header>'+
    '<div class="dts-ladder-toolbar"><label>PLC '+selectPLC+'</label>'+
    '<button type="button" data-action="add-rung">+ Rung</button>'+
    '<button type="button" data-action="starter">Start / Stop örneği</button>'+
    '<button type="button" data-action="save" class="dts-ladder-primary">Programı kaydet</button></div>'+
    '<div class="dts-ladder-hint">Sanal girişler I1, I2… · Sanal çıkışlar Q1, Q2… · M bellek, T zamanlayıcı, C sayaç. Kontaklar seri AND, paralel yollar OR çalışır. Gerçek tesisat güvenlik denetimi değildir.</div>'+
    '<main class="dts-ladder-rungs">'+active.draft.rungs.map((r,ri)=>{
      const monitored=active.c._dtsLadderTraces?.find(t=>t.id===r.id);
      return '<article class="dts-ladder-rung '+(monitored?.active?'active':'')+'"><div class="dts-ladder-rung-title"><strong>'+escape(r.id)+'</strong><span>'+(monitored?'Simülasyon: '+(monitored.active?'AKTİF':'Pasif'):'')+'</span><button type="button" data-action="remove-rung" data-r="'+ri+'" '+(active.draft.rungs.length===1?'disabled':'')+'>Satırı sil</button></div>'+
       '<div class="dts-ladder-branches">'+r.paths.map((path,pi)=>'<div class="dts-ladder-path"><span class="dts-path-label">'+(pi?'VEYA':'EĞER')+'</span>'+
        path.map((contact,ci)=>'<div class="dts-ladder-contact"><span>—[ '+(contact.type==='NC'?'/':'')+' ]—</span>'+
        select(contact.type,[{value:'NO',label:'NO'},{value:'NC',label:'NC'}],'data-field="contact-type" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'"')+
        select(contact.ref,asOptions(choices()),'data-field="contact-ref" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'"')+
        '<button type="button" data-action="remove-contact" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'" '+(path.length===1?'disabled':'')+' aria-label="Kontağı sil">×</button></div>').join('')+
        '<button type="button" data-action="add-contact" data-r="'+ri+'" data-p="'+pi+'" '+(path.length>=12?'disabled':'')+'>+ Seri</button>'+
        (pi?'<button type="button" data-action="remove-path" data-r="'+ri+'" data-p="'+pi+'">Yolu sil</button>':'')+
        '</div>').join('')+
       '<button type="button" data-action="add-path" data-r="'+ri+'" '+(r.paths.length>=8?'disabled':'')+'>+ Paralel yol</button></div>'+
       '<div class="dts-ladder-coil"><span>SONUÇ →</span>'+
       select(r.coil.type,['OUT','SET','RESET','TON','TOF','TP','CTU','CTD'].map(v=>({value:v,label:v})),'data-field="coil-type" data-r="'+ri+'"')+
       select(r.coil.ref,refOptions(true,r.coil.type),'data-field="coil-ref" data-r="'+ri+'"')+
       (['TON','TOF','TP'].includes(r.coil.type)?'<label>Süre (ms) <input type="number" min="1" max="600000" value="'+escape(r.coil.presetMs||1000)+'" data-field="presetMs" data-r="'+ri+'"></label>':'')+
       (['CTU','CTD'].includes(r.coil.type)?'<label>Hedef <input type="number" min="1" max="65535" value="'+escape(r.coil.preset||1)+'" data-field="preset" data-r="'+ri+'"></label>':'')+
       (monitored?'<strong class="dts-ladder-signal">'+(monitored.value?'1':'0')+'</strong>':'')+
       '</div></article>';
     }).join('')+'</main>'+
     '<footer class="dts-ladder-footer"><span id="dtsLadderValidation" role="status">'+(valid.ok?'Program kontrolü: uygun.':escape(valid.error))+'</span><button type="button" data-action="close">Kapat</button></footer>'+
     '</section>';
  }
  function close(){overlay.hidden=true;active=null;if(monitorTimer){root.clearInterval(monitorTimer);monitorTimer=null}btn.focus();}
  function open(which){
   const items=available();
   if(!items.length){editor.toast?.('Şu an yalnız native testi doğrulanmış Siemens CPU 1211C DC/DC/DC için Ladder açılabilir.');return false}
   const target=items.find(c=>c.id===which)||items[0];
   active=stateFor(target,editor);
   overlay.hidden=false;render();overlay.querySelector('.dts-ladder-dialog')?.focus();
   if(!monitorTimer)monitorTimer=root.setInterval(()=>{if(!overlay.hidden&&editor.running){const traces=active?.c._dtsLadderTraces||[];for(const el of overlay.querySelectorAll('.dts-ladder-rung')){const i=Array.from(el.parentNode.children).indexOf(el);el.classList.toggle('active',!!traces[i]?.active)}}},300);
   return true;
  }
  function save(){
   if(!active)return false;
   if(editor.running){editor.toast?.('Ladder programını değiştirmek için simülasyonu durdurun.');return false}
   const valid=L.validate(active.draft,limits());
   if(!valid.ok){editor.toast?.('Ladder: '+valid.error);return false}
   if(!editor.guardEdit?.()||!editor.snapshot?.())return false;
   active.c.ladderProgram=clone(active.draft);active.c.plcProgram='dts-ladder-v1';
   editor.render?.();editor.scheduleSave?.();root.DTSStudio?.markDirty?.();
   editor.toast?.('PLC Ladder programı kaydedildi · Projeyi de kaydetmeyi unutmayın.');
   close();return true;
  }
  function action(button){
   if(!active)return;
   const type=button.dataset.action,r=Number(button.dataset.r),p=Number(button.dataset.p),c=Number(button.dataset.c);
   if(type==='close'){close();return}
   if(type==='save'){save();return}
   if(type==='starter'){active.draft=starter();render();return}
   if(type==='add-rung'){if(active.draft.rungs.length>=32)return;
    const used=new Set(active.draft.rungs.map(x=>x.id));let n=1;while(used.has('R'+n))n++;
    active.draft.rungs.push({id:'R'+n,paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}});}
   else if(type==='remove-rung'){if(active.draft.rungs.length>1)active.draft.rungs.splice(r,1);}
   else if(type==='add-path'){if(active.draft.rungs[r].paths.length<8)active.draft.rungs[r].paths.push([{type:'NO',ref:'I1'}]);}
   else if(type==='remove-path'){if(active.draft.rungs[r].paths.length>1)active.draft.rungs[r].paths.splice(p,1);}
   else if(type==='add-contact'){const path=active.draft.rungs[r].paths[p];if(path.length<12)path.push({type:'NO',ref:'I1'});}
   else if(type==='remove-contact'){const path=active.draft.rungs[r].paths[p];if(path.length>1)path.splice(c,1);}
   render();
  }
  overlay.addEventListener('click',e=>{
   if(e.target===overlay){close();return}
   const b=e.target.closest('[data-action]');if(b&&overlay.contains(b))action(b);
  });
  overlay.addEventListener('change',e=>{
   if(e.target.id==='dtsLadderTarget'){open(e.target.value);return}
   const {field,r,p,c}=e.target.dataset;if(!field||!active)return;
   const rung=active.draft.rungs[Number(r)];
   if(field==='contact-type'||field==='contact-ref'){
    const contact=rung.paths[Number(p)][Number(c)];
    contact[field==='contact-type'?'type':'ref']=e.target.value;
   }else if(field==='coil-type'){
    rung.coil.type=e.target.value;
    rung.coil.ref=refOptions(true,rung.coil.type)[0]?.value||'Q1';
    if(['TON','TOF','TP'].includes(rung.coil.type))rung.coil.presetMs=1000;
    if(['CTU','CTD'].includes(rung.coil.type))rung.coil.preset=1;
   }else if(field==='coil-ref')rung.coil.ref=e.target.value;
   else if(field==='presetMs'||field==='preset')rung.coil[field]=Number(e.target.value);
   render();
  });
  overlay.addEventListener('keydown',e=>{
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
 const api={init,supported,starter,stateFor};
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root?.document)root.DTSLadderEditorBootstrap=api,init(root.document,root.DTSEditor);
})(typeof window==='undefined'?globalThis:window);
