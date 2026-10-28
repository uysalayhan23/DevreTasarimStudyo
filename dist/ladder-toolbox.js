(function(root){
 'use strict';
 // Original DTS ladder tools: pure draft-only edits. The native Ladder evaluator remains authoritative.
 const Ladder=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 const tools=Object.freeze([
  {id:'NO',label:'NO kontak',symbol:'—| |—',kind:'contact'},
  {id:'NC',label:'NC kontak',symbol:'—|/|—',kind:'contact'},
  {id:'OUT',label:'Bobin Q',symbol:'—( )—',kind:'coil'},
  {id:'SET',label:'SET',symbol:'—(S)—',kind:'coil'},
  {id:'RESET',label:'RESET',symbol:'—(R)—',kind:'coil'},
  {id:'TON',label:'TON',symbol:'[TON]',kind:'coil'},
  {id:'TOF',label:'TOF',symbol:'[TOF]',kind:'coil'},
  {id:'TP',label:'TP',symbol:'[TP]',kind:'coil'},
  {id:'CTU',label:'CTU',symbol:'[CTU]',kind:'coil'},
  {id:'CTD',label:'CTD',symbol:'[CTD]',kind:'coil'}
 ]);
 const byId=new Map(tools.map(x=>[x.id,x]));
 function apply(program,toolId,target,limits={}){
  const tool=byId.get(toolId);
  if(!tool)return {ok:false,error:'Bilinmeyen Ladder aracı.'};
  if(!program||!Array.isArray(program.rungs)||!target)return {ok:false,error:'Hedef Network bulunamadı.'};
  const r=Number(target.r),p=target.p===undefined?0:Number(target.p);
  if(!Number.isInteger(r)||r<0||r>=program.rungs.length)return {ok:false,error:'Network numarası geçersiz.'};
  if(!['network','contact','coil'].includes(target.kind))return {ok:false,error:'Hedef alan geçersiz.'};
  const isContact=tool.kind==='contact';
  if(target.kind!=='network'&&target.kind!==tool.kind)return {ok:false,error:isContact?'Kontak seri kola eklenir.':'Bobin veya blok sonuç alanına eklenir.'};
  const next=JSON.parse(JSON.stringify(program)),rung=next.rungs[r];
  if(isContact){
   if(!Number.isInteger(p)||p<0||p>=rung.paths.length)return {ok:false,error:'Paralel yol bulunamadı.'};
   const path=rung.paths[p],at=target.i==null?path.length:Number(target.i);
   if(!Number.isInteger(at)||at<0||at>path.length||path.length>=12)return {ok:false,error:'Seri yolda en fazla 12 kontak kullanılabilir.'};
   const ref=Number.isInteger(limits.inputCount)&&limits.inputCount<1?'M1':'I1';
   path.splice(at,0,{type:tool.id,ref});
  }else{
   if(target.kind==='coil'||target.kind==='network'){
    const prefix=['TON','TOF','TP'].includes(tool.id)?'T':['CTU','CTD'].includes(tool.id)?'C':'Q';
    const previous=rung.coil;
    let ref=prefix==='Q'&&limits.outputCount===0?'M1':prefix+'1';
    if(prefix==='Q'&&['OUT','SET'].includes(tool.id)){
     // One OUT/SET writer per address; do not reuse Q1/M1 across networks.
     const outputCount=Number.isInteger(limits.outputCount)?limits.outputCount:16;
     const family=outputCount===0?'M':'Q';
     const candidates=Array.from({length:family==='M'?32:Math.min(16,Math.max(0,outputCount))},(_,i)=>family+(i+1));
     const busy=new Set(next.rungs.filter((x,i)=>i!==r&&['OUT','SET'].includes(x.coil.type)).map(x=>x.coil.ref));
     ref=candidates.includes(previous?.ref)&&!busy.has(previous.ref)?previous.ref:
      candidates.find(x=>!busy.has(x));
     if(!ref)return {ok:false,error:family==='Q'?'Boş PLC çıkış adresi kalmadı.':'Boş M bellek adresi kalmadı.'};
    }
    if(prefix==='T'||prefix==='C'){
     // Preserve the current owner's compatible address or allocate an unused slot.
     const busy=new Set(next.rungs.filter((x,i)=>i!==r&&
      (prefix==='T'?['TON','TOF','TP']:['CTU','CTD']).includes(x.coil.type))
      .map(x=>x.coil.ref));
     const own=previous?.ref;
     ref=typeof own==='string'&&new RegExp('^'+prefix+'(?:[1-9]|1[0-6])$').test(own)&&!busy.has(own)?
      own:Array.from({length:16},(_,i)=>prefix+(i+1)).find(x=>!busy.has(x));
     if(!ref)return {ok:false,error:prefix==='T'?'Boş zamanlayıcı adresi kalmadı.':'Boş sayaç adresi kalmadı.'};
    }
    rung.coil={type:tool.id,ref};
    if(prefix==='T')rung.coil.presetMs=Number.isInteger(previous?.presetMs)?previous.presetMs:1000;
    if(prefix==='C')rung.coil.preset=Number.isInteger(previous?.preset)?previous.preset:1;
   }
  }
  const check=Ladder?.validate?.(next,limits);
  if(!check?.ok)return {ok:false,error:check?.error||'Ladder doğrulanamadı.'};
  return {ok:true,program:next,rungId:rung.id};
 }
 const api=Object.freeze({tools,apply,byId:id=>byId.get(id)||null});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.DTSLadderToolbox=api;
})(typeof window==='undefined'?globalThis:window);
