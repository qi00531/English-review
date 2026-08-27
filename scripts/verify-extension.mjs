import { access, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('dist/manifest.json is not Manifest V3');
const required = ['dist/index.html', `dist/${manifest.background.service_worker}`, ...manifest.content_scripts.flatMap((entry) => entry.js.map((file) => `dist/${file}`))];
for (const file of required) {
  try { await access(file); } catch { throw new Error(`Missing extension artifact: ${file}`); }
}
const indexHtml = await readFile('dist/index.html', 'utf8');
const indexScripts = [...indexHtml.matchAll(/<script[^>]+src="\/?([^"]+)"/g)].map((match) => match[1]);
const scriptFiles = [
  manifest.background.service_worker,
  ...manifest.content_scripts.flatMap((entry) => entry.js),
  ...indexScripts,
];
const assetText = (await Promise.all(
  [...new Set(scriptFiles)].map((file) => readFile(`dist/${file}`, 'utf8')),
)).join('\n');
assert.ok(assetText.includes('加入今日 List'), 'Built extension is missing direct-to-List capture copy');
assert.ok(!assetText.includes('加入待整理'), 'Built extension still contains obsolete inbox capture copy');
console.log(`Verified ${required.length + 1} extension artifacts.`);
