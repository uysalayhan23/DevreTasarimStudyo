'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');

function runtime(){
 const ctx={console};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
 for(const f of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-pedagogy.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',f),'utf8'),ctx,{filename:f});
 return ctx.DTSTutorialLessons;
}

test('DC kaynakları ve bağlantıları final project is exact and simulation-ready',()=>{
 const L=runtime(),l=L.lessons.find(x=>x.title.toLocaleLowerCase('tr-TR')==='dc kaynakları ve bağlantıları');
 assert.ok(l);assert.equal(l.id,'dc-circuits-src-02');assert.equal(l.kind,'wiring');assert.equal(l.project.tutorialLesson.phase,'demo');
 assert.equal(l.project.components.length,5);
 const c=Object.fromEntries(l.project.components.map(x=>[x.id,x]));
 assert.equal(c.g1.typeId,'arduino-bench-supply');assert.equal(c.g1.dcVoltage,24);assert.equal(c.r1.typeId,'resistor');assert.equal(c.r1.resistance,1000);
 assert.equal(c.v1.typeId,'unit-ut33d-plus');assert.equal(c.v1.meterPosition,4);
 assert.equal(c['v1-red'].typeId,'test-probe-red');assert.deepEqual(JSON.parse(JSON.stringify(c['v1-red'].probeTarget)),{c:'r1',p:'1'});
 assert.equal(c['v1-black'].typeId,'test-probe-black');assert.deepEqual(JSON.parse(JSON.stringify(c['v1-black'].probeTarget)),{c:'r1',p:'2'});
 assert.equal(l.project.tutorialExplore.expectedCurrentA,.024);assert.equal(l.project.tutorialExplore.expectedPowerW,.576);assert.equal(l.project.tutorialExplore.freeProbes,true);
 assert.equal(l.steps.length,2,'guided rebuild only teaches the +24V/load/0V power path');
 assert.equal(l.project.wires.filter(w=>w.probeLead).length,2,'physical probe leads stay present');
 assert.equal(l.pedagogyReview.version,'v1.19.20-pedagogy17-dc-source-rich');
});

test('rich source coach contains prediction measurement errors applications and guided rebuild',()=>{
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 for(const t of ['ÖNCE TAHMİN ET','24 mA','0,576 W','Gerilim ölçümünü keşfet','Sık yapılan 4 hata','Bu mantığı nerede göreceksin?','Öğrenci görevi','data-dc-source-measure="source"','data-dc-source-measure="free"'])assert.ok(m.includes(t),t);
 assert.match(m,/function isProbeLeadWire/);assert.match(m,/filter\(w=>!isProbeLeadWire\(l,w\)\)/);
 assert.match(m,/project\.wires=clone\(\(l\.project\.wires\|\|\[\]\)\.filter\(w=>isProbeLeadWire\(l,w\)\)\)/);
 assert.match(m,/tutorial-pedagogy\.js\?v=1\.19\.20-pedagogy65-lm358-output/);
});

test('source rich CSS and cache chain are current',()=>{
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8'),h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8'),b=fs.readFileSync(path.join(root,'dist','tutorial-bootstrap.js'),'utf8');
 for(const t of ['tutorial-source-mission','tutorial-source-predict','tutorial-source-measure-grid','tutorial-source-compare','tutorial-source-errors'])assert.ok(c.includes(t),t);
 assert.match(h,/tutorial\.css\?rev=20261010-measure-batch-d2/);assert.match(h,/tutorial-bootstrap\.js\?rev=20261012-practice-n1/);
 assert.match(b,/tutorial-mode\.js\?v=20261012-practice-n1/);
});
