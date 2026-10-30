import React, { useState } from 'react';
import { AlertTriangle, Users, Wrench } from 'lucide-react';
import { AdminComplaints } from './AdminComplaints';
import { AdminConsumers } from './AdminConsumers';
import { AdminTechnicians } from './AdminTechnicians';
import { useApp } from '../../context/AppContext';

export const AdminOperationsView: React.FC = () => {
  const { complaints } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'complaints' | 'consumers' | 'technicians'>('complaints');

  const pendingCount = complaints.filter(c => c.status === 'Pending').length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Sub-Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Operations & User Management</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('complaints')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeSubTab === 'complaints' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Complaints</span>
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('consumers')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'consumers' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Consumers</span>
          </button>
          <button
            onClick={() => setActiveSubTab('technicians')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'technicians' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Technicians</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Content */}
      <div>
        {activeSubTab === 'complaints' && <AdminComplaints />}
        {activeSubTab === 'consumers' && <AdminConsumers />}
        {activeSubTab === 'technicians' && <AdminTechnicians />}
      </div>
    </div>
  );
};
