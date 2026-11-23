/* Kontrola a prevod procesného modelu na kroky a mapu. Iba čítanie; nič nevykonáva. */
(function (root) {
  'use strict';
  const fail = message => { throw new Error(message); };
  const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const text = v => typeof v === 'string' && v.trim().length > 0;
  const texts = v => Array.isArray(v) && v.every(text);
  const TYPES = ['action', 'decision', 'terminal'];

  function validate(model) {
    if (!plain(model) || model.schemaVersion !== 1) fail('Model potrebuje riadok schemaVersion: 1.');
    const p = model.process;
    if (!plain(p)) fail('Chýba časť process.');
    for (const key of ['id', 'title', 'version', 'owner', 'trigger', 'description', 'start', 'updated']) {
      if (!text(p[key])) fail('V časti process chýba pole ' + key + ' (text v úvodzovkách).');
    }
    if (!/^[a-z][a-z0-9-]*$/.test(p.id)) fail('ID postupu smie obsahovať iba malé písmená bez diakritiky, číslice a pomlčky.');
    for (const key of ['input', 'output']) if (p[key] !== undefined && !text(p[key])) fail('Pole process.' + key + ' musí byť text.');
    if (model.owners !== undefined && (!texts(model.owners) || !model.owners.length)) fail('owners musí byť zoznam mien.');
    if (model.notes !== undefined && !texts(model.notes)) fail('notes musí byť zoznam textov.');
    const known = model.owners ? new Set(model.owners) : null;
    if (known && !known.has(p.owner)) fail('Vlastník postupu „' + p.owner + '“ nie je v zozname owners.');
    if (!Array.isArray(model.nodes) || !model.nodes.length) fail('Model nemá žiadne kroky (nodes).');

    const ids = new Set();
    for (const node of model.nodes) {
      if (!plain(node) || !/^[a-z][a-z0-9_]*$/.test(node.id || '')) fail('Krok má neplatné ID. Povolené sú malé písmená bez diakritiky, číslice a podčiarkovník.');
      if (ids.has(node.id)) fail('ID kroku „' + node.id + '“ je použité dvakrát.');
      ids.add(node.id);
      if (!TYPES.includes(node.type)) fail('Krok „' + node.id + '“ má neznámy typ. Povolené: action, decision, terminal.');
      for (const key of ['title', 'owner', 'detail']) if (!text(node[key])) fail('Kroku „' + node.id + '“ chýba pole ' + key + '.');
      if (known && !known.has(node.owner)) fail('Vlastník kroku „' + node.id + '“ („' + node.owner + '“) nie je v zozname owners.');
      if (node.map_title !== undefined && !text(node.map_title)) fail('map_title kroku „' + node.id + '“ musí byť text.');
      if (node.evidence !== undefined && !texts(node.evidence)) fail('evidence kroku „' + node.id + '“ musí byť zoznam textov.');
      if (node.human !== undefined && typeof node.human !== 'boolean') fail('human kroku „' + node.id + '“ musí byť true alebo false.');
      const branches = node.branches === undefined ? [] : node.branches;
      if (!Array.isArray(branches)) fail('branches kroku „' + node.id + '“ musí byť zoznam.');
      for (const b of branches) if (!plain(b) || !text(b.label) || !text(b.target)) fail('Vetva kroku „' + node.id + '“ potrebuje label a target.');
      if (node.type === 'decision' && branches.length < 2) fail('Rozhodnutie „' + node.id + '“ potrebuje aspoň dve vetvy.');
      if (node.type === 'action' && !branches.length) fail('Krok „' + node.id + '“ nemá pokračovanie. Doplňte vetvu alebo typ terminal.');
      if (node.type === 'terminal' && branches.length) fail('Koncový krok „' + node.id + '“ nesmie mať vetvy.');
      if (new Set(branches.map(b => b.label)).size !== branches.length) fail('Krok „' + node.id + '“ má dve vetvy s rovnakým popisom.');
    }
    if (!ids.has(p.start)) fail('Začiatočný krok „' + p.start + '“ neexistuje.');
    const byId = new Map(model.nodes.map(n => [n.id, n]));
    for (const node of model.nodes) for (const b of node.branches || []) {
      if (!ids.has(b.target)) fail('Vetva kroku „' + node.id + '“ vedie na neexistujúci krok „' + b.target + '“.');
    }
    const seen = new Set(), queue = [p.start];
    while (queue.length) {
      const id = queue.shift();
      if (seen.has(id)) continue;
      seen.add(id);
      queue.push(...(byId.get(id).branches || []).map(b => b.target));
    }
    if (seen.size !== ids.size) fail('K týmto krokom nevedie žiadna cesta: ' + [...ids].filter(id => !seen.has(id)).join(', ') + '.');
    const ends = model.nodes.filter(n => n.type === 'terminal');
    if (!ends.length) fail('Postup nemá koncový krok (typ terminal).');
    const reaches = new Set(ends.map(n => n.id)), back = new Map(model.nodes.map(n => [n.id, []]));
    for (const node of model.nodes) for (const b of node.branches || []) back.get(b.target).push(node.id);
    const rq = [...reaches];
    while (rq.length) for (const origin of back.get(rq.shift())) if (!reaches.has(origin)) { reaches.add(origin); rq.push(origin); }
    if (reaches.size !== ids.size) fail('Z týchto krokov sa nedá dostať ku koncu: ' + [...ids].filter(id => !reaches.has(id)).join(', ') + '.');
    return true;
  }

  const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;').replace(/\s+/g, ' ');
  function wrap(value, width) {
    const lines = []; let line = '';
    for (const word of String(value).trim().split(/\s+/)) {
      if (line && line.length + word.length + 1 > width) { lines.push(line); line = word; } else line = line ? line + ' ' + word : word;
    }
    if (line) lines.push(line);
    return lines.map(esc).join('<br/>');
  }

  function compile(model) {
    validate(model);
    const order = new Map(model.nodes.map((n, i) => [n.id, i]));
    const steps = model.nodes.map((n, i) => ({
      id: n.id, number: i + 1, type: n.type, title: n.title, mapTitle: n.map_title || n.title, owner: n.owner,
      detail: n.detail, evidence: n.evidence || [], human: n.human === true,
      branches: (n.branches || []).map(b => ({ label: b.label, target: b.target, targetNumber: order.get(b.target) + 1, isReturn: order.get(b.target) <= i }))
    }));
    const gid = id => 'step_' + id;
    const lines = ['flowchart TD'];
    for (const s of steps) {
      const label = wrap(s.number + '. ' + s.mapTitle, 26);
      lines.push('  ' + gid(s.id) + (s.type === 'decision' ? '{{"' + label + '"}}' : s.type === 'terminal' ? '(["' + label + '"])' : '["' + label + '"]'));
    }
    for (const s of steps) for (const b of s.branches) lines.push('  ' + gid(s.id) + (b.isReturn ? ' -.->|"' : ' -->|"') + wrap(b.label, 22) + '"| ' + gid(b.target));
    const groups = { action: [], decision: [], terminal: [], human: [] };
    for (const s of steps) groups[s.human ? 'human' : s.type].push(gid(s.id));
    lines.push(
      '  classDef action fill:#f3f5f8,stroke:#9aa5b5,color:#14213d;',
      '  classDef decision fill:#ffffff,stroke:#14213d,color:#14213d;',
      '  classDef terminal fill:#e8f3ec,stroke:#2f7d4f,color:#14213d;',
      '  classDef human fill:#fff4e5,stroke:#c26a00,color:#14213d,stroke-width:2px;'
    );
    for (const [name, list] of Object.entries(groups)) if (list.length) lines.push('  class ' + list.join(',') + ' ' + name + ';');
    return { steps, mermaid: lines.join('\n') + '\n' };
  }

  root.ProcessEngine = Object.freeze({ validate, compile });
})(typeof globalThis !== 'undefined' ? globalThis : window);
