'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');

test('wire pointer mapping uses live SVG screen CTM',()=>{
 const app=fs.readFileSync(path.join(root,'dist','app.js'),'utf8');
 assert.match(app,/function pointerWorldPoint\(e\)/);
 assert.match(app,/els\.scene\?\.getScreenCTM\?\.\(\)/);
 assert.match(app,/point\.matrixTransform\(inverse\)/);
 assert.match(app,/function canvasPoint\(e\)\{\s*const p=pointerWorldPoint\(e\)/);
 assert.match(app,/function worldPoint\(e\)\{return pointerWorldPoint\(e\)\}/);
});

test('legacy viewport conversion remains only as a guarded fallback',()=>{
 const app=fs.readFileSync(path.join(root,'dist','app.js'),'utf8');
 const block=app.slice(app.indexOf('function pointerWorldPoint'),app.indexOf('function canvasPoint'));
 assert.match(block,/Viewport\.clientToWorld/);
 assert.ok(block.indexOf('getScreenCTM')<block.indexOf('Viewport.clientToWorld'),'screen CTM must be attempted before fallback');
});

test('wire preview still tracks pointermove through canvasPoint',()=>{
 const app=fs.readFileSync(path.join(root,'dist','app.js'),'utf8');
 assert.match(app,/els\.viewport\.addEventListener\('pointermove',e=>\{if\(!pendingPort\|\|gesture\)return;draftMouse=canvasPoint\(e\);renderDraftWire\(\)\}\)/);
 assert.match(app,/routePoints\(pendingPort,\{point:draftMouse\},draftPoints,false\)/);
});

test('pointer alignment cache revision is current',()=>{
 const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
 assert.match(html,/app\.js\?rev=20261008-sim-audit1/);
});
