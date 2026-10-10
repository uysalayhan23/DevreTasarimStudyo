'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const codeFiles=[...walk(dist),...walk(path.join(root,'scripts')),...walk(path.join(root,'tests'))].filter(p=>/\.(js|cjs)$/.test(p));
for(const file of codeFiles)new vm.Script(fs.readFileSync(file,'utf8'),{filename:path.relative(root,file)});
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
let dependencies=0;
for(const match of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)){
 const url=match[1];if(/^(?:[a-z]+:|#|\/\/)/i.test(url))continue;
 const local=decodeURIComponent(url.split(/[?#]/)[0]);if(!local)continue;
 const file=path.resolve(dist,local);assert.ok(file.startsWith(dist+path.sep),'Bağımlılık dist dışına çıkıyor: '+url);
 assert.ok(fs.existsSync(file),'Eksik yerel bağımlılık: '+url);dependencies++;
}
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(dist,'library.js'),'utf8'),context);
const Design=require('../dist/design-library.js'),Symbols=require('../dist/symbols.js');
const library=Symbols.prepareLibrary(Design.extend(context.window.COMPONENT_LIBRARY));
assert.equal(new Set(library.map(d=>d.id)).size,library.length,'Tekrarlanan malzeme kimliği');
const byId=Object.fromEntries(library.map(d=>[d.id,d]));
for(const d of library)assert.equal(new Set((d.pins||[]).map(p=>p.id)).size,(d.pins||[]).length,'Tekrarlanan pin: '+d.id);
const Projects=require('../dist/project-store.js');
const examples=['Ornekler','Kaydedilen_Projeler'].flatMap(dir=>walk(path.join(root,dir))).filter(p=>p.endsWith('.odsdevre'));
for(const file of examples){
 const p=Projects.parse(fs.readFileSync(file,'utf8'));assert.ok(Projects.isProtected(p),'Korumasız hazır örnek: '+file);
 for(const c of p.components)assert.ok(byId[c.typeId],'Bilinmeyen örnek malzemesi: '+c.typeId);
}
const version=fs.readFileSync(path.join(dist,'app.js'),'utf8').match(/APP_VERSION\s*=\s*['"]([^'"]+)/)?.[1];
assert.ok(version,'APP_VERSION bulunamadı');
assert.ok(fs.readFileSync(path.join(root,'KULLANIM.txt'),'utf8').includes('v'+version),'Kullanım sürümü tutarsız');
const report={version,syntaxFiles:codeFiles.length,localDependencies:dependencies,libraryDefinitions:library.length,protectedProjects:examples.length};
fs.mkdirSync(path.join(root,'build'),{recursive:true});
fs.writeFileSync(path.join(root,'build','check.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
