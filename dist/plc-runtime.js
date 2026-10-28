(function(root){
'use strict';
const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
const Ladder=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root.DTSLadderRuntime;
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
 if((d?.id==='plc-0-0-documented'||d?.id==='plc-hw-6es7211-1ae40-0xb0')&&
    (p?.block==='X10'||/^X10:/.test(String(p?.id||''))))
   return ps.find(x=>x.id==='X10:6')||ps.find(isCommon)||null;
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
 const voltage=net.voltage(c,p.id,anchor.id);
 // Verified CPU 1211C DC inputs require positive polarity relative to X10:6 (1M).
 // Negative or absent voltage must not become logical TRUE via !!voltage.
 return d?.id==='plc-hw-6es7211-1ae40-0xb0'?Number(voltage)>0:!!voltage;
}
function program(c,inputValues,outputPins,now,defaultMode='start-stop-latch'){
 // Explicit opt-in for the original DTS Ladder interpreter; legacy lessons keep their modes.
 if(c.plcProgram==='dts-ladder-v1'){
  let result;
  try{result=Ladder?.scan?.(c.ladderProgram,Object.fromEntries(inputValues.map((x,i)=>['I'+(i+1),!!x.value])),c._dtsLadderMemory||{},now,{inputCount:inputValues.length,outputCount:outputPins.length})}
  catch{result={ok:false,error:'Ladder taraması güvenli biçimde tamamlanamadı.'}}
  if(result?.ok){
   c._dtsLadderMemory=result.memory;c._dtsLadderTraces=result.traces;delete c._dtsLadderError;
   return {mode:'dts-ladder-v1',outputs:Object.fromEntries(outputPins.map((x,i)=>[x.id,!!result.outputs['Q'+(i+1)]]))};
  }
  c._dtsLadderError=result?.error||'Geçersiz Ladder programı';
  c._dtsLadderTraces=[];delete c._dtsLadderMemory;
  return {mode:'dts-ladder-v1',outputs:Object.fromEntries(outputPins.map(x=>[x.id,false]))};
 }
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
 else if(mode==='bus-door-virtual-sc1001'){
   // SC1001 educational open/close contactors, not certified bus-door logic.
   const open=!!values[0],close=!!values[1],healthy=!!values[2],
     openTravelOK=!!values[3],closeTravelOK=!!values[4],obstacleClear=!!values[5];
   if(typeof c._sc1001Rearm!=='boolean')c._sc1001Rearm=true;
   if(!healthy||!obstacleClear||(open&&close)||
       (c._sc1001Direction==='OPEN'&&(!openTravelOK||close))||
       (c._sc1001Direction==='CLOSE'&&(!closeTravelOK||open))){
     c._sc1001Direction=null;c._sc1001Rearm=true;
   }else if(c._sc1001Rearm){
     c._sc1001Direction=null;
     if(!open&&!close&&!c._sc1001PowerBlocked)c._sc1001Rearm=false;
   }else if(!c._sc1001Direction){
     if(open&&openTravelOK)c._sc1001Direction='OPEN';
     else if(close&&closeTravelOK)c._sc1001Direction='CLOSE';
   }
   q0=healthy&&obstacleClear&&!c._sc1001PowerBlocked&&c._sc1001Direction==='OPEN';
 }
 else if(mode==='plc-basic-latch-sc1002'){
   // SC1002 opt-in START/STOP with fresh START required after stop/power loss.
   if(typeof c._sc1002Rearm!=='boolean')c._sc1002Rearm=true;
   if(!stop||c._sc1002PowerBlocked){c._sc1002Latch=false;c._sc1002Rearm=true;}
   else if(c._sc1002Rearm){
     c._sc1002Latch=false;
     if(!start)c._sc1002Rearm=false;
   }else if(start&&!c._sc1002LastStart)c._sc1002Latch=true;
   c._sc1002LastStart=start;
   q0=!!stop&&!c._sc1002PowerBlocked&&!!c._sc1002Latch;
 }
 else if(mode==='temperature-ntc-sc999'){q0=!!c._sc999Cooling;}
 else if(mode==='shift-rotate-2bit-sc995'){
  // 2-bit virtual word only: bit0=X10:7, bit1=X10:8; control conflict suppresses both outputs.
  const bit0=!!values[0],bit1=!!values[1],shl=!!values[2],rol=!!values[3];
  q0=shl&&rol?false:shl?false:rol?bit1:bit0;
 }
 else if(mode==='move-timer-preset-sc996'){
  // Virtual MOVE copies a 1s/2s preset into a TON-like memory on fresh START.
  // A subsequent selector change cannot alter the running timer's copied value.
  const startInput=!!values[0],healthy=!!values[1],selectLong=!!values[2];
  if(typeof c._sc996RequireRelease!=='boolean')c._sc996RequireRelease=true;
  if(!healthy||c._sc996PowerBlocked){
    c._sc996RequireRelease=true;
    delete c._sc996StartAt;delete c._sc996PresetMs;
  }else if(c._sc996RequireRelease){
    delete c._sc996StartAt;delete c._sc996PresetMs;
    if(!startInput)c._sc996RequireRelease=false;
  }else if(startInput&&!c._sc996LastStart&&c._sc996StartAt===undefined){
    c._sc996StartAt=now;
    c._sc996PresetMs=selectLong?2000:1000;
  }
  c._sc996LastStart=startInput;
  q0=healthy&&!c._sc996PowerBlocked&&Number.isFinite(c._sc996StartAt)&&
    now-c._sc996StartAt>=c._sc996PresetMs;
 }
 else if(mode==='binary-add-1bit-sc992'){
  // Only a documented 1+1 binary arithmetic demonstration; no WORD/INT support.
  q0=!!(start!==stop);
 }
 else if(mode==='boolean-logic-3out-sc966'){
  // Isolated two-bit boolean truth table: AND, OR and NOT A; no motor safety model.
  q0=start&&stop;
 }
 else if(mode==='compare-bits-sc988'){
  // SC988 opt-in: one-bit comparison only, not a general numeric PLC comparator.
  q0=Number(start)>Number(stop);
 }
 else if(mode==='compare-two-motors-sc990'){
  // Educational bit-comparison controls two virtual contactors; not certified safety logic.
  const a=!!values[0],b=!!values[1],healthy=!!values[2];
  if(typeof c._sc990RequireRelease!=='boolean')c._sc990RequireRelease=true;
  if(!healthy||(a&&b))c._sc990RequireRelease=true;
  else if(c._sc990RequireRelease&&!a&&!b&&!c._sc990PowerBlocked)c._sc990RequireRelease=false;
  q0=!!healthy&&!c._sc990PowerBlocked&&!c._sc990RequireRelease&&a&&!b;
 }
 else if(mode==='parking-counter-sc989'){
  // Two-space virtual carpark counter; edge-counting is educational, not a safety controller.
  const enter=!!values[0],leave=!!values[1],healthy=!!values[2];
  const capacity=Math.max(1,Math.min(20,Math.trunc(num(c.plcParkingCapacity,2))));
  if(!Number.isFinite(c._sc989Count))c._sc989Count=0;
  if(!healthy){c._sc989Count=0;c._sc989Rearm=true;}
  else if(c._sc989Rearm){
    if(!enter&&!leave&&!c._sc989PowerBlocked)c._sc989Rearm=false;
  }else if(c._sc989Tick!==now){
    if(enter&&!c._sc989PrevIn&&!leave)c._sc989Count=Math.min(capacity,c._sc989Count+1);
    else if(leave&&!c._sc989PrevOut&&!enter)c._sc989Count=Math.max(0,c._sc989Count-1);
  }
  c._sc989PrevIn=enter;c._sc989PrevOut=leave;c._sc989Tick=now;
  q0=healthy&&!c._sc989PowerBlocked&&c._sc989Count<capacity;
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
   else if(mode==='bus-door-virtual-sc1001')
     out[p.id]=i===0?q0:i===1?!!values[2]&&!!values[5]&&
       !c._sc1001PowerBlocked&&c._sc1001Direction==='CLOSE':false;
   else if(mode==='plc-basic-latch-sc1002')
     out[p.id]=i===0?q0:i===1?!!stop&&!c._sc1002PowerBlocked&&!c._sc1002Latch:false;
   else if(mode==='temperature-ntc-sc999')out[p.id]=i===0?q0:false;
   else if(mode==='shift-rotate-2bit-sc995'){
     const bit0=!!values[0],bit1=!!values[1],shl=!!values[2],rol=!!values[3];
     out[p.id]=i===0?q0:i===1?(shl&&rol?false:shl||rol?bit0:bit1):false;
   }
   else if(mode==='move-timer-preset-sc996')
     out[p.id]=i===0?q0:i===1?!!values[1]&&!c._sc996PowerBlocked&&
       Number.isFinite(c._sc996StartAt):false;
   else if(mode==='binary-add-1bit-sc992')
     out[p.id]=i===0?!!(start!==stop):i===1?!!(start&&stop):false;
   else if(mode==='boolean-logic-3out-sc966')
     out[p.id]=i===0?start&&stop:i===1?start||stop:i===2?!start:false;
   else if(mode==='compare-bits-sc988')
     out[p.id]=i===0?Number(start)>Number(stop):i===1?start===stop:i===2?Number(start)<Number(stop):false;
   else if(mode==='compare-two-motors-sc990')
     out[p.id]=i===0?q0:i===1?!!values[2]&&!c._sc990PowerBlocked&&!c._sc990RequireRelease&&!!values[1]&&!values[0]:false;
   else if(mode==='parking-counter-sc989')
     out[p.id]=i===0?q0:i===1?!!values[2]&&!c._sc989PowerBlocked&&c._sc989Count>=Math.max(1,Math.min(20,Math.trunc(num(c.plcParkingCapacity,2)))):false;
   else if(mode==='clock-memory-sc983')
     out[p.id]=i===0?q0:i===1?!!c._sc983Enabled:false;
   else out[p.id]=i===0?q0:false;
 });
 return {mode,outputs:out};
}
// UI gate for virtual PLC simulation. Never enable an unverified hardware model.
function simulationGate(project,byId){
 let standby=false;
 for(const c of Array.isArray(project?.components)?project.components:[]){
  const d=byId?.[c?.typeId];
  if(d?.visualOnly)return {blocked:true,standby:false,reason:'Görsel amaçlı bileşen simülasyon için doğrulanmadı.'};
  if(!d?.isPLC)continue;
  if(Ladder?.supportedPLC?.(d)!==true)
   return {blocked:true,standby:false,reason:'Bu PLC modeli için sanal simülasyon henüz doğrulanmadı.'};
  if(!c.plcProgram){standby=true;continue}
  if(c.plcProgram!=='dts-ladder-v1')
   return {blocked:true,standby:false,reason:'Bu PLC programı henüz doğrulanmadı; özgün DTS Ladder kullanın.'};
  const valid=Ladder?.validate?.(c.ladderProgram,{
   inputCount:pins(d,'DI').length,outputCount:pins(d,'DO').length
  });
  if(!valid?.ok)return {blocked:true,standby:false,reason:'PLC Ladder programı geçersiz: '+(valid?.error||'doğrulanamadı')};
 }
 return {blocked:false,standby,reason:''};
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
 if(c.plcProgram==='move-timer-preset-sc996'){
  c._sc996PowerBlocked=!powered||
    (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
  if(c._sc996PowerBlocked){
    c._sc996RequireRelease=true;delete c._sc996StartAt;delete c._sc996PresetMs;
  }
 }
 if(c.plcProgram==='compare-two-motors-sc990'){
  c._sc990PowerBlocked=!powered||
    (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
  if(c._sc990PowerBlocked)c._sc990RequireRelease=true;
 }
 if(c.plcProgram==='parking-counter-sc989'){
  c._sc989PowerBlocked=!powered||
    (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
  if(c._sc989PowerBlocked){
    c._sc989Count=0;c._sc989Rearm=true;
    c._sc989PrevIn=false;c._sc989PrevOut=false;delete c._sc989Tick;
  }
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

 // SC999 opt-in only. Sensor resistance from canonical thermal model, contingent
 // on an intact 10 V divider wired to the documented PLC analog pins.

 if(c.plcProgram==='bus-door-virtual-sc1001'){
   c._sc1001PowerBlocked=!powered||
     (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
   if(c._sc1001PowerBlocked){c._sc1001Direction=null;c._sc1001Rearm=true;}
 }
 if(c.plcProgram==='plc-basic-latch-sc1002'){
   c._sc1002PowerBlocked=!powered||
     (d?.id==='plc-0-0-documented'&&!net.voltage(c,'X12:1','X12:2'));
   if(c._sc1002PowerBlocked){c._sc1002Latch=false;c._sc1002Rearm=true;}
 }
 if(c.plcProgram==='temperature-ntc-sc999'){
  const items=options.project?.components||[],find=id=>items.find(x=>x.id===id);
  const g=find('g10'),r=find('rtemp'),t=find('ntc');
  const pin=(id,p)=>JSON.stringify([id,p]);
  const tied=(a,ap,b,bp)=>net.find(pin(a,ap))===net.find(pin(b,bp));
  const proper=options.project?.tutorialLesson?.id==='motor-direct-power-outline-129'&&
   g?.typeId==='load-cell-excitation'&&r?.typeId==='resistor'&&
   t?.typeId==='sensor-ntc'&&Number(r.resistance)===10000&&
   Number.isFinite(Number(t.temperature))&&
   // NTC high side, fixed 10k low side: ADC node rises with temperature.
   tied('g10','P','ntc','1')&&tied('ntc','2','rtemp','1')&&
   tied('rtemp','1',c.id,'X11:2')&&tied('rtemp','2','g10','M')&&
   tied('g10','M',c.id,'X11:1')&&
   !tied('rtemp','1','rtemp','2')&&!tied('ntc','1','ntc','2')&&
   !!net.voltage(g,'P','M');
  const td=(root.COMPONENT_LIBRARY||[]).find(d=>d.id==='sensor-ntc');
  const tr=proper&&td?Number(root.DTSDeviceBehavior.output(t,td).value):NaN;
  const volts=Number.isFinite(tr)&&tr>0?100000/(10000+tr):NaN;
  const nAt=temp=>10000*Math.exp(3950*(1/(temp+273.15)-1/298.15));
  const on=100000/(10000+nAt(36)),off=100000/(10000+nAt(30));
  const healthy=powered&&!!inputs[0]?.value&&
   !!net.voltage(c,'X12:1','X12:2')&&Number.isFinite(volts)&&volts>0&&volts<10;
  c._sc999BridgeVoltage=healthy?volts:null;
  c._sc999SensorValid=!!proper&&Number.isFinite(volts);
  if(!healthy){c._sc999Cooling=false;c._sc999RequireCoolReset=true;}
  else if(c._sc999RequireCoolReset){
   c._sc999Cooling=false;
   if(volts<=off)c._sc999RequireCoolReset=false;
  }else if(volts>=on)c._sc999Cooling=true;
  else if(volts<=off)c._sc999Cooling=false;
 }
 // CPU power loss must not perform a hidden Ladder scan or retain stale traces.
 if(!powered&&c.plcProgram==='dts-ladder-v1'){
  delete c._dtsLadderMemory;c._dtsLadderTraces=[];
 }
 const outputPins=pins(d,'DO');
 const allowed=c.plcProgram!=='dts-ladder-v1'||Ladder?.supportedPLC?.(d)===true;
 const ladderUnpowered=c.plcProgram==='dts-ladder-v1'&&!powered;
 // A verified PLC without an explicit Ladder program is a powered, idle virtual CPU.
 // No implicit legacy start/stop program may energize its outputs.
 const idleVerified=allowed&&Ladder?.supportedPLC?.(d)===true&&!c.plcProgram;
 if(idleVerified){delete c._dtsLadderMemory;c._dtsLadderTraces=[];}
 const prg=allowed&&!ladderUnpowered&&!idleVerified?program(c,inputs,outputPins,now,options.program):
  {mode:idleVerified?'dts-ladder-idle':'dts-ladder-v1',outputs:Object.fromEntries(outputPins.map(p=>[p.id,false]))};
 if(!allowed){
  c._dtsLadderError='PLC terminali ve simülasyonu henüz doğrulanmadı.';
  delete c._dtsLadderMemory;c._dtsLadderTraces=[];
 }
 // CPU 1211C output bank needs its own 3L+ / 3M supply; no phantom Q0.
 const outputSupplyValid=!['plc-0-0-documented','plc-hw-6es7211-1ae40-0xb0'].includes(d?.id)||Number(net.voltage(c,'X12:1','X12:2'))>0;
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
function clear(c){delete c._dtsLadderMemory;delete c._dtsLadderTraces;delete c._dtsLadderError;delete c._plcRuntime;delete c._plcLatch;delete c._plcTimerStart;delete c._plcStopSince;delete c._plcDirection;delete c._plcRearm;delete c._sc331RequireFreshStart;delete c._plcSrChoice;delete c._plcSrRequireRelease;delete c._plcEdgeTick;delete c._plcEdgePrev;delete c._plcEdgePulse;delete c._plcEdgeRequireRelease;delete c._plcEdgePowerBlocked;delete c._sc977Latch;delete c._sc977RequireRelease;delete c._sc977StartAt;delete c._sc977LastStart;delete c._sc977PowerBlocked;delete c._sc983Epoch;delete c._sc983Enabled;delete c._sc983PowerBlocked;delete c._sc983RequireRelease;delete c._sc989Count;delete c._sc989Rearm;delete c._sc989PowerBlocked;delete c._sc989PrevIn;delete c._sc989PrevOut;delete c._sc989Tick;delete c._sc990PowerBlocked;delete c._sc990RequireRelease;delete c._sc996PowerBlocked;delete c._sc996RequireRelease;delete c._sc996StartAt;delete c._sc996PresetMs;delete c._sc996LastStart;delete c._sc999Cooling;delete c._sc999RequireCoolReset;delete c._sc999BridgeVoltage;delete c._sc999SensorValid;delete c._sc1001PowerBlocked;delete c._sc1001Direction;delete c._sc1001Rearm;delete c._sc1002PowerBlocked;delete c._sc1002Latch;delete c._sc1002Rearm;delete c._sc1002LastStart}
const api={pins,powerPins,supplyPair,inputAnchor,outputAnchor,inputState,program,evaluate,links,clear,simulationGate};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPLCRuntime=api;
})(typeof window==='undefined'?globalThis:window);
