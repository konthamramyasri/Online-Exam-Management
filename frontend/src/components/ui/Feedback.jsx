export function Spinner({ className }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 ${className ?? ''}`}
    />
  );
}

export function PageLoader({ label }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Spinner className="h-8 w-8 border-3" />
      {label && <p className="text-sm text-ink-500">{label}</p>}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={`skeleton rounded-lg ${className ?? ''}`} />;
}
