export type Accent = 'us' | 'uk';
export type PlaybackResult = 'playing' | 'needs-user-gesture' | 'unavailable';

type SpeechUtteranceLike = {
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};
type SpeechSynthesisLike = { speak(utterance: SpeechUtteranceLike): void; cancel(): void };
type UtteranceConstructor = new (text: string) => SpeechUtteranceLike;

export type SpeechPort = {
  speak(text: string, accent: Accent, onEnd: () => void): Promise<PlaybackResult>;
  cancel(): void;
};

export function createBrowserSpeech(synthesis: SpeechSynthesisLike | null, Utterance: UtteranceConstructor | null): SpeechPort {
  return {
    speak(text, accent, onEnd) {
      if (!synthesis || !Utterance) return Promise.resolve('unavailable');
      return new Promise<PlaybackResult>((resolve) => {
        let settled = false;
        const settle = (result: PlaybackResult) => {
          if (settled) return;
          settled = true;
          resolve(result);
        };
        try {
          const utterance = new Utterance(text);
          utterance.lang = accent === 'us' ? 'en-US' : 'en-GB';
          utterance.onstart = () => settle('playing');
          utterance.onend = onEnd;
          utterance.onerror = (event) => settle(event.error === 'not-allowed' ? 'needs-user-gesture' : 'unavailable');
          synthesis.speak(utterance);
        } catch {
          settle('unavailable');
        }
      });
    },
    cancel() { synthesis?.cancel(); },
  };
}

const synthesis = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis as unknown as SpeechSynthesisLike : null;
const Utterance = typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window ? window.SpeechSynthesisUtterance as unknown as UtteranceConstructor : null;
export const browserSpeech = createBrowserSpeech(synthesis, Utterance);
