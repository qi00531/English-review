import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { EntryRecord, ListRecord } from '../../db/schema';
import type { ReviewNode } from '../../domain/models';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { EditEntryForm } from './EditEntryForm';

export type HistoryGroup = { list: ListRecord; entries: EntryRecord[]; reviewNodes: ReviewNode[] };
const formatDate = (date: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));

export function HistoryPage({ groups, onUpdateEntry, onDeleteList }: { groups: HistoryGroup[]; onUpdateEntry: (id: string, patch: Partial<EntryRecord>) => void | Promise<void>; onDeleteList: (id: string) => void | Promise<void> }) {
  const [openId, setOpenId] = useState<string | null>(null); const [editingId, setEditingId] = useState<string | null>(null); const [deleting, setDeleting] = useState<HistoryGroup | null>(null);
  return <section className="history-page page-enter"><header className="section-heading"><p className="eyebrow">Archive</p><h2>全部 Lists</h2><p>按学习日期回看、修正或整理已经保存的内容。</p></header>
    <div className="history-list">{[...groups].sort((a,b) => b.list.listNumber-a.list.listNumber).map((group) => { const open = openId === group.list.id; const pending = group.reviewNodes.some((node) => !node.completedAt); return <article className="history-item" key={group.list.id}>
      <button className="history-summary" type="button" aria-expanded={open} onClick={() => setOpenId(open ? null : group.list.id)}><span><strong>List {group.list.listNumber}</strong><small>{formatDate(group.list.createdDate)}</small></span><span>{group.entries.length} 个词条</span><span className={pending ? 'status-pending' : 'status-done'}>{pending ? '待复习' : '已完成'}</span></button>
      {open && <div className="history-detail">{group.entries.map((entry) => <div className="history-entry" key={entry.id}>{editingId === entry.id ? <EditEntryForm entry={entry} onCancel={() => setEditingId(null)} onSave={async (patch) => { await onUpdateEntry(entry.id, patch); setEditingId(null); }} /> : <><div><strong>{entry.english}</strong><p>{entry.meaningsZh.join('；')}</p><small>{entry.exampleEn} · {entry.exampleZh}</small></div><button className="quiet-icon" type="button" aria-label={`编辑 ${entry.english}`} onClick={() => setEditingId(entry.id)}><Pencil size={17} /></button></>}</div>)}
        <button className="delete-list" type="button" aria-label={`删除 List ${group.list.listNumber}`} onClick={() => setDeleting(group)}><Trash2 size={17} />删除这个 List</button></div>}
    </article>; })}</div>
    {groups.length === 0 && <p className="empty-note">还没有历史内容。今天保存的词条会出现在这里。</p>}
    {deleting && <ConfirmDialog title={`删除 List ${deleting.list.listNumber}？`} description="词条和对应的复习计划都会被永久删除，此操作无法撤销。" confirmLabel="确认删除" onCancel={() => setDeleting(null)} onConfirm={async () => { await onDeleteList(deleting.list.id); setDeleting(null); }} />}
  </section>;
}
