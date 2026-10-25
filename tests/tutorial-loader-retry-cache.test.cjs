'use strict';
// Targeted asynchronous in-memory DOM loader recovery; no Windows/browser claims.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'../dist',name),'utf8');
function fixture({failOnce=false,stale=false}={}){
 const scripts=[],calls=[],root={},handlers={};
 const make=()=>{const events={};return {
  dataset:{},async:false,src:'',getAttribute(name){return name==='src'?this.src:null;},
  addEventListener(name,fn){(events[name]||=[]).push(fn);},
  remove(){const i=scripts.indexOf(this);if(i>=0)scripts.splice(i,1)},
  dispatch(name){for(const fn of events[name]||[])fn()}
 }};
 const document={
  querySelectorAll(){return scripts},
  createElement(name){assert.equal(name,'script');return make()},
  addEventListener(name,fn){handlers[name]=fn},
  head:{appendChild(s){scripts.push(s);calls.push(s.src);Promise.resolve().then(()=>{
   if(failOnce){failOnce=false;s.dispatch('error')}
   else{if(s.src.startsWith('tutorial-mode.js'))root.DTSTutorialMode={openHub(){}};s.dispatch('load')}
  });}}
 };
 if(stale){const old=make();old.src='tutorial-lessons.js?v=stale';old.dataset.loaded='1';scripts.push(old)}
 return {root,document,scripts,calls,handlers};
}
test('bootstrap removes failed script and succeeds on user retry',async()=>{
 const f=fixture({failOnce:true}),ctx={window:f.root,document:f.document};
 vm.runInNewContext(read('tutorial-bootstrap.js'),ctx,{filename:'tutorial-bootstrap.js'});
 const api=f.root.DTSTutorialBootstrap;assert.ok(api);
 await assert.rejects(api.ensure(),/yüklenemedi/);
 assert.equal(f.scripts.length,0,'failed script must not poison retry');
 const mode=await api.ensure();assert.equal(mode,f.root.DTSTutorialMode);
 assert.equal(f.calls.length,5,'one failed attempt plus four fresh source modules');
 assert.equal(f.calls[1],'tutorial-lessons.js?v=20261025-illuminated-bell1','retry must load the repaired bell lesson version');
});
test('bootstrap rejects stale cache version instead of adopting it',async()=>{
 const f=fixture({stale:true}),ctx={window:f.root,document:f.document};
 vm.runInNewContext(read('tutorial-bootstrap.js'),ctx);
 await assert.rejects(f.root.DTSTutorialBootstrap.ensure(),/önbellek sürümü uyuşmuyor/);
 assert.equal(f.calls.length,0,'do not append a conflicting version');
});
test('main curriculum loader rejects mismatched cache and retries failed script',async()=>{
 const s=read('tutorial-mode.js'),a=s.indexOf('function loadScript(src){'),b=s.indexOf('async function ensureCurriculumLoaded()');
 assert.ok(a>=0&&b>a);const loader=s.slice(a,b);
 let f=fixture({stale:true});
 let ctx={root:{document:f.document}};
 vm.runInNewContext(loader+';globalThis.__loadScript=loadScript;',ctx);
 await assert.rejects(ctx.__loadScript('tutorial-lessons.js?v=current'),/önbellek sürümü uyuşmuyor/);
 assert.equal(f.calls.length,0);
 f=fixture({failOnce:true});ctx={root:{document:f.document}};
 vm.runInNewContext(loader+';globalThis.__loadScript=loadScript;',ctx);
 await assert.rejects(ctx.__loadScript('tutorial-layer.js?v=fresh'),/yüklenemedi/);
 assert.equal(f.scripts.length,0);
 await ctx.__loadScript('tutorial-layer.js?v=fresh');
 assert.deepEqual(f.calls,['tutorial-layer.js?v=fresh','tutorial-layer.js?v=fresh']);
});

test('index entrypoint and teacher loader both invalidate the repaired bell lesson cache',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.match(html,/tutorial-bootstrap\.js\?rev=20261025-bell-cache-v2/);
 assert.match(read('tutorial-bootstrap.js'),/tutorial-lessons\.js\?v=20261025-illuminated-bell1/);
});
