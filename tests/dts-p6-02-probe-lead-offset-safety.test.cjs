'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Leads=require('../dist/probe-leads.js');
const a={pos:{x:12.375,y:85.125},side:'bottom'};
const b={pos:{x:456.25,y:220.5},side:'left'};
const base=()=>Leads.curve(a,b);
const valid=curve=>{
 assert.ok(Number.isFinite(curve.bend.x)&&Number.isFinite(curve.bend.y));
 assert.doesNotMatch(curve.path,/NaN|Infinity|e\+308/);
 assert.match(curve.path,/^M12\.375 85\.125 C/);
 assert.ok(curve.path.endsWith('456.25 220.5'));
};
test('P6-02: normal probe curve retains exact endpoints',()=>valid(base()));
test('P6-02: fractional probe bend remains unchanged',()=>{
 const c=Leads.curve(a,b,{x:27.25,y:-63.75});
 valid(c);assert.equal(c.bend.x,base().bend.x+27.25);
 assert.equal(c.bend.y,base().bend.y-63.75);
});
test('P6-02: infinite X offset fails closed to default',()=>assert.deepEqual(Leads.curve(a,b,{x:Infinity,y:0}),base()));
test('P6-02: infinite Y offset fails closed to default',()=>assert.deepEqual(Leads.curve(a,b,{x:0,y:-Infinity}),base()));
test('P6-02: NaN offsets fail closed',()=>assert.deepEqual(Leads.curve(a,b,{x:NaN,y:NaN}),base()));
test('P6-02: null legacy offset fails closed',()=>assert.deepEqual(Leads.curve(a,b,null),base()));
test('P6-02: string legacy offset is not coerced into a route',()=>assert.deepEqual(Leads.curve(a,b,{x:'250',y:'bad'}),base()));
test('P6-02: extreme positive and negative bends are bounded',()=>{
 const c=Leads.curve(a,b,{x:1e308,y:-1e308});
 valid(c);assert.equal(c.bend.x,base().bend.x+10000);
 assert.equal(c.bend.y,base().bend.y-10000);
});
test('P6-02: ordinary negative bend remains user-controlled',()=>{
 const c=Leads.curve(a,b,{x:-24.5,y:43.75});
 valid(c);assert.equal(c.bend.x,base().bend.x-24.5);
 assert.equal(c.bend.y,base().bend.y+43.75);
});
