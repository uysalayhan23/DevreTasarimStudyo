'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../dist/conductors.js');
test('recolor refuses damaged catalog instead of claiming success',()=>{
 const project={components:[{id:'a',typeId:'a'},{id:'b',typeId:'b'}],junctions:[],wires:[{id:'W',from:{c:'a',p:'1'},to:{c:'b',p:'1'},color:'#808080',role:'CONTROL'}]};
 const byId={a:{id:'a',kind:'terminal',pins:[null]},b:{id:'b',kind:'terminal',pins:[{id:'1'}]}};
 assert.equal(C.recolor(project,byId,'W','#ff0000',1.5).ok,false);
 assert.equal(project.wires[0].color,'#808080');
});
