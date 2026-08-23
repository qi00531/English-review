import type { LocalDate, ReviewNode } from './models';

export type PlanList = { id: string; listNumber: number };
export type PlanStatus = 'completed' | 'due' | 'overdue' | 'upcoming';
export type ReviewPlanRow = { date: LocalDate; status: PlanStatus; lists: PlanList[] };

export function buildReviewPlan(
  today: LocalDate,
  lists: PlanList[],
  nodes: ReviewNode[],
): ReviewPlanRow[] {
  const listsById = new Map(lists.map((list) => [list.id, list]));
  const nodesByDate = new Map<LocalDate, ReviewNode[]>();

  for (const node of nodes) {
    if (!listsById.has(node.listId)) continue;
    nodesByDate.set(node.dueDate, [...(nodesByDate.get(node.dueDate) ?? []), node]);
  }

  return [...nodesByDate.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, dateNodes]) => {
      const rowLists = [...new Map(
        dateNodes.map((node) => [node.listId, listsById.get(node.listId)!]),
      ).values()].sort((left, right) => left.listNumber - right.listNumber);
      const status: PlanStatus = dateNodes.every((node) => node.completedAt !== null)
        ? 'completed'
        : date < today
          ? 'overdue'
          : date === today
            ? 'due'
            : 'upcoming';

      return { date, status, lists: rowLists };
    });
}

export function findPlanFocusDate(
  today: LocalDate,
  rows: ReviewPlanRow[],
): LocalDate | null {
  return rows.find((row) => row.date === today)?.date
    ?? rows.find((row) => row.date > today)?.date
    ?? rows.at(-1)?.date
    ?? null;
}
