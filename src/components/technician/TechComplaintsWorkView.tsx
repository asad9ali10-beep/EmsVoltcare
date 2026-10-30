import React, { useState } from 'react';
import { AlertTriangle, CheckSquare } from 'lucide-react';
import { TechAssignedComplaints } from './TechAssignedComplaints';
import { TechWorkHistory } from './TechWorkHistory';
import { Complaint } from '../../types';

interface TechComplaintsWorkViewProps {
  initialSelectedComplaint?: Complaint | null;
  onClearInitialSelected: () => void;
}

export const TechComplaintsWorkView: React.FC<TechComplaintsWorkViewProps> = ({
  initialSelectedComplaint,
  onClearInitialSelected,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'assigned' | 'history'>('assigned');

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Sub-Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Complaints & Work Management</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('assigned')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'assigned' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Assigned Complaints</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Work History</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Content */}
      <div>
        {activeSubTab === 'assigned' && (
          <TechAssignedComplaints
            initialSelectedComplaint={initialSelectedComplaint}
            onClearInitialSelected={onClearInitialSelected}
          />
        )}
        {activeSubTab === 'history' && <TechWorkHistory />}
      </div>
    </div>
  );
};
