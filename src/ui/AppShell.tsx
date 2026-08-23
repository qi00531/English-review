import { BookOpenText, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const pageClass = pathname === '/' ? 'app-shell--home' : 'app-shell--inner';

  return (
    <div className={`app-shell ${pageClass}`} data-testid="app-shell">
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Word Journal 首页">
          <BookOpenText aria-hidden="true" size={22} strokeWidth={1.6} />
          <h1>Word Journal</h1>
        </NavLink>
        <nav aria-label="主要导航">
          <NavLink to="/history">历史</NavLink>
          <span className="nav-separator" role="separator" aria-label="导航分隔" />
          <NavLink className="icon-link" to="/settings" aria-label="设置">
            <Settings aria-hidden="true" size={20} strokeWidth={1.6} />
          </NavLink>
        </nav>
      </header>
      <main id="main-content">{children}</main>
    </div>
  );
}
