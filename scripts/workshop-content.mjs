import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile, rename, rm, rmdir, lstat } from 'node:fs/promises';
import { dirname, basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const workshopFiles = ['pracovny-list-a-prompty.md', 'ukazkove-vstupy.md'];
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const exportRule = 'workshop-participant-v1';

export function textBlocks(markdown) {
  return [...markdown.matchAll(/^```text\r?\n([\s\S]*?)^```[ \t]*\r?$/gm)].map(match => match[1]);
}

export function sanitizeSource(bytes, filename) {
  let markdown = bytes.toString('utf8');
  if (!Buffer.from(markdown, 'utf8').equals(bytes)) throw new Error(`${filename}: invalid UTF-8`);
  if (markdown.includes('\r')) throw new Error(`${filename}: canonical text must use LF newlines for exact HTML clipboard payloads`);
  if (!/^---\n[\s\S]*?\n---\n/.test(markdown)) throw new Error(`${filename}: canonical frontmatter boundary missing`);
  const originalBlocks = textBlocks(markdown);
  markdown = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '');
  markdown = markdown.replace(/^> \*\*Súvisí s:\*\*[^\r\n]*\r?\n\r?\n?/gm, '');
  if (filename === 'pracovny-list-a-prompty.md') {
    const appendix = /^## Dodanie v inštalačnom balíku[^\r\n]*$/m.exec(markdown);
    if (!appendix) throw new Error('Participant source: distribution appendix boundary missing');
    markdown = markdown.slice(0, appendix.index);
  } else if (filename === 'ukazkove-vstupy.md') {
    markdown = markdown.replaceAll('**Kontrola lektora:**', '**Skontrolujte výsledok:**');
    markdown = markdown.replace('Lektor si vopred overí vhodnosť úlohy a nástrojov.', 'Pred skúškou overte vhodnosť úlohy a dostupnosť nástrojov.');
  } else {
    throw new Error(`Unsupported source: ${filename}`);
  }
  markdown = markdown.trimEnd() + '\n';
  assertPublic(markdown, filename);
  const exportedBlocks = textBlocks(markdown);
  if (originalBlocks.length !== exportedBlocks.length || originalBlocks.some((block, i) => block !== exportedBlocks[i])) {
    throw new Error(`${filename}: export changed a prompt/input text block`);
  }
  return markdown;
}

export function assertPublic(markdown, filename = 'content') {
  const privateMarkers = /\[\[|\]\]|\/Users\/|\/private\/|Efforts\/|Calendar\/|lektorsk[yý]|Kontrola lektora|\bERP\b|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;
  if (privateMarkers.test(markdown)) throw new Error(`${filename}: private/internal reference in participant content`);
}

export function parseContent(documents) {
  for (const [filename, markdown] of Object.entries(documents)) assertPublic(markdown, filename);
  const promptsDocument = documents[workshopFiles[0]];
  const examplesDocument = documents[workshopFiles[1]];
  const sections = markdown => [...markdown.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  const prompts = sections(promptsDocument).filter(section => /^P[1-7]: /.test(section[1])).map(section => ({
    id: section[1].slice(0, 2).toLowerCase(), title: section[1], body: section[2], blocks: textBlocks(section[2]),
  }));
  if (prompts.length !== 7 || prompts.some((prompt, i) => prompt.id !== `p${i + 1}` || prompt.blocks.length !== 1)) {
    throw new Error('Expected exactly seven ordered prompts P1–P7, one text block each');
  }
  if (textBlocks(promptsDocument).length !== 7) throw new Error('Unexpected extra prompt text block');
  const branchIds = ['marketing', 'inbox', 'stretnutie'];
  const branches = sections(examplesDocument).filter(section => section[1] !== 'Použitie vlastných vstupov').map((section, i) => ({
    id: branchIds[i], title: section[1], body: section[2], blocks: textBlocks(section[2]),
  }));
  if (branches.length !== 3 || branches.some(branch => branch.blocks.length !== 2 || !branch.body.includes('### Demo kontext') || !branch.body.includes('### Vstup A') || !branch.body.includes('### Vstup B') || !branch.body.includes('**Skontrolujte výsledok:**'))) {
    throw new Error('Expected exactly three demo branches with context, A/B and participant criteria');
  }
  if (textBlocks(examplesDocument).length !== 6 || !examplesDocument.includes('**Všetky osoby, firmy, termíny a situácie nižšie sú fiktívne.**')) {
    throw new Error('Demo disclosure or six inputs missing');
  }
  return { prompts, branches, documents };
}

export function demoPayload(branch, inputIndex) {
  const context = /### Demo kontext\r?\n\r?\n([\s\S]*?)(?=\r?\n### )/.exec(branch.body)?.[1].trimEnd();
  if (!context) throw new Error(`${branch.id}: demo context missing`);
  if (![0, 1].includes(inputIndex)) throw new Error('Demo input must be A or B');
  if (!['marketing', 'inbox', 'stretnutie'].includes(branch.id)) throw new Error('Unknown demo branch');
  const demoPath = `Ukážky/Workshop/${branch.id}/`;
  const continuation = inputIndex === 1 ? `Pred spracovaním B načítaj uložené zadanie.md, vysledok-a.md a demo opravy z ${demoPath}. Ak chýbajú, označ to a nepredstieraj nadviazanie.\n` : '';
  return `FIKTÍVNA UKÁŽKA: osoby, firmy, termíny a situácie sú vymyslené.\nPouži nasledujúci izolovaný demo kontext iba pre túto skúšku. Neprepisuj ním Prehľad firmy.md ani O mne.md a neukladaj ho ako potvrdené údaje mojej firmy.\nDemo zadanie, vstupy, výsledky a opravy označ ako fiktívne a ulož výhradne do ${demoPath}: zadanie.md, vstup-${inputIndex === 0 ? 'a' : 'b'}.md a vysledok-${inputIndex === 0 ? 'a' : 'b'}.md. Zachovaj existujúce záznamy.\n${continuation}Do skutočného profilu zamestnanca, modelu procesu ani workflowu neprenášaj fakty alebo obmedzenia tejto ukážky (napríklad demo firmu, jej lokalitu či limit slov). Tie patria iba do demo zadania. Trvalú opravu navrhni iba ako všeobecnú znovupoužiteľnú zásadu a pred uložením ju potvrď. Ak výslovne určím pravidlo ako vlastné skutočné pravidlo, over jeho rozsah a moje potvrdenie; samotné demo ho nepotvrdzuje.\n\nDemo kontext:\n${context}\n\nVstup ${inputIndex === 0 ? 'A' : 'B'}:\n${branch.blocks[inputIndex]}`;
}

export async function importSources(sourceDirectory) {
  const documents = {};
  const sources = [];
  for (const filename of workshopFiles) {
    const bytes = await readFile(join(sourceDirectory, filename));
    const markdown = sanitizeSource(bytes, filename);
    documents[filename] = markdown;
    sources.push({ logicalSource: filename, sourceSha256: sha256(bytes), exportedSha256: sha256(Buffer.from(markdown)), textBlockSha256: textBlocks(markdown).map(block => sha256(Buffer.from(block))) });
  }
  parseContent(documents);
  return { documents, provenance: { schema: 1, exportRule, sourceAuthority: 'workshop-participant-materials', sources } };
}

export async function loadSnapshots(directory = join(repositoryRoot, 'content/workshop')) {
  const provenance = JSON.parse(await readFile(join(directory, 'provenance.json'), 'utf8'));
  if (provenance.schema !== 1 || provenance.exportRule !== exportRule || provenance.sources?.length !== 2) throw new Error('Unsupported workshop provenance');
  if (provenance.sources.some(record => !workshopFiles.includes(record.logicalSource) || !/^[a-f0-9]{64}$/.test(record.sourceSha256) || !/^[a-f0-9]{64}$/.test(record.exportedSha256) || !Array.isArray(record.textBlockSha256) || record.textBlockSha256.some(hash => !/^[a-f0-9]{64}$/.test(hash)))) throw new Error('Invalid workshop provenance source/hash');
  const documents = {};
  for (const filename of workshopFiles) {
    const bytes = await readFile(join(directory, filename));
    const record = provenance.sources.find(source => source.logicalSource === filename);
    if (!record || record.exportedSha256 !== sha256(bytes)) throw new Error(`${filename}: exported SHA-256 mismatch`);
    documents[filename] = bytes.toString('utf8');
    const blocks = textBlocks(documents[filename]);
    if (blocks.length !== record.textBlockSha256?.length || blocks.some((block, i) => sha256(Buffer.from(block)) !== record.textBlockSha256[i])) throw new Error(`${filename}: text block SHA-256 mismatch`);
  }
  return { ...parseContent(documents), provenance };
}

// Build only in a fresh sibling stage, then rename. Existing workspace content is never replaced.
// A rename is an individual local operation, not a distributed or multi-file transaction.
export async function writeFreshDirectory(targetPath, files) {
  const target = resolve(targetPath);
  let targetExists = false;
  try {
    const info = await lstat(target);
    if (info.isSymbolicLink() || !info.isDirectory()) throw new Error('Output must be a real new or empty directory');
    if ((await readdir(target)).length) throw new Error(`Refusing non-empty output: ${target}`);
    targetExists = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const parent = dirname(target);
  await mkdir(parent, { recursive: true });
  const stage = join(parent, `.${basename(target)}.stage-${process.pid}`);
  await mkdir(stage); // No reuse of a possibly stale stage.
  try {
    for (const [relativePath, value] of Object.entries(files)) {
      if (relativePath.startsWith('/') || relativePath.split(/[\\/]/).includes('..')) throw new Error('Unsafe artifact path');
      const file = join(stage, relativePath);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, value, { flag: 'wx' });
    }
    // Recheck immediately before committing the stage; any concurrent user file stops apply.
    if (targetExists) {
      if ((await readdir(target)).length) throw new Error('Output changed while building; preserving user content');
      await rmdir(target);
    } else {
      try {
        await lstat(target);
        throw new Error('Output appeared while building; preserving it');
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    await rename(stage, target);
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
}
