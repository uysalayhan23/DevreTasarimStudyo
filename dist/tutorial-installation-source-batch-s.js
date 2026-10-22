/* SC112–117: align source-class wiring lessons with their actual teaching circuits. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._installationSourceBatchS)return;
const clone=x=>JSON.parse(JSON.stringify(x));
const specs=[
['01','button-led-3',4,4,3,3,
 'Bir anahtarla bir tavan lambasını yönetmeyi öğren.',
 'Sanal anahtarı açıp kapat; lambanın yalnız anahtar kapalıyken yandığını gör. Bu derste gerçek adi anahtar ve tavan armatürü kullanılır; önceki 24 V buton–LED örneği bu konuya ait değildi.',
 'Adi anahtar açıkken lamba neden söner?',['Anahtarlanan yol kesildiği için','Nötr faza dönüştüğü için','Lambanın gücü artacağı için']],
['02','commutator-1',4,6,4,6,
 'Tek komütatörün iki ayrı lambayı bağımsız yönetmesini anla.',
 'Sanal komütatörün ilk kolunu değiştirip H1\u2019i, ikinci kolunu değiştirip H2\u2019yi gözlemle. İki ayrı anahtar kolu diğer lambanın durumunu zorunlu olarak değiştirmez.',
 'Komütatörün iki kolu hangi işi yapar?',['H1 ve H2\u2019yi ayrı ayrı anahtarlar','Nötr ile PE\u2019yi birleştirir','Kaynağın frekansını değiştirir']],
['03','two-way-1',4,5,4,5,
 'Aynı lambanın iki farklı konumdan yönetilmesini öğren.',
 'Sanal S1 ve S2 vaviyenlerinin konumlarını sırayla değiştir; hangisini değiştirirsen değiştir lamba durumunun değişebildiğini gör. Ortak uçlarla iki gezgin hattın görevini ayırt et.',
 'İki vaviyenin arasında bulunan iki hat ne işe yarar?',['Anahtarların seçtiği güzergâhı taşır','İki ayrı nötr sağlar','PE üzerinden lamba besler']],
['04','intermediate-1',5,7,5,7,
 'Bir lambanın üç ayrı noktadan nasıl kontrol edilebildiğini keşfet.',
 'Sanal ilk ve son vaviyeni sabit tut; ortadaki ara vaviyenin konumunu değiştirip lambayı izle. Sonra uç vaviyenlerden birini değiştirerek sonucu karşılaştır.',
 'Ara vaviyen hangi bağlantıyı değiştirir?',['İki gezgin yolun düz ya da çapraz geçişini','Nötr frekansını','Lamba anma gerilimini']],
['05','bells-1',3,3,3,3,
 'Tek bir çağrı butonunun yalıtılmış sanal zil devresini nasıl çalıştırdığını anla.',
 'Sanal 12 V AC zil trafosu ve B1 butonunu gözlemle. B1\u2019e basınca zilin çalıştığını, bırakınca çağrı yolunun açıldığını gör. Şebeke tarafı bu örnekte erişilebilir değildir.',
 'Tek butona basınca hangi yol kapanır?',['Yalıtılmış 12 V zil çevrimi','230 V şebeke tarafı','PE koruma iletkeni']],
['06','bells-3',5,7,5,7,
 'Üç çağrı butonunun aynı sanal zile bağımsız komut verdiğini anla.',
 'Sanal B1, B2 ve B3 butonlarını ayrı ayrı dene. Hangisine basarsan bas aynı zil çalışır; butonlar bırakıldığında çağrı yolu açılır. Bu örnek yalıtılmış 12 V AC devredir.',
 'Üç paralel butondan herhangi birine basınca ne olur?',['Ortak zil için bir çağrı yolu kapanır','Bütün butonlar seri bağlanır','Trafo çıkışı iki katına çıkar']]
];
const names=['supply-dc-plus','push-nc','resistor','led'];
for(const [index,template,oldParts,oldWires,newParts,newWires,goal,task,question,options] of specs){
 const id='installation-systems-src-'+index,l=L.byId[id],ref=L.byId[template];
 if(!l||!ref||l.topicId!=='installation-systems'||!l.title)throw Error('Missing lesson or reference '+id);
 const old=l.project,good=ref.project;
 if(old.components?.length!==oldParts||old.wires?.length!==oldWires||good.components?.length!==newParts||good.wires?.length!==newWires)throw Error('Unexpected graph shape '+id);
 const norm=p=>p.wires.map(w=>[w.from?.c,w.from?.p,w.to?.c,w.to?.p].join('/')).join('|');
 if(index==='01'){
  if(names.some(t=>!old.components.some(c=>c.typeId===t)))throw Error('SC112 expected wrong DC template not present');
  for(const typeId of ['supply-1p','wall-switch','ceiling-light'])if(!good.components.some(c=>c.typeId===typeId))throw Error('SC112 lighting template incomplete');
  l.project={...clone(good),projectId:old.projectId,name:old.name,tutorialLesson:clone(old.tutorialLesson)};
  l.steps=clone(ref.steps);
 }else if(norm(old)!==norm(good)||old.components.some((c,i)=>c.typeId!==good.components[i]?.typeId))throw Error('Canonical source circuit mismatch '+id);
 if(!Array.isArray(l.steps)||l.steps.length!==l.project.wires.length)throw Error('Guided lesson step mismatch '+id);
 const ids=new Set(l.project.components.map(c=>c.id));
 const steps=new Set(l.steps.map(s=>[s.from?.c,s.from?.p,s.to?.c,s.to?.p].join('/')));
 for(const w of l.project.wires){const key=[w.from?.c,w.from?.p,w.to?.c,w.to?.p].join('/');if(!ids.has(w.from.c)||!ids.has(w.to.c)||!steps.has(key))throw Error('Endpoint/step mismatch '+id);}
 l.kind='wiring';l.learningGoal=goal;l.summary=goal;
 l.explanation=task+' Yalnız sanal ders devresidir; gerçek tesisat uygulaması veya güvenlik uygunluğu testi değildir.';
 l.safety=index==='05'||index==='06'?'Yalnız yalıtılmış sanal 12 V AC zil çıkışı gösterilir; gerçek şebeke bağlantısı kurulmaz.':'Yalnız sanal tesisat dersi. Gerçek enerjili tesisata müdahale edilmez.';
 l.beginnerSteps=['Devredeki sanal elemanları ve uçlarını tanı.',goal,'Sanal anahtarı veya butonları değiştirip sonucu gözlemle.','Devrenin kendi terminallerini kullanarak bağlantıları yeniden kur.'];
 l.quiz={question,options:clone(options),answer:0,why:goal};
 l.pedagogyReview={...(l.pedagogyReview||{}),version:'v1.19.20-installation-source-batch-s',reviewed:true,codeImplemented:true,sourceCircuitPreserved:index!=='01',sourceTemplateCorrected:index==='01',simulationAcceptance:false,visualAcceptance:false,simulationOnly:true};
}
L._installationSourceBatchS=true;
})(typeof window==='undefined'?globalThis:window);