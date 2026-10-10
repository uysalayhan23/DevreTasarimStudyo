'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Labs=require('../dist/tutorial-labs.js'),root=path.join(__dirname,'..');

test('transformer lab teaches step-down, step-up and V/f flux effect',()=>{
 const d=Labs.calcTransformer({n1:1000,n2:104,vin:230,freq:50,loadPct:0});assert.equal(d.actualMode,'step-down');assert.ok(Math.abs(d.v2Ideal-23.92)<.01);
 const u=Labs.calcTransformer({n1:500,n2:870,vin:230,freq:50,loadPct:0});assert.equal(u.actualMode,'step-up');assert.ok(Math.abs(u.v2Ideal-400.2)<.05);
 const a=Labs.calcTransformer({n1:500,n2:250,vin:230,freq:50,coreAreaCm2:20,bMax:1.5}),b=Labs.calcTransformer({n1:500,n2:250,vin:230,freq:25,coreAreaCm2:20,bMax:1.5});
 assert.ok(Math.abs(b.fluxDensity/a.fluxDensity-2)<1e-9);assert.equal(b.saturation,true);
});
test('transformer lab exposes loading, regulation and losses',()=>{
 const r=Labs.calcTransformer({n1:1000,n2:100,vin:230,freq:50,ratedVA:1000,loadPct:100,pf:.8,efficiency:90,regulationPct:5,coreLossW:20});
 assert.ok(r.v2<r.v2Ideal);assert.ok(r.i1>0&&r.i2>0);assert.ok(r.pinW>r.poutW);assert.ok(Math.abs(r.regulationActual-5)<1e-9);
});
test('motor lab covers induction synchronous and DC',()=>{
 const i=Labs.calcMotor({type:'induction',voltage:400,ratedVoltage:400,freq:50,poles:4,loadPct:100,ratedKW:2.2,efficiency:88,pf:.82,slipPct:4,connection:'star'});
 assert.equal(i.synchronousSpeed,1500);assert.ok(i.speed<1500&&i.slipPct>0&&i.current>0&&i.torque>0);
 const s=Labs.calcMotor({type:'synchronous',voltage:400,ratedVoltage:400,freq:50,poles:4,loadPct:80,ratedKW:3,efficiency:92,pf:.9});assert.equal(s.speed,1500);assert.equal(s.slipPct,0);
 const d1=Labs.calcMotor({type:'dc',voltage:230,ratedVoltage:230,ratedSpeed:1500,fieldPct:100,loadPct:50,ratedKW:1.5}),d2=Labs.calcMotor({type:'dc',voltage:115,ratedVoltage:230,ratedSpeed:1500,fieldPct:100,loadPct:50,ratedKW:1.5});assert.ok(d1.speed>d2.speed);
});
test('tutorial dashboard contains both interactive lab pages',()=>{
 const h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8'),c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8'),j=fs.readFileSync(path.join(root,'dist','tutorial-labs.js'),'utf8');
 for(const x of ['tutorialLabHub','tutorialLabPanel','data-tutorial-lab-open="transformer"','data-tutorial-lab-open="motor"','tutorial-labs.js?rev=20261008-electric-machines-labs1'])assert.ok(h.includes(x),x);
 for(const x of ['Transformatörler Laboratuvarı','Motorlar Laboratuvarı','Step-down','Asenkron','Senkron','DC motor','V/f','Bmax'])assert.ok(j.includes(x),x);
 for(const x of ['tutorial-lab-hub','lab-workbench','transformer-graphic','motor-graphic'])assert.ok(c.includes(x),x);
});
