/* MQ-07: six individually guided energy analysis and simulated tachometer lessons. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._measurementBatchC)return;
const clone=v=>JSON.parse(JSON.stringify(v));
const entries=[["measurement-workshop-outline-035","power","Güç ölçer ile güç faktörünü birlikte yorumla","Aktif güç P, görünür güç S, reaktif güç Q ve güç faktörünü tek sanal enerji analizörü ekranında karşılaştır.","Dirençli → endüktif → kapasitif presetlerini değiştir. P, Q, S ve PF alanlarını tek tek karşılaştır; değerlerden güç üçgenini doğrula.","PF 0,80 ve S=230 VA iken P kaç watt?",["184 W","230 W","138 W"]],["measurement-workshop-outline-036","power","Sanal wattmetre işleviyle aktif güç","Sanal enerji analizörünün P (W) alanının wattmetrenin aktif güç işlevine karşılık geldiğini yorumla.","230 VA görünür güçte dirençli yükün 230 W, endüktif yükün 184 W ölçüldüğünü simülasyonda doğrula. Wh değerinin zamanla arttığını gözle.","Güç analizöründeki wattmetre işlevi hangi alanı gösterir?",["P (W)","Q (var)","S (VA)"]],["measurement-workshop-outline-037","power","Cosφ ve reaktif güç işaretini ölç","Sanal enerji analizörünün PF / cosφ alanının endüktif ve kapasitif yüklerde aynı büyüklüğü gösterse de Q işaretinin değiştiğini öğren.","Endüktif ve kapasitif 0,80 PF presetlerini karşılaştır. P=184 W ve S=230 VA değerleri korunurken Q işaretinin +/− değiştiğini gözle.","PF aynıyken endüktif ve kapasitif yük arasında ne değişir?",["Q reaktif gücünün işareti","S görünür gücü iki katına çıkar","Ölçümler geçersizleşir"]],["measurement-workshop-src-09","tacho","Sanal temassız takometreyle motor devri","Takometrenin motorun elektrik terminallerine bağlanmadığını, motor modeli çalışırken devir bilgisini rpm olarak okuduğunu öğren.","Sanal motor devrini 750, 1500, 3000 rpm olarak değiştir. Sonra sanal besleme bağlantısını koparıp ölçümün geçersiz hâle gelişini gözle.","Motor modeli durduğunda takometre nasıl davranmalıdır?",["Geçerli devir okuması vermemelidir","Aynı RPM değerini saklamalıdır","İki kat RPM göstermelidir"]],["measurement-workshop-outline-023","tacho","Takometrenin görevini ve rpm birimini öğren","Dakikadaki dönüş sayısını rpm olarak tanı; motorun elektrik bağlantısı ile temassız takometrenin ölçüm noktasını ayır.","Sanal motorun 750 ve 1500 rpm ayarlarını karşılaştır; bir saniyedeki yaklaşık dönüş sayısını hesapla.","1500 rpm motor saniyede yaklaşık kaç tur döner?",["25","1500","2,5"]],["measurement-workshop-outline-024","tacho","Sayısal takometre ile sanal devir karşılaştırması","Motorun seçilen nominal devri ile takometrenin simülasyondan aldığı ölçümü karşılaştır; motor kapalıyken geçerli ölçüm olmadığını öğren.","Sanal motoru sırayla 1500 ve 3000 rpm ayarla. Her değer için saniyedeki tur sayısını hesapla; motor beslemesini keserek kaybolan okumayı gözle.","3000 rpm saniyede kaç tura karşılık gelir?",["50","30","300"]]];
let wireId=92000;
const wire=(a,ap,b,bp,why)=>({id:'mcc-'+(++wireId),from:{c:a,p:ap},to:{c:b,p:bp},role:ap==='PE'?'PE':'L1',color:ap==='PE'?'#16a34a':'#e53935',size:'1.5',points:[],tutorialHint:a.toUpperCase()+'/'+ap+' → '+b.toUpperCase()+'/'+bp,tutorialWhy:why});
function tachometerProject(id,title){
 const components=[
  {id:'g1',typeId:'supply-3p',x:85,y:220,ref:'G1',label:'G1 · Simüle edilen 3 faz motor kaynağı',tutorialPurpose:'Yalnız yazılımın sanal motor beslemesini temsil eder.'},
  {id:'m1',typeId:'motor-3p',x:475,y:220,ref:'M1',label:'M1 · Sanal üç fazlı motor',motorRatedRpm:1500,tutorialPurpose:'Simülasyon motoru çalıştığında _motorRPM değeri üretilir.'},
  {id:'t1',typeId:'tutorial-tachometer',x:760,y:345,ref:'T1',label:'T1 · Temassız takometre · sanal hedef',tachometerTargetId:'m1',tutorialPurpose:'Sanal motor modelinden okunan devri gösteren optik ölçüm anlatımı; elektrik terminaline bağlanmaz.'}
 ];
 const pairs=[['L1','U'],['L2','V'],['L3','W'],['PE','PE']];
 return {version:7,workspaceMode:'electrical',projectId:'tutorial-session-source-'+id,name:'Öğretici · '+title,symbolNorm:'IEC',preferredAppearance:'material',components,wires:pairs.map(([a,b])=>wire('g1',a,'m1',b,'Motorun yalnız sanal modeldeki besleme ve koruma bağlantısıdır.')),junctions:[],tutorialLesson:{id,topicId:'measurement-workshop',phase:'demo',step:0},tutorialExplore:{type:'tachometer-simulation-rich',simulationOnly:true,modelDriven:true,presets:[750,1500,3000]}};
}
for(const [id,mode,heading,goal,task,question,options] of entries){
 const l=L.byId[id];if(!l||l.topicId!=='measurement-workshop')throw Error('Missing measurement lesson '+id);
 let p;
 if(mode==='power'){
  const source=L.byId['measurement-workshop-src-06'];if(!source?.project?.tutorialExplore?.presets)throw Error('Energy analyzer model unavailable');
  p=clone(source.project);p.projectId='tutorial-session-source-'+id;p.name='Öğretici · '+l.title;
  p.tutorialLesson={id,topicId:l.topicId,phase:'explore',step:0,level:l.variant};
  l.kind='explore';l.steps=[];l.energyAnalyzerRich=true;
 }else{
  p=tachometerProject(id,l.title);p.tutorialLesson.level=l.variant;
  l.kind='wiring';l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 }
 l.project=p;l.workspaceMode=p.workspaceMode;l.designStandard='rich-reference-v1';
 l.measurementUpgrade={heading,goal,task,question,options,tachometer:mode==='tacho'};
 l.summary=goal;l.learningGoal=goal;
 l.explanation=task+' Bu deney yalnız uygulama içindeki sanal ölçüm modelidir; gerçek enerjili ekipmanda uygulama talimatı değildir.';
 l.beginnerSteps=['Malzeme ve ölçüm birimlerini incele.','Önce beklenen ölçüm değerini tahmin et.',task,'Simülasyondaki ölçümün kaynağını kontrol et.','Konu kontrolüyle sonucunu açıkla.'];
 l.quiz={question,options,answer:0,why:goal};
 l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref||c.id,why:c.tutorialPurpose||'Sanal deney bileşenidir.'}));
 l.pedagogyReview={version:'v1.19.20-measure-batch-c',reviewed:true,componentIds:p.components.map(c=>c.typeId),designStandard:'rich-reference-v1',simulationOnly:true,canonicalLabSource:mode==='power'?'measurement-workshop-src-06':'motor-3p-simulation',measuredFromModel:true};
}
L._measurementBatchC=true;
})(typeof window==='undefined'?globalThis:window);
