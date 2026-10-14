import path from 'node:path';

export const SETUP_IDS = ['setup-priestor', 'setup-osoba', 'setup-firma', 'setup-oliver', 'setup-nastroje', 'setup-zamestnanec', 'setup-proces', 'setup-vstupy'];
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const USER_ID = /^user-[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const CUSTOM = /^custom-[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function fail(code, message) { const error = new Error(message); error.code = code; throw error; }
export function safeRelative(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.startsWith('/') || path.posix.normalize(value) !== value) fail('UNSAFE_PATH', `Neplatná relatívna cesta: ${value}`);
  for (const part of value.split('/')) {
    if (!part || part === '.' || part === '..' || /[\x00-\x1f<>:"|?*]/u.test(part) || /[. ]$/u.test(part) || /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/iu.test(part)) fail('UNSAFE_PATH', `Nepodporovaný názov: ${value}`);
  }
  return value;
}
export function checkPaths(paths) {
  const names = new Set();
  for (const name of paths) {
    safeRelative(name);
    const key = name.normalize('NFC').toLowerCase();
    if (names.has(key)) fail('PATH_COLLISION', `Kolízia názvov: ${name}`);
    names.add(key);
  }
}
function nonempty(value, label) { if (typeof value !== 'string' || !value.trim()) fail('INVALID_MODEL', `Chýba ${label}`); }
export function validateSetupModel(model) {
  if (model?.schema !== 'company-os-setup-model-v1' || model.id !== 'system-nastavenie-firmy' || !Array.isArray(model.tasks) || !Array.isArray(model.stages)) fail('INVALID_MODEL', 'Neplatný model nastavenia.');
  nonempty(model.version, 'verzia modelu');
  const ids = new Set(); const questions = new Set();
  for (const task of model.tasks) {
    if (!ID.test(task.id) || ids.has(task.id)) fail('INVALID_MODEL', `Neplatné alebo duplicitné ID úlohy: ${task.id}`);
    ids.add(task.id);
    for (const field of ['title', 'owner', 'next', 'answerTarget']) nonempty(task[field], `${task.id}.${field}`);
    safeRelative(task.answerTarget);
    if (!Array.isArray(task.questions) || !task.questions.length) fail('INVALID_MODEL', `Chýbajú otázky ${task.id}`);
    for (const question of task.questions) {
      if (!ID.test(question.id) || questions.has(question.id)) fail('INVALID_MODEL', `Neplatné alebo duplicitné ID otázky: ${question.id}`);
      questions.add(question.id); nonempty(question.text, `text otázky ${question.id}`);
    }
  }
  if (ids.size !== SETUP_IDS.length || SETUP_IDS.some(id => !ids.has(id))) fail('INVALID_MODEL', 'Model musí obsahovať presne osem stabilných setup ID.');
  if (model.stages.length !== 5) fail('INVALID_MODEL', 'Model musí obsahovať päť etáp.');
  const stageIds = new Set(); const assigned = new Set();
  for (const stage of model.stages) {
    if (!ID.test(stage.id) || stageIds.has(stage.id) || !Array.isArray(stage.tasks) || !stage.tasks.length) fail('INVALID_MODEL', 'Neplatná etapa modelu.');
    stageIds.add(stage.id);
    for (const id of stage.tasks) { if (!ids.has(id) || assigned.has(id)) fail('INVALID_MODEL', `Neplatné priradenie úlohy ${id}`); assigned.add(id); }
  }
  if (assigned.size !== ids.size) fail('INVALID_MODEL', 'Niektorá úloha nemá etapu.');
  return model;
}
function scalar(raw) {
  const value = raw.trim();
  if (/^(?:\[|\{|"|true$|false$|-?\d+(?:\.\d+)?$|null$)/u.test(value)) {
    try { return JSON.parse(value); } catch { fail('METADATA_PARSE', `Nepodporovaná alebo neplatná hodnota metadát: ${value}`); }
  }
  if (value.startsWith("'")) { if (!value.endsWith("'")) fail('METADATA_PARSE', 'Neuzavretý YAML string.'); return value.slice(1, -1).replaceAll("''", "'"); }
  if (!value || /^[&*!>|]/u.test(value)) fail('METADATA_PARSE', 'Nepodporovaná YAML konštrukcia; používaj skaláry, stringové zoznamy a deklarovanú mapu.');
  return value;
}
// A deliberately bounded reader for note properties, not a general YAML/model interpreter.
// JSON scalar/list/map syntax is valid YAML; block string lists and custom field maps are also supported.
export function parseNote(text, filename) {
  const normalized = String(text).replaceAll('\r\n', '\n');
  if (!normalized.startsWith('---\n')) fail('METADATA_MISSING', `${filename}: chýba frontmatter.`);
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) fail('METADATA_PARSE', `${filename}: neuzavretý frontmatter.`);
  const data = {}; let block = null;
  for (const line of normalized.slice(4, end).split('\n')) {
    if (!line.trim() || /^\s*#/u.test(line)) continue;
    const match = /^([a-zA-Z][a-zA-Z0-9_-]*):\s*(.*)$/u.exec(line);
    if (match) {
      const [, key, raw] = match;
      if (Object.hasOwn(data, key)) fail('METADATA_PARSE', `${filename}: duplicitné pole ${key}`);
      if (raw.trim()) { data[key] = scalar(raw); block = null; }
      else { data[key] = key === 'company-os-extra-fields' ? {} : []; block = key; }
      continue;
    }
    const list = /^\s{2}-\s+(.+)$/u.exec(line);
    if (block && list && Array.isArray(data[block])) { data[block].push(scalar(list[1])); continue; }
    const field = /^\s{2}(custom-[a-z0-9-]+):\s*(.+)$/u.exec(line);
    if (block === 'company-os-extra-fields' && field) {
      if (Object.hasOwn(data[block], field[1])) fail('METADATA_PARSE', `${filename}: duplicitné rozšírenie.`);
      data[block][field[1]] = scalar(field[2]); continue;
    }
    fail('METADATA_PARSE', `${filename}: nepodporovaný riadok properties ${line}`);
  }
  return {data, body: normalized.slice(end + 5)};
}
function validDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0,10) === value; }
function stringList(value) { return Array.isArray(value) && value.every(item => typeof item === 'string'); }
export function metadataExtensions(map) {
  const types = map['company-os-extra-types'] ?? []; const fields = map['company-os-extra-fields'] ?? {};
  if (!stringList(types) || types.some(type => !CUSTOM.test(type)) || new Set(types).size !== types.length) fail('METADATA_EXTENSION', 'Neplatné firemné typy.');
  if (!fields || typeof fields !== 'object' || Array.isArray(fields) || Object.entries(fields).some(([key, type]) => !CUSTOM.test(key) || !['string', 'boolean', 'number', 'date', 'string-list'].includes(type))) fail('METADATA_EXTENSION', 'Neplatné firemné polia.');
  return {types, fields};
}
export function validateMetadata(data, schema, extensions, filename) {
  if (!schema || schema.$id !== 'company-os-note-v1' || !Array.isArray(schema.required) || !schema.properties) fail('SCHEMA_INVALID', 'Neplatná základná schéma.');
  for (const key of schema.required) if (!Object.hasOwn(data, key)) fail('METADATA_INVALID', `${filename}: chýba ${key}`);
  for (const [key, value] of Object.entries(data)) {
    const rule = schema.properties[key]; const extra = extensions.fields[key];
    if (!rule && !extra) fail('METADATA_INVALID', `${filename}: neznáme pole ${key}`);
    if (key === 'company-os-extra-types' || key === 'company-os-extra-fields') {
      if (filename !== 'Mapa systému.md') fail('METADATA_EXTENSION', 'Rozšírenia sú deklarované iba v Mape systému.');
      continue;
    }
    if (extra) {
      if ((extra === 'date' && !validDate(value)) || (extra === 'string-list' && !stringList(value)) || (!['date', 'string-list'].includes(extra) && typeof value !== extra)) fail('METADATA_INVALID', `${filename}: neplatné ${key}`);
      continue;
    }
    if (rule.type === 'array' ? !stringList(value) : typeof value !== rule.type) fail('METADATA_INVALID', `${filename}: neplatný typ ${key}`);
    if (rule.enum && !rule.enum.includes(value) && !(key === 'type' && extensions.types.includes(value))) fail('METADATA_INVALID', `${filename}: neplatná hodnota ${key}`);
    if (rule.minLength && value.length < rule.minLength) fail('METADATA_INVALID', `${filename}: prázdne ${key}`);
    if (rule.format === 'date' && !validDate(value)) fail('METADATA_INVALID', `${filename}: neplatný dátum ${key}`);
  }
  if (data['ai-generated'] && !data.tags.includes('🤖')) fail('METADATA_INVALID', `${filename}: AI poznámka potrebuje tag 🤖.`);
  if (data.type === 'knowledge' && (!stringList(data.sources) || !data.sources.length || !schema.properties.certainty.enum.includes(data.certainty))) fail('METADATA_INVALID', `${filename}: poznatok potrebuje sources/certainty.`);
}
export function wikiTargets(text) {
  return [...String(text).matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/gu)].map(match => {
    const raw = match[1].split('#')[0];
    if (!raw) return null;
    safeRelative(raw);
    return /\.[a-z0-9]+$/iu.test(raw) ? raw : `${raw}.md`;
  }).filter(Boolean);
}
export function validateBoard(text, model) {
  const taskIds = [...text.matchAll(/<!--\s*os:task:([^\s>]+)\s*-->/gu)].map(match => match[1]);
  if (taskIds.some(id => !ID.test(id)) || new Set(taskIds).size !== taskIds.length) fail('BOARD_ID', 'Tabuľa má neplatné alebo duplicitné ID; dotknutý stav potrebuje recovery.');
  for (const id of model.tasks.map(task => task.id)) if (!taskIds.includes(id)) fail('BOARD_ID', `Chýba ${id}; neobnovuj úlohu tichým reseedom.`);
  if (taskIds.some(id => !SETUP_IDS.includes(id) && !USER_ID.test(id))) fail('BOARD_ID', 'Neznáme ID úlohy mimo modelu a platného user-<uuid> potrebuje vysvetlenie.');
  const questionIds = [...text.matchAll(/<!--\s*os:question:([^\s>]+)\s*-->/gu)].map(match => match[1]);
  if (questionIds.some(id => !ID.test(id)) || new Set(questionIds).size !== questionIds.length) fail('BOARD_ID', 'Neplatné alebo duplicitné ID otázky.');
  const knownQuestions = model.tasks.flatMap(task => task.questions.map(question => question.id));
  if (questionIds.some(id => id.startsWith('setup-') && !knownQuestions.includes(id))) fail('BOARD_ID', 'Neznáme systémové ID otázky potrebuje vysvetlenie.');
  const allMarkers = [...text.matchAll(/<!--\s*os:(task|question):.*?-->/gu)];
  if (allMarkers.length !== taskIds.length + questionIds.length) fail('BOARD_ID', 'Neplatný formát ID markeru potrebuje recovery.');
  for (const id of knownQuestions) if (!questionIds.includes(id)) fail('BOARD_ID', `Chýba otázka ${id}; zachovaj existujúce odpovede a vyžiadaj recovery.`);
}
export function validateFiles(files) {
  checkPaths(Object.keys(files));
  const schema = JSON.parse(String(files['AI OS/Systém/Schémy/poznamka.schema.json']));
  const model = validateSetupModel(JSON.parse(String(files['Procesy/system-nastavenie-firmy/model.yaml'])));
  const map = parseNote(String(files['Mapa systému.md']), 'Mapa systému.md').data;
  const extensions = metadataExtensions(map);
  for (const [name, bytes] of Object.entries(files)) {
    if (!name.endsWith('.md') || ['AGENTS.md', 'CLAUDE.md'].includes(name) || (name.startsWith('Znalostná báza/Zdroje/') && name !== 'Znalostná báza/Zdroje/index.md') || (name.startsWith('Inbox/') && name !== 'Inbox/README.md')) continue;
    const {data, body} = parseNote(String(bytes), name);
    validateMetadata(data, schema, extensions, name);
    if (data.type === 'knowledge') for (const source of data.sources) {
      if (/^https?:\/\//u.test(source)) { try { new URL(source); } catch { fail('KNOWLEDGE_SOURCE', `${name}: neplatný URL zdroj.`); } }
      else { safeRelative(source); if (!Object.hasOwn(files, source)) fail('KNOWLEDGE_SOURCE', `${name}: chýba zdroj ${source}`); }
    }
    if (!/^# .+$/mu.test(body) || !/^> \*\*Súvisí s:\*\*/mu.test(body)) fail('NOTE_STRUCTURE', `${name}: chýba H1 alebo Súvisí s.`);
    for (const target of wikiTargets(body)) if (!Object.hasOwn(files, target)) fail('DEAD_LINK', `${name}: chýba ${target}`);
  }
  for (const target of [...String(files['AGENTS.md']).matchAll(/`([^`]+\.md)`/gu)].map(match => match[1])) if (!Object.hasOwn(files, target)) fail('DEAD_LINK', `AGENTS: chýba ${target}`);
  if (String(files['CLAUDE.md']) !== '@AGENTS.md\n') fail('CLAUDE_IMPORT', 'CLAUDE musí obsahovať iba import @AGENTS.md.');
  if (Buffer.byteLength(files['AGENTS.md']) > 8192) fail('AGENTS_SIZE', 'AGENTS prekročil 8 KiB.');
  for (const task of model.tasks) if (!Object.hasOwn(files, task.answerTarget)) fail('MODEL_TARGET', `Chýba cieľ odpovede ${task.answerTarget}`);
  validateBoard(String(files['Pracovná tabuľa.md']), model);
  return {model, schema};
}
