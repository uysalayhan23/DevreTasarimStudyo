/* MQ-07: four model-backed flasher lessons, source terminal wiring unchanged. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._timerBatchG)return;
const rows=[["timer-flipflop-1",1,1,"1 saniye açık / 1 saniye kapalı flaşör","Flaşör bobininin enerjili durumda bir saniye NO ve bir saniye NC yardımcı kontakla lambaları dönüşümlü çalıştırdığını açıkla.","Sanal zaman rölesini çalıştır; 0,2, 1,2 ve 2,1 saniyelerde yeşil/kırmızı lambaları karşılaştır. İki saniyelik periyodu gözlemle.","1 s açık + 1 s kapalı çevrimin toplam süresi kaç saniyedir?",["2 saniye","1 saniye","0,5 saniye"]],["timer-flipflop-2",0.5,1.5,"0,5 saniye açık / 1,5 saniye kapalı asimetrik flaşör","Flaşörde NO kontağın kısa süreli, NC kontağın uzun süreli etkin kalmasının 2 saniyelik toplam çevrim oluşturduğunu öğren.","Sanal devreyi zaman içinde izle; 0,2 s, 0,6 s ve 1,6 s konumlarında lamba değişimini kaydet. Gerçek 0,5/1,5 ayarını kontrol et.","0,5 s açık ve 1,5 s kapalı durumda açık kalma oranı kaçtır?",["%25","%50","%75"]],["timer-flipflop-3",1.5,0.5,"1,5 saniye açık / 0,5 saniye kapalı asimetrik flaşör","1,5 s NO açık kalma süresinin, 0,5 s NC açık kalma süresinden neden daha uzun olduğunu simülasyonla ayırt et.","0,6 s ve 1,6 s sanal durumlarını karşılaştır; yeşil ve kırmızı lambanın sürelerini hesapla. Toplam çevrimin yine 2 s olduğunu açıkla.","1,5 s açık ve 0,5 s kapalı durumda açık kalma oranı kaçtır?",["%75","%25","%50"]],["timer-flipflop-4",1,1,"Zaman rölesinde NO/NC kontakların karşıtlığı","Bir zaman rölesinin NO ve NC yardımcı kontaklarının aynı anda değil birbirinin tamamlayıcısı olarak lambaları değiştirdiğini açıkla.","Sanal devrede 0,2 s ve 1,2 s durumlarını karşılaştır. NO ve NC kontakları sırayla izle; aynı anda iki lambanın yanmadığını açıkla.","NO kontak etkin olduğunda eşlenik NC kontağın durumu nedir?",["Açık","Kapalı","Seri direnç"]]];
for(const [id,on,off,heading,goal,task,question,options] of rows){
 const lesson=L.byId[id];if(!lesson||lesson.topicId!=='timer-flipflop')throw Error('Timer lesson not found: '+id);
 const p=lesson.project,t=p?.components?.find(c=>c.id==='t'&&c.typeId==='coil-flasher');
 const g=p?.components?.find(c=>c.id==='g'&&c.typeId==='lamp-green'),r=p?.components?.find(c=>c.id==='r'&&c.typeId==='lamp-red');
 if(!t||!g||!r||lesson.steps?.length!==p.wires?.length||p.wires.length!==8)throw Error('Timer physical graph missing: '+id);
 t.flashOn=on;t.flashOff=off;
 lesson.designStandard='rich-reference-v1';lesson.learningGoal=goal;lesson.summary=goal;
 lesson.explanation=task+' Yalnız sanal devre ve zaman modeli gözlemlenir; gerçek enerjili ekipmana müdahale edilmez.';
 lesson.measurementUpgrade={heading,goal,task,question,options,timingModel:true,onSeconds:on,offSeconds:off};
 lesson.beginnerSteps=['NO ve NC kontakların normalde hangi durumlarda olduğunu incele.','Sanal bobin ve kontak kablolarını terminalden terminale gör.',task,'Yeniden kur akışıyla özgün devreyi tekrar bağla.','Gözlemlediğin lamba sürelerini hesapla ve konu kontrolünü cevapla.'];
 lesson.quiz={question,options:[...options],answer:0,why:goal};
 lesson.pedagogyReview={...lesson.pedagogyReview,previousVersion:lesson.pedagogyReview?.version||null,version:'v1.19.20-timer-batch-g',reviewed:true,codeImplemented:true,visualAcceptance:false,timingModel:'DTSDeviceBehavior.timed + Simulation.solve',preserveSourceWires:true};
}
L._timerBatchG=true;
})(typeof window==='undefined'?globalThis:window);
