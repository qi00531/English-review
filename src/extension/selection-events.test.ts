import { expect, it } from 'vitest';
import { eventComesFromCaptureOverlay } from './selection-events';

it('recognizes pointer events retargeted from the capture overlay host', () => {
  const host = document.createElement('div');
  host.dataset.wordJournal = 'capture';
  const event = { composedPath: () => [document.createElement('button'), host, document.body] } as unknown as Event;
  expect(eventComesFromCaptureOverlay(event)).toBe(true);
});

it('allows ordinary page pointer events', () => {
  const event = { composedPath: () => [document.createElement('p'), document.body] } as unknown as Event;
  expect(eventComesFromCaptureOverlay(event)).toBe(false);
});
