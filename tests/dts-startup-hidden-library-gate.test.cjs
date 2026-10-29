'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','dist');
const app=()=>fs.readFileSync(path.join(root,'app.js'),'utf8');
const studio=()=>fs.readFileSync(path.join(root,'studio.js'),'utf8');
const html=()=>fs.readFileSync(path.join(root,'index.html'),'utf8');
test('hidden dashboard startup does not build 260 non-visible material cards',()=>{
 const s=app();assert.match(s,/applyCamera\(\);if\(!document\.body\.classList\.contains\('dashboard-open'\)\)renderLibrary\(\);render\(\);materialLayoutWarning\(\);/);
});
test('startup still constructs the library immediately when editor is initially visible',()=>{
 assert.match(app(),/if\(!document\.body\.classList\.contains\('dashboard-open'\)\)renderLibrary\(\)/);
});
test('library ready flag is assigned only after drag and keyboard binding',()=>{
 const s=app(),i=s.indexOf("els.library.dataset.catalogReady='1';");
 assert.ok(i>0);assert.ok(s.lastIndexOf("$$('.component-card').forEach(card=>card.addEventListener('keydown'",i)>0);
 assert.ok(s.indexOf('  function updateNormBadge()',i)>i);
});
test('entering editor hydrates once after dashboard is removed',()=>{
 const s=studio();const start=s.indexOf('function showEditor(){'),end=s.indexOf('function markDirty()',start);
 assert.ok(start>=0&&end>start);const action=s.slice(start,end);
 const hide=action.indexOf("document.body.classList.remove('dashboard-open')"),ready=action.indexOf("dataset.catalogReady!=='1'"),build=action.indexOf('E.renderLibrary()');
 assert.ok(hide>=0&&ready>hide&&build>ready);assert.equal((action.match(/E\.renderLibrary\(\)/g)||[]).length,1);
});
test('already rendered library is not rebuilt in showEditor',()=>{
 assert.match(studio(),/if\(document\.querySelector\('#componentLibrary'\)\?\.dataset\.catalogReady!=='1'\)E\.renderLibrary\(\)/);
});
test('explicit load continues refreshing catalog and project without relying on the deferred flag',()=>{
 assert.match(app(),/modeUI\(\);populateWireMenu\(\);renderLibrary\(\);render\(\)/);
});
test('appearance/norm changes still rebuild current card thumbnails and filters',()=>{
 const s=app();assert.match(s,/setAppearance\(value\).*?renderLibrary\(\);render\(\)/s);
 assert.match(s,/els\.library\.innerHTML=savedSection\+normalSections/);
 assert.match(s,/libraryPreviews\.render\(els\.library,byId,previewSvg\)/);
});
test('dashboard resume uses showEditor and therefore hydrates any deferred catalog',()=>{
 assert.match(studio(),/\$\('#resumeProject'\)\.onclick=\(\)=>\{showEditor\(\)/);
});
test('offline cache revisions cover both startup files',()=>{
 const h=html();assert.ok(h.includes('app.js?rev=20261029-hidden-catalog1'));
 assert.ok(h.includes('studio.js?rev=20261029-hidden-catalog1'));
});
test('unmodified electrical catalog remains a full set of 703 entries',()=>{
 const before=global.window;global.window=global;require('../dist/library.js');
 const n=global.COMPONENT_LIBRARY.length;global.window=before;assert.equal(n,703);
});
