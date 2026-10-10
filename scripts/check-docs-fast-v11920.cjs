#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
function walk(dir){
  if(!fs.existsSync(dir))return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    const p=path.join(dir,e.name);
    return e.isDirectory()?walk(p):[p];
  });
}
function candidates(){
  const out=walk(path.join(root,'docs')).filter(p=>/\.md$/i.test(p));
  for(const name of fs.readdirSync(root)){
    if(/^V1\.19\.20_.*\.md$/.test(name))out.push(path.join(root,name));
  }
  return [...new Set(out)].sort();
}
function validateFile(file){
  const data=fs.readFileSync(file);
  if(!data.length)throw new Error('Boş doküman: '+path.relative(root,file));
  if(data.includes(0))throw new Error('NUL byte içeren doküman: '+path.relative(root,file));
  const text=data.toString('utf8');
  if(text.includes('\uFFFD'))throw new Error('Geçersiz UTF-8 doküman: '+path.relative(root,file));
  if(/^(?:<{7}|>{7}|\|{7})/m.test(text))throw new Error('Çözülmemiş merge conflict: '+path.relative(root,file));
}
function main(){
  const files=candidates();
  for(const file of files)validateFile(file);
  console.log('[DOCS-FAST] OK',files.length,'doküman');
  return {files:files.length};
}
if(require.main===module){
  try{main()}catch(e){console.error('[DOCS-FAST]',e.message);process.exit(1)}
}
module.exports={candidates,validateFile,main};
