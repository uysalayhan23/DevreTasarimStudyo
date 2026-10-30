'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','dist','studio.js'),'utf8');
const start=source.indexOf("$('#fileInput').onchange=async e=>{");
const end=source.indexOf('};',start);
assert.ok(start>=0&&end>start,'fallback file input handler must exist');
const binding=source.slice(start,end+2);
async function run({size=1,text='{"projectId":"p","components":[],"wires":[]}',cancelAt=null,safety=false}={}){
 let reads=0,parses=0,loads=0,preserves=0,notices=[],current=true;
 const file={size,async text(){reads++;if(cancelAt==='read')current=false;return text}};
 const input={onchange:null};
 const requests={begin:()=>1,isCurrent:()=>current};
 vm.runInNewContext(binding,{
   $:name=>{assert.equal(name,'#fileInput');return input},
   projectRequests:requests,safety:{visible:safety},
   Projects:{parse:s=>{parses++;return JSON.parse(s)}},
   preserve:async()=>{preserves++;if(cancelAt==='preserve')current=false},
   load:()=>loads++,E:{toast:s=>notices.push(s)},
 },{timeout:1000});
 const e={target:{files:[file],value:'chosen'}};
 await input.onchange(e);
 return {reads,parses,loads,preserves,notices,value:e.target.value};
}
test('P0-04 oversized fallback file rejected before read or project replacement',async()=>{
 const x=await run({size:20*1024*1024+1});
 assert.equal(x.reads,0);assert.equal(x.parses,0);assert.equal(x.loads,0);assert.equal(x.preserves,0);
 assert.match(x.notices[0],/20 MB/);assert.equal(x.value,'');
});
test('P0-04 exact 20MB boundary remains eligible for parsing',async()=>{
 const x=await run({size:20*1024*1024});
 assert.equal(x.reads,1);assert.equal(x.parses,1);assert.equal(x.loads,1);assert.equal(x.value,'');
});
test('P0-04 ordinary file opens after preserving current project',async()=>{
 const x=await run();assert.equal(x.loads,1);assert.equal(x.preserves,1);assert.equal(x.notices.length,0);
});
test('P0-04 invalid JSON cannot replace current project',async()=>{
 const x=await run({text:'{' });assert.equal(x.reads,1);assert.equal(x.loads,0);assert.equal(x.preserves,0);assert.equal(x.notices.length,1);
});
test('P0-04 stale asynchronous read cannot load another project',async()=>{
 const x=await run({cancelAt:'read'});assert.equal(x.loads,0);assert.equal(x.preserves,0);assert.equal(x.notices.length,0);
});
test('P0-04 stale request after preserving cannot load',async()=>{
 const x=await run({cancelAt:'preserve'});assert.equal(x.loads,0);assert.equal(x.preserves,1);assert.equal(x.notices.length,0);
});
test('P0-04 safety overlay blocks fallback project replacement',async()=>{
 const x=await run({safety:true});assert.equal(x.loads,0);assert.equal(x.preserves,0);
});
test('P0-04 offline HTML loads updated file input integrity gate',()=>{
 assert.ok(fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8').includes('studio.js?rev=20261030-p0-04-file-size1'));
});
