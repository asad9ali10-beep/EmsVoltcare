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
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-tight',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-tight',
    lg: 'px-3 py-1.5 text-xs font-bold tracking-tight',
  }[size];

  if (priority) {
    let pColors = 'bg-slate-100/80 text-slate-700 border-slate-200/80';
    let dotColor = 'bg-slate-400';

    if (priority === 'Emergency') {
      pColors = 'bg-rose-50 text-rose-700 border-rose-200/80';
      dotColor = 'bg-rose-500 animate-pulse';
    } else if (priority === 'High') {
      pColors = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dotColor = 'bg-amber-500';
    } else if (priority === 'Medium') {
      pColors = 'bg-blue-50 text-blue-700 border-blue-200/80';
      dotColor = 'bg-[#2878F0]';
    } else if (priority === 'Low') {
      pColors = 'bg-slate-50 text-slate-600 border-slate-200/80';
      dotColor = 'bg-slate-400';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border ${pColors} ${sizeClasses} ${className} select-none`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        {priority}
      </span>
    );
  }

  // Status mapping
  let sColors = 'bg-slate-50 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    case 'Pending':
      sColors = 'bg-amber-50/90 text-amber-800 border-amber-200/90';
      dotColor = 'bg-[#FFC857]';
      break;
    case 'Accepted':
      sColors = 'bg-blue-50/90 text-[#2878F0] border-blue-200/80';
      dotColor = 'bg-[#2878F0]';
      break;
    case 'Assigned':
      sColors = 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80';
      dotColor = 'bg-indigo-500';
      break;
    case 'In Progress':
      sColors = 'bg-orange-50/90 text-orange-800 border-orange-200/80 font-bold';
      dotColor = 'bg-orange-500';
      break;
    case 'Resolved':
    case 'Paid':
    case 'Active':
      sColors = 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 font-semibold';
      dotColor = 'bg-emerald-500';
      break;
    case 'Closed':
      sColors = 'bg-slate-50 text-slate-600 border-slate-200/80';
      dotColor = 'bg-slate-400';
      break;
    case 'Rejected':
    case 'Overdue':
      sColors = 'bg-rose-50/90 text-rose-700 border-rose-200/80 font-bold';
      dotColor = 'bg-rose-500';
      break;
    case 'Unpaid':
      sColors = 'bg-amber-50/90 text-amber-900 border-amber-200/90';
      dotColor = 'bg-amber-500';
      break;
    case 'Inactive':
      sColors = 'bg-slate-100 text-slate-500 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sColors} ${sizeClasses} ${className} select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
};

