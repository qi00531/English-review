import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

it.each([
  ['/', '今日复习'],
  ['/capture', '记录今天所学'],
  ['/review/list-1', '开始复习'],
  ['/history', '全部 Lists'],
  ['/settings', '设置'],
])('renders the expected route for %s', (route, heading) => {
  render(<MemoryRouter initialEntries={[route]}><AppRoutes /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
});
