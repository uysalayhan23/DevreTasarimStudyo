(function(){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const WorkspaceSpace=window.DTSWorkspaceSpace;
  const GRID=WorkspaceSpace?.gridScene||10,SHEET_W=WorkspaceSpace?.widthScene||2800,SHEET_H=WorkspaceSpace?.heightScene||1800,APP_VERSION='1.19.20';
  const Symbols=window.CCSSymbols,Simulation=window.CCSSimulation,Viewport=window.CCSViewport,Components=window.CCSComponents,Norms=window.CCSNorms,Labels=window.CCSLabels,Catalog=window.CCSCatalog,Selection=window.CCSSelection,Lines=window.CCSConductors,Leads=window.DTSProbeLeads,Sensors=window.CCSSensors,Clamp=window.DTSClampMeter,Physical=window.DTSPhysicalMetadata;
  const Arduino=window.DTSArduino,Workspaces=window.DTSWorkspaces,favorites=Workspaces.favorites(localStorage);
  const allLib=Catalog.prepare(Symbols.prepareLibrary(window.DTSDesignLibrary.extend(window.COMPONENT_LIBRARY)));
  const libraryKey=d=>String(d?.name||'').toLocaleLowerCase('tr-TR').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ç/g,'c').replace(/\s+/g,' ').trim();
  const hiddenFromLibrary=d=>d?.kind==='meter-ohm'||['meter-ohm','meter-ohmmeter'].includes(d?.id)||/\bohm\s*metre\b|\bohmmetre\b/.test(libraryKey(d))||/\benstrumantasyon\s+sensoru\b/.test(libraryKey(d))||(d?.isPLC&&!(d.pins||[]).length);
  const lib=allLib.filter(d=>!hiddenFromLibrary(d));
  const byId=Object.fromEntries(allLib.map(x=>[x.id,x]));
  const els={scene:$('#scene'),workspace:$('#workspace'),viewport:$('#viewport'),library:$('#componentLibrary'),empty:$('#emptyHint'),search:$('#searchInput'),cats:$('#categoryTabs'),group:$('#libraryGroupFilter'),brands:$('#brandFilters'),simulate:$('#simulateBtn'),guard:$('#plcGuard'),count:$('#objectCount'),status:$('#statusText'),toast:$('#toast'),form:$('#propertyForm'),none:$('#noSelection'),props:$('#propertiesPanel')};
  const propertiesReopen=$('#openProperties');
  function armTutorialPropertyEdit(e){
    if(!project?.tutorialLesson||!e.target?.matches?.('input,select,textarea'))return;
    tutorialPropertyPass=true;queueMicrotask(()=>{tutorialPropertyPass=false});
  }
  els.props.addEventListener('change',armTutorialPropertyEdit,true);
  els.props.addEventListener('input',armTutorialPropertyEdit,true);
  let propertiesVisible=innerWidth>1050;
  function applyPropertiesVisibility(show=propertiesVisible){
    propertiesVisible=!!show;
    const compact=innerWidth<=1050;
    document.body.classList.toggle('properties-collapsed',!compact&&!propertiesVisible);
    els.props.classList.toggle('open',compact&&propertiesVisible);
    propertiesReopen.hidden=propertiesVisible;
    propertiesReopen.setAttribute('aria-expanded',String(propertiesVisible));
    $('#closeProperties')?.setAttribute('aria-expanded',String(propertiesVisible));
  }
  const wireMenu={menu:$('#wireContextMenu'),color:$('#contextWireColor'),role:$('#contextWireRole'),size:$('#contextWireSize'),apply:$('#applyWireContext')};
  const wireColors=Object.keys(Lines.colorNames);
  const colorNames=Lines.colorNames;
  const conductorRoles=[['L1','L1 faz'],['L2','L2 faz'],['L3','L3 faz'],['N','Nötr (N)'],['PE','Koruma iletkeni (PE)'],['+24V','+24 VDC'],['DC+','Uyartım +5–15 VDC'],['0V','0 V / M'],['CONTROL','Kumanda'],['SIGNAL','Sinyal'],['SPARE','Yedek']];
  const defaultColorRoles=Lines.defaults;
  let project={version:7,workspaceMode:'control',projectId:window.DTSProjects.uid(),symbolNorm:Norms.normalize(localStorage.getItem('ccs-norm')),name:'Kumanda Devresi 1',components:[],wires:[],junctions:[],colorRoles:clone(defaultColorRoles)};
  let selected=null,selectedIds=new Set(),gesture=null,selectedWire=null,pendingPort=null,reconnecting=null,draftPoints=[],draftMouse=null,alignmentGuides=[],renderedWirePoints={},routingUsage=new Map(),routeObstacles=[],running=false,zoom=1,category='electrical',group='all',brand='all',series='all',wireColor=wireColors[0],history=[],future=[],saveTimer,labelDragging=false;
  let simulationTimer=null,reconnectReleaseCleanup=null,labelCancel=null,sensorFrame=null,sensorTime=null,liveEditWarningUntil=0;
  let tutorialPropertyPass=false;
  let appearance=['iec','material'].includes(localStorage.getItem('ccs-appearance'))?localStorage.getItem('ccs-appearance'):'iec';
  const sound=window.CCSAudio.create({enabled:localStorage.getItem('ccs-sound')!=='off'}),heldPointers=new Map();
  const actuations=window.CCSActuation.create({
    valid:id=>running&&project.components.some(c=>c.id===id),
    visual:showPress,
    commit:(id,value)=>{
      const c=project.components.find(c=>c.id===id),d=c&&byId[c.typeId];if(!running||!d)return;
      if(value==='toggle'){
        if(d.positions||d.kind==='selector3'||d.kind==='selector4'){c.position=((c.position||0)+1)%(d.positions?.length||d.pins.length);c.state=c.position>0}
        else c.state=!c.state;
      }else c.state=value;
      render(true);updateProperties();scheduleSave();
    }
  });

  function uid(prefix){return prefix+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function clone(v){return JSON.parse(JSON.stringify(v))}
  function materialDefinition(c,d){
    const assembled=window.DTSAssemblies.definition(d,c,appearance);
    return appearance==='material'&&Physical?.materialDefinition?Physical.materialDefinition(assembled):assembled;
  }
  function wireOverDeviceBody(d){
    return appearance==='material'&&Physical?.get?.(d)?.wireOverBody===true;
  }
  function materialLayoutWarning(){
    if(appearance!=='material'||project.workspaceMode==='panel'||!Physical?.materialLayoutAudit)return null;
    const audit=Physical.materialLayoutAudit(project.components,byId);
    if(audit.overlapCount)toast('Gerçek fiziksel ölçek uygulandı · '+audit.overlapCount+' malzeme çakışması tespit edildi. Yerleşimi kontrol edin.');
    return audit;
  }
  function migrateProject(p){
    p=window.DTSProjects.migrate?.(p)||window.DTSProjects.normalizeLegacy?.(p)||p;
    p.junctions=Array.isArray(p.junctions)?p.junctions:[];p.components=Array.isArray(p.components)?p.components:[];p.wires=Array.isArray(p.wires)?p.wires:[];
    window.DTSInstruments.migrate(p,byId);
    const legacyLm358=new Set(p.components.filter(c=>c.typeId==='lm358p-opamp-a').map(c=>c.id));
    if(legacyLm358.size){
      const pinMap={'OUT':'1','IN-':'2','IN+':'3','V-':'4','V+':'8'};
      for(const c of p.components)if(legacyLm358.has(c.id)){c.typeId='lm358p-dip8';if(c.ref==='U1A')c.ref='U1';c.label=String(c.label||'LM358P').replace(/A kanalı|Unit A/gi,'').replace(/\s+·\s*$/,'').trim()||'LM358P';c.physicalPackageUpgrade='PDIP-8'}
      for(const w of p.wires||[])for(const end of ['from','to']){const r=w[end];if(r&&legacyLm358.has(r.c)&&pinMap[r.p])r.p=pinMap[r.p]}
      for(const c of p.components||[]){const t=c.probeTarget;if(t&&legacyLm358.has(t.c)&&pinMap[t.p])t.p=pinMap[t.p]}
    }
    p.components.forEach(c=>{if(c.typeId==='plug-1p'&&p.wires.some(w=>[w.from,w.to].some(r=>r.c===c.id&&r.p==='PE')))c.typeId='plug-1p-earthed';const step=Leads.floating(byId[c.typeId])?0.001:GRID;c.x=Math.round((c.x||0)/step)*step;c.y=Math.round((c.y||0)/step)*step;delete c._pressed;c._spin=0;Labels.sanitize(c)});
    p.junctions.forEach(j=>{j.x=Math.round(j.x/GRID)*GRID;j.y=Math.round(j.y/GRID)*GRID});
    p.colorRoles={...defaultColorRoles,...(p.colorRoles||{})};
    p.wires.forEach(w=>{w.points=(w.points||w.fixedPoints||[]).map(q=>({x:Math.round(q.x/GRID)*GRID,y:Math.round(q.y/GRID)*GRID}));w.role=w.role||p.colorRoles[w.color]||'CONTROL';delete w.fixedPoints});p.version=window.DTSProjects.CURRENT_VERSION||7;p.workspaceMode=Workspaces.normalize(p.workspaceMode);p.projectId=p.projectId||window.DTSProjects.uid();if(p.workspaceMode==='panel'){for(const c of p.panel?.items||[])if(c.typeId==='plug-1p'&&(p.panel?.wires||[]).some(w=>[w.from,w.to].some(r=>r?.c===c.id&&r?.p==='PE')))c.typeId='plug-1p-earthed';p.panel=window.DTSPanel.normalize(p.panel,byId);}p.symbolNorm=Norms.normalize(p.symbolNorm);Leads.repairDuplicates(p,byId);Lines.initialize(p,byId);return p;
  }
  function snapshot(runtime=false){if(window.DTSProjects.isProtected(project)){if(runtime&&running)return true;window.DTSStudio?.protectedNotice();return false}history.push(JSON.stringify(window.DTSProjects.clean(project)));if(history.length>50)history.shift();future=[];if(!runtime)window.DTSStudio?.markDirty?.();return true}
  function persistDraftSync(){if(window.DTSProjects.isProtected(project)||project.tutorialLesson)return true;try{localStorage.setItem('ods-project',JSON.stringify(window.DTSProjects.clean(project)));return true}catch(e){toast('Otomatik taslak kaydı yapılamadı. Projenizi dosyaya kaydedin.');return false}}
  function flushDraftSync(){clearTimeout(saveTimer);saveTimer=null;return persistDraftSync()}
  function scheduleSave(){clearTimeout(saveTimer);if(window.DTSProjects.isProtected(project)||project.tutorialLesson)return;saveTimer=setTimeout(()=>{saveTimer=null;if(persistDraftSync()){window.DTSStudio?.checkpoint(project);!running&&setStatus('Otomatik kayıt güncel · Dosya kopyası için Kaydet')}},350)}
  function stop(){gesture?.cancel();labelCancel?.();resetDraft();running=false;cancelPressedControls();Arduino?.clear?.(project);window.DTSStudio?.restoreExample();render()}
  function guardEdit(){
    if(window.DTSProjects.isProtected(project)){window.DTSStudio?.protectedNotice();return false}
    if(window.DTSTutorialMode?.locksEditing?.(project)&&!tutorialPropertyPass){window.DTSTutorialMode.explainLock(project);return false}
    if(window.DTSStudio?.safety?.visible)return false;
    return true;
  }
  function wireGuardEdit(){
    if(window.DTSStudio?.safety?.visible)return false;
    if(window.DTSTutorialMode?.allowsGuidedWiring?.(project))return true;
    return guardEdit();
  }
  function electricalTouch(){
    if(!running)return false;
    liveEditWarningUntil=performance.now()+1800;
    toast('Simülasyon devam ediyor · Canlı devre üzerinde düzenleme yapıyorsunuz.');
    setStatus('Simülasyon çalışıyor · Kablo / terminal değişikliği canlı uygulanıyor','warn');
    return false;
  }
  function modeUI(){
    const panel=project.workspaceMode==='panel',arduinoMode=project.workspaceMode==='arduino';document.body.classList.toggle('panel-mode',panel);document.body.classList.toggle('arduino-mode',arduinoMode);
    $('#viewport').hidden=panel;$('#panelWorkspace').hidden=!panel;$('#circuitProperties').hidden=panel;$('#panelProperties').hidden=!panel;
    $('#modeBadge').textContent=Workspaces.modes.find(([id])=>id===project.workspaceMode)?.[1]||'';
    $('#sheetName').textContent=project.name;$('#wireStatus').hidden=panel;$('#gridStatus').textContent=panel?'Ölçüler mm · 5 mm yerleşim aralığı':arduinoMode?'Arduino grid · UNO / breadboard / hobi elektroniği':'2 mm grid · Tarayıcı taslağı';
    window.DTSPanelEditor?.resetSelection();window.DTSStudio?.templateUI();
  }
  function setStatus(text,type='ok'){els.status.innerHTML=`<i class="status-dot" style="background:${type==='warn'?'#f59e0b':'#2db67c'}"></i> ${esc(text)}`}
  function toast(msg){els.toast.textContent=msg;els.toast.classList.add('show');setTimeout(()=>els.toast.classList.remove('show'),1800)}
  function svg(tag,attrs={},html=''){const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(html)e.innerHTML=html;return e}

  function previewSvg(item){return Symbols.preview(item,appearance,project.symbolNorm)}

  function renderLibrary(){
    const modeLib=lib.filter(d=>!d.superseded&&!d.tutorialOnly&&(!d.terminalCount||d.terminalCount===1)&&(!d.spliceOutputs||d.spliceOutputs===2)&&Workspaces.includes(d,project.workspaceMode)&&(!d.isPLC||['Siemens','Delta','Omron','GMTCNT'].includes(d.brand)));if(project.workspaceMode==='building')category='electrical';if(project.workspaceMode==='arduino')category='arduino';
    const cats=project.workspaceMode==='building'?[['electrical','Tesisat / Dağıtım']]:project.workspaceMode==='arduino'?[['arduino','Arduino / Hobi']]:[['electrical','Elektrik'],['plc','PLC / Otomasyon'],['arduino','Arduino']],opts=(rows,first)=>`<option value="all">${first}</option>`+rows.map(([id,title])=>`<option value="${esc(id)}">${esc(title)}</option>`).join('');
    $('#libraryTitle').textContent=appearance==='material'?'3D Malzeme Kütüphanesi':project.symbolNorm+' Sembol Kütüphanesi';
    $('#symbolMode').value=appearance;$('#symbolNorm').value=project.symbolNorm;updateNormBadge();
    els.cats.innerHTML=cats.map(([id,title])=>`<button class="tab ${category===id?'active':''}" data-cat="${id}" role="tab" aria-selected="${category===id}">${title}</button>`).join('');
    const available=modeLib.filter(d=>Catalog.matches(d,{category})),availableGroups=Catalog.groups.filter(([id])=>available.some(d=>d.classification.group===id)).sort((a,b)=>a[1].localeCompare(b[1],'tr',{sensitivity:'base'}));
    if(group!=='all'&&group!=='favorites'&&!availableGroups.some(([id])=>id===group))group='all';
    els.group.innerHTML='<option value="favorites">★ Favorilerim</option>'+opts(availableGroups,'Tüm malzeme grupları');els.group.value=group;
    const brands=category==='plc'?[...new Set(available.map(d=>d.brand).filter(Boolean))]:[];els.brands.hidden=category!=='plc';if(brand!=='all'&&!brands.includes(brand))brand='all';
    els.brands.innerHTML=brands.length?['all',...brands].map(b=>`<button class="brand-chip ${brand===b?'active':''}" data-brand="${esc(b)}" aria-pressed="${brand===b}">${b==='all'?'Tüm markalar':esc(b)}</button>`).join(''):'';
    const families=category==='plc'?[...new Set(available.filter(d=>brand==='all'||d.brand===brand).map(d=>d.series).filter(Boolean))]:[];if(series!=='all'&&!families.includes(series))series='all';
    $('#seriesFilterRow').hidden=!families.length;$('#librarySeriesFilter').innerHTML=opts(families.map(s=>[s,s]),'Tüm PLC aileleri');$('#librarySeriesFilter').value=series;
    const filters={category,group:group==='favorites'?'all':group,brand,series,query:els.search.value};
    const sections=group==='favorites'?[{id:'favorites',title:'Favorilerim',items:favorites.list(modeLib).filter(d=>Catalog.matches(d,filters))}].filter(s=>s.items.length):Catalog.sections(modeLib,filters);
    const savedArduino=category==='arduino'&&Arduino?Arduino.savedBoards(localStorage):[];
    $('#libraryCount').textContent=`${sections.reduce((n,s)=>n+s.items.length,0)+savedArduino.length} eleman · ${sections.length+(savedArduino.length?1:0)} grup`;
    const card=x=>{const source=Norms.reference(x,project.symbolNorm),photo=window.CCSMaterials.info(x),photoLabel=photo.match==='exact'?'Ürün görseli':photo.match==='family'?'Aile / varyant görseli':'Temsili görsel';return `<div class="component-card" draggable="true" data-type="${x.id}" tabindex="0" role="button" aria-label="${esc(x.name)} ekle" title="${esc(appearance==='material'?(photo.part||photo.model):source.file+' · s. '+source.pages)} · Çalışma alanına sürükleyin"><div class="preview">${previewSvg(x)}</div><div class="card-caption"><strong>${esc(x.name)}</strong><small>${esc(appearance==='material'?(photo.part||photo.model):x.model)}</small>${x.diagramOnly?'<span class="photo-caption">'+(x.catalogGroup==='panel-layout'?'Pano yerleşimi':'Çizim ve bağlantı')+'</span>':''}${x.brand?`<span class="brand-caption">${esc(x.brand)}${x.series?' · '+esc(x.series):''}</span>`:''}${appearance==='material'&&x.isPLC?`<span class="photo-caption ${photo.match}">${photoLabel}</span>`:''}</div><button class="favorite-star ${favorites.has(x.id)?'is-favorite':''}" type="button" draggable="false" data-favorite="${x.id}" aria-pressed="${favorites.has(x.id)}" aria-label="${esc(x.name)} · favori" title="Favorilerime ekle / çıkar">★</button></div>`};
    const savedSection=savedArduino.length?`<section class="library-section arduino-saved-section"><h3>★ Programlı Arduino Kartlarım <span>${savedArduino.length}</span></h3><div class="library-section-items">${savedArduino.map(row=>`<div class="component-card arduino-saved-card" draggable="true" data-type="arduino-uno" data-arduino-saved="${esc(row.id)}" tabindex="0" role="button" aria-label="${esc(row.name)} programlı Arduino kartını ekle"><div class="preview">${previewSvg(byId['arduino-uno'])}</div><div class="card-caption"><strong>${esc(row.name)}</strong><small>UNO R3 · sketch kayıtlı</small><span class="brand-caption">Program kartla birlikte gelir</span></div></div>`).join('')}</div></section>`:'';
    const normalSections=sections.map(s=>`<section class="library-section" data-group="${s.id}"><h3>${esc(s.title)} <span>${s.items.length}</span></h3><div class="library-section-items">${s.items.map(card).join('')}</div></section>`).join('');
    els.library.innerHTML=savedSection+normalSections||'<div class="no-selection">Bu filtrelerle eşleşen eleman yok. <button id="resetFilters">Filtreleri temizle</button></div>';
    $$('.tab').forEach(b=>b.onclick=()=>{category=b.dataset.cat;group='all';brand='all';series='all';renderLibrary()});
    els.group.onchange=()=>{group=els.group.value||'all';renderLibrary()};
    $('#librarySeriesFilter').onchange=e=>{series=e.target.value;renderLibrary()};
    $$('.brand-chip').forEach(b=>b.onclick=()=>{brand=b.dataset.brand;series='all';renderLibrary()});
    if($('#resetFilters'))$('#resetFilters').onclick=()=>{category=project.workspaceMode==='arduino'?'arduino':'electrical';group=brand=series='all';els.search.value='';renderLibrary()};
    $$('[data-favorite]').forEach(b=>{b.onclick=e=>{e.preventDefault();e.stopPropagation();try{favorites.toggle(b.dataset.favorite);renderLibrary()}catch{toast('Favori kaydedilemedi; tarayıcı depolamasını kontrol edin.')}};b.onkeydown=e=>e.stopPropagation();b.ondragstart=e=>{e.preventDefault();e.stopPropagation()}});
    $$('.component-card').forEach(card=>card.addEventListener('dragstart',e=>{if(!guardEdit()){e.preventDefault();return}e.dataTransfer.setData('text/component',card.dataset.type);if(card.dataset.arduinoSaved)e.dataTransfer.setData('text/arduino-board',card.dataset.arduinoSaved);e.dataTransfer.effectAllowed='copy'}));
    $$('.component-card').forEach(card=>card.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.target.closest('[data-favorite]'))return;e.preventDefault();if(project.workspaceMode==='panel'){window.DTSPanelEditor?.add(card.dataset.type);return}const r=els.viewport.getBoundingClientRect(),p=canvasPoint({clientX:r.left+r.width/2,clientY:r.top+r.height/2});addComponent(card.dataset.type,p.x,p.y,card.dataset.arduinoSaved||'')}));
  }
  function updateNormBadge(){$('#sheetNorm').textContent=appearance==='material'?'3D':project.symbolNorm}


  function syncMechanicalEncoderBindings(){
    for(const c of project.components){const d=byId[c.typeId];if(!d?.incrementalEncoder38mm)continue;const motor=window.DTSIncrementalEncoder?.motorCoupling?.(project,byId,c);if(motor){c._encoderMotorId=motor.id;c._encoderMotorRef=motor.ref||motor.label||motor.id}else{delete c._encoderMotorId;delete c._encoderMotorRef}}
  }

  function render(simulationTick=false){
    if(project.workspaceMode==='panel'){running=false;clearTimeout(simulationTimer);syncSensorAnimation();sound.sync(project,byId,false);els.simulate.disabled=true;els.simulate.classList.remove('running');els.simulate.textContent='PANO YERLEŞİMİ';els.guard.hidden=true;window.DTSPanelEditor?.render();if(!simulationTick)scheduleSave();return}
    clearTimeout(simulationTimer);simulationTimer=null;
    window.DTSAssemblies.sync(project,byId,appearance);
    Lines.synchronize(project,byId);syncMechanicalEncoderBindings();
    if(running)runSolver();
    syncSensorAnimation();
    if(!running){actuations.cancelAll();heldPointers.clear();project.components.forEach(c=>{c._pressed=false;if(byId[c.typeId]?.controlMode==='momentary'){c.state=false;if(byId[c.typeId]?.independentContacts)c.switchStates={}}});Simulation.clear(project);Arduino?.clear?.(project)}
    window.DTSV20UI.sync();window.DTSACS800UI.sync();window.DTSHCFAUI?.sync();
    sound.sync(project,byId,running);
    els.simulate.classList.toggle('running',running);els.simulate.textContent=running?'■ DURDUR':'▶ SİMÜLE ET';
    if(simulationTick&&els.scene.querySelectorAll('g.component').length===project.components.length){
      updateSimulationPresentation();return;
    }
    els.scene.innerHTML='';
    renderedWirePoints={};routingUsage=new Map();routeObstacles=componentObstacles();
    project.components.filter(c=>!Leads.floating(byId[c.typeId])&&wireOverDeviceBody(byId[c.typeId])).forEach(c=>renderComponentBackdrop(c));
    project.wires.filter(w=>!w.probeLead).forEach((w,i)=>renderWire(w,i));
    syncProbePositions();
    syncClampPositions();
    (project.junctions||[]).forEach(j=>els.scene.appendChild(svg('circle',{class:'junction','data-junction':j.id,cx:j.x,cy:j.y,r:5})));
    alignmentGuides.forEach(g=>els.scene.appendChild(svg('line',{class:'alignment-guide',x1:g.axis==='x'?g.value:0,y1:g.axis==='y'?g.value:0,x2:g.axis==='x'?g.value:SHEET_W,y2:g.axis==='y'?g.value:SHEET_H})));
    project.components.filter(c=>!Leads.floating(byId[c.typeId])).forEach(c=>renderComponent(c));
    renderTerminalLeads();
    renderWireEditors();
    renderDraftWire();
    renderNotes();
    renderMeasurementOverlay();
    els.empty.style.display=project.components.length?'none':'flex';
    els.count.textContent=`${project.components.length} eleman · ${project.wires.length} bağlantı`;
    const hasPLC=project.components.some(c=>{const d=byId[c.typeId];return d?.isPLC||d?.visualOnly});
    els.guard.hidden=!hasPLC;els.simulate.disabled=hasPLC;
    if(hasPLC&&running){running=false;els.simulate.classList.remove('running');els.simulate.textContent='▶ SİMÜLE ET'}
    updateWireStatus();window.DTSTutorialMode?.sync?.(project);if(!simulationTick){updateProperties();scheduleSave();window.DTSArduinoIDE?.refresh?.()}
  }

  function paletteColors(){return [...new Set([...wireColors,...Object.keys(project.colorRoles||{})])]}
  function updateWireStatus(){
    const w=project.wires.find(x=>x.id===selectedWire),color=w?.color||wireColor,role=w?.role||project.colorLocks?.[color]||project.colorRoles?.[color]||'CONTROL';
    $('#wireStatus').textContent=`Kablo: ${colorNames[color]||color} · ${roleName(role)} · ${w?.probeLead?w.size:project.colorSizes?.[color]||w?.size||'1,5 mm²'}`;
    $('#wireSize').value=Lines.sizeLabel(w?.probeLead?w.size:project.colorSizes?.[wireColor]||1.5);
    $('#wireRole').innerHTML=(w?.probeLead?[['MEASURE','Ölçüm probu']]:w?.freeColor?[['FREE','Sinyal · serbest renk']]:conductorRoles).map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('');
    $('#wireRole').value=w?.probeLead?'MEASURE':w?.freeColor?'FREE':project.colorLocks?.[wireColor]||project.colorRoles?.[wireColor]||'CONTROL';$('#wireRole').disabled=!!w?.probeLead||!!w?.freeColor;
    $('#wireRoleHelp').textContent=w?.probeLead?'Probun rengi hat kimliğini değiştirmez.':w?.freeColor?'EX / SIG uçlarında renk serbesttir.':'Hat ve gerilim etiketini seçebilirsiniz. Gerçek gerilimi devrenin beslemesi belirler.';
    $('#wireVoltage').value=project.colorVoltages?.[wireColor]||'Otomatik';$('#wireVoltage').disabled=!!w?.probeLead||!!w?.freeColor;
    $$('.color-dot').forEach(x=>x.classList.toggle('active',x.dataset.color===wireColor));
  }
  function populateWireMenu(){
    $('#colorPalette').innerHTML=paletteColors().map(c=>`<button class="color-dot" type="button" style="background:${c}" data-color="${c}" title="${colorNames[c]||c} · ${roleName(project.colorRoles?.[c])}" aria-label="${colorNames[c]||c}"></button>`).join('');
    $('#wireRole').innerHTML=conductorRoles.map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('');
    $('#wireVoltage').innerHTML=Lines.voltageOptions.map(v=>`<option>${esc(v)}</option>`).join('');
    $('#wireSize').innerHTML=wireMenu.size.innerHTML=Lines.sizes.map(v=>`<option>${v}</option>`).join('');
    wireMenu.role.innerHTML=conductorRoles.map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('');
    updateWireStatus();
  }
  let contextWireId=null;
  function hideWireMenu(){wireMenu.menu.hidden=true;contextWireId=null}
  function openWireMenu(w,e){
    selectedWire=w.id;wireColor=w.color;setSelection([]);refreshSelection();contextWireId=w.id;
    wireMenu.color.innerHTML=w.probeLead?`<option value="${w.color}">${esc(colorNames[w.color])} · Ölçüm probu</option>`:paletteColors().map(c=>`<option value="${c}" ${!w.freeColor&&project.colorLocks?.[c]&&project.colorLocks[c]!==w.role?'disabled':''}>${esc(colorNames[c]||c)}${project.colorLocks?.[c]?' · '+esc(project.colorLocks[c]):''}</option>`).join('');
    wireMenu.role.innerHTML=(w.probeLead?[['MEASURE','Ölçüm probu']]:w.freeColor?[['FREE','Sinyal · serbest renk']]:conductorRoles).map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('');
    wireMenu.color.value=w.color;wireMenu.role.value=w.role;wireMenu.role.disabled=true;
    wireMenu.size.value=Lines.sizeLabel(w.probeLead?w.size:project.colorSizes?.[w.color]||w.size);
    wireMenu.menu.hidden=false;wireMenu.menu.style.left=`${Math.max(0,Math.min(e.clientX,innerWidth-255))}px`;wireMenu.menu.style.top=`${Math.max(0,Math.min(e.clientY,innerHeight-310))}px`;
  }
  function applyWireMenu(){
    const w=project.wires.find(x=>x.id===contextWireId);if(!w){hideWireMenu();return}if(w.mechanical||w.role==='MECHANICAL'){hideWireMenu();toast('SHAFT mekanik bağlantısında elektriksel renk/rol ayarı yoktur.');return}
    const color=wireMenu.color.value||w.color;
    if(!w.probeLead&&!w.freeColor&&project.colorLocks?.[color]&&project.colorLocks[color]!==w.role){toast('Bu renk '+project.colorLocks[color]+' hattına kilitli.');return}
    if(!snapshot())return;const result=Lines.recolor(project,byId,w.id,color,wireMenu.size.value);
    if(!result.ok){history.pop();toast(result.reason);return}
    selectedWire=w.id;wireColor=result.color;hideWireMenu();populateWireMenu();w.probeLead?renderMeasurements():render();setStatus(roleName(result.role)+' kablo ayarları güncellendi');
  }

  function renderComponentBackdrop(c,parent=els.scene){
    const d=byId[c.typeId];if(!d||!wireOverDeviceBody(d))return;
    const g=svg('g',{class:'component-backdrop material-device-body','data-component-backdrop':c.id,'data-id':c.id,transform:'translate('+c.x+' '+c.y+')'});
    if(Number.isFinite(c._sc11SpeedPercent))g.setAttribute('style','--shaft-duration:'+Math.max(.4,8/Math.max(.1,c._sc11SpeedPercent/10))+'s');else if(c._motorHz!==undefined)g.setAttribute('style','--shaft-duration:'+Math.max(.2,55/Math.max(.1,c._motorHz))+'s');
    g.innerHTML=Symbols.markup(materialDefinition(c,d),c,{pending:pendingPort,mode:appearance,norm:project.symbolNorm,includeNote:false,wireBodyOnly:true});
    parent.appendChild(g);
  }
  function renderComponent(c,parent=els.scene){
    const d=byId[c.typeId];if(!d)return;
    const g=svg('g',{class:Symbols.classes(d,c,appearance)+(selectedIds.has(c.id)?' selected':''),'data-id':c.id,transform:'translate('+c.x+' '+c.y+')'});
    if(Number.isFinite(c._sc11SpeedPercent))g.setAttribute('style','--shaft-duration:'+Math.max(.4,8/Math.max(.1,c._sc11SpeedPercent/10))+'s');else if(c._motorHz!==undefined)g.setAttribute('style','--shaft-duration:'+Math.max(.2,55/Math.max(.1,c._motorHz))+'s');
    g.innerHTML=Symbols.markup(materialDefinition(c,d),c,{pending:pendingPort,mode:appearance,norm:project.symbolNorm,includeNote:false,wireOverlayOnly:wireOverDeviceBody(d)});
    if(d.kind==='clamp-meter'){
      g.dataset.clampJawState=c._clampJawOpen?'open':'closed';
      if(c._clampJawOpen){
        const overlay=svg('g',{class:'clamp-jaw-open-indicator','data-clamp-jaw-state':'open','pointer-events':'none'});
        const scale=c.materialScale||1;
        const q=Symbols.rotatedPoint({x:d.w/2,y:65},d,c.rotation||0);
        overlay.appendChild(svg('path',{d:'M '+(q.x*scale-22)+' '+(q.y*scale-8)+' Q '+(q.x*scale-18)+' '+(q.y*scale-29)+' '+(q.x*scale-3)+' '+(q.y*scale-34),
          fill:'none',stroke:'#e29a26','stroke-width':4,'stroke-linecap':'round'}));
        overlay.appendChild(svg('path',{d:'M '+(q.x*scale+22)+' '+(q.y*scale-8)+' Q '+(q.x*scale+18)+' '+(q.y*scale-29)+' '+(q.x*scale+3)+' '+(q.y*scale-34),
          fill:'none',stroke:'#e29a26','stroke-width':4,'stroke-linecap':'round'}));
        g.appendChild(overlay);
      }
    }
    parent.appendChild(g);
    prepareLabelInteraction(g);
  }
  function flowClass(w){if(!w?._flowActive)return w?._flowCertainty==='ambiguous'?'flow-ambiguous':'';if(w._flowCertainty==='ambiguous')return'flow-ambiguous';if(w._flowMode==='ac')return'flow-ac';return w._flowDirection<0?'flow-reverse':'flow-forward'}
  function updateSimulationPresentation(){
    const wireById=new Map(project.wires.map(w=>[w.id,w]));
    for(const g of els.scene.querySelectorAll('[data-wire]')){const w=wireById.get(g.dataset.wire),line=g.querySelector('.wire');if(!w||!line)continue;line.classList.toggle('energized',!!w._active);for(const cls of ['flow-forward','flow-reverse','flow-ac','flow-ambiguous'])line.classList.remove(cls);const fc=flowClass(w);if(fc)line.classList.add(fc);line.setAttribute('data-flow-direction',String(w._flowDirection||0));line.setAttribute('stroke',w.color);line.setAttribute('style','color:'+w.color);if(!w.probeLead)g.setAttribute('style',wireStyle(w));const label=g.querySelector('.wire-role-label');if(label)label.textContent=w.freeColor?'':w.role+(Lines.voltageLabel(project,w.color)?' · '+Lines.voltageLabel(project,w.color):'')}
    for(const g of els.scene.querySelectorAll('g.component')){
      const c=project.components.find(c=>c.id===g.dataset.id),d=c&&byId[c.typeId];if(!d)continue;
      if(c.id===selected&&d.positions)$('#propPacketPosition').value=c.position||0;
      if(Number.isFinite(c._sc11SpeedPercent))g.setAttribute('style','--shaft-duration:'+Math.max(.4,8/Math.max(.1,c._sc11SpeedPercent/10))+'s');else if(c._motorHz!==undefined)g.setAttribute('style','--shaft-duration:'+Math.max(.2,55/Math.max(.1,c._motorHz))+'s');else g.removeAttribute('style');
      g.setAttribute('class',Symbols.classes(d,c,appearance)+(selectedIds.has(c.id)?' selected':''));
      if(appearance!=='material'||d.materialSymbol||d.designMaterial||c.auxFor||c._damaging||d.liveMaterial||d.id==='sinamics-v20-1p'||d.instrument||d.kind==='multimeter'){
        const motion=g.querySelector('.motion-indicator');
        g.innerHTML=Symbols.markup(materialDefinition(c,d),c,{pending:pendingPort,mode:appearance,norm:project.symbolNorm,includeNote:false,wireOverlayOnly:wireOverDeviceBody(d)});
        if(motion)g.querySelector('.motion-indicator')?.replaceWith(motion);
        // Native RC, audio RMS and power readouts survive this live-material SVG redraw.
        if(c._sc81NativePower||c._sc82NativePower||c._sc78NativeTone||c._sc80NativeEnvelope){
          const readout=window.DTSDeviceBehavior.markup(c,d,appearance);
          if(readout)g.insertAdjacentHTML('beforeend',readout);
        }
        prepareLabelInteraction(g);continue;
      }
      // Keep the material nodes alive: animations and cable routes survive a solve.
      const material=g.querySelector('.material-layer');
      if(material){
        const expected=window.CCSMaterials.family(d,c);if(material.dataset.material!==expected||window.DTSDeviceBehavior.analog(d)||d.arduinoPeripheral)material.outerHTML=window.CCSMaterials.markup(d,c);
      }
      for(const p of g.querySelectorAll('.port-group'))p.querySelector('.port')?.classList.toggle('energized',!!c._hot?.includes(p.dataset.port));
      const label=g.querySelector('.rotation-label');if(label)label.textContent=Symbols.directionText(c);
      const packet=g.querySelector('.packet-position');if(packet)packet.textContent=d.positions[c.position||0];
      const frequency=g.querySelector('[data-label-key="frequency"] text');if(frequency)frequency.textContent=c._active?(c._driveFrequency||0)+' Hz':'DURDU';
      const speed=g.querySelector('[data-label-key="speed"] text');if(speed)speed.textContent=c._active?(c._motorSpeed==='high'?'YÜKSEK DEVİR':'DÜŞÜK DEVİR'):'';
      const light=g.querySelector('.custom-lamp-color');if(light){light.setAttribute('opacity',c._active?'.85':'.28');light.setAttribute('style',c._active?'filter:drop-shadow(0 0 7px '+Components.deviceColor(c,d)+')':'')}
      const analog=g.querySelector('.analog-device'),analogMarkup=window.DTSDeviceBehavior.markup(c,d,appearance);if(analog)analog.outerHTML=analogMarkup;else if(analogMarkup)g.insertAdjacentHTML('beforeend',analogMarkup);
      const target=g.querySelector('.sensor-environment'),targetMarkup=Sensors.markup(c,d);
      if(target)target.outerHTML=targetMarkup;else if(targetMarkup)g.insertAdjacentHTML('beforeend',targetMarkup);
    }
    renderNotes();updateSensorReadout();
  }
  function showPress(id,down,restart=false){
    const c=project.components.find(c=>c.id===id);if(!c)return;c._pressed=down;
    const g=[...els.scene.querySelectorAll('g.component')].find(g=>g.dataset.id===id);if(!g)return;
    g.classList.toggle('pressing',down);
    const cap=g.querySelector('.material-actuator');
    if(cap?.animate){
      (cap.getAnimations?.()||[]).forEach(a=>a.cancel());
      cap.animate(down?[{transform:'translateY(0) scale(1)',filter:'brightness(1)'},{transform:'translateY(2.5px) scale(.88)',filter:'brightness(.78)'}]:[{transform:'translateY(2.5px) scale(.88)',filter:'brightness(.78)'},{transform:'translateY(0) scale(1)',filter:'brightness(1)'}],{duration:down?85:100,easing:'ease-out'});
    }
    if(down&&restart)sound.click();
  }
  function updateSensorProperties(c,d){
    const supported=Sensors.supported(d);$('#sensorSettings').hidden=!supported;if(!supported)return;
    $('#sensorPrincipleHelp').textContent=d.reedSensor?'Kablosuz mıknatısı sürükleyin. Reed pasif kuru kontaktır; ayrı sensör beslemesi gerekmez. NO yakında kapanır, NC açılır. 10 mm varsayılan eğitim eşiğidir; ürünün ölçülmüş algılama mesafesi değildir.':'Hedefi sayfada tutup sürükleyin. İndüktif: metal; kapasitif: dolu hedefler; optik: opak malzeme / reflektör. Elektronik sensör çıkışı için besleme gerekir.';
    const s=Sensors.settings(c,d);$('#propSensorTarget').value=s.target;$('#propSensorTarget').disabled=!!d.reedSensor;$('#propSensorRange').value=s.range;
    $('#propSensorFace').value=s.face;$('#propSensorAuto').checked=s.auto;
    $('#propSensorDistance').max=Math.max(200,s.range*3,s.distance);$('#propSensorDistance').value=s.distance;
    $('#propSensorAuto').disabled=s.target==='none';$('#propSensorDistance').disabled=s.target==='none';
    updateSensorReadout();
  }
  function updateSensorReadout(){
    const c=project.components.find(c=>c.id===selected),d=c&&byId[c.typeId];if(!d||!Sensors.supported(d))return;
    const s=Sensors.detect(c,d);$('#sensorDistanceOutput').textContent=s.distance.toFixed(1)+' mm'+(d.sensorPrinciple==='ultrasonic'?' · yankı '+(2*s.distance/.343).toFixed(0)+' µs':'');
    $('#propSensorDistance').value=s.distance;
    $('#sensorDetection').textContent=!s.enabled?'Elle tetikleme':!s.compatible?'Bu malzeme algılanmaz':!s.within?'Hedef algılama alanının dışında':!running?'Hedef algılama alanında':d.reedSensor?'Mıknatıs yakın · pasif kontak':!c._active?'Hedef algılama alanında · Sensör beslemesiz':s.detected?'Hedef algılandı':'Hedef algılanmadı';
  }
  function changeSensor(mutator){
    const c=project.components.find(c=>c.id===selected),d=c&&byId[c.typeId];if(!d||!Sensors.supported(d))return;
    if(!snapshot())return;const s=Sensors.settings(c,d);mutator(s);c.sensing=s;render(true);updateSensorProperties(c,d);scheduleSave();
  }
  function beginSensorDrag(c,e){
    if(gesture||labelDragging)return;e.preventDefault();e.stopPropagation();
    selectedWire=null;setSelection([c.id]);refreshSelection();
    const d=byId[c.typeId],start=Sensors.beginDrag(c,d),point=worldPoint(e),previous=clone(c.sensing||{}),oldFuture=[...future];let moved=false;
    trackGesture(e,{
      move:ev=>{
        if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<2)return;
        if(!moved){if(!snapshot(true))return;moved=true}
        const next=worldPoint(ev);Sensors.drag(c,d,start,{x:(next.x-point.x)/(c.materialScale||1),y:(next.y-point.y)/(c.materialScale||1)});
        render(true);updateSensorProperties(c,d);
      },
      finish:cancelled=>{
        if(cancelled&&moved){c.sensing=previous;history.pop();future=oldFuture}
        if(moved){render(true);updateSensorProperties(c,d);scheduleSave()}
      }
    });
  }
  function syncSensorAnimation(){
    const autoSensors=running&&project.components.some(c=>{const d=byId[c.typeId];return d&&Sensors.supported(d)&&Sensors.settings(c,d).target!=='none'&&Sensors.settings(c,d).auto});
    const manualEncoder=!running&&project.components.some(c=>{const d=byId[c.typeId];return d?.incrementalEncoder38mm&&!window.DTSIncrementalEncoder.motorCoupling(project,byId,c)&&c.encoderAuto!==false&&Math.abs(Number(c.encoderRPM)||0)>.01});
    const enabled=!document.hidden&&(autoSensors||manualEncoder);
    if(!enabled){if(sensorFrame!==null)cancelAnimationFrame(sensorFrame);sensorFrame=null;sensorTime=null;return}
    if(sensorFrame!==null)return;
    sensorFrame=requestAnimationFrame(time=>{
      sensorFrame=null;if(document.hidden){sensorTime=null;return}
      if(sensorTime===null)sensorTime=time;
      if(time-sensorTime<32){syncSensorAnimation();return}
      const dt=Math.min(.1,(time-sensorTime)/1000);sensorTime=time;
      if(running)for(const c of project.components){const d=byId[c.typeId];if(d&&Sensors.supported(d))Sensors.advance(c,d,dt)}
      for(const c of project.components){const d=byId[c.typeId];if(!running&&d?.incrementalEncoder38mm&&!window.DTSIncrementalEncoder.motorCoupling(project,byId,c)&&c.encoderAuto!==false&&Math.abs(Number(c.encoderRPM)||0)>.01)window.DTSIncrementalEncoder.state(c,d,time,true)}
      render(true);
    });
  }
  function portPosition(c,d,p){
    d=materialDefinition(c,d);p=d.pins.find(q=>q.id===p.id)||p;
    const pos=Symbols.rotatedPoint(p,d,c.rotation||0);return {x:c.x+pos.x*(c.materialScale||1),y:c.y+pos.y*(c.materialScale||1)};
  }

  function absolutePort(ref){const c=project.components.find(x=>x.id===ref.c),d=c&&byId[c.typeId],p=d&&d.pins.find(x=>x.id===ref.p);return p?portPosition(c,d,p):{x:0,y:0}}
  function rotatedSide(side,rotation){return Symbols.rotatedSide(side,rotation||0)}

  function endpointInfo(ref){
    if(ref?.j){const j=(project.junctions||[]).find(x=>x.id===ref.j),pos=j?{x:j.x,y:j.y}:{x:0,y:0};return{pos,stub:pos,componentId:null}}
    const c=project.components.find(x=>x.id===ref?.c),d=c&&materialDefinition(c,byId[c.typeId]),p=d&&d.pins.find(x=>x.id===ref?.p);if(!p)return{pos:{x:0,y:0},stub:{x:0,y:0},componentId:null};
    const pos=portPosition(c,d,p),side=rotatedSide(p.side,c.rotation),v={top:[0,-1],right:[1,0],bottom:[0,1],left:[-1,0]}[side],stub={x:pos.x+v[0]*GRID,y:pos.y+v[1]*GRID};
    if(appearance==='material'&&d.instrument==='tx11'){
      const scale=c.materialScale||1,world=q=>{const a=Symbols.rotatedPoint(q,d,c.rotation||0);return {x:c.x+a.x*scale,y:c.y+a.y*scale}},top=p.side==='top',offset=top&&p.y>40?-GRID:0,local=[{x:p.x,y:p.y},{x:p.x,y:p.y+(top?-GRID:GRID)},...(offset?[{x:p.x+offset,y:p.y-GRID}]:[]),{x:p.x+offset,y:top?-GRID:d.h+GRID}],lead=local.map(world),corners=[[0,0],[d.w,0],[d.w,d.h],[0,d.h]].map(([x,y])=>world({x,y})),body={left:Math.min(...corners.map(q=>q.x)),right:Math.max(...corners.map(q=>q.x)),top:Math.min(...corners.map(q=>q.y)),bottom:Math.max(...corners.map(q=>q.y))};
      return {pos,stub:lead.at(-1),lead,body,componentId:c.id,side};
    }return{pos,stub,lead:[pos,stub],componentId:c.id,side}
  }
  function snapDraggedComponent(c){
    const d=byId[c.typeId],others=[];project.components.filter(x=>!selectedIds.has(x.id)&&!Leads.floating(byId[x.typeId])).forEach(o=>{const od=byId[o.typeId];od.pins.forEach(p=>others.push({pos:portPosition(o,od,p),side:rotatedSide(p.side,o.rotation)}))});
    let bestX=null,bestY=null;
    d.pins.forEach(p=>{const pos=portPosition(c,d,p),side=rotatedSide(p.side,c.rotation);others.forEach(o=>{if(['top','bottom'].includes(side)&&['top','bottom'].includes(o.side)){const delta=o.pos.x-pos.x;if(Math.abs(delta)<=8&&(!bestX||Math.abs(delta)<Math.abs(bestX.delta)))bestX={delta,value:o.pos.x}}if(['left','right'].includes(side)&&['left','right'].includes(o.side)){const delta=o.pos.y-pos.y;if(Math.abs(delta)<=8&&(!bestY||Math.abs(delta)<Math.abs(bestY.delta)))bestY={delta,value:o.pos.y}}})});
    if(bestX)c.x+=bestX.delta;if(bestY)c.y+=bestY.delta;alignmentGuides=[...(bestX?[{axis:'x',value:bestX.value}]:[]),...(bestY?[{axis:'y',value:bestY.value}]:[])];
  }
  function cleanPoints(points){
    const out=[];
    points.forEach(p=>{const n={x:Math.round(p.x*100)/100,y:Math.round(p.y*100)/100},last=out[out.length-1];if(!last||last.x!==n.x||last.y!==n.y)out.push(n)});
    let changed=true;
    while(changed){changed=false;for(let i=1;i<out.length-1;i++){const a=out[i-1],b=out[i],c=out[i+1];if((a.x===b.x&&b.x===c.x)||(a.y===b.y&&b.y===c.y)){out.splice(i,1);changed=true;break}}}
    return out;
  }
  function componentObstacles(){return project.components.filter(c=>byId[c.typeId]?.kind!=='clamp-meter'&&!Leads.floating(byId[c.typeId])&&!(appearance==='material'&&c.auxFor)).map(c=>{const base=materialDefinition(c,byId[c.typeId]),scale=c.materialScale||1,d={...base,w:base.w*scale,h:base.h*scale},quarter=((c.rotation||0)%180+180)%180===90,cx=c.x+d.w/2,cy=c.y+d.h/2,w=quarter?d.h:d.w,h=quarter?d.w:d.h;return{left:cx-w/2-GRID*.7,right:cx+w/2+GRID*.7,top:cy-h/2-GRID*.7,bottom:cy+h/2+GRID*.7}})}
  function heapPush(heap,node){heap.push(node);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p].f<=node.f)break;heap[i]=heap[p];i=p}heap[i]=node}
  function heapPop(heap){if(!heap.length)return null;const root=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let l=i*2+1,r=l+1;if(l>=heap.length)break;let c=r<heap.length&&heap[r].f<heap[l].f?r:l;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c}heap[i]=last}return root}
  function gridRoute(from,to,preferredDir=null){
    const snap=p=>({x:Math.max(0,Math.min(SHEET_W,Math.round(p.x/GRID)*GRID)),y:Math.max(0,Math.min(SHEET_H,Math.round(p.y/GRID)*GRID))}),s=snap(from),goal=snap(to),cell=p=>`${p.x},${p.y}`,state=(p,dir)=>`${p.x},${p.y},${dir}`,goalCell=cell(goal);
    if(cell(s)===goalCell)return[s];
    const directions=[[GRID,0],[-GRID,0],[0,GRID],[0,-GRID]],startKey=state(s,preferredDir??-1),blocked=p=>cell(p)!==cell(s)&&cell(p)!==goalCell&&routeObstacles.some(o=>p.x>o.left&&p.x<o.right&&p.y>o.top&&p.y<o.bottom),open=[],cost=new Map([[startKey,0]]),prev=new Map(),closed=new Set();
    heapPush(open,{...s,dir:preferredDir??-1,key:startKey,f:Math.abs(goal.x-s.x)+Math.abs(goal.y-s.y)});
    let foundKey=null,guard=0;
    while(open.length&&guard++<160000){
      const cur=heapPop(open),ck=cur.key;if(closed.has(ck))continue;if(cell(cur)===goalCell){foundKey=ck;break}closed.add(ck);
      directions.forEach(([dx,dy],dir)=>{const n={x:cur.x+dx,y:cur.y+dy};if(n.x<0||n.x>SHEET_W||n.y<0||n.y>SHEET_H||blocked(n))return;const nk=state(n,dir),turn=cur.dir<0||cur.dir===dir?0:(cur.dir^1)===dir?120:70,ng=cost.get(ck)+GRID+turn+(routingUsage.get(cell(n))||0)*250;if(ng<(cost.get(nk)??Infinity)){cost.set(nk,ng);prev.set(nk,ck);heapPush(open,{...n,dir,key:nk,f:ng+Math.abs(goal.x-n.x)+Math.abs(goal.y-n.y)})}});
    }
    if(!foundKey){const mid=Math.round((s.x+goal.x)/(2*GRID))*GRID;return cleanPoints([s,{x:mid,y:s.y},{x:mid,y:goal.y},goal])}
    const path=[];let k=foundKey;while(k){const [x,y]=k.split(',').map(Number);path.push({x,y});if(k===startKey)break;k=prev.get(k)}return cleanPoints(path.reverse());
  }
  function markRoute(points){for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],steps=Math.max(1,Math.round(Math.max(Math.abs(b.x-a.x),Math.abs(b.y-a.y))/GRID));for(let n=0;n<=steps;n++){const x=Math.round((a.x+(b.x-a.x)*n/steps)/GRID)*GRID,y=Math.round((a.y+(b.y-a.y)*n/steps)/GRID)*GRID,k=`${x},${y}`;routingUsage.set(k,(routingUsage.get(k)||0)+1)}}}
  function routePoints(fromRef,toRef,manual=[],recordUsage=true){
    const escapeCheckpoint=point=>{let q={x:Math.max(0,Math.min(SHEET_W,Math.round(point.x/GRID)*GRID)),y:Math.max(0,Math.min(SHEET_H,Math.round(point.y/GRID)*GRID))};for(const o of routeObstacles){if(q.x>o.left&&q.x<o.right&&q.y>o.top&&q.y<o.bottom){const options=[{x:Math.round((o.left-GRID)/GRID)*GRID,y:q.y},{x:Math.round((o.right+GRID)/GRID)*GRID,y:q.y},{x:q.x,y:Math.round((o.top-GRID)/GRID)*GRID},{x:q.x,y:Math.round((o.bottom+GRID)/GRID)*GRID}].filter(p=>p.x>=0&&p.x<=SHEET_W&&p.y>=0&&p.y<=SHEET_H);q=options.sort((a,b)=>Math.abs(a.x-q.x)+Math.abs(a.y-q.y)-Math.abs(b.x-q.x)-Math.abs(b.y-q.y))[0]||q}}return q};
    const a=endpointInfo(fromRef),b=toRef?.point?{pos:toRef.point,stub:toRef.point}:endpointInfo(toRef),checkpoints=[a.stub,...manual.map(escapeCheckpoint),b.stub],pts=[...(a.lead||[a.pos])];
    const firstDir={right:0,left:1,bottom:2,top:3}[a.side];
    for(let i=1;i<checkpoints.length;i++){const segment=gridRoute(checkpoints[i-1],checkpoints[i],i===1?firstDir:null);pts.push(...segment.slice(i===1?1:0))}
    pts.push(...(b.lead?[...b.lead].reverse().slice(1):[b.pos]));
    const cleaned=cleanPoints(pts);if(recordUsage)markRoute(cleaned);return cleaned;
  }
  function roundedPath(points,radius=7){
    if(points.length<2)return'';
    let d=`M${points[0].x} ${points[0].y}`;
    for(let i=1;i<points.length-1;i++){
      const a=points[i-1],b=points[i],c=points[i+1],d1=Math.hypot(b.x-a.x,b.y-a.y),d2=Math.hypot(c.x-b.x,c.y-b.y);
      if(!d1||!d2)continue;
      const r=Math.min(radius,d1/2,d2/2),before={x:b.x+(a.x-b.x)*r/d1,y:b.y+(a.y-b.y)*r/d1},after={x:b.x+(c.x-b.x)*r/d2,y:b.y+(c.y-b.y)*r/d2};
      d+=` L${before.x} ${before.y} Q${b.x} ${b.y} ${after.x} ${after.y}`;
    }
    const last=points[points.length-1];return d+` L${last.x} ${last.y}`;
  }
  function roleName(id){if(id==='MEASURE')return 'Ölçüm probu';if(id==='FREE')return 'Sinyal · serbest renk';if(id==='MECHANICAL')return 'Mekanik mil bağlantısı';return conductorRoles.find(x=>x[0]===id)?.[1]||id||'Kumanda'}
  function wireLabelPoint(points){let best={length:0,x:points[0]?.x||0,y:points[0]?.y||0};for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);if(length>best.length)best={length,x:(a.x+b.x)/2,y:(a.y+b.y)/2-6}}return best}
  function wireFreeDrag(w){
    if(project.workspaceMode==='arduino')return true;
    return [w.from,w.to].some(ref=>{const c=project.components.find(x=>x.id===ref?.c);return !!(c&&byId[c.typeId]?.arduinoBoard)});
  }
  function renderWire(w,index){
    if(reconnecting?.wireId===w.id)return;
    const points=routePoints(w.from,w.to,w.points||w.fixedPoints||[]),path=roundedPath(points),role=w.role||'CONTROL',lp=wireLabelPoint(points);renderedWirePoints[w.id]=points;w.role=role;
    const g=svg('g',{'data-wire':w.id,style:wireStyle(w)});
    if(w.mechanical||role==='MECHANICAL')g.innerHTML=`<title>Mekanik mil bağlantısı · motor devri enkodere aktarılır</title><path d="${path}" fill="none" stroke="#475569" stroke-width="8" stroke-linecap="round" opacity=".18"/><path class="mechanical-shaft-link ${selectedWire===w.id?'selected':''}" d="${path}" fill="none" stroke="#64748b" stroke-width="3.2" stroke-dasharray="8 5" stroke-linecap="round"/><path class="wire-hit" d="${path}"/><text class="wire-role-label" x="${lp.x}" y="${lp.y}">SHAFT</text>`;
    else g.innerHTML=`<title>${esc(colorNames[w.color]||w.color)} · ${esc(roleName(role))}</title><path class="wire-outline" d="${path}"/><path class="wire ${selectedWire===w.id?'selected':''} ${w._active?'energized':''} ${flowClass(w)} ${w._lineConflict?'line-conflict':''}" d="${path}" stroke="${w.color}" style="color:${w.color}"/><path class="wire-hit" d="${path}"/><text class="wire-role-label" x="${lp.x}" y="${lp.y}">${esc(role==='FREE'?'':role+(Lines.voltageLabel(project,w.color)?' · '+Lines.voltageLabel(project,w.color):''))}</text>`;
    els.scene.appendChild(g)
  }
  function wireStyle(w){return '--wire-width:'+Lines.width(w.size)+'px;--wire-outline:'+(String(w.color).toLowerCase()==='#ffffff'?'#64748b':'#fff')}
  function renderTerminalLeads(){
    if(appearance!=='material')return;
    const layer=svg('g',{class:'terminal-wire-overlay'}),defs=svg('defs');layer.appendChild(defs);
    project.components.filter(c=>byId[c.typeId]?.instrument==='tx11'||c.typeId==='abb-acs800-r5'||byId[c.typeId]?.arduinoBoard).forEach((c,index)=>{
      const d=byId[c.typeId],scale=c.materialScale||1,corners=[[0,0],[d.w,0],[d.w,d.h],[0,d.h]].map(([x,y])=>{const q=Symbols.rotatedPoint({x,y},d,c.rotation||0);return {x:c.x+q.x*scale,y:c.y+q.y*scale}}),xs=corners.map(p=>p.x),ys=corners.map(p=>p.y),clipId='tx-terminal-clip-'+index,clip=svg('clipPath',{id:clipId,clipPathUnits:'userSpaceOnUse'});
      clip.appendChild(svg('rect',{x:Math.min(...xs)-8,y:Math.min(...ys)-8,width:Math.max(...xs)-Math.min(...xs)+16,height:Math.max(...ys)-Math.min(...ys)+16}));defs.appendChild(clip);
      // Leave the terminal hit areas open while painting the cable over the body.
      const hitId=clipId+'-hit',hitClip=svg('clipPath',{id:hitId,clipPathUnits:'userSpaceOnUse'}),r=5*scale;
      let hitArea=`M${Math.min(...xs)-8} ${Math.min(...ys)-8}H${Math.max(...xs)+8}V${Math.max(...ys)+8}H${Math.min(...xs)-8}Z`;
      for(const pin of d.pins){const q=absolutePort({c:c.id,p:pin.id});hitArea+=` M${q.x-r} ${q.y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`}
      hitClip.appendChild(svg('path',{d:hitArea,'clip-rule':'evenodd'}));defs.appendChild(hitClip);
      for(const w of project.wires.filter(w=>!w.probeLead&&[w.from,w.to].some(r=>r.c===c.id))){const points=renderedWirePoints[w.id];if(!points)continue;const path=roundedPath(points),g=svg('g',{'data-wire':w.id,'data-terminal-overlay':c.id,'clip-path':'url(#'+clipId+')',style:wireStyle(w)});
        g.innerHTML=`<path class="wire-outline" d="${path}" pointer-events="none"/><path class="wire ${selectedWire===w.id?'selected':''} ${w._active?'energized':''} ${flowClass(w)} ${w._lineConflict?'line-conflict':''}" d="${path}" stroke="${w.color}" style="color:${w.color}" pointer-events="none"/><path class="wire-hit" d="${path}" clip-path="url(#${hitId})"/>`;layer.appendChild(g);
      }
    });if(layer.children.length>1)els.scene.appendChild(layer);
  }
  function raiseTerminalLeads(){const layer=els.scene.querySelector('.terminal-wire-overlay');if(layer){els.scene.appendChild(layer);for(const editor of els.scene.querySelectorAll('.wire-editors'))els.scene.appendChild(editor)}}
  function uniquePoints(points){const out=[];points.forEach(p=>{const last=out[out.length-1];if(!last||last.x!==p.x||last.y!==p.y)out.push({x:p.x,y:p.y})});return out}
  function samePoint(a,b){return !!a&&!!b&&a.x===b.x&&a.y===b.y}
  function manualPointsBetween(from,to,full){const a=endpointInfo(from),b=endpointInfo(to),points=uniquePoints(full).slice(1,-1),inside=(p,e)=>e.body&&p.x>=e.body.left&&p.x<=e.body.right&&p.y>=e.body.top&&p.y<=e.body.bottom;while(points.length&&(samePoint(points[0],a.stub)||inside(points[0],a)))points.shift();while(points.length&&(samePoint(points.at(-1),b.stub)||inside(points.at(-1),b)))points.pop();return points}
  function editableRoute(w){
    const a=endpointInfo(w.from),b=endpointInfo(w.to),route=renderedWirePoints[w.id]||routePoints(w.from,w.to,w.points||[],false);
    return uniquePoints([...(a.lead||[a.pos]),...manualPointsBetween(w.from,w.to,route),...(b.lead?[...b.lead].reverse():[b.pos])]);
  }
  function editableSegmentRange(w,route){const a=endpointInfo(w.from),b=endpointInfo(w.to),first=samePoint(a.pos,a.stub)?0:(a.lead?.length||2)-1,last=(route?.length||editableRoute(w).length)-2-(samePoint(b.pos,b.stub)?0:(b.lead?.length||2)-1);return{first,last}}
  function renderWireEditors(){
    els.scene.querySelectorAll('.wire-editors').forEach(n=>n.remove());
    const w=project.wires.find(x=>x.id===selectedWire);if(!w||w.probeLead||reconnecting)return;
    const route=editableRoute(w),range=editableSegmentRange(w,route),g=svg('g',{class:'wire-editors','data-editor-wire':w.id});
    const ends=[['from',endpointInfo(w.from).pos],['to',endpointInfo(w.to).pos]];
    ends.forEach(([end,p])=>g.appendChild(svg('circle',{class:'wire-end-handle','data-wire-end':end,cx:p.x,cy:p.y,r:7})));
    const free=wireFreeDrag(w);
    for(let i=range.first;i<=range.last;i++){const a=route[i],b=route[i+1];if(!a||!b||Math.hypot(b.x-a.x,b.y-a.y)<GRID)continue;const vertical=Math.abs(a.x-b.x)<1,axis=free?'free':vertical?'vertical':'horizontal';g.appendChild(svg('rect',{class:'wire-segment-handle '+(free?'wire-segment-free':vertical?'wire-segment-vertical':'wire-segment-horizontal'),'data-wire-segment':i,'data-wire-axis':axis,x:(a.x+b.x)/2-5,y:(a.y+b.y)/2-5,width:10,height:10,rx:2}))}
    els.scene.appendChild(g);
  }
  function renderDraftWire(){
    els.scene.querySelector('.draft-wire-group')?.remove();
    if(!pendingPort||!draftMouse)return;
    const points=routePoints(pendingPort,{point:draftMouse},draftPoints,false),path=roundedPath(points),g=svg('g',{class:'draft-wire-group',style:'--wire-width:'+Lines.width(project.colorSizes?.[wireColor]||1.5)+'px'});
    g.innerHTML=`<path class="draft-wire" d="${path}" stroke="${wireColor}"/>${draftPoints.map(p=>`<circle class="draft-point" cx="${p.x}" cy="${p.y}" r="4"/>`).join('')}`;
    const firstComponent=els.scene.querySelector('.component');firstComponent?els.scene.insertBefore(g,firstComponent):els.scene.appendChild(g);
  }
  function pointerWorldPoint(e){
    const ctm=els.scene?.getScreenCTM?.();
    if(ctm){
      try{
        const inverse=ctm.inverse();
        const point=els.workspace?.createSVGPoint?.();
        if(point){
          point.x=e.clientX;point.y=e.clientY;
          const mapped=point.matrixTransform(inverse);
          if(Number.isFinite(mapped.x)&&Number.isFinite(mapped.y))return{x:mapped.x,y:mapped.y};
        }
        if(typeof DOMPoint==='function'){
          const mapped=new DOMPoint(e.clientX,e.clientY).matrixTransform(inverse);
          if(Number.isFinite(mapped.x)&&Number.isFinite(mapped.y))return{x:mapped.x,y:mapped.y};
        }
      }catch{}
    }
    const r=els.viewport.getBoundingClientRect();
    return Viewport.clientToWorld(camera,e,r,{x:els.viewport.scrollLeft,y:els.viewport.scrollTop});
  }
  function canvasPoint(e){
    const p=pointerWorldPoint(e);
    return {x:Math.max(0,Math.min(SHEET_W,Math.round(p.x/GRID)*GRID)),y:Math.max(0,Math.min(SHEET_H,Math.round(p.y/GRID)*GRID))};
  }

  function endpointEqual(a,b){return a&&b&&((a.j&&a.j===b.j)||(a.c===b.c&&a.p===b.p))}
  function endpointDef(ref){const c=project.components.find(x=>x.id===ref?.c),d=c&&byId[c.typeId],p=d?.pins?.find(x=>x.id===ref?.p);return {c,d,p}}
  function mechanicalEndpoint(ref){return !!endpointDef(ref).p?.mechanical}
  function mechanicalPair(a,b){if(!mechanicalEndpoint(a)||!mechanicalEndpoint(b))return false;const A=endpointDef(a),B=endpointDef(b),enc=x=>!!x.d?.incrementalEncoder38mm,mot=x=>window.DTSIncrementalEncoder?.isMotorDef?.(x.d);return (enc(A)&&mot(B))||(enc(B)&&mot(A))}

  function nearestOnRoute(points,p){let best=null;for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],vertical=Math.abs(a.x-b.x)<1,q=vertical?{x:a.x,y:Math.max(Math.min(p.y,Math.max(a.y,b.y)),Math.min(a.y,b.y))}:{x:Math.max(Math.min(p.x,Math.max(a.x,b.x)),Math.min(a.x,b.x)),y:a.y},dist=Math.hypot(q.x-p.x,q.y-p.y);if(!best||dist<best.dist)best={point:{x:Math.round(q.x/GRID)*GRID,y:Math.round(q.y/GRID)*GRID},segment:i,dist}}return best}
  function resetDraft(){els.scene.querySelector('.draft-wire-group')?.remove();reconnectReleaseCleanup?.();reconnectReleaseCleanup=null;els.scene.querySelectorAll('.port.pending').forEach(n=>n.classList.remove('pending'));pendingPort=null;reconnecting=null;draftPoints=[];draftMouse=null}
  function finishConnection(target){
    if(!wireGuardEdit())return;
    const tutorialDecision=window.DTSTutorialMode?.beforeWire?.(project,pendingPort,target);
    if(tutorialDecision&&!tutorialDecision.ok){toast(tutorialDecision.error||'Sıradaki bağlantıyı kontrol edin.');setStatus(tutorialDecision.error||'Yanlış bağlantı','warn');resetDraft();render();return}
    if(endpointEqual(pendingPort,target)){toast('Kablonun iki ucu aynı noktaya bağlanamaz');return}
    const duplicate=project.wires.some(w=>w.id!==reconnecting?.wireId&&(
      (endpointEqual(w.from,pendingPort)&&endpointEqual(w.to,target))||
      (endpointEqual(w.to,pendingPort)&&endpointEqual(w.from,target))
    ));
    if(duplicate){toast('Bu bağlantı zaten var');resetDraft();render();return}
    if(mechanicalEndpoint(pendingPort)||mechanicalEndpoint(target)){
      if(!mechanicalPair(pendingPort,target)){toast('SHAFT yalnızca motor mili ile fotoelektrik enkoder mili arasında bağlanabilir.');setStatus('Geçersiz mekanik mil bağlantısı','warn');return}
      const existing=project.wires.find(w=>(w.mechanical||w.role==='MECHANICAL')&&([w.from,w.to].some(r=>r.c===pendingPort.c)||[w.from,w.to].some(r=>r.c===target.c)));
      if(existing){toast('Motor veya enkoder mili zaten mekanik olarak bağlı. Önce mevcut SHAFT bağlantısını kaldırın.');return}
      if(!snapshot())return;
      const created={id:uid('w'),from:clone(pendingPort),to:clone(target),points:clone(draftPoints),color:'#64748b',role:'MECHANICAL',size:'1.5 mm²',mechanical:true};
      if(reconnecting){const w=project.wires.find(x=>x.id===reconnecting.wireId);if(w)Object.assign(w,created,{id:w.id})}else project.wires.push(created);
      resetDraft();render();setStatus('Mekanik SHAFT bağlantısı kuruldu · motor devri/yönü enkodere aktarılacak');return;
    }
    const style=Lines.plan(project,byId,pendingPort,target,wireColor,$('#wireSize').value,reconnecting?.wireId);
    if(!style.ok){toast(style.reason);setStatus(style.reason,'warn');return}
    if(!snapshot())return;Lines.bind(project,style.role,style.color);
    if(reconnecting){const w=project.wires.find(x=>x.id===reconnecting.wireId);if(w){w[reconnecting.end]=clone(target);w.points=clone(draftPoints);Object.assign(w,{color:style.color,role:style.role,size:style.size});delete w.fixedPoints}}
    else {const created={id:uid('w'),from:clone(pendingPort),to:clone(target),points:clone(draftPoints),color:style.color,role:style.role,size:style.size};project.wires.push(created);window.DTSTutorialMode?.afterWire?.(project,created)}
    wireColor=style.color;resetDraft();cleanupJunctions();populateWireMenu();render();setStatus(roleName(style.role)+' hattına bağlandı');
  }
  function branchToWire(w,clickPoint){
    if(!guardEdit())return;if(w.mechanical||w.role==='MECHANICAL'){toast('SHAFT mekanik mil bağlantısı dallandırılamaz.');return}
    if(reconnecting?.wireId===w.id){toast('Kablo kendi üzerine bağlanamaz');return}
    const route=renderedWirePoints[w.id]||routePoints(w.from,w.to,w.points||[],false),hit=nearestOnRoute(route,clickPoint);if(!hit)return;
    if(endpointInfo(w.from).pos&&Math.hypot(hit.point.x-endpointInfo(w.from).pos.x,hit.point.y-endpointInfo(w.from).pos.y)<8){finishConnection(w.from);return}
    if(endpointInfo(w.to).pos&&Math.hypot(hit.point.x-endpointInfo(w.to).pos.x,hit.point.y-endpointInfo(w.to).pos.y)<8){finishConnection(w.to);return}
    const style=Lines.plan(project,byId,pendingPort,w.from,wireColor,$('#wireSize').value,reconnecting?.wireId);
    if(!style.ok){toast(style.reason);setStatus(style.reason,'warn');return}
    if(!snapshot())return;Lines.bind(project,style.role,style.color);
    const junction={id:uid('j'),x:hit.point.x,y:hit.point.y},oldTo=clone(w.to),left=cleanPoints([...route.slice(0,hit.segment+1),hit.point]),right=cleanPoints([hit.point,...route.slice(hit.segment+1)]);
    project.junctions.push(junction);const leftTo={j:junction.id};w.points=manualPointsBetween(w.from,leftTo,left);w.to=leftTo;delete w.fixedPoints;
    project.wires.push({id:uid('w'),from:{j:junction.id},to:oldTo,points:manualPointsBetween({j:junction.id},oldTo,right),color:w.color,role:w.role,size:w.size});
    if(reconnecting){const edited=project.wires.find(x=>x.id===reconnecting.wireId);if(edited){edited[reconnecting.end]={j:junction.id};edited.points=clone(draftPoints);Object.assign(edited,{color:style.color,role:style.role,size:style.size});delete edited.fixedPoints}}
    else project.wires.push({id:uid('w'),from:clone(pendingPort),to:{j:junction.id},points:clone(draftPoints),color:style.color,role:style.role,size:style.size});
    wireColor=style.color;resetDraft();populateWireMenu();render();setStatus(roleName(style.role)+' hattına dallanma eklendi');
  }
  function beginReconnect(w,end,e){
    if(!guardEdit())return;
    reconnectReleaseCleanup?.();
    selectedWire=w.id;setSelection([]);reconnecting={wireId:w.id,end};pendingPort=clone(w[end==='from'?'to':'from']);draftPoints=[];draftMouse=canvasPoint(e);setStatus('Kablo ucu ayrıldı · yeni terminale veya kabloya bırakın','warn');render();
    const release=ev=>{if(ev.pointerId!==e.pointerId||ev.button!==0)return;window.removeEventListener('pointerup',release);const target=document.elementFromPoint(ev.clientX,ev.clientY),pg=target?.closest?.('.port-group'),jg=target?.closest?.('[data-junction]'),wg=target?.closest?.('[data-wire]');if(pg){finishConnection({c:pg.closest('.component').dataset.id,p:pg.dataset.port})}else if(jg)finishConnection({j:jg.dataset.junction});else if(wg){const targetWire=project.wires.find(x=>x.id===wg.dataset.wire);if(targetWire)branchToWire(targetWire,canvasPoint(ev))}};
    reconnectReleaseCleanup=()=>window.removeEventListener('pointerup',release);window.addEventListener('pointerup',release);
  }
  function junctionCanFollowSegment(junctionId,wireId,verticalDragged){
    const peers=project.wires.filter(x=>!x.probeLead&&x.id!==wireId&&(x.from?.j===junctionId||x.to?.j===junctionId));
    for(const peer of peers){
      const route=editableRoute(peer);if(route.length<2)continue;
      const fromJ=peer.from?.j===junctionId,a=fromJ?route[0]:route.at(-1),b=fromJ?route[1]:route.at(-2);if(!a||!b)continue;
      const dx=Math.abs(b.x-a.x),dy=Math.abs(b.y-a.y);
      if(verticalDragged?dy>=1:dx>=1)return false;
    }
    return true;
  }
  function beginWireSegmentDrag(w,segment,e){
    if(!guardEdit())return;
    if(gesture||labelDragging)return;
    const base=editableRoute(w),range=editableSegmentRange(w,base);if(segment<range.first||segment>range.last)return;
    const a=base[segment],b=base[segment+1],vertical=Math.abs(a.x-b.x)<1;if(!vertical&&Math.abs(a.y-b.y)>=1)return;
    if(wireFreeDrag(w)){
      const previous=clone(w),oldFuture=[...future];let moved=false;
      e.preventDefault();trackGesture(e,{
        move:ev=>{
          if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<4)return;
          const p=canvasPoint(ev);if(!moved){if(!snapshot())return;moved=true}
          const full=uniquePoints([...base.slice(0,segment+1),p,...base.slice(segment+1)]);
          w.points=manualPointsBetween(w.from,w.to,full);delete w.fixedPoints;render();
        },
        finish:cancelled=>{
          if(cancelled&&moved){Object.keys(w).forEach(k=>delete w[k]);Object.assign(w,previous);history.pop();future=oldFuture}
          if(moved){setStatus('Arduino kablosu istediğiniz yöne taşındı · uç bağlantıları korundu');render();scheduleSave()}
        }
      });return;
    }
    const junctionEnds=[];
    if(segment===0&&w.from?.j)junctionEnds.push({id:w.from.j,index:0,follow:junctionCanFollowSegment(w.from.j,w.id,vertical)});
    if(segment===base.length-2&&w.to?.j)junctionEnds.push({id:w.to.j,index:base.length-1,follow:junctionCanFollowSegment(w.to.j,w.id,vertical)});
    const previous=clone(w),previousJunctions=junctionEnds.filter(x=>x.follow).map(x=>{const j=project.junctions.find(j=>j.id===x.id);return j&&{id:j.id,x:j.x,y:j.y}}).filter(Boolean),oldFuture=[...future];let moved=false;
    e.preventDefault();trackGesture(e,{
      move:ev=>{
        if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<4)return;
        const p=canvasPoint(ev);if(!moved&&(vertical?p.x===a.x:p.y===a.y))return;
        if(!moved){if(!snapshot())return;moved=true}
        const movedBase=base.map(q=>({...q}));
        for(const end of junctionEnds){if(!end.follow)continue;const j=project.junctions.find(j=>j.id===end.id);if(!j)continue;if(vertical)j.x=p.x;else j.y=p.y;movedBase[end.index]={...movedBase[end.index],x:j.x,y:j.y}}
        const ma=movedBase[segment],mb=movedBase[segment+1],shifted=vertical?[{x:p.x,y:ma.y},{x:p.x,y:mb.y}]:[{x:ma.x,y:p.y},{x:mb.x,y:p.y}],full=uniquePoints([...movedBase.slice(0,segment+1),...shifted,...movedBase.slice(segment+1)]);
        w.points=manualPointsBetween(w.from,w.to,full);delete w.fixedPoints;render();
      },
      finish:cancelled=>{
        if(cancelled&&moved){Object.keys(w).forEach(k=>delete w[k]);Object.assign(w,previous);for(const before of previousJunctions){const j=project.junctions.find(j=>j.id===before.id);if(j)Object.assign(j,before)}history.pop();future=oldFuture}
        if(moved){const followed=junctionEnds.some(x=>x.follow),extended=junctionEnds.some(x=>!x.follow);setStatus(followed&&extended?'Kablo taşındı · uygun ek noktası taşındı, diğer uçta kablo uzatıldı':followed?'Kablo ve uygun ek noktası birlikte taşındı':extended?'Ek noktası sabit kaldı · kablo düzgün şekilde uzatıldı':'Kablo güzergâhı taşındı');render();scheduleSave()}
      }
    });
  }
  function cleanupJunctions(){project.junctions=(project.junctions||[]).filter(j=>project.wires.some(w=>w.from.j===j.id||w.to.j===j.id))}

  function addComponent(typeId,x,y,arduinoSavedId=''){if(!guardEdit())return;if(project.workspaceMode==='panel'){window.DTSPanelEditor?.add(typeId);return}const d=byId[typeId];if(!d)return;if(!snapshot())return;let base=Symbols.referencePrefix(d);let n=1;while(project.components.some(c=>c.ref===base+n))n++;const c={id:uid('c'),typeId,x:Math.max(GRID*2,Math.round(x/GRID)*GRID),y:Math.max(GRID*2,Math.round(y/GRID)*GRID),rotation:0,label:d.name,ref:base+n,address:'',note:'',state:false,_active:false};if(d.id==='arduino-flame'){c.flamePresent=false;c.arduinoValue=80}if(d.id==='arduino-ldr'){c.ldrCover=0;c.arduinoValue=900}if(d.id==='arduino-dht11'){c.arduinoValue=25;c.arduinoHumidity=50}if(d.id==='arduino-reed')c.reedMagnet=0;if(d.id==='arduino-rotary-encoder'){c.encoderAngle=0;c.encoderPosition=0;c._encoderCLK=0;c._encoderDT=0}if(d.incrementalEncoder38mm){c.encoderPPR=d.encoderPPR||100;c.encoderRPM=0;c.encoderAuto=true;c.encoderMechanicalAngle=0;c.encoderManualRPM=0;window.DTSIncrementalEncoder?.state(c,d,performance.now(),false)}if(d.id==='arduino-joystick'){c.arduinoX=512;c.arduinoY=512}if(d.id==='arduino-pot')c.potentiometer=50;if(d.id==='arduino-soil'){c.soilProbeDepth=0;c.arduinoValue=d.arduinoDefault??220}if(d.id==='arduino-signal-generator'){c.generatorEnabled=d.generatorEnabled!==false;c.generatorWaveform=d.generatorWaveform||'square';c.generatorFrequency=d.generatorFrequency||1000;c.generatorAmplitude=d.generatorAmplitude||5;c.generatorOffset=d.generatorOffset||0;c.generatorDuty=d.generatorDuty||50;c.generatorPhaseDeg=d.generatorPhaseDeg||0}if(d.id==='arduino-oscilloscope'){c.scopeTimeMs=d.scopeTimeMs||20;c.scopeTimeDivMs=d.scopeTimeDivMs||c.scopeTimeMs/10;c.scopeVoltsDiv1=d.scopeVoltsDiv1||1;c.scopeVoltsDiv2=d.scopeVoltsDiv2||1;c.scopePosition1=d.scopePosition1||0;c.scopePosition2=d.scopePosition2||0;c.scopeChannel1=d.scopeChannel1!==false;c.scopeChannel2=d.scopeChannel2!==false;c.scopeCoupling1=d.scopeCoupling1||'DC';c.scopeCoupling2=d.scopeCoupling2||'DC';c.scopeTriggerMode=d.scopeTriggerMode||'auto';c.scopeTriggerSource=d.scopeTriggerSource||'CH1';c.scopeTriggerEdge=d.scopeTriggerEdge||'rising';c.scopeTriggerLevel=d.scopeTriggerLevel??2.5;c.scopeSamplePoints=d.scopeSamplePoints||240}if(d.arduinoBoard){c.arduinoSketch=Arduino?.sketches?.blank?.code||'void setup(){}\nvoid loop(){}';c.arduinoProgramName='Blank';const saved=arduinoSavedId&&Arduino?.savedBoards(localStorage).find(x=>x.id===arduinoSavedId);if(saved)Arduino.applySaved(c,saved)}if(d.id==='sinamics-v20-1p')window.DTSV20.create(c);if(d.id==='abb-acs800-r5')window.DTSACS800.create(c);project.components.push(c);window.DTSAssemblies.add(project,c,d,byId,uid);setSelection([c.id]);selectedWire=null;render();els.viewport.focus({preventScroll:true});toast(`${d.name} eklendi`)}
  function removeSelected(){
    if(!guardEdit())return;if(project.workspaceMode==='panel'){window.DTSPanelEditor?.removeSelected();return}
    gesture?.cancel();labelCancel?.();
    if(selectedIds.size){
      if(!snapshot())return;for(const c of project.components)if(c.auxFor&&selectedIds.has(c.auxFor)||c.probeFor&&selectedIds.has(c.probeFor))selectedIds.add(c.id);for(const id of selectedIds)actuations.cancel(id);
      project.components=project.components.filter(c=>!selectedIds.has(c.id));
      project.wires=project.wires.filter(w=>!selectedIds.has(w.from.c)&&!selectedIds.has(w.to.c));setSelection([]);
    }else if(selectedWire){if(!snapshot())return;project.wires=project.wires.filter(w=>w.id!==selectedWire);selectedWire=null}else return;
    resetDraft();cleanupJunctions();render();
  }
  function connectPort(ref){
    if(running){electricalTouch();return}
    if(!wireGuardEdit())return;
    if(!pendingPort){
      if(window.DTSTutorialMode?.allowsGuidedWiring?.(project)&&!window.DTSTutorialMode.canStart(project,ref)){toast('Önce yanıp sönen terminali seçin.');return}
      pendingPort=ref;const line=Lines.analyze(project,byId).at(ref);const fixed=Lines.netPowerColor(project,byId,line.members)||Lines.endpointPowerColor(project,byId,ref);if(fixed&&fixed!=='CONFLICT')wireColor=fixed;else if(line.role&&!line.freeColor)wireColor=Lines.chooseColor(project,line.role,line.color||wireColor);draftPoints=[];draftMouse=absolutePort(ref);setStatus('Kabloyu yönlendirin: alana tıklayarak dönüş noktası ekleyin','warn');render();return}
    if(endpointEqual(pendingPort,ref)){resetDraft();setStatus('Bağlantı iptal edildi');render();return}
    finishConnection(ref);
  }

  function simulate(){
    if(project.workspaceMode==='panel'||window.DTSStudio?.safety?.visible)return;gesture?.cancel();labelCancel?.();resetDraft();
    actuations.cancelAll();heldPointers.clear();sound.unlock();running=!running;Simulation.clear(project);Arduino?.clear?.(project);
    if(!running)window.DTSStudio?.restoreExample();
    if(!running)project.components.forEach(c=>{if(byId[c.typeId]?.controlMode==='momentary'){c.state=false;if(byId[c.typeId]?.independentContacts)c.switchStates={}}});
    setStatus(running?'Simülasyon çalışıyor':'Simülasyon durduruldu');render(true);
  }
  function runSolver(){
    const now=performance.now(),arduinoFrame=Arduino?.tick?.(project,byId,{now})||{active:false,errors:[]};
    const arduinoMeter=project.workspaceMode==='arduino'&&project.components.some(c=>['multimeter','clamp-meter'].includes(byId[c.typeId]?.kind));
    const result=project.workspaceMode==='arduino'&&!arduinoMeter?{stable:true,timed:false,blocked:false,oscillating:false,shortCircuit:false,damaged:[]}:(['electronic-switching-src-11','motor-direct-power-outline-021'].includes(project.tutorialLesson?.id)||['tutorial-session-source-electronic-switching-src-11','tutorial-session-source-motor-direct-power-outline-021'].includes(project.projectId))&&typeof Simulation.solveSc11Cycle==='function'?Simulation.solveSc11Cycle(project,byId,{now,appearance}).result:(project.projectId==='tutorial-session-source-electronic-switching-src-12'||project.tutorialLesson?.id==='electronic-switching-src-12')&&typeof Simulation.solveSc12DimmerCycle==='function'?Simulation.solveSc12DimmerCycle(project,byId,{now,appearance}).result:(['electronic-switching-src-15','electronic-switching-outline-046'].includes(project.tutorialLesson?.id)||['tutorial-electronic-switching-src-15','tutorial-session-source-electronic-switching-src-15','tutorial-session-source-electronic-switching-outline-046'].includes(project.projectId))&&typeof Simulation.solveSc15AcCycle==='function'?Simulation.solveSc15AcCycle(project,byId,{now,appearance}).result:(['electronic-switching-src-16','electronic-switching-outline-054'].includes(project.tutorialLesson?.id)||['tutorial-session-source-electronic-switching-src-16','tutorial-session-source-electronic-switching-outline-054'].includes(project.projectId))&&typeof Simulation.solveSc16DcCycle==='function'?Simulation.solveSc16DcCycle(project,byId,{now,appearance}).result:(['electronic-switching-src-17','electronic-switching-outline-051','electronic-switching-outline-055'].includes(project.tutorialLesson?.id)||['tutorial-electronic-switching-src-17','tutorial-session-source-electronic-switching-src-17','tutorial-session-source-electronic-switching-outline-051','tutorial-session-source-electronic-switching-outline-055'].includes(project.projectId))&&typeof Simulation.solveSc17TriacDimmerCycle==='function'?Simulation.solveSc17TriacDimmerCycle(project,byId,{now,appearance}).result:(['electronic-switching-src-18','electronic-switching-outline-057','electronic-switching-outline-061'].includes(project.tutorialLesson?.id)||['tutorial-electronic-switching-src-18','tutorial-session-source-electronic-switching-src-18','tutorial-session-source-electronic-switching-outline-057','tutorial-session-source-electronic-switching-outline-061'].includes(project.projectId))&&typeof Simulation.solveSc18OptocouplerCycle==='function'?Simulation.solveSc18OptocouplerCycle(project,byId,{now,appearance}).result:(['electronic-switching-src-19','electronic-switching-outline-060'].includes(project.tutorialLesson?.id)||['tutorial-electronic-switching-src-19','tutorial-session-source-electronic-switching-src-19','tutorial-session-source-electronic-switching-outline-060'].includes(project.projectId))&&typeof Simulation.solveSc19OptoTriacCycle==='function'?Simulation.solveSc19OptoTriacCycle(project,byId,{now,appearance}).result:Simulation.solve(project,byId,{now,appearance});
    Arduino?.refresh?.(project,byId);
    if(result.damaged?.length&&window.DTSProjects.isProtected(project)){running=false;window.DTSStudio?.restoreExample();toast('Sensör beslemesi ters: hazır örnek başlangıç durumuna döndürüldü.');return}
    if(result.damaged?.length){const ids=new Set(result.damaged),damagedProject=project;running=false;for(const c of project.components)if(ids.has(c.id))c._damaging=true;
      setTimeout(()=>{if(project!==damagedProject)return;for(const stack of [history,future])for(let i=0;i<stack.length;i++){const past=JSON.parse(stack[i]);past.components=past.components.filter(c=>!ids.has(c.id));past.wires=past.wires.filter(w=>!ids.has(w.from.c)&&!ids.has(w.to.c));stack[i]=JSON.stringify(past)}project.components=project.components.filter(c=>!ids.has(c.id));project.wires=project.wires.filter(w=>!ids.has(w.from.c)&&!ids.has(w.to.c));setSelection([]);render();modal('SENSÖR BOZULDU','<p>SENSÖR BESLEMSİNİ TERS BAĞLADIN, SENSÖR BOZULDU</p><p>Sensör projeden kaldırıldı. Kütüphaneden yeni bir sensör ekleyin.</p>',()=>{})},900);return;
    }
    const piezoDecayActive=project.components.some(c=>c.mq07PiezoTapUi===true&&typeof c.piezoTapAt==='number'&&now>=c.piezoTapAt&&now-c.piezoTapAt<=1600);
    if((result.timed||arduinoFrame.active||piezoDecayActive)&&running)simulationTimer=setTimeout(()=>{simulationTimer=null;if(running)render(true)},arduinoFrame.active?20:(['electronic-switching-src-15','electronic-switching-outline-046','electronic-switching-src-17','electronic-switching-outline-051','electronic-switching-outline-055','electronic-switching-src-19','electronic-switching-outline-060'].includes(project.tutorialLesson?.id)||['tutorial-electronic-switching-src-15','tutorial-session-source-electronic-switching-src-15','tutorial-session-source-electronic-switching-outline-046','tutorial-electronic-switching-src-17','tutorial-session-source-electronic-switching-src-17','tutorial-session-source-electronic-switching-outline-051','tutorial-session-source-electronic-switching-outline-055','tutorial-electronic-switching-src-19','tutorial-session-source-electronic-switching-src-19','tutorial-session-source-electronic-switching-outline-060'].includes(project.projectId)?16:50));
    for(const c of project.components){const state=c._meter||c._clamp,warning=state?.warning;if(warning&&warning!==c._shownMeterWarning){c._shownMeterWarning=warning;const d=byId[c.typeId],title=d?.kind==='clamp-meter'?'UT200A · Ölçüm uyarısı':d?.id==='unit-ut61e-plus'?'UT61E+ · Ölçüm uyarısı':'UT33D+ · Ölçüm uyarısı';modal(title,'<p>'+warning+'</p>',()=>{})}if(!warning)delete c._shownMeterWarning}
    if(result.blocked){running=false;if(result.safetyWarning){setStatus(result.safetyWarning,'warn');toast(result.safetyWarning)}return}
    if(result.oscillating){
      setStatus('Simülasyon çalışıyor · '+(result.cyclingRefs.join(', ')||'Kontaklar')+' açılıp kapanıyor');
      simulationTimer=setTimeout(()=>{simulationTimer=null;if(running)render(true)},250);
    }else if(!result.stable){
      running=false;setStatus('Devrede kararlı durum oluşmadı; bobin–kontak bağlantılarını kontrol edin.','warn');
      toast('Besleme bağlantıları çözümlenemedi');
    }else if(result.shortCircuit)setStatus('Kısa devre: farklı besleme uçları doğrudan birleşiyor.','warn');
    else if(running)setStatus(performance.now()<liveEditWarningUntil?(project.workspaceMode==='arduino'?'Arduino simülasyonu çalışıyor · Kablo / terminal değişikliği canlı uygulanıyor':'Simülasyon çalışıyor · Kablo / terminal değişikliği canlı uygulanıyor'):(project.workspaceMode==='arduino'?'Arduino simülasyonu çalışıyor':'Simülasyon çalışıyor'),performance.now()<liveEditWarningUntil?'warn':'ok');
    if(running&&arduinoFrame.errors?.length&&!result.shortCircuit)setStatus('Arduino · '+arduinoFrame.errors[0],'warn');
  }

  function updateProperties(){
    const c=project.components.find(x=>x.id===selected);els.form.hidden=!c;els.none.hidden=!!c||selectedIds.size>1;$('#multiSelection').hidden=selectedIds.size<2;$('#selectionCount').textContent=selectedIds.size+' eleman seçili';if(!c)return;
    const d=byId[c.typeId],B=window.DTSDeviceBehavior,isSensor=['sensor','detector'].includes(d.kind),isAnalog=B.analog(d),isTimed=d.kind==='timer'||d.kind==='coil-flasher'||d.kind.startsWith('delay-');
    $('#instrumentSettings').innerHTML=window.DTSInstrumentUI.form(d,c);
    const arduinoBox=$('#arduinoComponentSettings'),arduinoControls=$('#arduinoSensorControls'),arduinoRole=d.arduinoRole;
    const arduinoAdjustable=['pwm-generator','ac-virtual-source','ac-scr-trigger','ac-triac-trigger','opto-flasher-timer'].includes(d.kind)||d.arduinoBoard||['analog','temperature','ultrasonic','joystick','dht','pot','loadcell','bluetooth-hc05','breadboard-power','ne555','sevenseg','lcd1602-i2c','lcd-i2c-backpack','a4988','signal-generator','oscilloscope','industrial-encoder'].includes(arduinoRole);
    arduinoBox.hidden=!arduinoAdjustable;$('#arduinoSelectedIde').hidden=!d.arduinoBoard;const btNote=$('#hc05WorkNote');btNote.hidden=arduinoRole!=='bluetooth-hc05';if(arduinoRole==='bluetooth-hc05'){btNote.textContent='📘 '+(d.deviceName||'Bluetooth')+' Çalışma Notu';$('#hc05GuideTitle').textContent=(d.deviceName||'Bluetooth')+' · Çalışma Notu';$('#hc05GuideAt').hidden=d.supportsAt===false}
    if(d.kind==='opto-flasher-timer')arduinoControls.innerHTML='<label>Flaşör frekansı (Hz)<input data-arduino-setting="frequencyHz" type="number" min="0.2" max="10" step="0.1" value="'+(c.frequencyHz??2)+'"></label><label>Flaşör duty (%)<input data-arduino-setting="dutyPercent" type="range" min="0" max="100" step="1" value="'+(c.dutyPercent??50)+'"><output>'+(c.dutyPercent??50)+'%</output></label><label>Duty (%)<input data-arduino-setting="dutyPercent" type="number" min="0" max="100" value="'+(c.dutyPercent??50)+'"></label><label class="checkbox-row"><input data-arduino-setting="timerEnabled" data-arduino-setting-type="bool" type="checkbox" '+(c.timerEnabled===false?'':'checked')+'> Sanal flaşör açık</label><small class="property-help">V+ / GND yalnız DC kontrol devresi. OUT, MOC3021 LED girişine bağlıdır. Anlık: '+(c._sc19TimerHigh?'HIGH':'LOW')+' · şebeke devresi değildir.</small>';
    else     if(d.kind==='ac-triac-trigger')arduinoControls.innerHTML='<label>Triyak tetikleme açısı (°)<input data-arduino-setting="triggerAngleDeg" type="range" min="0" max="170" step="1" value="'+(c.triggerAngleDeg??90)+'"><output>'+(c.triggerAngleDeg??90)+'°</output></label><label>İki yarım periyot ateşleme (°)<input data-arduino-setting="triggerAngleDeg" type="number" min="0" max="170" value="'+(c.triggerAngleDeg??90)+'"></label><label>Gate darbe açısı (°)<input data-arduino-setting="pulseWidthDeg" type="number" min="1" max="45" value="'+(c.pulseWidthDeg??25)+'"></label><label class="checkbox-row"><input data-arduino-setting="triggerEnabled" data-arduino-setting-type="bool" type="checkbox" '+(c.triggerEnabled===false?'':'checked')+'> Sanal çift yönlü tetikleyici açık</label><small class="property-help">Yalnız sanal yalıtılmış AC. Gate OUT anlık '+(Number(c._sc17GateV)||0).toFixed(1)+' V; üretici gate quadrant modeli değildir.</small>';
    else if(d.kind==='ac-scr-trigger')arduinoControls.innerHTML='<label>SCR ateşleme açısı (°)<input data-arduino-setting="triggerAngleDeg" type="range" min="0" max="170" step="1" value="'+(c.triggerAngleDeg??d.defaultTriggerAngleDeg??90)+'"><output>'+(c.triggerAngleDeg??90)+'°</output></label><label>Açı (°)<input data-arduino-setting="triggerAngleDeg" type="number" min="0" max="170" value="'+(c.triggerAngleDeg??90)+'"></label><label>Gate darbe genişliği (°)<input data-arduino-setting="pulseWidthDeg" type="number" min="1" max="45" value="'+(c.pulseWidthDeg??25)+'"></label><label class="checkbox-row"><input data-arduino-setting="triggerEnabled" data-arduino-setting-type="bool" type="checkbox" '+(c.triggerEnabled===false?'':'checked')+'> Gate tetikleyici açık</label><small class="property-help">Sanal izole AC faz referansı; anlık OUT '+(Number(c._sc15GateOutputV)||0)+' V; fiziksel şebeke devresi değildir.</small>';
    else if(d.kind==='ac-virtual-source')arduinoControls.innerHTML='<label>AC RMS (V)<input data-arduino-setting="rmsVoltage" type="number" min="1" max="24" step="1" value="'+(c.rmsVoltage??12)+'"></label><label>Frekans (Hz)<select data-arduino-setting="frequencyHz">'+[50,60].map(v=>'<option value="'+v+'" '+(Number(c.frequencyHz??50)===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label class="checkbox-row"><input data-arduino-setting="sourceEnabled" data-arduino-setting-type="bool" type="checkbox" '+(c.sourceEnabled===false?'':'checked')+'> Yalıtılmış sanal kaynak açık</label><small class="property-help">Yalnız yazılımsal 1–24 V AC RMS. Şebeke bağlantısı bulunmaz.</small>';
    else if(d.kind==='pwm-generator')arduinoControls.innerHTML='<label>PWM darbe genişliği / duty (%)<input data-arduino-setting="dutyPercent" type="range" min="0" max="100" step="1" value="'+(c.dutyPercent??d.defaultDutyPercent??0)+'"><output>'+(c.dutyPercent??0)+'%</output></label><label>Duty (%)<input data-arduino-setting="dutyPercent" type="number" min="0" max="100" step="1" value="'+(c.dutyPercent??0)+'"></label><label>Frekans (Hz)<input data-arduino-setting="frequencyHz" type="number" min="1" max="20000" step="1" value="'+(c.frequencyHz??d.defaultFrequencyHz??1000)+'"></label><small class="property-help">Sanal PWM1 · V+/GND besleme, OUT kare dalga. Anlık OUT: '+(c._pwmSupplyValid?(c._pwmHigh?'HIGH':'LOW'):'BESLEME YOK')+'. Teorik PWM komut ortalaması: '+(c._pwmSupplyValid?(Number(project.components.find(x=>x.id==='g1')?.dcVoltage??0)*Number(c.dutyPercent??0)/100).toFixed(2)+' V':'—')+' (yalnız ideal duty×besleme hesabı; VG voltmetre veya motor uçları ölçümü değildir). 1000 Hz civarı PWM, 50 ms aralıklı ekran örneklemesinde yanıltıcı anlık voltaj gösterebilir. Fiziksel RPM/tork modeli mevcut değildir.</small>';
    else if(d.arduinoBoard)arduinoControls.innerHTML='<small class="property-help">Program: '+esc(c.arduinoProgramName||'Blank')+(c._arduinoError?' · Hata: '+esc(c._arduinoError):'')+'</small>';
    else if(arduinoRole==='analog')arduinoControls.innerHTML='<label>'+esc(d.arduinoLabel||'Analog değer')+' (0–1023)<input data-arduino-setting="arduinoValue" type="range" min="0" max="1023" value="'+(c.arduinoValue??d.arduinoDefault??512)+'"><output>'+(c.arduinoValue??d.arduinoDefault??512)+'</output></label>';
    else if(arduinoRole==='temperature')arduinoControls.innerHTML='<label>Sıcaklık (°C)<input data-arduino-setting="arduinoValue" type="range" min="-40" max="125" value="'+(c.arduinoValue??d.arduinoDefault??25)+'"><output>'+(c.arduinoValue??d.arduinoDefault??25)+'</output></label>';
    else if(arduinoRole==='ultrasonic')arduinoControls.innerHTML='<label>Mesafe (cm)<input data-arduino-setting="arduinoValue" type="range" min="2" max="400" value="'+(c.arduinoValue??d.arduinoDefault??30)+'"><output>'+(c.arduinoValue??d.arduinoDefault??30)+'</output></label>';
    else if(arduinoRole==='joystick')arduinoControls.innerHTML='<label>Joystick X<input data-arduino-setting="arduinoX" type="range" min="0" max="1023" value="'+(c.arduinoX??512)+'"></label><label>Joystick Y<input data-arduino-setting="arduinoY" type="range" min="0" max="1023" value="'+(c.arduinoY??512)+'"></label>';
    else if(arduinoRole==='dht')arduinoControls.innerHTML='<label>Sıcaklık (°C)<input data-arduino-setting="arduinoValue" type="range" min="-20" max="60" value="'+(c.arduinoValue??25)+'"></label><label>Nem (%)<input data-arduino-setting="arduinoHumidity" type="range" min="0" max="100" value="'+(c.arduinoHumidity??50)+'"></label>';
    else if(arduinoRole==='pot')arduinoControls.innerHTML='<label>Potansiyometre (%)<input data-arduino-setting="potentiometer" type="range" min="0" max="100" value="'+(c.potentiometer??50)+'"><output>'+(c.potentiometer??50)+'</output></label>';
    else if(arduinoRole==='industrial-encoder'){const es=window.DTSIncrementalEncoder.state(c,d,performance.now(),false);arduinoControls.innerHTML='<label>PPR / devir<select data-arduino-setting="encoderPPR">'+(d.encoderPprOptions||[100,360,400,600,1000]).map(v=>'<option value="'+v+'" '+(Number(c.encoderPPR||d.encoderPPR||100)===v?'selected':'')+'>'+v+' PPR</option>').join('')+'</select></label><label>Devir (rpm)<input data-arduino-setting="encoderRPM" type="number" min="-5000" max="5000" step="1" value="'+Number(c.encoderRPM||0)+'"></label><label class="checkbox-row"><input data-arduino-setting="encoderAuto" data-arduino-setting-type="bool" type="checkbox" '+(c.encoderAuto!==false?'checked':'')+'> RPM ile otomatik döndür</label><small class="property-help">SHAFT motor miline mekanik bağlanırsa devir ve yön otomatik olarak motordan alınır. Motor bağlı değilse enkoder üzerindeki ↑/↓ düğmelerine basılı tutarak ileri/geri hızlandırabilirsiniz; düğmeyi bırakınca seçilen hızda kendi ekseninde sürekli döner. Mil ayrıca elle çevrilebilir. A/B/Z NPN open-collector çıkışlarıdır; Arduino girişinde INPUT_PULLUP veya harici pull-up gerekir.<br>Durum: '+es.ppr+' PPR · '+es.rpm.toFixed(0)+' rpm · '+es.pulseHz.toFixed(1)+' Hz · A '+(es.A?'H':'L')+' · B '+(es.B?'H':'L')+' · Z '+(es.Z?'H':'L')+(es.overspeed?' · ⚠ 3000 rpm izin verilen sınır aşıldı':'')+(es.responseOver?' · ⚠ 100 kHz cevap sınırı aşıldı':'')+'.</small>';}
    else if(arduinoRole==='loadcell')arduinoControls.innerHTML='<label>Uygulanan yük (kg)<input data-arduino-setting="loadWeight" type="range" min="0" max="'+(d.loadCapacity||20)+'" step="0.1" value="'+(c.loadWeight??0)+'"><output>'+Number(c.loadWeight??0).toFixed(1)+' kg</output></label><small class="property-help">Görseldeki kırmızı aşağı oku basılı tutun veya aşağı/yukarı sürükleyin. Köprü çıkışı yüke göre HX711 tarafına aktarılır.</small>';
    else if(arduinoRole==='signal-generator')arduinoControls.innerHTML='<label class="checkbox-row"><input data-arduino-setting="generatorEnabled" data-arduino-setting-type="bool" type="checkbox" '+(c.generatorEnabled!==false?'checked':'')+'> Çıkış açık</label><label>Dalga şekli<select data-arduino-setting="generatorWaveform" data-arduino-setting-type="text">'+[['square','Kare'],['sine','Sinüs'],['triangle','Üçgen'],['sawtooth','Testere dişi']].map(v=>'<option value="'+v[0]+'" '+((c.generatorWaveform||d.generatorWaveform||'square')===v[0]?'selected':'')+'>'+v[1]+'</option>').join('')+'</select></label><label>Frekans (Hz)<input data-arduino-setting="generatorFrequency" type="number" min="0.1" max="20000" step="0.1" value="'+(c.generatorFrequency??d.generatorFrequency??1000)+'"></label><label>Genlik / Vpp (V)<input data-arduino-setting="generatorAmplitude" type="number" min="0" max="5" step="0.05" value="'+(c.generatorAmplitude??d.generatorAmplitude??5)+'"></label><label>Alt seviye / offset (V)<input data-arduino-setting="generatorOffset" type="number" min="0" max="5" step="0.05" value="'+(c.generatorOffset??d.generatorOffset??0)+'"></label><label>Duty (%)<input data-arduino-setting="generatorDuty" type="number" min="1" max="99" step="1" value="'+(c.generatorDuty??d.generatorDuty??50)+'"></label><label>Faz (°)<input data-arduino-setting="generatorPhaseDeg" type="number" min="-360" max="360" step="1" value="'+(c.generatorPhaseDeg??d.generatorPhaseDeg??0)+'"></label><small class="property-help">OUT–GND: ideal eğitim kaynağı. Çıkış 0–5 V ile sınırlandırılır. Kare dalgada duty; tüm dalgalarda faz, frekans, Vpp ve alt seviye uygulanır. Durum: '+(c.generatorEnabled===false?'KAPALI':Number(c._signalFrequency??c.generatorFrequency??0).toFixed(2)+' Hz · '+Number(c._signalVpp??0).toFixed(2)+' Vpp')+'.</small>';
    else if(arduinoRole==='oscilloscope'){const s1=c._scopeStats1||{},s2=c._scopeStats2||{};arduinoControls.innerHTML='<label>Time/div (ms)<select data-arduino-setting="scopeTimeDivMs">'+[0.05,0.1,0.2,0.5,1,2,5,10,20,50,100,200].map(v=>'<option value="'+v+'" '+(Number(c.scopeTimeDivMs??((c.scopeTimeMs??d.scopeTimeMs??20)/10))===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label class="checkbox-row"><input data-arduino-setting="scopeChannel1" data-arduino-setting-type="bool" type="checkbox" '+(c.scopeChannel1!==false?'checked':'')+'> CH1 açık</label><label>CH1 V/div<select data-arduino-setting="scopeVoltsDiv1">'+[0.1,0.2,0.5,1,2,5].map(v=>'<option value="'+v+'" '+(Number(c.scopeVoltsDiv1??d.scopeVoltsDiv1??1)===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>CH1 pozisyon (div)<input data-arduino-setting="scopePosition1" type="number" min="-4" max="4" step="0.1" value="'+(c.scopePosition1??0)+'"></label><label>CH1 coupling<select data-arduino-setting="scopeCoupling1" data-arduino-setting-type="text">'+['DC','AC'].map(v=>'<option '+((c.scopeCoupling1||'DC')===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label class="checkbox-row"><input data-arduino-setting="scopeChannel2" data-arduino-setting-type="bool" type="checkbox" '+(c.scopeChannel2!==false?'checked':'')+'> CH2 açık</label><label>CH2 V/div<select data-arduino-setting="scopeVoltsDiv2">'+[0.1,0.2,0.5,1,2,5].map(v=>'<option value="'+v+'" '+(Number(c.scopeVoltsDiv2??d.scopeVoltsDiv2??1)===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>CH2 pozisyon (div)<input data-arduino-setting="scopePosition2" type="number" min="-4" max="4" step="0.1" value="'+(c.scopePosition2??0)+'"></label><label>CH2 coupling<select data-arduino-setting="scopeCoupling2" data-arduino-setting-type="text">'+['DC','AC'].map(v=>'<option '+((c.scopeCoupling2||'DC')===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Tetik modu<select data-arduino-setting="scopeTriggerMode" data-arduino-setting-type="text">'+[['auto','AUTO'],['normal','NORMAL'],['free','FREE']].map(v=>'<option value="'+v[0]+'" '+((c.scopeTriggerMode||'auto')===v[0]?'selected':'')+'>'+v[1]+'</option>').join('')+'</select></label><label>Tetik kaynağı<select data-arduino-setting="scopeTriggerSource" data-arduino-setting-type="text">'+['CH1','CH2'].map(v=>'<option '+((c.scopeTriggerSource||'CH1')===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Tetik kenarı<select data-arduino-setting="scopeTriggerEdge" data-arduino-setting-type="text">'+[['rising','Yükselen'],['falling','Düşen']].map(v=>'<option value="'+v[0]+'" '+((c.scopeTriggerEdge||'rising')===v[0]?'selected':'')+'>'+v[1]+'</option>').join('')+'</select></label><label>Tetik seviyesi (V)<input data-arduino-setting="scopeTriggerLevel" type="number" min="-5" max="10" step="0.1" value="'+(c.scopeTriggerLevel??d.scopeTriggerLevel??2.5)+'"></label><small class="property-help">CH1: '+Number(s1.vpp??0).toFixed(2)+' Vpp · '+Number(s1.rms??0).toFixed(2)+' Vrms · '+Number(s1.freq??0).toFixed(1)+' Hz · min/max '+Number(s1.min??0).toFixed(2)+'/'+Number(s1.max??0).toFixed(2)+' V<br>CH2: '+Number(s2.vpp??0).toFixed(2)+' Vpp · '+Number(s2.rms??0).toFixed(2)+' Vrms · '+Number(s2.freq??0).toFixed(1)+' Hz · min/max '+Number(s2.min??0).toFixed(2)+'/'+Number(s2.max??0).toFixed(2)+' V<br>Tetik: '+esc(c._scopeTriggered?'KİLİTLİ':'bekliyor')+'.</small>'}
    else if(arduinoRole==='bluetooth-hc05')arduinoControls.innerHTML='<label>Bluetooth adı<input data-arduino-setting="hc05Name" data-arduino-setting-type="text" maxlength="32" value="'+esc(c.hc05Name||d.deviceName||'HC-05')+'"></label><label>UART baud<select data-arduino-setting="hc05Baud">'+[1200,2400,4800,9600,19200,38400,57600,115200].map(v=>'<option value="'+v+'" '+(Number(c.hc05Baud||d.defaultBaud||9600)===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Eşleşme PIN<input data-arduino-setting="hc05Pin" data-arduino-setting-type="text" maxlength="16" value="'+esc(c.hc05Pin||d.pairingPin||'1234')+'"></label>'+(d.supportsAt?'<label class="checkbox-row"><input data-arduino-setting="hc05AtMode" data-arduino-setting-type="bool" type="checkbox" '+(c.hc05AtMode?'checked':'')+'> AT / KEY modu</label>':'')+'<small class="property-help">TXD → Arduino RX, RXD ← Arduino TX. HC-05 ve HC-06 Bluetooth Classic SPP/UART mantığıyla çalışır; TX/RX çapraz bağlanır. '+(d.supportsAt?'HC-05 master/slave ve KEY/AT desteklidir.':'HC-06 bu modelde slave olarak çalışır ve KEY/STATE pini yoktur.')+' Fiziksel RX girişinde 3,3 V lojik seviyesi dikkate alınmalıdır.</small>';
    else if(arduinoRole==='breadboard-power')arduinoControls.innerHTML='<label class="checkbox-row"><input data-arduino-setting="hw131On" data-arduino-setting-type="bool" type="checkbox" '+(c.hw131On!==false?'checked':'')+'> Güç anahtarı açık</label><label>Sol ray<select data-arduino-setting="hw131Left" data-arduino-setting-type="text">'+['5','3.3','OFF'].map(v=>'<option '+(String(c.hw131Left??d.hw131Left??'5')===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><label>Sağ ray<select data-arduino-setting="hw131Right" data-arduino-setting-type="text">'+['5','3.3','OFF'].map(v=>'<option '+(String(c.hw131Right??d.hw131Right??'3.3')===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><small class="property-help">HW-131: breadboard raylarını 5 V / 3,3 V / kapalı olarak seçer. Barrel girişinde 6,5–12 V; USB tarafında 5 V referansı kullanılır. Durum: '+esc(c._hw131Short?'KISA DEVRE':c._hw131Powered?'ENERJİLİ · '+(c._hw131Source||''):'ENERJİ YOK')+'.</small>';
    else if(arduinoRole==='ne555')arduinoControls.innerHTML='<label>Çalışma modu<select data-arduino-setting="ne555Mode" data-arduino-setting-type="text">'+[['logic','TRIG/THRES lojik'],['astable','Astable osilatör'],['monostable','Monostable tek atım']].map(v=>'<option value="'+v[0]+'" '+((c.ne555Mode||d.ne555Mode||'logic')===v[0]?'selected':'')+'>'+v[1]+'</option>').join('')+'</select></label><label>RA (kΩ)<input data-arduino-setting="ne555RaK" type="number" min="0.1" max="10000" step="0.1" value="'+(c.ne555RaK??1)+'"></label><label>RB / R (kΩ)<input data-arduino-setting="ne555RbK" type="number" min="0.1" max="10000" step="0.1" value="'+(c.ne555RbK??10)+'"></label><label>C (µF)<input data-arduino-setting="ne555Cuf" type="number" min="0.001" max="10000" step="0.001" value="'+(c.ne555Cuf??10)+'"></label><small class="property-help">Lojik mod: TRIG &lt; VCC/3 set, THRES &gt; 2VCC/3 reset; RESET düşükse OUT zorla LOW olur. Astable: tH≈0,693(RA+RB)C, tL≈0,693·RB·C. Monostable: t≈1,1·R·C. Durum: OUT '+(c._ne555Out?'HIGH':'LOW')+(c._ne555Frequency?' · '+Number(c._ne555Frequency).toFixed(2)+' Hz':'')+'.</small>';
    else if(arduinoRole==='a4988')arduinoControls.innerHTML='<label>Akım limiti (A)<input data-arduino-setting="a4988CurrentLimit" type="number" min="0.05" max="2" step="0.05" value="'+(c.a4988CurrentLimit??1)+'"></label><small class="property-help">STEP yükselen kenarında bir mikro-adım atılır; DIR yönü seçer. MS1/MS2/MS3: 1, 1/2, 1/4, 1/8, 1/16. VMOT/GNDM harici motor beslemesine, VDD/GND lojik beslemeye bağlanmalıdır. RESET veya SLEEP LOW ise sürücü devre dışıdır.</small>';
    else if(arduinoRole==='sevenseg')arduinoControls.innerHTML='<label>Ortak uç<select data-arduino-setting="sevenCommon" data-arduino-setting-type="text"><option value="cathode" '+((c.sevenCommon||d.sevenCommon||'cathode')==='cathode'?'selected':'')+'>Ortak katot</option><option value="anode" '+((c.sevenCommon||d.sevenCommon)==='anode'?'selected':'')+'>Ortak anot</option></select></label><small class="property-help">A–G ve DP ayrı LED segmentleridir. Ortak katotta HIGH, ortak anotta LOW segmenti yakar. Her segment için gerçek devrede seri akım sınırlama direnci kullanın.</small>';
    else if(arduinoRole==='lcd1602-i2c'||arduinoRole==='lcd-i2c-backpack')arduinoControls.innerHTML='<label>I2C adresi (decimal)<input data-arduino-setting="i2cAddress" type="number" min="1" max="127" value="'+(c.i2cAddress??d.i2cAddress??39)+'"></label><small class="property-help">Yaygın PCF8574 backpack adresi 0x27 (39), PCF8574A varyantı sıklıkla 0x3F (63). UNO: SDA=A4, SCL=A5. Ayrı backpack kullanılıyorsa 16-pin LCD headerı VSS–K uçlarıyla normal LCD1602’ye bağlayın.</small>';
    else arduinoControls.innerHTML='';
    $('#deviceBehaviorSettings').hidden=!(isSensor||isAnalog||isTimed);$('#sensorOutputRow').hidden=!isSensor;$('#propSensorOutput').value=c.sensorOutput||d.outputType||'PNP';
    $('#analogModeRow').hidden=!['sensor-level-analog','sensor-ultrasonic-analog'].includes(d.id);$('#propAnalogMode').value=c.analogMode||'current';$('#analogPositionRow').hidden=!['sensor-level-analog','sensor-linear-position','sensor-ultrasonic-analog'].includes(d.id);$('#propAnalogPosition').value=c.analogPosition??50;
    $('#temperatureRow').hidden=!(d.ptWires||['sensor-ntc','sensor-ptc','thermocouple'].includes(d.id));$('#propTemperature').value=c.temperature??25;const thermalRange=window.DTSThermal.range(d,c);$('#propTemperature').min=thermalRange[0];$('#propTemperature').max=thermalRange[1];
    $('#analogModelNote').textContent=isAnalog?(d.id==='load-cell'?'SB2: 2 mV/V. EX+/EX− uçlarına 10 VDC uygulayın. SIG+ ile SIG− arasındaki fark = 2 × besleme (V) × yük / kapasite (mV).':d.ptWires?'PT100: 0°C = 100 Ω. 2 tel: A–B1; 3 tel: A–B1/B2; 4 tel: A/A2–B1/B2. Aynı harfli uçlar aynı sensör ucuna bağlıdır.':(['sensor-ntc','sensor-ptc','thermocouple'].includes(d.id)?'Eğitim eğrisi: NTC 10kΩ/B3950; PTC 1kΩ pozitif eğri; Termokupl: NIST ITS-90 eğrisi ve seçilen soğuk uç sıcaklığı. Ürün kalibrasyonu değildir.':'Besleme: 24 VDC. Hareketli parçayı sürükleyin; çıkış konuma göre doğrusal değişir.')):isSensor?'Besleme: yalnız 24 VDC. BN pozitif, BU negatif.':'';
    $('#timingRows').hidden=!isTimed;$('#propTimerMode').value=c.timerMode||(d.id.includes('off')?'off':'on');$('#propDelayValue').value=c.delayValue??1;$('#propDelayUnit').value=c.delayUnit||'sec';
    $('#propLabel').value=c.label||'';$('#propRef').value=c.ref||'';$('#propAddress').value=c.address||'';$('#propNote').value=c.note||'';
    $('#propShowNote').checked=c.showNote!==false;
    const photo=window.CCSMaterials.info(d);
    $('#propNormSource').textContent=appearance==='material'?((photo.part||photo.model||d.model)+(d.isPLC?' · '+(photo.match==='exact'?'Ürün görseli':photo.match==='family'?'Aile / varyant görseli':'Temsili görsel'):'')):Norms.reference(d,project.symbolNorm).basis+' · s. '+Norms.reference(d,project.symbolNorm).pages+(d.diagramOnly?' · '+(d.catalogGroup==='panel-layout'?'Pano yerleşimi':'Çizim ve bağlantı; sayısal model yok'):'');
    const guide=d.deviceGuide,guideBox=$('#deviceGuide');
    guideBox.hidden=!guide;
    if(guide){
      const rows=(guide.connections||[]).map(x=>'<tr><th>'+esc(x[0])+'</th><td>'+esc(x[1])+'</td></tr>').join('');
      const examples=(guide.examples||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
      guideBox.innerHTML='<strong>'+esc(d.name)+'</strong><p><b>Ne işe yarar:</b> '+esc(guide.purpose||'')+'</p><p><b>Kullanım amacı:</b> '+esc(guide.usage||'')+'</p>'+(rows?'<details open><summary>Bağlantıların amacı</summary><table>'+rows+'</table></details>':'')+(examples?'<details><summary>Kullanım örnekleri</summary><ul>'+examples+'</ul></details>':'')+(guide.source?'<small>Kaynak: '+esc(guide.source)+'</small>':'');
    }
    const doldBox=$('#doldSettings'),isDold=!!d.doldSafety;doldBox.hidden=!isDold;
    if(isDold){
      $('#propDoldStartMode').value=c.doldStartMode||d.doldStartMode||'manual';
      $('#doldDelayRow').hidden=!d.doldOffDelayPair;$('#propDoldOffDelay').value=c.doldOffDelaySeconds??d.doldOffDelaySeconds??1;
      $('#doldCrossRow').hidden=!d.doldLogic?.crossCheck;$('#propDoldCrossShort').checked=c.doldCrossShort!==false;
      $('#doldRuntimeStatus').textContent='Durum: '+(c._doldEval?.status||'Simülasyon kapalı')+(d.doldLogic?.simultaneityMs?' · iki el senkron penceresi '+d.doldLogic.simultaneityMs+' ms':'');
    }
    $('#addressRow').style.display=d.isPLC||d.visualOnly||d.diagramOnly?'flex':'none';
    $('#plcTerminalInfo').hidden=!d.isPLC;$('#plcTerminalInfo').textContent=d.isPLC?(d.documented?Object.entries(d.io).map(([k,v])=>k+': '+v).join(' · ')+' — '+d.terminalSource:'Bu aile kaydının terminal düzeni temsilidir; kesin model bağlantısı henüz doğrulanmadı.'):'';
    $('#directionRow').hidden=!window.CCSAudio.rotating(d);$('#propDirection').value=c.direction==='ccw'?'ccw':'cw';
    $('#deviceColorRow').hidden=!Components.hasColor(d);$('#propDeviceColor').value=Components.deviceColor(c,d);
    $('#windingConnectionRow').hidden=d.id!=='motor-1p';$('#propWindingConnection').value=c.windingConnection||'forward';
    $('#acs800Settings').hidden=d.id!=='abb-acs800-r5';$('#acs800SidebarStatus').setAttribute('data-owner',c.id);$('#driveSettings').hidden=d.id!=='sinamics-v20-1p';$('#v20SidebarStatus').setAttribute('data-owner',c.id);$('#hcfaSettings').hidden=d.id!=='hcfa-sv-x2ea040a-a';$('#hcfaSidebarStatus').setAttribute('data-owner',c.id);window.DTSV20UI.sync();window.DTSACS800UI.sync();window.DTSHCFAUI?.sync();
    if(d.id==='hcfa-sv-x2ea040a-a'){
      const hp=window.DTSHCFA.config(c).params;
      $('#hcfaQuickMode').value=String(hp['P00.01']);$('#hcfaQuickPositionSource').value=String(hp['P00.05']);$('#hcfaQuickSpeed').value=hp['P03.03'];$('#hcfaQuickTorque').value=hp['P03.25'];$('#hcfaQuickPosition').value=hp['P08.06'];$('#hcfaQuickAxis').value=hp['P09.00'];
    }
    $('#loadCellSettings').hidden=d.id!=='load-cell';$('#propLoadCapacity').value=c.loadCapacity||1000;$('#propLoadWeight').value=c.loadWeight||0;$('#propLoadWeight').max=c.loadCapacity||1000;
    $('#excitationRow').hidden=!d.excitationSource;$('#propExcitation').value=c.dcVoltage??10;
    $('#arduinoSupplySettings').hidden=d.arduinoRole!=='bench-supply';$('#propArduinoSupplyVoltage').value=c.dcVoltage??d.defaultVoltage??5;$('#propArduinoSupplyCurrent').value=c.currentLimit??d.defaultCurrentLimit??1;
    $('#ctSettings').hidden=d.kind!=='current-transformer';$('#propCtRatio').value=(c.ctPrimary||100)+'/'+(c.ctSecondary||5);
    $('#resistanceRow').hidden=!['resistor','lamp'].includes(d.kind);$('#propResistance').value=c.resistance||1000;$('#capacitanceRow').hidden=d.kind!=='capacitor';$('#propCapacitance').value=(c.capacitance??d.capacitance??100e-6)*1e6;$('#inductanceRow').hidden=!(d.kind==='reactor'||d.id==='winding');$('#propInductance').value=(c.inductance??d.inductance??.15)*1000;const reactiveRow=$('#reactiveLiveRow');reactiveRow.hidden=!['capacitor','reactor'].includes(d.kind)&&d.id!=='winding';if(!reactiveRow.hidden)reactiveRow.textContent=(c._reactiveModel||'RLC modeli hazır')+(Number.isFinite(c._reactiveCurrent)?' · I='+c._reactiveCurrent.toFixed(4)+' A':'')+(Number.isFinite(c._reactiveVoltage)?' · U='+c._reactiveVoltage.toFixed(2)+' V':'');
    $('#nhSettings').hidden=d.id!=='nh-fuse-holder';for(let i=0;i<3;i++){$('#nhFuse'+i).checked=!!c.nhFuses?.[i];$('#nhFuse'+i).disabled=!c.state}
    $('#phaseSourceSettings').hidden=d.kind!=='supply3';for(const p of ['L1','L2','L3'])$('#phaseVoltage'+p).value=c.phaseVoltages?.[p]??230;
    $('#propMaterialScale').value=Math.round((c.materialScale||1)*100);
    $('#ptWiresRow').hidden=!d.ptWires;$('#propPtWires').value=d.ptWires||3;
    $('#poleCountRow').hidden=!d.id.startsWith('door-isolator-');$('#propPoleCount').value=d.contacts?.length||1;
    $('#fuseCountRow').hidden=!d.fuseSlots;$('#propFuseCount').value=d.fuseSlots||1;
    $('#potMaxRow').hidden=d.id!=='potentiometer';$('#propPotMax').value=c.potMax??10000;
    $('#potentiometerRow').hidden=d.id!=='potentiometer';$('#propPotentiometer').value=c.potentiometer??50;
    $('#selectorStepsRow').hidden=!d.selectorSteps;$('#propSelectorSteps').value=d.selectorSteps||1;$('#flashSettings').hidden=!['flasher','coil-flasher'].includes(d.kind);$('#propFlashOn').value=c.flashOn??c.delayValue??1;$('#propFlashOff').value=c.flashOff??c.delayValue??1;$('#packetSettings').hidden=!d.positions;
    if(d.positions){$('#propPacketPosition').innerHTML=d.positions.map((name,i)=>'<option value="'+i+'">'+esc(name)+'</option>').join('');$('#propPacketPosition').value=c.position||0;
      $('#packetTable').innerHTML='<tr><th>Kontak</th>'+d.positions.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr>'+d.contacts.map(g=>'<tr><td>'+esc(g.a+'–'+g.b)+'</td>'+d.positions.map((_,i)=>'<td>'+(Components.contactStates({...c,position:i},d,false)[g.id]?'●':'—')+'</td>').join('')+'</tr>').join('');}
    $('#motorConnectionRow').hidden=!['motor3','motor-yd'].includes(d.kind);
    $('#propMotorConnection').value=c.motorConnection||(d.kind==='motor3'?'star':'external');
    $('#motorTutorial').hidden=!d.kind.includes('motor');
    $('#motorTutorialText').textContent=d.kind==='motor'?'Bir fazlı asenkron motorda ana sargı U1–U2, yardımcı sargı Z1–Z2 uçlarıdır. Yalnızca bir sargının uçlarını değiştirin. Her iki sargıyı birlikte ters çevirmek yönü değiştirmez. Kaynak: EET2025KKA1008, s. 26 ve 76–81.': 'Üç fazlı motorda U1–V1–W1 giriş, U2–V2–W2 çıkış uçlarıdır. Yıldızda üç çıkış birleşir; üçgende U1–W2, V1–U2, W1–V2 köprülenir. Harici yıldız-üçgen kontaktörleri için köprüleri kaldırın. L1, L2, L3 fazlarından herhangi ikisini değiştirmek yönü ters çevirir; döngüsel kaydırmak değiştirmez. Klemens görünümünde alt sıra W2–U2–V2 şeklindedir. Kaynak: EET2025KKA1008, s. 24–25. Dahlander motorun Δ/YY bağlantısı ayrı bir sargı düzenidir; standart yıldız-üçgen bağlantısı uygulanmaz.';
    const groups=d.selectorSteps||d.rotaryIsolator||d.kind==='phase-monitor'||d.kind==='nh-holder'||d.fuseSlots||d.positions?[]:Components.contactGroups(d).filter(g=>!g.inverseOf);
    $('#contactTypeRow').hidden=!groups.length;$('#contactTypeHelp').hidden=!groups.length;
    const modes=groups.map(g=>Components.contactMode(c,d,g)),mixed=new Set(modes).size>1;
    $('#propContactType').innerHTML=(mixed?'<option value="mixed" disabled>Karma — ayrı kontak ayarları</option>':'')+'<option value="NO">NO · Normalde açık</option><option value="NC">NC · Normalde kapalı</option>';
    $('#propContactType').value=mixed?'mixed':modes[0]||'NO';
    $('#contactGroups').innerHTML=groups.length>1?groups.map(g=>{
      const a=d.pins.find(p=>p.id===g.a),b=d.pins.find(p=>p.id===g.b),label=(g.position!==undefined?'Konum '+g.position+' · ':g.auxiliary?'Yardımcı · ':'')+Components.pinLabel(c,d,a)+' → '+Components.pinLabel(c,d,b);
      const mode=Components.contactMode(c,d,g);
      return '<label class="contact-group-row"><span>'+esc(label)+'</span><select data-contact-group="'+esc(g.id)+'"><option value="NO"'+(mode==='NO'?' selected':'')+'>NO</option><option value="NC"'+(mode==='NC'?' selected':'')+'>NC</option></select></label>';
    }).join(''):'';
    updateSensorProperties(c,d);
    const inherited=Object.entries(c._terminalLines||{});$('#terminalLineInfo').hidden=!inherited.length;$('#terminalLineInfo').textContent=inherited.map(([p,line])=>p+' → '+(line.freeColor?'Serbest renk':line.role)).join(' · ');
    if(innerWidth<=1050)applyPropertiesVisibility(true);
  }
  function projectChanged(){render()}
  function prepareLabelInteraction(g){
    for(const label of g.querySelectorAll('[data-label-key]')){
      label.setAttribute('tabindex','0');label.setAttribute('role','button');
      label.setAttribute('aria-label',(label.textContent||'Etiket')+' · Sürükleyin veya ok tuşlarıyla taşıyın');
    }
  }
  function renderNotes(){
    let layer=els.scene.querySelector('.note-overlay-layer');
    if(!layer){layer=svg('g',{class:'note-overlay-layer'});els.scene.appendChild(layer)}
    layer.innerHTML='';
    for(const c of project.components){
      const d=byId[c.typeId],markup=d&&Symbols.noteMarkup(d,c,{mode:appearance});if(!markup)continue;
      const note=svg('g',{class:'component-note-overlay','data-note-owner':c.id,transform:'translate('+c.x+' '+c.y+')'},markup);
      prepareLabelInteraction(note);layer.appendChild(note);
    }
    els.scene.appendChild(layer);raiseMeasurements();
  }
  function labelOwnerId(node){return node.closest('[data-note-owner]')?.dataset.noteOwner||node.closest('.component')?.dataset.id}
  function labelNode(c,key){if(key==='note'){const owner=[...els.scene.querySelectorAll('[data-note-owner]')].find(g=>g.dataset.noteOwner===c.id);return owner?.querySelector('[data-label-key="note"]')}
    const g=[...els.scene.querySelectorAll('g.component')].find(g=>g.dataset.id===c.id);return g&&[...g.querySelectorAll('[data-label-key]')].find(n=>n.dataset.labelKey===key)}
  function positionLabelNode(c,key){const node=labelNode(c,key);if(!node)return;const pos=Labels.position(c,key,{x:Number(node.dataset.baseX),y:Number(node.dataset.baseY)});node.setAttribute('transform',`translate(${pos.x} ${pos.y})`)}
  function beginLabelDrag(node,e){
    if(window.DTSProjects.isProtected(project)){window.DTSStudio?.protectedNotice();return}
    const owner=node.closest('[data-note-owner]')||node.closest('.component'),c=project.components.find(c=>c.id===labelOwnerId(node));if(!c)return;
    e.preventDefault();e.stopPropagation();node.focus({preventScroll:true});setSelection([c.id]);selectedWire=null;
    const key=node.dataset.labelKey,base={x:Number(node.dataset.baseX),y:Number(node.dataset.baseY)},drag=Labels.begin(c,key,base,{x:e.clientX,y:e.clientY},zoom*(key==='note'?1:(c.materialScale||1))),previous=clone(c.labelPositions||{}),oldFuture=[...future];
    let moved=false;labelDragging=true;document.body.classList.add('label-dragging');
    owner.parentNode.appendChild(owner);raiseTerminalLeads();const notes=els.scene.querySelector('.note-overlay-layer');if(notes)els.scene.appendChild(notes);raiseMeasurements();for(const g of els.scene.querySelectorAll('g.component'))g.classList.toggle('selected',g.dataset.id===c.id);updateProperties();
    const move=ev=>{
      if(ev.pointerId!==e.pointerId)return;
      if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<2)return;
      if(!moved){if(!snapshot())return;moved=true}
      Labels.move(c,drag,{x:ev.clientX,y:ev.clientY});positionLabelNode(c,key);
      setStatus('Etiket taşınıyor · Bağlantılar sabit');
    };
    const finish=(cancel=false)=>{
      window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancelDrag);window.removeEventListener('blur',cancelDrag);document.removeEventListener('keydown',keyDown,true);
      labelDragging=false;labelCancel=null;document.body.classList.remove('label-dragging');
      if(cancel&&moved){c.labelPositions=previous;history.pop();future=oldFuture;positionLabelNode(c,key)}
      if(moved&&!cancel){scheduleSave();setStatus('Etiket konumu kaydedildi')}
    };
    const up=ev=>{if(ev.pointerId===e.pointerId&&ev.button===0)finish()},cancelDrag=()=>finish(true),keyDown=ev=>{if(ev.key==='Escape'){ev.preventDefault();ev.stopImmediatePropagation();finish(true)}};
    labelCancel=cancelDrag;window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancelDrag);window.addEventListener('blur',cancelDrag);document.addEventListener('keydown',keyDown,true);
  }
  function refreshArtwork(){
    if(project.workspaceMode==='panel'){window.DTSPanelEditor?.render();return}
    if(project.components.some(c=>c.auxFor||byId[c.typeId]?.materialPins)){render();return}
    for(const g of els.scene.querySelectorAll('g.component')){
      const c=project.components.find(c=>c.id===g.dataset.id),d=c&&byId[c.typeId];if(!d)continue;
      g.setAttribute('class',Symbols.classes(d,c,appearance)+(selectedIds.has(c.id)?' selected':''));
      g.innerHTML=Symbols.markup(materialDefinition(c,d),c,{pending:pendingPort,mode:appearance,norm:project.symbolNorm,includeNote:false,wireOverlayOnly:wireOverDeviceBody(d)});prepareLabelInteraction(g);
    }
    renderNotes();updateNormBadge();updateProperties();
  }
  function download(){const blob=new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(project.name||'devre').replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ_-]+/gi,'_')+'.odsdevre';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('Proje dosyası hazırlandı')}
  function modal(title,body,confirm){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#modal').hidden=false;$('#modalConfirm').onclick=()=>{$('#modal').hidden=true;confirm()};$('#modalCancel').onclick=()=>$('#modal').hidden=true}

  els.search.addEventListener('input',renderLibrary);
  let camera={x:24,y:24,zoom:1};
  function applyCamera(){
    zoom=camera.zoom;els.workspace.style.transform='translate('+camera.x+'px,'+camera.y+'px) scale('+zoom+')';
    $('#zoomLabel').textContent=Math.round(zoom*100)+'%';
  }
  function setSelection(ids){selectedIds=new Set(ids);selected=selectedIds.size===1?[...selectedIds][0]:null}
  function refreshSelection(){
    for(const g of els.scene.querySelectorAll('g.component'))g.classList.toggle('selected',selectedIds.has(g.dataset.id));
    for(const g of els.scene.querySelectorAll('[data-wire]'))g.querySelector('.wire')?.classList.toggle('selected',g.dataset.wire===selectedWire);
    renderWireEditors();const notes=els.scene.querySelector('.note-overlay-layer');if(notes)els.scene.appendChild(notes);raiseMeasurements();updateProperties();updateWireStatus();
  }
  function selectAll(){
    if(project.workspaceMode==='panel'){window.DTSPanelEditor?.selectAll();return}
    if(gesture||labelDragging)return;
    resetDraft();els.scene.querySelector('.draft-wire-group')?.remove();selectedWire=null;
    setSelection(project.components.map(c=>c.id));refreshSelection();setStatus(selectedIds.size+' eleman seçildi');
  }
  function worldPoint(e){return pointerWorldPoint(e)}
  function componentLocalPoint(c,d,e){const p=worldPoint(e),scale=c.materialScale||1,definition=materialDefinition(c,d),q={x:(p.x-c.x)/scale,y:(p.y-c.y)/scale};return Symbols.rotatedPoint(q,definition,-(c.rotation||0))}
  function trackGesture(e,handlers){
    let finished=false;
    const move=ev=>{if(ev.pointerId!==e.pointerId)return;if(ev.pointerType==='mouse'&&!(ev.buttons&(e.button===2?2:1))){finish(false,ev);return}handlers.move(ev)};
    const up=ev=>{if(ev.pointerId===e.pointerId&&ev.button===e.button)finish(false,ev)};
    const cancel=()=>finish(true),key=ev=>{if(ev.key==='Escape'){ev.preventDefault();ev.stopImmediatePropagation();finish(true)}};
    function finish(cancelled,ev){
      if(finished)return;finished=true;
      try{if(els.viewport.hasPointerCapture(e.pointerId))els.viewport.releasePointerCapture(e.pointerId)}catch{}
      window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);window.removeEventListener('blur',cancel);document.removeEventListener('keydown',key,true);
      gesture=null;document.body.classList.remove('canvas-gesture');handlers.finish(cancelled,ev);
    }
    gesture={cancel};document.body.classList.add('canvas-gesture');
    try{els.viewport.setPointerCapture(e.pointerId)}catch{}
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);document.addEventListener('keydown',key,true);
  }
  function beginCanvasPan(e){
    if(e.button!==2)return;
    e.preventDefault();e.stopPropagation();if(gesture||labelDragging||heldPointers.size)return;
    hideWireMenu();const start={...camera},wireId=e.target.closest('[data-wire],[data-editor-wire]')?.dataset;
    let moved=false;
    trackGesture(e,{
      move:ev=>{
        const dx=ev.clientX-e.clientX,dy=ev.clientY-e.clientY;
        if(!moved&&Math.hypot(dx,dy)<4)return;
        moved=true;els.viewport.classList.add('panning');camera=Viewport.panFrom(start,dx,dy);applyCamera();
      },
      finish:(cancelled,ev)=>{
        els.viewport.classList.remove('panning');
        if(cancelled){camera=start;applyCamera();return}
        if(!moved){const w=project.wires.find(w=>w.id===(wireId?.wire||wireId?.editorWire));if(w)openWireMenu(w,ev)}
      }
    });
  }
  function viewportPoint(e){
    const r=els.viewport.getBoundingClientRect();
    return {x:e.clientX-r.left,y:e.clientY-r.top};
  }
  function beginMarquee(e){
    if(gesture||labelDragging)return;e.preventDefault();
    const before=[...selectedIds],additive=e.shiftKey||e.ctrlKey||e.metaKey,start=worldPoint(e),screenStart=viewportPoint(e);
    selectedWire=null;if(!additive)setSelection([]);refreshSelection();
    const box=document.createElement('div');box.className='selection-box';box.setAttribute('aria-hidden','true');let moved=false;
    trackGesture(e,{
      move:ev=>{
        if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<4)return;
        if(!moved){moved=true;els.viewport.appendChild(box);els.viewport.classList.add('selecting')}
        const end=worldPoint(ev),screenEnd=viewportPoint(ev),screenRect=Selection.rectangle(screenStart,screenEnd);
        Object.assign(box.style,{left:screenRect.left+'px',top:screenRect.top+'px',width:(screenRect.right-screenRect.left)+'px',height:(screenRect.bottom-screenRect.top)+'px'});
        setSelection([...(additive?before:[]),...Selection.inBox(project.components,byId,start,end)]);refreshSelection();
      },
      finish:cancelled=>{box.remove();els.viewport.classList.remove('selecting');if(cancelled)setSelection(before);refreshSelection();setStatus(selectedIds.size?selectedIds.size+' eleman seçildi':'Hazır')}
    });
  }
  function probeRoute(w){
    const node=[...els.scene.querySelectorAll('[data-wire]')].find(g=>g.dataset.wire===w.id)?.querySelector('.wire');
    if(node?.getTotalLength){const length=node.getTotalLength();if(length>0){const n=Math.max(1,Math.ceil(length/6));return Array.from({length:n+1},(_,i)=>{const p=node.getPointAtLength(length*i/n);return {x:p.x,y:p.y}})}}
    return renderedWirePoints[w.id]||[];
  }
  function clampJawPoint(c,d){const scale=c.materialScale||1,q=Symbols.rotatedPoint({x:d.w/2,y:65},d,c.rotation||0);return {x:c.x+q.x*scale,y:c.y+q.y*scale}}
  function clampNearest(c,d){const jaw=clampJawPoint(c,d);let best=null;for(const w of project.wires){if(w.probeLead||w.mechanical||w.role==='MECHANICAL')continue;const hit=Leads.nearest(probeRoute(w),jaw);if(hit&&hit.distance<38/zoom&&(!best||hit.distance<best.distance))best={wireId:w.id,t:hit.t,point:hit.point,distance:hit.distance}}return best}
  function syncClampPositions(){if(!Clamp)return;for(const c of project.components){const d=byId[c.typeId];if(d?.kind!=='clamp-meter'||!c.clampedWireId)continue;const w=project.wires.find(w=>w.id===c.clampedWireId);if(!w||w.probeLead||w.mechanical||w.role==='MECHANICAL'){delete c.clampedWireId;delete c.clampT;continue}const point=Leads.at(probeRoute(w),c.clampT);if(!point)continue;const jaw=clampJawPoint(c,d);c.x+=point.x-jaw.x;c.y+=point.y-jaw.y}}
  function syncProbePositions(){
    for(const c of project.components){if(!byId[c.typeId]?.probeColor||!c.probeTarget)continue;
      const target=Leads.resolve(project,byId,c.probeTarget);if(!target){delete c.probeTarget;continue}
      const w=c.probeTarget.w&&project.wires.find(w=>w.id===c.probeTarget.w),pos=w?Leads.at(probeRoute(w),c.probeTarget.t):endpointInfo(target).pos;
      if(pos){const tip=absolutePort({c:c.id,p:'TIP'});c.x+=pos.x-tip.x;c.y+=pos.y-tip.y}
    }
  }
  function raiseMeasurements(){const layer=els.scene.querySelector('.measurement-overlay');if(layer)els.scene.appendChild(layer)}
  function renderMeasurementOverlay(){
    els.scene.querySelector('.measurement-overlay')?.remove();
    if(!project.components.some(c=>Leads.floating(byId[c.typeId])))return;
    const layer=svg('g',{class:'measurement-overlay'});els.scene.appendChild(layer);
    project.components.filter(c=>byId[c.typeId]?.kind==='multimeter').forEach(c=>renderComponent(c,layer));
    for(const w of project.wires.filter(w=>w.probeLead)){
      const {path}=Leads.curve(endpointInfo(w.from),endpointInfo(w.to),w.flexOffset),width=Math.max(4,Lines.width(w.size)),g=svg('g',{'data-wire':w.id,class:'probe-lead',style:'--wire-width:'+width+'px'});
      g.innerHTML=`<title>${esc(colorNames[w.color])} ölçüm kablosu · Sürükleyerek kıvrımı değiştirin</title><path class="probe-lead-shadow" d="${path}"/><path class="wire ${selectedWire===w.id?'selected':''}" d="${path}" stroke="${w.color}"/><path class="probe-lead-shine" d="${path}"/><path class="wire-hit" d="${path}"/>`;
      layer.appendChild(g);
    }
    for(const c of project.components.filter(c=>byId[c.typeId]?.probeColor)){
      renderComponent(c,layer);
      if(c.probeTarget){const pos=absolutePort({c:c.id,p:'TIP'});layer.appendChild(svg('circle',{class:'probe-contact','data-probe-contact':c.id,cx:pos.x,cy:pos.y,r:5}))}
    }
  }
  function renderMeasurements(){
    Leads.prepare(project,byId);syncProbePositions();clearTimeout(simulationTimer);simulationTimer=null;if(running)runSolver();
    sound.sync(project,byId,running);els.simulate.classList.toggle('running',running);els.simulate.textContent=running?'■ DURDUR':'▶ SİMÜLE ET';
    renderMeasurementOverlay();updateSimulationPresentation();updateProperties();scheduleSave();
  }
  function beginProbeLeadDrag(w,e){
    if(gesture||labelDragging)return;e.preventDefault();
    const old=clone(w.flexOffset||{x:0,y:0}),start=worldPoint(e),oldFuture=[...future];let moved=false;
    trackGesture(e,{move:ev=>{const q=worldPoint(ev);if(!moved&&Math.hypot(q.x-start.x,q.y-start.y)<3)return;if(!moved){if(!snapshot(true))return;moved=true}w.flexOffset={x:old.x+q.x-start.x,y:old.y+q.y-start.y};renderMeasurements()},finish:cancel=>{if(cancel&&moved){w.flexOffset=old;history.pop();future=oldFuture}if(moved)renderMeasurements()}});
  }
  function beginMeterDrag(c,e){
    if(gesture||labelDragging)return;e.preventDefault();
    const old={x:c.x,y:c.y},start=worldPoint(e),oldFuture=[...future];let moved=false;
    trackGesture(e,{move:ev=>{const q=worldPoint(ev);if(!moved&&Math.hypot(q.x-start.x,q.y-start.y)<3)return;if(!moved){if(!snapshot(true))return;moved=true}c.x=old.x+q.x-start.x;c.y=old.y+q.y-start.y;renderMeasurements()},finish:cancel=>{if(cancel&&moved){Object.assign(c,old);history.pop();future=oldFuture}if(moved)renderMeasurements();else updateProperties()}});
  }

  function beginProbeDrag(c,e){
    if(gesture||labelDragging)return;e.preventDefault();e.stopPropagation();selectedWire=null;setSelection([c.id]);
    const old={x:c.x,y:c.y,target:clone(c.probeTarget||null)},start=worldPoint(e),oldFuture=[...future];let moved=false;
    trackGesture(e,{move:ev=>{const q=worldPoint(ev);if(!moved&&Math.hypot(q.x-start.x,q.y-start.y)<3)return;if(!moved){if(!snapshot(true))return;moved=true}delete c.probeTarget;c.x=old.x+q.x-start.x;c.y=old.y+q.y-start.y;const tip=absolutePort({c:c.id,p:'TIP'});let best=null;
      for(const other of project.components){const d=byId[other.typeId];if(other.id===c.id||d.probeColor||d.kind==='multimeter'||d.kind==='clamp-meter')continue;for(const p of d.pins){const pos=portPosition(other,d,p),distance=Math.hypot(tip.x-pos.x,tip.y-pos.y);if(distance<16/zoom&&(!best||distance<best.distance))best={ref:{c:other.id,p:p.id},pos,distance}}}
      for(const j of project.junctions||[]){const distance=Math.hypot(tip.x-j.x,tip.y-j.y);if(distance<16/zoom&&(!best||distance<best.distance))best={ref:{j:j.id},pos:j,distance}}
      for(const w of project.wires){if(w.probeLead)continue;const hit=Leads.nearest(probeRoute(w),tip);if(hit&&hit.distance<12/zoom&&(!best||hit.distance+1/zoom<best.distance))best={ref:{w:w.id,t:hit.t},pos:hit.point,distance:hit.distance}}
      if(best){c.x+=best.pos.x-tip.x;c.y+=best.pos.y-tip.y;c.probeTarget=best.ref}renderMeasurements();
    },finish:cancel=>{if(cancel&&moved){c.x=old.x;c.y=old.y;if(old.target)c.probeTarget=old.target;else delete c.probeTarget;history.pop();future=oldFuture}if(moved){renderMeasurements();scheduleSave()}updateProperties()}});
  }
  function beginClampDrag(c,e){
    if(!guardEdit()||gesture||labelDragging)return;e.preventDefault();
    const d=byId[c.typeId],old={x:c.x,y:c.y,wire:c.clampedWireId,t:c.clampT},start=worldPoint(e),oldFuture=[...future];let moved=false,candidate=null;
    trackGesture(e,{move:ev=>{const q=worldPoint(ev);if(!moved&&Math.hypot(q.x-start.x,q.y-start.y)<3)return;if(!moved){if(!snapshot(true))return;moved=true}delete c.clampedWireId;delete c.clampT;c.x=old.x+q.x-start.x;c.y=old.y+q.y-start.y;candidate=clampNearest(c,d);c._clampCandidate=candidate?{wireId:candidate.wireId,t:candidate.t}:null;c._clampJawOpen=!!candidate;render();},finish:cancel=>{if(cancel&&moved){c.x=old.x;c.y=old.y;if(old.wire){c.clampedWireId=old.wire;c.clampT=old.t}else{delete c.clampedWireId;delete c.clampT}history.pop();future=oldFuture}else if(moved&&candidate){c.clampedWireId=candidate.wireId;c.clampT=candidate.t;const jaw=clampJawPoint(c,d);c.x+=candidate.point.x-jaw.x;c.y+=candidate.point.y-jaw.y}delete c._clampJawOpen;delete c._clampCandidate;if(moved){render();scheduleSave()}updateProperties()}});
  }
  function beginComponentDrag(c,e){
    if(byId[c.typeId]?.kind==='clamp-meter'&&selectedIds.size===1){beginClampDrag(c,e);return}
    if(byId[c.typeId]?.kind==='multimeter'&&selectedIds.size===1){beginMeterDrag(c,e);return}
    if(!guardEdit())return;
    if(gesture||labelDragging)return;e.preventDefault();
    const ids=[...selectedIds],plan=Selection.beginMove(project,ids,byId,renderedWirePoints),startZoom=zoom,oldFuture=[...future];
    let moved=false,raf=0;
    trackGesture(e,{
      move:ev=>{
        if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<4)return;
        let delta=Selection.constrain(plan,(ev.clientX-e.clientX)/startZoom,(ev.clientY-e.clientY)/startZoom,GRID,SHEET_W,SHEET_H);
        if(!moved&&!delta.x&&!delta.y)return;
        if(!moved){if(!snapshot())return;moved=true}
        Selection.applyMove(plan,delta);
        const x=c.x,y=c.y;snapDraggedComponent(c);
        delta=Selection.constrain(plan,delta.x+c.x-x,delta.y+c.y-y,GRID,SHEET_W,SHEET_H);Selection.applyMove(plan,delta);
        if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()});
      },
      finish:cancelled=>{
        if(raf)cancelAnimationFrame(raf);alignmentGuides=[];
        if(cancelled&&moved){Selection.restore(plan);history.pop();future=oldFuture}
        if(moved){render();scheduleSave()}
        else if(!cancelled&&ids.length>1){setSelection([c.id]);refreshSelection()}
      }
    });
  }

  function operateInstallation(node,e){
    const c=project.components.find(c=>c.id===node.closest('.component')?.dataset.id),d=c&&byId[c.typeId],key=node.dataset.installationContact;
    if(!d?.independentContacts||!running)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);
    if(!snapshot(true))return;c.switchStates={...(c.switchStates||{})};
    if(d.controlMode!=='momentary'){c.switchStates[key]=!c.switchStates[key];render(true);scheduleSave();return}
    c.switchStates[key]=true;render(true);const keyboard=e.type==='keydown';
    const release=ev=>{if(ev.type!=='blur'&&(keyboard?!['Enter',' '].includes(ev.key):ev.pointerId!==e.pointerId))return;c.switchStates[key]=false;window.removeEventListener(keyboard?'keyup':'pointerup',release);window.removeEventListener('pointercancel',release);window.removeEventListener('blur',release);render(true);scheduleSave()};
    window.addEventListener(keyboard?'keyup':'pointerup',release);window.addEventListener('pointercancel',release);window.addEventListener('blur',release);
  }

  els.viewport.tabIndex=0;
  els.viewport.addEventListener('pointerdown',e=>{if(e.button===0||e.button===2)els.viewport.focus({preventScroll:true})},true);
  els.viewport.addEventListener('dragover',e=>{e.preventDefault();els.viewport.classList.add('dragover')});els.viewport.addEventListener('dragleave',()=>els.viewport.classList.remove('dragover'));
  els.viewport.addEventListener('drop',e=>{e.preventDefault();els.viewport.classList.remove('dragover');const type=e.dataTransfer.getData('text/component'),saved=e.dataTransfer.getData('text/arduino-board');if(!type||gesture)return;const p=canvasPoint(e);addComponent(type,p.x,p.y,saved)});
  els.viewport.addEventListener('wheel',e=>{e.preventDefault();if(!labelDragging&&!gesture)setZoom(zoom*Math.exp(-e.deltaY*.0015),e)},{passive:false});
  els.viewport.addEventListener('pointermove',e=>{if(!pendingPort||gesture)return;draftMouse=canvasPoint(e);renderDraftWire()});
  els.viewport.addEventListener('pointerdown',beginCanvasPan,true);
  els.viewport.addEventListener('contextmenu',e=>e.preventDefault());
  wireMenu.apply.addEventListener('click',applyWireMenu);wireMenu.menu.addEventListener('pointerdown',e=>e.stopPropagation());
  document.addEventListener('pointerdown',e=>{if(!wireMenu.menu.contains(e.target))hideWireMenu()});
  els.scene.addEventListener('pointerdown',e=>{if(e.button!==0||gesture||labelDragging)return;
    const component=e.target.closest('.component,[data-component-backdrop]');
    const touchedWire=e.target.closest('[data-wire]'),probeWire=touchedWire&&project.wires.find(w=>w.id===touchedWire.dataset.wire)?.probeLead;
    const probeBody=component&&byId[project.components.find(c=>c.id===component.dataset.id)?.typeId]?.probeColor;
    if(running&&!probeBody&&!probeWire&&e.target.closest('.port-group,[data-junction],[data-wire],[data-wire-end],[data-wire-segment]'))electricalTouch();
    const hcfaKey=e.target.closest('[data-hcfa-action]');if(hcfaKey){const c=project.components.find(c=>c.id===hcfaKey.closest('.component')?.dataset.id);if(c){e.preventDefault();e.stopPropagation();setSelection([c.id]);refreshSelection();window.DTSHCFAUI.command(c,hcfaKey.dataset.hcfaAction);}return;}
    const abbKey=e.target.closest('[data-acs800-action]');if(abbKey){const c=project.components.find(c=>c.id===abbKey.closest('.component')?.dataset.id);if(c){e.preventDefault();e.stopPropagation();setSelection([c.id]);refreshSelection();window.DTSACS800UI.command(c,abbKey.dataset.acs800Action);}return;}
    const driveKey=e.target.closest('[data-v20-action]');if(driveKey){const c=project.components.find(c=>c.id===component?.dataset.id);if(c){e.preventDefault();e.stopPropagation();setSelection([c.id]);refreshSelection();window.DTSV20UI.command(c,driveKey.dataset.v20Action);}return;}

    if(component&&(e.shiftKey||e.ctrlKey||e.metaKey)){
      e.preventDefault();e.stopPropagation();selectedWire=null;setSelection(Selection.clicked(selectedIds,component.dataset.id,true));refreshSelection();return;
    }
    const gang=e.target.closest('[data-installation-contact]');if(gang&&running){operateInstallation(gang,e);return}
    const control=e.target.closest('[data-meter-position],[data-meter-action],[data-instrument-key]');
    if(control){
      const owner=control.closest('.component'),c=project.components.find(c=>c.id===owner?.dataset.id);if(!c)return;
      e.preventDefault();e.stopPropagation();setSelection([c.id]);
      const k=control.dataset.instrumentKey,f=c.instrumentSettings?.functionKey||'off',param=k==='up'||k==='down'?'set':k==='function'?({manual:'mode',second:'secondSet',tune:'tune'}[f]):null;
      if(param&&!window.DTSInstrumentUI.editable(c,param)){toast('Bu ayar menüsü kilitli');updateProperties();return}
      if(!snapshot(true))return;
      if(control.dataset.meterPosition!==undefined){c.meterPosition=Number(control.dataset.meterPosition);c.meterHold=false}
      else if(control.dataset.meterAction)c[control.dataset.meterAction==='hold'?'meterHold':'meterBacklight']=!c[control.dataset.meterAction==='hold'?'meterHold':'meterBacklight'];
      else{
        c.instrumentSettings={...(c.instrumentSettings||{})};
        if(k==='up'||k==='down'){const low=Number(c.instrumentSettings.setLow??0),high=Math.max(low,Number(c.instrumentSettings.setHigh??600));c.instrumentSettings.set=Math.max(low,Math.min(high,Number(c.instrumentSettings.set??400)+(k==='up'?1:-1)))}
        if(k==='function'){
          if(f==='manual')c.instrumentSettings.mode=c.instrumentSettings.mode==='manual'?'auto':'manual';
          if(f==='second')c.instrumentSettings.secondSet=c.instrumentSettings.secondSet==='on'?'off':'on';
          if(f==='tune')c._autoTune={active:!c._autoTune?.active};
        }
        if(k==='set')els.props.scrollTop=0;
      }
      render(true);updateProperties();scheduleSave();return;
    }
    const fuse=e.target.closest('[data-fuse-slot]');if(fuse){const owner=fuse.closest('.component'),c=project.components.find(c=>c.id===owner?.dataset.id);if(c){setSelection([c.id]);if(!snapshot(true))return;c.fuseOpen={...(c.fuseOpen||{}),[fuse.dataset.fuseSlot]:!c.fuseOpen?.[fuse.dataset.fuseSlot]};render(true);updateProperties();scheduleSave()}e.preventDefault();return}
    const flame=e.target.closest('[data-flame-toggle]');if(flame){const owner=flame.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id);if(!c)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);if(!snapshot(true))return;c.flamePresent=!c.flamePresent;c.arduinoValue=c.flamePresent?900:80;render(true);updateProperties();scheduleSave();return}
    const dht=e.target.closest('[data-dht-control]');if(dht){const owner=dht.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);const mode=dht.dataset.dhtControl,old=mode==='temperature'?(c.arduinoValue??25):(c.arduinoHumidity??50);let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev),n=Math.max(0,Math.min(1,(76-p.y)/58));if(mode==='temperature')c.arduinoValue=-20+n*80;else c.arduinoHumidity=n*100;render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){if(mode==='temperature')c.arduinoValue=old;else c.arduinoHumidity=old;history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const potSlider=e.target.closest('[data-pot-slider]');if(potSlider){const owner=potSlider.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);const old=c.potentiometer??50;let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev);c.potentiometer=Math.max(0,Math.min(100,(72-p.y)/.54));render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.potentiometer=old;history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const soilProbe=e.target.closest('[data-soil-probe]');if(soilProbe){const owner=soilProbe.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);const old=Number(c.soilProbeDepth??0),oldValue=Number(c.arduinoValue??d.arduinoDefault??220),start=componentLocalPoint(c,d,e);let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev);c.soilProbeDepth=Math.max(0,Math.min(100,old+(p.y-start.y)/.58));const py=8+c.soilProbeDepth*.58,probeTip=py+80,wet=Math.max(0,Math.min(1,(probeTip-92)/40));c.arduinoValue=Math.round(220+wet*760);render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.soilProbeDepth=old;c.arduinoValue=oldValue;history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const ldrCover=e.target.closest('[data-ldr-cover]');if(ldrCover){const owner=ldrCover.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);const old=Number(c.ldrCover??0),oldValue=c.arduinoValue??d.arduinoDefault??520,start=componentLocalPoint(c,d,e);let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev);c.ldrCover=Math.max(0,Math.min(100,old+(p.x-start.x)/.48));c.arduinoValue=Math.round(900-c.ldrCover*7.8);render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.ldrCover=old;c.arduinoValue=oldValue;history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const piezoTap=e.target.closest('[data-piezo-tap]');
    if(piezoTap){
      const c=project.components.find(x=>x.id===piezoTap.closest('.component')?.dataset.id);
      e.preventDefault();e.stopPropagation();
      if(!c||c.typeId!=='tutorial-piezo'||c.mq07PiezoTapUi!==true||project.tutorialLesson?.id!=='sensor-analog-apps-src-08')return;
      if(!running){toast('Sanal piezo darbesi için önce SİMÜLE ET seçin.');return}
      // A transient runtime event on the locked lesson, not an edit/snapshot.
      c.piezoTapAt=performance.now();c.piezoTapMv=100;
      render(true);setStatus('Sanal piezo darbesi: UT33D+ DCV 200 mV göstergesini izleyin.');
      return;
    }
    const reedMagnet=e.target.closest('[data-reed-magnet]');if(reedMagnet){const owner=reedMagnet.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);const old=Number(c.reedMagnet??0),oldState=!!c.state,start=componentLocalPoint(c,d,e);let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev);c.reedMagnet=Math.max(0,Math.min(100,old+(p.x-start.x)/.42));c.state=c.reedMagnet>=65;render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.reedMagnet=old;c.state=oldState;history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const encoderJog=e.target.closest('[data-encoder-jog]');if(encoderJog){const owner=encoderJog.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d?.incrementalEncoder38mm)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);if(window.DTSIncrementalEncoder.motorCoupling(project,byId,c)){toast('Enkoder motor miline bağlı · hız motor tarafından belirleniyor.');return}if(!snapshot(true))return;const dir=Number(encoderJog.dataset.encoderJog)||1,start=performance.now();let timer=null,closed=false;const step=()=>{if(closed)return;window.DTSIncrementalEncoder.manualAdjust(c,d,dir,performance.now()-start,performance.now());c.encoderManualRPM=c.encoderRPM;render(true);updateProperties();timer=setTimeout(step,110)};const release=ev=>{if(ev.pointerId!==undefined&&ev.pointerId!==e.pointerId)return;closed=true;clearTimeout(timer);window.removeEventListener('pointerup',release,true);window.removeEventListener('pointercancel',release,true);render(true);updateProperties();scheduleSave()};step();window.addEventListener('pointerup',release,true);window.addEventListener('pointercancel',release,true);return}
    const industrialEncoder=e.target.closest('[data-industrial-encoder-shaft]');if(industrialEncoder){const owner=industrialEncoder.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d?.incrementalEncoder38mm)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);if(window.DTSIncrementalEncoder.motorCoupling(project,byId,c)){toast('Enkoder motor miline bağlı · manuel mil çevirmeden önce SHAFT bağlantısını ayırın.');return}const oldAngle=Number(c.encoderMechanicalAngle||0),oldRpm=Number(c.encoderRPM||0),oldAuto=c.encoderAuto!==false,start=componentLocalPoint(c,d,e),cx=92,cy=31,startPointer=Math.atan2(start.y-cy,start.x-cx)*180/Math.PI;let last=startPointer,moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev),a=Math.atan2(p.y-cy,p.x-cx)*180/Math.PI;let delta=a-last;if(delta>180)delta-=360;if(delta<-180)delta+=360;last=a;c.encoderRPM=0;c.encoderAuto=false;window.DTSIncrementalEncoder.addAngle(c,d,delta,performance.now());render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.encoderMechanicalAngle=oldAngle;c.encoderRPM=oldRpm;c.encoderAuto=oldAuto;window.DTSIncrementalEncoder.state(c,d,performance.now(),false);history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const encoder=e.target.closest('[data-encoder-knob]');if(encoder){const owner=encoder.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);const oldAngle=Number(c.encoderAngle??0),oldPos=Number(c.encoderPosition??0),oldCLK=c._encoderCLK,oldDT=c._encoderDT;let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev),ang=(Math.atan2(p.y-47,p.x-58)*180/Math.PI+90+360)%360,pos=Math.round(ang/15)%24,seq=[[0,0],[0,1],[1,1],[1,0]],phase=seq[((pos%4)+4)%4];c.encoderAngle=ang;c.encoderPosition=pos;c._encoderCLK=phase[0];c._encoderDT=phase[1];render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.encoderAngle=oldAngle;c.encoderPosition=oldPos;c._encoderCLK=oldCLK;c._encoderDT=oldDT;history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const joystick=e.target.closest('[data-joystick-handle]');if(joystick){const owner=joystick.closest('.component'),c=project.components.find(x=>x.id===owner?.dataset.id),d=c&&byId[c.typeId];if(!c||!d)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);const ox=Number(c.arduinoX??512),oy=Number(c.arduinoY??512);let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const p=componentLocalPoint(c,d,ev),dx=Math.max(-16,Math.min(16,p.x-77)),dy=Math.max(-16,Math.min(16,p.y-53));c.arduinoX=Math.round(512+dx/16*511);c.arduinoY=Math.round(512-dy/16*511);render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.arduinoX=ox;c.arduinoY=oy;history.pop()}render(true);updateProperties();scheduleSave()}});return}
    const sensorHandle=e.target.closest('[data-temperature-handle],[data-load-handle]');if(sensorHandle){
      const temperature=sensorHandle.hasAttribute?sensorHandle.hasAttribute('data-temperature-handle'):sensorHandle.getAttribute('data-temperature-handle')!==null;
      const c=project.components.find(c=>c.id===(temperature?sensorHandle.dataset.temperatureHandle:sensorHandle.dataset.loadHandle));if(!c)return;e.preventDefault();e.stopPropagation();setSelection([c.id]);
      const key=temperature?'temperature':'loadWeight',old=c[key]??(temperature?25:0),start=worldPoint(e),capacity=c.loadCapacity||byId[c.typeId]?.loadCapacity||1000,scale=c.materialScale||1;let timer=null,moved=false;
      if(!snapshot(true))return;const paint=()=>{render(true);updateProperties()};
      if(!temperature){c[key]=Math.min(capacity,old+capacity/100);paint();const repeat=()=>{c[key]=Math.min(capacity,(c[key]||0)+capacity/100);paint();timer=setTimeout(repeat,200)};timer=setTimeout(repeat,400)}
      trackGesture(e,{move:ev=>{const q=worldPoint(ev),dy=(q.y-start.y)/scale;if(Math.abs(dy)<1&&!moved)return;moved=true;clearTimeout(timer);c[key]=temperature?Math.max(window.DTSThermal.range(byId[c.typeId],c)[0],Math.min(window.DTSThermal.range(byId[c.typeId],c)[1],old-dy*(window.DTSThermal.range(byId[c.typeId],c)[1]-window.DTSThermal.range(byId[c.typeId],c)[0])/100)):Math.max(0,Math.min(capacity,old+dy*capacity/100));paint()},finish:cancel=>{clearTimeout(timer);if(cancel){c[key]=old;history.pop()}paint();scheduleSave()}});return;
    }
    const pot=e.target.closest('[data-pot-knob]');if(pot){const owner=pot.closest('.component'),c=project.components.find(c=>c.id===owner?.dataset.id);if(!c)return;const d=byId[c.typeId],old=c.potentiometer??50,start=worldPoint(e);let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const q=worldPoint(ev),r=(c.rotation||0)*Math.PI/180,delta=((q.x-start.x)*Math.cos(r)+(q.y-start.y)*Math.sin(r)-(q.y-start.y)*Math.cos(r)+(q.x-start.x)*Math.sin(r))/(c.materialScale||1);c.potentiometer=Math.max(0,Math.min(100,old+delta));render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.potentiometer=old;history.pop()}render(true);scheduleSave()}});return}
    const analogHandle=e.target.closest('[data-analog-handle]');if(analogHandle){const c=project.components.find(c=>c.id===analogHandle.dataset.analogHandle);if(!c)return;const old=c.analogPosition,start=worldPoint(e);let moved=false;trackGesture(e,{move:ev=>{if(!moved){if(!snapshot(true))return;moved=true}const q=worldPoint(ev),r=(analogHandle.closest('.component-geometry')?c.rotation||0:0)*Math.PI/180,dx=(q.x-start.x)*Math.cos(r)+(q.y-start.y)*Math.sin(r),dy=-(q.x-start.x)*Math.sin(r)+(q.y-start.y)*Math.cos(r),delta=c.typeId==='sensor-level-analog'?-dy/(appearance==='material'?244/276*1.4:.8):dx/(c.typeId==='sensor-ultrasonic-analog'?1.5:.7);c.analogPosition=Math.max(0,Math.min(100,(old??50)+delta/(c.materialScale||1)));render(true);updateProperties()},finish:cancel=>{if(cancel&&moved){c.analogPosition=old;history.pop()}render(true);scheduleSave()}});return}
    const sensorTarget=e.target.closest('[data-sensor-target]');if(sensorTarget){const c=project.components.find(c=>c.id===sensorTarget.dataset.sensorTarget);if(c)beginSensorDrag(c,e);return}
    const label=e.target.closest('[data-label-key]');if(label){beginLabelDrag(label,e);return}
    const endHandle=e.target.closest('[data-wire-end]');if(endHandle){e.stopPropagation();const w=project.wires.find(x=>x.id===endHandle.closest('[data-editor-wire]').dataset.editorWire);if(w)beginReconnect(w,endHandle.dataset.wireEnd,e);return}
    const segmentHandle=e.target.closest('[data-wire-segment]');if(segmentHandle){e.stopPropagation();const w=project.wires.find(x=>x.id===segmentHandle.closest('[data-editor-wire]').dataset.editorWire);if(w)beginWireSegmentDrag(w,Number(segmentHandle.dataset.wireSegment),e);return}
    if(component){const probe=project.components.find(c=>c.id===component.dataset.id);if(byId[probe?.typeId]?.probeColor&&(!e.target.closest('.port-group')||running)){beginProbeDrag(probe,e);return}}
    const pg=e.target.closest('.port-group');if(pg){e.stopPropagation();connectPort({c:pg.closest('.component').dataset.id,p:pg.dataset.port});return}
    const jg=e.target.closest('[data-junction]');if(jg){e.stopPropagation();if(pendingPort)finishConnection({j:jg.dataset.junction});else toast('Bu nokta ortak elektriksel bağlantıdır');return}
    const wg=e.target.closest('[data-wire]');if(wg){
      e.stopPropagation();const w=project.wires.find(x=>x.id===wg.dataset.wire);if(!w)return;
      if(running&&!w.probeLead){electricalTouch();return}
      if(w.probeLead){if(pendingPort){toast('Ölçüm için probun ucunu hatta değdirin.');return}selectedWire=w.id;wireColor=w.color;setSelection([]);refreshSelection();beginProbeLeadDrag(w,e);return}
      if(pendingPort)branchToWire(w,canvasPoint(e));else{selectedWire=w.id;wireColor=w.color;setSelection([]);const hit=nearestOnRoute(editableRoute(w),canvasPoint(e));refreshSelection();if(hit){setStatus('Kablo parçasını tutup sürükle · Dikey parça sağ/sol, yatay parça yukarı/aşağı taşınır');beginWireSegmentDrag(w,hit.segment,e)}}return;
    }
    if(!component)return;e.stopPropagation();
    selectedWire=null;setSelection(Selection.clicked(selectedIds,component.dataset.id));refreshSelection();
    const c=project.components.find(x=>x.id===component.dataset.id),d=byId[c.typeId];
    if(running&&!e.altKey&&Sensors.supported(d)&&Sensors.detect(c,d).enabled){e.preventDefault();toast('Algılama için hedef malzemeyi sürükleyin. Cihazı taşımak için Alt+sürükleyin.');return}
    if(running&&!e.altKey&&d.independentContacts){e.preventDefault();toast('Kumanda etmek için ilgili tuşa veya kontak çizgisine basın. Cihazı taşımak için Alt+sürükleyin.');return}
    if(running&&!e.altKey&&d.interactive){
      e.preventDefault();sound.unlock();
      if(heldPointers.has(e.pointerId))actuations.release(heldPointers.get(e.pointerId));
      heldPointers.set(e.pointerId,actuations.press(c.id,d.controlMode==='momentary'));
      setStatus(`${d.name} basılıyor`);return;
    }
    beginComponentDrag(c,e);
  });

  els.scene.addEventListener('keydown',e=>{
    const gang=e.target.closest('[data-installation-contact]');if(gang&&running&&['Enter',' '].includes(e.key)){if(!e.repeat)operateInstallation(gang,e);e.preventDefault();return}
    const hcfaKey=e.target.closest('[data-hcfa-action]');if(hcfaKey&&['Enter',' '].includes(e.key)){const c=project.components.find(c=>c.id===hcfaKey.closest('.component')?.dataset.id);if(c){e.preventDefault();e.stopPropagation();setSelection([c.id]);refreshSelection();window.DTSHCFAUI.command(c,hcfaKey.dataset.hcfaAction);}return;}
    const abbKey=e.target.closest('[data-acs800-action]');if(abbKey&&['Enter',' '].includes(e.key)){const c=project.components.find(c=>c.id===abbKey.closest('.component')?.dataset.id);if(c){e.preventDefault();e.stopPropagation();setSelection([c.id]);refreshSelection();window.DTSACS800UI.command(c,abbKey.dataset.acs800Action);}return;}
    const driveKey=e.target.closest('[data-v20-action]');if(driveKey&&['Enter',' '].includes(e.key)){const c=project.components.find(c=>c.id===driveKey.closest('.component')?.dataset.id);e.preventDefault();e.stopPropagation();if(c)window.DTSV20UI.command(c,driveKey.dataset.v20Action);return;}

    const handle=e.target.closest('[data-temperature-handle],[data-load-handle]');if(handle&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End',' ','Enter'].includes(e.key)){e.preventDefault();e.stopPropagation();const isTemp=handle.getAttribute('data-temperature-handle')!==null,c=project.components.find(c=>c.id===(isTemp?handle.dataset.temperatureHandle:handle.dataset.loadHandle));if(!c)return;const key=isTemp?'temperature':'loadWeight',min=isTemp?window.DTSThermal.range(byId[c.typeId],c)[0]:0,max=isTemp?window.DTSThermal.range(byId[c.typeId],c)[1]:c.loadCapacity||byId[c.typeId]?.loadCapacity||1000,old=c[key]??(isTemp?25:0);if(!snapshot(true))return;c[key]=e.key==='Home'?min:e.key==='End'?max:Math.max(min,Math.min(max,old+(isTemp?1:max/100)*(e.shiftKey?10:1)*(['ArrowDown','ArrowLeft'].includes(e.key)?-1:1)));setSelection([c.id]);render(true);updateProperties();els.scene.querySelector('[data-'+(isTemp?'temperature':'load')+'-handle="'+c.id+'"]').focus();scheduleSave();return}

    const node=e.target.closest('[data-label-key]'),delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!node||!delta||labelDragging)return;
    e.preventDefault();e.stopPropagation();const c=project.components.find(c=>c.id===labelOwnerId(node));if(!c)return;
    const key=node.dataset.labelKey,base={x:Number(node.dataset.baseX),y:Number(node.dataset.baseY)},drag=Labels.begin(c,key,base,{x:0,y:0},1);
    if(window.DTSProjects.isProtected(project)){window.DTSStudio?.protectedNotice();return}if(!e.repeat)if(!snapshot())return;Labels.move(c,drag,{x:delta[0]*(e.shiftKey?10:1),y:delta[1]*(e.shiftKey?10:1)});positionLabelNode(c,key);scheduleSave();
  });
  function releasePointer(e){if(e.type==='pointerup'&&e.button!==0)return;const job=heldPointers.get(e.pointerId);if(job){actuations.release(job);heldPointers.delete(e.pointerId)}}
  function releaseAllPointers(){for(const job of heldPointers.values())actuations.release(job);heldPointers.clear()}
  window.addEventListener('pointerup',releasePointer);window.addEventListener('pointercancel',releasePointer);window.addEventListener('blur',releaseAllPointers);
  function cancelPressedControls(){
    actuations.cancelAll();heldPointers.clear();
    project.components.forEach(c=>{c._pressed=false;if(byId[c.typeId]?.controlMode==='momentary'){c.state=false;if(byId[c.typeId]?.independentContacts)c.switchStates={}}});
  }
  document.addEventListener('visibilitychange',()=>{sound.setHidden(document.hidden);if(document.hidden)cancelPressedControls();if(running)render(true)});
  window.addEventListener('pagehide',()=>{sound.setHidden(true);cancelPressedControls();if(running)render(true)});
  window.addEventListener('pageshow',()=>{if(running)render(true);sound.setHidden(document.hidden)});
  els.viewport.addEventListener('pointerdown',e=>{
    if(e.button!==0||gesture||labelDragging||e.target.closest('.component,[data-wire],[data-junction],.wire-editors,[data-sensor-target]'))return;
    if(pendingPort){
      const p=canvasPoint(e),last=draftPoints[draftPoints.length-1];if(!last||last.x!==p.x||last.y!==p.y)draftPoints.push(p);
      draftMouse=p;setStatus(draftPoints.length+' güzergâh noktası eklendi · hedef terminali seçin','warn');render();return;
    }
    beginMarquee(e);
  });

  document.addEventListener('keydown',e=>{
    if(window.DTSStudio?.isHome||window.DTSStudio?.safety?.visible||project.workspaceMode==='panel'||Selection.isEditing(document.activeElement)||!$('#modal').hidden||gesture||labelDragging)return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){e.preventDefault();selectAll();return}
    if((e.key==='Delete'||e.key==='Backspace')&&pendingPort&&draftPoints.length){e.preventDefault();draftPoints.pop();render();return}
    if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();removeSelected()}
    if(e.key==='Escape'){resetDraft();hideWireMenu();setSelection([]);selectedWire=null;refreshSelection();els.scene.querySelector('.draft-wire-group')?.remove()}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo()}
  });
  function undo(){if(!guardEdit())return;if(gesture||labelDragging||!history.length)return;const keepRunning=running;future.push(JSON.stringify(window.DTSProjects.clean(project)));project=migrateProject(JSON.parse(history.pop()));window.DTSStudio?.markDirty?.();resetDraft();selectedWire=null;hideWireMenu();setSelection([]);running=keepRunning;modeUI();populateWireMenu();renderLibrary();render()}
  function redo(){if(!guardEdit())return;if(gesture||labelDragging||!future.length)return;const keepRunning=running;history.push(JSON.stringify(window.DTSProjects.clean(project)));project=migrateProject(JSON.parse(future.pop()));window.DTSStudio?.markDirty?.();resetDraft();selectedWire=null;hideWireMenu();setSelection([]);running=keepRunning;modeUI();populateWireMenu();renderLibrary();render()}
  $('#undoBtn').onclick=undo;$('#redoBtn').onclick=redo;els.simulate.onclick=simulate;
  $('#selectAllBtn').onclick=selectAll;$('#deleteSelectionBtn').onclick=removeSelected;$('#clearSelectionBtn').onclick=()=>{setSelection([]);refreshSelection()};
  $('#deleteBtn').onclick=removeSelected;$('#rotateBtn').onclick=()=>{if(!guardEdit())return;const c=project.components.find(x=>x.id===selected);if(c){if(!snapshot())return;c.rotation=((c.rotation||0)+90)%360;projectChanged()}};
  $('#duplicateBtn').onclick=()=>{if(!guardEdit())return;const c=project.components.find(x=>x.id===selected);if(c){if(!snapshot())return;const n={...clone(c),id:uid('c'),x:c.x+30,y:c.y+30,ref:c.ref+'A'};delete n._timing;if(n.auxFor){delete n.auxFor;delete n.auxLayout;delete n.physicalLabels;delete n.companionView;delete n.schematicPosition}project.components.push(n);window.DTSAssemblies.add(project,n,byId[n.typeId],byId,uid);setSelection([n.id]);projectChanged()}};
  ['propLabel','propRef','propAddress'].forEach(id=>$('#'+id).addEventListener('change',e=>{if(id==='propRef'&&!guardEdit()){updateProperties();return}const c=project.components.find(x=>x.id===selected);if(!c)return;if(!snapshot())return;c[{propLabel:'label',propRef:'ref',propAddress:'address',propNote:'note'}[id]]=e.target.value;projectChanged()}));
  let noteEditId=null;
  function editNote(){
    if(window.DTSProjects.isProtected(project)){window.DTSStudio?.protectedNotice();updateProperties();return}
    const c=project.components.find(c=>c.id===selected);if(!c||c.note===$('#propNote').value)return;
    if(noteEditId!==c.id){if(!snapshot())return;noteEditId=c.id}
    c.note=$('#propNote').value;renderNotes();scheduleSave();
  }
  $('#propNote').addEventListener('input',editNote);
  $('#propNote').addEventListener('change',()=>{editNote();noteEditId=null});
  $('#propNote').addEventListener('blur',()=>{noteEditId=null});
  $('#propDirection').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected);if(!c)return;if(!snapshot())return;c.direction=e.target.value==='ccw'?'ccw':'cw';projectChanged()});
  for(const [id,key,numeric] of [['propFlashOn','flashOn',true],['propFlashOff','flashOff',true],['propSensorOutput','sensorOutput'],['propAnalogMode','analogMode'],['propAnalogPosition','analogPosition',true],['propTemperature','temperature',true],['propTimerMode','timerMode'],['propDelayValue','delayValue',true],['propDelayUnit','delayUnit']])$('#'+id).addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;if(!snapshot())return;c[key]=numeric?Number(e.target.value):e.target.value;delete c._timing;render(true);updateProperties();scheduleSave()});
  $('#propDeviceColor').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected);if(!c||!/^#[0-9a-f]{6}$/i.test(e.target.value))return;if(!snapshot())return;c.deviceColor=e.target.value;projectChanged()});
  for(const [id,key] of [['propLoadCapacity','loadCapacity'],['propLoadWeight','loadWeight'],['propExcitation','dcVoltage']])$('#'+id).addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;const n=Number(e.target.value);if(!Number.isFinite(n))return;if(!snapshot())return;c[key]=key==='dcVoltage'?Math.max(5,Math.min(15,n)):key==='loadCapacity'?([100,200,500,1000,2000,5000].includes(n)?n:1000):Math.max(0,Math.min(c.loadCapacity||1000,n));if(key==='loadCapacity')c.loadWeight=Math.min(c.loadWeight||0,c.loadCapacity);render(true);updateProperties();scheduleSave()});
  $('#propArduinoSupplyVoltage').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;const n=Number(e.target.value);if(!Number.isFinite(n)||!snapshot())return;c.dcVoltage=Math.max(0,Math.min(30,n));render(true);updateProperties();scheduleSave()});
  $('#propArduinoSupplyCurrent').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;const n=Number(e.target.value);if(!Number.isFinite(n)||!snapshot())return;c.currentLimit=Math.max(0,Math.min(5,n));render(true);updateProperties();scheduleSave()});
  $('#resetLoad').addEventListener('click',()=>{const c=project.components.find(c=>c.id===selected);if(!c||c.typeId!=='load-cell')return;if(!snapshot())return;c.loadWeight=0;render(true);updateProperties();scheduleSave()});
  $('#propCtRatio').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;const [p,s]=e.target.value.split('/').map(Number);if(!(p>0&&s>0))return;if(!snapshot())return;c.ctPrimary=p;c.ctSecondary=s;render(true);scheduleSave()});
  $('#propResistance').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;if(!snapshot())return;c.resistance=Math.max(.01,Math.min(10000000,Number(e.target.value)||1000));render(true);scheduleSave()});$('#propCapacitance').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;if(!snapshot())return;c.capacitance=Math.max(1e-9,Math.min(1,Number(e.target.value)||100)*1e-6);delete c._capacitorVoltage;delete c._reactiveNow;render(true);updateProperties();scheduleSave()});$('#propInductance').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;if(!snapshot())return;c.inductance=Math.max(1e-6,Math.min(100,Number(e.target.value)||150)*1e-3);delete c._inductorCurrent;delete c._reactiveNow;render(true);updateProperties();scheduleSave()});
  $('#nhLid').addEventListener('click',()=>{const c=project.components.find(c=>c.id===selected);if(!c||c.typeId!=='nh-fuse-holder')return;if(!snapshot())return;c.state=!c.state;render(true);updateProperties();scheduleSave()});
  for(let i=0;i<3;i++)$('#nhFuse'+i).addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c||!c.state){updateProperties();return}if(!snapshot())return;c.nhFuses={...(c.nhFuses||{}),[i]:!!e.target.checked};render(true);updateProperties();scheduleSave()});
  for(const p of ['L1','L2','L3'])$('#phaseVoltage'+p).addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;if(!snapshot())return;c.phaseVoltages={...(c.phaseVoltages||{}),[p]:Math.max(0,Math.min(400,Number(e.target.value)||0))};c.phaseEnabled={...(c.phaseEnabled||{}),[p]:c.phaseVoltages[p]>0};render(true);scheduleSave()});
  function changeVariant(c,id){
    const d=byId[id];if(!d||!guardEdit())return;
    if(project.wires.some(w=>[w.from,w.to].some(r=>r.c===c.id&&!d.pins.some(p=>p.id===r.p)))){toast('Kaldırılacak terminallerde bağlı kablo var. Önce kabloları ayırın.');updateProperties();return}
    if(!snapshot())return;c.typeId=id;c.label=d.name;delete c.contactModes;projectChanged();
  }
  for(const [id,kind] of [['propPtWires','pt'],['propPoleCount','pole'],['propFuseCount','fuse'],['propMaterialScale','scale'],['propPotMax','pot']])$('#'+id).addEventListener('change',e=>{
    const c=project.components.find(c=>c.id===selected);if(!c)return;const d=byId[c.typeId],n=Number(e.target.value);if(!Number.isFinite(n)){updateProperties();return}
    if(kind==='pt'){const k=Math.max(2,Math.min(4,Math.round(n)));changeVariant(c,k===3?'sensor-pt100':'sensor-pt100-'+k+'wire')}
    else if(kind==='pole')changeVariant(c,'door-isolator-'+Math.max(1,Math.min(8,Math.round(n)))+'p');
    else if(kind==='fuse'){const k=Math.max(1,Math.min(6,Math.round(n)));changeVariant(c,d.fuseBase+(k===1?'':'-'+k))}
    else {if(!guardEdit())return;if(!snapshot())return;if(kind==='scale')c.materialScale=Math.max(.25,Math.min(3,n/100));else c.potMax=Math.max(1,Math.min(10000000,n));projectChanged()}
  });
  $('#propSelectorSteps').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c||!guardEdit())return;const n=Math.max(1,Math.min(12,Math.round(Number(e.target.value)||1))),d=byId['selector-'+n];if(project.wires.some(w=>[w.from,w.to].some(r=>r.c===c.id&&!d.pins.some(p=>p.id===r.p)))){toast('Kaldırılacak kademelerde bağlı kablo var. Önce bu kabloları ayırın.');updateProperties();return}if(!snapshot())return;c.typeId=d.id;c.label=d.name;c.position=Math.min(c.position||0,n);c.state=c.position>0;delete c.contactModes;projectChanged()});
  $('#propMotorConnection').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected);if(!c||!guardEdit())return;if(!snapshot())return;c.motorConnection=['star','delta'].includes(e.target.value)?e.target.value:'external';projectChanged()});
  $('#propDoldStartMode').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected),d=c&&byId[c.typeId];if(!c||!d?.doldSafety||!guardEdit())return;if(!snapshot())return;c.doldStartMode=e.target.value==='auto'?'auto':'manual';delete c._doldMemory;projectChanged()});
  $('#propDoldOffDelay').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected),d=c&&byId[c.typeId];if(!c||!d?.doldOffDelayPair||!guardEdit())return;const n=Math.max(.1,Math.min(600,Number(e.target.value)||1));if(!snapshot())return;c.doldOffDelaySeconds=n;delete c._doldMemory;projectChanged()});
  $('#propDoldCrossShort').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected),d=c&&byId[c.typeId];if(!c||!d?.doldSafety||!guardEdit())return;if(!snapshot())return;c.doldCrossShort=!!e.target.checked;delete c._doldMemory;projectChanged()});
  $('#propWindingConnection').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected);if(!c||!guardEdit())return;if(!snapshot())return;c.windingConnection=['forward','reverse'].includes(e.target.value)?e.target.value:'external';projectChanged()});
  $('#propPacketPosition').addEventListener('change',e=>{const c=project.components.find(x=>x.id===selected),d=c&&byId[c.typeId];if(!d?.positions)return;if(!snapshot())return;c.position=Math.max(0,Math.min(d.positions.length-1,Number(e.target.value)||0));c.state=c.position>0;projectChanged()});
  $('#acs800Parameters').onclick=()=>{const c=project.components.find(c=>c.id===selected);if(c)window.DTSACS800UI.show(c);};
  $('#hcfaParameters').onclick=()=>{const c=project.components.find(c=>c.id===selected);if(c)window.DTSHCFAUI.show(c);};
  function hcfaQuickChange(key,value){
    const c=project.components.find(c=>c.id===selected),d=c&&byId[c.typeId];if(!c||d?.id!=='hcfa-sv-x2ea040a-a'||!guardEdit())return;
    if(!snapshot())return;const r=window.DTSHCFA.set(c,key,value);if(!r.ok){history.pop();toast(r.error||'HCFA parametresi değiştirilemedi');updateProperties();return}
    projectChanged();updateProperties();
  }
  $('#hcfaQuickMode').addEventListener('change',e=>hcfaQuickChange('P00.01',e.target.value));
  $('#hcfaQuickPositionSource').addEventListener('change',e=>hcfaQuickChange('P00.05',e.target.value));
  $('#hcfaQuickSpeed').addEventListener('change',e=>hcfaQuickChange('P03.03',e.target.value));
  $('#hcfaQuickTorque').addEventListener('change',e=>hcfaQuickChange('P03.25',e.target.value));
  $('#hcfaQuickPosition').addEventListener('change',e=>hcfaQuickChange('P08.06',e.target.value));
  $('#hcfaQuickAxis').addEventListener('change',e=>hcfaQuickChange('P09.00',e.target.value));
  $('#v20Parameters').onclick=()=>{const c=project.components.find(c=>c.id===selected);if(c)window.DTSV20UI.show(c);};
  $('#propPotentiometer').addEventListener('change',e=>{const c=project.components.find(c=>c.id===selected);if(!c)return;if(!snapshot())return;c.potentiometer=Math.max(0,Math.min(100,Number(e.target.value)||0));projectChanged();});
  $('#propSensorTarget').innerHTML=Sensors.materials.map(([value,label])=>`<option value="${value}">${esc(label)}</option>`).join('');
  $('#propSensorTarget').onchange=e=>changeSensor(s=>{s.target=e.target.value;if(s.target==='none')s.auto=false});
  $('#propSensorRange').onchange=e=>changeSensor(s=>{s.range=Math.max(.1,Math.min(400,Number(e.target.value)||.1))});
  $('#propSensorFace').onchange=e=>changeSensor(s=>{s.face=e.target.value});
  $('#propSensorAuto').onchange=e=>changeSensor(s=>{s.auto=e.target.checked;s.offset=0});
  let sensorSliderBefore=null;
  $('#propSensorDistance').oninput=e=>{
    const c=project.components.find(c=>c.id===selected),d=c&&byId[c.typeId];if(!d||!Sensors.supported(d))return;
    if(sensorSliderBefore!==c.id){if(!snapshot())return;sensorSliderBefore=c.id}
    c.sensing={...Sensors.settings(c,d),auto:false,distance:Number(e.target.value),offset:0};render(true);$('#propSensorAuto').checked=false;
  };
  $('#propSensorDistance').onchange=()=>{sensorSliderBefore=null;scheduleSave()};
  $('#propShowNote').addEventListener('change',e=>{editNote();const c=project.components.find(x=>x.id===selected);if(!c)return;noteEditId=null;if(!snapshot())return;c.showNote=e.target.checked;renderNotes();scheduleSave()});
  $('#resetLabelsBtn').onclick=()=>{const c=project.components.find(x=>x.id===selected);if(!c||!Object.keys(c.labelPositions||{}).length)return;if(!snapshot())return;Labels.reset(c);refreshArtwork();scheduleSave();toast('Etiketler varsayılan konumlarına döndü')};
  $('#propContactType').addEventListener('change',e=>{
    if(!guardEdit()){updateProperties();return}
    const c=project.components.find(x=>x.id===selected);if(!c)return;
    if(!snapshot())return;if(!Components.setContactMode(project,c,e.target.value,byId)){history.pop();return}
    resetDraft();projectChanged();toast('Kontak tipi değişti; kablo bağlantıları korundu');
  });
  $('#contactGroups').addEventListener('change',e=>{
    if(!guardEdit()){updateProperties();return}
    const groupId=e.target.dataset.contactGroup,c=project.components.find(x=>x.id===selected);if(!groupId||!c)return;
    if(!snapshot())return;if(!Components.setContactMode(project,c,e.target.value,byId,groupId)){history.pop();return}
    projectChanged();
  });
  $('#symbolMode').addEventListener('change',e=>{
    appearance=['iec','material'].includes(e.target.value)?e.target.value:'iec';localStorage.setItem('ccs-appearance',appearance);renderLibrary();
    // A style change only replaces component artwork. It does not solve the
    // circuit, change state, rebuild wires, move pins, or alter zoom/pan.
    refreshArtwork();materialLayoutWarning();
  });
  $('#symbolNorm').addEventListener('change',e=>{
    const norm=Norms.normalize(e.target.value);if(project.symbolNorm!==norm){if(!snapshot())return;project.symbolNorm=norm}
    localStorage.setItem('ccs-norm',norm);appearance='iec';localStorage.setItem('ccs-appearance',appearance);renderLibrary();refreshArtwork();scheduleSave();setStatus(norm+' sembolleri seçildi · Terminal ve kablolar korundu');
  });
  $('#newBtn').onclick=()=>modal('Yeni proje','<p>Geçerli çalışma alanı temizlenecek. Kaydetmediğiniz değişiklikleri önce dışa aktarabilirsiniz.</p>',()=>{if(!snapshot())return;const mode=project.workspaceMode||'control';window.DTSEditor.create(mode,mode==='control'?'Kumanda Devresi 1':undefined);toast('Yeni proje açıldı')});
  $('#saveBtn').onclick=()=>{localStorage.setItem('ods-project',JSON.stringify(project));toast('Proje bu tarayıcıya kaydedildi')};$('#exportBtn').onclick=download;$('#openBtn').onclick=()=>$('#fileInput').click();
  $('#fileInput').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const p=window.DTSProjects.parse(rd.result);if(!snapshot())return;project=migrateProject(p);resetDraft();selectedWire=null;hideWireMenu();setSelection([]);running=false;$('#sheetName').textContent=project.name;populateWireMenu();renderLibrary();render();const scaleAudit=materialLayoutWarning();if(!scaleAudit?.overlapCount)toast('Proje açıldı')}catch{toast('Geçersiz proje dosyası')}};rd.readAsText(f);e.target.value=''};
  $('#renameSheet').onclick=()=>{if(!guardEdit())return;modal('Sayfayı yeniden adlandır',`<label>Sayfa adı<input id="modalName" value="${esc(project.name)}" style="width:100%;margin-top:7px;padding:8px"></label>`,()=>{project.name=$('#modalName')?.value||project.name;$('#sheetName').textContent=project.name;render()})};
  $('#collapseLibrary').onclick=()=>document.body.classList.toggle('library-collapsed');
  $('#closeProperties').onclick=()=>applyPropertiesVisibility(false);
  propertiesReopen.onclick=()=>applyPropertiesVisibility(true);
  window.addEventListener('resize',()=>applyPropertiesVisibility());
  function setZoom(z,anchor=null){
    if(project.workspaceMode==='panel'){window.DTSPanelEditor?.zoomTo(z);return}
    if(gesture||labelDragging)return;
    const r=els.viewport.getBoundingClientRect();
    camera=Viewport.zoomAt(camera,z,{x:anchor?anchor.clientX-r.left:els.viewport.clientWidth/2,y:anchor?anchor.clientY-r.top:els.viewport.clientHeight/2});
    applyCamera();
  }
  $('#zoomIn').onclick=()=>project.workspaceMode==='panel'?window.DTSPanelEditor.zoomBy(1.2):setZoom(zoom+.1);$('#zoomOut').onclick=()=>project.workspaceMode==='panel'?window.DTSPanelEditor.zoomBy(1/1.2):setZoom(zoom-.1);
  $('#fitBtn').onclick=()=>{
    if(project.workspaceMode==='panel'){window.DTSPanelEditor?.fit();return}
    if(gesture||labelDragging)return;
    const width=els.viewport.clientWidth,height=els.viewport.clientHeight,z=Math.min(1,(width-32)/SHEET_W,(height-32)/SHEET_H);
    camera={x:(width-SHEET_W*z)/2,y:(height-SHEET_H*z)/2,zoom:z};applyCamera();
  };

  $('#colorPalette').addEventListener('click',e=>{const b=e.target.closest('[data-color]');if(!b)return;wireColor=b.dataset.color;selectedWire=null;refreshSelection();updateWireStatus();renderDraftWire()});
  $('#wireRole').addEventListener('change',e=>{if(!guardEdit())return;if(!snapshot())return;Lines.configureColor(project,byId,wireColor,e.target.value);selectedWire=null;populateWireMenu();render()});
  $('#wireVoltage').addEventListener('change',e=>{if(!guardEdit())return;if(!snapshot())return;Lines.setVoltage(project,wireColor,e.target.value);render()});
  $('#wireSize').onchange=e=>{if(!snapshot())return;const w=project.wires.find(w=>w.id===selectedWire);if(w?.probeLead){Lines.recolor(project,byId,w.id,w.color,e.target.value);renderMeasurements();updateWireStatus();return}Lines.setSize(project,wireColor,e.target.value);render();setStatus((colorNames[wireColor]||wireColor)+' kabloların kesiti: '+project.colorSizes[wireColor])};
  wireMenu.color.onchange=e=>{wireMenu.size.value=Lines.sizeLabel(project.colorSizes?.[e.target.value]||1.5)};
  $('#propertyForm').addEventListener('submit',e=>e.preventDefault());
  $('#instrumentSettings').addEventListener('click',e=>{const action=e.target.dataset.instrumentAction,c=project.components.find(c=>c.id===selected);if(!action||!c)return;if(action==='tune'&&!window.DTSInstrumentUI.editable(c,'tune')){toast('Otomatik ayar menüsü kilitli');return}if(action==='reset'&&Number(c.instrumentSettings?.securityCode||0)!==0){toast('Fabrika ayarı için S.Cod değerini 0 yapın');return}if(!snapshot())return;if(action==='reset'){c.instrumentSettings={};delete c._pid;delete c._autoTune}else c._autoTune={active:!c._autoTune?.active};render(true);updateProperties();scheduleSave()});
  $('#instrumentSettings').addEventListener('change',e=>{
    if(e.target.dataset.terminalCount){const c=project.components.find(c=>c.id===selected);if(!c||!guardEdit())return;const d=byId[c.typeId],n=Number(e.target.value),type=d.terminalCount?(n===1?'terminal-2':'terminal-2-array-'+n):(n===2?'splice':'splice-'+n),next=byId[type];if(!next)return;const lost=project.wires.some(w=>[w.from,w.to].some(r=>r.c===c.id&&!next.pins.some(p=>p.id===r.p)))||project.components.some(p=>p.probeTarget?.c===c.id&&!next.pins.some(t=>t.id===p.probeTarget.p));if(lost){toast('Kablolu terminaller kaldırılamaz. Önce bağlantıyı ayırın.');updateProperties();return}if(!snapshot())return;c.typeId=type;c.label=next.name;render();updateProperties();return}
const c=project.components.find(c=>c.id===selected);if(!c)return;if(e.target.dataset.meterJack){if(!guardEdit())return;if(!snapshot())return;const result=Leads.movePlug(project,byId,c.id,e.target.value);if(!result.ok){history.pop();toast(result.reason)}render();return}const k=e.target.dataset.instrumentParam,t=e.target.dataset.thermalParam;if(!k&&!t)return;if(k&&byId[c.typeId].instrument==='et4420'&&!window.DTSInstrumentUI.editable(c,k)){updateProperties();return}const n=(e.target.type||e.target.getAttribute('type'))==='number',v=(n||e.target.dataset.valueNumber)?Number(e.target.value):e.target.dataset.valueBool?e.target.value==='true':e.target.value;if(n&&(!Number.isFinite(v)||v<Number(e.target.min)||v>Number(e.target.max))){toast('Değer izin verilen aralıkta olmalı');updateProperties();return}if(!snapshot())return;if(t){c[t]=v;if(t==='meterPosition')c.meterHold=false}else c.instrumentSettings={...(c.instrumentSettings||{}),[k]:v};delete c._pid;render(k==='input'?false:true);updateProperties();scheduleSave()});
  $('#arduinoSelectedIde').onclick=()=>{const card=project.components.find(c=>c.id===selected);if(card&&byId[card.typeId]?.arduinoBoard)window.DTSArduinoIDE?.open(card.id)};
  const openHC05Guide=()=>{$('#hc05GuideModal').hidden=false};
  const closeHC05Guide=()=>{$('#hc05GuideModal').hidden=true};
  $('#hc05WorkNote').onclick=openHC05Guide;$('#hc05GuideClose').onclick=closeHC05Guide;$('#hc05GuideDone').onclick=closeHC05Guide;
  $('#hc05GuideModal').addEventListener('pointerdown',e=>{if(e.target.id==='hc05GuideModal')closeHC05Guide()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#hc05GuideModal').hidden){e.preventDefault();closeHC05Guide()}});

  $('#arduinoSensorControls').addEventListener('change',e=>{const key=e.target.dataset.arduinoSetting,card=project.components.find(c=>c.id===selected);if(!key||!card)return;const type=e.target.dataset.arduinoSettingType;let value=type==='bool'?!!e.target.checked:type==='text'?String(e.target.value):Number(e.target.value);if(type!=='bool'&&type!=='text'&&!Number.isFinite(value))return;const def=byId[card.typeId];if(def?.kind==='pwm-generator'&&((key==='dutyPercent'&&(value<0||value>100))||(key==='frequencyHz'&&(value<1||value>20000))))return;if(def?.kind==='opto-flasher-timer'&&((key==='dutyPercent'&&(value<0||value>100))||(key==='frequencyHz'&&(value<.2||value>10))))return;if(['ac-scr-trigger','ac-triac-trigger'].includes(def?.kind)&&((key==='triggerAngleDeg'&&(value<0||value>170))||(key==='pulseWidthDeg'&&(value<1||value>45))))return;if(def?.kind==='ac-virtual-source'&&((key==='rmsVoltage'&&(value<1||value>24))||(key==='frequencyHz'&&![50,60].includes(value))))return;if(!running&&!snapshot())return;card[key]=value;if(key==='scopeTimeDivMs')card.scopeTimeMs=Math.max(.5,Math.min(2000,Number(value)*10));if(def?.incrementalEncoder38mm)window.DTSIncrementalEncoder?.state(card,def,performance.now(),false);render(true);updateProperties();if(!running)scheduleSave()});
  function updateSoundButton(){$('#soundBtn').textContent=sound.enabled?'♪ Ses açık':'♪ Ses kapalı';$('#soundBtn').setAttribute('aria-pressed',String(sound.enabled))}
  $('#soundBtn').onclick=()=>{sound.setEnabled(!sound.enabled);localStorage.setItem('ccs-sound',sound.enabled?'on':'off');updateSoundButton()};updateSoundButton();
  window.DTSEditor={library:lib,byId,getProject:()=>project,get running(){return running},snapshot,changed:projectChanged,render,renderLibrary,scheduleSave,flushDraftSync,stop,guardEdit,toast,modeUI,undo,redo,
    load(value){
      const migrated=window.DTSProjects.migrate?.(value)||value,p=window.DTSProjects.clean(window.DTSProjects.validate(migrated));
      if(p.components.some(c=>!byId[c.typeId])||(p.panel?.items||[]).some(c=>!byId[c.typeId]))throw Error('Projedeki bazı malzemeler bu sürümde tanınmıyor. Dosya değiştirilmedi.');
      gesture?.cancel();labelCancel?.();resetDraft();running=false;setStatus('Hazır');cancelPressedControls();clearTimeout(saveTimer);
      project=migrateProject(p);history=[];future=[];selectedWire=null;hideWireMenu();setSelection([]);category='electrical';group=brand=series='all';els.search.value='';
      modeUI();populateWireMenu();renderLibrary();render();if(project.workspaceMode==='panel')window.DTSPanelEditor?.fit();else materialLayoutWarning();
    },
    create(mode,name){if(mode==='arduino'&&Arduino){const p=Arduino.exampleProject('blank',window.DTSProjects.uid());p.name=name||'Arduino Projem';this.load(p);return}this.load({version:7,projectId:window.DTSProjects.uid(),workspaceMode:mode,name:name||'Yeni Proje',symbolNorm:Norms.normalize(localStorage.getItem('ccs-norm')),components:[],wires:[],junctions:[],colorRoles:clone(defaultColorRoles),...(mode==='panel'?{panel:window.DTSPanel.defaults()}:{})})},
    setAppearance(value){appearance=value==='material'?'material':'iec';localStorage.setItem('ccs-appearance',appearance);renderLibrary();refreshArtwork();materialLayoutWarning()}
  };
  const cached=localStorage.getItem('ods-project');if(cached){try{project=migrateProject(JSON.parse(cached))}catch{}}else project=migrateProject(project);
  populateWireMenu();
  applyPropertiesVisibility();
  $('#sheetName').textContent=project.name;els.workspace.setAttribute('viewBox','0 0 '+SHEET_W+' '+SHEET_H);applyCamera();renderLibrary();render();materialLayoutWarning();
})();
