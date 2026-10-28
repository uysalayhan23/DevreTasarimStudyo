'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const bat=fs.readFileSync(path.join(__dirname,'..','BASLAT.bat'),'utf8');
test('explicit Edge or installed browser starts before HTML default association',()=>{
 const direct=bat.indexOf('start "" "%BROWSER%" --new-window "%INDEX%"');
 const generic=bat.indexOf('start "" "%INDEX%"');
 assert.ok(direct>0&&generic>direct,'Default HTML association must only run after Edge');
});
test('no-browser smoke mode remains earlier than the first browser launch',()=>{
 const smoke=bat.indexOf('if /I "%DTS_LAUNCHER_TEST%"=="1"');
 const direct=bat.indexOf('start "" "%BROWSER%" --new-window "%INDEX%"');
 assert.ok(smoke>0&&smoke<direct);
 assert.match(bat,/DTS_LAUNCHER_SMOKE_OK/);
});
test('local offline target, visible errors and fallbacks remain intact',()=>{
 assert.match(bat,/set "INDEX=%ROOT%dist\\index\.html"/);
 assert.match(bat,/set "FILEURL=file:\/\/\/%INDEX:\\=\/%"/);
 assert.match(bat,/Microsoft\\Edge\\Application\\msedge\.exe/);
 assert.match(bat,/rundll32\.exe url\.dll,FileProtocolHandler "%FILEURL%"/);
 assert.match(bat,/powershell\.exe -NoProfile -ExecutionPolicy Bypass/);
 assert.match(bat,/:launch_error/);
 assert.doesNotMatch(bat,/http:\/\/localhost|127\.0\.0\.1|DEVRE_LOCAL_SERVER/);
});
