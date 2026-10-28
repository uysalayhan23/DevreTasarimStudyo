'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const D=require('../dist/ladder-diagram.js'),E=require('../dist/ladder-editor.js');
test('specific SVG contacts allow insertion before their own index',()=>{
 const r={id:'R',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'I3'}]],coil:{type:'OUT',ref:'Q1'}};
 const h=D.render(r,{index:3});
 assert.ok(h.includes('data-ladder-contact="3:0:1" data-drop-kind="contact" data-r="3" data-p="0" data-i="1"'));
 assert.ok(h.includes('data-ladder-contact="3:1:0" data-drop-kind="contact" data-r="3" data-p="1" data-i="0"'));
 assert.ok(h.includes('data-ladder-coil="3" data-drop-kind="coil" data-r="3"'));
});
test('palette selections route before previous operand click',()=>{
 const s=fs.readFileSync(path.join(__dirname,'../dist/ladder-editor.js'),'utf8');
 assert.ok(s.indexOf("if(activateDiagramTarget(e.target))return")>s.indexOf("const zone=e.target.closest?.('[data-drop-kind]')"));
 assert.equal(typeof E.init,'function');
});
