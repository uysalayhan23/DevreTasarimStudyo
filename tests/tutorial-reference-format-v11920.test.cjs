'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');

test('seventeen tutorial pages use the common rich reference stage',()=>{
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 for(const token of [
  'function isReferenceFormatLesson',
  'function referenceStageData',
  'function referenceStageHtml',
  'tutorial-reference-stage',
  'Ayarlanabilir DC güç kaynağı',
  'Ayarlı DC kaynak',
  'Seri paket  (+ → Pil 1 → Pil 2 → −)',
  'Karşılaştır  (V · Ah · Wh · kimya · kullanım)',
  'Paralel paket  (+ ↔ +   ·   − ↔ −)',
  'Akım yolu  (+ → A1 → R1 → −)',
  'Tek akım yolu  G1 (+) → A1 → R1 → R2 → G1 (−)',
  'Akım bölünür  (+ → A1 → { R1 || R2 } → −)',
  'Önce sadeleştir  R1 + (R2 || R3)',
  'KCL  103,45 ≈ 62,07 + 41,38 mA',
  'Gerilim = iki nokta arasındaki potansiyel farkı',
  'Akım ölçümü = devreyi aç → ampermetreyi seri araya koy',
  'Direnç ölçümü = enerjiyi kes → Ω kademesini seç',
  'Pens ölçümü = devreyi kesme → tek AC iletkeni çeneden geçir',
  'OUT → VΩHz   ·   GND → COM   ·   f = 1 / T',
  'Sanal kaynak → CT → yük   ·   EA1: V + I → P / Q / S / PF / Hz',
  'data-reference-answer'
 ])assert.ok(m.includes(token),token);
});

test('reference format provides top callouts, side probes and four bottom learning cards',()=>{
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 for(const token of [
  '.tutorial-ref-top',
  '.tutorial-ref-side-left',
  '.tutorial-ref-side-right',
  '.tutorial-ref-flow',
  '.tutorial-ref-bottom',
  '.tutorial-ref-question',
  '.tutorial-ref-info',
  '.tutorial-ref-observe',
  '.tutorial-ref-task',
  'body.tutorial-reference-format #tutorialCoach.tutorial-reference-coach'
 ])assert.ok(c.includes(token),token);
});

test('reference format keeps a floating coach and a user-toggleable side panel',()=>{
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 assert.match(c,/body\.tutorial-reference-format #propertiesPanel\{display:block!important\}/);
 assert.match(c,/body\.tutorial-reference-format\.properties-collapsed #propertiesPanel\{display:none!important\}/);
 assert.doesNotMatch(c,/body\.tutorial-reference-format #propertiesPanel\{display:none!important\}/);
 assert.match(c,/#tutorialCoach\.is-minimized/);
 assert.match(c,/resize:both!important/);
 assert.ok(m.includes('COACH_UI_KEY'));
 assert.ok(m.includes('function mountCoachChrome'));
 assert.ok(m.includes('data-tutorial-coach-minimize'));
 assert.ok(m.includes('data-tutorial-coach-close'));
 assert.ok(h.includes('id="closeProperties"'));
 assert.ok(h.includes('id="openProperties"'));
 assert.ok(h.includes('id="tutorialCoachPanelControl"'));
 assert.doesNotMatch(c,/body\.tutorial-reference-format #componentLibrary\{display:none/);
});

test('reference format cache chain is current',()=>{
 const h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
 const b=fs.readFileSync(path.join(root,'dist','tutorial-bootstrap.js'),'utf8');
 assert.match(h,/tutorial\.css\?rev=20261010-measure-batch-d2/);
 assert.match(h,/tutorial-bootstrap\.js\?rev=20261010-control-batch-f1/);
 assert.match(b,/tutorial-mode\.js\?v=1\.19\.20-control-batch-f1/);
});


test('Basic Electricity 7 series analysis is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function dcSeriesAnalysisProject',
  "seriesAnalysisRich=true",
  "designStandard='rich-reference-v1'",
  'Rtoplam=320 Ω',
  'expectedCurrentA:.075'
 ])assert.ok(p.includes(token),token);
 for(const token of [
  'function isSeriesAnalysisLesson',
  'function seriesAnalysisNoteHtml',
  'TEMEL ELEKTRİK 7 · SERİ DEVRE ANALİZİ',
  '75 mA',
  '7,5 V',
  '16,5 V'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-series-purpose','.tutorial-series-results','.tutorial-series-measure','.tutorial-series-check'])assert.ok(c.includes(token),token);
 assert.match(d,/KİLİTLİ \/ ZORUNLU \/ v1\.19\.20/);
 assert.match(d,/Devrenin amacı nedir\?/);
 assert.match(d,/Hangi eleman ne yapıyor\?/);
 assert.match(d,/Ölçüm nasıl yapılır\?/);
 assert.match(d,/Neden o şekilde bağlanır\?/);
 assert.match(d,/Beklenen sonuç nedir\?/);
});


test('Basic Electricity 8 parallel analysis is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function dcParallelAnalysisProject',
  "parallelAnalysisRich=true",
  "designStandard='rich-reference-v1'",
  'equivalentResistance:68.75',
  'branchCurrentR1A:.24',
  'expectedTotalCurrentA'
 ])assert.ok(p.includes(token),token);
 for(const token of [
  'function isParallelAnalysisLesson',
  'function parallelAnalysisNoteHtml',
  'TEMEL ELEKTRİK 8 · PARALEL DEVRE ANALİZİ',
  '68,75 Ω',
  '240 mA',
  '≈109 mA',
  '≈349 mA',
  'data-parallel-voltage'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-parallel-analysis-purpose','.tutorial-parallel-analysis-results','.tutorial-parallel-analysis-measure','.tutorial-parallel-analysis-check'])assert.ok(c.includes(token),token);
 assert.match(d,/## 10\. Yüzer ders anlatımı penceresi/);
 assert.match(d,/## 11\. Sağ yan panel aç\/kapa standardı/);
 assert.match(d,/## 12\. Temel Elektrik 8 referans kilidi/);
 assert.match(d,/Itoplam ≈ 349 mA/);
});


test('Basic Electricity 9 mixed analysis is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function dcMixedAnalysisProject',
  "mixedAnalysisRich=true",
  "designStandard='rich-reference-v1'",
  'parallelEquivalent:132',
  'totalEquivalent:232',
  'expectedTotalCurrentA:24/232'
 ])assert.ok(p.includes(token),token);
 for(const token of [
  'function isMixedAnalysisLesson',
  'function mixedAnalysisNoteHtml',
  'TEMEL ELEKTRİK 9 · KARIŞIK DEVRE ANALİZİ',
  '103,45 mA',
  '10,34 V',
  '13,66 V',
  '62,07 mA',
  '41,38 mA',
  'data-mixed-voltage'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-mixed-purpose','.tutorial-mixed-steps','.tutorial-mixed-results','.tutorial-mixed-measure','.tutorial-mixed-checks'])assert.ok(c.includes(token),token);
 assert.match(d,/## 13\. Temel Elektrik 9 referans kilidi/);
 assert.match(d,/R2 \|\| R3 = 132 Ω/);
 assert.match(d,/Itoplam ≈ 103,45 mA/);
 assert.match(d,/I2 \+ I3 ≈ Itoplam/);
});


test('Basic Electricity 10 Kirchhoff control is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function dcKirchhoffControlProject',
  "kirchhoffControlRich=true",
  "designStandard='rich-reference-v1'",
  'parallelEquivalent:132',
  'totalEquivalent:232',
  'physicalProbes:true',
  'DCV 200 V · seçilebilir gerilim ölçümü'
 ])assert.ok(p.includes(token),token);
 const block=p.match(/function dcKirchhoffControlProject[\s\S]*?return p;\n}/)?.[0]||'';
 assert.equal((block.match(/C\('a1'/g)||[]).length,1);
 assert.equal((block.match(/C\('v1'/g)||[]).length,1);
 assert.doesNotMatch(block,/C\('a2'|C\('a3'|C\('v0'|C\('v2'/);
 for(const token of [
  'function isKirchhoffControlLesson',
  'function kirchhoffControlNoteHtml',
  'function setKirchhoffCurrentTarget',
  'function setKirchhoffVoltageTarget',
  'TEMEL ELEKTRİK 10 · KIRCHHOFF KANUNLARIYLA DEVRE KONTROLÜ',
  '103,45 mA',
  '62,07 mA',
  '41,38 mA',
  '10,34 V',
  '13,66 V',
  'data-kirchhoff-current',
  'data-kirchhoff-voltage'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-kirchhoff-purpose','.tutorial-kirchhoff-equations','.tutorial-kirchhoff-measure','.tutorial-kirchhoff-check'])assert.ok(c.includes(token),token);
 assert.match(d,/## 14\. Temel Elektrik 10 referans kilidi/);
 assert.match(d,/Itoplam ≈ I2 \+ I3/);
 assert.match(d,/Vkaynak ≈ VR1 \+ Vparalel/);
});


test('Voltmeter voltage measurement is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function dcVoltageMeasurementRichProject',
  "voltageMeasurementRich=true",
  "designStandard='rich-reference-v1'",
  'physicalProbes:true',
  "meterRange:'DCV 200 V'",
  'expectedCurrentA:.024'
 ])assert.ok(p.includes(token),token);
 const block=p.match(/function dcVoltageMeasurementRichProject[\s\S]*?return p;\n}/)?.[0]||'';
 assert.equal((block.match(/C\('v1'/g)||[]).length,1);
 assert.match(block,/arduino-bench-supply/);
 assert.doesNotMatch(block,/meter-voltmeter/);
 for(const token of [
  'function isVoltageMeasurementLesson',
  'function voltageMeasurementNoteHtml',
  'function setVoltageMeasurePreset',
  'VOLTMETRE İLE GERİLİM ÖLÇÜMÜ',
  'data-voltage-preset="load"',
  'data-voltage-preset="source"',
  'data-voltage-preset="same"',
  'data-voltage-preset="reverse"',
  '≈ +24 V',
  '≈ 0 V',
  '≈ −24 V',
  'DCV 200 V'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-voltage-purpose','.tutorial-voltage-measure','.tutorial-voltage-why','.tutorial-voltage-check'])assert.ok(c.includes(token),token);
 assert.match(d,/## 15\. Voltmetre ile gerilim ölçümü referans kilidi/);
 assert.match(d,/R1 uçları → `≈ \+24 V`/);
 assert.match(d,/Aynı elektriksel düğüm → `≈ 0 V`/);
 assert.match(d,/Ters polarite → `≈ −24 V`/);
});


test('Ammeter current measurement is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function dcCurrentMeasurementRichProject',
  "currentMeasurementRich=true",
  "designStandard='rich-reference-v1'",
  'physicalProbes:true',
  "meterRange:'DCA 200 mA'",
  'expectedCurrentA:.024'
 ])assert.ok(p.includes(token),token);
 const block=p.match(/function dcCurrentMeasurementRichProject[\s\S]*?return p;\n}/)?.[0]||'';
 assert.equal((block.match(/C\('a1'/g)||[]).length,1);
 assert.match(block,/arduino-bench-supply/);
 assert.doesNotMatch(block,/meter-ammeter/);
 for(const token of [
  'function isCurrentMeasurementLesson',
  'function currentMeasurementNoteHtml',
  'function setCurrentMeasurePreset',
  'AMPERMETRE İLE AKIM ÖLÇÜMÜ',
  'data-current-preset="high"',
  'data-current-preset="low"',
  'data-current-preset="reverse"',
  '≈ +24 mA',
  '≈ −24 mA',
  'DCA 200 mA'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-currentmeasure-purpose','.tutorial-currentmeasure-measure','.tutorial-currentmeasure-why','.tutorial-currentmeasure-check'])assert.ok(c.includes(token),token);
 assert.match(d,/## 16\. Ampermetre ile akım ölçümü referans kilidi/);
 assert.match(d,/Yük öncesi → `≈ \+24 mA`/);
 assert.match(d,/Yük sonrası → `≈ \+24 mA`/);
 assert.match(d,/Ters prob yönü → `≈ −24 mA`/);
});


test('Resistance measurement is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const mm=fs.readFileSync(path.join(root,'dist','multimeter.js'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function resistanceMeasurementRichProject',
  "resistanceMeasurementRich=true",
  "designStandard='rich-reference-v1'",
  'physicalProbes:true',
  'sourceOff:true',
  "meterRange:'Ω 2 kΩ'",
  'meterPosition:15'
 ])assert.ok(p.includes(token),token);
 const block=p.match(/function resistanceMeasurementRichProject[\s\S]*?return p;\n}/)?.[0]||'';
 assert.equal((block.match(/C\('m1'/g)||[]).length,1);
 assert.match(block,/arduino-bench-supply/);
 assert.match(block,/dcVoltage:0/);
 assert.match(block,/resistance:1000/);
 assert.doesNotMatch(block,/W\('g'/);
 for(const token of [
  'function isResistanceMeasurementLesson',
  'function resistanceMeasurementNoteHtml',
  'function setResistanceMeasurePreset',
  'MULTİMETRE İLE DİRENÇ ÖLÇÜMÜ',
  'data-resistance-preset="resistor"',
  'data-resistance-preset="short"',
  'data-resistance-preset="open"',
  '≈ 1,000 kΩ',
  '≈ 0 Ω',
  'OL',
  'Ω 2 kΩ'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-resistance-safety','.tutorial-resistance-purpose','.tutorial-resistance-measure','.tutorial-resistance-check'])assert.ok(c.includes(token),token);
 assert.match(mm,/\['Ω',2000\]/);
 assert.match(mm,/Direnç \/ diyot ölçümü için devrenin enerjisini kesin/);
 assert.match(d,/## 17\. Multimetre ile direnç ölçümü referans kilidi/);
 assert.match(d,/R1 iki ucu → `≈ 1,000 kΩ`/);
 assert.match(d,/Problar aynı noktada → `≈ 0 Ω`/);
 assert.match(d,/Problar açık \/ temas yok → `OL`/);
});


test('Clamp current measurement is locked to rich-reference-v1',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const cm=fs.readFileSync(path.join(root,'dist','clamp-meter.js'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function clampCurrentMeasurementRichProject',
  "clampCurrentMeasurementRich=true",
  "designStandard='rich-reference-v1'",
  "clampMeter:'UNI-T UT200A'",
  'acOnly:true',
  "clampRange:'ACA 2 A'",
  'expectedCurrentA:1',
  'meterPosition:1'
 ])assert.ok(p.includes(token),token);
 const block=p.match(/function clampCurrentMeasurementRichProject[\s\S]*?return p;\n}/)?.[0]||'';
 assert.equal((block.match(/C\('cl','unit-ut200a'/g)||[]).length,1);
 assert.equal((block.match(/C\('dcRef','arduino-bench-supply'/g)||[]).length,1);
 assert.equal((block.match(/C\('ac','supply-1p'/g)||[]).length,1);
 assert.match(block,/resistance:230/);
 assert.match(block,/dcVoltage:0/);
 assert.match(block,/clampedWireId:phaseId/);
 assert.doesNotMatch(block,/dcMeasurementProject/);
 for(const token of [
  'function isClampCurrentMeasurementLesson',
  'function clampCurrentMeasurementNoteHtml',
  'function setClampMeasurePreset',
  'PENS AMPERMETRE İLE AKIM ÖLÇÜMÜ',
  'data-clamp-preset="phase"',
  'data-clamp-preset="neutral"',
  'data-clamp-preset="none"',
  '≈ 1,000 A RMS',
  'ACA 2 A',
  'SIMÜLASYON LABORATUVARI'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-clamp-simonly','.tutorial-clamp-purpose','.tutorial-clamp-measure','.tutorial-clamp-check'])assert.ok(c.includes(token),token);
 assert.match(cm,/\['ACA',2\]/);
 assert.match(cm,/UT200A pens akımı yalnız AC akım ölçer/);
 assert.match(d,/## 18\. Pens ampermetre ile akım ölçümü referans kilidi/);
 assert.match(d,/Faz iletkeni → `≈ 1,000 A RMS`/);
 assert.match(d,/Nötr iletkeni → `≈ 1,000 A RMS`/);
 assert.match(d,/yalnız \*\*simülasyon laboratuvarıdır\*\*/);
});


test('Frequency measurement uses real UT61E+ and keeps UT33D+ unchanged',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const mm=fs.readFileSync(path.join(root,'dist','multimeter.js'),'utf8');
 const tc=fs.readFileSync(path.join(root,'dist','tutorial-components.js'),'utf8');
 const mat=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function frequencyMeasurementRichProject',
  "frequencyMeasurementRich=true",
  "multimeterModel:'UNI-T UT61E+'",
  "designStandard='rich-reference-v1'",
  'simulationOnly:true',
  "meterPosition:5",
  "frequencies:[50,1000,10000]",
  "periodsMs:[20,1,.1]"
 ])assert.ok(p.includes(token),token);
 const block=p.match(/function frequencyMeasurementRichProject[\s\S]*?return p;\n}/)?.[0]||'';
 assert.equal((block.match(/C\('m1','unit-ut61e-plus'/g)||[]).length,1);
 assert.match(block,/arduino-signal-generator/);
 assert.match(block,/arduino-bench-supply/);
 assert.match(block,/dcVoltage:0/);
 assert.doesNotMatch(block,/tutorial-frequency-meter/);
 for(const token of [
  'function isFrequencyMeasurementLesson',
  'function frequencyMeasurementNoteHtml',
  'function setFrequencyMeasurePreset',
  'FREKANSMETRE İLE FREKANS ÖLÇÜMÜ',
  'data-frequency-preset="50"',
  'data-frequency-preset="1000"',
  'data-frequency-preset="10000"',
  'UNI‑T UT61E+',
  'T = 1/f',
  'SIMÜLASYON LABORATUVARI'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-frequency-simonly','.tutorial-frequency-purpose','.tutorial-frequency-live','.tutorial-frequency-measure','.tutorial-frequency-check'])assert.ok(c.includes(token),token);
 assert.match(tc,/id:'unit-ut61e-plus'/);
 assert.match(tc,/model:'UT61E\+ · 22000 count · frekans 220 MHz'/);
 assert.match(mat,/data-material="unit-ut61e-plus-vector"/);
 assert.match(mm,/const ut61Ranges=/);
 assert.match(mm,/\['Hz',220000000\]/);
 const ut33=mm.match(/const ranges=\[([\s\S]*?)\];\n const ut61Ranges=/)?.[1]||'';
 assert.doesNotMatch(ut33,/\['Hz'/);
 const M=require('../dist/multimeter.js');
 assert.equal(M.rangesFor({id:'unit-ut61e-plus'})[5][0],'Hz');
 assert.ok(!M.ranges.some(r=>r[0]==='Hz'));
 assert.deepEqual(M.format(1000,'Hz',220000000),{display:'1.000',unit:'kHz'});
 assert.deepEqual(M.format(10000,'Hz',220000000),{display:'10.00',unit:'kHz'});
 assert.match(d,/## 19\. Frekansmetre ile frekans ölçümü referans kilidi/);
 assert.match(d,/UT33D\+ üzerine gerçekte bulunmayan sahte bir Hz kademesi eklenemez/);
 assert.match(d,/50 Hz.*20 ms/);
 assert.match(d,/1 kHz.*1 ms/);
 assert.match(d,/10 kHz.*0,1 ms/);
});


test('Energy analyzer replaces wattmeter and cosphi with functional rich lab',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 const tc=fs.readFileSync(path.join(root,'dist','tutorial-components.js'),'utf8');
 const cm=fs.readFileSync(path.join(root,'dist','current-model.js'),'utf8');
 const mat=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
 const idx=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
 const d=fs.readFileSync(path.join(root,'docs','TUTORIAL_DESIGN_STANDARD_LOCK_V1.19.20.md'),'utf8');
 for(const token of [
  'function energyAnalyzerPowerProject',
  "energyAnalyzerRich=true",
  "energyAnalyzer:'energy-analyzer-1p'",
  "designStandard='rich-reference-v1'",
  "apparentPowerVA:230",
  "powerFactor:.8",
  "loadCharacter:character"
 ])assert.ok(p.includes(token),token);
 const block=p.match(/function energyAnalyzerPowerProject[\s\S]*?return p;\n}/)?.[0]||'';
 assert.equal((block.match(/C\('ea1','energy-analyzer-1p'/g)||[]).length,1);
 assert.equal((block.match(/C\('ct1','current-transformer-edu-1p'/g)||[]).length,1);
 assert.equal((block.match(/C\('z1','energy-training-load-1p'/g)||[]).length,1);
 assert.match(block,/supply-1p/);
 assert.match(block,/arduino-bench-supply/);
 assert.match(block,/dcVoltage:0/);
 assert.doesNotMatch(block,/tutorial-wattmeter/);
 assert.doesNotMatch(block,/tutorial-cosphimeter/);
 for(const token of [
  'function isEnergyAnalyzerLesson',
  'function energyAnalyzerNoteHtml',
  'function setEnergyAnalyzerPreset',
  'data-energy-preset="resistive"',
  'data-energy-preset="inductive"',
  'data-energy-preset="capacitive"',
  'P = S × PF',
  'Q = ±√(S²−P²)',
  'SIMÜLASYON LABORATUVARI'
 ])assert.ok(m.includes(token),token);
 for(const token of ['.tutorial-energy-simonly','.tutorial-energy-purpose','.tutorial-energy-live','.tutorial-energy-presets','.tutorial-energy-equations','.tutorial-energy-check'])assert.ok(c.includes(token),token);
 for(const token of [
  "id:'energy-analyzer-1p'",
  "kind:'energy-analyzer'",
  "id:'current-transformer-edu-1p'",
  "kind:'current-transformer'",
  "id:'energy-training-load-1p'",
  "kind:'energy-training-load'"
 ])assert.ok(tc.includes(token),token);
 assert.match(cm,/d\.kind==='energy-training-load'/);
 assert.match(cm,/d\.kind==='energy-analyzer'/);
 assert.match(cm,/Analyzer\.measure/);
 assert.match(mat,/data-material="energy-analyzer-1p-vector"/);
 assert.match(mat,/data-material="current-transformer-edu-vector"/);
 assert.match(mat,/data-material="energy-training-load-vector"/);
 assert.match(idx,/energy-analyzer\.js\?rev=20261009-energy-rich1/);
 assert.match(idx,/current-model\.js\?rev=20261010-real-ics1/);
 assert.match(d,/## 20\. Wattmetre \/ güç faktörü → enerji analizörü referans kilidi/);
 assert.match(d,/Dirençli yük.*P≈230 W.*Q≈0 var.*PF≈1,00/);
 assert.match(d,/Endüktif yük.*P≈184 W.*Q≈\+138 var.*PF≈0,80/);
 assert.match(d,/Kapasitif yük.*P≈184 W.*Q≈−138 var.*PF≈0,80/);
 const S=230,pf=.8,P=S*pf,Q=S*Math.sqrt(1-pf*pf);
 assert.equal(P,184);
 assert.ok(Math.abs(Q-138)<1e-9);
 assert.ok(Math.abs(Math.sqrt(P*P+Q*Q)-S)<1e-9);
});
