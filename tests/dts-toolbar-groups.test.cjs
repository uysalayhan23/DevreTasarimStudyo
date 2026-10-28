'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../dist/studio.css'),'utf8');
test('existing toolbar IDs preserved exactly once in organized groups',()=>{
 const ids=['newBtn','saveBtn','openBtn','exportBtn','selectAllBtn','undoBtn','redoBtn','zoomOut','zoomIn','fitBtn','zoomLabel'];
 for(const id of ids)assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
 for(const group of ['Dosya','Düzenle','Görünüm'])assert.ok(html.includes('aria-label="'+group+'"'));
});
test('existing simulation and fullscreen controls are untouched',()=>{
 for(const id of ['simulateBtn','dtsFullModeBtn','dtsLadderBtn'])assert.ok(html.includes('id="'+id+'"'));
});
test('compact toolbar can scroll without zooming or hiding canvas',()=>{
 assert.match(css,/\.toolbar\.dts-toolbar-organized\{[^}]*overflow-x:auto/);
 assert.match(css,/\.dts-toolbar-cluster\+\.dts-toolbar-cluster/);
});
