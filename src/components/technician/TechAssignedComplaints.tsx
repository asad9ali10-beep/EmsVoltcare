import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus } from '../../types';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  X,
  Send,
  Calendar,
  Layers,
} from 'lucide-react';

interface TechAssignedComplaintsProps {
  initialSelectedComplaint?: Complaint | null;
  onClearInitialSelected?: () => void;
}

export const TechAssignedComplaints: React.FC<TechAssignedComplaintsProps> = ({
  initialSelectedComplaint,
  onClearInitialSelected,
}) => {
  const { currentUser, complaints, techUpdateComplaintStatus, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Assigned' | 'In Progress'>('All');

  // Update modal state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    initialSelectedComplaint || null
  );
  const [newStatus, setNewStatus] = useState<'In Progress' | 'Resolved'>('In Progress');
  const [workNotes, setWorkNotes] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');

  // Handle external selection from dashboard
  React.useEffect(() => {
    if (initialSelectedComplaint) {
      setSelectedComplaint(initialSelectedComplaint);
      setNewStatus(initialSelectedComplaint.status === 'In Progress' ? 'Resolved' : 'In Progress');
      setWorkNotes(initialSelectedComplaint.resolutionNotes || '');
      setMaterialsUsed(initialSelectedComplaint.materialsUsed || '');
    }
  }, [initialSelectedComplaint]);

  if (!currentUser) return null;

  // Filter complaints for this technician
  const myAssignedJobs = complaints
    .filter(c => c.assignedTechnicianId === currentUser.id)
    .filter(c => c.status === 'Assigned' || c.status === 'In Progress')
    .filter(c => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.consumerName.toLowerCase().includes(q) ||
          c.consumerAddress.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleOpenUpdateModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status === 'In Progress' ? 'Resolved' : 'In Progress');
    setWorkNotes(c.resolutionNotes || '');
    setMaterialsUsed(c.materialsUsed || '');
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
    if (onClearInitialSelected) onClearInitialSelected();
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!workNotes.trim()) {
      addToast('Please enter your work notes / resolution details.', 'error');
      return;
    }

    if (!selectedComplaint) return;

    techUpdateComplaintStatus(selectedComplaint.id, newStatus, workNotes.trim(), materialsUsed.trim());
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assigned Complaints</h2>
          <p className="text-xs text-slate-500">
            Field repair orders and resolution tracking
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {(['All', 'Assigned', 'In Progress'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search assigned job by ID, subject, consumer..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Cards list */}
      {myAssignedJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">All Field Jobs Completed</h3>
          <p className="text-xs text-slate-500">
            You do not currently have any pending field repairs in this category. Check your Work History for completed tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myAssignedJobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-md">
                      {job.id}
                    </span>
                    <Badge priority={job.priority} size="sm" />
                  </div>
                  <Badge status={job.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{job.subject}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="text-blue-900">{job.consumerName}</span>
                    <span className="text-slate-400 font-normal">|</span>
                    <a
                      href={`tel:${job.consumerPhone}`}
                      className="text-blue-700 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {job.consumerPhone}
                    </a>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{job.consumerAddress}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Meter: <strong className="font-mono text-slate-800">{job.meterNumber}</strong> • Area: {job.area}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Assigned: {job.updatedAt.slice(0, 10)}
                </span>
                <button
                  onClick={() => handleOpenUpdateModal(job)}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Update Work & Status</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technician Update Work Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Field Job #{selectedComplaint.id}</h3>
                <p className="text-xs text-slate-500">{selectedComplaint.subject}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 text-xs">
              {/* Status Switcher */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Set New Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewStatus('In Progress')}
                    className={`py-3 px-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      newStatus === 'In Progress'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    In Progress (On Site)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('Resolved')}
                    className={`py-3 px-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      newStatus === 'Resolved'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Resolved (Repair Completed)
                  </button>
                </div>
              </div>

              {/* Work Notes / Resolution Details */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Notes & Resolution Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={workNotes}
                  onChange={e => setWorkNotes(e.target.value)}
                  placeholder="e.g. Arrived on site. Replaced damaged drop-out fuse link on transformer pole. Tested voltage at consumer main breaker (225V steady). Problem resolved."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed font-medium"
                />
              </div>

              {/* Materials / Spares Used */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Materials / Spares Consumed (Optional)
                </label>
                <input
                  type="text"
                  value={materialsUsed}
                  onChange={e => setMaterialsUsed(e.target.value)}
                  placeholder="e.g. 63A cut-out fuse link, 2m jumper wire, seal lock # 8812"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Work Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
