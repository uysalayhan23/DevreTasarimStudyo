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
  const sources=new Set(['supply','supply3','supply-dc-plus','supply-dc-minus','battery','bell-transformer']);
  const phaseMotors=new Set(['motor3','motor-yd','motor-dahlender','motor-rotor','motor-2speed','generator','servo-motor']);
  const normalizeRef=s=>String(s||'').trim().normalize('NFKC').toLocaleUpperCase('tr-TR');
  const pinKey=(c,p)=>JSON.stringify([c,p]);
  const endpointKey=r=>r?.j?JSON.stringify(['junction',r.j]):pinKey(r?.c,r?.p);
  const definition=(byId,c)=>byId[c.typeId];
  function clear(project){
    for(const c of project.components){V20.clear(c);ACS.clear(c);HCFA.clear(c);PLC?.clear?.(c);DigitalIC?.clear?.(c);delete c._motorHz;delete c._motorRPM;delete c._motorDrive;delete c._motorAngle;delete c._sc11SpeedPercent;delete c._sc11DriveTargetPercent;delete c._sc11ResponseNow;delete c._sc11VgsMean;}
    for(const c of project.components){for(const k of ['_sensorSignal','_instrument','_controller','_pid','_alarmArmed1','_alarmArmed2','_voltageValue','_meter','_clamp','_shownMeterWarning','_a1pid','_autoTune','_ncv'])delete c[k]}
    for(const c of project.components){c._active=false;c._lampActive=false;c._actuated=false;c._closed=null;c._contactStates={};c._hot=[];c._powered=false;c._fault=false;c._spin=0;delete c._timing;delete c._sensorSupply;delete c._currentValue;delete c._primaryCurrent;delete c._secondaryCurrent;delete c._secondaryOpen;delete c._phaseFault;delete c._signalMv;delete c._loadExcitation;delete c._loadStatus;delete c._hcfaLinkedDrive;delete c._hcfaModbusLinked;delete c._doldEval;delete c._doldMemory;delete c._capacitorVoltage;delete c._inductorCurrent;delete c._reactiveVoltage;delete c._reactiveCurrent;delete c._reactiveModel;delete c._reactiveNow;delete c._bjtOn;delete c._mosfetOn;delete c._jfetOn;delete c._igbtOn;delete c._thyristorOn;delete c._diacOn;delete c._opampOutput;delete c._opampDiff;delete c._opampPowered}
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
        if(d.kind==='bell-transformer'){
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
        }else if(d.arduinoRole==='analog'&&d.pins?.some(p=>p.id==='AO')){
          const volts=Math.max(0,Math.min(5,Number(c.arduinoValue??d.arduinoDefault??0)/1023*5));seed(c,'AO','arduino-sensor:'+c.id,'+','dc',volts);if(d.pins.some(p=>p.id==='GND'))seed(c,'GND','arduino-sensor:'+c.id,'0','dc',volts);
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
        const lessonId=String(project.tutorialLesson?.id||''),program=lessonId==='plc-hardware-programming-src-21'?'timed-stop':undefined;
        PLC.evaluate(c,d,{at,dcVoltage,voltage,find},now,{program});
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
  function solve(project,byId,options={}){
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
for(const c of project.components){c._solveNow=now;const ed=definition(byId,c);if(ed?.incrementalEncoder38mm){const motor=IncrementalEncoder.motorCoupling?.(project,byId,c);if(motor){c._encoderMotorId=motor.id;c._encoderMotorRef=motor.ref||motor.label||motor.id}else{delete c._encoderMotorId;delete c._encoderMotorRef;IncrementalEncoder.state(c,ed,now,true)}}if(c.typeId===V20.id)c._v20Frame={now,base:c._v20?JSON.parse(JSON.stringify(c._v20)):null};if(c.typeId===ACS.id)c._acs800Frame={now,base:c._acs800?JSON.parse(JSON.stringify(c._acs800)):null};if(c.typeId===HCFA.id)c._hcfaFrame={now,base:c._hcfa?JSON.parse(JSON.stringify(c._hcfa)):null};}
    let actuators=new Map(),sensors=new Set();
    for(const c of project.components){const d=definition(byId,c);if(d&&['overload','thermal-magnetic'].includes(d.kind)&&c.state&&normalizeRef(c.ref))actuators.set('thermal:'+normalizeRef(c.ref),true)}
    if(!options.reset)for(const c of project.components){const d=definition(byId,c);if(d&&coils.has(d.kind)&&c._active&&normalizeRef(c.ref))actuators.set(normalizeRef(c.ref),true)}
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
      for(const tc of project.components){const td=definition(byId,tc);if(!['bjt-npn','bjt-pnp'].includes(td?.kind))continue;let vb=td.kind==='bjt-npn'?net.dcVoltage(tc,'B','E'):net.dcVoltage(tc,'E','B');if(vb===null){bjtNumeric ||= Numeric.update(project,byId,net,{now,sampleOnly:true});vb=td.kind==='bjt-npn'?bjtNumeric.dc(tc,'B','E'):-bjtNumeric.dc(tc,'B','E')}const on=vb!==null&&vb>=0.62;if(on!==!!tc._bjtOn){tc._bjtOn=on;bjtChanged=true}}
      let semiconductorChanged=false;
      for(const tc of project.components){const td=definition(byId,tc);if(!td)continue;let stateKey=null,on=false,v=null;
        if(td.kind==='mosfet-n'){stateKey='_mosfetOn';v=net.dcVoltage(tc,'G','S');if(tc.mq07FetRcDelay||tc.mq07MosfetHealth){const sampled=Numeric.update(project,byId,net,{now,sampleOnly:true});v=sampled.dc(tc,'G','S');if(tc.mq07FetRcDelay)tc._mq07GateSampleV=v;if(tc.mq07MosfetHealth)tc._mq07HealthGateV=v}on=v!==null&&v>=4}
        else if(td.kind==='jfet-n'){stateKey='_jfetOn';v=net.dcVoltage(tc,'G','S');const cutoff=Math.abs(Number(td.gateCutoffVoltage)||3);on=v===null?false:v>-cutoff}
        else if(td.kind==='mosfet-p'){stateKey='_mosfetOn';v=net.dcVoltage(tc,'S','G');on=v!==null&&v>=4}
        else if(td.kind==='igbt-n'){stateKey='_igbtOn';v=net.dcVoltage(tc,'G','E');on=v!==null&&v>=4}
        else if(td.kind==='scr'){stateKey='_thyristorOn';v=net.dcVoltage(tc,'G','K');on=v!==null&&v>=.7}
        else if(td.kind==='triac'){stateKey='_thyristorOn';v=net.dcVoltage(tc,'G','MT1');on=v!==null&&Math.abs(v)>=.7}
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
    SignedFlow.apply(project,byId,net,{numericState,pairs:(c,d)=>conductingPairs(c,d,actuators,sensors)});
    return {blocked:false,stable,oscillating,cyclingRefs,timed:project.components.some(c=>(definition(byId,c)?.kind==='pwm-generator'&&c._pwmSupplyValid&&c.dutyPercent>0&&c.dutyPercent<100)||isDrive(definition(byId,c))||definition(byId,c)?.instrument==='et4420'||definition(byId,c)?.doldSafety||c._plcTimerStart!==undefined||['timer','coil-pulse','coil-flasher','flasher','capacitor','reactor'].includes(definition(byId,c)?.kind)||definition(byId,c)?.id==='winding'||definition(byId,c)?.kind.startsWith('delay-')||DigitalIC?.timed?.(c,definition(byId,c))||(definition(byId,c)?.incrementalEncoder38mm&&c._encoderPowered&&Math.abs(Number(c.encoderRPM)||0)>0)),damaged:project.components.filter(c=>c._sensorSupply==='reversed').map(c=>c.id),shortCircuit:net.faultDomains.size>0};
  }
  // SC11 samples electrical ON/OFF phases through the original nodal solver.
  // Speed is an explicitly *uncalibrated normalized educational response*, never RPM.
  function solveSc11Cycle(project,byId,options={}){
    const scene=project?.projectId==='tutorial-session-source-electronic-switching-src-11'||
      project?.tutorialLesson?.id==='electronic-switching-src-11';
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
    if(proven&&probes&&Number.isFinite(high.vgs)&&Number.isFinite(low.vgs)&&
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

  const api={solve,solveSc11Cycle,clear,normalizeRef,contactState,conductingPairs,coils,followers,breakers};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSSimulation=api;
})(typeof window==='undefined'?globalThis:window);
