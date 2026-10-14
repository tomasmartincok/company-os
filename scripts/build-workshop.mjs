import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSnapshots, sha256, repositoryRoot, workshopFiles, demoPayload, writeFreshDirectory } from './workshop-content.mjs';

const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const inline = value => escapeHtml(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');

// A deliberately small escaped renderer for this reviewed content. Raw HTML is never executed.
export function renderMarkdown(markdown, prefix, labels = []) {
  let result = '';
  let blockIndex = 0;
  let list = false;
  const lines = markdown.split(/\r?\n/);
  const closeList = () => { if (list) { result += '</ul>'; list = false; } };
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '```text') {
      closeList();
      let text = '';
      while (++i < lines.length && lines[i] !== '```') text += lines[i] + '\n';
      const id = `${prefix}-text-${++blockIndex}`;
      result += copyBlock(text, id, labels[blockIndex - 1] ?? 'Kopírovať text');
    } else if (/^#{1,6} /.test(lines[i])) {
      closeList();
      const [, marks, title] = /^(#{1,6}) (.*)$/.exec(lines[i]);
      const level = Math.min(6, marks.length);
      result += `<h${level}>${inline(title)}</h${level}>`;
    } else if (/^- /.test(lines[i])) {
      if (!list) { result += '<ul>'; list = true; }
      const item = lines[i].slice(2).replace(/^\[ \] /, '☐ ');
      result += `<li>${inline(item)}</li>`;
    } else if (lines[i].trim()) {
      closeList();
      let paragraph = lines[i];
      while (i + 1 < lines.length && lines[i + 1].trim() && !/^(#{1,6} |```|- )/.test(lines[i + 1])) paragraph += ' ' + lines[++i];
      result += `<p>${inline(paragraph)}</p>`;
    } else closeList();
  }
  closeList();
  return result;
}

const copyBlock = (value, id, label) => `<div class="copy-block"><button type="button" class="copy-button" data-copy="${id}" hidden>${escapeHtml(label)}</button><pre><code id="${id}" tabindex="0">${escapeHtml(value)}</code></pre><p class="copy-status" id="${id}-status" role="status" aria-live="polite"></p><textarea class="manual-copy" id="${id}-manual" aria-label="Text na ručné kopírovanie" readonly hidden></textarea></div>`;

export function renderPortal(content) {
  const promptLinks = content.prompts.map(prompt => `<a href="#${prompt.id}">${escapeHtml(prompt.title)}</a>`).join('');
  const branchLinks = content.branches.map(branch => `<a href="#${branch.id}">${escapeHtml(branch.title)}</a>`).join('');
  const promptArticles = content.prompts.map(prompt => `<article id="${prompt.id}"><h3>${escapeHtml(prompt.title)}</h3>${renderMarkdown(prompt.body, prompt.id, [`Kopírovať ${prompt.id.toUpperCase()}`])}</article>`).join('');
  const branches = content.branches.map(branch => {
    const context = /### Demo kontext\r?\n\r?\n([\s\S]*?)(?=\r?\n### )/.exec(branch.body)[1];
    const criteria = branch.body.slice(branch.body.indexOf('**Skontrolujte výsledok:**'));
    const inputs = [0, 1].map(index => `<h4>Demo ${index ? 'B' : 'A'} — celý text na kopírovanie</h4>${copyBlock(demoPayload(branch, index), `${branch.id}-${index ? 'b' : 'a'}`, `Kopírovať demo ${index ? 'B' : 'A'}: ${branch.id}`)}`).join('');
    return `<article id="${branch.id}" class="demo"><h3>${escapeHtml(branch.title)}</h3><h4>Demo kontext</h4>${renderMarkdown(context, `${branch.id}-context`)}${inputs}${renderMarkdown(criteria, `${branch.id}-criteria`)}</article>`;
  }).join('');
  const outcome = content.documents[workshopFiles[0]].split('## Čo si odnášate\n')[1];
  const ownInputs = content.documents[workshopFiles[1]].split('## Použitie vlastných vstupov\n')[1];
  return `<!doctype html>
<html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Workshop: vlastný zamestnanec · company-os</title><link rel="stylesheet" href="assets/portal.css"><script src="assets/portal.js" defer></script></head><body>
<a class="skip-link" href="#obsah">Prejsť na obsah</a>
<header><p class="eyebrow">company-os · lokálne podklady</p><h1>Workshop: vlastný zamestnanec</h1><p>Doplňte základ, vytvorte vlastného zamestnanca a postup, potom ho overte na dvoch rôznych vstupoch.</p></header>
<main id="obsah"><section aria-labelledby="zaciatok"><h2 id="zaciatok">Začnite vo svojom pracovnom priečinku</h2><p>Najprv dokončite overenú inštaláciu company-os. Tento portál obsahuje podklady; systém ani pripojenie mailu neinštaluje. Doplňte vlastné údaje v <strong>hranatých zátvorkách</strong> každého promptu.</p><p>Postupujte P1–P7. Použite vlastné vstupy alebo jednu demo vetvu. Ak používate ukážku, pri P4 vložte demo A; pri P6 otvorte <strong>nový chat nad rovnakým koreňovým priečinkom</strong> a vložte demo B.</p><p class="notice">Všetky demo osoby, firmy, termíny a situácie sú fiktívne. Pripravený demo blok zahŕňa izolovaný kontext, označenie fiktívnosti a vstup. Neprepisujte ním svoj firemný ani osobný profil.</p><p>Ak kopírovanie do schránky nie je dostupné, použite označenie textu a <strong>Ctrl+C / Cmd+C</strong>. Text je dostupný aj bez JavaScriptu.</p><p>Markdown podklady: <a href="pracovny-list-a-prompty.md">pracovný list a prompty</a> · <a href="ukazkove-vstupy.md">príklady a demo bloky</a>.</p><p>Manuál procesov otvoríte zo „Začnite tu“ v úplnom nainštalovanom systéme. Tento samostatný modul ho nevytvára.</p></section>
<nav aria-label="Sedem workshopových krokov" class="link-list">${promptLinks}</nav>
<section aria-labelledby="prompty"><h2 id="prompty">Sedem krokov s Oliverom a vlastným zamestnancom</h2>${promptArticles}</section>
<section aria-labelledby="priklady"><h2 id="priklady">Vyberte jednu fiktívnu vetvu</h2><nav class="link-list" aria-label="Fiktívne príklady">${branchLinks}</nav>${branches}<h3>Použitie vlastných vstupov</h3>${renderMarkdown(ownInputs, 'vlastne')}</section>
<section aria-labelledby="vysledok"><h2 id="vysledok">Čo si odnášate</h2>${renderMarkdown(outcome, 'vysledok')}<p>Živý stav práce udržiavajte na pracovnej tabuli company-os.</p></section></main><footer>Odvodený účastnícky pohľad. Zmeny promptov a príkladov patria do kanonických podkladov a obnovujú sa exportom.</footer></body></html>\n`;
}

export function renderExamplesMarkdown(content) {
  const combinations = content.branches.map(branch => `### ${branch.title}\n\n${[0, 1].map(index => `#### Demo ${index ? 'B' : 'A'} s kontextom\n\n\`\`\`text\n${demoPayload(branch, index)}\`\`\`\n`).join('\n')}`).join('\n');
  return content.documents[workshopFiles[1]] + '\n## Pripravené demo bloky na kopírovanie\n\nNasledujúce bloky sú odvodený pohľad na príklady vyššie. Pri P4 použite A, pri P6 B. Skopírujte celý blok vrátane označenia fiktívnosti a kontextu. Originálne vstupy vyššie ostávajú nezmenené. Ručne môžete zostaviť rovnaký text: označenie fiktívnosti a izolácie, demo kontext zvolenej vetvy, potom presný vstup A/B.\n\n' + combinations;
}

// Public note metadata belongs to the generated view, never to the private source.
// Dates identify this reviewed content revision; update them with its next explicit export.
export function renderWorkshopNote(markdown, sourceId, sibling, siblingLabel) {
  const metadata = `---\ntype: note\nstatus: draft\ncreated: 2026-10-13\nupdated: 2026-10-13\nowner: "neurčený"\nsource: "Účastnícky export company-os: ${sourceId}; provenance v ../workshop-component-manifest.json"\nai-generated: true\ntags: [workshop, "🤖"]\n---\n\n`;
  const links = `\n\n> **Súvisí s:** [${siblingLabel}](${sibling}) · [Workshopový portál](index.html)\n`;
  return metadata + markdown.replace(/^(# [^\n]+)\n/m, '$1' + links);
}

export async function buildArtifacts(content) {
  content ??= await loadSnapshots();
  const files = {
    'Workshop/pracovny-list-a-prompty.md': renderWorkshopNote(content.documents[workshopFiles[0]], workshopFiles[0], workshopFiles[1], 'Ukážkové vstupy'),
    'Workshop/ukazkove-vstupy.md': renderWorkshopNote(renderExamplesMarkdown(content), workshopFiles[1], workshopFiles[0], 'Pracovný list a prompty'),
    'Workshop/index.html': renderPortal(content),
    'Workshop/assets/portal.js': await readFile(join(repositoryRoot, 'scripts/workshop-assets/portal.js'), 'utf8'),
    'Workshop/assets/portal.css': await readFile(join(repositoryRoot, 'scripts/workshop-assets/portal.css'), 'utf8'),
    'Začnite tu.fragment.md': await readFile(join(repositoryRoot, 'templates/zacnite-tu-workshop.md'), 'utf8'),
  };
  files['workshop-component-manifest.json'] = JSON.stringify({ schema: 1, component: 'company-os-workshop-content', sourceProvenance: content.provenance, ownership: 'generated', scope: 'participant-content-only', files: Object.entries(files).map(([path, bytes]) => ({ path, sha256: sha256(Buffer.from(bytes)), ownership: 'generated' })) }, null, 2) + '\n';
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.length !== 3) {
    console.error('Usage: node scripts/build-workshop.mjs <new-or-empty-output-directory>');
    process.exit(1);
  }
  const files = await buildArtifacts();
  await writeFreshDirectory(process.argv[2], files);
  console.log(`PASS: built participant content (${Object.keys(files).length} files), 7 prompts, 3 branches, 6 demo inputs. Core installation/manual: NOT IMPLEMENTED by this component.`);
}
