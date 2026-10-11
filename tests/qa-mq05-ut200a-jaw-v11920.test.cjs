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
 assert.throws(()=>Verify.validate({status:'FAIL'}),/did not finish/);
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
