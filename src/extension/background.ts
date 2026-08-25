import type { CaptureMessage } from '../capture/model';
import { enrichSelection } from '../capture/enrich-selection';
import { repository } from '../db';
import { CaptureBackgroundService } from './background-service';
import { readAiSettings } from './settings';

const service = new CaptureBackgroundService(repository, readAiSettings, enrichSelection);

async function openWordJournal(route = '/') {
  const base = chrome.runtime.getURL('index.html');
  const [existing] = await chrome.tabs.query({ url: `${base}*` });
  if (existing?.id) {
    await chrome.tabs.update(existing.id, { active: true, url: `${base}#${route}` });
    if (existing.windowId) await chrome.windows.update(existing.windowId, { focused: true });
    return;
  }
  await chrome.tabs.create({ url: `${base}#${route}` });
}

async function handleMessage(message: CaptureMessage) {
  if (message.type === 'PREVIEW_CAPTURE') return service.preview(message.text);
  if (message.type === 'SAVE_CAPTURE') return service.save(message.draft, message.allowDuplicate);
  await openWordJournal(message.route);
  return { ok: true as const };
}

chrome.runtime.onMessage.addListener((message: CaptureMessage, _sender, sendResponse) => {
  void handleMessage(message).then(sendResponse).catch((error: unknown) => {
    sendResponse({ ok: false, code: 'UNEXPECTED', message: error instanceof Error ? error.message : '未知错误' });
  });
  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'word-journal-capture', title: '收录到 Word Journal', contexts: ['selection'] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'word-journal-capture' && info.selectionText && tab?.id) {
    void chrome.tabs.sendMessage(tab.id, { type: 'SHOW_CAPTURE', text: info.selectionText }).catch(() => undefined);
  }
});

chrome.action.onClicked.addListener(() => { void openWordJournal('/'); });
