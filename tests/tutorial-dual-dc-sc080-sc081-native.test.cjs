'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),vm=require('node:vm');
const base=path.join(__dirname,'../dist'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
const source=require('../dist/tutorial-source-outline.js'),Simulation=require('../dist/simulation.js');
const ctx={window:{}};
for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(file),ctx,{filename:file});
const definitions=Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
function solve(n,enabled,without){const p=structuredClone(source.byId['dual-dc-'+n].project);p.components.find(c=>c.id===(n===3?'b':'s')).state=enabled;if(without)p.wires=p.wires.filter(w=>w.id!==without);const result=Simulation.solve(p,definitions,{now:200});assert.equal(result.blocked,false);assert.equal(result.shortCircuit,false);return Object.fromEntries(p.components.map(c=>[c.id,c]));}
test('SC080: pushbutton drives separate K1 coil and G2 contact load',()=>{
 const off=solve(3,false),on=solve(3,true);
 assert.equal(off.k._powered,false);assert.equal(off.q._closed,false);assert.equal(off.h._powered,false);
 assert.equal(on.k._powered,true);assert.equal(on.q._closed,true);assert.equal(on.h._powered,true);
 const coilBroken=solve(3,true,'tw2'),loadBroken=solve(3,true,'tw5');
 assert.equal(coilBroken.k._powered,false);assert.equal(coilBroken.h._powered,false);
 assert.equal(loadBroken.k._powered,true);assert.equal(loadBroken.h._powered,false);
 assert.equal(source.byId['dual-dc-3'].project.intentionalElectricalIslands,2);
});
test('SC081: common-0V NPN sensor sinks G2 lamp only when actuated',()=>{
 const off=solve(4,false),on=solve(4,true);
 assert.equal(off.s._sensorSupply,'ok');assert.equal(off.h._powered,false);
 assert.equal(on.s._sensorSupply,'ok');assert.equal(on.h._powered,true);
 for(const lead of ['tw1','tw5'])assert.equal(solve(4,true,lead).h._powered,false);
});
