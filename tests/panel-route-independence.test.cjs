const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),P=require('../dist/panel.js'),W=require('../dist/panel-wiring.js'),S=require('../dist/symbols.js'),C=require('../dist/catalog.js'),D=require('../dist/design-library.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const byId=Object.fromEntries(C.prepare(S.prepareLibrary(D.extend(ctx.window.COMPONENT_LIBRARY))).map(d=>[d.id,d]));
const paths=(p,view='plate',selected=new Set())=>{const s=P.render(p,byId,P.fit(p,1100,900,view),selected),result={};for(const g of s.matchAll(/<g data-panel-wire="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)){const d=g[2].match(/<path[^>]* d="([^"]+)"/)?.[1];(result[g[1]]||=[]).push(d)}return result};
function crowded(){const p=P.defaults();p.ducts.push({id:'duct',x:390,y:150,width:30,length:460,vertical:true});for(let i=0;i<24;i++){for(const [prefix,y] of [['top',70],['bottom',660]])p.items.push({id:prefix+i,typeId:'terminal-2-array-3',ref:prefix+i,x:50+i*12,y,w:8,h:50,depth:35,mount:'plate'});p.wires.push({id:'wire'+i,from:{c:'top'+i,p:'1'},to:{c:'bottom'+i,p:'1'},color:'#e53935',role:'CONTROL',size:'1,5 mm²',points:[{x:400,y:160,surface:'plate'},{x:400,y:620,surface:'plate'}]})}return P.normalize(p,byId)}
test('24 panel cables share a duct; editing, selecting, reordering and deleting one never reroutes the others',()=>{
 const p=crowded(),before=paths(p);assert.equal(Object.keys(before).length,24);for(const w of p.wires){const flat=W.routes(p,byId,w)[0].flat;assert.ok(flat.some((q,i)=>i&&q.x===400&&flat[i-1].x===400&&Math.abs(q.y-flat[i-1].y)>=400),w.id)}
 p.wires[0].points=[{x:410,y:170,surface:'plate'},{x:410,y:610,surface:'plate'}];const edited=paths(p);assert.notDeepEqual(edited.wire0,before.wire0);for(let i=1;i<24;i++)assert.deepEqual(edited['wire'+i],before['wire'+i]);
 assert.deepEqual(paths(p,'plate',new Set(['wire10'])),edited);p.wires.reverse();assert.deepEqual(paths(p),edited);p.wires=p.wires.filter(w=>w.id!=='wire0');const removed=paths(p);for(let i=1;i<24;i++)assert.deepEqual(removed['wire'+i],before['wire'+i]);
 const reload=P.normalize(JSON.parse(JSON.stringify(p)),byId);assert.deepEqual(paths(reload),removed);
});
test('door wire hinge routes do not change when another cable is removed or reordered',()=>{
 const p=P.normalize(JSON.parse(fs.readFileSync(require.resolve('../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'))).panel,byId),r=(ref,pin)=>({c:p.items.find(i=>i.ref===ref).id,p:pin});
 for(const [i,name] of ['S1','S0','H1'].entries()){const to=r(name,name==='S1'?'14':name==='S0'?'22':'X1'),res=W.connect(p,byId,r('K2','A1'),to,'#808080',1.5);assert.equal(res.ok,true,res.reason)}
 const before=paths(p,'3d');const removed=p.wires.shift().id;p.wires.reverse();const after=paths(p,'3d');for(const id of Object.keys(before).filter(id=>id!==removed))assert.deepEqual(after[id],before[id]);
});
