import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { importSources, repositoryRoot, workshopFiles } from './workshop-content.mjs';

const args = process.argv.slice(2);
if (!['--check', '--write'].includes(args[0]) || args.length !== 2) {
  console.error('Usage: node scripts/export-workshop.mjs --check|--write <canonical-materials-directory>');
  process.exit(1);
}
const { documents, provenance } = await importSources(args[1]);
const exported = { ...documents, 'provenance.json': JSON.stringify(provenance, null, 2) + '\n' };
const snapshotDirectory = join(repositoryRoot, 'content/workshop');
for (const [filename, content] of Object.entries(exported)) {
  if (args[0] === '--check') {
    if (await readFile(join(snapshotDirectory, filename), 'utf8') !== content) throw new Error(`${filename}: snapshot differs from canonical export`);
  } else {
    // Explicit maintainer command; only generated repository snapshots, never source documents.
    await writeFile(join(snapshotDirectory, filename), content);
  }
}
console.log(`${args[0] === '--check' ? 'PASS: source/export equality' : 'Exported participant snapshots'}; ${workshopFiles.length} sources, 7 prompts, 3 branches, 6 inputs.`);
