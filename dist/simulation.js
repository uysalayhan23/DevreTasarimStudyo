(function(root){
  'use strict';
  const Leads=typeof module==='object'&&module.exports?require('./probe-leads.js'):root.DTSProbeLeads;
  const Components=typeof module==='object'&&module.exports?require('./components.js'):root.CCSComponents;
  const Sensors=typeof module==='object'&&module.exports?require('./sensors.js'):root.CCSSensors;
  const Devices=typeof module==='object'&&module.exports?require('./device-behavior.js'):root.DTSDeviceBehavior;
  const IncrementalEncoder=typeof module==='object'&&module.exports?require('./incremental-encoder.js'):root.DTSIncrementalEncoder;
  const DoldSafety=typeof module==='object'&&module.exports?require('./dold-safety.js'):root.DTSDoldSafety;
  const Instruments=typeof module==='object'&&module.exports?require('./instruments.js'):root.DTSInstruments;
  const V20=typeof module==='object'&&module.exports?require('./v20.js'):root.DTSV20;
  const ACS=typeof module==='object'&&module.exports?require('./acs800.js'):root.DTSACS800;
  const HCFA=typeof module==='object'&&module.exports?require('./hcfa-x2e.js'):root.DTSHCFA;
  const driveState=c=>c._acs800||c._v20||c._hcfa, isDrive=d=>d?.id===V20.id||d?.id===ACS.id||d?.id===HCFA.id;
  const Numeric=typeof module==='object'&&module.exports?require('./current-model.js'):root.DTSCurrentModel;
  const SignedFlow=typeof module==='object'&&module.exports?require('./signed-flow.js'):root.DTSSignedFlow;
  const Multimeter=typeof module==='object'&&module.exports?require('./multimeter.js'):root.DTSMultimeter;
  const PLC=typeof module==='object'&&module.exports?require('./plc-runtime.js'):root.DTSPLCRuntime;
  const DigitalIC=typeof module==='object'&&module.exports?require('./digital-ic-runtime-v11920.js'):root.DTSDigitalICRuntime;
  const coils=new Set(['coil','timer','coil-valve','coil-flasher','coil-pulse','relay-protection']);
  const followers=new Set(['contact-no','contact-nc','contact-both','delay-on-no','delay-on-nc','delay-off-no','delay-off-nc','contactor3']);
  const breakers=new Set(['breaker','breaker2','breaker3','rcd2','rcd4','fuse-switch','overload','thermal-magnetic']);
  const loads=new Set(['lamp','led','buzzer','siren','flasher','meter-v','meter-ohm','resistor','capacitor','diode','potentiometer','reactor']);
  const sources=new Set(['supply','supply3','supply-dc-plus','supply-dc-minus','battery','bell-transformer','ac-virtual-source','virtual-bipolar-study-source']);
  const phaseMotors=new Set(['motor3','motor-yd','motor-dahlender','motor-rotor','motor-2speed','generator','servo-motor']);
  const normalizeRef=s=>String(s||'').trim().normalize('NFKC').toLocaleUpperCase('tr-TR');
  const pinKey=(c,p)=>JSON.stringify([c,p]);
  const endpointKey=r=>r?.j?JSON.stringify(['junction',r.j]):pinKey(r?.c,r?.p);
  const definition=(byId,c)=>byId[c.typeId];
  function clear(project){
    for(const c of project.components){delete c._sc12BrightnessPct;delete c._sc12DimmerVerified;}
    for(const c of project.components){V20.clear(c);ACS.clear(c);HCFA.clear(c);PLC?.clear?.(c);DigitalIC?.clear?.(c);delete c._motorHz;delete c._motorRPM;delete c._motorDrive;delete c._motorAngle;delete c._sc11SpeedPercent;delete c._sc11DriveTargetPercent;delete c._sc11ResponseNow;delete c._sc11VgsMean;delete c._mq07NtcGateV;delete c._mq07PtcGateV;delete c._mq07LdrGateV;}
    for(const c of project.components){for(const k of ['_sensorSignal','_instrument','_controller','_pid','_alarmArmed1','_alarmArmed2','_voltageValue','_meter','_clamp','_shownMeterWarning','_a1pid','_autoTune','_ncv'])delete c[k]}
    for(const c of project.components){c._active=false;c._lampActive=false;c._actuated=false;c._closed=null;c._contactStates={};c._hot=[];c._powered=false;c._fault=false;c._spin=0;delete c._timing;delete c._sensorSupply;delete c._currentValue;delete c._primaryCurrent;delete c._secondaryCurrent;delete c._secondaryOpen;delete c._phaseFault;delete c._signalMv;delete c._loadExcitation;delete c._loadStatus;delete c._hcfaLinkedDrive;delete c._hcfaModbusLinked;delete c._doldEval;delete c._doldMemory;delete c._capacitorVoltage;delete c._inductorCurrent;delete c._reactiveVoltage;delete c._reactiveCurrent;delete c._reactiveModel;delete c._reactiveNow;delete c._scrLatched;delete c._scrGateVoltage;delete c._scrHoldingCurrentA;delete c._triacLatched;delete c._triacGateVoltage;delete c._triacHoldingCurrentA;delete c._sc16DcValid;delete c._sc16PowerPath;delete c._sc16CurrentA;delete c._sc17Wave;delete c._sc17PhaseDeg;delete c._sc17SourceV;delete c._sc17GateV;delete c._sc17FiringAngleDeg;delete c._sc17CurrentA;delete c._sc17Conducting;delete c._sc17Half;delete c._sc17RmsV;delete c._sc17LoadV;delete c._sc17ConductionPct;delete c._sc18LedCurrentA;delete c._sc18CollectorCurrentA;delete c._sc18CollectorVoltageV;delete c._sc18LedOn;delete c._sc18TransistorOn;delete c._sc18Isolated;delete c._sc18VirtualCtr;delete c._sc18CurrentA;delete c._sc19TimerHigh;delete c._sc19TimerHz;delete c._sc19DutyPct;delete c._sc19LedCurrentA;delete c._sc19LedOn;delete c._sc19OptoOn;delete c._sc19Isolated;delete c._sc19Wave;delete c._sc19PhaseDeg;delete c._sc19CurrentA;delete c._sc19Conducting;delete c._sc19RmsV;delete c._sc19LoadV;delete c._sc19ConductionPct;delete c._sc15InstantSourceV;delete c._sc15InstantLoadV;delete c._sc15CurrentA;delete c._sc15OutputRmsV;delete c._sc15GateOutputV;delete c._sc15FiringAngleDeg;delete c._sc15PhaseDeg;delete c._sc15ConductionPct;delete c._sc15Wave;delete c._sc15Conducting;delete c._mq07BjtMonostableStart;delete c._mq07BjtMonostablePrevTrigger;delete c._mq07BjtMonostablePowered;delete c._mq07BjtMonostableDurationMs;delete c._mq07BjtMonostableRemainingMs;delete c._mq07BjtBistableMemory;delete c._mq07BjtBistablePrevSet;delete c._mq07BjtBistablePrevReset;delete c._mq07BjtBistablePowered;delete c._mq07BjtAstableEpoch;delete c._mq07BjtAstablePowered;delete c._mq07BjtAstableHz;delete c._mq07Ne555PwmEpoch;delete c._mq07Ne555PwmPowered;delete c._ne555DutyPercent;delete c._mq07Ne555Epoch;delete c._mq07Ne555StandalonePowered;delete c._ne555Out;delete c._ne555Discharge;delete c._ne555Frequency;delete c._ne555HighMs;delete c._ne555LowMs;delete c._pwmSupplyValid;delete c._pwmHigh;delete c._bjtOn;delete c._mosfetOn;delete c._jfetOn;delete c._igbtOn;delete c._thyristorOn;delete c._diacOn;delete c._opampOutput;delete c._opampDiff;delete c._opampPowered}
    // SC082 must restart its RC controls and remove stale RMS labels.
    if(project?.tutorialLesson?.id==='oscillator-filter-apps-src-30')
      for(const c of project.components){
        delete c._sc82NativePower;delete c._sc82Control;delete c._speakerPowerW;
      }
    for(const w of project.wires){w._active=false;w._fault=false;for(const k of ['_flowActive','_flowDirection','_flowMode','_flowCertainty','_flowMagnitude','_flowCurrentRe','_flowCurrentIm'])delete w[k]}
  }
  function polePairs(d){
    const ids=new Set(d.pins.map(p=>p.id));
    return [['1','2'],['3','4'],['5','6'],['7','8']].filter(([a,b])=>ids.has(a)&&ids.has(b));
  }
  function contactState(c,d,actuators){
    const k=d.kind,linked=!!actuators.get(normalizeRef(c.ref));
    const groups=Components.contactGroups(d),actuated=['ssr','phase-monitor'].includes(d.kind)?!!actuators.get('@'+c.id):d.followDevice==='thermal'?!!actuators.get('thermal:'+normalizeRef(c.ref)):followers.has(k)?linked:Sensors.actuated(c,d);
    const effective=k.startsWith('delay-')?Devices.timed(c,{...d,kind:'timer'},linked,c._solveNow??Date.now()).output:actuated;
    const states=Components.contactStates(c,d,effective);
    return {actuated:effective,closed:groups.length?states[groups[0].id]:null,groups:states};
  }
  function conductingPairs(c,d,actuators,sensors){
    if(d.instrument)return Instruments.links(c,d,actuators);
    // Opt-in SC11 and SC22 only: virtual plug-to-tip mV measurement path.
    // All other probes retain the existing electrical behavior.
    if(d.probeColor&&(c.sc11MeasurementProbe===true||c.mq07ThermocoupleMeterProbe===true))return [['PLUG','TIP']];
    if(d.doldSafety)return DoldSafety.links(c,d,!!actuators.get('@'+c.id),c._solveNow??Date.now());
    if(d.isPLC&&PLC)return PLC.links(c,d);
    if(d.terminalCount)return Array.from({length:d.terminalCount},(_,i)=>[String(2*i+1),String(2*i+2)]);
    if(d.diagramOnly)return [];
    if(d.id===V20.id)return V20.links(c,actuators);
    if(d.id===ACS.id)return ACS.links(c,actuators);
    if(['motor3','motor-yd'].includes(d.kind)||d.id==='motor-1p')return Components.motorLinks(c,d);
    const ids=d.pins.map(p=>p.id),k=d.kind,s=contactState(c,d,actuators);
    if(d.incrementalEncoder38mm){if(!sensors.has(c.id))return [];const es=IncrementalEncoder.state(c,d,c._solveNow??Date.now(),false);return ['A','B','Z'].filter(p=>es[p]===0).map(p=>['−',p])}
    if(['sensor','detector'].includes(k))return sensors.has(c.id)?d.dualSensor?Components.contactGroups(d).filter(g=>s.groups[g.id]).map(g=>[(c.sensorOutput||d.outputType)==='NPN'?'BU':'BN',g.b]):[[(c.sensorOutput||d.outputType)==='NPN'?'BU':'BN','BK']]:[];
    const groups=Components.contactGroups(d);
    if(groups.length)return groups.filter(g=>s.groups[g.id]).map(g=>[g.a,g.b]);
    if(['bjt-npn','bjt-pnp'].includes(k))return c._bjtOn?[['C','E']]:[];
    if(k==='mosfet-n'&&c.virtualLdrDimmer)return [];// Channel solved numerically, never short D–S.
    if(k==='mosfet-n'||k==='mosfet-p')return c._mosfetOn?[['D','S']]:[];
    if(k==='jfet-n')return c._jfetOn?[['D','S']]:[];
    if(k==='igbt-n')return c._igbtOn?[['C','E']]:[];
    if(k==='scr')return c._thyristorOn?[['A','K']]:[];
    if(k==='triac')return c._thyristorOn?[['MT1','MT2']]:[];
    if(k==='diac')return c._diacOn?[['A1','A2']]:[];
    if(['terminal','fuse','meter-a'].includes(k))return [[ids[0],ids[1]]];
    if(['distribution-block','splice'].includes(k))return ids.slice(1).map(id=>[ids[0],id]);
    if(d.ptWires)return [...(d.ptWires===4?[['A','A2']]:[]),...(d.ptWires>=3?[['B1','B2']]:[])];
    if(k==='current-transformer')return [['P1','P2']];
    // Loads and transformer windings are NOT ideal conducting links.
    return [];
  }
  function converter(d){
    if(d.id==='load-cell')return {input:['EX+','EX−'],output:['SIG+','SIG−'],legs:['+','0'],type:'dc',loadCell:true};
    if(d.id===ACS.id)return {input:['U1','V1','W1'],output:['U2','V2','W2'],legs:['L1','L2','L3'],type:'ac',acs:true,threePhase:true};
    if(d.id===HCFA.id)return {input:['L1','L2'],output:['U','V','W'],legs:['L1','L2','L3'],type:'ac',hcfa:true};
    if(d.id==='sinamics-v20-1p')return {input:['L1','N'],output:['U','V','W'],legs:['L1','L2','L3'],type:'ac',drive:true};
    if(d.kind==='power24')return {input:['L','N'],output:['P','M'],legs:['+','0'],type:'dc'};
    if(d.kind==='transformer'||d.kind==='autotransformer')return {input:['1','2'],output:['3','4'],legs:['L1','N'],type:'ac'};
    if(d.kind==='rectifier')return {input:['~1','~2'],output:['+','−'],legs:['+','0'],type:'dc'};
    if(d.kind==='transformer-3p')return {input:['L1','L2','L3'],output:['T1','T2','T3'],legs:['L1','L2','L3'],type:'ac',threePhase:true};
    if(['softstarter','vfd'].includes(d.kind))return {input:['L1','L2','L3'],output:d.kind==='vfd'?['U','V','W']:['T1','T2','T3'],legs:['L1','L2','L3'],type:'ac',threePhase:true};
    return null;
  }
  const equalMap=(a,b)=>a.size===b.size&&[...a].every(([k,v])=>b.get(k)===v);
  const equalSet=(a,b)=>a.size===b.size&&[...a].every(k=>b.has(k));
  function network(project,byId,actuators,sensors,measure=false,now=Date.now()){
    const parents=new Map(),valid=new Set();
    const find=x=>{if(!parents.has(x))parents.set(x,x);let p=x;while(parents.get(p)!==p)p=parents.get(p);while(parents.get(x)!==x){const n=parents.get(x);parents.set(x,p);x=n}return p};
    const join=(a,b)=>{if(valid.has(a)&&valid.has(b))parents.set(find(a),find(b))};
    for(const c of project.components)for(const p of definition(byId,c)?.pins||[])valid.add(pinKey(c.id,p.id));
    for(const j of project.junctions||[])valid.add(endpointKey({j:j.id}));
    for(const w of project.wires)if(!w.mechanical&&w.role!=='MECHANICAL')join(endpointKey(w.from),endpointKey(w.to));
    for(const c of project.components)if(definition(byId,c)?.probeColor&&c.probeTarget){const target=Leads.resolve(project,byId,c.probeTarget);if(target)join(pinKey(c.id,'TIP'),endpointKey(target))}
    for(const c of project.components){const d=definition(byId,c);if(d&&!(measure&&['current-transformer','meter-a'].includes(d.kind)))for(const [a,b] of conductingPairs(c,d,actuators,sensors))join(pinKey(c.id,a),pinKey(c.id,b))}
    const derived=project.components.filter(c=>converter(definition(byId,c)||{})),instruments=project.components.filter(c=>definition(byId,c)?.instrument);
    const drives=derived.filter(c=>isDrive(definition(byId,c)));
    let enabled=new Set(),potentials=new Map(),faultDomains=new Set(),faultRoots=new Set(),settled=false;
    function seed(c,p,domain,leg,type,volts=type==='dc'?24:230){
      const key=pinKey(c.id,p);if(!valid.has(key))return;
      const r=find(key);if(!potentials.has(r))potentials.set(r,new Map());
      potentials.get(r).set(domain+'|'+leg,{domain,leg,type,volts});
    }
    const at=(c,p)=>[...(potentials.get(find(pinKey(c.id,p)))?.values()||[])].filter(v=>!faultDomains.has(v.domain));
    function dcVoltage(c,a,b){
      const aa=at(c,a),bb=at(c,b);if(find(pinKey(c.id,a))===find(pinKey(c.id,b)))return aa.length?0:null;
      for(const x of aa)for(const y of bb)if(x.type==='dc'&&y.type==='dc'&&x.domain===y.domain)return (x.leg==='0'?0:x.volts)-(y.leg==='0'?0:y.volts);
      return null;
    }
    function voltage(c,a,b){
      if(find(pinKey(c.id,a))===find(pinKey(c.id,b)))return false;
      return at(c,a).some(x=>x.leg!=='PE'&&at(c,b).some(y=>y.domain===x.domain&&y.leg!==x.leg&&y.leg!=='PE'));
    }
    function threePhase(c,ids){
      if(ids.length!==3)return false;
      return at(c,ids[0]).some(a=>a.type==='ac'&&/^L[123]$/.test(a.leg)&&at(c,ids[1]).some(b=>b.domain===a.domain&&b.leg!==a.leg&&/^L[123]$/.test(b.leg)&&at(c,ids[2]).some(v=>v.domain===a.domain&&/^L[123]$/.test(v.leg)&&v.leg!==a.leg&&v.leg!==b.leg)));
    }
    function phaseDirection(c,ids){
      for(const a of at(c,ids[0]))for(const b of at(c,ids[1]))for(const v of at(c,ids[2])){
        if(a.type!=='ac'||a.domain!==b.domain||a.domain!==v.domain)continue;
        const seq=[a.leg,b.leg,v.leg];
        if(seq.every(p=>/^L[123]$/.test(p))&&new Set(seq).size===3)return ['L1,L2,L3','L2,L3,L1','L3,L1,L2'].includes(seq.join(','))?1:-1;
      }
      return 0;
    }
    function dcDirection(c,a,b){
      for(const x of at(c,a))for(const y of at(c,b))if(x.type==='dc'&&x.domain===y.domain&&x.leg!==y.leg)return x.leg==='+'?1:-1;
      return 1;
    }
    let previousSignals='';
    for(let pass=0;pass<Math.max(12,(derived.length+instruments.length)*3+4);pass++){
      potentials=new Map();faultDomains=new Set();faultRoots=new Set();
      for(const c of project.components){const d=definition(byId,c);if(!d||!sources.has(d.kind))continue;
        if(d.kind==='virtual-bipolar-study-source'){
          if(project?.tutorialLesson?.id==='oscillator-filter-apps-src-30'&&
             c.id==='ps'&&c.softwareOnly!==false){
            const magnitude=Math.max(0,Math.min(50,Number(c.railMagnitudeV??40))),
              domain='virtual-bipolar:'+c.id;
            seed(c,'VP',domain,'+','dc',magnitude);
            seed(c,'G',domain,'0','dc',0);
            seed(c,'VN',domain,'-','dc',-magnitude);
          }
        }else if(d.kind==='ac-virtual-source'){
          if(c.sourceEnabled!==false){const rms=Number(c.rmsVoltage??d.defaultRmsVoltage??12);
            if(Number.isFinite(rms)&&rms>=1&&rms<=24){seed(c,'AC','isolated-ac:'+c.id,'L1','ac',rms);seed(c,'RET','isolated-ac:'+c.id,'N','ac',rms)}}
        }else if(d.kind==='bell-transformer'){
          // Educational isolated secondary: no exposed or wireable mains terminals.
          if(c.transformerEnabled!==false){seed(c,'S1','bell-secondary:'+c.id,'L1','ac',12);seed(c,'S2','bell-secondary:'+c.id,'N','ac',12)}
        }else if(d.kind==='supply'||d.kind==='supply3'){
          for(const p of d.pins)if(c.phaseEnabled?.[p.id]!==false)seed(c,p.id,'mains',p.id==='L'?'L1':p.id,'ac',Math.max(0,Number(c.phaseVoltages?.[p.id]??230)));
        }else if(d.kind==='battery'){
          const cellV=x=>Math.max(.1,Math.min(48,Number(x.cellVoltage??definition(byId,x)?.defaultVoltage??1.5))),packId=String(c.seriesPackId||'').trim();
          if(packId){
            const pack=project.components.filter(x=>definition(byId,x)?.kind==='battery'&&String(x.seriesPackId||'').trim()===packId).sort((a,b)=>(Number(a.seriesIndex)||0)-(Number(b.seriesIndex)||0));
            const index=pack.findIndex(x=>x.id===c.id),linked=pack.length>1&&pack.slice(0,-1).every((x,i)=>find(pinKey(x.id,'−'))===find(pinKey(pack[i+1].id,'+')));
            if(linked&&index>=0){
              const total=pack.reduce((s,x)=>s+cellV(x),0),before=pack.slice(0,index).reduce((s,x)=>s+cellV(x),0),plus=total-before,minus=plus-cellV(c),domain='battery-pack:'+packId;
              seed(c,'+',domain,index===0?'+':'N'+index,'dc',plus);seed(c,'−',domain,index===pack.length-1?'0':'N'+(index+1),'dc',minus);
            }
          }else{const volts=cellV(c);seed(c,'+','battery:'+c.id,'+','dc',volts);seed(c,'−','battery:'+c.id,'0','dc',volts)}
        }else{const volts=d.excitationSource?Math.max(5,Math.min(15,Number(c.dcVoltage)||10)):24;seed(c,'P','dc:'+c.id,'+','dc',volts);seed(c,'M','dc:'+c.id,'0','dc',volts)}
      }
      for(const c of project.components){const d=definition(byId,c);if(!d)continue;
        if(d.arduinoBoard){
          const has=p=>(d.pins||[]).some(q=>q.id===p),groundPins=['GND','GND2','ICSP_GND','USBICSP_GND'].filter(has),fivePins=['5V','ICSP_5V','USBICSP_5V','IOREF'].filter(has);
          for(const p of fivePins)seed(c,p,'arduino5:'+c.id,'+','dc',5);for(const p of groundPins)seed(c,p,'arduino5:'+c.id,'0','dc',5);
          if(has('3V3')){seed(c,'3V3','arduino33:'+c.id,'+','dc',3.3);for(const p of groundPins)seed(c,p,'arduino33:'+c.id,'0','dc',3.3)}
          for(const [p,v] of Object.entries(c._arduinoRuntime?.outputs||{})){if(!has(p))continue;const volts=Math.max(0,Math.min(255,Number(v)||0))/255*5,domain='arduino-out:'+c.id+':'+p;seed(c,p,domain,'+','dc',volts);for(const gp of groundPins)seed(c,gp,domain,'0','dc',volts)}
        }else if(d.arduinoRole==='bench-supply'){
          const volts=Math.max(0,Math.min(30,Number(c.dcVoltage??d.defaultVoltage??5)));seed(c,'P','arduino-bench:'+c.id,'+','dc',volts);seed(c,'M','arduino-bench:'+c.id,'0','dc',volts);
        }else if(d.arduinoRole==='signal-generator'){
          const volts=Math.max(0,Math.min(5,Number(c._signalVoltage??0)));seed(c,'OUT','arduino-generator:'+c.id,'+','dc',volts);seed(c,'GND','arduino-generator:'+c.id,'0','dc',volts);
        }else if(d.id==='arduino-reed'&&c.mq07ReedDigitalModel===true){
 const feed=at(c,'VCC').filter(x=>x.type==='dc'&&x.leg==='+');
 const returns=at(c,'GND').filter(x=>x.type==='dc'&&x.leg==='0');
 const supply=feed.find(x=>Math.abs(x.volts-5)<.01&&returns.some(y=>y.domain===x.domain));
 const near=Math.max(0,Math.min(100,Number(c.reedMagnet??0)))>=65,high=!!(supply&&near);
 c._mq07ReedPowered=!!supply;c._mq07ReedMagnetNear=near;c._mq07ReedDO=high?1:0;
 if(supply){seed(c,'DO','mq07-reed:'+c.id,high?'+':'0','dc',5);seed(c,'GND','mq07-reed:'+c.id,'0','dc',5)}
 }else if(d.id==='arduino-lm35'&&c.mq07Lm35Model===true){
 const feed=at(c,'VCC').filter(x=>x.type==='dc'&&x.leg==='+');
 const returns=at(c,'GND').filter(x=>x.type==='dc'&&x.leg==='0');
 const supply=feed.find(x=>Math.abs(x.volts-5)<.01&&returns.some(y=>y.domain===x.domain));
 const input=Object.prototype.hasOwnProperty.call(c,'arduinoValue')?c.arduinoValue:d.arduinoDefault;
 const rawTemp=typeof input==='number'?input:(typeof input==='string'&&input.trim()!==''?Number(input):NaN);
 const validTemp=Number.isFinite(rawTemp)&&rawTemp>=0&&rawTemp<=125;
 const valid=!!supply&&validTemp;
 const volts=valid?rawTemp*.01:0;
 c._mq07Lm35AnalogV=valid?volts:null;c._mq07Lm35SupplyOk=valid;
 if(valid){seed(c,'AO','mq07-lm35:'+c.id,'+','dc',volts);seed(c,'GND','mq07-lm35:'+c.id,'0','dc',volts)}
 }else if(d.arduinoRole==='analog'&&d.pins?.some(p=>p.id==='AO')){
          const volts=Math.max(0,Math.min(5,Number(c.arduinoValue??d.arduinoDefault??0)/1023*5));seed(c,'AO','arduino-sensor:'+c.id,'+','dc',volts);if(d.pins.some(p=>p.id==='GND'))seed(c,'GND','arduino-sensor:'+c.id,'0','dc',volts);
        }
      }
      /* MQ07_STANDALONE_NE555_ASTABLE: opt-in physical RC graph; virtual 1/3-2/3
       * ideal timing model, not an analog SPICE/physical NE555 acceptance. */
      for(const c of project.components){
        const d=definition(byId,c);
        if(d?.arduinoRole!=='ne555'||c.ne555Mode!=='astable'||c.mq07Standalone555Astable!==true)continue;
        const root=(x,p)=>find(pinKey(x.id,p)),same=(x,p,y,q)=>root(x,p)===root(y,q),
          parts=project.components;
        const rail=at(c,'VCC').find(x=>x.type==='dc'&&x.leg==='+'&&x.volts>=4.5&&x.volts<=5.5&&
          at(c,'GND').some(y=>y.domain===x.domain&&y.leg==='0'));
        const resetOk=!!rail&&same(c,'RESET',c,'VCC'),
          timing=parts.find(x=>{
            const xd=definition(byId,x);
            return (xd?.kind==='capacitor'||xd?.arduinoRole==='electrolytic')&&
              xd.pins.some(z=>z.id==='+')&&xd.pins.some(z=>z.id==='-')&&
              same(x,'+',c,'TRIG')&&same(x,'+',c,'THRES')&&same(x,'-',c,'GND');
          }),
          res=parts.filter(x=>definition(byId,x)?.kind==='resistor'),
          ra=res.find(x=>same(x,'1',c,'VCC')&&same(x,'2',c,'DISCH')),
          rb=res.find(x=>same(x,'1',c,'DISCH')&&timing&&same(x,'2',timing,'+'));
        const raOhm=Number(ra?.resistance??definition(byId,ra||{})?.resistance),
          rbOhm=Number(rb?.resistance??definition(byId,rb||{})?.resistance),
          farad=Number(timing?.capacitance??definition(byId,timing||{})?.capacitance),
          ok=!!(resetOk&&timing&&ra&&rb&&ra!==rb&&Number.isFinite(raOhm)&&raOhm>0&&
            Number.isFinite(rbOhm)&&rbOhm>0&&Number.isFinite(farad)&&farad>0&&
            Number.isFinite(now)&&now>=0);
        const highMs=ok?Math.LN2*(raOhm+rbOhm)*farad*1000:0,
          lowMs=ok?Math.LN2*rbOhm*farad*1000:0,period=highMs+lowMs;
        const powered=!!(ok&&Number.isFinite(period)&&period>.01&&period<1e9);
        if(!powered||!Number.isFinite(c._mq07Ne555Epoch)||now<c._mq07Ne555Epoch)
          c._mq07Ne555Epoch=powered?now:null;
        const phase=powered?(now-c._mq07Ne555Epoch)%period:0,
          high=!!(powered&&phase<highMs);
        c._mq07Ne555StandalonePowered=powered;
        c._ne555Out=high;c._ne555Discharge=!high;
        c._ne555Frequency=powered?1000/period:0;
        c._ne555HighMs=powered?highMs:0;c._ne555LowMs=powered?lowMs:0;
        c._active=high;
        if(powered){
          seed(c,'OUT','mq07-ne555:'+c.id,high?'+':'0','dc',rail.volts);
          seed(c,'GND','mq07-ne555:'+c.id,'0','dc',rail.volts);
        }
      }
      /* MQ07_STANDALONE_NE555_PWM: only the correct D1/D2-potentiometer RC
       * terminal graph enables this ideal educational (not SPICE) PWM model. */
      for(const c of project.components){
        const d=definition(byId,c);
        if(d?.arduinoRole!=='ne555'||c.ne555Mode!=='pwm'||c.mq07Standalone555Pwm!==true)continue;
        const root=(x,p)=>find(pinKey(x.id,p)),same=(x,p,y,q)=>root(x,p)===root(y,q),
          parts=project.components;
        const rail=at(c,'VCC').find(x=>x.type==='dc'&&x.leg==='+'&&x.volts>=4.5&&x.volts<=5.5&&
          at(c,'GND').some(y=>y.domain===x.domain&&y.leg==='0')),
          resetOk=!!rail&&same(c,'RESET',c,'VCC');
        const timing=parts.find(x=>definition(byId,x)?.arduinoRole==='electrolytic'&&
          same(x,'+',c,'TRIG')&&same(x,'+',c,'THRES')&&same(x,'-',c,'GND')),
          resistors=parts.filter(x=>definition(byId,x)?.kind==='resistor'),
          ra=resistors.find(x=>same(x,'1',c,'VCC')&&same(x,'2',c,'DISCH')),
          rv=parts.find(x=>definition(byId,x)?.kind==='potentiometer'&&
            timing&&same(x,'2',timing,'+')),
          diodes=parts.filter(x=>['1n4148-do35','arduino-diode-1n4148'].includes(x.typeId)),
          dch=diodes.find(x=>same(x,'A',c,'DISCH')&&rv&&same(x,'K',rv,'1')),
          rd=resistors.find(x=>rv&&same(x,'1',rv,'3')),
          ddis=diodes.find(x=>x!==dch&&rd&&same(x,'A',rd,'2')&&same(x,'K',c,'DISCH')),
          rA=Number(ra?.resistance??definition(byId,ra||{})?.resistance),
          rD=Number(rd?.resistance??definition(byId,rd||{})?.resistance),
          rPot=Number(rv?.potMax??definition(byId,rv||{})?.potMax),
          pct=Number(rv?.potentiometer),
          cap=Number(timing?.capacitance??definition(byId,timing||{})?.capacitance),
          ok=!!(resetOk&&timing&&ra&&rv&&dch&&ddis&&rd&&
            Number.isFinite(rA)&&rA>0&&Number.isFinite(rD)&&rD>0&&
            Number.isFinite(rPot)&&rPot>0&&Number.isFinite(pct)&&pct>=0&&pct<=100&&
            Number.isFinite(cap)&&cap>0&&Number.isFinite(now)&&now>=0);
        const tHigh=ok?Math.LN2*(rA+rPot*pct/100)*cap*1000:0,
          tLow=ok?Math.LN2*(rD+rPot*(1-pct/100))*cap*1000:0,
          period=tHigh+tLow,
          powered=!!(ok&&Number.isFinite(period)&&period>.01&&period<1e9);
        if(!powered||!Number.isFinite(c._mq07Ne555PwmEpoch)||now<c._mq07Ne555PwmEpoch)
          c._mq07Ne555PwmEpoch=powered?now:null;
        const phase=powered?(now-c._mq07Ne555PwmEpoch)%period:0,
          high=!!(powered&&phase<tHigh);
        c._mq07Ne555PwmPowered=powered;c._ne555Out=high;c._ne555Discharge=!high;
        c._ne555HighMs=powered?tHigh:0;c._ne555LowMs=powered?tLow:0;
        c._ne555Frequency=powered?1000/period:0;
        c._ne555DutyPercent=powered?100*tHigh/period:0;
        c._active=high;
        if(powered){
          seed(c,'OUT','mq07-ne555-pwm:'+c.id,high?'+':'0','dc',rail.volts);
          seed(c,'GND','mq07-ne555-pwm:'+c.id,'0','dc',rail.volts);
        }
      }
      // Terminalized virtual PWM source: the output is electrically referenced to
      // the same DC supply domain, rather than mutating a pushbutton state.
      for(const c of project.components){
        if(definition(byId,c)?.kind!=='pwm-generator')continue;
        const duty=c.dutyPercent,hz=c.frequencyHz;
        const valid=typeof duty==='number'&&typeof hz==='number'&&Number.isFinite(duty)&&duty>=0&&duty<=100&&
          Number.isFinite(hz)&&hz>0&&Number.isFinite(now)&&now>=0;
        const feeds=at(c,'V+').filter(v=>v.type==='dc'&&v.leg==='+');
        const returns=at(c,'GND').filter(v=>v.type==='dc'&&v.leg==='0');
        const supply=feeds.find(v=>returns.some(g=>g.domain===v.domain));
        const period=valid?1000/hz:NaN;
        const enabled=!!(supply&&Number.isFinite(period)&&period>0);
        const high=!!(enabled&&(duty===100||(duty>0&&now%period<period*duty/100)));
        c._pwmSupplyValid=enabled;c._pwmHigh=high;
        if(enabled)seed(c,'OUT',supply.domain,high?'+':'0','dc',supply.volts);
      }
      for(const c of project.components){
        const d=definition(byId,c);if(!d?.digitalIc||!DigitalIC)continue;
        for(const o of DigitalIC.outputSeeds(c,d,{dcVoltage})){
          const domain='digital:'+c.id+':'+o.pin,leg=o.logic?'+':'0';
          seed(c,o.pin,domain,leg,'dc',o.voltage);seed(c,o.ground,domain,'0','dc',o.voltage);
        }
      }
      for(const c of project.components){
        const d=definition(byId,c);if(!d?.isPLC||!PLC)continue;
        // Respect the PLC's own configured program. SC202 has no verified
        // delayed-stop/TON/TOF model: do not silently force timed-stop here.
        PLC.evaluate(c,d,{at,dcVoltage,voltage,find},now);
      }
      for(const c of project.components){const d=definition(byId,c);if(d?.doldSafety)DoldSafety.seedControl(c,d,{at,dcVoltage,voltage},seed)}
      for(const c of instruments)for(const [i,v] of (c._instrument?.voltage||[]).entries()){seed(c,v.a,'instrument:'+c.id+':'+i,'+','dc',v.value);seed(c,v.b,'instrument:'+c.id+':'+i,'0','dc',v.value)}
      for(const c of derived)if(enabled.has(c.id)){
        const spec=converter(definition(byId,c));
        if(spec.loadCell){const ex=dcVoltage(c,...spec.input);if(ex!==null&&Math.abs(ex)>0&&Math.abs(ex)<=15){const mv=Devices.output({...c,_loadExcitation:ex},definition(byId,c)).value;seed(c,'SIG+','load:'+c.id,'+','dc',mv/1000);seed(c,'SIG−','load:'+c.id,'0','dc',mv/1000)}continue}
        let legs=spec.legs;
        if(spec.hcfa){
          const hs=c._hcfa;seed(c,'CN1:17','hcfa24:'+c.id,'+','dc',24);seed(c,'CN1:14','hcfa24:'+c.id,'0','dc',24);
          if(hs?.running)spec.output.forEach((p,i)=>seed(c,p,'out:'+c.id,['L1','L2','L3'][i],'ac',Math.max(10,(hs.voltageIn||230)/Math.sqrt(3))));
          continue;
        }
        if(spec.acs){
          const s=c._acs800;
          seed(c,'X22:7','acsdi:'+c.id,'+','dc',24);seed(c,'X22:10','acsdi:'+c.id,'0','dc',24);
          seed(c,'X21:1','acsanalog:'+c.id,'plus10','dc',10);seed(c,'X20:1','acsanalog:'+c.id,'minus10','dc',-10);seed(c,'X21:2','acsanalog:'+c.id,'0','dc',10);
          if(!c._acsExternal){seed(c,'X23:1','acsaux:'+c.id,'+','dc',24);seed(c,'X23:2','acsaux:'+c.id,'0','dc',24);}
          if(s?.powered){seed(c,'R+','bus:'+c.id,'+','dc',s.bus);seed(c,'UDC-','bus:'+c.id,'0','dc',0);}
          if(s?.running)spec.output.forEach((p,i)=>seed(c,p,'out:'+c.id,(s.hz<0?['L1','L3','L2']:['L1','L2','L3'])[i],'ac',s.voltage/Math.sqrt(3)));
          continue;
        }
        if(spec.drive){
          seed(c,'13','control:'+c.id,'+','dc',24);seed(c,'14','control:'+c.id,'0','dc',24);seed(c,'1','control:'+c.id,'V10','dc',10);
          if(c._v20?.powered){seed(c,'DC+','bus:'+c.id,'+','dc',c._v20.bus);seed(c,'DC-','bus:'+c.id,'0','dc',0);}
          if(!c._v20?.running)continue;
          legs=c._v20.hz<0?['L1','L3','L2']:['L1','L2','L3'];
          spec.output.forEach((p,i)=>seed(c,p,'out:'+c.id,legs[i],'ac',c._v20.voltage/Math.sqrt(3)));
          continue;
        }else if(definition(byId,c).kind==='softstarter'&&phaseDirection(c,spec.input)<0)legs=['L1','L3','L2'];
        spec.output.forEach((p,i)=>seed(c,p,'out:'+c.id,legs[i],spec.type,definition(byId,c).kind==='rectifier'?230*2*Math.SQRT2/Math.PI:spec.type==='dc'?24:230));
      }
      for(const c of instruments){const d=definition(byId,c),s=measure&&c._instrument?c._instrument:Instruments.state(c,d,project,byId,{at,dcVoltage,find});c._instrument=s;
        if(!measure&&d.instrument==='et4420'&&s.on&&actuators.get('@'+c.id+':ssr'))s.voltage.push({a:'4',b:'5',value:24});
      }
      for(const c of project.components){const d=definition(byId,c);if(!['sensor-level-analog','sensor-linear-position','sensor-ultrasonic-analog'].includes(d?.id))continue;
        const a=d.id==='sensor-linear-position'?'2':'Q',b=Devices.supplyPins(d)[1],on=Devices.supply(c,d,{at})==='ok',signal=on?Devices.output(c,d):null;
        c._sensorSignal=signal?.unit==='mA'?{a,b,value:signal.value/1000}:null;
        if(signal?.unit==='V'){seed(c,a,'analog:'+c.id,'+','dc',signal.value);seed(c,b,'analog:'+c.id,'0','dc',signal.value);}
      }
      // Passive thermocouples produce an EMF without an external supply.
      for(const c of project.components){const d=definition(byId,c);if(d?.id==='thermocouple'){const v=Devices.output(c,d).value/1000;for(let i=0;i+1<d.pins.length;i+=2){seed(c,d.pins[i].id,'tc:'+c.id+':'+i,'+','dc',v);seed(c,d.pins[i+1].id,'tc:'+c.id+':'+i,'0','dc',v)}}}
      // MQ-07 piezo: the actual circuit has a passive low-voltage transient
      // between the two electrodes; no external 24 V digital sensor supply.
      for(const c of project.components){
        const d=definition(byId,c);if(d?.id!=='tutorial-piezo')continue;
        const pulse=Devices.piezoPulse(c,now);c._piezoMv=pulse.valueMv;
        if(pulse.transient){
          const domain='piezo:'+c.id,volts=pulse.valueMv/1000;
          seed(c,'+',domain,'+','dc',volts);
          seed(c,'−',domain,'0','dc',volts);
        }
      }
      for(const c of project.components){const d=definition(byId,c);if(d?.digitalIc&&DigitalIC)DigitalIC.evaluate(c,d,{dcVoltage},now)}
      for(const c of project.components){const d=definition(byId,c);if(d?.kind!=='electret-mic')continue;
        const db=Number(c.soundLevelDb??d.defaultSoundDb??60),sens=Number(d.sensitivityDbvPa??-44),pa=Math.pow(10,(db-94)/20),vrms=Math.pow(10,sens/20)*pa,phase=((now%10)/10)*Math.PI*2,v=vrms*Math.SQRT2*Math.sin(phase);
        seed(c,'+','mic:'+c.id,'+','dc',Math.max(0,Math.abs(v)));seed(c,'-','mic:'+c.id,'0','dc',Math.max(0,Math.abs(v)));c._microphoneVoltage=v;c._microphoneVrms=vrms;
      }
      for(const [r,values] of potentials){
        const domains=new Map();for(const v of values.values()){
          if(domains.has(v.domain)&&domains.get(v.domain)!==v.leg){faultDomains.add(v.domain);faultRoots.add(r)}
          domains.set(v.domain,v.leg);
        }
      }
      const next=new Set();
      for(const c of derived){const spec=converter(definition(byId,c));if(spec.hcfa){if(voltage(c,'L1','L2'))next.add(c.id);continue;}if(spec.acs){const ext=dcVoltage(c,'X23:1','X23:2'),external=at(c,'X23:1').some(v=>v.domain!=='acsaux:'+c.id);c._acsExternal=external&&ext>=21.6&&ext<=26.4;if(threePhase(c,spec.input)||voltage(c,'U1','V1')||voltage(c,'U1','W1')||voltage(c,'V1','W1')||c._acsExternal)next.add(c.id);continue;}const ex=spec.loadCell?dcVoltage(c,...spec.input):null;if(spec.loadCell?(ex!==null&&Math.abs(ex)>0&&Math.abs(ex)<=15):spec.threePhase?threePhase(c,spec.input):voltage(c,...spec.input))next.add(c.id)}
      if(drives.length&&!measure){
        const sample=Numeric.update(project,byId,{at,find},{sampleOnly:true,now});
        for(const c of drives){
          const hcfa=c.typeId===HCFA.id,abb=c.typeId===ACS.id;let inputVoltage=0;
          for(const a of at(c,abb?'U1':'L1'))for(const b of at(c,abb?'V1':hcfa?'L2':'N'))if(a.type==='ac'&&a.domain===b.domain&&a.leg!==b.leg&&a.leg!=='PE'&&b.leg!=='PE'){
            const ph=v=>{const angle={L1:0,L2:-2*Math.PI/3,L3:2*Math.PI/3}[v.leg]||0,m=v.leg==='N'?0:v.volts;return [m*Math.cos(angle),m*Math.sin(angle)]};const x=ph(a),y=ph(b);inputVoltage=Math.hypot(x[0]-y[0],x[1]-y[1]);
          }
          let phases=0;if(abb){const vals=['U1','V1','W1'].map(p=>at(c,p).find(v=>v.type==='ac'&&/^L[123]$/.test(v.leg)));phases=new Set(vals.filter(Boolean).map(v=>v.domain+v.leg)).size;if(!inputVoltage&&phases>=2){const legs=vals.filter(Boolean);inputVoltage=Math.sqrt(legs[0].volts**2+legs[1].volts**2+legs[0].volts*legs[1].volts);}}
          const roots=(abb?['U2','V2','W2']:['U','V','W']).map(p=>find(pinKey(c.id,p)));
          const motorConnected=project.components.some(m=>{const d=definition(byId,m);if(!d||!phaseMotors.has(d.kind)||!d.pins.slice(0,3).every(p=>roots.includes(find(pinKey(m.id,p.id)))))return false;
            if(!['motor3','motor-yd'].includes(d.kind))return true;const upper=d.pins.slice(0,3).map(p=>find(pinKey(m.id,p.id))),lower=['U2','V2','W2'].map(p=>find(pinKey(m.id,p)));return new Set(lower).size===1&&!upper.includes(lower[0])||lower.every((r,i)=>r===upper[(i+1)%3]);});
          if(hcfa){
            const roots=['U','V','W'].map(p=>find(pinKey(c.id,p))),allMotor=project.components.filter(m=>phaseMotors.has(definition(byId,m)?.kind)),exact=allMotor.find(m=>m.typeId===HCFA.motorId&&['U','V','W'].every((p,i)=>find(pinKey(m.id,p))===roots[i]));
            const any=allMotor.find(m=>['U','V','W'].every((p,i)=>definition(byId,m)?.pins?.some(q=>q.id===p)&&find(pinKey(m.id,p))===roots[i]));
            const encoderConnected=!!exact&&find(pinKey(c.id,'CN2'))===find(pinKey(exact.id,'ENC'));
            const di=['CN1:9','CN1:10','CN1:34','CN1:8','CN1:33','CN1:32','CN1:31','CN1:30'].map(p=>{const v=dcVoltage(c,p,'CN1:11');return v!==null&&Math.abs(v)>=11;});
            let pulseHz=0,pulseDirection=1;for(const src of project.components.filter(x=>definition(byId,x)?.hcfaPulseSource)){const pulseRoot=find(pinKey(src.id,'PULSE')),dirRoot=find(pinKey(src.id,'DIR')),pulseLinked=[find(pinKey(c.id,'CN1:43')),find(pinKey(c.id,'CN1:41'))].includes(pulseRoot),dirLinked=[find(pinKey(c.id,'CN1:39')),find(pinKey(c.id,'CN1:37'))].includes(dirRoot);if(pulseLinked){pulseHz=Math.max(0,Number(src.pulseHz??1000));pulseDirection=Number(src.pulseDirection??1)>=0?1:-1;if(!dirLinked)pulseDirection=1;src._active=true;src._hcfaLinkedDrive=c.id;}}
            for(const master of project.components.filter(x=>definition(byId,x)?.hcfaModbusMaster)){const plus=find(pinKey(master.id,'485+')),minus=find(pinKey(master.id,'485-')),linked=[['CN4:4','CN4:5'],['CN5:4','CN5:5']].some(([a,b])=>find(pinKey(c.id,a))===plus&&find(pinKey(c.id,b))===minus);if(linked){master._active=true;master._hcfaModbusLinked=c.id;c._hcfaModbusLinked=master.id;}}
            HCFA.tick(c,{voltage:inputVoltage,di,pulseHz,pulseDirection,motorConnected:!!exact,motorCompatible:!any||!!exact,encoderConnected,outputPhaseLoss:!!c._hcfa?.servoOn&&!exact},c._solveNow??Date.now());continue;
          }
          if(abb){const di=Array.from({length:6},(_,i)=>{const volts=dcVoltage(c,'X22:'+(i+1),'X22:'+(i<4?9:10));return volts!==null&&(volts>12||volts>=8&&!!c._acs800Frame?.base?.di[i]);});
            ACS.tick(c,{voltage:inputVoltage,phases,external24:c._acsExternal?dcVoltage(c,'X23:1','X23:2'):0,di,diil:(dcVoltage(c,'X22:11','X22:10')||0)>12,ai:[sample.dc(c,'X21:3','X21:4'),sample.dc(c,'X21:5','X21:6'),sample.dc(c,'X21:7','X21:8')],outputShort:new Set(roots).size<3,motorConnected},c._solveNow??Date.now());continue;
          }
          const di=['8','9','10','11'].map((p,i)=>{const v=dcVoltage(c,p,'12');return v!==null&&(Math.abs(v)>=11||Math.abs(v)>5&&!!c._v20Frame?.base?.di[i]);});
          V20.tick(c,{voltage:inputVoltage,di,ai:[sample.dc(c,'2','5'),sample.dc(c,'3','5')],outputShort:new Set(roots).size<3,motorConnected},c._solveNow??Date.now());
        }
      }
      const signals=JSON.stringify([[...potentials].map(([r,v])=>[r,[...v.values()]]),instruments.map(c=>c._instrument),drives.map(driveState),project.components.filter(c=>definition(byId,c)?.digitalIc).map(c=>DigitalIC?.signature?.(c)||'')]);
      if(equalSet(next,enabled)&&signals===previousSignals){settled=true;break}enabled=next;previousSignals=signals;
    }
    return {voltage,dcVoltage,threePhase,phaseDirection,dcDirection,at,find,potentials,faultDomains,faultRoots,enabled,settled};
  }
  // Opt-in low-voltage SC127/128 teaching model. No other BJT/NE555 project changes.
  function solveSc127Motor(project,byId,options={}){
    if(!['electronic-switching-src-04','electronic-switching-src-05'].includes(project?.tutorialLesson?.id))return null;
    const c=Object.fromEntries(project.components.map(x=>[x.id,x]));
    const {ps,btn,r,q,m: motor,d}=c;
    if(![ps,btn,r,q,motor,d].every(Boolean)||project.components.length!==6)return null;
    if(ps.typeId!=='arduino-bench-supply'||btn.typeId!=='arduino-button'||
      r.typeId!=='arduino-resistor-1k'||q.typeId!=='arduino-bd139'||
      motor.typeId!=='arduino-dc-motor'||d.typeId!=='arduino-diode-1n4007')return null;
    const pins=definition(byId,q)?.pinMap;
    if(pins?.['1']!=='B'||pins?.['2']!=='C'||pins?.['3']!=='E')return null;
    const links=new Set(project.wires.map(w=>[w.from.c+'/'+w.from.p,w.to.c+'/'+w.to.p].sort().join('~')));
    const wire=(id,p,id2,p2)=>links.has([id+'/'+p,id2+'/'+p2].sort().join('~'));
    const buttonSupply=wire('ps','P','btn','VCC')&&wire('ps','M','btn','GND');
    const base=wire('btn','SIG','r','1')&&wire('r','2','q','1');
    const emitter=wire('q','3','ps','M'),collector=wire('m','-','q','2'),feed=wire('ps','P','m','+');
    const diodeOK=wire('m','-','d','A')&&wire('d','K','m','+');
    const reverseDiode=wire('m','-','d','K')&&wire('d','A','m','+');
    const voltage=Number(ps.dcVoltage??definition(byId,ps)?.defaultVoltage??5);
    const resistance=Number(r.resistance??definition(byId,r)?.resistance??1000);
    const supply=ps.sourceEnabled!==false&&Number.isFinite(voltage)&&voltage>=3&&voltage<=6&&
      Number.isFinite(resistance)&&resistance>=220&&resistance<=10000;
    const pressed=btn.state===true||btn._pressed===true;
    const on=!!(supply&&pressed&&buttonSupply&&base&&emitter&&collector&&feed&&diodeOK&&!reverseDiode);
    for(const component of project.components){component._active=false;component._powered=false;}
    btn._active=btn._powered=!!(supply&&buttonSupply&&pressed);
    q._bjtOn=q._active=q._powered=on;
    motor._active=motor._powered=on;motor._spin=on?1:0;
    motor._motorRPM=on?(Number(motor.motorRatedRpm)||3000):0;
    motor._motorAngle=on?((Number(motor._motorAngle)||0)+Number(options.now||0)*.12)%360:0;
    motor._arduinoMotorAngle=motor._motorAngle;
    r._active=r._powered=on;
    const fault=!!(reverseDiode&&supply&&pressed&&buttonSupply&&base&&emitter&&collector&&feed);
    return {blocked:fault,stable:true,oscillating:false,shortCircuit:fault,
      reason:fault?'sc127-reversed-flyback-diode':null,nativeModel:'sc127-low-voltage-bd139',motorPowered:on};
  }

  function solve(project,byId,options={}){
    const scopedMotor=solveSc127Motor(project,byId,options);
    if(scopedMotor)return scopedMotor;
    // BELL_TRANSFORMER_V1: refuse legacy mains-fed bell schematics.
    // Saved user graphs are never silently rewritten or converted.
    const bellPresent=project.components.some(c=>c.typeId==='bell-electronic');
    if(bellPresent){
      const bellTrafo=project.components.find(c=>c.typeId==='bell-transformer');
      const mainsPresent=project.components.some(c=>['supply-1p','supply-3p'].includes(c.typeId));
      const invalidSecondary=!!bellTrafo&&project.wires.some(w=>
        (w.from?.c===bellTrafo.id&&!['S1','S2'].includes(w.from?.p))||
        (w.to?.c===bellTrafo.id&&!['S1','S2'].includes(w.to?.p)));
      if(!bellTrafo||mainsPresent||invalidSecondary){
        clear(project);
        return {blocked:true,stable:false,shortCircuit:false,oscillating:false,
          safetyWarning:'Zil devresinde doğrudan şebeke fazı kullanılmaz; yalıtılmış uygun zil trafosu gereklidir. Yalnız sanal eğitim devresi oluşturun.',
          reason:'bell-transformer-required'};
      }
    }
    const now=Number.isFinite(options.now)?options.now:Date.now(),timedStates=new Map();
    // MQ-05 SC11: PWM drives a *virtual switch command*; all MOSFET and
    // motor electrical outcomes remain owned by the original nodal solver.
    // This is no motor speed, torque or hardware driver model.
    for(const sw of project.components.filter(c=>c.mq05PwmGateSwitch===true)){
      const cfg=project.mq05VirtualPwm||{},valid=Number.isFinite(cfg.dutyPercent)&&
        cfg.dutyPercent>=0&&cfg.dutyPercent<=100&&Number.isFinite(cfg.frequencyHz)&&
        cfg.frequencyHz>0&&Number.isFinite(now)&&now>=0;
      const period=valid?1000/cfg.frequencyHz:0;
      sw.state=!!(valid&&Number.isFinite(period)&&period>0&&
        (cfg.dutyPercent===100||(cfg.dutyPercent>0&&(now%period)<period*cfg.dutyPercent/100)));
      sw._mq05PwmValid=!!valid;
    }
    /* MQ07_SC386_BJT_MONOSTABLE: opt-in two-BJT RC pulse on push rising edge.
     * Source-exact low-voltage circuit, ideal non-retriggerable RC timing only. */
    {
      const pair=project.components.filter(c=>c.mq07StandaloneBjtMonostable===true);
      if(pair.length){
        const get=id=>project.components.find(c=>c.id===id),
          q1=get('q1'),q2=get('q2'),g=get('g'),rc1=get('rc1'),rc2=get('rc2'),
          rb2=get('rb2'),rfb=get('rfb'),rpd=get('rpd'),rtr=get('rtr'),
          c1=get('c1'),s1=get('s1'),
          wire=(a,ap,b,bp)=>project.wires.some(w=>
            (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
            (w.from?.c===b&&w.from?.p===bp&&w.to?.c===a&&w.to?.p===ap)),
          resistor=x=>definition(byId,x)?.kind==='resistor'&&
            Number.isFinite(Number(x.resistance))&&Number(x.resistance)>0;
        const valid=!!(pair.length===2&&q1&&q2&&pair.includes(q1)&&pair.includes(q2)&&
          definition(byId,q1)?.kind==='bjt-npn'&&definition(byId,q2)?.kind==='bjt-npn'&&
          definition(byId,g)?.id==='arduino-bench-supply'&&Number(g.dcVoltage)===5&&
          [rc1,rc2,rb2,rfb,rpd,rtr].every(resistor)&&
          definition(byId,c1)?.kind==='capacitor'&&
          Number.isFinite(Number(c1.capacitance))&&Number(c1.capacitance)>0&&
          definition(byId,s1)?.id==='push-no'&&
          wire('g','P','rc1','1')&&wire('rc1','2','q1','C')&&
          wire('g','P','rc2','1')&&wire('rc2','2','q2','C')&&
          wire('q1','E','g','M')&&wire('q2','E','g','M')&&
          wire('g','P','rb2','1')&&wire('rb2','2','q2','B')&&
          wire('q2','C','rfb','1')&&wire('rfb','2','q1','B')&&
          wire('q1','C','c1','1')&&wire('c1','2','q2','B')&&
          wire('g','P','s1','13')&&wire('s1','14','rtr','1')&&wire('rtr','2','q1','B')&&
          wire('q1','B','rpd','1')&&wire('rpd','2','g','M')&&
          Number.isFinite(now)&&now>=0);
        if(q1&&q2){
          const duration=valid?Math.LN2*Number(rb2.resistance)*Number(c1.capacitance)*1000:0,
            powered=valid&&Number.isFinite(duration)&&duration>.01&&duration<1e9;
          if(!powered||options.reset||now<Number(q1._mq07BjtMonostableStart)){
            delete q1._mq07BjtMonostableStart;
            q1._mq07BjtMonostablePrevTrigger=false;
          }
          const trigger=powered&&s1.state===true,
            edge=trigger&&!q1._mq07BjtMonostablePrevTrigger,
            oldStart=q1._mq07BjtMonostableStart,
            oldActive=Number.isFinite(oldStart)&&now-oldStart<duration;
          if(edge&&!oldActive)q1._mq07BjtMonostableStart=now;
          q1._mq07BjtMonostablePrevTrigger=trigger;
          const start=q1._mq07BjtMonostableStart,
            active=!!(powered&&Number.isFinite(start)&&now>=start&&now-start<duration);
          q1._mq07BjtMonostablePowered=powered;
          q2._mq07BjtMonostablePowered=powered;
          q1._mq07BjtMonostableDurationMs=powered?duration:0;
          q1._mq07BjtMonostableRemainingMs=active?duration-(now-start):0;
          q1._bjtOn=active;
          q2._bjtOn=!!(powered&&!active);
        }
      }
    }
    /* MQ07_SC387_BJT_BISTABLE: opt-in ideal cross-coupled BJT memory.
     * Only the full low-voltage SET/RESET terminal graph is accepted. */
    {
      const pair=project.components.filter(c=>c.mq07StandaloneBjtBistable===true);
      if(pair.length){
        const get=id=>project.components.find(c=>c.id===id),
          q1=get('q1'),q2=get('q2'),g=get('g'),rc1=get('rc1'),rc2=get('rc2'),
          rfb1=get('rfb1'),rfb2=get('rfb2'),sset=get('sset'),sreset=get('sreset'),
          rset=get('rset'),rreset=get('rreset'),
          wire=(a,ap,b,bp)=>project.wires.some(w=>
            (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
            (w.from?.c===b&&w.from?.p===bp&&w.to?.c===a&&w.to?.p===ap));
        const resistor=x=>definition(byId,x)?.kind==='resistor'&&
          Number.isFinite(Number(x.resistance))&&Number(x.resistance)>0;
        const valid=!!(pair.length===2&&q1&&q2&&pair.includes(q1)&&pair.includes(q2)&&
          definition(byId,q1)?.kind==='bjt-npn'&&definition(byId,q2)?.kind==='bjt-npn'&&
          definition(byId,g)?.id==='arduino-bench-supply'&&Number(g.dcVoltage)===5&&
          [rc1,rc2,rfb1,rfb2,rset,rreset].every(resistor)&&
          definition(byId,sset)?.id==='push-no'&&definition(byId,sreset)?.id==='push-no'&&
          wire('g','P','rc1','1')&&wire('rc1','2','q1','C')&&
          wire('g','P','rc2','1')&&wire('rc2','2','q2','C')&&
          wire('q1','E','g','M')&&wire('q2','E','g','M')&&
          wire('q1','C','rfb1','1')&&wire('rfb1','2','q2','B')&&
          wire('q2','C','rfb2','1')&&wire('rfb2','2','q1','B')&&
          wire('g','P','sset','13')&&wire('sset','14','rset','1')&&wire('rset','2','q1','B')&&
          wire('g','P','sreset','13')&&wire('sreset','14','rreset','1')&&wire('rreset','2','q2','B')&&
          Number.isFinite(now)&&now>=0);
        if(q1&&q2){
          if(!valid||options.reset){
            delete q1._mq07BjtBistableMemory;
            delete q1._mq07BjtBistablePrevSet;
            delete q1._mq07BjtBistablePrevReset;
          }
          const set=valid&&sset.state===true,reset=valid&&sreset.state===true;
          if(valid&&!Number.isFinite(q1._mq07BjtBistableMemory))
            q1._mq07BjtBistableMemory=0;
          if(valid&&!set&&!reset){
            q1._mq07BjtBistablePrevSet=false;
            q1._mq07BjtBistablePrevReset=false;
          }else if(valid){
            const setEdge=set&&!q1._mq07BjtBistablePrevSet;
            const resetEdge=reset&&!q1._mq07BjtBistablePrevReset;
            if(setEdge&&!reset)q1._mq07BjtBistableMemory=1;
            if(resetEdge&&!set)q1._mq07BjtBistableMemory=0;
            q1._mq07BjtBistablePrevSet=set;
            q1._mq07BjtBistablePrevReset=reset;
          }
          const drive=valid&&!(set&&reset);
          q1._mq07BjtBistablePowered=drive;
          q2._mq07BjtBistablePowered=drive;
          q1._bjtOn=!!(drive&&q1._mq07BjtBistableMemory===1);
          q2._bjtOn=!!(drive&&q1._mq07BjtBistableMemory===0);
        }
      }
    }
    /* MQ07_SC388_BJT_ASTABLE: source-validated opt-in virtual ideal RC switching.
     * This does not replace the default physical BJT solver. */
    {
      const pair=project.components.filter(c=>c.mq07StandaloneBjtAstable===true);
      if(pair.length){
        const [q1,q2]=[project.components.find(c=>c.id==='q1'),project.components.find(c=>c.id==='q2')];
        const wire=(a,ap,b,bp)=>project.wires.some(w=>(
          (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
          (w.from?.c===b&&w.from?.p===bp&&w.to?.c===a&&w.to?.p===ap)));
        const get=x=>project.components.find(c=>c.id===x),g=get('g'),
          rc1=get('rc1'),rc2=get('rc2'),rb1=get('rb1'),rb2=get('rb2'),c1=get('c1'),c2=get('c2');
        const ok=!!(pair.length===2&&q1&&q2&&pair.includes(q1)&&pair.includes(q2)&&
          definition(byId,q1)?.kind==='bjt-npn'&&definition(byId,q2)?.kind==='bjt-npn'&&
          definition(byId,g)?.id==='arduino-bench-supply'&&Number(g?.dcVoltage)===5&&
          [rc1,rc2,rb1,rb2].every(x=>definition(byId,x)?.kind==='resistor'&&
            Number(x.resistance)>0)&&
          [c1,c2].every(x=>definition(byId,x)?.kind==='capacitor'&&Number(x.capacitance)>0)&&
          wire('g','P','rc1','1')&&wire('rc1','2','q1','C')&&
          wire('g','P','rc2','1')&&wire('rc2','2','q2','C')&&
          wire('q1','E','g','M')&&wire('q2','E','g','M')&&
          wire('g','P','rb1','1')&&wire('rb1','2','q1','B')&&
          wire('g','P','rb2','1')&&wire('rb2','2','q2','B')&&
          wire('q1','C','c1','1')&&wire('c1','2','q2','B')&&
          wire('q2','C','c2','1')&&wire('c2','2','q1','B'));
        const half1=ok?Math.LN2*Number(rb2.resistance)*Number(c1.capacitance)*1000:0,
          half2=ok?Math.LN2*Number(rb1.resistance)*Number(c2.capacitance)*1000:0,
          period=half1+half2,
          powered=!!(ok&&Number.isFinite(period)&&period>.01&&period<1e9&&Number.isFinite(now)&&now>=0);
        if(!powered||!Number.isFinite(q1?._mq07BjtAstableEpoch)||now<q1._mq07BjtAstableEpoch)
          if(q1)q1._mq07BjtAstableEpoch=powered?now:null;
        const phase=powered?(now-q1._mq07BjtAstableEpoch)%period:0;
        if(q1&&q2){
          q1._bjtOn=!!(powered&&phase<half1);
          q2._bjtOn=!!(powered&&phase>=half1);
          q1._mq07BjtAstablePowered=powered;q2._mq07BjtAstablePowered=powered;
          q1._mq07BjtAstableHz=powered?1000/period:0;
          q2._mq07BjtAstableHz=q1._mq07BjtAstableHz;
        }
      }
    }
for(const c of project.components){c._solveNow=now;const ed=definition(byId,c);if(ed?.incrementalEncoder38mm){const motor=IncrementalEncoder.motorCoupling?.(project,byId,c);if(motor){c._encoderMotorId=motor.id;c._encoderMotorRef=motor.ref||motor.label||motor.id}else{delete c._encoderMotorId;delete c._encoderMotorRef;IncrementalEncoder.state(c,ed,now,true)}}if(c.typeId===V20.id)c._v20Frame={now,base:c._v20?JSON.parse(JSON.stringify(c._v20)):null};if(c.typeId===ACS.id)c._acs800Frame={now,base:c._acs800?JSON.parse(JSON.stringify(c._acs800)):null};if(c.typeId===HCFA.id)c._hcfaFrame={now,base:c._hcfa?JSON.parse(JSON.stringify(c._hcfa)):null};}
    let actuators=new Map(),sensors=new Set();
    for(const c of project.components){const d=definition(byId,c);if(d&&['overload','thermal-magnetic'].includes(d.kind)&&c.state&&normalizeRef(c.ref))actuators.set('thermal:'+normalizeRef(c.ref),true)}
    if(!options.reset)for(const c of project.components){
      const d=definition(byId,c);
      if(d&&coils.has(d.kind)&&c._active&&normalizeRef(c.ref))actuators.set(normalizeRef(c.ref),true);
      // SC270 only: preserve the phase monitor's previously verified permission
      // during the first relay iteration so K1 seal-in is not lost on START release.
      // A missing/reversed phase is still re-evaluated every solve and removes permission.
      if(project?.tutorialLesson?.id==='motor-direct-power-src-16'&&
         d?.kind==='phase-monitor'&&c._active)actuators.set('@'+c.id,true);
    }
    const initialActuators=new Map(actuators),initialSensors=new Set(sensors);
    let net,firstNet,stable=false,cycle=null;
    const seen=new Map(),frames=[];
    for(let pass=0;pass<Math.max(16,project.components.length*4+8);pass++){
      const semikinds=['bjt-npn','bjt-pnp','mosfet-n','mosfet-p','jfet-n','igbt-n','scr','triac','diac'];
      const signature=JSON.stringify([[...actuators.keys()].sort(),[...sensors].sort(),project.components.filter(c=>semikinds.includes(definition(byId,c)?.kind)||definition(byId,c)?.isPLC).map(c=>definition(byId,c)?.isPLC?[c.id,c._plcRuntime?.inputs||{},c._plcRuntime?.outputs||{},!!c._plcLatch]:[c.id,!!c._bjtOn,!!c._mosfetOn,!!c._jfetOn,!!c._igbtOn,!!c._thyristorOn,!!c._diacOn])]);
      if(seen.has(signature)){cycle=frames.slice(seen.get(signature));break}
      seen.set(signature,frames.length);frames.push(new Map(actuators));
      const plcBefore=JSON.stringify(project.components.filter(c=>definition(byId,c)?.isPLC).map(c=>[c.id,c._plcRuntime?.inputs||{},c._plcRuntime?.outputs||{},!!c._plcLatch]));
      net=network(project,byId,actuators,sensors,false,now);
      const plcChanged=plcBefore!==JSON.stringify(project.components.filter(c=>definition(byId,c)?.isPLC).map(c=>[c.id,c._plcRuntime?.inputs||{},c._plcRuntime?.outputs||{},!!c._plcLatch]));
      if(!firstNet)firstNet=net;
      let bjtChanged=false,bjtNumeric=null;
      for(const tc of project.components){const td=definition(byId,tc);if(!['bjt-npn','bjt-pnp'].includes(td?.kind)||tc.mq07StandaloneBjtAstable===true||tc.mq07StandaloneBjtBistable===true||tc.mq07StandaloneBjtMonostable===true)continue;let vb=td.kind==='bjt-npn'?net.dcVoltage(tc,'B','E'):net.dcVoltage(tc,'E','B');if(vb===null){bjtNumeric ||= Numeric.update(project,byId,net,{now,sampleOnly:true});vb=td.kind==='bjt-npn'?bjtNumeric.dc(tc,'B','E'):-bjtNumeric.dc(tc,'B','E')}const on=vb!==null&&vb>=0.62;if(on!==!!tc._bjtOn){tc._bjtOn=on;bjtChanged=true}}
      let semiconductorChanged=false;
      for(const tc of project.components){const td=definition(byId,tc);if(!td)continue;let stateKey=null,on=false,v=null;
        if(td.kind==='mosfet-n'){stateKey='_mosfetOn';v=net.dcVoltage(tc,'G','S');if(tc.mq07FetRcDelay||tc.mq07MosfetHealth||tc.mq07NtcThermalSwitch||tc.mq07PtcThermalSwitch||tc.mq07LdrDarkSwitch){const sampled=Numeric.update(project,byId,net,{now,sampleOnly:true});v=sampled.dc(tc,'G','S');if(tc.mq07FetRcDelay)tc._mq07GateSampleV=v;if(tc.mq07MosfetHealth)tc._mq07HealthGateV=v;if(tc.mq07NtcThermalSwitch)tc._mq07NtcGateV=v;if(tc.mq07PtcThermalSwitch)tc._mq07PtcGateV=v;if(tc.mq07LdrDarkSwitch)tc._mq07LdrGateV=v}on=v!==null&&v>=4}
        else if(td.kind==='jfet-n'){stateKey='_jfetOn';v=net.dcVoltage(tc,'G','S');const cutoff=Math.abs(Number(td.gateCutoffVoltage)||3);on=v===null?false:v>-cutoff}
        else if(td.kind==='mosfet-p'){stateKey='_mosfetOn';v=net.dcVoltage(tc,'S','G');on=v!==null&&v>=4}
        else if(td.kind==='igbt-n'){stateKey='_igbtOn';v=net.dcVoltage(tc,'G','E');if(tc.mq07DcPwmDimmer){const sampled=Numeric.update(project,byId,net,{now,sampleOnly:true});v=sampled.dc(tc,'G','E');tc._sc12GateVoltage=v}on=v!==null&&Number.isFinite(v)&&v>=4}
        else if(td.kind==='scr'){stateKey='_thyristorOn';v=net.dcVoltage(tc,'G','K');if(tc.mq07ScrHoldLesson){const sampled=Numeric.update(project,byId,net,{now,sampleOnly:true});v=sampled.dc(tc,'G','K');tc._scrGateVoltage=v}on=(v!==null&&Number.isFinite(v)&&v>=.7)||(!!tc.mq07ScrHoldLesson&&!!tc._scrLatched)}
        else if(td.kind==='triac'){stateKey='_thyristorOn';v=net.dcVoltage(tc,'G','MT1');if(tc.mq07DcTriacLesson===true){const sampled=Numeric.update(project,byId,net,{now,sampleOnly:true});v=sampled.dc(tc,'G','MT1');tc._triacGateVoltage=v}on=(v!==null&&Number.isFinite(v)&&Math.abs(v)>=.7)||(tc.mq07DcTriacLesson===true&&!!tc._triacLatched)}
        else if(td.kind==='diac'){stateKey='_diacOn';v=net.dcVoltage(tc,'A1','A2');on=v!==null&&Math.abs(v)>=30}
        if(stateKey&&on!==!!tc[stateKey]){tc[stateKey]=on;semiconductorChanged=true}
      }
      const next=new Map(),nextSensors=new Set();
      for(const c of project.components){const d=definition(byId,c);if(!d)continue;
        if(d.id===ACS.id)for(let i=0;i<3;i++)if(c._acs800?.ro[i])next.set('@'+c.id+':acsro'+i,true);
        if(d.id===V20.id){if(c._v20?.do1)next.set('@'+c.id+':v20do1',true);if(c._v20?.do2)next.set('@'+c.id+':v20do2',true);}
        if(d.id===HCFA.id){}
        if(d.instrument==='et4420'){const s=Instruments.controller(c,d,project,byId,net,now);for(const k of ['main','alarm1','ssr'])if(s[k])next.set('@'+c.id+':'+k,true)}
        if(['overload','thermal-magnetic'].includes(d.kind)&&c.state&&normalizeRef(c.ref))next.set('thermal:'+normalizeRef(c.ref),true);
        if(d.doldSafety){const ds=DoldSafety.evaluate(c,d,net,now);if(ds.active)next.set('@'+c.id,true)}
        if(coils.has(d.kind)){let active=net.voltage(c,'A1','A2');if(['timer','coil-pulse','coil-flasher'].includes(d.kind)){const state=Devices.timed(c,d,active,now);timedStates.set(c.id,state);active=state.output}if(active&&normalizeRef(c.ref))next.set(normalizeRef(c.ref),true)}
        if(d.kind==='phase-monitor'){
          const seq=net.phaseDirection(c,['L1','L2','L3']),neutral=net.at(c,'N').some(p=>p.leg==='N'&&p.type==='ac'),values=['L1','L2','L3'].map(p=>net.at(c,p).find(v=>v.type==='ac'&&/^L[123]$/.test(v.leg))?.volts||0);
          const asymmetry=d.phaseProtection&&values.some(v=>v<230*.6||v>230*1.4);
          c._phaseFault=!neutral?'Nötr yok':!seq?'Faz eksik':seq<0?'Faz sırası ters':asymmetry?'Gerilim toleransı aşıldı':'';
          if(!c._phaseFault)next.set('@'+c.id,true);
        }
        if(d.kind==='ssr'&&net.at(c,'3+').some(a=>a.type==='dc'&&a.leg==='+'&&a.volts>=3&&a.volts<=32&&net.at(c,'4−').some(b=>b.domain===a.domain&&b.leg==='0')))next.set('@'+c.id,true);
        if(['sensor','detector'].includes(d.kind)&&(d.dualSensor||Components.contactStates(c,d,Sensors.actuated(c,d)).output)&&Devices.supply(c,d,net)==='ok')nextSensors.add(c.id);
        if(d.incrementalEncoder38mm&&IncrementalEncoder.supply(c,d,net)==='ok')nextSensors.add(c.id);
      }
      if(equalMap(next,actuators)&&equalSet(nextSensors,sensors)&&!bjtChanged&&!semiconductorChanged&&!plcChanged&&net.settled){stable=true;break}
      actuators=next;sensors=nextSensors;
    }
    const oscillating=!stable&&!!cycle&&firstNet.settled;
    const cyclingRefs=oscillating?[...new Set(cycle.flatMap(frame=>[...frame.keys()]))].filter(ref=>cycle.some(frame=>!!frame.get(ref)!==!!cycle[0].get(ref))):[];
    if(!stable&&!oscillating){clear(project);return {blocked:false,stable:false,oscillating:false,reason:'unstable'}}
    if(oscillating){
      // There is no static solution, e.g. a coil fed through its own NC contact.
      // Advance one relay response per timed frame, rather than stopping the
      // entire project or inventing a latched state. Unrelated branches still run.
      net=firstNet;actuators=initialActuators;sensors=initialSensors;
    }
    const hot=p=>p.leg!=='N'&&p.leg!=='0'&&p.leg!=='PE';
    for(const c of project.components){const d=definition(byId,c);if(!d)continue;
      const k=d.kind,ids=d.pins.map(p=>p.id),state=contactState(c,d,actuators);
      if(k.startsWith('delay-'))c._timing=Devices.timed(c,{...d,kind:'timer'},!!actuators.get(normalizeRef(c.ref)),now);
      c._actuated=state.actuated;c._closed=state.closed;c._contactStates=state.groups;c._powered=false;
      if(['sensor','detector'].includes(k)){
        if(d.dualSensor){for(const key of Object.keys(c._contactStates))c._contactStates[key]=c._contactStates[key]&&sensors.has(c.id);c._closed=c._contactStates.output}
        else{c._contactStates.output=sensors.has(c.id);c._closed=sensors.has(c.id)}
      }
      c._hot=d.pins.filter(p=>net.at(c,p.id).some(hot)).map(p=>p.id);
      c._fault=d.pins.some(p=>net.faultRoots.has(net.find(pinKey(c.id,p.id))));
      if(coils.has(k)){c._active=timedStates.has(c.id)?!!actuators.get(normalizeRef(c.ref)):net.voltage(c,'A1','A2');if(timedStates.has(c.id))c._timing=timedStates.get(c.id)}
      else if(['bjt-npn','bjt-pnp'].includes(k))c._active=!!c._bjtOn;
      else if(k==='mosfet-n'||k==='mosfet-p')c._active=!!c._mosfetOn;
      else if(k==='jfet-n')c._active=!!c._jfetOn;
      else if(k==='igbt-n')c._active=!!c._igbtOn;
      else if(k==='scr'||k==='triac')c._active=!!c._thyristorOn;
      else if(k==='diac')c._active=!!c._diacOn;
      else if(k==='opamp'||k==='dual-opamp')c._active=!!c._opampPowered;
      else if(d.digitalIc){c._active=c._powered=!!c._digitalIc?.powered;}
      else if(['ssr','phase-monitor'].includes(k))c._active=!!actuators.get('@'+c.id);
      else if(followers.has(k))c._active=state.actuated;
      else if(d.id==='load-cell'){const ex=net.dcVoltage(c,'EX+','EX−');c._active=net.enabled.has(c.id)&&!net.faultDomains.has('load:'+c.id);c._loadExcitation=c._active?ex:0;c._loadStatus=c._active?ex.toFixed(1)+' V uyartım':ex!==null&&Math.abs(ex)>15?'15 V sınırı aşıldı':net.faultDomains.has('load:'+c.id)?'Çıkış kısa devre':'Besleme yok / geçersiz';c._analogOutput=Devices.output(c,d)}
      else if(d.isPLC){c._active=!!c._plcRuntime?.powered;c._powered=c._active}
      else if(d.doldSafety){const ds=DoldSafety.evaluate(c,d,net,now);c._doldEval=ds;c._active=ds.active;c._powered=ds.powered}
      else if(d.incrementalEncoder38mm){const st=IncrementalEncoder.supply(c,d,net);c._sensorSupply=st;c._encoderSupply=st;c._encoderPowered=st==='ok';if(!c._encoderMotorId)IncrementalEncoder.state(c,d,now,false);c._active=c._encoderPowered}
      else if(converter(d))c._active=d.id===ACS.id?!!c._acs800?.running:d.id===HCFA.id?!!c._hcfa?.servoOn:d.id==='sinamics-v20-1p'?net.threePhase(c,['U','V','W']):net.enabled.has(c.id);
      else if(Devices.powered(d)){c._sensorSupply=Devices.supply(c,d,net);c._active=c._sensorSupply==='ok';if(Devices.analog(d))c._analogOutput=c._active?Devices.output(c,d):null}
      else if(['motor3','motor-yd'].includes(k)){
        const upper=k==='motor3'?['U','V','W']:['U1','V1','W1'],lower=['U2','V2','W2'];
        const roots=lower.map(p=>net.find(pinKey(c.id,p)));
        const star=new Set(roots).size===1&&!upper.some(p=>roots.includes(net.find(pinKey(c.id,p))));
        const delta=lower.every((p,i)=>net.find(pinKey(c.id,p))===net.find(pinKey(c.id,upper[(i+1)%3])));
        c._motorConnection=star?'star':delta?'delta':'incomplete';
        c._active=net.threePhase(c,upper)&&(star||delta);
      }
      else if(k==='motor-dahlender'){
        const upper=['U','V','W'],lower=['X','Y','Z'];
        const lowerOpen=lower.every(p=>net.at(c,p).length===0);
        const high=net.threePhase(c,lower)&&new Set(upper.map(p=>net.find(pinKey(c.id,p)))).size===1&&!net.at(c,'U').length;
        const low=net.threePhase(c,upper)&&lowerOpen;
        c._motorSpeed=high?'high':low?'low':'stopped';c._active=high||low;
      }
      else if(d.id===HCFA.motorId){const roots=['U','V','W'].map(p=>net.find(pinKey(c.id,p))),drive=project.components.find(x=>definition(byId,x)?.id===HCFA.id&&x._hcfa?.running&&['U','V','W'].every((p,i)=>net.find(pinKey(x.id,p))===roots[i]));c._active=!!drive;}
      else if(phaseMotors.has(k))c._active=net.threePhase(c,ids.slice(0,3));
      else if(d.id==='motor-1p')c._active=net.voltage(c,'U','N')&&net.voltage(c,'Z1','Z2')&&((net.find(pinKey(c.id,'U'))===net.find(pinKey(c.id,'Z1'))&&net.find(pinKey(c.id,'N'))===net.find(pinKey(c.id,'Z2')))||(net.find(pinKey(c.id,'U'))===net.find(pinKey(c.id,'Z2'))&&net.find(pinKey(c.id,'N'))===net.find(pinKey(c.id,'Z1'))));
      else if(k==='motor'||k==='motor-dc')c._active=net.voltage(c,ids[0],ids[1]);
      else if(loads.has(k))c._active=net.voltage(c,ids[0],ids[1]);
      else if(k==='multimeter'){
        c._active=Number(c.meterPosition)>0;c._ncv=false;
        const point=(a,def,p)=>{const r=(a.rotation||0)*Math.PI/180,sc=a.materialScale||1,dx=p.x-def.w/2,dy=p.y-def.h/2;return {x:(a.x||0)+(def.w/2+dx*Math.cos(r)-dy*Math.sin(r))*sc,y:(a.y||0)+(def.h/2+dx*Math.sin(r)+dy*Math.cos(r))*sc}};
        const head=point(c,d,{x:d.w/2,y:0});
        for(const other of project.components){const od=definition(byId,other);if(other===c||!od)continue;for(const p of (options.appearance==='material'?od.materialPins:null)||od.pins){if(net.at(other,p.id).some(v=>v.type==='ac'&&/^L/.test(v.leg)&&v.volts>=50)){const q=point(other,od,p);if(Math.hypot(q.x-head.x,q.y-head.y)<=30)c._ncv=true}}}
      }
      else c._active=d.instrument?!!c._instrument?.on:sources.has(k)?c._hot.length>0:false;
      if(k==='meter-v'){
        delete c._signalMv;
        if(project.components.some(p=>p.typeId==='load-cell')){const v=net.dcVoltage(c,ids[0],ids[1]);c._signalMv=v===null?0:v*1000;c._active=v!==null&&Math.abs(v)>1e-12}
      }
      c._lampActive=!!d.lampPins&&net.voltage(c,...d.lampPins);
      c._powered=!!c._active;if(k==='flasher'){c._timing=Devices.timed(c,d,c._powered,now);c._active=c._timing.output}
      c._spin=0;delete c._motorHz;delete c._motorRPM;delete c._motorDrive;
      if(c._active&&k!=='pwm-generator'&&(/motor|fan|generator/.test(k)||d.rotating)){
        const polarity=phaseMotors.has(k)?net.phaseDirection(c,k==='motor-dahlender'&&c._motorSpeed==='high'?['X','Y','Z']:ids.slice(0,3)):d.id==='motor-1p'?(net.find(pinKey(c.id,'U'))===net.find(pinKey(c.id,'Z1'))?1:-1):k==='motor-dc'?net.dcDirection(c,ids[0],ids[1]):1;
        c._spin=polarity*(c.direction==='ccw'?-1:1);
        const source=net.at(c,ids[0]).find(v=>v.domain.startsWith('out:')),physicalHCFA=d.id===HCFA.motorId?project.components.find(x=>definition(byId,x)?.id===HCFA.id&&['U','V','W'].every((p,i)=>net.find(pinKey(x.id,p))===net.find(pinKey(c.id,p)))):null,drive=source&&project.components.find(x=>'out:'+x.id===source.domain&&isDrive(definition(byId,x)))||physicalHCFA;
        if(drive){c._motorDrive=drive.id;const ds=driveState(drive)||{},signedRpm=Number(ds.rpm||0);c._motorHz=Math.abs(Number(ds.hz||0));c._motorRPM=Math.abs(signedRpm);if(signedRpm<0)c._spin=-Math.abs(c._spin||1);else if(signedRpm>0)c._spin=Math.abs(c._spin||1)}else if(project.projectId==='tutorial-session-source-electronic-switching-src-11'||project.tutorialLesson?.id==='electronic-switching-src-11'){delete c._motorRPM;}else c._motorRPM=Math.abs(Number(c.motorRatedRpm??d.motorSpec?.ratedRpm??d.ratedRpm??1500));c._motorAngle=((c._motorAngle||0)+Number(c._motorRPM||0)*.12*(options.now?1:.3)*Math.sign(c._spin||1))%360;
      }
    }
    for(const c of project.components){const d=definition(byId,c);if(!d?.incrementalEncoder38mm)continue;const motor=IncrementalEncoder.motorCoupling?.(project,byId,c);if(motor)IncrementalEncoder.syncMotor(c,d,project,byId,now,true);else{delete c._encoderMotorId;delete c._encoderMotorRef;}}
    let numericState=null;
    if(project.components.some(c=>['current-transformer','meter-a','meter-v','multimeter','clamp-meter','resistor','capacitor','reactor','opamp','dual-opamp','crystal','speaker','ldr'].includes(definition(byId,c)?.kind)||definition(byId,c)?.digitalIc==='dac0808'||definition(byId,c)?.id==='winding'||definition(byId,c)?.instrument||isDrive(definition(byId,c)))){
      const numeric=typeof module==='object'&&module.exports?require('./current-model.js'):root.DTSCurrentModel;
      numericState=numeric.update(project,byId,network(project,byId,actuators,sensors,true,now),{now});
    }
    // MQ-07 SC13: latch the educational DC SCR only after the native nodal
    // solution confirms actual anode load current above its holding threshold.
    // A gate command alone is not a latched conducting DC load.
    for(const c of project.components.filter(c=>c.mq07ScrHoldLesson===true&&definition(byId,c)?.kind==='scr')){
      const load=project.components.find(x=>x.id==='h1'&&definition(byId,x)?.kind==='lamp');
      const current=Math.abs(Number(load?._currentValue)||0);
      const threshold=Math.max(.001,Number(definition(byId,c)?.holdingCurrent)||.03);
      const sustained=!!(stable&&!oscillating&&load?._active&&current>=threshold&&c._thyristorOn);
      c._scrHoldingCurrentA=current;c._scrLatched=sustained;
      // A previously latched SCR loses conduction when load current collapses.
      if(!sustained&&(!Number.isFinite(c._scrGateVoltage)||c._scrGateVoltage<.7)){
        c._thyristorOn=false;c._active=false;
      }
    }
    // SC16 software-only DC TRIAC latch: MT2 load current holds after gate release.
    // No mains operation, AC commutation, or manufacturer-specific physics implied.
    for(const c of project.components.filter(c=>c.mq07DcTriacLesson===true&&definition(byId,c)?.kind==='triac')){
      const load=project.components.find(x=>x.id==='h1'&&definition(byId,x)?.kind==='lamp');
      const current=Math.abs(Number(load?._currentValue)||0);
      const threshold=typeof c.mq07VirtualHoldingCurrentA==='number'&&
        Number.isFinite(c.mq07VirtualHoldingCurrentA)?Math.max(.001,c.mq07VirtualHoldingCurrentA):.03;
      const sustained=!!(stable&&!oscillating&&load?._active&&current>=threshold&&c._thyristorOn);
      c._triacHoldingCurrentA=current;c._triacLatched=sustained;
      if(!sustained&&(!Number.isFinite(c._triacGateVoltage)||Math.abs(c._triacGateVoltage)<.7)){
        c._thyristorOn=false;c._active=false;
      }
    }
    for(const c of project.components){const d=definition(byId,c),current=Math.abs(Number(c._currentValue)||0);if(d?.kind==='resistor'&&current>1e-6)c._active=c._powered=true;if(d?.kind==='led'){c._active=c._lampActive=c._powered=current>1e-6;if(c._active&&!c._hot.includes('A'))c._hot.push('A')}
      if(d?.kind==='mosfet-n'&&c.virtualLdrDimmer){c._active=c._powered=current>1e-6}
      if(d?.kind==='lamp'&&c.virtualLdrLamp){
       const rated=Math.max(1,Number(c.lampRatedVoltage)||12),r=Math.max(1,Number(c.resistance)||120),
       p=current*Math.max(0,Number(c._voltageValue)||0);
       c._dimmerBrightnessPct=Math.max(0,Math.min(100,100*p/(rated*rated/r)));
       c._dimmerPowerW=p;c._dimmerCurrentA=current;
       c._active=c._lampActive=c._powered=c._dimmerBrightnessPct>0.1;
      }
    }
    for(const w of project.wires){if(w.mechanical||w.role==='MECHANICAL'){w._fault=false;w._active=false;continue}const r=net.find(endpointKey(w.from)),atPotential=[...(net.potentials.get(r)?.values()||[])].some(p=>!net.faultDomains.has(p.domain)&&hot(p)),atSolvedVoltage=endpoint=>{if(!numericState||!endpoint?.c)return false;const c=project.components.find(x=>x.id===endpoint.c);if(!c)return false;const v=numericState.voltages.get(numericState.pin(c,endpoint.p));return !!v&&Math.hypot(v[0],v[1])>.25};w._fault=net.faultRoots.has(r);w._active=atPotential||atSolvedVoltage(w.from)||atSolvedVoltage(w.to);}

    // SC391: scoped educational verification of the EXISTING standalone
    // NE555 astable engine. Preserve its native period/phase decisions.
    // Requiring all physical DIP8, RC, CTRL, LED and GND links prevents
    // a broken guided exercise from advertising a verified timing diagram.
    if(project?.tutorialLesson?.id==='electronic-component-basics-outline-041'){
     const get=id=>project.components.find(c=>c.id===id),
      u=get('u1'),g=get('g1'),led=get('h1'),
      ra=get('ra'),rb=get('rb'),rl=get('rl'),ct=get('c1'),cc=get('cc'),
      norm=s=>s.split('>').sort().join('~'),
      expected=["g1.P>u1.VCC","g1.M>u1.GND","u1.OUT>rl.1","rl.2>h1.A","h1.K>g1.M","u1.CTRL>cc.1","cc.2>g1.M","g1.P>u1.RESET","g1.P>ra.1","ra.2>u1.DISCH","u1.DISCH>rb.1","rb.2>u1.THRES","rb.2>u1.TRIG","rb.2>c1.+","c1.->g1.M"].map(norm).sort(),
      actual=project.wires.map(w=>[w.from.c+'.'+w.from.p,
       w.to.c+'.'+w.to.p].sort().join('~')).sort();
     if(u)delete u._nativePulse041;
     if(led)delete led._nativePulse041;
     const exact=project.components.length===8&&project.wires.length===15&&
      actual.length===expected.length&&actual.every((x,i)=>x===expected[i])&&
      g?.typeId==='arduino-bench-supply'&&Number(g.dcVoltage)===5&&
      u?.typeId==='arduino-ne555'&&u.ne555Mode==='astable'&&
      u.mq07Standalone555Astable===true&&
      Number(u.ne555RaK)===1&&Number(u.ne555RbK)===10&&
      Number(u.ne555Cuf)===100&&led?.typeId==='arduino-led'&&
      ra?.typeId==='resistor'&&Number(ra.resistance)===1000&&
      rb?.typeId==='resistor'&&Number(rb.resistance)===10000&&
      rl?.typeId==='resistor'&&Number(rl.resistance)===330&&
      ct?.typeId==='arduino-capacitor-100u'&&
      Math.abs(Number(ct.capacitance)-1e-4)<1e-12&&
      cc?.typeId==='capacitor'&&
      Math.abs(Number(cc.capacitance)-1e-8)<1e-15;
     if(exact&&u._mq07Ne555StandalonePowered===true&&
      Number.isFinite(u._ne555HighMs)&&u._ne555HighMs>0&&
      Number.isFinite(u._ne555LowMs)&&u._ne555LowMs>0&&
      Number.isFinite(u._ne555Frequency)&&u._ne555Frequency>0&&
      u._ne555Discharge===!u._ne555Out&&led._active===u._ne555Out){
       const highMs=u._ne555HighMs,lowMs=u._ne555LowMs,
        periodMs=highMs+lowMs,charge=Math.LN2*(Number(ra.resistance)+
         Number(rb.resistance))*Number(ct.capacitance)*1000,
        discharge=Math.LN2*Number(rb.resistance)*Number(ct.capacitance)*1000;
       if(Math.abs(highMs-charge)<.001&&
        Math.abs(lowMs-discharge)<.001&&
        Math.abs(u._ne555Frequency-1000/periodMs)<1e-8){
        const info={model:'native-wired-ideal-NE555P-astable-LED-041',
         periodMs,highMs,lowMs,frequencyHz:u._ne555Frequency,
         dutyPercent:100*highMs/periodMs,
         outHigh:u._ne555Out,dischargeActive:u._ne555Discharge,
         ledOn:led._active,
         sourceTerminalNames:['GND=1','TRIG=2','OUT=3','RESET=4',
          'CTRL=5','THRES=6','DISCH=7','VCC=8'],
         sourceGraphAndIdealTimerVerified:true,
         analogCapVoltageVerified:false,
         actualManufacturerTimingVerified:false,
         physicalAcceptance:false,
         waveformAcceptance:false,
         windowsVisualAcceptance:false};
        u._nativePulse041=info;led._nativePulse041={...info};
       }
      }
    }

    SignedFlow.apply(project,byId,net,{numericState,pairs:(c,d)=>conductingPairs(c,d,actuators,sensors)});
    return {blocked:false,stable,oscillating,cyclingRefs,timed:project.components.some(c=>(definition(byId,c)?.kind==='pwm-generator'&&c._pwmSupplyValid&&c.dutyPercent>0&&c.dutyPercent<100)||(c.mq07Standalone555Astable===true&&c._mq07Ne555StandalonePowered)||(c.mq07Standalone555Pwm===true&&c._mq07Ne555PwmPowered)||(c.mq07StandaloneBjtAstable===true&&c._mq07BjtAstablePowered)||(c.mq07StandaloneBjtMonostable===true&&c._mq07BjtMonostablePowered&&c._mq07BjtMonostableRemainingMs>0)||isDrive(definition(byId,c))||definition(byId,c)?.instrument==='et4420'||definition(byId,c)?.doldSafety||c._plcTimerStart!==undefined||['timer','coil-pulse','coil-flasher','flasher','capacitor','reactor'].includes(definition(byId,c)?.kind)||definition(byId,c)?.id==='winding'||definition(byId,c)?.kind.startsWith('delay-')||DigitalIC?.timed?.(c,definition(byId,c))||(definition(byId,c)?.incrementalEncoder38mm&&c._encoderPowered&&Math.abs(Number(c.encoderRPM)||0)>0)),damaged:project.components.filter(c=>c._sensorSupply==='reversed').map(c=>c.id),shortCircuit:net.faultDomains.size>0};
  }
  // SC11 samples electrical ON/OFF phases through the original nodal solver.
  // Speed is an explicitly *uncalibrated normalized educational response*, never RPM.
  function solveSc11Cycle(project,byId,options={}){
    const scene=['electronic-switching-src-11','motor-direct-power-outline-021'].includes(project?.tutorialLesson?.id)||
      ['tutorial-session-source-electronic-switching-src-11','tutorial-session-source-motor-direct-power-outline-021'].includes(project?.projectId);
    if(!scene)return {result:solve(project,byId,options),sampled:false};
    const now=Number.isFinite(options.now)?options.now:Date.now();
    const component=id=>project.components.find(c=>c.id===id);
    const pwm=component('pwm1'),motor=component('m1'),q=component('q1'),meter=component('vg');
    const duty=pwm?.dutyPercent,hz=pwm?.frequencyHz;
    const valid=typeof duty==='number'&&Number.isFinite(duty)&&duty>=0&&duty<=100&&
      typeof hz==='number'&&Number.isFinite(hz)&&hz>0&&Number.isFinite(now)&&now>=0;
    const phase=valid?1000/hz:0;
    const capture=at=>{
      const result=solve(project,byId,{...options,now:at});
      return {valid:!!(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating),
        supply:!!pwm?._pwmSupplyValid,high:!!pwm?._pwmHigh,
        mosfet:!!q?._mosfetOn,motor:!!motor?._active,
        vgs:meter?._meter?.mode==='DCV'&&!meter?._meter?.warning&&
          Number.isFinite(meter?._meter?.value)?meter._meter.value:null};
    };
    const high=valid?capture(phase*duty/200):null;
    const low=valid?capture(phase*(duty/100+(1-duty/100)/2)):null;
    // Restore original real-time state after deliberate sub-period observations.
    const result=solve(project,byId,options);
    const proven=!!(valid&&high?.valid&&low?.valid&&high.supply&&low.supply);
    const highDrive=proven&&high.high&&high.mosfet&&high.motor;
    const lowDrive=proven&&low.high&&low.mosfet&&low.motor;
    const target=proven?(highDrive?duty:0)+(lowDrive?100-duty:0):0;
    if(motor){
      const last=Number(motor._sc11ResponseNow),previous=Math.max(0,Math.min(100,Number(motor._sc11SpeedPercent)||0));
      // First-order visual response: 350 ms education-only inertia, no RPM claim.
      const dt=Number.isFinite(last)&&now>=last?Math.min(.2,(now-last)/1000):.05;
      const speed=previous+(target-previous)*(1-Math.exp(-dt/.35));
      motor._sc11SpeedPercent=Math.max(0,Math.min(100,speed));
      motor._sc11DriveTargetPercent=target;
      motor._sc11ResponseNow=now;
      // Rotate the educational shaft from normalized inertia, not alias-prone instant ON/OFF.
      motor._spin=speed>0.5?(motor.direction==='ccw'?-1:1):0;
      motor._motorAngle=((Number(motor._motorAngle)||0)+360*dt*(speed/100))%360;
      delete motor._motorRPM;
    }
    // DCV reading is phase-weighted from two actually measured VGS samples.
    // Never substitute PWM command average if probes, mode or source are invalid.
    const red=component('vgr'),black=component('vgb');
    const wired=(a,ap,b,bp)=>project.wires.some(w=>
      (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
      (w.to?.c===a&&w.to?.p===ap&&w.from?.c===b&&w.from?.p===bp));
    const probes=red?.probeTarget?.c==='q1'&&red.probeTarget.p==='G'&&
      black?.probeTarget?.c==='q1'&&black.probeTarget.p==='S'&&
      wired('vg','V','vgr','PLUG')&&wired('vg','COM','vgb','PLUG');
    let vgsMean=null;
    if(proven&&probes&&!meter.meterHold&&Number.isFinite(high.vgs)&&Number.isFinite(low.vgs)&&
        meter?._meter?.mode==='DCV'&&!meter._meter.warning){
      vgsMean=high.vgs*duty/100+low.vgs*(100-duty)/100;
      if(!meter.meterHold){
        const range=meter._meter.range,display=Multimeter.format(vgsMean,'DCV',range,meter.meterContinuity);
        meter._meter={...meter._meter,value:vgsMean,display:display.display,unit:display.unit};
      }
    }
    if(motor)motor._sc11VgsMean=vgsMean;
    return {result,sampled:!!valid,valid:proven,dutyPercent:duty,
      highDrive:!!highDrive,lowDrive:!!lowDrive,driveTargetPercent:target,
      vgsDcAverage:vgsMean,physicalRpm:null};
  }


  // SC12: phase sample the real IGBT gate and DC load path.
  // The output is a normalized education-only duty response (NOT lumens or watts).
  function solveSc12DimmerCycle(project,byId,options={}){
    const scene=['electronic-switching-src-12','electronic-switching-outline-036'].includes(project?.tutorialLesson?.id)||
      ['tutorial-session-source-electronic-switching-src-12',
       'tutorial-session-source-electronic-switching-outline-036'].includes(project?.projectId);
    if(!scene)return {result:solve(project,byId,options),sampled:false};
    const part=id=>project.components.find(c=>c.id===id);
    const pwm=part('pwm1'),igbt=part('q1'),lamp=part('h1');
    const duty=pwm?.dutyPercent,hz=pwm?.frequencyHz,now=Number.isFinite(options.now)?options.now:Date.now();
    const valid=typeof duty==='number'&&Number.isFinite(duty)&&duty>=0&&duty<=100&&
      typeof hz==='number'&&Number.isFinite(hz)&&hz>0&&Number.isFinite(now)&&now>=0;
    const period=valid?1000/hz:0;
    const sample=at=>{
      const r=solve(project,byId,{...options,now:at});
      return {valid:!!(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating),
        supply:!!pwm?._pwmSupplyValid,high:!!pwm?._pwmHigh,
        switchOn:!!igbt?._igbtOn,loadOn:!!lamp?._active};
    };
    const high=valid?sample(period*duty/200):null;
    const low=valid?sample(period*(duty/100+(1-duty/100)/2)):null;
    const result=solve(project,byId,options);
    const verified=!!(valid&&high?.valid&&low?.valid&&high.supply&&low.supply&&pwm&&igbt&&lamp);
    const highDrive=!!(verified&&high.high&&high.switchOn&&high.loadOn);
    const lowDrive=!!(verified&&low.high&&low.switchOn&&low.loadOn);
    const dutyDrive=verified?(highDrive?duty:0)+(lowDrive?100-duty:0):0;
    if(lamp){
      lamp._sc12BrightnessPct=Math.max(0,Math.min(100,dutyDrive));
      lamp._sc12DimmerVerified=verified;
    }
    return {result,sampled:!!valid,verified,highDrive,lowDrive,normalizedBrightnessPct:dutyDrive};
  }


  // MQ-05 SC15: isolated low-voltage AC, positive-half-wave SCR phase-angle training.
  // The canonical AC solver uses phasors, so SC15 samples the instantaneous
  // waveform using an actual terminal-connected resistive load and SCR threshold.
  // This is an opt-in virtual model, not 230 V mains or a manufacturer SPICE model.
  function solveSc15AcCycle(project,byId,options={}){
    const scene=['electronic-switching-src-15','electronic-switching-outline-046'].includes(project?.tutorialLesson?.id)||
      ['tutorial-electronic-switching-src-15','tutorial-session-source-electronic-switching-src-15',
       'tutorial-session-source-electronic-switching-outline-046'].includes(project?.projectId);
    if(!scene)return {result:solve(project,byId,options),sampled:false};
    const result=solve(project,byId,options);
    const part=id=>project.components.find(c=>c.id===id),source=part('ac1'),trigger=part('trg1'),scr=part('q1'),lamp=part('h1'),rg=part('rg');
    const good=!!(source&&trigger&&scr&&lamp&&rg&&byId[source.typeId]?.kind==='ac-virtual-source'&&
      byId[trigger.typeId]?.kind==='ac-scr-trigger'&&byId[scr.typeId]?.kind==='scr'&&byId[lamp.typeId]?.kind==='lamp'&&byId[rg.typeId]?.kind==='resistor');
    const pairs=new Map(),endpoint=x=>x?.j!==undefined?'j:'+x.j:x?.c&&x?.p?x.c+'/'+x.p:null;
    const find=x=>{if(!pairs.has(x))pairs.set(x,x);let k=x;while(pairs.get(k)!==k)k=pairs.get(k);
      while(pairs.get(x)!==x){const y=pairs.get(x);pairs.set(x,k);x=y}return k};
    for(const w of project.wires||[]){if(w.mechanical||w.role==='MECHANICAL')continue;
      const a=endpoint(w.from),b=endpoint(w.to);if(a&&b)pairs.set(find(a),find(b));}
    const linked=(a,p,b,q)=>find(a+'/'+p)===find(b+'/'+q);
    const wiring=good&&linked('ac1','AC','h1','X1')&&linked('h1','X2','q1','A')&&
      linked('q1','K','ac1','RET')&&linked('ac1','AC','trg1','AC')&&
      linked('ac1','RET','trg1','RET')&&linked('trg1','OUT','rg','1')&&linked('rg','2','q1','G')&&
      !linked('ac1','AC','ac1','RET')&&!linked('q1','A','q1','K');
    const rms=source?.rmsVoltage??byId[source?.typeId]?.defaultRmsVoltage;
    const hz=source?.frequencyHz??byId[source?.typeId]?.defaultFrequencyHz;
    const alpha=trigger?.triggerAngleDeg??byId[trigger?.typeId]?.defaultTriggerAngleDeg;
    const pulse=trigger?.pulseWidthDeg??byId[trigger?.typeId]?.defaultPulseWidthDeg;
    const resistance=lamp?.resistance,rgOhms=rg?.resistance;
    const now=Number.isFinite(options.now)?options.now:Date.now();
    const valid=!!(wiring&&result.stable&&!result.shortCircuit&&!result.blocked&&!result.oscillating&&
      source.sourceEnabled!==false&&trigger.triggerEnabled!==false&&Number.isFinite(now)&&now>=0&&
      typeof rms==='number'&&rms>=1&&rms<=24&&Number.isFinite(rms)&&
      typeof hz==='number'&&hz>=45&&hz<=60&&Number.isFinite(hz)&&
      typeof alpha==='number'&&alpha>=0&&alpha<=170&&Number.isFinite(alpha)&&
      typeof pulse==='number'&&pulse>=1&&pulse<=45&&Number.isFinite(pulse)&&
      typeof resistance==='number'&&resistance>=10&&resistance<=10000&&Number.isFinite(resistance)&&
      typeof rgOhms==='number'&&rgOhms>=100&&rgOhms<=100000&&Number.isFinite(rgOhms));
    const peak=valid?rms*Math.SQRT2:0,drop=1,holding=Math.max(.001,Number(byId[scr?.typeId]?.holdingCurrent)||.03);
    const cutoff=valid?Math.asin(Math.min(1,(holding*resistance+drop)/peak))*180/Math.PI:180;
    const fire=valid&&cutoff<=alpha+pulse?Math.max(alpha,cutoff):180;
    const end=180-cutoff,conduct=valid&&fire<end;
    const cycleAt=time=>{
      const deg=((time*hz*.36)%360+360)%360,voltage=peak*Math.sin(deg*Math.PI/180);
      const conducting=conduct&&deg>=fire&&deg<end;
      const gate=valid&&deg>=alpha&&deg<Math.min(180,alpha+pulse);
      return {deg,voltage,loadV:conducting?Math.max(0,voltage-drop):0,currentA:conducting?Math.max(0,(voltage-drop)/resistance):0,gateV:gate?5:0,conducting};
    };
    let squares=0,conducted=0;
    const wave=[];
    for(let deg=0;deg<360;deg+=2){
      const voltage=peak*Math.sin(deg*Math.PI/180),on=conduct&&deg>=fire&&deg<end;
      const loadV=on?Math.max(0,voltage-drop):0;
      squares+=loadV*loadV; if(on)conducted++;
      if(deg%10===0)wave.push({deg,sourceV:voltage,gateV:valid&&deg>=alpha&&deg<alpha+pulse?5:0,loadV});
    }
    const t=cycleAt(now),outputRmsV=Math.sqrt(squares/180);
    if(source){source._sc15InstantSourceV=t.voltage;source._sc15PhaseDeg=t.deg;source._sc15Wave=wave}
    if(trigger){trigger._sc15GateOutputV=t.gateV;trigger._sc15PhaseDeg=t.deg;trigger._sc15FiringAngleDeg=conduct?fire:null;trigger._sc15Wave=wave;trigger._active=!!(valid&&t.gateV>0)}
    if(scr){scr._thyristorOn=!!t.conducting;scr._active=!!t.conducting;scr._sc15Conducting=!!t.conducting;scr._sc15CurrentA=t.currentA;scr._sc15FiringAngleDeg=conduct?fire:null}
    if(lamp){lamp._active=!!t.conducting;lamp._powered=!!t.conducting;lamp._sc15InstantLoadV=t.loadV;lamp._sc15CurrentA=t.currentA;lamp._sc15OutputRmsV=outputRmsV;lamp._sc15ConductionPct=conducted/180*100;lamp._sc15Wave=wave}
    return {result:{...result,timed:!!valid},sampled:!!valid,verified:!!valid,
      rmsV:valid?outputRmsV:0,phaseDeg:t.deg,sourceV:t.voltage,gateV:t.gateV,
      loadV:t.loadV,currentA:t.currentA,positiveHalf:t.deg<180,
      fired:!!t.conducting,fireDeg:conduct?fire:null,
      conductionPct:valid?conducted/180*100:0,zeroCrossing:Math.min(t.deg%180,180-t.deg%180)<.3};
  }


  // SC16 only. Explicitly model a virtual low-voltage DC TRIAC in series with
  // the actual wired load. No physical BTA16 calibration or AC behavior claimed.
  function solveSc16DcCycle(project,byId,options={}){
    const scene=['electronic-switching-src-16','electronic-switching-outline-054'].includes(project?.tutorialLesson?.id)||
      ['tutorial-electronic-switching-src-16','tutorial-session-source-electronic-switching-src-16',
       'tutorial-session-source-electronic-switching-outline-054'].includes(project?.projectId);
    if(!scene)return {result:solve(project,byId,options),verified:false};
    const part=id=>project.components.find(c=>c.id===id);
    const source=part('g1'),gate=part('sg'),resistor=part('rg'),stop=part('sp'),triac=part('q1'),load=part('h1');
    const priorLatch=!!triac?._triacLatched;
    const result=solve(project,byId,options);
    const correct=source?.typeId==='arduino-bench-supply'&&gate?.typeId==='push-no'&&
      stop?.typeId==='push-nc'&&resistor?.typeId==='resistor'&&
      triac?.typeId==='bta16-600b-triac'&&triac.mq07DcTriacLesson===true&&
      load?.typeId==='standard-light';
    const parent=new Map();
    const key=x=>x?.j!==undefined?'junction:'+x.j:x?.c&&x?.p?x.c+'/'+x.p:null;
    const find=x=>{if(!parent.has(x))parent.set(x,x);let root=x;
      while(parent.get(root)!==root)root=parent.get(root);
      while(parent.get(x)!==x){const next=parent.get(x);parent.set(x,root);x=next}
      return root;};
    for(const w of project.wires||[]){
      if(w.mechanical||w.role==='MECHANICAL')continue;
      const a=key(w.from),b=key(w.to);
      if(a&&b)parent.set(find(a),find(b));
    }
    const linked=(a,ap,b,bp)=>find(a+'/'+ap)===find(b+'/'+bp);
    const powerWired=!!(correct&&linked('q1','MT1','g1','M')&&
      linked('g1','P','sp','21')&&linked('sp','22','h1','X1')&&
      linked('h1','X2','q1','MT2')&&!linked('g1','P','g1','M')&&
      !linked('q1','MT1','q1','MT2'));
    const gateWired=!!(correct&&linked('g1','P','sg','13')&&
      linked('sg','14','rg','1')&&linked('rg','2','q1','G'));
    const voltage=source?.dcVoltage,resistance=load?.resistance,gateOhms=resistor?.resistance,
      holding=triac?.mq07VirtualHoldingCurrentA;
    const powerValid=!!(powerWired&&result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating&&
      typeof voltage==='number'&&Number.isFinite(voltage)&&voltage>=1&&voltage<=24&&
      typeof resistance==='number'&&Number.isFinite(resistance)&&resistance>=10&&resistance<=10000&&
      typeof gateOhms==='number'&&Number.isFinite(gateOhms)&&gateOhms>=100&&gateOhms<=100000&&
      typeof holding==='number'&&Number.isFinite(holding)&&holding>=.001&&holding<=.5);
    const verified=!!(powerValid&&gateWired);
    const mainPath=powerValid&&stop.state!==true;
    const availableI=mainPath?voltage/resistance:0;
    const gatePulse=verified&&gate.state===true;
    const currentEnough=availableI>=holding;
    const latched=!!(mainPath&&currentEnough&&(gatePulse||priorLatch));
    const current=latched?availableI:0;
    if(triac){
      triac._triacGateVoltage=gatePulse?voltage:0;
      triac._triacHoldingCurrentA=current;
      triac._triacLatched=latched;
      triac._thyristorOn=latched;
      triac._active=latched;
      triac._powered=latched;
      triac._currentValue=current;
      triac._sc16DcValid=verified;
      triac._sc16PowerPath=!!mainPath;
    }
    if(load){
      load._active=latched;load._lampActive=latched;load._powered=latched;
      load._currentValue=current;load._voltageValue=latched?voltage:0;
      load._sc16CurrentA=current;
    }
    return {result:{...result,timed:false},verified,gateWired,powerValid,gatePulse,mainPath,latched,
      currentA:current,gateV:gatePulse?voltage:0,voltageV:latched?voltage:0,
      virtualHoldingCurrentA:verified?holding:null};
  }


  // SC17 opt-in: bipolar AC TRIAC with two *independent* half-cycle firings.
  // Educational low-voltage virtual source; not a product SPICE or mains model.
  function solveSc17TriacDimmerCycle(project,byId,options={}){
    const scene=['electronic-switching-src-17','electronic-switching-outline-047','electronic-switching-outline-050','electronic-switching-outline-051',
      'electronic-switching-outline-055'].includes(project?.tutorialLesson?.id)||
      ['tutorial-electronic-switching-src-17','tutorial-session-source-electronic-switching-src-17',
       'tutorial-session-source-electronic-switching-outline-047',
       'tutorial-session-source-electronic-switching-outline-050',
       'tutorial-session-source-electronic-switching-outline-051',
       'tutorial-session-source-electronic-switching-outline-055'].includes(project?.projectId);
    if(!scene)return {result:solve(project,byId,options),verified:false};
    const result=solve(project,byId,options),part=id=>project.components.find(c=>c.id===id);
    const src=part('ac1'),driver=part('trg1'),triac=part('q1'),lamp=part('h1'),rg=part('rg');
    const defsGood=src?.typeId==='virtual-isolated-ac-12v'&&
      driver?.typeId==='virtual-ac-triac-trigger-v1'&&triac?.typeId==='bta16-600b-triac'&&
      rg?.typeId==='resistor'&&lamp?.typeId==='standard-light'&&
      byId[triac?.typeId]?.kind==='triac'&&
      byId[triac?.typeId]?.pins?.map(p=>p.id).join(',')==='MT1,MT2,G';
    // Preserve junction wire unions. Never infer a connection from proximity.
    const parents=new Map();
    const key=x=>x?.j!==undefined?'j:'+x.j:x?.c&&x?.p?x.c+'/'+x.p:null;
    const find=x=>{if(!parents.has(x))parents.set(x,x);let r=x;
      while(parents.get(r)!==r)r=parents.get(r);
      while(parents.get(x)!==x){const q=parents.get(x);parents.set(x,r);x=q}return r;};
    for(const w of project.wires||[]){
      if(w.mechanical||w.role==='MECHANICAL')continue;
      const a=key(w.from),b=key(w.to);if(a&&b)parents.set(find(a),find(b));
    }
    const linked=(a,pa,b,pb)=>find(a+'/'+pa)===find(b+'/'+pb);
    const wired=!!(defsGood&&
      linked('ac1','AC','h1','X1')&&linked('h1','X2','q1','MT2')&&
      linked('q1','MT1','ac1','RET')&&
      linked('ac1','AC','trg1','AC')&&linked('ac1','RET','trg1','RET')&&
      linked('trg1','OUT','rg','1')&&linked('rg','2','q1','G')&&
      !linked('ac1','AC','ac1','RET')&&
      !linked('q1','MT2','q1','MT1')&&
      !linked('trg1','OUT','ac1','AC')&&!linked('trg1','OUT','ac1','RET'));
    const rms=src?.rmsVoltage,hz=src?.frequencyHz,angle=driver?.triggerAngleDeg,
      width=driver?.pulseWidthDeg,resistance=lamp?.resistance,gateR=rg?.resistance,
      holding=triac?.mq07VirtualHoldingCurrentA,now=Number.isFinite(options.now)?options.now:Date.now();
    const valid=!!(wired&&result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating&&
      src.sourceEnabled!==false&&driver.triggerEnabled!==false&&
      Number.isFinite(now)&&now>=0&&
      typeof rms==='number'&&Number.isFinite(rms)&&rms>=1&&rms<=24&&
      typeof hz==='number'&&Number.isFinite(hz)&&hz>=45&&hz<=60&&
      typeof angle==='number'&&Number.isFinite(angle)&&angle>=0&&angle<=170&&
      typeof width==='number'&&Number.isFinite(width)&&width>=1&&width<=45&&
      typeof resistance==='number'&&Number.isFinite(resistance)&&resistance>=10&&resistance<=10000&&
      typeof gateR==='number'&&Number.isFinite(gateR)&&gateR>=100&&gateR<=100000&&
      typeof holding==='number'&&Number.isFinite(holding)&&holding>=.001&&holding<=.5);
    const peak=valid?rms*Math.SQRT2:0,virtualDrop=1;
    // Resistive load; only above a teaching-model holding-current threshold.
    const cutoff=valid?Math.asin(Math.min(1,(holding*resistance+virtualDrop)/peak))*180/Math.PI:180;
    const fire=valid&&cutoff<=angle+width?Math.max(cutoff,angle):180;
    const extinguish=180-cutoff,canFire=valid&&fire<extinguish;
    const atAngle=phase=>{
      const deg=((phase%360)+360)%360,half=deg<180?0:1,
        local=deg-half*180,sign=half===0?1:-1,rad=deg*Math.PI/180,
        sine=peak*Math.sin(rad);
      const gatePulse=valid&&local>=angle&&local<Math.min(180,angle+width);
      const on=canFire&&local>=fire&&local<extinguish;
      const loadV=on?sign*Math.max(0,Math.abs(sine)-virtualDrop):0,
        currentA=loadV/(resistance||1);
      return {deg,sourceV:sine,gateV:gatePulse?5*sign:0,loadV,currentA,conducting:on,
        half:half===0?'positive':'negative',zeroCrossing:local<.3||180-local<.3};
    };
    let rmsSquares=0,conduction=0;
    const waveform=[];
    // 2-degree samples over one full cycle; RMS is not an angle-slider proxy.
    for(let deg=0;deg<360;deg+=2){
      const x=atAngle(deg);rmsSquares+=x.loadV*x.loadV;if(x.conducting)conduction++;
      if(deg%10===0)waveform.push({deg,sourceV:x.sourceV,gateV:x.gateV,loadV:x.loadV,
        currentA:x.currentA});
    }
    const outputRmsV=valid?Math.sqrt(rmsSquares/180):0,
      phase=(now*hz*.36)%360,instant=atAngle(phase);
    if(src){src._sc17Wave=waveform;src._sc17PhaseDeg=instant.deg;src._sc17SourceV=instant.sourceV}
    if(driver){driver._sc17Wave=waveform;driver._sc17GateV=instant.gateV;
      driver._sc17PhaseDeg=instant.deg;driver._sc17FiringAngleDeg=canFire?fire:null;
      driver._active=valid&&instant.gateV!==0}
    if(triac){triac._sc17Wave=waveform;triac._sc17CurrentA=instant.currentA;
      triac._sc17Conducting=instant.conducting;triac._sc17Half=instant.half;
      triac._thyristorOn=instant.conducting;triac._active=instant.conducting}
    if(lamp){lamp._sc17Wave=waveform;lamp._sc17RmsV=outputRmsV;
      lamp._sc17LoadV=instant.loadV;lamp._sc17CurrentA=instant.currentA;
      lamp._sc17ConductionPct=valid?100*conduction/180:0;
      lamp._active=instant.conducting;lamp._lampActive=instant.conducting;
      lamp._powered=instant.conducting;lamp._currentValue=Math.abs(instant.currentA)}
    return {result:{...result,timed:valid},verified:valid,
      phaseDeg:instant.deg,half:instant.half,zeroCrossing:instant.zeroCrossing,
      sourceV:instant.sourceV,gateV:instant.gateV,loadV:instant.loadV,
      currentA:instant.currentA,conducting:instant.conducting,
      firedAtDeg:canFire?fire:null,rmsV:outputRmsV,
      conductionPct:valid?100*conduction/180:0};
  }


  // SC18 opto model: two isolated virtual supplies, LED-to-phototransistor
  // coupling ONLY through an illustrative CTR; never connect the DC rails.
  function solveSc18OptocouplerCycle(project,byId,options={}){
    const scene=['electronic-switching-src-18','electronic-switching-outline-057','electronic-switching-outline-061'].includes(project?.tutorialLesson?.id)||
      ['tutorial-electronic-switching-src-18','tutorial-session-source-electronic-switching-src-18',
       'tutorial-session-source-electronic-switching-outline-057','tutorial-session-source-electronic-switching-outline-061'].includes(project?.projectId);
    if(!scene)return {result:solve(project,byId,options),verified:false};
    const result=solve(project,byId,options),part=id=>project.components.find(c=>c.id===id);
    const g1=part('g1'),g2=part('g2'),sg=part('sg'),rin=part('rin'),rout=part('rout'),u=part('u1');
    const match=!!(g1?.typeId==='arduino-bench-supply'&&g2?.typeId==='arduino-bench-supply'&&
      g1.id!==g2.id&&sg?.typeId==='push-no'&&rin?.typeId==='resistor'&&rout?.typeId==='resistor'&&
      u?.typeId==='arduino-tlp521-1'&&u.mq07OptoVirtual===true&&
      byId[u.typeId]?.pins?.map(p=>p.id).join(',')==='1,2,4,3');
    const parents=new Map();
    const key=x=>x?.j!==undefined?'j:'+x.j:x?.c&&x?.p?x.c+'/'+x.p:null;
    const find=x=>{if(!parents.has(x))parents.set(x,x);let r=x;
      while(parents.get(r)!==r)r=parents.get(r);
      while(parents.get(x)!==x){const next=parents.get(x);parents.set(x,r);x=next}
      return r};
    for(const w of project.wires||[]){
      if(w.mechanical||w.role==='MECHANICAL')continue;
      const a=key(w.from),b=key(w.to);if(a&&b)parents.set(find(a),find(b));
    }
    const linked=(a,p,b,q)=>find(a+'/'+p)===find(b+'/'+q);
    const separate=!!(match&&!linked('g1','M','g2','M')&&!linked('g1','P','g2','P')&&
      !linked('g1','P','g2','M')&&!linked('g2','P','g1','M')&&
      !linked('u1','1','u1','4')&&!linked('u1','2','u1','3')&&
      !linked('u1','1','u1','2')&&!linked('u1','4','u1','3'));
    const inputWired=!!(separate&&linked('g1','P','sg','13')&&linked('sg','14','rin','1')&&
      linked('rin','2','u1','1')&&linked('u1','2','g1','M'));
    const outputWired=!!(separate&&linked('g2','P','rout','1')&&
      linked('rout','2','u1','4')&&linked('u1','3','g2','M'));
    const vin=g1?.dcVoltage,vout=g2?.dcVoltage,ri=rin?.resistance,ro=rout?.resistance,
      ctr=u?.mq07VirtualCtr,ledDrop=u?.mq07VirtualLedDropV,vceSat=u?.mq07VirtualVceSatV;
    const validParams=!!(result.stable&&!result.shortCircuit&&!result.blocked&&!result.oscillating&&
      typeof vin==='number'&&Number.isFinite(vin)&&vin>=1&&vin<=12&&
      typeof vout==='number'&&Number.isFinite(vout)&&vout>=1&&vout<=12&&
      typeof ri==='number'&&Number.isFinite(ri)&&ri>=100&&ri<=100000&&
      typeof ro==='number'&&Number.isFinite(ro)&&ro>=100&&ro<=100000&&
      typeof ctr==='number'&&Number.isFinite(ctr)&&ctr>0&&ctr<=2&&
      typeof ledDrop==='number'&&Number.isFinite(ledDrop)&&ledDrop>=.5&&ledDrop<=2.5&&
      typeof vceSat==='number'&&Number.isFinite(vceSat)&&vceSat>=.05&&vceSat<=1);
    const inputReady=inputWired&&validParams,outputReady=outputWired&&validParams;
    const ledA=inputReady&&sg.state===true?Math.max(0,(vin-ledDrop)/ri):0;
    const limitA=outputReady?Math.max(0,(vout-vceSat)/ro):0;
    const collectorA=inputReady&&outputReady?Math.min(limitA,ledA*ctr):0;
    const conducting=collectorA>0.00001;
    // No manufacturer CTR transfer curve or real isolation breakdown physics.
    const collectorV=outputReady?Math.max(vceSat,vout-collectorA*ro):null;
    if(u){
      u._sc18LedCurrentA=ledA;u._sc18CollectorCurrentA=collectorA;
      u._sc18CollectorVoltageV=collectorV;u._sc18LedOn=ledA>0;
      u._sc18TransistorOn=conducting;u._sc18Isolated=separate;
      u._sc18VirtualCtr=validParams?ctr:null;u._active=conducting;
    }
    if(rin){rin._sc18CurrentA=ledA;rin._currentValue=ledA;rin._active=ledA>0}
    if(rout){rout._sc18CurrentA=collectorA;rout._currentValue=collectorA;
      rout._voltageValue=collectorA*ro;rout._active=conducting}
    return {result:{...result,timed:false},verified:!!(inputReady&&outputReady),
      isolated:separate,inputReady,outputReady,ledOn:ledA>0,transistorOn:conducting,
      ledCurrentA:ledA,collectorCurrentA:collectorA,collectorVoltageV:collectorV,
      virtualCtr:validParams?ctr:null};
  }


  // MQ-05 SC19 optically gated TRIAC / flashing load, only 5 V virtual DC and
  // independent 12 V RMS isolated virtual AC domains. Not a mains/SPICE model.
  function solveSc19OptoTriacCycle(project,byId,options={}){
    const active=['electronic-switching-src-19','electronic-switching-outline-060'].includes(project?.tutorialLesson?.id)||
      ['tutorial-electronic-switching-src-19','tutorial-session-source-electronic-switching-src-19',
       'tutorial-session-source-electronic-switching-outline-060'].includes(project?.projectId);
    if(!active)return {result:solve(project,byId,options),verified:false};
    const result=solve(project,byId,options),part=id=>project.components.find(c=>c.id===id);
    const g1=part('g1'),t=part('t1'),rin=part('rin'),u=part('u1'),
      ac=part('ac1'),lamp=part('h1'),q=part('q1'),rdrive=part('rdrive'),
      rg=part('rg'),rref=part('rref');
    const identity=!!(g1?.typeId==='arduino-bench-supply'&&t?.typeId==='virtual-opto-flasher-timer-v1'&&
      rin?.typeId==='resistor'&&u?.typeId==='moc3021-opto-triac'&&
      ac?.typeId==='virtual-isolated-ac-12v'&&lamp?.typeId==='standard-light'&&
      q?.typeId==='bta16-600b-triac'&&rdrive?.typeId==='resistor'&&
      rg?.typeId==='resistor'&&rref?.typeId==='resistor'&&
      byId[u.typeId]?.pins?.map(p=>p.id).join(',')==='1,2,4,6'&&
      byId[q.typeId]?.pins?.map(p=>p.id).join(',')==='MT1,MT2,G');
    const parents=new Map(),key=x=>x?.j!==undefined?'j:'+x.j:x?.c&&x?.p?x.c+'/'+x.p:null;
    const find=x=>{if(!parents.has(x))parents.set(x,x);let r=x;
      while(parents.get(r)!==r)r=parents.get(r);
      while(parents.get(x)!==x){const n=parents.get(x);parents.set(x,r);x=n}return r;};
    const merge=(a,b)=>{const ka=find(a),kb=find(b);if(ka!==kb)parents.set(ka,kb);};
    for(const wire of project.wires||[]){
      if(wire.mechanical||wire.role==='MECHANICAL')continue;
      const a=key(wire.from),b=key(wire.to);if(a&&b)merge(a,b);
    }
    const linked=(a,ap,b,bp)=>find(a+'/'+ap)===find(b+'/'+bp);
    const wireOK=!!(identity&&
      linked('g1','P','t1','V+')&&linked('t1','GND','g1','M')&&
      linked('t1','OUT','rin','1')&&linked('rin','2','u1','1')&&
      linked('u1','2','g1','M')&&
      linked('ac1','AC','h1','X1')&&linked('h1','X2','q1','MT2')&&
      linked('q1','MT1','ac1','RET')&&
      linked('q1','MT2','rdrive','1')&&linked('rdrive','2','u1','6')&&
      linked('u1','4','rg','1')&&linked('rg','2','q1','G')&&
      linked('q1','G','rref','1')&&linked('rref','2','q1','MT1'));
    // Passive resistance joins each side's electrical network. It cannot
    // manufacture isolation: even an indirect DC→AC bridge invalidates the scene.
    for(const c of [rin,rdrive,rg,rref])if(c)merge(c.id+'/1',c.id+'/2');
    const dcNodes=['g1/P','g1/M','t1/V+','t1/GND','t1/OUT','rin/1','rin/2','u1/1','u1/2'];
    const acNodes=['ac1/AC','ac1/RET','h1/X1','h1/X2','q1/MT1','q1/MT2',
      'q1/G','rdrive/1','rdrive/2','rg/1','rg/2','rref/1','rref/2','u1/4','u1/6'];
    const dcSet=new Set(dcNodes.map(find)),acSet=new Set(acNodes.map(find));
    const isolated=!Array.from(dcSet).some(n=>acSet.has(n));
    const vin=g1?.dcVoltage,rt=rin?.resistance,ledDrop=u?.virtualLedDropV,
      ledThreshold=u?.virtualLedThresholdA,hz=t?.frequencyHz,duty=t?.dutyPercent,
      acRms=ac?.rmsVoltage,acHz=ac?.frequencyHz,rl=lamp?.resistance,
      rd=rdrive?.resistance,gateR=rg?.resistance,refR=rref?.resistance,
      holding=q?.mq07VirtualHoldingCurrentA;
    const finite=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
    const now=Number.isFinite(options.now)?options.now:Date.now();
    const valid=!!(wireOK&&isolated&&result.stable&&!result.shortCircuit&&
      !result.blocked&&!result.oscillating&&Number.isFinite(now)&&now>=0&&
      finite(vin,3,6)&&finite(rt,100,100000)&&finite(ledDrop,.5,2.5)&&
      finite(ledThreshold,.001,.025)&&finite(hz,.2,10)&&finite(duty,0,100)&&
      finite(acRms,1,24)&&finite(acHz,45,60)&&finite(rl,10,10000)&&
      finite(rd,100,100000)&&finite(gateR,100,100000)&&
      finite(refR,1000,1000000)&&finite(holding,.001,.5)&&
      ac.sourceEnabled!==false&&t.timerEnabled!==false);
    const periodMs=valid?1000/acHz:20,timerMs=valid?1000/hz:500,
      acPeak=valid?acRms*Math.SQRT2:0,drop=1;
    const ledA=valid?Math.max(0,(vin-ledDrop)/rt):0;
    const enabled=(time)=>!!(valid&&ledA>=ledThreshold&&
      (duty===100||(duty>0&&((time%timerMs+timerMs)%timerMs)<timerMs*duty/100)));
    const cycleStart=Math.floor(now/periodMs)*periodMs;
    let on=false,previousHalf=-1,squares=0,conductSteps=0,peakCurrent=0;
    const states=[],wave=[];
    for(let degree=0;degree<360;degree++){
      const half=degree<180?0:1;
      if(half!==previousHalf){on=false;previousHalf=half;}
      const rad=degree*Math.PI/180,sourceV=acPeak*Math.sin(rad),
        prospectiveA=Math.max(0,(Math.abs(sourceV)-drop)/rl),
        time=cycleStart+degree/360*periodMs,
        ledHigh=enabled(time);
      const gateA=valid&&ledHigh?Math.max(0,(Math.abs(sourceV)-1)/(rd+gateR)):0;
      const ready=valid&&prospectiveA>=holding&&gateA>=.008;
      if(!on&&ready)on=true;
      if(!valid||prospectiveA<holding)on=false;
      const loadV=on?Math.sign(sourceV)*Math.max(0,Math.abs(sourceV)-drop):0,
        currentA=loadV/rl,gateV=ready?(half===0?5:-5):0;
      peakCurrent=Math.max(peakCurrent,Math.abs(currentA));
      squares+=loadV*loadV;if(on)conductSteps++;
      const state={degree,half:half===0?'positive':'negative',sourceV,loadV,currentA,
        gateV,optoTriggered:ready,ledHigh,ledCurrentA:ledHigh?ledA:0,conducting:on};
      states.push(state);
      if(degree%10===0)wave.push({deg:degree,sourceV,loadV,gateV,currentA});
    }
    const phase=((now/periodMs*360)%360+360)%360,instant=states[Math.floor(phase)%360],
      rmsV=valid?Math.sqrt(squares/360):0,
      count=valid?100*conductSteps/360:0;
    if(t){t._sc19TimerHigh=instant.ledHigh;t._sc19TimerHz=valid?hz:null;
      t._sc19DutyPct=valid?duty:null;t._active=instant.ledHigh}
    if(u){u._sc19LedCurrentA=instant.ledCurrentA;u._sc19LedOn=instant.ledHigh;
      u._sc19OptoOn=instant.optoTriggered;u._sc19Isolated=isolated;
      u._active=instant.optoTriggered}
    if(ac){ac._sc19Wave=wave;ac._sc19PhaseDeg=phase}
    if(q){q._sc19CurrentA=instant.currentA;q._sc19Conducting=instant.conducting;
      q._sc19Wave=wave;q._thyristorOn=instant.conducting;q._active=instant.conducting}
    if(lamp){lamp._sc19RmsV=rmsV;lamp._sc19LoadV=instant.loadV;
      lamp._sc19Wave=wave;lamp._sc19CurrentA=instant.currentA;
      lamp._sc19ConductionPct=count;lamp._active=instant.conducting;
      lamp._lampActive=instant.conducting;lamp._powered=instant.conducting;
      lamp._currentValue=Math.abs(instant.currentA)}
    return {result:{...result,timed:valid},verified:valid,isolated,ledOn:instant.ledHigh,
      ledCurrentA:instant.ledCurrentA,optoTriggered:instant.optoTriggered,
      triacConducting:instant.conducting,phaseDeg:phase,half:instant.half,
      gateV:instant.gateV,loadV:instant.loadV,currentA:instant.currentA,rmsV,
      conductionPct:count,peakCurrentA:peakCurrent,zeroCrossing:phase%180<.5};
  }

  const api={solve,solveSc11Cycle,solveSc12DimmerCycle,solveSc15AcCycle,solveSc16DcCycle,solveSc17TriacDimmerCycle,solveSc18OptocouplerCycle,solveSc19OptoTriacCycle,clear,normalizeRef,contactState,conductingPairs,coils,followers,breakers};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSSimulation=api;
})(typeof window==='undefined'?globalThis:window);
