export function eventComesFromCaptureOverlay(event: Event): boolean {
  return event.composedPath().some((target) =>
    target instanceof HTMLElement && target.dataset.wordJournal === 'capture',
  );
}
