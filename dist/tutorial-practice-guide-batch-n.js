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
  const isWired=p.wires.length>0 && lesson.kind!=='quiz' && !p.referenceOnly;
  const materials=(lesson.materials||[]).filter(x=>x.label&&x.why).slice(0,4);
  const observations=[];
  const steps=[];
  steps.push('Sanal dersin hedefi: '+title+'. Önce kaynak tanımını ve gösterilen malzemeleri incele.');
  if(materials.length){
   const first=materials[0];steps.push(clamp(first.label)+' elemanının bu dersteki rolünü oku: '+clamp(first.why));
   if(materials.length>1){const second=materials[1];steps.push(clamp(second.label)+' için şu görevi '+clamp(second.why)+' ifadesiyle karşılaştır.');}
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
   steps.push('Bu başlıkta doğrulanmış kablolu deney şeması bulunmuyor. Görsel materyali bağlı ve enerjili bir devre gibi değerlendirme.');
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
   method:isWired?'virtual-circuit-check':'reference-only',
   steps,observations
  };
  stats.guides++;
 }
 L.practiceGuideBatchN=stats;
 L._practiceGuideBatchN=true;
})(typeof window==='undefined'?globalThis:window);
