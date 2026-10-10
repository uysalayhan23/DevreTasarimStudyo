(function(root){
'use strict';
const lib=root.COMPONENT_LIBRARY;if(!Array.isArray(lib))return;
const P=(id,label,x,y,side,extra={})=>({id,label,x,y,side,...extra});
function add(d){if(!lib.some(x=>x.id===d.id))lib.push(d)}
add({
 id:'bd139-npn',name:'BD139 NPN Transistör',model:'BD139 · NPN · 80 V · 1.5 A · SOT-32/TO-126',brand:'STMicroelectronics',category:'Yarı İletkenler',catalogGroup:'electronics-semiconductors',kind:'bjt-npn',liveMaterial:true,materialSymbol:false,refPrefix:'Q',w:150,h:120,
 pins:[P('B','1 · B',0,60,'left'),P('C','2 · C',150,28,'right'),P('E','3 · E',150,92,'right')],
 transistorType:'NPN',pinout:{B:1,C:2,E:3},productVisualUrl:'https://www.vistronica.com/23503-large_default/transistor-npn-bd139-80v-15a-to-126.jpg',productVisualExact:true,productVisualSource:'Gerçek BD139 ürün fotoğrafı · Vistronica; STMicroelectronics BD139 SOT-32 datasheet pinout doğrulaması',datasheetUrl:'https://www.st.com/en/power-transistors/bd139.html'
});
add({
 id:'bd140-pnp',name:'BD140 PNP Transistör',model:'BD140 · PNP · 80 V · 1.5 A · SOT-32/TO-126',brand:'STMicroelectronics',category:'Yarı İletkenler',catalogGroup:'electronics-semiconductors',kind:'bjt-pnp',liveMaterial:true,materialSymbol:false,refPrefix:'Q',w:150,h:120,
 pins:[P('B','1 · B',0,60,'left'),P('C','2 · C',150,28,'right'),P('E','3 · E',150,92,'right')],
 transistorType:'PNP',pinout:{B:1,C:2,E:3},productVisualUrl:'https://www.vistronica.com/21851-large_default/transistor-pnp-bd140-to-126.jpg',productVisualExact:true,productVisualSource:'Gerçek BD140 ürün fotoğrafı · Vistronica; STMicroelectronics BD140 SOT-32 datasheet pinout doğrulaması',datasheetUrl:'https://www.st.com/en/power-transistors/bd140.html'
});
add({
 id:'lm358p-opamp-a',name:'LM358P İşlemsel Yükselteç · A',model:'LM358P · Dual Op-Amp · Unit A · PDIP-8',brand:'Texas Instruments',category:'Yarı İletkenler',catalogGroup:'electronics-ics',kind:'opamp',liveMaterial:true,materialSymbol:false,refPrefix:'U',w:180,h:130,
 pins:[P('IN+','3 · IN+',0,42,'left'),P('IN-','2 · IN−',0,88,'left'),P('OUT','1 · OUT',180,65,'right'),P('V+','8 · V+',90,0,'top'),P('V-','4 · V−',90,130,'bottom')],
 opampUnit:'A',openLoopGain:100000,outputResistance:20,productVisualUrl:'https://aionfx.com/app/files/components/texas-instruments-lm358p.jpg',productVisualExact:true,productVisualSource:'Gerçek Texas Instruments LM358P PDIP-8 fotoğrafı · Aion FX; TI LM358 datasheet pinout ve paket doğrulaması',datasheetUrl:'https://www.ti.com/lit/ds/symlink/lm358.pdf'
});
add({
 id:'ldr-gl5528',name:'GL5528 LDR Foto Direnç',model:'GL5528 · CdS · 10–20 kΩ @ 10 lux · ≥1 MΩ karanlık',category:'Sensörler',catalogGroup:'sensors',kind:'ldr',liveMaterial:true,materialSymbol:false,refPrefix:'R',w:150,h:110,
 pins:[P('1','1',0,55,'left'),P('2','2',150,55,'right')],illuminationLux:10,r10:15000,gamma:.6,darkResistance:1000000,
 productVisualUrl:'https://i.ebayimg.com/images/g/t34AAOSwEbdnGz1Z/s-l960.jpg',productVisualExact:true,productVisualSource:'Gerçek GL5528 foto direnç ürün fotoğrafı; GL5528 datasheet 10–20 kΩ @10 lux / 1 MΩ dark doğrulaması',datasheetUrl:'https://cdn.sparkfun.com/datasheets/Sensors/LightImaging/SEN-09088.pdf'
});
})(typeof window==='undefined'?globalThis:window);
