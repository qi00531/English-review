import { useEffect, useState } from 'react';
import { BookOpenText, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname, search } = useLocation();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0);
  const pageClass = pathname === '/' ? 'app-shell--home' : 'app-shell--inner';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 0);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  return (
    <div className={`app-shell ${pageClass}`} data-testid="app-shell">
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
        <NavLink className="brand" to="/" aria-label="Word Journal 首页">
          <BookOpenText aria-hidden="true" size={22} strokeWidth={1.6} />
          <h1>Word Journal</h1>
        </NavLink>
        <nav aria-label="主要导航">
          <NavLink className="nav-action history-nav-link" to="/history">历史</NavLink>
          <span className="nav-separator" role="separator" aria-label="导航分隔" />
          <NavLink className="nav-action icon-link" to="/settings" aria-label="设置">
            <Settings aria-hidden="true" size={20} strokeWidth={1.6} />
          </NavLink>
        </nav>
      </header>
      <main id="main-content">{children}</main>
    </div>
  );
}
