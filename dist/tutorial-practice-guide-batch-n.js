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


 // SC792/794/796/797/798/799/802: checked true catalogue-terminal circuits.
 (() => {
 const part=(id,typeId,label,x,y,ext={})=>({id,typeId,ref:id.toUpperCase(),label,x,y,rotation:0,state:false,address:'',note:'',...ext});
 const edge=(a,ap,b,bp)=>[a,ap,b,bp];
 function repair(sc,id,parts,edges,description,steps,marker){
   const lesson=L.lessons[sc-1],p=lesson?.project,r=lesson?.pedagogyReview;
   if(lesson?.id!==id||lesson.kind!=='wiring'||p?.components?.length!==7||
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
   delete p.referenceOnly;
   p.tutorialLesson={...(p.tutorialLesson||{}),id:lesson.id,phase:'demo',step:0};
   lesson.steps=p.wires.map(w=>({from:{...w.from},to:{...w.to},
     hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
   lesson.materials=parts.map(c=>({id:c.id,label:c.label,
     why:c.typeId+' parçasının devredeki giriş, çıkış ve koruma uçlarını bul.'}));
   lesson.summary=description+' Gerçek Windows/3D ve bağımsız pedagojik kabul açık.';
   lesson.practiceGuide={version:'practice-n1',method:'virtual-circuit-check',
     heading:'Devreyi birlikte kurup deneyelim',
     virtualOnly:true,canonicalGraphUnchanged:false,
     physicalTestAccepted:false,pedagogicalAcceptance:false,fullyRich:false,
     steps,observations:['Normal ve kopuk kablo durumu gerçek native simülasyon çekirdeğiyle sınandı.',
       'Bu sanal deney, gerçek elektrik panosunda çalışma veya Windows/3D kabulü değildir.'],
     repairModel:marker};
   const review=r||(lesson.pedagogyReview={});
   review.preRepairTitleTopologyIssue=review.titleTopologyIssue||null;
   review.titleTopologyStatus='REVIEW';
   review.titleTopologyIssue='WINDOWS_3D_AND_INDEPENDENT_PEDAGOGICAL_ACCEPTANCE_PENDING';
   review.componentIds=parts.map(c=>c.typeId);
   review.realWiredCircuit=true;review.nativeDynamicAcceptance=false;
   review.targetedNativePositiveNegative='ORIGINAL_SIMULATION_SOLVE_WITH_703_CATALOG_PASS';
   review.physicalAcceptance=false;review.windowsVisualAcceptance=false;
   review.independentPedagogicalAcceptance=false;
   review.scActualTopologyRepair=marker;
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

 L.practiceGuideBatchN=stats;
 L._practiceGuideBatchN=true;
})(typeof window==='undefined'?globalThis:window);
