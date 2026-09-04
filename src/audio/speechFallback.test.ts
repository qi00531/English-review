import { expect, it, vi } from 'vitest';
import { createBrowserSpeech } from './speechFallback';

class FakeUtterance {
  lang = '';
  voice: { name: string; lang: string; localService: boolean } | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor(readonly text: string) {}
}

const voices = [
  { name: 'Microsoft Huihui', lang: 'zh-CN', localService: true },
  { name: 'Google UK English Female', lang: 'en-GB', localService: false },
  { name: 'Google US English', lang: 'en-US', localService: false },
];

it('reports unavailable when speech APIs are absent', async () => {
  await expect(createBrowserSpeech(null, null).speak('focus', 'us', vi.fn())).resolves.toBe('unavailable');
});

it('resolves from utterance start and forwards its end callback', async () => {
  let utterance!: FakeUtterance;
  const synthesis = { speak: vi.fn((value: FakeUtterance) => { utterance = value; }), cancel: vi.fn(), getVoices: () => voices };
  const speech = createBrowserSpeech(synthesis, FakeUtterance);
  const ended = vi.fn();
  const result = speech.speak('focus', 'us', ended);
  await vi.waitFor(() => expect(synthesis.speak).toHaveBeenCalledOnce());
  utterance.onstart?.();
  await expect(result).resolves.toBe('playing');
  expect(utterance.lang).toBe('en-US');
  expect(utterance.voice?.name).toBe('Google US English');
  utterance.onend?.();
  expect(ended).toHaveBeenCalledOnce();
});

it('clears the stale Chrome speech queue before speaking on a later task', async () => {
  const calls: string[] = [];
  const synthesis = {
    cancel: vi.fn(() => calls.push('cancel')),
    speak: vi.fn((utterance: FakeUtterance) => {
      calls.push('speak');
      utterance.onstart?.();
    }),
    getVoices: () => voices,
  };

  await expect(createBrowserSpeech(synthesis, FakeUtterance).speak('focus', 'uk', vi.fn())).resolves.toBe('playing');

  expect(calls).toEqual(['cancel', 'speak']);
  const utterance = synthesis.speak.mock.calls[0][0];
  expect(utterance.voice?.name).toBe('Google UK English Female');
});

it('does not enqueue a pending utterance after playback is cancelled', async () => {
  const synthesis = { speak: vi.fn(), cancel: vi.fn(), getVoices: () => voices };
  const speech = createBrowserSpeech(synthesis, FakeUtterance);

  const result = speech.speak('first', 'us', vi.fn());
  speech.cancel();

  await expect(result).resolves.toBe('unavailable');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(synthesis.speak).not.toHaveBeenCalled();
});

it.each([
  ['not-allowed', 'needs-user-gesture'],
  ['voice-unavailable', 'unavailable'],
] as const)('maps %s to %s', async (error, expected) => {
  let utterance!: FakeUtterance;
  const speech = createBrowserSpeech({ speak: (value: FakeUtterance) => { utterance = value; }, cancel: vi.fn(), getVoices: () => voices }, FakeUtterance);
  const result = speech.speak('focus', 'uk', vi.fn());
  await vi.waitFor(() => expect(utterance).toBeDefined());
  utterance.onerror?.({ error });
  await expect(result).resolves.toBe(expected);
});
