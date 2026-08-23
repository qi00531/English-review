import { browserSpeech, type Accent, type PlaybackResult, type SpeechPort } from './speechFallback';

export type ReviewAudioEntry = { id: string; english: string; usAudioUrl: string | null; ukAudioUrl: string | null };
export type AudioLike = {
  loop: boolean; currentTime: number;
  onended: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  play(): Promise<void>; pause(): void;
};
export type PlaybackMode =
  | { kind: 'paused' }
  | { kind: 'current-loop'; entryId: string }
  | { kind: 'list-loop'; listId: string; index: number }
  | { kind: 'row-once'; entryId: string };

export class AudioController {
  mode: PlaybackMode = { kind: 'paused' };
  private activeAudio: AudioLike | null = null;
  private generation = 0;
  private readonly listeners = new Set<(result: PlaybackResult) => void>();

  constructor(
    private readonly makeAudio: (src: string) => AudioLike = (src) => new Audio(src),
    private readonly speech: SpeechPort = browserSpeech,
  ) {}

  subscribe(listener: (result: PlaybackResult) => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  async loopCurrent(entry: ReviewAudioEntry, accent: Accent): Promise<PlaybackResult> {
    const token = this.beginTransition({ kind: 'current-loop', entryId: entry.id });
    const repeat = () => {
      if (this.isCurrent(token, 'current-loop')) void this.playEntry(entry, accent, true, repeat, token);
    };
    return this.playEntry(entry, accent, true, repeat, token);
  }

  async playRow(entry: ReviewAudioEntry, accent: Accent): Promise<PlaybackResult> {
    const token = this.beginTransition({ kind: 'row-once', entryId: entry.id });
    return this.playEntry(entry, accent, false, () => this.pause(), token);
  }

  async playList(listId: string, entries: ReviewAudioEntry[], accent: Accent): Promise<PlaybackResult> {
    if (entries.length === 0) return this.publish('unavailable');
    const token = this.beginTransition({ kind: 'list-loop', listId, index: 0 });
    return this.playListIndex(listId, entries, accent, 0, token);
  }

  pause() {
    this.generation += 1;
    this.stopActiveSource();
    this.mode = { kind: 'paused' };
  }

  dispose() { this.pause(); this.listeners.clear(); }

  private beginTransition(mode: PlaybackMode) {
    this.generation += 1;
    this.stopActiveSource();
    this.mode = mode;
    return this.generation;
  }

  private async playListIndex(listId: string, entries: ReviewAudioEntry[], accent: Accent, index: number, token: number): Promise<PlaybackResult> {
    if (!this.isCurrent(token, 'list-loop')) return 'unavailable';
    this.stopActiveSource();
    this.mode = { kind: 'list-loop', listId, index };
    const next = () => {
      if (this.isCurrent(token, 'list-loop')) void this.playListIndex(listId, entries, accent, (index + 1) % entries.length, token);
    };
    return this.playEntry(entries[index], accent, false, next, token);
  }

  private async playEntry(entry: ReviewAudioEntry, accent: Accent, loop: boolean, onEnd: () => void, token: number): Promise<PlaybackResult> {
    const source = accent === 'us' ? entry.usAudioUrl : entry.ukAudioUrl;
    if (!source) return this.playSpeech(entry, accent, onEnd, token);

    const audio = this.makeAudio(source);
    let fallback: Promise<PlaybackResult> | null = null;
    const fallBackOnce = () => {
      if (fallback) return fallback;
      if (token !== this.generation) return Promise.resolve<PlaybackResult>('unavailable');
      this.releaseAudio(audio);
      fallback = this.playSpeech(entry, accent, onEnd, token);
      return fallback;
    };
    audio.loop = loop;
    audio.onended = onEnd;
    audio.onerror = () => { void fallBackOnce(); };
    this.activeAudio = audio;
    try {
      await audio.play();
      if (token !== this.generation) return 'unavailable';
      return this.publish('playing');
    } catch {
      return fallBackOnce();
    }
  }

  private async playSpeech(entry: ReviewAudioEntry, accent: Accent, onEnd: () => void, token: number): Promise<PlaybackResult> {
    if (token !== this.generation) return 'unavailable';
    const result = await this.speech.speak(entry.english, accent, () => {
      if (token === this.generation) onEnd();
    });
    if (token !== this.generation) return 'unavailable';
    return this.publish(result);
  }

  private publish(result: PlaybackResult) {
    this.listeners.forEach((listener) => listener(result));
    return result;
  }

  private isCurrent(token: number, kind: PlaybackMode['kind']) {
    return token === this.generation && this.mode.kind === kind;
  }

  private releaseAudio(audio: AudioLike) {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.currentTime = 0;
    if (this.activeAudio === audio) this.activeAudio = null;
  }

  private stopActiveSource() {
    if (this.activeAudio) this.releaseAudio(this.activeAudio);
    this.speech.cancel();
  }
}
