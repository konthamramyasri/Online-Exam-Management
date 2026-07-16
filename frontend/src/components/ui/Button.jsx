import { forwardRef } from 'react';

const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  accent: 'btn-accent',
};

const sizeClass = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      className={`${variantClass[variant]} ${sizeClass[size]} ${className ?? ''}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
