import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HistoryPage } from './HistoryPage';

const group = {
  list: { id: 'l1', listNumber: 1, createdDate: '2026-08-20' as const, createdAt: '2026-08-20T10:00:00Z' },
  entries: [{ id: 'e1', listId: 'l1', english: 'focus', normalizedEnglish: 'focus', usIpa: '/ˈfoʊkəs/', ukIpa: '/ˈfəʊkəs/', usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['专注', '焦点'], exampleEn: 'Focus on one task.', exampleZh: '专注于一项任务。', audioFallback: 'speech-synthesis' as const, source: 'manual' as const, updatedAt: '2026-08-20T10:00:00Z' }],
  reviewNodes: [{ id: 'n1', listId: 'l1', dueDate: '2026-08-21' as const, completedAt: null, sequence: 0 }],
};

describe('HistoryPage', () => {
  const renderPage = (initialTab: 'plan' | 'lists' = 'plan') => render(
    <MemoryRouter>
      <HistoryPage
        groups={[group]}
        plan={[{ date: '2026-08-24', status: 'due', lists: [{ id: 'l1', listNumber: 1 }] }]}
        today="2026-08-24"
        initialTab={initialTab}
        onUpdateEntry={vi.fn()}
        onDeleteList={vi.fn()}
      />
    </MemoryRouter>,
  );

  it('opens the review plan by default and exposes due List links', () => {
    renderPage();

    expect(screen.getByRole('tab', { name: '复习计划' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('8月24日')).toBeInTheDocument();
    expect(screen.getByText('待复习')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '复习 List 1' })).toHaveAttribute(
      'href', '/review/l1?from=history&tab=plan',
    );
  });

  it('starts with useful history content without a decorative heading or automatic scroll', () => {
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    try {
      renderPage();
      expect(screen.queryByText('Archive')).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: '历史' })).not.toBeInTheDocument();
      expect(screen.queryByText('查看复习安排，或回到任意 List 再练一次。')).not.toBeInTheDocument();
      expect(scrollIntoView).not.toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    }
  });

  it('switches to all Lists and exposes manual review', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('tab', { name: '全部 Lists' }));

    expect(screen.getByText('2026年8月20日')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '开始复习 List 1' })).toHaveAttribute(
      'href', '/review/l1?from=history&tab=lists',
    );
  });

  it('shows list metadata, edits an entry, and confirms deletion', async () => {
    const user = userEvent.setup();
    const onUpdateEntry = vi.fn();
    const onDeleteList = vi.fn();
    render(<MemoryRouter><HistoryPage groups={[group]} plan={[]} today="2026-08-24" initialTab="lists" onUpdateEntry={onUpdateEntry} onDeleteList={onDeleteList} /></MemoryRouter>);
    expect(screen.getByText('2026年8月20日')).toBeInTheDocument();
    expect(screen.getByText('1 个词条')).toBeInTheDocument();
    expect(screen.getByText('待复习')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /List 1/ }));
    await user.click(screen.getByRole('button', { name: '编辑 focus' }));
    await user.clear(screen.getByLabelText('中文释义'));
    await user.type(screen.getByLabelText('中文释义'), '集中注意力\n焦点');
    await user.click(screen.getByRole('button', { name: '保存修改' }));
    expect(onUpdateEntry).toHaveBeenCalledWith('e1', expect.objectContaining({ meaningsZh: ['集中注意力', '焦点'] }));
    await user.click(screen.getByRole('button', { name: '删除 List 1' }));
    expect(onDeleteList).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '确认删除' }));
    expect(onDeleteList).toHaveBeenCalledWith('l1');
  });
});
