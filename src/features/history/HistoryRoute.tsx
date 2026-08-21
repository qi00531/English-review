import { liveQuery } from 'dexie';
import { useEffect, useState } from 'react';
import { repository } from '../../db';
import { HistoryPage, type HistoryGroup } from './HistoryPage';

export function HistoryRoute() {
  const [groups, setGroups] = useState<HistoryGroup[]>([]);
  useEffect(() => liveQuery(async () => { const snapshot = await repository.snapshot(); return snapshot.lists.map((list) => ({ list, entries: snapshot.entries.filter((e) => e.listId === list.id), reviewNodes: snapshot.reviewNodes.filter((n) => n.listId === list.id) })); }).subscribe({ next: setGroups }).unsubscribe, []);
  return <HistoryPage groups={groups} onUpdateEntry={(id, patch) => repository.updateEntry(id, patch)} onDeleteList={(id) => repository.deleteList(id)} />;
}
