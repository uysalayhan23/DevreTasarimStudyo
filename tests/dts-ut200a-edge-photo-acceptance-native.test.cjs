'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=p=>fs.readFileSync(path.join(root,p),'utf8');
const browser=require('../scripts/browser-mq05-ut200a-jaw-v11920.cjs');
const verify=require('../scripts/qa-mq05-ut200a-jaw-verify-v11920.cjs');
const Clamp=require('../dist/clamp-meter.js');
const photo=(file,extra={})=>({file,href:'assets/products/'+file,sha256:browser.PHOTO_SHA256[file],visible:true,ok:true,
 width:360,height:680,bytes:56000,opaque:1900,transparent:800,...extra});
const photos=()=>({photo_before:photo('ut200a-user-photo-closed.webp'),
 photo_open:photo('ut200a-user-photo-open.webp'),photo_snapped:photo('ut200a-user-photo-closed.webp'),
 photo_measured:photo('ut200a-user-photo-closed.webp')});

test('Windows QA finds built-in Edge without requiring Chrome or changing BASLAT.bat',()=>{
 const env={'PROGRAMFILES(X86)':'C:\\Program Files (x86)','PROGRAMFILES':'C:\\Program Files',
 'LOCALAPPDATA':'C:\\Users\\QA\\AppData\\Local'};
 const available=browser.browserCandidates('win32',env);
 assert.equal(available[0],'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe');
 assert.ok(available.includes('C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'));
 assert.ok(available.includes('msedge.exe'));assert.ok(available.includes('chromium'));
 assert.equal(browser.browserCandidates('win32',{...env,CHROME_BIN:'C:\\QA\\msedge.exe'})[0],'C:\\QA\\msedge.exe');
 assert.ok(!browser.browserCandidates('linux',{}).includes('msedge.exe'));
 // The historical Windows BAT launcher stays unchanged in this patch.
});

test('acceptance checks actual Edge-decoded alpha photo in each of four physical jaw states',()=>{
 const s=source('scripts/browser-mq05-ut200a-jaw-v11920.cjs');
 assert.match(s,/process\.platform==='win32'\?\[\]:\['--no-sandbox'\]/);
 assert.match(s,/createImageBitmap\(blob\)/);assert.match(s,/getImageData\(0,0,canvas.width,canvas.height\)/);
 assert.match(s,/fetch\(new URL\(href,document.baseURI\)/);
 assert.match(s,/report\.states\.photo_before=await photoEvidence\(cdp,'ut200a-user-photo-closed.webp'\)/);
 assert.match(s,/report\.states\.photo_open=await photoEvidence\(cdp,'ut200a-user-photo-open.webp'\)/);
 assert.match(s,/report\.states\.photo_snapped=await photoEvidence\(cdp,'ut200a-user-photo-closed.webp'\)/);
 assert.match(s,/report\.states\.photo_measured=await photoEvidence\(cdp,'ut200a-user-photo-closed.webp'\)/);
 assert.match(s,/await shotEvidence\(cdp,report,'jaw-current-ac-1a'\)/);
});

test('real photo verifier accepts four correctly loaded alpha stages',()=>{
 const r=verify.validatePhotoEvidence(photos());
 assert.deepEqual(Object.keys(r).sort(),['photo_before','photo_measured','photo_open','photo_snapped'].sort());
 assert.equal(r.photo_open.file,'ut200a-user-photo-open.webp');
});

test('verifier blocks stale closed photo during drag, blank, missing, opaque or unloaded asset',()=>{
 const variants=[
  {photo_open:photo('ut200a-user-photo-closed.webp')},
  {photo_open:photo('ut200a-user-photo-open.webp',{visible:false})},
  {photo_open:photo('ut200a-user-photo-open.webp',{ok:false})},
  {photo_open:photo('ut200a-user-photo-open.webp',{transparent:0})},
  {photo_open:photo('ut200a-user-photo-open.webp',{bytes:0})},
  {photo_open:photo('ut200a-user-photo-open.webp',{sha256:'0'.repeat(64)})},
  {photo_open:photo('ut200a-user-photo-open.webp',{href:'https://example.com/ut200a-user-photo-open.webp'})},
  {photo_before:null}
 ];
 for(const replacement of variants)assert.throws(()=>verify.validatePhotoEvidence({...photos(),...replacement}),/Real browser photo evidence/);
});

test('one-click photo Edge BAT uses narrow photo QA without changing normal BASLAT or full QA',()=>{
 const bat=source('QA_UT200A_GORSEL_KABUL_CALISTIR.bat');
 const ps=source('scripts/qa-mq05-ut200a-windows-v11920.ps1');
 assert.match(bat,/set "DTS_UT200A_PHOTO_ONLY=1"/);
 assert.match(bat,/call "%~dp0QA_MQ05_UT200A_CALISTIR\.bat"/);
 assert.match(ps,/if \(\$env:DTS_UT200A_PHOTO_ONLY -eq '1'\)/);
 assert.match(ps,/tests\/dts-ut200a-edge-photo-acceptance-native\.test\.cjs/);
 assert.match(ps,/tests\/qa-mq05-ut200a-jaw-v11920\.test\.cjs/);
 assert.ok(source('BASLAT.bat').includes(String.raw`set "FILEURL=file:///%INDEX:\=/%"`));
});

test('current GitHub photo byte hashes are required; edited or stale image blocks PASS',()=>{
 const audit=browser.verifyPhotoAssetBytes();
 assert.equal(audit['ut200a-user-photo-closed.webp'].sha256,browser.PHOTO_SHA256['ut200a-user-photo-closed.webp']);
 assert.equal(audit['ut200a-user-photo-open.webp'].sha256,browser.PHOTO_SHA256['ut200a-user-photo-open.webp']);
 assert.equal(audit['1n5408-user-approved-representative.webp'].sha256,browser.PHOTO_SHA256['1n5408-user-approved-representative.webp']);
});

test('shipping photos are actual transparent WebP files; 1N5408 retains right-side cathode identity',()=>{
 for(const name of ['ut200a-user-photo-closed.webp','ut200a-user-photo-open.webp','1n5408-user-approved-representative.webp']){
  const b=fs.readFileSync(path.join(root,'dist/assets/products',name));
  assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
  assert.equal(b.toString('ascii',12,16),'VP8X');assert.ok(b[20]&16);
 }
 const material=source('dist/materials-v115.js');
 assert.match(material,/ut200a-user-photo-open\.webp/);assert.match(material,/1n5408-user-approved-representative\.webp/);
 assert.match(material,/const open=!!c\._clampJawOpen\|\|!!c\._clampCandidate/);
 const app=source('dist/app.js');assert.match(app,/c\._clampJawOpen=true;render\(\)/);
 assert.match(app,/delete c\._clampJawOpen;delete c\._clampCandidate/);
});

test('AC clamp does not invent DC readings on a conductor with no AC evidence',()=>{
 const c={id:'cl',typeId:'unit-ut200a',meterPosition:1,clampedWireId:'wire'};
 const context={project:{components:[c],wires:[{id:'wire',from:{c:'source',p:'L'},to:{c:'load',p:'L'}}]},
  branches:[],acNodes:new Set(),dcNodes:new Set(),voltages:new Map()};
 const result=Clamp.measure(c,Clamp.definition,context);
 assert.equal(result.value,null);assert.equal(result.display,'—');
 assert.match(result.warning,/yalnız AC akım ölçer/);
});
