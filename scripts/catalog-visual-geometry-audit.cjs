#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const catalogPath=path.resolve(__dirname,'../dist/library.js');
function inspect(items){
 const issues=[];const seen=new Set();
 for(const d of items){
  if(!d||typeof d.id!=='string'||!d.id){issues.push({id:null,issue:'invalid-component-id'});continue}
  if(seen.has(d.id))issues.push({id:d.id,issue:'duplicate-component-id'});else seen.add(d.id);
  if(!Number.isFinite(d.w)||d.w<=0||!Number.isFinite(d.h)||d.h<=0){issues.push({id:d.id,issue:'invalid-footprint'});continue}
  const pins=new Set();for(const p of Array.isArray(d.pins)?d.pins:[]){
   if(!p||typeof p.id!=='string'||!p.id){issues.push({id:d.id,issue:'invalid-pin-id'});continue}
   if(pins.has(p.id))issues.push({id:d.id,issue:'duplicate-pin-id',pin:p.id});else pins.add(p.id);
   if(!Number.isFinite(p.x)||!Number.isFinite(p.y))issues.push({id:d.id,issue:'invalid-pin-point',pin:p.id});
   else if(p.x<0||p.y<0||p.x>d.w||p.y>d.h)issues.push({id:d.id,issue:'pin-outside-footprint',pin:p.id,x:p.x,y:p.y,w:d.w,h:d.h});
  }
  if(d.runtimeVisualCalibration?.targetFrameMm){const f=d.runtimeVisualCalibration.targetFrameMm;if(!Number.isFinite(f.width)||f.width<=0||!Number.isFinite(f.height)||f.height<=0)issues.push({id:d.id,issue:'invalid-calibration'});}
 }
 return {total:items.length,issues};
}
function load(file=catalogPath){const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file,timeout:10000});return context.window.COMPONENT_LIBRARY;}
if(require.main===module){const result=inspect(load());console.log(JSON.stringify({total:result.total,issueCount:result.issues.length,issues:result.issues.slice(0,100)},null,2));if(result.issues.length)process.exitCode=1;}
module.exports={inspect,load};

