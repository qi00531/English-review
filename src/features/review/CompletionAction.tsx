import { Check } from 'lucide-react';

export function CompletionAction({ onComplete }: { onComplete: () => void | Promise<void> }) {
  return <button className="completion-action" type="button" onClick={onComplete} aria-label="完成复习">
    <Check aria-hidden="true" size={18} strokeWidth={1.8} />完成复习
  </button>;
}
