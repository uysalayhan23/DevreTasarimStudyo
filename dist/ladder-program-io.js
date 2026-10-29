(function(root){
 'use strict';
 // DTS-only interchange format. Do not claim Siemens .lsc binary compatibility.
 const L=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 const MAGIC='dts-ladder-project',MAX_BYTES=512*1024;
 // Count UTF-8 bytes, not UTF-16 code units. Works offline without TextEncoder.
 function utf8Bytes(value){
  let bytes=0;
  for(let i=0;i<value.length;i++){
   const c=value.charCodeAt(i);
   if(c<128)bytes++;
   else if(c<2048)bytes+=2;
   else if(c>=0xD800&&c<=0xDBFF&&i+1<value.length&&value.charCodeAt(i+1)>=0xDC00&&value.charCodeAt(i+1)<=0xDFFF){bytes+=4;i++;}
   else bytes+=3;
   if(bytes>MAX_BYTES)return bytes;
  }
  return bytes;
 }

 // Imported files must not smuggle unrecognized properties into saved PLC state.
 // Preserve only the native Ladder V1 electrical contract and optional comments.
 function canonical(program){
  return {version:1,rungs:program.rungs.map(r=>({
   id:r.id,
   ...(r.comment===undefined?{}:{comment:r.comment}),
   paths:r.paths.map(path=>path.map(c=>({type:c.type,ref:c.ref}))),
   coil:{type:r.coil.type,ref:r.coil.ref,
    ...(['TON','TOF','TP'].includes(r.coil.type)?{presetMs:r.coil.presetMs}:{}),
    ...(['CTU','CTD'].includes(r.coil.type)?{preset:r.coil.preset}:{})}
  }))};
 }
 function parse(raw,limits){
  if(typeof raw!=='string'||utf8Bytes(raw)>MAX_BYTES)throw Error('Ladder program dosyası fazla büyük veya geçersiz.');
  let data;try{data=JSON.parse(raw)}catch{throw Error('Ladder dosyası geçerli JSON değil.')}
  if(!data||Array.isArray(data)||data.format!==MAGIC||data.version!==1)throw Error('Bu dosya DTS Ladder V1 programı değil.');
  const valid=L?.validate?.(data.program,limits);
  if(!valid?.ok)throw Error('Ladder programı doğrulanamadı: '+(valid?.error||'model yok'));
  return canonical(data.program);
 }
 function serialize(program,limits,name='DTS Ladder'){
  const valid=L?.validate?.(program,limits);
  if(!valid?.ok)throw Error('Dışa aktarılamayan Ladder programı: '+(valid?.error||'model yok'));
  const text=JSON.stringify({format:MAGIC,version:1,name:String(name||'DTS Ladder').slice(0,60),program:canonical(program)},null,2);
  if(utf8Bytes(text)>MAX_BYTES)throw Error('Ladder programı dosya boyut sınırını aşıyor.');
  return text;
 }
 const api=Object.freeze({format:MAGIC,maxBytes:MAX_BYTES,parse,serialize});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSLadderProgramIO=api;
})(typeof window==='undefined'?globalThis:window);
