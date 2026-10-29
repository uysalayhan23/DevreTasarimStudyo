'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const app=fs.readFileSync(path.join(__dirname,'..','dist','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
const binding=app.split(/\r?\n/).find(line=>line.includes("component-card').forEach(card=>card.addEventListener('keydown'"));

function setup(mode='electrical'){
  assert.ok(binding,'keyboard listener must exist');
  const added=[],panel=[];
  const cards=Array.from({length:3},(_,i)=>({
    dataset:{type:'part'+i},
    addEventListener(event,listener){this[event]=listener;}
  }));
  vm.runInNewContext(binding,{
    $(){throw new Error('single element selector is not iterable');},
    $$(selector){assert.equal(selector,'.component-card');return cards;},
    project:{workspaceMode:mode},
    window:{DTSPanelEditor:{add:type=>panel.push(type)}},
    els:{viewport:{getBoundingClientRect:()=>({left:10,top:20,width:400,height:200})}},
    canvasPoint:({clientX,clientY})=>({x:clientX,y:clientY}),
    addComponent:(...args)=>added.push(args)
  },{timeout:1000});
  return {cards,added,panel};
}
function event(key='Enter',favorite=false){
  return {key,target:{closest:()=>favorite?{}:null},preventDefault(){this.prevented=true;}};
}

test('P8-01 keyboard binding is registered on every library card, not one DOM element',()=>{
  const {cards}=setup();
  assert.equal(cards.filter(c=>typeof c.keydown==='function').length,3);
});
test('Enter on the last library card inserts its own component at viewport center',()=>{
  const {cards,added}=setup();
  const e=event();cards[2].keydown(e);
  assert.deepEqual(added,[['part2',210,120,'']]);assert.equal(e.prevented,true);
});
test('Enter on the first card still inserts the first component',()=>{
  const {cards,added}=setup();
  cards[0].keydown(event());assert.equal(added[0][0],'part0');
});
test('Space or other non-Enter keys do not insert components',()=>{
  const {cards,added}=setup();
  cards[1].keydown(event('Space'));cards[1].keydown(event('Escape'));
  assert.equal(added.length,0);
});
test('Enter on nested favorite control never inserts a component',()=>{
  const {cards,added}=setup();
  cards[1].keydown(event('Enter',true));assert.equal(added.length,0);
});
test('Panel workspace Enter uses panel editor instead of schematic insertion',()=>{
  const {cards,added,panel}=setup('panel');
  cards[2].keydown(event());assert.deepEqual(panel,['part2']);assert.equal(added.length,0);
});
test('catalog ready flag is set after keyboard listeners and offline app revision changed',()=>{
  const i=app.indexOf("$$('.component-card').forEach(card=>card.addEventListener('keydown'");
  const ready=app.indexOf("els.library.dataset.catalogReady='1';",i);
  assert.ok(i>=0&&ready>i);assert.ok(html.includes('app.js?rev=20261029-all-cards-keyboard1'));
});
