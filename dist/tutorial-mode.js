(function(root){
'use strict';
const L=root.DTSTutorialLessons,KEY='dts-tutorial-progress-v119',COACH_UI_KEY='dts-tutorial-coach-ui-v11920';
if(!L)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=v=>JSON.parse(JSON.stringify(v));
let filter='all',query='',hintOpen=false,lastLesson='',curriculumPromise=null,curriculumLoaded=false,coachResizeObserver=null,coachDrag=null;
function coachUiState(){try{const v=JSON.parse(root.localStorage?.getItem(COACH_UI_KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return {}}}
function saveCoachUi(patch={}){const next={...coachUiState(),...patch};try{root.localStorage?.setItem(COACH_UI_KEY,JSON.stringify(next))}catch{}return next}
function coachDefaultBox(){const width=Math.min(460,Math.max(320,(root.innerWidth||1280)-32)),height=Math.min(640,Math.max(260,(root.innerHeight||800)-120));return {width,height,left:Math.max(8,(root.innerWidth||1280)-width-20),top:82}}
function syncCoachPanelControl(){
 const control=root.document?.querySelector('#tutorialCoachPanelControl'),btn=root.document?.querySelector('#tutorialCoachReopen'),coach=root.document?.querySelector('#tutorialCoach');
 if(!control||!btn)return;const active=!!lessonFor(root.DTSEditor?.getProject?.());control.hidden=!active;if(!active)return;
 const shown=coach&&!coach.hidden;btn.setAttribute('aria-expanded',String(shown));btn.textContent=shown?'▣ Konu anlatımını kapat':'▣ Konu anlatımını aç';
}
function applyCoachUi(coach){
 if(!coach)return;const d=coachDefaultBox(),st=coachUiState(),width=Math.max(280,Math.min(Number(st.width)||d.width,(root.innerWidth||1280)-16)),height=Math.max(120,Math.min(Number(st.height)||d.height,(root.innerHeight||800)-66));
 const left=Math.max(8,Math.min(Number.isFinite(Number(st.left))?Number(st.left):d.left,(root.innerWidth||1280)-width-8)),top=Math.max(58,Math.min(Number.isFinite(Number(st.top))?Number(st.top):d.top,(root.innerHeight||800)-(st.minimized?44:height)-8));
 coach.style.width=width+'px';coach.style.height=height+'px';coach.style.left=left+'px';coach.style.top=top+'px';coach.classList.toggle('is-minimized',!!st.minimized);coach.hidden=!!st.hidden;syncCoachPanelControl();
}
function persistCoachBox(coach){if(!coach||coach.hidden||coach.classList.contains('is-minimized'))return;const r=coach.getBoundingClientRect();saveCoachUi({left:Math.round(r.left),top:Math.round(r.top),width:Math.round(r.width),height:Math.round(r.height)})}
function setCoachVisible(show){const coach=root.document?.querySelector('#tutorialCoach');if(!coach)return;coach.hidden=!show;saveCoachUi({hidden:!show});syncCoachPanelControl();if(show){applyCoachUi(coach);coach.focus?.({preventScroll:true})}}
function toggleCoachMinimize(){const coach=root.document?.querySelector('#tutorialCoach');if(!coach)return;const minimized=!coach.classList.contains('is-minimized');coach.classList.toggle('is-minimized',minimized);saveCoachUi({minimized});const b=coach.querySelector('[data-tutorial-coach-minimize]');if(b)b.textContent=minimized?'□':'−';applyCoachUi(coach)}
function mountCoachChrome(coach,l){
 if(!coach||!l)return;let bar=coach.querySelector('.tutorial-float-bar');if(bar){bar.setAttribute('data-tutorial-float-bar','1');if(!bar.querySelector('[data-tutorial-coach-minimize]')){const close=bar.querySelector('[data-tutorial-coach-close]'),actions=bar.querySelector('.tutorial-float-actions')||(()=>{const x=root.document.createElement('div');x.className='tutorial-float-actions';if(close)close.before(x);else bar.appendChild(x);return x})();const b=root.document.createElement('button');b.type='button';b.setAttribute('data-tutorial-coach-minimize','');b.title='Küçült / büyüt';b.setAttribute('aria-label','Konu anlatımını küçült veya büyüt');b.textContent=coachUiState().minimized?'□':'−';actions.prepend(b)}applyCoachUi(coach);if(root.ResizeObserver){coachResizeObserver?.disconnect?.();coachResizeObserver=new root.ResizeObserver(()=>persistCoachBox(coach));coachResizeObserver.observe(coach)}return}bar=root.document.createElement('div');bar.className='tutorial-float-bar';bar.setAttribute('data-tutorial-float-bar','1');bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Konu anlatımı pencere araçları');
 const minimized=!!coachUiState().minimized;bar.innerHTML='<strong>Konu Anlatımı</strong><span>Sürükle · sağ alt köşeden boyutlandır</span><div class="tutorial-float-actions"><button type="button" data-tutorial-coach-minimize title="Küçült / büyüt" aria-label="Konu anlatımını küçült veya büyüt">'+(minimized?'□':'−')+'</button><button type="button" data-tutorial-coach-close title="Konu anlatımını kapat" aria-label="Konu anlatımını kapat">×</button></div>';
 coach.prepend(bar);coach.setAttribute('tabindex','-1');applyCoachUi(coach);
 if(root.ResizeObserver){coachResizeObserver?.disconnect?.();coachResizeObserver=new root.ResizeObserver(()=>persistCoachBox(coach));coachResizeObserver.observe(coach)}
}
function loadScript(src){
 return new Promise((resolve,reject)=>{
  const existing=[...root.document.querySelectorAll('script[src]')].find(x=>x.getAttribute('src')?.split('?')[0]===src.split('?')[0]);
  if(existing){if(existing.dataset.loaded==='1'||existing.readyState==='complete')return resolve();existing.addEventListener('load',()=>resolve(),{once:true});existing.addEventListener('error',()=>reject(new Error(src+' yüklenemedi')),{once:true});return}
  const el=root.document.createElement('script');el.src=src;el.async=false;el.dataset.tutorialLazy='1';el.addEventListener('load',()=>{el.dataset.loaded='1';resolve()},{once:true});el.addEventListener('error',()=>reject(new Error(src+' yüklenemedi')),{once:true});root.document.head.appendChild(el);
 });
}
async function ensureCurriculumLoaded(){
 if(curriculumLoaded)return true;if(curriculumPromise)return curriculumPromise;
 curriculumPromise=(async()=>{await loadScript('tutorial-expanded-lessons.js?v=1.19.0-source1');await loadScript('tutorial-source-outline.js?v=1.19.0-outline1');await loadScript('tutorial-pedagogy.js?v=20261015-mq07-mosfet-health-v1');await loadScript('tutorial-measurement-batch-a.js?v=1.19.20-batch-a1');await loadScript('tutorial-measurement-batch-b.js?v=1.19.20-batch-b1');await loadScript('tutorial-measurement-batch-c.js?v=1.19.20-batch-c1');await loadScript('tutorial-measurement-batch-d.js?v=1.19.20-batch-d2');await loadScript('tutorial-dc-batch-e.js?v=1.19.20-dc-batch-e1');await loadScript('tutorial-control-batch-f.js?v=1.19.20-control-batch-f1');await loadScript('tutorial-timer-batch-g.js?v=1.19.20-timer-batch-g1');await loadScript('tutorial-installation-batch-h.js?v=20261014-bell-trafo-v1');await loadScript('tutorial-next-batch-i.js?v=1.19.20-next-batch-i1');await loadScript('tutorial-sensor-batch-j.js?v=1.19.20-sensor-batch-j2');await loadScript('tutorial-motor-batch-k.js?v=1.19.20-motor-batch-k1');await loadScript('tutorial-dual-dc-batch-l.js?v=1.19.20-dual-dc-batch-l1');await loadScript('tutorial-topic-review-batch-m.js?v=20261011-topic-m1');await loadScript('tutorial-practice-guide-batch-n.js?v=20261012-practice-n1b');await loadScript('tutorial-curriculum.js?v=1.19.20-meb1');curriculumLoaded=true;return true})().catch(e=>{curriculumPromise=null;root.DTSEditor?.toast?.('Öğretici içerikleri yüklenemedi: '+(e?.message||e));throw e});
 return curriculumPromise;
}
async function openHub(){
 const page=root.document?.querySelector('#tutorialDashboard');if(!page)return;
 page.hidden=false;root.document.body.classList.add('tutorial-page-open');
 const stats=root.document?.querySelector('#tutorialStats'),grid=root.document?.querySelector('#tutorialTopicGrid');
 if(stats)stats.textContent='Dersler yükleniyor…';if(grid)grid.innerHTML='<div class="tutorial-empty">Geniş öğretici müfredatı hazırlanıyor…</div>';
 try{await ensureCurriculumLoaded();renderDashboard()}catch{if(grid)grid.innerHTML='<div class="tutorial-empty">Öğretici içerikleri yüklenemedi. Dashboarda dönüp tekrar deneyin.</div>'}
 page.scrollIntoView({block:'start'});
}
function closeHub(){const page=root.document?.querySelector('#tutorialDashboard');if(page)page.hidden=true;root.document.body.classList.remove('tutorial-page-open');}
function progress(){try{const v=JSON.parse(root.localStorage?.getItem(KEY)||'{}');return v&&typeof v==='object'?v:{}}catch{return {}}}
function saveProgress(id){const p=progress();p[id]={completed:true,at:new Date().toISOString()};try{root.localStorage?.setItem(KEY,JSON.stringify(p))}catch{}renderDashboard()}
function completedCount(){const p=progress();return L.lessons.filter(x=>p[x.id]?.completed).length}
function groupIcon(g){return g==='Tesisat'?'⌂':g==='Sensörler'?'◉':g==='Analog / Enstrümantasyon'?'∿':g==='Güç / Referans'?'⎓':'⚡'}
function renderDashboard(){
 const grid=root.document?.querySelector('#tutorialTopicGrid'),stats=root.document?.querySelector('#tutorialStats'),chips=root.document?.querySelector('#tutorialGroupFilters');if(!grid)return;
 const done=progress();if(stats)stats.textContent=completedCount()+' / '+L.count+' uygulama tamamlandı';
 const groups=['all',...new Set(L.topics.map(t=>t.group))];
 if(chips)chips.innerHTML=groups.map(g=>'<button type="button" data-tutorial-group="'+esc(g)+'" class="'+(filter===g?'active':'')+'">'+(g==='all'?'Tüm konular':esc(g))+'</button>').join('');
 const q=query.toLocaleLowerCase('tr-TR').trim(),topics=L.topics.filter(t=>{const titles=L.lessons.filter(x=>x.topicId===t.topicId).map(x=>x.title).join(' ');return (filter==='all'||t.group===filter)&&(!q||(t.topic+' '+t.summary+' '+t.concepts.join(' ')+' '+titles).toLocaleLowerCase('tr-TR').includes(q))});
 grid.innerHTML=topics.map(t=>{
   const ls=L.lessons.filter(x=>x.topicId===t.topicId),topicDone=ls.filter(x=>done[x.id]?.completed).length;
   return '<article class="tutorial-topic-card"><header><span class="tutorial-topic-icon">'+groupIcon(t.group)+'</span><div><small>'+esc(t.group)+'</small><h3>'+esc(t.topic)+'</h3></div><b>'+topicDone+'/'+ls.length+'</b></header><p>'+esc(t.summary)+'</p><div class="tutorial-concepts">'+t.concepts.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div><div class="tutorial-variants">'+ls.map(x=>'<button type="button" data-tutorial-open="'+x.id+'" class="'+(done[x.id]?.completed?'done':'')+'"><span>'+(done[x.id]?.completed?'✓':x.variant)+'</span><strong>'+esc(x.title)+'</strong><small>'+(x.pedagogyReview?.titleTopologyIssue?'Devre incelemede':esc(x.levelName.replace(/^\d+ · /,'')))+'</small></button>').join('')+'</div></article>';
 }).join('')||'<div class="tutorial-empty">Bu filtrede ders bulunamadı.</div>';
}
function isProbeLeadWire(l,w){
 const comps=l?.project?.components||[],probeIds=new Set(comps.filter(c=>/^test-probe-/.test(c.typeId)).map(c=>c.id));
 return !!w?.probeLead||probeIds.has(w?.from?.c)||probeIds.has(w?.to?.c);
}
function stepsFromWires(l){
 const wires=Array.isArray(l?.project?.wires)?l.project.wires:[];
 return wires.filter(w=>!isProbeLeadWire(l,w)).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'İşaretlenen terminalleri bağlayın.',why:w.tutorialWhy||'Bu bağlantı dersin gerçek devre yolunu tamamlar.',color:w.color,role:w.role,size:w.size}));
}
function ensureGuidedLesson(l){
 if(!l?.project)return l;
 // Runtime normalization only: do not rewrite canonical source files or topology.
 if(!l._dcSupplyWireColorsApplied&&root.CCSConductors&&root.DTSEditor?.byId){
  root.CCSConductors.synchronize(l.project,root.DTSEditor.byId);
  l._dcSupplyWireColorsApplied=true;
 }
 const wires=Array.isArray(l.project.wires)?l.project.wires:[],guided=l.kind==='wiring'||l.project?.tutorialLesson?.phase==='demo'||(Array.isArray(l.steps)&&l.steps.length>0);
 if(wires.length&&guided){
  l.kind='wiring';if(!Array.isArray(l.steps)||l.steps.length!==wires.length)l.steps=stepsFromWires(l);
  else for(const step of l.steps){const w=wires.find(w=>sameWire(step,w.from,w.to));if(w)step.color=w.color}
 }
 return l;
}
function lessonFor(project){const lessons=root.DTSTutorialLessons||L;return project?.tutorialLesson?.id?ensureGuidedLesson(lessons.byId[project.tutorialLesson.id]):null}
function sameEndpoint(a,b){return !!a&&!!b&&a.c===b.c&&a.p===b.p}
function sameWire(step,a,b){return (sameEndpoint(step.from,a)&&sameEndpoint(step.to,b))||(sameEndpoint(step.from,b)&&sameEndpoint(step.to,a))}
function locksEditing(project){return !!lessonFor(project)}
function allowsGuidedWiring(project){const l=lessonFor(project),s=project?.tutorialLesson;return !!(l&&!l.pedagogyReview?.titleTopologyIssue&&s?.phase==='rebuild'&&s.step<l.steps.length)}
function explainLock(project){
 const E=root.DTSEditor;if(!E)return;
 if(allowsGuidedWiring(project))E.toast('Öğretici Modu: yalnız sıradaki iki terminal arasındaki kabloyu bağlayın.');
 else E.toast('Öğretici Modu: devre elemanları korunuyor. “Devreyi yeniden kur” ile bağlantı çalışmasına geçin.');
}
function canStart(project,ref){
 if(!allowsGuidedWiring(project))return false;const l=lessonFor(project),s=l.steps[project.tutorialLesson.step];
 const ok=sameEndpoint(s.from,ref)||sameEndpoint(s.to,ref);if(!ok){project.tutorialLesson.lastFeedback='Önce yanıp sönen terminalden başlayın.';sync(project)}return ok;
}
function beforeWire(project,a,b){
 const l=lessonFor(project);if(!l)return null;
 if(!allowsGuidedWiring(project))return {ok:false,error:'Bu aşamada yeni kablo beklenmiyor.'};
 const s=l.steps[project.tutorialLesson.step];
 if(!sameWire(s,a,b)){project.tutorialLesson.lastFeedback='Bu iki terminal sıradaki bağlantı değil. Yanıp sönen iki terminali birbirine bağlayın.';sync(project);return {ok:false,error:project.tutorialLesson.lastFeedback}}
 return {ok:true,step:project.tutorialLesson.step};
}
function afterWire(project,wire){
 const l=lessonFor(project),session=project?.tutorialLesson;if(!l||session?.phase!=='rebuild'||l.pedagogyReview?.titleTopologyIssue)return;
 const step=l.steps[session.step];if(!step||!sameWire(step,wire.from,wire.to))return;
 for(const lessonClamp of l.project.components.filter(c=>c.typeId==='unit-ut200a'&&c.clampedWireId)){
  const target=l.project.wires.find(w=>w.id===lessonClamp.clampedWireId);if(target&&sameWire(target,wire.from,wire.to)){const live=project.components.find(c=>c.id===lessonClamp.id);if(live){live.clampedWireId=wire.id;live.clampT=lessonClamp.clampT??.5}}
 }
 session.step++;session.lastFeedback='✓ Doğru bağlantı: '+step.hint;hintOpen=false;
 if(session.step>=l.steps.length){session.phase='complete';saveProgress(l.id);session.lastFeedback='✓ Devre tamamlandı. Tüm bağlantıları doğru yaptınız.';root.DTSEditor?.toast('Tebrikler · devre eksiksiz tamamlandı!')}
 sync(project);
}
function componentLabel(project,ep){const c=project.components.find(x=>x.id===ep.c);return (c?.ref||c?.label||ep.c)+' / '+ep.p}
function clearHighlights(){
 const d=root.document;if(!d)return;d.querySelectorAll('.tutorial-next-port').forEach(n=>n.classList.remove('tutorial-next-port'));d.querySelectorAll('.tutorial-flow-wire').forEach(n=>n.classList.remove('tutorial-flow-wire'));d.querySelector('#tutorialLinkArrow')?.remove();
}
function stepArrow(a,b){
 const d=root.document;if(!d||!a||!b)return;const ar=a.querySelector('.port')?.getBoundingClientRect(),br=b.querySelector('.port')?.getBoundingClientRect();if(!ar||!br)return;
 const ax=ar.left+ar.width/2,ay=ar.top+ar.height/2,bx=br.left+br.width/2,by=br.top+br.height/2,len=Math.hypot(bx-ax,by-ay),angle=Math.atan2(by-ay,bx-ax)*180/Math.PI;
 const line=d.createElement('div');line.id='tutorialLinkArrow';line.className='tutorial-link-arrow';line.style.left=ax+'px';line.style.top=ay+'px';line.style.width=Math.max(20,len)+'px';line.style.transform='rotate('+angle+'deg)';d.body.appendChild(line);
}
function highlight(project,step){
 clearHighlights();if(!step)return;const nodes=[];for(const ep of [step.from,step.to]){
   const node=[...root.document.querySelectorAll('g.component')].find(n=>n.dataset.id===ep.c)?.querySelector('.port-group[data-port="'+CSS.escape(ep.p)+'"]');
   node?.classList.add('tutorial-next-port');nodes.push(node);
 }stepArrow(nodes[0],nodes[1]);
}
function flow(project){clearHighlights()}
function isDcUsageLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='doğru akım ve kullanım alanları')}
function isDcSourceLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='dc kaynakları ve bağlantıları')}
function isBatterySeriesLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='pillerin seri bağlanması')}
function isBatteryParallelLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='pillerin paralel bağlanması')}
function isOhmLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='ohm kanunu deneyi')}
function isSeriesAnalysisLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='seri devre analizi')}
function isParallelAnalysisLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='paralel devre analizi')}
function isMixedAnalysisLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='karışık devre analizi')}
function isKirchhoffControlLesson(l){return !!(l&&l.topicId==='dc-circuits'&&l.title?.toLocaleLowerCase('tr-TR')==='kirchhoff kanunlarıyla devre kontrolü')}
function isVoltageMeasurementLesson(l){return !!(l&&(l.title?.toLocaleLowerCase('tr-TR')==='voltmetre ile gerilim ölçümü'||l.measurementUpgrade&&l.project?.tutorialExplore?.type==='voltage-measurement-rich'))}
function isCurrentMeasurementLesson(l){return !!(l&&(l.title?.toLocaleLowerCase('tr-TR')==='ampermetre ile akım ölçümü'||l.measurementUpgrade&&l.project?.tutorialExplore?.type==='current-measurement-rich'))}
function isResistanceMeasurementLesson(l){return !!(l&&l.title?.toLocaleLowerCase('tr-TR')==='multimetre ile direnç ölçümü')}
function isClampCurrentMeasurementLesson(l){return !!(l&&(l.title?.toLocaleLowerCase('tr-TR')==='pens ampermetre ile akım ölçümü'||l.measurementUpgrade&&l.project?.tutorialExplore?.type==='clamp-current-measurement-rich'))}
function isFrequencyMeasurementLesson(l){return !!(l&&(l.title?.toLocaleLowerCase('tr-TR')==='frekansmetre ile frekans ölçümü'||l.measurementUpgrade&&l.project?.tutorialExplore?.type==='frequency-measurement-rich'))}
function isEnergyAnalyzerLesson(l){if(!l)return false;const t=l.title?.toLocaleLowerCase('tr-TR')||'';return !!(l.energyAnalyzerRich||/wattmetre.*güç ölç|güç ölç.*wattmetre|kosinüsfimetre.*güç katsayısı|güç katsayısı.*kosinüsfimetre/.test(t))}
function batteryParallelCurrentStep(l,session,project){
 const step=session?.step||0;if(session?.phase!=='rebuild'||step>=l.steps.length)return '';
 const s=l.steps[step];
 return '<section class="tutorial-parallel-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><h4>'+esc(componentLabel(project,s.from))+' <b>→</b> '+esc(componentLabel(project,s.to))+'</h4><p>'+esc(hintOpen?s.hint:'Yanıp sönen iki terminali tek kabloyla bağla.')+'</p>'+(hintOpen?'<div class="tutorial-why"><strong>Neden?</strong> '+esc(s.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
}
function batteryParallelNoteHtml(l,session,project){
 const mats=(l.materials||[]).map((x,i)=>'<li><b>'+(i+1)+'</b><div><strong>'+esc(x.label||x.typeId)+'</strong><span>'+esc(x.why||'Bu dersin gerçek elemanıdır.')+'</span></div></li>').join('');
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 const phase=session?.phase||'demo',phaseBox=phase==='complete'?'<section class="tutorial-parallel-complete"><b>✓ Paralel paket doğru kuruldu</b><span>Şimdi ölç: Pil 1 ≈1,5 V · Pil 2 ≈1,5 V · ortak raylar ≈1,5 V.</span></section>':batteryParallelCurrentStep(l,session,project);
 return '<div class="tutorial-parallel-rich">'+
 '<header class="tutorial-coach-head tutorial-parallel-head"><small>ÖĞRETİCİ · PİLLERİN PARALEL BAĞLANMASI</small><h2>Aynı kutupları ortaklaştır: gerilim aynı kalsın, kaynak gücü paylaşsın</h2><p>İki 1,5 V pili <b>+ → +</b> ve <b>− → −</b> bağla; ortak rayları oluştur, yükü bu raylara bağla ve UNI‑T ile neden hâlâ yaklaşık 1,5 V gördüğünü doğrula.</p></header>'+
 feedback+
 '<section class="tutorial-parallel-mission"><div><small>DERSİN ANA FİKRİ</small><strong>Paralelde gerilim toplanmaz</strong></div><p>İki eş hücre aynı iki elektrik düğümüne bağlanır. Bu yüzden paket uçları tek hücreyle aynı gerilim seviyesindedir; ideal eş hücrelerde kapasite ve akım sağlama yeteneği paylaşılabilir.</p></section>'+
 '<section class="tutorial-parallel-section"><h3>1 · Paralel bağlantıyı gözünde canlandır</h3><div class="tutorial-parallel-diagram"><div class="tutorial-parallel-cell"><b>+</b><span>PİL 1<em>1,5 V</em></span><b>−</b></div><div class="tutorial-parallel-rails"><span class="plus">ORTAK + RAY</span><i>+ ↔ +</i><i>− ↔ −</i><span class="minus">ORTAK − RAY</span></div><div class="tutorial-parallel-cell"><b>+</b><span>PİL 2<em>1,5 V</em></span><b>−</b></div></div><div class="tutorial-parallel-load"><span>ortak +</span><i>→</i><b>R1 · 100 Ω yük</b><i>→</i><span>ortak −</span></div></section>'+
 '<div class="tutorial-parallel-equations"><div><small>PAKET GERİLİMİ</small><strong>Vₚ = 1,5 V</strong><span>1,5 V + 1,5 V <b>değildir</b></span></div><div><small>YÜK AKIMI</small><strong>I = V / R</strong><span>1,5 / 100 = <b>15 mA</b></span></div><div><small>İDEAL EŞ HÜCRE</small><strong>I₁ ≈ I₂</strong><span>15 mA yükte yaklaşık 7,5 mA + 7,5 mA</span></div></div>'+
 '<section class="tutorial-parallel-compare"><div><small>ÖNCEKİ DERS · SERİ</small><strong>1,5 V + 1,5 V = 3,0 V</strong><span>Gerilim artar · aynı akım zincirden geçer</span></div><div><small>BU DERS · PARALEL</small><strong>1,5 V || 1,5 V = 1,5 V</strong><span>Gerilim aynı kalır · eş kaynaklar yükü paylaşabilir</span></div></section>'+
 '<section class="tutorial-parallel-section"><h3>2 · Sahnedeki elemanları tanı</h3><ul class="tutorial-parallel-materials">'+mats+'</ul></section>'+
 '<section class="tutorial-parallel-section"><h3>3 · Doğru bağlantı sırası</h3><div class="tutorial-parallel-steps"><article><b>1</b><span>Pozitif ray</span><p>BT1/+ → BT2/+ bağla.</p></article><article><b>2</b><span>Negatif ray</span><p>BT1/− → BT2/− bağla.</p></article><article><b>3</b><span>Yük girişi</span><p>Ortak + rayı R1/1’e bağla.</p></article><article><b>4</b><span>Yük dönüşü</span><p>R1/2’yi ortak − raya döndür.</p></article></div></section>'+
 '<section class="tutorial-parallel-measure"><h3>4 · UNI‑T ile kanıtla</h3><p>Multimetre <b>DCV 20 V</b> kademesinde. Bağlantı tamamlandıktan sonra üç farklı ölçümün de yaklaşık aynı sonucu vermesi gerekir.</p><div><button type="button" data-battery-parallel-measure="b1"><b>Pil 1’i ölç</b><span>BT1/+ ↔ BT1/−</span><em>≈ 1,5 V</em></button><button type="button" data-battery-parallel-measure="b2"><b>Pil 2’yi ölç</b><span>BT2/+ ↔ BT2/−</span><em>≈ 1,5 V</em></button><button type="button" data-battery-parallel-measure="rails"><b>Ortak rayları ölç</b><span>BT2/+ ↔ BT1/−</span><em>≈ 1,5 V</em></button><button type="button" data-battery-parallel-measure="free"><b>Probları serbest bırak</b><span>Kendi ölçümünü yap</span><em>deney yap</em></button></div></section>'+
 '<section class="tutorial-parallel-observe"><div><h3>Ne gözlemlemelisin?</h3><ul><li>Pil 1 uçları ≈ <b>1,5 V</b>.</li><li>Pil 2 uçları ≈ <b>1,5 V</b>.</li><li>Ortak + ile ortak − arasında yine ≈ <b>1,5 V</b>.</li><li>100 Ω yükte ideal toplam akım ≈ <b>15 mA</b>.</li><li>Gerilim seri bağlantıdaki gibi 3 V’a çıkmaz.</li></ul></div><div><h3>Kapasite neden avantaj sağlar?</h3><p>Aynı tip, gerilim ve durumda iki eş hücre ideal paralel bağlandığında Ah kapasitesi yaklaşık toplanabilir. Örneğin iki eş 2 Ah hücre ideal olarak yaklaşık 4 Ah paket gibi düşünülebilir. Gerçek davranış hücre iç direnci ve durumuna bağlıdır.</p></div></section>'+
 '<section class="tutorial-parallel-real"><h3>İdeal model ile gerçek hücreyi ayır</h3><div><span><b>İdeal</b> Eş hücreler yük akımını yaklaşık eşit paylaşır.</span><span><b>Gerçek</b> İç direnç, sıcaklık ve doluluk farkı paylaşımı değiştirir.</span><span><b>Kural</b> Farklı gerilim/kimya/doluluk durumundaki hücreler paralel paket için uygun kabul edilmez.</span><span><b>Bu uygulama</b> Kavramı sanal ortamda öğretir; gerçek hücrelerle deney yapmayı gerektirmez.</span></div></section>'+
 '<section class="tutorial-parallel-task"><h3>Öğrenci görevi</h3><ol><li>Önce seri ve paralel bağlantının kutup farkını kendi cümlenle söyle.</li><li>+ rayı ve − rayı kur.</li><li>Yükü iki ortak ray arasına bağla.</li><li>Üç ölçüm noktasında da yaklaşık 1,5 V gördüğünü doğrula.</li><li>100 Ω yükte neden 15 mA beklediğini I=V/R ile hesapla.</li><li>“Gerilim neden 3 V olmadı?” sorusunu ortak düğüm kavramıyla açıkla.</li></ol></section>'+
 phaseBox+
 '<section class="tutorial-parallel-question"><h3>Konu kontrolü</h3><p>İki aynı 1,5 V pil doğru şekilde paralel bağlandığında ideal paket gerilimi yaklaşık kaç volttur?</p><div><button type="button" data-battery-parallel-answer="0">1,5 V</button><button type="button" data-battery-parallel-answer="1">3,0 V</button><button type="button" data-battery-parallel-answer="2">0,75 V</button></div></section>'+
 '<footer class="tutorial-actions tutorial-parallel-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Paralel devreyi kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Seri‑paralel bağlanmaya geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}
function setBatteryParallelProbePreset(project,mode){
 const l=lessonFor(project);if(!isBatteryParallelLesson(l))return;
 const red=project.components.find(c=>c.id==='v1-red'),black=project.components.find(c=>c.id==='v1-black');if(!red||!black)return;
 if(mode==='b1'){red.probeTarget={c:'b1',p:'+'};black.probeTarget={c:'b1',p:'−'};project.tutorialLesson.lastFeedback='✓ Pil 1 seçildi: yaklaşık +1,5 V bekleyin.'}
 else if(mode==='b2'){red.probeTarget={c:'b2',p:'+'};black.probeTarget={c:'b2',p:'−'};project.tutorialLesson.lastFeedback='✓ Pil 2 seçildi: yaklaşık +1,5 V bekleyin.'}
 else if(mode==='rails'){red.probeTarget={c:'b2',p:'+'};black.probeTarget={c:'b1',p:'−'};project.tutorialLesson.lastFeedback='✓ Ortak raylar seçildi: doğru paralel bağlantıda yaklaşık +1,5 V bekleyin.'}
 else if(mode==='free'){delete red.probeTarget;delete black.probeTarget;project.tutorialLesson.lastFeedback='✓ Problar serbest. İstediğiniz terminale, junction noktasına veya kabloya sürükleyin.'}
 root.DTSEditor?.render?.();sync(project);
}
function ohmNumbers(project){
 const source=project?.components?.find(c=>c.id==='g'),resistor=project?.components?.find(c=>c.id==='r');
 const voltage=Math.max(0,Number(source?.dcVoltage??24)),resistance=Math.max(.001,Number(resistor?.resistance??120));
 return {source,resistor,voltage,resistance,current:voltage/resistance,power:voltage*voltage/resistance};
}
function ohmNoteHtml(l,session,project){
 const n=ohmNumbers(project),amps=n.current,mA=amps*1000;
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 const vButtons=[6,12,18,24].map(v=>'<button type="button" data-ohm-voltage="'+v+'" class="'+(Math.abs(n.voltage-v)<.01?'active':'')+'"><b>'+v+' V</b><span>beklenen I ≈ '+Math.round(v/n.resistance*1000)+' mA</span></button>').join('');
 const rButtons=[120,240,470].map(r=>'<button type="button" data-ohm-resistance="'+r+'" class="'+(Math.abs(n.resistance-r)<.01?'active':'')+'"><b>'+r+' Ω</b><span>'+n.voltage+' V için I ≈ '+Math.round(n.voltage/r*1000)+' mA</span></button>').join('');
 return '<div class="tutorial-ohm-rich">'+
 '<header class="tutorial-coach-head tutorial-ohm-head"><small>ÖĞRETİCİ · OHM KANUNU DENEYİ</small><h2>Gerilimi ayarla, akımı ölç, direncin etkisini gerçekten gör</h2><p>Ayarlanabilir DC güç kaynağı + seri ampermetre + R1 yükü + paralel voltmetre. Her ayarda önce tahmin et, sonra simülasyonla ölç ve <b>I=V/R</b> ile karşılaştır.</p></header>'+
 feedback+
 '<section class="tutorial-ohm-live"><div><small>ŞU ANKİ DENEY</small><strong>'+n.voltage.toFixed(n.voltage%1?1:0)+' V · '+n.resistance.toFixed(0)+' Ω</strong><span>İdeal akım ≈ <b>'+mA.toFixed(mA<10?1:0)+' mA</b></span></div><div><small>YÜK GÜCÜ</small><strong>'+n.power.toFixed(2)+' W</strong><span>P = V² / R</span></div></section>'+
 '<section class="tutorial-ohm-section"><h3>1 · Devrenin amacı</h3><div class="tutorial-ohm-purpose"><article><b>G1</b><strong>Ayarlanabilir DC güç kaynağı</strong><p>0–30 V aralığında deney gerilimini değiştirir. Ekranındaki değer simülasyona gerçekten uygulanır.</p></article><article><b>A1</b><strong>Ampermetre · seri</strong><p>Akım yolunun içine girer. Devreden geçen aynı akım ölçü aletinden de geçer.</p></article><article><b>R1</b><strong>Direnç yükü</strong><p>Akımı sınırlar. Gerilim sabitken R büyürse I küçülür.</p></article><article><b>V1</b><strong>Voltmetre · paralel</strong><p>R1’in iki ucu arasındaki potansiyel farkını devreyi kesmeden ölçer.</p></article></div></section>'+
 '<section class="tutorial-ohm-section"><h3>2 · Kaynak gerilimini değiştir</h3><p class="tutorial-ohm-lead">R1 aynı kalsın; yalnız G1’i değiştir. Akımın gerilimle doğru orantılı değişmesini gözle.</p><div class="tutorial-ohm-choice">'+vButtons+'</div></section>'+
 '<section class="tutorial-ohm-section"><h3>3 · Direnci değiştir</h3><p class="tutorial-ohm-lead">G1 aynı kalsın; yalnız R1’i değiştir. Direnç büyüdükçe akımın azaldığını ölç.</p><div class="tutorial-ohm-choice">'+rButtons+'</div></section>'+
 '<section class="tutorial-ohm-formulas"><div><small>AKIM</small><strong>I = V / R</strong><span>'+n.voltage.toFixed(0)+' / '+n.resistance.toFixed(0)+' = '+amps.toFixed(3)+' A</span></div><div><small>GERİLİM</small><strong>V = I × R</strong><span>ölçülen I ile kaynak değerini kontrol et</span></div><div><small>DİRENÇ</small><strong>R = V / I</strong><span>ölçümden R1’i geri hesapla</span></div></section>'+
 '<section class="tutorial-ohm-measure"><h3>4 · Ölçüm düzenini doğru oku</h3><div><span><b>①</b> G1 + terminali → A1 kırmızı akım probu</span><span><b>②</b> A1 COM → R1 giriş ucu</span><span><b>③</b> R1 çıkışı → G1 − dönüşü</span><span><b>④</b> V1 probları R1’in iki ucuna paralel</span></div><p><b>Ampermetre paralel bağlanmaz.</b> Akım ölçerken ölçü aleti devre yolunun parçasıdır. Voltmetre ise yalnız iki nokta arasındaki gerilimi okur.</p></section>'+
 '<section class="tutorial-ohm-observe"><div><h3>Beklenen gözlem</h3><ul><li>120 Ω için 6 V → yaklaşık 50 mA.</li><li>120 Ω için 12 V → yaklaşık 100 mA.</li><li>120 Ω için 18 V → yaklaşık 150 mA.</li><li>120 Ω için 24 V → yaklaşık 200 mA.</li></ul></div><div><h3>Öğrenci görevi</h3><ol><li>6/12/18/24 V değerlerini sırayla dene.</li><li>Her adımda A1 akımını ve V1 gerilimini not et.</li><li>Sonra 240 Ω ve 470 Ω seçip aynı gerilimde akımı karşılaştır.</li><li>Ölçümle I=V/R hesabını aynı tabloda karşılaştır.</li></ol></div></section>'+
 '<section class="tutorial-ohm-safety"><b>Sanal laboratuvar notu</b><span>Kaynak ve direnç ayarları uygulama içindeki simülasyon içindir. Gerçek ölçümde cihaz kademesi, güç sınırı ve bağlantı güvenliği ayrıca kontrol edilmelidir.</span></section>'+
 '<footer class="tutorial-actions tutorial-ohm-actions"><button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-ohm-reset="1">↺ 24 V / 120 Ω başlangıca dön</button><button type="button" data-tutorial-action="next">Sonraki uygulama →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}
function setOhmVoltage(project,value){
 const l=lessonFor(project);if(!isOhmLesson(l))return;const n=ohmNumbers(project),v=Math.max(0,Math.min(30,Number(value)||0));if(!n.source)return;
 root.DTSEditor?.stop?.();n.source.dcVoltage=v;n.source.label='Ayarlanabilir DC güç kaynağı · '+v.toFixed(v%1?1:0)+' V';
 project.tutorialLesson.lastFeedback='✓ G1 '+v+' V yapıldı. R1='+n.resistance.toFixed(0)+' Ω için ideal akım ≈ '+Math.round(v/n.resistance*1000)+' mA. Simülasyonu çalıştırıp A1 ile doğrula.';
 root.DTSEditor?.render?.();sync(project);
}
function setOhmResistance(project,value){
 const l=lessonFor(project);if(!isOhmLesson(l))return;const n=ohmNumbers(project),r=Math.max(1,Number(value)||120);if(!n.resistor)return;
 root.DTSEditor?.stop?.();n.resistor.resistance=r;n.resistor.label='R1 · '+r.toFixed(0)+' Ω';
 project.tutorialLesson.lastFeedback='✓ R1 '+r+' Ω yapıldı. G1='+n.voltage.toFixed(0)+' V için ideal akım ≈ '+Math.round(n.voltage/r*1000)+' mA. Simülasyonu çalıştırıp ölç.';
 root.DTSEditor?.render?.();sync(project);
}
function resetOhm(project){setOhmResistance(project,120);setOhmVoltage(project,24);project.tutorialLesson.lastFeedback='✓ Ohm deneyi 24 V / 120 Ω başlangıç durumuna döndü.';sync(project);}

function isBatteryTypesLesson(l){return !!(l&&l.id==='dc-battery-types-rich')}
function isReferenceFormatLesson(l){return !!(l&&(isDcUsageLesson(l)||isDcSourceLesson(l)||isBatterySeriesLesson(l)||isBatteryTypesLesson(l)||isBatteryParallelLesson(l)||isOhmLesson(l)||isSeriesAnalysisLesson(l)||isParallelAnalysisLesson(l)||isMixedAnalysisLesson(l)||isKirchhoffControlLesson(l)||isVoltageMeasurementLesson(l)||isCurrentMeasurementLesson(l)||isResistanceMeasurementLesson(l)||isClampCurrentMeasurementLesson(l)||isFrequencyMeasurementLesson(l)||isEnergyAnalyzerLesson(l)))}
function referenceStageData(l){
 if(isEnergyAnalyzerLesson(l))return {
  callouts:[['Sanal AC kaynak','Güç analizinin sanal 230 V / 50 Hz kaynağı.','G1'],['CT1','Yük akımını analizör modeline aktarır.','100/5 A'],['Z1 eğitim yükü','Dirençli / endüktif / kapasitif karakter seçilir.','230 VA'],['EA1 enerji analizörü','V, A, W, VA, var, PF, Hz ve Wh aynı ekranda.','Tek cihaz'],['Ayarlı DC kaynak','Ortak tasarım standardı; bu AC deneyinde OFF.','G0 · OFF']],
  flow:'Sanal kaynak → CT → yük   ·   EA1: V + I → P / Q / S / PF / Hz',
  question:'230 VA görünür güç ve PF=0,80 için aktif güç yaklaşık kaç watt olur?',options:['184 W','230 W','138 W','46 W'],correct:0,
  infoTitle:'Kısa bilgi · Güç üçgeni',formula:'P = S × PF   ·   S² = P² + Q²',info:'Enerji analizörü gerilim ve akım bilgisini birlikte değerlendirerek aktif güç, reaktif güç, görünür güç ve güç faktörünü tek ekranda toplar.',
  observe:['Dirençli: P≈230 W · Q≈0 var · PF≈1,00.','Endüktif: P≈184 W · Q≈+138 var · PF≈0,80.','Kapasitif: P≈184 W · Q≈−138 var · PF≈0,80.'],
  task:'Üç yük presetini sırayla seç; P, Q, S ve PF değerlerinin nasıl birlikte değiştiğini analizör ekranından karşılaştır.'
 };
 if(isFrequencyMeasurementLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','Ortak ders standardı; bu sinyal deneyinde OFF ve devreden ayrılmıştır.','G0 · OFF'],['Düşük gerilimli sinyal jeneratörü','0–5 V periyodik sinyal üretir.','FG1'],['UNI-T UT61E+','Gerçek frekans ölçüm fonksiyonlu multimetre.','Hz'],['Kırmızı prob','Frekans girişinde VΩHz yuvasındadır.','VΩHz'],['Siyah prob','Sinyal referansına COM üzerinden bağlanır.','COM']],
  flow:'OUT → VΩHz   ·   GND → COM   ·   f = 1 / T',
  question:'1 kHz sinyalin periyodu kaç ms olur?',options:['1 ms','10 ms','0,1 ms','100 ms'],correct:0,
  infoTitle:'Kısa bilgi · Frekans',formula:'f = 1/T   ·   T = 1/f',info:'Frekans bir saniyedeki çevrim sayısıdır. Bu derste UT33D+ yerine gerçek Hz fonksiyonlu UNI-T UT61E+ kullanılır.',
  observe:['50 Hz → T = 20 ms.','1 kHz → T = 1 ms.','10 kHz → T = 0,1 ms.'],
  task:'50 Hz, 1 kHz ve 10 kHz presetlerini sırayla seç. Multimetre ekranını ve periyot hesabını karşılaştır.'
 };
 if(isClampCurrentMeasurementLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','Ortak ders standardı; bu AC deneyinde OFF ve devreden ayrılmıştır.','G0 · OFF'],['Sanal 230 VAC eğitim kaynağı','UT200A pens ölçüm devresini besler.','G1 · 230 VAC'],['R1 AC yük','230 Ω yük yaklaşık 1 A RMS çeker.','230 Ω'],['UNI-T UT200A','Tek iletkeni çeneyle kavrar.','ACA 2 A'],['Pens çenesi','Devreyi kesmeden manyetik alanı ölçer.','Tek iletken']],
  flow:'Pens ölçümü = devreyi kesme → tek AC iletkeni çeneden geçir → RMS akımı oku',
  question:'Pens ampermetreyle doğru ölçüm bağlantısı hangisidir?',options:['Çene yalnız tek akım taşıyan iletkeni kavrar','Faz ve nötr birlikte çeneden geçirilir','Pens yükün iki ucuna paralel bağlanır','Kablo kesilip cihaz seri bağlanır'],correct:0,
  infoTitle:'Kısa bilgi · Pens ampermetre',formula:'I ≈ 230 V / 230 Ω = 1 A RMS',info:'UT200A pens akım kademeleri AC içindir. Çene tek iletkenin oluşturduğu manyetik alanı algılar; kablo elektriksel olarak kesilmez.',
  observe:['Faz iletkeninde ≈ 1,000 A RMS.','Nötr iletkeninde ≈ 1,000 A RMS.','Çene hiçbir iletkeni kavramazsa geçerli pens ölçümü oluşmaz.'],
  task:'Önce faz iletkenini, sonra nötr iletkenini ölç. Son olarak çeneyi boşta bırakıp cihaz uyarısını gözle.'
 };
 if(isResistanceMeasurementLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','Bu derste OFF ve R1’den tamamen ayrıdır.','G1 · OFF'],['R1 direnç','Enerjisiz ölçülecek gerçek eleman.','1 kΩ'],['UNI-T UT33D+','1 kΩ için uygun direnç kademesi.','Ω 2 kΩ'],['Kırmızı prob','Direnç ölçümünde VΩmA girişindedir.','VΩmA'],['Siyah prob','Referans probu COM girişindedir.','COM']],
  flow:'Direnç ölçümü = enerjiyi kes → Ω kademesini seç → probları iki uca değdir',
  question:'1 kΩ direnç için hangi UNI-T kademesi uygundur?',options:['Ω 2 kΩ','Ω 200 Ω','DCV 20 V','DCA 200 mA'],correct:0,
  infoTitle:'Kısa bilgi · Direnç ölçümü',formula:'1 kΩ = 1000 Ω',info:'Direnç ölçümü multimetrenin kendi küçük test akımıyla yapılır. Harici kaynak bağlıyken Ω ölçümü yapılmaz.',
  observe:['R1 uçlarında ≈ 1,000 kΩ.','Problar aynı noktaya değerse ≈ 0 Ω.','Problar açıkta kalırsa OL görünür.'],
  task:'Üç senaryoyu sırayla dene: R1 ölçümü, prob kısa devre kontrolü ve açık prob kontrolü. Her sonucu ölçmeden önce tahmin et.'
 };
 if(isCurrentMeasurementLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','1 kΩ yükte ölçülecek akımı oluşturur.','G1 · 24,0 V'],['R1 yük','Akımı sınırlayan gerçek direnç.','1 kΩ'],['UNI-T UT33D+','Beklenen 24 mA için uygun kademe.','DCA 200 mA'],['Kırmızı prob','Akım kademesinde VΩmA girişine bağlıdır.','VΩmA'],['Siyah prob','Akım yolunun dönüş tarafında COM girişidir.','COM']],
  flow:'Akım ölçümü = devreyi aç → ampermetreyi seri araya koy → aynı akımı yol boyunca izle',
  question:'24 V / 1 kΩ devrede beklenen akım kaç mA’dır?',options:['24 mA','240 mA','2,4 mA','1000 mA'],correct:0,
  infoTitle:'Kısa bilgi · Akım ölçümü',formula:'I = V / R = 24 / 1000 = 24 mA',info:'Beklenen 24 mA, 20 mA kademesini aşar; DCA 200 mA uygundur. Ampermetre akım yoluna seri bağlanır.',
  observe:['Yük öncesinde ≈ +24 mA.','Yük sonrasında ≈ +24 mA; seri devrede akım aynıdır.','Prob yönü ters çevrilirse büyüklük yaklaşık 24 mA kalır, işaret negatif olur.'],
  task:'Üç ölçüm konumunu sırayla dene: yük öncesi, yük sonrası ve ters prob yönü. Her ölçümden önce sonucu tahmin et.'
 };
 if(isVoltageMeasurementLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','Ölçüm devresini 24 V ile besler.','G1 · 24,0 V'],['R1 yük','1 kΩ dirençli yük.','Iideal = 24 mA'],['UNI-T UT33D+','24 V için uygun gerilim kademesi.','DCV 200 V'],['Kırmızı prob','VΩmA girişinden yüksek potansiyele gider.','VΩmA'],['Siyah prob','COM referansından düşük potansiyele gider.','COM']],
  flow:'Gerilim = iki nokta arasındaki potansiyel farkı   ·   Voltmetre paralel bağlanır',
  question:'24 VDC kaynağı ölçerken UNI-T UT33D+ için hangi kademe uygundur?',options:['DCV 200 V','DCV 20 V','DCA 200 mA','Ω'],correct:0,
  infoTitle:'Kısa bilgi · Gerilim ölçümü',formula:'V = V(kırmızı) − V(siyah)',info:'Gerilim tek bir noktaya ait değildir; iki nokta arasındaki farktır. 24 V, 20 V aralığını aştığı için DCV 200 V seçilir.',
  observe:['R1 uçlarında ≈ +24 V.','Kaynak uçlarında ≈ +24 V; aynı düğümde ≈ 0 V.','Problar ters çevrilirse büyüklük aynı kalır, işaret ≈ −24 V olur.'],
  task:'Dört ölçüm presetini sırayla dene: yük, kaynak, aynı düğüm ve ters polarite. Her sonucu ölçmeden önce tahmin et.'
 };
 if(isKirchhoffControlLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','Kirchhoff kontrol devresine 24 V uygular.','G1 · 24,0 V'],['A1 akım ölçeri','Toplam, R2 veya R3 akımına taşınır.','DCA 200 mA'],['KCL düğümü','R1 sonrası akım iki kola ayrılır.','It = I2 + I3'],['V1 voltmetre','R1, paralel grup veya kaynağı ölçer.','DCV 200 V'],['KVL çevresi','Seri gerilim düşümleri kaynağı tamamlar.','Vs = VR1 + Vpar']],
  flow:'KCL  103,45 ≈ 62,07 + 41,38 mA   ·   KVL  24 ≈ 10,34 + 13,66 V',
  question:'Aynı düğüme 103,45 mA girip R2 kolundan 62,07 mA çıkıyorsa R3 kolu yaklaşık kaç mA taşır?',options:['41,38 mA','165,52 mA','10,34 mA','24 mA'],correct:0,
  infoTitle:'Kısa bilgi · Kirchhoff',formula:'ΣI = 0   ·   ΣV = 0',info:'KCL düğümde akım korunur; KVL kapalı çevrede gerilim yükselme ve düşümlerinin cebirsel toplamının sıfır olduğunu söyler.',
  observe:['Itoplam ≈ 103,45 mA; I2 ≈ 62,07 mA; I3 ≈ 41,38 mA.','VR1 ≈ 10,34 V; Vparalel ≈ 13,66 V; Vkaynak ≈ 24 V.','I2+I3≈Itoplam ve VR1+Vparalel≈Vkaynak.'],
  task:'A1’i üç akım konumuna, V1’i üç gerilim konumuna sırayla taşı; iki Kirchhoff eşitliğini kendi ölçümlerinle tamamla.'
 };
 if(isMixedAnalysisLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','Karışık devreyi 24 V ile besler.','G1 · 24,0 V'],['A1 toplam akım','R1 ve paralel grup öncesi seri ölçüm.','≈103,45 mA'],['R1 seri bölüm','100 Ω · toplam akımın tamamı geçer.','VR1 ≈ 10,34 V'],['R2 || R3','220 Ω || 330 Ω = 132 Ω.','Vpar ≈ 13,66 V'],['V1 voltmetre','R1 veya paralel grup gerilimini ölç.','DCV 20 V']],
  flow:'Önce sadeleştir  R1 + (R2 || R3)  →  100 Ω + 132 Ω  →  232 Ω',
  question:'R2=220 Ω ve R3=330 Ω paralel ise eşdeğerleri kaç Ω olur?',options:['132 Ω','550 Ω','110 Ω','232 Ω'],correct:0,
  infoTitle:'Kısa bilgi · Karışık devre',formula:'Rₜ = R1 + (R2 || R3)',info:'Karışık devreyi tek adımda çözme. Önce yalnız paralel grubu eşdeğere indir; sonra seri toplamı bul ve tekrar kol akımlarına dön.',
  observe:['R2||R3 = 132 Ω ve Rtoplam = 232 Ω.','Itoplam ≈ 103,45 mA; VR1 ≈ 10,34 V; Vpar ≈ 13,66 V.','I2 ≈ 62,07 mA ve I3 ≈ 41,38 mA; I2+I3 ≈ Itoplam.'],
  task:'A1 ile toplam akımı doğrula. V1’i önce R1’e sonra paralel gruba geçir; 10,34 V + 13,66 V ≈ 24 V ve 62,07 + 41,38 ≈ 103,45 mA kontrollerini yap.'
 };
 if(isParallelAnalysisLesson(l))return {
  callouts:[['Ayarlanabilir DC kaynak','İki paralel kola aynı 24 V gerilimi uygular.','G1 · 24,0 V'],['A1 toplam akım','Dallanma öncesi seri ölçüm.','DCA 10 A · Itoplam'],['R1 kolu','100 Ω birinci paralel kol.','I1 = 240 mA'],['R2 kolu','220 Ω ikinci paralel kol.','I2 ≈ 109 mA'],['V1 voltmetre','R1/R2/kaynak gerilimini paralel karşılaştır.','DCV 200 V']],
  flow:'Akım bölünür  (+ → A1 → { R1 || R2 } → −)   ·   VR1 = VR2 = 24 V',
  question:'I1=240 mA ve I2≈109 mA ise ideal toplam akım yaklaşık kaç mA olur?',options:['349 mA','131 mA','75 mA','24 mA'],correct:0,
  infoTitle:'Kısa bilgi · Paralel devre',formula:'It = I1 + I2',info:'Paralel kollar aynı iki düğüme bağlıdır; gerilimleri aynıdır. Kaynaktan gelen toplam akım kollara bölünür.',
  observe:['Req = (100×220)/(100+220) = 68,75 Ω.','I1 = 24/100 = 240 mA; I2 ≈ 109 mA.','Itoplam ≈ 349 mA ve VR1 = VR2 ≈ 24 V.'],
  task:'A1 ile toplam akımı oku. V1’i R1, R2 ve kaynak uçlarına sırayla taşı; üç gerilim ölçümünde de yaklaşık 24 V gör ve 240+109≈349 mA ilişkisini doğrula.'
 };
 if(isSeriesAnalysisLesson(l))return {
  callouts:[['Ayarlanabilir DC güç kaynağı','Seri devreyi 24 VDC ile besler.','G1 · 24,0 V'],['A1 ampermetre','Tek akım yoluna seri girer.','DCA 200 mA · VΩmA'],['R1 ve R2','100 Ω + 220 Ω seri dirençler.','Rtoplam = 320 Ω'],['V1 voltmetre','R1 gerilimini paralel ölçer.','DCV 20 V'],['Beklenen sonuç','Aynı akım, paylaşılan gerilim.','I ≈ 75 mA']],
  flow:'Tek akım yolu  G1 (+) → A1 → R1 → R2 → G1 (−)',
  question:'24 V kaynağa seri bağlı 100 Ω ve 220 Ω dirençlerden ideal olarak kaç mA akar?',options:['75 mA','24 mA','320 mA','7,5 mA'],correct:0,
  infoTitle:'Kısa bilgi · Seri devre',formula:'Rₜ = R1 + R2 = 320 Ω',info:'Seri devrede dallanma yoktur; aynı akım tüm elemanlardan geçer. Ampermetre seri, voltmetre ölçülecek elemana paralel bağlanır.',
  observe:['I = 24 / 320 ≈ 75 mA.','VR1 ≈ 7,5 V ve VR2 ≈ 16,5 V.','VR1 + VR2 ≈ 24 V ve R1/R2 üzerinden aynı akım geçer.'],
  task:'Önce akım yolunu oku. Sonra Rtoplam ve I değerini hesapla; A1 ile akımı, V1 ile R1 gerilimini ölç. Sonuçları 75 mA ve 7,5 V beklentileriyle karşılaştır.'
 };
 if(isOhmLesson(l))return {
  callouts:[['Ayarlı DC kaynak','Deney gerilimini 0–30 V aralığında değiştir.','G1 · başlangıç 24 V'],['Direnç yük','Akımı sınırlayan R1 değerini değiştir.','120 / 240 / 470 Ω'],['A1 ampermetre','Devre akımını seri ölç.','UNI‑T UT33D+ · DCA'],['Kırmızı akım probu','G1 + ile A1 arasındaki seri ölçüm ucu.','10A girişi'],['V1 voltmetre','R1 uç gerilimini paralel ölç.','UNI‑T UT33D+ · DCV']],
  flow:'Akım yolu  (+ → A1 → R1 → −)   ·   V1, R1’e paralel',
  question:'R sabitken kaynak gerilimi iki katına çıkarılırsa ideal akım ne olur?',options:['İki katına çıkar','Yarıya düşer','Değişmez','Sıfır olur'],correct:0,
  infoTitle:'Kısa bilgi · Ohm Kanunu',formula:'I = V / R',info:'Gerilim arttıkça akım artar; direnç arttıkça akım azalır. Ampermetre seri, voltmetre paralel bağlanır.',
  observe:['24 V / 120 Ω ≈ 0,20 A.','12 V / 120 Ω ≈ 0,10 A.','24 V / 240 Ω ≈ 0,10 A.'],
  task:'6/12/18/24 V değerlerini ve 120/240/470 Ω dirençleri sırayla dene. Her adımda A1 ve V1 ölçümünü I=V/R hesabıyla karşılaştır.'
 };
 if(isDcUsageLesson(l))return {
  callouts:[['Ayarlanabilir DC güç kaynağı','Ders gerilimini görsel ve işlevsel masa kaynağı sağlar.','Başlangıç: 24 V DC'],['Direnç yük','Akıma karşı direnç gösterir.','R1 · 100 Ω'],['Multimetre','DC gerilimi ve devre davranışını gözlemle.','UNI‑T UT33D+'],['Kırmızı prob','Pozitif/ölçüm ucu.','İstediğin temas noktasına taşı'],['Siyah prob','COM / referans ucu.','İstediğin temas noktasına taşı']],
  flow:'Akım yönü  (+ → yük → −)',
  question:'Direnç sabitken kaynak gerilimi artarsa ideal devre akımı ne olur?',options:['Artar','Azalır','Değişmez','Sıfır olur'],correct:0,
  infoTitle:'Kısa bilgi · Ohm Kanunu',formula:'I = V / R',info:'Gerilim arttıkça, direnç sabitse akım artar.',
  observe:['Farklı iki elektrik düğümü arasında gerilim okunur.','Aynı düğümde iki noktayı ölçersen yaklaşık 0 V görürsün.','Probları terslersen ölçüm işareti değişir.'],
  task:'Simülasyonu çalıştır. Probları kaynak, yük ve kablo üzerindeki farklı noktalara taşı; sonuçları karşılaştır ve I=V/R ile açıklamaya çalış.'
 };
 if(isDcSourceLesson(l))return {
  callouts:[['Ayarlanabilir DC güç kaynağı','Bu derste 24 V değerine ayarlanmıştır.','G1 · +24 V / 0 V'],['Direnç yük','Elektrik enerjisini yük üzerinde harcar.','R1 · 1 kΩ'],['Multimetre','Kaynak ve yük gerilimini doğrular.','DCV 200 V'],['Kırmızı prob','VΩmA ölçüm ucu.','Kaynak/yük + noktasına taşı'],['Siyah prob','COM referans ucu.','0 V veya ikinci noktaya taşı']],
  flow:'Enerji yolu  (+24 V → R1 → 0 V)',
  question:'24 V kaynağa 1 kΩ yük bağlanırsa ideal akım kaç mA olur?',options:['24 mA','240 mA','2,4 A','0,24 mA'],correct:0,
  infoTitle:'Kısa bilgi · Kapalı devre',formula:'I = 24 / 1000 = 24 mA',info:'Yalnız +24 V kablosu yetmez; akımın 0 V hattından kaynağa dönebildiği kapalı yol gerekir.',
  observe:['Kaynak uçlarında yaklaşık 24 V görürsün.','R1 uçlarında ideal olarak yaklaşık 24 V oluşur.','Probları tersleyince yalnız işaret değişir.'],
  task:'Önce tam devreyi incele. Sonra “Devreyi yeniden kur” ile +24 V → R1 → 0 V yolunu kendin oluştur ve UNI‑T ile doğrula.'
 };
 if(isBatterySeriesLesson(l))return {
  callouts:[['Pil 1','Birinci 1,5 V hücre.','BT1'],['Pil 2','İkinci 1,5 V hücre.','BT2'],['Multimetre','Hücre ve paket gerilimini ölç.','DCV 20 V'],['Seri köprü','Bir pilin − ucu diğerinin + ucuna gider.','BT1/− → BT2/+'],['100 Ω yük','Seri paketin dış uçlarına bağlanır.','R1']],
  flow:'Seri paket  (+ → Pil 1 → Pil 2 → −)',
  question:'İki adet 1,5 V pil doğru yönde seri bağlanırsa ideal paket gerilimi nedir?',options:['3,0 V','1,5 V','0,75 V','6,0 V'],correct:0,
  infoTitle:'Kısa bilgi · Seri kaynak',formula:'Vtoplam = V1 + V2 = 3,0 V',info:'Seride gerilimler toplanır; aynı seri yol boyunca aynı akım akar.',
  observe:['Her hücre ayrı ayrı yaklaşık 1,5 V ölçülür.','Paket dış uçlarında yaklaşık 3,0 V görülür.','100 Ω yükte ideal akım yaklaşık 30 mA olur.'],
  task:'BT1/− ile BT2/+ seri köprüsünü kur; yükü dış uçlara bağla. Pil 1, Pil 2 ve toplam paketi ayrı ayrı ölç.'
 };
 if(isBatteryTypesLesson(l))return {
  callouts:[['Alkalin AA','Birincil hücre.','1,5 V'],['NiMH AA','Şarj edilebilir AA hücre.','1,2 V'],['Li‑ion 18650','Yüksek enerji yoğunluğu.','3,7 V'],['12 V akü','Kurşun-asit, şarj edilebilir.','12 V'],['UNI‑T karşılaştırma','Dört kaynağı aynı ölçü aletiyle kıyasla.','DCV 20 V']],
  flow:'Karşılaştır  (V · Ah · Wh · kimya · kullanım)',
  question:'Aynı 2 Ah kapasitede 3,7 V kaynak neden 1,5 V kaynaktan daha fazla ideal enerji taşır?',options:['Wh = V × Ah olduğu için','Ah gerilim olduğu için','Boyutu büyük olduğu için','Her zaman aynı enerjidir'],correct:0,
  infoTitle:'Kısa bilgi · Enerji',formula:'Wh ≈ V × Ah',info:'V gerilimi, Ah kapasiteyi, Wh ise yaklaşık depolanabilen enerjiyi anlatır.',
  observe:['Aynı fiziksel boyut farklı nominal gerilim anlamına gelebilir.','Alkalin şarjlı değildir; NiMH ve Li‑ion şarj edilebilir sınıftadır.','1 kΩ sanal yükte akım kaynak gerilimine göre değişir.'],
  task:'Dört kaynağı sırayla ölç. Sonra sanal 1 kΩ yükü her kaynağa geçir; I=V/R ile akımı karşılaştır ve hangi kullanım için hangi kaynağı seçeceğini açıkla.'
 };
 if(isBatteryParallelLesson(l))return {
  callouts:[['Pil 1','Birinci 1,5 V hücre.','BT1'],['Pil 2','İkinci 1,5 V hücre.','BT2'],['Multimetre','Hücre ve ortak ray gerilimini ölç.','DCV 20 V'],['Ortak raylar','Aynı kutuplar birleşir.','+ ↔ +   ·   − ↔ −'],['100 Ω yük','Ortak + ve − raylar arasına bağlanır.','R1']],
  flow:'Paralel paket  (+ ↔ +   ·   − ↔ −)',
  question:'İki aynı 1,5 V pil doğru şekilde paralel bağlandığında ideal paket gerilimi nedir?',options:['1,5 V','3,0 V','0,75 V','6,0 V'],correct:0,
  infoTitle:'Kısa bilgi · Paralel kaynak',formula:'Vpaket ≈ Vhücre = 1,5 V',info:'Paralelde gerilim toplanmaz; eş hücreler ideal olarak yük akımını ve kapasiteyi paylaşabilir.',
  observe:['Pil 1 uçlarında yaklaşık 1,5 V ölçülür.','Pil 2 uçlarında yaklaşık 1,5 V ölçülür.','Ortak + ile ortak − arasında yine yaklaşık 1,5 V görülür.'],
  task:'Önce + ortak rayı, sonra − ortak rayı kur. Yükü iki ray arasına bağla ve üç farklı ölçümün de yaklaşık 1,5 V olduğunu doğrula.'
 };
 return null;
}
function referenceStageHtml(l){
 const d=referenceStageData(l);if(!d)return '';
 const card=(x,i)=>'<article class="tutorial-ref-callout ref-callout-'+(i+1)+'"><b>'+(i+1)+'</b><div><strong>'+esc(x[0])+'</strong><span>'+esc(x[1])+'</span><small>'+esc(x[2])+'</small></div></article>';
 const opts=d.options.map((x,i)=>'<button type="button" data-reference-answer="'+(i===d.correct?'1':'0')+'"><b>'+String.fromCharCode(65+i)+'</b><span>'+esc(x)+'</span></button>').join('');
 return '<div class="tutorial-reference-stage" data-reference-lesson="'+esc(l.id)+'">'+
 '<div class="tutorial-ref-top">'+d.callouts.slice(0,3).map(card).join('')+'</div>'+
 '<div class="tutorial-ref-side tutorial-ref-side-left">'+card(d.callouts[3],3)+'</div>'+
 '<div class="tutorial-ref-side tutorial-ref-side-right">'+card(d.callouts[4],4)+'</div>'+
 '<div class="tutorial-ref-flow">'+esc(d.flow)+'</div>'+
 '<div class="tutorial-ref-bottom">'+
 '<section class="tutorial-ref-card tutorial-ref-question"><h3>❓ Soru</h3><p>'+esc(d.question)+'</p><div>'+opts+'</div></section>'+
 '<section class="tutorial-ref-card tutorial-ref-info"><h3>💡 '+esc(d.infoTitle)+'</h3><strong>'+esc(d.formula)+'</strong><p>'+esc(d.info)+'</p></section>'+
 '<section class="tutorial-ref-card tutorial-ref-observe"><h3>◉ Beklenen gözlem</h3><ul>'+d.observe.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></section>'+
 '<section class="tutorial-ref-card tutorial-ref-task"><h3>▣ Öğrenci görevi</h3><p>'+esc(d.task)+'</p></section>'+
 '</div></div>';
}
function clearReferenceStage(){
 root.document?.querySelector('#tutorialReferenceStage')?.remove();
 root.document?.body?.classList.remove('tutorial-reference-format');
}
function syncReferenceStage(l){
 const d=root.document,viewport=d?.querySelector('#viewport');if(!d||!viewport||!isReferenceFormatLesson(l)){clearReferenceStage();return}
 let wrap=d.querySelector('#tutorialReferenceStage');if(!wrap){wrap=d.createElement('div');wrap.id='tutorialReferenceStage';viewport.appendChild(wrap)}
 wrap.innerHTML=referenceStageHtml(l);d.body.classList.add('tutorial-reference-format');
}
function batteryTypesNoteHtml(l,session,project){
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 const rows=[
  ['Alkalin AA','1,5 V','Birincil','Kumanda · saat · oyuncak','Şarj edilmek için tasarlanmamıştır'],
  ['NiMH AA','1,2 V','Şarjlı','Oyuncak · fotoğraf · yüksek çevrim','Aynı AA boyutunda daha düşük nominal V'],
  ['Li-ion 18650','3,7 V','Şarjlı','Taşınabilir enerji · batarya modülleri','Koruma ve uygun şarj elektroniği gerekir'],
  ['Kurşun-asit akü','12 V','Şarjlı','Araç · UPS · yedek enerji','Ağırdır; yüksek akım sağlayabilir']
 ].map((x,i)=>'<article><b>'+(i+1)+'</b><div><strong>'+x[0]+'</strong><span>'+x[1]+' · '+x[2]+'</span><small>'+x[3]+'</small><em>'+x[4]+'</em></div></article>').join('');
 return '<div class="tutorial-battery-types-rich">'+
 '<header class="tutorial-coach-head tutorial-battery-types-head"><small>ÖĞRETİCİ · PİL VE AKÜ TİPLERİ</small><h2>Aynı “pil” görünmez: kimya, gerilim ve kullanım değişir</h2><p>Dört gerçek kullanım sınıfını aynı sanal laboratuvarda karşılaştır; nominal gerilimi ölç, 1 kΩ sanal yükte akımı hesapla ve V–Ah–Wh farkını öğren.</p></header>'+
 feedback+
 '<section class="tutorial-battery-types-intro"><div><small>ÖNCE AYIR</small><strong>Pil / hücre</strong><span>Elektrik enerjisini kimyasal enerjiden üretir. Birincil veya şarj edilebilir olabilir.</span></div><div><small>AKÜ / BATARYA</small><strong>Şarj edilebilir enerji deposu</strong><span>Bir veya birden çok hücreden oluşabilir; 12 V kurşun-asit akü bunun yaygın örneğidir.</span></div></section>'+
 '<section class="tutorial-battery-types-section"><h3>1 · Dört kaynağı tanı</h3><div class="tutorial-battery-types-grid">'+rows+'</div></section>'+
 '<section class="tutorial-battery-types-section"><h3>2 · Üç büyüklüğü birbirine karıştırma</h3><div class="tutorial-battery-types-metrics"><div><small>GERİLİM</small><strong>V</strong><p>Elektriksel potansiyel farkı. “Ne kadar itiyor?”</p></div><div><small>KAPASİTE</small><strong>Ah</strong><p>Belirli koşullarda ne kadar yük depolayabildiğini anlatır.</p></div><div><small>ENERJİ</small><strong>Wh</strong><p>Yaklaşık olarak <b>V × Ah</b>. Farklı gerilimleri karşılaştırırken daha anlamlıdır.</p></div></div></section>'+
 '<section class="tutorial-battery-types-measure"><h3>3 · UNI-T ile nominal gerilimi karşılaştır</h3><p>Multimetre <b>DCV 20 V</b> kademesinde. Bir kaynağı seç; problar otomatik konumlansın. İstersen sonra serbest bırak.</p><div><button type="button" data-battery-type-measure="ba"><b>Alkalin AA</b><span>≈ 1,5 V</span></button><button type="button" data-battery-type-measure="bn"><b>NiMH AA</b><span>≈ 1,2 V</span></button><button type="button" data-battery-type-measure="bl"><b>Li-ion 18650</b><span>≈ 3,7 V</span></button><button type="button" data-battery-type-measure="bk"><b>12 V akü</b><span>≈ 12 V</span></button><button class="wide" type="button" data-battery-type-measure="free"><b>Probları serbest bırak</b><span>Kendi ölçüm noktanı seç</span></button></div></section>'+
 '<section class="tutorial-battery-types-load"><div><h3>4 · 1 kΩ sanal yük deneyi</h3><p>Kaynak değişince aynı dirençte akım değişir. Uygulama yalnız <b>sanal</b> bağlantıyı değiştirir.</p><div><button type="button" data-battery-type-load="ba">Alkalin · 1,5 mA</button><button type="button" data-battery-type-load="bn">NiMH · 1,2 mA</button><button type="button" data-battery-type-load="bl">Li-ion · 3,7 mA</button><button type="button" data-battery-type-load="bk">12 V akü · 12 mA</button></div></div><aside><small>OHM KANUNU</small><strong>I = V / R</strong><span>R = 1000 Ω</span></aside></section>'+
 '<section class="tutorial-battery-types-section"><h3>5 · Hangi durumda hangisi?</h3><div class="tutorial-battery-types-use"><span><b>Uzun raf ömrü / basit cihaz</b>Alkalin</span><span><b>Tekrar kullanım / AA formatı</b>NiMH</span><span><b>Yüksek enerji yoğunluğu</b>Li-ion</span><span><b>12 V yedek enerji / yüksek akım</b>Kurşun-asit</span></div></section>'+
 '<section class="tutorial-battery-types-safety"><h3>Kritik güvenlik ve seçim mantığı</h3><div><span><b>1</b> Farklı kimya, gerilim veya doluluk durumundaki hücreleri rastgele birlikte kullanma.</span><span><b>2</b> Birincil alkalin hücreyi şarj etmeye çalışma.</span><span><b>3</b> Gerçek hücreleri kısa devre etme; yüksek akım ve ısınma oluşabilir.</span><span><b>4</b> Li-ion gibi şarjlı sistemlerde uygun koruma/şarj elektroniği gerekir.</span></div><p>Bu sayfadaki yük ve ölçüm deneyi uygulama içindeki sanal laboratuvar içindir.</p></section>'+
 '<section class="tutorial-battery-types-task"><h3>Öğrenci görevi</h3><ol><li>Dört kaynağın nominal gerilimini sırayla ölç.</li><li>Alkalin ve NiMH’in aynı AA formuna rağmen neden aynı voltajda olmadığını açıkla.</li><li>1 kΩ sanal yükü her kaynağa geçirip I=V/R ile akımı karşılaştır.</li><li>2 Ah kapasiteli 1,5 V ve 3,7 V kaynakların Wh değerlerini zihinden karşılaştır.</li><li>Bir kullanım senaryosu seçip hangi kaynağı neden tercih edeceğini açıkla.</li></ol></section>'+
 '<section class="tutorial-battery-types-question"><h3>Konu kontrolü</h3><p>Aynı 2 Ah kapasitede 3,7 V kaynak neden 1,5 V kaynaktan daha fazla ideal enerji taşır?</p><div><button type="button" data-battery-types-answer="0">Wh = V × Ah olduğu için</button><button type="button" data-battery-types-answer="1">Ah her zaman voltajdır</button><button type="button" data-battery-types-answer="2">Boyutu büyük olduğu için</button></div></section>'+
 '<footer class="tutorial-actions tutorial-battery-types-actions"><button class="primary" type="button" data-tutorial-action="simulate">▶ Sanal deneyi çalıştır</button><button type="button" data-tutorial-action="next">Pillerin paralel bağlanmasına geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}
function setBatteryTypeMeasure(project,id){
 const l=lessonFor(project);if(!isBatteryTypesLesson(l))return;
 const red=project.components.find(c=>c.id==='m-red'),black=project.components.find(c=>c.id==='m-black');if(!red||!black)return;
 if(id==='free'){delete red.probeTarget;delete black.probeTarget;project.tutorialLesson.lastFeedback='✓ Problar serbest. Sanal çalışma alanında istediğiniz terminale veya kabloya taşıyabilirsiniz.'}
 else{red.probeTarget={c:id,p:'+'};black.probeTarget={c:id,p:'−'};const names={ba:'Alkalin AA · yaklaşık 1,5 V',bn:'NiMH AA · yaklaşık 1,2 V',bl:'Li-ion 18650 · yaklaşık 3,7 V',bk:'Kurşun-asit akü · yaklaşık 12 V'};project.tutorialLesson.lastFeedback='✓ Ölçüm seçildi: '+names[id]+'.'}
 root.DTSEditor?.render?.();sync(project);
}
function setBatteryTypeLoad(project,id){
 const l=lessonFor(project);if(!isBatteryTypesLesson(l))return;
 const names={ba:'Alkalin AA',bn:'NiMH AA',bl:'Li-ion 18650',bk:'12 V kurşun-asit akü'},amps={ba:'1,5 mA',bn:'1,2 mA',bl:'3,7 mA',bk:'12 mA'};
 project.wires=(project.wires||[]).filter(w=>!w.batteryTypeLoad);
 project.wires.push(
  {id:'battery-type-load-feed',from:{c:id,p:'+'},to:{c:'r1',p:'1'},color:'#e53935',role:'TESTLOAD',size:'1.5',points:[],batteryTypeLoad:true},
  {id:'battery-type-load-return',from:{c:'r1',p:'2'},to:{c:id,p:'−'},color:'#111827',role:'TESTLOAD',size:'1.5',points:[],batteryTypeLoad:true}
 );
 project.tutorialLesson.lastFeedback='✓ '+names[id]+' 1 kΩ sanal yüke bağlandı. İdeal akım ≈ '+amps[id]+'.';
 root.DTSEditor?.render?.();sync(project);
}
function batterySeriesCurrentStep(l,session,project){
 const step=session?.step||0;if(session?.phase!=='rebuild'||step>=l.steps.length)return '';
 const s=l.steps[step];
 return '<section class="tutorial-battery-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><h4>'+esc(componentLabel(project,s.from))+' <b>→</b> '+esc(componentLabel(project,s.to))+'</h4><p>'+esc(hintOpen?s.hint:'Yanıp sönen iki terminali tek kabloyla bağla.')+'</p>'+(hintOpen?'<div class="tutorial-why"><strong>Neden?</strong> '+esc(s.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
}
function batterySeriesNoteHtml(l,session,project){
 const mats=(l.materials||[]).map((x,i)=>'<li><b>'+(i+1)+'</b><div><strong>'+esc(x.label||x.typeId)+'</strong><span>'+esc(x.why||'Bu dersin gerçek elemanıdır.')+'</span></div></li>').join('');
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 const phase=session?.phase||'demo',phaseBox=phase==='complete'?'<section class="tutorial-battery-complete"><b>✓ Seri paket doğru kuruldu</b><span>Simülasyonu çalıştır; hücrelerde ≈1,5 V, dış uçlarda ≈3,0 V bekle.</span></section>':batterySeriesCurrentStep(l,session,project);
 return '<div class="tutorial-battery-rich">'+
 '<header class="tutorial-coach-head tutorial-battery-head"><small>ÖĞRETİCİ · PİLLERİN SERİ BAĞLANMASI</small><h2>İki 1,5 V hücreyi birleştir, 3,0 V paketi gerçekten ölç</h2><p>Kutupları tanı → seri köprüyü kur → yükü dış uçlara bağla → her hücreyi ve toplam paketi UNI-T ile doğrula.</p></header>'+
 feedback+
 '<section class="tutorial-battery-mission"><div><small>DERSİN ANA FİKRİ</small><strong>Seride gerilimler toplanır</strong></div><p>Bir pilin <b>−</b> ucu sonraki pilin <b>+</b> ucuna bağlanır. Kullanılacak paket uçları zincirin boşta kalan en dış <b>+</b> ve <b>−</b> uçlarıdır.</p></section>'+
 '<section class="tutorial-battery-section"><h3>1 · Bağlantıyı gözünde canlandır</h3><div class="tutorial-battery-pack"><div class="tutorial-battery-cell"><b>+</b><span>PİL 1<em>1,5 V</em></span><b>−</b></div><i>seri köprü<br><strong>− → +</strong></i><div class="tutorial-battery-cell"><b>+</b><span>PİL 2<em>1,5 V</em></span><b>−</b></div></div><div class="tutorial-battery-outer"><span><b>Paket +</b> = BT1/+</span><span><b>Paket −</b> = BT2/−</span></div></section>'+
 '<div class="tutorial-battery-equations"><div><small>TOPLAM GERİLİM</small><strong>Vₜ = V₁ + V₂</strong><span>1,5 + 1,5 = <b>3,0 V</b></span></div><div><small>100 Ω YÜK AKIMI</small><strong>I = V / R</strong><span>3 / 100 = <b>0,03 A = 30 mA</b></span></div><div><small>SERİ ZİNCİR</small><strong>I₁ = I₂ = Iyük</strong><span>Aynı tek akım yolu</span></div></div>'+
 '<section class="tutorial-battery-section"><h3>2 · Sahnedeki gerçek elemanlar</h3><ul class="tutorial-battery-materials">'+mats+'</ul></section>'+
 '<section class="tutorial-battery-section"><h3>3 · Bağlantı sırası</h3><div class="tutorial-battery-steps"><article><b>1</b><span>Seri köprü</span><p>BT1/− ucunu BT2/+ ucuna bağla.</p></article><article><b>2</b><span>Yükün artısı</span><p>BT1/+ ucunu R1/1 girişine bağla.</p></article><article><b>3</b><span>Dönüş yolu</span><p>R1/2 ucunu BT2/− ucuna bağla.</p></article><article><b>4</b><span>Ölç ve doğrula</span><p>Her hücre ≈1,5 V; paket ≈3,0 V.</p></article></div></section>'+
 '<section class="tutorial-battery-measure"><h3>4 · UNI-T ile ölçüm deneyi</h3><p>Multimetre <b>DCV 20 V</b> kademesinde. Aşağıdaki seçimler probları hazır ölçüm noktalarına taşır; istersen sonra probları elle sürükleyebilirsin.</p><div><button type="button" data-battery-series-measure="cell1"><b>Pil 1’i ölç</b><span>BT1/+ ↔ BT1/−</span><em>≈ 1,5 V</em></button><button type="button" data-battery-series-measure="cell2"><b>Pil 2’yi ölç</b><span>BT2/+ ↔ BT2/−</span><em>≈ 1,5 V</em></button><button type="button" data-battery-series-measure="pack"><b>Paketi ölç</b><span>BT1/+ ↔ BT2/−</span><em>≈ 3,0 V</em></button><button type="button" data-battery-series-measure="free"><b>Probları serbest bırak</b><span>kendi noktalarını seç</span><em>deney yap</em></button></div></section>'+
 '<section class="tutorial-battery-observe"><div><h3>Ne görmelisin?</h3><ul><li>Her hücre tek başına yaklaşık <b>1,5 V</b>.</li><li>Doğru seri köprüyle dış uçlarda yaklaşık <b>3,0 V</b>.</li><li>100 Ω yükte ideal akım yaklaşık <b>30 mA</b>.</li><li>Seri devrenin tüm elemanlarından aynı akım geçer.</li></ul></div><div><h3>Gerilim artar, kapasite ne olur?</h3><p>Eş ve aynı kapasiteli hücreler ideal seri bağlandığında <b>gerilim toplanır</b>; Ah kapasitesi tek hücrenin Ah değeriyle aynı kalır. Toplam enerji ise gerilim arttığı için artar.</p></div></section>'+
 '<section class="tutorial-battery-errors"><h3>Kritik bağlantı mantığı</h3><div><span><b>✓</b> Seri: BT1/− → BT2/+</span><span><b>!</b> Yük yalnız dış uçlara bağlanır.</span><span><b>!</b> Kısa devre oluşturacak +/− doğrudan bağlantısından kaçın.</span><span><b>!</b> Gerçek pil paketlerinde farklı tip/gerilim/şarj durumundaki hücreleri karıştırma.</span></div></section>'+
 '<section class="tutorial-battery-uses"><h3>Bu mantık nerede kullanılır?</h3><div><span>El feneri pil yuvaları</span><span>Batarya paketleri</span><span>Oyuncak ve taşınabilir cihazlar</span><span>Enerji depolama modülleri</span></div></section>'+
 phaseBox+
 '<section class="tutorial-battery-task"><h3>Öğrenci görevi</h3><ol><li>Önce iki pilin kutuplarını söyle.</li><li>Seri köprünün hangi iki terminal arasında olduğunu göster.</li><li>Paketi 3,0 V olarak ölç ve 1,5+1,5 hesabıyla karşılaştır.</li><li>100 Ω yükte neden yaklaşık 30 mA beklediğini I=V/R ile açıkla.</li><li>“Devreyi yeniden kur” ile üç güç bağlantısını kendin tamamla.</li></ol></section>'+
 '<section class="tutorial-battery-question"><h3>Konu kontrolü</h3><p>İki adet 1,5 V pil doğru yönde seri bağlanırsa ideal paket gerilimi nedir?</p><div><button type="button" data-battery-series-answer="0">3,0 V</button><button type="button" data-battery-series-answer="1">1,5 V</button><button type="button" data-battery-series-answer="2">0,75 V</button></div></section>'+
 '<footer class="tutorial-actions tutorial-battery-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Seri devreyi kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Pil ve akü tipleri →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}
function setBatterySeriesProbePreset(project,mode){
 const l=lessonFor(project);if(!isBatterySeriesLesson(l))return;
 const red=project.components.find(c=>c.id==='v1-red'),black=project.components.find(c=>c.id==='v1-black');if(!red||!black)return;
 const target=(c,p)=>({c,p});
 if(mode==='cell1'){red.probeTarget=target('b1','+');black.probeTarget=target('b1','−');project.tutorialLesson.lastFeedback='✓ Pil 1 seçildi: yaklaşık +1,5 V bekleyin.'}
 else if(mode==='cell2'){red.probeTarget=target('b2','+');black.probeTarget=target('b2','−');project.tutorialLesson.lastFeedback='✓ Pil 2 seçildi: yaklaşık +1,5 V bekleyin.'}
 else if(mode==='pack'){red.probeTarget=target('b1','+');black.probeTarget=target('b2','−');project.tutorialLesson.lastFeedback='✓ Seri paketin dış uçları seçildi: yaklaşık +3,0 V bekleyin.'}
 else if(mode==='free'){delete red.probeTarget;delete black.probeTarget;project.tutorialLesson.lastFeedback='✓ Problar serbest. İstediğiniz terminale, junction noktasına veya kabloya sürükleyin.'}
 root.DTSEditor?.render?.();sync(project);
}
function dcSourceCurrentStep(l,session,project){
 const step=session?.step||0;if(session?.phase!=='rebuild'||step>=l.steps.length)return '';
 const s=l.steps[step];
 return '<section class="tutorial-source-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><h4>'+esc(componentLabel(project,s.from))+' <b>→</b> '+esc(componentLabel(project,s.to))+'</h4><p>'+esc(hintOpen?s.hint:'Yanıp sönen iki terminali tek kabloyla bağla.')+'</p>'+(hintOpen?'<div class="tutorial-why"><strong>Neden?</strong> '+esc(s.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
}
function dcSourceNoteHtml(l,session,project){
 const mats=(l.materials||[]).map((x,i)=>'<li><b>'+(i+1)+'</b><div><strong>'+esc(x.label||x.typeId)+'</strong><span>'+esc(x.why||'Bu dersin gerçek elemanıdır.')+'</span></div></li>').join('');
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 const phase=session?.phase||'demo';
 const phaseBox=phase==='complete'?'<section class="tutorial-source-complete"><b>✓ Güç yolunu doğru kurdun</b><span>Şimdi simülasyonu çalıştırıp ölçüm sonuçlarını tahmininle karşılaştır.</span></section>':dcSourceCurrentStep(l,session,project);
 return '<div class="tutorial-source-rich">'+
 '<header class="tutorial-coach-head tutorial-source-head"><small>ÖĞRETİCİ · DC KAYNAKLARI VE BAĞLANTILARI</small><h2>DC kaynağı yalnız bağlama — akım yolunu gerçekten anla</h2><p>24 VDC kaynak + 1 kΩ yük + gerçek UNI-T ölçümü üzerinden enerji yolunu adım adım keşfet.</p></header>'+
 feedback+
 '<section class="tutorial-source-mission"><div><small>DERSİN HEDEFİ</small><strong>Kaynak → Yük → Dönüş → Ölçüm</strong></div><p>Bir DC devrenin çalışması için yalnız “+ kablo” yetmez; akımın kaynağa dönebileceği kapalı bir yol gerekir.</p></section>'+
 '<section class="tutorial-source-section"><h3>1 · Önce kavramı gör</h3><div class="tutorial-source-flow"><span class="positive">+24 V</span><i>→</i><span>R1 · 1 kΩ yük</span><i>→</i><span class="return">0 V dönüş</span><i>→</i><span>kaynak</span></div><div class="tutorial-source-polarity"><b>+24 V</b><span>yüksek potansiyel / enerji çıkışı</span><b>0 V</b><span>bu devrenin referans ve dönüş hattı</span></div></section>'+
 '<section class="tutorial-source-predict"><div><small>ÖNCE TAHMİN ET</small><h3>24 V, 1 kΩ yükte kaç mA akım oluşturur?</h3><div class="tutorial-source-answer-row"><button type="button" data-dc-source-answer="0">24 mA</button><button type="button" data-dc-source-answer="1">240 mA</button><button type="button" data-dc-source-answer="2">2,4 A</button></div><p>I = V / R = 24 / 1000 = <b>0,024 A = 24 mA</b></p></div><div class="tutorial-source-number"><small>YÜK GÜCÜ</small><strong>0,576 W</strong><span>P = V × I</span></div></section>'+
 '<section class="tutorial-source-section"><h3>2 · Devredeki gerçek elemanlar</h3><ul class="tutorial-source-materials">'+mats+'</ul></section>'+
 '<section class="tutorial-source-section"><h3>3 · Gerilim ölçümünü keşfet</h3><p class="tutorial-source-lead">Multimetre <b>DCV 200 V</b> kademesinde. Gerilim ölçümü devreyi kesmeden, iki nokta arasına <b>paralel</b> yapılır.</p><div class="tutorial-source-measure-grid"><button type="button" data-dc-source-measure="source"><b>Kaynak uçları</b><span>PR → +24 V · PB → 0 V</span><em>≈ +24 V bekle</em></button><button type="button" data-dc-source-measure="load"><b>Yük uçları</b><span>PR → R1/1 · PB → R1/2</span><em>≈ +24 V bekle</em></button><button type="button" data-dc-source-measure="reverse"><b>Probları tersle</b><span>kırmızı ↔ siyah</span><em>≈ −24 V gör</em></button><button type="button" data-dc-source-measure="free"><b>Probları serbest bırak</b><span>istediğin noktaya sürükle</span><em>kendi deneyini yap</em></button></div></section>'+
 '<div class="tutorial-source-compare"><div><small>OHM KANUNU</small><strong>I = V / R</strong><span>24 V / 1000 Ω = 24 mA</span></div><div><small>GÜÇ</small><strong>P = V × I</strong><span>24 × 0,024 = 0,576 W</span></div><div><small>GERİLİM ÖLÇÜMÜ</small><strong>PARALEL</strong><span>iki nokta arasındaki fark</span></div></div>'+
 '<section class="tutorial-source-observe"><div><h3>Ne gözlemlemelisin?</h3><ul><li>+24 V ile 0 V arasında ≈24 V.</li><li>R1 idealde kaynak geriliminin tamamını üzerinde görür.</li><li>İki prob aynı elektrik düğümündeyse ≈0 V.</li><li>Problar terslenirse işaret değişir.</li><li>Kapalı dönüş yolu yoksa yük akımı oluşmaz.</li></ul></div><div><h3>Neden önemli?</h3><p>PLC, sensör, röle bobini, otomotiv elektroniği ve bataryalı sistemlerin çoğu aynı mantıkla çalışır: doğru polarite + kapalı dönüş yolu + uygun yük.</p></div></section>'+
 '<section class="tutorial-source-errors"><h3>Sık yapılan 4 hata</h3><div><span><b>1</b> Yalnız +24 V bağlayıp dönüş hattını unutmak.</span><span><b>2</b> 0 V ile PE/toprak kavramını otomatik olarak aynı sanmak.</span><span><b>3</b> Gerilim ölçümünde multimetreyi seri bağlamak.</span><span><b>4</b> Akım kademesindeki multimetreyi kaynağa paralel dokundurmak.</span></div></section>'+
 '<section class="tutorial-source-uses"><h3>Bu mantığı nerede göreceksin?</h3><div><span>⚙ PLC ve 24 V kumanda</span><span>◉ Endüstriyel sensörler</span><span>▣ Röle/kontaktör bobinleri</span><span>🔋 Batarya sistemleri</span><span>🚗 Otomotiv elektroniği</span><span>☀ DC enerji sistemleri</span></div></section>'+
 phaseBox+
 '<section class="tutorial-source-task"><h3>Öğrenci görevi</h3><ol><li>Kaynak uçlarını ölç ve sonucu söyle.</li><li>R1 uçlarını ölç ve kaynakla karşılaştır.</li><li>Probları ters çevir; yalnız işaretin neden değiştiğini açıkla.</li><li>Sonra “Devreyi yeniden kur” ile yalnız güç yolunu kendin oluştur.</li></ol></section>'+
 '<footer class="tutorial-actions tutorial-source-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Güç yolunu kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Sonraki uygulama</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer>'+
 '</div>';
}
function setDcSourceProbePreset(project,mode){
 const l=lessonFor(project);if(!isDcSourceLesson(l))return;
 const red=project.components.find(c=>c.id==='v1-red'),black=project.components.find(c=>c.id==='v1-black');if(!red||!black)return;
 const target=(c,p)=>({c,p});
 if(mode==='source'){red.probeTarget=target('g1','P');black.probeTarget=target('g1','M');project.tutorialLesson.lastFeedback='✓ Kaynak uçları seçildi: yaklaşık +24 V bekleyin.'}
 else if(mode==='load'){red.probeTarget=target('r1','1');black.probeTarget=target('r1','2');project.tutorialLesson.lastFeedback='✓ Yük uçları seçildi: R1 üzerinde yaklaşık +24 V bekleyin.'}
 else if(mode==='reverse'){const a=clone(red.probeTarget||target('g1','P')),b=clone(black.probeTarget||target('g1','M'));red.probeTarget=b;black.probeTarget=a;project.tutorialLesson.lastFeedback='✓ Problar terslendi: aynı büyüklüğün negatif işaretlisini bekleyin.'}
 else if(mode==='free'){delete red.probeTarget;delete black.probeTarget;project.tutorialLesson.lastFeedback='✓ Problar serbest. Simülasyonda istediğiniz terminale, junction noktasına veya kabloya sürükleyin.'}
 root.DTSEditor?.render?.();sync(project);
}

function dcUsageNoteHtml(l,session,project){
 const mats=(l.materials||[]).map((x,i)=>'<li><b>'+(i+1)+'</b><div><strong>'+esc(x.label||x.typeId)+'</strong><span>'+esc(x.why||'Dersin gerçek devre elemanıdır.')+'</span></div></li>').join('');
 return '<div class="tutorial-dc-rich">'+
 '<header class="tutorial-coach-head tutorial-dc-head"><small>ÖĞRETİCİ · DOĞRU AKIM VE KULLANIM ALANLARI</small><h2>Doğru Akım ve Ölçüm</h2><p><b>Amaç:</b> DC kaynağı, yükü ve ölçü aletini gerçek devre üzerinde anlayıp probları serbestçe kullanmak.</p></header>'+
 '<div class="tutorial-dc-probe-note"><b>◎ Problar serbesttir.</b><span>Simülasyon açıkken kırmızı ve siyah probu istediğiniz terminale, bağlantı noktasına veya kablo üzerine sürükleyip değdirebilirsiniz.</span></div>'+
 '<section class="tutorial-dc-section"><h3>Bu derste öğreneceksin</h3><ol class="tutorial-dc-learn"><li><b>1</b> DC kaynağın +24 V ve 0 V uçlarını ayırt etmek.</li><li><b>2</b> Direnç yükünün akımı nasıl sınırladığını anlamak.</li><li><b>3</b> Multimetrede doğru DC ölçüm kademesini seçmek.</li><li><b>4</b> Probları farklı noktalara değdirip potansiyel farkını karşılaştırmak.</li></ol></section>'+
 '<section class="tutorial-dc-section"><h3>Devredeki elemanlar</h3><ul class="tutorial-dc-materials">'+mats+'</ul></section>'+
 '<section class="tutorial-dc-section"><h3>Nasıl çalışır?</h3><div class="tutorial-dc-steps"><article><b>1</b><span>Devreyi incele</span><p>24 VDC kaynak R1=100 Ω yükü besler.</p></article><article><b>2</b><span>Simülasyonu başlat</span><p>Üstteki yeşil SİMÜLE ET düğmesini veya aşağıdaki düğmeyi kullan.</p></article><article><b>3</b><span>Probları sürükle</span><p>Kırmızı ve siyah prob uçlarını farklı temas noktalarına değdir.</p></article><article><b>4</b><span>Sonucu yorumla</span><p>Aynı düğüm ≈0 V; +24 V ile 0 V arası ≈24 V olmalıdır.</p></article></div></section>'+
 '<div class="tutorial-dc-law"><div><small>KISA BİLGİ · OHM KANUNU</small><strong>I = V / R</strong></div><p>24 V / 100 Ω = <b>0,24 A</b>. Direnç sabitken gerilim artarsa akım artar.</p></div>'+
 '<section class="tutorial-dc-observe"><div><h3>Beklenen gözlem</h3><ul><li>+24 V ↔ 0 V: yaklaşık <b>24 V</b></li><li>Aynı düğüm ↔ aynı düğüm: yaklaşık <b>0 V</b></li><li>Probları ters çevirirsen işaret ters döner.</li><li>Teorik yük akımı: <b>0,24 A</b></li></ul></div><div><h3>Akım nasıl ölçülür?</h3><p>Akım ölçümü için devre yolu açılır ve multimetre <b>seri</b> bağlanır. Akım girişini/kademesini seçmeden kaynağa paralel dokundurmak doğru değildir.</p></div></section>'+
 '<section class="tutorial-dc-section"><h3>Doğru akım nerelerde kullanılır?</h3><div class="tutorial-dc-uses"><span>🔋 Pil ve batarya sistemleri</span><span>🚗 Otomotiv elektroniği</span><span>⚙ PLC ve 24 V kumanda</span><span>💻 Elektronik devreler</span><span>☀ Güneş paneli / enerji depolama</span><span>🔌 DC motor ve sürücüler</span></div></section>'+
 '<section class="tutorial-dc-task"><h3>Öğrenci görevi</h3><p>Önce G1/P ile G1/M arasını ölç. Sonra problardan birini R1’in girişine ve diğerini çıkışına taşı. Son olarak probları ters çevirip ekrandaki işaret değişimini gözle.</p></section>'+
 '<details class="tutorial-dc-question"><summary>Soru · Gerilim artar, direnç sabit kalırsa akım ne olur?</summary><div><b>Doğru cevap: Akım artar.</b><p>I=V/R olduğundan R sabitken V büyürse I de büyür.</p></div></details>'+
 '<footer class="tutorial-actions tutorial-dc-actions"><button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="next">Sonraki uygulama</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer>'+
 '</div>';
}

function setEnergyAnalyzerPreset(project,mode){
 const l=lessonFor(project);if(!isEnergyAnalyzerLesson(l))return;
 const load=project?.components?.find(c=>c.id==='z1'),an=project?.components?.find(c=>c.id==='ea1');
 if(!load){project.tutorialLesson.lastFeedback='Enerji analizörü eğitim yükü bulunamadı. Dersi yeniden açın.';sync(project);return}
 const character=mode==='inductive'?'inductive':mode==='capacitive'?'capacitive':'resistive',pf=character==='resistive'?1:.8;
 load.loadCharacter=character;load.powerFactor=pf;load.apparentPowerVA=230;
 load.label=character==='resistive'?'Dirençli eğitim yükü · PF 1,00':character==='inductive'?'Endüktif eğitim yükü · PF 0,80':'Kapasitif eğitim yükü · PF 0,80';
 if(an){an._energyWh=0;delete an._energyAnalyzerLast}
 const p=230*pf,qmag=230*Math.sqrt(Math.max(0,1-pf*pf)),q=character==='inductive'?qmag:character==='capacitive'?-qmag:0;
 project.tutorialLesson.lastFeedback='✓ '+(character==='resistive'?'Dirençli':character==='inductive'?'Endüktif':'Kapasitif')+' yük seçildi: S≈230 VA · P≈'+p.toFixed(0)+' W · Q≈'+q.toFixed(0)+' var · PF≈'+pf.toFixed(2)+'.';
 root.DTSEditor?.render?.();sync(project);
}
function energyAnalyzerNoteHtml(l,session,project){
 const load=project?.components?.find(c=>c.id==='z1'),an=project?.components?.find(c=>c.id==='ea1'),character=load?.loadCharacter||'resistive',pf=Number(load?.powerFactor??1),sva=Number(load?.apparentPowerVA??230),p=sva*pf,qmag=sva*Math.sqrt(Math.max(0,1-pf*pf)),q=character==='inductive'?qmag:character==='capacitive'?-qmag:0,live=an?._energyAnalyzer||{},feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 const charLabel=character==='resistive'?'DİRENÇLİ':character==='inductive'?'ENDÜKTİF':'KAPASİTİF';
 const v=Number(live.voltageV||230),i=Number(live.currentA||1),lp=Number(live.activePowerW||p),lq=Number.isFinite(Number(live.reactivePowerVar))?Number(live.reactivePowerVar):q,ls=Number(live.apparentPowerVA||sva),lpf=Number(live.powerFactor||pf),hz=Number(live.frequencyHz||50);
 return '<div class="tutorial-energy-rich">'+
 '<header class="tutorial-coach-head tutorial-energy-head"><small>ÖĞRETİCİ · GÜÇ VE GÜÇ FAKTÖRÜ ANALİZİ</small><h2>Wattmetre ve cosφ bilgisini tek enerji analizöründe birleştir</h2><p>Hazır sanal devrede EA1 aynı anda gerilim, akım, aktif güç, görünür güç, reaktif güç, güç faktörü ve frekansı gösterir. Yük karakterini değiştirip güç üçgenini doğrudan sonuçlardan oku.</p></header>'+
 feedback+
 '<section class="tutorial-energy-simonly"><strong>SIMÜLASYON LABORATUVARI</strong><p>Bu sayfa yalnız uygulama içindeki sanal AC devreyi öğretir; gerçek şebeke üzerinde bağlantı veya ölçüm talimatı değildir.</p></section>'+
 '<section class="tutorial-energy-purpose"><div><small>DERSİN AMACI</small><strong>P–Q–S–PF ilişkisini gör</strong><p>Tek cihazda wattmetre, cosφ metre ve temel şebeke analizörü işlevlerini birlikte yorumla.</p></div><div><small>ÖLÇÜM MANTIĞI</small><strong>Gerilim + akım bilgisi</strong><p>EA1 sanal L–N gerilimini ve CT1 akım modelini birlikte değerlendirir; güç değerlerini buradan hesaplar.</p></div></section>'+
 '<section class="tutorial-energy-flow"><span>G1 · sanal 230 V</span><i>→</i><b>CT1</b><i>→</i><strong>Z1 · '+charLabel+'</strong><i>→</i><span>N</span><small>EA1: L–N gerilim + CT akım → V / I / P / Q / S / PF / Hz / Wh</small></section>'+
 '<section class="tutorial-energy-live"><div><small>U</small><strong>'+v.toFixed(1)+' V</strong></div><div><small>I</small><strong>'+i.toFixed(3)+' A</strong></div><div><small>P</small><strong>'+lp.toFixed(1)+' W</strong></div><div><small>Q</small><strong>'+lq.toFixed(1)+' var</strong></div><div><small>S</small><strong>'+ls.toFixed(1)+' VA</strong></div><div><small>PF / cosφ</small><strong>'+lpf.toFixed(2)+'</strong></div><div><small>f</small><strong>'+hz.toFixed(2)+' Hz</strong></div></section>'+
 '<section class="tutorial-energy-presets"><h3>Yük karakterini değiştir</h3><div><button type="button" data-energy-preset="resistive"><b>1 · Dirençli</b><span>PF 1,00</span><em>P≈230 W · Q≈0</em></button><button type="button" data-energy-preset="inductive"><b>2 · Endüktif</b><span>PF 0,80 gecikmeli</span><em>P≈184 W · Q≈+138 var</em></button><button type="button" data-energy-preset="capacitive"><b>3 · Kapasitif</b><span>PF 0,80 ileride</span><em>P≈184 W · Q≈−138 var</em></button></div></section>'+
 '<section class="tutorial-energy-equations"><div><small>AKTİF GÜÇ</small><strong>P = S × PF</strong><p>Yararlı işe dönüşen güç.</p></div><div><small>GÖRÜNÜR GÜÇ</small><strong>S = V × I</strong><p>Kaynağın taşıdığı toplam VA.</p></div><div><small>REAKTİF GÜÇ</small><strong>Q = ±√(S²−P²)</strong><p>Endüktifte +, kapasitifte − olarak gösterilir.</p></div></section>'+
 '<section class="tutorial-energy-why"><div><h3>Wattmetre nerede?</h3><p>Aktif güç <b>P (W)</b>, analizör ekranında wattmetre işlevinin karşılığıdır.</p></div><div><h3>Cosinüsfimetre nerede?</h3><p><b>PF / cosφ</b> alanı güç katsayısını doğrudan gösterir; ayrı bir cihaz gerektirmez.</p></div></section>'+
 '<section class="tutorial-energy-check"><h3>Karşılaştırma</h3><ol><li>Dirençli yük: <b>PF≈1,00</b>, Q≈0.</li><li>Endüktif yük: <b>Q pozitif</b>, PF düşer.</li><li>Kapasitif yük: <b>Q negatif</b>, PF büyüklüğü yine 0,80 olabilir.</li><li>Aynı S=230 VA için PF 0,80 olduğunda P≈184 W.</li></ol></section>'+
 '<footer class="tutorial-actions tutorial-energy-actions"><button class="primary" type="button" data-tutorial-action="simulate">▶ Sanal analizi çalıştır</button><button type="button" data-tutorial-action="next">Sonraki ölçüm dersine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function setFrequencyMeasurePreset(project,mode){
 const l=lessonFor(project);if(!isFrequencyMeasurementLesson(l))return;
 const fg=project?.components?.find(c=>c.id==='fg'),meter=project?.components?.find(c=>c.id==='m1'),red=project?.components?.find(c=>c.id==='m1-red'),black=project?.components?.find(c=>c.id==='m1-black');
 if(!fg||!meter){project.tutorialLesson.lastFeedback='Frekans laboratuvarı eksik. Dersi yeniden açın.';sync(project);return}
 const hz=mode==='50'?50:mode==='10000'?10000:1000;
 fg.generatorEnabled=true;fg.generatorFrequency=hz;meter.meterPosition=5;
 if(red)red.probeTarget={c:'fg',p:'OUT'};if(black)black.probeTarget={c:'fg',p:'GND'};
 const periodMs=1000/hz,label=hz>=1000?(hz/1000).toLocaleString('tr-TR')+' kHz':hz+' Hz';
 project.tutorialLesson.lastFeedback='✓ FG1 '+label+' yapıldı. UT61E+ beklenen okuma '+label+'; T = '+periodMs.toLocaleString('tr-TR',{maximumFractionDigits:3})+' ms.';
 root.DTSEditor?.render?.();sync(project);
}
function frequencyMeasurementNoteHtml(l,session,project){
 const fg=project?.components?.find(c=>c.id==='fg'),hz=Number(fg?.generatorFrequency||1000),period=1000/Math.max(.01,hz),feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 const hzText=hz>=1000?(hz/1000).toLocaleString('tr-TR')+' kHz':hz.toLocaleString('tr-TR')+' Hz';
 return '<div class="tutorial-frequency-rich">'+
 '<header class="tutorial-coach-head tutorial-frequency-head"><small>ÖĞRETİCİ · FREKANSMETRE İLE FREKANS ÖLÇÜMÜ</small><h2>Frekansı doğrudan multimetrede oku</h2><p>Bu derste UT33D+ yerine gerçek Hz fonksiyonuna sahip UNI‑T UT61E+ kullanılır. Düşük gerilimli sanal sinyalin frekansını ölç ve T=1/f ilişkisiyle periyodu doğrula.</p></header>'+
 feedback+
 '<section class="tutorial-frequency-simonly"><strong>SIMÜLASYON LABORATUVARI</strong><p>Ölçüm yalnız 0–5 V sanal sinyal jeneratörüyle yapılır. Bu içerik gerçek şebeke üzerinde çalışma talimatı değildir.</p></section>'+
 '<section class="tutorial-frequency-purpose"><div><small>DERSİN AMACI</small><strong>Hz/kHz değerini ölç</strong><p>Multimetre sinyalin tekrar hızını okur. Frekans yükseldikçe bir çevrimin süresi azalır.</p></div><div><small>DOĞRU CİHAZ</small><strong>UNI-T UT61E+ · Hz</strong><p>Kırmızı prob VΩHz, siyah prob COM girişindedir. UT33D+ modelinde Hz fonksiyonu olmadığı için bu derste kullanılmaz.</p></div></section>'+
 '<section class="tutorial-frequency-flow"><span>FG1 · OUT</span><i>→</i><b>VΩHz · UT61E+</b><i>⇄</i><b>COM</b><i>←</i><span>FG1 · GND</span></section>'+
 '<section class="tutorial-frequency-live"><div><small>SEÇİLİ FREKANS</small><strong>'+hzText+'</strong></div><div><small>PERİYOT</small><strong>'+period.toLocaleString('tr-TR',{maximumFractionDigits:3})+' ms</strong><span>T = 1000 / f(Hz)</span></div></section>'+
 '<section class="tutorial-frequency-measure"><h3>Frekansı değiştir, multimetreden oku</h3><div><button type="button" data-frequency-preset="50"><b>1 · 50 Hz</b><span>Yavaş tekrar</span><em>T = 20 ms</em></button><button type="button" data-frequency-preset="1000"><b>2 · 1 kHz</b><span>1000 çevrim/s</span><em>T = 1 ms</em></button><button type="button" data-frequency-preset="10000"><b>3 · 10 kHz</b><span>10000 çevrim/s</span><em>T = 0,1 ms</em></button></div></section>'+
 '<section class="tutorial-frequency-why"><div><h3>Neden UT61E+?</h3><p>Gerçek UT33D+ modelinde frekans ölçüm kademesi yoktur. Cihaza sahte Hz fonksiyonu eklemek yerine frekans destekleyen gerçek UNI‑T modeli kullanılır.</p></div><div><h3>Neden iki prob?</h3><p>Frekans girişi sinyal ile referans arasındaki periyodik değişimi izler. Bu nedenle VΩHz probu OUT, COM probu GND noktasındadır.</p></div></section>'+
 '<section class="tutorial-frequency-check"><h3>Beklenen sonuçlar</h3><ol><li>50 Hz → <b>20 ms</b>.</li><li>1 kHz → <b>1 ms</b>.</li><li>10 kHz → <b>0,1 ms</b>.</li><li>Frekans 10 kat artarsa periyot <b>10 kat azalır</b>.</li></ol></section>'+
 '<footer class="tutorial-actions tutorial-frequency-actions"><button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçümü çalıştır</button><button type="button" data-tutorial-action="next">Sonraki ölçüm dersine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function setClampMeasurePreset(project,mode){
 const l=lessonFor(project);if(!isClampCurrentMeasurementLesson(l))return;
 const clamp=project?.components?.find(c=>c.id==='cl');
 const meta=project?.tutorialExplore||{};
 if(!clamp){project.tutorialLesson.lastFeedback='UT200A bulunamadı. Dersi yeniden açın.';sync(project);return}
 if(mode==='neutral'){
  clamp.clampedWireId=meta.neutralWireId;clamp.clampT=.5;
  project.tutorialLesson.lastFeedback='✓ Nötr iletkeni seçildi: beklenen ≈ 1,000 A RMS. Seri devrede faz ve nötr akım büyüklükleri aynıdır.';
 }else if(mode==='none'){
  delete clamp.clampedWireId;delete clamp.clampT;
  project.tutorialLesson.lastFeedback='✓ Çene boşta: geçerli pens ölçümü yok. UT200A bir iletken kavramadığında ölçüm uyarısı verir.';
 }else{
  clamp.clampedWireId=meta.phaseWireId;clamp.clampT=.52;mode='phase';
  project.tutorialLesson.lastFeedback='✓ Faz iletkeni seçildi: beklenen ≈ 1,000 A RMS. Devre kesilmeden tek iletken çene içinde.';
 }
 root.DTSEditor?.render?.();sync(project);
}
function clampCurrentMeasurementNoteHtml(l,session,project){
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 return '<div class="tutorial-clamp-rich">'+
 '<header class="tutorial-coach-head tutorial-clamp-head"><small>ÖĞRETİCİ · PENS AMPERMETRE İLE AKIM ÖLÇÜMÜ</small><h2>Kabloyu kesmeden tek iletkenin akımını ölç</h2><p>UNI‑T UT200A çenesi, AC akımın oluşturduğu manyetik alanı algılar. Bu yüzden cihaz seri bağlanmaz; yalnız bir akım taşıyan iletken çenenin içinden geçer.</p></header>'+
 feedback+
 '<section class="tutorial-clamp-simonly"><strong>SIMÜLASYON LABORATUVARI</strong><p>Bu içerik yalnız uygulama içindeki sanal AC devreyi öğretir; gerçek şebeke üzerinde çalışma talimatı değildir.</p></section><section class="tutorial-clamp-purpose"><div><small>DERSİN AMACI</small><strong>Temassız akım ölçüm mantığı</strong><p>230 VAC / 230 Ω eğitim devresinde yaklaşık 1 A RMS akımı, devreyi bozmadan faz ve nötr iletkenlerinde karşılaştır.</p></div><div><small>DOĞRU KADEME</small><strong>ACA 2 A</strong><p>Beklenen akım yaklaşık 1 A olduğundan UT200A’nın 2 A AC pens kademesi uygundur.</p></div></section>'+
 '<section class="tutorial-clamp-circuit"><span>G1 · 230 VAC</span><i>→</i><b>Faz iletkeni</b><i>→</i><strong>R1 · 230 Ω</strong><i>→</i><b>Nötr iletkeni</b><i>→</i><span>G1</span><small>I ≈ 230 / 230 = 1 A RMS</small></section>'+
 '<section class="tutorial-clamp-parts"><article><b>G0</b><div><strong>Ayarlı DC kaynak · OFF</strong><p>Ortak ders görsel standardıdır; bu AC deneyinde elektriksel olarak kullanılmaz.</p></div></article><article><b>G1</b><div><strong>Sanal 230 VAC eğitim kaynağı</strong><p>UT200A pens ölçümünün gerçek AC devresini besler.</p></div></article><article><b>R1</b><div><strong>230 Ω dirençli yük</strong><p>Yaklaşık 1 A RMS seri akım oluşturur.</p></div></article><article><b>P1</b><div><strong>UNI-T UT200A</strong><p>ACA 2 A konumunda çene tek iletkeni kavrar.</p></div></article></section>'+
 '<section class="tutorial-clamp-measure"><h3>Pensi devreyi kesmeden taşı</h3><div><button type="button" data-clamp-preset="phase"><b>1 · Faz iletkeni</b><span>G1/L → R1</span><em>≈ 1,000 A RMS</em></button><button type="button" data-clamp-preset="neutral"><b>2 · Nötr iletkeni</b><span>R1 → G1/N</span><em>≈ 1,000 A RMS</em></button><button type="button" data-clamp-preset="none"><b>3 · Çene boşta</b><span>İletken kavranmıyor</span><em>Ölçüm yok</em></button></div></section>'+
 '<section class="tutorial-clamp-why"><div><h3>Neden tek iletken?</h3><p>Faz ve nötrü birlikte kavramak doğru yük akımı ölçümü değildir; zıt yönlü manyetik alanlar birbirini azaltabilir. Bu derste pens yalnız tek iletkene kilitlenir.</p></div><div><h3>Neden seri değil?</h3><p>Pens ampermetre iletkenin çevresindeki manyetik alanı algılar. Kabloyu kesip cihazı devre yoluna eklemek gerekmez.</p></div></section>'+
 '<section class="tutorial-clamp-check"><h3>Beklenen sonuçlar</h3><ol><li>Faz iletkeni: <b>≈ 1,000 A RMS</b>.</li><li>Nötr iletkeni: <b>≈ 1,000 A RMS</b>.</li><li>Çene boşta: <b>geçerli pens ölçümü yok</b>.</li><li>UT200A pens akım işlevi bu simülasyonda <b>AC akım</b> içindir.</li><li>Kabloyu kesme; çeneyi <b>tek iletken</b> üzerine kapat.</li></ol></section>'+
 '<footer class="tutorial-actions tutorial-clamp-actions"><button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="next">Sonraki ölçüm dersine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function setResistanceMeasurePreset(project,mode){
 const l=lessonFor(project);if(!isResistanceMeasurementLesson(l))return;
 const red=project?.components?.find(c=>c.id==='m1-red'),black=project?.components?.find(c=>c.id==='m1-black');
 if(!red||!black){project.tutorialLesson.lastFeedback='Direnç ölçüm probları hazır değil. Sayfayı yeniden açın.';sync(project);return}
 if(mode==='short'){
  red.probeTarget={c:'r1',p:'1'};black.probeTarget={c:'r1',p:'1'};
  project.tutorialLesson.lastFeedback='✓ Prob kısa devre kontrolü: beklenen ≈ 0 Ω. İki prob aynı elektriksel noktaya temas ediyor.';
 }else if(mode==='open'){
  red.probeTarget=null;black.probeTarget=null;
  project.tutorialLesson.lastFeedback='✓ Açık prob kontrolü: beklenen OL. Problar arasında tamamlanmış bir ölçüm yolu yok.';
 }else{
  red.probeTarget={c:'r1',p:'1'};black.probeTarget={c:'r1',p:'2'};mode='resistor';
  project.tutorialLesson.lastFeedback='✓ R1 ölçümü: beklenen ≈ 1,000 kΩ. Kaynak OFF ve direnç harici beslemeden ayrılmış durumda.';
 }
 root.DTSEditor?.render?.();sync(project);
}
function resistanceMeasurementNoteHtml(l,session,project){
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 return '<div class="tutorial-resistance-rich">'+
 '<header class="tutorial-coach-head tutorial-resistance-head"><small>ÖĞRETİCİ · MULTİMETRE İLE DİRENÇ ÖLÇÜMÜ</small><h2>Önce enerjiyi kes, sonra Ω ölç</h2><p>Ayarlanabilir kaynak bu derste yalnız ortak görsel referanstır: OFF ve devreden ayrılmıştır. UNI-T’nin kendi ölçüm akımıyla R1’in direncini güvenli biçimde ölç.</p></header>'+
 feedback+
 '<section class="tutorial-resistance-safety"><strong>⚠ ENERJİSİZ ÖLÇÜM</strong><p>Direnç ölçerken harici besleme uygulanmaz. G1 bu sayfada 0,0 V / OFF durumundadır ve R1’e bağlı değildir.</p></section>'+
 '<section class="tutorial-resistance-purpose"><div><small>DERSİN AMACI</small><strong>Direnci doğru yorumla</strong><p>R1’in iki ucuna temas ederek yaklaşık 1 kΩ gör; kısa devrede 0 Ω ve açık devrede OL farkını karşılaştır.</p></div><div><small>DOĞRU KADEME</small><strong>Ω 2 kΩ</strong><p>1 kΩ = 1000 Ω, 200 Ω aralığını aşar. 2 kΩ kademesi uygun ölçüm aralığıdır.</p></div></section>'+
 '<section class="tutorial-resistance-parts"><article><b>G1</b><div><strong>Ayarlı kaynak · OFF</strong><p>Bu derste bağlanmaz; enerji kesme kuralını görünür kılar.</p></div></article><article><b>R1</b><div><strong>1 kΩ direnç</strong><p>Enerjisiz halde iki ucundan ölçülen elemandır.</p></div></article><article><b>M1</b><div><strong>UNI-T UT33D+</strong><p>Ω 2 kΩ konumunda, VΩmA ve COM problarıyla ölçer.</p></div></article><article><b>PROB</b><div><strong>Kırmızı + siyah</strong><p>İki ölçüm noktasına temas eder; Ω ölçümünde polarite kritik değildir.</p></div></article></section>'+
 '<section class="tutorial-resistance-measure"><h3>Üç sonucu karşılaştır</h3><div><button type="button" data-resistance-preset="resistor"><b>1 · R1’i ölç</b><span>R1/1 ↔ R1/2</span><em>≈ 1,000 kΩ</em></button><button type="button" data-resistance-preset="short"><b>2 · Probları kısa devre et</b><span>Aynı noktaya temas</span><em>≈ 0 Ω</em></button><button type="button" data-resistance-preset="open"><b>3 · Probları ayır</b><span>Temas yok</span><em>OL</em></button></div></section>'+
 '<section class="tutorial-resistance-why"><div><h3>Neden enerji kesik?</h3><p>Ω kademesi kendi test akımını uygular. Harici bir kaynak bağlı olursa ölçüm yanlış olur ve multimetre uyarı verir.</p></div><div><h3>OL ne demek?</h3><p>Ölçüm yolu açık ya da seçilen aralığın dışında demektir. Bu deneyde problar açık bırakıldığında OL beklenir.</p></div></section>'+
 '<section class="tutorial-resistance-check"><h3>Beklenen sonuçlar</h3><ol><li>R1 iki ucu: <b>≈ 1,000 kΩ</b>.</li><li>Problar aynı noktada: <b>≈ 0 Ω</b>.</li><li>Problar açık: <b>OL</b>.</li><li>1 kΩ için <b>Ω 2 kΩ</b> kademesini kullan.</li><li>Direnç ölçümünden önce harici enerjiyi <b>kes ve elemanı mümkünse devreden ayır</b>.</li></ol></section>'+
 '<footer class="tutorial-actions tutorial-resistance-actions"><button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçümü çalıştır</button><button type="button" data-tutorial-action="next">Sonraki ölçüm dersine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function setCurrentMeasurePreset(project,mode){
 const l=lessonFor(project);if(!isCurrentMeasurementLesson(l))return;root.DTSEditor?.stop?.();
 const red=project?.components?.find(c=>c.id==='a1-red'),black=project?.components?.find(c=>c.id==='a1-black');
 if(!red||!black){project.tutorialLesson.lastFeedback='Akım probları hazır değil. Önce tam devreyi gösterin.';sync(project);return}
 const GP={c:'g',p:'P'},GM={c:'g',p:'M'},R11={c:'r1',p:'1'},R12={c:'r1',p:'2'};
 if(mode==='low'){
  ensureKirchhoffPath(project,'current-live-high-bypass',GP,R11,'#e53935','+24V','G1 + → R1/1','Ampermetre dönüş tarafına taşındığında yükün giriş yolu doğrudan tamamlanır.');
  removeKirchhoffPath(project,R12,GM);
  red.probeTarget=clone(R12);black.probeTarget=clone(GM);
  project.tutorialLesson.lastFeedback='✓ Yük sonrası ölçüm: beklenen ≈ +24 mA. Seri devrenin dönüş tarafında da aynı akım akar.';
 }else if(mode==='reverse'){
  removeKirchhoffPath(project,GP,R11);ensureKirchhoffPath(project,'current-live-return',R12,GM,'#111827','0V','R1/2 → G1 0 V','Yük dönüş yolu tamamlanır.');
  red.probeTarget=clone(R11);black.probeTarget=clone(GP);
  project.tutorialLesson.lastFeedback='✓ Ters prob yönü: beklenen ≈ −24 mA. Akımın büyüklüğü aynı, ölçüm yönü ters olduğu için işaret negatiftir.';
 }else{
  removeKirchhoffPath(project,GP,R11);ensureKirchhoffPath(project,'current-live-return',R12,GM,'#111827','0V','R1/2 → G1 0 V','Yük dönüş yolu tamamlanır.');
  red.probeTarget=clone(GP);black.probeTarget=clone(R11);mode='high';
  project.tutorialLesson.lastFeedback='✓ Yük öncesi ölçüm: beklenen ≈ +24 mA. A1 kaynak ile yük arasındaki seri akım yolundadır.';
 }
 root.DTSEditor?.render?.();sync(project);
}
function currentMeasurementNoteHtml(l,session,project){
 const phase=session?.phase||'demo',step=session?.step||0,feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 let current='';
 if(phase==='rebuild'&&step<l.steps.length){
  const st=l.steps[step];
  current='<section class="tutorial-currentmeasure-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><strong>'+esc(componentLabel(project,st.from))+' → '+esc(componentLabel(project,st.to))+'</strong><p>'+esc(hintOpen?st.hint:'Akım yolunun iki terminalini doğru kabloyla bağla.')+'</p>'+(hintOpen?'<div><b>Neden?</b> '+esc(st.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
 }
 if(phase==='complete')current='<section class="tutorial-currentmeasure-complete"><b>✓ Güç yolu doğru kuruldu</b><span>Şimdi A1’i yük öncesi ve yük sonrası konumlarına taşıyarak seri devrede akımın aynı olduğunu ölç.</span></section>';
 return '<div class="tutorial-currentmeasure-rich">'+
 '<header class="tutorial-coach-head tutorial-currentmeasure-head"><small>ÖĞRETİCİ · AMPERMETRE İLE AKIM ÖLÇÜMÜ</small><h2>Akımı görmek için devre yolunun içine gir</h2><p>Ayarlanabilir 24 VDC kaynak, 1 kΩ yük ve gerçek UNI‑T problarıyla doğru DCA kademesini, seri bağlantıyı ve akım yönünü uygulamalı öğren.</p></header>'+
 feedback+
 '<section class="tutorial-currentmeasure-purpose"><div><small>DERSİN AMACI</small><strong>Akımı seri ölç</strong><p>Ölçmek istediğin akımın tamamı ampermetreden geçmelidir. Bu nedenle devre yolu açılır ve A1 araya yerleştirilir.</p></div><div><small>DOĞRU KADEME</small><strong>DCA 200 mA</strong><p>Beklenen 24 mA, 20 mA sınırını aşar; kırmızı prob VΩmA, siyah prob COM girişindedir.</p></div></section>'+
 '<section class="tutorial-currentmeasure-circuit"><span>G1 +24 V</span><i>→</i><b>A1</b><i>→</i><strong>R1 · 1 kΩ</strong><i>→</i><span>G1 0 V</span><small>I = 24 / 1000 = 0,024 A = 24 mA</small></section>'+
 '<section class="tutorial-currentmeasure-parts"><article><b>G1</b><div><strong>Ayarlanabilir DC kaynak</strong><p>24 V uygular ve devrede ölçülecek akımı oluşturur.</p></div></article><article><b>R1</b><div><strong>1 kΩ dirençli yük</strong><p>Akımı yaklaşık 24 mA ile sınırlar.</p></div></article><article><b>A1</b><div><strong>UNI-T UT33D+</strong><p>DCA 200 mA kademesinde seri akımı ölçer.</p></div></article><article><b>PROB</b><div><strong>VΩmA + COM</strong><p>Akım kademesinde kırmızı VΩmA, siyah COM bağlantısı kullanılır.</p></div></article></section>'+
 '<section class="tutorial-currentmeasure-measure"><h3>Aynı seri akımı iki farklı noktada doğrula</h3><div><button type="button" data-current-preset="high"><b>1 · Yük öncesi</b><span>G1 + ↔ R1/1</span><em>≈ +24 mA</em></button><button type="button" data-current-preset="low"><b>2 · Yük sonrası</b><span>R1/2 ↔ G1 0 V</span><em>≈ +24 mA</em></button><button type="button" data-current-preset="reverse"><b>3 · Ters prob yönü</b><span>R1/1 ↔ G1 +</span><em>≈ −24 mA</em></button></div></section>'+
 '<section class="tutorial-currentmeasure-why"><div><h3>Neden seri?</h3><p>A1’in ölçtüğü akımın tamamı cihazın içinden geçmelidir. Yükün önünde veya arkasında olması ideal seri devrede sonucu değiştirmez.</p></div><div><h3>Neden paralel değil?</h3><p>Ampermetrenin iç direnci çok küçüktür. Akım ölçümü için cihaz yükün iki ucuna paralel bağlanmaz; bu derste yalnız doğru seri bağlantı oluşturulur.</p></div></section>'+
 '<section class="tutorial-currentmeasure-check"><h3>Beklenen sonuçlar</h3><ol><li>I = 24/1000 = <b>24 mA</b>.</li><li>Yük öncesi ölçüm: <b>≈ +24 mA</b>.</li><li>Yük sonrası ölçüm: <b>≈ +24 mA</b>.</li><li>Ters prob yönü: <b>≈ −24 mA</b>.</li><li>24 mA için <b>DCA 200 mA</b> seç; 20 mA kademesi yetersizdir.</li></ol></section>'+
 current+
 '<footer class="tutorial-actions tutorial-currentmeasure-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Güç yolunu kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Sonraki ölçüm dersine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function setVoltageMeasurePreset(project,mode){
 const l=lessonFor(project);if(!isVoltageMeasurementLesson(l))return;
 const red=project?.components?.find(c=>c.id==='v1-red'),black=project?.components?.find(c=>c.id==='v1-black');
 if(!red||!black){project.tutorialLesson.lastFeedback='Gerilim probları hazır değil. Önce tam devreyi gösterin.';sync(project);return}
 let targets,label,value,why;
 if(mode==='source'){targets=[{c:'g',p:'P'},{c:'g',p:'M'}];label='kaynak uçları';value='≈ +24 V';why='Kırmızı prob +24 V, siyah prob 0 V referansındadır.'}
 else if(mode==='same'){targets=[{c:'g',p:'P'},{c:'r1',p:'1'}];label='aynı elektriksel düğüm';value='≈ 0 V';why='G1/P ile R1/1 doğrudan iletkenle aynı düğümdedir; aralarında potansiyel farkı yoktur.'}
 else if(mode==='reverse'){targets=[{c:'r1',p:'2'},{c:'r1',p:'1'}];label='ters polarite';value='≈ −24 V';why='Prob yönü ters çevrilince ölçülen büyüklük korunur, işaret değişir.'}
 else{targets=[{c:'r1',p:'1'},{c:'r1',p:'2'}];label='R1 uçları';value='≈ +24 V';why='R1 doğrudan 24 V kaynağın uçlarına bağlıdır.';mode='load'}
 red.probeTarget=clone(targets[0]);black.probeTarget=clone(targets[1]);
 project.tutorialLesson.lastFeedback='✓ '+label+' seçildi: beklenen '+value+'. '+why;
 root.DTSEditor?.render?.();sync(project);
}
function voltageMeasurementNoteHtml(l,session,project){
 const phase=session?.phase||'demo',step=session?.step||0,feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 let current='';
 if(phase==='rebuild'&&step<l.steps.length){
  const st=l.steps[step];
  current='<section class="tutorial-voltage-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><strong>'+esc(componentLabel(project,st.from))+' → '+esc(componentLabel(project,st.to))+'</strong><p>'+esc(hintOpen?st.hint:'Güç yolunun iki terminalini doğru kabloyla bağla.')+'</p>'+(hintOpen?'<div><b>Neden?</b> '+esc(st.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
 }
 if(phase==='complete')current='<section class="tutorial-voltage-complete"><b>✓ Güç yolu doğru kuruldu</b><span>Şimdi probları dört ölçüm senaryosunda taşıyarak gerilim farkı ve polariteyi doğrula.</span></section>';
 return '<div class="tutorial-voltage-rich">'+
 '<header class="tutorial-coach-head tutorial-voltage-head"><small>ÖĞRETİCİ · VOLTMETRE İLE GERİLİM ÖLÇÜMÜ</small><h2>Gerilim bir noktada değil, iki nokta arasında ölçülür</h2><p>Ayarlanabilir 24 VDC kaynak, 1 kΩ yük ve gerçek UNI-T problarıyla doğru kademe seçimini, paralel bağlantıyı ve polarite işaretini uygulamalı öğren.</p></header>'+
 feedback+
 '<section class="tutorial-voltage-purpose"><div><small>DERSİN AMACI</small><strong>İki nokta arasındaki farkı ölç</strong><p>Voltmetre devrenin akım yoluna girmez; seçilen iki elektriksel noktaya paralel temas eder.</p></div><div><small>DOĞRU KADEME</small><strong>DCV 200 V</strong><p>Kaynak 24 V olduğu için DCV 20 V aralığı yetersizdir. Kırmızı prob VΩmA, siyah prob COM girişindedir.</p></div></section>'+
 '<section class="tutorial-voltage-circuit"><span>G1 +24 V</span><i>→</i><strong>R1 · 1 kΩ</strong><i>→</i><span>G1 0 V</span><small>Yük akımı: I = 24 / 1000 = 24 mA</small></section>'+
 '<section class="tutorial-voltage-parts"><article><b>G1</b><div><strong>Ayarlanabilir DC kaynak</strong><p>Ölçülecek 24 V potansiyel farkını oluşturur.</p></div></article><article><b>R1</b><div><strong>1 kΩ gerçek yük</strong><p>Kaynağın iki ucu arasında bağlıdır; ideal olarak uçlarında yaklaşık 24 V vardır.</p></div></article><article><b>V1</b><div><strong>UNI-T UT33D+</strong><p>DCV 200 V kademesinde iki nokta arasındaki gerilimi okur.</p></div></article><article><b>PROB</b><div><strong>VΩmA + COM</strong><p>Kırmızı seçilen ölçüm noktasına, siyah referans noktasına temas eder.</p></div></article></section>'+
 '<section class="tutorial-voltage-measure"><h3>Ölçmeden önce tahmin et, sonra probla doğrula</h3><div><button type="button" data-voltage-preset="load"><b>1 · R1 uçları</b><span>R1/1 ↔ R1/2</span><em>≈ +24 V</em></button><button type="button" data-voltage-preset="source"><b>2 · Kaynak uçları</b><span>G1 + ↔ G1 −</span><em>≈ +24 V</em></button><button type="button" data-voltage-preset="same"><b>3 · Aynı düğüm</b><span>G1 + ↔ R1/1</span><em>≈ 0 V</em></button><button type="button" data-voltage-preset="reverse"><b>4 · Ters polarite</b><span>R1/2 ↔ R1/1</span><em>≈ −24 V</em></button></div></section>'+
 '<section class="tutorial-voltage-why"><div><h3>Neden paralel?</h3><p>Gerilim iki nokta arasındaki potansiyel farkıdır. Voltmetre bu iki noktaya temas eder; yük akım yolunu kesmez.</p></div><div><h3>Neden işaret değişiyor?</h3><p>Multimetre kırmızı prob potansiyelinden siyah prob potansiyelini çıkarır. Prob yönü ters çevrilince sonuç negatif görünür.</p></div></section>'+
 '<section class="tutorial-voltage-check"><h3>Beklenen sonuçlar</h3><ol><li>R1 uçları: <b>≈ +24 V</b>.</li><li>Kaynak uçları: <b>≈ +24 V</b>.</li><li>Aynı elektriksel düğüm: <b>≈ 0 V</b>.</li><li>Ters polarite: <b>≈ −24 V</b>.</li><li>24 V ölçümünde <b>DCV 200 V</b> kullan; DCV 20 V sınırını aşma.</li></ol></section>'+
 current+
 '<footer class="tutorial-actions tutorial-voltage-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Güç yolunu kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Sonraki ölçüm dersine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function kirchhoffPathMatches(w,a,b){
 const same=(x,y)=>x?.c===y.c&&x?.p===y.p;
 return (same(w.from,a)&&same(w.to,b))||(same(w.from,b)&&same(w.to,a));
}
function removeKirchhoffPath(project,a,b){project.wires=(project.wires||[]).filter(w=>!kirchhoffPathMatches(w,a,b))}
function ensureKirchhoffPath(project,id,a,b,color='#e53935',role='KCL',hint='Kirchhoff ölçüm yolu',why='Ölçüm cihazının taşındığı konuma göre devrenin fiziksel akım yolu tamamlanır.'){
 if((project.wires||[]).some(w=>kirchhoffPathMatches(w,a,b)))return;
 project.wires.push({id,from:clone(a),to:clone(b),color,role,size:'1.5',points:[],tutorialHint:hint,tutorialWhy:why});
}
function setKirchhoffCurrentTarget(project,mode){
 const l=lessonFor(project);if(!isKirchhoffControlLesson(l))return;root.DTSEditor?.stop?.();
 const red=project?.components?.find(c=>c.id==='a1-red'),black=project?.components?.find(c=>c.id==='a1-black');
 if(!red||!black){project.tutorialLesson.lastFeedback='Akım probları hazır değil. Önce tam devreyi gösterin.';sync(project);return}
 const GP={c:'g',p:'P'},R11={c:'r1',p:'1'},R12={c:'r1',p:'2'},R21={c:'r2',p:'1'},R31={c:'r3',p:'1'};
 const sourceId='kirchhoff-live-source-direct',r2Id='kirchhoff-live-r2-direct',r3Id='kirchhoff-live-r3-direct';
 if(mode==='r2'){
  ensureKirchhoffPath(project,sourceId,GP,R11,'#e53935','KCL+','G1 + → R1/1','A1 toplam yolundan çıkarıldığında kaynak R1’e doğrudan bağlanır.');
  removeKirchhoffPath(project,R12,R21);ensureKirchhoffPath(project,r3Id,R12,R31,'#e53935','BRANCH');
  red.probeTarget=clone(R12);black.probeTarget=clone(R21);
 }else if(mode==='r3'){
  ensureKirchhoffPath(project,sourceId,GP,R11,'#e53935','KCL+','G1 + → R1/1','A1 toplam yolundan çıkarıldığında kaynak R1’e doğrudan bağlanır.');
  ensureKirchhoffPath(project,r2Id,R12,R21,'#e53935','BRANCH');removeKirchhoffPath(project,R12,R31);
  red.probeTarget=clone(R12);black.probeTarget=clone(R31);
 }else{
  removeKirchhoffPath(project,GP,R11);ensureKirchhoffPath(project,r2Id,R12,R21,'#e53935','BRANCH');ensureKirchhoffPath(project,r3Id,R12,R31,'#e53935','BRANCH');
  red.probeTarget=clone(GP);black.probeTarget=clone(R11);mode='total';
 }
 project.tutorialLesson.lastFeedback='✓ A1 '+(mode==='r2'?'R2 koluna taşındı: beklenen ≈62,07 mA.':mode==='r3'?'R3 koluna taşındı: beklenen ≈41,38 mA.':'toplam akım konumunda: beklenen ≈103,45 mA.');
 root.DTSEditor?.render?.();sync(project);
}
function setKirchhoffVoltageTarget(project,mode){
 const l=lessonFor(project);if(!isKirchhoffControlLesson(l))return;
 const red=project?.components?.find(c=>c.id==='v1-red'),black=project?.components?.find(c=>c.id==='v1-black');
 if(!red||!black){project.tutorialLesson.lastFeedback='Gerilim probları hazır değil. Önce tam devreyi gösterin.';sync(project);return}
 let targets,label,value;
 if(mode==='parallel'){targets=[{c:'r1',p:'2'},{c:'g',p:'M'}];label='paralel bölüm';value='≈13,66 V'}
 else if(mode==='source'){targets=[{c:'g',p:'P'},{c:'g',p:'M'}];label='kaynak';value='≈24 V'}
 else{targets=[{c:'r1',p:'1'},{c:'r1',p:'2'}];label='R1';value='≈10,34 V';mode='r1'}
 red.probeTarget=clone(targets[0]);black.probeTarget=clone(targets[1]);
 project.tutorialLesson.lastFeedback='✓ V1 '+label+' ölçümünde: beklenen '+value+'.';
 root.DTSEditor?.render?.();sync(project);
}
function kirchhoffControlNoteHtml(l,session,project){
 const phase=session?.phase||'demo',step=session?.step||0,feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 let current='';
 if(phase==='rebuild'&&step<l.steps.length){
  const st=l.steps[step];
  current='<section class="tutorial-kirchhoff-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><strong>'+esc(componentLabel(project,st.from))+' → '+esc(componentLabel(project,st.to))+'</strong><p>'+esc(hintOpen?st.hint:'Yanıp sönen iki terminali doğru kabloyla bağla.')+'</p>'+(hintOpen?'<div><b>Neden?</b> '+esc(st.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
 }
 if(phase==='complete')current='<section class="tutorial-kirchhoff-complete"><b>✓ Kirchhoff kontrol devresi doğru kuruldu</b><span>Şimdi A1 ve V1 ölçüm konumlarını değiştirerek KCL ve KVL eşitliklerini doğrula.</span></section>';
 return '<div class="tutorial-kirchhoff-rich">'+
 '<header class="tutorial-coach-head tutorial-kirchhoff-head"><small>ÖĞRETİCİ · TEMEL ELEKTRİK 10 · KIRCHHOFF KANUNLARIYLA DEVRE KONTROLÜ</small><h2>Düğümde akımı, çevrede gerilimi denetle</h2><p>Aynı R1 + (R2 || R3) devresinde tek akım ölçeri ve tek voltmetreyi farklı noktalara taşıyarak iki Kirchhoff kanununu gerçek ölçüm mantığıyla doğrula.</p></header>'+
 feedback+
 '<section class="tutorial-kirchhoff-purpose"><div><small>KCL · AKIM KANUNU</small><strong>Giren akım = çıkan akımlar</strong><p>R1 sonrası düğümde toplam akım R2 ve R3 kollarına ayrılır. Itoplam ≈ I2 + I3 olmalıdır.</p></div><div><small>KVL · GERİLİM KANUNU</small><strong>Çevre toplamı = 0</strong><p>24 V kaynak yükselmesi, R1 ve paralel bölümdeki gerilim düşümleriyle dengelenir.</p></div></section>'+
 '<section class="tutorial-kirchhoff-map"><span>G1 · 24 V</span><i>→</i><b>R1 · 100 Ω</b><i>→</i><div><strong>R2 · 220 Ω</strong><strong>R3 · 330 Ω</strong></div><i>→</i><span>0 V</span></section>'+
 '<section class="tutorial-kirchhoff-equations"><article><small>KCL KONTROLÜ</small><strong>103,45 ≈ 62,07 + 41,38 mA</strong><p>ΣI = 0</p></article><article><small>KVL KONTROLÜ</small><strong>24 ≈ 10,34 + 13,66 V</strong><p>ΣV = 0</p></article></section>'+
 '<section class="tutorial-kirchhoff-measure"><h3>1 · A1 ile akımları sırayla ölç</h3><p>Aynı ampermetreyi taşı. Böylece üç büyük ampermetreyi aynı anda kullanmadan KCL’yi fiziksel olarak doğrularsın.</p><div><button type="button" data-kirchhoff-current="total"><b>Toplam akım</b><span>Kaynak → R1 öncesi</span><em>≈103,45 mA</em></button><button type="button" data-kirchhoff-current="r2"><b>R2 kolu</b><span>Düğüm → R2</span><em>≈62,07 mA</em></button><button type="button" data-kirchhoff-current="r3"><b>R3 kolu</b><span>Düğüm → R3</span><em>≈41,38 mA</em></button></div></section>'+
 '<section class="tutorial-kirchhoff-measure voltage"><h3>2 · V1 ile çevre gerilimlerini ölç</h3><p>Voltmetreyi üç noktaya taşı; gerilim yükselmesi ile düşümlerin aynı çevrede nasıl dengelendiğini gör.</p><div><button type="button" data-kirchhoff-voltage="r1"><b>R1 gerilimi</b><span>R1/1 ↔ R1/2</span><em>≈10,34 V</em></button><button type="button" data-kirchhoff-voltage="parallel"><b>Paralel bölüm</b><span>Düğüm ↔ 0 V</span><em>≈13,66 V</em></button><button type="button" data-kirchhoff-voltage="source"><b>Kaynak</b><span>G1 + ↔ G1 −</span><em>≈24 V</em></button></div></section>'+
 '<section class="tutorial-kirchhoff-why"><div><h3>A1 neden seri?</h3><p>Ölçmek istediğin akımın tamamı ölçü aletinin içinden geçmelidir. Bu yüzden A1 seçilen akım yolunu açıp araya girer.</p></div><div><h3>V1 neden paralel?</h3><p>Gerilim iki nokta arasındaki potansiyel farkıdır. V1 seçilen elemanın ya da bölümün iki ucuna temas eder.</p></div></section>'+
 '<section class="tutorial-kirchhoff-check"><h3>Son kontrol</h3><ol><li><b>KCL:</b> 62,07 + 41,38 ≈ 103,45 mA.</li><li><b>KVL:</b> 10,34 + 13,66 ≈ 24 V.</li><li>Ölçüm cihazının küçük iç direnci nedeniyle simülasyonda çok küçük farklar oluşursa teorik ideal değerlerle birlikte yorumla.</li></ol></section>'+
 current+
 '<footer class="tutorial-actions tutorial-kirchhoff-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Devreyi kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function setMixedVoltageTarget(project,mode){
 const l=lessonFor(project);if(!isMixedAnalysisLesson(l))return;
 const parallel=mode==='parallel',targets=parallel?[{c:'r2',p:'1'},{c:'r2',p:'2'}]:[{c:'r1',p:'1'},{c:'r1',p:'2'}];
 const redProbe=project?.components?.find(c=>c.id==='v1-red'),blackProbe=project?.components?.find(c=>c.id==='v1-black');
 if(redProbe&&blackProbe){redProbe.probeTarget=clone(targets[0]);blackProbe.probeTarget=clone(targets[1])}
 else{
  const red=project?.wires?.find(w=>(w.from?.c==='v1'&&w.from?.p==='V')||(w.to?.c==='v1'&&w.to?.p==='V'));
  const black=project?.wires?.find(w=>(w.from?.c==='v1'&&w.from?.p==='COM')||(w.to?.c==='v1'&&w.to?.p==='COM'));
  if(!red||!black){project.tutorialLesson.lastFeedback='Ölçüm bağlantısı yeniden kurma aşamasında. Önce tam devreyi gösterin veya bağlantıları tamamlayın.';sync(project);return}
  const setOther=(w,ep)=>{if(w.from?.c==='v1')w.to=clone(ep);else w.from=clone(ep)};setOther(red,targets[0]);setOther(black,targets[1]);
 }
 project.tutorialLesson.lastFeedback='✓ '+(parallel?'R2||R3 paralel grubu':'R1 seri bölümü')+' seçildi: ideal ölçüm '+(parallel?'≈13,66 V':'≈10,34 V')+'.';
 root.DTSEditor?.render?.();sync(project);
}
function mixedAnalysisNoteHtml(l,session,project){
 const phase=session?.phase||'demo',step=session?.step||0,feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 let current='';
 if(phase==='rebuild'&&step<l.steps.length){
  const st=l.steps[step];
  current='<section class="tutorial-mixed-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><strong>'+esc(componentLabel(project,st.from))+' → '+esc(componentLabel(project,st.to))+'</strong><p>'+esc(hintOpen?st.hint:'Yanıp sönen iki terminali doğru kabloyla bağla.')+'</p>'+(hintOpen?'<div><b>Neden?</b> '+esc(st.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
 }
 if(phase==='complete')current='<section class="tutorial-mixed-complete"><b>✓ Karışık devre doğru kuruldu</b><span>Şimdi 103,45 mA toplam akımı ve 10,34 V + 13,66 V ≈ 24 V gerilim paylaşımını ölçerek doğrula.</span></section>';
 return '<div class="tutorial-mixed-rich">'+
 '<header class="tutorial-coach-head tutorial-mixed-head"><small>ÖĞRETİCİ · TEMEL ELEKTRİK 9 · KARIŞIK DEVRE ANALİZİ</small><h2>Önce paraleli sadeleştir, sonra seri devre gibi çöz</h2><p>Bu sayfada amaç formülü ezberlemek değil; R1 + (R2 || R3) yapısını parçalara ayırıp tekrar birleştirerek akım ve gerilimlerin nereden geldiğini görmek.</p></header>'+
 feedback+
 '<section class="tutorial-mixed-purpose"><div><small>DERSİN AMACI</small><strong>Seri + paralel yapıyı ayır</strong><p>R1 toplam akımın geçtiği seri bölümdür. R2 ve R3 ise R1’den sonraki aynı iki düğüme bağlı paralel kollardır.</p></div><div><small>ANA YÖNTEM</small><strong>Parçala → çöz → geri aç</strong><p>Önce R2||R3 eşdeğerini bul, R1 ile topla, toplam akımı hesapla; sonra paralel kollara geri dön.</p></div></section>'+
 '<section class="tutorial-mixed-structure"><div><span>G1 +</span><i>→</i><b>A1</b><i>→</i><strong>R1 · 100 Ω</strong><i>→</i><div><em>R2 · 220 Ω</em><em>R3 · 330 Ω</em></div><i>→</i><span>G1 −</span></div><small>Yapı: R1 + (R2 || R3)</small></section>'+
 '<section class="tutorial-mixed-steps"><article><b>1</b><div><small>PARALELİ ÇÖZ</small><strong>R2 || R3 = 132 Ω</strong><p>(220×330)/(220+330)</p></div></article><article><b>2</b><div><small>SERİ TOPLAMI BUL</small><strong>Rtoplam = 232 Ω</strong><p>100 + 132</p></div></article><article><b>3</b><div><small>TOPLAM AKIM</small><strong>It ≈ 103,45 mA</strong><p>24 / 232</p></div></article><article><b>4</b><div><small>GERİLİMİ PAYLAŞTIR</small><strong>10,34 V + 13,66 V</strong><p>≈ 24 V</p></div></article></section>'+
 '<section class="tutorial-mixed-results"><div><small>VR1</small><strong>≈10,34 V</strong><span>It × 100 Ω</span></div><div><small>VPARALEL</small><strong>≈13,66 V</strong><span>24 − VR1</span></div><div><small>I2 · 220 Ω</small><strong>≈62,07 mA</strong><span>13,66 / 220</span></div><div><small>I3 · 330 Ω</small><strong>≈41,38 mA</strong><span>13,66 / 330</span></div></section>'+
 '<section class="tutorial-mixed-section"><h3>Hangi eleman ne yapıyor?</h3><div class="tutorial-mixed-parts"><article><b>G1</b><strong>Ayarlanabilir DC kaynak</strong><p>Karışık devreye 24 V sağlar.</p></article><article><b>A1</b><strong>Toplam akım</strong><p>R1’den önce seri bağlıdır; yaklaşık 103,45 mA ölçer.</p></article><article><b>R1</b><strong>Seri direnç</strong><p>Toplam akımın tamamı üzerinden geçer; yaklaşık 10,34 V düşürür.</p></article><article><b>R2/R3</b><strong>Paralel kollar</strong><p>Aynı 13,66 V gerilimi paylaşır fakat farklı akım çeker.</p></article></div></section>'+
 '<section class="tutorial-mixed-measure"><h3>V1 ile iki bölümü karşılaştır</h3><p>Tek voltmetreyi iki ölçüm arasında geçir; böylece ekrandaki büyük ölçü aleti kalabalığı azalırken aynı fiziksel sonuç doğrulanır.</p><div><button type="button" data-mixed-voltage="r1"><b>R1 gerilimini ölç</b><span>R1/1 ↔ R1/2</span><em>≈10,34 V</em></button><button type="button" data-mixed-voltage="parallel"><b>Paralel grup gerilimini ölç</b><span>R2/R3 ortak düğümleri</span><em>≈13,66 V</em></button></div></section>'+
 '<section class="tutorial-mixed-checks"><div><h3>Akım kontrolü</h3><strong>62,07 + 41,38 ≈ 103,45 mA</strong><p>Düğümde ayrılan kol akımları tekrar birleşince A1’in ölçtüğü toplam akımı verir.</p></div><div><h3>Gerilim kontrolü</h3><strong>10,34 + 13,66 ≈ 24 V</strong><p>Seri bölüm ile paralel grubun gerilim düşümleri kaynak gerilimini tamamlar.</p></div></section>'+
 current+
 '<footer class="tutorial-actions tutorial-mixed-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Devreyi kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Kirchhoff analizine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

function setParallelVoltageTarget(project,mode){
 const l=lessonFor(project);if(!isParallelAnalysisLesson(l))return;
 const red=project?.wires?.find(w=>(w.from?.c==='v1'&&w.from?.p==='V')||(w.to?.c==='v1'&&w.to?.p==='V'));
 const black=project?.wires?.find(w=>(w.from?.c==='v1'&&w.from?.p==='COM')||(w.to?.c==='v1'&&w.to?.p==='COM'));
 if(!red||!black){project.tutorialLesson.lastFeedback='Ölçüm bağlantısı yeniden kurma aşamasında. Önce tam devreyi gösterin veya bağlantıları tamamlayın.';sync(project);return}
 const targets=mode==='r2'?[{c:'r2',p:'1'},{c:'r2',p:'2'}]:mode==='source'?[{c:'g',p:'P'},{c:'g',p:'M'}]:[{c:'r1',p:'1'},{c:'r1',p:'2'}];
 const setOther=(w,ep)=>{if(w.from?.c==='v1')w.to=clone(ep);else w.from=clone(ep)};
 setOther(red,targets[0]);setOther(black,targets[1]);
 project.tutorialLesson.lastFeedback='✓ '+(mode==='r2'?'R2 kolu':mode==='source'?'Kaynak uçları':'R1 kolu')+' seçildi: ideal ölçüm yaklaşık 24 V.';
 root.DTSEditor?.render?.();sync(project);
}
function parallelAnalysisNoteHtml(l,session,project){
 const phase=session?.phase||'demo',step=session?.step||0,feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 let current='';
 if(phase==='rebuild'&&step<l.steps.length){
  const st=l.steps[step];
  current='<section class="tutorial-parallel-analysis-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><strong>'+esc(componentLabel(project,st.from))+' → '+esc(componentLabel(project,st.to))+'</strong><p>'+esc(hintOpen?st.hint:'Yanıp sönen iki terminali doğru kabloyla bağla.')+'</p>'+(hintOpen?'<div><b>Neden?</b> '+esc(st.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
 }
 if(phase==='complete')current='<section class="tutorial-parallel-analysis-complete"><b>✓ Paralel devre doğru kuruldu</b><span>Simülasyonda Itoplam≈349 mA ve iki kol geriliminin de yaklaşık 24 V olduğunu doğrula.</span></section>';
 return '<div class="tutorial-parallel-analysis-rich">'+
 '<header class="tutorial-coach-head tutorial-parallel-analysis-head"><small>ÖĞRETİCİ · TEMEL ELEKTRİK 8 · PARALEL DEVRE ANALİZİ</small><h2>Gerilim aynı kalır, akım kollara bölünür</h2><p>Ayarlanabilir 24 VDC kaynak, iki paralel direnç kolu ve iki UNI‑T ölçümüyle paralel devrenin temel kurallarını tek ekranda doğrula.</p></header>'+
 feedback+
 '<section class="tutorial-parallel-analysis-purpose"><div><small>DERSİN AMACI</small><strong>Aynı iki düğüm = aynı gerilim</strong><p>R1 ve R2 aynı pozitif ve negatif düğümlere bağlıdır; bu yüzden iki kolun uç gerilimi de kaynak gerilimine eşittir.</p></div><div><small>ANA SONUÇ</small><strong>Toplam akım kollara ayrılır</strong><p>A1 dallanma öncesi toplam akımı ölçer: Itoplam = I1 + I2.</p></div></section>'+
 '<section class="tutorial-parallel-analysis-flow"><span>G1 +</span><i>→</i><b>A1 · Itoplam</b><i>→</i><div><strong>R1 · 100 Ω</strong><strong>R2 · 220 Ω</strong></div><i>→</i><span>G1 −</span></section>'+
 '<section class="tutorial-parallel-analysis-results"><div><small>EŞDEĞER DİRENÇ</small><strong>68,75 Ω</strong><span>(100×220)/(100+220)</span></div><div><small>R1 AKIMI</small><strong>240 mA</strong><span>24 / 100</span></div><div><small>R2 AKIMI</small><strong>≈109 mA</strong><span>24 / 220</span></div><div><small>TOPLAM AKIM</small><strong>≈349 mA</strong><span>240 + 109</span></div></section>'+
 '<section class="tutorial-parallel-analysis-section"><h3>Hangi eleman ne yapıyor?</h3><div class="tutorial-parallel-analysis-parts"><article><b>G1</b><strong>Ayarlanabilir DC kaynak</strong><p>24 V uygular; her paralel kola aynı potansiyel farkını sağlar.</p></article><article><b>A1</b><strong>Toplam akım ölçümü</strong><p>Dallanma öncesinde seri bulunur. Yaklaşık 349 mA için DCA 10 A / 10A girişi kullanılır.</p></article><article><b>R1 / R2</b><strong>Paralel yük kolları</strong><p>R1 240 mA, R2 yaklaşık 109 mA çeker; kol akımları direnç değerine göre farklıdır.</p></article><article><b>V1</b><strong>Gerilim ölçümü</strong><p>Ölçülecek kolun iki ucuna paralel bağlanır. 24 V için DCV 200 V kademesindedir.</p></article></div></section>'+
 '<section class="tutorial-parallel-analysis-measure"><h3>V1 ile paralel gerilimi kanıtla</h3><p>Üç farklı yere ölçüm yap. İdeal durumda hepsinde yaklaşık aynı 24 V değerini görmelisin.</p><div><button type="button" data-parallel-voltage="r1"><b>R1’i ölç</b><span>R1/1 ↔ R1/2</span><em>≈ 24 V</em></button><button type="button" data-parallel-voltage="r2"><b>R2’yi ölç</b><span>R2/1 ↔ R2/2</span><em>≈ 24 V</em></button><button type="button" data-parallel-voltage="source"><b>Kaynağı ölç</b><span>G1 + ↔ G1 −</span><em>≈ 24 V</em></button></div></section>'+
 '<section class="tutorial-parallel-analysis-why"><div><h3>Neden A1 seri?</h3><p>Kaynak akımının tamamı kollara ayrılmadan önce A1’den geçer. Bu yüzden A1 toplam akımı görür.</p></div><div><h3>Neden V1 paralel?</h3><p>Gerilim iki düğüm arasındaki farktır. V1 akım yoluna girmez; seçilen kolun iki ucuna temas eder.</p></div></section>'+
 '<section class="tutorial-parallel-analysis-check"><h3>Beklenen sonucu kontrol et</h3><ol><li>VR1 = VR2 = Vkaynak ≈ <b>24 V</b>.</li><li>I1 = 24/100 = <b>240 mA</b>.</li><li>I2 = 24/220 ≈ <b>109 mA</b>.</li><li>Itoplam = 240 + 109 ≈ <b>349 mA</b>.</li><li>Req = 24 / 0,349 ≈ <b>68,75 Ω</b>; paralel eşdeğer direnç en küçük kol direncinden küçüktür.</li></ol></section>'+
 current+
 '<footer class="tutorial-actions tutorial-parallel-analysis-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Devreyi kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Karışık devre analizine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}
function seriesAnalysisNoteHtml(l,session,project){
 const phase=session?.phase||'demo',step=session?.step||0;
 const feedback=session?.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'';
 let current='';
 if(phase==='rebuild'&&step<l.steps.length){
  const st=l.steps[step];
  current='<section class="tutorial-series-current"><small>ŞİMDİ SEN BAĞLA · '+(step+1)+' / '+l.steps.length+'</small><strong>'+esc(componentLabel(project,st.from))+' → '+esc(componentLabel(project,st.to))+'</strong><p>'+esc(hintOpen?st.hint:'Yanıp sönen iki terminali doğru kabloyla bağla.')+'</p>'+(hintOpen?'<div><b>Neden?</b> '+esc(st.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'Neden? / İpucu')+'</button></section>';
 }
 if(phase==='complete')current='<section class="tutorial-series-complete"><b>✓ Seri devre doğru kuruldu</b><span>Şimdi simülasyonu çalıştır; A1 ≈ 75 mA, R1 ≈ 7,5 V ve R2 ≈ 16,5 V ilişkisini doğrula.</span></section>';
 return '<div class="tutorial-series-rich">'+
 '<header class="tutorial-coach-head tutorial-series-head"><small>ÖĞRETİCİ · TEMEL ELEKTRİK 7 · SERİ DEVRE ANALİZİ</small><h2>Tek akım yolunu gör, gerilim paylaşımını ölç</h2><p>Ayarlanabilir 24 VDC kaynak, A1 ampermetre, R1=100 Ω ve R2=220 Ω ile seri devrenin üç temel kuralını aynı ekranda doğrula.</p></header>'+
 feedback+
 '<section class="tutorial-series-purpose"><div><small>DERSİN AMACI</small><strong>Seri devrede akım aynıdır</strong><p>Dallanma olmadığı için G1 → A1 → R1 → R2 → G1 dönüş yolundaki akım bütün elemanlardan aynı değerde geçer.</p></div><div><small>ANA SONUÇ</small><strong>Gerilim paylaşılır</strong><p>Dirençler üzerindeki gerilim düşümleri toplanınca kaynak gerilimini verir.</p></div></section>'+
 '<section class="tutorial-series-results"><div><small>TOPLAM DİRENÇ</small><strong>320 Ω</strong><span>100 Ω + 220 Ω</span></div><div><small>DEVRE AKIMI</small><strong>75 mA</strong><span>24 V / 320 Ω</span></div><div><small>R1 GERİLİMİ</small><strong>7,5 V</strong><span>0,075 × 100</span></div><div><small>R2 GERİLİMİ</small><strong>16,5 V</strong><span>0,075 × 220</span></div></section>'+
 '<section class="tutorial-series-section"><h3>Hangi eleman ne yapıyor?</h3><div class="tutorial-series-parts"><article><b>G1</b><strong>Ayarlanabilir DC kaynak</strong><p>24 VDC enerji sağlar. Bu sayfada sabit sembol yerine ayarlı masa kaynağı kullanılır.</p></article><article><b>A1</b><strong>UNI‑T ampermetre</strong><p>Akımı ölçmek için devre yolunun içine, yani seri bağlanır.</p></article><article><b>R1 + R2</b><strong>Seri dirençler</strong><p>Toplam direnç 320 Ω’dur. Aynı 75 mA akımı paylaşırlar.</p></article><article><b>V1</b><strong>UNI‑T voltmetre</strong><p>R1’in iki ucuna paralel bağlanır ve yaklaşık 7,5 V ölçer.</p></article></div></section>'+
 '<section class="tutorial-series-measure"><h3>Ölçüm nasıl ve neden yapılıyor?</h3><div><article><strong>A1 · SERİ</strong><p>Akım ölçmek için devre yolu açılır ve ölçü aleti araya girer. Ölçülen akımın tamamı A1’den geçmelidir.</p></article><article><strong>V1 · PARALEL</strong><p>Gerilim iki nokta arasındaki farktır. V1, R1’in iki ucuna bağlanır; ana akım yolunu kesmez.</p></article></div></section>'+
 '<section class="tutorial-series-check"><h3>Beklenen sonucu kontrol et</h3><ol><li>Rtoplam = 100 + 220 = <b>320 Ω</b>.</li><li>I = 24 / 320 = <b>0,075 A = 75 mA</b>.</li><li>VR1 = 75 mA × 100 Ω = <b>7,5 V</b>.</li><li>VR2 = 75 mA × 220 Ω = <b>16,5 V</b>.</li><li><b>7,5 V + 16,5 V = 24 V</b>; aynı 75 mA akım R1 ve R2’den geçer.</li></ol></section>'+
 current+
 '<footer class="tutorial-actions tutorial-series-actions">'+
 (phase==='demo'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="rebuild">↻ Devreyi kendin kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?'<button class="primary" type="button" data-tutorial-action="simulate">▶ Ölçerek doğrula</button><button type="button" data-tutorial-action="restart">Tekrar kur</button>':'')+
 '<button type="button" data-tutorial-action="next">Paralel devre analizine geç →</button><button type="button" data-tutorial-action="home">Konu listesine dön</button></footer></div>';
}

const MQ07_TOPOLOGY_REVIEW_REASONS=Object.freeze({
 NO_WIRED_CIRCUIT:'Bu dersin doğrulanmış bir işlevsel kablolu deneyi yok; mevcut görseller yalnız kavram veya referans olabilir.',
 NO_RC_TIMING_EVIDENCE:'Devrede RC zamanlama ağı bulunmuyor; gecikmeli açma veya bırakma davranışı bu şemayla doğrulanamaz.',
 TITLE_MISSING_REQUIRED_PART:'Ders piezo sensörü anlatıyor, fakat mevcut şemada endüktif yakınlık sensörü kullanılıyor; piezo işlevi doğrulanmış değildir.',
 MISSING_DIMMER_POWER_STAGE:'LDR karşılaştırıcısı var, fakat dimmer güç ve anahtarlama katı yok; gerçek ışık kısma işlevi doğrulanmış değildir.'
});
function topologyReviewNotice(l){
 const issue=l?.pedagogyReview?.titleTopologyIssue;if(!issue)return '';
 const protectedConcept=issue==='NO_WIRED_CIRCUIT'&&L?.mq07Batch200?.noWireTriage?.conceptPreservedIds?.includes(l.id);
 const message=protectedConcept?'Bu sayfa korunmuş bir kavramsal/quiz dersidir; kablolu uygulama bulunmaması tek başına bozuk devre anlamına gelmez. Sanal deney veya fiziksel uygulama kabulü yapılmamıştır.':MQ07_TOPOLOGY_REVIEW_REASONS[issue]||'Bu dersin kaynak devresi ve başlık/topoloji eşleşmesi incelemede.';
 return '<div class="tutorial-feedback warn tutorial-review-warning" role="status"><strong>DEVRE İNCELEMEDE · '+esc(issue)+'</strong><p>'+esc(message)+'</p><p>Bu model, doğrulanmış fiziksel devre veya tamamlanmış simülasyon kabulü değildir.</p></div>';
}

function isPiezoVirtualLesson(l){return l?.id==='sensor-analog-apps-src-08'&&l?.pedagogyReview?.piezoVirtualSource==='TWO_TERMINAL_PASSIVE_TRANSIENT_EMF'}
function piezoVirtualPanel(l,session,project){
 const pz=project?.components?.find(c=>c.id==='pz'),mv=Number(pz?._piezoMv)||0;
 return '<section class="tutorial-piezo-virtual"><h3>Piezo · sanal darbe ve sönüm deneyi</h3>'+
 '<p>B1/+ ve B1/− elektrotlarında oluşan geçici küçük gerilimi UT33D+ DCV 200 mV kademesinde izle. Gösterim üretici ölçümü veya gerçek fiziksel cihaz kabulü değildir.</p>'+
 '<div class="tutorial-piezo-observation"><strong>Model: '+esc(mv.toFixed(3))+' mV</strong><small>Eğitim eşdeğeri · kısa süreli EMK</small></div>'+
 '<div class="tutorial-piezo-controls"><button type="button" data-piezo-sample="0">Sanal darbe uygula</button>'+
 '<button type="button" data-piezo-sample="150">150 ms sonra ölç</button>'+
 '<button type="button" data-piezo-sample="1000">1000 ms sonra ölç</button></div></section>';
}
function setPiezoVirtualSample(project,value){
 const lesson=lessonFor(project),sensor=project?.components?.find(c=>c.id==='pz'),now=Number(value);
 if(!isPiezoVirtualLesson(lesson)||!sensor||![0,150,1000].includes(now))return false;
 if(now===0)sensor.piezoTapAt=0;
 if(typeof sensor.piezoTapAt!=='number'){project.tutorialLesson.lastFeedback='Önce sanal darbeyi uygula.';sync(project);return false}
 const defs=root.DTSEditor?.byId,solver=root.CCSSimulation?.solve;
 if(typeof solver!=='function'||!defs){project.tutorialLesson.lastFeedback='Native solver hazır değil; ölçüm doğrulanamadı.';sync(project);return false}
 const r=solver(project,defs,{now});
 if(!r?.stable||r.blocked||r.shortCircuit||r.oscillating){project.tutorialLesson.lastFeedback='Piezo çözümü kararlı değil; inceleme gerekiyor.';sync(project);return false}
 project.tutorialLesson.lastFeedback=now+' ms: sanal piezo gerilimi '+(Number(sensor._piezoMv)||0).toFixed(3)+' mV. Üretici verisi değildir.';
 root.DTSEditor?.render?.();sync(project);return true;
}
function isRcTimingLesson(l){return !!l?.pedagogyReview?.mq07RcTiming&&['electronic-switching-src-06','electronic-switching-src-07'].includes(l.id)}
function rcTimingPanel(l,session,project){
 const cap=project?.components?.find(c=>c.id==='c1'),transistor=project?.components?.find(c=>c.id==='q1'),
  v1=project?.components?.find(c=>c.id==='v1'),status=session?.rcPhase||'idle';
 return '<section class="tutorial-rc-timing"><h3>Sanal RC · bas / tut / bırak</h3>'+
  '<p>Gerçek simülasyon motorunda C1 gerilimini, Q1 BD139 eşik durumunu ve UT33D+ ölçümünü adım adım karşılaştır.</p>'+
  '<div class="tutorial-rc-readout"><strong>C1 = '+esc((Number(cap?._capacitorVoltage)||0).toFixed(3))+' V</strong>'+
  '<strong>Q1 = '+(transistor?._active?'ON':'OFF')+'</strong>'+
  '<strong>V1 = '+esc(v1?._meter?.display||'Henüz ölçülmedi')+' '+esc(v1?._meter?.unit||'')+'</strong></div>'+
  '<p>Faz: '+esc(status)+' · örnekleme: 250 ms · süre: '+esc((session?.rcTime??0)/1000)+' s</p>'+
  '<div class="tutorial-rc-controls">'+
  '<button type="button" data-rc-action="reset">Sıfırla</button>'+
  '<button type="button" data-rc-action="press">S1 bas / 2 sn tut</button>'+
  '<button type="button" data-rc-action="release">S1 bırak / süreyi izle</button></div>'+
  '<small>Bu öğretici sanal modeldir; üretici test sertifikası veya fiziksel devre kurma yönergesi değildir.</small></section>';
}
function setRcTimingPhase(project,action){
 const l=lessonFor(project),session=project?.tutorialLesson,
  button=project?.components?.find(c=>c.id==='s1'),cap=project?.components?.find(c=>c.id==='c1');
 if(!isRcTimingLesson(l)||!session||!button||!cap||!['reset','press','release'].includes(action))return false;
 const solve=root.CCSSimulation?.solve,defs=root.DTSEditor?.byId;
 if(typeof solve!=='function'||!defs){session.lastFeedback='Özgün elektriksel solver hazır değil; sonuç doğrulanmadı.';sync(project);return false}
 if(action==='press'&&session.rcPhase!=='idle'){session.lastFeedback='Önce Sıfırla komutunu kullan.';sync(project);return false}
 if(action==='release'&&session.rcPhase!=='pressed'){session.lastFeedback='Önce S1 bas / 2 sn tut komutunu çalıştır.';sync(project);return false}
 if(action==='reset'){button.state=false;cap._capacitorVoltage=0;delete cap._reactiveNow;
   session.rcTime=0;session.rcPhase='idle';}
 else button.state=action==='press';
 const start=action==='reset'?0:Number(session.rcTime??0)+250,
  stop=action==='reset'?0:action==='press'?2000:l.pedagogyReview.mq07RcTiming.mode==='on'?7500:4000;
 let stable=true,steps=0,firstTransition=null,previous=!!project.components.find(c=>c.id==='q1')?._active;
 for(let t=start;t<=stop;t+=action==='reset'?1:250){
  const result=solve(project,defs,{now:t}),q=project.components.find(c=>c.id==='q1');
  if(!result?.stable||result.blocked||result.shortCircuit||result.oscillating){stable=false;break}
  if(firstTransition===null&&!!q?._active!==previous)firstTransition=t;
  previous=!!q?._active;steps++;session.rcTime=t;
 }
 if(!stable){session.lastFeedback='RC transient çözücü kararlı değil: inceleme açık.';sync(project);return false}
 if(action!=='reset')session.rcPhase=action==='press'?'pressed':'released';
 const q=project.components.find(c=>c.id==='q1'),meter=project.components.find(c=>c.id==='v1');
 session.lastFeedback='✓ RC '+action+' · '+steps+' çözüm · C1 '+(Number(cap._capacitorVoltage)||0).toFixed(3)+' V · Q1 '+(q?._active?'ON':'OFF')+
  ' · V1 '+(meter?._meter?.display||'—')+' '+(meter?._meter?.unit||'V')+
  (firstTransition===null?'':' · ilk durum değişimi '+firstTransition+' ms');
 root.DTSEditor?.render?.();sync(project);return true;
}
function isLdrVirtualDimmerLesson(l){return l?.id==='sensor-analog-apps-src-11'&&!!l?.pedagogyReview?.ldrVirtualDimmer}
function ldrDimmerPanel(l,session,project){
 const sensor=project?.components?.find(c=>c.id==='s1'),q=project?.components?.find(c=>c.id==='q1'),
  lamp=project?.components?.find(c=>c.id==='h1'),lux=Number(sensor?.illuminationLux??10);
 const pct=Number(lamp?._dimmerBrightnessPct)||0,power=Number(lamp?._dimmerPowerW)||0;
 return '<section class="tutorial-ldr-virtual"><h3>LDR · DC sanal karartma</h3>'+
 '<p>GL5528 LDR kontrol düğümünü sürer; Q1/G–D–S sanal lineer güç katı H1 yüküne enerji sağlar. AC faz kontrolü değildir.</p>'+
 '<p><strong>Aydınlık: '+esc(lux)+' lux</strong> · LDR: '+esc((Number(sensor?._ldrResistance)||0).toFixed(1))+' Ω · Q1/G: '+esc((Number(q?._dimmerGateV)||0).toFixed(3))+' V</p>'+
 '<p><strong>H1 parlaklık: %'+esc(pct.toFixed(2))+'</strong> · I='+esc((Number(lamp?._dimmerCurrentA)||0).toFixed(5))+' A · P='+esc(power.toFixed(3))+' W</p>'+
 '<div class="tutorial-ldr-presets">'+[0.1,1,10,100,1000].map(v=>'<button type="button" data-ldr-dimmer-lux="'+v+'" aria-pressed="'+(lux===v)+'">'+esc(v)+' lux</button>').join('')+'</div>'+
 '<small>Yüzde, sanal lamba elektrik gücünden hesaplanır; fiziksel lümen/üretici kabulü değildir.</small></section>';
}
function setLdrDimmerLux(project,luxValue){
 const lesson=lessonFor(project),sensor=project?.components?.find(c=>c.id==='s1'),
  lamp=project?.components?.find(c=>c.id==='h1'),q=project?.components?.find(c=>c.id==='q1'),lux=Number(luxValue);
 if(!isLdrVirtualDimmerLesson(lesson)||!sensor||!lamp||!q||![0.1,1,10,100,1000].includes(lux))return false;
 const solver=root.CCSSimulation?.solve,defs=root.DTSEditor?.byId;
 if(typeof solver!=='function'||!defs){project.tutorialLesson.lastFeedback='Özgün solver hazır değil; dimmer ölçümü doğrulanamadı.';sync(project);return false}
 sensor.illuminationLux=lux;
 const result=solver(project,defs,{now:1000});
 if(!result?.stable||result.blocked||result.shortCircuit||result.oscillating||
   !Number.isFinite(q._dimmerGateV)||!Number.isFinite(lamp._dimmerBrightnessPct)){
  project.tutorialLesson.lastFeedback='LDR dimmer çözümü kararsız veya geçersiz; REVIEW.';sync(project);return false;
 }
 project.tutorialLesson.lastFeedback='Sanal LDR '+lux+' lux → Q1/G '+q._dimmerGateV.toFixed(3)+' V; H1 P='+
  (Number(lamp._dimmerPowerW)||0).toFixed(3)+' W, parlaklık %'+lamp._dimmerBrightnessPct.toFixed(2)+
  '. Fiziksel ürün verisi değildir.';
 root.DTSEditor?.render?.();sync(project);return true;
}
function isRelayMotorReversal(l){return l?.id==='electronic-switching-src-03'&&!!l?.pedagogyReview?.relayReversalVirtual}
function relayMotorPanel(l,session,project){
 const btn=project?.components?.find(c=>c.id==='sw'),coil=project?.components?.find(c=>c.id==='k1'),motor=project?.components?.find(c=>c.id==='m1');
 const spin=Number(motor?._spin)||0;
 return '<section class="tutorial-relay-motor-virtual"><h3>24 V sanal DC motor · röle ile yön değiştirme</h3>'+
 '<p>S1 ve K1 bobini ayrı kontrol yolundadır; K1A/K1B iki değiştirici kontak M1 motor kutbunu birlikte değiştirir.</p>'+
 '<p><strong>S1: '+(btn?.state?'BASILI':'BIRAKILMIŞ')+'</strong> · K1: '+(coil?._active?'ON':'OFF')+
 ' · M1: '+(spin>0?'İLERİ':spin<0?'GERİ':'DURUYOR')+'</p>'+
 '<div class="tutorial-relay-controls">'+
 '<button type="button" data-mq07-motor-direction="forward">S1 bırak · ileri</button>'+
 '<button type="button" data-mq07-motor-direction="reverse">S1 bas · geri</button></div>'+
 '<small>Gerçek motorun yük altında ani terslenmesi, mekanik geçiş ve güvenlik kilitleri simüle edilmemiştir.</small></section>';
}
function setRelayMotorDirection(project,value){
 const lesson=lessonFor(project),sw=project?.components?.find(c=>c.id==='sw'),
  coil=project?.components?.find(c=>c.id==='k1'),motor=project?.components?.find(c=>c.id==='m1');
 if(!isRelayMotorReversal(lesson)||!sw||!coil||!motor||!['forward','reverse'].includes(value))return false;
 const solver=root.CCSSimulation?.solve,defs=root.DTSEditor?.byId;
 if(typeof solver!=='function'||!defs){project.tutorialLesson.lastFeedback='Özgün motor solver bulunamadı; sonuç kabul edilmedi.';sync(project);return false}
 sw.state=value==='reverse';
 const r=solver(project,defs,{now:1000});
 const expected=value==='reverse'?-1:1;
 if(!r?.stable||r.blocked||r.shortCircuit||r.oscillating||!motor._active||
   !coil._active!==!sw.state||Math.sign(motor._spin)!==expected){
  project.tutorialLesson.lastFeedback='Röle/motor kutup değişimi kararlı doğrulanmadı; REVIEW.';sync(project);return false;
 }
 project.tutorialLesson.lastFeedback='Sanal S1 '+(sw.state?'BASILI':'BIRAKILMIŞ')+
  ' · K1 '+(coil._active?'ON':'OFF')+' · M1 '+(expected===1?'İLERİ (+1)':'GERİ (−1)')+
  '. Bu fiziksel motor güvenlik testi değildir.';
 root.DTSEditor?.render?.();sync(project);return true;
}
function isFetRcDelayLesson(l){return l?.id==='electronic-switching-src-09'&&l?.pedagogyReview?.titleTopologyStatus==='VIRTUAL_FET_RC_DELAY_STOP_SOURCE_ALIGNED'}
function fetRcDelayPanel(l,session,project){
 const cap=project?.components?.find(c=>c.id==='c1'),fet=project?.components?.find(c=>c.id==='q1'),
  lamp=project?.components?.find(c=>c.id==='h1'),meter=project?.components?.find(c=>c.id==='v1');
 return '<section class="tutorial-fet-rc-delay"><h3>FET · gecikmeli durma (sanal RC deney)</h3>'+
  '<p>S1 butonuyla C1 100 µF / RD 20 kΩ deşarjını kontrol et. Q1 G-S eşik geçişi ve H1 lamba sonucu özgün solver ile hesaplanır.</p>'+
  '<div class="tutorial-fet-rc-readout"><strong>C1 = '+esc((Number(cap?._capacitorVoltage)||0).toFixed(3))+' V</strong>'+
  ' · <strong>Q1 = '+(fet?._mosfetOn?'ON':'OFF')+'</strong>'+
  ' · <strong>H1 = '+(lamp?._active?'ON':'OFF')+'</strong>'+
  ' · <strong>V1 = '+esc(meter?._meter?.display||'—')+' '+esc(meter?._meter?.unit||'V')+'</strong></div>'+
  '<p>Durum: '+esc(session?.fetPhase||'Sıfırlanmadı')+' · sanal t='+esc(Number(session?.fetTime||0)/1000)+' s</p>'+
  '<div class="tutorial-fet-rc-controls"><button type="button" data-fet-rc-action="reset">Sıfırla</button>'+
  '<button type="button" data-fet-rc-action="press">S1 bas / 1 sn tut</button>'+
  '<button type="button" data-fet-rc-action="release">S1 bırak / 3 sn izle</button></div>'+
  '<small>Bu değerler üretici J113/IRF540N ölçümü veya gerçek devre güvenliği değildir.</small></section>';
}
function setFetRcDelayPhase(project,action){
 const lesson=lessonFor(project),session=project?.tutorialLesson,
  button=project?.components?.find(c=>c.id==='sw'),cap=project?.components?.find(c=>c.id==='c1');
 if(!isFetRcDelayLesson(lesson)||!session||!button||!cap||!['reset','press','release'].includes(action))return false;
 const solver=root.CCSSimulation?.solve,defs=root.DTSEditor?.byId;
 if(typeof solver!=='function'||!defs){session.lastFeedback='FET RC native solver hazır değil; ölçüm doğrulanmadı.';sync(project);return false}
 if(action==='press'&&session.fetPhase!=='idle'){session.lastFeedback='Önce Sıfırla komutunu kullan.';sync(project);return false}
 if(action==='release'&&session.fetPhase!=='pressed'){session.lastFeedback='Önce S1 bas/1 sn tut adımını çalıştır.';sync(project);return false}
 if(action==='reset'){button.state=false;cap._capacitorVoltage=0;delete cap._reactiveNow;session.fetPhase='idle';session.fetTime=0}
 else button.state=action==='press';
 const start=action==='reset'?0:Number(session.fetTime??0)+250,
  stop=action==='reset'?0:action==='press'?1000:4250;
 let steps=0,transition=null,previous=!!project.components.find(c=>c.id==='q1')?._mosfetOn;
 for(let now=start;now<=stop;now+=action==='reset'?1:250){
  const result=solver(project,defs,{now}),fet=project.components.find(c=>c.id==='q1'),
   lamp=project.components.find(c=>c.id==='h1'),meter=project.components.find(c=>c.id==='v1');
  if(!result?.stable||result.blocked||result.shortCircuit||result.oscillating||
     !Number.isFinite(cap._capacitorVoltage)||!Number.isFinite(fet?._mq07GateSampleV)||meter?._meter?.warning){
   session.lastFeedback='FET RC dinamik solver kararlı değil veya prob bağlantısı eksik; inceleme sürüyor.';sync(project);return false;
  }
  if(transition===null&&!!fet._mosfetOn!==previous)transition=now;
  previous=!!fet._mosfetOn;steps++;session.fetTime=now;
 }
 if(action!=='reset')session.fetPhase=action==='press'?'pressed':'released';
 const fet=project.components.find(c=>c.id==='q1'),lamp=project.components.find(c=>c.id==='h1');
 session.lastFeedback='Sanal RC '+action+' · '+steps+' çözüm · C1 '+cap._capacitorVoltage.toFixed(3)+' V'+
  ' · Q1 '+(fet?._mosfetOn?'ON':'OFF')+' · H1 '+(lamp?._active?'ON':'OFF')+
  (transition===null?'':' · geçiş '+transition+' ms')+'. Üretici kalibrasyonu değildir.';
 root.DTSEditor?.render?.();sync(project);return true;
}
function isMq07MosfetHealth(l){return l?.id==='electronic-switching-src-10'&&!!l?.pedagogyReview?.mosfetHealthVirtual}
function mosfetHealthPanel(l,session,project){
 const q=project?.components?.find(c=>c.id==='q1'),s=project?.components?.find(c=>c.id==='sw'),h=project?.components?.find(c=>c.id==='h1'),
  gate=project?.components?.find(c=>c.id==='vg'),load=project?.components?.find(c=>c.id==='vl');
 return '<section class="tutorial-mosfet-health"><h3>MOSFET · sanal G/D/S işlev taraması</h3>'+
  '<p>12 VDC eğitim devresi · VG ölçeri G–S, VL ölçeri H1 yükünün X1–X2 uçları arasındadır.</p>'+
  '<p><strong>S1 '+(s?.state?'ON':'OFF')+'</strong> · Q1 '+(q?._active?'ON':'OFF')+
  ' · H1 '+(h?._active?'ON':'OFF')+'</p>'+
  '<p><strong>VG G–S: '+esc(gate?._meter?.display||'—')+' '+esc(gate?._meter?.unit||'V')+
  '</strong> · <strong>VL yük: '+esc(load?._meter?.display||'—')+' '+esc(load?._meter?.unit||'V')+'</strong></p>'+
  '<div class="tutorial-mosfet-health-actions"><button type="button" data-mosfet-health-action="off">S1 bırak · OFF</button>'+
  '<button type="button" data-mosfet-health-action="on">S1 bas · ON</button></div>'+
  '<small>Bu, sanal anahtarlama fonksiyonunun kontrolüdür. Gerçek IRF540N gövde diyodu, termal güvenlik veya fiziksel sağlamlık sertifikası değildir.</small></section>';
}
function setMosfetHealthPhase(project,action){
 const l=lessonFor(project),s=project?.tutorialLesson,button=project?.components?.find(c=>c.id==='sw'),
  q=project?.components?.find(c=>c.id==='q1'),
  gate=project?.components?.find(c=>c.id==='vg'),load=project?.components?.find(c=>c.id==='vl');
 if(!isMq07MosfetHealth(l)||!s||!button||!q||!gate||!load||!['on','off'].includes(action))return false;
 const solve=root.CCSSimulation?.solve,defs=root.DTSEditor?.byId;
 if(typeof solve!=='function'||!defs){s.lastFeedback='Özgün elektriksel solver hazır değil, MOSFET testi doğrulanamaz.';sync(project);return false}
 button.state=action==='on';
 const result=solve(project,defs,{now:1000});
 if(!result?.stable||result.shortCircuit||result.blocked||result.oscillating||
  gate._meter?.warning||load._meter?.warning||
  !Number.isFinite(gate._meter?.value)||!Number.isFinite(load._meter?.value)){
  s.lastFeedback='MOSFET testi kararsız veya ölçüm cihazı geçersiz: inceleme açık.';sync(project);return false;
 }
 const gateV=Number(gate._meter.value),loadV=Number(load._meter.value);
 s.lastFeedback='Sanal '+action.toUpperCase()+' · VG(G-S) '+gateV.toFixed(3)+' V · VL(H1) '+loadV.toFixed(3)+
  ' V · Q1 '+(q._active?'ON':'OFF')+'. Fiziksel ürün sağlamlığı doğrulanmadı.';
 root.DTSEditor?.render?.();sync(project);return true;
}
function sc12PwmDimmerPanel(project){
 const pwm=project?.components?.find(c=>c.id==='pwm1'),q=project?.components?.find(c=>c.id==='q1'),lamp=project?.components?.find(c=>c.id==='h1');
 const pct=Number.isFinite(lamp?._sc12BrightnessPct)?lamp._sc12BrightnessPct:null;
 return '<section class="tutorial-sc11-pwm"><h3>IGBT · DC PWM dimmer</h3>'+
  '<p>PWM duty: <strong>'+esc(String(pwm?.dutyPercent??0))+'%</strong> · frekans '+esc(String(pwm?.frequencyHz??1000))+' Hz</p>'+
  '<p>PWM OUT '+(pwm?._pwmSupplyValid?(pwm._pwmHigh?'HIGH':'LOW'):'besleme bekliyor')+
  ' · Q1 '+(q?._igbtOn?'ON':'OFF')+'</p>'+
  '<p>Çözücüden türetilmiş normalize ON-zamanı: <strong>'+(pct===null?'test bekliyor':pct.toFixed(0)+'%')+'</strong></p>'+
  '<div class="tutorial-sc11-pwm-actions">'+[0,25,50,75,100].map(d=>'<button type="button" data-sc12-pwm-duty="'+d+'">'+d+'% duty</button>').join('')+'</div>'+
  '<small>Bu gösterim düşük gerilimli sanal DC PWM dimmerdir; gerçek lümen, IGBT kayıp/ısıl modeli ve AC faz dimmeri değildir.</small></section>';
}
function setSc12PwmDuty(project,value){
 const l=lessonFor(project),generator=project?.components?.find(c=>c.id==='pwm1'&&c.typeId==='virtual-pwm-generator-v1');
 const duty=Number(value);
 if(l?.id!=='electronic-switching-src-12'||!generator||!Number.isFinite(duty)||duty<0||duty>100)return false;
 generator.dutyPercent=duty;root.DTSEditor?.render?.();sync(project);return true;
}
function sc19OptoTriacPanel(project){
 const timer=project?.components?.find(c=>c.id==='t1'),
   opto=project?.components?.find(c=>c.id==='u1'),
   ac=project?.components?.find(c=>c.id==='ac1'),
   lamp=project?.components?.find(c=>c.id==='h1'),
   q=project?.components?.find(c=>c.id==='q1');
 const wave=lamp?._sc19Wave||[];
 const line=key=>wave.map((v,i)=>(i?'L':'M')+(6+v.deg).toFixed(1)+' '+(65-(Number(v[key])||0)*2.1).toFixed(1)).join(' ');
 const graph=wave.length?'<svg viewBox="0 0 372 128" width="100%" role="img" aria-label="AC kaynak, optik gate ve iki yarım periyotta sanal yük gerilimi"><rect width="372" height="128" rx="6" fill="#152536"/><path d="M6 65h360M186 12v98" stroke="#62798a" stroke-dasharray="3 4"/><path d="'+line('sourceV')+'" fill="none" stroke="#5bd7ff" stroke-width="1.8"/><path d="'+line('loadV')+'" fill="none" stroke="#88eea4" stroke-width="2.2"/><path d="'+line('gateV')+'" fill="none" stroke="#ffca76" stroke-width="1.2"/><text x="12" y="120" fill="#e9f1f9" font-size="10">Mavi AC · Yeşil yük · Sarı opto gate</text></svg>':'<p>START sonrası dalga hesaplanır.</p>';
 const led=Number.isFinite(opto?._sc19LedCurrentA)?(1000*opto._sc19LedCurrentA).toFixed(2)+' mA':'—';
 const rms=Number.isFinite(lamp?._sc19RmsV)?lamp._sc19RmsV.toFixed(2)+' V':'—';
 const hz=timer?.frequencyHz??2,duty=timer?.dutyPercent??50;
 return '<section class="tutorial-sc11-pwm"><h3>MOC3021 → BTA16 · sanal optik flaşör</h3>'+
 '<p>DC LED: <strong>'+led+'</strong> · T1 '+esc(String(hz))+' Hz · '+esc(String(duty))+'% duty</p>'+
 '<p>Optik bağlantı '+(opto?._sc19Isolated?'ayrı kumanda/AC':'doğrulanmadı')+
 ' · Opto '+(opto?._sc19OptoOn?'tetikliyor':'kapalı')+
 ' · BTA16 '+(q?._sc19Conducting?'iletimde':'kesimde')+'</p>'+
 '<p>AC fazı '+(Number.isFinite(ac?._sc19PhaseDeg)?ac._sc19PhaseDeg.toFixed(0)+'°':'—')+
 ' · yük RMS <strong>'+rms+'</strong></p>'+graph+
 '<div class="tutorial-sc11-pwm-actions">'+[0,25,50,75,100].map(d=>'<button type="button" data-sc19-duty="'+d+'">'+d+'% duty</button>').join('')+
 [1,2,4].map(f=>'<button type="button" data-sc19-hz="'+f+'">'+f+' Hz</button>').join('')+'</div>'+
 '<small>Yalnız yazılımsal 5 V giriş ve bağımsız yalıtılmış 12 V AC. Gerçek optik izolasyon test edilmedi; şebeke ve donanım modeli değildir.</small></section>';
}
function setSc19Timer(project,key,value){
 const l=lessonFor(project),timer=project?.components?.find(c=>c.id==='t1'&&c.typeId==='virtual-opto-flasher-timer-v1'),n=Number(value);
 if(l?.id!=='electronic-switching-src-19'||!timer||!Number.isFinite(n))return false;
 if(key==='dutyPercent'&&(n<0||n>100))return false;
 if(key==='frequencyHz'&&(n<.2||n>10))return false;
 if(!['dutyPercent','frequencyHz'].includes(key))return false;
 timer[key]=n;root.DTSEditor?.render?.();sync(project);return true;
}
function sc18OptoPanel(project){
 const u=project?.components?.find(c=>c.id==='u1'),sg=project?.components?.find(c=>c.id==='sg');
 const led=Number.isFinite(u?._sc18LedCurrentA)?(u._sc18LedCurrentA*1000).toFixed(2)+' mA':'—';
 const col=Number.isFinite(u?._sc18CollectorCurrentA)?(u._sc18CollectorCurrentA*1000).toFixed(2)+' mA':'—';
 const vc=Number.isFinite(u?._sc18CollectorVoltageV)?u._sc18CollectorVoltageV.toFixed(2)+' V':'—';
 const isolated=u?._sc18Isolated===true?'ayrı sanal devreler':'doğrulanmadı';
 return '<section class="tutorial-sc11-pwm"><h3>TLP521-1 · LED / fototransistör testi</h3>'+
 '<p>SG giriş: <strong>'+(sg?.state?'ON':'OFF')+'</strong> · LED akımı <strong>'+led+'</strong></p>'+
 '<p>Fototransistör kolektör akımı <strong>'+col+'</strong> · C–E '+vc+'</p>'+
 '<p>G1 ve G2 dönüş hatları: <strong>'+isolated+'</strong> · İletim '+(u?._sc18TransistorOn?'ON':'OFF')+'</p>'+
 '<div class="tutorial-sc11-pwm-actions"><button type="button" data-sc18-opto-input="on">SG giriş LED aç</button>'+
 '<button type="button" data-sc18-opto-input="off">SG giriş LED kapat</button></div>'+
 '<small>Yalnız sanal CTR=%50 varsayımı; giriş ve çıkış arasında kablo yoktur. Bu test fiziksel izolasyon dayanımını veya gerçek cihazın sağlamlığını kanıtlamaz.</small></section>';
}
function setSc18OptoInput(project,value){
 const lesson=lessonFor(project),sw=project?.components?.find(c=>c.id==='sg'&&c.typeId==='push-no');
 if(lesson?.id!=='electronic-switching-src-18'||!sw||!['on','off'].includes(value))return false;
 sw.state=value==='on';root.DTSEditor?.render?.();sync(project);return true;
}
function sc17TriacDimmerPanel(project){
 const src=project?.components?.find(c=>c.id==='ac1'),t=project?.components?.find(c=>c.id==='trg1'),
  q=project?.components?.find(c=>c.id==='q1'),lamp=project?.components?.find(c=>c.id==='h1');
 const wave=t?._sc17Wave||[],angle=Number(t?.triggerAngleDeg??90);
 const line=key=>wave.map((p,i)=>(i?'L':'M')+(6+p.deg).toFixed(1)+' '+(63-(Number(p[key])||0)*2.2).toFixed(1)).join(' ');
 const graph=wave.length?'<svg viewBox="0 0 372 128" width="100%" role="img" aria-label="Çift yarım periyot AC kaynak, işaret değiştiren gate darbeleri ve triyak yük gerilimi"><rect width="372" height="128" rx="6" fill="#152536"/><path d="M6 63h360M186 9v105" stroke="#677a8a" stroke-width="1" stroke-dasharray="3 4"/><path d="'+line('sourceV')+'" stroke="#67d3ff" stroke-width="2" fill="none"/><path d="'+line('loadV')+'" stroke="#86f7a4" stroke-width="2.5" fill="none"/><path d="'+line('gateV')+'" stroke="#ffcb76" stroke-width="1.5" fill="none"/><text x="10" y="120" font-size="10" fill="#e1e9f2">Mavi AC · Yeşil yük · Sarı gate / ± yarım periyot</text></svg>':
 '<p>Dalga, simülasyon START sonrasında hesaplanacaktır.</p>';
 const measured=Number.isFinite(lamp?._sc17RmsV)?Number(lamp._sc17RmsV).toFixed(2)+' V':'—',
  signed=Number.isFinite(lamp?._sc17LoadV)?Number(lamp._sc17LoadV).toFixed(2)+' V':'—',
  phase=Number.isFinite(src?._sc17PhaseDeg)?Number(src._sc17PhaseDeg).toFixed(0)+'°':'—';
 return '<section class="tutorial-sc11-pwm"><h3>BTA16 · çift yarım periyot AC dimmer</h3>'+
  '<p>Yalıtılmış sanal kaynak: 12 V RMS · 50 Hz · ateşleme <strong>'+esc(String(angle))+'°</strong></p>'+
  '<p>Faz '+phase+' · anlık yük '+signed+' · gerçek sanal dalgadan yük RMS <strong>'+measured+'</strong></p>'+
  '<p>TRG1 gate OUT: '+(Number.isFinite(t?._sc17GateV)?Number(t._sc17GateV).toFixed(1)+' V':'—')+
  ' · Q1 '+(q?._sc17Conducting?'iletimde':'kesimde')+'</p>'+graph+
  '<div class="tutorial-sc11-pwm-actions">'+[0,45,90,135,170].map(a=>
    '<button type="button" data-sc17-phase-angle="'+a+'">'+a+'° ateşleme</button>').join('')+'</div>'+
  '<small>Yalnız düşük gerilimli yazılım simülasyonu. Gerçek BTA16 gate quadrant, ısı ve şebeke ölçümü değildir.</small></section>';
}
function setSc17PhaseAngle(project,value){
 const lesson=lessonFor(project),t=project?.components?.find(c=>c.id==='trg1'&&c.typeId==='virtual-ac-triac-trigger-v1'),
 angle=Number(value);
 if(lesson?.id!=='electronic-switching-src-17'||!t||!Number.isFinite(angle)||angle<0||angle>170)return false;
 t.triggerAngleDeg=angle;root.DTSEditor?.render?.();sync(project);return true;
}
function sc16TriacPanel(project){
 const q=project?.components?.find(c=>c.id==='q1'),sg=project?.components?.find(c=>c.id==='sg'),
  sp=project?.components?.find(c=>c.id==='sp'),h=project?.components?.find(c=>c.id==='h1');
 return '<section class="tutorial-sc11-pwm"><h3>BTA16 · DC tetikleme ve STOP</h3>'+
  '<p>SG gate: <strong>'+(sg?.state?'BASILI':'BIRAKILDI')+'</strong> · SP güç STOP: <strong>'+(sp?.state?'AÇIK / STOP':'KAPALI')+'</strong></p>'+
  '<p>Gate–MT1: '+(q?._triacGateVoltage===undefined?'—':Number(q._triacGateVoltage).toFixed(1)+' V')+
  ' · sanal akım: '+(q?._triacHoldingCurrentA===undefined?'—':Number(q._triacHoldingCurrentA).toFixed(3)+' A')+
  ' · yük: <strong>'+(h?._active?'ON':'OFF')+'</strong> · latch: '+(q?._triacLatched?'TUTUYOR':'KESİK')+'</p>'+
  '<div class="tutorial-sc11-pwm-actions">'+
  '<button type="button" data-sc16-triac-contact="gate-on">SG gate bas</button>'+
  '<button type="button" data-sc16-triac-contact="gate-off">SG bırak</button>'+
  '<button type="button" data-sc16-triac-contact="stop-on">SP STOP bas</button>'+
  '<button type="button" data-sc16-triac-contact="stop-off">SP bırak</button></div>'+
  '<small>Yalnız 12 V sanal DC. SG bırakmak latched triyakın ana akımını kesmez; SP güç kolunu açar. AC davranışı ve gerçek ürün kalibrasyonu kapsam dışıdır.</small></section>';
}
function setSc16TriacContact(project,action){
 const lesson=lessonFor(project),sg=project?.components?.find(c=>c.id==='sg'&&c.typeId==='push-no'),
  sp=project?.components?.find(c=>c.id==='sp'&&c.typeId==='push-nc');
 if(lesson?.id!=='electronic-switching-src-16'||!sg||!sp)return false;
 if(action==='gate-on')sg.state=true;
 else if(action==='gate-off')sg.state=false;
 else if(action==='stop-on')sp.state=true;
 else if(action==='stop-off')sp.state=false;
 else return false;
 root.DTSEditor?.render?.();sync(project);return true;
}
function sc15AcPanel(project){
 const t=project?.components?.find(c=>c.id==='trg1'),source=project?.components?.find(c=>c.id==='ac1'),load=project?.components?.find(c=>c.id==='h1');
 const wave=t?._sc15Wave||[],angle=Number(t?.triggerAngleDeg??90);
 const path=key=>wave.length?wave.map((x,i)=>(i?'L':'M')+(5+x.deg).toFixed(1)+' '+(70-(Number(x[key])||0)*2.3).toFixed(1)).join(' '):'';
 const graph=wave.length?'<svg viewBox="0 0 372 130" width="100%" role="img" aria-label="Sanal AC kaynak, gate darbesi ve SCR yükü dalga şekilleri"><rect width="372" height="130" rx="6" fill="#152536"/><path d="M5 70h360" stroke="#657484" stroke-width="1"/><path d="'+path('sourceV')+'" stroke="#6cd5ff" fill="none" stroke-width="2"/><path d="'+path('loadV')+'" stroke="#7cef9d" fill="none" stroke-width="2.5"/><path d="'+path('gateV')+'" stroke="#ffd27a" fill="none" stroke-width="1.5"/><text x="10" y="119" fill="#cedce8" font-size="10">Mavi AC · Yeşil yük · Sarı gate</text></svg>':'<p>Dalga şekli simülasyon START sonrasında gösterilir.</p>';
 return '<section class="tutorial-sc11-pwm"><h3>SCR AC yarım periyot · faz tetikleme</h3><p>Yalıtılmış sanal 12 V AC / 50 Hz · TRG1 açı <strong>'+esc(String(angle))+'°</strong></p>'+
 '<p>Anlık AC fazı '+(source?._sc15PhaseDeg===undefined?'—':source._sc15PhaseDeg.toFixed(0)+'°')+
 ' · gate OUT '+(t?._sc15GateOutputV===undefined?'—':Number(t._sc15GateOutputV).toFixed(1)+' V')+
 ' · yük RMS '+(load?._sc15OutputRmsV===undefined?'—':Number(load._sc15OutputRmsV).toFixed(2)+' V')+'</p>'+
 graph+'<div class="tutorial-sc11-pwm-actions">'+[0,45,90,135,170].map(a=>'<button type="button" data-sc15-phase-angle="'+a+'">'+a+'°</button>').join('')+'</div>'+
 '<small>Gerçek AC şebekesi değil; yalnız 12 V RMS sanal kaynak. RMS dalgadan hesaplanır; ısı/gerçek üretici transient modeli değildir.</small></section>';
}
function setSc15PhaseAngle(project,value){
 const lesson=lessonFor(project),phase=project?.components?.find(c=>c.id==='trg1'&&c.typeId==='virtual-ac-scr-trigger-v1'),angle=Number(value);
 if(lesson?.id!=='electronic-switching-src-15'||!phase||!Number.isFinite(angle)||angle<0||angle>170)return false;
 phase.triggerAngleDeg=angle;root.DTSEditor?.render?.();sync(project);return true;
}
function isSc11VirtualPwm(l){return l?.id==='electronic-switching-src-11'&&!!l?.pedagogyReview?.mq05PwmVirtual}
function sc11PwmPanel(l,session,project){
 const cfg=project?.components?.find(c=>c.id==='pwm1')||{},m=project?.components?.find(c=>c.id==='m1'),q=project?.components?.find(c=>c.id==='q1');
 return '<section class="tutorial-sc11-pwm"><h3>Sanal PWM · MOSFET/DC motor</h3>'+
  '<p>Duty: <strong>'+esc(String(cfg.dutyPercent??0))+'%</strong> · frekans '+esc(String(cfg.frequencyHz??1000))+' Hz</p>'+
  '<p>Q1 '+(q?._mosfetOn?'ON':'OFF')+' · M1 anlık '+(m?._active?'ENERJİLİ':'OFF')+'</p>'+
  '<p>Motor eğitsel hız eğilimi: '+(Number.isFinite(m?._sc11SpeedPercent)?m._sc11SpeedPercent.toFixed(1)+'%':'ölçüm bekliyor')+' · çözücüyle doğrulanan hedef: '+(Number.isFinite(m?._sc11DriveTargetPercent)?m._sc11DriveTargetPercent.toFixed(0)+'%':'—')+'</p>'+
  '<p>VG gerçek sanal G–S DCV ortalaması: '+(Number.isFinite(m?._sc11VgsMean)?m._sc11VgsMean.toFixed(2)+' V':'ölçüm doğrulanmadı')+'</p>'+
  '<div class="tutorial-sc11-pwm-actions">'+[0,50,100].map(d=>'<button type="button" data-sc11-pwm-duty="'+d+'">'+d+'% duty</button>').join('')+'</div>'+
  '<small>Görünen sonuç özgün elektriksel solverın anlık anahtarlama durumudur. RPM, tork ve termal doğrulama yoktur; gerçek motor sürücüsü değildir.</small></section>';
}
function setSc11PwmDuty(project,value){
 const l=lessonFor(project),session=project?.tutorialLesson,solver=root.CCSSimulation?.solve,defs=root.DTSEditor?.byId;
 const duty=Number(value),allowed=[0,50,100].includes(duty);
 const generator=project?.components?.find(c=>c.id==='pwm1'&&c.typeId==='virtual-pwm-generator-v1');
 if(!isSc11VirtualPwm(l)||!session||!generator||!allowed)return false;
 if(typeof solver!=='function'||!defs){session.lastFeedback='PWM özgün solver kullanılamıyor; doğrulama bekliyor.';sync(project);return false}
 const before=generator.dutyPercent;generator.dutyPercent=duty;
 const samples=[0,.25,.75].map(now=>{const result=solver(project,defs,{now});
  const q=project.components.find(c=>c.id==='q1'),m=project.components.find(c=>c.id==='m1');
  return {valid:!!(result?.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating),
   fet:!!q?._mosfetOn,motor:!!m?._active,spin:Number(m?._spin)||0};
 });
 if(samples.some(x=>!x.valid)){
  generator.dutyPercent=before;
  session.lastFeedback='PWM elektriksel durum kararsız; sonuç kabul edilmedi.';sync(project);return false;
 }
 session.lastFeedback='Sanal '+duty+'% PWM · 0/.25/.75 ms anlık motor durumları: '+
  samples.map(x=>x.motor?'ON':'OFF').join(' / ')+'. RPM hesaplanmadı; fiziksel kabul yok.';
 root.DTSEditor?.render?.();sync(project);return true;
}
function noteHtml(l,session,project){
 if(isEnergyAnalyzerLesson(l))return energyAnalyzerNoteHtml(l,session,project);
 if(isFrequencyMeasurementLesson(l))return frequencyMeasurementNoteHtml(l,session,project);
 if(isClampCurrentMeasurementLesson(l))return clampCurrentMeasurementNoteHtml(l,session,project);
 if(isResistanceMeasurementLesson(l))return resistanceMeasurementNoteHtml(l,session,project);
 if(isCurrentMeasurementLesson(l))return currentMeasurementNoteHtml(l,session,project);
 if(isVoltageMeasurementLesson(l))return voltageMeasurementNoteHtml(l,session,project);
 if(isKirchhoffControlLesson(l))return kirchhoffControlNoteHtml(l,session,project);
 if(isMixedAnalysisLesson(l))return mixedAnalysisNoteHtml(l,session,project);
 if(isParallelAnalysisLesson(l))return parallelAnalysisNoteHtml(l,session,project);
 if(isSeriesAnalysisLesson(l))return seriesAnalysisNoteHtml(l,session,project);
 if(isOhmLesson(l))return ohmNoteHtml(l,session,project);
 if(isBatteryParallelLesson(l))return batteryParallelNoteHtml(l,session,project);
 if(isBatteryTypesLesson(l))return batteryTypesNoteHtml(l,session,project);
 if(isBatterySeriesLesson(l))return batterySeriesNoteHtml(l,session,project);
 if(isDcSourceLesson(l))return dcSourceNoteHtml(l,session,project);
 if(isDcUsageLesson(l))return dcUsageNoteHtml(l,session,project);
 const total=l.steps.length,step=session.step||0,phase=session.phase||'demo',pct=Math.round((phase==='demo'?0:Math.min(step,total))/Math.max(1,total)*100);
 let current='';
 if(phase==='rebuild'&&step<total){const s=l.steps[step];current='<section class="tutorial-current-step"><small>ŞİMDİ · '+(step+1)+' / '+total+'</small><h4>'+esc(componentLabel(project,s.from))+' <b>→</b> '+esc(componentLabel(project,s.to))+'</h4><p>'+esc(hintOpen||l.variant<=2?s.hint:'İki yanıp sönen terminal arasında tek bir kablo oluşturun.')+'</p>'+(hintOpen?'<div class="tutorial-why"><strong>Neden?</strong> '+esc(s.why)+'</div>':'')+'<button type="button" data-tutorial-action="hint">'+(hintOpen?'İpucunu kapat':'İpucu / Neden?')+'</button></section>'}
 if(phase==='quiz'&&l.quiz){current='<section class="tutorial-current-step tutorial-quiz"><small>KONU KONTROLÜ</small><h4>'+esc(l.quiz.question)+'</h4><div class="tutorial-quiz-options">'+l.quiz.options.map((x,i)=>'<button type="button" data-tutorial-quiz="'+i+'">'+String.fromCharCode(65+i)+' · '+esc(x)+'</button>').join('')+'</div></section>'}
 if(phase==='complete')current='<section class="tutorial-complete"><b>✓ DERS TAMAMLANDI</b><p>'+(l.kind==='quiz'?'Konu kontrolünü doğru tamamladınız.':'Bağlantı sırası eksiksiz ve doğru. Şimdi simülasyonu çalıştırın. Buton ve anahtarları simülasyon sırasında istediğiniz kadar tekrar kullanabilirsiniz; mühürleme gibi tutmalı devrelerde STOP butonu devreyi bırakır ve ardından yeniden START verilebilir.')+'</p></section>';
 return '<header class="tutorial-coach-head"><small>ÖĞRETİCİ MODU · '+esc(l.group)+'</small><h2>'+esc(l.topic)+'</h2><p>'+esc(l.title)+'</p></header>'+
 topologyReviewNotice(l)+
 '<div class="tutorial-progress"><span style="width:'+pct+'%"></span></div>'+
 (session.lastFeedback?'<div class="tutorial-feedback '+(session.lastFeedback.startsWith('✓')?'ok':'warn')+'">'+esc(session.lastFeedback)+'</div>':'')+
 '<section class="tutorial-explain"><h3>Bu ders ne işe yarar?</h3><p>'+esc(l.summary)+'</p>'+
 (l.learningGoal?'<div class="tutorial-learning-goal"><strong>Ders sonunda ne bileceksin?</strong><p>'+esc(l.learningGoal)+'</p></div>':'')+
 '<h3>Nasıl çalışır?</h3><p>'+esc(l.explanation)+'</p>'+
 (l.materials?.length?'<div class="tutorial-materials"><h3>Bu derste kullandığımız elemanlar</h3><ul>'+l.materials.map(x=>'<li><strong>'+esc(x.label||x.typeId)+'</strong><span>'+esc(x.why||'Bu dersin konusunu doğrudan göstermek için kullanılır.')+'</span></li>').join('')+'</ul></div>':'')+
 (l.beginnerSteps?.length?'<div class="tutorial-beginner-steps"><h3>Sıfırdan öğrenme sırası</h3><ol>'+l.beginnerSteps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>':'')+
 (l.practiceGuide?.steps?.length?'<div class="tutorial-beginner-steps tutorial-virtual-practice"><h3>'+esc(l.practiceGuide.heading)+'</h3><p><strong>Yalnız sanal eğitim:</strong> Bu rehber dersin kodlanmış şema ve materyallerini açıklar; gerçek donanım testi veya nihai fiziksel kabul değildir.</p><ol>'+l.practiceGuide.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>'+(l.practiceGuide.observations?.length?'<h3>Gözlem ve öz değerlendirme</h3><ul>'+l.practiceGuide.observations.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+'</div>':'')+
 (isPiezoVirtualLesson(l)?piezoVirtualPanel(l,session,project):'')+
 (isRcTimingLesson(l)?rcTimingPanel(l,session,project):'')+
 (isFetRcDelayLesson(l)?fetRcDelayPanel(l,session,project):'')+
 (isMq07MosfetHealth(l)?mosfetHealthPanel(l,session,project):'')+
 (isSc11VirtualPwm(l)?sc11PwmPanel(l,session,project):'')+
 (l.id==='electronic-switching-src-12'?sc12PwmDimmerPanel(project):'')+
 (l.id==='electronic-switching-src-15'?sc15AcPanel(project):'')+
 (l.id==='electronic-switching-src-16'?sc16TriacPanel(project):'')+
 (l.id==='electronic-switching-src-17'?sc17TriacDimmerPanel(project):'')+
 (l.id==='electronic-switching-src-18'?sc18OptoPanel(project):'')+
 (l.id==='electronic-switching-src-19'?sc19OptoTriacPanel(project):'')+
 (isLdrVirtualDimmerLesson(l)?ldrDimmerPanel(l,session,project):'')+
 (isRelayMotorReversal(l)?relayMotorPanel(l,session,project):'')+
 '<div class="tutorial-concepts">'+l.concepts.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>'+(l.sourceDocs?.length?'<div class="tutorial-source"><strong>Kaynak kapsamı:</strong> '+l.sourceDocs.map(esc).join(' · ')+'</div>':'')+(l.powerExplanation?'<div class="tutorial-power"><h3>Motor güç bağlantısı nasıl yapıldı?</h3><p>'+esc(l.powerExplanation)+'</p>'+(l.powerSteps?.length?'<ol>'+l.powerSteps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'')+'</div>':'')+(l.safety?'<div class="tutorial-safety">⚠ '+esc(l.safety)+'</div>':'')+'</section>'+
 current+
 '<footer class="tutorial-actions">'+
 (phase==='demo'&&l.kind!=='quiz'?'<button class="primary" type="button" data-tutorial-action="rebuild">↻ Devreyi yeniden kur</button>':'')+
 (phase==='rebuild'?'<button type="button" data-tutorial-action="example">Tam devreyi göster</button><button type="button" data-tutorial-action="restart">Baştan başla</button>':'')+
 (phase==='complete'?(l.kind==='quiz'?'<button type="button" data-tutorial-action="next">Sonraki uygulama</button>':'<button class="primary" type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><button type="button" data-tutorial-action="restart">Tekrar kur</button><button type="button" data-tutorial-action="next">Sonraki uygulama</button>'):'')+
 '<button type="button" data-tutorial-action="home">Konu listesine dön</button></footer>';
}

/* MQ-07: dedicated learning objectives for canonical measurement subtopics. */
function measurementUpgradeCard(l,session,project){
 const u=l?.measurementUpgrade;if(!u)return '';
 const feedback=session?.measurementFeedback?'<p class="measurement-upgrade-feedback">'+esc(session.measurementFeedback)+'</p>':'';
 let scope='';
 if(u.scope){
  const fg=project?.components?.find(c=>c.id==='fg'),osc=project?.components?.find(c=>c.id==='osc'),stats=osc?._scopeStats1;
  const ok=!!osc?._scopeGrounded&&Number.isFinite(stats?.freq)&&Number.isFinite(stats?.vpp);
  scope='<div class="measurement-scope-observation"><strong>Canlı osiloskop gözlemi:</strong> '+
    (ok?'f ≈ '+esc(stats.freq.toFixed(1))+' Hz · Vpp ≈ '+esc(stats.vpp.toFixed(2))+' V · T ≈ '+esc((1000/stats.freq).toFixed(3))+' ms':'Ölçüm bekleniyor: simülasyonu çalıştır ve CH1/GND bağlantısını doğrula.')+'</div>'+
    '<div class="measurement-scope-presets">'+[50,1000,10000].map(hz=>'<button type="button" data-measurement-scope-hz="'+hz+'"'+(Number(fg?.generatorFrequency||1000)===hz?' aria-pressed="true"':'')+'>'+esc(hz>=1000?(hz/1000)+' kHz':hz+' Hz')+'</button>').join('')+'</div>';
 }
 if(u.tachometer){
  const motor=project?.components?.find(c=>c.id==='m1'),tach=project?.components?.find(c=>c.id==='t1');
  const measured=tach?.tachometerTargetId===motor?.id&&motor?._active&&Number.isFinite(motor?._motorRPM);
  const rpm=measured?Math.abs(motor._motorRPM):null;
  scope='<div class="measurement-tacho-observation"><strong>Canlı sanal takometre:</strong> '+
    (measured?esc(rpm.toFixed(0))+' rpm · '+esc((rpm/60).toFixed(2))+' tur/s':'Motor çalışmıyor veya ölçüm modeli henüz çalıştırılmadı; RPM gösterilmiyor.')+
    '<small>Bu, simüle edilen motorun _motorRPM durumundan türetilen model okumasıdır; gerçek bir optik cihaz kalibrasyonu değildir.</small></div>'+
    '<div class="measurement-tacho-presets">'+[750,1500,3000].map(n=>'<button type="button" data-measurement-tacho-rpm="'+n+'"'+(Number(motor?.motorRatedRpm)===n?' aria-pressed="true"':'')+'>'+n+' rpm</button>').join('')+'</div>';
 }
 if(u.workbench){
  const model=root.DTSMeasurementWorkbench?.display?.(l,project);
  if(model){
    const selected=model.index;
    const label=n=>u.workbench==='energy'?n+' dakika':u.workbench==='sensor'?n+' mm':u.workbench==='lux'?n+' m':u.workbench==='sound'?n+' Pa':u.workbench==='temperature'?n+' °C':u.workbench==='lcr'?n+' Hz':n+' mm';
    const choices=model.choices.map((n,i)=>'<button type="button" data-measurement-workbench-index="'+i+'" aria-pressed="'+(selected===i)+'">'+esc(label(n))+'</button>').join('');
    const position=model.choices.length>1?(selected/(model.choices.length-1)*100):0;
    scope+='<div class="measurement-workbench-panel"><strong>Adım adım sanal deney</strong>'+
      '<div class="measurement-workbench-options">'+choices+'</div>'+
      '<div class="measurement-workbench-figure">'+(root.DTSMeasurementWorkbench?.diagram?.(l,project)||'')+'</div>'+
      '<div class="measurement-workbench-gauge" role="img" aria-label="Seçilen sanal referans seviyesi"><i style="width:'+position+'%"></i></div>'+
      '<output class="measurement-workbench-result">'+esc(model.label)+'</output>'+
      '<p class="measurement-workbench-equation">'+esc(model.formula)+'</p>'+
      '<small>'+esc(model.caveat)+'</small></div>';
  }
 }
 return '<section class="measurement-upgrade-card"><small>ÖZEL UYGULAMA · '+esc(l.title)+'</small><h3>'+esc(u.heading)+'</h3>'+
 '<p>'+esc(u.goal)+'</p><div><strong>Şimdi sen ölç:</strong> '+esc(u.task)+'</div>'+
 '<p><b>Konu kontrolü:</b> '+esc(u.question)+'</p><div class="measurement-upgrade-answers">'+
 u.options.map((answer,i)=>'<button type="button" data-measurement-upgrade-answer="'+i+'">'+esc(answer)+'</button>').join('')+'</div>'+scope+feedback+'</section>';
}
function sync(project=root.DTSEditor?.getProject?.()){
 const coach=root.document?.querySelector('#tutorialCoach'),bottom=root.document?.querySelector('#tutorialBottomBar'),l=lessonFor(project);if(!coach)return;
 if(!l){coach.hidden=true;const panelControl=root.document?.querySelector('#tutorialCoachPanelControl');if(panelControl)panelControl.hidden=true;coach.classList.remove('tutorial-dc-usage-coach','tutorial-dc-source-coach','tutorial-battery-series-coach','tutorial-battery-types-coach','tutorial-battery-parallel-coach','tutorial-ohm-coach','tutorial-series-coach','tutorial-parallel-analysis-coach','tutorial-mixed-analysis-coach','tutorial-kirchhoff-coach','tutorial-voltage-measure-coach','tutorial-current-measure-coach','tutorial-resistance-measure-coach','tutorial-clamp-measure-coach','tutorial-frequency-measure-coach','tutorial-energy-analyzer-coach','tutorial-reference-coach');if(bottom)bottom.hidden=true;clearHighlights();clearReferenceStage();root.DTSTutorialMicroHints?.clear?.();root.document.body.classList.remove('tutorial-active');root.DTSTutorialEnhancements?.enforce?.();return}
 coach.hidden=false;coach.classList.toggle('tutorial-dc-usage-coach',isDcUsageLesson(l));coach.classList.toggle('tutorial-dc-source-coach',isDcSourceLesson(l));coach.classList.toggle('tutorial-battery-series-coach',isBatterySeriesLesson(l));coach.classList.toggle('tutorial-battery-types-coach',isBatteryTypesLesson(l));coach.classList.toggle('tutorial-battery-parallel-coach',isBatteryParallelLesson(l));coach.classList.toggle('tutorial-ohm-coach',isOhmLesson(l));coach.classList.toggle('tutorial-series-coach',isSeriesAnalysisLesson(l));coach.classList.toggle('tutorial-parallel-analysis-coach',isParallelAnalysisLesson(l));coach.classList.toggle('tutorial-mixed-analysis-coach',isMixedAnalysisLesson(l));coach.classList.toggle('tutorial-kirchhoff-coach',isKirchhoffControlLesson(l));coach.classList.toggle('tutorial-voltage-measure-coach',isVoltageMeasurementLesson(l));coach.classList.toggle('tutorial-current-measure-coach',isCurrentMeasurementLesson(l));coach.classList.toggle('tutorial-resistance-measure-coach',isResistanceMeasurementLesson(l));coach.classList.toggle('tutorial-clamp-measure-coach',isClampCurrentMeasurementLesson(l));coach.classList.toggle('tutorial-frequency-measure-coach',isFrequencyMeasurementLesson(l));coach.classList.toggle('tutorial-energy-analyzer-coach',isEnergyAnalyzerLesson(l));coach.classList.toggle('tutorial-reference-coach',isReferenceFormatLesson(l));lastLesson=l.id;const s=project.tutorialLesson;coach.innerHTML=measurementUpgradeCard(l,s,project)+noteHtml(l,s,project);mountCoachChrome(coach,l);syncReferenceStage(l);root.DTSTutorialMicroHints?.sync?.(l,project);
 if(bottom){bottom.hidden=false;bottom.innerHTML=isEnergyAnalyzerLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Sanal analizi çalıştır</button><span>Enerji analizörü · V / A / W / VA / var / PF / Hz / Wh · 3 yük presetini karşılaştır.</span>':isFrequencyMeasurementLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Ölçümü çalıştır</button><span>Frekans · UT61E+ Hz · 50 Hz / 1 kHz / 10 kHz · T=1/f.</span>':isClampCurrentMeasurementLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>UT200A · ACA 2 A · 230 VAC / 230 Ω ≈ 1 A RMS · tek iletkeni çeneyle kavra.</span>':isResistanceMeasurementLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Ölçümü çalıştır</button><span>Direnç ölçümü · G1 OFF · Ω 2 kΩ · R1≈1,000 kΩ · kısa devre≈0 Ω · açık prob=OL.</span>':isCurrentMeasurementLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Akım ölçümü · DCA 200 mA · yük öncesi≈24 mA · yük sonrası≈24 mA · ters yön≈−24 mA.</span>':isVoltageMeasurementLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Gerilim ölçümü · DCV 200 V · R1≈+24 V · aynı düğüm≈0 V · ters polarite≈−24 V.</span>':isKirchhoffControlLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Kirchhoff · KCL: 103,45≈62,07+41,38 mA · KVL: 24≈10,34+13,66 V.</span>':isMixedAnalysisLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Karışık devre · R2||R3=132 Ω · Rtoplam=232 Ω · It≈103,45 mA · VR1≈10,34 V · Vpar≈13,66 V.</span>':isParallelAnalysisLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Paralel devre · Req 68,75 Ω · I1 240 mA · I2 ≈109 mA · Itoplam ≈349 mA · VR1=VR2≈24 V.</span>':isSeriesAnalysisLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Seri devre · Rtoplam 320 Ω · I ≈ 75 mA · VR1 ≈ 7,5 V · VR2 ≈ 16,5 V.</span>':isOhmLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Ohm deneyi · Ayarlı kaynak ve R1 değerini değiştir; A1/V1 ölçümlerini I=V/R ile karşılaştır.</span>':isBatteryParallelLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Paralel pil dersi · + ile +, − ile −. Ortak raylarda gerilim yaklaşık 1,5 V kalır.</span>':isBatteryTypesLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Sanal deneyi çalıştır</button><span>Pil ve akü karşılaştırması · V, Ah ve Wh farkını ölçerek ve hesaplayarak öğren.</span>':isBatterySeriesLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Pil seri dersi · 1,5 V + 1,5 V = 3,0 V. Önce seri köprüyü gör, sonra ölç ve kendin kur.</span>':isDcSourceLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>DC kaynak dersi · Önce tahmin et, sonra probla ölç, ardından güç yolunu kendin kur.</span>':isDcUsageLesson(l)?'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>Serbest prob deneyi · Prob gövdelerini sürükleyip istediğiniz temas noktasına değdirin.</span>':s.phase==='quiz'?'<strong>Konu kontrolü</strong><span>Doğru seçeneği işaretleyerek dersi tamamlayın.</span>':s.phase==='demo'?'<button type="button" data-tutorial-action="rebuild">↻ Devreyi yeniden kur</button><span>Önce örneği incele; sonra bağlantıları kendin yap.</span>':s.phase==='rebuild'?'<strong>Bağlantı '+Math.min(s.step+1,l.steps.length)+' / '+l.steps.length+'</strong><span>'+esc(l.steps[s.step]?.hint||'Devre tamamlanıyor…')+'</span>':'<button type="button" data-tutorial-action="simulate">▶ Simülasyonu çalıştır</button><span>✓ Tüm kablolar doğru bağlandı.</span>'}
 if(s.phase==='rebuild')highlight(project,l.steps[s.step]);else if(s.phase==='complete')flow(project);else clearHighlights();
 root.document.body.classList.toggle('tutorial-active',true);root.DTSTutorialEnhancements?.enforce?.();
}
function cleanProject(l){
 const p=clone(l.project);p.defaultTemplate=undefined;p.projectId='tutorial-session-'+l.id;const initialPhase=l.kind==='quiz'?'quiz':l.kind==='explore'?'explore':'demo';p.tutorialLesson={id:l.id,topicId:l.topicId,phase:initialPhase,step:0,level:l.variant,lastFeedback:''};return p;
}
function checkedLessonProject(l){
 const p=cleanProject(l),id=l.id,parts=p.components||[];
 const has=t=>parts.some(c=>c.typeId===t);
 if((id==='opamp-apps-src-13'||id==='opamp-apps-src-14')&&
   (!has('lm358p-dip8')||!has('capacitor')||
    !parts.some(c=>c.typeId==='resistor')||!(p.wires||[]).length))
   throw Error('Dersin gerçek LM358/R-C devresi bulunamadı; ilgisiz 4–20 mA projesi açılamaz.');
 if(id==='electronic-switching-src-16'&&
   (!has('bta16-600b-triac')||!(p.wires||[]).some(w=>w.to?.p==='MT2')))
   throw Error('Triyak dersi için gerçek MT1/MT2/G devresi bulunamadı; sıradan anahtar/lamba projesi açılamaz.');
 return p;
}
async function open(id){
 const l=L.byId[id];if(!l||!root.DTSStudio||!root.DTSEditor)return;lastLesson=id;hintOpen=false;closeHub();
 try{root.DTSStudio.load(checkedLessonProject(l));root.DTSEditor.setAppearance?.('material');setTimeout(()=>sync(root.DTSEditor.getProject()),0)}catch(e){root.DTSEditor.toast('Öğretici ders açılamadı: '+(e?.message||e))}
}
function restoreMeasurementTargets(project,l){
 for(const source of l.project.components){const live=project.components.find(c=>c.id===source.id);if(!live)continue;if(source.probeTarget)live.probeTarget=clone(source.probeTarget);else delete live.probeTarget;if(source.typeId==='unit-ut200a'){delete live.clampedWireId;delete live.clampT}}
}
function startRebuild(project=root.DTSEditor?.getProject?.()){
 const l=lessonFor(project);if(!l)return;
 if(l.pedagogyReview?.titleTopologyIssue){project.tutorialLesson.lastFeedback='Devre/topoloji incelemesi açık; doğrulanmamış yeniden kurma başlatılamaz.';root.DTSEditor?.toast?.(project.tutorialLesson.lastFeedback);sync(project);return}
 root.DTSEditor.stop();project.wires=clone((l.project.wires||[]).filter(w=>isProbeLeadWire(l,w)));project.junctions=[];restoreMeasurementTargets(project,l);project.tutorialLesson.phase='rebuild';project.tutorialLesson.step=0;project.tutorialLesson.lastFeedback='Hazırsınız. İlk iki terminal yanıp sönüyor.';hintOpen=l.variant===1;root.DTSEditor.render();sync(project);
}
function showExample(project=root.DTSEditor?.getProject?.()){
 const l=lessonFor(project);if(!l)return;root.DTSEditor.stop();project.wires=clone(l.project.wires);project.junctions=clone(l.project.junctions||[]);for(const source of l.project.components){const live=project.components.find(c=>c.id===source.id);if(!live)continue;if(source.probeTarget)live.probeTarget=clone(source.probeTarget);else delete live.probeTarget;if(source.clampedWireId){live.clampedWireId=source.clampedWireId;live.clampT=source.clampT??.5}else if(source.typeId==='unit-ut200a'){delete live.clampedWireId;delete live.clampT}}project.tutorialLesson.phase='demo';project.tutorialLesson.step=0;project.tutorialLesson.lastFeedback='Tam bağlantı tekrar gösterildi.';root.DTSEditor.render();sync(project);
}
function restart(project=root.DTSEditor?.getProject?.()){showExample(project);startRebuild(project)}
function next(project=root.DTSEditor?.getProject?.()){
 const l=lessonFor(project);if(!l)return;
 if(isBatterySeriesLesson(l)){open('dc-battery-types-rich');return}
 if(isBatteryTypesLesson(l)){open('dc-circuits-src-04');return}
 const group=L.lessons.filter(x=>x.topicId===l.topicId),idx=group.findIndex(x=>x.id===l.id),n=group[idx+1]||L.lessons[L.lessons.findIndex(x=>x.id===l.id)+1]||L.lessons[0];open(n.id);
}
async function goHome(){root.document.body.classList.remove('tutorial-active');clearHighlights();clearReferenceStage();root.DTSTutorialMicroHints?.clear?.();await root.DTSStudio?.home?.();setTimeout(()=>openHub(),40)}
function bind(){
 root.document.addEventListener('click',e=>{
   const coachToggle=e.target.closest?.('[data-tutorial-coach-toggle]');if(coachToggle){e.preventDefault();const coach=root.document?.querySelector('#tutorialCoach');setCoachVisible(!!coach?.hidden);return}
   const coachClose=e.target.closest?.('[data-tutorial-coach-close]');if(coachClose){e.preventDefault();setCoachVisible(false);return}
   const coachMin=e.target.closest?.('[data-tutorial-coach-minimize]');if(coachMin){e.preventDefault();toggleCoachMinimize();return}
   const relayButton=e.target.closest?.('[data-mq07-motor-direction]');if(relayButton){e.preventDefault();setRelayMotorDirection(root.DTSEditor?.getProject?.(),relayButton.dataset.mq07MotorDirection);return}
   const ldrButton=e.target.closest?.('[data-ldr-dimmer-lux]');if(ldrButton){e.preventDefault();setLdrDimmerLux(root.DTSEditor?.getProject?.(),ldrButton.dataset.ldrDimmerLux);return}
   const sc19Duty=e.target.closest?.('[data-sc19-duty]');if(sc19Duty){e.preventDefault();setSc19Timer(root.DTSEditor?.getProject?.(),'dutyPercent',sc19Duty.dataset.sc19Duty);return}
   const sc19Hz=e.target.closest?.('[data-sc19-hz]');if(sc19Hz){e.preventDefault();setSc19Timer(root.DTSEditor?.getProject?.(),'frequencyHz',sc19Hz.dataset.sc19Hz);return}
   const sc18Button=e.target.closest?.('[data-sc18-opto-input]');if(sc18Button){e.preventDefault();setSc18OptoInput(root.DTSEditor?.getProject?.(),sc18Button.dataset.sc18OptoInput);return}
   const sc17Button=e.target.closest?.('[data-sc17-phase-angle]');if(sc17Button){e.preventDefault();setSc17PhaseAngle(root.DTSEditor?.getProject?.(),sc17Button.dataset.sc17PhaseAngle);return}
   const sc16Button=e.target.closest?.('[data-sc16-triac-contact]');if(sc16Button){e.preventDefault();setSc16TriacContact(root.DTSEditor?.getProject?.(),sc16Button.dataset.sc16TriacContact);return}
   const sc15Button=e.target.closest?.('[data-sc15-phase-angle]');if(sc15Button){e.preventDefault();setSc15PhaseAngle(root.DTSEditor?.getProject?.(),sc15Button.dataset.sc15PhaseAngle);return}
   const sc12DutyButton=e.target.closest?.('[data-sc12-pwm-duty]');if(sc12DutyButton){e.preventDefault();setSc12PwmDuty(root.DTSEditor?.getProject?.(),sc12DutyButton.dataset.sc12PwmDuty);return}
   const sc11DutyButton=e.target.closest?.('[data-sc11-pwm-duty]');if(sc11DutyButton){e.preventDefault();setSc11PwmDuty(root.DTSEditor?.getProject?.(),sc11DutyButton.dataset.sc11PwmDuty);return}
   const mosfetHealthButton=e.target.closest?.('[data-mosfet-health-action]');if(mosfetHealthButton){e.preventDefault();setMosfetHealthPhase(root.DTSEditor?.getProject?.(),mosfetHealthButton.dataset.mosfetHealthAction);return}
   const fetRcButton=e.target.closest?.('[data-fet-rc-action]');if(fetRcButton){e.preventDefault();setFetRcDelayPhase(root.DTSEditor?.getProject?.(),fetRcButton.dataset.fetRcAction);return}
   const rcButton=e.target.closest?.('[data-rc-action]');if(rcButton){e.preventDefault();setRcTimingPhase(root.DTSEditor?.getProject?.(),rcButton.dataset.rcAction);return}
   const piezoButton=e.target.closest?.('[data-piezo-sample]');if(piezoButton){e.preventDefault();setPiezoVirtualSample(root.DTSEditor?.getProject?.(),piezoButton.dataset.piezoSample);return}
   const energyPreset=e.target.closest?.('[data-energy-preset]');if(energyPreset){e.preventDefault();setEnergyAnalyzerPreset(root.DTSEditor?.getProject?.(),energyPreset.dataset.energyPreset);return}
   const frequencyPreset=e.target.closest?.('[data-frequency-preset]');if(frequencyPreset){e.preventDefault();setFrequencyMeasurePreset(root.DTSEditor?.getProject?.(),frequencyPreset.dataset.frequencyPreset);return}
   const clampPreset=e.target.closest?.('[data-clamp-preset]');if(clampPreset){e.preventDefault();setClampMeasurePreset(root.DTSEditor?.getProject?.(),clampPreset.dataset.clampPreset);return}
   const resistancePreset=e.target.closest?.('[data-resistance-preset]');if(resistancePreset){e.preventDefault();setResistanceMeasurePreset(root.DTSEditor?.getProject?.(),resistancePreset.dataset.resistancePreset);return}
   const currentPreset=e.target.closest?.('[data-current-preset]');if(currentPreset){e.preventDefault();setCurrentMeasurePreset(root.DTSEditor?.getProject?.(),currentPreset.dataset.currentPreset);return}
   const voltagePreset=e.target.closest?.('[data-voltage-preset]');if(voltagePreset){e.preventDefault();setVoltageMeasurePreset(root.DTSEditor?.getProject?.(),voltagePreset.dataset.voltagePreset);return}
   const kirchhoffCurrent=e.target.closest?.('[data-kirchhoff-current]');if(kirchhoffCurrent){e.preventDefault();setKirchhoffCurrentTarget(root.DTSEditor?.getProject?.(),kirchhoffCurrent.dataset.kirchhoffCurrent);return}
   const kirchhoffVoltage=e.target.closest?.('[data-kirchhoff-voltage]');if(kirchhoffVoltage){e.preventDefault();setKirchhoffVoltageTarget(root.DTSEditor?.getProject?.(),kirchhoffVoltage.dataset.kirchhoffVoltage);return}
   const mixedVoltage=e.target.closest?.('[data-mixed-voltage]');if(mixedVoltage){e.preventDefault();setMixedVoltageTarget(root.DTSEditor?.getProject?.(),mixedVoltage.dataset.mixedVoltage);return}
    const parallelVoltage=e.target.closest?.('[data-parallel-voltage]');if(parallelVoltage){e.preventDefault();setParallelVoltageTarget(root.DTSEditor?.getProject?.(),parallelVoltage.dataset.parallelVoltage);return}
   const hubBtn=e.target.closest?.('[data-open-tutorial]');if(hubBtn){e.preventDefault();openHub();return}
   const backBtn=e.target.closest?.('[data-tutorial-back]');if(backBtn){e.preventDefault();closeHub();return}
   const openBtn=e.target.closest?.('[data-tutorial-open]');if(openBtn){e.preventDefault();open(openBtn.dataset.tutorialOpen);return}
   const group=e.target.closest?.('[data-tutorial-group]');if(group){filter=group.dataset.tutorialGroup;renderDashboard();return}
   const wb=e.target.closest?.('[data-measurement-workbench-index]');
   if(wb){e.preventDefault();const p=root.DTSEditor?.getProject?.(),lesson=lessonFor(p);
     if(lesson?.measurementUpgrade?.workbench&&p){
       root.DTSMeasurementWorkbench?.choose?.(lesson,p,wb.dataset.measurementWorkbenchIndex,root.CCSSimulation?.solve,root.DTSEditor?.byId);
       root.DTSEditor?.render?.();sync(p);
     }
     return;
   }
   const tachoRpm=e.target.closest?.('[data-measurement-tacho-rpm]');
   if(tachoRpm){e.preventDefault();const project=root.DTSEditor?.getProject?.(),lesson=lessonFor(project);
    if(lesson?.measurementUpgrade?.tachometer){const rpm=Number(tachoRpm.dataset.measurementTachoRpm),motor=project.components.find(c=>c.id==='m1');
     if([750,1500,3000].includes(rpm)&&motor){motor.motorRatedRpm=rpm;
      root.CCSSimulation?.solve?.(project,root.DTSEditor?.byId,{now:Date.now()});
      root.DTSEditor?.render?.();sync(project)}
    }return;
   }
   const scopeHz=e.target.closest?.('[data-measurement-scope-hz]');
   if(scopeHz){e.preventDefault();const project=root.DTSEditor?.getProject?.(),lesson=lessonFor(project);
    if(lesson?.measurementUpgrade?.scope){const hz=Number(scopeHz.dataset.measurementScopeHz),preset=project.tutorialExplore?.presets?.find(p=>p.hz===hz);
      const fg=project.components.find(c=>c.id==='fg'),osc=project.components.find(c=>c.id==='osc');
      if(preset&&fg&&osc){fg.generatorFrequency=hz;osc.scopeTimeMs=preset.spanMs;
       root.DTSArduino?.tick?.(project,root.DTSEditor?.byId,{now:Date.now()});
       root.DTSEditor?.render?.();sync(project)}
    }return;
   }
   const measurementAnswer=e.target.closest?.('[data-measurement-upgrade-answer]');
   if(measurementAnswer){e.preventDefault();const project=root.DTSEditor?.getProject?.(),lesson=lessonFor(project),up=lesson?.measurementUpgrade;
    if(project&&up){const answer=Number(measurementAnswer.dataset.measurementUpgradeAnswer);
      project.tutorialLesson.measurementFeedback=answer===0?'✓ Doğru. Şimdi sonucu probun gerçek temas noktasında doğrula.':'Yeniden düşün: bağlantıyı, kademeyi ve prob girişlerini kontrol et.';
      sync(project)}return;
   }
   const referenceAnswer=e.target.closest?.('[data-reference-answer]');if(referenceAnswer){e.preventDefault();const project=root.DTSEditor?.getProject?.(),l=lessonFor(project);if(l&&isReferenceFormatLesson(l)){const ok=referenceAnswer.dataset.referenceAnswer==='1';project.tutorialLesson.lastFeedback=ok?'✓ Doğru. Devredeki görsel ilişkiyi ve formülü birlikte kullandın.':'Bu seçenek devrede gördüğün ilişkiyle uyuşmuyor. Üstteki bağlantı kartlarını ve kısa bilgi kutusunu tekrar incele.';sync(project)}return}
   const ohmVoltage=e.target.closest?.('[data-ohm-voltage]');if(ohmVoltage){e.preventDefault();setOhmVoltage(root.DTSEditor?.getProject?.(),ohmVoltage.dataset.ohmVoltage);return}
   const ohmResistance=e.target.closest?.('[data-ohm-resistance]');if(ohmResistance){e.preventDefault();setOhmResistance(root.DTSEditor?.getProject?.(),ohmResistance.dataset.ohmResistance);return}
   const ohmReset=e.target.closest?.('[data-ohm-reset]');if(ohmReset){e.preventDefault();resetOhm(root.DTSEditor?.getProject?.());return}
   const batteryParallelMeasure=e.target.closest?.('[data-battery-parallel-measure]');if(batteryParallelMeasure){e.preventDefault();setBatteryParallelProbePreset(root.DTSEditor?.getProject?.(),batteryParallelMeasure.dataset.batteryParallelMeasure);return}
   const batteryTypeMeasure=e.target.closest?.('[data-battery-type-measure]');if(batteryTypeMeasure){e.preventDefault();setBatteryTypeMeasure(root.DTSEditor?.getProject?.(),batteryTypeMeasure.dataset.batteryTypeMeasure);return}
   const batteryTypeLoad=e.target.closest?.('[data-battery-type-load]');if(batteryTypeLoad){e.preventDefault();setBatteryTypeLoad(root.DTSEditor?.getProject?.(),batteryTypeLoad.dataset.batteryTypeLoad);return}
   const batteryMeasure=e.target.closest?.('[data-battery-series-measure]');if(batteryMeasure){e.preventDefault();setBatterySeriesProbePreset(root.DTSEditor?.getProject?.(),batteryMeasure.dataset.batterySeriesMeasure);return}
   const sourceMeasure=e.target.closest?.('[data-dc-source-measure]');if(sourceMeasure){e.preventDefault();setDcSourceProbePreset(root.DTSEditor?.getProject?.(),sourceMeasure.dataset.dcSourceMeasure);return}
 const batteryParallelAnswer=e.target.closest?.('[data-battery-parallel-answer]');if(batteryParallelAnswer){e.preventDefault();const project=root.DTSEditor?.getProject?.(),l=lessonFor(project);if(isBatteryParallelLesson(l)){const ok=Number(batteryParallelAnswer.dataset.batteryParallelAnswer)===0;project.tutorialLesson.lastFeedback=ok?'✓ Doğru: paralelde aynı kutuplar ortak düğümlere bağlandığı için paket gerilimi yaklaşık 1,5 V kalır.':'Tekrar düşün: paralelde + uçlar aynı düğümde, − uçlar aynı düğümdedir; gerilimler seri gibi toplanmaz.';sync(project)}return}
 const batteryTypesAnswer=e.target.closest?.('[data-battery-types-answer]');if(batteryTypesAnswer){e.preventDefault();const project=root.DTSEditor?.getProject?.(),l=lessonFor(project);if(isBatteryTypesLesson(l)){const ok=Number(batteryTypesAnswer.dataset.batteryTypesAnswer)===0;project.tutorialLesson.lastFeedback=ok?'✓ Doğru: Wh yaklaşık V × Ah ile karşılaştırılır.':'Tekrar düşün: Ah kapasiteyi, V gerilimi; Wh ise ikisinin birlikte temsil ettiği enerjiyi anlatır.';sync(project)}return}
 const batteryAnswer=e.target.closest?.('[data-battery-series-answer]');if(batteryAnswer){e.preventDefault();const project=root.DTSEditor?.getProject?.(),l=lessonFor(project);if(isBatterySeriesLesson(l)){const ok=Number(batteryAnswer.dataset.batterySeriesAnswer)===0;project.tutorialLesson.lastFeedback=ok?'✓ Doğru: seri gerilim 1,5 V + 1,5 V = 3,0 V.':'Tekrar düşün: aynı yöndeki seri kaynakların gerilimleri toplanır.';sync(project)}return}
 const sourceAnswer=e.target.closest?.('[data-dc-source-answer]');if(sourceAnswer){e.preventDefault();const project=root.DTSEditor?.getProject?.(),l=lessonFor(project);if(isDcSourceLesson(l)){const ok=Number(sourceAnswer.dataset.dcSourceAnswer)===0;project.tutorialLesson.lastFeedback=ok?'✓ Doğru: 24/1000 = 0,024 A = 24 mA.':'Tekrar düşün: 1 kΩ = 1000 Ω. I=V/R bağıntısını kullan.';sync(project)}return}
 const a=e.target.closest?.('[data-tutorial-action]');if(!a)return;const project=root.DTSEditor?.getProject?.();
   if(a.dataset.tutorialAction==='rebuild')startRebuild(project);
   else if(a.dataset.tutorialAction==='example')showExample(project);
   else if(a.dataset.tutorialAction==='restart')restart(project);
   else if(a.dataset.tutorialAction==='hint'){hintOpen=!hintOpen;sync(project)}
   else if(a.dataset.tutorialAction==='simulate')root.document.querySelector('#simulateBtn')?.click();
   else if(a.dataset.tutorialAction==='next')next(project);
   else if(a.dataset.tutorialAction==='home')goHome();
 });
 root.document.addEventListener('pointerdown',e=>{
   const bar=e.target.closest?.('.tutorial-float-bar'),coach=bar?.closest?.('#tutorialCoach');if(!bar||!coach||e.target.closest('button'))return;
   const r=coach.getBoundingClientRect();coachDrag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};coach.classList.add('is-dragging');bar.setPointerCapture?.(e.pointerId);e.preventDefault();
 });
 root.document.addEventListener('pointermove',e=>{
   if(!coachDrag||coachDrag.id!==e.pointerId)return;const coach=root.document?.querySelector('#tutorialCoach');if(!coach)return;
   const r=coach.getBoundingClientRect(),w=r.width,h=coach.classList.contains('is-minimized')?44:r.height;
   coach.style.left=Math.max(8,Math.min(e.clientX-coachDrag.dx,(root.innerWidth||1280)-w-8))+'px';
   coach.style.top=Math.max(58,Math.min(e.clientY-coachDrag.dy,(root.innerHeight||800)-h-8))+'px';
 });
 root.document.addEventListener('pointerup',e=>{
   if(!coachDrag||coachDrag.id!==e.pointerId)return;const coach=root.document?.querySelector('#tutorialCoach');coach?.classList.remove('is-dragging');persistCoachBox(coach);coachDrag=null;
 });
 root.addEventListener('resize',()=>{const coach=root.document?.querySelector('#tutorialCoach');if(coach&&!coach.hidden)applyCoachUi(coach)});
 const search=root.document.querySelector('#tutorialSearch');if(search)search.addEventListener('input',e=>{query=e.target.value;renderDashboard()});
 root.addEventListener('pageshow',()=>{if(curriculumLoaded&&root.document.body.classList.contains('tutorial-page-open'))renderDashboard()});
}
const api={renderDashboard,open,openHub,closeHub,sync,locksEditing,allowsGuidedWiring,explainLock,canStart,beforeWire,afterWire,startRebuild,showExample,restart,progress,ensureCurriculumLoaded,ensureGuidedLesson,topologyReviewNotice,setPiezoVirtualSample,setRcTimingPhase,setLdrDimmerLux,setRelayMotorDirection,setFetRcDelayPhase,setMosfetHealthPhase,setSc11PwmDuty,setSc15PhaseAngle,setSc16TriacContact,setSc17PhaseAngle,setSc18OptoInput,setSc19Timer};
root.DTSTutorialMode=api;if(root.document?.readyState==='loading')root.document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})(typeof window==='undefined'?globalThis:window);
