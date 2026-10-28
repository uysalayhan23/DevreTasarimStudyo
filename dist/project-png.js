(function(root){
 'use strict';
 // Offline PNG conversion only for self-contained SVG art. Never silently omit external photos.
 function sourceCheck(svg){
  if(!svg?.querySelectorAll)return {ok:false,error:'Devre SVG kaynağı bulunamadı.'};
  const refs=svg.querySelectorAll('image,foreignObject,use')||[];
  for(const el of refs){
   const tag=String(el.tagName||'').toLowerCase();
   if(tag==='foreignobject')return {ok:false,error:'Bu şema PNG için desteklenmeyen HTML görseli içeriyor.'};
   const href=el.getAttribute?.('href')||el.getAttribute?.('xlink:href')||'';
   if(tag==='image'&&!/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(href))
    return {ok:false,error:'Bu şemada harici malzeme görseli var. PNG dönüştürme güvenli değil; PDF / Yazdır kullanın.'};
   if(tag==='use'&&href&&!href.startsWith('#'))
    return {ok:false,error:'Dış SVG bağlantısı içeren şema PNG için desteklenmiyor.'};
  }
  return {ok:true};
 }
 function dimension(box,scale=2){
  const width=Math.ceil(box?.width*scale),height=Math.ceil(box?.height*scale);
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<1||height<1||
     width>10000||height>10000||width*height>24000000)return null;
  return {width,height};
 }
 function styleCopy(doc,win,svg){
  const copy=svg.cloneNode(true);
  const originals=[svg,...svg.querySelectorAll('*')],copies=[copy,...copy.querySelectorAll('*')];
  if(originals.length!==copies.length)return null;
  const props=['fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray',
   'fill-opacity','stroke-opacity','opacity','font-family','font-size','font-weight','font-style',
   'text-anchor','dominant-baseline','visibility','display','color','vector-effect','paint-order'];
  for(let i=0;i<originals.length;i++){
   const target=copies[i],computed=win.getComputedStyle(originals[i]);
   if(!computed||!target.style?.setProperty)continue;
   for(const p of props){const v=computed.getPropertyValue(p);if(v)target.style.setProperty(p,v)}
  }
  return copy;
 }
 async function exportPng(doc,win,title){
  if(typeof win?.Image!=='function'||typeof win?.XMLSerializer!=='function'||!win?.URL?.createObjectURL||
     typeof win?.getComputedStyle!=='function')return {ok:false,error:'Bu tarayıcı PNG çıktısını desteklemiyor.'};
  const source=doc?.getElementById?.('workspace'),scene=doc?.getElementById?.('scene');
  const inspected=sourceCheck(source);if(!inspected.ok)return inspected;
  let bb;try{bb=win.DTSProjectPrint?.bounds?.(scene?.getBBox?.())}catch{}
  if(!bb)return {ok:false,error:'PNG için görünür devre sınırları hesaplanamadı.'};
  const size=dimension(bb);if(!size)return {ok:false,error:'PNG boyutu tarayıcının güvenli sınırını aşıyor.'};
  const svg=styleCopy(doc,win,source);
  if(!svg)return {ok:false,error:'SVG stilleri kopyalanamadı.'};
  svg.removeAttribute('width');svg.removeAttribute('height');
  svg.setAttribute('width',String(size.width));svg.setAttribute('height',String(size.height));
  svg.setAttribute('viewBox',[bb.x,bb.y,bb.width,bb.height].join(' '));
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  svg.style.transform='none';
  svg.querySelector?.('.grid-bg')?.remove?.();
  for(const node of svg.querySelectorAll?.('.wire-editor-layer,.alignment-guides,.draft-wire,.selection-box,.measurement-overlay')||[])node.remove?.();
  const canvas=doc.createElement('canvas');canvas.width=size.width;canvas.height=size.height;
  const ctx=canvas.getContext?.('2d');if(!ctx||typeof canvas.toBlob!=='function')
   return {ok:false,error:'PNG çizim tuvali kullanılamıyor.'};
  const xml=new win.XMLSerializer().serializeToString(svg);
  const blob=new win.Blob([xml],{type:'image/svg+xml;charset=utf-8'});
  let svgUrl=null,pngUrl=null;
  try{
   svgUrl=win.URL.createObjectURL(blob);
   const bitmap=await new Promise((resolve,reject)=>{
    const im=new win.Image();
    im.onload=()=>resolve(im);im.onerror=()=>reject(Error('SVG resim olarak yüklenemedi.'));
    im.src=svgUrl;
   });
   ctx.fillStyle='#fff';ctx.fillRect(0,0,size.width,size.height);
   ctx.drawImage(bitmap,0,0,size.width,size.height);
   const output=await new Promise((resolve,reject)=>{
    try{canvas.toBlob(data=>data?resolve(data):reject(Error('PNG görüntüsü oluşturulamadı.')),'image/png')}
    catch(e){reject(e)}
   });
   pngUrl=win.URL.createObjectURL(output);
   const a=doc.createElement('a');
   a.href=pngUrl;a.download=String(title||'devre').slice(0,64).replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ_-]+/gi,'_')+'.png';
   doc.body.appendChild(a);
   try{a.click()}finally{a.remove()}
   return {ok:true,width:size.width,height:size.height};
  }catch{
   return {ok:false,error:'PNG dönüştürme tarayıcı güvenliği veya SVG içeriği nedeniyle başarısız. PDF / Yazdır seçeneğini kullanın.'};
  }finally{
   if(svgUrl)win.URL.revokeObjectURL(svgUrl);
   // Revoking a download Blob URL during the same click stack can cancel the download.
   if(pngUrl){
    const completedUrl=pngUrl;
    if(typeof win.setTimeout==='function')win.setTimeout(()=>win.URL.revokeObjectURL(completedUrl),1200);
    else win.URL.revokeObjectURL(completedUrl);
   }
  }
 }
 const api=Object.freeze({sourceCheck,dimension,exportPng});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSProjectPng=api;
})(typeof window==='undefined'?globalThis:window);
