/* Scoped real LM358P PDIP-8 / passive RC terminal graphs for virtual lessons.
 * Native small-signal results are ideal; no physical or calibrated acceptance. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._activeFilterWiredBatchAG)return;
const common=[["g","arduino-bench-supply","G1","Sanal 12 V kaynak",{"dcVoltage":12,"currentLimit":0.3}],["fg","arduino-signal-generator","FG1","2 Vpp sinüs",{"generatorWaveform":"sine","generatorFrequency":159,"generatorAmplitude":2,"generatorOffset":0}],["u","lm358p-dip8","U1","LM358P tampon",{}],["v","meter-voltmeter","V1","VREF e göre sanal AC",{}],["ra","resistor","RA","10 kΩ VREF üst",{"resistance":10000}],["rb","resistor","RB","10 kΩ VREF alt",{"resistance":10000}],["cref","capacitor","CREF","100 µF sanal VREF dekuplaj",{"capacitance":0.0001}],["cin","capacitor","CIN","10 µF AC giriş kuplaj",{"capacitance":0.00001}],["rbias","resistor","RBIAS","100 kΩ giriş bias",{"resistance":100000}]],shared=["g.P>u.8","g.M>u.4","ra.1>g.P","ra.2>rb.1","rb.2>g.M","cref.1>ra.2","cref.2>g.M","fg.GND>g.M","fg.OUT>cin.1","cin.2>rbias.1","rbias.2>ra.2","u.1>u.2","u.1>v.1","v.2>ra.2","u.5>g.M","u.7>u.6"],
      plans={"050":{"kind":"lowpass","parts":[["r1","resistor","R1","10 kΩ LP seri",{"resistance":10000}],["c1","capacitor","C1","10 nF LP şönt",{"capacitance":1e-8}]],"edges":["cin.2>r1.1","r1.2>c1.1","c1.2>ra.2","r1.2>u.3"]},"051":{"kind":"highpass","parts":[["c1","capacitor","C1","100 nF HP seri",{"capacitance":1e-7}],["r1","resistor","R1","10 kΩ HP şönt",{"resistance":10000}]],"edges":["cin.2>c1.1","c1.2>r1.1","r1.2>ra.2","c1.2>u.3"]},"052":{"kind":"bandpass","parts":[["c1","capacitor","C1","1 µF BP giriş",{"capacitance":0.000001}],["r1","resistor","R1","10 kΩ BP HP şönt",{"resistance":10000}],["r2","resistor","R2","10 kΩ BP LP seri",{"resistance":10000}],["c2","capacitor","C2","10 nF BP LP şönt",{"capacitance":1e-8}]],"edges":["cin.2>c1.1","c1.2>r1.1","r1.2>ra.2","c1.2>r2.1","r2.2>c2.1","c2.2>ra.2","r2.2>u.3"]},"053":{"kind":"twin-t-notch","parts":[["r1","resistor","R1","10 kΩ üst T",{"resistance":10000}],["r2","resistor","R2","10 kΩ üst T",{"resistance":10000}],["c3","capacitor","C3","200 nF üst şönt",{"capacitance":2e-7}],["c1","capacitor","C1","100 nF alt T",{"capacitance":1e-7}],["c2","capacitor","C2","100 nF alt T",{"capacitance":1e-7}],["r3","resistor","R3","5 kΩ alt şönt",{"resistance":5000}]],"edges":["cin.2>r1.1","r1.2>r2.1","r1.2>c3.1","c3.2>ra.2","cin.2>c1.1","c1.2>c2.1","c1.2>r3.1","r3.2>ra.2","r2.2>c2.2","r2.2>u.3"]}},issues={"050":"ACTIVE_LOWPASS_CUTOFF_UNWIRED","051":"ACTIVE_HIGHPASS_CUTOFF_UNWIRED","052":"ACTIVE_BANDPASS_TWO_CUTOFFS_UNWIRED","053":"ACTIVE_BANDSTOP_NOTCH_UNWIRED"};
const clone=v=>JSON.parse(JSON.stringify(v));
for(const [suffix,cfg] of Object.entries(plans)){
 const id='oscillator-filter-apps-outline-'+suffix,l=L.byId[id],prior=l?.project;
 if(!l||l.topicId!=='oscillator-filter-apps'||l.kind!=='quiz'||
    prior?.referenceOnly!==true||prior.wires?.length||l.steps?.length||
    l.pedagogyReview?.titleTopologyIssue!==issues[suffix]||
    l.pedagogyReview?.titleTopologyStatus!=='REVIEW'||
    !['nativeDynamicAcceptance','frequencyResponseAcceptance','physicalAcceptance',
       'windowsVisualAcceptance','independentPedagogicalAcceptance'].every(k=>l.pedagogyReview[k]===false))
   throw Error('Protected active filter baseline changed '+id);
 const p=clone(prior);
 p.components=[...common,...cfg.parts].map((v,i)=>({id:v[0],typeId:v[1],ref:v[2],label:v[3],
   x:60+(i%5)*250,y:140+Math.floor(i/5)*210,rotation:0,state:false,address:'',note:'',
   ...v[4],tutorialPurpose:'Sanal '+v[3]+'; tek başına fiziksel veya native cihaz kabulü değildir.'}));
 p.wires=[...shared,...cfg.edges].map((v,i)=>{
   const [left,right]=v.split('>'),[lc,lp]=left.split('.'),[rc,rp]=right.split('.');
   return {id:'ag-'+suffix+'-'+i,from:{c:lc,p:lp},to:{c:rc,p:rp},
     color:'#43a047',role:'SIGNAL',size:'1.5',points:[],
     tutorialHint:v.replace('>',' → '),
     tutorialWhy:'Gerçek katalog terminallerini birleştiren sanal kaynak kablosu.'};
 });
 delete p.referenceOnly;
 p.tutorialLesson={...(p.tutorialLesson||{}),id,phase:'demo',step:0};
 const validPins={g:['P','M'],fg:['OUT','GND'],u:['1','2','3','4','5','6','7','8'],v:['1','2']},
   byPart=new Map(p.components.map(c=>[c.id,c]));
 for(const c of p.components)if(!validPins[c.id])validPins[c.id]=['1','2'];
 if(byPart.size!==p.components.length||p.wires.length!==shared.length+cfg.edges.length||
    p.wires.some(w=>!byPart.has(w.from.c)||!byPart.has(w.to.c)||
    !validPins[w.from.c].includes(w.from.p)||!validPins[w.to.c].includes(w.to.p)))
   throw Error('Active RC circuit invalid pins/wires '+id);
 l.project=p;l.kind='wiring';l.workspaceMode=p.workspaceMode;
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,why:c.tutorialPurpose}));
 l.summary='Kablolu sanal '+cfg.kind+' R-C ağı, 12 V beslemeli LM358P tamponu ve 6 V VREF ile onarıldı; yalnız ideal küçük işaret analizi.';
 l.explanation='FG1 sinüsü CIN ile 6 V sanal VREF çalışma noktasına kuplajlanır. '+
   'LM358P katalog PDIP-8: U1/8 +12 V, U1/4 0 V, U1/3 IN+, U1/1 OUT, U1/2 IN−. '+
   'U1/1 → U1/2 negatif geri besleme ile birim tampon sağlanır; kullanılmayan B kanalı '+
   'U1/5 → 0 V ve U1/7 → U1/6 bağlantısıyla kapatılır. V1, VREF e göre AC çıkışı gösterir. '+
   'Native yalnız ideal pasif R-C aktarımı ve birim tampon varsayımı kullanır; gerçek LM358P '+
   'bant genişliği, kararlılık, çıkış doyumu, distorsiyon, fiziksel cihaz veya Windows kabulü değildir.';
 l.learningGoal='LM358P gerçek katalog uçlarını, sanal VREF bias ve '+cfg.kind+' R-C frekans seçiciyi ayırabilmek.';
 l.beginnerSteps=['G1/12 V ile RA/RB 6 V VREF orta noktasını bul.',
   'FG1/OUT, CIN ve R-C terminal bağlantılarını izle.',
   'U1/3 giriş, U1/1 çıkış ve U1/2 negatif geri besleme yollarını göster.',
   'Kullanılmayan B kanalı U1/5 → 0 V ve U1/7 → U1/6 bağlantılarını kontrol et.',
   'V1 çıktısını VREF e göre yorumla; ideal AC sonucu fiziksel LM358P ölçümü sanma.'];
 l.safety='Yalnız düşük gerilimli sanal devre; fiziksel donanım veya güvenlik kabulü değildir.';
 l.pedagogyReview={...l.pedagogyReview,componentIds:p.components.map(c=>c.typeId),
   terminalGrounded:true,mq07ActiveFilterWiredBatch:'AG-20261022',
   titleTopologyStatus:'SOURCE_WIRED_NATIVE_IDEAL_FILTER',
   titleTopologyIssue:'LM358_PHYSICAL_AC_RESPONSE_PENDING',
   nativeIdealSmallSignalAcceptance:true,nativeDynamicAcceptance:false,
   frequencyResponseAcceptance:false,physicalAcceptance:false,
   windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
}
L._activeFilterWiredBatchAG=true;
})(typeof window==='undefined'?globalThis:window);