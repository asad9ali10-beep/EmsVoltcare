import React from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint } from '../../types';
import { Badge } from '../common/Badge';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Phone,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';

interface TechDashboardProps {
  onSelectComplaintToUpdate: (complaint: Complaint) => void;
}

export const TechDashboard: React.FC<TechDashboardProps> = ({ onSelectComplaintToUpdate }) => {
  const { currentUser, complaints, setActiveTab } = useApp();

  if (!currentUser) return null;

  // Filter complaints assigned to this technician
  const myComplaints = complaints.filter(c => c.assignedTechnicianId === currentUser.id);

  const assignedCount = myComplaints.filter(c => c.status === 'Assigned').length;
  const inProgressCount = myComplaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = myComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const urgentJobs = myComplaints.filter(
    c => (c.status === 'Assigned' || c.status === 'In Progress') && (c.priority === 'Emergency' || c.priority === 'High')
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 shadow-xl shadow-blue-950/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700 text-xs font-semibold text-amber-300">
              <Wrench className="w-3.5 h-3.5" />
              <span>Field Operations</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-blue-200 text-xs md:text-sm font-medium">
              Zone: {currentUser.address} • Phone: {currentUser.phone}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('assigned')}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-400/20 flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <AlertTriangle className="w-4 h-4 text-slate-950" />
            <span>Active Jobs ({assignedCount + inProgressCount})</span>
          </button>
        </div>
      </div>

      {/* 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Newly Assigned Jobs</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-900 mt-2 font-mono">
              {assignedCount}
            </div>
          </div>
          <div className="mt-3 text-xs text-blue-700 font-semibold">
            Ready for site inspection
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Work In Progress</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700 mt-2 font-mono">
              {inProgressCount}
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-800 font-bold">
            Lineman crew currently on site
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolved Jobs</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2 font-mono">
              {resolvedCount}
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-700 font-semibold">
            Restored & verified
          </div>
        </div>
      </div>

      {/* Urgent Jobs Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              Priority / Emergency Field Tasks
            </h3>
            <p className="text-xs text-slate-500">Hazardous wires, transformer burst, or emergency outages</p>
          </div>
          <button
            onClick={() => setActiveTab('assigned')}
            className="text-xs font-bold text-blue-800 hover:text-blue-950 cursor-pointer"
          >
            All Assigned ({myComplaints.length}) →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {urgentJobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No emergency tickets currently pending in your queue.
            </div>
          ) : (
            urgentJobs.map(job => (
              <div key={job.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                      {job.id}
                    </span>
                    <Badge priority={job.priority} size="sm" />
                    <Badge status={job.status} size="sm" />
                    <span className="text-xs font-semibold text-slate-700">• {job.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{job.subject}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.consumerAddress}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {job.consumerName}: {job.consumerPhone}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectComplaintToUpdate(job)}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Update Work Status</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
