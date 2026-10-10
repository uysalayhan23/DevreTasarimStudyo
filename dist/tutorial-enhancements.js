(function(root){
'use strict';
const MODE=root.DTSTutorialMode,LESSONS=root.DTSTutorialLessons;
if(!MODE||!LESSONS||root.DTSTutorialEnhancements)return;
const KEY='dts-tutorial-progress-v119',LAYOUT_KEY='dts-tutorial-coach-layout-v119',lastOrders=new Map();
let coachVisible=true,drag=null,layoutReady=false,resizeObserver=null,raf=0;

const coach=()=>root.document?.querySelector('#tutorialCoach');
const project=()=>root.DTSEditor?.getProject?.();
const lesson=()=>project()?.tutorialLesson?.id?LESSONS.byId[project().tutorialLesson.id]:null;
const session=()=>project()?.tutorialLesson||null;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function shuffled(l){
 const n=l?.quiz?.options?.length||0,a=Array.from({length:n},(_,i)=>i);
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 const prev=lastOrders.get(l.id);
 if(n>1&&prev&&prev.length===n&&a.every((v,i)=>v===prev[i]))a.push(a.shift());
 lastOrders.set(l.id,a.slice());return a;
}
function ensureOrder(){
 const l=lesson(),s=session();if(!l?.quiz||!s)return [];
 if(!Array.isArray(s.quizOrder)||s.quizOrder.length!==l.quiz.options.length)s.quizOrder=shuffled(l);
 return s.quizOrder;
}
function saveProgress(id){
 let p={};try{p=JSON.parse(root.localStorage?.getItem(KEY)||'{}')||{}}catch{}
 p[id]={completed:true,at:new Date().toISOString()};try{root.localStorage?.setItem(KEY,JSON.stringify(p))}catch{}
 MODE.renderDashboard?.();
}
function quizState(l,s){const order=ensureOrder(),selected=Number.isInteger(s.quizSelection)?s.quizSelection:'x';return order.join('-')+'|'+selected+'|'+(s.quizAnswered?1:0)+'|'+(s.quizCorrect?1:0)+'|'+l.quiz.answer}
function quizMarkup(l,s){
 const order=ensureOrder(),answered=!!s.quizAnswered,selected=Number.isInteger(s.quizSelection)?s.quizSelection:null,correct=l.quiz.answer,state=quizState(l,s);
 const buttons=order.map(idx=>{
  const isCorrect=idx===correct,isWrong=answered&&idx===selected&&!isCorrect,showCorrect=answered&&isCorrect,cls=isWrong?' wrong':showCorrect?' correct':'',mark=isWrong?'✕':showCorrect?'✓':'';
  return '<button type="button" class="tutorial-quiz-option'+cls+'" data-tutorial-quiz="'+idx+'"'+(s.quizCorrect?' disabled':'')+'><span class="tutorial-quiz-dash">−</span><span class="tutorial-quiz-text">'+escapeHtml(l.quiz.options[idx])+'</span><span class="tutorial-quiz-mark" aria-hidden="true">'+mark+'</span></button>';
 }).join('');
 const answer=answered&&!s.quizCorrect?'<div class="tutorial-correct-answer"><strong>Doğru cevap:</strong> − '+escapeHtml(l.quiz.options[correct])+'</div>':'';
 return '<section class="tutorial-current-step tutorial-quiz" data-enhanced-quiz data-quiz-state="'+state+'"><small>KONU KONTROLÜ</small><h4>'+escapeHtml(l.quiz.question)+'</h4><div class="tutorial-quiz-options">'+buttons+'</div>'+answer+'</section>';
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function decorateQuiz(){
 const c=coach(),l=lesson(),s=session();if(!c||!l?.quiz||!s)return;
 ensureOrder();
 let block=c.querySelector('.tutorial-quiz');
 if(!block&&s.phase==='complete'){const done=c.querySelector('.tutorial-complete');if(done){done.insertAdjacentHTML('beforebegin',quizMarkup(l,s));block=c.querySelector('.tutorial-quiz')}}
 if(!block)return;
 const state=quizState(l,s);if(block.getAttribute('data-quiz-state')===state)return;
 const fresh=quizMarkup(l,s),wrap=root.document.createElement('div');wrap.innerHTML=fresh;block.replaceWith(wrap.firstElementChild);
}
function sideControl(){
 const box=root.document?.querySelector('#tutorialCoachPanelControl'),btn=root.document?.querySelector('#tutorialCoachReopen'),active=!!lesson();
 if(box&&box.hidden===active)box.hidden=!active;
 if(btn){btn.setAttribute('aria-expanded',String(active&&coachVisible));btn.textContent=coachVisible?'▣ Konu anlatımını gizle':'▣ Konu anlatımını aç'}
}
function defaultLayout(){
 const vw=Math.max(320,root.innerWidth||1200),vh=Math.max(320,root.innerHeight||800),width=Math.min(430,Math.max(300,vw-40)),height=Math.min(620,Math.max(260,vh-180));
 return {left:Math.max(12,vw-width-24),top:86,width,height};
}
function readLayout(){try{const v=JSON.parse(root.localStorage?.getItem(LAYOUT_KEY)||'null');if(v&&['left','top','width','height'].every(k=>Number.isFinite(v[k])))return v}catch{}return defaultLayout()}
function applyLayout(v=readLayout()){
 const c=coach();if(!c)return;const vw=Math.max(320,root.innerWidth||1200),vh=Math.max(320,root.innerHeight||800),w=clamp(Number(v.width)||430,300,Math.max(300,vw-16)),h=clamp(Number(v.height)||520,220,Math.max(220,vh-16)),left=clamp(Number(v.left)||8,8,Math.max(8,vw-w-8)),top=clamp(Number(v.top)||8,8,Math.max(8,vh-h-8));
 c.style.width=w+'px';c.style.height=h+'px';c.style.left=left+'px';c.style.top=top+'px';c.style.right='auto';c.style.bottom='auto';layoutReady=true;
}
function saveLayout(){const c=coach();if(!c||c.hidden||c.classList.contains('is-minimized'))return;const r=c.getBoundingClientRect();try{root.localStorage?.setItem(LAYOUT_KEY,JSON.stringify({left:r.left,top:r.top,width:r.width,height:r.height}))}catch{}}
function ensureFloatBar(){
 const c=coach();if(!c||!lesson())return;
 let bar=c.querySelector('[data-tutorial-float-bar]')||c.querySelector('.tutorial-float-bar');
 if(!bar){
  c.insertAdjacentHTML('afterbegin','<div class="tutorial-float-bar" data-tutorial-float-bar role="toolbar" aria-label="Konu anlatımı pencere araçları"><strong>▣ Konu Anlatımı</strong><span>Sürükle · sağ alt köşeden boyutlandır</span><div class="tutorial-float-actions"><button type="button" data-tutorial-coach-minimize title="Küçült / büyüt" aria-label="Konu anlatımını küçült veya büyüt">−</button><button type="button" data-tutorial-coach-close title="Kapat" aria-label="Konu anlatım penceresini kapat">×</button></div></div>');
  return;
 }
 bar.setAttribute('data-tutorial-float-bar','1');
 let actions=bar.querySelector('.tutorial-float-actions');
 const close=bar.querySelector('[data-tutorial-coach-close]');
 if(!actions){actions=root.document.createElement('div');actions.className='tutorial-float-actions';if(close){close.before(actions);actions.appendChild(close)}else bar.appendChild(actions)}
 if(!bar.querySelector('[data-tutorial-coach-minimize]')){
  const b=root.document.createElement('button');b.type='button';b.setAttribute('data-tutorial-coach-minimize','');b.title='Küçült / büyüt';b.setAttribute('aria-label','Konu anlatımını küçült veya büyüt');b.textContent=c.classList.contains('is-minimized')?'□':'−';actions.prepend(b);
 }
}
function enforce(){
 const c=coach();if(!c)return;sideControl();
 if(lesson()){ensureFloatBar();decorateQuiz();if(!layoutReady)applyLayout();if(c.hidden===coachVisible)c.hidden=!coachVisible}else if(!c.hidden)c.hidden=true;
}
function setVisible(v){coachVisible=!!v;const c=coach();if(c&&lesson()&&c.hidden===coachVisible)c.hidden=!coachVisible;sideControl();if(coachVisible){ensureFloatBar();if(!layoutReady)applyLayout()}}
function refreshArrow(){
 const line=root.document?.querySelector('#tutorialLinkArrow'),ports=[...root.document?.querySelectorAll('.tutorial-next-port .port')||[]];
 if(!(line&&ports.length>=2))return;
 const a=ports[0].getBoundingClientRect(),b=ports[1].getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2,bx=b.left+b.width/2,by=b.top+b.height/2,len=Math.hypot(bx-ax,by-ay),angle=Math.atan2(by-ay,bx-ax)*180/Math.PI;line.style.left=ax+'px';line.style.top=ay+'px';line.style.width=Math.max(20,len)+'px';line.style.transform='rotate('+angle+'deg)';
}
function scheduleArrow(){if(raf)return;raf=(root.requestAnimationFrame||((fn)=>setTimeout(fn,16)))(()=>{raf=0;refreshArrow()})}
function bind(){
 const c=coach();if(!c)return;applyLayout();ensureFloatBar();sideControl();
 let arrowObserver=null;if(root.MutationObserver){arrowObserver=new root.MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.id==='tutorialLinkArrow'||n?.querySelector?.('#tutorialLinkArrow'))scheduleArrow()});arrowObserver.observe(root.document.body,{childList:true,subtree:false})}
 root.document.addEventListener('click',e=>{
  const close=e.target.closest?.('[data-tutorial-coach-close]');if(close){e.preventDefault();setVisible(false);return}
  const toggle=e.target.closest?.('[data-tutorial-coach-toggle]');if(toggle){e.preventDefault();setVisible(!coachVisible);return}
 },true);
 root.document.addEventListener('click',e=>{
  const btn=e.target.closest?.('[data-tutorial-quiz]');if(!btn)return;const l=lesson(),s=session();if(!l?.quiz||!s)return;
  e.preventDefault();e.stopImmediatePropagation();const pick=Number(btn.dataset.tutorialQuiz);s.quizSelection=pick;s.quizAnswered=true;s.quizCorrect=pick===l.quiz.answer;
  if(s.quizCorrect){s.phase='complete';s.lastFeedback='✓ Doğru cevap.';saveProgress(l.id)}else{s.phase='quiz';s.lastFeedback='✕ Yanlış cevap. Doğru seçenek yeşil tik ile gösterildi.'}
  MODE.sync?.(project());queueMicrotask(enforce);
 },true);
 root.document.addEventListener('pointerdown',e=>{
  const bar=e.target.closest?.('[data-tutorial-float-bar]');if(!bar||e.target.closest('button')||e.button!==0)return;const r=c.getBoundingClientRect();drag={dx:e.clientX-r.left,dy:e.clientY-r.top};c.classList.add('is-dragging');e.preventDefault();e.stopPropagation();
 },true);
 root.document.addEventListener('pointermove',e=>{if(drag){const r=c.getBoundingClientRect(),vw=root.innerWidth||1200,vh=root.innerHeight||800;c.style.left=clamp(e.clientX-drag.dx,8,Math.max(8,vw-r.width-8))+'px';c.style.top=clamp(e.clientY-drag.dy,8,Math.max(8,vh-r.height-8))+'px'}scheduleArrow()},true);
 root.document.addEventListener('pointerup',()=>{if(drag){drag=null;c.classList.remove('is-dragging');saveLayout()}scheduleArrow()},true);
 if(root.ResizeObserver){resizeObserver=new root.ResizeObserver(()=>{if(!drag)saveLayout();scheduleArrow()});resizeObserver.observe(c)}
 root.addEventListener('resize',()=>{if(layoutReady){const r=c.getBoundingClientRect();applyLayout({left:r.left,top:r.top,width:r.width,height:r.height})}scheduleArrow()});root.addEventListener('scroll',scheduleArrow,true);root.document.addEventListener('wheel',scheduleArrow,{capture:true,passive:true});
 enforce();
}
root.DTSTutorialEnhancements={setVisible,enforce,decorateQuiz,applyLayout,refreshArrow,scheduleArrow,get idleSafe(){return !lesson()&&!raf&&!drag}};
if(root.document?.readyState==='loading')root.document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})(typeof window==='undefined'?globalThis:window);
