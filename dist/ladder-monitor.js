(function(root){
 'use strict';
 // HMI-like readonly educational monitor: signals come from actual PLC simulation, no force commands.
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pins=(d,t)=>(Array.isArray(d?.pins)?d.pins:[])
  .filter(p=>p&&typeof p.id==='string'&&p.id&&p.signalType===t);
 const Ladder=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 function snapshot(c,d,running,savedMatches,validationError=null){
  const state=c?._plcRuntime;
  // A failed native Ladder scan may still return a zero-output virtual CPU state.
  // Never advertise that fault state as live or show misleading 0/1 telemetry.
  const error=validationError||(typeof c?._dtsLadderError==='string'&&c._dtsLadderError.trim()?c._dtsLadderError:null);
  const mapped=!!state&&['DI','DO'].every(type=>pins(d,type).every(p=>Object.prototype.hasOwnProperty.call(state[type==='DI'?'inputs':'outputs']||{},p.id)&&typeof state[type==='DI'?'inputs':'outputs'][p.id]==='boolean'));
  // For real saved Ladder programs, require a complete scan trace before exposing I/O.
  // Legacy read-only telemetry without a Ladder program keeps its existing contract.
  const traceReady=!c?.ladderProgram||(Array.isArray(c?.ladderProgram?.rungs)&&
   Array.isArray(c?._dtsLadderTraces)&&c._dtsLadderTraces.length===c.ladderProgram.rungs.length&&
   c._dtsLadderTraces.every((t,i)=>{
    const rung=c.ladderProgram.rungs[i];
    return t&&t.id===rung?.id&&(t.coil==null||t.coil===rung.coil?.ref)&&Array.isArray(rung.paths)&&
     Array.isArray(t.pathStates)&&t.pathStates.length===rung.paths.length&&
     t.pathStates.every((v,j)=>typeof v==='boolean'&&(rung.paths[j].length>0||v===false))&&
     typeof t.active==='boolean'&&t.active===t.pathStates.some(Boolean)&&
     typeof t.value==='boolean'&&
     (rung.coil.type!=='OUT'||t.value===t.active)&&
     (rung.coil.type!=='NOP'||t.value===false);
   }));
  const live=!!running&&!!savedMatches&&!error&&mapped&&traceReady&&Ladder?.supportedPLC?.(d)===true&&state?.powered===true&&c?.plcProgram==='dts-ladder-v1'&&state?.program==='dts-ladder-v1';
  const list=(type,key,prefix)=>pins(d,type).map((p,i)=>({ref:prefix+(i+1),terminal:p.id,value:live?!!state[key]?.[p.id]:null}));
  return {live,powered:live?!!state.powered:null,
   inputs:list('DI','inputs','I'),outputs:list('DO','outputs','Q'),
   message:!running?'Simülasyon kapalı':error?'PLC programı doğrulanamadı: '+error:
     !savedMatches?'Ladder programı henüz doğrulanmadı · kaydet':
     state?.powered===false?'PLC beslemesi yok':
     !live?'PLC sinyali bekleniyor':'Canlı sanal PLC · çıkışlar mantık durumudur, yükte enerji garantisi değildir'};
 }
 function markup(info){
  if(!info)return '';
  const pill=(s,kind)=>'<span class="dts-plc-io-pill '+(s.value===true?'on':s.value===false?'off':'unknown')+'"><b>'+
   esc(s.ref)+'</b><small>'+esc(s.value===null?'—':s.value?'1':'0')+'</small><em>'+esc(s.terminal)+'</em></span>';
  return '<div class="dts-plc-live-head"><strong>PLC I/O izleme</strong><span role="status">'+esc(info.message)+'</span></div>'+
   '<div class="dts-plc-live-row"><b>Girişler</b>'+info.inputs.map(s=>pill(s,'input')).join('')+'</div>'+
   '<div class="dts-plc-live-row"><b>Çıkışlar</b>'+info.outputs.map(s=>pill(s,'output')).join('')+'</div>';
 }
 const api=Object.freeze({snapshot,markup});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSLadderMonitor=api;
})(typeof window==='undefined'?globalThis:window);
