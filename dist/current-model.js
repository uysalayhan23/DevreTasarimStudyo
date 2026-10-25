(function(root){
 'use strict';
 const key=(c,p)=>JSON.stringify([c,p]);
 // Linear nodal model with resistive loads plus first-order R/C/L companion models.
 // Phase angles are retained for source magnitude. Capacitor/reactor AC currents use
 // their 50/60 Hz reactance magnitude; DC transients use backward-Euler state.
 function solveGraph(branches,fixed,injected=new Map()){
  const nodes=[...new Set(branches.flatMap(b=>[b.a,b.b]))],adj=new Map(nodes.map(n=>[n,[]])),result=new Map(fixed);
  for(const b of branches){adj.get(b.a).push(b.b);adj.get(b.b).push(b.a)}
  const seen=new Set();
  for(const start of nodes){if(seen.has(start))continue;const cluster=[],q=[start];while(q.length){const n=q.pop();if(seen.has(n))continue;seen.add(n);cluster.push(n);q.push(...adj.get(n))}
   const known=new Map(cluster.filter(n=>fixed.has(n)).map(n=>[n,fixed.get(n)]));
   if(!known.size)known.set(start,[0,0]);
   const unknown=cluster.filter(n=>!known.has(n)),index=new Map(unknown.map((n,i)=>[n,i])),m=unknown.length,N=2*m,A=Array.from({length:N},()=>Array(N+1).fill(0));
   const yOf=b=>b.y||[1/b.r,0],stamp=(r,i,g,b,scale=1)=>{A[r][i]+=g*scale;A[r][i+1]-=b*scale;A[r+1][i]+=b*scale;A[r+1][i+1]+=g*scale};
   for(const n of unknown){const i=2*index.get(n),v=injected.get(n)||[0,0];A[i][N]=v[0];A[i+1][N]=v[1]}
   for(const edge of branches){const Y=yOf(edge),g=Y[0],b=Y[1];for(const [a,z] of [[edge.a,edge.b],[edge.b,edge.a]]){const ix=index.get(a);if(ix===undefined)continue;const i=2*ix;stamp(i,i,g,b);const jx=index.get(z);if(jx!==undefined)stamp(i,2*jx,g,b,-1);else{const v=known.get(z)||[0,0];A[i][N]+=g*v[0]-b*v[1];A[i+1][N]+=b*v[0]+g*v[1]}}}
   let valid=true;for(let j=0;j<N;j++){let p=j;for(let i=j+1;i<N;i++)if(Math.abs(A[i][j])>Math.abs(A[p][j]))p=i;if(Math.abs(A[p][j])<1e-14){valid=false;break}[A[p],A[j]]=[A[j],A[p]];const k=A[j][j];for(let t=j;t<=N;t++)A[j][t]/=k;for(let i=0;i<N;i++)if(i!==j){const f=A[i][j];if(!f)continue;for(let t=j;t<=N;t++)A[i][t]-=f*A[j][t]}}
   for(const [n,v] of known)result.set(n,v);for(let i=0;i<m;i++)result.set(unknown[i],valid?[A[2*i][N],A[2*i+1][N]]:[0,0]);
  }
  return result;
 }
 function update(project,byId,net,options={}){
  const Devices=typeof module==='object'&&module.exports?require('./device-behavior.js'):root.DTSDeviceBehavior;
  const UT=typeof module==='object'&&module.exports?require('./multimeter.js'):root.DTSMultimeter;
  const Clamp=typeof module==='object'&&module.exports?require('./clamp-meter.js'):root.DTSClampMeter;
  const Analyzer=typeof module==='object'&&module.exports?require('./energy-analyzer.js'):root.DTSEnergyAnalyzer;
  const branches=[],fixed=new Map(),acNodes=new Set(),dcNodes=new Set(),cts=[],meters=[],reactive=[],diodes=[],opamps=[],dimmerStages=[],injected=new Map(),pin=(c,p)=>net.find(key(c.id,p)),add=(c,a,b,r,role)=>{const branch={a:pin(c,a),b:pin(c,b),ap:a,bp:b,r:Math.max(1e-6,r),c,role};branches.push(branch);return branch},addY=(c,a,b,y,role)=>{const branch={a:pin(c,a),b:pin(c,b),ap:a,bp:b,y,c,role};branches.push(branch);return branch};
  const now=Number(options.now??Date.now()),defaultDt=.05,inject=(a,b,value)=>{if(!Number.isFinite(value)||Math.abs(value)<1e-15)return;injected.set(a,[(injected.get(a)?.[0]||0)+value,(injected.get(a)?.[1]||0)]);injected.set(b,[(injected.get(b)?.[0]||0)-value,(injected.get(b)?.[1]||0)])};
  const sc78Tone=project?.tutorialLesson?.id==='oscillator-filter-apps-src-26'&&
    project.components.length===10&&project.wires.length===15&&
    (()=>{
      const wired=(a,ap,b,bp)=>project.wires.some(w=>
        (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
        (w.from?.c===b&&w.from?.p===bp&&w.to?.c===a&&w.to?.p===ap));
      const parts=[['fg','arduino-signal-generator'],['rl','resistor'],
        ['cl','capacitor'],['rh','resistor'],['ch','capacitor'],
        ['rvL','potentiometer'],['rvH','potentiometer'],
        ['rmL','resistor'],['rmH','resistor'],['v1','meter-voltmeter']];
      return parts.every(([id,type])=>project.components.some(c=>c.id===id&&c.typeId===type))&&
        [['fg','OUT','rl','1'],['rl','2','cl','1'],['cl','2','fg','GND'],
         ['rl','2','rvL','3'],['rvL','1','fg','GND'],['rvL','2','rmL','1'],
         ['rmL','2','v1','1'],['fg','OUT','ch','1'],['ch','2','rh','1'],
         ['rh','2','fg','GND'],['ch','2','rvH','3'],['rvH','1','fg','GND'],
         ['rvH','2','rmH','1'],['rmH','2','v1','1'],['v1','2','fg','GND']]
         .every(([a,p,b,q])=>wired(a,p,b,q))&&
        project.components.find(c=>c.id==='fg')?.generatorWaveform==='sine';
    })();
  // SC080: only the actual authored diode + series resistance + RC path.
  const sc80Envelope=project?.tutorialLesson?.id==='oscillator-filter-apps-src-28'&&
    project.components.length===7&&project.wires.length===10&&
    (()=>{
      const wired=(a,p,b,q)=>project.wires.some(w=>
        (w.from?.c===a&&w.from?.p===p&&w.to?.c===b&&w.to?.p===q)||
        (w.to?.c===a&&w.to?.p===p&&w.from?.c===b&&w.from?.p===q));
      const parts=[['fg','arduino-signal-generator'],['rv','potentiometer'],
        ['rin','resistor'],['d1','1n4148-do35'],['c1','capacitor'],
        ['r1','resistor'],['v1','meter-voltmeter']];
      return parts.every(([id,type])=>project.components.some(c=>c.id===id&&c.typeId===type))&&
        [['fg','OUT','rv','3'],['rv','1','fg','GND'],
         ['rv','2','rin','1'],['rin','2','d1','A'],
         ['d1','K','c1','1'],['c1','2','fg','GND'],['d1','K','r1','1'],
         ['r1','2','fg','GND'],['d1','K','v1','1'],['v1','2','fg','GND']]
        .every(([a,p,b,q])=>wired(a,p,b,q))&&
        project.components.find(c=>c.id==='fg')?.generatorWaveform==='sine';
    })();
  // SC081: ST TDA2030 single-rail 28 V source and 4 ohm equivalent RL.
  // Native power stage only for the exact manufacturer-grounded tutorial.
  const sc81Power=project?.tutorialLesson?.id==='oscillator-filter-apps-src-29'&&
    project.components.length===19&&project.wires.length===31&&
    (()=>{
      const wired=(a,p,b,q)=>project.wires.some(w=>
        (w.from?.c===a&&w.from?.p===p&&w.to?.c===b&&w.to?.p===q)||
        (w.from?.c===b&&w.from?.p===q&&w.to?.c===a&&w.to?.p===p));
      const parts=[['g1','arduino-bench-supply'],['fg','arduino-signal-generator'],
        ['u1','tda2030-pentawatt5'],['ra','resistor'],['rb','resistor'],
        ['c1','capacitor'],['r3','resistor'],['rf','resistor'],['rg','resistor'],
        ['c2','capacitor'],['cout','capacitor'],
        ['spk','virtual-audio-load-4ohm-25w'],['v1','meter-voltmeter'],
        ['rz','resistor'],['cz','capacitor'],['cp','capacitor'],['cb','capacitor'],
        ['d1','1n4007-do41'],['d2','1n4007-do41']];
      return parts.every(([id,t])=>project.components.some(c=>c.id===id&&c.typeId===t))&&
        [['g1','P','u1','5'],['g1','M','u1','3'],
         ['g1','P','ra','1'],['ra','2','rb','1'],['rb','2','g1','M'],
         ['ra','2','r3','1'],['r3','2','u1','1'],
         ['fg','OUT','c1','1'],['c1','2','u1','1'],['fg','GND','g1','M'],
         ['u1','4','rf','1'],['rf','2','u1','2'],['u1','2','rg','1'],
         ['rg','2','c2','1'],['c2','2','g1','M'],
         ['u1','4','cout','1'],['cout','2','spk','+'],['spk','-','g1','M'],
         ['cout','2','v1','1'],['v1','2','g1','M'],
         ['u1','4','rz','1'],['rz','2','cz','1'],['cz','2','g1','M'],
         ['g1','P','cp','1'],['cp','2','g1','M'],
         ['g1','P','cb','1'],['cb','2','g1','M'],
         ['u1','4','d1','A'],['d1','K','g1','P'],
         ['g1','M','d2','A'],['d2','K','u1','4']]
          .every(([a,p,b,q])=>wired(a,p,b,q))&&
        Number(project.components.find(c=>c.id==='spk')?.impedanceOhm??4)===4;
    })();
  // SC081: once an authored TDA2030 wire or component is changed, the
  // native stage no longer applies. Drop its previous RMS/power readouts
  // instead of leaving yesterday's values on U1, the load and V1.
  if(project?.tutorialLesson?.id==='oscillator-filter-apps-src-29'&&!sc81Power){
    for(const c of project.components){
      delete c._sc81NativePower;
      if(c.id==='spk'){delete c._speakerPowerW;c._active=false;}
      if(c.id==='v1')delete c._voltageValue;
    }
  }
  // SC082 specific circuit guard.
  const sc82Linear=project?.tutorialLesson?.id==='oscillator-filter-apps-src-30'&&
    project.components.length===21&&project.wires.length===40&&(()=>{
      const types=[["ps","virtual-bipolar-audio-rail"],["fg","arduino-signal-generator"],["u1","tda7293-multiwatt15v"],["rl","virtual-audio-load-8ohm-150w"],["v1","meter-voltmeter"],["r1","resistor"],["c1","capacitor"],["r2","resistor"],["c2","capacitor"],["r3","resistor"],["c5","capacitor"],["c7","capacitor"],["c6","capacitor"],["c9","capacitor"],["c8","capacitor"],["stby","arduino-bench-supply"],["mute","arduino-bench-supply"],["r4","resistor"],["c4","capacitor"],["r5","resistor"],["c3","capacitor"]];
      const edges=["ps.VP>u1.7","ps.VP>u1.13","ps.VN>u1.8","ps.VN>u1.15","ps.G>u1.4","ps.G>u1.1","fg.OUT>c1.1","c1.2>u1.3","fg.GND>ps.G","u1.3>r1.1","r1.2>ps.G","u1.14>r3.1","r3.2>u1.2","u1.2>r2.1","r2.2>c2.1","c2.2>ps.G","u1.6>c5.1","c5.2>u1.14","u1.14>rl.+","rl.->ps.G","u1.14>v1.1","v1.2>ps.G","ps.VP>c7.1","c7.2>ps.G","ps.VP>c6.1","c6.2>ps.G","ps.VN>c9.1","c9.2>ps.G","ps.VN>c8.1","c8.2>ps.G","stby.P>r4.1","r4.2>u1.9","u1.9>c4.1","c4.2>ps.G","stby.M>ps.G","mute.P>r5.1","r5.2>u1.10","u1.10>c3.1","c3.2>ps.G","mute.M>ps.G"];
      if(!types.every(([id,t])=>project.components.some(c=>c.id===id&&c.typeId===t)))return false;
      const actual=project.wires.map(w=>w.from.c+'.'+w.from.p+'>'+w.to.c+'.'+w.to.p);
      return edges.every(s=>actual.includes(s)||actual.includes(s.split('>').reverse().join('>')))&&
        project.components.find(c=>c.id==='fg')?.generatorWaveform==='sine';
    })();
  // Invalidate SC082 computed power and latch state when any of its fixed
  // external terminal connections is no longer present.
  if(project?.tutorialLesson?.id==='oscillator-filter-apps-src-30'&&!sc82Linear){
    for(const c of project.components){
      delete c._sc82NativePower;delete c._sc82Control;
      if(c.id==='rl')delete c._speakerPowerW;
    }
  }
  const reactiveDt=c=>{const last=Number(c._reactiveNow);return Math.max(.001,Math.min(.25,Number.isFinite(last)?(now-last)/1000:defaultDt))};
  const sourceFrequency=c=>{for(const p of byId[c.typeId]?.pins||[])for(const v of net.at(c,p.id)||[])if(v?.type==='ac')return Math.max(1,Number(v.frequency)||Number(v.hz)||50);return 50};
  const isACComponent=(c,d)=>d.pins.some(p=>(net.at(c,p.id)||[]).some(v=>v?.type==='ac'));
  for(const c of project.components){const d=byId[c.typeId];if(!d)continue;delete c._currentValue;
   for(const p of d.pins){const v=net.at(c,p.id)[0];if(!v)continue;(v.type==='ac'?acNodes:dcNodes).add(pin(c,p.id));const angle=v.type==='ac'?({L1:0,L2:-2*Math.PI/3,L3:2*Math.PI/3}[v.leg]||0):0,mag=['N','0','PE'].includes(v.leg)?0:v.volts;fixed.set(pin(c,p.id),[mag*Math.cos(angle),mag*Math.sin(angle)])}
   if(d.kind==='current-transformer')cts.push(add(c,'P1','P2',1e-6,'ct'));
   else if(['diode','led','photodiode'].includes(d.kind)){diodes.push({c,drop:d.kind==='led'?2:d.kind==='photodiode'?1:.7});if(d.kind==='photodiode'){const lux=Math.max(0,Number(c.illuminationLux??d.defaultIlluminationLux??100)),photo=70e-6*lux/1000+Math.max(0,Number(d.darkCurrentA)||0);c._photocurrentA=photo;inject(pin(c,'A'),pin(c,'K'),photo)}}
   else if(d.kind==='meter-a')meters.push(add(c,d.pins[0].id,d.pins[1].id,1e-6,'meter'));
   else if(d.kind==='ldr'){
    const lux=Math.max(.01,Number(c.illuminationLux??d.illuminationLux??10)),r10=Math.max(1,Number(d.r10)||15000),gamma=Math.max(.1,Number(d.gamma)||.6),dark=Math.max(r10,Number(d.darkResistance)||1000000),r=Math.min(dark,r10*Math.pow(10/lux,gamma));
    c._ldrResistance=r;add(c,d.pins[0].id,d.pins[1].id,Math.max(.01,r),'ldr');
   }
   else if(['resistor','lamp'].includes(d.kind))add(c,d.pins[0].id,d.pins[1].id,Math.max(.01,Number(c.resistance)||1000),'load');
   else if(d.kind==='mosfet-n'&&c.virtualLdrDimmer){
    // A bounded educational linear-pass equivalent, only when explicitly opted in.
    // Other MOSFETs retain their canonical ideal contact model.
    dimmerStages.push(add(c,'D','S',1e7,'virtual-ldr-linear-channel'));
   }
   else if(d.kind==='energy-training-load'){
    const nominal=Math.max(1,Number(c.nominalVoltage??d.nominalVoltage??230)),apparent=Math.max(1,Number(c.apparentPowerVA??d.apparentPowerVA??230)),pf=Math.max(.05,Math.min(1,Number(c.powerFactor??d.powerFactor??1))),character=c.loadCharacter||d.loadCharacter||'resistive';
    const active=apparent*pf,qmag=apparent*Math.sqrt(Math.max(0,1-pf*pf)),reactive=character==='inductive'?qmag:character==='capacitive'?-qmag:0,g=active/(nominal*nominal),susceptance=-reactive/(nominal*nominal),hz=sourceFrequency(c);
    const br=addY(c,'L','N',[g,susceptance],'energy-training-load');Object.assign(br,{energyTraining:true,nominal,apparent,pf,character,hz});
   }
   else if(d.kind==='capacitor'){
    const cap=Math.max(1e-12,Number(c.capacitance??d.capacitance??100e-6)),a=d.pins[0].id,b=d.pins[1].id;
    if(sc81Power||(sc82Linear&&!['c3','c4'].includes(c.id))||
       (sc80Envelope&&c.id==='c1')||
       (sc78Tone&&['cl','ch'].includes(c.id))||
       (project?.tutorialLesson?.id==='oscillator-filter-apps-src-25'&&['c1','c2'].includes(c.id))||
       (project?.tutorialLesson?.id==='oscillator-filter-apps-src-24'&&c.id==='c1')){
     // SC076/SC077: native 1 kHz/500 Hz sine sources use frequency-domain
     // capacitor admittance, never a UI frame-rate approximation.
     // Keep the DC coupling capacitors open instead of aliasing them at UI frame rate.
     const br=add(c,a,b,1e12,'capacitor-dc');Object.assign(br,{reactiveType:'C',value:cap,dt:1,previous:0});reactive.push(br);
    }
    else if(isACComponent(c,d)){const hz=sourceFrequency(c),br=addY(c,a,b,[0,2*Math.PI*hz*cap],'capacitor-ac');Object.assign(br,{reactiveType:'C',value:cap,hz});reactive.push(br)}
    else{const dt=reactiveDt(c),r=dt/cap,br=add(c,a,b,r,'capacitor-dc'),vp=Number(c._capacitorVoltage)||0;inject(br.a,br.b,vp/r);Object.assign(br,{reactiveType:'C',value:cap,dt,previous:vp});reactive.push(br)}
   }
   else if(d.kind==='speaker'){add(c,d.pins[0].id,d.pins[1].id,Math.max(.1,Number(c.impedanceOhm??d.impedanceOhm??8)),'speaker-load')} else if(d.kind==='crystal'){const a=d.pins[0].id,b=d.pins[1].id,m=d.crystalModel||{},rs=Math.max(.01,Number(m.seriesResistance)||40),cm=Math.max(1e-15,Number(m.motionalCapacitance)||2e-14),lm=Math.max(1e-9,Number(m.motionalInductance)||.079),c0=Math.max(0,Number(m.shuntCapacitance)||3e-12);if(isACComponent(c,d)){const hz=sourceFrequency(c),w=2*Math.PI*hz,x=w*lm-1/(w*cm),den=rs*rs+x*x,ys=[rs/den,-x/den],yp=[0,w*c0],br=addY(c,a,b,[ys[0]+yp[0],ys[1]+yp[1]],'crystal-bvd');Object.assign(br,{crystal:true,hz,seriesR:rs,motionalC:cm,motionalL:lm,shuntC:c0});reactive.push(br)}else add(c,a,b,1e12,'crystal-dc-open')} else if(d.kind==='reactor'||d.id==='winding'){
    const ind=Math.max(1e-9,Number(c.inductance??d.inductance??.15)),a=d.pins[0].id,b=d.pins[1].id;
    if(isACComponent(c,d)){const hz=sourceFrequency(c),br=addY(c,a,b,[0,-1/(2*Math.PI*hz*ind)],'inductor-ac');Object.assign(br,{reactiveType:'L',value:ind,hz});reactive.push(br)}
    else{const dt=reactiveDt(c),r=ind/dt,br=add(c,a,b,r,'inductor-dc'),ip=Number(c._inductorCurrent)||0;inject(br.a,br.b,-ip);Object.assign(br,{reactiveType:'L',value:ind,dt,previous:ip});reactive.push(br)}
   }
   else if(d.kind==='opamp'){const ro=Math.max(.1,Number(d.outputResistance)||20),br=add(c,'OUT','V-',ro,'opamp-output');opamps.push({c,d,br,ip:pin(c,'IN+'),im:pin(c,'IN-'),vp:pin(c,'V+'),vm:pin(c,'V-'),out:pin(c,'OUT'),gain:Math.max(10,Number(d.openLoopGain)||100000)});} else if(d.kind==='dual-opamp'){const ro=Math.max(.1,Number(d.outputResistance)||20),vp=String(d.supplyPins?.positive||'8'),vm=String(d.supplyPins?.negative||'4');for(const ch of d.opampChannels||[]){const br=add(c,String(ch.out),vm,ro,'opamp-output');opamps.push({c,d,br,ip:pin(c,String(ch.plus)),im:pin(c,String(ch.minus)),vp:pin(c,vp),vm:pin(c,vm),out:pin(c,String(ch.out)),gain:Math.max(10,Number(d.openLoopGain)||100000),channel:String(ch.out)})}}
   else if(d.kind==='audio-power-amplifier'){
    if(sc81Power)add(c,'4','3',Math.max(.05,Number(d.outputResistance)||.15),'audio-power-output');
    if(sc82Linear&&c.id==='u1')add(c,'14','4',.2,'audio-power-output');
   }
   else if(d.kind==='potentiometer'){const r=Math.max(1,Number(c.potMax)||10000),p=Math.max(0,Math.min(100,c.potentiometer??50))/100;add(c,'1','2',r*p,'load');add(c,'2','3',r*(1-p),'load')}
   else if(d.ptWires)add(c,'A','B1',Devices.output(c,d).value,'load');
   else if(['sensor-ntc','sensor-ptc'].includes(d.id))add(c,d.pins[0].id,d.pins[1].id,Devices.output(c,d).value,'load');
   else if(d.id==='abb-acs800-r5'){add(c,'X21:3','X21:4',200001,'acs-ai');add(c,'X21:5','X21:6',100,'acs-ai');add(c,'X21:7','X21:8',100,'acs-ai');}
   else if(d.id==='sinamics-v20-1p'){const V20=typeof module==='object'&&module.exports?require('./v20.js'):root.DTSV20,p=V20.config(c).params;for(let i=0;i<2;i++)add(c,String(i+2),'5',[2,3].includes(p['P0756.'+i])?235:100000,'v20-ai');}
   else if(['motor3','motor-yd'].includes(d.kind)&&c._motorDrive){const drive=project.components.find(v=>v.id===c._motorDrive),s=drive?._acs800||drive?._v20;if(s?.running&&s.current>0){const delta=c._motorConnection==='delta',r=s.voltage/(Math.max(.0001,s.current)*(delta?1/Math.sqrt(3):Math.sqrt(3))),upper=d.kind==='motor3'?['U','V','W']:['U1','V1','W1'];for(let i=0;i<3;i++)add(c,upper[i],['U2','V2','W2'][i],r,'v20-motor');}}
   else if(d.kind==='meter-v')add(c,d.pins[0].id,d.pins[1].id,1e7,'voltmeter');
   else if(d.kind==='multimeter'){const [mode,range]=UT.setting(c,d);if(mode==='DCV'||mode==='ACV'||mode==='Hz')add(c,'V','COM',1e7,'ut-voltage');else if(mode==='DCA')add(c,UT.jack(c,d),'COM',range===10?.01:1,'ut-current')}
   else if(d.digitalIc==='dac0808'&&c._digitalIc?.powered){const a=pin(c,'4'),g=pin(c,'2'),amps=Math.max(0,Number(c._digitalIc.analogCurrentA)||0);add(c,'4','2',1e10,'dac0808-output');inject(g,a,amps);c._currentValue=amps} else if(d.kind==='clamp-meter'){const [mode]=Clamp.setting(c);if(mode==='DCV'||mode==='ACV')add(c,'V','COM',1e7,'ut200-voltage')}
   else if(d.kind==='energy-analyzer'){add(c,'L','N',1e7,'energy-analyzer-voltage');add(c,'S1','S2',.05,'energy-analyzer-ct')}
   for(const s of [...(d.id==='abb-acs800-r5'&&c._acs800?.board?[{a:'X21:9',b:'X21:10',value:c._acs800.ao[0]/1000,compliance:14},{a:'X21:11',b:'X21:12',value:c._acs800.ao[1]/1000,compliance:14}]:[]),...(c._instrument?.current||[]),...(c._sensorSignal?[c._sensorSignal]:[]),...(d.id==='sinamics-v20-1p'&&c._v20?.powered?[{a:'4',b:'5',value:c._v20.ao/1000,compliance:10}]:[])]){const a=pin(c,s.a),b=pin(c,s.b);injected.set(a,[(injected.get(a)?.[0]||0)+s.value,0]);injected.set(b,[(injected.get(b)?.[0]||0)-s.value,0]);Object.assign(add(c,s.a,s.b,1e10,'current-source'),{source:s})}
  }
  let voltages=solveGraph(branches,fixed);const signedCurrent=(b,v)=>{if(b.a===b.b)return [0,0];const a=v.get(b.a)||[0,0],z=v.get(b.b)||[0,0],vr=a[0]-z[0],vi=a[1]-z[1];if(b.role==='diode')return [Math.max(0,(vr-(b.drop||.7))/b.r),0];if(b.y)return [vr*b.y[0]-vi*b.y[1],vr*b.y[1]+vi*b.y[0]];return [vr/b.r,vi/b.r]};const current=(b,v)=>{const i=signedCurrent(b,v);return Math.hypot(i[0],i[1])};

  // SC390/SC393: use the authored 50 Hz 0..4 V unipolar FG waveform
  // as a real source for the native C-history and 1N4148 nodal solve.
  // Exact wires/parts only, no synthetic output or general AC acceptance.
  const clamperScope=/^electronic-component-basics-outline-(040|043)$/.test(
    project?.tutorialLesson?.id||''),
    getClamp=id=>project.components.find(c=>c.id===id),
    clampFg=clamperScope?getClamp('fg1'):null,
    clampC=clamperScope?getClamp('c1'):null,
    clampD=clamperScope?getClamp('d1'):null,
    clampR=clamperScope?getClamp('r1'):null,
    clampMeter=clamperScope?getClamp('v1'):null,
    normalize=s=>s.split('>').sort().join('~'),
    required=["fg1.OUT>c1.1","c1.2>d1.K","d1.A>fg1.GND","c1.2>r1.1","r1.2>fg1.GND","c1.2>v1.1","v1.2>fg1.GND"].map(normalize).sort(),
    observed=clamperScope?project.wires.map(w=>[
      w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p].sort().join('~')).sort():[],
    validClamper=clamperScope&&project.components.length===5&&
      project.wires.length===7&&observed.length===required.length&&
      observed.every((x,i)=>x===required[i])&&
      clampFg?.typeId==='arduino-signal-generator'&&
      clampFg.generatorEnabled===true&&clampFg.generatorWaveform==='sine'&&
      Number(clampFg.generatorFrequency)===50&&
      Number(clampFg.generatorAmplitude)===4&&
      Number(clampFg.generatorOffset)===0&&
      Number(clampFg.generatorPhaseDeg??0)===0&&
      clampC?.typeId==='capacitor'&&
      Math.abs(Number(clampC.capacitance)-1e-6)<1e-13&&
      clampD?.typeId==='1n4148-do35'&&
      byId[clampD.typeId]?.kind==='diode'&&
      clampR?.typeId==='resistor'&&
      Number(clampR.resistance)===100000&&
      clampMeter?.typeId==='meter-voltmeter'&&
      Number.isFinite(now)&&now>=0;
  if(clamperScope){
   if(clampMeter)delete clampMeter._nativeClamperShift;
   if(clampFg)delete clampFg._nativeClamperSource;
  }
  if(validClamper){
   const sourceVoltage=2+2*Math.sin(2*Math.PI*50*now/1000);
   fixed.set(pin(clampFg,'OUT'),[sourceVoltage,0]);
   fixed.set(pin(clampFg,'GND'),[0,0]);
  }

  // Start with each DC diode as a candidate branch. Starting with every diode
  // open leaves the LED anode floating, so a series circuit can never reach
  // the forward-voltage check that would turn the diode on.
  const diodeCandidates=diodes.filter(({c})=>{
   const a=pin(c,'A'),k=pin(c,'K');c._diodeForward=false;
   return !acNodes.has(a)&&!acNodes.has(k);
  }).map(({c,drop})=>{const b=add(c,'A','K',.05,'diode');b.drop=drop;return b});
  // For the two existing LM358P + 1N4148 positive half-wave feedback graphs,
  // the diode must be selected from the powered comparator input, not the
  // pre-opamp initial estimate. Other circuits retain their normal diode model.
  const rectifierId=project?.tutorialLesson?.id;
  let scopedRectifier=rectifierId==='opamp-apps-src-15'||rectifierId==='opamp-apps-outline-043';
  if(scopedRectifier){
   const link=(a,ap,b,bp)=>project.wires.some(w=>
    (w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp)||
    (w.from.c===b&&w.from.p===bp&&w.to.c===a&&w.to.p===ap));
   const required=[['rv1','2','u1','3'],['u1','1','d1','A'],['d1','K','u1','2'],
    ['d1','K','r5','1'],['r5','2','r3','2'],['d1','K','v1','1'],['v1','2','r3','2']];
   if(project.components.length!==8||
      project.wires.length!==(rectifierId==='opamp-apps-src-15'?16:14)||
      diodeCandidates.length!==1||diodeCandidates[0].c.id!=='d1'||
      opamps.length!==2||!required.every(e=>link(...e)))
    scopedRectifier=false;
  }
  let activeDiodes=new Set(diodeCandidates),diodeBias=new Map();
  for(let pass=0;pass<diodeCandidates.length+1;pass++){
   for(const b of diodeCandidates){const i=branches.indexOf(b);if(i>=0)branches.splice(i,1)}
   diodeBias=new Map();
   for(const b of activeDiodes){branches.push(b);const value=b.drop/b.r;diodeBias.set(b.a,[(diodeBias.get(b.a)?.[0]||0)+value,0]);diodeBias.set(b.b,[(diodeBias.get(b.b)?.[0]||0)-value,0])}
   const combined=new Map([...injected].map(([n,v])=>[n,[v[0],v[1]]]));
   for(const [n,v] of diodeBias)combined.set(n,[(combined.get(n)?.[0]||0)+v[0],(combined.get(n)?.[1]||0)+v[1]]);
   const trial=solveGraph(branches,fixed,combined),next=new Set(diodeCandidates.filter(b=>current(b,trial)>1e-9));
   if(next.size===activeDiodes.size&&[...next].every(b=>activeDiodes.has(b))){voltages=trial;break}
   activeDiodes=next;voltages=trial;
  }
  if(scopedRectifier){
   const u=project.components.find(c=>c.id==='u1');
   const ref=project.components.find(c=>c.id==='r3');
   const positive=(voltages.get(pin(u,'3'))||[0,0])[0]-
    (voltages.get(pin(ref,'2'))||[0,0])[0]>1e-3;
   if(positive)activeDiodes.add(diodeCandidates[0]);
   else activeDiodes.delete(diodeCandidates[0]);
  }
  for(const b of diodeCandidates)b.c._diodeForward=activeDiodes.has(b);
  for(const b of diodeCandidates){const i=branches.indexOf(b);if(i>=0)branches.splice(i,1)}
  diodeBias=new Map();
  for(const b of activeDiodes){branches.push(b);const value=b.drop/b.r;diodeBias.set(b.a,[(diodeBias.get(b.a)?.[0]||0)+value,0]);diodeBias.set(b.b,[(diodeBias.get(b.b)?.[0]||0)-value,0])}
  const finalInjection=new Map([...injected].map(([n,v])=>[n,[v[0],v[1]]]));
  for(const [n,v] of diodeBias)finalInjection.set(n,[(finalInjection.get(n)?.[0]||0)+v[0],(finalInjection.get(n)?.[1]||0)+v[1]]);
  voltages=solveGraph(branches,fixed,finalInjection);
  for(const b of cts){const visited=new Set(),q=[b.a,b.b];while(q.length){const n=q.pop();if(visited.has(n))continue;visited.add(n);for(const edge of branches){if(edge.a===n)q.push(edge.b);if(edge.b===n)q.push(edge.a)}}const c=b.c,isAC=[...visited].some(n=>acNodes.has(n))&&![...visited].some(n=>dcNodes.has(n));c._primaryCurrent=isAC?current(b,voltages):0;c._secondaryCurrent=c._primaryCurrent*(Number(c.ctSecondary)||5)/(Number(c.ctPrimary)||100);const a=pin(c,'S1'),z=pin(c,'S2');injected.set(a,[(injected.get(a)?.[0]||0)+c._secondaryCurrent,0]);injected.set(z,[(injected.get(z)?.[0]||0)-c._secondaryCurrent,0]);c._currentModel='Dirençli AC yük modeli';}
  const solveSecondary=()=>{const combined=new Map([...injected].map(([n,v])=>[n,[v[0],v[1]]]));for(const [n,v] of diodeBias)combined.set(n,[(combined.get(n)?.[0]||0)+v[0],(combined.get(n)?.[1]||0)+v[1]]);return solveGraph(branches,fixed,combined)};
  let secondary=solveSecondary();
  for(const b of branches.filter(b=>b.role==='current-source')){const a=secondary.get(b.a)||[0,0],z=secondary.get(b.b)||[0,0],v=Math.abs(a[0]-z[0]);const limit=b.source.compliance||24;if(v>limit){const s=b.source,delta=s.value*(1-limit/v);injected.set(b.a,[(injected.get(b.a)?.[0]||0)-delta,0]);injected.set(b.b,[(injected.get(b.b)?.[0]||0)+delta,0]);if(b.c._instrument)b.c._instrument.loadWarning='Çıkış yükü / açık döngü: gerilim sınırı';secondary=solveSecondary()}}
  if(opamps.length){
   let guess=secondary;
   const addCurrent=(map,a,b,v)=>{const av=map.get(a)||[0,0],bv=map.get(b)||[0,0];map.set(a,[av[0]+v,av[1]]);map.set(b,[bv[0]-v,bv[1]])};
   for(let iter=0;iter<30;iter++){
    const work=new Map([...injected].map(([k,v])=>[k,[v[0],v[1]]]));let change=0;
    // The forward-drop Norton current belongs to the op-amp feedback solve.
    if(scopedRectifier)for(const [n,v] of diodeBias)
     work.set(n,[(work.get(n)?.[0]||0)+v[0],(work.get(n)?.[1]||0)+v[1]]);
    for(const o of opamps){
     const val=n=>(guess.get(n)||[0,0])[0],lo=val(o.vm),hi=val(o.vp),vp=val(o.ip),vm=val(o.im),ch=o.channel||'main';
     const channels=o.c._opampChannels||(o.c._opampChannels={}),cs=channels[ch]||(channels[ch]={});
     if(!(hi>lo+.5)){cs.powered=false;cs.output=lo;cs.diff=vp-vm;if(!o.channel){o.c._opampPowered=false;o.c._opampOutput=lo;o.c._opampDiff=vp-vm}continue}
     // SC377: seed the positive-feedback Schmitt from its last powered output.
     // A passive-only warm start loses the high branch during a falling sweep.
     const schmitt=project?.tutorialLesson?.id==='opamp-apps-outline-044'&&
       project.wires.length===16&&o.c.id==='u1'&&o.c.typeId==='lm358p-dip8'&&ch==='1'&&
       project.wires.some(w=>w.from?.c==='u1'&&w.from?.p==='1'&&w.to?.c==='r2'&&w.to?.p==='1')&&
       project.wires.some(w=>w.from?.c==='r2'&&w.from?.p==='2'&&w.to?.c==='u1'&&w.to?.p==='3');
     const seed=schmitt&&cs.powered&&Number.isFinite(cs.output)?cs.output:val(o.out);
     const prev=Number.isFinite(cs.iter)?cs.iter:Math.max(lo+.02,Math.min(hi-1.5,seed));
     const wanted=Math.max(lo+.02,Math.min(hi-1.5,lo+o.gain*(vp-vm))),target=prev+(wanted-prev)*.12;
     cs.iter=target;cs.powered=true;cs.diff=vp-vm;o.c._opampPowered=true;if(!o.channel)o.c._opampDiff=vp-vm;addCurrent(work,o.out,o.vm,target/o.br.r);
    }
    const next=solveGraph(branches,fixed,work);
    for(const o of opamps){const a=(next.get(o.out)||[0,0])[0],b=(guess.get(o.out)||[0,0])[0],ch=o.channel||'main',cs=o.c._opampChannels?.[ch]||(o.c._opampChannels[ch]={});change=Math.max(change,Math.abs(a-b));cs.output=a;if(!o.channel)o.c._opampOutput=a}
    guess=next;if(change<1e-4)break;
   }
   // SC366–369 (virtual only): solve the two-input LM358 negative-feedback
   // condition directly from its linear nodal response. The global LM358,
   // protected oscillator and other op-amp solvers retain their old path.

   // Scoped dual-input native DC solve: exact 24 V DIP8 wiring,
   // two 10-kOhm controls, physical spare-B termination and real UNI-T probes.
   const dualInputId=project?.tutorialLesson?.id||'',
     isDiff=/^opamp-apps-outline-03[56]$/.test(dualInputId),
     isSum=/^opamp-apps-outline-03[78]$/.test(dualInputId),
     expectedWires=isDiff?21:isSum?20:0,
     expectedParts=isDiff?13:isSum?12:0,
     required=[...(isDiff?["g1.P>u1.8","g1.M>u1.4","in.1>g1.P","in.3>g1.M","g1.P>ref1.1","ref1.2>ref2.1","ref2.2>g1.M","in.2>r1.1","r1.2>u1.2","u1.1>r2.1","r2.2>u1.2","v1.V>v1-red.PLUG","v1.COM>v1-black.PLUG","in2.1>g1.P","in2.3>g1.M","in2.2>r5.1","r5.2>u1.3","ref1.2>r6.1","r6.2>u1.3"]:["g1.P>u1.8","g1.M>u1.4","in.1>g1.P","in.3>g1.M","g1.P>ref1.1","ref1.2>ref2.1","ref2.2>g1.M","ref1.2>u1.3","in.2>r1.1","r1.2>u1.2","u1.1>r2.1","r2.2>u1.2","v1.V>v1-red.PLUG","v1.COM>v1-black.PLUG","in2.1>g1.P","in2.3>g1.M","in2.2>r5.1","r5.2>u1.2"]),
       'u1.5>g1.M','u1.7>u1.6'],
     normal=x=>x.split('>').sort().join('~'),
     wanted=required.map(normal).sort(),
     actual=project.wires.map(w=>[w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p].sort().join('~')).sort(),
     get=id=>project.components.find(c=>c.id===id),
     exact=expectedWires&&project.wires.length===expectedWires&&
       project.components.length===expectedParts&&actual.length===wanted.length&&
       actual.every((x,i)=>x===wanted[i])&&
       opamps.length===2&&opamps.every(o=>o.c===get('u1')&&o.c.typeId==='lm358p-dip8')&&
       get('g1')?.typeId==='arduino-bench-supply'&&Number(get('g1')?.dcVoltage)===24&&
       ['in','in2'].every(id=>get(id)?.typeId==='potentiometer'&&Number(get(id)?.potMax)===10000)&&
       ['r1','r2','r5','ref1','ref2',...(isDiff?['r6']:[])].every(id=>
         get(id)?.typeId==='resistor'&&Number(get(id)?.resistance)===10000)&&
       get('v1')?.typeId==='unit-ut33d-plus'&&get('v1')?.meterPosition===4&&
       get('v1-red')?.probeTarget?.c==='u1'&&get('v1-red')?.probeTarget?.p==='1'&&
       get('v1-black')?.probeTarget?.c==='g1'&&get('v1-black')?.probeTarget?.p==='M';
   if(expectedWires){
    if(get('u1'))delete get('u1')._nativeTwoInputDC;
    if(get('v1'))delete get('v1')._nativeTwoInputDC;
   }
   if(exact){
     const amp=opamps.find(o=>o.channel==='1'),
       spare=opamps.find(o=>o.channel==='7'),
       v=(state,node)=>(state.get(node)||[0,0])[0],
       spareTarget=Number(spare?.c._opampChannels?.['7']?.iter),
       spareDrive=Number.isFinite(spareTarget)?spareTarget/spare.br.r:0,
       drive=(amps)=>{
         const work=new Map([...injected].map(([n,x])=>[n,[x[0],x[1]]]));
         if(spare) addCurrent(work,spare.out,spare.vm,spareDrive);
         addCurrent(work,amp.out,amp.vm,amps);
         return solveGraph(branches,fixed,work);
       };
     const base=drive(0),unit=drive(1),
       diff0=v(base,amp.ip)-v(base,amp.im),
       diffSlope=v(unit,amp.ip)-v(unit,amp.im)-diff0,
       low=v(base,amp.vm),high=v(base,amp.vp),
       divisor=amp.br.r-amp.gain*diffSlope;
     if(high>low+.5&&Number.isFinite(divisor)&&divisor>1e-8){
       const target=Math.max(low+.02,Math.min(high-1.5,
         amp.br.r*(low+amp.gain*diff0)/divisor));
       if(Number.isFinite(target)){
         guess=drive(target/amp.br.r);
         const active=amp.c._opampChannels?.['1'];
         if(active){active.iter=target;active.output=v(guess,amp.out);
           active.diff=v(guess,amp.ip)-v(guess,amp.im)}
         amp.c._opampOutput=v(guess,amp.out);
         amp.c._opampDiff=v(guess,amp.ip)-v(guess,amp.im);
         const idle=spare?.c._opampChannels?.['7'];
         if(idle){idle.output=v(guess,spare.out);
           idle.diff=v(guess,spare.ip)-v(guess,spare.im)}

         const meter=get('v1'),
          data={model:isDiff?'native-wired-LM358-DIP8-difference-ideal-DC':
           'native-wired-LM358-DIP8-inverting-summer-ideal-DC',
           inputAV:v(guess,pin(get('in'),'2'))-v(guess,amp.vm),
           inputBV:v(guess,pin(get('in2'),'2'))-v(guess,amp.vm),
           referenceV:v(guess,pin(get('ref1'),'2'))-v(guess,amp.vm),
           outputV:v(guess,amp.out)-v(guess,amp.vm),
           actualRedProbe:'u1/1',actualBlackProbe:'g1/M',
           idealEducationalModel:true,physicalAcceptance:false,
           manufacturerLimitsAccepted:false,calibratedMeter:false};
         amp.c._nativeTwoInputDC=data;if(meter)meter._nativeTwoInputDC={...data};
       }
     }
   }
   secondary=guess;


   // SC377: only the exact physical DIP8 Schmitt may have stateful ideal
   // DC threshold acceptance. Use the real resistive nodal solve, not a
   // fabricated output waveform. Full LM358/AC acceptance stays pending.
   {
    if(project?.tutorialLesson?.id==='opamp-apps-outline-044'){
     const get=id=>project.components.find(c=>c.id===id),op=get('u1'),g=get('g1'),
      meter=get('v1'),pot=get('in'),amp=opamps.find(o=>o.c===op&&o.channel==='1'),
      spare=opamps.find(o=>o.c===op&&o.channel==='7'),
      norm=s=>s.split('>').sort().join('~'),
      expected=["g1.P>u1.8","g1.M>u1.4","in.1>g1.P","in.3>g1.M","g1.P>ref1.1","ref1.2>ref2.1","ref2.2>g1.M","ref1.2>u1.2","in.2>r1.1","r1.2>u1.3","u1.1>r2.1","r2.2>u1.3","v1.V>v1-red.PLUG","v1.COM>v1-black.PLUG","u1.5>g1.M","u1.7>u1.6"].map(norm).sort(),
      actual=project.wires.map(w=>[w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p].sort().join('~')).sort();
     if(op){delete op._nativeDip8Schmitt;if(options.reset)delete op._nativeDip8SchmittHigh;}
     if(meter)delete meter._nativeDip8Schmitt;
     const valid=project.components.length===10&&project.wires.length===16&&
      actual.length===expected.length&&actual.every((s,i)=>s===expected[i])&&
      op?.typeId==='lm358p-dip8'&&g?.typeId==='arduino-bench-supply'&&
      Number(g.dcVoltage)===24&&pot?.typeId==='potentiometer'&&
      Number(pot.potMax)===10000&&Number.isFinite(Number(pot.potentiometer))&&
      Number(pot.potentiometer)>=0&&Number(pot.potentiometer)<=100&&
      ['r1','ref1','ref2'].every(id=>get(id)?.typeId==='resistor'&&
       Number(get(id).resistance)===10000)&&get('r2')?.typeId==='resistor'&&
      Number(get('r2').resistance)===47000&&
      meter?.typeId==='unit-ut33d-plus'&&meter.meterPosition===4&&
      get('v1-red')?.probeTarget?.c==='u1'&&get('v1-red')?.probeTarget?.p==='1'&&
      get('v1-black')?.probeTarget?.c==='g1'&&get('v1-black')?.probeTarget?.p==='M'&&
      opamps.length===2&&amp&&spare;
     if(!valid){if(op)delete op._nativeDip8SchmittHigh;}
     else{
      const v=(m,n)=>m.get(n)?.[0]??0,zero=v(secondary,amp.vm),
       top=v(secondary,amp.vp),range=top-zero;
      if(range>=5&&range<=24.1){
       const low=zero+.02,high=top-2,wasHigh=op._nativeDip8SchmittHigh===true,
        solve=state=>solveGraph(branches,
         new Map([...fixed,[amp.out,[state?high:low,0]]]),injected),
        previous=solve(wasHigh),
        nextHigh=v(previous,amp.ip)>=v(previous,amp.im),
        next=solve(nextHigh),
        input=v(next,pin(pot,'2'))-zero,
        reference=v(next,amp.im)-zero,
        plus=v(next,amp.ip)-zero,
        output=v(next,amp.out)-zero,
        ratio=Number(get('r1').resistance)/Number(get('r2').resistance),
        rising=reference*(1+ratio)-(low-zero)*ratio,
        falling=reference*(1+ratio)-(high-zero)*ratio;
       if([input,reference,plus,output,rising,falling].every(Number.isFinite)&&
        high>low+2&&rising>falling&&falling>0&&rising<range){
        secondary=next;
        const data={model:'native-source-exact-ideal-DIP8-Schmitt-DC',
         high:nextHigh,outputV:output,inputWiperV:input,
         nonInvertingV:plus,referenceV:reference,
         risingInputNodeV:rising,fallingInputNodeV:falling,
         idealHysteresisWidthV:rising-falling,
         potWiperLoadingIncluded:true,idealEducationalModel:true,
         physicalAcceptance:false,manufacturerLimitsAccepted:false,
         calibratedMeter:false,acWaveformAccepted:false};
        const ch=op._opampChannels?.['1'];
        if(ch){ch.output=output;ch.diff=plus-reference}
        op._opampOutput=output;
        if(!options.sampleOnly){
         op._nativeDip8Schmitt=data;meter._nativeDip8Schmitt={...data};
         op._nativeDip8SchmittHigh=nextHigh;
        }
       }else delete op._nativeDip8SchmittHigh;
      }else delete op._nativeDip8SchmittHigh;
     }
    }
   }


   // SC65 only: preserve Schmitt history on its 14-wire physical-pin LM358P
   // positive-feedback network. This ideal nodal DC state is not calibrated
   // LM358 hardware, frequency response or physical/Windows acceptance.
   {
    if(project?.tutorialLesson?.id==='oscillator-filter-apps-src-13'){
     const get=id=>project.components.find(c=>c.id===id),
      op=get('u1'),g=get('g1'),pot=get('in'),meter=get('v1'),
      amp=opamps.find(x=>x.c===op&&x.channel==='1'),
      norm=s=>s.split('>').sort().join('~'),
      expected=[
       'g1.P>u1.8','g1.M>u1.4','v1.1>u1.1','v1.2>g1.M',
       'in.1>g1.P','in.3>g1.M','g1.P>ref1.1','ref1.2>ref2.1',
       'ref2.2>g1.M','ref1.2>u1.2','in.2>r1.1','r1.2>u1.3',
       'u1.1>r2.1','r2.2>u1.3'].map(norm).sort(),
      actual=project.wires.map(w=>
       [w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p].sort().join('~')).sort(),
      valid=project.components.length===8&&actual.length===expected.length&&
       actual.every((edge,i)=>edge===expected[i])&&
       g?.typeId==='supply-dc-plus'&&op?.typeId==='lm358p-dip8'&&
       meter?.typeId==='meter-voltmeter'&&pot?.typeId==='potentiometer'&&
       Number(pot.potMax)===10000&&Number.isFinite(Number(pot.potentiometer))&&
       Number(pot.potentiometer)>=0&&Number(pot.potentiometer)<=100&&
       ['r1','ref1','ref2'].every(id=>get(id)?.typeId==='resistor'&&
        Number(get(id).resistance)===10000)&&
       get('r2')?.typeId==='resistor'&&Number(get('r2').resistance)===47000&&
       amp&&opamps.length===2;
     if(op){delete op._nativeSc65Schmitt;if(options.reset)delete op._nativeSc65SchmittHigh}
     if(meter)delete meter._nativeSc65Schmitt;
     if(!valid){if(op)delete op._nativeSc65SchmittHigh}
     else{
      const v=(m,n)=>m.get(n)?.[0]??0,zero=v(secondary,amp.vm),
       top=v(secondary,amp.vp),span=top-zero;
      if(span>=5&&span<=24.1){
       const low=zero+.02,high=top-2,wasHigh=op._nativeSc65SchmittHigh===true,
        withOutput=state=>solveGraph(branches,
         new Map([...fixed,[amp.out,[state?high:low,0]]]),injected),
        prev=withOutput(wasHigh),
        nextHigh=v(prev,amp.ip)>=v(prev,amp.im),
        next=withOutput(nextHigh),
        input=v(next,pin(pot,'2'))-zero,ref=v(next,amp.im)-zero,
        plus=v(next,amp.ip)-zero,output=v(next,amp.out)-zero,
        ratio=Number(get('r1').resistance)/Number(get('r2').resistance),
        rising=ref*(1+ratio)-(low-zero)*ratio,
        falling=ref*(1+ratio)-(high-zero)*ratio;
       if([input,ref,plus,output,rising,falling].every(Number.isFinite)&&
          high>low+2&&rising>falling&&falling>0&&rising<span){
        secondary=next;
        const evidence={model:'native-source-exact-ideal-SC65-Schmitt-DC',
         high:nextHigh,outputV:output,inputWiperV:input,
         nonInvertingV:plus,referenceV:ref,
         risingInputNodeV:rising,fallingInputNodeV:falling,
         idealHysteresisWidthV:rising-falling,
         potWiperLoadingIncluded:true,idealEducationalModel:true,
         physicalAcceptance:false,manufacturerLimitsAccepted:false,
         calibratedMeter:false,acWaveformAccepted:false};
        const channel=op._opampChannels?.['1'];
        if(channel){channel.output=output;channel.diff=plus-ref}
        op._opampOutput=output;
        if(!options.sampleOnly){
         op._nativeSc65Schmitt=evidence;
         meter._nativeSc65Schmitt={...evidence};
         op._nativeSc65SchmittHigh=nextHigh;
        }
       }else delete op._nativeSc65SchmittHigh;
      }else delete op._nativeSc65SchmittHigh;
     }
    }
   }

   // Source-exact SC370–373 feedback solve on the EXISTING RC backward-Euler
   // circuit, not a synthetic waveform. No AC/hardware acceptance inferred.
   {
    const lid=project?.tutorialLesson?.id||'',
     scope=lid.match(/^opamp-apps-outline-(039|040|041|042)$/);
    if(scope){
     const derivative=scope[1]==='039'||scope[1]==='040',
      get=id=>project.components.find(c=>c.id===id),
      op=get('u1'),cap=get('c1'),meter=get('v1'),
      r=get(derivative?'r2':'r1'),pot=get('in'),
      amplifier=opamps.find(o=>o.c===op&&o.channel==='1'),
      spare=opamps.find(o=>o.c===op&&o.channel==='7'),
      links=[...["g1.P>u1.8","g1.M>u1.4","in.1>g1.P","in.3>g1.M","g1.P>ref1.1","ref1.2>ref2.1","ref2.2>g1.M","ref1.2>u1.3","v1.V>v1-red.PLUG","v1.COM>v1-black.PLUG"],...(derivative?["in.2>c1.1","c1.2>u1.2","u1.1>r2.1","r2.2>u1.2"]:["in.2>r1.1","r1.2>u1.2","u1.1>c1.1","c1.2>u1.2"]),
       'u1.5>g1.M','u1.7>u1.6'],
      norm=s=>s.split('>').sort().join('~'),
      intended=links.map(norm).sort(),
      actual=project.wires.map(w=>[w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p].sort().join('~')).sort(),
      cb=reactive.find(x=>x.c===cap&&x.role==='capacitor-dc');
     if(op)delete op._nativeRcStep;
     if(meter)delete meter._nativeRcStep;
     const valid=project.wires.length===16&&project.components.length===10&&
      actual.length===intended.length&&actual.every((w,i)=>w===intended[i])&&
      op?.typeId==='lm358p-dip8'&&get('g1')?.typeId==='arduino-bench-supply'&&
      Number(get('g1')?.dcVoltage)===24&&pot?.typeId==='potentiometer'&&
      Number(pot.potMax)===10000&&Number.isFinite(Number(pot.potentiometer))&&
      Number(pot.potentiometer)>=0&&Number(pot.potentiometer)<=100&&
      cap?.typeId==='capacitor'&&
      Math.abs(Number(cap.capacitance)-(derivative?1e-7:1e-6))<1e-13&&
      r?.typeId==='resistor'&&Number(r.resistance)===(derivative?47000:10000)&&
      ['ref1','ref2'].every(x=>get(x)?.typeId==='resistor'&&Number(get(x).resistance)===10000)&&
      meter?.typeId==='unit-ut33d-plus'&&meter.meterPosition===4&&
      get('v1-red')?.probeTarget?.c==='u1'&&get('v1-red')?.probeTarget?.p==='1'&&
      get('v1-black')?.probeTarget?.c==='g1'&&get('v1-black')?.probeTarget?.p==='M'&&
      opamps.length===2&&amplifier&&spare&&cb&&
      Number.isFinite(cb.previous)&&Number.isFinite(cb.dt)&&
      cb.dt>=.001&&cb.dt<=.25;
     if(valid){
      const v=(m,n)=>m.get(n)?.[0]??0,
       low=v(secondary,amplifier.vm),high=v(secondary,amplifier.vp),
       add=(m,a,b,i)=>{
        const av=m.get(a)||[0,0],bv=m.get(b)||[0,0];
        m.set(a,[av[0]+i,av[1]]);m.set(b,[bv[0]-i,bv[1]]);
       },drive=t=>{
        const work=new Map([...injected].map(([k,x])=>[k,[...x]]));
        add(work,amplifier.out,amplifier.vm,t/amplifier.br.r);
        add(work,spare.out,spare.vm,(low+.02)/spare.br.r);
        return solveGraph(branches,fixed,work);
       },error=m=>v(m,amplifier.out)-low-
        amplifier.gain*(v(m,amplifier.ip)-v(m,amplifier.im)),
       base=drive(0),unit=drive(1),slope=error(unit)-error(base);
      if(high-low>5&&high-low<=24.1&&Number.isFinite(slope)&&Math.abs(slope)>1e-9){
       const raw=-error(base)/slope,target=Math.max(low+.02,Math.min(high-2,raw));
       if(Number.isFinite(raw)&&Number.isFinite(target)){
        secondary=drive(target);
        const out=v(secondary,amplifier.out)-low,
         result={model:derivative?'native-wired-ideal-LM358P-differentiator-DC-step':
           'native-wired-ideal-LM358P-integrator-DC-ramp',
          inputV:v(secondary,pin(pot,'2'))-low,
          referenceV:v(secondary,amplifier.ip)-low,
          outputV:out,capacitorPreviousV:cb.previous,
          capacitorVoltageV:v(secondary,cb.a)-v(secondary,cb.b),
          stepSeconds:cb.dt,resistanceOhms:Number(r.resistance),
          capacitanceFarads:Number(cap.capacitance),
          railLimited:raw<low+.02||raw>high-2,
          actualRedProbe:'u1/1',actualBlackProbe:'g1/M',
          idealEducationalModel:true,physicalAcceptance:false,
          manufacturerLimitsAccepted:false,acWaveformAccepted:false,
          calibratedMeter:false};
        const ch=op._opampChannels?.['1'];
        if(ch){ch.output=out;ch.diff=v(secondary,amplifier.ip)-v(secondary,amplifier.im)}
        op._opampOutput=out;
        if(!options.sampleOnly){
         op._nativeRcStep=result;meter._nativeRcStep={...result};
        }
       }
      }
     }
    }
   }

   // Only four complete LM358P DIP-8 feedback circuits: exact terminal topology,
   // real resistor values and probes; bounded ideal DC gain, no hardware claim.
   {
    const found=(project?.tutorialLesson?.id||'').match(/^opamp-apps-outline-(023|025|026|028)$/);
    if(found){
     const inv=found[1]==='023'||found[1]==='025',get=id=>project.components.find(c=>c.id===id),
      op=get('u1'),meter=get('v1'),red=get('v1-red'),black=get('v1-black'),
      parts=inv?[['g1','arduino-bench-supply'],['u1','lm358p-dip8'],['in','potentiometer'],
       ['r1','resistor'],['r2','resistor'],['v1','unit-ut33d-plus'],['ref1','resistor'],
       ['ref2','resistor'],['v1-red','test-probe-red'],['v1-black','test-probe-black']]:
       [['g1','arduino-bench-supply'],['u1','lm358p-dip8'],['in','potentiometer'],
        ['r1','resistor'],['r2','resistor'],['v1','unit-ut33d-plus'],
        ['v1-red','test-probe-red'],['v1-black','test-probe-black'],['rs','resistor']],
      common=['g1.P>u1.8','g1.M>u1.4','in.3>g1.M','u1.1>r2.1','r2.2>u1.2',
        'v1.V>v1-red.PLUG','v1.COM>v1-black.PLUG','u1.5>g1.M','u1.7>u1.6'],
      extra=inv?['in.1>g1.P','g1.P>ref1.1','ref1.2>ref2.1','ref2.2>g1.M',
        'ref1.2>u1.3','in.2>r1.1','r1.2>u1.2']:
       ['g1.P>rs.1','rs.2>in.1','in.2>u1.3','u1.2>r1.1','r1.2>g1.M'],
      normal=x=>x.split('>').sort().join('~'),
      wanted=[...common,...extra].map(normal).sort(),
      observed=project.wires.map(w=>[w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p].sort().join('~')).sort(),
      amp=opamps.find(o=>o.c===op&&o.channel==='1'),
      spare=opamps.find(o=>o.c===op&&o.channel==='7');
     if(op)delete op._nativeOpampGainDc;
     if(meter)delete meter._nativeOpampGainDc;
     if(observed.length===wanted.length&&observed.every((e,i)=>e===wanted[i])&&
      project.components.length===parts.length&&
      parts.every(([n,t])=>get(n)?.typeId===t)&&
      Number(get('g1')?.dcVoltage)===24&&Number(get('in')?.potMax)===10000&&
      Number.isFinite(Number(get('in')?.potentiometer))&&
      Number(get('in').potentiometer)>=0&&Number(get('in').potentiometer)<=100&&
      Number(get('r1')?.resistance)===10000&&Number(get('r2')?.resistance)===47000&&
      (!inv||[get('ref1'),get('ref2')].every(c=>Number(c?.resistance)===10000))&&
      (inv||Number(get('rs')?.resistance)===47000)&&
      red?.probeTarget?.c==='u1'&&red?.probeTarget?.p==='1'&&
      black?.probeTarget?.c==='g1'&&black?.probeTarget?.p==='M'&&
      meter?.meterPosition===4&&amp&&spare&&opamps.length===2){
      const val=(m,n)=>m.get(n)?.[0]??0,lo=val(secondary,amp.vm),
       hi=val(secondary,amp.vp),
       add=(work,a,b,x)=>{
        const av=work.get(a)||[0,0],bv=work.get(b)||[0,0];
        work.set(a,[av[0]+x,av[1]]);work.set(b,[bv[0]-x,bv[1]]);
       },
       solve=target=>{
        const work=new Map([...injected].map(([n,v])=>[n,[...v]]));
        add(work,amp.out,amp.vm,target/amp.br.r);
        add(work,spare.out,spare.vm,(lo+.02)/spare.br.r);
        return solveGraph(branches,fixed,work);
       },
       mismatch=s=>val(s,amp.out)-val(s,amp.vm)-
         amp.gain*(val(s,amp.ip)-val(s,amp.im)),
       baseline=solve(0),unit=solve(1),slope=mismatch(unit)-mismatch(baseline);
      if(hi>lo+5&&hi-lo<=24.1&&Number.isFinite(slope)&&Math.abs(slope)>1e-8){
       const targetRaw=-mismatch(baseline)/slope,
        target=Math.max(lo+.02,Math.min(hi-2,targetRaw));
       if(Number.isFinite(targetRaw)&&Number.isFinite(target)){
        secondary=solve(target);
        const input=val(secondary,pin(get('in'),'2')),
         plus=val(secondary,amp.ip),minus=val(secondary,amp.im),
         out=val(secondary,amp.out),ground=val(secondary,pin(get('g1'),'M')),
         info={model:inv?'native-wired-ideal-LM358-DIP8-inverting-DC':
            'native-wired-ideal-LM358-DIP8-noninverting-DC',
          inputV:input-ground,referenceV:plus-ground,outputV:out-ground,
          idealGain:inv?-4.7:5.7,potPercent:Number(get('in').potentiometer),
          linearRange:targetRaw>=lo+.02&&targetRaw<=hi-2,
          actualRedProbe:'u1/1',actualBlackProbe:'g1/M',
          idealEducationalModel:true,physicalAcceptance:false,
          manufacturerLimitsAccepted:false,calibratedMeter:false};
        const ch=op._opampChannels?.['1'];if(ch){ch.output=out;ch.diff=plus-minus}
        op._opampOutput=out;
        const b=op._opampChannels?.['7'];if(b){
         b.output=val(secondary,spare.out);
         b.diff=val(secondary,spare.ip)-val(secondary,spare.im)}
        op._nativeOpampGainDc=info;meter._nativeOpampGainDc={...info};
       }
      }
     }
    }
   }
   // These virtual LM358 lessons use a Norton drive (target/Ro) parallel to
   // Ro. The resistor branch current is not the external output/load current.
   // Do not change the accepted solver or readings outside this teaching scope.
   const virtualLm358Lesson=/^opamp-apps-outline-(?:02[1-9]|03[0-9]|04[0-4])$/.test(project?.tutorialLesson?.id||'')||
     ['sensor-analog-apps-outline-054','sensor-analog-apps-outline-055'].includes(project?.tutorialLesson?.id);
   for(const o of opamps){
    const ch=o.channel||'main',cs=o.c._opampChannels?.[ch];
    const branchAmps=((secondary.get(o.out)||[0,0])[0]-(secondary.get(o.vm)||[0,0])[0])/o.br.r;
    const amps=virtualLm358Lesson&&Number.isFinite(cs?.iter)?
      Math.abs(cs.iter/o.br.r-branchAmps):Math.abs(branchAmps);
    if(cs){cs.current=amps;delete cs.iter}
    o.c._currentValue=Math.max(Number(o.c._currentValue)||0,amps);
   }
  }

  // SC076/SC077: solve the actual LM358P dual channels for either the
  // non-inverting preamp or the buffered-VREF mixer. Both native
  // dependent source outputs are solved together in the real nodal graph.
  {
    const wired=(c,p,d,q)=>project.wires.some(w=>
      (w.from?.c===c&&w.from?.p===p&&w.to?.c===d&&w.to?.p===q)||
      (w.to?.c===c&&w.to?.p===p&&w.from?.c===d&&w.from?.p===q));
    const sc77=project?.tutorialLesson?.id==='oscillator-filter-apps-src-25'&&
      project.components.length===14&&project.wires.length===24&&
      opamps.length===2&&opamps.every(o=>o.c.id==='u1'&&o.c.typeId==='lm358p-dip8')&&
      wired('rv1','1','u1','7')&&wired('rv2','1','u1','7')&&
      wired('u1','7','u1','3')&&wired('u1','5','refHi','2')&&
      wired('u1','7','u1','6')&&wired('u1','1','rf','1')&&
      wired('rf','2','u1','2')&&
      ['fg1','fg2'].every(id=>project.components.some(c=>c.id===id&&
        c.typeId==='arduino-signal-generator'&&c.generatorWaveform==='sine'));
    const sc76=project?.tutorialLesson?.id==='oscillator-filter-apps-src-24'&&
      project.components.length===10&&project.wires.length===18&&
      opamps.length===2&&opamps.every(o=>o.c.id==='u1'&&o.c.typeId==='lm358p-dip8')&&
      wired('fg1','OUT','c1','1')&&wired('c1','2','u1','3')&&
      wired('refHi','2','rb','1')&&wired('rb','2','u1','3')&&
      wired('u1','1','rf','1')&&wired('rf','2','u1','2')&&
      wired('u1','2','rg','1')&&wired('rg','2','refHi','2')&&
      wired('u1','5','g1','M')&&wired('u1','7','u1','6')&&
      project.components.some(c=>c.id==='fg1'&&
        c.typeId==='arduino-signal-generator'&&c.generatorWaveform==='sine');
    const scoped=sc77||sc76;
    if(scoped){
      const a=opamps.find(o=>o.channel==='1'),b=opamps.find(o=>o.channel==='7');
      const get=(v,n)=>v.get(n)||[0,0],addC=(x,y)=>[x[0]+y[0],x[1]+y[1]],
        neg=x=>[-x[0],-x[1]],sub=(x,y)=>[x[0]-y[0],x[1]-y[1]],
        mul=(x,y)=>[x[0]*y[0]-x[1]*y[1],x[0]*y[1]+x[1]*y[0]],
        div=(x,y)=>{const d=y[0]*y[0]+y[1]*y[1];return d>1e-24?
          [(x[0]*y[0]+x[1]*y[1])/d,(x[1]*y[0]-x[0]*y[1])/d]:null};
      if(a&&b){
        const lo=get(secondary,a.vm)[0],hi=get(secondary,a.vp)[0];
        if(hi>lo+.5){
          const solvePair=(sourceBranches,sourceFixed,external,drivers)=>{
            const injection=new Map([...external].map(([k,v])=>[k,[...v]]));
            for(const [op,driver] of [[a,drivers[0]],[b,drivers[1]]]){
              for(const [node,sign] of [[op.out,1],[op.vm,-1]]){
                const prior=injection.get(node)||[0,0];
                injection.set(node,addC(prior,[sign*driver[0]/op.br.r,
                  sign*driver[1]/op.br.r]));
              }
            }
            return solveGraph(sourceBranches,sourceFixed,injection);
          };
          const solveDrivers=(sourceBranches,sourceFixed,external)=>{
            const evaluate=(da,db)=>{
              const v=solvePair(sourceBranches,sourceFixed,external,[da,db]);
              return [a,b].map(op=>sub(
                sub(get(v,op.out),get(v,op.vm)),
                mul([op.gain,0],sub(get(v,op.ip),get(v,op.im)))));
            };
            const zero=[0,0],unit=[1,0],f0=evaluate(zero,zero),
              fA=evaluate(unit,zero),fB=evaluate(zero,unit);
            const m11=sub(fA[0],f0[0]),m12=sub(fB[0],f0[0]),
              m21=sub(fA[1],f0[1]),m22=sub(fB[1],f0[1]),
              determinant=sub(mul(m11,m22),mul(m12,m21));
            const da=div(sub(mul(neg(f0[0]),m22),mul(m12,neg(f0[1]))),determinant),
              db=div(sub(mul(m11,neg(f0[1])),mul(neg(f0[0]),m21)),determinant);
            return da&&db&&[...da,...db].every(Number.isFinite)?[da,db]:null;
          };
          const dcInjection=new Map([...injected].map(([k,v])=>[k,[...v]]));
          for(const [node,current] of diodeBias)
            dcInjection.set(node,addC(dcInjection.get(node)||[0,0],current));
          const dcDriver=solveDrivers(branches,fixed,dcInjection);
          if(dcDriver){
            const clamped=dcDriver.map(d=>[Math.max(lo+.02,Math.min(hi-1.5,d[0])),0]);
            secondary=solvePair(branches,fixed,dcInjection,clamped);
            const baseline=get(secondary,a.out)[0],contributions=[];
            const calc=(first,other)=>{
              const f=Math.max(.01,Math.min(20000,Number(first.generatorFrequency)||1000)),
                amplitude=first.generatorEnabled===false?0:
                  Math.max(0,Math.min(5,Number(first.generatorAmplitude)||0))/2;
              if(!amplitude)return null;
              const harmonicBranches=branches.map(br=>br.role==='capacitor-dc'?
                {...br,y:[0,2*Math.PI*f*br.value]}:br);
              const harmonicFixed=new Map([...fixed].map(([node])=>[node,[0,0]]));
              harmonicFixed.set(pin(first,'OUT'),[0,-amplitude]);
              if(other)harmonicFixed.set(pin(other,'OUT'),[0,0]);
              const harmonicDrivers=solveDrivers(harmonicBranches,harmonicFixed,new Map());
              if(!harmonicDrivers)return null;
              const harmonic=solvePair(harmonicBranches,harmonicFixed,new Map(),harmonicDrivers),
                phasor=get(harmonic,a.out);
              if(!phasor.every(Number.isFinite))return null;
              const phase=2*Math.PI*f*now/1000+
                (Number(first.generatorPhaseDeg)||0)*Math.PI/180;
              return {source:first.id,hz:f,amplitudeV:Math.hypot(...phasor),
                instantaneousV:phasor[0]*Math.cos(phase)-phasor[1]*Math.sin(phase)};
            };
            const fg1=project.components.find(c=>c.id==='fg1'),
              fg2=project.components.find(c=>c.id==='fg2');
            for(const result of [calc(fg1,fg2),fg2?calc(fg2,fg1):null])if(result)contributions.push(result);
            const output=Math.max(lo+.02,Math.min(hi-1.5,
              baseline+contributions.reduce((sum,x)=>sum+x.instantaneousV,0)));
            secondary.set(a.out,[output,0]);
            a.c._opampPowered=true;a.c._opampOutput=output;
            a.c._opampDiff=get(secondary,a.ip)[0]-get(secondary,a.im)[0];
            for(const op of [a,b]){
              const channel=op.c._opampChannels?.[op.channel];
              if(channel){channel.output=get(secondary,op.out)[0];
                channel.diff=get(secondary,op.ip)[0]-get(secondary,op.im)[0];
                channel.powered=true;}
            }
            a.c[sc76?'_sc76NativePreamp':'_sc77NativeMixer']={
              outputV:output,dcBaselineV:baseline,sources:contributions,
              model:'native-dual-dependent-source-AC'};
          }
        }
      }
    }
  }

  // SC078: the actual passive RC branches use their generator-frequency
  // admittance in the original complex nodal solver (not the UI time step).
  // This models passive attenuation only: not an active Baxandall EQ, acoustic
  // output, speaker power or a calibrated RMS measurement.
  if(sc78Tone){
    const fg=project.components.find(c=>c.id==='fg'),
      voltmeter=project.components.find(c=>c.id==='v1'),
      frequency=Math.max(.01,Math.min(20000,
        Number(fg.generatorFrequency??byId[fg.typeId]?.generatorFrequency??1000)));
    const offset=Math.max(0,Math.min(5,Number(fg.generatorOffset??0))),
      amplitude=Math.max(0,Math.min(5,Number(fg.generatorAmplitude??0))),
      peak=fg.generatorEnabled===false?0:
        (Math.max(offset,Math.min(5,offset+amplitude))-offset)/2,
      center=fg.generatorEnabled===false?0:offset+peak,
      dcFixed=new Map(fixed);
    dcFixed.set(pin(fg,'OUT'),[center,0]);
    dcFixed.set(pin(fg,'GND'),[0,0]);
    const dc=solveGraph(branches,dcFixed,finalInjection),
      ground=pin(fg,'GND'),output=pin(voltmeter,'1'),
      vdc=(dc.get(output)?.[0]||0)-(dc.get(ground)?.[0]||0);
    let real=0,imag=0;
    if(peak>0){
      const harmonic=branches.map(br=>br.role==='capacitor-dc'&&
        (br.c?.id==='cl'||br.c?.id==='ch')?
        {...br,y:[0,2*Math.PI*frequency*br.value]}:br);
      const harmonicFixed=new Map([...fixed].map(([n])=>[n,[0,0]]));
      harmonicFixed.set(pin(fg,'OUT'),[0,-peak]);
      harmonicFixed.set(ground,[0,0]);
      const ac=solveGraph(harmonic,harmonicFixed),
        acOutput=ac.get(output)||[0,0],acGround=ac.get(ground)||[0,0];
      real=acOutput[0]-acGround[0];imag=acOutput[1]-acGround[1];
    }
    const phase=2*Math.PI*frequency*now/1000+
      (Number(fg.generatorPhaseDeg)||0)*Math.PI/180,
      instant=vdc+real*Math.cos(phase)-imag*Math.sin(phase);
    secondary.set(output,[instant,0]);
    voltmeter._sc78NativeTone={
      frequencyHz:frequency,inputVpp:2*peak,
      outputVpp:2*Math.hypot(real,imag),
      dcBaselineV:vdc,instantaneousV:instant,
      model:'native-passive-RC-complex-nodal'};
  }

  // SC080: use the native nodal network to find the potentiometer's
  // positive source peak, then solve the real RIN+RV Thevenin / D1-drop /
  // C1-R1 charge-decay equivalent without aliasing 600 Hz at 50ms frames.
  // A 1N4148 envelope indicator is NOT a calibrated IEC VU or RMS meter.
  if(sc80Envelope){
    const part=id=>project.components.find(c=>c.id===id),
      fg=part('fg'),rv=part('rv'),rin=part('rin'),d1=part('d1'),
      cap=part('c1'),resistor=part('r1'),meter=part('v1'),
      gnd=pin(fg,'GND'),
      peakSource=fg.generatorEnabled===false?0:
        Math.max(0,Math.min(5,Number(fg.generatorOffset??0)+
          Math.max(0,Number(fg.generatorAmplitude??0)))),
      peakFixed=new Map(fixed);
    peakFixed.set(pin(fg,'OUT'),[peakSource,0]);
    peakFixed.set(gnd,[0,0]);
    const potNetwork=branches.filter(br=>br.role!=='diode'),
      peakNodes=solveGraph(potNetwork,peakFixed),
      peakWiper=Math.max(0,(peakNodes.get(pin(rv,'2'))?.[0]||0)-
        (peakNodes.get(gnd)?.[0]||0)),
      vDiode=0.7,capacitance=Math.max(1e-9,Number(cap.capacitance)||4.7e-6),
      loadResistance=Math.max(1,Number(resistor.resistance)||100000),
      load=1/(1/loadResistance+1/1e7),
      percent=Math.max(0,Math.min(1,Number(rv.potentiometer??50)/100)),
      rPot=Math.max(1,Number(rv.potMax)||10000),
      rThevenin=Math.max(0.1,rPot*percent*(1-percent)),
      sourceR=Math.max(1,Number(rin.resistance)||1000)+rThevenin,
      fullLevel=Math.max(0,peakWiper-vDiode),
      chargeTarget=fullLevel*load/(load+sourceR),
      last=Number(cap._sc80EnvelopeNow),
      deltaMs=Number.isFinite(last)&&now>=last?Math.min(10000,now-last):20,
      dt=deltaMs/1000,previous=Math.max(0,Number(cap._capacitorVoltage)||0),
      tauCharge=Math.max(0.001,sourceR*capacitance*3),
      tauRelease=load*capacitance,
      voltage=chargeTarget>previous?
        previous+(chargeTarget-previous)*(1-Math.exp(-dt/tauCharge)):
        previous*Math.exp(-dt/tauRelease),
      output=Math.max(0,Math.min(5,voltage));
    secondary.set(pin(cap,'1'),[output,0]);
    secondary.set(gnd,[0,0]);
    const priorDisplay=Number(meter._sc80DisplayValue),
      alpha=1-Math.exp(-dt/.3),
      display=Math.max(0,Number.isFinite(priorDisplay)?
        priorDisplay+(output-priorDisplay)*alpha:output*alpha);
    if(!options.sampleOnly){cap._sc80EnvelopeNow=now;meter._sc80DisplayValue=display}
    meter._sc80NativeEnvelope={
      detectorVoltageV:output,displayVoltageV:display,
      relativeDbTo1VPeak:display>1e-7?20*Math.log10(display):null,
      segments:Math.max(0,Math.min(10,Math.round(10*display/2.3))),
      tauReleaseMs:1000*tauRelease,diodeDropV:vDiode,
      sourcePeakV:peakSource,frequencyHz:Number(fg.generatorFrequency)||600,
      model:'native-wired-diode-RC-envelope-educational'};
    d1._diodeForward=peakWiper>output+vDiode;
  }

  // SC081 only: true AC phasor of the actual TDA2030 feedback, output
  // coupling, 4 ohm load, high-frequency damping and bias network.
  // Solve an open-loop dependent Norton voltage driver through the same
  // native complex nodal equations used for other linear RC components.
  // Datasheet power is a bound, not an output injected as a fixed 14 W.
  if(sc81Power){
    const comp=id=>project.components.find(c=>c.id===id),
      u=comp('u1'),fg=comp('fg'),spk=comp('spk'),meter=comp('v1'),
      supply=Number(comp('g1').dcVoltage??28),
      frequency=Math.max(.01,Math.min(20000,Number(fg.generatorFrequency)||1000)),
      loadR=Math.max(.1,Number(spk.impedanceOhm??byId[spk.typeId]?.impedanceOhm??4)),
      ro=Math.max(.05,Number(byId[u.typeId]?.outputResistance)||.15),
      gainOpen=Math.max(1000,Number(byId[u.typeId]?.openLoopGain)||31622),
      out=pin(u,'4'),neg=pin(u,'3'),
      loadOut=pin(spk,'+'),loadReturn=pin(spk,'-'),
      get=(vs,k)=>vs.get(k)||[0,0],
      sub=(x,y)=>[x[0]-y[0],x[1]-y[1]],
      times=(x,f)=>[x[0]*f,x[1]*f],
      div=(x,y)=>{const d=y[0]*y[0]+y[1]*y[1];
        return d>1e-20?[(x[0]*y[0]+x[1]*y[1])/d,
                           (x[1]*y[0]-x[0]*y[1])/d]:null;},
      stamp=(bs,fx,driver)=>{
        const I=new Map(),amount=[driver[0]/ro,driver[1]/ro];
        I.set(out,amount);I.set(neg,times(amount,-1));
        return solveGraph(bs,fx,I);
      },
      evaluate=(bs,fx,driver)=>{
        const v=stamp(bs,fx,driver),lhs=sub(get(v,out),get(v,neg)),
          diff=sub(get(v,pin(u,'1')),get(v,pin(u,'2')));
        return sub(lhs,times(diff,gainOpen));
      },
      drivers=(bs,fx)=>{
        const base=evaluate(bs,fx,[0,0]),unit=evaluate(bs,fx,[1,0]),
          scale=sub(unit,base);
        return div(times(base,-1),scale);
      },
      positive=pin(comp('g1'),'P'),ground=pin(comp('g1'),'M'),
      supplyPositive=get(secondary,positive)[0],
      supplyNegative=get(secondary,ground)[0],
      actualSupply=supplyPositive-supplyNegative,
      powered=actualSupply>=12&&actualSupply<=36,
      outputData={model:'native-TDA2030-complex-feedback-RMS',
        manufacturer:'STMicroelectronics',
        datasheet:'https://www.st.com/resource/en/datasheet/tda2030.pdf',
        topology:'single-supply-28V-Pentawatt-5',frequencyHz:frequency,
        loadOhm:loadR,supplyV:actualSupply,
        guaranteed4OhmPowerW:12,typical4OhmPowerW:14,
        thermalModel:'estimated-class-AB-not-measured',
        calibration:'not-SPICE-not-THD-not-acoustic'};
    if(powered){
      const dcFx=new Map(fixed);
      dcFx.set(pin(fg,'OUT'),[0,0]);
      dcFx.set(pin(fg,'GND'),[supplyNegative,0]);
      const dcDrive=drivers(branches,dcFx);
      if(dcDrive){
        const dc=stamp(branches,dcFx,dcDrive),
          baseline=get(dc,out)[0],lo=supplyNegative,hi=supplyPositive,
          peakCap=Math.max(0,Math.min(baseline-lo-1.5,hi-baseline-1.5)),
          amplitude=fg.generatorEnabled===false?0:
            Math.max(0,Math.min(5,Number(fg.generatorAmplitude??0)))/2;
        secondary=dc;
        let harmonicV=[0,0],harmonicLoad=[0,0],scaled=1,clip=false;
        if(amplitude>0&&peakCap>0){
          const bs=branches.map(br=>br.role==='capacitor-dc'?
            {...br,y:[0,2*Math.PI*frequency*br.value]}:br);
          const fx=new Map([...fixed].map(([k])=>[k,[0,0]]));
          fx.set(pin(fg,'OUT'),[0,-amplitude]);
          fx.set(pin(fg,'GND'),[0,0]);
          const acDrive=drivers(bs,fx);
          if(acDrive){
            const ac=stamp(bs,fx,acDrive),
              driveOut=sub(get(ac,out),get(ac,neg)),
              load=sub(get(ac,loadOut),get(ac,loadReturn)),
              peakOut=Math.hypot(...driveOut),
              peakLoad=Math.hypot(...load),
              datasheetPowerCeiling=loadR===4?14:loadR===8?9:
                Math.min(14,56/loadR),
              peakPowerLimit=Math.sqrt(2*datasheetPowerCeiling*loadR),
              currentLimit=3.5*loadR,
              peakAllowed=Math.min(peakCap,peakPowerLimit,currentLimit);
            scaled=peakOut>1e-9?Math.min(1,peakAllowed/peakOut):1;
            harmonicV=times(driveOut,scaled);
            harmonicLoad=times(load,scaled);
            clip=scaled<.999999;
          }
        }
        let vRms=Math.hypot(...harmonicLoad)/Math.SQRT2,
          powerW=vRms*vRms/loadR,
          iPeak=Math.hypot(...harmonicLoad)/loadR,
          idleW=.04*actualSupply,
          internalDissipationW=Math.max(idleW,
            (actualSupply/Math.PI)*iPeak-powerW+idleW),
          heatsinkR=Math.max(.5,Math.min(50,
            Number(u.heatsinkThermalResistanceCPerW??4.2))),
          ambientC=Math.max(-20,Math.min(125,
            Number(u.ambientTemperatureC??25))),
          junctionC=ambientC+internalDissipationW*(3+heatsinkR),
          thermalShutdown=junctionC>=145;
        if(thermalShutdown){
          harmonicV=[0,0];harmonicLoad=[0,0];vRms=0;powerW=0;iPeak=0;
        }
        const phase=2*Math.PI*frequency*now/1000+
          (Number(fg.generatorPhaseDeg)||0)*Math.PI/180,
          instant=x=>x[0]*Math.cos(phase)-x[1]*Math.sin(phase);
        secondary.set(out,[baseline+instant(harmonicV),0]);
        secondary.set(loadOut,[instant(harmonicLoad),0]);
        const power={...outputData,powered:true,dcBiasV:baseline,
          outputRmsV:vRms,outputVpp:2*Math.hypot(...harmonicLoad),
          outputPowerW:powerW,outputCurrentRmsA:vRms/loadR,
          peakCurrentA:iPeak,datasheetTypicalLimitActive:clip,
          heatsinkRthCPerW:heatsinkR,junctionCaseRthCPerW:3,
          ambientC,estimatedJunctionC:junctionC,
          estimatedDissipationW:internalDissipationW,thermalShutdown,
          typicalOutputOnly:true,realHeatsinkVerified:false};
        u._sc81NativePower=power;spk._sc81NativePower=power;
        meter._sc81NativePower=power;
        spk._speakerPowerW=powerW;spk._active=powerW>1e-5;
      }
    }else{
      // Supply removed/outside the model range: clear all linked displays,
      // not just U1. Otherwise the 4 ohm load and V1 retain stale power.
      const off={...outputData,powered:false,outputRmsV:0,outputVpp:0,
        outputPowerW:0,outputCurrentRmsA:0,peakCurrentA:0,
        reason:'besleme aralığı 12–36 V dışında'};
      u._sc81NativePower=off;spk._sc81NativePower=off;
      meter._sc81NativePower=off;
      spk._speakerPowerW=0;spk._active=false;
    }
  }
  // SC082 only: true wired RC nodes, one complex dependent-source driver.
  // Harmonic distortion, internal bootstrap amplifier and thermal SOA absent.
  if(sc82Linear){
    const pick=id=>project.components.find(c=>c.id===id),u=pick('u1'),fg=pick('fg'),
      load=pick('rl'),meter=pick('v1'),ps=pick('ps'),hz=Math.max(.01,Math.min(20000,
      Number(fg.generatorFrequency)||1000)),out=pin(u,'14'),ground=pin(u,'4'),
      loadPos=pin(load,'+'),loadNeg=pin(load,'-'),ro=.2,gain=10000,
      at=(v,n)=>v.get(n)||[0,0],sub=(x,y)=>[x[0]-y[0],x[1]-y[1]],
      times=(x,m)=>[x[0]*m,x[1]*m],div=(x,y)=>{
        const d=y[0]*y[0]+y[1]*y[1];
        return d>1e-20?[(x[0]*y[0]+x[1]*y[1])/d,(x[1]*y[0]-x[0]*y[1])/d]:null;
      },
      stamp=(branches,known,driver)=>solveGraph(branches,known,new Map([
        [out,times(driver,1/ro)],[ground,times(driver,-1/ro)]])),
      error=(bs,fx,d)=>{const v=stamp(bs,fx,d);
        return sub(sub(at(v,out),at(v,ground)),times(sub(at(v,pin(u,'3')),at(v,pin(u,'2'))),gain));
      },
      driver=(bs,fx)=>{const zero=error(bs,fx,[0,0]),one=error(bs,fx,[1,0]);
        return div(times(zero,-1),sub(one,zero));
      },
      plus=at(secondary,pin(ps,'VP'))[0],baseV=at(secondary,ground)[0],
      neg=at(secondary,pin(ps,'VN'))[0],nodeS=pin(u,'9'),nodeM=pin(u,'10'),
      stbyV=at(secondary,nodeS)[0]-baseV,muteV=at(secondary,nodeM)[0]-baseV,
      previous=u._sc82Control||{standby:false,mute:false},
      threshold=(v,old)=>v>=3.5?true:v<=1.5?false:old,
      standby=threshold(stbyV,previous.standby),
      mute=threshold(muteV,previous.mute),
      valid=plus-baseV>=12&&plus-baseV<=50&&baseV-neg>=12&&baseV-neg<=50,
      on=valid&&standby&&mute,R=Math.max(.1,Number(load.impedanceOhm??8));
    if(!options.sampleOnly)u._sc82Control={standby,mute};
    let phasor=[0,0],power=0,vRms=0,limited=false;
    if(on){
      const dcFixed=new Map(fixed);dcFixed.set(pin(fg,'OUT'),[0,0]);dcFixed.set(pin(fg,'GND'),[0,0]);
      const d0=driver(branches,dcFixed);
      if(d0){
        const dc=stamp(branches,dcFixed,d0),
          center=at(dc,out)[0],room=Math.max(0,Math.min(plus-center,center-neg)-3),
          input=fg.generatorEnabled===false?0:Math.max(0,Math.min(5,Number(fg.generatorAmplitude??0)))/2;
        secondary=dc;secondary.set(nodeS,[stbyV+baseV,0]);secondary.set(nodeM,[muteV+baseV,0]);
        let outAc=[0,0];
        if(input>0&&room>0){
          const harmonic=branches.map(b=>b.role==='capacitor-dc'?
            {...b,y:[0,2*Math.PI*hz*b.value]}:b);
          const acFixed=new Map([...fixed].map(([n])=>[n,[0,0]]));
          acFixed.set(pin(fg,'OUT'),[0,-input]);acFixed.set(pin(fg,'GND'),[0,0]);
          const da=driver(harmonic,acFixed);
          if(da){
            const v=stamp(harmonic,acFixed,da);
            outAc=sub(at(v,out),at(v,ground));
            phasor=sub(at(v,loadPos),at(v,loadNeg));
            const pk=Math.hypot(...outAc),k=pk>1e-9?Math.min(1,room/pk,6.5*R/pk):1;
            limited=k<.999999;outAc=times(outAc,k);phasor=times(phasor,k);
          }
        }
        const angle=2*Math.PI*hz*now/1000+Number(fg.generatorPhaseDeg??0)*Math.PI/180,
          inst=x=>x[0]*Math.cos(angle)-x[1]*Math.sin(angle);
        secondary.set(out,[center+inst(outAc),0]);secondary.set(loadPos,[inst(phasor),0]);
      }
    }else{secondary.set(out,[0,0]);secondary.set(loadPos,[0,0]);}
    vRms=Math.hypot(...phasor)/Math.SQRT2;power=vRms*vRms/R;
    const state={model:'native-TDA7293-linear-RC-RMS',
      powered:on,railValid:valid,standbyReleased:standby,muteReleased:mute,
      standbyVoltageV:stbyV,muteVoltageV:muteV,frequencyHz:hz,
      loadOhm:R,outputRmsV:vRms,outputPowerW:power,outputCurrentRmsA:vRms/R,
      limitedByIdealRail:limited,bootstrapExternalWired:true,
      bootstrapInternalModeled:false,distortionModeled:false,
      thermalModeled:false,manufacturer100WAccepted:false,physicalHardware:false};
    u._sc82NativePower=state;load._sc82NativePower=state;
    meter._sc82NativePower=state;load._speakerPowerW=power;
  }
  // Resolve the *wired* gate divider through original nodal-analysis
  // equations, then solve the lamp power loop with a voltage-dependent Rds.
  // This is a 12 V linear-pass teaching equivalent, not verified IRF540N SPICE.
  if(dimmerStages.length){
   for(let step=0;step<5;step++){
    let changed=false;
    for(const br of dimmerStages){
     const c=br.c, vg=(secondary.get(pin(c,'G'))?.[0]||0)-(secondary.get(pin(c,'S'))?.[0]||0);
     const fraction=Math.max(0,Math.min(1,(vg-2)/8));
     const rds=fraction<=0?1e7:Math.max(1,120*(1-fraction)/fraction);
     if(Math.abs(br.r-rds)>1e-4)changed=true;
     br.r=rds;c._dimmerGateV=vg;c._dimmerResistanceOhm=rds;
    }
    if(!changed)break;
    secondary=solveSecondary();
   }
  }

  // SC Schmitt: only the exact 14-wire LM358P A-channel, potentiometer,
  // R1/R2 positive-feedback source may use an IDEAL two-threshold latch.
  // Preserve all other op-amp solvers and physical acceptance flags.
  {
    const id=project?.tutorialLesson?.id,
      scoped=id==='electronic-component-basics-outline-046',
      get=name=>project.components.find(c=>c.id===name),
      amp=scoped?get('u1'):null,meter=scoped?get('v1'):null;
    if(scoped){
      if(amp){delete amp._nativeSchmitt; if(options.reset)delete amp._nativeSchmittHigh;}
      if(meter)delete meter._nativeSchmitt;
      const partTypes=[['g1','supply-dc-plus'],['u1','lm358p-opamp-a'],
        ['in','potentiometer'],['r1','resistor'],['r2','resistor'],
        ['v1','meter-voltmeter'],['ref1','resistor'],['ref2','resistor']],
        links=['g1.P>u1.V+','g1.M>u1.V-','v1.1>u1.OUT','v1.2>g1.M',
          'in.1>g1.P','in.3>g1.M','g1.P>ref1.1','ref1.2>ref2.1',
          'ref2.2>g1.M','ref1.2>u1.IN-','in.2>r1.1',
          'r1.2>u1.IN+','u1.OUT>r2.1','r2.2>u1.IN+'],
        norm=(a,b)=>[a,b].sort().join('~'),
        actual=project.wires.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort(),
        wanted=links.map(x=>norm(...x.split('>'))).sort(),
        rIn=Number(get('r1')?.resistance),rFeedback=Number(get('r2')?.resistance),
        position=Number(get('in')?.potentiometer),
        potRange=Number(get('in')?.potMax);
      const valid=amp&&meter&&opamps.length===1&&
        project.components.length===partTypes.length&&project.wires.length===links.length&&
        partTypes.every(([name,type])=>get(name)?.typeId===type)&&
        actual.every((edge,i)=>edge===wanted[i])&&
        Number.isFinite(rIn)&&rIn>0&&Number.isFinite(rFeedback)&&rFeedback>rIn&&
        Number.isFinite(position)&&position>=0&&position<=100&&
        Number.isFinite(potRange)&&potRange>0;
      if(!valid){if(amp)delete amp._nativeSchmittHigh;}
      else{
        const supplyPlus=(secondary.get(pin(get('g1'),'P'))||[])[0],
          supplyMinus=(secondary.get(pin(get('g1'),'M'))||[])[0],
          railSpan=supplyPlus-supplyMinus;
        if(Number.isFinite(railSpan)&&railSpan>=5&&railSpan<=24.1){
          // Ideal virtual output limits; never claim a measured LM358 rail swing.
          const low=supplyMinus+.02,high=supplyPlus-2,
            ratio=rIn/rFeedback,prev=amp._nativeSchmittHigh===true,
            forceOutput=state=>solveGraph(branches,
              new Map([...fixed,[pin(amp,'OUT'),[state?high:low,0]]])),
            assumed=forceOutput(prev),
            vin=(assumed.get(pin(get('in'),'2'))||[])[0]-
                (assumed.get(pin(get('g1'),'M'))||[])[0],
            vref=(assumed.get(pin(get('ref1'),'2'))||[])[0]-
                 (assumed.get(pin(get('g1'),'M'))||[])[0],
            upper=vref*(1+ratio)-(low-supplyMinus)*ratio,
            lower=vref*(1+ratio)-(high-supplyMinus)*ratio,
            active=prev?vin>lower:vin>=upper;
          if([vin,vref,lower,upper].every(Number.isFinite)&&
             upper>lower&&lower>0&&upper<railSpan&&
             high>low+2){
            secondary=forceOutput(active);
            const outV=(secondary.get(pin(amp,'OUT'))||[])[0]-supplyMinus;
            const info={model:'native-wired-ideal-LM358-Schmitt-hysteresis',
              potPercent:position,inputV:vin,referenceV:vref,
              risingThresholdV:upper,fallingThresholdV:lower,
              high:active,outputV:outV,
              idealStatefulThresholdsOnly:true,calibratedMeter:false,
              analogDeviceAcceptance:false,physicalAcceptance:false};
            amp._opampOutput=outV;
            amp._nativeSchmitt=info;
            meter._nativeSchmitt={...info};
            if(!options.sampleOnly)amp._nativeSchmittHigh=active;
          }else delete amp._nativeSchmittHigh;
        }else delete amp._nativeSchmittHigh;
      }
    }
  }

  // One scoped lesson family only: real-pin LM358P follower/comparator
  // with physically connected UNI-T 200 DCV probes. Follower A output is
  // explicitly idealized; comparator uses the actual solved DC result.
  // Never treat these as calibrated LM358P or hardware measurements.
  {
    const match=(project?.tutorialLesson?.id||'').match(/^opamp-apps-outline-(029|030|031|032)$/);
    if(match){
      const suffix=match[1],follow=suffix==='029'||suffix==='030',
        get=id=>project.components.find(c=>c.id===id),
        op=get('u1'),meter=get('v1'),red=get('v1-red'),black=get('v1-black'),
        expectTypes=[['g1','arduino-bench-supply'],['u1','lm358p-dip8'],
          ['in','potentiometer'],['v1','unit-ut33d-plus'],
          ...(follow?[]:[['ref1','resistor'],['ref2','resistor']]),
          ['v1-red','test-probe-red'],['v1-black','test-probe-black']],
        links=follow?["g1.P>u1.8","g1.M>u1.4","in.1>g1.P","in.3>g1.M","in.2>u1.3","u1.1>u1.2","v1.V>v1-red.PLUG","v1.COM>v1-black.PLUG","u1.5>g1.M","u1.7>u1.6"]:["g1.P>u1.8","g1.M>u1.4","in.1>g1.P","in.3>g1.M","g1.P>ref1.1","ref1.2>ref2.1","ref2.2>g1.M","ref1.2>u1.2","in.2>u1.3","v1.V>v1-red.PLUG","v1.COM>v1-black.PLUG","u1.5>g1.M","u1.7>u1.6"],
        norm=(a,b)=>[a,b].sort().join('~'),
        got=project.wires.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort(),
        wanted=links.map(w=>norm(...w.split('>'))).sort(),
        valid=project.components.length===expectTypes.length&&
          got.length===wanted.length&&got.every((v,i)=>v===wanted[i])&&
          expectTypes.every(([id,type])=>get(id)?.typeId===type)&&
          opamps.length===2&&opamps.every(v=>v.c===op)&&
          red?.probeTarget?.c==='u1'&&red?.probeTarget?.p==='1'&&
          black?.probeTarget?.c==='g1'&&black?.probeTarget?.p==='M'&&
          meter?.meterPosition===4&&
          Number(get('g1')?.dcVoltage)===24&&
          Number(get('in')?.potMax)===10000&&
          Number.isFinite(Number(get('in')?.potentiometer))&&
          Number(get('in').potentiometer)>=0&&Number(get('in').potentiometer)<=100&&
          (follow||(Number(get('ref1')?.resistance)===10000&&
                    Number(get('ref2')?.resistance)===10000));
      if(op)delete op._nativeOpampDc;
      if(meter)delete meter._nativeOpampDc;
      if(valid){
        const value=(c,p)=>secondary.get(pin(c,p))?.[0],
          lo=value(get('g1'),'M'),hi=value(get('g1'),'P'),
          vin=value(op,'3'),ref=follow?null:value(op,'2'),
          trueRail=Number.isFinite(hi)&&Number.isFinite(lo)&&
             hi-lo>=5&&hi-lo<=24.1;
        if(trueRail&&Number.isFinite(vin)&&
           (follow||Number.isFinite(ref))){
          const min=lo+.02,max=hi-2;
          if(max>min+2){
            if(follow){
              // This ideal follower is conditioned on exact OUT=IN- feedback
              // and both DIP8 channels grounded/closed, not a global solver patch.
              const ideal=Math.max(min,Math.min(max,vin));
              secondary.set(pin(op,'1'),[ideal,0]);
              if(op._opampChannels?.['1']){
                op._opampChannels['1'].output=ideal;
                op._opampChannels['1'].diff=vin-ideal;
              }
              op._opampOutput=ideal;
            }
            const out=value(op,'1'),
              active=follow?null:vin>ref,
              comparatorCoherent=follow||
                 (Math.abs(vin-ref)<=.15)||
                 (active?out>max-1.5:out<min+1.5);
            if(Number.isFinite(out)&&comparatorCoherent){
              const data={model:follow?'native-wired-ideal-LM358-DIP8-follower':
                'native-wired-LM358-DIP8-comparator-DC',
                inputV:vin,referenceV:ref,outputV:out,
                potPercent:Number(get('in').potentiometer),
                comparatorHigh:active,actualRedProbe:'u1/1',
                actualBlackProbe:'g1/M',idealFollowerGain:follow?1:null,
                idealEducationalModel:true,physicalAcceptance:false,
                manufacturerLimitsAccepted:false,calibratedMeter:false};
              op._nativeOpampDc=data;
              meter._nativeOpampDc={...data};
            }
          }
        }
      }
    }
  }
  for(const b of reactive){
   const va=secondary.get(b.a)||[0,0],vb=secondary.get(b.b)||[0,0],vr=[va[0]-vb[0],va[1]-vb[1]],vm=Math.hypot(vr[0],vr[1]);let amps=current(b,secondary);
   if(b.role==='capacitor-dc'){const signed=(vr[0]-b.previous)/b.r;b._signedFlowCurrent=[signed,0];amps=Math.abs(signed);if(!options.sampleOnly){b.c._capacitorVoltage=vr[0];b.c._reactiveNow=now}}
   else if(b.role==='inductor-dc'){const signed=b.previous+vr[0]/b.r;b._signedFlowCurrent=[signed,0];amps=Math.abs(signed);if(!options.sampleOnly){b.c._inductorCurrent=signed;b.c._reactiveNow=now}}
   else if(!options.sampleOnly)b.c._reactiveNow=now;
   b.c._currentValue=amps;b.c._voltageValue=vm;b.c._reactiveVoltage=vm;b.c._reactiveCurrent=amps;b.c._reactiveModel=b.reactiveType==='C'?(b.role.endsWith('-ac')?'C · Xc=1/(2πfC)':'C · i=C·dv/dt'):(b.role.endsWith('-ac')?'L · Xl=2πfL':'L · v=L·di/dt');
  }

  // Observe actual numeric source, capacitor memory, diode conduction,
  // and output meter; full AC/Windows/physical status stays pending.
  if(validClamper&&!options.sampleOnly){
   const voltage=(c,p)=>(secondary.get(pin(c,p))||[0,0])[0],
     g=voltage(clampFg,'GND'),
     input=voltage(clampFg,'OUT')-g,
     output=voltage(clampMeter,'1')-g,
     previous=Number(clampC._capacitorVoltage);
   if([input,output,previous].every(Number.isFinite)){
    const reading={model:'native-wired-1N4148-100k-1uF-clamper-timestep',
     inputV:input,outputV:output,capacitorVoltageV:previous,
     outputMinusInputV:output-input,
     diodeConducting:clampD._diodeForward===true,
     sourceFrequencyHz:50,sourceVpp:4,
     sourceWaveform:'unipolar-sine',tauSeconds:.1,
     nativeDcStepScopeOnly:true,physicalAcceptance:false,
     fullAcWaveformAcceptance:false,manufacturerDiodeAcceptance:false};
    clampMeter._nativeClamperShift=reading;
    clampFg._nativeClamperSource={...reading};
   }
  }

  for(const {c} of diodes){const a=secondary.get(pin(c,'A'))||[0,0],k=secondary.get(pin(c,'K'))||[0,0],b=branches.find(x=>x.c===c&&x.role==='diode');c._voltageValue=Math.abs(a[0]-k[0]);c._currentValue=b?current(b,secondary):0}
  for(const b of branches.filter(b=>b.role==='load'&&['resistor','lamp'].includes(byId[b.c.typeId]?.kind))){const a=secondary.get(b.a),z=secondary.get(b.b);b.c._currentValue=current(b,secondary);b.c._voltageValue=a&&z?Math.hypot(a[0]-z[0],a[1]-z[1]):0}
  for(const b of branches.filter(b=>['speaker-load','crystal-bvd','crystal-dc-open'].includes(b.role))){const a=secondary.get(b.a)||[0,0],z=secondary.get(b.b)||[0,0],vm=Math.hypot(a[0]-z[0],a[1]-z[1]),amps=current(b,secondary);b.c._currentValue=amps;b.c._voltageValue=vm;if(b.role==='speaker-load'){const nativeRms=b.c._sc81NativePower||b.c._sc82NativePower;
    b.c._speakerPowerW=(nativeRms?.model==='native-TDA2030-complex-feedback-RMS'||nativeRms?.model==='native-TDA7293-linear-RC-RMS')?
      nativeRms.outputPowerW:amps*amps*b.r;
    if(nativeRms?.model==='native-TDA2030-complex-feedback-RMS'||nativeRms?.model==='native-TDA7293-linear-RC-RMS'){
      b.c._voltageValue=nativeRms.outputRmsV;
      b.c._currentValue=nativeRms.outputCurrentRmsA;
    }
    b.c._active=b.c._speakerPowerW>1e-5}else{b.c._crystalFrequencyHz=b.hz||0;b.c._active=amps>1e-9}}
  for(const br of dimmerStages){
   br.c._currentValue=current(br,secondary);
   br.c._dimmerDissipationW=br.c._currentValue*br.c._currentValue*br.r;
  }
  for(const b of meters)b.c._currentValue=current(b,secondary);
  for(const b of branches.filter(b=>b.energyTraining)){
   const a=secondary.get(b.a)||[0,0],z=secondary.get(b.b)||[0,0],vm=Math.hypot((a[0]||0)-(z[0]||0),(a[1]||0)-(z[1]||0)),amps=current(b,secondary),g=b.y?.[0]||0,sus=b.y?.[1]||0,active=vm*vm*g,reactive=-vm*vm*sus,apparent=vm*amps,pf=apparent>1e-9?Math.max(0,Math.min(1,active/apparent)):0;
   b.c._currentValue=amps;b.c._voltageValue=vm;b.c._energyLoad={voltageV:vm,currentA:amps,activePowerW:active,reactivePowerVar:reactive,apparentPowerVA:apparent,powerFactor:pf,frequencyHz:b.hz||50,loadCharacter:b.character};
  }
  for(const c of project.components)if(!options.sampleOnly&&byId[c.typeId]?.kind==='multimeter')UT.measure(c,byId[c.typeId],{branches,fixed,voltages:secondary,solveGraph,acNodes,dcNodes,pin,project,byId});
  for(const c of project.components)if(!options.sampleOnly&&byId[c.typeId]?.kind==='clamp-meter')Clamp.measure(c,byId[c.typeId],{branches,fixed,voltages:secondary,solveGraph,acNodes,dcNodes,pin,project,byId});
  for(const c of project.components)if(!options.sampleOnly&&byId[c.typeId]?.kind==='energy-analyzer')Analyzer.measure(c,byId[c.typeId],{branches,fixed,voltages:secondary,solveGraph,acNodes,dcNodes,pin,project,byId,now});
  for(const c of project.components){const d=byId[c.typeId];if(d?.kind==='meter-v'){
    const connected=p=>project.wires.some(w=>w.from?.c===c.id&&w.from?.p===p||w.to?.c===c.id&&w.to?.p===p);
    if(!d.pins.slice(0,2).every(p=>connected(p.id))){delete c._voltageValue;continue}
    const a=secondary.get(pin(c,d.pins[0].id)),b=secondary.get(pin(c,d.pins[1].id));
    c._voltageValue=c._sc82NativePower?.model==='native-TDA7293-linear-RC-RMS'?
      c._sc82NativePower.outputRmsV:c._sc81NativePower?.model==='native-TDA2030-complex-feedback-RMS'?
      c._sc81NativePower.outputRmsV:(a&&b?(
        ((dcNodes.has(pin(c,d.pins[0].id))||dcNodes.has(pin(c,d.pins[1].id)))&&
         !acNodes.has(pin(c,d.pins[0].id))&&!acNodes.has(pin(c,d.pins[1].id)))?
          a[0]-b[0]:Math.hypot(a[0]-b[0],a[1]-b[1])):0);
  }}
  // SC072/SC073: solve only the source-wired passive filter's ideal AC
  // transfer; the result is not a calibrated voltmeter or hardware test.
  {
    const id=project?.tutorialLesson?.id,band=id==='oscillator-filter-apps-src-20',
      notch=id==='oscillator-filter-apps-src-21';
    if(band||notch){
      const part=id=>project.components.find(c=>c.id===id),
        expectedTypes=band?[['gen','arduino-signal-generator'],['c1','capacitor'],
          ['r1','resistor'],['r2','resistor'],['c2','capacitor'],['v1','meter-voltmeter']]:
          [['gen','arduino-signal-generator'],['r1','resistor'],['r2','resistor'],
           ['c3','capacitor'],['c1','capacitor'],['c2','capacitor'],
           ['r3','resistor'],['v1','meter-voltmeter']],
        expected=band?[
          'gen.OUT>c1.1','c1.2>r1.1','r1.2>gen.GND','c1.2>r2.1',
          'r2.2>c2.1','c2.2>gen.GND','v1.1>r2.2','v1.2>gen.GND']:
          ['gen.OUT>r1.1','r1.2>r2.1','r1.2>c3.1','c3.2>gen.GND',
           'gen.OUT>c1.1','c1.2>c2.1','c1.2>r3.1','r3.2>gen.GND',
           'r2.2>c2.2','v1.1>c2.2','v1.2>gen.GND'],
        norm=(a,b)=>[a,b].sort().join('~'),
        actual=project.wires.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort(),
        desired=expected.map(w=>norm(...w.split('>'))).sort(),
        generator=part('gen'),meter=part('v1');
      if(meter)delete meter._nativePassiveFilter;
      const original=project.components.length===expectedTypes.length&&
        actual.length===desired.length&&actual.every((e,i)=>e===desired[i])&&
        expectedTypes.every(([id,type])=>part(id)?.typeId===type)&&
        (generator?.generatorWaveform??'sine')==='sine';
      if(original){
        const hz=Number(generator.generatorFrequency??159),
          vpp=Number(generator.generatorAmplitude??2),
          passives=expectedTypes.filter(([id,type])=>type==='resistor'||type==='capacitor'),
          valid=hz>0&&hz<=20000&&Number.isFinite(hz)&&
            vpp>=0&&vpp<=5&&Number.isFinite(vpp)&&
            passives.every(([id,type])=>{
              const value=Number(type==='resistor'?part(id).resistance:part(id).capacitance);
              return Number.isFinite(value)&&value>0;
            });
        if(valid){
          const ids=new Set(passives.map(x=>x[0])),
            network=branches.filter(br=>ids.has(br.c?.id)).map(br=>
              br.reactiveType==='C'?{...br,y:[0,2*Math.PI*hz*Number(br.c.capacitance)]}:br),
            ac=solveGraph(network,new Map([[pin(generator,'OUT'),[1,0]],
                                           [pin(generator,'GND'),[0,0]]])),
            pos=ac.get(pin(meter,'1'))||[0,0],neg=ac.get(pin(meter,'2'))||[0,0],
            re=pos[0]-neg[0],im=pos[1]-neg[1],gain=Math.hypot(re,im),
            inputPeak=generator.generatorEnabled===false?0:vpp/2,
            outputPeak=inputPeak*gain,rms=outputPeak/Math.SQRT2;
          if(Number.isFinite(rms)&&Number.isFinite(gain)){
            meter._nativePassiveFilter={model:'native-wired-passive-RC-ideal-phasor',
              type:band?'bandpass':'twin-t-notch',frequencyHz:hz,gain,
              gainDb:gain>0?20*Math.log10(gain):null,
              phaseDeg:Math.atan2(im,re)*180/Math.PI,
              inputPeakV:inputPeak,outputPeakV:outputPeak,
              outputRmsV:rms,calibratedMeter:false,physicalAcceptance:false};
            meter._voltageValue=rms;
          }
        }
      }
    }
  }

  // Scoped active filter: ideal AC nodal RC + ideal LM358P unity follower.
  // Only exact source-terminal graphs qualify. No calibrated/hardware acceptance.
  {
    const suffix=(project?.tutorialLesson?.id||'').match(/^oscillator-filter-apps-outline-(05[0-3])$/)?.[1];
    if(suffix){
      const common=[["g","arduino-bench-supply"],["fg","arduino-signal-generator"],["u","lm358p-dip8"],["v","meter-voltmeter"],["ra","resistor"],["rb","resistor"],["cref","capacitor"],["cin","capacitor"],["rbias","resistor"]],
        profiles={"050":{"type":"lowpass","extra":[["r1","resistor"],["c1","capacitor"]],"wires":["cin.2>r1.1","r1.2>c1.1","c1.2>ra.2","r1.2>u.3"]},"051":{"type":"highpass","extra":[["c1","capacitor"],["r1","resistor"]],"wires":["cin.2>c1.1","c1.2>r1.1","r1.2>ra.2","c1.2>u.3"]},"052":{"type":"bandpass","extra":[["c1","capacitor"],["r1","resistor"],["r2","resistor"],["c2","capacitor"]],"wires":["cin.2>c1.1","c1.2>r1.1","r1.2>ra.2","c1.2>r2.1","r2.2>c2.1","c2.2>ra.2","r2.2>u.3"]},"053":{"type":"twin-t-notch","extra":[["r1","resistor"],["r2","resistor"],["c3","capacitor"],["c1","capacitor"],["c2","capacitor"],["r3","resistor"]],"wires":["cin.2>r1.1","r1.2>r2.1","r1.2>c3.1","c3.2>ra.2","cin.2>c1.1","c1.2>c2.1","c1.2>r3.1","r3.2>ra.2","r2.2>c2.2","r2.2>u.3"]}},
        shared=["g.P>u.8","g.M>u.4","ra.1>g.P","ra.2>rb.1","rb.2>g.M","cref.1>ra.2","cref.2>g.M","fg.GND>g.M","fg.OUT>cin.1","cin.2>rbias.1","rbias.2>ra.2","u.1>u.2","u.1>v.1","v.2>ra.2","u.5>g.M","u.7>u.6"],
        cfg=profiles[suffix],part=id=>project.components.find(c=>c.id===id),
        norm=(a,b)=>[a,b].sort().join('~'),
        actual=project.wires.map(w=>norm(w.from.c+'.'+w.from.p,w.to.c+'.'+w.to.p)).sort(),
        wanted=[...shared,...cfg.wires].map(w=>norm(...w.split('>'))).sort(),
        expected=[...common,...cfg.extra],gen=part('fg'),supply=part('g'),meter=part('v');
      if(meter)delete meter._nativeActiveFilter;
      if(project.components.length===expected.length&&actual.length===wanted.length&&
         actual.every((e,i)=>e===wanted[i])&&
         expected.every(([id,type])=>part(id)?.typeId===type)&&
         gen?.generatorWaveform==='sine'&&Number(supply?.dcVoltage)===12){
        const hz=Number(gen.generatorFrequency),vpp=Number(gen.generatorAmplitude),
          passive=expected.filter(([id,type])=>type==='resistor'||type==='capacitor'),
          valid=Number.isFinite(hz)&&hz>0&&hz<=20000&&
                Number.isFinite(vpp)&&vpp>=0&&vpp<=5&&
                passive.every(([id,type])=>{
                  const n=Number(type==='resistor'?part(id).resistance:part(id).capacitance);
                  return Number.isFinite(n)&&n>0;
                });
        if(valid){
          const ids=new Set(passive.map(([id])=>id)),
            network=branches.filter(br=>ids.has(br.c?.id)).map(br=>
              br.reactiveType==='C'?{...br,y:[0,2*Math.PI*hz*Number(br.c.capacitance)]}:br),
            ac=solveGraph(network,new Map([[pin(gen,'OUT'),[1,0]],
              [pin(gen,'GND'),[0,0]],[pin(supply,'P'),[0,0]],[pin(supply,'M'),[0,0]]])),
            up=ac.get(pin(part('u'),'3'))||[0,0],
            ref=ac.get(pin(part('ra'),'2'))||[0,0],
            gain=Math.hypot(up[0]-ref[0],up[1]-ref[1]),
            inputPeak=gen.generatorEnabled===false?0:vpp/2,
            outputPeak=inputPeak*gain,rms=outputPeak/Math.SQRT2;
          if(Number.isFinite(gain)&&Number.isFinite(rms)){
            meter._nativeActiveFilter={model:'native-wired-ideal-RC-LM358-unity-buffer',
              type:cfg.type,frequencyHz:hz,gain,gainDb:gain>0?20*Math.log10(gain):null,
              outputPeakV:outputPeak,outputRmsV:rms,idealSmallSignalOnly:true,
              calibratedMeter:false,physicalAcceptance:false};
            meter._voltageValue=rms;
          }
        }
      }
    }
  }

  // Electronics basics diode clipping: read the ACTUAL wired DC solver,
  // never synthesize an AC waveform or assume an ideal 12.7 V hard limit.
  {
    const name=project?.tutorialLesson?.id||'',
      scoped=name==='electronic-component-basics-outline-039'||
             name==='electronic-component-basics-outline-042';
    if(scoped){
      const expectedTypes=[['g1','supply-dc-plus'],['rv','potentiometer'],
        ['rin','resistor'],['d1','1n4148-do35'],['load','resistor'],
        ['ref1','resistor'],['ref2','resistor'],['v1','meter-voltmeter']],
        expectedWires=[
          'g1.P>rv.1','rv.3>g1.M','rv.2>rin.1','rin.2>d1.A',
          'rin.2>load.1','load.2>g1.M','g1.P>ref1.1',
          'ref1.2>ref2.1','ref2.2>g1.M','d1.K>ref1.2',
          'rin.2>v1.1','v1.2>g1.M'];
      const part=id=>project.components.find(c=>c.id===id),meter=part('v1'),
        norm=(a,b)=>[a,b].sort().join('~'),
        observed=project.wires.map(w=>norm(w.from.c+'.'+w.from.p,
                                               w.to.c+'.'+w.to.p)).sort(),
        wanted=expectedWires.map(w=>norm(...w.split('>'))).sort();
      if(meter)delete meter._nativeClipperDc;
      const pot=part('rv'),diode=part('d1'),position=Number(pot?.potentiometer),
        original=project.components.length===expectedTypes.length&&
          observed.length===wanted.length&&
          observed.every((v,i)=>v===wanted[i])&&
          expectedTypes.every(([id,type])=>part(id)?.typeId===type)&&
          Number.isFinite(position)&&position>=0&&position<=100&&
          Number(pot?.potMax)===10000&&
          // The current acceptance describes this exact 24 V, 22k/100k,
          // 1k/1k 1N4148 reference network; other values may still
          // simulate, but are not this verified lesson.
          Number(part('g1')?.dcVoltage??24)===24&&
          Number(part('rin')?.resistance)===22000&&
          Number(part('load')?.resistance)===100000&&
          Number(part('ref1')?.resistance)===1000&&
          Number(part('ref2')?.resistance)===1000&&
          byId[diode?.typeId]?.kind==='diode'&&
          byId[part('g1')?.typeId]?.kind==='supply-dc-plus'&&
          byId[meter?.typeId]?.kind==='meter-v';
      if(original&&meter){
        const dc=(a,p,b,q)=>{
          const x=secondary.get(pin(part(a),p)),y=secondary.get(pin(part(b),q));
          return x&&y?x[0]-y[0]:NaN;
        };
        const outputV=dc('v1','1','g1','M'),
          inputV=dc('rv','2','g1','M'),
          referenceV=dc('ref1','2','g1','M');
        if([outputV,inputV,referenceV].every(Number.isFinite)){
          meter._nativeClipperDc={
            model:'native-wired-1N4148-pot-controlled-DC-clipper',
            potPercent:position,inputV,outputV,referenceV,
            diodeForward:diode?._diodeForward===true,
            diodeAssumption:'existing native piecewise 1N4148 diode model',
            dcTransferOnly:true,acWaveformAcceptance:false,
            physicalAcceptance:false,calibratedMeter:false};
        }
      }
    }
  }

  // Precision rectifier lesson 043: expose ACTUAL LM358/1N4148 native
  // DC transfer; source wired and diode conduction must match exactly.
  // Not an AC half-wave rectification or calibrated physical measurement.
  {
    const scoped=project?.tutorialLesson?.id==='opamp-apps-outline-043';
    if(scoped){
      const get=id=>project.components.find(c=>c.id===id),
        expected=[['g1','supply-dc-plus'],['rv1','potentiometer'],
          ['r3','resistor'],['r4','resistor'],['u1','lm358p-dip8'],
          ['d1','1n4148-do35'],['r5','resistor'],['v1','meter-voltmeter']],
        wires=['g1.P>rv1.1','rv1.3>g1.M','rv1.2>u1.3',
          'g1.P>r3.1','r3.2>r4.1','r4.2>g1.M',
          'g1.P>u1.8','g1.M>u1.4','u1.1>d1.A','d1.K>u1.2',
          'd1.K>r5.1','r5.2>r3.2','d1.K>v1.1','v1.2>r3.2'],
        norm=(a,b)=>[a,b].sort().join('~'),
        observed=project.wires.map(w=>norm(w.from.c+'.'+w.from.p,
          w.to.c+'.'+w.to.p)).sort(),
        required=wires.map(s=>norm(...s.split('>'))).sort(),
        meter=get('v1'),op=get('u1'),diode=get('d1'),
        pct=Number(get('rv1')?.potentiometer);
      if(meter)delete meter._nativePrecisionRectifierDc;
      if(op)delete op._nativePrecisionRectifierDc;
      if(meter&&op&&diode&&project.components.length===8&&
         observed.length===required.length&&
         observed.every((v,i)=>v===required[i])&&
         expected.every(([id,type])=>get(id)?.typeId===type)&&
         Number.isFinite(pct)&&pct>=0&&pct<=100&&
         Number(get('rv1').potMax)>0&&
         Number(get('r3').resistance)===10000&&
         Number(get('r4').resistance)===10000&&
         Number(get('r5').resistance)===100000){
        const real=(c,p)=>secondary.get(pin(c,p))?.[0],
          grounded=real(get('g1'),'M'),
          input=real(get('rv1'),'2'),
          ref=real(get('r3'),'2'),
          out=real(get('v1'),'1'),
          minus=real(get('v1'),'2'),
          voltage=out-minus,inputRelative=input-ref;
        if([grounded,input,ref,out,minus,voltage,inputRelative].every(Number.isFinite)){
          const data={model:'native-wired-LM358-1N4148-precision-rectifier-DC',
            potentiometerPercent:pct,inputRelativeToVrefV:inputRelative,
            outputRelativeToVrefV:voltage,referenceV:ref-grounded,
            diodeForward:diode._diodeForward===true,
            dcTransferOnly:true,acWaveformAcceptance:false,
            hardwareAcceptance:false,physicalAcceptance:false,
            calibratedMeter:false};
          meter._nativePrecisionRectifierDc=data;
          op._nativePrecisionRectifierDc={...data};
        }
      }
    }
  }
  for(const b of cts){const a=pin(b.c,'S1'),z=pin(b.c,'S2'),adj=new Map();for(const v of branches){if(!adj.has(v.a))adj.set(v.a,[]);if(!adj.has(v.b))adj.set(v.b,[]);adj.get(v.a).push(v.b);adj.get(v.b).push(v.a)}const seen=new Set(),q=[a];while(q.length){const n=q.pop();if(seen.has(n))continue;seen.add(n);q.push(...(adj.get(n)||[]))}b.c._secondaryOpen=!seen.has(z);}
  const terminalCurrents=new Map(),addTerminal=(c,p,v)=>{if(!c||!p||!v)return;const k=key(c.id,p),old=terminalCurrents.get(k)||[0,0];terminalCurrents.set(k,[old[0]+v[0],old[1]+v[1]])};
  for(const b of branches){if(!b.c||!b.ap||!b.bp||b.role==='opamp-output')continue;let i=b._signedFlowCurrent||signedCurrent(b,secondary);if(b.role==='current-source'&&b.source)i=[i[0]-Number(b.source.value||0),i[1]];addTerminal(b.c,b.ap,i);addTerminal(b.c,b.bp,[-i[0],-i[1]])}
  return {branches,fixed,voltages:secondary,pin,terminalCurrents,signedCurrent,dc:(c,a,b)=>{const x=secondary.get(pin(c,a)),y=secondary.get(pin(c,b));return x&&y?x[0]-y[0]:0}};
 }
 const api={update,solveGraph};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSCurrentModel=api;
})(typeof window==='undefined'?globalThis:window);
