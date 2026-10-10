(function(root){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(d,c,sprite){
  const text=(x,y,s,size=10,color='#234')=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}" stroke="none">${esc(s)}</text>`;
  const photo=(file,vb,x,y,w,h,iw,ih)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="none" overflow="hidden"><image href="assets/products/${file}" width="${iw}" height="${ih}"/></svg>`;
  const maskedPhoto=(file,vb,x,y,w,h,iw,ih,id,shape)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="none" overflow="hidden"><defs><clipPath id="${id}">${shape}</clipPath></defs><image href="assets/products/${file}" width="${iw}" height="${ih}" clip-path="url(#${id})"/></svg>`;
  if(d.probeColor)return `<g class="material-layer"><path d="M0 20h25" stroke="${d.probeColor}" stroke-width="4"/><path d="M100 20h40" stroke="#a8b3b9" stroke-width="3"/><rect x="25" y="12" width="75" height="16" rx="5" fill="${d.probeColor}" stroke="#394953"/><path d="M96 7v26" stroke="${d.probeColor}" stroke-width="6"/></g>`;
  if(d.kind==='clamp-meter'){
   const M=typeof module==='object'&&module.exports?require('./clamp-meter.js'):root.DTSClampMeter,open=!!c._clampCandidate&&!c.clampedWireId,read=c._clamp||{},display=read.display??'—',unit=read.unit||'',jawShift=open?18:0;
   let art=`<rect x="39" y="105" width="102" height="220" rx="22" fill="#c62828" stroke="#4a4a4a" stroke-width="4"/><rect x="48" y="118" width="84" height="72" rx="5" fill="#4d5553" stroke="#202625" stroke-width="3"/><rect x="53" y="126" width="74" height="42" rx="2" fill="${c.meterBacklight?'#d9efb4':'#a9bbaa'}"/>`+text(90,151,display,18,'#14231f')+text(116,164,unit,8,'#14231f');
   art+=`<path d="M55 109V72C55 29 78 10 104 10C130 10 151 31 151 59V94" fill="none" stroke="#45484a" stroke-width="22" stroke-linecap="round"/><path d="M55 109V72C55 34 77 21 103 21" fill="none" stroke="#c9cdce" stroke-width="5" stroke-linecap="round"/><g transform="translate(${jawShift} 0)"><path d="M151 94V59C151 39 139 24 123 18" fill="none" stroke="#45484a" stroke-width="22" stroke-linecap="round"/><path d="M151 94V59C151 43 142 32 130 27" fill="none" stroke="#c9cdce" stroke-width="5" stroke-linecap="round"/></g>`;
   if(c.clampedWireId)art+=`<line x1="28" y1="65" x2="166" y2="65" stroke="#1f2937" stroke-width="7"/><circle cx="103" cy="65" r="5" fill="#f4d03f"/>`;
   art+=text(90,205,'UNI-T',14,'#fff')+text(90,222,'UT200A',11,'#fff')+`<circle cx="90" cy="257" r="39" fill="#242526" stroke="#555" stroke-width="3"/><g transform="rotate(${(c.meterPosition||0)*45} 90 257)"><rect x="83" y="225" width="14" height="64" rx="4" fill="#555"/><path d="M90 227v14" stroke="#eee" stroke-width="3"/></g>`;
   for(let i=0;i<M.ranges.length;i++){const a=(i*45-22.5)*Math.PI/180,b=(i*45+22.5)*Math.PI/180,r=52;art+=`<path data-meter-position="${i}" d="M90 257L${90+Math.cos(a)*r} ${257+Math.sin(a)*r}A${r} ${r} 0 0 1 ${90+Math.cos(b)*r} ${257+Math.sin(b)*r}Z" fill="transparent" style="cursor:pointer"/>`}
   art+=`<rect x="48" y="297" width="38" height="17" rx="4" fill="#2b2b2b"/><rect x="94" y="297" width="38" height="17" rx="4" fill="#2b2b2b"/><rect data-meter-action="hold" x="45" y="293" width="44" height="25" fill="transparent" style="cursor:pointer"/><rect data-meter-action="light" x="91" y="293" width="44" height="25" fill="transparent" style="cursor:pointer"/>`+text(67,309,'HOLD',7,'#fff')+text(113,309,'LIGHT',7,'#fff');
   return `<g class="material-layer" data-material="unit-ut200a-vector">${art}</g>`;
  }
  if(d.kind==='current-transformer'&&d.id==='current-transformer-edu-1p'){
   let art=`<rect x="8" y="8" width="134" height="134" rx="10" fill="#eef2f4" stroke="#5e6b72" stroke-width="3"/><circle cx="75" cy="64" r="36" fill="none" stroke="#3e4b52" stroke-width="15"/><line x1="5" y1="48" x2="145" y2="48" stroke="#e53935" stroke-width="7"/><path d="M48 103q9-16 18 0t18 0t18 0" fill="none" stroke="#8e44ad" stroke-width="4"/>`+text(75,20,'CT 100/5 A',10,'#2e4550')+text(75,132,'S1 / S2',8,'#6b4c7b');
   return `<g class="material-layer" data-material="current-transformer-edu-vector">${art}</g>`;
  }
  if(d.kind==='energy-training-load'){
   const ch=c.loadCharacter||d.loadCharacter||'resistive',pf=Number(c.powerFactor??d.powerFactor??1),tag=ch==='inductive'?'L':ch==='capacitive'?'C':'R',sub=ch==='inductive'?'ENDÜKTİF':ch==='capacitive'?'KAPASİTİF':'DİRENÇLİ';
   let art=`<rect x="8" y="8" width="174" height="134" rx="12" fill="#f7fafc" stroke="#607d8b" stroke-width="3"/><circle cx="58" cy="74" r="32" fill="#e8f2f7" stroke="#78909c" stroke-width="3"/>`+text(58,84,tag,32,'#31566b')+text(128,52,sub,10,'#31566b')+text(128,76,'230 VA',11,'#234a5d')+text(128,99,'PF '+pf.toFixed(2),11,'#234a5d')+text(95,129,'AC eğitim yükü',8,'#71838b');
   return `<g class="material-layer" data-material="energy-training-load-vector">${art}</g>`;
  }
  if(d.kind==='energy-analyzer'){
   const a=c._energyAnalyzer||{},v=Number(a.voltageV||0),i=Number(a.currentA||0),p=Number(a.activePowerW||0),q=Number(a.reactivePowerVar||0),va=Number(a.apparentPowerVA||0),pf=Number(a.powerFactor||0),hz=Number(a.frequencyHz||0),wh=Number(a.energyWh||0);
   const sign=q>1?'L':q<-1?'C':'R';
   let art=`<rect x="8" y="8" width="214" height="264" rx="12" fill="#e9ecef" stroke="#48545c" stroke-width="4"/><rect x="25" y="28" width="180" height="150" rx="8" fill="#24342f" stroke="#111" stroke-width="3"/><rect x="36" y="40" width="158" height="126" rx="4" fill="#b7d9b9"/>`;
   art+=text(115,61,'DTS EA-1P',10,'#173025')+text(72,87,'U '+v.toFixed(1)+' V',12,'#10251c')+text(158,87,'I '+i.toFixed(3)+' A',12,'#10251c')+text(72,111,'P '+p.toFixed(1)+' W',12,'#10251c')+text(158,111,'PF '+pf.toFixed(2),12,'#10251c')+text(72,135,'Q '+q.toFixed(1)+' var',10,'#10251c')+text(158,135,'S '+va.toFixed(1)+' VA',10,'#10251c')+text(72,157,'f '+hz.toFixed(2)+' Hz',9,'#10251c')+text(158,157,sign+' · '+wh.toFixed(3)+' Wh',9,'#10251c');
   art+=`<rect x="32" y="194" width="36" height="26" rx="5" fill="#42515a"/><rect x="78" y="194" width="36" height="26" rx="5" fill="#42515a"/><rect x="124" y="194" width="36" height="26" rx="5" fill="#42515a"/><rect x="170" y="194" width="28" height="26" rx="5" fill="#42515a"/>`+text(50,211,'V/I',7,'#fff')+text(96,211,'P/Q',7,'#fff')+text(142,211,'PF',7,'#fff')+text(184,211,'E',7,'#fff')+text(115,245,a.warning||'L-N + CT',8,a.warning?'#b3261e':'#43545e');
   return `<g class="material-layer" data-material="energy-analyzer-1p-vector">${art}</g>`;
  }
  if(d.kind==='multimeter'&&d.id==='unit-ut61e-plus'){
   const M=typeof module==='object'&&module.exports?require('./multimeter.js'):root.DTSMultimeter,rs=M.rangesFor?M.rangesFor(d):M.ranges,display=c._meter?.display??'',unit=c._meter?.unit||'';
   let art=`<rect x="8" y="8" width="164" height="362" rx="22" fill="#b5222a" stroke="#3b3b3b" stroke-width="4"/><rect x="18" y="18" width="144" height="90" rx="8" fill="#32383a" stroke="#171b1c" stroke-width="3"/><rect x="29" y="35" width="122" height="52" rx="4" fill="${c.meterBacklight?'#d8efba':'#a9bca8'}"/>`+text(90,67,display,20,'#14231f')+text(139,84,unit,8,'#14231f')+text(90,24,'UNI-T UT61E+',11,'#fff');
   art+=`<circle cx="90" cy="205" r="56" fill="#202225" stroke="#4f5355" stroke-width="4"/>`;
   const step=360/Math.max(1,rs.length);art+=`<g transform="rotate(${(c.meterPosition||0)*step} 90 205)"><rect x="81" y="157" width="18" height="96" rx="5" fill="#4b4c50" stroke="#191919"/><path d="M90 159v20" stroke="#ecebea" stroke-width="3"/></g>`;
   for(let i=0;i<rs.length;i++){const a=(i*step-step/2-90)*Math.PI/180,b=(i*step+step/2-90)*Math.PI/180,r=76;art+=`<path data-meter-position="${i}" d="M90 205L${90+Math.cos(a)*r} ${205+Math.sin(a)*r}A${r} ${r} 0 0 1 ${90+Math.cos(b)*r} ${205+Math.sin(b)*r}Z" fill="transparent" style="cursor:pointer"/>`;}
   art+=text(90,130,'Hz · V · Ω',9,'#fff')+text(90,288,'TRUE RMS · 22000 COUNT',7,'#fff');
   for(const [x,l] of [[28,'20A'],[70,'mA'],[112,'COM'],[154,'VΩHz']]){art+=`<circle cx="${x}" cy="332" r="10" fill="#141719" stroke="#ddd" stroke-width="2"/>`+text(x,354,l,6,'#fff');}
   return `<g class="material-layer" data-material="unit-ut61e-plus-vector">${art}</g>`;
  }
  if(d.kind==='multimeter'){
   const bgId='ut33d-bg-'+String(c.id||d.id).replace(/[^\w-]/g,'_');
   /* Keep the exact UT33D+ source photo; remove only its white backdrop by
      clipping to the verified outer silhouette of the meter body. */
   let art=`<svg x="0" y="0" width="180" height="340" viewBox="110 45 320 548" preserveAspectRatio="none" overflow="hidden"><defs><clipPath id="${bgId}"><path d="M176 50C158 50 149 61 145 81L126 508C123 544 137 568 164 579C225 595 324 592 382 580C402 570 414 548 410 515L397 82C395 62 384 50 365 50Z"/></clipPath></defs><image href="assets/products/unit-v115.jpg" width="600" height="600" clip-path="url(#${bgId})"/></svg>`;
   art+=`<rect x="28" y="49" width="126" height="52" rx="2" fill="${c.meterBacklight?'#d9efb4':'#98b7a4'}"/>`+text(93,81,c._meter?.display??'',22,'#122823')+text(130,96,c._meter?.unit||'',8);
   art+=`<circle cx="90" cy="198" r="49" fill="#202021" stroke="#484649" stroke-width="3"/><g transform="rotate(${(c.meterPosition||0)*18} 90 198)"><rect x="81" y="155" width="18" height="86" rx="5" fill="#414042" stroke="#191919"/><path d="M90 157v17" stroke="#dad9d7" stroke-width="3"/></g>`;
   for(let i=0;i<20;i++){const a=(i*18-99)*Math.PI/180,b=(i*18-81)*Math.PI/180,r=68;art+=`<path data-meter-position="${i}" d="M90 198L${90+Math.cos(a)*r} ${198+Math.sin(a)*r}A${r} ${r} 0 0 1 ${90+Math.cos(b)*r} ${198+Math.sin(b)*r}Z" fill="transparent" style="cursor:pointer"/>`}
   art+=`<rect data-meter-action="hold" x="27" y="123" width="30" height="20" fill="transparent" style="cursor:pointer"/><rect data-meter-action="light" x="125" y="123" width="30" height="20" fill="transparent" style="cursor:pointer"/>`;
   return `<g class="material-layer" data-material="unit-ut33d-original">${art}</g>`;
  }
  if(['coil-relay','coil-relay-dc','misc-relay'].includes(d.id)&&d.materialAsset==='omron-my-relay-v11920'){
    return `<g class="material-layer" data-material="omron-my-relay-v11920"><svg x="0" y="0" width="${d.w}" height="${d.h}" viewBox="0 0 180 240" preserveAspectRatio="xMidYMid meet" overflow="visible"><image href="assets/products/omron-my-relay-v11920.webp?rev=20261008-omron7" x="0" y="0" width="180" height="240"/></svg></g>`;
  }
  if(d.productPhoto115){const bg='p115-bg-'+String(c.id||d.id).replace(/[^\w-]/g,'_');return `<g class="material-layer" data-material="design-${d.id}">${maskedPhoto(d.productPhoto115,'145 0 160 450',10,0,100,280,450,450,bg,'<rect x="151" y="6" width="148" height="438" rx="10"/>')}</g>`}
  if(d.instrument){const s=c._instrument,q=c._controller,uid='instrument-'+String(c.id||d.id).replace(/[^\w-]/g,'_');let art='';
   if(d.instrument==='ht2'){
    art=`<defs><clipPath id="${uid}"><path d="M210 154Q210 94 280 94H972Q1047 94 1047 164V617Q1047 685 973 685H694V1095Q694 1169 628 1169Q564 1169 564 1095V685H281Q210 685 210 610Z"/></clipPath></defs><svg x="0" y="15" width="180" height="225" viewBox="210 94 837 1075" preserveAspectRatio="none"><image href="assets/products/gentek-front-v115.png" width="1254" height="1254" clip-path="url(#${uid})"/></svg>`;
    if(s?.on){const m=c.instrumentSettings?.measurement||'both';art+=text(96,48,m==='humidity'?'':s.temperature.toFixed(1),16,'#f65')+text(96,75,m==='temperature'?'':s.humidity.toFixed(1),16,'#f65')}
   }else if(d.instrument==='hmt'){
    art=`<defs><clipPath id="${uid}"><path clip-rule="evenodd" d="M1164 615A539 539 0 1 0 86 615A539 539 0 1 0 1164 615Z M697 615A72 72 0 1 0 553 615A72 72 0 1 0 697 615Z M293 595A63 63 0 1 0 167 595A63 63 0 1 0 293 595Z M1084 594A63 63 0 1 0 958 594A63 63 0 1 0 1084 594Z"/></clipPath></defs><svg width="240" height="240" viewBox="85 75 1080 1080"><image href="assets/products/ordel-top-v115.png" width="1254" height="1254" clip-path="url(#${uid})"/></svg>`;
    if(c.instrumentSettings?.input&&c.instrumentSettings.input!=='PT100')art=`<g transform="rotate(90 120 120)">${art}</g>`;
    art+=text(120,222,(c.instrumentSettings?.input||'PT100')==='PT100'?'HMT-R · PT100 · 4–20 mA':'HMT-T · '+c.instrumentSettings.input+' · 4–20 mA',9);
   }else if(d.instrument==='et4420'){
    const sx=d.w/240,sy=d.h/240;
    art=maskedPhoto('enda-front-v115.png','85 93 1085 1080',0,0,d.w,d.h,1254,1254,uid+'-body','<rect x="96" y="101" width="1062" height="1058" rx="22"/>');
    let overlay='';
    if(q?.on){const f=v=>c.instrumentSettings?.unit==='F'?v*1.8+32:v;overlay+=`<rect x="78" y="40" width="132" height="98" fill="#111"/>`+text(143,78,q.error?'PFA':f(q.pv).toFixed(c.instrumentSettings?.decimal==='on'?1:0),26,'#ff5547')+text(143,126,f(q.sp).toFixed(c.instrumentSettings?.decimal==='on'?1:0),25,'#ebe447');for(const [i,k] of ['main','ssr','alarm1'].entries())if(q[k])overlay+=`<circle cx="36" cy="${58+i*29}" r="5" fill="#ff503f"/>`}
    for(const [i,k] of ['set','function','up','down'].entries())overlay+=`<rect data-instrument-key="${k}" x="${26+i*46}" y="167" width="35" height="28" fill="transparent" style="cursor:pointer"/>`;
    art+=`<g class="et4420-face-overlay" transform="scale(${sx} ${sy})">${overlay}</g>`;
    // ET4420 terminals are rendered once, as the real interactive d.pins rows in symbols.js.
   }else if(d.instrument==='tx11'){
    art=maskedPhoto('baykon-front-v115.png','326 40 373 1440',0,0,d.w,d.h,1024,1536,uid+'-body','<rect x="334" y="48" width="357" height="1424" rx="24"/>');
    if(s?.on)art+=`<circle cx="43" cy="205" r="4" fill="#60dc58"/><circle cx="93" cy="205" r="4" fill="${s.error?'#f55':'#382d2d'}"/>`;
   }else if(d.instrument==='waz5'){
    // The old asset is preserved, but its visible frame now fills the verified physical envelope.
    art=maskedPhoto('weid-front-v115.png','394 27 226 1480',0,0,d.w,d.h,1024,1536,uid+'-body','<rect x="401" y="34" width="212" height="1466" rx="16"/>');
    art+=text(d.w/2,d.h*(205/460),'2 + 0–10V − 3',Math.max(4,d.w*(8/180)))+text(d.w/2,d.h*(225/460),'V → I',Math.max(5,d.w*(12/180)))+text(d.w/2,d.h*(245/460),'7 + 4–20mA − 8',Math.max(4,d.w*(7/180)))+text(d.w/2,d.h*(280/460),'4/10 +24V',Math.max(4,d.w*(8/180)))+text(d.w/2,d.h*(298/460),'5/11 0V',Math.max(4,d.w*(8/180)));
   }
   if(d.instrument==='hmt'&&(d.w!==240||d.h!==240))art=`<g class="instrument-scale-only" transform="scale(${d.w/240} ${d.h/240})">${art}</g>`;
   return `<g class="material-layer" data-material="${d.instrument}-front">${art}</g>`;
  }
  if(d.spliceOutputs){const cx=d.w/2,cy=d.h/2;return `<g class="material-layer" data-material="splice-bus"><rect x="5" y="${cy-16}" width="${d.w-10}" height="32" rx="4" fill="#cfaa57" stroke="#745821"/><path d="${d.pins.map(p=>'M'+p.x+' '+p.y+'L'+p.x+' '+cy+'H'+cx).join(' ')}" stroke="#9b7940" stroke-width="5" fill="none"/><path d="M10 ${cy-11}H${d.w-10}" stroke="#f9dc8b" stroke-width="3"/></g>`}
  if(d.terminalCount){let s='';for(let i=0;i<d.terminalCount;i++){const x=i*40;s+=`<rect x="${x}" y="8" width="40" height="124" rx="1" fill="#a6b1b4" stroke="#4a575d"/><rect x="${x+5}" y="18" width="30" height="104" fill="#d7dcdb" stroke="#6d7c7e"/><path d="M${x+20} 30v80" stroke="#b9944d" stroke-width="9"/><rect x="${x+5}" y="60" width="30" height="20" fill="#f5f6ed" stroke="#5d6d74"/><text x="${x+20}" y="74" font-size="10" text-anchor="middle" fill="#253f49">${i+1}</text>`}return `<g class="material-layer" data-material="terminal-array-top">${s}</g>`}
  if(d.lampPins){const color=/^#[0-9a-f]{6}$/i.test(c.deviceColor||'')?c.deviceColor:'#28b95a';return `<g class="material-layer" data-material="illuminated-push">${sprite('green-pushbutton',8,8,d.w-16,d.h-16,'material-art',c.id||d.id)}<g class="material-actuator"><circle cx="${d.w/2}" cy="${d.h/2}" r="${Math.min(d.w,d.h)*.23}" fill="${color}" opacity="${c._lampActive?.95:.22}" ${c._lampActive?'style="filter:drop-shadow(0 0 8px '+color+')"':''}/></g></g>`}
  return '';
 }
 const api={markup};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSMaterials115=api;
})(typeof window==='undefined'?globalThis:window);
