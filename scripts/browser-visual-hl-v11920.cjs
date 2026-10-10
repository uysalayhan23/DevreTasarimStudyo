#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const http=require('node:http');
const crypto=require('node:crypto');
const {spawn,spawnSync}=require('node:child_process');

const ROOT=path.resolve(__dirname,'..');
const DIST=path.join(ROOT,'dist');
const BUILD=path.join(ROOT,'build',process.env.DTS_HL_VISUAL==='1'?'browser-visual-hl':'browser-visual');
const GOLDEN=JSON.parse(fs.readFileSync(path.join(ROOT,'tests','browser-visual-golden-v11920.json'),'utf8'));

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function sha256(data){return crypto.createHash('sha256').update(data).digest('hex')}
function pngSize(data){
  if(!Buffer.isBuffer(data)||data.length<24||data.toString('ascii',1,4)!=='PNG')throw Error('Geçersiz PNG çıktısı.');
  return {width:data.readUInt32BE(16),height:data.readUInt32BE(20)};
}
function findBrowser(){
  const candidates=[process.env.CHROME_BIN,'google-chrome','google-chrome-stable','chromium','chromium-browser'].filter(Boolean);
  for(const cmd of candidates){
    const r=spawnSync(cmd,['--version'],{encoding:'utf8'});
    if(!r.error&&r.status===0)return {cmd,version:(r.stdout||r.stderr||'').trim()};
  }
  throw Error('Gerçek Chrome/Chromium bulunamadı. CHROME_BIN ayarlayın.');
}
function mime(file){
  const ext=path.extname(file).toLowerCase();
  return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'}[ext]||'application/octet-stream');
}
async function staticServer(){
  const server=http.createServer((req,res)=>{
    try{
      const raw=decodeURIComponent((req.url||'/').split('?')[0]);
      const rel=raw==='/'?'index.html':raw.replace(/^\/+/, '');
      const file=path.resolve(DIST,rel);
      if(file!==DIST&&!file.startsWith(DIST+path.sep))throw Error('path');
      if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return}
      res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});
      fs.createReadStream(file).pipe(res);
    }catch{res.writeHead(400);res.end('Bad request')}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
  const address=server.address();
  return {server,url:'http://127.0.0.1:'+address.port+'/index.html'};
}
async function waitForFile(file,timeout=12000){
  const started=Date.now();
  while(Date.now()-started<timeout){if(fs.existsSync(file)&&fs.statSync(file).size>0)return fs.readFileSync(file,'utf8');await sleep(50)}
  throw Error('Chrome DevToolsActivePort zaman aşımı.');
}
async function pageTarget(port,timeout=12000){
  const started=Date.now();
  while(Date.now()-started<timeout){
    try{
      const r=await fetch('http://127.0.0.1:'+port+'/json/list');
      const rows=await r.json(),page=rows.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);
      if(page)return page;
    }catch{}
    await sleep(50);
  }
  throw Error('Chrome sayfa hedefi bulunamadı.');
}
class CDP{
  constructor(url){this.url=url;this.ws=null;this.seq=0;this.pending=new Map();this.waiters=[]}
  async open(){
    if(typeof WebSocket!=='function')throw Error('Node WebSocket API bulunamadı.');
    this.ws=new WebSocket(this.url);
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('CDP websocket zaman aşımı.')),8000);
      this.ws.addEventListener('open',()=>{clearTimeout(timer);resolve()},{once:true});
      this.ws.addEventListener('error',()=>{clearTimeout(timer);reject(Error('CDP websocket açılamadı.'))},{once:true});
    });
    this.ws.addEventListener('message',e=>this._message(e.data));
  }
  _message(raw){
    const msg=JSON.parse(String(raw));
    if(msg.id){
      const p=this.pending.get(msg.id);if(!p)return;this.pending.delete(msg.id);
      if(msg.error)p.reject(Error(msg.error.message||'CDP error'));else p.resolve(msg.result||{});
      return;
    }
    for(const w of [...this.waiters])if(w.method===msg.method){
      this.waiters.splice(this.waiters.indexOf(w),1);clearTimeout(w.timer);w.resolve(msg.params||{});
    }
  }
  call(method,params={}){
    const id=++this.seq;
    return new Promise((resolve,reject)=>{
      this.pending.set(id,{resolve,reject});
      this.ws.send(JSON.stringify({id,method,params}));
    });
  }
  wait(method,timeout=10000){
    return new Promise((resolve,reject)=>{
      const w={method,resolve,reject,timer:setTimeout(()=>{this.waiters=this.waiters.filter(x=>x!==w);reject(Error('CDP event zaman aşımı: '+method))},timeout)};
      this.waiters.push(w);
    });
  }
  close(){try{this.ws?.close()}catch{}}
}
async function evaluate(cdp,expression){
  const r=await cdp.call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});
  if(r.exceptionDetails)throw Error('Browser JS exception: '+(r.exceptionDetails.text||r.exceptionDetails.exception?.description||'unknown'));
  return r.result?.value;
}
async function shot(cdp,name){
  const r=await cdp.call('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
  const data=Buffer.from(r.data,'base64'),size=pngSize(data);
  if(size.width!==GOLDEN.viewport.width||size.height!==GOLDEN.viewport.height)throw Error(name+' screenshot boyutu yanlış: '+size.width+'x'+size.height);
  if(data.length<10000)throw Error(name+' screenshot beklenenden küçük.');
  fs.mkdirSync(BUILD,{recursive:true});
  const file=path.join(BUILD,name+'.png');fs.writeFileSync(file,data);
  return {file:path.relative(ROOT,file).replace(/\\/g,'/'),bytes:data.length,sha256:sha256(data),...size};
}
function assert(cond,msg){if(!cond)throw Error(msg)}
function validateCards(info){
  assert(info.cards.length>=GOLDEN.dashboard.minCards,'Dashboard kart sayısı yetersiz: '+info.cards.length);
  for(const c of info.cards){
    assert(c.width>=GOLDEN.dashboard.minCardWidth,'Dashboard kartı çok dar: '+c.width);
    assert(c.height>=GOLDEN.dashboard.minCardHeight,'Dashboard kartı çok kısa: '+c.height);
  }
}
async function main(){
  fs.mkdirSync(BUILD,{recursive:true});
  const browser=findBrowser(),userData=fs.mkdtempSync(path.join(os.tmpdir(),'dts-browser-'));
  const {server,url}=await staticServer();
  const args=[
    '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
    '--hide-scrollbars','--remote-debugging-port=0','--user-data-dir='+userData,
    '--window-size='+GOLDEN.viewport.width+','+GOLDEN.viewport.height,'about:blank'
  ];
  const child=spawn(browser.cmd,args,{stdio:['ignore','ignore','ignore']});
  let cdp;
  const report={browser,viewport:GOLDEN.viewport,states:{},exceptions:[]};
  try{
    const active=await waitForFile(path.join(userData,'DevToolsActivePort'));
    const port=Number(active.split(/\r?\n/)[0]);assert(Number.isFinite(port),'DevTools port geçersiz.');
    const target=await pageTarget(port);cdp=new CDP(target.webSocketDebuggerUrl);await cdp.open();
    cdp.ws.addEventListener('message',e=>{
      try{
        const m=JSON.parse(String(e.data));
        if(m.method==='Runtime.exceptionThrown')report.exceptions.push(m.params?.exceptionDetails?.exception?.description||m.params?.exceptionDetails?.text||'Runtime exception');
      }catch{}
    });
    await cdp.call('Page.enable');await cdp.call('Runtime.enable');
    await cdp.call('Emulation.setDeviceMetricsOverride',{width:GOLDEN.viewport.width,height:GOLDEN.viewport.height,deviceScaleFactor:1,mobile:false});
    const loaded=cdp.wait('Page.loadEventFired',15000);await cdp.call('Page.navigate',{url});await loaded;
    const ready=await evaluate(cdp,`(async()=>{for(let i=0;i<240;i++){if(window.DTSStudio&&window.DTSEditor){try{if(window.DTSStudio.ready)await window.DTSStudio.ready}catch{}return true}await new Promise(r=>setTimeout(r,50))}return false})()`);
    assert(ready,'Uygulama gerçek tarayıcıda hazır olmadı.');
    await evaluate(cdp,`(()=>{document.querySelector('#safetyAcknowledge')?.click();return true})()`);
    await sleep(100);

    const dashboard=await evaluate(cdp,`(()=>{const rect=e=>{const r=e.getBoundingClientRect();return{width:r.width,height:r.height,x:r.x,y:r.y}};return{hidden:document.querySelector('#dashboard')?.hidden,fault:!!document.querySelector('.dashboard-startup-fault'),tutorial:!!document.querySelector('[data-open-tutorial]'),cards:[...document.querySelectorAll('.design-card')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0}).map(rect),version:document.querySelector('.dashboard-version')?.textContent||''}})()`);
    assert(dashboard.hidden===false,'Dashboard görünür değil.');assert(!dashboard.fault,'Dashboard startup fault var.');assert(dashboard.tutorial,'Öğretici kartı yok.');validateCards(dashboard);
    report.states.dashboard={geometry:dashboard,screenshot:await shot(cdp,'dashboard')};

    await evaluate(cdp,`(()=>{window.DTSStudio.load({version:window.DTSProjects.CURRENT_VERSION||7,projectId:'browser-control',workspaceMode:'control',name:'Browser Smoke',symbolNorm:'IEC',components:[{id:'r1',typeId:'resistor',x:400,y:300,ref:'R1',label:'1 kΩ',resistance:1000}],wires:[],junctions:[],colorRoles:{}});return true})()`);
    await sleep(100);
    const editor=await evaluate(cdp,`(()=>{const v=document.querySelector('#viewport'),r=v.getBoundingClientRect();return{dashboardHidden:document.querySelector('#dashboard')?.hidden,viewportHidden:v.hidden,width:r.width,height:r.height,mode:window.DTSEditor.getProject().workspaceMode,components:window.DTSEditor.getProject().components.length,svgBytes:document.querySelector('#workspace')?.innerHTML.length||0}})()`);
    assert(editor.dashboardHidden===true&&!editor.viewportHidden,'Editör görünürlük durumu yanlış.');assert(editor.mode==='control','Editör modu control değil.');assert(editor.width>=GOLDEN.editor.minWidth&&editor.height>=GOLDEN.editor.minHeight,'Editör viewport çok küçük.');assert(editor.components===1&&editor.svgBytes>500,'Editör gerçek içerik çizmedi.');
    report.states.editor={geometry:editor,screenshot:await shot(cdp,'editor')};

    await evaluate(cdp,`(()=>{window.DTSStudio.load({version:window.DTSProjects.CURRENT_VERSION||7,projectId:'browser-panel',workspaceMode:'panel',name:'Browser Panel',components:[],wires:[],junctions:[],panel:window.DTSPanel.defaults(),colorRoles:{}});return true})()`);
    await sleep(100);
    const panel=await evaluate(cdp,`(()=>{const p=document.querySelector('#panelWorkspace'),r=p.getBoundingClientRect();return{hidden:p.hidden,width:r.width,height:r.height,mode:window.DTSEditor.getProject().workspaceMode,viewportHidden:document.querySelector('#viewport')?.hidden,htmlBytes:p.innerHTML.length}})()`);
    assert(panel.hidden===false&&panel.viewportHidden===true,'Pano çalışma alanı görünür değil.');assert(panel.mode==='panel','Pano modu etkin değil.');assert(panel.width>=GOLDEN.panel.minWidth&&panel.height>=GOLDEN.panel.minHeight,'Pano viewport çok küçük.');assert(panel.htmlBytes>500,'Pano gerçek içerik çizmedi.');
    report.states.panel={geometry:panel,screenshot:await shot(cdp,'panel')};

    await evaluate(cdp,`(async()=>{await window.DTSStudio.home();document.querySelector('[data-open-tutorial]')?.click();return true})()`);
    let topicCount=0;
    for(let i=0;i<150;i++){
      const state=await evaluate(cdp,`(()=>({topics:document.querySelectorAll('#tutorialTopicGrid .tutorial-topic-card').length,text:document.querySelector('#tutorialTopicGrid')?.textContent||''}))()`);
      topicCount=state.topics;
      if(topicCount>=GOLDEN.tutorial.minTopics)break;
      if(/yüklenemedi/i.test(state.text))throw Error('Öğretici lazy-load başarısız: '+state.text.trim());
      await sleep(100);
    }
    const tutorial=await evaluate(cdp,`(()=>{const p=document.querySelector('#tutorialDashboard'),r=p.getBoundingClientRect();return{hidden:p.hidden,width:r.width,height:r.height,topics:document.querySelectorAll('#tutorialTopicGrid .tutorial-topic-card').length,dashboardHidden:document.querySelector('#dashboard')?.hidden}})()`);
    assert(tutorial.hidden===false&&tutorial.dashboardHidden===false,'Öğretici dashboard görünür değil.');assert(tutorial.topics>=GOLDEN.tutorial.minTopics,'Öğretici konu sayısı yetersiz: '+tutorial.topics);assert(tutorial.width>=GOLDEN.tutorial.minWidth&&tutorial.height>=GOLDEN.tutorial.minHeight,'Öğretici alanı çok küçük.');
    report.states.tutorial={geometry:tutorial,screenshot:await shot(cdp,'tutorial')};
    // H-L 64 actual Chrome lesson openings: view, live drawing and coach rendering.\n    if(process.env.DTS_HL_VISUAL==='1'){
    const hlTopics=['commutator','two-way','intermediate','bells','control-combinations','loop-420','loop-powered','active-passive','pnp-npn','inductive-capacitive','source-sink','open-collector','bero','motor-forward-reverse','motor-star-delta','dual-dc'];
    report.states.hlLessons={checked:0,items:[]};
    for(const topic of hlTopics)for(let n=1;n<=4;n++){
      const id=topic+'-'+n;
      await evaluate(cdp,`(()=>{const b=[...document.querySelectorAll('[data-tutorial-open]')].find(x=>x.dataset.tutorialOpen==='${id}');if(!b)throw Error('Lesson button missing: ${id}');b.click();return true})()`);
      await sleep(160);
      const details=await evaluate(cdp,`(()=>{
        const p=window.DTSEditor?.getProject?.(),v=document.querySelector('#viewport'),w=document.querySelector('#workspace'),coach=document.querySelector('#tutorialCoach');
        const vr=v?.getBoundingClientRect(),cr=coach?.getBoundingClientRect();
        return {id:p?.tutorialLesson?.id,components:p?.components?.length||0,wires:p?.wires?.length||0,svgBytes:w?.innerHTML?.length||0,viewportVisible:!!v&&!v.hidden&&vr.width>400&&vr.height>250,coachExists:!!coach,coachVisible:!!coach&&!coach.hidden&&cr.width>100&&cr.height>100,coachChars:coach?.textContent?.trim()?.length||0}
      })()`);
      assert(details.id===id,'Lesson opened wrong project: '+id+' -> '+details.id);
      assert(details.components>0&&details.wires>0,'Missing lesson schematic: '+id);
      assert(details.viewportVisible&&details.svgBytes>500,'Lesson diagram not rendered: '+id);
      // Explicitly reopen a user-hidden coach before checking its visual content.
      if(!details.coachVisible){
        await evaluate(cdp,`(()=>{document.querySelector('#tutorialCoachReopen')?.click();return true})()`);
        await sleep(70);
      }
      const coach=await evaluate(cdp,`(()=>{const p=document.querySelector('#tutorialCoach'),r=p?.getBoundingClientRect();return {visible:!!p&&!p.hidden&&r.width>100&&r.height>100,text:p?.textContent?.trim()?.length||0}})()`);
      assert(coach.visible&&coach.text>60,'Tutorial coach not rendered: '+id);
      const screen=await shot(cdp,'hl-'+id);
      report.states.hlLessons.items.push({id,...details,coach,screenshot:screen});
      report.states.hlLessons.checked++;
      await evaluate(cdp,`(async()=>{await window.DTSStudio.home();await window.DTSTutorialBootstrap.ensure();await window.DTSTutorialMode.openHub();return true})()`);
      await sleep(80);
    }
    assert(report.states.hlLessons.checked===64,'H-L lesson count mismatch');\n    }


    assert(report.exceptions.length===0,'Tarayıcı runtime exception: '+report.exceptions.join(' | '));
    fs.writeFileSync(path.join(BUILD,'report.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  }finally{
    try{await cdp?.call('Browser.close')}catch{}
    cdp?.close();child.kill('SIGKILL');await new Promise(r=>server.close(r));
    try{fs.rmSync(userData,{recursive:true,force:true})}catch{}
  }
}
if(require.main===module)main().catch(e=>{console.error('[BROWSER-VISUAL]',e.stack||e.message);process.exit(1)});
module.exports={pngSize,findBrowser,validateCards};
