// Small deterministic DOM adapter for exercising the real app's event handlers.
// This does not implement browser layout or replace Windows browser verification.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const decode=s=>String(s).replace(/&(amp|lt|gt|quot|#39);/g,(_,k)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[k]));
class Events{
  constructor(){this.listeners={}}
  addEventListener(type,fn,options){(this.listeners[type]||=[]).push({fn,capture:options===true||!!options?.capture})}
  removeEventListener(type,fn){this.listeners[type]=(this.listeners[type]||[]).filter(x=>x.fn!==fn)}
  emit(type,extra={}){
    const e={type,target:this,button:0,buttons:1,pointerType:'mouse',pointerId:1,clientX:0,clientY:0,key:'',...extra,preventDefault(){this.defaultPrevented=true},stopPropagation(){this.stopped=true},stopImmediatePropagation(){this.immediate=this.stopped=true}};
    const route=[];for(let n=this;n;n=n.parentNode)route.push(n);
    const deliver=(node,capture)=>{e.currentTarget=node;for(const l of [...(node.listeners[type]||[])]){if(l.capture===capture)l.fn(e);if(e.immediate)break}if(!capture&&!e.immediate)node['on'+type]?.(e)};
    for(const node of [...route].reverse()){deliver(node,true);if(e.stopped)return e}
    for(const node of route){deliver(node,false);if(e.stopped)break}return e;
  }
}
const voids=new Set(['input','meta','link','img','br','hr','source','area','embed','wbr']);
class Node extends Events{
  constructor(tag,doc){super();this.tagName=tag.toUpperCase();this.ownerDocument=doc;this.attrs={};this.children=[];this.style={};this.hidden=false;this.disabled=false;this.checked=false;this.clientWidth=1200;this.clientHeight=800;this.isContentEditable=false;
    this.dataset=new Proxy({},{get:(_,k)=>this.attrs['data-'+String(k).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]});
    const values=()=>new Set((this.attrs.class||'').split(/\s+/).filter(Boolean));
    this.classList={contains:c=>values().has(c),add:(...cs)=>{this.attrs.class=[...new Set([...values(),...cs])].join(' ')},remove:(...cs)=>{this.attrs.class=[...values()].filter(c=>!cs.includes(c)).join(' ')},toggle:(c,force)=>{const on=force===undefined?!values().has(c):!!force;on?this.classList.add(c):this.classList.remove(c);return on}};
  }
  setAttribute(k,v){this.attrs[k]=String(v);if(k==='hidden')this.hidden=true;if(k==='disabled')this.disabled=true;if(k==='checked')this.checked=true;if(k==='contenteditable')this.isContentEditable=v!=='false'}
  getAttribute(k){return this.attrs[k]??null}
  removeAttribute(k){delete this.attrs[k]}
  get id(){return this.attrs.id}set id(v){this.attrs.id=v}
  get value(){return this._value??this.attrs.value??(this.tagName==='SELECT'?(this.querySelector('option[selected]')||this.querySelector('option'))?.value||'':this.tagName==='OPTION'?this.textContent:'')}
  set value(v){this._value=String(v)}
  get textContent(){return this.tagName==='#TEXT'?this.text||'':this.children.map(n=>n.textContent).join('')}
  set textContent(v){this.children=[];if(v!==''){const n=new Node('#text',this.ownerDocument);n.text=String(v);this.appendChild(n)}}
  get innerHTML(){return this.children.map(n=>n.outerHTML).join('')}
  set innerHTML(value){for(const c of this.children)c.parentNode=null;this.children=[];parse(String(value),this)}
  get outerHTML(){return this.tagName==='#TEXT'?this.textContent:'<'+this.tagName.toLowerCase()+Object.entries(this.attrs).map(([k,v])=>' '+k+'="'+v+'"').join('')+'>'+this.innerHTML+'</'+this.tagName.toLowerCase()+'>'}
  set outerHTML(value){const parent=this.parentNode;if(!parent)return;const shell=new Node('fragment',this.ownerDocument);parse(value,shell);const at=parent.children.indexOf(this);parent.children.splice(at,1,...shell.children);for(const child of shell.children)child.parentNode=parent;this.parentNode=null}
  appendChild(n){n.remove();n.parentNode=this;this.children.push(n);return n}
  insertBefore(n,ref){if(!ref)return this.appendChild(n);n.remove();n.parentNode=this;const at=this.children.indexOf(ref);this.children.splice(at<0?this.children.length:at,0,n);return n}
  remove(){if(this.parentNode?.children)this.parentNode.children=this.parentNode.children.filter(n=>n!==this);this.parentNode=null}
  replaceWith(n){const parent=this.parentNode;if(!parent)return;n.remove();const at=parent.children.indexOf(this);parent.children[at]=n;n.parentNode=parent;this.parentNode=null}
  insertAdjacentHTML(position,value){if(position!=='beforeend')throw Error(position);parse(value,this)}
  contains(n){for(;n;n=n.parentNode)if(n===this)return true;return false}
  matches(selector){return selector.split(',').some(part=>{const pieces=part.trim().split(/\s+/);let n=this;if(!simple(n,pieces.pop()))return false;while(pieces.length){const p=pieces.pop();do{n=n.parentNode}while(n&&!simple(n,p));if(!n)return false}return true})}
  closest(selector){for(let n=this;n instanceof Node;n=n.parentNode)if(n.matches(selector))return n;return null}
  querySelectorAll(selector){const found=[];const walk=n=>{for(const child of n.children){if(child.matches(selector))found.push(child);walk(child)}};walk(this);return found}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null}
  focus(){this.ownerDocument.activeElement=this}
  blur(){this.ownerDocument.activeElement=this.ownerDocument.body}
  click(){this.emit('click',{buttons:0})}
  getBoundingClientRect(){return {x:0,y:0,left:0,top:0,width:this.clientWidth,height:this.clientHeight,right:this.clientWidth,bottom:this.clientHeight}}
  setPointerCapture(id){this.capture=id}hasPointerCapture(id){return this.capture===id}releasePointerCapture(){this.capture=null}
}
function simple(n,s){
  if(!(n instanceof Node)||n.tagName==='#TEXT')return false;
  const tag=s.match(/^[a-z][\w-]*/i)?.[0];if(tag&&n.tagName!==tag.toUpperCase())return false;
  for(const m of s.matchAll(/#([\w-]+)|\.([\w-]+)|\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g)){
    if(m[1]&&n.id!==m[1]||m[2]&&!n.classList.contains(m[2])||m[3]&&!(m[3] in n.attrs)||m[4]!==undefined&&n.attrs[m[3]]!==m[4])return false;
  }return true;
}
function parse(html,parent){
  const stack=[parent];for(const token of html.matchAll(/<!--[\s\S]*?-->|<![^>]*>|<[^>]*>|[^<]+/g)){
    const s=token[0];if(s.startsWith('<!'))continue;
    if(s.startsWith('</')){const tag=s.slice(2,-1).trim().toUpperCase();for(let i=stack.length-1;i>0;i--)if(stack[i].tagName===tag){stack.length=i;break}continue}
    if(s.startsWith('<')){
      const tag=s.match(/^<([\w:-]+)/)?.[1];if(!tag)continue;const n=new Node(tag,parent.ownerDocument);
      for(const a of s.slice(tag.length+1).matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))n.setAttribute(a[1],decode(a[2]??a[3]??a[4]??''));
      stack.at(-1).appendChild(n);if(!s.endsWith('/>')&&!voids.has(tag.toLowerCase()))stack.push(n);
    }else{const n=new Node('#text',parent.ownerDocument);n.text=decode(s);stack.at(-1).appendChild(n)}
  }
}
function createApp({project,appearance='iec',dashboard=false,settings={},environment={}}={}){
  const dist=path.resolve(__dirname,'../../dist'),html=fs.readFileSync(path.join(dist,'index.html'),'utf8'),win=new Events(),doc=new Node('document');doc.ownerDocument=doc;doc.parentNode=win;win.document=doc;doc.innerHTML=html;doc.body=doc.querySelector('body');doc.activeElement=doc.body;doc.hidden=false;
  doc.createElement=tag=>new Node(tag,doc);doc.createElementNS=(_,tag)=>new Node(tag,doc);doc.elementFromPoint=()=>doc.body;
  const storage=new Map([['ccs-appearance',appearance],['ccs-sound','off']]);if(project)storage.set('ods-project',JSON.stringify(project));for(const [k,v] of Object.entries(settings))storage.set(k,String(v));
  let clock=0,nextId=0;const timers=new Map(),frames=new Map();
  Object.assign(win,{window:win,globalThis:win,innerWidth:1500,innerHeight:900,console,Blob,URL,performance:{now:()=>clock},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},setTimeout:(fn,ms)=>{const id=++nextId;timers.set(id,{fn,time:clock+(ms||0)});return id},clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>{const id=++nextId;frames.set(id,fn);return id},cancelAnimationFrame:id=>frames.delete(id)});
  Object.assign(win,environment);vm.createContext(win);
  for(const m of html.matchAll(/<script src="([^"?]+)(?:\?[^\"]*)?"/g))vm.runInContext(fs.readFileSync(path.join(dist,m[1]),'utf8'),win,{filename:m[1]});
  const tick=ms=>{clock+=ms;const due=[...timers.entries()].filter(([,t])=>t.time<=clock);for(const [id,t] of due){if(timers.delete(id))t.fn()}const queued=[...frames];frames.clear();for(const [,fn] of queued)fn(clock)};
  const $=s=>doc.querySelector(s),save=()=>JSON.parse(JSON.stringify(win.DTSEditor.getProject()));
  if(!dashboard){$('#safetyAcknowledge').click();win.DTSStudio.load(win.DTSEditor.getProject())}
  const drop=(id,x,y)=>$('#viewport').emit('drop',{clientX:x,clientY:y,dataTransfer:{getData:()=>id}});
  return {window:win,document:doc,$,save,drop,tick,frames,storage,ready:win.DTSStudio.ready};
}
module.exports={createApp};
