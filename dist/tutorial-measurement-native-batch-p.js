/* SC094-097: topic-specific native virtual measurement sources; no mains work instructions. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._nativeMeasurementBatchP)return;
const copy=x=>JSON.parse(JSON.stringify(x));
const C=(id,typeId,x,y,o={})=>({id,typeId,x,y,rotation:0,ref:id.toUpperCase(),label:id.toUpperCase(),state:false,...o});
let n=0;
const W=(a,p,b,q,role='MEASURE')=>({id:'mnp-'+(++n),from:{c:a,p},to:{c:b,p:q},role,size:'1.5',color:role==='0V'?'#111827':'#8b5a2b',points:[],probeLead:role==='MEASURE',tutorialHint:a+'/'+p+' → '+b+'/'+q,tutorialWhy:'Sanal devrede doğru ölçüm veya yük yolunu oluşturur.'});
function leads(cs,ws,mId,red,black,redJack='V'){
 const meter=cs.find(c=>c.id===mId);if(!meter)throw Error('Missing meter '+mId);
 cs.push(C(mId+'-red','test-probe-red',meter.x+210,meter.y+75,{probeTarget:copy(red)}),C(mId+'-black','test-probe-black',meter.x+210,meter.y+175,{probeTarget:copy(black)}));
 ws.push(W(mId,redJack,mId+'-red','PLUG'),W(mId,'COM',mId+'-black','PLUG'));
}
const cases=[
 ['measurement-workshop-src-03','resistance','Bir direnci ölçmek için önce enerji yolunu ayır.','Sanal UNI-T ile 1 kΩ, 0 Ω ve açık prob OL farkını tanı.'],
 ['measurement-workshop-src-04','clamp','Pens ölçer kabloya değmeden AC akımını algılar.','Sanal 230 V / 230 Ω örneğinde faz ve nötr akımını karşılaştır.'],
 ['measurement-workshop-src-05','frequency','Bir dalganın saniyede kaç kez tekrar ettiğini ölç.','Sanal UT61E+ ile 50 Hz, 1 kHz ve 10 kHz değerlerini gözlemle.'],
 ['measurement-workshop-src-06','energy','Güç ile zaman içinde biriken enerjiyi birbirinden ayır.','Sanal analizörde W, VA, var ve güç faktörünü karşılaştır.']
];
for(const [id,kind,summary,goal] of cases){
 const lesson=L.byId[id],old=lesson?.project;
 if(!lesson||!old||old.components?.length!==3||
   !['supply-dc-plus','converter-temperature','meter-ammeter'].every(typeId=>old.components.some(c=>c.typeId===typeId))||
   old.wires?.length!==3)throw Error('Unexpected protected lesson source '+id);
 n=0;let cs=[],ws=[],explore={type:kind+'-measurement-rich',simulationOnly:true};
 if(kind==='resistance'){
  cs=[C('g','supply-dc-plus',95,100,{dcVoltage:0,sourceEnabled:false,label:'G1 · OFF / ayrılmış'}),
      C('r1','resistor',480,145,{resistance:1000,label:'R1 · 1 kΩ'}),
      C('m1','unit-ut33d-plus',690,390,{meterPosition:15,label:'M1 · Ω 2 kΩ'})];
  leads(cs,ws,'m1',{c:'r1',p:'1'},{c:'r1',p:'2'});
 }else if(kind==='clamp'){
  cs=[C('g1','supply-1p',85,110,{label:'G1 · sanal AC kaynak'}),
      C('r1','resistor',530,135,{resistance:230,label:'R1 · 230 Ω'}),
      C('cl','unit-ut200a',805,330,{meterPosition:1,clampedWireId:'mnp-1',clampT:.52,label:'CL · UNI-T UT200A'})];
  ws=[W('g1','L','r1','1','POWER'),W('r1','2','g1','N','0V')];
  explore.phaseWireId='mnp-1';explore.neutralWireId='mnp-2';
 }else if(kind==='frequency'){
  cs=[C('fg','arduino-signal-generator',120,125,{generatorEnabled:true,generatorFrequency:1000,generatorAmplitude:5,generatorWaveform:'square',label:'FG1 · sanal 1 kHz'}),
      C('m1','unit-ut61e-plus',600,170,{meterPosition:5,label:'M1 · UNI-T UT61E+ · Hz'})];
  leads(cs,ws,'m1',{c:'fg',p:'OUT'},{c:'fg',p:'GND'});
 }else if(kind==='energy'){
  cs=[C('g1','supply-1p',90,110,{label:'G1 · sanal AC kaynak'}),
      C('z1','energy-training-load-1p',620,135,{apparentPowerVA:230,powerFactor:1,loadCharacter:'resistive',label:'Z1 · sanal 230 VA yük'}),
      C('ct1','current-transformer-edu-1p',385,135,{label:'CT1 · eğitim akım trafosu'}),
      C('ea1','energy-analyzer-1p',900,335,{label:'EA1 · sanal enerji analizörü'})];
  ws=[W('g1','L','ct1','P1','POWER'),W('ct1','P2','z1','L','POWER'),
      W('z1','N','g1','N','0V'),W('g1','L','ea1','L','MEAS_V'),
      W('g1','N','ea1','N','MEAS_V'),W('ct1','S1','ea1','S1','MEAS_I'),
      W('ct1','S2','ea1','S2','MEAS_I')];
  explore.presets=['resistive','inductive','capacitive'];
 }
 lesson.project={...copy(old),components:cs,wires:ws,junctions:[],tutorialExplore:explore};
 lesson.kind=['clamp','energy'].includes(kind)?'wiring':'explore';
 lesson.steps=ws.filter(w=>!w.probeLead).map(w=>({from:copy(w.from),to:copy(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 lesson.summary=summary;lesson.learningGoal=goal;
 lesson.explanation=summary+' Önce sonucu tahmin et, sonra uygulamanın sanal ölçümünü incele.';
 lesson.beginnerSteps=['Ölçülecek büyüklüğü seç.','Sanal cihazın bağlantılarını kontrol et.','Ölçümü çalıştır ve sonuçları karşılaştır.'];
 lesson.materials=cs.filter(c=>!/^test-probe-/.test(c.typeId)).map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,why:'Bu dersin sanal ölçüm veya kaynak elemanı.'}));
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),codeImplemented:true,simulationAcceptance:false,visualAcceptance:false,sourceStatus:'native-instrument-demo'};
}
L._nativeMeasurementBatchP=true;
})(typeof window==='undefined'?globalThis:window);