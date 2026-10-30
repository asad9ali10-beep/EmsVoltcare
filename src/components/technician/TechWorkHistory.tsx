import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  CheckSquare,
  Search,
  Star,
  Calendar,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';

export const TechWorkHistory: React.FC = () => {
  const { currentUser, complaints } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  // Filter resolved/closed jobs by this technician
  const completedJobs = complaints
    .filter(
      c =>
        c.assignedTechnicianId === currentUser.id &&
        (c.status === 'Resolved' || c.status === 'Closed')
    )
    .filter(c => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.consumerName.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Work History</h2>
          <p className="text-xs text-slate-500">
            Resolved complaints, repair notes, and consumer feedback
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search completed jobs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 w-56 sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Job ID</th>
                <th className="py-3.5 px-4">Consumer & Location</th>
                <th className="py-3.5 px-4">Subject & Category</th>
                <th className="py-3.5 px-4">Resolution Notes</th>
                <th className="py-3.5 px-4">Materials Used</th>
                <th className="py-3.5 px-4 text-center">Consumer Rating</th>
                <th className="py-3.5 px-4 text-right">Resolved On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {completedJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No completed jobs match your search query.
                  </td>
                </tr>
              ) : (
                completedJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {job.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{job.consumerName}</div>
                      <div className="text-[11px] text-slate-500">{job.area}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{job.subject}</div>
                      <div className="text-[11px] text-slate-500">{job.category}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-slate-700 leading-relaxed line-clamp-2">
                        {job.resolutionNotes || 'Repaired and verified on site.'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {job.materialsUsed || <span className="text-slate-400 italic">None logged</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {job.consumerRating ? (
                        <div className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{job.consumerRating}.0</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Pending rating</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                      {job.updatedAt.slice(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
