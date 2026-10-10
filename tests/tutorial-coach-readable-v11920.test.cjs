'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../dist/tutorial.css'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
const marker='/* MQ-07 readable floating coach text';
const end=css.indexOf('/* MQ-07 global contextual micro-explanations');
assert.ok(end>0);
const rules=css.slice(css.lastIndexOf(marker),end);
test('floating tutorial explanations use larger readable text, without changing canvas labels',()=>{
 assert.ok(rules.startsWith(marker));
 assert.match(rules,/#tutorialCoach :is\(p,li,[^}]+?font-size:13px;line-height:1\.5/);
 assert.match(rules,/#tutorialCoach small\{font-size:11px/);
 assert.match(rules,/#tutorialCoach :is\(h3,h4\)\{font-size:14px/);
 assert.match(rules,/#tutorialCoach \[class\$="-rich"\] button\{font-size:12px/);
 assert.doesNotMatch(rules,/\.tutorial-ref-callout|\.tutorial-ref-card|#propertiesPanel|#tutorialReferenceStage/);
});
test('floating tutorial window keeps its original size, resize, minimize and scroll constraints',()=>{
 assert.doesNotMatch(rules,/(?:^|[;{])\s*(?:min-|max-)?(?:width|height)\s*:/);
 assert.doesNotMatch(rules,/\b(?:left|right|top|bottom|resize|overflow|position|display|transform)\s*:/);
 assert.match(css,/#tutorialCoach\.is-minimized\{height:46px!important/);
 assert.match(css,/#tutorialCoach\.is-minimized>:not\(\.tutorial-float-bar\)\{display:none!important/);
 assert.match(css,/#tutorialCoach\{[^}]*resize:both;overflow:auto/);
});
test('runtime loads the updated tutorial CSS with a distinct cache key',()=>{
 assert.match(html,/tutorial\.css\?rev=20261010-measure-batch-a1/);
 assert.doesNotMatch(html,/tutorial\.css\?rev=20261009-energy-rich1/);
});
