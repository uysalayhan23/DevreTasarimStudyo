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
  const branches=[],fixed=new Map(),acNodes=new Set(),dcNodes=new Set(),cts=[],meters=[],reactive=[],diodes=[],opamps=[],injected=new Map(),pin=(c,p)=>net.find(key(c.id,p)),add=(c,a,b,r,role)=>{const branch={a:pin(c,a),b:pin(c,b),ap:a,bp:b,r:Math.max(1e-6,r),c,role};branches.push(branch);return branch},addY=(c,a,b,y,role)=>{const branch={a:pin(c,a),b:pin(c,b),ap:a,bp:b,y,c,role};branches.push(branch);return branch};
  const now=Number(options.now??Date.now()),defaultDt=.05,inject=(a,b,value)=>{if(!Number.isFinite(value)||Math.abs(value)<1e-15)return;injected.set(a,[(injected.get(a)?.[0]||0)+value,(injected.get(a)?.[1]||0)]);injected.set(b,[(injected.get(b)?.[0]||0)-value,(injected.get(b)?.[1]||0)])};
  const reactiveDt=c=>{const last=Number(c._reactiveNow);return Math.max(.001,Math.min(.25,Number.isFinite(last)?(now-last)/1000:defaultDt))};
  const sourceFrequency=c=>{for(const p of byId[c.typeId]?.pins||[])for(const v of net.at(c,p.id)||[])if(v?.type==='ac')return Math.max(1,Number(v.frequency)||Number(v.hz)||50);return 50};
  const isACComponent=(c,d)=>d.pins.some(p=>(net.at(c,p.id)||[]).some(v=>v?.type==='ac'));
  for(const c of project.components){const d=byId[c.typeId];if(!d)continue;delete c._currentValue;
   for(const p of d.pins){const v=net.at(c,p.id)[0];if(!v)continue;(v.type==='ac'?acNodes:dcNodes).add(pin(c,p.id));const angle=v.type==='ac'?({L1:0,L2:-2*Math.PI/3,L3:2*Math.PI/3}[v.leg]||0):0,mag=['N','0','PE'].includes(v.leg)?0:v.volts;fixed.set(pin(c,p.id),[mag*Math.cos(angle),mag*Math.sin(angle)])}
   if(d.kind==='current-transformer')cts.push(add(c,'P1','P2',1e-6,'ct'));
   else if(['diode','led'].includes(d.kind))diodes.push({c,drop:d.kind==='led'?2:.7});
   else if(d.kind==='meter-a')meters.push(add(c,d.pins[0].id,d.pins[1].id,1e-6,'meter'));
   else if(d.kind==='ldr'){
    const lux=Math.max(.01,Number(c.illuminationLux??d.illuminationLux??10)),r10=Math.max(1,Number(d.r10)||15000),gamma=Math.max(.1,Number(d.gamma)||.6),dark=Math.max(r10,Number(d.darkResistance)||1000000),r=Math.min(dark,r10*Math.pow(10/lux,gamma));
    c._ldrResistance=r;add(c,d.pins[0].id,d.pins[1].id,Math.max(.01,r),'ldr');
   }
   else if(['resistor','lamp'].includes(d.kind))add(c,d.pins[0].id,d.pins[1].id,Math.max(.01,Number(c.resistance)||1000),'load');
   else if(d.kind==='energy-training-load'){
    const nominal=Math.max(1,Number(c.nominalVoltage??d.nominalVoltage??230)),apparent=Math.max(1,Number(c.apparentPowerVA??d.apparentPowerVA??230)),pf=Math.max(.05,Math.min(1,Number(c.powerFactor??d.powerFactor??1))),character=c.loadCharacter||d.loadCharacter||'resistive';
    const active=apparent*pf,qmag=apparent*Math.sqrt(Math.max(0,1-pf*pf)),reactive=character==='inductive'?qmag:character==='capacitive'?-qmag:0,g=active/(nominal*nominal),susceptance=-reactive/(nominal*nominal),hz=sourceFrequency(c);
    const br=addY(c,'L','N',[g,susceptance],'energy-training-load');Object.assign(br,{energyTraining:true,nominal,apparent,pf,character,hz});
   }
   else if(d.kind==='capacitor'){
    const cap=Math.max(1e-12,Number(c.capacitance??d.capacitance??100e-6)),a=d.pins[0].id,b=d.pins[1].id;
    if(isACComponent(c,d)){const hz=sourceFrequency(c),br=addY(c,a,b,[0,2*Math.PI*hz*cap],'capacitor-ac');Object.assign(br,{reactiveType:'C',value:cap,hz});reactive.push(br)}
    else{const dt=reactiveDt(c),r=dt/cap,br=add(c,a,b,r,'capacitor-dc'),vp=Number(c._capacitorVoltage)||0;inject(br.a,br.b,vp/r);Object.assign(br,{reactiveType:'C',value:cap,dt,previous:vp});reactive.push(br)}
   }
   else if(d.kind==='reactor'||d.id==='winding'){
    const ind=Math.max(1e-9,Number(c.inductance??d.inductance??.15)),a=d.pins[0].id,b=d.pins[1].id;
    if(isACComponent(c,d)){const hz=sourceFrequency(c),br=addY(c,a,b,[0,-1/(2*Math.PI*hz*ind)],'inductor-ac');Object.assign(br,{reactiveType:'L',value:ind,hz});reactive.push(br)}
    else{const dt=reactiveDt(c),r=ind/dt,br=add(c,a,b,r,'inductor-dc'),ip=Number(c._inductorCurrent)||0;inject(br.a,br.b,-ip);Object.assign(br,{reactiveType:'L',value:ind,dt,previous:ip});reactive.push(br)}
   }
   else if(d.kind==='opamp'){const ro=Math.max(.1,Number(d.outputResistance)||20),br=add(c,'OUT','V-',ro,'opamp-output');opamps.push({c,d,br,ip:pin(c,'IN+'),im:pin(c,'IN-'),vp:pin(c,'V+'),vm:pin(c,'V-'),out:pin(c,'OUT'),gain:Math.max(10,Number(d.openLoopGain)||100000)});}
   else if(d.kind==='potentiometer'){const r=Math.max(1,Number(c.potMax)||10000),p=Math.max(0,Math.min(100,c.potentiometer??50))/100;add(c,'1','2',r*p,'load');add(c,'2','3',r*(1-p),'load')}
   else if(d.ptWires)add(c,'A','B1',Devices.output(c,d).value,'load');
   else if(['sensor-ntc','sensor-ptc'].includes(d.id))add(c,d.pins[0].id,d.pins[1].id,Devices.output(c,d).value,'load');
   else if(d.id==='abb-acs800-r5'){add(c,'X21:3','X21:4',200001,'acs-ai');add(c,'X21:5','X21:6',100,'acs-ai');add(c,'X21:7','X21:8',100,'acs-ai');}
   else if(d.id==='sinamics-v20-1p'){const V20=typeof module==='object'&&module.exports?require('./v20.js'):root.DTSV20,p=V20.config(c).params;for(let i=0;i<2;i++)add(c,String(i+2),'5',[2,3].includes(p['P0756.'+i])?235:100000,'v20-ai');}
   else if(['motor3','motor-yd'].includes(d.kind)&&c._motorDrive){const drive=project.components.find(v=>v.id===c._motorDrive),s=drive?._acs800||drive?._v20;if(s?.running&&s.current>0){const delta=c._motorConnection==='delta',r=s.voltage/(Math.max(.0001,s.current)*(delta?1/Math.sqrt(3):Math.sqrt(3))),upper=d.kind==='motor3'?['U','V','W']:['U1','V1','W1'];for(let i=0;i<3;i++)add(c,upper[i],['U2','V2','W2'][i],r,'v20-motor');}}
   else if(d.kind==='meter-v')add(c,d.pins[0].id,d.pins[1].id,1e7,'voltmeter');
   else if(d.kind==='multimeter'){const [mode,range]=UT.setting(c,d);if(mode==='DCV'||mode==='ACV'||mode==='Hz')add(c,'V','COM',1e7,'ut-voltage');else if(mode==='DCA')add(c,UT.jack(c,d),'COM',range===10?.01:1,'ut-current')}
   else if(d.kind==='clamp-meter'){const [mode]=Clamp.setting(c);if(mode==='DCV'||mode==='ACV')add(c,'V','COM',1e7,'ut200-voltage')}
   else if(d.kind==='energy-analyzer'){add(c,'L','N',1e7,'energy-analyzer-voltage');add(c,'S1','S2',.05,'energy-analyzer-ct')}
   for(const s of [...(d.id==='abb-acs800-r5'&&c._acs800?.board?[{a:'X21:9',b:'X21:10',value:c._acs800.ao[0]/1000,compliance:14},{a:'X21:11',b:'X21:12',value:c._acs800.ao[1]/1000,compliance:14}]:[]),...(c._instrument?.current||[]),...(c._sensorSignal?[c._sensorSignal]:[]),...(d.id==='sinamics-v20-1p'&&c._v20?.powered?[{a:'4',b:'5',value:c._v20.ao/1000,compliance:10}]:[])]){const a=pin(c,s.a),b=pin(c,s.b);injected.set(a,[(injected.get(a)?.[0]||0)+s.value,0]);injected.set(b,[(injected.get(b)?.[0]||0)-s.value,0]);Object.assign(add(c,s.a,s.b,1e10,'current-source'),{source:s})}
  }
  let voltages=solveGraph(branches,fixed);const signedCurrent=(b,v)=>{if(b.a===b.b)return [0,0];const a=v.get(b.a)||[0,0],z=v.get(b.b)||[0,0],vr=a[0]-z[0],vi=a[1]-z[1];if(b.role==='diode')return [Math.max(0,(vr-(b.drop||.7))/b.r),0];if(b.y)return [vr*b.y[0]-vi*b.y[1],vr*b.y[1]+vi*b.y[0]];return [vr/b.r,vi/b.r]};const current=(b,v)=>{const i=signedCurrent(b,v);return Math.hypot(i[0],i[1])};
  // Start with each DC diode as a candidate branch. Starting with every diode
  // open leaves the LED anode floating, so a series circuit can never reach
  // the forward-voltage check that would turn the diode on.
  const diodeCandidates=diodes.filter(({c})=>{
   const a=pin(c,'A'),k=pin(c,'K');c._diodeForward=false;
   return !acNodes.has(a)&&!acNodes.has(k);
  }).map(({c,drop})=>{const b=add(c,'A','K',.05,'diode');b.drop=drop;return b});
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
    for(const o of opamps){
     const val=n=>(guess.get(n)||[0,0])[0],lo=val(o.vm),hi=val(o.vp),vp=val(o.ip),vm=val(o.im);
     if(!(hi>lo+.5)){o.c._opampPowered=false;o.c._opampOutput=lo;o.c._opampDiff=vp-vm;continue}
     const prev=Number.isFinite(o.c._opampIterOutput)?o.c._opampIterOutput:Math.max(lo+.02,Math.min(hi-1.5,val(o.out)));
     const wanted=Math.max(lo+.02,Math.min(hi-1.5,lo+o.gain*(vp-vm))),target=prev+(wanted-prev)*.12;
     o.c._opampIterOutput=target;o.c._opampPowered=true;o.c._opampDiff=vp-vm;addCurrent(work,o.out,o.vm,target/o.br.r);
    }
    const next=solveGraph(branches,fixed,work);
    for(const o of opamps){const a=(next.get(o.out)||[0,0])[0],b=(guess.get(o.out)||[0,0])[0];change=Math.max(change,Math.abs(a-b));o.c._opampOutput=a}
    guess=next;if(change<1e-4)break;
   }
   secondary=guess;
   for(const o of opamps){delete o.c._opampIterOutput;o.c._currentValue=Math.abs(((secondary.get(o.out)||[0,0])[0]-(secondary.get(o.vm)||[0,0])[0])/o.br.r)}
  }
  for(const b of reactive){
   const va=secondary.get(b.a)||[0,0],vb=secondary.get(b.b)||[0,0],vr=[va[0]-vb[0],va[1]-vb[1]],vm=Math.hypot(vr[0],vr[1]);let amps=current(b,secondary);
   if(b.role==='capacitor-dc'){const signed=(vr[0]-b.previous)/b.r;b._signedFlowCurrent=[signed,0];amps=Math.abs(signed);if(!options.sampleOnly){b.c._capacitorVoltage=vr[0];b.c._reactiveNow=now}}
   else if(b.role==='inductor-dc'){const signed=b.previous+vr[0]/b.r;b._signedFlowCurrent=[signed,0];amps=Math.abs(signed);if(!options.sampleOnly){b.c._inductorCurrent=signed;b.c._reactiveNow=now}}
   else if(!options.sampleOnly)b.c._reactiveNow=now;
   b.c._currentValue=amps;b.c._voltageValue=vm;b.c._reactiveVoltage=vm;b.c._reactiveCurrent=amps;b.c._reactiveModel=b.reactiveType==='C'?(b.role.endsWith('-ac')?'C · Xc=1/(2πfC)':'C · i=C·dv/dt'):(b.role.endsWith('-ac')?'L · Xl=2πfL':'L · v=L·di/dt');
  }
  for(const {c} of diodes){const a=secondary.get(pin(c,'A'))||[0,0],k=secondary.get(pin(c,'K'))||[0,0],b=branches.find(x=>x.c===c&&x.role==='diode');c._voltageValue=Math.abs(a[0]-k[0]);c._currentValue=b?current(b,secondary):0}
  for(const b of branches.filter(b=>b.role==='load'&&['resistor','lamp'].includes(byId[b.c.typeId]?.kind))){const a=secondary.get(b.a),z=secondary.get(b.b);b.c._currentValue=current(b,secondary);b.c._voltageValue=a&&z?Math.hypot(a[0]-z[0],a[1]-z[1]):0}
  for(const b of meters)b.c._currentValue=current(b,secondary);
  for(const b of branches.filter(b=>b.energyTraining)){
   const a=secondary.get(b.a)||[0,0],z=secondary.get(b.b)||[0,0],vm=Math.hypot((a[0]||0)-(z[0]||0),(a[1]||0)-(z[1]||0)),amps=current(b,secondary),g=b.y?.[0]||0,sus=b.y?.[1]||0,active=vm*vm*g,reactive=-vm*vm*sus,apparent=vm*amps,pf=apparent>1e-9?Math.max(0,Math.min(1,active/apparent)):0;
   b.c._currentValue=amps;b.c._voltageValue=vm;b.c._energyLoad={voltageV:vm,currentA:amps,activePowerW:active,reactivePowerVar:reactive,apparentPowerVA:apparent,powerFactor:pf,frequencyHz:b.hz||50,loadCharacter:b.character};
  }
  for(const c of project.components)if(!options.sampleOnly&&byId[c.typeId]?.kind==='multimeter')UT.measure(c,byId[c.typeId],{branches,fixed,voltages:secondary,solveGraph,acNodes,dcNodes,pin,project,byId});
  for(const c of project.components)if(!options.sampleOnly&&byId[c.typeId]?.kind==='clamp-meter')Clamp.measure(c,byId[c.typeId],{branches,fixed,voltages:secondary,solveGraph,acNodes,dcNodes,pin,project,byId});
  for(const c of project.components)if(!options.sampleOnly&&byId[c.typeId]?.kind==='energy-analyzer')Analyzer.measure(c,byId[c.typeId],{branches,fixed,voltages:secondary,solveGraph,acNodes,dcNodes,pin,project,byId,now});
  for(const c of project.components){const d=byId[c.typeId];if(d?.kind==='meter-v'){const a=secondary.get(pin(c,d.pins[0].id)),b=secondary.get(pin(c,d.pins[1].id));c._voltageValue=a&&b?Math.hypot(a[0]-b[0],a[1]-b[1]):0}}
  for(const b of cts){const a=pin(b.c,'S1'),z=pin(b.c,'S2'),adj=new Map();for(const v of branches){if(!adj.has(v.a))adj.set(v.a,[]);if(!adj.has(v.b))adj.set(v.b,[]);adj.get(v.a).push(v.b);adj.get(v.b).push(v.a)}const seen=new Set(),q=[a];while(q.length){const n=q.pop();if(seen.has(n))continue;seen.add(n);q.push(...(adj.get(n)||[]))}b.c._secondaryOpen=!seen.has(z);}
  const terminalCurrents=new Map(),addTerminal=(c,p,v)=>{if(!c||!p||!v)return;const k=key(c.id,p),old=terminalCurrents.get(k)||[0,0];terminalCurrents.set(k,[old[0]+v[0],old[1]+v[1]])};
  for(const b of branches){if(!b.c||!b.ap||!b.bp||b.role==='opamp-output')continue;let i=b._signedFlowCurrent||signedCurrent(b,secondary);if(b.role==='current-source'&&b.source)i=[i[0]-Number(b.source.value||0),i[1]];addTerminal(b.c,b.ap,i);addTerminal(b.c,b.bp,[-i[0],-i[1]])}
  return {branches,fixed,voltages:secondary,pin,terminalCurrents,signedCurrent,dc:(c,a,b)=>{const x=secondary.get(pin(c,a)),y=secondary.get(pin(c,b));return x&&y?x[0]-y[0]:0}};
 }
 const api={update,solveGraph};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSCurrentModel=api;
})(typeof window==='undefined'?globalThis:window);
