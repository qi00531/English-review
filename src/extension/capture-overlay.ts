import type { CaptureDraft, CaptureMessage, DuplicateMatch } from '../capture/model';

type Sender = (message: CaptureMessage) => Promise<any>;

export function createCaptureOverlay({ sendMessage }: { sendMessage: Sender }) {
  const host = document.createElement('div');
  host.dataset.wordJournal = 'capture';
  const root = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `:host{all:initial}.launcher{position:fixed;z-index:2147483647;width:38px;height:38px;border:1px solid #718374;border-radius:10px;background:#f7f3e8;color:#263b30;box-shadow:0 8px 24px #24352b2b;cursor:pointer;font:600 18px Georgia}.panel{position:fixed;z-index:2147483647;width:min(360px,calc(100vw - 24px));padding:20px;background:#f8f4e9;color:#26362e;border:1px solid #d8d4c7;border-radius:14px;box-shadow:0 18px 48px #1f302638;font:14px/1.5 system-ui}.panel h2{margin:0 0 4px;font:500 28px/1.1 Georgia}.type,.note{color:#657168;font-size:12px}.panel label{display:block;margin:12px 0 4px}.panel textarea{box-sizing:border-box;width:100%;min-height:54px;padding:9px;border:1px solid #d5d2c6;border-radius:7px;background:#fffdf6;color:#26362e}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.actions button{min-height:40px;padding:0 14px;border:0;border-radius:7px;background:transparent;color:#405248;cursor:pointer}.actions .primary{background:#355944;color:#fffdf4}.error{color:#8b4239}`;
  root.append(style);
  document.body.append(host);
  let text = '';
  let rect = new DOMRect();

  function position(element: HTMLElement) {
    element.style.left = `${Math.min(Math.max(12, rect.left), window.innerWidth - 380)}px`;
    element.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - 300)}px`;
  }
  function dismiss() { [...root.children].filter((node) => node !== style).forEach((node) => node.remove()); }
  function showMessage(message: string, role: 'status' | 'alert' = 'status') {
    dismiss();
    const panel = document.createElement('div');
    panel.className = role === 'alert' ? 'panel error' : 'panel';
    panel.setAttribute('role', role);
    panel.textContent = message;
    position(panel);
    root.append(panel);
  }
  async function save(draft: CaptureDraft, allowDuplicate: boolean) {
    const meanings = (root.querySelector('#wj-meanings') as HTMLTextAreaElement).value.split(/[；;\n]/).map((v) => v.trim()).filter(Boolean);
    const exampleEn = (root.querySelector('#wj-example') as HTMLTextAreaElement).value.trim();
    const result = await sendMessage({ type: 'SAVE_CAPTURE', draft: { ...draft, meaningsZh: meanings, exampleEn }, allowDuplicate });
    if (result.ok) showMessage('已加入待整理');
  }
  function showPreview(draft: CaptureDraft, duplicate: DuplicateMatch) {
    dismiss();
    const panel = document.createElement('section');
    panel.className = 'panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', '收录预览');
    panel.innerHTML = `<h2>${draft.text}</h2><div class="type">${draft.type === 'word' ? '单词' : '短语'}</div>${duplicate ? `<p class="note">已收录于 List ${duplicate.listNumber}</p>` : ''}<label for="wj-meanings">中文释义</label><textarea id="wj-meanings">${draft.meaningsZh.join('；')}</textarea><label for="wj-example">英文例句</label><textarea id="wj-example">${draft.exampleEn}</textarea><div class="actions"><button data-cancel>取消</button><button class="primary" data-save>${duplicate ? '再次加入' : '加入待整理'}</button></div>`;
    position(panel); root.append(panel);
    panel.querySelector('[data-cancel]')?.addEventListener('click', dismiss);
    panel.querySelector('[data-save]')?.addEventListener('click', () => void save(draft, Boolean(duplicate)));
  }
  function showLauncher(nextText: string, nextRect: DOMRect) {
    dismiss(); text = nextText; rect = nextRect;
    const button = document.createElement('button');
    button.className = 'launcher'; button.type = 'button'; button.title = '收录到 Word Journal'; button.setAttribute('aria-label', '收录到 Word Journal'); button.textContent = 'W';
    position(button); root.append(button);
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const result = await sendMessage({ type: 'PREVIEW_CAPTURE', text });
        if (result.ok) showPreview(result.draft, result.duplicate);
        else showMessage(result.code === 'AI_KEY_MISSING' ? '请先在 Word Journal 设置中填写 API Key' : '暂时无法生成，请重试', 'alert');
      } catch { showMessage('网络异常，请重试', 'alert'); }
    });
  }
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') dismiss(); });
  document.addEventListener('mousedown', (event) => {
    if (event.target !== host && !event.composedPath().includes(host)) dismiss();
  });
  return { root, showLauncher, dismiss };
}
