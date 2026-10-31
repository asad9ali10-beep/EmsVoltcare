import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const AboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-800 text-xs font-bold mb-6 hover:underline cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
        <h1 className="text-2xl font-black text-blue-950 mb-4">About PowerLink</h1>
        <p className="text-sm text-slate-600 mb-6">
          PowerLink - Electricity Management System.
          Built for a university course project at <strong>UET Lahore</strong>.
        </p>
        <div className="space-y-2 text-xs text-slate-500">
          <p><strong>Group Members:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Member 1</li>
            <li>Member 2</li>
            <li>Member 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
