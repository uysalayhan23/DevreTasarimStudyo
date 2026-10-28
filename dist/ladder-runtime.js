(function(root){
 'use strict';
 // Original DTS virtual PLC Ladder V1. This is NOT a Siemens LOGO file parser or a safety PLC.
 const address=/^(?:I(?:[1-9]|1[0-6])|Q(?:[1-9]|1[0-6])|M(?:[1-9]|[12][0-9]|3[0-2])|T(?:[1-9]|1[0-6])|C(?:[1-9]|1[0-6]))$/;
 const output=/^(?:Q(?:[1-9]|1[0-6])|M(?:[1-9]|[12][0-9]|3[0-2])|T(?:[1-9]|1[0-6])|C(?:[1-9]|1[0-6]))$/;
 const kinds=['NOP','OUT','SET','RESET','TON','TOF','TP','CTU','CTD'];
 function validate(source,limits={}){
  if(!source||typeof source!=='object'||source.version!==1||!Array.isArray(source.rungs)||source.rungs.length<1||source.rungs.length>32)return {ok:false,error:'Program V1 için 1–32 rung gerekir.'};
  const inputs=Number.isInteger(limits.inputCount)?limits.inputCount:16,outputs=Number.isInteger(limits.outputCount)?limits.outputCount:16;
  const seen=new Set(),blockWriters=new Set();
  for(let i=0;i<source.rungs.length;i++){
   const r=source.rungs[i];if(!r||typeof r!=='object'||typeof r.id!=='string'||r.id.length<1||r.id.length>40||seen.has(r.id))return {ok:false,error:'Tekrarlanan/geçersiz rung kimliği: '+(i+1)};
   seen.add(r.id);
   if(r.comment!==undefined&&(typeof r.comment!=='string'||r.comment.length>100))return {ok:false,error:'Network açıklaması en fazla 100 karakter olmalı.'};
   if(!Array.isArray(r.paths)||r.paths.length<1||r.paths.length>8)return {ok:false,error:'Rung '+r.id+' için 1–8 paralel yol gerekir.'};
   for(const path of r.paths){
    if(!Array.isArray(path)||path.length>12)return {ok:false,error:'Seri yol en fazla 12 kontak içermeli.'};
    for(const c of path){
     if(!c||!['NO','NC'].includes(c.type)||!address.test(c.ref))return {ok:false,error:'Geçersiz kontak/operand.'};
     if(c.ref[0]==='I'&&Number(c.ref.slice(1))>inputs)return {ok:false,error:'PLC giriş sınırı aşıldı: '+c.ref};
     if(c.ref[0]==='Q'&&Number(c.ref.slice(1))>outputs)return {ok:false,error:'PLC çıkış sınırı aşıldı: '+c.ref};
    }
   }
   if(!r.coil||!kinds.includes(r.coil.type))return {ok:false,error:'Geçersiz bobin/komut.'};
   // Address-free NOP is a disconnected output; no Q/M/T/C write is possible.
   if(r.coil.type==='NOP'){
    if(r.coil.ref!==''||Object.keys(r.coil).some(k=>k!=='type'&&k!=='ref'))
     return {ok:false,error:'Boş Network çıkışına adres veya hedef atanamaz.'};
   }else if(!output.test(r.coil.ref))return {ok:false,error:'Geçersiz bobin/komut.'};
   if(r.coil.ref[0]==='Q'&&Number(r.coil.ref.slice(1))>outputs)return {ok:false,error:'PLC çıkış sınırı aşıldı: '+r.coil.ref};
   if(['TON','TOF','TP'].includes(r.coil.type)&&(!/^T/.test(r.coil.ref)||!Number.isInteger(r.coil.presetMs)||r.coil.presetMs<1||r.coil.presetMs>600000))return {ok:false,error:'Zamanlayıcı adresi veya süresi geçersiz.'};
   if(['CTU','CTD'].includes(r.coil.type)&&(!/^C/.test(r.coil.ref)||!Number.isInteger(r.coil.preset)||r.coil.preset<1||r.coil.preset>65535))return {ok:false,error:'Sayaç adresi veya hedefi geçersiz.'};
   if(['OUT','SET'].includes(r.coil.type)&&!/^[QM]/.test(r.coil.ref))return {ok:false,error:'OUT/SET yalnız Q veya M adresine yazabilir.'};
   // Each timer/counter has one owning block; separate RESET instructions remain valid.
   if(['TON','TOF','TP','CTU','CTD'].includes(r.coil.type)){
    if(blockWriters.has(r.coil.ref))return {ok:false,error:'Zamanlayıcı/sayaç aynı adrese birden fazla Network yazamaz: '+r.coil.ref};
    blockWriters.add(r.coil.ref);
   }
  }
  return {ok:true,error:null};
 }
 function scan(source,inputValues,memory={},now=0,limits={}){
  const check=validate(source,limits);
  if(!check.ok)return {ok:false,error:check.error,outputs:{},memory,traces:[]};
  if(!Number.isFinite(now))return {ok:false,error:'Simülasyon zamanı geçersiz.',outputs:{},memory,traces:[]};
  const mem=memory&&typeof memory==='object'?memory:{};
  const values=mem.values&&typeof mem.values==='object'?mem.values:{};
  const states=mem.blocks&&typeof mem.blocks==='object'?mem.blocks:{};
  const bits=Object.assign(Object.create(null),values);
  // A removed Q coil must never keep energizing a physical output or feed a stale Q contact.
  // Preserve only outputs still assigned to a coil (including intentional SET latches).
  const assignedQ=new Set(source.rungs.filter(r=>['OUT','SET'].includes(r.coil.type)&&r.coil.ref?.[0]==='Q').map(r=>r.coil.ref));
  for(let i=1;i<=16;i++)if(!assignedQ.has('Q'+i))bits['Q'+i]=false;
  // Track M writers so removing an OUT/SET clears only that previously-owned
  // bit. Independent M values and still-present SET latches must be preserved.
  const assignedM=new Set(source.rungs.filter(r=>['OUT','SET'].includes(r.coil.type)&&r.coil.ref?.[0]==='M').map(r=>r.coil.ref));
  for(const ref of Array.isArray(mem._ladderOwnedM)?mem._ladderOwnedM:[])
   if(/^M(?:[1-9]|[12][0-9]|3[0-2])$/.test(ref)&&!assignedM.has(ref))bits[ref]=false;
  // Timer/counter blocks removed from the program cannot keep driving old contacts.
  const assignedBlocks=new Set(source.rungs.filter(r=>['TON','TOF','TP','CTU','CTD'].includes(r.coil.type)).map(r=>r.coil.ref));
  for(let i=1;i<=16;i++)for(const prefix of ['T','C']){
   const ref=prefix+i;
   if(!assignedBlocks.has(ref)){bits[ref]=false;delete states[ref];}
  }
  // A restarted virtual clock invalidates elapsed timer state. Keep M latches and
  // counter memory untouched; a stale TOF/TP must never re-energize an output.
  if(Number.isFinite(mem.lastTime)&&now<mem.lastTime){
   for(const ref of assignedBlocks)if(ref[0]==='T'){bits[ref]=false;delete states[ref];}
  }
  for(let i=1;i<=16;i++)bits['I'+i]=!!inputValues?.['I'+i];
  // Coil outputs re-evaluate from zero every scan; latched M/Q values remain only when SET/RESET is used.
  const written=new Set(),traces=[];
  for(const rung of source.rungs){
   // Preserve path truth at the exact scan point, before later coils change shared bits.
   const pathStates=rung.paths.map(path=>path.length>0&&path.every(c=>c.type==='NC'?!bits[c.ref]:!!bits[c.ref]));
   const active=pathStates.some(Boolean);
   const coil=rung.coil,ref=coil.ref;
   let next=false;
   if(coil.type==='NOP'){next=false;/* no output assignment */}
   else if(coil.type==='OUT'){next=active;bits[ref]=next;written.add(ref);}
   else if(coil.type==='SET'){if(active)bits[ref]=true;next=!!bits[ref];written.add(ref);}
   else if(coil.type==='RESET'){if(active){bits[ref]=false;delete states[ref];}next=!!bits[ref];written.add(ref);}
   else if(['TON','TOF','TP'].includes(coil.type)){
    const s=states[ref]||(states[ref]={});
    // Changing a virtual timer kind starts fresh; old output cannot energize the new block.
    // Recognize timer state from earlier sessions that lack the kind marker.
    const previousKind=s.kind||(Number.isFinite(s.start)?'TON':
     Number.isFinite(s.offStart)?'TOF':
     (Number.isFinite(s.pulseStart)||typeof s.prev==='boolean')?'TP':null);
    if(previousKind&&previousKind!==coil.type){
     delete s.start;delete s.offStart;delete s.pulseStart;delete s.prev;
     bits[ref]=false;
    }
    s.kind=coil.type;
    if(coil.type==='TON'){
     if(!active){delete s.start;next=false;}
     else{if(!Number.isFinite(s.start)||now<s.start)s.start=now;next=(now-s.start)>=coil.presetMs;}
    }else if(coil.type==='TOF'){
     if(active){delete s.offStart;next=true;}
     else if(bits[ref]&&(s.offStart===undefined||!Number.isFinite(s.offStart)||now<s.offStart)){s.offStart=now;next=true;}
     else next=Number.isFinite(s.offStart)&&(now-s.offStart)<coil.presetMs;
    }else{
     // IEC-style TP: a new edge cannot extend a pulse that is already running.
     // Rewind is defensive for a restarted virtual simulation clock.
     if(Number.isFinite(s.pulseStart)&&now<s.pulseStart)delete s.pulseStart;
     const pulseRunning=Number.isFinite(s.pulseStart)&&now-s.pulseStart<coil.presetMs;
     if(active&&!s.prev&&!pulseRunning)s.pulseStart=now;
     next=Number.isFinite(s.pulseStart)&&now>=s.pulseStart&&now-s.pulseStart<coil.presetMs;
     s.prev=active;
    }
    bits[ref]=next;written.add(ref);
   }else if(coil.type==='CTU'||coil.type==='CTD'){
    const initial=coil.type==='CTD'?coil.preset:0;
    const s=states[ref]||(states[ref]={count:initial});
    // A CTU/CTD type change must not reuse the other counter's count or edge memory.
    if(s.kind&&s.kind!==coil.type){s.count=initial;delete s.prev;delete s.tick;}
    s.kind=coil.type;
    if(!Number.isInteger(s.count))s.count=initial;
    if(active&&!s.prev&&s.tick!==now)s.count=Math.max(0,Math.min(65535,s.count+(coil.type==='CTU'?1:-1)));
    s.prev=active;s.tick=now;
    next=coil.type==='CTU'?s.count>=coil.preset:s.count===0;
    bits[ref]=next;written.add(ref);
   }
   const trace={id:rung.id,active,pathStates,coil:ref,value:coil.type==='NOP'?false:!!bits[ref],count:coil.type==='NOP'?null:states[ref]?.count??null};
   if(['TON','TOF','TP'].includes(coil.type)){
    const state=states[ref]||{};
    const started=coil.type==='TON'?state.start:coil.type==='TOF'?state.offStart:state.pulseStart;
    // Snapshot the elapsed value at this rung; later RESETs must not rewrite its trace.
    trace.elapsedMs=Number.isFinite(started)?Math.max(0,Math.min(coil.presetMs,now-started)):null;
   }
   traces.push(trace);
  }
  const physical={};for(let i=1;i<=(Number.isInteger(limits.outputCount)?limits.outputCount:16);i++)physical['Q'+i]=!!bits['Q'+i];
  mem.values=bits;mem.blocks=states;mem.lastTime=now;mem._ladderOwnedM=[...assignedM];
  return {ok:true,outputs:physical,memory:mem,traces};
 }
 function blank(){return {version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};}
 function supportedPLC(d){
  return !!d&&d.id==='plc-hw-6es7211-1ae40-0xb0'&&d.isPLC===true&&
   (d.pins||[]).filter(p=>p.signalType==='DI').length===6&&
   (d.pins||[]).filter(p=>p.signalType==='DO').length===4&&
   (d.pins||[]).some(p=>p.id==='X10:6'&&p.label==='1M'&&p.signalType==='POWER')&&
   (d.pins||[]).some(p=>p.id==='X12:1'&&p.label==='3L+'&&p.signalType==='POWER')&&
   (d.pins||[]).some(p=>p.id==='X12:2'&&p.label==='3M'&&p.signalType==='POWER')&&
   (d.pins||[]).some(p=>p.id==='X10:7'&&p.signalType==='DI')&&
   (d.pins||[]).some(p=>p.id==='X12:3'&&p.signalType==='DO');
 }
 const api=Object.freeze({version:1,validate,scan,blank,supportedPLC});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSLadderRuntime=api;
})(typeof window==='undefined'?globalThis:window);
