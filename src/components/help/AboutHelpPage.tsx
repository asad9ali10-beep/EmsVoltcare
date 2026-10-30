import React from 'react';
import {
  HelpCircle,
  Zap,
  FileText,
} from 'lucide-react';
import { TARIFF_SLABS } from '../../utils/tariff';

export const AboutHelpPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Help & Support</h2>
      </div>

      {/* Emergency Contact Hero */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl shadow-blue-950/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-amber-300" />
              24/7 Emergency Fault Response
            </span>
            <h1 className="text-2xl md:text-3xl font-black">
              Emergency Helpline: Dial 118
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href="tel:118"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-sm transition-all shadow-md shadow-amber-400/20 text-center"
            >
              Call 118 Now
            </a>
            <span className="text-[11px] text-blue-200 text-center font-mono">SMS Fault to: 8118</span>
          </div>
        </div>
      </div>

      {/* Regional Customer Care Centers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">Islamabad (IESCO)</div>
          <div className="text-sm font-bold text-slate-900">WAPDA House, Sector G-7/4</div>
          <p className="text-xs text-slate-500">Ph: (051) 9252937</p>
          <span className="text-[11px] text-slate-400 block">Mon - Sat: 8:00 AM - 4:00 PM</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">Lahore (LESCO)</div>
          <div className="text-sm font-bold text-slate-900">22-A Queens Road, Mozang</div>
          <p className="text-xs text-slate-500">Ph: (042) 99204814</p>
          <span className="text-[11px] text-slate-400 block">Mon - Sat: 8:00 AM - 4:00 PM</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">Karachi (K-Electric)</div>
          <div className="text-sm font-bold text-slate-900">KE House, Punjab Colony</div>
          <p className="text-xs text-slate-500">Ph: (021) 111-537-211</p>
          <span className="text-[11px] text-slate-400 block">24/7 Consumer Centers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">Rawalpindi Division</div>
          <div className="text-sm font-bold text-slate-900">Cantt Complex, The Mall</div>
          <p className="text-xs text-slate-500">Ph: (051) 9270034</p>
          <span className="text-[11px] text-slate-400 block">Mon - Sat: 8:00 AM - 4:00 PM</span>
        </div>
      </div>

      {/* NEPRA Approved Tariff Schedule */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-800" />
          <h3 className="text-base font-bold text-slate-900">
            Government Approved Tariff Rates (Residential Slabs)
          </h3>
        </div>


        <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Slab Tier</th>
                <th className="p-3">Monthly Consumption Range</th>
                <th className="p-3 text-right">Base Tariff Rate (PKR / Unit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {TARIFF_SLABS.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">Tier {idx + 1}</td>
                  <td className="p-3 text-slate-700">{s.label}</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-900">
                    Rs. {s.rate.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
