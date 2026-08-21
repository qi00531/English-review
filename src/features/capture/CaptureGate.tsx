import { Link } from 'react-router-dom';

export function CaptureGate({ loading, dueCount, children }: {
  loading: boolean; dueCount: number; children: React.ReactNode;
}) {
  if (loading) return (
    <section className="page-measure">
      <p className="eyebrow">New words</p>
      <h2 className="page-title">记录今天所学</h2>
      <p className="page-copy" role="status">正在确认今日任务…</p>
    </section>
  );
  if (dueCount > 0) return (
    <section className="page-measure">
      <p className="eyebrow">Review first</p>
      <h2 className="page-title">先完成今天的复习</h2>
      <p className="page-copy">还有 {dueCount} 个 Lists 待完成，完成后会自动解锁今日录入。</p>
      <Link className="capture-link" to="/">返回今日任务</Link>
    </section>
  );
  return children;
}
