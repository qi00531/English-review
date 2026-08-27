import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { EnrichmentResult } from '../../../server/enrichment/schema';
import type { EntryDraft } from '../../db/repository';
import type { SaveCaptureResult } from '../../capture/model';
import { toSafeCaptureError } from '../../capture/capture-error';
import { Action } from '../../ui/Action';
import { parseTerms } from './parseTerms';
import { replaceResult, toEntryDrafts, updateReadyResult } from './useEnrichmentDraft';

type Props = {
  enrich: (terms: string[]) => Promise<EnrichmentResult[]>;
  save: (drafts: EntryDraft[], allowDuplicates: boolean) => Promise<SaveCaptureResult>;
};

export function CapturePage({ enrich, save }: Props) {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [results, setResults] = useState<EnrichmentResult[]>([]);
  const [state, setState] = useState<'idle' | 'generating' | 'reviewing' | 'saving'>('idle');
  const [error, setError] = useState('');
  const [duplicate, setDuplicate] = useState<{ listId: string; listNumber: number } | null>(null);
  const [success, setSuccess] = useState('');

  async function generate() {
    try {
      const terms = parseTerms(input);
      if (terms.length === 0) throw new Error('请至少输入一个单词或短语');
      setError(''); setState('generating');
      setResults(await enrich(terms)); setState('reviewing');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '生成失败，请重试'); setState('idle');
    }
  }

  async function retry(english: string) {
    const [next] = await enrich([english]);
    if (next) setResults((current) => replaceResult(current, next));
  }

  async function saveReady(allowDuplicates = false) {
    try {
      setError(''); setSuccess(''); setState('saving');
      const result = await save(toEntryDrafts(results), allowDuplicates);
      if (!result.ok) {
        if (result.code === 'DUPLICATE') setDuplicate(result.duplicate);
        else setError('学习内容尚未准备完成，请重试');
        return;
      }
      setDuplicate(null);
      setSuccess(`已加入 List ${result.listNumber}`);
    } catch (reason) {
      setError(toSafeCaptureError(reason, 'save').message);
    } finally {
      setState('reviewing');
    }
  }

  return (
    <section className="capture-page page-enter">
      <Link className="back-link" to="/"><ArrowLeft aria-hidden="true" size={18} />返回今日</Link>
      <div className="capture-heading"><p className="eyebrow">New words</p><h2>记录今天所学</h2><p>只输入英文，一行一条。系统会补全音标、主要中文义项和一句例句。</p></div>
      <div className="capture-editor">
        <label htmlFor="capture-input">今天学到的英文</label>
        <textarea id="capture-input" rows={7} value={input} onChange={(event) => setInput(event.target.value)} aria-describedby="capture-help" />
        <p id="capture-help">支持单词和短语；重复内容会自动合并。</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Action onClick={generate} disabled={state === 'generating'}><Sparkles aria-hidden="true" size={17} />{state === 'generating' ? '正在生成…' : '生成学习内容'}</Action>
      </div>

      {results.length > 0 && <div className="capture-results" aria-label="生成预览">
        {results.map((result) => result.status === 'error' ? (
          <article className="draft-row draft-error" key={result.english}>
            <div><h3>{result.english}</h3><p>{result.message}</p></div>
            <button type="button" aria-label={`重试 ${result.english}`} onClick={() => retry(result.english)}><RefreshCw aria-hidden="true" size={17} />重试</button>
          </article>
        ) : (
          <article className="draft-row" key={result.english}>
            <div className="draft-word"><h3>{result.english}</h3><span>{result.usIpa || '使用语音合成'}</span></div>
            <label>{result.english} 的中文义项<textarea value={result.meaningsZh.join('；')} onChange={(event) => setResults((current) => updateReadyResult(current, result.english, { meaningsZh: event.target.value.split(/[；;]/).map((item) => item.trim()).filter(Boolean) }))} /></label>
            <label>英文例句<textarea value={result.exampleEn} onChange={(event) => setResults((current) => updateReadyResult(current, result.english, { exampleEn: event.target.value }))} /></label>
            <label>例句翻译<textarea value={result.exampleZh} onChange={(event) => setResults((current) => updateReadyResult(current, result.english, { exampleZh: event.target.value }))} /></label>
          </article>
        ))}
        {duplicate && <div className="duplicate-confirm" role="alert">
          <span>List {duplicate.listNumber} 已存在该内容</span>
          <button type="button" onClick={() => setDuplicate(null)}>取消</button>
          <button type="button" onClick={() => void saveReady(true)}>仍然保存</button>
        </div>}
        {success && <div className="capture-success" role="status"><span>{success}</span><button type="button" onClick={() => navigate('/')}>返回今日</button></div>}
        <div className="capture-save"><Action onClick={() => void saveReady(false)} disabled={state === 'saving' || !results.some((item) => item.status === 'ready')}>{state === 'saving' ? '正在保存…' : '保存到今日 List'}</Action></div>
      </div>}
    </section>
  );
}
