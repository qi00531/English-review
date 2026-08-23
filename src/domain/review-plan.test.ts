import { describe, expect, it } from 'vitest';
import type { LocalDate, ReviewNode } from './models';
import { buildReviewPlan, findPlanFocusDate } from './review-plan';

const lists = [
  { id: 'l1', listNumber: 1 },
  { id: 'l2', listNumber: 2 },
];

function node(id: string, listId: string, dueDate: LocalDate, completedAt: string | null = null): ReviewNode {
  return { id, listId, dueDate, completedAt, sequence: 0 };
}

describe('buildReviewPlan', () => {
  it('groups Lists by date, sorts them, and deduplicates corrupt duplicates', () => {
    const rows = buildReviewPlan('2026-08-24', lists, [
      node('a', 'l2', '2026-08-24'),
      node('b', 'l1', '2026-08-24'),
      { ...node('c', 'l1', '2026-08-24'), sequence: 9 },
    ]);

    expect(rows).toEqual([{ date: '2026-08-24', status: 'due', lists }]);
  });

  it.each([
    ['2026-08-23', null, 'overdue'],
    ['2026-08-24', null, 'due'],
    ['2026-08-25', null, 'upcoming'],
    ['2026-08-23', '2026-08-23T10:00:00Z', 'completed'],
  ] as const)('classifies %s as %s', (dueDate, completedAt, status) => {
    expect(buildReviewPlan('2026-08-24', lists.slice(0, 1), [
      node('n', 'l1', dueDate, completedAt),
    ])[0].status).toBe(status);
  });

  it('skips orphaned nodes and chooses today, next future date, or final date', () => {
    const rows = buildReviewPlan('2026-08-24', lists, [
      node('a', 'missing', '2026-08-24'),
      node('b', 'l1', '2026-08-25'),
      node('c', 'l2', '2026-08-26'),
    ]);

    expect(rows).toHaveLength(2);
    expect(findPlanFocusDate('2026-08-24', rows)).toBe('2026-08-25');
    expect(findPlanFocusDate('2026-08-27', rows)).toBe('2026-08-26');
    expect(findPlanFocusDate('2026-08-25', rows)).toBe('2026-08-25');
  });
});
