import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import {
  AlertTriangle,
  UploadCloud,
  X,
  Send,
  ShieldAlert,
  MapPin,
  FileQuestion,
  CheckCircle2,
} from 'lucide-react';

export const ConsumerFileComplaint: React.FC = () => {
  const { currentUser, fileComplaint, setActiveTab, addToast } = useApp();

  const [category, setCategory] = useState<ComplaintCategory>('Power outage');
  const [priority, setPriority] = useState<ComplaintPriority>('High');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState(currentUser?.address || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!currentUser) return null;

  const categories: { label: ComplaintCategory; desc: string }[] = [
    { label: 'Power outage', desc: 'No electricity supply, transformer tripping or phase lost' },
    { label: 'Voltage fluctuation', desc: 'Abnormally high/low voltage damaging home appliances' },
    { label: 'Meter fault', desc: 'Burnt terminal, blank LCD screen, or incorrect dial spin' },
    { label: 'Wrong bill', desc: 'Meter reading discrepancy, calculation error or double tax' },
    { label: 'Damaged pole/wire', desc: 'Hanging 11kV lines, sparking cables or leaning concrete pole' },
    { label: 'Other', desc: 'General electricity inquiries or feeder connection issues' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image size exceeds 5MB limit.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      addToast('Please enter a brief subject for the complaint.', 'error');
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      addToast('Please provide a descriptive explanation (at least 15 characters).', 'error');
      return;
    }

    if (!area.trim()) {
      addToast('Please specify the location or premises address.', 'error');
      return;
    }

    const complaintId = fileComplaint({
      category,
      priority,
      subject,
      description,
      area,
      imageAttachmentUrl: imagePreview || undefined,
    });

    setSubmittedId(complaintId);
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold px-3 py-1 bg-blue-100 text-blue-900 rounded-full">
              {submittedId}
            </span>
            <h2 className="text-2xl font-black text-slate-900">Complaint Registered Successfully!</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your ticket has been placed in the Sub-Divisional Officer queue for review and field lineman dispatch.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-slate-900">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Priority:</span>
              <span className="font-bold text-red-600">{priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Meter Number:</span>
              <span className="font-mono text-slate-900">{currentUser.meterNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="text-slate-900">{area}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab('track-complaints')}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-800 hover:bg-blue-900 transition-colors text-sm shadow-md cursor-pointer"
            >
              Track Complaint Timeline
            </button>
            <button
              onClick={() => {
                setSubmittedId(null);
                setSubject('');
                setDescription('');
                setImagePreview(null);
              }}
              className="px-5 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm cursor-pointer"
            >
              File Another Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">File a Complaint</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        {/* Category Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {categories.map(cat => (
              <button
                type="button"
                key={cat.label}
                onClick={() => setCategory(cat.label)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  category === cat.label
                    ? 'border-blue-800 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-800 font-semibold'
                }`}
              >
                <div className="text-xs">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Priority *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['Low', 'Medium', 'High', 'Emergency'] as ComplaintPriority[]).map(p => {
              let pColor = 'border-slate-200 hover:border-slate-300';
              if (priority === p) {
                if (p === 'Emergency') pColor = 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-400 font-bold';
                else if (p === 'High') pColor = 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-300 font-bold';
                else if (p === 'Medium') pColor = 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-300 font-bold';
                else pColor = 'border-blue-700 bg-blue-50 text-blue-900 ring-2 ring-blue-300 font-bold';
              }

              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 px-3 rounded-xl border text-xs transition-all cursor-pointer ${pColor}`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Complaint Subject *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="e.g. Transformer burst on street pole with smoke"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Please explain the problem clearly, including what happened, appliance behavior, and any visible pole or wire damage..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
          />
        </div>

        {/* Location & Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Area / Street Address *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              required
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder="e.g. House # 42-B, Sector G-11/2, Islamabad"
              className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Optional Image Upload (Preview only as required) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Photo / Meter Snapshot Attachment (Optional)
          </label>

          {imagePreview ? (
            <div className="relative inline-block border-2 border-slate-200 rounded-2xl overflow-hidden p-1 bg-slate-50">
              <img
                src={imagePreview}
                alt="Complaint Attachment"
                className="w-48 h-32 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1 bg-slate-900/70 text-white rounded-full hover:bg-slate-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-blue-800">Click to upload photo of meter or damaged wire</span>
              <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Consumer Meter: <strong className="text-slate-800">{currentUser.meterNumber}</strong>
          </span>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-white bg-blue-800 hover:bg-blue-900 active:bg-blue-950 transition-colors shadow-md flex items-center gap-2 text-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Complaint Ticket</span>
          </button>
        </div>
      </form>
    </div>
  );
};
