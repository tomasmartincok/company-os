import { gzipSync, gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

export const sha256 = value => createHash('sha256').update(value).digest('hex');
export function safeArchivePath(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(value) || value.length > 100 || value.split('/').some(p => p === '.' || p === '..')) throw new Error(`Unsafe archive path: ${String(value)}`);
  if (value.split('/').some(p => p.endsWith('.') || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p))) throw new Error('Non-portable archive path');
  return value;
}
export function assertArchiveInventory(paths) {
  const normalized = new Set();
  for (const path of paths) {
    const key = safeArchivePath(path).toLowerCase();
    if (normalized.has(key)) throw new Error('Case or duplicate archive collision');
    for (const previous of normalized) if (key.startsWith(previous + '/') || previous.startsWith(key + '/')) throw new Error('File/directory archive collision');
    normalized.add(key);
  }
  return paths;
}
function octal(header, offset, width, value) {
  const text = value.toString(8).padStart(width - 1, '0');
  if (text.length !== width - 1) throw new Error('Tar field overflow');
  header.write(text, offset, width - 1, 'ascii');
}
export function createArchive(files) {
  const paths = assertArchiveInventory(Object.keys(files).sort());
  if (!paths.length) throw new Error('Empty archive');
  const chunks = [];
  for (const path of paths) {
    safeArchivePath(path);
    const data = Buffer.from(files[path]);
    const header = Buffer.alloc(512);
    header.write(path, 0, 'ascii'); octal(header, 100, 8, 0o644); octal(header, 108, 8, 0); octal(header, 116, 8, 0);
    octal(header, 124, 12, data.length); octal(header, 136, 12, 0);
    header.fill(32, 148, 156); header[156] = 48;
    header.write('ustar\0', 257, 'ascii'); header.write('00', 263, 'ascii');
    const sum = header.reduce((a, b) => a + b, 0);
    header.write(sum.toString(8).padStart(6, '0'), 148, 'ascii'); header[154] = 0; header[155] = 32;
    chunks.push(header, data, Buffer.alloc((512 - data.length % 512) % 512));
  }
  const compressed = gzipSync(Buffer.concat([...chunks, Buffer.alloc(1024)]), { level: 9 });
  compressed[9] = 255; // fixed gzip OS byte, no host identity or timestamp
  return compressed;
}
function number(header, offset, length) {
  const text = header.subarray(offset, offset + length).toString('ascii').replace(/\0.*$/, '').trim();
  if (!/^[0-7]+$/.test(text)) throw new Error('Non-octal tar field');
  return parseInt(text, 8);
}
export function readArchive(archive, expectedPaths) {
  const data = gunzipSync(archive, { maxOutputLength: 32 * 1024 * 1024 });
  const result = new Map(); let offset = 0; let ended = false;
  while (offset + 512 <= data.length) {
    const header = data.subarray(offset, offset + 512); offset += 512;
    if (header.every(b => b === 0)) {
      if (data.length - offset < 512 || !data.subarray(offset).every(b => b === 0)) throw new Error('Invalid tar ending');
      ended = true; break;
    }
    if (header.subarray(257, 265).toString('ascii') !== 'ustar\0' + '00') throw new Error('Only strict USTAR supported');
    if (header[156] !== 48 || header.subarray(157, 257).some(b => b !== 0) || header.subarray(345, 500).some(b => b !== 0)) throw new Error('Links, special entries and prefixes forbidden');
    const nul = header.subarray(0, 100).indexOf(0);
    const nameBytes = header.subarray(0, nul === -1 ? 100 : nul);
    if (nameBytes.some(b => b > 127)) throw new Error('Only ASCII archive names supported');
    const path = safeArchivePath(nameBytes.toString('ascii'));
    assertArchiveInventory([...result.keys(), path]);
    const checksum = number(header, 148, 8);
    const normalized = Buffer.from(header); normalized.fill(32, 148, 156);
    if (normalized.reduce((a,b) => a+b,0) !== checksum) throw new Error('Tar checksum mismatch');
    const size = number(header, 124, 12);
    if (size > 16 * 1024 * 1024 || offset + size > data.length) throw new Error('Invalid tar size');
    result.set(path, Buffer.from(data.subarray(offset, offset + size)));
    const padding = (512 - size % 512) % 512;
    if (data.subarray(offset + size, offset + size + padding).some(b => b !== 0)) throw new Error('Invalid tar padding');
    offset += size + padding;
  }
  if (!ended) throw new Error('Missing tar ending');
  if (expectedPaths) assertArchiveInventory(expectedPaths);
  if (expectedPaths && [...result.keys()].sort().join('\n') !== [...expectedPaths].sort().join('\n')) throw new Error('Archive inventory mismatch');
  return result;
}
