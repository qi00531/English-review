import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

test('built extension keeps its manifest and privacy contract', async () => {
  const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
  expect(manifest.manifest_version).toBe(3);
  expect(manifest.host_permissions).toEqual(['http://*/*', 'https://*/*']);
  expect(JSON.stringify(manifest)).not.toMatch(/"history"|"cookies"|"webRequest"/);

  const scripts = await Promise.all([
    readFile('dist/extension/background.js', 'utf8'),
    readFile('dist/extension/content.js', 'utf8'),
  ]);
  expect(scripts.join('\n')).not.toMatch(/sourceUrl|sourceTitle|surroundingContext/);
});
