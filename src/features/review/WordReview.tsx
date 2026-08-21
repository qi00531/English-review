import type { EntryRecord } from '../../db/schema';
import type { VisibilityMode } from './ViewModeTabs';

export function WordReview({ entry, mode, translationOpen, onToggleTranslation }: {
  entry: EntryRecord; mode: VisibilityMode; translationOpen: boolean; onToggleTranslation: () => void;
}) {
  const showEnglish = mode !== 'chinese';
  const showChinese = mode !== 'english';
  return (
    <article className="word-review">
      {showEnglish && <div className="word-focus">
        <p className="accent-label">American pronunciation</p>
        <h2>{entry.english}</h2>
        <p className="phonetic">{entry.usIpa || '语音合成发音'}</p>
      </div>}
      {showChinese && <p className="word-meanings">{entry.meaningsZh.join('；')}</p>}
      {showEnglish && <button className="example-reveal" type="button" onClick={onToggleTranslation} aria-expanded={translationOpen}>
        <span>{entry.exampleEn}</span>
        {translationOpen && <span className="example-translation">{entry.exampleZh}</span>}
      </button>}
      {mode === 'chinese' && <p className="chinese-example">{entry.exampleZh}</p>}
    </article>
  );
}
