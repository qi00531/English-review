import type { RepositorySnapshot } from '../../db/repository';
import { buildTodayViewState } from './useTodayState';

it('joins due nodes with List number and word count', () => {
  const snapshot = {
    lists: [{ id: 'list-1', listNumber: 1, createdDate: '2026-08-21', createdAt: 'now' }],
    entries: [
      { id: 'a', listId: 'list-1', english: 'retain', normalizedEnglish: 'retain', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['保留'], exampleEn: 'We retain more.', exampleZh: '我们记住更多。', audioFallback: 'speech-synthesis', source: 'manual', updatedAt: 'now' },
      { id: 'b', listId: 'list-1', english: 'subtle', normalizedEnglish: 'subtle', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['细微的'], exampleEn: 'A subtle change.', exampleZh: '一个细微变化。', audioFallback: 'speech-synthesis', source: 'manual', updatedAt: 'now' },
    ],
    reviewNodes: [{
      id: 'node-1', listId: 'list-1', dueDate: '2026-08-22', completedAt: null, sequence: 0,
    }],
    drafts: [], settings: [],
  } as RepositorySnapshot;

  expect(buildTodayViewState('2026-08-22', snapshot).due).toEqual([{
    listId: 'list-1', listNumber: 1, dueDate: '2026-08-22', wordCount: 2,
  }]);
});
