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

 // Original, offline SVG timelines, derived from IEC timer edge semantics:
 // time coordinates are PT multiples, not physical wall clock measurements.
 // Each waveform is independent from the PLC's live state.
 const TIME_LINES=Object.freeze({
  TON:Object.freeze({
   input:[[0.45,1],[2.55,0]],output:[[1.45,1],[2.55,0]],
   elapsed:[[0,0],[0.45,0],[1.45,1],[2.55,1],[2.55,0],[3,0]],
   start:0.45,end:1.45,edge:'Yükselen kenar',label:'Q, IN kesintisiz 1 kaldıktan PT sonra açılır'
  }),
  TOF:Object.freeze({
   input:[[0.45,1],[1.25,0]],output:[[0.45,1],[2.25,0]],
   elapsed:[[0,0],[1.25,0],[2.25,1],[3,1]],
   start:1.25,end:2.25,edge:'Düşen kenar',label:'Q, IN 0 olduktan PT sonra kapanır'
  }),
  TP:Object.freeze({
   input:[[0.45,1],[0.82,0]],output:[[0.45,1],[1.45,0]],
   elapsed:[[0,0],[0.45,0],[1.45,1],[3,1]],
   start:0.45,end:1.45,edge:'Yükselen kenar',label:'Q, giriş kısa sürse bile PT boyunca 1 kalır'
  })
 });
 const timeX=t=>Math.round((82+150*t)*10)/10;
 function digitalPath(events,high,low){
  let last=low,path='M'+timeX(0)+' '+low;
  for(const [at,on] of events){
   const x=timeX(at),y=on?high:low;
   path+=' H'+x+' V'+y;last=y;
  }
  return path+' H'+timeX(3);
 }
 function elapsedPath(points,high=174,low=207){
  return points.map(([t,v],i)=>(i?'L':'M')+timeX(t)+' '+Math.round((low-(low-high)*v)*10)/10).join(' ');
 }
 function timingDiagram(type,presetMs){
  const sample=TIME_LINES[type];if(!sample)return '';
  const pt=Number.isInteger(presetMs)&&presetMs>0&&presetMs<=600000?
   'PT = '+presetMs+' ms':'PT = ayarlanan süre';
  const a=timeX(sample.start),b=timeX(sample.end),center=Math.round((a+b)/2);
  const heading=type+' zaman diyagramı: '+sample.label+'. '+pt;
  const mark=(x)=>'<path class="dts-timer-diagram-guide" d="M'+x+' 34 V221"/>';
  return '<figure class="dts-timer-diagram" data-timer-diagram="'+type+'">'+
   '<svg viewBox="0 0 600 278" role="img" aria-label="'+esc(heading)+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet">'+
   '<title>'+esc(heading)+'</title>'+
   '<path class="dts-timer-diagram-grid" d="M82 69 H532 M82 132 H532 M82 207 H532"/>'+
   '<text class="dts-timer-diagram-label" x="22" y="56">IN</text>'+
   '<text class="dts-timer-diagram-label" x="22" y="120">Q</text>'+
   '<text class="dts-timer-diagram-label" x="22" y="194">ET</text>'+
   mark(a)+mark(b)+
   '<path class="dts-timer-diagram-in" d="'+digitalPath(sample.input,44,67)+'"/>'+
   '<path class="dts-timer-diagram-q" d="'+digitalPath(sample.output,106,130)+'"/>'+
   '<path class="dts-timer-diagram-et" d="'+elapsedPath(sample.elapsed)+'"/>'+
   '<path class="dts-timer-diagram-pt" d="M'+a+' 243 H'+b+' M'+a+' 237 V249 M'+b+' 237 V249"/>'+
   '<text class="dts-timer-diagram-pt-label" x="'+center+'" y="235">'+esc(pt)+'</text>'+
   '<path class="dts-timer-diagram-time" d="M82 254 H548 l-8 -4 m8 4 l-8 4"/>'+
   '<text class="dts-timer-diagram-small" x="81" y="269">0</text>'+
   '<text class="dts-timer-diagram-small" x="555" y="258">t</text>'+
   '</svg><figcaption><strong>'+esc(sample.edge)+' → PT</strong> · '+
   esc(sample.label)+'. IN: giriş, Q: çıkış, ET: geçen süre (şematik).</figcaption></figure>';
 }
 function markup(coil){
  const item=describe(coil?.type,coil?.presetMs);
  if(!item)return '';
  const pt=item.ms===null?'geçersiz süre':item.ms+' ms ('+(item.ms/1000).toLocaleString('tr-TR')+' saniye)';
  return '<details class="dts-timer-guide" data-timer-guide="'+item.type+'">'+
   '<summary><strong>ⓘ '+esc(item.title)+'</strong><span>Çalışma koşulları</span></summary>'+
   '<div class="dts-timer-guide-body"><p>'+esc(item.meaning)+'</p>'+
   '<p><b>PT (ayarlanan süre):</b> '+esc(pt)+'</p>'+
   timingDiagram(item.type,item.ms)+
   '<p><b>Zaman akışı:</b> '+esc(item.sequence)+'</p>'+
   '<p><b>Önemli koşul:</b> '+esc(item.conditions)+'</p>'+
   '<p class="dts-timer-example">'+esc(item.example)+'</p>'+
   '<small>Bu açıklama DTS sanal PLC simülasyonuna aittir; fiziksel PLC onayı değildir.</small></div></details>';
 }
 const api=Object.freeze({describe,markup,timingDiagram});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else if(root)root.DTSLadderTimerGuide=api;
})(typeof window==='undefined'?globalThis:window);
