'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../dist/studio.css'),'utf8');
const base=fs.readFileSync(path.join(__dirname,'../dist/styles.css'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
const narrow=css.match(/\.topbar\s+\.toolbar\.dts-toolbar-organized\s+\.tool\s*\{([^{}]*)\}/);
test('legacy narrow-screen .tool hiding rule remains detectable',()=>{
 assert.match(base,/@media\s*\(max-width:\s*720px\)/);
 assert.match(base,/\.tool\s*\{\s*display\s*:\s*none/);
});
test('organized toolbar explicitly restores narrow-screen tools',()=>{
 assert.ok(narrow,'narrow toolbar rule is missing');
 assert.ok(css.lastIndexOf('@media(max-width:720px)',narrow.index)>-1);
 assert.match(narrow[1],/display\s*:\s*inline-flex\s*;/);
 assert.doesNotMatch(narrow[1],/display\s*:\s*none/);
});
test('narrow toolbar remains horizontally scrollable, not wrapped',()=>{
 assert.match(css,/\.topbar\s+\.toolbar\.dts-toolbar-organized\s*\{[^{}]*overflow-x\s*:\s*auto\s*;/);
 assert.match(css,/\.topbar\s+\.toolbar\.dts-toolbar-organized\s*\{[^{}]*flex-wrap\s*:\s*nowrap/);
});
test('file actions and fullscreen control remain in the toolbar',()=>{
 for(const id of ['newBtn','saveBtn','openBtn','exportBtn','dtsPrintPdfBtn','dtsFullModeBtn'])assert.match(html,new RegExp('id="'+id+'"[^>]*class="tool'));
});
test('fullscreen button retains explicit narrow-screen visibility',()=>{
 assert.match(css,/\.topbar\s+\.tool\.dts-full-toggle\s*\{display\s*:\s*inline-flex\s*!important/);
});
