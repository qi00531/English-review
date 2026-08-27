import { format } from 'date-fns';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import type { RepositorySnapshot } from '../../db/repository';
import type { LocalDate } from '../../domain/models';
import { ReviewRoute, type ReviewRepositoryPort } from './ReviewRoute';

const list = { id: 'l1', listNumber: 1, createdDate: '2026-08-20' as LocalDate, createdAt: '2026-08-20T10:00:00Z' };
const entry = { id: 'e1', listId: 'l1', english: 'focus', normalizedEnglish: 'focus', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['专注'], exampleEn: 'Focus now.', exampleZh: '现在专注。', audioFallback: 'speech-synthesis' as const, source: 'manual' as const, updatedAt: 'now' };
const audio = { loopCurrent: vi.fn().mockResolvedValue('playing'), playList: vi.fn().mockResolvedValue('playing'), playRow: vi.fn().mockResolvedValue('playing'), pause: vi.fn(), subscribe: vi.fn(() => vi.fn()), dispose: vi.fn() };

function Location() {
  const location = useLocation();
  return <p>{location.pathname}{location.search}</p>;
}

function renderRoute(repository: ReviewRepositoryPort, entryPath = '/review/l1?from=history&tab=lists') {
  render(<MemoryRouter initialEntries={[entryPath]}><Routes>
    <Route path="/review/:listId" element={<ReviewRoute reviewRepository={repository} createAudio={() => audio} />} />
    <Route path="/history" element={<Location />} />
    <Route path="/" element={<Location />} />
  </Routes></MemoryRouter>);
}

function snapshot(dueDate: LocalDate): RepositorySnapshot {
  return { lists: [list], entries: [entry], reviewNodes: [{ id: 'n1', listId: 'l1', dueDate, completedAt: null, sequence: 0 }], drafts: [], settings: [], captureDrafts: [] };
}

it('keeps a due-today history review outside formal schedule progress', async () => {
  const today = format(new Date(), 'yyyy-MM-dd') as LocalDate;
  const repository = { snapshot: vi.fn().mockResolvedValue(snapshot(today)), completeReviewNode: vi.fn().mockResolvedValue(undefined) };
  renderRoute(repository);

  await userEvent.click(await screen.findByRole('button', { name: '完成复习' }));

  expect(repository.completeReviewNode).not.toHaveBeenCalled();
  expect(await screen.findByText('/history?tab=lists')).toBeInTheDocument();
});

it('completes the oldest due node when opened from today tasks', async () => {
  const today = format(new Date(), 'yyyy-MM-dd') as LocalDate;
  const repository = { snapshot: vi.fn().mockResolvedValue(snapshot(today)), completeReviewNode: vi.fn().mockResolvedValue(undefined) };
  renderRoute(repository, '/review/l1');

  await userEvent.click(await screen.findByRole('button', { name: '完成复习' }));

  expect(repository.completeReviewNode).toHaveBeenCalledWith('n1');
  expect(await screen.findByText('/')).toBeInTheDocument();
});

it('treats a future-only List as extra review without changing its plan', async () => {
  const repository = { snapshot: vi.fn().mockResolvedValue(snapshot('2999-08-25')), completeReviewNode: vi.fn() };
  renderRoute(repository, '/review/l1?from=history&tab=plan');

  await userEvent.click(await screen.findByRole('button', { name: '完成复习' }));

  expect(repository.completeReviewNode).not.toHaveBeenCalled();
  expect(await screen.findByText('/history?tab=plan')).toBeInTheDocument();
});

it('shows a recoverable state when the List no longer exists', async () => {
  const repository = { snapshot: vi.fn().mockResolvedValue({ ...snapshot('2999-08-25'), lists: [] }), completeReviewNode: vi.fn() };
  renderRoute(repository);

  expect(await screen.findByText('这个 List 不存在或已被删除')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: '返回历史' })).toHaveAttribute('href', '/history?tab=lists');
});
