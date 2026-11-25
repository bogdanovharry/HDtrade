// Unit tests for the HVAC sizing engine.  Run:  npm test   (or: node --test tests/)
// Expected values are worked out by hand from the coefficients in CONFIG;
// the arithmetic is written next to each case so a reviewer can follow it.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../assets/js/calc.js');

const B = (over = {}) => ({ insulation: 'medium', floor: 'middle', height: 2.7, city: 'sofia', ...over });

/* ------------------------------- helpers ------------------------------- */
test('pickSize rounds up to the next standard size, with 3 % tolerance', () => {
  const s = C.CONFIG.split.sizes;
  assert.equal(C.pickSize(3.6, s, 0.03), 3.5);   // 3.6 × 0.97 = 3.49 ≤ 3.5
  assert.equal(C.pickSize(3.7, s, 0.03), 5);     // 3.7 × 0.97 = 3.59 > 3.5
  assert.equal(C.pickSize(1, s, 0.03), 2.5);
  assert.equal(C.pickSize(20, s, 0.03), null);   // above the largest size
});

test('every size list is strictly ascending', () => {
  const lists = [C.CONFIG.split.sizes, C.CONFIG.split.multi.outdoorSizes, C.CONFIG.split.vrv.outdoorSizes,
                 C.CONFIG.heatpump.sizes, C.CONFIG.heatpump.tankSizes, C.CONFIG.vent.sizes];
  for (const l of lists) for (let i = 1; i < l.length; i++) assert.ok(l[i] > l[i - 1], l.join(','));
});

test('BTU class names match the market labels', () => {
  assert.equal(C.btu(2.5), 9000);
  assert.equal(C.btu(3.5), 12000);
  assert.equal(C.btu(5), 18000);
  assert.equal(C.btu(7), 24000);
});

test('climate factor: −12 °C is the reference, unknown city falls back to −14 °C', () => {
  assert.equal(C.climateFactor('blagoevgrad'), 1);                 // (20+12)/32
  assert.equal(C.climateFactor('sofia'), 36 / 32);
  assert.equal(C.climateFactor('nowhere'), 34 / 32);
});

test('Bulgarian number formatting', () => {
  assert.equal(C.fmt(3.5), '3,5');
  assert.equal(C.fmt(12), '12');
  assert.equal(C.fmt(1500, 0), '1 500');
});

/* ------------------------------ installation ------------------------------ */
test('installation price follows the price list (350 € incl. 3 m, 35 €/m after)', () => {
  assert.deepEqual(C.installPrice(3), { min: 350, max: 350, assumed: false });
  assert.deepEqual(C.installPrice(2), { min: 350, max: 350, assumed: false });
  assert.deepEqual(C.installPrice(5), { min: 420, max: 420, assumed: false });   // 350 + 2 × 35
  assert.deepEqual(C.installPrice(4.2), { min: 420, max: 420, assumed: false }); // partial metre rounds up
  assert.deepEqual(C.installPrice(null), { min: 350, max: 420, assumed: true }); // unknown → 3–5 m
});

/* --------------------------------- split --------------------------------- */
test('living room 25 m², top floor, south, large windows, 3 people → 5 kW / 18 000 BTU', () => {
  // 2.5 kW × 1.15 (top) × 1.1 (south) × 1.2 (glazing) = 3.795 + 0.13 (3rd person) = 3.925 → 5
  const r = C.split({ building: B({ floor: 'top' }), usage: 'cooling',
    rooms: [{ type: 'living', area: 25, exposure: 'south', glazing: 'large', people: 3, tech: 'none' }] });
  assert.equal(r.rooms[0].loadKW, 3.93);
  assert.equal(r.rooms[0].sizeKW, 5);
  assert.equal(r.rooms[0].btu, 18000);
  assert.equal(r.system.type, 'separate');
  assert.match(r.system.title, /5 kW \(18 000 BTU\)/);
});

test('bedroom 12 m², north → 2.5 kW / 9 000 BTU', () => {
  // 1.2 kW × 0.9 (bedroom) × 0.95 (north) = 1.026
  const r = C.split({ building: B(), usage: 'cooling',
    rooms: [{ type: 'bedroom', area: 12, exposure: 'north', glazing: 'normal', people: 2, tech: 'none' }] });
  assert.equal(r.rooms[0].loadKW, 1.03);
  assert.equal(r.rooms[0].sizeKW, 2.5);
  assert.ok(r.notes.some(n => /22 dB/.test(n)), 'bedroom noise tip');
});

test('as MAIN heating in an old, uninsulated top-floor flat in Gabrovo the unit gets bigger', () => {
  // cooling: 2.0 × 1.2 × 1.15 × 0.95 = 2.622 → 3.5 kW
  // heating: 20 × 110 W = 2.2 × 1.15 × 1.125 (−16 °C) = 2.846 ÷ 0.75 = 3.795 → 5 kW
  const room = { type: 'living', area: 20, exposure: 'north', glazing: 'normal', people: 2, tech: 'none' };
  const b = B({ insulation: 'poor', floor: 'top', city: 'gabrovo' });
  const cool = C.split({ building: b, usage: 'cooling', rooms: [room] });
  const heat = C.split({ building: b, usage: 'heating', rooms: [room] });
  assert.equal(cool.rooms[0].sizeKW, 3.5);
  assert.equal(heat.rooms[0].sizeKW, 5);
  assert.equal(heat.rooms[0].heatDriven, true);
  assert.ok(heat.notes.some(n => /−15 °C/.test(n)), 'low-temperature model advice');
});

test('3 rooms → separate splits, with a multi-split alternative sized for simultaneity', () => {
  // loads 1.026 + 1.197 + 2.375 = 4.598 × 0.9 = 4.14 → 5.3 kW outdoor
  const r = C.split({ building: B(), usage: 'both', pipeLength: null, rooms: [
    { type: 'bedroom', area: 12, exposure: 'north', glazing: 'normal', people: 2, tech: 'none' },
    { type: 'bedroom', area: 14, exposure: 'north', glazing: 'normal', people: 2, tech: 'none' },
    { type: 'living',  area: 25, exposure: 'north', glazing: 'normal', people: 2, tech: 'none' }] });
  assert.equal(r.system.type, 'separate');
  assert.deepEqual(r.rooms.map(x => x.sizeKW), [2.5, 2.5, 2.5]);
  assert.equal(r.alternatives[0].type, 'multi');
  assert.match(r.alternatives[0].title, /5,3 kW/);
  assert.deepEqual([r.install.min, r.install.max], [1050, 1260]);   // 3 × (350…420)
});

test('7 rooms → VRV system', () => {
  // 7 × 2.375 = 16.625 × 0.9 = 14.96 → 16 kW outdoor
  const room = { type: 'living', area: 25, exposure: 'north', glazing: 'normal', people: 2, tech: 'none' };
  const r = C.split({ building: B(), usage: 'cooling', rooms: Array(7).fill(room) });
  assert.equal(r.system.type, 'vrv');
  assert.match(r.system.title, /16 kW/);
  assert.equal(r.install, null, 'no list price for VRV installation');
});

test('one very large room (120 m² shop) → two professional units or VRV', () => {
  // 12 × 1.15 × 1.05 × 1.05 = 15.2 kW > 14 → 2 × 10 kW
  const r = C.split({ building: B({ floor: 'unknown' }), usage: 'cooling',
    rooms: [{ type: 'shop', area: 120, exposure: 'unknown', glazing: 'normal', people: 2, tech: 'none' }] });
  assert.equal(r.rooms[0].sizeKW, null);
  assert.equal(r.system.type, 'vrv');
  assert.match(r.system.title, /^2 × .*10 kW/);
});

test('a 70 m² open space needs a professional (cassette/duct) unit', () => {
  // 7.0 × 1.05 (unknown exposure) = 7.35 → 10 kW
  const r = C.split({ building: B(), usage: 'cooling',
    rooms: [{ type: 'office', area: 70, exposure: 'unknown', glazing: 'normal', people: 2, tech: 'none' }] });
  assert.equal(r.rooms[0].sizeKW, 10);
  assert.match(r.rooms[0].category, /касетъчен/);
});

test('"I don\'t know" answers fall back to safe defaults', () => {
  const r = C.split({ building: { insulation: 'unknown', floor: 'unknown', city: 'other' }, usage: 'both',
    rooms: [{ type: 'living', area: 20, exposure: 'unknown', glazing: 'unknown', tech: 'unknown' }] });
  // 2.0 × 1.05 (floor) × 1.05 (exposure) = 2.205 + 0.1 (tech) = 2.305 → 2.5
  assert.equal(r.rooms[0].sizeKW, 2.5);
});

test('decimal comma input is accepted', () => {
  const r = C.split({ building: B(), usage: 'cooling', rooms: [{ type: 'living', area: '25,5', exposure: 'north', glazing: 'normal' }] });
  assert.equal(r.rooms[0].area, 25.5);
});

test('invalid input is rejected with a readable message', () => {
  assert.throws(() => C.split({ building: B(), rooms: [] }), /поне едно помещение/);
  assert.throws(() => C.split({ building: B(), rooms: [{ type: 'living', area: 0 }] }), /площта/i);
  assert.throws(() => C.split({ building: B({ height: 9 }), rooms: [{ type: 'living', area: 20 }] }), /височината/i);
  assert.throws(() => C.installPrice(-2), /тръбния път/);
});

/* ------------------------------- heat pump ------------------------------- */
test('house 120 m², average insulation, Sofia, radiators, 4 people → 12 kW + 200 L tank', () => {
  // 120 × 70 W = 8.4 × 1.125 = 9.45 + 1.0 (hot water) = 10.45 × 1.1 (radiators) = 11.5 → 12
  const r = C.heatpump({ area: 120, insulation: 'medium', city: 'sofia', emitters: 'radiators', people: 4 });
  assert.equal(r.calcKW, 11.5);
  assert.equal(r.unit.size, 12);
  assert.equal(r.tankL, 200);
  assert.equal(r.flowTemp, 55);
  assert.ok(r.notes.some(n => /високотемпературен/.test(n)));
});

test('well-insulated house with underfloor heating → smaller unit', () => {
  // 120 × 45 W = 5.4 × 1.125 = 6.075 + 1.0 = 7.075 → 8
  const r = C.heatpump({ area: 120, insulation: 'good', city: 'sofia', emitters: 'floor', people: 4 });
  assert.equal(r.unit.size, 8);
  assert.equal(r.flowTemp, 35);
});

test('current fuel use pulls the estimate toward reality (bounded at −20 %)', () => {
  // calc 11.495; wood 10 m³ → 10 000 kWh ÷ 2000 h = 5 × 1.1 + 1 = 6.5
  // average 9.0, but not below 0.8 × 11.495 = 9.196 → 10 kW
  const r = C.heatpump({ area: 120, insulation: 'medium', city: 'sofia', emitters: 'radiators', people: 4,
                         fuel: { type: 'wood', amount: 10 } });
  assert.equal(r.fuelKW, 6.5);
  assert.equal(r.loadKW, 9.2);
  assert.equal(r.unit.size, 10);
  assert.ok(r.notes.some(n => /различават/.test(n)), 'warns when methods disagree');
});

test('large building → cascade of heat pumps', () => {
  // 600 × 100 W = 60 × 1.125 = 67.5 + 1.5 = 69 × 1.1 = 75.9 → 3 × 25 kW
  const r = C.heatpump({ area: 600, insulation: 'poor', city: 'sofia', emitters: 'radiators', people: 6 });
  assert.deepEqual([r.unit.count, r.unit.size], [3, 25]);
  assert.equal(r.system.type, 'cascade');
  assert.equal(r.tankL, 300);
});

/* ------------------------------ ventilation ------------------------------ */
test('office 100 m², 10 people → 350 m³/h recuperator', () => {
  // people 10 × 30 = 300; volume 270 × 1 = 270 → 300 → 350
  const r = C.ventilation({ objectType: 'office', area: 100, height: 2.7, people: 10 });
  assert.equal(r.airflow, 300);
  assert.equal(r.unit.size, 350);
});

test('home: the volume rule wins when few people', () => {
  // people 2 × 25 = 50; volume 80 × 2.7 = 216 × 0.5 = 108 → 108 → 250
  const r = C.ventilation({ objectType: 'home', area: 80, height: 2.7, people: 2 });
  assert.equal(r.airflow, 108);
  assert.equal(r.unit.size, 250);
});

test('restaurant over 2000 m³/h → several units', () => {
  // 60 × 35 = 2100 > 600 × 2 = 1200 → 2 × 1050 → 2 × 1500
  const r = C.ventilation({ objectType: 'restaurant', area: 200, height: 3, people: 60 });
  assert.deepEqual([r.unit.count, r.unit.size], [2, 1500]);
});

/* ------------------------------ building/VRV ------------------------------ */
test('office building 1000 m² → 2 × 50 kW VRV outdoor units', () => {
  // 100 kW × 1.074 (2.9 m) = 107.4 × 0.9 = 96.7 → 2 × 48.3 → 2 × 50
  const r = C.building({ useType: 'office', area: 1000, height: 2.9, insulation: 'medium', glazing: 'normal', rooms: 40 });
  assert.deepEqual([r.outdoor.count, r.outdoor.size], [2, 50]);
  assert.equal(r.indoorUnits, 40);
});

test('small office building fits one VRV outdoor unit in the 14–60 kW range', () => {
  // 25 kW × 1.074 = 26.85 × 0.9 = 24.2 → 28
  const r = C.building({ useType: 'office', area: 250, height: 2.9, insulation: 'medium', glazing: 'normal', rooms: 10 });
  assert.deepEqual([r.outdoor.count, r.outdoor.size], [1, 28]);
});

/* -------------------------------- summary -------------------------------- */
test('every result carries a plain-text summary for the quote form', () => {
  const s = C.split({ building: B(), usage: 'both', rooms: [{ type: 'living', area: 20 }] }).summary;
  assert.match(s, /Калкулатор/);
  assert.match(s, /20 m²/);
  assert.match(C.heatpump({ area: 100, city: 'varna', emitters: 'floor', people: 2 }).summary, /Термопомпа/);
  assert.match(C.ventilation({ objectType: 'home', area: 60, people: 3 }).summary, /Рекуператор/);
});
