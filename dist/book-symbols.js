(function(root){
  'use strict';
  const Components=typeof module==='object'&&module.exports?require('./components.js'):root.CCSComponents;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Geometry is shared by palette, drawing, exported SVG and offline guide.
  // Text remains outside the rotating geometry so every annotation can be moved.
  function drawing(d,c={},norm='IEC'){
    const glyph=d.bookSymbol;if(!glyph)return null;
    const w=d.w,h=d.h,cx=w/2,cy=h/2,pins=d.pins,texts=[],states=Components.displayContactStates(c,d);
    const line=(x1,y1,x2,y2,extra='')=>`<line class="symbol" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
    const path=(s,extra='')=>`<path class="symbol" d="${s}" ${extra}/>`;
    const rect=(x,y,width,height,extra='')=>`<rect class="symbol" x="${x}" y="${y}" width="${width}" height="${height}" ${extra}/>`;
    const circle=(x,y,r,extra='')=>`<circle class="symbol" cx="${x}" cy="${y}" r="${r}" ${extra}/>`;
    const txt=(key,value,x,y,cls='subtitle')=>{if(value)texts.push({key,value,x,y,cls});return ''};
    const p=id=>pins.find(p=>p.id===id);
    const connect=(q,x,y)=>q?path(`M${q.x} ${q.y}${q.side==='top'||q.side==='bottom'?`V${y}H${x}`:`H${x}V${y}`}`):'';
    const leads=(x,y,bw,bh)=>pins.map(q=>connect(q,q.side==='left'?x:q.side==='right'?x+bw:q.x,q.side==='top'?y:q.side==='bottom'?y+bh:q.y)).join('');
    const box=()=>leads(12,24,w-24,h-48)+rect(12,24,w-24,h-48);
    const filled='style="fill:currentColor"';
    function contact(g,extra=''){
      const a=p(g.a),b=p(g.b);if(!a||!b)return '';
      const x=(a.x+b.x)/2,y=cy,closed=!!states[g.id];
      let art=connect(a,x,y-18)+connect(b,x,y+18);
      if(norm==='ANSI'&&glyph!=='packet3'&&glyph!=='thermal-1p'){
        art+=line(x,y-18,x,y-8)+line(x,y+8,x,y+18)+line(x-9,y-8,x+9,y-8)+line(x-9,y+8,x+9,y+8);
        if(Components.contactMode(c,d,g)==='NC')art+=line(x-13,y+14,x+13,y-14);
        if(closed)art+=line(x,y-8,x,y+8,'style="stroke:#159447"');
      }else art+=line(x,y+18,closed?x:x-12,y-18)+(Components.contactMode(c,d,g)==='NC'?line(x-6,y-18,x,y-18):'');
      return `<g class="norm-contact" data-contact-state="${closed?'closed':'open'}">${art}${extra}</g>`;
    }
    function sensingMark(type,x,y){
      if(type==='inductive')return line(x-10,y,x+10,y)+rect(x-5,y-2,10,4,filled);
      if(type==='capacitive')return path(`M${x-10} ${y}h7m0-5v10m6-10v10m0-5h7`);
      if(type==='optical')return path(`M${x-10} ${y}h20M${x-5} ${y-5}l9 5-9 5zM${x+5} ${y-5}v10`);
      if(type==='magnetic')return path(`M${x-8} ${y-5}v8h16v-8h-4v4h-8v-4z`,filled);
      return path(`M${x-10} ${y}h7m6 0h7`)+rect(x-3,y-5,6,10)+path(`M${x-6} ${y-5}q-3 5 0 10m12-10q3 5 0 10`);
    }
    let m='';
    if(['jog','packet3','thermal-contact','maintained','reed','thermal-1p'].includes(glyph)){
      const groups=Components.contactGroups(d);m=groups.map(g=>contact(g)).join('');
      const xs=groups.map(g=>(p(g.a).x+p(g.b).x)/2),left=Math.min(...xs);
      m+=line(Math.max(3,left-19),cy,Math.max(...xs),cy,'stroke-dasharray="3 3"');
      if(glyph==='jog'||glyph==='maintained')m+=line(Math.max(3,left-19),cy-10,Math.max(3,left-19),cy+10);
      if(glyph==='maintained')m+=path(`M${left-16} ${cy-12}h-8v8`);
      if(glyph==='packet3')m+=path(`M${left-13} ${cy+7}v-14l-5-5`);
      if(glyph==='thermal-contact')m+=path(`M${left-20} ${cy-10}h-9v20h9`)+txt('thermal','θ',cx+20,cy+4);
      if(glyph==='thermal-1p')m+=rect(left-24,cy-15,9,11)+path(`M${left-24} ${cy+5}h9v9h-9`);
      if(glyph==='reed')m+=path(`M${left-24} ${cy-7}l-7 7 7 7 7-7zM${left-24} ${cy-7}v14`);
    }else if(glyph==='overload-1p'){
      m=connect(pins[0],cx,cy-20)+connect(pins[1],cx,cy+20)+rect(cx-12,cy-20,24,40)+path(`M${cx} ${cy-20}v8h-7v24h7v8`);
    }else if(glyph==='nh-fuse'){
      m=connect(pins[0],cx,cy-20)+connect(pins[1],cx,cy+20)+rect(cx-10,cy-20,20,40)+line(cx,cy-30,cx,cy+30)+line(cx-16,cy-22,cx+16,cy-22)+line(cx-16,cy+22,cx+16,cy+22)+line(cx-14,cy+10,cx+14,cy-10);
    }else if(glyph==='dc-coil'||glyph==='solenoid-valve'){
      m=connect(p('A1'),cx,cy-18)+connect(p('A2'),cx,cy+18);
      if(norm==='ANSI')m+=circle(cx,cy,18)+txt('function',glyph==='dc-coil'?'CR':'SOL',cx,cy+4);
      else{m+=rect(cx-14,cy-18,28,36);if(glyph==='dc-coil')for(let y=cy-16;y<cy+17;y+=4)m+=line(cx-14,y,cx-9,y-3);else m+=line(cx-14,cy+18,cx+14,cy-18);}
      if(glyph==='solenoid-valve')m+=line(cx+15,cy,cx+27,cy,'stroke-dasharray="3 3"')+path(`M${cx+27} ${cy-12}h16l-16 24h16z`);
    }else if(glyph==='ac-source'){
      m=connect(pins[0],cx,cy-22)+connect(pins[1],cx,cy+22)+circle(cx,cy,22)+path(`M${cx-14} ${cy}c6-16 8-16 14 0s8 16 14 0`);
    }else if(glyph==='speaker'){
      m=connect(pins[0],cx-16,cy-8)+connect(pins[1],cx-16,cy+8)+path(`M${cx-16} ${cy-8}h12l14-10v36l-14-10h-12zM${cx-4} ${cy-8}v16M${cx+17} ${cy-12}l8-5m-8 17h10m-10 12l8 5`);
    }else if(glyph==='functional-earth'||glyph==='chassis-earth'){
      m=connect(pins[0],cx,cy);
      m+=glyph==='functional-earth'?path(`M${cx-18} ${cy}h36l-18 28z`):path(`M${cx-18} ${cy}h36m-30 0l-10 12m22-12l-10 12m22-12l-10 12`);
    }else if(glyph==='sensor'){
      const x=12,y=24,bw=w-24,bh=h-48;
      m=leads(x,y,bw,bh)+rect(x,y,bw,bh)+path(`M${x+15} ${y+8}l-7 7 7 7 7-7zM${x+15} ${y+8}v14`);
      m+=sensingMark(d.sensorPrinciple||'inductive',cx-5,y+bh-13);
      const outputs=d.dualSensor?['BK','WH']:['BK'];
      outputs.forEach((id,i)=>{const yy=cy+(d.dualSensor?(i?8:-10):0),closed=!!states[i?'other':'output'];
        m+=path(`M${cx-8} ${yy}l9 ${closed?0:-4}M${cx+4} ${yy}h9`)+(Components.contactMode(c,d,Components.contactGroups(d)[i])==='NC'?line(cx+4,yy,cx+4,yy+4):'');
      });
      txt('output',d.outputType||'PNP',cx+12,y+14);txt('subtype',d.bookMark,cx+15,y+bh-8);
    }else if(glyph==='thermocouple'){
      m='';for(let i=0;i<(pins.length>=4?2:1);i++){const yy=pins.length>=4?cy-25+i*50:cy,a=pins[i*2],b=pins[i*2+1];m+=connect(a,cx+12,yy-9)+connect(b,cx+12,yy+9)+path(`M${cx+12} ${yy-9}h-8l-20 9 20 9h8`)+circle(cx-16,yy,2,filled);txt('polarity-plus-'+i,'+',cx+20,yy-5);txt('polarity-minus-'+i,'−',cx+20,yy+13)}
    }else if(['thermistor','rtd','strain-gauge','linear-pot'].includes(glyph)){
      m=rect(cx-12,cy-25,24,50);
      if(glyph==='rtd')m+=connect(p('A'),cx,cy-25)+connect(p('B1'),cx,cy+25)+(p('B2')?connect(p('B2'),cx,cy+25):'')+(p('A2')?connect(p('A2'),cx,cy-25):'')+circle(cx,cy+25,2,filled);
      else if(glyph==='linear-pot'){const slider=cy+20-(Math.max(0,Math.min(100,Number(c.analogPosition??50)))*.4);m+=connect(p('1'),cx,cy-25)+connect(p('3'),cx,cy+25)+connect(p('2'),cx+24,slider)+path(`M${cx+24} ${slider}h-12m4-4l-4 4 4 4`);}
      else m+=connect(pins[0],cx,cy-25)+connect(pins[1],cx,cy+25);
      if(glyph==='thermistor')m+=path(`M${cx-22} ${cy+25}l44-50m-44 50h-7`);
      if(glyph==='strain-gauge')m+=path(`M${cx-7} ${cy+19}v-38h5v38h5v-38h5v38`);
      txt('measurement',d.bookMark,cx+28,cy-9);
    }else if(glyph==='loadcell'){
      m=box()+path(`M${cx} ${cy-23}l23 23-23 23-23-23z`);
      for(const [dx,dy,angle] of [[-12,-12,45],[12,-12,-45],[-12,12,-45],[12,12,45]])m+=`<g transform="translate(${cx+dx} ${cy+dy}) rotate(${angle})">${rect(-4,-8,8,16,'style="fill:white"')}</g>`;
      txt('measurement',d.bookMark,cx,cy+4);
    }else if(glyph==='encoder'){
      const r=Math.min(29,w/2-14);
      m=pins.map(q=>{const dx=q.x-cx,dy=q.y-cy,len=Math.hypot(dx,dy);return line(q.x,q.y,cx+dx/len*r,cy+dy/len*r)}).join('')+circle(cx,cy,r)+line(3,cy,cx-r,cy)+path(`M${cx-18} ${cy+8}v-12h8v12h8v-12h8v12h8`);
      txt('measurement',d.bookMark,cx,cy-12);
    }else if(glyph==='ssr'){
      m=box()+path(`M${cx-17} ${cy-16}v32m-6-26l6 6-6 6m12 1h15m-6-7l6 7-6 7M${cx-3} ${cy-24}v48`,'stroke-dasharray="3 2"');
      txt('function','SSR',cx,cy+27);
    }else if(glyph==='converter'){
      m=box()+line(12,h-24,w-12,24);txt('input',d.bookMark.split(' / ')[0],cx-14,cy-10);txt('output',d.bookMark.split(' / ')[1],cx+14,cy+18);
    }else if(['display','controller','analog-sensor','protection-block','energy-meter'].includes(glyph)){
      m=box();
      if(glyph==='display'||glyph==='controller')m+=rect(23,cy-18,w-46,27)+circle(cx-12,cy+22,2)+circle(cx,cy+22,2)+circle(cx+12,cy+22,2);
      if(glyph==='analog-sensor')m+=path(`M22 32l-5 5 5 5 5-5z`)+path(`M${cx-17} ${cy+17}h34m-7-4l7 4-7 4`);
      if(glyph==='energy-meter'){m+=line(12,34,w-12,34);if(d.id!=='meter-kwh-1p')m+=line(12,38,w-12,38)+line(12,42,w-12,42);}
      if(glyph==='protection-block')m+=path(`M24 ${cy-16}h28v22H24zM20 ${cy+10}l36-28`);
      txt('function',d.bookMark,cx,glyph==='protection-block'?cy+31:cy+3);
    }else if(glyph==='capacitor-delta'){
      m=path(`M${cx} 26L20 77h60z`)+connect(pins[0],10,18)+path('M10 18V77H20')+connect(pins[1],cx,26)+connect(pins[2],90,18)+path('M90 18V77H80');
      for(const [x,y,a] of [[35,52,30],[65,52,-30],[50,77,90]])m+=`<g transform="translate(${x} ${y}) rotate(${a})">${rect(-9,-6,18,12,'style="fill:white;stroke:none"')}${line(-9,-3,9,-3)}${line(-9,3,9,3)}</g>`;
    }else if(glyph==='surge'){
      m=connect(pins[0],cx,cy-25)+connect(pins[1],cx,cy+25)+rect(cx-8,cy-25,16,50,filled)+path(`M${cx} ${cy-18}l-5 18 5 18 5-18z`,'style="fill:white;stroke:white"');
    }else if(glyph==='busbar'){
      m=rect(12,cy-7,w-24,14)+pins.map(q=>connect(q,q.x,cy)).join('');for(let x=20;x<w-10;x+=20)m+=circle(x,cy,3);txt('role',d.bookMark,cx,cy+26);
    }else if(glyph.startsWith('phone-line')){
      m=connect(pins[0],cx,cy-20)+connect(pins[1],cx,cy+20)+line(cx,cy-20,cx,cy+20,glyph.endsWith('dashed')?'stroke-dasharray="5 4"':'');txt('system','TEL',cx+19,cy+4);
    }else if(glyph==='phone-box'){
      m=box();
      if(d.id==='phone-entry-box'){m+=line(12,cy,w-12,cy);txt('entry','BTK',cx,cy-8);txt('network','PTT',cx,cy+19);}
      else{if(d.id==='phone-floor-box')m+=line(12,h-24,w-12,24);txt('function',d.bookMark,cx,cy+5);}
    }else if(['phone-socket','power-socket','covered-socket','tv-socket','data-socket','plug'].includes(glyph)){
      // Architecture mark with separate leads: socket poles are never shorted.
      m=box();
      if(glyph==='phone-socket')m+=path(`M${cx-16} ${cy+12}v-24h32v24M${cx} ${cy-12}v-10`);
      else if(glyph==='tv-socket'||glyph==='data-socket'){
        m+=path(`M${cx+15} ${cy-18}h-30v36h30`);if(glyph==='tv-socket')m+=path(`M${cx+10} ${cy-12}h-19v24h19`);
      }else if(glyph==='plug')m+=path(`M${cx-16} ${cy-6}h32v16q-16 18-32 0zM${cx-9} ${cy-6}v-15m18 15v-15M${cx} ${cy+21}v10`);
      else{m+=path(`M${cx+14} ${cy-18}a18 18 0 0 0 0 36M${cx-4} ${cy}h-17`);if(glyph==='covered-socket')m+=line(cx+14,cy-18,cx+14,cy+18);}
      txt('system',d.bookMark,cx,cy+17);
    }else if(['telephone','receiver','dish','television','amplifier','antenna-box','exchange'].includes(glyph)){
      m=box();
      if(glyph==='telephone'||glyph==='exchange'){if(glyph==='exchange')m+=rect(18,30,w-36,h-60);txt('system',d.bookMark,cx,cy+4);}
      if(glyph==='receiver')m+=line(cx-6,24,cx-6,h-24)+line(cx+6,24,cx+6,h-24);
      if(glyph==='dish')m+=rect(cx-22,cy-14,15,28)+line(cx-29,cy,cx+2,cy)+path(`M${cx+17} ${cy-19}q-26 19 0 38`);
      if(glyph==='television')m+=path(`M${cx-15} ${cy-18}h30v36h-30zM${cx+15} ${cy-18}l-24 18 24 18M${cx+15} ${cy-18}q18 18 0 36`);
      if(glyph==='amplifier')m+=path(`M${cx-14} ${cy+16}v-32l30 16z`);
      if(glyph==='antenna-box')m+=line(12,24,w-12,h-24)+line(w-12,24,12,h-24);
    }else if(glyph==='panel-plan'){
      m=rect(10,15,w-20,h-30)+path(`M10 ${h-15}L${w-10} 15v${h-30}z`,filled);
    }else if(glyph==='junction-box'){
      m=box()+circle(cx,cy,4,filled)+pins.map(q=>connect(q,cx,cy)).join('');
    }else if(glyph==='wall-lamp'){
      m=connect(pins[0],cx,cy-18)+connect(pins[1],cx,cy+18)+circle(cx,cy,18)+path(`M${cx-12} ${cy-12}l24 24m0-24l-24 24M${cx+18} ${cy}h20m-13-7l-6 14m12-14l-6 14`);
    }else if(glyph==='blind-motor'){
      m=box()+circle(cx-6,cy,20)+path(`M${cx+14} ${cy}l4-7 5 14 5-14 5 14 5-7`);txt('function','M',cx-6,cy+5,'title');
    }else if(glyph.startsWith('knx-')){
      const f=glyph.slice(4),x=12,y=24,bw=w-24,bh=h-48;
      m=leads(x,y,bw,bh)+rect(x,y,bw,bh);
      if(f.includes('power')){
        m+=line(x,y+bh,x+bw,y)+path(`M${x+6} ${y+14}q5-12 10 0t10 0M${x+bw-27} ${y+bh-12}h20m-18 5h4m3 0h4m3 0h4`);
        if(f==='choke-power')m+=rect(x+bw-7,y,7,bh)+path(`M${x+bw-4} ${y+4}q4 4 0 8t0 8t0 8t0 8t0 8t0 8t0 8`);
      }else{
        m+=rect(x+3,y+4,7,bh-8)+path(`M${x+6.5} ${y+7}v${bh-14}m-2-4l2 4 2-4m-4-${bh-22}l2-4 2 4`);
        if(['button','temperature','time','wind','dimmer-button','smoke','motion','com','interface'].includes(f))m+=line(x+12,y+bh,x+bw,y);
        if(['coupler','logic'].includes(f))m+=rect(x+bw-10,y+4,7,bh-8);
        if(f==='coupler')m+=path(`M${cx-6} ${cy-16}l12 6-12 6zm12 14l-12-6 12-6z`);
        if(f==='button'||f==='dimmer-button')m+=circle(cx+16,cy+16,7)+circle(cx+16,cy+16,3)+line(cx+9,cy+2,cx+23,cy+2)+line(cx+12,cy-2,cx+12,cy+6);
        if(['dimmer','dimmer-button','valve'].includes(f))m+=path(`M${cx+3} ${cy-13}l23-9v9z`);
        if(['smoke','motion','dimmer'].includes(f))m+=path(`M${cx-12} ${y+18}h12v-6h12`);
        if(f==='dimmer')m+=path(`M${cx-3} ${cy+25}l27-9v9z`);
        if(f==='valve')m+=circle(cx+14,cy+5,6)+path(`M${cx+6} ${cy+15}l16 12v-12l-16 12z`);
        if(f==='com'||f==='interface')m+=path(`M${cx-12} ${y+13}h21m-5-3l5 3-5 3m-11-6l-5 3 5 3`);
      }
      txt('function',d.bookMark,cx+(f==='display'||f==='logic'?0:14),f==='button'?y+18:f==='logic'?cy+4:cy+24);
    }else if(glyph.startsWith('layout-')){
      const f=glyph.slice(7),x=16,y=18,bw=w-32,bh=h-36;
      const screws=(n,yy)=>Array.from({length:n},(_,i)=>rect(x+5+i*(bw-10)/n,yy,Math.min(9,(bw-14)/n),7)+circle(x+9+i*(bw-10)/n,yy+3.5,1.5)).join('');
      if(['lamp','start','stop','jog'].includes(f)){
        m=circle(cx,cy,24)+circle(cx,cy,20)+rect(cx-16,cy-7,32,14)+circle(cx-10,cy,2)+circle(cx+10,cy,2);if(f==='lamp')m+=circle(cx,cy,8);else if(f==='jog')m+=circle(cx,cy,3);
      }else if(f==='bar'){
        m=rect(x,cy-8,bw,16)+screws(6,cy-4);
      }else if(f==='terminals'){
        for(let i=0;i<6;i++)m+=rect(x+i*11,y,9,bh)+circle(x+4+i*11,y+12,2)+circle(x+4+i*11,y+bh-12,2);
      }else if(f==='nh'){
        m=rect(x,cy-10,bw,20)+rect(x+16,cy-14,bw-32,28)+circle(x+6,cy,3)+circle(x+bw-6,cy,3);
      }else{
        m=rect(x,y,bw,bh,'rx="4"');
        const count=f==='mcb1'?1:f==='meter3'||f==='meter-ct'?7:3;
        m+=screws(count,y+5)+screws(count,y+bh-12);
        if(f==='packet')m+=circle(cx,cy,21)+path(`M${cx-10} ${cy+13}l10-29 10 29z`);
        else if(f.startsWith('capacitor'))m+=line(x,y+20,x+bw,y+20);
        else if(f==='ct')m+=rect(cx-18,cy-17,36,34,'rx="4"');
        else if(['mcb1','mcb3','thermal','motor-breaker'].includes(f)){
          const n=f==='mcb3'?3:1;for(let i=0;i<n;i++)m+=rect(cx-7+(i-(n-1)/2)*18,cy-12,14,25)+rect(cx-5+(i-(n-1)/2)*18,cy-3,10,10,filled);
        }else if(f.startsWith('meter')||f==='ammeter'||f==='voltmeter')m+=rect(cx-20,cy-19,40,25,'rx="2"');
        else if(f==='timer'||f==='motor-relay')m+=circle(cx-18,cy-16,6)+line(cx-18,cy-16,cx-15,cy-20);
        else if(f==='contactor')m+=rect(cx-18,cy-18,36,36)+rect(cx-5,cy-5,10,10);
        txt('function',d.bookMark,cx,cy+25);
      }
    }
    return {body:`<g class="norm-symbol book-symbol" data-symbol-norm="${esc(norm)}" data-symbol-kind="${esc(d.kind)}" data-book-symbol="${esc(glyph)}">${m}</g>`,texts};
  }
  const api={drawing};if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSBookSymbols=api;
})(typeof window==='undefined'?globalThis:window);
