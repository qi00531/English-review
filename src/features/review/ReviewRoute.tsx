import { format } from 'date-fns';
import { liveQuery } from 'dexie';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AudioController } from '../../audio/AudioController';
import { repository as defaultRepository } from '../../db';
import type { EntryRecord, ListRecord } from '../../db/schema';
import type { RepositorySnapshot } from '../../db/repository';
import type { ReviewAudioPort } from './ReviewPage';
import { ReviewPage } from './ReviewPage';

export type ReviewRepositoryPort = {
  snapshot(): Promise<RepositorySnapshot>;
  completeReviewNode(nodeId: string): Promise<void>;
};
type ReviewAudioController = ReviewAudioPort & { dispose(): void };
type ReviewState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; list: ListRecord; entries: EntryRecord[] };

const createDefaultAudio = () => new AudioController();

export function ReviewRoute({
  reviewRepository = defaultRepository,
  createAudio = createDefaultAudio,
}: {
  reviewRepository?: ReviewRepositoryPort;
  createAudio?: () => ReviewAudioController;
} = {}) {
  const { listId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const audio = useMemo(() => createAudio(), [createAudio]);
  const [state, setState] = useState<ReviewState>({ status: 'loading' });
  const fromHistory = searchParams.get('from') === 'history';
  const returnTab = searchParams.get('tab') === 'lists' ? 'lists' : 'plan';
  const backHref = fromHistory ? `/history?tab=${returnTab}` : '/';
  const backLabel = fromHistory ? '返回历史' : '今日任务';

  useEffect(() => {
    const subscription = liveQuery(async () => {
      const snapshot = await reviewRepository.snapshot();
      const list = snapshot.lists.find((item) => item.id === listId);
      if (!list) return { status: 'missing' } as const;
      return {
        status: 'ready' as const,
        list,
        entries: snapshot.entries.filter((entry) => entry.listId === listId),
      };
    }).subscribe(setState);
    return () => { subscription.unsubscribe(); audio.dispose(); };
  }, [audio, listId, reviewRepository]);

  if (state.status === 'loading') return <section className="page-measure"><p className="eyebrow">Review</p><h2 className="page-title">开始复习</h2><p role="status">正在打开 List…</p></section>;
  if (state.status === 'missing') return <section className="page-measure"><p className="eyebrow">Review</p><h2 className="page-title">这个 List 不存在或已被删除</h2><Link to={backHref}>返回历史</Link></section>;
  if (state.entries.length === 0) return <section className="page-measure"><p>这个 List 还没有词条。</p><Link to={backHref}>{backLabel}</Link></section>;

  return <ReviewPage
    listId={state.list.id}
    listNumber={state.list.listNumber}
    entries={state.entries}
    audio={audio}
    backHref={backHref}
    backLabel={backLabel}
    onComplete={async () => {
      if (fromHistory) {
        navigate(`/history?tab=${returnTab}`);
        return;
      }
      const today = format(new Date(), 'yyyy-MM-dd');
      const snapshot = await reviewRepository.snapshot();
      const node = snapshot.reviewNodes
        .filter((item) => item.listId === listId && item.completedAt === null && item.dueDate <= today)
        .sort((left, right) => left.dueDate.localeCompare(right.dueDate) || left.sequence - right.sequence)[0];
      if (node) await reviewRepository.completeReviewNode(node.id);
      navigate('/', { state: node ? { completedNodeId: node.id } : undefined });
    }}
  />;
}
