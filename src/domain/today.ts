import type { LocalDate, ReviewNode } from './models';

export type TodayState = {
  due: ReviewNode[];
  captureLocked: boolean;
};

export function selectTodayState(
  today: LocalDate,
  reviewNodes: ReviewNode[],
): TodayState {
  const due = reviewNodes
    .filter((node) => node.completedAt === null && node.dueDate <= today)
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate));

  return { due, captureLocked: due.length > 0 };
}
