(function(root){
 'use strict';
 // Orthographic, code-native assemblies: the moving part is separate from its housing.
 function markup(d,c={}){
  const w=d.w,h=d.h,x=w/2,y=h/2,on=!!c.state;
  const rect=(x,y,w,h,fill,rx=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="#334155"/>`;
  const text=(s,x,y,size=10)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#162536">${s}</text>`;
  const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#263744"/>`;
  let a='';
  if(['speaker','buzzer','annunciation','siren'].includes(d.id)){
   const file={speaker:'speaker-v111.jpg',buzzer:'buzzer-v111.png',annunciation:'alarm-v111.jpg',siren:'siren-v111.jpg'}[d.id];
   const scope='bg111-'+String(c.id||d.id).replace(/[^a-z0-9_-]/gi,'');
   if(d.id==='buzzer'){
    a=`<svg x="10" y="8" width="${w-20}" height="${h-16}" viewBox="67 52 126 126"><defs><clipPath id="${scope}"><circle cx="130" cy="115" r="59"/></clipPath></defs><image href="assets/products/${file}" width="382" height="223" clip-path="url(#${scope})"/></svg>`;
   }else if(d.id==='speaker'){
    const r=Math.max(1,Math.min(w-14,h-14)*.48);
    a=`<defs><clipPath id="${scope}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs><image href="assets/products/${file}" x="7" y="7" width="${w-14}" height="${h-14}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${scope})"/>`;
   }else if(d.id==='siren'){
    const r=Math.max(1,Math.min(w-14,h-14)*.47);
    a=`<defs><clipPath id="${scope}"><circle cx="${x}" cy="${y-2}" r="${r}"/></clipPath></defs><image href="assets/products/${file}" x="7" y="7" width="${w-14}" height="${h-14}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${scope})"/>`;
   }else{
    a=`<defs><clipPath id="${scope}"><rect x="7" y="7" width="${w-14}" height="${h-14}" rx="7"/></clipPath></defs><image href="assets/products/${file}" x="7" y="7" width="${w-14}" height="${h-14}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${scope})"/>`;
   }
  }else if(d.kind==='phase-monitor'){
   const f=d.phaseProtection,scope='phase-bg-'+String(c.id||d.id).replace(/[^a-z0-9_-]/gi,'');
   const vb=f?'325 120 370 1400':'130 200 760 1290';
   const clip=f?'<rect x="336" y="130" width="348" height="1378" rx="18"/>':'<rect x="145" y="212" width="730" height="1264" rx="20"/>';
   a=`<svg x="10" y="10" width="${w-20}" height="${h-20}" viewBox="${vb}" preserveAspectRatio="none"><defs><clipPath id="${scope}">${clip}</clipPath></defs><image href="assets/products/${f?'fkv':'fsr'}-front-v111.png" width="1024" height="1536" clip-path="url(#${scope})"/></svg>`;
   a+=circle(f?75:124,f?150:177,3,c._active?'#4ff461':'#35513a');
   if(c._phaseFault)a+=text(c._phaseFault,x,h+8,8);
  }else if(d.id==='nh-fuse-holder'){
   a=rect(10,10,w-20,h-20,'#74868f')+rect(18,24,w-36,h-54,'#383f42');
   for(let i=0;i<3;i++)a+=rect(28+i*50,32,24,18,'#c5a770')+rect(28+i*50,164,24,18,'#c5a770');
   const nhScope='nh-holder-bg-'+String(c.id||d.id).replace(/[^a-z0-9_-]/gi,'');
   a+=`<g class="nh-lid" transform="translate(0 ${on?145:0}) scale(1 ${on?.32:1})"><svg x="10" y="10" width="${w-20}" height="${h-20}" viewBox="105 180 785 1350" preserveAspectRatio="none"><defs><clipPath id="${nhScope}"><rect x="122" y="194" width="752" height="1318" rx="22"/></clipPath></defs><image href="assets/products/nh-holder-front-v111.png" width="996" height="1580" clip-path="url(#${nhScope})"/></svg>`;
   for(let i=0;i<3;i++)if(c.nhFuses?.[i])a+=rect(34+i*50,88,12,77,'#b8bdc0')+rect(28+i*50,104,24,46,'#eee9dc')+text('NH',40+i*50,130,8);
   a+='</g>'+text(on?'KAPAK AÇIK':'3NP1 · NH00 / 000',x,238,9);
  }else if(d.id==='nh-fuse'){
   const nhFuseScope='nh-fuse-bg-'+String(c.id||d.id).replace(/[^a-z0-9_-]/gi,'');
   a=`<defs><clipPath id="${nhFuseScope}"><path d="M24 18H${w-24}V${h-18}H24Z"/></clipPath></defs><image href="assets/products/nh-reference-v111.png" x="10" y="5" width="${w-20}" height="${h-10}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${nhFuseScope})"/>`;
  }else if(d.id==='packet-star-delta'){
   const angle=[-60,0,60][Number(c.position)||0];
   a=rect(x-66,y-72,132,144,'#087e64')+rect(x-58,y-64,116,128,'#eaf0df')+text('0',x-42,y-30)+text('Y',x,y-45)+text('Δ',x+42,y-30)+circle(x,y,31,'#096f58')+`<g transform="rotate(${angle} ${x} ${y})">${rect(x-9,y-36,18,72,'#05503f',6)}<path d="M${x} ${y-30}v18" stroke="white" stroke-width="3"/></g>`+text('METOP MT031',x,y+55,9);
  }else if(d.fuseSlots){
   for(let i=0;i<d.fuseSlots;i++){
    const xx=i*40,open=!!c.fuseOpen?.[i];
    const scope='fuse-'+String(c.id||d.id).replace(/[^a-z0-9]/gi,'')+'-'+i;
    a+=`<g data-fuse-slot="${i}" role="button" tabindex="0" aria-label="${i+1}. sigorta ${open?'kapat':'aç'}"><svg x="${xx+1}" y="6" width="38" height="148" viewBox="405 70 215 1400" preserveAspectRatio="none"><defs><clipPath id="${scope}"><rect x="423" y="516" width="180" height="523"/></clipPath></defs><image href="assets/products/wsi-top-v111.png" width="1024" height="1536"/><rect x="423" y="516" width="180" height="523" fill="#262b2e"/><g transform="translate(0 ${open?-150:0})"><image href="assets/products/wsi-top-v111.png" width="1024" height="1536" clip-path="url(#${scope})"/></g></svg>${text(open?'AÇIK':'',xx+20,156,8)}<rect x="${xx+1}" y="6" width="38" height="150" fill="transparent"/></g>`;
   }
  }else if(d.id==='potentiometer'){
   const p=Math.max(0,Math.min(100,Number(c.potentiometer??50))),max=Math.max(1,Number(c.potMax)||10000);
   const scope='pot-'+String(c.id||d.id).replace(/[^a-z0-9]/gi,'');
   a=`<svg x="10" y="10" width="${w-20}" height="${h-35}" viewBox="95 85 1060 1060"><defs><clipPath id="${scope}-outer"><circle cx="627" cy="615" r="521"/></clipPath><clipPath id="${scope}-knob"><circle cx="627" cy="627" r="244"/></clipPath></defs><image href="assets/products/pot-front-v111.png" width="1254" height="1254" clip-path="url(#${scope}-outer)"/><circle cx="627" cy="627" r="244" fill="#17191b"/><g data-pot-knob="1" role="slider" tabindex="0" aria-label="Potansiyometre" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" transform="rotate(${-135+p*2.7} 627 627)"><image href="assets/products/pot-front-v111.png" width="1254" height="1254" clip-path="url(#${scope}-knob)"/><circle cx="627" cy="627" r="244" fill="transparent"/></g></svg>`+text(Math.round(max*p/100)+' Ω',x,h-5,10);
  }else if(['limit-no','limit-nc','mechanical-control','mechanical-latching'].includes(d.id)){
   a=rect(x-24,y,48,h-y-8,'#52626f')+rect(x-18,y+7,36,h-y-21,'#b4bfc4')+`<g class="roller-lever" transform="rotate(${on?90:0} ${x} ${y+4})"><path d="M${x} ${y+4}V${y-25}" stroke="#c2cbd0" stroke-width="9"/>${circle(x,y-27,10,'#30393e')}${circle(x,y+4,5,'#e8ecef')}</g>`;
  }else if(['breaker','breaker2','breaker3'].includes(d.kind)||d.id==='isolator-1p'){
   a=rect(12,7,w-24,h-14,'#e8ece9')+rect(19,y-15,w-38,32,'#a5afb5')+rect(22,on?y+4:y-12,w-44,12,'#1c2225')+text(on?'0 OFF':'I ON',x,y-22,9);
  }else if(d.kind==='thermal-magnetic'){
   a=rect(12,10,w-24,h-20,'#414f59')+rect(19,20,w-38,h-40,'#d9dedb')+circle(x,y,Math.min(w,h)*.22,'#6d7677')+`<g transform="rotate(${on?90:0} ${x} ${y})">${rect(x-6,y-21,12,42,'#161c20',4)}<path d="M${x} ${y-17}v10" stroke="white" stroke-width="3"/></g>`;
  }else if(d.id==='resistor'){
   const value=Math.max(1,Number(c.resistance)||1000),valueLabel=value>=1000?`${Number((value/1000).toFixed(3))} kΩ`:`${value} Ω`,bands=value===2700?['#d32f2f','#7c3aed','#d32f2f','#d4af37']:value===220?['#d32f2f','#d32f2f','#8b5a2b','#d4af37']:['#754222','#161616','#e03d26','#b89935'];
   if(d._verticalTransform){
    a=`<path d="M${x} 0V20M${x} ${h-20}V${h}" stroke="#a3a9aa" stroke-width="3"/>`+rect(x-12,20,24,h-40,'#d8be89',8);
    bands.forEach((color,i)=>a+=rect(x-11,27+i*11,22,5,color,0));
    a+=text(valueLabel,x+20,y+3,7);
   }else{
    a=`<path d="M0 ${y}H${w} " stroke="#a3a9aa" stroke-width="3"/>`+rect(x-30,y-12,60,24,'#d8be89',8);
    bands.forEach((color,i)=>a+=rect(x-22+i*14,y-11,5,22,color,0));
    a+=text(valueLabel,x,h-3,9);
   }
  }else if(['reactor','winding'].includes(d.id)){
   a=`<path d="M0 ${y}H${w}" stroke="#90999f" stroke-width="3"/>`+rect(x-33,y-17,66,34,'#41454a');
   for(let i=0;i<10;i++)a+=`<ellipse cx="${x-28+i*6}" cy="${y}" rx="6" ry="21" fill="none" stroke="#bc672b" stroke-width="4"/>`;
   a+=text('150 mH',x,h-2,9);
  }else if(d.id==='speaker'){
   a=rect(9,9,w-18,h-18,'#3b434a',9)+circle(x,y,Math.min(w,h)*.34,'#171e24')+circle(x,y,Math.min(w,h)*.24,'#606770')+circle(x,y,Math.min(w,h)*.1,'#252c32');
  }else if(d.id==='buzzer'){
   a=circle(x,y,Math.min(w,h)*.34,'#242c30')+circle(x,y,Math.min(w,h)*.25,'#363e42');
   for(let i=-2;i<=2;i++)a+=`<path d="M${x-13} ${y+i*6}h26" stroke="#11171c" stroke-width="3"/>`;
   a+=text('BUZZER',x,h-4,8);
  }else if(d.id==='annunciation'){
   a=rect(10,10,w-20,h-20,'#e6e8e5',7)+rect(18,17,w-36,15,c._active?'#ff4343':'#b22328');
   for(let i=0;i<4;i++)a+=rect(22,39+i*6,w-44,2,'#48515b',0);
  }else if(d.id==='siren'){
   a=rect(x-23,h-18,46,10,'#747d83')+circle(x,y-3,Math.min(w,h)*.36,'#b73529')+circle(x,y-3,Math.min(w,h)*.27,'#4d2523');
   for(let i=0;i<8;i++){const angle=i*Math.PI/4;a+=circle(x+Math.sin(angle)*18,y-3+Math.cos(angle)*18,4,'#141b20')}
   a+=circle(x,y-3,9,'#c54d3c');
  }
  return a?`<g class="material-layer material-v111" data-material="front-${d.id}" stroke-linecap="round">${a}</g>`:'';
 }
 const api={markup};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSMaterials111=api;
})(typeof window==='undefined'?globalThis:window);
