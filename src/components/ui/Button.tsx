import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none";
  
  const sizeStyles = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9 px-4 text-sm gap-2",
    lg: "h-11 px-5 text-base gap-2.5",
  }[size];

  const variantStyles = {
    primary: "bg-[#0F766E] text-white hover:bg-[#115E59] focus-visible:ring-[#0F766E]",
    secondary: "bg-[#122238] text-white hover:bg-[#1E3A5F] focus-visible:ring-[#122238]",
    outline: "border border-[#E2E8F0] bg-white text-[#17263C] hover:bg-slate-50 focus-visible:ring-slate-400",
    danger: "bg-[#B91C1C] text-white hover:bg-[#991B1B] focus-visible:ring-[#B91C1C]",
    ghost: "bg-transparent text-[#64748B] hover:text-[#17263C] hover:bg-slate-100 focus-visible:ring-slate-400",
  }[variant];

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
