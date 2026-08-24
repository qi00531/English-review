import type { EntryRecord } from '../../db/schema';
import type { Accent } from '../../audio/speechFallback';
import type { VisibilityMode } from './ViewModeTabs';

export function TableReview({ entries, mode, accent, onPlayRow }: {
  entries: EntryRecord[]; mode: VisibilityMode; accent: Accent;
  onPlayRow(entry: EntryRecord, accent: Accent): void;
}) {
  const showEnglish = mode !== 'chinese';
  const showChinese = mode !== 'english';
  return (
    <div className="review-table-wrap">
      <table className="review-table">
        <thead><tr>{showEnglish && <th>英文 / 发音</th>}{showChinese && <th>主要中文义项</th>}<th>{mode === 'chinese' ? '例句翻译' : '常见义项例句'}</th></tr></thead>
        <tbody>{entries.map((entry) => (
          <tr
            key={entry.id}
            tabIndex={0}
            onClick={() => onPlayRow(entry, accent)}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onPlayRow(entry, accent); }}
          >
            {showEnglish && <td><strong>{entry.english}</strong><small>{accent === 'us' ? entry.usIpa : entry.ukIpa}</small></td>}
            {showChinese && <td>{entry.meaningsZh.join('；')}</td>}
            <td>{mode === 'chinese' ? entry.exampleZh : entry.exampleEn}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
