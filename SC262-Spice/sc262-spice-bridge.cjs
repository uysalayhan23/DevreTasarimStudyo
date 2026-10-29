'use strict';
// SC262 optional ngspice bridge. Run separately; does NOT modify BASLAT.bat.
// Does not accept arbitrary netlists, file paths, or shell commands over HTTP.
const http = require('node:http');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const os = require('node:os');
const PORT = 18762;
const host = '127.0.0.1';
const ngspice = process.env.SC262_NGSPICE || 'ngspice';
const netlist = path.resolve(__dirname, 'SC262_BD139_Schmitt_ngspice47.cir');
const token = crypto.randomBytes(24).toString('hex');
function parseMeasurements(output) {
  const read = name => {
    const match = output.match(new RegExp('(?:^|\\n)\\s*' + name + '\\s*=\\s*([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?)', 'i'));
    return match ? Number(match[1]) : null;
  };
  const rising = read('vin_up'), falling = read('vin_down');
  const outStart = read('out_start'), outPeak = read('out_peak'), outEnd = read('out_end');
  if (![rising, falling, outStart, outPeak, outEnd].every(Number.isFinite)) throw new Error('Missing SPICE measurements');
  if (!(rising > falling && rising >= 0 && rising <= 12 && falling >= 0 && falling <= 12)) throw new Error('No measured positive hysteresis');
  return { risingV: rising, fallingV: falling, hysteresisV: rising - falling, outStartV: outStart, outPeakV: outPeak, outEndV: outEnd, model: 'BD139_APPROX', acceptance: 'exploratory-only' };
}
function runSpice() { return new Promise((resolve, reject) => {
  if (!fs.existsSync(netlist)) return reject(new Error('SC262 netlist missing'));
  const p = spawn(ngspice, ['-b', netlist], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let combined = ''; let done = false;
  const timeout = setTimeout(() => { p.kill(); reject(new Error('SPICE timeout')); }, 20000);
  const append = chunk => { combined += String(chunk); if (combined.length > 2_000_000) p.kill(); };
  p.stdout.on('data', append); p.stderr.on('data', append);
  p.on('error', e => { if (done) return; done = true; clearTimeout(timeout); reject(e); });
  p.on('close', code => { if (done) return; done = true; clearTimeout(timeout); try {
    if (code !== 0 || /fatal error|simulation interrupted|timestep too small|failed/i.test(combined)) throw new Error('SPICE failed');
    resolve(parseMeasurements(combined));
  } catch (e) { reject(e); } });
}); }
const server = http.createServer(async (req, res) => {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Access-Control-Allow-Origin': 'null', 'Access-Control-Allow-Headers': 'x-sc262-token', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Vary': 'Origin' };
  if (req.headers.origin && req.headers.origin !== 'null') { res.writeHead(403); res.end(); return; }
  if (req.method === 'OPTIONS' && req.url === '/sc262') { res.writeHead(204, headers); res.end(); return; }
  const reply = (code, obj) => { res.writeHead(code, headers); res.end(JSON.stringify(obj)); };
  if (req.method !== 'GET' || req.url !== '/sc262') return reply(404, { error: 'not-found' });
  if (req.headers['x-sc262-token'] !== token) return reply(403, { error: 'forbidden' });
  try { reply(200, await runSpice()); } catch (e) { reply(503, { error: 'spice-unavailable-or-invalid', detail: e.message }); }
});
server.listen(PORT, host, () => {
  process.stdout.write(`SC262 bridge listening on http://${host}:${PORT}/sc262\n`);
  process.stdout.write(`SC262 access token (local only): ${token}\n`);
  process.stdout.write(`ngspice executable: ${ngspice}\n`);
});
