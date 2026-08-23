import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

it.each([
  ['/', '今天的复习已经完成。'],
  ['/capture', '记录今天所学'],
  ['/review/list-1', '开始复习'],
  ['/history', '全部 Lists'],
  ['/settings', '设置'],
])('renders the expected route for %s', async (route, heading) => {
  render(<MemoryRouter initialEntries={[route]}><AppRoutes /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
});
