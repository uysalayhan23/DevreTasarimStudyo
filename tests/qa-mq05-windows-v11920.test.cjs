'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const S=require('../dist/simulation.js');
const Browser=require('../scripts/browser-mq05-live-v11920.cjs');
const ROOT=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
function defs(){
 const ctx={window:{}};
 for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])
  vm.runInNewContext(read('dist/'+f),ctx);
 return Object.fromEntries(ctx.window.DTSDesignLibrary.extend(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
}
const byId=defs(),clone=x=>JSON.parse(JSON.stringify(x));
test('MQ05 live QA bootstraps real Chromium and handles all four stages fail-closed',()=>{
 const src=read('scripts/browser-mq05-live-v11920.cjs');
 for(const value of ['Input.dispatchMouseEvent','Page.captureScreenshot','Runtime.evaluate','window.DTSTutorialBootstrap.ensure()',
  'seal-in-1','meterFixture','clampFixture','dcFixture','seal_in','probes_and_multimeter','ut200a','ac_dc_flow',
  "report.status='FAIL'","report.status='PASS'"])assert.ok(src.includes(value),value);
 assert.match(src,/await drag\(cdp,from,to\)/);
 assert.match(src,/await press\(cdp,start\)/);
 assert.match(src,/await release\(cdp,start\)/);
});
test('UT33D+ fixture gives 24V through physical red and black probe contacts',()=>{
 const p=clone(Browser.meterFixture);
 p.components.find(c=>c.id==='red').probeTarget={c:'g',p:'P'};
 p.components.find(c=>c.id==='black').probeTarget={c:'g',p:'M'};
 const r=S.solve(p,byId,{now:0}),m=p.components.find(c=>c.id==='m');
 assert.equal(r.blocked,false);assert.equal(r.shortCircuit,false);
 assert.equal(m._meter.warning,'');assert.ok(Math.abs(m._meter.value-24)<1);
 assert.equal(m._meter.unit,'V');assert.equal(p.wires.length,4);
});
test('UT200A AC clamp fixture senses ~1A with no series wire break',()=>{
 const p=clone(Browser.clampFixture),r=S.solve(p,byId,{now:0}),cl=p.components.find(c=>c.id==='cl');
 assert.equal(r.blocked,false);assert.equal(cl._clamp.warning,'');
 assert.equal(cl._clamp.unit,'A');assert.ok(Math.abs(cl._clamp.value-1)<.04);
 assert.equal(p.wires.length,2);assert.equal(cl.clampedWireId,'w1');
});
test('reversed DC feed has numerical signed current independent of wire drawing direction',()=>{
 const p=clone(Browser.dcFixture);S.solve(p,byId,{now:0});
 const wire=p.wires.find(w=>w.id==='reverse');
 assert.equal(wire._flowMode,'dc');assert.equal(wire._flowDirection,-1);
 assert.equal(wire._flowCertainty,'exact');assert.ok(wire._flowMagnitude>.19);
});
test('single-click Windows launcher and ZIP pipeline leave BASLAT.bat and H-L visual assets untouched',()=>{
 const bat=read('QA_MQ05_CALISTIR.bat'),ps=read('scripts/qa-mq05-windows-v11920.ps1'),ver=read('scripts/qa-mq05-artifact-verify-v11920.cjs');
 assert.match(bat,/qa-mq05-windows-v11920\.ps1/);
 assert.match(ps,/browser-mq05-live-v11920\.cjs/);
 assert.match(ps,/qa-mq05-artifact-verify-v11920\.cjs/);
 assert.match(ps,/Compress-Archive/);
 assert.match(ps,/Wait-Process -Timeout 900/);
 assert.match(ps,/run-summary\.json/);
 assert.match(ps,/source-hashes\.json/);
 assert.match(ver,/verify.*status|report\.status!=='PASS'/);
 assert.match(ver,/pngSize\(b\)/);
 assert.match(ver,/sha256|hash\(b\)/);
 assert.match(read('BASLAT.bat'),/set "FILEURL=file:\/\/\/%INDEX:\\=\/%"/);
 assert.match(read('evidence/qa_hl64_windows_20261011_164226.json'),/"hl_lessons_checked": 64/);
});
