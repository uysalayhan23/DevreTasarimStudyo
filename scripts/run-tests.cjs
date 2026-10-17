'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const tests=fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('.test.cjs')).sort().map(f=>'tests/'+f);
if(!tests.length)throw Error('Test dosyası bulunamadı.');
fs.mkdirSync(path.join(root,'build'),{recursive:true});
const report=fs.createWriteStream(path.join(root,'build','tests.tap'));
const child=spawn(process.execPath,['--test','--test-reporter=tap',...tests],{cwd:root,stdio:['ignore','pipe','inherit']});
let ioFailed=false;
report.on('error',error=>{ioFailed=true;console.error('TAP raporu yazılamadı:',error);child.kill();});
child.stdout.on('data',chunk=>{process.stdout.write(chunk);if(!ioFailed)report.write(chunk);});
child.on('error',error=>{ioFailed=true;console.error('Testler başlatılamadı:',error);});
child.on('close',(code,signal)=>{
 report.end(()=>{
  if(signal)console.error('Test süreci sinyalle sonlandı:',signal);
  process.exitCode=ioFailed||signal||typeof code!=='number'?1:code;
 });
});
