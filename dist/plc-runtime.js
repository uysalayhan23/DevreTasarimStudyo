(function(root){
'use strict';
const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
const norm=s=>String(s||'').trim().toUpperCase();
const pins=(d,type)=>(d?.pins||[]).filter(p=>p.signalType===type);
const powerPins=d=>pins(d,'POWER');
const sameBlock=(a,b)=>!a?.block||!b?.block||a.block===b.block;
const isPlus=p=>/(^|\s)(?:\d)?L\+($|\s)|\+24|24V|V\+/.test(norm(p?.label||p?.id));
const isCommon=p=>/(^|\s)(?:\d)?M($|\s)|0V|GND|COM/.test(norm(p?.label||p?.id));
const isAcLine=p=>/^(L|L1|AC|LINE)$/.test(norm(p?.label||p?.id));
const isAcNeutral=p=>/^(N|L2\/N|L2|NEUTRAL)$/.test(norm(p?.label||p?.id));
function blockPins(d,target){const ps=powerPins(d),same=ps.filter(p=>sameBlock(p,target));return same.length?same:ps}
function supplyPair(d){
 const ps=powerPins(d),ac=/VAC/i.test(String(d?.powerSupply||''));
 if(ac){
   const line=ps.find(isAcLine),neutral=ps.find(isAcNeutral);if(line&&neutral)return{a:line,b:neutral,type:'ac'};
 }
 const plus=ps.find(isPlus),common=ps.find(isCommon);if(plus&&common)return{a:plus,b:common,type:'dc'};
 const line=ps.find(isAcLine),neutral=ps.find(isAcNeutral);if(line&&neutral)return{a:line,b:neutral,type:'ac'};
 return null;
}
function inputAnchor(d,p){
 const ps=blockPins(d,p);
 // Documented CPU 1211C DI uses dedicated X10:6 (1M), not CPU power M.
 if(d?.id==='plc-0-0-documented'&&p?.block==='X10')return ps.find(x=>x.id==='X10:6')||ps.find(isCommon)||null;
 return ps.find(isCommon)||ps.find(isAcNeutral)||ps[0]||null;
}
function outputAnchor(d,p){
 const ps=blockPins(d,p),type=String(d?.outputType||'').toUpperCase();
 // CPU 1211C DC/DC/DC documented PNP outputs source from X12:1 (3L+).
 if(type==='PNP'||d?.id==='plc-0-0-documented')return ps.find(isPlus)||ps.find(isCommon)||ps[0]||null;
 if(type==='NPN'||type==='RELAY')return ps.find(isCommon)||ps.find(isPlus)||ps[0]||null;
 return ps.find(isCommon)||ps.find(isPlus)||ps[0]||null;
}
function inputState(c,d,net,p){
 const anchor=inputAnchor(d,p);if(!anchor||anchor.id===p.id)return false;
 return !!net.voltage(c,p.id,anchor.id);
}
function program(c,inputValues,outputPins,now,defaultMode='start-stop-latch'){
 const explicit=c.plcOutputs&&typeof c.plcOutputs==='object'?c.plcOutputs:null,out={};
 const values=inputValues.map(x=>!!x.value),start=values[0]||false,stop=values.length>1?values[1]:true;
 const mode=String(c.plcProgram||defaultMode||'start-stop-latch');
 let q0=false;
 if(mode==='mirror')q0=start;
 // Virtual PLC ladder normally-closed instruction: Q0 := NOT DI0.
 else if(mode==='not-input')q0=!start;
 else if(mode==='direct')q0=start&&stop;
 else if(mode==='timed-stop-once-sc977'){
  const duration=Math.max(100,num(c.plcTimerMs,2000));
  if(!stop){c._sc977Latch=false;c._sc977RequireRelease=true;delete c._sc977StartAt;}
  else if(c._sc977RequireRelease){
   c._sc977Latch=false;
   if(!start&&!c._sc977PowerBlocked)c._sc977RequireRelease=false;
  }else if(!c._sc977Latch&&start&&!c._sc977LastStart&&c._sc977StartAt===undefined){
   c._sc977StartAt=now;c._sc977Latch=true;
  }
  if(c._sc977Latch&&now-num(c._sc977StartAt,now)>=duration){
   c._sc977Latch=false;c._sc977RequireRelease=true;delete c._sc977StartAt;
  }
  c._sc977LastStart=start;
  q0=!!c._sc977Latch&&stop;
 }
 else if(mode==='compare-bits-sc988'){
  // SC988 opt-in: one-bit comparison only, not a general numeric PLC comparator.
  q0=Number(start)>Number(stop);
 }
 else if(mode==='clock-memory-sc983'){
  // Opt-in virtual PLC memory clock, not actual PLC firmware or measured scan time.
  // Q0 is the clock bit (1 s period, 50% duty); Q1 reports run permission.
  const enable=!!start,healthy=!!stop;
  const period=Math.max(200,Math.min(10000,num(c.plcClockPeriodMs,1000)));
  if(!enable||!healthy){
    delete c._sc983Epoch;
    if(!enable&&!c._sc983PowerBlocked)c._sc983RequireRelease=false;
  }else if(!c._sc983RequireRelease&&(!Number.isFinite(c._sc983Epoch)||now<c._sc983Epoch)){
    c._sc983Epoch=now;
  }
  c._sc983Enabled=enable&&healthy&&!c._sc983RequireRelease;
  q0=!!c._sc983Enabled&&Number.isFinite(c._sc983Epoch)&&((now-c._sc983Epoch)%period)<period/2;
 }
 else if(mode==='edge-rise-sc975'){
  const input=!!values[0];
  // Stable for all solver iterations in the same virtual scan timestamp.
  if(c._plcEdgeTick!==now){
   if(c._plcEdgeRequireRelease){
    c._plcEdgePulse=false;
    if(!input&&!c._plcEdgePowerBlocked)c._plcEdgeRequireRelease=false;
   }else c._plcEdgePulse=input&&!c._plcEdgePrev;
   c._plcEdgePrev=input;c._plcEdgeTick=now;
  }
  q0=!!c._plcEdgePulse;
 }
 else if(mode==='set-reset-exclusive-sc974'){
  const a=!!values[0],healthy=!!values[1],b=!!values[2];
  if(!healthy||(a&&b)){
   c._plcSrChoice=null;c._plcSrRequireRelease=true;
  }else if(c._plcSrRequireRelease){
   c._plcSrChoice=null;
   if(!a&&!b)c._plcSrRequireRelease=false;
  }else if((c._plcSrChoice==='A'&&b)||(c._plcSrChoice==='B'&&a)){
   c._plcSrChoice=null;c._plcSrRequireRelease=true;
  }else if(!c._plcSrChoice){
   if(a&&!b)c._plcSrChoice='A';else if(b&&!a)c._plcSrChoice='B';
  }
  q0=healthy&&c._plcSrChoice==='A';
 }
 else if(mode==='two-station-start-stop'){
   // SC194 only: X10:7 / X10:9 are independent START commands (OR).
   // X10:8 / X10:10 are independently wired NC STOP inputs (AND).
   // Any pressed STOP wins over either START, including simultaneous press.
   // The original start-stop-latch program remains unchanged for other lessons.
   const eitherStart=!!(values[0]||values[2]),
     bothStopsHealthy=!!(values[1]&&values[3]);
   if(!bothStopsHealthy)c._plcLatch=false;
   else if(eitherStart)c._plcLatch=true;
   q0=!!c._plcLatch&&bothStopsHealthy;
 }
 else if(mode==='forward-reverse-interlocked'){
   // SC195 only: output Q0.0 forward and Q0.1 reverse.
   // Stop is mandatory, simultaneous commands fail closed; changing
   // direction always drops the old contactor and requires releasing
   // both commands before a new latch can be established.
   const forward=!!values[0],healthyStop=!!values[1],reverse=!!values[2];
   if(!healthyStop||forward&&reverse){
     c._plcDirection=null;c._plcRearm=true;
   }else if(c._plcRearm){
     c._plcDirection=null;
     if(!forward&&!reverse)c._plcRearm=false;
   }else if(c._plcDirection==='F'&&reverse||
            c._plcDirection==='R'&&forward){
     c._plcDirection=null;c._plcRearm=true;
   }else if(!c._plcDirection){
     if(forward)c._plcDirection='F';
     else if(reverse)c._plcDirection='R';
   }
   q0=healthyStop&&c._plcDirection==='F';
 } else if(mode==='delayed-stop-sc202'){
   // SC202 only: delayed motor shutdown on NC STOP input. Not a safety stop.
   const delay=Math.max(100,Math.min(60000,num(c.plcTimerMs,3000)));
   if(start&&stop&&!c._sc331RequireFreshStart){c._plcLatch=true;delete c._plcStopSince}
   if(c._plcLatch&&!stop&&c._plcStopSince===undefined)c._plcStopSince=now;
   if(c._plcStopSince!==undefined&&now-c._plcStopSince>=delay){
     c._plcLatch=false;delete c._plcStopSince;
   }
   q0=!!c._plcLatch;
 } else if(mode==='timed-stop'){
   const duration=Math.max(100,num(c.plcTimerMs,3000));
   if(!stop){delete c._plcTimerStart;c._plcLatch=false}
   if(start&&stop&&c._plcTimerStart===undefined){c._plcTimerStart=now;c._plcLatch=true}
   if(c._plcLatch&&now-num(c._plcTimerStart,now)>=duration){c._plcLatch=false;delete c._plcTimerStart}
   q0=!!c._plcLatch&&stop;
 }else{
   if(!stop)c._plcLatch=false;
   if(start&&stop)c._plcLatch=true;
   q0=!!c._plcLatch&&stop;
 }
 outputPins.forEach((p,i)=>{
   if(explicit&&Object.prototype.hasOwnProperty.call(explicit,p.id))out[p.id]=!!explicit[p.id];
   else if(explicit&&Object.prototype.hasOwnProperty.call(explicit,i))out[p.id]=!!explicit[i];
   else if(mode==='forward-reverse-interlocked')
     out[p.id]=i===0?q0:i===1?!!(stop&&c._plcDirection==='R'):false;
   else if(mode==='set-reset-exclusive-sc974')
     out[p.id]=i===0?q0:i===1?!!(stop&&c._plcSrChoice==='B'):false;
   else if(mode==='compare-bits-sc988')
     out[p.id]=i===0?Number(start)>Number(stop):i===1?start===stop:i===2?Number(start)<Number(stop):false;
   else if(mode==='clock-memory-sc983')
     out[p.id]=i===0?q0:i===1?!!c._sc983Enabled:false;
   else out[p.id]=i===0?q0:false;
 });
 return {mode,outputs:out};
}
function evaluate(c,d,net,now=Date.now(),options={}){
 const sp=supplyPair(d),ioCount=pins(d,'DI').length+pins(d,'DO').length+pins(d,'AI').length+pins(d,'AO').length;
 const powered=sp?!!net.voltage(c,sp.a.id,sp.b.id):(ioCount>0&&(d.plcBackplane!==false||c.plcBackplanePowered===true));
 const inputPins=pins(d,'DI'),inputs=inputPins.map(p=>({id:p.id,label:p.label,value:powered&&inputState(c,d,net,p)}));
 const analogInputs=Object.fromEntries(pins(d,'AI').map(p=>{
   const anchor=inputAnchor(d,p),raw=powered&&anchor&&anchor.id!==p.id?Number(net.voltage(c,p.id,anchor.id)):0;
   return [p.id,Number.isFinite(raw)?raw:0];
 }));
 // SC331 only: a PLC supply failure clears delayed-stop memory and requires
 // release of START before a fresh press can rearm the motor after power returns.
 // This is virtual control logic, not an emergency-stop or hardware-safety model.
 if(c.plcProgram==='delayed-stop-sc202'){
   if(!powered){
     c._plcLatch=false;delete c._plcStopSince;c._sc331RequireFreshStart=true;
   }else if(c._sc331RequireFreshStart&&!inputs[0]?.value)c._sc331RequireFreshStart=false;
 }
 // SC974 opt-in only: powered loss clears both demonstration memory choices.
 // This is not an industrial emergency stop or certified restart prevention.
 if(c.plcProgram==='set-reset-exclusive-sc974'&&(!powered||
   (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2')))){
  c._plcSrChoice=null;c._plcSrRequireRelease=true;
 }
 if(c.plcProgram==='clock-memory-sc983'){
  c._sc983PowerBlocked=!powered||
    (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
  if(c._sc983PowerBlocked){
    c._sc983RequireRelease=true;c._sc983Enabled=false;
    delete c._sc983Epoch;
  }
 }
 if(c.plcProgram==='edge-rise-sc975'){
  c._plcEdgePowerBlocked=!powered||
    (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
  if(c._plcEdgePowerBlocked){
   c._plcEdgeRequireRelease=true;c._plcEdgePulse=false;
   c._plcEdgePrev=false;delete c._plcEdgeTick;
  }
 }
 if(c.plcProgram==='timed-stop-once-sc977'){
  c._sc977PowerBlocked=!powered||
   (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
  if(c._sc977PowerBlocked){
   c._sc977Latch=false;c._sc977RequireRelease=true;
   delete c._sc977StartAt;c._sc977LastStart=false;
  }
 }
 const outputPins=pins(d,'DO'),prg=program(c,inputs,outputPins,now,options.program);
 // CPU 1211C output bank needs its own 3L+ / 3M supply; no phantom Q0.
 const outputSupplyValid=d?.id!=='plc-0-0-documented'||!!net.voltage(c,'X12:1','X12:2');
 if(!powered||!outputSupplyValid)for(const p of outputPins)prg.outputs[p.id]=false;
 const state={powered,inputs:Object.fromEntries(inputs.map(x=>[x.id,x.value])),analogInputs,outputs:prg.outputs,program:prg.mode,supply:sp?{a:sp.a.id,b:sp.b.id,type:sp.type}:null};
 c._plcRuntime=state;c._active=powered;return state;
}
function links(c,d){
 const state=c?._plcRuntime;if(!state?.powered)return[];
 const out=[];
 for(const p of pins(d,'DO')){
   if(!state.outputs?.[p.id])continue;
   const anchor=outputAnchor(d,p);if(anchor&&anchor.id!==p.id)out.push([anchor.id,p.id]);
 }
 return out;
}
function clear(c){delete c._plcRuntime;delete c._plcLatch;delete c._plcTimerStart;delete c._plcStopSince;delete c._plcDirection;delete c._plcRearm;delete c._sc331RequireFreshStart;delete c._plcSrChoice;delete c._plcSrRequireRelease;delete c._plcEdgeTick;delete c._plcEdgePrev;delete c._plcEdgePulse;delete c._plcEdgeRequireRelease;delete c._plcEdgePowerBlocked;delete c._sc977Latch;delete c._sc977RequireRelease;delete c._sc977StartAt;delete c._sc977LastStart;delete c._sc977PowerBlocked;delete c._sc983Epoch;delete c._sc983Enabled;delete c._sc983PowerBlocked;delete c._sc983RequireRelease}
const api={pins,powerPins,supplyPair,inputAnchor,outputAnchor,inputState,program,evaluate,links,clear};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPLCRuntime=api;
})(typeof window==='undefined'?globalThis:window);
