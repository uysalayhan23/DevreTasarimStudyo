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
  // Reject a malformed saved program even if an older trace matches its IDs.
  // Use the actual PLC hardware input/output limits, not the generic 16/16 defaults.
  const programValid=!c?.ladderProgram||Ladder?.validate?.(c.ladderProgram,{
   inputCount:pins(d,'DI').length,outputCount:pins(d,'DO').length
  })?.ok===true;
  // Legacy read-only telemetry without a Ladder program keeps its existing contract.
  const traceReady=programValid&&(!c?.ladderProgram||(Array.isArray(c?.ladderProgram?.rungs)&&
   Array.isArray(c?._dtsLadderTraces)&&c._dtsLadderTraces.length===c.ladderProgram.rungs.length&&
   c._dtsLadderTraces.every((t,i)=>{
    const rung=c.ladderProgram.rungs[i];
    return t&&t.id===rung?.id&&t.coil===rung.coil?.ref&&Array.isArray(rung.paths)&&
     Array.isArray(t.pathStates)&&t.pathStates.length===rung.paths.length&&
     t.pathStates.every((v,j)=>typeof v==='boolean'&&Array.isArray(rung.paths[j])&&(rung.paths[j].length>0||v===false))&&
     typeof t.active==='boolean'&&t.active===t.pathStates.some(Boolean)&&
     typeof t.value==='boolean'&&
     (rung.coil?.type!=='OUT'||t.value===t.active)&&
     (rung.coil?.type!=='NOP'||t.value===false);
   })));
  // Hardware Q telemetry must agree with the last Ladder writer in this scan.
  // An unwritten Q is false; an older/contradictory output state is not live.
  const outputsAgree=traceReady&&(!c?.ladderProgram||pins(d,'DO').every((p,i)=>{
   const ref='Q'+(i+1),rungs=c.ladderProgram.rungs;
   let expected=false;
   for(let j=0;j<rungs.length;j++)if(rungs[j]?.coil?.ref===ref&&
     ['OUT','SET','RESET'].includes(rungs[j].coil.type))expected=c._dtsLadderTraces[j]?.value;
   return typeof expected==='boolean'&&state?.outputs?.[p.id]===expected;
  }));
  // The physical inputs must match native scan memory and the shown paths.
  // A path with a false I contact cannot be live even if M/Q contacts also exist.
  const di=pins(d,'DI');
  const inputsAgree=traceReady&&(!c?.ladderProgram||(
   di.every((p,i)=>{
    const sampled=c?._dtsLadderMemory?.values?.['I'+(i+1)];
    return typeof sampled!=='boolean'||sampled===state?.inputs?.[p.id];
   })&&c.ladderProgram.rungs.every((r,i)=>r.paths.every((path,j)=>{
    const truth=path.filter(x=>x.ref?.[0]==='I').map(x=>{
     const pin=di[Number(x.ref.slice(1))-1];
     const bit=state?.inputs?.[pin?.id];
     return x.type==='NC'?!bit:!!bit;
    });
    const reported=c._dtsLadderTraces[i].pathStates[j];
    return path.every(x=>x.ref?.[0]==='I')?reported===(path.length>0&&truth.every(Boolean)):
     !reported||truth.every(Boolean);
   }))));
  const live=!!running&&!!savedMatches&&!error&&mapped&&traceReady&&outputsAgree&&inputsAgree&&Ladder?.supportedPLC?.(d)===true&&state?.powered===true&&c?.plcProgram==='dts-ladder-v1'&&state?.program==='dts-ladder-v1';
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
