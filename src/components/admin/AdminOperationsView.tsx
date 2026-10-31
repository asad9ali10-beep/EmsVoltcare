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
    <div className="space-y-6 max-w-7xl animate-fade-in-up">
      {/* Sub-Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#142D4E]">Operations & User Management</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 text-xs shadow-xs">
          <button
            onClick={() => setActiveSubTab('complaints')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 relative ${
              activeSubTab === 'complaints' ? 'bg-[#2878F0] text-white shadow-xs' : 'text-[#8491A5] hover:text-[#172B45] hover:bg-[#F6F8FC]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Complaints</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 bg-[#FFC857] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('consumers')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'consumers' ? 'bg-[#2878F0] text-white shadow-xs' : 'text-[#8491A5] hover:text-[#172B45] hover:bg-[#F6F8FC]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Consumers</span>
          </button>
          <button
            onClick={() => setActiveSubTab('technicians')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'technicians' ? 'bg-[#2878F0] text-white shadow-xs' : 'text-[#8491A5] hover:text-[#172B45] hover:bg-[#F6F8FC]'
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
