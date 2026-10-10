const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const Curriculum=require('../dist/tutorial-curriculum.js');

function finalLessons(){
  const outline=require('../dist/tutorial-source-outline.js');
  const ctx={window:{DTSTutorialLessons:outline}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../dist/tutorial-pedagogy.js'),'utf8'),ctx);
  Curriculum.apply(ctx.window.DTSTutorialLessons);
  return ctx.window.DTSTutorialLessons;
}
const L=finalLessons();

test('WP-010 every final lesson has machine-verifiable MEB/source/prerequisite metadata',()=>{
  assert.ok(L.lessons.length>100,L.lessons.length);
  for(const l of L.lessons){
    assert.deepEqual(Curriculum.validateLesson(L,l),{ok:true},l.id);
    for(const key of ['area','branch','module','outcome','source','version','prerequisites','status'])assert.ok(Object.hasOwn(l.meb,key),l.id+' '+key);
    assert.equal(l.meb.appLearningGoal,l.learningGoal||null,l.id);
    assert.ok(['verified','partial','unverified'].includes(l.meb.source.status),l.id);
    assert.ok(['verified','unverified','partial'].includes(l.meb.outcome.status),l.id);
  }
  assert.equal(L.mebCurriculum.audit.invalid.length,0);
});

test('WP-010 verified source registry uses official MEB/EBA evidence and exact grade/area metadata',()=>{
  const expected=[
    ['Analog-Dijital Elektronik Atölyesi 10','Elektrik-Elektronik Teknolojisi',10],
    ['Elektronik Atölyesi 10','Elektrik-Elektronik Teknolojisi',10],
    ['Kumanda Teknikleri Atölyesi 10','Elektrik-Elektronik Teknolojisi',10],
    ['Kumanda ve Kontrol Atölyesi 10','Elektrik-Elektronik Teknolojisi',10],
    ['Tesisat Atölyesi 10','Elektrik-Elektronik Teknolojisi',10],
    ['Temel Elektrik-Elektronik 9','Elektrik-Elektronik Teknolojisi',9],
    ['Temel Elektronik 9 · Endüstriyel Otomasyon','Endüstriyel Otomasyon Teknolojileri',9],
    ['Sensörler 10','Endüstriyel Otomasyon Teknolojileri',10]
  ];
  for(const [name,area,grade] of expected){
    const e=Curriculum.evidence(name);
    assert.equal(e.status,'verified',name);
    assert.equal(e.institution,'T.C. Millî Eğitim Bakanlığı',name);
    assert.equal(e.area,area,name);assert.equal(e.grade,grade,name);
    assert.match(e.catalogUrl,/^https:\/\/(?:[^/]*\.)?meb\.gov\.tr\//,name);
    assert.equal(e.catalogVersion,'2026-09-14',name);
    assert.equal(e.retrievedAt,'2026-10-04',name);
  }
});

test('WP-010 does not promote generic or mismatched source labels to official MEB evidence',()=>{
  for(const name of [
    'Doğru Akım Esasları','Elektrik Devre Uygulamaları','Elektronik Devre Uygulamaları',
    'Kumanda Sistemleri / Deney Seti','Mikrodenetleyici Programlama Uygulamaları',
    'Otomatik Kumanda Devreleri'
  ]){
    const e=Curriculum.evidence(name);
    assert.equal(e.status,'unverified',name);assert.equal(e.catalogUrl,null,name);
  }
  const partial=Curriculum.evidence('Endüstriyel Otomasyon Atölye 10');
  assert.equal(partial.status,'partial');assert.match(partial.note,/birebir resmi ders adı olarak doğrulanmamıştır/);
});

test('WP-010 app learning goals are never mislabeled as verified official MEB outcomes',()=>{
  const audit=Curriculum.audit(L);
  assert.equal(audit.officialOutcomeVerified,0);
  for(const l of L.lessons){
    assert.equal(l.meb.outcome.status,'unverified',l.id);
    assert.equal(l.meb.outcome.code,null,l.id);
    assert.equal(l.meb.outcome.text,null,l.id);
    if(l.learningGoal)assert.equal(l.meb.appLearningGoal,l.learningGoal,l.id);
  }
});

test('WP-010 prerequisite ids are valid app-sequence references and never self-reference',()=>{
  const ids=new Set(L.lessons.map(x=>x.id));
  for(const l of L.lessons)for(const id of l.meb.prerequisites){
    assert.ok(ids.has(id),l.id+' -> '+id);assert.notEqual(id,l.id);
    const p=L.byId?.[id]||L.lessons.find(x=>x.id===id);assert.equal(p.topicId,l.topicId,l.id+' topic mismatch');
    assert.ok(Number(p.variant)<Number(l.variant),l.id+' prerequisite order');
  }
});

test('browser lazy curriculum load runs after source outline and pedagogy',()=>{
  const mode=fs.readFileSync(require.resolve('../dist/tutorial-mode.js'),'utf8');
  const a=mode.indexOf("tutorial-source-outline.js");
  const b=mode.indexOf("tutorial-pedagogy.js");
  const c=mode.indexOf("tutorial-curriculum.js");
  assert.ok(a>=0&&b>a&&c>b,{a,b,c});
});
