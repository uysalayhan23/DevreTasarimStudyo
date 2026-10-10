/* Devre Tasarım Stüdyosu — contextual micro explanations, all tutorial lessons. */
(function(root){
'use strict';
const doc=root.document;
const state={lesson:'',project:null,dismissed:false,hovered:'',bound:false};
const esc=value=>String(value??'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const fold=value=>String(value??'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
const isRed=c=>/test-probe-red/i.test(c?.typeId||'')||/(?:^|-)red$/i.test(c?.id||'');
const isBlack=c=>/test-probe-black/i.test(c?.typeId||'')||/(?:^|-)black$/i.test(c?.id||'');
function callouts(){
 return Array.from(doc?.querySelectorAll?.('#tutorialReferenceStage .tutorial-ref-callout')||[],node=>({
  title:node.querySelector('strong')?.textContent?.trim()||'',
  detail:node.querySelector('span')?.textContent?.trim()||'',
  note:node.querySelector('small')?.textContent?.trim()||''
 }));
}
function matchScore(c,record){
 const t=fold(record.title),id=fold(c.id),label=fold(c.label),type=fold(c.typeId);
 if(isRed(c))return /kirmizi/.test(t)?100:-1;
 if(isBlack(c))return /siyah/.test(t)?100:-1;
 if(/prob/.test(t))return -1;
 if(/\b(r1|r2|r3|bt1|bt2|g1|v1|a1|a2|ct1|ea1|fg1|z1)\b/.test(t+' '+fold(record.note))){
  const ids=(t+' '+fold(record.note)).match(/\b(r1|r2|r3|bt1|bt2|g1|v1|a1|a2|ct1|ea1|fg1|z1)\b/g)||[];
  if(ids.some(key=>id===key||label===key||label.startsWith(key+' ')))return 90;
 }
 if(/multimetre|voltmetre|ampermetre|uni-t|olcum aleti/.test(t)&&/unit-ut|multimeter|meter-/.test(type)){
  if(/voltmetre/.test(t)&&!/v|volt/.test(id+label))return 5;
  if(/ampermetre/.test(t)&&!/a|akim/.test(id+label))return 5;
  return 65;
 }
 if(/kaynak|pil|batar|aku|jenerator/.test(t)&&/supply|source|battery|generator/.test(type))return 40;
 if(/direnc|yuk|rezist/.test(t)&&/resistor|resistance|load/.test(type))return 35;
 if(/pens/.test(t)&&/clamp/.test(type))return 50;
 if(/analizor/.test(t)&&/analy/.test(type))return 50;
 if(/sensor/.test(t)&&/sensor/.test(type))return 30;
 if(label&&label.length>=3&&t.includes(label))return 22;
 return -1;
}
function description(c,defs={},rows=callouts()){
 const d=defs[c.typeId]||{};
 let best=null,score=0;
 for(const row of rows){const value=matchScore(c,row);if(value>score){best=row;score=value}}
 if(best)return {title:best.title,detail:best.detail,note:best.note};
 let title=String(c.label||d.name||c.typeId||'Malzeme');
 if(/test-probe-red/.test(c.typeId||''))title='Kırmızı prob';
 if(/test-probe-black/.test(c.typeId||''))title='Siyah prob';
 const detail=String(c.tutorialPurpose||c.tutorialHint||d.tutorialPurpose||d.description||d.name||'Malzemenin devredeki görevini inceleyin.');
 const note=String(c.probeTarget?.p||c.meterRange||c.id||'');
 return {title,detail,note};
}
function getPart(target){
 const group=target?.closest?.('g.component, g.component-backdrop');
 const id=group?.dataset?.id||group?.getAttribute?.('data-id');
 if(!id)return null;
 const project=root.DTSEditor?.getProject?.();
 return (project?.components||[]).find(c=>c.id===id)||null;
}
function ensure(viewport,id,className){
 let el=doc.querySelector('#'+id);
 if(!el){el=doc.createElement('div');el.id=id;el.className=className;viewport.appendChild(el)}
 return el;
}
function hide(){state.hovered='';const tip=doc?.querySelector?.('#tutorialMicroTooltip');if(tip){tip.hidden=true;tip.textContent=''}}
function dismiss(){if(!state.lesson)return;state.dismissed=true;doc?.body?.classList?.add('tutorial-micro-dismissed');const intro=doc?.querySelector?.('#tutorialMicroIntro');if(intro)intro.hidden=true;hide()}
function tipPosition(tip,e){
 const viewport=doc?.querySelector?.('#viewport');if(!viewport||!tip)return;
 const box=viewport.getBoundingClientRect();const maxX=Math.max(4,box.width-250),maxY=Math.max(4,box.height-115);
 let x=Math.min(Math.max(4,(e.clientX??box.left+20)-box.left+18),maxX),y=Math.min(Math.max(4,(e.clientY??box.top+20)-box.top+16),maxY);
 tip.style.left=x+'px';tip.style.top=y+'px';
}
function show(part,e){
 if(!state.dismissed||!state.lesson||!part)return;
 const viewport=doc.querySelector('#viewport');if(!viewport)return;
 const record=description(part,root.DTSEditor?.byId||{});
 const tip=ensure(viewport,'tutorialMicroTooltip','tutorial-micro-tooltip');
 tip.innerHTML='<strong>'+esc(record.title)+'</strong><span>'+esc(record.detail)+'</span>'+(record.note?'<small>'+esc(record.note)+'</small>':'');
 tip.hidden=false;state.hovered=part.id;tipPosition(tip,e);
}
function sync(lesson,project=root.DTSEditor?.getProject?.()){
 const viewport=doc?.querySelector?.('#viewport');
 if(!lesson||!project||!viewport){clear();return}
 const changed=state.lesson!==lesson.id||state.project!==project;
 if(changed){hide();state.lesson=lesson.id;state.project=project;state.dismissed=false;doc.body?.classList?.remove('tutorial-micro-dismissed')}
 // Rich reference lessons already show five numbered, non-interactive cards.
 // Other lessons receive a compact introduction derived from their real components.
 const rich=!!doc.querySelector('#tutorialReferenceStage');
 const intro=doc.querySelector('#tutorialMicroIntro');
 if(rich){intro?.remove();return}
 const parts=(project.components||[]).filter(c=>c&&c.typeId).slice(0,4);
 if(!parts.length){intro?.remove();return}
 const target=ensure(viewport,'tutorialMicroIntro','tutorial-micro-intro');
 target.innerHTML=parts.map((part,i)=>{const d=description(part,root.DTSEditor?.byId||{},[]);return '<article><b>'+String(i+1)+'</b><div><strong>'+esc(d.title)+'</strong><span>'+esc(d.detail)+'</span></div></article>'}).join('');
 target.hidden=state.dismissed;
}
function clear(){state.lesson='';state.project=null;state.dismissed=false;state.hovered='';doc?.body?.classList?.remove('tutorial-micro-dismissed');doc?.querySelector?.('#tutorialMicroIntro')?.remove();doc?.querySelector?.('#tutorialMicroTooltip')?.remove()}
function bind(){
 if(state.bound||!doc?.addEventListener)return;state.bound=true;
 doc.addEventListener('pointerdown',e=>{
  if(!state.lesson)return;
  // Any first interaction dismisses the introductory labels, never the teaching window.
  if(!state.dismissed)dismiss();
  if(getPart(e.target))hide();
 });
 doc.addEventListener('pointerover',e=>{if(!state.dismissed)return;const part=getPart(e.target);if(part)show(part,e)});
 doc.addEventListener('pointermove',e=>{const part=getPart(e.target);if(!part){if(state.hovered)hide();return}if(state.dismissed&&state.hovered!==part.id)show(part,e);else if(state.hovered){tipPosition(doc.querySelector('#tutorialMicroTooltip'),e)}});
 doc.addEventListener('pointerout',e=>{
  if(!state.hovered)return;
  const leaving=getPart(e.target),entering=getPart(e.relatedTarget);
  if(leaving&&leaving.id===state.hovered&&(!entering||entering.id!==leaving.id))hide();
 });
 doc.addEventListener('pointerup',e=>{if(getPart(e.target)&&state.hovered)hide()});
 doc.addEventListener('focusin',e=>{const part=getPart(e.target);if(part&&state.dismissed)show(part,e)});
 doc.addEventListener('focusout',e=>{if(getPart(e.target))hide()});
}
const api={sync,clear,dismiss,description,matchScore,get state(){return {...state}}};
root.DTSTutorialMicroHints=api;
if(doc?.readyState==='loading')doc.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})(typeof window==='undefined'?globalThis:window);
