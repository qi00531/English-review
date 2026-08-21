import { AudioController, type AudioLike, type ReviewAudioEntry } from './AudioController';

class FakeAudio implements AudioLike {
  loop = false;
  currentTime = 0;
  onended: ((event: Event) => void) | null = null;
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

it('reports when the browser blocks playback', async () => {
  const controller = new AudioController((src) => {
    const audio = new FakeAudio(src);
    audio.play.mockRejectedValue(new DOMException('blocked', 'NotAllowedError'));
    return audio;
  });

  await expect(controller.loopCurrent(entries[0], 'us')).resolves.toEqual({ needsUserGesture: true });
});

it('uses speech synthesis fallback and cancels it on dispose', async () => {
  const speech = { speak: vi.fn(), cancel: vi.fn() };
  const controller = new AudioController((src) => new FakeAudio(src), speech);

  await controller.loopCurrent({ ...entries[0], usAudioUrl: null }, 'us');
  expect(speech.speak).toHaveBeenCalledWith('retain', 'us', expect.any(Function));
  controller.dispose();
  expect(speech.cancel).toHaveBeenCalled();
});
