import { format } from 'date-fns';
import { liveQuery } from 'dexie';
import { useEffect, useState } from 'react';
import { repository as defaultRepository } from '../../db';
import type { EnglishReviewRepository, RepositorySnapshot } from '../../db/repository';
import type { LocalDate } from '../../domain/models';
import { selectTodayState } from '../../domain/today';
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
  return { due, captureLocked: selected.captureLocked };
}

export function useTodayState(repository: EnglishReviewRepository = defaultRepository) {
  const [state, setState] = useState<{ due: TodayListItem[]; loading: boolean }>({
    due: [], loading: true,
  });

  useEffect(() => {
    const subscription = liveQuery(() => repository.snapshot()).subscribe({
      next: (snapshot) => setState({
        ...buildTodayViewState(format(new Date(), 'yyyy-MM-dd') as LocalDate, snapshot),
        loading: false,
      }),
      error: () => setState({ due: [], loading: false }),
    });
    return () => subscription.unsubscribe();
  }, [repository]);

  return state;
}
