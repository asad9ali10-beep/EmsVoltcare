import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  User,
  FileText,
  CreditCard,
  History,
  AlertTriangle,
  Search,
  BarChart3,
  Bell,
  Users,
  FilePlus,
  DollarSign,
  Wrench,
  FileSpreadsheet,
  CheckSquare,
  HelpCircle,
  LogOut,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentUser, activeTab, setActiveTab, logout, complaints, bills, notifications } = useApp();

  if (!currentUser) return null;

  // Unread notifications count
  const unreadCount = notifications.filter(
    n => !n.read && (currentUser.role === 'admin' ? true : n.recipientId === currentUser.id)
  ).length;

  // Unpaid bills for consumer
  const unpaidBillsCount = bills.filter(
    b => b.consumerId === currentUser.id && b.status !== 'Paid'
  ).length;

  // Pending complaints for admin
  const pendingAdminComplaints = complaints.filter(c => c.status === 'Pending').length;

  // Assigned active complaints for technician
  const techActiveComplaints = complaints.filter(
    c => c.assignedTechnicianId === currentUser.id && (c.status === 'Assigned' || c.status === 'In Progress')
  ).length;

  // Role Menus
  const consumerItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bills', label: 'Bills & Payments', icon: FileText, badge: unpaidBillsCount > 0 ? unpaidBillsCount : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'file-complaint', label: 'File a Complaint', icon: AlertTriangle },
    { id: 'track-complaints', label: 'Track Complaints', icon: Search },
    { id: 'profile', label: 'My Profile', icon: User, badge: unreadCount > 0 ? unreadCount : undefined, badgeColor: 'bg-red-100 text-red-800' },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'operations', label: 'Operations & Users', icon: Users, badge: pendingAdminComplaints > 0 ? pendingAdminComplaints : undefined, badgeColor: 'bg-amber-500 text-white font-bold' },
    { id: 'billing-revenue', label: 'Billing & Revenue', icon: DollarSign },
    { id: 'reports-system', label: 'Reports & System', icon: FileSpreadsheet, badge: unreadCount > 0 ? unreadCount : undefined, badgeColor: 'bg-red-100 text-red-800' },
  ];

  const technicianItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints-work', label: 'Complaints & Work', icon: AlertTriangle, badge: techActiveComplaints > 0 ? techActiveComplaints : undefined, badgeColor: 'bg-blue-600 text-white font-bold' },
    { id: 'profile-notifications', label: 'Profile & Alerts', icon: User, badge: unreadCount > 0 ? unreadCount : undefined, badgeColor: 'bg-red-100 text-red-800' },
  ];

  let menuItems = consumerItems;
  if (currentUser.role === 'admin') menuItems = adminItems;
  if (currentUser.role === 'technician') menuItems = technicianItems;

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 lg:w-72 select-none">
      {/* Role Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold capitalize text-slate-900">{currentUser.role} Portal</span>
          <span className="text-[10px] bg-blue-100 text-blue-900 font-semibold px-2 py-0.5 rounded-full">
            PKR (Rs.)
          </span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5 truncate font-medium">
          {currentUser.name}
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-800 text-white shadow-md shadow-blue-900/10'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    item.badgeColor || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 mt-3 border-t border-slate-100">
          <button
            onClick={() => handleSelectTab('help')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'bg-blue-800 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className={`w-4 h-4 shrink-0 ${activeTab === 'help' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Help & Support</span>
          </button>
        </div>
      </nav>

      {/* Emergency Helpline */}
      <div className="px-4 py-2.5 mx-3 mb-2 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700">Helpline:</span>
        <span className="font-mono font-bold text-red-600">Dial 118</span>
      </div>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block shrink-0 h-[calc(100vh-4rem)] sticky top-16 no-print">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
