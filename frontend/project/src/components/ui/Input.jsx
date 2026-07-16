import { forwardRef } from 'react';

export const Input = forwardRef(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="w-full">
        {label && <label className="label" htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'ring-danger-400 focus:ring-danger-500' : ''} ${className ?? ''}`}
          {...rest}
        />
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
