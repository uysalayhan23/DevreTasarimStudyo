'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');

test('marquee visual uses viewport screen space instead of transformed SVG workspace',()=>{
 const app=fs.readFileSync(path.join(root,'dist','app.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'dist','styles.css'),'utf8');
 const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
 assert.match(app,/function viewportPoint\(e\)/);
 assert.match(app,/screenStart=viewportPoint\(e\)/);
 assert.match(app,/screenEnd=viewportPoint\(ev\)/);
 assert.match(app,/const box=document\.createElement\('div'\)/);
 assert.match(app,/els\.viewport\.appendChild\(box\)/);
 assert.doesNotMatch(app,/els\.workspace\.appendChild\(box\)/);
 assert.match(app,/Object\.assign\(box\.style,\{left:screenRect\.left\+'px'/);
 assert.match(css,/\.selection-box\{position:absolute;z-index:8;pointer-events:none;/);
 assert.match(html,/styles\.css\?rev=20261008-marquee-screen-overlay2/);
 assert.match(html,/app\.js\?rev=[A-Za-z0-9-]+/);
 assert.doesNotMatch(html,/app\.js\?rev=20261008-marquee-screen-overlay1/);
});

test('marquee selection membership still uses world coordinates',()=>{
 const app=fs.readFileSync(path.join(root,'dist','app.js'),'utf8');
 assert.match(app,/start=worldPoint\(e\),screenStart=viewportPoint\(e\)/);
 assert.match(app,/const end=worldPoint\(ev\),screenEnd=viewportPoint\(ev\)/);
 assert.match(app,/Selection\.inBox\(project\.components,byId,start,end\)/);
});


test('legacy SVG selection-box style is removed',()=>{
 const css=fs.readFileSync(path.join(root,'dist','styles.css'),'utf8');
 assert.equal((css.match(/\.selection-box\{/g)||[]).length,1);
 assert.doesNotMatch(css,/vector-effect:non-scaling-stroke/);
 assert.match(css,/selection-box is an HTML viewport overlay/);
});
