const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const source=file=>fs.readFileSync(path.join(__dirname,'..','dist',file),'utf8');

test('photo backdrop cleanup preserves phase monitor and NH housing aspect ratio',()=>{
  const s=source('materials-v111.js');
  assert.match(s,/viewBox="\$\{vb\}" preserveAspectRatio="xMidYMid meet"/);
  assert.match(s,/viewBox="105 180 785 1350" preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(s,/viewBox="\$\{vb\}" preserveAspectRatio="none"/);
  assert.doesNotMatch(s,/viewBox="105 180 785 1350" preserveAspectRatio="none"/);
  assert.match(s,/clipPath id="\$\{scope\}"/);
  assert.match(s,/clipPath id="\$\{nhScope\}"/);
});

test('instrument and product photo helpers do not distort original silhouettes',()=>{
  const s=source('materials-v115.js');
  const proportionate=(s.match(/viewBox="\$\{vb\}" preserveAspectRatio="xMidYMid meet"/g)||[]).length;
  assert.equal(proportionate,2);
  assert.doesNotMatch(s,/viewBox="\$\{vb\}" preserveAspectRatio="none"/);
  assert.match(s,/clip-path="url\(#\$\{id\}\)"/);
});

test('existing Siemens renderer retains aspect-preserving viewboxes',()=>{
  const s=source('materials-v113.js');
  assert.match(s,/viewBox="0 0 180 388" preserveAspectRatio="xMidYMid meet"/);
  assert.match(s,/viewBox="0 0 126 490" preserveAspectRatio="xMidYMid meet"/);
});
