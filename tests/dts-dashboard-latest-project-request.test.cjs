'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const G=require('../dist/dashboard-open-requests.js');
test('newest dashboard selection wins even if older file resolves last',async()=>{
 const gate=G.create();let ra,rb;const A=new Promise(r=>ra=r),B=new Promise(r=>rb=r),opened=[];
 const run=async pending=>{const ticket=gate.begin(),item=await pending;if(gate.isCurrent(ticket))opened.push(item)};
 const a=run(A),b=run(B);rb('B');await b;ra('A');await a;assert.deepEqual(opened,['B']);
});
test('opening another project invalidates an older pending selection',()=>{
 const gate=G.create(),old=gate.begin();gate.invalidate();
 assert.equal(gate.isCurrent(old),false);assert.equal(gate.isCurrent(gate.begin()),true);
});
test('invalid and fractional tokens cannot qualify',()=>{
 const gate=G.create();gate.begin();
 for(const v of [-1,0,1.5,'1',null])assert.equal(gate.isCurrent(v),false);
});
test('real card handler checks stale requests after both await points',()=>{
 const js=fs.readFileSync(path.join(__dirname,'../dist/studio.js'),'utf8');
 const begin=js.indexOf("for(const b of document.querySelectorAll('[data-project-key]')");
 const end=js.indexOf("$('#resumeProject').hidden=",begin);
 assert.ok(begin>0&&end>begin);
 const card=js.slice(begin,end);
 assert.match(card,/const ticket=projectRequests\.begin\(\)/);
 assert.equal((card.match(/projectRequests\.isCurrent\(ticket\)/g)||[]).length,3);
 assert.match(card,/await store\.readEntry\(diskEntries\.find\(e=>e\.key===b\.dataset\.projectKey\),true\)/);
});
test('offline dashboard has correct script order and all four workshops',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 const guard=html.indexOf('dashboard-open-requests.js?rev=');
 assert.ok(guard>0&&html.indexOf('studio.js?rev=')>guard);
 for(const m of ['control','building','panel','arduino'])assert.ok(html.includes('data-new-mode="'+m+'"'));
 assert.ok(html.includes('data-open-tutorial'));
});
