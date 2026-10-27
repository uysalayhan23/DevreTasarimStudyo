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

 // SC633–682: plain Turkish topic-specific exercises, without granting COMPLETE.
 const sequential633682=[["633","Kaydedicide bitler saat darbeleriyle sırayla ilerler. 74HC595'i tanı; bu kartta bağlı uygulama yok.","74HC595 hangi aktarımı örnekler?","Seri girişten paralel çıkışa","Paralel girişten analog çıkışa","Üç fazlı motora"],["634","ADC analog büyüklüğü sayıya, DAC sayı bilgisini analog değere çevirir. İki yönü karıştırma.","ADC ne yapar?","Analog girişten sayısal kod üretir","Sayısal koddan motor devri üretir","Yalnız AC frekansı ölçer"],["635","ADC0804'te analog girişin sayısal basamaklara dönüşmesini düşün. Ölçülmüş dönüşüm bu kartta yok.","8 bit ADC kaç farklı kod üretir?","256","8","1024"],["636","DAC0808'in sayısal girişleri analog akımla ilişkilidir; uygun çıkış katı olmadan gerilim sonucu varsayma.","DAC'nin temel işlevi hangisidir?","Sayısal kodu analog büyüklüğe çevirmek","Analog büyüklüğü dijital kodlamak","Kontak açmak"],["637","Üç fazlı asenkron motorda döner manyetik alanı tanı. START/STOP şemasındaki kontaktörü motor prensibinden ayrı düşün.","Üç fazlı asenkron motoru döndüren alan nasıldır?","Döner manyetik alan","Sabit DC alanı","Sadece statik mıknatıs"],["638","Sargılardaki döner alan ile rotor arasında hız farkı oluşur. Bu ekrandaki şema bir direkt yol verme örneğidir.","Asenkron motorda kayma neden vardır?","Rotor hızı döner alan hızından farklıdır","Rotor ve alan daima aynı hızdadır","Frekans daima sıfırdır"],["639","UYARI: Başlık motor etiketi ve klemens kutusu ama şema START/STOP devresidir. Etiket değerleri ve altı uçlu bağlantı kabul edilmedi.","Motor etiketinde hangi bilgi aranır?","Anma gerilimi ve güç bilgisi","Yalnız boya rengi","Butonun plastik türü"],["640","UYARI: Senkron hız ve kayma başlığında yalnız direkt yol verme devresi var. Devir/frekans ölçümü doğrulanmadı.","Dört kutuplu motorda 50 Hz senkron hız kaç dev/dakikadır?","1500","3000","750"],["641","Bu ders yıldız-üçgen paket şalterle yol vermeyi gösterir. Her motor için uygun olduğu varsayılmamalı.","Yıldız konumunda sargı faz gerilimi hat gerilimine göre nasıldır?","Daha düşüktür","Her zaman daha yüksektir","Sıfır olmak zorundadır"],["642","S1 paket şalterinde 0 kapalı, 1 ileri, 2 geri demek. İki fazın yer değiştirdiğini sanal motorun dönüş yönünde gözlemle; Windows/3D kabulü ayrıca bekliyor.","Üç fazlı motorun yönü hangi ilkeyle tersine döner?","İki fazın yerini değiştirerek","Koruma iletkenini keserek","Sadece STOP'a basarak"],["643","UYARI: Frenleme başlığındaki yıldız-üçgen/kontaktör zinciri ayrı bir frenleme işlevini kanıtlamıyor. Kabul açık.","Elektriksel frenleme neden yol vermeden ayrıdır?","Dönme enerjisini azaltmayı hedefler","Yalnız motoru çalıştırır","Sadece etiketi değiştirir"],["644","UYARI: Tek fazlı yardımcı sargı başlığında üç fazlı motor ve yön kumandası var. Yardımcı sargı gösterilmemiş.","Yardımcı sargı tek fazlı motorda neye yardım eder?","İlk kalkış için faz kaymasına","PE hattını kesmeye","Sadece etikete"],["645","Uygulama kartında endüktif, kapasitif ve optik sensörleri ayrı düşün. Burada sensörlü devre kurulmamış.","Optik algılama hangi etkiyi kullanır?","Işığı","Manyetik kutup sayısını","Sargı direncini"],["646","Güç yolu motorun yük akımını, kumanda yolu kontaktör bobininin komutunu taşır. Şemada bu iki yolu ayır.","Kumanda devresi genellikle neyi sürer?","Kontaktör bobinini","Motorun tüm faz akımını doğrudan","Koruma toprağını"],["647","Kontaktörde bobin enerjilendiğinde ana ve yardımcı kontakların durumunun değişebileceğini izle.","Kontaktörde A1 ve A2 neyin uçlarıdır?","Bobinin","Motor sargısının","PE'nin"],["648","UYARI: Röle-kontaktör farkı başlığında tek kontaktör devresi var. İki ayrı gerçek cihazın karşılaştırması yapılmıyor.","Kontaktörün ana kontakları hangi iş için tasarlanır?","Yük/güç devresini anahtarlamak","Sadece ekran çizmek","Sürekli açık kalmak"],["649","Kontaktörün ana kontaklarını ve yardımcı NO kontağını ayrı incele. Aynı K1 etiketi bağlı aygıtı işaret eder.","Normalde açık yardımcı kontaktör kontağı ne zaman kapanabilir?","Bobin çekince","Her zaman açıkken","PE kopunca"],["650","NO buton basılınca kapanır, NC buton basılınca açılır. Bu kart parça tanıtır; enerjili deney değildir.","Normalde kapalı STOP butonuna basınca kontak ne olur?","Açılır","Kısa devre olur","Kesinlikle kapanır"],["651","Aşırı akım koruması, faz kontrolü, zaman rölesi ve lamba ayrı görevler üstlenir. Görselde kablo yok.","Aşırı akım korumasının amacı nedir?","Aşırı yükte devreyi korumak","Motor hızını sabitlemek","Sadece ışık üretmek"],["652","Sembolleri tanırken NO ve NC uçları, bobin ve termik kontağı birbirine karıştırma.","NO kontak şemada neyi anlatır?","Normal durumda açık kontağı","Sürekli toprak hattını","Diyot kutbunu"],["653","PLC bir programı giriş ve çıkış sinyalleriyle yürütür. Siemens donanım kartı gerçek program testi değildir.","PLC'nin açılımı hangi cihazı anlatır?","Programlanabilir lojik denetleyici","Pasif kondansatör","Mekanik klemens"],["654","PLC sahadaki girişleri okur ve program mantığına göre çıkış üretir. Donanım burada tanıtımdır.","PLC'nin görevi nedir?","Girişe göre programlı çıkış üretmek","Yalnız analog gerilim artırmak","Motoru kablosuz döndürmek"],["655","Röleli devre fiziksel kontaklarla, PLC ise yeniden programlanabilen mantıkla görev yapar.","PLC'nin röleli sisteme göre avantajı nedir?","Mantığı yazılımla değiştirebilmek","Tüm kabloları gereksiz kılmak","Korumayı kaldırmak"],["656","CPU, girişler ve çıkışlar birlikte çalışır. Çalışma döngüsünde okuma ve güncelleme sırasını düşün.","PLC tarama döngüsünde genel olarak ne yapılır?","Giriş okunur, program çalışır, çıkış güncellenir","Girişler daima kapalıdır","Yalnız ekran çizilir"],["657","PLC çevre birimlerine bağlanırken sinyal türü ve ortak referans önemlidir. Bu kartta kablolama yok.","PLC girişlerinde hangi kontrol önemlidir?","Gerilim ve giriş tipinin uygunluğu","Renklerin rastgele seçimi","PE'nin sinyal olması"],["658","Öğrenme materyalinde önce şema, sonra eleman, sonra kontrol fikrini ayır. Bu bir giriş kartıdır.","Bir öğretici kartı çalışan devre saymak için ne gerekir?","Gerçek bağlantı ve davranış kanıtı","Yalnız başlık yazılması","Sadece fotoğraf"],["659","PLC bağlantısında besleme, giriş tipi ve çıkış yükünün sınırlarını model belgeleriyle karşılaştır.","PLC çıkışı yükle eşleştirilirken ne aranır?","Çıkışın gerilim ve akım sınırı","Sadece gövde rengi","Ekran parlaklığı"],["660","Ethernet bağlantısında IP adresi ve ağ maskesi önemlidir. Bu ekranda gerçek ağ testi yok.","Aynı yerel ağdaki PLC ve bilgisayarda ne uyumlu olmalıdır?","IP adresleme ve ağ maskesi","Sadece kablo rengi","Motor kutup sayısı"],["661","Bu kaynak başlığında proje oluşturma ve programlama dilleri içindekiler satırları birleşmiş. Burada PLC proje adımlarını tanıyoruz; gerçek yazılım bağlantısı yok.","Ladder hangi mantığa görsel olarak benzer?","Röleli kumanda şemasına","Kondansatör değerine","Yalnız sayısal gerilime"],["662","Ladder mantığında kontak koşulları soldan sağa değerlendirilir. Burada gerçek PLC çevrimi çalıştırılmadı.","Ladder'da bobin genellikle neyi temsil eder?","Bir çıkışı veya mantıksal durumu","PE iletkenini","Kaynak frekansını"],["663","BOOL, INT ve REAL gibi veri türleri farklı değerler tutar. Kartta değişkenler yalnız kavramsal.","BOOL veri tipi temel olarak ne saklar?","Doğru veya yanlış","Sınırsız ses örneği","Yalnız negatif sayı"],["664","Tam sayı, kesirsiz değerleri temsil eder. PLC değişkenini tanımlarken veri türünü doğru seçmek gerekir.","INT genellikle hangi veri grubuna aittir?","Tam sayılara","Yalnız kesirli sayılara","ASCII resimlere"],["665","REAL kayan noktalı değer saklayabilir. Bu kart veri türünü anlatır, hesap çalıştırmaz.","REAL tipi hangi değerlere uygundur?","Kesirli sayılara","Yalnız kontak durumlarına","Sadece tarih metnine"],["666","PLC giriş/çıkış sayısı ve sinyal türleri modelden modele değişir. Bu donanım kartını gerçek I/O testi sanma.","PLC'nin dijital girişi genelde ne algılar?","Açık/kapalı durumu","Motorun mekanik torkunu","Kondansatör kapasitansını"],["667","Merker M, programın hatırladığı yardımcı durum bitidir. Fiziksel çıkışla karıştırma.","PLC M biti ne için kullanılabilir?","Yardımcı iç mantık durumunu saklamak","PE hattına bağlanmak","Akım transformatörü olmak"],["668","PLC bit mantığıyla AND, OR ve NOT koşulları kurulabilir. Burada kod yürütme yok.","AND işlemi iki giriş 1 iken ne üretir?","1","0","2"],["669","Bir butonla başlatılan motor komutunda AND ve NOT gibi koşullar birlikte kullanılabilir. Bu kart yalnız açıklamadır.","OR işlemi girişlerden biri 1 iken ne üretir?","1","0","Analog sinüs"],["670","Zamanlayıcı, koşulun süresiyle karar verir. Bu kartta TON gecikmesi çalıştırılmış değildir.","TON zamanlayıcıda çıkış ne zaman etkinleşir?","Giriş belirli süre sürekli etkin kalınca","Giriş kesilince anında daima","Yalnız PE bağlanınca"],["671","PLC sayıcı her uygun tetikte durumu değiştirir. Encoder kartı giriş örneğidir; PLC programı ve ölçümü yok.","Yukarı sayıcı uygun tetikte ne yapar?","Sayım değerini artırır","Motor fazını tersler","Sadece analog sinüs üretir"],["672","PLC–kontaktör–inverter zincirinde komut, güç ve hız denetimini ayır. Kartta çalışan motor sürüşü kurulmamış.","İnverter motorun hızını genellikle neyle denetler?","Çıkış frekansını değiştirerek","PE kablosunu keserek","Sadece lambayla"],["673","PLC çıkışı kontaktör bobinine komut verebilir; motor yük akımı ayrı güç yolundan geçer. Bu kart bağlı değil.","PLC çıkışı motor kumandasında sıkça neyi sürer?","Ara röle veya kontaktörü","Motorun üç fazını doğrudan","PE iletkenini"],["674","UYARI: Motor sürücü başlığında START/STOP kontaktör şeması bulunuyor; inverter ve hız kontrol modeli yok.","VFD hız kontrolünde hangi büyüklük önemlidir?","Motor besleme frekansı","Yalnız STOP rengi","Koruma toprağı"],["675","UYARI: Sürücü parametreleri başlığında inverter bulunmuyor. Kontaktör devresinin hız parametresi varmış gibi anlatma.","VFD parametresi neyi tanımlar?","Sürücü çalışma sınır ve ayarlarını","Yalnız kablo etiketini","Motor boyasını"],["676","UYARI: Kontrol makroları başlığında doğrudan yol verme şeması var. PLC/VFD makro davranışı doğrulanmış değil.","Kontrol makrosunun amacı nedir?","Tekrarlanan kontrol adımlarını gruplamak","PE'yi anahtarlamak","Her fazı sıfırlamak"],["677","Temel uygulama makroları, tekrar kullanılan kontrol adımlarını düzenleyebilir. Bu kartta program testi yok.","Makro tekrar edilen işte ne sağlar?","Yeniden kullanılabilir düzen","Her zaman daha yüksek gerilim","Korumayı kaldırmak"],["678","PLC ile servo sürücüde komut, güç ve geri bildirim görevlerini ayır. HCFA donanımının gerçek bağlantısı bu kartta kurulmadı.","Servo sisteminde geri bildirim ne için kullanılır?","Konum/hız durumunu izlemek","PE'yi kaldırmak","Sadece ışığı açmak"],["679","Servo mekanizması motor hareketini geri bildirimle denetleyebilir. Karttaki sürücü ve motor temsili deney değildir.","Servo sisteminde encoder ne sağlar?","Hareket geri bildirimi","Kondansatör yükü","Akım koruma iptali"],["680","Servo sürücü motoru komuta göre enerjilendirir ve geri bildirimi işler. Bu kartta donanım davranışı ölçülmedi.","Servo sürücünün temel rolü nedir?","Motor hareketini kumanda etmek","Yalnız kablo tutmak","PLC'nin PE'si olmak"],["681","PLC'den servo sürücüye giden komut arayüzü seçilen modelin pin tanımına uymalıdır. Burada sinyal kablosu yok.","PLC ile servo sürücü arayüzünde ne doğrulanır?","Uygun sinyal ve terminal eşleşmesi","Yalnız kasa boyası","Motor korumasını atlamak"],["682","Servo ayarlarında motor modeli ve geri bildirim uyumu gerekir. Karttan parametre aktarımı yapıldığı varsayılmaz.","Servo sürücüye parametre yüklerken ne korunmalıdır?","Motor ve enkoderle ayar uyumu","Rastgele sınır değerleri","PE'nin sinyal olarak kullanımı"]];
 const sc633TopologyReview={"639":["motor-3p","MOTOR_NAMEPLATE_TERMINAL_LESSON_HAS_DIRECT_START_ONLY"],"640":["motor-3p","SYNCHRONOUS_SPEED_SLIP_TITLE_HAS_NO_RPM_MODEL"],"642":["motor-3p","REVERSING_TITLE_HAS_ONE_FORWARD_CONTACTOR"],"643":["motor-y-d","BRAKING_TITLE_HAS_STARTER_NO_BRAKING_EVIDENCE"],"644":["motor-3p","SINGLE_PHASE_AUX_WINDING_TITLE_HAS_THREE_PHASE_MOTOR"],"648":["motor-3p","RELAY_CONTACTOR_COMPARISON_HAS_ONLY_CONTACTOR"],"674":["motor-3p","VFD_TITLE_HAS_DIRECT_ON_LINE_MOTOR_STARTER"],"675":["motor-3p","VFD_PARAMETER_TITLE_HAS_NO_VFD"],"676":["motor-3p","VFD_MACRO_TITLE_HAS_DIRECT_ON_LINE_STARTER"]};
 for(const [scStr,intro,question,correct,wrongA,wrongB] of sequential633682){
  const sc=Number(scStr),lesson=L.lessons[sc-1],p=lesson?.project,g=lesson?.practiceGuide;
  if(!lesson||!Array.isArray(p?.wires)||!g?.steps?.length||!lesson.quiz||
     lesson.designStandard==='rich-reference-v1'||
     lesson.pedagogyReview?.independentPedagogicalAcceptance===true)continue;
  const review=lesson.pedagogyReview?.sc642PacketRepairNative==='SC642-PACKET-REVERSE-NATIVE-V1'?null:sc633TopologyReview[sc];
  if(review){
   if(lesson.kind!=='wiring'||!p.wires.length||!p.components.some(c=>c.typeId===review[0]))continue;
   lesson.pedagogyReview.titleTopologyStatus='REVIEW';
   lesson.pedagogyReview.titleTopologyIssue=review[1];
   lesson.pedagogyReview.nativeDynamicAcceptance=false;
   lesson.pedagogyReview.physicalAcceptance=false;
   lesson.pedagogyReview.windowsVisualAcceptance=false;
   lesson.pedagogyReview.independentPedagogicalAcceptance=false;
   g.heading='Bağlantı başlıkla uyuşmuyor — tam kabul bekliyor';
   if(!g.observations.some(s=>s.startsWith('UYARI: Bu şema')))
    g.observations.unshift('UYARI: Bu şema başlıktaki işlevi doğrudan kanıtlamıyor; mevcut bağlantılar korunmuştur.');
  }else if(lesson.kind==='quiz'&&p.wires.length===0){
   if(g.method!=='reference-only')continue;
  }else if(lesson.kind!=='wiring'||!p.wires.length||g.method!=='virtual-circuit-check')continue;
  g.steps[0]=intro;
  // Mix answer positions rather than teaching that option zero is always correct.
  const correctAt=sc%3,opts=[wrongA,wrongB];opts.splice(correctAt,0,correct);
  lesson.quiz={question,options:opts,answer:correctAt,
   why:correct+'. Bu açıklama native/Windows/3D kabul kanıtı değildir.'};
 }
 // The source PDF contents entry joined two separate PLC headings and a page marker.
 // Keep the source heading as evidence, but clean only the lesson display title.
 const merged=L.lessons[660],mergedTitle='2.2.4. PLC ile Proje Oluşturma ve Programlamaya Giriş',
 originalHeading='2.2.4. PLC ile Proje Oluşturma ve Programlamaya Giriş................................ 74 ̇ 2.2.5. PLC Programlama Dilleri';
 if(merged?.id==='plc-hardware-programming-outline-030'&&merged.title===originalHeading&&
    merged.kind==='quiz'&&merged.project?.wires?.length===0){
  merged.pedagogyReview.originalSourceHeading=originalHeading;
  merged.pedagogyReview.sourceHeadingStatus='REVIEW_MERGED_TOC_SECTIONS';
  merged.pedagogyReview.title=mergedTitle;
  merged.title=mergedTitle;
 }

 // Targeted stories for genuinely rewired lessons; no old QA overwritten.
 for(const [sc,marker,intro,observation] of [[431,"sc431OptoNative","İki ayrı 5 V kaynağı düşün: soldaki LED, sağdaki fototransistör. Arada elektrik kablosu değil ışık var. SG'ye basıp kolektör DCV değerinin yaklaşık 5 V'tan 0,2 V'a düşmesini sanal çözücüde karşılaştır.","LED yolunu çıkarınca optik aktarım kaybolmalı; iki kaynağın ortaklanması ise yalıtım testini geçmemeli."],[644,"sc644Native","Bu kez iki farklı motoru karıştırma: M1'in U–N ana sargısı ve Z1–Z2 yardımcı sargısı aynı tek fazlı motorun uçları. Sanal START ile K1'i çalıştır, sonra yardımcı sargı bağlantısını koparıp motorun durduğunu gözlemle.","Gerçek kalkış kondansatörü ve anahtar ayrıntıları modellenmediğinden fiziksel kurulum kabulü bekliyor."],[648,"sc648ComparisonNative","Yan yana iki ayrı kumanda görevi var: K2 yardımcı rölesi H1 lambasını, K1 kontaktörü M1 motorunu çalıştırır. Önce yalnız röle START'a, sonra yalnız kontaktör START'a basarak farkı sanal simülasyonda gör.","Röle kolu motoru beslememeli; kontaktör kolunda faz eksildiğinde motor çalışmamalı."]]){
  const lesson=L.lessons[Number(sc)-1],guide=lesson?.practiceGuide;
  if(lesson?.kind!=='wiring'||!lesson.pedagogyReview?.[marker]||
     !lesson.project?.wires?.length||guide?.method!=='virtual-circuit-check'||
     !Array.isArray(guide.steps)||!guide.steps.length||
     lesson.pedagogyReview.independentPedagogicalAcceptance===true)continue;
  guide.steps[0]=intro;
  if(!Array.isArray(guide.observations))guide.observations=[];
  guide.observations.unshift(observation);
  guide.heading='Bağlantıdan sonuca: sanal devre deneyi';
 }


 // SC468, SC470, SC474: reconstruct the actual connected educational boards.
 const scRepair468470474=[[468,'electronic-component-basics-outline-029',true,false],
  [470,'electronic-component-basics-outline-030',true,true],
  [474,'electronic-component-basics-outline-033',false,true]];
 const mk=(id,typeId,label,x,y,extra={})=>({id,typeId,label,x,y,rotation:0,ref:id.toUpperCase(),state:false,address:'',note:'',...extra});
 const ln=(a,b,why,i)=>{
  const end=x=>{const k=x.lastIndexOf(':');return {c:x.slice(0,k),p:x.slice(k+1)}};
  return{id:'sc-optical-audio-'+i,from:end(a),to:end(b),color:'#43857f',role:'SIGNAL',size:'1.5',points:[],tutorialHint:a+' → '+b,tutorialWhy:why};
 };
 for(const [sc,id,ir,relay] of scRepair468470474){
  const l=L.lessons[sc-1],p=l?.project;
  if(!l||l.id!==id||l.kind!=='quiz'||p?.wires?.length!==0||l.pedagogyReview?.independentPedagogicalAcceptance===true)continue;
  const parts=[mk('ps','arduino-bench-supply','5 V sanal DC masa kaynağı',45,180,{dcVoltage:5}),
   mk('board','arduino-uno','Arduino UNO D2/D9',700,120,
    {arduinoSketch:ir?"void setup(){pinMode(2,INPUT);pinMode(9,OUTPUT);digitalWrite(9,LOW);} void loop(){digitalWrite(9,digitalRead(2)==LOW?HIGH:LOW);delay(10);}":"void setup(){pinMode(2,INPUT);pinMode(9,OUTPUT);digitalWrite(9,LOW);} void loop(){digitalWrite(9,digitalRead(2)==HIGH?HIGH:LOW);delay(10);}",arduinoProgramName:'SC'+sc+' alıcı → çıkış'})];
  const wires=[],add=(a,b,t)=>wires.push([a,b,t]);
  if(ir){
   parts.push(mk('trigger','push-no','IR gönderme butonu',230,160),
    mk('irres','arduino-resistor-220','220 Ω verici seri direnci',370,160),
    mk('tx','arduino-ir-tx-38khz','940 nm 38 kHz sanal IR verici',500,160,{virtualCarrierHz:38000}),
    mk('rx','arduino-ir-rx-38khz','38 kHz sanal IR alıcı',380,405,{irBeamPresent:true}));
   add('ps:P','trigger:13','IR vericiye ilk kumanda');
   add('trigger:14','irres:1','IR verici akım sınırı');
   add('irres:2','tx:A','IR verici A ucu');
   add('tx:K','ps:M','IR verici K dönüşü');
   add('ps:P','rx:VCC','IR alıcı 5 V');
   add('ps:M','rx:GND','IR alıcı ortak GND');
   add('rx:OUT','board:D2','Aktif düşük alıcı OUT sinyali');
  }else{
   parts.push(mk('sound','arduino-sound-sensor','Mikrofonlu KY-037 ses sensörü',365,400,{arduinoValue:120}));
   add('ps:P','sound:VCC','KY-037 5 V beslemesi');
   add('ps:M','sound:GND','KY-037 0 V dönüşü');
   add('sound:DO','board:D2','Ses eşiği Arduino D2');
  }
  add('ps:P','board:5V','UNO sanal 5 V');
  add('ps:M','board:GND','UNO ortak 0 V');
  if(relay){
   parts.push(mk('relay','arduino-relay-1ch','5 V KY-019 röle modülü',985,175),
    mk('lamp','lamp-green','Sanal yük lambası',1240,260));
   add('board:D9','relay:SIG','D9 röle komutu');
   add('ps:P','relay:VCC','Röle modülü 5 V beslemesi');
   add('ps:M','relay:GND','Röle modülü 0 V');
   add('ps:P','relay:COM','Yük için 5 V');
   add('relay:NO','lamp:X1','Kontak kapanınca lamba beslenir');
   add('lamp:X2','ps:M','Lamba 0 V dönüşü');
  }else{
   parts.push(mk('ledres','arduino-resistor-220','220 Ω gösterge direnci',960,160),
    mk('led','arduino-led','Sanal IR alındı göstergesi',1145,255));
   add('board:D9','ledres:1','D9 gösterge sürme');
   add('ledres:2','led:A','Gösterge A ucu');
   add('led:K','ps:M','Gösterge K dönüşü');
  }
  p.components=parts;p.wires=wires.map(([a,b,t],i)=>ln(a,b,t,sc+'-'+(i+1)));
  delete p.referenceOnly;p.virtualOpticalAcousticModel=ir?'IDEALIZED_38KHZ_IR':'KY037_THRESHOLD_ONLY';
  l.kind='wiring';
  l.summary=ir?
   '5 V IR verici/alıcı, Arduino D2/D9 ve gerçek bağlı sanal çıktı. IR taşıyıcı mesafesi ve fiziksel optik kalibrasyon kapsam dışıdır.':
   'Mikrofonlu KY-037 ses eşiği Arduino D2/D9 ile KY-019 rölesini ve lambayı çalıştırır; gerçek ses kalibrasyonu yoktur.';
  l.steps=p.wires.map(w=>({from:w.from,to:w.to,hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:c.id==='ps'?'Sanal 5 V beslemedir.':c.id==='board'?'Algılanan dijital sinyali çıkışa dönüştürür.':'Gerçek katalog terminaliyle bağlı ders elemanıdır.'}));
  l.practiceGuide={version:'sc-ir-audio-native-v1',heading:'SC'+sc+' gerçek kablolu sanal deney',
   method:'virtual-circuit-check',steps:['Önce 5 V besleme ve ortak 0 V bağlantılarını bul.',
    ir?'IR verici butonuna bas; alıcı OUT ve Arduino D2 değerini karşılaştır.':'KY-037 ses eşiğini değiştir; Arduino D2 girişini izle.',
    'D9 çıktısı ile '+(relay?'röle kontağı ve lamba':'LED gösterge')+' durumunu karşılaştır.',
    'Kablo veya beslemeyi kesince yükün söndüğünü kontrol et; fiziksel/3D kabul bekliyor.'],
   observations:['Normal, tetiklenmiş ve kopuk hat koşullarını sanal ortamda karşılaştır.']};
  Object.assign(l.pedagogyReview,{componentIds:parts.map(c=>c.typeId),titleTopologyStatus:'REVIEW',
   titleTopologyIssue:ir?'OPTICAL_DISTANCE_CARRIER_AND_WINDOWS_3D_PENDING':'ACOUSTIC_CALIBRATION_AND_WINDOWS_3D_PENDING',
   nativeDynamicAcceptance:true,physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
   realWiredCircuit:true,scOpticalAudioRepair:'SC'+sc+'-REAL-WIRED-NATIVE-V1'});
 }

 // SC597/SC598: actual 74HC86 XOR + 74HC08 AND half-adder, not LM358.
 for(const [sc,id] of [[597,'opamp-apps-outline-046'],[598,'opamp-apps-outline-047']]){
  const lesson=L.lessons[sc-1],p=lesson?.project,v=lesson?.pedagogyReview;
  if(lesson?.id!==id||lesson.kind!=='wiring'||!p?.wires?.length||
    !p.components.some(x=>x.typeId==='lm358p-dip8')||
    v?.titleTopologyIssue!=='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH'||
    v.independentPedagogicalAcceptance===true)continue;
  const C=(id,typeId,label,x,y,extra={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[C('ps','arduino-bench-supply','5 V DC sanal besleme',40,240,{dcVoltage:5}),
   C('a','push-no','A bitini seç',260,80),C('b','push-no','B bitini seç',260,380),
   C('ra','resistor','A 10 kΩ pull-down',460,170,{resistance:10000}),
   C('rb','resistor','B 10 kΩ pull-down',460,490,{resistance:10000}),
   C('xor','sn74hc86n','74HC86 XOR: SUM',700,80),
   C('and','sn74hc08n','74HC08 AND: CARRY',700,410),
   C('rs','arduino-resistor-220','SUM LED 220 Ω',945,135),
   C('rc','arduino-resistor-220','CARRY LED 220 Ω',945,465),
   C('sum','arduino-led','SUM · toplam',1160,140),
   C('carry','arduino-led','CARRY · elde',1160,470)];
  const lines=[
   ['ps','P','a','13'],['ps','P','b','13'],['a','14','xor','1'],
   ['b','14','xor','2'],['a','14','and','1'],['b','14','and','2'],
   ['a','14','ra','1'],['ra','2','ps','M'],['b','14','rb','1'],
   ['rb','2','ps','M'],['ps','P','xor','14'],['ps','M','xor','7'],
   ['ps','P','and','14'],['ps','M','and','7'],['xor','3','rs','1'],
   ['rs','2','sum','A'],['sum','K','ps','M'],['and','3','rc','1'],
   ['rc','2','carry','A'],['carry','K','ps','M']];
  p.components=parts;p.wires=lines.map(([a,ap,b,bp],i)=>({
   id:'sc'+sc+'-adder-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Gerçek 74HC kapısına bağlanan sanal yarım toplayıcı hattı.'}));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
  lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  lesson.materials=parts.map(x=>({id:x.id,label:x.label,
   why:x.id==='xor'?'A ve B farklıysa SUM=1.':x.id==='and'?'A ve B birlikte 1 ise CARRY=1.':'Gerçek katalog terminaline bağlı sanal devre parçası.'}));
  lesson.summary='İki buton A ve B bitlerini seçer. 74HC86 XOR toplamı, 74HC08 AND elde bitini üretir. Windows/3D ve tam çözücü kabulü ayrıca bekler.';
  lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'A ve B bitlerini toplayalım',virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['İki entegreyi ortak 5 V ve 0 V kaynağa bağla.',
    'A ve B butonlarını 00, 01, 10, 11 olarak sırayla dene.',
    'SUM yalnız bir bit 1 iken; CARRY ikisi de 1 iken yanmalı.',
    'XOR çıkış kablosunu koparınca SUM ışığının söndüğünü gözlemle.'],
   observations:['00 → 0/0; 01 → 1/0; 10 → 1/0; 11 → 0/1.',
    'Tam native ve gerçek Windows/3D kabulü açık.'],
   repairModel:'SC597-598-XOR-AND-HALF-ADDER'};
  v.preRepairTitleTopologyIssue='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH';
  v.titleTopologyIssue='FULL_NATIVE_SOLVE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  v.titleTopologyStatus='REVIEW';v.componentIds=parts.map(x=>x.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.sc597598PhysicalRepair='SC597-598-TRUE-XOR-AND-WIRED-V1';
 }


 // SC599/604: replace copied LM358 with a physical three-input full adder.
 for(const [sc,id] of [[599,'opamp-apps-outline-048'],[604,'opamp-apps-outline-053']]){
  const l=L.lessons[sc-1],p=l?.project,v=l?.pedagogyReview;
  if(l?.id!==id||l.kind!=='wiring'||!p?.wires?.length||
   !p.components.some(x=>x.typeId==='lm358p-dip8')||
   v?.titleTopologyIssue!=='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH'||
   v.independentPedagogicalAcceptance===true)continue;
  const C=(id,typeId,label,x,y,extra={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const cs=[
   C('ps','arduino-bench-supply','5 V DC sanal kaynak',30,300,{dcVoltage:5}),
   C('a','push-no','A giriş biti',245,80),C('b','push-no','B giriş biti',245,295),
   C('ci','push-no','CIN · gelen elde',245,510),
   C('ra','resistor','A 10 kΩ pull-down',415,145,{resistance:10000}),
   C('rb','resistor','B 10 kΩ pull-down',415,340,{resistance:10000}),
   C('ri','resistor','CIN 10 kΩ pull-down',415,555,{resistance:10000}),
   C('xor','sn74hc86n','U1 · iki XOR kapısı',680,130),
   C('and','sn74hc08n','U2 · iki AND kapısı',680,455),
   C('or','sn74hc32n','U3 · OR elde çıkışı',935,455),
   C('rs','arduino-resistor-220','SUM LED 220 Ω',985,165),
   C('rc','arduino-resistor-220','CARRY LED 220 Ω',1130,475),
   C('sum','arduino-led','SUM · toplam',1200,165),
   C('carry','arduino-led','COUT · çıkan elde',1335,475)];
  const pairs=[
   ['ps','P','a','13'],['ps','P','b','13'],['ps','P','ci','13'],
   ['a','14','xor','1'],['b','14','xor','2'],
   ['a','14','and','1'],['b','14','and','2'],
   ['ci','14','xor','5'],['ci','14','and','5'],
   ['a','14','ra','1'],['ra','2','ps','M'],
   ['b','14','rb','1'],['rb','2','ps','M'],
   ['ci','14','ri','1'],['ri','2','ps','M'],
   ['xor','3','xor','4'],['xor','3','and','4'],
   ['and','3','or','1'],['and','6','or','2'],
   ['ps','P','xor','14'],['ps','M','xor','7'],
   ['ps','P','and','14'],['ps','M','and','7'],
   ['ps','P','or','14'],['ps','M','or','7'],
   ['xor','6','rs','1'],['rs','2','sum','A'],['sum','K','ps','M'],
   ['or','3','rc','1'],['rc','2','carry','A'],['carry','K','ps','M']];
  p.components=cs;p.wires=pairs.map(([a,ap,b,bp],i)=>({
   id:'sc'+sc+'-full-adder-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Tam toplayıcının gerçek DIP lojik kapı bağlantısı.'}));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=cs.map(x=>({id:x.id,label:x.label,
   why:x.id==='xor'?'İki XOR ardışık çalışarak SUM bitini üretir.':
   x.id==='and'?'A·B ve CIN·(A XOR B) elde kollarını hesaplar.':
   x.id==='or'?'İki elde kolunu tek COUT çıkışında birleştirir.':
   'Sanal devrede gerçek katalog terminaliyle bağlanır.'}));
  l.summary='A, B ve CIN bitleri iki XOR, iki AND ve bir OR kapısıyla toplanır. SUM ve COUT ayrı LEDlerde görülür. Tam çözücü/Windows/3D kabulü bekler.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',virtualOnly:true,
   canonicalGraphUnchanged:false,physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   heading:'Üç bitin toplamını ve eldeyi birlikte bulalım',
   steps:['A, B ve CIN bitlerinin üç ayrı girişini bul.',
    'İlk XOR A ile B yi, ikinci XOR CIN ile ara sonucu toplar.',
    'İki AND elde yolunu OR kapısında birleştir.',
    'Sekiz giriş durumunu dene; kopuk CIN kablosunda farkı gör.'],
   observations:['SUM=A XOR B XOR CIN; COUT=(A AND B) OR (CIN AND (A XOR B)).',
    'Tam native çözüm ve gerçek Windows/3D kabulü açık.'],
   repairModel:'SC599-604-THREE-INPUT-FULL-ADDER'};
  v.preRepairTitleTopologyIssue='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH';
  v.titleTopologyIssue='FULL_NATIVE_SOLVE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  v.titleTopologyStatus='REVIEW';v.componentIds=cs.map(x=>x.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.sc599604PhysicalRepair='SC599-604-TRUE-FULL-ADDER-V1';
 }


 // SC600/601: replace analog LM358 with the real half-subtractor gates.
 for(const [sc,id] of [[600,'opamp-apps-outline-049'],[601,'opamp-apps-outline-050']]){
  const l=L.lessons[sc-1],p=l?.project,v=l?.pedagogyReview;
  if(l?.id!==id||l.kind!=='wiring'||!p?.wires?.length||
   !p.components.some(x=>x.typeId==='lm358p-dip8')||
   v?.titleTopologyIssue!=='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH'||
   v.independentPedagogicalAcceptance===true)continue;
  const C=(id,typeId,label,x,y,extra={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const cs=[C('ps','arduino-bench-supply','Sanal 5 V DC besleme',30,255,{dcVoltage:5}),
   C('a','push-no','A / eksilen biti',255,100),C('b','push-no','B / çıkan biti',255,415),
   C('ra','resistor','A 10 kΩ pull-down',445,170,{resistance:10000}),
   C('rb','resistor','B 10 kΩ pull-down',445,480,{resistance:10000}),
   C('xor','sn74hc86n','74HC86 XOR · DIFF',705,115),
   C('inv','sn74hc04n','74HC04 NOT · A tersleme',705,350),
   C('and','sn74hc08n','74HC08 AND · BORROW',925,450),
   C('rd','arduino-resistor-220','DIFF LED 220 Ω',955,145),
   C('rr','arduino-resistor-220','BORROW LED 220 Ω',1115,465),
   C('diff','arduino-led','DIFF / Fark',1190,150),
   C('borrow','arduino-led','BORROW / Ödünç',1330,475)];
  const links=[['ps','P','a','13'],['ps','P','b','13'],
   ['a','14','xor','1'],['b','14','xor','2'],
   ['a','14','inv','1'],['inv','2','and','1'],['b','14','and','2'],
   ['a','14','ra','1'],['ra','2','ps','M'],
   ['b','14','rb','1'],['rb','2','ps','M'],
   ['ps','P','xor','14'],['ps','M','xor','7'],
   ['ps','P','inv','14'],['ps','M','inv','7'],
   ['ps','P','and','14'],['ps','M','and','7'],
   ['xor','3','rd','1'],['rd','2','diff','A'],['diff','K','ps','M'],
   ['and','3','rr','1'],['rr','2','borrow','A'],['borrow','K','ps','M']];
  p.components=cs;p.wires=links.map(([a,ap,b,bp],i)=>({
   id:'sc'+sc+'-subtractor-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Yarım çıkarıcının 74HC lojik bacağıyla bağlı sanal hattı.'}));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=cs.map(x=>({id:x.id,label:x.label,
   why:x.id==='xor'?'DIFF = A XOR B.':
   x.id==='inv'?'A bitinin mantıksal tersini üretir.':
   x.id==='and'?'BORROW = NOT A AND B.':
   'Gerçek katalog pinleriyle kablolanmış sanal deney elemanı.'}));
  l.summary='A bitinden B bitini çıkaralım. XOR farkı, NOT A ile B nin AND işlemi ödüncü gösterir. Tam çözücü ve Windows/3D kabulü bekliyor.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'İki bit çıkarınca ne zaman ödünç gerekir?',virtualOnly:true,
   canonicalGraphUnchanged:false,physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['İki butonla A ve B bitlerini seç.','XOR kapısının fark ışığını izle.',
    'A tersleme (NOT) ve AND kapısının ödünç ışığını karşılaştır.',
    '01 durumunda BORROW yanar; ödünç kolunu kesince sonuç değişir.'],
   observations:['00 → DIFF 0/BORROW 0; 01 → 1/1; 10 → 1/0; 11 → 0/0.',
    'Tam çözücü ve gerçek Windows/3D kabulü yapılmadı.'],
   repairModel:'SC600-601-XOR-NOT-AND-HALF-SUBTRACTOR'};
  v.preRepairTitleTopologyIssue='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH';
  v.titleTopologyIssue='FULL_NATIVE_SOLVE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  v.titleTopologyStatus='REVIEW';v.componentIds=cs.map(x=>x.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.sc600601PhysicalRepair='SC600-601-TRUE-HALF-SUBTRACTOR-V1';
 }


 // True SC602 full subtractor and SC603/SC605 74HC85 binary comparators.
 const v121C=(id,typeId,label,x,y,more={})=>({id,typeId,label,ref:id.toUpperCase(),x,y,rotation:0,state:false,address:'',note:'',...more});
 function v121Install(sc,id,parts,edges,name,summary,lessonSteps,key){
  const l=L.lessons[sc-1],p=l?.project,r=l?.pedagogyReview;
  if(l?.id!==id||l.kind!=='wiring'||!p?.wires?.length||
    !p.components.some(c=>c.typeId==='lm358p-dip8')||
    r?.titleTopologyIssue!=='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH'||
    r.independentPedagogicalAcceptance===true)return;
  p.components=parts;
  p.wires=edges.map(([a,ap,b,bp],i)=>({id:'sc'+sc+'-digital-v121-'+i,
   from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:a+':'+ap+' → '+b+':'+bp,tutorialWhy:'Gerçek katalog terminaline bağlı sayısal devre hattı.'}));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:'Sanal deneyde gerçek katalog terminali bulunan '+c.typeId+' elemanı.'}));
  l.summary=summary+' Tam çözücü ve Windows/3D kabulü ayrıca bekliyor.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:name,
    virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,steps:lessonSteps,
    observations:['Normal girişleri ve kopuk kablo durumlarını karşılaştır.','Windows/3D ve tam çözücü kabulü açık.'],
    repairModel:key};
  r.preRepairTitleTopologyIssue='DIGITAL_ARITHMETIC_TITLE_HAS_ANALOG_LM358_GRAPH';
  r.titleTopologyIssue='FULL_NATIVE_SOLVE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  r.titleTopologyStatus='REVIEW';r.componentIds=parts.map(c=>c.typeId);
  r.realWiredCircuit=true;r.nativeDynamicAcceptance=false;r.physicalAcceptance=false;
  r.windowsVisualAcceptance=false;r.independentPedagogicalAcceptance=false;
  r.scLogicRepairedCircuit=key;
 }
 {
  const C=v121C,p=[C('ps','arduino-bench-supply','5V kaynak',40,280,{dcVoltage:5})],w=[];
  for(const [i,s] of ['a','b','bi'].entries()){
   p.push(C(s,'push-no',s+' giriş biti',230,70+i*210),
    C('r'+s,'resistor',s+' 10kΩ pull-down',415,120+i*210,{resistance:10000}));
   w.push(['ps','P',s,'13'],[s,'14','r'+s,'1'],['r'+s,'2','ps','M']);
  }
  p.push(C('xor','sn74hc86n','U1 XOR×2',700,130),
   C('inv','sn74hc04n','U2 NOT×2',700,360),
   C('and','sn74hc08n','U3 AND×2',920,355),C('or','sn74hc32n','U4 OR',1110,430),
   C('rd','arduino-resistor-220','DIFF 220Ω',1100,145),
   C('rr','arduino-resistor-220','BOUT 220Ω',1240,455),
   C('diff','arduino-led','DIFF',1300,155),C('borrow','arduino-led','BOUT',1450,465));
  w.push(['a','14','xor','1'],['b','14','xor','2'],
   ['xor','3','xor','4'],['bi','14','xor','5'],
   ['a','14','inv','1'],['inv','2','and','1'],['b','14','and','2'],
   ['xor','3','inv','3'],['inv','4','and','4'],['bi','14','and','5'],
   ['and','3','or','1'],['and','6','or','2']);
  for(const chip of ['xor','inv','and','or'])w.push(['ps','P',chip,'14'],['ps','M',chip,'7']);
  w.push(['xor','6','rd','1'],['rd','2','diff','A'],['diff','K','ps','M'],
   ['or','3','rr','1'],['rr','2','borrow','A'],['borrow','K','ps','M']);
  v121Install(602,'opamp-apps-outline-051',p,w,'Üç girişli tam çıkarıcı',
   'DIFF = A XOR B XOR BIN; BOUT = ((NOT A) AND B) OR (NOT(A XOR B) AND BIN).',
   ['A, B, BIN bitlerini değiştir.','İki XOR ile farkı, NOT/AND/OR ile ödüncü izle.','000–111 durumlarını ve kopuk BIN hattını karşılaştır.'],
   'SC602-FULL-SUBTRACTOR-WIRED-V121');
 }
 function v121Cmp(sc,id,bits){
  const C=v121C,p=[C('ps','arduino-bench-supply','5V kaynak',35,285,{dcVoltage:5}),
    C('cmp','cd74hc85e','CD74HC85E büyüklük karşılaştırıcı',770,200)],
    w=[['ps','P','cmp','16'],['ps','M','cmp','8'],['ps','M','cmp','2'],
       ['ps','P','cmp','3'],['ps','M','cmp','4']],
    pa=['10','12','13','15'],pb=['9','11','14','1'];
  for(let i=0;i<4;i++)for(const k of ['a','b']){
   const pin=(k==='a'?pa:pb)[i];
   if(i>=bits){w.push(['ps','M','cmp',pin]);continue}
   const x=k+i,left=k==='a'?190:420;
   p.push(C(x,'push-no',x.toUpperCase()+' giriş',left,55+i*150),
    C('r'+x,'resistor',x+' 10kΩ pull-down',left+140,120+i*150,{resistance:10000}));
   w.push(['ps','P',x,'13'],[x,'14','cmp',pin],[x,'14','r'+x,'1'],['r'+x,'2','ps','M']);
  }
  for(const [k,pin,i] of [['gt','5',0],['eq','6',1],['lt','7',2]]){
   p.push(C('r'+k,'arduino-resistor-220',k+' 220Ω',1020,95+i*195),
    C(k,'arduino-led',k.toUpperCase(),1230,95+i*195));
   w.push(['cmp',pin,'r'+k,'1'],['r'+k,'2',k,'A'],[k,'K','ps','M']);
  }
  v121Install(sc,id,p,w,bits+' bit sayısal karşılaştırıcı',
   'CD74HC85E ile A>B / A=B / A<B sonuçlarını '+bits+' bit üzerinden hesapla.',
   ['A ve B sayısının bitlerini butonlarla ayarla.','GT/EQ/LT ışıklarını karşılaştır.','Eşitliği, büyük/küçük ve kopuk girişi dene.'],
   'SC'+sc+'-CMP-'+bits+'BIT-WIRED-V121');
 }
 v121Cmp(603,'opamp-apps-outline-052',2);
 v121Cmp(605,'opamp-apps-outline-054',4);


 // SC614,615,616,628: physically wired SN74HC393 counters.
 const coC=(id,typeId,label,x,y,extra={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,
  rotation:0,state:false,address:'',note:'',...extra});
 function coRepair(sc,id,kind){
  const l=L.lessons[sc-1],p=l?.project,r=l?.pedagogyReview;
  if(l?.id!==id||l.kind!=='wiring'||!p?.wires?.length||
    !p.components.some(c=>c.typeId==='motor-3p')||
    r?.titleTopologyIssue!=='DIGITAL_COUNTER_TITLE_HAS_MOTOR_CONTACTOR_GRAPH'||
    r.independentPedagogicalAcceptance===true)return;
  const C=coC,cs=[C('ps','arduino-bench-supply','5 V kaynak',40,270,{dcVoltage:5}),
    C('clock','push-no','Düşen kenar CLK',235,80),
    C('reset','push-no','RESET',235,445),
    C('rclock','resistor','CLK 10kΩ pull-down',405,150,{resistance:10000}),
    C('rreset','resistor','RESET 10kΩ pull-down',405,510,{resistance:10000}),
    C('count','sn74hc393n','SN74HC393 sayıcı',720,205)],
    w=[['ps','P','clock','13'],['ps','P','reset','13'],
     ['clock','14','count','1'],['clock','14','rclock','1'],
     ['rclock','2','ps','M'],['reset','14','rreset','1'],
     ['rreset','2','ps','M'],['ps','P','count','14'],['ps','M','count','7']];
  if(kind==='four')w.push(['reset','14','count','2']);
  else{
   cs.push(C('org','sn74hc32n','74HC32 QD/RESET OR',955,415));
   w.push(['ps','P','org','14'],['ps','M','org','7'],
     ['count','6','org','1'],['reset','14','org','2'],['org','3','count','2']);
  }
  if(kind==='down'){
   cs.push(C('inv','sn74hc04n','74HC04 üç bit NOT',955,140));
   w.push(['ps','P','inv','14'],['ps','M','inv','7'],
     ['count','3','inv','1'],['count','4','inv','3'],['count','5','inv','5']);
  }
  const q=kind==='four'?4:3;
  for(let i=0;i<q;i++){
   const x='led'+i,ri='rled'+i;
   cs.push(C(ri,'arduino-resistor-220','LED'+i+' 220Ω',1120,100+i*150),
     C(x,'arduino-led','Q'+i+' durum',1310,100+i*150));
   w.push([kind==='down'?'inv':'count',
    kind==='down'?['2','4','6'][i]:['3','4','5','6'][i],ri,'1'],
    [ri,'2',x,'A'],[x,'K','ps','M']);
  }
  p.components=cs;
  p.wires=w.map(([a,ap,b,bp],i)=>({id:'sc'+sc+'-counter-'+i,
   from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'SIGNAL',
   size:'1.5',points:[],tutorialHint:a+':'+ap+' → '+b+':'+bp,
   tutorialWhy:'Gerçek SN74HC393 ve lojik kapı DIP pinlerine bağlı sanal devre.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
   why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=cs.map(c=>({id:c.id,label:c.label,why:c.id==='count'?
   'CLK düşen kenarında ikili sayı bir artar.':c.id==='inv'?
   'QA QB QC terslenerek 7..0 aşağı görünür.':c.id==='org'?
   'QD taşması veya RESET bobinsiz CLR girişini sürer.':
   'Gerçek katalog pinleriyle bağlı sanal malzeme.'}));
  const heading=kind==='four'?'4 bit asenkron 0–15 sayıcı':
   kind==='down'?'3 bit asenkron 7–0 aşağı sayıcı':'3 bit asenkron 0–7 yukarı sayıcı';
  l.summary=heading+'. SN74HC393 saat, CLR ve gerçek çıkış bağlantıları kuruludur; tam native/Windows 3D kabulü açık.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading,virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['5 V, GND, CLK uçlarını kontrol et.','CLK butonuna basıp bırak: her düşen kenarda sayı ilerler.',
    'LED bitlerini oku ve RESET ile sıfırla.','CLK kablosunu çıkarınca saymanın durduğunu kontrol et.'],
   observations:['Gerçek entegre üzerinden ikili sayma anlatılır.','Bütünleşik çözücü ve Windows/3D kabulü açık.'],
   repairModel:'SC'+sc+'-COUNTER-'+kind+'-V124'};
  r.preRepairTitleTopologyIssue='DIGITAL_COUNTER_TITLE_HAS_MOTOR_CONTACTOR_GRAPH';
  r.titleTopologyIssue='FULL_NATIVE_SOLVE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  r.titleTopologyStatus='REVIEW';r.componentIds=cs.map(c=>c.typeId);
  r.realWiredCircuit=true;r.nativeDynamicAcceptance=false;r.physicalAcceptance=false;
  r.windowsVisualAcceptance=false;r.independentPedagogicalAcceptance=false;
  r.scRealCounterRepair='SC'+sc+'-COUNTER-'+kind+'-V124';
 }
 coRepair(614,'motor-direct-power-outline-022','four');
 coRepair(615,'motor-direct-power-outline-023','up');
 coRepair(616,'motor-direct-power-outline-024','down');
 coRepair(628,'motor-direct-power-outline-026','up');


 // SC617: physical selectable MOD-6 / MOD-8 counter with SN74HC393,
 // two SN74HC08 AND stages and cascaded SN74HC32 OR reset stages.
 {
 const sc=617,l=L.lessons[sc-1],p=l?.project,r=l?.pedagogyReview;
 if(l?.id==='motor-direct-power-outline-025'&&l.kind==='wiring'&&
 p?.components?.some(c=>c.typeId==='motor-3p')&&p.wires?.length&&
 r?.titleTopologyIssue==='DIGITAL_COUNTER_TITLE_HAS_MOTOR_CONTACTOR_GRAPH'&&
 r.independentPedagogicalAcceptance!==true){
  const C=(id,typeId,label,x,y,more={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,
   rotation:0,state:false,address:'',note:'',...more});
  const parts=[C('ps','arduino-bench-supply','5 V sanal DC kaynak',35,290,{dcVoltage:5}),
   C('clock','push-no','CLK düşen kenar',230,80),
   C('reset','push-no','RESET',230,425),
   C('mod','selector-no','MODE açık MOD8 / kapalı MOD6',230,635),
   C('rclock','resistor','CLK 10 kΩ pull-down',410,135,{resistance:10000}),
   C('rreset','resistor','RESET 10 kΩ pull-down',410,475,{resistance:10000}),
   C('rmod','resistor','MODE 10 kΩ pull-down',410,685,{resistance:10000}),
   C('count','sn74hc393n','U1 74HC393 sayıcı',660,190),
   C('and','sn74hc08n','U2 MOD6 algılama AND ×2',900,205),
   C('org','sn74hc32n','U3 MOD/reset OR ×2',1080,380)];
  const W=[['ps','P','clock','13'],['ps','P','reset','13'],['ps','P','mod','13'],
   ['clock','14','count','1'],['clock','14','rclock','1'],['rclock','2','ps','M'],
   ['reset','14','rreset','1'],['rreset','2','ps','M'],
   ['mod','14','rmod','1'],['rmod','2','ps','M'],
   ['ps','P','count','14'],['ps','M','count','7'],
   ['ps','P','and','14'],['ps','M','and','7'],
   ['ps','P','org','14'],['ps','M','org','7'],
   ['count','4','and','1'],['count','5','and','2'],
   ['and','3','and','4'],['mod','14','and','5'],
   ['count','6','org','1'],['and','6','org','2'],
   ['org','3','org','4'],['reset','14','org','5'],
   ['org','6','count','2']];
  for(let i=0;i<3;i++){
   const id='led'+i,ri='rled'+i;
   parts.push(C(ri,'arduino-resistor-220','Q'+i+' LED 220 Ω',1170,120+i*170),
    C(id,'arduino-led','Q'+i+' bit çıkışı',1370,120+i*170));
   W.push(['count',['3','4','5'][i],ri,'1'],
    [ri,'2',id,'A'],[id,'K','ps','M']);
  }
  p.components=parts;p.wires=W.map(([a,ap,b,bp],i)=>({
   id:'sc617-mod-counter-'+i,from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:a+':'+ap+' → '+b+':'+bp,
   tutorialWhy:'Gerçek SN74HC393/08/32 entegre pinleri arasında mod ve reset sinyali.'}));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
   why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:c.id==='count'?
   'Saatin düşen kenarında ikili sayacı artırır.':c.id==='and'?
   'QB ve QC birlikte 1 iken MOD anahtarıyla 6 sınırını algılar.':c.id==='org'?
   '8 sınırındaki QD veya seçilmiş MOD6 koşulunu RESET ile birleştirir.':
   'Gerçek katalog pinli sanal sayıcı elemanı.'}));
  l.summary='MODE açık: 0–7 MOD8. MODE kapalı: 0–5 MOD6. Gerçek 74HC393/74HC08/74HC32 ve reset geri beslemesi bağlı; tam çözücü ve Windows 3D kabulü açık.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Mod seçimiyle saymanın sınırını değiştirelim',virtualOnly:true,
   canonicalGraphUnchanged:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
   fullyRich:false,steps:['5 V, GND ve düşen CLK kenarı bağlantılarını incele.',
    'MODE bırakılmışken 0–7 aralığını say.','MODE anahtarını kapat, RESET ile başla ve 0–5 say.',
    'MODE veya CLK kablosunu kopar; sayma ve reset tepkisini karşılaştır.'],
   observations:['QB ve QC birlikte 1, MODE kapalı iken 6 durumunda sıfırlama oluşur.',
    'QD=1 olduğunda MOD8 reset gerçekleşir. Windows/3D kabulü ayrı bekler.'],
   repairModel:'SC617-REAL-SELECTABLE-MOD6-MOD8-V125'};
  r.preRepairTitleTopologyIssue='DIGITAL_COUNTER_TITLE_HAS_MOTOR_CONTACTOR_GRAPH';
  r.titleTopologyIssue='FULL_NATIVE_SOLVE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  r.titleTopologyStatus='REVIEW';r.componentIds=parts.map(x=>x.typeId);
  r.realWiredCircuit=true;r.nativeDynamicAcceptance=false;r.physicalAcceptance=false;
  r.windowsVisualAcceptance=false;r.independentPedagogicalAcceptance=false;
  r.scPhysicalCounterRepair='SC617-REAL-SELECTABLE-MOD6-MOD8-V125';
 }
 }


 // SC674–676: replace unrelated DOL motor-starter graphics with a real
 // terminalized SINAMICS V20 circuit and executable parameter/macro state.
 function v20PhysicalLesson(sc,id,hz,macro){
  const lesson=L.lessons[sc-1],p=lesson?.project,review=lesson?.pedagogyReview;
  const issue={674:'VFD_TITLE_HAS_DIRECT_ON_LINE_MOTOR_STARTER',
   675:'VFD_PARAMETER_TITLE_HAS_NO_VFD',
   676:'VFD_MACRO_TITLE_HAS_DIRECT_ON_LINE_STARTER'}[sc];
  if(lesson?.id!==id||lesson.kind!=='wiring'||!p?.wires?.length||
     !p.components.some(c=>c.typeId==='motor-3p')||!p.components.some(c=>c.typeId==='main-contact')||
     review?.titleTopologyIssue!==issue||review.independentPedagogicalAcceptance===true)return;
  const make=(id,typeId,label,x,y,extra={})=>({
   id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra
  });
  const v20Params={'P0700':macro?2:1,'P1000':macro?2:1,'P1040':hz,
   'P0304':230,'P0305':3.5,'P0307':0.75,'P0310':50,'P0311':1400,
   'P1082':50,'P1120':2,'P1121':2,
   ...macro?{'P0701':1,'P0702':12,'P0703':9,'P0704':10}:{}};
  const parts=[
   make('g1','supply-1p','Yalıtılmış sanal L/N/PE şebeke kaynağı',75,190),
   make('vfd','sinamics-v20-1p','SINAMICS V20 / 1 faz giriş / 3 faz çıkış',430,170,{
    v20:{schema:1,macro:macro?'Cn002':'Cn001',params:v20Params,run:!macro,reverse:false,
     reset:0,load:35,temperature:30}
   }),
   make('motor','motor-3p','M1 üç fazlı asenkron motor',1110,225)
  ];
  const conn=[
   ['g1','L','vfd','L1','Şebeke L ucu yalnız sanal V20 girişine gelir.'],
   ['g1','N','vfd','N','N terminali sürücü giriş dönüşüdür.'],
   ['g1','PE','vfd','PE','Sanal koruma iletkeni V20 PE terminaline gelir.'],
   ['vfd','U','motor','U','V20 U motor U besler.'],
   ['vfd','V','motor','V','V20 V motor V besler.'],
   ['vfd','W','motor','W','V20 W motor W besler.'],
   ['vfd','PE2','motor','PE','V20 PE2 ile motor PE korunur.']
  ];
  if(macro){
   parts.push(make('start','push-no','DI1 RUN komut butonu',720,70),
    make('pot','potentiometer','AI1 0–10 V frekans potu',760,470,{potentiometer:50}));
   conn.push(
    ['vfd','13','start','13','V20 dahili 24 V, DI1 start butonuna bağlanır.'],
    ['start','14','vfd','8','START kapanınca DI1 etkin olur.'],
    ['vfd','14','vfd','12','DI1 ortak referansı 0 V olur.'],
    ['vfd','1','pot','1','10 V analog referans potun bir ucuna bağlanır.'],
    ['vfd','5','pot','3','0 V pot dönüşüdür.'],
    ['pot','2','vfd','2','AI1 analog ayar sürücüye gelir.']
   );
  }
  p.components=parts;
  p.wires=conn.map(([a,ap,b,bp,why],i)=>({
   id:'sc'+sc+'-v20-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:a==='g1'?'#e53935':'#43857f',role:'CONTROL',size:'1.5',
   points:[],tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
  }));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
  lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
   why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  lesson.materials=parts.map(x=>({id:x.id,label:x.label,why:
   x.id==='vfd'?'Giriş AC şebekesini üç fazlı değişken frekanslı motor çıkışına dönüştürür.':
   x.id==='motor'?'Sürücü U/V/W fazlarıyla beslenen yük motordur.':
   x.id==='pot'?'AI1 frekans referansını 0–10 V aralığında ayarlar.':
   x.id==='start'?'DI1 terminaline gerçek dijital RUN komutunu verir.':
   'Sanal elektrik devresi güç kaynağı ve gerçek katalog malzemesi.'}));
  const explanation=macro?'Cn002 makrosu DI1 start ve AI1 pot girişleriyle çalışır.':
   sc===675?'P0304, P0310, P0311, P1040 ve rampa parametrelerini sürücünün kendi modelinde karşılaştır.':
   'Tek fazlı girişten V20 U/V/W çıkış frekansını ve motorun sanal hız değişimini izle.';
  lesson.summary='Gerçek SINAMICS V20 + motor bağlantısı. '+explanation+
   ' Fiziksel sürücü kabulü ve Windows/3D testi bekleniyor.';
  lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'V20 sürücüyle motor kontrolünü deneyelim',
   virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
   pedagogicalAcceptance:false,fullyRich:false,
   steps:['Önce sürücünün L/N/PE girişini ve U/V/W motor çıkışını bul.',
    macro?'DI1 start butonunu, AI1 pot ayarını ve Cn002 makrosunu incele.':
     'BOP panelinden çalışmayı ve frekans ayarını karşılaştır.',
    'Frekans değiştiğinde motor hızının tahmini nasıl değişiyor, gözlemle.',
    'Şebeke veya motor bağlantısı kopunca çalışmayı yeniden değerlendir.'],
   observations:['Kontrol edilen değer V20 sanal frekans/hız modelidir; gerçek donanım veya SPICE ölçümü değildir.',
    'Windows/3D kablo hizası ve bağımsız pedagojik kabul açık.'],
   repairModel:'SC'+sc+'-REAL-SINAMICS-V20-'+(macro?'CN002':'BOP')+'-V1'};
  review.preRepairTitleTopologyIssue=issue;
  review.titleTopologyIssue='V20_FULL_NATIVE_SOLVE_AND_WINDOWS_3D_PENDING';
  review.titleTopologyStatus='REVIEW';review.componentIds=parts.map(c=>c.typeId);
  review.realWiredCircuit=true;review.nativeDynamicAcceptance=false;
  review.physicalAcceptance=false;review.windowsVisualAcceptance=false;
  review.independentPedagogicalAcceptance=false;
  review.scVfdRealCircuitRepair='SC'+sc+'-REAL-SINAMICS-V20-'+(macro?'CN002':'BOP')+'-V1';
 }
 v20PhysicalLesson(674,'motor-direct-power-outline-036',35,false);
 v20PhysicalLesson(675,'motor-direct-power-outline-037',20,false);
 v20PhysicalLesson(676,'motor-direct-power-outline-038',30,true);


 // SC639: true six-terminal motor label/star bridge exercise, not START/STOP.
 // SC640: synchronous speed and V20 estimated rotor speed are separate.
 // SC643: V20 OFF3 fast-deceleration example, not a star/delta starter.
 const m130C=(id,typeId,label,x,y,more={})=>({
  id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...more
 });
 function m130Install(sc,id,expectedParts,expectedIssue,parts,links,text,steps,tag){
  const lesson=L.lessons[sc-1],p=lesson?.project,r=lesson?.pedagogyReview;
  if(lesson?.id!==id||lesson.kind!=='wiring'||!p?.wires?.length||
   !expectedParts.every(t=>p.components.some(c=>c.typeId===t))||
   r?.titleTopologyIssue!==expectedIssue||r.independentPedagogicalAcceptance===true)return;
  p.components=parts;p.wires=links.map(([a,ap,b,bp,why],i)=>({
   id:'sc'+sc+'-motor-'+i,from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
  }));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
  lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  lesson.materials=parts.map(c=>({id:c.id,label:c.label,
   why:c.id==='motor'?'Motorun gerçek katalog güç ve koruma uçlarıdır.':
   c.id==='vfd'?'Gerçek SINAMICS V20 sanal sürücü modeli ve parametreleridir.':
   'Kabloyla bağlanmış sanal ders elemanıdır.'}));
  lesson.summary=text+' Tam Simulation.solve ve Windows/3D fiziksel kabulü açık.';
  lesson.practiceGuide={version:'practice-n1',heading:'Motor dersini gerçek devrede inceleyelim',
   method:'virtual-circuit-check',virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps,observations:['Gösterilen sonuç eğitim simülasyonuna aittir, donanım ölçümü değildir.',
    'Gerçek Windows/3D terminal kabulü ve bütünleşik native kontrol ayrıca bekliyor.'],
   repairModel:tag};
  r.preRepairTitleTopologyIssue=expectedIssue;r.titleTopologyStatus='REVIEW';
  r.titleTopologyIssue='FULL_NATIVE_SOLVE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  r.componentIds=parts.map(c=>c.typeId);r.realWiredCircuit=true;
  r.nativeDynamicAcceptance=false;r.physicalAcceptance=false;
  r.windowsVisualAcceptance=false;r.independentPedagogicalAcceptance=false;
  r.scMotorSourceRepair=tag;
 }
 {
  const C=m130C;
  const motor=C('motor','motor-y-d','M1 · 6 uç U1/V1/W1/U2/V2/W2',565,210,{
   motorConnection:'external',
   nameplate:{connection:'Y (görsel yıldız köprü)',ratedVoltageV:400,ratedWindingVoltageV:230,connectionRating:'230 V Δ / 400 V Y',ratedPowerKw:0.75,
     nominalHz:50,nominalRpm:1400,poles:4,note:'Öğretici örnek etiket; fiziksel cihaz datasheeti değil.'}});
  const ps=C('g1','supply-3p','Sanal üç faz L1/L2/L3 + PE',85,210);
  const edges=[
   ['g1','L1','motor','U1','L1 → U1'],
   ['g1','L2','motor','V1','L2 → V1'],
   ['g1','L3','motor','W1','L3 → W1'],
   ['g1','PE','motor','PE','PE koruma ucu'],
   ['motor','U2','motor','V2','İlk yıldız köprüsü U2–V2'],
   ['motor','V2','motor','W2','İkinci yıldız köprüsü V2–W2']
  ];
  m130Install(639,'motor-direct-power-outline-029',
   ['motor-3p','main-contact'],'MOTOR_NAMEPLATE_TERMINAL_LESSON_HAS_DIRECT_START_ONLY',
   [ps,motor],edges,
   'Altı motor klemensini ve örnek 230 V Δ / 400 V Y, 4 kutup/50 Hz/1400 dev-dak etiketini ayır: yıldızda hat 400 V iken sargı yaklaşık 230 V alır; U2–V2–W2 yıldız köprüleri gerçek kablodur.',
   ['Örnek motor etiketindeki gerilim, güç ve 50 Hz bilgisini oku.',
    'U1, V1, W1 üç faz girişini bul; U2, V2, W2 uçlarını yıldız köprüsüyle birleştir.',
    'Bir yıldız köprüsünü ayır ve eksik bağlantının etkisini sanal devrede kontrol et.'],
   'SC639-6-TERMINAL-NAMEPLATE-STAR-WIRED-V130');
 }
 function speedMotorLesson(sc,brake){
  const C=m130C,motor=C('motor','motor-3p','M1 üç fazlı asenkron motor',1080,230),
   vfd=C('vfd','sinamics-v20-1p','SINAMICS V20 frekans sürücü',470,185,{
    v20:{schema:1,macro:brake?'Özel':'Cn001',
     params:{'P0304':230,'P0305':3.5,'P0307':0.75,'P0310':50,'P0311':1400,
      'P0700':brake?2:1,'P1000':1,'P1040':35,'P1082':50,
      'P1120':2,'P1121':10,'P1135':1,
      ...(brake?{'P0701':1,'P0702':12,'P0703':4,'P0704':9}:{})},
     run:!brake,reverse:false,reset:0,load:35,temperature:30}
   }),
   ps=C('g1','supply-1p','Sanal tek faz L/N/PE',55,205),
   parts=[ps,vfd,motor],edges=[
    ['g1','L','vfd','L1','V20 tek faz giriş L'],
    ['g1','N','vfd','N','V20 tek faz giriş N'],
    ['g1','PE','vfd','PE','Koruma hattı PE'],
    ['vfd','U','motor','U','Motor U fazı'],
    ['vfd','V','motor','V','Motor V fazı'],
    ['vfd','W','motor','W','Motor W fazı'],
    ['vfd','PE2','motor','PE','Motor PE koruma bağlantısı']
   ];
  if(brake){
   parts.push(C('start','push-no','RUN komutu · DI1',765,80),
    C('stop3','push-nc','OFF3 hızlı duruş NC · DI3',765,470));
   edges.push(
    ['vfd','13','start','13','24 V RUN kaynak ucu'],
    ['start','14','vfd','8','DI1 = RUN'],
    ['vfd','13','stop3','21','Normalde kapalı OFF3 komut beslemesi'],
    ['stop3','22','vfd','10','DI3 OFF3 girişini besler'],
    ['vfd','14','vfd','12','DI ortak 0 V referansı']
   );
   m130Install(643,'motor-braking-outline-009',
    ['motor-y-d','coil-delay-on'],'BRAKING_TITLE_HAS_STARTER_NO_BRAKING_EVIDENCE',
    parts,edges,
    'V20 OFF3 kontrollü hızlı duruş örneği: P1135=1 s, normal P1121=10 s. Bu DC enjeksiyon ya da mekanik fren modeli değildir.',
    ['RUN komutunu ver, sanal frekansın yükselmesini izle.',
     'OFF3 NC butonunu açınca hızlı frekans azaltmayı P1135 üzerinden karşılaştır.',
     'Motor veya STOP hattını ayırınca güvenli durma koşullarını incele.'],
    'SC643-REAL-V20-OFF3-BRAKING-WIRED-V130');
  }else{
   const l=L.lessons[sc-1];
   m130Install(640,'motor-direct-power-outline-030',
    ['motor-3p','main-contact'],'SYNCHRONOUS_SPEED_SLIP_TITLE_HAS_NO_RPM_MODEL',
    parts,edges,
    'Dört kutuplu örnek motorda n_s=120·f/4; V20 35 Hz için senkron hız 1050 dev/dak ve P0311=1400/50 modeliyle tahmini rotor hızı 980 dev/dak (kayma yaklaşık %6,7).',
    ['V20 BOP frekansını 35 Hz seç, motor U/V/W kablolarını incele.',
     'n_s=120·f/4 hesabıyla senkron hızı bul.',
     'V20 tahmini rotor devrini senkron hızdan ayır, kaymayı karşılaştır.',
     'Frekansı düşür veya sürücü beslemesini kes, sonucu izle.'],
    'SC640-V20-SPEED-SLIP-WIRED-V130');
   if(l?.practiceGuide?.repairModel==='SC640-V20-SPEED-SLIP-WIRED-V130')
     l.project.speedStudy={poleCount:4,supplyHz:35,synchronousRpm:1050,
       estimatedRotorRpm:980,estimatedSlipPercent:100*(1050-980)/1050,
       derivedFrom:'V20 educational P0310=50 Hz P0311=1400 rpm, not direct tachometer measurement'};
  }
 }
 speedMotorLesson(640,false);
 speedMotorLesson(643,true);


 // SC711 · Relay / contactor motor direction: a true mutually interlocked
 // 3-phase reversing simulation with exclusive 0/F/R start selection.
 // Strict lesson/source guard; no real-hardware wiring acceptance is asserted.
 {
  const sc=711,lesson=L.lessons[sc-1],p=lesson?.project,r=lesson?.pedagogyReview;
  if(lesson?.id==='motor-direct-power-outline-040'&&lesson.kind==='wiring'&&
     p?.components?.length===7&&p.wires?.length===13&&
     p.components.some(c=>c.typeId==='motor-3p')&&
     p.components.filter(c=>c.typeId==='main-contact').length===1&&
     !p.components.some(c=>c.typeId==='selector-3')&&
     r?.independentPedagogicalAcceptance!==true){
   const c=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra
   });
   const components=[
    c('g','supply-3p','G1','Üç fazlı SANAL kaynak',50,270),
    c('stop','push-nc','S0','İki yön için ortak STOP',240,40),
    c('sel','selector-3','S3','0: seçim yok · 1: ileri · 2: geri',430,255,{position:0}),
    c('sf','push-no','S1','İleri START',600,40),
    c('sr','push-no','S2','Geri START',600,440),
    c('hf','contact-no','K1','İleri mühürleme kontağı',535,145),
    c('hr','contact-no','K2','Geri mühürleme kontağı',535,545),
    c('nr','contact-nc','K2','Geri kontaktörün ileri kilidi',810,145),
    c('nf','contact-nc','K1','İleri kontaktörün geri kilidi',810,545),
    c('cf','coil-contactor','K1','K1 ileri kontaktör bobini',1035,145),
    c('cr','coil-contactor','K2','K2 geri kontaktör bobini',1035,545),
    c('mf','main-contact','K1','K1 ileri güç kontakları',750,800),
    c('mr','main-contact','K2','K2 geri güç kontakları',1100,800),
    c('motor','motor-3p','M1','Sanal üç faz motor',1480,800)
   ];
   const pairs=[
    ['g','L1','stop','21'],
    ['stop','22','sel','11'],
    ['sel','13','sf','13'],['sel','14','sr','13'],
    ['stop','22','hf','13'],['stop','22','hr','13'],
    ['sf','14','nr','21'],['hf','14','nr','21'],
    ['nr','22','cf','A1'],['cf','A2','g','N'],
    ['sr','14','nf','21'],['hr','14','nf','21'],
    ['nf','22','cr','A1'],['cr','A2','g','N'],
    ['g','L1','mf','1'],['g','L1','mr','1'],
    ['g','L2','mf','3'],['g','L2','mr','3'],
    ['g','L3','mf','5'],['g','L3','mr','5'],
    ['mf','2','motor','U'],['mf','4','motor','V'],['mf','6','motor','W'],
    ['mr','2','motor','W'],['mr','4','motor','V'],['mr','6','motor','U'],
    ['g','PE','motor','PE']
   ];
   p.components=components;
   p.wires=pairs.map(([a,ap,b,bp],i)=>({
    id:'sc711-true-reversing-'+(i+1),
    from:{c:a,p:ap},to:{c:b,p:bp},
    color:ap==='PE'||bp==='PE'?'#2b8a3e':'#43857f',
    role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Yalnız sanal devrede ileri/geri röle ve kontaktör bağlantısı.'
   }));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
   lesson.steps=p.wires.map(w=>({
    from:{...w.from},to:{...w.to},hint:w.tutorialHint,
    why:w.tutorialWhy,color:w.color,role:w.role,size:w.size
   }));
   lesson.materials=components.map(x=>({id:x.id,label:x.label,
    why:x.id==='sel'?'Aynı anda yalnız bir yönde yeni START komutu seçer.':
    x.id==='nr'||x.id==='nf'?'Karşı yön çalışırken diğer bobini engeller.':
    x.id==='mf'||x.id==='mr'?'Motorun sanal faz sırasını seçer.':
    'Gerçek katalog uçlarıyla bağlı sanal deney bileşeni.'}));
   lesson.summary='Motorun dönüş yönü, iki kontaktörde faz sırasının değişmesiyle farklılaşır. '+
    'S3 seçicisi aynı anda iki START yolunu açmaz; K1/K2 NC kontakları ikinci kilittir. '+
    'STOP mühürlemeyi kaldırır. S3=0 yalnız yeni START seçimini kapatır, çalışan motoru durdurmaz. '+
    'Bu yalnız eğitim simülasyonudur; gerçek 3 fazlı donanım kurulum talimatı değildir.';
   lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Sanal motora ileri ve geri yön komutunu verelim',
    virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,
    steps:[
     'S3=0 iken iki START butonunun da motoru çalıştırmadığını gör.',
     'S3=1 seç; S1 START ile ileri hareketi başlat, S1 bırakılınca mühürlemeyi izle.',
     'İleri çalışırken S3=2 ve S2 komutunun K2 NC kilidine takıldığını gözlemle.',
     'Önce STOP ile dur; ardından S3=2 ve S2 START ile geri hareketi dene.',
     'İki START birlikte basılıyken seçicinin yalnız tek komut yolunu açtığını kontrol et.'
    ],
    observations:[
     'İleri durumda K1 aktif ve motor spin=+1; geri durumda K2 aktif ve spin=-1.',
     'Karşılıklı NC kilitler ve STOP ile iki yön aynı anda çalışmaz.',
     'Gerçek Windows/3D görsel ve fiziksel güvenlik kabulü yapılmadı.'
    ],
    repairModel:'SC711-TRUE-CONTACTOR-REVERSE-SELECTOR-INTERLOCK-V1'};
   r.preRepairTitleTopologyIssue='REVERSE_TITLE_HAD_SINGLE_FORWARD_STARTER';
   r.titleTopologyIssue='WINDOWS_3D_PHYSICAL_ACCEPTANCE_PENDING';
   r.titleTopologyStatus='REVIEW';r.componentIds=components.map(x=>x.typeId);
   r.realWiredCircuit=true;r.nativeDynamicAcceptance=true;
   r.physicalAcceptance=false;r.windowsVisualAcceptance=false;
   r.independentPedagogicalAcceptance=false;
   r.sc711ReversingNative='SC711-TRUE-CONTACTOR-REVERSE-SELECTOR-INTERLOCK-V1';
  }
 }


 // SC709: Arduino actually reads the PIR signal on D2 and drives an LED on D9.
 // No unsupported mains/motor circuit is represented as microcontroller code.
 {
  const sc=709,lesson=L.lessons[sc-1],p=lesson?.project,r=lesson?.pedagogyReview||{};
  if(lesson?.id==='sensor-analog-apps-outline-059'&&lesson.kind==='wiring'&&
   p?.components?.some(c=>c.typeId==='proximity')&&p?.wires?.length===7&&
   !p.components.some(c=>c.typeId==='arduino-uno')&&
   r.independentPedagogicalAcceptance!==true){
   const mk=(id,typeId,label,x,y,extra={})=>({
    id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra
   });
   const sketch=[
    'void setup(){','  pinMode(2, INPUT);','  pinMode(9, OUTPUT);','}',
    'void loop(){','  if(digitalRead(2)==HIGH){',
    '    digitalWrite(9,HIGH);','  }else{',
    '    digitalWrite(9,LOW);','  }','}'
   ].join('\n');
   const components=[
    mk('uno','arduino-uno','Arduino UNO R3 · D2 sensör, D9 gösterge',85,230,{
     arduinoSketch:sketch,arduinoProgramName:'SC709 · PIR hareketi ve LED'}),
    mk('pir','arduino-pir','PIR hareket algılama sensörü',585,100),
    mk('limit','arduino-resistor-220','LED akım sınırlandırma 220 Ω',635,385),
    mk('led','arduino-led','D9 hareket LED göstergesi',930,390)
   ];
   const edges=[
    ['uno','5V','pir','VCC','Arduino 5 V, PIR sensör beslemesidir.'],
    ['uno','GND','pir','GND','PIR ve Arduino aynı 0 V referansını paylaşır.'],
    ['pir','OUT','uno','D2','Hareket algılama bilgisi dijital D2 pinine gelir.'],
    ['uno','D9','limit','1','Sketch D9 çıkışını 220 Ω LED serisine gönderir.'],
    ['limit','2','led','A','LED anodu akım sınırlayıcı üzerinden bağlanır.'],
    ['led','K','uno','GND','LED katodu 0 V dönüşünü tamamlar.']
   ];
   p.components=components;p.wires=edges.map(([a,ap,b,bp,why],i)=>({
    id:'sc709-arduino-pir-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
   }));
   p.workspaceMode='arduino';p.preferredAppearance='material';
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
   lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   lesson.materials=components.map(x=>({id:x.id,label:x.label,
    why:x.id==='uno'?'Gerçek sketch sensör D2 durumunu okuyup D9 çıkışını değiştirir.':
    x.id==='pir'?'Sanal PIR hareket durumunu kullanıcı değiştirebilir.':
    x.id==='limit'?'Sanal LED çıkışına 220 Ω seri direnç bağlanır.':
    'Yalnız D9 etkinleştiğinde yanacak sanal göstergedir.'}));
   lesson.summary='Arduino UNO D2 girişinden PIR hareketini okur; D9 çıkışı 220 Ω üzerinden LED yakar. PIR 5 V/GND veya OUT hattı koparsa LED sönmelidir. Bu 5 V sanal ders gerçek donanım kabulü değildir.';
   lesson.practiceGuide={
    version:'practice-n1',method:'virtual-circuit-check',
    heading:'Hareket algılandığında Arduino ne yapıyor?',
    virtualOnly:true,physicalTestAccepted:false,pedagogicalAcceptance:false,
    canonicalGraphUnchanged:false,fullyRich:false,
    steps:['Önce Arduino 5 V, GND ve PIR OUT → D2 kablolarını bul.',
     'PIR hareket düğmesini kapalı tut: D9 LED sönük olmalı.',
     'Hareketi aç: sketch D2 okur ve D9 LED yanar.',
     'PIR OUT, 5 V veya GND kablosunu tek tek çıkar: LED tekrar sönmeli.'],
    observations:['Arduino kodu gerçekten sanal yorumlayıcıda çalışır; yalnız sembol değildir.',
     'Windows/3D terminal hizası ve bağımsız pedagojik kabul açık.'],
    repairModel:'SC709-PIR-POWERED-ARDUINO-LED-V1'};
   lesson.pedagogyReview=lesson.pedagogyReview||{};
   lesson.pedagogyReview.titleTopologyIssue='WINDOWS_3D_PHYSICAL_ACCEPTANCE_PENDING';
   lesson.pedagogyReview.titleTopologyStatus='REVIEW';
   lesson.pedagogyReview.componentIds=components.map(x=>x.typeId);
   lesson.pedagogyReview.realWiredCircuit=true;
   lesson.pedagogyReview.nativeDynamicAcceptance=false;
   lesson.pedagogyReview.physicalAcceptance=false;
   lesson.pedagogyReview.windowsVisualAcceptance=false;
   lesson.pedagogyReview.independentPedagogicalAcceptance=false;
   lesson.pedagogyReview.sc709NativeRepair='SC709-PIR-POWERED-ARDUINO-LED-V1';
  }
 }


 // SC708: actual Arduino input, sketch and H-bridge controlled low-voltage motor.
 {
 const sc=708,l=L.lessons[sc-1],p=l?.project,r=l?.pedagogyReview||{};
 if(l?.id==='motor-direct-power-outline-039'&&l.kind==='wiring'&&
  p?.components?.some(c=>c.typeId==='motor-3p')&&
  p.components.some(c=>c.typeId==='main-contact')&&p.wires?.length===13&&
  !p.components.some(c=>c.typeId==='arduino-uno')&&
  r.independentPedagogicalAcceptance!==true){
  const C=(id,typeId,label,x,y,extra={})=>({
   id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const code=['void setup(){',' pinMode(2, INPUT);',' pinMode(7, OUTPUT);',
    ' pinMode(8, OUTPUT);',' pinMode(9, OUTPUT);','}',
    'void loop(){',' if(digitalRead(2)==HIGH){',
    '  digitalWrite(8,HIGH);','  digitalWrite(7,LOW);','  digitalWrite(9,HIGH);',
    ' }else{','  digitalWrite(8,LOW);','  digitalWrite(7,LOW);',
    '  digitalWrite(9,LOW);',' }','}'].join('\n');
  const parts=[
   C('uno','arduino-uno','Arduino UNO / dijital giriş ve motor sürme',55,240,{
    arduinoSketch:code,arduinoProgramName:'SC708 sanal 5V motor kontrolü'}),
   C('button','arduino-button','START düğmesi · D2',460,65),
   C('driver','arduino-l298n','L298N · sanal H-köprü',735,200),
   C('ps','arduino-bench-supply','Yalnız sanal 5 V motor beslemesi',485,515,{dcVoltage:5}),
   C('motor','arduino-dc-motor','M1 3–6 V DC hobi motoru',1100,250)
  ];
  const wire=[
   ['uno','5V','button','VCC','Arduino 5 V buton modülü beslemesi.'],
   ['uno','GND','button','GND','Buton 0 V referansı.'],
   ['button','SIG','uno','D2','START bilgisini Arduino D2 okur.'],
   ['uno','5V','driver','5V','L298N lojik 5 V beslemesi.'],
   ['uno','GND','driver','GND','Sürücü lojik GND ortak.'],
   ['uno','D9','driver','ENA','Sürücü etkinleştirme.'],
   ['uno','D8','driver','IN1','İleri yön sinyali.'],
   ['uno','D7','driver','IN2','Geri sinyali LOW tutulur.'],
   ['ps','P','driver','12V','Modelde Vmotor=5 V, 12V terminal adı nominal giriş adıdır.'],
   ['ps','M','driver','GND','Motor besleme dönüşü.'],
   ['uno','GND','ps','M','Ortak 0 V referansı.'],
   ['driver','OUT1','motor','+','Sanal H-köprü motorun + terminalini sürer.'],
   ['driver','OUT2','motor','-','Sanal H-köprü motorun − terminalini sürer.']
  ];
  p.components=parts;p.wires=wire.map(([a,ap,b,bp,why],i)=>({
   id:'sc708-arduino-motor-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
  }));
  p.workspaceMode='arduino';p.preferredAppearance='material';
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(x=>({id:x.id,label:x.label,why:
   x.id==='uno'?'Sketch D2 butonunu okur; D7/D8/D9 ile sürücü komutlarını üretir.':
   x.id==='driver'?'Motoru Arduino pininden değil, sanal ayrı güç çıkışından besler.':
   x.id==='ps'?'Yalnız uygulama içindeki 5 V motor besleme modelidir.':
   x.id==='motor'?'Sanal DC motorda sadece çalışıyor/duruyor durumu modellenir.':
   'D2 kontrol girişini sanal uygulamada değiştirir.'}));
  l.summary='Arduino D2 START butonunu okur, D8/D9 üzerinden sanal L298N sürücüyü etkinleştirir; DC motorun sanal çalışma durumunu değiştirir. Akım, gerçek devir ve mekanik hareket modellenmez.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Arduino ile sanal motoru açıp kapatalım',
   virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['Arduino D2 buton, D8–D9 motor sürücü girişlerini bul.',
    'START bırakılmışken motorun sanal durumunu kontrol et.',
    'START basılınca Arduino sketch ve L298N modeliyle motor etkinleşmeli.',
    'Besleme, ENA, buton sinyali veya motor çıkış kablosunu çıkar: motor durmalı.'],
   observations:['Burada gösterilen yalnızca idealize sanal 5 V H-köprü etkinlik modelidir.',
    'Gerçek elektronik akım/ısı, motor hızı ve Windows/3D kabulü ayrıca açık.'],
   repairModel:'SC708-ARDUINO-L298N-DC-MOTOR-V1'};
  l.pedagogyReview=l.pedagogyReview||{};
  l.pedagogyReview.titleTopologyStatus='REVIEW';
  l.pedagogyReview.titleTopologyIssue='FULL_ELECTRICAL_SOLVE_WINDOWS_3D_PENDING';
  l.pedagogyReview.componentIds=parts.map(x=>x.typeId);
  l.pedagogyReview.realWiredCircuit=true;
  l.pedagogyReview.nativeDynamicAcceptance=false;
  l.pedagogyReview.physicalAcceptance=false;
  l.pedagogyReview.windowsVisualAcceptance=false;
  l.pedagogyReview.independentPedagogicalAcceptance=false;
  l.pedagogyReview.sc708NativeRepair='SC708-ARDUINO-L298N-DC-MOTOR-V1';
 }
 }


 // SC725–727: distinct, source-exact two-BD139 RC teaching circuits.
 // Reuse the existing guarded SC386–388 native ideal timing models. These are
 // not SPICE or physical hardware acceptance and do not touch Golden scenes.
 {
  const circuits=[
   {n:725,id:'oscillator-filter-apps-outline-065',type:'mono',
    lines:[['g','P','rc1','1'],['rc1','2','q1','C'],['g','P','rc2','1'],['rc2','2','q2','C'],['q1','E','g','M'],['q2','E','g','M'],['g','P','rb2','1'],['rb2','2','q2','B'],['q2','C','rfb','1'],['rfb','2','q1','B'],['q1','C','c1','1'],['c1','2','q2','B'],['g','P','s1','13'],['s1','14','rtr','1'],['rtr','2','q1','B'],['q1','B','rpd','1'],['rpd','2','g','M']],
    heading:'Tek kararlı: butona basınca kısa süreli darbe',
    summary:'SET düğmesi Q1 iletimini yaklaşık 0,693 saniye sürdürür; süre dolunca iki BD139 başlangıç durumuna döner.',
    steps:['5 V kaynak ve iki BD139 transistörün B/C/E terminallerini bul.','Kollektör dirençlerini, C1 kondansatörünü ve geri besleme kolunu sırayla bağla.','S1 butonuna bas: Q1 etkin, Q2 pasif olur.','Yaklaşık 0,693 saniye sonra Q1 söner, Q2 etkinleşir. Kablo koparsa darbe geçersiz olur.'],
    quiz:'Tek kararlı devrede tetiklemeden sonra ne olur?',answers:['Kısa süre sonra başlangıç durumuna döner.','Sürekli iki yönde sayar.','Giriş olmadan motoru hızlandırır.']},
   {n:726,id:'oscillator-filter-apps-outline-066',type:'bistable',
    lines:[['g','P','rc1','1'],['rc1','2','q1','C'],['g','P','rc2','1'],['rc2','2','q2','C'],['q1','E','g','M'],['q2','E','g','M'],['q1','C','rfb1','1'],['rfb1','2','q2','B'],['q2','C','rfb2','1'],['rfb2','2','q1','B'],['g','P','sset','13'],['sset','14','rset','1'],['rset','2','q1','B'],['g','P','sreset','13'],['sreset','14','rreset','1'],['rreset','2','q2','B']],
    heading:'Çift kararlı: SET ve RESET ile durumu sakla',
    summary:'Çapraz kolektör-beyz geri beslemesi iki BD139 ile iki kararlı durumu oluşturur. SET ve RESET ayrı butonlardır.',
    steps:['5 V beslemeyi ve iki BD139 kollektör direncini bağla.','Kollektörleri çapraz geri besleme dirençleriyle karşı transistörlerin beyzine bağla.','SET tuşuna basıp bırak: Q1 durumu korunur.','RESET tuşuna bas: Q2 etkinleşir. Aynı anda SET ve RESET basılması geçerli komut değildir.'],
    quiz:'Çift kararlı devre SET butonu bırakılınca ne yapar?',answers:['Son durumu korur.','Her zaman hemen sıfıra döner.','Sürekli frekans üretir.']},
   {n:727,id:'oscillator-filter-apps-outline-067',type:'astable',
    lines:[['g','P','rc1','1'],['rc1','2','q1','C'],['g','P','rc2','1'],['rc2','2','q2','C'],['q1','E','g','M'],['q2','E','g','M'],['g','P','rb1','1'],['rb1','2','q1','B'],['g','P','rb2','1'],['rb2','2','q2','B'],['q1','C','c1','1'],['c1','2','q2','B'],['q2','C','c2','1'],['c2','2','q1','B']],
    heading:'Kararsız: iki transistör sırayla çalışır',
    summary:'İki çapraz RC kolu BD139 transistörlerini yaklaşık 0,72 Hz ile dönüşümlü sürer; ayrı bir buton gerekmez.',
    steps:['İki BD139, iki kondansatör ve dört direnci yerleştir.','Q1 kollektöründen C1 ile Q2 beyzine; Q2 kollektöründen C2 ile Q1 beyzine bağla.','Sanal zamanı ilerlet: yaklaşık 0,693 saniyede etkin transistör değişir.','Bir RC kolunu kopar: periyodik geçiş kaybolur.'],
    quiz:'Kararsız multivibratörde hangi davranış beklenir?',answers:['İki transistör dönüşümlü iletime geçer.','SET olmadan durum değişmez.','Sadece bir kez darbe verir.']}
  ];
  const make=(id,typeId,i,extra={})=>({id,typeId,ref:id.toUpperCase(),label:id.toUpperCase(),
   x:70+(i%4)*285,y:80+Math.floor(i/4)*225,rotation:0,state:false,address:'',note:'',...extra});
  for(const s of circuits){
   const lesson=L.lessons[s.n-1],p=lesson?.project,rev=lesson?.pedagogyReview;
   if(lesson?.id!==s.id||lesson.kind!=='wiring'||p?.wires?.length!==8||
      p.components.filter(c=>c.typeId==='bd139-npn').length!==1||
      rev?.independentPedagogicalAcceptance===true)continue;
   const ids=[...new Set(s.lines.flatMap(w=>[w[0],w[2]]))],parts=ids.map((id,i)=>{
    const type=id==='g'?'arduino-bench-supply':id==='q1'||id==='q2'?'bd139-npn':
     id.startsWith('c')?'capacitor':id.startsWith('s')?'push-no':'resistor';
    const props=id==='g'?{dcVoltage:5}:type==='bd139-npn'?{
      mq07StandaloneBjtMonostable:s.type==='mono',mq07StandaloneBjtBistable:s.type==='bistable',
      mq07StandaloneBjtAstable:s.type==='astable'}:type==='capacitor'?{capacitance:0.0001}:
      type==='resistor'?{resistance:id.startsWith('rc')?1000:10000}:{};
    return make(id,type,i,props);
   });
   p.components=parts;
   p.wires=s.lines.map(([a,ap,b,bp],i)=>({
    id:'sc'+s.n+'-rc-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Gerçek katalog B/C/E, direnç ve kondansatör terminallerini birleştirir.'
   }));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
   lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   lesson.materials=parts.map(c=>({id:c.id,label:c.label,why:
    c.typeId==='bd139-npn'?'Çapraz RC ağındaki NPN transistör.':
    c.typeId==='capacitor'?'Gerçek RC zaman sabiti için 100 µF kondansatör.':
    c.typeId==='resistor'?'Kollektör, tetikleme veya geri besleme direnci.':
    c.typeId==='arduino-bench-supply'?'Güvenli 5 V sanal DC kaynak.':
    'Sanal SET/RESET/tetik butonu.'}));
   lesson.summary=s.summary+' Kaynak doğrulamalı ideal RC zaman modeli; gerçek SPICE veya Windows/3D kabulü değildir.';
   lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:s.heading,virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:s.steps,observations:[s.summary,
     'Native model, yalnız doğru 5 V kaynak ve eksiksiz RC grafiğinde davranış üretir.',
     'Kopuk kablo, gerçek donanım ve 3D görsel kabulü bağımsız takip edilir.'],
    repairModel:'SC'+s.n+'-TWO-BD139-'+s.type.toUpperCase()+'-RC-V1'};
   lesson.quiz={question:s.quiz,options:s.answers,answer:0,
    why:'Bu üç farklı devrede buton tetiklemesi, bellek ve sürekli salınım aynı şey değildir.'};
   const review=lesson.pedagogyReview||(lesson.pedagogyReview={});
   review.titleTopologyStatus='REVIEW';
   review.titleTopologyIssue='WINDOWS_3D_AND_PHYSICAL_RC_ACCEPTANCE_PENDING';
   review.preRepairIssue='SINGLE_BD139_PUSHBUTTON_GRAPH_NOT_MULTIVIBRATOR';
   review.realWiredCircuit=true;review.nativeDynamicAcceptance=false;
   review.physicalAcceptance=false;review.windowsVisualAcceptance=false;
   review.independentPedagogicalAcceptance=false;
   review.scBjtRcRealCircuitRepair='SC'+s.n+'-TWO-BD139-'+s.type.toUpperCase()+'-RC-V1';
  }
 }


 // SC712: two genuine BD139 pin-connected common-emitter Schmitt stages.
 {
 const sc=712,lesson=L.lessons[sc-1],p=lesson?.project;
 if(lesson?.id==='electronic-switching-outline-062'&&lesson.kind==='wiring'&&
 p?.components?.filter(c=>c.typeId==='bd139-npn').length===1&&
 p.wires?.length===8&&lesson.pedagogyReview?.independentPedagogicalAcceptance!==true){
  const item=(id,typeId,label,x,y,extra={})=>({id,typeId,ref:id.toUpperCase(),label,
   x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
   item('g1','arduino-bench-supply','G1 · 5 V sanal DC',35,290,{dcVoltage:5}),
   item('rv','potentiometer','RV1 · Vin 0–5 V',250,80,{potMax:10000,potentiometer:0}),
   item('rin','resistor','RIN · 10 kΩ',470,95,{resistance:10000}),
   item('q1','bd139-npn','Q1 · giriş transistörü',735,160),
   item('q2','bd139-npn','Q2 · çıkış transistörü',1035,410),
   item('rc1','resistor','RC1 · 2.2 kΩ',660,50,{resistance:2200}),
   item('rc2','resistor','RC2 · 2.2 kΩ',1050,260,{resistance:2200}),
   item('re','resistor','RE · 330 Ω ortak emiter',860,580,{resistance:330}),
   item('rfb','resistor','RFB · 4.7 kΩ pozitif geri besleme',850,280,{resistance:4700}),
   item('rpd','resistor','RPD · 10 kΩ ikinci baz dönüşü',1190,540,{resistance:10000}),
   item('v1','unit-ut33d-plus','V1 · sanal DCV 20 V',1310,60,{meterPosition:3}),
   item('v1-red','test-probe-red','V1 kırmızı ölçüm probu',1350,245),
   item('v1-black','test-probe-black','V1 siyah COM probu',1350,650)
  ];
  const edges=[
   ['g1','P','rv','1'],['rv','3','g1','M'],
   ['rv','2','rin','1'],['rin','2','q1','B'],
   ['g1','P','rc1','1'],['rc1','2','q1','C'],
   ['g1','P','rc2','1'],['rc2','2','q2','C'],
   ['q1','E','q2','E'],['q1','E','re','1'],['re','2','g1','M'],
   ['q1','C','rfb','1'],['rfb','2','q2','B'],
   ['q2','B','rpd','1'],['rpd','2','g1','M'],
   ['v1','V','v1-red','PLUG'],['v1','COM','v1-black','PLUG'],
   ['v1-red','TIP','q2','C'],['v1-black','TIP','g1','M']
  ];
  p.components=parts;
  p.wires=edges.map(([a,ap,b,bp],i)=>({
   id:'sc712-two-bd139-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'İki BD139 ve ortak emiter/geri besleme ağının gerçek katalog terminali.'}));
  p.sc712SchmittModel='SC712-TWO-BD139-SCHMITT-HYSTERESIS-V1';
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
  lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  lesson.materials=parts.map(c=>({id:c.id,label:c.label,why:c.id==='rfb'?
    'Kolektör geri beslemesi ve ortak emiter direnci Schmitt hafızasını oluşturur.':
    c.id==='rv'?'Girişi yavaşça artırıp azaltmak için 0–5 V ayar.':
    c.typeId==='bd139-npn'?'Gerçek BD139 B/C/E pinlerini kullanır.':
    'Sanal 5 V devresinin katalog terminaliyle bağlı elemanı.'}));
  lesson.summary='Girişi artırırken ve azaltırken aynı 2,5 V noktasında farklı çıkış durumunu izle. İki BD139, ortak emiter direnci ve geri besleme gerçek kabloludur. Eşikler ideal eğitim yaklaşımıdır; donanım/SPICE kalibrasyonu ve Windows/3D kabulü bekler.';
  lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:'Schmitt devresinde iki ayrı eşiği keşfet',
   virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
   pedagogicalAcceptance:false,fullyRich:false,
   steps:['5 V ile iki BD139 kolektör direncini ve ortak emiter RE hattını besle.',
    'RV1 değerini %0 → %50 → %80 → %50 → %0 olarak sırayla ayarla.',
    '2,5 V noktasındaki çıkışın giriş geçmişine göre neden değiştiğini izle.',
    'RFB kablosunu çıkarınca modelin histerezis kabulünü reddettiğini gözlemle.'],
   observations:['Sanal eşikler yukarıda 3,2 V, aşağıda 1,8 V; üretici datasheet eşiği değildir.',
    'Gerçek multimetre ölçüm kalibrasyonu ve 3D terminal hizası ayrıca kabul edilir.'],
   repairModel:'SC712-TWO-BD139-SCHMITT-HYSTERESIS-V1'};
  const v=lesson.pedagogyReview||(lesson.pedagogyReview={});
  v.preRepairIssue='SINGLE_BD139_BUTTON_SWITCH_HAS_NO_HYSTERESIS';
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='WINDOWS_3D_AND_PHYSICAL_BJT_HYSTERESIS_ACCEPTANCE_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.sc712SchmittRepair='SC712-TWO-BD139-SCHMITT-HYSTERESIS-V1';
 }
 }


 // SC718 · real LM358P A measurement / stable unused B channel.
 {
  const l=L.lessons[717],p=l?.project,review=l?.pedagogyReview;
  if(l?.id==='opamp-apps-outline-056'&&l.kind==='wiring'&&
     p?.components?.length===10&&p.wires?.length===14&&
     p.components.find(c=>c.id==='u1')?.typeId==='lm358p-dip8'&&
     review?.independentPedagogicalAcceptance!==true){
    p.components.find(c=>c.id==='in').potentiometer=50;
    for(const [a,ap,b,bp,why] of [
      ['g1','M','u1','5','Boş B kanalı pin 5, 0 V referansa gider.'],
      ['u1','7','u1','6','Boş B kanalı pin 7, pin 6 geri beslemesine döner.'],
      ['v1-red','TIP','u1','1','UNI-T kırmızı TIP, A kanalının OUT pin 1 ucundadır.'],
      ['v1-black','TIP','g1','M','UNI-T siyah TIP 0 V ölçüm referansına bağlıdır.']]){
       p.wires.push({id:'sc718-measure-'+p.wires.length,from:{c:a,p:ap},to:{c:b,p:bp},
         role:'MEASURE',color:'#43857f',size:'1.5',points:[],
         tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
    }
    p.sc718MeasurementGuard='SC718-LM358-DIP8-INPUT-OUTPUT-UT33D-V1';
    p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
    l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
      hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
    l.summary='LM358P A kanalı 24 V beslenir; 10 kΩ giriş ve 47 kΩ negatif geri besleme bulunur. Potun %45/%50/%55 ayarlarında UNI-T DCV200 ile çıkışı izle. Kullanılmayan B kanalı ve gerçek ölçüm uçları bağlıdır. Kalibre cihaz veya Windows/3D kabulü değildir.';
    l.practiceGuide={version:'practice-n1',heading:'LM358P pinleriyle ölçmeyi öğrenelim',
      method:'virtual-circuit-check',virtualOnly:true,canonicalGraphUnchanged:false,
      physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
      steps:['Pin 8 +24 V ve pin 4 0 V beslemelerini gözden geçir.',
        '12 V R3/R4 orta referansı pin 3, giriş R1 üzerinden pin 2, R2 çıkıştan pin 2 üzerindedir.',
        'B kanalı pin 5 → 0 V ve pin 7 → pin 6 ile boşta kalmaz.',
        'UNI-T kırmızı probu OUT pin 1, siyah probu 0 V üzerine koy ve DCV200 kullan.',
        'Potu %45, %50 ve %55 yap; ölçülen çıkış değişimini karşılaştır.',
        'Çıkış probunu ve R2 geri beslemesini ayrı ayrı koparıp sonucu incele.'],
      observations:['Prob kopuğunda OL, gerçek geri besleme yoksa deneyin durumu geçersizdir.',
        'Bu ölçüm ideal/numeric eğitim simülasyonudur; Windows/3D kabulü açık.'],
      repairModel:'SC718-LM358-DIP8-INPUT-OUTPUT-UT33D-V1'};
    review.titleTopologyStatus='REVIEW';
    review.titleTopologyIssue='WINDOWS_3D_AND_FULL_PHYSICAL_OPAMP_ACCEPTANCE_PENDING';
    review.realWiredCircuit=true;review.nativeDynamicAcceptance=false;
    review.physicalAcceptance=false;review.windowsVisualAcceptance=false;
    review.independentPedagogicalAcceptance=false;
    review.sc718MeasurementRepair='SC718-LM358-DIP8-INPUT-OUTPUT-UT33D-V1';
  }
 }


 // SC770: Ohm's law is measured with a series ammeter and parallel voltmeter.
 // The original 5-wire project left all four probe TIP terminals floating.
 {
 const lesson=L.lessons[769],p=lesson?.project;
 if(lesson?.id==='electronic-component-basics-outline-087'&&lesson.kind==='wiring'&&
    p?.components?.length===8&&p.wires?.length===5&&
    p.components.find(c=>c.id==='r1')?.typeId==='resistor'&&
    lesson.pedagogyReview?.independentPedagogicalAcceptance!==true){
  for(const [a,ap,b,bp,why] of [
   ['a1-red','TIP','g1','P','Seri akım ölçerin kırmızı probu +12 V kaynaktadır.'],
   ['a1-black','TIP','r1','1','Seri akım ölçerin COM probu direnç girişindedir.'],
   ['v1-red','TIP','r1','1','Paralel voltmetrenin kırmızı probu direnç girişindedir.'],
   ['v1-black','TIP','r1','2','Paralel voltmetrenin siyah probu direnç çıkışındadır.']]){
    p.wires.push({id:'sc770-meter-'+p.wires.length,from:{c:a,p:ap},to:{c:b,p:bp},
      color:'#43857f',role:'MEASURE',size:'1.5',points:[],
      tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
  }
  p.sc770MeterGuard='SC770-RESISTOR-REAL-UT33D-PROBE-TIPS-V1';
  p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
  lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
    why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  lesson.summary='12 V ve 1 kΩ dirençle küçük bir deney: UNI-T A1 seri koldan yaklaşık 12 mA, V1 direnç uçlarından yaklaşık 12 V okur. I=V/R bağlantısını bu iki okumayla anlamlandır; enerjili devrede doğrudan ohmmetre ölçümü yapılmaz. Windows/3D kabulü ve gerçek cihaz kalibrasyonu açık.';
  lesson.practiceGuide={version:'practice-n1',heading:'Dirençte gerilim ve akım nerede ölçülür?',
    method:'virtual-circuit-check',virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:['G1 kaynağını 12 V, R1 direncini 1 kΩ olarak oku.',
     'A1 kırmızı TIP kaynağın + ucuna, siyah TIP R1 girişine bağlanır: akım ölçeri seri olur.',
     'V1 kırmızı TIP R1 girişine, siyah TIP çıkışına bağlanır: voltmetre paralel olur.',
     'A1 yaklaşık 12 mA, V1 yaklaşık 12 V olmalı. I=V/R hesabıyla karşılaştır.',
     'A1 seri probunu ve V1 probunu sırayla çıkar; OL uyarısıyla kablo kopuğunu ayır.'],
    observations:['Ohmmetre (Ω) ile direnç doğrudan ölçümü yalnız enerjisiz ayrı deneyde yapılır.',
     'Bu sonuçlar sanal ölçümdür; gerçek donanım ve 3D kabul kanıtı değildir.'],
    repairModel:'SC770-RESISTOR-REAL-UT33D-PROBE-TIPS-V1'};
  const rev=lesson.pedagogyReview||(lesson.pedagogyReview={});
  rev.titleTopologyStatus='REVIEW';rev.titleTopologyIssue='WINDOWS_3D_AND_FULL_METER_ACCEPTANCE_PENDING';
  rev.realWiredCircuit=true;rev.nativeDynamicAcceptance=false;
  rev.physicalAcceptance=false;rev.windowsVisualAcceptance=false;
  rev.independentPedagogicalAcceptance=false;
  rev.sc770MeterRealRepair='SC770-RESISTOR-REAL-UT33D-PROBE-TIPS-V1';
 }
 }


 // SC779: preserve working BD139 collector switching; finish physical probe tips.
 {
  const l=L.lessons[778],p=l?.project,r=l?.pedagogyReview;
  if(l?.id==='electronic-switching-outline-070'&&l.kind==='wiring'&&
     p?.components?.length===8&&p.wires?.length===8&&
     p.components.find(c=>c.id==='q1')?.typeId==='bd139-npn'&&
     r?.independentPedagogicalAcceptance!==true){
   for(const [a,ap,b,bp,why] of [
    ['v1-red','TIP','q1','C','Kırmızı UNI-T TIP doğrudan BD139 kolektör ucundadır.'],
    ['v1-black','TIP','g1','M','Siyah UNI-T TIP 0 V referansındadır.']]){
    p.wires.push({id:'sc779-probe-'+p.wires.length,from:{c:a,p:ap},to:{c:b,p:bp},
      color:'#43857f',role:'MEASURE',size:'1.5',points:[],
      tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
   }
   p.sc779MeterGuard='SC779-BD139-REAL-COLLECTOR-PROBE-TIPS-V1';
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
     hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.summary='BD139 anahtar devresinde buton serbestken yaklaşık 24 V kolektör ölçülür, basıldığında kolektör 0 V civarına iner. Kırmızı UNI-T probu gerçek kolektör, siyah prob 0 V ucundadır. B/C/E terminallerini karıştırma. Bu sanal model Windows/3D ve fiziksel kabul yerine geçmez.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'BD139 kolektör gerilimini birlikte ölçelim',virtualOnly:true,
    canonicalGraphUnchanged:false,physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:['G1 sanal 24 V, 1 kΩ kolektör yükü ve BD139 B/C/E uçlarını bul.',
     'Buton S1 bırakılmışken kolektör yaklaşık 24 V: transistor kesimdedir.',
     'Butona bas: beyz direncinden sürülen BD139 iletime geçer, kolektör yaklaşık 0 V olur.',
     'Kırmızı UNI-T TIP Q1/C, siyah TIP G1/M terminaline temas eder; DCV200 seç.',
     'Kırmızı ölçüm ucunu ayırınca OL uyarısını gözlemle.'],
    observations:['Kolektör gerilimi transistörün durumunu anlatır; bu doğruluk sertifikası değildir.',
     'Gerçek Windows/3D terminal ve kalibre ölçüm kabulü bekler.'],
    repairModel:'SC779-BD139-REAL-COLLECTOR-PROBE-TIPS-V1'};
   const v=r||(l.pedagogyReview={});v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='WINDOWS_3D_AND_PHYSICAL_BD139_PROBE_ACCEPTANCE_PENDING';
   v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.sc779ProbeRepair='SC779-BD139-REAL-COLLECTOR-PROBE-TIPS-V1';
  }
 }


 // SC789/790/791 — real motor lessons, no reuse of the unrelated DOL starter.
 // All are SANAL training circuits: Windows/3D and physical acceptance stay REVIEW.
 {
  const mk=(id,typeId,ref,label,x,y,more={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...more
  });
  const install=(n,expectedId,parts,edges,summary,guideText,mark)=>{
   const lesson=L.lessons[n-1],p=lesson?.project,review=lesson?.pedagogyReview;
   if(lesson?.id!==expectedId||lesson.kind!=='wiring'||
      p?.components?.length!==7||p?.wires?.length!==13||
      p.components.filter(x=>x.typeId==='main-contact').length!==1||
      p.components.find(x=>x.id==='motor')?.typeId!=='motor-3p'||
      review?.independentPedagogicalAcceptance===true)return;
   p.components=parts;
   p.wires=edges.map(([a,ap,b,bp,why],i)=>({
    id:'sc'+n+'-real-motor-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
   }));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
   lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   lesson.materials=parts.map(x=>({id:x.id,label:x.label,
    why:x.typeId==='sinamics-v20-1p'?'Frekansı ayarlanan üç fazlı sanal motor sürücüsü.':
    x.typeId==='motor-y-d'?'U1/V1/W1/U2/V2/W2 uçları yıldız veya üçgen topolojisini gösterir.':
    x.typeId==='selector-3'?'İleri veya geri START yolundan yalnız birini seçer.':
    x.typeId==='contact-nc'?'Karşı yönün kontaktör bobinine kilit uygular.':
    'Gerçek katalog uçlarına bağlı yalnız sanal devre elemanı.'}));
   lesson.summary=summary+' Tam Windows/3D görsel ve bağımsız pedagojik kabul bekleniyor.';
   lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Sanal motor deneyini birlikte inceleyelim',virtualOnly:true,
    canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,steps:guideText,
    observations:['Bütün bağlantılar yalnız uygulamanın sanal modelinde denenir.',
     'Gerçek elektrik donanımına bağlantı talimatı değildir; Windows/3D kabulü ayrıdır.'],
    repairModel:mark};
   const v=review||(lesson.pedagogyReview={});
   v.preRepairTitleTopologyIssue='THREE_PHASE_DOL_STARTER_UNRELATED_TO_LESSON_TITLE';
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
   v.componentIds=parts.map(x=>x.typeId);
   v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.scRealMotorRepair=mark;
  };
  // SC789: slip from the drive frequency and rated motor RPM, not fixed DOL wiring.
  {
   const rated={P0700:1,P1000:1,P1040:35,P0304:230,P0305:3.5,
    P0307:0.75,P0310:50,P0311:1400,P1120:2,P1121:2};
   const parts=[
    mk('g','supply-1p','G1','Sanal tek fazlı V20 şebeke kaynağı',65,225),
    mk('vfd','sinamics-v20-1p','U1','SINAMICS V20 · 35 Hz çıkış',460,170,{
     v20:{schema:1,macro:'Cn001',params:rated,run:true,reverse:false,
      reset:0,load:35,temperature:30}}),
    mk('motor','motor-3p','M1','Üç fazlı sanal asenkron motor',1040,235)
   ];
   const edges=[
    ['g','L','vfd','L1','Sanal sürücünün L girişidir.'],
    ['g','N','vfd','N','Sürücü girişinin N dönüşüdür.'],
    ['g','PE','vfd','PE','Sanal koruma hattıdır.'],
    ['vfd','U','motor','U','Sürücü U çıkışı motor fazına gider.'],
    ['vfd','V','motor','V','Sürücü V çıkışı motor fazına gider.'],
    ['vfd','W','motor','W','Sürücü W çıkışı motor fazına gider.'],
    ['vfd','PE2','motor','PE','Motor koruma hattını gösterir.']
   ];
   install(789,'motor-direct-power-outline-045',parts,edges,
    '35 Hz ve 4 kutup için n_s=120×35/4=1050 dev/dak. V20 P0311=1400/50 Hz modelinde tahmini n_r≈980 dev/dak; kayma yaklaşık %6,7. Bu ölçülmüş fiziksel motor devri değildir.',
    ['Önce sanal V20 ve M1 motorunu gözlemle.',
     '35 Hz için dört kutuplu senkron devir olan 1050 dev/dak değerini hesapla.',
     'V20 modelinin tahmini 980 dev/dak rotor hızını karşılaştır; kaymayı bul.',
     'Şebeke L veya motor W kablosunu sanal deneyde ayırarak etkiyi gözlemle.'],
    'SC789-REAL-V20-SLIP-NATIVE-V1');
   if(L.lessons[788]?.practiceGuide?.repairModel==='SC789-REAL-V20-SLIP-NATIVE-V1')
    L.lessons[788].project.speedStudy={poleCount:4,supplyHz:35,
     synchronousRpm:1050,estimatedRotorRpm:980,estimatedSlipPercent:100*(1050-980)/1050,
     note:'V20 modelinden türetilen eğitim tahmini, kalibre motor ölçümü değildir.'};
  }
  // SC790: independent, real six-terminal STAR and DELTA branches.
  {
   const parts=[
    mk('gs','supply-3p','G1','Sanal yıldız deneyi kaynağı',50,160),
    mk('ms','motor-y-d','M1','Altı uçlu Y motoru',420,145,{motorConnection:'external'}),
    mk('gd','supply-3p','G2','Sanal üçgen deneyi kaynağı',50,555),
    mk('md','motor-y-d','M2','Altı uçlu Δ motoru',420,540,{motorConnection:'external'})
   ];
   const star=[
    ['gs','L1','ms','U1','Yıldız modelinin birinci faz yoludur.'],
    ['gs','L2','ms','V1','Yıldız modelinin ikinci faz yoludur.'],
    ['gs','L3','ms','W1','Yıldız modelinin üçüncü faz yoludur.'],
    ['gs','PE','ms','PE','M1 sanal koruma hattıdır.'],
    ['ms','U2','ms','V2','Yıldızın ilk ortak uç köprüsüdür.'],
    ['ms','V2','ms','W2','Yıldızın ikinci ortak uç köprüsüdür.']
   ];
   const delta=[
    ['gd','L1','md','U1','Üçgen modelinin birinci faz yoludur.'],
    ['gd','L2','md','V1','Üçgen modelinin ikinci faz yoludur.'],
    ['gd','L3','md','W1','Üçgen modelinin üçüncü faz yoludur.'],
    ['gd','PE','md','PE','M2 sanal koruma hattıdır.'],
    ['md','U2','md','V1','Üçgenin birinci sanal sargı köprüsüdür.'],
    ['md','V2','md','W1','Üçgenin ikinci sanal sargı köprüsüdür.'],
    ['md','W2','md','U1','Üçgenin üçüncü sanal sargı köprüsüdür.']
   ];
   install(790,'motor-direct-power-outline-046',parts,[...star,...delta],
    'İki bağımsız sanal altı uçlu motorda yıldız (U2/V2/W2 ortak) ve üçgen (çapraz uçlar) bağlantılarını karşılaştır. Eksik köprüde yalnız ilgili motor durur.',
    ['Yıldız M1 ile üçgen M2 devrelerini ayrı olarak incele.',
     'Motorlardaki altışar gerçek katalog terminalini karşılaştır.',
     'M1 yıldız köprüsünden birini sanal ortamda kopar: yalnız M1 durmalı.',
     'M2 üçgen köprüsünden birini kopar: yalnız M2 durmalı.',
     'Her iki devrede de farklı güç ve koruma hatları bulunduğunu gözlemle.'],
    'SC790-TWO-INDEPENDENT-STAR-DELTA-MOTOR-V1');
  }
  // SC791: two power contactors reverse two phases; electrical NC interlocks.
  {
   const parts=[
    mk('g','supply-3p','G1','Sanal üç fazlı kaynak',50,290),
    mk('stop','push-nc','S0','Ortak STOP',230,45),
    mk('sel','selector-3','S3','0 / ileri / geri seçimi',430,250,{position:0}),
    mk('sf','push-no','S1','İleri START',600,40),
    mk('sr','push-no','S2','Geri START',600,460),
    mk('hf','contact-no','K1','İleri mühürleme',530,140),
    mk('hr','contact-no','K2','Geri mühürleme',530,550),
    mk('nr','contact-nc','K2','Geri yön kilidi',830,145),
    mk('nf','contact-nc','K1','İleri yön kilidi',830,550),
    mk('cf','coil-contactor','K1','İleri kontaktör bobini',1040,145),
    mk('cr','coil-contactor','K2','Geri kontaktör bobini',1040,550),
    mk('mf','main-contact','K1','İleri ana kontakları',760,805),
    mk('mr','main-contact','K2','Geri ana kontakları',1080,805),
    mk('motor','motor-3p','M1','Sanal üç fazlı motor',1470,805)
   ];
   const e=[
    ['g','L1','stop','21'],['stop','22','sel','11'],
    ['sel','13','sf','13'],['sel','14','sr','13'],
    ['stop','22','hf','13'],['stop','22','hr','13'],
    ['sf','14','nr','21'],['hf','14','nr','21'],
    ['nr','22','cf','A1'],['cf','A2','g','N'],
    ['sr','14','nf','21'],['hr','14','nf','21'],
    ['nf','22','cr','A1'],['cr','A2','g','N'],
    ['g','L1','mf','1'],['g','L1','mr','1'],
    ['g','L2','mf','3'],['g','L2','mr','3'],
    ['g','L3','mf','5'],['g','L3','mr','5'],
    ['mf','2','motor','U'],['mf','4','motor','V'],['mf','6','motor','W'],
    ['mr','2','motor','W'],['mr','4','motor','V'],['mr','6','motor','U'],
    ['g','PE','motor','PE']
   ];
   install(791,'motor-direct-power-outline-047',parts,
    e.map(x=>[...x,'Yalnız sanal ileri/geri kontaktör sinyali.']),
    'K1 ileri, K2 geri kontaktörlerinin güç çıkışları iki fazın sırasını değiştirir. S3 tek yönden yeni START seçer; K1/K2 NC kilitleme ve ortak STOP iki yönü aynı anda engeller.',
    ['S3=0 iken iki START butonunun da etkisiz kaldığını kontrol et.',
     'S3=1 ve S1 ile ileri dönüşü başlat; S1 bırakılınca mühürlemeyi gözlemle.',
     'Motor ileri çalışırken S3=2 ve S2 isteği karşı yön kilidine takılmalıdır.',
     'STOP ile durdur, sonra S3=2 ve S2 ile ters dönüşü karşılaştır.',
     'Bir güç fazını koparıp motorun durmasını sanal ortamda doğrula.'],
    'SC791-REAL-TWO-CONTACTOR-FWD-REVERSE-NATIVE-V1');
  }
 }


 // SC793: 1-phase induction motor's main + auxiliary branch with run capacitor.
 // Only bounded virtual topology validation; physical start torque/RPM not claimed.
 {
  const n=793,l=L.lessons[n-1],p=l?.project,r=l?.pedagogyReview;
  if(l?.id==='motor-direct-power-outline-049'&&l.kind==='wiring'&&
     p?.components?.length===7&&p?.wires?.length===13&&
     p.components.find(x=>x.id==='motor')?.typeId==='motor-3p'&&
     p.components.filter(x=>x.typeId==='main-contact').length===1&&
     r?.independentPedagogicalAcceptance!==true){
   const make=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra
   });
   const parts=[
    make('g','supply-1p','G1','Sanal bir faz L/N/PE',90,210),
    make('motor','motor-1p','M1','Ana U/N ve yardımcı Z1/Z2 sargıları',655,220,
     {windingConnection:'external'}),
    make('cap','capacitor','C1','Yalnız sanal 20 µF yardımcı kondansatör',400,430,
     {capacitance:0.00002})
   ];
   const edges=[
    ['g','L','motor','U','Sanal ana sargının L bağlantısı.'],
    ['g','N','motor','N','Sanal ana sargının N dönüşü.'],
    ['g','PE','motor','PE','Sanal koruma bağlantısı.'],
    ['g','L','cap','1','Sanal yardımcı sargı kolu kondansatör girişi.'],
    ['cap','2','motor','Z1','Kondansatörün yardımcı Z1 ucuna uzanan sanal kolu.'],
    ['motor','Z2','g','N','Yardımcı Z2 sanal dönüş bağlantısı.']
   ];
   p.components=parts;
   p.wires=edges.map(([a,ap,b,bp,why],i)=>({
    id:'sc793-cap-motor-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    role:'SIGNAL',color:'#43857f',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
   }));
   p.sc793CapacitorModel='SC793-IDEAL-CAPACITOR-RUN-TOPOLOGY-V1';
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(x=>({id:x.id,label:x.label,
    why:x.id==='motor'?'Ana ve yardımcı sargı terminalleri ayrı gösterilir.':
    x.id==='cap'?'Sanal yardımcı sargı kolunun sürekliliğini denetler; gerçek kondansatör seçimi değildir.':
    'Sadece uygulama içi örnek tek fazlı AC kaynağı.'}));
   l.summary='Tek fazlı motorun ana U/N sargısı ile kondansatörlü yardımcı Z1/Z2 kolu ayrı kablolanmıştır. Sanal model, bu bağlantı tam ise etkinliği gösterir; gerçek faz kayması, tork, akım ve RPM hesaplamaz. Fiziksel/Windows 3D kabulü açık.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Tek fazlı motorda iki ayrı sargı kolunu ayıralım',
    virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,
    steps:['Sanal M1 üzerinde ana U/N ve yardımcı Z1/Z2 uçlarını incele.',
     'C1 kondansatörünün yalnız yardımcı kolun süreklilik şartı olduğunu gör.',
     'Sanal C1 veya Z1 bağlantısını kes: eğitim modelinde motor etkinliği kalkmalıdır.',
     'Faz kayması veya tork ölçülmediği için görünen etkinliği gerçek motor davranışıyla karıştırma.'],
    observations:['20 µF yalnız sanal öğretim örneğidir, donanım kondansatörü seçimi değildir.',
     'Bu model kablo bütünlüğünü sınar; gerçek elektriksel faz açısı çözümü değildir.'],
    repairModel:'SC793-SINGLE-PHASE-CAPACITOR-WIRING-V1'};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue='SINGLE_PHASE_MOTOR_TITLE_HAD_THREE_PHASE_DOL_GRAPH';
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='PHYSICAL_PHASE_SHIFT_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
   v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.sc793BoundedTopologyRepair='SC793-SINGLE-PHASE-CAPACITOR-WIRING-V1';
  }
 }


 // Legacy SC792 label: target motor-direct-power-outline-048 by identity; keep its quiz status.
 (() => {
 const part=(id,typeId,label,x,y,ext={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...ext});
 const edge=(a,ap,b,bp)=>[a,ap,b,bp];
 function repair(sc,id,parts,edges,description,steps,marker){
   const lesson=sc===792?L.byId[id]:L.lessons[sc-1],p=lesson?.project,r=lesson?.pedagogyReview;
   if(lesson?.id!==id||(sc===792?lesson.kind!=='quiz':lesson.kind!=='wiring')||p?.components?.length!==7||
     p?.wires?.length!==13||!p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
   p.components=parts;
   p.wires=edges.map(([a,ap,b,bp],i)=>({
     id:'sc'+sc+'-real-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
     color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
     tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
     tutorialWhy:'Bu hattın gerçek katalog terminalini devrede izleyelim.'
   }));
   if(sc===792)p.referenceOnly=true;else delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:sc===792?'quiz':'demo',step:0};
   lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
     hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   lesson.materials=parts.map(c=>({id:c.id,label:c.label,
     why:c.typeId+' parçasının devredeki giriş, çıkış ve koruma uçlarını bul.'}));
   lesson.summary=description+' Gerçek Windows/3D ve bağımsız pedagojik kabul açık.';
   lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
     heading:sc===792?'Motor etiketindeki değerleri birlikte okuyalım':'Devreyi birlikte kurup deneyelim',
     virtualOnly:true,canonicalGraphUnchanged:false,
     physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
     steps,observations:['Normal ve kopuk kablo durumu gerçek native simülasyon çekirdeğiyle sınandı.',
       'Bu sanal deney, gerçek elektrik panosunda çalışma veya Windows/3D kabulü değildir.'],
     repairModel:marker};
   const review=r||(lesson.pedagogyReview={});
   review.preRepairTitleTopologyIssue=review.titleTopologyIssue||null;
   review.titleTopologyStatus='REVIEW';
   review.titleTopologyIssue=sc===792?'NAMEPLATE_CONCEPT_WINDOWS_3D_AND_PEDAGOGICAL_REVIEW_PENDING':'WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
   review.componentIds=parts.map(c=>c.typeId);
   review.realWiredCircuit=sc!==792;review.nativeDynamicAcceptance=false;
   review.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_WITH_703_CATALOG_PASS';
   review.physicalAcceptance=false;review.windowsVisualAcceptance=false;
   review.independentPedagogicalAcceptance=false;
   review.scActualTopologyRepair=marker;
   if(sc===792)review.actualCurriculumSequence=L.lessons.indexOf(lesson)+1;
 }
 {
   const g=part('g','supply-3p','G1 üç faz + PE',80,230);
   const m=part('motor','motor-y-d','M1 altı uçlu motor',670,230,{
     motorConnection:'external',
     nameplate:{connectionRating:'230 V Δ / 400 V Y',ratedLineVoltageStarV:400,
       ratedWindingVoltageV:230,ratedFrequencyHz:50,ratedPowerKw:0.75,
       ratedRotorRpm:1400,poleCount:4,synchronousRpm:1500,
       slipPercent:(1500-1400)/1500*100,
       note:'Örnek eğitim etiketi; gerçek motor ölçümü değildir.'}
   });
   repair(792,'motor-direct-power-outline-048',[g,m],[
     edge('g','L1','motor','U1'),edge('g','L2','motor','V1'),
     edge('g','L3','motor','W1'),edge('g','PE','motor','PE'),
     edge('motor','U2','motor','V2'),edge('motor','V2','motor','W2')
   ],'Etiketteki 230 V üçgen / 400 V yıldız, 50 Hz, 0,75 kW, 4 kutup ve 1400 dev/dak örneğini inceleyelim. 1500 dev/dak senkron hıza göre örnek kayma yaklaşık %6,67. Sargı uçları U1/V1/W1, yıldız köprüleri U2/V2/W2 dir.',[
     'Etiketteki 230 V Δ / 400 V Y bilgisiyle U1/V1/W1 girişlerini eşleştir.',
     'Yıldız için U2–V2 ve V2–W2 köprülerini bağla.',
     'Üç fazdan L2 kablosunu kes; motor etkinliğinin kalktığını gör.',
     '50 Hz ve dört kutuptan senkron hızı, örnek 1400 dev/dak ile kaymayı hesapla.'
   ],'SC792-REAL-MOTOR-NAMEPLATE-TERMINALS-V1');
 }
 {
  const p=[
   part('g','supply-3p','G1 üç faz güç ve kumanda',40,280),
   part('stop','push-nc','STOP NC',220,70),
   part('start','push-no','START NO',395,70),
   part('f1','fuse','L1 faz sigortası',355,330),
   part('f2','fuse','L2 faz sigortası',355,475),
   part('f3','fuse','L3 faz sigortası',355,620),
   part('over','overload','FR1 üç kutuplu aşırı akım',910,360),
   part('coil','coil-contactor','K1 kontaktör bobini',760,70,{ref:'K1'}),
   part('hold','contact-no','K1 NO mühürleme',540,165,{ref:'K1'}),
   part('main','main-contact','K1 ana güç kontağı',680,430,{ref:'K1'}),
   part('motor','motor-3p','M1 asenkron motor',1200,435,{ref:'M1'})
  ];
  const w=[
   edge('g','L1','stop','21'),edge('stop','22','over','95'),
   edge('over','96','start','13'),edge('start','14','coil','A1'),
   edge('coil','A2','g','N'),edge('over','96','hold','13'),
   edge('hold','14','coil','A1'),
   edge('g','L1','f1','1'),edge('f1','2','main','1'),
   edge('main','2','over','1'),edge('over','2','motor','U'),
   edge('g','L2','f2','1'),edge('f2','2','main','3'),
   edge('main','4','over','3'),edge('over','4','motor','V'),
   edge('g','L3','f3','1'),edge('f3','2','main','5'),
   edge('main','6','over','5'),edge('over','6','motor','W'),
   edge('g','PE','motor','PE')
  ];
  repair(794,'motor-direct-power-outline-050',p,w,
    'Kumanda hattında STOP, START, FR1 NC ve K1 bobini var. Güç hattında üç faz sigortası, K1 ana kontakları, FR1 ve motor bulunur. START mühürler; STOP bırakır; bir faz koparsa motor durur.',[
      'Önce STOP → FR1 95/96 → START → K1 bobinini takip et.',
      'START basıp bırak; K1 mühürleme kontağı sayesinde motor çalışmaya devam etmeli.',
      'STOP a basınca hem bobin hem motor durmalı.',
      'L2 sigortası girişini çıkar: bobin hâlâ çekebilir, üç fazlı motor etkinliği kaybolmalı.'
    ],'SC794-REAL-CONTROL-POWER-PROTECTION-V1');
 }
 {
  const p=[part('g','supply-3p','G1 üç faz kaynak',60,260),
    part('sw','packet-switch-3p','Q1 üç kutuplu pako',460,270),
    part('motor','motor-3p','M1 üç fazlı motor',980,275)];
  repair(796,'motor-direct-power-outline-051',p,[
   edge('g','L1','sw','1'),edge('g','L2','sw','3'),edge('g','L3','sw','5'),
   edge('sw','2','motor','U'),edge('sw','4','motor','V'),edge('sw','6','motor','W'),
   edge('g','PE','motor','PE')
  ],'Q1 pako şalterinin 1–2, 3–4 ve 5–6 kutupları aynı mekanik konumla açılıp kapanır. Kontaktör bobini kullanılmaz.',[
    'Q1 in üç ayrı faz giriş ve çıkış terminalini bul.',
    'Pako açıkken üç faz kesilir, kapalıyken üç faz motora geçer.',
    'Tek bir faz çıkışını ayır; motorun üç fazlı etkinliği kalkmalı.'
  ],'SC796-REAL-THREE-POLE-PACKET-SWITCH-V1');
 }
 {
  const p=[part('g','supply-1p','Sanal L/N kaynak',60,270),
    part('nc','limit-nc','SQ1 21/22 NC sınır anahtarı',345,105),
    part('no','limit-no','SQ1 13/14 NO sınır anahtarı',345,440),
    part('h1','lamp-green','H1 serbest konum',815,135),
    part('h2','lamp-red','H2 limitte uyarı',815,470)];
  repair(797,'motor-direct-power-outline-052',p,[
    edge('g','L','nc','21'),edge('nc','22','h1','X1'),edge('h1','X2','g','N'),
    edge('g','L','no','13'),edge('no','14','h2','X1'),edge('h2','X2','g','N')
  ],'SQ1 sınır anahtarının NO ve NC uçlarını karşılaştıralım. Normalde yeşil yanar, tetiklenince kırmızı yanar. İki kontak aynı sanal tetikleme durumunu temsil eder.',[
    'NC 21/22 ve NO 13/14 terminallerini bul.',
    'İki SQ1 temasını birlikte tetikle: yeşil sönüp kırmızı yanmalı.',
    'NC çıkış kablosunu kopar, yeşil lambanın devreden çıktığını gör.'
  ],'SC797-REAL-LIMIT-NC-NO-SIGNAL-V1');
 }
 {
  const p=[part('g','supply-1p','Sanal L/N kaynak',65,260),
    part('bn','push-no','S1 NO kontrol',340,115),
    part('bc','push-nc','S1 NC kontrol',340,455),
    part('green','lamp-green','H1 çalışma göstergesi',835,130),
    part('red','lamp-red','H2 bekleme göstergesi',835,480)];
  repair(798,'motor-direct-power-outline-053',p,[
   edge('g','L','bn','13'),edge('bn','14','green','X1'),edge('green','X2','g','N'),
   edge('g','L','bc','21'),edge('bc','22','red','X1'),edge('red','X2','g','N')
  ],'NO ve NC üzerinden sinyal lambalarını karşılaştıralım. Bekleme sırasında kırmızı, kontrol etkinleşince yeşil görünür. İki kontak birlikte hareket eden sanal S1 i temsil eder.',[
    'İki lambanın N dönüşünü ve kontrol kontaklarını ayrı izle.',
    'NO/NC temaslarını birlikte tetikle, kırmızıdan yeşile geçişi gözlemle.',
    'H1 girişini kopar ve lambanın yanmadığını doğrula.'
  ],'SC798-REAL-RED-GREEN-SIGNAL-LAMPS-V1');
 }
 {
  const p=[part('g','supply-1p','Sanal L/N kaynak',60,285),
    part('b','push-no','S1 NO buton',305,80),
    part('coil','coil-relay','K1 yardımcı röle bobini',615,100,{ref:'K1'}),
    part('contact','contact-no','K1 bağımsız NO kontak',655,425,{ref:'K1'}),
    part('h','lamp-green','H1 yük göstergesi',1000,440)];
  repair(799,'motor-direct-power-outline-054',p,[
    edge('g','L','b','13'),edge('b','14','coil','A1'),edge('coil','A2','g','N'),
    edge('g','L','contact','13'),edge('contact','14','h','X1'),edge('h','X2','g','N')
  ],'S1 röle bobinini enerjiler, K1 NO kontağı ayrı lamba yükünü açıp kapatır. Bobin ile yük hattının görevi farklıdır.',[
    'K1 bobininin A1/A2 ve kontağın 13/14 uçlarını ayrı izle.',
    'S1 e bas; bobin çekmeli, NO kapanmalı, H1 yanmalı.',
    'Bobin A1 kablosunu çıkar; S1 basılsa da lamba yanmamalı.'
  ],'SC799-REAL-COIL-RELAY-CONTACT-NATIVE-V1');
 }
 {
  const p=[part('g','supply-1p','Sanal L/N kaynak',55,250),
    part('f','fuse','F1 seri sigorta',325,170),
    part('b','push-no','S1 NO açma butonu',545,170),
    part('h','lamp-green','H1 korunan yük',865,200)];
  repair(802,'motor-direct-power-outline-057',p,[
    edge('g','L','f','1'),edge('f','2','b','13'),
    edge('b','14','h','X1'),edge('h','X2','g','N')
  ],'F1 yük hattına seri bağlıdır. Hat tam ve S1 kapalıysa H1 yanar; F1 çıkış kablosu kopuksa yanmaz. Bu sanal deney gerçek sigorta erime karakteristiğini hesaplamaz.',[
    'L → F1 → S1 → H1 → N yolunu takip et.',
    'F1 hattı bağlıyken S1 e bas: H1 yanmalı.',
    'F1 çıkışını ayır; S1 basılı olsa bile H1 sönmeli.'
  ],'SC802-REAL-FUSE-IN-SERIES-LOAD-V1');
 }
 })();


 // SC801/803/804: time relay double-delay correction, overload protection,
 // and real three-pole motor protection breaker. Native targeted PASS.
 (() => {
 const P=(id,typeId,label,x,y,extra={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra});
 const E=(a,ap,b,bp)=>[a,ap,b,bp];
 function replace(sc,id,parts,graph,summary,steps,mark){
   const l=L.lessons[sc-1],p=l?.project,r=l?.pedagogyReview;
   if(l?.id!==id||l.kind!=='wiring'||p?.components?.length!==7||
     p?.wires?.length!==13||!p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
   p.components=parts;
   p.wires=graph.map(([a,ap,b,bp],i)=>({
     id:'sc'+sc+'-real-'+(i+1),
     from:{c:a,p:ap},to:{c:b,p:bp},
     color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
     tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
     tutorialWhy:'Bu elemanın gerçek katalog giriş/çıkış uçlarını takip edelim.'
   }));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
     hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,
     why:c.typeId+' parçasının kendi terminal ve kontrol işlevi bu devrede gösterilir.'}));
   l.summary=summary+' Tam Windows/3D ve bağımsız pedagojik kabul bekliyor.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
     heading:'Gerçek çalışma ile arızalı bağlantıyı karşılaştıralım',
     virtualOnly:true,canonicalGraphUnchanged:false,
     physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
     steps,observations:['Normal ve kopuk/kontrol durumu native Simulation.solve ile doğrulandı.',
       'Bu sanal ders gerçek pano güvenliği, sigorta karakteristiği ya da Windows/3D kabul kanıtı değildir.'],
     repairModel:mark};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyIssue='WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
   v.titleTopologyStatus='REVIEW';v.componentIds=parts.map(c=>c.typeId);
   v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_WITH_703_CATALOG_PASS';
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;v.scActualTopologyRepair=mark;
 }
 {
   const g=P('g','supply-1p','G1 sanal L/N',65,270),
     b=P('b','push-no','S1 zaman rölesi başlat',300,85),
     timer=P('timer','coil-delay-on','KT1 · 2 s ON-delay',630,110,{
       ref:'KT1',delayValue:2,delayUnit:'sec'}),
     contact=P('contact','contact-no','KT1 NO çıkış kontağı',670,405,{ref:'KT1'}),
     h=P('h','lamp-green','H1 gecikmeli yük',1010,435);
   replace(801,'motor-direct-power-outline-056',[g,b,timer,contact,h],[
     E('g','L','b','13'),E('b','14','timer','A1'),E('timer','A2','g','N'),
     E('g','L','contact','13'),E('contact','14','h','X1'),E('h','X2','g','N')
   ],'KT1 bobini iki saniyelik ON-delay üretir. Ayrı KT1 NO kontağı gecikme sonunda H1 lambasını yakar; buton bırakılınca hemen söner. Gecikme hem bobine hem kontağa ikinci kez uygulanmaz.',[
     'S1 butonuna basmadan H1 söner; bobin KT1 A1/A2 uçlarını bul.',
     'S1 e basıp 1 saniye sonra bak: H1 hâlâ sönük olmalı.',
     '2 saniye dolduktan sonra H1 yanmalı; S1 bırakılınca sönmeli.',
     'S1–KT1 A1 hattını kopar; süre dolsa da H1 yanmamalı.'
   ],'SC801-REAL-ON-DELAY-RELAY-NATIVE-V1');
 }
 {
   const p=[P('g','supply-3p','G1 üç faz L1/L2/L3/N/PE',55,265),
     P('start','push-no','START NO',360,75),
     P('stop','push-nc','STOP NC',200,75),
     P('over','overload','FR1 3 faz aşırı akım rölesi',850,355,{ref:'FR1'}),
     P('coil','coil-contactor','K1 bobin',835,90,{ref:'K1'}),
     P('main','main-contact','K1 ana güç kontakları',620,395,{ref:'K1'}),
     P('hold','contact-no','K1 mühürleme',560,165,{ref:'K1'}),
     P('motor','motor-3p','M1 asenkron motor',1130,385,{ref:'M1'})];
   replace(803,'motor-direct-power-outline-058',p,[
     E('g','L1','stop','21'),E('stop','22','over','95'),
     E('over','96','start','13'),E('start','14','coil','A1'),
     E('coil','A2','g','N'),E('over','96','hold','13'),
     E('hold','14','coil','A1'),
     E('g','L1','main','1'),E('main','2','over','1'),E('over','2','motor','U'),
     E('g','L2','main','3'),E('main','4','over','3'),E('over','4','motor','V'),
     E('g','L3','main','5'),E('main','6','over','5'),E('over','6','motor','W'),
     E('g','PE','motor','PE')
   ],'Aşırı akım rölesi FR1 üç fazın güç hattındadır; 95/96 NC koruma kontağı kumanda bobinini keser. START ile mühürleme çalışır, FR1 sanal trip durumunda K1 bırakır ve motor durur.',[
     'FR1 in 1–2/3–4/5–6 güç uçlarını ve 95–96 koruma kontağını bul.',
     'START basıp bırak; K1 mühürlemesi motoru çalıştırmaya devam etmeli.',
     'FR1 i sanal trip durumuna getir; K1 bobini ve motor durmalı.',
     'Bir fazın FR1 girişini kopar; üç fazlı motor etkinliği kaybolmalı.'
   ],'SC803-REAL-OVERLOAD-POWER-AND-95-96-NATIVE-V1');
 }
 {
   const p=[P('g','supply-3p','G1 üç faz kaynak',60,250),
     P('q','thermal-magnetic','Q1 üç kutuplu motor koruma şalteri',515,270,{ref:'Q1'}),
     P('motor','motor-3p','M1 motor',1010,270,{ref:'M1'})];
   replace(804,'motor-direct-power-outline-059',p,[
     E('g','L1','q','1'),E('g','L2','q','3'),E('g','L3','q','5'),
     E('q','2','motor','U'),E('q','4','motor','V'),E('q','6','motor','W'),
     E('g','PE','motor','PE')
   ],'Q1 termik-manyetik motor koruma şalterinin üç ana kutbu bütün fazlarda seri bulunur. Sanal kapalı konumda motor beslenir, şalter açma/trip konumunda üç fazı birden keser. Bu ideal kontak modeli gerçek açma eğrisini çözmez.',[
     'Q1 in 1–2, 3–4 ve 5–6 ana kutuplarını izle.',
     'Sanal Q1 kapalıyken motor üç faz alır.',
     'Q1 i açma/trip konumuna getir; motor durmalı.',
     'Q1 çıkışında tek fazı kopar; üç fazlı motor etkinliğinin kalktığını doğrula.'
   ],'SC804-REAL-THREE-POLE-MOTOR-PROTECTION-V1');
 }
 })();


 // SC805/806: real phase-monitor permit contacts, momentary START and K1 load.
 // No sealing/restart claim; physical safety acceptance remains open.
 (() => {
 const make=(id,typeId,ref,label,x,y)=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:''});
 function apply(sc,id,model,topic,mark){
  const lesson=L.lessons[sc-1],p=lesson?.project,review=lesson?.pedagogyReview;
  if(lesson?.id!==id||lesson.kind!=='wiring'||p?.components?.length!==7||
     p?.wires?.length!==13||!p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     review?.independentPedagogicalAcceptance===true)return;
  const parts=[
    make('g','supply-3p','G1','G1 üç faz / N / PE',55,265),
    make('monitor',model,'PR1',topic+' koruma rölesi',380,220),
    make('start','push-no','S1','S1 anlık START butonu',630,65),
    make('coil','coil-contactor','K1','K1 bobin',935,75),
    make('main','main-contact','K1','K1 üç faz güç kontakları',790,405),
    make('motor','motor-3p','M1','M1 asenkron motor',1200,440)
  ];
  const edges=[
    ['g','L1','monitor','L1'],['g','L2','monitor','L2'],
    ['g','L3','monitor','L3'],['g','N','monitor','N'],
    ['g','L1','monitor','11'],['monitor','14','start','13'],
    ['start','14','coil','A1'],['coil','A2','g','N'],
    ['g','L1','main','1'],['main','2','motor','U'],
    ['g','L2','main','3'],['main','4','motor','V'],
    ['g','L3','main','5'],['main','6','motor','W'],
    ['g','PE','motor','PE']
  ];
  p.components=parts;
  p.wires=edges.map(([a,ap,b,bp],i)=>({id:'sc'+sc+'-phase-'+(i+1),
    from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',
    role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal faz izleme rölesinin gerçek katalog terminali bağlantısı.'
  }));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
  lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  lesson.materials=parts.map(c=>({id:c.id,label:c.label,why:
    c.id==='monitor'?'L1/L2/L3/N izler, yalnız koşullar uygunsa 11–14 izin kontağı kapanır.':
    c.id==='start'?'Anlık basıldığında, izin varsa K1 bobinini sürer; mühürleme yoktur.':
    'Gerçek katalog terminaline bağlı sanal güç/kumanda elemanı.'}));
  lesson.summary='PR1 '+topic+' koşullarını L1/L2/L3/N üzerinde izler. Röle 11–14 izin kontağı faz hatasında açılır ve K1 bobini ile motor durur. S1 anlık olduğu için bıraktığında motor durur; bu bir sanal izleme deneyidir, gerçek güvenlik yeniden başlatma sistemi değildir.';
  lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:topic+' davranışını koruma rölesiyle görelim',
    virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,
    steps:['PR1 L1/L2/L3 ve N terminallerini, 11–14 izin kontağını bul.',
      'S1 e basılı tutunca K1 çekmeli ve motor sanal olarak çalışmalı.',
      'PR1 L3 izleme kablosunu ayır; faz eksik uyarısında K1 ve motor durmalı.',
      'Faz sırası ters olursa PR1 izin vermemeli.',
      'S1 i bırakıp fazları düzelt: motor durmuş kalır, ancak yeni S1 basışıyla çalışır.'],
    observations:['Bu devre mühürlemeli otomatik yeniden başlatma veya fiziksel faz koruma cihazı kabulü değildir.',
      'Gerçek Windows/3D kablo geometrisi ve bağımsız pedagojik kabul bekliyor.'],
    repairModel:mark};
  const r=review||(lesson.pedagogyReview={});
  r.preRepairTitleTopologyIssue=r.titleTopologyIssue||null;
  r.titleTopologyIssue='WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
  r.titleTopologyStatus='REVIEW';r.componentIds=parts.map(c=>c.typeId);
  r.realWiredCircuit=true;r.nativeDynamicAcceptance=false;
  r.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_WITH_703_CATALOG_PASS';
  r.physicalAcceptance=false;r.windowsVisualAcceptance=false;
  r.independentPedagogicalAcceptance=false;r.scActualTopologyRepair=mark;
 }
 apply(805,'motor-direct-power-outline-060','motor-protection-relay',
       'faz kaybı ve faz sırası','SC805-REAL-MOTOR-PHASE-MONITOR-NATIVE-V1');
 apply(806,'motor-direct-power-outline-061','phase-sequence-relay',
       'faz sırası','SC806-REAL-PHASE-SEQUENCE-MONITOR-NATIVE-V1');
 })();


 // SC819/SC822: repaired physical teaching circuits, targeted original
 // Simulation.solve + original 703-component catalogue: 17/17 checks PASS.
 (() => {
  const c=(id,typeId,ref,label,x,y)=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:''});
  const w=(a,ap,b,bp)=>[a,ap,b,bp];
  function put(sc,id,parts,graph,summary,steps,marker){
   const l=L.lessons[sc-1],p=l?.project,r=l?.pedagogyReview;
   if(l?.id!==id||l.kind!=='wiring'||p?.components?.length!==7||
      p?.wires?.length!==13||!p.components.some(x=>x.id==='hold'&&x.typeId==='contact-no')||
      !p.components.some(x=>x.id==='motor'&&x.typeId==='motor-3p')||
      r?.independentPedagogicalAcceptance===true)return;
   p.components=parts;
   p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc'+sc+'-real-control-'+(i+1),
    from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'SIGNAL',
    size:'1.5',points:[],tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal kumanda dersinde katalog terminali ve hat görevi.'}));
   delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(x=>({from:{...x.from},to:{...x.to},hint:x.tutorialHint,
    why:x.tutorialWhy,color:x.color,role:x.role,size:x.size}));
   l.materials=parts.map(x=>({id:x.id,label:x.label,
    why:x.typeId==='push-no'?'Basıldığında kumanda kolunu kapatır.':
     x.typeId==='push-nc'?'Basıldığında kumanda kolunu keser.':
     x.id==='hold'?'Başlatma sonrasında K1 çalışma durumunu korur.':
     'Sanal devrede gerçek katalog terminali üzerinden bağlanır.'}));
   l.summary=summary+' Yalnız sanal eğitim devresi; Windows/3D fiziksel kabulü bekliyor.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:sc===819?'Kesik çalışma: START bırakılınca motor dursun':
     'İki farklı kumanda noktasından motorun kontrolü',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps,observations:[
     'Pozitif ve kopuk giriş negatif sonuçları orijinal Simulation.solve ile sınandı.',
     'Gerçek donanımda bağlantı veya güvenlik kabulü yapılmadı.'],
    repairModel:marker};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
   v.componentIds=parts.map(x=>x.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
   v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_17_CHECKS_PASS';
   v.scMotorControlRepair=marker;
  }
  const j=L.lessons[818],p=j?.project;
  if(j?.id==='motor-direct-power-outline-073'&&p?.wires?.length===13){
   const parts=p.components.filter(x=>x.id!=='hold'),
    graph=p.wires.filter(x=>x.from?.c!=='hold'&&x.to?.c!=='hold')
     .map(x=>w(x.from.c,x.from.p,x.to.c,x.to.p));
   put(819,'motor-direct-power-outline-073',parts,graph,
    'Mühürleme kolu kaldırıldı: START basılıyken K1 ve motor çalışır, bırakılınca durur.',
    ['Sanal START düğmesine basıp motorun çalışmasını gözlemle.',
     'Düğmeyi bırakınca motor durmalıdır.',
     'STOP düğmesi basılıyken START komutunu dene.',
     'START bağlantısı kopukken K1 bobininin enerjilenmediğini gör.'],
    'SC819-MOMENTARY-MOTOR-JOG-NATIVE-V1');
  }
  const parts=[
   c('g1','supply-3p','G1','Sanal üç faz + N + PE',50,315),
   c('stop1','push-nc','S0','1. nokta STOP',245,70),
   c('stop2','push-nc','S2','2. nokta STOP',445,70),
   c('start1','push-no','S1','1. nokta START',685,70),
   c('start2','push-no','S3','2. nokta START',685,280),
   c('hold','contact-no','K1','K1 mühürleme',685,485),
   c('coil','coil-contactor','K1','K1 kontaktör bobini',1010,140),
   c('main','main-contact','K1','K1 ana güç kontakları',1000,415),
   c('motor','motor-3p','M1','Sanal üç faz motor',1300,415)
  ];
  const graph=[
   w('g1','L1','stop1','21'),w('stop1','22','stop2','21'),
   w('stop2','22','start1','13'),w('start1','14','coil','A1'),
   w('stop2','22','start2','13'),w('start2','14','coil','A1'),
   w('stop2','22','hold','13'),w('hold','14','coil','A1'),
   w('coil','A2','g1','N'),
   w('g1','L1','main','1'),w('main','2','motor','U'),
   w('g1','L2','main','3'),w('main','4','motor','V'),
   w('g1','L3','main','5'),w('main','6','motor','W'),
   w('g1','PE','motor','PE')
  ];
  put(822,'motor-direct-power-outline-076',parts,graph,
   'İki STOP seri, iki START paralel; K1 mühürleme yalnız başlatma sonrasında devreyi tutar.',
   ['Birinci START ile motoru çalıştırıp düğmeyi bırak.',
    'İkinci STOP ile motoru durdur.',
    'İkinci START ile yeniden başlatıp birinci STOP ile durdur.',
    'İkinci START kablosunu koparınca o istasyondan başlatma engellenir.'],
   'SC822-DUAL-STATION-MOTOR-CONTROL-NATIVE-V1');
 })();


 // SC821: real selectable momentary/sustained motor control. Native 703-catalog
 // Simulation.solve: ten operating states + disconnected HOLD negative PASS.
 (() => {
  const sc=821,l=L.lessons[sc-1],p=l?.project,r=l?.pedagogyReview;
  if(l?.id==='motor-direct-power-outline-075'&&l.kind==='wiring'&&
     p?.components?.length===7&&p?.wires?.length===13&&
     p.components.some(c=>c.id==='hold'&&c.typeId==='contact-no')&&
     p.components.some(c=>c.id==='motor'&&c.typeId==='motor-3p')&&
     r?.independentPedagogicalAcceptance!==true){
   const c=(id,typeId,ref,label,x,y)=>({
     id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:''});
   const parts=[
    c('g1','supply-3p','G1','Sanal 3 faz + N + PE',50,295),
    c('stop','push-nc','S0','STOP · ortak durdurma',255,65),
    c('start','push-no','S1','START · anlık çalışma',475,65),
    c('mode','selector-no','S2','MODE · açık sürekli / kapalı kesik',525,385),
    c('hold','contact-no','K1','K1 yardımcı tutma kontağı',790,375),
    c('coil','coil-contactor','K1','K1 bobin',1040,130),
    c('main','main-contact','K1','K1 motor güç kontakları',1000,435),
    c('motor','motor-3p','M1','Sanal asenkron motor',1320,435)
   ];
   const graph=[
    ['g1','L1','stop','21'],['stop','22','start','13'],
    ['start','14','coil','A1'],['coil','A2','g1','N'],
    ['stop','22','mode','13'],['mode','14','hold','13'],
    ['hold','14','coil','A1'],
    ['g1','L1','main','1'],['main','2','motor','U'],
    ['g1','L2','main','3'],['main','4','motor','V'],
    ['g1','L3','main','5'],['main','6','motor','W'],
    ['g1','PE','motor','PE']
   ];
   p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
     id:'sc821-mode-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
     color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
     tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
     tutorialWhy:'Sanal kesik/sürekli kumanda devresindeki katalog terminali.'}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
     hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(x=>({id:x.id,label:x.label,why:x.id==='mode'?
     'Açıkken K1 yardımcı kontağının mühürleme kolunu etkinleştirir.':
     x.id==='hold'?'Yalnız MODE seçilmişse START sonrası motoru çalışır tutar.':
     'Sanal motor kumandasının gerçek katalog parçası.'}));
   l.summary='MODE kapalı: START basılıyken kesik çalışma. MODE açık: START sonrasında mühürleme, STOP ile durdurma. Sanal çalışma; Windows/3D kabulü bekliyor.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
     heading:'Aynı motoru kesik ve sürekli modda deneyelim',
     virtualOnly:true,canonicalGraphUnchanged:false,
     physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
     steps:['MODE kapalıyken START basıp bırak; motor durmalıdır.',
       'MODE açıkken START basıp bırak; K1 motoru çalışır tutmalıdır.',
       'MODE kapatılınca veya STOP basılınca motor durur.',
       'MODE–K1 mühürleme kablosunu koparıp sürekli modun çalışmadığını gör.'],
     observations:['Orijinal Simulation.solve ile 10 normal adım + 1 negatif kontrol PASS.',
       'Gerçek pano/Windows/3D fiziksel kabulü bu testin parçası değildir.'],
     repairModel:'SC821-SELECTABLE-JOG-AND-LATCH-NATIVE-V1'};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyIssue='WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
   v.titleTopologyStatus='REVIEW';v.componentIds=parts.map(x=>x.typeId);
   v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_11_CHECKS_PASS';
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.scControlRepair='SC821-SELECTABLE-JOG-AND-LATCH-NATIVE-V1';
  }
 })();


 // Legacy SC823 label: find motor-direct-power-outline-077 by identity; independent
 // lamp switch. Original Simulation.solve/703 catalogue: 5 positive + 2 negative PASS.
 (() => {
  const l=L.byId['motor-direct-power-outline-077'],sc=L.lessons.indexOf(l)+1,p=l?.project,r=l?.pedagogyReview;
  if(l?.id==='motor-direct-power-outline-077'&&l.kind==='wiring'&&
     p?.components?.length===7&&p?.wires?.length===13&&
     p.components.some(c=>c.typeId==='motor-3p')&&
     p.components.some(c=>c.typeId==='main-contact')&&
     r?.independentPedagogicalAcceptance!==true){
   const make=(id,typeId,ref,label,x,y)=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:''});
   const parts=[
    make('g1','supply-3p','G1','Sanal üç faz / N / PE',70,260),
    make('packet','packet-switch-3p','S1','S1 üç kutuplu aç-kapa paket şalter',405,265),
    make('lampSwitch','selector-no','S2','S2 lamba aç-kapa seçici',430,50),
    make('lamp','lamp-green','H1','H1 lamba',760,55),
    make('motor','motor-3p','M1','M1 sanal üç faz motor',1100,290)
   ];
   const graph=[
    ['g1','L1','packet','1'],['g1','L2','packet','3'],
    ['g1','L3','packet','5'],
    ['packet','2','motor','U'],['packet','4','motor','V'],
    ['packet','6','motor','W'],['g1','PE','motor','PE'],
    ['g1','L1','lampSwitch','13'],
    ['lampSwitch','14','lamp','X1'],['lamp','X2','g1','N']
   ];
   p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'sc823-packet-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal motor veya lambanın gerçek katalog terminali.'}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,why:c.id==='packet'?
     'Üç faz motoru birlikte açıp kapatan üç kutuplu paket şalter.':
     c.id==='lampSwitch'?'Motor şalterinden bağımsız lamba seçici anahtar.':
     'Sanal motor ve lamba yükünün katalog terminali.'}));
   l.summary='S1 üç kutuplu paket şalter motorun üç fazını, S2 ayrı seçici ise H1 lambayı açıp kapatır. İki yük bağımsız denenir. Windows/3D kabulü bekliyor.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Paket şalter motoru, seçici anahtar lambayı kontrol etsin',
    virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,
    steps:['S1 kapalı, S2 açıkken sadece motorun çalışmasını gözlemle.',
     'S1 açık, S2 kapalıyken yalnız H1 lambasının yandığını gör.',
     'İki şalter birlikte kapatılınca iki yükün de çalıştığını izle.',
     'Bir motor fazı veya lamba anahtarının çıkış kablosu kopunca ilgili yük devre dışı kalmalı.'],
    observations:['5 normal ve 2 kopuk kablo testi native çözücüde PASS.',
     'Gerçek şebeke bağlantısı, Windows/3D ve fiziksel güvenlik kabulü yapılmadı.'],
    repairModel:'SC823-REAL-PACKET-MOTOR-AND-INDEPENDENT-LAMP-V1'};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyIssue='WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
   v.titleTopologyStatus='REVIEW';v.componentIds=parts.map(c=>c.typeId);
   v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_7_CHECKS_PASS';
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.scPacketRepair='SC823-REAL-PACKET-MOTOR-AND-INDEPENDENT-LAMP-V1';
   v.actualCurriculumSequence=sc;
  }
 })();


 // motor-direct-power-outline-078: simulated direction-select interlock.
 (() => {
  const l=L.byId['motor-direct-power-outline-078'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const a=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',50,360),
   C('stop','push-nc','S0','STOP NC',195,60),
   C('start','push-no','S1','Anlık START',395,60),
   C('dir','selector-2','S2','İleri / geri seçici',600,60,{position:0}),
   C('ncR','contact-nc','K2','K2 NC ileri kilidi',790,65),
   C('ncF','contact-nc','K1','K1 NC geri kilidi',790,310),
   C('holdF','contact-no','K1','K1 ileri mühürleme',490,180),
   C('holdR','contact-no','K2','K2 geri mühürleme',500,400),
   C('coilF','coil-contactor','K1','K1 ileri bobin',1040,65),
   C('coilR','coil-contactor','K2','K2 geri bobin',1040,340),
   C('mainF','main-contact','K1','K1 ileri üç kutuplu güç',1030,565),
   C('mainR','main-contact','K2','K2 geri üç kutuplu güç',1170,750),
   C('motor','motor-3p','M1','M1 sanal motor',1440,620,{motorConnection:'star'})
  ];
  const graph=[
   ['g','L1','stop','21'],
   ['stop','22','start','13'],['start','14','dir','11'],
   ['dir','13','ncR','21'],['ncR','22','coilF','A1'],
   ['dir','14','ncF','21'],['ncF','22','coilR','A1'],
   ['stop','22','holdF','13'],['holdF','14','ncR','21'],
   ['stop','22','holdR','13'],['holdR','14','ncF','21'],
   ['coilF','A2','g','N'],['coilR','A2','g','N'],
   ['g','L1','mainF','1'],['g','L2','mainF','3'],['g','L3','mainF','5'],
   ['mainF','2','motor','U'],['mainF','4','motor','V'],['mainF','6','motor','W'],
   ['g','L1','mainR','1'],['g','L2','mainR','3'],['g','L3','mainR','5'],
   ['mainR','2','motor','W'],['mainR','4','motor','V'],['mainR','6','motor','U'],
   ['g','PE','motor','PE']
  ];
  p.components=a;p.wires=graph.map(([from,pin,to,out],i)=>({
   id:'motor-outline-078-'+(i+1),from:{c:from,p:pin},to:{c:to,p:out},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:from+'/'+pin+' → '+to+'/'+out,
   tutorialWhy:'Sanal kontaktör ve karşılıklı NC kilit devresindeki gerçek katalog ucu.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
    why:c.id==='dir'?'Tek bir yön seçerek karşıt komutları ayırır.':
     c.typeId==='contact-nc'?'Diğer kontaktör çalışırken bu yolu keser.':
     c.typeId==='contact-no'?'Sanal START bırakılınca seçili kontaktörü tutar.':
     'Sanal devrede katalog terminaliyle bağlı parça.'}));
  l.summary='Sanal motorda önce ileri, STOP sonrasında geri hareketi dene. K1 ve K2 NC kontakları elektriksel kilitleme yapar; S2 aynı anda iki yön seçilmesini önler. Fiziksel mekanik kilit ve Windows/3D kabulü bekleniyor.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Motor önce ileri, sonra geri: STOP neden gerekli?',
   virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['S2 ile ileri yönü seçip sanal START komutu ver; motorun yönünü izle.',
    'START bırakıldığında K1 mühürleme kontağı motoru çalışır tutar.',
    'Geri yönünü seçip START dene; K1 NC kilidi K2 yi engeller.',
    'STOP ile motoru durdur; START serbestken kendiliğinden çalışmamalı.',
    'Sanal START ile geri yönü dene, motorun ters dönmesini gözlemle.',
    'Bir fazı veya NC kilit bağlantısını çıkar ve sonucu karşılaştır.'],
   observations:['Orijinal Simulation.solve ve 703 katalog elemanıyla hedefli pozitif-negatif kontroller yapıldı.',
    'Bu bir sanal eğitim modelidir; gerçek şebeke veya güvenlik kabulü değildir.'],
   repairModel:'MOTOR-OUTLINE-078-DIRECTION-SELECTED-INTERLOCK-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyIssue='MECHANICAL_INTERLOCK_WINDOWS_3D_PEDAGOGY_PENDING';
  v.titleTopologyStatus='REVIEW';
  v.componentIds=a.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc840InterlockRepair='MOTOR-OUTLINE-078-DIRECTION-SELECTED-INTERLOCK-V1';
 })();


 // motor-direct-power-outline-079: separate NO/NC jog buttons, virtual interlock.
 (() => {
  const l=L.byId['motor-direct-power-outline-079'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='main-contact')||
    !p.components.some(c=>c.typeId==='motor-3p')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const a=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',50,360),
   C('stop','push-nc','S0','STOP',190,80),
   C('fwd','jog-4pin','S1','İleri NO + NC',370,80),
   C('rev','jog-4pin','S2','Geri NO + NC',375,360),
   C('holdF','contact-no','K1','K1 mühürleme',610,170),
   C('holdR','contact-no','K2','K2 mühürleme',620,455),
   C('coilF','coil-contactor','K1','K1 ileri bobin',905,110),
   C('coilR','coil-contactor','K2','K2 geri bobin',920,365),
   C('mainF','main-contact','K1','K1 ileri güç',1075,560),
   C('mainR','main-contact','K2','K2 geri güç',1120,770),
   C('motor','motor-3p','M1','M1 sanal motor',1450,650,{motorConnection:'star'})
  ];
  const graph=[
   ['g','L1','stop','21'],
   ['stop','22','rev','21'],['rev','22','fwd','13'],
   ['fwd','14','coilF','A1'],['rev','22','holdF','13'],
   ['holdF','14','coilF','A1'],['coilF','A2','g','N'],
   ['stop','22','fwd','21'],['fwd','22','rev','13'],
   ['rev','14','coilR','A1'],['fwd','22','holdR','13'],
   ['holdR','14','coilR','A1'],['coilR','A2','g','N'],
   ['g','L1','mainF','1'],['g','L2','mainF','3'],['g','L3','mainF','5'],
   ['mainF','2','motor','U'],['mainF','4','motor','V'],['mainF','6','motor','W'],
   ['g','L1','mainR','1'],['g','L2','mainR','3'],['g','L3','mainR','5'],
   ['mainR','2','motor','W'],['mainR','4','motor','V'],['mainR','6','motor','U'],
   ['g','PE','motor','PE']
  ];
  p.components=a;
  p.wires=graph.map(([from,pin,to,out],i)=>({
    id:'motor-outline-079-'+(i+1),from:{c:from,p:pin},to:{c:to,p:out},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:from+'/'+pin+' → '+to+'/'+out,
    tutorialWhy:'Yalnız sanal buton kilitleme ve motor kumandası katalog terminali.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
    why:c.typeId==='jog-4pin'?'NO ve NC uçları aynı basma hareketine bağlıdır.':
     c.typeId==='contact-no'?'İlgili sanal kontaktörün mühürleme yoludur.':
     'Sanal devrede katalog terminaliyle bağlanan bileşen.'}));
  l.summary='İki NO/NC butonun karşılıklı kumanda kilidini dene: iki buton birlikte basılıysa sanal motor durur. İleri ve geri için ayrı kontaktörler faz sırasını değiştirir. Sanal modelde anlık ters geçiş olabilir; bu gerçek motor için güvenli duruş, mekanik kilit veya hız kontrolü kabulü değildir.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'İki buton birbirine nasıl kilit olur?',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:['Sanal ileri butonunun NO ve NC uçlarını tanı; karşı butonun NC rolünü izle.',
     'İleri komutu verip bırak. K1 mühürleme ile sanal motorun çalışmasını izle.',
     'STOP ile motoru durdur ve geri yönde ayrı komut ver.',
     'İki butonu aynı anda basılı tut: karşı NC uçları iki bobini de kapatmalı.',
     'Bir karşı NC bağlantısını kopar ve ilgili yönde başlatmanın neden engellendiğini gözlemle.'],
    observations:['Özgün Simulation.solve ve 703 katalog elemanıyla hedefli pozitif-negatif sanal test yapıldı.',
     'Gerçekte anlık yön değişimi uygulanmaz: motor duruşu, uygun mekanik/elektriksel kilit ve donanım güvenlik değerlendirmesi ayrıca gereklidir.'],
    repairModel:'MOTOR-OUTLINE-079-PUSHBUTTON-INTERLOCK-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyIssue='MECHANICAL_STOPPED_MOTOR_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  v.titleTopologyStatus='REVIEW';v.componentIds=a.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc841PushbuttonRepair='MOTOR-OUTLINE-079-PUSHBUTTON-INTERLOCK-V1';
 })();


 // motor-direct-power-outline-080: reversible three-pole packet switch,
 // virtual-only training circuit. Electrical switch position is exclusive.
 (() => {
  const l=L.byId['motor-direct-power-outline-080'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='main-contact')||
     !p.components.some(c=>c.typeId==='motor-3p')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',70,230),
   C('sw','packet-reversing-3p','S1','İleri / 0 / Geri üç kutuplu paket şalter',465,220,{position:0}),
   C('motor','motor-3p','M1','M1 sanal üç faz motor',1010,220,{motorConnection:'star'})
  ];
  const graph=[
   ['g','L1','sw','L1'],['g','L2','sw','L2'],['g','L3','sw','L3'],
   ['sw','U','motor','U'],['sw','V','motor','V'],['sw','W','motor','W'],
   ['g','PE','motor','PE']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'motor-outline-080-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:'Sanal devre: '+a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Katalogdaki üç konumlu paket şalterin sanal güç yolu.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='sw'?'İleri, 0 ve geri konumlarını birlikte değiştirir.':
    c.id==='motor'?'Sanal üç fazlı motorun dönüş yönünü izle.':
    'Yalnız simülasyon için hazırlanmış sanal kaynak.'}));
  l.summary='S1 paket şalterin üç konumunu incele: 0 konumunda motor durur, ileri ve geri konumları sanal faz sırasını değiştirerek ters dönme sağlar. Bu devre fiziksel şebeke bağlantı talimatı değildir; PE, güvenli duruş ve mekanik geçişler donanım açısından doğrulanmadı.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Paket şalterin üç konumu motorun yönünü nasıl değiştirir?',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
     'Önce S1 konumunu 0 seç; motorun sanal olarak durduğunu gözlemle.',
     'İleri konumunda simülatörün pozitif dönme işaretini incele.',
     'Yeniden 0 konumuna dön, ardından geri konumunun ters dönme işaretini karşılaştır.',
     'Sanal bir faz yolunu çıkar; üç faz koşulu bozulunca motor çalışmamalı.',
     'Eksik PE veya yanlış geçiş zamanlaması bu yazılımda fiziksel güvenlik doğrulaması sağlamaz.'
    ],
    observations:[
     'Özgün 703 bileşenli katalog ve Simulation.solve ile 0, ileri, geri, faz kopuğu ve motor uç kopuğu sınandı.',
     'Sanal model PE kopuğunda mekanik motor etkinliğini hâlâ gösterebilir; bu fiziksel güvenliğe dair kanıt DEĞİLDİR.',
     'Gerçek donanım seçimi, geçiş/duruş süresi ve Windows/3D kabulü bekliyor.'
    ],
    repairModel:'MOTOR-OUTLINE-080-3P-REVERSING-PACKET-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='PACKET_MECHANICAL_TRANSITION_PE_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_POSITION_AND_OPEN_WIRE_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc842ReversingPacketRepair='MOTOR-OUTLINE-080-3P-REVERSING-PACKET-V1';
 })();


 // motor-direct-power-outline-081: ON-delay timer-controlled virtual motor stop.
 (() => {
  const l=L.byId['motor-direct-power-outline-081'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='main-contact')||
     !p.components.some(c=>c.typeId==='motor-3p')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
   C('g','supply-3p','G1','Sanal üç faz ve N / PE',55,350),
   C('stop','push-nc','S0','STOP NC',220,80),
   C('start','push-no','S1','START NO',460,80),
   C('tNC','contact-nc','KT1','KT1 gecikme sonunda açılan NC',400,250),
   C('kHold','contact-no','K1','K1 mühürleme NO',665,205),
   C('kFeed','contact-no','K1','K1 zaman başlatma NO',645,460),
   C('kCoil','coil-contactor','K1','K1 motor kontaktör bobini',985,80),
   C('tCoil','coil-delay-on','KT1','KT1 düz zaman rölesi / 2 saniye',960,360,
     {delayValue:2,delayUnit:'sec'}),
   C('main','main-contact','K1','K1 üç kutuplu güç',925,650),
   C('motor','motor-3p','M1','M1 sanal üç faz motor',1330,630,{motorConnection:'star'})
  ];
  const graph=[
   ['g','L1','stop','21'],['stop','22','tNC','21'],
   ['tNC','22','start','13'],['start','14','kCoil','A1'],
   ['tNC','22','kHold','13'],['kHold','14','kCoil','A1'],
   ['kCoil','A2','g','N'],
   ['stop','22','kFeed','13'],['kFeed','14','tCoil','A1'],
   ['tCoil','A2','g','N'],
   ['g','L1','main','1'],['g','L2','main','3'],['g','L3','main','5'],
   ['main','2','motor','U'],['main','4','motor','V'],['main','6','motor','W'],
   ['g','PE','motor','PE']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'motor-outline-081-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'K1 mühürleme ve KT1 gecikmeli bırakma için katalog terminali.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='tCoil'?'Sanal iki saniyelik ON-delay sürecini sayar.':
    c.id==='tNC'?'Süre sonunda kumanda kolunu açar.':
    c.id==='kHold'?'START bırakılınca motor kontaktörünü tutar.':
    'Sanal devrede terminali bulunan öğretici eleman.'}));
  l.summary='START ile motorun sanal çalışması başlar. K1 yardımcı kontağı mühürlerken KT1 düz zaman rölesi 2 saniye sayar. Süre dolunca KT1 NC açılır ve motor durur. Duruş sonrası START basılmadıkça kendiliğinden başlamaz; fiziksel motor durma süresi modellenmez.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Motor çalışsın, iki saniye sonra kendi kendine dursun',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
     'Sanal START komutu verip hemen bırak; K1 mühürleme etkisini gözlemle.',
     'Bir saniyeden sonra motor hâlâ çalışmalı; KT1 süreyi sayar.',
     'İki saniye dolunca KT1 kontağı açılır ve motorun sanal etkinliği sona erer.',
     'STOP komutunun süre tamamlanmadan da motoru durdurduğunu kontrol et.',
     'Bir kumanda hattını kopar; motor hiç çalışmazsa nedenini düşün.'
    ],
    observations:[
     '703 katalog elemanı ve özgün Simulation.solve ile zaman, STOP ve kopuk kablo kontrolleri yapıldı.',
     'Timer kumanda kablosu eksilirse zamanlı durma devre dışı kalabilir: model bir fiziksel güvenlik rölesi değildir.',
     'Gerçek motorun mekanik duruşu ve Windows/3D kabulü bekliyor.'
    ],repairModel:'MOTOR-OUTLINE-081-ON-DELAY-TIMED-STOP-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyIssue='PHYSICAL_TIMER_MOTOR_STOP_AND_WINDOWS_3D_REVIEW_PENDING';
  v.titleTopologyStatus='REVIEW';v.componentIds=parts.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TIMED_POSITIVE_NEGATIVE_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc843TimerStopRepair='MOTOR-OUTLINE-081-ON-DELAY-TIMED-STOP-V1';
 })();


 // motor-direct-power-outline-082: virtual OFF-delay motor lesson, not safety-rated.
 (() => {
  const l=L.byId['motor-direct-power-outline-082'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',65,325),
   C('run','selector-no','S1','Sanal RUN komutu',260,75),
   C('stop','push-nc','S0','Sanal test durdurma kontağı',435,340),
   C('timer','coil-delay-off','KT1','KT1 OFF-delay 2 saniye',630,80,
    {delayValue:2,delayUnit:'sec'}),
   C('tNo','contact-no','KT1','KT1 gecikmeli bırakan NO',755,340),
   C('coil','coil-contactor','K1','K1 motor kontaktör bobini',1035,340),
   C('main','main-contact','K1','K1 ana güç kontakları',980,600),
   C('motor','motor-3p','M1','M1 sanal motor',1365,605,{motorConnection:'star'})
  ];
  const graph=[
   ['g','L1','run','13'],['run','14','timer','A1'],['timer','A2','g','N'],
   ['g','L1','stop','21'],['stop','22','tNo','13'],
   ['tNo','14','coil','A1'],['coil','A2','g','N'],
   ['g','L1','main','1'],['g','L2','main','3'],['g','L3','main','5'],
   ['main','2','motor','U'],['main','4','motor','V'],['main','6','motor','W'],
   ['g','PE','motor','PE']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
   id:'motor-outline-082-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'KT1 OFF-delay davranışını gösteren katalog terminali.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
   why:c.id==='timer'?'RUN bırakılınca iki saniyelik sanal gecikme sağlar.':
   c.id==='tNo'?'K1 bobinini gecikme boyunca etkin tutabilir.':
   c.id==='stop'?'Sanal kumanda hattı kesme deneyi; emniyet kontağı değildir.':
   'Sanal devrede yer alan katalog bileşeni.'}));
  l.summary='Ters zaman rölesi örneğinde RUN komutu kesilince motorun sanal etkinliği iki saniye daha sürer, sonra biter. Ayrı sanal STOP kolu kontaktörü hemen bırakır fakat gerçek güvenlik kontağı değildir; RUN açıkken bırakılması yeniden çalıştırabilir. Fiziksel duruş, Windows/3D ve bağımsız kabul bekliyor.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Komut kapanınca neden iki saniye bekleniyor?',
   virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['Sanal RUN konumunu aç ve motor etkinliğini izle.',
    'RUN kapatılınca motor hemen durmamalı; süre sayımı başlar.',
    'Bir saniye sonra hâlâ etkin; iki saniye sonra durmuş olmalı.',
    'Sanal STOP test kontağını açarak K1 bobinini hemen bırak.',
    'Bir fazı veya zaman rölesi çıkış yolunu kopar; etkinlik sonucunu karşılaştır.'],
   observations:['Özgün 703 bileşenli katalog ve Simulation.solve ile gecikme ve kopuk kablolar sınandı.',
    'STOP test kontağı gerçek acil durdurma DEĞİLDİR; RUN açıkken bırakılması yeniden başlatabilir.',
    'Mekanik duruş, gerçek koruma ve Windows/3D kabulü ayrıca bekler.'],
   repairModel:'MOTOR-OUTLINE-082-OFF-DELAY-TIMED-STOP-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='OFF_DELAY_RESTART_PHYSICAL_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TIMED_POSITIVE_NEGATIVE_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc844OffDelayRepair='MOTOR-OUTLINE-082-OFF-DELAY-TIMED-STOP-V1';
 })();


 // motor-direct-power-outline-083: virtual NC end stops and mutually interlocked
 // forward/reverse; not an automatic reversing or physical safety controller.
 (() => {
  const l=L.byId['motor-direct-power-outline-083'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const a=[
    C('g','supply-3p','G1','Sanal üç faz / N / PE',50,410),
    C('stop','push-nc','S0','STOP',200,60),
    C('start','push-no','S1','Anlık START',420,60),
    C('dir','selector-2','S2','İleri / geri yön seçici',615,60,{position:0}),
    C('limitF','limit-nc','SQ1','İleri son konum NC',725,185),
    C('limitR','limit-nc','SQ2','Geri son konum NC',725,395),
    C('ncR','contact-nc','K2','K2 NC ileri kilidi',905,160),
    C('ncF','contact-nc','K1','K1 NC geri kilidi',905,385),
    C('holdF','contact-no','K1','K1 ileri mühürleme',435,260),
    C('holdR','contact-no','K2','K2 geri mühürleme',445,510),
    C('coilF','coil-contactor','K1','K1 ileri bobin',1145,155),
    C('coilR','coil-contactor','K2','K2 geri bobin',1145,395),
    C('mainF','main-contact','K1','K1 ileri güç',1050,660),
    C('mainR','main-contact','K2','K2 geri güç',1190,830),
    C('motor','motor-3p','M1','Sanal üç faz motor',1500,710,{motorConnection:'star'})
  ];
  const graph=[
    ['g','L1','stop','21'],['stop','22','start','13'],
    ['start','14','dir','11'],
    ['dir','13','limitF','21'],['limitF','22','ncR','21'],['ncR','22','coilF','A1'],
    ['dir','14','limitR','21'],['limitR','22','ncF','21'],['ncF','22','coilR','A1'],
    ['stop','22','holdF','13'],['holdF','14','limitF','21'],
    ['stop','22','holdR','13'],['holdR','14','limitR','21'],
    ['coilF','A2','g','N'],['coilR','A2','g','N'],
    ['g','L1','mainF','1'],['g','L2','mainF','3'],['g','L3','mainF','5'],
    ['mainF','2','motor','U'],['mainF','4','motor','V'],['mainF','6','motor','W'],
    ['g','L1','mainR','1'],['g','L2','mainR','3'],['g','L3','mainR','5'],
    ['mainR','2','motor','W'],['mainR','4','motor','V'],['mainR','6','motor','U'],
    ['g','PE','motor','PE']
  ];
  p.components=a;
  p.wires=graph.map(([x,xp,y,yp],i)=>({
    id:'motor-outline-083-'+(i+1),from:{c:x,p:xp},to:{c:y,p:yp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:x+'/'+xp+' → '+y+'/'+yp,
    tutorialWhy:'Sanal yön seçimi, NC sınır anahtarı ve kontaktör kilidi.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
    why:c.typeId==='limit-nc'?'Uç konuma gelince seçili yönün sanal bobin yolunu keser.':
      c.id==='dir'?'Sanal deneyde aynı anda tek yön seçilebilir.':
      c.typeId==='contact-nc'?'Karşı kontaktör çalışıyorsa bobini engeller.':
      c.typeId==='contact-no'?'START bırakıldıktan sonra seçili yönü tutar.':
      'Sanal eğitim devresinin katalog terminali.'}));
  l.summary='Sanal taşıyıcıyı iki uç arasında gezdirelim. İleride SQ1 sınırına gelince motor durur; S2 ile geri yönü seçip yeniden START vermeden dönmez. SQ2 diğer uçta aynı işi yapar. Bu otomatik tersleme veya gerçek bir makine güvenlik devresi değildir.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Uç konum anahtarı motoru neden durdurur?',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal S2 ile ileri yönü seçip START ver; motorun çalışmasını izle.',
      'START bırakılınca K1 mühürlemenin nasıl çalıştığını gözlemle.',
      'SQ1 ileri sınırı etkinleşince sanal motor durmalı ve tekrar başlamamalı.',
      'S2 ile geri yönü seçip yeni START ver; motor ters yönde çalışmalı.',
      'SQ2 geri sınırı ve STOP ile duruşu, sonra eksik fazı karşılaştır.'
    ],
    observations:[
      'İki özgün katalog limit-nc anahtarı, karşılıklı K1/K2 NC ve 703 katalog elemanlı Simulation.solve ile hedefli kontrol yapıldı.',
      'Otomatik ileri/geri çevrim, gerçek hareket sensörü, mekanik duruş ve fiziksel emniyet doğrulanmadı.',
      'Windows/3D kablo ve terminal hizası ile bağımsız kabul REVIEW kalıyor.'
    ],
    repairModel:'MOTOR-OUTLINE-083-NC-END-LIMIT-RESTART-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='AUTOMATIC_LIMIT_REVERSE_MECHANICAL_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=a.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc845EndLimitRepair='MOTOR-OUTLINE-083-NC-END-LIMIT-RESTART-V1';
 })();


 // motor-direct-power-outline-084: one momentary button, isolated trigger
 // contacts, impulse relay, and an undervoltage-release rearm relay.
 (() => {
  const l=L.byId['motor-direct-power-outline-084'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
    C('g','supply-3p','G1','Sanal üç faz / N / PE',60,370),
    C('button','push-no','S1','Tek anlık START / STOP butonu',265,70),
    C('trig','coil-relay','KB','KB buton kumanda rölesi',505,70),
    C('pulseDrive','contact-no','KB','KB darbe yolunu yalıtma',515,245),
    C('armDrive','contact-no','KB','KB çalıştırma izni yolu',510,450),
    C('pulse','coil-pulse','KP1','KP1 darbeli sanal röle',795,105),
    C('pulseContact','contact-no','KP1','KP1 NO çalışma hafızası',1020,265),
    C('arm','coil-contactor','K0','K0 enerji dönüşü izin rölesi',795,450),
    C('armHold','contact-no','K0','K0 izin mühürleme',595,610),
    C('armGate','contact-no','K0','K0 yeniden başlama önleme',1010,465),
    C('coil','coil-contactor','K1','K1 motor kontaktörü',1300,260),
    C('main','main-contact','K1','K1 güç kontakları',1230,615),
    C('motor','motor-3p','M1','Sanal üç faz motor',1570,640,{motorConnection:'star'})
  ];
  const graph=[
    ['g','L1','button','13'],['button','14','trig','A1'],['trig','A2','g','N'],
    ['g','L1','pulseDrive','13'],['pulseDrive','14','pulse','A1'],['pulse','A2','g','N'],
    ['g','L1','armDrive','13'],['armDrive','14','arm','A1'],
    ['g','L1','armHold','13'],['armHold','14','arm','A1'],['arm','A2','g','N'],
    ['g','L1','armGate','13'],['armGate','14','pulseContact','13'],
    ['pulseContact','14','coil','A1'],['coil','A2','g','N'],
    ['g','L1','main','1'],['g','L2','main','3'],['g','L3','main','5'],
    ['main','2','motor','U'],['main','4','motor','V'],['main','6','motor','W'],
    ['g','PE','motor','PE']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'motor-outline-084-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Tek sanal buton, birbirinden yalıtılmış röle kontakları ve enerji dönüşü izin yolu.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='button'?'Sanal devreye tek komut gönderen anlık buton.':
     c.id==='trig'?'Butondan gelen komutu iki ayrı, yalıtılmış kontağa dağıtır.':
     c.id==='pulse'?'Ardışık darbelerde sanal açma ve kapama durumunu değiştirir.':
     c.id==='arm'?'Enerji kesilince bırakıp yeni basış gelmeden motor iznini kapalı tutar.':
     c.id==='motor'?'Gerçek motor değil, sanal üç fazlı yük.':
     'Özgün katalog terminaliyle bağlanmış öğretici eleman.'}));
  l.summary='Bir düğme iki işi yapsın: ilk basışta sanal motor çalışsın, ikinci basışta dursun. KB komutu ayrı röle kontaklarıyla dağıtır; KP1 aç/kapa durumunu hatırlar. Güç kesilince K0 bırakır ve enerji geri geldiğinde motor kendiliğinden başlamaz; yeniden basış gerekir. Fiziksel güvenlik kabulü yapılmadı.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Tek düğmeyle başlat, yine aynı düğmeyle durdur',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal S1 butonuna bir kez bas ve bırak: KP1 ve K0 sayesinde motor çalışmayı sürdürür.',
      'Aynı butona ikinci basışta motor durur; üçüncü basışta yeniden çalışır.',
      'Sanal beslemeyi kesip geri getir. K0 izni düşmüşken motor kendiliğinden başlamamalı.',
      'Güç dönüşünden sonra yeni buton komutlarıyla güvenli yeniden çalıştırma sırasını incele.',
      'Bir fazı veya yalıtılmış kumanda bağlantısını açarak sanal davranışı karşılaştır.'
    ],
    observations:[
      'Özgün 703 katalog elemanı ve Simulation.solve ile ardışık darbeler, kaynak kesilmesi/dönüşü ve negatif bağlantılar sınandı.',
      'Gerçek panoda acil duruş, koruma koordinasyonu, kontak yapışması ve bağımsız güvenlik kabulü modellenmedi.',
      'Windows/3D ve bağımsız pedagojik kabul bekliyor.'
    ],
    repairModel:'MOTOR-OUTLINE-084-SINGLE-PUSH-REARM-ISOLATED-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_POWER_FAILURE_HARDWARE_SAFETY_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_PULSE_REARM_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc846SinglePushRepair='MOTOR-OUTLINE-084-SINGLE-PUSH-REARM-ISOLATED-V1';
 })();


 // motor-direct-power-outline-085: bounded phase-monitor motor demonstration.
 // It is intentionally hold-to-run; continuous seal-in is not claimed.
 (() => {
  const l=L.byId['motor-direct-power-outline-085'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const a=[
    C('g','supply-3p','G1','Sanal üç faz / N / PE',55,310),
    C('monitor','motor-protection-relay','PR1','PR1 faz kaybı ve faz sırası izlemesi',375,205),
    C('start','push-no','S1','S1 basılı tutma START',630,70),
    C('coil','coil-contactor','K1','K1 motor kontaktörü',965,95),
    C('main','main-contact','K1','K1 güç kontakları',815,420),
    C('motor','motor-3p','M1','Sanal üç faz motor',1240,420,{motorConnection:'star'})
  ];
  const graph=[
    ['g','L1','monitor','L1'],['g','L2','monitor','L2'],
    ['g','L3','monitor','L3'],['g','N','monitor','N'],
    ['g','L1','monitor','11'],['monitor','14','start','13'],
    ['start','14','coil','A1'],['coil','A2','g','N'],
    ['g','L1','main','1'],['main','2','motor','U'],
    ['g','L2','main','3'],['main','4','motor','V'],
    ['g','L3','main','5'],['main','6','motor','W'],
    ['g','PE','motor','PE']
  ];
  p.components=a;
  p.wires=graph.map(([x,xp,y,yp],i)=>({
    id:'motor-outline-085-'+(i+1),from:{c:x,p:xp},to:{c:y,p:yp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:x+'/'+xp+' → '+y+'/'+yp,
    tutorialWhy:'Katalog PR1 L1/L2/L3/N ve 11/14 izin kontağına dayalı sanal deney.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
    why:c.id==='monitor'?'Sanal faz eksikliği veya yanlış sıra varsa izin kontağını açar.':
     c.id==='start'?'Yalnız basılı tutulduğunda motoru çalıştırır; mühürleme yoktur.':
     c.id==='coil'?'PR1 izin verirse K1 ana güç kontaklarını sürer.':
     'Sanal motor deneyinde özgün katalog terminali.'}));
  l.summary='Sanal PR1 üç fazı ve nötrü izler. Hatlar uygunsa S1 e basılı tuttuğunda kontaktör motoru çalıştırır. Bir faz veya nötr kaybolduğunda PR1 izin kontağı açılır ve motor durur. Bu basılı tutma deneyidir; mühürlemeli sürekli çalıştırma veya gerçek güvenlik sistemi değildir.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Koruma rölesi faz kaybolunca motoru neden durdurur?',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal PR1 faz ve nötr girişlerini, ayrıca 11–14 izin kontağını incele.',
      'Sanal S1 butonunu basılı tutarken motorun çalıştığını gözlemle.',
      'PR1 in bir faz veya nötr izleme yolunu ayır: sanal motor durmalı.',
      'PR1 e gelen fazların yerini değiştirerek ters sıra uyarısını karşılaştır.',
      'S1 bırakılmışken sanal kaynağı düzelt; motor yalnız yeni basışta çalışır.'
    ],
    observations:[
      'Özgün 703 katalog elemanı ve Simulation.solve ile basılı tutma, faz kaybı, ters sıra, nötr ve bağlantı kopukluğu sınandı.',
      'Mühürlemeli kalıcı çalışma, üretici toleransları, donanım yeniden başlatma güvenliği ve fiziksel koruma kabulü eksik.',
      'Windows/3D terminal uyumu ve bağımsız pedagojik kabul REVIEW durumunda.'
    ],
    repairModel:'MOTOR-OUTLINE-085-PHASE-MONITOR-HOLD-TO-RUN-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='CONTINUOUS_SEAL_IN_PROTECTION_REAL_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=a.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_HOLD_TO_RUN_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc847PhaseMonitorRepair='MOTOR-OUTLINE-085-PHASE-MONITOR-HOLD-TO-RUN-V1';
 })();


 // SC848: real catalog KA1/KA2 right-left virtual interlock and K1/K2 motor contactors.
 (() => {
  const l=L.byId['motor-direct-power-outline-086'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
  const rawParts=[["g","supply-3p","G1","Sanal üç faz / N / PE",50,400],["stop","push-nc","S0","STOP",240,90],["start","push-no","S1","START",420,90],["dir","selector-2","S2","Sağ / 0 / Sol seçici",595,90,{"position":0}],["rf","coil-relay","KA1","KA1 sağ yön rölesi",1060,80],["rr","coil-relay","KA2","KA2 sol yön rölesi",1060,325],["holdF","contact-no","KA1","KA1 mühürleme NO",520,235],["holdR","contact-no","KA2","KA2 mühürleme NO",520,455],["lockR","contact-nc","KA2","KA2 NC sağ kilit",810,90],["lockF","contact-nc","KA1","KA1 NC sol kilit",810,325],["enableF","contact-no","KA1","KA1 sağ çıkış NO",1100,525],["enableR","contact-no","KA2","KA2 sol çıkış NO",1100,760],["klockR","contact-nc","K2","K2 NC kontaktör kilidi",1250,530],["klockF","contact-nc","K1","K1 NC kontaktör kilidi",1250,770],["kf","coil-contactor","K1","K1 sağ motor kontaktör bobini",1440,530],["kr","coil-contactor","K2","K2 sol motor kontaktör bobini",1440,770],["mf","main-contact","K1","K1 sağ güç kontakları",1020,1030],["mr","main-contact","K2","K2 sol güç kontakları",1210,1180],["motor","motor-3p","M1","M1 sanal üç faz motor",1600,1060,{"motorConnection":"star"}]];
  const graph=[["g","L1","stop","21"],["stop","22","start","13"],["start","14","dir","11"],["dir","13","lockR","21"],["lockR","22","rf","A1"],["dir","14","lockF","21"],["lockF","22","rr","A1"],["stop","22","holdF","13"],["holdF","14","lockR","21"],["stop","22","holdR","13"],["holdR","14","lockF","21"],["rf","A2","g","N"],["rr","A2","g","N"],["g","L1","enableF","13"],["enableF","14","klockR","21"],["klockR","22","kf","A1"],["kf","A2","g","N"],["g","L1","enableR","13"],["enableR","14","klockF","21"],["klockF","22","kr","A1"],["kr","A2","g","N"],["g","L1","mf","1"],["g","L2","mf","3"],["g","L3","mf","5"],["mf","2","motor","U"],["mf","4","motor","V"],["mf","6","motor","W"],["g","L1","mr","1"],["g","L2","mr","3"],["g","L3","mr","5"],["mr","2","motor","W"],["mr","4","motor","V"],["mr","6","motor","U"],["g","PE","motor","PE"]];
  const a=rawParts.map(([id,typeId,ref,label,x,y,ext])=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...(ext||{})}));
  p.components=a;
  p.wires=graph.map(([x,xp,y,yp],i)=>({
    id:'motor-outline-086-'+(i+1),from:{c:x,p:xp},to:{c:y,p:yp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:x+'/'+xp+' → '+y+'/'+yp,
    tutorialWhy:'Sanal KA1/KA2 yön rölesi ve K1/K2 kontaktörün katalog terminali.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
    why:['rf','rr'].includes(c.id)?'Yön komutunu kontaklarla ileten sanal yardımcı röle.':
      c.typeId==='contact-nc'?'Diğer yönün aynı anda çalışmasını önleyen NC kilit.':
      c.typeId==='contact-no'?'Kumanda ve mühürleme yolunun NO kontağı.':
      'Sanal eğitime ait katalog terminali.'}));
  l.summary='Sağ ve sol yönü iki yardımcı röleyle kontrol edelim. KA1 sağ, KA2 sol komutunu motor kontaktörüne aktarır. START bırakılınca röle mühürlemesi sürer; karşıt yön komutu NC kilidine takılır. Önce STOP, sonra yeni START gerekir. Bu sanal deneyde gerçek motorun durma süresi ve mekanik güvenlik doğrulanmaz.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'İki yardımcı röleyle yön değiştirmeyi öğrenelim',
    virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal seçiciyle sağ yönü seç. START ile KA1 ve K1 etkinliğini izle.',
      'START bırakılınca KA1 mühürleme kontağının neden gerekli olduğunu keşfet.',
      'Sol yönü seçerek yeni START dene; NC kilidi çalışan yönü değiştirmemeli.',
      'STOP komutunu ver. Yeni START olmadan motor kendiliğinden başlamamalı.',
      'Şimdi sol yönü başlat ve dönüş işaretinin tersine döndüğünü gör.',
      'Sanal röle komut hattını veya bir fazı kopar. Beklenen çalışmanın neden kaybolduğunu düşün.'
    ],
    observations:[
      'Özgün 703 bileşenli katalog ve Simulation.solve ile 21 hedefli pozitif-negatif senaryo PASS.',
      'Yalnız sanal eğitim modelidir; gerçek donanımda mekanik kilit, güvenli duruş ve üretici onayı yerine geçmez.',
      'Windows/3D terminal-kablo uyumu ve bağımsız pedagojik kabul REVIEW durumundadır.'
    ],repairModel:'MOTOR-OUTLINE-086-RIGHT-LEFT-RELAYS-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='MECHANICAL_MOTOR_STOP_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=a.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_21_CHECKS_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc848RightLeftRelayRepair='MOTOR-OUTLINE-086-RIGHT-LEFT-RELAYS-V1';
 })();


 // SC854 motor-direct-power-outline-089: two independent ON-delay motor directions.
 // The fully cloned, pinned SC848 relay model is the validated source template.
 (() => {
  const l=L.byId['motor-direct-power-outline-089'],p=l?.project,r=l?.pedagogyReview;
  const reference=L.byId['motor-direct-power-outline-086'];
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true||
     reference?.practiceGuide?.repairModel!=='MOTOR-OUTLINE-086-RIGHT-LEFT-RELAYS-V1')return;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const components=clone(reference.project.components);
  const timed=[
    ['timerF','coil-delay-on','KT1','KT1 sanal sağ yönde 2 s gecikme',1100,240],
    ['timerR','coil-delay-on','KT2','KT2 sanal sol yönde 2 s gecikme',1140,465],
    ['timedF','contact-no','KT1','KT1 gecikmeli sağ NO',1300,240],
    ['timedR','contact-no','KT2','KT2 gecikmeli sol NO',1300,470]
  ];
  components.push(...timed.map(([id,typeId,ref,label,x,y])=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',
    ...(typeId==='coil-delay-on'?{delayValue:2,delayUnit:'sec'}:{})})));
  const graph=reference.project.wires.filter(w=>!(
     (w.from.c==='enableF'&&w.to.c==='klockR')||
     (w.from.c==='enableR'&&w.to.c==='klockF')))
    .map(w=>[w.from.c,w.from.p,w.to.c,w.to.p]);
  graph.push(
    ['enableF','14','timerF','A1'],['timerF','A2','g','N'],
    ['g','L1','timedF','13'],['timedF','14','klockR','21'],
    ['enableR','14','timerR','A1'],['timerR','A2','g','N'],
    ['g','L1','timedR','13'],['timedR','14','klockF','21']);
  p.components=components;
  p.wires=graph.map(([x,xp,y,yp],i)=>({
    id:'motor-outline-089-'+(i+1),from:{c:x,p:xp},to:{c:y,p:yp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:x+'/'+xp+' → '+y+'/'+yp,
    tutorialWhy:'Sanal sağ-sol rölesi ve KT1/KT2 zamanlı kumanda yolu.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=components.map(c=>({id:c.id,label:c.label,
    why:c.typeId==='coil-delay-on'?'Seçilen yönde iki saniyelik sanal gecikmeyi sayar.':
      ['timedF','timedR'].includes(c.id)?'Gecikme tamamlanmadan ilgili motor kontaktörüne izin vermez.':
      c.typeId==='contact-nc'?'Karşıt yön çalışırken bu sanal kumanda kolunu kilitler.':
      'Katalog ucu üzerinden takip edilen sanal eğitim parçası.'}));
  l.summary='İki yardımcı yön rölesine KT1 ve KT2 zaman rölelerini ekleyelim. START verildiğinde seçilen yönün kontaktörü hemen çekmez; 2 saniye sonunda sanal motor çalışır. Diğer yönün komutu karşılıklı NC kilidinde tutulur. Yön değiştirmeden önce STOP ve ardından yeni START gerekir. Gerçek motorun dönme ataleti ve güvenli duruş süresi modellenmez.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Motor neden önce bekleyip sonra seçilen yönde çalışıyor?',
    virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal sağ yönü seçip START ver. KA1 hemen etkinleşirken K1 in henüz çekmediğini gözlemle.',
      'Bir saniye sonra motor hâlâ kapalı olmalı; iki saniye bitince KT1 sağ kontağı izin verir.',
      'START ı bırak: mühürleme sayesinde seçili yön çalışmayı sürdürür.',
      'Çalışırken ters yön komutunu dene; karşı NC kilit izin vermemeli.',
      'STOP ile durdur, sol yönü seçip yeni START ver. KT2 bu kez ayrı iki saniye sayar.',
      'Sanal zaman kontaklarından birini veya motorun bir fazını kopararak sonucu karşılaştır.'
    ],
    observations:[
      'Özgün Simulation.solve ve 703 bileşenli katalogda 30 pozitif/negatif sanal kontrol PASS.',
      'Bu süre motorun fiziksel olarak durduğu anlamına gelmez; donanımda dönüş değiştirme güvenliği ve üretici kabulü açık.',
      'Windows/3D terminal-kablo hizası ile bağımsız pedagojik kabul REVIEW durumunda.'
    ],repairModel:'MOTOR-OUTLINE-089-TIMED-FORWARD-REVERSE-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_MOTOR_TRANSITION_TIMING_MECHANICAL_INTERLOCK_WINDOWS_3D_AND_PEDAGOGY_PENDING';
  v.componentIds=components.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_30_TARGETED_CHECKS_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc854TimedDirectionRepair='MOTOR-OUTLINE-089-TIMED-FORWARD-REVERSE-V1';
 })();


 // SC865 motor-start-speed-outline-020: preserve the real star/delta packet graph,
 // replace generic comparisons with this circuit's observable virtual lesson.
 (() => {
  const l=L.byId['motor-start-speed-outline-020'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
     !p.components.some(c=>c.id==='sw'&&c.typeId==='packet-star-delta')||
     !p.components.some(c=>c.id==='motor'&&c.typeId==='motor-y-d')||
     r?.independentPedagogicalAcceptance===true)return;
  l.summary='Bu sanal örnekte üç konumlu yıldız–üçgen paket şalterinin 0, Y ve Δ durumlarını karşılaştır. Motorun altı terminali üzerinden yıldız köprülerinin ve üçgen bağlantısının farkını gör. Simülasyon elektriksel sürekliliği gösterir; kalkış akımı, moment, yük altında geçiş veya mekanik güvenlik ölçümü değildir.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Önce yıldız, sonra üçgen: sanal şalterde neler değişir?',
    virtualOnly:true,canonicalGraphUnchanged:true,physicalTestAccepted:false,
    pedagogicalAcceptance:false,fullyRich:false,
    steps:['Şalter 0 konumunda olsun: sanal motor etkin değil.',
      'Şalteri Y konumuna getir; motor bağlantısının yıldız olduğunu simülasyonda gör.',
      'Sanal şalteri önce 0 konumuna döndür, ardından Δ konumunda üçgen bağlantısını karşılaştır.',
      'Bir sanal faz hattını ayırarak Y ve Δ konumlarında motorun etkinleşmediğini gözlemle.',
      'Altı motor terminali ile şalter uçlarını adım adım eşleştir; gerçek motor kalkış akımı veya torku ölçtüğünü varsayma.'],
    observations:['Özgün 703 bileşenli katalogda 0/Y/Δ konumları ve pozitif/negatif bağlantı senaryoları Simulation.solve ile doğrulandı.',
      'Bu ders otomatik yıldız–üçgen rölesi veya soft starter devresi değildir.',
      'Gerçek motor geçiş süresi, koruma ve Windows/3D terminal-kablo kabulü açıktır.'],
    repairModel:'MOTOR-START-SPEED-020-STAR-DELTA-PACKET-TEACHING-V1'};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint||w.from.c+'/'+w.from.p+' → '+w.to.c+'/'+w.to.p,
    why:w.tutorialWhy||'Bu hattı yalnız sanal motor ve paket şalter terminalinde izle.',
    color:w.color||'#43857f',role:w.role||'SIGNAL',size:w.size||'1.5'}));
  l.materials=p.components.map(c=>({id:c.id,label:c.label,
    why:c.id==='sw'?'0, yıldız ve üçgen için üç konumlu sanal anahtar.':
      c.id==='motor'?'Altı sargı ucunu Y ve Δ konumlarında karşılaştır.':
      'Sanal üç faz kaynağının terminal kimliğini takip et.'}));
  const v=r||(l.pedagogyReview={});
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='CURRENT_TORQUE_MECHANICAL_TRANSITION_WINDOWS_3D_AND_PEDAGOGY_PENDING';
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc865TeachingRepair='MOTOR-START-SPEED-020-STAR-DELTA-PACKET-TEACHING-V1';
 })();

 // SC868 motor-start-speed-outline-023: replace incorrect star/delta
 // selector/motor with real catalog softstarter + three-phase motor terminals.
 // Model covers conduction only, not soft-start current/torque ramp.
 (() => {
  const l=L.byId['motor-start-speed-outline-023'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
     !p.components.some(c=>c.id==='sw'&&c.typeId==='packet-star-delta')||
     !p.components.some(c=>c.id==='motor'&&c.typeId==='motor-y-d')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ext={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
  const parts=[
    C('g','supply-3p','G1','Sanal üç faz ve PE',70,245),
    C('ss','softstarter','SS1','Sanal üç faz yumuşak yol verici',475,250),
    C('motor','motor-3p','M1','M1 sanal üç fazlı motor',905,260,{motorConnection:'star'})
  ];
  const graph=[
    ['g','L1','ss','L1'],['g','L2','ss','L2'],['g','L3','ss','L3'],
    ['ss','T1','motor','U'],['ss','T2','motor','V'],['ss','T3','motor','W'],
    ['g','PE','motor','PE']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'motor-softstarter-023-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Üç fazın güç yolu; bu modelde akım veya moment rampası ölçülmez.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='ss'?'Üç faz girişini üç çıkışa bağlayan sanal soft starter; rampa modeli yok.':
      c.id==='motor'?'Sanal motorun U/V/W besleme uçları.':'Sanal faz kaynağı.'}));
  l.summary='Bu devrede yıldız–üçgen paket şalteri değil soft starter bulunur. Sanal besleme, SS1 üzerinden M1 motoruna ulaşır. Faz ya da çıkış hattını kesince motor etkinliği kaybolur. Yazılımın bu modeli gerçek akım/gerilim rampası, tork sınırı veya kalkış süresi çözmez; gerçek soft start kabulü bekliyor.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Soft starter devresinde sanal güç yolunu izle',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:['Sanal SS1 bileşeninin girişleri ile üç motor çıkışını ayrı ayrı incele.',
      'Tüm sanal faz yolları bağlıyken motorun etkinliğini kontrol et.',
      'Bir giriş fazını kaldırıp motorun çalışmadığını gözlemle.',
      'Bir sanal motor çıkışı ayrıldığında motorun üç faz koşulunu kaybettiğini gör.',
      'Yumuşak kalkış akımı veya tork eğrisinin ölçülmediğini not et; bu yalnız bağlantı deneyi.'],
    observations:['703 bileşenli gerçek katalog ve özgün Simulation.solve ile güç yolu ve faz kopuklukları sınandı.',
      'Soft starter için rampa/koruma davranışı gerçek native modelde doğrulanmadı, açık REVIEW.',
      'Gerçek donanım/Windows/3D fiziksel kabulü yapılmadı.'],
    repairModel:'MOTOR-START-SPEED-023-SOFTSTARTER-TERMINALS-BOUNDED-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='SOFTSTARTER_CURRENT_TORQUE_RAMP_AND_WINDOWS_3D_PENDING';
  v.componentIds=parts.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_CONDUCTION_ONLY_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc868BoundedTerminalRepair='MOTOR-START-SPEED-023-SOFTSTARTER-TERMINALS-BOUNDED-V1';
 })();


 // SC869 motor-start-speed-outline-024: bounded Dahlander low/high
 // virtual electrical model, not a real RPM/torque/transition model.
 (() => {
  const l=L.byId['motor-start-speed-outline-024'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
     !p.components.some(c=>c.id==='sw'&&c.typeId==='packet-star-delta')||
     !p.components.some(c=>c.id==='motor'&&c.typeId==='motor-y-d')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ext={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
  const parts=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',55,340),
   C('sel','selector-2','S1','0 / Düşük / Yüksek seçici',220,60,{position:0}),
   C('lockL','contact-nc','KH','KH NC düşük kademe kilidi',465,65),
   C('lockH','contact-nc','KL','KL NC yüksek kademe kilidi',465,300),
   C('coilL','coil-contactor','KL','KL düşük kademe bobini',750,75),
   C('coilH','coil-contactor','KH','KH yüksek kademe bobini',750,325),
   C('mainL','main-contact','KL','KL düşük kademe üç faz yolu',925,350),
   C('mainH','main-contact','KH','KH yüksek kademe üç faz yolu',980,630),
   C('bridge','main-contact','KH','KH yüksek kademe üç uç köprüsü',1240,290),
   C('motor','motor-dahlender','M1','M1 sanal altı uçlu Dahlander motor',1460,515)
  ];
  const graph=[
   ['g','L1','sel','11'],['sel','13','lockL','21'],
   ['lockL','22','coilL','A1'],['sel','14','lockH','21'],
   ['lockH','22','coilH','A1'],['coilL','A2','g','N'],
   ['coilH','A2','g','N'],
   ['g','L1','mainL','1'],['g','L2','mainL','3'],['g','L3','mainL','5'],
   ['mainL','2','motor','U'],['mainL','4','motor','V'],['mainL','6','motor','W'],
   ['g','L1','mainH','1'],['g','L2','mainH','3'],['g','L3','mainH','5'],
   ['mainH','2','motor','X'],['mainH','4','motor','Y'],['mainH','6','motor','Z'],
   ['motor','U','bridge','1'],['motor','V','bridge','3'],
   ['motor','W','bridge','5'],['bridge','2','bridge','4'],
   ['bridge','4','bridge','6'],['g','PE','motor','PE']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
   id:'motor-dahlander-024-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Dahlander düşük/yüksek kademe ve KH kilitli köprü terminali.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='motor'?'Düşükte U/V/W, yüksekte X/Y/Z uçlarını ayırt et.':
   c.id==='sel'?'Karşılıklı iki kademeden yalnız biri seçilebilir.':
   c.id==='bridge'?'Yüksek kademe için sanal U/V/W ortak bağlantısı.':
   c.typeId==='contact-nc'?'Sanal karşılıklı kontaktör kilidi.':
   'Sanal dersin katalog terminali.'}));
  l.summary='Dahlander motorunda aynı üç faz iki farklı sanal uç grubuyla kullanılır. Düşük devir kademesinde KL, yüksek kademede KH ve KH ortak köprüsü çalışır. Seçici 0 konumunda iki kademe de durur. Gerçek devir/darbe momenti, güvenli geçiş süresi ve mekanik kilit doğrulanmadı.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Dahlander motorda iki farklı kademe nasıl seçilir?',
   virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['S1 konumunu 0 seçip motorun durduğunu sanal simülasyonda gör.',
    'Düşük kademe seçildiğinde KL kontaktörünün U/V/W grubunu etkinleştirdiğini izle.',
    'S1 ile 0 konumuna dön; yüksek konumda KH, X/Y/Z beslemesi ve ayrı ortak köprüyü karşılaştır.',
    'Bir sanal fazı veya yüksek kademe köprüsünü çıkar; motor etkinliği yok olmalı.',
    'Bu yazılımda hız oranı ve güvenli geçiş süresi ölçülmez; gerçek motor için kabul olarak kullanma.'],
   observations:['Özgün 703 katalog elemanı ve Simulation.solve ile 0/düşük/yüksek, faz kopukluğu ve köprü kopukluğu sınandı.',
    'Sanal düşük/yüksek hız yalnız kademe etiketidir, ölçülmüş fiziksel RPM değildir.',
    'Gerçek güvenlik/Windows/3D terminal ve bağımsız pedagojik kabul açık.'],
   repairModel:'MOTOR-START-SPEED-024-DAHLANDER-LOW-HIGH-NATIVE-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='DAHLANDER_RPM_TORQUE_SAFE_TRANSITION_WINDOWS_3D_PENDING';
  v.componentIds=parts.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_LOWHIGH_BREAKS_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc869DahlanderRepair='MOTOR-START-SPEED-024-DAHLANDER-LOW-HIGH-NATIVE-V1';
 })();


 // SC866: bounded virtual star/delta relay wiring, physical isolation REVIEW.
 (() => {
 const l=L.byId['motor-start-speed-outline-021'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
 !p.components.some(c=>c.typeId==='packet-star-delta')||r?.independentPedagogicalAcceptance===true)return;
 const make=(id,typeId,ref,extra={})=>({id,typeId,ref,label:id,x:100,y:100,rotation:0,state:false,address:'',note:'',...extra});
 const items=[
  make('g','supply-3p','G1'),make('sel','selector-2','S1',{position:0}),
  make('ncY','contact-nc','KD'),make('ncD','contact-nc','KY'),
  make('coilY','coil-contactor','KY'),make('coilD','coil-contactor','KD'),
  make('star','main-contact','KY'),make('delta','main-contact','KD'),
  make('motor','motor-y-d','M1',{motorConnection:'external'})];
 const links=[
 ['g','L1','sel','11'],['sel','13','ncY','21'],['ncY','22','coilY','A1'],
 ['sel','14','ncD','21'],['ncD','22','coilD','A1'],
 ['coilY','A2','g','N'],['coilD','A2','g','N'],
 ['g','L1','motor','U1'],['g','L2','motor','V1'],['g','L3','motor','W1'],
 ['motor','U2','star','1'],['motor','V2','star','3'],['motor','W2','star','5'],
 ['star','2','star','4'],['star','4','star','6'],
 ['motor','U2','delta','1'],['motor','V2','delta','3'],['motor','W2','delta','5'],
 ['delta','2','motor','V1'],['delta','4','motor','W1'],['delta','6','motor','U1'],
 ['g','PE','motor','PE']];
 p.components=items;p.wires=links.map(([a,ap,b,bp],i)=>({
  id:'motor-outline-021-relay-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  role:'CONTROL',color:'#43857f',size:'1.5',points:[],
  tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
  tutorialWhy:'Sanal röle veya motor terminali; gerçek pano bağlantısı değildir.'}));
 delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=items.map(c=>({id:c.id,label:c.label,why:
  c.typeId==='contact-nc'?'Karşıt röle çalışırken komut yolunu keser.':
  c.typeId==='main-contact'?'Sanal yıldız veya üçgen sargı köprülerini kurar.':
  'Katalogdaki sanal öğretici bileşen.'}));
 l.summary='Yıldız ve üçgen kontaktörleri karşılıklı NC kontaklarla kilitlenir. Seçici 0/Y/Δ durumunda motor sargı bağlantısı değişir. Ana güç izolasyonu ve otomatik geçiş yoktur; 0 konumu gerçek gerilimsizliği göstermez. Motor kalkış akımı, mekanik kilit ve Windows/3D kabulü REVIEW.';
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
  heading:'Yıldız ve üçgen röleleri sargı bağlantısını nasıl değiştirir?',
  virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
  pedagogicalAcceptance:false,fullyRich:false,
  steps:['Sanal seçicide 0 seç ve motorun durduğunu gözlemle.',
   'Yıldız durumunda KY alt uçları birleştirir.',
   '0 konumuna döndükten sonra üçgeni seç; KD diğer sargı bağlantısını kurar.',
   'NC kilit veya sargı bağlantısını kopar ve motorun etkinliğini yeniden incele.'],
  observations:['Özgün 703 kataloglu Simulation.solve ile 13 sanal pozitif/negatif durum PASS.',
   'Ana enerji izolasyonu, otomatik zamanlama, kalkış akımı ve Windows/3D doğrulanmadı.'],
  repairModel:'SC866-BOUNDED-VIRTUAL-RELAY-STAR-DELTA-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='ISOLATION_AUTOMATIC_TIMING_PHYSICAL_3D_PENDING';
 v.componentIds=items.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
 v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_13_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc866RelayRepair='SC866-BOUNDED-VIRTUAL-RELAY-STAR-DELTA-V1';
 })();


 // SC867 · Automatically timed star-to-delta, virtual continuity model only.
 // Native interlocking is observable; hardware transfer timing is not validated.
 (() => {
  const l=L.byId['motor-start-speed-outline-022'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
     !p.components.some(c=>c.typeId==='packet-star-delta')||
     !p.components.some(c=>c.typeId==='motor-y-d')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,more={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...more});
  const parts=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',55,365),
   C('stop','push-nc','S0','STOP NC',230,70),
   C('start','push-no','S1','START NO',420,70),
   C('hold','contact-no','KM','KM mühürleme',540,195),
   C('coilMain','coil-contactor','KM','KM ana kontaktör bobini',890,65),
   C('main','main-contact','KM','KM ana güç kontaktörü',890,575),
   C('timer','coil-delay-on','KT','KT1 sanal ON-delay 2 saniye',1020,225,
     {delayValue:2,delayUnit:'sec'}),
   C('timerNC','contact-nc','KT','KT1 başlangıçta kapalı NC',440,350),
   C('timerNO','contact-no','KT','KT1 gecikmeli NO',440,490),
   C('lockD','contact-nc','KD','KD NC yıldız kilidi',680,350),
   C('lockY','contact-nc','KY','KY NC üçgen kilidi',680,490),
   C('coilY','coil-contactor','KY','KY yıldız bobin',1010,360),
   C('coilD','coil-contactor','KD','KD üçgen bobin',1010,505),
   C('star','main-contact','KY','KY yıldız köprüleri',1205,550),
   C('delta','main-contact','KD','KD üçgen bağlantı',1210,760),
   C('motor','motor-y-d','M1','M1 altı uçlu sanal motor',1515,655,
     {motorConnection:'external'})
  ];
  const graph=[
   ['g','L1','stop','21'],['stop','22','start','13'],
   ['start','14','coilMain','A1'],['stop','22','hold','13'],
   ['hold','14','coilMain','A1'],['coilMain','A2','g','N'],
   ['coilMain','A1','timer','A1'],['timer','A2','g','N'],
   ['coilMain','A1','timerNC','21'],['timerNC','22','lockD','21'],
   ['lockD','22','coilY','A1'],['coilY','A2','g','N'],
   ['coilMain','A1','timerNO','13'],['timerNO','14','lockY','21'],
   ['lockY','22','coilD','A1'],['coilD','A2','g','N'],
   ['g','L1','main','1'],['g','L2','main','3'],['g','L3','main','5'],
   ['main','2','motor','U1'],['main','4','motor','V1'],
   ['main','6','motor','W1'],
   ['motor','U2','star','1'],['motor','V2','star','3'],
   ['motor','W2','star','5'],['star','2','star','4'],
   ['star','4','star','6'],
   ['main','2','delta','1'],['main','4','delta','3'],
   ['main','6','delta','5'],
   ['delta','2','motor','W2'],['delta','4','motor','U2'],
   ['delta','6','motor','V2'],['g','PE','motor','PE']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'motor-outline-022-auto-'+(i+1),
    from:{c:a,p:ap},to:{c:b,p:bp},points:[],
    color:'#43857f',role:'CONTROL',size:'1.5',
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal süreklilik, yıldız / üçgen kilidi veya zaman kontağı.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({
    from:{...w.from},to:{...w.to},hint:w.tutorialHint,
    why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='timer'?'Sanal yıldız süresi tamamlandığında çıkışı değişir.':
      c.id==='lockY'||c.id==='lockD'?'Karşı kontaktör etkinken bu kumanda yolunu kapatır.':
      c.id==='motor'?'Altı uçlu sanal yıldız / üçgen bağlantısı.':
      'Simülatörde katalog pinine bağlı öğretim elemanı.'}));
  l.summary='START ile önce sanal yıldız kademesi çalışır. KT1 iki saniye sayınca yıldız kontaktörü bırakır ve üçgen kontaktörü devreye girer. STOP her iki kademeyi de kapatır. Bu ders yalnız ideal elektriksel durumları gösterir; gerçek motor hızlanması, mekanik geçiş aralığı, ark, akım ve tork modellenmez.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Otomatik yıldızdan üçgene geçişi izle',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal START komutu ver, ardından bırak; ana kontaktörün mühürlendiğini gözlemle.',
      'İlk saniyede motorun yıldız bağlantısı etkin olmalı.',
      'İki saniye tamamlanınca KT1 NC bırakıp KT1 NO devreye girer; yıldızdan üçgene geçişi gör.',
      'STOP komutunda üç kontaktörün de bırakıldığını doğrula.',
      'Sanal faz veya zaman kontağı kablosunu çıkarınca neden bağlantının etkinleşmediğini karşılaştır.'
    ],
    observations:[
      'Özgün Simulation.solve ve 703 bileşenli katalogla zamanlı geçiş, STOP, yeniden başlatma ve kopuk hat senaryoları sınandı.',
      'Sanal model iki kontaktör arasında fiziksel geçiş boşluğu veya motor kalkış ölçümü sağlamaz.',
      'Gerçek güç ekipmanı, koruma, Windows/3D terminal-kablo ve bağımsız pedagoji kabulü açık.'
    ],repairModel:'MOTOR-START-SPEED-022-AUTO-STAR-DELTA-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='STAR_DELTA_HARDWARE_TRANSFER_TIMING_AND_WINDOWS_3D_PENDING';
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.componentIds=parts.map(c=>c.typeId);
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TIMED_PASS';
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc867AutoStarDeltaRepair='MOTOR-START-SPEED-022-AUTO-STAR-DELTA-V1';
 })();


 // SC870: virtual automatic low-to-high Dahlander contact sequence, not hardware RPM.
 (() => {
  const l=L.byId['motor-start-speed-outline-025'],reference=L.byId['motor-start-speed-outline-024'];
  const p=l?.project,r=l?.pedagogyReview,donor=reference?.project;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
   !p.components.some(c=>c.typeId==='packet-star-delta')||
   !p.components.some(c=>c.typeId==='motor-y-d')||
   reference?.practiceGuide?.repairModel!=='MOTOR-START-SPEED-024-DAHLANDER-LOW-HIGH-NATIVE-V1'||
   donor?.components?.length!==10||r?.independentPedagogicalAcceptance===true)return;
  const copy=x=>JSON.parse(JSON.stringify(x));
  const C=(id,typeId,ref,label,x,y,props={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...props});
  const add=[
   C('stop','push-nc','S0','STOP NC',225,65),
   C('start','push-no','S1','START NO',400,65),
   C('hold','contact-no','KM','KM mühürleme',510,180),
   C('coilMain','coil-contactor','KM','KM kumanda bobini',825,65),
   C('timer','coil-delay-on','KT','KT1 sanal iki saniye',940,195,
     {delayValue:2,delayUnit:'sec'}),
   C('timerNC','contact-nc','KT','KT1 zaman öncesi NC',380,330),
   C('timerNO','contact-no','KT','KT1 zaman sonrası NO',380,475)
  ];
  const parts=[...copy(donor.components.filter(c=>c.id!=='sel')),...add];
  const additions=[
   ['g','L1','stop','21'],['stop','22','start','13'],
   ['start','14','coilMain','A1'],['stop','22','hold','13'],
   ['hold','14','coilMain','A1'],['coilMain','A2','g','N'],
   ['coilMain','A1','timer','A1'],['timer','A2','g','N'],
   ['coilMain','A1','timerNC','21'],['timerNC','22','lockL','21'],
   ['coilMain','A1','timerNO','13'],['timerNO','14','lockH','21']
  ];
  const wires=copy(donor.wires.filter(w=>
    w.from?.c!=='sel'&&w.to?.c!=='sel')).map((w,i)=>({
    ...w,id:'motor-outline-025-auto-donor-'+(i+1)}));
  p.components=parts;
  p.wires=[...wires,...additions.map(([a,ap,b,bp],i)=>({
    id:'motor-outline-025-auto-control-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal zaman, START/STOP veya kademe kilidi.'}))];
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint||'Sanal terminal',
    why:w.tutorialWhy||'Bu katalog terminalindeki sanal bağlantıyı incele.',
    color:w.color||'#43857f',role:w.role||'CONTROL',size:w.size||'1.5'}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='timer'?'Başlangıçtaki düşük kademeden yüksek kademeye süreli geçişi tetikler.':
      c.id==='bridge'?'Yüksek kademe U/V/W ortak bağlantısıdır.':
      c.id==='motor'?'Düşükte U/V/W, yüksekte X/Y/Z sanal sargı uçları.':
      c.typeId==='contact-nc'?'Karşı kademe kilitlemesi veya zamanın NC durumudur.':
      'Sanal devre katalog terminali.'}));
  l.summary='START ile Dahlander motor önce düşük kademe KL üzerinden çalışır. KT1 sanal süresi iki saniyeyi doldurunca KL kapanır, KH yüksek kademe ve ortak köprü etkinleşir. STOP tüm kumandayı sıfırlar. Gerçek devir, akım, moment veya mekanik geçiş süresi modellenmez.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Dahlander motor önce düşük, sonra yüksek kademeye geçsin',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal START komutunu verip bırak; düşük KL kademesini izle.',
      'KT1 iki saniye boyunca sayarken düşük kademe etkin kalmalı.',
      'Süre dolunca düşük kademe bırakır, yüksek KH ve U/V/W ortak köprüye geçer.',
      'STOP komutunda iki kademenin de durduğunu, tekrar START olmadan dönmediğini gör.',
      'Bir sanal faz, NC kilit veya yüksek kademe köprüsünü koparıp sonucu karşılaştır.'
    ],
    observations:[
      'Özgün 703 katalog ve Simulation.solve ile kademe süresi, STOP ve kopuk bağlantılar hedefli sınandı.',
      'Bu modelin düşük/yüksek etiketi gerçek RPM veya güç aktarımı güvenlik kabulü değildir.',
      'Fiziksel geçiş, 3D terminaller ve bağımsız pedagojik kabul bekliyor.'
    ],repairModel:'MOTOR-START-SPEED-025-TIMED-DAHLANDER-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='DAHLANDER_REAL_RPM_TORQUE_TRANSITION_WINDOWS_3D_PENDING';
  v.componentIds=parts.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TIMED_POS_NEG_PASS';
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc870TimedDahlanderRepair='MOTOR-START-SPEED-025-TIMED-DAHLANDER-V1';
 })();


 // SC871: virtual 2-speed forward-reverse Dahlander, contact continuity only.
 (() => {
  const l=L.byId['motor-start-speed-outline-026'],reference=L.byId['motor-start-speed-outline-024'];
  const p=l?.project,r=l?.pedagogyReview,donor=reference?.project;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
   !p.components.some(c=>c.typeId==='packet-star-delta')||
   !p.components.some(c=>c.typeId==='motor-y-d')||
   reference?.practiceGuide?.repairModel!=='MOTOR-START-SPEED-024-DAHLANDER-LOW-HIGH-NATIVE-V1'||
   donor?.components?.length!==10||donor?.wires?.length!==25||
   r?.independentPedagogicalAcceptance===true)return;
  const copy=x=>JSON.parse(JSON.stringify(x));
  const parts=[...copy(donor.components),{
    id:'rev',typeId:'packet-reversing-3p',ref:'Q1',label:'Sanal ileri / 0 / geri şalter',
    x:170,y:550,rotation:0,state:false,position:0,address:'',note:''}];
  const original=copy(donor.wires).filter(w=>
    !(w.from.c==='g'&&['mainL','mainH'].includes(w.to.c)&&
      ['L1','L2','L3'].includes(w.from.p)));
  const graph=[
    ['g','L1','rev','L1'],['g','L2','rev','L2'],['g','L3','rev','L3'],
    ['rev','U','mainL','1'],['rev','V','mainL','3'],['rev','W','mainL','5'],
    ['rev','U','mainH','1'],['rev','V','mainH','3'],['rev','W','mainH','5']
  ];
  p.components=parts;
  p.wires=[
   ...original.map((w,i)=>({...w,id:'motor-outline-026-speed-'+(i+1)})),
   ...graph.map(([a,ap,b,bp],i)=>({
     id:'motor-outline-026-direction-'+(i+1),
     from:{c:a,p:ap},to:{c:b,p:bp},points:[],
     color:'#43857f',role:'CONTROL',size:'1.5',
     tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
     tutorialWhy:'Sanal yön seçicinin üç faz güç yolu.'}))
  ];
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint||'Sanal katalog terminali',
    why:w.tutorialWhy||'Motor hız/yön eğitim devresinde sanal bağlantı.',
    color:w.color||'#43857f',role:w.role||'CONTROL',size:w.size||'1.5'}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='rev'?'Sanal ileri, 0 ve geri faz sırası seçimi.':
    c.id==='sel'?'Düşük/yüksek kademe komutunu birbirinden ayırır.':
    c.id==='bridge'?'Yüksek kademe için U/V/W ortak bağlantısı.':
    c.typeId==='contact-nc'?'Karşı kademe bobininin kilidi.':
    c.id==='motor'?'Dahlander modelinin U/V/W ve X/Y/Z uçlarını ayır.':
    'Özgün katalog terminaline bağlı sanal parça.'}));
  l.summary='İki bağımsız sanal seçimle motoru dört durumda incele: ileri-düşük, geri-düşük, ileri-yüksek ve geri-yüksek. Hız seçicisi 0 iken motor durur; yön seçicisi 0 iken güç kesilir. Bu ideal süreklilik modelinde yön veya kademe değişiminin mekanik güvenliği, gerçek hız ve tork ölçülmez.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Dahlander motorun hem yönünü hem kademesini karşılaştır',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Sanal yön seçicisini ileri, hız seçicisini düşük konuma getir; düşük kademe durumunu izle.',
      'Sanal simülasyonu durdurup geri/düşük durumunu ayrı bir senaryo olarak karşılaştır.',
      'Aynı iki yönü yüksek kademede de dene; KH ortak köprü yolunu gözlemle.',
      'Yön veya kademe seçicisi 0 konumundayken motorun etkinliğinin kaybolduğunu gör.',
      'Bir sanal faz veya yüksek kademe köprüsü kopuğunda neden motorun çalışmadığını incele.'
    ],
    observations:[
      'Özgün Simulation.solve ve 703 elemanlı katalogla dört yön/hız birleşimi ve negatif kablo senaryoları sınandı.',
      'Simülatör hız değiştirirken gerçek motorun durmasını ve güvenli yön geçişini doğrulamaz.',
      'Gerçek fiziksel kilitleme, donanım, Windows/3D ve bağımsız pedagojik kabul açıktır.'
    ],repairModel:'MOTOR-START-SPEED-026-DAHLANDER-DIRECTION-SPEED-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_SAFE_DIRECTION_SPEED_CHANGE_WINDOWS_3D_PENDING';
  v.componentIds=parts.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_FOUR_MODES_POS_NEG_PASS';
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc871DahlanderDirectionRepair='MOTOR-START-SPEED-026-DAHLANDER-DIRECTION-SPEED-V1';
 })();


 // SC880: bounded virtual DC-brake command study; rotor torque is NOT simulated.
 (() => {
  const l=L.byId['motor-braking-outline-018'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==18||p?.wires?.length!==38||
     !p.components.some(c=>c.typeId==='motor-y-d')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,
    rotation:0,state:false,address:'',note:'',...extra});
  const a=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',50,330),
   C('sel','selector-2','S1','Sanal Çalış / 0 / Fren seçicisi',250,70,{position:0}),
   C('ncB','contact-nc','KB','KB NC motor kilidi',450,90),
   C('ncR','contact-nc','K1','K1 NC fren kilidi',460,335),
   C('runCoil','coil-contactor','K1','K1 motor çalışma bobini',755,80),
   C('runMain','main-contact','K1','K1 üç faz güç kontağı',710,525),
   C('tCoil','coil-delay-on','KT1','KT1 2 sn düz zaman bobini',745,330,{delayValue:2,delayUnit:'sec'}),
   C('tNC','contact-nc','KT1','KT1 süre dolunca açılan NC',655,430),
   C('brakeCoil','coil-contactor','KB','KB yalnız sanal DC uygulama bobini',970,340),
   C('brakeMain','main-contact','KB','KB sanal DC ana kontak',1020,530),
   C('smps','smps','G2','G2 sanal 24 VDC kaynak',700,750),
   C('motor','motor-3p','M1','M1 üç faz motor / sanal DC uçları',1350,550,{motorConnection:'star'})
  ];
  const edges=[
   ['g','L1','sel','11'],['sel','13','ncB','21'],
   ['ncB','22','runCoil','A1'],['runCoil','A2','g','N'],
   ['sel','14','tCoil','A1'],['tCoil','A2','g','N'],
   ['sel','14','ncR','21'],['ncR','22','tNC','21'],
   ['tNC','22','brakeCoil','A1'],['brakeCoil','A2','g','N'],
   ['g','L1','runMain','1'],['g','L2','runMain','3'],
   ['g','L3','runMain','5'],['runMain','2','motor','U'],
   ['runMain','4','motor','V'],['runMain','6','motor','W'],
   ['g','PE','motor','PE'],['g','L1','smps','L'],['g','N','smps','N'],
   ['smps','P','brakeMain','1'],['brakeMain','2','motor','U'],
   ['smps','M','brakeMain','3'],['brakeMain','4','motor','V']
  ];
  p.components=a;p.wires=edges.map(([ac,ap,bc,bp],i)=>({
    id:'motor-braking-outline-018-'+(i+1),
    from:{c:ac,p:ap},to:{c:bc,p:bp},points:[],
    color:'#43857f',role:'CONTROL',size:'1.5',
    tutorialHint:'Sanal '+ac+'/'+ap+' → '+bc+'/'+bp,
    tutorialWhy:'Üç faz çalışma ve zaman sınırlı DC komut yollarının ayrı katalog uçları.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
    why:c.id==='sel'?'Tek seçici ile çalışma, 0 ve sanal fren komutlarını ayırır.':
      c.id==='tCoil'?'Sanal fren komutuna iki saniye sınır koyar.':
      c.id==='smps'?'Yalnız simüle edilen düşük gerilim DC kaynağıdır.':
      'Devrede gerçek katalog kimliği ve uçları olan elemandır.'}));
  l.summary='Sanal çalışma konumunda üç fazlı motor etkinleşir. Sanal fren seçildiğinde K1 üç fazı keser ve KB ile düşük gerilimli DC uç yolu en fazla iki saniye etkinleşir. Düz zaman rölesi KT1 NC hattını açar. Gerçek akım/ısı, rotor fren momenti, mekanik durma ve donanım güvenliği hesaplanmaz.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Motoru bırak, sanal fren komutunu iki saniye izle',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:['Sanal S1 seçicisini 0 konumunda başlat. Motor etkinliği yoktur.',
      'Çalışma konumunda motorun sanal üç faz etkinliğini izle.',
      '0 konumunu kullanıp sanal fren komutuna geç; K1 kapanmış olmamalı.',
      'KT1 süresi tamamlanmadan KB çıkışının sanal DC hattını etkinleştirdiğini gözlemle.',
      'İki saniye sonra KT1 NC açılır; KB DC komutu kapanır.',
      'Bir sanal fazı veya fren kumanda hattını koparıp tepkileri karşılaştır.'],
    observations:['Pozitif ve kopuk bağlantı native kontrolleri elektriksel durumlar içindir, rotor fren momenti testi değildir.',
      'Sanal 24 VDC örneği gerçek motor fren gerilimi seçimi veya cihaz montaj talimatı değildir.',
      'Mekanik/fiziksel model, Windows/3D ve bağımsız pedagojik kabul açık.'],
    repairModel:'SC880-TIMED-DC-BRAKE-COMMAND-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='DC_BRAKE_TORQUE_MOTOR_STOP_REAL_HARDWARE_AND_WINDOWS_3D_PENDING';
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.componentIds=a.map(c=>c.typeId);
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_VIRTUAL_ELECTRICAL_PASS';
  v.sc880LimitedBrakeCommand='SC880-TIMED-DC-BRAKE-COMMAND-V1';
 })();


 // SC881: independent forward/reverse virtual contactors plus bounded DC brake command.
 (() => {
 const l=L.byId['motor-braking-outline-019'],ref=L.byId['motor-braking-outline-018'],p=l?.project,v=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==18||p?.wires?.length!==38||
    ref?.practiceGuide?.repairModel!=='SC880-TIMED-DC-BRAKE-COMMAND-V1'||
    v?.independentPedagogicalAcceptance===true)return;
 const clone=x=>JSON.parse(JSON.stringify(x));
 const C=(id,typeId,reference,label,x,y,ex={})=>({
   id,typeId,ref:reference,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
 const a=clone(ref.project.components);
 const sel=a.find(c=>c.id==='sel');sel.typeId='selector-3';sel.label='S1 sanal ileri / geri / DC komut';sel.position=0;
 a.push(
 C('ncK2','contact-nc','K2','K2 NC ileri kilidi',470,100),
 C('ncK1','contact-nc','K1','K1 NC geri kilidi',480,210),
 C('ncKB2','contact-nc','KB','KB NC geri kilidi',340,245),
 C('ncK2Brake','contact-nc','K2','K2 NC fren kilidi',570,380),
 C('reverseCoil','coil-contactor','K2','K2 sanal geri bobini',870,260),
 C('reverseMain','main-contact','K2','K2 geri güç kontakları',1020,740)
 );
 const graph=[
 ['g','L1','sel','11'],
 ['sel','13','ncB','21'],['ncB','22','ncK2','21'],
 ['ncK2','22','runCoil','A1'],['runCoil','A2','g','N'],
 ['sel','14','ncKB2','21'],['ncKB2','22','ncK1','21'],
 ['ncK1','22','reverseCoil','A1'],['reverseCoil','A2','g','N'],
 ['sel','15','tCoil','A1'],['tCoil','A2','g','N'],
 ['sel','15','ncR','21'],['ncR','22','ncK2Brake','21'],
 ['ncK2Brake','22','tNC','21'],['tNC','22','brakeCoil','A1'],
 ['brakeCoil','A2','g','N'],
 ['g','L1','runMain','1'],['g','L2','runMain','3'],['g','L3','runMain','5'],
 ['runMain','2','motor','U'],['runMain','4','motor','V'],['runMain','6','motor','W'],
 ['g','L1','reverseMain','1'],['g','L2','reverseMain','3'],['g','L3','reverseMain','5'],
 ['reverseMain','2','motor','W'],['reverseMain','4','motor','V'],['reverseMain','6','motor','U'],
 ['g','PE','motor','PE'],
 ['g','L1','smps','L'],['g','N','smps','N'],
 ['smps','P','brakeMain','1'],['brakeMain','2','motor','U'],
 ['smps','M','brakeMain','3'],['brakeMain','4','motor','V']
 ];
 p.components=a;p.wires=graph.map(([ac,ap,bc,bp],i)=>({
 id:'motor-braking-outline-019-'+(i+1),
 from:{c:ac,p:ap},to:{c:bc,p:bp},
 color:'#43857f',role:'CONTROL',size:'1.5',points:[],
 tutorialHint:'Sanal '+ac+'/'+ap+' → '+bc+'/'+bp,
 tutorialWhy:'İleri, geri veya süreli DC komut yolunun ayrı katalog ucu.'}));
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
 why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=a.map(c=>({id:c.id,label:c.label,
 why:c.id==='sel'?'Tek konum seçer: ileri, geri veya sanal fren.':
 c.typeId==='contact-nc'?'Karşı kontaktörün eşzamanlı çalışmasını önleyen sanal kilit.':
 c.id==='tCoil'?'Sanal DC fren komutunu iki saniye ile sınırlar.':
 'Özgün katalogdaki sanal terminal davranışı.'}));
 l.summary='İleri ve geri yön ayrı kontaktörlerle, karşılıklı NC kilitleme ile seçilir. Üçüncü konumda AC motor etkinliği kesilir ve 24 VDC sanal komut KT1 düz zaman rölesiyle iki saniye sonra kapanır. Motor fren momenti ve fiziksel durma süresi modellenmez.';
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
 heading:'İleri, geri ve zaman sınırlı fren komutunu ayıralım',
 virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
 pedagogicalAcceptance:false,fullyRich:false,
 steps:['Sanal seçiciyi ileri yap; motorun dönme yönünü gözlemle.',
 'Önce 0 konumuna dönüp ardından geri yönü karşılaştır.',
 'Tek seçici ve K1/K2 NC kilitleri, iki yön kontaktörünü aynı anda çalıştırmamalı.',
 '0 sonrasında fren konumuna geç; iki saniyelik DC uygulama komutunu izle.',
 'KT1 süresi bitince KB komutunun kapanmasını ve motor AC yolunun hâlâ açık olmadığını doğrula.',
 'Faz, motor ucu veya fren kumanda hattını sanal olarak ayır.'],
 observations:['Özgün 703 katalog ve Simulation.solve elektriksel yol ve zaman testleri için kullanıldı.',
 'Sanal 24 VDC komut, gerçek DC enjeksiyon akımı veya mekanik frenleme kabulü değildir.',
 'Gerçek güvenlik kilidi, rotor dinamiği, Windows/3D ve bağımsız kabul açık.'],
 repairModel:'SC881-FORWARD-REVERSE-TIMED-DC-COMMAND-V1'};
 const review=v||(l.pedagogyReview={});
 review.preRepairTitleTopologyIssue=review.titleTopologyIssue||null;
 review.titleTopologyStatus='REVIEW';
 review.titleTopologyIssue='MECHANICAL_TORQUE_REAL_INJECTION_AND_WINDOWS_3D_PENDING';
 review.componentIds=a.map(c=>c.typeId);review.realWiredCircuit=true;
 review.nativeDynamicAcceptance=false;review.physicalAcceptance=false;
 review.windowsVisualAcceptance=false;review.independentPedagogicalAcceptance=false;
 review.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_VIRTUAL_ELECTRICAL_PASS';
 review.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 review.sc881LimitedBrakeCommand='SC881-FORWARD-REVERSE-TIMED-DC-COMMAND-V1';
 })();


 // SC882: six-terminal star/delta packet, distinct AC power and bounded DC command.
 (() => {
 const l=L.byId['motor-start-speed-outline-027'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
    !p.components.some(c=>c.typeId==='packet-star-delta')||
    r?.independentPedagogicalAcceptance===true)return;
 const C=(id,typeId,ref,label,x,y,ex={})=>({
 id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
 const a=[
 C('g','supply-3p','G1','Sanal üç faz / N / PE',45,330),
 C('sel','selector-2','S2','Sanal çalış / 0 / fren seçimi',225,70,{position:0}),
 C('ncBrake','contact-nc','KB','KB NC AC kilidi',420,90),
 C('ncRun','contact-nc','K1','K1 NC fren kilidi',490,345),
 C('coilRun','coil-contactor','K1','K1 üç faz bobini',740,90),
 C('mainRun','main-contact','K1','K1 üç faz ayırıcı',740,510),
 C('sw','packet-star-delta','S1','S1 Y/0/Δ paket şalter',980,520,{position:0}),
 C('motor','motor-y-d','M1','M1 altı uçlu asenkron motor',1330,530,{motorConnection:'external'}),
 C('timer','coil-delay-on','KT1','KT1 iki saniyelik zamanlayıcı',680,300,{delayValue:2,delayUnit:'sec'}),
 C('timerNC','contact-nc','KT1','KT1 gecikmeli açma kontağı',670,400),
 C('coilBrake','coil-contactor','KB','KB sanal DC bobini',990,300),
 C('mainBrake','main-contact','KB','KB sanal DC kontak',990,760),
 C('smps','smps','G2','G2 sanal 24 VDC kaynak',650,790)
 ];
 const edges=[
 ['g','L1','sel','11'],['sel','13','ncBrake','21'],
 ['ncBrake','22','coilRun','A1'],['coilRun','A2','g','N'],
 ['sel','14','timer','A1'],['timer','A2','g','N'],
 ['sel','14','ncRun','21'],['ncRun','22','timerNC','21'],
 ['timerNC','22','coilBrake','A1'],['coilBrake','A2','g','N'],
 ['g','L1','mainRun','1'],['g','L2','mainRun','3'],['g','L3','mainRun','5'],
 ['mainRun','2','sw','L1'],['mainRun','4','sw','L2'],['mainRun','6','sw','L3'],
 ['sw','U1','motor','U1'],['sw','V1','motor','V1'],['sw','W1','motor','W1'],
 ['sw','U2','motor','U2'],['sw','V2','motor','V2'],['sw','W2','motor','W2'],
 ['g','PE','motor','PE'],
 ['g','L1','smps','L'],['g','N','smps','N'],
 ['smps','P','mainBrake','1'],['mainBrake','2','motor','U1'],
 ['smps','M','mainBrake','3'],['mainBrake','4','motor','V1']
 ];
 p.components=a;p.wires=edges.map(([ac,ap,bc,bp],i)=>({
 id:'motor-start-speed-outline-027-'+(i+1),from:{c:ac,p:ap},to:{c:bc,p:bp},
 color:'#43857f',role:'CONTROL',size:'1.5',points:[],
 tutorialHint:'Sanal '+ac+'/'+ap+' → '+bc+'/'+bp,
 tutorialWhy:'Yıldız/üçgen veya sınırlı sanal DC komutu katalog bağlantısı.'}));
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
 hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=a.map(c=>({id:c.id,label:c.label,
 why:c.id==='sw'?'Altı sargı ucunu yıldız/üçgen olarak bağlayan sanal şalter.':
 c.id==='mainRun'?'Fren komutundan önce üç fazı ayırır.':
 c.id==='timer'?'Sanal fren komutunun en uzun süresini belirler.':
 'Özgün katalogdaki bağlanabilir sanal devre parçası.'}));
 l.summary='S1 yıldız/0/üçgen konumunu değiştirir; S2 sanal çalışma ve fren komutunu birbirinden ayırır. K1 kesildiğinde KT1 iki saniyelik düşük gerilim DC kumanda aralığını açar. Motorun gerçek sargı akımı, fren momenti, rotor hızı ve güvenli duruşu simüle edilmez.';
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
 heading:'Yıldız ve üçgeni gör, sanal fren komutunu ayır',
 virtualOnly:true,canonicalGraphUnchanged:false,
 physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
 steps:['S2 çalışma seçiliyken S1 yıldız konumunun sargı köprülerini gözlemle.',
 'Önce sanal 0 durumuna dön, ardından üçgen bağlantısını karşılaştır.',
 'S2 ile çalışma yolunu ayır; motor AC etkinliği kalkmalıdır.',
 'Sanal fren konumunu seç; KT1 süresi dolana dek KB DC kontağı etkin olur.',
 'İki saniye sonunda KB hattı kapanır; gerçek mekanik frenleme ölçümü değildir.',
 'Sanal bir fazı veya fren kumanda kablosunu çıkarıp durumu karşılaştır.'],
 observations:['Orijinal 703 katalog elemanı ve Simulation.solve ile yıldız, üçgen, süre ve negatif durumlar sınandı.',
 'Gerçek motor gerilim/akım seçimi, termik/fren momenti, şalter geçiş güvenliği ve Windows/3D kabulü açık.'],
 repairModel:'SC882-STAR-DELTA-VIRTUAL-TIMED-DC-COMMAND-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='STAR_DELTA_DC_MOTOR_TORQUE_REAL_HARDWARE_WINDOWS_3D_PENDING';
 v.componentIds=a.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
 v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_VIRTUAL_ELECTRICAL_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc882BoundedBrakeRepair='SC882-STAR-DELTA-VIRTUAL-TIMED-DC-COMMAND-V1';
 })();


 // SC883: 2-second automatic OFF-delay DC *command* and fresh-START rearm.
 // No mechanical RPM, braking torque, DC winding current or hardware-safety model.
 (() => {
 const l=L.byId['motor-braking-outline-020'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==18||p?.wires?.length!==38||
    !p.components.some(c=>c.typeId==='motor-y-d')||
    r?.independentPedagogicalAcceptance===true)return;
 const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,
 rotation:0,state:false,address:'',note:'',...extra});
 const a=[
 C('g','supply-3p','G1','Sanal üç faz / N / PE',45,355),
 C('stop','push-nc','S0','S0 anlık STOP',190,85),
 C('start','jog-4pin','S1','S1 START NO ve yeniden-kurulma NC',360,75),
 C('hold','contact-no','K1','K1 mühürleme',510,210),
 C('lockKB','contact-nc','KB','KB fren açıkken motor kilidi',680,150),
 C('coilRun','coil-contactor','K1','K1 sanal motor bobini',930,85),
 C('mainRun','main-contact','K1','K1 ana üç faz kontak',920,540),
 C('feedTimer','contact-no','K1','K1 zaman başlatma NO',515,415),
 C('timer','coil-delay-off','KT1','KT1 iki saniye bırakmada gecikme',880,405,{delayValue:2,delayUnit:'sec'}),
 C('timeNO','contact-no','KT1','KT1 süresince açık NO',1070,415),
 C('lockRun','contact-nc','K1','K1 NC fren kilidi',1000,315),
 C('coilBrake','coil-contactor','KB','KB yalnız sanal DC bobini',1300,375),
 C('mainBrake','main-contact','KB','KB sanal DC kontak',1260,755),
 C('smps','smps','G2','G2 sanal 24 VDC kaynağı',870,840),
 C('motor','motor-3p','M1','M1 sanal üç faz motor',1570,610,{motorConnection:'star'}),
 C('armBrakeNC','contact-nc','KB','KB NC yeniden-kurulma kilidi',375,520),
 C('armCoil','coil-relay','KA','KA yeni START bekleme bobini',550,620),
 C('armHold','contact-no','KA','KA yeniden-kurulma mühürleme',550,715),
 C('armStart','contact-no','KA','KA yeni START izni',670,85)
 ];
 const e=[
 ['g','L1','armBrakeNC','21'],['armBrakeNC','22','start','21'],
 ['start','22','armCoil','A1'],['armBrakeNC','22','armHold','13'],
 ['armHold','14','armCoil','A1'],['armCoil','A2','g','N'],
 ['g','L1','stop','21'],['stop','22','start','13'],
 ['start','14','armStart','13'],['armStart','14','lockKB','21'],
 ['stop','22','hold','13'],['hold','14','lockKB','21'],
 ['lockKB','22','coilRun','A1'],['coilRun','A2','g','N'],
 ['g','L1','feedTimer','13'],['feedTimer','14','timer','A1'],
 ['timer','A2','g','N'],
 ['g','L1','lockRun','21'],['lockRun','22','timeNO','13'],
 ['timeNO','14','coilBrake','A1'],['coilBrake','A2','g','N'],
 ['g','L1','mainRun','1'],['g','L2','mainRun','3'],
 ['g','L3','mainRun','5'],['mainRun','2','motor','U'],
 ['mainRun','4','motor','V'],['mainRun','6','motor','W'],
 ['g','PE','motor','PE'],
 ['g','L1','smps','L'],['g','N','smps','N'],
 ['smps','P','mainBrake','1'],['mainBrake','2','motor','U'],
 ['smps','M','mainBrake','3'],['mainBrake','4','motor','V']
 ];
 p.components=a;p.wires=e.map(([ac,ap,bc,bp],i)=>({
 id:'motor-braking-outline-020-'+(i+1),from:{c:ac,p:ap},to:{c:bc,p:bp},
 color:'#43857f',role:'CONTROL',size:'1.5',points:[],
 tutorialHint:'Sanal '+ac+'/'+ap+' → '+bc+'/'+bp,
 tutorialWhy:'Otomatik DC kumanda süresi ve START yeniden-kurulma sanal bağlantısı.'}));
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
 why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=a.map(c=>({id:c.id,label:c.label,
 why:c.id==='timer'?'K1 ayrılınca iki saniye daha sanal fren sinyali sağlar.':
 c.id==='armCoil'?'Süre dolarken START basılı kalsa bile kendiliğinden yeniden çalıştırmaz.':
 c.id==='start'?'Yeni çalışmaya izin için düğme serbest bırakılmalıdır.':
 'Katalog terminaliyle modellenmiş sanal parça.'}));
 l.summary='START motoru mühürlemeyle çalıştırır. STOP, K1 ana üç faz kontaklarını açar ve KT1 OFF-delay iki saniye boyunca KB sanal DC komutunu verir. START bu sırada basılı tutulursa KA yeniden-kurulma rölesi süre bitince de otomatik yeniden çalışmayı engeller. Gerçek fren akımı, moment ve rotor duruşu bu simülatörde hesaplanmaz.';
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
 heading:'STOP sonrası sanal fren ve yeni START izni',
 virtualOnly:true,canonicalGraphUnchanged:false,physicalTestAccepted:false,
 pedagogicalAcceptance:false,fullyRich:false,
 steps:['START serbestken sanal KA yeniden-kurulma iznini gözlemle.',
 'START basıp bırak; motor mühürlemeli çalışır.',
 'STOP ile motoru durdur: iki saniyelik KB komutu sanal olarak başlar.',
 'Fren sırasında START basılı tutulsa da motor yeniden çalışmamalıdır.',
 'Süre dolduktan sonra START bırakıp yeniden basınca yeni çalışmanın başladığını gözlemle.',
 'Faz, START izni ve KB sanal kumanda yolu kopukluklarını karşılaştır.'],
 observations:['Özgün 703 katalog elemanı ve Simulation.solve ile zaman, kilit ve kopuk kablo kontrolleri yapıldı.',
 'Sanal KA bir donanım emniyet rölesi değildir; fiziksel fren torku, DC akımı ve gerçek duruş ölçülmedi.',
 'Windows/3D ve bağımsız pedagojik kabul bekliyor.'],
 repairModel:'SC883-AUTOMATIC-VIRTUAL-OFF-DELAY-REARM-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='BRAKE_TORQUE_CURRENT_REAL_HARDWARE_WINDOWS_3D_AND_PEDAGOGY_PENDING';
 v.componentIds=a.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
 v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_VIRTUAL_BRAKE_AND_REARM_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc883AutomaticBrakeRepair='SC883-AUTOMATIC-VIRTUAL-OFF-DELAY-REARM-V1';
 })();


 // SC912 motor-direct-power-outline-097: virtual delayed-start motor command.
 // No actual mains wiring, motor acceleration, or hardware safety certification.
 (() => {
  const l=L.byId['motor-direct-power-outline-097'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,more={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...more});
  const a=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',50,340),
   C('stop','push-nc','S0','STOP NC',210,60),
   C('start','push-no','S1','START NO',420,60),
   C('arm','coil-relay','KA','KA sanal izin rölesi',755,80),
   C('seal','contact-no','KA','KA NO mühürleme',540,220),
   C('timer','coil-delay-on','KT1','KT1 iki saniye gecikme',820,330,{delayValue:2,delayUnit:'sec'}),
   C('timeNO','contact-no','KT1','KT1 süre sonunda kapanan NO',1060,60),
   C('coil','coil-contactor','K1','K1 motor kontaktör bobini',1300,80),
   C('main','main-contact','K1','K1 sanal motor güç kontakları',1090,535),
   C('motor','motor-3p','M1','M1 sanal motor',1420,510,{motorConnection:'star'})
  ];
  const edges=[
   ['g','L1','stop','21'],['stop','22','start','13'],
   ['start','14','arm','A1'],['stop','22','seal','13'],
   ['seal','14','arm','A1'],['arm','A2','g','N'],
   ['seal','14','timer','A1'],['timer','A2','g','N'],
   ['stop','22','timeNO','13'],['timeNO','14','coil','A1'],
   ['coil','A2','g','N'],
   ['g','L1','main','1'],['g','L2','main','3'],['g','L3','main','5'],
   ['main','2','motor','U'],['main','4','motor','V'],['main','6','motor','W'],
   ['g','PE','motor','PE']
  ];
  p.components=a;
  p.wires=edges.map(([ac,ap,bc,bp],i)=>({
   id:'motor-outline-097-'+(i+1),
   from:{c:ac,p:ap},to:{c:bc,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:ac+'/'+ap+' → '+bc+'/'+bp,
   tutorialWhy:'Sanal gecikmeli çalışma için katalog terminalini takip edelim.'
  }));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
   why:c.id==='timer'?'START mühürlendikten sonra sanal iki saniyeyi sayar.':
    c.id==='timeNO'?'Süre dolana dek motor bobinini bekletir.':
    c.id==='stop'?'Gecikmeyi ve kumandayı sıfırlamayı gösterir.':
    'Yalnız sanal devrede katalog terminaliyle yer alır.'}));
  l.summary='Bu zaman ayarlı çalışma örneğinde START bir kez basılıp bırakılır; KA izin kontağı mühürler. KT1 iki saniye sayar ve ancak sonunda K1 sanal motoru çalıştırır. STOP hem izin rölesini hem sayacı sıfırlar; yeni START olmadan kendi kendine başlamaz. Gerçek motor kalkış akımı ve güvenlik modellenmez.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'START sonrası gecikmeli çalışma deneyelim',
   virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:[
    'START düğmesine kısa basıp bırak; KA sanal izin rölesinin durumunu izle.',
    'Birinci saniyede motor hâlâ durmuş olmalı; KT1 saymaya devam eder.',
    'İki saniyenin sonunda K1 kontaktörü ve sanal motor etkinleşmeli.',
    'STOP komutuyla motoru ve KT1 sayacını sıfırla; STOP bırakıldığında kendiliğinden yeniden çalışmamalı.',
    'KT1 veya K1 motor yolu kopukluğunda farklı sonuçları karşılaştır.'
   ],observations:[
    'Gerçek 703 bileşenli katalog ve özgün Simulation.solve ile zaman ilerlemesi ve kopuk kablo durumları sınandı.',
    'İki saniye yalnız simülasyon süresidir; fiziksel yol verme donanımı ve Windows/3D kabulü yapılmadı.'
   ],repairModel:'SC912-VIRTUAL-MOTOR-ON-DELAY-START-WITH-SEAL-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='DELAYED_START_INTERPRETATION_REAL_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=a.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TARGETED_TIMED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc912TimedStart='SC912-VIRTUAL-MOTOR-ON-DELAY-START-WITH-SEAL-V1';
 })();


 // SC913: electrical interlock direction exercise, separate from accepted SC840.
 // Reuse SC840's authenticated catalogue-pin graph; preserve both original lessons.
 (() => {
  const l=L.byId['motor-direct-power-outline-098'],
        reference=L.byId['motor-direct-power-outline-078'],
        p=l?.project,r=l?.pedagogyReview,source=reference?.project;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='main-contact')||
     !p.components.some(c=>c.typeId==='motor-3p')||
     source?.components?.length!==13||source?.wires?.length!==26||
     reference?.practiceGuide?.repairModel!=='MOTOR-OUTLINE-078-DIRECTION-SELECTED-INTERLOCK-V1'||
     r?.independentPedagogicalAcceptance===true)return;
  const copy=x=>JSON.parse(JSON.stringify(x));
  p.components=copy(source.components);
  p.wires=source.wires.map((w,i)=>({...copy(w),id:'motor-outline-098-'+(i+1)}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=p.components.map(c=>({id:c.id,label:c.label,
    why:c.typeId==='contact-nc'?'Diğer kontaktörün aktif olmasını önleyen karşılıklı elektriksel kilit.':
     c.typeId==='contact-no'?'START düğmesi bırakıldıktan sonra seçili kontaktörün sanal mührü.':
     c.id==='dir'?'Tek seferde yalnız ileri veya geri komutu seçilir.':
     'Sanal güç ve kumanda devresindeki katalog terminali.'}));
  l.summary='İleri K1 ve geri K2 kontaktörlerinin sanal güç yolları birbirine karşılıklı NC kontaklarla kilitlenir. S2 yalnız bir yön seçtirir. Yön değiştirmeden önce STOP gerekir; motor STOP sonrası START verilmeden kendiliğinden çalışmaz. Fiziksel mekanik kilit, gerçek durma süresi, Windows/3D kabulü açık.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'İleri ve geri komutları aynı anda neden çalışamaz?',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
     'Sanal S2 seçicisini ileri yap, START bas ve motorun ileri çalışmasını gözlemle.',
     'START bırak; K1 mühürleme kontağının neden çalışmayı koruduğunu incele.',
     'Motor ileri çalışırken geri yönünü seç ve START dene; K2 bobini aktif olmamalı.',
     'STOP ile dur, sonra geri yönde yeniden START ver.',
     'Geri çalışırken ileri komutunun engellendiğini ve kopuk NC kilitte çalışmanın durduğunu sınayalım.'
    ],observations:[
     'SC913 devresi özgün Simulation.solve ve 703 katalog bileşeniyle pozitif ve negatif durumlarda sınandı.',
     'Gerçek donanımda fiziksel/mekanik kilit, güvenli durma ve kablo/terminal geometrisi ayrıca doğrulanmalıdır.'
    ],repairModel:'SC913-VIRTUAL-FWD-REV-ELECTRICAL-INTERLOCK-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='HARDWARE_MECHANICAL_INTERLOCK_MOTOR_STOP_WINDOWS_3D_PENDING';
  v.componentIds=p.components.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC913_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc913ElectricalInterlock='SC913-VIRTUAL-FWD-REV-ELECTRICAL-INTERLOCK-V1';
 })();


 // SC914: two independently operated virtual three-phase motor branches.
 // One educational example only; panel safety and sequencing requirements REVIEW.
 (() => {
  const l=L.byId['motor-direct-power-outline-099'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='main-contact')||
     !p.components.some(c=>c.typeId==='motor-3p')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,more={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...more});
  const a=[
   C('g','supply-3p','G1','Sanal üç faz / N / PE',45,425),
   C('stop1','push-nc','S0A','M1 STOP NC',200,60),
   C('start1','push-no','S1A','M1 START NO',410,60),
   C('seal1','contact-no','K1','K1 mühürleme NO',600,155),
   C('coil1','coil-contactor','K1','K1 bobin M1',820,70),
   C('main1','main-contact','K1','K1 M1 güç kontakları',985,295),
   C('motor1','motor-3p','M1','M1 sanal motor',1350,310,{motorConnection:'star'}),
   C('stop2','push-nc','S0B','M2 STOP NC',200,520),
   C('start2','push-no','S1B','M2 START NO',410,520),
   C('seal2','contact-no','K2','K2 mühürleme NO',600,640),
   C('coil2','coil-contactor','K2','K2 bobin M2',820,520),
   C('main2','main-contact','K2','K2 M2 güç kontakları',985,770),
   C('motor2','motor-3p','M2','M2 sanal motor',1350,790,{motorConnection:'star'})
  ];
  const edges=[];
  for(const s of ['1','2']){
    const stop='stop'+s,start='start'+s,seal='seal'+s,coil='coil'+s,main='main'+s,motor='motor'+s;
    edges.push(
     ['g','L1',stop,'21'],[stop,'22',start,'13'],[start,'14',coil,'A1'],
     [stop,'22',seal,'13'],[seal,'14',coil,'A1'],[coil,'A2','g','N'],
     ['g','L1',main,'1'],['g','L2',main,'3'],['g','L3',main,'5'],
     [main,'2',motor,'U'],[main,'4',motor,'V'],[main,'6',motor,'W'],
     ['g','PE',motor,'PE']);
  }
  p.components=a;
  p.wires=edges.map(([ac,ap,bc,bp],i)=>({
    id:'motor-outline-099-'+(i+1),
    from:{c:ac,p:ap},to:{c:bc,p:bp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:ac+'/'+ap+' → '+bc+'/'+bp,
    tutorialWhy:'Sanal M1 veya M2 kumanda/güç kolunun katalog terminali.'
  }));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=a.map(c=>({id:c.id,label:c.label,
    why:c.id.startsWith('stop')?'Yalnız kendi sanal motor kolunu durdurur.':
     c.id.startsWith('start')?'Yalnız kendi motorunun sanal START komutudur.':
     c.id.startsWith('seal')?'START bırakıldıktan sonra ilgili motorun mühürlemesini korur.':
     'Sanal pano devresinin katalog terminaliyle yer alan parçası.'}));
  l.summary='İki motorlu pano için bağımsız kumanda örneği: K1 ve K2 ayrı sanal güç kolları, M1 ve M2 ayrı START/STOP ve mühürleme kontakları kullanır. Bir motor dururken diğeri çalışabilir. Bu, tüm olası iki motorlu pano şartnamelerini karşılamaz; sıra kilidi, yük koruması, fiziksel güvenlik ve Windows/3D kabulü bekler.';
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'İki motor, iki ayrı kumanda: birbirini nasıl etkiler?',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:[
      'Önce M1 sanal START komutunu ver, M2 nin kapalı kaldığını izle.',
      'START düğmesini bırak; K1 yardımcı mühürleme kontağı M1 i çalışır tutar.',
      'M2 START komutunu ver; şimdi iki sanal motor birlikte çalışır.',
      'M1 STOP komutuyla yalnız M1 i durdur. M2 çalışmayı sürdürmeli.',
      'M2 STOP sonrasında düğmeler serbestken hiçbir motor kendiliğinden başlamamalı.',
      'Bir motorun faz veya mühürleme kolunu kopar; diğer motorun devresinden bağımsız sonucu incele.'
    ],observations:[
      'Özgün 703 bileşenli katalog ve Simulation.solve ile iki sanal motorun bağımsız pozitif/negatif davranışı sınandı.',
      'Gerçek pano koruması, mekanik terminal geometrisi ve işletme senaryosu onaylanmadı.'
    ],repairModel:'SC914-VIRTUAL-DUAL-MOTOR-INDEPENDENT-START-STOP-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='PANEL_SEQUENCE_PROTECTION_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=a.map(c=>c.typeId);
  v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TWO_MOTOR_INDEPENDENCE_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc914DualMotorRepair='SC914-VIRTUAL-DUAL-MOTOR-INDEPENDENT-START-STOP-V1';
 })();


 // SC939-944: identity-grounded sensor demonstrations. Only virtual circuitry.
 (() => {
  const C=(id,typeId,label,x,y,extra={})=>({
   id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const A=[
   ['081','proximity','Endüktif metal sensörü','metal',4,2,'Metal','Plastik'],
   ['082','capacitive-switch','Kapasitif yaklaşım sensörü','plastic',10,2,'Plastik','Metal olmayan nesneler'],
   ['083','sensor-hall','Hall manyetik sensörü','magnet',4,2,'Mıknatıs','Sıradan metal'],
   ['084','sensor-diffuse','Cisimden yansımalı optik sensör','wood',40,15,'Ahşap cisim','Sıvı']
  ];
  function finalize(l,parts,graph,tag,heading,summary,steps,observations,question,answers){
   const p=l.project;
   p.components=parts;
   p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'sensor-'+tag+'-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'SIGNAL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal sensör deneyinde ilgili katalog terminalini izle.'}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:'Sanal algılama, ölçüm veya gösterge görevini incele.'}));
   l.learningGoal=heading;l.summary=summary+' Windows/3D ve bağımsız pedagojik kabul bekliyor.';
   l.explanation='Yalnız sanal eğitim devresi; enerjili donanım bağlantısı yapılmaz.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading,virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps,observations,repairModel:'SC-'+tag+'-SENSOR-V1'};
   l.quiz={question,options:answers,answer:0,why:summary};
   const v=l.pedagogyReview||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='SENSOR_MODEL_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
   v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
   v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_703_CATALOG_SIMULATION_SOLVE_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v.scSensorRepair='SC-'+tag+'-SENSOR-V1';
  }
  for(const [suffix,type,label,target,range,near,yes,no] of A){
   const l=L.byId['sensor-analog-apps-outline-'+suffix],p=l?.project;
   if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==4||
     p.components.find(c=>c.id==='s')?.typeId!=='proximity'||
     l.pedagogyReview?.independentPedagogicalAcceptance===true)continue;
   const sensor=p.components.find(c=>c.id==='s');
   sensor.typeId=type;sensor.label=label;
   sensor.sensing={target,range,distance:range*1.5,offset:0,auto:false};
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.learningGoal=label+' ile sanal hedef algılama';
   l.summary=label+' BN (+), BU (0 V) ve BK (PNP çıkış) uçlarıyla sanal H1 göstergesini çalıştırır. Algılama hedef ve mesafeye bağlıdır; fiziksel kabul bekliyor.';
   l.explanation='Önce sanal hedefi yaklaştır, sonra uzaklaştır. H1 değişimini BK çıkışı üzerinden izle; bir terminali kopardığında ne değiştiğini incele.';
   l.materials=p.components.map(c=>({id:c.id,label:c.label,why:c.id==='s'?'Sanal hedefe duyarlı sensör.':'Sanal besleme veya gösterge.'}));
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:label+' ile hedefi tanı',virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps:['BN/BU beslemeyi ve BK–H1 sinyal yolunu bul.',
     yes+' hedefini sanal olarak yaklaştır, H1 yansın.',
     'Hedefi algılama aralığından çıkar; H1 sönmeli.',
     'BN, BU ve BK hatlarını ayrı ayrı kopararak sonucu karşılaştır.'],
    observations:['Sanal hedef algılama; üretici performansı ve gerçek güvenlik kabulü değildir.',
     'Windows/3D terminal geometrisi ve bağımsız pedagojik kabul açık.'],
    repairModel:'SC'+(858+Number(suffix))+'-TARGET-'+type+'-V1'};
   l.quiz={question:'Bu sanal '+label+' uygulamasında uygun hedef hangisi?',
    options:[yes,no,'PE terminali'],answer:0,why:'Sensör tipi ve hedef uygunluğu katalog/simülasyon modeliyle belirlenir.'};
   const v=l.pedagogyReview||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='SENSOR_TARGET_WINDOWS_3D_PEDAGOGY_PENDING';
   v.componentIds=p.components.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
   v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v.targetedNativePositiveNegative='ORIGINAL_703_CATALOG_SIMULATION_SOLVE_PASS';
   v.scSensorRepair='SC'+(858+Number(suffix))+'-TARGET-'+type+'-V1';
  }
  {
   const l=L.byId['sensor-analog-apps-outline-085'],p=l?.project;
   if(l?.kind==='wiring'&&p?.components?.length===3&&p?.wires?.length===4&&
     p.components.find(c=>c.id==='s')?.typeId==='proximity'&&
     l.pedagogyReview?.independentPedagogicalAcceptance!==true){
    finalize(l,[
     C('g','supply-dc-plus','G1 · sanal 24 VDC',80,200),
     C('r','resistor','R1 · 10 kΩ',370,110,{resistance:10000}),
     C('s','sensor-ntc','NTC sıcaklık direnci',590,280,{temperature:25}),
     C('v','meter-voltmeter','V1 sanal voltmetre',930,130)
    ],[
     ['g','P','r','1'],['r','2','s','1'],['s','2','g','M'],
     ['v','1','r','2'],['v','2','g','M']
    ],'943-NTC','NTC ısınınca sanal gerilim nasıl değişir?',
    'Sanal R1–NTC gerilim bölücüsü: sıcaklık artınca NTC direnci ve V1 gerilimi azalır.',
    ['NTC sıcaklığını 5, 25 ve 45 °C olarak ayrı ayrı dene.',
     'R1 ile NTC arasındaki V1 değerini karşılaştır.',
     'NTC girişini çıkar; kopuk okumayı sıcaklık değeri sayma.'],
    ['Özgün 703 katalog ve Simulation.solve sayısal NTC direnç/gerilim değişimini hesaplar.',
     'Gerçek kalibrasyon, donanım güvenliği ve Windows/3D kabulü yapılmadı.'],
    'NTC ısındığında sanal devrede ne olur?',
    ['NTC direnci ve V1 gerilimi düşer','Motor zorunlu çalışır','PE sinyal olur']);
   }
  }
  {
   const l=L.byId['sensor-analog-apps-outline-086'],p=l?.project;
   if(l?.kind==='wiring'&&p?.components?.length===3&&p?.wires?.length===4&&
     p.components.find(c=>c.id==='s')?.typeId==='proximity'&&
     l.pedagogyReview?.independentPedagogicalAcceptance!==true){
    const reed=(id,label,x,y)=>C(id,'reed-no',label,x,y,{
      sensing:{target:'magnet',distance:30,range:10,offset:0,auto:false}});
    finalize(l,[
     C('g','supply-dc-plus','G1 · sanal DC',75,295),
     reed('r1','Seri S1',285,80),reed('r2','Seri S2',540,80),
     reed('r3','Paralel S3',285,430),reed('r4','Paralel S4',540,430),
     C('hand','lamp-green','H1 · seri AND',900,80),
     C('hor','lamp-red','H2 · paralel OR',900,430)
    ],[
     ['g','P','r1','13'],['r1','14','r2','13'],['r2','14','hand','X1'],
     ['hand','X2','g','M'],['g','P','r3','13'],['r3','14','hor','X1'],
     ['g','P','r4','13'],['r4','14','hor','X1'],['hor','X2','g','M']
    ],'944-AND-OR','İki sensör birlikte mi, biri mi yeterli?',
    'Sanal reed NO kontaklarıyla seri AND ve paralel OR gösterimi; elektronik sensör beslemeleri birbirine seri bağlanmaz.',
    ['S1 ve S2 hedeflerini birlikte yaklaştırınca H1 yansın.',
     'S3 veya S4 hedefi tek başına yaklaşınca H2 yansın.',
     'Bir hedefi uzaklaştır, ardından her kolda kopuk hatları dene.'],
    ['Seri kolda iki kontak da kapalı olmalı; paralelde bir kontak yeterli.',
     'Bu sanal kontak gösterimidir; aktif üç telli sensör beslemesi/topolojisi değildir.'],
    'Seri AND ile paralel OR farkı nedir?',
    ['Seride ikisi, paralelde biri yeterlidir','İkisi de tek kontakla çalışır','PE ortak veri hattıdır']);
   }
  }
 })();


 // SC950/951: Siemens documented CPU, real catalog terminal names,
 // educational mirror/direct program, NOT a commissioned PLC installation.
 (() => {
  const component=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const wire=(a,ap,b,bp)=>[a,ap,b,bp];
  const base=(program)=>[
   component('g','supply-dc-plus','G1','Sanal 24 VDC / 0 V',65,275),
   component('cpu','plc-0-0-documented','PLC1','CPU 1211C · sanal DI/DO',570,230,{plcProgram:program}),
   component('start','push-no','S1','S1 anlık giriş butonu',340,80),
   component('lamp','lamp-green','H1','H1 PLC Q0 gösterge lambası',1030,230)
  ];
  const edges=[
   wire('g','P','cpu','X10:1'),wire('g','M','cpu','X10:2'),
   wire('g','M','cpu','X10:6'),
   wire('g','P','start','13'),wire('start','14','cpu','X10:7'),
   wire('g','P','cpu','X12:1'),wire('g','M','cpu','X12:2'),
   wire('cpu','X12:3','lamp','X1'),wire('lamp','X2','g','M')
  ];
  function install(id,parts,connections,method,summary,steps,repair){
   const l=L.byId[id],p=l?.project,r=l?.pedagogyReview;
   if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==3||
      !p.components.some(c=>c.typeId==='coil-contactor')||
      r?.independentPedagogicalAcceptance===true)return;
   p.components=parts;
   p.wires=connections.map(([a,ap,b,bp],i)=>({
    id:'plc-'+id.slice(-3)+'-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal CPU 1211C besleme, giriş veya çıkışının belgeli katalog ucu.'}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,why:c.id==='cpu'?
    'X10:1 / X10:2 CPU beslemesi, X10:6 giriş ortak ucu, X12:1 / X12:2 çıkış beslemesi ve X12:3 Q0 çıkışını ayırt eder.':
    c.id==='g'?'Sanal 24 VDC ve 0 V referansı.':
    c.id==='lamp'?'PLC çıkışının sanal sonuç göstergesi.':
    'Sanal giriş butonunun aç/kapa işlevini gösterir.'}));
   l.summary=summary;
   l.explanation='Burada gerçek bir PLC programını yüklemiyoruz; uygulamanın '+method+
     ' sanal programı ile terminal bağının devre davranışını görüyoruz. Giriş ve çıkış beslemeleri ayrı doğrulanır. Gerçek donanım, mühendislik ve güvenlik kabulü yapılmadı.';
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'PLC girişini ve çıkışını birlikte izleyelim',
    virtualOnly:true,canonicalGraphUnchanged:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
    steps,observations:[
     'CPU 24 V ve M, giriş 1M, çıkış 3L+ / 3M bağlantılarının sanal modeldeki etkisi ayrı ayrı doğrulandı.',
     'Dijital çıkış Q0 gerçek donanım akımını, saha güvenliğini veya PLC derleme davranışını temsil etmez.',
     'Gerçek donanım terminal geometrisi, Windows/3D ve bağımsız pedagojik kabulü bekliyor.'
    ],repairModel:repair};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='PLC_REAL_HARDWARE_AND_WINDOWS_3D_PEDAGOGY_PENDING';
   v.componentIds=parts.map(c=>c.typeId);
   v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SCOPED_PLC_RUNTIME_PASS';
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v.scPlcPhysicalRepair=repair;
  }
  install('plc-hardware-programming-outline-044',base('mirror'),edges,
   'girişin Q0 çıkışına yansıtılması',
   'S1 butonu sanal PLC DI0 girişini etkinleştirince Q0/H1 yanar; bırakılınca söner. CPU, giriş ortak ucu ve çıkış bankası ayrı beslemelere bağlıdır. Bu bir sanal eğitim örneğidir.',
   ['Önce CPU L+ / M ile girişin 1M uçlarını bul.',
    'S1 butonuna sanal olarak bas; DI0 girişini ve Q0/H1 sonucunu karşılaştır.',
    'Bıraktığında çıkışın söndüğünü gör.',
    'X10:6 (1M) veya X12:1 (3L+) bağlantısını tek tek kopar ve sonucu karşılaştır.',
    'Gerçek PLC programı veya 24 VDC cihaz bağlantısı yapmadan sanal devrede kal.'],
   'SC950-REAL-CPU1211-DI0-Q0-MIRROR-V1');
  const p=base('direct');
  p.splice(3,0,component('stop','push-nc','S0','S0 NC durdurma girişi',340,435));
  install('plc-hardware-programming-outline-045',p,[
    ...edges,wire('g','P','stop','21'),wire('stop','22','cpu','X10:8')],
   'DI0 START ve DI1 sağlıklı STOP girişleriyle doğrudan AND',
   'CPU 1211C sanal DI0 START ve DI1 NC STOP girişini okuyarak yalnız iki koşul da sağlandığında Q0/H1 çıkışını açar. Bu kilitleme veya emniyet fonksiyonu değil, sanal doğrudan mantık örneğidir.',
   ['X10:1/M, X10:6 1M ve X12:1/3M besleme dönüşlerini ayırt et.',
    'S1 START basılı, S0 STOP serbestken sanal Q0/H1 yansın.',
    'START bırakınca H1 söner; bu ders mühürleme yapmaz.',
    'START basılıyken STOP bas veya STOP girişini kopar; H1 sönmeli.',
    'Kopuk Q0 kablosu ve çıkış beslemesiyle farkı gözlemle.'],
   'SC951-CPU1211-DI0-DI1-DIRECT-Q0-V1');
 })();


 // SC963: PLC LAD normally-closed instruction (NOT DI0), not a physical NC pushbutton.
 (() => {
  const l=L.byId['motor-direct-power-outline-105'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='main-contact')||
    !p.components.some(c=>c.typeId==='motor-3p')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 VDC ve 0 V',70,295),
   C('cpu','plc-0-0-documented','PLC1','CPU1211C · DI0 / Q0',570,220,{plcProgram:'not-input'}),
   C('input','push-no','S1','S1 fiziksel NO dijital giriş',330,85),
   C('lamp','lamp-green','H1','Q0 sanal çıkış lambası',1070,250)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],
   ['g','M','cpu','X10:6'],['g','P','input','13'],
   ['input','14','cpu','X10:7'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['cpu','X12:3','lamp','X1'],['lamp','X2','g','M']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({
   id:'sc963-plc-nc-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Yalnız sanal PLC giriş / çıkış ve ortak uç bağlantısı.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
   why:c.id==='cpu'?'Yalnız sanal NOT DI0 PLC mantığını değerlendirir.':
   c.id==='input'?'Fiziksel NO buton; LAD NC komutuyla aynı şey değildir.':
   'Sanal 24 VDC / PLC Q0 gösterge devresindeki katalog bileşeni.'}));
  l.summary='Bu örnekte fiziksel S1 butonu normalde açıktır. Sanal PLC içindeki LAD normalde kapalı mantık komutu DI0=0 iken Q0/H1 çıkışını açar; butona basınca DI0=1 olur ve H1 söner. Giriş kopuğunda da DI0=0 görülebileceği için bu davranış güvenlik kontağı değildir.';
  l.explanation='Gündelik örnek: Kapının açık olduğunu algılamayan bir giriş düşün. PLC programındaki tersleme komutu 0 değerini doğru kabul eder; ancak kablo kopukluğu da 0 görünebilir. Fiziksel NC butonla yazılımdaki NC mantığını birbirine karıştırma. Gerçek PLC ve TIA Portal doğrulaması yapılmadı.';
  l.quiz={question:'Sanal PLC LAD normalde kapalı (NOT DI0) komutu hangi durumda doğru olur?',
   options:['DI0 girişi 0 iken','DI0 girişi 1 iken','PE hattı kopunca güvenli kapanır'],
   answer:0,why:'Bu, fiziksel kontak tipi değil, programda DI0 mantıksal terslemesidir; giriş kopukluğu güvenli kabul edilmez.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Kapalı kontak: buton mu, PLC mantığı mı?',
   virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['Önce CPU 24 V, giriş 1M ve çıkış bankası 3L+ / 3M uçlarını incele.',
    'S1 butonu serbestken DI0=0; sanal NOT DI0 sonucu H1 yanmalı.',
    'S1 butonuna basınca DI0=1; sanal NC komutu yanlış olur ve H1 söner.',
    'Giriş kablosunu çıkar: H1 yine yanabilir. Bunun neden güvenli bir arıza sonucu olmadığını açıkla.',
    'CPU veya çıkış beslemesini kes: simülatör Q0/H1 çıkışını durdurmalı.'],
   observations:['703 temel katalog bileşeni ve özgün Simulation.solve ile 9 hedefli pozitif/negatif senaryo doğrulandı.',
    'Fiziksel NC bağlantı, donanım güvenliği, gerçek LAD editörü ve Windows/3D kabulü bu test kapsamında değildir.'],
   repairModel:'SC963-PLC-LAD-NOT-DI0-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_LAD_EDITOR_HARDWARE_AND_WINDOWS_3D_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_9_CHECKS_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc963NcLadRepair='SC963-PLC-LAD-NOT-DI0-V1';
 })();


 // SC972: 24V CPU1211 DI0 SET, DI1 NC RESET, Q0 latch, virtual-only.
 (() => {
  const l=L.byId['plc-hardware-programming-outline-056'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==3||
    !p.components.some(c=>c.typeId==='coil-contactor')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 VDC / 0V',70,280),
   C('cpu','plc-0-0-documented','PLC1','CPU1211C · sanal SET-RESET',620,255,{plcProgram:'start-stop-latch'}),
   C('set','push-no','S1','SET anlık butonu',320,75),
   C('reset','push-nc','S0','RESET NC butonu',320,470),
   C('lamp','lamp-green','H1','Q0 sanal gösterge',1130,255)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
   ['g','P','set','13'],['set','14','cpu','X10:7'],
   ['g','P','reset','21'],['reset','22','cpu','X10:8'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['cpu','X12:3','lamp','X1'],['lamp','X2','g','M']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({
   id:'sc972-plc-set-reset-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'CPU1211 sanal besleme, DI/DO veya kumanda yolu.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:c.id==='cpu'?
   'Sanal SET/RESET programı DI0, DI1 ve Q0 uçlarını ilişkilendirir.':
   c.id==='reset'?'NC buton serbestken DI1 sağlıklıdır; basılınca sıfırlama sağlar.':
   c.id==='set'?'Bir anlık DI0 komutu sanal belleği SET yapar.':
   'Sanal DC kaynak veya Q0 gösterge bileşeni.'}));
  l.summary='Bir düğmeyle sanal Q0/H1 çıkışını yak, düğmeyi bıraksan da çıkış kalsın. RESET düğmesi hafızayı temizleyip lambayı söndürür. SET ve RESET aynı anda verilirse bu eğitim modelinde RESET önceliklidir. Gerçek PLC programı/elektrik güvenliği doğrulanmadı.';
  l.explanation='Sanal başlangıç düğmesine bir kez basınca H1 yanık kalır. Neden? PLC bellek değişkeni SET edilmiştir. RESET ile tekrar 0 olur. Bu örnek gerçek sahadaki mühürleme ve güvenlik değerlendirmesinin yerini tutmaz.';
  l.quiz={question:'Bu sanal PLC SET-RESET örneğinde START bırakıldıktan sonra Q0 neden açık kalır?',
   options:['Bellek biti SET edilmiştir','PE hattı akım sağlar','Buton mekanik olarak takılı kalmıştır'],
   answer:0,why:'Kumanda düğmesi bırakılır ama sanal PLC belleği RESET gelene kadar durumu tutar.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Bir kez başlat, RESET ile söndür',
   virtualOnly:true,canonicalGraphUnchanged:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['Önce CPU besleme, X10:6 1M ve X12:1/2 çıkış beslemesini incele.',
    'SET düğmesine sanal olarak bas, H1 ışığının yandığını izle.',
    'SET düğmesini bırak: H1 yanmaya devam eder çünkü bellek SET edilmiştir.',
    'RESET düğmesini kullan ve H1 lambasının söndüğünü izle.',
    'SET ile RESET aynı anda basılırsa RESET öncelikli olmalı.',
    'CPU veya Q0 kablosunu çıkar ve sonucunu yalnız sanal devrede değerlendir.'],
   observations:['Özgün Simulation.solve ile SET, tutma, RESET, eşzamanlı komut ve besleme kaybı davranışı hedefli sınandı.',
    'Fiziksel PLC belleği, yeniden başlatma güvenliği ve Windows/3D kabulü burada kanıtlanmamıştır.'],
   repairModel:'SC972-PLC-SET-RESET-LATCH-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';v.titleTopologyIssue='PLC_HARDWARE_LAD_EDITOR_WINDOWS_3D_AND_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SET_RESET_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc972SetResetRepair='SC972-PLC-SET-RESET-LATCH-V1';
 })();


 // SC973: two-station virtual SET/RESET with both normally-closed resets.
 // Source names this as application #2; the station scenario is illustrative.
 (() => {
  const l=L.byId['plc-hardware-programming-outline-057'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==3||
    !p.components.some(c=>c.typeId==='coil-contactor')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
    C('g','supply-dc-plus','G1','Sanal 24 VDC / 0V',70,310),
    C('cpu','plc-0-0-documented','PLC1','CPU1211C iki istasyonlu bellek',790,285,
      {plcProgram:'two-station-start-stop'}),
    C('set1','push-no','S1','1. istasyon SET (NO)',300,65),
    C('reset1','push-nc','S0','1. istasyon RESET (NC)',290,230),
    C('set2','push-no','S3','2. istasyon SET (NO)',360,445),
    C('reset2','push-nc','S2','2. istasyon RESET (NC)',355,610),
    C('lamp','lamp-green','H1','Q0 sanal bellek göstergesi',1220,270)
  ];
  const graph=[
    ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
    ['g','P','set1','13'],['set1','14','cpu','X10:7'],
    ['g','P','reset1','21'],['reset1','22','cpu','X10:8'],
    ['g','P','set2','13'],['set2','14','cpu','X10:9'],
    ['g','P','reset2','21'],['reset2','22','cpu','X10:10'],
    ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
    ['cpu','X12:3','lamp','X1'],['lamp','X2','g','M']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'sc973-set-reset-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'PLC SET/RESET istasyonu, 1M girişi veya Q0 gösterge bağlantısı.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
    why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='cpu'?'DI0/DI2 SET, DI1/DI3 RESET mantığı ve Q0 belleği.':
      c.typeId==='push-no'?'Kısa bir basışla SET komutu verir.':
      c.typeId==='push-nc'?'Basıldığında sağlıklı RESET girişini keser.':
      'Sanal besleme veya çıkış göstergesidir.'}));
  l.summary='Bu sanal SET–RESET uygulamasında iki ayrı istasyondan SET verilebilir, iki RESET düğmesinden biri belleği sıfırlar. Q0 lambası SET bırakılınca yanık kalır; RESET komutu her zaman önceliklidir. Özgün kaynakta istasyon ayrıntıları bulunmadığından bu bir örnekleme senaryosudur, gerçek PLC güvenliği değildir.';
  l.explanation='İki odada birer başlatma ve durdurma düğmesi olduğunu düşün. Hangi SET düğmesine basarsan bas ortak H1 göstergesi yanar. RESET düğmelerinden birine basınca söner. Bu örnek bir PLC bellek kuralını gösterir; donanımsal güvenlik veya yeniden başlatma garantisi vermez.';
  l.quiz={question:'İki istasyonlu sanal SET–RESET belleğinde H1 yanarken ikinci istasyonun RESET düğmesine basılırsa ne olur?',
    options:['H1 söner; RESET önceliklidir','H1 sürekli yanar','Yalnız birinci istasyon RESET edebilir'],
    answer:0,why:'Her iki NC RESET girişi ortak PLC belleğini sıfırlayacak şekilde sanal programlanmıştır.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'İki farklı yerden aynı belleği yönetelim',
    virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Birinci istasyondan SET komutu verip H1 göstergesini gözlemle.',
      'Düğmeyi bırak. H1 neden yanık kalıyor?',
      'İkinci istasyonun RESET düğmesine bas: H1 sönmeli.',
      'İkinci istasyondan yeniden SET yap; bu kez birinci RESET düğmesini kullan.',
      'SET ile RESET aynı anda basılırsa önceliği karşılaştır.',
      'Bir giriş veya Q0 kablosu kopunca sanal sonuç nasıl değişiyor, gözlemle.'],
    observations:['Özgün Simulation.solve ve 703 elemanlı katalogda normal ve kopuk bağlantı koşulları sınanır.',
      'Güç geri dönüşü ve fiziksel PLC davranışı ayrıca değerlendirilecektir. Emniyet kontağı kabulü yoktur.'],
    repairModel:'SC973-PLC-TWO-STATION-SET-RESET-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='ORIGINAL_EXERCISE_DETAILS_POWER_RESTART_PLC_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(x=>x.typeId);v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
  v.physicalAcceptance=false;v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC973_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc973SetResetRepair='SC973-PLC-TWO-STATION-SET-RESET-V1';
 })();


 // SC974: illustrative two-choice virtual SET/RESET with two Q outputs.
 // Lesson source names application 3 but does not specify its original circuit.
 (() => {
  const l=L.byId['plc-hardware-programming-outline-058'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==3||
     !p.components.some(c=>c.typeId==='coil-contactor')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ext={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 VDC / 0 V',60,310),
   C('cpu','plc-0-0-documented','PLC1','CPU1211C · iki seçimli SET/RESET',760,290,
     {plcProgram:'set-reset-exclusive-sc974'}),
   C('setA','push-no','S1','A durumu SET',335,70),
   C('reset','push-nc','S0','Ortak RESET NC',330,315),
   C('setB','push-no','S2','B durumu SET',340,585),
   C('lampA','lamp-green','H1','Q0 · A göstergesi',1230,140),
   C('lampB','lamp-red','H2','Q1 · B göstergesi',1230,510)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
   ['g','P','setA','13'],['setA','14','cpu','X10:7'],
   ['g','P','reset','21'],['reset','22','cpu','X10:8'],
   ['g','P','setB','13'],['setB','14','cpu','X10:9'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['cpu','X12:3','lampA','X1'],['lampA','X2','g','M'],
   ['cpu','X12:4','lampB','X1'],['lampB','X2','g','M']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
   id:'sc974-plc-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Sanal SET/RESET PLC DI ve ayrı Q0/Q1 gösterge bağlantısı.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
   why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='cpu'?'Sanal A/B bellek seçimini ve ortak RESET önceliğini gösterir.':
   c.id==='reset'?'Basıldığında ortak belleği temizleyen NC giriş.':
   c.id==='setA'||c.id==='setB'?'Sanal seçimi SET eden anlık giriş.':
   c.id==='lampA'||c.id==='lampB'?'Sanal Q0 veya Q1 çıkışını gösterir.':
   'Sanal 24 VDC kaynak.'}));
  l.summary='İki farklı SET komutu bu sanal PLC örneğinde iki ayrı bellek durumunu gösterir. A seçilince H1/Q0, B seçilince H2/Q1 yanar. Karşıt SET veya iki SET birlikte verilirse seçim iptal edilir; RESET her iki çıkışı sıfırlar. Besleme kesilirse eski seçim otomatik dönmez. Bu özgün ders şemasının birebir kopyası değil, başlık için örnek bir eğitim modelidir.';
  l.explanation='İki farklı işi tek seferde seçemediğimizi düşün. SET A komutu H1 ışığını, SET B komutu H2 ışığını tutar. Karşıt komut geldiğinde bellek temizlenir; yeniden SET için düğmeleri serbest bırakmak gerekir. Ortak RESET her ikisini kapatır. Bu gerçek PLC güvenlik devresi değildir.';
  l.quiz={question:'Sanal iki durumlu SET/RESET örneğinde A çıkışı açıkken karşıt SET B verilirse ne olur?',
   options:['İki çıkış da kapanır ve yeni komut bekler','H1 ve H2 aynı anda yanar','RESET etkisiz kalır'],
   answer:0,why:'Sanal program karşıt SET girişinde seçim belleğini temizler; eşzamanlı iki çıkışa izin vermez.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'İki SET, iki gösterge, ortak RESET',
   virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['Önce SET A düğmesine basıp bırak. Yalnız H1 yanmalı.',
    'Karşıt SET B komutunu dene: iki gösterge de söner.',
    'İki düğmeyi bırakıp yeniden SET B ver; yalnız H2 yanmalı.',
    'Ortak RESET girişini kullan ve H1/H2 çıkışlarını sıfırla.',
    'SET A ve SET B aynı anda basılırsa iki gösterge de sönük kalmalı.',
    'Sanal CPU veya çıkış beslemesini kes; geri verdiğinde yeni SET gerekmesini incele.'],
   observations:['Özgün 703 elemanlı katalog ve Simulation.solve ile bellek, reset, besleme ve kopuk hatlar hedefli sınanır.',
    'Bu örnek donanım/TIA Portal, fiziksel güvenlik, Windows/3D veya bağımsız pedagogik kabul yerine geçmez.'],
   repairModel:'SC974-PLC-EXCLUSIVE-SET-RESET-TWO-OUTPUTS-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='ORIGINAL_EXERCISE_DETAILS_REAL_PLC_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC974_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc974SetResetRepair='SC974-PLC-EXCLUSIVE-SET-RESET-TWO-OUTPUTS-V1';
 })();


 // SC975 · One rising-edge virtual output pulse per distinct solver scan.
 (() => {
  const l=L.byId['plc-hardware-programming-outline-059'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==3||
     !p.components.some(c=>c.typeId==='coil-contactor')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ext={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
  const parts=[
    C('g','supply-dc-plus','G1','Sanal 24 VDC / 0 V',70,270),
    C('cpu','plc-0-0-documented','PLC1','CPU1211C sanal P_TRIG yükselen kenar',655,270,
      {plcProgram:'edge-rise-sc975'}),
    C('trigger','push-no','S1','Yükselen kenar için anlık buton',330,85),
    C('lamp','lamp-green','H1','Q0 tek çözüm adımı göstergesi',1140,275)
  ];
  const graph=[
    ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
    ['g','P','trigger','13'],['trigger','14','cpu','X10:7'],
    ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
    ['cpu','X12:3','lamp','X1'],['lamp','X2','g','M']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'sc975-virtual-edge-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'Sanal PLC DI0 ve Q0 sinyal yolu.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,
    why:c.id==='cpu'?'DI0 0→1 geçişini sanal çözüm adımlarıyla algılar.':
      c.id==='trigger'?'Yeni basışla bir yükselen kenar üretir.':
      c.id==='lamp'?'Sanal Q0 darbesini bir çözüm adımı boyunca gösterir.':
      'Sanal 24 VDC besleme.'}));
  l.summary='Sanal S1 düğmesine ilk kez basıldığında PLC DI0 girişi 0→1 değişir ve H1/Q0 yalnız bir çözüm adımı için etkinleşir. Basılı tutmak yeni kenar değildir; yeniden basmak için önce bırakmak gerekir. Besleme kesilip dönünce basılı düğme yeni kenar sayılmaz. Bu gerçek PLC tarama zamanı veya fiziksel donanım modeli değildir.';
  l.explanation='Zil düğmesini basılı tutmak, her an yeniden bastığımız anlamına gelmez. Sanal PLC yalnız ilk 0→1 geçişini görür ve Q0 göstergesine kısa bir darbe verir. Düğmeyi bırakıp tekrar basınca yeni bir olay oluşur. Gerçek PLC taraması ve lambanın görülebilirliği ayrı kontrol edilmelidir.';
  l.quiz={question:'Sanal yükselen kenar örneğinde S1 basılı kalırken bir sonraki PLC adımında Q0 durumu ne olur?',
    options:['Yeni kenar oluşmadığından kapanır','Her adımda yeniden yanar','RESET hattı kopar'],
    answer:0,why:'Yükselen kenar bir durum değişimidir; giriş 1 olarak kaldıkça yeni kenar oluşmaz.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Bir basıştan yalnız bir darbe üretelim',
    virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Buton serbestken DI0=0; Q0 göstergesi sönük olmalı.',
      'Sanal butona bas: birinci yeni çözüm adımında Q0 darbe verir.',
      'Butonu basılı tutup bir sonraki adımı incele; tekrar darbe olmamalı.',
      'Butonu bırakıp yeniden bas: ikinci yükselen kenarı gözlemle.',
      'Giriş kablosunu veya Q0 gösterge hattını ayırıp farkı karşılaştır.',
      'Besleme kesildikten sonra düğmeyi basılı tut: geri gelen besleme yeni basış sayılmamalı.'],
    observations:['Orijinal Simulation.solve ile zaman damgalı pozitif ve negatif sanal testler yapılır.',
      'Tek adımlık darbe fiziksel LED parlaması, gerçek PLC tarama periyodu veya donanım güvenliği kabulü değildir.'],
    repairModel:'SC975-PLC-VIRTUAL-RISING-EDGE-PULSE-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_SCAN_PERIOD_ORIGINAL_LAD_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(x=>x.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC975_TIMED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc975EdgeRepair='SC975-PLC-VIRTUAL-RISING-EDGE-PULSE-V1';
 })();


 // SC977: bounded virtual two-second PLC timer, starts once per press.
 (() => {
  const l=L.byId['plc-hardware-programming-outline-061'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==3||
     !p.components.some(c=>c.typeId==='coil-contactor')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ext={})=>({
    id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
  const parts=[
    C('g','supply-dc-plus','G1','Sanal 24 VDC / 0V',65,295),
    C('cpu','plc-0-0-documented','PLC1','CPU1211C · sanal 2 s süreli Q0',660,275,
      {plcProgram:'timed-stop-once-sc977',plcTimerMs:2000}),
    C('start','push-no','S1','Anlık zaman başlatma',340,85),
    C('stop','push-nc','S0','Zaman iptal RESET NC',340,490),
    C('lamp','lamp-green','H1','Q0 sanal süre göstergesi',1180,280)
  ];
  const graph=[
    ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
    ['g','P','start','13'],['start','14','cpu','X10:7'],
    ['g','P','stop','21'],['stop','22','cpu','X10:8'],
    ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
    ['cpu','X12:3','lamp','X1'],['lamp','X2','g','M']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
    id:'sc977-timer-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'PLC zamanlı Q0 çıkışı ve sanal kumanda girişi.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
    c.id==='cpu'?'Sanal süreyi 2 saniye sayar ve tekrar için yeni basma bekler.':
    c.id==='start'?'Sanal zamanlayıcıyı tek basışla başlatır.':
    c.id==='stop'?'Sanal NC iptal/RESET komutudur.':
    'Sanal besleme veya Q0 çıkış göstergesi.'}));
  l.summary='Anlık START ile sanal PLC iki saniyelik Q0 süresi başlatır. START bırakıldığında H1 yanmaya devam eder, süre bitince söner. START basılı kalsa bile kendiliğinden tekrar başlamaz; yeni başlatma için düğmeyi bırakmak gerekir. RESET erken durdurur. Bu kaynak dersinin birebir PLC şeması değil, süreyi öğretmek için sanal bir örnektir.';
  l.explanation='Koridor ışığını iki saniyeliğine yakmak istediğini düşün. START düğmesine bir kez basınca zaman başlar ve ışık kısa süre yanar. Basılı tutmak yeni komut sayılmaz. RESET zaman bitmeden de ışığı söndürür. Gerçek PLC zamanlayıcı tarama ve donanım güvenliği ayrıca doğrulanmalıdır.';
  l.quiz={question:'Sanal PLC zamanlayıcıda iki saniye dolduğunda START hâlâ basılıysa ne olur?',
    options:['Q0 kapanır; yeniden başlatmak için START bırakılıp tekrar basılır','Q0 her taramada otomatik yeniden açılır','PE hattı çıkış olur'],
    answer:0,why:'Bu örneğin zamanlayıcısı bir basış için yalnız bir süre üretir.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Bir basış, iki saniyelik ışık',
    virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['START komutunu verip bırak, Q0 çıkışını izle.',
      'Bir saniye sonra H1 hâlâ yanmalı.',
      'İki saniyeyi geçince H1 sönmeli; düğme basılı tutulursa yeniden başlamamalı.',
      'Süre dolmadan RESET ile lambayı söndür.',
      'Giriş/çıkış bağlantısı kopukken sanal zaman davranışını karşılaştır.',
      'Beslemeyi geri verdiğinde yeni START gereksinimini gözlemle.'],
    observations:['703 elemanlı özgün katalog ve Simulation.solve ile zaman damgalı pozitif/negatif sınama yapılır.',
      'Gerçek PLC taraması, donanım güvenliği, Windows/3D ve bağımsız pedagojik kabul henüz doğrulanmadı.'],
    repairModel:'SC977-PLC-VIRTUAL-ONESHOT-TIMER-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';v.titleTopologyIssue='ORIGINAL_TIMER_LAD_REAL_SCAN_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(x=>x.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC977_TIMED_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;v.sc977TimerRepair='SC977-PLC-VIRTUAL-ONESHOT-TIMER-V1';
 })();


// SC978–980 virtual-only source repairs: timed stop, delayed start, cycling motor.
(()=>{
 const c=(id,typeId,ref,label,x,y,ext={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
 const w=(a,p,b,q)=>[a,p,b,q];
 const power=(s)=>[w(s,'L1','main','1'),w('main','2','motor','U'),w(s,'L2','main','3'),
  w('main','4','motor','V'),w(s,'L3','main','5'),w('main','6','motor','W'),w(s,'PE','motor','PE')];
 const supply=(id='g',x=50,y=410)=>c(id,'supply-3p','G1','Sanal üç faz / N / PE',x,y);
 const motor=()=>c('motor','motor-3p','M1','M1 sanal üç faz motor',1410,665,{motorConnection:'star'});
 const main=()=>c('main','main-contact','K1','K1 üç kutuplu güç',1085,665);
 const coil=()=>c('coil','coil-contactor','K1','K1 kontaktör bobini',1085,255);
 const stop=()=>c('stop','push-nc','S0','STOP / RESET NC',200,75);
 const start=()=>c('start','push-no','S1','Anlık START',425,75);
 const specs=[
 {n:978,id:'motor-direct-power-outline-111',kind:'PLC_Q0_2S_TIMED_STOP',
  parts:[c('g','supply-dc-plus','GDC','Sanal 24 V DC / 0 V',55,320),supply('power',55,670),
   c('cpu','plc-0-0-documented','PLC1','Sanal 2 saniyelik Q0',715,280,
    {plcProgram:'timed-stop-once-sc977',plcTimerMs:2000}),start(),stop(),coil(),main(),motor()],
  lines:[w('g','P','cpu','X10:1'),w('g','M','cpu','X10:2'),w('g','M','cpu','X10:6'),
   w('g','P','start','13'),w('start','14','cpu','X10:7'),
   w('g','P','stop','21'),w('stop','22','cpu','X10:8'),
   w('g','P','cpu','X12:1'),w('g','M','cpu','X12:2'),
   w('cpu','X12:3','coil','A1'),w('coil','A2','g','M'),...power('power')],
  heading:'Bir START, iki saniyelik motor çalışması',
  story:'Sanal START düğmesine basınca PLC Q0 iki saniye etkin kalır. K1 kontaktörü motoru çalıştırır; süre dolunca durur. START basılı tutulsa bile tekrar başlamaz. RESET erken durdurur. Bu örnek SC977 sanal PLC zamanlayıcısını motorla birleştirir; özgün fiziksel ders şemasının kopyası değildir.',
  steps:['START verip bırak: sanal motor etkinleşsin.','Birinci saniyede motoru gözlemle.',
   'İki saniye bitince K1 düşer; yeni START olmadan çalışmaz.','Süre bitmeden RESET dene.',
   'PLC Q0 veya motor fazı kopunca sonucu gözlemle.']},
 {n:979,id:'motor-direct-power-outline-112',kind:'TON_2S_DELAYED_START',
  parts:[supply(),stop(),start(),c('arm','coil-relay','KA1','KA1 başlatma rölesi',700,80),
   c('hold','contact-no','KA1','KA1 mühürleme',485,210),
   c('feed','contact-no','KA1','KA1 süre başlatma',490,460),
   c('timer','coil-delay-on','KT1','KT1 TON 2 saniye',790,440,{delayValue:2,delayUnit:'sec'}),
   c('ton','contact-no','KT1','KT1 gecikmeli NO',860,190),coil(),main(),motor()],
  lines:[w('g','L1','stop','21'),w('stop','22','start','13'),w('start','14','arm','A1'),
   w('stop','22','hold','13'),w('hold','14','arm','A1'),w('arm','A2','g','N'),
   w('stop','22','feed','13'),w('feed','14','timer','A1'),w('timer','A2','g','N'),
   w('stop','22','ton','13'),w('ton','14','coil','A1'),w('coil','A2','g','N'),...power('g')],
  heading:'İki saniye bekle, sonra sanal motor çalışsın',
  story:'START komutu KA1 rölesini mühürler ve KT1 düz zaman saymaya başlar. İki saniye boyunca motor durur; süre bittiğinde KT1 NO kapanır ve K1 motoru çalıştırır. STOP tüm sanal kumandayı sıfırlar. Bırakıldığında kendiliğinden yeniden başlama yoktur.',
  steps:['START verip bırak; KA1 mühürlemesi sürsün.','Birinci saniyede motor çalışmamalı.',
   'İki saniye tamamlanınca K1 ve motor etkinleşir.','STOP ile durdurup tekrar START gerekip gerekmediğini gör.',
   'KT1 çıkışını veya bir motor fazını çıkararak sonucu incele.']},
 {n:980,id:'motor-direct-power-outline-113',kind:'FLASH_1S_ONOFF_NO_AUTORESTART',
  parts:[supply(),stop(),start(),c('arm','coil-relay','KA1','KA1 periyodik izin',680,80),
   c('hold','contact-no','KA1','KA1 mühürleme',470,200),
   c('feed','contact-no','KA1','KA1 flasher beslemesi',490,435),
   c('pulse','coil-flasher','KT1','KT1 bir saniye açık / bir saniye kapalı',775,430,
     {flashOn:1,flashOff:1,delayValue:1}),
   c('out','contact-no','KT1','KT1 periyodik NO',890,200),coil(),main(),motor()],
  lines:[w('g','L1','stop','21'),w('stop','22','start','13'),w('start','14','arm','A1'),
   w('stop','22','hold','13'),w('hold','14','arm','A1'),w('arm','A2','g','N'),
   w('stop','22','feed','13'),w('feed','14','pulse','A1'),w('pulse','A2','g','N'),
   w('stop','22','out','13'),w('out','14','coil','A1'),w('coil','A2','g','N'),...power('g')],
  heading:'Bir saniye çalış, bir saniye dur',
  story:'Anlık START, KA1 mühürleme rölesini etkinleştirir. KT1 flasher sanal motoru bir saniye çalıştırıp bir saniye durdurur; döngü sürer. STOP izni keser ve bırakıldığında yeniden START gerektirir. Gerçek motor için bu tekrar sıklığı uygun olmayabilir; yalnız sanal eğitim davranışıdır.',
  steps:['START verip bırak: KA1 mühürlesin.','İlk saniye motor sanal olarak çalışır.',
   'İkinci saniyede durur; üçüncü saniyede yeniden çalışır.','STOP a basıp bırak: otomatik yeniden başlamamalı.',
   'Flasher çıkışını veya motor fazını koparıp karşılaştır.']}
 ];
 for(const s of specs){
  const l=L.byId[s.id],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)continue;
  p.components=s.parts;
  p.wires=s.lines.map(([a,ap,b,bp],i)=>({
   id:'sc'+s.n+'-motor-timing-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Zamanlama sinyalini gerçek katalog terminalinde izle.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
    why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=s.parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='cpu'||c.id==='timer'||c.id==='pulse'?'Sanal zaman davranışını oluşturur.':
   c.id==='stop'?'Sanal kumanda durdurma deneyini gösterir.':
   c.id==='motor'?'Sanal K1 üzerinden üç faz alır.':'Katalog terminaliyle bağlı bir kumanda parçasıdır.'}));
  l.summary=s.story+' Fiziksel güvenlik, gerçek motor duruşu ve Windows/3D kabulü bekliyor.';
  l.explanation=s.story;
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:s.heading,
   virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,
   pedagogicalAcceptance:false,steps:s.steps,observations:[
   'Özgün Simulation.solve ve 703 bileşenli katalogla zaman, STOP ve hat kopmaları hedefli sınandı.',
   'Fiziksel şebekeye uygulanmaz; termik güvenlik, gerçek motor duruşu ve Windows/3D kabulü yapılmadı.'],
   repairModel:'MOTOR-'+s.id.toUpperCase()+'-'+s.kind+'-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='VIRTUAL_MOTOR_TIMING_PHYSICAL_WINDOWS_3D_AND_PEDAGOGICAL_ACCEPTANCE_PENDING';
  v.componentIds=s.parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_TIMED_CHECKS_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.scMotorTimingRepair=s.kind;
 }
})();

// SC981: tested catalogue star/delta circuit already correct; repair only
// the source's incorrect quiz phase and the generic non-teaching guide.
(()=>{
 const l=L.byId['motor-start-speed-outline-035'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
    p.tutorialLesson?.phase!=='quiz'||p.components.find(c=>c.id==='sw')?.typeId!=='packet-star-delta'||
    p.components.find(c=>c.id==='motor')?.typeId!=='motor-y-d'||
    r?.independentPedagogicalAcceptance===true)return;
 p.tutorialLesson={...p.tutorialLesson,id:l.id,phase:'demo',step:0};
 l.summary='Sanal S1 paket şalterinde önce 0, sonra yıldız (Y), ardından üçgen (Δ) konumlarını karşılaştır. Yıldızda U2/V2/W2 uçları ortaklaşır; üçgende sargı uçları çapraz bağlanır. Bu devrede geçiş otomatik yapılmaz; motorun gerçek kalkış akımı, yükü ve mekanik duruşu modellenmez.';
 l.explanation='Altı uçlu motoru iki farklı bağlantıyla düşün. Yıldızda üç sargının uçları ortak bir noktada buluşur. Üçgende uçlar kapalı bir halka oluşturur. Sanal şalterin Y ve Δ konumlarında motor simgesinin bağlantı durumunu izle; gerçek motorda güvenli kalkış için bu çizim tek başına yeterli değildir.';
 l.quiz={question:'Bu sanal paket şalter Y konumuna alındığında motorun alt sargı uçlarında hangi bağlantı görülür?',
  options:['U2, V2 ve W2 ortak yıldız noktası olur','Her sargı ayrı kalır','Şalter motoru otomatik ters yönde çalıştırır'],
  answer:0,why:'Simülasyondaki yıldız köprüleri U2, V2 ve W2 uçlarını ortak düğümde birleştirir.'};
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
  heading:'Aynı motor, yıldız ve üçgen arasında nasıl değişir?',
  virtualOnly:true,canonicalGraphUnchanged:true,
  physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
  steps:[
   'Önce yalnız sanal S1 şalteri 0 konumundayken motor etkin olmamalı.',
   'S1 sanal Y konumunda U2, V2 ve W2 uçlarının birleşmesini izle.',
   'S1 sanal Δ konumundayken köprü düzeninin değiştiğini ve üçgen bağlantıyı gör.',
   'Sanal L2 kablosunu ayırınca hem Y hem Δ konumunda motor etkinliği kalkmalı.',
   'Sanal U2/V2/W2 ucunun kablosunu çıkarıp eksik bağlantının etkisini incele.'
  ],
  observations:[
   'Özgün Simulation.solve ve 703 katalog bileşeniyle 0/Y/Δ, kopuk faz ve kopuk sargı uçları doğrulandı.',
   'Kalkış akımı, motor yükü, fiziksel geçiş süresi, PE güvenliği veya Windows/3D kabulü gösterilmez.'
  ],repairModel:'SC981-STAR-DELTA-CANONICAL-TEACHING-PHASE-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='REAL_MOTOR_TRANSITION_AND_WINDOWS_3D_PEDAGOGICAL_ACCEPTANCE_PENDING';
 v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
 v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
 v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_STAR_DELTA_POSITIVE_NEGATIVE_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc981TeachingRepair='SC981-STAR-DELTA-CANONICAL-TEACHING-PHASE-V1';
})();

 // SC983 (motor-direct-power-outline-115): virtual clock memory + permission.
 // Replaces unrelated three-phase contactor template without touching other lessons.
 (() => {
  const id='motor-direct-power-outline-115',l=L.byId[id],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ext={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 V DC / 0 V',65,305),
   C('cpu','plc-0-0-documented','PLC1','CPU1211C sanal sistem/saat bellek örneği',680,310,
    {plcProgram:'clock-memory-sc983',plcClockPeriodMs:1000}),
   C('enable','selector-no','S1','Sanal saat belleği etkinleştir',340,75),
   C('reset','push-nc','S0','Sanal bellek sıfırlama NC',350,480),
   C('pulse','lamp-green','H1','Q0 · sanal 1 Hz saat işareti',1150,220),
   C('ready','lamp-red','H2','Q1 · sanal çalışma izni',1150,450)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],
   ['g','M','cpu','X10:6'],
   ['g','P','enable','13'],['enable','14','cpu','X10:7'],
   ['g','P','reset','21'],['reset','22','cpu','X10:8'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['cpu','X12:3','pulse','X1'],['pulse','X2','g','M'],
   ['cpu','X12:4','ready','X1'],['ready','X2','g','M']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
   id:'sc983-clock-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Özgün katalogda CPU güç, DI veya DQ bağlantısı.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='cpu'?'Sanal saat biti ve çalışma iznini iki ayrı PLC çıkışında gösterir.':
   c.id==='enable'?'İzni açıp kapatır; saat başlangıcını sıfırlar.':
   c.id==='reset'?'Bellek çıkışını durdurup izin verilince yeniden başlatır.':
   c.id==='pulse'?'Sanal 1 Hz saat bitinin açık ve kapalı yarı periyotlarını gösterir.':
   c.id==='ready'?'Saat izninin etkin kaldığını gösterir.':
   'Sanal PLC deneyinin katalog terminali.'}));
  l.summary='Bu sanal PLC örneğinde S1 açılınca Q0 saat biti bir saniyelik çevrimde yanıp söner. Q1 iznin açık olduğunu gösterir. RESET, CPU/çıkış besleme kaybı ve kablo kesintisinin etkisini ayrı ayrı izle. Bunlar donanımdaki gerçek M bellek adresleri veya üretici tarama süresi ölçümü değildir.';
  l.explanation='Bir okul zili gibi düşün: izin anahtarını açınca küçük bir işaret düzenli yanıp söner. H1 saat ritmini, H2 ise iznin açık kaldığını anlatır. RESET bu ritmi durdurur. Gerçek PLC bellek adresleri, LAD ve tarama süreleri ayrıca öğretilip doğrulanmalıdır.';
  l.quiz={question:'Bu sanal PLC saat örneğinde Q1 sabit yanarken Q0 neden aralıklı yanar?',
   options:['Q0 periyodik saat bitini, Q1 çalışma iznini temsil eder.',
    'Q0 motorun gerçek hızını ölçer.','PE kablosu her saniye yer değiştirir.'],
   answer:0,why:'Saat biti periyodiktir; izin biti etkinlik sürdükçe açık kalır.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Sabit izin, yanıp sönen saat biti',
   virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['Önce CPU X10 beslemesi, X10:6 giriş ortak ucu ve X12 çıkış bankını incele.',
    'S1 sanal izin seçicisini aç. H1 ritimle yanıp sönerken H2 açık kalır.',
    '0,5 saniye arayla H1 durumlarını; sabit H2 durumunu karşılaştır.',
    'S0 RESET butonunu kullan: iki gösterge de sönmeli.',
    'PLC bank beslemesini veya Q0 hattını kopar. Göstergeyi tekrar incele.',
    'Besleme yeniden geldiğinde yeni izin seçimi gerektiğini gözlemle.'],
   observations:['Özgün 703 katalog elemanlı Simulation.solve ile dönem, RESET, besleme kaybı ve kablo kopması sınanır.',
    'Üretici sistem bellek adresi, gerçek PLC scan, Windows/3D, fiziksel ve bağımsız kabul açık.'],
   repairModel:'SC983-PLC-VIRTUAL-CLOCK-MEMORY-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='ORIGINAL_CLOCK_MEMORY_ADDRESS_PLC_SCAN_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(x=>x.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC983_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc983ClockRepair='SC983-PLC-VIRTUAL-CLOCK-MEMORY-V1';
 })();


 // SC986 limited virtual time window: KT1 starts at 1s, KT2 ends at 3s.
 (() => {
 const l=L.byId['motor-direct-power-outline-116'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='main-contact')||
    !p.components.some(c=>c.typeId==='motor-3p')||
    r?.independentPedagogicalAcceptance===true)return;
 const C=(id,typeId,ref,label,x,y,ext={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
 const parts=[
  C('g','supply-3p','G1','Sanal üç faz ve N',65,370),
  C('stop','push-nc','S0','Sanal STOP / sıfırlama',220,70),
  C('start','push-no','S1','Anlık START',420,70),
  C('arm','coil-relay','KA1','Çevrim izni KA1',670,90),
  C('hold','contact-no','KA1','KA1 mühürleme',460,250),
  C('feed','contact-no','KA1','KA1 zamanlayıcı beslemesi',470,460),
  C('tDelay','coil-delay-on','KT1','KT1 1 s gecikmeli başlatma',780,490,{delayValue:1,delayUnit:'sec'}),
  C('tStop','coil-delay-on','KT2','KT2 3 s sonunda durdurma',950,500,{delayValue:3,delayUnit:'sec'}),
  C('t1NO','contact-no','KT1','KT1 gecikmeli NO',875,150),
  C('t2NC','contact-nc','KT2','KT2 gecikmeli NC',1090,160),
  C('coil','coil-contactor','K1','K1 sanal motor bobini',1200,160),
  C('main','main-contact','K1','K1 sanal motor güç',1140,680),
  C('motor','motor-3p','M1','Sanal üç faz motor',1450,690,{motorConnection:'star'})
 ];
 const graph=[
  ['g','L1','stop','21'],['stop','22','start','13'],['start','14','arm','A1'],
  ['stop','22','hold','13'],['hold','14','arm','A1'],['arm','A2','g','N'],
  ['stop','22','feed','13'],['feed','14','tDelay','A1'],['feed','14','tStop','A1'],
  ['tDelay','A2','g','N'],['tStop','A2','g','N'],
  ['stop','22','t1NO','13'],['t1NO','14','t2NC','21'],
  ['t2NC','22','coil','A1'],['coil','A2','g','N'],
  ['g','L1','main','1'],['main','2','motor','U'],
  ['g','L2','main','3'],['main','4','motor','V'],
  ['g','L3','main','5'],['main','6','motor','W'],['g','PE','motor','PE']
 ];
 p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({
  id:'sc986-window-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  color:'#43857f',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
  tutorialWhy:'İki zaman rölesinin gerçek katalog terminali.'}));
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=parts.map(c=>({id:c.id,label:c.label,why:
  c.id==='tDelay'?'Başlangıçtan ilk saniyeyi sayar.':
  c.id==='tStop'?'Üç saniyelik toplam sanal süreyi sayar.':
  c.id==='t1NO'?'İlk gecikme sonrası motor izni.':
  c.id==='t2NC'?'Üç saniye sonunda motor iznini keser.':
  c.id==='hold'?'START bırakıldığında zaman çevrimini tutar.':
  'Sanal derste kullanılan katalog bileşeni.'}));
 l.summary='START ardından 1 saniye beklensin, sonra motor 2 saniye çalışsın ve üçüncü saniyede dursun. STOP sıfırlar; bırakılınca motor kendiliğinden başlamaz. Bu özgün kaynak devrenin aynısı değil, sınırlı bir sanal zaman penceresi örneğidir.';
 l.explanation='Bir makinenin hazırlanmasını düşün: START ile önce ilk saniye sayılır, motor bekler. İkinci saniyede çalışır. Üçüncü saniye sonunda durur. Yeni çalıştırma için önce sıfırla, sonra tekrar START ver.';
 l.quiz={question:'Bu sanal zaman penceresinde START sonrası ikinci saniyede motor ne yapar?',
  options:['Çalışır; KT1 süresi dolmuştur fakat KT2 henüz dolmamıştır.',
   'STOP girişini otomatik değiştirir.','PE motor hızını artırır.'],
  answer:0,why:'Birinci saniyeden sonra KT1 izin verir, üçüncü saniyede KT2 keser.'};
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
  heading:'Bir saniye bekle, iki saniye çalış, sonra dur',
  virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
  physicalTestAccepted:false,pedagogicalAcceptance:false,
  steps:['START verip bırak, KA1 mühürleme durumunu gözlemle.',
   'İlk saniye boyunca motor sanal olarak durmalı.',
   'İkinci saniyede motor çalışır; KT2 hâlâ sayar.',
   'Üçüncü saniyede motor durmalı, tekrar kendi kendine başlamamalı.',
   'STOP ile çevrimi sıfırla; yeni START gereksinimini kontrol et.',
   'Bir sanal motor fazını ya da KT1 çıkışını koparıp karşılaştır.'],
  observations:['Özgün Simulation.solve ve 703 elemanlı katalogla zaman çizelgesi ve negatif durumlar sınandı.',
   'KT2 beslemesi koparsa sanal motor durmayabilir; bu bir güvenlik devresi değildir.',
   'Gerçek motor dinamiği, üretici devresi, Windows/3D ve bağımsız kabul açık.'],
  repairModel:'SC986-TWO-TON-TIMED-MOTOR-WINDOW-V1'};
 const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='ORIGINAL_EXERCISE_TIMER_PHYSICAL_WINDOWS_3D_PEDAGOGY_PENDING';
 v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
 v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC986_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc986TimedWindowRepair='SC986-TWO-TON-TIMED-MOTOR-WINDOW-V1';
 })();


 // SC988 single-bit PLC comparison; narrow opt-in replaces an unrelated motor template.
 (() => {
 const l=L.byId['motor-direct-power-outline-118'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
 const C=(id,typeId,ref,label,x,y,extra={})=>({
  id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
 const parts=[
  C('g','supply-dc-plus','G1','Sanal 24 V DC / 0 V',65,310),
  C('cpu','plc-0-0-documented','PLC1','Sanal 1 bit karşılaştırması',700,300,
   {plcProgram:'compare-bits-sc988'}),
  C('a','selector-no','S1','A giriş biti 0/1',335,90),
  C('b','selector-no','S2','B giriş biti 0/1',330,485),
  C('gt','lamp-green','H1','A büyük B',1160,110),
  C('eq','lamp-red','H2','A eşit B',1160,330),
  C('lt','lamp-red','H3','A küçük B',1160,550)
 ];
 const graph=[
  ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],
  ['g','M','cpu','X10:6'],['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
  ['g','P','a','13'],['a','14','cpu','X10:7'],
  ['g','P','b','13'],['b','14','cpu','X10:8'],
  ['cpu','X12:3','gt','X1'],['gt','X2','g','M'],
  ['cpu','X12:4','eq','X1'],['eq','X2','g','M'],
  ['cpu','X12:5','lt','X1'],['lt','X2','g','M']
 ];
 p.components=parts;
 p.wires=graph.map(([a,ap,b,bp],i)=>({
  id:'sc988-bit-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  color:'#43857f',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
  tutorialWhy:'PLC giriş veya çıkışının katalog terminalini tanı.'}));
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=parts.map(c=>({id:c.id,label:c.label,why:
  c.id==='cpu'?'A ve B sanal bitlerini karşılaştırır.':
  c.id==='a'||c.id==='b'?'0 veya 1 girişini değiştirir.':
  c.id==='g'?'PLC ve çıkış bankını besler.':'Karşılaştırmanın bir sonucunu gösterir.'}));
 l.summary='Sanal A ve B girişlerini 0 veya 1 yapıp büyük, eşit, küçük karşılaştırmasını gör. Bu sadece tek bitlik karşılaştırmadır; çok bitli PLC sayı işlemleri veya analog karşılaştırma değildir.';
 l.explanation='İki anahtarı küçük birer sayı gibi düşün. İkisi de kapalıysa 0=0, ikisi de açıksa 1=1. Yalnız A açıkken A>B, yalnız B açıkken A<B ışığı yanar. Böylece PLC nin nasıl karar verdiğini üç ayrı lambada izle.';
 l.quiz={question:'Sanal A=0 ve B=1 iken hangisi doğrudur?',
  options:['A < B','A = B','A > B'],answer:0,
  why:'Bir bitlik sayı karşılaştırmasında sıfır birden küçüktür.'};
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
  heading:'İki sanal biti karşılaştır',virtualOnly:true,
  canonicalGraphUnchanged:false,fullyRich:false,
  physicalTestAccepted:false,pedagogicalAcceptance:false,
  steps:['İki anahtar kapalıyken sadece eşitlik ışığını izle.',
   'Yalnız A girişini aç: büyük işareti yanar.',
   'Yalnız B girişini aç: küçük işareti yanar.',
   'Her ikisini aç: yeniden eşitlik ışığı yanar.',
   'A/B girişi, PLC beslemesi veya bir lamba kablosunu koparıp sonucu karşılaştır.'],
  observations:['703 bileşenli gerçek katalog ve özgün Simulation.solve ile dört giriş ve kablo kesintisi sınandı.',
   'Giriş kablosu kopunca bit 0 görünebilir; bu bir emniyet kontrolü değildir.',
   'WORD/INT sayısal işlemleri, donanım, Windows/3D ve bağımsız kabul açık.'],
  repairModel:'SC988-PLC-VIRTUAL-BIT-COMPARE-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='MULTIBIT_NUMERIC_COMPARISON_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
 v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
 v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC988_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc988BitCompareRepair='SC988-PLC-VIRTUAL-BIT-COMPARE-V1';
 })();


 // SC989: limited virtual carpark, capacity 2, edge-counted in/out.
 (() => {
 const l=L.byId['motor-direct-power-outline-119'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
 const C=(id,typeId,ref,label,x,y,ext={})=>({
  id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ext});
 const parts=[
  C('g','supply-dc-plus','G1','Sanal 24 V ve 0 V',70,320),
  C('cpu','plc-0-0-documented','PLC1','Otopark iki araçlık sanal sayaç',740,350,
   {plcProgram:'parking-counter-sc989',plcParkingCapacity:2}),
  C('entry','push-no','S1','Giriş algılandı / anlık',325,70),
  C('exit','push-no','S2','Çıkış algılandı / anlık',325,300),
  C('reset','push-nc','S0','Sayaç STOP/RESET NC',325,530),
  C('free','lamp-green','H1','Boş yer var',1250,240),
  C('full','lamp-red','H2','Otopark dolu',1250,510)
 ];
 const graph=[
  ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
  ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
  ['g','P','entry','13'],['entry','14','cpu','X10:7'],
  ['g','P','exit','13'],['exit','14','cpu','X10:8'],
  ['g','P','reset','21'],['reset','22','cpu','X10:9'],
  ['cpu','X12:3','free','X1'],['free','X2','g','M'],
  ['cpu','X12:4','full','X1'],['full','X2','g','M']
 ];
 p.components=parts;
 p.wires=graph.map(([src,sp,dst,dp],i)=>({
  id:'sc989-park-'+(i+1),from:{c:src,p:sp},to:{c:dst,p:dp},
  color:'#43857f',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:'Sanal '+src+'/'+sp+' → '+dst+'/'+dp,
  tutorialWhy:'Katalogdaki giriş, çıkış ve besleme terminali.'}));
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=parts.map(c=>({id:c.id,label:c.label,why:
  c.id==='cpu'?'Giriş ve çıkış olaylarını ayrı ayrı sayar; en fazla iki araç tutar.':
  c.id==='entry'?'Her yeni basış bir araç girişini anlatır.':
  c.id==='exit'?'Her yeni basış bir araç çıkışını anlatır.':
  c.id==='reset'?'Sayacı sıfırlar ve yeni basışa hazırlanır.':
  'Sanal otopark durumunu gösterir veya devreyi besler.'}));
 l.summary='Sanal iki araçlık otopark: giriş düğmesi yeni araçları sayar; çıkış düğmesi azaltır. İki araçta dolu ışığı yanar; üçüncü giriş sayacı büyütmez. RESET ve besleme kaybı sayacı sıfırlar. Bu gerçek bariyer güvenlik kontrolü veya saha sensörü modeli değildir.';
 l.explanation='İki araçlık küçük bir otopark düşün. Bir araç girince bir yer kalır. İkinci araç girince dolu tabelası yanar. Üçüncüye yer açılmaz. Araç çıkınca yeniden boş yer oluşur. Düğmeyi basılı tutmak birden fazla araç saymaz; her yeni basış bir olaydır.';
 l.quiz={question:'İki araç doluyken yeni giriş olayı sanal sayacı kaça çıkarır?',
  options:['2 de kalır','3 olur','Sıfırlanır'],answer:0,
  why:'Sanal sayaç en fazla iki yer tutar; gerçek bariyer kilidi ayrıca gerekir.'};
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
  heading:'İki yerlik sanal otopark sayacı',virtualOnly:true,
  canonicalGraphUnchanged:false,fullyRich:false,
  physicalTestAccepted:false,pedagogicalAcceptance:false,
  steps:['Başlangıçta boş yer H1 ışığını gör.',
   'Giriş butonuna bas ve bırak; bir araç sayılır.',
   'Yeniden basıp bırak; ikinci araçta dolu H2 yanar.',
   'Üçüncü girişte kapasiteyi aşmadığını doğrula.',
   'Çıkış butonuna basıp bırak; bir yer açılır.',
   'RESET ve kablo kopmalarıyla değişen durumu karşılaştır.'],
  observations:['Özgün 703 katalog tanımı ve Simulation.solve ile kapasite, tek olay, RESET ve kopuk bağlantı sınanır.',
   'Giriş/çıkış algılayıcısının gerçek donanımı, bariyer hareketi, saha güvenliği ve gerçek PLC programı modellenmez.',
   'Windows/3D ve bağımsız pedagojik kabul açık.'],
  repairModel:'SC989-PLC-VIRTUAL-CARPARK-COUNTER-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='REAL_PARKING_BARRIER_SENSOR_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
 v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
 v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC989_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc989VirtualParkingRepair='SC989-PLC-VIRTUAL-CARPARK-COUNTER-V1';
 })();


 // SC990 limited two-motor comparison: a single-bit comparison, NOT real safety control.
 (() => {
 const l=L.byId['motor-direct-power-outline-120'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    r?.independentPedagogicalAcceptance===true)return;
 const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,
  rotation:0,state:false,address:'',note:'',...extra});
 const parts=[
  C('g','supply-dc-plus','G1','Sanal 24 V kumanda beslemesi',65,340),
  C('power','supply-3p','G2','Sanal üç faz ve koruma hattı',75,825),
  C('cpu','plc-0-0-documented','PLC1','İki motor sanal karşılaştırma PLC',710,350,
   {plcProgram:'compare-two-motors-sc990'}),
  C('a','selector-no','S1','Sanal A komutu / 0 veya 1',305,85),
  C('b','selector-no','S2','Sanal B komutu / 0 veya 1',330,330),
  C('stop','push-nc','S0','Sanal STOP / iki motor kapat',330,545),
  C('coil1','coil-contactor','K1','K1 motor-1 bobini',1170,100),
  C('main1','main-contact','K1','K1 motor-1 güç kontağı',1120,665),
  C('motor1','motor-3p','M1','M1 sanal üç faz motor',1440,665,{motorConnection:'star'}),
  C('coil2','coil-contactor','K2','K2 motor-2 bobini',1170,330),
  C('main2','main-contact','K2','K2 motor-2 güç kontağı',1120,945),
  C('motor2','motor-3p','M2','M2 sanal üç faz motor',1440,945,{motorConnection:'star'})
 ];
 const graph=[
  ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
  ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
  ['g','P','a','13'],['a','14','cpu','X10:7'],
  ['g','P','b','13'],['b','14','cpu','X10:8'],
  ['g','P','stop','21'],['stop','22','cpu','X10:9'],
  ['cpu','X12:3','coil1','A1'],['coil1','A2','g','M'],
  ['cpu','X12:4','coil2','A1'],['coil2','A2','g','M'],
  ...['1','2'].flatMap(n=>[
   ['power','L1','main'+n,'1'],['main'+n,'2','motor'+n,'U'],
   ['power','L2','main'+n,'3'],['main'+n,'4','motor'+n,'V'],
   ['power','L3','main'+n,'5'],['main'+n,'6','motor'+n,'W'],
   ['power','PE','motor'+n,'PE']])
 ];
 p.components=parts;
 p.wires=graph.map(([src,sp,dst,dp],i)=>({
  id:'sc990-motor-'+(i+1),from:{c:src,p:sp},to:{c:dst,p:dp},
  color:'#43857f',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:'Sanal '+src+'/'+sp+' → '+dst+'/'+dp,
  tutorialWhy:'PLC karşılaştırma ve kontaktörün gerçek katalog uçları.'}));
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=parts.map(c=>({id:c.id,label:c.label,why:
  c.id==='cpu'?'İki sanal bit değerini karşılaştırarak yalnız tek kontaktöre izin verir.':
  c.id==='stop'?'Her iki motoru durdurup yeni komut için sıfırlama ister.':
  c.id.startsWith('motor')?'Üç fazın tamamı ve kontaktör izni varsa çalışır.':
  c.id.startsWith('main')?'Bağlı bobinle üç fazı motora aktarır.':
  'Motoru seçen sanal komut, kumanda veya besleme parçası.'}));
 l.summary='Sanal A ve B bitlerini karşılaştır: A>B iken K1 ve M1, A<B iken K2 ve M2 çalışır; A=B iken iki motor da durur. STOP, çakışan komut ve besleme kaybı iki motoru durdurur. Gerçek endüstriyel karşılaştırma, mekanik kilitleme veya motor güvenliği değildir.';
 l.explanation='İki motorun sırayla seçildiği küçük bir örnek düşün. A 1, B 0 ise birinci motoru; A 0, B 1 ise ikinci motoru seçersin. İki komut aynıysa hiçbir motor çalışmaz. Bir çakışma ya da STOP sonrası anahtarları önce kapatıp yeni komut vermelisin. İki motorun aynı anda çalışmamasının nedenini böyle görebilirsin.';
 l.quiz={question:'Sanal A=1, B=1 olduğunda hangi motor çalışmalıdır?',
  options:['Hiçbiri','Yalnız M1','İki motor birden'],answer:0,
  why:'Eşit iki bit için ne A>B ne de A<B koşulu doğrudur.'};
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
  heading:'Bir koşul, bir motor',virtualOnly:true,canonicalGraphUnchanged:false,
  fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
  steps:['İki komut kapalıyken iki motorun da durduğunu gör.',
   'Yalnız A açılınca M1 çalışır, M2 durur.',
   'A yı kapat, sonra yalnız B yi aç; bu kez M2 çalışır.',
   'İki komutu birlikte aç: çakışma iki motoru da durdurur.',
   'Komutları sıfırlayıp STOP bas; durma ve yeniden kurma davranışını incele.',
   'K1 veya K2 bobin kablosu, üç faz veya PLC bank beslemesini kopar.'],
  observations:['Özgün Simulation.solve ve 703 elemanlı katalogla iki motor, STOP, kilit ve negatif hat kopması sınanır.',
   'Üretici PLC kodu, gerçek aşırı akım koruması, mekanik kilit, endüstriyel motor güvenliği ve Windows/3D kabulü yoktur.'],
  repairModel:'SC990-TWO-MOTOR-VIRTUAL-BIT-COMPARE-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';
 v.titleTopologyIssue='PHYSICAL_CONTACTOR_INTERLOCK_MOTOR_PROTECTION_PLC_WORD_WINDOWS_3D_PEDAGOGY_PENDING';
 v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
 v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC990_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v.sc990TwoMotorRepair='SC990-TWO-MOTOR-VIRTUAL-BIT-COMPARE-V1';
 })();


 // SC992: 1-bit binary addition, replacing an unrelated motor source topology.
 (() => {
  const l=L.byId['motor-direct-power-outline-122'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ex={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 V / 0 V',60,325),
   C('cpu','plc-0-0-documented','PLC1','PLC · 1 bitlik ikili toplama',715,330,{plcProgram:'binary-add-1bit-sc992'}),
   C('a','selector-no','S1','A sayısı · 0 veya 1',345,100),
   C('b','selector-no','S2','B sayısı · 0 veya 1',340,515),
   C('sum','lamp-green','H1','Toplamın birler biti',1180,170),
   C('carry','lamp-red','H2','Elde · ikiler biti',1180,485)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['g','P','a','13'],['a','14','cpu','X10:7'],
   ['g','P','b','13'],['b','14','cpu','X10:8'],
   ['cpu','X12:3','sum','X1'],['sum','X2','g','M'],
   ['cpu','X12:4','carry','X1'],['carry','X2','g','M']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc992-binary-'+(i+1),
   from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Toplama girişi veya sonucu; gerçek katalogdaki PLC terminalidir.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='cpu'?'İki 0/1 bitini toplar, sonuç ve elde bitini ayırır.':
   c.id==='a'||c.id==='b'?'Toplanacak sayıyı 0 veya 1 yapar.':
   c.id==='sum'?'Toplamın birler bitini gösterir.':
   c.id==='carry'?'1+1 sonucundaki elde bitini gösterir.':
   'Sanal PLC nin giriş ve çıkış bankını besler.'}));
  l.summary='İki sanal 0/1 sayısını topla. H1 birler bitini, H2 elde bitini gösterir. 1+1 sonucu ikili 10 yani onluk 2 olur. Bu, PLC nin yalnız bir bitlik sanal toplama örneğidir; WORD/INT, çıkarma, çarpma ve gerçek üretici yazılımı değildir.';
  l.explanation='İki anahtarın küçük birer sayı olduğunu düşün: kapalıysa sıfır, açıksa bir. Önce 0+1 deneyip H1 i izle. Ardından ikisini de aç: 1+1=2 olur, birler lambası söner ve elde lambası yanar. İki lambayı birlikte okuyunca ikili sayıyı görürsün.';
  l.quiz={question:'İki sanal giriş de 1 iken ikili toplamın bitleri nedir?',
   options:['H1=0, H2=1 (ikili 10)','H1=1, H2=0','H1=1, H2=1'],answer:0,
   why:'1+1 ikili 10 eder: birler sıfır, elde bir.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Bir artı bir, ikili sayı olarak iki',virtualOnly:true,
   canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['İki anahtar kapalı: 0+0 için iki lamba da sönük.', 
    'Yalnız A açık: 1+0 için birler H1 yanık.',
    'Yalnız B açık: 0+1 için H1 yanık.',
    'Her iki anahtar açık: 1+1 için yalnız elde H2 yanık.',
    'PLC çıkış bankının beslemesini, bir çıkışı veya B girişini ayırıp sonucu gözle.'],
   observations:['Özgün 703 bileşenli katalog ve Simulation.solve ile dört ikili toplama durumu ve negatif bağlantı sınanır.',
    'Kopuk giriş 0 gibi algılanabilir; güvenli algılama ve gerçek PLC veri tipi işlevleri bu sanal örnekte yoktur.',
    'Gerçek PLC, Windows/3D ve bağımsız pedagojik kabul bekliyor.'],
   repairModel:'SC992-VIRTUAL-ONE-BIT-BINARY-ADDER-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='FULL_MATH_OPERATIONS_PLC_DATA_TYPES_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC992_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc992BinaryArithmetic='SC992-VIRTUAL-ONE-BIT-BINARY-ADDER-V1';
 })();

 // SC993: two real catalogue resistors in series, an ammeter and parallel voltmeter.
 (() => {
  const l=L.byId['motor-direct-power-outline-123'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ex={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 V DC kaynak',60,335),
   C('r1','resistor','R1','R1 · 1 kΩ',550,215,{resistance:1000}),
   C('r2','resistor','R2','R2 · 1 kΩ',860,215,{resistance:1000}),
   C('am','meter-ammeter','A1','Seri akım ölçümü',310,225),
   C('vm','meter-voltmeter','V1','R1 üzerindeki gerilim',600,485)
  ];
  const graph=[
   ['g','P','am','1'],['am','2','r1','1'],['r1','2','r2','1'],
   ['r2','2','g','M'],['vm','1','r1','1'],['vm','2','r1','2']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc993-ohm-'+(i+1),
   from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Ampermetre seri, voltmetre paralel bağlanır; katalog uçlarını karşılaştır.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='g'?'Sanal 24 V kaynak; iki seri dirence gerilim verir.':
   c.id==='r1'||c.id==='r2'?'Toplam dirence 1000 ohm ekler.':
   c.id==='am'?'Aynı seri koldan geçen akımı ölçer.':
   'R1 üzerindeki gerilim düşümünü paralel ölçer.'}));
  l.summary='24 V sanal DC kaynakta R1=1 kΩ ve R2=1 kΩ seri bağlandı: toplam 2 kΩ; beklenen akım 12 mA, R1 üzerinde yaklaşık 12 V. Akımı seri ampermetre, gerilimi paralel voltmetreyle karşılaştır. Ölçüm sanaldır, gerçek donanım testi değildir.';
  l.explanation='İki dirençten oluşan bir akım yolunu düşün. Birincisi 1000, ikincisi 1000 ohm: toplam 2000 ohm. 24 volt bölü 2000 ohm bize 0,012 amper, yani 12 mA verir. Akımı ölçen aleti yola seri koy; R1 gerilimini ölçen aleti iki ucuna paralel bağla. R2 değerini büyütürsen akım azalır; kabloyu koparırsan seri akım kesilir.';
  l.quiz={question:'Sanal 24 V ve iki adet seri 1 kΩ dirençte akım yaklaşık kaçtır?',
   options:['12 mA','24 A','2 A'],answer:0,
   why:'Toplam direnç 2 kΩ, 24/2000 = 0,012 A.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Dirençler toplansın, akım hesaplansın',
   virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['Sanal R1 ve R2 yi seri, ampermetreyi aynı akım yoluna bağla.',
    'Voltmetreyi yalnız R1 uçlarına paralel bağla.',
    '24 V / (1000+1000) Ω hesabıyla yaklaşık 12 mA bekle.',
    'R2 yi 2 kΩ yap: toplam 3 kΩ olduğunda akımın yaklaşık 8 mA a düştüğünü gözle.',
    'R2 çıkışını kopar: akım sıfıra yaklaşır; ölçü aletini yanlışlıkla kaynağa paralel bağlama.'],
   observations:['Gerçek katalog terminal ve özgün Simulation.solve sayısal akım modeli pozitif/negatif kontrol edilir.',
    'İdeal kaynak ve sanal ölçüm; fiziksel direnç toleransı, ısınma, Windows/3D ve bağımsız kabul bekliyor.'],
   repairModel:'SC993-NATIVE-SERIES-RESISTANCE-OHM-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_MEASUREMENT_TOLERANCE_POWER_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC993_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc993SeriesOhmRepair='SC993-NATIVE-SERIES-RESISTANCE-OHM-V1';
 })();


 // SC995 — MOVE, SHL and ROL for a documented, deliberately two-bit virtual word.
 (() => {
  const l=L.byId['motor-direct-power-outline-125'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ex={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 V / 0 V',55,335),
   C('cpu','plc-0-0-documented','PLC1','2 bit MOVE / SHL / ROL',795,365,{plcProgram:'shift-rotate-2bit-sc995'}),
   C('bit0','selector-no','S1','Giriş bit0 (birler)',330,75),
   C('bit1','selector-no','S2','Giriş bit1 (ikiler)',330,245),
   C('shift','selector-no','S3','SHL · sola kaydırma',330,425),
   C('rotate','selector-no','S4','ROL · sola döndürme',330,600),
   C('out0','lamp-green','H1','Çıkış bit0 (birler)',1240,195),
   C('out1','lamp-red','H2','Çıkış bit1 (ikiler)',1240,505)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['g','P','bit0','13'],['bit0','14','cpu','X10:7'],
   ['g','P','bit1','13'],['bit1','14','cpu','X10:8'],
   ['g','P','shift','13'],['shift','14','cpu','X10:9'],
   ['g','P','rotate','13'],['rotate','14','cpu','X10:10'],
   ['cpu','X12:3','out0','X1'],['out0','X2','g','M'],
   ['cpu','X12:4','out1','X1'],['out1','X2','g','M']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc995-word-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'PLC giriş veya çıkışını gerçek katalog terminali üzerinden izle.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
   why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='cpu'?'İki bit için MOVE kopyası, SHL ve ROL sonuçlarını hesaplar.':
   c.id==='bit0'||c.id==='bit1'?'İki bitlik başlangıç sayısını oluşturur.':
   c.id==='shift'||c.id==='rotate'?'İşlemi seçer; ikisi aynı anda seçilmez.':
   c.id==='out0'||c.id==='out1'?'İşlenen sonucun bir bitini gösterir.':
   'CPU ve çıkış bankının sanal 24 V beslemesi.'}));
  l.summary='Sanal 2 bitlik sayı için normal durumda MOVE (kopyala), SHL (bir kez sola kaydır, üst biti at) veya ROL (bir kez sola döndür, üst biti alta taşı) seç. Bit0/bit1 çıkış lambalarında sonucu karşılaştır. Bu örnek gerçek PLC nin tam WORD, SHIFT ve ROTATE komut seti değildir.';
  l.explanation='İki lambayı küçük bir ikili sayı gibi düşün: sağdaki bit0, soldaki bit1. 01 sayısını MOVE edersen 01 kalır. Bir kez sola kaydırırsan 10 olur. 10 sayısını sola döndürürsen üstteki 1 başa gelir ve 01 olur. SHL ile ROL aynı şey değildir: kaydırmada taşan bit kaybolur, döndürmede geri gelir.';
  l.quiz={question:'İki bitlik 10 sayısına sola döndürme (ROL 1) yaparsan sonuç nedir?',
   options:['01','00','10'],answer:0,
   why:'Üstteki 1 bit0 konumuna geri döner, alttaki 0 bit1 konumuna çıkar.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'İki bitlik sayıyı taşı, kaydır, döndür',virtualOnly:true,
   canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['S1 açık, S2 kapalı: bit1 bit0 = 01; SHL ve ROL kapalıyken MOVE sonucu 01.',
    'S3 SHL açıkken aynı 01 girişinin çıkışı 10 olur.',
    'S3 kapat, S4 ROL aç: aynı 01 sayısının döndürme sonucu da 10.',
    'Giriş 10 yap: SHL sonucunu 00, ROL sonucunu 01 olarak karşılaştır.',
    'SHL ve ROL anahtarlarını birlikte aç: çakışma nedeniyle iki çıkış da sönük.',
    'PLC çıkışı, giriş biti veya çıkış bankı beslemesini koparıp negatif sonucu izle.'],
   observations:['Sadece iki bitlik simülasyon; üst bit SHL işleminde atılır, ROL işleminde yeniden alt bite döner.',
    'Özgün Simulation.solve ve 703 katalog ile iki bitin bütün değerleri ve bağlantı kopuklukları sınanır.',
    'Gerçek PLC veri tipleri, güvenlik, Windows/3D ve bağımsız kabul bekliyor.'],
   repairModel:'SC995-VIRTUAL-2BIT-MOVE-SHIFT-ROTATE-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='WORD_REGISTER_FULL_INSTRUCTION_SET_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC995_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc995TwoBitWords='SC995-VIRTUAL-2BIT-MOVE-SHIFT-ROTATE-V1';
 })();

 // SC996 — preset switch is copied at START into a virtual TON's 1s or 2s preset.
 (() => {
  const l=L.byId['motor-direct-power-outline-126'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(c=>c.typeId==='motor-3p')||
     !p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ex={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal 24 V / 0 V',55,335),
   C('cpu','plc-0-0-documented','PLC1','MOVE → TON sanal süre kopyası',780,330,{plcProgram:'move-timer-preset-sc996'}),
   C('start','push-no','S1','START · yeni sanal çevrim',325,90),
   C('stop','push-nc','S0','STOP · NC durdurma',325,320),
   C('preset','selector-no','S2','MOVE süresi · 1 sn / 2 sn',325,555),
   C('done','lamp-green','H1','Ayarlanan süre tamamlandı',1250,225),
   C('timing','lamp-red','H2','Sanal zamanlayıcı etkin',1250,495)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['g','P','start','13'],['start','14','cpu','X10:7'],
   ['g','P','stop','21'],['stop','22','cpu','X10:8'],
   ['g','P','preset','13'],['preset','14','cpu','X10:9'],
   ['cpu','X12:3','done','X1'],['done','X2','g','M'],
   ['cpu','X12:4','timing','X1'],['timing','X2','g','M']
  ];
  p.components=parts;p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc996-ton-'+(i+1),
   from:{c:a,p:ap},to:{c:b,p:bp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Zaman seçimi, STOP ve çıkışların gerçek katalog bağlantısı.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
   why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='cpu'?'START anında seçilen süreyi sanal zamanlayıcı belleğine MOVE ile kopyalar.':
   c.id==='start'?'Yeni zaman sayımı başlatmak için basılır.':
   c.id==='stop'?'STOP basılınca sanal çevrimi sıfırlar; tekrar START gerekir.':
   c.id==='preset'?'Başlamadan önce 1 veya 2 saniyelik süreyi seçtirir.':
   c.id==='done'?'Kopyalanmış süre dolunca yanar.':
   c.id==='timing'?'Başlayan sanal zaman çevriminin etkin olduğunu gösterir.':
   'PLC ve çıkış bankının sanal beslemesi.'}));
  l.summary='MOVE ile 1 saniyelik veya 2 saniyelik sanal TON ayarını START anında kopyala. Sayaç çalışırken anahtarı değiştirmek mevcut çevrimi etkilemez. H2 çevrim başlayınca, H1 seçilmiş süre dolunca yanar. STOP ve güç kaybı sayımı sıfırlar; bu üretici PLC zamanlama hassasiyeti değildir.';
  l.explanation='Bir mutfak zamanlayıcısını düşün. Önce 1 ya da 2 saniyeyi seçiyorsun. START deyince PLC seçilen süreyi kendi sayacına kopyalıyor. Bu arada seçme anahtarına dokunsan bile devam eden sayım değişmiyor: yeni ayar bir sonraki START ile alınacak. STOP ise sayımı sıfırlıyor.';
  l.quiz={question:'START ile 2 saniye kopyalanıp sayım başlatıldıktan sonra seçim 1 saniyeye çevrilirse ne olur?',
   options:['Mevcut çevrim yine 2 saniyeyi tamamlar.','Mevcut çevrim hemen 1 saniyeye düşer.','PLC güç bankı kapanır.'],
   answer:0,why:'MOVE ayarı START anında kopyalar; sonraki anahtar değişimi ancak yeni çevrimde geçerlidir.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'MOVE ile süreyi kopyala ve say',virtualOnly:true,
   canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['Önce 1 saniye seç; START a bas. H2 etkin, H1 başlangıçta sönük.',
    'START ı bırak; 1 saniye dolunca H1 yanar.',
    'STOP a bas; iki lamba da söner. STOP ve START bırakılınca yeniden hazır.',
    '2 saniyeyi seçip START a bas; 1 saniyede H1 hâlâ sönük, 2 saniyede yanık.',
    'Sayım sürerken süre seçimini değiştir: devam eden kopyalanmış süre değişmez.',
    'START basılıyken STOP a bas veya PLC beslemesini kes; kendiliğinden yeniden başlamayı kontrol et.'],
   observations:['Özgün Simulation.solve/703 katalogla iki süre, START kenarı, durdurma, kopuk kablo ve güç kaybı sınanır.',
    'Bu, tarama zamanı, gerçek üretici TON ve emniyet durdurma donanımı için kabul değildir.',
    'Windows/3D ve bağımsız pedagojik kabul bekliyor.'],
   repairModel:'SC996-VIRTUAL-MOVE-TON-PRESET-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='HARDWARE_REAL_TON_TIMING_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC996_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc996MoveTonPreset='SC996-VIRTUAL-MOVE-TON-PRESET-V1';
 })();


 (()=>{const l=L.byId['motor-direct-power-outline-129'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
 !p.components.some(c=>c.typeId==='motor-3p')||!p.components.some(c=>c.typeId==='main-contact')||
 r?.independentPedagogicalAcceptance===true)return;
 const info={"heading":"NTC ile sıcaklığa bağlı sanal fan","repairModel":"SC999-NATIVE-NTC-BRIDGE-PLC-FAN-V1","pending":"CALIBRATED_PLC_ADC_THERMAL_PROTECTION_WINDOWS_3D_PEDAGOGY_PENDING","summary":"NTC sıcaklık sensörünü 10 V / 10 kΩ bölücü ve PLC analog girişine bağla. Sanal fan 36°C üstünde çalışır, 30°C altında durur. STOP, sensör kopması ve PLC besleme kaybında durur. Bu analog karşılaştırıcı gerçek PLC ADC veya sertifikalı termal emniyet değildir.","explanation":"Bir odadaki fanı düşün: NTC ısındıkça direnci azalır ve köprü gerilimi yükselir. 36 dereceye ulaşınca K1 fanı çalıştırır. 30 dereceye soğuyana kadar çalışmayı sürdürür; böylece eşikte sürekli açılıp kapanmaz. Kopan sensör veya STOP da fanı durdurur.","quiz":{"question":"NTC hattı koparsa sanal fan nasıl davranır?","options":["Durur","Daima çalışır","Hızını artırır"],"answer":0,"why":"Sanal sensörün köprü bağlantısı geçerli değilse PLC motoru bırakır."},"steps":["25°C'de fan kapalıdır.","36–40°C'de motor kontaktörü çalışır.","34°C'de histerezis nedeniyle çalışmayı sürdürür.","30°C'de durur.","STOP ve sensör kablosunu kopararak güvenli sanal duruşu gözle."],"observations":["NTC'nin direnç modeli özgün katalog ve DTSDeviceBehavior üzerinden kullanılır.","Bağlantısı doğrulanan 10 V köprü sanal analog eşiğe çevrilir; gerçek PLC ADC, fiziksel emniyet veya donanım testi değildir.","Windows/3D ve bağımsız kabul REVIEW."],"purpose":{"ntc":"Sıcaklığa göre direnci değişir.","rtemp":"10 kΩ gerilim bölücü.","cpu":"Sanal sıcaklık eşik kontrolü.","stop":"Sanal durdurma.","coil":"K1 motor bobini.","main":"K1 üç faz kontağı.","motor":"Fan motoru."}};const components=[{"id":"g","typeId":"supply-dc-plus","ref":"G1","label":"PLC kumanda 24 V","x":70,"y":280,"rotation":0,"state":false,"address":"","note":""},{"id":"g10","typeId":"load-cell-excitation","ref":"G2","label":"NTC 10 V köprü","x":70,"y":600,"rotation":0,"state":false,"address":"","note":""},{"id":"rtemp","typeId":"resistor","ref":"R1","label":"Köprü sabit 10 kΩ","x":360,"y":560,"rotation":0,"state":false,"address":"","note":"","resistance":10000},{"id":"ntc","typeId":"sensor-ntc","ref":"B1","label":"NTC ortam sıcaklığı","x":500,"y":730,"rotation":0,"state":false,"address":"","note":"","temperature":25},{"id":"cpu","typeId":"plc-0-0-documented","ref":"PLC1","label":"Sanal NTC soğutma PLC","x":740,"y":360,"rotation":0,"state":false,"address":"","note":"","plcProgram":"temperature-ntc-sc999"},{"id":"stop","typeId":"push-nc","ref":"S0","label":"STOP NC","x":350,"y":90,"rotation":0,"state":false,"address":"","note":""},{"id":"coil","typeId":"coil-contactor","ref":"K1","label":"K1 fan bobini","x":1170,"y":180,"rotation":0,"state":false,"address":"","note":""},{"id":"main","typeId":"main-contact","ref":"K1","label":"K1 güç kontağı","x":1150,"y":780,"rotation":0,"state":false,"address":"","note":""},{"id":"power","typeId":"supply-3p","ref":"G3","label":"Sanal üç faz besleme","x":70,"y":970,"rotation":0,"state":false,"address":"","note":""},{"id":"motor","typeId":"motor-3p","ref":"M1","label":"Sanal soğutma fanı","x":1450,"y":810,"rotation":0,"state":false,"address":"","note":"","motorConnection":"star"}];const graph=[["g","P","cpu","X10:1"],["g","M","cpu","X10:2"],["g","M","cpu","X10:6"],["g","P","cpu","X12:1"],["g","M","cpu","X12:2"],["g","P","stop","21"],["stop","22","cpu","X10:7"],["g10","P","rtemp","1"],["rtemp","2","ntc","1"],["ntc","2","g10","M"],["rtemp","2","cpu","X11:2"],["g10","M","cpu","X11:1"],["cpu","X12:3","coil","A1"],["coil","A2","g","M"],["power","L1","main","1"],["main","2","motor","U"],["power","L2","main","3"],["main","4","motor","V"],["power","L3","main","5"],["main","6","motor","W"],["power","PE","motor","PE"]];
 p.components=components;
 p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc999-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  color:'#43857f',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:'Gerçek katalogdaki devre terminalini izle.'}));
 delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=components.map(c=>({id:c.id,label:c.label,why:info.purpose[c.id]||'Sanal besleme, sinyal veya motor bağlantısı.'}));
 l.summary=info.summary;l.explanation=info.explanation;l.quiz=info.quiz;
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:info.heading,
  virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
  steps:info.steps,observations:info.observations,repairModel:info.repairModel};
 const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';v.titleTopologyIssue=info.pending;
 v.componentIds=components.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
 v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC999_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;v['sc999Repair']=info.repairModel;
 })();

 (()=>{const l=L.byId['motor-direct-power-outline-130'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
 !p.components.some(c=>c.typeId==='motor-3p')||!p.components.some(c=>c.typeId==='main-contact')||
 r?.independentPedagogicalAcceptance===true)return;
 const info={"heading":"V20 ile zaman kontrollü sanal motor hızı","repairModel":"SC1000-NATIVE-V20-TIMED-RAMP-V1","pending":"EXTERNAL_PLC_TIMED_PROFILE_PHYSICAL_SPEED_FEEDBACK_WINDOWS_3D_PENDING","summary":"SINAMICS V20 yerleşik simülasyonunda ilk beş saniye hedef 15 Hz, ardından 35 Hz olarak ayarlanır. Native V20 kalkış rampası, üç faz çıkışı ve motor devri birlikte hesaplanır. Bu sanal MOP profili gerçek PLC zamanlayıcı veya fiziksel hız ölçümü değildir.","explanation":"Bir fanın hızını yavaşça değiştirdiğimizi düşün. Önce V20'ye 15 Hz hedef veriyoruz. Beşinci saniyeden sonra 35 Hz hedef geliyor. Motor aniden hızlanmaz; sürücünün kendi rampasıyla yeni frekansa ve devir hızına yaklaşır.","quiz":{"question":"Beşinci saniyeden sonraki sanal hedef frekans nedir?","options":["35 Hz","15 Hz","0 Hz"],"answer":0,"why":"Zaman profili 5. saniyede ikinci hedefe geçer."},"steps":["Giriş ile sürücünün sanal motor güç bağlantılarını incele.","15 Hz hedefi ve motorun rampasını izle.","Beşinci saniyede hedefin 35 Hz oluşunu kontrol et.","Motor frekansı ile hesaplanan RPM artışını karşılaştır.","Giriş gücünü veya motor fazını kopararak sonuçları sınayarak karşılaştır."],"observations":["V20.tick ve özgün Simulation.solve motor Hz/RPM aynı devrede hesaplanır.","Bu gerçek sürücü PWM modeli, saha emniyeti veya fiziksel motor kabulü değildir.","Windows/3D ve bağımsız kabul REVIEW."],"purpose":{"drive":"V20 MOP referansı, native sürücü rampası.","motor":"Sanal asenkron motorun Hz ve devrini gösterir.","power":"Sanal tek faz besleme ve PE."}};const components=[{"id":"power","typeId":"supply-1p","ref":"G1","label":"Sanal AC sürücü beslemesi","x":80,"y":180,"rotation":0,"state":false,"address":"","note":""},{"id":"drive","typeId":"sinamics-v20-1p","ref":"U1","label":"V20 zaman kontrollü MOP","x":580,"y":300,"rotation":0,"state":false,"address":"","note":"","timedSpeedDemo":"sc1000","v20":{"params":{"P0700":1,"P1000":1,"P1040":15,"P1120":2,"P1121":2},"run":true,"reverse":false,"load":50,"temperature":30}},{"id":"motor","typeId":"motor-3p","ref":"M1","label":"V20 çıkışında sanal motor","x":1110,"y":500,"rotation":0,"state":false,"address":"","note":"","motorConnection":"star"}];const graph=[["power","L","drive","L1"],["power","N","drive","N"],["power","PE","drive","PE"],["power","PE","drive","PE2"],["drive","U","motor","U"],["drive","V","motor","V"],["drive","W","motor","W"],["motor","U2","motor","V2"],["motor","V2","motor","W2"],["power","PE","motor","PE"]];
 p.components=components;
 p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc1000-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  color:'#43857f',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:'Gerçek katalogdaki devre terminalini izle.'}));
 delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=components.map(c=>({id:c.id,label:c.label,why:info.purpose[c.id]||'Sanal besleme, sinyal veya motor bağlantısı.'}));
 l.summary=info.summary;l.explanation=info.explanation;l.quiz=info.quiz;
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:info.heading,
  virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
  steps:info.steps,observations:info.observations,repairModel:info.repairModel};
 const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';v.titleTopologyIssue=info.pending;
 v.componentIds=components.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
 v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC1000_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;v['sc1000Repair']=info.repairModel;
 })();

 // Scoped real source repair for SC1001
 (()=>{const l=L.byId['motor-direct-power-outline-131'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||!p.components.some(c=>c.typeId==='motor-3p')||r?.independentPedagogicalAcceptance===true)return;
 const d={"id":"motor-direct-power-outline-131","seq":1001,"parts":[{"id":"g","typeId":"supply-dc-plus","ref":"G1","label":"Sanal 24 V/0 V PLC","x":70,"y":335,"rotation":0,"state":false,"address":"","note":""},{"id":"power","typeId":"supply-3p","ref":"G2","label":"Sanal üç faz","x":70,"y":960,"rotation":0,"state":false,"address":"","note":""},{"id":"cpu","typeId":"plc-0-0-documented","ref":"PLC1","label":"Kapı iki yön sanal PLC","x":710,"y":345,"rotation":0,"state":false,"address":"","note":"","plcProgram":"bus-door-virtual-sc1001"},{"id":"open","typeId":"push-no","ref":"S1","label":"Kapıyı aç komutu","x":325,"y":90,"rotation":0,"state":false,"address":"","note":""},{"id":"close","typeId":"push-no","ref":"S2","label":"Kapıyı kapat komutu","x":325,"y":260,"rotation":0,"state":false,"address":"","note":""},{"id":"stop","typeId":"push-nc","ref":"S0","label":"STOP","x":325,"y":445,"rotation":0,"state":false,"address":"","note":""},{"id":"limOpen","typeId":"push-nc","ref":"B1","label":"Tam açık sınırı NC","x":325,"y":630,"rotation":0,"state":false,"address":"","note":""},{"id":"limClose","typeId":"push-nc","ref":"B2","label":"Tam kapalı sınırı NC","x":325,"y":805,"rotation":0,"state":false,"address":"","note":""},{"id":"obstacle","typeId":"push-nc","ref":"B3","label":"Sanal engel algısı NC","x":345,"y":1020,"rotation":0,"state":false,"address":"","note":""},{"id":"coilOpen","typeId":"coil-contactor","ref":"K1","label":"Kapı açma kontaktörü","x":1160,"y":120,"rotation":0,"state":false,"address":"","note":""},{"id":"mainOpen","typeId":"main-contact","ref":"K1","label":"Açma yönü faz kontağı","x":1170,"y":790,"rotation":0,"state":false,"address":"","note":""},{"id":"coilClose","typeId":"coil-contactor","ref":"K2","label":"Kapı kapama kontaktörü","x":1160,"y":350,"rotation":0,"state":false,"address":"","note":""},{"id":"mainClose","typeId":"main-contact","ref":"K2","label":"Ters yön faz kontağı","x":1160,"y":1030,"rotation":0,"state":false,"address":"","note":""},{"id":"motor","typeId":"motor-3p","ref":"M1","label":"Sanal kapı tahrik motoru","x":1480,"y":925,"rotation":0,"state":false,"address":"","note":"","motorConnection":"star"}],"graph":[["g","P","cpu","X10:1"],["g","M","cpu","X10:2"],["g","M","cpu","X10:6"],["g","P","cpu","X12:1"],["g","M","cpu","X12:2"],["g","P","open","13"],["open","14","cpu","X10:7"],["g","P","close","13"],["close","14","cpu","X10:8"],["g","P","stop","21"],["stop","22","cpu","X10:9"],["g","P","limOpen","21"],["limOpen","22","cpu","X10:10"],["g","P","limClose","21"],["limClose","22","cpu","X10:11"],["g","P","obstacle","21"],["obstacle","22","cpu","X10:12"],["cpu","X12:3","coilOpen","A1"],["coilOpen","A2","g","M"],["cpu","X12:4","coilClose","A1"],["coilClose","A2","g","M"],["power","L1","mainOpen","1"],["mainOpen","2","motor","U"],["power","L2","mainOpen","3"],["mainOpen","4","motor","V"],["power","L3","mainOpen","5"],["mainOpen","6","motor","W"],["power","L1","mainClose","5"],["mainClose","6","motor","W"],["power","L2","mainClose","3"],["mainClose","4","motor","V"],["power","L3","mainClose","1"],["mainClose","2","motor","U"],["power","PE","motor","PE"]],"code":"SC1001-VIRTUAL-BUS-DOOR-REVERSING-MOTOR-V1","summary":"Sanal otobüs kapısı kontrolünde AÇ/KAPAT komutları, açık/kapalı sınır anahtarları, STOP ve engel kontağıyla K1/K2 ters yön kontaktörleri işletilir. İki kontaktör aynı anda çekmez. Bu hareket, sıkışma koruması veya yolcu güvenliği sertifikası değildir.","explanation":"Kapının iki yönü olduğunu düşün: AÇ komutu motoru bir yönde döndürür, KAPAT komutu ters yönde. Tam açık sınırına gelince açma durur; tam kapalıya gelince kapama durur. STOP veya engel uyarısında iki yönde de yeni komut için önce düğmeleri bırakırız. Bu sadece sanal kumanda mantığıdır.","quiz":{"question":"Sanal kapı kapanırken engel NC kontağı kesilirse ne olur?","options":["Kapatma kontaktörü bırakır.","İki kontaktör birden çeker.","Motor kendiliğinden hızlanır."],"answer":0,"why":"Kontrol yazılımı engel veya STOP durumunda yön iznini keser; gerçek kapı güvenliği ayrıca gerekir."},"heading":"Sanal kapıyı aç, kapat ve sınırda durdur","steps":["AÇ ve KAPAT bırakılıyken motor durmalı.","AÇ komutu sanal motoru açma yönünde döndürmeli.","Tam açık sınırı devreye girince açma durmalı.","Komutu bıraktıktan sonra KAPAT ile ters yönü gör.","STOP ve engel kontağı kapatma komutunu da kesmeli.","Komut çakışması ve motor fazı kopmalarını sınayıp sonucu karşılaştır."],"observations":["Özgün Simulation.solve ve 703 katalogla iki kontaktör, faz yönü, STOP, sınır ve kopuk bağlantılar sınanır.","Kapı kanadı, gerçek sıkışma koruması, çift kanallı emniyet ve mekanik limit güvenliği modelleri mevcut değildir.","Windows/3D ve bağımsız pedagojik kabul REVIEW."],"pending":"DOOR_ANTI_PINCH_HARDWARE_INTERLOCK_PHYSICAL_WINDOWS_3D_PEDAGOGY_PENDING","purpose":{"cpu":"Açma/kapama karşılıklı kilitli komut hafızası.","open":"Açma emri.","close":"Kapama emri.","stop":"STOP.","limOpen":"Açık sınır bilgisi.","limClose":"Kapalı sınır bilgisi.","obstacle":"Sanal engel durumu.","coilOpen":"K1 açma bobini.","coilClose":"K2 kapama bobini.","mainOpen":"Üç faz açma kontaktörü.","mainClose":"İki fazı tersleyen K2.","motor":"Tek üç faz sanal kapı motoru."}};p.components=d.parts;
 p.wires=d.graph.map(([a,ap,b,bp],i)=>({id:'sc1001-wire-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'CONTROL',size:'1.5',points:[],
 tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:'Özgün katalog terminalini tanı.'}));
 delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=p.components.map(c=>({id:c.id,label:c.label,why:d.purpose[c.id]||'Sanal güç veya kontrol bileşeni.'}));
 l.summary=d.summary;l.explanation=d.explanation;l.quiz=d.quiz;
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:d.heading,virtualOnly:true,
 canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
 steps:d.steps,observations:d.observations,repairModel:d.code};
 const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';v.titleTopologyIssue=d.pending;v.componentIds=p.components.map(c=>c.typeId);
 v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
 v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC1001_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;v['sc1001Repair']=d.code;
 })();

 // Scoped real source repair for SC1002
 (()=>{const l=L.byId['plc-hardware-programming-outline-062'],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==3||!p.components.some(c=>c.typeId==='coil-contactor')||r?.independentPedagogicalAcceptance===true)return;
 const d={"id":"plc-hardware-programming-outline-062","seq":1002,"parts":[{"id":"g","typeId":"supply-dc-plus","ref":"G1","label":"Sanal 24 V / 0 V","x":60,"y":270,"rotation":0,"state":false,"address":"","note":""},{"id":"cpu","typeId":"plc-0-0-documented","ref":"PLC1","label":"PLC START–STOP bellek","x":700,"y":345,"rotation":0,"state":false,"address":"","note":"","plcProgram":"plc-basic-latch-sc1002"},{"id":"start","typeId":"push-no","ref":"S1","label":"START anlık komut","x":310,"y":95,"rotation":0,"state":false,"address":"","note":""},{"id":"stop","typeId":"push-nc","ref":"S0","label":"STOP NC","x":310,"y":395,"rotation":0,"state":false,"address":"","note":""},{"id":"coil","typeId":"coil-contactor","ref":"K1","label":"PLC Q0 kumanda bobini","x":1170,"y":90,"rotation":0,"state":false,"address":"","note":""},{"id":"run","typeId":"lamp-green","ref":"H1","label":"Q0 çalışma komut göstergesi","x":1170,"y":345,"rotation":0,"state":false,"address":"","note":""},{"id":"ready","typeId":"lamp-red","ref":"H2","label":"PLC hazır, Q0 kapalı","x":1170,"y":580,"rotation":0,"state":false,"address":"","note":""}],"graph":[["g","P","cpu","X10:1"],["g","M","cpu","X10:2"],["g","M","cpu","X10:6"],["g","P","cpu","X12:1"],["g","M","cpu","X12:2"],["g","P","start","13"],["start","14","cpu","X10:7"],["g","P","stop","21"],["stop","22","cpu","X10:8"],["cpu","X12:3","coil","A1"],["coil","A2","g","M"],["cpu","X12:3","run","X1"],["run","X2","g","M"],["cpu","X12:4","ready","X1"],["ready","X2","g","M"]],"code":"SC1002-NATIVE-PLC-START-STOP-LATCH-V1","summary":"Gerçek katalog CPU 1211C PLC nin DC beslemesini, X10 dijital girişlerini ve X12 çıkışlarını bağla. START ile Q0 bobini ve komut lambası tutulur; STOP keser. Q1 sanal hazır lambasıdır. PLC gücü veya çıkış bankı kesilince yeniden START gerekir. Bu sadece sanal PLC programı, gerçek safety-PLC değildir.","explanation":"Küçük bir makine başlattığımızı düşün. START butonuna bir an basıyoruz; PLC çalışma kararını bellekte tuttuğu için elimizi çeksek de Q0 lambası yanıyor. STOP'a basınca kapanıyor. Enerji kesilip geldiğinde ise kendiliğinden başlamasın: yeniden START vereceğiz.","quiz":{"question":"Sanal PLC STOP sonrası START hâlâ basılıyken yeniden çalışır mı?","options":["Hayır, önce START bırakılıp tekrar basılmalıdır.","Evet, STOP bırakılır bırakılmaz çalışır.","Q1 çıkışı motoru tersine çevirir."],"answer":0,"why":"STOP veya besleme kaybından sonra yeni komut için bırakma ve yeni START kenarı gerekir."},"heading":"Sanal PLC START–STOP çalışma belleği","steps":["Önce PLC X10 ve X12 beslemelerinin katalog girişlerini tanı.","STOP sağlıklıyken ve START bırakılmışken hazır ışığı görülür.","START'a bir kez bas; K1 ve Q0 göstergesinin çalıştığını izle.","START'ı bırakınca çıkış açık kalmalı.","STOP'a bas; bobin bırakır, tekrar START için önce düğmeyi bırak.","PLC beslemesini veya Q0 bobin hattını koparıp negatif durumları karşılaştır."],"observations":["Özgün Simulation.solve ve 703 katalogda CPU, 1M/3M, X10 DI ve X12 DQ terminalleri test edilir.","Bu demo gerçek PLC LAD indirme, endüstriyel emniyet veya Windows/3D kabulü değildir."],"pending":"PHYSICAL_PLC_LAD_RELAY_INTERLOCK_WINDOWS_3D_PEDAGOGY_PENDING","purpose":{"cpu":"Gerçek katalog terminal sırası ve sanal PLC çalışma hafızası.","start":"Q0'ı açan anlık komut.","stop":"Belleği sıfırlayan NC STOP.","coil":"Q0 bobini.","run":"Q0 komut göstergesi.","ready":"STOP sağlıklı ve Q0 kapalı gösterge."}};p.components=d.parts;
 p.wires=d.graph.map(([a,ap,b,bp],i)=>({id:'sc1002-wire-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'CONTROL',size:'1.5',points:[],
 tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:'Özgün katalog terminalini tanı.'}));
 delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=p.components.map(c=>({id:c.id,label:c.label,why:d.purpose[c.id]||'Sanal güç veya kontrol bileşeni.'}));
 l.summary=d.summary;l.explanation=d.explanation;l.quiz=d.quiz;
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:d.heading,virtualOnly:true,
 canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
 steps:d.steps,observations:d.observations,repairModel:d.code};
 const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';v.titleTopologyIssue=d.pending;v.componentIds=p.components.map(c=>c.typeId);
 v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
 v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC1002_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;v['sc1002Repair']=d.code;
 })();
 L.practiceGuideBatchN=stats;
 L._practiceGuideBatchN=true;
})(typeof window==='undefined'?globalThis:window);
