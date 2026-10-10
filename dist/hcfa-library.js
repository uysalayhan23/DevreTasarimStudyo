(function(root){
'use strict';
const lib=root.COMPONENT_LIBRARY;if(!Array.isArray(lib))return;
const P=(id,label,x,y,side,extra={})=>({id,label,x,y,side,...extra});
const cn1=[
 ['1','O4+'],['2','O3−'],['3','O3+'],['4','O2−'],['5','O2+'],['6','O1−'],['7','O1+'],['8','I4'],['9','I1'],['10','I2'],['11','COM1'],['12','—'],
 ['13','OUTZ'],['14','G24V'],['15','—'],['16','—'],['17','+24V'],['18','—'],['19','—'],['20','—'],['21','OUTA'],['22','/OUTA'],['23','/OUTB'],['24','/OUTZ'],
 ['25','OUTB'],['26','O4−'],['27','O5−'],['28','O5+'],['29','GND_OZ'],['30','I8'],['31','I7'],['32','I6'],['33','I5'],['34','I3'],['35','CC_P'],
 ['36','HPULS−'],['37','CMD_DIR+'],['38','HPULS+'],['39','/CMD_DIR'],['40','HSIGN+'],['41','CMD_PLS+'],['42','HSIGN−'],['43','/CMD_PLS'],['44','OZOUT']
];
const readableTerminalLabel=(side,size=7)=>({labelOffset:{x:side==='left'?-8:8,y:2},labelAnchor:side==='left'?'end':'start',labelSize:size});
const drivePins=[
 P('L1','L1 · 1~ 220V',0,230,'left',{signalType:'POWER',...readableTerminalLabel('left')}),P('L2','L2 · 1~ 220V',0,242,'left',{signalType:'POWER',...readableTerminalLabel('left')}),P('L3','L3 · bu modelde kullanılmaz',0,254,'left',{signalType:'POWER',...readableTerminalLabel('left')}),P('PE','PE/FG',84,230,'right',{signalType:'POWER',...readableTerminalLabel('right')}),
 P('P','P · rejeneratif direnç',0,266,'left',{signalType:'POWER',...readableTerminalLabel('left')}),P('C','C/B · rejeneratif direnç',0,278,'left',{signalType:'POWER',...readableTerminalLabel('left')}),
 P('U','U · motor',0,290,'left',{signalType:'POWER',...readableTerminalLabel('left')}),P('V','V · motor',0,302,'left',{signalType:'POWER',...readableTerminalLabel('left')}),P('W','W · motor',0,314,'left',{signalType:'POWER',...readableTerminalLabel('left')}),P('PE2','PE · motor',84,314,'right',{signalType:'POWER',...readableTerminalLabel('right')}),
 P('CN2','CN2 · 17-bit encoder',84,205,'right',{signalType:'ENC',...readableTerminalLabel('right')}),P('CN3','CN3 · USB/PC',84,228,'right',{signalType:'COM',...readableTerminalLabel('right')}),
 P('CN4:4','CN4-4 · 485+',84,245,'right',{signalType:'COM',...readableTerminalLabel('right')}),P('CN4:5','CN4-5 · 485−',84,255,'right',{signalType:'COM',...readableTerminalLabel('right')}),
 P('CN5:4','CN5-4 · 485+',84,265,'right',{signalType:'COM',...readableTerminalLabel('right')}),P('CN5:5','CN5-5 · 485−',84,275,'right',{signalType:'COM',...readableTerminalLabel('right')})
];
const cn1StartY=80,cn1StepY=5.4;
cn1.forEach(([id,label],i)=>{const left=i<22,idx=left?i:i-22,side=left?'left':'right';drivePins.push(P('CN1:'+id,'CN1-'+id+' '+label,left?0:84,cn1StartY+idx*cn1StepY,side,{block:'CN1',terminal:Number(id),signalType:/^I\d|CMD|PLS|DIR|HPULS|HSIGN|COM1|CC_P/.test(label)?'DI':/^O\d|OUT/.test(label)?'DO':/24V|G24|GND/.test(label)?'POWER':'IO',...readableTerminalLabel(side,6.2)}));});
const guide={
 purpose:'400 W HCFA X2E servo sistemi; SV-X2EA040A-A sürücü, uyumlu SV-X2MH040A-N2LN yüksek ataletli 400 W servo motoru pozisyon, hız veya tork modunda sürer.',
 usage:'Tek faz 200–240 VAC şebeke L1/L2 üzerinden beslenir. Motor U/V/W ve PE ile; 17-bit encoder CN2 ile bağlanır. CN1 üzerinden 24 V dijital I/O, pulse/direction ve ABZ çıkışları; CN4/CN5 üzerinden RS485/Modbus kullanılır.',
 connections:[
  ['L1 / L2','200–240 VAC tek faz ana devre beslemesi'],['L3','040A model tek faz kullanımında boş bırakılır'],['PE/FG','Koruma topraklaması'],['U / V / W','Servo motor güç çıkışı'],['CN2','Motor 17-bit encoder geri beslemesi'],['P / C','Harici rejeneratif direnç bağlantısı'],
  ['CN1-9 / 11','DI1 / COM1; S_ON için kullanılabilir'],['CN1-35','CC_P · 24 V pulse/direction ortak'],['CN1-43 / 39','NPN pulse / direction girişleri'],['CN1-41 / 37','PNP pulse / direction girişleri; dokümandaki 2,2 kΩ seri dirençli bağlantı'],['CN4/5 pin 4 / 5','RS485+ / RS485−']
 ],
 examples:['NPN 24 V pulse + direction konum kontrolü','16 kademeli dahili pozisyonlama','Modbus RTU hız kontrolü','HMI/Modbus tork kontrolü','Modbus konum kontrolü'],
 source:'X2E Series Servo Drive HW INS V2.2 + User Manual V2.0 + HCFA Türkiye uygulama notları'
};
if(!lib.some(d=>d.id==='hcfa-sv-x2ea040a-a'))lib.push({
 id:'hcfa-sv-x2ea040a-a',name:'HCFA SV-X2EA040A-A Servo Drive',brand:'HCFA',series:'X2E',model:'SV-X2EA040A-A · 400 W · 1~ 200–240 VAC',category:'Motor/Yük',catalogGroup:'drives',library:'Üretici cihazları',kind:'hcfa-servo-drive',hcfaDrive:true,liveMaterial:true,orientation:'front',transparentBody:true,preservePinGeometry:true,materialSymbol:false,designMaterial:false,refPrefix:'SD',w:84,h:330,pins:drivePins,physicalDimensionsMm:{width:42,height:165,depth:151,shape:'rect'},physicalScaleSource:'workspace-space-v1:user-locked',terminalGeometryStatus:'visual-calibrated',terminalLabelLayout:'outside-readable-v1',terminalLabelLayoutSource:'user-approved HCFA readable terminal arrangement · 2026-10-08',
 deviceGuide:guide,documented:true,terminalSource:'X2E HW INS V2.2 · CN1 terminal arrangement; HCFA X2EA-A pulse control · p.3',materialAsset:'hcfa-x2ea040a-front',productVisualExact:true,productVisualType:'user-approved-photo',productVisualSource:'Kullanıcı tarafından 2026-10-07 yüklenen doğru HCFA GX/X2E önden ürün görseli',
 driveSpec:{powerW:400,input:'1~ 200–240 VAC ±10%, 50/60 Hz',frame:'B',dimensionsMm:[42,165,151],weightKg:.9,controlModes:6}
});
if(!lib.some(d=>d.id==='hcfa-sv-x2mh040a-n2ln'))lib.push({
 id:'hcfa-sv-x2mh040a-n2ln',name:'HCFA SV-X2MH040A-N2LN Servo Motor',brand:'HCFA',series:'X2MH',model:'400 W · 3000 rpm · 1,27 N·m · 17-bit encoder · frensiz',category:'Motor/Yük',catalogGroup:'motors',library:'Üretici cihazları',kind:'servo-motor',hcfaServoMotor:true,rotating:true,liveMaterial:true,orientation:'front',preservePinGeometry:true,materialSymbol:false,designMaterial:false,refPrefix:'M',w:324.4,h:120,physicalDimensionsMm:{width:162.2,height:60,bodyLength:122.7,frontOffset:6.5,shaftShoulder:3,shaftLength:30,shaftDiameter:14,pilotDiameter:50,shape:'servo-motor-side'},physicalScaleSource:'workspace-space-v1:user-locked',
 pins:[P('U','U · güç konnektörü',222,0,'top',{signalType:'POWER',labelOffset:{x:-10,y:14},labelAnchor:'end'}),P('V','V · güç konnektörü',232,0,'top',{signalType:'POWER',labelOffset:{x:-10,y:30},labelAnchor:'end'}),P('W','W · güç konnektörü',242,0,'top',{signalType:'POWER',labelOffset:{x:10,y:14},labelAnchor:'start'}),P('PE','PE · güç konnektörü',252,0,'top',{signalType:'POWER',labelOffset:{x:10,y:30},labelAnchor:'start'}),P('ENC','Encoder · 17-bit',292,0,'top',{signalType:'ENC',labelOffset:{x:10,y:46},labelAnchor:'start'})],
 materialAsset:'hcfa-x2mh040-front',productVisualExact:true,productVisualType:'user-approved-photo',productVisualSource:'Kullanıcı tarafından 2026-10-07 yüklenen doğru HCFA servo motor yan görünüşü',documented:true,terminalSource:'SV-X2E User Manual V2.0 · drive/motor combination and motor specification tables',
 motorSpec:{powerW:400,ratedTorque:1.27,peakTorque:4.46,ratedCurrent:2.1,peakCurrent:10.4,ratedRpm:3000,maxRpm:5000,encoderBits:17,encoder:'Serial EIA422',brake:false,flangeMm:60,massKg:1.22},
 deviceGuide:{purpose:'SV-X2EA040A-A ile eşleştirilmiş 400 W yüksek ataletli AC servo motor.',usage:'U/V/W güç kablosu ve PE ile sürücüye, encoder kablosu ENC↔CN2 ile bağlanır. N2LN model kodunda elektromanyetik fren yoktur.',connections:[['U/V/W','Sürücü üç faz PWM motor çıkışı'],['PE','Motor gövde koruma toprağı'],['ENC','17-bit seri encoder geri besleme kablosu']],examples:['Pulse/direction pozisyonlama','Hız kontrolü','Tork kontrolü'],source:'SV-X2E Series Servo Drive User Manual V2.0'}
});
if(!lib.some(d=>d.id==='hcfa-pulse-source'))lib.push({
 id:'hcfa-pulse-source',name:'Pulse / Direction Test Kaynağı',model:'24 V NPN · PLC/PTO eğitim kaynağı',category:'PLC/Otomasyon',catalogGroup:'technology',kind:'hcfa-pulse-source',hcfaPulseSource:true,liveMaterial:true,orientation:'front',w:220,h:150,refPrefix:'PG',
 pins:[P('24V','+24 V',0,35,'left'),P('0V','0 V',0,115,'left'),P('PULSE','PULSE',220,45,'right'),P('DIR','DIR',220,105,'right')],
 pulseHz:1000,pulseDirection:1,deviceGuide:{purpose:'HCFA pulse/direction örneklerini gerçek kablo düzeniyle deneyebilmek için eğitim amaçlı PTO kaynağıdır.',usage:'PULSE ve DIR çıkışlarını HCFA CN1 pulse girişlerine bağlayın; frekans motor hızını, DIR yönü belirler.',connections:[['PULSE','Darbe treni'],['DIR','Yön komutu'],['24V/0V','Kontrol beslemesi']],source:'HCFA X2EA-A pulse control application note'}
});

if(!lib.some(d=>d.id==='hcfa-modbus-master'))lib.push({
 id:'hcfa-modbus-master',name:'HCFA Modbus RTU Test Master',model:'RS485 · HMI/PC eğitim masterı',category:'PLC/Otomasyon',catalogGroup:'communication',kind:'hcfa-modbus-master',hcfaModbusMaster:true,liveMaterial:true,orientation:'front',w:240,h:150,refPrefix:'HMI',
 pins:[P('485+','485+',240,50,'right'),P('485-','485−',240,105,'right')],
 deviceGuide:{purpose:'HCFA X2E Modbus örneklerinde CN4/CN5 RS485 hattını fiziksel olarak göstermek için eğitim masterıdır.',usage:'485+ → CN4/5 pin 4, 485− → pin 5. Register yazma/okuma HCFA sürücü parametre penceresindeki Modbus sekmesinden yapılır.',connections:[['485+','EIA485 pozitif hat'],['485−','EIA485 negatif hat']],source:'HCFA Türkiye X2E/X3E ModBusRTU haberleşme notu'}
});
})(typeof window==='undefined'?globalThis:window);
