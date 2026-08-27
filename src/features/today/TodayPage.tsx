import { ArrowRight, ArrowUpRight, CalendarDays, PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LocalDate } from '../../domain/models';
import { Progress } from '../../ui/Progress';

export type TodayListItem = {
  listId: string;
  listNumber: number;
  dueDate: LocalDate;
  wordCount: number;
};

type TodayPageProps = {
  due: TodayListItem[];
  loading: boolean;
  progress: { completed: number; total: number };
  streakDays: number;
};

export function TodayPage({ due, loading, progress, streakDays }: TodayPageProps) {
  if (loading) return <section className="today-page today-page--loading">
    <div className="today-progress"><Progress value={0} max={1} label="今日进度" /></div>
    <p className="today-loading" role="status">正在整理今天的学习计划…</p>
  </section>;

  const locked = due.length > 0;
  return (
    <section className="today-page page-enter">
      <div className="today-progress"><Progress value={progress.completed} max={progress.total} label="今日进度" /></div>
      <div className={`today-core ${locked ? 'today-core--pending' : ''}`}>
        <h2 className="today-status">{locked ? `今天还有 ${due.length} 个 List 待复习` : '今天的复习已经完成。'}</h2>
        {locked ? <><div className="due-list" aria-label="待复习 Lists">
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
        </div><Link className="secondary-capture" to="/capture" aria-label="记录今天所学">
          <PencilLine aria-hidden="true" size={17} strokeWidth={1.6} />
          <span>记录今天所学</span>
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.6} />
        </Link></> : <Link className="primary-capture" to="/capture" aria-label="记录今天所学">
          <PencilLine aria-hidden="true" size={20} strokeWidth={1.6} />
          <span>记录今天所学</span>
          <ArrowRight aria-hidden="true" size={20} strokeWidth={1.6} />
        </Link>}
      </div>
      <div className="learning-streak" aria-label={`连续学习 ${streakDays} 天`}>
        <span aria-hidden="true" className="streak-line" />
        <span className="streak-copy"><CalendarDays aria-hidden="true" size={19} strokeWidth={1.5} /><span>连续学习</span><strong>{streakDays}</strong><span>天</span></span>
        <span aria-hidden="true" className="streak-line" />
      </div>
    </section>
  );
}
