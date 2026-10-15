import { readFile, mkdir, readdir, lstat, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createArchive, readArchive, sha256 } from './archive.mjs';
import { renderInstall } from './runtime.mjs';
import { RELEASE_VERSION, RELEASE_TAG, ARCHIVE_NAME, validateReleaseManifest, renderBootstrap } from './bootstrap.mjs';

export const BUNDLE_FILES = Object.freeze([
  'INSTALL.md', 'content/core/note-schema.json', 'content/core/setup-model.json', 'content/runtime/node-24.16.0.json',
  'core/installer.mjs', 'core/validate.mjs', 'templates/core/AGENTS.md', 'templates/core/profiles.json'
].sort());
const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export async function buildRelease({ sourceRoot = repository, output, sourceCommit }) {
  if (!/^[a-f0-9]{40}$/.test(sourceCommit) || /^0+$/.test(sourceCommit)) throw new Error('Explicit real 40-hex --commit required');
  if (!output || !output.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(output)) throw new Error('Absolute fresh output path required');
  const destination = resolve(output);
  for (let path = destination;; path = dirname(path)) {
    const state = await lstat(path).catch(e=>{ if(e.code==='ENOENT')return null; throw e; });
    if (state?.isSymbolicLink() || state && !state.isDirectory()) throw new Error('Unsafe output or ancestor');
    if (dirname(path) === path) break;
  }
  const existing = await readdir(destination).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
  if (existing?.length) throw new Error('Output must be absent or empty');
  const files = {};
  for (const path of BUNDLE_FILES) {
    const source = join(sourceRoot, path === 'INSTALL.md' ? 'docs/legacy-install-core.md' : path);
    const state = await lstat(source);
    if (!state.isFile() || state.isSymbolicLink()) throw new Error('Bundle source must be a regular file');
    files[path] = await readFile(source);
  }
  const runtime = JSON.parse(files['content/runtime/node-24.16.0.json']);
  if (files['INSTALL.md'].toString('utf8') !== renderInstall(runtime)) throw new Error('INSTALL runtime instructions are stale');
  const archive = createArchive(files);
  const decoded = readArchive(archive, BUNDLE_FILES);
  for (const path of BUNDLE_FILES) if (!decoded.get(path).equals(files[path])) throw new Error('Archive readback mismatch');
  const manifest = validateReleaseManifest({ format:'company-os-release-v1', version:RELEASE_VERSION, sourceCommit, archive:{name:ARCHIVE_NAME,sha256:sha256(archive),bytes:archive.length}, files:BUNDLE_FILES.map(path=>({path,sha256:sha256(files[path]),bytes:files[path].length})), runtime });
  const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2)+'\n');
  const manifestSha256 = sha256(manifestBytes);
  const template = await readFile(join(sourceRoot, 'templates/pokyn-fazy-0.template.md'), 'utf8');
  const prompt = renderBootstrap(manifest, manifestSha256, template);
  await mkdir(destination, {recursive:true});
  for (const [name, bytes] of [[ARCHIVE_NAME,archive],['manifest.json',manifestBytes],['pokyn-instalacie.txt',Buffer.from(prompt)]]) await writeFile(join(destination,name),bytes,{flag:'wx',mode:0o644});
  return { version:RELEASE_VERSION, tag:RELEASE_TAG, output:destination, sourceCommit, manifestSha256, archiveSha256:manifest.archive.sha256, files:BUNDLE_FILES, assets:[ARCHIVE_NAME,'manifest.json','pokyn-instalacie.txt'] };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.version !== 'v24.16.0') throw new Error('Release CLI requires exact Node v24.16.0: compressed bytes depend on zlib version. Use the verified pinned local runtime.');
    const arguments_ = process.argv.slice(2); const values = {};
    while(arguments_.length) {const key=arguments_.shift();if(!['--out','--commit'].includes(key)||!arguments_.length||values[key])throw new Error('Usage: node scripts/release/build-release.mjs --commit <real40hex> --out <absolute-fresh-directory>');values[key]=arguments_.shift();}
    console.log(JSON.stringify(await buildRelease({ output:values['--out'], sourceCommit:values['--commit'] }),null,2));
  } catch(error) { console.error(error.message); process.exitCode=1; }
}
