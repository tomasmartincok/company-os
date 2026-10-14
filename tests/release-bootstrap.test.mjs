import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir, symlink, rm, stat, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { gzipSync, gunzipSync } from 'node:zlib';
import { buildRelease, BUNDLE_FILES } from '../scripts/release/build-release.mjs';
import { sha256, createArchive, readArchive } from '../scripts/release/archive.mjs';
import { renderMacCommands, renderWindowsCommands, renderBootstrap, ARCHIVE_NAME } from '../scripts/release/bootstrap.mjs';
import { renderRuntimeMac, renderInstall } from '../scripts/release/runtime.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const commit = '898dc6f3536528e25462ad1155293c6a24428720';
const pin = JSON.parse(await readFile(join(root,'content/runtime/node-24.16.0.json'),'utf8'));
async function fixture(t) {
  const scratch = await mkdtemp(join(await realpath(tmpdir()),'company-os-release-test-'));
  t.after(()=>rm(scratch,{recursive:true,force:true}));
  const source=join(scratch,'source');
  for (const path of BUNDLE_FILES) {
    await mkdir(dirname(join(source,path)),{recursive:true});
    await writeFile(join(source,path),path==='content/runtime/node-24.16.0.json'?JSON.stringify(pin,null,2)+'\n':path==='INSTALL.md'?renderInstall(pin):`fixture: ${path}\n`);
  }
  await mkdir(join(source,'templates'),{recursive:true});
  await writeFile(join(source,'templates/pokyn-fazy-0.template.md'),await readFile(join(root,'templates/pokyn-fazy-0.template.md')));
  const out=join(scratch,'release');
  const info=await buildRelease({sourceRoot:source,output:out,sourceCommit:commit});
  const manifest=JSON.parse(await readFile(join(out,'manifest.json'),'utf8'));
  return {scratch,source,out,info,manifest};
}
function mutateTar(archive, mutate) {
  const bytes=gunzipSync(archive);mutate(bytes);
  return gzipSync(bytes,{level:9});
}
function checksum(bytes,offset=0) {
  bytes.fill(32,offset+148,offset+156);
  const sum=bytes.subarray(offset,offset+512).reduce((a,b)=>a+b,0);
  bytes.write(sum.toString(8).padStart(6,'0'),offset+148,'ascii');bytes[offset+154]=0;bytes[offset+155]=32;
}
async function nativeFixture(t, config, manifest=config.manifest, archive) {
  const server=join(config.scratch,`assets-${Math.random().toString(16).slice(2)}`);await mkdir(server);
  const archiveBytes=archive??await readFile(join(config.out,ARCHIVE_NAME));
  await writeFile(join(server,ARCHIVE_NAME),archiveBytes);
  const json=Buffer.from(JSON.stringify(manifest,null,2)+'\n');await writeFile(join(server,'manifest.json'),json);
  let command=renderMacCommands(manifest,sha256(json));
  command=command.replaceAll('https://github.com/tomasmartincok/company-os/releases/download/v0.1.0-core.1/',pathToFileURL(server).href+'/').replaceAll("--proto '=https'", "--proto '=file'").replaceAll("--proto-redir '=https'", "--proto-redir '=file'");
  command=command.replace('/private/tmp/company-os-phase0.XXXXXXXX',join(config.scratch,'stage.XXXXXXXX'));
  return {command,json,server};
}
test('release assets repeat exact bytes with strict file inventory and complete pins',async t=>{
  const f=await fixture(t);const second=join(f.scratch,'again');
  await buildRelease({sourceRoot:f.source,output:second,sourceCommit:commit});
  assert.deepEqual((await readdir(f.out)).sort(),[ARCHIVE_NAME,'manifest.json','pokyn-instalacie.txt'].sort());
  for(const name of await readdir(f.out))assert.deepEqual(await readFile(join(f.out,name)),await readFile(join(second,name)));
  const data=readArchive(await readFile(join(f.out,ARCHIVE_NAME)),BUNDLE_FILES);
  for(const item of f.manifest.files){assert.equal(sha256(data.get(item.path)),item.sha256);assert.equal(data.get(item.path).length,item.bytes);}
  const prompt=await readFile(join(f.out,'pokyn-instalacie.txt'),'utf8');
  assert.ok(prompt.includes(f.info.manifestSha256));assert.ok(prompt.includes(commit));assert.ok(!prompt.includes('{{'));
  assert.deepEqual(f.manifest.runtime,pin);
});
test('release requires real pins and preserves existing or symlink output',async t=>{
  const f=await fixture(t);
  await assert.rejects(buildRelease({sourceRoot:f.source,output:join(f.scratch,'bad'),sourceCommit:'0'.repeat(40)}),/real 40/);
  await assert.rejects(buildRelease({sourceRoot:f.source,output:f.out,sourceCommit:commit}),/absent or empty/);
  await symlink(f.out,join(f.scratch,'link'));
  await assert.rejects(buildRelease({sourceRoot:f.source,output:join(f.scratch,'link'),sourceCommit:commit}),/Unsafe/);
  assert.throws(()=>renderMacCommands(f.manifest,'0'.repeat(64)),/manifest pin/);
  assert.throws(()=>renderBootstrap(f.manifest,f.info.manifestSha256,'{{MISSING}}'),/Unknown template/);
});

test('maintainer release CLI rejects an actual unsupported PATH runtime before any build',async t=>{
  const version=spawnSync('node',['--version'],{encoding:'utf8'});
  if(version.status!==0||version.stdout.trim()==='v24.16.0'){t.skip('No actual unsupported Node runtime on PATH');return;}
  const scratch=await mkdtemp(join(await realpath(tmpdir()),'company-os-cli-guard-'));t.after(()=>rm(scratch,{recursive:true,force:true}));
  const output=join(scratch,'must-not-exist');
  const result=spawnSync('node',[join(root,'scripts/release/build-release.mjs'),'--commit',commit,'--out',output],{encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/requires exact Node v24\.16\.0/);
  assert.deepEqual(await readdir(scratch),[]);
});
test('strict USTAR rejects traversal, absolute, drive, duplicate, links, special and checksum errors',()=>{
  const original=createArchive({'INSTALL.md':'one','core/installer.mjs':'two'});
  const mutations=[
    bytes=>{bytes.fill(0,0,100);bytes.write('../outside',0);checksum(bytes);},
    bytes=>{bytes.fill(0,0,100);bytes.write('/outside',0);checksum(bytes);},
    bytes=>{bytes.fill(0,0,100);bytes.write('C:/outside',0);checksum(bytes);},
    bytes=>{bytes.fill(0,1024,1124);bytes.write('INSTALL.md',1024);checksum(bytes,1024);},
    bytes=>{bytes[156]=50;bytes.write('outside',157);checksum(bytes);},
    bytes=>{bytes[156]=49;bytes.write('outside',157);checksum(bytes);},
    bytes=>{bytes[156]=54;checksum(bytes);},
    bytes=>{bytes[0]^=1;}
  ];
  for(const mutation of mutations)assert.throws(()=>readArchive(mutateTar(original,mutation)));
});

test('portable archive and manifest reject case, path-prefix and reserved-name collisions',async t=>{
  for(const files of [ {'A.txt':'a','a.txt':'b'}, {'a':'a','a/b':'b'}, {'CON':'a'}, {'x.':'a'} ]) assert.throws(()=>createArchive(files),/collision|Non-portable/);
  const archive=createArchive({'A.txt':'a','b.txt':'b'});
  for(const name of ['a.txt','A.txt/nested']) assert.throws(()=>readArchive(mutateTar(archive,bytes=>{bytes.fill(0,1024,1124);bytes.write(name,1024);checksum(bytes,1024);})),/collision/);
  const f=await fixture(t);
  for(const paths of [['A.txt','a.txt'],['a','a/b']]) {
    const invalid={...f.manifest,files:[...f.manifest.files,...paths.map(path=>({path,sha256:'1'.repeat(64),bytes:1}))]};
    assert.throws(()=>renderMacCommands(invalid,f.info.manifestSha256),/collision/);
    assert.throws(()=>renderWindowsCommands(invalid,f.info.manifestSha256),/collision/);
  }
});
test('native Mac Phase0 verifies local-file fixtures before extraction and does not execute INSTALL',{skip:process.platform!=='darwin'},async t=>{
  const f=await fixture(t);const native=await nativeFixture(t,f);
  const result=spawnSync('/bin/sh',['-c',native.command],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const stage=result.stdout.match(/VERIFIED_STAGE=(.*)/)?.[1];assert.ok(stage);
  assert.deepEqual(await readFile(join(stage,'release-manifest.json')),native.json);
  for(const file of f.manifest.files)assert.equal(sha256(await readFile(join(stage,file.path))),file.sha256);
});
test('native Mac bad manifest or archive pins stop before extraction',{skip:process.platform!=='darwin'},async t=>{
  const f=await fixture(t);const native=await nativeFixture(t,f);
  const badManifest=native.command.replace(sha256(native.json),'1'.repeat(64));
  const result=spawnSync('/bin/sh',['-c',badManifest],{encoding:'utf8'});assert.notEqual(result.status,0);assert.match(result.stderr,/manifest hash mismatch/);
  await writeFile(join(native.server,ARCHIVE_NAME),'corrupt archive');
  const badArchive=spawnSync('/bin/sh',['-c',native.command],{encoding:'utf8'});assert.notEqual(badArchive.status,0);assert.match(badArchive.stderr,/archive hash mismatch/);
  for(const name of await readdir(f.scratch))if(name.startsWith('stage.'))assert.ok(!(await readdir(join(f.scratch,name))).includes('verified'));
});
test('native Mac repinned traversal and symlink archives still stop before extraction',{skip:process.platform!=='darwin'},async t=>{
  const f=await fixture(t);const original=await readFile(join(f.out,ARCHIVE_NAME));
  for(const kind of ['traversal','symlink']){
    const archive=mutateTar(original,bytes=>{if(kind==='traversal'){bytes.fill(0,0,100);bytes.write('../outside',0);}else{bytes[156]=50;bytes.write('outside',157);}checksum(bytes);});
    const manifest={...f.manifest,archive:{...f.manifest.archive,sha256:sha256(archive),bytes:archive.length}};
    const native=await nativeFixture(t,f,manifest,archive);
    const result=spawnSync('/bin/sh',['-c',native.command],{encoding:'utf8'});
    assert.notEqual(result.status,0);assert.ok(!result.stdout.includes('VERIFIED_STAGE'));
  }
  for(const name of await readdir(f.scratch))if(name.startsWith('stage.'))assert.ok(!(await readdir(join(f.scratch,name))).includes('verified'));
});
test('Windows rendered commands use only System32 native tools and never policy mutation or unverified scripts',async t=>{
  const f=await fixture(t);const script=renderWindowsCommands(f.manifest,f.info.manifestSha256);
  assert.match(script,/System32/);assert.match(script,/certutil\.exe/);assert.match(script,/curl\.exe/);assert.match(script,/tar\.exe/);
  assert.match(script,/Get-ExecutionPolicy -List/);assert.match(script,/-ccontains/);assert.match(script,/ReparsePoint/);
  assert.ok(!/Set-ExecutionPolicy|ExecutionPolicy\s+Bypass|Invoke-Expression|\.ps1|node\.exe|python|npm/i.test(script));
  assert.ok(script.indexOf('manifest hash mismatch')<script.indexOf('& $Tar -tzf'));
  assert.ok(script.indexOf('archive links or special entries')<script.indexOf('& $Tar -xzf'));
});
test('INSTALL is derived from single runtime pin and extracts only executable/license',async()=>{
  assert.equal(await readFile(join(root,'INSTALL.md'),'utf8'),renderInstall(pin));
  const runtime=renderRuntimeMac(pin);
  assert.match(runtime,/Only these two literal members/);assert.match(runtime,/runtime hash mismatch/);
  assert.ok(runtime.indexOf('runtime hash mismatch')<runtime.indexOf('/usr/bin/tar -xzf'));
  assert.ok(!runtime.includes('npm install'));
});
test('optional actual pinned Mac runtime archive exercises selective native extraction and executable',{skip:process.platform!=='darwin'||!process.env.COMPANY_OS_NODE_ARCHIVE},async t=>{
  const scratch=await mkdtemp(join(await realpath(tmpdir()),'company-os-runtime-test-'));t.after(()=>rm(scratch,{recursive:true,force:true}));
  const platform=`darwin-${process.arch==='arm64'?'arm64':'x64'}`;const entry=pin.artifacts.find(a=>a.platform===platform);
  const local=resolve(process.env.COMPANY_OS_NODE_ARCHIVE);
  assert.equal(sha256(await readFile(local)),entry.sha256);
  let command=renderRuntimeMac(pin).replaceAll(entry.url,pathToFileURL(local).href).replaceAll("--proto '=https'", "--proto '=file'").replaceAll("--proto-redir '=https'", "--proto-redir '=file'").replace('/private/tmp/company-os-runtime.XXXXXXXX',join(scratch,'runtime.XXXXXXXX'));
  const result=spawnSync('/bin/sh',['-c',command],{encoding:'utf8',timeout:90000});assert.equal(result.status,0,result.stderr);
  const executable=result.stdout.match(/NODE_EXEC=(.*)/)?.[1];assert.ok(executable);
  assert.equal(spawnSync(executable,['--version'],{encoding:'utf8'}).stdout.trim(),'v24.16.0');
  assert.equal(spawnSync(executable,['-p','process.execPath'],{encoding:'utf8'}).stdout.trim(),executable);
  assert.ok((await stat(join(dirname(dirname(executable)),'LICENSE'))).size>0);
  assert.deepEqual((await readdir(dirname(executable))).sort(),['node']);
});
