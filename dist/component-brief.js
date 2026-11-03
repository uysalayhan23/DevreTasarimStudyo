(function(root){
 'use strict';
 // Read-only catalogue descriptions with native virtual sensor settings; no physical acceptance inferred.
 const Sensors=typeof module==='object'&&module.exports?require('./sensors.js'):root.CCSSensors;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Only use existing repository product photographs. Never trust catalog/imported
 // image URLs as arbitrary HTML or use perspective shots as workspace assets.
 const originalPhotos=Object.freeze({
  'nh-fuse-holder':'assets/products/nh-holder-front-v111.png',
  'converter-pressure':'assets/products/weid-front-v115.png',
  'reed-no':'assets/products/reed-mr228b-v113.jpg',
  'reed-nc':'assets/products/reed-mr228b-v113.jpg',
  'fuse-switch':'assets/products/wsi-top-v111.png',
  'fuse-switch-3':'assets/products/wsi-top-v111.png',
  'unit-ut33d-plus':'assets/products/ut33d-front-transparent.webp',
  'sensor-temperature-humidity':'assets/products/gentek-front-v115.png',
  'temperature-controller':'assets/products/enda-front-v115.png'
 });
 const allowedOriginalPhotos=new Set(Object.values(originalPhotos));
 const kindHints={
  lamp:'Gösterge elemanı. Devredeki durumunu simülasyon sırasında izleyebilirsiniz.',
  plc:'PLC: giriş, çıkış ve gerçek katalog terminal adreslerini kontrol edin.',
  'contact-no':'Normalde açık kontak. Bağlantı durumunu devrede inceleyin.',
  'contact-nc':'Normalde kapalı kontak. Bağlantı durumunu devrede inceleyin.',
  resistor:'Direnç. Katalogdaki değer ve bağlı uçları kontrol edin.',
  relay:'Röle. Bobin ve ilgili kontakları cihaz adına göre eşleştirin.'
 };
 function model(d,c){
  if(!d||!c)return null;
  // A malformed optional draft pin cannot take down the selected-device card.
  const sourcePins=Array.isArray(d.pins)?d.pins:null;
  // Duplicate catalog pin IDs are ambiguous: never present them as separate usable terminals.
  const seenPins=new Set();
  const ps=(sourcePins||[]).filter(p=>{
   if(!p||typeof p!=='object'||p.id==null||!String(p.id).trim())return false;
   const id=String(p.id);
   if(seenPins.has(id))return false;
   seenPins.add(id);return true;
  });
  const name=String(d.name||d.model||d.id||'Eleman');
  const subtitle=[d.brand,d.model].filter(Boolean).map(String).join(' · ');
  const terminals=ps.slice(0,8).map(p=>({id:String(p.id??''),label:String(p.label??p.id??''),type:String(p.signalType??'')}));
  // Sensor presentation may inspect incomplete drafts; never mutate the catalog.
  const sensing=Sensors?.supported?.(d)?Sensors.settings(c,{...d,pins:ps}):null;
  const numeric=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:1});
  const target=sensing?Sensors.materials.find(([key])=>key===sensing.target)?.[1]||'Hedef yok':null;
  const parameters=sensing?[
   {label:'Hedef',value:target},
   {label:'Sanal algılama aralığı',value:numeric(sensing.range)+' mm'},
   {label:'Sanal hedef uzaklığı',value:numeric(sensing.distance)+' mm'},
   {label:'Otomatik hareket',value:sensing.auto?'Açık':'Kapalı'}
  ]:[];
  const originalPhoto=Object.prototype.hasOwnProperty.call(originalPhotos,d.id)?originalPhotos[d.id]:null;
  return {name,subtitle,kind:String(d.kind||''),originalPhoto,
   hint:kindHints[d.kind]||'Malzeme bilgileri katalogdan alınmıştır. İşlev ve simülasyon desteği modele göre değişebilir.',
   ref:String(c.ref??c.label??c.id??''),terminals,totalPins:ps.length,parameters,
   note:!sourcePins?'Terminal bilgisi katalogda bulunamadı.':sourcePins.length!==ps.length?
    'Geçersiz '+(sourcePins.length-ps.length)+' uç kaydı bulunuyor · '+ps.length+' tanımlı uç gösterilebilir.':
    ps.length>8?'İlk 8 uç gösteriliyor · toplam '+ps.length+' uç':'Toplam '+ps.length+' uç'};
 }
 function markup(item){
  if(!item)return '';
  const pin=p=>'<span class="dts-component-pin" title="'+esc(p.id)+(p.type?' · '+esc(p.type):'')+'">'+esc(p.label)+'</span>';
  return '<header><strong>'+esc(item.name)+'</strong>'+(item.subtitle?'<small>'+esc(item.subtitle)+'</small>':'')+'</header>'+ (item.ref?'<small class="dts-component-ref">Cihaz: '+esc(item.ref)+'</small>':'')+
   '<p>'+esc(item.hint)+'</p>'+
   (allowedOriginalPhotos.has(item.originalPhoto)?
    '<figure class="dts-original-product-photo" style="margin:8px 0;padding:8px;border-radius:6px;background:#f4f6f8">'+
    '<img src="'+esc(item.originalPhoto)+'" alt="Orijinal/katalog ürün fotoğrafı: '+esc(item.name)+'" loading="lazy" decoding="async" style="display:block;width:auto;height:auto;max-width:100%;max-height:180px;margin:0 auto;object-fit:contain">'+
    '<figcaption style="margin-top:5px;font-size:11px;color:#4b5563;text-align:center">Orijinal/katalog fotoğrafı · bilgi amaçlı</figcaption></figure>':'')+
   (item.parameters?.length?'<div class="dts-component-params" aria-label="Sanal sensör parametreleri">'+
    item.parameters.map(p=>'<div><span>'+esc(p.label)+'</span><strong>'+esc(p.value)+'</strong></div>').join('')+'</div>':'')+
   (item.totalPins?'<div class="dts-component-pins">'+item.terminals.map(pin).join('')+'</div>':'')+
   '<small class="dts-component-foot">'+esc(item.note)+'</small>';
 }
 const api=Object.freeze({model,markup});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSComponentBrief=api;
})(typeof window==='undefined'?globalThis:window);
