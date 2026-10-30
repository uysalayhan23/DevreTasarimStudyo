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
 const TimerGuide=typeof module==='object'&&module.exports?require('./ladder-timer-guide.js'):root?.DTSLadderTimerGuide;
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // LAD and FBD use exactly the same allowed native output addresses.
 function coilSelectOptions(type,limits={},candidates=[]){
  const names=FBDView.refsFor(type,limits);
  const labels=new Map(candidates.map(c=>[c.ref,c.label]));
  return names.map(ref=>({value:ref,label:labels.get(ref)||ref}));
 }
 // Route LAD coil type changes through the native-validated FBD type editor.
 // Both views operate on one Ladder V1 draft, with shared address ownership rules.
 function changeCoilType(program,index,type,limits={}) {
  return FBDView.editCoil(program,index,{type},limits);
 }
 // Remove a timer/counter into an address-free NOP, never an accidentally active Q/M OUT.
 function removeFunctionBlock(program,index,limits={}){
  if(!Number.isInteger(index)||index<0||!['TON','TOF','TP','CTU','CTD'].includes(program?.rungs?.[index]?.coil?.type))
   return {ok:false,error:'Kaldırılacak zamanlayıcı veya sayaç bulunamadı.'};
  return FBDView.editCoil(program,index,{type:'NOP'},limits);
 }
 // Removal never substitutes a potentially energized OUT Q/M for any coil.
 function removeOutput(program,index,limits={}){
  if(!Number.isInteger(index)||index<0||!program?.rungs?.[index]||program.rungs[index].coil.type==='NOP')
   return {ok:false,error:'Kaldırılacak çıkış bulunamadı.'};
  return FBDView.editCoil(program,index,{type:'NOP'},limits);
 }
 // Removing the final contact leaves a safe, OPEN path, not a true empty AND.
 function removeContact(program,r,p,c,limits={}){
  if(![r,p,c].every(Number.isSafeInteger)||r<0||p<0||c<0)
   return {ok:false,error:'Kontak konumu geçersiz.'};
  const valid=L.validate(program,limits);
  if(!valid.ok)return {ok:false,error:valid.error};
  const path=program.rungs[r]?.paths?.[p];
  if(!path||c>=path.length)return {ok:false,error:'Silinecek kontak bulunamadı.'};
  const next=clone(program);next.rungs[r].paths[p].splice(c,1);
  const check=L.validate(next,limits);
  return check.ok?{ok:true,program:next}:{ok:false,error:check.error};
 }
 // Expose every valid native M/T/C contact in both LAD and FBD.
 function contactChoices(inputPins=[],outputPins=[]){
  return [
   ...inputPins.map((p,i)=>({ref:'I'+(i+1),label:'I'+(i+1)+' · '+p.id})),
   ...outputPins.map((p,i)=>({ref:'Q'+(i+1),label:'Q'+(i+1)+' · '+p.id})),
   ...Array.from({length:32},(_,i)=>({ref:'M'+(i+1),label:'M'+(i+1)+' · Bellek'})),
   ...Array.from({length:16},(_,i)=>({ref:'T'+(i+1),label:'T'+(i+1)+' · Zamanlayıcı'})),
   ...Array.from({length:16},(_,i)=>({ref:'C'+(i+1),label:'C'+(i+1)+' · Sayaç'}))
  ];
 }
 const clone=x=>JSON.parse(JSON.stringify(x));
 // Dataset positions are decimal strings. Number('') would target Network 0
 // when a missing/malformed drop zone should be rejected without any edit.
 const parseUiIndex=value=>typeof value==='string'&&/^(?:0|[1-9][0-9]*)$/.test(value)&&
  Number.isSafeInteger(Number(value))?Number(value):NaN;
 // New LAD rungs and OR paths must not energize an output by themselves.
 function addSafeRung(program,limits={}){
  const initial=L?.validate?.(program,limits);
  if(!initial?.ok)return {ok:false,error:initial?.error||'Ladder programı geçersiz.'};
  if(program.rungs.length>=32)return {ok:false,error:'En fazla 32 Network.'};
  const draft=clone(program),used=new Set(draft.rungs.map(r=>r.id));
  let n=1;while(used.has('R'+n))n++;
  draft.rungs.push({id:'R'+n,paths:[[]],coil:{type:'NOP',ref:''}});
  const checked=L.validate(draft,limits);
  return checked.ok?{ok:true,program:draft}:{ok:false,error:checked.error};
 }
 // The + Seri button must use the same hardware-aware default as drag/drop.
 function addSafeContact(program,r,p,limits={}){
  return Toolbox.apply(program,'NO',{r,p,kind:'contact'},limits);
 }
 // Every LAD field edit is transactional: invalid addresses or numeric inputs
 // must not poison the draft, its Undo history, or the next saved PLC program.
 function editLadderField(program,field,r,p,c,value,limits={}){
  const initial=L?.validate?.(program,limits);
  if(!initial?.ok)return {ok:false,error:initial?.error||'Ladder taslağı geçersiz.'};
  if(!Number.isSafeInteger(r)||r<0||r>=program.rungs.length)
   return {ok:false,error:'Network konumu geçersiz.'};
  if(field==='coil-type')return changeCoilType(program,r,value,limits);
  const draft=clone(program),rung=draft.rungs[r];
  if(field==='rung-comment')rung.comment=String(value??'').slice(0,100);
  else if(field==='contact-type'||field==='contact-ref'){
   if(!Number.isSafeInteger(p)||!Number.isSafeInteger(c)||p<0||c<0||!rung.paths[p]?.[c])
    return {ok:false,error:'Kontak konumu geçersiz.'};
   rung.paths[p][c][field==='contact-type'?'type':'ref']=value;
  }else if(field==='coil-ref')rung.coil.ref=value;
  else if(field==='presetMs'||field==='preset'){
   if(!/^[1-9][0-9]*$/.test(String(value))||!Number.isSafeInteger(Number(value)))
    return {ok:false,error:'Süre/hedef pozitif tam sayı olmalıdır.'};
   rung.coil[field]=Number(value);
  }else return {ok:false,error:'Bilinmeyen Ladder alanı.'};
  const valid=L.validate(draft,limits);
  return valid.ok?{ok:true,program:draft}:{ok:false,error:valid.error};
 }
 function addSafeParallelPath(program,index,limits={}){
  if(!Number.isSafeInteger(index)||index<0||!program?.rungs?.[index]?.paths)
   return {ok:false,error:'Paralel eklenecek Network bulunamadı.'};
  const p=program.rungs[index].paths;
  return FBDView.editStructure(program,'add-path',index+':'+(p.length-1),limits);
 }

 // Network copy/move keeps the saved PLC unchanged until explicit Save.
 function editNetworkOrder(program,action,index,limits={}){
  const check=L.validate(program,limits);
  if(!check.ok)return {ok:false,error:check.error};
  const rows=program.rungs;
  if(!Number.isSafeInteger(index)||index<0||index>=rows.length)return {ok:false,error:'Network bulunamadı.'};
  if(!['copy','up','down'].includes(action))return {ok:false,error:'Network işlemi geçersiz.'};
  if(action==='copy'&&rows.length>=32)return {ok:false,error:'En fazla 32 Network.'};
  if(action==='up'&&index===0||action==='down'&&index===rows.length-1)return {ok:false,error:'Network sınırda.'};
  const draft=clone(program);
  if(action==='copy'){
   const used=new Set(draft.rungs.map(r=>r.id));
   let n=1;while(used.has('R'+n))n++;
   const copied=clone(draft.rungs[index]);copied.id='R'+n;
   // A copied Q/M writer must not silently acquire the original output address.
   // Keep its contacts, but require an explicit output assignment before energizing it.
   if(copied.coil.type!=='NOP')copied.coil={type:'NOP',ref:''};
   draft.rungs.splice(index+1,0,copied);
  }else{
   const target=index+(action==='up'?-1:1);
   [draft.rungs[index],draft.rungs[target]]=[draft.rungs[target],draft.rungs[index]];
  }
  const valid=L.validate(draft,limits);
  return valid.ok?{ok:true,program:draft}:{ok:false,error:valid.error};
 }
 // Structural deletions are transactional; a malformed UI index must not
 // delete Network 0 via Array.splice(NaN,1) or crash on a missing path.
 function removeNetwork(program,index,limits={}){
  const check=L.validate(program,limits);
  if(!check.ok)return {ok:false,error:check.error};
  if(!Number.isSafeInteger(index)||index<0||index>=program.rungs.length)
   return {ok:false,error:'Network konumu geçersiz.'};
  if(program.rungs.length<=1)return {ok:false,error:'Son Network silinemez.'};
  const draft=clone(program),removed=draft.rungs.splice(index,1)[0];
  const valid=L.validate(draft,limits);
  return valid.ok?{ok:true,program:draft,removedId:removed.id}:{ok:false,error:valid.error};
 }
 function removeParallelPath(program,r,p,limits={}){
  const check=L.validate(program,limits);
  if(!check.ok)return {ok:false,error:check.error};
  if(!Number.isSafeInteger(r)||r<0||r>=program.rungs.length||
   !Number.isSafeInteger(p)||p<0||p>=program.rungs[r].paths.length)
   return {ok:false,error:'Paralel yol konumu geçersiz.'};
  if(program.rungs[r].paths.length<=1)return {ok:false,error:'Son paralel yol silinemez.'};
  const draft=clone(program);draft.rungs[r].paths.splice(p,1);
  const valid=L.validate(draft,limits);
  return valid.ok?{ok:true,program:draft}:{ok:false,error:valid.error};
 }
 // Undo/Redo is local to the Ladder draft; it never modifies the saved circuit.
 function createDraftHistory(initial,maxSteps=50){
  let steps=[clone(initial)],index=0,revision=0;
  const limit=Math.max(2,Math.min(100,Number.isInteger(maxSteps)?maxSteps:50));
  const current=()=>clone(steps[index]);
  return Object.freeze({
   current,
   push(next){
    if(JSON.stringify(next)===JSON.stringify(steps[index]))return false;
    steps=steps.slice(0,index+1);
    steps.push(clone(next));
    if(steps.length>limit)steps.shift();
    index=steps.length-1;revision++;
    return true;
   },
   undo(){if(index===0)return null;index--;revision++;return current()},
   redo(){if(index>=steps.length-1)return null;index++;revision++;return current()},
   revision:()=>revision,
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
 function importContextMatches(source,latest,projectAtStart,currentProject,dialogVisible,requestId=null,currentRequestId=null,draftSnapshot=null,currentDraft=null,savedSnapshot=null,currentSaved=null,historyRevision=null,currentHistoryRevision=null){
  const matches=!!source&&source===latest&&!!projectAtStart&&projectAtStart===currentProject&&!!dialogVisible&&
   (requestId===null||(Number.isSafeInteger(requestId)&&requestId===currentRequestId));
  // Do not overwrite contacts or outputs changed while the selected file was reading.
  return matches&&(draftSnapshot===null||JSON.stringify(currentDraft)===draftSnapshot)&&
   (savedSnapshot===null||JSON.stringify(currentSaved)===savedSnapshot)&&
   (historyRevision===null||(Number.isSafeInteger(historyRevision)&&historyRevision===currentHistoryRevision));
 }
 // A malformed catalog pin list must not break the Ladder launch button.
 const pins=(d,t)=>(Array.isArray(d?.pins)?d.pins:[]).filter(p=>p&&typeof p.id==='string'&&p.id.length>0&&p.signalType===t);
 const supported=(editor)=>editor?.getProject?.()?.components?.filter(c=>L?.supportedPLC?.(editor.byId?.[c.typeId])&&pins(editor.byId[c.typeId],'DI').length&&pins(editor.byId[c.typeId],'DO').length)||[];
 const starter=()=>({version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'Q1'},{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}}
 ]});
 // Only saved, currently running programs may display live signals.
 function monitorRows(draft,saved,traces,running,mode,powered,scanError=null,runtimeMode='dts-ladder-v1'){
  const rows=Array.isArray(draft?.rungs)?draft.rungs:[];
  const failed=typeof scanError==='string'&&scanError.trim().length>0;
  const live=!!running&&!failed&&powered===true&&mode==='dts-ladder-v1'&&runtimeMode==='dts-ladder-v1'&&JSON.stringify(draft)===JSON.stringify(saved);
  // Never replay a partial, reordered or malformed scan as current Network telemetry.
  const traceReady=live&&Array.isArray(traces)&&traces.length===rows.length&&
   traces.every((t,i)=>t&&t.id===rows[i].id&&(t.coil==null||t.coil===rows[i].coil.ref)&&
    typeof t.active==='boolean'&&typeof t.value==='boolean'&&
    Array.isArray(rows[i].paths)&&Array.isArray(t.pathStates)&&t.pathStates.length===rows[i].paths.length&&
    t.pathStates.every((v,j)=>typeof v==='boolean'&&Array.isArray(rows[i].paths[j])&&(rows[i].paths[j].length>0||v===false))&&
    t.active===t.pathStates.some(Boolean)&&
    (rows[i].coil?.type!=='OUT'||t.value===t.active)&&
    (rows[i].coil?.type!=='NOP'||t.value===false));
  const byId=new Map((traceReady?traces:[]).map(t=>[t.id,t]));
  return rows.map(r=>{
   const t=live?byId.get(r.id):null;
   return {active:t?.active===true,value:t?t.value:null,count:['CTU','CTD'].includes(r.coil.type)&&Number.isInteger(t?.count)&&t.count>=0?t.count:null,
    type:r.coil.type,preset:['CTU','CTD'].includes(r.coil.type)?r.coil.preset:null,
    presetMs:['TON','TOF','TP'].includes(r.coil.type)?r.coil.presetMs:null,
    elapsedMs:Number.isFinite(t?.elapsedMs)&&t.elapsedMs>=0?t.elapsedMs:null,
    pathStates:Array.isArray(t?.pathStates)&&t.pathStates.length===r.paths.length&&
      t.pathStates.every(v=>typeof v==='boolean')?t.pathStates.slice():null,
    status:!running?'Simülasyon kapalı':failed?'PLC taraması başarısız':powered!==true?'PLC beslemesi yok':!live?'Taslak izlenmiyor · kayıtlı program farklı':!t?'Sinyal bekleniyor':t.active?'AKTİF':'Pasif'};
  });
 }
 // Stable control identities let rerenders keep keyboard focus on the same Ladder field.
 function focusKey(el){
  if(!el)return '';
  if(el.id)return 'id:'+el.id;
  const d=el.dataset||{};
  // Selecting a LAD palette button rerenders the toolbox. Preserve its
  // keyboard focus so the next tool can be selected without restarting Tab.
  if(d.toolId)return 'tool:'+d.toolId;
  if(d.fbdStructure&&d.fbdPosition)return 'fbd-structure:'+d.fbdStructure+':'+d.fbdPosition;
  if(d.fbdToggleContact)return 'fbd-toggle:'+d.fbdToggleContact;
  if(d.fbdContactRef)return 'fbd-ref:'+d.fbdContactRef;
   if(d.fbdCoilField)return 'fbd-coil:'+d.fbdCoilField+':'+(d.r??'');
  const kind=d.field?'field:'+d.field:d.action?'action:'+d.action:'';
  // The numeric rung position changes after ↑/↓, but its native ID remains
  // stable. Never move keyboard focus to a different Network after reordering.
  return kind?kind+':'+(d.rungId??d.r??'')+':'+(d.p??'')+':'+(d.c??''):'';
 }
 // Re-rendering an FBD structure replaces the triggering DOM node. Restore
 // focus to the newly inserted contact, the surviving branch, or a stable
 // Network control; never guess the identity of a deleted parallel path.
 function fbdStructureNextFocus(program,action,position){
  if(!program||typeof position!=='string'||!['add-path','remove-path','add-contact','add-contact-before','remove-contact'].includes(action))return '';
  const parts=position.split(':');
  if(parts.length!==(action.endsWith('path')?2:3)||parts.some(v=>!/^(?:0|[1-9][0-9]*)$/.test(v)))return '';
  const [r,p,c]=parts.map(Number);
  if(![r,p,...(parts.length===3?[c]:[])].every(Number.isSafeInteger))return '';
  const rung=program.rungs?.[r],paths=rung?.paths;
  if(!paths)return '';
  // The deleted path can be the last one: it no longer exists in the result.
  if(action==='remove-path')return 'action:focus-network:'+rung.id+'::';
  if(!paths[p])return '';
  if(action==='add-path')return 'fbd-structure:add-contact:'+r+':'+(p+1)+':0';
  const path=paths[p];
  if(action==='remove-contact'){
   if(path.length===0)return 'fbd-structure:add-contact:'+r+':'+p+':0';
   return 'fbd-ref:'+r+':'+p+':'+Math.min(c,path.length-1);
  }
  const inserted=action==='add-contact'?path.length-1:c;
  return 'fbd-ref:'+r+':'+p+':'+inserted;
 }
 // LAD branch indices shift after removal. Restoring the original button
 // would focus a different physical branch; prefer the stable Network header.
 function ladStructureNextFocus(program,action,r,p,c){
  if(!['add-path','remove-path','add-contact','remove-contact'].includes(action)||
     !Number.isSafeInteger(r)||r<0)return '';
  const rung=program?.rungs?.[r],paths=rung?.paths;
  if(!paths)return '';
  if(action==='remove-path')return 'action:focus-network:'+rung.id+'::';
  if(action==='add-path')return 'action:add-contact:'+r+':'+(paths.length-1)+':';
  if(!Number.isSafeInteger(p)||p<0||!Array.isArray(paths[p]))return '';
  const series=paths[p];
  if(action==='add-contact')return 'field:contact-ref:'+r+':'+p+':'+(series.length-1);
  if(!Number.isSafeInteger(c)||c<0)return '';
  return series.length?'field:contact-ref:'+r+':'+p+':'+Math.min(c,series.length-1):
   'action:add-contact:'+r+':'+p+':';
 }
 // Keep keyboard navigation inside the dialog; disabled controls are never targets.
 function focusableControl(el){
  // A control inside a collapsed Network is hidden even if the input itself
  // has no hidden attribute. Do not move keyboard focus into that subtree.
  return !!el&&!el.disabled&&!el.hidden&&el.tabIndex>=0&&
   el.getAttribute?.('aria-hidden')!=='true'&&
   !el.closest?.('[hidden],[inert],[aria-hidden="true"]')&&typeof el.focus==='function';
 }
 function trapModalTab(e,dialog,doc){
  if(e.key!=='Tab'||!dialog)return false;
  const items=Array.from(dialog.querySelectorAll('button,select,input,[tabindex]')).filter(focusableControl);
  if(!items.length){e.preventDefault();dialog.focus();return true}
  const first=items[0],last=items[items.length-1],current=doc.activeElement;
  const outside=!dialog.contains(current)||current===dialog||!items.includes(current);
  if(outside||(e.shiftKey?current===first:current===last)){
   e.preventDefault();(e.shiftKey?last:first).focus();return true;
  }
  return false;
 }
 function signalText(row){
  if(row.value===null)return '—';
  const value=row.value?'1':'0';
  if(row.count!==null)return value+' · Sayaç '+row.count+
   (Number.isInteger(row.preset)?'/'+row.preset:'');
  if(['TON','TOF','TP'].includes(row.type)&&Number.isInteger(row.presetMs))
   return value+' · '+row.type+' '+
    (row.elapsedMs===null?'hazır':row.elapsedMs+'/'+row.presetMs+' ms');
  return value;
 }
 function stateFor(c,editor){
  const d=editor.byId[c.typeId],inputs=pins(d,'DI'),outputs=pins(d,'DO');
  const valid=L?.validate?.(c.ladderProgram,{inputCount:inputs.length,outputCount:outputs.length})?.ok===true;
  const hasSaved=c.plcProgram==='dts-ladder-v1'||c.ladderProgram!=null;
  // Invalid saved programs must not silently become an executable OUT Q1
  // starter. Use an electrically open, address-free NOP recovery draft instead.
  // A genuinely new PLC keeps the existing explicit starter workflow.
  const safeDraft=()=>({version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:''}}]});
  return {c,d,inputs,outputs,savedBaseline:JSON.stringify(c.ladderProgram??null),
   recoveryWarning:!valid&&hasSaved,
   draft:valid?clone(c.ladderProgram):hasSaved?safeDraft():L.blank()};
 }
 function canCommitDraft(active,editor){
  const project=editor?.getProject?.();
  return !!active?.c&&Array.isArray(project?.components)&&project.components.includes(active.c)&&
   supported(editor).includes(active.c)&&
   active.savedBaseline===JSON.stringify(active.c.ladderProgram??null);
 }
 function ladderShortcut(e,editing=false,running=false){
  if(e?.isComposing||e?.keyCode===229||!((e?.ctrlKey||e?.metaKey)&&!e?.altKey))return null;
  const key=String(e.key||'').toLowerCase();
  if(key==='s'&&!e.shiftKey)return editing?'pending-field':running?'locked':'save';
  if(key==='z'||key==='y'){
   if(editing)return null;
   if(running)return 'locked';
   return key==='y'||!!e.shiftKey?'redo':'undo';
  }
  return null;
 }
 // Match a diagram symbol with the visible LAD or FBD operand editor.
 function focusDiagramOperand(container,element,mode){
  const node=element?.closest?.('[data-ladder-contact],[data-ladder-coil]');
  if(!node||!container?.contains?.(node))return false;
  const contact=node.dataset?.ladderContact,coil=node.dataset?.ladderCoil;
  let selector='',fallback='';
  if(typeof contact==='string'){
   if(!/^(0|[1-9][0-9]*):(0|[1-9][0-9]*):(0|[1-9][0-9]*)$/.test(contact))return false;
   const [r,p,c]=contact.split(':').map(Number);
   if(![r,p,c].every(Number.isSafeInteger))return false;
   selector=mode==='fbd'?'select[data-fbd-contact-ref="'+contact+'"]':
    'select[data-field="contact-ref"][data-r="'+r+'"][data-p="'+p+'"][data-c="'+c+'"]';
  }else{
   if(typeof coil!=='string'||!/^(0|[1-9][0-9]*)$/.test(coil))return false;
   const r=Number(coil);if(!Number.isSafeInteger(r))return false;
   selector=mode==='fbd'?'select[data-fbd-coil-field="ref"][data-r="'+r+'"]':
    'select[data-field="coil-ref"][data-r="'+r+'"]';
   fallback=mode==='fbd'?'select[data-fbd-coil-field="type"][data-r="'+r+'"]':
    'select[data-field="coil-type"][data-r="'+r+'"]';
  }
  const target=container.querySelector(selector)||(fallback?container.querySelector(fallback):null);
  if(!target||target.disabled||typeof target.focus!=='function')return false;
  target.focus();return true;
 }
 function init(doc=root.document,editor=root.DTSEditor){
  const btn=doc?.getElementById?.('dtsLadderBtn');
  if(!btn||!L||!editor)return false;
  if(btn.dataset.ready)return true;
  btn.dataset.ready='1';
  const overlay=doc.createElement('div');
  overlay.id='dtsLadderOverlay';overlay.className='dts-ladder-overlay';overlay.hidden=true;
  overlay.setAttribute('role','presentation');doc.body.appendChild(overlay);
  let active=null,monitorTimer=null,returnFocus=null,diagramMode='ladder',selectedTool=null,focusedNetwork=null,importSerial=0;
  const closedNetworks=new Set();
  const sessions=createDraftSessions();
  const available=()=>supported(editor);
  const limits=()=>({inputCount:active?.inputs.length||0,outputCount:active?.outputs.length||0});
  const draw=(r,options)=>(diagramMode==='fbd'?FBDView:Diagram).render(r,options);
  function choices(){return active?contactChoices(active.inputs,active.outputs):[];}
  const select=(value,values,attrs)=>'<select '+attrs+'>'+values.map(o=>'<option value="'+escape(o.value)+'" '+(value===o.value?'selected':'')+'>'+escape(o.label)+'</option>').join('')+'</select>';
  const asOptions=arr=>arr.map(x=>({value:x.ref,label:x.label}));
  const refOptions=(forCoil,type)=>{
   const c=choices();
   if(!forCoil)return asOptions(c);
   return coilSelectOptions(type,limits(),c);
  };
  function render(preferredFocus=null){
   if(!active)return;
   // Undo, Redo or Network deletion may remove the focused ID. Avoid an
   // invisible workspace when no current rung matches the old single view.
   const networkIds=new Set(active.draft.rungs.map(r=>r.id));
   if(focusedNetwork&&!networkIds.has(focusedNetwork))focusedNetwork=null;
   for(const id of closedNetworks)if(!networkIds.has(id))closedNetworks.delete(id);
   const priorElement=overlay.contains(doc.activeElement)?doc.activeElement:null;
   const priorFocus=preferredFocus||focusKey(priorElement);
   const priorRungId=priorElement?.dataset?.rungId||null;
   const oldScroll=overlay.querySelector('.dts-ladder-rungs')?.scrollTop||0;
   const advancedOpen=overlay.querySelector('.dts-ladder-advanced')?.open===true;
   const cp=available(),valid=L.validate(active.draft,limits()),views=monitorRows(active.draft,active.c.ladderProgram,active.c._dtsLadderTraces,editor.running,active.c.plcProgram,active.c._plcRuntime?.powered,active.c._dtsLadderError,active.c._plcRuntime?.program);
   const live=!!editor.running&&active.c.plcProgram==='dts-ladder-v1'&&JSON.stringify(active.draft)===JSON.stringify(active.c.ladderProgram);
   const liveBits=live&&active.c._plcRuntime?.powered===true&&active.c._plcRuntime?.program==='dts-ladder-v1'&&!active.c._dtsLadderError?active.c._dtsLadderMemory?.values:null;
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
    '<details class="dts-ladder-advanced"><summary>Diğer araçlar</summary><div>'+ 
    '<label class="dts-ladder-examples">Örnek program '+exampleSelect+'</label>'+ 
    '<button type="button" data-action="load-example" '+(options.length?'':'disabled')+'>Örneği taslağa al</button>'+ 
    '<button type="button" data-action="export-program">Dışa aktar</button>'+ 
    '<button type="button" data-action="import-program">İçe aktar</button>'+ 
    '<input type="file" id="dtsLadderImport" accept=".dtsladder,.json" hidden></div></details>'+
    '<button type="button" data-action="save" class="dts-ladder-primary">Programı kaydet</button>'+ 
    '<button type="button" data-action="toggle-sim" '+(canRun?'':'disabled title="Önce Ladder programını kaydet ve devreyi doğrula"')+'>'+runAction+'</button>'+ 
    '<button type="button" data-action="live-watch" title="Proje sayfasındaki butonlar kullanılabilirken Ladder sinyallerini izle">◉ Projede izle</button></div>'+
    '<div class="dts-ladder-toolbox" role="group" aria-label="Ladder araç paleti" '+(diagramMode==='fbd'?'hidden':'')+'><strong>Komut paleti</strong><small>Kontak veya bloğu Network üzerine sürükleyin. Alternatif: paletten seçin, ekleme alanına tıklayın.</small><div class="dts-ladder-tool-list">'+
    Toolbox.tools.map(t=>'<button type="button" draggable="true" data-tool-id="'+t.id+'" aria-pressed="'+(selectedTool===t.id)+'" title="'+escape(t.label)+' sürükle veya seç"><span class="dts-tool-symbol">'+escape(t.symbol)+'</span><span>'+escape(t.label)+'</span></button>').join('')+
    '</div></div>'+ 
    '<div id="dtsLadderLivePanel" class="dts-ladder-live" aria-label="Sanal PLC durumları">'+Monitor.markup(Monitor.snapshot(active.c,active.d,editor.running,live))+'</div>'+ 
    (active.recoveryWarning?'<p class="dts-ladder-hint" role="alert">Kayıtlı Ladder programı geçersiz veya eksik. Güvenli BOŞ/NOP taslak açıldı; hiçbir çıkış otomatik atanmadı. Gerekirse programınızı elle düzenleyip açıkça kaydedin.</p>':'')+
    '<div class="dts-ladder-hint">Sanal girişler I1, I2… · Sanal çıkışlar Q1, Q2… · M bellek, T zamanlayıcı, C sayaç. Kontaklar seri AND, paralel yollar OR çalışır. Gerçek tesisat güvenlik denetimi değildir.</div>'+
    '<main class="dts-ladder-rungs"><div class="dts-ladder-networks-bar"><strong>'+active.draft.rungs.length+' Network · LAD</strong>'+(focusedNetwork?'<button type="button" data-action="all-networks">▣ Tüm Networkleri göster</button>':'<span>Her Network ayrı bir çalışma penceresidir.</span>')+'</div>'+active.draft.rungs.map((r,ri)=>{
      const monitored=views[ri];
      return '<article class="dts-ladder-rung '+(monitored?.active?'active':'')+'" '+(focusedNetwork&&focusedNetwork!==r.id?'hidden':'')+'><div class="dts-ladder-rung-title"><strong>Network '+(ri+1)+' · '+escape(r.id)+'</strong><input type="text" class="dts-ladder-comment-field" maxlength="100" placeholder="Network açıklaması…" aria-label="'+escape(r.id)+' açıklaması" data-field="rung-comment" data-r="'+ri+'" data-rung-id="'+escape(r.id)+'" value="'+escape(r.comment||'')+'"><span data-monitor="status">'+escape(monitored.status)+'</span><button type="button" data-action="toggle-network" data-r="'+ri+'" data-rung-id="'+escape(r.id)+'" aria-expanded="'+!closedNetworks.has(r.id)+'">'+(closedNetworks.has(r.id)?'▣ Aç':'▾ Daralt')+'</button><button type="button" data-action="focus-network" data-r="'+ri+'" data-rung-id="'+escape(r.id)+'">'+(focusedNetwork===r.id?'Tümüne dön':'⛶ Tek pencere')+'</button><button type="button" data-action="copy-rung" data-r="'+ri+'" data-rung-id="'+escape(r.id)+'" '+(active.draft.rungs.length>=32?'disabled':'')+'>Kopyala</button><button type="button" data-action="move-rung-up" data-r="'+ri+'" data-rung-id="'+escape(r.id)+'" '+(ri===0?'disabled':'')+'>↑</button><button type="button" data-action="move-rung-down" data-r="'+ri+'" data-rung-id="'+escape(r.id)+'" '+(ri===active.draft.rungs.length-1?'disabled':'')+'>↓</button><button type="button" data-action="remove-rung" data-r="'+ri+'" data-rung-id="'+escape(r.id)+'" '+(active.draft.rungs.length===1?'disabled':'')+'>Satırı sil</button></div><div class="dts-ladder-network-body" '+(closedNetworks.has(r.id)?'hidden':'')+'>'+
       '<div class="dts-ladder-diagram" data-drop-kind="network" data-r="'+ri+'" data-diagram="'+ri+'" title="Paletten öğeyi buraya bırakın">'+draw(r,{index:ri,live:!!liveBits&&Array.isArray(monitored.pathStates),values:liveBits,pathStates:monitored.pathStates,coilValue:monitored.value,limits:limits()})+'</div>'+ 
       '<div class="dts-ladder-branches">'+r.paths.map((path,pi)=>'<div class="dts-ladder-path"><span class="dts-path-label">'+(pi?'VEYA':'EĞER')+'</span>'+
        path.map((contact,ci)=>'<div class="dts-ladder-contact"><span>—[ '+(contact.type==='NC'?'/':'')+' ]—</span>'+
        select(contact.type,[{value:'NO',label:'NO'},{value:'NC',label:'NC'}],'data-field="contact-type" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'"')+
        select(contact.ref,asOptions(choices()),'data-field="contact-ref" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'"')+
        '<button type="button" data-action="remove-contact" data-r="'+ri+'" data-p="'+pi+'" data-c="'+ci+'" aria-label="Kontağı sil">×</button></div>').join('')+(path.length?'':'<span class="dts-ladder-empty-path">BOŞ KONTAK · devre açık. + Seri ile yeniden ekleyin.</span>')+
        '<button type="button" data-action="add-contact" data-r="'+ri+'" data-p="'+pi+'" '+(path.length>=12?'disabled':'')+'>+ Seri</button>'+
        '<button type="button" class="dts-ladder-dropzone" data-drop-kind="contact" data-r="'+ri+'" data-p="'+pi+'" data-i="'+path.length+'" '+(path.length>=12?'disabled':'')+' title="Bu seri kola kontak bırakın">⇣ Kontak bırak</button>'+
        (pi?'<button type="button" data-action="remove-path" data-r="'+ri+'" data-p="'+pi+'">Yolu sil</button>':'')+
        '</div>').join('')+
       '<button type="button" data-action="add-path" data-r="'+ri+'" '+(r.paths.length>=8?'disabled':'')+'>+ Paralel yol</button></div>'+
       '<div class="dts-ladder-coil"><span>SONUÇ →</span><button type="button" class="dts-ladder-dropzone" data-drop-kind="coil" data-r="'+ri+'" title="Buraya bobin, timer veya counter bırakın">⇣ Bobin / Blok bırak</button>'+
       select(r.coil.type,['NOP','OUT','SET','RESET','TON','TOF','TP','CTU','CTD'].map(v=>({value:v,label:v==='NOP'?'BOŞ (çıkış yok)':v})),'data-field="coil-type" data-r="'+ri+'"')+
       (r.coil.type==='NOP'?'<span class="dts-ladder-empty-output">Çıkış adresi yok</span>':select(r.coil.ref,refOptions(true,r.coil.type),'data-field="coil-ref" data-r="'+ri+'"'))+
       (['TON','TOF','TP'].includes(r.coil.type)?'<label>Süre (ms) <input type="number" min="1" max="600000" value="'+escape(r.coil.presetMs||1000)+'" data-field="presetMs" data-r="'+ri+'"></label>':'')+
       (TimerGuide?.markup?.(r.coil)||'')+
       (['CTU','CTD'].includes(r.coil.type)?'<label>Hedef <input type="number" min="1" max="65535" value="'+escape(r.coil.preset||1)+'" data-field="preset" data-r="'+ri+'"></label>':'')+
       (r.coil.type!=='NOP'?'<button type="button" data-action="remove-output" data-r="'+ri+'" '+(editor.running?'disabled title="Önce simülasyonu durdur"':'title="Bloğu kaldır; Network kalsın, çıkış etkinleşmesin"')+' aria-label="'+escape(r.coil.type+' çıkışını güvenle kaldır')+'">'+(['TON','TOF','TP','CTU','CTD'].includes(r.coil.type)?'Bloğu kaldır':'Bobini kaldır')+'</button>':'')+
       '<strong class="dts-ladder-signal" data-monitor="value">'+escape(signalText(monitored))+'</strong>'+
       '</div></div></article>';
     }).join('')+'</main>'+
     '<footer class="dts-ladder-footer"><span id="dtsLadderValidation" role="status">'+(valid.ok?'Program kontrolü: uygun.':escape(valid.error))+'</span><button type="button" data-action="close">Kapat</button></footer>'+
     '</section>';
   const newList=overlay.querySelector('.dts-ladder-rungs');if(newList)newList.scrollTop=oldScroll;
   if(advancedOpen){const more=overlay.querySelector('.dts-ladder-advanced');if(more)more.open=true}
   if(priorFocus){
    const controls=Array.from(overlay.querySelectorAll('button,select,input'));
    const next=controls.find(el=>focusableControl(el)&&focusKey(el)===priorFocus);
    // After moving a rung to an edge, ↑ or ↓ becomes disabled. Return focus
    // to the SAME rung's always-available workspace action, not its neighbor.
    const sameRung=!next&&priorRungId?controls.find(el=>focusableControl(el)&&
     el.dataset?.rungId===priorRungId&&el.dataset?.action==='focus-network'):null;
    if(next)next.focus();else if(sameRung)sameRung.focus();else overlay.querySelector('.dts-ladder-dialog')?.focus();
   }
  }
  function close(){
   importSerial++;overlay.hidden=true;active=null;
   if(monitorTimer){root.clearInterval(monitorTimer);monitorTimer=null}
   const target=returnFocus?.isConnected&&typeof returnFocus.focus==='function'?returnFocus:btn;
   returnFocus=null;target.focus?.();
  }
  function open(which){
   const items=available();
   if(!items.length){
    // Keep the native execution lock, but show a persistent accessible reason.
    returnFocus=doc.activeElement;
    active=null;
    const anyPLC=editor.getProject?.()?.components?.some(c=>editor.byId?.[c.typeId]?.isPLC);
    overlay.innerHTML='<section class="dts-ladder-dialog" role="dialog" aria-modal="true" aria-label="Ladder açılış bilgisi" tabindex="-1">'+
     '<header class="dts-ladder-header"><div><strong>PLC Ladder · DTS</strong><small>Güvenli sanal PLC programlama</small></div>'+
     '<button type="button" data-action="close" aria-label="Kapat">×</button></header>'+
     '<div class="dts-ladder-guide"><h3>PLC Ladder için doğrulanmış bir CPU gerekli</h3>'+
     '<p>'+(anyPLC?'Projede PLC var, ancak bu model Ladder için henüz native doğrulanmış değil.':
      'Bu projeye henüz Ladder destekli bir PLC eklenmemiş.')+'</p>'+
     '<p>Sol malzeme kütüphanesinden <strong>Siemens CPU 1211C DC/DC/DC</strong> ekleyin; sonra PLC Ladder düğmesine yeniden basın.</p>'+
     '<p>Doğrulanmayan PLC modellerinde çıkış veya simülasyon etkinleştirilmez.</p>'+
     '<button type="button" data-action="close">Anladım</button></div></section>';
    overlay.hidden=false;
    overlay.querySelector('.dts-ladder-dialog')?.focus();
    return false;
   }
   const target=items.find(c=>c.id===which)||items[0];
   const firstOpen=overlay.hidden;
   if(firstOpen){returnFocus=doc.activeElement;diagramMode='ladder';}
   // Network IDs such as R1/R2 recur on separate PLCs. Carrying focus or
   // collapsed branches across a PLC change hides unrelated Networks.
   if(firstOpen||active?.c!==target){selectedTool=null;focusedNetwork=null;closedNetworks.clear();}
   active=stateFor(target,editor);
   active.history=sessions.forComponent(editor.getProject(),target,active.draft);
   active.draft=active.history.current();
   overlay.hidden=false;render();
   // Initial open enters the dialog; switching PLC keeps keyboard focus on its selector.
   overlay.querySelector(firstOpen?'.dts-ladder-dialog':'#dtsLadderTarget')?.focus();
   if(!monitorTimer)monitorTimer=root.setInterval(()=>{
    if(overlay.hidden||!active)return;
    const views=monitorRows(active.draft,active.c.ladderProgram,active.c._dtsLadderTraces,editor.running,active.c.plcProgram,active.c._plcRuntime?.powered,active.c._dtsLadderError,active.c._plcRuntime?.program);
    overlay.querySelectorAll('.dts-ladder-rung').forEach((el,i)=>{
     const row=views[i];if(!row)return;
     el.classList.toggle('active',row.active);
     const status=el.querySelector('[data-monitor="status"]'),value=el.querySelector('[data-monitor="value"]');
     if(status)status.textContent=row.status;
     if(value)value.textContent=signalText(row);
     const diagram=el.querySelector('[data-diagram]'),shown=editor.running&&active.c.plcProgram==='dts-ladder-v1'&&
       JSON.stringify(active.draft)===JSON.stringify(active.c.ladderProgram);
     const bits=shown&&active.c._plcRuntime?.powered===true&&active.c._plcRuntime?.program==='dts-ladder-v1'&&!active.c._dtsLadderError?active.c._dtsLadderMemory?.values:null;
     if(diagram){
      const key=JSON.stringify([!!bits,bits||{},row.active,row.value,row.pathStates]);
      if(diagram.dataset.signalKey!==key&&!(diagramMode==='fbd'&&diagram.contains(doc.activeElement)&&doc.activeElement?.matches?.('[data-fbd-coil-field],[data-fbd-contact-ref]'))){
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
   if(!canCommitDraft(active,editor)){editor.toast?.('PLC veya kayıtlı program değişti. Eski taslak kaydedilmedi.');return false}
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
   const target={r:parseUiIndex(zone.dataset.r),kind:zone.dataset.dropKind};
   if(zone.dataset.p!==undefined)target.p=parseUiIndex(zone.dataset.p);
   if(zone.dataset.i!==undefined)target.i=parseUiIndex(zone.dataset.i);
   const result=Toolbox.apply(active.draft,id,target,limits());
   if(!result.ok){editor.toast?.(result.error);return false}
   // Restore keyboard focus to the inserted operand, not the destroyed
   // drop zone. This applies to both a specific branch and a whole Network.
   const tool=Toolbox.byId(id),pathIndex=target.p===undefined?0:target.p;
   const originalPath=active.draft.rungs[target.r]?.paths?.[pathIndex];
   const insertIndex=target.i===undefined?originalPath?.length:target.i;
   const nextFocus=tool?.kind==='contact'?
    'field:contact-ref:'+target.r+':'+pathIndex+':'+insertIndex:
    'field:coil-ref:'+target.r+'::';
   active.draft=result.program;active.history.push(result.program);
   closedNetworks.delete(result.rungId);
   selectedTool=null;render(nextFocus);return true;
  }
  function action(button){
   if(!active)return;
   const type=button.dataset.action,r=parseUiIndex(button.dataset.r),p=parseUiIndex(button.dataset.p),c=parseUiIndex(button.dataset.c);
   if(editor.running&&['undo','redo','starter','load-example','add-rung','remove-rung','copy-rung','move-rung-up','move-rung-down','add-path','remove-path','add-contact','remove-contact'].includes(type)){
    editor.toast?.('Önce simülasyonu durdurun.');return;
   }
   if(type==='close'){close();return}
   if(type==='live-watch'){
    const id=active.c.id;
    if(!root.DTSLadderWatch?.open){editor.toast?.('Canlı izleme yüklenemedi.');return}
    close();root.DTSLadderWatch.open(id);return;
   }
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
   if(type==='remove-block'||type==='remove-output'){
    if(editor.running){editor.toast?.('Önce simülasyonu durdurun.');return}
    const removed=type==='remove-output'?removeOutput(active.draft,r,limits()):removeFunctionBlock(active.draft,r,limits());
    if(!removed.ok){editor.toast?.(removed.error);return}
    active.draft=removed.program;active.history.push(active.draft);
    // The remove button disappears when the coil becomes a safe NOP.
    // Focus the same Network's command selector, never a stale control.
    render(diagramMode==='fbd'?'fbd-coil:type:'+r:'field:coil-type:'+r+'::');
    editor.toast?.('Blok kaldırıldı. Network çıkışsızdır; Geri al ile dönebilirsiniz.');
    return;
   }
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
   if(type==='add-rung'){
    const result=addSafeRung(active.draft,limits());
    if(!result.ok){editor.toast?.(result.error);return}
    active.draft=result.program;
   }
   else if(['copy-rung','move-rung-up','move-rung-down'].includes(type)){
    const operation=type==='copy-rung'?'copy':type==='move-rung-up'?'up':'down';
    const result=editNetworkOrder(active.draft,operation,r,limits());
    if(!result.ok){editor.toast?.(result.error);return}
    active.draft=result.program;
    // A copied Network is an address-free NOP draft; show it immediately
    // when its source was displayed in the single-Network workspace.
    if(operation==='copy'&&focusedNetwork===result.program.rungs[r]?.id){
     focusedNetwork=result.program.rungs[r+1]?.id||null;
     if(focusedNetwork)closedNetworks.delete(focusedNetwork);
    }
   }
   else if(type==='remove-rung'){
     const result=removeNetwork(active.draft,r,limits());
     if(!result.ok){editor.toast?.(result.error);return}
     active.draft=result.program;closedNetworks.delete(result.removedId);
     if(focusedNetwork===result.removedId)focusedNetwork=null;
    }
   else if(type==='add-path'){
    const result=addSafeParallelPath(active.draft,r,limits());
    if(!result.ok){editor.toast?.(result.error);return}
    active.draft=result.program;
   }
   else if(type==='remove-path'){
     const result=removeParallelPath(active.draft,r,p,limits());
     if(!result.ok){editor.toast?.(result.error);return}
     active.draft=result.program;
    }
   else if(type==='add-contact'){
    const added=addSafeContact(active.draft,r,p,limits());
    if(!added.ok){editor.toast?.(added.error);return}
    active.draft=added.program;
   }
   else if(type==='remove-contact'){
    const removed=removeContact(active.draft,r,p,c,limits());
    if(!removed.ok){editor.toast?.(removed.error);return}
    active.draft=removed.program;
   }
   active.history.push(active.draft);
   render(ladStructureNextFocus(active.draft,type,r,p,c));
  }
  function activateDiagramTarget(element){
   return focusDiagramOperand(overlay,element,diagramMode);
  }
  overlay.addEventListener('click',e=>{
   const structure=e.target.closest?.('[data-fbd-structure]');
   if(structure&&overlay.contains(structure)){
    if(diagramMode!=='fbd'||!active)return;
    if(editor.running){editor.toast?.('Önce simülasyonu durdurun.');return}
    const result=FBDView.editStructure(active.draft,structure.dataset.fbdStructure,structure.dataset.fbdPosition,limits());
    if(!result.ok){editor.toast?.(result.error);return}
    active.draft=result.program;active.history.push(active.draft);
    render(fbdStructureNextFocus(active.draft,structure.dataset.fbdStructure,structure.dataset.fbdPosition));return;
   }
   const polarity=e.target.closest?.('[data-fbd-toggle-contact]');
   if(polarity&&overlay.contains(polarity)){
    // The FBD view edits the same draft as LAD; the saved program is never updated by a click.
    if(diagramMode!=='fbd'||!active)return;
    if(editor.running){editor.toast?.('Önce simülasyonu durdurun.');return}
    const result=FBDView.toggleContact(active.draft,polarity.dataset.fbdToggleContact,limits());
    if(!result.ok){editor.toast?.(result.error);return}
    active.draft=result.program;
    active.history.push(active.draft);
    render();return;
   }
   const tile=e.target.closest?.('[data-tool-id]');
   if(tile&&overlay.contains(tile)){
    selectedTool=selectedTool===tile.dataset.toolId?null:tile.dataset.toolId;render();return;
   }
   const zone=e.target.closest?.('[data-drop-kind]');
   if(zone&&overlay.contains(zone)&&selectedTool&&diagramMode==='ladder'){addFromPalette(selectedTool,zone);return}
   // No selected tool: click an existing symbol to edit its operand.
   if(activateDiagramTarget(e.target))return;
   if(e.target===overlay){close();return}
   const b=e.target.closest('[data-action]');if(b&&overlay.contains(b)){
    if(!active&&b.dataset.action==='close'){close();return}
    action(b);
   }
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
     const requestId=++importSerial,draftSnapshot=JSON.stringify(target.draft),savedSnapshot=JSON.stringify(target.c.ladderProgram??null),historyRevision=target.history.revision();
     try{
      if(editor.running)throw Error('İçe aktarmadan önce simülasyonu durdurun.');
      if(file.size>ProgramIO.maxBytes)throw Error('Ladder program dosyası 512 KB sınırını aşıyor.');
      // Snapshot limits before asynchronous file reading; never read a newly selected PLC's limits.
      const originalLimits={inputCount:target.inputs.length,outputCount:target.outputs.length};
      const raw=await file.text();
      if(!importContextMatches(target,active,originalProject,editor.getProject(),!overlay.hidden,requestId,importSerial,draftSnapshot,target.draft,savedSnapshot,target.c.ladderProgram??null,historyRevision,target.history.revision())||!canCommitDraft(target,editor)||editor.running){
       editor.toast?.('İçe aktarma iptal: PLC, proje veya taslak değişti. Program değiştirilmedi.');
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
   if(editor.running){editor.toast?.('Önce simülasyonu durdurun.');render();return}
   const {field,r,p,c,fbdCoilField,fbdContactRef}=e.target.dataset;
   if(fbdContactRef){
    if(diagramMode!=='fbd'||!active)return;
    const result=FBDView.editContactRef(active.draft,fbdContactRef,e.target.value,limits());
    if(!result.ok){editor.toast?.(result.error);render();return}
    active.draft=result.program;active.history.push(active.draft);render();return;
   }
   if(fbdCoilField){
    if(diagramMode!=='fbd'||!active)return;
    const nextValue=['presetMs','preset'].includes(fbdCoilField)?
      (e.target.value.trim()===''?NaN:Number(e.target.value)):e.target.value;
    const result=FBDView.editCoil(active.draft,parseUiIndex(r),{[fbdCoilField]:nextValue},limits());
    if(!result.ok){editor.toast?.(result.error);render();return}
    active.draft=result.program;active.history.push(active.draft);render();return;
   }
   if(!field||!active)return;
   const changed=editLadderField(active.draft,field,parseUiIndex(r),parseUiIndex(p),parseUiIndex(c),e.target.value,limits());
   if(!changed.ok){editor.toast?.(changed.error);render();return}
   active.draft=changed.program;
   active.history.push(active.draft);render();
  });
  overlay.addEventListener('keydown',e=>{
   if(e.isComposing||e.keyCode===229){e.stopPropagation();return}
   if((e.key==='Enter'||e.key===' ')&&e.target.closest?.('[data-ladder-contact],[data-ladder-coil]')){
    if(activateDiagramTarget(e.target))e.preventDefault();
    e.stopPropagation();return;
   }
   if(e.key==='Tab'){trapModalTab(e,overlay.querySelector('.dts-ladder-dialog'),doc);e.stopPropagation();return}
   const editing=/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||'');
   const shortcut=ladderShortcut(e,editing,editor.running);
   if(shortcut){
    e.preventDefault();e.stopPropagation();
    if(shortcut==='save')save();
    else if(shortcut==='pending-field')editor.toast?.('Önce düzenlediğiniz alanı tamamlayın, sonra Ctrl+S ile kaydedin.');
    else if(shortcut==='locked')editor.toast?.('Ladder düzenlemesi için önce simülasyonu durdurun.');
    else{
     const next=shortcut==='redo'?active?.history.redo():active?.history.undo();
     if(next){active.draft=next;render()}
    }
    return;
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
 const api={init,supported,starter,stateFor,monitorRows,signalText,createDraftHistory,createDraftSessions,focusKey,trapModalTab,canStartLadder,importContextMatches,coilSelectOptions,contactChoices,changeCoilType,removeFunctionBlock,removeOutput,removeContact,focusDiagramOperand,addSafeRung,addSafeContact,addSafeParallelPath,editLadderField,editNetworkOrder,removeNetwork,removeParallelPath,focusableControl,ladderShortcut,canCommitDraft,parseUiIndex,fbdStructureNextFocus,ladStructureNextFocus};
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root?.document)root.DTSLadderEditorBootstrap=api,init(root.document,root.DTSEditor);
})(typeof window==='undefined'?globalThis:window);
