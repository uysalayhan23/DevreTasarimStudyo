/* Devre Tasarım Stüdyosu — Measurement rich lessons batch B, simulation-only. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._measurementBatchB)return;
const clone=value=>JSON.parse(JSON.stringify(value));
const data=[
 {id:'measurement-workshop-outline-016',mode:'scope',heading:'Osiloskop ile ölçüme başlangıç',goal:'CH1 ve GND girişlerinin görevi, 5 V sinyal genliği ve zaman tabanı üzerinden bir dalga biçimini okumayı öğren.',task:'Sanal jeneratörü osiloskop CH1/GND uçlarına bağla. Önce 50 Hz sonra 1 kHz sinyali izle; yükselen kenar, Vpp ve periyot değerini karşılaştır.',question:'1 kHz sinyalin periyodu kaç milisaniyedir?',options:['1 ms','10 ms','100 ms']},
 {id:'measurement-workshop-outline-044',mode:'scope',heading:'Osiloskop ekranında sinyal analizi',goal:'Osiloskop ekranındaki yatay zaman ekseni, dikey gerilim ekseni, Vpp ve frekans ilişkisinin nasıl okunacağını açıkla.',task:'50 Hz, 1 kHz ve 10 kHz sanal sinyallerde zaman tabanını değiştir. Aynı 5 Vpp genlikte çevrimlerin ekran üzerinde nasıl sıklaştığını gör.',question:'Frekans on katına çıkarsa periyot ne olur?',options:['On kat küçülür','On kat büyür','Sabit kalır']},
 {id:'measurement-workshop-outline-045',mode:'scope',heading:'Tetiklemeyle kararlı dalga ölçümü',goal:'Ortak toprak (GND), CH1 tetikleme seviyesi ve frekans ölçümünün sinyal gözlemindeki rolünü öğren.',task:'Sanal jeneratörde frekansı değiştir; CH1 dalga izini, otomatik tetiklemeyi ve osiloskop istatistiklerini karşılaştır. GND kablosunu kaldırınca doğru ölçüm yapılmadığını gözlemle.',question:'Osiloskop GND bağlantısı kaldırılırsa ne olur?',options:['Geçerli referans olmadığı için dalga ölçümü yapılamaz','Frekans iki katına çıkar','Vpp her zaman 5 V kalır']},
 {id:'measurement-workshop-outline-033',mode:'clamp',heading:'Pens ampermetreyle tek iletken akımı',goal:'Sanal UT200A pens çenesinin kabloyu kesmeden tek iletkendeki AC RMS akımını ölçme mantığını açıkla.',task:'Çeneyi sanal faz iletkenine, sonra nötr iletkenine getir; en son boş konuma taşı. Sonuçları yaklaşık 1 A RMS ve ölçüm yok olarak karşılaştır.',question:'Pens çenesinden neden tek iletken geçirilir?',options:['İleri ve dönüş akımının manyetik alanları birbirini götürmesin diye','Gerilim artacağı için','Yük direnci sıfırlansın diye']},
 {id:'measurement-workshop-outline-034',mode:'frequency',heading:'Frekansmetreyle sinyal periyodu',goal:'Sanal UT61E+ Hz fonksiyonuyla frekansı ölçüp T=1/f bağıntısından periyodu hesapla.',task:'0–5 V sanal sinyalde 50 Hz, 1 kHz ve 10 kHz seçeneklerini dene. Problar GND/OUT bağlıyken ölçü ve hesaplanan periyodu karşılaştır.',question:'50 Hz sinyalin bir çevrimi kaç milisaniyedir?',options:['20 ms','2 ms','0,2 ms']}
];
let wid=81000;
function wire(a,ap,b,bp,text,role='SIGNAL'){
 return {id:'mbb-'+(++wid),from:{c:a,p:ap},to:{c:b,p:bp},color:role==='0V'?'#111827':'#43a047',role,size:'1.5',points:[],tutorialHint:text,tutorialWhy:'Bu bağlantı yalnız sanal düşük gerilimli sinyalin ölçüm referansını kurar.'};
}
function scopeProject(id,title){
 const components=[
  {id:'fg',typeId:'arduino-signal-generator',x:100,y:240,rotation:0,ref:'FG1',label:'FG1 · Sanal 0–5 V sinyal jeneratörü',generatorEnabled:true,generatorWaveform:'square',generatorFrequency:1000,generatorAmplitude:5,generatorOffset:0,generatorDuty:50,tutorialPurpose:'Gerçek osiloskop verisinin üretildiği sanal sinyal kaynağı.'},
  {id:'osc',typeId:'arduino-oscilloscope',x:570,y:215,rotation:0,ref:'OSC1',label:'OSC1 · İki kanallı osiloskop',scopeTimeMs:10,scopeSamplePoints:500,scopeCoupling1:'DC',scopeTriggerMode:'auto',scopeTriggerSource:'CH1',scopeTriggerEdge:'rising',scopeTriggerLevel:2.5,tutorialPurpose:'CH1 ve GND üzerinden örneklenen gerçek sanal dalgayı gösterir.'}
 ];
 return {version:7,workspaceMode:'arduino',projectId:'tutorial-session-source-'+id,name:'Öğretici · '+title,symbolNorm:'IEC',preferredAppearance:'material',components,wires:[wire('fg','OUT','osc','CH1','FG1 OUT → OSC1 CH1'),wire('fg','GND','osc','GND','FG1 GND → OSC1 GND','0V')],junctions:[],tutorialLesson:{id,topicId:'measurement-workshop',phase:'demo',step:0},tutorialExplore:{type:'scope-waveform-rich',simulationOnly:true,presets:[{hz:50,spanMs:100},{hz:1000,spanMs:10},{hz:10000,spanMs:2}]}};
}
for(const row of data){
 const lesson=L.byId[row.id];if(!lesson||lesson.topicId!=='measurement-workshop')throw Error('Missing measurement lesson '+row.id);
 const source=row.mode==='clamp'?L.byId['measurement-workshop-src-04']:row.mode==='frequency'?L.byId['measurement-workshop-src-05']:null;
 const p=source?clone(source.project):scopeProject(row.id,lesson.title);
 if(source){p.projectId='tutorial-session-source-'+row.id;p.name='Öğretici · '+lesson.title;p.tutorialLesson={id:row.id,topicId:lesson.topicId,phase:'explore',step:0,level:lesson.variant};}
 else p.tutorialLesson.level=lesson.variant;
 lesson.project=p;lesson.workspaceMode=p.workspaceMode;lesson.kind=source?'explore':'wiring';
 lesson.steps=p.wires.filter(w=>!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 lesson.designStandard='rich-reference-v1';
 lesson.measurementUpgrade={heading:row.heading,goal:row.goal,task:row.task,question:row.question,options:row.options,scope:row.mode==='scope'};
 lesson.summary=row.goal;lesson.learningGoal=row.goal;
 lesson.explanation=row.task+' Bu, uygulamanın sanal simülasyon deneyidir; gerçek enerjili cihaz üzerinde işlem yapılmaz.';
 lesson.beginnerSteps=['Önce kullanılan cihazın girişlerini ve sanal kaynağını incele.','Sanal ölçümün beklenen sonucunu tahmin et.',row.task,'Simülasyondaki sonucu hesapla ve karşılaştır.','Konu kontrolünü cevapla.'];
 lesson.quiz={question:row.question,options:row.options,answer:0,why:row.goal};
 lesson.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref,why:c.tutorialPurpose||'Sanal ölçüm düzeneğinin parçasıdır.'}));
 lesson.pedagogyReview={version:'v1.19.20-measure-batch-b',reviewed:true,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',simulationOnly:true,sourceLab:source?.id||'arduino-oscilloscope-generator'};
}
L._measurementBatchB=true;
})(typeof window==='undefined'?globalThis:window);
