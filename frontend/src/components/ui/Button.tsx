import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-indigo-600/20',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300',
    outline: 'border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-rose-600/20',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-emerald-600/20',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-amber-500/20',
    ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-5 py-2.5 text-base font-semibold gap-2.5'
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
};
