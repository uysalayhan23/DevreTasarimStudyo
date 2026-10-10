'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..'),ui=fs.readFileSync(path.join(ROOT,'dist/tutorial-mode.js'),'utf8'),browser=fs.readFileSync(path.join(ROOT,'scripts/browser-visual-hl-v11920.cjs'),'utf8');
function fragment(start,end){const a=ui.indexOf(start),b=ui.indexOf(end,a);assert.ok(a>=0&&b>a);return ui.slice(a,b)}
const source=fragment('function applyCoachUi(coach){','function persistCoachBox');
function layout(w,h,minimized){
 const state={width:600,height:500,left:1200,top:900,minimized};
 const ctx={root:{innerWidth:w,innerHeight:h},coachDefaultBox:()=>state,coachUiState:()=>state,syncCoachPanelControl:()=>{}};
 vm.runInNewContext(source+';this.layout=applyCoachUi',ctx);
 const classes=new Set(),coach={style:{},hidden:false,classList:{toggle(n,v){if(v)classes.add(n);else classes.delete(n)}}};
 ctx.layout(coach);
 return {left:parseFloat(coach.style.left),top:parseFloat(coach.style.top),width:parseFloat(coach.style.width),height:minimized?44:parseFloat(coach.style.height),minimized:classes.has('is-minimized')};
}
for(const [w,h] of [[1440,1000],[760,640],[400,320]])for(const minimized of [false,true]){
 test('coach geometry '+w+'x'+h+' minimized='+minimized,()=>{
  const g=layout(w,h,minimized);
  assert.equal(g.minimized,minimized);assert.ok(g.left>=7&&g.top>=57);
  assert.ok(g.left+g.width<=w+1&&g.top+g.height<=h+1,JSON.stringify(g));
 });
}
test('minimize, re-open and resize hooks re-clamp panel',()=>{
 const toggle=fragment('function toggleCoachMinimize(){','function mountCoachChrome');
 const visible=fragment('function setCoachVisible(show){','function toggleCoachMinimize');
 assert.match(toggle,/saveCoachUi\(\{minimized\}\)/);
 assert.match(toggle,/applyCoachUi\(coach\)/);
 assert.match(visible,/applyCoachUi\(coach\)/);
 assert.match(ui,/addEventListener\('resize',\(\)=>\{[^\n]*applyCoachUi\(coach\)/);
});
test('PNG envelope and failure JSON are checked before visual acceptance',()=>{
 assert.match(browser,/Buffer\.from\(\[137,80,78,71,13,10,26,10\]\)/);
 assert.match(browser,/IHDR/);assert.match(browser,/IEND/);
 assert.match(browser,/data\.readUInt32BE\(16\)/);
 assert.match(browser,/report\.failure=\{message:/);
 assert.match(browser,/fs\.writeFileSync\(path\.join\(BUILD,'report\.json'\)/);
 assert.ok(browser.indexOf("const cornerShot=await shot")<browser.indexOf("assert(cornerChecks.every"));
 assert.ok(browser.indexOf("const panelShot=await shot")<browser.indexOf("assert(interaction.ok"));
});
