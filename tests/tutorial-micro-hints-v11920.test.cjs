'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../dist/tutorial-micro-hints.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../dist/tutorial.css'),'utf8');
const mode=fs.readFileSync(path.join(__dirname,'../dist/tutorial-mode.js'),'utf8');
const loader=fs.readFileSync(path.join(__dirname,'../dist/tutorial-bootstrap.js'),'utf8');
function fixture(){
 const nodes=new Map(),handlers={},classes=new Set();
 const doc={readyState:'complete',body:{classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k)}},
  querySelector(sel){return sel.startsWith('#')?nodes.get(sel.slice(1))||null:null},
  querySelectorAll(sel){return sel==='#tutorialReferenceStage .tutorial-ref-callout'?this.cards||[]:[]},
  createElement(tag){const n={tag,id:'',className:'',hidden:false,style:{},innerHTML:'',textContent:'',remove(){nodes.delete(this.id)},querySelector(){return null}};return n},
  addEventListener(type,fn){(handlers[type]??=[]).push(fn)},
  emit(type,target,props={}){for(const h of handlers[type]||[])h({target,...props})}
 };
 const viewport={id:'viewport',appendChild(node){nodes.set(node.id,node)},getBoundingClientRect(){return {left:0,top:0,width:960,height:640}}};nodes.set('viewport',viewport);
 const project={tutorialLesson:{id:'example-1'},components:[{id:'pr1',typeId:'test-probe-red',label:'PRV1',tutorialPurpose:'Pozitif gerilimi ölçer.'},{id:'pb1',typeId:'test-probe-black',label:'PBV1',tutorialPurpose:'COM girişine bağlı.'},{id:'r1',typeId:'resistor',label:'R1',tutorialPurpose:'Akımı sınırlar.'},{id:'g',typeId:'supply-dc',label:'G1',tutorialPurpose:'Devreyi besler.'}]};
 const context={window:{document:doc,DTSEditor:{getProject:()=>project,byId:{resistor:{name:'Direnç'},'test-probe-red':{name:'Kırmızı prob'},'test-probe-black':{name:'Siyah prob'}}}}};vm.runInNewContext(src,context);
 const api=context.window.DTSTutorialMicroHints;
 const target=id=>({closest(selector){if(selector!=='g.component, g.component-backdrop')return null;return {dataset:{id}}}});
 return {api,doc,project,nodes,classes,target};
}
test('all tutorial lessons use one shared mouse/focus micro-hint controller, without altering the coach',()=>{
 assert.match(loader,/await load\('tutorial-micro-hints\.js\?v=1\.19\.20-micro-hints1'\)/);
 assert.match(mode,/root\.DTSTutorialMicroHints\?\.sync\?\.\(l,project\)/);
 assert.match(mode,/root\.DTSTutorialMicroHints\?\.clear\?\.\(\)/);
 assert.doesNotMatch(src,/tutorialCoach\.(?:hidden|innerHTML)|#tutorialCoach/);
 assert.match(css,/body\.tutorial-micro-dismissed #tutorialReferenceStage \.tutorial-ref-top/);
 assert.match(css,/\.tutorial-micro-tooltip\{[^}]*pointer-events:none/);
});
test('rich reference: five cards initially visible; first click hides only explanation cards',()=>{
 const f=fixture();f.nodes.set('tutorialReferenceStage',{id:'tutorialReferenceStage'});
 const lesson={id:'voltage-meter-rich'};f.api.sync(lesson,f.project);
 assert.equal(f.api.state.dismissed,false);assert.equal(f.nodes.has('tutorialMicroIntro'),false);
 assert.equal(f.classes.has('tutorial-micro-dismissed'),false);
 f.doc.emit('pointerdown',f.target('r1'));
 assert.equal(f.api.state.dismissed,true);assert.equal(f.classes.has('tutorial-micro-dismissed'),true);
 f.api.sync(lesson,f.project);assert.equal(f.api.state.dismissed,true,'re-render must not resurrect labels');
});
test('red and black probe reveal only relevant explanations and disappear when the pointer leaves',()=>{
 const f=fixture(),rich=[
 {title:'Ayarlanabilir DC kaynak',detail:'24 V',note:'G1'},
 {title:'R1 yük',detail:'Direnç',note:'R1'},
 {title:'UNI-T UT33D+',detail:'DCV 200 V',note:'V1'},
 {title:'Kırmızı prob',detail:'VΩmA girişinden yüksek potansiyele gider.',note:'VΩmA'},
 {title:'Siyah prob',detail:'COM referansından düşük potansiyele gider.',note:'COM'}
 ];
 const cards=rich.map(record=>({querySelector(s){const prop=({strong:'title',span:'detail',small:'note'})[s];return prop?{textContent:record[prop]}:null}}));
 f.nodes.set('tutorialReferenceStage',{id:'tutorialReferenceStage'});f.doc.cards=cards;
 f.api.sync({id:'dc-measurement-rich'},f.project);f.doc.emit('pointerdown',f.target('r1'));
 const red=f.target('pr1');f.doc.emit('pointerover',red,{clientX:250,clientY:110});
 let tip=f.nodes.get('tutorialMicroTooltip');assert.match(tip.innerHTML,/Kırmızı prob/);assert.match(tip.innerHTML,/VΩmA girişinden/);assert.doesNotMatch(tip.innerHTML,/Siyah prob/);
 f.doc.emit('pointerout',red,{relatedTarget:null});assert.equal(tip.hidden,true);
 f.doc.emit('pointerover',f.target('pb1'),{clientX:325,clientY:220});
 assert.match(tip.innerHTML,/Siyah prob/);assert.match(tip.innerHTML,/COM referansından/);assert.doesNotMatch(tip.innerHTML,/Kırmızı prob/);
 f.doc.emit('pointerout',f.target('pb1'),{relatedTarget:f.target('pb1')});assert.equal(tip.hidden,false,'moving between the same part’s SVG children should not flicker');
 f.doc.emit('pointerout',f.target('pb1'),{relatedTarget:f.target('r1')});assert.equal(tip.hidden,true);
});
test('non-reference lessons show at most four compact introductions, then hover-only details',()=>{
 const f=fixture(),lesson={id:'simple-quiz-15'};
 f.api.sync(lesson,f.project);let intro=f.nodes.get('tutorialMicroIntro');
 assert.ok(intro);assert.equal((intro.innerHTML.match(/<article>/g)||[]).length,4);assert.equal(intro.hidden,false);
 f.doc.emit('pointerdown',{closest(){return null}});assert.equal(intro.hidden,true);
 f.doc.emit('pointerover',f.target('r1'),{clientX:300,clientY:200});
 assert.match(f.nodes.get('tutorialMicroTooltip').innerHTML,/R1/);
 f.doc.emit('pointerout',f.target('r1'),{relatedTarget:null});assert.equal(f.nodes.get('tutorialMicroTooltip').hidden,true);
 f.api.sync(lesson,f.project);assert.equal(intro.hidden,true,'coach changes do not revive cards');
 const different={...f.project,components:f.project.components};f.api.sync(lesson,different);
 assert.equal(f.api.state.dismissed,false,'reopening even the same lesson gives an initial introduction');
 assert.equal(intro.hidden,false);
 f.api.clear();assert.equal(f.nodes.has('tutorialMicroIntro'),false);assert.equal(f.classes.has('tutorial-micro-dismissed'),false);
});
test('terminals without material descriptions fail safely instead of inventing electrical values',()=>{
 const f=fixture(),part={id:'unknown',label:'Test elemanı',typeId:'unlisted-part'};
 const desc=f.api.description(part,{},[]);
 assert.equal(desc.title,'Test elemanı');assert.match(desc.detail,/Malzemenin devredeki görevini inceleyin/);
 assert.ok(f.api.matchScore({id:'pb1',typeId:'test-probe-black'},{title:'Kırmızı prob'})<0);
});

test('shared explanations cover every existing tutorial project, including all 45 measurement lessons',()=>{
 require('../dist/tutorial-lessons.js');
 const source=require('../dist/tutorial-source-outline.js');
 const ctx={window:{DTSTutorialLessons:source}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/tutorial-pedagogy.js'),'utf8'),ctx);
 const lessons=ctx.window.DTSTutorialLessons.lessons;
 assert.ok(lessons.length>=1600,'full curriculum must remain present');
 const measurement=lessons.filter(l=>l.topicId==='measurement-workshop');
 assert.equal(measurement.length,45);
 for(const lesson of lessons){
  assert.ok(lesson.project?.components?.length>0,'No visible explanation target '+lesson.id);
  for(const part of lesson.project.components)assert.ok(part.id&&part.typeId,lesson.id+' invalid part identity');
 }
});
