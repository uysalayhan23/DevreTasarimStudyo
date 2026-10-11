#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),crypto=require('node:crypto'),zlib=require('node:zlib');
const {spawn,spawnSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..'),DIST=path.join(ROOT,'dist'),BUILD=path.join(ROOT,'build','mq05-ut200a-browser');
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
  components:p?.components?.map(c=>({id:c.id,typeId:c.typeId,state:!!c.state,active:!!c._active,closed:c._closed,probeTarget:c.probeTarget,clampedWireId:c.clampedWireId,clampT:c.clampT,jawOpen:!!c._clampJawOpen,candidate:c._clampCandidate||null,meterPosition:c.meterPosition,meter:c._meter,clamp:c._clamp})),
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
function probePointerEnd(body,tip,target){
 if(![body?.x,body?.y,tip?.x,tip?.y,target?.x,target?.y].every(Number.isFinite))
  throw Error('Probe drag screen geometry missing');
 return {x:body.x+(target.x-tip.x),y:body.y+(target.y-tip.y)};
}
async function dragProbeToTerminal(cdp,probeId,deviceId,terminalId){
 const probeSelector='#scene .component[data-id="'+probeId+'"]',
  deviceSelector='#scene .component[data-id="'+deviceId+'"]';
 const body=await coords(cdp,probeSelector+' .body');
 const tip=await coords(cdp,probeSelector+' [data-port="TIP"] .port');
 const terminal=await coords(cdp,deviceSelector+' [data-port="'+terminalId+'"] .port');
 const pointerEnd=probePointerEnd(body,tip,terminal);
 await drag(cdp,body,pointerEnd);
 return {probeId,deviceId,terminalId,body,tip,terminal,pointerEnd};
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

const {clampFixture}=require('./browser-mq05-live-v11920.cjs');
function freeClampFixture(){
 const f=JSON.parse(JSON.stringify(clampFixture)),device=f.components.find(c=>c.id==='cl');
 delete device.clampedWireId;delete device.clampT;
 device.meterPosition=0; // OFF while moving around an energized wire; prevents an unconnected-mode warning modal.
 return f;
}
async function ensureEditorVisible(cdp){
 const info=await evaluate(cdp,expression(()=>{
  const dashboard=document.querySelector('#dashboard');
  const viewport=document.querySelector('#viewport');
  const scene=document.querySelector('#scene');
  const clamp=scene?.querySelector('.component[data-id="cl"]');
  const wire=scene?.querySelector('[data-wire="w1"] .wire');
  const view=viewport?.getBoundingClientRect();
  const clampBox=clamp?.getBoundingClientRect();
  const wireBox=wire?.getBoundingClientRect();
  return {
   dashboardHidden:!!dashboard?.hidden,
   dashboardOpen:document.body.classList.contains('dashboard-open'),
   viewportHidden:!!viewport?.hidden,
   viewportVisible:!!viewport&&!!view&&view.width>100&&view.height>100,
   clampVisible:!!clampBox&&clampBox.width>1&&clampBox.height>1,
   wireVisible:!!wireBox&&wireBox.width>1&&wireBox.height>1,
   clampRect:clampBox?{x:clampBox.x,y:clampBox.y,width:clampBox.width,height:clampBox.height}:null,
   wireRect:wireBox?{x:wireBox.x,y:wireBox.y,width:wireBox.width,height:wireBox.height}:null
  };
 }));
 check(info.dashboardHidden&&!info.dashboardOpen&&!info.viewportHidden&&
  info.viewportVisible&&info.clampVisible&&info.wireVisible,
  'Circuit editor/UT200A/wire not visibly rendered: '+JSON.stringify(info));
 return info;
}
async function aimJaw(cdp){
 return evaluate(cdp,expression(()=>{
  const g=document.querySelector('#scene .component[data-id="cl"]');
  const wire=document.querySelector('#scene [data-wire="w1"] .wire');
  if(!g||!wire||!g.getScreenCTM()||!wire.getScreenCTM()||!wire.getTotalLength())return null;
  const body=g.querySelector('.body'),b=(body?.getBoundingClientRect().width>0&&body?.getBoundingClientRect().height>0)
   ?body.getBoundingClientRect():g.getBoundingClientRect();
  if(b.width<=1||b.height<=1)return null;
  // The SVG centre may be a movable <text> / [data-label-key]. Clicking it drags
  // the LABEL rather than starting beginClampDrag. Hit-test the graphic body.
  const fractions=[[.22,.5],[.78,.5],[.22,.35],[.78,.35],[.22,.65],[.78,.65],
    [.36,.23],[.64,.23],[.36,.78],[.64,.78],[.5,.87],[.5,.13]];
  const forbidden='[data-label-key],.port-group,[data-meter-position],[data-meter-action],[data-instrument-key],[data-note-owner],[data-wire],[data-junction]';
  let from=null,fromHit=null;
  for(const [fx,fy] of fractions){
   const x=b.left+b.width*fx,y=b.top+b.height*fy,node=document.elementFromPoint(x,y);
   if(!node||node.closest('.component')!==g||node.closest(forbidden)||
      ['text','tspan'].includes(node.tagName?.toLowerCase()))continue;
   from={x,y};fromHit={tag:node.tagName,fx,fy};break;
  }
  if(!from)return null;
  const w=wire.getPointAtLength(wire.getTotalLength()*.5);
  const p=new DOMPoint(w.x,w.y).matrixTransform(wire.getScreenCTM());
  const jaw=new DOMPoint(90,65).matrixTransform(g.getScreenCTM());
  const end={x:from.x+p.x-jaw.x,y:from.y+p.y-jaw.y};
  if(![from.x,from.y,p.x,p.y,jaw.x,jaw.y,end.x,end.y].every(Number.isFinite)||
     from.x<=0||from.y<=0||p.x<=0||p.y<=0)return null;
  return {from,fromHit,wire:{x:p.x,y:p.y},jaw:{x:jaw.x,y:jaw.y},end};
 }));
}
async function dragDiagnostics(cdp,point){
 return evaluate(cdp,expression(p=>{
  const q=document.elementFromPoint(p.x,p.y),hit=q?.closest?.('.component'),project=window.DTSEditor?.getProject?.(),
   c=project?.components?.find(v=>v.id==='cl');
  return {hitId:hit?.dataset?.id||null,hitTag:q?.tagName||null,
   labelKey:q?.closest?.('[data-label-key]')?.dataset?.labelKey||null,
   labelDragging:document.body.classList.contains('label-dragging'),
   selected:[...document.querySelectorAll('#scene .component.selected')].map(el=>el.dataset.id),
   gestureActive:document.body.classList.contains('canvas-gesture'),
   editable:!!window.DTSEditor?.guardEdit?.(),
   devicePosition:c?{x:c.x,y:c.y}:null,
   open:!!c?._clampJawOpen,candidate:c?._clampCandidate||null};
 },point));
}
async function inspectJaw(cdp){
 return evaluate(cdp,expression(()=>{
  const p=window.DTSEditor?.getProject?.(),c=p?.components?.find(c=>c.id==='cl');
  const g=document.querySelector('#scene .component[data-id="cl"]');
  const line=document.querySelector('#scene [data-wire="w1"] .wire');
  let distance=null;
  if(g&&line&&g.getScreenCTM()&&line.getScreenCTM()&&line.getTotalLength()>0){
   const jaw=new DOMPoint(90,65).matrixTransform(g.getScreenCTM());
   const n=Math.max(40,Math.ceil(line.getTotalLength()/5));
   let best=Infinity;
   for(let i=0;i<=n;i++){
    const v=line.getPointAtLength(line.getTotalLength()*i/n);
    const pt=new DOMPoint(v.x,v.y).matrixTransform(line.getScreenCTM());
    best=Math.min(best,Math.hypot(jaw.x-pt.x,jaw.y-pt.y));
   }
   distance=best;
  }
  return {jawOpen:!!c?._clampJawOpen,candidate:c?._clampCandidate||null,
   clampedWireId:c?.clampedWireId||null,clampT:c?.clampT??null,
   visualState:g?.dataset.clampJawState||null,
   visibleOpenMark:!!g?.querySelector('[data-clamp-jaw-state="open"]'),
   wireCount:p?.wires?.length,wireIds:p?.wires?.map(w=>w.id),
   distanceToWirePixels:distance,
   meterPosition:c?.meterPosition,clamp:c?._clamp||null,projectRunning:!!window.DTSEditor?.running};
 }));
}
async function runJaw(cdp,report){
 const p=freeClampFixture();
 await evaluate(cdp,expression(f=>{window.DTSStudio.load(f);return true},p));
 await sleep(150);
 report.states.editor=await ensureEditorVisible(cdp);
 await runSimulation(cdp);
 const before=await inspectJaw(cdp);
 check(before.projectRunning,'Real AC simulation did not start');
 check(!before.clampedWireId&&!before.jawOpen&&before.visualState==='closed','UT200A must begin unattached with closed jaws');
 check(before.wireCount===2,'UT200A clamp must not add wires to a load circuit');
 report.states.before=before;await shotEvidence(cdp,report,'jaw-before-drag');
 const geometry=await aimJaw(cdp);
 check(geometry?.end&&[geometry.from.x,geometry.from.y,geometry.end.x,geometry.end.y].every(Number.isFinite)&&geometry.from.x>0&&geometry.from.y>0,'Cannot locate visible jaw and live conductor in viewport');
 report.states.drag_geometry=geometry;
 // The component click selects its SVG first; test an actual second pointer gesture against the selected clamp.
 const initial=await dragDiagnostics(cdp,geometry.from);
 report.states.pointer_initial=initial;
 check(initial.hitId==='cl'&&initial.editable&&!initial.labelKey&&
   !['text','tspan'].includes(initial.hitTag?.toLowerCase()),
  'UT200A pointer must hit draggable body, not label/terminal: '+JSON.stringify(initial));
 await press(cdp,geometry.from);
 await release(cdp,geometry.from);
 await sleep(50);
 const selected=await dragDiagnostics(cdp,geometry.from);
 report.states.pointer_selected=selected;
 check(selected.selected.includes('cl')&&!selected.gestureActive,
  'UT200A was not selected before physical drag: '+JSON.stringify(selected));
 await press(cdp,geometry.from);
 const pressed=await dragDiagnostics(cdp,geometry.from);
 report.states.pointer_pressed=pressed;
 check(pressed.gestureActive&&!pressed.labelDragging,
  'UT200A device gesture did not start (check label/port interception): '+JSON.stringify(pressed));
 for(let i=1;i<=16;i++){
  await cdp.call('Input.dispatchMouseEvent',{type:'mouseMoved',
   x:geometry.from.x+(geometry.end.x-geometry.from.x)*i/16,
   y:geometry.from.y+(geometry.end.y-geometry.from.y)*i/16,buttons:1});
  if(i===8){report.states.pointer_mid_drag=await dragDiagnostics(cdp,geometry.from);}
 }
 await sleep(130);
 const pointerLast=await dragDiagnostics(cdp,geometry.end);
 report.states.pointer_last_drag=pointerLast;
 const opened=await inspectJaw(cdp);
 report.states.opened=opened;await shotEvidence(cdp,report,'jaw-open-over-live-wire');
 const pointerDelta=pointerLast.devicePosition&&initial.devicePosition?
  Math.hypot(pointerLast.devicePosition.x-initial.devicePosition.x,pointerLast.devicePosition.y-initial.devicePosition.y):0;
 report.states.pointer_actual_world_displacement=pointerDelta;
 check(pointerDelta>10&&pointerLast.gestureActive,
  'UT200A mouse move did not reach active clamp drag: '+JSON.stringify({
    initial,selected,pressed,mid:report.states.pointer_mid_drag,last:pointerLast,displacement:pointerDelta}));
 check(opened.jawOpen&&opened.visualState==='open'&&opened.visibleOpenMark,
  'UT200A jaws did not visibly open as they approached the AC conductor');
 check(opened.candidate?.wireId==='w1','Jaws must choose the intended live conductor before release');
 check(!opened.clampedWireId,'UT200A must not claim attachment before the mouse is released');
 await release(cdp,geometry.end);await sleep(170);
 const snapped=await inspectJaw(cdp);
 report.states.snapped=snapped;await shotEvidence(cdp,report,'jaw-snapped-closed');
 check(snapped.clampedWireId==='w1'&&Number.isFinite(snapped.clampT),
  'Physical UT200A drag did not snap onto the correct wire');
 check(!snapped.jawOpen&&snapped.visualState==='closed'&&!snapped.visibleOpenMark,
  'Jaws did not close after mouse release');
 check(Number.isFinite(snapped.distanceToWirePixels)&&snapped.distanceToWirePixels<=18,
  'Physical jaw and wire not coincident after snap: '+snapped.distanceToWirePixels);
 check(snapped.wireCount===2&&snapped.wireIds.join(',')==='w1,w2','Jaw snap altered electrical wiring');
 // Select the UT200A ACA range through its actual inspector UI rather than mutating the measurement result.
 const dial=await evaluate(cdp,expression(()=>{
  const el=document.querySelector('#instrumentSettings [data-thermal-param="meterPosition"]');
  if(!el)return {found:false};
  el.value='1';el.dispatchEvent(new Event('change',{bubbles:true}));
  return {found:true,selected:el.value};
 }));
 check(dial.found&&dial.selected==='1','UT200A ACA dial not available through the real inspector UI');
 await sleep(170);
 const measured=await inspectJaw(cdp);
 report.states.measured=measured;await shotEvidence(cdp,report,'jaw-current-ac-1a');
 check(measured.clampedWireId==='w1'&&!measured.jawOpen,'Clamp attachment lost after selecting ACA range');
 check(measured.meterPosition===1&&measured.clamp?.warning==='',
  'Clamp ACA meter must be free of warnings: '+JSON.stringify(measured.clamp));
 check(measured.clamp?.unit==='A'&&Math.abs(Number(measured.clamp?.value)-1)<.04,
  'UT200A display must read approximately 1.000 A, got '+JSON.stringify(measured.clamp));
 check(measured.projectRunning&&measured.wireCount===2,'Clamp must stay live and noninvasive');
 report.coverage={real_pointer_drag:true,opened_before_snap:true,opened_visual_evidence:true,
  snapped_to_w1:true,closed_after_release:true,near_wire_pixels:snapped.distanceToWirePixels,
  ac_current_1a:true,noninvasive_two_wires:true,range_switched_via_ui:true};
 await stopSimulation(cdp);
}
async function main(){
 fs.mkdirSync(BUILD,{recursive:true});
 const browser=findBrowser(),userData=fs.mkdtempSync(path.join(os.tmpdir(),'dts-ut200a-jaw-'));
 const {server,url}=await staticServer();
 const child=spawn(browser.cmd,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--hide-scrollbars','--remote-debugging-port=0','--user-data-dir='+userData,'--window-size=1440,1000','about:blank'],{stdio:'ignore'});
 let cdp;const report={schema:'dts-ut200a-physical-jaw-v1',started_at:new Date().toISOString(),
  browser:browser.version,states:{},screenshots:[],coverage:{},exceptions:[],status:'FAIL'};
 try{
  const port=Number((await waitForFile(path.join(userData,'DevToolsActivePort'))).split(/\r?\n/)[0]);
  cdp=new CDP((await pageTarget(port)).webSocketDebuggerUrl);await cdp.open();
  cdp.ws.addEventListener('message',e=>{try{const m=JSON.parse(String(e.data));if(m.method==='Runtime.exceptionThrown')report.exceptions.push(m.params?.exceptionDetails?.text||'Runtime exception')}catch{}});
  await cdp.call('Page.enable');await cdp.call('Runtime.enable');
  await cdp.call('Emulation.setDeviceMetricsOverride',{width:GOLDEN.viewport.width,height:GOLDEN.viewport.height,deviceScaleFactor:1,mobile:false});
  const load=cdp.wait('Page.loadEventFired',15000);await cdp.call('Page.navigate',{url});await load;
  const nav=await evaluate(cdp,expression(()=>({url:location.href,text:(document.body?.innerText||'').slice(0,200)})));
  check(!nav.url.startsWith('chrome-error://'),'Chromium navigation blocked: '+nav.text);
  await ensureReady(cdp);
  report.current_stage='ut200a_real_jaw_drag';await runJaw(cdp,report);
  check(report.exceptions.length===0,'Uncaught browser exception');
  check(report.screenshots.length===4,'Expected four real Chromium evidence screenshots');
  report.status='PASS';delete report.current_stage;report.finished_at=new Date().toISOString();
  fs.writeFileSync(path.join(BUILD,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log('[UT200A-JAW] PASS: 4 screenshots, real mouse snap and 1A');
 }catch(e){
  report.failure={message:e.message,stack:String(e.stack||e)};
  report.finished_at=new Date().toISOString();
  try{if(cdp)await shotEvidence(cdp,report,'jaw-failure-diagnostic')}catch{}
  fs.writeFileSync(path.join(BUILD,'report.json'),JSON.stringify(report,null,2)+'\n');
  throw e;
 }finally{
  try{await cdp?.call('Browser.close')}catch{}
  cdp?.close();child.kill('SIGKILL');await new Promise(resolve=>server.close(resolve));
  try{fs.rmSync(userData,{recursive:true,force:true})}catch{}
 }
}
if(require.main===module)main().catch(e=>{console.error('[UT200A-JAW]',e.stack||e.message);process.exitCode=1});
module.exports={freeClampFixture,runJaw,aimJaw,inspectJaw,ensureEditorVisible,dragDiagnostics};
