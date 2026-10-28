'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../dist/index.html'),'utf8');
test('new FBD and Ladder assets have distinct local cache revision tags',()=>{
 for(const path of ['studio.css','fbd-view.js','ladder-editor.js']){
  assert.match(html,new RegExp(path.replace('.','\\.')+'\\?rev=20261028-fbd-contact-ref2'));
 }
});
test('offline startup still loads runtime before FBD and editor',()=>{
 const runtime=html.indexOf('src="ladder-runtime.js?rev='),
 fbd=html.indexOf('src="fbd-view.js?rev='),
 editor=html.indexOf('src="ladder-editor.js?rev=');
 assert.ok(runtime>=0&&fbd>runtime&&editor>fbd);
});
test('no HTTP server introduced and previous UI files retain their revision',()=>{
 assert.doesNotMatch(html,/127\\.0\\.0\\.1|http:\/\/localhost|http-server/);
 assert.match(html,/scene-layer-order\.js\?rev=20261028-priority-layers1/);
});
