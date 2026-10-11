#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto'),zlib=require('node:zlib');
const {spawn,spawnSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..'),DIST=path.join(ROOT,'dist'),BUILD=path.join(ROOT,'build','mq05-browser');
const GOLDEN=JSON.parse(fs.readFileSync(path.join(ROOT,'tests','browser-visual-golden-v11920.json'),'utf8'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function sha256(data){return crypto.createHash('sha256').update(data).digest('hex')}
function pngCrc(data){
 let crc=0xffffffff;
 for(const byte of data){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^(crc&1?0xedb88320:0)}
 return (crc^0xffffffff)>>>0;
}
function pngSize(data){
 const sig=Buffer.from([137,80,78,71,13,10,26,10]);
 if(!Buffer.isBuffer(data)||!data.subarray(0,8).equals(sig))throw Error('PNG signature invalid');
 let offset=8,width=0,height=0,bitDepth=0,colorType=-1,interlace=0,ihdr=false,idat=false,idatClosed=false,iend=false,plte=false;
 const parts=[];
 while(offset+12<=data.length){
  const len=data.readUInt32BE(offset),end=offset+12+len;
  if(end>data.length)throw Error('PNG chunk truncated');
  const type=data.toString('ascii',offset+4,offset+8),payload=data.subarray(offset+8,offset+8+len);
  const actual=data.readUInt32BE(offset+8+len),expected=pngCrc(data.subarray(offset+4,offset+8+len));
  if(actual!==expected)throw Error('PNG chunk CRC invalid: '+type);
  if(!ihdr){
   if(type!=='IHDR'||len!==13)throw Error('PNG IHDR invalid');
   width=payload.readUInt32BE(0);height=payload.readUInt32BE(4);
   bitDepth=payload[8];colorType=payload[9];interlace=payload[12];
   const depths={0:[1,2,4,8,16],2:[8,16],3:[1,2,4,8],4:[8,16],6:[8,16]};
   if(!width||!height||!depths[colorType]?.includes(bitDepth)||payload[10]!==0||payload[11]!==0||interlace>1)
    throw Error('PNG IHDR dimensions or color encoding invalid');
   ihdr=true;
  }else if(type==='PLTE'){
   if(idat||plte||colorType===0||colorType===4||len===0||len>768||len%3!==0||(colorType===3&&len>3*(1<<bitDepth)))
    throw Error('PNG PLTE invalid');
   plte=true;
  }else if(type==='IDAT'){
   if(colorType===3&&!plte)throw Error('PNG indexed palette missing');
   if(idatClosed)throw Error('PNG nonconsecutive IDAT');
   idat=true;
   if(len)parts.push(payload); // PNG permits zero-length IDAT chunks.
  }else if(type==='IEND'){
   if(len!==0||!idat||end!==data.length)throw Error('PNG IEND/IDAT invalid');
   iend=true;break;
  }else if(type==='IHDR')throw Error('Duplicate IHDR');
  else if(!/^[A-Za-z]{4}$/.test(type)||type[0]===type[0].toUpperCase())throw Error('PNG unknown critical chunk: '+type);
  if(idat&&type!=='IDAT')idatClosed=true;
  offset=end;
 }
 if(!ihdr||!idat||!iend||!parts.length)throw Error('PNG missing image data or required chunks');
 const channels={0:1,2:3,3:1,4:2,6:4}[colorType],bitsPerPixel=channels*bitDepth;
 const passes=interlace===0?[[0,0,1,1]]:[
  [0,0,8,8],[4,0,8,8],[0,4,4,8],[2,0,4,4],[0,2,2,4],[1,0,2,2],[0,1,1,2]];
 const rows=[];
 let expectedLength=0;
 for(const [x,y,dx,dy] of passes){
  const w=x<width?Math.ceil((width-x)/dx):0,h=y<height?Math.ceil((height-y)/dy):0;
  if(w&&h){
   const stride=Math.ceil(w*bitsPerPixel/8);
   expectedLength+=(stride+1)*h;
   rows.push({stride,count:h});
  }
 }
 if(expectedLength>64*1024*1024)throw Error('PNG scanlines exceed screenshot safety limit');
 let inflated;
 try{inflated=zlib.inflateSync(Buffer.concat(parts),{maxOutputLength:expectedLength+1})}
 catch(e){throw Error('PNG IDAT compressed data invalid: '+e.message)}
 if(inflated.length!==expectedLength)throw Error('PNG scanline length invalid');
 let pos=0;
 for(const {stride,count} of rows)for(let i=0;i<count;i++){
  if(inflated[pos]>4)throw Error('PNG scanline filter invalid');
  pos+=stride+1;
 }
 return {width,height};
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
  let r;
  try{r=await cdp.call('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false})}
  catch(e){throw Error('Screenshot capture failed ['+name+']: '+(e?.message||e))}
  const data=Buffer.from(r.data,'base64');
  fs.mkdirSync(BUILD,{recursive:true});
  try{
    const size=pngSize(data);
    if(size.width!==GOLDEN.viewport.width||size.height!==GOLDEN.viewport.height)throw Error(name+' screenshot boyutu yanlış: '+size.width+'x'+size.height);
    if(data.length<10000)throw Error(name+' screenshot beklenenden küçük.');
    const file=path.join(BUILD,name+'.png');fs.writeFileSync(file,data);
    return {file:path.relative(ROOT,file).replace(/\\/g,'/'),bytes:data.length,sha256:sha256(data),...size};
  }catch(e){
    const raw=path.join(BUILD,name+'.invalid.png');
    fs.writeFileSync(raw,data);
    throw Error('Screenshot validation failed ['+name+']: '+e.message+' (raw '+path.relative(ROOT,raw).replace(/\\/g,'/')+', bytes='+data.length+', sha256='+sha256(data)+')');
  }
}


function check(ok,msg){if(!ok)throw Error(msg)}
const expression=(fn,...args)=>'('+fn.toString()+')('+args.map(x=>JSON.stringify(x)).join(',')+')';
async function read(cdp){return evaluate(cdp,expression(()=>{
 const p=window.DTSEditor?.getProject?.();
 return {name:p?.name,running:!!window.DTSEditor?.running,
  components:p?.components?.map(c=>({id:c.id,typeId:c.typeId,state:!!c.state,active:!!c._active,closed:c._closed,probeTarget:c.probeTarget,clampedWireId:c.clampedWireId,meter:c._meter,clamp:c._clamp})),
  wires:p?.wires?.map(w=>({id:w.id,active:!!w._flowActive,direction:w._flowDirection,mode:w._flowMode,certainty:w._flowCertainty,classes:document.querySelector('[data-wire="'+w.id+'"] .wire')?.getAttribute('class')})),
  overlays:document.querySelectorAll('.measurement-overlay .component').length,
  status:document.querySelector('#statusText')?.textContent};
}))}
const pick=(s,id)=>s.components?.find(c=>c.id===id);
async function shotEvidence(cdp,report,name){
 const saved=await shot(cdp,name);report.screenshots.push({step:name,...saved});return saved;
}
async function coords(cdp,selector){
 const point=await evaluate(cdp,expression(sel=>{
  const el=document.querySelector(sel);if(!el)return null;
  const rect=el.getBoundingClientRect();
  return rect.width&&rect.height?{x:rect.left+rect.width/2,y:rect.top+rect.height/2}:null;
 },selector));
 check(point&&point.x>0&&point.y>0,'Visible pointer target missing: '+selector);
 return point;
}
async function press(cdp,p){
 await cdp.call('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x,y:p.y});
 await cdp.call('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});
}
async function release(cdp,p){await cdp.call('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',clickCount:1})}
async function drag(cdp,from,to){
 await press(cdp,from);
 for(let i=1;i<=14;i++)await cdp.call('Input.dispatchMouseEvent',{type:'mouseMoved',x:from.x+(to.x-from.x)*i/14,y:from.y+(to.y-from.y)*i/14,buttons:1});
 await release(cdp,to);
}
async function ensureReady(cdp){
 const bootstrap=await evaluate(cdp,expression(async()=>{if(!window.DTSTutorialBootstrap?.ensure)return false;await window.DTSTutorialBootstrap.ensure();return !!window.DTSTutorialMode}));
 check(bootstrap,'Tutorial lazy module did not initialize');
 const ready=await evaluate(cdp,expression(async()=>{
  for(let n=0;n<240;n++){if(window.DTSStudio&&window.DTSEditor&&window.CCSSimulation&&window.DTSTutorialMode){
   try{if(window.DTSStudio.ready)await window.DTSStudio.ready}catch{}return true
  }await new Promise(r=>setTimeout(r,50))}return false
 }));
 check(ready,'Real application was not ready in Chromium');
 await evaluate(cdp,expression(()=>{document.querySelector('#safetyAcknowledge')?.click();return true}));
}
async function runSimulation(cdp){
 const active=await evaluate(cdp,expression(()=>{const b=document.querySelector('#simulateBtn');if(!b)throw Error('Simulation button missing');b.click();return !!window.DTSEditor?.running}));
 check(active,'Simulation did not activate by UI button');
 await sleep(170);
}
async function stopSimulation(cdp){
 await evaluate(cdp,expression(()=>{if(window.DTSEditor?.running)document.querySelector('#simulateBtn')?.click();return true}));
}
async function seal(cdp,report){
 await evaluate(cdp,expression(async()=>{await window.DTSTutorialMode.open('seal-in-1');return true}));
 await sleep(220);
 let s=await read(cdp);check(pick(s,'start')&&pick(s,'stop')&&pick(s,'coil'),'Canonical seal-in circuit unavailable');
 await runSimulation(cdp);
 s=await read(cdp);check(!pick(s,'coil').active,'Seal-in must start OFF');
 report.states.seal_off=s;await shotEvidence(cdp,report,'seal-off');
 const start=await coords(cdp,'#scene .component[data-id="start"] .body');
 await press(cdp,start);await sleep(160);
 s=await read(cdp);check(pick(s,'coil').active,'START press did not energize coil');
 report.states.seal_start=s;await shotEvidence(cdp,report,'seal-start');
 await release(cdp,start);await sleep(160);
 s=await read(cdp);check(pick(s,'coil').active,'Coil did not latch after START release');
 report.states.seal_latch=s;await shotEvidence(cdp,report,'seal-latched');
 const stop=await coords(cdp,'#scene .component[data-id="stop"] .body');
 await press(cdp,stop);await sleep(160);
 s=await read(cdp);check(!pick(s,'coil').active,'STOP failed to release coil');
 report.states.seal_stop=s;await shotEvidence(cdp,report,'seal-stop');
 await release(cdp,stop);
 report.coverage.seal_in={start_pressed:true,start_released_latched:true,stop_deenergizes:true,real_mouse_events:true};
 await stopSimulation(cdp);
}
const meterFixture={version:7,workspaceMode:'control',name:'MQ05 Probe QA',components:[
 {id:'g',typeId:'supply-dc-plus',x:180,y:160,ref:'G1'},
 {id:'r',typeId:'resistor',x:540,y:330,ref:'R1',resistance:120},
 {id:'m',typeId:'unit-ut33d-plus',x:760,y:210,ref:'M1',meterPosition:4},
 {id:'red',typeId:'test-probe-red',x:850,y:500,ref:'PR',probeFor:'m'},
 {id:'black',typeId:'test-probe-black',x:850,y:615,ref:'PB',probeFor:'m'}
],wires:[
 {id:'w1',from:{c:'g',p:'P'},to:{c:'r',p:'1'},color:'#e53935',role:'DC+',points:[]},
 {id:'w2',from:{c:'r',p:'2'},to:{c:'g',p:'M'},color:'#111827',role:'0V',points:[]},
 {id:'pr',from:{c:'m',p:'V'},to:{c:'red',p:'PLUG'},color:'#e53935',role:'MEASURE',points:[]},
 {id:'pb',from:{c:'m',p:'COM'},to:{c:'black',p:'PLUG'},color:'#111827',role:'MEASURE',points:[]}
],junctions:[],colorRoles:{}};
async function probe(cdp,report){
 await evaluate(cdp,expression(p=>{window.DTSEditor.load(p);return true},meterFixture));
 await sleep(150);await runSimulation(cdp);
 let s=await read(cdp);
 check(!pick(s,'red')?.probeTarget&&!pick(s,'black')?.probeTarget,'Red and black probes must start free');
 const count=s.wires.length;report.states.probe_free=s;await shotEvidence(cdp,report,'probe-free');
 const blackFrom=await coords(cdp,'#scene .component[data-id="black"] .body');
 const blackTo=await coords(cdp,'#scene .component[data-id="g"] [data-port="M"] .port');
 await drag(cdp,blackFrom,blackTo);await sleep(160);
 s=await read(cdp);check(!!pick(s,'black')?.probeTarget,'Real pointer drag did not attach black probe');
 report.states.probe_black_attached=s;await shotEvidence(cdp,report,'probe-black-attached');
 const from=await coords(cdp,'#scene .component[data-id="red"] .body'),to=await coords(cdp,'#scene .component[data-id="g"] [data-port="P"] .port');
 await drag(cdp,from,to);await sleep(160);
 s=await read(cdp);const m=pick(s,'m');
 check(!!pick(s,'red')?.probeTarget,'Real pointer drag did not attach red probe');
 check(!!pick(s,'black')?.probeTarget,'Black probe lost contact');
 check(s.wires.length===count,'Probe drag rewired circuit');
 check(m?.meter?.warning==='','Multimeter warning: '+String(m?.meter?.warning));
 check(Math.abs(Number(m?.meter?.value)-24)<1,'Multimeter expected 24 V, got '+JSON.stringify(m?.meter));
 check(s.overlays>=3,'Probe overlay or multimeter not visible');
 report.states.probe_attached=s;await shotEvidence(cdp,report,'probe-voltage');
 report.coverage.probes={free_then_attached:true,both_free_then_attached:true,real_pointer_drag:true,real_pointer_drags:2,wires_unchanged:true};
 report.coverage.multimeter={model:'UT33D+',dc_24v:true,red_black_physical_probes:true,display:m.meter.display};
 await stopSimulation(cdp);
}
const clampFixture={version:7,workspaceMode:'control',name:'MQ05 UT200A QA',components:[
 {id:'g',typeId:'supply-1p',x:180,y:150,ref:'G1'},
 {id:'r',typeId:'resistor',x:540,y:320,ref:'R1',resistance:230},
 {id:'cl',typeId:'unit-ut200a',x:670,y:420,ref:'P1',meterPosition:1,clampedWireId:'w1',clampT:.5}
],wires:[
 {id:'w1',from:{c:'g',p:'L'},to:{c:'r',p:'1'},color:'#e53935',role:'L1',points:[]},
 {id:'w2',from:{c:'r',p:'2'},to:{c:'g',p:'N'},color:'#1e88e5',role:'N',points:[]}
],junctions:[],colorRoles:{}};
async function clamp(cdp,report){
 await evaluate(cdp,expression(p=>{window.DTSEditor.load(p);return true},clampFixture));
 await sleep(150);await runSimulation(cdp);
 const s=await read(cdp),c=pick(s,'cl');
 check(c?.clampedWireId==='w1','Clamp jaws not attached to intended wire');
 check(c?.clamp?.warning==='','UT200A warning: '+c?.clamp?.warning);
 check(c?.clamp?.unit==='A'&&Math.abs(Number(c?.clamp?.value)-1)<.04,'UT200A AC current must read about 1 A');
 check(s.wires.length===2,'Noninvasive clamp cannot split conductor');
 report.states.clamp_ac=s;await shotEvidence(cdp,report,'ut200a-1a');
 report.coverage.ut200a={ac_1a:true,noninvasive:true,display:c.clamp.display};
 await stopSimulation(cdp);
}
const dcFixture={version:7,workspaceMode:'control',name:'MQ05 Signed Flow',components:[
 {id:'g',typeId:'supply-dc-plus',x:190,y:140,ref:'G1'},
 {id:'r',typeId:'resistor',x:550,y:335,ref:'R1',resistance:120}
],wires:[
 {id:'reverse',from:{c:'r',p:'1'},to:{c:'g',p:'P'},color:'#e53935',role:'DC+',points:[]},
 {id:'return',from:{c:'r',p:'2'},to:{c:'g',p:'M'},color:'#111827',role:'0V',points:[]}
],junctions:[],colorRoles:{}};
async function flow(cdp,report){
 await evaluate(cdp,expression(p=>{window.DTSEditor.load(p);return true},dcFixture));
 await sleep(140);await runSimulation(cdp);
 const s=await read(cdp),reverse=s.wires.find(w=>w.id==='reverse');
 check(reverse?.mode==='dc'&&reverse?.direction===-1&&reverse?.certainty==='exact','DC wire must retain signed reverse direction');
 check((reverse.classes||'').includes('flow-reverse'),'Real rendered wire lacks reverse flow class');
 const ac=report.states.seal_latch?.wires?.some(w=>w.mode==='ac'&&w.active&&(w.classes||'').includes('flow-ac'));
 check(ac,'Rendered AC current flow was not detected in seal-in');
 const ambiguous=report.states.seal_start?.wires?.some(w=>w.certainty==='ambiguous');
 check(ambiguous,'Parallel AC paths should be direction-ambiguous while START is pressed');
 report.states.flow_reverse=s;await shotEvidence(cdp,report,'dc-reverse-flow');
 report.coverage.flow={dc_reverse:true,rendered_reverse:true,ac_in_seal_in:true,ac_ambiguous_parallel:true};
 await stopSimulation(cdp);
}
async function main(){
 fs.mkdirSync(BUILD,{recursive:true});
 const browser=findBrowser(),userData=fs.mkdtempSync(path.join(os.tmpdir(),'dts-mq05-'));
 const {server,url}=await staticServer();
 const child=spawn(browser.cmd,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--remote-debugging-port=0','--user-data-dir='+userData,'--window-size=1440,1000','about:blank'],{stdio:'ignore'});
 let cdp;
 const report={schema:'dts-mq05-chromium-v1',started_at:new Date().toISOString(),browser:browser.version,states:{},coverage:{},screenshots:[],exceptions:[],tests:{},status:'FAIL'};
 try{
  const port=Number((await waitForFile(path.join(userData,'DevToolsActivePort'))).split(/\r?\n/)[0]);
  cdp=new CDP((await pageTarget(port)).webSocketDebuggerUrl);await cdp.open();
  cdp.ws.addEventListener('message',e=>{try{const m=JSON.parse(String(e.data));if(m.method==='Runtime.exceptionThrown')report.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception')}catch{}});
  await cdp.call('Page.enable');await cdp.call('Runtime.enable');
  await cdp.call('Emulation.setDeviceMetricsOverride',{width:GOLDEN.viewport.width,height:GOLDEN.viewport.height,deviceScaleFactor:1,mobile:false});
  const load=cdp.wait('Page.loadEventFired',15000);await cdp.call('Page.navigate',{url});await load;
  const nav=await evaluate(cdp,expression(()=>({url:location.href,text:(document.body?.innerText||'').slice(0,200)})));
  check(!nav.url.startsWith('chrome-error://'),'Chromium blocked test URL: '+nav.text);
  await ensureReady(cdp);
  for(const [name,run] of [['seal_in',seal],['probes_and_multimeter',probe],['ut200a',clamp],['ac_dc_flow',flow]]){
   report.current_stage=name;console.log('[MQ-05] '+name);
   try{await run(cdp,report);report.tests[name]='PASS'}catch(e){
    report.tests[name]='FAIL';
    try{await shotEvidence(cdp,report,'failure-'+name)}catch{}
    throw e;
   }
  }
  check(report.exceptions.length===0,'Uncaught browser exceptions: '+report.exceptions.join(' | '));
  check(report.screenshots.length>=8&&Object.values(report.tests).every(x=>x==='PASS')&&Object.keys(report.tests).length===4,'Insufficient Chromium coverage');
  report.status='PASS';delete report.current_stage;
  report.finished_at=new Date().toISOString();fs.writeFileSync(path.join(BUILD,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log('[MQ-05] PASS '+report.screenshots.length+' screenshots');
 }catch(e){
  report.status='FAIL';report.failure={message:e.message,stack:String(e.stack||e)};
  report.finished_at=new Date().toISOString();fs.writeFileSync(path.join(BUILD,'report.json'),JSON.stringify(report,null,2)+'\n');
  throw e;
 }finally{
  try{await cdp?.call('Browser.close')}catch{}
  cdp?.close();child.kill('SIGKILL');await new Promise(resolve=>server.close(resolve));
  try{fs.rmSync(userData,{recursive:true,force:true})}catch{}
 }
}
if(require.main===module)main().catch(e=>{console.error('[MQ05]',e.stack||e.message);process.exitCode=1});
module.exports={meterFixture,clampFixture,dcFixture,read,seal,probe,clamp,flow};
