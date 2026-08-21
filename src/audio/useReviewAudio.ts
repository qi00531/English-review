import { useEffect, useRef, useState } from 'react';
import { AudioController, type PlaybackMode } from './AudioController';

export function useReviewAudio() {
  const controller = useRef<AudioController | null>(null);
  const [mode, setMode] = useState<PlaybackMode>({ kind: 'paused' });
  if (!controller.current) controller.current = new AudioController();

  useEffect(() => () => controller.current?.dispose(), []);

  return {
    controller: controller.current,
    mode,
    syncMode: () => setMode(controller.current!.mode),
  };
}
