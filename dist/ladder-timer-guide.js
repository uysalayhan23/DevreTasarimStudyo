(function(root){
 'use strict';
 // Compact, read-only Turkish guidance for the DTS virtual IEC-like timer model.
 // Never writes PLC outputs or changes scan state. For both LAD and FBD.
 const DATA=Object.freeze({
  TON:Object.freeze({
   title:'TON · Açmada gecikme',
   meaning:'Giriş kesintisiz aktif kaldığında belirlenen süre sonunda zamanlayıcı çıkışı T=1 olur.',
   sequence:'IN 0→1: süre başlar → PT dolunca T=1 → IN 1→0: T hemen 0 olur.',
   conditions:'PT dolmadan giriş kapanırsa sayaç sıfırlanır. Tekrar açıldığında süre yeniden başlar.',
   example:'Örnek: Buton PT süresince kesintisiz basılı kalırsa T=1 olur; erken bırakılırsa T=0 kalır.'
  }),
  TOF:Object.freeze({
   title:'TOF · Kapamada gecikme',
   meaning:'Giriş aktifken çıkış hemen T=1 olur; giriş kapanınca süre dolana kadar T=1 kalır.',
   sequence:'IN 0→1: T hemen 1 → IN 1→0: PT boyunca T=1 → PT dolunca T=0.',
   conditions:'Bekleme süresinde giriş tekrar açılırsa kapanma gecikmesi iptal edilir; sonraki kapanışta süre yeniden başlar.',
   example:'Örnek: Buton bırakıldıktan sonra sanal gösterge PT süresince aktif kalır.'
  }),
  TP:Object.freeze({
   title:'TP · Sabit süreli darbe',
   meaning:'Giriş 0’dan 1’e yükseldiğinde önceden belirlenen uzunlukta tek bir darbe üretir.',
   sequence:'IN 0→1: T hemen 1 → PT süresince 1 → PT dolunca T=0.',
   conditions:'Giriş erken bırakılsa bile darbe PT dolana kadar sürer. Darbe sırasında tekrar basmak süreyi uzatmaz; sonraki darbe için yeni 0→1 kenarı gerekir.',
   example:'Örnek: Butona kısa basmak sanal göstergeyi tam PT süresince etkinleştirir.'
  })
 });
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 function describe(type,presetMs){
  const entry=DATA[type];if(!entry)return null;
  const ms=Number.isInteger(presetMs)&&presetMs>=1&&presetMs<=600000?presetMs:null;
  return {...entry,type,ms};
 }
 function markup(coil){
  const item=describe(coil?.type,coil?.presetMs);
  if(!item)return '';
  const pt=item.ms===null?'geçersiz süre':item.ms+' ms ('+(item.ms/1000).toLocaleString('tr-TR')+' saniye)';
  return '<details class="dts-timer-guide" data-timer-guide="'+item.type+'">'+
   '<summary><strong>ⓘ '+esc(item.title)+'</strong><span>Çalışma koşulları</span></summary>'+
   '<div class="dts-timer-guide-body"><p>'+esc(item.meaning)+'</p>'+
   '<p><b>PT (ayarlanan süre):</b> '+esc(pt)+'</p>'+
   '<p><b>Zaman akışı:</b> '+esc(item.sequence)+'</p>'+
   '<p><b>Önemli koşul:</b> '+esc(item.conditions)+'</p>'+
   '<p class="dts-timer-example">'+esc(item.example)+'</p>'+
   '<small>Bu açıklama DTS sanal PLC simülasyonuna aittir; fiziksel PLC onayı değildir.</small></div></details>';
 }
 const api=Object.freeze({describe,markup});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else if(root)root.DTSLadderTimerGuide=api;
})(typeof window==='undefined'?globalThis:window);
