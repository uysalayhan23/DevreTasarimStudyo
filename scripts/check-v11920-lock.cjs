#!/usr/bin/env node
'use strict';

const fs = require('fs');
const crypto = require('crypto');

const EXPECTED = {
  'V1.19.20_MASTER_QUALITY_AGENT_PROGRAM_LOCKED.md': '8b19cb93b019c41e8e068d446c56f4e471489f22',
  'docs/AGENT_TEAM_V1.19.20.md': 'd4cb7c9692e72d8f5f1303d1a7b65f6d1f7c6688',
  'V1.19.20_AGENT_TEAM_WORKFLOW_LOCKED.md': '76b2b82679bb228eb6047774ff26a98f1094fcb4',
  'V1.19.20_TECHNICAL_DIRECTOR_ORCHESTRATION_LOCKED.md': 'b4bcf4cb3f7d9fa38dd1de166bff89d29fd742bd'
};

function gitBlobSha(path) {
  const data = fs.readFileSync(path);
  const head = Buffer.from('blob ' + data.length + '\0');
  return crypto.createHash('sha1').update(Buffer.concat([head, data])).digest('hex');
}

let failed = false;
for (const [path, expected] of Object.entries(EXPECTED)) {
  if (!fs.existsSync(path)) {
    console.error('[LOCK] Eksik kilit dosyası:', path);
    failed = true;
    continue;
  }
  const actual = gitBlobSha(path);
  if (actual !== expected) {
    console.error('[LOCK] Kilit dosyası değişti:', path);
    console.error('       beklenen:', expected);
    console.error('       gerçek  :', actual);
    failed = true;
  } else {
    console.log('[LOCK] OK', path, actual);
  }
}

const ref = process.env.GITHUB_REF_NAME || '';
const base = process.env.GITHUB_BASE_REF || '';
if (base && base !== 'v1.19.20') {
  console.error('[LOCK] PR hedef dalı v1.19.20 olmalıdır. Gerçek:', base);
  failed = true;
}
if (!base && ref && ref !== 'v1.19.20') {
  console.error('[LOCK] Bu kalite workflowu yalnız v1.19.20 için geçerlidir. Gerçek:', ref);
  failed = true;
}

if (failed) process.exit(1);
console.log('[LOCK] v1.19.20 politika dosyaları ve aktif dal kontrolü başarılı.');
