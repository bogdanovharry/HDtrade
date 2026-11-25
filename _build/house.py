"""Interactive cutaway house — "Коя система къде?".
Blueprint-style SVG (viewBox 1000×600) with six systems; numbered hotspots are
HTML buttons laid over the drawing (percent positions), the info panel is plain
HTML. Behaviour lives in assets/js/house.js, styles in style.css (.house-*)."""

W, H = 1000, 600

# id, hotspot x/y (viewBox units), title, text, spec chips, link, link label, calculator hash
SYSTEMS = [
    ("hp", 856, 428, "Термопомпа въздух-вода",
     "Взима топлина от външния въздух — дори при минусови температури — и я подава към дома. "
     "Една система за отопление, охлаждане и гореща вода.",
     ["Отопление", "Охлаждане", "Гореща вода"], "termopompi.html", "Термопомпи", "heatpump"),
    ("tank", 622, 392, "Хидромодул и бойлер",
     "Разпределя топлината между отоплението и бойлера за гореща вода. "
     "Размерът на бойлера зависи от броя на хората — около 50 л на човек.",
     ["150–500 л", "Гореща вода целогодишно"], "termopompi.html", "Термопомпи", "heatpump"),
    ("floor", 236, 498, "Подово отопление",
     "Работи с вода около 35 °C — така термопомпата е най-ефективна. "
     "Топлината идва равномерно от пода, без течения и прах.",
     ["~35 °C вода", "Най-висока ефективност"], "termopompi.html", "Термопомпи", "heatpump"),
    ("split", 256, 226, "Сплит климатик",
     "Бързо охлаждане и отопление на отделна стая. Професионални машини „въздух-въздух“, "
     "икономични и енергийно ефективни.",
     ["2,5–7 kW", "Охлаждане и отопление"], "klimatici.html", "Климатици", "split"),
    ("vent", 455, 142, "Рекуператор",
     "Подава свеж въздух и изхвърля застоялия, като връща до 85% от топлината. "
     "С филтри и сензор за CO₂ — свеж въздух без отворени прозорци.",
     ["250–2000 m³/ч", "КПД 85%", "CO₂ сензор"], "ventilacia.html", "Вентилация", "vent"),
    ("smart", 524, 414, "Интелигентно управление",
     "Един термостат управлява системите по график и от телефона — точната температура "
     "във всяка стая, без излишен разход.",
     ["График", "Управление от телефона"], "oferta.html", "Поискай оферта", ""),
]

def _svg():
    s = []
    a = s.append
    a(f'<svg class="house-svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="house-svg-t" focusable="false">')
    a('<title id="house-svg-t">Къща в разрез с термопомпа, бойлер, подово отопление, климатик, рекуператор и термостат</title>')
    # ---------------- structure (blueprint lines) ----------------
    a('<g class="hs-struct">')
    a('<rect class="hs-soil" x="0" y="520" width="1000" height="80"/>')
    a('<path d="M0 520H1000"/>')
    for x in range(10, 1000, 26):
        a(f'<path class="hs-hatch" d="M{x} 528l-14 14"/>')
    a('<path d="M130 214L460 58L790 214Z"/><path class="hs-thin" d="M160 210L460 70L760 210"/>')        # roof
    a('<rect x="160" y="210" width="600" height="310"/><rect class="hs-thin" x="172" y="222" width="576" height="286"/>')
    a('<rect class="hs-slab" x="160" y="365" width="600" height="12"/>')                                 # floor slab
    a('<rect class="hs-slab" x="160" y="508" width="600" height="12"/>')                                 # ground slab
    a('<path d="M466 222V365M474 222V365"/>')                                                            # upper wall
    a('<path d="M540 377V438M548 377V438"/>')                                                            # ground wall w/ door
    # windows
    for x, y, w, h in ((205, 400, 80, 62), (335, 266, 80, 56), (590, 266, 90, 56)):
        a(f'<rect class="hs-win" x="{x}" y="{y}" width="{w}" height="{h}"/><path class="hs-thin" d="M{x + w/2} {y}V{y + h}M{x} {y + h/2}H{x + w}"/>')
    # furniture (scale cues)
    a('<path class="hs-thin" d="M300 508v-28h130v28M310 480v-14h110v14"/>')        # sofa
    a('<path class="hs-thin" d="M195 365v-22h170v22M195 343v-14h34v14"/>')        # bed
    a('<path class="hs-thin" d="M520 365v-34h120v34M530 331v-10"/>')             # desk
    a('</g>')

    # ---------------- 1 heat pump (outdoor) ----------------
    a('<g class="hs-sys" data-sys="hp">')
    a('<rect class="hs-unit" x="800" y="442" width="112" height="76" rx="5"/>')
    a('<circle class="hs-ring" cx="840" cy="480" r="27"/>')
    a('<g class="hs-fan" style="transform-origin:840px 480px">'
      '<path d="M840 480c-6-10-4-20 0-24 4 4 6 14 0 24zM840 480c10-6 20-4 24 0-4 4-14 6-24 0z'
      'M840 480c6 10 4 20 0 24-4-4-6-14 0-24zM840 480c-10 6-20 4-24 0 4-4 14-6 24 0z"/></g>')
    a('<path class="hs-thin" d="M878 456h24M878 466h24M878 476h24M878 486h24M878 496h24"/>')
    a('<path class="hs-thin" d="M812 518v6M900 518v6"/>')
    a('<path class="hs-pipe hs-pipe--hot hs-flow" d="M800 488H720"/>')
    a('<path class="hs-pipe hs-pipe--cold hs-flow hs-flow--rev" d="M800 500H720"/>')
    a('</g>')

    # ---------------- 2 hydro module + tank ----------------
    a('<g class="hs-sys" data-sys="tank">')
    a('<rect class="hs-unit" x="680" y="430" width="40" height="78" rx="4"/>')
    a('<path class="hs-thin" d="M688 444h24M688 452h24"/><circle class="hs-led" cx="700" cy="468" r="3"/>')
    a('<rect class="hs-unit" x="592" y="398" width="58" height="110" rx="26"/>')
    a('<path class="hs-coil" d="M604 488c14-8 22 8 34 0s-22-8-34-16 22-8 34-16-22-8-34-16 22-8 34-16"/>')
    a('<path class="hs-pipe hs-pipe--hot hs-flow" d="M680 446H650"/>')
    a('</g>')

    # ---------------- 3 underfloor heating ----------------
    a('<g class="hs-sys" data-sys="floor">')
    a('<path class="hs-pipe hs-pipe--hot hs-flow" d="M690 508V512H176V516H536"/>')
    for x in (210, 270, 330, 390, 450):
        a(f'<path class="hs-rise" d="M{x} 500c-6-8 6-14 0-22s6-14 0-22"/>')
    a('</g>')

    # ---------------- 4 split air conditioner ----------------
    a('<g class="hs-sys" data-sys="split">')
    a('<rect class="hs-unit" x="196" y="232" width="122" height="26" rx="7"/><path class="hs-thin" d="M206 252h102"/>')
    a('<rect class="hs-unit" x="92" y="278" width="60" height="46" rx="4"/><circle class="hs-ring" cx="114" cy="301" r="14"/>')
    a('<g class="hs-fan" style="transform-origin:114px 301px"><path d="M114 301c-3-5-2-10 0-12 2 2 3 7 0 12zM114 301c5-3 10-2 12 0-2 2-7 3-12 0zM114 301c3 5 2 10 0 12-2-2-3-7 0-12zM114 301c-5 3-10 2-12 0 2-2 7-3 12 0z"/></g>')
    a('<path class="hs-thin" d="M92 324l-8 10M152 324l8 10"/>')
    a('<path class="hs-pipe hs-pipe--cold" d="M152 292H166V246H196"/>')
    for i, (dx, dy) in enumerate(((0, 0), (22, 8), (44, 16))):
        a(f'<path class="hs-air" style="animation-delay:-{i * 0.6:.1f}s" d="M{226 + dx} {262 + dy}c20 22 50 34 {90 - dx} 40"/>')
    a('</g>')

    # ---------------- 5 recuperator + ducts ----------------
    a('<g class="hs-sys" data-sys="vent">')
    a('<rect class="hs-unit" x="402" y="150" width="112" height="40" rx="5"/>'
      '<path class="hs-thin" d="M418 160v20M430 160v20M442 160v20M486 170h18"/>')
    a('<path class="hs-duct hs-duct--fresh hs-flow" d="M612 136V164H514"/>')       # fresh air in (from roof)
    a('<path class="hs-duct hs-duct--stale hs-flow" d="M402 172H326V128"/>')       # stale air out
    a('<path class="hs-duct hs-duct--fresh hs-flow" d="M430 190V222"/><path class="hs-thin" d="M420 222h20"/>')   # → bedroom
    a('<path class="hs-duct hs-duct--fresh hs-flow" d="M496 190V222"/><path class="hs-thin" d="M486 222h20"/>')   # → office
    a('</g>')

    # ---------------- 6 smart thermostat ----------------
    a('<g class="hs-sys" data-sys="smart">')
    a('<rect class="hs-unit" x="514" y="424" width="20" height="28" rx="3"/><circle class="hs-led" cx="524" cy="436" r="3"/>')
    a('<path class="hs-wifi" d="M512 416c8-8 16-8 24 0M516 410c5-5 11-5 16 0"/>')
    a('<path class="hs-link" d="M534 438H680"/><path class="hs-link" d="M524 424V258H318"/><path class="hs-link" d="M524 424V190"/>')
    a('</g>')
    a('</svg>')
    return "".join(s)


def house_section(ico, arrow):
    """Return the section markup. `ico` and `arrow` come from build.py."""
    spots = "".join(
        f'<button type="button" class="house-spot" data-sys="{k}" style="left:{x / W * 100:.2f}%;top:{y / H * 100:.2f}%" '
        f'aria-label="{n}. {t}"><span>{n}</span></button>'
        for n, (k, x, y, t, *_rest) in enumerate(SYSTEMS, 1))
    tabs = "".join(
        f'<li><button type="button" class="house-tab" data-sys="{k}"><span>{n}</span>{t}</button></li>'
        for n, (k, _x, _y, t, *_rest) in enumerate(SYSTEMS, 1))
    infos = []
    for n, (k, _x, _y, t, text, chips, href, hlabel, calc) in enumerate(SYSTEMS, 1):
        chip_html = "".join(f'<li>{c}</li>' for c in chips)
        calc_html = (f'<a class="link-arrow link-arrow--light" href="kalkulator.html#{calc}">Изчисли мощност {ico("arrow")}</a>'
                     if calc else "")
        infos.append(
            f'<article class="house-info" data-sys="{k}"{"" if n == 1 else " hidden"}>'
            f'<span class="house-info__n">{n:02d} / {len(SYSTEMS):02d}</span>'
            f'<h3>{t}</h3><p>{text}</p><ul class="house-chips">{chip_html}</ul>'
            f'<div class="house-info__links"><a class="btn btn--primary btn--sm" href="{href}">{hlabel} {arrow}</a>{calc_html}</div>'
            f'</article>')
    return f'''<section class="house" aria-labelledby="house-title">
  <div class="container">
    <div class="house-head">
      <div><span class="eyebrow eyebrow--light">Интелигентен дом</span>
      <h2 class="h2" id="house-title">Коя система къде?</h2></div>
      <p>Посочете номер в къщата, за да видите как работи всяка система и как се свързват помежду си.</p>
    </div>
    <div class="house-grid">
      <div class="house-stage" data-active="hp">{_svg()}{spots}</div>
      <div class="house-panel">
        <div class="house-infos" aria-live="polite">{"".join(infos)}</div>
        <ol class="house-tabs" aria-label="Системи">{tabs}</ol>
      </div>
    </div>
  </div>
</section>'''
