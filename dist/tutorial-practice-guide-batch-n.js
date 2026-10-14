(function practice(root){
 'use strict';
 const L=root.DTSTutorialLessons;
 if(!L||L._practiceGuideBatchN)return;
 const stats={version:'practice-n1',scanned:0,wired:0,referenceOnly:0,richPreserved:0,withoutMatchedLinks:[],guides:0};
 const key=r=>JSON.stringify([r?.c,r?.p,r?.j]);
 const clamp=s=>String(s??'').replace(/\s+/g,' ').trim().slice(0,240);
 const name=(p,r)=>{if(r?.j!==undefined)return 'Junction '+String(r.j);const c=p.components.find(c=>c.id===r?.c);return clamp((c?.label||c?.ref||c?.id||r?.c||'?')+' / '+(r?.p??'?'));};
 for(const lesson of L.lessons){
  if(lesson.designStandard==='rich-reference-v1'){stats.richPreserved++;continue}
  const p=lesson.project;
  if(!p||!Array.isArray(p.wires)||!Array.isArray(p.components))throw Error('Missing project '+lesson.id);
  stats.scanned++;
  const title=clamp(lesson.title||lesson.topic||lesson.id);
  const hasWires=p.wires.length>0;
  const isWired=hasWires && lesson.kind!=='quiz' && !p.referenceOnly;
  const materials=(lesson.materials||[]).filter(x=>x.label&&x.why).slice(0,4);
  const observations=[];
  const steps=[];
  steps.push('Sanal dersin hedefi: '+title+'. Önce kaynak tanımını ve gösterilen malzemeleri incele.');
  if(materials.length){
   const first=materials[0];steps.push(clamp(first.label)+' elemanının bu dersteki rolünü oku: '+clamp(first.why));
   if(materials.length>1){const second=materials[1];steps.push(clamp(second.label)+' elemanının görevini incele: '+clamp(second.why));}
  }
  if(isWired){
   stats.wired++;
   const all=p.wires.map(w=>({w,key:key(w.from)+'->'+key(w.to)}));
   const chosen=[];
   for(const s of lesson.steps||[]){
    const match=all.find(x=>x.key===key(s.from)+'->'+key(s.to));
    if(!match)continue;
    if(chosen.some(x=>x.key===match.key))continue;
    chosen.push(match);if(chosen.length>=4)break;
   }
   if(!chosen.length)stats.withoutMatchedLinks.push(lesson.id);
   for(const item of chosen){
    const wire=item.w,from=name(p,wire.from),to=name(p,wire.to);
    const why=clamp(wire.tutorialWhy||'Bu uç çifti sanal şemadaki kayıtlı bağlantıdır; elektriksel davranış ayrıca simülasyonda doğrulanmalıdır.');
    steps.push('Sanal bağlantı incelemesi: '+from+' → '+to+'. '+why);
    observations.push(from+' → '+to+' bağlantısının şemadaki yerini ve iki ucun görevini göster.');
   }
   steps.push('Gerçek cihazla çalışmadan, yalnız uygulama simülasyonunda başlangıç ve kumanda durumlarını karşılaştır; gerilim/akım sonucunu ölçmeden varsayma.');
   observations.push('Sanal simülasyonda varsa anahtar/sensör durumunu değiştirince hangi bileşenin durumu değişiyor, gözlemle; ölçülmeyen fiziksel değerleri doğru kabul etme.');
  }else{
   stats.referenceOnly++;
   if(hasWires)stats.referenceWithWires=(stats.referenceWithWires||0)+1;
   steps.push(hasWires?'Bu başlık konu kontrolü / referans şemasıdır: ekranda kablo veya ölçüm probu çizimleri bulunsa bile bağımsız rehberli elektriksel deney kabulü verilmemiştir.':'Bu başlıkta doğrulanmış kablolu deney şeması bulunmuyor. Görsel materyali bağlı ve enerjili bir devre gibi değerlendirme.');
   for(const m of materials.slice(0,3)){
    observations.push(clamp(m.label)+': '+clamp(m.why));
   }
   if(!observations.length)observations.push('Kavramın tanımını ve kaynak materyal bağlantısını karşılaştır; gerçek elektriksel deney sonucu gösterilmez.');
   steps.push('Kavramı dersin hedefi ve kaynak başlığıyla karşılaştır; bu ekranda elektriksel sonuç ölçümü yapılmış sayılmaz.');
  }
  lesson.practiceGuide={
   version:'practice-n1',
   heading:isWired?'Sanal devrede bağlantı ve gözlem rehberi':'Teori ve malzeme inceleme rehberi',
   virtualOnly:true,canonicalGraphUnchanged:true,physicalTestAccepted:false,
   pedagogicalAcceptance:false,fullyRich:false,
   method:isWired?'virtual-circuit-check':hasWires?'reference-with-wires':'reference-only',
   steps,observations
  };
  stats.guides++;
 }
 // Explain the actual NTC circuit instead of repeating generic material names.
 const ntc=L.byId['opamp-apps-src-08'];
 if(ntc?.practiceGuide?.method==='virtual-circuit-check'){
  ntc.practiceGuide.steps.splice(1,0,
   'LM358P U1 pin 8 +24 V, pin 4 0 V: besleme hattının yönünü ve görevini kontrol et.',
   'R2=R3=10 kΩ referans bölücüsü pin 2 (IN−) için 12 V oluşturur: 24 × 10/(10+10) = 12 V.',
   'B1 NTC +24 V ile R1=10 kΩ arasında; birleşim noktası U1 pin 3 (IN+) ucuna bağlıdır. NTC ısınınca direnç ve IN+ değişimini izle.',
   'Sanal NTC sıcaklığını 15 °C ve 35 °C karşılaştır; U1 pin 1 (OUT) geriliminin eşik geçildiğinde neden değiştiğini açıkla.',
   'UNI-T UT33D+ DCV ölçümünde kırmızı probu OUT pin 1, siyah probu 0 V noktasına getir. Gerçek sanal okumayı karşılaştır; ideal 24 V çıkış varsayma.'
  );
  ntc.practiceGuide.observations.push('NTC direnci ısındıkça azalır; V(IN+) 12 V eşik üstüne çıkınca sanal OUT yükselir. Gerçek donanım/pedagojik onay henüz verilmedi.');
 }
 L.practiceGuideBatchN=stats;
 L._practiceGuideBatchN=true;
})(typeof window==='undefined'?globalThis:window);
