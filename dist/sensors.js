(function(root){
  'use strict';
  const MM=5,materials=[['none','Hedef yok · elle tetikle'],['metal','Metal parça'],['plastic','Plastik parça'],['wood','Ahşap parça'],['liquid','Sıvı dolu kap'],['reflector','Reflektör'],['magnet','Mıknatıs']];
  const attr=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp=(v,a,b,f=a)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
  const supported=d=>!!d&&(d.reedSensor||(['sensor','detector'].includes(d.kind)&&(['inductive','capacitive','optical','ultrasonic'].includes(d.sensorPrinciple)||(d.id==='sensor-hall'&&d.sensorPrinciple==='magnetic'))));
  function settings(c,d){
    const s=c.sensing||{},range=clamp(s.range,.1,400,d.sensingRange||(d.sensorPrinciple==='optical'?40:d.sensorPrinciple==='capacitive'?10:4));
    const freeSide=['right','left','bottom','top'].sort((a,b)=>d.pins.filter(p=>p.side===a).length-d.pins.filter(p=>p.side===b).length)[0];
    return {mm:d.sensorPrinciple==='ultrasonic'?.35:MM,target:d.reedSensor?'magnet':materials.some(([v])=>v===s.target)?s.target:'none',range,distance:clamp(s.distance,0,1000,range*1.5),offset:clamp(s.offset,-200,200,0),face:['right','left','bottom','top'].includes(s.face)?s.face:freeSide,auto:!!s.auto,travelDirection:s.travelDirection===-1?-1:1};
  }
  function detect(c,d){
    if(!supported(d))return {enabled:false,detected:!!c.state};
    const s=settings(c,d),enabled=s.target!=='none';
    const compatible=d.reedSensor?s.target==='magnet':d.id==='sensor-hall'&&d.sensorPrinciple==='magnetic'?s.target==='magnet':d.sensorPrinciple==='inductive'?s.target==='metal':d.sensorPrinciple==='optical'?['metal','plastic','wood','reflector'].includes(s.target):s.target!=='none';
    const within=s.distance<=s.range+1e-8&&s.distance>=(d.sensorMinimum||0)&&Math.abs(s.offset)<=(d.sensorPrinciple==='ultrasonic'?Math.max(3,s.distance*Math.tan(Math.PI/30)):6);
    return {...s,enabled,compatible,within,detected:enabled?compatible&&within:!!c.state};
  }
  const actuated=(c,d)=>{const result=detect(c,d);return result.enabled?result.detected:!!c.state};
  function geometry(c,d){
    const s=settings(c,d),side=s.face,v={right:{x:1,y:0},left:{x:-1,y:0},top:{x:0,y:-1},bottom:{x:0,y:1}}[side],n={x:-v.y,y:v.x};
    const origin={x:side==='right'?d.w:side==='left'?0:d.w/2,y:side==='bottom'?d.h:side==='top'?0:d.h/2};
    const center={x:origin.x+v.x*(s.distance*s.mm+20)+n.x*s.offset*s.mm,y:origin.y+v.y*(s.distance*s.mm+20)+n.y*s.offset*s.mm};
    const angle=(c.rotation||0)*Math.PI/180,rotateVector=p=>({x:p.x*Math.cos(angle)-p.y*Math.sin(angle),y:p.x*Math.sin(angle)+p.y*Math.cos(angle)});
    return {s,origin,center,v,n,worldV:rotateVector(v),worldN:rotateVector(n)};
  }
  function beginDrag(c,d){return {...settings(c,d),...geometry(c,d)}}
  function drag(c,d,start,delta){
    c.sensing={...settings(c,d),auto:false,distance:clamp(start.s.distance+(delta.x*start.worldV.x+delta.y*start.worldV.y)/start.s.mm,0,1000),offset:clamp(start.s.offset+(delta.x*start.worldN.x+delta.y*start.worldN.y)/start.s.mm,-200,200)};
  }
  function advance(c,d,dt){
    const s=settings(c,d);if(!supported(d)||s.target==='none'||!s.auto)return false;
    const low=s.range*.2,high=s.range*1.8,span=high-low,speed=span/1.4;
    let next=s.distance+speed*Math.max(0,Math.min(.1,dt))*s.travelDirection,dir=s.travelDirection;
    if(next>high){next=high-(next-high);dir=-1}if(next<low){next=low+(low-next);dir=1}
    c.sensing={...s,distance:clamp(next,low,high),offset:0,travelDirection:dir};return true;
  }
  function markup(c,d){
    if(!supported(d)||!detect(c,d).enabled)return '';
    if(d.reedSensor){
      const {s,center}=geometry(c,d),detected=detect(c,d).detected,id='reed-magnet-'+attr(c.id||d.id);
      return `<g class="sensor-environment reed-environment" transform="rotate(${c.rotation||0} ${d.w/2} ${d.h/2})"><g class="sensor-target" data-sensor-target="${attr(c.id)}" transform="translate(${center.x} ${center.y})" role="button" tabindex="0" aria-label="Kablosuz mıknatısı sürükleyin"><rect class="target-hit" x="-29" y="-29" width="58" height="58" rx="4"/><svg x="-27" y="-25" width="54" height="50" viewBox="214 205 214 187"><defs><clipPath id="${id}"><path d="M216 316L334 207L424 259L423 278L306 389L217 350Z"/></clipPath></defs><image href="assets/products/reed-mr228b-v113.jpg" width="500" height="500" clip-path="url(#${id})"/></svg><path d="M-14 33h28m-6-4l6 4-6 4m-16-8l-6 4 6 4" fill="none" stroke="#64748b" stroke-width="2"/><text y="50" transform="rotate(${-Number(c.rotation||0)} 0 50)" text-anchor="middle" font-size="10" fill="#334155">Mıknatıs · ${s.distance.toFixed(1)} mm</text></g><text x="${d.w/2}" y="${d.h+8}" transform="rotate(${-Number(c.rotation||0)} ${d.w/2} ${d.h+8})" text-anchor="middle" font-size="9" fill="${detected?'#15803d':'#64748b'}">${detected?'Mıknatıs yakın':'Mıknatıs uzak'}</text></g>`;
    }
    const {s,origin,center,v,n}=geometry(c,d),r=s.range*s.mm,status=detect(c,d),active=status.detected&&c._active;
    const end={x:origin.x+v.x*r,y:origin.y+v.y*r};
    const color={metal:'#94a3b8',plastic:'#f59e0b',wood:'#ad7046',liquid:'#38bdf8',reflector:'#ef4444',magnet:'#cbd5e1'}[s.target];
    let texture='';
    if(s.target==='metal')texture='<path d="M-14 -10h22m-22 6h12m-12 7h28" stroke="#dbeafe" stroke-width="2"/><circle cx="11" cy="10" r="3" fill="#64748b"/>';
    if(s.target==='wood')texture='<path d="M-15 -9q18 8 30 0M-15 0q18 8 30 0M-15 9q18 8 30 0" fill="none" stroke="#774929"/>';
    if(s.target==='liquid')texture='<path d="M-16 -3q8-5 16 0t16 0v18h-32z" fill="#0284c7"/><path d="M-9 -15v7" stroke="white" stroke-width="3"/>';
    if(s.target==='reflector')texture='<path d="M-14 -12l28 24m0-24l-28 24M0-17v34M-17 0h34" stroke="#fecaca" stroke-width="2"/>';if(s.target==='magnet')texture='<g data-hall-magnet-icon="1"><rect x="-15" y="-12" width="15" height="24" fill="#d94646"/><rect x="0" y="-12" width="15" height="24" fill="#3776bd"/><text x="-8" y="4" text-anchor="middle" fill="white" font-size="10">N</text><text x="8" y="4" text-anchor="middle" fill="white" font-size="10">S</text></g>';
    return `<g class="sensor-environment ${active?'target-detected':''}" transform="rotate(${c.rotation||0} ${d.w/2} ${d.h/2})"><path class="sensor-range" d="M${origin.x} ${origin.y}L${end.x+n.x*14} ${end.y+n.y*14}L${end.x-n.x*14} ${end.y-n.y*14}Z"/><path class="sensor-beam" d="M${origin.x} ${origin.y}L${end.x} ${end.y}"/><line class="sensor-limit" x1="${end.x+n.x*18}" y1="${end.y+n.y*18}" x2="${end.x-n.x*18}" y2="${end.y-n.y*18}"/><g class="sensor-target" data-sensor-target="${attr(c.id)}" transform="translate(${center.x} ${center.y})" role="button" tabindex="0" aria-label="Sensör hedefini sürükleyin"><rect class="target-hit" x="-25" y="-25" width="50" height="50" rx="6"/><rect class="target-solid" x="-18" y="-18" width="36" height="36" rx="4" fill="${color}"/>${texture}<path d="M-8 24h16m-5-4l5 4-5 4m-6-8l-5 4 5 4" fill="none" stroke="#64748b" stroke-width="1.5"/></g></g>`;
  }
  const api={MM,materials,supported,settings,detect,actuated,geometry,beginDrag,drag,advance,markup};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSSensors=api;
})(typeof window==='undefined'?globalThis:window);
