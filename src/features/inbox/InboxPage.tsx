import type { CaptureDraft } from '../../capture/model';

type Props = { drafts: CaptureDraft[]; locked: boolean; onPromote: (ids: string[]) => void | Promise<void>; onDelete: (id: string) => void | Promise<void>; onUpdate: (id: string, patch: Partial<CaptureDraft>) => void | Promise<void> };
export function InboxPage({ drafts, locked, onPromote, onDelete, onUpdate }: Props) {
  const ready = drafts.filter((draft) => draft.status === 'ready');
  return <section className="inbox-page page-enter">
    <header className="section-heading"><p className="eyebrow">Captured</p><h2>待整理</h2><p>{locked ? '完成今天的复习后即可生成新 List' : '检查释义与例句，然后一次生成今天的新 List。'}</p></header>
    <div className="inbox-list">
      {drafts.map((draft) => <article className="inbox-row" key={draft.id}>
        <div className="inbox-word"><strong>{draft.text}</strong><span>{draft.type === 'word' ? '单词' : '短语'}</span></div>
        <label>中文释义<textarea aria-label={`${draft.text} 中文释义`} defaultValue={draft.meaningsZh.join('；')} onBlur={(event) => void onUpdate(draft.id, { meaningsZh: event.target.value.split(/[；;\n]/).map((v) => v.trim()).filter(Boolean) })} /></label>
        <label>英文例句<textarea aria-label={`${draft.text} 英文例句`} defaultValue={draft.exampleEn} onBlur={(event) => void onUpdate(draft.id, { exampleEn: event.target.value.trim() })} /></label>
        <button className="quiet-delete" type="button" onClick={() => void onDelete(draft.id)}>移除</button>
      </article>)}
    </div>
    <div className="inbox-footer"><button className="action" type="button" disabled={locked || ready.length === 0} onClick={() => void onPromote(ready.map((draft) => draft.id))}>生成新 List</button></div>
  </section>;
}
