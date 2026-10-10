'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('Windows launcher opens local file URL without a localhost service',()=>{
 const bat=read('BASLAT.bat');
 assert.match(bat,/dist\\index\.html/);
 assert.match(bat,/set "FILEURL=file:\/\/\/%INDEX:\\=\/%"/);
 assert.doesNotMatch(bat,/DEVRE_LOCAL_SERVER|http:\/\/localhost|http:\/\/127\.0\.0\.1/i);
 assert.match(bat,/DTS_LAUNCHER_TEST/);
});
test('browser visual smoke currently covers global views but not H-L lesson-by-lesson acceptance',()=>{
 const source=read('scripts/browser-visual-v11920.cjs');
 for(const check of ['dashboard','editor','panel','tutorial'])assert.match(source,new RegExp("report\\.states\\."+check+"\\s*="));
 assert.match(source,/const \{server,url\}=await staticServer\(\)/);
 assert.doesNotMatch(source,/tutorial-(installation-batch-h|next-batch-i|sensor-batch-j|motor-batch-k|dual-dc-batch-l)/);
});
test('H-L lazy modules retain canonical load order and no added viewport renderer',()=>{
 const source=read('dist/tutorial-mode.js');
 const modules=['tutorial-installation-batch-h','tutorial-next-batch-i','tutorial-sensor-batch-j','tutorial-motor-batch-k','tutorial-dual-dc-batch-l'];
 let before=-1;
 for(const name of modules){
  const idx=source.indexOf(name+'.js?v=');
  assert.ok(idx>before,'missing or out-of-order '+name);before=idx;
  assert.doesNotMatch(read('dist/'+name+'.js'),/#viewport|document\.createElement/);
 }
});
