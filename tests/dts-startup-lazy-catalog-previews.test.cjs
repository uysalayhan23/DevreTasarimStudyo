'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Previews=require('../dist/library-preview-lazy.js');
const makeCard=(id)=>({dataset:{previewType:id},innerHTML:'',isConnected:true,removeAttribute(k){if(k==='data-preview-type')delete this.dataset.previewType}});
class FakeObserver{
 static instances=[];
 constructor(callback,options){this.callback=callback;this.options=options;this.observed=new Set();this.disconnected=false;FakeObserver.instances.push(this)}
 observe(node){this.observed.add(node)}
 unobserve(node){this.observed.delete(node)}
 disconnect(){this.disconnected=true;this.observed.clear()}
 notify(node,visible=true){this.callback([{target:node,isIntersecting:visible}])}
}
const fixtures=()=>{const nodes=[makeCard('a'),makeCard('b'),makeCard('c')];return {nodes,root:{querySelectorAll:()=>nodes},lookup:{a:{id:'a'},b:{id:'b'},c:{id:'c'}}}};
test('no SVG is created until a preview enters the library viewport',()=>{
 FakeObserver.instances=[];const f=fixtures(),api=Previews.create(FakeObserver),done=[];
 api.render(f.root,f.lookup,d=>{done.push(d.id);return '<svg>'+d.id+'</svg>'});
 assert.deepEqual(done,[]);assert.equal(FakeObserver.instances[0].observed.size,3);
 FakeObserver.instances[0].notify(f.nodes[0],true);
 assert.deepEqual(done,['a']);assert.equal(f.nodes[0].innerHTML,'<svg>a</svg>');assert.equal(FakeObserver.instances[0].observed.size,2);
});
test('invisible cards stay lazy, all catalog records remain accessible',()=>{
 const f=fixtures(),api=Previews.create(FakeObserver),out=[];api.render(f.root,f.lookup,d=>{out.push(d.id);return '<svg/>'});
 const obs=FakeObserver.instances.at(-1);obs.notify(f.nodes[1],false);
 assert.deepEqual(out,[]);assert.equal(f.nodes.length,3);assert.equal(f.nodes[1].dataset.previewType,'b');
});
test('scrolling hydrates later previews exactly once',()=>{
 const f=fixtures(),api=Previews.create(FakeObserver);let n=0;api.render(f.root,f.lookup,()=>{n++;return '<svg/>'});
 const ob=FakeObserver.instances.at(-1);ob.notify(f.nodes[2]);ob.notify(f.nodes[2]);assert.equal(n,1);assert.equal(f.nodes[2].dataset.previewType,undefined);
});
test('filter changes disconnect stale observer and discard pending callbacks',()=>{
 const f=fixtures(),api=Previews.create(FakeObserver),out=[];api.render(f.root,f.lookup,d=>{out.push(d.id);return d.id});
 const stale=FakeObserver.instances.at(-1);f.nodes.forEach(n=>n.isConnected=false);
 const newNodes=[makeCard('c')];const root={querySelectorAll:()=>newNodes};api.render(root,f.lookup,d=>{out.push(d.id);return d.id});
 stale.notify(f.nodes[0]);assert.deepEqual(out,[]);assert.equal(stale.disconnected,true);
 FakeObserver.instances.at(-1).notify(newNodes[0]);assert.deepEqual(out,['c']);
});
test('old browser fallback hydrates all previews immediately without dependency',()=>{
 const f=fixtures(),api=Previews.create(null),out=[];api.render(f.root,f.lookup,d=>{out.push(d.id);return '<svg>'+d.id+'</svg>'});
 assert.deepEqual(out,['a','b','c']);assert.equal(f.nodes.every(n=>n.dataset.previewType===undefined),true);
});
test('unknown catalog ID does not crash render or fabricate artwork',()=>{
 const f=fixtures(),api=Previews.create(null);delete f.lookup.b;
 api.render(f.root,f.lookup,d=>d.id);
 assert.equal(f.nodes[1].innerHTML,'');assert.equal(f.nodes[1].dataset.previewType,'b');
});
test('explicit disconnect leaves current cards, and pending callbacks cannot mutate scene',()=>{
 const f=fixtures(),api=Previews.create(FakeObserver);let n=0;api.render(f.root,f.lookup,()=>{n++;return 'image'});
 const ob=FakeObserver.instances.at(-1);api.disconnect();ob.notify(f.nodes[0]);assert.equal(n,0);assert.equal(ob.disconnected,true);
});
test('observer root is only the scrollable component library',()=>{
 const f=fixtures(),api=Previews.create(FakeObserver);api.render(f.root,f.lookup,()=>'<svg/>');
 assert.equal(FakeObserver.instances.at(-1).options.root,f.root);
 assert.equal(FakeObserver.instances.at(-1).options.rootMargin,'160px 0px');
});
test('native app creates all cards with stable drag and accessibility attributes',()=>{
 const s=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(s,/class="component-card" draggable="true" data-type="\$\{x\.id\}"/);
 assert.match(s,/aria-label="\$\{esc\(x\.name\)\} ekle"/);
 assert.match(s,/data-preview-type="\$\{esc\(x\.id\)\}"/);
 assert.match(s,/libraryPreviews\.render\(els\.library,byId,previewSvg\)/);
 assert.match(s,/els\.library\.innerHTML=savedSection\+normalSections/);
});
test('offline index loads optional preview helper before app, no network is introduced',()=>{
 const s=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 const a=s.indexOf('library-preview-lazy.js?rev=20261029-startup-lazy1'),b=s.indexOf('app.js?rev=');
 assert.ok(a>=0&&b>a);assert.doesNotMatch(fs.readFileSync(path.join(__dirname,'../dist/library-preview-lazy.js'),'utf8'),/fetch\(|XMLHttpRequest|import\(/);
});
