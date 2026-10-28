'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Lines=require('../dist/conductors.js');
const byId={
 a:{id:'a',kind:'switch-no',pins:[{id:'1'}]},
 b:{id:'b',kind:'lamp',pins:[{id:'2'}]}
};
const project=()=>({
 components:[{id:'c1',typeId:'a'},{id:'c2',typeId:'b'}],
 wires:[],junctions:[{id:'j1'}]
});
const pin=(c,p)=>({c,p});
const cases=[
 ['two real terminals',pin('c1','1'),pin('c2','2'),true],
 ['real junction',pin('c1','1'),{j:'j1'},true],
 ['nonexistent terminal',pin('c1','WRONG'),pin('c2','2'),false],
 ['nonexistent component',pin('missing','1'),pin('c2','2'),false],
 ['nonexistent junction',{j:'missing'},pin('c2','2'),false],
 ['same terminal',pin('c1','1'),pin('c1','1'),false],
 ['same junction',{j:'j1'},{j:'j1'},false],
 ['blank terminal',pin('c1',''),pin('c2','2'),false]
];
for(const [name,from,to,expected] of cases){
 test('P3-01 endpoint check and plan: '+name,()=>{
  assert.equal(Lines.check(project(),byId,from,to).ok,expected);
  assert.equal(Lines.plan(project(),byId,from,to,'#808080',1.5).ok,expected);
 });
}
