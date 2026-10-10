(function(root){
'use strict';
const lib=root.COMPONENT_LIBRARY;if(!Array.isArray(lib))return;
const P=(id,label,x,y,side,extra={})=>({id,label,x,y,side,...extra});
const pinRows=(w,h,top,bottom)=>[...top.map((id,i)=>P(id,id,24+i*((w-48)/Math.max(1,top.length-1)),0,'top',{labelOffset:{x:0,y:14},labelSize:6})),...bottom.map((id,i)=>P(id,id,24+i*((w-48)/Math.max(1,bottom.length-1)),h,'bottom',{labelOffset:{x:0,y:-10},labelSize:6}))];
const out=pairs=>pairs.map(([a,b,normal='NO',role='safety'])=>({a,b,normal,role}));
const guide=(purpose,usage,connections,source,examples=[])=>({purpose,usage,connections,source,examples});
const common={brand:'DOLD',series:'SAFEMASTER',category:'Emniyet',catalogGroup:'safety',kind:'dold-safety-relay',doldSafety:true,liveMaterial:true,orientation:'front',materialSymbol:false,designMaterial:false,refPrefix:'KSR',searchTerms:'DOLD SAFEMASTER safety relay emniyet rölesi acil stop güvenlik rölesi',standard:'Üretici dokümanı',library:'Üretici cihazları',productVisualExact:true,productVisualType:'manufacturer-referenced-orthographic-front',schematicExact:true,schematicLiveContacts:true};
function add(d){if(!lib.some(x=>x.id===d.id))lib.push({...common,...d})}

add({id:'dold-bg5933-22',name:'DOLD SAFEMASTER BG 5933.22/61',productVisualSource:'BG5933_DB(1).pdf · DOLD üretici ürün görseli + resmî ürün sayfası referansı',model:'İki el emniyet rölesi · DC 24 V · 2NO+1NC · 22,5 mm',w:300,h:245,doldAsset:'assets/dold/bg5933-front.png',doldSchematic:'assets/dold/bg5933-schematic.png',
 pins:pinRows(300,245,['A1','S22','Y1','Y2','13','23','31'],['A2','S12','S11','S21','14','24','32']),doldPowerPairs:[['A1','A2']],doldOutputs:out([['13','14'],['23','24'],['31','32','NC','indicator']]),
 doldLogic:{type:'twohand',simultaneityMs:500,plusOutputs:['S12'],zeroOutputs:['S22'],feedbackOut:'Y1',feedbackIn:'Y2',channels:[{pin:'S11',bus:'plus'},{pin:'S21',bus:'zero'}]},
 deviceGuide:guide('İki el kumandasında tehlikeli hareketi ancak iki buton en fazla 0,5 s farkla birlikte çalıştırıldığında serbest bırakır.','Pres ve tehlikeli kapanma hareketli makinelerde iki el emniyet kumandası; Y1–Y2 ile harici zorlamalı kontaktör geri beslemesi izlenir.',[['A1/A2','Cihaz beslemesi'],['S12','1. kanal + test çıkışı'],['S22','2. kanal 0 V test çıkışı'],['S11/S21','İki el kanalı geri dönüş girişleri'],['Y1–Y2','Harici kontaktör geri besleme çevrimi'],['13–14 / 23–24','Güvenlik NO çıkışları'],['31–32','NC bildirim çıkışı']],'BG5933_DB(1).pdf · s.5–9, 41',['İki el kumandası','İki el + kontaktör geri besleme'])});

add({id:'dold-bh5933-48',name:'DOLD SAFEMASTER BH 5933.48/61',productVisualSource:'BG5933_DB(1).pdf · DOLD üretici ürün görseli + resmî ürün sayfası referansı',model:'İki el emniyet rölesi · 3NO+1NC · 45 mm',w:330,h:265,doldAsset:'assets/dold/bh5933-front.png',doldSchematic:'assets/dold/bh5933-schematic.png',
 pins:pinRows(330,265,['A1','S12','S23','13','23','33','Y1','Y2'],['A2','S13','S22','S11','S21','14','24','34','41','42']),doldPowerPairs:[['A1','A2']],doldOutputs:out([['13','14'],['23','24'],['33','34'],['41','42','NC','indicator']]),
 doldLogic:{type:'twohand',simultaneityMs:500,plusOutputs:['S12','S23'],zeroOutputs:['S13','S22'],feedbackOut:'Y1',feedbackIn:'Y2',channels:[{pin:'S11',bus:'plus'},{pin:'S21',bus:'zero'}]},
 deviceGuide:guide('45 mm gövdeli, üç güvenlik NO çıkışlı iki el emniyet rölesidir.','İki el kumandası ve daha fazla güvenlik çıkışı gereken uygulamalar; Y1–Y2 geri besleme ile harici kontaktörler izlenir.',[['A1/A2','Besleme'],['S12/S13','1. buton test kaynakları'],['S23/S22','2. buton test kaynakları'],['S11/S21','İki el kanalı geri dönüşleri'],['Y1–Y2','Geri besleme'],['13–14 / 23–24 / 33–34','Güvenlik NO çıkışları'],['41–42','NC bildirim çıkışı']],'BG5933_DB(1).pdf · s.5–9, 41',['İki el kumandası + harici kontaktör'])});

add({id:'dold-bn5930-48',name:'DOLD SAFEMASTER BN 5930.48',productVisualSource:'BN5930_48_DB(1).pdf · DOLD üretici ürün görseli + resmî ürün sayfası referansı',model:'Not-Aus modülü · 3NO+1NC · 100 mm',w:480,h:270,doldAsset:'assets/dold/bn5930-front.png',doldSchematic:'assets/dold/bn5930-schematic.png',
 pins:pinRows(480,270,['A1','T11','T12','T22','13','23','33','41'],['PE','T33','T34','X1','X2','14','24','34','42','A2']),doldPowerPairs:[['A1','A2']],doldOutputs:out([['13','14'],['23','24'],['33','34'],['41','42','NC','indicator']]),doldStartMode:'manual',
 doldLogic:{type:'estop',plusOutputs:['T11'],startOut:'T11',startIn:'T34',feedbackOut:'X1',feedbackIn:'X2',channels:[{pin:'T12',mode:'supply',source:'A1'},{pin:'T22',mode:'supply',source:'A1'}]},
 deviceGuide:guide('Acil durdurma veya koruyucu kapı devresini bir ya da iki kanallı değerlendirerek üç zorlamalı güvenlik kontağıyla güvenli kesme sağlar.','Not-Aus, kayar koruyucu kapı ve harici kontaktör çoğaltması. X1–X2 harici kontaktör geri beslemesidir.',[['A1/A2','Cihaz beslemesi'],['PE','IT şebeke/referans bağlantısı'],['T12/T22','Emniyet kanalı girişleri'],['T11/PE/T34','Kontrol çıkışları'],['X1–X2','Harici kontaktör geri beslemesi'],['13–14 / 23–24 / 33–34','Güvenlik NO çıkışları'],['41–42','Yalnız bildirim için NC çıkış']],'BN5930_48_DB(1).pdf · s.5–8, 25',['İki kanallı Not-Aus','Tek kanallı Not-Aus','Harici kontaktör geri besleme'])});

function bo(id,name,variant,schem,pairs,indicator,delayed){
 add({id,name,productVisualSource:'BO5988_DB(1).pdf · DOLD üretici ürün görseli + resmî ürün sayfası referansı',model:'Not-Aus modülü · '+variant+' · 100 mm',w:500,h:285,doldAsset:'assets/dold/bo5988-front.png',doldSchematic:schem,
  pins:pinRows(500,285,['A1','S11','S12','S21','S22','S23','13','23','33',...(pairs.length>3?['43','53','63']:[]),...(delayed?['77']:[]),...(indicator?[indicator[0]]:[])],['A2','A3+','A4','Y1','Y2','X1','X2','X5','X6','14','24','34',...(pairs.length>3?['44','54','64']:[]),...(delayed?['78']:[]),...(indicator?[indicator[1]]:[])]),
  doldPowerPairs:[['A1','A2'],['A3+','A4']],doldOutputs:out([...pairs,...(indicator?[indicator]:[]),...(delayed?[['77','78','NO','delayed']]:[])]),doldOffDelayPair:delayed?['77','78']:null,doldOffDelaySeconds:1,doldStartMode:'manual',
  doldLogic:{type:'estop',plusOutputs:['S11'],zeroOutputs:['S21'],startOut:'Y1',startIn:'Y2',feedbackOut:'X1',feedbackIn:'X2',crossCheck:true,channels:[{pin:'S12',bus:'plus'},{pin:'S22',bus:'zero'}]},
  deviceGuide:guide('İki kanallı Not-Aus ve koruyucu kapı devrelerinde güvenli kesme yapan SAFEMASTER modülüdür.','Manuel/otomatik start, X1–X2 geri besleme ve çapraz kısa devre izleme. '+(delayed?'77–78 NO çıkışı enerjinin kesilmesinden sonra ayarlı süre boyunca gecikmeli bırakır.':''),
  [['A1/A2 veya A3+/A4','Tek/çift besleme varyantına göre cihaz beslemesi'],['S11/S21','Kanal test kaynakları'],['S12/S22/S23','Emniyet kanalı girişleri'],['Y1–Y2','Manuel start çevrimi'],['X5–X6','Otomatik start seçimi/köprüsü'],['X1–X2','Harici kontaktör geri beslemesi'],['13…63 / 14…64','Güvenlik NO çıkışları'],[indicator?indicator[0]+'–'+indicator[1]:'81–82','Yalnız bildirim kontağı'],...(delayed?[['77–78','Gecikmeli güvenlik NO çıkışı']]:[])],'BO5988_DB(1).pdf · s.5–10, 41',['İki kanallı Not-Aus','Koruyucu kapı','Harici kontaktör geri besleme'])});
}
bo('dold-bo5988-61','DOLD SAFEMASTER BO 5988.61','6NO + 1NC bildirim','assets/dold/bo5988-61-schematic.png',[['13','14'],['23','24'],['33','34'],['43','44'],['53','54'],['63','64']],['81','82','NC','indicator'],false);
bo('dold-bo5988-62','DOLD SAFEMASTER BO 5988.62','6NO + 1NO bildirim','assets/dold/bo5988-62-schematic.png',[['13','14'],['23','24'],['33','34'],['43','44'],['53','54'],['63','64']],['83','84','NO','indicator'],false);
bo('dold-bo5988-47','DOLD SAFEMASTER BO 5988.47','3NO + 1NC + 77–78 gecikmeli NO','assets/dold/bo5988-47-schematic.png',[['13','14'],['23','24'],['33','34']],['81','82','NC','indicator'],true);

function lg(id,name,variant,schem,outputs){
 add({id,name,productVisualSource:'LG5925_920_DB(1).pdf · DOLD üretici ürün görseli + resmî ürün sayfası referansı',model:'Güvenlik şalteri rölesi · '+variant+' · DC 24 V · 22,5 mm',w:300,h:260,doldAsset:'assets/dold/lg5925-front.png',doldSchematic:schem,
  pins:pinRows(300,260,['A1','S11','S12','S22','S33','S34',...outputs.map(x=>x[0])],['A2','S21',...outputs.map(x=>x[1])]),doldPowerPairs:[['A1','A2']],doldOutputs:out(outputs),doldStartMode:'manual',
  doldLogic:{type:'guard',plusOutputs:['S11'],zeroOutputs:['S21'],startOut:'S33',startIn:'S34',crossCheck:true,channels:[{pin:'S12',bus:'plus'},{pin:'S22',bus:'zero'}]},
  deviceGuide:guide('Kodlu manyetik emniyet şalterini veya koruyucu kapı kontaklarını iki kanallı değerlendirerek tehlikeli hareketi güvenli biçimde keser.','Kayar koruyucu kapılar ve yakma sistemleri; S1 ile çapraz kısa devre, S2 ile manuel/otomatik start seçimi dokümanda tanımlıdır.',
  [['A1/A2','DC 24 V besleme'],['S11/S21','İki kanalın test çıkışları'],['S12/S22','Emniyet kanalı girişleri'],['S33–S34','Start çevrimi'],...outputs.map(x=>[x[0]+'–'+x[1],x[2]==='NC'?'Yalnız bildirim için NC çıkış':'Güvenlik NO çıkışı'])],'LG5925_920_DB(1).pdf · s.5–8, 25–26',['NE 5021 ile koruyucu kapı','6× NE 5021 + Not-Aus'])});
}
lg('dold-lg5925-02','DOLD SAFEMASTER LG 5925.02/920','2NO','assets/dold/lg5925-02-schematic.png',[['13','14'],['23','24']]);
lg('dold-lg5925-04','DOLD SAFEMASTER LG 5925.04/920','4NO','assets/dold/lg5925-04-schematic.png',[['13','14'],['23','24'],['33','34'],['43','44']]);
lg('dold-lg5925-48','DOLD SAFEMASTER LG 5925.48/920/61','3NO + 1NC','assets/dold/lg5925-48-schematic.png',[['13','14'],['23','24'],['33','34'],['41','42','NC','indicator']]);

if(!lib.some(x=>x.id==='dold-ne5021-02'))lib.push({id:'dold-ne5021-02',brand:'DOLD',series:'SAFEMASTER',category:'Sensörler',catalogGroup:'safety',name:'DOLD NE 5021.02 Kodlu Manyetik Emniyet Şalteri',model:'2NO reed · 0054695',kind:'switch-both',contacts:[{id:'ch1',a:'13',b:'14',normal:'NO'},{id:'ch2',a:'23',b:'24',normal:'NO'}],interactive:true,controlMode:'toggle',doldNe5021:true,liveMaterial:true,orientation:'front',w:250,h:100,pins:[P('13','13',0,28,'left'),P('14','14',250,28,'right'),P('23','23',0,72,'left'),P('24','24',250,72,'right')],doldAsset:'assets/dold/ne5021-doc.png',deviceGuide:guide('LG 5925/920 dokümanında aksesuar olarak verilen kodlu manyetik emniyet şalteridir; iki bağımsız NO reed güvenlik kontağı sağlar.','Koruyucu kapı/ızgara konumunu iki kanallı izlemek için kullanılır. Simülasyonda tıklama kapının/mıknatısın güvenli konumunu değiştirir.',[['13–14','1. NO reed kanalı'],['23–24','2. NO reed kanalı']],'LG5925_920_DB(1).pdf · s.25',['LG 5925 + NE 5021'])});

if(!lib.some(x=>x.id==='safety-button-2no2nc'))lib.push({id:'safety-button-2no2nc',category:'Kumanda',catalogGroup:'buttons',name:'İki El Emniyet Butonu',model:'Mekanik bağlı 1NO + 1NC',kind:'switch-both',contacts:[{id:'no',a:'13',b:'14',normal:'NO'},{id:'nc',a:'21',b:'22',normal:'NC'}],interactive:true,controlMode:'momentary',w:120,h:100,pins:[P('13','13',0,25,'left'),P('14','14',120,25,'right'),P('21','21',0,75,'left'),P('22','22',120,75,'right')],searchTerms:'two hand safety button 1NO 1NC iki el butonu'});
if(!lib.some(x=>x.id==='safety-estop-2nc'))lib.push({id:'safety-estop-2nc',category:'Kumanda',catalogGroup:'buttons',name:'2 Kanallı Acil Stop',model:'Mekanik bağlı 2NC',kind:'switch-both',contacts:[{id:'ch1',a:'11',b:'12',normal:'NC'},{id:'ch2',a:'21',b:'22',normal:'NC'}],interactive:true,controlMode:'toggle',w:120,h:100,pins:[P('11','11',0,25,'left'),P('12','12',120,25,'right'),P('21','21',0,75,'left'),P('22','22',120,75,'right')],searchTerms:'dual channel emergency stop 2NC two channel not aus'});

const buttonUnitsPerMm=Number(root.DTSWorkspaceSpace?.sceneUnitsPerMm)||2;
function scaleSafetyButton(id,widthMm,heightMm,diameterMm,materialAsset){
 const d=lib.find(x=>x&&x.id===id);if(!d)return;
 const oldW=Number(d.w),oldH=Number(d.h),newW=widthMm*buttonUnitsPerMm,newH=heightMm*buttonUnitsPerMm,sx=newW/oldW,sy=newH/oldH;
 const scalePins=pins=>Array.isArray(pins)?pins.map(p=>({...p,x:Number(p.x)*sx,y:Number(p.y)*sy})):pins;
 d.w=newW;d.h=newH;d.pins=scalePins(d.pins);if(Array.isArray(d.materialPins))d.materialPins=scalePins(d.materialPins);
 d.physicalDimensionsMm={width:widthMm,height:heightMm,shape:'rect'};
 d.physicalScaleSource='workspace-space-v1:user-locked';d.visualAssetPreserved=true;
 d.buttonActuatorDiameterMm=diameterMm;d.buttonActuatorDiameterScene=diameterMm*buttonUnitsPerMm;d.buttonActuatorScaleSource='workspace-space-v1:user-locked';
 d.materialAsset=materialAsset;d.liveMaterial=true;d.materialSymbol=false;d.designMaterial=false;d.orientation='front';
}
scaleSafetyButton('safety-estop-2nc',36,46,29,'emergency-stop');
scaleSafetyButton('safety-button-2no2nc',36,46,29,'green-pushbutton');

const enc=lib.find(x=>x.id==='encoder-incremental');if(enc){enc.deviceGuide=guide('38 mm gövdeli, 6 mm milli A/B/Z fotoelektrik artımlı enkoder; iki faz 90° quadrature ve tur başına Z indeks darbesi üretir.','5–24 VDC NPN open-collector çıkışlıdır. Arduino girişlerinde INPUT_PULLUP/harici pull-up ile; PLC ve kumanda girişlerinde uygun pull-up ile kullanılır.',[['RED / +V / Pin 1','5–24 VDC besleme'],['BLACK / 0V / Pin 4','Ortak 0 V'],['GREEN / A / Pin 5','Quadrature A çıkışı'],['WHITE / B / Pin 3','Quadrature B çıkışı'],['YELLOW / Z / Pin 8','Tur başına indeks çıkışı'],['SHIELD / Pin 9','Kablo ekranı']],'Photoelectric Incremental Rotary Encoder(1).pdf · s.1',['Arduino interrupt ile sayım','24 V kumanda A/B/Z gözlemleme']);enc.schematicExact=true}
})(typeof window==='undefined'?globalThis:window);
