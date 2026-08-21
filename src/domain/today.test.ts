import type { ReviewNode } from './models';
import { selectTodayState } from './today';

function node(
  listId: string,
  dueDate: ReviewNode['dueDate'],
  completedAt: string | null = null,
): ReviewNode {
  return { id: `node-${listId}-${dueDate}`, listId, dueDate, completedAt, sequence: 0 };
}

describe('selectTodayState', () => {
  it('keeps capture locked while a due List is incomplete', () => {
    const state = selectTodayState('2026-08-22', [node('list-1', '2026-08-22')]);

    expect(state.captureLocked).toBe(true);
    expect(state.due.map((item) => item.listId)).toEqual(['list-1']);
  });

  it('orders overdue nodes first and excludes completed and future nodes', () => {
    const state = selectTodayState('2026-08-22', [
      node('today', '2026-08-22'),
      node('future', '2026-08-23'),
      node('oldest', '2026-08-19'),
      node('complete', '2026-08-18', '2026-08-20T10:00:00.000Z'),
      node('older', '2026-08-20'),
    ]);

    expect(state.due.map((item) => item.listId)).toEqual(['oldest', 'older', 'today']);
  });

  it('unlocks capture after all due nodes are completed', () => {
    const state = selectTodayState('2026-08-22', [
      node('complete', '2026-08-22', '2026-08-22T10:00:00.000Z'),
    ]);

    expect(state.captureLocked).toBe(false);
    expect(state.due).toEqual([]);
  });
});
