import { useState } from 'react';
import type { EntryRecord } from '../../db/schema';

export function EditEntryForm({ entry, onSave, onCancel }: { entry: EntryRecord; onSave: (patch: Partial<EntryRecord>) => void | Promise<void>; onCancel: () => void }) {
  const [english, setEnglish] = useState(entry.english);
  const [meanings, setMeanings] = useState(entry.meaningsZh.join('\n'));
  const [exampleEn, setExampleEn] = useState(entry.exampleEn);
  const [exampleZh, setExampleZh] = useState(entry.exampleZh);
  const [usIpa, setUsIpa] = useState(entry.usIpa ?? '');
  const [ukIpa, setUkIpa] = useState(entry.ukIpa ?? '');
  return <form className="edit-entry" onSubmit={(event) => { event.preventDefault(); void onSave({ english: english.trim(), normalizedEnglish: english.trim().toLocaleLowerCase('en-US'), meaningsZh: meanings.split('\n').map((item) => item.trim()).filter(Boolean), exampleEn: exampleEn.trim(), exampleZh: exampleZh.trim(), usIpa: usIpa.trim() || null, ukIpa: ukIpa.trim() || null }); }}>
    <label>英文<input value={english} onChange={(e) => setEnglish(e.target.value)} required /></label>
    <label>中文释义<textarea value={meanings} onChange={(e) => setMeanings(e.target.value)} required /></label>
    <label>英文例句<textarea value={exampleEn} onChange={(e) => setExampleEn(e.target.value)} required /></label>
    <label>例句中文<textarea value={exampleZh} onChange={(e) => setExampleZh(e.target.value)} required /></label>
    <div className="edit-pair"><label>美式音标<input value={usIpa} onChange={(e) => setUsIpa(e.target.value)} /></label><label>英式音标<input value={ukIpa} onChange={(e) => setUkIpa(e.target.value)} /></label></div>
    <div className="edit-actions"><button type="button" onClick={onCancel}>取消</button><button className="action" type="submit">保存修改</button></div>
  </form>;
}
