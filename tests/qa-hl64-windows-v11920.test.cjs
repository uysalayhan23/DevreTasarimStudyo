'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');

test('single-click QA runner delegates to a separate PowerShell script',()=>{
 const bat=read('QA_HL64_CALISTIR.bat');
 assert.match(bat,/cd \/d "%~dp0"/i);
 assert.match(bat,/powershell\.exe -NoProfile -ExecutionPolicy Bypass -File/i);
 assert.match(bat,/qa-hl64-windows-v11920\.ps1/i);
 assert.match(bat,/exit \/b %QA_EXIT%/i);
 const appLauncher=read('BASLAT.bat');
 assert.match(appLauncher,/file:\/\/\//i);
 assert.doesNotMatch(bat,/\bBASLAT\.bat\s*>/i);
});

test('Windows QA runs actual Node tests and browser script, with no GitHub Actions',()=>{
 const ps=read('scripts/qa-hl64-windows-v11920.ps1');
 for(const required of [
  'tutorial-coach-responsive-contract-v11920.test.cjs',
  'tutorial-hl-64-lesson-acceptance-v11920.test.cjs',
  'tutorial-installation-batch-h-v11920.test.cjs',
  'tutorial-next-batch-i-v11920.test.cjs',
  'tutorial-sensor-batch-j-v11920.test.cjs',
  'tutorial-open-collector-pulldown-v11920.test.cjs',
  'tutorial-topic-review-batch-m-v11920.test.cjs',
  'tutorial-practice-guide-batch-n-v11920.test.cjs',
  'qa-tutorial-1655-failclosed-v11920.test.cjs',
  'project-legacy-collector-pullup-v11920.test.cjs',
  'tutorial-motor-batch-k-v11920.test.cjs',
  'tutorial-dual-dc-batch-l-v11920.test.cjs',
  'browser-visual-hl-v11920.cjs',
  'qa-hl64-artifact-verify-v11920.cjs'
 ])assert.ok(ps.includes(required),'Missing QA step '+required);
 assert.match(ps,/Remove-Item -LiteralPath \$Visual -Recurse -Force/);
 assert.match(ps,/CHROME_BIN/);
 assert.match(ps,/Start-Process/);
 assert.doesNotMatch(ps,/gh workflow run|github\.com\/actions|npm run.*actions/i);
});

test('QA always packages both failing logs and successful evidence separately from application launcher',()=>{
 const ps=read('scripts/qa-hl64-windows-v11920.ps1');
 assert.match(ps,/finally \{/);
 assert.match(ps,/Compress-Archive/);
 assert.match(ps,/Copy-Item -LiteralPath \$Visual/);
 assert.match(ps,/run-summary\.json/);
 assert.match(ps,/chromium-hl64/);
 assert.match(ps,/artifact-verification/);
 assert.match(ps,/\$Summary\.status = 'PASS'/);
 assert.match(ps,/if \(\$Summary\.status -ne 'PASS'\) \{ exit 1 \}/);
});

test('independent verifier fails closed without 64 lessons, 100 PNG, JSON and SHA-256',()=>{
 const src=read('scripts/qa-hl64-artifact-verify-v11920.cjs');
 const verify=require('../scripts/qa-hl64-artifact-verify-v11920.cjs');
 assert.equal(typeof verify.main,'function');
 assert.equal(verify.screenshotEntries({a:{file:'x.png'},b:[{file:'y.png'}]}).length,2);
 assert.match(src,/verifyHLArtifactCoverage\(report\)/);
 assert.match(src,/verifyReportArtifacts\(report\)/);
 assert.match(src,/coverage\.expectedTotal!==100/);
 assert.match(src,/entries\.length!==100/);
 assert.match(src,/report\.failure\|\|report\.navigationFailure/);
 assert.match(src,/sha256\(bytes\)/);
 assert.match(src,/checksums\.sha256/);
 assert.match(src,/verification\.failure\.json/);
});


test('H-L acceptance ties physical motor regression and all executed test inputs to SHA-256 evidence',()=>{
 const ps=read('scripts/qa-hl64-windows-v11920.ps1');
 assert.match(ps,/tests\/tutorial-motor-physical-regression-v11920\.test\.cjs/);
 assert.match(ps,/\$TraceSources = @\(\$Tests\)/);
 for(const source of [
  'dist/tutorial-source-outline.js','dist/tutorial-lessons.js',
  'dist/tutorial-installation-batch-h.js','dist/tutorial-next-batch-i.js',
  'dist/tutorial-sensor-batch-j.js','dist/tutorial-motor-batch-k.js',
  'dist/tutorial-dual-dc-batch-l.js','dist/simulation.js'
 ])assert.ok(ps.includes(source),'Missing source hash provenance: '+source);
 assert.match(ps,/Get-FileHash -LiteralPath \$Absolute -Algorithm SHA256/);
 assert.match(ps,/Missing source required for reproducible H-L QA/);
 for(const runner of [
  'QA_HL64_CALISTIR.bat',
  'scripts/qa-hl64-windows-v11920.ps1',
  'tests/qa-hl64-windows-v11920.test.cjs'
 ])assert.ok(ps.includes(runner),'QA executor missing from source-hashes: '+runner);
 for(const path of ['dist/project-store.js','dist/studio.js','dist/library.js','dist/tutorial-expanded-lessons.js','dist/installation-v118.js','dist/tutorial-topic-review-batch-m.js','dist/tutorial-practice-guide-batch-n.js','scripts/qa-tutorial-1655-simulation-v11920.cjs'])
  assert.ok(ps.includes(path),'Legacy-compatibility source not provenance-hashed: '+path);
 assert.match(ps,/source-hashes\.json/);
});
