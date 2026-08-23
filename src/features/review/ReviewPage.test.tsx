import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { EntryRecord } from '../../db/schema';
import { ReviewPage, type ReviewAudioPort } from './ReviewPage';

const entries: EntryRecord[] = [
  { id: 'one', listId: 'list-1', english: 'retain', normalizedEnglish: 'retain', usIpa: '/rɪˈteɪn/', ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['保持', '保留', '记住', '雇用'], exampleEn: 'We retain more through review.', exampleZh: '通过复习，我们记住更多。', audioFallback: 'speech-synthesis', source: 'ai', updatedAt: 'now' },
  { id: 'two', listId: 'list-1', english: 'subtle', normalizedEnglish: 'subtle', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['不易察觉的', '微妙的'], exampleEn: 'There was a subtle change.', exampleZh: '发生了细微的变化。', audioFallback: 'speech-synthesis', source: 'ai', updatedAt: 'now' },
];

it('supports focused word review, table review, visibility modes, audio, and completion placement', async () => {
  const user = userEvent.setup();
  const audio: ReviewAudioPort = {
    loopCurrent: vi.fn(), playList: vi.fn(), playRow: vi.fn(), pause: vi.fn(),
  };
  const complete = vi.fn();
  render(<MemoryRouter><ReviewPage listId="list-1" listNumber={1} entries={entries} audio={audio} onComplete={complete} backHref="/history?tab=lists" backLabel="返回历史" /></MemoryRouter>);

  expect(screen.getByRole('link', { name: '返回历史' })).toHaveAttribute('href', '/history?tab=lists');
  expect(screen.getByRole('heading', { name: 'retain' })).toBeInTheDocument();
  expect(audio.loopCurrent).toHaveBeenCalledWith(entries[0], 'us');
  expect(screen.queryByText(entries[0].exampleZh)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '完成复习' })).not.toBeInTheDocument();

  await user.click(screen.getByText(entries[0].exampleEn));
  expect(screen.getByText(entries[0].exampleZh)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '下一个' }));
  expect(screen.getByRole('button', { name: '完成复习' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '表格视图' }));
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '完成复习' })).toBeInTheDocument();
  await user.click(screen.getByRole('row', { name: /retain/ }));
  expect(audio.playRow).toHaveBeenCalledWith(entries[0], 'us');

  await user.click(screen.getByRole('tab', { name: '英文' }));
  expect(screen.queryByText('保持；保留；记住；雇用')).not.toBeInTheDocument();
});
