'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const M111=require('../dist/materials-v111.js');
const M113=require('../dist/materials-v113.js');
const M115=require('../dist/materials-v115.js');

test('phase and NH renderers preserve aspect ratio with a local silhouette clip',()=>{
  for(const phaseProtection of [true,false]){
    const html=M111.markup({id:phaseProtection?'fkv':'fsr',kind:'phase-monitor',phaseProtection,w:180,h:240},{id:'probe-'+phaseProtection});
    assert.match(html,/preserveAspectRatio="xMidYMid meet"/);
    assert.match(html,/clip-path="url\(#phase-bg-/);
    assert.doesNotMatch(html,/preserveAspectRatio="none"/);
  }
  const nh=M111.markup({id:'nh-fuse-holder',w:180,h:240},{id:'nh-test',nhFuses:[false,false,false]});
  assert.match(nh,/clip-path="url\(#nh-holder-bg-/);
  assert.match(nh,/preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(nh,/preserveAspectRatio="none"/);
});

test('ENDA Baykon Weidmuller photo renderers keep clipping and proportions',()=>{
  for(const [instrument,w,h] of [['et4420',240,240],['tx11',110,240],['waz5',35,184.8]]){
    const html=M115.markup({id:instrument,instrument,w,h},{id:'instance-'+instrument});
    assert.match(html,/clip-path="url\(#instrument-/);
    assert.match(html,/preserveAspectRatio="xMidYMid meet"/);
    assert.doesNotMatch(html,/preserveAspectRatio="none"/);
    assert.match(html,/class="material-layer"/);
  }
  const generic=M115.markup({id:'generic-product',w:100,h:280,productPhoto115:'example.png'},{id:'example'});
  assert.match(generic,/clip-path="url\(#p115-bg-/);
  assert.match(generic,/preserveAspectRatio="xMidYMid meet"/);
});

test('Siemens real product branches remain aspect-safe with clipping',()=>{
  for(const model of ['3RV2011-1JA10','5TL1163-0','5SL6116-7','5SL6316-7','5SL6216-7']){
    const html=M113.markup({id:'siemens-'+model,siemensPhoto:model,w:180,h:340},{id:'test-'+model});
    assert.match(html,/preserveAspectRatio="xMidYMid meet"/);
    assert.match(html,/clip-path="url\(#photo113-/);
    assert.doesNotMatch(html,/preserveAspectRatio="none"/);
  }
});
