import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {apply, buildCoreFiles, CORE_VERSION, ownershipFor, preflight, sha256, verify} from '../core/installer.mjs';
import {parseNote, SETUP_IDS, validateFiles, validateSetupModel} from '../core/validate.mjs';
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = async t => { const root = await fs.mkdtemp(path.join(await fs.realpath(os.tmpdir()), 'company-os-core-test-')); t.after(() => fs.rm(root, {recursive:true,force:true})); return root; };
const read = (target, filename) => fs.readFile(path.join(target, filename), 'utf8');
async function snapshot(root) {
  const files = {}; async function walk(dir, relative = '') {
    for (const entry of await fs.readdir(dir, {withFileTypes:true})) {
      const name = relative ? `${relative}/${entry.name}` : entry.name; const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full, name); else files[name] = sha256(await fs.readFile(full));
    }
  } await walk(root); return files;
}
const rejected = (promise, code) => assert.rejects(promise, error => error.code === code);

test('foundation render is deterministic with truthful stage, all links and a single eight-ID model', async () => {
  const first = await buildCoreFiles(); const second = await buildCoreFiles(); assert.deepEqual(first, second);
  assert.equal(Object.keys(first).length, 28); validateFiles(first);
  assert.ok(Buffer.byteLength(first['AGENTS.md']) <= 8192);
  assert.equal(first['CLAUDE.md'], '@AGENTS.md\n');
  assert.ok(first['Začnite tu.md'].includes('nie je hotový workshopový systém'));
  assert.ok(!Object.keys(first).some(name => name.includes('oliver/') || name.startsWith('Manuál/') || name.startsWith('.agents/')));
  const model = JSON.parse(first['Procesy/system-nastavenie-firmy/model.yaml']);
  assert.deepEqual(model.tasks.map(task => task.id), SETUP_IDS);
  for (const task of model.tasks) { assert.equal(first['Pracovná tabuľa.md'].split(`os:task:${task.id} -->`).length, 2); for (const question of task.questions) assert.ok(first['Pracovná tabuľa.md'].includes(question.text)); }
});

test('two first installs yield identical board bytes and distinct private workspace IDs', async t => {
  const root = await fixture(t); const a = path.join(root, 'Firma A'); const b = path.join(root, 'Firma B č');
  const first = await apply({target:a}); const second = await apply({target:b});
  assert.equal(first.action, 'installed'); assert.equal(first.writes, 29); assert.notEqual(first.workspace_id, second.workspace_id);
  assert.equal(await read(a, 'Pracovná tabuľa.md'), await read(b, 'Pracovná tabuľa.md'));
  const manifest = JSON.parse(await read(a, '.os-starter/installed.json'));
  assert.equal(manifest.scope, 'foundation'); assert.equal(manifest.state, 'committed'); assert.equal(manifest.provenance.mode, 'trusted-maintainer-source');
  for (const [name, entry] of Object.entries(manifest.files)) { assert.equal(entry.sha256, sha256(await fs.readFile(path.join(a,name)))); assert.equal(entry.ownership, ownershipFor(name)); }
  assert.equal((await verify({target:a})).status, 'PASS');
});

test('existing empty root is safely promoted and apply/verify/preflight never reseed personalized state', async t => {
  const root = await fixture(t); const target = path.join(root, 'Moja firma OS'); await fs.mkdir(target);
  await apply({target});
  const profile = (await read(target, 'O mne.md')).replace('Zatiaľ nedoplnené.', 'Eva, potvrdené používateľom.'); await fs.writeFile(path.join(target,'O mne.md'),profile);
  const board = (await read(target, 'Pracovná tabuľa.md')).replace('- [ ] Doplniť a potvrdiť osobný profil', '- [x] Osobný profil mám potvrdený').replace('- [ ] Ako ťa oslovovať?', '- [x] Vyriešené: [[O mne.md|potvrdená odpoveď]]'); await fs.writeFile(path.join(target,'Pracovná tabuľa.md'),board);
  const extra = profile.replace('# O mne', '# Zadanie'); await fs.writeFile(path.join(target,'Práca/Firma/zadanie.md'),extra);
  await fs.appendFile(path.join(target,'Mapa systému.md'), '\n- [[Práca/Firma/zadanie.md|Pracovné zadanie]]\n');
  await fs.appendFile(path.join(target,'Začnite tu.md'), '\nMôj osobný odkaz: [[O mne.md]]\n');
  await fs.appendFile(path.join(target,'Pracovná tabuľa.md'), '\n- [ ] Moja úloha <!-- os:task:user-12345678-1234-4abc-8def-123456789abc -->\n');
  const before = await snapshot(target);
  const again = await apply({target}); assert.equal(again.action,'unchanged'); assert.equal(again.writes,0);
  assert.deepEqual(again.personalized.sort(),['Mapa systému.md','O mne.md','Pracovná tabuľa.md','Začnite tu.md'].sort());
  assert.deepEqual(again.userFiles,['Práca/Firma/zadanie.md']); assert.deepEqual(await snapshot(target),before);
  assert.equal((await verify({target})).writes,0); assert.equal((await preflight({target})).writes,0); assert.deepEqual(await snapshot(target),before);
});

test('nonempty foreign root is refused with all original bytes preserved', async t => {
  const root = await fixture(t); const target = path.join(root,'cudzí'); await fs.mkdir(target); await fs.writeFile(path.join(target,'README.md'),'pôvodný obsah\n');
  const before = await snapshot(root); await rejected(apply({target}),'NONEMPTY_ROOT'); await rejected(preflight({target}),'NONEMPTY_ROOT'); assert.deepEqual(await snapshot(root),before);
});

test('root and nested symlinks are refused without following or deleting their data', async t => {
  const root = await fixture(t); const original = path.join(root,'original'); const alias = path.join(root,'alias'); await fs.mkdir(original);
  try { await fs.symlink(original,alias,'dir'); } catch (error) { if (['EPERM','ENOTSUP'].includes(error.code)) { t.skip('OS permission denies symlink fixture'); return; } throw error; }
  await rejected(apply({target:alias}),'SYMLINK'); assert.deepEqual(await fs.readdir(original),[]);
  const target = path.join(root,'workspace'); await apply({target}); await fs.writeFile(path.join(original,'private.txt'),'preserve'); await fs.symlink(path.join(original,'private.txt'),path.join(target,'shortcut'));
  await rejected(verify({target}),'SYMLINK'); assert.equal(await read(original,'private.txt'),'preserve');
});

test('nested company-os root, traversal, disk root and missing parents refuse before writing', async t => {
  const root = await fixture(t); const target = path.join(root,'parent-os'); await apply({target});
  const before = await snapshot(root); await rejected(apply({target:path.join(target,'Nested OS')}),'ANCESTOR_WORKSPACE');
  await rejected(apply({target:`${root}/../escape`}), 'UNSAFE_ROOT'); await rejected(apply({target:path.parse(root).root}),'UNSAFE_ROOT');
  await rejected(apply({target:path.join(root,'missing','new')}),'MISSING_PARENT'); assert.deepEqual(await snapshot(root),before);
});

test('pre-promotion failure removes only owned staging and restores an untouched empty root', async t => {
  const root = await fixture(t); const target = path.join(root,'empty'); await fs.mkdir(target); const before = await snapshot(root);
  await assert.rejects(apply({target,beforePromote:()=> { throw new Error('fixture failure'); }}),/fixture failure/);
  assert.deepEqual(await snapshot(root),before); assert.deepEqual(await fs.readdir(root),['empty']);
});

test('a root changed after preflight is preserved, not overwritten by completed staging', async t => {
  const root = await fixture(t); const target = path.join(root,'changed');
  await rejected(apply({target,beforePromote:async()=> { await fs.mkdir(target); await fs.writeFile(path.join(target,'foreign.txt'),'fresh user data'); }}),'ROOT_CHANGED');
  assert.deepEqual(await fs.readdir(root),['changed']); assert.equal(await read(target,'foreign.txt'),'fresh user data');
});

test('stale local lock is a checkpoint and remains untouched', async t => {
  const root = await fixture(t); const target = path.join(root,'locked'); const lock = path.join(root,'.locked.company-os-apply.lock'); await fs.writeFile(lock,'active-or-recovery');
  await rejected(apply({target}),'LOCAL_LOCK'); assert.equal(await fs.readFile(lock,'utf8'),'active-or-recovery'); assert.equal(await fs.stat(target).then(()=>true,()=>false),false);
});

test('package tampering is distinct from personalization and no operation silently repairs it', async t => {
  const root = await fixture(t); const target = path.join(root,'changed-package'); await apply({target}); await fs.appendFile(path.join(target,'AGENTS.md'),'\nforeign rule\n'); const before = await snapshot(target);
  await rejected(verify({target}),'OWNERSHIP_CONFLICT'); await rejected(apply({target}),'OWNERSHIP_CONFLICT'); assert.deepEqual(await snapshot(target),before);
});

test('manifest baseline tampering, missing files and foreign recovery checkpoint refuse read-only', async t => {
  const root = await fixture(t); const target = path.join(root,'manifest'); await apply({target}); const original = await read(target,'.os-starter/installed.json'); const manifest = JSON.parse(original); manifest.files['AGENTS.md'].sha256='0'.repeat(64); await fs.writeFile(path.join(target,'.os-starter/installed.json'),JSON.stringify(manifest)); const before = await snapshot(target);
  await rejected(verify({target}),'INVALID_MANIFEST'); assert.deepEqual(await snapshot(target),before);
  await fs.writeFile(path.join(target,'.os-starter/installed.json'),original); await fs.writeFile(path.join(target,'.os-starter/update.json'),'{}'); await rejected(apply({target}),'RECOVERY_PENDING'); await fs.unlink(path.join(target,'.os-starter/update.json'));
  await fs.unlink(path.join(target,'O mne.md')); await rejected(verify({target}),'MISSING_FILE');
});

test('invalid, unknown, duplicate or deleted board IDs surface recovery without reseeding', async t => {
  const root = await fixture(t); const target = path.join(root,'ids'); await apply({target}); const original = await read(target,'Pracovná tabuľa.md');
  const variants = [original.replace('os:task:setup-osoba','os:task:bad id'),original+'\n- [ ] Duplicate <!-- os:task:setup-osoba -->\n',original.replace('os:task:setup-osoba','os:task:setup-unknown'),original+'\n- [ ] Unknown <!-- os:task:moja -->\n',original+'\n- [ ] Bad UUID <!-- os:task:user-12345678 -->\n',original.replace('<!-- os:task:setup-osoba -->',''),original+'\n- [ ] Question <!-- os:question:setup-unknown -->\n'];
  for (const variant of variants) { await fs.writeFile(path.join(target,'Pracovná tabuľa.md'),variant); const before = await snapshot(target); await rejected(apply({target}),'BOARD_ID'); assert.deepEqual(await snapshot(target),before); }
});

test('invalid model duplicate IDs/stage references and dead links are rejected before any render is used', async () => {
  const baseline = await buildCoreFiles(); const model = JSON.parse(baseline['Procesy/system-nastavenie-firmy/model.yaml']);
  const duplicate = structuredClone(model); duplicate.tasks[1].id=duplicate.tasks[0].id; assert.throws(()=>validateSetupModel(duplicate),error=>error.code==='INVALID_MODEL');
  const ref = structuredClone(model); ref.stages[0].tasks=['missing']; assert.throws(()=>validateSetupModel(ref),error=>error.code==='INVALID_MODEL');
  const bad = {...baseline,'O mne.md':baseline['O mne.md']+'\n[[Práca/Klienti/missing/_klient.md]]\n'}; assert.throws(()=>validateFiles(bad),error=>error.code==='DEAD_LINK');
});

test('base note schema rejects invalid dates/unknown fields and permits additive Map custom declarations', async () => {
  const baseline = await buildCoreFiles();
  for (const replacement of ['created: "2026-02-31"','created: "not-a-date"']) assert.throws(()=>validateFiles({...baseline,'O mne.md':baseline['O mne.md'].replace('created: "2026-10-14"',replacement)}),error=>error.code==='METADATA_INVALID');
  assert.throws(()=>validateFiles({...baseline,'O mne.md':baseline['O mne.md'].replace('status: "draft"','status: "draft"\nsecret-field: "unknown"')}),error=>error.code==='METADATA_INVALID');
  const custom = {...baseline}; custom['Mapa systému.md']=custom['Mapa systému.md'].replace('company-os-extra-types: []','company-os-extra-types: ["custom-plan"]').replace('company-os-extra-fields: {}','company-os-extra-fields:\n  custom-rating: number');
  custom['Práca/Firma/plan.md']=baseline['O mne.md'].replace('type: "identity"','type: "custom-plan"\ncustom-rating: 3').replace('# O mne','# Plán'); validateFiles(custom);
  const parsed = parseNote(baseline['O mne.md'].replace('tags: ["identity","🤖"]','tags:\n  - identity\n  - 🤖'),'fixture'); assert.deepEqual(parsed.data.tags,['identity','🤖']);
});

test('portable name collisions, unsafe root-relative links and malformed metadata never trigger rewrites', async () => {
  const baseline = await buildCoreFiles();
  assert.throws(()=>validateFiles({...baseline,'o mne.md':baseline['O mne.md']}),error=>error.code==='PATH_COLLISION');
  assert.throws(()=>validateFiles({...baseline,'O mne.md':baseline['O mne.md']+'\n[[../outside.md]]\n'}),error=>error.code==='UNSAFE_PATH');
  assert.throws(()=>validateFiles({...baseline,'O mne.md':baseline['O mne.md'].replace('status: "draft"','status: "draft"\nstatus: "active"')}),error=>error.code==='METADATA_PARSE');
});

test('real CLI preflight/apply/verify reports version/stage; invalid commands fail without changing target', async t => {
  const root = await fixture(t); const target = path.join(root,'CLI firma č'); const script=path.join(REPO,'core/installer.mjs');
  const run = command => spawnSync(process.execPath,[script,command,'--target',target],{encoding:'utf8'});
  const pre = run('preflight'); assert.equal(pre.status,0,pre.stderr); assert.equal(JSON.parse(pre.stdout).writes,0); assert.deepEqual(await fs.readdir(root),[]);
  const install=run('apply'); assert.equal(install.status,0,install.stderr); assert.equal(JSON.parse(install.stdout).version,CORE_VERSION);
  const before=await snapshot(target); const verified=run('verify'); assert.equal(verified.status,0,verified.stderr); assert.equal(JSON.parse(verified.stdout).scope,'foundation');
  assert.equal(run('repair').status,1); assert.deepEqual(await snapshot(target),before);
});


test('promotion failure after empty-root backup restores the original root and cleans owned staging', async t => {
  const root = await fixture(t); const target = path.join(root,'rename-failure'); await fs.mkdir(target); const originalStat = await fs.stat(target);
  const rename = fs.rename;
  fs.rename = async (from,to) => { if (String(from).includes('.company-os-stage-') && to === target) { const error = new Error('promotion IO fixture'); error.code='EIO'; throw error; } return rename(from,to); };
  try { await assert.rejects(apply({target}), error=>error.code==='EIO'); } finally { fs.rename=rename; }
  assert.deepEqual(await fs.readdir(root),['rename-failure']); assert.deepEqual(await fs.readdir(target),[]); assert.equal((await fs.stat(target)).ino,originalStat.ino);
});
