'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const js=fs.readFileSync(path.join(__dirname,'../dist/ladder-editor.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../dist/studio.css'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
test('network toolbar and drag-drop target wiring',()=>{
 assert.ok(html.indexOf('ladder-toolbox.js?rev=')<html.indexOf('ladder-editor.js?rev='));
 for(const x of ['Toolbox.tools.map','data-drop-kind="network"','data-drop-kind="contact"','data-drop-kind="coil"','dragstart','dragover',"'drop'"])assert.ok(js.includes(x),x);
});
test('each rung is independently collapsed or expanded, with focus mode',()=>{
 for(const x of ['closedNetworks','toggle-network','focus-network','all-networks'])assert.ok(js.includes(x),x);
});
test('palette actions update only draft and allow undo',()=>{
 assert.ok(js.includes('Toolbox.apply(active.draft'));
 assert.ok(js.includes('active.history.push(result.program)'));
 assert.ok(js.includes('if(editor.running){'));
});
test('button foreground black on matching light surfaces',()=>{
 assert.match(css,/color:#101820!important;background:#edf5fb!important/);
 assert.ok(css.includes('.dts-ladder-tool-list button'));
 assert.ok(css.includes('.topbar button.simulate.running'));
});
