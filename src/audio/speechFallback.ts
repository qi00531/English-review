export type Accent = 'us' | 'uk';
export type PlaybackResult = 'playing' | 'needs-user-gesture' | 'unavailable';

type SpeechUtteranceLike = {
  lang: string;
  voice: SpeechVoiceLike | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};
type SpeechVoiceLike = { name: string; lang: string; localService: boolean };
type SpeechSynthesisLike = {
  speak(utterance: SpeechUtteranceLike): void;
  cancel(): void;
  getVoices?(): SpeechVoiceLike[];
};
type UtteranceConstructor = new (text: string) => SpeechUtteranceLike;

export type SpeechPort = {
  speak(text: string, accent: Accent, onEnd: () => void): Promise<PlaybackResult>;
  cancel(): void;
};

export function createBrowserSpeech(synthesis: SpeechSynthesisLike | null, Utterance: UtteranceConstructor | null): SpeechPort {
  let generation = 0;
  let settlePending: ((result: PlaybackResult) => void) | null = null;

  return {
    speak(text, accent, onEnd) {
      if (!synthesis || !Utterance) return Promise.resolve('unavailable');
      const token = ++generation;
      return new Promise<PlaybackResult>((resolve) => {
        let settled = false;
        const settle = (result: PlaybackResult) => {
          if (settled) return;
          settled = true;
          if (settlePending === settle) settlePending = null;
          resolve(result);
        };
        settlePending = settle;
        try {
          const utterance = new Utterance(text);
          const language = accent === 'us' ? 'en-US' : 'en-GB';
          utterance.lang = language;
          const voices = synthesis.getVoices?.() ?? [];
          utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === language.toLowerCase())
            ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase()))
            ?? null;
          utterance.onstart = () => settle('playing');
          utterance.onend = () => { if (token === generation) onEnd(); };
          utterance.onerror = (event) => settle(event.error === 'not-allowed' ? 'needs-user-gesture' : 'unavailable');
          // Chromium can silently discard speak() when it runs in the same task
          // as cancel(). Clear the queue, then enqueue on the next task.
          synthesis.cancel();
          setTimeout(() => {
            if (token !== generation) return;
            try {
              synthesis.speak(utterance);
            } catch {
              settle('unavailable');
            }
          }, 0);
        } catch {
          settle('unavailable');
        }
      });
    },
    cancel() {
      generation += 1;
      settlePending?.('unavailable');
      synthesis?.cancel();
    },
  };
}

const synthesis = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis as unknown as SpeechSynthesisLike : null;
const Utterance = typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window ? window.SpeechSynthesisUtterance as unknown as UtteranceConstructor : null;
export const browserSpeech = createBrowserSpeech(synthesis, Utterance);
