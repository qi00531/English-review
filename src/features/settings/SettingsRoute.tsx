import { useEffect, useState } from 'react';
import { exportBackup, importBackup } from '../../db/backup';
import { repository } from '../../db';
import { SettingsPage, type Accent } from './SettingsPage';
import type { AiSettings } from '../../capture/model';
import { readAiSettings, writeAiSettings } from '../../extension/settings';

function download(json: string, name: string) { const url = URL.createObjectURL(new Blob([json], { type: 'application/json' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); }
export function SettingsRoute() {
  const [accent, setAccent] = useState<Accent>('us'); const [health, setHealth] = useState<'checking'|'available'|'unavailable'>('checking');
  const isExtension = typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);
  const [aiSettings, setAiSettings] = useState<AiSettings>();
  useEffect(() => { void repository.snapshot().then((s) => { const value = s.settings.find((x) => x.key === 'accent')?.value; if (value === 'uk') setAccent('uk'); }); if (isExtension) { void readAiSettings().then((value) => { setAiSettings(value); setHealth('available'); }); } else { void fetch('/api/health').then((r) => setHealth(r.ok ? 'available' : 'unavailable')).catch(() => setHealth('unavailable')); } }, [isExtension]);
  const saveAccent = (value: Accent) => { setAccent(value); void repository.setSetting('accent', value); };
  const backup = async (prefix = 'english-review') => download(await exportBackup(repository), `${prefix}-${new Date().toISOString().slice(0,10)}.json`);
  return <SettingsPage accent={accent} health={health} aiSettings={aiSettings} onSaveAi={async (value) => { await writeAiSettings(value); setAiSettings(value); }} onAccentChange={saveAccent} onExport={() => void backup()} onImport={(file) => void file.text().then(async (text) => { await backup('english-review-safety'); await importBackup(repository, text, 'replace'); window.location.reload(); }).catch((error) => window.alert(error instanceof Error ? error.message : '导入失败'))} onClear={() => repository.clearAll()} />;
}
