export function LiveStatus({ children }: { children: React.ReactNode }) {
  return <div className="sr-only" role="status" aria-live="polite">{children}</div>;
}
