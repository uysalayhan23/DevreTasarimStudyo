const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Browser=require('../scripts/browser-visual-v11920.cjs');

test('WP-012 PNG metadata parser accepts deterministic screenshot dimensions',()=>{
  const b=Buffer.alloc(24);b[0]=0x89;b.write('PNG',1,'ascii');b.writeUInt32BE(1440,16);b.writeUInt32BE(1000,20);
  assert.deepEqual(Browser.pngSize(b),{width:1440,height:1000});
  assert.throws(()=>Browser.pngSize(Buffer.from('not png')),/Geçersiz PNG/);
});

test('WP-012 dashboard geometry guard rejects collapsed real-browser cards',()=>{
  const good={cards:Array.from({length:5},()=>({width:220,height:140}))};
  assert.doesNotThrow(()=>Browser.validateCards(good));
  assert.throws(()=>Browser.validateCards({cards:[{width:20,height:140}]}));
});

test('WP-012 runner uses real Chrome CDP, fixed viewport and screenshot capture without browser-test packages',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../scripts/browser-visual-v11920.cjs'),'utf8');
  assert.match(source,/remote-debugging-port=0/);
  assert.match(source,/Emulation\.setDeviceMetricsOverride/);
  assert.match(source,/Page\.captureScreenshot/);
  assert.match(source,/Runtime\.exceptionThrown/);
  for(const state of ['dashboard','editor','panel','tutorial'])assert.match(source,new RegExp("shot\\(cdp,'"+state+"'\\)"));
  assert.doesNotMatch(source,/require\(['"](?:playwright|puppeteer|selenium)/);
});

test('WP-012 visual golden explicitly covers dashboard editor panel and tutorial',()=>{
  const golden=JSON.parse(fs.readFileSync(path.join(__dirname,'browser-visual-golden-v11920.json'),'utf8'));
  assert.deepEqual(golden.viewport,{width:1440,height:1000});
  for(const key of ['dashboard','editor','panel','tutorial'])assert.ok(golden[key],key);
});
