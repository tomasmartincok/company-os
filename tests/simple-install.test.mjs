import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {buildStarter,buildStarterFiles} from '../scripts/build-starter.mjs';
import {buildCoreFiles,sha256,SIMPLE_SYNC_TASK,SIMPLE_VERSION} from '../core/installer.mjs';
import {safeRelative,validateFiles} from '../core/validate.mjs';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=async t=>{const root=await fs.mkdtemp(path.join(await fs.realpath(os.tmpdir()),'company-os-simple-test-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));return root;};
const hashFile=async file=>{const result=spawnSync('/usr/bin/shasum',['-a','256',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);return result.stdout.slice(0,64);};
const command=(file,args)=>{const result=spawnSync(file,args,{encoding:'utf8'});if(result.status!==0)throw new Error(`${file}: ${result.stderr}`);return result.stdout;};
async function tree(root) {const values={};async function walk(dir,prefix=''){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const name=prefix?`${prefix}/${entry.name}`:entry.name;const full=path.join(dir,entry.name);if(entry.isDirectory())await walk(full,name);else{const st=await fs.stat(full);values[name]={sha:sha256(await fs.readFile(full)),mtime:st.mtimeMs};}}}await walk(root);return values;}
async function safeRoot(root){for(let p=root;;p=path.dirname(p)){const stat=await fs.lstat(p).catch(e=>{if(e.code==='ENOENT')return null;throw e;});if(stat?.isSymbolicLink()||(stat&&!stat.isDirectory()))throw new Error('unsafe root');if(p!==root&&await fs.stat(path.join(p,'.os-starter')).then(()=>true,()=>false))throw new Error('ancestor workspace');if(path.dirname(p)===p)break;}}
function checkManifest(manifest){assert.equal(manifest.schema,'company-os-prepared-starter-v1');assert.equal(manifest.version,SIMPLE_VERSION);assert.equal(manifest.fileCount,manifest.files.length);const names=new Set();for(const entry of manifest.files){safeRelative(entry.path);assert.ok(/\.(md|json|yaml)$/u.test(entry.path));assert.ok(!entry.path.startsWith('.os-starter/'));const key=entry.path.normalize('NFC').toLowerCase();assert.ok(!names.has(key));names.add(key);assert.match(entry.sha256,/^[0-9a-f]{64}$/u);assert.ok(Number.isSafeInteger(entry.bytes)&&entry.bytes>0);}for(const name of names)for(const other of names)assert.ok(name===other||!other.startsWith(`${name}/`));}
// Test-only reference of the native copy/hash contract in INSTALL.md. This harness
// is NOT distributed or required by participants. Actual agent/UI evidence is separate.
async function nativeCopyFixture({source,target,stage,storage='local',cloudConfirmed=false,failAfter=Infinity}){
  await safeRoot(target);if(storage==='existing-cloud'&&!cloudConfirmed)throw new Error('cloud confirmation checkpoint');
  const manifestBytes=await fs.readFile(path.join(source,'manifest.json'));const manifest=JSON.parse(manifestBytes);checkManifest(manifest);
  const present=await fs.readdir(target).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
  if(present?.length){
    let marker;try{marker=JSON.parse(await fs.readFile(path.join(target,'.os-starter/installed.json'),'utf8'));}catch{throw new Error('nonempty/partial/legacy checkpoint');}
    assert.equal(marker.schema,'company-os-simple-installed-v1');assert.equal(marker.version,SIMPLE_VERSION);assert.equal(marker.state,'committed');
    assert.equal(await hashFile(path.join(target,'.os-starter/source-manifest.json')),marker.manifest_sha256);assert.equal(marker.manifest_sha256,sha256(manifestBytes));
    for(const entry of manifest.files){const file=path.join(target,entry.path);const stat=await fs.lstat(file);assert.ok(stat.isFile()&&!stat.isSymbolicLink());if(['package','generated'].includes(entry.ownership))assert.equal(await hashFile(file),entry.sha256);}
    return {writes:0};
  }
  await fs.mkdir(stage);for(const entry of manifest.files){const out=path.join(stage,entry.path);await fs.mkdir(path.dirname(out),{recursive:true});command('/usr/bin/curl',['--fail','--silent','--show-error','--proto','=file',pathToFileURL(path.join(source,entry.path)).href,'-o',out]);assert.equal(await hashFile(out),entry.sha256);assert.equal((await fs.stat(out)).size,entry.bytes);}
  await safeRoot(target);assert.deepEqual(await fs.readdir(target).catch(e=>{if(e.code==='ENOENT')return [];throw e;}),[]);await fs.mkdir(target,{recursive:true});let copied=0;
  for(const entry of manifest.files){const dest=path.join(target,entry.path);await fs.mkdir(path.dirname(dest),{recursive:true});assert.equal(await fs.lstat(dest).then(()=>true,()=>false),false);command('/bin/cp',['-n',path.join(stage,entry.path),dest]);assert.equal(await hashFile(dest),entry.sha256);if(++copied===failAfter)throw new Error('partial copy checkpoint');}
  await fs.mkdir(path.join(target,'.os-starter'));await fs.writeFile(path.join(target,'.os-starter/source-manifest.json'),manifestBytes,{flag:'wx'});
  const uuid=command('/usr/bin/uuidgen',[]).trim().toLowerCase();await fs.writeFile(path.join(target,'.os-starter/installed.json'),JSON.stringify({schema:'company-os-simple-installed-v1',version:SIMPLE_VERSION,scope:'foundation',state:'committed',workspace_id:uuid,source_commit:'a'.repeat(40),manifest_sha256:sha256(manifestBytes),storage,sync_status:storage==='local'?'not-configured':'user-confirmed',backup_status:'not-verified'})+'\n',{flag:'wx'});
  return {writes:manifest.files.length+2};
}

test('prepared starter is exactly generated from the single canon and includes no participant executable',async()=>{
  const generated=await buildStarterFiles();const core=await buildCoreFiles({variant:'simple'});const manifest=JSON.parse(generated['manifest.json']);checkManifest(manifest);assert.equal(manifest.fileCount,29);assert.equal(Object.keys(generated).length,30);
  assert.deepEqual(Object.keys(core).sort(),manifest.files.map(e=>e.path).sort());validateFiles(core);
  for(const entry of manifest.files){assert.equal(entry.sha256,sha256(generated[entry.path]));assert.equal(entry.bytes,Buffer.byteLength(generated[entry.path]));}
  const report=await buildStarter({check:true});assert.equal(report.writes,0);
});

test('optional cloud guide has reciprocal root links and exactly one stable open followup without extra setup IDs',async()=>{
  const files=await buildCoreFiles({variant:'simple'});const board=files['Pracovná tabuľa.md'];assert.equal([...board.matchAll(/os:task:setup-/gu)].length,8);assert.equal(board.split(`os:task:${SIMPLE_SYNC_TASK}`).length,2);assert.match(board,/- \[ \] Nastaviť synchronizáciu a zálohovanie/);
  const name='AI OS/Systém/Návody/Synchronizácia a zálohovanie.md';assert.ok(files['Mapa systému.md'].includes(`[[${name}|`));assert.ok(files[name].includes('[[Pracovná tabuľa.md|'));assert.ok(files[name].includes('Synchronizácia a záloha sú dve odlišné veci'));
  const model=JSON.parse(files['Procesy/system-nastavenie-firmy/model.yaml']);assert.equal(model.optional_followups[0].id,SIMPLE_SYNC_TASK);
});

test('new native local installation hashes all copied bytes and repeat preserves profiles/checklists/custom files without any write',{skip:process.platform!=='darwin'},async t=>{
  const root=await temp(t);const source=path.join(root,'source');await buildStarter({output:source});const target=path.join(root,'Moja firma č');const result=await nativeCopyFixture({source,target,stage:path.join(root,'stage')});assert.equal(result.writes,31);
  const marker=JSON.parse(await fs.readFile(path.join(target,'.os-starter/installed.json'),'utf8'));assert.equal(marker.storage,'local');assert.equal(marker.sync_status,'not-configured');assert.equal(marker.backup_status,'not-verified');assert.match(marker.workspace_id,/^[0-9a-f-]{36}$/u);
  for(const filename of ['O mne.md','Začnite tu.md','Pracovná tabuľa.md'])await fs.appendFile(path.join(target,filename),'\nOsobná poznámka používateľa.\n');await fs.writeFile(path.join(target,'moja-poznamka.txt'),'preserve');const before=await tree(target);
  assert.equal((await nativeCopyFixture({source,target,stage:path.join(root,'unused')})).writes,0);assert.deepEqual(await tree(target),before);assert.equal(await fs.stat(path.join(root,'unused')).then(()=>true,()=>false),false);
});

test('foreign, legacy, partial and symlink roots are checkpoints with zero target writes',{skip:process.platform!=='darwin'},async t=>{
  const root=await temp(t);const source=path.join(root,'source');await buildStarter({output:source});
  for(const kind of ['foreign','legacy','partial']){const target=path.join(root,kind);await fs.mkdir(target);await fs.writeFile(path.join(target,'original.txt'),kind);if(kind==='legacy'){await fs.mkdir(path.join(target,'.os-starter'));await fs.writeFile(path.join(target,'.os-starter/installed.json'),JSON.stringify({schema:'company-os-installed-v1',version:'0.1.0-core.1'}));}const before=await tree(target);await assert.rejects(nativeCopyFixture({source,target,stage:path.join(root,`stage-${kind}`)}));assert.deepEqual(await tree(target),before);}
  const target=path.join(root,'alias');await fs.symlink(path.join(root,'foreign'),target,'dir');await assert.rejects(nativeCopyFixture({source,target,stage:path.join(root,'symlink-stage')}),/unsafe root/);
});

test('bad staged bytes fail before any target file and interrupted copy does not claim success or overwrite on retry',{skip:process.platform!=='darwin'},async t=>{
  const root=await temp(t);const source=path.join(root,'source');await buildStarter({output:source});const target=path.join(root,'target');const first=JSON.parse(await fs.readFile(path.join(source,'manifest.json'),'utf8')).files[0];await fs.appendFile(path.join(source,first.path),'corrupt');
  await assert.rejects(nativeCopyFixture({source,target,stage:path.join(root,'bad-stage')}));assert.equal(await fs.stat(target).then(()=>true,()=>false),false);
  await buildStarter({output:source});await assert.rejects(nativeCopyFixture({source,target,stage:path.join(root,'partial-stage'),failAfter:2}),/partial copy/);assert.equal(await fs.stat(path.join(target,'.os-starter/installed.json')).then(()=>true,()=>false),false);const before=await tree(target);await assert.rejects(nativeCopyFixture({source,target,stage:path.join(root,'retry-stage')}),/checkpoint/);assert.deepEqual(await tree(target),before);
});

test('cloud choice requires explicit available-offline evidence and never claims backup',{skip:process.platform!=='darwin'},async t=>{
  const root=await temp(t);const source=path.join(root,'source');await buildStarter({output:source});const target=path.join(root,'cloud');await assert.rejects(nativeCopyFixture({source,target,stage:path.join(root,'no-stage'),storage:'existing-cloud'}),/cloud confirmation/);assert.equal(await fs.stat(target).then(()=>true,()=>false),false);
  await nativeCopyFixture({source,target,stage:path.join(root,'yes-stage'),storage:'existing-cloud',cloudConfirmed:true});const marker=JSON.parse(await fs.readFile(path.join(target,'.os-starter/installed.json'),'utf8'));assert.equal(marker.sync_status,'user-confirmed');assert.equal(marker.backup_status,'not-verified');assert.match(await fs.readFile(path.join(target,'Pracovná tabuľa.md'),'utf8'),/- \[ \] Nastaviť synchronizáciu a zálohovanie/);
});

test('entry instructions execute no repo code, preserve same-version zero-write behavior and distinguish Windows evidence',async()=>{
  const install=await fs.readFile(path.join(REPO,'INSTALL.md'),'utf8');assert.ok(install.includes('do práve otvoreného priečinka'));assert.ok(install.includes('commit'));assert.ok(install.includes('[IO.File]::Copy(source,target,$false)'));assert.ok(install.includes('Windows pilotu'));
  assert.ok(install.includes('0 zápismi'));assert.ok(install.includes('nespúšťaš kód stiahnutý'));assert.ok(!/node\s+core\/installer|npm install|git clone|python\s+-/iu.test(install));
  const prompt=await fs.readFile(path.join(REPO,'templates/agent-install.md'),'utf8');assert.ok(Buffer.byteLength(prompt)<1000);assert.ok(prompt.includes('/INSTALL.md'));assert.ok(prompt.includes('Začnem lokálne'));
});
