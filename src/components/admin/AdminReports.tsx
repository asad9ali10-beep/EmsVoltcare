import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPKR } from '../../utils/tariff';
import {
  FileSpreadsheet,
  Printer,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { complaints, bills, payments, users, technicians } = useApp();

  const totalComplaints = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const rejected = complaints.filter(c => c.status === 'Rejected').length;

  const totalBilled = bills.reduce((acc, b) => acc + b.totalCurrentBill, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalUnits = bills.reduce((acc, b) => acc + b.unitsConsumed, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Operations & Revenue Report</h2>
          <p className="text-xs text-slate-500">
            Resolution metrics and tariff collection summary
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Report</span>
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 space-y-8 print-page">
        {/* Report Header */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-800 text-amber-400 flex items-center justify-center font-black">
              <Zap className="w-7 h-7 fill-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-blue-950">PowerLink Electric Supply Company</h1>
              <p className="text-xs text-slate-500 font-medium">Sub-Divisional Operations HQ • Monthly Performance Report</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold text-slate-900">Report Date: {new Date().toISOString().split('T')[0]}</div>
            <div className="text-slate-500 font-mono">Ref: VC-REP-2026-Q4</div>
          </div>
        </div>

        {/* Section 1: Executive Key Metrics */}
        <div>
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">
            1. Executive Performance Highlights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Total Consumers</span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                {users.filter(u => u.role === 'consumer').length}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Total Power Billed</span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1 block">
                {totalUnits.toLocaleString()} kWh
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Revenue Collected</span>
              <span className="text-xl font-black text-emerald-700 font-mono mt-1 block">
                {formatPKR(totalCollected)}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Complaint Resolution Rate</span>
              <span className="text-xl font-black text-blue-900 font-mono mt-1 block">
                {Math.round((resolved / (totalComplaints || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Complaints Summary */}
        <div>
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">
            2. Field Breakdown & Complaint Lifecycle Status
          </h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Status Category</th>
                  <th className="p-3 text-center">Ticket Count</th>
                  <th className="p-3 text-center">Percentage</th>
                  <th className="p-3">Operational Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-semibold text-emerald-800">Resolved / Closed</td>
                  <td className="p-3 text-center font-mono font-bold">{resolved}</td>
                  <td className="p-3 text-center font-mono">
                    {Math.round((resolved / (totalComplaints || 1)) * 100)}%
                  </td>
                  <td className="p-3 text-slate-600">Restoration verified on site</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-800">In Progress / Dispatched</td>
                  <td className="p-3 text-center font-mono font-bold">{inProgress}</td>
                  <td className="p-3 text-center font-mono">
                    {Math.round((inProgress / (totalComplaints || 1)) * 100)}%
                  </td>
                  <td className="p-3 text-slate-600">Linemen crews active in field</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-blue-800">Pending Review</td>
                  <td className="p-3 text-center font-mono font-bold">{pending}</td>
                  <td className="p-3 text-center font-mono">
                    {Math.round((pending / (totalComplaints || 1)) * 100)}%
                  </td>
                  <td className="p-3 text-slate-600">Awaiting SDO assessment</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-rose-800">Rejected</td>
                  <td className="p-3 text-center font-mono font-bold">{rejected}</td>
                  <td className="p-3 text-center font-mono">
                    {Math.round((rejected / (totalComplaints || 1)) * 100)}%
                  </td>
                  <td className="p-3 text-slate-600">Private internal wiring / out of scope</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Linemen Field Productivity */}
        <div>
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">
            3. Field Linemen Productivity Summary
          </h3>
          <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Lineman Name</th>
                  <th className="p-3">Sub-Division Area</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3 text-center">Active Jobs</th>
                  <th className="p-3 text-right">Resolved Jobs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {technicians.map(t => (
                  <tr key={t.id}>
                    <td className="p-3 font-bold text-slate-900">{t.name}</td>
                    <td className="p-3 text-slate-600">{t.area}</td>
                    <td className="p-3 text-slate-600">{t.specialization}</td>
                    <td className="p-3 text-center font-mono font-bold text-amber-700">
                      {t.activeJobsCount}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {t.completedJobsCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signatures & Footer */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="block font-bold text-slate-800">Engr. Asif Raza</span>
            <span>Sub-Divisional Officer (SDO) - Operations</span>
          </div>
          <div className="text-right">
            <span className="block font-mono">PowerLink Central Database</span>
            <span>Document generated automatically from system ledger</span>
          </div>
        </div>
      </div>
    </div>
  );
};
