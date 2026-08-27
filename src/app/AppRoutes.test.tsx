import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

vi.mock('../features/today/useTodayState', () => ({
  useTodayState: () => ({
    due: [],
    loading: false,
    progress: { completed: 0, total: 1 },
    streakDays: 0,
  }),
}));

it.each([
  ['/', '今天的复习已经完成。'],
  ['/capture', '记录今天所学'],
  ['/review/list-1', '开始复习'],
  ['/settings', '设置'],
])('renders the expected route for %s', async (route, heading) => {
  render(<MemoryRouter initialEntries={[route]}><AppRoutes /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
});

it('redirects the legacy inbox route to today', async () => {
  render(<MemoryRouter initialEntries={['/inbox']}><AppRoutes /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: '今天的复习已经完成。' })).toBeInTheDocument();
  expect(screen.queryByText('待整理')).not.toBeInTheDocument();
});

it('renders History directly from its content tabs', async () => {
  render(<MemoryRouter initialEntries={['/history']}><AppRoutes /></MemoryRouter>);
  expect(await screen.findByRole('tab', { name: '复习计划' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: '历史' })).not.toBeInTheDocument();
});
