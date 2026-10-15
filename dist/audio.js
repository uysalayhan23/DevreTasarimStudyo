(function(root){
  'use strict';
  const rotating=d=>!!d&&!d.isPLC&&(d.kind!=='pwm-generator'&&(/motor|fan|generator/.test(d.kind)||d.rotating));
  const ref=s=>String(s||'').trim().normalize('NFKC').toLocaleUpperCase('tr-TR');
  function state(project,byId,running){
    const contactors=new Set(),alarms=new Map();let motors=0;
    if(running)for(const c of project.components){const d=byId[c.typeId];if(!d||!c._active)continue;
      if(d.kind==='multimeter'&&c._meter?.beep)alarms.set(c.id,{type:'buzzer',frequency:880});if(rotating(d))motors++;if(['buzzer','siren'].includes(d.kind)){const type=d.id==='speaker'?'speaker':d.kind==='siren'?'siren':d.id==='annunciation'?'alarm':'buzzer',frequency=type==='speaker'?523:type==='buzzer'?Math.max(40,Math.min(12000,Number(c._arduinoTone)||880)):750;alarms.set(c.id,{type,frequency})}
      if(d.kind==='coil'||d.kind==='contactor3')contactors.add(ref(c.ref)||c.id);
    }
    return {contactors,motors,alarms};
  }
  function create(options={}){
    let enabled=options.enabled!==false,context=null,master=null,noise=null,motor=null,hidden=false;
    let previous={contactors:new Set(),motors:0,alarms:new Map()};const transients=new Set(),voices=new Map();
    function ready(){return enabled&&!hidden&&context&&context.state!=='closed'}
    function unlock(){
      if(!enabled)return false;
      if(!context){
        const Context=options.AudioContext||root.AudioContext||root.webkitAudioContext;if(!Context)return false;
        try{
          context=new Context();master=context.createGain();master.gain.value=.38;master.connect(context.destination);
          noise=context.createBuffer(1,Math.ceil(context.sampleRate*.5),context.sampleRate);const data=noise.getChannelData(0);
          for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
        }catch{context=null;return false}
      }
      if(context.state==='suspended')context.resume().catch(()=>{});
      updateMotor();updateAlarms();return true;
    }
    function burst(type){
      if(!ready())return;
      const t=context.currentTime,click=type==='click',drop=type==='drop',duration=click?.045:drop?.09:.135;
      const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),tone=context.createOscillator(),toneGain=context.createGain();
      source.buffer=noise;filter.type='bandpass';filter.frequency.value=click?2600:drop?700:440;filter.Q.value=click?.6:1.2;
      source.connect(filter);filter.connect(gain);gain.connect(master);tone.connect(toneGain);toneGain.connect(master);
      gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(click?.3:.58,t+.003);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
      tone.type='triangle';tone.frequency.setValueAtTime(click?1300:drop?130:190,t);tone.frequency.exponentialRampToValueAtTime(click?700:70,t+duration);
      toneGain.gain.setValueAtTime(click?.05:.16,t);toneGain.gain.exponentialRampToValueAtTime(.0001,t+duration);
      const nodes=[source,filter,gain,tone,toneGain];transients.add(nodes);
      source.onended=()=>{nodes.forEach(n=>n.disconnect());transients.delete(nodes)};
      source.start(t);tone.start(t);source.stop(t+duration+.01);tone.stop(t+duration);
    }
    function stopMotor(){
      if(!motor)return;
      const old=motor;motor=null;const t=context.currentTime;
      old.gain.gain.cancelScheduledValues(t);old.gain.gain.setValueAtTime(old.gain.gain.value,t);old.gain.gain.linearRampToValueAtTime(0,t+.08);
      for(const node of old.sources)node.stop(t+.09);
      old.sources[0].onended=()=>old.nodes.forEach(n=>n.disconnect());
    }
    function updateMotor(){
      if(!ready()||!previous.motors){stopMotor();return}
      const t=context.currentTime,target=Math.min(.2,.09+previous.motors*.025);
      if(motor){motor.gain.gain.setTargetAtTime(target,t,.12);return}
      const gain=context.createGain(),hum=context.createOscillator(),overtone=context.createOscillator(),air=context.createBufferSource(),filter=context.createBiquadFilter(),airGain=context.createGain(),overtoneGain=context.createGain();
      gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(target,t+.32);gain.connect(master);
      hum.type='sine';hum.frequency.setValueAtTime(36,t);hum.frequency.linearRampToValueAtTime(100,t+.45);hum.connect(gain);
      overtone.type='triangle';overtone.frequency.setValueAtTime(65,t);overtone.frequency.linearRampToValueAtTime(200,t+.45);overtoneGain.gain.value=.14;overtone.connect(overtoneGain);overtoneGain.connect(gain);
      air.buffer=noise;air.loop=true;filter.type='lowpass';filter.frequency.value=650;airGain.gain.value=.28;air.connect(filter);filter.connect(airGain);airGain.connect(gain);
      const sources=[hum,overtone,air];motor={gain,sources,nodes:[...sources,gain,filter,airGain,overtoneGain]};sources.forEach(n=>n.start(t));
    }
    function updateAlarms(){
      const wanted=ready()?previous.alarms:new Map();
      for(const [id,voice] of voices)if(!wanted.has(id)){for(const n of voice.sources){try{n.stop()}catch{}}for(const n of voice.nodes)n.disconnect();voices.delete(id)}
      if(!ready())return;
      for(const [id,spec0] of wanted){const spec=typeof spec0==='string'?{type:spec0}:spec0||{type:'buzzer'},type=spec.type||'buzzer',frequency=Math.max(20,Math.min(16000,Number(spec.frequency)||(type==='speaker'?523:type==='buzzer'?880:750))),existing=voices.get(id);if(existing){existing.tone.frequency.setTargetAtTime(frequency,context.currentTime,.015);continue}const tone=context.createOscillator(),gain=context.createGain();tone.type=type==='speaker'?'triangle':'sine';tone.frequency.value=frequency;gain.gain.value=.055/Math.sqrt(Math.max(1,wanted.size));tone.connect(gain);gain.connect(master);const sources=[tone],nodes=[tone,gain];
        if(type==='siren'||type==='alarm'){const lfo=context.createOscillator(),depth=context.createGain();lfo.type=type==='siren'?'sine':'square';lfo.frequency.value=type==='siren'?.7:2;depth.gain.value=type==='siren'?300:180;lfo.connect(depth);depth.connect(tone.frequency);sources.push(lfo);nodes.push(lfo,depth)}
        voices.set(id,{sources,nodes,tone});for(const n of sources)n.start();
      }
    }
    function sync(project,byId,running){
      const next=state(project,byId,running);
      if([...next.contactors].some(id=>!previous.contactors.has(id)))burst('pull');
      if([...previous.contactors].some(id=>!next.contactors.has(id)))burst('drop');
      previous=next;updateMotor();updateAlarms();
    }
    function setEnabled(value){enabled=!!value;if(enabled)unlock();else stopMotor();updateAlarms();if(master&&context)master.gain.setValueAtTime(enabled?.38:0,context.currentTime);return enabled}
    function setHidden(value){hidden=!!value;updateMotor();updateAlarms();if(master&&context)master.gain.setValueAtTime(enabled&&!hidden?.38:0,context.currentTime)}
    function dispose(){stopMotor();previous.alarms=new Map();updateAlarms();for(const nodes of transients)nodes.forEach(n=>{try{n.stop?.()}catch{}n.disconnect()});transients.clear();if(context)context.close().catch(()=>{});context=null}
    return {unlock,click:()=>burst('click'),sync,setEnabled,setHidden,dispose,get enabled(){return enabled}};
  }
  const api={create,state,rotating};if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSAudio=api;
})(typeof window==='undefined'?globalThis:window);
