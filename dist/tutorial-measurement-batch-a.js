(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._measurementBatchA)return;
const clone=value=>JSON.parse(JSON.stringify(value));
const items=[["011","01","Dijital multimetreyi tanı","UNI-T UT33D+ ekranının, DCV kademesinin, VΩmA ve COM girişlerinin görevini tanımla.","Kaynağı 24 V kabul et; R1 gerilimini, aynı düğümü ve ters polariteyi sırayla ölç.","24 V, neden DCV 20 V aralığında ölçülemez?",["24 V aralığın üstündedir","COM bozulur","Devre açık olur"]],["012","01","Dijital multimetreyi kullan","Dijital multimetrenin gerilim ölçerken neden iki farklı elektrik noktasına temas ettiğini açıkla.","Önce R1 uçlarını, sonra kaynak uçlarını, aynı düğümü ve ters polariteyi probla dene.","Voltmetre hangi bağlantıyla gerilim ölçer?",["Ölçülecek elemana paralel","Yüke seri","Sadece PE ucuna"]],["013","01","Ölçüme uygun kademeyi seç","Ölçülen büyüklüğün türüne ve beklenen gerilime göre UNI-T DCV aralığını seçmeyi öğren.","Kaynak 24 V olduğunda DCV 20 V ile DCV 200 V arasındaki farkı açıkla ve ölç.","24 VDC için doğru UNI-T konumu hangisidir?",["DCV 200 V","DCV 20 V","DCA 200 mA"]],["014","01","İki uçtan gerilim ölç","Gerilimin iki düğümün potansiyel farkı olduğunu gerçek kırmızı ve siyah problarla doğrula.","R1, kaynak, aynı düğüm ve ters polarite seçeneklerinde değerleri önce tahmin et.","Aynı elektriksel düğümde iki prob kaç volt gösterir?",["Yaklaşık 0 V","24 V","240 V"]],["015","02","Devreye seri ampermetre bağla","24 V ve 1 kΩ dirençteki 24 mA akımı uygun DCA 200 mA kademesinde seri ölç.","Yük öncesi ve sonrası akımı karşılaştır, prob yönünü ters çevir.","Ampermetre akımı nasıl ölçer?",["Akım yoluna seri girer","Kaynağa paralel girer","Sadece PE ile ölçer"]],["031","01","Voltmetreyle gerilimleri karşılaştır","UNI-T ile yük ve kaynak gerilimini ölçüp polaritenin ölçüm işaretini belirlediğini gör.","Kaynak ve yük uçlarını ölç, aynı düğümde 0 V bul ve ters prob yönünü dene.","Problar ters çevrilirse ne değişir?",["Gerilimin işareti","Direncin değeri","Kaynağın gerilimi"]],["032","02","Ampermetreyle seri akımı ölç","Aynı seri yolda akımın yük öncesi ve sonrasında neden eşit olduğunu açıkla.","İki seri ölçüm konumunu karşılaştır; sonra akım işaretini ters yönde gözle.","İdeal seri devrede yükün iki yanında akım nasıldır?",["Aynı büyüklüktedir","Yükten sonra sıfır olur","İki katına çıkar"]],["042","01","Multimetreyle gerilim ölçme işlemi","DCV aralığını seçip multimetreyi doğru girişlerle paralel bağlayarak gerilimi ölç.","Önce DCV 200 V kademesini, sonra R1 gerilimini ve ters polariteyi uygula.","Kırmızı gerilim probu hangi yuvaya takılır?",["VΩmA","10A","COM"]],["043","02","Multimetreyle akım ölçme işlemi","Ampermetreyi seri yerleştirip DCA 200 mA kademesini ölçülen 24 mA için seç.","Önce yükün girişini, ardından çıkışını ve ters ölçüm yönünü karşılaştır.","24 mA için hangi kademe uygundur?",["DCA 200 mA","DCA 20 mA","DCV 200 V"]]];
for(const [suffix,variant,heading,goal,task,question,options] of items){
 const id='measurement-workshop-outline-'+suffix,sourceId='measurement-workshop-src-'+variant;
 const lesson=L.byId[id],source=L.byId[sourceId];
 if(!lesson||!source||lesson.topicId!=='measurement-workshop')throw Error('Measurement reference unavailable: '+id);
 const p=clone(source.project);
 p.projectId='tutorial-session-source-'+id;p.name='Öğretici · '+lesson.title;
 p.tutorialLesson={id,topicId:lesson.topicId,phase:'demo',step:0,level:lesson.variant};
 p.tutorialExplore={...p.tutorialExplore,designStandard:'rich-reference-v1',specializedLesson:id};
 lesson.project=p;lesson.kind='wiring';lesson.steps=clone(source.steps);lesson.workspaceMode=p.workspaceMode;
 lesson.designStandard='rich-reference-v1';
 lesson.measurementUpgrade={heading,goal,task,question,options};
 lesson.summary=goal+' Bu uygulamada UNI-T UT33D+ ve R1 direnç üzerinden ölçülür.';
 lesson.explanation=task+' UNI-T UT33D+ ekranındaki sonucu G1 ve R1 bağlantılarıyla karşılaştır.';
 lesson.learningGoal=goal+' UNI-T UT33D+ ile ölçümü doğrula.';
 lesson.beginnerSteps=['Önce UNI-T girişlerini ve doğru kademeyi incele.','Devreyi simüle etmeden önce sonucu tahmin et.',task,'Prob konumunu değiştirip nedenini açıkla.','Devreyi yeniden kur ile güç yolunu terminalden terminale bağla.'];
 lesson.quiz={question,options,answer:0,why:goal};
 lesson.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref,why:c.tutorialPurpose||'Bu dersin ölçüm elemanıdır.'}));
 lesson.pedagogyReview={version:'v1.19.20-measure-batch-a',reviewed:true,title:lesson.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',physicalProbes:true,canonicalLabSource:sourceId,specializedPractice:true};
}
L._measurementBatchA=true;
})(typeof window==='undefined'?globalThis:window);
