import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TodayPage, type TodayListItem } from './TodayPage';

const due: TodayListItem[] = [
  { listId: 'old', listNumber: 1, dueDate: '2026-08-19', wordCount: 12 },
  { listId: 'today', listNumber: 3, dueDate: '2026-08-22', wordCount: 8 },
];

it('shows oldest due List first and explains why capture is locked', () => {
  render(<MemoryRouter><TodayPage due={due} loading={false} /></MemoryRouter>);

  const links = screen.getAllByRole('link', { name: /List/ });
  expect(links[0]).toHaveAccessibleName(/List 1/);
  expect(screen.getByText('还剩 2 个 Lists')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '记录今天所学' })).toBeDisabled();
  expect(screen.getByText(/完成以上复习后解锁/)).toBeInTheDocument();
});

it('unlocks capture when no due List remains', () => {
  render(<MemoryRouter><TodayPage due={[]} loading={false} /></MemoryRouter>);

  expect(screen.getByRole('link', { name: '记录今天所学' })).toHaveAttribute('href', '/capture');
  expect(screen.getByRole('heading', { name: /今天的复习\s*已经完成/ })).toBeInTheDocument();
});
