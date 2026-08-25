import { format } from 'date-fns';
import { liveQuery } from 'dexie';
import { useEffect, useState } from 'react';
import { repository as defaultRepository } from '../../db';
import type { EnglishReviewRepository, RepositorySnapshot } from '../../db/repository';
import type { LocalDate } from '../../domain/models';
import { selectTodayState } from '../../domain/today';
import { calculateLearningStreak } from '../../domain/streak';
import type { TodayListItem } from './TodayPage';

export function buildTodayViewState(today: LocalDate, snapshot: RepositorySnapshot) {
  const selected = selectTodayState(today, snapshot.reviewNodes);
  const lists = new Map(snapshot.lists.map((list) => [list.id, list]));
  const counts = snapshot.entries.reduce((map, entry) => {
    map.set(entry.listId, (map.get(entry.listId) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  const due = selected.due.flatMap<TodayListItem>((node) => {
    const list = lists.get(node.listId);
    return list ? [{
      listId: node.listId,
      listNumber: list.listNumber,
      dueDate: node.dueDate,
      wordCount: counts.get(node.listId) ?? 0,
    }] : [];
  });
  const completedToday = snapshot.reviewNodes.filter((node) =>
    node.dueDate <= today
    && node.completedAt !== null
    && format(new Date(node.completedAt), 'yyyy-MM-dd') === today,
  ).length;
  const total = selected.due.length + completedToday;

  return {
    due,
    captureLocked: selected.captureLocked,
    progress: { completed: completedToday, total: Math.max(total, 1) },
    streakDays: calculateLearningStreak(snapshot.lists.map((list) => list.createdDate), today),
    inboxCount: snapshot.captureDrafts.length,
  };
}

export function useTodayState(repository: EnglishReviewRepository = defaultRepository) {
  const [state, setState] = useState<{
    due: TodayListItem[];
    loading: boolean;
    progress: { completed: number; total: number };
    streakDays: number;
    inboxCount: number;
  }>({
    due: [], loading: true, progress: { completed: 0, total: 1 }, streakDays: 0, inboxCount: 0,
  });

  useEffect(() => {
    const subscription = liveQuery(() => repository.snapshot()).subscribe({
      next: (snapshot) => setState({
        ...buildTodayViewState(format(new Date(), 'yyyy-MM-dd') as LocalDate, snapshot),
        loading: false,
      }),
      error: () => setState({ due: [], loading: false, progress: { completed: 0, total: 1 }, streakDays: 0, inboxCount: 0 }),
    });
    return () => subscription.unsubscribe();
  }, [repository]);

  return state;
}
