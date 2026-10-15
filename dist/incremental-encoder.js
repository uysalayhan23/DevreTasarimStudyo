(function(root){
  'use strict';
  const PPRS=[100,360,400,600,1000];
  const clamp=(v,a,b,f=a)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
  const mod=(n,m)=>((n%m)+m)%m;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isMotorDef=d=>!!d&&!d.incrementalEncoder38mm&&d.kind!=='pwm-generator'&&(d.hcfaServoMotor||/motor|generator/.test(String(d.kind||'')));
  function installMechanicalPins(lib=root.COMPONENT_LIBRARY){
    if(!Array.isArray(lib))return;
    const enc=lib.find(d=>d.id==='encoder-incremental'||d.incrementalEncoder38mm);
    if(enc&&!enc.pins.some(p=>p.id==='SHAFT'))enc.pins.push({id:'SHAFT',label:'SHAFT · mekanik mil',x:0,y:72,side:'left',mechanical:true,signalType:'MECH',labelOffset:{x:16,y:-8},labelSize:6});
    for(const d of lib)if(d?.kind==='pwm-generator'){
      if(Array.isArray(d.pins))d.pins=d.pins.filter(p=>p.id!=='SHAFT'&&!p.mechanical);
      delete d.mechanicalShaft;
    }
    for(const d of lib)if(isMotorDef(d)&&!d.pins?.some(p=>p.id==='SHAFT')){
      d.pins=d.pins||[];const left=!!d.hcfaServoMotor;d.pins.push({id:'SHAFT',label:'SHAFT · mekanik çıkış',x:left?0:(d.w||160),y:Math.max(24,Math.round((d.h||120)/2)),side:left?'left':'right',mechanical:true,signalType:'MECH',labelOffset:{x:left?14:-14,y:-8},labelSize:6});
      d.mechanicalShaft=true;
    }
    if(enc){enc.mechanicalShaft=true;enc.encoderManualStepRpm=25;enc.encoderManualMaxRpm=Number(enc.encoderMechanicalMaxRpm||5000)}
  }
  function ppr(c,d={}){
    const n=Math.round(Number(c?.encoderPPR??d.encoderPPR??100));
    return PPRS.includes(n)?n:PPRS.reduce((a,b)=>Math.abs(b-n)<Math.abs(a-n)?b:a,100);
  }
  function state(c,d={},now=Date.now(),advance=true){
    const pulses=ppr(c,d),allowable=Number(d.encoderMaxRpm||3000),mechanical=Number(d.encoderMechanicalMaxRpm||5000);
    const rpm=clamp(c.encoderRPM,-mechanical,mechanical,0);
    let angle=Number(c.encoderMechanicalAngle);if(!Number.isFinite(angle))angle=Number(c.encoderAngle)||0;
    if(!Number.isFinite(c._encoderLastTime))c._encoderLastTime=Number(now)||0;
    const dt=Math.max(0,Math.min(.1,((Number(now)||0)-Number(c._encoderLastTime||0))/1000));
    c._encoderLastTime=Number(now)||0;
    if(advance&&c.encoderAuto!==false&&rpm)angle+=rpm*6*dt;
    const q=Math.floor(angle/360*pulses*4),phase=mod(q,4),seq=[[1,1],[0,1],[0,0],[1,0]][phase];
    const revQ=mod(q,pulses*4),z=revQ===0?0:1,pulseHz=Math.abs(rpm)*pulses/60;
    c.encoderPPR=pulses;c.encoderRPM=rpm;c.encoderMechanicalAngle=angle;c.encoderAngle=mod(angle,360);
    c.encoderPosition=q;c.encoderCount=Math.trunc(q/4);c._encoderA=seq[0];c._encoderB=seq[1];c._encoderZ=z;c._encoderPulseHz=pulseHz;
    c._encoderOverspeed=Math.abs(rpm)>allowable;c._encoderResponseOver=pulseHz>Number(d.encoderMaxResponseHz||100000);
    return {ppr:pulses,rpm,angle:c.encoderAngle,count:c.encoderCount,A:c._encoderA,B:c._encoderB,Z:c._encoderZ,pulseHz,overspeed:c._encoderOverspeed,responseOver:c._encoderResponseOver};
  }
  function setAngle(c,d,angle,now=Date.now()){c.encoderMechanicalAngle=Number(angle)||0;c.encoderRPM=0;c.encoderAuto=false;c._encoderLastTime=Number(now)||0;return state(c,d,now,false)}
  function addAngle(c,d,delta,now=Date.now()){return setAngle(c,d,(Number(c.encoderMechanicalAngle)||0)+(Number(delta)||0),now)}
  function line(c,p){return p==='A'?Number(c._encoderA??1):p==='B'?Number(c._encoderB??1):p==='Z'?Number(c._encoderZ??1):null}
  function supply(c,d,net){
    const v=net?.dcVoltage?.(c,'+','−');c._encoderSupplyVoltage=v;
    if(v===null||v===undefined)return 'off';if(v<0)return 'reversed';
    if(v>=Number(d.encoderSupplyMin||5)&&v<=Number(d.encoderSupplyMax||24))return 'ok';return 'invalid';
  }
  function mechanicalWire(w){return !!(w?.mechanical||w?.role==='MECHANICAL')}
  function motorCoupling(project,byId,encoder){
    const w=(project?.wires||[]).find(w=>mechanicalWire(w)&&((w.from?.c===encoder.id&&w.from?.p==='SHAFT')||(w.to?.c===encoder.id&&w.to?.p==='SHAFT')));
    if(!w)return null;const other=w.from?.c===encoder.id?w.to:w.from;if(!other?.c||other.p!=='SHAFT')return null;
    const motor=project.components.find(c=>c.id===other.c),d=motor&&byId[motor.typeId];return motor&&isMotorDef(d)?motor:null;
  }
  function motorRpm(motor,d={}){
    if(!motor?._active)return 0;
    const mag=Number(motor._motorRPM??motor.motorRatedRpm??d.motorSpec?.ratedRpm??d.ratedRpm??1500);
    const sign=Number(motor._spin||1)<0?-1:1;return Number.isFinite(mag)?Math.abs(mag)*sign:0;
  }
  function syncMotor(c,d,project,byId,now=Date.now(),advance=true){
    const motor=motorCoupling(project,byId,c);
    if(!motor){delete c._encoderMotorId;delete c._encoderMotorRef;return null}
    const md=byId[motor.typeId]||{};c._encoderMotorId=motor.id;c._encoderMotorRef=motor.ref||motor.label||motor.id;c.encoderRPM=motorRpm(motor,md);c.encoderAuto=true;
    return state(c,d,now,advance);
  }
  function manualAdjust(c,d,direction,heldMs=0,now=Date.now()){
    const max=Number(d.encoderMechanicalMaxRpm||5000),base=Number(d.encoderManualStepRpm||25),ramp=1+Math.min(9,Math.max(0,Number(heldMs)||0)/500);
    c.encoderAuto=true;c.encoderRPM=clamp(Number(c.encoderRPM||0)+Math.sign(direction||0)*base*ramp,-max,max,0);c._encoderLastTime=Number(now)||0;return state(c,d,now,false);
  }
  function markup(c,d){
    const view={...c},s=state(view,d,c._encoderLastTime||0,false),powered=!!c._encoderPowered,ang=s.angle,coupled=!!c._encoderMotorId;
    const status=coupled?'MOTOR: '+esc(c._encoderMotorRef||'BAĞLI'):!powered?'BESLEME YOK':s.responseOver?'FREKANS SINIRI':s.overspeed?'3000 rpm ÜSTÜ':'MANUEL';
    const statusColor=coupled?'#2563eb':!powered?'#8b949e':s.responseOver||s.overspeed?'#ffb347':'#6ee787',phase=x=>Number(x)===0?'L':'H';
    const controls=coupled?'':'<g class="encoder-jog-controls"><g data-encoder-jog="1" role="button" tabindex="0" aria-label="İleri yönde hızlandır"><rect x="8" y="112" width="27" height="24" rx="5" fill="#e8f3ff" stroke="#3976ad"/><text x="21.5" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="#185a91">↑</text></g><g data-encoder-jog="-1" role="button" tabindex="0" aria-label="Geri yönde hızlandır"><rect x="40" y="112" width="27" height="24" rx="5" fill="#fff0ee" stroke="#b45b52"/><text x="53.5" y="128" text-anchor="middle" font-size="13" font-weight="800" fill="#9b352c">↓</text></g></g>';
    return '<g class="incremental-encoder38 material-orthographic">'+
      '<path d="M26 72H12" stroke="#cfd5d8" stroke-width="9"/><rect x="26" y="38" width="132" height="82" rx="14" fill="#242a2f" stroke="#0d1114" stroke-width="3"/>'+
      '<ellipse cx="92" cy="38" rx="54" ry="13" fill="#aeb8bd" stroke="#5d686e" stroke-width="3"/><ellipse cx="92" cy="31" rx="18" ry="10" fill="#d7dddf" stroke="#68747a" stroke-width="2"/>'+
      '<g data-industrial-encoder-shaft="1" role="slider" tabindex="0" aria-label="Enkoder milini döndürün" style="cursor:grab" transform="rotate('+ang+' 92 31)"><circle cx="92" cy="31" r="13" fill="#c7ced1" stroke="#68747a" stroke-width="2"/><circle cx="92" cy="31" r="4" fill="#8d979c"/><path d="M92 19V25" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M101 24L97 27" stroke="#6d777c" stroke-width="2" stroke-linecap="round"/></g>'+
      '<rect x="45" y="60" width="92" height="37" rx="3" fill="#087b9f" stroke="#0a526a"/><text x="91" y="74" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">PHOTOELECTRIC</text><text x="91" y="85" text-anchor="middle" font-size="7" fill="#e8f6fb">38 mm · 6 mm SHAFT</text><text x="91" y="94" text-anchor="middle" font-size="6.5" fill="#e8f6fb">NPN OPEN COLLECTOR</text>'+
      '<path d="M158 83C183 83 187 104 207 104" fill="none" stroke="#16191b" stroke-width="9"/><g font-family="monospace" font-size="6.5" fill="#e7ecee"><text x="169" y="44">RED +V</text><text x="169" y="57">BLACK 0V</text><text x="169" y="70">GREEN A</text><text x="169" y="83">WHITE B</text><text x="169" y="96">YELLOW Z</text><text x="169" y="109">SHIELD</text></g>'+
      controls+'<text x="124" y="126" text-anchor="middle" font-size="7" fill="'+statusColor+'">'+status+'</text><text x="124" y="137" text-anchor="middle" font-size="6.5" fill="#334155">'+s.ppr+' PPR · '+s.rpm.toFixed(0)+' rpm</text><text x="124" y="147" text-anchor="middle" font-size="6.2" fill="#334155">'+s.pulseHz.toFixed(1)+' Hz · A:'+phase(s.A)+' B:'+phase(s.B)+' Z:'+phase(s.Z)+'</text></g>';
  }
  installMechanicalPins();
  const api={PPRS,ppr,state,setAngle,addAngle,line,supply,markup,installMechanicalPins,isMotorDef,mechanicalWire,motorCoupling,motorRpm,syncMotor,manualAdjust};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSIncrementalEncoder=api;
})(typeof window==='undefined'?globalThis:window);
