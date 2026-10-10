const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Lines=require('../dist/conductors.js'),Leads=require('../dist/probe-leads.js'),Sim=require('../dist/simulation.js'),Symbols=require('../dist/symbols.js'),Meter=require('../dist/multimeter.js');
const ctx={window:{DTSStarterProjects:{}}};for(const f of ['library','starter-v115'])vm.runInNewContext(fs.readFileSync(require.resolve('../dist/'+f+'.js'),'utf8'),ctx);
const by=Object.fromEntries(Symbols.prepareLibrary(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d])),copy=x=>JSON.parse(JSON.stringify(x)),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
function setup(){const p={components:[],wires:[],junctions:[]};Lines.initialize(p,by);let n=0;const add=(typeId,id,extra={})=>{const c={id,typeId,ref:id,x:100,y:100,...extra};p.components.push(c);return c};const wire=(a,pin,b,q,color='#e53935')=>{const from={c:a.id,p:pin},to={c:b.id,p:q},s=Lines.plan(p,by,from,to,color,1.5);assert.equal(s.ok,true,s.reason);Lines.bind(p,s.role,s.color);const w={id:'w'+(++n),from,to,color:s.color,role:s.role,size:s.size};p.wires.push(w);Lines.synchronize(p,by);return w};return {p,add,wire,solve:()=>Sim.solve(p,by)}}
function weighing(voltage=true){const p=copy(ctx.window.DTSStarterProjects.tx115),tx=p.components.find(c=>c.typeId==='weighing-indicator'),cell=p.components.find(c=>c.typeId==='load-cell'),meter=p.components.find(c=>c.typeId==='meter-ammeter');tx.instrumentSettings={...tx.instrumentSettings,output:voltage?'0-10V':'4-20mA'};meter.typeId='unit-ut33d-plus';meter.meterPosition=voltage?3:10;for(const w of p.wires)for(const r of [w.from,w.to]){if(r.c===tx.id&&r.p==='I'&&voltage)r.p='V';if(r.c===meter.id)r.p=r.p==='1'?'V':'COM'}Lines.initialize(p,by);return {p,tx,cell,meter}}
test('TX11 voltage output follows weight and requires both supply and loadcell wiring',()=>{
 const t=weighing();for(const [kg,v] of [[0,0],[250,2.5],[500,5],[1000,10]]){t.cell.loadWeight=kg;assert.equal(Sim.solve(t.p,by).stable,true);near(t.meter._meter.value,v);assert.equal(t.meter._meter.unit,'V');assert.deepEqual(t.tx._instrument.outputPins,['V','G'])}
 const signal=t.p.wires.find(w=>w.to.c===t.cell.id&&w.to.p==='SIG+'||w.from.c===t.cell.id&&w.from.p==='SIG+');t.p.wires=t.p.wires.filter(w=>w!==signal);Sim.solve(t.p,by);near(t.meter._meter.value,0);assert.match(t.tx._instrument.error,/bağlantısı/);
 const u=weighing();u.p.wires=u.p.wires.filter(w=>![w.from,w.to].some(r=>r.c===u.tx.id&&r.p==='+'));Sim.solve(u.p,by);near(u.meter._meter.value,0);assert.equal(u.tx._instrument.on,false);
});
test('external T/R bridge selects voltage; removing it restores current output',()=>{
 const t=weighing(false);t.cell.loadWeight=1000;Sim.solve(t.p,by);near(t.meter._meter.value,.02);assert.equal(t.meter._meter.display,'20.000');assert.equal(t.meter._meter.unit,'mA');
 t.p.wires.push({id:'bridge',from:{c:t.tx.id,p:'T'},to:{c:t.tx.id,p:'R'}});t.meter.meterPosition=3;for(const w of t.p.wires)for(const r of [w.from,w.to])if(r.c===t.tx.id&&r.p==='I')r.p='V';Sim.solve(t.p,by);assert.equal(t.tx._instrument.outputMode,'0-10V');near(t.meter._meter.value,10);
 t.p.wires=t.p.wires.filter(w=>w.id!=='bridge');Sim.solve(t.p,by);assert.equal(t.tx._instrument.outputMode,'4-20mA');near(t.meter._meter.value,0);
});
test('EX/SIG cable colors are independent across terminal blocks and survive save/open',()=>{
 const t=setup(),source=t.add('supply-3p','s'),lamp=t.add('lamp-green','h'),tx=t.add('weighing-indicator','tx'),cell=t.add('load-cell','cell'),terminal=t.add('terminal-2','x');t.wire(source,'L1',lamp,'X1');t.wire(source,'N',lamp,'X2');
 const rows=[['EX+','EX+','#e53935'],['EX−','EX−','#1e88e5'],['S+','SIG+','#e53935'],['S−','SIG−','#16a34a']];const wires=rows.map(([a,b,col])=>t.wire(tx,a,cell,b,col));
 for(let i=0;i<wires.length;i++){assert.equal(wires[i].color,rows[i][2]);assert.equal(wires[i].freeColor,true);assert.equal(wires[i].role,'FREE')}
 assert.equal(t.p.colorLocks['#e53935'],'L1');assert.equal(t.p.colorLocks['#1e88e5'],'N');assert.equal(t.p.colorLocks['#16a34a'],undefined);
 assert.equal(Lines.recolor(t.p,by,wires[2].id,'#1e88e5',.75).ok,true);assert.equal(wires[2].color,'#1e88e5');assert.equal(wires[0].color,'#e53935');
 t.wire(cell,'SIG+',terminal,'1','#ffffff');const branch=t.wire(terminal,'2',tx,'S+','#7f1d1d');assert.equal(branch.color,'#7f1d1d');assert.equal(branch.freeColor,true);
 assert.equal(Lines.check(t.p,by,{c:source.id,p:'L1'},{c:source.id,p:'N'}).ok,false);
 const restored=copy(t.p);Lines.initialize(restored,by);assert.deepEqual(restored.wires.map(w=>w.color),t.p.wires.map(w=>w.color));
});
test('PNP/NPN outputs use configured positive/negative colors without inventing power',()=>{
 for(const [output,role,color,ret] of [['PNP','+24V','#f472b6','M'],['NPN','0V','#22d3ee','P']]){
  const t=setup(),source=t.add('supply-dc-plus','s'),sensor=t.add('proximity','b',{sensorOutput:output,state:true}),lamp=t.add('lamp-green','h');
  Lines.configureColor(t.p,by,color,role);t.wire(source,'P',sensor,'BN');const supply=t.wire(source,'M',sensor,'BU');const out=t.wire(sensor,'BK',lamp,'X1','#e53935');t.wire(lamp,'X2',source,ret);
  assert.equal(out.role,role);assert.equal(out.color,color);t.solve();assert.equal(lamp._active,true);
  t.p.wires=t.p.wires.filter(w=>w!==supply);t.solve();assert.equal(lamp._active,false);
  sensor.sensorOutput=output==='PNP'?'NPN':'PNP';Lines.synchronize(t.p,by);assert.equal(out.role,role==='0V'?'+24V':'0V');
 }
 const t=setup(),s=t.add('sensor-inductive-4wire-npn','s'),a=t.add('lamp-green','a'),b=t.add('lamp-red','b');for(const [pin,lamp] of [['BK',a],['WH',b]])assert.equal(t.wire(s,pin,lamp,'X1').role,'0V');
});
test('20 color profiles can be reassigned without changing physical net identities',()=>{
 assert.equal(Object.keys(Lines.colorNames).length,20);const t=setup(),s=t.add('supply-3p','s'),h=t.add('lamp-green','h');const phase=t.wire(s,'L1',h,'X1'),neutral=t.wire(s,'N',h,'X2');const topology=JSON.stringify(t.p.wires.map(w=>[w.from,w.to]));
 Lines.configureColor(t.p,by,'#e53935','N');assert.equal(neutral.color,'#e53935');assert.equal(phase.role,'L1');assert.notEqual(phase.color,'#e53935');assert.equal(JSON.stringify(t.p.wires.map(w=>[w.from,w.to])),topology);
 assert.equal(Lines.setVoltage(t.p,'#e53935','24 V DC'),true);assert.equal(Lines.voltageLabel(t.p,'#e53935'),'24 V DC');assert.equal(Lines.check(t.p,by,{c:s.id,p:'N'},{c:s.id,p:'L1'}).ok,false);
 assert.equal(Lines.recolor(t.p,by,neutral.id,'#ffffff',2.5).ok,true);assert.equal(neutral.color,'#ffffff');
 const saved=copy(t.p);Lines.initialize(saved,by);assert.equal(saved.colorVoltages['#e53935'],'24 V DC');assert.equal(saved.wires.find(w=>w.id===neutral.id).color,'#ffffff');
});
test('one jack per probe, plug moving and migration of older duplicate connections',()=>{
 const t=setup(),m=t.add('unit-ut33d-plus','m'),r=t.add('test-probe-red','r'),b=t.add('test-probe-black','b');const red=t.wire(m,'V',r,'PLUG');t.wire(m,'COM',b,'PLUG');
 const before=JSON.stringify(t.p);assert.equal(Lines.plan(t.p,by,{c:m.id,p:'10A'},{c:r.id,p:'PLUG'},'#e53935',6).ok,false);assert.equal(JSON.stringify(t.p),before);
 assert.equal(Leads.movePlug(t.p,by,m.id,'10A').ok,true);assert.equal(t.p.wires.length,2);assert.equal(red.from.p,'10A');assert.equal(Leads.movePlug(t.p,by,m.id,'V').ok,true);assert.equal(red.from.p,'V');
 t.p.wires.push({id:'old-duplicate',from:{c:m.id,p:'10A'},to:{c:r.id,p:'PLUG'}});m.meterPosition=9;assert.equal(Leads.repairDuplicates(t.p,by),1);assert.equal(t.p.wires.length,2);assert.equal(t.p.wires.some(w=>w.id==='old-duplicate'),true);
 const j=setup(),mm=j.add('unit-ut33d-plus','m'),rr=j.add('test-probe-red','r');j.p.junctions.push({id:'j',x:0,y:0});j.p.wires.push({id:'rj',from:{c:rr.id,p:'PLUG'},to:{j:'j'}},{id:'mv',from:{c:mm.id,p:'V'},to:{j:'j'}});assert.equal(Lines.check(j.p,by,{c:mm.id,p:'10A'},{j:'j'}).ok,false);
});
test('meter prefixes scale display only, including full-scale mA and megohms',()=>{
 for(const [value,mode,range,display,unit] of [[.02,'DCA',.2,'20.000','mA'],[.02,'DCA',.02,'20.000','mA'],[.002,'DCA',.002,'2.000','mA'],[.005,'DCV',.2,'5.000','mV'],[-.01,'DCV',.2,'-10.000','mV'],[1000,'Ω',2000,'1.000','kΩ'],[5e6,'Ω',20e6,'5.000','MΩ']])assert.deepEqual(Meter.format(value,mode,range),{display,unit});
 assert.equal(Meter.label(1),'200 mV DC');assert.equal(Meter.format(.021,'DCA',.02).display,'OL');
 const p={components:[{id:'m',typeId:'unit-ut33d-plus',meterPosition:18},{id:'r',typeId:'resistor',resistance:5e6}],wires:[{from:{c:'m',p:'V'},to:{c:'r',p:'1'}},{from:{c:'m',p:'COM'},to:{c:'r',p:'2'}}],junctions:[]};Sim.solve(p,by);near(p.components[0]._meter.value,5e6);assert.equal(p.components[0]._meter.display,'5.000');assert.equal(p.components[0]._meter.unit,'MΩ');
});
