/* SC087-093 native UNI-T source correction; SC086 unchanged. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._nativeDcBatchO)return;
const clone=x=>JSON.parse(JSON.stringify(x));
const C=(id,typeId,x,y,extra={})=>({id,typeId,x,y,ref:id.toUpperCase(),label:id.toUpperCase(),rotation:0,state:false,...extra});
let n=0;
const W=(a,p,b,q,m=false)=>({id:'dc-o'+(++n),from:{c:a,p},to:{c:b,p:q},role:m?'MEASURE':'CONTROL',color:m?'#e53935':'#8b5a2b',size:'1.5',points:[],probeLead:m,tutorialHint:a+'/'+p+' → '+b+'/'+q,tutorialWhy:'Sanal ölçüm veya yük yolu için bağlantı.'});
function probes(cs,ws,id,red,black){
 const m=cs.find(c=>c.id===id);if(!m)throw Error('No meter '+id);
 cs.push(C(id+'-red','test-probe-red',m.x+215,m.y+45,{probeTarget:clone(red)}),
         C(id+'-black','test-probe-black',m.x+215,m.y+155,{probeTarget:clone(black)}));
 ws.push(W(id,m.meterPosition===9?'10A':'V',id+'-red','PLUG',true),W(id,'COM',id+'-black','PLUG',true));
}
function make(kind){
 n=0;const cs=[C('g','supply-dc-plus',80,100,{dcVoltage:24,label:'G1 · 24 V DC'})],ws=[];
 const R=(id,x,y,v)=>cs.push(C(id,'resistor',x,y,{resistance:v,label:id.toUpperCase()+' · '+v+' Ω'}));
 const M=(id,x,y,v)=>cs.push(C(id,'unit-ut33d-plus',x,y,{meterPosition:v,label:id.toUpperCase()+' · UNI-T'}));
 if(kind==='ohm'){
  M('a1',315,90,9);R('r',690,140,120);M('v1',725,400,4);
  ws.push(W('g','P','a1','10A',true),W('a1','COM','r','1',true),W('r','2','g','M'),W('v1','V','r','1',true),W('v1','COM','r','2',true));
 }else if(kind==='series'){
  M('a1',310,90,10);R('r1',675,125,100);R('r2',1000,125,220);M('v1',710,400,3);
  ws.push(W('g','P','a1','V',true),W('a1','COM','r1','1',true),W('r1','2','r2','1'),W('r2','2','g','M'),W('v1','V','r1','1',true),W('v1','COM','r1','2',true));
 }else if(kind==='parallel'){
  M('a1',310,90,9);R('r1',705,105,100);R('r2',705,380,220);M('v1',995,390,4);
  ws.push(W('g','P','a1','10A',true),W('a1','COM','r1','1',true),W('a1','COM','r2','1',true),W('r1','2','g','M'),W('r2','2','g','M'),W('v1','V','r1','1',true),W('v1','COM','r1','2',true));
 }else if(kind==='mixed'){
  R('r1',750,140,100);R('r2',1060,80,220);R('r3',1060,365,330);M('a1',310,100,10);M('v1',670,535,3);
  ws.push(W('r1','2','r2','1'),W('r1','2','r3','1'),W('r2','2','g','M'),W('r3','2','g','M'));
  probes(cs,ws,'a1',{c:'g',p:'P'},{c:'r1',p:'1'});probes(cs,ws,'v1',{c:'r1',p:'1'},{c:'r1',p:'2'});
 }else if(kind==='voltage'){
  R('r1',485,140,1000);M('v1',695,345,4);ws.push(W('g','P','r1','1'),W('r1','2','g','M'));
  probes(cs,ws,'v1',{c:'r1',p:'1'},{c:'r1',p:'2'});
 }else if(kind==='current'){
  R('r1',505,155,1000);M('a1',310,345,10);ws.push(W('r1','2','g','M'));
  probes(cs,ws,'a1',{c:'g',p:'P'},{c:'r1',p:'1'});
 }else throw Error('Unknown lab '+kind);
 return {cs,ws};
}
const labs=[
 ['dc-circuits-src-06','ohm','Gerilimi değiştir, akımı ölç, hesabınla karşılaştır.','24 V ve 120 Ω için ideal akım 200 mA.'],
 ['dc-circuits-src-07','series','İki direnç aynı yoldaysa akım her ikisinden de geçer.','100 ve 220 Ω için ideal seri akım 75 mA.'],
 ['dc-circuits-src-08','parallel','Akım iki kola ayrılır ama gerilim her kolda aynıdır.','100 ve 220 Ω paralel iken toplam ideal akım yaklaşık 349 mA.'],
 ['dc-circuits-src-09','mixed','Önce paralel kolları, sonra toplam direnci bul.','R1 100 Ω, R2 220 Ω, R3 330 Ω: ideal 103,45 mA.'],
 ['dc-circuits-src-10','mixed','Akımların bölündüğü düğümü ve gerilim çevresini incele.','Kirchhoff denetiminde toplam ideal akım 103,45 mA.'],
 ['measurement-workshop-src-01','voltage','İki probu taşıyarak gerilim farkını keşfet.','UNI-T DCV 200 V; 1 kΩ yük ve 24 V kaynak.'],
 ['measurement-workshop-src-02','current','Ampermetreyi seri yola al, sonucu ölç ve karşılaştır.','UNI-T DCA 200 mA; 1 kΩ yük ve ideal 24 mA.']
];
for(const [id,kind,summary,goal] of labs){
 const lesson=L.byId[id];if(!lesson?.project)throw Error('No lesson '+id);
 const p=lesson.project,isM=id.startsWith('measurement-workshop-');
 // Preserve previously authored richer UNI-T/DC graphs only for exact known signatures.
 const rich={
  'dc-circuits-src-06':[8,5,1],'dc-circuits-src-07':[9,6,2],
  'dc-circuits-src-08':[9,7,2],'dc-circuits-src-09':[10,8,3],
  'dc-circuits-src-10':[10,8,3],'measurement-workshop-src-01':[5,4,1],
  'measurement-workshop-src-02':[5,3,1]
 }[id];
 if(p.components.some(c=>c.typeId==='arduino-bench-supply')){
  const count=type=>p.components.filter(c=>c.typeId===type).length;
  if(!rich||p.components.length!==rich[0]||p.wires.length!==rich[1]||
     count('resistor')!==rich[2]||count('unit-ut33d-plus')<(id.startsWith('dc-circuits')?2:1)||
     !p.components.some(c=>c.typeId==='test-probe-red')||
     !p.components.some(c=>c.typeId==='test-probe-black'))
    throw Error('Unknown protected DC source: '+id);
  continue;
 }

 const types=isM?['supply-dc-plus','converter-temperature','meter-ammeter']:['supply-dc-plus','push-no','resistor','led'];
 if(p.components.length!==types.length||!types.every(t=>p.components.some(c=>c.typeId===t)))throw Error('Protected non-template graph '+id);
 const b=make(kind);
 lesson.project={...clone(p),components:b.cs,wires:b.ws,junctions:[],tutorialExplore:{type:'dc-native-uni-t',simulationOnly:true,topology:kind}};
 lesson.kind='wiring';lesson.steps=b.ws.filter(w=>!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 lesson.summary=summary;lesson.learningGoal=goal;lesson.explanation=summary+' Önce sonucu tahmin et, sonra sanal multimetre ile karşılaştır.';
 lesson.beginnerSteps=['Kaynağı ve direnci tanı.','UNI-T ölçüm kademesi ve girişini incele.','Simülasyonu çalıştır, sonucu hesapla karşılaştır.'];
 lesson.materials=b.cs.filter(c=>!/^test-probe-/.test(c.typeId)).map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,why:'Sanal devrenin doğrulanabilir bileşeni.'}));
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,sourceStatus:'native-dc-source'};
}
L._nativeDcBatchO=true;
})(typeof window==='undefined'?globalThis:window);