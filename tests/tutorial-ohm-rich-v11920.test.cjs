'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function runtime(){
 const ctx={console};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
 for(const file of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-source-outline.js','tutorial-pedagogy.js'])
  vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx,{filename:file});
 return ctx.DTSTutorialLessons;
}
test('Ohm Kanunu deneyi is an adjustable-source measurement laboratory',()=>{
 const L=runtime(),l=L.byId['dc-circuits-src-06'];assert.ok(l);assert.equal(l.title,'Ohm Kanunu deneyi');assert.equal(l.kind,'explore');
 const c=Object.fromEntries(l.project.components.map(x=>[x.id,x]));
 assert.equal(c.g.typeId,'arduino-bench-supply');assert.equal(c.g.dcVoltage,24);assert.equal(c.g.currentLimit,1);
 assert.equal(c.r.resistance,120);assert.equal(c.a.typeId,'unit-ut33d-plus');assert.equal(c.a.meterPosition,9);
 assert.equal(c.v.typeId,'unit-ut33d-plus');assert.equal(c.v.meterPosition,4);
 assert.deepEqual(JSON.parse(JSON.stringify(c['a-red'].probeTarget)),{c:'g',p:'P'});assert.deepEqual(JSON.parse(JSON.stringify(c['a-black'].probeTarget)),{c:'r',p:'1'});
 assert.deepEqual(JSON.parse(JSON.stringify(c['v-red'].probeTarget)),{c:'r',p:'1'});assert.deepEqual(JSON.parse(JSON.stringify(c['v-black'].probeTarget)),{c:'r',p:'2'});
 assert.equal(l.project.tutorialExplore.type,'ohm-law-rich');
 assert.deepEqual(Array.from(l.project.tutorialExplore.voltageSteps),[6,12,18,24]);
 assert.deepEqual(Array.from(l.project.tutorialExplore.resistanceSteps),[120,240,470]);
 assert.equal(l.pedagogyReview.version,'v1.19.20-pedagogy21-ohm-rich');
});
test('all tutorial generic positive DC sources are upgraded to the adjustable bench supply',()=>{
 const L=runtime(),all=[...L.lessons,...(L.supplementalLessons||[])],old=[];
 for(const l of all)for(const c of l.project?.components||[])if(c.typeId==='supply-dc-plus')old.push(l.id+':'+c.id);
 assert.deepEqual(old,[]);
 assert.ok(all.flatMap(l=>l.project?.components||[]).filter(c=>c.typeId==='arduino-bench-supply').length>100);
});
test('Ohm rich UI exposes voltage and resistance experiments',()=>{
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8'),c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 for(const token of ['tutorial-ohm-rich','data-ohm-voltage','data-ohm-resistance','Ayarlanabilir DC güç kaynağı','I = V / R','setOhmVoltage','setOhmResistance'])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-ohm-live','.tutorial-ohm-choice','.tutorial-ohm-formulas','.tutorial-ohm-measure','.tutorial-ohm-observe'])assert.ok(c.includes(token),token);
 assert.match(m,/tutorial-pedagogy\.js\?v=1\.19\.20-pedagogy65-lm358-output/);
});
test('Ohm rich cache chain is current',()=>{
 const h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8'),b=fs.readFileSync(path.join(root,'dist','tutorial-bootstrap.js'),'utf8');
 assert.match(h,/tutorial\.css\?rev=20261010-measure-batch-b1/);
 assert.match(h,/tutorial-bootstrap\.js\?rev=20261010-lm358-output1/);
 assert.match(b,/tutorial-mode\.js\?v=1\.19\.20-measure-batch-b1/);
});
