'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const dist=path.resolve(__dirname,'../dist'),source=require('../dist/tutorial-source-outline.js'),sim=require('../dist/simulation.js'),ctx={window:{}};
for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(fs.readFileSync(path.join(dist,file),'utf8'),ctx,{filename:file});
const defs=Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(x=>[x.id,x]));
function run(id,button,removed){const p=structuredClone(source.byId[id].project);p.components.find(c=>c.id===(id.endsWith('01')?'b':'start')).state=button;if(removed)p.wires=p.wires.filter(w=>w.id!==removed);const r=sim.solve(p,defs,{now:200});assert.equal(r.blocked,false);assert.equal(r.shortCircuit,false);return Object.fromEntries(p.components.map(c=>[c.id,c]));}
test('SC124 relay: control, contact, lamp and broken-wire negatives',()=>{
 const id='electronic-switching-src-01';
 assert.equal(run(id,false).h._powered,false);
 const on=run(id,true);assert.equal(on.k._powered,true);assert.equal(on.q._closed,true);assert.equal(on.h._powered,true);
 assert.equal(run(id,true,'tw2').k._powered,false);
 const brokenLamp=run(id,true,'tw5');assert.equal(brokenLamp.k._powered,true);assert.equal(brokenLamp.h._powered,false);
});
test('SC125 seal-in: start/stop supply and coil interruption',()=>{
 const id='electronic-switching-src-02';
 assert.equal(run(id,false).coil._powered,false);
 const on=run(id,true);assert.equal(on.coil._powered,true);assert.equal(on.hold._closed,true);
 for(const missing of ['tw4','tw6'])assert.equal(run(id,true,missing).coil._powered,false);
});
