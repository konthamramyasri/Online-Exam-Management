import { useEffect } from 'react';
import { X } from 'lucide-react';

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClass[size]} card animate-scale-in max-h-[90vh] overflow-y-auto`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
            <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
