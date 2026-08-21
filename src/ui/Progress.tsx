export function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress-meta"><span>{label}</span><span>{value} / {max}</span></div>
      <progress value={value} max={max} aria-label={label} />
    </div>
  );
}
