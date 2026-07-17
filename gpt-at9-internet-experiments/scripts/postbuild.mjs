import { copyFile, mkdir } from 'node:fs/promises';

const index = new URL('../dist/index.html', import.meta.url);
const routes = [
  'stack-craft',
  'quorum',
  'internet-garden',
  'one-million-blocks',
  'latency',
  'data-scale',
  'internet-archaeology',
  'about',
];

await copyFile(index, new URL('../dist/404.html', import.meta.url));

for (const route of routes) {
  const directory = new URL(`../dist/${route}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  await copyFile(index, new URL('index.html', directory));
}
