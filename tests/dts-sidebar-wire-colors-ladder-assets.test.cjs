'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../dist');
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
test('right side panel preserves inline electrical wire color swatches',()=>{
 const css=read('studio.css');
 assert.match(css,/\.properties-panel button:not\(\.color-dot\)/);
 assert.doesNotMatch(css,/\.properties-panel button\s*,\.library-panel button\s*\{/);
 assert.match(read('app.js'),/class="color-dot"[^>]*style="background:\$\{c\}"/);
});
test('palette swatches retain their active outline and 20-color compact grid',()=>{
 const css=read('styles.css');
 assert.match(css,/#colorPalette\s*\{display:grid;grid-template-columns:repeat\(10,1fr\)/);
 assert.match(css,/#colorPalette\s+\.color-dot\.active\s*\{outline:2px solid/);
 assert.match(read('studio.css'),/\.color-dot\.active\s*\{/);
});
test('offline HTML refreshes repaired Ladder and wire palette assets',()=>{
 const html=read('index.html');
 assert.match(html,/studio\.css\?rev=20261029-wire-palette-ladder1/);
 assert.match(html,/ladder-editor\.js\?rev=20261029-open-guidance1/);
 const app=html.indexOf('app.js?'),ladder=html.indexOf('ladder-editor.js?');
 assert.ok(app>=0&&ladder>app);
});
