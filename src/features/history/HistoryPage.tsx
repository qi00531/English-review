import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import type { EntryRecord, ListRecord } from '../../db/schema';
import type { LocalDate, ReviewNode } from '../../domain/models';
import type { ReviewPlanRow } from '../../domain/review-plan';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { EditEntryForm } from './EditEntryForm';

export type HistoryGroup = { list: ListRecord; entries: EntryRecord[]; reviewNodes: ReviewNode[] };
type HistoryTab = 'plan' | 'lists';

const formatDate = (date: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
const formatPlanDate = (date: string) => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
const statusLabels = { completed: '已完成', due: '待复习', overdue: '已逾期', upcoming: '未开始' } as const;

export function HistoryPage({ groups, plan, today, initialTab, onUpdateEntry, onDeleteList }: {
  groups: HistoryGroup[]; plan: ReviewPlanRow[]; today: LocalDate; initialTab: HistoryTab;
  onUpdateEntry: (id: string, patch: Partial<EntryRecord>) => void | Promise<void>;
  onDeleteList: (id: string) => void | Promise<void>;
}) {
  const [tab, setTab] = useState<HistoryTab>(initialTab);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<HistoryGroup | null>(null);
  return <section className="history-page page-enter">
    <div className="history-tabs" role="tablist" aria-label="历史内容">
      <button type="button" role="tab" aria-selected={tab === 'plan'} aria-controls="history-plan" onClick={() => setTab('plan')}>复习计划</button>
      <button type="button" role="tab" aria-selected={tab === 'lists'} aria-controls="history-lists" onClick={() => setTab('lists')}>全部 Lists</button>
    </div>
    {tab === 'plan' && <div id="history-plan" role="tabpanel" className="review-plan">
      {plan.map((row) => <article className={`review-plan-row review-plan-row--${row.status}${row.date === today ? ' review-plan-row--today' : ''}`} key={row.date}>
        <time dateTime={row.date}>{formatPlanDate(row.date)}</time>
        <div className="review-plan-lists">{row.lists.map((list) => row.status === 'upcoming'
          ? <span key={list.id}>List {list.listNumber}</span>
          : <Link key={list.id} to={`/review/${list.id}?from=history&tab=plan`} aria-label={`复习 List ${list.listNumber}`}>List {list.listNumber}</Link>)}</div>
        <span className="review-plan-status">{statusLabels[row.status]}</span>
      </article>)}
      {plan.length === 0 && <p className="empty-note">还没有复习计划。保存今天的词条后，计划会出现在这里。</p>}
    </div>}
    {tab === 'lists' && <div id="history-lists" role="tabpanel" className="history-list">
      {[...groups].sort((a, b) => b.list.listNumber - a.list.listNumber).map((group) => {
        const open = openId === group.list.id;
        const pending = group.reviewNodes.some((node) => !node.completedAt);
        return <article className="history-item" key={group.list.id}>
          <div className="history-summary-row">
            <button className="history-summary" type="button" aria-expanded={open} onClick={() => setOpenId(open ? null : group.list.id)}><span><strong>List {group.list.listNumber}</strong><small>{formatDate(group.list.createdDate)}</small></span><span>{group.entries.length} 个词条</span><span className={pending ? 'status-pending' : 'status-done'}>{pending ? '待复习' : '已完成'}</span></button>
            <Link className="history-review-link" to={`/review/${group.list.id}?from=history&tab=lists`} aria-label={`开始复习 List ${group.list.listNumber}`}>开始复习 <span aria-hidden="true">→</span></Link>
          </div>
          {open && <div className="history-detail">{group.entries.map((entry) => <div className="history-entry" key={entry.id}>{editingId === entry.id ? <EditEntryForm entry={entry} onCancel={() => setEditingId(null)} onSave={async (patch) => { await onUpdateEntry(entry.id, patch); setEditingId(null); }} /> : <><div><strong>{entry.english}</strong><p>{entry.meaningsZh.join('；')}</p><small>{entry.exampleEn} · {entry.exampleZh}</small></div><button className="quiet-icon" type="button" aria-label={`编辑 ${entry.english}`} onClick={() => setEditingId(entry.id)}><Pencil size={17} /></button></>}</div>)}
            <button className="delete-list" type="button" aria-label={`删除 List ${group.list.listNumber}`} onClick={() => setDeleting(group)}><Trash2 size={17} />删除这个 List</button></div>}
        </article>;
      })}
      {groups.length === 0 && <p className="empty-note">还没有历史内容。今天保存的词条会出现在这里。</p>}
    </div>}
    {deleting && <ConfirmDialog title={`删除 List ${deleting.list.listNumber}？`} description="词条和对应的复习计划都会被永久删除，此操作无法撤销。" confirmLabel="确认删除" onCancel={() => setDeleting(null)} onConfirm={async () => { await onDeleteList(deleting.list.id); setDeleting(null); }} />}
  </section>;
}
