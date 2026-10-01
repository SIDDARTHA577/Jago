import React from 'react';
import { clsx } from 'clsx';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden transition-all', className)}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; className?: string }> = ({
  title,
  description,
  action,
  className
}) => (
  <div className={clsx('p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50', className)}>
    <div>
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('p-5', className)}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between', className)}>{children}</div>
);

