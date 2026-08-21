import { useRef, useState } from 'react';
import { ConfirmDialog } from '../../ui/ConfirmDialog';

export type Accent = 'us' | 'uk';
export function SettingsPage({ accent, health, onAccentChange, onExport, onImport, onClear }: { accent: Accent; health: 'checking' | 'available' | 'unavailable'; onAccentChange: (accent: Accent) => void; onExport: () => void; onImport: (file: File) => void; onClear: () => void | Promise<void> }) {
  const inputRef = useRef<HTMLInputElement>(null); const [confirmClear, setConfirmClear] = useState(false);
  const healthText = health === 'checking' ? '正在检查词典与 AI 服务' : health === 'available' ? '词典与 AI 服务可用' : '服务暂不可用，已保存内容仍可复习';
  return <section className="settings-page page-enter"><header className="section-heading"><p className="eyebrow">Preferences</p><h2>设置</h2><p>调整发音，并管理只保存在这台浏览器中的学习记录。</p></header>
    <section className="settings-section"><h3>发音偏好</h3><div className="choice-row" role="radiogroup" aria-label="默认发音"><label><input type="radio" name="accent" checked={accent === 'us'} onChange={() => onAccentChange('us')} />美式发音</label><label><input type="radio" name="accent" checked={accent === 'uk'} onChange={() => onAccentChange('uk')} />英式发音</label></div><p className="service-health" aria-live="polite">{healthText}</p></section>
    <section className="settings-section"><h3>备份与恢复</h3><p>建议定期导出 JSON。导入前会自动下载一份当前数据的安全备份。</p><div className="settings-actions"><button className="action" type="button" onClick={onExport}>导出 JSON 备份</button><button type="button" onClick={() => inputRef.current?.click()}>从 JSON 恢复</button><input ref={inputRef} className="sr-only" type="file" accept="application/json,.json" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} /></div><p className="local-warning">数据保存在浏览器 IndexedDB 中；清除浏览器站点数据也会删除全部学习记录。</p></section>
    <section className="danger-zone"><h3>清空数据</h3><p>永久删除全部 Lists、词条、复习进度和偏好。</p><button type="button" onClick={() => setConfirmClear(true)}>清空全部本地数据</button></section>
    {confirmClear && <ConfirmDialog title="清空全部本地数据？" description="此操作无法撤销。建议先导出一份 JSON 备份。" confirmLabel="确认清空" onCancel={() => setConfirmClear(false)} onConfirm={async () => { await onClear(); setConfirmClear(false); }} />}
  </section>;
}
