import { Inbox } from 'lucide-react';

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
        {icon ?? <Inbox size={26} />}
      </div>
      <h3 className="text-base font-semibold text-ink-800">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger-200 bg-danger-50/50 px-6 py-12 text-center">
      <p className="text-sm font-medium text-danger-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}
