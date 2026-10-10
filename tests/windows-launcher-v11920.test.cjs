const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const launcher=fs.readFileSync(path.join(root,'BASLAT.bat'),'utf8');

test('v1.19.20 Windows launcher has a real no-browser smoke-test gate',()=>{
  assert.match(launcher,/DTS_LAUNCHER_TEST/i);
  assert.match(launcher,/DTS_LAUNCHER_SMOKE_OK/);
  const smoke=launcher.indexOf('DTS_LAUNCHER_TEST');
  const firstStart=launcher.toLowerCase().indexOf('start ""');
  assert.ok(smoke>=0,'smoke gate missing');
  assert.ok(firstStart<0||smoke<firstStart,'smoke gate must run before any browser launch');
});

test('v1.19.20 Windows launcher opens dist index directly with file URI',()=>{
  assert.match(launcher,/set "INDEX=%ROOT%dist\\index\.html"/i);
  assert.match(launcher,/set "FILEURL=file:\/\/\/%INDEX:\\=\/%"/i);
  assert.doesNotMatch(launcher,/set "STARTPAGE=/i);
  assert.doesNotMatch(launcher,/DEVRE_LOCAL_SERVER/i);
  assert.doesNotMatch(launcher,/127\.0\.0\.1/i);
  assert.match(launcher,/arduino-card/i);
  assert.match(launcher,/tutorial-card/i);
});

test('v1.19.20 Windows launcher keeps direct-file browser and Windows fallbacks',()=>{
  assert.match(launcher,/Microsoft\\Edge\\Application\\msedge\.exe/i);
  assert.match(launcher,/Google\\Chrome\\Application\\chrome\.exe/i);
  assert.match(launcher,/Mozilla Firefox\\firefox\.exe/i);
  assert.match(launcher,/rundll32\.exe url\.dll,FileProtocolHandler "%FILEURL%"/i);
  assert.match(launcher,/powershell\.exe -NoProfile -ExecutionPolicy Bypass/i);
  assert.match(launcher,/start "" "%INDEX%"/i);
});

test('v1.19.20 Windows launcher preserves visible failure path for dist index',()=>{
  assert.match(launcher,/:launch_error/i);
  assert.match(launcher,/dist\\index\.html dosyasini dogrudan acin/i);
  assert.match(launcher,/pause\r?\nexit \/b 7/i);
});
