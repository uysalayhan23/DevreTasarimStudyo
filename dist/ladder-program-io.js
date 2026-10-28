(function(root){
 'use strict';
 // DTS-only interchange format. Do not claim Siemens .lsc binary compatibility.
 const L=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 const MAGIC='dts-ladder-project',MAX_BYTES=512*1024;
 function parse(raw,limits){
  if(typeof raw!=='string'||raw.length>MAX_BYTES)throw Error('Ladder program dosyası fazla büyük veya geçersiz.');
  let data;try{data=JSON.parse(raw)}catch{throw Error('Ladder dosyası geçerli JSON değil.')}
  if(!data||Array.isArray(data)||data.format!==MAGIC||data.version!==1)throw Error('Bu dosya DTS Ladder V1 programı değil.');
  const valid=L?.validate?.(data.program,limits);
  if(!valid?.ok)throw Error('Ladder programı doğrulanamadı: '+(valid?.error||'model yok'));
  return JSON.parse(JSON.stringify(data.program));
 }
 function serialize(program,limits,name='DTS Ladder'){
  const valid=L?.validate?.(program,limits);
  if(!valid?.ok)throw Error('Dışa aktarılamayan Ladder programı: '+(valid?.error||'model yok'));
  const text=JSON.stringify({format:MAGIC,version:1,name:String(name||'DTS Ladder').slice(0,60),program},null,2);
  if(text.length>MAX_BYTES)throw Error('Ladder programı dosya boyut sınırını aşıyor.');
  return text;
 }
 const api=Object.freeze({format:MAGIC,maxBytes:MAX_BYTES,parse,serialize});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSLadderProgramIO=api;
})(typeof window==='undefined'?globalThis:window);
