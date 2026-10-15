'use strict';
/* MQ-05 virtual PWM contract (not a physical motor/thermal/SPICE model).
   Pure, deterministic and fail-closed. No mutation of project components. */
function finite(value){return typeof value==='number'&&Number.isFinite(value)}
function evaluate(input){
 const x=input||{};
 const duty=x.dutyPercent,frequency=x.frequencyHz,time=x.nowMs;
 if(!finite(duty)||duty<0||duty>100||!finite(frequency)||frequency<=0||
    !finite(time)||time<0||!finite(x.supplyV)||x.supplyV<=0)
   return {valid:false,reason:'INVALID_PWM_INPUT',gateHigh:false,motorEnabled:false,averageAppliedV:null,speedRpm:null};
 if(x.connected!==true||x.gatePathIntact!==true||x.powerPathIntact!==true)
   return {valid:false,reason:'OPEN_PATH',gateHigh:false,motorEnabled:false,averageAppliedV:null,speedRpm:null};
 const periodMs=1000/frequency;
 if(!Number.isFinite(periodMs)||periodMs<=0)
   return {valid:false,reason:'INVALID_PERIOD',gateHigh:false,motorEnabled:false,averageAppliedV:null,speedRpm:null};
 const phaseMs=time%periodMs;
 const gateHigh=duty===100||(duty>0&&phaseMs<periodMs*duty/100);
 const motorEnabled=gateHigh&&x.mosfetChannelClosed===true;
 const averageAppliedV=x.supplyV*duty/100;
 return {valid:true,reason:null,gateHigh,motorEnabled,
  dutyPercent:duty,frequencyHz:frequency,periodMs,phaseMs,
  idealDutyAverageV:averageAppliedV,
  averageAppliedV:null, // requires a current/voltage-coupled motor solver
  speedRpm:null,torqueNm:null,thermalC:null,
  model:'VIRTUAL_GATE_TIMING_ONLY',physicalAcceptance:false};
}
module.exports={evaluate};
