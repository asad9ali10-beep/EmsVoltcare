import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Bill, Payment, Complaint } from './types';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { BillModal } from './components/common/BillModal';
import { PaymentModal } from './components/common/PaymentModal';
import { ReceiptModal } from './components/common/ReceiptModal';

// Auth
import { LoginPage } from './components/auth/LoginPage';

// Consumer Views
import { ConsumerDashboard } from './components/consumer/ConsumerDashboard';
import { ConsumerProfile } from './components/consumer/ConsumerProfile';
import { ConsumerBills } from './components/consumer/ConsumerBills';
import { ConsumerFileComplaint } from './components/consumer/ConsumerFileComplaint';
import { ConsumerTrackComplaints } from './components/consumer/ConsumerTrackComplaints';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOperationsView } from './components/admin/AdminOperationsView';
import { AdminBillingRevenueView } from './components/admin/AdminBillingRevenueView';
import { AdminReportsSystemView } from './components/admin/AdminReportsSystemView';

// Technician Views
import { TechDashboard } from './components/technician/TechDashboard';
import { TechComplaintsWorkView } from './components/technician/TechComplaintsWorkView';
import { TechProfileNotificationsView } from './components/technician/TechProfileNotificationsView';

// Shared
import { AboutHelpPage } from './components/help/AboutHelpPage';

const AppContent: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useApp();

  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global modals
  const [selectedBillForModal, setSelectedBillForModal] = useState<Bill | null>(null);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Payment | null>(null);

  // Technician complaint selected for direct update
  const [techSelectedComplaint, setTechSelectedComplaint] = useState<Complaint | null>(null);

  // If user is not logged in, render Login / Register page
  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
        <ConfirmDialog />
      </>
    );
  }

  // Handle Pay modal opening from bills or dashboard
  const handleOpenPayModal = (bill: Bill) => {
    setSelectedBillForPayment(bill);
  };

  // Handle successful payment: open receipt modal
  const handlePaymentSuccess = (receipt: Payment) => {
    setActiveReceipt(receipt);
  };

  // Handle technician updating a complaint from dashboard
  const handleSelectTechComplaint = (complaint: Complaint) => {
    setTechSelectedComplaint(complaint);
    setActiveTab('assigned');
  };

  // Render role-specific view based on activeTab
  const renderMainContent = () => {
    // If on About/Help tab, accessible to all roles
    if (activeTab === 'help') {
      return <AboutHelpPage />;
    }

    if (activeTab === 'notifications') {
      return <ConsumerProfile />;
    }

    // Role: CONSUMER
    if (currentUser.role === 'consumer') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <ConsumerDashboard
              onOpenBillModal={setSelectedBillForModal}
              onOpenPayModal={handleOpenPayModal}
            />
          );
        case 'bills':
          return (
            <ConsumerBills
              onOpenBillModal={setSelectedBillForModal}
              onOpenPayModal={handleOpenPayModal}
              onPaymentSuccess={handlePaymentSuccess}
            />
          );
        case 'file-complaint':
          return <ConsumerFileComplaint />;
        case 'track-complaints':
          return <ConsumerTrackComplaints />;
        case 'profile':
          return <ConsumerProfile />;
        default:
          return (
            <ConsumerDashboard
              onOpenBillModal={setSelectedBillForModal}
              onOpenPayModal={handleOpenPayModal}
            />
          );
      }
    }

    // Role: ADMIN
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'operations':
        case 'complaints':
        case 'consumers':
        case 'technicians':
          return <AdminOperationsView />;
        case 'billing-revenue':
        case 'generate-bills':
        case 'revenue':
          return (
            <AdminBillingRevenueView
              onOpenBillModal={setSelectedBillForModal}
              onViewReceipt={setActiveReceipt}
            />
          );
        case 'reports-system':
        case 'reports':
        case 'notifications':
          return <AdminReportsSystemView />;
        case 'profile':
          return <ConsumerProfile />;
        default:
          return <AdminDashboard />;
      }
    }

    // Role: TECHNICIAN
    if (currentUser.role === 'technician') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <TechDashboard onSelectComplaintToUpdate={handleSelectTechComplaint} />
          );
        case 'complaints-work':
        case 'assigned':
        case 'history':
          return (
            <TechComplaintsWorkView
              initialSelectedComplaint={techSelectedComplaint}
              onClearInitialSelected={() => setTechSelectedComplaint(null)}
            />
          );
        case 'profile-notifications':
        case 'profile':
        case 'notifications':
          return <TechProfileNotificationsView />;
        default:
          return (
            <TechDashboard onSelectComplaintToUpdate={handleSelectTechComplaint} />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Scrollable Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <BillModal
        bill={selectedBillForModal}
        onClose={() => setSelectedBillForModal(null)}
        onPayNow={handleOpenPayModal}
      />

      <PaymentModal
        bill={selectedBillForPayment}
        onClose={() => setSelectedBillForPayment(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        payment={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

      <ConfirmDialog />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
