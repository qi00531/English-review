import type { SafeCaptureError } from '../capture/capture-error';
import type { CaptureDraft, CaptureMessage, DuplicateMatch } from '../capture/model';

type Sender = (message: CaptureMessage) => Promise<any>;

export function createCaptureOverlay({ sendMessage }: { sendMessage: Sender }) {
  const host = document.createElement('div');
  host.dataset.wordJournal = 'capture';
  const root = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `:host{all:initial}.launcher{position:fixed;z-index:2147483647;box-sizing:border-box;width:34px;height:34px;padding:0;border:1px solid #87978c;border-radius:9px;background:#f8f4e9;color:#2d4638;box-shadow:0 5px 16px #24352b1c;display:grid;place-items:center;cursor:pointer;transition:transform 140ms ease,border-color 140ms ease,box-shadow 140ms ease}.launcher svg{width:16px;height:16px}.launcher:hover:not(:disabled){transform:translateY(-1px);border-color:#587061;box-shadow:0 8px 22px #24352b2a}.launcher:disabled{opacity:1;cursor:wait}.launcher[data-loading=true]::after{content:"";position:absolute;inset:-3px;border:1.5px solid transparent;border-top-color:#456652;border-right-color:#91a095;border-radius:11px;animation:wj-spin 800ms linear infinite}@keyframes wj-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.launcher{transition:none}.launcher[data-loading=true]::after{animation:none;border-color:#91a095;border-top-color:#456652}}.panel{position:fixed;z-index:2147483647;width:min(360px,calc(100vw - 24px));padding:20px;background:#f8f4e9;color:#26362e;border:1px solid #d8d4c7;border-radius:14px;box-shadow:0 18px 48px #1f302638;font:14px/1.5 system-ui}.panel h2{margin:0 0 4px;font:500 28px/1.1 Georgia}.type,.note{color:#657168;font-size:12px}.panel label{display:block;margin:12px 0 4px}.panel textarea{box-sizing:border-box;width:100%;min-height:54px;padding:9px;border:1px solid #d5d2c6;border-radius:7px;background:#fffdf6;color:#26362e}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.actions button{min-height:40px;padding:0 14px;border:0;border-radius:7px;background:transparent;color:#405248;cursor:pointer}.actions .primary{background:#355944;color:#fffdf4}.error{color:#8b4239}`;
  root.append(style);
  document.body.append(host);
  let text = '';
  let rect = new DOMRect();

  function position(element: HTMLElement) {
    element.style.left = `${Math.min(Math.max(12, rect.left), window.innerWidth - 380)}px`;
    element.style.top = `${Math.min(rect.bottom + 8, window.innerHeight - 300)}px`;
  }
  function dismiss() { [...root.children].filter((node) => node !== style).forEach((node) => node.remove()); }
  function createPenIcon() {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.7');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');
    const nib = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    nib.setAttribute('d', 'm14 4 6 6L8.5 21H3v-5.5z');
    const detail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    detail.setAttribute('d', 'm12 6 6 6M3 21h6');
    icon.append(nib, detail);
    return icon;
  }
  function showMessage(message: string, role: 'status' | 'alert' = 'status') {
    dismiss();
    const panel = document.createElement('div');
    panel.className = role === 'alert' ? 'panel error' : 'panel';
    panel.setAttribute('role', role);
    panel.textContent = message;
    position(panel);
    root.append(panel);
  }
  async function copyErrorDetail(detail: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(detail);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = detail; textarea.style.position = 'fixed'; textarea.style.opacity = '0';
    document.body.append(textarea); textarea.select(); document.execCommand('copy'); textarea.remove();
  }
  function showError(error: SafeCaptureError, retry: () => void | Promise<void>) {
    dismiss();
    const panel = document.createElement('section');
    panel.className = 'panel error'; panel.setAttribute('role', 'alert');
    const message = document.createElement('p'); message.textContent = error.message;
    const actions = document.createElement('div'); actions.className = 'actions';
    const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = '复制错误详情';
    copy.addEventListener('click', () => void copyErrorDetail(error.detail));
    const retryButton = document.createElement('button'); retryButton.type = 'button'; retryButton.className = 'primary'; retryButton.textContent = '重试';
    retryButton.addEventListener('click', () => void retry());
    actions.append(copy, retryButton); panel.append(message, actions); position(panel); root.append(panel);
  }
  async function submitDraft(draft: CaptureDraft, allowDuplicate: boolean) {
    const result = await sendMessage({ type: 'SAVE_CAPTURE', draft, allowDuplicate });
    if (result.ok) showMessage(`已加入 List ${result.listNumber}`);
    else if (result.error) showError(result.error, () => submitDraft(draft, allowDuplicate));
    else if (result.code === 'DUPLICATE') showPreview(draft, result.duplicate);
  }
  async function save(draft: CaptureDraft, allowDuplicate: boolean) {
    const meanings = (root.querySelector('#wj-meanings') as HTMLTextAreaElement).value.split(/[；;\n]/).map((v) => v.trim()).filter(Boolean);
    const exampleEn = (root.querySelector('#wj-example') as HTMLTextAreaElement).value.trim();
    await submitDraft({ ...draft, meaningsZh: meanings, exampleEn }, allowDuplicate);
  }
  function showPreview(draft: CaptureDraft, duplicate: DuplicateMatch) {
    dismiss();
    const panel = document.createElement('section');
    panel.className = 'panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', '收录预览');
    panel.innerHTML = `<h2>${draft.text}</h2><div class="type">${draft.type === 'word' ? '单词' : '短语'}</div>${duplicate ? `<p class="note">已收录于 List ${duplicate.listNumber}</p>` : ''}<label for="wj-meanings">中文释义</label><textarea id="wj-meanings">${draft.meaningsZh.join('；')}</textarea><label for="wj-example">英文例句</label><textarea id="wj-example">${draft.exampleEn}</textarea><div class="actions"><button data-cancel>取消</button><button class="primary" data-save>${duplicate ? '再次加入' : '加入今日 List'}</button></div>`;
    position(panel); root.append(panel);
    panel.querySelector('[data-cancel]')?.addEventListener('click', dismiss);
    panel.querySelector('[data-save]')?.addEventListener('click', () => void save(draft, Boolean(duplicate)));
  }
  function showLauncher(nextText: string, nextRect: DOMRect) {
    dismiss(); text = nextText; rect = nextRect;
    const button = document.createElement('button');
    button.className = 'launcher'; button.type = 'button'; button.title = '收录到 Word Journal'; button.setAttribute('aria-label', '收录到 Word Journal'); button.textContent = 'W';
    position(button); root.append(button);
    async function preview() {
      button.disabled = true;
      button.dataset.loading = 'true';
      button.setAttribute('aria-label', '正在生成释义与例句');
      button.setAttribute('aria-busy', 'true');
      try {
        const result = await sendMessage({ type: 'PREVIEW_CAPTURE', text });
        if (result.ok) showPreview(result.draft, result.duplicate);
        else if (result.error) showError(result.error, preview);
        else {
          const message = result.code === 'AI_KEY_MISSING' ? '请先在 Word Journal 设置中填写 API Key' : '内容格式无法识别，请重新选择单词或短语';
          showError({ code: result.code === 'AI_KEY_MISSING' ? 'AUTH_FAILED' : 'INVALID_CONTENT', message, stage: 'preview', detail: `错误类型: ${result.code}\n阶段: preview\n说明: ${message}` }, preview);
        }
      } catch (reason) {
        const contextInvalidated = reason instanceof Error && /extension context invalidated/i.test(reason.message);
        const message = contextInvalidated
          ? '扩展已更新，请刷新当前网页后重试'
          : '网络连接失败，请检查连接后重试';
        showError({
          code: 'NETWORK', message, stage: 'preview',
          detail: `错误类型: NETWORK\n阶段: preview\n说明: ${message}`,
        }, contextInvalidated ? () => window.location.reload() : preview);
      }
    }
    button.addEventListener('click', () => void preview());
    button.replaceChildren(createPenIcon());
  }
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') dismiss(); });
  document.addEventListener('mousedown', (event) => {
    if (event.target !== host && !event.composedPath().includes(host)) dismiss();
  });
  return { root, showLauncher, dismiss };
}
