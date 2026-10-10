(function(root){
  'use strict';
  const $=s=>document.querySelector(s),A=root.DTSArduino,X=root.DTSArduinoExamples;
  let currentBoardId=null,currentExampleId=X?.aliases?.blink||X?.catalog?.[0]?.id||'',previewMeta=null,consoleTimer=null;
  let serialPort=null,serialReader=null,serialWriter=null,bridgeTimer=null,bridgeModuleId=null,bridgeWriting=false,bridgeClosing=false;
  let serialPopupTimer=null,serialPopupBoardId=null;
  const editor=()=>root.DTSEditor,project=()=>editor()?.getProject();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const officialDescriptor=m=>m?{id:m.id,title:m.title,category:m.category,sourceRepo:m.sourceRepo,sourceRef:m.sourceRef,sourcePath:m.sourcePath,sourceUrl:m.sourceUrl,license:m.license,readOnly:true}:null;
  const boards=()=>{const E=editor(),p=project();return (p?.components||[]).filter(c=>E?.byId?.[c.typeId]?.arduinoBoard)};
  const selectedBoard=()=>boards().find(c=>c.id===currentBoardId)||boards()[0]||null;
  function status(message,kind=''){const el=$('#arduinoIdeStatus');if(!el)return;el.textContent=message;el.dataset.kind=kind}
  function fillBoards(preferred){
    const select=$('#arduinoBoardSelect'),rows=boards();if(!select)return null;
    select.innerHTML=rows.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.arduinoProgramName||c.label||c.ref||'Arduino UNO R3')+'</option>').join('');
    currentBoardId=rows.some(c=>c.id===preferred)?preferred:rows[0]?.id||null;if(currentBoardId)select.value=currentBoardId;return selectedBoard();
  }
  function fillExamples(){
    const sel=$('#arduinoExampleSelect');if(!sel||!X)return;
    sel.innerHTML=X.categories.map(cat=>'<optgroup label="'+esc(cat)+'">'+X.catalog.filter(x=>x.category===cat).map(x=>'<option value="'+esc(x.id)+'">'+esc(x.title)+'</option>').join('')+'</optgroup>').join('');
    if(!X.byId[currentExampleId])currentExampleId=X.catalog[0]?.id||'';sel.value=currentExampleId;
  }
  function showExampleInfo(id){
    const x=X?.byId?.[id],el=$('#arduinoExampleInfo');if(!x||!el)return;
    const sim=x.simSupport==='full'?'Simülasyon: destekleniyor':x.simSupport==='partial'?'Simülasyon: kısmi destek':'Simülasyon: referans modu';
    el.innerHTML='<strong>'+esc(x.category)+'</strong> · '+esc(x.compatibility)+' · '+esc(sim)+' · <span class="official-source">Resmi kaynak: '+esc(x.sourceRepo)+' / '+esc(x.sourcePath)+'</span>';
  }
  function metaForBoard(board){
    const marker=board?.arduinoOfficialExample;if(!marker)return null;
    return X?.byId?.[marker.id]||{...marker,official:true,readOnly:true,code:board.arduinoSketch,title:marker.title||board.arduinoProgramName};
  }
  function setProtection(meta){
    const locked=!!(meta?.official||meta?.readOnly),code=$('#arduinoCode'),name=$('#arduinoProgramName'),banner=$('#arduinoOfficialBanner');
    code.readOnly=locked;name.readOnly=locked;code.setAttribute('aria-readonly',String(locked));name.setAttribute('aria-readonly',String(locked));
    $('.arduino-ide-window')?.classList.toggle('official-example-open',locked);
    if(banner){
      banner.hidden=!locked;
      if(locked)banner.innerHTML='<span>🔒 <b>Resmi Arduino örneği · salt okunur</b> — Test ve simülasyon serbest. Düzenlemek için önce Farklı Kaydet.</span><small>'+esc(meta.sourceRepo||'Arduino')+' · '+esc(meta.sourcePath||meta.title||'')+(meta.license?' · '+esc(meta.license):'')+'</small><button id="arduinoOfficialSaveAs" type="button">Farklı Kaydet</button>';
      banner.querySelector('#arduinoOfficialSaveAs')?.addEventListener('click',()=>requestSaveAs());
    }
    $('#arduinoSaveProgram').disabled=false;$('#arduinoSaveProgram').setAttribute('aria-label',locked?'Kaydet · resmi örnek korunuyor, Farklı Kaydet gerekli':'Kaydet');
  }
  function loadBoard(board){
    if(!board)return;currentBoardId=board.id;$('#arduinoBoardSelect').value=board.id;
    previewMeta=metaForBoard(board);
    $('#arduinoProgramName').value=board.arduinoProgramName||board.label||'Arduino Kartım';
    $('#arduinoCode').value=board.arduinoSketch||A.sketches.blank.code;
    setProtection(previewMeta);updateLines();
    status(board._arduinoError?'Hata · '+board._arduinoError:previewMeta?'Resmi örnek karta yüklü · salt okunur':'Kart hazır',board._arduinoError?'error':'');
  }
  function updateLines(){
    const code=$('#arduinoCode'),gutter=$('#arduinoLineNumbers');if(!code||!gutter)return;
    const count=Math.max(1,code.value.split('\n').length);gutter.textContent=Array.from({length:count},(_,i)=>i+1).join('\n');gutter.scrollTop=code.scrollTop;
  }
  const hc05Rows=()=>A?.hc05List?.(project(),editor()?.byId||{})||[];
  function selectedHC05(){const rows=hc05Rows(),id=$('#hc05BridgeModule')?.value||bridgeModuleId;return rows.find(c=>c.id===id)||rows[0]||null}
  function bridgeHC05(){const rows=hc05Rows();return rows.find(c=>c.id===bridgeModuleId)||null}
  function fillHC05(){
    const el=$('#hc05BridgeModule');if(!el)return null;const rows=hc05Rows(),keep=el.value||bridgeModuleId;
    el.innerHTML=rows.length?rows.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.hc05Name||c.label||c.ref||'HC-05')+'</option>').join(''):'<option value="">HC-05 eklenmedi</option>';
    const chosen=rows.some(c=>c.id===keep)?keep:rows[0]?.id||'';el.value=chosen;if(!serialPort)bridgeModuleId=chosen;return rows.find(c=>c.id===chosen)||null;
  }
  function bridgeStatus(message,kind=''){const el=$('#hc05BridgeStatus');if(!el)return;el.textContent=message;el.dataset.connected=kind==='connected'?'1':'0';el.dataset.error=kind==='error'?'1':'0'}
  function refreshHC05Terminal(){
    const c=fillHC05(),out=$('#hc05Terminal');if(!out)return;if(!c){out.textContent='Bluetooth trafik günlüğü · modül yok';return}
    const s=A.hc05State?.(c)||null,lines=s?.log||[];out.textContent=lines.length?lines.join('\n'):'Bluetooth trafik günlüğü · veri yok';out.scrollTop=out.scrollHeight;
  }
  function refreshConsole(){
    clearTimeout(consoleTimer);const modal=$('#arduinoIdeModal');if(!modal||modal.hidden)return;
    const b=selectedBoard(),out=$('#arduinoConsole'),baud=Number($('#arduinoSerialBaud')?.value||9600),state=b?A.serialState?.(b,baud):null;
    if(out){out.textContent=state?.text||'Seri Monitör · çıktı yok';out.scrollTop=out.scrollHeight}
    const badge=$('#arduinoSerialBaudState');if(badge){badge.textContent='Program: '+(state?.programBaud||'—')+' · Monitör: '+baud;badge.dataset.mismatch=state?.programBaud&&state.programBaud!==baud?'1':'0'}
    refreshHC05Terminal();consoleTimer=setTimeout(refreshConsole,180);
  }
  function fillSerialPopupBoards(preferred){
    const select=$('#serialPopupBoard'),rows=boards();if(!select)return null;
    select.innerHTML=rows.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.arduinoProgramName||c.label||c.ref||'Arduino UNO R3')+'</option>').join('');
    const keep=preferred||serialPopupBoardId||currentBoardId;serialPopupBoardId=rows.some(c=>c.id===keep)?keep:rows[0]?.id||null;if(serialPopupBoardId)select.value=serialPopupBoardId;
    return rows.find(c=>c.id===serialPopupBoardId)||null;
  }
  function serialPopupBoard(){return boards().find(c=>c.id===serialPopupBoardId)||fillSerialPopupBoards()}
  function syncSerialLauncher(){const btn=$('#serialMonitorBtn'),rows=boards(),popup=$('#serialMonitorPopup');if(btn)btn.hidden=!rows.length;if(!rows.length){closeSerialMonitor();return}if(popup&&!popup.hidden)fillSerialPopupBoards(serialPopupBoardId)}
  function refreshSerialPopup(){
    clearTimeout(serialPopupTimer);const popup=$('#serialMonitorPopup');if(!popup||popup.hidden)return;
    const b=serialPopupBoard(),baud=Number($('#serialPopupBaud')?.value||9600),state=b?A.serialState?.(b,baud):null,out=$('#serialPopupConsole');
    if(out){out.textContent=state?.text||((editor()?.running?'Seri Monitör · çıktı bekleniyor':'Seri Monitör · simülasyon durdu'));out.scrollTop=out.scrollHeight}
    const badge=$('#serialPopupBaudState');if(badge){badge.textContent='Program: '+(state?.programBaud||'—')+' · Monitör: '+baud;badge.dataset.mismatch=state?.programBaud&&state.programBaud!==baud?'1':'0'}
    const run=$('#serialPopupRunState');if(run){run.textContent=editor()?.running?'SİMÜLASYON ÇALIŞIYOR':'SİMÜLASYON DURDU';run.dataset.running=editor()?.running?'1':'0'}
    serialPopupTimer=setTimeout(refreshSerialPopup,150);
  }
  function openSerialMonitor(boardId=null){const b=fillSerialPopupBoards(boardId);if(!b){editor()?.toast('Serial Monitor için çalışma alanına Arduino UNO R3 ekleyin.');return}$('#serialMonitorPopup').hidden=false;refreshSerialPopup()}
  function closeSerialMonitor(){clearTimeout(serialPopupTimer);serialPopupTimer=null;const popup=$('#serialMonitorPopup');if(popup)popup.hidden=true}
  function serialPopupSend(){const b=serialPopupBoard(),input=$('#serialPopupInput');if(!b||!input)return;const text=input.value,ending=$('#serialPopupEnding')?.value||'none',baud=Number($('#serialPopupBaud')?.value||9600);if(!text&&ending==='none')return;A.serialMonitorSend?.(b,text,ending,baud);input.value='';refreshSerialPopup()}
  function beginSerialPopupDrag(e){
    if(e.button!==0||e.target.closest('button,input,select'))return;const popup=$('#serialMonitorPopup');if(!popup)return;e.preventDefault();
    const r=popup.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;popup.style.right='auto';popup.style.bottom='auto';popup.style.left=r.left+'px';popup.style.top=r.top+'px';
    const move=ev=>{const maxX=Math.max(0,window.innerWidth-popup.offsetWidth),maxY=Math.max(0,window.innerHeight-popup.offsetHeight);popup.style.left=Math.max(0,Math.min(maxX,ev.clientX-dx))+'px';popup.style.top=Math.max(0,Math.min(maxY,ev.clientY-dy))+'px'};
    const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  }
  function serialSend(){
    const b=selectedBoard(),input=$('#arduinoSerialInput');if(!b||!input)return;const text=input.value,ending=$('#arduinoSerialEnding')?.value||'none',baud=Number($('#arduinoSerialBaud')?.value||9600);
    if(!text&&ending==='none')return;const r=A.serialMonitorSend?.(b,text,ending,baud);input.value='';status(r?.pending?'Seri veri kuyruğa alındı · simülasyonu başlatın':'Seri veri Arduino RX tamponuna gönderildi','ok');refreshConsole();
  }
  function virtualHc05Send(){
    const c=selectedHC05(),input=$('#hc05VirtualInput');if(!c||!input){status('HC-05 modülü seçili değil','error');return}
    const text=input.value;if(!text)return;const s=A.hc05State?.(c),n=A.hc05Receive?.(c,text,s?.baud||9600);input.value='';A.hc05SetConnected?.(c,true);bridgeStatus('Sanal eş cihaz bağlı','connected');status('HC-05 sanal eş cihazdan '+n+' bayt aldı','ok');refreshHC05Terminal();
  }
  async function bridgeWritePump(){
    if(!serialWriter||bridgeWriting||bridgeClosing)return;const c=bridgeHC05();if(!c)return;const baud=A.hc05State?.(c)?.baud||9600,bytes=A.hc05TakeTx?.(c,baud);if(!bytes?.length)return;
    bridgeWriting=true;try{await serialWriter.write(bytes)}catch(e){bridgeStatus('Yazma hatası: '+e.message,'error')}finally{bridgeWriting=false}
  }
  async function bridgeReadLoop(){
    if(!serialPort?.readable)return;try{serialReader=serialPort.readable.getReader();while(!bridgeClosing){const {value,done}=await serialReader.read();if(done)break;if(value?.length){const c=bridgeHC05();if(c)A.hc05Receive?.(c,value,A.hc05State?.(c)?.baud||9600)}}}
    catch(e){if(!bridgeClosing)bridgeStatus('Okuma hatası: '+e.message,'error')}finally{try{serialReader?.releaseLock()}catch{}serialReader=null}
  }
  async function pcConnect(){
    const c=fillHC05();if(!c){bridgeStatus('Önce HC-05 ekleyin','error');return}
    if(!root.navigator?.serial){bridgeStatus('Bu tarayıcı Web Serial desteklemiyor','error');status('PC Bluetooth/COM köprüsü için desteklenen Chrome/Edge ve güvenli bağlam gerekir.','error');return}
    try{
      bridgeClosing=false;bridgeModuleId=c.id;serialPort=await root.navigator.serial.requestPort();const baud=A.hc05State?.(c)?.baud||9600;await serialPort.open({baudRate:baud,bufferSize:255});
      serialWriter=serialPort.writable?.getWriter()||null;A.hc05SetConnected?.(c,true);$('#hc05PcConnect').disabled=true;$('#hc05PcDisconnect').disabled=false;$('#hc05BridgeModule').disabled=true;
      bridgeStatus('PC Bluetooth/COM bağlı · '+baud+' baud','connected');status('HC-05 dış dünya köprüsü açıldı','ok');bridgeTimer=root.setInterval?.(bridgeWritePump,45)||null;bridgeReadLoop();
    }catch(e){serialPort=null;serialWriter=null;const module=$('#hc05BridgeModule');if(module)module.disabled=false;bridgeStatus(e?.name==='NotFoundError'?'Bağlantı seçilmedi':'Bağlantı hatası: '+e.message,'error')}
  }
  async function pcDisconnect(reason='Bağlı değil',kind=''){
    if(typeof reason!=='string')reason='Bağlı değil';
    bridgeClosing=true;root.clearInterval?.(bridgeTimer);bridgeTimer=null;const c=bridgeHC05();try{await serialReader?.cancel()}catch{}try{serialReader?.releaseLock()}catch{}serialReader=null;
    try{serialWriter?.releaseLock()}catch{}serialWriter=null;try{await serialPort?.close()}catch{}serialPort=null;if(c)A.hc05SetConnected?.(c,false);
    const on=$('#hc05PcConnect'),off=$('#hc05PcDisconnect'),module=$('#hc05BridgeModule');if(on)on.disabled=false;if(off)off.disabled=true;if(module)module.disabled=false;bridgeStatus(reason,kind);bridgeModuleId=module?.value||null;bridgeClosing=false;
  }
  function open(boardId=null){
    const b=fillBoards(boardId);if(!b){editor()?.toast('Önce çalışma alanına Arduino UNO R3 ekleyin.');return}
    fillExamples();fillHC05();loadBoard(b);$('#arduinoIdeModal').hidden=false;$('#arduinoCode').focus();refreshConsole();
  }
  function close(){clearTimeout(consoleTimer);pcDisconnect();const m=$('#arduinoIdeModal');if(m)m.hidden=true}
  function restoreModal(){
    const modal=$('#modal');modal.classList.remove('arduino-save-prompt');$('#modalConfirm').textContent='Onayla';$('#modalCancel').textContent='İptal';modal.hidden=true;
  }
  function protectedNotice(){
    const modal=$('#modal');modal.classList.add('arduino-save-prompt');$('#modalTitle').textContent='Hazır Arduino örneği korunuyor';
    $('#modalBody').innerHTML='<p>Bu resmi örneği inceleyebilir, UNO karta yükleyebilir ve simülasyonda çalıştırabilirsiniz.</p><p>Programın içinde değişiklik yapmak veya değişiklikleri kaydetmek için önce <b>Farklı Kaydet</b> ile kendi çalışma kopyanızı oluşturun. Özgün Arduino örneği değişmeden kalır.</p>';
    $('#modalConfirm').textContent='Farklı Kaydet';$('#modalCancel').textContent='Örneği incele';modal.hidden=false;
    $('#modalCancel').onclick=restoreModal;$('#modalConfirm').onclick=()=>{restoreModal();requestSaveAs()};
  }
  function requestSaveAs(){
    const b=selectedBoard();if(!b)return;
    const modal=$('#modal'),meta=previewMeta||metaForBoard(b),base=$('#arduinoProgramName').value.trim()||meta?.title||'Arduino Programım';
    modal.classList.add('arduino-save-prompt');$('#modalTitle').textContent='Arduino programını farklı kaydet';
    $('#modalBody').innerHTML='<p>Yeni kopya düzenlenebilir olacaktır. Özgün örnek salt okunur kalır.</p><label>Program adı<input id="arduinoCopyName" maxlength="80" value="'+esc(base.replace(/ · Çalışma kopyam$/,'')+' · Çalışma kopyam')+'"></label>';
    $('#modalConfirm').textContent='Farklı Kaydet';$('#modalCancel').textContent='İptal';modal.hidden=false;$('#arduinoCopyName')?.focus();
    $('#modalCancel').onclick=restoreModal;
    $('#modalConfirm').onclick=()=>{const name=$('#arduinoCopyName')?.value.trim()||'Arduino Programım';restoreModal();createEditableCopy(name)};
  }
  function createEditableCopy(name){
    const b=selectedBoard(),E=editor();if(!b||!E)return;if(!E.snapshot())return;
    const source=previewMeta||metaForBoard(b),row=A.saveBoard(localStorage,{name,sketch:$('#arduinoCode').value,sourceExample:source?officialDescriptor(source):b.arduinoSourceExample||null});
    A.applySaved(b,row);previewMeta=null;$('#arduinoProgramName').value=row.name;setProtection(null);
    E.render(true);E.scheduleSave();E.renderLibrary();status('✓ Kopya kaydedildi · artık düzenleyebilirsiniz','ok');E.toast('Arduino programının düzenlenebilir kopyası oluşturuldu');
  }
  function verify(){
    const code=$('#arduinoCode').value,r=A.verify(code);
    if(r.ok){status('✓ Eğitim simülatörü kod yapısını doğruladı','ok');return true}
    if(previewMeta||metaForBoard(selectedBoard())){status('Resmi kod korundu · yerleşik eğitim simülatörü bu örneğin tüm C++ / kütüphane özelliklerini doğrulayamıyor.','warn');return false}
    status('Doğrulama hatası · '+r.message,'error');return false;
  }
  function upload(){
    const b=selectedBoard(),E=editor();if(!b||!E)return;
    const official=previewMeta||metaForBoard(b),check=A.verify($('#arduinoCode').value);
    if(!official&&!check.ok){status('Doğrulama hatası · '+check.message,'error');return}
    if(!E.snapshot())return;
    b.arduinoSketch=$('#arduinoCode').value;b.arduinoProgramName=$('#arduinoProgramName').value.trim()||official?.title||'Arduino Kartım';b.label=b.arduinoProgramName;
    if(official)b.arduinoOfficialExample=officialDescriptor(official);else delete b.arduinoOfficialExample;
    delete b._arduinoRuntime;delete b._arduinoError;previewMeta=official||null;setProtection(previewMeta);
    E.render(true);E.scheduleSave();E.renderLibrary();
    status(check.ok?'✓ Kod UNO karta yüklendi · SİMÜLE ET ile deneyebilirsiniz':'✓ Orijinal kod UNO karta yüklendi · bu örnek eğitim simülatöründe kısmi/referans modunda olabilir','ok');
    E.toast('Arduino sketch karta yüklendi');
  }
  function saveCurrent(){
    const b=selectedBoard(),E=editor();if(!b||!E)return;
    if(previewMeta||metaForBoard(b)){protectedNotice();return}
    if(!b.arduinoBoardId){requestSaveAs();return}
    const r=A.verify($('#arduinoCode').value);if(!r.ok){status('Kaydetmeden önce hata · '+r.message,'error');return}
    if(!E.snapshot())return;
    const row=A.saveBoard(localStorage,{id:b.arduinoBoardId,name:$('#arduinoProgramName').value,sketch:$('#arduinoCode').value,sourceExample:b.arduinoSourceExample||null});
    A.applySaved(b,row);E.render(true);E.scheduleSave();E.renderLibrary();status('✓ Program kaydedildi','ok');E.toast('Arduino programı kaydedildi');
  }
  function loadExampleCode(){
    const id=$('#arduinoExampleSelect').value,x=X?.byId?.[id];if(!x)return;currentExampleId=id;previewMeta=x;
    $('#arduinoCode').value=x.code;$('#arduinoProgramName').value=x.title;setProtection(x);updateLines();showExampleInfo(id);
    status('🔒 Resmi Arduino örneği açıldı · test/simülasyon serbest, düzenleme için Farklı Kaydet','ok');
  }
  function openExampleCircuit(){
    const id=$('#arduinoExampleSelect').value,x=X?.byId?.[id],E=editor();if(!x||!E)return;currentExampleId=id;
    if(project()?.workspaceMode!=='arduino'){loadExampleCode();status('Resmi kod açıldı. Hazır devre için Arduino Atölyesi’ni kullanın.','ok');return}
    const p=A.exampleProject(id,root.DTSProjects.uid());E.load(p);E.setAppearance('material');fillBoards();loadBoard(selectedBoard());showExampleInfo(id);E.scheduleSave();
    status('🔒 Resmi örnek devresi açıldı · program salt okunur, simülasyon kullanılabilir','ok');
  }
  function syncRunState(){
    const el=$('#arduinoIdeRunState'),E=editor();if(!el||!E)return;el.textContent=E.running?'Üst simülasyon: ÇALIŞIYOR':'Üst simülasyon: DURDU';el.dataset.running=E.running?'1':'0';
  }
  function interceptProtectedEdit(e){
    if(!(previewMeta||metaForBoard(selectedBoard())))return;
    const editKey=e.type==='paste'||e.type==='cut'||e.type==='drop'||(e.type==='keydown'&&(e.key.length===1||['Backspace','Delete','Enter'].includes(e.key)));
    if(!editKey)return;e.preventDefault();protectedNotice();
  }
  function init(){
    if(!A||!X)return;fillExamples();
    $('#arduinoIdeClose').onclick=close;$('#arduinoVerify').onclick=verify;$('#arduinoUpload').onclick=upload;
    $('#serialMonitorBtn').onclick=()=>openSerialMonitor();$('#serialPopupClose').onclick=closeSerialMonitor;
    $('#serialPopupBoard').onchange=e=>{serialPopupBoardId=e.target.value;refreshSerialPopup()};$('#serialPopupBaud').onchange=refreshSerialPopup;
    $('#serialPopupClear').onclick=()=>{const b=serialPopupBoard();if(b)A.serialClear?.(b);refreshSerialPopup()};
    $('#serialPopupSend').onclick=serialPopupSend;$('#serialPopupInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();serialPopupSend()}});
    $('#serialPopupHeader').addEventListener('pointerdown',beginSerialPopupDrag);
    $('#arduinoSaveProgram').onclick=saveCurrent;$('#arduinoSaveAsProgram').onclick=requestSaveAs;$('#arduinoLoadExample').onclick=loadExampleCode;$('#arduinoOpenExampleCircuit').onclick=openExampleCircuit;
    $('#arduinoSerialSend').onclick=serialSend;$('#arduinoSerialClear').onclick=()=>{const b=selectedBoard();if(b)A.serialClear?.(b);refreshConsole()};$('#arduinoSerialBaud').onchange=refreshConsole;
    $('#arduinoSerialInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();serialSend()}});
    $('#hc05VirtualSend').onclick=virtualHc05Send;$('#hc05VirtualInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();virtualHc05Send()}});
    $('#hc05PcConnect').onclick=pcConnect;$('#hc05PcDisconnect').onclick=pcDisconnect;$('#hc05BridgeModule').onchange=e=>{if(!serialPort)bridgeModuleId=e.target.value;refreshHC05Terminal()};
    root.navigator?.serial?.addEventListener?.('disconnect',e=>{if(serialPort&&(!e?.target||e.target===serialPort))pcDisconnect('PC Bluetooth/COM bağlantısı kesildi','error')});
    $('#arduinoBoardSelect').onchange=e=>{currentBoardId=e.target.value;loadBoard(selectedBoard())};$('#arduinoExampleSelect').onchange=e=>{currentExampleId=e.target.value;showExampleInfo(currentExampleId)};
    const code=$('#arduinoCode');code.addEventListener('input',updateLines);code.addEventListener('scroll',updateLines);for(const type of ['keydown','paste','cut','drop'])code.addEventListener(type,interceptProtectedEdit);
    $('#arduinoProgramName').addEventListener('keydown',interceptProtectedEdit);
    $('#arduinoIdeModal').addEventListener('pointerdown',e=>{if(e.target.id==='arduinoIdeModal')close()});
    document.addEventListener('keydown',e=>{if(!$('#arduinoIdeModal').hidden&&e.key==='Escape'){e.preventDefault();close()}});
    root.setInterval?.(syncRunState,400);showExampleInfo(currentExampleId);syncSerialLauncher();
  }
  root.DTSArduinoIDE={open,close,openSerialMonitor,closeSerialMonitor,refresh:()=>{fillBoards(currentBoardId);syncSerialLauncher();if(!$('#serialMonitorPopup')?.hidden)fillSerialPopupBoards(serialPopupBoardId)},loadBoard,protectedNotice,requestSaveAs,get officialExample(){return previewMeta||metaForBoard(selectedBoard())}};
  init();
})(typeof window==='undefined'?globalThis:window);
