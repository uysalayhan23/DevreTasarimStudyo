const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const read=p=>fs.readFileSync(p,'utf8');

test('WP-014 current release identity is v1.19.20 across runtime and launchers',()=>{
  const app=read('dist/app.js'),html=read('dist/index.html'),bat=read('BASLAT.bat'),launcher=read('BASLAT.html'),usage=read('KULLANIM.txt');
  assert.match(app,/APP_VERSION='1\.19\.20'/);
  assert.match(html,/dashboard-version">ÇEVRİMDIŞI · v1\.19\.20/);
  assert.match(html,/class="offline">ÇEVRİMDIŞI · v1\.19\.20/);
  assert.match(bat,/Devre Tasarim Studyosu v1\.19\.20 Baslatici/);
  assert.match(launcher,/Devre Tasarım Stüdyosu v1\.19\.20/);
  assert.match(usage,/^DEVRE TASARIM STÜDYOSU v1\.19\.20/m);
  assert.match(usage,/dashboard sürüm bilgisinde “v1\.19\.20”/);
});

test('dashboard repair path cannot restore stale v1.19.1 identity',()=>{
  const studio=read('dist/studio.js');
  assert.match(studio,/data-dashboard-revision','1\.19\.20-dashboard4'/);
  assert.match(studio,/ÇEVRİMDIŞI · v1\.19\.20/);
  assert.match(studio,/aynı v1\.19\.20 klasöründeki dist dosyalarını/);
  assert.doesNotMatch(studio,/v1\.19\.1/);
});

test('WP-014 cache revision is not presented as application semver',()=>{
  const html=read('dist/index.html');
  assert.doesNotMatch(html,/\?v=1\.19\./);
  assert.match(html,/\?rev=20261004-wp014/);
});

test('Windows package name is derived from runtime APP_VERSION',()=>{
  const pkg=read('scripts/package.py');
  assert.match(pkg,/APP_VERSION/);
  assert.match(pkg,/Devre_Tasarim_Studyosu_v/);
  assert.match(pkg,/_Windows\.zip/);
});


test('topbar new project uses the canonical editor create API and does not emit stale schema v6',()=>{
  const app=read('dist/app.js');
  const start=app.indexOf("$('#newBtn').onclick");
  assert.ok(start>=0);
  const snippet=app.slice(start,start+900);
  assert.match(snippet,/window\.DTSEditor\.create\(/);
  assert.doesNotMatch(snippet,/version:6/);
  const store=read('dist/project-store.js');
  assert.match(store,/const CURRENT_VERSION=7/);
});
