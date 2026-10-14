'use strict';
const fs=require('node:fs'),path=require('node:path');
const SOURCE=path.resolve(__dirname,'..');
const Curriculum=require('./qa-tutorial-1655-simulation-v11920.cjs');
const clamp=s=>String(s??'').replace(/\s+/g,' ').trim().slice(0,240);
function terminal(p,r){
 if(r?.j!==undefined)return 'Junction '+String(r.j);
 const c=p.components.find(c=>c.id===r?.c);
 return clamp((c?.label||c?.ref||c?.id||r?.c||'?')+' / '+(r?.p??'?'));
}
function audit({L=Curriculum.curriculum(),modeSource=fs.readFileSync(path.join(SOURCE,'dist/tutorial-mode.js'),'utf8')}={}){
 const report={qa:'MQ-07 Batch N practice + teaching UI source audit',total:L.lessons.length,
  rich:0,examined:0,wired:0,referenceOnly:0,referenceWithWires:0,checkableObservations:0,
  issues:[],guiContract:null,
  note:'Rendered HTML code/escaping contract only; actual Windows browser visual, student learning outcomes and independent pedagogy QA remain open.'};
 const renderedPairs=p=>new Set(p.wires.map(w=>terminal(p,w.from)+' → '+terminal(p,w.to)));
 for(const lesson of L.lessons){
  if(lesson.designStandard==='rich-reference-v1'){report.rich++;continue}
  report.examined++;
  const guide=lesson.practiceGuide;
  if(!guide){report.issues.push({id:lesson.id,code:'missing-guide'});continue}
  if(guide.version!=='practice-n1'||guide.virtualOnly!==true||
   guide.physicalTestAccepted!==false||guide.pedagogicalAcceptance!==false||
   guide.fullyRich!==false||guide.canonicalGraphUnchanged!==true)
   report.issues.push({id:lesson.id,code:'inaccurate-acceptance'});
  if(!guide.steps?.length||guide.steps.length<3||!guide.observations?.length||
   guide.steps.some(s=>typeof s!=='string'||s.trim().length<12))
   report.issues.push({id:lesson.id,code:'missing-pedagogic-steps'});
  const project=lesson.project,pairs=renderedPairs(project);
  if(guide.method==='virtual-circuit-check'){
   report.wired++;
   const refs=guide.steps.filter(s=>s.startsWith('Sanal bağlantı incelemesi: '));
   if(!refs.length)report.issues.push({id:lesson.id,code:'no-terminal-exercise'});
   for(const step of refs){
    const link=step.slice('Sanal bağlantı incelemesi: '.length).split('. ')[0];
    report.checkableObservations++;
    if(!pairs.has(link))report.issues.push({id:lesson.id,code:'not-canonical-terminal-link',link});
   }
  }else if(guide.method==='reference-only'){
   report.referenceOnly++;
   if(project.wires.length||!guide.steps.join(' ').includes('doğrulanmış kablolu deney şeması bulunmuyor'))
    report.issues.push({id:lesson.id,code:'false-reference-claim'});
  }else if(guide.method==='reference-with-wires'){
   report.referenceWithWires++;
   if(!project.wires.length||!guide.steps.join(' ').includes('bağımsız rehberli elektriksel deney kabulü verilmemiştir'))
    report.issues.push({id:lesson.id,code:'unsupported-physical-claim'});
  }else report.issues.push({id:lesson.id,code:'invalid-teaching-mode'});
 }
 const escaped=modeSource.includes("esc(l.practiceGuide.heading)")&&
  modeSource.includes("l.practiceGuide.steps.map(x=>'<li>'+esc(x)")&&
  modeSource.includes("l.practiceGuide.observations.map(x=>'<li>'+esc(x)");
 const visible=modeSource.includes('tutorial-virtual-practice')&&
  modeSource.includes('Yalnız sanal eğitim:');
 report.guiContract={escaped,visible,passed:escaped&&visible};
 report.sourceStatus=report.total===1655&&report.rich===136&&report.examined===1519&&
  report.wired+report.referenceOnly+report.referenceWithWires===report.examined&&
  report.checkableObservations>=525&&!report.issues.length&&report.guiContract.passed?'PASS':'FAIL';
 return report;
}
function main(){
 const report=audit(),dir=path.join(SOURCE,'build');
 fs.mkdirSync(dir,{recursive:true});
 const file=path.join(dir,'qa-tutorial-practice-1519-report.json');
 fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n','utf8');
 console.log(JSON.stringify({file,status:report.sourceStatus,issues:report.issues.length,
  examined:report.examined,wired:report.wired,referenceOnly:report.referenceOnly,
  referenceWithWires:report.referenceWithWires,observations:report.checkableObservations,
  guiContract:report.guiContract}));
 if(report.sourceStatus!=='PASS')process.exitCode=1;
 return report;
}
if(require.main===module)main();
module.exports={audit,main};
