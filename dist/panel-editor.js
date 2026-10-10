(function(){
  'use strict';
  const E=window.DTSEditor,P=window.DTSPanel,W=window.DTSPanelWiring,Engineering=window.DTSPanelEngineering,Lines=window.CCSConductors,$=s=>document.querySelector(s),viewport=$('#panelViewport'),art=$('#panelSvg');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),copy=p=>JSON.parse(JSON.stringify(p));
  let camera={x:50,y:40,scale:.6,yaw:-18,pitch:10,view:'3d'},selected=new Set(),drag=null,ghost=null,doorFrame=null,draft=null,wireMode=false;
  const active=()=>E.getProject().workspaceMode==='panel',panel=()=>E.getProject().panel,dimensions=()=>({w:viewport.clientWidth||850,h:viewport.clientHeight||650});
  const point=e=>{const r=viewport.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}};
  const editable=()=>active()&&!window.DTSStudio?.isHome&&E.guardEdit();
  function update(mutator){if(!editable())return false;const next=copy(panel()),result=mutator(next)||{ok:true};if(result.ok===false){E.toast(result.reason||'Yerleşim değiştirilemedi.');return false}W.synchronize(next,E.byId);if(!E.snapshot())return;E.getProject().panel=next;E.changed();return true}
  function surface(mount){return mount==='door'?'door':'plate'}
  function fit(){const {w,h}=dimensions();camera=P.fit(panel(),w,h,camera.view);render()}
  function zoomTo(scale,anchor){const a=anchor||{x:dimensions().w/2,y:dimensions().h/2},next=Math.max(.15,Math.min(4,scale)),r=next/camera.scale;camera={...camera,scale:next,x:a.x-(a.x-camera.x)*r,y:a.y-(a.y-camera.y)*r};render(false)}
  function options(current){return [['rail','DIN rayı'],['plate','Montaj plakası'],['door','Kapak'],['external','Pano dışı besleme']].map(([v,t])=>`<option value="${v}"${current===v?' selected':''}>${t}</option>`).join('')}
  const colors=Object.entries(Lines.colorNames);
  function colorOptions(value){const rows=[...colors];if(value&&!rows.some(([v])=>v===value))rows.push([value,value]);return rows.map(([v,t])=>`<option value="${esc(v)}"${v===value?' selected':''}>${t}</option>`).join('')}
  const sizeOptions=value=>[...new Set([...Lines.sizes,Lines.sizeLabel(value)])].map(v=>`<option${v===Lines.sizeLabel(value)?' selected':''}>${v}</option>`).join('');
  $('#panelWireColor').innerHTML=colorOptions('#e53935');$('#panelWireSize').innerHTML=sizeOptions(1.5);
  const selectedCable=()=>selected.size===1?panel().wires?.find(w=>selected.has(w.id)):null;
  function chooseWire(id){draft=null;wireMode=false;selected=new Set([id]);render();$('#propertiesPanel').classList.add('open')}
  function wireFields(w,n){
    const name=r=>{const i=panel().items.find(i=>i.id===r.c),t=W.endpoint(panel(),E.byId,r);return (i?.ref||'')+' · '+(t?.label||r.p)};
    n.innerHTML=`<strong>Kablo · ${esc(w.role)}</strong><p>${esc(name(w.from))} → ${esc(name(w.to))}</p><form id="panelWireForm"><label>Renk<select id="panelSelectedWireColor">${colorOptions(w.color)}</select></label><label>Özel renk<input type="color" id="panelWireCustom" value="${w.color}"></label><label>Kesit (mm²)<input id="panelSelectedWireSize" type="number" min="0.25" max="240" step="0.25" value="${Lines.sizeNumber(w.size)}"></label><button type="submit">Kabloyu güncelle</button></form><div class="panel-end-actions"><button id="panelReconnectFrom">İlk ucu değiştir</button><button id="panelReconnectTo">İkinci ucu değiştir</button><button id="panelRedrawWire">Güzergâhı yeniden çiz</button><button id="panelAutoWire">Otomatik güzergâh</button></div><p>İki uçta yalıtımlı yüksük bulunur. Malzemeyi veya rayı taşıdığında uçlar bağlı kalır.</p><button id="panelDeleteSelected" class="danger">Kabloyu sil</button>`;
    const entries=panel().ducts;if(entries.length){n.insertAdjacentHTML('beforeend','<label>Kabloyu kanal / aksesuar içinden geçir<select id="panelWireAccessory">'+entries.map(d=>'<option value="'+esc(d.id)+'">'+(d.kind==='gland'?'Rekor':d.kind==='spiral'?'Spiral':'Kablo kanalı')+' · '+d.x+', '+d.y+'</option>').join('')+'</select></label><button id="panelWireThread">İçinden geçir</button>');$('#panelWireThread').onclick=()=>update(p=>{const d=p.ducts.find(d=>d.id===$('#panelWireAccessory').value),wire=p.wires.find(x=>x.id===w.id),a={x:d.x+(d.vertical?d.width/2:5),y:d.y+(d.vertical?5:d.width/2),surface:'plate'},b={x:d.x+(d.vertical?d.width/2:d.length-5),y:d.y+(d.vertical?d.length-5:d.width/2),surface:'plate'};wire.points=[a,b];wire.accessoryId=d.id;return W.routes(p,E.byId,wire).length?{ok:true}:{ok:false,reason:'Aksesuarın konumunu kablo güzergâhına yaklaştırın.'}})}
    $('#panelWireForm').onsubmit=e=>{e.preventDefault();update(p=>W.recolor(p,E.byId,w.id,$('#panelWireCustom').value,$('#panelSelectedWireSize').value))};
    const applyColor=color=>{const size=$('#panelSelectedWireSize').value;update(p=>W.recolor(p,E.byId,w.id,color,size))};
    $('#panelSelectedWireColor').onchange=e=>applyColor(e.target.value);
    $('#panelWireCustom').onchange=e=>applyColor(e.target.value);
    $('#panelDeleteSelected').onclick=removeSelected;
    const reconnect=from=>{if(!editable())return;draft={from:copy(from),points:[],color:w.color,size:w.size,originalId:w.id};wireMode=true;render()};
    $('#panelReconnectFrom').onclick=()=>reconnect(w.to);$('#panelReconnectTo').onclick=()=>reconnect(w.from);$('#panelRedrawWire').onclick=()=>reconnect(w.from);
    $('#panelAutoWire').onclick=()=>update(p=>{const wire=p.wires.find(x=>x.id===w.id);wire.points=[];delete wire.accessoryId});
  }
  function fields(){
    const p=panel();$('#panelWidth').value=p.width;$('#panelHeight').value=p.height;$('#panelDepth').value=p.depth;
    const id=[...selected][0],item=p.items.find(i=>i.id===id),rail=p.rails.find(i=>i.id===id),duct=p.ducts.find(i=>i.id===id),wire=p.wires?.find(i=>i.id===id),n=$('#panelSelectionProperties');
    if(!selected.size){n.innerHTML='<p>Bir malzemeyi, rayı veya kanalı seçerek düzenle. Bağlı kablonun rengini değiştirmek için kabloya tıkla.</p>';return}
    if(selected.size>1){n.innerHTML=`<strong>${selected.size} nesne seçili</strong><button id="panelDeleteSelected" class="danger">Seçilenleri sil</button>`;$('#panelDeleteSelected').onclick=removeSelected;return}
    if(wire){wireFields(wire,n);return}
    const object=item||rail||duct;if(!object){selected.clear();n.innerHTML='';return}
    const input=(key,label,value,min=0)=>`<label>${label}<input name="${key}" type="number" min="${min}" step="0.5" value="${value}"></label>`;
    n.innerHTML=`<form id="panelItemForm"><strong>${esc(item?E.byId[item.typeId].name:rail?'DIN rayı · 35 mm':duct?.kind==='gland'?'Kablo giriş rekoru':duct?.kind==='spiral'?'Kablo spirali':'Kablo kanalı')}</strong>${item?`<label>Cihaz adı<input name="ref" maxlength="24" value="${esc(item.ref)}"></label><label>Montaj yeri<select name="mount">${options(item.mount)}</select></label>`:''}<div class="dimension-row">${input('x','X (mm)',object.x)}${input('y','Y (mm)',object.y)}</div>${item?`<div class="dimension-row">${input('w','En (mm)',item.w,5)}${input('h','Boy (mm)',item.h,5)}</div>${input('depth','Derinlik (mm)',item.depth,1)}`:input('length','Uzunluk (mm)',object.length,50)+(duct?input('width','Genişlik (mm)',duct.width,10)+`<label>Yön<select name="vertical"><option value="true"${duct.vertical?' selected':''}>Dikey</option><option value="false"${!duct.vertical?' selected':''}>Yatay</option></select></label>`:'')}<button type="submit">Yerleşimi uygula</button></form><button id="panelDeleteSelected" class="danger">Seçileni sil</button>`;
    $('#panelDeleteSelected').onclick=removeSelected;
    $('#panelItemForm').onsubmit=e=>{e.preventDefault();const value=k=>n.querySelector(`[name="${k}"]`)?.value,num=k=>Number(value(k));
      update(next=>{
        if(item){const o=next.items.find(i=>i.id===id),candidate={...o,ref:value('ref'),w:num('w'),h:num('h'),depth:num('depth')};if(![candidate.w,candidate.h,candidate.depth,num('x'),num('y')].every(Number.isFinite)||candidate.w<5||candidate.h<5||candidate.depth<1)return {ok:false,reason:'Geçerli pozitif ölçüler girin.'};const result=P.proposal(next,candidate,num('x'),num('y'),value('mount'));if(result.ok)Object.assign(o,result.item);return result}
        if(rail){const r=next.rails.find(i=>i.id===id);r.length=num('length');if(r.length<50||r.length>next.width-40)return {ok:false,reason:'Ray uzunluğunu kontrol edin.'};return P.moveRail(next,id,num('x')-r.x,num('y')-r.y)}
        const d=next.ducts.find(i=>i.id===id);Object.assign(d,{x:P.snap(num('x')),y:P.snap(num('y')),width:num('width'),length:num('length'),vertical:value('vertical')==='true'});return checkDuct(next,d);
      });
    };
    if(duct&&!duct.kind){n.insertAdjacentHTML('beforeend',`<button id="panelDuctCover">${duct.coverClosed?'Kanal kapağını aç':'Kanal kapağını kapat'}</button>`);$('#panelDuctCover').onclick=()=>update(p=>{const d=p.ducts.find(x=>x.id===id);d.coverClosed=!d.coverClosed})}
    if(item){const pins=W.ports(item,E.byId[item.typeId]);if(pins.length){n.insertAdjacentHTML('beforeend','<strong>Bağlantı terminalleri</strong><div class="panel-pin-list">'+pins.map(t=>`<button data-panel-connect-pin="${esc(t.p)}" title="Bu terminalden kablo başlat veya bitir">${esc(t.label)}</button>`).join('')+'</div>');for(const b of n.querySelectorAll('[data-panel-connect-pin]'))b.onclick=()=>terminal({c:item.id,p:b.dataset.panelConnectPin})}}
    if(item){const wires=(p.wires||[]).filter(w=>w.from.c===item.id||w.to.c===item.id);if(wires.length){
      n.insertAdjacentHTML('beforeend','<strong>Bağlı kablolar · renk düzenle</strong><div class="panel-connected-wires">'+wires.map(w=>{const own=w.from.c===item.id?w.from:w.to,other=w.from.c===item.id?w.to:w.from,dest=p.items.find(i=>i.id===other.c);return `<button type="button" data-panel-select-wire="${esc(w.id)}"><span class="panel-cable-swatch" style="background:${esc(w.color)}"></span><span>${esc(own.p)} → ${esc(dest?.ref||'')} · ${esc(other.p)}</span></button>`}).join('')+'</div>');
      for(const b of n.querySelectorAll('[data-panel-select-wire]'))b.onclick=()=>chooseWire(b.dataset.panelSelectWire);
    }}
  }
  function engineeringSummary(p,closure){
    const status=$('#panelEngineeringStatus'),detail=$('#panelEngineeringDetail'),body=$('#panelEngineeringReport');if(!status||!detail||!Engineering)return;
    const report=Engineering.audit(p,E.byId,{doorClearance:()=>closure||P.doorClearance(p)}),s=report.summary;
    status.textContent=s.verifiedViolations?('⚠ '+s.verifiedViolations+' doğrulanmış mühendislik ihlali'):s.unknownChecks?('Veri eksik · '+s.unknownChecks+' kontrol doğrulanamıyor'):'Doğrulanmış kontrollerde ihlal yok';
    detail.textContent='BOM: '+report.bom.items.reduce((n,x)=>n+x.quantity,0)+' cihaz · '+report.bom.wires.quantity+' kablo · '+Math.round(report.bom.wires.totalLengthMm)+' mm rota'+(s.segregationAdvisories?' · '+s.segregationAdvisories+' segregasyon uyarısı':'')+'. Unknown sonuçlar uygunluk onayı değildir.';
    status.dataset.state=s.verifiedViolations?'violation':s.unknownChecks?'unknown':'ok';
    if(body){
      const tag=v=>v==='violation'?'⚠ ihlal':v==='ok'?'✓ uygun':'? veri eksik';
      const bom=report.bom.items.length?report.bom.items.map(x=>'<li>'+esc(x.name)+' × '+x.quantity+' <small>ölçü: '+x.dimensionStatus.verified+' verified / '+x.dimensionStatus.approximate+' approximate / '+x.dimensionStatus.unknown+' unknown</small></li>').join(''):'<li>Cihaz yok</li>';
      const ducts=report.ductAudit.length?report.ductAudit.map(x=>'<li>'+esc(x.ductId)+' · '+x.assignedWireCount+' kablo · doluluk: '+tag(x.fill.status)+(x.fill.fillPct!==null?' · %'+x.fill.fillPct:'')+(x.segregation.mixedClasses?' · segregasyon advisory':'')+'</li>').join(''):'<li>Kablo kanalı yok</li>';
      const bendUnknown=report.bendAudit.filter(x=>x.status==='unknown').length,bendViolation=report.bendAudit.filter(x=>x.status==='violation').length;
      const serviceUnknown=report.serviceAudit.filter(x=>x.status==='unknown').length,serviceViolation=report.serviceAudit.filter(x=>x.status==='violation').length;
      const manufacturerUnknown=report.manufacturerClearanceAudit.filter(x=>x.status==='unknown').length,manufacturerViolation=report.manufacturerClearanceAudit.filter(x=>x.status==='violation').length,manufacturerOk=report.manufacturerClearanceAudit.filter(x=>x.status==='ok').length;
      body.innerHTML='<strong>BOM</strong><ul>'+bom+'</ul><strong>Kablo kanalları</strong><ul>'+ducts+'</ul><p><strong>Bükülme:</strong> '+bendViolation+' ihlal · '+bendUnknown+' veri eksik</p><p><strong>Servis boşluğu:</strong> '+serviceViolation+' ihlal · '+serviceUnknown+' veri eksik</p><p><strong>Üretici montaj boşluğu:</strong> '+manufacturerViolation+' ihlal · '+manufacturerOk+' uygun · '+manufacturerUnknown+' bağlam/veri eksik</p><p><strong>Termal envanter:</strong> '+report.thermal.knownHeatLossW+' W doğrulanmış yük · '+report.thermal.unknownItemCount+' cihaz veri eksik · enclosure uygunluğu unknown</p>';
    }
  }
  function render(properties=true){
    if(!active())return;const p=panel(),{w,h}=dimensions();if(draft&&!W.endpoint(p,E.byId,draft.from))draft=null;art.setAttribute('viewBox',`0 0 ${w} ${h}`);art.innerHTML=P.render(p,E.byId,camera,selected,ghost,draft);
    $('#panelHint').hidden=!!(p.items.length||p.rails.length||p.ducts.length);$('#zoomLabel').textContent=Math.round(camera.scale*100)+'%';$('#objectCount').textContent=`${p.items.length} malzeme · ${p.rails.length} ray · ${p.ducts.length} kanal · ${p.wires?.length||0} kablo`;
    $('#panelWireMode').classList.toggle('active',wireMode);$('#panelWireMode').setAttribute('aria-pressed',String(wireMode));viewport.classList.toggle('wiring',!!draft||wireMode);$('#panelCancelWire').hidden=!draft;
    const cable=selectedCable();$('#panelWireColorLabel').textContent=cable&&!draft?'Seçili kablo':'Yeni kablo';if(cable&&!draft){$('#panelWireColor').innerHTML=colorOptions(cable.color);$('#panelWireColor').value=cable.color;$('#panelWireSize').innerHTML=sizeOptions(cable.size);$('#panelWireSize').value=Lines.sizeLabel(cable.size)}
    const source=draft&&p.items.find(i=>i.id===draft.from.c);$('#panelWireHint').textContent=draft?`${source?.ref} · ${W.endpoint(p,E.byId,draft.from)?.label} → Hedef terminali seç. Boş alana tıkla: ara nokta.`:cable?'Kabloyu yatay/dikey parçasından tutup sürükle. Renk seçimi de hemen uygulanır.':'İki terminale tıkla: bağla. Kabloyu yatay/dikey parçasından tutup sürükleyerek güzergâhı değiştir.';
    const closure=properties&&typeof P.doorClearance==='function'?P.doorClearance(p):null,blocked=!!closure&&!closure.ok,toggle=$('#panelToggleDoor');if(properties)engineeringSummary(p,closure);
    toggle.textContent=p.doorAngle>10?(blocked?'Kapağı kapat ⚠':'Kapağı kapat'):'Kapağı aç';toggle.title=blocked?closure.reason:'';toggle.setAttribute('aria-invalid',String(blocked));$('#panelDoorAngle').value=Math.round(p.doorAngle);$('#panelDoorValue').textContent=Math.round(p.doorAngle)+'°';
    for(const b of document.querySelectorAll('[data-panel-view]'))b.classList.toggle('active',b.dataset.panelView===camera.view);
    if(properties)fields();
  }
  function add(typeId,e){
    if(!editable())return;if(typeId==='panel-din-rail'){addRail();return}if(typeId==='panel-duct'){addDuct();return}if(['panel-gland','panel-spiral'].includes(typeId)){addAccessory(typeId.slice(6));return}
    const d=E.byId[typeId];if(!d)return;
    let mount=$('#panelMount').value;if(mount==='auto')mount=camera.view==='door'?'door':P.spec(d).mount;
    if(camera.view==='plate'&&mount==='door'){E.toast('Kapak malzemesi için Kapak görünümünü seçin.');return}
    if(camera.view==='door'&&mount!=='door'){E.toast('İç malzeme için Pano içi görünümünü seçin.');return}
    if(camera.view==='3d'&&panel().doorAngle<15&&mount!=='door'){E.toast('İç montaj için önce kapağı açın.');return}
    const pos=e?point(e):{x:dimensions().w/2,y:dimensions().h/2},q=P.unproject(P.matrix(panel(),camera,surface(mount),20),pos.x,pos.y);
    if(!q){E.toast('Daha rahat yerleşim için Pano içi veya Kapak görünümünü seçin.');return}
    update(p=>{const result=P.addItem(p,d,q.x,q.y,mount);if(result.ok)selected=new Set([result.item.id]);return result});
  }
  function showInterior(){draft=null;wireMode=false;if(camera.view==='door'||panel().doorAngle<15){camera.view='plate';fit()}else render()}
  function addRail(){const ok=update(p=>{const y=Math.min(p.height-40,150+(p.rails.length%Math.max(1,Math.floor((p.height-190)/25)))*25),r=P.addRail(p,40,y,p.width-100);selected=new Set([r.id]);return {ok:true}});if(ok)showInterior()}
  function checkDuct(p,d){const box={x:d.x,y:d.y,w:d.vertical?d.width:d.length,h:d.vertical?d.length:d.width};if(![d.x,d.y,d.width,d.length].every(Number.isFinite)||d.width<10||d.length<50||box.x<20||box.y<20||box.x+box.w>p.width-20||box.y+box.h>p.height-20)return {ok:false,reason:'Kanalın konumunu ve ölçülerini kontrol edin.'};return {ok:true}}
  function addAccessory(kind){const ok=update(p=>{const d={id:P.uid(kind),kind,x:40,y:40,width:kind==='gland'?30:20,length:kind==='gland'?50:150,vertical:true};p.ducts.push(d);selected=new Set([d.id]);return {ok:true}});if(ok)showInterior()}
  function addDuct(){const ok=update(p=>{const d={id:P.uid('duct'),x:p.width-50-(p.ducts.length%5)*5,y:40,width:30,length:p.height-80,vertical:true};p.ducts.push(d);selected=new Set([d.id]);return {ok:true}});if(ok)showInterior()}
  function removeSelected(){if(!selected.size)return;draft=null;update(p=>{P.remove(p,[...selected]);selected.clear()})}
  function selectAll(){selected=new Set([...panel().items,...panel().rails,...panel().ducts,...panel().wires||[]].map(i=>i.id));render()}
  function terminal(ref){
    if(!editable())return;
    if(!draft){selected=new Set([ref.c]);draft={from:ref,points:[],color:$('#panelWireColor').value,size:$('#panelWireSize').value};wireMode=true;render();return}
    const pending=copy(draft),ok=update(p=>{if(pending.originalId)p.wires=p.wires.filter(w=>w.id!==pending.originalId);const r=W.connect(p,E.byId,pending.from,ref,pending.color,pending.size,pending.points);if(r.ok){if(pending.originalId)r.wire.id=pending.originalId;selected=new Set([r.wire.id]);draft=null}return r});
    if(ok){viewport.focus();E.toast('Kablo bağlandı · İki uçta yüksük eklendi.')}
  }
  function cancelWire(){draft=null;wireMode=false;render()}
  function waypoint(e){
    const pos=point(e),s=e.target.closest('[data-panel-surface]')?.dataset.panelSurface||(camera.view==='door'?'door':camera.view==='plate'?'plate':W.endpoint(panel(),E.byId,draft.from).surface),q=P.unproject(P.matrix(panel(),camera,s,20),pos.x,pos.y);return q?{x:P.snap(q.x),y:P.snap(q.y),surface:s}:null;
  }
  function cancelDrag(){drag?.finish(true)}
  function start(e,move,finish){
    const pointer=e.pointerId;let done=false;
    const onMove=ev=>{if(ev.pointerId===pointer)move(ev)},onUp=ev=>{if(ev.pointerId===pointer&&ev.button===e.button)end(false)},cancel=()=>end(true),key=ev=>{if(ev.key==='Escape'){ev.preventDefault();ev.stopImmediatePropagation();end(true)}};
    function end(cancelled){if(done)return;done=true;window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);window.removeEventListener('pointercancel',cancel);window.removeEventListener('blur',cancel);document.removeEventListener('keydown',key,true);try{viewport.releasePointerCapture(pointer)}catch{}drag=null;viewport.classList.remove('panning');finish(cancelled)}
    drag={finish:end};try{viewport.setPointerCapture(pointer)}catch{}window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);document.addEventListener('keydown',key,true);
  }
  viewport.addEventListener('contextmenu',e=>e.preventDefault());viewport.addEventListener('wheel',e=>{e.preventDefault();if(!drag)zoomTo(camera.scale*Math.exp(-e.deltaY*.0015),point(e))},{passive:false});
  viewport.addEventListener('pointermove',e=>{if(draft&&!drag){draft.mouse=waypoint(e);render(false)}});
  viewport.addEventListener('pointerdown',e=>{
    if(!active()||drag||![0,2].includes(e.button))return;e.preventDefault();viewport.focus({preventScroll:true});
    if(e.button===2){const before={...camera},wireId=e.target.closest('[data-panel-wire]')?.dataset.panelWire;let moved=false;viewport.classList.add('panning');start(e,ev=>{moved=moved||Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)>3;camera={...before,x:before.x+ev.clientX-e.clientX,y:before.y+ev.clientY-e.clientY};render(false)},cancel=>{if(cancel){camera=before;render(false)}else if(!moved&&wireId){selected=new Set([wireId]);render();$('#propertiesPanel').classList.add('open')}});return}
    const handle=e.target.closest('[data-wire-handle]');if(handle){
      if(!editable())return;const original=copy(panel()),id=handle.dataset.wireHandle,surface=handle.dataset.handleSurface,index=Number(handle.dataset.handleIndex),wire=original.wires.find(w=>w.id===id);
      if(wire.accessoryId){const accessory=original.ducts.find(d=>d.id===wire.accessoryId);if(accessory)wire.points=W.accessoryPoints(accessory);delete wire.accessoryId}if(handle.dataset.handleAuto==='true'){const route=W.routes(original,E.byId,wire).find(r=>r.surface===surface);wire.points=[...wire.points.filter(q=>q.surface!==surface),...route.flat.slice(1,-1).map(q=>({...q,surface}))]}
      let candidate=null;start(e,ev=>{const a=point(ev),q=P.unproject(P.matrix(original,camera,surface,20),a.x,a.y);if(!q)return;const next=copy(original),w=next.wires.find(w=>w.id===id),p=w.points.filter(q=>q.surface===surface)[index];p.x=P.snap(Math.max(-180,Math.min(next.width+180,q.x)));p.y=P.snap(Math.max(-180,Math.min(next.height+180,q.y)));if(W.routes(next,E.byId,w).length){candidate=next;art.innerHTML=P.render(next,E.byId,camera,selected)}} ,cancel=>{if(!cancel&&candidate){if(!E.snapshot())return;E.getProject().panel=candidate;E.changed()}else render()});return;
    }
    const pin=e.target.closest('[data-panel-terminal]');if(pin){terminal({c:pin.dataset.panelOwner,p:pin.dataset.panelTerminal});return}
    if(draft){if(e.target.closest('[data-panel-id]')){E.toast('Bağlantıyı bitirmek için malzemenin terminaline tıkla.');return}const q=waypoint(e);if(q&&q.x>=-180&&q.y>=-180&&q.x<=panel().width+180&&q.y<=panel().height+180){draft.points.push(q);render(false)}return}
    const wireNode=e.target.closest('[data-panel-wire]'),wireId=wireNode?.dataset.panelWire;if(wireId){
      if(e.shiftKey||e.ctrlKey){selected.has(wireId)?selected.delete(wireId):selected.add(wireId);render();return}
      selected=new Set([wireId]);const surfaceName=wireNode.dataset.panelWireSurface;
      if(!surfaceName||wireNode.classList.contains('panel-door-loom')||!editable()){render();$('#propertiesPanel').classList.add('open');return}
      const original=copy(panel()),wire=original.wires.find(w=>w.id===wireId),screen=point(e),m=P.matrix(original,camera,surfaceName,20),startPoint=P.unproject(m,screen.x,screen.y),route=wire&&W.routes(original,E.byId,wire).find(r=>r.surface===surfaceName),hit=route&&startPoint&&W.nearestSegment(route.flat,startPoint,true);
      if(!wire||!hit){render();$('#propertiesPanel').classList.add('open');return}
      let candidate=null,moved=false,lastReason='';
      start(e,ev=>{
        if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<4)return;
        const a=point(ev),q=P.unproject(m,a.x,a.y);if(!q)return;moved=true;
        const next=copy(original),w=next.wires.find(w=>w.id===wireId),result=W.moveSegment(next,E.byId,w,surfaceName,hit.segment,q);lastReason=result.reason||'';
        if(result.ok){candidate=next;art.innerHTML=P.render(next,E.byId,camera,selected);viewport.classList.add('wire-dragging')}else candidate=null;
      },cancel=>{
        viewport.classList.remove('wire-dragging');
        if(!cancel&&moved&&candidate){if(!E.snapshot())return;E.getProject().panel=candidate;E.changed();E.scheduleSave();E.toast(hit.vertical?'Dikey kablo parçası sağ/sol taşındı.':'Yatay kablo parçası yukarı/aşağı taşındı.')}
        else{if(!cancel&&moved&&lastReason)E.toast(lastReason);render()}
      });return
    }
    const id=e.target.closest('[data-panel-id]')?.dataset.panelId;
    if(!id){selected.clear();render();return}
    if(e.shiftKey||e.ctrlKey){selected.has(id)?selected.delete(id):selected.add(id);render();return}
    selected=new Set([id]);render();if(innerWidth<=1050)$('#propertiesPanel').classList.add('open');if(!editable())return;
    const original=copy(panel()),object=original.items.find(i=>i.id===id)||original.rails.find(i=>i.id===id)||original.ducts.find(i=>i.id===id),isItem=original.items.some(i=>i.id===id),isRail=original.rails.some(i=>i.id===id),m=P.matrix(original,camera,surface(object.mount),isItem&&object.mount!=='door'?20+object.depth:20),origin=point(e),a=P.unproject(m,origin.x,origin.y);if(!a)return;
    let candidate=null,lastResult=null,moved=false;
    start(e,ev=>{
      if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<3)return;moved=true;const q=point(ev),b=P.unproject(m,q.x,q.y);if(!b)return;const dx=P.snap(b.x-a.x),dy=P.snap(b.y-a.y),next=copy(original);let result;
      if(isItem){result=P.proposal(next,object,object.x+dx,object.y+dy);ghost=result;if(result.ok)Object.assign(next.items.find(i=>i.id===id),result.item)}
      else if(isRail)result=P.moveRail(next,id,dx,dy);
      else {const d=next.ducts.find(i=>i.id===id);d.x+=dx;d.y+=dy;result=checkDuct(next,d)}
      lastResult=result;candidate=result.ok?next:null;art.innerHTML=P.render(candidate||original,E.byId,camera,selected,ghost,draft);
    },cancel=>{ghost=null;if(!cancel&&moved&&candidate){if(!E.snapshot())return;E.getProject().panel=candidate;E.changed()}else{if(!cancel&&moved&&lastResult?.reason)E.toast(lastResult.reason);render()}});
  });
  viewport.addEventListener('dragover',e=>{e.preventDefault();viewport.classList.add('dragover')});viewport.addEventListener('dragleave',()=>viewport.classList.remove('dragover'));viewport.addEventListener('drop',e=>{e.preventDefault();viewport.classList.remove('dragover');add(e.dataTransfer.getData('text/component'),e)});
  $('#panelDimensions').onsubmit=e=>{e.preventDefault();update(p=>P.resize(p,Number($('#panelWidth').value),Number($('#panelHeight').value),Number($('#panelDepth').value)))};
  $('#panelDimensionsBtn').onclick=()=>{$('#propertiesPanel').classList.add('open');$('#panelWidth').focus()};
  $('#panelAddRail').onclick=addRail;$('#panelAddDuct').onclick=addDuct;
  $('#panelWireMode').onclick=()=>{if(!editable())return;wireMode=!wireMode;if(!wireMode)draft=null;render()};$('#panelCancelWire').onclick=cancelWire;
  $('#panelWireColor').onchange=()=>{const color=$('#panelWireColor').value,cable=selectedCable();if(cable&&!draft){update(p=>W.recolor(p,E.byId,cable.id,color,cable.size));return}$('#panelWireSize').value=Lines.sizeLabel(panel().colorSizes?.[color]||1.5);if(draft){draft.color=color;draft.size=$('#panelWireSize').value;render(false)}};
  $('#panelWireSize').onchange=()=>{const value=$('#panelWireSize').value,color=$('#panelWireColor').value,cable=selectedCable();if(cable&&!draft){update(p=>W.recolor(p,E.byId,cable.id,cable.color,value));return}if(draft)draft.size=value;update(p=>W.setSize(p,color,value))};
  for(const b of document.querySelectorAll('[data-panel-view]'))b.onclick=()=>{cancelDrag();camera.view=b.dataset.panelView;fit()};
  $('#panelOrbitLeft').onclick=()=>{camera.view='3d';camera.yaw=Math.max(-60,camera.yaw-10);render()};$('#panelOrbitRight').onclick=()=>{camera.view='3d';camera.yaw=Math.min(60,camera.yaw+10);render()};
  let angleBefore=null;
  $('#panelDoorAngle').oninput=e=>{if(!active())return;if(doorFrame){cancelAnimationFrame(doorFrame);doorFrame=null}const p=panel(),target=Number(e.target.value);if(target<p.doorAngle&&typeof P.doorClearance==='function'){const clearance=P.doorClearance(p,{fromAngle:target,toAngle:p.doorAngle});if(!clearance.ok){e.target.value=Math.round(p.doorAngle);$('#panelDoorValue').textContent=Math.round(p.doorAngle)+'°';selected=new Set([clearance.collision.doorId,clearance.collision.plateId]);E.toast(clearance.reason);render();return}}if(angleBefore===null){if(!E.snapshot())return;angleBefore=p.doorAngle}p.doorAngle=target;render(false)};
  $('#panelDoorAngle').onchange=()=>{angleBefore=null;E.scheduleSave()};
  $('#panelToggleDoor').onclick=()=>{
    if(!editable())return;cancelDrag();if(doorFrame)cancelAnimationFrame(doorFrame);camera.view='3d';const p=panel(),from=p.doorAngle,to=from>10?0:105;
    if(to<from&&typeof P.doorClearance==='function'){const clearance=P.doorClearance(p,{fromAngle:to,toAngle:from});if(!clearance.ok){selected=new Set([clearance.collision.doorId,clearance.collision.plateId]);E.toast(clearance.reason);render();return}}
    if(!E.snapshot())return;let startTime=null;
    const frame=time=>{if(panel()!==p||!active()){doorFrame=null;return}if(startTime===null)startTime=time;const t=Math.min(1,(time-startTime)/420),ease=t*t*(3-2*t);p.doorAngle=from+(to-from)*ease;render(false);if(t<1)doorFrame=requestAnimationFrame(frame);else{doorFrame=null;E.scheduleSave();render()}};doorFrame=requestAnimationFrame(frame);
  };
  document.addEventListener('keydown',e=>{if(!active()||window.DTSStudio?.isHome||window.DTSStudio?.safety?.visible||!$('#modal').hidden||window.CCSSelection.isEditing(document.activeElement)||drag)return;
    const pin=e.target.closest?.('[data-panel-terminal]');if(pin&&(e.key==='Enter'||e.key===' ')){e.preventDefault();terminal({c:pin.dataset.panelOwner,p:pin.dataset.panelTerminal});return}
    if(draft&&e.key==='Backspace'){e.preventDefault();draft.points.pop();render(false);return}
    if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();removeSelected()}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){e.preventDefault();selectAll()}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?E.redo():E.undo()}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();E.redo()}
    if(e.key==='Escape'){draft=null;wireMode=false;selected.clear();render()}
  });
  window.addEventListener('resize',()=>{if(active())render(false)});
  window.DTSPanelEditor={render,fit,add,addRail,addDuct,removeSelected,selectAll,zoomTo,zoomBy:f=>zoomTo(camera.scale*f),resetSelection(){cancelDrag();draft=null;wireMode=false;selected.clear();if(doorFrame)cancelAnimationFrame(doorFrame);doorFrame=null},get camera(){return {...camera}}};
})();
