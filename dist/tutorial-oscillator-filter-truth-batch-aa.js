/* Follow-up to accepted SC182–189: correct source-specific SC190+ teaching only.
 * SC201/202 are PASSIVE RC examples, not their original "aktif filtre" labels.
 * All wires and component instances stay byte-for-byte unchanged. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._oscillatorFilterTruthBatchAA)return;
const specs=[
['09',8,12,'DIODE_CLIPPER_GRAPH_REPAIRED',
 'Sanal 1N4148 kırpıcıda D1 diyodu neyi sınırlar?',
 ['Çıkışın referans düğümünün üzerine çıkabileceği gerilimi','İşaretin frekansını her zaman 50 Hz yapmayı','Devreyi kendi başına osilatöre çevirmeyi'],
 'D1, çıkış düğümü ile sanal 12 V referans arasında bulunur. Diyodun iletimi çıkış yükselmesini sınırlar; gerçek DC aktarım eğrisi henüz kabul edilmedi.',
 ['Önce RV1 ayarını, D1 A/K yönünü ve ayrı referans bölücüsünü bul.','Çıkış sınırlama ile salınım üretmenin neden farklı şeyler olduğunu açıkla.','Sayısal gerilim aktarımını ölçülmüş/kalibre edilmiş sonuç olarak sunma.']],
['11',3,0,'REVIEW',
 'Miller etkisinde geri besleme kapasitesinin girişteki etkisi neye bağlıdır?',
 ['Yükseltecin gerilim kazancına ve uçlar arası kapasiteye','Yalnız 50 Hz şebeke frekansına','Kondansatörün fiziksel renginin seçimine'],
 'Miller etkisi, yükselteç giriş-çıkış arasındaki kapasitenin girişteki görünen etkisini değiştirebilir. Bu sayfa bağlantılı devre veya frekans ölçümü değildir.',
 ['Bir giriş-çıkış kazancı ile aradaki kapasite arasında ilişki kur.','Referans elemanlarını çalışan yükselteç gibi değerlendirme.']],
['12',3,0,'REVIEW',
 'Bootstrap devresinde kondansatörün yeniden şarj edilmesi neden gerekir?',
 ['Yükseltilen sürücü seviyesinin zamanla korunabilmesi için','Her kondansatörü sınırsız enerji kaynağı yapmak için','Transistörün tüm uçlarını aynı potansiyele bağlamak için'],
 'Bootstrap tekniği uygun koşullarda geçici bir referans/gerilim kaydırma sağlar. Bağlantılı sürücü ve gerçek yük testi burada yoktur.',
 ['Kondansatörün enerji depolama ve yeniden şarj görevini ayır.','Bu kavramsal sayfadan çalışan gerçek sürücü sonucu çıkarma.']],
['13',8,14,'LM358_SCHMITT_GRAPH_REPAIRED',
 'LM358P Schmitt Trigger neden iki farklı anahtarlama eşiği gösterebilir?',
 ['Pozitif geri besleme, girişin artış ve azalış yönünde ayrı eşikler oluşturabilir','Çıkış yalnız osilatör olduğu için','Tüm LM358 çıkışları her zaman besleme gerilimine eşit olduğu için'],
 'R2 pozitif geri beslemesi histerezis davranışının temelidir. Sayısal eşikler veya üretici çıkış sınırları bu derste doğrulanmış sayılmaz.',
 ['RV1 girişini, R1 ve R2 pozitif geri besleme yolunu ayırt et.','Giriş artarken ve azalırken anahtarlama eşiklerinin neden ayrılabildiğini anlat.','Native histerezis ve fiziksel LM358P kabulünün hâlâ açık olduğunu unutma.']],
['20',6,8,'SOURCE_TOPOLOGY_REPAIRED_NATIVE_PENDING',
 'Pasif RC bant geçiren şemada yüksek ve alçak frekanslar nasıl bastırılır?',
 ['C1/R1 yüksek geçişi ile R2/C2 alçak geçişi art arda davranır','Devrede bulunmayan bir op-amp osilasyon üretir','Filtre her frekansta aynı kazancı garanti eder'],
 'Şemada op-amp veya aktif kazanç elemanı yoktur; verilen devre pasif RC bant geçiren örnektir. Native frekans cevabı ve gerçek aktarım kabul edilmemiştir.',
 ['Önce C1/R1 yüksek geçiren kolu tanı.','Ardından R2/C2 alçak geçiren kolu ve ortak çıkışı incele.','Bunun gerçek aktif filtre olmadığını ve frekans kabulünün açık olduğunu belirt.'],
 'Bant geçiren RC filtre (pasif örnek)'],
['21',8,11,'SOURCE_TOPOLOGY_REPAIRED_NATIVE_PENDING',
 'Twin-T pasif bant durduran ağda hangi iki kol birlikte çentik oluşturur?',
 ['R1/R2 ve C3 koluyla C1/C2 ve R3 kolu','Bir op-ampın bulunmayan iki çıkışı','PWM üreteciyle bir röle bobini'],
 'İki T kolu belirli frekansın bastırılmasına yardımcı olur; bu şemada aktif yükselteç bulunmaz. Native frekans cevabı bekliyor.',
 ['Dirençli R1/R2 kolunu ve C3 şöntünü bul.','Kapasitif C1/C2 kolunu ve R3 şöntünü ayırt et.','Bu pasif twin-T örneğinin aktif filtre kabulü taşımadığını açıkla.'],
 'Bant durduran twin-T filtre (pasif örnek)'],
['22',2,0,'REVIEW',
 'FM modülasyonunda gönderilen bilgi taşıyıcı sinyalin neyini değiştirir?',
 ['Anlık frekansını','Her durumda yalnız DC gerilimini','Bir rölenin NO/NC kontağını'],
 'Bu sayfada FM verici bloku kavramsal referanstır. Anten çıkışı, yayın gücü ve modülasyon spektrumu doğrulanmış değildir.',
 ['FM’de taşıyıcının anlık frekans değişimi ile bilgi iletimini ilişkilendir.','Bu referansı çalışan RF verici veya yayın testi olarak değerlendirme.']]
];
for(const [suffix,count,wires,status,question,options,why,guide,displayTitle] of specs){
 const id='oscillator-filter-apps-src-'+suffix,l=L.byId[id];
 if(!l||l.topicId!=='oscillator-filter-apps'||l.project?.components?.length!==count||
  l.project?.wires?.length!==wires||l.steps?.length!==wires||
  l.pedagogyReview?.titleTopologyStatus!==status)throw Error('Locked oscillator/filter source not matched '+id);
 if(l.pedagogyReview?.independentPedagogicalAcceptance!==false||l.pedagogyReview?.physicalAcceptance!==false)throw Error('Protected acceptance changed '+id);
 if(!wires&&(l.kind!=='quiz'||l.project.referenceOnly!==true||l.pedagogyReview.titleTopologyIssue!=='NO_WIRED_CIRCUIT'))
  throw Error('Conceptual source no longer reference-only '+id);
 if(wires&&l.kind!=='wiring')throw Error('Expected virtual wired project '+id);
 if(suffix==='20'&&l.pedagogyReview.titleTopologyIssue!=='PASSIVE_BANDPASS_NATIVE_PENDING'||
    suffix==='21'&&l.pedagogyReview.titleTopologyIssue!=='TWIN_T_NOTCH_NATIVE_PENDING')
  throw Error('Locked passive filter native acceptance changed '+id);
 if(wires&&!l.project.wires.every(w=>l.project.components.some(c=>c.id===w.from?.c)&&l.project.components.some(c=>c.id===w.to?.c)))
  throw Error('Incomplete virtual wire endpoint '+id);
 const generic='“'+l.title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(l.quiz?.question!==generic||l.quiz?.answer!==0||l.quiz.options?.length!==3)
  throw Error('Lesson quiz no longer generic; preserve '+id);
 const snapshot=JSON.stringify({components:l.project.components,wires:l.project.wires,steps:l.steps});
 l.quiz={question,options:[...options],answer:0,why};
 l.beginnerSteps=[...guide];
 if(displayTitle){
   if(l.title!==(suffix==='20'?'Bant geçiren aktif filtre':'Bant durduran aktif filtre')||
      l.project.name!=='Öğretici · '+l.title)throw Error('User-visible title differs '+id);
   l.title=displayTitle;
   l.project.name='Öğretici · '+displayTitle;
   l.summary='Bu dersin müfredat başlığında aktif filtre yazsa da kayıtlı devre '+(suffix==='20'?'pasif RC bant geçiren':'pasif twin-T bant durduran')+
    ' bir ağdır; op-amp/kazanç katı yoktur. '+l.summary;
 }
 l.explanation=why+' '+l.explanation;
 l.pedagogyReview={...l.pedagogyReview,sourceTruthQuizVersion:'v1.19.20-oscillator-followup-aa',
   circuitPreserved:true,physicalAcceptance:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 if(snapshot!==JSON.stringify({components:l.project.components,wires:l.project.wires,steps:l.steps}))
  throw Error('Canonical wiring or steps altered '+id);
}
L._oscillatorFilterTruthBatchAA=true;
})(typeof window==='undefined'?globalThis:window);