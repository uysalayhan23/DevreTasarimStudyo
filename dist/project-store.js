(function(root){
  'use strict';
  const uid=()=> 'dts-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
  const filename=name=>(String(name||'Yeni Proje').replace(/[<>:"/\\|?*\u0000-\u001f]/g,'_').replace(/[. ]+$/,'').slice(0,100)||'Yeni Proje')+'.odsdevre';
  const CURRENT_VERSION=7,MIN_SUPPORTED_VERSION=5,LEGACY_BASELINE_VERSION=5;
  const WORKSPACE_ALIASES=Object.freeze({installation:'building',tesisat:'building',cabinet:'panel',pano:'panel','arduino-workshop':'arduino',kumanda:'control'});
  function canonicalShape(p){
    if(!p||typeof p!=='object'||Array.isArray(p))return p;
    const recognizable=Array.isArray(p.components)||Array.isArray(p.wires)||Array.isArray(p.devices)||Array.isArray(p.connections)||!!p.panel;
    if(!recognizable)return JSON.parse(JSON.stringify(p));
    const q=JSON.parse(JSON.stringify(p));
    if(!Array.isArray(q.components))q.components=Array.isArray(q.devices)?q.devices:[];
    if(!Array.isArray(q.wires))q.wires=Array.isArray(q.connections)?q.connections:[];
    if(!Array.isArray(q.junctions))q.junctions=[];
    delete q.devices;delete q.connections;
    for(const c of q.components){
      if(!c||typeof c!=='object')continue;
      if(c.typeId===undefined&&typeof c.type==='string')c.typeId=c.type;
      if(c.id!==undefined&&typeof c.id!=='string')c.id=String(c.id);
    }
    for(const j of q.junctions)if(j&&j.id!==undefined&&typeof j.id!=='string')j.id=String(j.id);
    for(const w of q.wires){
      if(!w||typeof w!=='object')continue;
      if(w.id!==undefined&&typeof w.id!=='string')w.id=String(w.id);
      for(const end of [w.from,w.to])if(end&&typeof end==='object'){if(end.c!==undefined&&typeof end.c!=='string')end.c=String(end.c);if(end.j!==undefined&&typeof end.j!=='string')end.j=String(end.j)}
    }
    return q;
  }
  function normalizeWorkspace(q){
    if(WORKSPACE_ALIASES[q.workspaceMode])q.workspaceMode=WORKSPACE_ALIASES[q.workspaceMode];
    if(!q.workspaceMode)q.workspaceMode=q.panel?'panel':q.components.some(c=>/^arduino-/i.test(c?.typeId||''))?'arduino':'control';
    return q;
  }
  const migrations=Object.freeze({
    5:q=>{if(!Array.isArray(q.junctions))q.junctions=[];q.version=6;return q},
    6:q=>{normalizeWorkspace(q);q.version=7;return q}
  });
  function migrationPath(version){
    const start=Number(version);if(!Number.isInteger(start))return [];
    const path=[];for(let v=start;v<CURRENT_VERSION;v++){if(typeof migrations[v]!=='function')break;path.push(v+'→'+(v+1))}
    return path;
  }
  function migrate(p){
    const q=canonicalShape(p);
    if(!q||typeof q!=='object'||Array.isArray(q))return q;
    const recognizable=Array.isArray(q.components)||Array.isArray(q.wires)||!!q.panel;
    if(!recognizable)return q;
    let version=q.version===undefined||q.version===null?LEGACY_BASELINE_VERSION:Number(q.version);
    if(!Number.isInteger(version))throw Error('Proje şema sürümü geçersiz.');
    if(version<MIN_SUPPORTED_VERSION)throw Error('Bu proje şema sürümü artık desteklenmiyor: v'+version+'.');
    if(version>CURRENT_VERSION)throw Error('Bu proje daha yeni bir Devre Tasarım Stüdyosu sürümüyle kaydedilmiş: v'+version+'.');
    q.version=version;
    while(version<CURRENT_VERSION){
      const step=migrations[version];if(typeof step!=='function')throw Error('Eksik proje migration adımı: v'+version+'→v'+(version+1)+'.');
      step(q);if(Number(q.version)!==version+1)throw Error('Geçersiz proje migration sonucu: v'+version+'.');
      version=q.version;
    }
    normalizeWorkspace(q);
    return q;
  }
  // MQ-P1-016: legacy saved tutorial projects are user-owned files.
  // Detect the former PNP +24V / 1k pull-up branch, but NEVER rewrite it on load.
  function legacyCollectorPullup(project){
    if(!Array.isArray(project?.components)||!Array.isArray(project?.wires))return false;
    const byId=new Map(project.components.filter(c=>c&&typeof c==='object').map(c=>[c.id,c]));
    if(byId.get('g1')?.typeId!=='supply-dc-plus'||
      byId.get('s')?.typeId!=='proximity'||
      byId.get('h')?.typeId!=='lamp-green'||
      byId.get('r')?.typeId!=='resistor'||
      Number(byId.get('r')?.resistance)!==1000)return false;
    const same=(a,id,pin)=>a?.c===id&&a?.p===pin;
    const connected=(a,ap,b,bp)=>project.wires.some(w=>
      (same(w?.from,a,ap)&&same(w?.to,b,bp))||
      (same(w?.to,a,ap)&&same(w?.from,b,bp)));
    return connected('g1','P','r','1')&&connected('r','2','s','BK')&&
      connected('s','BK','h','X1')&&connected('h','X2','g1','M')&&
      connected('g1','P','s','BN')&&connected('s','BU','g1','M');
  }
  function compatibilityWarnings(project){
    if(!legacyCollectorPullup(project))return [];
    return [{
      code:'MQ-P1-016-LEGACY-PNP-PULLUP',
      message:'Eski PNP sensör devresinde 1 kΩ R1, +24 V ile BK arasındadır; sensör kapalıyken göstergeye istenmeyen akım yolu oluşturabilir. Kaydınız değiştirilmedi. Düzeltilmiş örnek için Öğretici Modu > Open Collector > 3. uygulamayı açın.'
    }];
  }
  function normalizeLegacy(p){return migrate(p)}
  function validate(p){
    if(!p||typeof p!=='object'||!Array.isArray(p.components)||!Array.isArray(p.wires)||!p.components.every(c=>c&&typeof c.id==='string'&&typeof c.typeId==='string')||!p.wires.every(w=>w&&w.from&&w.to))throw Error('Bu dosya geçerli bir Devre Tasarım Stüdyosu projesi değil.');
    const ids=new Set();for(const c of p.components){if(ids.has(c.id)||['x','y','rotation'].some(k=>c[k]!==undefined&&(!Number.isFinite(Number(c[k]))||Math.abs(Number(c[k]))>100000)))throw Error('Projedeki eleman kimliği veya konumu geçersiz.');ids.add(c.id)}
    if(p.junctions!==undefined&&(!Array.isArray(p.junctions)||p.junctions.some(j=>!j||typeof j.id!=='string'||!Number.isFinite(j.x)||!Number.isFinite(j.y))))throw Error('Projedeki kablo birleşim noktaları geçersiz.');
    if(p.components.length>10000||p.wires.length>40000)throw Error('Bu proje eğitim çalışma alanı için çok büyük.');return p;
  }
  function parse(text){if(text.length>20*1024*1024)throw Error('Proje dosyası 20 MB sınırını aşıyor.');return validate(migrate(JSON.parse(text)))}
  async function readProjectFile(file){
    if(file?.size>20*1024*1024)throw Error('Proje dosyası 20 MB sınırını aşıyor.');
    return parse(await file.text());
  }
  function clean(p){return JSON.parse(JSON.stringify(p,(k,v)=>k.startsWith('_')?undefined:v))}
  const isProtected=p=>!!(p?.defaultTemplate?.id&&p.defaultTemplate.readOnly===true);
  function editableCopy(project){const p=clean(project);p.projectId=uid();if(isProtected(p)){p.sourceExample=p.defaultTemplate.id;p.name=(p.name||'Örnek')+' · Çalışma kopyam';delete p.defaultTemplate}return p}
  function create({storage=root.localStorage,indexedDB=root.indexedDB,env=root}={}){
    let dbPromise=null,directory=null,readOnlyFiles=null,permissionNeeded=false;const handles=new Map();
    const readIndex=()=>{try{const rows=JSON.parse(storage.getItem('dts-project-index')||'[]');return Array.isArray(rows)?rows:[]}catch{return []}};
    const readFolderIndex=()=>{try{const row=JSON.parse(storage.getItem('dts-folder-index')||'null');return row&&row.folderName===directory?.name&&Array.isArray(row.entries)?row.entries:[]}catch{return []}};
    const writeFolderIndex=entries=>{try{storage.setItem('dts-folder-index',JSON.stringify({folderName:directory?.name||'',entries:entries.map(e=>({key:e.key,name:e.name,lastModified:e.lastModified||0,cached:true,project:{projectId:e.project?.projectId||'',name:e.project?.name||e.name,workspaceMode:e.project?.workspaceMode||'control',updatedAt:e.project?.updatedAt||''}}))}))}catch{}};
    const openDB=()=>{if(!indexedDB)return Promise.resolve(null);if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('dts-projects',1);r.onupgradeneeded=()=>r.result.createObjectStore('objects');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}).catch(()=>null);return dbPromise};
    async function db(action,key,value){const database=await openDB();if(!database)return null;return new Promise((resolve,reject)=>{const tx=database.transaction('objects',action==='get'?'readonly':'readwrite'),store=tx.objectStore('objects'),r=action==='get'?store.get(key):action==='delete'?store.delete(key):store.put(value,key);let result;r.onsuccess=()=>{result=r.result};tx.oncomplete=()=>resolve(action==='get'?result:true);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Kayıt tamamlanamadı.'))})}
    function metadata(p){return {id:p.projectId,name:p.name||'Adsız proje',workspaceMode:p.workspaceMode||'control',updatedAt:p.updatedAt||new Date().toISOString(),count:p.workspaceMode==='panel'?(p.panel?.items?.length||0):p.components.length}}
    async function put(project){
      if(isProtected(project))return clean(project);
      validate(project);if(!project.projectId)project.projectId=uid();project.updatedAt=new Date().toISOString();const copy=clean(project);
      const persisted=await db('put','project:'+copy.projectId,copy);if(!persisted)storage.setItem('dts-project:'+copy.projectId,JSON.stringify(copy));
      const rows=readIndex().filter(r=>r.id!==copy.projectId);rows.unshift(metadata(copy));storage.setItem('dts-project-index',JSON.stringify(rows));return copy;
    }
    async function get(id){const value=await db('get','project:'+id);if(value)return validate(migrate(value));const raw=storage.getItem('dts-project:'+id);if(raw)return parse(raw);const legacy=storage.getItem('ods-project');if(legacy){try{const p=parse(legacy);if(p.projectId===id)return p}catch{}}return null}
    async function removeDraft(id){await db('delete','project:'+id);storage.removeItem?.('dts-project:'+id);storage.setItem('dts-project-index',JSON.stringify(readIndex().filter(r=>r.id!==id)))}
    async function permission(handle,mode='read',request=false){if(!handle?.queryPermission)return true;if(await handle.queryPermission({mode})==='granted')return true;return !!(request&&await handle.requestPermission({mode})==='granted')}
    async function restoreFolder(){directory=await db('get','directory');if(!directory)return false;permissionNeeded=!await permission(directory);return !permissionNeeded}
    async function chooseFolder(){
      if(!env.showDirectoryPicker)return {fallback:true};
      try{directory=await env.showDirectoryPicker({id:'dts-project-folder',mode:'readwrite'});readOnlyFiles=null;permissionNeeded=false;try{storage.setItem('dts-folder-index','[]')}catch{}await db('put','directory',directory);return {name:directory.name}}catch(e){if(e.name==='AbortError')return {cancelled:true};throw e}
    }
    function useFolderFiles(files){readOnlyFiles=[...files].filter(f=>/\.(odsdevre|dtsproj|json)$/i.test(f.name));directory=null;permissionNeeded=false;return readOnlyFiles.length}
    async function scan(request=false){
      const entries=[],warnings=[];
      if(directory){permissionNeeded=!await permission(directory,'read',request);if(permissionNeeded)return {entries:readFolderIndex(),warnings,permissionNeeded:true};
        for await(const [name,handle] of directory.entries())if(handle.kind==='file'&&/\.(odsdevre|dtsproj|json)$/i.test(name)){
          try{const file=await handle.getFile();entries.push({key:name,name,project:await readProjectFile(file),handle,lastModified:file.lastModified})}catch(e){warnings.push(name+': '+e.message)}
        }
      }else if(readOnlyFiles){for(const file of readOnlyFiles)try{entries.push({key:file.webkitRelativePath||file.name,name:file.name,project:await readProjectFile(file),handle:null,lastModified:file.lastModified})}catch(e){warnings.push(file.name+': '+e.message)}}
      entries.sort((a,b)=>(a.project.name||a.name).localeCompare(b.project.name||b.name,'tr',{numeric:true}));if(directory)writeFolderIndex(entries);return {entries,warnings,permissionNeeded:false};
    }
    async function remember(project,handle,lastModified){if(!project.projectId)project.projectId=uid();if(handle){const data={handle,lastModified};handles.set(project.projectId,data);await db('put','handle:'+project.projectId,data)}}
    async function readEntry(entry,request=false){
      if(!entry)throw Error('Proje kaydı bulunamadı.');
      let handle=entry.handle||null;
      if(!handle&&entry.cached&&directory){
        if(!await permission(directory,'read',request))throw Error('Proje klasörünü açmak için izin gerekli.');
        handle=await directory.getFileHandle(entry.name);
      }
      if(handle&&!await permission(handle,'read',request))throw Error('Proje dosyasını açmak için izin gerekli.');
      const file=handle?await handle.getFile():null,p=file?await readProjectFile(file):validate(migrate(clean(entry.project)));
      if(!p.projectId)p.projectId=uid();await remember(p,handle,file?.lastModified||entry.lastModified);return p
    }
    async function openFile(){
      if(!env.showOpenFilePicker)return {fallback:true};
      try{const [handle]=await env.showOpenFilePicker({id:'dts-open-project',types:[{description:'Devre projesi',accept:{'application/json':['.odsdevre','.dtsproj','.json']}}]});const file=await handle.getFile(),p=await readProjectFile(file);await remember(p,handle,file.lastModified);return {project:p}}catch(e){if(e.name==='AbortError')return {cancelled:true};throw e}
    }
    function download(project){const blob=new env.Blob([JSON.stringify(clean(project),null,2)],{type:'application/json'}),a=env.document.createElement('a');a.href=env.URL.createObjectURL(blob);a.download=filename(project.name);a.click();env.setTimeout(()=>env.URL.revokeObjectURL(a.href),1000);return {download:true,name:a.download}}
    async function save(project,{saveAs=false}={}){
      validate(project);if(isProtected(project)&&!saveAs)throw Error('Hazır örnek korunuyor. Düzenlemek için önce Farklı Kaydet ile kendi kopyanızı oluşturun.');
      if(!project.projectId)project.projectId=uid();const copy=saveAs?editableCopy(project):clean(project);copy.updatedAt=new Date().toISOString();
      let existing=handles.get(project.projectId),handle;
      try{
        // Save As opens its picker before any IndexedDB work loses the user gesture.
        if(saveAs&&env.showSaveFilePicker)handle=await env.showSaveFilePicker({id:'dts-save-project',suggestedName:filename(copy.name),types:[{description:'Devre projesi',accept:{'application/json':['.odsdevre']}}],...(directory?{startIn:directory}:{})});
        if(!handle&&!saveAs){existing=existing||await db('get','handle:'+project.projectId);handle=existing?.handle}
        if(!handle&&directory&&!saveAs){
          if(!await permission(directory,'readwrite',true))throw Error('Klasöre yazma izni verilmedi.');
          let name=filename(copy.name),n=2;
          while(true){try{await directory.getFileHandle(name);name=filename(copy.name+' ('+(n++)+')')}catch(e){if(e.name!=='NotFoundError')throw e;break}}
          handle=await directory.getFileHandle(name,{create:true});
        }
        if(!handle&&env.showSaveFilePicker)handle=await env.showSaveFilePicker({id:'dts-save-project',suggestedName:filename(copy.name),types:[{description:'Devre projesi',accept:{'application/json':['.odsdevre']}}]});
        if(!handle){const result=download(copy);await put(copy);return {...result,project:copy,requiresOpen:saveAs}}
        if(!await permission(handle,'readwrite',true))throw Error('Dosyaya yazma izni verilmedi.');
        // A copy must never replace a bundled example, even if chosen in Save As.
        const target=await handle.getFile();let targetProject;
        // An existing invalid or oversized target is user data, never a blank new file.
        // Do not silently overwrite it after a failed parse or allocate an oversized read.
        if(target.size!==0){
          try{targetProject=await readProjectFile(target)}
          catch(e){throw Error('Hedef proje dosyası geçersiz veya okunamadı; üzerine yazılmadı: '+e.message)}
        }
        if(isProtected(targetProject))throw Error('Bu dosya korunan bir hazır örnek. Farklı bir dosya adı veya klasör seçin.');
        if(saveAs){
          existing=existing||await db('get','handle:'+project.projectId);
          if(existing?.handle&&(handle===existing.handle||await handle.isSameEntry?.(existing.handle)))
            throw Error(isProtected(project)?'Özgün örneğin üzerine kaydedilemez. Farklı bir dosya seçin.':'Farklı Kaydet özgün proje dosyasının üzerine yazamaz. Başka bir dosya seçin.');
        }
        if(existing&&!saveAs){const current=await handle.getFile();if(current.lastModified!==existing.lastModified)throw Error('Dosya başka bir uygulamada değişmiş. Üzerine yazılmadı; Farklı kaydet ile bir kopya kaydedin.')}
        const writable=await handle.createWritable();try{await writable.write(JSON.stringify(copy,null,2));await writable.close()}catch(e){try{await writable.abort()}catch{}throw e}
        const saved=await handle.getFile();await remember(copy,handle,saved.lastModified);await put(copy);return {saved:true,name:handle.name,project:copy};
      }catch(e){if(e.name==='AbortError')return {cancelled:true};throw e}
    }
    return {put,get,list:readIndex,removeDraft,restoreFolder,chooseFolder,useFolderFiles,scan,readEntry,openFile,remember,save,download,get folderName(){return directory?.name||(readOnlyFiles?.[0]?.webkitRelativePath||'').split('/')[0]||''},get permissionNeeded(){return permissionNeeded}};
  }
  const api={CURRENT_VERSION,MIN_SUPPORTED_VERSION,LEGACY_BASELINE_VERSION,migrations,migrationPath,migrate,create,parse,validate,normalizeLegacy,clean,uid,filename,isProtected,editableCopy,legacyCollectorPullup,compatibilityWarnings};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSProjects=api;
})(typeof window==='undefined'?globalThis:window);
