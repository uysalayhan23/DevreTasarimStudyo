(function(root){
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function markup(d,c={}){
    const installation=(typeof module==='object'&&module.exports?require('./installation-v118.js'):root.DTSInstallation).material(d,c);if(installation)return installation;
    const color=/^#[0-9a-f]{6}$/i.test(c.deviceColor||'')?c.deviceColor:(d.color||'#ffe18a');
    const w=d.w,h=d.h,cx=w/2,cy=h/2,id=d.id,scope=Array.from(c.id||id).map(c=>c.codePointAt(0).toString(16)).join(''),gid='dv-'+scope;
    const screw=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#adb5bb" stroke="#58616a"/><path d="M${x-2} ${y}h4" stroke="#334155"/>`;
    const box=(x,y,bw,bh,fill=`url(#${gid})`)=>`<path d="M${x+4} ${y+bh+4}h${bw}v-${bh}l-4-4z" fill="#9ba5ad"/><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" fill="${fill}" stroke="#737f8b"/>`;
    let art='';
    if(d.kind==='ac-virtual-source'||d.kind==='ac-scr-trigger'){
      const isSource=d.kind==='ac-virtual-source';
      const angle=Number.isFinite(c.triggerAngleDeg)?c.triggerAngleDeg:d.defaultTriggerAngleDeg??90;
      const wave=Array.from({length:29},(_,i)=>(i?'L':'M')+(22+i*(w-44)/28).toFixed(1)+' '+(89-16*Math.sin(i*2*Math.PI/28)).toFixed(1)).join(' ');
      art='<rect x="10" y="12" width="'+(w-20)+'" height="'+(h-24)+'" rx="11" fill="#293c4b" stroke="#a9c0d2" stroke-width="3"/>'+
        '<rect x="18" y="22" width="'+(w-36)+'" height="25" rx="4" fill="#102638"/>'+
        '<text x="'+cx+'" y="39" text-anchor="middle" font-size="11" font-weight="bold" fill="#edf8ff">'+(isSource?'ISOLATED AC 12V':'SCR PHASE TRIGGER')+'</text>'+
        '<rect x="19" y="53" width="'+(w-38)+'" height="20" rx="3" fill="#104542"/>'+
        '<text x="'+cx+'" y="67" text-anchor="middle" font-family="monospace" font-size="11" fill="#8affca">'+(isSource?'12 V RMS / 50 Hz':'FIRE '+esc(angle)+'°')+'</text>'+
        '<path d="'+(isSource?wave:('M22 92h30v-13h22v13h43'))+'" fill="none" stroke="#59d8ff" stroke-width="2.5"/>'+
        '<text x="20" y="'+(h-14)+'" font-size="8" fill="#d7e6ef">'+(isSource?'VIRTUAL · NO MAINS':'AC REFERENCED · VIRTUAL')+'</text>'+
        (isSource?'<text x="'+(w-24)+'" y="34" text-anchor="end" font-size="9" fill="white">AC</text><text x="'+(w-24)+'" y="104" text-anchor="end" font-size="9" fill="white">RET</text>':'<text x="20" y="31" font-size="9" fill="white">AC</text><text x="20" y="111" font-size="9" fill="white">RET</text><text x="'+(w-20)+'" y="66" font-size="9" fill="white" text-anchor="end">OUT</text>');
    }else     if(d.kind==='pwm-generator'||id==='virtual-pwm-generator-v1'){
      const duty=typeof c.dutyPercent==='number'&&Number.isFinite(c.dutyPercent)?Math.max(0,Math.min(100,c.dutyPercent)):d.defaultDutyPercent??0;
      const hz=typeof c.frequencyHz==='number'&&Number.isFinite(c.frequencyHz)?c.frequencyHz:d.defaultFrequencyHz??1000;
      const on=!!c._pwmHigh,active=!!c._pwmSupplyValid;
      const left=22,right=w-22,top=16,bottom=h-15;
      // Schematic waveform is an illustrative duty ratio, not an oscilloscope measurement.
      const waveWidth=Math.max(20,(right-left-28)/2),waveStart=left+14,waveLow=top+89,waveHigh=waveLow-10;
      const pulse=(x)=>duty<=0?`M${x} ${waveLow}h${waveWidth}`:duty>=100?`M${x} ${waveHigh}h${waveWidth}`:`M${x} ${waveLow}v-10h${waveWidth*duty/100}v10h${waveWidth*(100-duty)/100}`;
      const waveform=pulse(waveStart)+' '+pulse(waveStart+waveWidth);
      art=`<rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}" rx="12" fill="#253747" stroke="#a7b8c6" stroke-width="3"/>
        <rect x="${left+9}" y="${top+9}" width="${right-left-18}" height="23" rx="4" fill="#101f2d" stroke="#506777"/>
        <text x="${cx}" y="${top+25}" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#ecfaff">PWM GENERATOR</text>
        <rect x="${left+10}" y="${top+42}" width="${right-left-20}" height="34" rx="5" fill="#072c2c" stroke="#55a99f"/>
        <text x="${left+18}" y="${top+56}" font-family="monospace" font-size="10" fill="#9df5bf">DUTY ${esc(duty)}%</text>
        <text x="${left+18}" y="${top+69}" font-family="monospace" font-size="10" fill="#9df5bf">FREQ ${esc(hz)} Hz</text>
        <path d="${waveform}" stroke="${active?'#65d6f7':'#667586'}" fill="none" stroke-width="2.5"/>
        <circle cx="${right-17}" cy="${bottom-19}" r="5" fill="${active?(on?'#35e6a7':'#e6ae43'):'#667586'}" stroke="#d0e5f1"/>
        <text x="${left+14}" y="${bottom-12}" fill="#deebf3" font-size="8">VIRTUAL · DC PWM</text>
        <rect x="4" y="24" width="18" height="12" rx="3" fill="#e4ebf2" stroke="#556778"/>
        <rect x="4" y="107" width="18" height="12" rx="3" fill="#e4ebf2" stroke="#556778"/>
        <rect x="${w-22}" y="65" width="18" height="12" rx="3" fill="#e4ebf2" stroke="#556778"/>
        <text x="25" y="30" font-size="9" fill="#e3edf5">V+</text>
        <text x="25" y="116" font-size="9" fill="#e3edf5">GND</text>
        <text x="${w-26}" y="62" font-size="9" fill="#e3edf5" text-anchor="end">OUT</text>`;
    }else     if(['bjt-npn','bjt-pnp','mosfet-n','mosfet-p','igbt-n','scr','triac','diac','opamp'].includes(id)){
      const pkg=/bjt-/.test(id)?'TO-92':id==='diac'?'DO-35':id==='opamp'?'DIP-8':id==='igbt-n'?'TO-247':'TO-220';
      if(pkg==='TO-92'){
        art=`<path d="M${cx-17} ${cy-18}Q${cx} ${cy-34} ${cx+17} ${cy-18}V${cy+5}Q${cx} ${cy+18} ${cx-17} ${cy+5}Z" fill="#26343d" stroke="#101820"/><path d="M${cx-17} ${cy-12}h34" stroke="#4f6974"/><text x="${cx}" y="${cy}" fill="#e7eff2" font-size="7" text-anchor="middle">${id==='bjt-npn'?'NPN':'PNP'}</text><path d="M${cx-11} ${cy+8}v34m0-34v34m11-34v34" stroke="#b6bec2" stroke-width="3"/>`;
      }else if(pkg==='DO-35'){
        art=`<rect x="${cx-21}" y="${cy-12}" width="42" height="24" rx="11" fill="#26343d" stroke="#101820"/><path d="M${cx-36} ${cy}h15m42 0h15" stroke="#b6bec2" stroke-width="3"/><path d="M${cx-16} ${cy-11}v22" stroke="#d9e0e4" stroke-width="2"/><text x="${cx}" y="${cy+4}" fill="white" font-size="7" text-anchor="middle">DIAC</text>`;
      }else if(pkg==='DIP-8'){
        art=`<path d="M${cx-27} ${cy-25}h54v50h-54z" fill="#202a31" stroke="#0d151a" stroke-width="2"/><path d="M${cx-8} ${cy-25}a8 8 0 0 0 16 0" fill="#dbe3e6"/><text x="${cx}" y="${cy+4}" fill="#fff" font-size="8" text-anchor="middle">OP AMP</text>`;
        for(let i=0;i<4;i++){const x=cx-20+i*13.3;art+=`<path d="M${x} ${cy-25}v-10m0 60v10" stroke="#b8c1c5" stroke-width="3"/>`}
      }else{
        art=`<path d="M${cx-25} ${cy-31}h50v62h-50z" fill="#202a31" stroke="#0d151a" stroke-width="2"/><path d="M${cx-19} ${cy-23}h38v8h-38z" fill="#b9c2c7" stroke="#6d7880"/><circle cx="${cx}" cy="${cy-19}" r="4" fill="#29333b" stroke="#6d7880"/><text x="${cx}" y="${cy+8}" fill="#f4f6f7" font-size="8" text-anchor="middle">${esc(id.toUpperCase())}</text><path d="M${cx-14} ${cy+31}v14m0-14v14m14-14v14m14-14v14" stroke="#b8c1c5" stroke-width="3"/>`;
      }
    }else if(/wall-(switch|vavien|commutator|intermediate)|knx-.*button|knx-single|knx-double/.test(id)){
      art=box(12,24,w-24,h-48)+box(24,35,w-48,h-70,c.state?'#c5ccd2':'#fbfdff');if(/commutator|double/.test(id))art+=`<path d="M${cx} 36v${h-72}" stroke="#a1a8b1"/>`;
    }else if(/socket|plug|power-receptacle/.test(id)){
      art=box(12,24,w-24,h-48)+`<circle cx="${cx}" cy="${cy}" r="22" fill="#e1e5e8" stroke="#7d8791"/>`;
      art+=['-8','8'].map(x=>`<circle cx="${cx+Number(x)}" cy="${cy}" r="3.8" fill="#26313a"/>`).join('');
      if(/plug/.test(id))art+=`<path d="M${cx-10} ${cy-17}v-15m20 15v-15" stroke="#adb5bd" stroke-width="5"/>`;else art+=`<path d="M${cx-18} ${cy-7}v14m36-14v14" stroke="#8b7957" stroke-width="3"/>`;
    }else if(/^bar-|earth|ground/.test(id)){
      art=box(12,cy-16,w-24,32,id==='bar-n'?'#2473ce':'#34a66c')+`<rect x="18" y="${cy-10}" width="${w-36}" height="20" rx="3" fill="#cfa54b" stroke="#7f642d"/>`;for(let x=24;x<w-20;x+=14)art+=screw(x,cy);
    }else if(/lampholder|ceiling-light|led-luminaire|wall-light/.test(id)){
      art=box(12,cy-25,w-24,50)+`<ellipse cx="${cx}" cy="${cy}" rx="${(w-38)/2}" ry="19" fill="${c._active?color:'#e5edf3'}" stroke="#acb8c5"/>`;if(c._active)art+=`<ellipse cx="${cx}" cy="${cy}" rx="${(w-44)/2}" ry="16" fill="${color}" opacity=".85"/>`;
    }else if(/door-isolator|layout-packet/.test(id)){
      art=box(14,cy-31,w-28,62,'#f8ce43')+`<rect x="21" y="${cy-24}" width="${w-42}" height="48" rx="3" fill="#29333d"/><text x="${cx}" y="${cy-11}" fill="white" font-size="7" text-anchor="middle">0   I</text><g transform="rotate(${c.state?45:0} ${cx} ${cy+3})"><rect x="${cx-6}" y="${cy-10}" width="12" height="32" rx="4" fill="#da3b31" stroke="#84211d"/></g>`;
    }else if(/meter|indicator|layout-voltmeter|layout-ammeter/.test(id)){
      art=box(10,25,w-20,h-50,'#34434f')+`<rect x="18" y="34" width="${w-36}" height="${h-72}" rx="2" fill="#dce9dc"/><text x="${cx}" y="${cy+4}" font-family="monospace" font-size="13" text-anchor="middle" fill="#203c37">${/voltmeter/.test(id)?'V':/ammeter/.test(id)?'A':'0000'}</text>`;
    }else if(/sensor|knx-presence|knx-motion/.test(id)){
      art=box(14,25,w-28,h-50,'#416875')+`<circle cx="${cx}" cy="${cy}" r="18" fill="#1d303a" stroke="#9bc6d1" stroke-width="3"/><circle cx="${cx+11}" cy="${cy-21}" r="3" fill="${c._closed?'#4ade80':'#eab308'}"/>`;
    }else if(id==='panel-din-rail'){
      art=`<rect x="10" y="${cy-14}" width="${w-20}" height="28" fill="#a9b6c1" stroke="#5d6a76"/><path d="M10 ${cy-9}h${w-20}M10 ${cy+9}h${w-20}" stroke="#f6fafc" stroke-width="4"/>`;for(let x=24;x<w-16;x+=20)art+=`<rect x="${x}" y="${cy-3}" width="9" height="6" rx="2" fill="#677581"/>`;
    }else if(id==='panel-duct'){
      art=box(18,16,w-36,h-32);for(let y=25;y<h-20;y+=9)art+=`<path d="M18 ${y}h10m${w-56} 0h10" stroke="#738392" stroke-width="4"/>`;
    }else{
      art=box(15,18,w-30,h-36)+`<path d="M18 40h${w-36}" stroke="#1d788b" stroke-width="9"/><text x="${cx}" y="${cy+6}" fill="#344054" font-family="Arial" font-size="${Math.min(9,(w-35)/8)}" text-anchor="middle">${esc(d.bookMark||d.name.split(' ').slice(0,2).join(' '))}</text>`+screw(25,27)+screw(w-25,h-27);
    }
    if(d.id==='wall-commutator')for(const [i,key] of ['a','b'].entries())art+='<g data-installation-contact="'+key+'" role="button" tabindex="0" aria-label="'+(i+1)+'. anahtar"><rect x="'+(24+i*26)+'" y="35" width="24" height="50" fill="'+(c.switchStates?.[key]?'#c4cdd3':'#f7f9fa')+'" stroke="#c1c8ce" rx="2"/><path d="M'+(34+i*26)+' 48v8" stroke="#a0abb3"/></g>';
    if(c.rotation)art=art.replace(/<text ([^>]*)>([\s\S]*?)<\/text>/g,(full,attrs,body)=>{const x=Number(attrs.match(/\bx="([^"]+)"/)?.[1]||0),y=Number(attrs.match(/\by="([^"]+)"/)?.[1]||0);return '<text '+attrs+' transform="rotate('+(-c.rotation)+' '+x+' '+y+')">'+body+'</text>'});
    return `<g class="material-layer design-material" data-material="design-${esc(id)}"><defs><linearGradient id="${gid}" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".5" stop-color="#e8edf0"/><stop offset="1" stop-color="#b7c1c9"/></linearGradient></defs>${art}</g>`;
  }
  const api={markup};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSDesignVisuals=api;
})(typeof window==='undefined'?globalThis:window);
