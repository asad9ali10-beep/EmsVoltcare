import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus } from '../../types';
import { Badge } from '../common/Badge';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Wrench,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
} from 'lucide-react';

export const ConsumerTrackComplaints: React.FC = () => {
  const { currentUser, complaints } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentUser) return null;

  const userComplaints = complaints
    .filter(c => c.consumerId === currentUser.id)
    .filter(c => {
      if (filterStatus === 'Active') {
        return c.status !== 'Resolved' && c.status !== 'Closed' && c.status !== 'Rejected';
      }
      if (filterStatus === 'Resolved') {
        return c.status === 'Resolved' || c.status === 'Closed';
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  /* Removed orphaned state */



  const STEPS: ComplaintStatus[] = ['Pending', 'Accepted', 'Assigned', 'In Progress', 'Resolved'];

  const getStepIndex = (status: ComplaintStatus): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Accepted': return 1;
      case 'Assigned': return 2;
      case 'In Progress': return 3;
      case 'Resolved':
      case 'Closed': return 4;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Track Complaints</h2>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs">
          {['All', 'Active', 'Resolved'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterStatus === tab
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {userComplaints.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Complaints Found</h3>
          <p className="text-xs text-slate-500">You have no complaints in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userComplaints.map(complaint => {
            const isExpanded = false; // Simplified for tracking
            const currentIndex = getStepIndex(complaint.status);
            const isRejected = complaint.status === 'Rejected';

            return (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                        {complaint.id}
                      </span>
                      <Badge status={complaint.status} size="sm" />
                      <Badge priority={complaint.priority} size="sm" />
                      <span className="text-xs text-slate-500 font-medium">• {complaint.category}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900">{complaint.subject}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {complaint.createdAt}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                      {expandedId === complaint.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded clean view */}
                {expandedId === complaint.id && (
                  <div className="px-4 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                    {/* Progress Bar or Rejection */}
                    {!isRejected ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Status Progress
                        </div>
                        <div className="grid grid-cols-5 gap-1.5 text-center">
                          {STEPS.map((step, idx) => {
                            const isDone = currentIndex >= idx;
                            const isCurrent = currentIndex === idx;
                            return (
                              <div key={step} className="flex flex-col items-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                    isCurrent
                                      ? 'bg-blue-800 text-amber-300 ring-2 ring-blue-100'
                                      : isDone
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  {isDone && !isCurrent ? '✓' : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1 font-medium ${isCurrent ? 'text-blue-900 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-rose-900">Rejected</div>
                          <p className="text-rose-700 mt-0.5">{complaint.rejectionReason || 'Does not meet criteria.'}</p>
                        </div>
                      </div>
                    )}

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="font-bold text-slate-800">Description & Location</div>
                        <p className="text-slate-600 leading-relaxed">{complaint.description}</p>
                        <div className="flex items-center gap-1 text-slate-500 pt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{complaint.area}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="font-bold text-slate-800">Assigned Lineman</div>
                        <div className="text-slate-700 font-medium">
                          {complaint.assignedTechnicianName || 'Awaiting assignment'}
                        </div>
                        {complaint.resolutionNotes && (
                          <div className="mt-2 p-2 bg-emerald-50 text-emerald-950 rounded border border-emerald-200">
                            <strong>Work Remarks:</strong> {complaint.resolutionNotes}
                          </div>
                        )}
                      </div>
                    </div>


                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
