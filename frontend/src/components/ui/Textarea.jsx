import { forwardRef } from 'react';

export const Textarea = forwardRef(
  ({ label, error, className, id, ...rest }, ref) => {
    const taId = id || rest.name;
    return (
      <div className="w-full">
        {label && <label className="label" htmlFor={taId}>{label}</label>}
        <textarea
          ref={ref}
          id={taId}
          className={`input min-h-[100px] resize-y ${error ? 'ring-danger-400 focus:ring-danger-500' : ''} ${className ?? ''}`}
          {...rest}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
