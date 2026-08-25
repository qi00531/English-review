import { describe, expect, it } from 'vitest';
import { readAiSettings, writeAiSettings, type SettingsStorage } from './settings';

function memoryStorage(initial: Record<string, unknown> = {}) {
  const values = { ...initial };
  const storage: SettingsStorage & { values: Record<string, unknown> } = {
    values,
    async get(key) { return { [key]: values[key] }; },
    async set(items) { Object.assign(values, items); },
  };
  return storage;
}

describe('extension AI settings', () => {
  it('returns safe defaults without an API key', async () => {
    await expect(readAiSettings(memoryStorage())).resolves.toEqual({
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4.1-mini',
      apiKey: '',
      enabled: true,
    });
  });

  it('writes the key only to the supplied local storage adapter', async () => {
    const storage = memoryStorage();
    const settings = { baseUrl: 'https://example.test/v1', model: 'model', apiKey: 'secret', enabled: false };
    await writeAiSettings(settings, storage);
    expect(storage.values.wordJournalAi).toEqual(settings);
    await expect(readAiSettings(storage)).resolves.toEqual(settings);
  });
});
