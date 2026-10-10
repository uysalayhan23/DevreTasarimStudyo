'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');

function runtime(){
 const ctx={console};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
 for(const file of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-pedagogy.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx,{filename:file});
 return ctx.DTSTutorialLessons;
}

test('Pillerin seri bağlanması uses two functional 1.5 V cells and guided wiring',()=>{
 const L=runtime(),l=L.lessons.find(x=>x.topicId==='dc-circuits'&&x.title.toLocaleLowerCase('tr-TR')==='pillerin seri bağlanması');
 assert.ok(l);assert.equal(l.id,'dc-circuits-src-03');assert.equal(l.kind,'wiring');assert.equal(l.project.tutorialLesson.phase,'demo');
 const c=Object.fromEntries(l.project.components.map(x=>[x.id,x]));
 assert.equal(c.b1.typeId,'tutorial-battery');assert.equal(c.b1.cellVoltage,1.5);assert.equal(c.b1.seriesPackId,'SERIES-A');assert.equal(c.b1.seriesIndex,0);
 assert.equal(c.b2.typeId,'tutorial-battery');assert.equal(c.b2.cellVoltage,1.5);assert.equal(c.b2.seriesIndex,1);
 assert.equal(c.r1.typeId,'resistor');assert.equal(c.r1.resistance,100);
 assert.equal(c.v1.typeId,'unit-ut33d-plus');assert.equal(c.v1.meterPosition,3);
 assert.deepEqual(JSON.parse(JSON.stringify(c['v1-red'].probeTarget)),{c:'b1',p:'+'});assert.deepEqual(JSON.parse(JSON.stringify(c['v1-black'].probeTarget)),{c:'b2',p:'−'});
 assert.equal(l.project.tutorialExplore.packVoltage,3);assert.equal(l.project.tutorialExplore.expectedCurrentA,.03);
 assert.equal(l.steps.length,3);assert.equal(l.project.wires.filter(w=>w.probeLead).length,2);
 assert.equal(l.pedagogyReview.version,'v1.19.20-pedagogy18-battery-series-rich');
});

test('tutorial battery has dedicated material art and battery simulation',()=>{
 const tc=fs.readFileSync(path.join(root,'dist','tutorial-components.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','materials.js'),'utf8');
 const s=fs.readFileSync(path.join(root,'dist','simulation.js'),'utf8');
 assert.match(tc,/kind:'battery'/);assert.doesNotMatch(tc,/tutorial-battery[^\n]+visualOnly:true/);
 assert.match(m,/tutorial-battery-material/);assert.match(m,/ALKALINE/);assert.match(m,/DC HÜCRE/);
 assert.match(s,/sources=new Set\(\['supply','supply3','supply-dc-plus','supply-dc-minus','battery'\]\)/);
 assert.match(s,/battery-pack:/);assert.match(s,/seriesPackId/);assert.match(s,/linked=pack\.length>1/);
});

test('rich series-battery coach teaches concept measurement and rebuild',()=>{
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8'),c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 for(const token of ['Seride gerilimler toplanır','1,5 + 1,5 = <b>3,0 V</b>','I₁ = I₂ = Iyük','data-battery-series-measure="cell1"','data-battery-series-measure="pack"','Seri devreyi kendin kur','Gerilim artar, kapasite ne olur?'])assert.ok(m.includes(token),token);
 for(const token of ['tutorial-battery-pack','tutorial-battery-equations','tutorial-battery-measure','tutorial-battery-errors','tutorial-battery-current'])assert.ok(c.includes(token),token);
 assert.match(m,/tutorial-pedagogy\.js\?v=1\.19\.20-pedagogy65-lm358-output/);
});

test('series-battery cache chain is current',()=>{
 const h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8'),b=fs.readFileSync(path.join(root,'dist','tutorial-bootstrap.js'),'utf8');
 assert.match(h,/tutorial\.css\?rev=20261010-measure-batch-d2/);
 assert.match(h,/tutorial-components\.js\?rev=20261009-energy-rich1/);
 assert.match(h,/materials\.js\?rev=20261010-real-visuals1/);
 assert.match(h,/simulation\.js\?rev=20261010-real-ics1/);
 assert.match(h,/tutorial-bootstrap\.js\?rev=20261010-control-batch-f1/);
 assert.match(b,/tutorial-mode\.js\?v=1\.19\.20-control-batch-f1/);
});
