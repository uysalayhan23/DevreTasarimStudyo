(function(root){
  'use strict';
  const Materials=typeof module==='object'&&module.exports?require('./materials.js'):root.CCSMaterials;
  const Wiring=typeof module==='object'&&module.exports?require('./panel-wiring.js'):root.DTSPanelWiring;
  const Physical=typeof module==='object'&&module.exports?require('./physical-metadata.js'):root.DTSPhysicalMetadata;
  const clamp=(v,a,b,f=a)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
  const snap=v=>Math.round(v/5)*5,uid=p=>p+'-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function aspectPlacement(x,y,w,h,drawingW,drawingH,anchor='center'){
    const values=[x,y,w,h,drawingW,drawingH].map(Number);
    if(!values.every(Number.isFinite)||values[2]<=0||values[3]<=0||values[4]<=0||values[5]<=0)return {x:Number(x)||0,y:Number(y)||0,scale:1,width:0,height:0,anchor:'center'};
    const [fx,fy,fw,fh,dw,dh]=values,scale=Math.min(fw/dw,fh/dh),width=dw*scale,height=dh*scale;
    let ox=(fw-width)/2,oy=(fh-height)/2;
    if(anchor==='top')oy=0;else if(anchor==='bottom')oy=fh-height;else if(anchor==='left')ox=0;else if(anchor==='right')ox=fw-width;else anchor='center';
    return {x:fx+ox,y:fy+oy,scale,width,height,anchor};
  }
  const defaults=()=>({width:600,height:800,depth:220,doorAngle:105,rails:[],ducts:[],items:[],wires:[]});
  function normalize(value={},byId){
    const p={...defaults(),...value};p.width=clamp(p.width,200,2400,600);p.height=clamp(p.height,200,2400,800);p.depth=clamp(p.depth,100,800,220);p.doorAngle=clamp(p.doorAngle,0,120,105);
    for(const k of ['rails','ducts','items'])p[k]=Array.isArray(p[k])?p[k]:[];
    if(p.items.length>5000||p.rails.length>1000||p.ducts.length>1000)throw Error('Pano projesinde çok fazla nesne var.');
    const ids=new Set();for(const [kind,list] of [['items',p.items],['rails',p.rails],['ducts',p.ducts]])for(const item of list){
      if(!item||typeof item.id!=='string'||ids.has(item.id)||!['x','y',...(kind==='items'?['w','h','depth']:kind==='rails'?['length']:['width','length'])].every(k=>Number.isFinite(item[k])))throw Error('Pano projesindeki konum veya ölçü bilgileri geçersiz.');
      if(kind==='items'&&(!['door','plate','rail','external'].includes(item.mount)||item.w<5||item.h<5||item.depth<1||typeof item.typeId!=='string'))throw Error('Pano malzemesinin ölçüsü veya montaj yüzeyi geçersiz.');ids.add(item.id);
    }return Wiring.normalize(p,byId);
  }
  function legacySpec(d){
    if(['supply','supply3','supply-dc-plus','supply-dc-minus'].includes(d.kind))return {w:80,h:60,depth:10,mount:'external'};
    const id=d.id,g=d.classification?.group||d.catalogGroup,k=d.kind;
    if(d.isPLC)return {w:/cpu|işlemci/i.test(d.name)?110:45,h:100,depth:75,mount:'rail'};
    if(/^door-isolator/.test(id)||id==='packet-switch-3p'||/^layout-packet/.test(id))return {w:64,h:64,depth:80,mount:'door'};
    if(g==='buttons'||g==='lamps'||/pilot|layout-(lamp|start|stop|jog)/.test(id))return {w:32,h:32,depth:50,mount:'door'};
    if(k.startsWith('meter-')||/layout-(voltmeter|ammeter)|indicator|controller/.test(id))return {w:96,h:96,depth:65,mount:'door'};
    if(id==='fan-1p')return {w:120,h:120,depth:40,mount:'door'};
    if(/^bar-|layout-bar/.test(id))return {w:100,h:25,depth:25,mount:'plate'};
    if(g==='terminals')return {w:8,h:50,depth:45,mount:'rail'};
    if(/mcb|rcd|layout-(mcb|rcd)|surge/.test(id))return {w:/3p|mcb3/.test(id)?54:/2p|rcd/.test(id)?36:18,h:85,depth:70,mount:'rail'};
    if(g==='contactors'||/layout-contactor/.test(id))return {w:45,h:85,depth:75,mount:'rail'};
    if(k==='power24')return {w:60,h:125,depth:120,mount:'rail'};
    if(['relays','timers','protection','auxiliary','energy-meters'].includes(g))return {w:40,h:80,depth:60,mount:'rail'};
    if(g==='drives')return {w:100,h:180,depth:150,mount:'plate'};
    return {w:70,h:85,depth:55,mount:'plate'};
  }
  function spec(d){
    const fallback=legacySpec(d),physical=Physical&&typeof Physical.panelSpec==='function'?Physical.panelSpec(d):null;
    if(!physical)return {...fallback,dimensionStatus:'approximate',dimensionAuthority:'legacy-category-fallback',dimensionSource:null};
    const verifiedBody=physical.physicalDimensionStatus==='verified'&&[physical.physicalWidthMm,physical.physicalHeightMm,physical.physicalDepthMm].every(v=>Number.isFinite(v)&&v>0);
    const geometry=verifiedBody
      ?{w:physical.physicalWidthMm,h:physical.physicalHeightMm,depth:physical.physicalDepthMm,dimensionStatus:'verified'}
      :{...fallback,dimensionStatus:'approximate'};
    return {...geometry,...physical,mount:physical.defaultPanelMount||fallback.mount};
  }
  const overlap=(a,b,gap=2)=>a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;
  const DOOR_CLEARANCE_MM=5,DOOR_SWEEP_STEP_DEG=1;
  const physicalSurface=i=>i?.mount==='door'?'door':i?.mount==='external'?'external':'plate';
  const intervalOverlap=(a0,a1,b0,b1,gap=0)=>a0<b1+gap&&a1+gap>b0;
  function polygonAxes(poly){const axes=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],x=-(b.z-a.z),z=b.x-a.x,n=Math.hypot(x,z);if(n>1e-9)axes.push({x:x/n,z:z/n})}return axes}
  function polygonsOverlap(a,b){
    for(const axis of [...polygonAxes(a),...polygonAxes(b)]){const pa=a.map(p=>p.x*axis.x+p.z*axis.z),pb=b.map(p=>p.x*axis.x+p.z*axis.z);if(Math.max(...pa)<=Math.min(...pb)+1e-9||Math.max(...pb)<=Math.min(...pa)+1e-9)return false}
    return true;
  }
  function doorSection(p,item,angleDeg){
    const angle=Number(angleDeg)*Math.PI/180,cs=Math.cos(angle),sn=Math.sin(angle),profile=item?.colliderStatus==='verified-profile'&&Array.isArray(item.colliderProfileXZMm)&&item.colliderProfileXZMm.length>=3?item.colliderProfileXZMm:null;
    const local=profile?convexHull(profile):[{x:0,z:0},{x:item.w,z:0},{x:item.w,z:Math.max(0,item.depth)},{x:0,z:Math.max(0,item.depth)}];
    return local.map(pt=>{const x=item.x+Number(pt.x),depth=Number(pt.z);return {x:x*cs+depth*sn,z:p.depth+x*sn-depth*cs}});
  }
  function convexHull(points){
    const pts=points.map(p=>({x:Number(p.x),z:Number(p.z)})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)).sort((a,b)=>a.x-b.x||a.z-b.z);
    if(pts.length<=2)return pts;
    const cross=(o,a,b)=>(a.x-o.x)*(b.z-o.z)-(a.z-o.z)*(b.x-o.x),lower=[],upper=[];
    for(const p of pts){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],p)<=1e-9)lower.pop();lower.push(p)}
    for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],p)<=1e-9)upper.pop();upper.push(p)}
    lower.pop();upper.pop();return [...lower,...upper];
  }
  function plateSection(item,clearance=DOOR_CLEARANCE_MM){
    const g=Math.max(0,Number(clearance)||0),profile=item?.colliderStatus==='verified-profile'&&Array.isArray(item.colliderProfileXZMm)&&item.colliderProfileXZMm.length>=3?item.colliderProfileXZMm:null;
    if(profile){
      const base=profile.map(p=>({x:item.x+Number(p.x),z:20+Number(p.z)}));
      if(g<=1e-9)return convexHull(base);
      const expanded=[];for(const p of base)for(const dx of [-g,g])for(const dz of [-g,g])expanded.push({x:p.x+dx,z:p.z+dz});
      return convexHull(expanded);
    }
    const z0=20-g,z1=20+item.depth+g;
    return [{x:item.x-g,z:z0},{x:item.x+item.w+g,z:z0},{x:item.x+item.w+g,z:z1},{x:item.x-g,z:z1}];
  }
  function pairSweepCollision(p,door,plate,options={}){
    const clearance=Math.max(0,Number(options.clearanceMm??DOOR_CLEARANCE_MM)||0);
    if(!intervalOverlap(door.y,door.y+door.h,plate.y,plate.y+plate.h,clearance))return null;
    const rawFrom=Number(options.fromAngle??0),rawTo=Number(options.toAngle??Math.max(105,Number(p.doorAngle)||0)),from=clamp(Math.min(rawFrom,rawTo),0,120,0),to=clamp(Math.max(rawFrom,rawTo),0,120,105),step=Math.max(.25,Math.min(5,Number(options.stepDeg??DOOR_SWEEP_STEP_DEG)||DOOR_SWEEP_STEP_DEG)),target=plateSection(plate,clearance),steps=Math.max(1,Math.ceil((to-from)/step));
    for(let i=0;i<=steps;i++){const angle=i===steps?to:from+(to-from)*i/steps;if(polygonsOverlap(doorSection(p,door,angle),target)){const dimensionsVerified=door.dimensionStatus==='verified'&&plate.dimensionStatus==='verified',doorProfileUsed=door.colliderStatus==='verified-profile'&&Array.isArray(door.colliderProfileXZMm)&&door.colliderProfileXZMm.length>=3,plateProfileUsed=plate.colliderStatus==='verified-profile'&&Array.isArray(plate.colliderProfileXZMm)&&plate.colliderProfileXZMm.length>=3,profileVerified=doorProfileUsed&&plateProfileUsed;return {doorId:door.id,plateId:plate.id,doorRef:door.ref||door.typeId||door.id,plateRef:plate.ref||plate.typeId||plate.id,angle:Math.round(angle*1000)/1000,clearanceMm:clearance,geometryStatus:dimensionsVerified?'verified-envelope':'approximate-envelope',colliderStatus:profileVerified?'verified-profile':'conservative-envelope',doorProfileUsed,plateProfileUsed}}}
    return null;
  }
  function doorClearance(p,options={}){
    const items=Array.isArray(p?.items)?p.items:[],onlyId=options.itemId||null,doors=items.filter(i=>physicalSurface(i)==='door'),plates=items.filter(i=>physicalSurface(i)==='plate');
    for(const door of doors)for(const plate of plates){if(onlyId&&door.id!==onlyId&&plate.id!==onlyId)continue;const collision=pairSweepCollision(p,door,plate,options);if(collision)return {ok:false,code:'door-sweep-collision',reason:`Kapak kapanış hacmi ${collision.doorRef} ile ${collision.plateRef} arasında çakışıyor. En az ${collision.clearanceMm} mm açıklık bırakın.`,collision}}
    return {ok:true,code:'door-clear',clearanceMm:Math.max(0,Number(options.clearanceMm??DOOR_CLEARANCE_MM)||0),fromAngle:Number(options.fromAngle??0),toAngle:Number(options.toAngle??Math.max(105,Number(p?.doorAngle)||0))};
  }
  function check(p,item,ignoreId=item.id){
    if(!['door','plate','rail','external'].includes(item.mount))return {ok:false,reason:'Montaj yüzeyini seçin.'};
    if(Array.isArray(item.allowedPanelMounts)&&item.allowedPanelMounts.length&&!item.allowedPanelMounts.includes(item.mount))return {ok:false,reason:'Bu doğrulanmış ürün seçilen montaj yüzeyi için uygun değil.'};
    if(item.mount==='external')return item.x>=-180&&item.y>=-180&&item.x+item.w<=p.width+180&&item.y+item.h<=p.height+180?{ok:true}:{ok:false,reason:'Dış beslemeyi pano yakınında tutun.'};
    if(item.x<20||item.y<20||item.x+item.w>p.width-20||item.y+item.h>p.height-20)return {ok:false,reason:'Malzeme pano sınırları içinde kalmalı.'};
    if(item.depth>p.depth-25)return {ok:false,reason:'Malzeme pano derinliğine sığmıyor.'};
    if(item.mount==='rail'){
      const rail=p.rails.find(r=>r.id===item.railId);if(!rail)return {ok:false,reason:'Önce bir DIN rayı ekleyin ve malzemeyi rayın üzerine bırakın.'};
      if(item.x<rail.x||item.x+item.w>rail.x+rail.length)return {ok:false,reason:'Malzeme rayın uzunluğuna sığmıyor.'};
    }
    const sameSurface=b=>(item.mount==='door')===(b.mount==='door');
    if(p.items.some(b=>b.id!==ignoreId&&sameSurface(b)&&overlap(item,b)))return {ok:false,reason:'Bu konumda başka bir malzeme var.'};
    if(item.mount!=='door'&&p.ducts.some(d=>!d.kind&&overlap(item,{...d,w:d.vertical?d.width:d.length,h:d.vertical?d.length:d.width},0)))return {ok:false,reason:'Malzeme kablo kanalının üzerine yerleştirilemez.'};
    if(item.mount!=='external'){
      const candidate={...p,items:[...p.items.filter(b=>b.id!==ignoreId),item]},closure=doorClearance(candidate,{itemId:item.id});
      if(!closure.ok)return closure;
    }
    return {ok:true};
  }
  function proposal(p,item,x,y,mount=item.mount){
    const result={...item,mount,x:snap(x),y:snap(y)};delete result.railId;
    if(mount==='rail'){
      const rails=p.rails.filter(r=>result.x+result.w>=r.x&&result.x<=r.x+r.length).sort((a,b)=>Math.abs(a.y-(y+item.h/2))-Math.abs(b.y-(y+item.h/2)));
      const rail=rails[0];if(rail&&Math.abs(rail.y-(y+item.h/2))<=90){result.railId=rail.id;result.y=rail.y-item.h/2;result.x=clamp(result.x,rail.x,rail.x+rail.length-item.w)}
    }
    return {...check(p,result),item:result};
  }
  function addItem(p,d,x,y,mount){
    const eligibility=Physical&&typeof Physical.panelEligibility==='function'?Physical.panelEligibility(d):null;
    if(eligibility?.eligible===false)return {ok:false,reason:'Bu kayıt fiziksel cihazın şematik parçasıdır. Pano yerleşiminde ana fiziksel ürünü kullanın.',primaryComponentId:eligibility.primaryComponentId};
    const dimensions=spec(d),item={id:uid('part'),typeId:d.id,ref:(d.refPrefix||'A')+(p.items.length+1),...dimensions,mount:mount||dimensions.mount};
    const result=proposal(p,item,x-item.w/2,y-item.h/2,item.mount);if(result.ok)p.items.push(result.item);return result;
  }
  function addRail(p,x=40,y=150,length=p.width-80){const r={id:uid('rail'),x:snap(clamp(x,20,p.width-70)),y:snap(clamp(y,40,p.height-40)),length:clamp(length,50,p.width-40)};r.length=Math.min(r.length,p.width-20-r.x);p.rails.push(r);return r}
  function remove(p,ids){const set=new Set(ids);p.items=p.items.filter(i=>!set.has(i.id));p.rails=p.rails.filter(r=>!set.has(r.id));p.ducts=p.ducts.filter(r=>!set.has(r.id));Wiring.remove(p,ids);for(const i of p.items)if(i.railId&&set.has(i.railId)){i.mount='plate';delete i.railId}}
  function moveRail(p,id,dx,dy){
    const r=p.rails.find(r=>r.id===id);if(!r)return {ok:false};const nx=snap(r.x+dx),ny=snap(r.y+dy),delta={x:nx-r.x,y:ny-r.y};
    if(nx<20||nx+r.length>p.width-20||ny<40||ny>p.height-40)return {ok:false,reason:'Ray pano sınırları içinde kalmalı.'};
    const candidate=JSON.parse(JSON.stringify(p)),rail=candidate.rails.find(x=>x.id===id);rail.x=nx;rail.y=ny;
    for(const item of candidate.items.filter(i=>i.railId===id)){item.x+=delta.x;item.y+=delta.y}
    for(const item of candidate.items.filter(i=>i.railId===id)){const result=check(candidate,item);if(!result.ok)return result}
    Object.assign(r,rail);for(const i of p.items.filter(i=>i.railId===id))Object.assign(i,candidate.items.find(c=>c.id===i.id));return {ok:true};
  }
  function resize(p,width,height,depth){
    const next={...p,width:clamp(width,200,2400,600),height:clamp(height,200,2400,800),depth:clamp(depth,100,800,220)};
    for(const i of next.items){const result=check(next,i);if(!result.ok)return result}
    if(next.rails.some(r=>r.x+r.length>next.width-20||r.y>next.height-40)||next.ducts.some(d=>d.x+(d.vertical?d.width:d.length)>next.width-20||d.y+(d.vertical?d.length:d.width)>next.height-20))return {ok:false,reason:'Önce dışarıda kalacak ray, kanal ve malzemeleri taşıyın.'};
    Object.assign(p,next);return {ok:true};
  }
  function matrix(p,camera,surface='plate',z=20){
    const yaw=(camera.yaw||0)*Math.PI/180,pitch=(camera.pitch||0)*Math.PI/180,angle=(camera.view==='door'?0:p.doorAngle)*Math.PI/180;
    const project=(x,y,z)=>({x:x*Math.cos(yaw)+z*Math.sin(yaw),y:y*Math.cos(pitch)-(-x*Math.sin(yaw)+z*Math.cos(yaw))*Math.sin(pitch)});
    const world=(x,y)=>surface==='door'?{x:x*Math.cos(angle),y,z:p.depth+x*Math.sin(angle)}:{x,y,z};
    const point=(x,y)=>{const q=world(x,y),r=project(q.x,q.y,q.z);return {x:r.x*camera.scale+camera.x,y:r.y*camera.scale+camera.y}};
    const o=point(0,0),a=point(1,0),b=point(0,1);return {a:a.x-o.x,b:a.y-o.y,c:b.x-o.x,d:b.y-o.y,e:o.x,f:o.y};
  }
  function project(m,x,y){return {x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}}
  function unproject(m,x,y){const det=m.a*m.d-m.b*m.c;if(Math.abs(det)<.02)return null;return {x:(m.d*(x-m.e)-m.c*(y-m.f))/det,y:(-m.b*(x-m.e)+m.a*(y-m.f))/det}}
  const transform=m=>`matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`;
  function fit(p,width,height,view='3d'){
    const camera={x:0,y:0,scale:1,yaw:view==='3d'?-18:0,pitch:view==='3d'?10:0,view};
    const points=[];for(const surface of view==='door'?['door']:view==='plate'?['plate']:['plate','door'])for(const x of [0,p.width])for(const y of [0,p.height])points.push(project(matrix(p,camera,surface,surface==='plate'?p.depth:20),x,y));
    const left=Math.min(...points.map(p=>p.x),0),right=Math.max(...points.map(p=>p.x),p.width),top=Math.min(...points.map(p=>p.y),0),bottom=Math.max(...points.map(p=>p.y),p.height);
    camera.scale=Math.max(.15,Math.min(1.4,(width-90)/(right-left),(height-80)/(bottom-top)));camera.x=(width-(right-left)*camera.scale)/2-left*camera.scale;camera.y=(height-(bottom-top)*camera.scale)/2-top*camera.scale;return camera;
  }
  function render(p,byId,camera,selection=new Set(),ghost=null,draft=null){
    const selected=id=>selection.has(id)?' panel-selected':'',plate=matrix(p,camera,'plate',20),front=matrix(p,camera,'plate',p.depth),door=matrix(p,camera,'door'),view=camera.view;
    const plane=(m,x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#627587" stroke-width="1.2" ${extra} transform="${transform(m)}"/>`;
    const poly=(pts,fill)=>`<polygon points="${pts.map(p=>p.x+','+p.y).join(' ')}" fill="${fill}" stroke="#6a7c8b" stroke-width="1.2"/>`;
    const screw=(x,y,r=4)=>`<g transform="translate(${x} ${y})"><circle cy="1" r="${r+1}" fill="#4a5155" opacity=".25"/><circle r="${r}" fill="url(#panel-screw)" stroke="#667077" stroke-width=".65"/><path d="M${-r*.55} 0H${r*.55}M0 ${-r*.55}V${r*.55}" stroke="#424b50" stroke-width=".85"/></g>`;
    let art=`<defs>
      <linearGradient id="panel-coat" x1="0" y1="0" x2="100%" y2="45%"><stop stop-color="#eff0ec"/><stop offset=".42" stop-color="#d8dcd8"/><stop offset=".84" stop-color="#c8ceca"/><stop offset="1" stop-color="#eef0eb"/></linearGradient>
      <linearGradient id="panel-metal" x1="0" y1="0" x2="100%" y2="60%"><stop stop-color="#dce1e2"/><stop offset=".27" stop-color="#b5bfc2"/><stop offset=".5" stop-color="#e8ecec"/><stop offset=".72" stop-color="#c3cbcd"/><stop offset="1" stop-color="#a9b5b9"/></linearGradient>
      <linearGradient id="panel-cavity" x2="100%"><stop stop-color="#646f70"/><stop offset=".12" stop-color="#a7b2b0"/><stop offset=".75" stop-color="#c5ceca"/><stop offset="1" stop-color="#e5e9e2"/></linearGradient>
      <linearGradient id="panel-lip" y2="100%" x2="0"><stop stop-color="#fcfcf7"/><stop offset=".24" stop-color="#d5dbd5"/><stop offset=".7" stop-color="#bbc4bd"/><stop offset="1" stop-color="#74837e"/></linearGradient>
      <linearGradient id="panel-handle" x2="100%"><stop stop-color="#111a1c"/><stop offset=".25" stop-color="#566063"/><stop offset=".55" stop-color="#303c40"/><stop offset="1" stop-color="#0e161a"/></linearGradient>
      <radialGradient id="panel-screw" cx="35%" cy="25%"><stop stop-color="#fff"/><stop offset=".5" stop-color="#c5ced0"/><stop offset="1" stop-color="#77868c"/></radialGradient>
      <linearGradient id="rail-metal" x2="0" y2="100%"><stop stop-color="#6e7c82"/><stop offset=".2" stop-color="#fbffff"/><stop offset=".36" stop-color="#a1b0b7"/><stop offset=".72" stop-color="#e6eef1"/><stop offset="1" stop-color="#687b82"/></linearGradient>
      <pattern id="panel-brushed" width="7" height="6" patternUnits="userSpaceOnUse"><path d="M0 .5H7M2 3H6" stroke="#fff" stroke-width=".45" opacity=".26"/><path d="M0 4.5H5" stroke="#667c83" stroke-width=".3" opacity=".14"/></pattern>
    </defs>`;
    if(view!=='door'){
      const back=matrix(p,camera,'plate',0);
      art+=plane(back,3,5,p.width,p.height,'#233c43','rx="6" opacity=".18" pointer-events="none"');
      art+=plane(back,0,0,p.width,p.height,'url(#panel-coat)','rx="4"');
      if(view==='3d')for(const [index,[a,b]] of [[[0,0],[p.width,0]],[[0,0],[0,p.height]],[[0,p.height],[p.width,p.height]],[[p.width,0],[p.width,p.height]]].entries())art+=poly([project(back,...a),project(front,...a),project(front,...b),project(back,...b)],['#dce1da','url(#panel-cavity)','#9eada5','#c4cdc6'][index]);
      art+=plane(plate,14,15,p.width-28,p.height-28,'#53675e','rx="4" opacity=".25" pointer-events="none"');
      art+=plane(plate,16,16,p.width-32,p.height-32,'url(#panel-metal)','data-panel-surface="plate" rx="3"');
      art+=`<g class="panel-mounting-detail" transform="${transform(plate)}" pointer-events="none"><rect x="17" y="17" width="${p.width-34}" height="${p.height-34}" rx="3" fill="url(#panel-brushed)"/><path d="M17 ${p.height-18}V17H${p.width-18}" fill="none" stroke="#f8ffff" stroke-width="1.5"/><path d="M${p.width-17} 18V${p.height-17}H18" fill="none" stroke="#7c8f93" stroke-width="1.5"/>`+[30,p.width-30].flatMap(x=>[30,p.height-30].map(y=>screw(x,y,4.5))).join('')+`<circle cx="45" cy="${p.height-45}" r="7" fill="#b59b55" stroke="#776b43"/><circle cx="45" cy="${p.height-45}" r="3" fill="url(#panel-screw)"/><path d="M57 ${p.height-50}v8m-4 0h8m-6 3h4m-3 3h2" stroke="#626c48" fill="none"/></g>`;
      for(const duct of p.ducts.filter(d=>!d.kind)){const w=duct.vertical?duct.width:duct.length,h=duct.vertical?duct.length:duct.width;art+=`<g data-panel-id="${esc(duct.id)}" class="panel-part${selected(duct.id)}" transform="${transform(plate)}"><rect x="${duct.x}" y="${duct.y}" width="${w}" height="${h}" fill="#d1d9df" stroke="#8b9eab"/>`;for(let t=5;t<(duct.vertical?h:w);t+=12)art+=duct.vertical?`<path d="M${duct.x} ${duct.y+t}h8m${w-16} 0h8" stroke="#8194a2" stroke-width="4"/>`:`<path d="M${duct.x+t} ${duct.y}v8m0 ${h-16}v8" stroke="#8194a2" stroke-width="4"/>`;art+='</g>'}
      for(const rail of p.rails){art+=`<g data-panel-id="${esc(rail.id)}" class="panel-part${selected(rail.id)}" transform="${transform(plate)}"><rect x="${rail.x}" y="${rail.y-17.5}" width="${rail.length}" height="35" fill="url(#rail-metal)" stroke="#738795"/><path d="M${rail.x} ${rail.y-10}h${rail.length}M${rail.x} ${rail.y+10}h${rail.length}" stroke="#ebf2f6" stroke-width="2"/>`;for(let x=rail.x+10;x<rail.x+rail.length-5;x+=24)art+=`<rect x="${x}" y="${rail.y-3}" width="12" height="6" rx="3" fill="#6c8393"/>`;art+='</g>'}
    }
    function itemArt(item,surface){
      const d=byId[item.typeId];if(!d)return '';const m=matrix(p,camera,surface,surface==='door'?p.depth:20+item.depth),base=matrix(p,camera,surface,20),x=item.x,y=item.y,w=item.w,h=item.h;
      let out='';if(surface!=='door'&&view==='3d')out+=poly([project(base,x+w,y),project(m,x+w,y),project(m,x+w,y+h),project(base,x+w,y+h)],'#5f7585')+poly([project(base,x,y+h),project(m,x,y+h),project(m,x+w,y+h),project(base,x+w,y+h)],'#7d8e9b');
      const native=d.designMaterial||d.materialSymbol||d.id==='abb-acs800-r5',drawing={...d,w:native?d.w:w+16,h:native?d.h:h+16,pins:[]},fit=native?aspectPlacement(x,y,w,h,d.w,d.h,'center'):null,placement=native?`translate(${fit.x} ${fit.y}) scale(${fit.scale})`:`translate(${x-8} ${y-8})`,id=esc(item.id),flipped=m.a*m.d-m.b*m.c<0;
      out+=`<g data-panel-id="${id}" class="panel-part${selected(item.id)}" transform="${transform(m)}"><rect class="panel-hit" x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#f2f5f711" stroke="${selection.has(item.id)?'#0c93dd':'#526b7a'}" stroke-width="${selection.has(item.id)?3:.6}"/><g transform="${placement}">${flipped?'<g transform="translate('+drawing.w+' 0) scale(-1 1)">':''}${Materials.markup(drawing,{id:'panel-'+item.id,state:false})}${flipped?'</g>':''}</g><g transform="translate(${x+w/2} ${y+h+24})${flipped?' scale(-1 1)':''}"><text x="0" y="0" text-anchor="middle" fill="#253d4a" font-family="Arial" font-size="9" stroke="white" stroke-width="2" paint-order="stroke">${esc(item.ref)}</text></g></g>`;return out;
    }
    if(view!=='door')for(const item of p.items.filter(i=>i.mount!=='door'))art+=itemArt(item,'plate');
    if(view!=='door'){
      art+=Wiring.render(p,byId,camera,{matrix,project},selection,draft,'plate');
      if(view==='plate'||p.doorAngle>=12)for(const d of p.ducts.filter(d=>d.kind)){const w=d.vertical?d.width:d.length,h=d.vertical?d.length:d.width;let shape='';if(d.kind==='gland'){shape=`<rect x="${d.x}" y="${d.y+8}" width="${w}" height="${h-16}" rx="7" fill="#abb6be" stroke="#43505c" stroke-width="2"/><path d="M${d.x-3} ${d.y+17}h${w+6}v14h-${w+6}Z" fill="#71828e" stroke="#43505c"/><rect x="${d.x+w*.35}" y="${d.y}" width="${w*.3}" height="${h}" rx="4" fill="#18242c"/>`}else{shape=`<rect x="${d.x}" y="${d.y}" width="${w}" height="${h}" rx="8" fill="#9caeb322" stroke="#697b86"/>`;for(let t=4;t<(d.vertical?h:w)-4;t+=7)shape+=d.vertical?`<path d="M${d.x} ${d.y+t}l${w} 5" stroke="#536572" stroke-width="3"/>`:`<path d="M${d.x+t} ${d.y}l5 ${h}" stroke="#536572" stroke-width="3"/>`}
      art+=`<g data-panel-id="${esc(d.id)}" class="panel-part${selected(d.id)}" transform="${transform(plate)}">${shape}</g>`}
      
      if(view==='plate'||p.doorAngle>=12)for(const d of p.ducts.filter(d=>d.coverClosed))art+=`<g data-panel-id="${esc(d.id)}" class="panel-part${selected(d.id)}" transform="${transform(plate)}"><rect x="${d.x}" y="${d.y}" width="${d.vertical?d.width:d.length}" height="${d.vertical?d.length:d.width}" fill="#c4ced6" stroke="#7e8e9b" stroke-width="2"/><path d="M${d.x+4} ${d.y+4}h${(d.vertical?d.width:d.length)-8}" stroke="#eef3f8" stroke-width="2"/></g>`;
    }
    if(view!=='door'){
      const rim=view==='3d'?front:plate;
      if(view==='3d'){
        const back=matrix(p,camera,'plate',0),x=(camera.yaw||0)<0?p.width:0;
        // The near enclosure walls occlude the recessed plate, also with the door shut.
        art+='<g class="panel-near-walls" pointer-events="none">'+poly([project(back,x,0),project(front,x,0),project(front,x,p.height),project(back,x,p.height)],'url(#panel-coat)');
        const y=(camera.pitch||0)>=0?p.height:0;
        art+=poly([project(back,0,y),project(front,0,y),project(front,p.width,y),project(back,p.width,y)],'#aeb9b1')+'</g>';
      }
      art+=`<g class="panel-enclosure-rim" transform="${transform(rim)}" pointer-events="none"><path d="M0 0H${p.width}V${p.height}H0Z M12 12V${p.height-12}H${p.width-12}V12Z" fill-rule="evenodd" fill="url(#panel-lip)" stroke="#7b8b81" stroke-width="1"/><rect x="3" y="3" width="${p.width-6}" height="${p.height-6}" rx="2" fill="none" stroke="#f4f7ee" stroke-width="1.5"/><rect x="12" y="12" width="${p.width-24}" height="${p.height-24}" rx="2" fill="none" stroke="#64756b" stroke-width="2.4"/>`+[p.height*.2,p.height*.8].map(y=>`<g class="panel-hinge"><rect x="-3" y="${y-20}" width="19" height="40" rx="2" fill="url(#panel-metal)" stroke="#6c7775"/><rect x="-6" y="${y-25}" width="9" height="50" rx="3" fill="url(#panel-lip)" stroke="#77817b"/>${screw(10,y-12,2.4)}${screw(10,y+12,2.4)}</g>`).join('')+'</g>';
    }
    if(view!=='plate'){
      art+=plane(door,3,4,p.width,p.height,'#21332c','rx="4" opacity=".22" pointer-events="none"');
      art+=plane(door,0,0,p.width,p.height,'url(#panel-coat)','data-panel-surface="door" rx="4"');
      art+=`<g class="panel-door-detail" transform="${transform(door)}" pointer-events="none"><path d="M3 ${p.height-3}V3H${p.width-3}" stroke="#fffef7" stroke-width="2.4" fill="none"/><path d="M${p.width-3} 3V${p.height-3}H3" stroke="#89968c" stroke-width="2.4" fill="none"/><rect x="11" y="11" width="${p.width-22}" height="${p.height-22}" rx="4" fill="none" stroke="#a4ada4" stroke-width="1.2"/>`;
      if(view==='3d'&&p.doorAngle>85)art+=`<rect class="panel-door-gasket" x="18" y="18" width="${p.width-36}" height="${p.height-36}" rx="7" fill="none" stroke="#3e4b46" stroke-width="6"/><rect x="21" y="21" width="${p.width-42}" height="${p.height-42}" rx="5" fill="none" stroke="#6d7972" stroke-width="1.2"/>`;
      art+=`<g class="panel-door-handle" transform="translate(${p.width-37} ${p.height/2-44})"><rect x="2" y="2" width="23" height="88" rx="10" fill="#2a3b32" opacity=".25"/><rect width="23" height="88" rx="9" fill="url(#panel-handle)" stroke="#1c2927"/><path d="M7 9v48q0 8 5 8h4" stroke="#7f8986" stroke-width="2" fill="none"/><circle cx="11.5" cy="74" r="5" fill="url(#panel-screw)" stroke="#171f1e"/><path d="M11.5 72v4" stroke="#1b2625" stroke-width="1.4"/></g>`+[p.height*.2,p.height*.8].map(y=>`<rect x="-2" y="${y-19}" width="8" height="38" rx="2" fill="url(#panel-metal)" stroke="#76847a"/>`).join('')+'</g>';
      for(const item of p.items.filter(i=>i.mount==='door'))art+=itemArt(item,'door');
      art+=Wiring.render(p,byId,camera,{matrix,project},selection,draft,'door');
    }
    if(ghost){const m=matrix(p,camera,ghost.item.mount==='door'?'door':'plate',20);art+=plane(m,ghost.item.x,ghost.item.y,ghost.item.w,ghost.item.h,ghost.ok?'#0ca97e44':'#ff423d44','pointer-events="none" stroke-dasharray="6 4"')}
    return art;
  }
  function proportionAudit(p,byId,options={}){
    const ratioTolerance=Math.max(0,Number(options.ratioTolerance??0.03)||0),mmTolerance=Math.max(0,Number(options.mmTolerance??1)||0),mismatches=[],checked=[];
    for(const item of Array.isArray(p?.items)?p.items:[]){
      const d=byId?.[item.typeId];if(!d)continue;
      const eligibility=Physical&&typeof Physical.panelEligibility==='function'?Physical.panelEligibility(d):null;
      if(eligibility?.eligible===false)continue;
      const physical=Physical&&typeof Physical.panelSpec==='function'?Physical.panelSpec(d):null;
      if(!physical||physical.physicalDimensionStatus!=='verified')continue;
      const expected={w:Number(physical.physicalWidthMm),h:Number(physical.physicalHeightMm),depth:Number(physical.physicalDepthMm)},actual={w:Number(item.w),h:Number(item.h),depth:Number(item.depth)};
      if(![expected.w,expected.h,expected.depth,actual.w,actual.h,actual.depth].every(Number.isFinite))continue;
      const tolerance=k=>Math.max(mmTolerance,Math.abs(expected[k])*ratioTolerance);
      const delta={w:actual.w-expected.w,h:actual.h-expected.h,depth:actual.depth-expected.depth};
      const scale={x:actual.w/expected.w,y:actual.h/expected.h,z:actual.depth/expected.depth};
      const aspectExpected=expected.w/expected.h,aspectActual=actual.w/actual.h,aspectError=Math.abs(aspectActual/aspectExpected-1);
      const axes=['w','h','depth'].filter(k=>Math.abs(delta[k])>tolerance(k));
      const row={itemId:item.id,typeId:item.typeId,ref:item.ref||null,productKey:physical.physicalProductKey||null,expectedMm:expected,actualMm:actual,deltaMm:delta,scale,aspectError,axes};
      checked.push(row);
      if(axes.length){
        const planarSpread=Math.abs(scale.x-scale.y);
        row.kind=planarSpread>ratioTolerance?'distorted-aspect':'wrong-uniform-scale';
        mismatches.push(row);
      }
    }
    return {ok:mismatches.length===0,checked:checked.length,mismatchCount:mismatches.length,ratioTolerance,mmTolerance,mismatches};
  }
  const api={defaults,normalize,spec,proportionAudit,overlap,doorSection,plateSection,pairSweepCollision,doorClearance,check,proposal,addItem,addRail,remove,moveRail,resize,matrix,project,unproject,fit,render,aspectPlacement,snap,uid,DOOR_CLEARANCE_MM,DOOR_SWEEP_STEP_DEG};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPanel=api;
})(typeof window==='undefined'?globalThis:window);
