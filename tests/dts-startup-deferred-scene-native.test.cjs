'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','dist');
const app=()=>fs.readFileSync(path.join(root,'app.js'),'utf8');
const studio=()=>fs.readFileSync(path.join(root,'studio.js'),'utf8');
test('dashboard bootstrap alone defers initial hidden scene rendering',()=>{
 const src=app();assert.match(src,/let deferredInitialScene=false,bootstrapSceneAttempted=false/);
 assert.match(src,/if\(!bootstrapSceneAttempted\)\{[\s\S]*?bootstrapSceneAttempted=true;[\s\S]*?if\(document\.body\.classList\.contains\('dashboard-open'\)\)\{deferredInitialScene=true;return\}/);
});
test('first visible editor bootstrap still uses the full initial render path',()=>{
 const src=app();assert.match(src,/if\(document\.body\.classList\.contains\('dashboard-open'\)\)\{deferredInitialScene=true;return\}/);
 assert.match(src,/applyCamera\(\);if\(!document\.body\.classList\.contains\('dashboard-open'\)\)renderLibrary\(\);render\(\);materialLayoutWarning\(\)/);
});
test('bootstrap guard executes at most once, no active rendering is suppressed',()=>{
 const src=app();const start=src.indexOf('  function render(simulationTick=false){');const end=src.indexOf('    clearTimeout(simulationTimer)',start);
 const f=src.slice(start,end);assert.match(f,/if\(!bootstrapSceneAttempted\)/);assert.match(f,/bootstrapSceneAttempted=true/);assert.match(f,/deferredInitialScene=false/);
 assert.ok(f.indexOf('deferredInitialScene=false')>f.indexOf('bootstrapSceneAttempted=true'));
});
test('later project open is unchanged and always redraws normally',()=>{
 const src=app();assert.match(src,/modeUI\(\);populateWireMenu\(\);renderLibrary\(\);render\(\);if\(project\.workspaceMode==='panel'\)/);
 assert.match(src,/load\(value\)\{/);
});
test('resume from dashboard performs missing scene draw once before presentation',()=>{
 const src=studio(),start=src.indexOf('function showEditor(){'),end=src.indexOf('function markDirty()',start),f=src.slice(start,end);
 assert.match(f,/if\(E\.needsInitialScene\)E\.render\(\)/);
 assert.ok(f.indexOf("document.body.classList.remove('dashboard-open')")<f.indexOf('if(E.needsInitialScene)E.render()'));
});
test('already rendered scene does not incur a redundant render on project load',()=>{
 const src=app();assert.match(src,/get needsInitialScene\(\)\{return deferredInitialScene\}/);
 assert.match(src,/deferredInitialScene=false/);
 assert.match(studio(),/if\(E\.needsInitialScene\)E\.render\(\)/);
});
test('both ordinary and panel workspace remain supported by existing native renderer',()=>{
 const src=app();assert.match(src,/if\(project\.workspaceMode==='panel'\)\{running=false/);
 assert.match(src,/window\.DTSPanelEditor\?\.render\(\)/);
 assert.match(src,/els\.scene\.innerHTML=''/);
});
test('no changes to runtime / catalog / native solver loading sequence',()=>{
 const h=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const script of ['library.js','simulation.js','plc-runtime.js','ladder-runtime.js','arduino-examples.js'])assert.match(h,new RegExp('<script src="'+script.replace('.','\\.')+'\\?'));
 assert.ok(h.indexOf('library.js?rev=')<h.indexOf('simulation.js?rev='));
});
test('existing deferred library and preview remain independent of scene bootstrap gate',()=>{
 const src=app(),s=studio();assert.match(src,/if\(!document\.body\.classList\.contains\('dashboard-open'\)\)renderLibrary\(\)/);
 assert.match(s,/if\(document\.querySelector\('#componentLibrary'\)\?\.dataset\.catalogReady!=='1'\)E\.renderLibrary\(\)/);
});
test('no new timer, forced persistent save or network access in scene bootstrap',()=>{
 const src=app(),start=src.indexOf('let deferredInitialScene=false,bootstrapSceneAttempted=false'),end=src.indexOf('clearTimeout(simulationTimer)',start);
 assert.doesNotMatch(src.slice(start,end),/fetch\(|setTimeout\(|setInterval\(|persistDraftSync\(|scheduleSave\(/);
});
