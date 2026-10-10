(function(root){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ATLAS_W=1720,ATLAS_H=1560,ATLAS={
'bg5933-front':[160,66,110,258],'bh5933-front':[572,68,146,253],'bn5930-front':[959,115,232,159],'bo5988-front':[1389,125,231,139],'lg5925-front':[157,425,115,320],
'bg5933-schematic':[463,438,364,293],'bh5933-schematic':[870,407,410,355],'bn5930-schematic':[1350,400,310,370],
'bo5988-47-schematic':[33,807,364,335],'bo5988-61-schematic':[467,816,355,318],'bo5988-62-schematic':[893,801,364,347],
'lg5925-02-schematic':[1380,842,250,265],'lg5925-04-schematic':[95,1232,240,265],'lg5925-48-schematic':[520,1232,250,265],
'ne5021-doc':[950,1272,250,185],'encoder-npn-schematic':[1268,1263,473,204]
};
const atlasKey=p=>String(p||'').replace(/^.*\//,'').replace(/\.(?:png|webp|jpe?g)$/i,'');
const atlasUrl=()=>root.DTSDoldAtlasB64?'data:image/png;base64,'+root.DTSDoldAtlasB64:'';
function atlasImage(key,x,y,w,h){
 const a=ATLAS[atlasKey(key)],href=atlasUrl();if(!a||!href)return '';
 const [sx,sy,sw,sh]=a;
 return '<svg x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" viewBox="'+sx+' '+sy+' '+sw+' '+sh+'" preserveAspectRatio="xMidYMid meet" overflow="hidden"><image href="'+href+'" x="0" y="0" width="'+ATLAS_W+'" height="'+ATLAS_H+'"/></svg>';
}
const hasPin=(d,p)=>(d?.pins||[]).some(x=>x.id===p);
const domains=c=>({plus:'dold:'+c.id+':+',zero:'dold:'+c.id+':0',start:'dold:'+c.id+':start',feedback:'dold:'+c.id+':feedback'});
function powered(c,d,net){c._doldDef=d;return (d.doldPowerPairs||[['A1','A2']]).some(([a,b])=>hasPin(d,a)&&hasPin(d,b)&&!!net.voltage(c,a,b))}
function seedControl(c,d,net,seed){
 if(!d?.doldSafety||!powered(c,d,net))return false;
 const dm=domains(c),cfg=d.doldLogic||{};
 for(const p of cfg.plusOutputs||[])if(hasPin(d,p))seed(c,p,dm.plus,'+','dc',24);
 for(const p of cfg.zeroOutputs||[])if(hasPin(d,p))seed(c,p,dm.zero,'0','dc',24);
 if(cfg.startOut&&hasPin(d,cfg.startOut))seed(c,cfg.startOut,dm.start,'+','dc',24);
 if(cfg.feedbackOut&&hasPin(d,cfg.feedbackOut))seed(c,cfg.feedbackOut,dm.feedback,'+','dc',24);
 return true;
}
const hasDomain=(net,c,p,domain,leg)=>hasPin(c._doldDef||{},p)&&(net.at(c,p)||[]).some(v=>v.domain===domain&&(!leg||v.leg===leg));
function shared(net,c,a,b){const aa=net.at(c,a)||[],bb=net.at(c,b)||[];return aa.some(x=>bb.some(y=>x.domain===y.domain&&x.leg===y.leg))}
function channelSafe(c,d,net,ch){const dm=domains(c);if(ch.mode==='supply')return shared(net,c,ch.pin,ch.source||'A1');return hasDomain(net,c,ch.pin,ch.bus==='zero'?dm.zero:dm.plus,ch.bus==='zero'?'0':'+')}
function dryClosed(c,d,net,outPin,inPin,bus){if(!outPin||!inPin)return true;const dm=domains(c);return hasDomain(net,c,inPin,bus==='feedback'?dm.feedback:dm.start,'+')}
function evalTwoHand(c,d,net,now){
 const cfg=d.doldLogic,m=c._doldMemory||(c._doldMemory={}),ch=(cfg.channels||[]).map(x=>channelSafe(c,d,net,x)),fb=dryClosed(c,d,net,cfg.feedbackOut,cfg.feedbackIn,'feedback');
 if(!powered(c,d,net)){m.twoHandTimes=[null,null];m.twoHandPrev=[false,false];m.powerBlocked=false;m.lastPowered=false;return {powered:false,active:false,channels:ch,feedback:fb,status:'BESLEME YOK'}}
 if(!Array.isArray(m.twoHandTimes))m.twoHandTimes=[null,null];if(!Array.isArray(m.twoHandPrev))m.twoHandPrev=[false,false];
 if(m.lastPowered!==true&&ch.every(Boolean))m.powerBlocked=true;
 ch.forEach((v,i)=>{if(v&&!m.twoHandPrev[i])m.twoHandTimes[i]=now;if(!v)m.twoHandTimes[i]=null});
 if(ch.some(v=>!v))m.powerBlocked=false;
 const simultaneous=ch.every(Boolean)&&m.twoHandTimes.every(v=>v!==null)&&Math.abs(m.twoHandTimes[0]-m.twoHandTimes[1])<=Number(cfg.simultaneityMs||500);
 const active=!m.powerBlocked&&simultaneous&&fb;m.twoHandPrev=[...ch];m.lastPowered=true;m.active=active;
 return {powered:true,active,channels:ch,feedback:fb,status:m.powerBlocked?'BUTONLARI BIRAKIN':!fb?'GERİ BESLEME AÇIK':!ch.every(Boolean)?'İKİ EL BEKLENİYOR':!simultaneous?'0,5 s SENKRON HATASI':'ÇALIŞIYOR'};
}
function evaluate(c,d,net,now=Date.now()){
 now=Number(now)||Date.now();c._doldDef=d;if(!d?.doldSafety)return {powered:false,active:false,status:'—'};
 if(d.doldLogic?.type==='twohand'){const r=evalTwoHand(c,d,net,now);c._doldEval=r;return r}
 const cfg=d.doldLogic||{},m=c._doldMemory||(c._doldMemory={}),pwr=powered(c,d,net);
 if(!pwr){m.latched=false;m.safePrev=false;m.startPrev=false;m.delayUntil=0;m.active=false;const r={powered:false,active:false,channels:[],feedback:false,start:false,status:'BESLEME YOK'};c._doldEval=r;return r}
 const channels=(cfg.channels||[]).map(x=>channelSafe(c,d,net,x)),safe=channels.length?channels.every(Boolean):true,feedback=dryClosed(c,d,net,cfg.feedbackOut,cfg.feedbackIn,'feedback'),start=dryClosed(c,d,net,cfg.startOut,cfg.startIn,'start'),auto=(c.doldStartMode||d.doldStartMode||'manual')==='auto';
 let crossFault=false;if(c.doldCrossShort!==false&&cfg.crossCheck){const dm=domains(c);for(const x of cfg.channels||[]){if(x.bus==='zero'&&hasDomain(net,c,x.pin,dm.plus,'+'))crossFault=true;if(x.bus==='plus'&&hasDomain(net,c,x.pin,dm.zero,'0'))crossFault=true}}
 const startRise=start&&!m.startPrev;
 if(!safe||!feedback||crossFault)m.latched=false;else if(auto)m.latched=true;else if(startRise||(!m.safePrev&&start))m.latched=true;
 const active=!!m.latched&&safe&&feedback&&!crossFault;
 if(m.active===true&&!active&&d.doldOffDelayPair)m.delayUntil=now+1000*Math.max(.1,Math.min(600,Number(c.doldOffDelaySeconds??d.doldOffDelaySeconds??1)));if(active)m.delayUntil=0;
 m.safePrev=safe;m.startPrev=start;m.active=active;
 const status=crossFault?'ÇAPRAZ KISA DEVRE':!safe?'EMNİYET KANALI AÇIK':!feedback?'GERİ BESLEME AÇIK':active?'ÇALIŞIYOR':auto?'OTOMATİK START BEKLİYOR':'START BEKLİYOR';
 const r={powered:true,active,channels,feedback,start,auto,crossFault,delayActive:!active&&Number(m.delayUntil||0)>now,status};c._doldEval=r;return r;
}
function outputClosed(c,d,o,now=Date.now()){
 const active=!!(c?._doldEval?.active??c?._active),isDelayed=!!(d.doldOffDelayPair&&o.a===d.doldOffDelayPair[0]&&o.b===d.doldOffDelayPair[1]);
 const delayed=isDelayed&&!active&&Number(c?._doldMemory?.delayUntil||0)>Number(now);
 return (o.normal==='NC'?!active:active)||delayed;
}
function links(c,d,active,now=Date.now()){if(!d?.doldSafety)return [];const shadow={...c,_doldEval:{...(c?._doldEval||{}),active:!!active},_active:!!active},pairs=[];for(const o of d.doldOutputs||[])if(outputClosed(shadow,d,o,now))pairs.push([o.a,o.b]);return pairs}


function screwRow(ids,x0,x1,y,labelAbove=true){
 const list=(ids||[]).filter(Boolean),step=list.length>1?(x1-x0)/(list.length-1):0;
 return list.map((id,i)=>{const x=x0+i*step;return '<g class="dold-front-terminal" data-terminal-label="'+esc(id)+'"><text x="'+x+'" y="'+(labelAbove?y-8:y+13)+'" text-anchor="middle" font-size="'+(list.length>12?5.1:6)+'" font-weight="700" fill="#43170d">'+esc(id)+'</text><circle cx="'+x+'" cy="'+y+'" r="'+(list.length>12?5:6)+'" fill="#d9d9d9" stroke="#6b625d" stroke-width="1.1"/><circle cx="'+x+'" cy="'+y+'" r="'+(list.length>12?2.1:2.6)+'" fill="#615852"/><path d="M'+(x-3)+' '+(y-3)+'L'+(x+3)+' '+(y+3)+'" stroke="#fafafa" stroke-width=".9"/></g>'}).join('');
}
function qrMark(x,y,size){
 let bits='101110101011101110100010101010001010111010101110101000100010100010101110111010111010000000000000101011101010111010101010001010001010111011101011101';
 let out='<g opacity=".92"><rect x="'+x+'" y="'+y+'" width="'+size+'" height="'+size+'" fill="#f04b23" stroke="#4a160d" stroke-width=".7"/>';
 const n=11,cell=size/n;for(let i=0;i<bits.length;i++)if(bits[i]==='1'){const cx=i%n,cy=Math.floor(i/n);out+='<rect x="'+(x+cx*cell)+'" y="'+(y+cy*cell)+'" width="'+(cell+.15)+'" height="'+(cell+.15)+'" fill="#29110d"/>'}return out+'</g>';
}
function frontTerminalMarkup(d){
 const id=d.id,w=d.w,h=d.h;
 if(id==='dold-bg5933-22')return screwRow(['13','23','31'],w*.55,w*.87,30,true)+screwRow(['A1','S22','Y1','Y2'],w*.48,w*.88,52,true)+screwRow(['S12','S11','S21','A2'],w*.47,w*.88,h-51,false)+screwRow(['14','24','32'],w*.55,w*.87,h-29,false);
 if(id==='dold-bh5933-48')return screwRow(['A1','13','23'],w*.16,w*.42,31,true)+screwRow(['33','Y1','Y2'],w*.60,w*.85,31,true)+screwRow(['S11','S12','S13'],w*.16,w*.42,54,true)+screwRow(['S21','S22','S23'],w*.60,w*.85,54,true)+screwRow(['14','24','34'],w*.19,w*.43,h-29,false)+screwRow(['41','42','A2'],w*.63,w*.86,h-29,false);
 if(id.startsWith('dold-lg5925')){const outs=(d.doldOutputs||[]),top=['A1',...outs.map(o=>o.a).slice(0,3)],top2=['S33','S34',...(outs.length>3?[outs[3].a,outs[3].b]:[])],bottom=['A2','S11','S12','S21','S22'],bottom2=outs.map(o=>o.b).slice(0,3);return screwRow(top,w*.18,w*.86,30,true)+screwRow(top2,w*.28,w*.84,52,true)+screwRow(bottom,w*.18,w*.86,h-51,false)+screwRow(bottom2,w*.30,w*.84,h-29,false)}
 const top=(d.pins||[]).filter(p=>p.side==='top').map(p=>p.id),bottom=(d.pins||[]).filter(p=>p.side==='bottom').map(p=>p.id);
 return screwRow(top,24,w-24,29,true)+screwRow(bottom,24,w-24,h-29,false);
}
function frontContactDiagram(d,x,y,w,h){
 const outs=d.doldOutputs||[],n=Math.max(1,outs.length),step=w/n;
 return outs.map((o,i)=>{const cx=x+step*(i+.5),closed=o.normal==='NC',ty=y+4;return '<g opacity=".9"><text x="'+cx+'" y="'+(ty-5)+'" text-anchor="middle" font-size="'+(n>6?4.6:5.4)+'" fill="#5c180d">'+esc(o.a)+'</text><circle cx="'+cx+'" cy="'+(ty+5)+'" r="1.7" fill="#5c180d"/><circle cx="'+cx+'" cy="'+(ty+h-7)+'" r="1.7" fill="#5c180d"/><line x1="'+cx+'" y1="'+(ty+h-7)+'" x2="'+(cx+(closed?0:Math.min(7,step*.2)))+'" y2="'+(ty+5)+'" stroke="#5c180d" stroke-width="1.2"/><text x="'+cx+'" y="'+(ty+h+4)+'" text-anchor="middle" font-size="'+(n>6?4.6:5.4)+'" fill="#5c180d">'+esc(o.b)+'</text></g>'}).join('');
}

function materialMarkup(c,d){
 const st=d.doldNe5021?{status:c.state?'KAPI KAPALI':'KAPI AÇIK',active:!!c.state,powered:true}:(c._doldEval||{status:'SİMÜLASYON KAPALI',active:false,powered:false});
 if(d.doldNe5021)return '<g class="dold-ne5021 material-orthographic">'+atlasImage(d.doldAsset,4,4,d.w-8,d.h-8)+'</g>';
 const w=d.w,h=d.h,orange='#f04b23',deep='#c93416',model=(d.name||'DOLD SAFEMASTER').replace(/^DOLD SAFEMASTER\s*/,'');
 const wide=w>=430,mid=w>=320&&!wide,ledX=wide?w*.12:mid?w*.17:w*.17,ledY=wide?h*.39:h*.38,ledGap=wide?20:18;
 const leds=[['Power',!!st.powered],['K1',!!st.active],['K2',!!st.active],...(String(d.id).includes('bo5988')?[['K3',!!st.active]]:[])];
 const ledsSvg=leds.map((r,i)=>'<g><circle cx="'+ledX+'" cy="'+(ledY+i*ledGap)+'" r="'+(wide?6:5.2)+'" fill="'+(r[1]?'#35d876':'#765047')+'" stroke="#692315" stroke-width="1.1"/><circle cx="'+(ledX-1.6)+'" cy="'+(ledY+i*ledGap-1.6)+'" r="1.5" fill="#fff" opacity=".75"/><text x="'+(ledX+11)+'" y="'+(ledY+i*ledGap+2.6)+'" font-size="'+(wide?7.2:6.6)+'" font-weight="700" fill="#43170d">'+r[0]+'</text></g>').join('');
 const dx=wide?w*.42:w*.48,dy=wide?h*.37:h*.45,dw=wide?w*.44:w*.38,dh=wide?h*.34:h*.26;
 const qrX=wide?w*.88:w*.82,qrY=wide?h*.30:h*.26,qr=qrMark(qrX,qrY,wide?26:22);
 return '<g class="dold-device material-orthographic dold-manufacturer-orthographic" data-product-visual="manufacturer-referenced-front">'+
  '<rect x="2" y="2" width="'+(w-4)+'" height="'+(h-4)+'" rx="7" fill="#101010" stroke="#050505" stroke-width="2"/>'+
  '<rect x="7" y="5" width="'+(w-14)+'" height="'+(h-10)+'" rx="4" fill="'+orange+'" stroke="'+deep+'" stroke-width="1.4"/>'+
  '<path d="M7 67H'+(w-7)+'M7 '+(h-66)+'H'+(w-7)+'" stroke="#ff8b70" stroke-width="1.1" opacity=".9"/>'+
  (wide?'<circle cx="20" cy="48" r="10" fill="#c92d19" stroke="#8f1e10"/><circle cx="'+(w-20)+'" cy="48" r="10" fill="#c92d19" stroke="#8f1e10"/><circle cx="20" cy="'+(h-48)+'" r="10" fill="#c92d19" stroke="#8f1e10"/><circle cx="'+(w-20)+'" cy="'+(h-48)+'" r="10" fill="#c92d19" stroke="#8f1e10"/><text x="'+(w*.5)+'" y="58" text-anchor="middle" font-size="7" fill="#58180e">Removable terminal strip</text><text x="'+(w*.5)+'" y="'+(h-50)+'" text-anchor="middle" font-size="7" fill="#58180e">Removable terminal strip</text>':'')+
  frontTerminalMarkup(d)+
  '<text x="'+(wide?w*.08:w*.13)+'" y="'+(wide?h*.32:h*.34)+'" font-size="'+(wide?17:14)+'" font-weight="1000" fill="#17100e">DOLD</text><text x="'+(wide?w*.08:w*.13)+'" y="'+(wide?h*.32+15:h*.34+14)+'" font-size="'+(wide?8:7)+'" font-weight="800" fill="#4f170f">SAFEMASTER</text>'+
  ledsSvg+qr+
  '<g class="dold-front-printed-diagram"><rect x="'+(dx-6)+'" y="'+(dy-12)+'" width="'+(dw+12)+'" height="'+(dh+25)+'" fill="none" stroke="#b52d16" stroke-width=".7"/>'+frontContactDiagram(d,dx,dy,dw,dh)+'</g>'+
  '<text x="'+(wide?w*.88:w*.67)+'" y="'+(wide?h*.70:h*.76)+'" text-anchor="end" font-size="'+(wide?9:8)+'" font-weight="850" fill="#4a160e">'+esc(model)+'</text>'+
  '</g>';
}
function liveMiniContact(c,d,o,x,y,now){
 const closed=outputClosed(c,d,o,now),key=o.a+'-'+o.b,prevMap=c._doldVisualContacts||(c._doldVisualContacts={}),prev=Object.prototype.hasOwnProperty.call(prevMap,key)?prevMap[key]:closed;
 prevMap[key]=closed;const from=prev?0:-24,to=closed?0:-24,anim=from!==to?'<animateTransform attributeName="transform" type="rotate" from="'+from+' '+x+' '+(y+12)+'" to="'+to+' '+x+' '+(y+12)+'" dur=".16s" fill="freeze"/>':'';
 return '<g class="dold-live-contact" data-contact-pair="'+esc(key)+'" data-contact-state="'+(closed?'closed':'open')+'" data-contact-normal="'+esc(o.normal||'NO')+'"><circle cx="'+x+'" cy="'+(y-10)+'" r="2.2" fill="#fff" stroke="#111"/><circle cx="'+x+'" cy="'+(y+12)+'" r="2.2" fill="#fff" stroke="#111"/><g transform="rotate('+to+' '+x+' '+(y+12)+')"><line x1="'+x+'" y1="'+(y+12)+'" x2="'+x+'" y2="'+(y-10)+'" stroke="#111" stroke-width="1.8"/>'+anim+'</g><text x="'+x+'" y="'+(y+26)+'" text-anchor="middle" font-size="5.7" font-weight="700" fill="#334155">'+esc(o.a+'–'+o.b)+'</text></g>';
}
function schematicMarkup(c,d){
 const w=d.w,h=d.h,outs=d.doldOutputs||[],now=Date.now(),stripH=Math.min(62,Math.max(50,h*.22)),schemH=h-stripH-8,pad=12,span=w-pad*2,step=outs.length>1?span/(outs.length-1):0;
 const contacts=outs.map((o,i)=>liveMiniContact(c,d,o,pad+i*step,h-stripH/2-1,now)).join('');
 return '<g class="dold-schematic-exact-live" data-live-contacts="1">'+
  '<rect x="2" y="2" width="'+(w-4)+'" height="'+(h-4)+'" fill="#fff" stroke="#94a3b8"/>'+
  '<g class="dold-manufacturer-schematic-reference">'+atlasImage(d.doldSchematic,7,7,w-14,schemH-7)+'</g>'+
  '<line x1="7" y1="'+schemH+'" x2="'+(w-7)+'" y2="'+schemH+'" stroke="#cbd5e1"/>'+
  '<text x="10" y="'+(schemH+11)+'" font-size="6.5" font-weight="800" fill="#475569">DOLD DATASHEET DEVRESİ · CANLI ÇIKIŞ KONTAKLARI</text>'+
  contacts+'</g>';
}
function encoderSchematicMarkup(c,d){return '<g class="encoder-schematic-exact"><rect x="2" y="2" width="'+(d.w-4)+'" height="'+(d.h-4)+'" fill="#fff" stroke="#94a3b8"/>'+atlasImage('encoder-npn-schematic',8,8,d.w-16,d.h-16)+'</g>'}
const api={powered,seedControl,evaluate,links,outputClosed,materialMarkup,schematicMarkup,encoderSchematicMarkup,domains};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSDoldSafety=api;
})(typeof window==='undefined'?globalThis:window);
