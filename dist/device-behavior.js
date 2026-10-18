(function(root){
  'use strict';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const Thermal=typeof module==='object'&&module.exports?require('./thermal.js'):root.DTSThermal;
  const clamp=(v,a,b,f=a)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
  const analogIds=new Set(['load-cell','sensor-level-analog','sensor-linear-position','sensor-ultrasonic-analog','sensor-ntc','sensor-ptc','thermocouple']);
  const analog=d=>!!d.ptWires||analogIds.has(d.id),powered=d=>['sensor','detector'].includes(d.kind)||['sensor-level-analog','sensor-linear-position','sensor-ultrasonic-analog'].includes(d.id);
  const supplyPins=d=>(['sensor','detector'].includes(d.kind)||d.id==='sensor-ultrasonic-analog')?['BN','BU']:d.id==='sensor-linear-position'?['1','3']:['+','−'];
  function output(c,d){
    const position=clamp(c.analogPosition,0,100,50),temperature=clamp(c.temperature,...Thermal.range(d,c),25);
    if(d.id==='load-cell'){const capacity=clamp(c.loadCapacity,100,5000,1000),weight=clamp(c.loadWeight,0,capacity,0),excitation=clamp(c._loadExcitation,-15,15,10);return {value:2*excitation*weight/capacity,unit:'mV',weight,capacity,excitation}}
    if(d.ptWires)return {value:100*(1+3.9083e-3*temperature-5.775e-7*temperature*temperature+(temperature<0?-4.183e-12*(temperature-100)*temperature**3:0)),unit:'Ω',temperature};
    if(d.id==='sensor-ntc')return {value:10000*Math.exp(3950*(1/(temperature+273.15)-1/298.15)),unit:'Ω',temperature};
    if(d.id==='sensor-ptc')return {value:1000*Math.exp(.025*(temperature-25)),unit:'Ω',temperature};
    if(d.id==='thermocouple')return {value:Thermal.mv(temperature,clamp(c.coldJunction,c.thermocoupleType==='B'?0:-50,100,25),c.thermocoupleType||'K'),unit:'mV',temperature};
    const current=['sensor-level-analog','sensor-ultrasonic-analog'].includes(d.id)&&c.analogMode!=='voltage';return {value:current?4+position*.16:position*.1,unit:current?'mA':'V',position,distance:30+position*3.7,echoUs:2*(30+position*3.7)/.343};
  }
  function supply(c,d,net){
    const [p,m]=supplyPins(d),positive=net.at(c,p),negative=net.at(c,m);
    const pairs=positive.flatMap(a=>negative.filter(b=>a.domain===b.domain&&a.leg!==b.leg).map(b=>[a,b]));
    if(pairs.some(([a,b])=>a.type==='dc'&&a.volts===24&&a.leg==='0'&&b.leg==='+'))return 'reversed';
    if(pairs.some(([a,b])=>a.type==='dc'&&a.volts===24&&b.volts===24&&a.leg==='+'&&b.leg==='0'))return 'ok';
    return pairs.length?'invalid':'off';
  }
  function timed(c,d,input,now){
    const old=c._timing||{input:false,output:false},s={...old,input},duration=clamp(c.delayValue,0,3600,1)*(c.delayUnit==='min'?60000:1000);
    const mode=c.timerMode||(d.id.includes('off')?'off':'on');
    if(d.kind==='coil-pulse'){s.output=input&&!old.input?!old.output:old.output}
    else if(['coil-flasher','flasher'].includes(d.kind)){if(input&&!old.input)s.since=now;const on=clamp(c.flashOn,.05,3600,c.delayValue??1)*1000,off=clamp(c.flashOff,.05,3600,c.delayValue??1)*1000;s.output=input&&((now-(s.since??now))%(on+off))<on}
    else if(mode==='off'){if(input)s.output=true;else{if(old.input)s.since=now;s.output=!!old.output&&now-(s.since??now)<duration}}
    else{if(input&&!old.input)s.since=now;s.output=input&&now-(s.since??now)>=duration}
    return s;
  }
  function panelMeterValue(c,d){
    if(d.kind==='meter-v'){
      if(c._signalMv!==undefined)return {value:Number(c._signalMv),unit:'mV',digits:3};
      if(c._voltageValue===undefined)return null;const v=Number(c._voltageValue);return Math.abs(v)>0&&Math.abs(v)<1?{value:v*1000,unit:'mV',digits:2}:{value:v,unit:'V',digits:2};
    }
    if(d.kind==='meter-a'){
      if(c._currentValue===undefined)return null;const a=Number(c._currentValue);return Math.abs(a)<1?{value:a*1000,unit:'mA',digits:2}:{value:a,unit:'A',digits:3};
    }
    return null;
  }
  function panelMeterMarkup(c,d,mode){
    const r=panelMeterValue(c,d);if(!r||!Number.isFinite(r.value))return '';
    const plain=r.value.toFixed(r.digits)+' '+r.unit,
      tone=c._sc78NativeTone,vu=c._sc80NativeEnvelope,power=c._sc81NativePower||c._sc82NativePower;
    const extra=power&&Number.isFinite(power.outputPowerW)?
      'Yük '+power.outputRmsV.toFixed(2)+' Vrms · '+power.outputPowerW.toFixed(2)+' W · '+power.frequencyHz.toFixed(0)+' Hz'+
      (power.thermalShutdown?' · ISIL SINIR':power.datasheetTypicalLimitActive?' · TİPİK SINIR':''):
      tone&&Number.isFinite(tone.outputVpp)?
      'AC '+tone.outputVpp.toFixed(3)+' Vpp · '+tone.frequencyHz.toFixed(0)+' Hz':
      vu&&Number.isFinite(vu.detectorVoltageV)?
      'RC '+vu.detectorVoltageV.toFixed(2)+' V · bağıl '+
      (vu.relativeDbTo1VPeak===null?'—':vu.relativeDbTo1VPeak.toFixed(1)+' dB re 1 Vpk'):'';
    const y=d.h+55,primary=mode==='material'?'':('<text data-panel-meter-readout="1" x="'+d.w/2+'" y="'+y+
      '" text-anchor="middle" font-size="12" fill="#064e68">'+plain+'</text>');
    const extraText=extra?'<text data-native-audio-level="1" x="'+d.w/2+
      '" y="'+(mode==='material'?d.h+58:d.h+75)+
      '" text-anchor="middle" font-size="12" fill="#064e68">'+extra+'</text>':'';
    const bar=vu?Array.from({length:10},(_,i)=>'<rect x="'+(d.w/2-72+i*15)+
      '" y="'+(mode==='material'?d.h+72:d.h+88)+'" width="12" height="7" rx="2" fill="'+
      (i<vu.segments?(i>=8?'#cf6c24':'#168a55'):'#cbd5e1')+'"/>').join(''):'';
    return primary||extraText||bar?'<g class="analog-device">'+primary+extraText+bar+'</g>':'';
  }
  function markup(c,d,mode){
    if(d.kind==='meter-v'||d.kind==='meter-a')return panelMeterMarkup(c,d,mode);
    if(c._sc82NativePower){const p=c._sc82NativePower;
      const label='Sanal 8Ω '+p.outputPowerW.toFixed(2)+' W lineer RMS · '+
        (p.powered?'AÇIK':!p.railValid?'BESLEME YOK':!p.standbyReleased?'STBY':'MUTE')+
        (p.limitedByIdealRail?' · RAY SINIRI':'')+' · THD/ISIL YOK';
      return '<text data-sc82-rms="1" x="'+d.w/2+'" y="'+(d.h+54)+
        '" text-anchor="middle" font-size="11" fill="#064e68">'+esc(label)+'</text>';
    }
    if(d.kind==='audio-power-amplifier'&&c._sc81NativePower){
      const p=c._sc81NativePower,label=p.powered?
        ('RL '+p.loadOhm+' Ω · '+p.outputPowerW.toFixed(2)+' W hesap · Tj≈'+p.estimatedJunctionC.toFixed(0)+'°C'+(p.thermalShutdown?' · ISIL SINIR':p.datasheetTypicalLimitActive?' · TİPİK SINIR':'')):
        'TDA2030: '+(p.reason||'besleme yok');
      return '<text data-sc81-native-power="1" x="'+d.w/2+'" y="'+(d.h+58)+'" text-anchor="middle" font-size="12" fill="#064e68">'+esc(label)+'</text>';
    }
    if(d.id==='virtual-audio-load-4ohm-25w'&&c._sc81NativePower){
      const p=c._sc81NativePower;
      return '<text data-sc81-load-power="1" x="'+d.w/2+'" y="'+(d.h+50)+'" text-anchor="middle" font-size="12" fill="#064e68">'+p.outputPowerW.toFixed(2)+' W RMS hesap · 4 Ω</text>';
    }
    if(d.excitationSource)return '<text x="'+d.w/2+'" y="'+(d.h+55)+'" text-anchor="middle" font-size="12" fill="#064e68">'+(c.dcVoltage??10)+' VDC</text>';
    if(d.kind==='current-transformer')return '<text x="'+d.w/2+'" y="'+(d.h+55)+'" text-anchor="middle" font-size="11" fill="#064e68">'+(c.ctPrimary||100)+'/'+(c.ctSecondary||5)+' A · '+(c._primaryCurrent??0).toFixed(3)+' → '+(c._secondaryCurrent??0).toFixed(3)+' A'+(c._secondaryOpen?' · Sekonder açık':'')+'</text>';
    if(!analog(d))return '';
    const o=output(c,d),level=d.id==='sensor-level-analog',linear=d.id==='sensor-linear-position',p=o.position??50;c={...c,id:esc(c.id||d.id)};
    const label=(powered(d)&&!c._active?'Besleme yok · ':'')+o.value.toFixed(o.unit==='Ω'?0:2)+' '+o.unit;
    let art=`<text x="${d.w/2}" y="${d.h+58}" text-anchor="middle" fill="#064e68" font-size="12">${label}</text>`;
    if(d.ptWires||['sensor-ntc','sensor-ptc','thermocouple'].includes(d.id)){
      const [lo,hi]=Thermal.range(d,c),x=d.w+28,y=110-(o.temperature-lo)/(hi-lo)*100;
      art=`<rect x="${d.w/2-63}" y="${d.h+43}" width="126" height="23" rx="4" fill="#f0f9ff" stroke="#6a8b9b"/><text data-resistance-readout="1" x="${d.w/2}" y="${d.h+59}" text-anchor="middle" font-size="11" fill="#064e68">${o.value.toFixed(o.unit==='mV'?3:d.ptWires?2:0)} ${o.unit}</text><path d="M${x} 10V110" stroke="#90a4ae" stroke-width="6"/><text x="${x}" y="-1" text-anchor="middle" font-size="9" fill="#345">${hi}°C</text><text x="${x}" y="127" text-anchor="middle" font-size="9" fill="#345">${lo}°C</text><g data-temperature-handle="${c.id}" role="slider" tabindex="0" aria-label="Sıcaklık" aria-valuenow="${o.temperature}" aria-valuemin="${lo}" aria-valuemax="${hi}" style="cursor:ns-resize"><rect x="${x-13}" y="${y-7}" width="26" height="14" rx="4" fill="#ea7351" stroke="#854733"/><rect x="${x-18}" y="${y-12}" width="36" height="24" fill="transparent"/></g><text x="${x+20}" y="${y+4}" font-size="10" fill="#345">${o.temperature.toFixed(1)}°C</text>`;
    }
    if(d.id==='load-cell'){
      const r=(c.rotation||0)*Math.PI/180,xx=d.w*.81-d.w/2,yy=(mode==='material'?58:25)-d.h/2,ax=d.w/2+xx*Math.cos(r)-yy*Math.sin(r),ay=d.h/2+xx*Math.sin(r)+yy*Math.cos(r);
      art=`<g data-load-handle="${c.id}" role="button" tabindex="0" aria-label="Yük uygula; basılı tutarak artır, yukarı sürükleyerek azalt" style="cursor:ns-resize"><path d="M${ax-8} ${ay-47}h16v27h10l-18 20-18-20h10Z" fill="#e66a3e" stroke="#9d391d"/><rect x="${ax-24}" y="${ay-51}" width="48" height="54" fill="transparent"/></g><rect x="${d.w/2-85}" y="${d.h+43}" width="170" height="44" rx="4" fill="#f0f9ff" stroke="#6a8b9b"/><text data-load-readout="1" x="${d.w/2}" y="${d.h+59}" text-anchor="middle" fill="#064e68" font-size="12">${o.weight.toFixed(1)} kg / ${o.capacity} kg</text><text data-load-output="1" x="${d.w/2}" y="${d.h+76}" text-anchor="middle" fill="#064e68" font-size="11">SIG+ − SIG−: ${o.value.toFixed(3)} mV</text><text x="${d.w/2}" y="${d.h+101}" text-anchor="middle" fill="#526574" font-size="9">${c._loadStatus||'Önizleme: 10 V uyartım'} · 2 mV/V</text>`;
    }
    if(level&&mode!=='material')art+=`<path d="M${d.w+25} 15v90" stroke="#789" stroke-width="5"/><g data-analog-handle="${c.id}" style="cursor:ns-resize" role="slider" tabindex="0" aria-label="Seviye" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><rect x="${d.w+10}" y="${97-p*.8}" width="30" height="16" rx="6" fill="#bac9d2" stroke="#456"/><path d="M${d.w+12} ${101-p*.8}h26" stroke="white"/></g>`;
    if(linear&&mode!=='material')art+=`<rect x="0" y="${d.h+75}" width="70" height="20" rx="3" fill="#ccd8df" stroke="#456"/><g data-analog-handle="${c.id}" style="cursor:ew-resize" role="slider" tabindex="0" aria-label="Doğrusal konum" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><path d="M45 ${d.h+85}h${30+p*.7}" stroke="#667988" stroke-width="7"/><rect x="${70+p*.7}" y="${d.h+75}" width="12" height="20" fill="#789"/><rect x="${65+p*.7}" y="${d.h+67}" width="24" height="36" fill="transparent"/></g>`;
    if(d.id==='sensor-ultrasonic-analog')art+=`<path d="M20 ${d.h+85}h150" stroke="#86a2ac" stroke-width="3"/><g data-analog-handle="${c.id}" style="cursor:ew-resize"><rect x="${20+p*1.5}" y="${d.h+65}" width="18" height="40" rx="3" fill="#b8c3ca" stroke="#345"/></g><text x="${d.w/2}" y="${d.h+125}" text-anchor="middle" font-size="11" fill="#245">${o.distance.toFixed(1)} mm · yankı ${o.echoUs.toFixed(0)} µs</text>`;
    return `<g class="analog-device">${art}</g>`;
  }
  // Passive two-terminal virtual piezo: decay of a transient electric potential,
  // never a powered PNP proximity or manufacturer-calibrated pressure transducer.
  function piezoPulse(c,now){
    const start=c.piezoTapAt,valid=typeof start==='number'&&Number.isFinite(start)&&Number.isFinite(now);
    const dt=valid?now-start:NaN,amplitude=Math.max(-200,Math.min(200,Number(c.piezoTapMv??100)||0));
    const mv=Number.isFinite(dt)&&dt>=0&&dt<=1600?amplitude*Math.exp(-dt/220):0;
    return {valueMv:mv,elapsedMs:Number.isFinite(dt)?dt:null,transient:Math.abs(mv)>1e-6,model:'VIRTUAL_IMPULSE_EXP_DECAY_NOT_SPICE'};
  }
  const api={analog,powered,supplyPins,output,supply,timed,panelMeterValue,markup,piezoPulse};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSDeviceBehavior=api;
})(typeof window==='undefined'?globalThis:window);
