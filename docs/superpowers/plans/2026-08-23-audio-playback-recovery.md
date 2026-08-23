# Audio Playback Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore audible pronunciation by falling back from failed dictionary audio to browser speech and exposing a one-time user-gesture recovery action when playback is blocked.

**Architecture:** Make browser speech report asynchronous start/error outcomes, then let `AudioController` own the complete media-to-speech fallback chain and publish playback results. `ReviewPage` subscribes to those results, shows a restrained recovery action only when necessary, and never reports list playback as active unless playback actually starts.

**Tech Stack:** TypeScript, React 19, Web Audio/HTMLMediaElement, Web Speech API, Vitest, Testing Library, Playwright.

---

## File map

- Modify `src/audio/speechFallback.ts`: define playback results and convert speech events into an asynchronous result.
- Create `src/audio/speechFallback.test.ts`: cover unavailable, started, blocked, and synthesis-error behavior.
- Modify `src/audio/AudioController.ts`: add media error handling, speech fallback, generation guards, and result subscriptions.
- Modify `src/audio/AudioController.test.ts`: cover rejected media, delayed media errors, stale failures, and cleanup.
- Modify `src/features/review/ReviewPage.tsx`: subscribe to playback results and render retry/unavailable recovery UI.
- Modify `src/features/review/ReviewPage.test.tsx`: cover automatic unlock, successful retry, and honest list-playing state.
- Modify `src/features/review/ReviewRoute.test.tsx`: extend its fake audio controller with result subscription.
- Modify `src/ui/theme.css`: add a restrained inline audio recovery treatment.
- Modify `src/ui/background.test.ts`: lock the recovery selector into the CSS contract.
- Modify `tests/e2e/review-loop.spec.ts`: ensure the recovery action is keyboard accessible without relying on actual speakers.

### Task 1: Make browser speech report real outcomes

**Files:**
- Create: `src/audio/speechFallback.test.ts`
- Modify: `src/audio/speechFallback.ts`

- [ ] **Step 1: Write failing speech outcome tests**

```ts
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
  await expect(createBrowserSpeech(null, null).speak('focus', 'us', vi.fn()))
    .resolves.toBe('unavailable');
});

it('resolves from utterance start and forwards its end callback', async () => {
  let utterance!: FakeUtterance;
  const synthesis = { speak: vi.fn((value) => { utterance = value; }), cancel: vi.fn() };
  const speech = createBrowserSpeech(synthesis, FakeUtterance);
  const ended = vi.fn();
  const result = speech.speak('focus', 'us', ended);
  utterance.onstart?.();
  expect(await result).toBe('playing');
  expect(utterance.lang).toBe('en-US');
  utterance.onend?.();
  expect(ended).toHaveBeenCalledOnce();
});

it.each([
  ['not-allowed', 'needs-user-gesture'],
  ['voice-unavailable', 'unavailable'],
] as const)('maps %s to %s', async (error, expected) => {
  let utterance!: FakeUtterance;
  const speech = createBrowserSpeech({ speak: (value) => { utterance = value; }, cancel: vi.fn() }, FakeUtterance);
  const result = speech.speak('focus', 'uk', vi.fn());
  utterance.onerror?.({ error });
  await expect(result).resolves.toBe(expected);
});
```

- [ ] **Step 2: Run the test and verify the missing factory failure**

Run: `corepack pnpm vitest run src/audio/speechFallback.test.ts`
Expected: FAIL because `createBrowserSpeech` does not exist and `speak` returns void.

- [ ] **Step 3: Implement the asynchronous speech adapter**

Define and export:

```ts
export type PlaybackResult = 'playing' | 'needs-user-gesture' | 'unavailable';
export type SpeechPort = {
  speak(text: string, accent: Accent, onEnd: () => void): Promise<PlaybackResult>;
  cancel(): void;
};
```

Implement `createBrowserSpeech(synthesis, Utterance)` so the promise resolves once from `onstart`, `onerror`, or a synchronous exception. Map only `not-allowed` to `needs-user-gesture`; map missing APIs and all other errors to `unavailable`. Build `browserSpeech` from `window.speechSynthesis` and `window.SpeechSynthesisUtterance` when available.

- [ ] **Step 4: Run speech tests**

Run: `corepack pnpm vitest run src/audio/speechFallback.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/audio/speechFallback.ts src/audio/speechFallback.test.ts
git commit -m "fix: report browser speech outcomes"
```

### Task 2: Add resilient media fallback to AudioController

**Files:**
- Modify: `src/audio/AudioController.ts`
- Modify: `src/audio/AudioController.test.ts`

- [ ] **Step 1: Extend fakes and write failing fallback tests**

Add `onerror` to `FakeAudio` and make the speech fake return promises. Assert:

```ts
it('falls back to speech when media play rejects', async () => {
  const media = new FakeAudio('broken.mp3');
  media.play.mockRejectedValue(new DOMException('failed', 'NotSupportedError'));
  const speech = { speak: vi.fn().mockResolvedValue('playing'), cancel: vi.fn() };
  const controller = new AudioController(() => media, speech);
  await expect(controller.loopCurrent(entries[0], 'us')).resolves.toBe('playing');
  expect(speech.speak).toHaveBeenCalledWith('retain', 'us', expect.any(Function));
});

it('publishes fallback results after a delayed media error', async () => {
  const media = new FakeAudio('late-failure.mp3');
  const speech = { speak: vi.fn().mockResolvedValue('needs-user-gesture'), cancel: vi.fn() };
  const controller = new AudioController(() => media, speech);
  const listener = vi.fn();
  controller.subscribe(listener);
  await controller.loopCurrent(entries[0], 'us');
  media.onerror?.(new Event('error'));
  await vi.waitFor(() => expect(listener).toHaveBeenCalledWith('needs-user-gesture'));
});

it('ignores a stale media failure after moving to another entry', async () => {
  const made: FakeAudio[] = [];
  const speech = { speak: vi.fn().mockResolvedValue('playing'), cancel: vi.fn() };
  const controller = new AudioController((src) => { const audio = new FakeAudio(src); made.push(audio); return audio; }, speech);
  await controller.loopCurrent(entries[0], 'us');
  await controller.playRow(entries[1], 'us');
  made[0].onerror?.(new Event('error'));
  await Promise.resolve();
  expect(speech.speak).not.toHaveBeenCalledWith('retain', expect.anything(), expect.anything());
});
```

- [ ] **Step 2: Run controller tests and verify failures**

Run: `corepack pnpm vitest run src/audio/AudioController.test.ts`
Expected: FAIL because media errors do not fall back and subscriptions do not exist.

- [ ] **Step 3: Implement result subscriptions and one fallback path**

Add `onerror` to `AudioLike`, return `Promise<PlaybackResult>` from all play methods, and expose:

```ts
subscribe(listener: (result: PlaybackResult) => void) {
  this.listeners.add(listener);
  return () => this.listeners.delete(listener);
}
```

Create one private `playSpeech(entry, accent, onEnd, token)` method. Both missing URLs, rejected `play()`, and current-generation `onerror` call this method. Publish every final result to subscribers. Clear `onended` and `onerror` in `stopActiveSource`; guard every fallback and continuation with the generation token.

- [ ] **Step 4: Run controller and speech tests**

Run: `corepack pnpm vitest run src/audio/AudioController.test.ts src/audio/speechFallback.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/audio/AudioController.ts src/audio/AudioController.test.ts
git commit -m "fix: fall back when dictionary audio fails"
```

### Task 3: Add honest recovery interaction to ReviewPage

**Files:**
- Modify: `src/features/review/ReviewPage.tsx`
- Modify: `src/features/review/ReviewPage.test.tsx`
- Modify: `src/features/review/ReviewRoute.test.tsx`

- [ ] **Step 1: Write failing ReviewPage recovery tests**

Use a fake audio port whose `subscribe` captures the listener. Cover these observable behaviors:

```ts
expect(await screen.findByRole('button', { name: '点击页面开启发音' })).toBeVisible();
await user.click(screen.getByRole('button', { name: '点击页面开启发音' }));
expect(audio.loopCurrent).toHaveBeenCalledTimes(2);
expect(screen.queryByRole('button', { name: '点击页面开启发音' })).not.toBeInTheDocument();
```

Also make `playList` resolve `unavailable`, click `播放本组`, and assert the button remains named `播放本组` while `当前浏览器无法发音` is visible.

- [ ] **Step 2: Run ReviewPage tests and verify failures**

Run: `corepack pnpm vitest run src/features/review/ReviewPage.test.tsx`
Expected: FAIL because playback results and recovery UI are ignored.

- [ ] **Step 3: Implement playback result state**

Extend `ReviewAudioPort` with `subscribe`. In `ReviewPage`, store `PlaybackResult | null`, subscribe on mount, and await direct method calls. Automatic loop, retry, row/list playback, accent change, entry change, and layout change must set state only for their current action. Show:

```tsx
{playbackResult === 'needs-user-gesture' && (
  <button className="audio-recovery" type="button" onClick={retryCurrent}>
    点击页面开启发音
  </button>
)}
{playbackResult === 'unavailable' && (
  <p className="audio-unavailable" role="status">当前浏览器无法发音</p>
)}
```

Set `playingList` to true only after `playList` resolves `playing`; set it false for both failure results and when controller publications report a failure. Update every test fake, including `ReviewRoute.test.tsx`, with `subscribe: vi.fn(() => vi.fn())`.

- [ ] **Step 4: Run review tests and typecheck**

Run: `corepack pnpm vitest run src/features/review/ReviewPage.test.tsx src/features/review/ReviewRoute.test.tsx && corepack pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/review/ReviewPage.tsx src/features/review/ReviewPage.test.tsx src/features/review/ReviewRoute.test.tsx
git commit -m "fix: recover blocked review pronunciation"
```

### Task 4: Style and verify the complete recovery flow

**Files:**
- Modify: `src/ui/theme.css`
- Modify: `src/ui/background.test.ts`
- Modify: `tests/e2e/review-loop.spec.ts`

- [ ] **Step 1: Add a failing style contract**

Assert `theme.css` contains `.audio-recovery` and `.audio-unavailable`, includes a 44px minimum target for the recovery button, and does not add a fixed or sticky playback status bar.

- [ ] **Step 2: Run the style test and verify failure**

Run: `corepack pnpm vitest run src/ui/background.test.ts`
Expected: FAIL because the recovery selectors are absent.

- [ ] **Step 3: Add restrained inline styling**

Place the recovery control beneath the word content using existing moss/ink tokens, transparent background, no card, no toast, and no fixed positioning. Give the button at least 44px height, a visible focus state through the global rule, and keep the unavailable message visually secondary.

- [ ] **Step 4: Add browser-level accessibility coverage**

In `tests/e2e/review-loop.spec.ts`, stub `window.speechSynthesis` before opening review so the recovery state can be exercised deterministically, then assert the recovery button can receive keyboard focus. Do not assert audible speaker output in Playwright.

- [ ] **Step 5: Run focused browser and UI tests**

Run: `corepack pnpm vitest run src/ui/background.test.ts src/features/review/ReviewPage.test.tsx && corepack pnpm playwright test tests/e2e/review-loop.spec.ts`
Expected: PASS.

- [ ] **Step 6: Run complete verification**

Run: `corepack pnpm test && corepack pnpm typecheck && corepack pnpm build && corepack pnpm test:e2e`
Expected: all Vitest files pass, TypeScript exits 0, Vite builds successfully, and all Playwright scenarios pass.

- [ ] **Step 7: Confirm the background asset remains unchanged**

Run: `sha256sum public/assets/clipboard-paper-background.png`
Expected: `12eee4f1326a320ac7f94ca675579b40e7bd4f8bac9843b8c6fd60db11b6d20d`.

- [ ] **Step 8: Commit**

```bash
git add src/ui/theme.css src/ui/background.test.ts tests/e2e/review-loop.spec.ts
git commit -m "test: cover audio recovery interaction"
```
