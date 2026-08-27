import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TodayPage, type TodayListItem } from './TodayPage';

const due: TodayListItem[] = [
  { listId: 'old', listNumber: 1, dueDate: '2026-08-19', wordCount: 12 },
  { listId: 'today', listNumber: 3, dueDate: '2026-08-22', wordCount: 8 },
];

it('shows oldest due List first while keeping recording available', () => {
  render(<MemoryRouter><TodayPage due={due} loading={false} progress={{ completed: 0, total: 2 }} streakDays={5} /></MemoryRouter>);

  const links = screen.getAllByRole('link', { name: /List/ });
  expect(links[0]).toHaveAccessibleName(/List 1/);
  expect(screen.getByRole('heading', { name: '今天还有 2 个 List 待复习' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '记录今天所学' })).toHaveAttribute('href', '/capture');
  expect(screen.getByText('连续学习')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.queryByText('待整理')).not.toBeInTheDocument();
});

it('unlocks capture when no due List remains', () => {
  render(<MemoryRouter><TodayPage due={[]} loading={false} progress={{ completed: 1, total: 1 }} streakDays={5} /></MemoryRouter>);

  expect(screen.getByRole('heading', { name: '今天的复习已经完成。' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '记录今天所学' })).toHaveAttribute('href', '/capture');
  expect(screen.queryByText(/可以记录|保持每天|表现很好/)).not.toBeInTheDocument();
  expect(screen.getAllByRole('link').filter((link) => link.classList.contains('primary-capture'))).toHaveLength(1);
});
