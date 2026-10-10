(function(root){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(d,c={}){
  const f=d.plcFront;if(!f)return '';
  const w=d.w,h=d.h,uid='plc-'+String(c.id||d.id).replace(/[^\w-]/g,'_'),runtime=c._plcRuntime||{inputs:{},outputs:{}};
  const text=(x,y,s,size=8,color='#e4e9e9',anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" font-family="Arial,sans-serif" fill="${color}" stroke="none" text-anchor="${anchor}">${esc(s)}</text>`;
  const rect=(x,y,a,b,fill,stroke='#151b1c',r=1)=>`<rect x="${x}" y="${y}" width="${a}" height="${b}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width=".8"/>`;
  const photo=(typeof module==='object'&&module.exports?require('./plc-photo-data.js'):root.DTSPLCPhotoData)?.[d.id];
  let s='';if(photo&&f.family!=='siemens-s71200'){const P=typeof module==='object'&&module.exports?require('./photo-plane.js'):root.DTSPhotoPlane;s=P.markup(photo.file,photo.width,photo.height,photo.quad,5,5,w-10,f.family==='delta-se'?h-50:h-10,uid);if(f.family==='delta-se')s+=rect(5,h-44,w-10,39,'#e9edf0')+text(w/2,h-34,'ALT YÜZ BAĞLANTILARI',4.5,'#345','middle');}else{
  s=`<defs><linearGradient id="${uid}-case" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#363d3f"/><stop offset=".5" stop-color="#52595b"/><stop offset="1" stop-color="#303739"/></linearGradient></defs>`;
  if(f.family==='delta-se'){
   const small=f.size===12;
   s+=rect(5,5,w-10,h-50,'#e3e4df','#777d7e',2)+rect(w-20,9,14,h-58,'#9fa6a5','#6f7979');
   s+=text(14,small?220:213,'DELTA',10,'#167b9e')+text(14,small?231:224,d.part,6,'#47565c');
   for(const [i,label] of ['POWER','RUN','ERROR',small?'COM1':'USB','COM2'].entries())s+=`<circle cx="15" cy="${20+i*10}" r="2" fill="#627e63"/>`+text(21,22+i*10,label,4,'#455051');
   const runX=small?32:w-35,runY=small?106:245;
   s+=`<circle cx="${runX}" cy="${runY}" r="8" fill="#727b7a" stroke="#354445"/><path d="M${runX} ${runY-5}v10" stroke="#d4d8d7" stroke-width="3"/>`+text(runX,runY+15,'RUN/STOP',4,'#3e4c51','middle');
   const usbX=small?24:45,usbY=small?137:181;
   s+=rect(usbX,usbY,14,18,'#aeb6b4','#536467')+rect(usbX+3,usbY+3,8,12,'#293537')+text(usbX,usbY+26,'USB',4,'#34494f');
   const ethX=small?23:60,ethY=235;
   s+=rect(ethX,ethY,32,27,'#b5bdb9','#5a6869')+rect(ethX+4,ethY+4,24,16,'#253333')+rect(ethX+10,ethY+18,12,6,'#253333')+text(ethX,ethY+34,'ETHERNET',4,'#34494f');
   s+=rect(6,h-42,w-12,39,'#e9edf0','#98a5ab')+text(w/2,h-31,'ALT YÜZ BAĞLANTILARI',4.5,'#3c5665','middle');
  }else if(f.family==='gmt-gxm'){
   s+=rect(5,5,w-10,h-10,'#34383e','#1b2229',3)+rect(8,8,17,h-16,'#3e434a','#3e434a',1);
   s+=text(13,129,'GMT',11,'#e3e5e6')+text(13,139,'CNT',8,'#c3c9cd')+text(w-8,141,d.part,5,'#f1f3f4','end');
   s+=`<circle cx="14" cy="15" r="2" fill="#6da980"/><circle cx="73" cy="15" r="1.5" fill="#687d6c"/>`;
   for(let i=0;i<(f.statusChannels||0);i++)s+=text(69,31+i*9,'CH'+i,4,'#cfd6d9','end')+`<circle cx="73" cy="${29+i*9}" r="1.5" fill="#644445"/>`;
  }else if(f.family==='siemens-s71200'){
   // Orthographic front elevation. The user's example PLC defines the presentation style only;
   // connector count/order comes exclusively from the model-specific X10/X11/X12 data.
   const caseFill='#718094',coverFill='#748397',hinge='#586777',ink='#edf2f3';
   s+=rect(4,4,w-8,h-8,caseFill,'#34424c',5);
   s+=rect(8,9,w-16,54,coverFill,'#52616b',3);
   s+=rect(13,18,58,18,'#12aeb0','#263b43',1)+text(42,31,'SIEMENS',11,'#ffffff','middle');
   s+=text(w-18,28,'SIMATIC',9,ink,'end')+text(w-18,40,'S7-1200',9,ink,'end');
   // Open-cover visual: exposed upper and lower terminal channels remain strictly horizontal.
   s+=rect(8,62,w-16,28,'#687789','#42505b',1)+rect(8,h-90,w-16,28,'#687789','#42505b',1);
   s+=rect(8,88,w-16,8,hinge,'#3e4a53',1)+rect(8,h-98,w-16,8,hinge,'#3e4a53',1);
   s+=rect(8,96,w-16,h-194,coverFill,'#52616b',2);
   for(const [i,label] of ['RUN/STOP','ERROR','MAINT'].entries()){
    s+=rect(17,106+i*11,4,4,c._active&&i===0?'#54c86e':'#27343a','#314047',0)+text(25,110+i*11,label,4.5,'#e6ecee');
   }
   const variant=d.name.replace(/^CPU \d+C /,'');
   s+=text(w-18,116,'CPU '+f.size+'C',10,ink,'end')+text(w-18,129,variant,7.5,ink,'end');
   s+=text(w-18,h-108,d.part,5.2,'#e1e7e8','end');
   const portCount=f.size>=1215?2:1;
   for(let i=0;i<portCount;i++){const x=18+i*38,y=h-137;s+=rect(x,y,31,24,'#46565f','#26343b',2)+rect(x+4,y+4,23,14,'#142027','#33464e',1)+rect(x+10,y+17,11,4,'#142027','#142027',0)}
   s+=text(18,h-106,'PROFINET',5,'#e0e8ea');
  }else if(f.family==='gmt-glc'){
   s+=rect(5,5,w-10,h-10,'#303638','#11191b',3);
   for(let y=12;y<h-10;y+=12)s+=rect(3,y,3,5,'#727c7d','#1a2325',0);
   const port=(x,y,pw,ph)=>rect(x,y,pw,ph,'#9a9e9f','#141b1e')+rect(x+4,y+4,pw-8,ph-8,'#13191c','#5f6668')+rect(x+pw/2-5,y+ph-8,10,7,'#13191c','#13191c');
   s+=port(18,20,48,35)+text(18,64,'Ethernet / PLC Link',4.5);
   s+=port(29,115,37,30)+text(25,112,'COM1 · RS232',4.5)+text(18,82,'COM2 · RS485',4.5);
   s+=text(58,178,'GMT',17,'#e6e8e9','middle')+text(58,189,'CNT',10,'#cbd1d3','middle')+text(59,201,d.part,8,'#f3f4f4','middle');
   s+=rect(50,207,16,14,'#a2a8aa','#161d1f')+rect(54,209,8,10,'#141b20')+text(45,215,'USB',4,'#a4aeaf','end');
   s+=`<circle cx="92" cy="168" r="4" fill="#bc252d" stroke="#231b1b"/>`;
   for(let i=0;i<3;i++)s+=`<circle cx="19" cy="${155+i*9}" r="2" fill="${c._active&&i===0?'#4ac078':'#779488'}"/>`;
   for(const p of d.materialPins.filter(p=>['DI','DO'].includes(p.signalType)))s+=`<circle cx="146" cy="${p.y}" r="1.8" fill="#557b64" stroke="#15351d"/>`;
  }else{
  s+=rect(7,5,w-14,h-10,`url(#${uid}-case)`,'#101719',3);
  // Front elevation with covers open: wired terminal locations stay visible.
  for(const x of [10,w-20])for(const y of [5,h-15])s+=rect(x,y,10,10,'#a9b2b4')+`<circle cx="${x+5}" cy="${y+5}" r="2.8" fill="#252c2e"/>`;
  s+=rect(15,68,w-30,h-136,'#3b4346','#788183',2);
  s+=text(w-24,83,'OMRON',10,'#eef2f2','end')+text(28,83,f.generation,9)+text(w-24,h-77,d.part,8,'#edf1f2','end');
  const cp1=f.generation==='CP1E',renewed=cp1&&f.renewal,ledX=cp1?48:29;
  for(const [i,label] of ['POWER','RUN','ERR/ALM','INH','BKUP'].entries())s+=rect(ledX,91+i*8,5,3,i===0&&c._active?'#58c766':'#222a2c','#788082')+text(ledX+9,94+i*8,label,4.5);
  const slotCount=cp1?(!renewed&&f.variant!=='E'&&f.size>=30||f.variant==='NA'?1:0):f.variant==='N'?(f.size<=20?1:2):0;
  for(let i=0;i<slotCount;i++){
   const sw=Math.min(65,(w-135)/slotCount),x=(cp1?w-95:85)+i*(sw+8);
   s+=rect(x,90,sw,h-176,'#454d50','#92999b',2)+rect(x+sw/2-8,88,16,3,'#788183')+rect(x+sw/2-8,h-87,16,3,'#788183');
  }
  if(cp1||!slotCount){const x=cp1?23:62,y=renewed?73:98;s+=rect(x,y,18,22,'#c1c7c8','#232a2d',2)+rect(x+4,y+5,10,12,'#172126')+text(x,y+32,'USB',5)}
  if(cp1){
   if(!renewed)for(const y of [135,145])s+=`<circle cx="30" cy="${y}" r="3" fill="#c4cbcc" stroke="#172023"/><path d="M28 ${y}h4" stroke="#303b40"/>`;
   if(f.variant!=='E'){
    const x=renewed?Math.max(30,w-110):88,y=renewed?112:106;
    s+=`<path d="M${x} ${y}h36l-3 17h-30z" fill="#bac3c5" stroke="#1a252b"/>`;
    for(let i=0;i<9;i++)s+=`<circle cx="${x+6+(i%5)*6+(i>4?3:0)}" cy="${y+5+(i>4?6:0)}" r="1" fill="#1b292f"/>`;
    s+=text(x,y+24,'RS-232C',4.5);
   }
   if(renewed){for(let r=0;r<3;r++)for(let i=0;i<Math.min(18,(w-130)/6);i++)s+=`<circle cx="${100+i*6}" cy="${94+r*6}" r="1.3" fill="#bac2c4"/>`}
   else if(f.variant==='E')for(let i=0;i<18;i++)s+=`<circle cx="${100+(i%6)*8}" cy="${99+Math.floor(i/6)*9}" r="1.5" fill="#222b2f" stroke="#869094"/>`;
  }
  }
  }
  for(const row of f.rows){
   const pitch=row.pitch||20;s+=rect(row.x-pitch/2+1,row.y-(row.vertical?pitch/2-1:9),row.vertical?12:row.labels.length*pitch-2,row.vertical?row.labels.length*pitch-2:18,f.family.startsWith('gmt-')?'#12884f':'#202627','#717a7d');
   row.labels.forEach((label,i)=>{
    if(Object.entries(row.merged||{}).some(([start,length])=>i>+start&&i<+start+length))return;
    const span=row.merged?.[i]||1,x=row.x+(row.vertical?0:i*pitch)+(span-1)*pitch/2,y=row.y+(row.vertical?i*pitch:0);s+=rect(x-(row.vertical?2:pitch/2-2)-(span-1)*pitch/2,y-(row.vertical?pitch/2-1:7),row.vertical?8:pitch-4+(span-1)*pitch,row.vertical?pitch-2:14,'#394245','#727c7d');
    if(!label)s+=text(x,y+2,'NC',row.pitch===10?3.4:5,'#9ca7a9','middle');
    else{
     const pinId=row.id+':'+(i+1),pinDef=(d.pins||[]).find(p=>p.id===pinId),live=pinDef?.signalType==='DI'?!!runtime.inputs?.[pinId]:pinDef?.signalType==='DO'?!!runtime.outputs?.[pinId]:false;
     s+=`<circle data-plc-terminal="${esc(pinId)}" cx="${x}" cy="${y}" data-plc-live="${live?'1':'0'}" r="${f.family==='siemens-s71200'&&row.pitch===10?3.1:4}" fill="${live?'#52d273':row.gold?'#d6c06a':'#b6bec0'}" stroke="${live?'#126934':'#151b1d'}" stroke-width=".7"/><path d="M${x-2.2} ${y}h4.4" stroke="#42494b"/>`;
     if(f.family==='siemens-s71200'&&row.pitch===10){
      const compact=String(label).replace('L+ sensor','L+').replace('M sensor','M').replace(/^DI [ab]\./,'').replace(/^DQ [ab]\./,'').replace(/^AI /,'AI').replace(/^AQ /,'AQ');
      const ty=row.side==='top'?y+12:y-10;
      s+=text(x,ty,compact,3.4,'#f0f3f4','middle');
     }
    }
   });
   if(f.family==='siemens-s71200'&&row.pitch===10){
    const cap=row.id==='X10'?'X10 · POWER / DI':row.id==='X11'?'X11 · ANALOG':row.id==='X12'?(d.outputType==='relay'?'X12 · RELAY OUTPUTS':'X12 · 24VDC OUTPUTS'):row.id;
    s+=text(row.x-(row.pitch||10)/2,row.side==='top'?row.y-13:row.y+18,cap,4.2,'#e9eef0');
   }
  }
  if(!photo&&f.family==='omron-cp'){
   for(const [y,count] of [[65,d.io.DI],[h-62,d.io.DO]])for(let i=0;i<count;i++){const x=26+i*Math.min(9,(w-54)/count);s+=rect(x,y,3,2,'#bca557','#333b3c',0)}
   s+=text(w-24,151,d.powerSupply+' · '+(d.outputType==='relay'?'RELAY':d.outputType),5,'#d9dfe1','end');
  }
  return `<g class="material-layer plc-front plc-model-front" data-material="plc-front-${esc(d.part)}" data-plc-part="${esc(d.part)}" data-projection="front">${s}</g>`;
 }
 const api={markup};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPLCFront=api;
})(typeof window==='undefined'?globalThis:window);
