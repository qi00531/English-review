import type { AiSettings } from '../capture/model';

const STORAGE_KEY = 'wordJournalAi';
const DEFAULT_SETTINGS: AiSettings = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4.1-mini',
  apiKey: '',
  enabled: true,
};

export type SettingsStorage = {
  get(key: string): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
};

function defaultStorage(): SettingsStorage {
  return chrome.storage.local as SettingsStorage;
}

export async function readAiSettings(storage: SettingsStorage = defaultStorage()): Promise<AiSettings> {
  const stored = (await storage.get(STORAGE_KEY))[STORAGE_KEY] as Partial<AiSettings> | undefined;
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function writeAiSettings(
  settings: AiSettings,
  storage: SettingsStorage = defaultStorage(),
): Promise<void> {
  await storage.set({ [STORAGE_KEY]: settings });
}
