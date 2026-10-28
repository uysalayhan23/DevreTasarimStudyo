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

 // V1 FBD and LAD share the same native rung model; edits are draft copies only.
 function editStructure(program,action,position,limits={}){
  const branch=action==='add-path'||action==='remove-path';
  const contact=action==='add-contact'||action==='remove-contact';
  if(!branch&&!contact)return {ok:false,error:'FBD işlem türü bilinmiyor.'};
  const syntax=branch?/^(0|[1-9]\d*):(0|[1-9]\d*)$/:/^(0|[1-9]\d*):(0|[1-9]\d*):(0|[1-9]\d*)$/;
  if(typeof position!=='string'||!syntax.test(position))return {ok:false,error:'FBD konum biçimi hatalı.'};
  const loc=position.split(':').map(Number),[r,p,c]=loc;
  if(!loc.every(Number.isSafeInteger))return {ok:false,error:'FBD konumu sayı sınırını aşıyor.'};
  const valid=Ladder?.validate?.(program,limits);
  if(!valid?.ok)return {ok:false,error:valid?.error||'Geçersiz Ladder programı.'};
  const paths=program.rungs[r]?.paths,series=paths?.[p];
  if(!series)return {ok:false,error:'Belirtilen FBD yolu yok.'};
  if(contact&&(c<0||c>=series.length))return {ok:false,error:'Belirtilen FBD kontağı yok.'};
  if(action==='add-contact'&&series.length>=12)return {ok:false,error:'En fazla 12 seri kontak.'};
  if(action==='remove-contact'&&series.length===1)return {ok:false,error:'Son kontak silinemez.'};
  if(action==='add-path'&&paths.length>=8)return {ok:false,error:'En fazla 8 paralel yol.'};
  if(action==='remove-path'&&paths.length===1)return {ok:false,error:'Son yol silinemez.'};
  const draft=JSON.parse(JSON.stringify(program)),out=draft.rungs[r].paths;
  const fresh={type:'NO',ref:Number.isInteger(limits.inputCount)&&limits.inputCount<1?'M1':'I1'};
  if(action==='add-contact')out[p].splice(c+1,0,fresh);
  if(action==='remove-contact')out[p].splice(c,1);
  if(action==='add-path')out.splice(p+1,0,[fresh]);
  if(action==='remove-path')out.splice(p,1);
  const check=Ladder.validate(draft,limits);
  return check.ok?{ok:true,program:draft}:{ok:false,error:check.error};
 }

 // FBD edits the same native V1 Ladder draft; it never creates a parallel simulator.
 const blockTypes=['OUT','SET','RESET','TON','TOF','TP','CTU','CTD'];
 function refsFor(type,limits={}){
  if(!blockTypes.includes(type))return [];
  const maxQ=Number.isInteger(limits.outputCount)?Math.max(0,Math.min(16,limits.outputCount)):16;
  const names=[];
  if(['OUT','SET','RESET'].includes(type)){
   for(let i=1;i<=maxQ;i++)names.push('Q'+i);
   for(let i=1;i<=32;i++)names.push('M'+i);
  }
  if(['TON','TOF','TP','RESET'].includes(type))for(let i=1;i<=16;i++)names.push('T'+i);
  if(['CTU','CTD','RESET'].includes(type))for(let i=1;i<=16;i++)names.push('C'+i);
  return names;
 }
 function editCoil(program,index,patch,limits={}){
  if(!Number.isInteger(index)||index<0||!program?.rungs?.[index])
   return {ok:false,error:'FBD blok konumu artık bulunamıyor.'};
  if(!patch||typeof patch!=='object'||Array.isArray(patch)||Object.keys(patch).length!==1)
   return {ok:false,error:'FBD blok değişikliği geçersiz.'};
  const field=Object.keys(patch)[0];
  if(!['type','ref','presetMs','preset'].includes(field))
   return {ok:false,error:'FBD blok alanı tanınmıyor.'};
  const check=Ladder?.validate?.(program,limits);
  if(!check?.ok)return {ok:false,error:check?.error||'Ladder taslağı doğrulanamadı.'};
  const original=program.rungs[index].coil;
  let type=original.type,ref=original.ref;
  if(field==='type'){
   if(!blockTypes.includes(patch.type))return {ok:false,error:'FBD blok türü tanınmıyor.'};
   type=patch.type;
   const options=refsFor(type,limits);
   if(!options.length)return {ok:false,error:'PLC için geçerli çıkış adresi yok.'};
   if(!options.includes(ref))ref=options[0];
  }else if(field==='ref'){
   if(typeof patch.ref!=='string'||!refsFor(type,limits).includes(patch.ref))
    return {ok:false,error:'FBD blok adresi bu PLC için geçersiz.'};
   ref=patch.ref;
  }else if((field==='presetMs'&&!['TON','TOF','TP'].includes(type))||
           (field==='preset'&&!['CTU','CTD'].includes(type))){
   return {ok:false,error:'Bu blok türünde böyle bir süre/hedef alanı yok.'};
  }
  const next={type,ref};
  if(['TON','TOF','TP'].includes(type)){
   next.presetMs=field==='presetMs'?patch.presetMs:
    Number.isInteger(original.presetMs)?original.presetMs:1000;
  }
  if(['CTU','CTD'].includes(type)){
   next.preset=field==='preset'?patch.preset:
    Number.isInteger(original.preset)?original.preset:1;
  }
  const draft=JSON.parse(JSON.stringify(program));
  draft.rungs[index].coil=next;
  const valid=Ladder.validate(draft,limits);
  return valid.ok?{ok:true,program:draft}:{ok:false,error:valid.error};
 }
 function blockControls(coil,index,limits={}){
  const options=items=>items.map(value=>'<option value="'+escape(value)+'"'+(value===coil.ref||value===coil.type?' selected':'')+'>'+escape(value)+'</option>').join('');
  const typeSelect='<label>Komut <select data-fbd-coil-field="type" data-r="'+index+'" aria-label="FBD çıkış komutu">'+options(blockTypes)+'</select></label>';
  const refSelect='<label>Adres <select data-fbd-coil-field="ref" data-r="'+index+'" aria-label="FBD çıkış adresi">'+options(refsFor(coil.type,limits))+'</select></label>';
  let preset='';
  if(['TON','TOF','TP'].includes(coil.type))
   preset='<label>Süre (ms) <input data-fbd-coil-field="presetMs" data-r="'+index+'" aria-label="FBD zamanlayıcı süresi ms" type="number" min="1" max="600000" step="1" value="'+escape(coil.presetMs)+'"></label>';
  else if(['CTU','CTD'].includes(coil.type))
   preset='<label>Hedef <input data-fbd-coil-field="preset" data-r="'+index+'" aria-label="FBD sayaç hedefi" type="number" min="1" max="65535" step="1" value="'+escape(coil.preset)+'"></label>';
  return '<div class="dts-fbd-block-controls" role="group" aria-label="FBD blok düzenleme">'+typeSelect+refSelect+preset+'</div>';
 }
 function render(rung,opts={}){
  const paths=Array.isArray(rung?.paths)?rung.paths:[];
  const live=opts.live===true&&Array.isArray(opts.pathStates)&&opts.pathStates.length===paths.length;
  const states=paths.map((_,i)=>live&&opts.pathStates[i]===true);
  const id=Number.isInteger(opts.index)?opts.index:0;
  const lines=paths.map((path,pi)=>{
   const contacts=path.map((c,ci)=>'<span class="dts-fbd-contact-group"><span role="button" tabindex="0" class="dts-fbd-contact" data-ladder-contact="'+id+':'+pi+':'+ci+'" aria-label="'+escape(c.ref+' kontağını düzenle')+'">'+escape(c.type==='NC'?'NOT '+c.ref:c.ref)+'</span><button type="button" class="dts-fbd-polarity" data-fbd-toggle-contact="'+id+':'+pi+':'+ci+'" aria-label="'+escape(c.ref+' kontağını '+(c.type==='NC'?'normalde açık':'normalde kapalı')+' yap')+'" title="Taslakta NO/NC değiştir">'+(c.type==='NC'?'NC → NO':'NO → NC')+'</button>'+
    (path.length>1?'<button type="button" class="dts-fbd-structure" data-fbd-structure="remove-contact" data-fbd-position="'+id+':'+pi+':'+ci+'" aria-label="'+escape(c.ref+' seri kontağını sil')+'">− Kontak</button>':'')+'</span>').join(' <span class="dts-fbd-link">━</span> ');
   return '<div class="dts-fbd-line'+(states[pi]?' dts-fbd-on':'')+'"><small>Yol '+(pi+1)+'</small>'+contacts+' <span class="dts-fbd-gate">'+(path.length>1?'AND':'PASS')+'</span>'+ '<button type="button" class="dts-fbd-structure" data-fbd-structure="add-contact" data-fbd-position="'+id+':'+pi+':'+(path.length-1)+'" '+(path.length>=12?'disabled':'')+'>+ Seri</button>'+
    '<button type="button" class="dts-fbd-structure" data-fbd-structure="add-path" data-fbd-position="'+id+':'+pi+'" '+(paths.length>=8?'disabled':'')+'>+ Paralel</button>'+
    (paths.length>1?'<button type="button" class="dts-fbd-structure dts-fbd-remove" data-fbd-structure="remove-path" data-fbd-position="'+id+':'+pi+'">Yolu sil</button>':'')+'</div>';
  }).join('');
  const coil=rung?.coil||{},out=live&&opts.coilValue===true;
  return '<section class="dts-fbd-view" role="group" aria-label="'+escape('FBD Network '+(id+1))+'"><header>FBD Network '+(id+1)+' · '+escape(rung?.comment||rung?.id||'')+'</header>'+lines+
   '<div class="dts-fbd-output"><span class="dts-fbd-gate">'+(paths.length>1?'OR':'DOĞRUDAN')+'</span><span class="dts-fbd-link">━</span><span class="dts-fbd-coil'+(out?' dts-fbd-on':'')+'" role="button" tabindex="0" data-ladder-coil="'+id+'" aria-label="'+escape((coil.ref||'?')+' bloğunu düzenle')+'">'+escape(coil.type||'OUT')+' · '+escape(coil.ref||'?')+'</span>'+blockControls(coil,id,opts.limits)+'</div></section>';
 }
 const api=Object.freeze({render,toggleContact,editCoil,editStructure,refsFor});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSFBDView=api;
})(typeof window==='undefined'?globalThis:window);
