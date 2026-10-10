'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const EA=require('../dist/energy-analyzer.js');

function fixture(loadCharacter='inductive',q=138){
 const analyzer={id:'ea1',typeId:'energy-analyzer-1p'};
 const ct={id:'ct1',typeId:'current-transformer-edu-1p',_primaryCurrent:1};
 const load={id:'z1',typeId:'energy-training-load-1p',_energyLoad:{currentA:1,activePowerW:184,reactivePowerVar:q,apparentPowerVA:230,powerFactor:.8,frequencyHz:50,loadCharacter}};
 const project={components:[analyzer,ct,load],wires:[
  {from:{c:'g1',p:'L'},to:{c:'ea1',p:'L'}},
  {from:{c:'g1',p:'N'},to:{c:'ea1',p:'N'}},
  {from:{c:'ct1',p:'S1'},to:{c:'ea1',p:'S1'}},
  {from:{c:'ct1',p:'S2'},to:{c:'ea1',p:'S2'}}
 ]};
 const byId={
  'energy-analyzer-1p':{kind:'energy-analyzer'},
  'current-transformer-edu-1p':{kind:'current-transformer'},
  'energy-training-load-1p':{kind:'energy-training-load'}
 };
 const pin=(c,p)=>c.id+':'+p,voltages=new Map([['ea1:L',[230,0]],['ea1:N',[0,0]]]);
 return {analyzer,ct,load,project,byId,pin,voltages};
}

test('energy analyzer returns coherent inductive power values',()=>{
 const x=fixture('inductive',138),r=EA.measure(x.analyzer,x.byId[x.analyzer.typeId],{...x,now:1000});
 assert.equal(r.warning,'');
 assert.equal(r.voltageV,230);
 assert.equal(r.currentA,1);
 assert.equal(r.apparentPowerVA,230);
 assert.equal(r.activePowerW,184);
 assert.equal(r.reactivePowerVar,138);
 assert.equal(r.powerFactor,.8);
 assert.equal(r.frequencyHz,50);
 assert.equal(r.loadCharacter,'inductive');
});

test('energy analyzer preserves capacitive reactive-power sign',()=>{
 const x=fixture('capacitive',-138),r=EA.measure(x.analyzer,x.byId[x.analyzer.typeId],{...x,now:1000});
 assert.equal(r.reactivePowerVar,-138);
 assert.equal(r.powerFactor,.8);
});

test('energy analyzer accumulates active energy only while fully connected',()=>{
 const x=fixture('inductive',138);
 EA.measure(x.analyzer,x.byId[x.analyzer.typeId],{...x,now:1000});
 const r=EA.measure(x.analyzer,x.byId[x.analyzer.typeId],{...x,now:1000+3600000});
 assert.equal(r.energyWh,184);
 x.project.wires=x.project.wires.filter(w=>w.to?.p!=='S2');
 const before=r.energyWh,broken=EA.measure(x.analyzer,x.byId[x.analyzer.typeId],{...x,now:1000+7200000});
 assert.match(broken.warning,/tamamlanmamış/);
 assert.equal(broken.energyWh,before);
});
