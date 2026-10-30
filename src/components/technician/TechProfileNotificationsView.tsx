import React, { useState } from 'react';
import { User, Bell, CheckCheck, FileText, AlertTriangle, CreditCard, Info } from 'lucide-react';
import { TechProfile } from './TechProfile';
import { useApp } from '../../context/AppContext';

export const TechProfileNotificationsView: React.FC = () => {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, setActiveTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'notifications'>('profile');

  if (!currentUser) return null;

  const userNotifications = notifications.filter(
    n => n.recipientId === currentUser.id || n.recipientId === 'technician'
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'bill':
        return <FileText className="w-5 h-5 text-blue-800" />;
      case 'complaint':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Sub-Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Profile & Notifications</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'profile' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeSubTab === 'notifications' ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tab Content */}
      <div>
        {activeSubTab === 'profile' && <TechProfile />}
        {activeSubTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Technician Dispatch Alerts</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
              )}
            </div>

            {userNotifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {userNotifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.linkTab) setActiveTab(n.linkTab);
                    }}
                    className={`p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0">
                      {getNotifIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${!n.read ? 'text-blue-950 font-extrabold' : 'text-slate-900'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600">{n.message}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
