import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { EntryRecord } from '../../db/schema';
import { ReviewPage, type ReviewAudioPort } from './ReviewPage';
import type { PlaybackResult } from '../../audio/speechFallback';

const entries: EntryRecord[] = [
  { id: 'one', listId: 'list-1', english: 'retain', normalizedEnglish: 'retain', usIpa: '/rɪˈteɪn/', ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['保持', '保留', '记住', '雇用'], exampleEn: 'We retain more through review.', exampleZh: '通过复习，我们记住更多。', audioFallback: 'speech-synthesis', source: 'ai', updatedAt: 'now' },
  { id: 'two', listId: 'list-1', english: 'subtle', normalizedEnglish: 'subtle', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['不易察觉的', '微妙的'], exampleEn: 'There was a subtle change.', exampleZh: '发生了细微的变化。', audioFallback: 'speech-synthesis', source: 'ai', updatedAt: 'now' },
];

function makeAudio(): ReviewAudioPort {
  return {
    loopCurrent: vi.fn().mockResolvedValue('playing'),
    playList: vi.fn().mockResolvedValue('playing'),
    playRow: vi.fn().mockResolvedValue('playing'),
    pause: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  };
}

function renderReview(audio: ReviewAudioPort) {
  return render(
    <MemoryRouter>
      <ReviewPage listId="list-1" listNumber={1} entries={entries} audio={audio} onComplete={vi.fn()} backHref="/" backLabel="今日任务" />
    </MemoryRouter>,
  );
}

it('automatically loops only the current word and lets the toolbar pause or resume it', async () => {
  const user = userEvent.setup();
  const audio = makeAudio();
  renderReview(audio);

  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledWith(entries[0], 'us'));
  expect(await screen.findByRole('button', { name: '暂停播放' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '暂停播放' }));
  expect(audio.pause).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: '播放当前单词' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '播放当前单词' }));
  expect(audio.loopCurrent).toHaveBeenLastCalledWith(entries[0], 'us');
  expect(audio.playList).not.toHaveBeenCalled();
});

it('keeps table mode silent until the user starts the List loop', async () => {
  const user = userEvent.setup();
  const audio = makeAudio();
  renderReview(audio);
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledOnce());

  await user.click(screen.getByRole('button', { name: '表格视图' }));
  expect(audio.pause).toHaveBeenCalled();
  expect(audio.playList).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: '播放本组' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '播放本组' }));
  expect(audio.playList).toHaveBeenCalledWith('list-1', entries, 'us');
  expect(screen.getByRole('button', { name: '暂停播放' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: '暂停播放' }));
  expect(screen.getByRole('button', { name: '播放本组' })).toBeInTheDocument();
});

it('switches the current loop on navigation and restarts it when returning from table mode', async () => {
  const user = userEvent.setup();
  const audio = makeAudio();
  renderReview(audio);
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledWith(entries[0], 'us'));

  await user.click(screen.getByRole('button', { name: '下一个' }));
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledWith(entries[1], 'us'));
  await user.click(screen.getByRole('button', { name: '表格视图' }));
  const callsBeforeReturn = vi.mocked(audio.loopCurrent).mock.calls.length;

  await user.click(screen.getByRole('button', { name: '单词视图' }));
  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledTimes(callsBeforeReturn + 1));
  expect(audio.loopCurrent).toHaveBeenLastCalledWith(entries[1], 'us');
  expect(audio.playList).not.toHaveBeenCalled();
});

it('clears List playback intent when a table row plays once', async () => {
  const user = userEvent.setup();
  const audio = makeAudio();
  renderReview(audio);

  await user.click(screen.getByRole('button', { name: '表格视图' }));
  await user.click(screen.getByRole('button', { name: '播放本组' }));
  await user.click(screen.getByRole('row', { name: /retain/ }));

  expect(audio.playRow).toHaveBeenCalledWith(entries[0], 'us');
  expect(screen.getByRole('button', { name: '播放本组' })).toBeInTheDocument();
});

it('supports focused word review, table review, visibility modes, audio, and completion placement', async () => {
  const user = userEvent.setup();
  const audio: ReviewAudioPort = {
    loopCurrent: vi.fn().mockResolvedValue('playing'), playList: vi.fn().mockResolvedValue('playing'), playRow: vi.fn().mockResolvedValue('playing'), pause: vi.fn(), subscribe: vi.fn(() => vi.fn()),
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

it('offers a retry when automatic pronunciation needs a user gesture', async () => {
  const user = userEvent.setup();
  let listener: ((result: PlaybackResult) => void) | null = null;
  const audio: ReviewAudioPort = {
    loopCurrent: vi.fn().mockResolvedValue('playing'),
    playList: vi.fn().mockResolvedValue('playing'),
    playRow: vi.fn().mockResolvedValue('playing'),
    pause: vi.fn(),
    subscribe: vi.fn((next) => { listener = next; return vi.fn(); }),
  };
  render(<MemoryRouter><ReviewPage listId="list-1" listNumber={1} entries={entries} audio={audio} onComplete={vi.fn()} backHref="/" backLabel="今日任务" /></MemoryRouter>);

  await vi.waitFor(() => expect(audio.loopCurrent).toHaveBeenCalledOnce());
  act(() => listener?.('needs-user-gesture'));
  await user.click(screen.getByRole('button', { name: '点击页面开启发音' }));

  expect(audio.loopCurrent).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole('button', { name: '点击页面开启发音' })).not.toBeInTheDocument();
});

it('does not show a false playing state when List pronunciation is unavailable', async () => {
  const user = userEvent.setup();
  const audio: ReviewAudioPort = {
    loopCurrent: vi.fn().mockResolvedValue('playing'),
    playList: vi.fn().mockResolvedValue('unavailable'),
    playRow: vi.fn().mockResolvedValue('playing'),
    pause: vi.fn(), subscribe: vi.fn(() => vi.fn()),
  };
  render(<MemoryRouter><ReviewPage listId="list-1" listNumber={1} entries={entries} audio={audio} onComplete={vi.fn()} backHref="/" backLabel="今日任务" /></MemoryRouter>);

  await user.click(screen.getByRole('button', { name: '表格视图' }));
  await user.click(screen.getByRole('button', { name: '播放本组' }));

  expect(screen.getByRole('button', { name: '播放本组' })).toBeInTheDocument();
  expect(screen.getByText('当前浏览器无法发音')).toBeInTheDocument();
});
