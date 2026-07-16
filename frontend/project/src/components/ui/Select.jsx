import { forwardRef } from 'react';

export const Select = forwardRef(
  ({ label, error, className, id, children, ...rest }, ref) => {
    const selId = id || rest.name;
    return (
      <div className="w-full">
        {label && <label className="label" htmlFor={selId}>{label}</label>}
        <select
          ref={ref}
          id={selId}
          className={`input appearance-none bg-no-repeat ${error ? 'ring-danger-400 focus:ring-danger-500' : ''} ${className ?? ''}`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
            backgroundPosition: 'right 0.875rem center',
          }}
          {...rest}
        >
          {children}
        </select>
        {error && <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
