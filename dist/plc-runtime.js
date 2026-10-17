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
 return ps.find(isCommon)||ps.find(isAcNeutral)||ps[0]||null;
}
function outputAnchor(d,p){
 const ps=blockPins(d,p),type=String(d?.outputType||'').toUpperCase();
 if(type==='PNP')return ps.find(isPlus)||ps.find(isCommon)||ps[0]||null;
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
 else if(mode==='direct')q0=start&&stop;
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
 else if(mode==='timed-stop'){
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
   else out[p.id]=i===0?q0:false;
 });
 return {mode,outputs:out};
}
function evaluate(c,d,net,now=Date.now(),options={}){
 const sp=supplyPair(d),ioCount=pins(d,'DI').length+pins(d,'DO').length+pins(d,'AI').length+pins(d,'AO').length;
 const powered=sp?!!net.voltage(c,sp.a.id,sp.b.id):(ioCount>0&&(d.plcBackplane!==false||c.plcBackplanePowered===true));
 const inputPins=pins(d,'DI'),inputs=inputPins.map(p=>({id:p.id,label:p.label,value:powered&&inputState(c,d,net,p)}));
 const outputPins=pins(d,'DO'),prg=program(c,inputs,outputPins,now,options.program);
 if(!powered)for(const p of outputPins)prg.outputs[p.id]=false;
 const state={powered,inputs:Object.fromEntries(inputs.map(x=>[x.id,x.value])),outputs:prg.outputs,program:prg.mode,supply:sp?{a:sp.a.id,b:sp.b.id,type:sp.type}:null};
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
function clear(c){delete c._plcRuntime;delete c._plcLatch;delete c._plcTimerStart}
const api={pins,powerPins,supplyPair,inputAnchor,outputAnchor,inputState,program,evaluate,links,clear};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPLCRuntime=api;
})(typeof window==='undefined'?globalThis:window);
