/* Čítačka procesného manuálu. Beží priamo zo súboru (file://), bez servera a bez internetu.
   Modely prichádzajú ako doslovná kópia model.yaml zabalená v model.js; nič sa nesťahuje cez fetch. */
(function () {
  'use strict';
  const ID = /^[a-z][a-z0-9-]*$/;
  const base = 'Postupy/';
  const entries = new Map();   // id -> { id, raw, model, compiled, error }
  let order = [], pending = 0, registered = false, currentId = null, renderToken = 0;

  const $ = sel => document.querySelector(sel);
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') node.className = v; else if (k === 'text') node.textContent = v; else node.setAttribute(k, v);
    }
    for (const child of [].concat(children || [])) if (child) node.append(child);
    return node;
  }

  /* Doslovný text modelu je v komentári funkcie; toString() vráti presný zdrojový text. */
  function yamlFrom(wrapper) {
    const src = Function.prototype.toString.call(wrapper);
    const a = src.indexOf('/*'), b = src.lastIndexOf('*/');
    if (a < 0 || b <= a) throw new Error('Súbor model.js nemá očakávaný tvar. Obnovte ho z model.yaml.');
    return src.slice(a + 2, b).replace(/^\r?\n/, '').replace(/\r?\n$/, '\n');
  }

  function settle() { if (registered && pending === 0) start(); }

  window.CompanyOS = {
    register(ids) {
      if (registered) return;
      registered = true;
      order = [];
      for (const id of Array.isArray(ids) ? ids : []) {
        if (typeof id !== 'string' || !ID.test(id) || entries.has(id)) continue;
        order.push(id);
        entries.set(id, { id, error: 'Súbor Postupy/' + id + '/model.js sa nenašiel alebo je poškodený.' });
        pending++;
        const script = document.createElement('script');
        script.src = base + id + '/model.js';
        script.onload = script.onerror = () => { pending--; settle(); };
        document.head.append(script);
      }
      settle();
    },
    model(id, wrapper) {
      const entry = entries.get(id);
      if (!entry) return;
      try {
        entry.raw = yamlFrom(wrapper);
        const model = jsyaml.load(entry.raw, { schema: jsyaml.CORE_SCHEMA });
        entry.compiled = ProcessEngine.compile(model);
        if (model.process.id !== id) throw new Error('Priečinok sa volá „' + id + '“, ale model má ID „' + model.process.id + '“.');
        entry.model = model;
        entry.error = null;
      } catch (error) {
        entry.model = null;
        entry.error = error.message || String(error);
      }
    }
  };

  function start() {
    mermaid.initialize({
      startOnLoad: false, securityLevel: 'strict', theme: 'base', fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
      themeVariables: { primaryColor: '#ffffff', primaryTextColor: '#14213d', primaryBorderColor: '#9aa5b5', lineColor: '#5c677a', edgeLabelBackground: '#ffffff', fontSize: '15px' },
      flowchart: { htmlLabels: false, curve: 'basis', nodeSpacing: 32, rankSpacing: 46, padding: 14, useMaxWidth: false }
    });
    renderList();
    addEventListener('hashchange', route);
    route();
  }

  function renderList() {
    const nav = $('#zoznam');
    nav.replaceChildren();
    if (!order.length) {
      nav.append(el('p', { class: 'empty', text: 'Zatiaľ tu nie je žiadny postup. Požiadajte svojho asistenta, aby s vami prvý pripravil.' }));
      return;
    }
    for (const id of order) {
      const e = entries.get(id);
      const link = el('a', { href: '#' + id, 'data-id': id }, [
        el('strong', { text: e.model ? e.model.process.title : id }),
        el('span', { text: e.model ? e.model.process.owner + ' · verzia ' + e.model.process.version : 'Model treba opraviť' })
      ]);
      if (!e.model) link.classList.add('has-error');
      nav.append(link);
    }
  }

  function route() {
    let hash = '';
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    const [id, stepId] = hash.split('/');
    const target = entries.has(id) ? id : order[0];
    if (!target) { $('#obsah').replaceChildren(el('p', { class: 'empty', text: 'Manuál je pripravený a čaká na prvý postup.' })); return; }
    if (target !== currentId) { currentId = target; renderProcess(target); }
    document.querySelectorAll('#zoznam a').forEach(a => a.dataset.id === target ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    if (stepId) activate(stepId, true);
  }

  function meta(label, value) { return value ? el('div', {}, [el('dt', { text: label }), el('dd', { text: value })]) : null; }

  function renderProcess(id) {
    const e = entries.get(id), main = $('#obsah');
    main.replaceChildren();
    if (!e.model) {
      main.append(
        el('h2', { text: id }),
        el('div', { class: 'error', role: 'alert' }, [
          el('strong', { text: 'Tento postup sa nedá zobraziť.' }),
          el('p', { text: e.error }),
          el('p', { text: 'Povedzte asistentovi: „Oprav model postupu ' + id + ' a obnov manuál.“' })
        ])
      );
      return;
    }
    const p = e.model.process, steps = e.compiled.steps;
    document.title = p.title + ' — Procesný manuál';
    main.append(
      el('h2', { text: p.title }),
      el('p', { class: 'lead', text: p.description }),
      el('dl', { class: 'meta' }, [
        meta('Vlastník', p.owner), meta('Spúšťač', p.trigger), meta('Vstup', p.input), meta('Výsledok', p.output),
        meta('Verzia', p.version + ' · ' + p.updated)
      ])
    );

    const viewport = el('div', { class: 'viewport fit' }, el('div', { class: 'diagram' }));
    const scaleLabel = el('span', { class: 'scale', text: '' });
    const btn = (label, title) => el('button', { type: 'button', title: title || label, text: label });
    const minus = btn('−', 'Zmenšiť'), plus = btn('+', 'Zväčšiť'), fit = btn('Prispôsobiť'), big = btn('Celá obrazovka');
    const panel = el('section', { class: 'map', 'aria-label': 'Procesná mapa' }, [
      el('div', { class: 'toolbar' }, [el('h3', { text: 'Mapa postupu' }), el('span', { class: 'legend' }, [
        el('i', { class: 'k human' }), 'rozhoduje človek', el('i', { class: 'k decision' }), 'rozhodnutie', el('i', { class: 'k terminal' }), 'koniec'
      ]), minus, scaleLabel, plus, fit, big]),
      viewport
    ]);
    main.append(panel);

    main.append(el('h3', { text: 'Kroky' }));
    const list = el('ol', { class: 'steps' });
    for (const s of steps) {
      const badges = [el('span', { class: 'badge', text: s.owner })];
      if (s.human) badges.push(el('span', { class: 'badge human', text: 'Rozhoduje človek' }));
      if (s.type === 'decision') badges.push(el('span', { class: 'badge', text: 'Rozhodnutie' }));
      if (s.type === 'terminal') badges.push(el('span', { class: 'badge end', text: 'Koniec' }));
      const item = el('li', { class: 'step', id: 'krok-' + s.id, 'data-step': s.id, tabindex: '-1' }, [
        el('h4', {}, [el('span', { class: 'num', text: s.number + '.' }), ' ' + s.title]),
        el('p', { class: 'badges' }, badges),
        el('p', { text: s.detail })
      ]);
      if (s.evidence.length) item.append(el('p', { class: 'evidence' }, [el('strong', { text: 'Ako spoznám, že je hotovo: ' }), s.evidence.join('; ') + '.']));
      if (s.branches.length) {
        const ul = el('ul', { class: 'branches' });
        for (const b of s.branches) ul.append(el('li', {}, [b.label + ' → ', el('a', { href: '#' + id + '/' + b.target, text: 'krok ' + b.targetNumber })]));
        item.append(ul);
      }
      list.append(item);
    }
    main.append(list);
    if (e.model.notes && e.model.notes.length) {
      main.append(el('h3', { text: 'Hranice a poznámky' }), el('ul', { class: 'notes' }, e.model.notes.map(n => el('li', { text: n }))));
    }
    main.append(el('p', { class: 'source', text: 'Zdroj: AI OS/Postupy/' + id + '/model.yaml. Táto stránka sa neupravuje; zmeny robí asistent v modeli.' }));
    drawMap(id, e, viewport, { minus, plus, fit, big, scaleLabel, panel });
  }

  async function drawMap(id, e, viewport, ui) {
    const token = ++renderToken, holder = viewport.firstChild;
    let svgEl, native = 700, scale = 1;
    try {
      const { svg } = await mermaid.render('mapa-' + token, e.compiled.mermaid);
      if (token !== renderToken) return;
      holder.innerHTML = svg;
      svgEl = holder.querySelector('svg');
      native = Math.max(320, svgEl.viewBox.baseVal.width || 700);
      svgEl.removeAttribute('style'); svgEl.removeAttribute('width'); svgEl.removeAttribute('height');
      svgEl.setAttribute('role', 'group');
      svgEl.setAttribute('aria-label', 'Procesná mapa. Uzly vedú na kroky v texte.');
      for (const s of e.compiled.steps) {
        const node = [...holder.querySelectorAll('.node')].find(n => n.id.startsWith('flowchart-step_' + s.id + '-'));
        if (!node) continue;
        const link = document.createElementNS('http://www.w3.org/2000/svg', 'a');
        link.setAttribute('href', '#' + id + '/' + s.id);
        link.setAttribute('aria-label', 'Krok ' + s.number + ': ' + s.title);
        link.dataset.step = s.id;
        node.before(link); link.append(node);
        link.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); });
      }
    } catch (error) {
      holder.replaceChildren(el('p', { class: 'error', text: 'Mapu sa nepodarilo vykresliť. Celý postup je v krokoch nižšie.' }));
      console.error(error);
      return;
    }
    const current = () => viewport.classList.contains('fit') ? svgEl.getBoundingClientRect().width / native : scale;
    const label = () => { ui.scaleLabel.textContent = Math.round(current() * 100) + ' %'; };
    const apply = () => {
      viewport.classList.remove('fit');
      svgEl.style.maxWidth = '';
      svgEl.style.width = Math.round(native * scale) + 'px';
      label();
    };
    const fitWidth = () => { viewport.classList.add('fit'); svgEl.style.width = ''; svgEl.style.maxWidth = native + 'px'; label(); };
    fitWidth();
    ui.minus.onclick = () => { scale = Math.max(0.2, current() / 1.25); apply(); };
    ui.plus.onclick = () => { scale = Math.min(3, current() * 1.25); apply(); };
    ui.fit.onclick = fitWidth;
    if (ui.panel.requestFullscreen) ui.big.onclick = () => document.fullscreenElement ? document.exitFullscreen() : ui.panel.requestFullscreen();
    else ui.big.hidden = true;
    const stepId = location.hash.split('/')[1];
    if (stepId) activate(decodeURIComponent(stepId), false);
  }

  function activate(stepId, scroll) {
    const step = document.getElementById('krok-' + stepId);
    document.querySelectorAll('.step').forEach(s => s.classList.toggle('is-active', s === step));
    document.querySelectorAll('.diagram a[data-step]').forEach(a => a.classList.toggle('is-active', a.dataset.step === stepId));
    if (step && scroll) { step.scrollIntoView({ block: 'center', behavior: 'smooth' }); step.focus({ preventScroll: true }); }
  }

  /* Ak register.js chýba alebo sa nenačíta, čítačka to povie namiesto prázdnej stránky. */
  addEventListener('load', () => {
    if (!registered) $('#obsah').replaceChildren(el('div', { class: 'error', role: 'alert' }, [
      el('strong', { text: 'Zoznam postupov sa nenačítal.' }),
      el('p', { text: 'Skontrolujte, že Manuál.html zostal v priečinku AI OS spolu s priečinkom Postupy.' })
    ]));
  });
})();
