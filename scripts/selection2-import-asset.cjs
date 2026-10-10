#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');

const ROOT=path.resolve(__dirname,'..');
const PRODUCTS=Object.freeze({
  'siemens-3rt2016-1bb41':Object.freeze({kind:'visual',slug:'siemens-3rt2016-1bb41'}),
  'siemens-3rv2011-1ja10':Object.freeze({kind:'visual',slug:'siemens-3rv2011-1ja10'}),
  'siemens-5tl1163-0':Object.freeze({kind:'visual',slug:'siemens-5tl1163-0'}),
  'weidmuller-2466870000':Object.freeze({kind:'visual+cad',slug:'weidmuller-2466870000'}),
  'rittal-3241100':Object.freeze({kind:'visual',slug:'rittal-3241100'}),
  'sick-wtb4-3p2161':Object.freeze({kind:'visual',slug:'sick-wtb4-3p2161'})
});

const VISUAL_EXT=new Set(['.png','.jpg','.jpeg','.webp']);
const CAD_EXT=new Set(['.step','.stp','.dxf','.dwg','.zip']);
const AUTHORITIES=new Set(['manufacturer','supplier']);

function parseArgs(argv){
  const out={};
  for(let i=0;i<argv.length;i++){
    const a=argv[i];
    if(!a.startsWith('--'))continue;
    const key=a.slice(2),next=argv[i+1];
    if(next!==undefined&&!next.startsWith('--')){out[key]=next;i++}
    else out[key]='true';
  }
  return out;
}
function sha256(buf){return crypto.createHash('sha256').update(buf).digest('hex')}
function ensureHttps(url){return typeof url==='string'&&/^https:\/\//i.test(url)}
function bool(v){return /^(1|true|yes)$/i.test(String(v||''))}
function jpegSize(buf){
  if(buf.length<4||buf[0]!==0xff||buf[1]!==0xd8)return null;
  let i=2;
  while(i+9<buf.length){
    if(buf[i]!==0xff){i++;continue}
    const marker=buf[i+1];i+=2;
    if(marker===0xd8||marker===0xd9)continue;
    if(i+2>buf.length)return null;
    const len=buf.readUInt16BE(i);
    if(len<2||i+len>buf.length)return null;
    if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){
      return {width:buf.readUInt16BE(i+5),height:buf.readUInt16BE(i+3)};
    }
    i+=len;
  }
  return null;
}
function pngSize(buf){
  if(buf.length>=24&&buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))){
    return {width:buf.readUInt32BE(16),height:buf.readUInt32BE(20)};
  }
  return null;
}
function imageSize(buf,ext){return ext==='.png'?pngSize(buf):['.jpg','.jpeg'].includes(ext)?jpegSize(buf):null}

function validateVisual(meta){
  const errors=[];
  if(!PRODUCTS[meta.product])errors.push('unsupported-product');
  if(!VISUAL_EXT.has(meta.ext))errors.push('unsupported-visual-extension');
  if(meta.orientation!=='orthographic-front')errors.push('orthographic-front-required');
  if(meta.exactModel!==true)errors.push('exact-model-proof-required');
  if(!AUTHORITIES.has(meta.sourceAuthority))errors.push('manufacturer-or-supplier-authority-required');
  if(!ensureHttps(meta.sourceUrl))errors.push('https-source-url-required');
  return errors;
}
function validateCad(meta){
  const errors=[];
  if(meta.product!=='weidmuller-2466870000')errors.push('cad-import-currently-scoped-to-protop');
  if(!CAD_EXT.has(meta.ext))errors.push('unsupported-cad-extension');
  if(meta.exactModel!==true)errors.push('exact-model-proof-required');
  if(!ensureHttps(meta.sourceUrl))errors.push('https-source-url-required');
  return errors;
}
function stageFile(opts){
  const product=PRODUCTS[opts.product];
  if(!product)throw new Error('Unsupported product: '+String(opts.product||''));
  const input=path.resolve(opts.input||'');
  if(!fs.existsSync(input)||!fs.statSync(input).isFile())throw new Error('Input file not found: '+input);
  const ext=path.extname(input).toLowerCase();
  const mode=opts.mode||'visual';
  const meta={
    product:opts.product,mode,ext,
    orientation:opts.orientation||null,
    exactModel:bool(opts['exact-model']),
    sourceAuthority:opts['source-authority']||null,
    sourceUrl:opts['source-url']||null
  };
  const errors=mode==='cad'?validateCad(meta):validateVisual(meta);
  if(errors.length)throw new Error('Fail-closed: '+errors.join(', '));
  const buf=fs.readFileSync(input);
  const digest=sha256(buf);
  const size=mode==='visual'?imageSize(buf,ext):null;
  const outDir=path.join(ROOT,'evidence','selection2',mode==='cad'?'cad':'imported');
  fs.mkdirSync(outDir,{recursive:true});
  const stem=product.slug+(mode==='cad'?'-exact-cad-candidate':'-orthographic-front-candidate');
  const dest=path.join(outDir,stem+ext);
  fs.copyFileSync(input,dest);
  const sidecar={
    schemaVersion:1,
    status:'candidate-not-promoted',
    productKey:opts.product,
    mode,
    importedAt:new Date().toISOString(),
    source:{url:meta.sourceUrl,authority:meta.sourceAuthority||'manufacturer-cad-portal'},
    qualification:{
      exactModel:meta.exactModel,
      orientation:mode==='visual'?meta.orientation:null,
      binaryStoredInRepo:true,
      pixelOrCadAuditRequired:true,
      promotionAllowed:false
    },
    file:{path:path.relative(ROOT,dest).replace(/\\/g,'/'),sha256:digest,bytes:buf.length,...(size||{})}
  };
  const sidecarPath=dest+'.evidence.json';
  fs.writeFileSync(sidecarPath,JSON.stringify(sidecar,null,2)+'\n');
  return {dest,sidecarPath,sidecar};
}

function usage(){
  return [
    'Selection 2 fail-closed binary intake',
    '',
    'Visual:',
    '  node scripts/selection2-import-asset.cjs --mode visual --product <key> --input <file> --source-url https://... --source-authority manufacturer|supplier --orientation orthographic-front --exact-model true',
    '',
    'PROtop CAD:',
    '  node scripts/selection2-import-asset.cjs --mode cad --product weidmuller-2466870000 --input <step|dxf|dwg|zip> --source-url https://... --exact-model true',
    '',
    'This script stages evidence only. It NEVER sets panelGeometryReady or promoted.'
  ].join('\n');
}

if(require.main===module){
  const args=parseArgs(process.argv.slice(2));
  if(args.help||!args.product||!args.input){console.log(usage());process.exit(args.help?0:2)}
  try{
    const result=stageFile(args);
    console.log(JSON.stringify({ok:true,file:result.sidecar.file,status:result.sidecar.status},null,2));
  }catch(err){
    console.error(String(err?.message||err));
    process.exit(1);
  }
}

module.exports={PRODUCTS,parseArgs,validateVisual,validateCad,stageFile,sha256,imageSize};
