import React from 'react';
import { ComplaintStatus, ComplaintPriority } from '../../types';

interface BadgeProps {
  status?: ComplaintStatus | 'Paid' | 'Unpaid' | 'Overdue' | 'Active' | 'Inactive' | string;
  priority?: ComplaintPriority;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ status, priority, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size];

  if (priority) {
    let pColors = 'bg-slate-100 text-slate-700 border-slate-200';
    if (priority === 'Emergency') {
      pColors = 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    } else if (priority === 'High') {
      pColors = 'bg-orange-100 text-orange-800 border-orange-300';
    } else if (priority === 'Medium') {
      pColors = 'bg-amber-100 text-amber-800 border-amber-300';
    } else if (priority === 'Low') {
      pColors = 'bg-slate-100 text-slate-700 border-slate-300';
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border ${pColors} ${sizeClasses} ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {priority}
      </span>
    );
  }

  // Status mapping
  let sColors = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Pending':
      sColors = 'bg-amber-100 text-amber-800 border-amber-300';
      break;
    case 'Accepted':
      sColors = 'bg-blue-100 text-blue-800 border-blue-300';
      break;
    case 'Assigned':
      sColors = 'bg-indigo-100 text-indigo-800 border-indigo-300';
      break;
    case 'In Progress':
      sColors = 'bg-amber-500/15 text-amber-900 border-amber-400 font-bold';
      break;
    case 'Resolved':
      sColors = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      break;
    case 'Closed':
      sColors = 'bg-slate-100 text-slate-700 border-slate-300';
      break;
    case 'Rejected':
      sColors = 'bg-rose-100 text-rose-800 border-rose-300';
      break;
    case 'Paid':
      sColors = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      break;
    case 'Unpaid':
      sColors = 'bg-amber-100 text-amber-800 border-amber-300';
      break;
    case 'Overdue':
      sColors = 'bg-red-100 text-red-800 border-red-300 font-bold';
      break;
    case 'Active':
      sColors = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      break;
    case 'Inactive':
      sColors = 'bg-slate-200 text-slate-600 border-slate-300';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sColors} ${sizeClasses} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};
