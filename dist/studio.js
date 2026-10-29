(function(){
  'use strict';
  const E=window.DTSEditor,W=window.DTSWorkspaces,Projects=window.DTSProjects,$=s=>document.querySelector(s);
  function ensureDashboardIntegrity(){
    const dashboard=$('#dashboard'),cards=dashboard?.querySelector('.design-cards');if(!dashboard||!cards)return false;
    if(!cards.querySelector('[data-new-mode="arduino"]'))cards.insertAdjacentHTML('beforeend','<button class="design-card arduino-card" data-new-mode="arduino"><span class="mode-number">04</span><svg viewBox="0 0 80 60" aria-hidden="true"><rect x="8" y="10" width="64" height="40" rx="7"/><path d="M16 17h12v8H16ZM51 18h13M51 24h13M18 41h8m6 0h8m6 0h8m6 0h4M35 20h10v18H35Z"/><circle cx="60" cy="34" r="4"/></svg><strong>ARDUINO ATÖLYESİ</strong><span>Arduino UNO, sensörler, motorlar ve ekranlar.<br>IDE’de kodla, devresini kur ve simüle et.</span><b>Yeni Arduino projesi →</b></button>');
    if(!cards.querySelector('[data-open-tutorial]'))cards.insertAdjacentHTML('beforeend','<button class="design-card tutorial-card" type="button" data-open-tutorial><span class="mode-number">05</span><svg viewBox="0 0 80 60" aria-hidden="true"><path d="M12 10h24v38H12zM44 10h24v38H44zM18 18h12M18 25h12M18 32h8M50 18h12M50 25h12M50 32h8"/><path d="M34 28h12M40 22v12"/></svg><strong>ÖĞRETİCİ MODU</strong><span>Devreyi gör, çalışma mantığını öğren.<br>Sonra terminal terminal kendin yeniden kur.</span><b>Genişletilmiş uygulamalı derslere gir →</b></button>');
    if(!dashboard.querySelector('#tutorialDashboard')){
      const section=document.createElement('section');section.id='tutorialDashboard';section.setAttribute('class','tutorial-dashboard tutorial-page');section.setAttribute('aria-labelledby','tutorialTitle');section.hidden=true;
      section.innerHTML='<div class="tutorial-page-nav"><button type="button" data-tutorial-back>← Dashboard</button><span>ÖĞRETİCİ MODU · kaynak temelli geniş müfredat</span></div><div class="tutorial-hero"><div><span class="tutorial-kicker">ÖĞRETİCİ MODU</span><h2 id="tutorialTitle">Devreyi gör, anla, sonra terminal terminal kendin kur.</h2><p>Önce çalışan örneği ve konu anlatımını incele; sonra <b>Devreyi yeniden kur</b> ile terminal terminal kendin bağla.</p></div><strong id="tutorialStats">0 uygulama tamamlandı</strong></div><div class="tutorial-toolbar"><input id="tutorialSearch" type="search" placeholder="Konu ara…" aria-label="Öğretici konu ara"><div id="tutorialGroupFilters" class="tutorial-group-filters" aria-label="Öğretici konu grupları"></div></div><div id="tutorialTopicGrid" class="tutorial-topic-grid" aria-live="polite"></div>';
      const projects=dashboard.querySelector('.projects-section'),content=dashboard.querySelector('.dashboard-content');(projects?.parentNode||content)?.insertBefore(section,projects||null);
    }
    dashboard.setAttribute('data-dashboard-revision','1.19.20-dashboard4');
    const version=dashboard.querySelector('.dashboard-version');if(version)version.textContent='ÇEVRİMDIŞI · v1.19.20';
    const offline=document.querySelector('.topbar .offline');if(offline)offline.textContent='ÇEVRİMDIŞI · v1.19.20';
    return !!cards.querySelector('[data-new-mode="arduino"]')&&!!cards.querySelector('[data-open-tutorial]')&&!!dashboard.querySelector('#tutorialDashboard');
  }
  ensureDashboardIntegrity();
  function startupFault(message){
    const host=document.querySelector('#dashboard .dashboard-content')||document.body;
    const box=document.createElement('div');box.className='dashboard-startup-fault';box.setAttribute('role','alert');
    box.innerHTML='<strong>STÜDYO BAŞLATILAMADI</strong><span>'+String(message||'Bilinmeyen başlangıç hatası').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</span><small>BASLAT.bat ile aynı v1.19.20 klasöründeki dist dosyalarını açtığınızdan emin olun.</small>';
    host.prepend(box);
  }
  if(!E||!W||!Projects||!window.DTSSafety){startupFault('Gerekli uygulama modüllerinden biri yüklenemedi. Paket eski, eksik veya karışmış olabilir.');return}
  const store=Projects.create(),safety=window.DTSSafety.create({document,storage:localStorage});
  const projectRequests=window.DTSDashboardOpenRequests?.create?.();
  if(!projectRequests){startupFault('Dashboard proje seçim denetleyicisi yüklenemedi.');return}
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let isHome=true,saveQueue=Promise.resolve(),scanToken=0,diskEntries=[],templateOriginal=null,fileDirty=false;
  const protectedProject=()=>Projects.isProtected(E.getProject());
  function protectedNotice(){
    if(!protectedProject())return false;
    $('#modalTitle').textContent='Hazır örnek korunuyor';
    $('#modalBody').innerHTML='<p>Bu örneği inceleyebilir ve simülasyonda çalıştırabilirsiniz. Devresini, kablolarını, etiketlerini veya ayarlarını değiştirmek için önce <b>Farklı Kaydet</b> ile kendi kopyanızı oluşturun.</p><p>Özgün örnek değişmeden kalır.</p>';
    $('#modalConfirm').textContent='Farklı Kaydet';$('#modalCancel').textContent='Örneği incele';$('#modal').hidden=false;
    const close=()=>{$('#modal').hidden=true;$('#modalConfirm').textContent='Onayla';$('#modalCancel').textContent='İptal'};
    $('#modalCancel').onclick=close;$('#modalConfirm').onclick=()=>{close();save(true)};return true;
  }
  function templateUI(){const p=protectedProject();document.body.classList.toggle('protected-example',p);$('#exampleProtection').hidden=!p;$('#sheetName').textContent=E.getProject().name+(p?' · Salt okunur':'')}
  function restoreExample(){if(!protectedProject()||!templateOriginal||templateOriginal.defaultTemplate.id!==E.getProject().defaultTemplate.id)return;const p=E.getProject(),base=Projects.clean(templateOriginal);for(const key of Object.keys(p))delete p[key];Object.assign(p,base)}
  const modeName=id=>W.modes.find(([key])=>key===W.normalize(id))?.[1];
  function showEditor(){isHome=false;templateUI();$('#dashboard').hidden=true;document.body.classList.remove('dashboard-open');document.querySelector('.topbar').inert=false;document.querySelector('.app-shell').inert=false;E.modeUI();if(E.getProject().workspaceMode==='panel')window.DTSPanelEditor.fit()}
  function markDirty(){if(!isHome&&!protectedProject()&&!E.getProject().tutorialLesson)fileDirty=true}
  function markClean(){fileDirty=false}
  function checkpoint(project){
    if(isHome||Projects.isProtected(project)||project.tutorialLesson)return saveQueue;const data=Projects.clean(project);
    saveQueue=saveQueue.then(()=>store.put(data)).catch(e=>{E.toast('Taslak kaydedilemedi: '+e.message)});return saveQueue;
  }
  async function home(){projectRequests.invalidate();window.DTSArduinoIDE?.closeSerialMonitor?.();E.stop();await checkpoint(E.getProject());isHome=true;document.body.classList.remove('tutorial-active');$('#dashboard').hidden=false;document.body.classList.add('dashboard-open');document.querySelector('.topbar').inert=true;document.querySelector('.app-shell').inert=true;$('#resumeProject').hidden=!E.getProject().projectId;await renderProjects();$('#dashboard').scrollTop=0}
  function showLegacyCircuitWarning(project){
    const found=Projects.compatibilityWarnings?.(project)||[];
    if(!found.length)return;
    const modal=$('#modal'),title=$('#modalTitle'),body=$('#modalBody'),confirm=$('#modalConfirm'),cancel=$('#modalCancel');
    if(!modal||!title||!body||!confirm||!cancel){E.toast(found[0].message);return}
    title.textContent='Eski PNP sensör bağlantısı tespit edildi';
    body.textContent=found[0].message;
    confirm.textContent='Anladım';cancel.textContent='Kapat';
    const close=()=>{modal.hidden=true;confirm.textContent='Onayla';cancel.textContent='İptal'};
    confirm.onclick=close;cancel.onclick=close;modal.hidden=false;
  }
  function load(project){projectRequests.invalidate();templateOriginal=null;E.load(project);templateOriginal=Projects.isProtected(project)?Projects.clean(E.getProject()):null;markClean();showEditor();if(project.preferredAppearance==='material')E.setAppearance('material');templateUI();checkpoint(E.getProject());showLegacyCircuitWarning(project)}
  async function preserve(){E.stop();if(!isHome)await checkpoint(E.getProject())}
  function createProject(mode){
    if(safety.visible)return;
    projectRequests.invalidate();mode=W.normalize(mode);const title=modeName(mode),defaults={control:'Kumanda Devrem',building:'Tesisat Devrem',panel:'Eğitim Panom',arduino:'Arduino Projem'};
    $('#modalTitle').textContent='Yeni proje';$('#modalBody').innerHTML=`<p>${esc(title)}</p><label>Proje adı<input id="newProjectName" maxlength="100" value="${esc(defaults[mode]||title||'Yeni Proje')}"></label>`;$('#modal').hidden=false;$('#newProjectName').focus();
    $('#modalConfirm').onclick=async()=>{
      const name=$('#newProjectName').value.trim()||title||'Yeni Proje';$('#modal').hidden=true;
      try{await preserve();E.create(mode,name);showEditor();markDirty();if(mode==='panel')E.setAppearance('material');await checkpoint(E.getProject())}
      catch(e){E.toast('Atölye açılamadı: '+(e?.message||e))}
    };
    $('#modalCancel').onclick=()=>$('#modal').hidden=true;
  }
  async function renderProjects(request=false){
    const token=++scanToken;let scan;try{scan=await store.scan(request)}catch(e){scan={entries:[],warnings:[e.message]}}
    if(token!==scanToken)return;diskEntries=scan.entries;const folder=store.folderName;
    $('#folderStatus').textContent=scan.permissionNeeded?folder+' · Klasör erişimi bekliyor; proje kartına tıkla veya aşağıdan izin ver.':folder?folder+' · '+diskEntries.length+' proje dosyası':'Proje klasörü seçilmedi. Dosyalarını listelemek için bir klasör seç.';
    const notice=$('#folderNotice');notice.innerHTML='';notice.hidden=!(scan.permissionNeeded||scan.warnings?.length);
    if(scan.permissionNeeded){const msg=document.createElement('span');msg.textContent='Bu klasör daha önce seçilmiş. Projeleri yeniden açmak için tarayıcı klasör iznini yenilemelidir. ';const grant=document.createElement('button');grant.id='grantFolderPermission';grant.className='secondary';grant.textContent='Klasör iznini ver ve projeleri yükle';grant.onclick=()=>renderProjects(true);notice.appendChild(msg);notice.appendChild(grant)}
    if(scan.warnings?.length){const warn=document.createElement('span');warn.textContent=(scan.permissionNeeded?' · ':'')+'Açılamayan dosyalar: '+scan.warnings.join(' · ');notice.appendChild(warn)}
    const diskIds=new Set(diskEntries.map(e=>e.project.projectId)),drafts=store.list().filter(p=>!diskIds.has(p.id));
    const date=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleDateString('tr-TR',{day:'2-digit',month:'short',year:'numeric'})};
    const card=(p,key,source)=>`<button class="project-card" data-project-key="${esc(key)}" data-project-source="${source}"><span class="project-mode ${W.normalize(p.workspaceMode)}">${p.workspaceMode==='panel'?'▤':p.workspaceMode==='building'?'⌂':'⌁'}</span><span class="project-card-text"><strong>${esc(p.name||'Adsız proje')}</strong><span>${esc(modeName(p.workspaceMode))}</span><small>${source==='disk'?'Klasör dosyası':'Tarayıcı taslağı'} · ${esc(date(p.updatedAt))}</small></span><b>↗</b></button>`;
    $('#projectCards').innerHTML=diskEntries.map(e=>card(e.project,e.key,'disk')).join('')+drafts.map(p=>card(p,p.id,'draft')).join('')||'<div class="projects-empty">Henüz proje yok. Yukarıdan bir tasarım alanı seçerek ilk projeni oluştur.</div>';
    for(const b of document.querySelectorAll('[data-project-key]'))b.onclick=async()=>{
      const ticket=projectRequests.begin();b.disabled=true;b.setAttribute('aria-busy','true');
      try{
       await preserve();
       if(!projectRequests.isCurrent(ticket)||!isHome||safety.visible)return;
       const p=b.dataset.projectSource==='disk'?await store.readEntry(diskEntries.find(e=>e.key===b.dataset.projectKey),true):await store.get(b.dataset.projectKey);
       if(!projectRequests.isCurrent(ticket)||!isHome||safety.visible)return;
       if(!p)throw Error('Proje taslağı bulunamadı.');load(p);
      }catch(e){if(projectRequests.isCurrent(ticket))E.toast(e.message)}
      finally{b.disabled=false;b.removeAttribute('aria-busy')}
    };
    $('#resumeProject').hidden=!(E.getProject().components.length||E.getProject().panel?.items?.length||store.list().some(p=>p.id===E.getProject().projectId));
  }
  async function chooseFolder(){try{const result=await store.chooseFolder();if(result.fallback){$('#projectFolderInput').click();return}if(!result.cancelled)await renderProjects()}catch(e){if(e.name==='SecurityError'||e.name==='NotSupportedError'){$('#projectFolderInput').click();return}E.toast('Klasör açılamadı: '+e.message)}}
  async function open(){if(safety.visible)return;projectRequests.invalidate();try{const result=await store.openFile();if(result.fallback){$('#fileInput').click();return}if(result.cancelled)return;await preserve();load(result.project)}catch(e){if(e.name==='SecurityError'||e.name==='NotSupportedError'){$('#fileInput').click();return}E.toast('Proje açılamadı: '+e.message)}}
  async function save(saveAs=false){
    if(isHome||safety.visible)return;if(!saveAs&&protectedNotice())return;const project=protectedProject()&&templateOriginal?Projects.clean(templateOriginal):E.getProject(),button=saveAs?$('#exportBtn'):$('#saveBtn');if(button.disabled)return;button.disabled=true;
    try{const result=await store.save(project,{saveAs});if(result.cancelled){E.toast('Kaydetme iptal edildi; mevcut proje değişmedi.');return}if(result.requiresOpen){E.toast('Kopya için indirme isteği gönderildi. Dosyanın indirildiğini doğrulayın; düzenlemek için Dosya Aç kullanın.');if(result.cacheWarning)E.toast('Tarayıcı taslak yedeği kaydedilemedi; indirilen dosyayı ayrıca doğrulayın.');return}if(saveAs&&result.saved){load(result.project);markClean();E.toast('Kopya kaydedildi. Artık düzenleyebilirsiniz.')}else if(result.saved){markClean();E.toast(result.name+' dosyasına kaydedildi.')}else if(result.download){E.toast('İndirme isteği gönderildi; dosyanın gerçekten indirildiğini doğrulayın. Değişiklikler tarayıcı taslağında korunuyor.')}else throw Error('Kaydetme sonucu doğrulanamadı.');try{localStorage.setItem('ods-project',JSON.stringify(Projects.clean(E.getProject())))}catch(e){E.toast('Dosya işlemi tamamlandı; tarayıcı taslak yedeği güncellenemedi.')}if(result.cacheWarning)E.toast('Dosya işlemi tamamlandı; tarayıcı proje arşivi güncellenemedi.')}catch(e){E.toast('Kaydedilemedi: '+e.message)}finally{button.disabled=false}
  }
  $('#projectFolderInput').onchange=async e=>{if(!e.target.files?.length)return;store.useFolderFiles(e.target.files);await renderProjects();$('#folderStatus').textContent+=' · Bu tarayıcıda klasör salt okunur; Kaydet dosya indirir.';e.target.value=''};
  $('#fileInput').onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const raw=await f.text(),p=Projects.parse(raw);await preserve();load(p)}catch(e){E.toast('Proje açılamadı: '+e.message)}e.target.value=''};
  $('#homeBtn').onclick=home;$('#dashboardOpen').onclick=open;$('#chooseProjectFolder').onclick=chooseFolder;$('#refreshProjects').onclick=()=>renderProjects(true);$('#resumeProject').onclick=()=>{showEditor();showLegacyCircuitWarning(E.getProject())};
  $('#newBtn').onclick=()=>createProject(E.getProject().workspaceMode);$('#openBtn').onclick=open;$('#saveBtn').onclick=()=>save();$('#exportBtn').onclick=()=>save(true);
  $('#dashboard').addEventListener('click',e=>{const b=e.target.closest?.('[data-new-mode]');if(!b||!$('#dashboard').contains(b))return;e.preventDefault();createProject(b.dataset.newMode)});
  for(const [id,p] of Object.entries(window.DTSStarterProjects)){p.defaultTemplate={id:'starter:'+id,readOnly:true};p.projectId='dts-default-'+id;const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value)}};freeze(p)}
  async function openStarter(id){
    if(safety.visible||!isHome)return;
    const ticket=projectRequests.begin();
    try{
      await preserve();
      if(!projectRequests.isCurrent(ticket)||!isHome||safety.visible)return;
      const examples=window.DTSStarterProjects;
      const starter=examples&&Object.prototype.hasOwnProperty.call(examples,id)?examples[id]:null;
      if(!starter){E.toast('Hazır örnek bulunamadı.');return}
      load(Projects.clean(starter));protectedNotice();
    }catch(e){if(projectRequests.isCurrent(ticket))E.toast('Örnek açılamadı: '+(e?.message||e))}
  }
  const quickStartButton=$('#quickStartProject');if(quickStartButton)quickStartButton.onclick=()=>openStarter('control');
  for(const b of document.querySelectorAll('[data-example]'))b.onclick=()=>openStarter(b.dataset.example);
  $('#saveExampleCopy').onclick=()=>save(true);
  $('#showOpeningWarning').checked=window.DTSSafety.showOnStart(localStorage);$('#showOpeningWarning').onchange=e=>{try{window.DTSSafety.setShow(localStorage,e.target.checked)}catch{e.target.checked=true;E.toast('Açılış tercihi kaydedilemedi.')}};$('#replayOpeningWarning').onclick=()=>safety.show('opening');
  document.addEventListener('keydown',e=>{if(!isHome&&!safety.visible&&(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save(e.shiftKey)}});
  // Drafts are automatic. Browser security still owns disk-file permissions and the tab-close confirmation UI.
  window.addEventListener('pagehide',()=>{if(!isHome&&!protectedProject())E.flushDraftSync?.()});
  window.addEventListener('beforeunload',e=>{if(isHome||protectedProject()||E.getProject().tutorialLesson||!fileDirty)return;E.flushDraftSync?.();e.preventDefault();e.returnValue=''});
  window.DTSStudio={store,safety,checkpoint,markDirty,markClean,home,load,open,save,createProject,renderProjects,repairDashboard:ensureDashboardIntegrity,protectedNotice,restoreExample,templateUI,get hasUnsavedFileChanges(){return fileDirty},get isProtected(){return protectedProject()},get isHome(){return isHome}};
  document.querySelector('.topbar').inert=true;document.querySelector('.app-shell').inert=true;
  if(window.DTSSafety.showOnStart(localStorage))safety.show('opening');
  window.DTSStudio.ready=(async()=>{const p=E.getProject();if(Projects.isProtected(p))templateOriginal=Projects.clean(p);if(p.components.length||p.panel?.items?.length)try{await store.put(p)}catch(e){E.toast('Eski taslak taşınamadı: '+e.message)}try{await store.restoreFolder()}catch{}await renderProjects()})();
})();
