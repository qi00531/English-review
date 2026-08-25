import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

it.each([
  ['/', '今天的复习已经完成。'],
  ['/capture', '记录今天所学'],
  ['/review/list-1', '开始复习'],
  ['/settings', '设置'],
  ['/inbox', '待整理'],
])('renders the expected route for %s', async (route, heading) => {
  render(<MemoryRouter initialEntries={[route]}><AppRoutes /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
});

it('renders History directly from its content tabs', async () => {
  render(<MemoryRouter initialEntries={['/history']}><AppRoutes /></MemoryRouter>);
  expect(await screen.findByRole('tab', { name: '复习计划' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: '历史' })).not.toBeInTheDocument();
});
