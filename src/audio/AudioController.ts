import { browserSpeech, type Accent, type SpeechPort } from './speechFallback';

export type ReviewAudioEntry = {
  id: string;
  english: string;
  usAudioUrl: string | null;
  ukAudioUrl: string | null;
};

export type AudioLike = {
  loop: boolean;
  currentTime: number;
  onended: ((event: Event) => void) | null;
  play(): Promise<void>;
  pause(): void;
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

  constructor(
    private readonly makeAudio: (src: string) => AudioLike = (src) => new Audio(src),
    private readonly speech: SpeechPort = browserSpeech,
  ) {}

  async loopCurrent(entry: ReviewAudioEntry, accent: Accent) {
    const token = this.beginTransition({ kind: 'current-loop', entryId: entry.id });
    const source = accent === 'us' ? entry.usAudioUrl : entry.ukAudioUrl;
    if (!source) {
      const repeat = () => {
        if (this.generation === token && this.mode.kind === 'current-loop') {
          this.speech.speak(entry.english, accent, repeat);
        }
      };
      this.speech.speak(entry.english, accent, repeat);
      return { needsUserGesture: false };
    }
    return this.playAudio(source, true);
  }

  async playRow(entry: ReviewAudioEntry, accent: Accent) {
    this.beginTransition({ kind: 'row-once', entryId: entry.id });
    const source = accent === 'us' ? entry.usAudioUrl : entry.ukAudioUrl;
    if (!source) {
      this.speech.speak(entry.english, accent, () => this.pause());
      return { needsUserGesture: false };
    }
    return this.playAudio(source, false);
  }

  async playList(listId: string, entries: ReviewAudioEntry[], accent: Accent) {
    if (entries.length === 0) return { needsUserGesture: false };
    const token = this.beginTransition({ kind: 'list-loop', listId, index: 0 });
    return this.playListIndex(listId, entries, accent, 0, token);
  }

  pause() {
    this.generation += 1;
    this.stopActiveSource();
    this.mode = { kind: 'paused' };
  }

  dispose() {
    this.pause();
  }

  private beginTransition(mode: PlaybackMode) {
    this.generation += 1;
    this.stopActiveSource();
    this.mode = mode;
    return this.generation;
  }

  private async playListIndex(
    listId: string,
    entries: ReviewAudioEntry[],
    accent: Accent,
    index: number,
    token: number,
  ): Promise<{ needsUserGesture: boolean }> {
    if (token !== this.generation) return { needsUserGesture: false };
    this.stopActiveSource();
    this.mode = { kind: 'list-loop', listId, index };
    const entry = entries[index];
    const next = () => {
      if (token === this.generation) {
        void this.playListIndex(listId, entries, accent, (index + 1) % entries.length, token);
      }
    };
    const source = accent === 'us' ? entry.usAudioUrl : entry.ukAudioUrl;
    if (!source) {
      this.speech.speak(entry.english, accent, next);
      return { needsUserGesture: false };
    }
    return this.playAudio(source, false, next);
  }

  private async playAudio(source: string, loop: boolean, onEnded: (() => void) | null = null) {
    const audio = this.makeAudio(source);
    audio.loop = loop;
    audio.onended = onEnded;
    this.activeAudio = audio;
    try {
      await audio.play();
      return { needsUserGesture: false };
    } catch {
      return { needsUserGesture: true };
    }
  }

  private stopActiveSource() {
    if (this.activeAudio) {
      this.activeAudio.onended = null;
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
    this.speech.cancel();
  }
}
