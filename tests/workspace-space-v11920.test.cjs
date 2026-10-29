'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const Space=require('../dist/workspace-space.js');

test('all workshops share one canonical physical workspace reference',()=>{
  assert.equal(Space.sceneUnitsPerMm,2);
  assert.equal(Space.widthScene,3200);
  assert.equal(Space.heightScene,2100);
  assert.equal(Space.widthMm,1600);
  assert.equal(Space.heightMm,1050);
  assert.equal(Space.gridScene,10);
  assert.equal(Space.gridMm,5);
  assert.deepEqual([...Space.modes],['control','building','arduino','panel']);
  assert.equal(Space.sceneFromMm(45),90);
  assert.equal(Space.mmFromScene(90),45);
  assert.equal(Space.panelMmNative,true);
});

test('main circuit editor consumes workspace-space instead of private sheet dimensions',()=>{
  const src=fs.readFileSync(path.join(root,'dist','app.js'),'utf8');
  assert.match(src,/WorkspaceSpace=window\.DTSWorkspaceSpace/);
  assert.match(src,/SHEET_W=WorkspaceSpace\?\.widthScene\|\|3200/);
  assert.match(src,/SHEET_H=WorkspaceSpace\?\.heightScene\|\|2100/);
  assert.doesNotMatch(src,/SHEET_W=2400,SHEET_H=1500/);
});

test('runtime loads workspace contract before editors',()=>{
  const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
  const space=html.indexOf('workspace-space.js');
  const app=html.indexOf('app.js');
  const panel=html.indexOf('panel-editor.js');
  assert.ok(space>=0);
  assert.ok(app>space);
  assert.ok(panel>space);
});
