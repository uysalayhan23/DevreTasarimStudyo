(function(root){
'use strict';
const lib=root.COMPONENT_LIBRARY;if(!Array.isArray(lib))return;
const P=(id,label,x,y,side,extra={})=>({id,label,x,y,side,...extra});
function add(d){if(!lib.some(x=>x.id===d.id))lib.push(d)}
add({
 id:'bd139-npn',name:'BD139 NPN Transistör',model:'BD139 · NPN · 80 V · 1.5 A · SOT-32/TO-126',brand:'STMicroelectronics',category:'Yarı İletkenler',catalogGroup:'electronics-semiconductors',kind:'bjt-npn',liveMaterial:true,materialSymbol:false,arduinoShared:true,refPrefix:'Q',w:150,h:145,
 pins:[P('B','1 · B',38,145,'bottom',{physicalPin:1}),P('C','2 · C',75,145,'bottom',{physicalPin:2}),P('E','3 · E',112,145,'bottom',{physicalPin:3})],
 transistorType:'NPN',pinout:{B:1,C:2,E:3},realPackage:{type:'TO-126',pins:3,marking:'BD139',topView:true,orthographic:true,transparentBackground:true},productVisualSource:'STMicroelectronics BD139 SOT-32/TO-126 datasheet package reference',datasheetUrl:'https://www.st.com/en/power-transistors/bd139.html'
});
add({
 id:'bd140-pnp',name:'BD140 PNP Transistör',model:'BD140 · PNP · 80 V · 1.5 A · SOT-32/TO-126',brand:'STMicroelectronics',category:'Yarı İletkenler',catalogGroup:'electronics-semiconductors',kind:'bjt-pnp',liveMaterial:true,materialSymbol:false,arduinoShared:true,refPrefix:'Q',w:150,h:145,
 pins:[P('B','1 · B',38,145,'bottom',{physicalPin:1}),P('C','2 · C',75,145,'bottom',{physicalPin:2}),P('E','3 · E',112,145,'bottom',{physicalPin:3})],
 transistorType:'PNP',pinout:{B:1,C:2,E:3},realPackage:{type:'TO-126',pins:3,marking:'BD140',topView:true,orthographic:true,transparentBackground:true},productVisualSource:'STMicroelectronics BD140 SOT-32/TO-126 datasheet package reference',datasheetUrl:'https://www.st.com/en/power-transistors/bd140.html'
});
add({
 id:'lm358p-opamp-a',name:'LM358P İşlemsel Yükselteç · A · ESKİ PROJE UYUMU',model:'LM358P · legacy unit alias',brand:'Texas Instruments',category:'Yarı İletkenler',catalogGroup:'electronics-ics',kind:'opamp',liveMaterial:true,materialSymbol:false,catalogHidden:true,legacyAliasTo:'lm358p-dip8',refPrefix:'U',w:180,h:130,
 pins:[P('IN+','3 · IN+',0,42,'left'),P('IN-','2 · IN−',0,88,'left'),P('OUT','1 · OUT',180,65,'right'),P('V+','8 · V+',90,0,'top'),P('V-','4 · V−',90,130,'bottom')],
 opampUnit:'A',openLoopGain:100000,outputResistance:20,productVisualUrl:'https://aionfx.com/app/files/components/texas-instruments-lm358p.jpg',productVisualExact:true,productVisualSource:'Gerçek Texas Instruments LM358P PDIP-8 fotoğrafı · Aion FX; TI LM358 datasheet pinout ve paket doğrulaması',datasheetUrl:'https://www.ti.com/lit/ds/symlink/lm358.pdf'
});
add({
 id:'ldr-gl5528',name:'GL5528 LDR Foto Direnç',model:'GL5528 · CdS · 10–20 kΩ @ 10 lux · ≥1 MΩ karanlık',category:'Sensörler',catalogGroup:'sensors',kind:'ldr',liveMaterial:true,materialSymbol:false,arduinoShared:true,refPrefix:'R',w:140,h:135,
 pins:[P('1','1',48,135,'bottom',{physicalPin:1}),P('2','2',92,135,'bottom',{physicalPin:2})],illuminationLux:10,r10:15000,gamma:.6,darkResistance:1000000,
 realPackage:{type:'LDR-5MM',pins:2,marking:'GL5528',topView:true,orthographic:true,transparentBackground:true},productVisualSource:'GL5528 package-faithful top-view renderer; electrical values from datasheet',datasheetUrl:'https://cdn.sparkfun.com/datasheets/Sensors/LightImaging/SEN-09088.pdf'
});
})(typeof window==='undefined'?globalThis:window);
