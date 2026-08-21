import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LocalDate } from '../../domain/models';
import { Progress } from '../../ui/Progress';

export type TodayListItem = {
  listId: string;
  listNumber: number;
  dueDate: LocalDate;
  wordCount: number;
};

export function TodayPage({ due, loading }: { due: TodayListItem[]; loading: boolean }) {
  if (loading) return (
    <section className="page-measure">
      <p className="eyebrow">Today</p>
      <h2 className="page-title">今日复习</h2>
      <p className="page-copy" role="status">正在整理今天的学习计划…</p>
    </section>
  );

  const locked = due.length > 0;
  return (
    <section className="today-page page-enter">
      <div className="today-intro">
        <p className="eyebrow">Today</p>
        <h2 className="today-title">
          {locked ? <>完成今天，<br />再认识新的词。</> : <>今天的复习<br />已经完成。</>}
        </h2>
        <p className="today-subtitle">
          {locked ? `还剩 ${due.length} 个 Lists` : '可以记录今天新学到的内容了。'}
        </p>
      </div>

      <div className="today-work">
        <Progress value={0} max={Math.max(due.length, 1)} label={locked ? '今日进度' : '全部完成'} />
        <div className="due-list" aria-label="待复习 Lists">
          {due.map((item) => (
            <Link
              className="due-row"
              key={`${item.listId}-${item.dueDate}`}
              to={`/review/${item.listId}`}
              aria-label={`复习 List ${item.listNumber}，${item.wordCount} 个词`}
            >
              <span><strong>List {item.listNumber}</strong><small>{item.dueDate} 到期</small></span>
              <span className="due-count">{item.wordCount} 词</span>
              <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.6} />
            </Link>
          ))}
        </div>

        {locked ? (
          <div className="capture-lock">
            <button type="button" disabled><LockKeyhole aria-hidden="true" size={17} />记录今天所学</button>
            <p>完成以上复习后解锁</p>
          </div>
        ) : (
          <Link className="capture-link" to="/capture">记录今天所学 <ArrowUpRight aria-hidden="true" size={18} /></Link>
        )}
      </div>
    </section>
  );
}
