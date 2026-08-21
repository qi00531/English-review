export type Accent = 'us' | 'uk';

export type SpeechPort = {
  speak(text: string, accent: Accent, onEnd: () => void): void;
  cancel(): void;
};

export const browserSpeech: SpeechPort = {
  speak(text, accent, onEnd) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === 'us' ? 'en-US' : 'en-GB';
    utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  },
  cancel() {
    window.speechSynthesis?.cancel();
  },
};
