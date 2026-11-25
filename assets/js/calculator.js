/* =========================================================
   HD Trade — calculator UI (wizard). Uses HDCalc from calc.js.
   Plain DOM, no framework, light enough for phones.
   ========================================================= */
(function () {
  'use strict';
  var root = document.getElementById('calc');
  if (!root || !window.HDCalc) return;
  var C = window.HDCalc;

  /* ------------------------------ icons ------------------------------ */
  var ICONS = {
    snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1L19.1 4.9M9 4l3 2 3-2M9 20l3-2 3 2M4 9l2 3-2 3M20 9l-2 3 2 3"/>',
    heat: '<path d="M8 4c-2 2.5 2 5.5 0 8s2 5.5 0 8M12 4c-2 2.5 2 5.5 0 8s2 5.5 0 8M16 4c-2 2.5 2 5.5 0 8s2 5.5 0 8"/>',
    fan: '<path d="M12 12c-3-3-3-8 0-9 3 1 2 6 0 9zM12 12c3 3 8 3 9 0-1-3-6-2-9 0zM12 12c3 3 3 8 0 9-3-1-2-6 0-9zM12 12c-3-3-8-3-9 0 1 3 6 2 9 0z"/><circle cx="12" cy="12" r="1.5"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
  };
  function ico(n, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* --------------------------- option lists --------------------------- */
  var cityOpts = Object.keys(C.CITIES).map(function (k) { return [k, C.CITIES[k].label]; });
  var O = {
    insulation: [['good', 'Добра', 'нова сграда или саниран блок'], ['medium', 'Средна', 'частично изолирана'], ['poor', 'Слаба', 'стара сграда без изолация'], ['unknown', 'Не знам']],
    floor: [['ground', 'Партер'], ['middle', 'Междинен етаж'], ['top', 'Последен етаж'], ['attic', 'Таванско / мансарда'], ['unknown', 'Не знам']],
    height: [['2.5', '2,5 m'], ['2.7', '2,7 m', 'стандартно'], ['3', '3 m'], ['3.5', '3,5 m и повече']],
    roomType: [['living', 'Хол'], ['bedroom', 'Спалня'], ['kids', 'Детска стая'], ['kitchen', 'Кухня'], ['office', 'Офис'], ['shop', 'Магазин / салон']],
    exposure: [['unknown', 'Изложение: не знам'], ['north', 'Север'], ['east', 'Изток'], ['south', 'Юг'], ['west', 'Запад']],
    glazing: [['normal', 'Нормални прозорци'], ['small', 'Малки прозорци'], ['large', 'Големи / от пода до тавана'], ['unknown', 'Прозорци: не знам']],
    tech: [['none', 'Без много техника'], ['some', 'ТВ, компютър'], ['much', 'Много техника'], ['unknown', 'Техника: не знам']],
    usage: [['cooling', 'Основно охлаждане', 'лятото'], ['both', 'Охлаждане и малко отопление', 'преходните сезони'], ['heating', 'Основно отопление', 'цялата зима']],
    hpInsulation: [['good', 'Добра', 'нова къща, 10+ cm изолация'], ['medium', 'Средна', 'някаква изолация, PVC дограма'], ['poor', 'Слаба', 'стара къща, малко изолация'], ['verypoor', 'Много слаба', 'без изолация, стара дограма']],
    emitters: [['floor', 'Подово отопление'], ['radiators', 'Радиатори'], ['mixed', 'Подово + радиатори'], ['fancoils', 'Вентилаторни конвектори']],
    fuel: [['', 'Не искам / не знам'], ['wood', 'Дърва (м³)'], ['pellets', 'Пелети (тона)'], ['electricity', 'Ток (kWh)'], ['gas', 'Природен газ (м³)'], ['diesel', 'Нафта (литри)'], ['lpg', 'Пропан-бутан (литри)']],
    ventType: [['home', 'Жилище'], ['office', 'Офис'], ['shop', 'Магазин'], ['restaurant', 'Заведение'], ['classroom', 'Учебна зала'], ['gym', 'Фитнес']],
    useType: [['office', 'Офис сграда'], ['shop', 'Търговски обект'], ['hotel', 'Хотел'], ['mixed', 'Смесено']],
    glazingB: [['normal', 'Нормално'], ['large', 'Стъклени фасади'], ['small', 'Малко прозорци'], ['unknown', 'Не знам']]
  };

  /* ------------------------------ fields ------------------------------ */
  // choice → chips, select → <select>, number → <input>
  function fChoice(id, label, opts, hint) { return { kind: 'choice', id: id, label: label, opts: opts, hint: hint }; }
  function fSelect(id, label, opts) { return { kind: 'select', id: id, label: label, opts: opts }; }
  function fNum(id, label, unit, min, max, step, ph, optional, hint) {
    return { kind: 'number', id: id, label: label, unit: unit, min: min, max: max, step: step || 1, ph: ph, optional: optional, hint: hint };
  }

  var MODULES = {
    split: {
      icon: 'snow', title: 'Климатик', desc: 'За една или няколко стаи — дом, офис, магазин',
      defaults: { insulation: 'medium', floor: 'middle', height: '2.7', city: 'gabrovo', usage: 'both', pipe: '',
                  rooms: [{ type: 'living', area: '', exposure: 'unknown', glazing: 'normal', people: '2', tech: 'none' }] },
      steps: [
        { title: 'Сградата', fields: [
          fChoice('insulation', 'Колко е изолирана сградата?', O.insulation),
          fChoice('floor', 'На кой етаж е?', O.floor),
          fChoice('height', 'Височина на тавана', O.height) ] },
        { title: 'Помещенията', rooms: true },
        { title: 'Употреба', fields: [
          fChoice('usage', 'За какво ще използвате климатика?', O.usage),
          fSelect('city', 'Населено място', cityOpts),
          fNum('pipe', 'Разстояние между вътрешното и външното тяло', 'm', 1, 50, 0.5, 'напр. 4', true,
               'За ориентировъчната цена на монтажа. Оставете празно, ако не знаете.') ] }
      ]
    },
    heatpump: {
      icon: 'heat', title: 'Термопомпа', desc: 'Отопление и гореща вода за къща или апартамент',
      defaults: { area: '', height: '2.7', insulation: 'medium', city: 'gabrovo', emitters: 'radiators', people: '3', fuel: '', fuelAmount: '' },
      steps: [
        { title: 'Домът', fields: [
          fNum('area', 'Отопляема площ', 'm²', 20, 2000, 1, 'напр. 120'),
          fChoice('height', 'Височина на тавана', O.height),
          fChoice('insulation', 'Изолация на сградата', O.hpInsulation),
          fSelect('city', 'Населено място', cityOpts) ] },
        { title: 'Отоплението', fields: [
          fChoice('emitters', 'С какво ще се отоплява?', O.emitters),
          fNum('people', 'Колко души живеят там?', 'души', 1, 30, 1, '3', false, 'За гореща вода и размер на бойлера.') ] },
        { title: 'Сегашен разход', note: 'По желание. Колко гориво използвате сега за една зима? Това помага да уточним реалните загуби на дома.', fields: [
          fSelect('fuel', 'С какво се отоплявате сега?', O.fuel),
          fNum('fuelAmount', 'Количество за една зима', '', 0.1, 1000000, 0.1, 'напр. 10', true) ] }
      ]
    },
    vent: {
      icon: 'fan', title: 'Вентилация', desc: 'Рекуператор за свеж въздух с минимални загуби',
      defaults: { objectType: 'office', area: '', height: '2.7', people: '' },
      steps: [
        { title: 'Обектът', fields: [
          fChoice('objectType', 'Какъв е обектът?', O.ventType),
          fNum('area', 'Площ', 'm²', 10, 5000, 1, 'напр. 100'),
          fChoice('height', 'Височина на тавана', O.height),
          fNum('people', 'Колко души са обикновено вътре?', 'души', 1, 2000, 1, 'напр. 10') ] }
      ]
    },
    building: {
      icon: 'building', title: 'Офис сграда (VRV)', desc: 'Цяла сграда или етаж с много помещения',
      defaults: { useType: 'office', area: '', height: '3', insulation: 'medium', glazing: 'normal', rooms: '' },
      steps: [
        { title: 'Сградата', fields: [
          fChoice('useType', 'Предназначение', O.useType),
          fNum('area', 'Обща климатизирана площ', 'm²', 50, 20000, 1, 'напр. 800'),
          fNum('rooms', 'Брой помещения за климатизиране', 'бр.', 1, 500, 1, 'напр. 25'),
          fChoice('height', 'Височина на тавана', O.height),
          fChoice('insulation', 'Изолация', O.insulation),
          fChoice('glazing', 'Остъкляване', O.glazingB) ] }
      ]
    }
  };

  /* ------------------------------- state ------------------------------- */
  var state = { module: null, step: 0, data: null, result: null };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ------------------------------ render ------------------------------ */
  function renderPicker() {
    var cards = Object.keys(MODULES).map(function (k) {
      var m = MODULES[k];
      return '<button type="button" class="calc-pick" data-module="' + k + '">' + ico(m.icon, 'calc-pick__ico') +
        '<span class="calc-pick__title">' + m.title + '</span><span class="calc-pick__desc">' + m.desc + '</span>' +
        '<span class="calc-pick__go">Започни ' + ico('arrow') + '</span></button>';
    }).join('');
    root.innerHTML = '<h2 class="calc__q" tabindex="-1">Какво искате да изчислите?</h2><div class="calc-picker">' + cards + '</div>';
  }

  function fieldHTML(f, val) {
    var id = 'c-' + f.id, hint = f.hint ? '<small class="calc-field__hint">' + f.hint + '</small>' : '';
    if (f.kind === 'choice') {
      return '<fieldset class="calc-field"><legend>' + f.label + '</legend><div class="calc-chips">' +
        f.opts.map(function (o, i) {
          return '<label><input type="radio" name="' + f.id + '" value="' + o[0] + '"' + (String(val) === o[0] ? ' checked' : '') + (i === 0 ? ' required' : '') + '>' +
            '<span>' + o[1] + (o[2] ? '<small>' + o[2] + '</small>' : '') + '</span></label>';
        }).join('') + '</div>' + hint + '</fieldset>';
    }
    if (f.kind === 'select') {
      return '<div class="calc-field"><label for="' + id + '">' + f.label + '</label><select id="' + id + '" name="' + f.id + '">' +
        f.opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(val) === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
        '</select>' + hint + '</div>';
    }
    return '<div class="calc-field"><label for="' + id + '">' + f.label + (f.optional ? ' <span class="calc-opt">(по желание)</span>' : '') + '</label>' +
      '<div class="calc-num"><input id="' + id + '" name="' + f.id + '" type="text" inputmode="decimal" autocomplete="off" value="' + esc(val || '') + '" placeholder="' + (f.ph || '') + '"' + (f.optional ? '' : ' required') + '>' +
      (f.unit ? '<span>' + f.unit + '</span>' : '') + '</div>' + hint + '</div>';
  }

  function roomHTML(r, i, count) {
    function sel(name, opts, v) {
      return '<select name="room-' + i + '-' + name + '" aria-label="' + name + '">' + opts.map(function (o) {
        return '<option value="' + o[0] + '"' + (String(v) === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>';
    }
    return '<div class="calc-room" data-room="' + i + '"><div class="calc-room__head"><strong>Стая ' + (i + 1) + '</strong>' +
      (count > 1 ? '<button type="button" class="calc-room__del" data-del="' + i + '" aria-label="Премахни стая ' + (i + 1) + '">' + ico('x') + '</button>' : '') + '</div>' +
      '<div class="calc-room__grid">' +
      '<label class="calc-room__f"><span>Вид</span>' + sel('type', O.roomType, r.type) + '</label>' +
      '<label class="calc-room__f"><span>Площ</span><span class="calc-num"><input name="room-' + i + '-area" type="text" inputmode="decimal" required placeholder="напр. 20" value="' + esc(r.area) + '"><span>m²</span></span></label>' +
      '<label class="calc-room__f"><span>Хора</span><span class="calc-num"><input name="room-' + i + '-people" type="text" inputmode="numeric" value="' + esc(r.people) + '"><span>души</span></span></label>' +
      '<label class="calc-room__f"><span>Изложение</span>' + sel('exposure', O.exposure, r.exposure) + '</label>' +
      '<label class="calc-room__f"><span>Прозорци</span>' + sel('glazing', O.glazing, r.glazing) + '</label>' +
      '<label class="calc-room__f"><span>Техника</span>' + sel('tech', O.tech, r.tech) + '</label>' +
      '</div></div>';
  }

  function renderStep() {
    var m = MODULES[state.module], step = m.steps[state.step], d = state.data;
    var total = m.steps.length;
    var progress = m.steps.map(function (s, i) {
      return '<li class="' + (i < state.step ? 'is-done' : i === state.step ? 'is-current' : '') + '"' + (i === state.step ? ' aria-current="step"' : '') + '><span>' + (i + 1) + '</span>' + s.title + '</li>';
    }).join('') + '<li><span>' + (total + 1) + '</span>Резултат</li>';

    var body;
    if (step.rooms) {
      body = '<div class="calc-rooms">' + d.rooms.map(function (r, i) { return roomHTML(r, i, d.rooms.length); }).join('') + '</div>' +
        (d.rooms.length < 12 ? '<button type="button" class="btn btn--outline btn--sm calc-add">' + ico('plus') + ' Добави стая</button>' : '');
    } else {
      body = step.fields.map(function (f) { return fieldHTML(f, d[f.id]); }).join('');
    }

    root.innerHTML =
      '<div class="calc-head"><button type="button" class="calc-link" data-restart>' + ico('back') + ' ' + m.title + '</button>' +
      '<ol class="calc-progress" aria-label="Стъпки">' + progress + '</ol></div>' +
      '<form class="calc-form" novalidate><h2 class="calc__q" tabindex="-1">' + step.title + '</h2>' +
      (step.note ? '<p class="calc-note">' + ico('info') + step.note + '</p>' : '') +
      body + '<p class="calc-error" role="alert" hidden></p>' +
      '<div class="calc-nav">' + (state.step > 0 ? '<button type="button" class="btn btn--outline" data-prev>' + ico('back') + ' Назад</button>' : '<span></span>') +
      '<button type="submit" class="btn btn--primary">' + (state.step === total - 1 ? 'Изчисли' : 'Напред') + ' ' + ico('arrow', 'arrow') + '</button></div></form>';
  }

  /* ------------------------------ reading ------------------------------ */
  function readForm(form) {
    var m = MODULES[state.module], step = m.steps[state.step], d = state.data;
    if (step.rooms) {
      d.rooms = d.rooms.map(function (r, i) {
        function v(n) { var el = form.elements['room-' + i + '-' + n]; return el ? el.value.trim() : r[n]; }
        return { type: v('type'), area: v('area'), people: v('people'), exposure: v('exposure'), glazing: v('glazing'), tech: v('tech') };
      });
    } else {
      step.fields.forEach(function (f) {
        if (f.kind === 'choice') { var c = form.querySelector('input[name="' + f.id + '"]:checked'); d[f.id] = c ? c.value : d[f.id]; }
        else d[f.id] = form.elements[f.id].value.trim();
      });
    }
  }

  function validateStep(form) {
    var bad = Array.prototype.filter.call(form.querySelectorAll('input[required]'), function (i) { return i.type !== 'radio' && !i.value.trim(); });
    if (bad.length) { bad[0].focus(); return 'Попълнете полетата, отбелязани като задължителни.'; }
    // numeric sanity via the engine on the last step happens in compute()
    var nums = form.querySelectorAll('input[inputmode="decimal"], input[inputmode="numeric"]');
    for (var i = 0; i < nums.length; i++) {
      var v = nums[i].value.trim();
      if (v && !isFinite(parseFloat(v.replace(',', '.')))) { nums[i].focus(); return 'Въведете число, например 25 или 2,5.'; }
    }
    return null;
  }

  function compute() {
    var d = state.data, h = parseFloat(d.height);
    switch (state.module) {
      case 'split':
        return C.split({ building: { insulation: d.insulation, floor: d.floor, height: h, city: d.city }, usage: d.usage,
                         pipeLength: d.pipe === '' ? null : d.pipe, rooms: d.rooms });
      case 'heatpump':
        return C.heatpump({ area: d.area, height: h, insulation: d.insulation, city: d.city, emitters: d.emitters, people: d.people,
                            fuel: d.fuel && d.fuelAmount ? { type: d.fuel, amount: d.fuelAmount } : null });
      case 'vent':
        return C.ventilation({ objectType: d.objectType, area: d.area, height: h, people: d.people });
      default:
        return C.building({ useType: d.useType, area: d.area, height: h, insulation: d.insulation, glazing: d.glazing, rooms: d.rooms });
    }
  }

  /* ------------------------------ result ------------------------------ */
  var FORM_CODE = { split: 'split', heatpump: 'hp', vent: 'vent', building: 'vrv' };

  function headline(r) {
    switch (r.module) {
      case 'split':
        if (r.rooms.length === 1 && r.rooms[0].sizeKW !== null)
          return { big: C.fmt(r.rooms[0].sizeKW) + ' kW', small: C.fmt(r.rooms[0].btu, 0) + ' BTU · ' + r.rooms[0].category };
        return { big: C.fmt(r.totalKW) + ' kW', small: 'общо натоварване за ' + r.rooms.length + ' помещения' };
      case 'heatpump': return { big: (r.unit.count > 1 ? r.unit.count + ' × ' : '') + C.fmt(r.unit.size) + ' kW', small: 'Термопомпа въздух-вода · бойлер ' + r.tankL + ' л' };
      case 'vent': return { big: (r.unit.count > 1 ? r.unit.count + ' × ' : '') + C.fmt(r.unit.size, 0) + ' m³/ч', small: 'Рекуператор · нужен въздухообмен ' + C.fmt(r.airflow, 0) + ' m³/ч' };
      default: return { big: (r.outdoor.count > 1 ? r.outdoor.count + ' × ' : '') + C.fmt(r.outdoor.size) + ' kW', small: 'VRV / VRF външно тяло · ' + r.indoorUnits + ' вътрешни тела' };
    }
  }

  function list(items) { return '<ul class="calc-list">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }

  function renderResult(r) {
    var hd = headline(r);
    var parts = [];
    if (r.module === 'split') {
      parts.push('<h3>По помещения</h3><div class="calc-table-wrap"><table class="calc-table"><thead><tr><th>Помещение</th><th>Площ</th><th>Натоварване</th><th>Препоръка</th></tr></thead><tbody>' +
        r.rooms.map(function (x) {
          return '<tr><td>' + esc(x.name) + '<small>' + esc(x.typeLabel) + '</small></td><td>' + C.fmt(x.area) + ' m²</td><td>' + C.fmt(x.loadKW, 2) + ' kW' +
            (x.heatDriven ? '<small>определено от отоплението</small>' : '') + '</td><td><strong>' +
            (x.sizeKW === null ? 'над 14 kW' : C.fmt(x.sizeKW) + ' kW') + '</strong>' + (x.btu ? '<small>' + C.fmt(x.btu, 0) + ' BTU</small>' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>');
    }
    var sys = '<div class="calc-system"><span class="calc-tag">Препоръка</span><strong>' + esc(r.system.title) + '</strong>' +
      (r.system.detail && r.system.detail.length ? list(r.system.detail) : '') + '</div>';
    var alts = (r.alternatives || []).map(function (a) {
      return '<div class="calc-system calc-system--alt"><span class="calc-tag">Алтернатива</span><strong>' + esc(a.title) + '</strong>' + list(a.detail) + '</div>';
    }).join('');

    var why = r.module === 'split'
      ? r.rooms.filter(function (x) { return x.factors.length; }).map(function (x) {
          return '<div class="calc-why__room"><strong>' + esc(x.name) + '</strong>' + list(x.factors) + '</div>'; }).join('')
      : list(r.factors);

    var install = '';
    if (r.install) {
      var range = r.install.min === r.install.max ? C.fmt(r.install.min, 0) + ' €' : C.fmt(r.install.min, 0) + ' – ' + C.fmt(r.install.max, 0) + ' €';
      install = '<div class="calc-price"><span class="calc-tag">Монтаж</span><strong>' + range + '</strong><span>без ДДС, ' +
        (r.install.units > 1 ? 'за ' + r.install.units + ' климатика, ' : '') +
        (r.install.assumed ? 'при 3–5 m тръбен път. ' : 'по ценоразписа. ') + 'Цената на климатика не е включена. Огледът е безплатен.</span>' +
        '<a class="link-arrow" href="ceni-montazh.html">Всички цени за монтаж ' + ico('arrow') + '</a></div>';
    }

    var href = 'oferta.html?s=' + FORM_CODE[r.module] + '&msg=' + encodeURIComponent(r.summary);

    root.innerHTML =
      '<div class="calc-head"><button type="button" class="calc-link" data-restart>' + ico('back') + ' Ново изчисление</button></div>' +
      '<div class="calc-result" aria-live="polite">' +
        '<div class="calc-hero"><span class="calc-tag calc-tag--light">Ориентировъчен резултат</span>' +
          '<h2 class="calc__q" tabindex="-1">' + esc(hd.big) + '</h2><p>' + esc(hd.small) + '</p>' +
          '<div class="calc-hero__cta"><a class="btn btn--primary" href="' + href + '">Поискай оферта с тези данни ' + ico('arrow', 'arrow') + '</a>' +
          '<button type="button" class="btn btn--ghost-light" data-edit>Промени отговорите</button></div></div>' +
        '<div class="calc-result__body">' + sys + alts + parts.join('') + install +
          '<details class="calc-why"' + (r.module === 'split' && r.rooms.length > 3 ? '' : ' open') + '><summary>Как изчислихме</summary>' + why + '</details>' +
          '<div class="calc-notes">' + r.notes.map(function (n) { return '<p>' + ico('info') + esc(n) + '</p>'; }).join('') + '</div>' +
        '</div></div>';
  }

  /* ------------------------------ events ------------------------------ */
  function focusQ() { var q = root.querySelector('.calc__q'); if (q) q.focus({ preventScroll: true }); var top = root.getBoundingClientRect().top + window.scrollY - 100; if (window.scrollY > top) window.scrollTo({ top: top }); }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.module) { state.module = t.dataset.module; state.step = 0; state.data = clone(MODULES[t.dataset.module].defaults); renderStep(); focusQ(); }
    else if (t.hasAttribute('data-restart')) { state.module = null; renderPicker(); focusQ(); }
    else if (t.hasAttribute('data-prev')) { readForm(root.querySelector('form')); state.step--; renderStep(); focusQ(); }
    else if (t.hasAttribute('data-edit')) { state.step = 0; renderStep(); focusQ(); }
    else if (t.classList.contains('calc-add')) {
      readForm(root.querySelector('form'));
      state.data.rooms.push({ type: 'bedroom', area: '', exposure: 'unknown', glazing: 'normal', people: '2', tech: 'none' });
      renderStep();
      var last = root.querySelectorAll('.calc-room'); last = last[last.length - 1];
      if (last) last.querySelector('input').focus();
    }
    else if (t.dataset.del !== undefined) {
      readForm(root.querySelector('form'));
      state.data.rooms.splice(+t.dataset.del, 1); renderStep();
    }
  });

  root.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target, err = form.querySelector('.calc-error');
    readForm(form);
    var msg = validateStep(form);
    if (!msg && state.step === MODULES[state.module].steps.length - 1) {
      try { state.result = compute(); renderResult(state.result); focusQ(); return; }
      catch (ex) { msg = ex instanceof RangeError ? ex.message : 'Нещо се обърка. Проверете въведените стойности.'; }
    }
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    state.step++; renderStep(); focusQ();
  });

  // Deep link: kalkulator.html#split / #heatpump / #vent / #building
  var start = (location.hash || '').replace('#', '');
  if (MODULES[start]) { state.module = start; state.step = 0; state.data = clone(MODULES[start].defaults); renderStep(); }
  else renderPicker();
})();
