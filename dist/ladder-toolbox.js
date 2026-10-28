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
   const ref=limits.inputCount>0?'I1':'M1';
   path.splice(at,0,{type:tool.id,ref});
  }else{
   if(target.kind==='coil'||target.kind==='network'){
    const prefix=['TON','TOF','TP'].includes(tool.id)?'T':['CTU','CTD'].includes(tool.id)?'C':'Q';
    const ref=prefix==='Q'&&limits.outputCount===0?'M1':prefix+'1';
    rung.coil={type:tool.id,ref};
    if(prefix==='T')rung.coil.presetMs=1000;
    if(prefix==='C')rung.coil.preset=1;
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
