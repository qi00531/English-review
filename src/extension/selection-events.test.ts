import { expect, it, vi } from 'vitest';
import { eventComesFromCaptureOverlay, listenForSelectionEnd } from './selection-events';

it('recognizes pointer events retargeted from the capture overlay host', () => {
  const host = document.createElement('div');
  host.dataset.wordJournal = 'capture';
  const event = { composedPath: () => [document.createElement('button'), host, document.body] } as unknown as Event;
  expect(eventComesFromCaptureOverlay(event)).toBe(true);
});

it('listens during capture so interactive sites cannot stop the selection event', () => {
  const target = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
  const listener = vi.fn();
  const cleanup = listenForSelectionEnd(target, listener);
  expect(target.addEventListener).toHaveBeenCalledWith('mouseup', listener, { capture: true });
  cleanup();
  expect(target.removeEventListener).toHaveBeenCalledWith('mouseup', listener, { capture: true });
});

it('allows ordinary page pointer events', () => {
  const event = { composedPath: () => [document.createElement('p'), document.body] } as unknown as Event;
  expect(eventComesFromCaptureOverlay(event)).toBe(false);
});
