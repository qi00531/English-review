import { format } from 'date-fns';
import { liveQuery } from 'dexie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { repository } from '../../db';
import type { LocalDate } from '../../domain/models';
import { selectTodayState } from '../../domain/today';
import { InboxPage } from './InboxPage';

export function InboxRoute() {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd') as LocalDate;
  const [state, setState] = useState({ drafts: [] as Awaited<ReturnType<typeof repository.getCaptureDrafts>>, locked: true });
  useEffect(() => {
    const subscription = liveQuery(() => repository.snapshot()).subscribe((snapshot) => setState({ drafts: snapshot.captureDrafts, locked: selectTodayState(today, snapshot.reviewNodes).captureLocked }));
    return () => subscription.unsubscribe();
  }, [today]);
  return <InboxPage drafts={state.drafts} locked={state.locked} onDelete={(id) => repository.deleteCaptureDraft(id)} onUpdate={(id, patch) => repository.updateCaptureDraft(id, patch)} onPromote={async (ids) => { await repository.promoteCaptureDrafts(today, ids); navigate('/'); }} />;
}
