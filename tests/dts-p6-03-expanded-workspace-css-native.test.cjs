'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),css=fs.readFileSync(path.join(root,'styles.css'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const Space=require('../dist/workspace-space.js'),View=require('../dist/viewport.js');
test('physical 6400x4200 circuit workspace is consistent in both CSS selectors and runtime',()=>{
  assert.equal(Space.widthScene,6400);assert.equal(Space.heightScene,4200);
  assert.equal(Space.sceneUnitsPerMm,2);
  assert.equal((css.match(/width:6400px;height:4200px/g)||[]).length,2);
  assert.doesNotMatch(css,/width:3200px;height:2100px/);
});
test('stylesheet revision changes to invalidate stale browser cache',()=>{
  assert.match(html,/styles\.css\?rev=20261101-physical-workspace-6400x4200/);
});
test('8x zoom preserves pointer anchor and 2mm conversion',()=>{
 const view={x:15,y:25,zoom:1},anchor={x:115,y:225};
 const next=View.zoomAt(view,8,anchor);
 assert.equal(next.zoom,8);
 assert.deepEqual(View.toWorld(next,anchor),View.toWorld(view,anchor));
 assert.equal(Space.mmFromScene(Space.sceneFromMm(105.8)),105.8);
});
