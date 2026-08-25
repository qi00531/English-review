import { validateSelection } from '../capture/validate-selection';
import { createCaptureOverlay } from './capture-overlay';
import { eventComesFromCaptureOverlay } from './selection-events';

const overlay = createCaptureOverlay({ sendMessage: (message) => chrome.runtime.sendMessage(message) });

function show(text: string, rect: DOMRect) {
  const result = validateSelection(text);
  if (result.ok) overlay.showLauncher(result.text, rect);
}

document.addEventListener('mouseup', (event) => {
  if (eventComesFromCaptureOverlay(event)) return;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return overlay.dismiss();
  show(selection.toString(), selection.getRangeAt(0).getBoundingClientRect());
});
window.addEventListener('scroll', overlay.dismiss, { passive: true });
chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'SHOW_CAPTURE' && typeof message.text === 'string') {
    const selection = window.getSelection();
    show(message.text, selection?.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : new DOMRect(20, 20, 0, 0));
  }
});
