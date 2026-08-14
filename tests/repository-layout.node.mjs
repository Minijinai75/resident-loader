import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('repository root is directly installable by SillyTavern', async () => {
  const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));

  assert.equal(manifest.js, 'dist/index.js');
  assert.equal(manifest.css, 'dist/style.css');
  assert.equal(manifest.homePage, 'https://github.com/Minijinai75/resident-loader');
  assert.equal(manifest.auto_update, true);
  await access(path.join(root, manifest.js));
  await access(path.join(root, manifest.css));
});
