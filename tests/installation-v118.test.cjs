const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Symbols=require('../dist/symbols.js'),Design=require('../dist/design-library.js'),C=require('../dist/components.js'),Sim=require('../dist/simulation.js'),Norms=require('../dist/norms.js'),W=require('../dist/workspaces.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),context);
const library=Symbols.prepareLibrary(Design.extend(context.window.COMPONENT_LIBRARY)),by=Object.fromEntries(library.map(d=>[d.id,d]));
const bellIds=['bell-electronic','bell-push','bell-light-push','bell-push-group','door-release'];
test('book p142 devices use open diagrams in all selectable norms and have material artwork and distinct pins',()=>{
 for(const id of bellIds){const d=by[id];assert.ok(d);assert.equal(W.includes(d,'building'),true);assert.equal(W.includes(d,'control'),false);assert.equal(new Set(d.pins.map(p=>p.id)).size,d.pins.length);
  for(const norm of ['TSE','IEC','ANSI'])for(const mode of ['iec','material']){const s=Symbols.markup(d,{id:'c',ref:'B1'},{mode,norm});assert.ok(!/NaN|undefined/.test(s));assert.match(s,mode==='iec'?/data-diagram="open"/:/installation-material/);for(const p of d.pins)assert.ok(s.includes('data-port="'+p.id+'"'));}
 }
 assert.equal(by['plug-1p'].pins.length,2);assert.ok(by['plug-1p-earthed'].pins.some(p=>p.id==='PE'));
 for(const [id,label] of [['socket-data','RJ45'],['phone-socket','RJ11'],['tv-socket','SAT'],['lampholder-e27','E27']])assert.match(Symbols.markup(by[id],{id},{mode:'material'}),new RegExp(label));
});
test('commutator operates two independent contacts; intermediate switch crosses without joining the two paths',()=>{
 for(const a of [false,true])for(const b of [false,true]){
  const c={switchStates:{a,b}},d=by['wall-commutator'];assert.deepEqual(C.contactStates(c,d,false),{a,b});
 }
 assert.deepEqual(C.contactStates({state:true},by['wall-commutator'],true),{a:true,b:true});
 for(const value of [false,true]){const d=by['wall-intermediate'],states=C.contactStates({state:value},d,value);assert.deepEqual(states,{a:!value,b:!value,c:value,d:value});const contacts=d.contacts.filter(g=>states[g.id]);assert.equal(contacts.length,2);assert.equal(new Set(contacts.flatMap(g=>[g.a,g.b])).size,4);}
});
function circuit(){const components=[['s','supply-dc-plus'],['b','bell-push-group'],['z','bell-electronic'],['k','door-release']].map(([id,typeId],i)=>({id,typeId,x:100+i*180,y:220,ref:id}));const wires=[['s','P','b','13'],['s','P','b','23'],['b','14','z','1'],['b','24','k','A1'],['z','2','s','M'],['k','A2','s','M']].map(([a,b,c,d],i)=>({id:'w'+i,from:{c:a,p:b},to:{c,p:d}}));return {projectId:'bells-test',name:'Zil deneyi',workspaceMode:'building',components,wires,junctions:[]};}
test('separate bell buttons energize the bell and door release independently with no false common connection',()=>{
 const p=circuit(),b=p.components[1];for(const a of [false,true])for(const value of [false,true]){b.switchStates={a,b:value};const result=Sim.solve(p,by);assert.equal(result.shortCircuit,false);assert.equal(p.components[2]._active,a);assert.equal(p.components[3]._active,value);}
});
test('real UI operates each gang with pointer and keyboard and releases momentary contacts',()=>{
 const {createApp}=require('./helpers/offline-dom.cjs'),a=createApp({project:circuit(),appearance:'material'}),E=a.window.DTSEditor;const key=k=>a.$('#scene [data-id="b"] [data-installation-contact="'+k+'"]');a.$('#simulateBtn').click();
 key('a').emit('pointerdown',{pointerId:41});assert.equal(E.getProject().components[2]._active,true);assert.equal(E.getProject().components[3]._active,false);a.window.emit('pointerup',{pointerId:41,buttons:0});assert.equal(E.getProject().components[2]._active,false);
 key('b').emit('keydown',{key:'Enter'});assert.equal(E.getProject().components[3]._active,true);assert.equal(E.getProject().components[2]._active,false);a.window.emit('keyup',{key:'Enter'});assert.equal(E.getProject().components[3]._active,false);assert.equal(a.$('#safetyModal').hidden,true);assert.equal(E.running,true);
 E.stop();E.setAppearance('iec');a.$('#simulateBtn').click();key('a').emit('pointerdown',{pointerId:42});assert.equal(E.getProject().components[2]._active,true);a.window.emit('blur');assert.equal(E.getProject().components[2]._active,false);
});
