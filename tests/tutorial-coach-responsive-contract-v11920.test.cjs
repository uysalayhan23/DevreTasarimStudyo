'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),zlib=require('node:zlib'),os=require('node:os'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),ui=fs.readFileSync(path.join(ROOT,'dist/tutorial-mode.js'),'utf8'),browser=fs.readFileSync(path.join(ROOT,'scripts/browser-visual-hl-v11920.cjs'),'utf8');
function fragment(start,end){const a=ui.indexOf(start),b=ui.indexOf(end,a);assert.ok(a>=0&&b>a);return ui.slice(a,b)}
const source=fragment('function applyCoachUi(coach){','function persistCoachBox');
function layout(w,h,minimized){
 const state={width:600,height:500,left:1200,top:900,minimized};
 const ctx={root:{innerWidth:w,innerHeight:h},coachDefaultBox:()=>state,coachUiState:()=>state,syncCoachPanelControl:()=>{}};
 vm.runInNewContext(source+';this.layout=applyCoachUi',ctx);
 const classes=new Set(),coach={style:{},hidden:false,classList:{toggle(n,v){if(v)classes.add(n);else classes.delete(n)}}};
 ctx.layout(coach);
 return {left:parseFloat(coach.style.left),top:parseFloat(coach.style.top),width:parseFloat(coach.style.width),height:minimized?44:parseFloat(coach.style.height),minimized:classes.has('is-minimized')};
}
for(const [w,h] of [[1440,1000],[760,640],[400,320]])for(const minimized of [false,true]){
 test('coach geometry '+w+'x'+h+' minimized='+minimized,()=>{
  const g=layout(w,h,minimized);
  assert.equal(g.minimized,minimized);assert.ok(g.left>=7&&g.top>=57);
  assert.ok(g.left+g.width<=w+1&&g.top+g.height<=h+1,JSON.stringify(g));
 });
}
test('minimize, re-open and resize hooks re-clamp panel',()=>{
 const toggle=fragment('function toggleCoachMinimize(){','function mountCoachChrome');
 const visible=fragment('function setCoachVisible(show){','function toggleCoachMinimize');
 assert.match(toggle,/saveCoachUi\(\{minimized\}\)/);
 assert.match(toggle,/applyCoachUi\(coach\)/);
 assert.match(visible,/applyCoachUi\(coach\)/);
 assert.match(ui,/addEventListener\('resize',\(\)=>\{[^\n]*applyCoachUi\(coach\)/);
});
test('PNG envelope and failure JSON are checked before visual acceptance',()=>{
 assert.match(browser,/Buffer\.from\(\[137,80,78,71,13,10,26,10\]\)/);
 assert.match(browser,/IHDR/);assert.match(browser,/IEND/);
 assert.match(browser,/payload\.readUInt32BE\(0\)/);
 assert.match(browser,/payload\.readUInt32BE\(4\)/);
 assert.match(browser,/PNG chunk CRC invalid/);
 assert.match(browser,/PNG missing image data or required chunks/);
 assert.match(browser,/zlib\.inflateSync/);
 assert.match(browser,/PNG scanline filter invalid/);
 assert.match(browser,/report\.failure=\{message:/);
 assert.match(browser,/fs\.writeFileSync\(path\.join\(BUILD,'report\.json'\)/);
 for(const [capture,gate] of [
  ["const cornerShot=await shot","assert(cornerChecks.every"],
  ["const panelShot=await shot","assert(interaction.ok"]
 ]){
  const a=browser.indexOf(capture),b=browser.indexOf(gate);
  assert.ok(a>=0&&b>=0, 'missing required screenshot/acceptance gate: '+capture+' / '+gate);
  assert.ok(a<b, 'screenshot must precede acceptance gate: '+capture);
 }
});
test('PNG chunk CRC, lengths, IDAT, IEND and dimensions reject broken data',()=>{
 const a=browser.indexOf('function pngCrc(data){'),b=browser.indexOf('function findBrowser()',a);
 assert.ok(a>=0&&b>a,'PNG parser source unavailable');
 const png=vm.runInNewContext(browser.slice(a,b)+';pngSize',{Buffer,zlib});
 const crc=vm.runInNewContext(browser.slice(a,b)+';pngCrc',{Buffer,zlib});
 function chunk(type,data=Buffer.alloc(0)){
  const b=Buffer.alloc(12+data.length);b.writeUInt32BE(data.length,0);b.write(type,4);
  data.copy(b,8);b.writeUInt32BE(crc(b.subarray(4,8+data.length)),8+data.length);
  return b;
 }
 function sample(w=1,h=1){
  const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(Buffer.from([0,255,0,0,255]))),chunk('IEND')]);
 }
 const valid=sample();assert.equal(png(valid).width,1);assert.equal(png(valid).height,1);
 const sig=Buffer.from(valid);sig[0]=0;assert.throws(()=>png(sig));
 const crcError=Buffer.from(valid);crcError[29]^=1;assert.throws(()=>png(crcError));
 assert.throws(()=>png(valid.subarray(0,valid.length-3)));
 const noData=Buffer.concat([valid.subarray(0,33),chunk('IEND')]);assert.throws(()=>png(noData));
 const trailing=Buffer.concat([valid,Buffer.from([0])]);assert.throws(()=>png(trailing));
 const compressed=zlib.deflateSync(Buffer.from([0,255,0,0,255]));
 const split=Buffer.concat([valid.subarray(0,33),chunk('IDAT'),chunk('IDAT',compressed.subarray(0,3)),chunk('IDAT',compressed.subarray(3)),chunk('IDAT'),chunk('IEND')]);
 assert.equal(png(split).width,1,'zero-length and split IDAT chunks are legal');
 const emptyIdat=Buffer.concat([valid.subarray(0,33),chunk('IDAT'),chunk('IEND')]);assert.throws(()=>png(emptyIdat));
 const fakeDeflate=Buffer.concat([valid.subarray(0,33),chunk('IDAT',Buffer.from([1,2,3])),chunk('IEND')]);
 assert.throws(()=>png(fakeDeflate),'CRC-correct but invalid compressed IDAT must fail');
 const invalidFilter=Buffer.concat([valid.subarray(0,33),chunk('IDAT',zlib.deflateSync(Buffer.from([5,255,0,0,255]))),chunk('IEND')]);
 const unknownCritical=Buffer.concat([valid.subarray(0,33),chunk('JUNK',Buffer.from('x')),chunk('IDAT',compressed),chunk('IEND')]);
 assert.throws(()=>png(unknownCritical),'unknown critical PNG chunk must fail');
 function indexedHeader(){
  const data=Buffer.alloc(13);data.writeUInt32BE(1,0);data.writeUInt32BE(1,4);data[8]=8;data[9]=3;
  return chunk('IHDR',data);
 }
 const missingPalette=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),indexedHeader(),
  chunk('IDAT',zlib.deflateSync(Buffer.from([0,0]))),chunk('IEND')]);
 assert.throws(()=>png(missingPalette),'indexed PNG without PLTE must fail');
 const validIndexed=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),indexedHeader(),
  chunk('PLTE',Buffer.from([255,0,0])),chunk('IDAT',zlib.deflateSync(Buffer.from([0,0]))),chunk('IEND')]);
 assert.equal(png(validIndexed).width,1,'indexed PNG with palette is valid');

 assert.throws(()=>png(invalidFilter),'Invalid PNG scanline filter must fail');
 const interrupted=Buffer.concat([valid.subarray(0,33),chunk('IDAT',Buffer.from([1])),chunk('tEXt',Buffer.from('x')),chunk('IDAT',Buffer.from([2])),chunk('IEND')]);assert.throws(()=>png(interrupted));
 assert.throws(()=>png(sample(0,1)));assert.throws(()=>png(sample(1,0)));
});

test('Chromium QA verifies screenshot file bytes and SHA against JSON and preserves invalid captures',()=>{
 assert.match(browser,/function verifyReportArtifacts\(report\)/);
 assert.match(browser,/report\.artifactIntegrity=verifyReportArtifacts\(report\)/);
 assert.match(browser,/report\.artifactIntegrity\.files===100/);
 assert.match(browser,/JSON\.parse\(fs\.readFileSync\(reportFile,'utf8'\)\)/);
 assert.match(browser,/new Set\(lessons\.items\.map\(x=>x\.id\)\)\.size===64/);
 assert.match(browser,/verifyReportArtifacts\(persisted\)/);
 assert.match(browser,/name\+'\.invalid\.png'/);
 const a=browser.indexOf('function pngCrc(data){'),b=browser.indexOf('function findBrowser()',a);
 const crc=vm.runInNewContext(browser.slice(a,b)+';pngCrc',{Buffer,zlib});
 const png=vm.runInNewContext(browser.slice(a,b)+';pngSize',{Buffer,zlib});
 function chunk(type,data=Buffer.alloc(0)){
  const out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);out.write(type,4);
  data.copy(out,8);out.writeUInt32BE(crc(out.subarray(4,8+data.length)),8+data.length);
  return out;
 }
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(1,0);ihdr.writeUInt32BE(1,4);ihdr[8]=8;ihdr[9]=6;
 const raw=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),
  chunk('IDAT',zlib.deflateSync(Buffer.from([0,255,0,0,255]))),chunk('IEND')]);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'dts-qa-json-')),build=path.join(root,'build','browser-visual-hl');
 fs.mkdirSync(build,{recursive:true});
 const file=path.join(build,'sample.png');fs.writeFileSync(file,raw);
 const entry={file:'build/browser-visual-hl/sample.png',bytes:raw.length,width:1,height:1,sha256:crypto.createHash('sha256').update(raw).digest('hex')};
 const start=browser.indexOf('function verifyReportArtifacts(report){'),end=browser.indexOf('function assert(cond,msg)',start);
 assert.ok(start>=0&&end>start);
 const verify=vm.runInNewContext(browser.slice(start,end)+';verifyReportArtifacts',{
  fs,path,ROOT:root,BUILD:build,pngSize:png,sha256:data=>crypto.createHash('sha256').update(data).digest('hex')
 });
 try{
  assert.equal(verify({states:{a:{screenshot:entry}}}).files,1);
  assert.throws(()=>verify({states:{a:{screenshot:{...entry,sha256:'0'.repeat(64)}}}}),'modified digest must fail');
  fs.writeFileSync(file,Buffer.from([0,1,2]));
  assert.throws(()=>verify({states:{a:{screenshot:entry}}}),'corrupted screenshot must fail');
 }finally{fs.rmSync(root,{recursive:true,force:true})}
});
