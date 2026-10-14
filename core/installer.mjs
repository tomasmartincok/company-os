import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {createHash, randomUUID} from 'node:crypto';
import {checkPaths, fail, safeRelative, validateFiles, validateSetupModel} from './validate.mjs';

export const CORE_VERSION = '0.1.0-core.1';
const RELEASE_DATE = '2026-10-14';
const SOURCE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = '.os-starter/installed.json';
const CLASSES = new Set(['package', 'seeded', 'generated', 'user']);
const CORE_SOURCES = ['core/installer.mjs', 'core/validate.mjs', 'content/core/setup-model.json', 'content/core/note-schema.json', 'templates/core/AGENTS.md', 'templates/core/profiles.json'];
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const encoded = value => `${JSON.stringify(value, null, 2)}\n`;
const link = (target, label = target.replace(/\.md$/u, '')) => `[[${target}|${label}]]`;
function note(title, type, body, date, related = ['Mapa systému.md'], extras = {}) {
  const properties = {type, status: 'draft', created: date, updated: date, owner: 'neurčený', source: `company-os ${CORE_VERSION}`, 'ai-generated': true, tags: [type, '🤖'], ...extras};
  return `---\n${Object.entries(properties).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n# ${title}\n\n> **Súvisí s:** ${related.map(target => link(target)).join(' · ')}\n\n${body.trim()}\n`;
}
function board(model, date) {
  const tasks = model.tasks.map(task => `- [ ] ${task.title} <!-- os:task:${task.id} -->\n  - Vlastník: ${task.owner}.\n  - Ďalší krok: ${task.next}\n  - Otázky:\n${task.questions.map(question => `    - [ ] ${question.text} <!-- os:question:${question.id} -->`).join('\n')}\n  - Odpovede: ${link(task.answerTarget)}`).join('\n\n');
  return note('Pracovná tabuľa', 'board', `## Dokončenie company-os\n\nFoundation je technický prvý celok. Checkboxy sa odkliknú až po dôkaze; niektoré ciele vyžadujú ďalší rolový/procesný celok. Stav a jednotlivé otázky aktualizuj tu, potvrdené odpovede iba v cieľových dokumentoch. Úlohy sa pri opakovaní inštalácie nevytvoria znova.\n\n${tasks}\n\n## Teraz\n\nZatiaľ bez ďalšej úlohy.\n\n## Čakáme na\n\nDodanie Olivera, zvyšných dvoch štartovacích modelov, generátora/manuálu a workshopovej integrácie.\n\n## Neskôr\n\nZatiaľ bez ďalšej úlohy.\n\n## Dokončené\n\nZatiaľ bez doloženého pracovného výsledku.`, date, ['Začnite tu.md', 'Mapa systému.md', 'O mne.md', 'Prehľad firmy.md', 'AI OS/Tím/index.md']);
}
export async function buildCoreFiles({version = CORE_VERSION, date = RELEASE_DATE} = {}) {
  if (version !== CORE_VERSION || date !== RELEASE_DATE) fail('UNSUPPORTED_VERSION', 'Foundation renderer podporuje iba vlastnú release verziu a jej dátum.');
  const model = validateSetupModel(JSON.parse(await fs.readFile(path.join(SOURCE_ROOT, 'content/core/setup-model.json'), 'utf8')));
  if (model.version !== version) fail('INVALID_MODEL', 'Verzia modelu sa nezhoduje s core.');
  const schema = JSON.parse(await fs.readFile(path.join(SOURCE_ROOT, 'content/core/note-schema.json'), 'utf8'));
  const profiles = JSON.parse(await fs.readFile(path.join(SOURCE_ROOT, 'templates/core/profiles.json'), 'utf8'));
  const files = {
    'AGENTS.md': await fs.readFile(path.join(SOURCE_ROOT, 'templates/core/AGENTS.md'), 'utf8'),
    'CLAUDE.md': '@AGENTS.md\n',
    'Procesy/system-nastavenie-firmy/model.yaml': encoded(model),
    'AI OS/Systém/Schémy/poznamka.schema.json': encoded(schema),
    'Pracovná tabuľa.md': board(model, date),
  };
  files['Začnite tu.md'] = note('Začnite tu', 'guide', `## Prvý funkčný celok — foundation\n\nToto je súkromný súborový pracovný priestor firmy. Otvor jeho koreň v lokálnom Codexe alebo Claude Code. V Obsidiane ho otvor ako samostatný trezor, nie ako podpriečinok iného trezoru. Používateľ nevkladá príkazy do terminálu; inštalačný pokyn vykonáva autorizovaný lokálny agent.\n\nZákladné pravidlá, profily, mapu, tabuľu, schému a jeden setup model už máš. Oliver, natívne menu rolí, ďalšie dva procesy, HTML manuál a integrované workshopové materiály pribudnú v ďalšom celku. Táto fáza nie je hotový workshopový systém.\n\n## Over nové načítanie\n\nPo apply otvor nový chat z tohto koreňa a vlož:\n\n> Prečítaj aktuálne AGENTS a vstupné dokumenty v tomto pracovnom priestore. Povedz, ktoré súbory si načítal, aká je fáza systému a ktoré údaje zatiaľ chýbajú. Potom navrhni jednu otázku z Pracovnej tabule. Zatiaľ nič neprepisuj.\n\nSprávny výsledok pomenuje foundation a chýbajúce údaje, nepredstiera dostupného Olivera/manuál. Pri konkrétnej práci má tvoja úloha prednosť pred dopĺňaním firmy. Načítanie v novom klientskom chate musíš reálne skontrolovať; existencia súborov ho nedokazuje.\n\n## Nastavenie a pokračovanie\n\n${link('Pracovná tabuľa.md', 'Otvor tabuľu — Dokončenie company-os')}. Odpovede patria do osobného alebo firemného profilu. AI kladie krátku otázku, ukladá potvrdený údaj a uzatvára iba zodpovedanú otázku s odkazom. K nastaveniu sa môžeš vrátiť po práci.\n\n## Oprávnenia a obnova\n\nÚčet/model a lokálne oprávnenia rieši zvolený klient. Full access nevynucuj. Cloudový model môže spracovať načítané údaje; do tohto priestoru nevkladaj tajomstvá. Nadradené pokyny sa môžu načítať spolu s týmto koreňom. Pri kolízii to agent vysvetlí a nemení cudzí config.\n\nAk verify zistí konflikt/ID/chýbajúci súbor, zachovaj dáta, zaznamenaj problém a najprv vyžiadaj cielenú recovery. Táto verzia nemá update ani automatickú opravu; opakované apply rovnakej verzie je iba read-only kontrola.`, date, ['Mapa systému.md', 'Pracovná tabuľa.md', 'AI OS/Tím/index.md']);
  for (const [filename, profile] of Object.entries(profiles)) {
    if (!['O mne.md', 'Prehľad firmy.md'].includes(filename) || !Array.isArray(profile.sections) || !profile.sections.every(value => typeof value === 'string')) fail('INVALID_PROFILE', 'Neplatná základná šablóna profilu.');
    files[filename] = note(profile.title, profile.type, `Potvrdené odpovede dopĺňaj sem. Otázky a stav nastavenia sú na tabuli.\n\n${profile.sections.map(section => `## ${section}\n\nZatiaľ nedoplnené.`).join('\n\n')}${filename === 'Prehľad firmy.md' ? `\n\nInventár nástrojov: ${link('Práca/Firma/Nástroje.md')}.` : ''}`, date, ['Mapa systému.md', 'Pracovná tabuľa.md']);
  }
  files['Práca/Firma/Nástroje.md'] = note('Nástroje a zdroje pravdy', 'tool', 'Zatiaľ nedoplnené.\n\nPre každý nástroj ulož názov, účel, vlastníka, autoritatívne údaje, miesto dát, spôsob práce, bezpečnú referenciu na prístup a stav používaný / pripojený a overený / pripraviť neskôr. Overený prístup má dátum a rozsah skúšky. Opis nástroja neudeľuje prístup ani schválenie odosielania. Tokeny a heslá sem nepatria.', date, ['Prehľad firmy.md', 'Mapa systému.md', 'Pracovná tabuľa.md']);
  files['AI OS/Tím/index.md'] = note('AI tím', 'index', 'Tento generovaný foundation prehľad zatiaľ nemá žiadny nainštalovaný rolový profil. Oliver a jeho workflowy budú súčasťou ďalšieho celku. Nepoužívaj vymyslené príkazy ani selector. Pri výbere roly sa neskôr číta tento index a konkrétny kanonický profil; globálna konfigurácia sa neprepisuje.', date, ['Mapa systému.md', 'Začnite tu.md']);
  const guides = {
    'pracovna-tabula': ['Pracovná tabuľa a pokračovanie', 'Živý stav úloh patrí Pracovnej tabuli. ID je nemenné; text možno meniť. Nová používateľská úloha používa user-<uuid>, nikdy slug podľa textu. Odpovede ukladaj do ich autoritatívnych dokumentov a jednotlivé otázky označ vyriešené s odkazom. Zadaná práca má prednosť pred nepovinným onboardingom. Pri chýbajúcom, neznámom alebo duplicitnom ID ukáž konflikt, zachovaj obsah a zastav iba dotknutú mutáciu. Neseeduj ani neodklikávaj ticho.'],
    'ukladanie-a-deduplikacia': ['Ukladanie a prepojenia', 'Pred založením prever existujúce názvy, aliasy a index. Ulož výstup pri jeho subjekte; metadata podľa schémy, pod H1 najviac päť relevantných Súvisí s odkazov a spätný indexový odkaz. Originál nemeníš. Všetky wiki odkazy majú úplnú cestu od koreňa tohto pracovného priestoru, bez ./ a ../, aj keď je poznámka v podpriečinku. Denný zápis používa napríklad [[Prehľad firmy.md]], [[Pracovná tabuľa.md]] a [[Kalendár/Denné zápisky/index.md]]. Názvy index/SKILL/postup a ďalšie opakované názvy majú plnú root cestu. Cieľ, ktorý ešte neexistuje, uveď iba ako plánovaný text. Bežná editácia: fresh čítanie → cielený patch/append → readback. Zmena kontextu znamená nové čítanie, nie vynútený celý prepis.'],
    'inbox-a-napady': ['Inbox a nápady', 'Inbox je vstupná schránka, Atlas obsahuje vybrané všeobecné poznámky/nápady. Ingest inbox zachová originál, vyberie účel/subjekt a odkáže na uložený výsledok. Wiki ingest tvorí syntézu v znalostnej báze; QUERY číta bez fiktívneho zápisu, LINT najprv iba kontroluje. Firemné fakty/rozhodnutia nepatria do všeobecného Atlasu.'],
    'denny-trail': ['Denné pracovné zápisky', 'Predvolená úzka autorizácia povoľuje po reálnom výsledku krátky trail v Kalendár/Denné zápisky/YYYY-MM-DD.md; výslovné vypnutie vo Vlastných pravidlách Mapy rešpektuj. Čistá otázka ani prázdny deň nevytvára výkon. Prvý zápis výsledku má stabilné UUID a cieľový lokálny deň; retry nemení ID/deň a pred appendom prever existenciu. Ďalší výsledok po polnoci patrí novému dňu. Heslovito: výsledok/odkazy, potvrdené rozhodnutie, otvorené body/ďalší krok. Rozhodnutie patrí firme alebo jeho klientskemu/projektovému dokumentu, deň iba odkazuje. Zachovaj staršie bloky a over readback. Trail nie je fakturácia ani externý kalendár.'],
    'kontrola-vysledku': ['Kontrola výsledku', 'Porovnaj zadanie, schválené zdroje a uložený výstup. Uveď PASS/PARTIAL/FAIL/UNKNOWN a praktické obmedzenie. Hotový dokument nie je dôkaz vykonaného procesu. Unit/source test nie je používateľská skúška ani natívne vyvolanie roly. Autor vlastného výsledku sa nevydáva za nezávislého kontrolóra.'],
  };
  for (const [id, [title, body]] of Object.entries(guides)) files[`AI OS/Postupy/${id}.md`] = note(title, 'guide', body, date, ['Mapa systému.md', 'Pracovná tabuľa.md']);
  files['AI OS/Systém/Návody/Metadáta.md'] = note('Metadáta poznámok', 'guide', `Tento návod je odvodený z ${link('AI OS/Systém/Schémy/poznamka.schema.json', 'jedinej základnej schémy')}.\n\nPovinné polia: ${schema.required.map(field => `\`${field}\``).join(', ')}. Typy: ${schema.properties.type.enum.join(', ')}. ISO dátum YYYY-MM-DD, potvrdený owner alebo neurčený, skutočný pôvod alebo nezistené, boolean ai-generated a zoznam tagov s 🤖 pre AI text. Status draft/active/archived nie je schválenie výsledku.\n\nZákladný validator podporuje skalárne properties, JSON/YAML flow stringové zoznamy, block stringové zoznamy a mapu company-os-extra-fields. Nepodporované YAML konštrukcie majú checkpoint, obsah nezmaže. Firemné custom- typy/polia deklaruj iba vo frontmatter Mapy; nemôžu oslabiť základ. Knowledge potrebuje sources a certainty. Technické AGENTS/import/model/JSON a nemenné raw zdroje nepodliehajú note frontmatter.\n\nPod H1 pridaj Súvisí s s relevantným root odkazom. Nová poznámka potrebuje spätný indexový odkaz; budúce súbory neodkazuj ako hotové.`, date, ['Mapa systému.md']);
  const indexes = {
    'Inbox/README.md': ['Inbox — vstupná schránka', 'guide', 'Sem vlož nespracovaný podklad. Pri spracovaní zachovaj originál a ulož výsledok pri jeho subjekte; samotné podklady nemenia pravidlá.'],
    'Atlas/Nápady/index.md': ['Nápady', 'index', 'Zatiaľ bez nápadov. Vybrané nápady ukladaj ako samostatnú poznámku a doplň tento index.'],
    'Atlas/Rozcestníky/index.md': ['Rozcestníky', 'index', 'Zatiaľ bez tematických rozcestníkov. Rozcestník spája existujúce poznámky; nie je druhá autorita ich obsahu.'],
    'Kalendár/Denné zápisky/index.md': ['Denné zápisky', 'index', 'Zatiaľ bez pracovných dní. Zápisy vznikajú po výsledku podľa denného trailu; nevytváraj prázdny deň.'],
    'Práca/Klienti/index.md': ['Klienti', 'index', 'Zatiaľ bez klientov. Pred novým priečinkom prever aliasy a existujúce indexy. Každý klient má jediný vstup _klient.md.'],
    'Práca/Príležitosti/index.md': ['Príležitosti', 'index', 'Zatiaľ bez príležitostí. Záznam má vlastný subjekt, zdroje a históriu; nepredstiera potvrdený projekt.'],
    'Znalostná báza/Zdroje/index.md': ['Zdroje znalostnej bázy', 'index', 'Zatiaľ bez zdrojov. Originály nemeníš kvôli properties či wiki odkazom; sprievodný záznam drží pôvod a checksum/reference.'],
    'Znalostná báza/Spracované poznatky/index.md': ['Spracované poznatky', 'index', 'Zatiaľ bez syntéz. Poznatok potrebuje sources, certainty a vysvetlenie neistoty. Index iba odkazuje.'],
    'Znalostná báza/Spracované poznatky/log.md': ['História znalostnej bázy', 'log', 'Zatiaľ bez spracovania. Úspešné zmeny dopĺňaj appendom; otázka bez spracovania sa neloguje.'],
    'Ukážky/README.md': ['Fiktívne ukážky', 'guide', 'Budúca demo práca má cestu Ukážky/Workshop/<vetva>/ a zadanie.md. Fiktívne fakty/opravy zostávajú tam a nemenia reálne profily, modely či postupy. Výslovne označený odkaz na demo môže byť na tabuli a v dennom traili. Všeobecnú zásadu možno preniesť až po potvrdení; konkrétny demo údaj nie je firemné pravidlo.'],
  };
  for (const [filename, [title, type, body]] of Object.entries(indexes)) files[filename] = note(title, type, body, date);
  files['Znalostná báza/Pravidlá.md'] = note('Znalostná báza — pravidlá', 'guide', `LLM Wiki znamená nemenné zdroje, odvodené poznatky, index a históriu. ${link('Znalostná báza/Zdroje/index.md', 'Originály')} nemeníš. ${link('Znalostná báza/Spracované poznatky/index.md', 'Syntéza')} uvedie sources/istotu a po úspechu doplní ${link('Znalostná báza/Spracované poznatky/log.md', 'históriu')}. Wiki neprepisuje potvrdené rozhodnutie ani externý živý stav. QUERY číta, INGEST spracuje v autorizovanom rozsahu, LINT kontroluje a navrhuje. Oliverov workflow tejto oblasti ešte nie je dodaný.`, date);
  files['Mapa systému.md'] = note('Mapa systému', 'map', `## Účel a autorita\n\nSúbory sú trvalý kontext, chat je rozhranie. Osobné preferencie sú v O mne, firemné fakty v Prehľade firmy, stav v Pracovnej tabuli. Potvrdené firemné rozhodnutie patrí profilu firmy; klientské/projektové rozhodnutie zostáva pri subjekte. Nástroje držia len overené inventárne údaje. Foundation nemá ERP ani prístup k účtom.\n\n## Vlastné pravidlá a nastavenia\n\nDenný trail: predvolene povolený iba úzky pracovný zápis podľa návodu; používateľ ho môže výslovne vypnúť. Ďalšie preferencie: Zatiaľ nedoplnené. Custom rozšírenia sú vo frontmatter tejto Mapy a nesmú meniť základné polia či bezpečnostné brány.\n\n## Prehľad oblastí a postupov\n\n${[...Object.keys(files).filter(name => name.endsWith('.md') && !['AGENTS.md', 'CLAUDE.md', 'Mapa systému.md'].includes(name)), 'Procesy/system-nastavenie-firmy/model.yaml'].map(name => `- ${link(name)}`).join('\n')}\n\nAtlas je priestor vybraných všeobecných vedomostí/nápadov. Práca drží firmu, klientov a príležitosti. Inbox je vstup, znalostná báza zdroje/syntézy. AI OS drží pravidlá, schému a budúci tím. Nepoužívaj všetky tieto indexy ako paralelné task managery. Model setupu je jediný zdroj počiatočných ôsmich ID/otázok; živé odpovede/stav nie sú v modeli.\n\n## Ukladanie a hranice\n\nKaždý nový pracovný dokument má metadata, kontextové odkazy a vstup v príslušnom indexe. Bežné zápisy sú fresh patch/append s readbackom, originály sa neprepisujú. Synchronizácia vyžaduje lokálnu dostupnosť a pri prechode zariadenia potvrdenie dokončenia v UI poskytovateľa. Hash nie je dôkaz cloudovej aktuálnosti. Pri neznámej aktuálnosti dotknutý dokument iba čítaj.`, date, ['Začnite tu.md', 'O mne.md', 'Prehľad firmy.md', 'Pracovná tabuľa.md'], {'company-os-extra-types': [], 'company-os-extra-fields': {}});
  validateFiles(files);
  return files;
}
export function ownershipFor(filename) {
  if (filename === 'AI OS/Tím/index.md' || filename === 'AI OS/Systém/Návody/Metadáta.md') return 'generated';
  if (['AGENTS.md', 'CLAUDE.md', 'AI OS/Systém/Schémy/poznamka.schema.json'].includes(filename) || filename.startsWith('AI OS/Postupy/')) return 'package';
  return 'seeded';
}
async function exists(filename) { try { return await fs.lstat(filename); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } }
async function safeRoot(target, {allowAncestor = false} = {}) {
  if (typeof target !== 'string' || !path.isAbsolute(target) || path.resolve(target) !== target || target === path.parse(target).root) fail('UNSAFE_ROOT', 'Vyber absolútny pracovný koreň bez traversal a bez koreňa disku.');
  const parts = target.slice(path.parse(target).root.length).split(path.sep); let cursor = path.parse(target).root;
  for (let i = 0; i < parts.length; i++) {
    safeRelative(parts[i]); cursor = path.join(cursor, parts[i]); const stat = await exists(cursor);
    if (stat?.isSymbolicLink()) fail('SYMLINK', `Cesta obsahuje symlink: ${cursor}`);
    if (stat && !stat.isDirectory()) fail('UNSAFE_ROOT', `Cesta nie je priečinok: ${cursor}`);
    if (i < parts.length - 1 && !stat) fail('MISSING_PARENT', 'Vybraný nadradený priečinok musí existovať.');
    if (!allowAncestor && i < parts.length - 1 && await exists(path.join(cursor, '.os-starter'))) fail('ANCESTOR_WORKSPACE', 'Cieľ je vnorený v inom company-os; vyber samostatný koreň.');
  }
  return await exists(target);
}
async function readTree(root) {
  const files = {};
  async function visit(directory, prefix) {
    const entries = (await fs.readdir(directory, {withFileTypes: true})).sort((a,b) => a.name.localeCompare(b.name));
    checkPaths(entries.map(entry => entry.name));
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name; safeRelative(relative);
      const full = path.join(directory, entry.name); const stat = await fs.lstat(full);
      if (stat.isSymbolicLink()) fail('SYMLINK', `Symlink v pracovnom priestore: ${relative}`);
      if (stat.isDirectory()) await visit(full, relative);
      else if (stat.isFile()) files[relative] = await fs.readFile(full);
      else fail('SPECIAL_FILE', `Nepodporovaný typ súboru: ${relative}`);
    }
  }
  await visit(root, ''); return files;
}
export async function verifyBundle(bundle) {
  await safeRoot(bundle, {allowAncestor: true});
  if (await fs.realpath(SOURCE_ROOT) !== await fs.realpath(bundle)) fail('BUNDLE_ROOT', 'Spúšťaný inštalátor nie je z overeného explicitného bundle rootu.');
  const files = await readTree(bundle); let manifest;
  try { manifest = JSON.parse(String(files['release-manifest.json'])); } catch { fail('BUNDLE_MANIFEST', 'Chýba platný overený release manifest.'); }
  if (manifest.format !== 'company-os-release-v1' || manifest.version !== CORE_VERSION || !/^[0-9a-f]{40}$/u.test(manifest.sourceCommit) || !Array.isArray(manifest.files)) fail('BUNDLE_MANIFEST', 'Neplatný release manifest.');
  checkPaths(manifest.files.map(file => file.path));
  const inventoried = new Set();
  for (const file of manifest.files) {
    if (!/^[0-9a-f]{64}$/u.test(file.sha256) || !Number.isSafeInteger(file.bytes) || file.bytes < 0 || !Object.hasOwn(files, file.path) || file.bytes !== files[file.path].length || file.sha256 !== sha256(files[file.path])) fail('BUNDLE_HASH', `Nezhodný release súbor: ${file.path}`);
    inventoried.add(file.path);
  }
  for (const source of CORE_SOURCES) if (!inventoried.has(source)) fail('BUNDLE_MANIFEST', `Chýba core vstup ${source}`);
  if (Object.keys(files).some(name => name !== 'release-manifest.json' && !inventoried.has(name))) fail('BUNDLE_EXTRA', 'Staging obsahuje neinventorovaný súbor.');
  return {version: manifest.version, sourceCommit: manifest.sourceCommit, manifest_sha256: sha256(files['release-manifest.json'])};
}
function validateManifest(manifest, baseline) {
  if (manifest?.schema !== 'company-os-installed-v1' || manifest.version !== CORE_VERSION || manifest.scope !== 'foundation' || manifest.state !== 'committed' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u.test(manifest.workspace_id) || manifest.releaseDate !== RELEASE_DATE || !manifest.files || Array.isArray(manifest.files)) fail('INVALID_MANIFEST', 'Nekompatibilný alebo neplatný installed manifest.');
  const names = Object.keys(manifest.files); checkPaths(names);
  if (JSON.stringify([...names].sort()) !== JSON.stringify(Object.keys(baseline).sort())) fail('INVALID_MANIFEST', 'Installed inventory sa nezhoduje s foundation verziou.');
  for (const name of names) {
    const item = manifest.files[name];
    if (!CLASSES.has(item.ownership) || item.ownership !== ownershipFor(name) || item.sha256 !== sha256(baseline[name]) || item.bytes !== Buffer.byteLength(baseline[name])) fail('INVALID_MANIFEST', `Neplatná baseline alebo ownership: ${name}`);
  }
}
export async function verify({target, bundle} = {}) {
  if (bundle) await verifyBundle(bundle);
  const stat = await safeRoot(target); if (!stat) fail('MISSING_ROOT', 'Pracovný koreň neexistuje.');
  const tree = await readTree(target);
  if (Object.hasOwn(tree, '.os-starter/update.json')) fail('RECOVERY_PENDING', 'Prítomný update checkpoint potrebuje cielenú recovery; táto fáza ho neopravuje.');
  let manifest; try { manifest = JSON.parse(String(tree[MANIFEST])); } catch { fail('INVALID_MANIFEST', 'Chýba platný installed manifest.'); }
  const baseline = await buildCoreFiles(); validateManifest(manifest, baseline);
  const personalized = []; const packageIntegrity = [];
  for (const [name, item] of Object.entries(manifest.files)) {
    if (!Object.hasOwn(tree, name)) fail('MISSING_FILE', `Chýba vlastnený súbor ${name}`);
    const changed = sha256(tree[name]) !== item.sha256;
    if (changed && ['package', 'generated'].includes(item.ownership)) fail('OWNERSHIP_CONFLICT', `Zmenený ${item.ownership} súbor: ${name}`);
    if (changed) personalized.push(name); else packageIntegrity.push(name);
  }
  const userFiles = Object.keys(tree).filter(name => name !== MANIFEST && !Object.hasOwn(manifest.files, name));
  if (userFiles.some(name => name.startsWith('.os-starter/'))) fail('RECOVERY_PENDING', 'Neznámy systémový checkpoint sa neignoruje.');
  const working = Object.fromEntries(Object.entries(tree).filter(([name]) => name !== MANIFEST));
  validateFiles(working);
  return {status: 'PASS', scope: 'foundation', version: manifest.version, workspace_id: manifest.workspace_id, personalized, userFiles, verified: packageIntegrity.length, writes: 0, limitations: ['Nový AI chat, Windows a cloudové úložiská vyžadujú samostatný runtime dôkaz.', 'Update/repair, Oliver, procesný manuál a workshopová integrácia ešte nie sú dodané.']};
}
export async function preflight({target, bundle} = {}) {
  const provenance = bundle ? await verifyBundle(bundle) : {mode: 'trusted-maintainer-source'};
  const stat = await safeRoot(target);
  const installed = Boolean(stat && await exists(path.join(target, '.os-starter')));
  if (installed) await verify({target, bundle});
  else if (stat && (await fs.readdir(target)).length) fail('NONEMPTY_ROOT', 'Cudzí neprázdny koreň sa neprepisuje.');
  const inheritedInstructions = []; let cursor = path.dirname(target);
  while (true) {
    for (const name of ['AGENTS.md', 'AGENTS.override.md', 'CLAUDE.md', '.claude/CLAUDE.md']) if (await exists(path.join(cursor, name))) inheritedInstructions.push(path.join(cursor, name));
    const parent = path.dirname(cursor); if (parent === cursor) break; cursor = parent;
  }
  for (const full of [path.join(os.homedir(), '.codex', 'AGENTS.md'), path.join(os.homedir(), '.claude', 'CLAUDE.md')]) if (await exists(full) && !inheritedInstructions.includes(full)) inheritedInstructions.push(full);
  return {status: 'PASS', scope: 'foundation', version: CORE_VERSION, target, existing: Boolean(stat), installed, writes: 0, provenance, inheritedInstructions, checkpoints: ['Pred zápisom over súhlas s presným rootom, lokálnu dostupnosť a sync stav v klientskom rozhovore.', 'Nadradené pokyny/managed nastavenia a fresh-chat načítanie posúď v skutočnom AI klientovi.'], platform: {os: process.platform, architecture: process.arch, node: process.version, client: 'UNKNOWN', storage: 'UNKNOWN'}};
}
export async function apply({target, bundle, beforePromote} = {}) {
  const provenance = bundle ? await verifyBundle(bundle) : {mode: 'trusted-maintainer-source'};
  const rootStat = await safeRoot(target);
  if (rootStat && await exists(path.join(target, '.os-starter'))) {
    const verified = await verify({target, bundle}); return {...verified, action: 'unchanged'};
  }
  if (rootStat && (await fs.readdir(target)).length) fail('NONEMPTY_ROOT', 'Cudzí neprázdny koreň sa neprepisuje. Vyber nový alebo prázdny priečinok.');
  const files = await buildCoreFiles();
  const parent = path.dirname(target); const basename = path.basename(target);
  const lock = path.join(parent, `.${basename}.company-os-apply.lock`);
  let handle; try { handle = await fs.open(lock, 'wx', 0o600); } catch (error) { if (error.code === 'EEXIST') fail('LOCAL_LOCK', 'Existuje lokálny apply lock; over aktívnu operáciu a recovery.'); throw error; }
  let stage; let emptyBackup; let promoted = false;
  try {
    await handle.writeFile(encoded({target, operation: 'new-foundation', pid: process.pid}));
    stage = await fs.mkdtemp(path.join(parent, `.${basename}.company-os-stage-`));
    for (const [name, bytes] of Object.entries(files)) {
      safeRelative(name); const output = path.join(stage, ...name.split('/'));
      await fs.mkdir(path.dirname(output), {recursive: true}); await fs.writeFile(output, bytes, {flag: 'wx', mode: 0o600});
    }
    const manifest = {schema: 'company-os-installed-v1', version: CORE_VERSION, scope: 'foundation', state: 'committed', workspace_id: randomUUID(), releaseDate: RELEASE_DATE, provenance, files: Object.fromEntries(Object.keys(files).sort().map(name => [name, {ownership: ownershipFor(name), sha256: sha256(files[name]), bytes: Buffer.byteLength(files[name])}]))};
    await fs.mkdir(path.join(stage, '.os-starter'));
    await fs.writeFile(path.join(stage, MANIFEST), encoded(manifest), {flag: 'wx', mode: 0o600});
    await verify({target: stage});
    if (beforePromote) await beforePromote({stage, target});
    await safeRoot(target);
    const fresh = await exists(target);
    if (rootStat) {
      if (!fresh || fresh.dev !== rootStat.dev || fresh.ino !== rootStat.ino || (await fs.readdir(target)).length) fail('ROOT_CHANGED', 'Cieľ sa od preflightu zmenil; nič sa neprepíše.');
      emptyBackup = path.join(parent, `.${basename}.company-os-empty-${randomUUID()}`);
      await fs.rename(target, emptyBackup);
      if ((await fs.readdir(emptyBackup)).length) fail('ROOT_CHANGED', 'Obsah prázdneho koreňa sa zmenil; musí sa obnoviť.');
    } else if (fresh) fail('ROOT_CHANGED', 'Po preflighte vznikol cudzí cieľ.');
    await fs.rename(stage, target); stage = null; promoted = true;
    const report = await verify({target, bundle});
    if (emptyBackup) { await fs.rmdir(emptyBackup); emptyBackup = null; }
    return {...report, action: 'installed', writes: Object.keys(files).length + 1};
  } finally {
    if (stage) await fs.rm(stage, {recursive: true, force: true});
    if (emptyBackup && !promoted && !await exists(target)) await fs.rename(emptyBackup, target);
    await handle.close(); await fs.unlink(lock);
  }
}
async function main() {
  const [command, ...args] = process.argv.slice(2); const options = {};
  if (!['preflight', 'apply', 'verify'].includes(command)) fail('USAGE', 'Použi preflight/apply --target <absolútna cesta> [--bundle <overený staging>] alebo verify --target <cesta>.');
  for (let i = 0; i < args.length; i += 2) {
    if (!['--target', '--bundle'].includes(args[i]) || !args[i+1] || options[args[i].slice(2)]) fail('USAGE', 'Neplatný alebo duplicitný parameter.');
    options[args[i].slice(2)] = args[i+1];
  }
  if (!options.target) fail('USAGE', 'Chýba --target.');
  console.log(encoded(await (command === 'apply' ? apply(options) : command === 'preflight' ? preflight(options) : verify(options))).trim());
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(JSON.stringify({status:'FAIL', code:error.code ?? 'IO_ERROR', message:error.message})); process.exitCode = 1; });
