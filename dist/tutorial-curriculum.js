(function(root,factory){
'use strict';
const api=factory();
if(typeof module==='object'&&module.exports)module.exports=api;
else{root.DTSTutorialCurriculum=api;api.apply(root.DTSTutorialLessons)}
})(typeof window==='undefined'?globalThis:window,function(){
'use strict';

const UNKNOWN='unknown';
const CATALOG_EET_10='https://meslek.meb.gov.tr/dmgoster.aspx?alan_id=10&kurum_id=1&sinif_kodu=10';
const CATALOG_EET_9='https://meslek.meb.gov.tr/dmgoster.aspx?alan_id=10&kurum_id=1&sinif_kodu=9';
const CATALOG_ALL_10='https://meslek.meb.gov.tr/dm_listele.aspx?kurum_id=1&sinif_kodu=10';
const CATALOG_ALL_9='https://meslek.meb.gov.tr/dm_listele.aspx?kurum_id=1&sinif_kodu=9';

const VERIFIED=(course,area,grade,courseType,catalogUrl,materialUrl=null,extra={})=>Object.freeze({
  status:'verified',
  institution:'T.C. Millî Eğitim Bakanlığı',
  directorate:'Meslekî ve Teknik Eğitim Genel Müdürlüğü',
  schoolType:'Mesleki ve Teknik Anadolu Lisesi',
  course,
  area,
  branch:UNKNOWN,
  grade,
  courseType,
  catalogUrl,
  materialUrl,
  catalogVersion:'2026-09-14',
  retrievedAt:'2026-10-04',
  ...extra
});
const UNVERIFIED=(course,extra={})=>Object.freeze({
  status:'unverified',institution:UNKNOWN,directorate:UNKNOWN,schoolType:UNKNOWN,
  course,area:UNKNOWN,branch:UNKNOWN,grade:null,courseType:UNKNOWN,
  catalogUrl:null,materialUrl:null,catalogVersion:UNKNOWN,retrievedAt:null,...extra
});

const sources=Object.freeze({
  'Analog-Dijital Elektronik Atölyesi 10':VERIFIED(
    'Analog-Dijital Elektronik Atölyesi 10','Elektrik-Elektronik Teknolojisi',10,'Dal Dersi',CATALOG_EET_10,
    'https://meslek.meb.gov.tr/upload/dersmateryali/pdf/EET2024ADE1009.pdf'
  ),
  'Elektronik Atölyesi 10':VERIFIED(
    'Elektronik Atölyesi 10','Elektrik-Elektronik Teknolojisi',10,'Dal Dersi',CATALOG_EET_10,
    'https://meslek.meb.gov.tr/upload/dersmateryali/pdf/EET2024EA1007.pdf'
  ),
  'Kumanda Teknikleri Atölyesi 10':VERIFIED(
    'Kumanda Teknikleri Atölyesi 10','Elektrik-Elektronik Teknolojisi',10,'Dal Dersi',CATALOG_EET_10,
    'https://kitap.eba.gov.tr/KodSor.php?KOD=19700',
    {materialAuthority:'MEB/EBA'}
  ),
  'Kumanda ve Kontrol Atölyesi 10':VERIFIED(
    'Kumanda ve Kontrol Atölyesi 10','Elektrik-Elektronik Teknolojisi',10,'Dal Dersi',CATALOG_EET_10,
    'https://meslek.meb.gov.tr/upload/dersmateryali/pdf/EET2024KKA1008.pdf'
  ),
  'Tesisat Atölyesi 10':VERIFIED(
    'Tesisat Atölyesi 10','Elektrik-Elektronik Teknolojisi',10,'Dal Dersi',CATALOG_EET_10
  ),
  'Temel Elektrik-Elektronik 9':VERIFIED(
    'Temel Elektrik-Elektronik 9','Elektrik-Elektronik Teknolojisi',9,'Alan Dersi',CATALOG_EET_9
  ),
  'Temel Elektronik 9 · Endüstriyel Otomasyon':VERIFIED(
    'Temel Elektronik 9','Endüstriyel Otomasyon Teknolojileri',9,'Alan Dersi',CATALOG_ALL_9
  ),
  'Sensörler 10':VERIFIED(
    'Sensörler 10','Endüstriyel Otomasyon Teknolojileri',10,'Dal Dersi',CATALOG_ALL_10
  ),
  'Endüstriyel Otomasyon Atölye 10':UNVERIFIED('Endüstriyel Otomasyon Atölye 10',{
    status:'partial',
    institution:'T.C. Millî Eğitim Bakanlığı',
    directorate:'Meslekî ve Teknik Eğitim Genel Müdürlüğü',
    schoolType:'Mesleki ve Teknik Anadolu Lisesi',
    area:'Endüstriyel Otomasyon Teknolojileri',
    grade:10,
    courseType:'Dal Dersi',
    catalogUrl:CATALOG_ALL_10,
    catalogVersion:'2026-09-14',
    retrievedAt:'2026-10-04',
    note:'Güncel resmi katalogda aynı alanda “Atölye 10” kaydı vardır; uygulamadaki daha uzun kaynak adı birebir resmi ders adı olarak doğrulanmamıştır.'
  }),
  'Doğru Akım Esasları':UNVERIFIED('Doğru Akım Esasları'),
  'Elektrik Devre Uygulamaları':UNVERIFIED('Elektrik Devre Uygulamaları'),
  'Elektronik Devre Uygulamaları':UNVERIFIED('Elektronik Devre Uygulamaları'),
  'Kumanda Sistemleri / Deney Seti':UNVERIFIED('Kumanda Sistemleri / Deney Seti'),
  'Mikrodenetleyici Programlama Uygulamaları':UNVERIFIED('Mikrodenetleyici Programlama Uygulamaları'),
  'Otomatik Kumanda Devreleri':UNVERIFIED('Otomatik Kumanda Devreleri')
});

const clone=v=>JSON.parse(JSON.stringify(v));
const evidence=name=>clone(sources[name]||UNVERIFIED(name||UNKNOWN));

function previousLesson(L,l){
  if(!Number.isFinite(Number(l?.variant))||Number(l.variant)<=1)return null;
  const target=Number(l.variant)-1;
  const prev=L.lessons.find(x=>x.topicId===l.topicId&&Number(x.variant)===target);
  return prev?.id||null;
}
function unique(values){
  return [...new Set(values.filter(v=>v!==undefined&&v!==null&&v!==''))];
}
function lessonMetadata(L,l){
  const docs=unique(Array.isArray(l.sourceDocs)?l.sourceDocs:[]);
  const sourceEvidence=docs.map(evidence);
  const statuses=unique(sourceEvidence.map(x=>x.status));
  const verified=sourceEvidence.filter(x=>x.status==='verified');
  const areas=unique(verified.map(x=>x.area).filter(x=>x!==UNKNOWN));
  const branches=unique(verified.map(x=>x.branch).filter(x=>x!==UNKNOWN));
  const grades=unique(verified.map(x=>x.grade).filter(Number.isFinite));
  const prereq=previousLesson(L,l);
  const sourceStatus=!sourceEvidence.length?'unverified':statuses.length===1?statuses[0]:'partial';
  const moduleText=Array.isArray(l.sourceTopics)&&l.sourceTopics.length?l.sourceTopics[0]:(l.topic||UNKNOWN);
  return {
    area:areas.length===1?areas[0]:UNKNOWN,
    branch:branches.length===1?branches[0]:UNKNOWN,
    module:moduleText||UNKNOWN,
    moduleStatus:Array.isArray(l.sourceTopics)&&l.sourceTopics.length?'source-outline':'app-topic',
    outcome:{
      code:null,
      text:null,
      status:'unverified',
      note:'Bu dersin uygulama öğrenme hedefi resmi MEB kazanım kodu/metni olarak doğrulanmamıştır.'
    },
    appLearningGoal:l.learningGoal||null,
    source:{
      status:sourceStatus,
      documents:sourceEvidence,
      sourceDocs:docs
    },
    version:unique(sourceEvidence.map(x=>x.catalogVersion).filter(x=>x&&x!==UNKNOWN)).join(', ')||UNKNOWN,
    grade:grades.length===1?grades[0]:null,
    prerequisites:prereq?[prereq]:[],
    prerequisiteStatus:prereq?'app-sequence':'none',
    status:sourceStatus
  };
}
function validateLesson(L,l){
  const m=l?.meb;
  if(!m||typeof m!=='object')return {ok:false,reason:'meb'};
  for(const k of ['area','branch','module','version','status'])if(typeof m[k]!=='string'||!m[k])return {ok:false,reason:k};
  if(!m.outcome||!['verified','unverified','partial'].includes(m.outcome.status))return {ok:false,reason:'outcome'};
  if(m.outcome.status==='verified'&&(!m.outcome.code||!m.outcome.text))return {ok:false,reason:'verifiedOutcomeEvidence'};
  if(!m.source||!['verified','partial','unverified'].includes(m.source.status)||!Array.isArray(m.source.documents))return {ok:false,reason:'source'};
  for(const d of m.source.documents){
    if(!['verified','partial','unverified'].includes(d.status))return {ok:false,reason:'sourceStatus'};
    if(d.status==='verified'){
      if(!/^https:\/\/[^/]*meb\.gov\.tr\//.test(String(d.catalogUrl||''))&&!/^https:\/\/kitap\.eba\.gov\.tr\//.test(String(d.catalogUrl||'')))return {ok:false,reason:'officialCatalogUrl'};
      if(d.institution!=='T.C. Millî Eğitim Bakanlığı')return {ok:false,reason:'institution'};
    }
  }
  if(!Array.isArray(m.prerequisites))return {ok:false,reason:'prerequisites'};
  const ids=new Set(L.lessons.map(x=>x.id));
  for(const id of m.prerequisites)if(id===l.id||!ids.has(id))return {ok:false,reason:'prerequisiteId'};
  return {ok:true};
}
function audit(L){
  const rows=(L?.lessons||[]).map(l=>({id:l.id,result:validateLesson(L,l),meb:l.meb}));
  const invalid=rows.filter(x=>!x.result.ok).map(x=>({id:x.id,reason:x.result.reason}));
  return {
    total:rows.length,
    invalid,
    sourceVerified:rows.filter(x=>x.meb?.source?.status==='verified').length,
    sourcePartial:rows.filter(x=>x.meb?.source?.status==='partial').length,
    sourceUnverified:rows.filter(x=>x.meb?.source?.status==='unverified').length,
    officialOutcomeVerified:rows.filter(x=>x.meb?.outcome?.status==='verified').length,
    appPrerequisites:rows.filter(x=>x.meb?.prerequisites?.length).length
  };
}
function apply(L){
  if(!L||!Array.isArray(L.lessons))return L;
  for(const l of L.lessons)l.meb=lessonMetadata(L,l);
  L.mebCurriculum={
    version:'v1.19.20-meb-contract1',
    institution:'T.C. Millî Eğitim Bakanlığı',
    directorate:'Meslekî ve Teknik Eğitim Genel Müdürlüğü',
    retrievedAt:'2026-10-04',
    sourceRegistryCount:Object.keys(sources).length,
    audit:audit(L),
    note:'Resmi ders materyali metadata’sı ile uygulama içi learningGoal/prerequisite ayrı tutulur; doğrulanmamış öğrenme hedefleri resmi MEB kazanımı olarak sunulmaz.'
  };
  return L;
}
return {sources,evidence,lessonMetadata,validateLesson,audit,apply};
});
