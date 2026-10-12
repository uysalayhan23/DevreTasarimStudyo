'use strict';
// Read-only MQ-12 full-curriculum circuit QA. Execute with Node 22+; no browser, disk mutation, or CI.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ROOT=path.resolve(__dirname,'..');
const read=n=>fs.readFileSync(path.join(ROOT,'dist',n),'utf8');
const clone=v=>JSON.parse(JSON.stringify(v));
const overlays=[
 'tutorial-pedagogy.js',
 'tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js',
 'tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js',
 'tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js',
 'tutorial-installation-batch-h.js','tutorial-next-batch-i.js','tutorial-sensor-batch-j.js',
 'tutorial-motor-batch-k.js','tutorial-dual-dc-batch-l.js','tutorial-topic-review-batch-m.js','tutorial-practice-guide-batch-n.js',
 'tutorial-curriculum.js'
];
function curriculum(){
 const lessons=require('../dist/tutorial-source-outline.js');
 const ctx={window:{DTSTutorialLessons:clone(lessons)}};
 for(const f of overlays)vm.runInNewContext(read(f),ctx,{filename:f});
 return ctx.window.DTSTutorialLessons;
}
function catalog(){
 const ctx={window:{}};
 for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js',
  'electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js',
  'dold-library.js','hcfa-library.js','tutorial-components.js'])
  vm.runInNewContext(read(f),ctx,{filename:f});
 const lib=ctx.window.COMPONENT_LIBRARY;
 if(!Array.isArray(lib)||lib.length<500||!ctx.window.DTSDesignLibrary?.extend)
  throw Error('Full physical product library unavailable');
 return Object.fromEntries(ctx.window.DTSDesignLibrary.extend(lib).map(d=>[d.id,d]));
}
function audit({L=curriculum(),defs=catalog(),Simulation=require('../dist/simulation.js')}={}){
 // Explicit fixture injection is for fail-closed tests only; main() always runs
 // the real full curriculum, product catalog and native solver.
 const report={qa:'MQ-12 full 1655 tutorial initial-state simulation',
  total:L.lessons.length,expected:1655,rich:L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,
  topicReviewed:L.lessons.filter(x=>x.topicReview?.version==='topic-review-m1').length,
  virtualPracticeGuides:L.lessons.filter(x=>x.practiceGuide?.version==='practice-n1').length,
  definitionCount:Object.keys(defs).length,referenceOnly:0,withWires:0,
  tested:0,stable:0,oscillating:0,componentsChecked:0,wireEndpointsChecked:0,
  missingDefinitions:[],invalidGuidedSteps:[],invalidWireEndpoints:[],
  blocked:[],shortCircuits:[],unstable:[],errors:[],duplicateIds:[],
  note:'Simulation.solve initial state only; interactive dynamic behavior, real Windows visual and pedagogy acceptance not implied'};
 const seen=new Set();
 for(const lesson of L.lessons){
  if(seen.has(lesson.id))report.duplicateIds.push(lesson.id);else seen.add(lesson.id);
  const p=lesson.project,steps=lesson.steps||[];
  if(!p||!Array.isArray(p.components)||!Array.isArray(p.wires)){
   report.errors.push({id:lesson.id,error:'Missing canonical project graph'});continue;
  }
  // Validate ALL 1655 lessons, including no-wire reference / theory boards.
  // Skipping those boards before catalog checking could incorrectly report PASS
  // for a lesson containing unavailable physical components.
  const allParts=new Map(p.components.map(c=>[c.id,c]));
  report.componentsChecked+=p.components.length;
  const absent=[...new Set(p.components.map(c=>c.typeId).filter(id=>!defs[id]))];
  if(absent.length)report.missingDefinitions.push({id:lesson.id,ids:absent});
  if(!p.wires.length){
   // Theory boards must never advertise steps for nonexistent physical wiring.
   if(steps.length)report.invalidGuidedSteps.push(lesson.id);
   report.referenceOnly++;continue;
  }
  report.withWires++;
  const junctionIds=new Set((p.junctions||[]).map(j=>j.id));
  for(const [wireIndex,wire] of p.wires.entries()){
   for(const end of [wire.from,wire.to]){
    report.wireEndpointsChecked++;
    if(end?.j!==undefined){
     if(!junctionIds.has(end.j))report.invalidWireEndpoints.push({id:lesson.id,wire:wireIndex,issue:'unknown junction',endpoint:end});
     continue;
    }
    const component=allParts.get(end?.c),definition=defs[component?.typeId];
    if(!component||!definition||!definition.pins?.some(pin=>pin.id===end.p))
     report.invalidWireEndpoints.push({id:lesson.id,wire:wireIndex,issue:'unknown component or terminal',endpoint:end});
   }
  }
  const wires=new Set(p.wires.map(w=>JSON.stringify([w.from?.c,w.from?.p,w.to?.c,w.to?.p])));
  // Several accepted lessons intentionally exclude measurement/probe leads from
  // step-by-step wiring. Quiz/demo lessons may have a graph but no guided steps.
  // Every PRESENT guided step must refer to a real canonical directed wire.
  if(steps.some(s=>!wires.has(JSON.stringify([s.from?.c,s.from?.p,s.to?.c,s.to?.p]))))
   report.invalidGuidedSteps.push(lesson.id);
  if(absent.length)continue;
  const project=clone(p);
  try{
   const result=Simulation.solve(project,defs,{now:0});
   report.tested++;
   if(result.blocked)report.blocked.push({id:lesson.id,reason:result.reason||'blocked'});
   if(result.shortCircuit)report.shortCircuits.push(lesson.id);
   if(result.oscillating)report.oscillating++;
   if(result.stable)report.stable++;else if(!result.oscillating)report.unstable.push({id:lesson.id,reason:result.reason||'unstable'});
  }catch(error){report.errors.push({id:lesson.id,error:String(error).slice(0,240)})}
 }
 report.status=report.total===report.expected&&report.rich===136&&report.topicReviewed===1519&&report.virtualPracticeGuides===1519&&
  !report.missingDefinitions.length&&!report.invalidGuidedSteps.length&&!report.invalidWireEndpoints.length&&!report.blocked.length&&
  !report.shortCircuits.length&&!report.unstable.length&&!report.errors.length&&!report.duplicateIds.length?'PASS':'FAIL';
 return report;
}
function main(){
 const report=audit(),dir=path.join(ROOT,'build');
 fs.mkdirSync(dir,{recursive:true});
 const file=path.join(dir,'qa-tutorial-1655-simulation-report.json');
 fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
 process.stdout.write(JSON.stringify({file,status:report.status,total:report.total,withWires:report.withWires,
  tested:report.tested,referenceOnly:report.referenceOnly,blocked:report.blocked.length,
  shortCircuits:report.shortCircuits.length,invalidWireEndpoints:report.invalidWireEndpoints.length,missingDefinitions:report.missingDefinitions.length,
  invalidGuidedSteps:report.invalidGuidedSteps.length,errors:report.errors.length})+'\n');
 if(report.status!=='PASS')process.exitCode=1;
 return report;
}
if(require.main===module)main();
module.exports={audit,main,curriculum,catalog};
