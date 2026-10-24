'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),ids=L.lessons.slice(202,222).map(l=>l.id),clone=o=>JSON.parse(JSON.stringify(o));
const snapshots=new Map(ids.map(id=>[id,JSON.stringify(L.byId[id])]));
const script=fs.readFileSync(path.join(__dirname,'../dist/tutorial-sc203-sc222-specific.js'),'utf8');
const ctx={window:{DTSTutorialLessons:L}};vm.runInNewContext(script,ctx);
const protectedAudio=new Set(Array.from({length:6},(_,i)=>'oscillator-filter-apps-src-'+String(i+25).padStart(2,'0')));
test('SC203-222 evidence: unique true curriculum identities, 6 native audio sources fully protected',()=>{
 assert.equal(ids.length,20);assert.equal(new Set(ids).size,20);
 const expected=['oscillator-filter-apps-src-22','oscillator-filter-apps-src-23','oscillator-filter-apps-src-24',...Array.from({length:6},(_,i)=>'oscillator-filter-apps-src-'+String(i+25).padStart(2,'0')),...Array.from({length:11},(_,i)=>'digital-logic-apps-src-'+String(i+1).padStart(2,'0'))];
 assert.deepEqual(ids,expected);
 for(const id of protectedAudio)assert.equal(JSON.stringify(L.byId[id]),snapshots.get(id),'protected accepted sound lesson mutated: '+id);
});
for(let i=0;i<20;i++)test('SC'+(203+i)+' scoped story/native or conceptual evidence',()=>{
 const id=ids[i],l=L.byId[id],before=JSON.parse(snapshots.get(id));
 const wired=new Set([205,206,207,209,210,211]);
 assert.equal(l.kind,wired.has(203+i)?'wiring':'quiz');
 if(wired.has(203+i))assert.ok(l.project.wires.length>0);
 else{assert.equal(l.project.wires.length,0);assert.equal(l.steps.length,0);}
 assert.notEqual(l.pedagogyReview?.physicalAcceptance,true,'No actual 3D acceptance: '+id);
 if(protectedAudio.has(id))return;
 assert.equal(l.sc203Sc222Specific,'20261024-sc203-sc222-1');
 assert.match(l.beginnerSteps[0],/^Günlük örnek: /);
 assert.ok(l.explanation.endsWith(before.explanation));
 assert.equal(l.beginnerSteps.length,(before.beginnerSteps||[]).length+1);
 assert.equal(JSON.stringify(l.project),JSON.stringify(before.project));
 assert.equal(JSON.stringify(l.steps),JSON.stringify(before.steps));
 assert.equal(JSON.stringify(l.pedagogyReview),JSON.stringify(before.pedagogyReview));
 if([203,204].includes(i+203))assert.notEqual(l.quiz.question,before.quiz.question,'FM question must be specific');
 else assert.equal(JSON.stringify(l.quiz),JSON.stringify(before.quiz));
});
test('SC205 LM358P catalogue and negative V+ interruption are valid; do not assume a full power-return PASS',()=>{
 const p=clone(L.byId['oscillator-filter-apps-src-24'].project),u=p.components.find(c=>c.typeId==='lm358p-dip8');
 assert.ok(u);assert.equal(p.wires.length,18);
 for(const w of p.wires)for(const e of [w.from,w.to]){
  const c=p.components.find(c=>c.id===e.c),d=defs[c?.typeId];
  assert.ok(d?.pins.some(pin=>pin.id===e.p),'bad catalog pin '+e.c+'/'+e.p);
 }
 const normal=Sim.solve(p,defs,{now:1000});assert.ok(normal.stable&&!normal.blocked&&!normal.shortCircuit);
 assert.equal(u._opampPowered,true);
 const missingPlus=clone(L.byId['oscillator-filter-apps-src-24'].project);
 missingPlus.wires=missingPlus.wires.filter(w=>!(w.to.c==='u1'&&w.to.p==='8'));
 assert.equal(missingPlus.wires.length,17);
 const cut=Sim.solve(missingPlus,defs,{now:1000});assert.ok(cut.stable&&!cut.blocked&&!cut.shortCircuit);
 assert.notEqual(missingPlus.components.find(c=>c.id==='u1')._opampPowered,true);
});
test('SC203-222 story overlay is idempotent and placed after source/truth layers',()=>{
 const before=L.byId[ids[0]].beginnerSteps.length;
 vm.runInNewContext(script,ctx);
 assert.equal(L.byId[ids[0]].beginnerSteps.length,before);
 const loader=fs.readFileSync(path.join(__dirname,'../dist/tutorial-mode.js'),'utf8');
 const first=loader.indexOf('tutorial-sc183-sc202-stories.js?v='),second=loader.indexOf('tutorial-sc203-sc222-specific.js?v=');
 assert.ok(first>=0&&second>first,'new lesson layer must load after prior accepted layers');
});
