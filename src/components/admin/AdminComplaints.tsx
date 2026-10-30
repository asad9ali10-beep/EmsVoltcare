import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../../types';
import { Badge } from '../common/Badge';
import {
  AlertTriangle,
  Search,
  Filter,
  Check,
  X,
  UserCheck,
  Wrench,
  Clock,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const AdminComplaints: React.FC = () => {
  const {
    complaints,
    technicians,
    adminReviewComplaint,
    adminAssignComplaint,
    adminCloseComplaint,
    showConfirmDialog,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Selected complaint for drawer/modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Assign modal state
  const [selectedTechId, setSelectedTechId] = useState<string>('');
  const [assignRemarks, setAssignRemarks] = useState('');

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Status/Admin remarks state
  const [adminNote, setAdminNote] = useState('');

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.consumerName.toLowerCase().includes(q) ||
        c.meterNumber.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenComplaint = (c: Complaint) => {
    setSelectedComplaint(c);
    setSelectedTechId(c.assignedTechnicianId || (technicians[0]?.id ?? ''));
    setAssignRemarks('');
    setAdminNote('');
  };

  const handleAccept = () => {
    if (!selectedComplaint) return;
    adminReviewComplaint(selectedComplaint.id, 'accept');
    // update current drawer copy
    setSelectedComplaint(prev => (prev ? { ...prev, status: 'Accepted' } : null));
  };

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      addToast('Rejection reason is mandatory.', 'error');
      return;
    }
    if (!selectedComplaint) return;

    adminReviewComplaint(selectedComplaint.id, 'reject', rejectionReason.trim());
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedComplaint(prev => (prev ? { ...prev, status: 'Rejected' } : null));
  };

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedTechId) {
      addToast('Please select a technician.', 'error');
      return;
    }
    adminAssignComplaint(selectedComplaint.id, selectedTechId, assignRemarks);
    const tech = technicians.find(t => t.id === selectedTechId);
    setSelectedComplaint(prev =>
      prev
        ? {
            ...prev,
            status: 'Assigned',
            assignedTechnicianId: selectedTechId,
            assignedTechnicianName: tech?.name,
          }
        : null
    );
  };

  const handleCloseTicket = () => {
    if (!selectedComplaint) return;
    showConfirmDialog({
      title: `Close Complaint #${selectedComplaint.id}?`,
      message: 'This will officially close the ticket and archive the investigation. Proceed?',
      confirmLabel: 'Close Ticket',
      isDanger: false,
      onConfirm: () => {
        adminCloseComplaint(selectedComplaint.id, adminNote || 'Approved and closed by SDO.');
        setSelectedComplaint(prev => (prev ? { ...prev, status: 'Closed' } : null));
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Complaints</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Total Filtered:</span>
          <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
            {filteredComplaints.length} tickets
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, subject, consumer, area..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Assigned">Assigned to Lineman</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="All">All Priorities</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Power outage">Power outage</option>
              <option value="Voltage fluctuation">Voltage fluctuation</option>
              <option value="Meter fault">Meter fault</option>
              <option value="Wrong bill">Wrong bill</option>
              <option value="Damaged pole/wire">Damaged pole/wire</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Consumer Details</th>
                <th className="py-3.5 px-4">Category & Priority</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Area / Location</th>
                <th className="py-3.5 px-4">Assigned Lineman</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No complaints match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map(complaint => (
                  <tr key={complaint.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {complaint.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{complaint.consumerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Meter: {complaint.meterNumber} • {complaint.consumerPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap space-y-1">
                      <div className="text-slate-800 font-semibold">{complaint.category}</div>
                      <Badge priority={complaint.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{complaint.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{complaint.description}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {complaint.area}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {complaint.assignedTechnicianName ? (
                        <span className="font-semibold text-blue-900 flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5 text-blue-700" />
                          {complaint.assignedTechnicianName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Badge status={complaint.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenComplaint(complaint)}
                        className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
                      >
                        Manage & Dispatch
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Detail Modal / Management Drawer */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm bg-blue-100 text-blue-900 px-3 py-1 rounded-md">
                  {selectedComplaint.id}
                </span>
                <Badge status={selectedComplaint.status} size="md" />
                <Badge priority={selectedComplaint.priority} size="md" />
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Subject & Description */}
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{selectedComplaint.subject}</h3>
                <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Consumer Info Card */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200">
                <div>
                  <span className="text-slate-500 block">Consumer Name:</span>
                  <span className="font-bold text-slate-900">{selectedComplaint.consumerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone:</span>
                  <span className="font-bold text-slate-900">{selectedComplaint.consumerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Meter Serial:</span>
                  <span className="font-mono font-bold text-blue-900">{selectedComplaint.meterNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Premises Location:</span>
                  <span className="font-semibold text-slate-800">{selectedComplaint.area}</span>
                </div>
              </div>

              {/* Action Buttons: Accept / Reject if Pending */}
              {selectedComplaint.status === 'Pending' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="font-bold text-amber-900">Administrative Decision Required</div>
                  <p className="text-slate-600">
                    Review this ticket and decide whether to accept for lineman field dispatch or reject with justification.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleAccept}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Accept Complaint
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRejectModal(true)}
                      className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Reject Complaint...
                    </button>
                  </div>
                </div>
              )}

              {/* Rejection Notice if rejected */}
              {selectedComplaint.status === 'Rejected' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Complaint Rejected
                  </div>
                  <p className="italic">&quot;{selectedComplaint.rejectionReason}&quot;</p>
                </div>
              )}

              {/* Technician Assignment Form (For Accepted / Assigned / In Progress) */}
              {selectedComplaint.status !== 'Rejected' && selectedComplaint.status !== 'Closed' && (
                <form onSubmit={handleAssign} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-800" />
                    Assign Field Lineman / Technician
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Select Lineman:
                      </label>
                      <select
                        value={selectedTechId}
                        onChange={e => setSelectedTechId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {technicians.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.area}) - {t.activeJobsCount} active
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Dispatch Remarks (Optional):
                      </label>
                      <input
                        type="text"
                        value={assignRemarks}
                        onChange={e => setAssignRemarks(e.target.value)}
                        placeholder="e.g. Bring 100kVA drop-out fuse"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Assign & Notify Lineman and Consumer</span>
                  </button>
                </form>
              )}

              {/* Close Button for Resolved Tickets */}
              {selectedComplaint.status === 'Resolved' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-900">Work Marked Resolved by Technician</div>
                    <div className="text-[11px] text-emerald-700">
                      {selectedComplaint.resolutionNotes || 'Technician completed repair on site.'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseTicket}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Officially Close Ticket
                  </button>
                </div>
              )}

              {/* Complete Audit Timeline */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Lifecycle Timeline
                </div>
                <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                  {selectedComplaint.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-800 absolute -left-[21px] top-1" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{event.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">By {event.updatedBy} ({event.role})</div>
                      {event.remarks && (
                        <div className="text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                          &quot;{event.remarks}&quot;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reject Complaint Ticket</h3>
                  <p className="text-xs text-slate-500">Mandatory justification required by NEPRA regulations</p>
                </div>
              </div>

              <form onSubmit={handleRejectConfirm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rejection Reason *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="e.g. Internal home electrical wiring fault beyond the meter terminal. Please consult a private licensed electrician."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
