'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(base,p),'utf8');
const space=require('../dist/workspace-space.js'),selection=require('../dist/selection.js');
test('drawing page expands to 3200 x 2100 scene units while preserving physical grid scale',()=>{
 assert.equal(space.widthScene,3200);assert.equal(space.heightScene,2100);
 assert.equal(space.widthMm,1600);assert.equal(space.heightMm,1050);
 assert.equal(space.sceneUnitsPerMm,2);assert.equal(space.gridScene,10);
 assert.equal(space.gridMm,5);assert.equal(space.panelMmNative,true);
});
test('editor scene, grid, scrollable SVG and fallback dimensions match expanded page',()=>{
 const app=read('dist/app.js'),html=read('dist/index.html'),css=read('dist/styles.css');
 assert.match(app,/SHEET_W=WorkspaceSpace\?\.widthScene\|\|3200/);
 assert.match(app,/SHEET_H=WorkspaceSpace\?\.heightScene\|\|2100/);
 assert.match(html,/class="grid-bg" x="0" y="0" width="3200" height="2100"/);
 assert.equal((css.match(/width:3200px;height:2100px/g)||[]).length,2);
 assert.doesNotMatch(css,/width:2400px;height:1500px/);
 assert.match(html,/workspace-space\.js\?rev=20261029-expanded-sheet1/);
 assert.match(html,/styles\.css\?rev=20261029-expanded-sheet1/);
});
test('default group movement includes newly available right and bottom drawing area',()=>{
 const bounds={left:3100,right:3130,top:2040,bottom:2050};
 assert.deepEqual(selection.constrain(bounds,100,100),{x:70,y:50});
});
test('launcher keeps a fully extracted dist index, offline smoke gate and direct Edge launch',()=>{
 const bat=read('BASLAT.bat');
 assert.match(bat,/set "INDEX=%ROOT%dist\\index\.html"/);
 assert.match(bat,/if \/I "%DTS_LAUNCHER_TEST%"=="1"/);
 assert.match(bat,/start "" "%BROWSER%" --new-window "%INDEX%"/);
 assert.match(bat,/set "FILEURL=file:\/\/\/%INDEX:\\=\/%"/);
 assert.doesNotMatch(bat,/127\.0\.0\.1|localhost/i);
});
test('Edge Program Files (x86) path cannot terminate CMD IF block through unquoted echo',()=>{
 const bat=read('BASLAT.bat');
 assert.match(bat,/echo Tarayici dogrudan baslatiliyor: "%BROWSER%"/);
 assert.doesNotMatch(bat,/echo Tarayici dogrudan baslatiliyor: %BROWSER%/);
 assert.match(bat,/ProgramFiles\(x86\)%\\Microsoft\\Edge\\Application\\msedge\.exe/);
});
test('launcher checks visible browser window before returning success or falling back',()=>{
 const bat=read('BASLAT.bat');
 assert.equal((bat.match(/call :confirm_browser_window/g)||[]).length,5);
 assert.match(bat,/:confirm_browser_window/);
 assert.match(bat,/Get-Process -ErrorAction SilentlyContinue/);
 assert.match(bat,/MainWindowTitle -like '\*Devre Tasar\*'/);
 assert.match(bat,/tarayici penceresi dogrulanamadi/);
 assert.match(bat,/pause\s+exit \/b 7/);
});
