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
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Banner with subtle navy-to-electric-blue gradient & decorative electric circuit */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C1E36] via-[#142D4E] to-[#1A4278] text-white p-6 sm:p-7 shadow-[0_12px_36px_rgba(20,45,78,0.16)] relative overflow-hidden border border-white/10">
        {/* Subtle electric ambient light */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-60 h-60 bg-[#2878F0]/25 rounded-full blur-3xl animate-electric-pulse" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 w-60 h-60 bg-[#48C6E8]/18 rounded-full blur-3xl animate-electric-pulse" />

        {/* Decorative electric circuit lines SVG overlay */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
        >
          <path
            d="M -20,120 L 180,120 L 230,70 L 480,70 L 530,140 L 820,140"
            fill="none"
            stroke="#48C6E8"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            className="animate-energy-dash"
          />
          <path
            d="M 60,220 L 320,220 L 360,180 L 640,180 L 700,90 L 820,90"
            fill="none"
            stroke="#2878F0"
            strokeWidth="1"
            strokeDasharray="6 14"
            className="animate-energy-dash"
          />
          <circle cx="230" cy="70" r="3" fill="#FFC857" opacity="0.8" />
          <circle cx="530" cy="140" r="3" fill="#48C6E8" opacity="0.8" />
        </svg>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-[#FFC857] border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#48C6E8] animate-pulse" />
              <Wrench className="w-3.5 h-3.5" />
              <span>Field Operations Unit</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium">
              Zone: {currentUser.address} • Contact: {currentUser.phone}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('complaints-work')}
            className="px-5 py-2.5 bg-[#FFC857] hover:bg-[#ffbe38] text-[#142D4E] font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#FFC857]/20 hover:shadow-lg hover:shadow-[#FFC857]/30 flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <AlertTriangle className="w-4 h-4 text-[#142D4E]" />
            <span>Active Jobs ({assignedCount + inProgressCount})</span>
          </button>
        </div>
      </div>

      {/* 3 KPI Summary Cards with Staggered Entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-premium flex flex-col justify-between p-5 animate-fade-in-up delay-75">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8491A5]">Newly Assigned Jobs</span>
              <div className="w-9 h-9 rounded-xl bg-[#2878F0]/10 text-[#2878F0] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#142D4E] mt-2 font-mono">
              {assignedCount}
            </div>
          </div>
          <div className="mt-3 text-xs text-[#2878F0] font-semibold">
            Ready for site inspection
          </div>
        </div>

        <div className="card-premium flex flex-col justify-between p-5 border-amber-200/80 bg-amber-50/15 animate-fade-in-up delay-150">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Work In Progress</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700 mt-2 font-mono">
              {inProgressCount}
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-800 font-bold">
            Crew currently on site
          </div>
        </div>

        <div className="card-premium flex flex-col justify-between p-5 animate-fade-in-up delay-225">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8491A5]">Resolved Jobs</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-2 font-mono">
              {resolvedCount}
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-semibold">
            Restored & verified
          </div>
        </div>
      </div>

      {/* Urgent Jobs Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(20,45,78,0.03)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#142D4E] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Priority / Emergency Field Tasks
            </h3>
            <p className="text-xs text-[#8491A5]">Hazardous wires, transformer burst, or emergency outages</p>
          </div>
          <button
            onClick={() => setActiveTab('complaints-work')}
            className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] cursor-pointer transition-colors"
          >
            All Assigned ({myComplaints.length}) →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {urgentJobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8491A5]">
              No emergency tickets currently pending in your queue.
            </div>
          ) : (
            urgentJobs.map(job => (
              <div key={job.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F6F8FC] transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-[#2878F0]/10 text-[#2878F0] px-2 py-0.5 rounded">
                      {job.id}
                    </span>
                    <Badge priority={job.priority} size="sm" />
                    <Badge status={job.status} size="sm" />
                    <span className="text-xs font-semibold text-[#8491A5]">• {job.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#172B45]">{job.subject}</h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#8491A5] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8491A5]" />
                      {job.consumerAddress}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#172B45]">
                      <Phone className="w-3.5 h-3.5 text-[#8491A5]" />
                      {job.consumerName}: {job.consumerPhone}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectComplaintToUpdate(job)}
                  className="px-4 py-2 bg-[#2878F0] hover:bg-[#1f64d0] text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
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
