'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../dist/project-png.js');
test('P0-01 rejects hex XML entity spelling of CSS url()',()=>{
 assert.equal(P.cssCheck('<svg><path style="fill:&#x75;rl(https://example.invalid/a.png)"/></svg>').ok,false);
});
test('P0-01 rejects decimal XML entity spelling of CSS url()',()=>{
 assert.equal(P.cssCheck('<svg><path style="fill:&#117;rl(https://example.invalid/a.png)"/></svg>').ok,false);
});
test('P0-01 rejects encoded import directive without url token',()=>{
 assert.equal(P.cssCheck('<svg><style>&#64;import "https://example.invalid/a.css";</style></svg>').ok,false);
});
test('P0-01 encoded external protocol within url cannot be loaded',()=>{
 assert.equal(P.cssCheck('<svg><path fill="url(&#x68;ttps://example.invalid/a.png)"/></svg>').ok,false);
});
test('P0-01 local paint identifiers with numeric entity hash are still allowed',()=>{
 for(const css of ['<svg><path fill="url(&#35;paint)"/></svg>',
 '<svg><path fill="url(&#x23;paint)"/></svg>','<svg><path fill="url(#paint)"/></svg>'])
 assert.equal(P.cssCheck(css).ok,true);
});
test('P0-01 unencoded external URL remains blocked',()=>{
 assert.equal(P.cssCheck('<svg><path filter="url(assets/remote.svg#id)"/></svg>').ok,false);
});
