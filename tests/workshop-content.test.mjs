import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, mkdir, writeFile, rm, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runInNewContext } from 'node:vm';
import { loadSnapshots, importSources, textBlocks, sanitizeSource, demoPayload, writeFreshDirectory, sha256, repositoryRoot, workshopFiles } from '../scripts/workshop-content.mjs';
import { buildArtifacts, renderMarkdown } from '../scripts/build-workshop.mjs';

const decodeHtml = value => value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const content = await loadSnapshots();

test('Snapshot provenance verifies 7 prompts, 3 branches and 6 exact input blocks', () => {
  assert.equal(content.prompts.length, 7);
  assert.equal(content.branches.length, 3);
  assert.equal(content.branches.flatMap(branch => branch.blocks).length, 6);
  for (const record of content.provenance.sources) {
    const source = content.documents[record.logicalSource];
    assert.equal(record.exportedSha256, sha256(Buffer.from(source)));
    assert.deepEqual(textBlocks(source).map(block => sha256(Buffer.from(block))), record.textBlockSha256);
  }
});

test('Maintainer export preserves exact fenced payload while removing private context', () => {
  const prompt = 'Oliver, zachovaj tento vstup.\nDruhý riadok: [moja firma].\n';
  const raw = Buffer.from('---\ntype: note\nowner: Private\n---\n\n# List\n\n> **Súvisí s:** [[Efforts/private]]\n\n```text\n' + prompt + '```\n\n## Dodanie v inštalačnom balíku (interné)\n\nInterné lektorské info.\n');
  const exported = sanitizeSource(raw, workshopFiles[0]);
  assert.equal(textBlocks(exported)[0], prompt);
  assert.doesNotMatch(exported, /owner:|\[\[|Interné|Dodanie v/);
  assert.throws(() => sanitizeSource(Buffer.from('# Unreviewed source\n'), workshopFiles[0]), /boundary missing/);
  assert.throws(() => sanitizeSource(Buffer.from(raw.toString('utf8').replaceAll('\n', '\r\n')), workshopFiles[0]), /LF newlines/);
});

test('Canonical source/export equality (when explicitly supplied by maintainer)', { skip: !process.env.COMPANY_OS_WORKSHOP_SOURCE }, async () => {
  const exported = await importSources(process.env.COMPANY_OS_WORKSHOP_SOURCE);
  assert.deepEqual(exported.documents, content.documents);
  assert.deepEqual(exported.provenance, content.provenance);
});

test('HTML copy payloads contain each exact prompt and isolated context+raw demo input', async () => {
  const files = await buildArtifacts(content);
  const html = files['Workshop/index.html'];
  const blocks = Object.fromEntries([...html.matchAll(/<code id="([^"]+)" tabindex="0">([\s\S]*?)<\/code>/g)].map(([, id, text]) => [id, decodeHtml(text)]));
  assert.equal(Object.keys(blocks).length, 13);
  for (const prompt of content.prompts) assert.equal(blocks[`${prompt.id}-text-1`], prompt.blocks[0]);
  for (const branch of content.branches) {
    for (const index of [0, 1]) {
      const payload = blocks[`${branch.id}-${index ? 'b' : 'a'}`];
      assert.equal(payload, demoPayload(branch, index));
      assert.ok(payload.endsWith(branch.blocks[index]));
      assert.match(payload, /FIKTÍVNA UKÁŽKA/);
      assert.match(payload, /Neprepisuj ním Prehľad firmy\.md ani O mne\.md/);
      assert.match(payload, /Demo kontext:/);
    }
  }
  const examples = files['Workshop/ukazkove-vstupy.md'];
  const generatedBlocks = textBlocks(examples);
  assert.deepEqual(generatedBlocks.slice(0, 6), textBlocks(content.documents[workshopFiles[1]]));
  assert.deepEqual(generatedBlocks.slice(6), content.branches.flatMap(branch => [demoPayload(branch, 0), demoPayload(branch, 1)]));
});

test('Fresh build is deterministic, relative links exist and output contains no private data', async () => {
  const first = await buildArtifacts(content);
  const second = await buildArtifacts(content);
  assert.deepEqual(first, second);
  for (const [filename, bytes] of Object.entries(first)) assert.doesNotMatch(bytes, /\/Users\/|\/private\/|Efforts\/|\[\[|Kontrola lektora|lektorsk[yý]|ERP|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i, filename);
  const html = first['Workshop/index.html'];
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (href.startsWith('#')) assert.ok(html.includes(`id="${href.slice(1)}"`), href);
    else assert.ok(Object.hasOwn(first, `Workshop/${href}`), href);
  }
  for (const [, path] of first['Začnite tu.fragment.md'].matchAll(/\]\(([^)]+)\)/g)) assert.ok(Object.hasOwn(first, path), path);
  assert.doesNotMatch(html, /fetch\(|type="module"|https?:\/\//);
  const temp = await mkdtemp(join(tmpdir(), 'company-os-workshop-test-'));
  try {
    await writeFreshDirectory(join(temp, 'new'), first);
    await mkdir(join(temp, 'empty'));
    await writeFreshDirectory(join(temp, 'empty'), second);
    assert.equal(await readFile(join(temp, 'new', 'Workshop/index.html'), 'utf8'), await readFile(join(temp, 'empty', 'Workshop/index.html'), 'utf8'));
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('Distributed Markdown views have public note metadata and existing reciprocal links', async () => {
  const files = await buildArtifacts(content);
  for (const filename of workshopFiles) {
    const note = files[`Workshop/${filename}`];
    assert.match(note, /^---\ntype: note\nstatus: draft\ncreated: \d{4}-\d{2}-\d{2}\nupdated: \d{4}-\d{2}-\d{2}\nowner: "neurčený"\nsource: "Účastnícky export company-os:/);
    assert.match(note, /\nai-generated: true\ntags: \[workshop, "🤖"\]\n---\n/);
    assert.match(note, /# [^\n]+\n\n> \*\*Súvisí s:\*\*/);
    const sibling = workshopFiles.find(value => value !== filename);
    assert.ok(note.includes(`](${sibling})`));
    for (const [, path] of note.matchAll(/\]\(([^)]+)\)/g)) assert.ok(Object.hasOwn(files, `Workshop/${path}`), path);
  }
});

test('Existing user output/conflict and symlink are refused without changing content', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'company-os-workshop-conflict-'));
  try {
    const user = join(temp, 'user');
    await mkdir(user);
    await writeFile(join(user, 'moje-poznamky.md'), 'Moje zmeny\n');
    await assert.rejects(writeFreshDirectory(user, { 'Workshop/index.html': 'replacement' }), /Refusing non-empty/);
    assert.equal(await readFile(join(user, 'moje-poznamky.md'), 'utf8'), 'Moje zmeny\n');
    assert.deepEqual(await readdir(user), ['moje-poznamky.md']);
    await symlink(user, join(temp, 'alias'), process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(writeFreshDirectory(join(temp, 'alias'), {}), /real new or empty/);
    assert.equal(await readFile(join(user, 'moje-poznamky.md'), 'utf8'), 'Moje zmeny\n');
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('Raw HTML and unsafe URL text are escaped in generated reader', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[link](javascript:alert(1))\n', 'unsafe');
  assert.doesNotMatch(html, /<script|<img|href=/);
  assert.match(html, /&lt;script&gt;/);
});

function copyHarness(clipboard) {
  const source = 'Presný text\nDruhý riadok.\n';
  const status = { textContent: '' };
  const manual = { value: '', hidden: true, focused: false, selected: false, focus() { this.focused = true; }, select() { this.selected = true; } };
  let click;
  const button = { hidden: true, disabled: false, dataset: { copy: 'payload' }, addEventListener(type, callback) { assert.equal(type, 'click'); click = callback; } };
  const elements = { payload: { textContent: source }, 'payload-status': status, 'payload-manual': manual };
  return { source, status, manual, button, run(script) { runInNewContext(script, { document: { querySelectorAll: () => [button], getElementById: id => elements[id] }, navigator: { clipboard } }); return click(); } };
}

test('Copy UI reports success only after clipboard promise resolves', async () => {
  const script = await readFile(join(repositoryRoot, 'scripts/workshop-assets/portal.js'), 'utf8');
  let resolve;
  let copied;
  const harness = copyHarness({ writeText(text) { copied = text; return new Promise(done => { resolve = done; }); } });
  const pending = harness.run(script);
  assert.equal(harness.status.textContent, 'Kopírujem…');
  assert.equal(harness.button.disabled, true);
  resolve();
  await pending;
  assert.equal(copied, harness.source);
  assert.match(harness.status.textContent, /^Skopírované/);
  assert.equal(harness.button.disabled, false);
  assert.equal(harness.manual.hidden, true);
});

test('Copy permission failure or unavailable clipboard selects exact text and never claims success', async () => {
  const script = await readFile(join(repositoryRoot, 'scripts/workshop-assets/portal.js'), 'utf8');
  for (const clipboard of [undefined, { async writeText() { throw new Error('denied'); } }]) {
    const harness = copyHarness(clipboard);
    await harness.run(script);
    assert.equal(harness.manual.value, harness.source);
    assert.equal(harness.manual.hidden, false);
    assert.equal(harness.manual.focused, true);
    assert.equal(harness.manual.selected, true);
    assert.match(harness.status.textContent, /Ctrl\+C \/ Cmd\+C/);
    assert.doesNotMatch(harness.status.textContent, /Skopírované/);
    assert.equal(harness.button.disabled, false);
  }
});
