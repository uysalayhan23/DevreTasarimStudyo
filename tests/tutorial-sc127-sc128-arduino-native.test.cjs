'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const dist=path.resolve(__dirname,'../dist'),source=require('../dist/tutorial-source-outline.js'),sim=require('../dist/simulation.js'),ctx={window:{}};
for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(fs.readFileSync(path.join(dist,file),'utf8'),ctx,{filename:file});
const defs=Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
function check(id,pressed,broken,reverse){
 const p=structuredClone(source.byId[id].project);p.components.find(c=>c.id==='btn').state=pressed;
 if(broken)p.wires=p.wires.filter(w=>!((w.from.c===broken[0]&&w.from.p===broken[1])||(w.to.c===broken[0]&&w.to.p===broken[1])));
 if(reverse)for(const w of p.wires){if(w.from.c==='d'&&w.from.p==='K')w.from.p='A';else if(w.to.c==='d'&&w.to.p==='K')w.to.p='A';else if(w.from.c==='d'&&w.from.p==='A')w.from.p='K';else if(w.to.c==='d'&&w.to.p==='A')w.to.p='K';}
 const outcome=sim.solve(p,defs,{now:200});const q=p.components.find(c=>c.id==='q'),m=p.components.find(c=>c.id==='m');return {outcome,q,m};
}
for(const id of ['electronic-switching-src-04','electronic-switching-src-05'])test(id+' KY-004/BD139/130 motor ON/OFF, open-wire and reversed diode',()=>{
 const off=check(id,false);assert.equal(off.outcome.motorPowered,false);assert.equal(off.m._active,false);
 const on=check(id,true);assert.equal(on.outcome.nativeModel,'sc127-low-voltage-bd139');assert.equal(on.outcome.motorPowered,true);assert.equal(on.q._bjtOn,true);assert.equal(on.m._active,true);assert.equal(on.outcome.shortCircuit,false);
 for(const pin of [['q','1'],['q','3'],['btn','VCC'],['m','+']]){const broken=check(id,true,pin);assert.equal(broken.m._active,false,'broken '+pin.join('/'));assert.equal(broken.outcome.shortCircuit,false);}
 const reversed=check(id,true,null,true);assert.equal(reversed.m._active,false);assert.equal(reversed.outcome.shortCircuit,true);assert.equal(reversed.outcome.blocked,true);
});
