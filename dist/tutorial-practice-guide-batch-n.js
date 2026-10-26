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

 // SC533–582: independent reference-card pedagogy and quiz logic.
 // All 50 records have zero wires; keep them non-executable and not COMPLETE.
 const referenceBatch533582=[["oscillator-filter-apps-outline-048","Bir filtreyi üç malzemeyle tanı: direnç, kondansatör ve bobin. Önce hangisinin hangi frekansta etkili olduğunu düşün; bu kartta kablo yok.","Pasif filtrede hangi elemanlar kullanılabilir?","Direnç, kondansatör ve bobin","Yalnız mikrodenetleyici","Yalnız röle bobini"],["oscillator-filter-apps-outline-049","Aktif filtrede LM358 ile RC ağı birlikte düşün. Yükselteç beslemesi ve geri besleme olmadan çalışan filtre sonucu bekleme.","Aktif filtreyi pasif filtreden ayıran tipik özellik nedir?","Yükselteç gibi etkin bir kat içermesi","Her zaman transformatör kullanması","Bütün frekansları eşit yükseltmesi"],["oscillator-filter-apps-outline-050","Alçak geçiren filtrenin neyi koruduğunu düşün: yavaş değişim geçerken yüksek frekanslar zayıflar. Bağlı devre bu kartta yok.","Alçak geçiren filtrenin temel görevi nedir?","Düşük frekansları geçirip yüksekleri zayıflatmak","Yüksekleri geçirip düşükleri engellemek","Bütün frekansları aynı geçirmek"],["oscillator-filter-apps-outline-051","Yüksek geçiren filtrede seri kondansatörün etkisini düşün. Düşük frekans ve DC neden daha çok zayıflar?","Yüksek geçiren filtre hangi frekansları daha çok geçirir?","Yüksek frekansları","Yalnız DC bileşenini","Yalnız en düşük frekansları"],["oscillator-filter-apps-outline-052","Bant geçiren filtrede bir alt bir de üst sınır vardır. İkisinin arasında kalan frekansların davranışını düşün.","Bant geçiren filtre ne yapar?","Belirli bir frekans aralığını geçirir","Yalnız sıfır frekansı geçirir","Tüm frekansları engeller"],["oscillator-filter-apps-outline-053","Bant durduran filtrede belirli frekansların neden bastırıldığını düşün. RC çentik ağı malzeme fikridir; ölçüm devresi değildir.","Bant durduran filtre ne yapar?","Seçilmiş bir frekans aralığını zayıflatır","Sadece seçilen aralığı geçirir","Tüm frekansları yükseltir"],["oscillator-filter-apps-outline-054","Bir sesin taşıyıcıya bindirilip alıcıda ayrıldığını düşün. Verici ve alıcı blokları burada yalnız kavramsal gösterimdir.","Demodülasyonun amacı nedir?","Taşıyıcıdaki bilgiyi geri elde etmek","Besleme gerilimini sıfırlamak","Her sinyali yalnız DC yapmak"],["electronic-component-basics-outline-047","Genlik modülasyonunda taşıyıcının genliği bilgiyle değişir. Alıcı bu değişimden haberi geri çıkarmaya çalışır.","Genlik modülasyonunda taşıyıcının hangi özelliği değişir?","Genliği","Telin uzunluğu","Bağlantı rengi"],["electronic-component-basics-outline-048","FM'de bilgi taşıyıcının anlık frekansını değiştirir. Amplitüd ve frekans değişimini birbirine karıştırma.","FM'de bilgi taşıyıcının hangi özelliğine işlenir?","Anlık frekansına","Kablo kesitine","Malzemenin rengine"],["electronic-component-basics-outline-049","Vericiyi bir zincir gibi düşün: bilgi, taşıyıcı ve RF çıkış. Blok gösterimi çalışan radyo değildir.","Bir RF vericisinin temel görevi nedir?","Bilgiyi taşıyıcı üzerinden iletime hazırlamak","Alınan bilgiyi mutlaka ekrana yazmak","Sinyali yalnız ısıya çevirmek"],["electronic-component-basics-outline-050","GM vericisinde bilgi sinyali taşıyıcının genliğini değiştirir. Verici bloğu malzeme tanıtımıdır; kablolu test yok.","GM vericisinde taşıyıcı nasıl etkilenir?","Genliği bilgiyle değiştirilir","Yalnız kablo rengi değiştirilir","Frekansı daima sıfırlanır"],["oscillator-filter-apps-outline-055","FM vericide taşıyıcı frekansın bilgiyle değiştiğini düşün. Bu temrin kartında ölçülmüş RF çıkışı yok.","FM vericisi bilgiyi nasıl kodlar?","Taşıyıcının frekansını değiştirerek","Her zaman yalnız genliği artırarak","Sinyal üretecini kapatarak"],["oscillator-filter-apps-outline-056","FM verici temrininde bilgi ve taşıyıcı bloklarını ayır. Buradaki malzemeler çalışan verici anlamına gelmez.","FM verici denemesinde hangi sonuç doğrulanmalıdır?","Bilginin taşıyıcı frekansı etkilemesi","Yalnız LED renginin değişmesi","Her frekansın sıfır olması"],["electronic-component-basics-outline-051","Bir alıcı anten sinyalinden istediği kanalı seçer, sonra bilgiyi çıkarır. Bu kartta çalışan alıcı bağlantısı yok.","Alıcıda demodülasyondan önce tipik olarak ne gerekir?","İstenen sinyalin seçilmesi","Girişin mekanik anahtarla kesilmesi","Geri besleme direncinin çıkarılması"],["electronic-component-basics-outline-052","GM alıcısında taşıyıcıdaki genlik değişiminden bilgi elde edilir. Alıcı bloğu burada yalnız temsildir.","GM alıcısı hangi bilgiyi ayırmaya çalışır?","Genlik zarfına işlenmiş bilgiyi","Kablo kalınlığını","Yalnız besleme kutbunu"],["oscillator-filter-apps-outline-057","FM alıcısında kanal seçimi ve frekans değişiminden bilgi çıkarma ayrı işlerdir. Bu kartta RF ölçümü yok.","FM alıcısında bilgi hangi değişimden çıkarılır?","Frekans değişiminden","Kablo renginden","Direnç gövdesinin boyasından"],["oscillator-filter-apps-outline-058","FM alıcı temrininde önce kanal seçimini, sonra demodülasyonu düşün. Karttaki blok çizimi gerçek RF deneyini doğrulamaz.","FM alıcıda demodülasyon hangi amaçla yapılır?","Frekans değişimindeki bilgiyi elde etmek","Antenin boyunu ölçmek","Taşıyıcıyı sürekli sıfırlamak"],["electronic-component-basics-outline-053","Dijital devrede 0 ve 1 bilgisiyle çalışırız. Önce bu iki durumun mantık işlemlerinde ne anlama geldiğini düşün.","Dijital mantıkta temel iki durum hangileridir?","0 ve 1","Sadece -5 ve +5","Yalnız analog frekans"],["electronic-component-basics-outline-054","AND, OR ve NOT kapılarını yan yana düşün. Aynı girişlerde farklı sonuç vermeleri asıl dersimiz.","Kapılar neden doğruluk tablosuyla karşılaştırılır?","Girişe göre çıkışları farklıdır","Hepsi her zaman 1 üretir","Bütün kapılar aynı işlevdedir"],["number-systems-outline-001","Aynı sayı ikilik, onluk ve onaltılık sistemde farklı yazılabilir. Önemli olan tabanı bilmek.","Sayı tabanı neyi belirler?","Kullanılan basamak değerlerini","Devrenin kablo rengini","Daima negatif sayıları"],["number-systems-outline-002","Onluk sayma sisteminde her basamak solda on kat değer kazanır. Günlük sayıları bu mantıkla oku.","Onluk sistemin tabanı kaçtır?","10","2","16"],["number-systems-outline-003","İkilik sistem yalnız 0 ve 1 kullanır. Örneğin 101 ikilik sayısının onluk karşılığını düşün.","İkilik sistemde hangi rakamlar kullanılır?","0 ve 1","0 ile 9 arası","A ile F arası"],["number-systems-outline-004","Onaltılık sistemde 0–9'un ardından A–F gelir. Bir hex basamak dört bitlik grubu temsil edebilir.","Onaltılık sistemde F rakamının değeri kaçtır?","15","10","16"],["number-systems-outline-005","Bir hex basamağı dört bitlik gruba dönüştür. Örneğin A için 1010 yazılır.","Hex A'nın dört bitlik ikilik karşılığı nedir?","1010","1000","1111"],["electronic-component-basics-outline-055","Bir mantık kapısına iki giriş verince hangi çıkışın olacağını doğruluk tablosuyla görebiliriz.","Mantık kapısının çıkışını ne belirler?","Giriş değerleri ve kapı işlevi","Sadece gövde rengi","Yalnız kütüphane sırası"],["digital-logic-apps-outline-017","NAND, AND sonucunun tersidir. İki giriş de 1 iken NAND neden 0 olur, düşün.","NAND kapısı 1 ve 1 girişinde ne üretir?","0","1","Tanımsız"],["digital-logic-apps-outline-018","Kaynak başlığında NOR için VEYA yazıyor; işlevi VEYA DEĞİL'dir. İki giriş 0 olduğunda çıkışı düşün.","NOR kapısının 0 ve 0 girişinde çıkışı nedir?","1","0","Daima belirsiz"],["digital-logic-apps-outline-019","EX-OR yani XOR, iki giriş farklıyken 1 üretir. Kartta doğru XOR entegresinin pin etiketlerini incele.","XOR kapısında girişler 1 ve 1 ise çıkış nedir?","0","1","Her zaman yüksek empedans"],["digital-logic-apps-outline-020","EX-NOR yani XNOR, iki giriş aynıyken 1 üretir. Kartta doğru XNOR entegresi gösterilmeli.","XNOR kapısında girişler 1 ve 1 ise çıkış nedir?","1","0","Daima yüksek empedans"],["electronic-component-basics-outline-056","BUFFER girişteki lojik düzeyi koruyarak çıkışa iletir. Bu kart yalnız kavramsal anlatımdır.","Tampon kapısı giriş 1 iken tipik olarak ne üretir?","1","0","Her zaman açık devre"],["digital-logic-apps-outline-021","AND kapısında iki şartın da gerçekleşmesi gerekir. Tek giriş 1 iken neden çıkış 0, düşün.","AND kapısı 1 ve 0 girişinde ne üretir?","0","1","Daima belirsiz"],["digital-logic-apps-outline-022","OR kapısında girişlerden biri 1 olması yeterlidir. 0 ve 1 durumunu karşılaştır.","OR kapısı 0 ve 1 girişinde ne üretir?","1","0","Daima yüksek empedans"],["electronic-component-basics-outline-057","NOT tek girişli tersleyicidir. 1 girişinin neden 0 çıktığını düşün.","NOT kapısında giriş 1 ise çıkış nedir?","0","1","Girişin iki katı"],["electronic-component-basics-outline-058","BUFFER terslemez. Giriş ve çıkışın aynı olmasını doğruluk tablosunda düşün.","BUFFER kapısında giriş 0 ise çıkış nedir?","0","1","Her zaman yüksek empedans"],["digital-logic-apps-outline-023","NAND temrininde AND'in tersini düşün. İki giriş 1 olduğunda NAND çıkışı düşer.","NAND 1 ve 1 girişinde kaç üretir?","0","1","2"],["digital-logic-apps-outline-024","NOR temrininde OR'in tersini düşün. 0 ve 0 iken çıkış yüksek olur.","NOR 0 ve 0 girişinde kaç üretir?","1","0","2"],["digital-logic-apps-outline-025","XOR temrininde yalnız farklı iki giriş 1 üretir. SN74HC86N'nin karttaki doğru işlevini tanı.","XOR 1 ve 0 girişinde kaç üretir?","1","0","2"],["digital-logic-apps-outline-026","XNOR temrininde aynı iki giriş 1 üretir. CD4077BE'nin görevini tanı.","XNOR 0 ve 0 girişinde kaç üretir?","1","0","2"],["electronic-component-basics-outline-059","Boolean matematiğinde 0 ve 1 ile mantık kuralları yazarız. Artı işareti burada VEYA anlamına gelir.","Boolean cebrinde A + 0 sonucu nedir?","A","0","1"],["electronic-component-basics-outline-060","Özdeşlik sayesinde mantık ifadesi biçim değiştirse de anlamı korunur. A + A ifadesini incele.","Boolean özdeşliğinde A + A neye eşittir?","A","0","1"],["electronic-component-basics-outline-061","VE işlemi 1 ile yapıldığında değeri korur. A ve 1'in sonucunu düşün.","Boolean cebrinde A · 1 neye eşittir?","A","0","1"],["electronic-component-basics-outline-062","Mantık ifadesini sadeleştirirken aynı sonucu veren daha az terim ararız. A + A·B örneğini düşün.","A + A·B ifadesinin sade hâli nedir?","A","B","A·B"],["electronic-component-basics-outline-063","Bir Boolean ifadesini kapılara çevirirken VE ve VEYA işlemlerini ayır. A·B + C örneğine bak.","A·B + C için hangi kapı dizisi uygundur?","Önce AND, sonra OR","Önce yalnız NOT","Yalnız tek BUFFER"],["electronic-component-basics-outline-064","Kapı şemasını Boolean ifadesine çevirmek için önce her kapının girişini ve çıkışını izle.","İki girişli AND kapısının Boolean gösterimi hangisidir?","A·B","A+B","A'"],["electronic-component-basics-outline-065","Karnaugh haritası aynı mantığı daha az terimle yazmaya yardım eder. Komşu hücrelere bak.","Karnaugh haritası ne için kullanılır?","Mantık ifadesini sadeleştirmek","RF frekansını ölçmek","Motor hızını artırmak"],["electronic-component-basics-outline-066","İki değişkenli Karnaugh haritasında dört olası giriş durumu vardır. 00, 01, 10 ve 11'i düşün.","İki değişkenli Karnaugh haritasında kaç hücre vardır?","4","2","8"],["electronic-component-basics-outline-067","Üç değişkenli Karnaugh haritasında sekiz hücre vardır. Komşuların tek bit farkına dikkat et.","Üç değişkenli Karnaugh haritası kaç hücre içerir?","8","4","16"],["electronic-component-basics-outline-068","Dört değişkenli Karnaugh haritasında on altı hücre vardır. Gray sırasıyla komşu grupları düşün.","Dört değişkenli Karnaugh haritasında kaç hücre vardır?","16","8","32"],["electronic-component-basics-outline-069","Birleşik mantık devresinde AND, OR ve NOT birlikte iş görebilir. Ara çıkışların bir sonraki kapıya giriş olduğunu düşün.","Birleşik mantık devresi genellikle neyle kurulur?","Birden fazla mantık kapısının bağlantısıyla","Yalnız çıplak bir kondansatörle","Yalnız kablo rengi değiştirerek"],["digital-logic-apps-outline-027","Kod çözücü, girişteki bit desenini seçilen çıkışa eşler. SN74HC138N'yi blok fikri olarak tanı.","Bir kod çözücü giriş kodunu neye dönüştürür?","Belirli bir çıkış seçimine","Her zaman analog sinüse","Kondansatör kapasitesine"]];
 const matchingReferenceLesson=(id)=>{
  const lesson=L.byId[id],project=lesson?.project;
  return lesson?.kind==='quiz' && lesson.designStandard!=='rich-reference-v1' &&
   Array.isArray(project?.wires) && project.wires.length===0 &&
   lesson.practiceGuide?.method==='reference-only' &&
   lesson.pedagogyReview?.physicalAcceptance!==true &&
   lesson.pedagogyReview?.independentPedagogicalAcceptance!==true;
 };
 for(const [id,intro,question,correct,wrong1,wrong2] of referenceBatch533582){
  if(!matchingReferenceLesson(id))continue;
  const lesson=L.byId[id],guide=lesson.practiceGuide;
  guide.steps[0]=intro;
  const last=guide.steps.length-1;
  if(guide.steps[last].startsWith('Kavramı dersin hedefi '))
   guide.steps[last]='Bu bir bilgi kartıdır; kablolu devre veya fiziksel ölçüm değildir.';
  lesson.quiz={question,options:[correct,wrong1,wrong2],answer:0,
   why:correct+'. Kartın sorusu teoriyi yoklar; elektriksel native veya fiziksel kabul kanıtı değildir.'};
 }
 // The earlier source-template copied OR/NOR packages into XOR/XNOR cards.
 // The real manufacturer package catalog already contains the correct models.
 for(const [id,oldType,newType,oldReviewType,newReviewType] of [
  ['digital-logic-apps-outline-019','sn74hc32n','sn74hc86n','tutorial-logic-or','tutorial-logic-xor'],
  ['digital-logic-apps-outline-020','sn74hc02n','cd4077be','tutorial-logic-nor','tutorial-logic-xnor']
 ]){
  if(!matchingReferenceLesson(id))continue;
  const lesson=L.byId[id],parts=lesson.project.components;
  if(parts.length!==1||parts[0].typeId!==oldType||
    !Array.isArray(lesson.pedagogyReview?.componentIds)||
    lesson.pedagogyReview.componentIds.length!==1||
    lesson.pedagogyReview.componentIds[0]!==oldReviewType)continue;
  parts[0].typeId=newType;
  lesson.pedagogyReview.componentIds[0]=newReviewType;
 }

 // SC583–632: retain real electrical graphs and teach the source topic honestly.
 const sequential583632=[["583","İki bit dört seçim sunar. SN74HC138 üç girişli olduğundan burada üçüncü giriş sabitlenmeden gerçek 2→4 deney yok.","İki bit kaç seçim kodlar?","4","8","16"],["584","Üç bitin 000 ile 111 arasındaki sekiz durumunu düşün. SN74HC138 gerçek bağlantı değil, pin referansıdır.","Üç bit kaç durum gösterir?","8","4","16"],["585","BCD, onluk rakamları dört bit ile gösterir. Bu kart kodu tanıtır; on çıkışlı bir çözücü kurulu değil.","BCD hangi onluk rakamları kodlar?","0–9","0–15'in tümü","Yalnız 0 ve 1"],["586","CD4511'e gelen BCD kodu yedi segmentin hangisinin yanacağını belirler. Burada devre henüz kablolanmış değil.","BCD–7 segment çözücü ne yapar?","Rakamın segmentlerini seçer","Motor hızını ölçer","Analog sinüs üretir"],["587","Öncelikli kodlayıcı, etkin girişlerden önceliği yüksek olanı kodlar. SN74HC148'i malzeme olarak incele.","8 girişli kodlayıcının kaç kod biti vardır?","3","8","2"],["588","Dört seçenek iki bit ile temsil edilir. Kodlayıcıyı gerçek bağlantı olmadan yalnız işlev olarak öğren.","4 seçenek kaç bit ile gösterilir?","2","3","4"],["589","Sekiz giriş için üç bit gerekir. SN74HC148'in giriş önceliği de sonucu etkiler.","8 farklı seçenek kaç bit ile gösterilir?","3","2","4"],["590","Desimal girişli kodlayıcı, seçilen rakamı BCD karşılığıyla anlatır. Şimdilik kablolu encoder yok.","Onluk 9'un BCD gösterimi nedir?","1001","1111","1000"],["591","Kodlayıcı temrininde önce çoklu girişten kodlu çıkışı anlamaya çalış. SN74HC148 burada referanstır.","Öncelikli encoder iki giriş etkinse neyi seçer?","Önceliği yüksek girişi","Rastgele girişi","Her zaman sıfırı"],["592","Kod çözücüde giriş kodu seçilen çıkışı belirler. SN74HC138'in üç girişini tanı.","3→8 çözücüde kaç seçim çıkışı vardır?","8","3","16"],["593","CD4511 ve 7 segment göstergeyi tanı. BCD kodu segment desenine dönüşür; kablo burada yok.","7 segment gösterge nasıl rakam oluşturur?","Uygun segmentleri yakarak","Faz sırası değiştirerek","Sadece direnç rengiyle"],["594","SN74HC151 sekiz veri girişinden birini seçer. Seçim hatlarının rolünü düşün.","8→1 MUX kaç seçim biti ister?","3","8","1"],["595","Demultiplekser veriyi seçilen çıkışa yönlendirir. SN74HC138 bir çözücü olarak buna temel olabilir.","Demultiplekserin temel görevi nedir?","Veriyi seçilen çıkışa yönlendirmek","Verileri toplamak","Her zaman sinüs üretmek"],["596","Sayısal toplama, çıkarma ve karşılaştırma, bitler üzerinde kurulur. Mevcut kart bu işlemleri kavramsal anlatır.","İkilik toplayıcı neyle işlem yapar?","Giriş bitleriyle","Motor fazlarıyla","Yalnız analog gerilimle"],["597","UYARI: Bu sayısal toplayıcı başlığının altında LM358 analog devresi açılıyor. İkilik toplama burada gerçekleştirilmez.","Sayısal toplayıcının sonuçları hangileridir?","Toplam ve elde","Yalnız gerilim kazancı","Sadece faz sırası"],["598","UYARI: Yarım toplayıcı yerine LM358 analog şeması var. Teoride SUM için XOR, CARRY için AND gerekir.","Yarım toplayıcının SUM işlevi nedir?","XOR","OR","NOT"],["599","UYARI: Tam toplayıcı başlığındaki LM358 şeması üç giriş bitini işlemez. Gerçek sayısal kabul bekliyor.","Tam toplayıcı kaç giriş biti kullanır?","3","1","2"],["600","UYARI: Sayısal çıkarıcı yerine LM358 analog şeması var. Ödünç ve fark için başka topoloji gerekir.","Sayısal çıkarıcının çıktıları nelerdir?","Fark ve ödünç","Yalnız analog kazanç","Yalnız frekans"],["601","UYARI: Yarım çıkarıcı yerine LM358 analog şeması var. Fark işlevini XOR ile düşün; fiziksel devre doğru değil.","Yarım çıkarıcıda fark hangi kapıyla bulunur?","XOR","NOT","OR"],["602","UYARI: Tam çıkarıcı başlığında LM358 analog şeması var; gelen ödünç bitini işleyecek sayısal devre yok.","Tam çıkarıcıda ek giriş hangisidir?","Gelen ödünç","Motor fazı","Analog frekans"],["603","UYARI: Analog LM358 eşik karşılaştırması çok bitli sayısal büyüklük karşılaştırıcısı değildir.","Sayısal karşılaştırıcı hangi ilişkiyi bildirir?","Büyük, eşit veya küçük","Yalnız frekans","Sadece kablo rengi"],["604","UYARI: Tam toplayıcı temrininde LM358 analog şeması açılıyor. Sayısal toplam/elde ölçülmüş değil.","İkilik 1+1 sonucu nedir?","10","11","01"],["605","UYARI: Tam karşılaştırıcı temrininde LM358 analog eşik devresi var. Çok bitli eşitlik ölçümü yok.","Eşit girişlerde karşılaştırıcı hangi durumu bildirir?","Eşit","Büyüktür","Küçüktür"],["606","Ardışık mantıkta önceki durum sonucu etkileyebilir. Flip-flopların belleğini bu fikirle incele.","Ardışık mantığı ayıran özellik nedir?","Önceki durumu saklamak","Sadece analog olmak","Kablo uzunluğu"],["607","Bir flip-flop tek bit saklar. RS, D ve JK türlerini giriş ile saat koşullarına göre ayır.","Bir flip-flop kaç bit saklar?","1","8","16"],["608","RS flip-flopta SET durumu kurar, RESET temizler. NAND kapısı burada yalnız parça referansıdır.","RS'de SET ne işe yarar?","Durumu 1 yapar","Hızı ikiye katlar","Saatini durdurur"],["609","D flip-flop saat kenarında D girişini Q'ya aktarır. SN74HC74'ün pinlerini tanı; burada kurulum yok.","D flip-flop neyi örnekler?","D girişini","Motor akımını","Her zaman sıfırı"],["610","T flip-flop T etkin olduğunda her saat kenarında durum değiştirir. CD4027 aslında JK'dir; T için bağlantı gerekir.","T=1 iken tetikte ne olur?","Durum terslenir","Her zaman sıfırlanır","Hiç değişmez"],["611","RS temrininde SET ve RESET'i karşılaştır. NAND entegresi tek başına bağlı RS devresi sayılmaz.","RS'de RESET'in görevi nedir?","Durumu sıfırlamak","Sürekli artırmak","Frekans ölçmek"],["612","JK, D ve T davranışlarını ayır. Karttaki CD4027 JK modelidir; diğer işlevlerin devresi kurulu değil.","JK'de J=K=1 ise ne olur?","Durum terslenir","Her zaman sıfır olur","Daima korunur"],["613","Sayıcı darbelerle sayıyı değiştirir; kaydedici bitleri tutar. 74HC595 kaydırmalı kaydedici örneğidir.","Sayıcı ne yapar?","Darbe geldikçe sayma durumunu değiştirir","Sadece kabloyu boyar","Yalnız yükseltir"],["614","UYARI: Asenkron sayıcı başlığında START/STOP kontaktörlü üç faz motor şeması var; bu şema darbe saymaz.","Asenkron sayaçta değişim nasıl yayılır?","Kademeden kademeye","Motor fazlarını değiştirerek","Direnç rengiyle"],["615","UYARI: 3 bit yukarı sayaç yerine üç faz motor/kontaktör devresi var. Sekiz sayaç durumu doğrulanmış değil.","3 bit sayaç kaç durum içerir?","8","3","16"],["616","UYARI: 3 bit aşağı sayaç yerine üç faz motor/kontaktör şeması var. Bit dizisi ölçülmüş değil.","3 bit aşağı sayaç 000'dan sonra nereye döner?","111","001","010"],["617","UYARI: Modlu asenkron sayaç başlığında motor şeması açılıyor. Mod sınırı ve sayma mantığı bulunmuyor.","Mod-6 sayaç kaç durum kullanır?","6","8","16"],["618","Senkron sayıcının bellek bitleri aynı saatle tetiklenir. CD4017 ise dekad sayıcıdır, tam 3 bit örneği değildir.","Senkron sayaçta ortak olan nedir?","Saat işareti","Kablo rengi","Yalnız güç hattı"],["619","Üç bit yukarı sayıcının 000–111 sırasını düşün. CD4017 bu bitleri doğrudan üretmez; kart kavramsaldır.","011'den sonra üç bit yukarı sayaç nereye geçer?","100","010","111"],["620","Üç bit aşağı sayıcının 111–000 sırasını düşün. CD4017 kartını kablolu 3 bit sayaç sanma.","100'den sonra üç bit aşağı sayaç nereye geçer?","011","101","000"],["621","Halka sayıcıda bir etkin durum sırayla dolaşır. CD4017 çıkış sırası benzer fikir verir; kurulu ring devresi değil.","Halka sayaçtaki temel fikir nedir?","Etkin durumun dolaşması","Her bitin hep 1 olması","Çıkışın rastgele olması"],["622","Kaydedici bitleri tutar veya kaydırır. 74HC595'in seri giriş-paralel çıkış örneğini incele.","Kaydedici temel olarak ne tutar?","Bit bilgisini","Motor hızı","Yalnız ısı"],["623","Seri giriş-seri çıkış bitlerin saatle sırayla kaymasıdır. 74HC595 asıl olarak SIPO'dur; burada SISO test edilmedi.","SISO'da bitler nasıl aktarılır?","Saatle sırayla","Tümü aynı anda","Yalnız sinüsle"],["624","74HC595 seri girişten paralel çıkışa veri kaydırır. Bu kartta gerçek pinler görülebilir, devre kurulmamıştır.","74HC595 hangi veri yönüyle bilinir?","Seri giriş-paralel çıkış","Paralel giriş-seri çıkış","Sadece analog giriş"],["625","Paralel giriş-paralel çıkış için eşzamanlı bit yakalama gerekir. 74HC595'in seri girişli olduğunu unutma.","PIPO'da bitler nasıl aktarılır?","Birlikte paralel","Tek tek seri","Yalnız analog"],["626","PISO paralel yüklemeyi seri aktarır. Karttaki 74HC595 bunu doğrudan yapmaz; gerçek PISO devresi yok.","PISO'nun çıkış tipi nedir?","Seri","Paralel","Sadece analog"],["627","Kaydırmalı kaydedicide bitler saat darbeleriyle konum değiştirir. 74HC595 buna bir örnektir.","Kaydırmayı hangi sinyal tetikler?","Saat darbesi","Motor kontaktörü","Direnç rengi"],["628","UYARI: Asenkron yukarı sayaç temrininde motor/kontaktör şeması var. Bu üç fazlı şema sayı üretmez.","Yukarı sayıcı darbe gelince ne yapar?","Sayıyı artırır","Motoru çalıştırır","Daima aynı kalır"],["629","Senkron yukarı sayaç ortak saat kullanır. CD4017 örnek kartı gerçek üç bit sayaç kurulumu değildir.","Senkron sayaçta saat nasıl paylaşılır?","Ortak hatla","Rastgele hatla","Yalnız LED ile"],["630","Johnson sayaçta son bitin tersi ilk girişe geri döner. CD4017 kartı gerçek Johnson bağlantısı değildir.","Johnson geri beslemesinde hangi bit kullanılır?","Son bitin tersi","Yalnız sıfır","Motor fazı"],["631","CD4017 0–9 çıkışlarını sırayla seçen bir dekad sayıcıdır. Bu kartta kablo ve saat darbesi yok.","0–9 sayacı kaç durum içerir?","10","8","16"],["632","Ring sayıcının tek etkin durumu sırayla dolaşır. CD4017 bu fikre benzer; bağlı ring kaydedici değildir.","Halka sayaçta ne dolaşır?","Etkin durum","Direnç rengi","Her zaman sıfır"]];
 const mismatchAnalog=new Set([597,598,599,600,601,602,603,604,605]);
 const mismatchMotor=new Set([614,615,616,617,628]);
 for(const [scRaw,intro,question,correct,wrong1,wrong2] of sequential583632){
  const sc=Number(scRaw),lesson=L.lessons[sc-1],p=lesson?.project,guide=lesson?.practiceGuide;
  if(!lesson||!p||!guide?.steps?.length||!lesson.quiz||
     lesson.designStandard==='rich-reference-v1'||
     lesson.pedagogyReview?.independentPedagogicalAcceptance===true)continue;
  const mismatch=mismatchAnalog.has(sc)||mismatchMotor.has(sc);
  if(mismatch){
   const expected=mismatchAnalog.has(sc)?'lm358p-dip8':'motor-3p';
   if(lesson.kind!=='wiring'||!p.wires?.length||!p.components.some(c=>c.typeId===expected))continue;
   lesson.pedagogyReview.titleTopologyStatus='REVIEW';
   lesson.pedagogyReview.titleTopologyIssue=mismatchAnalog.has(sc)?
      'DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH':'DIGITAL_COUNTER_TITLE_HAS_MOTOR_CONTACTOR_GRAPH';
   lesson.pedagogyReview.nativeDynamicAcceptance=false;
   lesson.pedagogyReview.physicalAcceptance=false;
   lesson.pedagogyReview.windowsVisualAcceptance=false;
   lesson.pedagogyReview.independentPedagogicalAcceptance=false;
   guide.heading='Başlık ile devre uyuşmuyor — sayısal işlev doğrulanmadı';
   if(!guide.observations.some(s=>s.startsWith('UYARI: Bu şema')))
     guide.observations.unshift('UYARI: Bu şema başlıktaki sayısal işlevi gerçekleştirmez; orijinal analog veya motor bağlantısı korunmaktadır.');
  }else if(lesson.kind!=='quiz'||p.wires?.length!==0||
           guide.method!=='reference-only')continue;
  guide.steps[0]=intro;
  lesson.quiz={question,options:[correct,wrong1,wrong2],answer:0,
      why:correct+'. Bu soru kavramsaldır; native, Windows veya fiziksel kabul kanıtı değildir.'};
 }
 // Reuse verified PDIP physical catalog items; no wire is added.
 for(const [sc,oldTypes,newType,label] of [
  [586,['tutorial-number-bcd'],'cd4511be','CD4511BE · BCD → 7 segment çözücü'],
  [587,['proximity','capacitive-detector','photoeye'],'sn74hc148n','SN74HC148N · 8→3 öncelikli kodlayıcı'],
  [591,['proximity','capacitive-detector','photoeye'],'sn74hc148n','SN74HC148N · 8→3 öncelikli kodlayıcı']
 ]){
  const lesson=L.lessons[sc-1],p=lesson?.project;
  if(!lesson||lesson.kind!=='quiz'||p?.wires?.length!==0||
   p.components.length!==oldTypes.length||
   !p.components.every((c,i)=>c.typeId===oldTypes[i])||
   !Array.isArray(lesson.pedagogyReview?.componentIds))continue;
  p.components=[{...p.components[0],typeId:newType,label,realElectronicsReplacement:true}];
  lesson.pedagogyReview.componentIds=[newType];
  lesson.pedagogyReview.titleTopologyStatus='REVIEW';
  lesson.pedagogyReview.titleTopologyIssue='REFERENCE_ONLY_NO_WIRED_DIGITAL_CIRCUIT';
 }
 // These conceptual hardware illustrations are not equivalent wired circuits.
 for(const [sc,actual,reason] of [
  [583,'sn74hc138n','THREE_TO_EIGHT_CHIP_ON_TWO_TO_FOUR_REFERENCE'],
  [619,'arduino-cd4017','DECADE_COUNTER_NOT_THREE_BIT_SYNCHRONOUS_UP'],
  [620,'arduino-cd4017','DECADE_COUNTER_NOT_THREE_BIT_SYNCHRONOUS_DOWN'],
  [623,'arduino-74hc595','SIPO_CHIP_SHOWN_FOR_SISO'],
  [625,'arduino-74hc595','SIPO_CHIP_SHOWN_FOR_PIPO'],
  [626,'arduino-74hc595','SIPO_CHIP_SHOWN_FOR_PISO'],
  [630,'arduino-cd4017','DECADE_COUNTER_NOT_JOHNSON_SHIFT_REGISTER']
 ]){
  const l=L.lessons[sc-1];
  if(l?.kind!=='quiz'||l.project?.wires?.length!==0||
      !l.project.components.some(c=>c.typeId===actual))continue;
  l.pedagogyReview.titleTopologyStatus='REVIEW';
  l.pedagogyReview.titleTopologyIssue=reason;
 }
 L.practiceGuideBatchN=stats;
 L._practiceGuideBatchN=true;
})(typeof window==='undefined'?globalThis:window);
