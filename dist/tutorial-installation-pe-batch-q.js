/* SC102–105: virtual unpowered PE concepts; no protective-performance claim. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._virtualPeBatchQ)return;
const copy=x=>JSON.parse(JSON.stringify(x));
const C=(id,typeId,x,y,label)=>({id,typeId,x,y,rotation:0,ref:id.toUpperCase(),label});
let seq=0;
const W=(a,p,b,q)=>({id:'pe-q'+(++seq),from:{c:a,p},to:{c:b,p:q},color:'#16a34a',role:'PE',size:'2.5',points:[],tutorialHint:'Sanal şemada '+a+'/'+p+' ile '+b+'/'+q+' PE noktalarını bul.',tutorialWhy:'PE, normal yük akımının dönüş yolu değildir. Bu yalnız kavramsal bir güzergâhtır.'});
const lessons=[
 ['installation-grounding-src-01','Temel PE güzergâhı','PE işaretli koruma yolunu çalışma akımının dönüş hattından ayrı düşün.',
  [C('earth','ground',90,155,'PE referansı'),C('xt','terminal-pe',360,165,'PE klemensi'),C('socket','socket-power',720,175,'Priz koruma ucu · PE')],
  [['earth','PE','xt','1'],['xt','2','socket','PE']],
  'Sanal şemada prizin koruma bağlantısı hangi uçtur?',['PE','N','L']],
 ['installation-grounding-src-02','Eş potansiyel bara','Ortak PE barasının erişilebilir metal bölümler arasındaki potansiyel farkını azaltma amacını tanı.',
  [C('earth','ground',80,145,'PE referansı'),C('bar','bar-pe',335,160,'Ortak PE barası'),C('socket','socket-power',760,80,'Priz · PE'),C('motor','motor-3p',760,320,'Motor gövdesi · PE'),C('fan','fan-1p',1060,220,'Pano fanı · PE')],
  [['earth','PE','bar','1'],['bar','2','socket','PE'],['bar','3','motor','PE'],['bar','4','fan','PE']],
  'Eş potansiyel barasının görevi nedir?',['Koruma bağlantılarını ortak bir referansta toplamak','Normal dönüş akımını PE üzerinden taşımak','Motorun hızını artırmak']],
 ['installation-grounding-src-03','Kolon–linye–sorti PE güzergâhı','Koruma iletkeninin dağıtım yolunda kesintisiz devam etmesi gerektiğini gör.',
  [C('earth','ground',80,150,'PE referansı'),C('column','terminal-pe',315,160,'Kolon PE geçişi'),C('line','terminal-pe',555,160,'Linye PE geçişi'),C('socket','socket-power',815,170,'Sorti · priz PE')],
  [['earth','PE','column','1'],['column','2','line','1'],['line','2','socket','PE']],
  'Koruma iletkeni güzergâhında hangi özellik aranır?',['PE sürekliliği','PE üzerinden normal yük akımı taşımak','Faz ve nötrü birleştirmek']],
 ['installation-grounding-src-04','Pano PE / N ayrımı','Pano PE barası ile normal akımın nötr barasının ayrı görevleri olduğunu ayırt et.',
  [C('earth','ground',75,145,'PE referansı'),C('pebar','bar-pe',340,150,'Pano PE barası'),C('nbar','bar-n',330,470,'Ayrı N barası · bu sahnede boş'),C('motor','motor-3p',770,70,'Makine gövdesi · PE'),C('fan','fan-1p',770,280,'Pano fanı · PE'),C('socket','socket-power',1040,180,'Priz · PE')],
  [['earth','PE','pebar','1'],['pebar','2','motor','PE'],['pebar','3','fan','PE'],['pebar','4','socket','PE']],
  'PE ve N baraları niçin ayrı gösteriliyor?',['Koruma ve normal dönüş görevleri farklı olduğu için','İkisi her noktada rastgele birleştirilebildiği için','PE normal çalışma akımını taşıdığı için']]
];
const known={
 'installation-grounding-src-01':['wiring',3,2,['supply-1p','terminal-pe','ground']],
 'installation-grounding-src-02':['wiring',5,4,['supply-1p','bar-pe','terminal-pe','socket-power','ground']],
 'installation-grounding-src-03':['quiz',5,0,['bar-pe','terminal-pe','terminal-pe','terminal-pe','ground']],
 'installation-grounding-src-04':['quiz',4,0,['supply-3p','mcb-3p','bar-pe','ground']]
};
const richPE=Object.entries(known).every(([id,[kind,count,wires,types]])=>{
 const l=L.byId[id],p=l?.project;
 return l?.pedagogyReview?.noSubstitute===true&&l.kind===kind&&p.components.length===count&&
 p.wires.length===wires&&JSON.stringify(p.components.map(c=>c.typeId).sort())===JSON.stringify([...types].sort())&&
 (kind==='wiring'||p.referenceOnly===true);
});
if(richPE){L._virtualPeBatchQ=true;L._virtualPeBatchQCanonicalPreserved=true;return;}
for(const [id,short,idea,parts,edges,question,answers] of lessons){
 const l=L.byId[id],old=l?.project;
 if(!old||old.components?.length!==6||old.wires?.length!==6||!['push-no','coil-relay','contact-no','lamp-red'].every(t=>old.components.some(c=>c.typeId===t)))throw Error('Protected non-placeholder grounding lesson '+id);
 seq=0;const wires=edges.map(([a,p,b,q])=>W(a,p,b,q));
 l.project={...copy(old),components:parts,wires,junctions:[],tutorialExplore:{type:'virtual-pe-concept',simulationOnly:true,protectivePerformanceModelled:false}};
 l.kind='wiring';l.steps=wires.map(w=>({from:copy(w.from),to:copy(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.summary=idea;l.learningGoal=idea;
 l.explanation=short+': '+idea+' Bu, enerjisiz sanal bir şemadır; gerçek tesisatta koruma uygunluğunu doğrulamaz.';
 l.beginnerSteps=['PE işaretli noktaları tanı.','Sanal koruma güzergâhını izle.','PE ile N görevlerinin farkını kendi cümlenle açıkla.'];
 l.materials=parts.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,why:c.typeId==='bar-n'?'Ayrı N barası, bu örnekte bağlı değil.':'Sanal koruma bağlantısı gösterimi.'}));
 l.quiz={question,options:answers,answer:0,why:idea};
 l.pedagogyReview={...(l.pedagogyReview||{}),reviewed:true,codeImplemented:true,simulationAcceptance:false,visualAcceptance:false,protectivePerformanceModelled:false,simulationOnly:true,sourceStatus:'unpowered-pe-concept'};
}
L._virtualPeBatchQ=true;
})(typeof window==='undefined'?globalThis:window);