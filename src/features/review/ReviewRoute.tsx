import { format } from 'date-fns';
import { liveQuery } from 'dexie';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AudioController } from '../../audio/AudioController';
import { repository } from '../../db';
import type { EntryRecord, ListRecord } from '../../db/schema';
import type { ReviewNode } from '../../domain/models';
import { ReviewPage } from './ReviewPage';

type ReviewData = { list: ListRecord; entries: EntryRecord[]; node: ReviewNode | null };

export function ReviewRoute() {
  const { listId = '' } = useParams();
  const navigate = useNavigate();
  const audio = useMemo(() => new AudioController(), []);
  const [data, setData] = useState<ReviewData | null>(null);

  useEffect(() => {
    const subscription = liveQuery(async () => {
      const snapshot = await repository.snapshot();
      const list = snapshot.lists.find((item) => item.id === listId);
      if (!list) return null;
      const today = format(new Date(), 'yyyy-MM-dd');
      const node = snapshot.reviewNodes
        .filter((item) => item.listId === listId && item.completedAt === null)
        .sort((left, right) => left.sequence - right.sequence)
        .find((item) => item.dueDate <= today) ?? null;
      return { list, entries: snapshot.entries.filter((entry) => entry.listId === listId), node };
    }).subscribe(setData);
    return () => { subscription.unsubscribe(); audio.dispose(); };
  }, [audio, listId]);

  if (!data) return <section className="page-measure"><p className="eyebrow">Review</p><h2 className="page-title">开始复习</h2><p role="status">正在打开 List…</p></section>;
  return <ReviewPage
    listId={data.list.id}
    listNumber={data.list.listNumber}
    entries={data.entries}
    audio={audio}
    onComplete={async () => {
      if (!data.node) { navigate('/'); return; }
      await repository.completeReviewNode(data.node.id);
      navigate('/', { state: { completedNodeId: data.node.id } });
    }}
  />;
}
