'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const Simulation=require('../dist/simulation.js'),Jaw=require('../scripts/browser-mq05-ut200a-jaw-v11920.cjs');
const Verify=require('../scripts/qa-mq05-ut200a-jaw-verify-v11920.cjs');
const byId=(()=>{
 const ctx={window:{}};
 for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])
  vm.runInNewContext(read('dist/'+f),ctx);
 return Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
})();
test('UT200A real jaw fixture begins OFF, physically free and electrically noninvasive',()=>{
 const fixture=Jaw.freeClampFixture(),clamp=fixture.components.find(c=>c.id==='cl');
 assert.equal(clamp.clampedWireId,undefined);assert.equal(clamp.clampT,undefined);
 assert.equal(clamp.meterPosition,0);assert.equal(fixture.wires.length,2);
 assert.deepEqual(fixture.wires.map(w=>w.id),['w1','w2']);
 const state=Simulation.solve(fixture,byId,{now:0});
 assert.equal(state.blocked,false);
 assert.equal(clamp._clamp.warning,'');
});
test('after physical wire snap, UT200A detects actual 1A AC current without rewiring',()=>{
 const fixture=Jaw.freeClampFixture(),clamp=fixture.components.find(c=>c.id==='cl');
 clamp.clampedWireId='w1';clamp.clampT=.5;clamp.meterPosition=1;
 const state=Simulation.solve(fixture,byId,{now:0});
 assert.equal(state.blocked,false);assert.equal(clamp._clamp.warning,'');
 assert.equal(clamp._clamp.unit,'A');assert.ok(Math.abs(clamp._clamp.value-1)<.04);
 assert.equal(fixture.wires.length,2);
});
test('UT200A UI opens jaws only for nearby wire and closes them on release',()=>{
 const app=read('dist/app.js'),qa=read('scripts/browser-mq05-ut200a-jaw-v11920.cjs');
 assert.match(app,/c\._clampJawOpen=!!candidate/);
 assert.match(app,/delete c\._clampJawOpen;delete c\._clampCandidate/);
 assert.match(app,/g\.dataset\.clampJawState=c\._clampJawOpen\?'open':'closed'/);
 assert.match(app,/data-clamp-jaw-state':'open'/);
 assert.match(qa,/Input\.dispatchMouseEvent/);
 assert.match(qa,/await press\(cdp,geometry\.from\)/);
 assert.match(qa,/opened\.jawOpen&&opened\.visualState==='open'&&opened\.visibleOpenMark/);
 assert.match(qa,/await release\(cdp,geometry\.end\)/);
 assert.match(qa,/snapped\.clampedWireId==='w1'/);
 assert.match(qa,/jaw-snapped-closed/);
 assert.match(qa,/data-thermal-param="meterPosition"/);
});
test('independent four screenshot verifier rejects unsupported PASS and absent jaw states',()=>{
 assert.throws(()=>Verify.validate({status:'FAIL'}),/Real Chromium jaw run failed/);
 assert.throws(()=>Verify.validate({status:'PASS',coverage:{},tests:{},screenshots:[]}),/Missing real UT200A physical jaw coverage/);
 const src=read('scripts/qa-mq05-ut200a-jaw-verify-v11920.cjs');
 assert.match(src,/const EXPECTED=\['jaw-before-drag','jaw-open-over-live-wire','jaw-snapped-closed','jaw-current-ac-1a'\]/);
 assert.match(src,/pngSize\(bytes\)/);
 assert.match(src,/item\.sha256!==sha256/);
 assert.match(src,/verification\.failure\.json/);
});
test('Windows launcher packages diagnostics with timeout and does not modify accepted H-L application launcher',()=>{
 const bat=read('QA_MQ05_UT200A_CALISTIR.bat'),ps=read('scripts/qa-mq05-ut200a-windows-v11920.ps1');
 assert.match(bat,/qa-mq05-ut200a-windows-v11920\.ps1/);
 assert.match(ps,/browser-mq05-ut200a-jaw-v11920\.cjs/);
 assert.match(ps,/qa-mq05-ut200a-jaw-verify-v11920\.cjs/);
 assert.match(ps,/Compress-Archive/);
 assert.match(ps,/Wait-Process -Timeout 900/);
 assert.match(ps,/run-summary\.json/);
 assert.match(ps,/source-hashes\.json/);
 assert.match(read('BASLAT.bat'),/set "FILEURL=file:\/\/\/%INDEX:\\=\/%"/);
 const accepted=JSON.parse(read('evidence/qa_hl64_windows_20261011_164226.json'));
 assert.equal(accepted.real_chromium.hl_lessons_checked,64);
 assert.equal(accepted.real_chromium.categories.total,100);
});


test('real Chromium UT200A test enters visible editor, never accepts hidden dashboard or zero pointer origin',async()=>{
 const qa=read('scripts/browser-mq05-ut200a-jaw-v11920.cjs');
 const studio=read('dist/studio.js');
 assert.match(studio,/function load\(project\)\{[\s\S]*?showEditor\(\)/);
 assert.match(qa,/window\.DTSStudio\.load\(f\)/);
 assert.doesNotMatch(qa,/window\.DTSEditor\.load\(f\)/);
 assert.match(qa,/report\.states\.editor=await ensureEditorVisible\(cdp\)/);
 assert.match(qa,/info\.dashboardHidden&&!info\.dashboardOpen&&!info\.viewportHidden/);
 assert.match(qa,/info\.viewportVisible&&info\.clampVisible&&info\.wireVisible/);
 assert.match(qa,/geometry\.from\.x>0&&geometry\.from\.y>0/);
 const start=qa.indexOf('async function ensureEditorVisible(cdp){'),end=qa.indexOf('async function aimJaw(cdp){',start);
 assert.ok(start>=0&&end>start);
 const check=(flag,msg)=>{if(!flag)throw Error(msg)};
 let mock={dashboardHidden:false,dashboardOpen:true,viewportHidden:false,viewportVisible:false,clampVisible:false,wireVisible:false};
 const verify=new Function('evaluate','expression','check',qa.slice(start,end)+';return ensureEditorVisible;')(
  async()=>mock,()=>'',check);
 await assert.rejects(verify({}),/Circuit editor\/UT200A\/wire not visibly rendered/);
 mock={dashboardHidden:true,dashboardOpen:false,viewportHidden:false,viewportVisible:true,clampVisible:true,wireVisible:true};
 assert.equal((await verify({})).clampVisible,true);
 mock={...mock,wireVisible:false};
 await assert.rejects(verify({}),/not visibly rendered/);
});


test('UT200A Chrome driver requires visible hit target, explicit selection and active drag gesture',()=>{
 const qa=read('scripts/browser-mq05-ut200a-jaw-v11920.cjs');
 const begin=qa.indexOf("const initial=await dragDiagnostics(cdp,geometry.from);");
 const select=qa.indexOf("await press(cdp,geometry.from);",begin);
 const release=qa.indexOf("await release(cdp,geometry.from);",select);
 const selected=qa.indexOf("const selected=await dragDiagnostics(cdp,geometry.from);",release);
 const rePress=qa.indexOf("await press(cdp,geometry.from);",selected);
 const pressed=qa.indexOf("const pressed=await dragDiagnostics(cdp,geometry.from);",rePress);
 const moves=qa.indexOf("for(let i=1;i<=16;i++)",pressed);
 assert.ok(begin>=0&&select>begin&&release>select&&selected>release&&rePress>selected&&pressed>rePress&&moves>pressed,
  'Physical clamp selection must precede actual pointer drag');
 assert.match(qa,/initial\.hitId==='cl'&&initial\.editable&&!initial\.labelKey/);
 assert.match(qa,/selected\.selected\.includes\('cl'\)&&!selected\.gestureActive/);
 assert.match(qa,/check\(pressed\.gestureActive&&!pressed\.labelDragging/);
 assert.match(qa,/pointer_mid_drag=await dragDiagnostics\(cdp,geometry\.from\)/);
 assert.match(qa,/pointer_actual_world_displacement=pointerDelta/);
 assert.match(qa,/check\(pointerDelta>10&&pointerLast\.gestureActive/);
 assert.match(qa,/document\.elementFromPoint\(p\.x,p\.y\)/);
 assert.match(qa,/gestureActive:document\.body\.classList\.contains\('canvas-gesture'\)/);
});


test('UT200A drag start rejects SVG movable labels and chooses drawable body',async()=>{
 const src=read('scripts/browser-mq05-ut200a-jaw-v11920.cjs');
 const begin=src.indexOf('async function aimJaw(cdp){'),end=src.indexOf('async function dragDiagnostics(cdp,point){',begin);
 assert.ok(begin>=0&&end>begin,'Jaw targeting helper missing');
 const component={getScreenCTM:()=>({})};
 const label={tagName:'text',closest:selector=>selector==='.component'?component:{dataset:{labelKey:'ref'}}};
 const graphic={tagName:'rect',closest:selector=>selector==='.component'?component:null};
 let labelOnly=false;
 const wire={getScreenCTM:()=>({}),getTotalLength:()=>200,
  getPointAtLength:t=>({x:300+t/2,y:60})};
 const document={
  querySelector:selector=>selector.includes('data-id="cl"')?component:wire,
  elementFromPoint:()=>labelOnly?label:graphic
 };
 component.querySelector=()=>({getBoundingClientRect:()=>({left:0,top:0,width:180,height:130})});
 component.getBoundingClientRect=()=>({left:0,top:0,width:180,height:130});
 const expression=fn=>fn,evaluate=async(_,fn)=>fn();
 const DOMPoint=class{constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}};
 const aim=new Function('evaluate','expression','document','DOMPoint',
  src.slice(begin,end)+';return aimJaw;')(evaluate,expression,document,DOMPoint);
 const position=await aim({});
 assert.ok(position?.from&&position.fromHit);
 assert.equal(position.fromHit.tag,'rect');
 assert.ok(position.from.x>0);
 labelOnly=true;
 assert.equal(await aim({}),null,'Refuse to drag when only movable label is hit');
 assert.ok(src.includes('[data-label-key]'));
 assert.ok(src.includes('[data-meter-position]'));
});


test('UT200A remeasures SVG jaw target after panel selection, then releases at corrected pointer',()=>{
 const qa=read('scripts/browser-mq05-ut200a-jaw-v11920.cjs');
 const start=qa.indexOf("const selected=await dragDiagnostics(cdp,geometry.from);");
 const recalc=qa.indexOf("const selectedGeometry=await aimJaw(cdp);",start);
 const press=qa.indexOf("await press(cdp,geometry.from);",recalc);
 const align=qa.indexOf("await alignJawWhileDragging(cdp,geometry.end,report);",press);
 const release=qa.indexOf("await release(cdp,alignedEnd);",align);
 assert.ok(start>=0&&recalc>start&&press>recalc&&align>press&&release>align,
  'Must recalculate live SVG matrices after selecting and release at aligned position');
 assert.match(qa,/report\.states\.drag_geometry_after_selection=selectedGeometry/);
 assert.match(qa,/report\.states\.jaw_alignment_attempts=attempts/);
});
test('UT200A live correction moves actual pressed pointer closer to wire; fails outside viewport',async()=>{
 const src=read('scripts/browser-mq05-ut200a-jaw-v11920.cjs');
 const begin=src.indexOf('async function alignJawWhileDragging(cdp,screenPointer,report){');
 const end=src.indexOf('async function inspectJaw(cdp){',begin);
 assert.ok(begin>=0&&end>begin,'Jaw correction source missing');
 let iterations=0;
 const moves=[],report={states:{}};
 const align= new Function('liveJawAlignment','inspectJaw','check','sleep',src.slice(begin,end)+';return alignJawWhileDragging;')(
  async()=>({dx:-11,dy:-70,distance:70.84}),
  async()=>++iterations===1?{jawOpen:false,candidate:null}:{jawOpen:true,candidate:{wireId:'w1'}},
  (yes,msg)=>{if(!yes)throw Error(msg)},
  async()=>{}
 );
 const cdp={call:async(command,args)=>{assert.equal(command,'Input.dispatchMouseEvent');moves.push(args)}};
 const out=await align(cdp,{x:700,y:400},report);
 assert.equal(out.x,689);assert.equal(out.y,330);
 assert.equal(moves.length,8);
 assert.equal(report.states.jaw_alignment_attempts.length,2);
 assert.equal(report.states.jaw_alignment_attempts[1].candidate.wireId,'w1');
 const failing= new Function('liveJawAlignment','inspectJaw','check','sleep',src.slice(begin,end)+';return alignJawWhileDragging;')(
  async()=>({dx:-9999,dy:0,distance:9999}),async()=>({jawOpen:false,candidate:null}),
  (yes,msg)=>{if(!yes)throw Error(msg)},async()=>{}
 );
 await assert.rejects(failing(cdp,{x:700,y:400},{states:{}}),/leave Chromium viewport/);
});
