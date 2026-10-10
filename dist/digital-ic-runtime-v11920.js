(function(root,factory){
'use strict';
const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSDigitalICRuntime=api;
})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const clone=v=>JSON.parse(JSON.stringify(v));
const bit=v=>v?1:0;
function state(c){return c._digitalIc||(c._digitalIc={outputs:{},channels:{},warnings:[]})}
function clear(c){delete c._digitalIc}
function sig(c){const s=c._digitalIc||{};return JSON.stringify({outputs:s.outputs||{},channels:s.channels||{},data:s.data,shift:s.shift,latch:s.latch,count:s.count,conversion:s.conversion,analogCurrentA:s.analogCurrentA})}
function voltage(net,c,a,b){const v=net.dcVoltage(c,String(a),String(b));return v===null?null:Number(v)}
function supply(c,d,net){
 const pos=d.supplyPins?.positive||String(d.pins.length),neg=d.supplyPins?.negative||String(d.pins.length/2),v=voltage(net,c,pos,neg),range=d.operatingVoltage||[2,6];
 return {pos:String(pos),neg:String(neg),v,powered:v!==null&&v>=range[0]-.05&&v<=range[1]+.1,range};
}
function read(c,d,net,p,sp,def=0){
 const v=voltage(net,c,String(p),sp.neg);if(v===null)return def;
 if(v>=sp.v*.7)return 1;if(v<=sp.v*.3)return 0;
 state(c).warnings.push('Belirsiz lojik seviye: pin '+p+' = '+v.toFixed(2)+' V');return def;
}
function put(out,p,v,en=true){if(en)out[String(p)]={logic:bit(v)}}
function gate2(c,d,net,sp,triples,fn){
 const out={};for(const [a,b,y] of triples)put(out,y,fn(read(c,d,net,a,sp),read(c,d,net,b,sp)));return out;
}
const standardQuad=[[1,2,3],[4,5,6],[9,10,8],[12,13,11]];
const norQuad=[[2,3,1],[5,6,4],[8,9,10],[11,12,13]];
function evaluate(c,d,net,now=Date.now()){
 if(!d?.digitalIc)return null;const s=state(c);s.warnings=[];const sp=supply(c,d,net);s.powered=sp.powered;s.supplyV=sp.v;s.outputs={};s.analogCurrentA=0;
 if(!sp.powered){s.warnings.push('Besleme yok veya '+(d.operatingVoltage||[]).join('–')+' V aralığı dışında');return s}
 const R=(p,def=0)=>read(c,d,net,p,sp,def),out={};
 switch(d.digitalIc){
  case 'quad-nand':s.outputs=gate2(c,d,net,sp,standardQuad,(a,b)=>!(a&&b));break;
  case 'quad-and':s.outputs=gate2(c,d,net,sp,standardQuad,(a,b)=>a&&b);break;
  case 'quad-or':s.outputs=gate2(c,d,net,sp,standardQuad,(a,b)=>a||b);break;
  case 'quad-xor':s.outputs=gate2(c,d,net,sp,standardQuad,(a,b)=>a!==b);break;
  case 'quad-nor':s.outputs=gate2(c,d,net,sp,norQuad,(a,b)=>!(a||b));break;
  case 'quad-xnor':s.outputs=gate2(c,d,net,sp,[[1,2,3],[5,6,4],[8,9,10],[12,13,11]],(a,b)=>a===b);break;
  case 'hex-inverter':for(const [a,y] of [[1,2],[3,4],[5,6],[9,8],[11,10],[13,12]])put(out,y,!R(a));s.outputs=out;break;
  case 'quad-buffer':
   for(const [oe,a,y] of [[1,2,3],[4,5,6],[10,9,8],[13,12,11]])if(!R(oe,1))put(out,y,R(a));
   s.outputs=out;break;
  case 'mux8':{
   const disabled=R(7,1),sel=R(11)|(R(10)<<1)|(R(9)<<2),pins=[4,3,2,1,15,14,13,12],v=disabled?0:R(pins[sel]);put(out,5,v);put(out,6,!v);s.outputs=out;break}
  case 'decoder138':{
   const enabled=R(6)&&!R(4,1)&&!R(5,1),sel=R(1)|(R(2)<<1)|(R(3)<<2);
   for(let i=0;i<8;i++)put(out,15-i,!(enabled&&i===sel));s.outputs=out;break}
  case 'priority148':{
   const enabled=!R(15,1);let chosen=-1;if(enabled)for(let i=7;i>=0;i--){const pin=i<=3?11+i:i-3;if(!R(pin,1)){chosen=i;break}}
   const code=chosen<0?0:chosen;put(out,10,!(code&1));put(out,9,!(code&2));put(out,7,!(code&4));put(out,6,chosen<0);put(out,5,!(enabled&&chosen<0));s.outputs=out;break}
  case 'bcd4511':{
   const lt=R(3,1),bi=R(4,1),le=R(5),code=R(7)|(R(1)<<1)|(R(2)<<2)|(R(6)<<3);
   if(!s.channels.bcdLatch||!le)s.channels.bcdLatch=code;const n=s.channels.bcdLatch;
   const seg={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'}[n]||'';
   for(const [name,p] of Object.entries({a:13,b:12,c:11,d:10,e:9,f:15,g:14}))put(out,p,!bi?0:!lt?1:seg.includes(name));s.outputs=out;break}
  case 'adder283':{
   const A=R(5)|(R(3)<<1)|(R(14)<<2)|(R(12)<<3),B=R(6)|(R(2)<<1)|(R(15)<<2)|(R(11)<<3),sum=A+B+R(7);
   for(const [p,k] of [[4,0],[1,1],[13,2],[10,3]])put(out,p,(sum>>k)&1);put(out,9,sum>15);s.outputs=out;break}
  case 'comparator85':{
   const A=R(10)|(R(12)<<1)|(R(13)<<2)|(R(15)<<3),B=R(9)|(R(11)<<1)|(R(14)<<2)|(R(1)<<3);
   let gt=A>B,eq=A===B,lt=A<B;if(eq){gt=!!R(4);lt=!!R(2);eq=!!R(3,1)}
   put(out,5,gt);put(out,6,eq);put(out,7,lt);s.outputs=out;break}
  case 'dual-dff':{
   for(const ch of [1,2]){
    const m=ch===1?{clr:1,D:2,clk:3,pre:4,q:5,nq:6}:{nq:8,q:9,pre:10,clk:11,D:12,clr:13};
    const cs=s.channels[ch]||(s.channels[ch]={q:0,lastClk:R(m.clk)});
    const clr=R(m.clr,1),pre=R(m.pre,1),clk=R(m.clk);
    if(!clr&&!pre){cs.q=1;s.warnings.push('74HC74: PRE ve CLR aynı anda LOW geçersiz durum')}
    else if(!clr)cs.q=0;else if(!pre)cs.q=1;else if(!cs.lastClk&&clk)cs.q=R(m.D);
    cs.lastClk=clk;put(out,m.q,cs.q);put(out,m.nq,!cs.q);
   }s.outputs=out;break}
  case 'dual-jk':{
   for(const ch of [1,2]){
    const m=ch===1?{set:9,J:10,K:11,reset:12,clk:13,nq:14,q:15}:{q:1,nq:2,clk:3,reset:4,K:5,J:6,set:7};
    const cs=s.channels[ch]||(s.channels[ch]={q:0,lastClk:R(m.clk)}),set=R(m.set),reset=R(m.reset),clk=R(m.clk);
    if(set&&reset){cs.q=1;s.warnings.push('CD4027: SET ve RESET birlikte HIGH geçersiz durum')}
    else if(reset)cs.q=0;else if(set)cs.q=1;else if(!cs.lastClk&&clk){const J=R(m.J),K=R(m.K);if(J&&!K)cs.q=1;else if(!J&&K)cs.q=0;else if(J&&K)cs.q=!cs.q}
    cs.lastClk=clk;put(out,m.q,cs.q);put(out,m.nq,!cs.q);
   }s.outputs=out;break}
  case 'dual-counter':{
   for(const ch of [1,2]){
    const m=ch===1?{clk:1,clr:2,qs:[3,4,5,6]}:{clk:13,clr:12,qs:[11,10,9,8]},cs=s.channels[ch]||(s.channels[ch]={count:0,lastClk:R(m.clk)});
    const clk=R(m.clk);if(R(m.clr))cs.count=0;else if(cs.lastClk&&!clk)cs.count=(cs.count+1)&15;cs.lastClk=clk;
    m.qs.forEach((p,i)=>put(out,p,(cs.count>>i)&1));
   }s.outputs=out;break}
  case 'shift595':{
   if(!Array.isArray(s.shift))s.shift=Array(8).fill(0);if(!Array.isArray(s.latch))s.latch=Array(8).fill(0);
   const sr=R(11),rc=R(12);if(!R(10,1))s.shift.fill(0);
   if(!s.lastSrClk&&sr){const serial=R(14),old=s.shift.slice();s.shift=[serial,...old.slice(0,7)];s.serialOut=old[7]}
   if(!s.lastRClk&&rc)s.latch=s.shift.slice();s.lastSrClk=sr;s.lastRClk=rc;
   if(!R(13,1)){const pins=[15,1,2,3,4,5,6,7];pins.forEach((p,i)=>put(out,p,s.latch[i]))}put(out,9,s.serialOut||0);s.outputs=out;break}
  case 'adc0804':{
   const cs=R(1,1),rd=R(2,1),wr=R(3,1),vinP=voltage(net,c,6,10)??0,vinN=voltage(net,c,7,10)??0,vrefHalf=voltage(net,c,9,10),fullScale=vrefHalf!==null&&vrefHalf>0?2*vrefHalf:sp.v;
   if(s.lastWr===undefined)s.lastWr=wr;
   if(!cs&&s.lastWr===0&&wr===1){s.conversion={completeAt:Number(now)+Math.max(.1,(Number(d.conversionTimeUs)||100)/1000),sample:Math.max(0,Math.min(fullScale,vinP-vinN)),fullScale};s.intr=1}
   s.lastWr=wr;
   if(s.conversion&&Number(now)>=s.conversion.completeAt){s.data=Math.max(0,Math.min(255,Math.round(s.conversion.sample/s.conversion.fullScale*255)));s.conversion=null;s.intr=0}
   put(out,5,s.intr===0?0:1);
   if(!cs&&!rd&&Number.isFinite(s.data)){for(let i=0;i<8;i++)put(out,18-i,(s.data>>i)&1);s.intr=1}
   s.outputs=out;break}
  case 'dac0808':{
   let code=0;for(let i=0;i<8;i++)code|=R(5+i)<<(7-i);
   const ref=voltage(net,c,14,15)??0,rr=Math.max(1,Number(c.referenceResistance??d.referenceResistance??5000)),iref=Math.max(0,ref/rr);
   s.data=code;s.referenceCurrentA=iref;s.analogCurrentA=iref*code/256;s.outputs={};break}
 }
 return s;
}
function outputSeeds(c,d,net){
 const s=c._digitalIc;if(!s?.powered)return [];const sp=supply(c,d,net);if(!sp.powered)return [];
 return Object.entries(s.outputs||{}).map(([pin,o])=>({pin,ground:sp.neg,voltage:o.logic?sp.v:0,logic:o.logic}));
}
function timed(c,d){return !!(d?.sequential||c?._digitalIc?.conversion)}
return {clear,state,signature:sig,evaluate,outputSeeds,supply,timed,clone};
});