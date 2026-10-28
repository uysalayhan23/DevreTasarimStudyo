(function(root){
 'use strict';
 // Draft-only component terminal designer. Never edits the 703-item catalogue or simulation.
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clone=x=>JSON.parse(JSON.stringify(x));
 const sides=['left','right','top','bottom'];
 const maxImportBytes=128*1024;
 function validate(d){
  if(!d||d.format!=='dts-terminal-draft'||d.version!==1||typeof d.sourceId!=='string'||
      !d.sourceId||d.sourceId.length>100||typeof d.name!=='string'||d.name.length>100||
      !Number.isFinite(d.w)||!Number.isFinite(d.h)||d.w<24||d.h<24||d.w>1400||d.h>1400||
      !Array.isArray(d.pins)||!d.pins.length||d.pins.length>32)
   return {ok:false,error:'Taslak biçimi, ölçüleri veya terminal sayısı geçersiz.'};
  const seen=new Set();
  for(const p of d.pins){
   if(!p||typeof p.id!=='string'||!p.id||p.id.length>42||seen.has(p.id)||
      typeof p.label!=='string'||p.label.length>80||!sides.includes(p.side)||
      !Number.isFinite(p.x)||!Number.isFinite(p.y)||
      p.x<0||p.y<0||p.x>d.w||p.y>d.h)
    return {ok:false,error:'Tekrarlı veya sınır dışı terminal kimliği/konumu.'};
   seen.add(p.id);
  }
  return {ok:true};
 }
 function fromCatalog(d){
  if(!d||!Array.isArray(d.pins)||d.pins.some(p=>!p||p.x==null||p.y==null||
   (typeof p.x==='string'&&!p.x.trim())||(typeof p.y==='string'&&!p.y.trim())))
   throw Error('Katalog terminal koordinatları eksik; (0,0) konumu varsayılamaz.');
  const draft={format:'dts-terminal-draft',version:1,sourceId:String(d.id||''),
   name:String(d.name||d.id||'Malzeme'),w:Number(d.w),h:Number(d.h),
   pins:d.pins.map(p=>({id:String(p.id||''),label:String(p.label||p.id||''),
    side:String(p.side||''),x:Number(p.x),y:Number(p.y)}))};
  const result=validate(draft);if(!result.ok)throw Error(result.error);
  return draft;
 }
 function canPreview(d){try{fromCatalog(d);return true}catch{return false}}
 function move(d,id,x,y){
  const valid=validate(d);if(!valid.ok)throw Error(valid.error);
  if(typeof id!=='string'||!Number.isFinite(x)||!Number.isFinite(y))throw Error('Terminal veya koordinat geçersiz.');
  if(x<0||y<0||x>d.w||y>d.h)throw Error('Terminal, önizleme gövdesinin dışında.');
  const next=clone(d),p=next.pins.find(v=>v.id===id);
  if(!p)throw Error('Terminal taslakta bulunamadı.');
  p.x=Math.round(x*2)/2;p.y=Math.round(y*2)/2;
  if(!validate(next).ok)throw Error('Yeni terminal koordinatı kabul edilemedi.');
  return next;
 }
 function exportDraft(d){
  const v=validate(d);if(!v.ok)throw Error(v.error);
  // Distinct extension, no catalogue insertion and no electrical/cable compatibility claim.
  return JSON.stringify({format:d.format,version:d.version,sourceId:d.sourceId,name:d.name,
    w:d.w,h:d.h,pins:d.pins},null,2);
 }
 function utf8ByteLength(raw){
  let bytes=0;
  for(let i=0;i<raw.length;i++){
   const c=raw.charCodeAt(i);
   if(c<128)bytes++;
   else if(c<2048)bytes+=2;
   else if(c>=0xD800&&c<=0xDBFF&&i+1<raw.length&&raw.charCodeAt(i+1)>=0xDC00&&raw.charCodeAt(i+1)<=0xDFFF){bytes+=4;i++}
   else bytes+=3;
   if(bytes>maxImportBytes)return bytes;
  }
  return bytes;
 }
 function parseImport(raw,catalog){
  if(typeof raw!=='string'||raw.length>maxImportBytes||utf8ByteLength(raw)>maxImportBytes)throw Error('Taslak dosyası 128 KB sınırını aşıyor veya geçersiz.');
  let data;
  try{data=JSON.parse(raw)}catch{throw Error('Terminal taslağı geçerli JSON değil.')}
  // Format, pin coordinates and exact identities are validated before anything is displayed.
  const check=validate(data);
  if(!check.ok)throw Error(check.error);
  const original=fromCatalog(catalog);
  if(data.sourceId!==original.sourceId)throw Error('Bu taslak farklı katalog bileşenine ait.');
  if(data.name!==original.name||data.w!==original.w||data.h!==original.h)
   throw Error('Katalog adı veya gövde ölçüleri bu taslakla eşleşmiyor.');
  if(data.pins.length!==original.pins.length)throw Error('Terminal sayısı katalog ile eşleşmiyor.');
  const incoming=new Map(data.pins.map(p=>[p.id,p]));
  const checked=[];
  for(const pin of original.pins){
   const found=incoming.get(pin.id);
   if(!found)throw Error('Katalog terminali taslakta yok: '+pin.id);
   if(found.label!==pin.label||found.side!==pin.side)
    throw Error('Terminal kimliği/etiketi/kenarı katalogla eşleşmiyor: '+pin.id);
   checked.push({id:pin.id,label:pin.label,side:pin.side,x:found.x,y:found.y});
  }
  // Never trust unknown file keys or pin metadata. Return a new, exact V1 draft.
  const result={format:'dts-terminal-draft',version:1,sourceId:original.sourceId,
   name:original.name,w:original.w,h:original.h,pins:checked};
  if(!validate(result).ok)throw Error('İçe aktarılan terminal yerleşimi geçersiz.');
  return result;
 }
 function acceptance(d,catalog){
  const checked=parseImport(exportDraft(d),catalog),original=fromCatalog(catalog);
  const changed=checked.pins.filter((p,i)=>p.x!==original.pins[i].x||p.y!==original.pins[i].y).map(p=>p.id);
  return Object.freeze({
   file:'PASS',identity:'PASS',preview:'PASS',
   geometry:changed.length?'REVIEW':'UNCHANGED',movedTerminals:changed,
   catalog:'HOLD',threeD:'HOLD',native:'HOLD',
   explanation:'Taslak yalnız önizleme içindir; katalogya kayıt, 3B terminal-kablo uyumu ve native simülasyon için ayrı fiziksel kabul gerekir.'
  });
 }
 function gateMarkup(review){
  if(!review)return '';
  const moved=review.movedTerminals.length;
  const geometry=moved
   ?'<b>REVIEW</b> · '+moved+' terminalin X/Y yeri değişti'
   :'<b>UNCHANGED</b> · terminal konumları katalogla aynı';
  return '<strong>Kabul kapıları</strong>'+
    '<div>Dosya, terminal kimliği ve önizleme: <b>PASS</b></div>'+
    '<div>Geometri: '+geometry+'</div>'+
    '<div>Katalogya ekleme: <b>HOLD</b> · 3B terminal/kablo kabulü: <b>HOLD</b> · Native simülasyon: <b>HOLD</b></div>'+
    '<small>Önizleme yalnız taslaktır. Katalog, gerçek devre ve 3B varlıkları değiştirilmez.</small>';
 }
 function svg(d){
  const check=validate(d);if(!check.ok)return '';
  const pin=(p,i)=>'<g class="dts-draft-terminal"><circle cx="'+p.x+'" cy="'+p.y+
    '" r="6" role="button" tabindex="0" data-pin="'+escape(p.id)+'" aria-label="'+escape(p.label)+' terminalini seç"/>'+
    '<text x="'+p.x+'" y="'+Math.max(8,p.y-10)+'" text-anchor="middle">'+escape(p.label)+'</text></g>';
  return '<svg class="dts-terminal-preview" xmlns="http://www.w3.org/2000/svg" '+
    'viewBox="-36 -36 '+(d.w+72)+' '+(d.h+72)+'" role="group" aria-label="Ayrı terminal yerleşimi taslağı">'+
    '<rect x="0" y="0" width="'+d.w+'" height="'+d.h+'" rx="9" class="dts-draft-body"/>'+
    '<text x="'+d.w/2+'" y="'+d.h/2+'" text-anchor="middle" class="dts-draft-title">'+escape(d.name)+'</text>'+
    d.pins.map(pin).join('')+'</svg>';
 }
 // Import completion must still belong to the latest requested file, draft and open panel.
 function importContextMatches(request,latest,sourceAtStart,currentSource,draftAtStart,currentDraft,visible){
  return Number.isSafeInteger(request)&&request>0&&request===latest&&
   !!sourceAtStart&&sourceAtStart===currentSource&&!!draftAtStart&&
   draftAtStart===currentDraft&&!!visible;
 }
 function init(doc=root?.document){
  const button=doc?.getElementById?.('dtsTerminalDesignerBtn');
  if(!button||button.dataset.ready==='1')return false;
  button.dataset.ready='1';let source=null,draft=null,moving=null,importSerial=0;
  const dialog=doc.createElement('div');dialog.id='dtsTerminalDraftOverlay';
  dialog.className='dts-terminal-draft-overlay';dialog.hidden=true;
  dialog.innerHTML='<section class="dts-terminal-draft-dialog" role="dialog" aria-modal="true" aria-label="Terminal konum taslağı" tabindex="-1"></section>';
  doc.body.appendChild(dialog);
  const panel=dialog.querySelector('section');
  function selection(def){
   importSerial++;source=canPreview(def)?def:null;button.hidden=!source;
  }
  function show(){
   if(!source||doc.getElementById('modal')?.hidden===false)return false;
   importSerial++;draft=fromCatalog(source);dialog.hidden=false;render();
   panel.focus();return true;
  }
  function close(){importSerial++;moving=null;dialog.hidden=true;draft=null;button.focus();}
  function render(){
   if(!draft)return;
   panel.innerHTML='<header><strong>Terminal konum taslağı</strong><button type="button" data-action="close" aria-label="Kapat">×</button></header>'+
    '<p>Bu ekran sadece bir taslaktır. Katalog, kablolar, 3B görünüm ve simülasyon değişmez.</p>'+
    '<div class="dts-terminal-draft-canvas">'+svg(draft)+'</div>'+
    '<div class="dts-terminal-draft-gates" role="status" aria-live="polite">'+
      gateMarkup(acceptance(draft,source))+'</div>'+
    '<div class="dts-terminal-draft-fields">'+draft.pins.map(p=>
      '<label>'+escape(p.label)+' <small>('+escape(p.id)+')</small>'+
      '<span>X <input type="number" min="0" max="'+draft.w+'" step="0.5" data-axis="x" data-id="'+escape(p.id)+'" value="'+p.x+'"></span>'+
      '<span>Y <input type="number" min="0" max="'+draft.h+'" step="0.5" data-axis="y" data-id="'+escape(p.id)+'" value="'+p.y+'"></span></label>'
    ).join('')+'</div><footer><button type="button" data-action="reset">Katalogdan yeniden al</button>'+
    '<button type="button" data-action="import">Taslak içe aktar (.dtscomponent)</button>'+
    '<input id="dtsTerminalImportFile" type="file" accept=".dtscomponent,.json" hidden>'+
    '<button type="button" data-action="export">Taslağı indir (.dtscomponent)</button></footer>';
  }
  function download(){
   if(!draft)return;
   const data=exportDraft(draft),blob=new Blob([data],{type:'application/json'});
   const url=root.URL.createObjectURL(blob),link=doc.createElement('a');
   link.href=url;link.download='terminal-taslagi.dtscomponent';
   doc.body.appendChild(link);
   try{link.click()}finally{link.remove();root.setTimeout(()=>root.URL.revokeObjectURL(url),1200)}
  }
  function coords(e,element){
   const matrix=element?.getScreenCTM?.();
   if(!matrix||typeof matrix.inverse!=='function'||typeof element.createSVGPoint!=='function')return null;
   const p=element.createSVGPoint();p.x=e.clientX;p.y=e.clientY;
   const v=p.matrixTransform(matrix.inverse());
   return {x:Math.max(0,Math.min(draft.w,v.x)),y:Math.max(0,Math.min(draft.h,v.y))};
  }
  dialog.addEventListener('click',e=>{
   if(e.target===dialog){close();return}
   const action=e.target?.closest?.('[data-action]')?.dataset.action;
   if(action==='close')close();
   else if(action==='reset'){draft=fromCatalog(source);render()}
   else if(action==='import')panel.querySelector('#dtsTerminalImportFile')?.click();
   else if(action==='export'){try{download()}catch(err){root.DTSEditor?.toast?.(err.message)}}
  });
  dialog.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.stopPropagation();e.preventDefault();close()}
   else if((e.key==='Enter'||e.key===' ')&&e.target?.hasAttribute?.('data-pin')){
    e.preventDefault();e.stopPropagation();
    const input=Array.from(panel.querySelectorAll('input[data-id]')).find(x=>x.dataset.id===e.target.dataset.pin);
    input?.focus();
   }
  });
  dialog.addEventListener('change',async e=>{
   if(e.target?.id==='dtsTerminalImportFile'){
    const input=e.target,file=input.files?.[0],sourceAtStart=source,draftAtStart=draft,request=++importSerial;
    if(file&&sourceAtStart&&draftAtStart){
     try{
      if(file.size>maxImportBytes)throw Error('Taslak dosyası 128 KB sınırını aşıyor.');
      const raw=await file.text();
      if(!importContextMatches(request,importSerial,sourceAtStart,source,draftAtStart,draft,!dialog.hidden))
       throw Error('Taslak içe aktarma iptal: yeni dosya, seçili bileşen, taslak veya pencere değişti.');
      const imported=parseImport(raw,sourceAtStart);
      draft=imported;render();
      root.DTSEditor?.toast?.('Terminal taslağı doğrulandı; yalnız önizlemeye alındı. Katalog HOLD.');
     }catch(err){root.DTSEditor?.toast?.(err.message)}
    }
    input.value='';return;
   }
   const el=e.target;if(!el?.dataset?.axis||!draft)return;
   const pin=draft.pins.find(p=>p.id===el.dataset.id);
   if(!pin)return;
   try{
    const x=el.dataset.axis==='x'?Number(el.value):pin.x;
    const y=el.dataset.axis==='y'?Number(el.value):pin.y;
    if(el.value.trim()==='')throw Error('Konum boş olamaz.');
    draft=move(draft,pin.id,x,y);
   }catch(err){root.DTSEditor?.toast?.(err.message)}
   render();
  });
  dialog.addEventListener('pointerdown',e=>{
   const target=e.target?.closest?.('circle[data-pin]'),canvas=target?.ownerSVGElement;
   if(!draft||!canvas||e.button!==0)return;
   moving={id:target.dataset.pin,pointerId:e.pointerId,canvas,target};
   canvas.setPointerCapture?.(e.pointerId);e.preventDefault();e.stopPropagation();
  });
  dialog.addEventListener('pointermove',e=>{
   if(!moving||e.pointerId!==moving.pointerId||!draft)return;
   const p=coords(e,moving.canvas);if(!p)return;
   moving.target.setAttribute('cx',p.x);moving.target.setAttribute('cy',p.y);
  });
  function finishDrag(e){
   if(!moving||e.pointerId!==moving.pointerId||!draft)return;
   const t=moving;moving=null;
   const p=coords(e,t.canvas);
   if(p){try{draft=move(draft,t.id,p.x,p.y)}catch(err){root.DTSEditor?.toast?.(err.message)}}
   render();
  }
  dialog.addEventListener('pointerup',finishDrag);
  dialog.addEventListener('pointercancel',e=>{if(moving?.pointerId===e.pointerId){moving=null;render()}});
  button.addEventListener('click',show);
  const api=Object.freeze({setSource:selection,open:show,close,isOpen:()=>!dialog.hidden});
  return api;
 }
 const api=Object.freeze({validate,fromCatalog,canPreview,move,exportDraft,parseImport,acceptance,gateMarkup,maxImportBytes,svg,importContextMatches,init});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else if(root?.document)root.DTSTerminalDraft=Object.assign({},api,{controller:init(root.document)});
})(typeof window==='undefined'?globalThis:window);
