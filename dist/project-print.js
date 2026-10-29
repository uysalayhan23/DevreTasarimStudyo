(function(root){
 'use strict';
 // Browser-native Save as PDF: no server, third-party PDF library or direct PDF binary.
 function bounds(rect,pad=60){
  if(!rect||!Number.isFinite(pad)||pad<0||pad>500)return null;
  // Native SVG getBBox() exposes numeric geometry. Do not coerce absent, blank
  // or boolean values to zero and print a fabricated crop of a damaged scene.
  const v=[rect.x,rect.y,rect.width,rect.height];
  if(!v.every(Number.isFinite)||v[2]<=0||v[3]<=0||v[2]>20000||v[3]>20000)return null;
  const out={x:v[0]-pad,y:v[1]-pad,width:v[2]+2*pad,height:v[3]+2*pad};
  if(!Object.values(out).every(Number.isFinite)||out.x+out.width===out.x||out.y+out.height===out.y)return null;
  return out;
 }
 // PDF print must not silently load remote SVG content. Local packaged product
 // photos remain printable, unlike the stricter PNG canvas export rules.
 function safeResources(svg){
  if(typeof svg?.querySelectorAll!=='function')return {ok:false,error:'Yazdırılacak SVG kaynakları incelenemedi.'};
  let nodes;
  try{nodes=svg.querySelectorAll('image,use,script,foreignObject,feImage,animate,animateMotion,animateTransform,set,[href],[xlink\\:href]')}
  catch{return {ok:false,error:'SVG kaynak incelemesi başarısız.'}}
  for(const node of nodes||[]){
   const tag=String(node?.localName||node?.tagName||'').toLowerCase().split(':').pop();
   if(['script','foreignobject','feimage','animate','animatemotion','animatetransform','set'].includes(tag))
    return {ok:false,error:'PDF için etkin veya harici SVG öğesi desteklenmiyor.'};
   const href=[node?.getAttribute?.('href'),node?.getAttribute?.('xlink:href')]
     .filter(x=>x!==null&&x!==undefined);
   if(tag==='image'&&!href.length)return {ok:false,error:'PDF görsel kaynağı eksik.'};
   for(const value of href){
    const v=String(value).trim();
    // Same-document refs and packaged raster photos are allowed; remote URLs are not.
    const local=/^#[a-z_][\w:.-]*$/i.test(v);
    const shipped=tag==='image'&&/^assets\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:png|jpe?g|webp)$/i.test(v);
    const data=tag==='image'&&/^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/]+={0,2}$/i.test(v);
    if(!local&&!shipped&&!data)return {ok:false,error:'PDF yazdırmada harici veya güvensiz SVG kaynağı engellendi.'};
   }
  }
  // Inherited xml:base can redirect a permitted relative assets/ image to a remote host.
  for(const el of [svg,...(svg.querySelectorAll('*')||[])]){
   if(el?.getAttribute?.('xml:base')!=null||
      el?.getAttributeNS?.('http://www.w3.org/XML/1998/namespace','base')!=null)
    return {ok:false,error:'PDF için XML temel adresi desteklenmiyor.'};
  }
  // SVG style rules and paint attributes can load remote CSS/images without href.
  // Share the existing PNG CSS validator so PDF and PNG follow the same offline rule.
  const cssCheck=typeof module==='object'&&module.exports
   ? require('./project-png.js').cssCheck : root.DTSProjectPng?.cssCheck;
  if(typeof cssCheck!=='function')
   return {ok:false,error:'PDF için çevrimdışı CSS güvenlik kontrolü kullanılamıyor.'};
  if(svg?.nodeType===1&&typeof svg.outerHTML!=='string')
   return {ok:false,error:'PDF SVG stilleri güvenli biçimde okunamadı.'};
  const cssResult=cssCheck(typeof svg.outerHTML==='string'?svg.outerHTML:'');
  if(!cssResult.ok)return {ok:false,error:'PDF için harici CSS kaynağı engellendi.'};
  return {ok:true};
 }
 function prepare(doc,svg,scene,title){
  if(!doc?.createElement||!doc?.body||!svg?.cloneNode||!scene?.getBBox)
   return {ok:false,error:'SVG çizim alanı bulunamadı.'};
  let area;try{area=bounds(scene.getBBox())}catch{return{ok:false,error:'Çizim sınırları okunamadı.'}}
  if(!area)return{ok:false,error:'Yazdırılacak görünür devre çizimi bulunamadı.'};
  let duplicate;
  try{duplicate=svg.cloneNode(true)}catch{return {ok:false,error:'Yazdırma için SVG çizimi kopyalanamadı.'}}
  if(!duplicate?.setAttribute)return {ok:false,error:'Yazdırma için SVG çizimi kopyalanamadı.'};
  const safety=safeResources(duplicate);if(!safety.ok)return safety;
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
  let result;
  try{result=prepare(doc,doc?.getElementById?.('workspace'),doc?.getElementById?.('scene'),title)}
  catch{return {ok:false,error:'Yazdırma çizimi güvenli biçimde hazırlanamadı.'}}
  if(!result.ok)return result;
  let removed=false;
  function cleanup(){if(removed)return;removed=true;win.removeEventListener?.('afterprint',cleanup);result.node.remove?.()}
  try{win.addEventListener?.('afterprint',cleanup)}catch{result.node.remove?.();return {ok:false,error:'Yazdırma sonrası temizleme dinleyicisi kurulamadı.'}}
  try{win.print()}catch{cleanup();return {ok:false,error:'Tarayıcı yazdırma penceresi açılamadı.'}}
  return {ok:true,rect:result.rect};
 }
 const api=Object.freeze({bounds,safeResources,prepare,printScene});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSProjectPrint=api;
})(typeof window==='undefined'?globalThis:window);
