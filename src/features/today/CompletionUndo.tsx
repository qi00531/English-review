import { useEffect } from 'react';

export function CompletionUndo({ nodeId, onUndo, onDismiss }: {
  nodeId: string; onUndo: (nodeId: string) => Promise<void>; onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 5_000);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="undo-toast" role="status" aria-live="polite">
      <span>本次复习已完成</span>
      <button type="button" onClick={async () => { await onUndo(nodeId); onDismiss(); }}>撤销完成</button>
    </div>
  );
}
