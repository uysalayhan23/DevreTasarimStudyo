(function(root){
  'use strict';
  const Components=typeof module==='object'&&module.exports?require('./components.js'):root.CCSComponents;
  const BookSymbols=typeof module==='object'&&module.exports?require('./book-symbols.js'):root.CCSBookSymbols;
  const ArduinoLibrary=typeof module==='object'&&module.exports?require('./arduino-library.js'):root.DTSArduinoLibrary;
  const DoldSafety=typeof module==='object'&&module.exports?require('./dold-safety.js'):root.DTSDoldSafety;
  const HCFAUI=typeof module==='object'&&module.exports?require('./hcfa-ui.js'):root.DTSHCFAUI;
  const choices=[['TSE','Türk normu · TSE'],['IEC','Avrupa normu · IEC'],['ANSI','Amerikan normu · ANSI']];
  const normalize=n=>choices.some(([id])=>id===n)?n:'IEC';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const comparison='EET2025KKA1008(1).pdf';
  function reference(d,norm){
    if(d.symbolSource)return d.symbolSource;
    if(d.datasheet?.source)return {file:d.datasheet.source,pages:'ürün veri sayfası',basis:'Kullanıcının sağladığı veri sayfasından pin / paket / temel değer eşlemesi'};
    if(d.arduinoBoard||d.arduinoOnly)return {file:'Arduino Atölyesi · dahili eğitim kütüphanesi',pages:'yerel',basis:'Arduino modülü için işlevsel şema sembolü ve terminal eşlemesi'};
    const k=d.kind;
    if(d.isPLC||d.visualOnly)return {file:'EOT2025ATL1005(1).pdf',pages:'68–73',basis:'PLC işlev bloğu; mevcut bağlantı düzeni, normlar arasında ortak gösterim'};
    if(['supply','supply3','ground','fuse','breaker','breaker2','breaker3','rcd2','rcd4','overload','lamp'].includes(k)||k.startsWith('switch-'))return {file:comparison,pages:'37',basis:'Görsel 1.32 · '+normalize(norm)};
    if(k==='thermal-magnetic'||k==='rectifier'||k.includes('motor')||['coil','contactor3','contact-no','contact-nc','timer','delay-on-no','delay-on-nc'].includes(k))return {file:comparison,pages:'38–39',basis:'Görsel 1.32 · '+normalize(norm)};
    if(k.includes('transformer')||k.startsWith('delay-off')||k==='softstarter')return {file:comparison,pages:'39',basis:'Görsel 1.32; terminal düzenine uyarlanmış çizim'};
    if(['resistor','potentiometer','capacitor','diode','led','reactor'].includes(k))return {file:'TEMEL ELEKTRONİK_9 (ENDÜSTRİYEL OTOMASYON TEKNOLOJİLERİ)(1).pdf',pages:'23–37, 76–99',basis:'Temel elektronik sembolleri; ortak / norm varyantı'};
    return {file:'EET2025PP1232-panoSimgeler(1).pdf',pages:'98–104',basis:'İşlevsel gösterim; belgede ayrı üç-norm karşılığı bulunmuyor'};
  }
  function pinLabel(c,d,p,norm){
    norm=normalize(norm);let label=Components.pinLabel(c,d,p);
    if(d.isPLC)return label;
    if(norm!=='IEC'&&(d.kind==='supply'||d.kind==='supply3'))return ({L:'R',L1:'R',L2:'S',L3:'T',PE:norm==='TSE'?'0':'PE',N:norm==='ANSI'?'Mp':'N'})[p.id]||label;
    if(d.kind==='motor3')return ({U:norm==='IEC'?'U1':'U',V:norm==='IEC'?'V1':'V',W:norm==='IEC'?'W1':'W'})[p.id]||label;
    if(d.kind==='motor-yd'&&norm!=='IEC')return ({U1:'U',V1:'V',W1:'W',U2:'X',V2:'Y',W2:'Z'})[p.id]||label;
    if(d.kind==='transformer'||d.kind==='autotransformer')return ({'1':'P1','2':'P2','3':'S1','4':'S2'})[p.id]||label;
    return label;
  }
  function drawing(d,c={},norm='IEC'){
    norm=normalize(norm);
    const arduino=ArduinoLibrary?.schematic?.(d,c,norm);if(arduino)return arduino;
    const installation=(typeof module==='object'&&module.exports?require('./installation-v118.js'):root.DTSInstallation).drawing(d,c);if(installation)return installation;
    if(d.bookSymbol)return BookSymbols.drawing(d,c,norm);
    if((d.hcfaDrive||d.hcfaServoMotor||d.hcfaPulseSource||d.hcfaModbusMaster)&&HCFAUI)return {body:HCFAUI.schematicMarkup(c,d),texts:[]};
    if(d.doldSafety&&DoldSafety)return {body:DoldSafety.schematicMarkup(c,d),texts:[]};
    if(d.incrementalEncoder38mm&&d.schematicExact&&DoldSafety)return {body:DoldSafety.encoderSchematicMarkup(c,d),texts:[]};
    const w=d.w,h=d.h,cx=w/2,cy=h/2,k=d.kind,id=d.id,pins=d.pins,texts=[];
    const states=Components.displayContactStates(c,d),groups=Components.contactGroups(d),ansi=norm==='ANSI',tse=norm==='TSE';
    const line=(x1,y1,x2,y2,extra='')=>`<line class="symbol" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
    const path=(points,extra='')=>`<path class="symbol" d="${points}" ${extra}/>`;
    const rect=(x,y,width,height,extra='')=>`<rect class="symbol" x="${x}" y="${y}" width="${width}" height="${height}" ${extra}/>`;
    const circle=(x,y,r,extra='')=>`<circle class="symbol" cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
    const dot=(x,y,r=2.4)=>circle(x,y,r,'style="fill:white"');
    const text=(key,value,x,y,cls='title')=>{texts.push({key,value,x,y,cls});return ''};
    const p=id=>pins.find(p=>p.id===id);
    const link=(a,b)=>a&&b?path(`M${a.x} ${a.y} L${b.x} ${b.y}`):'';
    const connect=(pin,x,y)=>pin?path(`M${pin.x} ${pin.y} ${pin.side==='top'||pin.side==='bottom'?`V${y}H${x}`:`H${x}V${y}`}`):'';
    function boxLeads(x,y,bw,bh){return pins.map(p=>connect(p,p.side==='left'?x:p.side==='right'?x+bw:p.x,p.side==='top'?y:p.side==='bottom'?y+bh:p.y)).join('')}
    function radialLeads(radius){
      return pins.map(p=>{
        if(p.id==='PE')return connect(p,p.x,cy+radius+10)+path(`M${p.x-9} ${cy+radius+10}h18m-15 4h12m-9 4h6`);
        const dx=p.x-cx,dy=p.y-cy,length=Math.hypot(dx,dy)||1;
        const x=cx+dx/length*radius,y=cy+dy/length*radius;
        return link(p,{x,y});
      }).join('');
    }
    function operatingMark(x,y,type){
      let m=line(x-22,y,x-3,y,'stroke-dasharray="3 3"');
      if(type==='limit')return m+path(`M${x-22} ${y}l-9-10`)+circle(x-33,y-12,3);
      if(type==='pressure')return m+rect(x-32,y-7,10,14);
      if(type==='float')return m+circle(x-29,y,5)+path(`M${x-37} ${y+9}q4-4 8 0t8 0`);
      if(type==='emergency')return m+path(`M${x-25} ${y-12}v24M${x-25} ${y-12}q-12 12 0 24`)+line(x-30,y-7,x-30,y+7);
      if(type==='selector')return m+path(`M${x-23} ${y+7}v-14l-7-5`);
      return m+line(x-24,y-10,x-24,y+10)+(tse?path(`M${x-27} ${y-6}l-4 6 4 6`):'');
    }
    function contact(a,b,closed,opts={}){
      if(!a||!b)return '';
      const vertical=Math.abs(b.y-a.y)>=Math.abs(b.x-a.x),x=(a.x+b.x)/2,y=(a.y+b.y)/2;
      // The symbol's current path is vertical; quarter-turn only the contact
      // interior for the v1.5 overload auxiliary pair on the left/right sides.
      const begin=vertical?{x,y:y-16}:{x:x-16,y},end=vertical?{x,y:y+16}:{x:x+16,y};
      let s=connect(a,begin.x,begin.y)+connect(b,end.x,end.y),inside='';
      if(ansi&&opts.button){
        inside=line(0,-16,0,-11)+line(0,11,0,16)+dot(0,-11)+dot(0,11)+line(closed?0:-9,-13,closed?0:-9,13)+line(closed?-22:-31,0,closed?0:-9,0)+line(closed?-22:-31,-9,closed?-22:-31,9);
        if(opts.emergency)inside+=path(`M-31 -12q-12 12 0 24`);
      }else if(ansi&&!opts.knife){
        inside=line(0,-16,0,-7)+line(0,7,0,16)+line(-10,-7,10,-7)+line(-10,7,10,7)+(closed?line(-14,15,14,-15):'');
        if(opts.limit)inside+=rect(-15,-20,30,40,'stroke-dasharray="3 3"');
      }else{
        inside=line(0,16,closed?0:-13,-16);
        if(tse)inside+=dot(0,16)+dot(0,-16);
        else if(opts.normal==='NC')inside+=line(-7,-16,0,-16);
        if(opts.button||opts.knife||opts.limit||opts.pressure||opts.float)inside+=operatingMark(0,0,opts.emergency?'emergency':opts.limit?'limit':opts.pressure?'pressure':opts.float?'float':opts.knife?'selector':'button');
      }
      if(opts.delay){
        inside+=line(-6,0,-24,0,'stroke-dasharray="3 3"')+path(tse?`M-18 -5l-6 5 6 5M-25 -5l-6 5 6 5`:`M-19 -8q-8 8 0 16M-26 -8v16`);
      }
      return `<g class="norm-contact" data-contact-state="${closed?'closed':'open'}">${s}<g transform="translate(${x} ${y})${vertical?'':' rotate(-90)'}">${inside}</g></g>`;
    }
    let m='';
    if(k==='ldr'){
      const a=p('1'),b=p('2');m=connect(a,cx-28,cy)+connect(b,cx+28,cy)+rect(cx-28,cy-11,56,22)+circle(cx,cy,35)+path(`M${cx-45} ${cy-34}l16 12m-6-1l6 1-1-6M${cx-33} ${cy-44}l16 12m-6-1l6 1-1-6`);
      text('type','LDR',cx,cy+49,'subtitle');
    }else if(k==='bjt-npn'||k==='bjt-pnp'){
      const b=p('B'),cc=p('C'),e=p('E'),bx=cx-18,jx=cx+12,top=cy-24,bot=cy+24;
      m=connect(b,bx,cy)+line(bx,cy-25,bx,cy+25)+line(bx,cy-13,jx,top)+connect(cc,jx,top)+line(bx,cy+13,jx,bot)+connect(e,jx,bot)+circle(cx,cy,34);
      const pnp=k==='bjt-pnp',ax=pnp?jx-8:jx-1,ay=bot-5;
      m+=pnp?path(`M${ax} ${ay} l10 -2 -5 -8 Z`,'style="fill:currentColor"'):path(`M${ax} ${ay} l-10 2 5 8 Z`,'style="fill:currentColor"');
      text('type',pnp?'PNP':'NPN',cx,cy+47,'subtitle');
    }else if(k==='opamp'){
      const ip=p('IN+'),im=p('IN-'),out=p('OUT'),vp=p('V+'),vm=p('V-'),lx=cx-42,rx=cx+48,ty=cy-43,by=cy+43;
      m=connect(ip,lx,cy-21)+connect(im,lx,cy+21)+connect(out,rx,cy)+connect(vp,cx,cy-18)+connect(vm,cx,cy+18)+path(`M${lx} ${ty} L${lx} ${by} L${rx} ${cy} Z`);
      text('noninv','+',lx+14,cy-17,'subtitle');text('inv','−',lx+14,cy+25,'subtitle');text('unit','LM358A',cx+3,cy+4,'subtitle');
    }else if(d.isPLC){
      m=rect(1,1,w-2,h-2)+rect(1,1,w-2,17,'style="fill:#216aa8;stroke:#216aa8"')+text('brand',d.brand,cx,13,'plc-brand-label');
      m+=path(`M14 30h${w-28}m-${w-28} 8h${w-28}m-${w-28} 8h${w-28}`,'opacity=".4"');
    }else if(d.rotaryIsolator){
      groups.forEach(g=>m+=contact(p(g.a),p(g.b),states[g.id],{normal:'NO',knife:true}));
      m+=line(15,cy,w-15,cy,'stroke-dasharray="4 4"');
    }else if(d.selectorSteps){
      const common=pins[0],pivot={x:cx-25,y:cy};m=connect(common,pivot.x,pivot.y)+dot(pivot.x,pivot.y);
      for(const g of groups){const end=p(g.b),x=cx+25;m+=line(x,end.y,end.x,end.y)+dot(x,end.y);if(states[g.id])m+=link(pivot,{x,y:end.y})}
      if(!groups.some(g=>states[g.id]))m+=link(pivot,{x:cx+15,y:cy-15});
    }else if(id==='packet-star-delta'){
      groups.filter(g=>!g.fixed).forEach(g=>m+=contact(p(g.a),p(g.b),states[g.id],{normal:'NO'}));
      groups.filter(g=>g.fixed).forEach((g,i)=>{const a=p(g.a),b=p(g.b),yy=a.y===0?18+i*3:h-18-i*3;m+=path(`M${a.x} ${a.y}V${yy}H${b.x}V${b.y}`,'data-fixed-bridge="1"')+dot(a.x,yy)+dot(b.x,yy)});
      m+=line(7,cy,w-7,cy,'stroke-dasharray="4 4"');
      text('position','MT031 · '+d.positions[c.position||0],cx,cy+42,'subtitle');
    }else if(k==='switch-packet'){
      m=boxLeads(18,35,w-36,h-70)+rect(18,35,w-36,h-70)+circle(cx,cy,20)+line(cx,cy,cx+Math.sin((c.position||0)*Math.PI/2)*16,cy-Math.cos((c.position||0)*Math.PI/2)*16);
      text('position',d.positions[c.position||0],cx,cy+38,'subtitle');
    }else if(['switch-no','switch-nc','contact-no','contact-nc'].includes(k)||k.startsWith('delay-')){
      const g=groups[0],button=/push|mushroom|estop|operator/.test(id),knife=k.startsWith('switch-')&&!button&&!/limit|pressure/.test(id);
      m=contact(p(g.a),p(g.b),states[g.id],{normal:Components.contactMode(c,d,g),button,emergency:/estop|mushroom/.test(id),knife,limit:id.startsWith('limit'),pressure:/pressure/.test(id),delay:k.startsWith('delay-')});
      if(/pressure/.test(id))text('actuator','P',cx-27,cy+3,'subtitle');
      if(k.startsWith('delay-'))text('timing',k.includes('on-')?'t ON':'t OFF',cx+22,cy+3,'subtitle');
      if(id==='illuminated-push')m+=circle(cx-25,cy+27,6)+path(`M${cx-29} ${cy+23}l8 8m0-8l-8 8`);
    }else if(k==='switch-both'||k==='contact-both'||k==='selector3'||k==='selector4'){
      const common=pins[0],endPins=pins.slice(1),pivot={x:common.x,y:cy-15};m=connect(common,pivot.x,pivot.y)+dot(pivot.x,pivot.y);
      const activeGroup=groups.find(g=>states[g.id]),chosen=activeGroup?p(activeGroup.b):null;
      endPins.forEach(q=>{m+=connect(q,q.x,cy+18)+dot(q.x,cy+18)});
      m+=link(pivot,chosen?{x:chosen.x,y:cy+18}:{x:pivot.x-16,y:cy+11});
      if(k.startsWith('switch-'))m+=operatingMark(pivot.x,cy-6,id==='float'?'float':'button');
      if(k.startsWith('selector'))m+=operatingMark(pivot.x,cy-6,'selector');
    }else if(['coil','timer','coil-valve','coil-flasher','coil-pulse','relay-protection'].includes(k)){
      const radius=19;m=connect(pins[0],cx,cy-radius)+connect(pins[1],cx,cy+radius);
      if(ansi){m+=circle(cx,cy,radius);text('function',k==='timer'?'TR':id==='coil-contactor'?'M':k==='relay-protection'?d.model:k==='coil-valve'?'SOL':'CR',cx,cy+4)}
      else{
        m+=rect(cx-22,cy-19,44,38);
        if(tse&&k==='coil')m+=line(cx-22,cy+19,cx+22,cy-19);
        if(k==='timer'){
          m+=rect(cx-22,cy-19,12,38,id==='coil-delay-off'?'style="fill:#172033"':'');
          if(id!=='coil-delay-off')m+=path(`M${cx-22} ${cy-19}l12 38m0-38l-12 38`);
        }
        if(k==='coil-flasher')m+=path(`M${cx-14} ${cy+8}v-16h10v16h10v-16h8`);
        if(k==='coil-pulse')m+=path(`M${cx-15} ${cy+8}h8v-16h12v16h10`);
        if(k==='coil-valve'||id==='solenoid')m+=line(cx-16,cy+12,cx+16,cy-12);
        if(k==='relay-protection')text('function',d.model,cx,cy+4);
      }
    }else if(k==='contactor3'){
      groups.forEach(g=>m+=contact(p(g.a),p(g.b),states[g.id],{normal:Components.contactMode(c,d,g)}));
      if(!ansi)m+=line(pins[0].x-8,cy,pins[2].x+8,cy,'stroke-dasharray="5 4"');
    }else if(['breaker','breaker2','breaker3','rcd2','rcd4','fuse-switch','nh-holder'].includes(k)){
      groups.forEach(g=>{
        const a=p(g.a),b=p(g.b),x=(a.x+b.x)/2,closed=states[g.id];
        if((id.startsWith('mcb')&&norm!=='IEC')||k.startsWith('rcd')){
          m+=connect(a,x,cy-19)+connect(b,x,cy+19)+rect(x-8,cy-19,16,38);
          if(tse)m+=circle(x,cy,7)+line(x-12,cy+10,x+12,cy-10);
          else m+=path(`M${x-8} ${cy-14}h16m-16 28h16`);
          if(closed)m+=line(x,cy-19,x,cy+19);else m+=line(x,cy+19,x+13,cy+4);
        }else{
          m+=contact(a,b,closed,{knife:true,normal:Components.contactMode(c,d,g)});
          m+=path(`M${x-5} ${cy+6}l10 10m0-10l-10 10`);
          if(k==='fuse-switch'||k==='nh-holder')m+=rect(x-5,cy-30,10,12);
        }
      });
      if(groups.length>1)m+=line(pins[0].x-10,cy-23,pins[Math.min(groups.length-1,pins.length-1)].x+10,cy-23,'stroke-dasharray="5 4"');
      if(k.startsWith('rcd'))text('trip','IΔ',cx,cy+38,'subtitle');
    }else if(k==='overload'||k==='thermal-magnetic'){
      const power=groups.filter(g=>!g.auxiliary),tripY=cy+4;
      power.forEach(g=>{
        const a=p(g.a),b=p(g.b),x=a.x;
        m+=connect(a,x,tripY-21)+connect(b,x,tripY+21);
        if(k==='thermal-magnetic')m+=path(`M${x} ${tripY-21}l-9-12`);
        m+=rect(x-9,tripY-21,18,42);
        if(ansi)m+=path(`M${x} ${tripY-21}q-12 7 0 14t0 14t0 14`);
        else m+=path(`M${x} ${tripY-21}v8h-5v9h10v9h-5v16`);
        if(!states[g.id])m+=path(`M${x-7} ${tripY+22}l14-7`);
      });
      const aux=groups.find(g=>g.auxiliary);if(aux)m+=contact(p(aux.a),p(aux.b),states[aux.id],{normal:Components.contactMode(c,d,aux)});
    }else if(k==='fuse'){
      m=connect(pins[0],cx,cy-18)+connect(pins[1],cx,cy+18)+rect(cx-9,cy-18,18,36)+line(cx,cy-18,cx,cy+18);
      if(ansi)m+=circle(cx,cy,7)+line(cx-12,cy+10,cx+12,cy-10);
    }else if(k==='lamp'||k==='flasher'){
      m=radialLeads(17)+circle(cx,cy,17,c._active?'style="fill:'+Components.deviceColor(c,d)+'"':'')+path(`M${cx-12} ${cy-12}l24 24m0-24l-24 24`);
      if(k==='flasher')m+=path(`M${cx-25} ${cy-23}l-6-6M${cx+25} ${cy-23}l6-6`);
    }else if(k.includes('motor')||k==='generator'){
      const r=Math.min(28,Math.min(w,h)/2-12);m=radialLeads(r)+circle(cx,cy,r);
      text('function',k==='generator'?'G':'M',cx,cy-2);text('supply',k==='motor-dc'?'⎓':k==='motor'?'1~':'3~',cx,cy+13);
      if(k==='motor-yd')text('winding','Y / Δ',cx,cy+45,'subtitle');
      if(k==='motor-dahlender')text('winding','Δ / YY',cx+39,cy+5,'subtitle');
      if(id==='fan-1p')m+=path(`M${cx-12} ${cy}q-14-18 2-17M${cx+7} ${cy+8}q22-3 10-15M${cx} ${cy+11}q-9 22-16 4`);
    }else if(k==='transformer'||k==='autotransformer'||k==='current-transformer'){
      const top=pins.filter(q=>q.side==='top'),bottom=pins.filter(q=>q.side==='bottom'),left=cx-22,right=cx+22;
      if(id==='one-line-transformer'){
        m=circle(cx,cy-13,21)+circle(cx,cy+13,21)+pins.map(q=>connect(q,cx,q.side==='top'?cy-34:cy+34)).join('');
      }else{
        [top,bottom].forEach((set,i)=>{
          const y=cy+(i?20:-20);[...set].sort((a,b)=>a.x-b.x).forEach((q,j)=>m+=connect(q,j?right:left,y));
          if(norm==='IEC')m+=path(`M${left} ${y}`+`q5 ${i?-14:14} 11 0`.repeat(4));
          else m+=rect(left,y-4,right-left,8,'style="fill:#172033"');
        });
        m+=line(left-3,cy-4,right+3,cy-4)+line(left-3,cy+4,right+3,cy+4);
        if(k==='autotransformer')m+=path(`M${left-12} ${cy-20}v40h12M${left-17} ${cy+12}l5 8 5-8`);
        if(k==='current-transformer')text('function','I',cx+34,cy+4,'subtitle');
      }
    }else if(k==='transformer-3p'){
      const top=pins.filter(q=>q.side==='top'),bottom=pins.filter(q=>q.side==='bottom');
      top.forEach((a,i)=>{const b=bottom[i],x=a.x;m+=connect(a,x,cy-26)+connect(b,x,cy+26)+circle(x,cy-11,15)+circle(x,cy+11,15)});
    }else if(k==='resistor'||k==='potentiometer'||k==='reactor'||id==='winding'){
      const a=pins[0],b=k==='potentiometer'?pins[2]:pins[1];m=connect(a,cx,cy-23)+connect(b,cx,cy+23);
      if(k==='reactor'||id==='winding')m+=path(`M${cx} ${cy-24}`+'q-18 6 0 12'.repeat(4));
      else if(ansi)m+=path(`M${cx} ${cy-23}l-8 5 16 7-16 7 16 7-16 7 8 13`);
      else m+=rect(cx-9,cy-23,18,46);
      if(k==='potentiometer')m+=connect(pins[1],cx+23,cy)+line(cx+23,cy,cx+7,cy)+path(`M${cx+14} ${cy-5}l-7 5 7 5`);
    }else if(k==='capacitor'){
      m=connect(pins[0],cx,cy-6)+connect(pins[1],cx,cy+6)+line(cx-19,cy-6,cx+19,cy-6)+line(cx-19,cy+6,cx+19,cy+6);
    }else if(k==='diode'||k==='led'){
      m=connect(pins[0],cx,cy-15)+connect(pins[1],cx,cy+15)+path(`M${cx-16} ${cy-15}h32l-16 30z`,norm==='IEC'?'':'style="fill:#172033"')+line(cx-17,cy+15,cx+17,cy+15);
      if(k==='led')m+=path(`M${cx+15} ${cy-9}l14-14m-7 0h7v7M${cx+20} ${cy}l14-14m-7 0h7v7`,c._active?'style="stroke:'+Components.deviceColor(c,d)+';filter:drop-shadow(0 0 3px '+Components.deviceColor(c,d)+')"':'');
    }else if(['mosfet-n','mosfet-p','igbt-n'].includes(k)){
      const gx=cx-22,ch=cx+8,ex=cx+26,top=cy-24,bot=cy+24;
      m=link(p('G'),{x:gx,y:cy})+link(p(k==='igbt-n'?'C':'D'),{x:ex,y:top})+link(p(k==='igbt-n'?'E':'S'),{x:ex,y:bot})+line(gx,cy-16,gx,cy+16)+line(ch,top,ch,bot)+line(ch,top,ex,top)+line(ch,bot,ex,bot);
      if(k==='igbt-n')m+=line(cx-4,top+4,cx-4,bot-4)+path(`M${cx-8} ${cy-8}l4 5 4-5`)+text('kind','IGBT',cx+2,cy+4,'subtitle');
      else m+=line(gx+5,cy,gx+15,cy)+text('kind',k==='mosfet-n'?'N':'P',cx-7,cy-6,'subtitle');
    }else if(k==='scr'||k==='triac'||k==='diac'){
      const diode=(x,y,dir=1)=>path(dir===1?`M${x-12} ${y-12}h24l-12 24z`:`M${x+12} ${y-12}h-24l12 24z`,'style="fill:#172033"')+line(x-13,y+12,x+13,y+12);
      if(k==='scr'){
        m=link(p('A'),{x:cx,y:cy-22})+link(p('K'),{x:cx,y:cy+22})+link(p('G'),{x:cx-25,y:cy+12})+diode(cx,cy,1)+line(cx+14,cy+12,cx+24,cy+12);
      }else if(k==='diac'){
        m=connect(p('A1'),cx,cy-19)+connect(p('A2'),cx,cy+19)+diode(cx,cy-7,1)+diode(cx,cy+7,-1);
      }else{
        m=link(p('MT2'),{x:cx+19,y:cy-22})+link(p('MT1'),{x:cx+19,y:cy+22})+link(p('G'),{x:cx-25,y:cy+15})+diode(cx,cy-8,1)+diode(cx,cy+8,-1)+line(cx+13,cy+4,cx+22,cy+4)+line(cx+22,cy+4,cx+22,cy-17);
      }
    }else if(k==='rectifier'){
      const vertices=[{x:cx,y:cy-26},{x:cx+26,y:cy},{x:cx,y:cy+26},{x:cx-26,y:cy}];
      m=path(`M${cx} ${cy-26}l26 26-26 26-26-26z`);
      const edges=[[3,0],[3,2],[0,1],[2,1]];
      edges.forEach(([ai,bi])=>{const a=vertices[ai],b=vertices[bi],x=(a.x+b.x)/2,y=(a.y+b.y)/2,angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;m+=`<g transform="translate(${x} ${y}) rotate(${angle})">`+path('M-5 -5v10L5 0z',norm==='IEC'?'':'style="fill:#172033"')+line(5,-6,5,6)+'</g>'});
      m+=path(`M${pins[0].x} 0V${cy-38}H${cx}V${cy-26}M${pins[1].x} 0V${cy-32}H10V${cy+36}H${cx}V${cy+26}`);
      m+=path(`M${pins[2].x} ${h}V${cy+32}H${w-10}V${cy}H${cx+26}M${pins[3].x} ${h}V${cy+20}H18V${cy}H${cx-26}`);
    }else if(k==='power24'||k==='vfd'||k==='softstarter'){
      const x=18,y=24,bw=w-36,bh=h-48;m=boxLeads(x,y,bw,bh)+rect(x,y,bw,bh);
      if(k==='softstarter'){
        const top=pins.filter(q=>q.side==='top');top.forEach(q=>m+=path(`M${q.x} ${y}v${bh}M${q.x-6} ${cy-8}h12l-6 16zM${q.x-6} ${cy+8}h12`));
      }else{m+=line(x,y+bh,x+bw,y);text('input','~',cx-13,cy-9);text('output',k==='power24'?'⎓':'~',cx+13,cy+17);text('rating',k==='power24'?'24 VDC':'f',cx,cy+bh/2-5,'subtitle')}
    }else if(k==='sensor'||k==='detector'){
      const x=15,y=28,bw=w-30,bh=h-56;m=boxLeads(x,y,bw,bh)+rect(x,y,bw,bh);
      if(/photo/.test(id))m+=path(`M${cx-12} ${cy-15}l12-9m-7 0h7v6m-7 12l12-9m-7 0h7v6`);
      else if(/capacitive/.test(id))m+=path(`M${cx-7} ${cy-15}v18m8-18v18`);
      else if(/magnetic/.test(id))m+=path(`M${cx-9} ${cy-15}v13q9 12 18 0v-13m-18 4h6m6 0h6`);
      else if(/ultrasonic/.test(id))m+=path(`M${cx-6} ${cy-15}q10 8 0 16m7-20q14 12 0 24`);
      else m+=path(`M${cx-13} ${cy-7}q3-14 6 0t6 0t6 0t6 0`);
      m+=path(`M${cx-12} ${cy+12}h8l${states.output?10:7} ${states.output?0:-7}M${cx+6} ${cy+12}h6`);
      text('output',d.outputType||'PNP',cx,cy+bh/2-3,'subtitle');
    }else if(k.startsWith('meter-')){
      m=radialLeads(23)+circle(cx,cy,23);text('function',k==='meter-a'?'A':k==='meter-v'?'V':'Ω',cx,cy+5);
    }else if(k==='ground'){
      m=connect(pins[0],cx,cy-8)+path(`M${cx-19} ${cy-8}h38m-31 7h24m-17 7h10`);
    }else if(k==='supply'||k==='supply3'){
      m=pins.map(q=>{text('source:'+q.id,pinLabel(c,d,q,norm),q.x,28,'source-label');return line(q.x,q.y,q.x,12)}).join('');
    }else if(k.startsWith('supply-dc')){
      m=connect(pins[0],cx,cy-9)+connect(pins[1],cx,cy+9)+path(`M${cx-22} ${cy-9}h44m-34 18h24`);text('polarity','+',cx+28,cy-5,'subtitle');
    }else if(k==='terminal'||k==='distribution-block'||k==='splice'){
      if(k==='terminal')m=connect(pins[0],cx,cy-10)+connect(pins[1],cx,cy+10)+dot(cx,cy-8,4)+dot(cx,cy+8,4)+line(cx,cy-4,cx,cy+4);
      else m=pins.map(q=>connect(q,q.x,cy)+line(q.x,cy,cx,cy)).join('')+circle(cx,cy,3,'style="fill:#172033"');
      if(id==='terminal-pe')m+=path(`M${cx+6} ${cy}h13m0-7v14m5-11v8m5-6v4`);
      if(id==='power-receptacle')m+=circle(cx,cy,19);
    }else if(k==='buzzer'||k==='siren'){
      m=connect(pins[0],cx,cy-17)+connect(pins[1],cx,cy+17)+path(`M${cx-13} ${cy+17}v-13q0-28 26 0v13zM${cx-19} ${cy+17}h38M${cx-5} ${cy+22}q5 7 10 0`);
    }else if(k==='arrow'){
      m=connect(pins[0],cx,cy-20)+connect(pins[1],cx,cy+20)+line(cx,cy-20,cx,cy+20)+path(`M${cx-9} ${cy+10}l9 10 9-10`);
      if(id==='rotative-direction')m=path(`M${cx-17} ${cy+12}a21 21 0 1 1 33 2m0-11v11h-11`);
    }else if(k==='plc-io'){
      m=boxLeads(18,24,w-36,h-48)+rect(18,24,w-36,h-48);text('function','PLC I/O',cx,cy+4);
    }else{
      // Supplementary library objects retain an explicit function block. Do not
      // invent a certified symbol or a new electrical model for these objects.
      m=boxLeads(18,20,w-36,h-40)+rect(18,20,w-36,h-40,'stroke-dasharray="5 3"');text('function',d.symbolText||d.model||d.name,cx,cy+4,'subtitle');
    }
    return {body:`<g class="norm-symbol" data-symbol-norm="${norm}" data-symbol-kind="${esc(k)}">${m}</g>`,texts};
  }
  const api={choices,normalize,pinLabel,reference,drawing};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSNorms=api;
})(typeof window==='undefined'?globalThis:window);
