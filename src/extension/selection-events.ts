export function eventComesFromCaptureOverlay(event: Event): boolean {
  return event.composedPath().some((target) =>
    target instanceof HTMLElement && target.dataset.wordJournal === 'capture',
  );
}

type SelectionEventTarget = {
  addEventListener(type: 'mouseup', listener: EventListener, options: { capture: true }): void;
  removeEventListener(type: 'mouseup', listener: EventListener, options: { capture: true }): void;
};

export function listenForSelectionEnd(target: SelectionEventTarget, listener: EventListener) {
  const options = { capture: true } as const;
  target.addEventListener('mouseup', listener, options);
  return () => target.removeEventListener('mouseup', listener, options);
}
