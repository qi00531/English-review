import { expect, it, vi } from 'vitest';
import { createBrowserSpeech } from './speechFallback';

class FakeUtterance {
  lang = '';
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(readonly text: string) {}
}

it('reports unavailable when speech APIs are absent', async () => {
  await expect(createBrowserSpeech(null, null).speak('focus', 'us', vi.fn())).resolves.toBe('unavailable');
});

it('resolves from utterance start and forwards its end callback', async () => {
  let utterance!: FakeUtterance;
  const synthesis = { speak: vi.fn((value: FakeUtterance) => { utterance = value; }), cancel: vi.fn() };
  const speech = createBrowserSpeech(synthesis, FakeUtterance);
  const ended = vi.fn();
  const result = speech.speak('focus', 'us', ended);
  utterance.onstart?.();
  await expect(result).resolves.toBe('playing');
  expect(utterance.lang).toBe('en-US');
  utterance.onend?.();
  expect(ended).toHaveBeenCalledOnce();
});

it.each([
  ['not-allowed', 'needs-user-gesture'],
  ['voice-unavailable', 'unavailable'],
] as const)('maps %s to %s', async (error, expected) => {
  let utterance!: FakeUtterance;
  const speech = createBrowserSpeech({ speak: (value: FakeUtterance) => { utterance = value; }, cancel: vi.fn() }, FakeUtterance);
  const result = speech.speak('focus', 'uk', vi.fn());
  utterance.onerror?.({ error });
  await expect(result).resolves.toBe(expected);
});
