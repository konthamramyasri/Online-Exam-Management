const toneClass = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200',
  success: 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200',
  danger: 'bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-200',
  neutral: 'bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-200',
  accent: 'bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200',
};

export function Badge({ tone = 'neutral', children, className }) {
  return (
    <span className={`badge ${toneClass[tone]} ${className ?? ''}`}>
      {children}
    </span>
  );
}
