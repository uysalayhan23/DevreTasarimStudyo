'use strict';
// P3-01: actual DTS product catalog, unique physical terminal identity.
// This validates cable creation; native electrical Simulation.solve is a separate gate.
const {test}=require('node:test'),assert=require('node:assert/strict');
const Lines=require('../dist/conductors.js');
const catalog=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs').catalog();
assert.ok(catalog['supply-dc-plus']&&catalog['lamp-green'],'real DTS catalog models required');
const base=()=>({components:[{id:'g',typeId:'supply-dc-plus'},{id:'lamp',typeId:'lamp-green'}],wires:[],junctions:[{id:'j1'}]});
const from={c:'g',p:'P'},to={c:'lamp',p:'X1'};
function check(title,mutate,first,second,expected,alterCatalog){
 test('P3-01 unique cable identity: '+title,()=>{
  const p=base();if(mutate)mutate(p);
  const defs=alterCatalog?alterCatalog(catalog):catalog;
  const original=JSON.stringify(p);
  assert.equal(Lines.check(p,defs,first,second).ok,expected);
  assert.equal(Lines.plan(p,defs,first,second,'#808080',1.5).ok,expected);
  assert.equal(JSON.stringify(p),original,'validation must not mutate project');
 });
}
check('valid supply to lamp',null,from,to,true);
check('valid junction to lamp',null,{j:'j1'},to,true);
check('duplicate source component rejected',p=>p.components.push({id:'g',typeId:'supply-dc-plus'}),from,to,false);
check('duplicate target component rejected',p=>p.components.push({id:'lamp',typeId:'lamp-green'}),from,to,false);
check('duplicate junction rejected',p=>p.junctions.push({id:'j1'}),{j:'j1'},to,false);
check('duplicate catalog terminal rejected',null,from,to,false,defs=>({
 ...defs,'supply-dc-plus':{...defs['supply-dc-plus'],pins:[...defs['supply-dc-plus'].pins,{...defs['supply-dc-plus'].pins.find(p=>p.id==='P')}]}
}));
check('unrelated duplicate ID does not block valid endpoints',p=>p.components.push({id:'z',typeId:'lamp-green'},{id:'z',typeId:'lamp-green'}),from,to,true);
check('unknown terminal rejected',null,from,{c:'lamp',p:'invalid'},false);
check('same physical terminal rejected',null,from,from,false);
check('mixed junction/component endpoint rejected',null,{j:'j1',c:'g',p:'P'},to,false);
