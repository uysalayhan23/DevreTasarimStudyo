'use strict';
// Read-only diagnostic: virtual comparator examples are not physical interface acceptance.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Device=require('../dist/device-behavior.js');
const DECISION=(samples,unit,threshold,direction)=>{
 if(!['mV','Ω'].includes(unit)||!['above','below'].includes(direction)||!Number.isFinite(threshold)||!samples.length||!samples.every(s=>s?.unit===unit&&Number.isFinite(s.value)))return null;
 return samples.map(s=>direction==='above'?s.value>threshold:s.value<threshold);
};
function run({L=QA.curriculum(),defs=QA.catalog()}={}){
 const signal=(type,props)=>Device.output(props,defs[type]);
 const load=[0,500,1000].map(loadWeight=>signal('load-cell',{_loadExcitation:10,loadCapacity:1000,loadWeight}));
 const ntc=[20,25,35].map(temperature=>signal('sensor-ntc',{temperature}));
 const pt100=[20,25,35].map(temperature=>signal('sensor-pt100',{temperature}));
 const piezo=signal('tutorial-piezo',{}),mq2=signal('arduino-mq2',{});
 return {scope:'READ_ONLY_VIRTUAL_DECISION_GUARD',lessons:L.lessons.length,wired:L.lessons.filter(l=>l.project?.wires?.length).length,defs:Object.keys(defs).length,
  load:{samples:load,virtualDecision:DECISION(load,'mV',12,'above'),interface:'EX+/EX−/SIG+/SIG− + differential amplifier'},
  ntc:{samples:ntc,virtualDecision:DECISION(ntc,'Ω',8000,'below'),interface:'excitation, ADC, hysteresis'},
  pt100:{samples:pt100,virtualDecision:DECISION(pt100,'Ω',111.5,'above'),interface:'3-wire compensation, ADC, threshold'},
  piezo:{genericFallback:piezo,virtualDecision:null,reason:'NO_VIBRATION_MODEL'},
  mq2:{genericFallback:mq2,virtualDecision:null,reason:'NO_GAS_CONCENTRATION_MODEL'},
  realProductTerminalAccepted:false,canonicalChanges:0,physicalAcceptance:'REVIEW'};
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={run,DECISION};
