#!/usr/bin/env python3
"""Generates the static HD Trade website.  Run:  python3 _build/build.py
Shared header / footer / icons live here so every page stays consistent."""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from house import house_section

ROOT = Path(__file__).resolve().parent.parent

PHONE = "087 948 7678"
PHONE_HREF = "tel:+359879487678"
EMAIL = "di.danailov@gmail.com"
ADDRESS = "5302 Северна промишлена зона, Габрово"
COMPANY = "Ейч Ди Трейд ЕООД"

# ---------------------------------------------------------------- icons (stroke, 24px grid)
I = {
 "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
 "left": '<path d="M15 18l-6-6 6-6"/>',
 "right": '<path d="M9 18l6-6-6-6"/>',
 "chev": '<path d="M6 9l6 6 6-6"/>',
 "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
 "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
 "pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
 "menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
 "tools": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8z"/>',
 "team": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 "headset": '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
 "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
 "building": '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
 "fan": '<path d="M12 12c-3-3-3-8 0-9 3 1 2 6 0 9zM12 12c3 3 8 3 9 0-1-3-6-2-9 0zM12 12c3 3 3 8 0 9-3-1-2-6 0-9zM12 12c-3-3-8-3-9 0 1 3 6 2 9 0z"/><circle cx="12" cy="12" r="1.5"/>',
 "snow": '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1L19.1 4.9M9 4l3 2 3-2M9 20l3-2 3 2M4 9l2 3-2 3M20 9l-2 3 2 3"/>',
 "heat": '<path d="M8 4c-2 2.5 2 5.5 0 8s2 5.5 0 8M12 4c-2 2.5 2 5.5 0 8s2 5.5 0 8M16 4c-2 2.5 2 5.5 0 8s2 5.5 0 8"/>',
 "chat": '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 17 0z"/>',
 "layers": '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
 "check": '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>',
 "leaf": '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.5-6"/>',
 "euro": '<path d="M18 7a7 7 0 1 0 0 10M4 10h10M4 14h10"/>',
 "clipboard": '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M9 11h6M9 15h4"/>',
 "gauge": '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
}
def ico(name, cls="", extra=""):
    c = f' class="{cls}"' if cls else ""
    return f'<svg{c} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"{extra}>{I[name]}</svg>'

ARROW = ico("arrow", "arrow")

# ---------------------------------------------------------------- solutions data
SOL = [
 dict(slug="vrv-vrf", icon="building", img="vrv.jpg", img2="rooftop.jpg", hero="vrv2.jpg", s="vrv",
      title="VRV / VRF системи", nav="Климатизация (VRV/VRF)",
      short="Високоефективни решения за търговски, офис и големи сгради.",
      sub="Мощност 14–60 kW · Daikin, Mitsubishi"),
 dict(slug="ventilacia", icon="fan", img="vent.jpg", img2="ahu.jpg", hero="ducts.jpg", s="vent",
      title="Вентилация", nav="Вентилация",
      short="Рекуперативни блокове за свеж въздух и качествена вътрешна среда.",
      sub="250–2000 m³/ч · КПД 85%"),
 dict(slug="klimatici", icon="snow", img="split.jpg", img2="cassette.jpg", hero="split.jpg", s="split",
      title="Професионални сплит-системи", nav="Професионални сплит-системи",
      short="Икономични и енергийно ефективни системи „въздух-въздух“ за дома и бизнеса.",
      sub="Професионален клас · „въздух-въздух“"),
 dict(slug="termopompi", icon="heat", img="hp.jpg", img2="floor.jpg", hero="hp2.jpg", s="hp",
      title="Термопомпи въздух-вода", nav="Термопомпи",
      short="Съвременно отопление, охлаждане и битова гореща вода.",
      sub="Проектиране, монтаж и обслужване"),
]

NAV = [
 ("index.html", "Начало"),
 ("reshenia.html", "Решения"),
 ("proekti.html", "Проекти"),
 ("kalkulator.html", "Калкулатор"),
 ("za-nas.html", "За нас"),
 ("kontakti.html", "Контакти"),
]

def header(active):
    items = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == active or (href == "reshenia.html" and active in [s["slug"] + ".html" for s in SOL] + ["ceni-montazh.html"]) else ""
        if href == "reshenia.html":
            dd = "".join(
                f'<a href="{s["slug"]}.html"><span class="ico">{ico(s["icon"])}</span><span>{s["title"]}<small>{s["sub"]}</small></span></a>'
                for s in SOL) + f'<a href="ceni-montazh.html"><span class="ico">{ico("euro")}</span><span>Цени за монтаж<small>Монтаж от 350 € без ДДС</small></span></a>'
            items.append(f'<li class="nav__item"><a class="nav__link" href="{href}"{cur}>{label} {ico("chev")}</a><div class="dropdown">{dd}</div></li>')
        else:
            items.append(f'<li class="nav__item"><a class="nav__link" href="{href}"{cur}>{label}</a></li>')
    mob = []
    for href, label in NAV:
        mob.append(f'<a href="{href}">{label}</a>')
        if href == "reshenia.html":
            mob.append('<div class="sub">' + "".join(f'<a href="{s["slug"]}.html">{s["title"]}</a>' for s in SOL) + '<a href="ceni-montazh.html">Цени за монтаж</a></div>')
    return f'''<a class="skip" href="#main">Към съдържанието</a>
<header class="header">
  <div class="container header__inner">
    <a class="logo" href="index.html" aria-label="HD Trade – начало"><img src="assets/img/logo-hdtrade-480.png" alt="HD Trade – Intelligent Systems" width="480" height="139"></a>
    <nav class="nav" aria-label="Основна навигация"><ul class="nav__list">{"".join(items)}</ul></nav>
    <div class="header__actions">
      <a class="header__phone" href="{PHONE_HREF}">{ico("phone")} {PHONE}</a>
      <a class="btn btn--primary btn--sm" href="oferta.html">Поискай оферта {ARROW}</a>
    </div>
    <button class="burger" type="button" aria-label="Меню" aria-expanded="false" aria-controls="mobile-nav">{ico("menu")}</button>
  </div>
</header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Мобилна навигация">
  {"".join(mob)}
  <a class="btn btn--primary" href="oferta.html">Поискай оферта {ARROW}</a>
  <a class="btn mobile-phone" href="{PHONE_HREF}">{ico("phone")} {PHONE}</a>
</nav>'''

CTA_BAND = f'''<section class="cta-band" aria-labelledby="cta-title">
  <!--AIR:cta-->
  <div class="cta-band__fan" aria-hidden="true"><svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="3"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="88"/><circle cx="100" cy="100" r="14"/><g stroke-linejoin="round"><path d="M100 86C92 60 96 30 120 16c18 14 10 46-8 72"/><path d="M114 100c26-8 56-4 70 20-14 18-46 10-72-8"/><path d="M100 114c8 26 4 56-20 70-18-14-10-46 8-72"/><path d="M86 100c-26 8-56 4-70-20 14-18 46-10 72 8"/></g></svg></div>
  <div class="container cta-band__inner">
    <div>
      <h2 id="cta-title">Имате нужда от климатично решение?</h2>
      <p>Свържете се с нас за професионална консултация и индивидуална оферта.</p>
    </div>
    <div class="cta-band__actions">
      <a class="btn btn--primary" href="oferta.html">Поискай оферта {ARROW}</a>
      <a class="btn btn--ghost-light" href="{PHONE_HREF}">{ico("phone")} {PHONE}</a>
    </div>
  </div>
</section>'''

def footer():
    sols = "".join(f'<li><a href="{s["slug"]}.html">{s["title"]}</a></li>' for s in SOL)
    return f'''<footer class="footer">
  <div class="container footer__grid">
    <div class="footer__about">
      <a class="footer__brand" href="index.html"><img src="assets/img/logo-hdtrade-480.png" alt="HD Trade – Intelligent Systems" width="480" height="139" loading="lazy"></a>
      <p>Доставка, професионален монтаж и обслужване на климатични, вентилационни и отоплителни системи за дома и бизнеса.</p>
    </div>
    <div><h4>Решения</h4><ul>{sols}</ul></div>
    <div><h4>Компания</h4><ul>
      <li><a href="za-nas.html">За нас</a></li>
      <li><a href="proekti.html">Проекти</a></li>
      <li><a href="kalkulator.html">Калкулатор за мощност</a></li>
      <li><a href="ceni-montazh.html">Цени за монтаж</a></li>
      <li><a href="oferta.html">Поискай оферта</a></li>
      <li><a href="kontakti.html">Контакти</a></li></ul></div>
    <div><h4>Контакти</h4><ul class="footer__contact">
      <li>{ico("pin")}<span>{COMPANY}<br>{ADDRESS}</span></li>
      <li>{ico("phone")}<a href="{PHONE_HREF}">{PHONE}</a></li>
      <li>{ico("mail")}<a href="mailto:{EMAIL}">{EMAIL}</a></li></ul></div>
  </div>
  <div class="container footer__bottom">
    <span>© <span id="year">2026</span> {COMPANY}. Всички права запазени.</span>
    <span>Никаква част от съдържанието не може да бъде възпроизвеждана без изричното съгласие на собственика.</span>
  </div>
</footer>'''

def page(fname, title, desc, body, active=None, scripts=()):
    html = f'''<!doctype html>
<html lang="bg">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#003884">
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
{header(active or fname)}
<main id="main">
{body}
</main>
{footer()}
<script src="assets/js/main.js" defer></script>{"".join(f'<script src="assets/js/{s}" defer></script>' for s in scripts)}
</body>
</html>
'''
    for k in AIR_KINDS: html = html.replace(f'<!--AIR:{k}-->', soft_air(k))
    (ROOT / fname).write_text(html, encoding="utf-8")

def page_hero(crumb, eyebrow, h1, lead, img="hero.jpg"):
    return f'''<section class="page-hero">
  <div class="page-hero__media"><img src="assets/img/{img}" alt=""></div>
  <div class="container"><div class="page-hero__inner">
    <nav class="crumbs" aria-label="Навигационна пътека"><a href="index.html">Начало</a>{crumb}</nav>
    <span class="eyebrow eyebrow--light">{eyebrow}</span>
    <h1>{h1}</h1>
    <p>{lead}</p>
  </div></div>
</section>'''

def crumb(*parts):
    out = ""
    for href, label in parts:
        out += '<span aria-hidden="true">/</span>'
        out += f'<a href="{href}">{label}</a>' if href else f'<span>{label}</span>'
    return out

def aside(current):
    links = "".join(
        f'<a href="{s["slug"]}.html"{" aria-current=\"page\"" if s["slug"] == current else ""}>{s["title"]} {ico("right")}</a>' for s in SOL)
    s = next((x for x in SOL if x["slug"] == current), None)
    q = f'?s={s["s"]}' if s else ""
    calc = {"vrv-vrf": "building", "ventilacia": "vent", "klimatici": "split", "termopompi": "heatpump"}.get(current, "")
    return f'''<aside class="aside">
  <div class="aside-card">
    <h3>Поискайте оферта</h3>
    <p>Опишете обекта си — ще предложим подходящото оборудване и конфигурация. Огледът е безплатен.</p>
    <a class="btn btn--primary" href="oferta.html{q}">Поискай оферта {ARROW}</a>
    <a class="btn btn--ghost-light" href="{PHONE_HREF}">{ico("phone")} {PHONE}</a>
  </div>
  <a class="aside-calc" href="kalkulator.html{"#" + calc if calc else ""}">{ico("gauge")}<span><strong>Каква мощност ви трябва?</strong><small>Изчислете за 1 минута с калкулатора</small></span>{ico("right")}</a>
  <nav class="aside-nav" aria-label="Решения"><h4>Нашите решения</h4>{links}</nav>
</aside>'''

def cards(exclude=None):
    out = []
    for s in SOL:
        if s["slug"] == exclude: continue
        out.append(f'''<article class="card reveal">
  <a class="card__media" href="{s["slug"]}.html" tabindex="-1" aria-hidden="true"><img src="assets/img/{s["img"]}" alt="" loading="lazy"></a>
  <div class="card__body">
    {ico(s["icon"], "card__icon")}
    <h3>{s["title"]}</h3>
    <p>{s["short"]}</p>
    <a class="link-arrow" href="{s["slug"]}.html">Научи повече<span class="sr-only">: {s["title"]}</span> {ico("arrow")}</a>
  </div>
</article>''')
    return "\n".join(out)

TRUST = [("tools", "Професионален монтаж", "Собствен екип ОВК"),
         ("team", "Собствен екип", "Специалисти в ОВК"),
         ("headset", "Техническа консултация", "Подбор на решение"),
         ("shield", "Гаранционно обслужване", "2 години гаранция")]

STEPS = [("Консултация", "Обсъждаме вашите нужди и изисквания. Огледът е безплатен."),
         ("Подбор на решение", "Препоръчваме подходящо оборудване и конфигурация."),
         ("Доставка и монтаж", "Организираме доставката и извършваме професионален монтаж."),
         ("Обслужване", "Гаранционно и следгаранционно обслужване.")]

def steps():
    return "".join(f'<li class="step reveal"><span class="step__num">0{n}</span><div><h3>{t}</h3><p>{d}</p></div></li>'
                   for n, (t, d) in enumerate(STEPS, 1))

# Project entries — PLACEHOLDERS based on the approved mockup. Replace with real references.
PROJECTS = [
 dict(cat="office", tag="Офис сграда, Габрово", title="VRV система за офис сграда", img="vrv2.jpg",
      text="Централизирана VRV климатизация с канални и касетъчни вътрешни тела."),
 dict(cat="retail", tag="Търговски обект", title="Рекуперативна вентилация за търговски обект", img="ahu.jpg",
      text="Енергоспестяваща вентилация с рекуперация и CO₂ сензор."),
 dict(cat="home", tag="Жилищен обект", title="Термопомпа въздух-вода за еднофамилна къща", img="hp2.jpg",
      text="Отопление, охлаждане и битова гореща вода от една система."),
 dict(cat="office", tag="Бизнес сграда", title="VRF система за бизнес помещения", img="ahu-roof.jpg",
      text="Система с множество вътрешни тела за отделни офиси."),
]


# ---------------------------------------------------------------- hero airflow from the AC units
# A soft cone of fine air streaks blowing out of the outdoor units in the
# photo (coordinates in hero.jpg pixel space, 1672×941). main.js lays the SVG
# over the photo like object-fit: cover so the streaks leave the fan faces.
import math, random
AC_W, AC_H, AC_END = 1672, 941, -1500
UNITS = [  # x of the fan face, top and bottom of the fan column
    (1215, 585, 780),
    (1385, 555, 785),
]

def _cone_lines(ux, top, bot, n, rnd):
    out = []
    for i in range(n):
        s = i / (n - 1)
        y0 = top + s * (bot - top) + rnd.uniform(-8, 8)
        ye = 60 + s * 760 + rnd.uniform(-30, 30)           # the cone opens up as it travels
        sag = 190 + 130 * s                                    # air drops a little, then sweeps up — a soft arc
        c1x = ux - rnd.uniform(380, 520); c1y = y0 + sag * 0.9 + rnd.uniform(-15, 15)
        c2x = ux - rnd.uniform(1150, 1400); c2y = ye + sag * 1.2 + rnd.uniform(-40, 40)
        d = f"M{ux:.0f} {y0:.0f}C{c1x:.0f} {c1y:.0f} {c2x:.0f} {c2y:.0f} {AC_END} {ye:.0f}"
        out.append(d)
    return out

def ac_airflow():
    rnd = random.Random(7)                                  # fixed seed → identical output every build
    defs = [
        '<filter id="acHaze" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>',
        '<linearGradient id="acWarm" gradientUnits="userSpaceOnUse" x1="1300" y1="0" x2="-1500" y2="0">'
        '<stop offset="0" stop-color="#F2A900" stop-opacity="0"/><stop offset=".12" stop-color="#FFC94D" stop-opacity=".7"/>'
        '<stop offset=".55" stop-color="#F2A900" stop-opacity=".7"/><stop offset="1" stop-color="#F2A900" stop-opacity="0"/></linearGradient>',
        '<filter id="acSoft" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter>',
    ]
    layers = []
    for u, (ux, top, bot) in enumerate(UNITS):
        gid = f"acAir{u}"
        defs.append(
            f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{ux}" y1="0" x2="{AC_END}" y2="0">'
            '<stop offset="0" stop-color="#BFDBFF" stop-opacity="0"/>'
            '<stop offset=".06" stop-color="#BFDBFF" stop-opacity=".85"/>'
            '<stop offset=".35" stop-color="#7DB0F2" stop-opacity=".55"/>'
            '<stop offset=".75" stop-color="#3F7BD4" stop-opacity=".2"/>'
            '<stop offset="1" stop-color="#3F7BD4" stop-opacity="0"/></linearGradient>')
        lines = _cone_lines(ux, top, bot, 24, rnd)
        haze = "".join(f'<path d="{d}" stroke-width="{w}"/>' for d, w in ((lines[4], 46), (lines[12], 64), (lines[20], 46)))
        fine = "".join(
            f'<path class="{"af-odd " if k % 2 else ""}" d="{d}" stroke-width="{rnd.uniform(.5, 1.8):.2f}" stroke-opacity="{rnd.uniform(.18, .55):.2f}"/>'
            for k, d in enumerate(lines))
        wisps = "".join(
            f'<path class="ac-wisp" d="{d}" pathLength="1000" stroke-width="{rnd.uniform(1, 2.4):.1f}" '
            f'style="--w:{rnd.uniform(6, 11):.1f}s;animation-delay:-{rnd.uniform(0, 10):.1f}s"/>'
            for d in lines[1::3])
        warm = "".join(
            f'<path class="ac-wisp ac-wisp--warm" d="{d}" pathLength="1000" stroke="url(#acWarm)" stroke-width="{rnd.uniform(.7, 1.3):.1f}" '
            f'style="--w:{rnd.uniform(7, 12):.1f}s;animation-delay:-{rnd.uniform(0, 12):.1f}s"/>'
            for d in lines[::2] + lines[1::4])
        layers.append(
            f'<g class="ac-cone ac-cone--{u}" stroke="url(#{gid})" fill="none" stroke-linecap="round" '
            f'style="transform-origin:{ux}px {(top + bot) // 2}px">'
            f'<g class="ac-haze" filter="url(#acHaze)" opacity=".16">{haze}</g>'
            f'<g class="ac-fine" filter="url(#acSoft)">{fine}</g>'
            f'<g class="ac-wisps">{wisps}{warm}</g></g>')
    return (f'<div class="ac-air" aria-hidden="true"><svg class="ac-air__svg" viewBox="0 0 {AC_W} {AC_H}" '
            f'preserveAspectRatio="xMidYMid slice" focusable="false"><defs>{"".join(defs)}</defs>'
            f'{"".join(layers)}</svg></div>')

AIR_KINDS = {  # viewBox W, H, source x/y (on the right), source spread, seed, streak count
    "cta":  (1440, 300, 1345, 150, 110, 11, 22),
    "dark": (1440, 520, 1480, 300, 200, 31, 24),
}

def soft_air(kind):
    """Soft air blowing in from the right edge (from the fan in the CTA band)."""
    W, H, SX, SY, SPREAD, seed, n = AIR_KINDS[kind]
    rnd = random.Random(seed)
    END, u = -150, kind
    lines = []
    for i in range(n):
        s = i / (n - 1)
        y0 = SY - SPREAD / 2 + s * SPREAD + rnd.uniform(-6, 6)
        ye = H * 0.03 + s * H * 0.94 + rnd.uniform(-15, 15)
        sag = (40 + 30 * s) * H / 300
        c1x = SX - rnd.uniform(260, 380); c1y = y0 + sag * .8 + rnd.uniform(-8, 8)
        c2x = SX - rnd.uniform(800, 1000); c2y = ye + sag + rnd.uniform(-20, 20)
        lines.append(f"M{SX} {y0:.0f}C{c1x:.0f} {c1y:.0f} {c2x:.0f} {c2y:.0f} {END} {ye:.0f}")
    defs = (f'<filter id="{u}Haze" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>'
            f'<filter id="{u}Soft" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="1"/></filter>'
            f'<linearGradient id="{u}Air" gradientUnits="userSpaceOnUse" x1="{SX}" y1="0" x2="{END}" y2="0">'
            '<stop offset="0" stop-color="#BFDBFF" stop-opacity="0"/><stop offset=".08" stop-color="#BFDBFF" stop-opacity=".85"/>'
            '<stop offset=".45" stop-color="#7DB0F2" stop-opacity=".5"/><stop offset="1" stop-color="#3F7BD4" stop-opacity="0"/></linearGradient>'
            f'<linearGradient id="{u}Warm" gradientUnits="userSpaceOnUse" x1="{SX}" y1="0" x2="{END}" y2="0">'
            '<stop offset="0" stop-color="#F2A900" stop-opacity="0"/><stop offset=".12" stop-color="#FFC94D" stop-opacity=".7"/>'
            '<stop offset=".6" stop-color="#F2A900" stop-opacity=".6"/><stop offset="1" stop-color="#F2A900" stop-opacity="0"/></linearGradient>')
    q = n // 4
    haze = "".join(f'<path d="{lines[k]}" stroke-width="{w}"/>' for k, w in ((q, 30), (2 * q, 44), (3 * q, 30)))
    fine = "".join(f'<path class="{"af-odd" if k % 2 else ""}" d="{d}" stroke-width="{rnd.uniform(.5, 1.6):.2f}" stroke-opacity="{rnd.uniform(.2, .55):.2f}"/>'
                   for k, d in enumerate(lines))
    wisps = "".join(f'<path class="ac-wisp" d="{d}" pathLength="1000" stroke-width="{rnd.uniform(1, 2.2):.1f}" '
                    f'style="--w:{rnd.uniform(5, 9):.1f}s;animation-delay:-{rnd.uniform(0, 9):.1f}s"/>' for d in lines[1::3])
    warm = "".join(f'<path class="ac-wisp ac-wisp--warm" d="{d}" pathLength="1000" stroke="url(#{u}Warm)" stroke-width="{rnd.uniform(.7, 1.2):.1f}" '
                   f'style="--w:{rnd.uniform(6, 10):.1f}s;animation-delay:-{rnd.uniform(0, 10):.1f}s"/>' for d in lines[::2])
    return (f'<div class="ac-air ac-air--band" aria-hidden="true"><svg class="ac-air__svg" viewBox="0 0 {W} {H}" '
            f'preserveAspectRatio="xMaxYMid slice" focusable="false"><defs>{defs}</defs>'
            f'<g class="ac-cone" stroke="url(#{u}Air)" fill="none" stroke-linecap="round" style="transform-origin:{SX}px {SY}px">'
            f'<g class="ac-haze" filter="url(#{u}Haze)" opacity=".18">{haze}</g>'
            f'<g class="ac-fine" filter="url(#{u}Soft)">{fine}</g><g class="ac-wisps">{wisps}{warm}</g></g></svg></div>')

# ================================================================= HOME
def build_home():
    trust = "".join(f'<li class="trust__item">{ico(i)}<span>{t}<small>{s}</small></span></li>' for i, t, s in TRUST)
    slides = "".join(f'''<article class="slide">
  <div class="slide__img"><img src="assets/img/{p["img"]}" alt="{p["title"]}" loading="lazy"></div>
  <div class="slide__body"><span class="tag">{p["tag"]}</span><h3>{p["title"]}</h3><p>{p["text"]}</p>
  <a class="link-arrow link-arrow--light" href="proekti.html">Виж проекта {ico("arrow")}</a></div>
</article>''' for p in PROJECTS[:3])
    checks = [("chat", "Експертна консултация"), ("layers", "Подбор на подходящо решение"), ("tools", "Професионален монтаж"),
              ("shield", "Гаранция 2 години и сервиз"), ("headset", "Техническа поддръжка")]
    body = f'''<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media"><img src="assets/img/hero.jpg" alt="Модерна сграда с външни тела на термопомпи" fetchpriority="high"></div>
  {ac_airflow()}
  <div class="container hero__inner">
    <div class="hero__content">
      <span class="eyebrow eyebrow--light">HVAC решения за дома и бизнеса</span>
      <h1 id="hero-title">Интелигентни решения за комфорт и климат<em>.</em></h1>
      <p>Доставка, професионален монтаж и обслужване на съвременни климатични, вентилационни и отоплителни системи.</p>
      <div class="hero__ctas">
        <a class="btn btn--primary" href="oferta.html">Поискай оферта {ARROW}</a>
        <a class="btn btn--ghost-light" href="reshenia.html">Нашите решения</a>
      </div>
      <div class="hero__meta">
        <div><strong>5+ години</strong><span>на пазара</span></div>
        <div><strong>2 години</strong><span>гаранция</span></div>
        <div><strong>14–60 kW</strong><span>VRV / VRF системи</span></div>
      </div>
    </div>
    <div class="hero__badge"><span class="pulse" aria-hidden="true"></span><div><small>Оборудване от</small><strong>Daikin · Mitsubishi</strong></div></div>
  </div>
</section>

<section class="trust" aria-label="Предимства"><div class="container"><ul class="trust__list">{trust}</ul></div></section>

<section class="section" aria-labelledby="sol-title">
  <div class="container">
    <div class="section-head">
      <div><span class="eyebrow">Нашите решения</span><h2 class="h2" id="sol-title">Решения за всеки тип пространство.</h2></div>
      <a class="link-arrow" href="reshenia.html">Виж всички решения {ico("arrow")}</a>
    </div>
    <div class="cards">{cards()}</div>
    <div class="calc-teaser reveal">
      <div class="calc-teaser__text">{ico("gauge")}<div><h3>Не знаете каква мощност ви трябва?</h3><p>Отговорете на няколко въпроса и вижте ориентировъчна препоръка и цена за монтаж.</p></div></div>
      <a class="btn btn--outline" href="kalkulator.html">Към калкулатора {ARROW}</a>
    </div>
  </div>
</section>

<section class="section section--tight" aria-labelledby="why-title" style="padding-top:0">
  <div class="container why">
    <div class="why__media reveal"><img src="assets/img/office.jpg" alt="Съвременна офис сграда" loading="lazy"></div>
    <div class="why__text reveal">
      <span class="eyebrow">Защо HD Trade</span>
      <h2 class="h2" id="why-title">Повече от доставка. Цялостно HVAC решение.</h2>
      <p>От консултацията и подбора на оборудване, до професионалния монтаж и дългосрочната поддръжка — осигуряваме надеждност, комфорт и спокойствие. Работим със собствен екип от професионалисти в областта на ОВК.</p>
    </div>
    <ul class="checklist reveal">{"".join(f"<li>{ico(i)}{t}</li>" for i, t in checks)}</ul>
  </div>
</section>

{house_section(ico, ARROW)}

<section class="section section--off section--tight" aria-labelledby="how-title">
  <div class="container">
    <span class="eyebrow">Как работим</span>
    <h2 class="h2" id="how-title" style="margin-bottom:40px">От запитване до готово решение.</h2>
    <ol class="steps">{steps()}</ol>
  </div>
</section>

<section class="section" aria-labelledby="proj-title">
  <div class="container projects">
    <div class="projects__intro reveal">
      <span class="eyebrow">Реализирани проекти</span>
      <h2 class="h2" id="proj-title">Доверие, изградено с реални решения.</h2>
      <p>Разгледайте част от изпълнените от нас проекти в различни типове сгради.</p>
      <a class="btn btn--outline" href="proekti.html">Виж проектите {ARROW}</a>
    </div>
    <div class="slider reveal" data-slider>
      <div class="slider__track" aria-live="polite">{slides}</div>
      <div class="slider__nav"><div class="dots"></div>
        <div class="arrows"><button type="button" data-prev aria-label="Предишен">{ico("left")}</button><button type="button" data-next aria-label="Следващ">{ico("right")}</button></div></div>
    </div>
  </div>
</section>
{CTA_BAND}'''
    page("index.html", "HD Trade — Интелигентни решения за комфорт и климат",
         "Доставка, професионален монтаж и обслужване на VRV/VRF системи, вентилация, сплит-системи и термопомпи въздух-вода. Габрово.", body,
         scripts=("house.js",))

# ================================================================= SOLUTIONS OVERVIEW
def build_solutions():
    body = page_hero(crumb((None, "Решения")), "Нашите решения", "Решения за всеки тип пространство.",
        "Внасяме и монтираме професионални системи за климатизация, вентилация и отопление — за дома, офиса и търговските обекти.", "banner.jpg") + f'''
<section class="section"><div class="container"><div class="cards">{cards()}</div></div></section>
{house_section(ico, ARROW)}
<section class="section section--off section--tight"><div class="container">
  <span class="eyebrow">Как работим</span><h2 class="h2" style="margin-bottom:40px">От запитване до готово решение.</h2>
  <ol class="steps">{steps()}</ol></div></section>
{CTA_BAND}'''
    page("reshenia.html", "Решения — HD Trade", "VRV/VRF климатизация, вентилация с рекуперация, професионални сплит-системи и термопомпи въздух-вода.", body, scripts=("house.js",))

# ================================================================= SOLUTION DETAIL PAGES
DETAIL = {
 "vrv-vrf": dict(
   h1="Професионални VRV / VRF климатични системи.",
   lead="Доказано висока производителност и икономичност за офиси и бизнес помещения с много вътрешни тела.",
   specs=[("14–60 kW", "Мощност"), ("Daikin", "и Mitsubishi"), ("3 типа", "вътрешни тела")],
   body='''<h2>Централизиран климат за бизнес сгради</h2>
<p>Компанията ни внася професионални VRV/VRF климатични системи с доказани високи стойности на производителност и икономичност. Те са подходящи за офиси и бизнес помещения, където има нужда от няколко вътрешни тела.</p>
<p>Вътрешните тела често остават скрити и така се вписват съвсем естествено във вътрешното оформление на пространствата.</p>
<h3>Марки и конфигурации</h3>
<div class="brands"><span class="brand-chip">Daikin</span><span class="brand-chip">Mitsubishi</span></div>
<p>Предлагаме VRV/VRF системи с мощност от 14–60 kW и с богат набор от стилни вътрешни тела. Те могат да са канални, касетъчни и стенни и се комбинират според възложения проект.</p>''',
   feats=["Канални вътрешни тела", "Касетъчни вътрешни тела", "Стенни вътрешни тела", "Комбиниране според проекта",
          "Подходящи за офиси и търговски сгради", "Монтаж от собствен екип"]),
 "ventilacia": dict(
   h1="Енергоспестяваща вентилация с рекуперация.",
   lead="Свеж въздух и качествена вътрешна среда с минимални енергийни загуби.",
   specs=[("250–2000", "m³/ч капацитет"), ("85%", "КПД"), ("CO₂", "сензор")],
   body='''<h2>Какво е рекуперация?</h2>
<p>Предлагаме енергоспестяваща вентилация с рекуперативни блокове Daikin и Mitsubishi. Процесът на „рекуперация“ означава възвръщане на енергия за повторна употреба в рамките на същия процес. Това повишава ефективността и минимизира енергийните загуби на климатичните инсталации.</p>
<h3>Технически характеристики</h3>
<p>Рекуперативните ни блокове са с капацитет от 250–2000 m³/ч и КПД 85%. Те имат средни и фини прахови филтри и сензор за CO₂, което осигурява свежестта на въздуха в помещенията. Разходите за електроенергия са оптимални заради специалния правотоков електромотор.</p>
<div class="brands"><span class="brand-chip">Daikin</span><span class="brand-chip">Mitsubishi</span></div>
<h3>За кои обекти?</h3>
<p>Решението е особено подходящо за магазини и заведения, както и офиси в бизнес сгради и търговски центрове. Всеки проект е различен, а вашият проект има своето решение при нас.</p>''',
   feats=["Средни и фини прахови филтри", "Сензор за CO₂", "Правотоков (DC) електромотор", "Оптимални разходи за ток",
          "Магазини и заведения", "Офиси и търговски центрове"]),
 "klimatici": dict(
   h1="Професионални сплит-системи.",
   lead="Климатици от типа „въздух-въздух“ — от най-висок професионален клас, икономични и енергийно ефективни.",
   specs=[("Въздух-въздух", "тип система"), ("Висок клас", "професионални машини"), ("2 години", "гаранция")],
   body='''<h2>Надеждни решения за дома и бизнеса</h2>
<p>Нашата компания предлага професионални сплит-системи от типа „въздух-въздух“. Машините, които ще намерите при нас, са от най-висок професионален клас, икономични и енергийно ефективни.</p>
<p>Осигуряваме подбор на подходящия модел според помещението, професионален монтаж от собствен екип, гаранция 2 години и гаранционно и следгаранционно обслужване.</p>
<p class="muted">Вижте <a class="link-arrow" href="ceni-montazh.html">цените за монтаж</a> — огледът е безплатен.</p>''',
   feats=["Енергийно ефективни", "Икономична работа", "Безплатен оглед", "Прозрачни цени за монтаж",
          "Гаранционно обслужване", "Следгаранционен сервиз"]),
 "termopompi": dict(
   h1="Термопомпи въздух-вода.",
   lead="Ефективни и професионални разработки на изключително добри цени — за бизнеса и за дома.",
   specs=[("Отопление", "+ охлаждане"), ("БГВ", "битова гореща вода"), ("Висок клас", "доказани машини")],
   body='''<h2>Водещият метод за климатизация</h2>
<p>Термопомпите са безспорно водещи в последното десетилетие при предпочитаните методи за климатизация — както за бизнеса, така и за дома. Предложенията са много богати и всеки ще намери подходящото решение за своята ситуация.</p>
<p>Заедно с нашите партньори <strong>Феникс ЕМ, Варна</strong>, предлагаме ефективни и професионални разработки на изключително добри цени.</p>
<h3>Разработване, монтаж и обслужване</h3>
<p>За тези проекти влагаме машини от висок професионален клас, които са доказали своите качества. Един кратък разговор с нас ще ви насочи към правилния избор и заедно ще определим оптималното решение за обекта ви.</p>''',
   feats=["Разработване на проект", "Професионален монтаж", "Отопление и охлаждане", "Битова гореща вода",
          "Партньор: Феникс ЕМ, Варна", "Гаранционно обслужване"]),
}

def build_details():
    for s in SOL:
        d = DETAIL[s["slug"]]
        specs = "".join(f'<div class="spec"><strong>{a}</strong><span>{b}</span></div>' for a, b in d["specs"])
        feats = "".join(f'<li>{ico("check")}{f}</li>' for f in d["feats"])
        body = page_hero(crumb(("reshenia.html", "Решения"), (None, s["title"])), s["title"], d["h1"], d["lead"], s["hero"]) + f'''
<section class="section"><div class="container layout">
  <article class="prose">
    {d["body"]}
    <div class="specs">{specs}</div>
    <h3>Какво включва</h3>
    <ul class="feature-list">{feats}</ul>
    <div class="figure"><img src="assets/img/{s["img2"]}" alt="{s["title"]}" loading="lazy"></div>
    <p><a class="btn btn--primary" href="oferta.html?s={s["s"]}">Поискай оферта за {s["title"]} {ARROW}</a></p>
  </article>
  {aside(s["slug"])}
</div></section>
<section class="section section--off section--tight"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Още решения</span><h2 class="h2">Разгледайте и другите ни системи.</h2></div></div>
  <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">{cards(s["slug"])}</div>
</div></section>
{CTA_BAND}'''
        page(s["slug"] + ".html", f'{s["title"]} — HD Trade', s["short"], body)

# ================================================================= PRICES
def build_prices():
    rows = [
     ("Оглед", "", "Безплатен"),
     ("Предварително полагане на тръбен път", "При монтаж на машината се приспадат 80,00 €", "45,00 € + 35,00 €/m"),
     ("Антивибрационни тампони за външно тяло", "", "30,00 €"),
     ("Отводнителна вана за външно тяло", "", "55,00 € / бр."),
     ("Подгряваща вана", "", "45,00 € / бр."),
     ("Кабелен канал", "", "20,00 €/m"),
     ("Изработка на стойка (конструкция) за външно тяло", "", "След оглед"),
     ("Ползване на вишка и/или скеле", "При необходимост — разходите се поемат от клиента", "По договаряне"),
    ]
    tr = "".join(f'<tr><td>{a}{f"<small>{b}</small>" if b else ""}</td><td>{c}</td></tr>' for a, b, c in rows)
    body = page_hero(crumb((None, "Цени за монтаж")), "Цени за монтаж", "Прозрачни цени за монтаж.",
        "Монтаж на фреонова част на климатични системи от собствен екип. Огледът е безплатен.", "technician.jpg") + f'''
<section class="section"><div class="container layout">
  <article class="prose">
    <h2>Монтаж на фреонова част</h2>
    <div class="price-highlight">
      <div class="price">350,00 €<br><small>без ДДС</small></div>
      <p>Включва тръбен път 3 m, монтаж на външно тяло, ел. окабеляване и подвързване и пускане на хладилния агент в системата.<br><strong>Всеки допълнителен метър тръбен път — 35,00 €/m.</strong></p>
    </div>
    <h3>Допълнителни опции</h3>
    <table class="price-table">
      <thead><tr><th scope="col">Услуга</th><th scope="col">Цена</th></tr></thead>
      <tbody>{tr}</tbody>
    </table>
    <p class="note">Всички цени са без ДДС.</p>
  </article>
  {aside(None)}
</div></section>
{CTA_BAND}'''
    page("ceni-montazh.html", "Цени за монтаж — HD Trade", "Монтаж на фреонова част от 350 € без ДДС. Безплатен оглед.", body)

# ================================================================= PROJECTS
def build_projects():
    grid = "".join(f'''<div><a class="project-card" data-cat="{p["cat"]}" href="oferta.html">
  <img src="assets/img/{p["img"]}" alt="" loading="lazy">
  <div class="project-card__body"><span class="tag">{p["tag"]}</span><h3>{p["title"]}</h3><p>{p["text"]}</p></div></a></div>''' for p in PROJECTS)
    body = page_hero(crumb((None, "Проекти")), "Реализирани проекти", "Доверие, изградено с реални решения.",
        "Част от изпълнените от нас проекти в офис сгради, търговски обекти и домове.", "office.jpg") + f'''
<section class="section"><div class="container">
  <!-- ЗАМЕСТИТЕЛИ: проектите по-долу са примерни (от одобрения дизайн). Заменете с реални обекти и снимки. -->
  <div class="filters" role="group" aria-label="Филтър по тип обект">
    <button type="button" data-filter="all" aria-pressed="true">Всички</button>
    <button type="button" data-filter="office" aria-pressed="false">Офис сгради</button>
    <button type="button" data-filter="retail" aria-pressed="false">Търговски обекти</button>
    <button type="button" data-filter="home" aria-pressed="false">Домове</button>
  </div>
  <div class="project-grid">{grid}</div>
</div></section>
{CTA_BAND}'''
    page("proekti.html", "Проекти — HD Trade", "Реализирани HVAC проекти — VRV системи, вентилация и термопомпи.", body)

# ================================================================= ABOUT
def build_about():
    values = [("tools", "Собствен екип", "Работим със собствен екип от професионалисти в областта на ОВК — от монтажа до сервиза."),
              ("layers", "Комплексни решения", "VRV/VRF, вентилация с рекуперация, сплит-системи и термопомпи — от един партньор."),
              ("shield", "Гаранция и сервиз", "Гаранция 2 години за всички продукти и системи, гаранционно и следгаранционно обслужване.")]
    v = "".join(f'<div class="value reveal">{ico(i)}<h3>{t}</h3><p>{d}</p></div>' for i, t, d in values)
    body = page_hero(crumb((None, "За нас")), "За HD Trade", "Българска компания за съвременни HVAC системи.",
        "Повече от 5 години предлагаме комплексни решения за климатизация, вентилация и отопление.", "banner.jpg") + f'''
<section class="section"><div class="container split">
  <div class="prose reveal">
    <span class="eyebrow">Кои сме ние</span>
    <h2 class="h2" style="margin-bottom:20px">Интелигентни системи за комфорт и ефективност.</h2>
    <p><strong>HD Trade Ltd</strong> е българска фирма с утвърдено присъствие на пазара. Повече от 5 години внасяме внимателно подбрани рециклирани машини от най-висок клас и предлагаме комплексни решения за климатизация и вентилация на клиентите ни.</p>
    <p>Внасяме професионални VRV/VRF системи, а също и сплит-системи. В областта на вентилацията предлагаме водещи модели рекуперативни блокове с високо КПД. В допълнение — разработване, монтаж и обслужване на термопомпи „въздух-вода“ на разумни цени, но с безкомпромисно представяне.</p>
    <p class="muted">Без значение дали търсите комфорт в дома си или ефикасност за бизнес помещенията си, със сигурност има какво да ви предложим.</p>
  </div>
  <div class="split__media reveal"><img src="assets/img/technician.jpg" alt="Техник на HD Trade при сервиз на външно тяло" loading="lazy"></div>
</div></section>
<section class="section section--off section--tight"><div class="container"><div class="stats">
  <div class="stat"><strong>5<em>+</em></strong><span>години на пазара</span></div>
  <div class="stat"><strong>2<em>г.</em></strong><span>гаранция на системите</span></div>
  <div class="stat"><strong>4</strong><span>направления: VRV/VRF, вентилация, сплит, термопомпи</span></div>
  <div class="stat"><strong>0<em>€</em></strong><span>за оглед на обекта</span></div>
</div></div></section>
<section class="section section--tight"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Екип и оборудване</span><h2 class="h2">Собствен екип, собствена техника.</h2></div></div>
  <div class="gallery">
    <figure class="reveal"><img src="assets/img/technician.jpg" alt="Техник на HD Trade" loading="lazy"><figcaption>Монтаж и сервиз</figcaption></figure>
    <figure class="reveal"><img src="assets/img/van.jpg" alt="Сервизен бус на HD Trade" loading="lazy"><figcaption>Мобилен сервиз</figcaption></figure>
    <figure class="reveal"><img src="assets/img/boiler.jpg" alt="Хидравлична част на отоплителна инсталация" loading="lazy"><figcaption>Отоплителни инсталации</figcaption></figure>
    <figure class="reveal"><img src="assets/img/thermostat.jpg" alt="Интелигентен термостат" loading="lazy"><figcaption>Интелигентно управление</figcaption></figure>
  </div>
</div></section>
<section class="section dark-section"><!--AIR:dark--><div class="container">
  <span class="eyebrow eyebrow--light">Нашият подход</span>
  <h2 class="h2">Повече от доставка. Цялостно HVAC решение.</h2>
  <div class="values">{v}</div>
</div></section>
<section class="section section--tight"><div class="container">
  <span class="eyebrow">Как работим</span><h2 class="h2" style="margin-bottom:40px">От запитване до готово решение.</h2>
  <ol class="steps">{steps()}</ol></div></section>
{CTA_BAND}'''
    page("za-nas.html", "За нас — HD Trade", "HD Trade Ltd — българска фирма за климатизация, вентилация и термопомпи с повече от 5 години опит.", body)

# ================================================================= CONTACT
def contact_cards():
    return f'''<div class="contact-grid">
  <div class="contact-card"><span class="ico">{ico("phone")}</span><h3>Телефон</h3><a href="{PHONE_HREF}">{PHONE}</a></div>
  <div class="contact-card"><span class="ico">{ico("mail")}</span><h3>E-mail</h3><a href="mailto:{EMAIL}">{EMAIL}</a></div>
  <div class="contact-card"><span class="ico">{ico("pin")}</span><h3>Адрес</h3><p>{COMPANY}<br>{ADDRESS}</p></div>
</div>'''

def offer_form():
    systems = [("vrv", "VRV / VRF"), ("vent", "Вентилация"), ("split", "Сплит-система"), ("hp", "Термопомпа"), ("service", "Сервиз")]
    chips = "".join(f'<label><input type="checkbox" name="system" value="{v}"><span>{t}</span></label>' for v, t in systems)
    return f'''<form class="form" id="offer-form" data-to="{EMAIL}" novalidate>
  <div class="field"><label for="f-name">Вашето име <span class="req">*</span></label><input id="f-name" name="name" autocomplete="name" required></div>
  <div class="field"><label for="f-phone">Вашият телефон <span class="req">*</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required></div>
  <div class="field"><label for="f-email">Вашият e-mail <span class="req">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
  <div class="field"><label for="f-object">Тип обект</label><select id="f-object" name="object">
    <option value="">Изберете</option><option>Дом / апартамент</option><option>Офис</option><option>Търговски обект / заведение</option><option>Бизнес сграда</option><option>Друго</option></select></div>
  <div class="field field--full"><span class="field-label" style="font-size:.875rem;font-weight:700;color:var(--indigo)">Интересувам се от</span><div class="chips">{chips}</div></div>
  <div class="field field--full"><label for="f-subject">Тема</label><input id="f-subject" name="subject"></div>
  <div class="field field--full"><label for="f-msg">Опишете вашия обект и необходимости</label><textarea id="f-msg" name="message" placeholder="Площ, брой помещения, местоположение, срокове…"></textarea></div>
  <label class="consent"><input type="checkbox" required> <span>Съгласен/на съм данните ми да бъдат използвани за изготвяне на оферта.</span></label>
  <div class="form__actions"><button class="btn btn--primary" type="submit">Изпрати запитване {ARROW}</button><span class="form__status" role="status"></span></div>
</form>'''

def build_contact():
    body = page_hero(crumb((None, "Контакти")), "Контакти", "Свържете се с нас.",
        "Обадете се или изпратете запитване — ще ви насочим към правилното решение за вашия обект.", "van.jpg") + f'''
<section class="section"><div class="container">
  {contact_cards()}
  <div class="layout">
    <div class="prose"><h2>Изпратете запитване</h2><p class="muted">Попълнете възможно най-подробно формуляра и ще се свържем с вас.</p>{offer_form()}</div>
    <div class="map"><iframe title="Карта: Северна промишлена зона, Габрово" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%B0+%D0%BF%D1%80%D0%BE%D0%BC%D0%B8%D1%88%D0%BB%D0%B5%D0%BD%D0%B0+%D0%B7%D0%BE%D0%BD%D0%B0+%D0%93%D0%B0%D0%B1%D1%80%D0%BE%D0%B2%D0%BE&output=embed"></iframe></div>
  </div>
</div></section>'''
    page("kontakti.html", "Контакти — HD Trade", f"HD Trade, Габрово — тел. {PHONE}, {ADDRESS}.", body)

def build_offer():
    body = page_hero(crumb((None, "Поискай оферта")), "Поискай оферта", "Индивидуална оферта за вашия обект.",
        "Попълнете възможно най-подробно формуляра. Огледът на обекта е безплатен.", "bim.jpg") + f'''
<section class="section"><div class="container layout">
  <div class="prose"><h2>Данни за запитването</h2><p class="muted">Полетата със * са задължителни.</p>{offer_form()}</div>
  {aside(None)}
</div></section>'''
    page("oferta.html", "Поискай оферта — HD Trade", "Изпратете запитване за оферта за климатизация, вентилация или термопомпа.", body, "oferta.html")

# ================================================================= CALCULATOR
def build_calculator():
    body = page_hero(crumb((None, "Калкулатор")), "Калкулатор", "Каква мощност ви трябва?",
        "Отговорете на няколко въпроса и вижте ориентировъчна препоръка за климатик, термопомпа или вентилация — с цена за монтаж.",
        "thermostat.jpg") + f'''
<section class="section"><div class="container">
  <div class="calc" id="calc">
    <noscript><p>Калкулаторът изисква JavaScript. Можете да <a href="oferta.html">изпратите запитване</a> или да се обадите на {PHONE}.</p></noscript>
  </div>
  <p class="note" style="max-width:920px;margin:28px auto 0">Изчислението е ориентировъчно и се базира на общоприети инженерни правила. Точната мощност и моделът се определят след безплатен оглед на обекта. Цените за монтаж са без ДДС.</p>
</div></section>
{CTA_BAND}'''
    page("kalkulator.html", "Калкулатор за мощност — HD Trade",
         "Изчислете ориентировъчно каква мощност климатик, термопомпа или рекуператор ви трябва — според площта, изолацията, етажа и изложението.",
         body, scripts=("calc.js", "calculator.js"))

if __name__ == "__main__":
    build_home(); build_solutions(); build_details(); build_prices()
    build_projects(); build_about(); build_contact(); build_offer(); build_calculator()
    print("built:", sorted(p.name for p in ROOT.glob("*.html")))
