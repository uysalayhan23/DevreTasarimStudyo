(function(root){
 'use strict';
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const Ladder=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 // Edit only the local FBD draft. Reject invalid addresses and any program not valid for the actual PLC pins.
 function toggleContact(program,position,limits={}){
  if(typeof position!=='string'||!/^(0|[1-9][0-9]*):(0|[1-9][0-9]*):(0|[1-9][0-9]*)$/.test(position))
   return {ok:false,error:'FBD kontak adresi geçersiz.'};
  const [r,p,c]=position.split(':').map(Number);
  const validated=Ladder?.validate?.(program,limits);
  if(!validated?.ok)return {ok:false,error:validated?.error||'Ladder taslağı doğrulanamadı.'};
  const contact=program.rungs[r]?.paths[p]?.[c];
  if(!contact||!['NO','NC'].includes(contact.type))
   return {ok:false,error:'FBD kontak konumu artık bulunamıyor.'};
  const draft=JSON.parse(JSON.stringify(program));
  draft.rungs[r].paths[p][c].type=contact.type==='NO'?'NC':'NO';
  const result=Ladder.validate(draft,limits);
  return result.ok?{ok:true,program:draft}:{ok:false,error:result.error};
 }
 function render(rung,opts={}){
  const paths=Array.isArray(rung?.paths)?rung.paths:[];
  const live=opts.live===true&&Array.isArray(opts.pathStates)&&opts.pathStates.length===paths.length;
  const states=paths.map((_,i)=>live&&opts.pathStates[i]===true);
  const id=Number.isInteger(opts.index)?opts.index:0;
  const lines=paths.map((path,pi)=>{
   const contacts=path.map((c,ci)=>'<span class="dts-fbd-contact-group"><span role="button" tabindex="0" class="dts-fbd-contact" data-ladder-contact="'+id+':'+pi+':'+ci+'" aria-label="'+escape(c.ref+' kontağını düzenle')+'">'+escape(c.type==='NC'?'NOT '+c.ref:c.ref)+'</span><button type="button" class="dts-fbd-polarity" data-fbd-toggle-contact="'+id+':'+pi+':'+ci+'" aria-label="'+escape(c.ref+' kontağını '+(c.type==='NC'?'normalde açık':'normalde kapalı')+' yap')+'" title="Taslakta NO/NC değiştir">'+(c.type==='NC'?'NC → NO':'NO → NC')+'</button></span>').join(' <span class="dts-fbd-link">━</span> ');
   return '<div class="dts-fbd-line'+(states[pi]?' dts-fbd-on':'')+'"><small>Yol '+(pi+1)+'</small>'+contacts+' <span class="dts-fbd-gate">'+(path.length>1?'AND':'PASS')+'</span></div>';
  }).join('');
  const coil=rung?.coil||{},out=live&&opts.coilValue===true;
  return '<section class="dts-fbd-view" role="group" aria-label="'+escape('FBD Network '+(id+1))+'"><header>FBD Network '+(id+1)+' · '+escape(rung?.comment||rung?.id||'')+'</header>'+lines+
   '<div class="dts-fbd-output"><span class="dts-fbd-gate">'+(paths.length>1?'OR':'DOĞRUDAN')+'</span><span class="dts-fbd-link">━</span><span class="dts-fbd-coil'+(out?' dts-fbd-on':'')+'" role="button" tabindex="0" data-ladder-coil="'+id+'" aria-label="'+escape((coil.ref||'?')+' bloğunu düzenle')+'">'+escape(coil.type||'OUT')+' · '+escape(coil.ref||'?')+'</span></div></section>';
 }
 const api=Object.freeze({render,toggleContact});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSFBDView=api;
})(typeof window==='undefined'?globalThis:window);
