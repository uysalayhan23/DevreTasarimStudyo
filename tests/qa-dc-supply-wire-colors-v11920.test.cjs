'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Lines=require('../dist/conductors.js');
const defs={
 dc:{id:'dc',kind:'supply-dc-plus',pins:[{id:'P'},{id:'M'}]},
 bench:{id:'bench',kind:'generic',arduinoRole:'bench-supply',pins:[{id:'P'},{id:'M'}]},
 pwm:{id:'pwm',kind:'pwm-generator',pins:[{id:'V+'},{id:'GND'},{id:'OUT'}]},
 sensor:{id:'sensor',kind:'sensor',pins:[{id:'BN'},{id:'BU'},{id:'BK'}]},
 motor:{id:'motor',kind:'motor-dc',pins:[{id:'+'},{id:'−'}]},
 load:{id:'load',kind:'resistor',pins:[{id:'1'},{id:'2'}]},
 ac:{id:'ac',kind:'supply',pins:[{id:'L'},{id:'N'}]},
 meter:{id:'meter',kind:'multimeter',pins:[{id:'V'},{id:'COM'}]},
 rect:{id:'rect',kind:'rectifier',pins:[{id:'+'},{id:'−'}]}
};
const wire=(id,a,ap,b,bp,color='#8b5a2b',role='CONTROL')=>
 ({id,from:{c:a,p:ap},to:{c:b,p:bp},color,role,size:'1.5 mm²',points:[]});
const fresh=()=>({components:Object.keys(defs).map(id=>({id,typeId:id})),wires:[],junctions:[]});
const rgb={pos:'#e53935',neg:'#111827'};
test('loaded legacy lesson and editable project wires inherit DC supply colors',()=>{
 const p=fresh();p.wires=[
  wire('wp','dc','P','pwm','V+'),
  wire('wm','dc','M','pwm','GND'),
  wire('ws','pwm','OUT','load','1','#8b5cf6','SIGNAL'),
  wire('wa','ac','L','meter','V','#e53935','L1'),
  wire('wmotor','load','2','motor','−','#43a047','SIGNAL')
 ];
 Lines.initialize(p,defs);
 assert.equal(p.wires[0].color,rgb.pos);
 assert.equal(p.wires[1].color,rgb.neg);
 assert.equal(p.wires[2].color,'#8b5cf6');
 assert.equal(p.wires[3].color,'#e53935');
 assert.notEqual(p.wires[4].color,rgb.neg,'switched motor minus is not automatically GND');
 p.wires[0].color='#8b5a2b';p.wires[1].color='#43a047';
 Lines.synchronize(p,defs);
 assert.equal(p.wires[0].color,rgb.pos);assert.equal(p.wires[1].color,rgb.neg);
});
test('new wire and reconnect planning prefers fixed terminal colors',()=>{
 const p=fresh();Lines.initialize(p,defs);
 assert.equal(Lines.plan(p,defs,{c:'dc',p:'P'},{c:'load',p:'1'},'#808080','1.5').color,rgb.pos);
 assert.equal(Lines.plan(p,defs,{c:'bench',p:'M'},{c:'pwm',p:'GND'},'#e53935','1.5').color,rgb.neg);
 assert.equal(Lines.plan(p,defs,{c:'pwm',p:'OUT'},{c:'load',p:'2'},'#8b5cf6','1.5').color,'#8b5cf6');
});
test('locked DC power polarity rejects manual recoloring',()=>{
 const p=fresh();p.wires=[wire('red','dc','P','load','1'),wire('black','dc','M','load','2')];
 Lines.initialize(p,defs);
 assert.equal(Lines.recolor(p,defs,'red','#8b5a2b').ok,false);
 assert.equal(Lines.recolor(p,defs,'black','#e53935').ok,false);
 assert.equal(p.wires[0].color,rgb.pos);assert.equal(p.wires[1].color,rgb.neg);
});
test('sensor and rectifier supply terminal colors are polarity aware',()=>{
 const p=fresh();p.wires=[
  wire('bn','sensor','BN','load','1'),wire('bu','sensor','BU','load','2'),
  wire('rplus','rect','+','motor','+'),wire('rminus','rect','−','motor','−')
 ];
 Lines.initialize(p,defs);
 assert.equal(p.wires[0].color,rgb.pos);
 assert.equal(p.wires[1].color,rgb.neg);
 assert.equal(p.wires[2].color,rgb.pos);
 assert.equal(p.wires[3].color,rgb.neg);
});
test('DC positive and negative cannot be joined without a conflict',()=>{
 const p=fresh();
 const attempt=Lines.plan(p,defs,{c:'dc',p:'P'},{c:'pwm',p:'GND'},'#808080','1.5');
 assert.equal(attempt.ok,false);
});
