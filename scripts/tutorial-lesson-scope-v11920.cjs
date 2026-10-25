'use strict';
// Separate physical wiring exercises from interactive exploration and reference-only probe leads.
// 722 is the original instructional wiring TARGET, not a runtime count or a PASS certificate.
const WIRING_GOAL=722;
function isCircuitLesson(lesson){
 const p=lesson?.project;
 return !!(p&&Array.isArray(p.wires)&&p.wires.length&&lesson.kind!=='quiz'&&p.referenceOnly!==true);
}
function summarize(lessons){
 const counts={total:0,wiring:0,explore:0,otherCircuit:0,referenceWithWires:0,referenceWithoutWires:0,rawWireCount:0,simulatable:0,wiringGoal:WIRING_GOAL,wiringGap:0,wiringGoalStatus:'PENDING'};
 for(const lesson of lessons){
  counts.total++;
  const wire=Array.isArray(lesson?.project?.wires)&&lesson.project.wires.length>0;
  if(wire)counts.rawWireCount++;
  if(isCircuitLesson(lesson)){
   counts.simulatable++;
   if(lesson.kind==='wiring')counts.wiring++;
   else if(lesson.kind==='explore')counts.explore++;
   else counts.otherCircuit++;
  }else if(wire)counts.referenceWithWires++;
  else counts.referenceWithoutWires++;
 }
 counts.wiringGap=Math.max(0,WIRING_GOAL-counts.wiring);
 // Never grant COMPLETE solely on a lesson count. Independent native, visual and pedagogy acceptance remains required.
 counts.wiringGoalStatus=counts.wiringGap?'PENDING':'REQUIRES_ACCEPTANCE';
 return counts;
}
module.exports={WIRING_GOAL,isCircuitLesson,summarize};
