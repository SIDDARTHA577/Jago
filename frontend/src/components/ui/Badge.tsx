import React from 'react';
import { clsx } from 'clsx';

export type BadgeVariant = 
  | 'pending' 
  | 'under_review' 
  | 'verified' 
  | 'approved' 
  | 'rejected' 
  | 'permission_granted'
  | 'info' 
  | 'warning'
  | 'neutral';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const normalizedVariant = variant.toLowerCase().replace(/\s+/g, '_');

  const variantStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
    pending_verification: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
    under_verification: 'bg-sky-100 text-sky-800 border-sky-300 font-semibold',
    under_review: 'bg-sky-100 text-sky-800 border-sky-300 font-semibold',
    uploaded: 'bg-indigo-100 text-indigo-800 border-indigo-300 font-semibold',
    verified: 'bg-teal-100 text-teal-800 border-teal-300 font-semibold',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    permission_granted: 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold shadow-sm',
    rejected: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    info: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',
    warning: 'bg-orange-100 text-orange-800 border-orange-300 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-300'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variantStyles[normalizedVariant] || variantStyles.neutral,
        className
      )}
    >
      {children}
    </span>
  );
};
