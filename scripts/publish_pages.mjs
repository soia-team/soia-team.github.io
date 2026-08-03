import { cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const build = resolve(root, 'soia-site/dist-pages');

for (const target of ['assets', 'index.html', '404.html', 'favicon.svg']) {
  await rm(resolve(root, target), { recursive: true, force: true });
}
await cp(build, root, { recursive: true, force: true });
console.log('Published dist-pages to the repository root.');
