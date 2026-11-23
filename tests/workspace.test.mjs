import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build, zip} from '../scripts/build-workspace.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'workspace');
async function walk(dir, prefix = '') {
  const out = [];
  for (const e of await fs.readdir(dir, {withFileTypes: true})) {
    const name = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...await walk(path.join(dir, e.name), name)); else out.push(name.normalize('NFC'));
  }
  return out;
}

test('workspace models are valid, registered and model.js copies are exact', async () => {
  const result = await build({check: true});
  assert.equal(result.status, 'PASS');
  assert.equal(result.writes, 0);
  assert.deepEqual(result.processes, ['system-nastavenie', 'system-tvorba-postupu', 'system-tvorba-zamestnanca']);
});

test('root stays small: six files and five folders', async () => {
  const entries = (await fs.readdir(root, {withFileTypes: true})).filter(e => e.name !== '.DS_Store');
  assert.equal(entries.filter(e => e.isFile()).length, 6);
  assert.equal(entries.filter(e => e.isDirectory()).length, 5);
});

test('every note has full metadata and every wiki link resolves from the root', async () => {
  const files = await walk(root), set = new Set(files);
  for (const name of files.filter(f => f.endsWith('.md') && !['AGENTS.md', 'CLAUDE.md'].includes(f))) {
    const text = await fs.readFile(path.join(root, name), 'utf8');
    const head = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(head, `${name}: chýba hlavička`);
    for (const key of ['type', 'status', 'created', 'updated', 'owner', 'source', 'ai-generated', 'tags']) assert.match(head[1], new RegExp(`^${key}: `, 'm'), `${name}: ${key}`);
    for (const [, target] of text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '').matchAll(/\[\[([^\]|#]+)/g)) {
      assert.ok(!target.startsWith('.'), `${name}: relatívny odkaz ${target}`);
      assert.ok(set.has(target.normalize('NFC')), `${name}: odkaz na neexistujúci súbor ${target}`);
    }
  }
});

test('paths the browser loads are ASCII and AGENTS.md carries no setup instructions', async () => {
  const html = await fs.readFile(path.join(root, 'AI OS', 'Manuál.html'), 'utf8');
  for (const [, src] of html.matchAll(/(?:src|href)="([^"]+)"/g)) assert.match(src, /^[\x21-\x7e]+$/);
  const agents = await fs.readFile(path.join(root, 'AGENTS.md'), 'utf8');
  assert.ok(agents.split('\n').length < 60);
  assert.doesNotMatch(agents, /Node|Git\b|checksum|hash|manifest|inštaláci/iu);
});

test('zip marks names as UTF-8', () => {
  const bytes = zip([{name: 'Moja firma/Začnite tu.md', data: Buffer.from('x')}]);
  assert.equal(bytes.readUInt16LE(6) & 0x0800, 0x0800);
  assert.ok(bytes.includes(Buffer.from('Začnite tu.md', 'utf8')));
});
