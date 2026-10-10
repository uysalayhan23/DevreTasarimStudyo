const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Projects=require('../dist/project-store.js');

const ROOT=path.join(__dirname,'..');
const fixtures=[
  {file:'Ornekler/K1_S2_Muhurleme.odsdevre',from:5,mode:'control'},
  {file:'Ornekler/Ileri_Geri_Motor_v1.6.3.odsdevre',from:6,mode:'control'},
  {file:'Ornekler/220V_24V_Esnek_Prob_v1.15.1.odsdevre',from:7,mode:'control'}
];

function read(file){return JSON.parse(fs.readFileSync(path.join(ROOT,file),'utf8'))}
function structural(project){
  return {
    components:(project.components||[]).map(c=>({id:String(c.id),typeId:c.typeId??c.type,x:c.x,y:c.y,rotation:c.rotation})),
    wires:(project.wires||[]).map(w=>({
      id:String(w.id),
      from:w.from&&{c:w.from.c===undefined?undefined:String(w.from.c),j:w.from.j===undefined?undefined:String(w.from.j),p:w.from.p},
      to:w.to&&{c:w.to.c===undefined?undefined:String(w.to.c),j:w.to.j===undefined?undefined:String(w.to.j),p:w.to.p},
      points:(w.points||w.fixedPoints||[]).map(p=>({x:p.x,y:p.y}))
    })),
    junctions:(project.junctions||[]).map(j=>({id:String(j.id),x:j.x,y:j.y}))
  };
}

test('WP-011 migration registry is contiguous from the oldest shipped schema to current',()=>{
  assert.equal(Projects.MIN_SUPPORTED_VERSION,5);
  assert.equal(Projects.CURRENT_VERSION,7);
  assert.deepEqual(Object.keys(Projects.migrations).map(Number),[5,6]);
  assert.deepEqual(Projects.migrationPath(5),['5→6','6→7']);
  assert.deepEqual(Projects.migrationPath(6),['6→7']);
  assert.deepEqual(Projects.migrationPath(7),[]);
});

for(const fixture of fixtures)test('WP-011 fixture migration and round-trip: '+fixture.file,()=>{
  const source=read(fixture.file),before=structural(source),sourceText=JSON.stringify(source);
  assert.equal(source.version,fixture.from);
  const migrated=Projects.migrate(source);
  assert.equal(JSON.stringify(source),sourceText,'migration must not mutate source object');
  assert.equal(migrated.version,Projects.CURRENT_VERSION);
  assert.equal(migrated.workspaceMode,fixture.mode);
  assert.deepEqual(structural(migrated),before,'migration must preserve circuit geometry and connectivity');
  const round=Projects.parse(JSON.stringify(Projects.clean(migrated)));
  assert.deepEqual(Projects.clean(round),Projects.clean(migrated),'current schema must round-trip byte-semantically');
});

test('WP-011 unversioned recognizable legacy data enters the explicit v5 baseline and reaches v7',()=>{
  const legacy={
    name:'Legacy',
    workspaceMode:'kumanda',
    devices:[{id:1,type:'resistor',x:10,y:20}],
    connections:[{id:9,from:{c:1,p:'1'},to:{c:1,p:'2'},fixedPoints:[{x:20,y:20}]}]
  };
  const original=JSON.stringify(legacy),m=Projects.migrate(legacy);
  assert.equal(JSON.stringify(legacy),original);
  assert.equal(m.version,7);
  assert.equal(m.workspaceMode,'control');
  assert.equal(m.components[0].id,'1');
  assert.equal(m.components[0].typeId,'resistor');
  assert.equal(m.wires[0].id,'9');
  assert.equal(m.wires[0].from.c,'1');
  assert.equal(m.devices,undefined);
  assert.equal(m.connections,undefined);
});

test('WP-011 refuses unsupported old and future schemas instead of silently rewriting them',()=>{
  const base={components:[],wires:[],junctions:[]};
  assert.throws(()=>Projects.migrate({...base,version:4}),/artık desteklenmiyor/);
  assert.throws(()=>Projects.migrate({...base,version:8}),/daha yeni/);
  assert.throws(()=>Projects.migrate({...base,version:'x'}),/şema sürümü geçersiz/);
});

test('WP-011 editor direct-load and cached-load paths use the shared migration registry',()=>{
  const app=fs.readFileSync(path.join(ROOT,'dist/app.js'),'utf8');
  assert.match(app,/DTSProjects\.migrate\?\.\(p\)/);
  assert.match(app,/DTSProjects\.migrate\?\.\(value\)/);
  assert.match(app,/const cached=localStorage\.getItem\('ods-project'\);if\(cached\)\{try\{project=migrateProject\(JSON\.parse\(cached\)\)/);
  assert.match(app,/p\.version=window\.DTSProjects\.CURRENT_VERSION\|\|7/);
});
