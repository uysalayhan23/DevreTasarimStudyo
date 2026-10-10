const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Projects=require('../dist/project-store.js');
const {createApp}=require('./helpers/offline-dom.cjs');
test('simulation stays running while editable circuit topology is changed',()=>{
 const p=Projects.editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/01_Kumanda_Muhurleme.odsdevre'))));
 const a=createApp({project:p,appearance:'material',settings:{'dts-opening-warning':'off'}}),E=a.window.DTSEditor;
 a.$('#simulateBtn').click();assert.equal(E.running,true);
 const before=E.getProject().components.length;a.drop('lamp-green',760,520);assert.equal(E.running,true);assert.equal(E.getProject().components.length,before+1);
 const added=E.getProject().components.at(-1),body=a.$('#scene [data-id="'+added.id+'"] .body')||a.$('#scene [data-id="'+added.id+'"]');
 body.emit('pointerdown',{pointerId:9,clientX:760,clientY:520});a.window.emit('pointerup',{pointerId:9,buttons:0,clientX:760,clientY:520});
 a.document.emit('keydown',{key:'Delete'});assert.equal(E.running,true);assert.equal(E.getProject().components.some(c=>c.id===added.id),false);
});
test('live terminal touch warns without opening a blocking safety modal',()=>{
 const p=Projects.editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/01_Kumanda_Muhurleme.odsdevre'))));
 const a=createApp({project:p,appearance:'material',settings:{'dts-opening-warning':'off'}}),E=a.window.DTSEditor;
 a.$('#simulateBtn').click();const port=a.$('#scene [data-id="source"] [data-port="L"]');port.emit('pointerdown',{pointerId:2,clientX:400,clientY:220});
 assert.equal(E.running,true);assert.equal(a.$('#safetyModal').hidden,true);assert.match(a.$('#statusText').textContent,/canlı uygulanıyor/i);a.document.emit('keydown',{key:'Escape'});
});
