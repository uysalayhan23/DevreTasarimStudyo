const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('dashboard exposes all workshops, tutorial mode, and refreshed asset revision',()=>{
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
 for(const mode of ['control','building','panel','arduino'])assert.ok(html.includes('data-new-mode="'+mode+'"'),mode);
 assert.ok(html.includes('ARDUINO ATÖLYESİ'));
 assert.ok(html.includes('data-open-tutorial'));
 assert.ok(html.includes('ÖĞRETİCİ MODU'));
 assert.ok(html.includes('ÇEVRİMDIŞI · v1.19.20'));
 assert.ok(html.includes('studio.js?rev=20261004-wp014'));
 assert.ok(html.includes('project-store.js?rev=20261004-wp014'));
 assert.equal((html.match(/\?v=1\.19\.0"/g)||[]).length,0);
 const revisioned=html.match(/\?rev=[^\"']*/g)||[];assert.ok(revisioned.length>=30,revisioned.length);assert.equal((html.match(/\?v=1\.19\./g)||[]).length,0);assert.ok(html.includes('clamp-meter.js?rev=20261004-wp014'));
});
test('studio creation flow supports Arduino and reports errors',()=>{
 const js=fs.readFileSync(path.join(root,'dist/studio.js'),'utf8');
 assert.ok(js.includes("mode=W.normalize(mode)"));
 assert.ok(js.includes("arduino:'Arduino Projem'"));
 assert.ok(js.includes("Atölye açılamadı:"));
 assert.ok(js.includes('function ensureDashboardIntegrity()'));
 assert.ok(js.includes('repairDashboard:ensureDashboardIntegrity'));
 assert.ok(js.includes('grantFolderPermission'));
 assert.ok(js.includes('store.readEntry(diskEntries.find(e=>e.key===b.dataset.projectKey),true)'));
});
test('Arduino workshop card cannot be hidden by generic dashboard styling',()=>{
 const css=fs.readFileSync(path.join(root,'dist/studio.css'),'utf8');
 assert.ok(css.includes('#dashboard .design-card.arduino-card'));
 assert.ok(css.includes('#dashboard .design-card.tutorial-card'));
 assert.ok(css.includes('visibility:visible!important'));
});


test('launcher rejects stale mixed packages before opening the browser',()=>{
 const bat=fs.readFileSync(path.join(root,'BASLAT.bat'),'utf8');
 assert.ok(bat.includes('findstr /C:"arduino-card"'));
 assert.ok(bat.includes('guncel v1.19.20 dashboardu degil'));
 assert.ok(bat.includes('dist\\studio.js'));
});
test('dashboard uses delegated workshop clicks and reports startup dependency faults',()=>{
 const js=fs.readFileSync(path.join(root,'dist/studio.js'),'utf8');
 assert.ok(js.includes("e.target.closest?.('[data-new-mode]')"));
 assert.ok(js.includes('function startupFault(message)'));
 assert.ok(js.includes('Gerekli uygulama modüllerinden biri yüklenemedi'));
});


test('locked dashboard structure keeps four workshops and launcher guards together',()=>{
 const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
 const js=fs.readFileSync(path.join(root,'dist/studio.js'),'utf8');
 const bat=fs.readFileSync(path.join(root,'BASLAT.bat'),'utf8');
 assert.deepEqual([...html.matchAll(/data-new-mode="([^"]+)"/g)].map(m=>m[1]).slice(0,4),['control','building','panel','arduino']);
 assert.equal((html.match(/data-open-tutorial/g)||[]).length,1);
 assert.ok(html.includes('clamp-meter.js?rev=20261004-wp014'));
 assert.ok(js.includes("e.target.closest?.('[data-new-mode]')"));
 assert.ok(js.includes('STÜDYO BAŞLATILAMADI'));
 assert.ok(bat.includes('findstr /C:"arduino-card"'));
 assert.ok(bat.includes('findstr /C:"tutorial-card"'));
 assert.ok(bat.includes('findstr /C:"window.DTSStudio"'));
});


test('runtime dashboard repair restores Arduino, tutorial card, and tutorial shell',async()=>{
 const {createApp}=require('./helpers/offline-dom.cjs');
 const a=createApp({dashboard:true,settings:{'dts-opening-warning':'off'}});await a.ready;
 a.$('[data-new-mode="arduino"]').remove();a.$('[data-open-tutorial]').remove();a.$('#tutorialDashboard').remove();
 assert.equal(a.window.DTSStudio.repairDashboard(),true);
 assert.ok(a.$('[data-new-mode="arduino"]'));
 assert.ok(a.$('[data-open-tutorial]'));
 assert.ok(a.$('#tutorialDashboard'));
 assert.equal(a.$('#dashboard').getAttribute('data-dashboard-revision'),'1.19.20-dashboard4');
});


test('Windows launcher explains ZIP extraction, prefers Edge/Chrome, and has HTML fallback',()=>{
 const bat=fs.readFileSync(path.join(root,'BASLAT.bat'),'utf8');
 const html=fs.readFileSync(path.join(root,'BASLAT.html'),'utf8');
 assert.ok(bat.includes('ZIP arsivinin icinden dogrudan calistirilamaz'));
 assert.ok(bat.includes('Tumunu ayikla'));
 assert.ok(bat.includes('Microsoft\\Edge\\Application\\msedge.exe'));
 assert.ok(bat.includes('Google\\Chrome\\Application\\chrome.exe'));
 assert.ok(bat.includes('DTS_LAUNCHER_TEST'));
 assert.ok(bat.includes('DTS_LAUNCHER_SMOKE_OK'));
 assert.ok(html.includes('dist/index.html'));
});
