import { ArrowLeft, Pause, Play, Table2, Rows3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Accent } from '../../audio/speechFallback';
import type { ReviewAudioEntry } from '../../audio/AudioController';
import type { EntryRecord } from '../../db/schema';
import { CompletionAction } from './CompletionAction';
import { TableReview } from './TableReview';
import { ViewModeTabs, type VisibilityMode } from './ViewModeTabs';
import { WordReview } from './WordReview';

export type ReviewAudioPort = {
  loopCurrent(entry: ReviewAudioEntry, accent: Accent): unknown;
  playList(listId: string, entries: ReviewAudioEntry[], accent: Accent): unknown;
  playRow(entry: ReviewAudioEntry, accent: Accent): unknown;
  pause(): void;
};

export function ReviewPage({ listId, listNumber, entries, audio, onComplete, backHref, backLabel }: {
  listId: string; listNumber: number; entries: EntryRecord[];
  audio: ReviewAudioPort; onComplete: () => void | Promise<void>;
  backHref: string; backLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [visibility, setVisibility] = useState<VisibilityMode>('complete');
  const [layout, setLayout] = useState<'word' | 'table'>('word');
  const [accent, setAccent] = useState<Accent>('us');
  const [translationOpen, setTranslationOpen] = useState(false);
  const [playingList, setPlayingList] = useState(false);
  const entry = entries[index];

  useEffect(() => {
    if (layout === 'word' && entry) audio.loopCurrent(entry, accent);
    return () => audio.pause();
  }, [accent, audio, entry, layout]);

  if (!entry) return <p className="page-measure">这个 List 还没有词条。</p>;
  function move(next: number) { setTranslationOpen(false); setIndex(next); }

  return (
    <section className="review-page page-enter">
      <header className="review-header">
        <Link to={backHref} className="review-back"><ArrowLeft aria-hidden="true" size={18} />{backLabel}</Link>
        <strong>List {listNumber} · {layout === 'word' ? `${index + 1} / ${entries.length}` : `${entries.length} words`}</strong>
        {(layout === 'table' || index === entries.length - 1) ? <CompletionAction onComplete={onComplete} /> : <span />}
      </header>
      <div className="review-tools">
        <ViewModeTabs value={visibility} onChange={setVisibility} />
        <div className="review-tool-actions">
          <button type="button" onClick={() => setAccent((value) => value === 'us' ? 'uk' : 'us')}>{accent === 'us' ? '美式' : '英式'}</button>
          <button type="button" aria-label={layout === 'word' ? '表格视图' : '单词视图'} onClick={() => setLayout((value) => value === 'word' ? 'table' : 'word')}>{layout === 'word' ? <Table2 aria-hidden="true" /> : <Rows3 aria-hidden="true" />}</button>
          <button type="button" aria-label={playingList ? '暂停播放' : '播放本组'} onClick={() => { if (playingList) audio.pause(); else audio.playList(listId, entries, accent); setPlayingList(!playingList); }}>{playingList ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</button>
        </div>
      </div>

      {layout === 'word'
        ? <WordReview entry={entry} mode={visibility} translationOpen={translationOpen} onToggleTranslation={() => setTranslationOpen((open) => !open)} />
        : <TableReview entries={entries} mode={visibility} accent={accent} audio={audio} />}

      {layout === 'word' && <nav className="review-pagination" aria-label="单词翻页">
        <button type="button" onClick={() => move(Math.max(0, index - 1))} disabled={index === 0}>上一个</button>
        <button type="button" onClick={() => move(Math.min(entries.length - 1, index + 1))} disabled={index === entries.length - 1}>下一个</button>
      </nav>}
    </section>
  );
}
