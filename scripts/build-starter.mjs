import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildCoreFiles, ownershipFor, sha256, SIMPLE_DATE, SIMPLE_VERSION} from '../core/installer.mjs';
import {checkPaths, fail} from '../core/validate.mjs';
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function buildStarterFiles() {
  const files = await buildCoreFiles({variant:'simple'});
  const manifest = {schema:'company-os-prepared-starter-v1',version:SIMPLE_VERSION,date:SIMPLE_DATE,scope:'foundation',fileCount:Object.keys(files).length,files:Object.keys(files).sort().map(name=>({path:name,bytes:Buffer.byteLength(files[name]),sha256:sha256(files[name]),ownership:ownershipFor(name)}))};
  return {...files,'manifest.json':`${JSON.stringify(manifest,null,2)}\n`};
}
async function regularTree(directory) {
  const files = {};
  async function walk(full, prefix='') {
    for (const entry of await fs.readdir(full,{withFileTypes:true})) {
      const name=prefix?`${prefix}/${entry.name}`:entry.name;
      if(entry.isSymbolicLink()) fail('SYMLINK','Generated snapshot nesmie obsahovať symlink.');
      if(entry.isDirectory()) await walk(path.join(full,entry.name),name);
      else if(entry.isFile()) files[name]=await fs.readFile(path.join(full,entry.name));
      else fail('SPECIAL_FILE','Generated snapshot obsahuje špeciálny súbor.');
    }
  }
  await walk(directory); checkPaths(Object.keys(files)); return files;
}
export async function buildStarter({output=path.join(repository,'starter'),check=false}={}) {
  if(!path.isAbsolute(output) || path.resolve(output)!==output || output===path.parse(output).root) fail('UNSAFE_PATH','Potrebný je konkrétny absolútny výstup.');
  for(let cursor=output;;cursor=path.dirname(cursor)) {
    const stat=await fs.lstat(cursor).catch(error=>{if(error.code==='ENOENT') return null;throw error;});
    if(stat && (stat.isSymbolicLink() || !stat.isDirectory())) fail('SYMLINK','Nebezpečný výstup alebo ancestor.');
    if(path.dirname(cursor)===cursor) break;
  }
  const expected=await buildStarterFiles();
  let actual={};
  try {actual=await regularTree(output);} catch(error) {if(error.code!=='ENOENT') throw error;if(check) fail('MISSING_OUTPUT','Chýba starter snapshot.');}
  if(Object.keys(actual).some(name=>!Object.hasOwn(expected,name))) fail('FOREIGN_OUTPUT','Neznámy súbor v generated snapshot; automaticky sa nezmaže.');
  if(check) {
    if(Object.keys(actual).length!==Object.keys(expected).length || Object.entries(expected).some(([name,text])=>!actual[name]?.equals(Buffer.from(text)))) fail('STALE_OUTPUT','starter/ sa nezhoduje s kanonickým rendererom.');
    return {status:'PASS',version:SIMPLE_VERSION,files:Object.keys(expected).length,writes:0};
  }
  for(const [name,text] of Object.entries(expected)) {
    const file=path.join(output,...name.split('/')); await fs.mkdir(path.dirname(file),{recursive:true});
    await fs.writeFile(file,text,{mode:0o644});
  }
  const readback=await regularTree(output);
  if(Object.entries(expected).some(([name,text])=>!readback[name]?.equals(Buffer.from(text)))) fail('READBACK','Nezhodný generated readback.');
  return {status:'PASS',version:SIMPLE_VERSION,files:Object.keys(expected).length,output};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2);let check=false;let output;
    while(args.length) {const flag=args.shift();if(flag==='--check'&&!check)check=true;else if(flag==='--out'&&!output&&args.length)output=args.shift();else fail('USAGE','Použi node scripts/build-starter.mjs [--check] [--out <absolútna-cesta>].');}
    console.log(JSON.stringify(await buildStarter({output,check}),null,2));
  } catch(error) {console.error(`${error.code??'ERROR'}: ${error.message}`);process.exitCode=1;}
}
