import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TodayRoute } from '../features/today/TodayRoute';
import { AppShell } from '../ui/AppShell';

function Page({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="page-enter page-measure">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="page-title">{title}</h2>
      <div className="page-copy">{children}</div>
    </section>
  );
}

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TodayRoute />} />
        <Route path="/capture" element={<Page eyebrow="New words" title="记录今天所学">输入英文，系统会补全学习内容。</Page>} />
        <Route path="/review/:listId" element={<Page eyebrow="Review" title="开始复习">专注完成当前 List。</Page>} />
        <Route path="/history" element={<Page eyebrow="Archive" title="全部 Lists">按学习日期回看历史内容。</Page>} />
        <Route path="/settings" element={<Page eyebrow="Preferences" title="设置">管理发音、备份与本地数据。</Page>} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
