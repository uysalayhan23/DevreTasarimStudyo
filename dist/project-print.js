(function(root){
 'use strict';
 // Browser-native Save as PDF: no server, third-party PDF library or direct PDF binary.
 function bounds(rect,pad=60){
  if(!rect||!Number.isFinite(pad)||pad<0||pad>500)return null;
  const v=[rect.x,rect.y,rect.width,rect.height].map(Number);
  if(!v.every(Number.isFinite)||v[2]<=0||v[3]<=0||v[2]>20000||v[3]>20000)return null;
  return {x:v[0]-pad,y:v[1]-pad,width:v[2]+2*pad,height:v[3]+2*pad};
 }
 function prepare(doc,svg,scene,title){
  if(!doc?.createElement||!doc?.body||!svg?.cloneNode||!scene?.getBBox)
   return {ok:false,error:'SVG çizim alanı bulunamadı.'};
  let area;try{area=bounds(scene.getBBox())}catch{return{ok:false,error:'Çizim sınırları okunamadı.'}}
  if(!area)return{ok:false,error:'Yazdırılacak görünür devre çizimi bulunamadı.'};
  const duplicate=svg.cloneNode(true);
  duplicate.id='dtsPrintableArtwork';
  duplicate.setAttribute('viewBox',[area.x,area.y,area.width,area.height].join(' '));
  duplicate.setAttribute('preserveAspectRatio','xMidYMid meet');
  duplicate.removeAttribute('width');duplicate.removeAttribute('height');
  if(duplicate.style){duplicate.style.transform='none';duplicate.style.width='100%';duplicate.style.height='auto'}
  duplicate.querySelector?.('.grid-bg')?.remove?.();
  for(const child of duplicate.querySelectorAll?.('.wire-editor-layer,.wire-editors,.alignment-guides,.alignment-guide,.draft-wire,.draft-wire-group,.selection-box')||[])child.remove?.();
  doc.getElementById?.('dtsPrintSurface')?.remove?.();
  const wrapper=doc.createElement('section');wrapper.id='dtsPrintSurface';wrapper.className='dts-print-surface';
  const heading=doc.createElement('header');heading.className='dts-print-heading';heading.textContent=String(title||'Devre çizimi').slice(0,100);
  const note=doc.createElement('p');note.textContent='Devre Tasarım Stüdyosu · 2B proje görünümü';
  const drawing=doc.createElement('div');drawing.className='dts-print-diagram';drawing.appendChild(duplicate);
  wrapper.appendChild(heading);wrapper.appendChild(note);wrapper.appendChild(drawing);doc.body.appendChild(wrapper);
  return {ok:true,node:wrapper,rect:area};
 }
 function printScene(doc,win,title){
  if(typeof win?.print!=='function')return {ok:false,error:'Tarayıcı yazdırma özelliği kullanılamıyor.'};
  const result=prepare(doc,doc?.getElementById?.('workspace'),doc?.getElementById?.('scene'),title);
  if(!result.ok)return result;
  let removed=false;
  function cleanup(){if(removed)return;removed=true;win.removeEventListener?.('afterprint',cleanup);result.node.remove?.()}
  win.addEventListener?.('afterprint',cleanup);
  try{win.print()}catch{cleanup();return {ok:false,error:'Tarayıcı yazdırma penceresi açılamadı.'}}
  return {ok:true,rect:result.rect};
 }
 const api=Object.freeze({bounds,prepare,printScene});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSProjectPrint=api;
})(typeof window==='undefined'?globalThis:window);
