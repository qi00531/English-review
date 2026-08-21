import { useEffect, useRef } from 'react';

export function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel }: { title: string; description: string; confirmLabel: string; onConfirm: () => void | Promise<void>; onCancel: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
    <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <h3 id="confirm-title">{title}</h3><p>{description}</p>
      <div className="dialog-actions"><button ref={cancelRef} type="button" onClick={onCancel}>取消</button><button className="danger-action" type="button" onClick={onConfirm}>{confirmLabel}</button></div>
    </section>
  </div>;
}
