// Nástroj správcu: overí modely postupov v workspace/, obnoví ich kópie model.js a zostaví ZIP pre účastníkov.
// Účastník Node nepotrebuje; stiahne hotový ZIP.
//   node scripts/build-workspace.mjs           obnoví model.js a zostaví outputs/company-os.zip
//   node scripts/build-workspace.mjs --check   iba overí, nič nezapíše
import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(repo, 'workspace');
const procs = path.join(root, 'AI OS', 'Postupy');
const TOP = 'Moja firma';
const require = createRequire(import.meta.url);
const jsyaml = require(path.join(procs, '_citacka', 'js-yaml.min.js'));
require(path.join(procs, '_citacka', 'engine.js'));
const fail = message => { throw new Error(message); };

export const wrap = (id, yaml) => `CompanyOS.model("${id}", function () {/*\n${yaml}*/});\n`;

export async function processIds() {
  const entries = await fs.readdir(procs, {withFileTypes: true});
  return entries.filter(e => e.isDirectory() && !e.name.startsWith('_')).map(e => e.name).sort();
}

export async function checkModels({write = false} = {}) {
  const ids = await processIds();
  const register = await fs.readFile(path.join(procs, 'register.js'), 'utf8');
  const listed = [...register.matchAll(/"([a-z][a-z0-9-]*)"/g)].map(m => m[1]);
  if (new Set(listed).size !== listed.length) fail('register.js obsahuje duplicitu.');
  if ([...listed].sort().join() !== ids.join()) fail(`register.js (${listed.join(', ')}) nesedí s priečinkami (${ids.join(', ')}).`);
  for (const id of ids) {
    const yaml = await fs.readFile(path.join(procs, id, 'model.yaml'), 'utf8');
    if (yaml.includes('*/')) fail(`${id}: model obsahuje */.`);
    if (!yaml.endsWith('\n') || yaml.includes('\r')) fail(`${id}: model musí končiť novým riadkom a používať LF.`);
    const model = jsyaml.load(yaml, {schema: jsyaml.CORE_SCHEMA});
    globalThis.ProcessEngine.compile(model);
    if (model.process.id !== id) fail(`${id}: ID v modeli je ${model.process.id}.`);
    const target = path.join(procs, id, 'model.js'), expected = wrap(id, yaml);
    if (write) await fs.writeFile(target, expected);
    else if (await fs.readFile(target, 'utf8').catch(() => null) !== expected) fail(`${id}: model.js nie je presná kópia model.yaml.`);
  }
  return ids;
}

async function tree(dir, prefix = '') {
  const out = [];
  for (const entry of (await fs.readdir(dir, {withFileTypes: true})).sort((a, b) => a.name < b.name ? -1 : 1)) {
    if (entry.name === '.DS_Store') continue;
    const name = (prefix ? prefix + '/' : '') + entry.name.normalize('NFC');
    if (entry.isSymbolicLink()) fail(`Symlink v workspace: ${name}`);
    if (entry.isDirectory()) out.push(...await tree(path.join(dir, entry.name), name));
    else if (entry.isFile()) out.push({name, data: await fs.readFile(path.join(dir, entry.name))});
  }
  return out;
}

/* ZIP s príznakom UTF-8 (bit 11), aby Windows aj macOS zobrazili diakritiku v názvoch správne. */
export function zip(files) {
  const local = [], central = []; let offset = 0;
  const time = 0, date = ((2026 - 1980) << 9) | (11 << 5) | 23;
  for (const {name, data} of files) {
    const fname = Buffer.from(name, 'utf8'), body = zlib.deflateRawSync(data, {level: 9}), crc = zlib.crc32(data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6); head.writeUInt16LE(8, 8);
    head.writeUInt16LE(time, 10); head.writeUInt16LE(date, 12); head.writeUInt32LE(crc, 14);
    head.writeUInt32LE(body.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(fname.length, 26);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(0x0314, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8); cen.writeUInt16LE(8, 10);
    cen.writeUInt16LE(time, 12); cen.writeUInt16LE(date, 14); cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(body.length, 20); cen.writeUInt32LE(data.length, 24); cen.writeUInt16LE(fname.length, 28);
    cen.writeUInt32LE((0o100644 << 16) >>> 0, 38); cen.writeUInt32LE(offset, 42);
    local.push(head, fname, body); central.push(cen, fname);
    offset += 30 + fname.length + body.length;
  }
  const dir = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(dir.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, dir, end]);
}

export async function build({check = false} = {}) {
  const ids = await checkModels({write: !check});
  const files = (await tree(root)).map(f => ({name: `${TOP}/${f.name}`, data: f.data}));
  const keys = new Set();
  for (const f of files) { const k = f.name.toLowerCase(); if (keys.has(k)) fail(`Kolízia názvov: ${f.name}`); keys.add(k); }
  if (check) return {status: 'PASS', processes: ids, files: files.length, writes: 0};
  const out = path.join(repo, 'outputs', 'company-os.zip');
  await fs.mkdir(path.dirname(out), {recursive: true});
  const bytes = zip(files);
  await fs.writeFile(out, bytes);
  return {status: 'PASS', processes: ids, files: files.length, output: out, bytes: bytes.length};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await build({check: process.argv.includes('--check')}), null, 2)); }
  catch (error) { console.error('CHYBA: ' + error.message); process.exitCode = 1; }
}
