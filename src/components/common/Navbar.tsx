import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Bell,
  LogOut,
  User as UserIcon,
  HelpCircle,
  Menu,
  X,
  Check,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const {
    currentUser,
    logout,
    quickDemoLogin,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'technician') return n.recipientId === currentUser.id || n.recipientId === 'technician';
    return n.recipientId === currentUser.id;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-[#142D4E]/10 text-[#142D4E] border-[#142D4E]/20';
      case 'technician':
        return 'bg-[#FFC857]/25 text-[#946200] border-[#FFC857]/40';
      default:
        return 'bg-[#2878F0]/10 text-[#2878F0] border-[#2878F0]/20';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_2px_rgba(20,45,78,0.03)] no-print transition-all">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-[#8491A5] hover:text-[#172B45] hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#142D4E] flex items-center justify-center text-[#FFC857] shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 fill-[#FFC857]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#142D4E] tracking-tight">PowerLink</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2878F0]/10 text-[#2878F0]">
                  EMS
                </span>
              </div>
            </div>
          </div>
        </div>



        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">


          {/* Help link */}
          <button
            onClick={() => setActiveTab('help')}
            className="p-2 text-[#8491A5] hover:text-[#172B45] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Help & Emergency 118"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                  if (!showNotifications) markAllNotificationsRead();
                  setShowNotifications(!showNotifications);
              }}
              className="relative p-2 text-[#8491A5] hover:text-[#172B45] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#2878F0] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_12px_40px_rgba(20,45,78,0.12)] border border-slate-200/80 py-2 z-50 animate-fade-in-up">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#142D4E]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-semibold bg-[#2878F0]/10 text-[#2878F0] px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-[#2878F0] hover:text-[#1f64d0] font-semibold cursor-pointer transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#8491A5]">
                      No notifications yet
                    </div>
                  ) : (
                    userNotifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-[#F6F8FC] transition-colors cursor-pointer text-left ${
                          !n.read ? 'bg-[#2878F0]/5' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-bold ${!n.read ? 'text-[#142D4E]' : 'text-[#172B45]'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[#8491A5] whitespace-nowrap font-mono">
                            {n.timestamp.slice(11, 16)}
                          </span>
                        </div>
                        <p className="text-xs text-[#8491A5] mt-1 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 bg-[#F6F8FC]/60 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveTab('notifications');
                    }}
                    className="text-xs font-bold text-[#2878F0] hover:text-[#1f64d0] cursor-pointer transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100/80 border border-slate-200/80 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#142D4E] text-[#FFC857] font-bold text-xs flex items-center justify-center uppercase shadow-2xs">
                {currentUser?.name?.slice(0, 2) || 'PL'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#142D4E] leading-tight">
                  {currentUser?.name || 'User'}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser?.role)}`}>
                    {currentUser?.role || 'Guest'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#8491A5]" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_12px_40px_rgba(20,45,78,0.12)] border border-slate-200/80 py-2 z-50 animate-fade-in-up">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="text-xs font-bold text-[#142D4E]">{currentUser?.name}</div>
                  <div className="text-[11px] text-[#8491A5] truncate">{currentUser?.email}</div>
                  <div className="mt-1.5 text-[10px] font-mono text-[#8491A5]">
                    {currentUser?.role === 'consumer' ? `Consumer: ${currentUser?.consumerNumber}` : `Role: ${currentUser?.role}`}
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-[#172B45] hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-[#8491A5]" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('help');
                    }}
                    className="w-full px-4 py-2 text-left text-[#172B45] hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-[#8491A5]" />
                    Help & FAQs
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-semibold text-xs cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
