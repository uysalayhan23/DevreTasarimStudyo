'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const H=require('../dist/hcfa-x2e.js'),Sim=require('../dist/simulation.js');
const root=path.join(__dirname,'..');
function loadLibrary(){
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/hcfa-library.js'),'utf8'),ctx);
 return ctx.window.COMPONENT_LIBRARY;
}
const lib=loadLibrary(),B=Object.fromEntries(lib.map(d=>[d.id,d]));
const near=(a,b,t=.01)=>assert.ok(Math.abs(Number(a)-Number(b))<=t,Math.abs(Number(a)-Number(b))+' > '+t+' ('+a+' != '+b+')');
function setup(extra={}){
 const g={id:'g',typeId:'supply-1p'},v={id:'v',typeId:H.id,hcfa:{...extra,params:{'P04.11':1,...(extra.params||{})}}},m={id:'m',typeId:H.motorId},p={version:7,workspaceMode:'control',components:[g,v,m],wires:[],junctions:[]};
 const wire=(a,ap,b,bp)=>{const w={id:'w'+p.wires.length,from:{c:a,p:ap},to:{c:b,p:bp},points:[]};p.wires.push(w);return w};
 wire('g','L','v','L1');wire('g','N','v','L2');for(const q of ['U','V','W'])wire('v',q,'m',q);wire('v','CN2','m','ENC');
 const solve=now=>Sim.solve(p,B,{now});return {g,v,m,p,wire,solve};
}
test('HCFA files parse and UI/integration hooks exist',()=>{
 for(const p of ['../dist/hcfa-x2e.js','../dist/hcfa-library.js','../dist/hcfa-ui.js','../dist/hcfa-examples.js','../dist/simulation.js','../dist/app.js','../dist/symbols.js','../dist/norms.js'])assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(__dirname,p),'utf8'),{filename:p}));
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 for(const x of ['hcfa-x2e.js','hcfa-library.js','hcfa-ui.js','hcfa-examples.js','hcfa-drive-img-0.js','hcfa-motor-img-0.js','id="hcfaSettings"','id="hcfaQuickMode"','id="hcfaQuickSpeed"','data-example="hcfa_x2e_pulse_npn"'])assert.ok(html.includes(x),x);
 let drive='',motor='';const payload=file=>{const raw=fs.readFileSync(file,'utf8'),marker=String.fromCharCode(43,39),tail=String.fromCharCode(39,59),a=raw.indexOf(marker)+2,b=raw.lastIndexOf(tail);return raw.slice(a,b)};for(let i=0;i<3;i++)drive+=payload(path.join(__dirname,'../dist/hcfa-drive-img-'+i+'.js'));for(let i=0;i<4;i++)motor+=payload(path.join(__dirname,'../dist/hcfa-motor-img-'+i+'.js'));assert.equal(drive.length,15280);assert.equal(motor.length,17280);const db=Buffer.from(drive,'base64'),mb=Buffer.from(motor,'base64');assert.equal(db.length,11458);assert.equal(mb.length,12960);assert.equal(db.subarray(0,4).toString('ascii'),'RIFF');assert.equal(db.subarray(8,12).toString('ascii'),'WEBP');assert.equal(mb.subarray(0,4).toString('ascii'),'RIFF');assert.equal(mb.subarray(8,12).toString('ascii'),'WEBP');
});
test('SV-X2EA040A-A and SV-X2MH040A-N2LN documented 400 W pairing is exact',()=>{
 const d=B[H.id],m=B[H.motorId];assert.ok(d);assert.ok(m);assert.equal(d.productVisualExact,true);assert.equal(m.productVisualExact,true);assert.equal(d.productVisualType,'user-approved-photo');assert.equal(m.productVisualType,'user-approved-photo');assert.match(d.productVisualSource,/2026-10-07/);assert.match(m.productVisualSource,/2026-10-07/);assert.equal(d.driveSpec.powerW,400);assert.match(d.driveSpec.input,/200–240 VAC/);assert.equal(d.driveSpec.frame,'B');
 assert.equal(m.motorSpec.powerW,400);near(m.motorSpec.ratedTorque,1.27);near(m.motorSpec.peakTorque,4.46);near(m.motorSpec.ratedCurrent,2.1);near(m.motorSpec.peakCurrent,10.4);assert.equal(m.motorSpec.ratedRpm,3000);assert.equal(m.motorSpec.maxRpm,5000);assert.equal(m.motorSpec.encoderBits,17);assert.equal(m.motorSpec.brake,false);
});
test('CN1 pulse/enable and RS485 terminals match HCFA documents',()=>{
 const d=B[H.id],pin=id=>d.pins.find(p=>p.id===id)?.label;
 assert.match(pin('CN1:9'),/I1/);assert.match(pin('CN1:11'),/COM1/);assert.match(pin('CN1:35'),/CC_P/);
 assert.match(pin('CN1:37'),/CMD_DIR\+/);assert.match(pin('CN1:39'),/\/CMD_DIR/);assert.match(pin('CN1:41'),/CMD_PLS\+/);assert.match(pin('CN1:43'),/\/CMD_PLS/);
 assert.match(pin('CN4:4'),/485\+/);assert.match(pin('CN4:5'),/485−/);assert.match(pin('CN5:4'),/485\+/);assert.match(pin('CN5:5'),/485−/);
});
test('Modbus parameter address conversion follows X2E rule and EEPROM +E000H',()=>{
 assert.equal(H.address('P03.27'),0x031B);assert.equal(H.address('P03.28'),0x031C);assert.equal(H.address('P21.04'),0x1504);assert.equal(H.address('P09.05'),0x0905);
 const c={};assert.equal(H.writeModbus(c,'E303',750).ok,true);assert.equal(H.config(c).params['P03.03'],750);assert.equal(H.writeModbus(c,'3607',2).ok,true);assert.equal(H.config(c).commDI,2);
});
test('Modbus speed mode enables servo through communication DI and reaches commanded speed',()=>{
 const c={};H.set(c,'P00.01',1);H.set(c,'P03.03',750);H.set(c,'P09.05',2);H.writeModbus(c,'3607',2);
 H.tick(c,{voltage:230,di:[],motorConnected:true,motorCompatible:true,encoderConnected:true},0);
 const s=H.tick(c,{voltage:230,di:[],motorConnected:true,motorCompatible:true,encoderConnected:true},1000);
 assert.equal(s.servoOn,true);near(s.rpm,750,.1);assert.equal(s.status,'Scrun');
});
test('pulse/direction position command uses P00.08 units per revolution',()=>{
 const c={hcfa:{params:{'P04.11':1,'P00.01':0,'P00.05':0,'P00.08':10000}}};
 H.tick(c,{voltage:230,di:[],pulseHz:1000,pulseDirection:1,motorConnected:true,motorCompatible:true,encoderConnected:true},0);
 const s=H.tick(c,{voltage:230,di:[],pulseHz:1000,pulseDirection:1,motorConnected:true,motorCompatible:true,encoderConnected:true},1000);
 near(s.commandRpm,6,.01);assert.ok(s.positionUnits>0);assert.ok(s.inputPulseCount>=999);
});
test('internal position trigger selects stage 1 and moves one 10000-unit revolution command',()=>{
 const c={hcfa:{params:{'P04.11':1,'P00.01':0,'P00.05':2,'P04.02':25,'P08.04':0,'P08.06':10000,'P08.08':500,'P08.09':10}}};
 H.tick(c,{voltage:230,di:[false,false],motorConnected:true,motorCompatible:true,encoderConnected:true},0);
 const s=H.tick(c,{voltage:230,di:[false,true],motorConnected:true,motorCompatible:true,encoderConnected:true},10);
 assert.equal(s.stage,1);assert.equal(s.commandPosition,10000);assert.ok(s.commandRpm>0);
});
test('matching and encoder faults are enforced before motion',()=>{
 let c={hcfa:{params:{'P04.11':1,'P00.01':1,'P03.03':500}}};let s=H.tick(c,{voltage:230,di:[],motorConnected:true,motorCompatible:false,encoderConnected:false},0);assert.equal(s.fault,'Err.005');assert.equal(s.rpm,0);
 c={hcfa:{params:{'P04.11':1,'P00.01':1,'P03.03':500}}};s=H.tick(c,{voltage:230,di:[],motorConnected:true,motorCompatible:true,encoderConnected:false},0);assert.equal(s.fault,'Err.013');assert.equal(s.rpm,0);
});
test('full circuit simulation powers exact motor and updates drive display state',()=>{
 const t=setup({params:{'P00.01':1,'P03.03':750}});let r=t.solve(0);assert.equal(r.stable,true);r=t.solve(1000);assert.equal(r.stable,true);assert.equal(t.v._hcfa.fault,'');assert.equal(t.v._hcfa.servoOn,true);near(t.v._hcfa.rpm,750,1);assert.equal(t.m._active,true);near(t.m._motorRPM,750,1);
});
test('five HCFA starter projects use known components and valid pins',()=>{
 const ctx={window:{DTSStarterProjects:{}}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/hcfa-examples.js'),'utf8'),ctx);
 const expected=['hcfa_x2e_pulse_npn','hcfa_x2e_internal_position','hcfa_x2e_modbus_speed','hcfa_x2e_modbus_torque','hcfa_x2e_modbus_position'];
 assert.deepEqual(Object.keys(ctx.window.DTSStarterProjects).sort(),expected.sort());
 for(const [name,p] of Object.entries(ctx.window.DTSStarterProjects))for(const w of p.wires)for(const e of [w.from,w.to]){const c=p.components.find(x=>x.id===e.c);assert.ok(c,name+' component '+e.c);assert.ok(B[c.typeId],name+' type '+c.typeId);assert.ok(B[c.typeId].pins.some(pin=>pin.id===e.p),name+' '+c.typeId+' pin '+e.p);}
});

test('all five HCFA workshops reach stable measurable states',()=>{
 const ctx={window:{DTSStarterProjects:{}}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/hcfa-examples.js'),'utf8'),ctx);
 for(const [name,raw] of Object.entries(ctx.window.DTSStarterProjects)){
  const p=JSON.parse(JSON.stringify(raw)),drv=p.components.find(c=>c.typeId===H.id),mot=p.components.find(c=>c.typeId===H.motorId);
  if(name==='hcfa_x2e_internal_position'){Sim.solve(p,B,{now:0});const tr=p.components.find(c=>c.id==='trig');tr.state=true;Sim.solve(p,B,{now:10});tr.state=false;}else Sim.solve(p,B,{now:0});
  const r=Sim.solve(p,B,{now:1000});assert.equal(r.stable,true,name);assert.equal(r.shortCircuit,false,name);assert.equal(drv._hcfa.fault,'',name);assert.equal(drv._hcfa.servoOn,true,name);assert.equal(mot._active,true,name);assert.ok(Math.abs(mot._motorRPM)>0,name);
 }
});


test('HCFA UI uses the approved user WebP product photos instead of old catalog line drawings',()=>{
 const ui=fs.readFileSync(path.join(__dirname,'../dist/hcfa-ui.js'),'utf8'),html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.match(ui,/DTSHCFADriveMime/);assert.match(ui,/DTSHCFAMotorMime/);assert.match(ui,/hcfa-product-photo-front/);
 assert.match(html,/hcfa-drive-img-0\.js\?rev=[^\"']+/);assert.match(html,/hcfa-motor-img-0\.js\?rev=[^\"']+/);assert.doesNotMatch(html,/hcfa-(?:drive|motor)-img-0\.js\?v=1\.19\./);
});


test('HCFA physical envelopes and connector pins follow the user dimension drawings',()=>{
 const d=B[H.id],m=B[H.motorId];assert.ok(d);assert.ok(m);
 assert.equal(d.w,84);assert.equal(d.h,330);
 assert.deepEqual({...d.physicalDimensionsMm},{width:42,height:165,depth:151,shape:'rect'});
 assert.equal(d.physicalScaleSource,'workspace-space-v1:user-locked');
 assert.deepEqual(Array.from(d.driveSpec.dimensionsMm),[42,165,151]);
 assert.equal(m.w,324.4);assert.equal(m.h,120);
 assert.equal(m.physicalDimensionsMm.width,162.2);assert.equal(m.physicalDimensionsMm.height,60);
 assert.equal(m.physicalDimensionsMm.bodyLength,122.7);assert.equal(m.physicalDimensionsMm.frontOffset,6.5);
 assert.equal(m.physicalDimensionsMm.shaftShoulder,3);assert.equal(m.physicalDimensionsMm.shaftLength,30);
 assert.equal(m.physicalDimensionsMm.shaftDiameter,14);assert.equal(m.physicalDimensionsMm.pilotDiameter,50);
 for(const x of [d,m])for(const p of x.pins){assert.ok(p.x>=0&&p.x<=x.w,x.id+':'+p.id+':x');assert.ok(p.y>=0&&p.y<=x.h,x.id+':'+p.id+':y');}
 for(const p of ['U','V','W','PE','ENC'])assert.equal(m.pins.find(x=>x.id===p).side,'top',p);
 const ui=fs.readFileSync(path.join(__dirname,'../dist/hcfa-ui.js'),'utf8');
 assert.match(ui,/hcfa-live-physical-display/);
 assert.match(ui,/const frameW=84,frameH=330/);assert.match(ui,/data-visual-fit="contain-no-distortion"/);
 assert.match(ui,/hcfa-product-photo-side/);
});

test('HCFA terminal labels use the approved readable outside-column layout without changing terminal identities',()=>{
 const d=B[H.id];assert.ok(d);assert.equal(d.w,84);assert.equal(d.h,330);
 assert.equal(d.terminalLabelLayout,'outside-readable-v1');
 const cn1=d.pins.filter(p=>p.block==='CN1');
 assert.equal(cn1.length,44);
 assert.deepEqual(Array.from(cn1,p=>p.terminal).sort((a,b)=>a-b),Array.from({length:44},(_,i)=>i+1));
 const left=cn1.filter(p=>p.side==='left'),right=cn1.filter(p=>p.side==='right');
 assert.equal(left.length,22);assert.equal(right.length,22);
 for(const rows of [left,right])for(let i=1;i<rows.length;i++)assert.ok(rows[i].y-rows[i-1].y>=5.39,'CN1 vertical spacing');
 for(const p of left){assert.equal(p.x,0);assert.equal(p.labelAnchor,'end');assert.ok(p.labelOffset.x<0);assert.equal(p.labelSize,6.2);}
 for(const p of right){assert.equal(p.x,84);assert.equal(p.labelAnchor,'start');assert.ok(p.labelOffset.x>0);assert.equal(p.labelSize,6.2);}
 for(const p of d.pins.filter(p=>!p.block)){if(p.side==='left'){assert.equal(p.labelAnchor,'end');assert.ok(p.labelOffset.x<0);}if(p.side==='right'){assert.equal(p.labelAnchor,'start');assert.ok(p.labelOffset.x>0);}}
 const symbols=fs.readFileSync(path.join(__dirname,'../dist/symbols.js'),'utf8');
 assert.match(symbols,/p\.labelAnchor\|\|'middle'/);
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.match(html,/hcfa-library\.js\?rev=20261008-motor-labels1/);
 assert.match(html,/symbols\.js\?rev=20261008-terminal-readable1/);
});


test('HCFA servo motor terminal labels are separated without moving electrical terminals',()=>{
 const m=B[H.motorId];assert.ok(m);
 const expected={
  U:{x:222,y:0,anchor:'end',dx:-10,dy:14},
  V:{x:232,y:0,anchor:'end',dx:-10,dy:30},
  W:{x:242,y:0,anchor:'start',dx:10,dy:14},
  PE:{x:252,y:0,anchor:'start',dx:10,dy:30},
  ENC:{x:292,y:0,anchor:'start',dx:10,dy:46}
 };
 for(const [id,e] of Object.entries(expected)){
  const p=m.pins.find(x=>x.id===id);assert.ok(p,id);
  assert.equal(p.x,e.x,id+' terminal x unchanged');
  assert.equal(p.y,e.y,id+' terminal y unchanged');
  assert.equal(p.side,'top',id+' terminal side unchanged');
  assert.equal(p.labelAnchor,e.anchor,id+' label anchor');
  assert.deepEqual({...p.labelOffset},{x:e.dx,y:e.dy},id+' label offset');
 }
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.match(html,/hcfa-library\.js\?rev=20261008-motor-labels1/);
});


test('HCFA product-photo panel supports live interactive simulation controls',()=>{
 const c={hcfa:{params:{'P00.01':1,'P03.03':500}}};
 let r=H.action(c,'set');assert.equal(r.ok,true);assert.equal(H.config(c).panelServo,true);
 r=H.action(c,'set');assert.equal(r.ok,true);assert.equal(H.config(c).panelServo,false);
 H.config(c).panelServo=true;
 H.tick(c,{voltage:230,di:[],motorConnected:true,motorCompatible:true,encoderConnected:true},0);
 let s=H.tick(c,{voltage:230,di:[],motorConnected:true,motorCompatible:true,encoderConnected:true},1000);
 assert.equal(s.servoOn,true);near(s.rpm,500,.2);
 H.action(c,'up');assert.equal(H.config(c).params['P03.03'],510);
 H.action(c,'down');assert.equal(H.config(c).params['P03.03'],500);
 H.action(c,'home');assert.equal(H.config(c).home,true);
 H.action(c,'pulse');assert.equal(H.config(c).virtualPulse,true);assert.equal(H.config(c).virtualPulseHz,1000);
 H.action(c,'up');assert.equal(H.config(c).virtualPulseHz,1100);
 c._hcfa.fault='Err.013';H.action(c,'reset');assert.equal(c._hcfa.fault,'');
 const ui=fs.readFileSync(path.join(root,'dist','hcfa-ui.js'),'utf8');
 const rendered=require('../dist/hcfa-ui.js').markup(c,B[H.id]);
 for(const a of ['mode','shift','up','down','set','reset','home','pulse'])assert.ok(rendered.includes('data-hcfa-action="'+a+'"'),a+' clickable action');
 assert.match(ui,/SET · Servo ON\/OFF/);
 assert.match(ui,/hcfa-photo-quick-action/);
 assert.match(ui,/editor\(\)\?\.snapshot\(runtime\)/);
 const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
 assert.match(html,/hcfa-x2e\.js\?rev=20261008-panel-interactive1/);
 assert.match(html,/hcfa-ui\.js\?rev=20261008-sim-audit1/);
});

test('HCFA physical display cycles status actual speed command speed and pulse monitor',()=>{
 const UI=require('../dist/hcfa-ui.js'),c={hcfa:{panelLevel:0,monitor:0,virtualPulse:false,virtualPulseHz:0,params:{}}};
 c._hcfa={powered:true,status:'S-rdy',running:false,rpm:1234,commandRpm:1500,torquePercent:12,current:1.2,bus:325,positionUnits:77,pulseHz:0};
 assert.equal(UI.display(c),'S-rdy');
 H.action(c,'mode');assert.equal(UI.display(c),'1234r');
 H.action(c,'mode');assert.equal(UI.display(c),'C1500');
 H.action(c,'mode');H.action(c,'pulse');c._hcfa.pulseHz=1000;assert.equal(UI.display(c),'P1000');
});
