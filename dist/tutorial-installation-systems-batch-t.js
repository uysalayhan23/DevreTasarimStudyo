/* SC118–123: correct mismatched installation lesson projects; no field wiring instructions. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;
if(!L||L._installationSystemsBatchT)return;
const clone=v=>JSON.parse(JSON.stringify(v));
const C=(id,typeId,x,y,label)=>({id,typeId,x,y,rotation:0,ref:id.toUpperCase(),label});
const W=(n,a,ap,b,bp,role)=>({
 id:'inst-t-'+n,from:{c:a,p:ap},to:{c:b,p:bp},
 color:role==='PE'?'#16a34a':role==='N'?'#1e88e5':'#e53935',
 role,size:'2.5',points:[],
 tutorialHint:'Yalnız sanal şemadaki '+a+'/'+ap+' ve '+b+'/'+bp+' uçlarını incele.',
 tutorialWhy:'Görsel eğitim yolu; gerçek tesisat uygunluğu veya güvenlik testi değildir.'
});
const P=(i,title,goal,parts,edges,question,answers,notice,unsupported=[])=>({
 i,title,goal,parts,edges,question,answers,notice,unsupported
});
const specs=[
 P('07','Aydınlatma ve priz aynı tesisat şemasında',
 'Lambanın anahtarlı yolunu, prizin besleme temaslarını ve PE koruma yolunu ayrı görevler olarak tanı.',
 [C('g','supply-1p',75,185,'Sanal tek faz kaynağı'),C('s','wall-switch',375,90,'Adi anahtar'),C('h','ceiling-light',775,90,'Tavan lambası'),C('x','socket-power',775,370,'Priz · L / N / PE'),C('e','ground',160,470,'Ayrı PE referansı')],
 [['g','L','s','13','L1'],['s','14','h','X1','L1'],['h','X2','g','N','N'],['g','L','x','L','L1'],['x','N','g','N','N'],['e','PE','x','PE','PE']],
 'Sanal şemada yalnız aydınlatma anahtarı açılırsa hangisi etkilenir?',
 ['Lambanın anahtarlanan yolu','Prizin PE teması','Tesisatın tamamının topraklama değeri'],
 'Gerçek bir priz tesisatının koruma uygunluğu, topraklama ölçümü ve fiziksel montajı modellenmez.'),
 P('08','Buat bağlantı yolları: kavramsal dağıtım',
 'Buatın bağlantıların dağıtıldığı yer olduğunu, L ve N çalışma yollarının PE korumasından farklı olduğunu anla.',
 [C('g','supply-1p',75,180,'Sanal L / N referansı'),C('s','wall-switch',335,85,'Aydınlatma anahtarı'),C('h','ceiling-light',735,85,'Tavan armatürü'),C('x','socket-power',815,365,'Priz · L / N / PE'),C('e','ground',95,450,'PE referansı'),C('pe','terminal-pe',440,450,'Buat PE geçişi · sanal')],
 [['g','L','s','13','L1'],['s','14','h','X1','L1'],['h','X2','g','N','N'],['g','L','x','L','L1'],['x','N','g','N','N'],['e','PE','pe','1','PE'],['pe','2','x','PE','PE']],
 'Bu gösterimde PE iletkeni hangi amaçla ayrıdır?',
 ['Koruma yolu olarak','Normal çalışma akımının dönüşü olarak','Anahtarın yerine geçmek için'],
 'Gerçek buat kutusu ve tüm ek klemensleri katalogda doğrulanmadı. Çizim yalnız güzergâh kavramıdır; montaj planı veya tesisat testi değildir.',
 ['physical-junction-box','branch-terminal-hardware']),
 P('09','Busbar çıkış kutusu: kavram',
 'Busbar güç dağıtımında çıkış noktasının yükten ayrı bir donanım olduğunu öğren.',
 [C('x','socket-power',420,175,'Son kullanım prizi · bağlantısız örnek')],
 [],
 'Busbar çıkış kutusu ile bu örnek priz aynı parça mı?',
 ['Hayır; busbar çıkış kutusu burada modellenmedi','Evet; iki ürünün terminalleri eşdeğer','Evet; priz aynı zamanda busbar hattıdır'],
 'Busbar gövdesi, çıkış kutusu, çıkış koruması ve baraya ait üretici terminalleri doğrulanmadı. Gerçek busbar devresi kurulmuş veya simüle edilmiş değildir.',
 ['busbar-trunking','busbar-tap-off-box','tap-off-protection']),
 P('10','Telefon terminal kutusu: kavram',
 'Telefon hattındaki dağıtım kutusu ile RJ11 sonlandırma prizinin farklı görevler üstlendiğini öğren.',
 [C('p1','phone-socket',180,160,'RJ11 telefon prizi · örnek'),C('p2','phone-socket',580,160,'RJ11 telefon prizi · örnek')],
 [],
 'RJ11 telefon prizi bu derste hangi parçayı temsil ediyor?',
 ['Yalnız uçtaki telefon prizini','Doğrulanmış bir dağıtım kutusunu','RJ45 veri ağının güç kaynağını'],
 'Telefon dağıtım kutusunun klemens numaraları ve kablo çiftleri doğrulanmadığından telefon hattı kablolanmaz ve ölçülmez.',
 ['phone-distribution-box','pair-terminal-map']),
 P('11','TV / anten hattında sonlandırma: kavram',
 'Anten dağıtım hattı ve TV-SAT duvar prizinin işlev bakımından farklı olduğunu anla.',
 [C('tv','tv-socket',420,160,'TV–SAT prizi · örnek')],
 [],
 'Bu sanal sahnede anten sinyali gerçekten ölçülüyor mu?',
 ['Hayır; yalnız katalogdaki TV–SAT prizi gösteriliyor','Evet; tüm frekanslar doğrulandı','Evet; koaksiyel hat kayıpları hesaplandı'],
 'Anten, koaksiyel kablo, dağıtıcı ve RF ölçüm modeli bulunmadığından sahte bağlantı veya sinyal sonucu oluşturulmaz.',
 ['antenna-feed','coaxial-terminals','rf-distributor']),
 P('12','Akıllı aydınlatma / güneşlik: kavram',
 'Manuel aydınlatma anahtarıyla akıllı kontrolcü ve güneşlik motorunun aynı şey olmadığını ayırt et.',
 [C('s','wall-switch',180,180,'Manuel anahtar · yalnız örnek'),C('h','ceiling-light',580,180,'Tavan armatürü · yalnız örnek')],
 [],
 'Akıllı güneşlik bu örnekle çalıştırılıyor mu?',
 ['Hayır; kontrolcü ve motor burada modellenmedi','Evet; manuel anahtar güneşlik motoru yerine geçer','Evet; iki vaviyen otomatik güneşlik kontrolcüsüdür'],
 'Akıllı kontrol modülü, konum geri bildirimi, yön kilidi ve güneşlik sürücüsü doğrulanmadı; otomasyon/simülasyon kabulü verilmez.',
 ['smart-home-controller','shutter-actuator','travel-limits'])
];
const placeholders={
 '07':['supply-1p','wall-vavien','wall-vavien','lampholder-e27'],
 '08':['supply-1p','wall-commutator','led-luminaire','ceiling-light'],
 '09':['supply-dc-plus','push-no','resistor','led'],
 '10':['bell-transformer','bell-push','bell-push','bell-electronic'],
 '11':['supply-dc-plus','push-no','resistor','led'],
 '12':['supply-1p','wall-vavien','wall-vavien','lampholder-e27']
};
const canonical={
 '07':['quiz',0,['supply-1p','mcb-1p','ceiling-light','socket-power','mcb-1p']],
 '08':['wiring',4,['supply-1p','building-junction','building-junction','ceiling-light']],
 '09':['wiring',4,['supply-1p','one-line-bus-tap','mcb-1p','resistor']],
 '10':['wiring',4,['phone-floor-box','phone-apartment-box','telephone']],
 '11':['wiring',2,['satellite-dish','antenna-distributor','tv-socket']],
 '12':['wiring',6,['knx-power','knx-logic','knx-actuator','ceiling-light']]
};
const accepted=Object.entries(canonical).every(([index,[kind,wires,types]])=>{
 const l=L.byId['installation-systems-src-'+index],p=l?.project;
 return l?.pedagogyReview?.noSubstitute===true&&l.kind===kind&&p?.wires?.length===wires&&
 JSON.stringify(p.components.map(c=>c.typeId).sort())===JSON.stringify([...types].sort())&&
 (kind==='wiring'||p.referenceOnly===true);
});
if(accepted){L._installationSystemsBatchT=true;L._installationSystemsBatchTCanonicalPreserved=true;return;}
for(const spec of specs){
 const id='installation-systems-src-'+spec.i,l=L.byId[id];
 const old=l?.project,original=placeholders[spec.i];
 if(!l||l.topicId!=='installation-systems'||!old||old.components?.length!==original.length||
    old.components.some((c,i)=>c.typeId!==original[i])||
    !old.wires?.length)throw Error('Protected non-placeholder installation lesson '+id);
 const ids=new Set(spec.parts.map(x=>x.id));if(ids.size!==spec.parts.length)throw Error('Duplicate ID in '+id);
 const wires=spec.edges.map(([a,ap,b,bp,role],n)=>{
  if(!ids.has(a)||!ids.has(b))throw Error('Invalid component endpoint '+id);
  return W(spec.i+'-'+(n+1),a,ap,b,bp,role);
 });
 const next=clone(old);delete next.intentionalElectricalIslands;
 next.workspaceMode='building';next.symbolNorm='TSE';next.components=clone(spec.parts);next.wires=wires;next.junctions=[];
 next.colorRoles={...(next.colorRoles||{}),'#16a34a':'PE','#e53935':'L1','#1e88e5':'N'};
 next.tutorialLesson={...(old.tutorialLesson||{}),phase:spec.i==='07'?'demo':'quiz'};
 next.tutorialExplore={type:'installation-concept',simulationOnly:true,electricalPerformanceModelled:false,
  fieldInstallationModelled:false,missingCatalogModels:[...spec.unsupported]};
 l.project=next;l.kind=spec.i==='07'?'wiring':'quiz';
 l.steps=l.kind==='wiring'?wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size})):[];
 l.summary=spec.goal;l.learningGoal=spec.goal;l.explanation=spec.title+': '+spec.goal+' '+spec.notice;
 l.safety='Bu içerik yalnız enerjisiz/sanal öğrenme içindir; gerçek enerji altında tesisat çalışması yapılmaz.';
 l.beginnerSteps=['Bu konunun cihazlarını ve görevlerini ayırt et.',spec.goal,
  'Çizimin göstermediği gerçek donanımları da öğren.','Soruyu yanıtlayarak konuyu pekiştir.'];
 l.materials=spec.parts.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,
  why:'Katalog öğesinin kavramsal gösterimi; gerçek terminal/tesisat testi değil.'}));
 l.quiz={question:spec.question,options:clone(spec.answers),answer:0,why:spec.goal};
 l.pedagogyReview={...(l.pedagogyReview||{}),version:'v1.19.20-installation-systems-batch-t',
  reviewed:true,codeImplemented:true,simulationOnly:true,
  simulationAcceptance:false,visualAcceptance:false,
  fieldInstallationAccepted:false,electricalPerformanceModelled:false,
  catalogModelPending:spec.unsupported.length>0,
  sourceStatus:spec.unsupported.length?'concept-catalog-pending':'virtual-circuit-source'};
}
L._installationSystemsBatchT=true;
})(typeof window==='undefined'?globalThis:window);