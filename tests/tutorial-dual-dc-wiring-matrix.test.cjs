'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
const lessons=require('../dist/tutorial-source-outline.js');
const ctx={window:{DTSTutorialLessons:JSON.parse(JSON.stringify(lessons))}};
vm.runInNewContext(read('tutorial-dual-dc-batch-l.js'),ctx,{filename:'tutorial-dual-dc-batch-l.js'});
for(let n=1;n<=4;n++)test('dual-dc-'+n+' guided terminals, narrative and negative wiring',()=>{
 const l=ctx.window.DTSTutorialLessons.byId['dual-dc-'+n],p=l.project;
 const components=new Map(p.components.map(c=>[c.id,c]));
 const endpoints=p.wires.map(w=>JSON.stringify([w.from.c,w.from.p,w.to.c,w.to.p]));
 assert.equal(new Set(endpoints).size,p.wires.length);
 for(const w of p.wires){assert.ok(components.has(w.from.c));assert.ok(components.has(w.to.c));}
 assert.equal(l.steps.length,p.wires.length);
 for(const s of l.steps)assert.ok(endpoints.includes(JSON.stringify([s.from.c,s.from.p,s.to.c,s.to.p])));
 assert.ok(l.explanation.length>100);assert.equal(l.beginnerSteps.length,4);
 assert.equal(l.quiz.answer,0);assert.equal(l.quiz.options.length,3);
 const isCommon=w=>(w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='g2'&&w.to.p==='M')||(w.to.c==='g1'&&w.to.p==='M'&&w.from.c==='g2'&&w.from.p==='M');
 const common=p.wires.filter(isCommon);
 if(n===2||n===4){assert.equal(common.length,1);const broken=p.wires.filter(w=>!isCommon(w));assert.equal(broken.length,p.wires.length-1);assert.equal(broken.some(isCommon),false);}
 else{assert.equal(common.length,0);assert.equal(p.intentionalElectricalIslands,2);}
});
