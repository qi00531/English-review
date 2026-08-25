import { access, readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
if (manifest.manifest_version !== 3) throw new Error('dist/manifest.json is not Manifest V3');
const required = ['dist/index.html', `dist/${manifest.background.service_worker}`, ...manifest.content_scripts.flatMap((entry) => entry.js.map((file) => `dist/${file}`))];
for (const file of required) {
  try { await access(file); } catch { throw new Error(`Missing extension artifact: ${file}`); }
}
console.log(`Verified ${required.length + 1} extension artifacts.`);
