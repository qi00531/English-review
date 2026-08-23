import { format } from 'date-fns';
import { liveQuery } from 'dexie';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { repository } from '../../db';
import type { LocalDate } from '../../domain/models';
import { buildReviewPlan, type ReviewPlanRow } from '../../domain/review-plan';
import { HistoryPage, type HistoryGroup } from './HistoryPage';

type HistoryData = { groups: HistoryGroup[]; plan: ReviewPlanRow[]; today: LocalDate };

export function HistoryRoute() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<HistoryData>({ groups: [], plan: [], today: format(new Date(), 'yyyy-MM-dd') as LocalDate });
  const initialTab = searchParams.get('tab') === 'lists' ? 'lists' : 'plan';

  useEffect(() => liveQuery(async () => {
    const snapshot = await repository.snapshot();
    const today = format(new Date(), 'yyyy-MM-dd') as LocalDate;
    return {
      today,
      plan: buildReviewPlan(today, snapshot.lists, snapshot.reviewNodes),
      groups: snapshot.lists.map((list) => ({
        list,
        entries: snapshot.entries.filter((entry) => entry.listId === list.id),
        reviewNodes: snapshot.reviewNodes.filter((node) => node.listId === list.id),
      })),
    };
  }).subscribe({ next: setData }).unsubscribe, []);

  return <HistoryPage {...data} initialTab={initialTab} onUpdateEntry={(id, patch) => repository.updateEntry(id, patch)} onDeleteList={(id) => repository.deleteList(id)} />;
}
