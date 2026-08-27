import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TodayRoute } from '../features/today/TodayRoute';
import { CaptureRoute } from '../features/capture/CaptureRoute';
import { ReviewRoute } from '../features/review/ReviewRoute';
import { AppShell } from '../ui/AppShell';
import { HistoryRoute } from '../features/history/HistoryRoute';
import { SettingsRoute } from '../features/settings/SettingsRoute';

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TodayRoute />} />
        <Route path="/capture" element={<CaptureRoute />} />
        <Route path="/review/:listId" element={<ReviewRoute />} />
        <Route path="/history" element={<HistoryRoute />} />
        <Route path="/settings" element={<SettingsRoute />} />
        <Route path="/inbox" element={<Navigate replace to="/" />} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  const Router = typeof chrome !== 'undefined' && chrome.runtime?.id ? HashRouter : BrowserRouter;
  return <Router><AppRoutes /></Router>;
}
