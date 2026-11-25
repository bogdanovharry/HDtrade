/* =========================================================
   HD Trade — HVAC sizing calculator (calculation engine)
   ---------------------------------------------------------
   Pure functions, no DOM. Works in the browser (window.HDCalc)
   and in Node (require) so it can be unit-tested.

   All results are ORIENTATIVE rules of thumb. The final choice
   is made after the free on-site inspection.
   Every coefficient lives in CONFIG so it can be calibrated
   against real HD Trade installations without touching logic.
   ========================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HDCalc = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ------------------------------------------------------------------
     Climate: approximate winter design temperatures (°C) for Bulgaria.
     Climate factor = (20 − T) / (20 − (−12)); −12 °C → factor 1.0.
     ------------------------------------------------------------------ */
  var CITIES = {
    sofia:      { label: 'София',          t: -16 },
    plovdiv:    { label: 'Пловдив',        t: -13 },
    varna:      { label: 'Варна',          t: -11 },
    burgas:     { label: 'Бургас',         t: -11 },
    ruse:       { label: 'Русе',           t: -15 },
    stzagora:   { label: 'Стара Загора',   t: -13 },
    pleven:     { label: 'Плевен',         t: -15 },
    vtarnovo:   { label: 'Велико Търново', t: -15 },
    gabrovo:    { label: 'Габрово',        t: -16 },
    blagoevgrad:{ label: 'Благоевград',    t: -12 },
    shumen:     { label: 'Шумен',          t: -14 },
    haskovo:    { label: 'Хасково',        t: -12 },
    mountain:   { label: 'Планински район', t: -20 },
    other:      { label: 'Друго населено място', t: -14 }
  };
  var CLIMATE_REF = -12;

  var CONFIG = {
    split: {
      baseWPerM2: 100,          // cooling, at 2.7 m ceiling
      refHeight: 2.7,
      roomType: {
        bedroom: { f: 0.9,  extra: 0,   label: 'Спалня' },
        living:  { f: 1.0,  extra: 0,   label: 'Хол' },
        kitchen: { f: 1.0,  extra: 0.5, label: 'Кухня' },
        kids:    { f: 0.95, extra: 0,   label: 'Детска стая' },
        office:  { f: 1.0,  extra: 0,   label: 'Офис' },
        shop:    { f: 1.15, extra: 0,   label: 'Магазин / салон' }
      },
      insulation: { good: 0.85, medium: 1.0, poor: 1.2, unknown: 1.0 },
      floor:      { ground: 1.0, middle: 1.0, top: 1.15, attic: 1.25, unknown: 1.05 },
      exposure:   { north: 0.95, east: 1.05, south: 1.1, west: 1.15, unknown: 1.05 },
      glazing:    { small: 0.95, normal: 1.0, large: 1.2, unknown: 1.0 },
      tech:       { none: 0, some: 0.2, much: 0.5, unknown: 0.1 },   // kW
      personKW: 0.13,
      peopleIncluded: 2,
      // Heating need when the unit is the MAIN heat source
      heatWPerM2: { good: 50, medium: 75, poor: 110, unknown: 80 },
      heatFloor:  { ground: 1.1, middle: 1.0, top: 1.15, attic: 1.25, unknown: 1.05 },
      lowTempDerate: 0.75,      // a typical unit gives ~75 % of nominal heat at design temperature
      sizes: [2.5, 3.5, 5, 6, 7, 10, 12, 14],
      residentialMax: 7,        // wall-mounted split
      tolerance: 0.03,
      multi: { outdoorSizes: [4, 5.3, 6.8, 8, 10, 12], diversity: 0.9, maxRooms: 5 },
      vrv:   { outdoorSizes: [14, 16, 22.4, 28, 33.5, 40, 45, 50, 56], maxSingle: 56, diversity: 0.9 }
    },
    install: { base: 350, includedM: 3, perM: 35, unknownM: [3, 5],
               extras: { drainPan: 55, antiVibration: 30, heaterPan: 45 } },
    heatpump: {
      wPerM2: { good: 45, medium: 70, poor: 100, verypoor: 130 },
      refHeight: 2.7,
      dhwKWPerPerson: 0.25,
      emitters: {
        floor:     { f: 1.0,  flow: 35, label: 'подово отопление' },
        mixed:     { f: 1.05, flow: 45, label: 'подово + радиатори' },
        radiators: { f: 1.1,  flow: 55, label: 'радиатори' },
        fancoils:  { f: 1.0,  flow: 40, label: 'вентилаторни конвектори' }
      },
      fuel: {
        wood:        { label: 'м³ дърва',            kwh: 1000 },
        pellets:     { label: 'тона пелети',          kwh: 4200 },
        electricity: { label: 'kWh ток за отопление', kwh: 1 },
        gas:         { label: 'м³ природен газ',      kwh: 9 },
        diesel:      { label: 'литра нафта',           kwh: 9 },
        lpg:         { label: 'литра пропан-бутан',    kwh: 6.2 }
      },
      fullLoadHours: 2000,
      sizes: [6, 8, 10, 12, 14, 16, 20, 25, 30],
      maxSingle: 30,
      tolerance: 0.03,
      tankPerPerson: 50,
      tankSizes: [150, 200, 300, 400, 500]
    },
    vent: {
      perPerson: { home: 25, office: 30, shop: 25, restaurant: 35, classroom: 25, gym: 40 },
      ach:       { home: 0.5, office: 1, shop: 1, restaurant: 2, classroom: 2, gym: 2 },
      labels:    { home: 'Жилище', office: 'Офис', shop: 'Магазин', restaurant: 'Заведение',
                   classroom: 'Учебна зала', gym: 'Фитнес' },
      sizes: [250, 350, 500, 650, 800, 1000, 1500, 2000],
      maxSingle: 2000,
      tolerance: 0.03
    },
    building: {
      useType: { office: { f: 1.0, label: 'Офис сграда' }, shop: { f: 1.15, label: 'Търговски обект' },
                 hotel: { f: 0.95, label: 'Хотел' }, mixed: { f: 1.05, label: 'Смесено предназначение' } }
    }
  };

  /* ------------------------------- helpers ------------------------------- */
  function round(n, d) { var p = Math.pow(10, d || 0); return Math.round(n * p) / p; }

  function fmt(n, d) {
    var s = round(n, d === undefined ? 1 : d).toFixed(d === undefined ? 1 : d);
    s = s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace('.', ',');
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // Market BTU/h class names for the standard split sizes
  var BTU_CLASS = { 2.5: 9000, 3.5: 12000, 5: 18000, 6: 21000, 7: 24000, 10: 36000, 12: 42000, 14: 48000 };
  function btu(kw) {
    if (BTU_CLASS[kw]) return BTU_CLASS[kw];
    return Math.round(kw * 3412 / 1000) * 1000;   // 1 kW = 3 412 BTU/h
  }

  /** Smallest standard size that covers the load (with a small tolerance). */
  function pickSize(load, sizes, tolerance) {
    var tol = tolerance === undefined ? 0.03 : tolerance;
    for (var i = 0; i < sizes.length; i++) if (sizes[i] >= load * (1 - tol)) return sizes[i];
    return null;
  }

  /** Cover a load with N equal units of the largest-needed size (cascade). */
  function cascade(load, sizes, maxSingle, tolerance) {
    var n = Math.max(1, Math.ceil(load / maxSingle));
    var each = pickSize(load / n, sizes, tolerance);
    while (each === null) { n++; each = pickSize(load / n, sizes, tolerance); }
    return { count: n, size: each, total: round(n * each, 1) };
  }

  function climateFactor(cityKey) {
    var c = CITIES[cityKey] || CITIES.other;
    return (20 - c.t) / (20 - CLIMATE_REF);
  }

  function pctNote(label, f) {
    var p = Math.round((f - 1) * 100);
    if (p === 0) return null;
    return label + ': ' + (p > 0 ? '+' : '−') + Math.abs(p) + '%';
  }

  function num(v, name, min, max) {
    var n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : v;
    if (typeof n !== 'number' || !isFinite(n)) throw new RangeError('Въведете ' + name + '.');
    if (n < min || n > max) throw new RangeError(name.charAt(0).toUpperCase() + name.slice(1) + ' трябва да е между ' + fmt(min) + ' и ' + fmt(max) + '.');
    return n;
  }

  function pick(map, key, fallback) {
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : map[fallback || 'unknown'];
  }

  /* --------------------------- installation price --------------------------- */
  /** Installation of the refrigerant part for ONE wall split (price list, excl. VAT). */
  function installPrice(pipeLength) {
    var I = CONFIG.install;
    function one(len) { return I.base + Math.max(0, Math.ceil(len) - I.includedM) * I.perM; }
    if (pipeLength === null || pipeLength === undefined || pipeLength === '') {
      return { min: one(I.unknownM[0]), max: one(I.unknownM[1]), assumed: true };
    }
    var L = num(pipeLength, 'дължината на тръбния път', 1, 50);
    var p = one(L);
    return { min: p, max: p, assumed: false };
  }

  /* ================================ SPLIT ================================ */
  function splitCategory(size) {
    if (size === null) return 'Над 14 kW — две тела или VRV система';
    if (size <= CONFIG.split.residentialMax) return 'Сплит климатик (стенен)';
    return 'Професионален климатик (касетъчен, канален или подово-таванен)';
  }

  function computeRoom(room, building, usage, idx) {
    var S = CONFIG.split;
    var type = S.roomType[room.type] || S.roomType.living;
    var area = num(room.area, 'площта на помещението', 3, 300);
    var h = num(building.height === undefined ? S.refHeight : building.height, 'височината на тавана', 2, 6);
    var people = room.people === undefined || room.people === '' ? 2 : num(room.people, 'броя на хората', 0, 100);

    var fH = h / S.refHeight;
    var fIns = pick(S.insulation, building.insulation);
    var fFloor = pick(S.floor, building.floor);
    var fExp = pick(S.exposure, room.exposure);
    var fGlaz = pick(S.glazing, room.glazing);
    var techKW = pick(S.tech, room.tech);
    var peopleKW = Math.max(0, people - S.peopleIncluded) * S.personKW;

    var cooling = S.baseWPerM2 * area / 1000 * type.f * fH * fIns * fFloor * fExp * fGlaz
                + type.extra + techKW + peopleKW;

    var factors = [
      pctNote('Тип помещение (' + type.label.toLowerCase() + ')', type.f),
      pctNote('Височина на тавана ' + fmt(h, 2) + ' m', fH),
      pctNote('Изолация', fIns),
      pctNote('Етаж', fFloor),
      pctNote('Изложение', fExp),
      pctNote('Остъкляване', fGlaz)
    ].filter(Boolean);
    if (type.extra) factors.push('Кухненски уреди: +' + fmt(type.extra) + ' kW');
    if (techKW) factors.push('Техника: +' + fmt(techKW) + ' kW');
    if (peopleKW) factors.push('Хора над ' + S.peopleIncluded + ': +' + fmt(peopleKW, 2) + ' kW');

    var load = cooling, heatNeed = null, heatDriven = false;
    if (usage === 'heating') {
      var heat = area * pick(S.heatWPerM2, building.insulation) / 1000 * fH
               * pick(S.heatFloor, building.floor) * climateFactor(building.city);
      heatNeed = heat / S.lowTempDerate;
      if (heatNeed > load) { load = heatNeed; heatDriven = true; }
    }

    var size = pickSize(load, S.sizes, S.tolerance);
    return {
      name: room.name || ('Стая ' + (idx + 1)),
      typeLabel: type.label,
      area: area,
      coolingKW: round(cooling, 2),
      heatingNeedKW: heatNeed === null ? null : round(heatNeed, 2),
      heatDriven: heatDriven,
      loadKW: round(load, 2),
      sizeKW: size,
      btu: size === null ? null : btu(size),
      category: splitCategory(size),
      factors: factors
    };
  }

  /**
   * input = {
   *   building: { insulation, floor, height, city },
   *   rooms: [{ name?, type, area, exposure, glazing, people, tech }],
   *   usage: 'cooling' | 'both' | 'heating',
   *   pipeLength: number | null
   * }
   */
  function split(input) {
    var S = CONFIG.split;
    if (!input || !input.rooms || !input.rooms.length) throw new RangeError('Добавете поне едно помещение.');
    if (input.rooms.length > 12) throw new RangeError('Максимум 12 помещения — за по-големи обекти изберете „Офис сграда (VRV)“.');
    var building = input.building || {};
    var usage = input.usage || 'both';
    var rooms = input.rooms.map(function (r, i) { return computeRoom(r, building, usage, i); });
    var total = rooms.reduce(function (s, r) { return s + r.loadKW; }, 0);
    var n = rooms.length;
    var allWall = rooms.every(function (r) { return r.sizeKW !== null && r.sizeKW <= S.residentialMax; });

    var system, alternatives = [];
    var separate = {
      type: 'separate',
      title: n === 1 ? rooms[0].category + ' ' + label(rooms[0]) : n + ' отделни сплит климатика',
      detail: rooms.map(function (r) { return r.name + ': ' + label(r); })
    };

    if (n === 1) {
      system = separate;
      if (rooms[0].sizeKW === null) {
        var big = cascade(rooms[0].loadKW, S.sizes.filter(function (s) { return s > S.residentialMax; }), 14, S.tolerance);
        system = { type: 'vrv', title: big.count + ' × професионален климатик ' + fmt(big.size) + ' kW или VRV система',
                   detail: ['Натоварване около ' + fmt(rooms[0].loadKW) + ' kW — нужен е оглед.'] };
      }
    } else if (n <= S.multi.maxRooms && allWall && total * S.multi.diversity <= S.multi.outdoorSizes[S.multi.outdoorSizes.length - 1]) {
      var outdoor = pickSize(total * S.multi.diversity, S.multi.outdoorSizes, S.tolerance);
      system = separate;
      alternatives.push({
        type: 'multi',
        title: 'Мулти-сплит: 1 външно тяло ' + fmt(outdoor) + ' kW и ' + n + ' вътрешни тела',
        detail: ['Подходящо, когато има място само за едно външно тяло. Вътрешни тела: ' +
                 rooms.map(function (r) { return fmt(r.sizeKW) + ' kW'; }).join(', ') + '.']
      });
    } else {
      var V = S.vrv;
      var need = total * V.diversity;
      var out = need <= V.maxSingle ? { count: 1, size: pickSize(need, V.outdoorSizes, S.tolerance) }
                                    : cascade(need, V.outdoorSizes, V.maxSingle, S.tolerance);
      system = {
        type: 'vrv',
        title: 'VRV / VRF система — ' + (out.count > 1 ? out.count + ' × ' : '') + fmt(out.size) + ' kW външно тяло, ' + n + ' вътрешни тела',
        detail: ['Общо натоварване ' + fmt(total) + ' kW (с коефициент на едновременност ' + fmt(V.diversity * 100, 0) + '%).',
                 'Проектира се след оглед — VRV системите се подбират за всеки обект поотделно.']
      };
      if (allWall) alternatives.push(separate);
    }

    var wallUnits = rooms.filter(function (r) { return r.sizeKW !== null && r.sizeKW <= S.residentialMax; }).length;
    var install = null;
    if (system.type === 'separate' && wallUnits === n) {
      var one = installPrice(input.pipeLength);
      install = { perUnit: one, units: n, min: one.min * n, max: one.max * n, assumed: one.assumed };
    }

    var notes = [];
    if (usage === 'heating') {
      notes.push('Като основно отопление изберете модел с гарантирана работа при ниски температури (до −15 °C или −25 °C) и с висок клас SCOP.');
      if (rooms.some(function (r) { return r.heatDriven; })) notes.push('Мощността е определена от нуждата за отопление, а не от охлаждането.');
    }
    if (rooms.some(function (r) { return r.typeLabel === 'Спалня'; })) notes.push('За спалня търсете вътрешно тяло с шум под 22 dB(A) на най-ниска степен.');
    notes.push('Резултатът е ориентировъчен. Точната мощност се определя след безплатен оглед.');

    return {
      module: 'split', rooms: rooms, totalKW: round(total, 2),
      system: system, alternatives: alternatives, install: install, notes: notes,
      summary: summarySplit(rooms, system, usage, building)
    };
  }

  function label(r) { return r.sizeKW === null ? 'над 14 kW' : fmt(r.sizeKW) + ' kW (' + fmt(r.btu, 0) + ' BTU)'; }

  function summarySplit(rooms, system, usage, b) {
    var u = { cooling: 'основно охлаждане', both: 'охлаждане и допълнително отопление', heating: 'основно отопление' }[usage] || '';
    var city = (CITIES[b.city] || CITIES.other).label;
    return ['Калкулатор — климатизация (' + u + ', ' + city + ')']
      .concat(rooms.map(function (r) { return '• ' + r.name + ' (' + r.typeLabel.toLowerCase() + ', ' + fmt(r.area) + ' m²): ' + label(r); }))
      .concat(['Препоръка: ' + system.title]).join('\n');
  }

  /* ============================== HEAT PUMP ============================== */
  /**
   * input = { area, height, insulation, city, emitters, people,
   *           fuel?: { type, amount } }
   */
  function heatpump(input) {
    var H = CONFIG.heatpump;
    var area = num(input.area, 'отопляемата площ', 20, 2000);
    var h = num(input.height === undefined ? H.refHeight : input.height, 'височината на тавана', 2, 6);
    var people = input.people === undefined || input.people === '' ? 3 : num(input.people, 'броя на хората', 1, 30);
    var w = pick(H.wPerM2, input.insulation, 'medium');
    var em = H.emitters[input.emitters] || H.emitters.radiators;
    var fH = h / H.refHeight;
    var fC = climateFactor(input.city);

    var building = area * w / 1000 * fH * fC;
    var dhw = people * H.dhwKWPerPerson;
    var calc = (building + dhw) * em.f;
    var factors = [
      'Топлинни загуби на сградата: ' + w + ' W/m² × ' + fmt(area) + ' m²',
      pctNote('Височина на тавана ' + fmt(h, 2) + ' m', fH),
      pctNote('Климат — ' + (CITIES[input.city] || CITIES.other).label + ' (' + (CITIES[input.city] || CITIES.other).t + ' °C)', fC),
      'Гореща вода за ' + people + ' души: +' + fmt(dhw, 2) + ' kW',
      pctNote('Отоплителни тела (' + em.label + ', ' + em.flow + ' °C)', em.f)
    ].filter(Boolean);

    var load = calc, fuelKW = null;
    if (input.fuel && input.fuel.type && input.fuel.amount) {
      var fu = H.fuel[input.fuel.type];
      if (!fu) throw new RangeError('Непознат вид гориво.');
      var amount = num(input.fuel.amount, 'количеството гориво', 0.1, 1e6);
      fuelKW = amount * fu.kwh / H.fullLoadHours * em.f + dhw;
      // average of both methods, kept within −20 % / +25 % of the building calculation
      load = Math.min(Math.max((calc + fuelKW) / 2, calc * 0.8), calc * 1.25);
      factors.push('Според сегашния разход (' + fmt(amount) + ' ' + fu.label + '): около ' + fmt(fuelKW) + ' kW');
    }

    var unit = load <= H.maxSingle ? { count: 1, size: pickSize(load, H.sizes, H.tolerance) }
                                   : cascade(load, H.sizes, H.maxSingle, H.tolerance);
    var tank = pickSize(Math.max(people * H.tankPerPerson, H.tankSizes[0]), H.tankSizes, 0) || H.tankSizes[H.tankSizes.length - 1];

    var notes = [];
    if (em.flow >= 55) notes.push('С радиатори е нужна висока температура на водата (около 55 °C) — изберете високотемпературен модел. Ефективността е по-висока с подово отопление.');
    if (em.flow <= 35) notes.push('Подовото отопление работи с ниска температура (около 35 °C) — така термопомпата е най-ефективна.');
    if (fuelKW !== null && Math.abs(fuelKW - calc) / calc > 0.3) notes.push('Изчислението и сегашният ви разход се различават значително — огледът ще уточни реалните загуби.');
    notes.push('Резултатът е ориентировъчен. Точната мощност се определя след безплатен оглед.');

    var title = (unit.count > 1 ? unit.count + ' × ' : '') + 'Термопомпа въздух-вода ' + fmt(unit.size) + ' kW';
    return {
      module: 'heatpump',
      buildingKW: round(building, 2), dhwKW: round(dhw, 2), calcKW: round(calc, 2),
      fuelKW: fuelKW === null ? null : round(fuelKW, 2), loadKW: round(load, 2),
      unit: unit, tankL: tank, flowTemp: em.flow,
      system: { type: unit.count > 1 ? 'cascade' : 'single', title: title,
                detail: ['Бойлер за гореща вода: ' + tank + ' л', 'Температура на водата: около ' + em.flow + ' °C'] },
      factors: factors, notes: notes,
      summary: ['Калкулатор — термопомпа въздух-вода',
                '• Площ ' + fmt(area) + ' m², ' + (CITIES[input.city] || CITIES.other).label + ', ' + em.label + ', ' + people + ' души',
                'Препоръка: ' + title + ', бойлер ' + tank + ' л'].join('\n')
    };
  }

  /* ============================= VENTILATION ============================= */
  /** input = { objectType, area, height, people } */
  function ventilation(input) {
    var V = CONFIG.vent;
    var type = V.perPerson[input.objectType] ? input.objectType : 'office';
    var area = num(input.area, 'площта', 10, 5000);
    var h = num(input.height === undefined ? 2.7 : input.height, 'височината на тавана', 2, 8);
    var people = num(input.people, 'броя на хората', 1, 2000);
    var volume = area * h;
    var byPeople = people * V.perPerson[type];
    var byVolume = volume * V.ach[type];
    var q = Math.max(byPeople, byVolume);
    var unit = q <= V.maxSingle ? { count: 1, size: pickSize(q, V.sizes, V.tolerance) }
                                : cascade(q, V.sizes, V.maxSingle, V.tolerance);
    var title = (unit.count > 1 ? unit.count + ' × ' : '') + 'Рекуператор ' + fmt(unit.size, 0) + ' m³/ч';
    return {
      module: 'vent', volume: round(volume, 1), byPeople: round(byPeople), byVolume: round(byVolume), airflow: round(q),
      unit: unit,
      system: { type: unit.count > 1 ? 'cascade' : 'single', title: title,
                detail: ['Нужен въздухообмен: около ' + fmt(q, 0) + ' m³/ч', 'КПД на рекуперация до 85%, филтри и CO₂ сензор'] },
      factors: [
        'Обем на помещението: ' + fmt(volume, 0) + ' m³',
        'По брой хора: ' + people + ' × ' + V.perPerson[type] + ' m³/ч = ' + fmt(byPeople, 0) + ' m³/ч',
        'По обем: ' + fmt(V.ach[type]) + ' обмена на час = ' + fmt(byVolume, 0) + ' m³/ч',
        'Взима се по-голямата стойност'
      ],
      notes: unit.count > 1
        ? ['Над 2000 m³/ч се използват няколко блока или централна вентилационна система — нужен е проект.', 'Резултатът е ориентировъчен.']
        : ['Резултатът е ориентировъчен. Окончателният избор е след оглед.'],
      summary: ['Калкулатор — вентилация',
                '• ' + V.labels[type] + ', ' + fmt(area) + ' m², ' + people + ' души',
                'Препоръка: ' + title].join('\n')
    };
  }

  /* ============================ BUILDING (VRV) ============================ */
  /** input = { useType, area, height, insulation, glazing, rooms } */
  function building(input) {
    var S = CONFIG.split, B = CONFIG.building, V = S.vrv;
    var use = B.useType[input.useType] || B.useType.office;
    var area = num(input.area, 'общата площ', 50, 20000);
    var h = num(input.height === undefined ? 2.9 : input.height, 'височината на тавана', 2.4, 6);
    var rooms = num(input.rooms, 'броя на помещенията', 1, 500);
    var fH = h / S.refHeight, fIns = pick(S.insulation, input.insulation), fG = pick(S.glazing, input.glazing);
    var load = S.baseWPerM2 * area / 1000 * use.f * fH * fIns * fG;
    var need = load * V.diversity;
    var out = need <= V.maxSingle ? { count: 1, size: pickSize(need, V.outdoorSizes, S.tolerance) }
                                  : cascade(need, V.outdoorSizes, V.maxSingle, S.tolerance);
    var title = 'VRV / VRF система — ' + (out.count > 1 ? out.count + ' × ' : '') + fmt(out.size) + ' kW външно тяло';
    return {
      module: 'building', loadKW: round(load, 1), outdoor: out, indoorUnits: Math.round(rooms),
      system: { type: 'vrv', title: title,
                detail: ['Около ' + Math.round(rooms) + ' вътрешни тела (канални, касетъчни или стенни)',
                         'Общо натоварване ' + fmt(load) + ' kW, с едновременност ' + fmt(V.diversity * 100, 0) + '%'] },
      factors: [
        'Основа: ' + S.baseWPerM2 + ' W/m² × ' + fmt(area) + ' m²',
        pctNote('Предназначение (' + use.label.toLowerCase() + ')', use.f),
        pctNote('Височина на тавана ' + fmt(h, 2) + ' m', fH),
        pctNote('Изолация', fIns),
        pctNote('Остъкляване', fG)
      ].filter(Boolean),
      notes: ['VRV системите се проектират за всеки обект поотделно — това е груба първоначална оценка.', 'Свържете се с нас за безплатен оглед и проект.'],
      summary: ['Калкулатор — сграда (VRV/VRF)',
                '• ' + use.label + ', ' + fmt(area) + ' m², ' + Math.round(rooms) + ' помещения',
                'Ориентировъчно: ' + title].join('\n')
    };
  }

  return {
    CONFIG: CONFIG, CITIES: CITIES,
    split: split, heatpump: heatpump, ventilation: ventilation, building: building,
    installPrice: installPrice, pickSize: pickSize, cascade: cascade, climateFactor: climateFactor,
    btu: btu, fmt: fmt
  };
}));
