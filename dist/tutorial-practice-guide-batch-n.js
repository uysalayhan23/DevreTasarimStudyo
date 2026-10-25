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

 // SC483–502: replace generic opening sentences with concise, source-specific
 // virtual observations. No component, wire, electrical model or acceptance gate changes.
 const sequentialIntroductions={
  "opamp-apps-outline-025": "Bu kez potansiyometreyi küçük adımlarla değiştir: eviren LM358 girişine göre çıkışın ters yönlü değişimini gözle; sanal besleme sınırını unutma.",
  "opamp-apps-outline-026": "Evirmeyen devrede U1 pin 3 girişini, pin 2 geri beslemesini izle. Önce girişin gerçek gerilimini, sonra çıkışın nasıl büyüdüğünü karşılaştır.",
  "opamp-apps-outline-027": "FG1’in 20 Hz sinüsünü U1 pin 3’e bağladığında çıkış da değişir. UNI-T DCV anlık değer gösterir; bunu doğrudan AC RMS ölçümü sayma.",
  "opamp-apps-outline-028": "Bir DC giriş seç, U1 pin 3 ile çıkış pin 1’i karşılaştır. Geri besleme kazancı yükseltir ama çıkış besleme sınırını aşamaz.",
  "opamp-apps-outline-029": "İzleyici katının numarası basit: çıkış pin 1 tekrar pin 2’ye döner. Giriş ile çıkışı karşılaştır; katın amacı gerilimi katlamak değil.",
  "opamp-apps-outline-030": "Bu temrinde U1 pin 1→2 geri beslemesini bul. Giriş değişince çıkışın onu neden izlediğini ölçüm sonucundan anlat.",
  "opamp-apps-outline-031": "Karşılaştırıcıda pin 2 sabit eşik, pin 3 değişen giriş olsun. Giriş eşiği geçtiğinde U1 çıkışının neden yön değiştirdiğini gözle.",
  "opamp-apps-outline-032": "Önce referans bölücüsünü bul, sonra giriş tarafını değiştir. Eşik üstü ve altındaki iki sanal çıkış durumunu yan yana düşün.",
  "sensor-analog-apps-outline-054": "LDR’ye düşen ışığı değiştirdiğini düşün: ışıkla direnci, onunla pin 3 gerilimini takip et. Pin 2 referansı ile karşılaştır.",
  "sensor-analog-apps-outline-055": "NTC ısındığında direnci değişir: 15 °C ile 35 °C çıkışlarını karşılaştır. IN− referans kablosu koparsa HIGH sonucunu doğru kabul etme.",
  "opamp-apps-outline-033": "S1’e bastığında C1 hemen dolmaz. U1, kondansatör gerilimi referansı geçene kadar bekler; ON gecikmesini bu geçiş üzerinden gözle.",
  "opamp-apps-outline-034": "S1’i bıraktığında C1 enerjisini yavaşça boşaltır. U1 çıkışı referans altına düşünce değişir; OFF gecikmesinin sebebi budur.",
  "opamp-apps-outline-035": "İki ayrı DC giriş kullan: yalnız birini değiştirip U1 çıkışına bak. Fark yükselteci toplamı değil iki girişin farkını işler.",
  "opamp-apps-outline-036": "Çıkarıcı temrininde önce iki DC girişi eşitle, ardından birini değiştir. Farkın çıkışta hangi yönde göründüğünü not et.",
  "opamp-apps-outline-037": "Toplayıcıya gelen iki girişin her biri kendi 10 kΩ yolundan akar. Birini değiştirirken diğerini sabit tut ve çıkış etkisini karşılaştır.",
  "opamp-apps-outline-038": "İki girişli toplayıcıyı adım adım oku: önce yalnız A, sonra yalnız B değişsin. Çıkışın sanal 24 V sınırı içinde kalmasına dikkat et.",
  "opamp-apps-outline-039": "Giriş gerilimi aniden değişince kondansatör kısa süre akım taşır. Türev alıcıda sürekli seviye yerine değişim anının etkisini ara.",
  "opamp-apps-outline-040": "Türev alıcı temrininde basamak giriş ve giriş kondansatörü birlikte çalışır. Çıkışın kalıcı bir DC kazanç üretmesini bekleme.",
  "opamp-apps-outline-041": "İntegral alıcıda C1 geri besleme yolundadır. Sabit girişin çıkışı bir anda değil zaman içinde nasıl değiştirebildiğini incele.",
  "opamp-apps-outline-042": "Bu integratör uygulamasında R1 akım yolunu, C1 birikimi belirler. Zamana bağlı sanal çıkışı incele; tam donanım kabulü verme."
};
 for(const [id,intro] of Object.entries(sequentialIntroductions)){
  const lesson=L.byId[id];
  if(lesson?.kind!=='wiring'||!lesson.project?.wires?.length||
     lesson.pedagogyReview?.windowsVisualAcceptance!==false||
     lesson.practiceGuide?.method!=='virtual-circuit-check'||
     !lesson.practiceGuide.steps?.length)continue;
  lesson.practiceGuide.steps[0]=intro;
 }
 for(const [id,summary] of Object.entries({
  'opamp-apps-outline-033':'ON gecikmesi: S1 basılınca C1, 100 kΩ şarj yolundan yavaşça dolar. LM358P giriş gerilimi eşiği geçince çıkışı değiştirir.',
  'opamp-apps-outline-034':'OFF gecikmesi: S1 bırakılınca C1, 100 kΩ boşalma direnci üzerinden gerilimini kaybeder. LM358P eşik altına düşünce çıkışı değiştirir.'
 })){
  const lesson=L.byId[id];
  if(lesson?.kind==='wiring'&&lesson.pedagogyReview?.windowsVisualAcceptance===false&&
     lesson.summary==='Sanal op-amp, RC ve karşılaştırıcıyla '+(id.endsWith('033')?'ON':'OFF')+'-delay kontrol bağlantıları.')lesson.summary=summary;
 }

 // SC503–532: topic-specific virtual guidance. Source circuits and acceptance stay untouched.
 const lessonPrompts503532=[
 [
  "electronic-component-basics-outline-035",
  "r",
  "Diyot akımı yönlendirir, kondansatör dalgalanmayı azaltabilir. Bu doğrultmaç kartında kablolu deney olmadığını unutma."
 ],
 [
  "opamp-apps-outline-043",
  "w",
  "LM358 ve 1N4148 yolunu izle; potu değiştirip diyotlu geri beslemenin sanal çıkışı nasıl etkilediğine bak.",
  "Giriş değişirken diyot ve sanal voltmetre ilişkisini izle; dalga biçimi varsayma."
 ],
 [
  "electronic-component-basics-outline-036",
  "w",
  "İki LM358 paketindeki üç yükselteç katını bul. Giriş potlarını ayrı ayrı değiştirerek farkın çıkışta nasıl göründüğüne bak.",
  "İki girişi ayrı değiştir; çıkış farkını sanal ölçümle karşılaştır."
 ],
 [
  "opamp-apps-outline-044",
  "w",
  "Schmitt devresinde 10 kΩ giriş ve 47 kΩ pozitif geri besleme var. Potu iki yönde değiştirip çıkış geçişini izle.",
  "İleri ve geri geçişi ayrı karşılaştır; ölçülmemiş eşikleri kesin söyleme."
 ],
 [
  "oscillator-filter-apps-outline-031",
  "r",
  "Bobin ve kondansatörün enerji alışverişini düşün. Bu LC kartı çalışan bir osilatör değil."
 ],
 [
  "oscillator-filter-apps-outline-032",
  "r",
  "Kuvars kristal frekans kararlılığı için kullanılır. Sürücünün ve yükün rolünü düşün; kablolu devre yok."
 ],
 [
  "oscillator-filter-apps-outline-033",
  "r",
  "RC gecikmesinin osilatördeki geri beslemeye nasıl katkı verebileceğini düşün. Burada frekans ölçümü yok."
 ],
 [
  "oscillator-filter-apps-outline-034",
  "r",
  "Tek kararlı, çift kararlı ve kararsız multivibratörleri tetiklenme ve durum saklama açısından karşılaştır."
 ],
 [
  "oscillator-filter-apps-outline-035",
  "r",
  "Colpitts osilatörde iki kondansatör ve bir bobin nasıl geri beslemeye katılır? Bu bir malzeme kartıdır."
 ],
 [
  "oscillator-filter-apps-outline-036",
  "r",
  "Hartley osilatörde bobin sarımları geri beslemeye katkı verir. Kartta bağlı osilatör yok."
 ],
 [
  "oscillator-filter-apps-outline-037",
  "r",
  "Kristal tek başına bir osilatör değildir; sürücü ve yük koşullarını da düşün. Burada ölçüm yok."
 ],
 [
  "oscillator-filter-apps-outline-038",
  "r",
  "Üç RC kademesi faz kaymasına katkı verir. Devrenin salınması için kazanç koşulu da gerekir; kablolu deney yok."
 ],
 [
  "oscillator-filter-apps-outline-039",
  "r",
  "Wien köprüsündeki seri ve paralel RC kollarını ayır; frekans ile kazanç dengesini birlikte düşün."
 ],
 [
  "oscillator-filter-apps-outline-040",
  "w",
  "S1'e basınca iki BD139'un durumunu karşılaştır. C1 geçici sürenin oluşmasına yardım eder.",
  "S1 basılı ve serbestken iki kolektörü karşılaştır; sanal süreyi fiziksel kabul sayma."
 ],
 [
  "oscillator-filter-apps-outline-041",
  "w",
  "İki BD139 çapraz geri beslemeli. SET'e, sonra RESET'e basıp son durumun saklanmasını izle.",
  "SET ve RESET sonrası iki sanal kolektör voltmetresini karşılaştır."
 ],
 [
  "oscillator-filter-apps-outline-042",
  "w",
  "Butonsuz iki BD139 ve iki RC kolu dönüşümlü çalışmak üzere bağlı. Kondansatör yollarını izle.",
  "İki karşılıklı RC kolunu göster; ölçülmeyen frekans değeri verme."
 ],
 [
  "electronic-component-basics-outline-038",
  "w",
  "NE555'in RA, RB ve C1 zamanlama yolunu takip et. LED'in sanal davranışını incele.",
  "555 çıkış ve RC uçlarını kontrol et; sanal LED'i gerçek deney sayma."
 ],
 [
  "electronic-component-basics-outline-039",
  "w",
  "Potu değiştir; 1N4148 ile 12 V referansının çıkışı nasıl sınırlayabileceğini araştır.",
  "Girişin referans altı ve üstü seviyelerini sanal voltmetreyle karşılaştır."
 ],
 [
  "electronic-component-basics-outline-040",
  "w",
  "50 Hz sinüsü, C1'i, diyotu ve 100 kΩ yükü sırayla bul. Kenetleme yolunu incele.",
  "Tek DC anlık okumadan tüm AC dalga biçimini çıkarma."
 ],
 [
  "electronic-component-basics-outline-041",
  "w",
  "Pals üretecindeki NE555, RA, RB, C1 ve LED'i sırayla incele. Zamanlama yolunu bul.",
  "NE555 şarj-deşarj bağlantılarını kontrol et; fiziksel frekans ilan etme."
 ],
 [
  "electronic-component-basics-outline-042",
  "w",
  "Kırpıcı temrininde potu yavaşça değiştir. Diyot, referans ve voltmetreyi birlikte oku.",
  "Sanal girişi ve çıkışı farklı pot konumlarında karşılaştır."
 ],
 [
  "electronic-component-basics-outline-043",
  "w",
  "Kenetleyici temrininde sinüs kaynağından C1'e, diyota ve yüke giden yolu izle.",
  "Bir anlık ölçümü bütün sinüs periyodu sanma."
 ],
 [
  "electronic-component-basics-outline-044",
  "r",
  "Miller etkisi geri besleme ve kazançla ilişkilidir. Bu kart çalışan Miller devresi değildir."
 ],
 [
  "electronic-component-basics-outline-045",
  "r",
  "Bootstrap için kondansatörün uygun sürme bağlantısı gerekir. Kartta çalışan deney kurulmadı."
 ],
 [
  "electronic-component-basics-outline-046",
  "w",
  "Schmitt giriş potunu artırıp azalt; pozitif geri beslemenin geçişlere etkisini düşün.",
  "İleri ve geri eşikleri ölçmeden kesin histerezis sonucu söyleme."
 ],
 [
  "oscillator-filter-apps-outline-043",
  "w",
  "555'li osilatörde RA, RB, C1 ve LED yolunu incele. Sanal zamanlamayı izle.",
  "NE555 güç ve çıkış pinlerini bul; fiziksel frekans kabulü verme."
 ],
 [
  "oscillator-filter-apps-outline-044",
  "w",
  "PWM potunun iki yanındaki ters yönlü diyotlara bak; şarj ve deşarj yollarını ayır.",
  "Potu değiştirirken görev oranına ölçülmemiş kesin değer verme."
 ],
 [
  "oscillator-filter-apps-outline-045",
  "r",
  "Tek kararlı 555 tetikten sonra kısa bir durum değişimi oluşturur. Bu kartta kablolu zaman testi yok."
 ],
 [
  "oscillator-filter-apps-outline-046",
  "r",
  "Çift kararlı 555'in SET ve RESET komutlarını ayır. Kartta ölçüm devresi yok."
 ],
 [
  "oscillator-filter-apps-outline-047",
  "r",
  "Filtre bazı frekansları geçirir, bazılarını zayıflatır. Bu kart ölçüm devresi değil, malzeme tanıtımıdır."
 ]
];
 for(const [id,kind,intro,observation] of lessonPrompts503532){
  const lesson=L.byId[id],guide=lesson?.practiceGuide;
  if(!lesson||lesson.pedagogyReview?.windowsVisualAcceptance!==false||!guide?.steps?.length)continue;
  if(kind==='w'&&(lesson.kind!=='wiring'||!lesson.project?.wires?.length||
     guide.method!=='virtual-circuit-check'||!guide.observations?.length))continue;
  if(kind==='r'&&(lesson.kind!=='quiz'||lesson.project?.wires?.length||
     guide.method!=='reference-only'))continue;
  guide.steps[0]=intro;
  if(kind==='w'){
   const j=guide.observations.length-1;
   if(guide.observations[j].startsWith('Sanal simülasyonda varsa '))
    guide.observations[j]=observation;
  }else{
   const j=guide.steps.length-1;
   if(guide.steps[j].startsWith('Kavramı dersin hedefi '))
    guide.steps[j]='Bu bir kavram kartıdır; bağlı devre veya ölçüm yapılmış sayılmaz.';
  }
 }
 L.practiceGuideBatchN=stats;
 L._practiceGuideBatchN=true;
})(typeof window==='undefined'?globalThis:window);
