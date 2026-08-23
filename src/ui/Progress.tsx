export function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div className="progress-wrap">
      <span className="progress-label">{label}</span>
      <progress value={value} max={max} aria-label={label} />
      <span className="progress-count">{value} / {max}</span>
    </div>
  );
}
