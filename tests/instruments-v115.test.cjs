const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),S=require('../dist/simulation.js'),T=require('../dist/thermal.js'),Devices=require('../dist/device-behavior.js'),Materials=require('../dist/materials.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const by=Object.fromEntries(ctx.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
const wire=(a,p,b,q)=>({from:{c:a,p},to:{c:b,p:q}}),near=(a,b,tol=1e-5)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const project=(type,settings={})=>({components:[{id:'s',typeId:'supply-dc-plus'},{id:'d',typeId:type,instrumentSettings:settings},{id:'m',typeId:'meter-ammeter'}],wires:[],junctions:[]});
test('NIST curves agree with independent fixed point tables and CVD PT100',()=>{near(T.emf(231.928,'J'),12.5517,.0001);near(T.emf(1064.18,'R'),11.36374,.00001);near(T.emf(1064.18,'S'),10.33420,.00001);near(T.emf(1064.18,'B'),5.43354,.00001);near(T.emf(29.7646,'T'),1.1868,.0001);near(T.emf(419.527,'E'),30.5119,.0001);near(T.emf(100,'K'),4.09623,.0001);near(T.mv(25,25),0);near(T.resistance(100),138.5055);near(T.resistance(-100),60.25584,.0001)});
test('WAZ5 powers independently and supplies a real current-loop meter',()=>{const p=project('converter-pressure',{inputValue:5});p.wires=[wire('s','P','d','4'),wire('s','M','d','5'),wire('d','7','m','1'),wire('m','2','d','8')];assert.equal(S.solve(p,by).stable,true);near(p.components[1]._instrument.output.value,12);near(p.components[2]._currentValue,.012,1e-6);p.components[1].instrumentSettings.inputValue=10;S.solve(p,by);near(p.components[2]._currentValue,.02,1e-6);p.wires.shift();S.solve(p,by);assert.equal(p.components[1]._instrument.on,false);near(p.components[2]._currentValue,0)});
test('ORDEL HMT renderer footprint is 45 mm diameter at canonical 2 scene-unit/mm scale',()=>{
  const d=by['converter-temperature'];assert.ok(d);
  assert.equal(d.w,90);
  assert.equal(d.h,90);
  assert.equal(d.physicalDiameterMm,45);
  assert.equal(d.physicalDepthMm,20);
  assert.deepEqual({...d.physicalDimensionsMm},{width:45,height:45,depth:20,shape:'cylinder'});
  assert.equal(d.visualAssetPreserved,true);
  assert.equal(d.materialAsset,'ordel-top-v115');
  for(const p of d.pins){
    assert.ok(p.x>=0&&p.x<=90,p.id+':x');
    assert.ok(p.y>=0&&p.y<=90,p.id+':y');
  }
});

test('HMT-R requires two-wire PT100, bridge and actual loop supply',()=>{const p=project('converter-temperature');p.components.push({id:'r',typeId:'sensor-pt100-2wire',temperature:50});p.wires=[wire('s','P','d','2'),wire('d','1','m','1'),wire('m','2','s','M'),wire('d','4','r','A'),wire('d','5','r','B1'),wire('d','5','d','6')];S.solve(p,by);assert.equal(p.components[1]._instrument.error,'');near(p.components[2]._currentValue,.012,1e-6);p.wires.pop();S.solve(p,by);assert.match(p.components[1]._instrument.error,/köprü/);near(p.components[2]._currentValue,0)});
test('TX11 excitation and loadcell output settle regardless of component order',()=>{const p=project('weighing-indicator');p.components.unshift({id:'b',typeId:'load-cell',loadWeight:250,loadCapacity:1000});p.wires=[wire('s','P','d','+'),wire('s','M','d','−'),wire('d','EX+','b','EX+'),wire('d','EX−','b','EX−'),wire('b','SIG+','d','S+'),wire('b','SIG−','d','S−'),wire('d','I','m','1'),wire('m','2','d','G')];assert.equal(S.solve(p,by).stable,true);const d=p.components.find(c=>c.id==='d'),m=p.components.find(c=>c.id==='m');near(d._instrument.input,2.5);near(d._instrument.weight,250);near(m._currentValue,.008,1e-6);p.wires.splice(4,1);S.solve(p,by);assert.match(d._instrument.error,/bağlantısı/)});
test('ET4420 hysteresis, SSR and sensor failure follow wired input',()=>{const p=project('temperature-controller',{supply:'LV',input:'PT100',pb:0,set:100,filter:1});p.components.push({id:'r',typeId:'sensor-pt100-2wire',temperature:25});p.wires=[wire('s','P','d','11'),wire('s','M','d','12'),wire('d','9','r','A'),wire('d','10','r','B1'),wire('d','8','d','9')];assert.equal(S.solve(p,by,{now:0}).stable,true);const d=p.components[1];assert.equal(d._controller.main,true);p.components[3].temperature=105;S.solve(p,by,{now:1000});assert.equal(d._controller.main,false);p.wires.pop();S.solve(p,by,{now:2000});assert.match(d._controller.error,/köprü/);assert.equal(d._controller.main,false)});
test('terminal arrays isolate rows; retired definitions remain loadable',()=>{assert.deepEqual(S.conductingPairs({},by['terminal-2-array-3'],new Map(),new Set()),[['1','2'],['3','4'],['5','6']]);for(const id of ['contact-nc','mushroom-nc','coil-relay','plc-io-symbol','fault'])assert.equal(by[id].retiredFromLibrary,true);assert.ok(!by['contact-no'].retiredFromLibrary);assert.equal(by['illuminated-push'].pins.length,4)});
test('UT33D+ measures DC voltage and series current; rejects wrong jack and live resistance',()=>{const p=project('unit-ut33d-plus');p.components[1].meterPosition=4;p.wires=[wire('s','P','d','V'),wire('s','M','d','COM')];S.solve(p,by);const m=p.components[1];near(m._meter.value,24);assert.equal(m._meter.warning,'');m.meterPosition=14;S.solve(p,by);assert.match(m._meter.warning,/enerjisini/);m.meterPosition=10;S.solve(p,by);assert.match(m._meter.warning,/paralel/);p.components.push({id:'r',typeId:'resistor',resistance:1000});p.wires=[wire('s','P','r','1'),wire('r','2','d','V'),wire('s','M','d','COM')];S.solve(p,by);near(m._meter.value,24/1001,1e-6);m.meterPosition=9;S.solve(p,by);assert.match(m._meter.warning,/Prob yuvaları/)});
test('UT33D+ reads an unpowered resistor and open circuit separately',()=>{const p={components:[{id:'d',typeId:'unit-ut33d-plus',meterPosition:15},{id:'r',typeId:'resistor',resistance:1000}],wires:[wire('d','V','r','1'),wire('d','COM','r','2')],junctions:[]};S.solve(p,by);near(p.components[0]._meter.value,1000);p.wires.pop();S.solve(p,by);assert.match(p.components[0]._meter.warning,/Prob/)});
test('both independent thermocouple pairs produce the same nonlinear millivolt output',()=>{const p={components:[{id:'tc',typeId:'thermocouple',temperature:400,coldJunction:25},{id:'v1',typeId:'meter-voltmeter'},{id:'v2',typeId:'meter-voltmeter'}],wires:[wire('tc','+','v1','1'),wire('tc','−','v1','2'),wire('tc','+2','v2','1'),wire('tc','−2','v2','2')],junctions:[]};assert.equal(S.solve(p,by).stable,true);for(const v of p.components.slice(1))near(v._voltageValue,T.mv(400,25)/1000,1e-7);p.components[0].coldJunction=50;S.solve(p,by);near(p.components[2]._voltageValue,T.mv(400,50)/1000,1e-7)});
test('illuminated button lamp has independent supply and survives contact changes',()=>{const p={components:[{id:'s',typeId:'supply-dc-plus'},{id:'b',typeId:'illuminated-push',state:true}],wires:[wire('s','P','b','13'),wire('s','M','b','14')],junctions:[]};S.solve(p,by);assert.equal(p.components[1]._lampActive,false);p.wires=[wire('s','P','b','X1'),wire('s','M','b','X2')];S.solve(p,by);assert.equal(p.components[1]._lampActive,true);p.components[1].state=false;S.solve(p,by);assert.equal(p.components[1]._lampActive,true);p.wires.pop();S.solve(p,by);assert.equal(p.components[1]._lampActive,false)});
test('HT-2 channels are separately scaled and stop on missing supply',()=>{const p=project('sensor-temperature-humidity',{temperature:20,humidity:25,output:'4-20mA'});p.wires=[wire('s','P','d','+'),wire('s','M','d','−'),wire('d','T','m','1'),wire('m','2','d','−')];S.solve(p,by);near(p.components[2]._currentValue,.012,1e-5);p.wires[2].from.p='RH';S.solve(p,by);near(p.components[2]._currentValue,.008,1e-5);p.wires.shift();S.solve(p,by);assert.equal(p.components[1]._instrument.on,false);near(p.components[2]._currentValue,0)});
test('ET4420 digital display-only input drops both relay and SSR outputs',()=>{const p=project('temperature-controller',{supply:'LV',input:'PT100',pb:0,set:100,filter:1,din:'display',controlOutput:'ssr'});p.components.push({id:'r',typeId:'sensor-pt100-2wire',temperature:25});p.wires=[wire('s','P','d','11'),wire('s','M','d','12'),wire('d','9','r','A'),wire('d','10','r','B1'),wire('d','8','d','9')];S.solve(p,by,{now:0});assert.equal(p.components[1]._controller.ssr,true);p.wires.push(wire('d','6','d','7'));S.solve(p,by,{now:1000});assert.equal(p.components[1]._controller.ssr,false);assert.equal(p.components[1]._controller.main,false);assert.equal(p.components[1]._controller.alarm1,false)});
test('open 4–20 mA output has bounded compliance voltage instead of enormous values',()=>{const p=project('converter-pressure',{inputValue:10});p.components[2].typeId='meter-voltmeter';p.wires=[wire('s','P','d','4'),wire('s','M','d','5'),wire('d','7','m','1'),wire('m','2','d','8')];S.solve(p,by);assert.ok(p.components[2]._voltageValue<=24.01);assert.match(p.components[1]._instrument.loadWarning,/yükü/)});
test('NCV senses an AC terminal near the instrument head and ignores DC',()=>{const p={components:[{id:'s',typeId:'supply-1p',x:0,y:0},{id:'m',typeId:'unit-ut33d-plus',meterPosition:8}],wires:[],junctions:[]},pin=by['supply-1p'].pins.find(p=>p.id==='L');p.components[1].x=pin.x-by['unit-ut33d-plus'].w/2;p.components[1].y=pin.y;S.solve(p,by);assert.equal(p.components[1]._meter.display,'EF');p.components[1].x+=300;S.solve(p,by);assert.equal(p.components[1]._meter.beep,false)});
test('old terminal identities migrate to retained instrument definitions without breaking wires',()=>{const p={components:[{id:'d',typeId:'converter-temperature'},{id:'s',typeId:'supply-dc-plus'}],wires:[wire('s','P','d','+24')],junctions:[]};require('../dist/instruments.js').migrate(p,by);assert.equal(p.components[0].typeId,'converter-temperature-legacy-v114');assert.equal(p.wires[0].to.p,'+24')});
test('ET4420 supply variants reject incorrect voltage and unsupported L does not produce an invented reading',()=>{
 const I=require('../dist/instruments.js'),c={id:'d',instrumentSettings:{supply:'LV'}},d=by['temperature-controller'];let volts=24;
 const net={dcVoltage:()=>null,at:(_,pin)=>[{type:'ac',leg:pin==='11'?'L':'N',domain:'test',volts}]};
 assert.equal(I.powered(c,d,net),true);volts=230;assert.equal(I.powered(c,d,net),false);c.instrumentSettings.supply='UV';assert.equal(I.powered(c,d,net),true);
 c.instrumentSettings.input='L';assert.match(I.sensor(c,d,{components:[]},by,net).error,/desteklenmiyor/);
});


test('panel ammeter and voltmeter show live values inside the original material screen',()=>{
  const vd=by['meter-voltmeter'],ad=by['meter-ammeter'];assert.ok(vd&&ad);
  assert.equal(Devices.markup({_voltageValue:24},vd,'material'),'');
  let html=Materials.markup(vd,{id:'v1',_voltageValue:24});assert.match(html,/panel-meter-live-screen/);assert.match(html,/>24\.00</);assert.match(html,/>V</);assert.match(html,/clip-path="url\(#meter-screen-/);
  html=Materials.markup(vd,{id:'v2',_voltageValue:.024});assert.match(html,/>24\.00</);assert.match(html,/>mV</);
  html=Materials.markup(vd,{id:'v3',_signalMv:2.5,_voltageValue:.0025});assert.match(html,/>2\.500</);assert.match(html,/>mV</);
  html=Materials.markup(ad,{id:'a1',_currentValue:.012});assert.match(html,/>12\.00</);assert.match(html,/>mA</);
  html=Materials.markup(ad,{id:'a2',_currentValue:2.3456});assert.match(html,/>2\.346</);assert.match(html,/>A</);
  assert.doesNotMatch(Materials.markup(vd,{id:'off'}),/panel-meter-live-screen/);
});


test('UT61E+ reads generator frequency without adding fake Hz mode to UT33D+',()=>{
 const M=require('../dist/multimeter.js');
 assert.ok(!M.ranges.some(r=>r[0]==='Hz'));
 assert.equal(M.rangesFor({id:'unit-ut61e-plus',multimeterModel:'UT61E+'})[5][0],'Hz');
 const meter={id:'m',typeId:'unit-ut61e-plus',meterPosition:5};
 const fg={id:'fg',typeId:'arduino-signal-generator',generatorEnabled:true,generatorFrequency:1000};
 const red={id:'m-red',typeId:'test-probe-red',probeTarget:{c:'fg',p:'OUT'}};
 const black={id:'m-black',typeId:'test-probe-black',probeTarget:{c:'fg',p:'GND'}};
 const project={components:[meter,fg,red,black],wires:[
  {from:{c:'m',p:'V'},to:{c:'m-red',p:'PLUG'}},
  {from:{c:'m',p:'COM'},to:{c:'m-black',p:'PLUG'}}
 ]};
 const byId={
  'unit-ut61e-plus':{id:'unit-ut61e-plus',kind:'multimeter',multimeterModel:'UT61E+'},
  'arduino-signal-generator':{id:'arduino-signal-generator',arduinoRole:'signal-generator',generatorFrequency:1000},
  'test-probe-red':{id:'test-probe-red'},'test-probe-black':{id:'test-probe-black'}
 };
 const pin=(c,p)=>c.id+':'+p;
 M.measure(meter,byId[meter.typeId],{branches:[],fixed:new Map(),voltages:new Map(),solveGraph:()=>new Map(),acNodes:new Set(),dcNodes:new Set(),pin,project,byId});
 assert.equal(meter._meter.warning,'');
 assert.equal(meter._meter.value,1000);
 assert.equal(meter._meter.display,'1.000');
 assert.equal(meter._meter.unit,'kHz');
 fg.generatorFrequency=10000;
 M.measure(meter,byId[meter.typeId],{branches:[],fixed:new Map(),voltages:new Map(),solveGraph:()=>new Map(),acNodes:new Set(),dcNodes:new Set(),pin,project,byId});
 assert.equal(meter._meter.display,'10.00');
 assert.equal(meter._meter.unit,'kHz');
});
