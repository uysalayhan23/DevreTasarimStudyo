(function(root){
'use strict';
if(root.DTSTutorialBootstrap)return;
let loading=null;
function load(src){
 return new Promise((resolve,reject)=>{
  const old=[...document.querySelectorAll('script[src]')].find(s=>s.getAttribute('src')?.split('?')[0]===src.split('?')[0]);
  if(old){if(old.dataset.loaded==='1')return resolve();old.addEventListener('load',resolve,{once:true});old.addEventListener('error',()=>reject(new Error(src+' yüklenemedi')),{once:true});return}
  const s=document.createElement('script');s.src=src;s.async=false;s.dataset.tutorialLazy='1';
  s.addEventListener('load',()=>{s.dataset.loaded='1';resolve()},{once:true});
  s.addEventListener('error',()=>reject(new Error(src+' yüklenemedi')),{once:true});
  document.head.appendChild(s);
 });
}
async function ensure(){
 if(root.DTSTutorialMode)return root.DTSTutorialMode;
 if(loading)return loading;
 loading=(async()=>{
  await load('tutorial-lessons.js?v=20261014-bell-trafo-v1');
  await load('tutorial-micro-hints.js?v=1.19.20-micro-hints1');
  await load('tutorial-mode.js?v=20261021-pedagogy-loop2');
  await load('tutorial-enhancements.js?v=1.19.20-coach-restore1');
  if(!root.DTSTutorialMode)throw new Error('Öğretici Modu başlatılamadı');
  return root.DTSTutorialMode;
 })().catch(e=>{loading=null;throw e});
 return loading;
}
document.addEventListener('click',async e=>{
 const b=e.target.closest?.('[data-open-tutorial]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 b.disabled=true;const old=b.innerHTML;b.innerHTML=old.replace(/<b>[\s\S]*?<\/b>/,'<b>Öğretici hazırlanıyor…</b>');
 try{const mode=await ensure();await mode.openHub()}
 catch(err){root.DTSEditor?.toast?.('Öğretici açılamadı: '+(err?.message||err));}
 finally{b.disabled=false;b.innerHTML=old}
},true);
root.DTSTutorialBootstrap={ensure};
})(typeof window==='undefined'?globalThis:window);
