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

 // SC999 targeted physical polarity fix: align true NTC/10k divider with analog proxy.
 (() => {
  const l=L.byId['motor-direct-power-outline-129'],p=l?.project,rv=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==10||p?.wires?.length!==21||
     p.components.find(c=>c.id==='ntc')?.typeId!=='sensor-ntc'||
     p.components.find(c=>c.id==='rtemp')?.typeId!=='resistor'||
     rv?.independentPedagogicalAcceptance===true)return;
  const edits=[
   [['g10','P','rtemp','1'],['g10','P','ntc','1']],
   [['rtemp','2','ntc','1'],['ntc','2','rtemp','1']],
   [['ntc','2','g10','M'],['rtemp','2','g10','M']],
   [['rtemp','2','cpu','X11:2'],['rtemp','1','cpu','X11:2']]
  ];
  const find=e=>p.wires.filter(w=>w.from?.c===e[0]&&w.from?.p===e[1]&&w.to?.c===e[2]&&w.to?.p===e[3]);
  if(!edits.every(([old])=>find(old).length===1))return;
  for(const [old,to] of edits){
   const w=find(old)[0];w.from={c:to[0],p:to[1]};w.to={c:to[2],p:to[3]};
   w.tutorialHint='Sanal '+to[0]+'/'+to[1]+' → '+to[2]+'/'+to[3];
   w.tutorialWhy='NTC üst kolda, 10 kΩ altta: analog düğüm sıcaklık arttıkça yükselir.';
  }
  l.steps=p.wires.map((w,i)=>({...l.steps[i],from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy}));
  l.summary='10 V ölçüm bölücüsünde NTC üst kol, 10 kΩ alt kol olarak bağlanır; X11:2 gerilimi ortam ısındıkça yükselir. PLC 36 °C üstünde fanı açar, 30 °C altında kapatır. STOP veya kopuk ölçümde fan kapalı kalır. Saha emniyeti ve gerçek ADC kalibrasyonu REVIEW.';
  l.explanation='Sıcaklık yükseldikçe NTC nin direnci azalır. Üstte NTC, altta 10 kΩ sabit direnç olduğunda ikisinin birleştiği ölçüm noktasının gerilimi yükselir. PLC bu gerilime göre 36 derecede fanı açar; 30 dereceye düşünce durdurur. Böylece gerçek bağlantının yönü ile ekrandaki sanal ölçüm aynı fiziksel fikri anlatır.';
  if(l.practiceGuide){
   l.practiceGuide.repairModel='SC999-NTC-DIVIDER-POLARITY-V2';
   l.practiceGuide.observations=[...(l.practiceGuide.observations||[]),
    'NTC besleme tarafına, sabit 10 kΩ direnç dönüş tarafına taşındı; analog gerilim yönü ideal bölücü hesabıyla eşleşir.',
    'İdeal sıcaklık->gerilim hesabı gerçek üretici ADC taramasının ve fiziksel güvenliğin yerine geçmez.'];
  }
  const v=rv||(l.pedagogyReview={});v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_ADC_CALIBRATION_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.sc999NtcPolarityRepair='SC999-NTC-DIVIDER-POLARITY-V2';
  v.independentPedagogicalAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;
  v.targetedNativePositiveNegative='SC999_DIVIDER_POLARITY_ORIGINAL_SIMULATION_SOLVE_703_PASS';
 })();

 // Targeted V20 native applications SC1016/SC1017. No other lesson is rewritten.
 (() => {
  const definitions=[
   {id:'motor-direct-power-outline-133',seq:1016,mode:'bop',
    model:'SC1016-NATIVE-V20-CN001-BOP-V1',
    heading:'SINAMICS V20 ile BOP panelinden sanal kontrol',
    summary:'SINAMICS V20 Cn001 (BOP) sanal uygulaması: 230 V tek faz giriş, V20 U/V/W üç faz çıkış, yıldız bağlanmış motor ve PE hattı. V20 panelindeki RUN/STOP ve 20 Hz referansı ile özgün sürücü rampası ve motor devri gözlemlenir. Fiziksel bağlantı veya güvenlik kabulü değildir.',
    explanation:'Sürücü panelini bir kumanda ekranı gibi düşün. Önce 20 Hz hız değerini ayarla, sonra panelden RUN ver. Motor aniden tam hıza çıkmaz; sürücü kendi rampasıyla ilerler. STOP seçince yine kontrollü biçimde yavaşlar. Burada butonlar sürücü panelinin sanal komutlarıdır.',
    quiz:{question:'V20 BOP paneli 20 Hz hedefliyken RUN komutu verildiğinde motor hızına ne olur?',
     options:['Sürücünün rampasıyla zaman içinde 20 Hz hedefine yaklaşır.','Bir anda mekanik olarak 50 Hz olur.','STOP otomatik RUN üretir.'],answer:0,
     why:'Yerleşik V20 modeli frekansı P1120 ve P1121 rampalarına göre değiştirir.'},
    steps:['Sanal V20 panelinde Cn001 ve 20 Hz MOP referansını kontrol et.',
     'V20 nin tek faz güç ve üç faz motor terminal bağlantılarını gör.',
     'Sürücünün sanal BOP RUN komutunu aç; hedef 20 Hz ve yükselen motor frekansını karşılaştır.',
     'Birkaç saniye sonra motor hızının hedefe yaklaşmasını izle.',
     'BOP STOP komutunu ver; motor hızı sıfıra iner.',
     'Bir motor fazını veya V20 güç bağlantısını koparıp geçersiz bağlantıyı gözle.'],
    observations:['Özgün V20.tick, Simulation.solve ve 703 katalog ile sınırlı native sanal test yapılır.',
     '230 V fiziksel kurulum, sürücü parametreleme cihaz QA ve Windows/3D bağımsız kabul değildir.'],
    pending:'REAL_BOP_HARDWARE_STO_WINDOWS_3D_PEDAGOGY_PENDING'},
   {id:'motor-direct-power-outline-134',seq:1017,mode:'fixed',
    model:'SC1017-NATIVE-V20-CN003-FIXED-SPEED-V1',
    heading:'SINAMICS V20 Cn003 sabit frekans seçimi',
    summary:'V20 Cn003 sabit frekans makrosuyla sanal kumanda: DI1 RUN, DI2 10 Hz, DI3 15 Hz, DI4 25 Hz. Dijital girişlerin kombinasyonu seçili sabit frekansları toplar; yerleşik V20 rampası motor devrine uygulanır. Bu gerçek üretici devre/kablolama kabulü değildir.',
    explanation:'Üç hız tuşu olan bir fanı düşün. RUN açıkken ilk tuş 10 Hz, ikincisi 15 Hz, üçüncüsü 25 Hz seçer. İki hız tuşunu aynı anda açarsan Cn003 doğrudan toplama mantığı seçilen referansları toplar, fakat sürücünün izin verdiği üst sınıra uyar. Her değişimi sanal sürücünün rampasıyla izle.',
    quiz:{question:'V20 Cn003 doğrudan sabit hız seçimi kullanırken DI2 ve DI3 birlikte etkinse hedef frekans kaç Hz olur?',
     options:['25 Hz','15 Hz','10 Hz'],answer:0,
     why:'P1001=10 Hz ve P1002=15 Hz birlikte seçildiğinde toplanır.'},
    steps:['V20 Cn003 makrosunda DI1=RUN, DI2/3/4 sabit frekans girişlerini gör.',
     'RUN ve birinci hız anahtarını aç: 10 Hz hedefini bekle.',
     'Birinci hızı bırakıp ikinciyi seç: 15 Hz hedefini izle.',
     'DI2 ve DI3 birlikte etkinse referans 25 Hz olur.',
     'RUN kapat: motor rampayla durmalı.',
     'DI kablosunu, motor fazını veya güç girişini koparıp olumsuz örneği karşılaştır.'],
    observations:['Özgün V20 sürücü modeli Cn003 makrosunun DI ve P1000 sabit hız hesabı ile kullanılır.',
     'Sanal çıkış frekansı motor torku veya üretici donanım güvenlik kabulü değildir.'],
    pending:'REAL_DI_CONTROL_HARDWARE_STO_WINDOWS_3D_PEDAGOGY_PENDING'}
  ];
  const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const common=[
   ['ps','L','vfd','L1'],['ps','N','vfd','N'],['ps','PE','vfd','PE'],
   ['vfd','U','m','U'],['vfd','V','m','V'],['vfd','W','m','W'],
   ['m','U2','m','V2'],['m','V2','m','W2'],['vfd','PE2','m','PE']
  ];
  for(const info of definitions){
   const l=L.byId[info.id],p=l?.project,review=l?.pedagogyReview;
   if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||!p.components.some(c=>c.typeId==='main-contact')||
    review?.independentPedagogicalAcceptance===true)continue;
   const v20=info.mode==='bop'?
    {driveControl:'local',driveFrequency:20,driveRun:false}:
    {driveControl:'terminals',v20:{schema:1,macro:'Cn003',params:{
      P0700:2,P1000:3,P1016:1,'P0701':1,'P0702':15,'P0703':16,'P0704':17,
      P1001:10,P1002:15,P1003:25,P1004:50,P1120:10,P1121:10
     },run:false,reverse:false,reset:0,load:50,temperature:30}};
   const parts=[
    C('ps','supply-1p','G1','Sanal 230 V giriş, L/N/PE',70,210),
    C('vfd','sinamics-v20-1p','V20','SINAMICS V20 · '+(info.mode==='bop'?'Cn001 BOP':'Cn003 sabit hız'),640,340,v20),
    C('m','motor-3p','M1','V20 çıkışlı yıldız motor',1170,305)
   ];
   const connections=common.slice();
   if(info.mode==='fixed'){
    parts.push(
     C('run','selector-no','S1','DI1 RUN izin anahtarı',210,530),
     C('s1','selector-no','S2','DI2: 10 Hz seçimi',210,660),
     C('s2','selector-no','S3','DI3: 15 Hz seçimi',210,790),
     C('s3','selector-no','S4','DI4: 25 Hz seçimi',210,920)
    );
    connections.push(['vfd','14','vfd','12']);
    for(const [id,pin] of [['run','8'],['s1','9'],['s2','10'],['s3','11']]){
     connections.push(['vfd','13',id,'13'],[id,'14','vfd',pin]);
    }
   }
   p.components=parts;
   p.wires=connections.map(([a,ap,b,bp],i)=>({id:'sc'+info.seq+'-v20-'+(i+1),
    from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'CONTROL',size:'1.5',points:[],
    tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
    tutorialWhy:'V20 ve motor bağlantısını katalog uçlarıyla eşleştir.'}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:info.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
    why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,why:
    c.id==='ps'?'Sürücünün sanal tek faz besleme uçları.':
    c.id==='vfd'?'Yerleşik V20 sürücü modeli frekans ve motor hızını hesaplar.':
    c.id==='m'?'Sanal sürücünün üç faz çıkışıyla beslenen motor.':
    'Cn003 dijital giriş komutunu seçer.'}));
   l.summary=info.summary;l.explanation=info.explanation;l.quiz=info.quiz;
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:info.heading,virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:info.steps,observations:info.observations,repairModel:info.model};
   const v=review||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';v.titleTopologyIssue=info.pending;
   v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_V20_NATIVE_SC'+info.seq+'_TARGETED_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v['sc'+info.seq+'NativeV20Repair']=info.model;
  }
 })();


 // SC1018–1021: V20 focused real catalogue topology; never edit accepted/quiz records.
 (() => {
 const definitions=[{"seq":1018,"id":"motor-direct-power-outline-135","mode":"external","macro":"Cn006","title":"Harici START/STOP ve iki MOP hız butonu","summary":"Cn006 sanal üç telli kumanda: NC STOP DI1, START DI2, MOP artır DI3 ve azalt DI4. START hafızası ve sürücünün gerçek V20 frekans rampası izlenir. Donanım güvenlik kontrolü değildir.","desc":"Bir atölye fanını düşün. STOP serbestken START'a kısa basarsın. Hızı yükseltmek için artır butonunu, azaltmak için azalt butonunu kullanırsın. STOP'a basınca sürücü yavaşlayıp durur; yeniden çalışması için yeni START gerekir.","quiz":"Cn006'da STOP bırakıldıktan sonra motorun yeniden başlaması için ne gerekir?","answers":["Yeni START basışı","STOP'u bırakmak yeterlidir","Yalnız hız artırma"],"why":"Üç telli START komutu yeni bir kenarla yeniden tetiklenir.","pending":"REAL_Cn006_HARDWARE_MOP_3WIRE_WINDOWS_3D_PEDAGOGY_PENDING"},{"seq":1019,"id":"motor-direct-power-outline-136","mode":"analog","macro":"Cn002","title":"Potansiyometre ile gerçek V20 AI1 sanal hız referansı","summary":"Cn002 V20 AI1 girişine gerçek katalog uçlarından bağlı 10 kΩ sanal potansiyometre; DI1 RUN, analog 0–10 V girişini 0–50 Hz frekansa ölçekler. Özgün V20 rampası kullanılır; gerçek üretici kablo/EMC ve güvenlik kabulü değildir.","desc":"Bir fanın hız düğmesini düşün. Potansiyometre orta konumdayken sanal sürücü yaklaşık 25 Hz ister. Biraz daha açarsan AI1 gerilimi ve hedef hız artar. RUN kapanınca sürücü rampayla durur.","quiz":"Sanal AI1 yaklaşık 5 V iken 0–10 V / 0–50 Hz ayarıyla hedef kaç Hz?","answers":["25 Hz","50 Hz","5 Hz"],"why":"5 V, 10 V tam ölçeğin yarısıdır.","pending":"REAL_ANALOG_EMC_PHYSICAL_WINDOWS_3D_PEDAGOGY_PENDING"},{"seq":1020,"id":"motor-direct-power-outline-137","mode":"direction","macro":"Cn002","title":"Kalıcı RUN ve yön anahtarıyla V20 ileri/geri","summary":"Kalıcı iki konumlu sanal anahtar ile V20 DI2 REVERSE; DI1 RUN, sabit 25 Hz MOP referansı. İleri/geri hedefinin işareti ve özgün sürücünün sıfırdan geçişli rampası sınanır; faz kabloları elle çaprazlanmaz.","desc":"Motor çalışırken yön anahtarını geri konuma almayı düşün. Sürücü önce hızı azaltır, sıfırdan geçer, sonra diğer yönde hızlanır. Bu çalışma sanal sürücü dinamiğidir; mekanik yük ve güvenlik onayı değildir.","quiz":"V20 yön anahtarı terslenince sanal frekans hedefi nasıl değişir?","answers":["İşareti terslenir; rampa sıfırdan geçer.","Motor faz kablosu elle değiştirilir.","Gerilim kesilir."],"why":"Yerleşik V20 sürücüsü ileri ve geri referansları rampayla uygular.","pending":"REAL_DIRECTION_SWITCH_INTERLOCK_MECHANICS_WINDOWS_3D_PEDAGOGY_PENDING"},{"seq":1021,"id":"motor-direct-power-outline-138","mode":"combined","macro":"Cn007","title":"Cn007 üç telli START/STOP + geri komutu + AI1 hız","summary":"Cn007 sanal kontrol: NC STOP DI1, START ileri DI2, geri START DI3 ve 10 kΩ potansiyometre V20 AI1 hız girişinde. Her komut gerçek V20 rampasıyla uygulanır; bu gerçek saha emniyet kilidi değildir.","desc":"Bir taşıma bandını düşün. STOP serbestken ileri butonuna bas, potansiyometreyle hızını ayarla. Geri komutu verirsen sürücü önce yavaşlar ve diğer yönde hızlanır. STOP her iki yönü durdurur; buton basılı tutularak otomatik yeniden başlatma beklenmez.","quiz":"Cn007'de sanal STOP verildiğinde ne olur?","answers":["Çalışma hafızası sıfırlanır ve hız sıfıra iner.","Hız artar.","Geri komutu otomatik başlar."],"why":"Üç telli V20 kumandasında STOP girişinin izni kesilir.","pending":"REAL_3WIRE_ANALOG_DIRECTION_INTERLOCK_WINDOWS_3D_PEDAGOGY_PENDING"}];
 const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:"",note:"",...extra});
 const build=function build(i){
 const base={P0700:2,P1000:i.mode==="external"||i.mode==="direction"?1:2,P0727:i.mode==="external"?3:i.mode==="combined"?2:0,
 P1016:1,P1040:i.mode==="direction"?25:0,P1047:10,P1048:10,P1082:50,P1120:10,P1121:10,P2000:50,
 "P0756.0":0,"P0757.0":0,"P0758.0":0,"P0759.0":10,"P0760.0":100};
 const pins=i.mode==="external"?[2,1,13,14]:i.mode==="combined"?[1,2,12,9]:[1,12,9,10];
 pins.forEach((f,j)=>base["P070"+(j+1)]=f);
 const pieces=[
 C("ps","supply-1p","G1","Sanal tek faz giriş L/N/PE",70,215),
 C("vfd","sinamics-v20-1p","V20","SINAMICS V20 "+i.macro,690,365,{driveControl:"terminals",v20:{schema:1,macro:i.macro,params:base,run:false,reverse:false,reset:0,load:50,temperature:30}}),
 C("m","motor-3p","M1","Yıldız bağlantılı sanal motor",1230,330)
 ];
 const graph=[
 ["ps","L","vfd","L1"],["ps","N","vfd","N"],["ps","PE","vfd","PE"],
 ["vfd","U","m","U"],["vfd","V","m","V"],["vfd","W","m","W"],
 ["m","U2","m","V2"],["m","V2","m","W2"],["vfd","PE2","m","PE"],
 ["vfd","14","vfd","12"]
 ];
 const extra=[];
 const control=(id,type,ref,label,pin,y)=>{pieces.push(C(id,type,ref,label,245,y));graph.push(["vfd","13",id,type==="push-nc"?"21":"13"],[id,type==="push-nc"?"22":"14","vfd",pin]);extra.push(label)};
 if(i.mode==="external"){control("stop","push-nc","S0","STOP NC → DI1","8",520);control("start","push-no","S1","START anlık → DI2","9",655);control("up","push-no","S2","MOP HIZ + → DI3","10",800);control("down","push-no","S3","MOP HIZ − → DI4","11",930);}
 else if(i.mode==="analog"){control("run","selector-no","S1","Kalıcı RUN → DI1","8",610);}
 else if(i.mode==="direction"){control("run","selector-no","S1","Kalıcı RUN → DI1","8",600);control("reverse","selector-no","S2","Kalıcı REVERSE → DI2","9",780);}
 else if(i.mode==="combined"){control("stop","push-nc","S0","STOP NC → DI1","8",540);control("start","push-no","S1","START ileri → DI2","9",665);control("reverse","push-no","S2","START geri → DI3","10",795);}
 if(i.mode==="analog"||i.mode==="combined"){
 pieces.push(C("pot","potentiometer","RV1","AI1 potansiyometresi · 10 kΩ",300,990,{potentiometer:50,potMax:10000}));
 graph.push(["vfd","1","pot","3"],["pot","1","vfd","5"],["pot","2","vfd","2"]);
 }
 return{parts:pieces,graph};
};
 for(const info of definitions){
 const l=L.byId[info.id],p=l?.project,r=l?.pedagogyReview;
 if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
 !p.components.some(c=>c.typeId==='motor-3p')||!p.components.some(c=>c.typeId==='main-contact')||
 r?.independentPedagogicalAcceptance===true)continue;
 const {parts,graph}=build(info);
 p.components=parts;
 p.wires=graph.map(([a,ap,b,bp],j)=>({id:'sc'+info.seq+'-v20-'+(j+1),from:{c:a,p:ap},to:{c:b,p:bp},
 color:'#43857f',role:'CONTROL',size:'1.5',points:[],
 tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
 tutorialWhy:'Gerçek V20 katalog terminalini ve izin verilen sanal kumanda yolunu izle.'}));
 delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:info.id,phase:'demo',step:0};
 l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=parts.map(c=>({id:c.id,label:c.label,why:
 c.id==='ps'?'V20 L/N/PE sanal giriş beslemesi.':
 c.id==='vfd'?'Özgün V20.tick hız, yön, DI ve AI mantığı.':
 c.id==='m'?'V20 U/V/W çıkışına yıldız bağlanan motor.':
 c.id==='pot'?'V20 +10V/0V ve AI1 arasındaki gerçek potansiyometre bölücüsü.':
 'Dijital girişin buton veya kalıcı kontak anahtarı.'}));
 l.summary=info.summary;l.explanation=info.desc;
 l.quiz={question:info.quiz,options:info.answers,answer:0,why:info.why};
 l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
 heading:info.title,virtualOnly:true,canonicalGraphUnchanged:false,
 fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
 steps:[
 'V20 ve motorun L/N/PE/U/V/W katalog uçlarını kontrol et.',
 ...[...parts.filter(x=>!['ps','vfd','m'].includes(x.id)).map(c=>c.label+' terminalini gözlemle.')],
 'Sanal RUN ve hız/yön durumlarının V20 Hz ve motor devrine etkisini incele.',
 'STOP, giriş kablosu, V20 besleme veya motor fazı kopukluğunda davranışı karşılaştır.'
 ],observations:['Özgün Simulation.solve, V20.tick ve 703 bileşenli katalog ile hedefli pozitif ve negatif kontrol yapılır.',
 'Sürücü sanaldır; üretici tesisat kabulü, STO, EMC, gerçek 3D ve bağımsız pedagojik kabul değildir.'],
 repairModel:'SC'+info.seq+'-V20-NATIVE-DI-AI-CONTROL-V1'};
 const v=r||(l.pedagogyReview={});
 v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
 v.titleTopologyStatus='REVIEW';v.titleTopologyIssue=info.pending;
 v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
 v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
 v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
 v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_V20_NATIVE_SC'+info.seq+'_TARGETED_PASS';
 v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
 v['sc'+info.seq+'NativeV20Repair']='SC'+info.seq+'-V20-NATIVE-DI-AI-CONTROL-V1';
 }
 })();


 // Native source corrections: SC1048 V20 Cn004, SC1053 V20 AI1 + direction,
 // SC1077 three-phase DOL with the actual motor star terminal junction.
 (() => {
  const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const intro=[
   ['ps','L','vfd','L1'],['ps','N','vfd','N'],['ps','PE','vfd','PE'],
   ['vfd','U','m','U'],['vfd','V','m','V'],['vfd','W','m','W'],
   ['m','U2','m','V2'],['m','V2','m','W2'],['vfd','PE2','m','PE'],
   ['vfd','14','vfd','12']
  ];
  const defs=[
   {seq:1048,id:'motor-direct-power-outline-160',kind:'binary',
    title:'V20 Cn004 ikili kodla dört sabit hız seçimi',
    summary:'Sanal SINAMICS V20 Cn004 makrosu: DI1/DI2 iki bitli sabit hız kodunu belirler. 00=durma, 01=10 Hz, 10=20 Hz, 11=30 Hz. Motor sürücü rampasıyla hedefi izler. Bu örnek yalnız V20 simülasyonudur; saha güvenliği, üretici devre kabulü ve STO değildir.',
    explanation:'İki anahtarın iki bitlik hız kodu oluşturduğunu düşün. İlkini açınca 10 Hz, ikincisini açınca 20 Hz seçilir. İkisini açtığında 30 Hz hedeflenir. Her seçimden sonra sürücü motoru bir anda hızlandırmaz, kendi rampasını izler.',
    quiz:'Cn004 ikili hız seçiminde DI1=1 ve DI2=1 ise hedef nedir?',options:['30 Hz','İki motor aynı anda çalışır','0 Hz'],
    why:'İki bitin oluşturduğu 11 kodu üçüncü sabit frekansı seçer.',
    pending:'REAL_Cn004_HARDWARE_VFD_EMC_STO_WINDOWS_3D_PEDAGOGY_PENDING'},
   {seq:1053,id:'motor-direct-power-outline-164',kind:'analog-direction',
    title:'V20 üzerinde ileri/geri ve potansiyometreyle hız',
    summary:'Sanal V20 Cn002: DI1 kalıcı RUN, DI2 REVERSE; katalog uçlarına bağlı 10 kΩ potansiyometre AI1 analog hız referansını 0–50 Hz aralığında değiştirir. İleri/geri geçişini V20 rampa ile gerçekleştirir. Gerçek tesisat veya güvenlik sertifikası değildir.',
    explanation:'Bir fanın yönünü ve hızını ayarladığını hayal et. Önce RUN ver, potansiyometreyi orta konuma al: yaklaşık 25 Hz hedefle. Geri anahtarını açınca sürücü hızını düşürüp sıfırdan geçerek ters yöne ilerler. RUN kapanınca yavaşlayarak durur.',
    quiz:'RUN açık ve potansiyometre orta konumdayken REVERSE verilirse ne beklenir?',options:['Hızın işareti tersine döner ve rampa sıfırdan geçer.','Motor uçları elle çapraz bağlanır.','Motor ani bir anda tam hıza çıkar.'],
    why:'V20 modelinde yön komutu frekans hedefinin işaretini değiştirir.',
    pending:'REAL_VFD_AI1_DIRECTION_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING'}
  ];
  for(const info of defs){
   const l=L.byId[info.id],p=l?.project,review=l?.pedagogyReview;
   if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     !p.components.some(x=>x.typeId==='motor-3p')||!p.components.some(x=>x.typeId==='main-contact')||
     review?.independentPedagogicalAcceptance===true)continue;
   const binary=info.kind==='binary';
   const vp={P0700:2,P1000:binary?3:2,P1016:binary?2:1,P0727:0,
     P1040:0,P1082:50,P1120:10,P1121:10,P2000:50,
     'P0756.0':0,'P0757.0':0,'P0758.0':0,'P0759.0':10,'P0760.0':100};
   if(binary){
    vp.P0701=15;vp.P0702=16;vp.P0703=17;vp.P0704=18;
    vp.P1001=10;vp.P1002=20;vp.P1003=30;
   }else{
    vp.P0701=1;vp.P0702=12;vp.P0703=9;vp.P0704=10;
   }
   const parts=[
    C('ps','supply-1p','G1','Sanal 230 V L/N/PE',75,230),
    C('vfd','sinamics-v20-1p','V20','SINAMICS V20 '+(binary?'Cn004':'Cn002'),675,330,
      {driveControl:'terminals',v20:{schema:1,macro:binary?'Cn004':'Cn002',params:vp,run:false,reverse:false,reset:0,load:50,temperature:30}}),
    C('m','motor-3p','M1','Sanal yıldız asenkron motor',1170,320)
   ];
   const graph=intro.map(x=>x.slice());
   const sw=(id,label,pin,y)=>{
    parts.push(C(id,'selector-no',id.toUpperCase(),label,270,y));
    graph.push(['vfd','13',id,'13'],[id,'14','vfd',pin]);
   };
   if(binary){
    sw('b0','Hız kodunun düşük biti DI1','8',580);
    sw('b1','Hız kodunun yüksek biti DI2','9',785);
   }else{
    sw('run','Kalıcı RUN DI1','8',550);
    sw('reverse','Kalıcı yön REVERSE DI2','9',770);
    parts.push(C('pot','potentiometer','RV1','AI1 için 10 kΩ potansiyometre',280,970,
      {potentiometer:50,potMax:10000}));
    graph.push(['vfd','1','pot','3'],['pot','1','vfd','5'],['pot','2','vfd','2']);
   }
   p.components=parts;
   p.wires=graph.map(([aa,ap,bb,bp],j)=>({id:'sc'+info.seq+'-v20-'+(j+1),
     from:{c:aa,p:ap},to:{c:bb,p:bp},color:'#43857f',role:'CONTROL',size:'1.5',points:[],
     tutorialHint:'Sanal '+aa+'/'+ap+' → '+bb+'/'+bp,
     tutorialWhy:'V20 veya motorun gerçek katalog terminalini izle.'}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:info.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
      hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(x=>({id:x.id,label:x.label,why:x.id==='ps'?'Sanal V20 giriş beslemesi.':
     x.id==='vfd'?'Özgün V20.tick frekans/rampa ve motor modeli.':
     x.id==='m'?'V20 çıkışıyla beslenen yıldız motor.':
     x.id==='pot'?'AI1 analog hız için üç uçlu 10 kΩ bölücü.':'Gerçek V20 dijital girişini kumanda eder.'}));
   l.summary=info.summary;l.explanation=info.explanation;
   l.quiz={question:info.quiz,options:info.options,answer:0,why:info.why};
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:info.title,
    virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:binary?[
     'Cn004 sanal V20 ile motorun katalog giriş/çıkış uçlarını kontrol et.',
     '00 girişinde durma; yalnız DI1 açıksa 10 Hz hedefle.',
     'Yalnız DI2 açıksa 20 Hz; iki giriş açıksa 30 Hz hedefle.',
     'Bir motor fazını, DI girişini veya V20 beslemesini koparıp sonucu karşılaştır.'
    ]:[
     'V20 Cn002 ve sanal motor U/V/W yıldız bağlantısını kontrol et.',
     'RUN açıp potansiyometreyi yüzde 50 seç; yaklaşık 25 Hz hedefle.',
     'Potansiyometreyi değiştir; AI1 ve sanal motor hızı üzerindeki etkiyi incele.',
     'REVERSE aç; frekansın negatif yöne rampasını izle.',
     'RUN, güç, motor fazı ve AI1 kopukluklarında negatif sonuçları karşılaştır.'
    ],
    observations:['Özgün V20.tick/Simulation.solve ve 703 bileşenli katalogla hedefli pozitif-negatif test.',
     'Sanal sürücü gerçek motor mekanik torku, donanım, emniyet, Windows/3D veya bağımsız pedagojik kabul değildir.'],
    repairModel:'SC'+info.seq+'-NATIVE-V20-TARGETED-V1'};
   const v=review||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';v.titleTopologyIssue=info.pending;
   v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_V20_SC'+info.seq+'_TARGETED_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v['sc'+info.seq+'V20Repair']='SC'+info.seq+'-NATIVE-V20-TARGETED-V1';
  }
  // SC1077: the existing three-phase direct-on-line lesson omitted both star links.
  // Repair just the true missing motor terminal junction and real steps.
  (() => {
   const l=L.byId['motor-direct-power-outline-169'],p=l?.project,r=l?.pedagogyReview;
   if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
      !p.components.some(c=>c.typeId==='motor-3p')||
      r?.independentPedagogicalAcceptance===true)return;
   const links=[['motor','U2','motor','V2'],['motor','V2','motor','W2']];
   for(const [aa,ap,bb,bp] of links){p.wires.push({id:'sc1077-star-'+ap,
     from:{c:aa,p:ap},to:{c:bb,p:bp},color:'#43857f',role:'POWER',size:'1.5',points:[],
     tutorialHint:'Sanal yıldız köprüsü '+ap+' → '+bp,
     tutorialWhy:'Üç fazlı motor sargılarının yıldız uçlarını birleştirir.'});}
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
     hint:w.tutorialHint||'Katalog terminali '+w.from.c+'/'+w.from.p+' → '+w.to.c+'/'+w.to.p,
     why:w.tutorialWhy||'Özgün doğrudan yol verme devresinin katalog terminalidir.',
     color:w.color||'#43857f',role:w.role||'CONTROL',size:w.size||'1.5'}));
   l.materials=p.components.map(c=>({id:c.id,label:c.label||c.ref,
     why:c.id==='main'?'Kontaktör ana güç kontakları motor fazlarını anahtarlıyor.':
     c.id==='hold'?'START bırakıldıktan sonra kontaktörün kumandasını tutar.':
     c.id==='motor'?'Yıldız U2/V2/W2 köprüleriyle üç fazda döner.':
     'Sanal katalog devresinin kumanda veya güç elemanı.'}));
   l.summary='Üç fazlı motorun isteğe bağlı sanal START/STOP çalıştırması: NC STOP, NO START, K1 kontaktör bobini, K1 mühürleme kontağı ve üç kutuplu güç kontağı. Eksik U2/V2/W2 yıldız köprüleri tamamlandı. Motor fazları kontaktörden geçer; gerçek saha aşırı akım/emniyet kabulü değildir.';
   l.explanation='Bir fanın çalıştırılmasını düşün. START a kısa basınca kontaktör çekerek motorun güç yolunu açar. Yardımcı kontak bu komutu tutar; START ı bıraktığında motor çalışmaya devam eder. STOP a basınca mühürleme bırakır ve motor durur. Motorun diğer üç sargı ucu sanal yıldız bağlantısıyla birleştirilmiştir.';
   l.quiz={question:'START bırakıldıktan sonra kontaktörün çalışmaya devam etmesini hangi eleman sağlar?',
     options:['K1 yardımcı mühürleme kontağı','PE koruma iletkeni','Yıldız motor köprüsü'],
     answer:0,why:'K1 yardımcı NO kontak STOP sonrası izinli durumda kendi bobinini beslemeye devam eder.'};
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
     heading:'START, mühürleme ve STOP ile sanal üç faz motoru',virtualOnly:true,
     canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
     steps:['K1 bobini ve yardımcı mühürleme devresini gözlemle.',
       'K1 ana üç kutuplu güç kontağı ile motor U/V/W bağlantısını kontrol et.',
       'Yıldız U2/V2/W2 köprülerini kur.',
       'START a bas; kontaktör ve motor durumlarını izle.',
       'START ı bırak; mühürleme durumunu denetle.',
       'STOP a bas; ardından güç fazını veya bobin kablosunu çıkarıp sonucu karşılaştır.'],
     observations:['Özgün Simulation.solve/703 katalog ile hedefli motor, kumanda ve kopuk faz kontrolleri doğrulanır.',
       'Termik aşırı yük veya gerçek risk analizi bu kaynakta yoktur; donanım, Windows/3D ve pedagojik kabul bekliyor.'],
     repairModel:'SC1077-NATIVE-DOL-MOTOR-STAR-V1'};
   const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';v.titleTopologyIssue='REAL_OVERLOAD_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
   v.componentIds=p.components.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_SC1077_TARGETED_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v.sc1077StarMotorRepair='SC1077-NATIVE-DOL-MOTOR-STAR-V1';
  })();
 })();


 // SC1078: the original star/delta switch can select Y/Delta but cannot reverse.
 // Use the catalogue's actual 3-pole reversing packet ahead of the Y/Delta packet.
 (() => {
  const l=L.byId['motor-start-speed-outline-039'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==10||
     p.components.some(x=>x.typeId!=='supply-3p'&&x.typeId!=='packet-star-delta'&&x.typeId!=='motor-y-d')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,position=0)=>({id,typeId,ref,label,x,y,rotation:0,state:false,position,address:'',note:''});
  const parts=[
   C('g1','supply-3p','G1','Sanal üç faz ve PE',60,350),
   C('rev','packet-reversing-3p','S0','İleri / 0 / Geri paket şalter',320,365),
   C('sw','packet-star-delta','S1','0 / Y / Δ paket şalter',685,365),
   C('motor','motor-y-d','M1','Altı sargı uçlu sanal motor',1130,355)
  ];
  const graph=[
   ['g1','L1','rev','L1'],['g1','L2','rev','L2'],['g1','L3','rev','L3'],
   ['rev','U','sw','L1'],['rev','V','sw','L2'],['rev','W','sw','L3'],
   ['sw','U1','motor','U1'],['sw','V1','motor','V1'],['sw','W1','motor','W1'],
   ['sw','U2','motor','U2'],['sw','V2','motor','V2'],['sw','W2','motor','W2'],
   ['g1','PE','motor','PE']
  ];
  p.components=parts;
  p.wires=graph.map(([a,ap,b,bp],i)=>({id:'sc1078-y-d-rev-'+(i+1),
   from:{c:a,p:ap},to:{c:b,p:bp},color:'#43857f',role:'POWER',size:'1.5',points:[],
   tutorialHint:'Sanal '+a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Gerçek katalogdaki yön ve yıldız/üçgen şalter terminali.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(x=>({id:x.id,label:x.label,why:
    x.id==='rev'?'0/ileri/geri konumlu üç kutuplu katalog paketi iki fazı değiştirir.':
    x.id==='sw'?'0/Y/Δ konumlu gerçek MT031 eğitim kontağı motor bağlantısını seçer.':
    x.id==='motor'?'U1/V1/W1 ve U2/V2/W2 uçları paket şalterden beslenir.':
    'Üç fazlı sanal enerji ve PE referansı.'}));
  l.summary='İleri/geri ve Y/Δ sanal motor uygulaması: gerçek katalogdaki üç kutuplu tersleme paket şalteri ile MT031 yıldız/üçgen paket şalteri art arda kullanıldı. 0 konumu motoru durdurur; Y ve Δ bağlantıları yalnız izin verilen sanal fazlarda aktiftir. Gerçek ileri/geri anahtarlama emniyeti, geçiş kilidi, yıldız/üçgen motor kalkış akımı ve üretici kurulumu bu modelde doğrulanmamıştır.';
  l.explanation='Bir motorun iki ayrı seçimi var: önce hangi yöne döneceğini seçen şalter, sonra sargı bağlantısını Y ya da Δ yapan şalter. İki şalterden biri 0 dayken enerji yolu kapalı kalır. İleri veya geri seçildiğinde faz sıralaması değişir; Y/Δ paketi ise sargıların nasıl bağlandığını belirler. Gerçek makinelerde yön ve yıldız/üçgen geçişi mutlaka ayrı güvenlik ve zamanlama koşullarıyla değerlendirilir.';
  l.quiz={question:'Sanal devrede ileri/geri şalteri 0 konumundayken Y/Δ paketi Δ konumunda olsa ne beklenir?',
   options:['Motor çalışmaz; üç faz enerji yolu kesiktir.','Motor mutlaka geri döner.','PE motoru döndürür.'],answer:0,
   why:'Yön şalteri faz beslemesini keserse Y/Δ paketi tek başına motoru besleyemez.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'Yönü ve Y/Δ konumunu ayrı ayrı gözlemle',
    virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Girişten üç fazın önce ileri/geri paketine, sonra Y/Δ paketine geldiğini kontrol et.',
     'İki şalter 0 konumundayken sanal motorun durduğunu gör.',
     'Yön ileri (1) ve Y/Δ yıldız (1) seçildiğinde motor enerjilenir.',
     'Yön geri (2) ve Y/Δ yıldız (1) seçildiğinde faz bağlantısının terslemesini gözlemle.',
     'İleri/geri veya Y/Δ şalterini 0 yap: motor durur.',
     'Bir giriş fazı ya da Y/Δ U/V/W kablosunu kopar; negatif durumu karşılaştır.'],
    observations:['703 katalog ve özgün Simulation.solve ile paket kamları, faz gücü ve kopuk kablo hedefli doğrulanır.',
     'Üretici Y/Δ geçiş zamanlaması, faz dönüş yönü mekanik kanıtı, gerçek interlock, Windows/3D ve pedagojik kabul açık.'],
    repairModel:'SC1078-NATIVE-REV-STAR-DELTA-PACKET-V1'};
  const v=r||(l.pedagogyReview={});
  v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_REVERSAL_INTERLOCK_STAR_DELTA_TRANSITION_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_SC1078_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc1078ReverseYDRepair='SC1078-NATIVE-REV-STAR-DELTA-PACKET-V1';
 })();


 // SC1166, SC1183–1185, SC1193, SC1195 — real 703-catalog sensor topologies.
 (() => {
  const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const createGraph=(edges,tag)=>edges.map(([a,ap,b,bp],i)=>({
   id:tag+'-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
   color:bp==='M'?'#111827':'#43857f',role:bp==='M'?'0V':'CONTROL',size:'1.5',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
   tutorialWhy:'Gerçek katalog terminalinden eğitim amaçlı sanal bağlantı.'}));
  const probes=[
   {seq:1166,id:'sensor-analog-apps-outline-089',type:'ultrasonic-switch',label:'Ultrasonik algılayıcı · 30–400 mm',ref:'B1',
    target:'wood',range:400,distance:50,load:'buzzer',loadLabel:'Buzzer · hedef algılama sesi',title:'Ultrasonik sensör ve buzzer',
    summary:'Sanal ultrasonik sensör, 30–400 mm algılama sınırları içindeki uygun hedefte buzzeri çalıştırır. Kaynak beslemesi veya sensör çıkış kablosu koparsa buzzer susar. Bu gerçek ölçüm kalibrasyonu ya da saha alarm güvenliği değildir.',
    explanation:'Bir cisim sensörün önüne yaklaşsın. Yakın ama ölçülebilir aralıktaysa sensör çıkışı çalışır, buzzer haber verir. Çok yakın (ölü bölge) veya çok uzaktaysa ses çıkmaz. Kabloyu ayırırsan buzzer da susar.',
    quiz:'50 mm uzaktaki uygun hedef algılanırsa ne olur?',opts:['Buzzer çalışır','Sensör fiziksel hızı artırır','Kaynak kapanır'],answer:0},
   {seq:1183,id:'sensor-analog-apps-outline-103',type:'photoeye',label:'Optik fotoelektrik sensör',ref:'B1',
    target:'plastic',range:40,distance:12,load:'lamp-green',loadLabel:'Algılandı · yeşil gösterge',title:'Sensörlerde dönüşüm: optik etki → elektrik çıkışı',
    summary:'Fotoelektrik sensörün cisim algılama durumu 24 V sanal PNP çıkışa aktarılır; gösterge ışığı değişir. Bu yalnız optik algılamadan dijital sinyal oluşumunu gösterir, gerçek enerji üretimi hesabı değildir.',
    explanation:'Cisim ışık yolunda algılandığında sensörün elektrik çıkışı bir işaret verir. Bu işaret de göstergeyi yakar. Cisim uzaklaşınca gösterge söner. Burada ışığı elektriğe üreten bir güç kaynağı değil, algılama üzerinden kontrol eden anahtar var.',
    quiz:'Cisim sensör alanından çıkarıldığında gösterge ne yapar?',opts:['Söner','Sürekli yanar','Motor hızlanır'],answer:0},
   {seq:1184,id:'sensor-analog-apps-outline-104',type:'sensor-hall',label:'Hall etkili manyetik algılayıcı (sanal)',ref:'B1',
    target:'magnet',range:12,distance:4,load:'lamp-green',loadLabel:'Mıknatıs algılandı',title:'Otomotivde kullanılan sensör türüne örnek: Hall',
    summary:'Hall algılayıcının mıknatıs algılama durumu ve PNP çıkışı sanal 24 V göstergeyle incelenir. Bu bir otomotiv ECU, araç kablolaması, motor konum algısı veya 12 V otomotiv donanımı modeli değildir.',
    explanation:'Bazı araçlarda mıknatıs değişimini algılayan Hall sensörleri bulunur. Buradaki sanal örnekte mıknatıs yaklaştığında gösterge yanar, uzaklaşınca söner. Araç elektroniğinin tamamını değil yalnız algılama mantığını görürsün.',
    quiz:'Bu sanal Hall örneğinde hangi hedef algılanır?',opts:['Mıknatıs','Plastik parça','Ses'],answer:0},
   {seq:1193,id:'sensor-analog-apps-outline-112',type:'sensor-hall',label:'Hall algılayıcı · deneysel PNP bağlantı',ref:'B1',
    target:'magnet',range:12,distance:5,load:'lamp-green',loadLabel:'Hall çıkışı · gösterge',title:'Hall algılayıcı çıkışının sanal deneyi',
    summary:'Katalog Hall algılayıcısı, 24 V eğitim beslemesi ve göstergeyle gerçek terminal bazında simüle edilir. Sensör imalatı, yarı iletken Hall gerilimi, manyetik alan kalibrasyonu veya fiziksel devre kabulü değildir.',
    explanation:'Önce Hall sensörünün üç ucunu tanı: besleme, ortak uç ve sinyal. Mıknatıs yaklaştığında sinyal göstergesinin yandığını, uzaklaşınca söndüğünü izle. Burada sensörü üretmiyoruz; hazır algılayıcının çıkış mantığını öğreniyoruz.',
    quiz:'Sanal Hall sensörü beslemesi koparsa gösterge ne yapar?',opts:['Söner','Yanıp sönmeye devam eder','Şebeke gerilimi üretir'],answer:0},
   {seq:1195,id:'sensor-analog-apps-outline-113',type:'sensor-retroreflective',label:'Reflektörlü optik sensör',ref:'B1',
    target:'reflector',range:40,distance:15,load:'lamp-green',loadLabel:'Optik hedef algılandı',title:'Optik sensörün sanal algılama deneyi',
    summary:'Reflektörlü optik sensörün PNP çıkışı, hedef varlığı, algılama mesafesi, 24 V besleme ve yük dönüşüyle test edilir. Gerçek ışık şiddeti, optik modül imalatı ve sertifikalı algılama kapsam dışıdır.',
    explanation:'Sensörün karşısına reflektörü getirip çıkar. Uygun mesafedeyken gösterge yanar; reflektör uzaklaşınca söner. Sinyal kablosunu ayırmak da göstergeyi kapatır. Böylece algılama ile bağlantı hatasını ayırt edersin.',
    quiz:'Reflektör algılama sınırının dışına çıkarsa ne olur?',opts:['Gösterge söner','Kaynak gerilimi artar','Sensör otomatik imal olur'],answer:0}
  ];
  for(const k of probes){
   const l=L.byId[k.id],p=l?.project,r=l?.pedagogyReview;
   if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==4||
      p.components[1]?.typeId!=='proximity'||r?.independentPedagogicalAcceptance===true)continue;
   const bp=k.load==='buzzer'?'1':'X1',bm=k.load==='buzzer'?'2':'X2';
   const parts=[
    C('g','supply-dc-plus','G1','Eğitim 24 V DC',65,310),
    C('s',k.type,k.ref,k.label,420,255,
     {sensing:{target:k.target,range:k.range,distance:k.distance,offset:0}}),
    C('h',k.load,'H1',k.loadLabel,880,270)
   ];
   p.components=parts;
   p.wires=createGraph([
    ['g','P','s','BN'],['s','BU','g','M'],['s','BK','h',bp],['h',bm,'g','M']
   ],'sc'+k.seq+'-sensor');
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},hint:w.tutorialHint,
    why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,why:
    c.id==='s'?'Katalogdaki algılama türü ve BN/BU/BK terminalleri.':
    c.id==='h'?'PNP çıkışı etkinse gösterir.':'Sanal sensör beslemesi.'}));
   l.summary=k.summary;l.explanation=k.explanation;
   l.quiz={question:k.quiz,options:k.opts,answer:k.answer,why:k.explanation};
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:k.title,
    virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Sanal 24 V ve sensörün BN, BU, BK terminallerini bağla.',
     'Yükün girişini BK ye, dönüşünü 0 V a bağla.',
     'Hedefi algılama alanına getir; gösterge veya buzzer durumunu izle.',
     'Hedefi algılama alanından uzaklaştır; çıkışın söndüğünü doğrula.',
     'Sinyal kablosunu veya beslemeyi koparıp sonucu karşılaştır.'],
    observations:['Özgün Simulation.solve ve 703 katalog terminalinde hedef, mesafe ve negatif kablo koşulları doğrulanır.',
     'Bu sadece dar bir sanal eğitim alt örneğidir; gerçek sensör yapımı, saha/Windows/3D ve bağımsız kabul açık.'],
    repairModel:'SC'+k.seq+'-NATIVE-CATALOG-SENSOR-V1'};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='REAL_SENSOR_HARDWARE_CONSTRUCTION_WINDOWS_3D_PEDAGOGY_PENDING';
   v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC'+k.seq+'_TARGETED_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v['sc'+k.seq+'SensorNativeRepair']='SC'+k.seq+'-NATIVE-CATALOG-SENSOR-V1';
  }
  // SC1185 — NTC/PTC real passive thermal behavior in two 24 V divider branches.
  (() => {
   const l=L.byId['sensor-analog-apps-outline-105'],p=l?.project,r=l?.pedagogyReview;
   if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==4||
      p.components[1]?.typeId!=='proximity'||r?.independentPedagogicalAcceptance===true)return;
   const parts=[
    C('g','supply-dc-plus','G1','Sanal 24 V DC',55,330),
    C('rN','resistor','R1','NTC ölçümü için 10 kΩ seri direnç',320,125,{resistance:10000}),
    C('ntc','sensor-ntc','B1','NTC termistör · 25 °C',570,125,{temperature:25}),
    C('vN','meter-voltmeter','V1','NTC üzerindeki gerilim',755,125),
    C('rP','resistor','R2','PTC ölçümü için 10 kΩ seri direnç',320,510,{resistance:10000}),
    C('ptc','sensor-ptc','B2','PTC termistör · 25 °C',570,510,{temperature:25}),
    C('vP','meter-voltmeter','V2','PTC üzerindeki gerilim',755,510)
   ];
   const edges=[
    ['g','P','rN','1'],['rN','2','ntc','1'],['ntc','2','g','M'],
    ['vN','1','ntc','1'],['vN','2','ntc','2'],
    ['g','P','rP','1'],['rP','2','ptc','1'],['ptc','2','g','M'],
    ['vP','1','ptc','1'],['vP','2','ptc','2']
   ];
   p.components=parts;p.wires=createGraph(edges,'sc1185-temp');
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,why:
    c.id==='ntc'?'Isındıkça direnci düşen sanal NTC.':
    c.id==='ptc'?'Isındıkça direnci artan sanal PTC.':
    c.id==='rN'||c.id==='rP'?'Termistör gerilimini karşılaştırmak için seri direnç.':
    c.id==='vN'||c.id==='vP'?'Termistör uçlarında paralel ölçüm.':
    'Her iki pasif devre koluna DC eğitim kaynağı.'}));
   l.summary='Gerçek katalog NTC ve PTC sensörleri, iki 10 kΩ seri direnç ve iki paralel voltmetreyle sanal 24 V bölücülerde karşılaştırılır. Isındıkça NTC gerilimi azalır, PTC gerilimi artar. Isıl atalet, ölçüm toleransı ve üretici kalibrasyonu modellenmez.';
   l.explanation='İki sıcaklık sensörü düşün. NTC ısındıkça direncini azaltır; PTC ise artırır. İkisini ayrı ayrı aynı seri dirençle bağla. Voltmetrelerde NTC geriliminin düştüğünü, PTC geriliminin yükseldiğini gör. Böylece hangi amaç için hangi sensörü seçebileceğini düşünmeye başlarsın.';
   l.quiz={question:'25 °C den 60 °C ye ısıtılan bu sanal NTC bölücüsünde NTC üzerindeki gerilim nasıl değişir?',
    options:['Azalır','Artar','Daima sabit 24 V kalır'],answer:0,
    why:'NTC direnci azalınca seri bölücüdeki NTC gerilim payı da azalır.'};
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
    heading:'NTC ve PTC sıcaklığı farklı anlatır',virtualOnly:true,
    canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['NTC ve PTC için ayrı 10 kΩ seri bölücü kur; her termistörün uçlarına voltmetre bağla.',
     'İki sensörü 25 °C de karşılaştır; NTC yaklaşık 12 V, PTC yaklaşık 2,18 V.',
     'İki sensörü 60 °C yap; NTC gerilimi azalırken PTC yükselir.',
     'Her bir sensörün dönüş kablosunu ayırarak bağlıyken ve kopukken farkı gör.',
     'Voltmetre probunu ayır: kopuk prob ölçüm değildir.'],
    observations:['Özgün Simulation.solve ve 703 katalog ile gerçek NTC/PTC bağıntıları üzerinden sıcaklık/gerilim doğrulanır.',
     'Fiziksel ölçüm, kalibrasyon, Windows/3D ve bağımsız pedagojik kabul açık.'],
    repairModel:'SC1185-NATIVE-NTC-PTC-VOLTAGE-DIVIDERS-V1'};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='THERMAL_CALIBRATION_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
   v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
   v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC1185_TARGETED_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v.sc1185ThermalNativeRepair='SC1185-NATIVE-NTC-PTC-VOLTAGE-DIVIDERS-V1';
  })();
 })();


 // SC1196–SC1225: Title-specific conceptual repairs. Quiz only — no native wiring acceptance.
 (() => {
  const records=[[1196,"sensor-analog-apps-outline-114","Sensör çevreyi algılar; transdüser bir fiziksel büyüklüğü başka bir sinyal biçimine dönüştürür.","Bir kapının açıldığını ışıkla anlayabilirsin. Sensör durumu algılar; içindeki dönüştürme elemanı bunu elektriksel sinyale çevirebilir. İkisini her zaman ayrı aygıt sanma.","Sensör ve transdüser için hangi ifade daha uygundur?","Sensör algılama görevini yapar; transdüser fiziksel büyüklükler arasında dönüşüm sağlar.","Her sensör yalnız mekanik şalterdir.","Transdüser yalnız üç faz motorudur.","Algılama ile fiziksel dönüşüm birbiriyle ilişkili olsa da aynı tanım değildir."],[1197,"sensor-analog-apps-outline-115","Sensörün çalışma prensibi, ölçülen etki ve elektriksel çıkışla birlikte düşünülür.","Bir sensör gördüğü her şeyi aynı şekilde ölçmez. Sıcaklıkta direnç, ışıkta fotoelektrik etki, manyetik alanda Hall etkisi kullanılabilir. Önce hangi fiziksel etkiyi algıladığına bak.","Bir sensörü karşılaştırırken ilk hangi özellik anlamlıdır?","Algıladığı fiziksel etki ve çıkış biçimi.","Dış muhafazasının tek başına rengi.","Kablo uzunluğu ne olursa olsun sabit davranacağı varsayımı.","Çalışma prensibi, sensörün neyi nasıl elektriksel sinyale çevirdiğini açıklar."],[1198,"sensor-analog-apps-outline-116","Sensörleri tanırken önce algılanan büyüklük, besleme ve çıkış türü ayrılır.","Bir sensör kataloğunu açtığında üç basit soruyla başla: Neyi algılıyor? Hangi beslemeyle çalışıyor? Sonuç analog mu dijital mi? Bunlar netleşmeden kablo çizimine geçme.","Sensör katalog tanıtımında hangi bilgi birlikte aranmalıdır?","Algılanan büyüklük, besleme ve çıkış tipi.","Yalnız sensörün reklam görseli.","Yalnız plastik kabuk ölçüsü.","Bu üç bilgi uygulama sınırlarını tanımak içindir, bir saha kabul testi değildir."],[1199,"sensor-analog-apps-outline-117","Mekanik, termal ve elektriksel sensörler algıladıkları etkinin türüyle ayrılır.","Eğilen bir düzenek, ısınan bir direnç ve değişen bir elektrik alanı düşün. Üçü de ölçüm yapabilir ama aynı prensiple çalışmaz. Önce etkiyi ayır, sonra doğru sensörü seç.","Hangisi termal algılamaya örnektir?","NTC direncinin sıcaklıkla değişmesi.","Eğim anahtarının yön değiştirmesi.","Mikrofonun ses dalgasını algılaması.","NTC'nin direnç değişimi sıcaklığa bağlıdır."],[1200,"sensor-analog-apps-outline-118","Mekanik sensörler hareket, temas, konum veya eğim gibi etkileri algılar.","Bir kutu eğildiğinde içindeki eğim sensörü durum değiştirebilir. Mekanik etki her zaman motor hareketi demek değildir; bazen küçük bir temasın değişmesi yeterlidir.","Hangisi mekanik bir algılama örneğidir?","Eğim değişiminde anahtar durumunun değişmesi.","Işık altında LDR direncinin azalması.","Sıcaklık değişiminde NTC direncinin azalması.","Eğim ve temas mekanik etkilerdir."],[1201,"sensor-analog-apps-outline-119","Eğim sensörü yönelim değişimini algılar; her eğim sensörü hassas açı ölçmez.","Bir cihaz devrildiğinde basit bir eğim anahtarı açılabilir. Ancak açıldı diye tam 37 derece eğildiğini söyleyemezsin; bunun için ölçebilen bir sensör gerekir.","Basit aç/kapa eğim sensörü genellikle neyi bildirir?","Belirli bir eğim koşulunun oluştuğunu.","Her zaman kesin açı değerini.","Ortam sıcaklığını Celsius cinsinden.","İkili eğim algısı ile sürekli açı ölçümü farklı yeteneklerdir."],[1202,"sensor-analog-apps-outline-120","Ultrasonik mesafe algılamada ses darbesinin gidip dönme süresi kullanılır.","El çırpıp yankı dinlediğini düşün. Ultrasonik sensör de benzer biçimde gönderdiği sesin dönüş süresini izler. Yüzey, yön ve ortam koşulları sonucu etkileyebilir.","Ultrasonik mesafe ölçümünde temel büyüklük hangisidir?","Ses yankısının gidiş-dönüş süresi.","Yalnız ışığın rengi.","Motorun faz sırası.","Mesafe, yankı süresi ve ses hızıyla ilişkilidir."],[1203,"sensor-analog-apps-outline-121","Termal sensörler sıcaklık etkisini direnç, gerilim veya başka bir elektriksel değişime dönüştürebilir.","Çay soğurken bir NTC'nin direnci değişebilir. Termal algılayıcı yalnızca ekranda sayı gösteren aygıt değildir; bazen önce küçük bir elektriksel değişiklik üretir.","Termal sensörlerde hangi özellik sıcaklığa bağlı değişebilir?","Elektriksel direnç.","Devredeki PE hattının görevi.","Bütün motorların kutup sayısı.","Termistörler sıcaklıkla direnç değeri değişen elemanlardır."],[1204,"sensor-analog-apps-outline-122","NTC termistörde sıcaklık yükseldikçe direnç genellikle azalır.","Bir NTC'yi soğuk ve sıcak iki duruma aldığını düşün. Isındığında direnci düşer. Ama onu doğrudan dijital sıcaklık ekranı sanma; direnci okumak ve dönüştürmek gerekir.","NTC ısındığında direnci genellikle nasıl değişir?","Azalır.","Kesin olarak artar.","Her sıcaklıkta sıfır olur.","NTC negatif sıcaklık katsayılı termistördür."],[1205,"sensor-analog-apps-outline-123","DHT11 ortamın sıcaklığı ve bağıl nemi hakkında dijital veri sağlar.","DHT11 bir termistör gibi iki uçtan direnç okumak için tasarlanmış basit eleman değildir. Kendi arayüzünden sayısal sıcaklık ve nem bilgisi iletir; modelin aralığı ve çözünürlüğü sınırlıdır.","DHT11'den beklenen ölçüm bilgileri hangileridir?","Sıcaklık ve bağıl nem.","Üç faz motor akımı ve güç faktörü.","Yalnızca manyetik alan yönü.","DHT11 dijital sıcaklık ve nem sensörüdür."],[1206,"sensor-analog-apps-outline-124","Elektriksel algılamada elektrik alanı, kapasite veya elektriksel iletkenlik değişimleri kullanılabilir.","Bir sıvı seviyesi için kapasitif sensör düşün. Sensör her zaman metal temasına ihtiyaç duymaz; çevresindeki elektriksel koşulların değişimini ölçebilir.","Kapasitif sensörün temel aldığı değişim hangisidir?","Elektriksel kapasite değişimi.","Motorun mekanik rulman sesi.","Yalnız dünyanın manyetik kuzeyi.","Kapasitif algılama çevredeki dielektrik ve geometrik değişimlerle ilişkilidir."],[1207,"sensor-analog-apps-outline-125","Kapasitif PNP sensör, uygun algılama durumunda çıkışa pozitif besleme yönünde anahtarlama sağlar.","Bir sensörün PNP çıkışını doğru anlamak için sadece algılama yüzüne bakmak yetmez. Çıkışın ortak 0 V'a göre pozitif seviyeye geçtiği mantığı tanı; gerçek bağlantıyı üretici şemasından doğrula.","PNP anahtarlama çıkışının tipik davranışı hangisidir?","Etkinleştiğinde yük yönüne pozitif besleme sunması.","Her koşulda eksi voltaj üretmesi.","Koruma topraklamasını veri hattı yerine kullanması.","PNP ve NPN çıkış türleri aynı terminal davranışı değildir."],[1208,"sensor-analog-apps-outline-126","MAX4466 mikrofon modülü ses değişimlerini analog gerilim değişimi olarak gösterebilir.","Alçak ses ve yüksek sesi bir mikrofon modülünün çıkışında dalgalanan sinyal olarak hayal et. Bu sinyal doğrudan kelime tanıma veya sabit dijital 0/1 sonucu değildir.","MAX4466 elektret mikrofon modülü tipik olarak ne üretir?","Sesle değişen analog çıkış sinyali.","Doğrudan yazıya çevrilmiş konuşma.","Üç faz AC güç çıkışı.","Ses algılama ile konuşmayı dijital olarak tanıma farklı işlerdir."],[1209,"sensor-analog-apps-outline-127","Yağmur sensörlerinde suyun yüzey üzerindeki etkisi elektriksel ölçüme yansıtılabilir.","Bir algılama yüzeyi ıslandığında iletkenlik koşulları değişebilir. Ancak yüzey kirliliği ve korozyon gibi etkenler sonucu bozabilir; sanal soru saha kalibrasyonu sayılmaz.","Basit iletken izli yağmur algılayıcısı hangi değişimi kullanabilir?","Islanmayla yüzey iletkenliğinin değişmesini.","Mekanik şaft devrini.","Üç faz hat frekansını.","Su ve yüzey koşulları iletkenlik temelli ölçümde etkilidir."],[1210,"installation-grounding-outline-013","Toprak nem sensörü, toprağın su içeriğini göstermek için elektriksel veya kapasitif değişimi izleyebilir.","Saksının toprağı kuruduğunda ve sulandığında sensör farklı değerler verebilir. Bu dersin konusu koruma topraklaması değil, toprağın nem durumunu anlamaktır. Ölçüm ortamına göre kalibrasyon gerekebilir.","Toprak nem sensörü hangi büyüklükle ilgilenir?","Toprağın nem/su durumu.","Koruma topraklamasının arıza akımı.","Motorun faz dönme yönü.","Toprak nemi ölçümü, elektrik tesisatının PE koruma topraklamasıyla aynı konu değildir."],[1211,"sensor-analog-apps-outline-128","Manyetik, optik ve kimyasal sensörler farklı fiziksel/kimyasal etkileri algılar.","Bir mıknatısı, el fenerini ve bir gaz algılayıcıyı yan yana düşün. Üçüne aynı 'yakınlık sensörü' adı verilemez; algılanan etkiyi ayırınca doğru yöntem anlaşılır.","Hangisi manyetik etkiye dayanan bir algılamadır?","Hall elemanının manyetik alana yanıt vermesi.","LDR'nin ışık altında direnç değiştirmesi.","Gaz sensörünün kimyasal etkiye yanıt vermesi.","Hall etkisi manyetik algılama sınıfına girer."],[1212,"sensor-analog-apps-outline-129","Manyetik sensörler manyetik alan varlığı veya değişimi üzerinden sinyal üretebilir.","Mıknatısı bir sensöre yaklaştırdığında sinyal değişebilir. Kontaklı reed anahtar ile Hall elemanının iç çalışma şekli aynı değildir; ikisi de manyetik etkiyi kullanır.","Hall etkili sensör doğrudan hangi etkiye duyarlıdır?","Manyetik alana.","Yalnız ortam aydınlığına.","Sadece suyun pH değerine.","Hall etkisinde manyetik alan elektriksel işareti etkiler."],[1213,"sensor-analog-apps-outline-130","ACS712, Hall etkisi kullanan bir akım algılama entegresidir; akıma karşılık analog çıkışı değişir.","Bir akım yolundan geçen akım çevresinde manyetik alan oluşturur. ACS712 bu etkiyi kullanarak akım hakkında analog gerilim bilgisi sağlayabilir; tek başına dijital kWh sayacı değildir.","ACS712 akım ölçerken hangi fiziksel prensibi kullanır?","Hall etkisini.","Ultrasonik yankıyı.","Optik barkod okumayı.","Akımın oluşturduğu manyetik alan Hall tabanlı ölçümde kullanılır."],[1214,"sensor-analog-apps-outline-131","Optik sensörler ışığın kesilmesi, yansıması veya algılanması üzerinden çalışabilir.","Bir banttan geçen kutunun ışığı kestiğini düşün. Başka bir optik sensör ise yansıyan ışığa bakabilir. İki yöntem aynı ışık davranışını kullanmaz.","Karşılıklı optik sensörde nesne algılamanın bir yolu nedir?","Verici ile alıcı arasındaki ışık demetinin kesilmesi.","Toprak neminin yükselmesi.","Şebeke frekansının değişmesi.","Karşılıklı optik algılamada ışık yolu kesilmesi önemlidir."],[1215,"sensor-analog-apps-outline-132","Kızılötesi yakınlık/mesafe algılamada IR ışığın yansıması ve sensörün algılama karakteristiği önemlidir.","Elini IR algılayıcının önüne yaklaştırınca yansıyan ışık koşulu değişebilir. Her IR yakınlık modülü doğrudan santimetre cinsinden hassas mesafe ölçmez.","Her IR yakınlık sensörü kesin santimetre mesafesi verir mi?","Hayır; bazıları yalnız eşik var/yok bilgisi verir.","Evet; hepsi aynı hassas mesafeyi ölçer.","Yalnız bağlantı rengi mesafeyi belirler.","IR algılayıcının çıkış tipi ve ölçüm aralığı modele bağlıdır."],[1216,"sensor-analog-apps-outline-133","IR cisim algılama sensörü uygun ışık ve eşik koşullarında cisim var/yok bilgisini verebilir.","Bir kutu sensörün önüne geldiğinde sensör çıkışı değişebilir. Bu, kutunun ağırlığını ya da kimyasal yapısını ölçtüğü anlamına gelmez.","Basit IR cisim algılama sensörünün temel amacı nedir?","Algılama alanında nesne bulunup bulunmadığını belirlemek.","Nesnenin kesin kütlesini ölçmek.","Şebeke nötr gerilimini ölçmek.","IR algılama optik varlık/yakınlık bilgisidir."],[1217,"sensor-analog-apps-outline-134","Oluklu optik hız sensörü, dönen diskin ışık yolunu kesmesiyle oluşan darbelerden hız hesabına yardım eder.","Delikli bir diskin aralıktan geçtiğini düşün. Her kesinti bir darbe yaratır. Darbelerin sıklığı, diskteki işaret sayısı biliniyorsa dönme hızıyla ilişkilendirilir.","Oluklu optik hız sensöründe hız için hangi işaret kullanılır?","Işık kesilmeleriyle oluşan darbe frekansı.","Yalnız sensörün gövde rengi.","NTC'nin sıcaklık direnci.","Darbe sayımı ve disk üzerindeki işaret sayısı hız hesabına temel olabilir."],[1218,"sensor-analog-apps-outline-135","HC-SR501 PIR modülü, kızılötesi ışınımdaki değişimleri izleyerek hareket algılar.","Odaya giren biri için PIR sensör çıkışı değişebilir. Bu modül kızılötesi kamera gibi görüntü çekmez; hareketli ısıl desen değişimlerine yanıt verir.","HC-SR501 genellikle ne tür bilgi sağlar?","PIR ilkesine göre hareket algılaması.","Kesin yüz tanıma ve video görüntüsü.","Bir multimetre gibi direnç değeri.","PIR pasif kızılötesi değişim algılamadır, kamera değildir."],[1219,"sensor-analog-apps-outline-136","Alev sensörleri bazı alevlerin yaydığı ışınımı belirli dalga boylarında algılayabilir.","Bir alev algılayıcı belirli optik ışınıma tepki verir; her parlak kaynak alev değildir ve her model tek başına güvenlik sertifikalı yangın alarmı sayılamaz.","Basit optik alev sensörü hangi etkiden yararlanabilir?","Alevin yaydığı belirli dalga boylarındaki ışınımdan.","Topraktaki nemin iletkenliğinden.","Motor fazlarının sayısından.","Optik alev algılama yangın güvenlik sisteminin bütününü tek başına doğrulamaz."],[1220,"sensor-analog-apps-outline-137","LDR'nin direnci ışık arttıkça genellikle düşer; doğru değerlendirme için devreye ihtiyaç vardır.","Gündüz ışığı arttığında LDR'nin direnci değişir. Ama bu tek başına lambayı besleyen hazır bir fotosel röle demek değildir. Sensör ile onu değerlendiren devreyi ayır.","LDR daha çok ışık aldığında direnci genellikle ne olur?","Azalır.","Daima sonsuza çıkar.","Sabit 0 ohm olur.","Foto dirençlerde ışık düzeyi arttıkça direnç genellikle azalır."],[1221,"sensor-analog-apps-outline-138","Kimyasal algılayıcılar belirli gaz veya maddelere karşı sensör elemanının tepkisini kullanabilir.","Havadaki her kokuyu aynı sensör eşit biçimde ayırt edemez. Bir gaz sensörünün hedef gazı, ölçüm aralığı, seçiciliği ve kalibrasyonu önemlidir.","Kimyasal sensör seçerken hangisi gereklidir?","Hedef madde, seçicilik ve ölçüm aralığının bilinmesi.","Yalnız LED renginin seçilmesi.","Motor devir sayısının artırılması.","Farklı gaz sensörleri aynı maddelere aynı tepkiyi vermez."],[1222,"sensor-analog-apps-outline-139","Karbonmonoksit (CO) renksiz, kokusuz ve tehlikeli bir gazdır; algılama cihazının sertifikası ve bakımı önemlidir.","CO varlığını kokuya güvenerek anlayamazsın. Eğitim amaçlı sensör şeması gerçek ev tipi CO alarmının yerini tutmaz; güvenlik için amaca uygun sertifikalı algılama gerekir.","Karbonmonoksit (CO) algılama için hangi ifade doğrudur?","Kokuya güvenilmez; uygun onaylı algılama gerekir.","CO her zaman kolayca koklanır.","Her ışık sensörü CO alarmı yerine geçer.","CO renksiz ve kokusuzdur; basit deney devresi gerçek güvenlik alarmı değildir."],[1223,"sensor-analog-apps-outline-140","Dijital hava basıncı sensörleri basınç bilgisini sayısal iletişim biçiminde verebilir.","Telefonundaki barometre gibi bir aygıtı düşün. Çevre basıncı değişince sensör bunu sayısal veri olarak aktarabilir; bu otomatik olarak hava tahmininin tamamı değildir.","Dijital basınç sensörü tipik olarak hangi büyüklüğü bildirir?","Ölçtüğü basınç değerini sayısal veri olarak.","Motorun üç faz yönünü.","Devrenin PE toprak hattını.","Basınç ölçümü ile hava durumunu tahmin etme aynı kapsam değildir."],[1224,"sensor-analog-apps-outline-141","Mekanik, termal ve elektriksel sensörleri algıladıkları etkiye göre sınıflandırma alıştırmasıdır.","Üç örnek düşün: eğim, NTC, kapasitif yakınlık. İlki mekanik, ikincisi termal, üçüncüsü elektriksel koşula duyarlıdır. Sınıflandırmayı ezberlemek yerine bu farkı kullan.","Hangisi doğru sınıflandırma eşleştirmesidir?","Eğim: mekanik; NTC: termal; kapasitif: elektriksel.","Eğim: kimyasal; NTC: optik; kapasitif: mekanik.","Üçü de yalnız manyetiktir.","Sensör sınıfı algılanan fiziksel etkiden çıkarılır."],[1225,"sensor-analog-apps-outline-142","Manyetik, optik ve kimyasal sensörleri örneklerle ayırma alıştırmasıdır.","Hall alan değişimini, LDR ışık değişimini, uygun gaz sensörü hedef kimyasal etkiyi algılar. Aynı çıkış lambasını kullanmaları aynı sensör oldukları anlamına gelmez.","Hangisi doğru örnek sıralamasıdır: manyetik / optik / kimyasal?","Hall / LDR / gaz sensörü.","LDR / gaz sensörü / Hall.","Gaz sensörü / Hall / LDR.","Bu sınıflar ölçtükleri etkinin türüne göre ayrılır."]];
  for(const rec of records){
   const [seq,id,summary,explanation,question,correct,wrongA,wrongB,why]=rec;
   const l=L.lessons[seq-1],review=l?.pedagogyReview;
   if(!l||l.id!==id||l.kind!=='quiz'||review?.independentPedagogicalAcceptance===true)continue;
   const currentQuestion=l.quiz?.question||'';
   const genericQuestion=currentQuestion.startsWith('Bir sensör uygulamasında ilk kontrol')||
     currentQuestion.startsWith('Koruma topraklamasının temel amacı');
   if(!genericQuestion||l.pedagogicalSensorQuiz20261027)continue;
   // Rotating correct position prevents the prior 30-item all-answer-zero pattern.
   const answer=seq%3,options=[wrongA,wrongB];
   options.splice(answer,0,correct);
   l.summary=summary;
   l.explanation=explanation;
   l.quiz={question,options,answer,why};
   l.pedagogicalSensorQuiz20261027='TITLE_ALIGNED_CONCEPTUAL_QUIZ_V1';
   const v=review||(l.pedagogyReview={});
   if(!v.titleTopologyStatus)v.titleTopologyStatus='REVIEW';
   v.titleMatchedQuizRepair='SC1196_1225_TITLE_ALIGNED_CONCEPTUAL_V1';
   v.independentPedagogicalAcceptance=false;
   if(l.practiceGuide){
    l.practiceGuide={...l.practiceGuide,method:'concept-check',
     heading:'Konuyu anla, cevabı düşün',virtualOnly:true,canonicalGraphUnchanged:true,
     physicalTestAccepted:false,pedagogicalAcceptance:false,
     steps:['Bugünkü konu: '+l.title+'.','Önce şu fikri anla: '+summary,
      'Soruyu yanıtla, ardından gerekçeyi kendi sözlerinle söyle.'],
     observations:['Bu konu kontrolüdür; ekrandaki örnek bağlantılar gerçek deney kabulü değildir.',
      'Bağımsız öğretim, Windows/3D ve fiziksel uygulama kabulü henüz yapılmadı.']};
   }
  }
 })();

 // SC1226–SC1255: 30 genuine theory-title repairs. No electrical native PASS implied.
 (() => {
  const records=[[1226,"workshop-safety-mechanics-outline-037","Elektrik akımı, bir kesitten birim zamanda geçen elektrik yükü miktarıdır.","Bir iletkendeki yük akışını düşün. Bir saniyede geçen yük artarsa akım büyür. Akımın birimi amperdir; gerilim ile aynı kavram değildir.","Elektrik akımının SI birimi hangisidir?","Amper (A).","Volt (V).","Ohm (Ω).","Amper akımı, volt potansiyel farkını, ohm direnci ifade eder."],[1227,"workshop-safety-mechanics-outline-038","Gerilim, iki nokta arasındaki elektriksel potansiyel farkıdır.","Gerilimi bir noktanın tek başına etiketi gibi değil, iki nokta arasındaki fark gibi düşün. Voltmetrenin neden iki noktayı karşılaştırdığını böyle anlarsın.","Gerilim hangi kavramı anlatır?","İki nokta arasındaki potansiyel farkı.","Bir saniyede taşınan toplam yükün birimi.","Direncin yalnızca renk şeridi.","Gerilim fark olarak tanımlanır ve volt ile ölçülür."],[1228,"dc-circuits-outline-021","Doğru akımda yük akışının yönü zaman içinde tersine dönmez.","Pil ile beslenen basit bir DC devrede akım tek yönlü akar. Değeri değişebilir; yine de polaritesi sürekli ters dönmüyorsa DC karakteri korur.","Doğru akımın temel yön özelliği hangisidir?","Akış yönünün periyodik olarak tersine dönmemesi.","Her zaman 50 Hz'de yön değiştirmesi.","Yalnız sinüs biçiminde olması.","DC akımın büyüklüğü sabit olmak zorunda değildir, yönü esastır."],[1229,"dc-circuits-outline-022","Pil, akü ve uygun doğrultulmuş beslemeler doğru gerilim sağlayabilir.","Uzaktan kumandadaki pil ile doğrultuculu adaptör farklı enerji kaynaklarıdır. İkisinden de uygun koşullarda DC gerilim alınabilir; gerçek çıkış dalgalanması cihazına bağlıdır.","Hangisi tipik bir doğru gerilim kaynağıdır?","Pil.","Korumasız şebeke prizinin AC çıkışı.","Tek başına açık anahtar.","Pil tipik DC kaynağıdır; şehir şebekesi genellikle AC'dir."],[1230,"dc-circuits-outline-023","DC'de kutupluluk değişmez; AC'de akım veya gerilim zamanla yön ya da işaret değiştirebilir.","Bir pilin artı-eksi uçlarını ve AC sinüsün artı-eksi yarım dalgalarını düşün. Buradaki fark sadece gerilim değeri değil, işaretin zamanla nasıl değiştiğidir.","AC ve DC arasındaki doğru temel fark hangisidir?","AC işaret yön değiştirebilir; DC yönünü korur.","DC her zaman AC'den yüksek gerilimlidir.","AC yalnız pilde oluşur.","Dalga biçimi ve yön değişimi ayrımda belirleyicidir."],[1231,"electronic-component-basics-outline-100","Direnç, elektriksel akım geçişine karşı gösterilen zorluğu ifade eder.","Aynı gerilimde daha büyük dirençle akım küçülür. Bu ilişkide direnç, gerilim veya akımın yerine geçen ayrı bir enerji kaynağı değildir.","Direnç birimi hangisidir?","Ohm (Ω).","Hertz (Hz).","Watt-saat (Wh).","Direnç ohm ile, frekans hertz ile, enerji watt-saat ile ifade edilir."],[1232,"electronic-component-basics-outline-101","Dört bantlı yaygın direnç kodunda ilk iki bant rakam, üçüncü bant çarpandır.","Kahverengi-siyah-kırmızı bantları birlikte oku: 1, 0 ve 100 çarpanı; sonuç 1000 Ω yani 1 kΩ. Tolerans bandı ayrıca değerlendirilir.","Kahverengi-siyah-kırmızı üç değer bandı kaç ohm gösterir?","1000 Ω (1 kΩ).","10 Ω.","100 kΩ.","Kahverengi 1, siyah 0, kırmızı çarpan 10²'dir; 10×100=1000 Ω."],[1233,"electronic-component-basics-outline-102","Direnç birimleri arasında 1 kΩ = 1000 Ω ve 1 MΩ = 1000 kΩ dönüşümü kullanılır.","Bir teknik çizimde 4,7 kΩ gördüğünde bunu 4700 Ω olarak da okuyabilirsin. Aynı fiziksel değer farklı birimle yazılmış olur.","4,7 kΩ kaç ohmdur?","4700 Ω.","47 Ω.","4 700 000 Ω.","Kilo öneki bin ile çarpar: 4,7×1000 = 4700."],[1234,"workshop-safety-mechanics-outline-039","Devre hazırlarken bağlantı elemanları ile ölçüm ve koruma bileşenlerinin görevleri ayrılır.","Devre tahtası, kablo ve ölçü aleti aynı görevi yapmaz. Bağlantıyı taşıyan elemanla devrenin elektriksel davranışını belirleyen elemanı ayırmak kurulumu anlamayı kolaylaştırır.","Hangisi bir bağlantı ve prototipleme yardımcısıdır?","Breadboard.","Sadece direnç tolerans tablosu.","Yalnız dijital frekans birimi.","Breadboard prototip bağlantıları için kullanılır; elektriksel güvenlik onayı değildir."],[1235,"dc-circuits-outline-024","Pil kutuplarını ve pil başlığının temas düzenini anlamak doğru gerilim kaynağını tanımaya yardım eder.","Pil başlığı enerjinin kaynağı değil, pil terminallerini devreye taşıyan parçadır. Kutup bilgisi uygulamadaki elektriksel işaretler için önemlidir.","Pil başlığının temel görevi nedir?","Pil uçlarını devre bağlantısına taşımak.","AC şebekeyi otomatik frekans dönüştürmek.","Her pilden sınırsız akım sağlamak.","Başlık bağlantıyı sağlar; pilin kendi gerilim ve akım sınırlarını değiştirmez."],[1236,"installation-systems-outline-030","Jumper kablo prototip bağlantısında, uygun zil teli ise ilgili düşük gerilimli tesisat uygulamasında kullanılır.","Masadaki jumper ile sabit bir tesisat kablosunu aynı kabul etme. İkisi de iletken olabilir ama yalıtım, mekanik kullanım ve uygulanabilir kurallar farklıdır.","Jumper kablo için doğru ifade hangisidir?","Uygun prototip bağlantılarında kullanılır; her tesisat kablosunun yerine geçmez.","Her koşulda şebeke hattı yerine takılabilir.","Elektriksel iletken değildir.","Kablo seçimi kullanım yeri ve teknik sınırlarına bağlıdır."],[1237,"electronic-component-basics-outline-103","Breadboard üzerinde bazı delik grupları içten ortak iletkene bağlıdır.","Bir breadboardun bütün delikleri tek bir iletken değildir. Hangi deliklerin içten bağlı olduğunu anlamadan şemayı gerçek bağlantıyla karıştırmamak gerekir.","Breadboardun delikleri için hangisi doğrudur?","Bazı delik grupları içten ortak bağlı, bazıları ayrıdır.","Bütün delikler birbirinden yalıtılmıştır.","Bütün delikler tek ve aynı bağlantıdır.","Breadboardun iç iletken şerit düzeni bağlantı mantığını belirler."],[1238,"measurement-workshop-outline-011","Multimetre aynı cihazda gerilim, akım veya direnç gibi farklı ölçüm işlevleri sunabilir.","Bir cihazın ekranına bakmak yetmez; hangi büyüklüğü ölçtüğünü bilmek gerekir. Gerilim, direnç ve akım aynı giriş/ölçüm modu değildir.","Multimetre neden uygun ölçüm moduna alınır?","Farklı büyüklükler için farklı ölçüm işlevleri bulunduğundan.","Her modun aynı elektriksel giriş olduğu için.","Dış muhafaza rengini değiştirmek için.","Mod ve ölçüm terminalleri ölçülen büyüklüğe uygun olmalıdır."],[1239,"measurement-workshop-outline-012","Dijital multimetrede önce ölçülmek istenen büyüklük ve ölçüm aralığı belirlenir.","Akımı volt diye, direnci de enerji altında ölçülmüş geçerli sonuç diye yorumlama. Ekrandaki sayı ancak doğru ölçüm bağlamında anlam kazanır.","Multimetrede güvenilir yorum için önce ne bilinmelidir?","Ölçüm türü ve doğru kademe.","Yalnız ekran ışığının rengi.","Tüm ölçümlerde aynı terminalin kullanıldığı varsayımı.","Ölçülen büyüklük, bağlantı tipi ve cihaz sınırları birlikte değerlendirilir."],[1240,"measurement-workshop-outline-013","Ölçüm kademesi beklenen büyüklüğe ve cihazın güvenlik sınırlarına uygun seçilir.","Bir multimetrenin her kademesi her değeri doğru göstermez. Kullanım kılavuzu ve güvenlik kategorisi kadar, hangi büyüklüğün ölçüldüğü de önemlidir.","Yanlış ölçüm kademesi neye yol açabilir?","Yanlış okumaya veya cihaz sınırlarının aşılmasına.","Her zaman daha hassas ölçüme.","Cihazın otomatik sigorta olmasına.","Kademe seçimi ve terminal sınırları ölçümün doğruluğunu ve güvenliğini etkiler."],[1241,"electronic-component-basics-outline-104","Direnç ölçümü için enerjisiz ve uygun biçimde ayrılmış devre koşulları gerekir.","Bir direnç devrede başka yollarla paralel bağlanmışsa ölçüm sonucu tek parçanın gerçek değeri olmayabilir. Enerjili devrede ohm ölçümünü geçerli sayma.","Direnç ölçümünde hangisi doğru ilkedir?","Enerjisiz durumda ve paralel yolların etkisi düşünülerek ölçmek.","Enerjiliyken otomatik sıfır ohm varsaymak.","Gerilim ölçümünü direnç değeri saymak.","Ohm ölçümünü kaynak gerilimi ve paralel yollar bozabilir."],[1242,"measurement-workshop-outline-014","Voltmetre gerilimi iki nokta arasında karşılaştırır; gerilim ölçümü ilgili iki noktaya paraleldir.","Bir direnç üzerindeki düşümü anlamak için onun uçları arasındaki potansiyel farkını düşün. Voltmetre akım yoluna seri konan ideal bir anahtar değildir.","Bir elemanın uçları arasındaki gerilim nasıl tanımlanır?","İki ucu arasındaki potansiyel farkı.","Elemanın yalnız toplam kütlesi.","Akımın mutlaka sıfır olması.","Voltaj, iki nokta arasındaki farktır; ölçüm yöntemi cihaza göre doğru seçilmelidir."],[1243,"measurement-workshop-outline-015","Ampermetre ölçülen akımın geçtiği kola seri bağlanır; gerilim ölçümünden farklıdır.","Akımı 'yol boyunca ne kadar yük geçiyor?' diye düşün. Ampermetre o akım yolunun bir parçası olarak ölçüm yapar; kaynağın uçlarına doğrudan bağlanmaz.","Ampermetre ölçülen kola hangi ilişkiyle bağlanır?","Seri olarak.","Kaynak uçlarına doğrudan paralel.","Yalnızca PE hattına.","Akım ölçer aynı kol akımını ölçer; yanlış bağlantı tehlikeli olabilir."],[1244,"workshop-safety-mechanics-outline-040","Seri dirençler toplanır; iki paralel dirençte eşdeğer direnç tek tek değerlerden küçüktür.","İki 1 kΩ direnci seri görürsen 2 kΩ elde edersin. Aynı dirençleri paralel düşünürsen akımın bölünebileceği iki yol oluşur ve eşdeğer direnç 500 Ω olur.","İki 1 kΩ direnç seri bağlanınca toplam kaç kΩ olur?","2 kΩ.","0,5 kΩ.","1 kΩ.","Seri bağlı dirençlerin değerleri doğrudan toplanır."],[1245,"dc-circuits-outline-025","Ohm kanununda akım, gerilimin dirence oranıyla ilişkilidir; seri ve paralel toplamlar ayrı bulunur.","12 V ve 2 kΩ değerlerini düşün. 12 bölü 2000, 0,006 A verir. Seri/paralel devrede önce eşdeğer direnci bulmak gerekir.","12 V kaynağın 2 kΩ eşdeğer dirence uyguladığı ideal akım kaçtır?","6 mA.","6 A.","24 A.","I = V/R olduğundan 12/2000 = 0,006 A = 6 mA."],[1246,"dc-circuits-outline-026","Kirchhoff kanunları düğümlerde akım korunumu, kapalı çevrimde gerilim toplamı ilkelerini anlatır.","Bir kavşakta giren ve çıkan akımları, bir çevrimde gerilim yükselmeleri ile düşmelerini ayrı düşün. Bu iki korunum ilişkisi devre çözümünün temelidir.","Kirchhoff'un düğüm kuralı ne söyler?","Bir düğüme giren akımlar toplamı çıkanlara eşittir.","Her dirençte gerilim mutlaka sıfırdır.","Bütün devrelerde akım değişmez.","Düğümde yük birikmiyorsa akım korunumu geçerlidir."],[1247,"dc-circuits-outline-027","Kirchhoff gerilim kanunu kapalı çevrimde işaretli gerilimlerin cebirsel toplamının sıfır olduğunu söyler.","Bir turu tamamlayıp başlangıç noktasına dön. Gerilim yükselmeleri ve düşmeleri doğru işaretle toplanırsa ideal toplanım sıfır çıkar.","Kapalı bir çevrimde Kirchhoff gerilim kuralı hangisidir?","İşaretli gerilimlerin toplamı sıfırdır.","Bütün eleman akımları mutlaka sıfırdır.","Yalnız AC devrede geçerlidir.","Kapalı çevrim potansiyel farklarının işaretli toplamı sıfırdır."],[1248,"dc-circuits-outline-028","Kirchhoff akım kanununda bir düğüme giren ve çıkan akımların toplamı dengelenir.","Bir düğüme 5 mA geliyor ve iki kola bölünüyor. Bir kolda 2 mA varsa diğer kolda 3 mA olmalıdır. Bu yük korunumu ilkesidir.","Bir düğüme 5 mA girip bir koldan 2 mA çıkıyorsa diğer koldan kaç mA çıkar?","3 mA.","7 mA.","0 mA.","Girilen 5 mA, çıkan 2+3 mA'ya eşittir."],[1249,"workshop-safety-mechanics-outline-041","Alternatif akımda elektriksel işaret zamanla yön değiştirebilir; periyodik dalgalar frekansla tanımlanabilir.","Bir sinüs dalgasının artı ve eksi yarımlarını düşün. O anki değer ile etkin (RMS) değer aynı sayı değildir. Önce hangi değerden konuşulduğunu ayır.","Periyodik alternatif akımın frekansı neyi anlatır?","Bir saniyedeki çevrim sayısını.","Direncin fiziksel uzunluğunu.","Kaynağın yalnız kutup rengini.","Frekans hertz birimiyle ifade edilir."],[1250,"workshop-safety-mechanics-outline-042","Sinüzoidal AC işarette genlik, periyot ve frekans farklı özelliklerdir.","Dalgada tepe yüksekliği genliktir; bir tam tekrarın süresi periyottur. Aynı grafikten farklı bilgiler çıkar, bunları birbirine karıştırma.","Sinüzoidal işaretin periyodu neyi gösterir?","Bir tam çevrimin süresini.","Devrenin toplam direncini.","Ölçü aletinin kablo rengini.","Frekans periyodun tersidir: f = 1/T."],[1251,"dc-circuits-outline-029","Sinüzoidal AC için tepe değer ile etkin değer farklıdır; saf sinüste Vrms = Vtepe/√2.","Bir sinüsün en yüksek anlık değerini, ısıtma etkisini temsil eden RMS ile aynı sayma. Bu ilişki ideal sinüs dalgası için geçerlidir.","İdeal sinüs geriliminde RMS değeri tepe değerin yaklaşık kaç katıdır?","0,707 katı.","2 katı.","10 katı.","Saf sinüste Vrms = Vtepe/√2 ≈ 0,707 Vtepe."],[1252,"workshop-safety-mechanics-outline-043","Osiloskop, gerilim işaretinin zamana göre değişimini görselleştirmek için kullanılır.","Multimetre sana tek bir değer gösterebilir; osiloskopla işaretin yükselip alçalışını zamana karşı değerlendirebilirsin. Ancak prob ve cihazın güvenlik sınırları geçerlidir.","Osiloskobun temel ekran ilişkisi hangisidir?","Gerilimin zamana göre değişimi.","Direncin yalnız renk kodu.","Tüm devrelerin fiziksel kablo güzergâhı.","Yatay eksen tipik olarak zaman, düşey eksen gerilimdir."],[1253,"workshop-safety-mechanics-outline-044","Osiloskopta zaman tabanı ve düşey ölçek dalga biçiminin görünümünü belirler.","Bir kare dalgayı hayal et. Zaman tabanını değiştirince ekranda kaç periyot gördüğün değişir; bu tek başına kaynağın gerçek frekansını değiştirmez.","Osiloskopta zaman tabanı neyi ayarlar?","Yatay zaman ölçeğini.","Kaynağın akım taşıma kapasitesini.","Probdaki gerçek elektriksel gerilimi.","Zaman tabanı ekranın yatay zaman görünümünü kontrol eder."],[1254,"measurement-workshop-outline-016","Osiloskop ile dalga biçimi incelerken zaman ve gerilim ölçekleri ile prob çarpanı dikkate alınır.","Bir ölçümde 10× prob kullanılmışsa cihazın buna uygun ölçeklenmesi gerekir. Ekrandaki dalganın nasıl ölçüldüğü bilgisi olmadan tepe değeri yorumlama.","10× prob seçildiğinde ölçüm değerlendirmesinde ne önemlidir?","Osiloskopun prob ölçek ayarının buna uygun olması.","Probu doğrudan şebekeye bağlamayı zorunlu kılması.","Her dalganın otomatik DC olması.","Prob çarpanı ile cihazın ölçüm ölçeği eşleşmelidir."],[1255,"workshop-safety-mechanics-outline-045","Elektriksel güç, enerji aktarımının zamana göre hızıdır; DC'de P = V×I kullanılabilir.","Bir DC yükünü düşün: 12 V altında 0,5 A çekiyorsa güç 6 W olur. Güç ile enerji aynı birim değildir; süre uzadığında enerji artar.","İdeal 12 V DC ve 0,5 A için güç kaç watt olur?","6 W.","24 W.","0,0417 W.","DC güç hesabında P = V×I; 12×0,5 = 6 watt olur."]];
  for(const entry of records){
   const [seq,id,summary,explanation,question,correct,badA,badB,why]=entry;
   const l=L.lessons[seq-1],v=l?.pedagogyReview;
   if(!l||l.id!==id||l.kind!=='quiz'||v?.independentPedagogicalAcceptance===true)continue;
   if(!/^(Bu başlıktaki uygulamaya başlamadan|Akım ölçümü yapılırken|Elektronik uygulamada devreye enerji)/.test(l.quiz?.question||''))continue;
   if(l.pedagogicalBasicsQuiz20261027)continue;
   const answer=seq%3,options=[badA,badB];options.splice(answer,0,correct);
   l.summary=summary;l.explanation=explanation;l.quiz={question,options,answer,why};
   l.pedagogicalBasicsQuiz20261027='SC1226_1255_TITLE_ALIGNED_CONCEPTUAL_V1';
   const review=v||(l.pedagogyReview={});if(!review.titleTopologyStatus)review.titleTopologyStatus='REVIEW';
   review.titleMatchedQuizRepair='SC1226_1255_TITLE_ALIGNED_CONCEPTUAL_V1';
   review.independentPedagogicalAcceptance=false;
   if(l.practiceGuide){
     l.practiceGuide={...l.practiceGuide,method:'concept-check',heading:'Önce düşün, sonra cevapla',
       virtualOnly:true,canonicalGraphUnchanged:true,physicalTestAccepted:false,pedagogicalAcceptance:false,
       steps:['Bu dersin konusu: '+l.title+'.','Temel fikir: '+summary,
              'Soruya cevap ver ve gerekçesini bir cümleyle anlat.'],
       observations:['Bu bir kavramsal değerlendirmedir; örnek şema tam bir fiziksel deney değildir.',
        'Bağımsız pedagojik, cihaz, terminal/3D ve fiziksel kabul kapıları hâlâ açık.']};
   }
  }
 })();

 // SC1256–SC1305: subject-matched conceptual explanations/questions, no physical acceptance.
 (() => {
  const records=[[1256,"Elektriksel iş, enerjinin bir işlem boyunca aktarılmasıdır.","Bir yükün yalnız gücünü değil, ne kadar süre çalıştığını da düşün. Güç watt, aktarılan enerji joule veya kWh ile anlatılır.","1 kW gücündeki yük 2 saat çalışırsa kaç kWh enerji tüketir?","2 kWh","0,5 kWh","2000 kWh","Enerji = güç × süre; 1 kW × 2 h = 2 kWh."],[1257,"Kapasite birimleri F, mF, µF ve nF arasında dönüştürülür.","Bir kondansatörün üstündeki 1 µF yazısını 1000 nF olarak da okuyabilirsin; fiziksel kapasite değişmez.","1 µF kaç nF eder?","1000 nF","1 nF","0,001 nF","Mikro 10⁻⁶, nano 10⁻⁹ öneklerini kullanır."],[1258,"Kapasitans ölçümü, uygun ölçü aletiyle devre enerjisizken ve kondansatör güvenli biçimde deşarj edilmişken değerlendirilir.","Elindeki kondansatörün üstündeki yazı nominal değerdir. Kapasitans ölçümü için uygun alet gerekir; devredeki diğer elemanlar ölçümü değiştirebilir.","Kapasitans ölçümünde hangi birim okunur?","Farad (F) ve alt katları","Hertz (Hz)","Newton (N)","Kapasite, faradla ifade edilen yük depolama yeteneğidir."],[1259,"İdeal kondansatör, sabit DC gerilimde ilk şarjdan sonra sürekli akım geçirmez.","Kondansatör ilk bağlandığında şarj olur. Şarj tamamlanınca ideal modelde doğru akım akışı biter; gerçek elemanda küçük kaçak olabilir.","İdeal kondansatör DC kararlı hâlde nasıl davranır?","Sürekli DC akımını engeller.","İdeal kısa devre gibi kalır.","Akımı sınırsız büyütür.","Kararlı DC'de gerilimi sabittir, i=C·dV/dt sıfır olur."],[1260,"Kapasitif reaktans, frekans yükseldikçe azalır.","Aynı kondansatöre iki farklı AC frekansı uyguladığını düşün. Daha yüksek frekansta kondansatörün akıma gösterdiği kapasitif karşı koyma küçülür.","Frekans iki katına çıkınca sabit C için Xc ne olur?","Yarıya iner.","İki katına çıkar.","Değişmez.","Xc = 1/(2πfC) bağıntısında f paydadır."],[1261,"Bobin, içinden akım geçerken manyetik alanda enerji depolar.","Bobinin görevi kondansatörünkiyle aynı değildir. Bobin akım değişimine tepki verir, depoladığı enerji manyetik alandadır.","Bobinde enerji hangi alanda tutulur?","Manyetik alan.","Sadece elektrostatik alan.","Yalnız mekanik yay.","İndüktörün enerji depolaması manyetik alanla ilişkilidir."],[1262,"Endüktansın birimi henry'dir; mH ve µH alt birimleri kullanılır.","Şemadaki 2 mH değerinin 2000 µH ile aynı olduğunu bilmek parça seçimini kolaylaştırır.","2 mH kaç µH eder?","2000 µH","2 µH","0,002 µH","1 mH = 1000 µH."],[1263,"Bobin endüktansı uygun LCR metre veya endüktans ölçüm işleviyle okunur.","Bobin üzerindeki değer bir ipucudur, gerçek endüktans ise ölçüm frekansı ve çekirdek koşullarından etkilenebilir.","Bobin endüktansı hangi birimle belirtilir?","Henry (H).","Farad (F).","Lümen (lm).","Endüktansın SI birimi henry'dir."],[1264,"İdeal bobin, kararlı DC akımında yalnız tel direnci yok sayıldığında kısa devreye yaklaşır.","Bobin ilk anda akımın hızlı değişmesini engeller. Akım sabitlenince ideal endüktans üzerindeki gerilim sıfır olur; gerçek telin direnci kalır.","İdeal bobinin sabit DC akımdaki endüktif gerilimi nedir?","0 V.","Sürekli sonsuz volt.","Daima 50 V.","v=L·di/dt ve sabit akımda di/dt=0."],[1265,"Endüktif reaktans AC frekans arttığında büyür.","Aynı bobini daha hızlı değişen bir AC kaynağa bağladığını düşün. Manyetik alanı daha hızlı değiştirmek zorlaştığından reaktans büyür.","Frekans iki katına çıkarsa XL ne olur?","İki katına çıkar.","Yarıya iner.","Sıfıra düşer.","XL=2πfL."],[1266,"Transformatör, değişen manyetik akıyla sargılar arasında enerji aktarır.","İki sargı arasındaki etki, birinden diğerine doğrudan metal temas olmasa da değişen akı üzerinden gerçekleşir. Sabit DC ile olağan transformatör çalışması beklenmez.","Transformatörde gerilim aktarımının temeli nedir?","Elektromanyetik indüksiyon.","Sürtünme ile yük üretimi.","Sabit DC altında ideal sürekli gerilim dönüşümü.","Değişen manyetik akı ikinci sargıda gerilim oluşturur."],[1267,"Faz farkı, aynı frekanstaki periyodik iki işaretin zaman veya açı kaymasını ifade eder.","İki sinüs aynı hızda salınırken tepelerine farklı anlarda ulaşabilir; buna faz farkı deriz.","Bir tam periyot faz açısı kaç derecedir?","360°.","90°.","45°.","Tam çevrim 360 derece veya 2π radyandır."],[1268,"Fazör, sinüzoidal büyüklüğün genlik ve faz bilgisini birlikte temsil eder.","Sinüsün her noktasını çizmek yerine bir okla genliği ve açıyı gösterebilirsin; fazörün amacı budur.","Bir AC fazörü tipik olarak hangi iki bilgiyi taşır?","Genlik ve faz açısı.","Yalnız kablo uzunluğu ve rengi.","Yalnız DC direnç toleransı.","Fazör, sinüzoidal işaretin büyüklük ve faz bilgisini saklar."],[1269,"Dengeli üç fazlı sistemde fazlar genellikle 120 elektriksel derece aralıklıdır.","Üç sinüsün aynı anda değil, çevrimin üçte biri kadar arayla tepeye ulaştığını düşün.","Dengeli üç faz sisteminde komşu fazların açı farkı nedir?","120°.","60°.","360°.","360°/3 = 120°."],[1270,"Diyot, normal çalışmada ileri yönde iletimi tercih eden iki uçlu yarı iletken elemandır.","Bir kapı gibi düşün; ileri yönde uygun gerilimde açılabilir, ters yönde normal koşullarda akımı engeller.","Bir doğrultucu diyotun temel görevi nedir?","Akımın bir yönde iletimini tercih etmek.","Sıcaklığı doğrudan hesaplamak.","Üç faz üreterek motoru sürmek.","Diyot ileri ve ters kutuplamada farklı davranır."],[1271,"İleri polarmada diyodun anodunun katoda göre daha yüksek potansiyelde olması beklenir.","Silisyum diyotun iletime geçmesi için sadece uç ismi değil, devredeki gerilim ve akım koşulu da önemlidir.","Silisyum diyotta ileri polarma yönü hangisidir?","Anot katoda göre pozitif.","Katot anoda göre her zaman pozitif.","Uçlar birbirinden yalıtılmış.","İleri polarmada anot katoda göre pozitif gerilimdedir."],[1272,"Zener, LED ve doğrultucu diyot farklı amaçlar için tasarlanmıştır.","LED ışık üretmek, Zener belirli ters gerilim bölgesinde referans sağlamak, doğrultucu diyot ise akımın yönünü düzenlemek için seçilebilir.","LED'in diğer diyotlardan belirgin amacı nedir?","Uygun ileri akımda ışık yaymak.","Yalnız negatif direnç üretmek.","Frekansı mekanik olarak değiştirmek.","LED ışık yayan diyottur."],[1273,"Diyot testi, uygun test modunda ileri ve ters yönleri ayrı değerlendirmeyi gerektirir.","Bir yönde iletim gözlemi tek başına her koşulda sağlamlık kanıtı değildir; ters yönü ve katalog bilgisini de incele.","Diyot kontrolünde neden iki prob yönü denenir?","İleri ve ters davranışları karşılaştırmak için.","Ölçü aleti kablosunu ısıtmak için.","Frekansı artırmak için.","Normal diyot iki yönde aynı iletimi göstermez."],[1274,"BJT'nin temel uçları emiter, baz ve kolektördür.","Üç ucu birbirinden ayırmadan sembole bağlantı çizmeye başlamak karışıklığa yol açar.","BJT üzerindeki temel üç uç hangileridir?","Emiter, baz, kolektör.","Anot, katot, gate.","L1, L2, L3.","BJT iki birleşimle üç terminal içerir."],[1275,"BJT'de küçük baz akımı uygun koşullarda daha büyük kolektör akımını kontrol edebilir.","Küçük bir kumanda sinyaliyle daha büyük bir yük akımının anahtarlanması, BJT'nin sık kullanılan uygulamasıdır.","BJT anahtarlamada hangi uç kumanda edilir?","Baz.","Yalnız kasa vidaları.","Yalnız PE ucu.","BJT'nin iletimi baz-emiter kutuplamasına bağlıdır."],[1276,"BJT anahtarlama devresinde baz akımını sınırlamak önemlidir.","Bir BJT'ye giriş kaynağını doğrudan sınırsız bağlamak doğru değildir; akım sınırlama ve uygun kutuplama gerekir.","BJT baz yolundaki direnç neye yardım eder?","Baz akımını sınırlamaya.","Transformatörü otomatik ayarlamaya.","Transistörü sensör yerine geçirmeye.","Baz akımını kontrol etmek elemanın sınırlarını korumaya yardım eder."],[1277,"BJT uç sıralaması tüm kılıflarda aynı değildir; veri sayfasından doğrulanır.","İki transistor dışarıdan aynı görünebilir ama bacak sırası farklı olabilir. Ezbere değil, parça numarasına bak.","Transistörün E-B-C bacak sırası en güvenilir nereden öğrenilir?","İlgili modelin veri sayfasından.","Sadece plastik rengine bakarak.","Her BJT'nin sırası aynı varsayılarak.","Uç dizilimi üretici/model bilgisine bağlıdır."],[1278,"Röle bobini indüktif yüktür ve anahtarlama sırasında gerilim sıçraması oluşturabilir.","DC röle kontrolünde sürücünün korunması için uygun sönümleme elemanı düşünülür. Diyot gibi çözümler hız ve kutuplama davranışını etkileyebilir.","DC röle bobinine paralel sönümleme diyodunun amacı nedir?","Kapatma anındaki endüktif gerilim sıçramasını sınırlamak.","Bobinin direncini sıfırlamak.","Röleyi daima açık tutmak.","Bobinin depoladığı enerji güvenle sönümlenmelidir."],[1279,"Optik elektronik elemanlar ışıkla elektriksel büyüklükler arasında ilişki kurar.","LED ışık yayar, fotodiyot ışığı algılayabilir. İkisini aynı görevli sanma.","Hangisi ışık algılayan bir yarı iletken elemandır?","Fotodiyot.","Sıradan mekanik vida.","Şebeke fişinin koruma ucu.","Fotodiyot ışık etkisiyle elektriksel yanıt oluşturur."],[1280,"Fotodiyotun akım veya gerilim yanıtı üzerine düşen ışıkla değişebilir.","Fotodiyotun ışık altında verdiği yanıt, devrede hangi kutuplamayla kullanıldığına göre yorumlanır.","Fotodiyotda hangi etki akımı değiştirir?","Düşen ışık şiddeti.","Yalnız plastiğin rengi.","Sadece faz sırası.","Işık, fotodiyot içinde taşıyıcı oluşumuna etki eder."],[1281,"Fototransistör ışığa bağlı olarak kolektör akımını değiştirebilir.","Fotodiyottan farklı olarak transistor yapısı akım kazancı sağlayabilir, ama tepki süresi de farklı olabilir.","Fototransistör hangi büyüklüğe tepki verir?","Işık şiddetine.","Yalnız şebeke frekansına.","Yalnız mekanik sürtünmeye.","Işık iç akım yolunu kontrol eder."],[1282,"LDR üzerine düşen ışık arttıkça direnci genellikle azalır.","Bir lambayı LDR'ye yaklaştırınca direnç düşebilir. Sensör bir güç kaynağı değildir; değeri ölçüm devresinde yorumlanır.","Yaygın LDR ışık artınca nasıl davranır?","Direnci azalır.","Direnci mutlaka sonsuz olur.","AC frekansı üretir.","Foto direnç aydınlığa bağlı direnç değiştirir."],[1283,"Optokuplör, ışık yoluyla iki elektriksel devre arasında sinyal aktarımı ve yalıtım sağlayabilir.","İki devrenin elektriksel olarak ayrılması gereken bir kumanda hattı düşün. Optokuplör sinyali ışık aracılığıyla karşı tarafa taşır.","Optokuplörün temel faydası nedir?","Galvanik olarak ayrılmış iki taraf arasında optik sinyal iletimi.","Her motora üç faz üretmesi.","Kondansatör kapasitesini değiştirmesi.","Işık yoluyla kuplaj, doğrudan iletken bağlantı gerektirmez."],[1284,"Termistör, sıcaklıkla direnci değişen bir elemandır; NTC ve PTC yönleri farklıdır.","Bir ısıtma örneğinde NTC genellikle direnç azaltır, PTC ise artırır. İşaretin ne anlama geldiğini bilmek önemli.","Sıcaklık artınca hangisinin direnci tipik olarak azalır?","NTC.","PTC.","İdeal sabit direnç.","NTC negatif sıcaklık katsayısına sahiptir."],[1285,"Termistör direncinden sıcaklık çıkarmak için karakteristik eğri veya model gerekir.","Bir NTC'nin 10 kΩ yazması, her sıcaklıkta 10 kΩ olacağı anlamına gelmez. Ölçülen direnç tablo veya denklemle sıcaklığa çevrilir.","NTC direnci ölçülünce sıcaklık nasıl bulunur?","Sensörün direnç-sıcaklık karakteristiğiyle.","Her NTC için her zaman R/100 bölünerek.","Sadece sensörün renginden.","R(T) ilişkisi sensör modeline bağlıdır."],[1286,"Termistör kontrolünde ölçülen değer sıcaklık koşullarıyla birlikte değerlendirilir.","Tek bir ohm değeriyle kesin arıza kararı vermeden ortamı ve sensör modelini düşün.","Termistör kontrolünde hangi bilgi birlikte gereklidir?","Ölçüm sıcaklığı ve modelin R–T bilgisi.","Yalnız dış kablo rengi.","Yalnız mekanik ağırlık.","Direnç sıcaklığa bağlı olduğundan referans koşulu önemlidir."],[1287,"Termokupl, iki farklı iletkenin birleşimleri arasındaki sıcaklık farkıyla küçük bir gerilim oluşturabilir.","Sıcak ve referans birleşimlerinin farkını ölçtüğünü düşün. Değerin yorumunda referans sıcaklık da önemlidir.","Termokupl ölçümünde hangi ek bilgi gereklidir?","Referans birleşim sıcaklığı.","Şebeke faz sırası.","Pilin toplam ağırlığı.","Termokupl gerilimi sıcaklık farkıyla ilişkilidir."],[1288,"MOSFET, gate-source gerilimiyle kanal iletimi kontrol edilen bir transistördür.","Uygun VGS düzeyi oluşmadan yük akımı başlamayabilir; gate yalnız bir kontak gibi değerlendirilmemelidir.","MOSFET iletimini en doğrudan hangi gerilim etkiler?","Gate–source gerilimi (VGS).","Topraklama kablosunun uzunluğu.","Yalnız mekanik kapak.","MOSFET kanal durumu gate-source kutuplamasıyla ilgilidir."],[1289,"BJT ile MOSFET'in kontrol büyüklükleri ve giriş davranışları farklıdır.","BJT'de baz akımı, MOSFET'te gate gerilimi öne çıkar. İki parçanın ayak ve sürme kurallarını birbirine karıştırma.","Yalıtılmış gate'li MOSFET en çok hangi girişle kontrol edilir?","Gate–source gerilimi.","Sabit baz akımı.","Hidrolik basınç.","MOSFET gate yapısı BJT baz birleşiminden farklıdır."],[1290,"SCR, tetiklenip yeterli tutma akımı olduğunda iletimini sürdürebilen kontrollü doğrultucudur.","Bir SCR'nin gate darbesi bittikten sonra da iletimde kalabildiğini düşün. Durdurma için tutma akımı koşulunu anlamak gerekir.","SCR uygun tetikleme sonrası ne zaman kapanabilir?","Anot akımı tutma akımının altına inince.","Gate her zaman sıfır olur olmaz.","Yalnız çevrenin ışığı azalınca.","Latching SCR için akımın tutma seviyesinin altına düşmesi gerekir."],[1291,"SCR kapatma, gate sinyalini kaldırmaktan ibaret değildir.","SCR bir kez kilitlenirse akım kesilmedikçe gate kontrolüyle her zaman kapatılamaz.","Kilitlemiş SCR'yi kapatmanın temel koşulu nedir?","Akımı tutma akımının altına indirmek.","Gate gerilimini yükseltmek.","Direnci sıfıra indirmek.","Tutma akımı altına düşünce SCR kesime dönebilir."],[1292,"SCR uçları anot, katot ve gate olarak veri sayfasından doğrulanmalıdır.","Üç bacaklı her elemanın sırası aynı değildir. Gövde işaretleri ve üretici pin dizilimine bakılır.","SCR'nin kumanda ucu hangisidir?","Gate.","Nötr.","Koruma topraklaması.","Gate SCR'nin tetikleme terminalidir."],[1293,"Triyak, uygun tetiklemede AC akımının iki yönünde iletim sağlayabilen elemandır.","AC yük kontrolünde iki yarım periyotta çalışabilen bir anahtarlama elemanına ihtiyaç duyulabilir; triyak bu yüzden kullanılır.","Triyakın SCR'den önemli farkı nedir?","İki yönde ana akım iletebilmesi.","Sadece ışık ölçmesi.","Yalnız DC kaynak üretmesi.","Triyak iki yönlü anahtarlama yapabilir."],[1294,"Triyakın tetiklenmesi gate akımı ve terminal koşullarına bağlıdır.","Triyakı yalnız mekanik aç-kapa düğmesi gibi düşünme; tetikleme bölgeleri ve kilitlenme koşulları önemlidir.","Triyakta tetikleme terminali hangisidir?","Gate.","PE.","L3.","Triyak gate terminaliyle tetiklenir."],[1295,"Triyakın ana uçları MT1 ve MT2, kontrol ucu gate'tir.","Yanlış pin sırası triyak devresinin çalışmamasına neden olabilir; eleman modelinin veri sayfasına bakmak gerekir.","Triyakta ana akım hangi uçlar arasında taşınır?","MT1 ile MT2.","Gate ile koruma toprağı.","Kondansatörün iki plakası.","Triyakın ana terminalleri MT1 ve MT2'dir."],[1296,"Diyak, belirli kırılma gerilimine ulaşıldığında iletime geçen iki yönlü tetikleme elemanıdır.","Diyak her düşük gerilimde kısa devre gibi görünmez. Eşik aşıldığında iletime geçmesi bazı tetikleme devrelerinde kullanılır.","Diyak ne zaman iletime geçme eğilimindedir?","İki yönlü kırılma eşiği aşıldığında.","Sıfır gerilimde daima.","Yalnız LED ışığında.","Diyak kırılma gerilimine bağlıdır."],[1297,"Diyak sağlamlık değerlendirmesi, kırılma gerilimi koşulunu dikkate almalıdır.","Sıradan düşük voltajlı ohmmetre diyakı iletime geçiremeyebilir; bu tek başına arıza anlamına gelmez.","Bir diyak düşük test geriliminde iletmiyorsa hangi yorum doğrudur?","Bu tek başına arıza kanıtı değildir.","Kesin iç kısa devre vardır.","Kesin LED gibi ışık yayar.","Diyak kırılma eşiği test voltajından yüksek olabilir."],[1298,"Şematik simülasyon, modele göre sonuç üretir; gerçek devredeki her davranışı garanti etmez.","Ekrandaki model çalıştığında bağlantı mantığını anlayabilirsin ama fiziksel üretici onayının yerine geçmez.","Şematik simülasyon PASS olması neyi kanıtlamaz?","Gerçek cihazın bütün fiziksel davranışlarını.","Seçili model içinde hesaplanan davranışı.","Bağlantı tablosunun incelendiğini.","Model sonucu saha kabulünün yerine geçmez."],[1299,"Şematik yazılım arayüzünde kütüphane, bağlantı alanı ve simülasyon denetimleri farklı görevler üstlenir.","Aradığın elemanı önce kütüphaneden seçersin; devredeki gerçek davranışı çizimden ayrı çalıştırılan simülasyonla incelersin.","Şematik sembol seçimi hangi bölümle ilişkilidir?","Bileşen kütüphanesi.","Sadece çıktı klasörü.","Yalnız rapor yazıcısı.","Kütüphane parçaların sembol bilgilerini taşır."],[1300,"Yeni proje oluştururken ad, dosya konumu ve şematik kapsamı belirlenir.","Bir tasarımı başlatınca dosyanın nereye kaydedildiğini bilmek sürümler arasında kaybolmayı önler.","Yeni projede en az hangi bilgi düzenlenmelidir?","Proje adı ve kayıt konumu.","Sadece ekranın parlaklığı.","Sadece sistem saati.","Ad ve konum proje dosyalarını düzenli tutar."],[1301,"ISIS şematik alanında semboller, elektriksel netler ve bağlantı noktaları yerleştirilir.","İki sembol çizgisi ekranda yakın görünebilir ama net gerçekten birleşmiyorsa bağlantı oluşmaz.","Şematik çalışma alanında bağlantıyı ne belirler?","Gerçek elektriksel net/terminal birleşimi.","Yalnız sembollerin aynı renkte olması.","Yalnız üst üste duran başlıklar.","Şematik elektriksel düğüm eşleşmesine dayanır."],[1302,"Bileşen kütüphanesinde sembol, model ve PCB kılıfı birbirinden farklı bilgiler olabilir.","Bir parçanın şematik sembolü doğru görünse bile PCB pin dizilimi ayrı kontrol gerektirir.","Bir elektronik parça için sembol ve PCB kılıfı hakkında ne doğrudur?","Farklı işlevli tanımlardır, eşleşmeleri kontrol edilir.","Daima aynı çizimdir.","Kütüphane olmadan her zaman eşdeğerdir.","Şema ile fiziksel footprint birebir doğrulanmalıdır."],[1303,"Proje dosyasını kaydetmek yapılan değişikliklerin korunmasını sağlar.","Ders boyunca küçük değişiklikler yaptığında bunları kayıt altına almak sonraki açılışta devam etmene yardım eder.","Şematik projede 'Kaydet' işleminin temel amacı nedir?","Değişiklikleri dosyada korumak.","Simülasyonu fiziksel sertifikaya çevirmek.","Devre akımını otomatik iki katına çıkarmak.","Kaydetme, proje durumunu dosyaya yazar."],[1304,"Programda devre tasarımı, doğru bileşen ve pinleri seçip ilişkilerini şemaya aktarmayı içerir.","Bileşenleri rastgele yan yana koymak bağlantı demek değildir. Sembollerin pinleriyle elektriksel ağ doğru eşleşmelidir.","Şematik tasarımın elektriksel doğruluğu neye bağlıdır?","Terminal ve net eşleşmesine.","Sadece kablo çizgisinin rengine.","Yalnız proje başlığına.","Elektriksel düğüm bilgisi şemanın davranışını belirler."],[1305,"Bileşen eklerken hem tür hem pin modeli kontrol edilir.","Direnç ile transistörün görsel benzerliği üzerinden değil, gerçek kütüphane tanımı ve uçlarından seçim yaparsın.","Yeni devreye bileşen seçerken hangisi önemlidir?","İhtiyaca uygun eleman ve doğru katalog pinleri.","Sadece sembolün renk tonu.","Yalnız proje dosyası adı.","Bileşenin işlevi ve terminal tanımı kurulumun temelidir."]];
  for(const [seq,summary,explanation,question,correct,badA,badB,why] of records){
   const l=L.lessons[seq-1],v=l?.pedagogyReview;
   if(!l||l.kind!=='quiz'||v?.independentPedagogicalAcceptance===true)continue;
   if(!/^(Bir sensör uygulamasında ilk kontrol|Bu başlıktaki uygulamaya başlamadan|Akım ölçümü yapılırken|Elektronik uygulamada devreye enerji)/.test(l.quiz?.question||''))continue;
   if(l.pedagogicalBasicsQuiz20261027)continue;
   const answer=seq%3,options=[badA,badB];options.splice(answer,0,correct);
   l.summary=summary;l.explanation=explanation;l.quiz={question,options,answer,why};
   l.pedagogicalBasicsQuiz20261027='SC1256_1305_TOPIC_ALIGNED_CONCEPTUAL_V1';
   const review=v||(l.pedagogyReview={});
   if(!review.titleTopologyStatus)review.titleTopologyStatus='REVIEW';
   review.titleMatchedQuizRepair='SC1256_1305_TOPIC_ALIGNED_CONCEPTUAL_V1';
   review.independentPedagogicalAcceptance=false;
   if(l.practiceGuide){
    l.practiceGuide={...l.practiceGuide,method:'concept-check',heading:'Kavramı örnekle düşün',
     virtualOnly:true,canonicalGraphUnchanged:true,physicalTestAccepted:false,pedagogicalAcceptance:false,
     steps:['Bu dersin konusu: '+l.title+'.','Kısa fikir: '+summary,
      'Soruyu cevapla ve nedenini bir cümleyle açıkla.'],
     observations:['Bu bir kavramsal derstir; örnek şema ilgili başlığın doğrulanmış fiziksel uygulaması değildir.',
      'Katalog terminali, özgün native simülasyon, Windows/3D ve bağımsız kabul kanıtı bu quizle elde edilmez.']};
   }
  }
 })();


 // SC1306–SC1355: strictly conceptual, subject-specific 50 quiz repairs; no native claim.
 (() => {
  const records=[[1306,"Bileşen özellikleri, devredeki elemanın değerini ve modelini tanımlar.","Şemadaki 1 kΩ direnç değerini 2 kΩ olarak düzenlersen hangi bilgi değişir?","Bileşenin elektriksel direnç değeri.","Yalnız çizimin adı.","Şemadaki tüm elemanların tipi.","Özellik düzenleme, seçilen elemanın değer ve parametrelerine yöneliktir."],[1307,"İletken çizgisi ancak doğru eleman uçlarını bağladığında elektriksel bağlantı kurar.","Şemada iki sembol çizgiyle bağlı görünürken bağlantıyı neyle doğrularsın?","Çizginin doğru terminallere gerçekten bağlandığını kontrol ederek.","Çizgi rengini koyulaştırarak.","Sembol başlıklarını değiştirerek.","Grafik yakınlığı tek başına elektriksel uç bağlantısını doğrulamaz."],[1308,"Snap, şema nesnelerini belirlenmiş ızgara noktalarına hizalar.","Snap ayarını açmanın temel amacı nedir?","Sembol ve bağlantıları düzenli hizalamak.","Kaynağın gerilimini artırmak.","Direncin gücünü otomatik belirlemek.","Izgaraya yakalama görsel ve bağlantısal yerleşimi kolaylaştırır."],[1309,"Blok işlem, seçilen birden çok şema nesnesini grup halinde düzenlemeyi sağlar.","Toplu taşıma yaparken hangi öğeler birlikte seçilmelidir?","Taşınması istenen semboller ve ilişkili çizim öğeleri.","Uygulamadaki bütün projeler.","Sadece dosyanın adı.","Blok seçimi işlemden etkilenecek nesnelerin kapsamını belirler."],[1310,"Güç ve şase/ortak referans terminalleri aynı görevde değildir.","Bir şemadaki GND/ortak referans işaretinin görevi nedir?","Devrede tanımlanan ortak potansiyel referansını göstermek.","Her durumda koruma topraklamasıyla özdeş olmak.","Kaynağı kendiliğinden kapatmak.","Sinyal referansı ile koruyucu toprak eşdeğer kabul edilemez."],[1311,"Tasarım ekranı araçları, yerleşim ve görünümü yönetmeye yardım eder.","Yakınlaştırma (zoom) yaptığında ne değişmesi beklenir?","Şemanın ekrandaki görüntü ölçeği.","Dirençlerin fiziksel değeri.","Kaynağın frekansı.","Zoom görünümü değiştirir, elektriksel parametreyi değil."],[1312,"Simülasyon, kurulan devrenin model altında nasıl davrandığını inceleme yöntemidir.","Sanal simülasyon sonucunu yorumlarken en önemli sınırlama nedir?","Sonucun kullanılan model ve varsayımlara bağlı olması.","Sanal sonucun her zaman fiziksel test yerine geçmesi.","Simülasyonun hiç veri üretmemesi.","Modelin kapsamı dışındaki fiziksel etkiler otomatik doğrulanmış sayılmaz."],[1313,"Simülasyonu başlatmak sonuçların zaman içindeki değişimini izlemeyi sağlar.","Simülasyon başladıktan sonra gözlemlenecek temel bilgi hangisidir?","Düğüm gerilimleri veya devre durumunun değişimi.","Dosya adının uzunluğu.","Arayüzün arka plan rengi.","Çalışan modelin çıktıları beklenen davranışla karşılaştırılır."],[1314,"Simülasyon uyarıları, eksik bağlantı veya tutarsız model gibi sorunları anlamaya yarar.","Simülatör 'açık devre' uyarısı verirse ilk hangi durumu incelersin?","Beklenen akım yolunda kopuk bağlantı olup olmadığını.","Klavye dilini.","Dosya simgesinin rengini.","Açık devre, hedef akım yolunun tamamlanmamasıyla ilişkili olabilir."],[1315,"Simülasyon verisi, birim ve ölçüm koşuluyla birlikte anlam kazanır.","Bir grafikte 0,012 A görürsen bunu nasıl yorumlarsın?","12 mA akım.","12 V gerilim.","0,012 Ω direnç.","Amper akım birimidir ve 0,012 A = 12 mA eder."],[1316,"Sanal ölçümde ölçü aleti, ölçülen büyüklüğe uygun seçilir.","Bir elemanın uçları arasındaki gerilimi ölçmek için hangi sanal alet kullanılır?","Voltmetre.","Ampermetreyi devreye paralel bağlamak.","Frekans sayacıyla direnç ölçmek.","Potansiyel farkı voltmetreyle, akım ampermetreyle değerlendirilir."],[1317,"Sanal ölçü aletleri, yazılım modelinden gerilim ve akım değerlerini gösterir.","Sanal voltmetrenin gösterdiği değer hangi büyüklüğe aittir?","İki ölçüm noktası arasındaki gerilim.","Devrenin dosya boyutuna.","PCB üzerindeki delik çapına.","Sanal voltmetre seçilen iki noktanın potansiyel farkını raporlar."],[1318,"PCB tasarımı şematik devreyi yerleşim ve iletken izler olarak düzenler.","Şemadan PCB tasarımına geçerken hangi bilgi korunmalıdır?","Bileşenler arasındaki elektriksel ağ bağlantıları.","Yalnız sembollerin renkleri.","Metin yazı tipinin tamamı.","Şematik ağ listesi baskı devre iz bağlantılarının temelidir."],[1319,"PCB yazılımındaki temel araçlar, bileşen yerleştirme ve iz düzenleme işlemlerini kapsar.","PCB editöründe pad hangi amaçla kullanılır?","Bileşen bacağı için tanımlı bağlantı alanı olarak.","Programdaki çöp kutusu olarak.","Devrenin frekans kaynağı olarak.","Pad, bileşenin PCB üzerindeki elektriksel bağlanma noktasıdır."],[1320,"PCB tasarım alanında katman, konum ve ızgara ayarları düzeni etkiler.","Bir izi farklı bakır katmana geçirmek için hangi PCB kavramı kullanılır?","Via (katmanlar arası geçiş).","Zoom çubuğu.","Yalnız metin etiketi.","Via, uygun tasarımda katmanlar arasında elektriksel yol sağlar."],[1321,"PCB kılıfı (footprint), fiziksel bileşenin pad ve gövde yerleşimini temsil eder.","Yeni bir kılıf oluştururken temel ölçüt hangisidir?","Gerçek bileşenin pin aralığı ve pad düzeni.","Sembolün ekrandaki rengi.","Dosya adının kelime sayısı.","Footprint mekanik boyut ve terminal dizilimiyle uyumlu olmalıdır."],[1322,"PCB çiziminde elektriksel ağlar izlere dönüştürülür ve açıklık kuralları gözetilir.","Bir PCB izinin yanlış ağa bağlanıp bağlanmadığı nasıl anlaşılır?","Net bağlantısı ve tasarım kuralı kontrolüyle.","Sadece arka plan renginden.","Kart dosyasının tarihinden.","Ağ bağlantısı ve DRC hatalı bağlantıları ortaya çıkarabilir."],[1323,"Projenin PDF çıktısı, çizimi paylaşılabilir belge olarak sunar.","PCB projesini PDF olarak dışa aktarmak genelde ne sağlar?","Görüntülenebilir tasarım belgesi.","Doğrudan üretime hazır bakır katman verisi.","Devrenin otomatik fiziksel testi.","PDF dokümantasyon amaçlıdır; Gerber üretim dosyasıyla aynı değildir."],[1324,"Gerber, PCB üretimi için katman geometrilerini aktarmaya yarayan dosya biçimidir.","Gerber çıktısı ile birlikte delik bilgisi için genellikle ne üretilir?","NC drill (delik) dosyası.","Yalnız bir ekran görüntüsü.","Bir sunum slaydı.","PCB üreticisi bakır katmanlar ve delik verilerini ayrı dosyalardan okuyabilir."],[1325,"El aleti seçimi işin türüne, malzemeye ve güvenli kullanım koşuluna bağlıdır.","Uygun el aleti seçerken hangi özellik öne çıkar?","İşin amacı ve aletin uygunluğu.","Sapın en parlak rengi.","Kutunun büyüklüğü.","Doğru alet, işlem ve malzemeyle uyumlu olmalıdır."],[1326,"Tornavida, pense ve kablo sıyırma aleti farklı işlemler için tasarlanır.","Bir tornavidanın temel görevi hangisidir?","Uygun başlı vida bağlantısını döndürmek.","Elektrik akımını ölçmek.","PCB üzerinde direnç değeri okumak.","Aletin ucu ve kullanım amacı vida biçimiyle uyumludur."],[1327,"Temel iletken bağlantısı elektriksel süreklilik ve mekanik sağlamlık kavramlarını birleştirir.","İyi bir bağlantının kavramsal özelliği nedir?","Uygun elektriksel süreklilik ve sağlam temas.","Yalnız güzel görünmesi.","Bütün kabloların aynı renkte olması.","Bağlantı kalitesi yalnız çizime bakılarak garanti edilemez."],[1328,"İletkenin malzemesi ve kesiti elektriksel özelliklerini etkiler.","Aynı malzemede ve uzunlukta iletkenin kesiti artarsa direnci genel olarak ne olur?","Azalır.","Artar.","Her koşulda sıfır olur.","R = ρL/A ilişkisinde kesit büyüdükçe direnç azalır."],[1329,"Kablolar yalıtım, damar sayısı ve kullanım koşuluna göre farklılaşır.","Kablo seçimini değerlendirirken yalnız renk yerine neye bakılır?","İletken kesiti, yalıtım ve kullanım amacına.","Yalnız dış yüzey desenine.","Yalnız etiketin yazı boyutuna.","Renk tek başına kablonun elektriksel ve mekanik uygunluğunu kanıtlamaz."],[1330,"Lehimlemede uygun uç, lehim teli ve destek ekipmanı farklı görev görür.","Lehimlemede duman tahliyesinin amacı nedir?","Çalışma ortamındaki duman maruziyetini azaltmak.","Lehimin direncini sıfırlamak.","PCB izlerini otomatik çizmek.","Uygun havalandırma, çalışma ortamının güvenlik düzeninin parçasıdır."],[1331,"Lehim bağlantısı hem elektriksel temas hem de mekanik tutarlılık sağlar.","Sağlıklı lehim bağlantısını değerlendirirken hangisi önemlidir?","Temasın ve bağlantı bütünlüğünün kontrol edilmesi.","Yalnız lehimin miktarını artırmak.","Sadece kartın rengine bakmak.","Görünüm tek başına kaliteyi doğrulamaz; bağlantının sürekliliği önemlidir."],[1332,"Soğuk lehim, bağlantının yeterli bütünlük göstermemesiyle ortaya çıkan bir kusurdur.","Soğuk lehim sorunu bir devrede hangi sonuca neden olabilir?","Aralıklı veya güvenilmez elektriksel temas.","Daha yüksek veri depolama kapasitesi.","Gerilimin kendiliğinden düzenlenmesi.","Zayıf lehim bağlantısı temas direnci veya kesintili çalışmaya yol açabilir."],[1333,"PCB, bileşenleri taşıyan ve elektriksel yolları düzenleyen kart yapısıdır.","Baskı devre kartında bakır izlerin temel görevi nedir?","Tasarlanan ağlar arasında elektriksel bağlantı sağlamak.","Yazılım lisansı saklamak.","Şebeke frekansını belirlemek.","İzler devre düğümleri arasındaki iletken yollardır."],[1334,"PCB yapısında yalıtkan taban, bakır yollar ve bağlantı padleri bulunur.","PCB taban malzemesinin temel görevi hangisidir?","İletken katmanlara mekanik destek ve yalıtım sağlamak.","Bütün izleri kısa devre etmek.","İşletim sistemini çalıştırmak.","Yalıtkan substrat iletken yolların düzenli ayrılmasına yardım eder."],[1335,"PCB, devreyi tekrar üretilebilir bağlantı düzeniyle bütünleştirir.","PCB kullanımının devre açısından temel işlevi nedir?","Bileşenler arasında tanımlı iletken yol oluşturmak.","Güç kaynağı olmadan enerji üretmek.","Bütün bileşenleri sensöre dönüştürmek.","PCB bir bağlantı ve taşıma altyapısıdır; tek başına enerji kaynağı değildir."],[1336,"PCB üretimi tasarım doğrulama, katman çıktıları ve fiziksel üretim aşamalarını içerir.","Üretim dosyaları hazırlanmadan önce hangi yazılım kontrolü anlamlıdır?","Bağlantılar ve tasarım kuralı denetimi (DRC).","Sadece pencereyi büyütmek.","Proje klasörünün rengini değiştirmek.","DRC, iz genişliği ve açıklık gibi tasarım kuralı ihlallerini gösterebilir."],[1337,"PCB'ler katman sayısı ve kullanım amacına göre sınıflandırılır.","Çift katmanlı PCB neyi ifade eder?","İki bakır iletken katmana sahip kartı.","Her zaman iki güç kaynağı içeren devreyi.","İki farklı program kullanılan bilgisayarı.","Katman sayısı kart üzerindeki bakır bağlantı düzlemlerini anlatır."],[1338,"Baskı devre çıkarma, tasarım geometrisinin karta aktarılmasını kapsar.","PCB üretim öncesi kontrolünde hangi soru anlamlıdır?","İzler doğru ağlara bağlı mı ve aralıklar uygun mu?","Arka plan rengi mavi mi?","Dosya adında kaç hece var?","Üretim öncesinde ağ ve kural tutarlılığı değerlendirilir."],[1339,"PCB paterni, bakır iz ve pad geometrisinin çizim karşılığıdır.","Patern hazırlanırken padler neye göre yerleştirilir?","Bileşenin pin düzeni ve ağ bağlantılarına göre.","Ekran görüntüsünün köşelerine göre.","Dosya boyutuna göre.","Pad konumları hem fiziksel pin geometrisine hem şema ağına uygun olmalıdır."],[1340,"Patern kontrolünde açıklıklar ve yanlış birleşmeler değerlendirilir.","Patern üzerindeki iki farklı net arasında istenmeyen birleşme neye yol açabilir?","Kısa devre riskine.","Daha okunaklı etiketlere.","Daha fazla hafıza alanına.","Yanlış birleşmiş ağlar beklenmeyen iletken bağlantı oluşturur."],[1341,"İş güvenliği atölye düzeni ve risk farkındalığıyla başlar.","Bir atölye çalışmasında öncelik hangisidir?","Riskleri tanımak ve yetkili gözetimindeki kurallara uymak.","Hızlı bitirmek için kontrolleri atlamak.","Uyarı etiketlerini kaldırmak.","Güvenli çalışma planlaması her uygulamanın temelidir."],[1342,"Çevresel koruma, atıkların ve kaynak kullanımının doğru yönetilmesini kapsar.","Elektronik atıklar için uygun yaklaşım hangisidir?","Yerel kurallara uygun ayrı toplama ve geri dönüşüme yönlendirme.","Normal çöp içine ayırmadan karıştırma.","Açık alanda yakma.","Elektronik atıklar özel bileşenler içerebilir ve uygun işlem gerektirir."],[1343,"Atölye düzeni, açık hareket alanı, uygun aydınlatma ve tanımlı çalışma bölgeleri gerektirir.","Düzenli bir laboratuvarın önemli özelliği nedir?","Çalışma alanlarının ve geçiş yollarının açık tutulması.","Kabloların bütün zemine yayılması.","Uyarı işaretlerinin gizlenmesi.","Düzen ve görünürlük riskleri fark etmeyi kolaylaştırır."],[1344,"Atölye kuralları araçların sorumlu kullanımını ve yetkili yönlendirmesini kapsar.","Bilinmeyen bir cihazla karşılaşan öğrenci ne yapmalıdır?","Öğretmen veya yetkili kişiden güvenli kullanım bilgisi istemelidir.","Cihazı rastgele çalıştırmalıdır.","Koruyucu uyarıları yok saymalıdır.","Bilmediği ekipmanın kullanımı gözetim ve uygun bilgi gerektirir."],[1345,"İş sağlığı ve güvenliği tehlikeleri tanıma ve önleme yaklaşımıdır.","Bir uygulama öncesi risk değerlendirmesinin amacı nedir?","Olası tehlikeleri önceden fark edip uygun önlemleri belirlemek.","Bütün testleri iptal ederek sonucu PASS saymak.","Yalnız proje kapağını süslemek.","Önleyici yaklaşım risklerin olasılık ve sonuçlarını azaltmaya çalışır."],[1346,"Atölye riskleri elektriksel, mekanik ve çevresel kaynaklardan doğabilir.","Bir çalışma alanında hasarlı kablo fark edilirse hangi yaklaşım uygundur?","Kullanımdan uzak tutup yetkiliye bildirmek.","Kullanmayı sürdürmek.","Kusuru bir etiketle gizlemek.","Hasarlı ekipman güvenli değerlendirme yapılmadan kullanılmamalıdır."],[1347,"İlk yardım planı, acil durumda uygun profesyonel desteğe erişimi de içerir.","Atölyede acil sağlık durumu görülürse ilk kurumsal yaklaşım nedir?","Yetkili yetişkine haber verip uygun acil yardım çağrısını sağlamak.","Olayı kimseye söylememek.","Bilmeden müdahaleleri denemek.","Acil durumlarda eğitimli destek ve kurum prosedürü esastır."],[1348,"İSG önlemleri düzenli kontroller ve koruyucu davranışlarla sürdürülür.","Koruyucu önlemlerin sürekliliği için hangisi gereklidir?","Kuralları düzenli uygulamak ve uygunsuzlukları bildirmek.","Yalnız ilk gün dikkat etmek.","Tüm uyarıları kaldırmak.","Güvenli çalışma tek seferlik bir işlem değil, devam eden bir sorumluluktur."],[1349,"KKD, belirli bir tehlikeye yönelik seçilen kişisel koruyucu donanımdır.","KKD seçerken en önemli ölçüt nedir?","Karşılaşılan riske ve yapılan işe uygunluk.","Yalnız markanın logosu.","Yalnız en parlak renk.","Her koruyucu donanım her tehlike için uygun değildir."],[1350,"İş kazaları sağlık üzerinde farklı etkiler oluşturabilir; önlem ve erken bildirim önemlidir.","Bir tehlikeli durumu yaralanma olmadan fark etmek neden değerlidir?","Önlem alarak olası zararları azaltma fırsatı verir.","Olay kaydını tamamen gereksiz kılar.","Her riskin ortadan kalktığını garanti eder.","Ramak kala olaylarından öğrenmek risk azaltmayı destekler."],[1351,"Koruyucu gözlük, eldiven ve kulak koruyucu farklı riskler için tasarlanır.","Göz koruyucu ne tür bir riske karşı kullanılır?","Uygun tipine göre göze yönelen parçacık veya sıçramalara.","Bütün elektriksel hatalara karşı otomatik koruma.","Yazılım hatalarını düzeltmeye.","Koruma türü hedeflenen tehlikeye ve ekipman standardına göre seçilir."],[1352,"Fiziksel ölçme uygulamaları uygun alet, birim ve okuma yöntemi gerektirir.","Uzunluk ölçüm sonucu nasıl anlamlı sunulur?","Sayı ve uygun uzunluk birimi birlikte yazılarak.","Yalnız cihazın rengiyle.","Birim olmadan rastgele bir sayı vererek.","Ölçüm sayısal değer, birim ve gerektiğinde belirsizlikle ifade edilir."],[1353,"Metre ölçümü uzunlukların karşılaştırılması için temel yöntemdir.","2,5 m kaç santimetredir?","250 cm.","25 cm.","2500 cm.","Bir metre yüz santimetredir; 2,5 × 100 = 250 cm."],[1354,"Kumpas dış, iç ve derinlik ölçümlerinde kullanılan hassas ölçü aletidir.","Kumpasla ölçümün metreye göre yaygın avantajı hangisidir?","Küçük boyutları daha hassas okuyabilmesi.","Her koşulda gerilim ölçmesi.","Sıcaklığı otomatik hesaplaması.","Uygun kumpasın çözünürlüğü küçük boyut ölçümlerinde yararlıdır."],[1355,"Mikrometre küçük boyutların hassas ölçümünde kullanılır.","Mikrometrenin temel kullanım amacı hangisidir?","Küçük kalınlık veya çapları hassas ölçmek.","Baskı devrede frekans üretmek.","Elektrik devresinde akım anahtarlamak.","Mikrometre mekanik boyut için hassas ölçüm aracıdır."]];
  if(records.length!==50)throw Error('SC1306-1355 records missing');
  for (const [seq,summary,question,correct,badA,badB,why] of records) {
   const l=L.lessons[seq-1],review=l?.pedagogyReview;
   if(!l||l.kind!=='quiz'||review?.independentPedagogicalAcceptance===true)continue;
   if(l.topicQuizSC1306_1355)continue;
   if(!/^(Bu başlıktaki uygulamaya başlamadan|Akım ölçümü yapılırken|Elektronik uygulamada devreye enerji)/.test(l.quiz?.question||''))continue;
   const answer=seq%3;
   const options=[badA,badB];options.splice(answer,0,correct);
   l.summary=summary;
   l.explanation=summary+' Şöyle düşün: '+why+' '+(seq>=1341&&seq<=1351?'Bu ders bilgi ve risk farkındalığı içindir; gerçek çalışma yetkili gözetimi gerektirir.':'Burada bir kavramı öğreniyoruz; örnek şemanın fiziksel kabulü yapılmış sayılmaz.');
   l.quiz={question,options,answer,why};
   l.topicQuizSC1306_1355='SC1306_1355_TITLE_ALIGNED_CONCEPTUAL_V1';
   const v=review||(l.pedagogyReview={});
   if(!v.titleTopologyStatus)v.titleTopologyStatus='REVIEW';
   v.titleMatchedQuizRepair='SC1306_1355_TITLE_ALIGNED_CONCEPTUAL_V1';
   v.independentPedagogicalAcceptance=false;
   if(l.practiceGuide)l.practiceGuide={...l.practiceGuide,
     method:'concept-check',heading:'Konuyu kendi sözlerinle anla',
     virtualOnly:true,canonicalGraphUnchanged:true,physicalTestAccepted:false,pedagogicalAcceptance:false,
     steps:['Bu dersin başlığı: '+l.title+'.','Ana fikir: '+summary,'Kısa soruyu cevapla, sonra nedenini açıklamayı dene.'],
     observations:['Bu yalnız kavramsal quizdir; ekrandaki şema fiziksel uygulama olarak doğrulanmadı.',
      'Özgün Simulation.solve native PASS, katalog devresi, Windows/3D ve bağımsız kabul bu soruyla kanıtlanmaz.']};
  }
 })();


 // SC1356–SC1405: targeted measurement/mechanics/electrical/installation quizzes.
 // SC1397 is a chapter-heading marked wiring: intentionally untouched (REVIEW).
 (() => {
  const records=[[1356,"Mikrometrede sabit örs, hareketli mil ve ölçüm skalası birlikte çalışır.","Küçük bir parçanın iki yüzeyi arasındaki mesafe, hassas ilerleyen mil ve sabit örs arasında okunur. Hassasiyet için aletin sıfır ayarı da önemlidir.","Mikrometrede hangi iki bölüm parça boyutunu sınırlar?","Sabit örs ve hareketli ölçme mili.","Elektrik motorunun rotor ve statoru.","Kablonun faz ve nötr uçları.","Mikrometre milinin ilerlemesiyle ölçü yüzeyleri arasındaki açıklık okunur."],[1357,"Dış çap mikrometresi silindirik bir parçanın dış çapını hassas ölçmek için kullanılır.","Aynı milin çapını birkaç noktadan düşün: değerler farklı çıkarsa parça tam yuvarlak olmayabilir. Ölçüm, sıkıştırma kuvvetinden de etkilenebilir.","Bir milin dış çapını hassas karşılaştırmak için hangisi uygundur?","Dış çap mikrometresi.","Lüksmetre.","Frekansmetre.","Dış çap mikrometresi küçük dış ölçüler için tasarlanmıştır."],[1358,"Lüksmetre, bir yüzeye ulaşan aydınlanma düzeyini lüks (lx) cinsinden gösterir.","Çalışma masasının ve pencere kenarının aydınlığı farklı olabilir. Lüks, ışık kaynağının gücüyle değil ölçülen yüzeyin aydınlanmasıyla ilgilidir.","Lüksmetrede hangi birim beklenir?","Lüks (lx).","Desibel (dB).","Devir/dakika (rpm).","Aydınlanma düzeyinin birimi lükstür."],[1359,"Takometre, dönen bir parçanın dönme hızını genellikle rpm cinsinden gösterir.","Bir mil yavaş ya da hızlı dönerken devir sayısı değişir. Takometre elektrik akımı değil dönme hızını izler.","1200 rpm gösteren takometre neyi bildirir?","Milin dakikada 1200 devir yaptığını.","1200 volt gerilim olduğunu.","1200 lüks aydınlanmayı.","rpm, dakika başına devir anlamına gelir."],[1360,"Dijital takometre, uygun algılayıcıdan gelen dönme darbelerini işleyerek devir gösterebilir.","Bir dönüşte tek algılama işareti varsa bir tur bir darbe verir. Bir turda birden çok işaret varsa cihazın buna göre yorumlaması gerekir.","Optik bir takometrede algılama işareti sayısı neden önemlidir?","Darbe sayısını gerçek devir sayısına dönüştürmek için.","Motoru otomatik üç faza çevirmek için.","Ortam sıcaklığını azaltmak için.","Darbe/devir oranı bilinmeden darbe frekansı doğrudan rpm sayılamaz."],[1361,"rpm, dakikadaki devir sayısıdır; saniyedeki devir için 60'a bölünür.","Bir mil 1200 kez bir dakikada dönerse saniyede 20 kez döner. Bu dönüşüm devir ölçümünü yorumlamayı kolaylaştırır.","1200 rpm kaç devir/saniyedir?","20 devir/saniye.","72.000 devir/saniye.","1200 devir/saniye.","1200 / 60 = 20 devir/saniye."],[1362,"Desibelmetre ses basınç seviyesini desibel ölçeğinde gösterir; bu ölçek logaritmiktir.","Sesin 60 dB'den 70 dB'ye çıkması sadece sıradan doğrusal on birim artış gibi düşünülmez. Aynı referansta 10 dB artış ses şiddetinde yaklaşık on kat farkla ilişkilidir.","Desibel ölçeği için hangi ifade doğrudur?","Logaritmik bir ölçektir.","Her 10 dB artış sesi yalnız 10 watt artırır.","Sadece motor devrini ölçer.","Desibel düzeyleri referans bir büyüklüğe göre logaritmik ifade edilir."],[1363,"Termometre sıcaklık ölçer; Celsius ve Kelvin gibi birimler aynı fiziksel büyüklüğü farklı başlangıçlarla belirtir.","Bir ortamın 25 °C olması, 25 kelvin olduğu anlamına gelmez. Termometre ölçüm koşuluna ve sensör türüne göre yanıt verir.","Sıcaklığın yaygın birimi hangisidir?","Santigrat derece (°C).","Lüks (lx).","Amper (A).","°C sıcaklık birimidir; elektrik akımı veya aydınlanma değildir."],[1364,"Temel mekanik uygulamalarda ölçme, kesme, delme ve yüzey düzeltme farklı işlemlerdir.","Bir parça işlenecekse önce beklenen ölçü belirlenir; yapılan işlemin sonucu daha sonra kontrol edilir. Bu kavramlar aynı işi anlatmaz.","Mekanik atölye işinde ölçme işleminin amacı nedir?","Boyutu belirlemek ve sonucu kontrol etmek.","Tek başına parçayı delmek.","Elektrik frekansını yükseltmek.","Ölçme, geometrik bilgiyi verir; kesme ve delme malzemeyi işler."],[1365,"Ölçme ve kesme birbirinden ayrı adımlardır; işlenecek boyut önce anlaşılmalıdır.","Bir çizimde iki kenar arasına 30 mm yazıldığını düşün. Önce neyin 30 mm olduğuna karar vermek, sonucun doğruluğunu değerlendirmek için gerekir.","Kesme öncesinde ölçünün işaretlenmesinin temel amacı nedir?","İstenen boyut ve kesim yerini belirlemek.","Malzemenin özdirencini sıfırlamak.","Ölçüm cihazını voltmetreye çevirmek.","İşaretleme, geometrik hedefi görünür kılar."],[1366,"Ölçüm hedefi, tolerans ve kontrol birbirinden ayrılır.","Bir çizimde 20,0 ±0,2 mm yazarsa bütün parçaların tam 20,000 mm olması beklenmez. Kabul aralığı belirtilmiştir.","20,0 ±0,2 mm ölçünün kabul edilebilir aralığı nedir?","19,8–20,2 mm.","19,0–21,0 mm.","Yalnız 20,0 mm.","Tolerans nominal değerin artı ve eksi izin verilen sapmasıdır."],[1367,"Uzunluk ölçümünde mm, cm ve metre doğru dönüştürülmelidir.","Cetvelde 3,5 cm gördüğünde bunu milimetre cinsinden 35 mm yazabilirsin. Birimler aynı uzunluğu ifade eder.","3,5 cm kaç mm eder?","35 mm.","3,5 mm.","350 mm.","1 cm = 10 mm olduğundan 3,5 × 10 = 35 mm."],[1368,"Mengene iş parçasını sabit tutmak için kullanılan bir bağlama aracıdır.","Bir parça ölçülürken veya uygun işlem için sabitlenirken oynamaması önemlidir. Mengeneyi ölçü aleti ya da kesici motorla karıştırma.","Mengenelerin temel işlevi hangisidir?","İş parçasını sabitlemek.","Frekans ölçmek.","Malzemeyi elektriksel olarak yalıtmak.","Mengene bir iş parçası bağlama düzeneğidir."],[1369,"El testeresi, dişli bıçağıyla malzemeyi kesen manuel araçtır.","Dişli bıçağın görevi malzemeden küçük parçacıkları uzaklaştırarak kesik oluşturmaktır. Testere ve eğe aynı işlevi görmez.","El testeresi malzemeyi hangi bölümüyle keser?","Dişli testere bıçağıyla.","Elektriksel ölçüm probuyla.","Kondansatör plakasıyla.","Dişler malzemeden talaş kaldırarak kesme etkisi oluşturur."],[1370,"Delme malzemede delik oluşturur; vidalama bağlantı elemanını yerleştirir veya söker.","Matkap ucu ile vida aynı amaçla kullanılmaz. Alet seçimini işlem türüne göre düşünmek gerekir.","Delme ve vidalama arasındaki temel fark nedir?","Delme delik oluşturur; vidalama vida bağlantısını işler.","İkisi de yalnız gerilim ölçer.","Delme her zaman diş açmak anlamına gelir.","İki işlem farklı malzeme ve bağlantı amaçlarına hizmet eder."],[1371,"Matkap ucu delik oluşturmak için kullanılan kesici takımdır.","Bir parçaya açılmış deliğin çapı ile ucu üzerindeki nominal çap ilişkili olabilir; gerçekleşen boyut için kontrol gerekebilir.","Delme işleminin geometrik sonucu genellikle nedir?","Malzemede delik oluşturmak.","Metalde elektrik direncini sıfırlamak.","Bir voltmetrenin iç direncini artırmak.","Delme, uygun takım ile malzemeden talaş alarak boşluk oluşturur."],[1372,"Vida, dişli geometrisi sayesinde sökülebilir mekanik bağlantılarda kullanılabilir.","Vida başı ve diş, farklı işlevler taşır. Her vida aynı diş adımı ve malzeme için uygun değildir.","Vida üzerindeki helisel dişin işlevi nedir?","Dönme ile eksenel ilerleme ve tutunma sağlamak.","Elektrik akımını doğrultmak.","Işık şiddetini ölçmek.","Vida dişi bir mekanik bağlantı geometrisidir."],[1373,"Eğe, yüzeyden kontrollü miktarda malzeme kaldırıp biçim veya yüzey düzeltmeye yarar.","Bir kenarın küçük pürüzlerini azaltmayı düşün. Eğe ölçüm cihazı değildir; malzeme yüzeyini işler.","Eğelemenin temel etkisi nedir?","Yüzeyden az miktarda malzeme kaldırmak.","Devir frekansını doğrudan ölçmek.","Gerilim üretmek.","Eğenin dişleri malzemeden talaş kaldırır."],[1374,"Zımparalama aşındırıcı yüzeyle pürüzleri azaltır; şekil verme ise istenen geometriyi oluşturmayı amaçlar.","Bir parçada kaba biçimlendirme ile son yüzey kalitesi ayrı hedefler olabilir. İşlem öncesi malzemenin türü ve gerekli yüzey sonucu bilinmelidir.","Zımparalama daha çok hangi sonuçla ilgilidir?","Yüzey pürüzlülüğünü azaltmakla.","Akımın yönünü değiştirmekle.","Kondansatör kapasitesi ölçmekle.","Aşındırıcı taneler yüzeydeki küçük çıkıntıları azaltır."],[1375,"Taşlama ve zımparalama aşındırıcı işlem sınıfındadır; risk ve koruma koşulları ayrı değerlendirilir.","Özellikle döner aşındırıcılar kıvılcım ve parçacık oluşturabilir. Bu yüzden sadece yüzey sonucunu değil koruyucu düzeni de düşünmek gerekir.","Taşlama ve zımparalamanın ortak prensibi hangisidir?","Aşındırıcı etkiyle yüzeyi işlemek.","Elektrik akımını manyetik alanla ölçmek.","Sıcaklığı Kelvin'e çevirmek.","İki yöntemde de aşındırıcı temas malzemeden küçük parçalar ayırır."],[1376,"Bükme ve kıvırma, malzemeye istenen geometrik eğrilik veya açı kazandırır.","Düz bir sac veya tel düşün. Bükme işleminde amaç her zaman parçayı kesmek değil geometrisini değiştirmektir.","Bükme işleminin temel sonucu nedir?","Parçanın geometrisinin değişmesi.","Parçanın otomatik olarak elektrik üretmesi.","Lüks düzeyinin artması.","Bükme, malzemeye şekil kazandırmaya yönelik işlemdir."],[1377,"Elektriksel ölçme gerilim, akım, direnç ve diğer büyüklüklerin uygun araçla değerlendirilmesidir.","Aynı devrede volt ve amper farklı şeyler anlatır. Sonucu doğru yorumlamak için ölçülen büyüklüğü birimiyle belirt.","Gerilim ölçümünün birimi hangisidir?","Volt (V).","Amper (A).","Ohm (Ω).","Gerilim volt, akım amper ve direnç ohm ile ifade edilir."],[1378,"Temel devrede kaynak, iletken, yük ve uygun anahtarlama öğeleri birlikte düşünülür.","Bir DC kaynakla lambanın çalışmasını düşün. Akımın dolaşabileceği tamamlanmış bir yol yoksa beklenen yük davranışı görülmez.","Basit elektrik devresinde yükün çalışması için temel gereklilik nedir?","Uygun kaynak ve tamamlanmış akım yolu.","Yalnız parçaların aynı renkte olması.","Devre başlığını değiştirmek.","Elektriksel yolun sürekliliği önemlidir."],[1379,"Elektrik devresi elemanlarının görevleri kaynağa, yüke ve kontrol elemanına göre ayrılır.","Bir pil, direnç ve anahtar düşün. Pil enerji sağlar, direnç akımı sınırlar, anahtar bağlantının durumunu değiştirir.","Bir DC devrede kaynağın temel görevi nedir?","Devreye elektriksel enerji sağlamak.","Direnci doğrudan ölçmek.","Tüm iletkenleri mekanik bağlamak.","Kaynak elektriksel potansiyel farkı ve enerji sağlar."],[1380,"Seri bağlantıda aynı akım yolundan geçilir; paralelde elemanların uçları ortak düğümler arasındadır.","Yan yana iki direnç tek akım yolu oluşturuyorsa seri; iki ucu aynı iki noktadaysa paraleldir. Yalnız çizimde yakın olmaları yeterli değildir.","İki direncin seri olduğunun göstergesi nedir?","İkisinin aynı dallanmayan akım yolunda bulunması.","İkisinin mutlaka aynı renkte çizilmesi.","İkisinin daima aynı gerilimde olması.","Seri elemanlar aynı dal akımını taşır."],[1381,"Elektriksel ölçü aletleri ölçtükleri büyüklüğe göre seçilir.","Voltmetre gerilimi, ampermetre akımı, ohmmetre direnci ölçer. Multimetre bunların birden fazlasını sunabilir.","Hangisi doğru araç-büyüklük eşleşmesidir?","Voltmetre: gerilim; ampermetre: akım.","Voltmetre: mekanik hız; ampermetre: ışık.","Ohmmetre: lüks; takometre: ohm.","Alet seçimi hedef elektriksel büyüklüğe bağlıdır."],[1382,"Elektriksel büyüklüklerin birimleri birbirine karıştırılmaz.","Bir değerin başında 2 yazması yetmez. 2 volt ile 2 amper aynı büyüklük değildir.","Direnç değeri hangi birimle yazılır?","Ohm (Ω).","Hertz (Hz).","Lüks (lx).","Elektriksel direnç ohm ile ifade edilir."],[1383,"Ölçü aleti türü, ölçülen büyüklük ve uygun ölçüm yöntemi birlikte değerlendirilir.","Tek bir multimetrede gerilim, direnç veya akım işlevleri olabilir, ancak seçilen işlev ve bağlantı aynı değildir.","Multimetreyi yalnız tek büyüklük ölçen aletlerden ayıran özellik nedir?","Birden fazla elektriksel büyüklüğü ölçebilmesi.","Daima üç faz güç kaynağı olması.","Mekanik delik açabilmesi.","Multimetre birden çok ölçüm işlevini bir arada sunabilir."],[1384,"Çözünürlük, ekranda görülebilen en küçük adımı; doğruluk ise gerçek değere yakınlığı anlatır.","Bir alet çok basamak gösterse de tek başına kusursuz doğruluk garanti etmez. Çözünürlük ile hata payını ayır.","Ölçü aletinde çözünürlük neyi anlatır?","Ayırt edilebilen en küçük gösterim adımını.","Gerçek değerden hiç sapmamasını.","Koruma topraklamasının direncini.","Yüksek çözünürlük tek başına yüksek doğruluk anlamına gelmez."],[1385,"Voltmetre potansiyel farkını iki nokta arasında ölçer; idealde yüksek giriş direncine sahiptir.","Bir direnç üzerindeki gerilim, direncin iki ucu arasındaki farktır. Ölçüm kavramı akım yoluna seri eklenen ampermetreden farklıdır.","Voltmetreyle bir yükün gerilimi hangi noktalar arasında değerlendirilir?","Yükün iki ucu arasında, paralel olarak.","Yalnız tek bir iletkenin ortasında seri olarak.","Sadece koruma iletkeni üzerinde.","Gerilim iki nokta arasındaki potansiyel farkıdır."],[1386,"Ampermetre yükün geçtiği akım yoluna seri yerleştirilerek dal akımını ölçer.","Gerilimi iki nokta arasında okumak ile akımın aynı koldan geçmesini ölçmek farklı kavramlardır. Akım ölçümünde düşük iç direnç önemlidir.","Ampermetre hangi bağlantı kavramıyla ölçüm yapar?","Ölçülecek akım koluna seri bağlantıyla.","Yalnız yüke paralel bağlanarak.","Koruma iletkenini devre dışı bırakarak.","Ampermetre ilgili dal akımını seri akım yolunda algılar."],[1387,"mA ve A birimleri arasında 1000 katsayısı vardır.","250 mA, bir amperin dörtte biridir. Küçük akımları amper cinsinden ifade etmek birim karışıklığını azaltır.","250 mA kaç amper eder?","0,25 A.","25 A.","250.000 A.","250/1000 = 0,25 amper."],[1388,"Pens ampermetre, uygun türde bir iletkenin çevresindeki manyetik etki üzerinden akımı algılar.","Akım geçen iletkenin oluşturduğu manyetik alan ölçüme temel olabilir. Aynı anda gidiş ve dönüş akımlarının alanları birbirini dengeleyebilir.","Pens ampermetrenin algılamasında hangi fiziksel etki kullanılır?","Akımın oluşturduğu manyetik alan.","Yalnız aydınlanma düzeyi.","Sıcaklık sensörünün direnci.","Pens ölçümünde manyetik alan üzerinden akım değerlendirilir."],[1389,"Hertz, saniyedeki tekrar sayısını ifade eder.","50 Hz'lik periyodik işaret bir saniyede 50 tam çevrim yapar. Bu sayı genlik veya akımın amper değeri değildir.","50 Hz frekans saniyede kaç çevrim ifade eder?","50 çevrim.","3000 çevrim.","0,02 çevrim.","Frekans birimi hertz, saniyede çevrim sayısıdır."],[1390,"Wattmetre etkin gücü, güç katsayısı ölçümü ise gerilim-akım ilişkisini değerlendirir.","AC devrede watt cinsinden gerçek güç ve cosφ ayrı büyüklüklerdir. Aynı sayısal sonucu vermeleri gerekmez.","Kosinüsfimetrenin ölçtüğü büyüklük hangisidir?","Güç katsayısı (cosφ).","Yalnız enerji tüketimi (kWh).","Milin devir sayısı (rpm).","Güç katsayısı, görünür ve etkin güç ilişkisini tanımlar."],[1391,"Wattmetre elektriksel etkin gücü watt cinsinden ifade eder.","Aynı gerilimde farklı akım ve yük türleri farklı güç tüketebilir. Güç ile zamanla biriken enerji aynı değildir.","Wattmetre üzerinde beklenen temel birim hangisidir?","Watt (W).","Kilowatt-saat (kWh).","Lüks (lx).","Watt, güç birimidir; kWh ise enerji birimidir."],[1392,"Güç katsayısı cosφ, AC devrede etkin gücün görünür güce oranıdır.","Bir yükün görünür gücü 1000 VA, etkin gücü 800 W ise güç katsayısı 0,8 olur. Bu sayı enerji miktarından farklıdır.","800 W etkin ve 1000 VA görünür güçte cosφ kaçtır?","0,8.","1,25.","200.","cosφ = P/S = 800/1000 = 0,8."],[1393,"Elektrik sayacı, zaman boyunca tüketilen elektrik enerjisini genellikle kWh cinsinden biriktirir.","Bir cihazın gücü anlık bir hız gibidir. Elektrik sayacı o hızın zaman boyunca oluşturduğu enerji toplamını izler.","Elektrik sayacında tüketim genellikle hangi birimle gösterilir?","kWh.","kW/s.","rpm.","Enerji tüketimi güç ile çalışma süresinin çarpımıdır."],[1394,"Bir kilowatt-saat (1 kWh), bin watt-saat (1000 Wh) enerjiye eşittir.","Birim değişince tüketilen enerji miktarı değişmez; yalnız yazılış farklılaşır.","2,5 kWh kaç Wh eder?","2500 Wh.","2,5 Wh.","0,0025 Wh.","Kilowatt-saatten watt-saate geçerken 1000 ile çarpılır."],[1395,"Enerji sayacının temel görevi birikimli enerjiyi izlemektir; cihaz tipleri ölçüm ve tarife özelliklerine göre ayrılır.","Anlık güç göstergesi 500 W okuyabilirken enerji sayacı gün boyunca biriken kWh değerini artırır. İkisini karıştırma.","Elektrik sayacını wattmetreden ayıran temel işlev nedir?","Zaman boyunca biriken enerji tüketimini kaydetmek.","Yalnız devrin rpm değerini okumak.","Yalnız ortam sıcaklığını ölçmek.","Sayaç enerjiyi zaman içinde toplar."],[1396,"Enerji tüketimi güç × süredir; birimler kW ve saat olursa sonuç kWh olur.","İki kilowatt gücündeki bir cihaz üç saat aynı güçte çalışırsa tüketimi 6 kWh olur. Bu, gerçek cihazın sabit güç kullandığı varsayımıyla yapılan örnektir.","Sabit 2 kW güçle 3 saat çalışma kaç kWh eder?","6 kWh.","2/3 kWh.","18 kWh.","Enerji = güç × süre; 2 kW × 3 saat = 6 kWh enerji."],[1398,"İletken bağlantısında hem elektriksel süreklilik hem yalıtım ve uygun mekanik bağlantı önemlidir.","İki iletkenin birbirine yalnız değmesi güvenilir bağlantı kanıtı değildir. İletken, terminal ve kullanım şartı birlikte değerlendirilir.","Bir iletken bağlantısının temel iki niteliği hangisidir?","Elektriksel süreklilik ve uygun mekanik güvenilirlik.","Yalnız dış kılıfın rengi.","Yalnız devre şemasındaki simge büyüklüğü.","Bağlantı elektriksel ve mekanik gerekliliklerle değerlendirilir."],[1399,"İletkenin malzemesi, kesiti ve yalıtımı kullanım amacına göre değerlendirilir.","İki kablo aynı renkte görünse bile kesitleri veya yalıtım özellikleri farklı olabilir. Renk tek başına akım taşıma uygunluğunu göstermez.","İletkenin elektriksel direncini etkileyen özellik hangisidir?","Malzeme, uzunluk ve kesit.","Yalnız kablo renginin tonu.","Devre başlığındaki kelime sayısı.","Direnç iletkenin özdirencine, uzunluğuna ve kesitine bağlıdır."],[1400,"İletken bağlantı araçları farklı görevler üstlenir: kesme, sıyırma, sıkma ve bağlantı kontrolü.","Bir bağlantıda tek bir pense her iş için doğru araç olmayabilir. Amaç hangi görevin gerekli olduğunu anlamaktır; bu soru gerçek tesisat yapma talimatı değildir.","İzolasyon sıyırma aracı hangi işleve yöneliktir?","İletkenin yalıtım katmanını belirlenen yerde ayırmaya.","Elektrik tüketimini kWh ölçmeye.","Devre frekansını otomatik ayarlamaya.","İşlem türüne uygun araç seçimi bağlantı kalitesinin bir parçasıdır."],[1401,"Bağlantı elemanı, iletkenlerin uygun terminalde mekanik ve elektriksel olarak tutulmasını amaçlar.","Klemens ve yaylı bağlantı elemanları farklı tasarlanabilir. Gerçek uygulamada uygun ürün onayı ve kesit aralığına bakılması gerekir.","Klemens seçerken hangi bilgi önemlidir?","Uygun iletken kesiti ve üretici anma değerleri.","Yalnız kapağının rengi.","Sembolün ekrandaki genişliği.","Bağlantı ürünü kullanım sınırlarıyla eşleşmelidir."],[1402,"Zil tesisatı çağrı/sesli uyarı, diyafon sistemi ise taraflar arası konuşma veya iletişim işlevini üstlenir.","Bir kapı zilinin çalması ve diyafondan konuşma yapılması aynı işlev değildir. Devre çizimini anlamadan önce hangi işaretin aktarıldığını düşün.","Zil ile diyafon arasındaki temel işlev farkı hangisidir?","Zil çağrı verir; diyafon iletişim sağlar.","Diyafon yalnız direnç ölçer.","Zil her zaman motor hızını kontrol eder.","Uyarı sinyali ile çift yönlü iletişim farklı sistemlerdir."],[1403,"Zayıf akım sistemleri haberleşme, sinyalizasyon veya düşük gerilimli kontrol amaçları taşıyabilir.","'Zayıf akım' sözü her bağlantıya bilinçsizce dokunulabileceği anlamına gelmez. Gerilim sınıfı, besleme ve üretici şartları yine değerlendirilir.","Zayıf akım tesisatları için hangisi doğrudur?","Sinyal ve haberleşme işlevleri içerebilir, yine uygun koruma gerekir.","Bütün uçlara her koşulda dokunmak güvenlidir.","Yalnız üç fazlı motor besler.","Sistem adı tek başına fiziksel güvenlik garantisi değildir."],[1404,"Zil butonu çağrıyı başlatır; zil sesli uyarıyı üretir; diyafon ise konuşma bileşenlerini içerir.","Kapıdan birinin arama yaptığı bir sistemi düşün. Buton ve sesli uyarı ayrı görevlerdedir; diyafon mikrofon ve hoparlör gibi haberleşme öğeleri de içerebilir.","Bir diyafonun konuşma işlevinde hangisi yer alabilir?","Mikrofon ve hoparlör.","Yalnız ampermetre.","Motor koruma rölesi.","Diyafon sisteminde sesin algılanması ve iletilmesi gerekir."],[1405,"Montaj elemanları tesisat cihazlarının sabitlenmesini ve uygun yerleşimini destekler.","Bir zil ünitesi ve diyafon cihazının sabit durması önemlidir. Montaj parçası elektriksel işlevin yerine geçmez; ürünün güvenli yerleşimiyle ilgilidir.","Zil veya diyafon montaj elemanının temel görevi nedir?","Cihazı uygun konumda mekanik olarak sabitlemek.","Sesi doğrudan dijital veriye çevirmek.","Şebeke frekansını artırmak.","Montaj elemanları yerleşim ve mekanik güvenilirliği destekler."]];
  for(const [seq,summary,explanation,question,correct,badA,badB,why] of records){
   const l=L.lessons[seq-1],v=l?.pedagogyReview;
   if(!l||l.kind!=='quiz'||v?.independentPedagogicalAcceptance===true)continue;
   if(!/^(Akım ölçümü yapılırken|Bu başlıktaki uygulamaya başlamadan)/.test(l.quiz?.question||''))continue;
   if(l.sc1356_1405ConceptRepair)continue;
   const answer=seq%3,options=[badA,badB];options.splice(answer,0,correct);
   l.summary=summary;l.explanation=explanation;l.quiz={question,options,answer,why};
   l.sc1356_1405ConceptRepair='SC1356_1405_TITLE_ALIGNED_CONCEPT_V1';
   const review=v||(l.pedagogyReview={});
   if(!review.titleTopologyStatus)review.titleTopologyStatus='REVIEW';
   review.titleMatchedQuizRepair='SC1356_1405_TITLE_ALIGNED_CONCEPT_V1';
   review.independentPedagogicalAcceptance=false;
   if(l.practiceGuide)l.practiceGuide={...l.practiceGuide,
    method:'concept-check',heading:'Kavramı örnekle anla',
    virtualOnly:true,canonicalGraphUnchanged:true,physicalTestAccepted:false,
    pedagogicalAcceptance:false,
    steps:['Bu dersin konusu: '+l.title+'.','Temel fikir: '+summary,
     'Soruyu cevapla; ardından nedenini kendi sözlerinle anlat.'],
    observations:['Bu kavramsal sorudur; ekrandaki eski örnek devre bu başlığın fiziksel uygulaması olarak doğrulanmamıştır.',
     'Özgün Simulation.solve native PASS, katalog terminali, Windows/3D, fiziksel ve bağımsız pedagojik kabul bu soru ile kanıtlanmaz.']};
  }
 })();


 // SC1406–1455: 50 individual subject-specific conceptual quiz fixes.
 // The original project topology is not a validated representation of these topics.
 (() => {
  const records=[[1406,"Zil ve diyafon çiziminde önce çağrı, besleme ve konuşma bölümleri işlevlerine göre ayrılır.","Apartman girişini düşün: kapıdaki çağrı düğmesi, dairedeki zil ve konuşma ünitesi farklı görevler yapar. Çizim, her işlevi uygun sembolle göstermeli; gerçek kablolama bu quizle onaylanmaz.","Zil/diyafon proje çiziminde çağrıyı başlatan öğe hangisidir?","Kapıdaki çağrı butonu.","Dairedeki sesli uyarı birimi.","Diyafonun hoparlörü.","Buton çağrı isteğini oluşturur; zil ve hoparlör başka görevler yapar."],[1407,"Aydınlatma ve priz tesisatı, farklı kullanım amaçlarına hizmet eden ayrı yük ve koruma düzenleri içerir.","Bir odada lamba ve priz aynı şey değildir: biri aydınlatmayı, diğeri uygun cihazlara enerji sağlamayı amaçlar. Çizimde her birinin işlevi ve devre bilgisi ayrı okunur.","Bir tesisat projesinde priz sembolü neden lamba sembolüyle değiştirilemez?","Priz ile lamba farklı kullanım ve bağlantı işlevleri taşır.","İkisi de mutlaka aynı akımı çeker.","Semboller yalnız dekor amaçlıdır.","Sembol doğru ekipmanı ve işlevini tanımlamalıdır."],[1408,"Kuvvetli akım tesisatında temel konu enerjinin yük ve koruma elemanlarına güvenli biçimde dağıtılmasıdır.","Bir binanın enerji yolunu ana dağıtımdan kullanım noktalarına uzanan bir ağ gibi düşün. İletken ve koruma seçimi yetkili tasarıma bağlıdır; kavramsal şema fiziksel uygunluk belgesi değildir.","Kuvvetli akım tesisatının temel görevi nedir?","Elektrik enerjisinin kullanılacak yüklere dağıtılması.","Yalnız veri paketlerinin yönlendirilmesi.","Sadece telefon sesi iletilmesi.","Kuvvetli akım devreleri elektrik enerjisinin iletimi ve dağıtımıyla ilgilidir."],[1409,"Aydınlatma ve priz malzemeleri; anahtar, priz, armatür, iletken ve koruma öğeleri gibi farklı görevlere ayrılır.","Bir odanın malzeme listesinde her parçanın görevi olmalı. Anahtar kumanda, armatür aydınlatma, priz uygun bağlantı sağlar; bu işlevler birbirine karıştırılmaz.","Bir aydınlatma devresinde armatürün temel görevi nedir?","Işık üretmek veya ışık kaynağını taşımak.","Topraklama direncini ölçmek.","Enerji sayacını sıfırlamak.","Armatür aydınlatma yükünün bulunduğu donanımdır."],[1410,"Koruma iletkeni PE, arıza koşullarında dokunma riskinin azaltılmasına yardımcı olan koruma düzeninin parçasıdır.","Metal gövdeli bir cihazın arızalandığını düşün. PE ve uygun koruma aygıtları birlikte değerlendirilir; nötr iletkeni koruma iletkeninin yerine rastgele kullanılamaz.","Koruma iletkeni (PE) ile nötr (N) için hangi ifade doğrudur?","Görevleri farklıdır; PE koruma sisteminin bir parçasıdır.","PE her durumda N yerine bağlanabilir.","PE yalnız cihaz hızını ayarlar.","PE'nin görevi arıza durumlarındaki korumaya katkı sağlamaktır."],[1411,"Tesisat çizimi, standart sembol, hat ve açıklamalarla elemanların görev ve ilişkilerini okunur kılar.","Kâğıtta birbirine yakın iki çizgi düşün; yalnız yakın olmaları bağlı olduklarını kanıtlamaz. Devre şeması, bağlantıları ve hangi sembolün neyi anlattığını açıkça göstermelidir.","Aydınlatma/priz tesisat çiziminde sembol kullanmanın amacı nedir?","Elemanların görevini ve bağlantı ilişkisini anlaşılır göstermek.","Gerçek montaj denetiminin yerini almak.","Koruma elemanlarını gereksiz yapmak.","Sembol ve çizgiler tasarımın okunmasını sağlar."],[1412,"Sayaçlı tesisatta enerji tüketiminin ölçülmesi ile koruma ve dağıtım işlevleri birbirinden ayrılır.","Bir binanın elektrik sayacını düşün: tüketilen elektrik enerjisini kaydeder; bir koruma şalterinin görevini üstlenmez. Sayaç projesi yetkili kurallara göre ayrıca incelenir.","Elektrik sayacı temel olarak hangi büyüklüğü kaydeder?","Tüketilen elektrik enerjisini (kWh).","Motor milinin devir yönünü.","Kablonun mekanik uzunluğunu.","Enerji sayacı birikimli enerji tüketimini izler."],[1413,"Temel elektronik ölçümlerde gerilim, akım ve direnç farklı niceliklerdir; her biri uygun ölçüm yöntemi ister.","Bir devreye bakarken üç soru sor: iki nokta arasında kaç volt var, koldan kaç amper geçiyor, elemanın direnci kaç ohm? Bu değerler aynı büyüklük değildir.","Elektriksel potansiyel farkın SI birimi hangisidir?","Volt (V).","Amper (A).","Ohm (Ω).","Gerilim voltla; akım amperle, direnç ohmla ifade edilir."],[1414,"Breadboard aynı satırda içten bağlı delik gruplarıyla lehimsiz prototip kurmaya yarar.","Kartta yan yana delikler görsen de her delik komşusuna bağlı olmak zorunda değil. Bağlı şeritleri ve ortadaki kanalı okuyarak küçük düşük gerilimli bir prototipin yerleşimini anlarsın.","Breadboard ortasındaki ayrım kanalı genellikle ne sağlar?","Karşılıklı terminal sıralarını elektriksel olarak ayırır.","Tüm delikleri tek düğüm yapar.","Akımın yönünü kendiliğinden değiştirir.","Orta kanal özellikle entegre yerleşiminde iki tarafın kısa devre olmasını önler."],[1415,"Direnç, akımın geçişine karşı koyar; değeri ohm cinsinden belirtilir.","Aynı gerilimde iki farklı direnç düşün. Daha büyük direnç genellikle daha küçük akım demektir; direnç çeşidi ise sabit, ayarlı ya da çevreye duyarlı olabilir.","Aynı DC gerilimde direnç artarsa Ohm kanununa göre akım ne olur?","Azalır.","Kesinlikle artar.","Dirençle ilişkisi yoktur.","I=V/R olduğundan V sabitken R artarsa I azalır."],[1416,"Sabit direnç, normal kullanımda kullanıcı tarafından sürekli ayarlanmayan belirli bir nominal değere sahiptir.","Bir şemada 1 kΩ yazan direnci düşün. Üretim toleransı ve sıcaklık değeri etkileyebilir, ancak bu parça potansiyometre gibi kullanıcı tarafından ayarlanmaz.","Sabit direnç için hangisi doğrudur?","Nominal direnci tanımlıdır; tolerans payı olabilir.","Sürgü hareketiyle sürekli ayarlanır.","Her zaman sıfır ohmdur.","Sabit direnç değerinin nominal ve tolerans bilgisi bulunur."],[1417,"Ayarlı dirençte sürgü veya ayar ucu, devrede kullanılan direnç oranını değiştirebilir.","Ses seviyesini çevirerek ayarladığın bir düğmeyi düşün. Potansiyometrenin orta sürgü ucu konum değiştirdikçe uçlar arasındaki oran değişebilir.","Üç uçlu potansiyometrede orta uç çoğunlukla neyi temsil eder?","Hareketli sürgü ucunu.","Koruma topraklamasını.","Diyot katodunu.","Sürgü, direnç yolu üzerinde ayarlanabilir ara bağlantıdır."],[1418,"LDR ışığa, NTC ve PTC ise sıcaklığa bağlı direnç değişimi gösterebilir.","Gece yanan bir bahçe ışığının ışık algılamasını düşün; ortamın aydınlığı değiştikçe LDR direnci değişebilir. NTC ve PTC içinse belirleyici çevre etkisi sıcaklıktır.","Tipik NTC termistörde sıcaklık yükselince direnç nasıl değişir?","Azalır.","Mutlaka artar.","Her sıcaklıkta aynı kalır.","NTC, negatif sıcaklık katsayılı dirençtir."],[1419,"Direnç renk bantlarında rakam, çarpan ve tolerans bilgileri birlikte okunur.","Dört bantlı bir dirençte ilk iki bant rakamı, üçüncü bant çarpanı, dördüncü bant toleransı anlatır. Renkleri sırayla okumak aynı sayıyı elde etmenin yoludur.","Dört bantlı dirençte son bant çoğunlukla neyi gösterir?","Toleransı.","Devrenin çalışma frekansını.","Kondansatör polaritesini.","Dört bantlı standart kodda dördüncü bant tolerans bilgisidir."],[1420,"Direnç birimi dönüşümünde 1 kΩ = 1000 Ω ve 1 MΩ = 1 000 000 Ω'dur.","Şemada 2,2 kΩ gördüğünde binle çarparak 2200 Ω okursun. Değer değişmedi; sadece büyüklüğün yazıldığı birim değişti.","2,2 kΩ kaç ohmdur?","2200 Ω.","22 Ω.","220 000 Ω.","Kilo öneki 1000 ile çarpma anlamına gelir."],[1421,"Dört bantlı dirençte ilk iki renk rakamı, üçüncüsü onluk çarpanı gösterir.","Kahverengi-siyah-kırmızı-altın dizisini hayal et: 1 ve 0, ardından yüzle çarpım. Son altın bant tolerans bilgisidir; sonuç 1000 ohmdur.","Kahverengi–siyah–kırmızı–altın dört bantlı direnç kaç ohmdur?","1000 Ω (1 kΩ).","100 Ω.","10 kΩ.","10 × 10² = 1000 Ω; altın bant tipik ±%5 toleransı gösterir."],[1422,"Ohm kanunu gerilim, akım ve direnç arasındaki ilişkiyi açıklar: I=V/R.","Sanal 12 V kaynağa 6 Ω direnç bağlı olduğunu düşün; ideal varsayımda akım 2 A olur. Gerçekte güç ve eleman sınırları ayrıca değerlendirilir.","12 V gerilim altında 6 Ω dirençten ideal olarak kaç amper geçer?","2 A.","0,5 A.","72 A.","I=12/6=2 A hesabı Ohm kanunundan gelir."],[1423,"Kirchhoff akım kanunu, bir düğüme giren toplam akımın çıkan toplam akıma eşit olduğunu söyler.","Bir kavşakta giren araç ve çıkan araçları düşün. Elektriksel düğümde de yük birikimi yoksa akımların cebirsel toplamı sıfırdır.","Bir düğüme 5 mA giriyor ve iki koldan 2 mA ile başka bir akım çıkıyorsa ikinci çıkış kaç mA'dir?","3 mA.","7 mA.","10 mA.","Akım korunur: 5=2+3 mA."],[1424,"Multimetre uygun işlev ve kademe seçilerek birden fazla elektriksel büyüklüğü ölçer.","Tek aletle gerilim ya da direnç ölçebilirsin ama seçilen mod aynı değildir. Prob yuvaları ve ölçüm modu birlikte doğrulanmalıdır; cihazın sınırları önemlidir.","Gerilim ölçerken multimetrede hangi ölçüm türü seçilir?","Uygun AC/DC gerilim (V) modu.","Direnç (Ω) modu.","Süreklilik buzzerı zorunlu.","Gerilim ölçümü için V ölçüm işlevi kullanılmalıdır."],[1425,"LCR metre temel olarak endüktans (L), kapasitans (C) ve direnç (R) ölçer.","Bir avuç pasif elemanı masada düşün: bobin, kondansatör ve direnç. LCR metre bunları uygun ölçüm koşullarında nicel olarak karşılaştırmaya yarar.","LCR kısaltmasındaki C hangi büyüklüğü anlatır?","Kapasitansı.","Akımı.","Frekansı.","C, kondansatörün kapasitans değeridir."],[1426,"Multimetre ve LCR metre ile ölçümde istenen büyüklük, ölçüm yöntemi ve prob bağlantısı eşleşmelidir.","Bir direnç, bir kondansatör ve bir gerilim kaynağını düşün. Hepsine aynı ölçüm kademesini seçmek doğru olmaz; amaç hangi büyüklüğü ölçtüğünü bilmektir.","Kapasite değerini ölçmek için hangi işlev doğrudan uygundur?","Kapasitans (C) ölçümü.","Yalnız AC akım kademesi.","Yalnız süreklilik testi.","Kapasitans ölçümü, uygun C ölçüm işlevini gerektirir."],[1427,"Direnç ölçümü enerji verilmemiş devrede ve ölçülecek elemanın paralel yollarının etkisi düşünülerek değerlendirilir.","Bir direncin iki ucunda Ω ölçmek istiyorsun; devre üzerindeki paralel elemanlar sonucu etkileyebilir. Bu yüzden tek okuma her zaman elemanın ayrı direnç değerini göstermez.","Devre içindeki direnci ölçerken paralel başka dirençlerin bulunması neye yol açabilir?","Ölçülen eşdeğer direnci değiştirebilir.","Direncin renk bantlarını yeniden boyar.","Direnci otomatik olarak sonsuz yapar.","Ölçü aleti bağlı paralel yolları da algılayabilir."],[1428,"Gerilim ölçümü iki nokta arasındaki potansiyel farkı karşılaştırır; voltmetre buna paralel bağlanır.","Bir lambanın iki ucundaki gerilimi merak ediyorsun. Ölçülen iki nokta arasındaki fark önemlidir; akım yolunu ölçmekten ayrı bir işlemdir.","Voltmetre ideal olarak hangi bağlantıyla bir yükün gerilimini ölçer?","Yükün iki ucuna paralel.","Yükle zorunlu seri.","Yalnız koruma toprağına.","Potansiyel fark iki uç arasında ölçülür."],[1429,"Akım, bir koldan geçen yük akışıdır; ampermetre ölçülen kola seri bağlanır.","Bir devre kolundan akan akımı izlemek istiyorsun. Ampermetrenin o akım yolunda bulunması gerekir; kaynağa doğrudan paralel bağlamak doğru değildir.","Bir koldan geçen akımı ölçmenin temel bağlantı kuralı hangisidir?","Uygun ampermetreyi ölçülecek kola seri koymak.","Ampermetreyi kaynağa doğrudan paralel koymak.","Ölçü aletini yalnız boşta tutmak.","Seri yerleşimde kolun akımı ölçü aletinden de geçer."],[1430,"Elektronik devre uygulamaları önce sembol okuma, eleman tanıma ve beklenen davranışı yorumlamayı gerektirir.","Bir LED ve direnç içeren basit bir şema düşün. Şemayı anlamak, parçaların görevlerini ve doğru değerlerini kavramakla başlar; burada yalnız kavramlar sınanır.","Bir elektronik devrenin işlevini anlamada ilk bakılacak bilgi hangisidir?","Semboller, eleman değerleri ve bağlantı ilişkileri.","Çizim dosyasının arka plan rengi.","Ekrandaki simge boyutu.","İşlevi bileşen ve bağlantı bilgisi belirler."],[1431,"Elektronik şema çiziminde bileşen sembolü ile gerçek fiziksel yerleşim çizimi aynı şey değildir.","Diyot sembolünün üçgen bir kutuda çizilmediğini düşün; sembolün şekli işlevi anlatır, parçanın masada durduğu koordinatı değil. Elektriksel ağ çizgilerle ifade edilir.","Elektronik devre şemasındaki çizgilerin temel görevi nedir?","Elemanlar arasındaki elektriksel bağlantıyı göstermek.","Malzemelerin ağırlığını ölçmek.","Baskı devrenin fiyatını göstermek.","Şemada çizgi, elektriksel bağlantı ilişkisini temsil eder."],[1432,"Kondansatör elektrik alanında yük/enerji depolar; kapasitansı farad cinsinden belirtilir.","Bir kondansatörün şarj olup sonra yüke enerji verdiğini düşün. Direnç gibi yalnız akıma karşı duran bir parça değildir; değişen gerilime farklı tepki verir.","Kondansatörün depoladığı enerji hangi alandadır?","Elektrik alanında.","Yalnız mekanik yayda.","Yalnız manyetik kutupta.","Kondansatörde enerji elektrik alanına bağlıdır."],[1433,"Seramik, film ve elektrolitik kondansatörlerin yapı, değer ve polarite özellikleri farklı olabilir.","Bir küçük seramik parçayla bir elektrolitik kondansatörü düşün. Bazıları polaritesizken bazı elektrolitik türlerinde artı/eksi kutuplama zorunludur.","Hangi kondansatör grubu yaygın olarak kutupludur?","Elektrolitik kondansatörler.","Her seramik kondansatör.","Her film kondansatör.","Elektrolitik kondansatörlerde çoğu tasarımda polarite dikkate alınır."],[1434,"Üç haneli kapasite kodunda ilk iki hane rakamı, üçüncü hane pikofarad çarpanını verir.","Üzerinde 104 yazan tipik bir kondansatörü düşün: 10 ve dört sıfır pikofarad. Bu 100 000 pF, yani 100 nF eder.","Standart '104' kondansatör kodu kaç nanofaraddır?","100 nF.","10 nF.","104 nF.","10 × 10⁴ pF = 100 000 pF = 100 nF."],[1435,"Paralel kondansatörlerin eşdeğer kapasitansı toplanır; seri bağlantıda karşılıklı değerler toplanır.","İki tane 10 µF kondansatör düşün. Paralelde toplam 20 µF olur; aynı iki kondansatör seride ise 5 µF eşdeğer verir.","10 µF ve 10 µF iki kondansatör paralel ise eşdeğer kaç µF olur?","20 µF.","5 µF.","10 µF.","Paralel kapasite değerleri toplanır."],[1436,"Kapasitans ölçümü uygun C kademesiyle, enerjisiz ve güvenli biçimde değerlendirilir.","Bir kondansatörün üzerinde yazan değerle ölçülen değerin uyumunu merak ediyorsun. Ölçüm için doğru mod ve güvenli durum gerekir; bu quiz fiziksel uygulama talimatı değildir.","Kondansatörün kapasitesi hangi birimle belirtilir?","Farad (F) ve alt katları.","Henry (H).","Amper (A).","Kapasitans SI birimi faraddır."],[1437,"Bobin akıma bağlı manyetik alanda enerji depolar; endüktans henry cinsinden ifade edilir.","Bir bobinden geçen akımın değişimini düşün. Bobin bu değişime karşı bir gerilim oluşturabilir; bu davranış kondansatörünkinden farklıdır.","Bobinin depoladığı enerji ağırlıklı olarak nerededir?","Manyetik alanında.","Sadece elektrik yükü levhalarında.","Direncin renk bantlarında.","Endüktörün depoladığı enerji manyetik alanda bulunur."],[1438,"Hava nüveli ve ferromanyetik nüveli bobinler manyetik malzeme ve endüktans özellikleri açısından farklıdır.","Aynı tel sarımını hava üzerine ve bir nüve üzerine düşündüğünde manyetik yol değişir. Frekans, doyma ve kayıp özellikleri farklı olabilir.","Bobinlerde nüvenin temel etkisi hangi özelliktedir?","Manyetik devre ve endüktans davranışında.","Direncin renk bandı toleransında.","Voltaj ölçer prob renginde.","Nüve malzemesi manyetik alanın oluşmasını ve endüktansı etkiler."],[1439,"Seri bobinlerin ideal ve karşılıklı bağlaşımı ihmal edilen durumunda eşdeğer endüktansları toplanır.","İki birbirinden bağımsız bobini seri düşün: her biri 2 mH olsun. Manyetik bağlaşım yok sayılırsa toplam 4 mH olur; yakın konumlandırmada karşılıklı endüktans etkisi oluşabilir.","Manyetik bağlaşımı ihmal edilen 2 mH ve 2 mH seri bobinin eşdeğeri nedir?","4 mH.","1 mH.","0 mH.","Bağlaşım yokken seri endüktanslar toplanır."],[1440,"Bobin endüktansının ölçüm birimi henrydir; LCR metre uygun aralıkta endüktans ölçebilir.","Bir bobinin üstündeki yazı silinmiş olsun. Ona özgü endüktans, akım-gerilim davranışıyla ilgili bir değerdir; ohm dirençten farklı bir büyüklüktür.","Bir bobinin endüktansını ölçmek için hangi büyüklük seçilir?","L, henry (H).","C, farad (F).","Yalnız DC gerilim (V).","Endüktans L sembolüyle gösterilir ve henry ile ölçülür."],[1441,"Diyot doğru yönde iletim, ters yönde ise sınırlama davranışı gösteren yarı iletken elemandır.","Bir DC devrede akımın tek yönde geçmesini istediğini düşün. Diyot ideal tek yönlü kapı gibi anlatılır ama gerçek eşik ve kaçak özellikleri vardır.","Standart doğrultucu diyodun temel görevi nedir?","Akımın bir yönde iletimini diğer yönde engellemeye çalışmak.","AC frekansını sürekli iki katına çıkarmak.","Direnç değerini ölçmek.","Diyot polariteye göre farklı iletim davranışı gösterir."],[1442,"Diyot üzerindeki katot işareti ve devre sembolündeki çizgi aynı ucu tanımaya yardımcı olur.","Bir diyot gövdesindeki bantı düşün. Çoğu standart küçük diyotta işaretli uç katodu gösterir; farklı paketlerde üretici belgesi esas alınır.","Tipik diyot gövdesindeki bant çoğunlukla hangi ucu işaret eder?","Katot (K).","Baz (B).","Emiter (E).","Bant yaygın olarak katot tarafını belirtir."],[1443,"Transistörler elektronik anahtarlama ve yükseltme gibi işlevlerde kullanılabilir.","Bir LED'in kontrol sinyaliyle yanıp söndüğünü düşün; transistör küçük bir kontrol sinyalinin başka bir devre yolunu etkilemesine yardımcı olabilir. Bu, doğru kutuplama ve değerler gerektirir.","Bir transistörün elektronik devrede yaygın görevi hangisidir?","Anahtarlama veya sinyal yükseltme.","Yalnız elektrik enerjisi saymak.","Kapasitansı mekanik olarak artırmak.","Transistörler uygun kutuplamayla kontrol ve yükseltme yapabilir."],[1444,"BJT transistörde baz akımı, kolektör-emiter akımını kontrol etmede rol oynar.","Bir NPN BJT'yi düşün: baz, kolektör ve emiter uçları farklı görevlere sahiptir. Uygun baz sürmesi kolektör-emiter yolundaki akımı etkiler.","BJT transistörün üç temel terminali hangileridir?","Baz, kolektör ve emiter.","Anot, katot ve kapı.","Faz, nötr ve PE.","BJT uçları B, C, E olarak tanımlanır."],[1445,"BJT akım kazancı β (hFE), uygun çalışma bölgesinde kolektör akımıyla baz akımı arasındaki yaklaşık orandır.","Bir transistörün veri sayfasında hFE gördüğünü düşün. Bu değer sabit evrensel bir sayı değildir; çalışma akımı, sıcaklık ve bölgeye bağlıdır.","BJT için hFE kabaca hangi akımların oranıdır?","Kolektör akımı / baz akımı.","Emiter akımı / besleme gerilimi.","Direnç / kapasitans.","Ortak emiter akım kazancı yaklaşık β=IC/IB'dir."],[1446,"Transistör uçlarının yerleşimi paket ve üreticiye göre değişebilir; veri sayfası temel başvuru kaynağıdır.","Benzer görünen iki transistörü düşün. İkisinin kılıfı aynı olsa da E, B ve C sırası mutlaka aynı olmayabilir; görsel tahmin güvenilir değildir.","BJT transistörün baz-kolektör-emiter pin dizilimi en güvenilir nereden doğrulanır?","İlgili parçanın üretici veri sayfasından.","Kılıfın rengini tahmin ederek.","Her TO-92 kılıfını aynı kabul ederek.","Pin dizilimi modele ve üreticiye göre doğrulanmalıdır."],[1447,"Röle, bobinle kumanda edilen bir veya daha çok elektriksel kontağa sahip olabilir.","Bir düğmenin başka bir devreyi kumanda ettiğini düşün. Bobinin çekmesiyle NO ve NC kontakların konumu değişebilir; kontak ve bobin aynı elektriksel uç değildir.","Rölede 'NO' kontak normal durumda nasıldır?","Açıktır.","Her zaman kısa devredir.","Bobinin kendisidir.","NO, enerjisiz normal durumda açık kontağı ifade eder."],[1448,"Osiloskop zaman boyunca değişen gerilim dalga biçimini görselleştirir.","Bir kare dalga düşün. Multimetre yalnız bir ölçüm değeri gösterirken osiloskop dalganın süresini, genliğini ve kenarlarını incelemeni sağlar.","Osiloskobun yatay ekseni çoğu zaman neyi gösterir?","Zamanı.","Direnç değerini.","Sıcaklığı.","Zaman tabanı sinyalin zaman içindeki değişimini gösterir."],[1449,"Osiloskopta düşey ölçek volt/div, yatay ölçek time/div ve tetikleme sinyal görüntüsünü etkiler.","Ekranda dalga çok küçük görünürse düşey ölçek seçimi önemlidir; kayıp kayıp ilerliyorsa tetikleme de etkilidir. Ölçekler sinyalin fiziksel değerini değiştirmez.","Osiloskopta 'V/div' ayarı neyi değiştirir?","Düşey gerilim ölçeğini.","Devrenin direnç değerini.","Kaynağın gerçek frekansını.","Volt/div ayarı ekrandaki düşey bölüm başına volt değeridir."],[1450,"Osiloskopla periyodik sinyalin periyodu ölçülüp frekansı f=1/T ile hesaplanabilir.","Dalga ekranda her 2 ms'de bir kendini tekrarlıyorsa saniyede 500 çevrim eder. Bu, periyot okumayı frekansa çevirmenin basit yoludur.","Periyodu 2 ms olan sinyalin frekansı nedir?","500 Hz.","2 Hz.","2000 Hz.","f=1/0,002 s=500 Hz."],[1451,"Doğrultma AC sinyali tek yönlü hale getirmeyi, filtre dalgalanmayı azaltmayı, regülasyon çıkışı sınırlar içinde tutmayı amaçlar.","Bir güç kaynağının üç aşamasını düşün: doğrultucu, filtre, regülatör. Her katın görevi ayrı; bu kavramlar tek başına cihazın güvenli tasarlandığını göstermez.","Bir DC güç kaynağında filtrenin temel amacı hangisidir?","Doğrultulmuş çıkıştaki dalgalanmayı azaltmak.","AC frekansını zorunlu artırmak.","Koruma topraklamasını devreden çıkarmak.","Filtre enerjiyi geçici depolayarak ripple seviyesini azaltabilir."],[1452,"Köprü doğrultucu uygun diyotlarla AC'nin iki yarım periyodundan yararlanır.","Bir AC dalganın artı ve eksi yarılarını düşün. Tam dalga köprü doğrultmada yük üzerinden akımın yönü aynı olacak şekilde diyot yolları değişir.","Köprü tam dalga doğrultmanın yarım dalgaya göre temel farkı nedir?","AC'nin iki yarım periyodunu da kullanması.","Yalnız tek yarım periyodu kullanması.","AC'yi doğrudan mekanik harekete çevirmesi.","Köprü doğrultma her iki yarım periyottan faydalanabilir."],[1453,"Regülasyon, besleme veya yük değişimlerinde çıkış gerilimini hedef aralıkta korumayı amaçlar.","Bir devrenin yükü artıp azaldığında çıkışın mümkün olduğunca sabit kalmasını istersin. Regülatörün yaptığı iş, gerilimi yalnız filtrelemekten farklıdır.","Gerilim regülatörünün temel hedefi nedir?","Çıkış gerilimini belirlenen aralıkta tutmak.","Her devrede frekansı sıfırlamak.","Tüm yükleri seri bağlamak.","Regülasyon, değişen koşullarda çıkışın hedefe yakın tutulmasıdır."],[1454,"Lehimleme ve baskı devre uygulamalarında şema, PCB yerleşimi ve gerçek lehim birleşimi ayrı aşamalardır.","Önce elemanların elektriksel bağlantısını şemada tanımlarsın; sonra kart üzerinde ayak izleri ve bakır yollar gerekir. Doğru sembol tek başına doğru PCB anlamına gelmez.","Şematik çizim ile PCB yerleşimi arasındaki temel fark nedir?","Şema elektriksel ilişkileri, PCB fiziksel yerleşim ve yolları gösterir.","İkisi her zaman aynı görünür.","Şemada yalnız kartın boyutu vardır.","PCB, elektriksel ağı fiziksel iz ve ayak izlerine dönüştürür."],[1455,"Lehim bağlantısı, uygun yüzeyler arasında elektriksel ve mekanik süreklilik sağlamayı amaçlar.","Bir kart üzerindeki gevşek bağlantıyı düşün. Lehim işi yalnız parçaları yan yana koymak değildir; bağlantının kalitesi ve güvenliği önemlidir. Bu quiz fiziksel lehim talimatı değildir.","İyi bir lehim bağlantısından temel beklenti hangisidir?","Uygun elektriksel temas ve mekanik tutunma.","Yalnız gösterişli parlak renk.","Bütün eleman uçlarının birbirine kısa devre olması.","Lehim birleşimi beklenen ucu güvenilir şekilde bağlamalıdır."]];
  const allowed=/^(Bu başlıktaki uygulamaya başlamadan|Elektronik uygulamada devreye enerji vermeden|Akım ölçümü yapılırken|Koruma topraklamasının temel amacı)/;
  for(const [seq,summary,explanation,question,correct,badA,badB,why] of records){
   const l=L.lessons[seq-1],v=l?.pedagogyReview;
   if(!l||l.kind!=='quiz'||v?.independentPedagogicalAcceptance===true)continue;
   if(l.sc1406_1455ConceptRepair||!allowed.test(l.quiz?.question||''))continue;
   const answer=seq%3,options=[badA,badB];options.splice(answer,0,correct);
   l.summary=summary;l.explanation=explanation;
   l.quiz={question,options,answer,why};
   l.sc1406_1455ConceptRepair='SC1406_1455_TITLE_ALIGNED_CONCEPT_V1';
   const review=v||(l.pedagogyReview={});
   if(!review.titleTopologyStatus)review.titleTopologyStatus='REVIEW';
   review.titleMatchedQuizRepair='SC1406_1455_TITLE_ALIGNED_CONCEPT_V1';
   review.independentPedagogicalAcceptance=false;
   l.practiceGuide={...(l.practiceGuide||{}),method:'concept-check',
    heading:'Konuyu günlük bir örnekle anlamak',virtualOnly:true,
    canonicalGraphUnchanged:true,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Konumuz: '+l.title+'.','Ana fikir: '+summary,
     'Soruyu cevapla ve '+why.toLowerCase()],
    observations:['Bu yalnız kavramsal sorudur; önceki örnek şema başlığın doğrulanmış fiziksel devresi olarak kabul edilmez.',
     'Özgün Simulation.solve, 703 katalog native PASS, üretici onayı, Windows/3D ve bağımsız pedagojik kabul bu soru ile kanıtlanmaz.'],
    repairModel:'SC1406_1455_TITLE_ALIGNED_CONCEPT_V1'};
  }
 })();


 // SC1456–1505: title-specific conceptual quiz repairs. No physical execution instructions.
 (() => {
  const records=[[1456,"Lehimleme elemanlarının farklı görevleri vardır: birleştirilecek uç, lehim malzemesi ve yardımcı gereç aynı şey değildir.","Bir devre kartını düşün: bağlantı noktası elektriği taşır, lehim malzemesi uygun birleşime yardımcı olur. Kullanılan gereçlerin görevlerini önce tanımak önemlidir.","Lehimleme malzemesi ile kart üzerindeki bakır pad arasındaki temel fark nedir?","Lehim bağlantı oluşturur; bakır pad kartın bağlantı yüzeyidir.","İkisi de yalnızca plastik yalıtkandır.","Pad her zaman bir anahtar gibi açılıp kapanır.","Bağlantı malzemesi ile devre üzerindeki iletken yüzeyin görevi farklıdır."],[1457,"Lehimleme konusu, elektronik uçlar arasında uygun elektriksel birleşimin ne amaçla kurulduğunu kavratır.","Bir bileşeni karta yerleştirdiğini düşün. Önemli olan yalnızca iki parçanın bir araya gelmesi değil, doğru noktaların güvenilir biçimde birleşmesidir; sıcak işlem tarifi bu quizin konusu değildir.","Lehimleme işleminin elektriksel amacı nedir?","Doğru uçlar arasında kalıcı ve iletken bir birleşim elde etmek.","Birbirine komşu tüm padleri birleştirmek.","Karttaki bütün devre yollarını kesmek.","Lehim bağlantısı tasarlanan elektriksel sürekliliği sağlamalıdır."],[1458,"Lehim bağlantısı hataları arasında zayıf temas, çatlama ve istenmeyen lehim köprüsü bulunur.","Şemada ayrı duran iki bakır yolun kartta birleştiğini hayal et. Bu, yararlı bir bağlantı değil kısa devre riski olabilir; bağlantı kalitesi görsel ve uygun kontrollerle değerlendirilir.","Yan yana iki ayrı pad arasında istenmeyen lehim köprüsü neye yol açabilir?","Kısa devreye veya yanlış elektriksel bağlantıya.","Direncin birimini ohmdan volta dönüştürmeye.","İletkenleri kendiliğinden yalıtmaya.","Ayrı kalması gereken düğümlerin birleşmesi devrenin davranışını değiştirebilir."],[1459,"Lehim sökme işlemlerinde hedef, istenmeyen birleşimi giderirken pad ve bileşen bütünlüğünü korumaktır.","Bir kartın onarıldığını düşün: çıkarılan parçanın yeri sonraki kullanım için sağlam kalmalıdır. Bu başlık yalnız güvenli işin amacını anlatır; sıcak alet kullanımı öğretmez.","Lehim sökme çalışmasında hangi sonucun önlenmesi önemlidir?","Kart üzerindeki iletken padin ve yolların hasar görmesi.","Devrenin şemasının anlaşılması.","Parçaların işlevlerinin belirlenmesi.","Bağlantı onarılırken kartın iletken yapısı korunmalıdır."],[1460,"PCB paterni, şemadaki elektriksel ağları bakır yollar ve bağlantı adacıkları olarak temsil eder.","Şemada çizilen iki düğüm kart üstünde izlerle buluşur. Patern hazırlarken hangi uçların bağlanacağı, hangi yolların ayrılacağı tasarımdan anlaşılır.","Baskı devre paternindeki bakır izlerin temel görevi nedir?","Şemaya uygun elektriksel noktalar arasında iletim sağlamak.","Bileşenleri yazılımla programlamak.","Yalnız kartın rengini belirlemek.","Bakır izler şemadaki ağ ilişkilerini fiziksel yerleşime taşır."],[1461,"PCB plaketi hazırlama konusu, onaylanmış devre tasarımının üretilebilir kart düzenine dönüştürülmesini ele alır.","Kartın bir tasarım dosyası ile ortaya çıkan fiziksel plaketi aynı şey değildir. Üretim öncesi izler, delikler ve kart sınırları tasarımla karşılaştırılır.","PCB plaketi üretiminden önce hangi bilgi tasarımla uyumlu olmalıdır?","Bakır iz, pad ve kart sınırı yerleşimi.","Yalnız masa üzerindeki araç sayısı.","Sadece kartın fotoğraf filtresi.","Üretilecek plaket onaylanan elektriksel yerleşimi temsil etmelidir."],[1462,"Patern aktarma yöntemleri, tasarlanan bakır yol deseninin üretim ortamına doğru iletilmesini amaçlar.","Aynı devre deseni farklı üretim teknolojileriyle hazırlanabilir. Asıl ölçüt, yolların doğru konumda ve birbirinden gerektiği gibi ayrı olmasıdır.","Farklı patern aktarma yöntemlerinde ortak kalite hedefi nedir?","Tasarım deseninin doğru ve ayırt edilebilir aktarılması.","Tüm iletken izlerin tek yüzeyde birleşmesi.","Elektrik şemasının tamamen göz ardı edilmesi.","Aktarılan desen şemadaki ağların ayrımını korumalıdır."],[1463,"PCB kimyasal işlem basamakları riskli maddeler içerebilir; bu quiz yalnız iş güvenliği ve yetkili üretim yaklaşımını kapsar.","Bir PCB'nin kimyasal üretim aşamasını düşün. Uygun tesis, uzman gözetimi ve atık yönetimi gerekir; kimyasal karışım, banyo veya uygulama tarifi burada verilmez.","PCB kimyasal işlemleri için güvenli yaklaşım hangisidir?","İşlemleri yetkili ve uygun donanımlı profesyonel ortamda yürütmek.","Ev ortamında rastgele kimyasal karışımlar denemek.","Kimyasal atıkları normal lavaboya dökmek.","Tehlikeli kimyasallar özel kontrol ve atık yönetimi gerektirir."],[1464,"Baskı devre uygulamasında şema, kart yolları ve bileşen yerleşimi birbiriyle tutarlı olmalıdır.","Bir kartta etiketli R1'in yanlış ağda olduğunu fark etmek, sorunu erken görmeyi sağlar. Tasarım ve üretim çıktısının uyuşması önemli bir kalite ölçütüdür.","PCB yerleşimi kontrolünde hangi eşleşme esas alınmalıdır?","Bileşen uçları ile şemadaki elektriksel ağların tutarlılığı.","Yalnız kartın dış yüzey parlaklığı.","Bütün ağ isimlerinin aynı yapılması.","Doğru yerleşim, şemadaki bağlantı ilişkilerini korur."],[1465,"Topraklama ve yıldırımdan korunma düzenleri aynı amaçla çalışan tek bir parça değil, birbirini tamamlayan ayrı koruma işlevleridir.","Bir binayı düşün: arıza akımına karşı koruma ve yıldırımdan korunma ayrı tehlikelerle ilgilenir. Her birinin tasarımı ve doğrulanması uzmanlık gerektirir.","Topraklama ile yıldırımdan korunma hakkında hangisi doğrudur?","Farklı riskleri ele alan, birlikte değerlendirilmesi gereken sistemlerdir.","Tek bir metal çubuk bütün korumaları kesin olarak sağlar.","Birinin bulunması diğer tüm korumaları gereksiz kılar.","Kapsamlar ve ilgili güvenlik değerlendirmeleri farklıdır."],[1466,"Koruma topraklaması, hata durumunda erişilebilir iletken bölümlerde tehlikeli gerilim riskinin azaltılmasına katkı sağlar.","Metal gövdeli bir cihazda yalıtım arızasını düşün. Koruma düzeni tek bir kablodan ibaret değil; uygun iletken, koruma aygıtı ve kontroller bütünüdür.","Koruma topraklamasının güvenlikle ilişkili işlevi nedir?","Uygun koruma düzeniyle birlikte dokunma gerilimi riskini azaltmak.","Cihazın işlemci hızını yükseltmek.","Her koşulda elektrik tüketimini sıfırlamak.","PE yolu, uygun koruma sistemi içinde arıza güvenliğine katkı verir."],[1467,"Topraklama, belirli elektriksel bölümlerin toprağa bağlantısına yönelik sistematik bir koruma ve işletme uygulamasıdır.","Bir bina tesisatında toprakla bağlantının neden planlandığını sor. Rastgele iletken temasları yerine tanımlı bir topraklama düzeni gerekir.","Topraklamanın gerekliliği hangi konuyla ilişkilidir?","Elektrik tesisinde arıza ve potansiyel farkı risklerinin yönetimiyle.","Aydınlatmanın rengini otomatik değiştirmekle.","Motoru her zaman iki kat hızlı döndürmekle.","Topraklama elektriksel güvenlik ve referans düzeninin bir parçasıdır."],[1468,"Koruma, işletme ve işlevsel topraklama gibi kavramlar amaçlarına göre birbirinden ayrılır.","Aynı projede farklı topraklama amaçları bulunabilir. Adlar benzer olsa da hangi bölümün neden topraklandığını anlamak gerekir.","Topraklama türleri neden ayrı başlıklarla değerlendirilir?","Bağlantıların koruma veya işletme gibi farklı amaçları bulunabilir.","Bütün türler kesinlikle aynı donanımı gerektirir.","Topraklama sınıflandırması sadece renk seçimi içindir.","Sınıflandırma topraklama işlevinin anlaşılmasını sağlar."],[1469,"Bina temel topraklama sistemi, yapının elektriksel koruma ve eş potansiyel düzeniyle ilişkili bir tasarım unsurudur.","Binanın daha ilk tasarımında düşünülmesi gereken bir düzen hayal et. İleride ölçülebilirlik ve bağlantı sürekliliği önemlidir; bu bilgi bir montaj talimatı değildir.","Temel topraklaması hangi aşamada projeyle birlikte düşünülmelidir?","Yapının tasarım ve ilgili inşaat planlama aşamasında.","Yalnız binanın boyası bittikten sonra rastgele.","Sadece binadaki bilgisayarlar değiştirildiğinde.","Sistemin yapıyla bütünleşik olması erken koordinasyon gerektirir."],[1470,"Temel topraklaması, yapısal bölümle ilişkili topraklayıcı düzeninin proje kapsamında değerlendirilmesidir.","Temel bölgesini bir sistemin parçası olarak düşün. Süreklilik, korozyon uygunluğu ve denetlenebilirlik gibi nitelikler uzman projesiyle değerlendirilir.","Bina temel topraklamasında hangi özellik önemlidir?","Tasarlanan iletken ağın elektriksel sürekliliğinin doğrulanabilmesi.","İletken parçaların rastgele kopuk bırakılması.","Sistemin yalnız dekoratif çizim olarak kalması.","Elektriksel süreklilik koruma sisteminin değerlendirilen koşullarından biridir."],[1471,"Temel topraklama ekipmanları iletkenler, uygun bağlantı öğeleri ve ölçüme erişim sağlayan parçalar gibi işlevsel gruplara ayrılır.","Bir proje listesine bakınca her elemanın işi anlaşılmalı. Bağlantı öğesini ölçüm noktasıyla karıştırmak yanlış malzeme yorumuna yol açar.","Temel topraklamasında bağlantı elemanlarının temel görevi nedir?","Tasarlanan topraklama elemanları arasında güvenilir elektriksel bağlantıya katkı vermek.","Elektronik karttaki programı güncellemek.","Dağıtım panosunun faz sırasını otomatik seçmek.","Bağlantı elemanları elektriksel süreklilik için değerlendirilir."],[1472,"Temel topraklama projesinde malzeme uyumu, korozyon riski, süreklilik ve erişilebilir denetim noktaları önemlidir.","Uzun yıllar yapının parçası olarak kalacak bir sistemi düşün. Gözle görülmeyen bağlantıların kayıt ve kontrolü sonradan değerlendirme için önem taşır.","Temel topraklamasında farklı metallerin uygunsuz eşleştirilmesi hangi riski artırabilir?","Korozyon ve bağlantı sürekliliğinin bozulması riskini.","Şebeke frekansının otomatik artmasını.","Aydınlatma devresinin yazılımını silmesini.","Malzeme ve çevre koşulları uzun dönem güvenilirliği etkiler."],[1473,"Topraklama iletkeninin topraklayıcıyla ilişkisinde amaç tasarlanan koruma yolunun sürekliliğini sağlamaktır.","Bir çizimde koruma iletkeninin sonlandığı yeri işaretlediğini düşün. Soru, uygun ve denetlenebilir bağın neden önemli olduğudur; sahada bağlantı yöntemi öğretmez.","Koruma iletkeni ile topraklayıcı arasındaki bağlantıda temel beklenti nedir?","Projeye uygun elektriksel süreklilik ve denetlenebilirlik.","İki parça arasında özellikle yalıtkan boşluk bırakılması.","İletkenin boya tabakasıyla elektriksel bağlı sayılması.","Topraklama yolu değerlendirmesinde süreklilik esastır."],[1474,"Temel topraklamasında galvanizli iletkenler ve donatı ilişkisi, proje ve malzeme uyumluluğu açısından değerlendirilir.","İnşaat projesindeki farklı metal elemanları düşün. Bunların her temas noktası kendiliğinden kabul edilebilir bir elektriksel bağlantı değildir.","Temel topraklaması ile yapı donatısı değerlendirilirken hangi yaklaşım doğrudur?","Bağlantı ve malzeme uyumu yetkili projede doğrulanmalıdır.","Her metal temas kesinlikle yeterli topraklamadır.","Korozyon olasılığı her durumda önemsizdir.","Yapı elemanlarıyla elektriksel bütünleşme uzman kontrolü gerektirir."],[1475,"Eş potansiyel bara, ilgili iletken bölümler arasındaki tehlikeli potansiyel farklarının azaltılmasına yardımcı olan bağlantı düzeninin parçasıdır.","Aynı mekândaki erişilebilir metal bölümlerin farklı gerilimlerde kalabildiğini düşün. Eş potansiyel bağlama bu farkı azaltma amacı taşır.","Eş potansiyel bara düzeninin temel amacı nedir?","İlgili iletken bölümler arasındaki potansiyel farkını azaltmaya yardımcı olmak.","Her fazın gerilimini iki katına çıkarmak.","İletkenlerin hepsini çalışma nötrüne dönüştürmek.","Eş potansiyel bağlama dokunma riskiyle ilişkili gerilim farklarını azaltır."],[1476,"Eş potansiyel bara, koruma ve ilgili bağlama iletkenleri için tanımlı ortak ilişki noktasıdır.","Bir binada çok sayıda koruma bağlantısı düşün. Hangi iletkenin nerede ilişkilendirileceği belirsiz olmamalıdır; düzen proje gerektirir.","Eş potansiyel bara üzerinde hangi işlev beklenir?","İlgili koruma ve eş potansiyel bağlama iletkenlerinin tanımlı biçimde ilişkilendirilmesi.","Tüm elektrik tüketicilerinin hız ayarının yapılması.","Yalnız veri trafiğinin yönlendirilmesi.","Baranın görevi ilgili koruma bağlantılarının düzenli ilişkisidir."],[1477,"Eş potansiyel bağlantılarda süreklilik, uygun malzeme ve bağlantıların denetlenebilirliği temel değerlendirme konularıdır.","Bir bağlantı şemasına baktığında iletkenin başlangıcı ve bitişi anlaşılmalı. Bu ders malzeme seçimi veya saha montaj tarifi değil, kontrol mantığıdır.","Eş potansiyel bara bağlantılarında hangi denetim anlamlıdır?","İlgili iletkenlerin sürekliliği ve projeye uygunluğunun kontrolü.","Bağlantı uçlarının etiketlerini özellikle gizlemek.","Bağlama iletkenlerini işlevsiz bırakmak.","Koruma düzeninin sürekliliği ve izlenebilirliği önemlidir."],[1478,"Eş potansiyel bara uygulamasında temel kavram, tanımlı koruma iletkenleri arasında amaçlanan elektriksel bağlantının doğrulanmasıdır.","Bir uygulama çiziminde bara ile bağlı metal bölüm arasında bağlantı çizgisi gördüğünü düşün. Çizgi tek başına yapılan işin kabulü değildir; test gerekir.","Eş potansiyel bara temrininde hangi sonuç yalnız çizime bakılarak kesin kabul edilemez?","Gerçek tesisattaki bağlantı sürekliliğinin ölçümle doğrulandığı.","Baranın çizimde gösterildiği.","İletkenin şemada hangi bölümle ilişkili olduğu.","Fiziksel elektriksel süreklilik için gerçek doğrulama gerekir."],[1479,"Topraklama kolon hattı, bina boyunca ilgili koruma bağlantılarını birleştiren iletken düzeninin parçası olarak ele alınır.","Katlar arası dağıtımı bir şema üzerinde takip ettiğini düşün. Koruma hattı yalnız tek prizden ibaret değildir, süreklilik isteyen bir sistemdir.","Topraklama kolon hattının bina projesindeki temel rolü nedir?","İlgili kat ve dağıtım bölümlerine koruma iletkeni sürekliliğini taşımak.","Bütün koruma aygıtlarını iptal etmek.","Yalnız internet bağlantısı sağlamak.","Kolon düzeni koruma bağlantılarının bina boyunca sürekliliğiyle ilgilidir."],[1480,"Topraklama kolon hattı, katlara uzanan koruma iletkenleriyle ilişkili ana tesisat güzergâhıdır.","Bir binanın düşey tesisat şemasını düşün. Besleme yolu ile koruma işlevi aynı isim altında karıştırılmamalıdır.","Topraklama kolon hattı hangi işlev için ayrılır?","Katlar arasındaki koruma iletkeni düzeni için.","Lamba parlaklığını uzaktan ayarlamak için.","Televizyon anteninin kanal aramasını yapmak için.","Kolon hattının bu bağlamdaki görevi koruma sürekliliğidir."],[1481,"Topraklama kolon hattının özelliklerinde süreklilik, projeye uygun tanımlama ve bağlantıların korunması öne çıkar.","Uzun bir tesisat hattının herhangi bir yerinde kopukluk olursa koruma beklentisi etkilenebilir. Bu nedenle hattın yalnız görünüşü değil işlevi önem taşır.","Topraklama kolon hattı için hangi özellik temel önemdedir?","İlgili koruma iletkeni yolunun sürekliliği.","Her katta kasıtlı kesinti bulunması.","Kablo renginin her odada rastgele değiştirilmesi.","Koruma hattı kesintisiz ve proje amacına uygun değerlendirilir."],[1482,"Topraklama kolon hattının tesisi, ilgili elektrik projesi, standartlar ve yetkili denetim kapsamında ele alınır.","Bir bina planında koruma güzergâhının izlenebilir olması önemlidir. Bu konudaki quiz sahada iletken döşeme yöntemi öğretmez.","Topraklama kolon hattının uygunluğu nasıl değerlendirilmelidir?","Onaylı proje, ilgili kurallar ve yetkili kontroller birlikte incelenerek.","Yalnız kablonun dış renginden karar verilerek.","Hiçbir belgeye bakılmadan tahmin edilerek.","Kurallara uygunluk hem tasarım hem doğrulama gerektirir."],[1483,"Kolon, linye ve sorti hatları farklı dağıtım seviyeleridir; koruma iletkeni sürekliliği her seviyede önemlidir.","Bir aydınlatma noktasına giden hattı dağıtım şemasında izlediğini düşün. Koruma yolunun hangi devreye ait olduğunun anlaşılması gerekir.","Kolon, linye ve sorti çizimlerinde koruma iletkeni açısından ortak amaç nedir?","İlgili noktalara kadar koruma yolu ilişkisinin korunması.","Koruma yolunu yalnız kolonda bırakıp bütün son noktaları dışlamak.","Her sorti hattını otomatik faz iletkeni saymak.","Koruma işlevi dağıtım seviyeleri boyunca değerlendirilir."],[1484,"Dağıtım pano ve tablolarının topraklanması, erişilebilir metal bölümler ve koruma bağlantıları açısından önemli bir güvenlik konusudur.","Bir pano gövdesinin yalnız kapak görevi görmediğini düşün. Elektrik arızası durumundaki riskleri azaltmak için uygun koruma düzeni gerekir.","Dağıtım panosunun metal gövdesinin korunması neden önemlidir?","Arıza durumunda tehlikeli dokunma gerilimi riskini azaltmak için.","Panonun etiket yazılarını büyütmek için.","Elektrik sayacına daha çok enerji harcatmak için.","Metal gövde erişilebilir olduğundan koruma düzeni önem taşır."],[1485,"Dağıtım panosunda gövde koruması, koruma iletkeni ve ilgili koruma aygıtlarının birlikte değerlendirilmesiyle anlam kazanır.","Pano kapısını açmadan yalnız çizim üzerinden düşündüğünde bile gövde arızası riski anlaşılabilir. Bu quiz fiziksel pano üzerinde işlem yaptırmaz.","Pano topraklamasının güvenlik yararı hangi durumla ilişkilidir?","Yalıtım arızasında erişilebilir metal parçalardaki riskin azaltılmasıyla.","Faz sayısının otomatik artmasıyla.","Pano boyasının kendiliğinden yenilenmesiyle.","Gövde koruması arıza halinde dokunma riskini yönetir."],[1486,"Pano topraklama kontrollerinde tanımlı PE bağlantıları, kapak gibi erişilebilir metal bölümler ve bağlantı sürekliliği değerlendirilir.","Bir panonun farklı metal parçalarını düşün. Bunların koruma düzeni içindeki durumu tek bir genel etiketle anlaşılmaz; yetkili doğrulama gerektirir.","Dağıtım panosu koruma incelemesinde hangi ayrıntı gözden kaçırılmamalıdır?","Erişilebilir ilgili metal bölümlerin koruma bağlantısı kapsamı.","Panodaki bütün etiketlerin aynı renk olması.","Koruma iletkeninin yalnız kutunun dışında görünmesi.","Her ilgili metal bölümün koruma gerekliliği projeye göre incelenir."],[1487,"Pano topraklama bağlantıları temrini, teorik olarak tasarlanan PE yolunun şema ve kabul koşullarıyla eşleşmesini sorgular.","Sanal çizimde PE hattını göstermek kolaydır. Ancak fiziksel montajın gerçekten uygun ve güvenli olduğunu yalnız bu dersin sorusundan anlayamayız.","Pano topraklama temrinindeki quiz sonucu neyi tek başına kanıtlamaz?","Fiziksel pano montajının ve ölçümlerinin uygunluğunu.","PE sembolünün doğru adlandırılabildiğini.","Koruma bağlantısı amacının kavrandığını.","Quiz başarısı gerçek tesisat için saha kabulü yerine geçmez."],[1488,"Makine ve cihaz topraklamasında erişilebilir metal gövde, koruma iletkeni ve arıza güvenliği ilişkisi öne çıkar.","Metal kasalı bir cihaz arıza yaparsa gövdede istenmeyen gerilim oluşabilir. Uygun koruma düzeninin amacı bu tür riskleri azaltmaktır.","Metal gövdeli bir makinenin koruma bağlantısının amacı nedir?","Gövdeye ilişkin elektrik çarpması riskinin azaltılmasına yardımcı olmak.","Makinenin üretim hızını kesin olarak ikiye katlamak.","Yalıtım arızalarını tamamen imkânsız hâle getirmek.","Koruma iletkeni uygun sistem içinde gövde arızası riskini yönetir."],[1489,"Makine gövde topraklaması, erişilebilir iletken gövdenin arıza hâlinde tehlike oluşturmaması için değerlendirilir.","Motor veya makine kasası normalde kullanıcıyla temas edebilen bir yüzeydir. Koruma gerekliliği bu erişilebilirlik nedeniyle önemlidir.","Makine gövde topraklamasının temel güvenlik gerekçesi hangisidir?","Yalıtım arızasında gövdenin tehlikeli potansiyele çıkma riskini yönetmek.","Motorun mekanik torkunu sıfır maliyetle artırmak.","Sıcaklık sensörünü programlamak.","Gövde koruması arıza koşullarında dokunma güvenliğiyle ilişkilidir."],[1490,"Cihaz topraklama değerlendirmesinde koruma sınıfı, üretici bilgileri ve ilgili standartlar birlikte ele alınmalıdır.","Farklı cihazların koruma düzenleri birbirinin aynısı olmayabilir. Özellikle koruma sınıfı ayrımını anlamadan tüm cihazlara aynı hüküm verilmez.","Her elektrikli cihazın topraklama gerekliliği nasıl belirlenmelidir?","Cihazın koruma sınıfı ve üretici/standart bilgilerine göre.","Her cihazın gövdesi daima plastik olduğu varsayılarak.","Sadece cihazın dış görünüşüne bakılarak.","Koruma sınıfı gereklilikleri cihazdan cihaza değişebilir."],[1491,"Bir fazlı motorun koruma iletkeni konusu, motor gövdesinin arıza koşullarında korunmasına yönelik kavramsal değerlendirmedir.","Sanal devrede motor sargılarını ve metal gövdeyi ayrı kavramlar olarak düşün. PE'nin görevi çalışma akımını taşımak değildir; fiziksel bağlantı tarifi yapılmaz.","Bir fazlı motorun koruma iletkeni çalışma akımından neden ayrı değerlendirilir?","PE normal işletme akımı yolu değil, koruma düzeninin parçasıdır.","PE yalnız motorun hız seçicisi olarak kullanılır.","PE mutlaka faz iletkeniyle aynı işi yapar.","Motor gövde korumasının işlevi normal besleme iletkeninden farklıdır."],[1492,"Prizde koruma hattının varlığı, uygunluğu ve sürekliliği yalnız görünüşe bakılarak kesinleştirilemez.","Bir prizde koruma kontağı görebilirsin, fakat bunun gerçekten uygun şekilde çalıştığı ayrı bir konudur. Yetkili ölçüm ve kontrol gerekir; canlı priz testi öğretilmez.","Prizde görülen topraklama kontağı tek başına neyi kanıtlamaz?","Koruma iletkeni bağlantısının gerçekte sağlam ve uygun olduğunu.","Prizin koruma kontaklı tipte tasarlandığını.","Prizde fiziksel bir koruma kontağı bulunduğunu.","Görüntü ile doğrulanmış elektriksel süreklilik aynı şey değildir."],[1493,"Topraklama direnci ile yalıtkanlık direnci farklı fiziksel büyüklükleri ve farklı kontrol amaçlarını ele alır.","İki ölçüm adında da direnç sözcüğü geçtiğini düşün. Biri topraklama düzeninin, diğeri yalıtımın elektriksel niteliğiyle ilgilidir; aynı ölçüm değildir.","Topraklama direnci ile yalıtkanlık direnci için hangisi doğrudur?","Farklı amaçlara yönelik, farklı ölçüm değerlendirmeleridir.","İki terim kesinlikle aynı büyüklüğün eş anlamlısıdır.","İkisi yalnız cihazın rengini ölçer.","Ölçümün amacı ve yöntemi doğru adlandırılmalıdır."],[1494,"Yalıtım test cihazı, yalıtımın elektriksel direncini değerlendirmek için tasarlanan özel ölçüm aracıdır.","Bir ölçü aletinin yalnızca ekrandaki sayıdan ibaret olmadığını düşün. Ölçümün güvenliği ve uygunluğu, doğru cihazın yetkili kişilerce seçilmesine bağlıdır.","Yalıtım direnci için kullanılan test cihazının temel hedefi nedir?","Yalıtımın elektriksel direnç niteliğini değerlendirmek.","Topraklama çubuğunun boyasını ölçmek.","Dijital şebeke hızını artırmak.","Yalıtım test cihazı yalıtım değerlendirmesine yöneliktir."],[1495,"Yalıtım direnci test cihazıyla topraklama direnci ölçümü aynı şey değildir; başlığın verdiği izlenim dikkatle ayrılmalıdır.","Bir katalogda iki farklı ölçüm cihazı gördüğünü düşün. Yalıtım testeri ve topraklama testeri farklı değerlendirmelere yöneliktir; birinin adı ötekine uygunluk kanıtlamaz.","Sadece yalıtım direnci ölçen bir cihaz topraklama direncini ölçmek için kendiliğinden yeterli midir?","Hayır, topraklama ölçümü için uygun işlev ve yöntem gerekir.","Evet, her direnç ölçer bütün topraklama testlerini otomatik yapar.","Cihaz seçimi ölçüm türünü hiç etkilemez.","Ölçüm amaçları farklıdır; cihazın uygun ölçüm işlevi doğrulanmalıdır."],[1496,"Bu temrindeki cihaz adı, topraklama direnci ölçümünün doğru cihaz ve yetkili test koşulları gerektirdiği gerçeğini değiştirmez.","Bir temrin başlığını okurken ölçülecek büyüklüğü önce belirlemek gerekir. İzolasyon cihazıyla rastgele topraklama deneyi tarif edilmez.","Topraklama direnci değerlendirmesinde hangi yaklaşım doğrudur?","Topraklama ölçümüne uygun cihaz ve onaylı yöntem seçilmelidir.","Her yalıtım cihazının bu amaç için koşulsuz yeterli olduğu varsayılmalıdır.","Ölçüm sonuçları cihazın işlevi bilinmeden kabul edilmelidir.","Topraklama ölçümünün amacı ve ekipmanı eşleşmelidir."],[1497,"Dijital cihazın ekran vermesi, topraklama direnci ölçümüne uygun işlevinin bulunduğunu tek başına göstermez.","Dijital bir test cihazı birçok mod içerebilir. Doğru ölçümü seçmeden elde edilen sayıya güvenmek doğru değildir; bu quiz gerçek saha ölçümü yaptırmaz.","Dijital test cihazıyla topraklama değerlendirmesinde ilk kavramsal soru nedir?","Cihazın ilgili topraklama ölçüm işlevine gerçekten sahip olup olmadığı.","Ekranın parlaklığının yeterince yüksek olup olmadığı.","Cihaz kasasının aynı renkte üretilip üretilmediği.","Ölçüm işlevi ve amacı uyuşmadan sonuç geçerli kabul edilemez."],[1498,"Tek fazlı tesisatta yalıtkanlık direnci, iletkenler ve yalıtım sisteminin istenmeyen kaçaklara karşı niteliğinin değerlendirilmesidir.","Bir tesisatta yalıtımın neden önemli olduğunu düşün. Konu, koruma düzeninin bir parçası olarak uygun ölçümün yorumlanmasıdır; yüksek gerilimli test adımları verilmez.","Tek fazlı bir tesisatta yalıtkanlık direnci testi hangi özelliği değerlendirir?","Yalıtımın istenmeyen elektriksel iletime karşı direncini.","Koruma iletkeninin motor hızına etkisini.","Prizdeki internet veri hızını.","Yalıtım direnci, yalıtımın elektriksel niteliğini değerlendirmeyi amaçlar."],[1499,"Yıldırımdan korunma sistemi; yakalama, iniş iletkenleri, topraklama ve uygun iç koruma önlemleri birlikte düşünülerek tasarlanır.","Bir binanın yalnız çatısındaki parçaya bakarak bütün korunmanın tamamlandığı söylenemez. Koruma tasarımı bir sistem yaklaşımı gerektirir.","Bina yıldırım koruması neden tek bir parça olarak değerlendirilmez?","Farklı görevli koruma bölümlerinin birlikte çalışması gerektiği için.","Yalnız binanın yüksekliği her sorunu kesin çözdüğü için.","Koruma aygıtlarının hepsi aynı işlevi gördüğü için.","Yıldırım riskinin yönetiminde birden çok koruma katmanı önemlidir."],[1500,"Yıldırımdan korunma donanımı, yakalama ve iletme işlevlerine sahip ilgili parçalardan oluşan tasarlanmış bir düzendir.","Bir koruma planındaki öğeleri işlevine göre düşün: yıldırımı karşılama, akımı iletme ve etkilerini yönetme birbirinden ayrı işlerdir.","Yıldırımdan korunma sisteminde yakalama ucunun amacı nedir?","Yıldırım koruması tasarımında olası darbe için öngörülen yakalama noktasını oluşturmak.","Bina prizlerindeki normal akımı artırmak.","Telefon kablosunu güç kaynağına dönüştürmek.","Yakalama bölümü koruma tasarımının belirli bir işlevini üstlenir."],[1501,"Paratoner/yıldırım koruma tesisi için proje, malzeme uygunluğu, koordinasyon ve uzman denetimi kritik kabul koşullarıdır.","Yıldırım riski taşıyan bir binayı düşün. Bir çizimde simge görmek gerçek güvenli tasarım veya montaj doğrulaması değildir.","Paratoner tesisatının güvenlik uygunluğu nasıl değerlendirilmelidir?","Yetkili proje, ilgili standartlar ve uzman kontrolüyle.","Yalnız çatıda metal nesne bulunmasına bakılarak.","Sadece quiz sorusunu doğru işaretlemekle.","Gerçek yıldırım koruma uygunluğu bağımsız tasarım ve denetim gerektirir."],[1502,"Paratoner başlığı ve iniş/topraklama iletkeni ilişkisi, yıldırım koruma sisteminin sürekliliğiyle ilgili kavramsal bir konudur.","Bina şemasında yakalama noktasından aşağıya uzanan yolu düşün. Uygunluk yalnız çizgilerin birleşmesiyle kanıtlanmaz; sahadaki iş uzmanlık gerektirir.","Yıldırım koruma iletkeni bağlantısında niçin doğrulanmış süreklilik önemlidir?","Tasarlanan yıldırım akımı yolunun bütünlüğüyle ilgili olduğu için.","Paratonerin normal aydınlatma anahtarı olması için.","Bütün elektrik enerjisini depolaması için.","Koruma yolunun bütünlüğü yıldırım sisteminin değerlendirme konusudur."],[1503,"Boru, kanal ve taşıyıcı tesisatlar kabloların güzergâh, destek ve mekanik korunma ihtiyaçları için kullanılır.","Bir tesisat planında elektrik devresi kadar kablonun nereden geçtiği de önemlidir. Boru ve kanal, devrenin elektriksel işleviyle aynı şey değildir.","Boru ve kanal sistemlerinin temel görevi nedir?","Kablolara uygun güzergâh ve mekanik destek/koruma sağlamaya yardımcı olmak.","Alternatif akımı doğrudan doğru akıma çevirmek.","Bütün devrelerin gerilimini sıfırlamak.","Taşıyıcı tesisatlar kablo düzeni ve korunmasıyla ilgilidir."],[1504,"Sıva üstü tesisatta iletken güzergâhı ve taşıyıcı unsurlar yapı yüzeyinde görülebilir biçimde düzenlenir.","Bir duvar boyunca ilerleyen kanal düşün. Güzergâhın anlaşılır ve korunmuş olması önemlidir; burada fiziksel montaj adımları öğretilmez.","Sıva üstü tesisatı sıva altı tesisattan ayıran temel özellik nedir?","Güzergâhın büyük ölçüde yapı yüzeyinde düzenlenmesi.","Bütün kabloların mutlaka kablosuz olması.","Herhangi bir koruma düzenine ihtiyaç bulunmaması.","Tesisatın duvar yüzeyindeki yerleşimi temel tanımlayıcı özelliktir."],[1505,"Sıva üstü tesisat, kablo ve taşıyıcı elemanların yapı yüzeyinde yer aldığı tesisat düzenidir.","Bir odada duvar yüzeyine yerleştirilmiş bir elektrik kanalı görüyorsun. Bu, tesisatın yerleşim türünü tanımlar; tek başına teknik uygunluk belgesi değildir.","Sıva üstü tesisat ifadesi doğrudan neyi anlatır?","Tesisat elemanlarının yapı yüzeyi üzerinde düzenlenmesini.","Bütün iletkenlerin bina temeli içinde gömülü olmasını.","Sadece devrenin yazılımla kontrol edilmesini.","Sıva üstü ifadesi tesisatın fiziksel yerleşim biçimini tanımlar."]];
  const allowed=/^(Bu başlıktaki uygulamaya başlamadan|Elektronik uygulamada devreye enerji vermeden|Motor kumanda derslerinde güç devresi|Koruma topraklamasının temel amacı)/;
  for(const [seq,summary,explanation,question,correct,badA,badB,why] of records){
   const l=L.lessons[seq-1],v=l?.pedagogyReview;
   if(!l||l.kind!=='quiz'||v?.independentPedagogicalAcceptance===true)continue;
   if(l.sc1456_1505ConceptRepair||!allowed.test(l.quiz?.question||''))continue;
   const answer=seq%3,options=[badA,badB];
   options.splice(answer,0,correct);
   l.summary=summary;l.explanation=explanation;
   l.quiz={question,options,answer,why};
   l.sc1456_1505ConceptRepair='SC1456_1505_TITLE_ALIGNED_SAFE_CONCEPT_V1';
   const review=v||(l.pedagogyReview={});
   if(!review.titleTopologyStatus)review.titleTopologyStatus='REVIEW';
   review.titleMatchedQuizRepair='SC1456_1505_TITLE_ALIGNED_SAFE_CONCEPT_V1';
   review.independentPedagogicalAcceptance=false;
   l.practiceGuide={...(l.practiceGuide||{}),method:'concept-check',
    heading:'Konuyu günlük bir örnekle anlamak',virtualOnly:true,
    canonicalGraphUnchanged:true,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Konumuz: '+l.title+'.','Ana fikir: '+summary,'Soruyu cevapla; ardından gerekçeyi oku: '+why],
    observations:['Bu yalnız güvenli kavramsal sorudur; mevcut örnek devre başlığın doğrulanmış fiziksel uygulaması değildir.',
     'Native Simulation.solve/703 katalog PASS, Windows/3D, saha ölçümü ve bağımsız pedagojik kabul bu soruyla kanıtlanmaz.'],
    repairModel:'SC1456_1505_TITLE_ALIGNED_SAFE_CONCEPT_V1'};
  }
 })();


 // SC1506–1555: title-aligned conceptual prechecks, without altering physical circuits.
 (() => {
 const data=[["Sıva üstü tesisatta kanal, bağlantı aksesuarı ve taşıyıcı elemanlar görünür bir yüzey düzeninin parçalarıdır.","Sıva üstü tesisat malzemelerini değerlendirirken hangi gruplama anlamlıdır?","Kanal, bağlantı aksesuarı ve taşıyıcı parçaları görevine göre ayırmak","Bütün malzemeleri yalnız rengine göre seçmek","Tesisat malzemelerinin hepsini aynı görevde saymak"],["Sıva üstü tesisatın uygunluğu yalnız görüntüyle değil, proje ve geçerli teknik gerekliliklerle değerlendirilir.","Bir yüzey tesisatının uygunluk değerlendirmesi neye dayanmalıdır?","Yetkin inceleme, proje ve geçerli teknik gerekliliklere","Kanalın duvarla aynı renkte olmasına","Yalnız kullanılan kablonun uzunluğuna"],["Metal kablo kanalı ve konsol arasındaki ilişki mekanik taşıma desteğidir; burada fiziksel montaj öğretilmez.","Konsol, metal kablo kanalı sisteminde hangi işlevi üstlenir?","Kanalın taşınmasına yönelik mekanik desteği","Telefon sinyalini dijital veriye çevirmeyi","Elektrik akımını ölçen bir sensör olmayı"],["Dönüş aksesuarları, kablo kanalı güzergâhının yön değiştirdiği kısımlarla ilgilidir.","Metal kablo kanalındaki dönüş aksesuarının temel rolü nedir?","Güzergâhın yön değişikliğine uygun bir geçiş sağlamak","Gerilim değerini otomatik ölçmek","Her kabloyu bağımsız güç kaynağına çevirmek"],["Tavandaki kanal güzergâhı için taşıma düzeni, mekanik destek kavramının parçasıdır.","Tavan kanal sisteminde montaj ekipmanları hangi ihtiyaçla ilişkilidir?","Kanalın mekanik olarak taşınması ve desteklenmesiyle","Telefon numaralarının kaydedilmesiyle","Anten yayınlarının çözümlenmesiyle"],["Kanal kapağı ve kablo düzeni, kanaldaki fiziksel düzenin farklı işlevlerini temsil eder.","Kanal kapağının kavramsal görevi hangisidir?","Kanal içeriğini çevresinden ayıran tamamlayıcı bir parça olmak","Kabloyu sıcaklık algılayıcısına çevirmek","Şebeke gerilimini programlamak"],["Metal kanal ile PVC boru farklı taşıma ve koruma elemanı türleridir; birleşimleri bir geçiş konusudur.","Metal kanal ile PVC borunun aynı projede yer alması hangi kavrama örnektir?","Farklı tesisat taşıyıcıları arasında geçişe","Akıllı telefon işletim sistemi güncellemesine","Motorun mekanik hız ölçümüne"],["PVC kanal, yüzey boyunca ilerleyen kablolar için kullanılan bir taşıyıcı yapı türüdür.","Sıva üstü PVC kanalın temel tanımı hangisidir?","Yapı yüzeyinde kablo güzergâhı oluşturan bir kanal","Kablonun frekansını artıran bir sürücü","Telefon hatlarını güç kaynağına çeviren cihaz"],["Priz ve kanal başlıkları iki ayrı kavramdır: kanal güzergâh sağlar, priz kullanım arayüzüdür.","Sıva üstü kanallı priz uygulamasında priz neyi temsil eder?","Kullanım için ayrılmış elektriksel bağlantı arayüzünü","Metal kanalı taşıyan konsolu","Bina duvarının yalıtım sınıfını"],["Veri ve telefon bağlantı noktaları, enerji priziyle aynı hizmeti vermez; farklı iletişim işlevlerine ayrılır.","Data ve telefon prizi hangi işlevle ilişkilidir?","Bilgi veya telefon iletişimi için bağlantı noktasıyla","Doğrudan motorun devir sayısını artırmakla","Mekanik kanal kapağını kilitlemekle"],["Yer döşeme altı tesisatı, servis güzergâhının zemin altında planlandığı düzenleri kapsar.","Yer döşeme altı tesisatı tanımlayan ana özellik nedir?","Güzergâhın döşeme altındaki yerleşimi","Bütün kabloların açık havada bulunması","Yalnız bir programlama dili kullanılması"],["Döşeme altı tanımı, kabloların hizmet edeceği cihazdan çok konumlarını anlatır.","Yer döşeme altı tesisatı ifadesi doğrudan neyi belirtir?","Tesisat güzergâhının döşeme altındaki konumunu","İletkenin metal bileşimini","Telefon kablosunun veri hızını"],["Yer döşeme altı sistemlerde taşıyıcı kanal, erişim kutusu ve bağlantı noktası farklı parçalardır.","Yer döşeme altı tesisatında erişim kutusunun rolü hangisidir?","Sistemin tasarlanmış bağlantı veya erişim noktasını oluşturmak","Alternatif akımı doğru akıma dönüştürmek","Kablo direncini sıfırlamak"],["Döşeme altı sistemlerin uygunluğu çizim, kullanım ve ilgili kuralların yetkin incelemesiyle değerlendirilir.","Döşeme altı tesisat uygunluğuna hangi yaklaşım yerindedir?","Proje ve ilgili gerekliliklerin yetkin kişilerce değerlendirilmesi","Sadece kapak renginin karşılaştırılması","Yalnız kablo sayısının tahmin edilmesi"],["Döşeme altı priz kutularında enerji, veri ve telefon hizmetleri kavramsal olarak ayrılır.","Döşeme altı çoklu servis kutusunda hangi ayrım temel önemdedir?","Enerji ile veri ve telefon bağlantılarının ayrı işlevler taşıması","Bütün bağlantıların aynı iletişim protokolünü kullanması","Priz kutusunun motor kontrol programı sayılması"],["Sıva altı tesisatta güzergâh, yapı yüzeyinin altında planlanan bir konum düzenidir.","Sıva altı tesisat hangi yerleşimi anlatır?","Yapı yüzeyinin altında planlanan tesisat güzergâhını","Yüzeye serbestçe bırakılmış kablo demetini","Yalnız bir yazılım simülasyonunu"],["Sıva altı ifadesi malzemenin markasını değil, tesisatın fiziksel yerleşimini niteler.","Sıva altı tesisatın tanımındaki ayırt edici unsur nedir?","Elemanların yapı yüzeyi altında yer alması","Kabloların aynı renkte olması","Tüm devrelerin kablosuz çalışması"],["Sıva altı tesisatın boru, kutu ve bağlantı noktaları aynı görevi yapmaz.","Sıva altı tesisatta buat ile boru arasındaki kavramsal ayrım nedir?","Buat bağlantı alanı, boru güzergâh taşıyıcısıdır","İkisi de yalnız akımı ölçen ölçü aletidir","Boru bir yazılım dili, buat bir işlemcidir"],["Sıva altı tesisat uygunluğu görünmezliğe değil proje ve geçerli teknik gereklerin doğrulanmasına bağlıdır.","Sıva altı tesisat görünmüyorsa teknik uygunluk nasıl değerlendirilmelidir?","Proje ve geçerli gereklilikler yetkin denetimle doğrulanarak","Görünmediği için otomatik uygun sayılarak","Sadece boya rengine bakılarak"],["Projede duvar içindeki güzergâh konumunun belirlenmesi yerleşim planlamasıyla ilgilidir; fiziksel uygulama verilmez.","Duvarda boru güzergâhı konusunun öncelikli kavramı nedir?","Proje üzerindeki yerleşim ve güzergâhın anlaşılması","Veri sinyalinin sıkıştırılması","Motor fazlarının sırayla değiştirilmesi"],["Linye ve sorti hatları bir tesisatın farklı dağıtım bölümleri için kullanılan terimlerdir.","Linye ve sorti kavramları esas olarak neyle ilgilidir?","Elektrik tesisatındaki besleme ve ayrılan hatların düzeniyle","Anten sinyalinin ses düzeyiyle","PLC programındaki döngü sayısıyla"],["Buat, tesisatta belirlenmiş bağlantıların bir araya geldiği kutu kavramıdır; gerçek bağlantı tarifi yapılmaz.","Sıva altı tesisattaki buatın kavramsal görevi nedir?","Belirlenmiş bağlantı noktalarını bir kutu içinde toplamak","Telefon görüşmelerini kaydetmek","Motor hız referansını hesaplamak"],["Anahtar kumanda elemanı, priz ise kullanım için bağlantı arayüzüdür; bunların görevleri farklıdır.","Anahtar ile prizin temel işlev farkı nedir?","Anahtar kumandaya, priz bağlantı arayüzüne yöneliktir","İkisi de yalnız mekanik kanal taşıyıcısıdır","İkisi de anten sinyalini yükseltir"],["Busbar sistemi, elektrik enerjisinin dağıtımında kullanılan modüler iletken kanal sistemi kavramıdır.","Busbar sistemi genel olarak hangi amaçla anılır?","Elektrik enerjisinin modüler hatlarla dağıtılması","Telefon sesinin sıkıştırılması","Motorun mekanik dişli oranının değiştirilmesi"],["Busbar ekipmanlarında ana hat, ek, çıkış ve sonlandırma parçaları farklı roller taşır.","Busbar ekipmanlarını anlamak için hangi ayrım yararlıdır?","Ana hat ve modüler bağlantı/çıkış elemanlarının görevlerini ayırmak","Parçaları yalnız boyalarına göre ayırmak","Tüm ekipmanları tek tip telefon kablosu saymak"],["Busbar, çoklu dağıtım noktaları bulunan yapılarda kullanılan modüler enerji dağıtım yaklaşımıdır.","Busbarın kullanım alanını en iyi hangi özellik açıklar?","Dağıtım için modüler iletken hat oluşturması","Yalnız radyo yayınlarını dinlemesi","Dijital fotoğraf saklaması"],["Busbar hattı, bağlantı ve çıkış ekipmanlarını tek başlık altında toplamak işlevleri gizler.","Busbar çıkış kutusu hangi kavramı karşılar?","Ana dağıtım hattından tasarlanmış bir çıkış noktası olmayı","Anten başlığında kanalları sıralamayı","Motorun hızını mekanik olarak ölçmeyi"],["Busbar hattı montajı, sistemin fiziksel yerleşimi ve yetkili uygulama değerlendirmesiyle ilgilidir.","Busbar hattı montajı başlığında güvenle hangi bilgi ayrımı yapılabilir?","Tasarımdaki fiziksel yerleşim ile elektriksel uygunluk denetimi ayrımı","Hatların otomatik olarak uygun sayılması","Yalnız yazılım testiyle fiziksel kabul verilmesi"],["Busbar kanalları, dağıtım güzergâhında kullanılan modüler ana hat elemanlarıdır.","Busbar kanalının sistem içindeki rolü hangisidir?","Modüler enerji dağıtım güzergâhının ana hat bölümünü oluşturmak","Telefon aramalarını yönlendirmek","Anten görüntüsünü çözümlemek"],["Busbarın güvenilirliği yerleşim, ekipman eşleşmesi ve uzman doğrulaması gibi farklı boyutlarda incelenir.","Busbar montajında yalnız görsel eşleşmeye güvenmek neden yetersizdir?","Fiziksel ve elektriksel uygunluk ayrı doğrulamalar gerektirir","Görsel eşleşme bütün ölçümlerin yerine geçer","Yalnız cihaz etiketi bütün kabulü tamamlar"],["Busbar kanallarının eklenmesi modüler parçaların birbirleriyle sistem uyumuyla ilgilidir; sahada uygulama öğretilmez.","Busbar kanallarını birleştirme konusunun ana kavramı nedir?","Uyumlu modüler hat parçalarının birlikte bir sistem oluşturması","Telefon numarasının ülke kodunu öğrenmek","Anten görüntüsünün sıkıştırılması"],["Busbar hattında çıkış modülü ana hatla tüketici bağlantısı arasındaki görev ayrımını temsil eder.","Busbar hat modüllerini incelerken hangi ayrım doğrudur?","Ana dağıtım hattı ile ondan ayrılan çıkış modülü farklı görevlerdedir","Bütün modüller aynı işlevli kablo bağıdır","Çıkış modülleri sadece anten başlıklarıdır"],["Busbar çıkış kutusu, ana dağıtım hattıyla kullanıcıya ayrılan çıkış arayüzünü ilişkilendirir.","Busbar çıkış kutusunun adındaki 'çıkış' neyi tanımlar?","Ana sistemden ayrılan tasarlanmış bağlantı noktasını","Bilgisayarın ses çıkışını","Telefon antenini"],["Busbar çıkış kutusu montajı fiziksel sisteme özgü bir uygulamadır; burada yalnız parça görevleri incelenir.","Bir busbar çıkış kutusunun işlevi hangi başlıkla ilişkili olur?","Ana hattan ayrılan modüler enerji dağıtım arayüzüyle","İnternet tarayıcısının yenilenmesiyle","Dijital kameranın kayıt formatıyla"],["Busbar aydınlatma ve priz modülleri aynı ana hattan farklı kullanım arayüzlerine yönelir.","Busbar priz modülü ile aydınlatma modülü neden ayrı adlandırılır?","Hizmet ettikleri kullanım noktaları farklı olduğu için","Birisi mutlaka telefon kablosu olduğu için","İkisi de veriyi şifrelediği için"],["Busbarın enerji girişi ve kullanıcı modül çıkışı farklı işlevlerdir; uygunluk yalnız uzman denetimiyle doğrulanır.","Busbar enerji girişini çıkış modülünden ayıran temel görev nedir?","Sisteme sağlanan besleme ile kullanıcılara ayrılan arayüzün farklı olması","İkisinin de anten kuvvetlendiricisi olması","Giriş modülünün yalnız görüntü kaydı yapması"],["Aydınlatma ve priz ekipmanları busbar hattının ayrı kullanım modülleriyle ilişkilidir; gerçek bağlantı öğretimi değildir.","Busbar hattındaki aydınlatma ve priz modüllerinin ortak noktası nedir?","Aynı modüler dağıtım sisteminin farklı kullanım çıkışları olmaları","Her ikisinin yalnız telefon sinyali taşıması","Elektrik uygunluk denetimine hiç ihtiyaç duymamaları"],["Telefon ve anten tesisatları bir iletişim altyapısı başlığı altında buluşur fakat farklı sinyaller taşıyabilir.","Telefon ve anten tesisatları hangi ortak konuya bağlanır?","İletişim sinyallerinin dağıtıldığı bina altyapısına","Yalnız motor güç devrelerine","Elektrik motorunun mil bağlantısına"],["Telefon tesisatı, hat ve bağlantı noktalarıyla iletişim hizmeti sağlayan altyapıdır.","Telefon tesisatının temel amacı hangisidir?","Telefon haberleşmesi için hat ve bağlantı altyapısı sağlamak","Motor devir sayısını artırmak","Busbar enerji girişini ölçmek"],["Telefon tesisatı ekipmanlarında kablo, dağıtım noktası ve uç prizi farklı işlevler üstlenir.","Telefon terminal kutusunun kullanım amacı hangi başlığa girer?","İletişim hatlarının tanımlanmış dağıtım veya bağlantı noktası olması","Üç fazlı motoru sürmek","Elektrik akımını artırmak"],["Telefon tesisatı projesi, iletişim hatlarının ve bağlantı noktalarının plan üzerindeki ilişkisidir.","Telefon tesisatı planında hangi bilgi kavramsal olarak önemlidir?","Hat güzergâhlarıyla bağlantı noktalarının ilişkisi","Duvar boyasının tam renk kodu","Motorun mekanik dönüş yönü"],["Telefon kablosunun sağlamlığını değerlendirmek ile görsel olarak sağlam görünmesi aynı şey değildir; test burada anlatılmaz.","Telefon kablosunun görünüşü neden tek başına sağlamlık kanıtı değildir?","Bağlantı sürekliliği gibi özellikler ayrıca doğrulanmalıdır","Her kablo dışarıdan görünüyorsa kusursuzdur","Telefon hattı elektriksel bağlantı içermez"],["Telefon terminal kutusu bir iletişim hattı düzenleme ve sonlandırma arayüzü kavramıdır.","Telefon terminal kutusunun kavramsal görevi hangisidir?","Hatların düzenli sonlandırıldığı veya dağıtıldığı arayüz olmak","Motor sürücüsünün soğutucusu olmak","Anten uydusunun yönünü ölçmek"],["İletkenin terminal kutusunda bulunması, belirlenmiş bir bağlantı arayüzünde sonlandırılması kavramını gösterir.","Telefon terminal kutusunda 'terminal' neyi ifade eder?","İletişim hattının tanımlanmış bağlantı noktasını","Motorun mekanik rulmanını","Busbarın dış kaplamasının rengini"],["Telefon tesisatı bağlantısı, haberleşme hatlarıyla uç noktalar arasındaki ilişkiye dayanır; uygulama adımı sunulmaz.","Telefon tesisatı bağlantısında hangi sistem öğeleri kavramsal olarak ilişkilidir?","İletişim hattı, dağıtım noktası ve uç bağlantı arayüzü","Motor sargısı ve hız sürücüsünün mili","Yalnız aydınlatma armatürünün parlaklığı"],["Anten tesisatı, radyo/televizyon yayın sinyallerinin bina içi dağıtım altyapısıyla ilgilidir.","Anten tesisatının ana işlevi nedir?","Alınan yayın sinyallerinin uygun alıcılara dağıtılması","Motorun alternatif akım frekansını artırması","Telefon numaralarını saklaması"],["Anten sisteminde kablo, dağıtım parçası ve bağlantı prizi farklı görevler üstlenir.","Anten tesisatı ekipmanlarını sınıflandırırken hangi yaklaşım anlamlıdır?","Sinyal taşıyan ve dağıtan parçaları görevlerine göre ayırmak","Tüm parçaları güç sürücüsü saymak","Her parçanın yalnız ses kaydettiğini varsaymak"],["Headend, ortak anten sistemlerinde sinyal işleme ve dağıtımın merkezindeki ekipman grubudur.","Anten sisteminde headend ünitesi hangi rolü üstlenir?","Yayın sinyallerinin merkezî işlenmesi ve dağıtımını","Telefon prizlerinin duvar rengini belirlemeyi","Motorun mekanik frenini açmayı"],["Anten projesi, sinyal kaynakları ve dağıtım noktalarının plan üzerindeki ilişkisini gösterir.","Anten tesisatı projesinin kavramsal amacı nedir?","Kaynak, dağıtım ve kullanıcı noktalarının ilişkisini planlamak","Motor sargılarını birleştirmek","Şebeke gerilimini artırmak"],["Televizyon prizi yayın alıcısına yönelik bir sinyal bağlantı arayüzüdür; fiziksel bağlantı yöntemi bu derste verilmez.","Televizyon prizinin anten sistemindeki işlevi nedir?","Yayın sinyalinin kullanıcı cihazına ulaştığı arayüzü oluşturmak","Motor frekansını ayarlamak","Telefon numarasını saklamak"]];
 const current=L.lessons.slice(1505,1555);
 if(current.length!==50||current.some((l,i)=>l?.id!=='installation-systems-outline-'+String(i+48).padStart(3,'0')))return;
 for(let i=0;i<50;i++){
  const l=current[i],r=l.pedagogyReview||(l.pedagogyReview={});
  if(r.independentPedagogicalAcceptance===true||r.titleMatchedQuizRepair)continue;
  const [summary,question,right,wrong1,wrong2]=data[i],isQuiz=l.kind==='quiz';
  if(!['quiz','wiring'].includes(l.kind)||l.project?.tutorialLesson?.phase!=='quiz')continue;
  // Deliberately deterministic answer positions; all content stays non-operational.
  const correctIndex=i%3;
  const options=correctIndex===0?[right,wrong1,wrong2]:correctIndex===1?[wrong1,right,wrong2]:[wrong1,wrong2,right];
  l.summary=summary;
  l.explanation=isQuiz?'Bir örnek üzerinden düşün: '+summary+' Buradaki amaç kavramları ayırmak; sahada kurulum veya uygunluk onayı vermek değil.'
   :'Önce bu parçanın işlevini tanı: '+summary+' Bu temrin fiziksel uygulama kapsamındadır. Şimdilik yalnız kavram sorusu düzeltilmiştir; mevcut örnek şema onarılmış tesisat olarak kabul edilmez.';
  l.quiz={question,options,answer:correctIndex,why:summary};
  r.preRepairTitleTopologyIssue=r.titleTopologyIssue||null;
  r.titleTopologyStatus='REVIEW';
  r.titleTopologyIssue=isQuiz?'CONCEPTUAL_QUIZ_ONLY_NO_PHYSICAL_ACCEPTANCE':
   'PHYSICAL_INSTALLATION_AND_TUTORIAL_TOPOLOGY_NOT_VERIFIED';
  r.titleMatchedQuizRepair='SC1506_1555_TOPIC_MATCHED_CONCEPT_V1';
  r.independentPedagogicalAcceptance=false;
  r.physicalAcceptance=false;
  r.windowsVisualAcceptance=false;
  r.nativeDynamicAcceptance=false;
  r.targetedConceptualPositiveNegative='QUESTION_OPTION_MAPPING_ANSWER_AND_DISTRACTORS_CHECKED';
  r.actualCurriculumSequence=1506+i;
  l.practiceGuide={version:'practice-n1',heading:isQuiz?'Başlığı anlamak için kısa kavram sorusu':'Fiziksel uygulama öncesi kavram kontrolü',
   method:isQuiz?'concept-check':'concept-precheck',virtualOnly:true,
   canonicalGraphUnchanged:true,physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
   steps:['Konumuz: '+l.title,
     'Temel ayrım: '+summary,
     'Soruyu cevapla; cevabın nedenini açıklama üzerinden karşılaştır.'],
   observations:['Bu kavramsal soru gerçek tesisat kurma yönergesi veya fiziksel uygulama kabulü değildir.',
    isQuiz?'Native Simulation.solve / 703 katalog PASS bu kavramsal soruyla kanıtlanmaz.':
    'Kablolu dersin kaynak şeması ve sahada uygulanabilirliği incelenmedi; gerçek kurulum veya Simulation.solve PASS iddia edilmez.',
    'Windows/3D ve bağımsız kabul REVIEW durumunda kalır.'],
   repairModel:'SC1506_1555_TOPIC_MATCHED_CONCEPT_V1'};
 }
 })();


 // SC1556–1605: topic-specific conceptual questions (30 quizzes, 20 wiring prechecks).
 // Physical connection topologies are unchanged and never represented as accepted circuits.
 (() => {
 const data=[["F konnektör koaksiyel kablonun merkez iletkeni ve ekranını ayrı işlevlerde tutan bir radyo frekans bağlantı arayüzüdür.","Koaksiyel kabloda merkez iletken ve dış ekran niçin farklıdır?","Sinyal yoluyla ekranlama ve dönüş görevlerini ayırırlar.","İkisi de yalnız dekoratif dış kaplamadır.","Motorun devir sayısını birlikte yükseltirler."],["İki antenden tek TV'ye ulaşan yayınlar uygun sinyal seçimi veya birleştirme düzeni gerektirebilir.","İki antenli tek TV sisteminde temel planlama konusu nedir?","İki sinyal kaynağının alıcıya uygun biçimde yönlendirilmesi.","İki antenin motor milini döndürmesi.","Antenlerin telefon numarası kaydetmesi."],["Bir antenden iki alıcıya yayın dağıtmak, sinyal seviyesini ve alıcıların bağımsız gereksinimlerini dikkate almayı gerektirir.","Tek antenle iki receiver kullanıldığında hangisi değerlendirilir?","Alıcıların sinyal ve bağımsız kontrol ihtiyaçları.","İki alıcının pano aydınlatmasını artırması.","Bir alıcının diğerine motor akımı üretmesi."],["Multiswitch, merkezi uydu/anten altyapısında farklı yayın hatlarını birden fazla alıcıya yönlendiren dağıtım birimidir.","Merkezi anten tesisatındaki multiswitch ne işe yarar?","Uygun yayın girişlerini alıcı çıkışlarına yönlendirir.","Şebeke frekansını mekanik olarak artırır.","Her televizyonun ekranını fiziksel olarak büyütür."],["Akıllı evde algılayıcılar bilgiyi toplar, denetleyici kararı verir ve eyleyiciler komutu uygular.","Akıllı evin temel işlevsel zinciri nedir?","Algılama, karar verme ve kontrollü eylem.","Sadece motor ve sigorta isimlerini ezberleme.","Bütün cihazları tek bir lamba sayma."],["Akıllı ev planında cihaz yerleri, görevleri ve aralarındaki haberleşme ilişkisi birlikte değerlendirilir.","Akıllı ev elemanlarını tanımlarken hangi bilgi önemlidir?","Cihazın görevi ve sistemle kurduğu işlevsel ilişki.","Sadece ön kapağının rengi.","Her cihazın aynı görevi yaptığı varsayımı."],["Haberleşme protokolü, farklı cihazların aynı veriyi anlaşılır biçimde paylaşabilmesi için kuralları tanımlar.","Akıllı evde haberleşme protokolünün amacı nedir?","Cihazlar arasında anlaşılır ve uyumlu veri alışverişi sağlamak.","Duvarın taşıyıcı kapasitesini hesaplamak.","Bir prizdeki mekanik vida sayısını belirlemek."],["Akıllı evde sensör, denetleyici ve eyleyici farklı görevleri olan ekipman sınıflarıdır.","Bir sensör akıllı ev sistemine öncelikle ne sağlar?","Ortam veya kullanıcı durumuna ilişkin giriş bilgisi.","Doğrudan bina projesinin tapu kaydını.","Bütün çıkışların sürekli açık olmasını."],["KNX, birlikte çalışan cihazların bus üzerinden mantıksal bilgi paylaşmasını amaçlayan bir bina otomasyonu sistemidir.","KNX sisteminde bus haberleşmesinin ana amacı nedir?","Cihazların komut ve durum bilgilerini paylaşması.","Motor sargılarındaki metal miktarını artırmak.","Anten kablosunun dış rengini seçmek."],["Akıllı ev donanımı, uygulanacak işlevler ve birbirleriyle uyum gereksinimleri belirlenerek planlanır.","Akıllı ev cihazı seçmeden önce hangi soru yanıtlanır?","Bu cihaz hangi ihtiyacı karşılayacak ve diğerleriyle uyumlu mu?","Yalnız en parlak kapağı hangisi?","Hepsi aynı programı otomatik çalıştırır mı?"],["Donanım seçiminde görev, uyumluluk ve kullanım koşulları birlikte ele alınmalıdır.","Otomasyon donanımı seçiminde hangi kıstas anlamlıdır?","İşlev, haberleşme uyumu ve uygulama gereksinimi.","Katalogda ilk görünen ürün olması.","Ürün fotoğrafında daha çok renk bulunması."],["Akıllı ev projelendirme, cihazları ve mantıksal işlevleri izlenebilir bir plan üzerinde eşleştirmeyi amaçlar.","Akıllı ev projesi hazırlanırken hangisi değerlidir?","Cihazların görevlerini ve aralarındaki mantıksal ilişkileri belirtmek.","Bütün cihazlara aynı rastgele etiketi vermek.","Sensörleri yalnız süs olarak göstermek."],["Akıllı ev proje sembolleri, gerçek cihazların yerlerini ve işlevlerini anlaşılır biçimde ifade eder.","Bir akıllı ev planını okurken sembol neyi gösterir?","Plana işlenmiş cihaz veya işlevin tanımlı karşılığını.","Duvarın boya markasını.","Motorun tesadüfi ses seviyesini."],["Zemin kat planında alanlar ve bu alanlara ait otomasyon işlevleri anlaşılır biçimde ilişkilendirilir.","Zemin kat akıllı ev projesinde temel okuma becerisi nedir?","Bir mekânı o mekânın sensör ve denetim işlevleriyle eşleştirmek.","Her odayı tek bir elektrik motoru saymak.","Oda adlarını rastgele değiştirmek."],["Birinci kat otomasyon planı, katın odalarına karşılık gelen denetim bölgelerini tanımlar.","Birinci kat otomasyon çizimi neyi anlaşılır kılmalıdır?","Bölümlerle ilgili otomasyon cihaz ve işlevlerinin ilişkisini.","Sadece binanın dış cephesindeki boya tonunu.","Her katın otomatik aynı oda sayısında olduğunu."],["Otomasyon tek hat şeması, bir sistemin ana işlev bloklarını sadeleştirilmiş ilişkilerle gösterir.","Otomasyon tek hat şemasının temel özelliği nedir?","Ana bağlantı ve işlev ilişkilerini sade biçimde özetlemesi.","Her fiziksel kablonun kesitini fotoğraflaması.","Tüm ayrıntılı yazılım kodlarını yerine geçmesi."],["Kuvvet tek hat şeması, güç dağıtımının ana bölümlerini ve besleme ilişkisini kavramsal düzeyde gösterir.","Kuvvet tek hat şeması neyi özetler?","Güç beslemesi ve ana dağıtım yollarının ilişkisini.","İnternet şifrelerinin saklandığı yeri.","Aydınlatma sahnesinin renk paletini."],["Bir akıllı ev senaryosu, belirli koşullarda hangi işlevin etkin olacağını tarif eden davranış kuralıdır.","Akıllı evde senaryo neyi tanımlar?","Koşul veya olay karşısında beklenen otomasyon davranışını.","Tüm sensörlerin üretici seri numarasını.","Binanın beton karışım oranını."],["Bir otomasyon senaryosunda tetikleyici, koşul ve beklenen eylem birbirinden ayrılır.","Aydınlatma senaryosunda tetikleyicinin görevi nedir?","Davranışı başlatabilecek olay veya durumu bildirmek.","Dış cephedeki cam kalınlığını ölçmek.","Her çıkışın koşulsuz yanmasını zorunlu kılmak."],["Uzaktan erişimde yetkilendirme, cihazlara kimin hangi işlemleri yapabileceğini sınırlar.","Akıllı eve uzaktan erişimde hangi özellik önemlidir?","Kimlik doğrulama ve uygun erişim yetkisi.","Parolanın herkesle paylaşılması.","Bütün kullanıcıların sınırsız yetkili olması."],["Akıllı ev programı, giriş olaylarını kurallara göre değerlendirip uygun çıkış davranışına dönüştürür.","Akıllı ev otomasyonunda programın işlevi nedir?","Giriş, koşul ve çıkış davranışlarını ilişkilendirmek.","Cihaz kapağının ağırlığını değiştirmek.","Sensörlerin yalnız marka adını göstermek."],["İlk aydınlatma senaryosu, bir komutun belirli bir aydınlatma grubuna ait olabileceğini gösterir.","Akıllı ev aydınlatma uygulamasında grup kavramı nedir?","Birlikte denetlenmesi istenen ışıkların mantıksal kümesi.","Anten alıcılarının frekans cetveli.","Pano sacının sadece dış kaplaması."],["İkinci aydınlatma senaryosunda sensör bilgisiyle aydınlatma isteği birbirinden farklı kavramlardır.","Sensöre bağlı bir aydınlatma kararında sensör ne sağlar?","Kontrol kuralına girdi olacak bir durum bilgisi.","Lambanın kendi kendine ürettiği sabit şebeke gerilimini.","Motoru mekanik olarak taşıyan yataklamayı."],["Üçüncü aydınlatma senaryosunda ışık sahnesi, birden fazla grubun istenen durumlarını birlikte adlandırır.","Akıllı aydınlatmada sahne kavramı nedir?","Birden çok ışık grubunun önceden tarif edilmiş durumu.","Prizin fiziksel montaj vidası.","Şebekedeki tüm hatların aynı devre olması."],["Dördüncü aydınlatma senaryosu, olay ve zaman koşullarının kontrol kararında birlikte düşünülebileceğini gösterir.","Zamana bağlı aydınlatma senaryosu neye dayanır?","Tanımlanmış zaman koşulu ile beklenen ışık davranışına.","Şebeke frekansının sınırsız artırılmasına.","Anten sinyalinin lamba parlaklığı sanılmasına."],["Güneşlik otomasyonunda açılma ve kapanma komutlarının çakışmaması önemli bir davranış ilkesidir.","Güneşlik denetiminde karşıt komutlar için doğru ilke nedir?","Aç ve kapa isteğinin aynı anda etkin kabul edilmemesi.","İki zıt yönün aynı anda zorunlu seçilmesi.","Tüm sınır bilgilerini yok saymak."],["İkinci güneşlik senaryosunda konum veya sınır bilgisi hareketin mantıksal durdurma koşuluyla ilgilidir.","Otomatik güneşlik kontrolünde sınır bilgisi neden önemlidir?","Hareketin istenen konum sınırına geldiğinin anlaşılması için.","Anten kablosunun ekranını kaldırmak için.","Güneşliğin motorunu internet yönlendiriciye dönüştürmek için."],["Fan-coil, ortam konforu için fan ve ısıtma/soğutma işlevlerinin birlikte ele alındığı bir cihaz grubudur.","Fan-coil otomasyonunda hangi bilgiler birlikte değerlendirilir?","Ortam isteği ve cihazın fan/ısıtma-soğutma durumları.","Televizyon kanal listesi ve anten açısı.","Binanın posta kodu ve cephe rengi."],["VRF/VRV sisteminde farklı alanların iklimlendirme taleplerini merkezî kapasite ve bölge denetimi ilişkilendirir.","VRF/VRV sistemindeki bölge denetimi neyi ifade eder?","Farklı mekânların iklimlendirme ihtiyaçlarının ayrı değerlendirilmesini.","Tüm odaların her zaman aynı ayarda olmasını.","Motor etiketlerinin rastgele dağıtılmasını."],["Akıllı ev güvenlik sisteminde algılama, uyarı ve doğrulama ayrı işlevlerdir; yanlış alarmlar önemlidir.","Güvenlik otomasyonunda algılama olayı ile alarm arasında ne bulunabilir?","Olayı değerlendiren koşul veya doğrulama mantığı.","Sinyali her durumda sessizce yok sayma.","Bütün sensörleri aynı aydınlatma devresi sayma."],["Kuvvet tesisatları, elektrik enerjisinin uygun yük ve dağıtım bölümlerine aktarılmasını konu alır.","Kuvvet tesisatının genel amacı nedir?","Elektrik gücünün yükler için uygun biçimde dağıtılmasını ele almak.","Radyo sinyallerini kanal numarasına çevirmek.","Yalnız yazılım ekranlarının rengini düzenlemek."],["Üç fazlı fiş ve prizler, uygun sistemlerde güç bağlantısının tanımlı ve uyumlu arayüzlerini oluşturur.","Üç fazlı fiş-priz sisteminde uyumluluk neden gereklidir?","Bağlantı arayüzü, kullanım koşulu ve elektriksel gereksinimler uyuşmalıdır.","Farklı tüm ürünlerin koşulsuz birbirine uyması için.","Anten alıcısının hafızasını artırmak için."],["Üç fazlı bağlantı elemanları, görevleri ve kullanım koşullarına uygun teknik özelliklerle tanımlanır.","Üç fazlı fiş veya priz tanınırken hangi bilgi önemlidir?","Bağlantı elemanının işlevi ve beyan edilen teknik özellikleri.","Yalnız kapaktaki reklam sloganı.","Telefon numarası kayıt kapasitesi."],["İletken renkleri, standartlarda belirli işlevlerin ayırt edilmesini destekler; renk tek başına test kanıtı değildir.","Üç fazlı kablolarda renk işaretlemesinin amacı nedir?","İletken işlevlerinin tanınmasına yardımcı olmak.","Renge bakarak her bağlantıyı otomatik güvenli ilan etmek.","Kablo renginin motor devrini tek başına belirlemesi."],["Üç fazlı fiş-priz çeşitleri, kullanım ortamı ve teknik özelliklerine göre farklılaşabilir.","Üç fazlı fiş ve priz çeşitlerini ayıran özellik hangisidir?","Kullanım koşulu ve ürünün teknik sınıfı.","Yalnız ürün fotoğrafının çözünürlüğü.","Hepsinin her ortamda aynı özellikte olması."],["Fiş-priz seçiminde uygunluk yalnız görünüşe değil, sistem gereksinimleri ve üretici özelliklerine dayanır.","Üç fazlı fiş-priz seçiminde anlamlı ölçüt nedir?","Beyan edilen özelliklerle kullanım ihtiyacının uyumu.","Rastgele en ucuz görünüme göre seçim.","Ürün ölçülerinin önemsiz sayılması."],["Üç fazlı bağlantı konusunun kavramsal hedefi, bağlantı arayüzü uyumluluğu ve uzman denetimi gereğini fark etmektir.","Üç fazlı bağlantılarda belge ve üretici bilgileri neden önemlidir?","Uygunluk ve güvenlik değerlendirmesi için izlenebilir referans sağlamaları.","Denetim gereğini ortadan kaldırmaları.","Her parçayı tek tip saymaları."],["Kablo pabucu, çok telli iletkenin uygun bir terminal arayüzünde güvenilir sonlandırılmasına yönelik bir elemandır.","Kablo pabucunun işlevi kavramsal olarak nedir?","Çok telli iletken için tanımlı bir sonlandırma arayüzü sağlamak.","Uydu sinyalini yükselten anten görevi yapmak.","Kablonun elektriksel görevini yok etmek."],["Üç fazlı fiş uygulaması, üreticiye uygun bağlantı arayüzü ve uzman doğrulaması gerektiren fiziksel bir temrindir.","Üç fazlı fiş uygulamasında kavramsal öncelik nedir?","Uygun bağlantı arayüzünün ve uzman kontrolünün gerekli olduğunu bilmek.","Örnek şemayı tek başına saha kabulü saymak.","Farklı bütün fişlerin her zaman aynı olduğunu varsaymak."],["Üç fazlı priz uygulaması, fiziksel uygunluğu bağımsız doğrulanması gereken güç bağlantısı kapsamındadır.","Üç fazlı priz temrini için hangi ifade doğrudur?","Sanal kavram sorusu gerçek tesisat uygunluğunu kanıtlamaz.","Ders sorusunu cevaplamak gerçek tesisatı onaylar.","Her priz görseli güvenilir güç bağlantısı sayılır."],["Kombinasyon panosu, birden fazla güç dağıtım ve bağlantı işlevini tek düzen içinde bir araya getiren panel türüdür.","Üç fazlı kombinasyon panosu neyi bir araya getirir?","İlgili dağıtım ve bağlantı işlevlerinin düzenlenmiş bütününü.","Yalnız internet erişim noktalarının listesini.","Televizyon ses ayarlarını."],["Kombinasyon panosunun tanımı, birden fazla bağlantı/dağıtım bileşeninin ortak panel içinde bulunmasına dayanır.","Kombinasyon panosunu diğer bir nesneden ayıran kavram nedir?","Birden çok ilgili elektriksel işlevin tek pano düzeninde toplanması.","Her zaman yalnız bir LED içermesi.","Sadece antenden gelen sinyalin ölçülmesi."],["Kombinasyon panosu konusunun kavramsal ön çalışması, şema ve teknik dokümanların doğru okunmasını gerektirir.","Pano bağlantısı anlatımında şemaların görevi nedir?","İlgili parçaların tanımlı işlevsel ilişkilerini göstermek.","Fiziksel testi tamamen gereksiz kılmak.","Kablo renklerini tek başına yeterli kabul etmek."],["Kombinasyon panosunun montajı fiziksel uzmanlık gerektirir; bu aşamada yalnız görev ve doğrulama kavramları değerlendirilebilir.","Kombinasyon panosu uygulamasında hangi ayrım doğrudur?","Kavram bilgisi ile fiziksel montaj/kabul kanıtı farklı şeylerdir.","Doğru quiz yanıtı panonun montajını otomatik tamamlar.","Şema olmadan her pano aynı kabul edilir."],["Üç fazlı pano, güç devreleri ve koruyucu/denetleyici bölümleri bir sistem düzeninde birleştirir.","Üç fazlı pano şemasının konusu nedir?","Güç dağıtımı ve ilgili denetim öğelerinin ilişkisi.","Uydu yayınlarının kanal sıralaması.","Yalnız cihazın boya seçimi."],["Pano içi yerleşim planı, parçaların işlevsel gruplarını ve okunabilir yerlerini tanımlar.","Pano yerleşim çiziminde esas kavram hangisidir?","Bileşen gruplarının ve işlevlerinin anlaşılır yerleşimi.","Parçaların tamamen rastgele gösterilmesi.","Şemadaki bütün işaretlerin kaldırılması."],["Üç fazlı pano şemaları, semboller ve adlandırmalarla güç ve denetim bölümlerinin ilişkisini açıklar.","Bir pano şeması okunurken semboller ne sağlar?","Bileşenlerin tanımlı görevlerinin anlaşılmasını.","Üretici teknik değerlerini yok saymayı.","Gerçek test yapılmış sayılmasını."],["Pano şeması çiziminin kavramsal amacı, sistem öğelerini anlaşılır ve izlenebilir bir gösterimde toplamaktır.","Üç fazlı pano çiziminin iyi bir özelliği nedir?","Bileşen ve işlevlerin tutarlı adlandırmayla izlenebilmesi.","Her sembolün her sayfada farklı anlam taşıması.","Fiziksel ölçümün otomatik yapılmış sayılması."],["Kısa devre ve gövdeye kaçak, birbirinden farklı elektriksel arıza kavramlarıdır; gerçek tespit uzman ölçümüne dayanır.","Kısa devre ile gövdeye kaçak arasındaki temel ayrım nedir?","Kısa devre istenmeyen düşük empedanslı yol, gövdeye kaçak iletken gövdeye istenmeyen akım yoludur.","İkisi de yalnız etiket rengi farkıdır.","İkisi de her durumda normal çalışmadır."],["Pano bağlantılarında izlenebilir şema, bileşen uyumu ve yetkili denetimi güvenilirlik açısından birlikte değerlendirilir.","Pano bağlantı planında izlenebilirlik ne demektir?","Şemadaki bileşen ve işlevlerin anlaşılır biçimde takip edilebilmesi.","Her kablonun isimsiz bırakılması.","Kavram sorusunun fiziksel kabul sayılması."]];
 const batch=L.lessons.slice(1555,1605);
 if(batch.length!==50)return;
 for(let i=0;i<50;i++){
   const targetId=i<40?'installation-systems-outline-'+String(i+98).padStart(3,'0'):
     'panel-power-systems-outline-'+String(i+25).padStart(3,'0');
   if(batch[i]?.id!==targetId)return;
 }
 if(batch.filter(l=>l.kind==='quiz').length!==30||batch.filter(l=>l.kind==='wiring').length!==20)return;
 for(let i=0;i<50;i++){
   const l=batch[i],rev=l.pedagogyReview||(l.pedagogyReview={});
   if(rev.independentPedagogicalAcceptance===true||rev.titleMatchedQuizRepair||
      l.project?.tutorialLesson?.phase!=='quiz')continue;
   const [summary,question,right,wrongA,wrongB]=data[i];
   const answer=i%3;
   const options=answer===0?[right,wrongA,wrongB]:answer===1?[wrongA,right,wrongB]:[wrongA,wrongB,right];
   const conceptual=l.kind==='quiz';
   l.summary=summary;
   l.explanation=conceptual?
     'Günlük hayattan düşün: '+summary+' Sorudaki doğru kavramı diğer görevlerden ayırmak yeterli; fiziksel kurulum yapılmış sayılmaz.':
     'Uygulamaya geçmeden işlevi tanı: '+summary+' Bu derste yalnız ön bilgi sorusu onarılmıştır. Mevcut örnek kablolu şema gerçek tesisata veya başlıktaki uygulamaya uygunluk kanıtı değildir.';
   l.quiz={question,options,answer,why:summary};
   rev.preRepairTitleTopologyIssue=rev.titleTopologyIssue||null;
   rev.titleTopologyStatus='REVIEW';
   rev.titleTopologyIssue=conceptual?'CONCEPTUAL_QUIZ_ONLY_NO_PHYSICAL_ACCEPTANCE':
     'PHYSICAL_INSTALLATION_AND_TUTORIAL_TOPOLOGY_NOT_VERIFIED';
   rev.titleMatchedQuizRepair='SC1556_1605_TOPIC_MATCHED_CONCEPT_V1';
   rev.actualCurriculumSequence=1556+i;
   rev.independentPedagogicalAcceptance=false;
   rev.physicalAcceptance=false;
   rev.windowsVisualAcceptance=false;
   rev.nativeDynamicAcceptance=false;
   rev.targetedConceptualPositiveNegative='QUESTION_ANSWER_AND_TWO_DISTRACTORS_CHECKED';
   l.practiceGuide={
     version:'practice-n1',heading:conceptual?'Konuya özgü kısa kavram sorusu':'Fiziksel uygulama öncesi kavram kontrolü',
     method:conceptual?'concept-check':'concept-precheck',
     virtualOnly:true,canonicalGraphUnchanged:true,fullyRich:false,
     physicalTestAccepted:false,pedagogicalAcceptance:false,
     steps:['Konu: '+l.title,'Temel ayrım: '+summary,
       'Sorunun yanıtını değerlendir ve nedenini kısa açıklamayla karşılaştır.'],
     observations:['Bu içerik sahada tesisat yapma adımı, tehlikeli işlem yönergesi veya fiziksel kabul değildir.',
       conceptual?'Kavramsal doğru/yanlış kontrolleri native Simulation.solve PASS olarak gösterilmez.':
       'Kablolu uygulamanın gerçek şeması, malzemeleri ve bağlantı davranışı doğrulanmadı; mevcut devre değiştirilmedi.',
       'Windows/3D, fiziksel ve bağımsız pedagojik kabul REVIEW kalır.'],
     repairModel:'SC1556_1605_TOPIC_MATCHED_CONCEPT_V1'};
 }
 })();

 // SC1606–1655: 43 genuinely conceptual lessons + 7 physical pre-checks.
 // Keep all original wiring topology intact; never claim Simulation.solve PASS for text QA.
 (() => {
 const rows=[[1606,"Beş linyeli üç fazlı kat panosunda yerleşim planı, her devre grubunun işlevini ve etiketini tanınır kılar.","Kat panosunda yerleşim planının öncelikli amacı nedir?","Beş linyeyi ve ilgili bileşenleri şemadaki görevleriyle eşleştirmek.","Parçaları etiket olmadan rastgele dizmek.","Yerleşim çizimini gerçek saha kabulü yerine saymak."],[1607,"Kat panosundaki kablo bağlantıları, devre kimliği ve teknik doküman eşleşmesi gerektiren uzmanlık işidir.","Beş linyeli pano kablo montajı temrininde hangi bilgi önce açıklığa kavuşturulmalıdır?","Her hattın şemada belirtilen görev ve referansının ne olduğu.","İletken renginin tek başına bütün ölçümlerin yerine geçmesi.","Her hattın kullanım amacının aynı sayılması."],[1608,"Dış aydınlatma, açık alanlarda görünürlük, çevre koşulları ve uygun ışık dağılımını birlikte değerlendirir.","Dış aydınlatmanın iç mekân aydınlatmasından ayrılan önemli yönü nedir?","Armatürün dış ortam koşulları ve aydınlatılacak alanla birlikte değerlendirilmesi.","Her direğin aynı ışık dağılımını zorunlu sağlaması.","Dış mekânda çevre koşullarının önemsiz olması."],[1609,"Sokak aydınlatması gereçleri, ışığın yola ve çevresine uygun dağıtılmasını hedefleyen farklı işlevler üstlenir.","Sokak aydınlatma gereci değerlendirilirken hangi özellik anlamlıdır?","Aydınlatılacak alanla uyumlu ışık dağılımı ve çevresel dayanım.","Armatür kutusunun yalnız rengi.","Her ürünün bütün yollarda aynı sonucu vereceği varsayımı."],[1610,"Dış aydınlatma armatürü ışık kaynağı ve optik düzeneği çevresel koruyucu gövdede birleştirir.","Bir dış aydınlatma armatürü seçilirken ışık miktarından başka ne göz önüne alınır?","Işık dağılımı ve dış ortama uygun koruma özellikleri.","Yalnız ürünün reklam adı.","Optik özelliklerin her uygulama için aynı olması."],[1611,"Armatürün iç bağlantı temrininde temel ön bilgi, bileşen görevleri ve üretici şemasını doğru yorumlamaktır.","Dış aydınlatma armatürünün iç düzeni incelenirken hangi bilgi esastır?","Üretici dokümanındaki bileşen görevleri ve uygunluk sınırları.","Armatürün üzerindeki her parçanın aynı görevi gördüğü.","Kavramsal soruyu geçmenin montajı doğruladığı."],[1612,"Dış aydınlatma direği, armatürü uygun konumda taşıyan yapısal ve çevresel koşullara bağlı bir taşıyıcıdır.","Dış aydınlatma direğinin temel işlevi nedir?","Armatürün planlanan alana göre konumlandırılmasına mekanik taşıyıcılık sağlamak.","Şebeke enerjisini kendiliğinden üretmek.","Yalnız ışık rengini ayarlamak."],[1613,"Dış aydınlatma malzemesi seçimi, ortam, koruma, dayanım ve üretici beyanı birlikte okunarak yapılır.","Açık alanda kullanılacak aydınlatma malzemesini değerlendirirken en uygun yaklaşım hangisidir?","Çevre koşulları, beyan edilen koruma düzeyi ve kullanım amacını karşılaştırmak.","Yalnız fotoğraftaki görünüme karar vermek.","Bütün ürünlerin yağmur ve toza aynı dayanımda olduğunu kabul etmek."],[1614,"Sokak aydınlatma armatürü montajında yapı, elektriksel güvenlik ve üretici talimatları ayrı değerlendirme başlıklarıdır.","Dış aydınlatma montaj şeması tek başına neyi kanıtlayamaz?","Sahadaki mekanik ve elektriksel uygunluğun doğrulandığını.","Parçalar arasındaki işlev ilişkisini.","Armatürün plandaki yerini."],[1615,"Armatür montajının kavramsal kontrolünde taşıyıcılık, uygun bağlantı elemanları ve dış ortam etkileri önemlidir.","Dış aydınlatma armatürünün montajı için hangi husus kavramsal olarak kritiktir?","Taşıyıcı düzenin ve üreticiye uygun bileşenlerin birlikte değerlendirilmesi.","Armatürün etiketinin tamamen kaldırılması.","Dış ortam yüklerinin her zaman sıfır sayılması."],[1616,"Dış aydınlatma uygunluğu, güncel yerel kurallar ve ürün dokümanları karşılaştırılarak uzmanlarca değerlendirilir.","Dış aydınlatma düzenlemelerinde hangi kaynak birlikte dikkate alınmalıdır?","Geçerli mevzuat ve ilgili üretici teknik dokümanları.","Yalnız tanıtım afişinin yazı tipi.","Eski veya ilgisiz tek bir örneğin herkes için yeterli olması."],[1617,"Dış aydınlatma hat bağlantısı uygulaması, şema okumayı ve yetkili fiziksel doğrulamayı gerektirir.","Dış aydınlatma armatürünün hat bağlantısı temrininde hangi ayrım korunmalıdır?","Kâğıt üzerindeki şema bilgisi ile gerçek saha uygunluk kanıtını ayrı tutmak.","Bir quiz cevabını fiziksel muayenenin yerine koymak.","Her direk ve armatürün aynı terminal düzenini taşıdığını varsaymak."],[1618,"Fotosel röle dış ortam ışık seviyesine bağlı kontrol talebi üretir; eşik ve gecikme tasarıma göre değişebilir.","Dış aydınlatmada fotosel rölenin kavramsal görevi nedir?","Ortam ışığına bakarak aydınlatma isteğinin ne zaman değişeceğini belirlemek.","Direğin mekanik yüksekliğini ölçmek.","Gündüz ve geceyi her zaman aynı durum olarak bildirmek."],[1619,"Asenkron motor konusunda elektriksel döner alan ve dönen rotor arasındaki ilişki temel öğrenme hedefidir.","Asenkron motor konusunun merkezindeki kavram hangisidir?","Statorun döner manyetik alanı ile rotor hareketinin ilişkisi.","Motorun yalnız boyasının incelenmesi.","Her motorun sabit akımla aynı devirde döndüğü varsayımı."],[1620,"Asenkron motorun ana parçaları, sabit stator ile dönen rotorun ayrı görevlerini oluşturur.","Bir asenkron motorun stator ve rotor arasındaki temel ayrım nedir?","Stator sabit bölüm, rotor dönen bölümdür.","Stator daima dönen şaftın kendisidir.","Rotor yalnız dış koruma kapağından oluşur."],[1621,"Stator, sargılar ve manyetik nüve sayesinde motorun manyetik alanını oluşturan sabit bölümüdür.","Asenkron motorun stator sargıları hangi işleve katkı sağlar?","Elektrik enerjisiyle motorun manyetik alanını oluşturmak.","Milin mekanik yatağı yerine geçmek.","Yalnız motorun dış rengini belirlemek."],[1622,"Rotor, statorun değişen alanıyla etkileşerek tork üreten döner bileşendir.","Asenkron motorun rotorunun temel görevi nedir?","Manyetik alanla etkileşip dönme momenti üretmek.","Şebeke anahtarı olarak görev yapmak.","Yalnız motor etiketini taşımak."],[1623,"Motor gövdesi ve kapakları, koruma ve yataklama düzeninin taşınması için mekanik bütünlük sağlar.","Asenkron motorda gövde ve kapakların öncelikli rolü nedir?","İç parçaları taşımak, korumak ve mekanik yerleşimi desteklemek.","Şebeke frekansını ölçüp değiştirmek.","Rotorun elektriksel dönüş hızını tek başına programlamak."],[1624,"Asenkron motorda rotor hızı normal motor çalışma durumunda döner alanın senkron hızından biraz farklıdır.","Asenkron motorun kayma (slip) kavramı neyi açıklar?","Rotor hızı ile stator döner alanının senkron hızı arasındaki farkı.","Gövdenin boya kalınlığını.","Her motorda sıfır olan zorunlu bir hız farkını."],[1625,"Motor etiketi, anma gerilimi, akımı, frekansı ve çalışma koşulları gibi üretici verilerini içerir.","Motor etiketinin teknik açıdan temel değeri nedir?","Uygun çalışma koşullarını değerlendirmeye yarayan anma bilgilerini sağlaması.","Her motorun aynı gerilimde çalışacağını kanıtlaması.","Koruma elemanlarını gereksiz kılması."],[1626,"Asenkron motor bağlantı düzeni motor etiketindeki uygun gerilim ve sargı özellikleriyle ilişkilendirilir.","Yıldız veya üçgen bağlantı kavramı değerlendirilirken neden motor etiketi önemlidir?","Sargıların izin verilen çalışma gerilimi bağlantı seçimini etkilediği için.","Bağlantı şekli daima motor boyasına göre seçildiği için.","Bütün motorlar her gerilimde iki bağlantıyı da kaldırdığı için."],[1627,"Yıldız bağlantıda ideal dengeli üç fazlı sistemde sargı faz gerilimi hat geriliminin karekök üçe bölünmüş hâlidir.","Dengeli yıldız bağlantıda faz gerilimi ile hat gerilimi ilişkisi hangisidir?","Faz gerilimi, hat geriliminin yaklaşık 1/1,73'üdür.","Faz gerilimi daima hat geriliminin üç katıdır.","Faz ve hat gerilimi her zaman birbirinden bağımsızdır."],[1628,"Üçgen bağlantıda dengeli üç fazlı sistemde her sargı faz gerilimi hat gerilimine eşittir.","Dengeli üçgen bağlantıda faz ve hat gerilimi arasındaki ilişki nedir?","Sargı faz gerilimi hat gerilimine eşittir.","Faz gerilimi daima sıfırdır.","Faz gerilimi her durumda hat geriliminin iki katıdır."],[1629,"Üç fazlı asenkron motorda uygulanan faz sırası dönme alanının ve dolayısıyla dönüş yönünün belirleyicisidir.","Üç fazlı bir motorun dönme yönü kavramsal olarak neyle ilişkilidir?","Besleme faz sırası ve döner manyetik alanın yönüyle.","Gövdeye yapıştırılan etiketin rengiyle.","Termik rölenin marka yazısıyla."],[1630,"Asenkron motor uygulamasında yön ve çalışma beklentisi, üretici bilgisi ile yetkili denetim kapsamında değerlendirilmelidir.","Asenkron motor uygulaması öncesindeki teorik kontrolde ne ayrılmalıdır?","Faz sırasına ilişkin kavram ile gerçek elektriksel ve mekanik kabulü.","Doğru quiz yanıtı ile tamamlanmış saha testini aynı görmek.","Her motorun etiketsiz ve kontrolsüz eşdeğer olduğunu varsaymak."],[1631,"Motor kumandasında güç devresi enerji akışını, kumanda devresi ise çalışma kararlarını yönetir.","Motor kumandası öğrenme bölümünde güç ve kumanda devresi neden ayrı ele alınır?","Enerji taşıyan yol ile komut/karar yolu farklı görevler üstlendiği için.","Her iki yol sadece motor kaplamasını belirlediği için.","Kumanda devresi bir mekanik şaft olduğu için."],[1632,"Devre şemaları, sistem elemanlarının işlevsel bağlarını sembollerle açıklayan teknik belgelerdir.","Bir motor kumanda devre şemasının genel görevi nedir?","Bileşenlerin işlev ve bağlantı ilişkilerini açık göstermesi.","Motorun fiziksel onay belgesi yerine geçmesi.","Bütün cihazların fabrikadan aynı terminalle çıkmasını zorunlu kılması."],[1633,"Güç ve kumanda şemasındaki semboller aynı parçanın enerji ve kontrol görevinin izlenmesine yardımcı olur.","Motor kumanda şemasında kontaktör sembolünü tanımak neyi kolaylaştırır?","Bobin ve ilgili kontakların işlevlerini doğru ilişkilendirmeyi.","Şebeke frekansını tek bakışta değiştirmeyi.","Her bağlantının otomatik hatasız olduğunu varsaymayı."],[1634,"Güç devresiyle kumanda devresinin ayrı ve tutarlı gösterimi karmaşık motor şemasını okunur kılar.","Güç ve kumanda şeması hazırlanırken hangi ilke önemlidir?","Aynı cihazların iki bölümde tutarlı referanslarla tanınması.","Aynı kontaktöre her yerde farklı kimlik verilmesi.","Kontrol devresinin hiçbir sembol kullanılmadan çizilmesi."],[1635,"Devre şemalarının genel kuralı, sembol, hat ve referansların belirsizliğini azaltmaktır.","Teknik devre şemasının okunabilirliğini ne artırır?","Standartlaştırılmış semboller ve izlenebilir cihaz referansları.","Bütün bağlantıların açıklamasız bırakılması.","Aynı sembolün her satırda farklı anlam taşıması."],[1636,"Şemadaki tanıtma işaretleri, cihazlar ve kontakları aynı referans altında izlemeyi sağlar.","K1 gibi cihaz referansının şemadaki amacı nedir?","Aynı cihazın bobiniyle ilişkili elemanlarını ayırt etmeye yardımcı olması.","Kablonun fiziksel uzunluğunu otomatik ölçmesi.","Her devrede aynı cihaz türünü zorunlu kılması."],[1637,"Kumanda devre şeması, başlatma, durdurma ve izin şartlarının ilişkilerini açık gösterir.","Bir kumanda şemasında STOP ve START komutlarının kavramsal farkı nedir?","STOP durdurma isteğini, START çalışma isteğini temsil eder.","STOP her zaman hız artırma komutudur.","START yalnız topraklama iletkenini tarif eder."],[1638,"Güç devresi şeması, besleme, anahtarlama, koruma ve motor gibi yüklerin ilişkisini gösterir.","Motor güç devresi şemasının konusu nedir?","Motoru besleyen enerji yolu ile ana güç bileşenleri.","Yalnız kontrol butonunun plastik rengi.","Haberleşme yazılımının parola listesi."],[1639,"Motor kumanda uygulaması için önce devrenin istenen davranışı ve ana kontrol kararları açıklığa kavuşturulur.","Uygulama öğrenme bölümünde doğru başlangıç yaklaşımı nedir?","İstenen motor davranışını ve durdurma koşulunu kavramsal olarak tarif etmek.","Bütün kumanda türlerinin aynı davranışı verdiğini varsaymak.","Şemadaki cihaz kimliklerini açıklamasız kaldırmak."],[1640,"Motor devre uygulamaları, seçilmiş bir komutun beklenen davranışını şema üzerinden tartışmayı sağlar; gerçek uygulama ayrıca doğrulanır.","Motor devre uygulaması ön bilgisinde hangi ayrım önemlidir?","Şemaya dayalı davranış beklentisi ile gerçek donanım kabulünün farklı olması.","Bir sorunun cevabını tüm saha doğrulaması saymak.","Kumanda devresini güç devresiyle eş anlamlı görmek."],[1641,"Kesik (jog) motor kumandasında çalışma isteği yalnız anlık komut sürdüğü sürece vardır.","Kesik çalıştırma ile sürekli çalıştırmanın temel farkı nedir?","Kesik çalıştırmada motor çalışma isteği anlık komuta bağlıdır.","Kesik çalıştırmada START mutlaka kendini mühürler.","Sürekli çalışmada STOP komutu hiçbir şey değiştirmez."],[1642,"Sürekli motor kumandasında başlatma isteğinin bırakılmasından sonra çalışma izni yardımcı kontakla korunabilir.","Motorun sürekli çalışmasında mühürleme mantığı ne işe yarar?","START bırakıldıktan sonra çalışma komutunun izin verildiği sürece korunmasına.","Motorun frekansını daima ikiye katlamaya.","STOP işlevinin kalıcı kaldırılmasına."],[1643,"Uzaktan kumanda, motor komutlarının kumanda devresindeki başka bir konumdan iletilebilmesidir.","Motorun uzaktan kumandası neyi ifade eder?","Motor çalışma komutunun kumanda sistemi üzerinden farklı konumdan verilmesini.","Motorun fiziksel enerjisinin kablosuz zorunlu taşınmasını.","Motor şaftının her zaman ters dönmesini."],[1644,"Üç fazlı motorun devir yönü, uygulanan faz sırasına bağlıdır; karşıt yön istekleri çakışmamalıdır.","Devir yönü değiştirme kumandasında kavramsal güvenlik ilkesi nedir?","İleri ve geri yönde aynı anda çelişen komutları engellemek.","Her iki yöne aynı anda çalışmayı zorunlu tutmak.","Motor koruma gereksinimlerini yok saymak."],[1645,"Buton kilitlemesi, ileri ve geri gibi karşıt çalışma isteklerinin birlikte oluşmasını önlemeye yöneliktir.","Buton kilitlemeli yön kumandasında kilitlemenin amacı nedir?","Çakışan yön komutlarının eşzamanlı seçimini engellemek.","START ve STOP işlevlerini aynı anda yok etmek.","İleri ve geri komutlarını bilerek kısa devre etmek."],[1646,"Elektriksel kilitleme, karşı kontaktörün yardımcı kontak bilgisini karar koşuluna katar.","Elektriksel kilitlemeli yön kumandası hangi bilgiyi kullanır?","Diğer yönün kontaktör durumuna ait karşılıklı izin bilgisini.","Motor gövdesinin boya kodunu.","Motor milinin üretim tarihini."],[1647,"Zaman ayarlı durdurma, çalışma iznini bir süre koşuluna bağlar; bu davranış emniyet durdurma yerine geçmez.","Zaman ayarlı motor durdurma neyi temel alır?","Tanımlanmış süre sonunda çalışma izninin değişmesini.","Motorun sonsuza kadar enerjili kalmasını.","STOP düğmesinin mekanik olarak kaldırılmasını."],[1648,"Asenkron motorda ilk kalkış anı, çalışma durumuna kıyasla daha yüksek akım çekilmesine yol açabilir.","Motorlarda kalkış akımının düşürülmesi konusu hangi olguyla ilgilidir?","Motorun ilk kalkışında oluşabilen yüksek akımın etkileriyle.","Motor etiketindeki yazı karakterleriyle.","Şebeke frekansının yalnız rengine bağlı olmasıyla."],[1649,"Yüksek kalkış akımı, besleme altyapısında gerilim düşümü ve diğer yüklerin etkilenmesi gibi sonuçlar doğurabilir.","Motor kalkış akımının şebeke üzerindeki olası etkisi nedir?","Gerilim düşümü ve beslenen diğer yüklerin etkilenmesi.","Besleme hatlarının daima daha da güçlü hale gelmesi.","Şebekenin her zaman hiç etkilenmemesi."],[1650,"Motor kalkış akımını azaltmak için farklı yol verme ve sürücü yaklaşımları bulunur; seçim yüke ve motora bağlıdır.","Kalkış akımını azaltma yöntemleri değerlendirilirken hangi ölçüt önemlidir?","Motorun ve yükün uygunluğu ile yöntemin sınırları.","Tüm yöntemlerin her motorda aynı sonucu verdiği varsayımı.","Yalnız yöntemin ticari adının uzunluğu."],[1651,"Yıldız-üçgen yol verme, uygun motorlarda ilk aşamada sargılara daha düşük gerilim uygulanmasını amaçlar.","Yıldız-üçgen yol vermenin temel kavramsal amacı nedir?","Uygun koşullarda ilk kalkış akımı etkisini azaltmak.","Her motora her an en yüksek kalkış momentini sağlamak.","Motor etiketini okumayı gereksiz kılmak."],[1652,"Yıldız-üçgen geçiş zamanı ve komutların çakışmaması, yol verme davranışının önemli sınırlarıdır.","Yıldız-üçgen geçiş süresi değerlendirilirken hangi ilke önemlidir?","Motorun koşullarına uygun geçiş ve çakışan komutların engellenmesi.","Yıldız ve üçgenin sürekli aynı anda seçilmesi.","Sürenin her uygulamada ve yükte aynı olması."],[1653,"Oto trafosuyla yol vermede ilk kalkışta motora uygulanan gerilim düşürülerek kalkış davranışı değiştirilir.","Oto trafosuyla yol vermenin kavramsal esası nedir?","Başlangıçta uygulanan gerilimi dönüştürerek kalkış etkisini yönetmek.","Kablo rengini dönüştürerek rotor hızını artırmak.","Her durumda ek enerji üretmek."],[1654,"Dirençle yol vermede geçici seri direnç gerilim düşümüne yol açar; kayıplar ve kalkış momenti değerlendirilir.","Dirençle yol verme yönteminin temel sınırlaması hangisidir?","Dirençte enerji kaybı ve motorun kalkış momentindeki değişim.","Seri direncin hiçbir zaman ısınmaması.","Gerilim düşümünün her koşulda sıfır olması."],[1655,"Kaynaklar bölümü, öğrenilen motor konularının doğrulanabilir kitap ve üretici belgelerine bağlanmasını destekler.","Bir teknik eğitim kitabında KAYNAKLAR bölümünün temel işlevi nedir?","Bilgilerin dayandığı yayın ve teknik belgelere ulaşmayı sağlamak.","Her şemayı fiziksel olarak test edilmiş ilan etmek.","Öğrenme konularını kaynak göstermeden değiştirmek."]];
 const batch=L.lessons.slice(1605,1655);
 if(batch.length!==50)return;
 const expectedId=n=>n<=1618?'installation-systems-outline-'+String(n-1468).padStart(3,'0'):
  n===1623?'digital-logic-apps-outline-049':
  n<=1622?'motor-direct-power-outline-'+String(n-1409).padStart(3,'0'):
  n<=1647?'motor-direct-power-outline-'+String(n-1410).padStart(3,'0'):
  n<=1654?'motor-start-speed-outline-'+String(n-1608).padStart(3,'0'):
  'motor-direct-power-outline-238';
 for(let i=0;i<50;i++)if(batch[i]?.id!==expectedId(1606+i))return;
 if(batch.filter(l=>l.kind==='quiz').length!==43||batch.filter(l=>l.kind==='wiring').length!==7)return;
 for(const [n,fact,question,correct,wrongA,wrongB] of rows){
  const l=L.lessons[n-1],rev=l.pedagogyReview||(l.pedagogyReview={});
  if(rev.independentPedagogicalAcceptance===true||rev.titleMatchedQuizRepair||
    l.project?.tutorialLesson?.phase!=='quiz')continue;
  const concept=l.kind==='quiz',answer=(n-1606)%3;
  const options=answer===0?[correct,wrongA,wrongB]:answer===1?[wrongA,correct,wrongB]:[wrongA,wrongB,correct];
  l.summary=fact;
  l.explanation=concept?
    'Bu konuda temel fikir şu: '+fact+' Sorudaki seçenekleri karşılaştır; doğru işlevi tanı. Bu bir kavram çalışmasıdır, gerçek motor veya saha sistemi testi değildir.':
    'Önce başlığın ne anlattığını öğrenelim: '+fact+' Burada yalnız güvenli kavramsal hazırlık yapıyoruz. Mevcut örnek kablolu proje başlığa uygun gerçek bir tesisat şeması olarak kabul edilmedi; fiziksel uygulama doğrulanmadı.';
  l.quiz={question,options,answer,why:fact};
  rev.preRepairTitleTopologyIssue=rev.titleTopologyIssue||null;
  rev.titleTopologyStatus='REVIEW';
  rev.titleTopologyIssue=concept?'TOPIC_SPECIFIC_CONCEPT_QUIZ_ONLY_NO_DYNAMIC_OR_PHYSICAL_ACCEPTANCE':
    'PHYSICAL_PRACTICE_TOPOLOGY_AND_SAFETY_ACCEPTANCE_NOT_VERIFIED';
  rev.titleMatchedQuizRepair='SC1606_1655_TOPIC_MATCHED_CONCEPT_V1';
  rev.actualCurriculumSequence=n;
  rev.independentPedagogicalAcceptance=false;
  rev.physicalAcceptance=false;
  rev.windowsVisualAcceptance=false;
  rev.nativeDynamicAcceptance=false;
  rev.targetedConceptualPositiveNegative='QUESTION_RIGHT_OPTION_AND_TWO_FALSE_DISTRACTORS_CHECKED_NO_NATIVE_CLAIM';
  l.practiceGuide={
   version:'practice-n1',
   heading:concept?'Başlığa özgü kavramı öğren':'Fiziksel temrin öncesi kavramsal hazırlık',
   method:concept?'concept-check':'concept-precheck',
   virtualOnly:true,canonicalGraphUnchanged:true,fullyRich:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['Konu: '+l.title,'Öğrenilecek ayrım: '+fact,'Soruyu yanıtla, ardından gerekçeyi incele.'],
   observations:['Bu bölüm yalnız kuramsal ön bilgi içerir; sahada elektriksel bağlantı veya fiziksel uygulama talimatı değildir.',
    concept?'Kavramsal pozitif-negatif soru kontrolü, özgün Simulation.solve native kabulü değildir.':
      'Orijinal örnek devre değiştirilmedi; bu temrin için gerçek devre topolojisi, üretici belgesi ve fiziksel kabul henüz doğrulanmadı.',
    'Golden/PASS/HOLD/REVIEW kilitleri, Windows/3D, fiziksel ve bağımsız pedagojik kabul korunur.'],
   repairModel:'SC1606_1655_TOPIC_MATCHED_CONCEPT_V1'};
 }
 })();


 // SC1656–1686: exact, type-safe conceptual repairs of 31 quiz lessons.
 // Historical projects and motor power diagrams are unverified references, never native acceptance.
 (() => {
  const rows=[[1656,"Buton, basılı tutulduğu sürece konum değiştiren anlık kumanda elemanıdır; NO ve NC kontakların normal durumları farklıdır.","Bir START butonunun NO kontağı normal durumda nasıldır?","Açıktır; basıldığında kapanır.","Sürekli kapalıdır; basılınca da değişmez.","Yalnız motor hızı arttığında kapanır."],[1657,"Anahtarın kalıcı konumu ile yaylı butonun anlık konumu farklı kullanım davranışı oluşturur.","Kalıcı konumlu bir anahtar ile anlık buton arasındaki temel fark nedir?","Anahtarın seçilen konumda kalabilmesi.","İkisinin her zaman aynı şekilde geri dönmesi.","Anahtarın tek başına aşırı akımı ölçmesi."],[1658,"Paket şalter, seçilen konumda birden fazla mekanik kontağın durumunu birlikte değiştirebilir.","Paket şalterin birden çok kontakla kullanılması ne sağlar?","Farklı devre yollarının konuma bağlı olarak birlikte seçilmesini.","Elektrik enerjisinin kendiliğinden üretilmesini.","Her motor için mutlaka aynı çalışma yönünü."],[1659,"Koruma rölesi uygunsuz koşulu algılamaya; kumanda rölesi komutla bir devrenin durumunu değiştirmeye odaklanır.","Koruma rölesi ile kumanda rölesi hangi yönüyle ayrılır?","Biri koruma koşulunu izler, diğeri kumanda işlevi görebilir.","İkisi de yalnız elektrik enerjisi depolar.","İkisi de motorun mekanik devrini doğrudan ölçer."],[1660,"Elektrik motoru, elektrik enerjisini mekanik dönme veya harekete dönüştüren aygıttır.","Elektrik motorunun temel enerji dönüşümü nedir?","Elektrik enerjisinden mekanik harekete dönüşüm.","Mekanik hareketten yalnız ışık üretimi.","Elektrik enerjisinin yakıta çevrilmesi."],[1661,"Alternatif akım motorlarında stator alanının zamanla değişmesi elektromanyetik dönme etkisinin temelidir.","AC motorlarında statorun oluşturduğu manyetik alan neden önemlidir?","Rotor üzerindeki elektromanyetik etkileşimi oluşturduğu için.","Sadece gövde rengini belirlediği için.","Dönme yönünü her koşulda sonsuza kadar sabitlediği için."],[1662,"Tek fazlı asenkron motorda yalnız tek fazlı stator alanı, ilk hareket için ek bir yol verme etkisi gerektirebilir.","Bir fazlı asenkron motor neden yardımcı başlatma düzenine ihtiyaç duyabilir?","İlk kalkış torkunu oluşturmak için.","Üç fazı sürekli eşit ölçmek için.","Rotorunu sabit mıknatısa çevirmek için."],[1663,"Yardımcı sargı, ana sargıya göre farklı faz etkisi oluşturarak başlangıç torkuna katkı sağlar.","Yardımcı sargılı motorun yardımcı sargısı hangi işe yarar?","Kalkışta farklı fazlı bir manyetik etki oluşturmaya.","Motoru mekanik olarak kilitlemeye.","Şebeke frekansını kendi başına iki katına çıkarmaya."],[1664,"Kondansatörlü motorda kondansatör, yardımcı sargı akımının fazını değiştirip başlangıç veya çalışma torkunu etkiler.","Kondansatörlü bir fazlı motorda kondansatörün ana görevi nedir?","Yardımcı sargı akımına faz farkı kazandırmak.","Motor sargılarını kaldırmak.","Rotoru doğrudan dişli çark gibi döndürmek."],[1665,"Üç fazlı asenkron motorun dengeli fazlı stator akımları döner manyetik alan oluşturur.","Üç fazlı asenkron motorda döner alanın kaynağı nedir?","Birbirinden fazca kaymış stator akımları.","Rotor milinin boyası.","Tek bir sabit mıknatısın mekanik sabitliği."],[1666,"Sincap kafesli rotorda iletken çubuklar uç halkalarıyla kısa devre edilmiştir; rotor akımı endüksiyonla oluşur.","Kısa devre rotorlu asenkron motoru hangi rotor özelliği tanımlar?","Uç halkalarıyla birleştirilen iletken çubuklar.","Yalnız fırça ile beslenen sürekli rotor sargısı.","Rotorun tamamen iletkensiz olması."],[1667,"Bilezikli asenkron motorda sargılı rotorun devresi bilezikler üzerinden erişilebilir; kalkış davranışı bundan etkilenebilir.","Rotoru sargılı bilezikli motoru kafes rotordan ayıran özellik hangisidir?","Sargılı rotor devresine bileziklerle erişilebilmesi.","Rotorda hiçbir iletken bulunmaması.","Motorun mutlaka doğru akımla beslenmesi."],[1668,"Senkron motorda rotor, kararlı çalışma halinde statorun döner alanıyla aynı senkron hızda döner.","Senkron motorun kararlı durum hızını tanımlayan ilişki nedir?","Rotor hızının döner alanın senkron hızına eşit olması.","Hızın yükten bağımsız olarak her zaman sıfır olması.","Rotorun stator alanından sürekli daha hızlı kayması."],[1669,"Doğru akım motorunda manyetik alan ve endüvi akımının etkileşimi elektromanyetik tork üretir.","DC motorun dönme momenti hangi temel etkileşimle oluşur?","Manyetik alan ile akım taşıyan iletkenlerin etkileşimiyle.","Yalnız gövde sıcaklığının sabit tutulmasıyla.","Kapasitörün her durumda üç faz üretmesiyle."],[1670,"Şönt DC motorda alan sargısı, endüvi koluna paralel bağlanan ayrı bir alan devresi oluşturur.","Şönt motor adındaki 'şönt' neyi anlatır?","Alan sargısının endüviye paralel bağlı olmasını.","Alan sargısının endüviye daima seri bağlı olmasını.","Rotorun hiçbir manyetik alan kullanmamasını."],[1671,"Seri DC motorda alan sargısı endüviyle seri olduğu için aynı akım her ikisinden geçer; yüksüz hız davranışı kritik olabilir.","Seri motorun karakteristik bağlantı ilişkisi nedir?","Alan sargısının endüviyle seri olması.","Alan akımının tümüyle bağımsız sabit olması.","Alanın yalnız sabit mıknatısla sağlanması."],[1672,"Kompunt DC motor, seri ve şönt alan sargılarının etkilerini birlikte kullanan birleşik alanlı motordur.","Kompunt motoru hangi özellik tanımlar?","Seri ve paralel alan sargılarının birlikte bulunması.","Statorun tümüyle sargısız olması.","Sadece iki fazlı asenkron rotor kullanması."],[1673,"Sabit mıknatıslı DC motorda alan, sürekli mıknatıslarla oluşturulur; ayrı bir alan sargısı gerekmez.","Sabit mıknatıslı motorun alanı nasıl üretilir?","Kalıcı mıknatısların manyetik alanıyla.","Yalnız harici alan sargısından geçen akımla.","Şebekedeki üçüncü fazın kondansatörsüz eklenmesiyle."],[1674,"Kumanda sembolleri, kontakların normal konumunu ve bobinle ilişkisini okunabilir biçimde gösterir.","Kumanda devresindeki NO ve NC kontak simgeleri en önce neyi belirtir?","Enerjisiz veya basılmamış normal temas durumunu.","Her elemanın kesin fiziksel rengini.","Motorun nominal güç etiketini tek başına."],[1675,"Kumanda devresi çizimi, komut ve izin koşullarını sembollerle mantıksal olarak izlemeyi sağlar.","Kumanda devresi çiziminin temel okuma amacı nedir?","Komutun hangi koşullarda ilgili bobine veya işlevsel yola ulaştığını anlamak.","Elemanların panodaki fiziksel mesafesini birebir göstermek.","Her sembolün fabrika kabulünü tamamlamak."],[1676,"Kumanda şemasında START, STOP, yardımcı kontak ve bobin birbirinden farklı kontrol görevleri üstlenir.","Kumanda devresi şeması hangi bilgiyi ön plana çıkarır?","Kontrol komutlarının ve kontak koşullarının mantıksal ilişkisini.","Motor gücünün yalnız mekanik dişli oranını.","Kabloların bina içindeki kesin uzunluğunu."],[1677,"Güç devresi şeması, yük enerjisinin güç elemanları üzerinden motora ulaşan ana yolunu temsil eder.","Motor güç devresi çiziminde hangi ilişki esastır?","Kaynak, güç anahtarlama/koruma ve motor yük yolunun gösterilmesi.","START butonunun ekrandaki renginin açıklanması.","Yalnız PLC hafıza bitlerinin listelenmesi."],[1678,"Eleman listesi, şemadaki referans harflerini doğru katalog parçası ve işlevle eşleştirir.","Kumanda devresi eleman listesinde hangi eşleşme aranır?","Sembol referansı, parça tanımı ve işlev uyumu.","Aynı parçaya gelişigüzel farklı kimlikler yazılması.","Yalnız görseldeki kablo uzunluğunun belirtilmesi."],[1679,"Asenkron motorlarda yol verme yönteminin seçimi, ilk kalkış akımı, tork ve yük koşullarıyla ilişkilidir.","Asenkron motora yol verme yöntemi neden her uygulamada aynı seçilmez?","Kalkış akımı, moment gereksinimi ve yük özellikleri değişebildiği için.","Tüm motorların gücü ve yükü her zaman aynı olduğu için.","Yol verme, motorun ilk hareketinden bağımsız olduğu için."],[1680,"Direkt yol vermede uygun motor, beslemenin tam anma gerilimine yakın bir değerle kalkışa alınır; kalkış akımı yüksek olabilir.","Direkt yol vermenin dikkat çeken özelliği nedir?","Motora kalkışta yaklaşık tam şebeke geriliminin uygulanması.","Kalkış akımının daima sıfır olması.","Motorun beslemesiz hızlanması."],[1681,"0–1 paket şalter, iki seçilebilir durumu tanımlar: devre yolu açık veya seçili konumda kapalı.","0–1 paket şalterin iki temel konumu neyi anlatır?","Kapalı/çalışma izni olmayan 0 ve seçili bağlantı durumu 1 ayrımını.","Kendiliğinden üç farklı hız üretilmesini.","Aşırı yük akımının mutlaka sıfırlanmasını."],[1682,"Kontaktör, kumanda devresinden gelen bobin komutuyla ana güç kontaklarını değiştirebilen elektromekanik anahtardır.","Kontaktörle yol verme yaklaşımının kavramsal farkı nedir?","Güç kontaklarının bir bobin/kumanda komutuyla çalıştırılması.","Motoru yalnız elle mekanik olarak çevirmek.","Hiçbir kumanda elemanı kullanmamak."],[1683,"Üç fazlı motorlarda dönüş yönü faz sıralamasıyla ilişkilidir; karşıt yön komutları için elektriksel/mekanik kilitleme önemlidir.","Yön değiştiren motor kumandasında karşıt komutların çakışması neden önlenir?","Eşzamanlı karşıt komutlar tehlikeli bir anahtarlama durumu oluşturabileceği için.","Motoru her zaman daha verimli hale getirdiği için.","Bobinlerin görevini tamamen ortadan kaldırdığı için."],[1684,"Kumanda devresi arızaları, sağlam bir motor olsa bile kumanda zincirinden gerekli izin oluşmasını engelleyebilir.","Bir motor dönmüyorsa yalnız motorun kendisini arızalı saymak neden yanlıştır?","Kumanda zincirindeki izin/komut eksikliği de sebep olabileceği için.","Her arızanın mutlaka rotor kırılması olduğu için.","Kontak ve bobinlerin hiçbir etkisi olmadığı için."],[1685,"Kontaktör arızası, bobin, yardımcı kontak veya ana kontakla ilişkili olabilir; yalnız dış görünüm kesin teşhis değildir.","Kontaktör arızasında neden yalnız tek bir belirtiyle kesin karar verilmez?","Bobin ve kontakların farklı görevleri ve olası arıza biçimleri bulunduğu için.","Kontaktörün tek bir sabit parçası olduğu için.","Tüm arızaların otomatik olarak aynı sonucu verdiği için."],[1686,"Kumanda arızasını değerlendirirken belirtileri şemadaki kontrol koşullarıyla ilişkilendirmek gerekir; fiziksel inceleme yetkin kişilere bırakılır.","Kumanda devresi arıza tespitinde ilk düşünsel adım nedir?","Belirtiyi, şemada beklenen izin ve komut koşullarıyla karşılaştırmak.","Şemaya bakmadan kabloları rastgele değiştirmek.","Enerji altındaki bağlantılara doğrudan müdahale etmek."]];
  const batch=L.lessons.slice(1655,1686);
  if(batch.length!==31||batch.some(l=>l?.kind!=='quiz'||l?.project?.tutorialLesson?.phase!=='quiz'))return;
  const expected=[
   'motor-direct-power-outline-239','motor-direct-power-outline-240','motor-direct-power-outline-241',
   'digital-logic-apps-outline-050','motor-direct-power-outline-242','motor-direct-power-outline-243',
   'motor-special-outline-019','motor-special-outline-020','motor-special-outline-021',
   'motor-direct-power-outline-244','motor-direct-power-outline-245','motor-direct-power-outline-246',
   'motor-special-outline-022','motor-direct-power-outline-247','motor-direct-power-outline-248',
   'motor-direct-power-outline-249','motor-direct-power-outline-250','motor-direct-power-outline-251',
   'motor-direct-power-outline-252','motor-direct-power-outline-253','motor-direct-power-outline-254',
   'motor-direct-power-outline-255','motor-direct-power-outline-256','motor-start-speed-outline-047',
   'motor-start-speed-outline-048','motor-start-speed-outline-049','motor-start-speed-outline-050',
   'motor-direct-power-outline-257','motor-direct-power-outline-258','motor-direct-power-outline-259',
   'motor-direct-power-outline-260'
  ];
  if(batch.some((l,i)=>l.id!==expected[i]))return;
  for(const [n,fact,question,correct,wrongA,wrongB] of rows){
   const l=L.lessons[n-1];
   const old=l.pedagogyReview;
   if(old?.independentPedagogicalAcceptance===true||
      old?.sc1656_1686ConceptRepair||old?.titleMatchedQuizRepair)return;
   // Quiz cards are not wiring exercises: keep the entire project and its steps unchanged.
   const answer=(n-1656)%3;
   const options=answer===0?[correct,wrongA,wrongB]:
     answer===1?[wrongA,correct,wrongB]:[wrongA,wrongB,correct];
   l.summary=fact;
   l.explanation='Bu kez tek bir ayrımı öğrenelim: '+fact+
     ' Şimdi seçenekleri karşılaştır; doğru seçeneğin neden doğru, diğerlerinin neden uygun olmadığını anlamaya çalış. Bu bölüm bir kavram çalışmasıdır, fiziksel uygulama testi değildir.';
   l.quiz={question,options,answer,why:fact};
   const review=l.pedagogyReview||(l.pedagogyReview={});
   review.preRepairTitleTopologyIssue=review.titleTopologyIssue||null;
   review.titleTopologyStatus='REVIEW';
   review.titleTopologyIssue='CONCEPT_QUIZ_ONLY_MOTOR_HARDWARE_GRAPH_NOT_VERIFIED';
   review.sc1656_1686ConceptRepair='SC1656_1686_TOPIC_MATCHED_QUIZ_V1';
   review.actualCurriculumSequence=n;
   review.independentPedagogicalAcceptance=false;
   review.physicalAcceptance=false;
   review.windowsVisualAcceptance=false;
   review.nativeDynamicAcceptance=false;
   review.targetedConceptualPositiveNegative='TOPIC_MATCHED_POSITIVE_AND_TWO_FALSE_OPTIONS_NOT_NATIVE';
   l.practiceGuide={version:'practice-n1',heading:'Konuya özgü kısa kavram kontrolü',
    method:'concept-check',virtualOnly:true,canonicalGraphUnchanged:true,
    fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Konu: '+l.title,'Temel fikir: '+fact,
     'Soruyu yanıtla; doğru açıklamayı iki yanlış seçenekle karşılaştır.'],
    observations:['Bu kart kuramsal bilgiyi destekler, gerçek elektriksel bağlantı veya montaj talimatı vermez.',
     'Orijinal örnek kablolu proje fiziksel ya da başlığa özel doğrulanmış bir şema olarak sunulmaz.',
     'Bu kontroller Simulation.solve native testi değildir; donanım, Windows/3D ve bağımsız kabul REVIEW kalır.'],
    repairModel:'SC1656_1686_TOPIC_MATCHED_QUIZ_V1'};
  }
 })();


 // Targeted native motor control lessons; never alter protected or accepted scenes.
 (() => {
 const profiles=[
  {n:835,id:'motor-direct-power-outline-073',mode:'jog',
   model:'SC835-NATIVE-MOTOR-JOG-V1',
   summary:'Kesik çalışma: START basılıyken sanal motor çalışır; START bırakıldığında mühürleme olmadığından durur. STOP ayrıca kumandayı keser. Gerçek üç fazlı kurulum ve güvenlik kontrolü değildir.',
   explain:'Kısa süreli bir motor hareketini düşün. START düğmesine bastığında motor çalışır, elini çektiğinde durur. Bu derste motorun kendi kendine çalışmaya devam etmesini sağlayan yardımcı kontak yoktur; kesik çalışma ile sürekli çalışmayı karşılaştır.',
   question:'Kesik çalışmada START bırakılınca sanal motor ne yapar?',
   options:['Durur; mühürleme yoktur.','Sürekli çalışır.','Yön değiştirir.'],
   steps:['START basılıyken K1 ve M1 durumunu gözle.','START bırakılınca K1 ve M1 durmalı.','START ile STOP birlikteyken STOP önceliklidir.','Bir fazı veya bobin bağlantısını keserek karşılaştır.']},
  {n:836,id:'motor-direct-power-outline-074',mode:'seal',
   model:'SC836-NATIVE-MOTOR-SEAL-V1',
   summary:'Sürekli çalışma: START kısa basıldıktan sonra K1 yardımcı NO kontağı mühürler ve motor çalışmayı sürdürür; STOP basıldığında ya da bobin enerjisi kaybolduğunda durur. Fiziksel devre güvenlik kabulü değildir.',
   explain:'START düğmesine yalnızca bir an bas. K1 çekince yardımcı kontağı da kapanır ve butonu bırakınca devre çalışmayı sürdürür. STOP basıldığında bobin düşer, mühürleme açılır. Böylece kesik ve sürekli çalışmayı ayırt edebilirsin.',
   question:'Sürekli çalışma devresinde START bırakılınca motor neden çalışmaya devam eder?',
   options:['K1 yardımcı NO kontağı mühürlediği için.','Motorun PE bağlantısı hızı artırdığı için.','STOP kontağı kısa devre olduğu için.'],
   steps:['Önce START a bas, K1 ve M1 etkinleşsin.','START ı bırak; mühürleme motoru çalıştırmaya devam eder.','STOP a bas; motor durur.','Mühürleme kablosunu kopar; START bırakılınca çalışmanın kesildiğini gözle.']},
  {n:837,id:'motor-direct-power-outline-075',mode:'jog-seal',
   model:'SC837-NATIVE-MOTOR-JOG-SEAL-SELECTOR-V1',
   summary:'Kesik/sürekli çalışma seçimi: S2 kapalıyken START sadece basılı kaldığı sürece çalıştırır. S2 açıldığında K1 yardımcı NO kontağı mühürlemeyi devreye alır ve START bırakıldıktan sonra motor çalışır; STOP ikisini de durdurur. İki mod tek sanal örnekte karşılaştırılır.',
   explain:'Aynı motoru iki çalışma biçiminde düşün. Seçici kapalıyken kısa hareket için START a basılı tutman gerekir. Seçici açıldığında START sonrası yardımcı kontak devreyi tutar. STOP her iki durumda da bobini bırakır; bu bir emniyet sistemi değildir.',
   question:'S2 kesik moda getirildiğinde START bırakılırsa ne olur?',
   options:['Mühürleme yolu kesilir ve motor durur.','Motor kendi kendine hızlanır.','K1 enerjisizken kontak kapalı kalır.'],
   steps:['S2 kapalı: START basılıyken çalıştır, bırakınca durdur.','S2 açık: START a basıp bırak, mühürlemeyi gör.','S2 yi kapatıp K1 in düştüğünü kontrol et.','Her iki modda STOP ve kopuk bobin durumunu sınar.']},
  {n:838,id:'motor-direct-power-outline-076',mode:'two-station',
   model:'SC838-NATIVE-TWO-STATION-MOTOR-SEAL-V1',
   summary:'İki merkezden kontrol: S1 ve S2 START düğmeleri paralel; S0 ve S00 STOP düğmeleri seri çalışır. Herhangi bir START motoru mühürlemeyle başlatır, herhangi bir STOP durdurur. Bu örnek sanal kontak modelidir, sertifikalı durdurma değildir.',
   explain:'Bir motoru atölyenin iki noktasından başlatmak istediğini düşün. İki START yolu paraleldir; hangisine basarsan K1 çeker. İki STOP kontağı ise seridir: biri açıldığında kumanda kesilir. Mühürleme yardımcı NO kontağı START bırakılınca çalışmayı tutar.',
   question:'İki merkezli kumandada STOP düğmeleri nasıl davranmalıdır?',
   options:['İkisi de seri olmalı, herhangi biri motoru durdurmalı.','İkisi paralel olduğu için ikisine de basılmalı.','STOP yalnızca ikinci merkezde çalışmalı.'],
   steps:['Birinci START ile çalıştır, bırakınca mühürlemeyi gör.','Birinci STOP ile durdur.','İkinci START ile çalıştır, bırakınca mühürlemeyi gör.','İkinci STOP ile durdur; iki START birlikteyken bir STOP her zaman üstün olsun.','İkinci STOP veya START kablosunu kopararak sonucu karşılaştır.']}
 ];
 const canonicalTypes='supply-3p,push-nc,push-no,coil-contactor,main-contact,motor-3p,contact-no';
 const addWire=(p,id,a,ap,b,bp)=>p.wires.push({
  id,from:{c:a,p:ap},to:{c:b,p:bp},color:'#4c8a88',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
  tutorialWhy:'İki katalog terminali arasında sanal kumanda bağlantısı.'
 });
 const addPart=(id,typeId,ref,label,x,y)=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:''});
 for(const s of profiles){
  const l=L.byId[s.id],p=l?.project,v=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.map(c=>c.typeId).join(',')!==canonicalTypes||
     p.wires?.length!==13||p.tutorialLesson?.phase!=='quiz'||
     v?.independentPedagogicalAcceptance===true||
     v?.titleTopologyStatus==='PASS'||v?.titleTopologyStatus==='HOLD')continue;
  if(s.mode==='jog'){
   p.components=p.components.filter(c=>c.id!=='hold');
   p.wires=p.wires.filter(w=>w.from?.c!=='hold'&&w.to?.c!=='hold');
  }else if(s.mode==='jog-seal'){
   p.components.push(addPart('mode','selector-no','S2','Kesik / Sürekli seçimi',295,490));
   p.wires=p.wires.filter(w=>!(w.from?.c==='stop'&&w.from?.p==='22'&&w.to?.c==='hold'&&w.to?.p==='13'));
   addWire(p,'sc837-mode-in','stop','22','mode','13');
   addWire(p,'sc837-mode-out','mode','14','hold','13');
  }else if(s.mode==='two-station'){
   p.components.push(addPart('stop2','push-nc','S00','İkinci merkez STOP',100,495));
   p.components.push(addPart('start2','push-no','S2','İkinci merkez START',335,495));
   p.wires=p.wires.filter(w=>!(w.from?.c==='g1'&&w.from?.p==='L1'&&w.to?.c==='stop'&&w.to?.p==='21'));
   addWire(p,'sc838-stop-supply','g1','L1','stop2','21');
   addWire(p,'sc838-stop-series','stop2','22','stop','21');
   addWire(p,'sc838-start2-feed','stop','22','start2','13');
   addWire(p,'sc838-start2-return','start2','14','coil','A1');
  }
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint||'Katalog uçlarını bağla.',why:w.tutorialWhy||'Motor kumandasındaki terminali tanı.',
   color:w.color,role:w.role||'CONTROL',size:w.size||'1.5'}));
  l.materials=p.components.map(c=>({id:c.id,label:c.label||c.ref||c.typeId,why:
   c.id==='g1'?'Motor için sanal güç ve bobin kumanda kaynağı.':
   c.id==='motor'?'Üç faz bağlantısı varsa sanal motor çalışmasını gösterir.':
   c.id==='coil'?'K1 kontaktörünü çeker.':
   c.id==='main'?'K1 güç yolunu motor fazlarına bağlar.':
   c.id==='hold'?'Yalnız izin verilen modda START bırakılınca mühürleme yapar.':
   c.id==='stop'||c.id==='stop2'?'Basıldığında NC kumanda yolunu açar.':
   c.id==='mode'?'Kesik ve sürekli mühürleme yolunu seçer.':
   'START basılınca kumandaya izin verir.'}));
  l.summary=s.summary;l.explanation=s.explain;
  l.quiz={question:s.question,options:s.options,answer:0,why:s.explain};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:s.n+' · '+l.title,virtualOnly:true,canonicalGraphUnchanged:s.mode==='seal',
   fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:s.steps,
   observations:['703 kayıtlı gerçek eleman katalog pinleriyle özgün Simulation.solve testine dayanan sınırlı sanal kumanda örneği.',
    'Kontaktör bobini, üç faz motor ve yardımcı kontaklar fiziksel sahada sertifikalı bir güvenlik düzeni değildir.',
    'Üretici, termik aşırı yük koruması, Windows/3D ve bağımsız pedagojik kabul açık.'],
   repairModel:s.model};
  const review=v||(l.pedagogyReview={});
  review.preRepairTitleTopologyIssue=review.titleTopologyIssue||null;
  review.titleTopologyStatus='REVIEW';
  review.titleTopologyIssue='PHYSICAL_PROTECTION_WINDOWS_3D_INDEPENDENT_PEDAGOGY_PENDING';
  review.componentIds=p.components.map(c=>c.typeId);review.realWiredCircuit=true;
  review.nativeDynamicAcceptance=false;review.physicalAcceptance=false;
  review.windowsVisualAcceptance=false;review.independentPedagogicalAcceptance=false;
  review.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC835_838_TARGETED_PASS';
  review.actualCurriculumSequence=s.n;
  review.targetedMotorControlRepair=s.model;
 }
 })();


 // Targeted wiring-vs-quiz repairs: reuse canonical native-tested source graphs,
 // never modify the original donors or promote Windows/3D/physical acceptance.
 (() => {
  const clone=x=>JSON.parse(JSON.stringify(x));
  const specs=[
   {n:379,id:'motor-direct-power-outline-019',donor:836,slug:'relay-hold',
    heading:'K1 yardımcı kontağı ile mühürleme',
    summary:'START K1 bobinini çeker; aynı K1 in NO yardımcı kontağı paralel tutulduğu için buton bırakılınca sanal motor çalışır. STOP açılınca K1 bırakır. Bu, röle mühürleme prensibinin kontaktörlü sanal eğitim örneğidir, fiziksel koruma tasarımı değildir.',
    explanation:'START a bir kez basıp bırak. K1 bobini çekince yanındaki yardımcı NO kontak kapanır; düğmeyi bıraksan da enerjinin yolu sürer. STOP a basınca bu yol kesilir, hem bobin hem motor durur. Yeniden hareket için yeni START gerekir.',
    question:'K1 mühürleme kontağı sağlam ve START bırakılmışken motor niçin çalışır?',
    answers:['K1 in kendi NO yardımcı kontağı akım yolunu tamamlar.','STOP kontağı açık kalır.','Motor fazı otomatik artar.'],
    reason:'START sadece ilk çekmeyi sağlar; tutma yolu K1 yardımcı NO kontağıdır.',
    actions:['START ile motoru çalıştırıp düğmeyi bırak: K1 mühürlü kalır.','STOP a bas: K1 ve motor durur.','Mühürleme NO ya da bobin dönüş kablosunu koparıp karşılaştır.']},
   {n:380,id:'motor-direct-power-outline-020',donor:840,slug:'relay-direction',
    heading:'Elektriksel kilitli iki yön seçimi',
    summary:'Sanal K1 ileri ve K2 geri kontaktörleri iki fazın sırasını değiştirir. Karşılıklı NC yardımcı röle kontakları eşzamanlı çekmeyi engeller. S2 yön seçimi 0/1/2, START ve STOP ile sınanır. Bu gerçek mekanik kilit veya saha emniyet tasarımı değildir.',
    explanation:'Bir motorun yönünü değiştirmek için fazların ikisinin sırasını değiştirmek gerekir. Burada K1 birinci, K2 ters faz sırasını kuruyor. Aradaki NC yardımcı kontaklar iki kontaktörün birlikte çekmesini önler. STOP ile sıfırla, sonra diğer yönü başlat.',
    question:'Sanal ileri/geri devrede K1 çalışırken K2 niçin çekmez?',
    answers:['K1 in NC yardımcı kontağı K2 yolunu keser.','K2 nin hızı sıfırlanır.','PE farklı bir faz sağlar.'],
    reason:'Elektriksel kilitleme iki karşıt güç yolunun aynı anda kapanmasını engeller.',
    actions:['S2=1 seçip START ver, ileri K1 i izle.','STOP ile bırak; S2=2 seçip START ver, ters K2 yi izle.','Karşı kilidi veya faz yolunu koparıp sonucu karşılaştır.']},
   {n:727,id:'motor-direct-power-outline-040',donor:848,slug:'relay-assisted-reversal',
    heading:'KA1/KA2 röleleri ile yön değiştirme',
    summary:'Sanal KA1 ve KA2 yardımcı yön röleleri ayrı K1/K2 motor kontaktörlerini etkinleştirir. Karşılıklı NC kilit ve farklı faz sıraları doğrulanabilir. Elektriksel röle örneğidir; mekanik interlock, termik koruma ve fiziksel güvenlik ayrı REVIEW.',
    explanation:'Bu sefer seçimi önce KA1 ya da KA2 rölesi alıyor. Röle kendi yardımcı kontağıyla seçimi tutuyor; sonra ilgili motor kontaktörüne izin veriyor. Tek yönden diğerine geçerken STOP ile devreyi bıraktırıp yeniden başlat.',
    question:'KA2 geri yön rölesi çektiğinde hangi güç kontaktörü seçilir?',
    answers:['K2 geri kontaktörü','K1 ileri kontaktörü','İkisi aynı anda'],
    reason:'KA2 geri yön kolu, karşılıklı kilit açıkken K2 yi etkinleştirir.',
    actions:['S2=1 iken START ile KA1/K1 ve ileri hareketi gözle.','STOP, ardından S2=2 ve START ile KA2/K2 geri yönü gözle.','Röle ve motor kontaktörü izin yolu kopunca motorun durduğunu doğrula.']},
   {n:964,id:'motor-direct-power-outline-106',donor:838,slug:'two-station-buttons',
    heading:'İki istasyondan START / STOP',
    summary:'Buton uygulamaları için iki farklı START, seri bağlı iki STOP ve K1 mühürleme yolu bulunan sanal motor kumandası. Her START motoru başlatabilir; herhangi bir STOP durdurur. Bu bütün buton çeşitlerinin veya gerçek saha güvenliğinin modeli değildir.',
    explanation:'İki farklı noktaya START koyduğunu düşün. Hangi taraftan basarsan bas K1 çekiyor ve mühürleme sayesinde çalışmaya devam ediyor. Ancak iki ayrı STOP seri: birine basılınca tutma yolu da kesiliyor.',
    question:'Motor mühürlü çalışırken ikinci istasyondaki STOP a basılırsa ne olur?',
    answers:['K1 bırakır ve motor durur.','Motor yeniden başlar.','Yalnız ilk istasyon etkilenir.'],
    reason:'STOP butonları seri olduğundan herhangi biri devreyi keser.',
    actions:['İlk START tan başlatıp bırak; motor mühürlü çalışsın.','STOP ile durdur; ikinci START tan yeniden çalıştır.','İkinci STOP veya buton kablosunu ayırıp davranışı karşılaştır.']},
   {n:965,id:'motor-direct-power-outline-107',donor:837,slug:'jog-vs-continuous',
    heading:'Kesik çalıştırma ve mühürlemeli çalışma',
    summary:'Buton uygulaması için kesik (jog) ve sürekli çalışma seçicisi ile K1 motor kumandası kuruldu. S2 mühürleme izni kapalıysa START bırakıldığında motor durur; açıkken kendi yardımcı kontağı üzerinden tutar. Bu sınırlı sanal buton örneğidir.',
    explanation:'Kesik çalışmada START a bastığın sürece motor çalışır, bıraktığında durur. Sürekli çalışmayı seçince aynı START kısa süre basılsa da K1 yardımcı kontağı devreyi tutar. STOP her ikisinde de motoru durdurur.',
    question:'Kesik (jog) konumunda START bırakıldığında ne olması beklenir?',
    answers:['Motor durur.','Motor mührünü otomatik korur.','Ters yönde döner.'],
    reason:'Kesik çalışmada yardımcı mühürleme kolu seçilmediği için bobin bırakır.',
    actions:['S2 kapalıyken START a basıp bırak; kesik çalışmayı izle.','S2 mühürleme izni açıkken START ver ve bırak.','STOP ve yardımcı kontak kopmasıyla sonucun değişimini gözle.']},
   {n:968,id:'motor-start-speed-outline-034',donor:836,slug:'direct-on-line',
    heading:'Kontaktör ile doğrudan yol verme',
    summary:'Yanlış yıldız-üçgen paket şalter şablonu yerine doğrudan yol vermeye uygun K1 kontaktör, K1 mühürleme, üç faz motor ve STOP/START sanal güç-kumanda yolu kullanılır. Gerçek ilk kalkış akımı, termik aşırı yük ve fiziksel koruma kanıtı yoktur.',
    explanation:'Bu derste yıldız-üçgen geçişi yok. START a bastığında K1 kontaktörü çekip üç fazı motor uçlarına veriyor. Yardımcı mühürleme kontağı kısa START basışından sonra çalışmayı tutuyor; STOP ise motoru bırakıyor.',
    question:'Bu sanal devrede motora doğrudan yol veren eleman hangisidir?',
    answers:['K1 ana güç kontakları','Yıldız-üçgen paket şalter','Sadece PE bağlantısı'],
    reason:'K1 ana kontakları kapandığında üç faz doğrudan motor yoluna bağlanır.',
    actions:['START ile K1 kontaktörünü çek, butonu bırakınca mühürlemeyi izle.','STOP ile motorun ayrıldığını doğrula.','Güç fazını veya tutma kolunu ayırarak farkı gör.']}
  ];
  for(const s of specs){
   const l=L.byId[s.id],source=L.lessons[s.donor-1],
    p=l?.project,r=l?.pedagogyReview,d=source?.project;
   if(!l||l.kind!=='wiring'||p?.tutorialLesson?.phase!=='quiz'||
      p?.components?.length!==(s.n===968?3:7)||
      p?.wires?.length!==(s.n===968?10:13)||
      !p.components.some(c=>c.typeId===(s.n===968?'packet-star-delta':'main-contact'))||
      source?.kind!=='wiring'||source?.pedagogyReview?.titleTopologyStatus!=='REVIEW'||
      !source?.pedagogyReview?.targetedNativePositiveNegative?.includes('PASS')||
      r?.independentPedagogicalAcceptance===true)continue;
   p.components=clone(d.components);
   p.wires=d.wires.map((w,i)=>({...clone(w),id:'sc'+s.n+'-native-'+(i+1)}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=p.components.map(c=>({id:c.id,label:c.label,
    why:c.typeId==='push-nc'?'Basıldığında kumanda devresini durdurur.':
     c.typeId==='contact-nc'?'Karşıt röle veya kontaktörün çekmesini engeller.':
     c.typeId==='contact-no'?'Çekmiş rölenin mühürleme ya da izin kolunu gösterir.':
     c.typeId==='main-contact'?'K1/K2 güç yolundaki gerçek katalog kontakları.':
     c.typeId==='motor-3p'?'Sanal üç faz motor ve faz sırası.':
     'Devredeki gerçek katalog bağlantısını temsil eder.'}));
   l.summary=s.summary;l.explanation=s.explanation;
   l.quiz={question:s.question,options:s.answers,answer:0,why:s.reason};
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:s.heading,
    virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
    physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:s.actions,
    observations:['Kaynak grafiği katalogdaki gerçek terminal kimlikleriyle ve özgün Simulation.solve üzerinden hedefli pozitif-negatif testlerden geçirildi.',
     'Mekanik interlock, üretici uygulaması, güç kesme güvenliği, termik koruma, Windows/3D ve bağımsız pedagojik kabul açık kalır.'],
    repairModel:'SC'+s.n.toString()+'-TARGETED-CATALOG-MOTOR-'+s.slug.toUpperCase()+'-V1'};
   const v=r||(l.pedagogyReview={});
   v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';v.titleTopologyIssue='HARDWARE_PROTECTION_WINDOWS_3D_INDEPENDENT_PEDAGOGY_PENDING';
   v.componentIds=p.components.map(c=>c.typeId);v.realWiredCircuit=true;
   v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
   v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC'+s.n+'_TARGETED_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v['sc'+s.n+'WiringRepair']=l.practiceGuide.repairModel;
  }
 })();

 // SC966: replace false motor circuit with 2-input digital AND/OR/NOT PLC exercise.
 (() => {
  const l=L.byId['motor-direct-power-outline-108'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
     p?.tutorialLesson?.phase!=='quiz'||!p.components.some(c=>c.typeId==='main-contact')||
     r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,extra={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra});
  const parts=[
   C('g','supply-dc-plus','G1','24 V / 0 V sanal kaynak',70,300),
   C('cpu','plc-0-0-documented','PLC1','A/B temel mantık kapıları',750,300,{plcProgram:'boolean-logic-3out-sc966'}),
   C('a','selector-no','S1','A biti · 0/1',300,100),
   C('b','selector-no','S2','B biti · 0/1',300,470),
   C('and','lamp-green','H1','A VE B (AND)',1250,100),
   C('or','lamp-red','H2','A VEYA B (OR)',1250,315),
   C('not','lamp-green','H3','DEĞİL A (NOT)',1250,530)
  ];
  const graph=[
   ['g','P','cpu','X10:1'],['g','M','cpu','X10:2'],['g','M','cpu','X10:6'],
   ['g','P','cpu','X12:1'],['g','M','cpu','X12:2'],
   ['g','P','a','13'],['a','14','cpu','X10:7'],
   ['g','P','b','13'],['b','14','cpu','X10:8'],
   ['cpu','X12:3','and','X1'],['and','X2','g','M'],
   ['cpu','X12:4','or','X1'],['or','X2','g','M'],
   ['cpu','X12:5','not','X1'],['not','X2','g','M']
  ];
  p.components=parts;
  p.wires=graph.map(([from,fp,to,tp],i)=>({
   id:'sc966-logic-'+(i+1),from:{c:from,p:fp},to:{c:to,p:tp},
   color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:from+'/'+fp+' → '+to+'/'+tp,
   tutorialWhy:'PLC 1211C katalog besleme, giriş veya çıkış terminalini tanı.'}));
  delete p.referenceOnly;
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:
   c.id==='cpu'?'İki girişin VE, VEYA ve DEĞİL A değerlerini ayrı dijital çıkışta gösterir.':
   c.id==='a'||c.id==='b'?'Sanal mantık girişini 0 ya da 1 yapar.':
   c.id==='g'?'PLC CPU ve çıkış bankını besler.':'Bir mantık işleminin sonucunu lamba ile gösterir.'}));
  l.summary='İki sanal 0/1 girişini kullanarak AND, OR ve NOT A doğruluk tablosunu üç dijital çıkış ve lambada gözle. PLC 1211C terminali kullanılır; gerçek emniyet PLC si veya üç faz motor devresi değildir.';
  l.explanation='İki anahtarı küçük birer doğru-yanlış ifadesi gibi düşün. VE lambası yalnız ikisi de açıkken yanar. VEYA lambası birinin açık olmasıyla yanar. DEĞİL A lambası ise A kapalıyken yanar. Anahtarları dört olasılıkta deneyerek neyin neden yandığını gör.';
  l.quiz={question:'A=0 ve B=1 iken hangi iki gösterge yanar?',
   options:['VEYA ve DEĞİL A','VE ve VEYA','Yalnız VE'],answer:0,
   why:'0 VEYA 1 = 1, DEĞİL 0 = 1, 0 VE 1 = 0.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'İki bitin VE, VEYA ve DEĞİL sonucunu oku',
   virtualOnly:true,canonicalGraphUnchanged:false,fullyRich:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['A ve B kapalıyken yalnız DEĞİL A yanar.',
    'Yalnız A açıkken VEYA yanar, DEĞİL A söner.',
    'Yalnız B açıkken VEYA ve DEĞİL A yanar.',
    'A ve B açıkken VE ve VEYA yanar.',
    'A/B, bir lamba veya çıkış beslemesini koparıp sonucunu karşılaştır.'],
   observations:['Üç çıkışın tüm 0/1 giriş kombinasyonları ve açık devreler özgün Simulation.solve/703 katalogla test edildi.',
    'Kopuk giriş 0 gibi okunabilir; bu model emniyet kilidi, fiziksel PLC veya Windows/3D kabulü değildir.'],
   repairModel:'SC966-TWO-BIT-LOGIC-AND-OR-NOT-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';v.titleTopologyIssue='FULL_PLC_PROGRAM_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;
  v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC966_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc966BooleanWiringRepair='SC966-TWO-BIT-LOGIC-AND-OR-NOT-V1';
 })();


 // Targeted native source repairs for SC833, SC834, SC969, SC970.
 // Preserve headers, installation/solar locks and all prior accepted lessons.
 (() => {
 const C=(id,typeId,ref,label,x,y,extra={})=>({
   id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra
 });
 const wireGraph=(sc,graph)=>graph.map(([a,ap,b,bp],i)=>({
  id:'sc'+sc+'-native-'+(i+1),
  from:{c:a,p:ap},to:{c:b,p:bp},
  color:'#43857f',role:'CONTROL',size:'1.5',points:[],
  tutorialHint:a+'/'+ap+' → '+b+'/'+bp,
  tutorialWhy:'Sanal kumanda veya güç yolunda gerçek katalog terminali'
 }));
 const materialFor=c=>({
  id:c.id,label:c.label,why:
   c.typeId==='supply-3p'?'Sanal üç faz ve kumanda devresinin kaynağı':
   c.typeId==='motor-3p'?'Üç fazın bağlantı ve dönüş yönü gözlenir':
   c.typeId==='coil-contactor'?'Aynı referanslı güç ve yardımcı kontakları çalıştırır':
   c.typeId==='main-contact'?'İlgili bobin enerjilenince motorun güç yolunu kapatır':
   c.typeId==='contact-nc'?'Karşı yöndeki kontaktör çalışırken bu yolu keser':
   c.typeId==='contact-no'?'START bırakılınca aynı kontaktörün mühürlemesini sürdürür':
   c.typeId==='push-nc'?'Basıldığında kumanda yolunu keser':
   c.typeId==='push-no'?'Basıldığında çalıştırma isteği gönderir':
   'Katalogda tanımlı sanal devre bileşeni'
 });
 function put(sc,id,parts,graph,summary,explanation,quiz,heading,steps,obs,model,issue,replace=true){
  const l=L.lessons[sc-1],p=l?.project,v=l?.pedagogyReview;
  if(l?.id!==id||l.kind!=='wiring'||p?.components?.length!==7||p?.wires?.length!==13||
    !p.components.some(c=>c.typeId==='motor-3p')||
    !p.components.some(c=>c.typeId==='main-contact')||
    v?.independentPedagogicalAcceptance===true||v?.scTitleWiringRepair===model)return;
  if(replace){p.components=parts;p.wires=wireGraph(sc,graph);delete p.referenceOnly;}
  p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint||'Katalog terminalini izle',
   why:w.tutorialWhy||'Sanal kumanda ve güç yolu',color:w.color||'#43857f',
   role:w.role||'CONTROL',size:w.size||'1.5'}));
  l.materials=p.components.map(materialFor);
  l.summary=summary;l.explanation=explanation;l.quiz=quiz;
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading,virtualOnly:true,canonicalGraphUnchanged:!replace,fullyRich:false,
   physicalTestAccepted:false,pedagogicalAcceptance:false,steps,
   observations:obs,repairModel:model};
  const review=v||(l.pedagogyReview={});
  review.preRepairTitleTopologyIssue=review.titleTopologyIssue||null;
  review.titleTopologyStatus='REVIEW';review.titleTopologyIssue=issue;
  review.componentIds=p.components.map(c=>c.typeId);
  review.realWiredCircuit=true;
  review.nativeDynamicAcceptance=false;review.physicalAcceptance=false;
  review.windowsVisualAcceptance=false;review.independentPedagogicalAcceptance=false;
  review.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC'+sc+'_TARGETED_PASS';
  review.actualCurriculumSequence=sc;review.scTitleWiringRepair=model;
 }
 const supply=()=>C('g','supply-3p','G1','Sanal üç faz ve kumanda kaynağı',85,390);
 const motor=()=>C('motor','motor-3p','M1','Sanal üç faz motoru',1250,800,{motorConnection:'star'});
 const p833=L.lessons[832]?.project;
 put(833,'motor-direct-power-outline-071',p833?.components,p833?.wires,
  'Sanal sürekli çalışma devresi: START K1 kontaktörünü enerjiler, K1 yardımcı NO kontağı bırakılan START yerine mühürleme sağlar, STOP motoru durdurur. Başlıkta geçen farklı çizim normları ve fiziksel güvenlik ayrıca incelenmelidir.',
  'START a bir kez basınca K1 devreye giriyor. Parmağını çeksen de kendi yardımcı kontağı motorun çalışmasına izin veriyor. STOP ise bu yolu kesiyor. Katalogdaki kontak adlarını öğren; farklı çizim normlarını bu tek şemayla doğrulamış sayma.',
  {question:'Sanal sürekli çalışma devresinde START bırakılınca K1 neden açık kalmaz?',
   options:['K1 yardımcı NO kontağı bobine yeni yol oluşturur','Motorun PE bağlantısı bobini besler','STOP düğmesi otomatik sürekli kapanır'],
   answer:0,why:'K1 mühürleme kontağı START düğmesine paraleldir.'},
  'START, mühürleme ve STOP davranışını gör',
  ['START a basıp motorun sanal olarak çalıştığını gör','START ı bırak: yardımcı kontak motoru açık tutar',
   'STOP a bas: K1 ve motor durmalı','Bobin veya motor faz kablosunu koparıp sonucu karşılaştır'],
  ['Özgün 703 katalog ve Simulation.solve ile START, mühürleme, STOP ve kopuk bağlantı doğrulanır.',
   'Farklı IEC/DIN/ANSI şema varyantları, donanım, Windows/3D ve bağımsız kabul bekler.'],
  'SC833-NATIVE-START-HOLD-STOP-PEDAGOGY-V1',
  'VARIOUS_DRAWING_STANDARDS_PHYSICAL_WINDOWS_3D_PEDAGOGY_PENDING',false);
 const stationParts=()=>[
  supply(),
  C('stop1','push-nc','S0','1. noktadan STOP',305,90),
  C('stop2','push-nc','S2','2. noktadan STOP',470,115),
  C('start1','push-no','S1','1. noktadan START',650,85),
  C('start2','push-no','S3','2. noktadan START',650,265),
  C('hold','contact-no','K1','K1 mühürleme NO',650,445),
  C('coil','coil-contactor','K1','K1 kumanda bobini',930,225),
  C('main','main-contact','K1','K1 güç kontakları',1040,800),
  motor()
 ];
 const stationGraph=[
  ['g','L1','stop1','21'],['stop1','22','stop2','21'],
  ['stop2','22','start1','13'],['stop2','22','start2','13'],
  ['stop2','22','hold','13'],['start1','14','coil','A1'],
  ['start2','14','coil','A1'],['hold','14','coil','A1'],
  ['coil','A2','g','N'],
  ['g','L1','main','1'],['main','2','motor','U'],
  ['g','L2','main','3'],['main','4','motor','V'],
  ['g','L3','main','5'],['main','6','motor','W'],
  ['g','PE','motor','PE']
 ];
 put(834,'motor-direct-power-outline-072',stationParts(),stationGraph,
  'İki START NO ve iki STOP NC butonuyla aynı K1 kontaktörünün sanal kumandası: START butonları paralel, STOP butonları seri, K1 mühürleme kontağı START lara paralel. Bu iki istasyonlu örnek bütün buton çeşitlerini kapsamaz.',
  'İki ayrı yerden aynı motoru çalıştırmak istediğini düşün. Hangi START a bassan da K1 devreye girer. Bırakınca yardımcı kontak çalışmayı sürdürür. Her iki STOP tan biri bu yolu kesip motoru durdurur.',
  {question:'İki merkezli sanal devrede STOP butonları neden seri bağlanır?',
   options:['Hangisine basılırsa basılsın motoru durdurmak için','Motor hızını artırmak için','Kumanda bobininin gerilimini iki katına çıkarmak için'],
   answer:0,why:'Seri NC zincirindeki herhangi bir açık kontak tüm bobin yolunu keser.'},
  'İki START, iki STOP ve mühürleme',
  ['Birinci START ile motoru çalıştır, düğmeyi bırak','STOP1 ile durdur',
   'İkinci START ile çalıştır, düğmeyi bırak','STOP2 ile durdur',
   'START veya güç fazını kopar ve gözlemle'],
  ['İki seri NC, iki paralel NO ve gerçek K1 kontakları özgün simülatörle test edilir.',
   'STOP bırakılırken START basılı tutulursa tekrar çalışma ihtimali vardır; fiziksel emniyet kabulü değildir.'],
  'SC834-NATIVE-TWO-STATION-BUTTONS-V1',
  'OTHER_BUTTON_TYPES_PHYSICAL_WINDOWS_3D_PEDAGOGY_PENDING');
 put(969,'motor-direct-power-outline-109',stationParts(),stationGraph,
  'Üç fazlı asenkron motoru iki istasyondan sanal kontrol: iki START paralel, iki STOP seri, K1 yardımcı NO mühürleme, üç faz K1 güç kontağı üzerinden motora bağlanır.',
  'Makinenin iki yanında birer kontrol noktası düşün. İki START tan biri motoru başlatır. Hangisini bırakırsan bırak mühürleme devreyi tutar; iki STOP düğmesinden herhangi biri motoru durdurur.',
  {question:'İkinci istasyondaki STOP basılırsa mühürlenmiş K1 için ne olur?',
   options:['Bobin enerjisi kesilir ve motor durur','Motor devir yönü değişir','İlk START devre dışı kalmaz'],
   answer:0,why:'İki STOP kontağı aynı seri kumanda yolundadır.'},
  'İki noktadan tek motor kumandası',
  ['İlk START ile K1 i çalıştır; bırakınca mühürlemeyi incele',
   'İkinci STOP ile motoru durdur','İkinci START ile çalıştır; ilk STOP ile durdur',
   'Kumanda bobini, yardımcı kontak ve üç fazdan birini ayrı ayrı kopar'],
  ['Özgün Simulation.solve ve 703 katalog üzerinden her iki istasyon sınanır.',
   'STOP bırakılırken START basılı tutulursa kendiliğinden çalışma riski; üretici güvenlik donanımı ve Windows/3D bekliyor.'],
  'SC969-NATIVE-MULTISTATION-MOTOR-V1',
  'ACTUAL_MULTISTATION_MACHINE_SAFETY_WINDOWS_3D_PEDAGOGY_PENDING');
 const reverseParts=[
  supply(),C('stop','push-nc','S0','Ortak STOP',285,90),
  C('forward','push-no','S1','İleri START',475,90),
  C('reverse','push-no','S2','Geri START',470,330),
  C('holdF','contact-no','K1','İleri mühürleme NO',665,90),
  C('holdR','contact-no','K2','Geri mühürleme NO',670,330),
  C('lockR','contact-nc','K2','Geri çalışırken ileri engeli NC',845,170),
  C('lockF','contact-nc','K1','İleri çalışırken geri engeli NC',845,405),
  C('coilF','coil-contactor','K1','İleri kontaktörü K1',1080,175),
  C('coilR','coil-contactor','K2','Geri kontaktörü K2',1080,410),
  C('mainF','main-contact','K1','İleri üç faz kontaktörü',910,725),
  C('mainR','main-contact','K2','Geri fazları çaprazlar',910,1045),
  motor()
 ];
 const reverseGraph=[
  ['g','L1','stop','21'],
  ['stop','22','forward','13'],['stop','22','holdF','13'],
  ['stop','22','reverse','13'],['stop','22','holdR','13'],
  ['forward','14','lockR','21'],['holdF','14','lockR','21'],
  ['lockR','22','coilF','A1'],['coilF','A2','g','N'],
  ['reverse','14','lockF','21'],['holdR','14','lockF','21'],
  ['lockF','22','coilR','A1'],['coilR','A2','g','N'],
  ['g','L1','mainF','1'],['mainF','2','motor','U'],
  ['g','L2','mainF','3'],['mainF','4','motor','V'],
  ['g','L3','mainF','5'],['mainF','6','motor','W'],
  ['g','L3','mainR','1'],['mainR','2','motor','U'],
  ['g','L2','mainR','3'],['mainR','4','motor','V'],
  ['g','L1','mainR','5'],['mainR','6','motor','W'],
  ['g','PE','motor','PE']
 ];
 put(970,'motor-direct-power-outline-110',reverseParts,reverseGraph,
  'Sanal motor yön değiştirme: K1 ileri, K2 iki fazı çaprazlayarak geri besler. K2 NC kontağı ileri bobini, K1 NC kontağı geri bobini kilitler. STOP mühürlemeyi keser. Fiziksel mekanik kilit, aşırı akım koruması ve emniyet doğrulanmadı.',
  'Önce ileri START a bas: K1 kapanır, motor ileri döner. Geri START a bassan bile K1 in NC kilidi K2 nin çalışmasını engeller. STOP ile durdur; ardından geri START yeni bir yön seçer. Geri devrede iki fazın yerini değiştirmek sanal dönüş yönünü tersine çevirir.',
  {question:'K1 ileri kontaktörü çalışırken geri START a basılırsa hangi devre engeller?',
   options:['K1 referanslı NC elektriksel kilit kontağı','Motorun PE bağlantısı','Şebeke N iletkeninin yönü'],
   answer:0,why:'K1 enerjiliyken K1 NC kontağı K2 bobin yolunu açar.'},
  'İleri-geri kontaktörleri elektriksel olarak kilitle',
  ['İleri START ile K1 in ve ileri motor yönünün etkinliğini gör',
   'İleri mühürleme sürerken geri START a bas, K2 nin kilitli kaldığını gör',
   'STOP a bas; yön değiştirmek için önceki yönün durmasını bekle',
   'Geri START ile K2 nin ve geri dönüş yönünün etkinliğini izle',
   'Bobin, NC kilit veya güç fazı bağlantısını kopar; sanal güvenlik sınırını gözlemle'],
  ['K1/K2 çapraz NC elektriksel kilitleme ve iki faz yer değiştirmesi özgün simülatörle hedefli sınanır.',
   'Bu sanal elektriksel kilit mekanik kilit, termik ve kısa devre koruması veya sertifikalı fiziksel güvenlik değildir.',
   'STOP bırakılırken START basılı tutulursa otomatik yeniden çalışma görülebilir; Windows/3D ve bağımsız kabul bekler.'],
  'SC970-NATIVE-CROSS-INTERLOCKED-REVERSE-V1',
  'MECHANICAL_INTERLOCK_PROTECTION_WINDOWS_3D_PEDAGOGY_PENDING');
 })();


 // Four real 703-catalog electronics repairs; all restricted to source generic templates.
 (() => {
  const specs=[
   {n:445,id:'sensor-analog-apps-outline-031',type:'sensor-ntc',ref:'NTC1',
    title:'NTC ile sıcaklık değişince akım nasıl değişir?',
    summary:'Sanal 24 V DC ile 1 kΩ sabit direnç ve gerçek katalog NTC termistörü seri bağlandı. NTC ısındıkça direnci düşer ve akım yükselir; örnek sayım 0 °C civarında 0,70 mA, 25 °C de 2,18 mA, 50 °C de 5,23 mA. Tam sıcaklık anahtarı veya emniyet kontrolü değildir.',
    explanation:'Bir sıcaklık sensörü düşün: hava ısınınca NTC akıma daha az direnç gösterir. Ampermetreyi seri akım yolunda, voltmetreyi sensör uçlarında izle. Sıcaklığı 0, 25 ve 50 derece yapınca akımın adım adım arttığını gör.',
    quiz:'Sanal NTC 25 °C den 50 °C ye ısınınca seri akım ne yapar?',answers:['Artar','Azalır','Sıfıra iner'],correct:0,why:'NTC nin direnci sıcaklık arttıkça azalır.'},
   {n:446,id:'sensor-analog-apps-outline-032',type:'sensor-ptc',ref:'PTC1',
    title:'PTC ile ısındığında daha az akım geçen devre',
    summary:'Sanal 24 V DC, 1 kΩ direnç ve katalog PTC termistörü seri bağlıdır. PTC ısındıkça direnci yükselir ve akım azalır; örnek 0 °C de 15,63 mA, 25 °C de 12,00 mA, 50 °C de 8,37 mA. Fiziksel aşırı sıcaklık rölesi ya da motor koruması değildir.',
    explanation:'PTC, NTC nin tersine davranır. Isınınca akımı azaltan bir yol oluşturur. Ampermetrede sıcaklığı yükselttikçe akımın düştüğünü, voltmetrede PTC üzerindeki gerilimin büyüdüğünü karşılaştır.',
    quiz:'PTC sıcaklığı artarsa sabit DC ve seri dirençte akım ne olur?',answers:['Azalır','Artar','Hep aynı kalır'],correct:0,why:'Isınan PTC nin direnci artar, dolayısıyla seri akım azalır.'},
   {n:448,id:'sensor-analog-apps-outline-034',type:'sensor-pt100-2wire',ref:'PT100',
    title:'PT100 ile sıcaklık ve direnç ölçümü',
    summary:'Sanal 24 V DC, 1 kΩ sabit direnç ve katalogdaki iki uçlu PT100 modeli seri bağlıdır. PT100 0 °C de yaklaşık 100 Ω, 50 °C de yaklaşık 119,4 Ω olur. Voltmetre PT100 gerilim düşümünü, ampermetre seri akımı gösterir; gerçek 3/4 telli RTD ölçüm cihazı değildir.',
    explanation:'PT100 adını sıfır derecede yaklaşık 100 ohm olmasından alır. Sensörü biraz ısıttığında direnç yükselir. Akım çok az düşer, PT100 üzerindeki gerilim biraz artar. İki ölçümü birlikte okuyarak farkı tanı.',
    quiz:'PT100 modeli 0 °C den 50 °C ye ısınınca direnç ne yapar?',answers:['Artar','Azalır','Tam sıfır olur'],correct:0,why:'PT100 pozitif sıcaklık katsayılı platin direnç sensörüdür.'}
  ];
  for(const s of specs){
   const l=L.byId[s.id],p=l?.project,r=l?.pedagogyReview;
   if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==4||
     !p.components.some(c=>c.typeId==='proximity')||r?.independentPedagogicalAcceptance===true)continue;
   const C=(id,typeId,ref,label,x,y,ex={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
   const pin0=s.type==='sensor-pt100-2wire'?'A':'1',pin1=s.type==='sensor-pt100-2wire'?'B1':'2';
   const parts=[
    C('g','supply-dc-plus','G1','Sanal 24 V DC',85,340),
    C('am','meter-ammeter','A1','Seri akım',315,195),
    C('sensor',s.type,s.ref,'Sıcaklığa bağlı direnç',660,195,{temperature:25}),
    C('r1','resistor','R1','Sabit 1 kΩ',1020,195,{resistance:1000}),
    C('vm','meter-voltmeter','V1','Sensör gerilimi',730,500)
   ];
   const lines=[
    ['g','P','am','1'],['am','2','sensor',pin0],
    ['sensor',pin1,'r1','1'],['r1','2','g','M'],
    ['vm','1','sensor',pin0],['vm','2','sensor',pin1]
   ];
   p.components=parts;
   p.wires=lines.map(([from,fp,to,tp],i)=>({id:'sc'+s.n+'-thermal-'+(i+1),
    from:{c:from,p:fp},to:{c:to,p:tp},color:'#43857f',
    role:'CONTROL',size:'1.5',points:[],
    tutorialHint:from+'/'+fp+' → '+to+'/'+tp,
    tutorialWhy:'Akım ölçer seri, gerilim ölçer yalnız sıcaklık sensörüne paraleldir.'}));
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
   l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
    hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   l.materials=parts.map(c=>({id:c.id,label:c.label,why:
    c.id==='g'?'Sanal DC kaynaktır.':c.id==='sensor'?'Değeri sıcaklığa göre değişir.':
    c.id==='r1'?'Akımı sınırlayan seri dirençtir.':
    c.id==='am'?'Gerçek akım yolunu ölçer.':'Sensör uçlarındaki gerilim düşümünü ölçer.'}));
   l.summary=s.summary;l.explanation=s.explanation;
   l.quiz={question:s.quiz,options:s.answers,answer:s.correct,why:s.why};
   l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',heading:s.title,virtualOnly:true,
    canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
    steps:['Sanal sensörü seri 1 kΩ direnç ve ampermetreyle devreye bağla.',
     'Voltmetreyi sensörün iki ucuna paralel bağla.',
     'Sensör sıcaklığını sırayla 0, 25 ve 50 °C yap; akım ve gerilim değişimini izle.',
     'Seri akım yolu kablosunu ayırınca akımın kesildiğini kontrol et.',
     'Voltmetrenin bir probunu çıkar; kopuk probu güvenilir sıfır volt ölçümü sanma.'],
    observations:['Gerçek 703 katalog termal direnç modeli özgün Simulation.solve üzerinde hedefli ölçüldü.',
     'Sanal ölçüm, üretici toleransı, termal ataleti, saha montajı ve Windows/3D kabulü kapsamaz.'],
    repairModel:'SC'+s.n+'-NATIVE-THERMAL-RESISTOR-MEASUREMENT-V1'};
   const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
   v.titleTopologyStatus='REVIEW';
   v.titleTopologyIssue='ACTUAL_THERMAL_THRESHOLD_CONTROLLER_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
   v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;v.nativeDynamicAcceptance=false;
   v.physicalAcceptance=false;v.windowsVisualAcceptance=false;v.independentPedagogicalAcceptance=false;
   v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC'+s.n+'_TARGETED_PASS';
   v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
   v['sc'+s.n+'ThermalRepair']='SC'+s.n+'-NATIVE-THERMAL-RESISTOR-MEASUREMENT-V1';
  }
 })();

 // SC454 real Hall PNP with magnetic target and disconnected sensor/output negatives.
 (() => {
  const l=L.byId['sensor-analog-apps-outline-039'],p=l?.project,r=l?.pedagogyReview;
  if(l?.kind!=='wiring'||p?.components?.length!==3||p?.wires?.length!==4||
    !p.components.some(c=>c.typeId==='proximity')||r?.independentPedagogicalAcceptance===true)return;
  const C=(id,typeId,ref,label,x,y,ex={})=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...ex});
  const parts=[
   C('g','supply-dc-plus','G1','Sanal +24 V / 0 V',75,325),
   C('hall','sensor-hall','B1','Manyetik PNP Hall sensörü',500,310,
    {sensing:{target:'magnet',distance:40,range:10,offset:0}}),
   C('lamp','lamp-green','H1','Mıknatıs yakınken yanan lamba',1050,325)
  ];
  const lines=[
   ['g','P','hall','BN'],['hall','BU','g','M'],
   ['hall','BK','lamp','X1'],['lamp','X2','g','M']
  ];
  p.components=parts;
  p.wires=lines.map(([from,fp,to,tp],i)=>({id:'sc454-hall-'+(i+1),from:{c:from,p:fp},
   to:{c:to,p:tp},color:'#43857f',role:'CONTROL',size:'1.5',points:[],
   tutorialHint:from+'/'+fp+' → '+to+'/'+tp,
   tutorialWhy:'Hall sensörünün BN besleme, BU 0 V ve BK PNP sinyal ucu.'}));
  delete p.referenceOnly;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo',step:0};
  l.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.materials=parts.map(c=>({id:c.id,label:c.label,why:c.id==='g'?'24 V sanal besleme.':
   c.id==='hall'?'Yakındaki mıknatısı PNP BK sinyali ile algılar.':
   'Çıkış aktif olduğunda sanal sinyali gösterir.'}));
  l.summary='Katalogdaki Hall etkili PNP sensör, sanal 24 V besleme ve yeşil sinyal lambasıyla bağlandı. Mıknatıs 10 mm algılama alanının dışındayken lamba söner, yaklaştığında yanar. Bu gerçek alan kalibrasyonu veya saha güvenliği değildir.';
  l.explanation='Hall sensörünü bir kapının yanında düşün. Mıknatıs uzaktaysa bir şey algılamaz. Yaklaştırınca BK çıkışından gelen sinyal yeşil lambayı yakar. Mıknatıs uzaklaşınca lamba yeniden söner. BK kablosu koparsa, mıknatıs yaklaşsa bile lamba yanmaz.';
  l.quiz={question:'Sanal Hall sensörünün BK çıkışı hangi durumda lambayı yakar?',
   options:['Mıknatıs algılama alanına girdiğinde','Yalnız sensörün 0 V kablosu kopunca','Mıknatıs hep uzaktayken'],answer:0,
   why:'PNP Hall sensörü uyumlu mıknatısın yakınlığında BK çıkışını aktif eder.'};
  l.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
   heading:'Hall sensörü ile mıknatısı algıla',virtualOnly:true,
   canonicalGraphUnchanged:false,fullyRich:false,physicalTestAccepted:false,pedagogicalAcceptance:false,
   steps:['BN pozitif, BU sıfır volt, BK lamba girişine bağlı olmalı.',
    'Mıknatısı 40 mm uzakta tut; sinyal lambası söner.',
    'Mıknatısı 2 mm yaklaştır; yeşil sinyal lambası yanar.',
    'Mıknatısı yeniden uzaklaştır; lamba söner.',
    'BK veya BN kablosunu ayır; yakında mıknatıs olsa bile lamba yanmamalı.'],
   observations:['Gerçek Hall sensörü katalog terminali ve özgün Simulation.solve ile pozitif-negatif durumlar test edilir.',
    'Sanal manyetik mesafe, gerçek sensör hassasiyeti ve Windows/3D testleri değildir.'],
   repairModel:'SC454-NATIVE-HALL-PNP-MAGNET-V1'};
  const v=r||(l.pedagogyReview={});v.preRepairTitleTopologyIssue=v.titleTopologyIssue||null;
  v.titleTopologyStatus='REVIEW';
  v.titleTopologyIssue='REAL_HALL_FIELD_HARDWARE_WINDOWS_3D_PEDAGOGY_PENDING';
  v.componentIds=parts.map(c=>c.typeId);v.realWiredCircuit=true;
  v.nativeDynamicAcceptance=false;v.physicalAcceptance=false;v.windowsVisualAcceptance=false;
  v.independentPedagogicalAcceptance=false;
  v.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_703_CATALOG_SC454_TARGETED_PASS';
  v.actualCurriculumSequence=L.lessons.indexOf(l)+1;
  v.sc454HallRepair='SC454-NATIVE-HALL-PNP-MAGNET-V1';
 })();

 L.practiceGuideBatchN=stats;
 L._practiceGuideBatchN=true;
})(typeof window==='undefined'?globalThis:window);
