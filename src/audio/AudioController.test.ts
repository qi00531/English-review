import { AudioController, type AudioLike, type ReviewAudioEntry } from './AudioController';

class FakeAudio implements AudioLike {
  loop = false;
  currentTime = 0;
  onended: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  constructor(readonly src: string) {}
}

const entries: ReviewAudioEntry[] = [
  { id: 'one', english: 'retain', usAudioUrl: 'one-us.mp3', ukAudioUrl: 'one-uk.mp3' },
  { id: 'two', english: 'subtle', usAudioUrl: 'two-us.mp3', ukAudioUrl: null },
];

it('loops the current word until another action stops it', async () => {
  const made: FakeAudio[] = [];
  const controller = new AudioController((src) => { const audio = new FakeAudio(src); made.push(audio); return audio; });

  await controller.loopCurrent(entries[0], 'us');
  expect(made[0].src).toBe('one-us.mp3');
  expect(made[0].loop).toBe(true);

  await controller.playRow(entries[1], 'us');
  expect(made[0].pause).toHaveBeenCalled();
  expect(made[1].loop).toBe(false);
});

it('advances through the List and loops to the first entry', async () => {
  const made: FakeAudio[] = [];
  const controller = new AudioController((src) => { const audio = new FakeAudio(src); made.push(audio); return audio; });

  await controller.playList('list-1', entries, 'us');
  made[0].onended?.(new Event('ended'));
  await Promise.resolve();
  made[1].onended?.(new Event('ended'));
  await Promise.resolve();

  expect(made.map((audio) => audio.src)).toEqual(['one-us.mp3', 'two-us.mp3', 'one-us.mp3']);
});

it('falls back to speech when media play rejects', async () => {
  const speech = { speak: vi.fn().mockResolvedValue('playing'), cancel: vi.fn() };
  const controller = new AudioController((src) => {
    const audio = new FakeAudio(src);
    audio.play.mockRejectedValue(new DOMException('failed', 'NotSupportedError'));
    return audio;
  }, speech);

  await expect(controller.loopCurrent(entries[0], 'us')).resolves.toBe('playing');
  expect(speech.speak).toHaveBeenCalledWith('retain', 'us', expect.any(Function));
});

it('uses speech synthesis fallback and cancels it on dispose', async () => {
  const speech = { speak: vi.fn().mockResolvedValue('playing'), cancel: vi.fn() };
  const controller = new AudioController((src) => new FakeAudio(src), speech);

  await controller.loopCurrent({ ...entries[0], usAudioUrl: null }, 'us');
  expect(speech.speak).toHaveBeenCalledWith('retain', 'us', expect.any(Function));
  controller.dispose();
  expect(speech.cancel).toHaveBeenCalled();
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
