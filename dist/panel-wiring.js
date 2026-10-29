(function(root){
  'use strict';
  const Lines=typeof module==='object'&&module.exports?require('./conductors.js'):root.CCSConductors;
  const Physical=typeof module==='object'&&module.exports?require('./physical-metadata.js'):root.DTSPhysicalMetadata;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const snap=v=>Math.round(v/5)*5,round=v=>Math.round(v*1000)/1000,same=(a,b)=>a&&b&&a.c===b.c&&a.p===b.p;
  const directions={top:{x:0,y:-1},bottom:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
  const surface=i=>i.mount==='door'?'door':'plate';
  function panelDefinition(d){
    if(!d)return d;
    const pins=Physical&&typeof Physical.panelPins==='function'?Physical.panelPins(d):null;
    return Array.isArray(pins)&&pins.length?{...d,pins}:d;
  }
  function panelDefinitions(p,byId){
    const out={...byId};
    for(const item of p?.items||[]){const d=byId?.[item.typeId];if(d)out[item.typeId]=panelDefinition(d)}
    return out;
  }
  function ports(item,d){
    d=panelDefinition(d);
    // Do not silently invent terminal geometry for damaged or incomplete panel items.
    if(!item||![item.x,item.y,item.w,item.h,d?.w,d?.h].every(Number.isFinite)||
       item.w<=0||item.h<=0||d.w<=0||d.h<=0)return [];
    return (Array.isArray(d.pins)?d.pins:[]).filter(pin=>pin&&typeof pin.id==='string'&&
      !!pin.id&&Number.isFinite(pin.x)&&Number.isFinite(pin.y)).map(pin=>{
      const physical=item?.panelGeometryStatus==='ready'&&Physical&&typeof Physical.terminalAnchor==='function'?Physical.terminalAnchor(d,pin.id):null;
      if(physical){
        const side=physical.side,v=directions[side];
        return {c:item.id,p:pin.id,label:pin.label||pin.id,side,v,surface:surface(item),z:20+(Number.isFinite(item?.depth)?item.depth:0),
          geometryStatus:'verified',geometrySource:physical.sourceUrl,
          x:round(item.x+physical.xMm),y:round(item.y+physical.yMm)};
      }
      const side=directions[pin.side]?pin.side:pin.y<=0?'top':pin.y>=d.h?'bottom':pin.x<=0?'left':'right',v=directions[side];
      return {c:item.id,p:pin.id,label:pin.label||pin.id,side,v,surface:surface(item),z:20+(Number.isFinite(item?.depth)?item.depth:0),
        geometryStatus:'approximate',geometrySource:null,
        x:round(item.x+(side==='left'?0:side==='right'?item.w:pin.x/d.w*item.w)),
        y:round(item.y+(side==='top'?0:side==='bottom'?item.h:pin.y/d.h*item.h))};
    }).filter(port=>Number.isFinite(port.x)&&Number.isFinite(port.y)&&
      Number.isFinite(port.z)&&!!port.v);
  }
  function endpoint(p,byId,ref){const i=p.items.find(i=>i.id===ref?.c);return i&&ports(i,byId[i.typeId]).find(t=>t.p===ref.p)||null}
  function normalize(p,byId){
    if(p.wires===undefined)p.wires=[];
    if(!Array.isArray(p.wires)||p.wires.length>20000)throw Error('Pano kablo listesi geçersiz veya çok büyük.');
    const ids=new Set([...p.items,...p.rails,...p.ducts].map(i=>i.id));
    for(const w of p.wires){
      if(!w||typeof w.id!=='string'||ids.has(w.id)||!w.from||!w.to||same(w.from,w.to)||![w.from,w.to].every(r=>typeof r.c==='string'&&typeof r.p==='string'&&p.items.some(i=>i.id===r.c)&&(!byId||endpoint(p,byId,r))))throw Error('Pano kablosunun bağlı olduğu terminal geçersiz.');
      ids.add(w.id);w.points=w.points||[];
      if(!Array.isArray(w.points)||w.points.length>1000||w.points.some(q=>!q||!['plate','door'].includes(q.surface)||!Number.isFinite(q.x)||!Number.isFinite(q.y)||Math.abs(q.x)>10000||Math.abs(q.y)>10000))throw Error('Pano kablosunun güzergâhı geçersiz.');
      w.color=/^#[0-9a-f]{6}$/i.test(w.color||'')?w.color.toLowerCase():'#808080';w.size=Lines.sizeLabel(w.size);
    }
    if(byId)synchronize(p,byId);return p;
  }
  const graph=p=>({...p,components:p.items,junctions:[]});
  function copyLineState(p,g){for(const k of ['colorRoles','colorLocks','lineColors','colorSizes','conductorVersion'])p[k]=g[k]}
  // Panel conductors are explicitly identified even without a schematic supply
  // symbol. Keep those declared nets distinct when the shared line planner runs.
  function synchronize(p,byId){for(const w of p.wires||[])if(w.role)w.roleBound=true;const styles=new Map((p.wires||[]).map(w=>[w.id,{color:w.styleColor||w.color,size:w.styleSize||w.size}]));const g=graph(p),defs=panelDefinitions(p,byId);Lines.initialize(g,defs);copyLineState(p,g);for(const w of p.wires||[]){const s=styles.get(w.id);w.color=w.styleColor=/^#[0-9a-f]{6}$/i.test(s?.color||'')?s.color:'#808080';w.size=w.styleSize=Lines.sizeLabel(s?.size)}}
  function connect(p,byId,from,to,color='#e53935',size='1,5 mm²',points=[]){
    if(!Array.isArray(points)||points.length>1000||points.some(q=>!q||
       !Number.isFinite(q.x)||!Number.isFinite(q.y)||
       Math.abs(q.x)>10000||Math.abs(q.y)>10000||
       !['plate','door'].includes(q.surface)))
      return {ok:false,reason:'Pano kablo güzergâh noktaları geçersiz.'};
    if(!endpoint(p,byId,from)||!endpoint(p,byId,to))return {ok:false,reason:'İki malzemenin bağlantı terminallerini seçin.'};
    if(same(from,to))return {ok:false,reason:'Kablonun diğer ucu için farklı bir terminal seçin.'};
    if((p.wires||[]).some(w=>same(w.from,from)&&same(w.to,to)||same(w.to,from)&&same(w.from,to)))return {ok:false,reason:'Bu iki terminal zaten bağlı.'};
    const g=graph(p),defs=panelDefinitions(p,byId),plan=Lines.plan(g,defs,from,to,color,size);if(!plan.ok)return plan;
    const wire={id:'pw-'+Date.now().toString(36)+Math.random().toString(36).slice(2,7),from:{c:from.c,p:from.p},to:{c:to.c,p:to.p},color:/^#[0-9a-f]{6}$/i.test(color)?color:plan.color,role:plan.role,size:Lines.sizeLabel(size),points:points.map(q=>({x:snap(q.x),y:snap(q.y),surface:q.surface}))};
    if(!routes(p,byId,wire).length)return {ok:false,reason:'Terminal çıkışında yer açın veya ara noktalarla güzergâh seçin.'};
    p.wires=p.wires||[];p.wires.push(wire);synchronize(p,byId);return {ok:true,wire};
  }
  function recolor(p,byId,id,color,size){const w=p.wires.find(w=>w.id===id);if(!w||!/^#[0-9a-f]{6}$/i.test(color))return {ok:false,reason:'Geçerli bir renk seçin.'};w.color=w.styleColor=color;w.size=w.styleSize=Lines.sizeLabel(size);return {ok:true}}
  function setSize(p,color,size){for(const w of p.wires||[])if(w.color===color)w.size=w.styleSize=Lines.sizeLabel(size);p.colorSizes={...p.colorSizes,[color]:Lines.sizeLabel(size)}}
  function remove(p,ids,byId){const set=new Set(ids);p.wires=(p.wires||[]).filter(w=>!set.has(w.id)&&!set.has(w.from.c)&&!set.has(w.to.c));if(byId)synchronize(p,byId)}
  const tidy=points=>{
    const out=[];for(const q of points){const p={x:round(q.x),y:round(q.y)},a=out.at(-1);if(!a||a.x!==p.x||a.y!==p.y)out.push(p)}
    for(let i=1;i<out.length-1;){const a=out[i-1],b=out[i],c=out[i+1];if((a.x===b.x&&b.x===c.x&&(b.y-a.y)*(c.y-b.y)>=0)||(a.y===b.y&&b.y===c.y&&(b.x-a.x)*(c.x-b.x)>=0))out.splice(i,1);else i++}return out;
  };
  function blocked(a,b,boxes){return boxes.some(o=>a.x===b.x?a.x>o.l&&a.x<o.r&&Math.max(a.y,b.y)>o.t&&Math.min(a.y,b.y)<o.b:a.y>o.t&&a.y<o.b&&Math.max(a.x,b.x)>o.l&&Math.min(a.x,b.x)<o.r)}
  // Other cables are never obstacles or a routing penalty. Shared cable ducts
  // may carry any number of overlapping conductors; editing one cannot move another.
  function cost(points){
    let value=Math.max(0,points.length-2)*35;
    for(let i=1;i<points.length;i++)value+=Math.abs(points[i].x-points[i-1].x)+Math.abs(points[i].y-points[i-1].y);
    return value;
  }
  // Visibility lanes retain exact terminal coordinates; camera zoom never enters routing.
  function orthogonal(a,b,boxes,p,used=[]){
    const valid=path=>path.every(q=>q.x>=-180&&q.y>=-180&&q.x<=p.width+180&&q.y<=p.height+180)&&path.slice(1).every((q,i)=>!blocked(path[i],q,boxes));
    const trials=[[a,{x:b.x,y:a.y},b],[a,{x:a.x,y:b.y},b]];
    const xs=[a.x,b.x,snap((a.x+b.x)/2),...boxes.flatMap(o=>[o.l,o.r])],ys=[a.y,b.y,snap((a.y+b.y)/2),...boxes.flatMap(o=>[o.t,o.b])];
    for(const gap of [-20,-10,10,20]){xs.push(a.x+gap,b.x+gap);ys.push(a.y+gap,b.y+gap)}
    for(const x of xs)trials.push([a,{x,y:a.y},{x,y:b.y},b]);for(const y of ys)trials.push([a,{x:a.x,y},{x:b.x,y},b]);
    const choices=trials.map(tidy).filter(valid).sort((x,y)=>cost(x,used)-cost(y,used));if(choices.length)return choices[0];
    const X=[...new Set([-180,4,p.width-4,p.width+180,...xs].filter(x=>x>=-180&&x<=p.width+180))].sort((a,b)=>a-b),Y=[...new Set([-180,4,p.height-4,p.height+180,...ys].filter(y=>y>=-180&&y<=p.height+180))].sort((a,b)=>a-b);
    const sx=X.indexOf(a.x),sy=Y.indexOf(a.y),tx=X.indexOf(b.x),ty=Y.indexOf(b.y);if(Math.min(sx,sy,tx,ty)<0)return null;
    const key=(x,y,d)=>x+','+y+','+d,start=key(sx,sy,-1),queue=[{x:sx,y:sy,d:-1,k:start,g:0,f:0}],best=new Map([[start,0]]),prev=new Map();let end=null,guard=0;
    while(queue.length&&guard++<25000){queue.sort((a,b)=>b.f-a.f);const q=queue.pop();if(q.g!==best.get(q.k))continue;if(q.x===tx&&q.y===ty){end=q.k;break}
      for(const [dx,dy,d] of [[1,0,0],[-1,0,0],[0,1,1],[0,-1,1]]){const x=q.x+dx,y=q.y+dy;if(x<0||y<0||x>=X.length||y>=Y.length)continue;const u={x:X[q.x],y:Y[q.y]},v={x:X[x],y:Y[y]};if(blocked(u,v,boxes))continue;const k=key(x,y,d),g=q.g+cost([u,v],used)+(q.d!==-1&&q.d!==d?35:0);if(g<(best.get(k)??Infinity)){best.set(k,g);prev.set(k,q.k);queue.push({x,y,d,k,g,f:g+Math.abs(X[x]-b.x)+Math.abs(Y[y]-b.y)})}}
    }
    if(!end)return null;const path=[];for(let k=end;k;k=prev.get(k)){const [x,y]=k.split(',').map(Number);path.push({x:X[x],y:Y[y]})}return tidy(path.reverse());
  }
  function section(p,from,to,manual,used){
    const boxes=p.items.filter(i=>surface(i)===from.surface).map(i=>({l:i.x-3,r:i.x+i.w+3,t:i.y-3,b:i.y+i.h+3}));
    const clear=q=>!boxes.some(o=>q.x>o.l&&q.x<o.r&&q.y>o.t&&q.y<o.b),escape=q=>{
      if(clear(q))return q;const choices=boxes.flatMap(o=>[{x:o.l,y:q.y},{x:o.r,y:q.y},{x:q.x,y:o.t},{x:q.x,y:o.b}]).filter(t=>t.x>=4&&t.y>=4&&t.x<=p.width-4&&t.y<=p.height-4&&clear(t));return choices.sort((a,b)=>Math.abs(a.x-q.x)+Math.abs(a.y-q.y)-Math.abs(b.x-q.x)-Math.abs(b.y-q.y))[0]||q;
    };
    const stub=t=>({x:t.x+(t.v?.x||0)*12,y:t.y+(t.v?.y||0)*12}),a=escape(stub(from)),b=escape(stub(to)),stops=[a,...manual.map(escape),b],points=[];
    for(let i=1;i<stops.length;i++){const segment=orthogonal(stops[i-1],stops[i],boxes,p,used);if(!segment)return null;points.push(...segment)}
    const z=20,vertices=[{...from,z:from.z||z},{...a,z:from.z||z},...tidy(points).map(q=>({...q,z})),{...b,z:to.z||z},{...to,z:to.z||z}];
    return {surface:from.surface,points:vertices,flat:tidy([from,a,...points,b,to])};
  }
  function accessoryPoints(d){return [{x:d.x+(d.vertical?d.width/2:5),y:d.y+(d.vertical?5:d.width/2),surface:'plate'},{x:d.x+(d.vertical?d.width/2:d.length-5),y:d.y+(d.vertical?d.length-5:d.width/2),surface:'plate'}]}
  function routes(p,byId,w,used={plate:[],door:[]}){
    const a=endpoint(p,byId,w.from),b=endpoint(p,byId,w.to);if(!a||!b)return [];
    const accessory=p.ducts.find(d=>d.id===w.accessoryId),points=accessory?accessoryPoints(accessory):(w.points||[]);
    const manual=s=>points.filter(q=>q.surface===s);
    if(a.surface===b.surface){const r=section(p,a,b,manual(a.surface),used[a.surface]);return r?[r]:[]}
    const lane=[...String(w.id||'')].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0)%12;
    const y=Math.max(30,Math.min(p.height-30,snap((a.y+b.y)/2)+lane*10)),hinge=s=>({x:8,y,z:20,surface:s});
    const first=section(p,a,hinge(a.surface),manual(a.surface),used[a.surface]),last=section(p,hinge(b.surface),b,manual(b.surface),used[b.surface]);return first&&last?[first,last]:[];
  }
  function nearestSegment(points,q,protectEnds=true){
    if(!Array.isArray(points)||points.length<2||!q)return null;let best=null;
    const first=protectEnds?1:0,last=points.length-2-(protectEnds?1:0);
    for(let i=first;i<=last;i++){const a=points[i],b=points[i+1];if(!a||!b)continue;const vertical=Math.abs(a.x-b.x)<.001,horizontal=Math.abs(a.y-b.y)<.001;if(!vertical&&!horizontal)continue;
      const p=vertical?{x:a.x,y:Math.max(Math.min(q.y,Math.max(a.y,b.y)),Math.min(a.y,b.y))}:{x:Math.max(Math.min(q.x,Math.max(a.x,b.x)),Math.min(a.x,b.x)),y:a.y},distance=Math.hypot(q.x-p.x,q.y-p.y);
      if(!best||distance<best.distance)best={segment:i,vertical,horizontal,point:p,distance};
    }return best;
  }
  function moveSegment(p,byId,w,surfaceName,segment,target){
    if(!p||!w||!['plate','door'].includes(surfaceName)||!target)return {ok:false,reason:'Kablo parçası taşınamadı.'};
    const route=routes(p,byId,w).find(r=>r.surface===surfaceName);if(!route)return {ok:false,reason:'Kablo güzergâhı bulunamadı.'};
    const flat=route.flat;if(segment<1||segment>flat.length-3)return {ok:false,reason:'Terminal çıkışındaki sabit kablo parçası taşınamaz.'};
    const a=flat[segment],b=flat[segment+1],vertical=Math.abs(a.x-b.x)<.001,horizontal=Math.abs(a.y-b.y)<.001;if(!vertical&&!horizontal)return {ok:false,reason:'Yalnız yatay veya dikey kablo parçası taşınabilir.'};
    const x=snap(Math.max(-180,Math.min(p.width+180,target.x))),y=snap(Math.max(-180,Math.min(p.height+180,target.y)));
    const shifted=vertical?[{x,y:a.y},{x,y:b.y}]:[{x:a.x,y},{x:b.x,y}],full=tidy([...flat.slice(0,segment+1),...shifted,...flat.slice(segment+1)]);
    const oldPoints=(w.points||[]).map(q=>({...q})),oldAccessory=w.accessoryId;
    w.points=[...oldPoints.filter(q=>q.surface!==surfaceName),...full.slice(1,-1).map(q=>({x:snap(q.x),y:snap(q.y),surface:surfaceName}))];delete w.accessoryId;
    if(!routes(p,byId,w).length){w.points=oldPoints;if(oldAccessory!==undefined)w.accessoryId=oldAccessory;return {ok:false,reason:'Bu konumda geçerli kablo güzergâhı oluşturulamadı.'}}
    return {ok:true,axis:vertical?'x':'y',vertical};
  }
  function rounded(points,radius=5){
    if(points.length<2)return '';let d=`M${points[0].x} ${points[0].y}`;
    for(let i=1;i<points.length-1;i++){const a=points[i-1],b=points[i],c=points[i+1],l=Math.hypot(b.x-a.x,b.y-a.y),n=Math.hypot(c.x-b.x,c.y-b.y);if(!l||!n){d+=` L${b.x} ${b.y}`;continue}const r=Math.min(radius,l/2,n/2);d+=` L${b.x+(a.x-b.x)*r/l} ${b.y+(a.y-b.y)*r/l} Q${b.x} ${b.y} ${b.x+(c.x-b.x)*r/n} ${b.y+(c.y-b.y)*r/n}`}
    return d+` L${points.at(-1).x} ${points.at(-1).y}`;
  }
  function render(p,byId,camera,geometry,selection,draft,layer){
    const {matrix,project}=geometry,visible=s=>camera.view===s||(s==='plate'&&camera.view==='3d'&&p.doorAngle>=12)||(s==='door'&&camera.view==='3d');
    const position=(q,s)=>project(matrix(p,camera,s,q.z||20),q.x,q.y);let art='';
    const path=(d,w,cls='',surfaceName='')=>`<g data-panel-wire="${esc(w.id)}"${surfaceName?` data-panel-wire-surface="${esc(surfaceName)}"`:''} class="panel-wire ${selection.has(w.id)?'panel-wire-selected':''} ${cls}"><title>${esc(w.role||'Kablo')} · ${esc(w.size)} · Yatay/dikey parçayı sürükleyerek taşı</title><path class="panel-wire-shadow" d="${d}" fill="none" stroke="#24343d" stroke-opacity=".4" stroke-width="${(Lines.width(w.size)+1.5)*camera.scale}"/><path d="${d}" fill="none" stroke="${esc(w.color)}" stroke-width="${Lines.width(w.size)*camera.scale}"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${Math.max(.35,Lines.width(w.size)*.2)*camera.scale}"/><path class="panel-wire-hit" d="${d}" fill="none" stroke="transparent" stroke-width="${Math.max(12,Lines.width(w.size)*camera.scale+8)}"/></g>`;
    const wireOrder=[...(p.wires||[]).filter(w=>!selection.has(w.id)),...(p.wires||[]).filter(w=>selection.has(w.id))];
    for(const w of wireOrder){
      const route=routes(p,byId,w);
      for(const s of route)if(s.surface===layer&&visible(s.surface)){art+=path(rounded(s.points.map(q=>position(q,s.surface)),5*camera.scale),w,'',s.surface);if(selection.has(w.id)){const accessory=p.ducts.find(d=>d.id===w.accessoryId),points=(accessory?accessoryPoints(accessory):(w.points||[])).filter(q=>q.surface===layer);const handles=points.length?points:s.flat.slice(1,-1);handles.forEach((q,index)=>{const a=position(q,layer);art+=`<circle data-wire-handle="${esc(w.id)}" data-handle-index="${index}" data-handle-surface="${layer}" data-handle-auto="${!points.length}" cx="${a.x}" cy="${a.y}" r="5" fill="#fff" stroke="#0079c9" stroke-width="2" style="cursor:move"/>`})}}
      if(route.length===2&&camera.view===layer){const first=route[0].surface===layer,s=first?route[0]:route[1],q=position(first?s.points.at(-1):s.points[0],layer),r=first?w.to:w.from,i=p.items.find(i=>i.id===r.c),t=endpoint(p,byId,r);art+=`<text class="panel-wire-continuation" x="${q.x+9*camera.scale}" y="${q.y-4*camera.scale}" font-size="${Math.max(7,7*camera.scale)}" pointer-events="none">↪ ${layer==='plate'?'Kapak':'Pano içi'} · ${esc(i?.ref)}:${esc(t?.label)}</text>`}
      if(route.length===2&&layer==='door'&&camera.view==='3d'&&p.doorAngle>=12){const a=position(route[0].points.at(-1),route[0].surface),b=position(route[1].points[0],route[1].surface),bulge=40*camera.scale;art+=path(`M${a.x} ${a.y} C${a.x-bulge} ${a.y+bulge} ${b.x-bulge} ${b.y+bulge} ${b.x} ${b.y}`,w,'panel-door-loom')}
    }
    if(!visible(layer))return art;
    // Ferrules sit on the actual device plane: a silver sleeve and insulated collar.
    for(const i of p.items.filter(i=>surface(i)===layer))for(const t of ports(i,byId[i.typeId])){
      const pos=position(t,layer),tip=position({...t,x:t.x+t.v.x*12,y:t.y+t.v.y*12},layer),angle=Math.atan2(tip.y-pos.y,tip.x-pos.x)*180/Math.PI,scale=Math.hypot(tip.x-pos.x,tip.y-pos.y)/12;
      const connected=(p.wires||[]).filter(w=>same(w.from,t)||same(w.to,t)),pending=draft&&same(draft.from,t),ref=esc(i.ref+' · '+t.label);
      if(connected.length){const w=connected[0],width=Math.max(3,Math.min(7,Lines.width(w.size)+1.3));art+=`<g class="panel-ferrule" data-ferrule-owner="${esc(i.id)}" data-ferrule-pin="${esc(t.p)}" transform="translate(${pos.x} ${pos.y}) rotate(${angle}) scale(${scale})" pointer-events="none"><rect x="0" y="${-width/2}" width="5" height="${width}" rx=".6" fill="#c8d6df" stroke="#5b6f7d" stroke-width=".55"/><path d="M.5 ${-width/2+.7}h4" stroke="#fff" stroke-width=".7"/><rect x="5" y="${-width/2-1}" width="6" height="${width+2}" rx="1.1" fill="#378fc4" stroke="#175780" stroke-width=".6"/><path d="M6 ${-width/2}h4" stroke="#98d9ff" stroke-width=".7"/></g>`}
      art+=`<g class="panel-terminal ${connected.length?'connected':''} ${pending?'pending':''}" data-panel-terminal="${esc(t.p)}" data-panel-owner="${esc(i.id)}" tabindex="0" role="button" aria-label="${ref} terminali; kablo bağla" transform="translate(${pos.x} ${pos.y})"><title>${ref}${connected.length?' · '+connected[0].role+' · '+connected.length+' kablo':' · Kablo bağlamak için tıkla'}</title><circle class="panel-terminal-hit" r="${Math.max(3.2,5*camera.scale)}" fill="transparent"/><circle r="${Math.max(1.7,2.4*camera.scale)}" fill="${pending?'#ffe469':connected.length?'#bce9fb':'#fff'}" stroke="#1d708f" stroke-width="${Math.max(.7,camera.scale)}"/><text class="panel-terminal-label" x="${t.side==='left'?-7*camera.scale:t.side==='right'?7*camera.scale:4*camera.scale}" y="${t.side==='top'?-5*camera.scale:t.side==='bottom'?9*camera.scale:2*camera.scale}" text-anchor="${t.side==='left'?'end':'start'}" font-size="${Math.max(6,6.5*camera.scale)}">${esc(t.label)}</text></g>`;
    }
    if(draft){const a=endpoint(p,byId,draft.from);if(a&&a.surface===layer){const points=[a,{...a,x:a.x+a.v.x*12,y:a.y+a.v.y*12},...(draft.points||[]).filter(q=>q.surface===layer),...(draft.mouse?.surface===layer?[draft.mouse]:[])];art+=`<path class="panel-wire-draft" d="${rounded(points.map(q=>position(q,layer)))}" fill="none" stroke="${esc(draft.color)}" stroke-width="${Math.max(1.5,2.5*camera.scale)}" stroke-dasharray="7 4" pointer-events="none"/>`}}
    return art;
  }
  const api={accessoryPoints,panelDefinition,panelDefinitions,ports,endpoint,normalize,synchronize,connect,recolor,setSize,remove,routes,nearestSegment,moveSegment,rounded,render,same,surface};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPanelWiring=api;
})(typeof window==='undefined'?globalThis:window);
