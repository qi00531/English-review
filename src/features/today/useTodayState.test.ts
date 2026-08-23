import type { RepositorySnapshot } from '../../db/repository';
import { buildTodayViewState } from './useTodayState';

it('joins due nodes with List number and word count', () => {
  const snapshot = {
    lists: [
      { id: 'list-1', listNumber: 1, createdDate: '2026-08-22', createdAt: 'now' },
      { id: 'list-2', listNumber: 2, createdDate: '2026-08-21', createdAt: 'now' },
    ],
    entries: [
      { id: 'a', listId: 'list-1', english: 'retain', normalizedEnglish: 'retain', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['保留'], exampleEn: 'We retain more.', exampleZh: '我们记住更多。', audioFallback: 'speech-synthesis', source: 'manual', updatedAt: 'now' },
      { id: 'b', listId: 'list-1', english: 'subtle', normalizedEnglish: 'subtle', usIpa: null, ukIpa: null, usAudioUrl: null, ukAudioUrl: null, meaningsZh: ['细微的'], exampleEn: 'A subtle change.', exampleZh: '一个细微变化。', audioFallback: 'speech-synthesis', source: 'manual', updatedAt: 'now' },
    ],
    reviewNodes: [{
      id: 'node-1', listId: 'list-1', dueDate: '2026-08-22', completedAt: null, sequence: 0,
    }, {
      id: 'node-2', listId: 'list-2', dueDate: '2026-08-21', completedAt: '2026-08-22T01:00:00.000Z', sequence: 0,
    }],
    drafts: [], settings: [],
  } as RepositorySnapshot;

  const view = buildTodayViewState('2026-08-22', snapshot);
  expect(view.due).toEqual([{
    listId: 'list-1', listNumber: 1, dueDate: '2026-08-22', wordCount: 2,
  }]);
  expect(view.progress).toEqual({ completed: 1, total: 2 });
  expect(view.streakDays).toBe(2);
});
