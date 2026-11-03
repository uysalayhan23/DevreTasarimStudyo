'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const Space=require('../dist/workspace-space.js');
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'dist/styles.css'),'utf8');

function gridRect(doc){
 const match=doc.match(/<rect\s+class="grid-bg"\s+x="([0-9.]+)"\s+y="([0-9.]+)"\s+width="([0-9.]+)"\s+height="([0-9.]+)"\s+fill="url\(#majorGrid\)"\s*\/>/);
 assert.ok(match,'SVG grid background must remain a single majorGrid rectangle');
 return {x:Number(match[1]),y:Number(match[2]),width:Number(match[3]),height:Number(match[4])};
}
function gridStroke(doc,id){
 const pattern=doc.match(new RegExp('<pattern id="'+id+'"[^>]*>([\\s\\S]*?)<\\/pattern>'));
 assert.ok(pattern,'SVG pattern missing: '+id);
 const stroke=pattern[1].match(/<path[^>]*stroke="(#[0-9a-fA-F]{6})"\s+stroke-width="([0-9.]+)"/);
 assert.ok(stroke,'SVG path stroke missing: '+id);
 return {hex:stroke[1].toLowerCase(),width:Number(stroke[2])};
}
function luminance(hex){
 const linear=n=>{const x=n/255;return x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4};
 const channels=[1,3,5].map(pos=>linear(parseInt(hex.slice(pos,pos+2),16)));
 return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
}
function coverage(doc){
 const grid=gridRect(doc);
 return grid.x===0&&grid.y===0&&grid.width===Space.widthScene&&grid.height===Space.heightScene;
}
function contrast(doc){
 const minor=gridStroke(doc,'minorGrid'),major=gridStroke(doc,'majorGrid');
 return minor.width>=0.9&&minor.width<major.width&&major.width>=1.2&&
   luminance(minor.hex)<luminance('#dde4ec')&&
   luminance(major.hex)<luminance('#c5cfdb')&&
   luminance(major.hex)<luminance(minor.hex);
}

test('whole shared 6400 x 4200 scene remains visible as grid without changing 2 scene units/mm',()=>{
 assert.equal(Space.sceneUnitsPerMm,2);
 assert.deepEqual([Space.widthScene,Space.heightScene,Space.widthMm,Space.heightMm],[6400,4200,3200,2100]);
 assert.equal(Space.gridScene,10);
 assert.ok(coverage(html),'grid must cover all usable x/y component and wire coordinates');
 assert.match(css,/\.viewport #workspace\{[^\n]*width:6400px;height:4200px/);
 assert.match(html,/id="scene"/);
});

test('minor and major grid lines are modestly darker while major stays clearer',()=>{
 assert.ok(contrast(html),'both grid strokes must be darker than baseline with stronger major spacing');
});

test('negative: old quarter-sheet grid is rejected rather than accepted as usable full drawing area',()=>{
 const reduced=html.replace(/class="grid-bg" x="0" y="0" width="6400" height="4200"/, 'class="grid-bg" x="0" y="0" width="3200" height="2100"');
 assert.notEqual(reduced,html,'mutation must actually alter the fixed grid');
 assert.equal(coverage(reduced),false);
});

test('negative: old faint grid stroke colors are rejected by contrast gate',()=>{
 const faded=html.replace(/stroke="#[0-9a-f]{6}" stroke-width="0\.9"/,'stroke="#dde4ec" stroke-width="0.85"')
  .replace(/stroke="#[0-9a-f]{6}" stroke-width="1\.2"/,'stroke="#c5cfdb" stroke-width="1.15"');
 assert.notEqual(faded,html,'mutation must actually change stroke settings');
 assert.equal(contrast(faded),false);
});
