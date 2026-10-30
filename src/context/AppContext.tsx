import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Technician,
  Bill,
  Payment,
  Complaint,
  AppNotification,
  UserRole,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types';
import {
  INITIAL_CONSUMERS,
  INITIAL_ADMINS,
  INITIAL_TECHNICIANS,
  INITIAL_BILLS,
  INITIAL_PAYMENTS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { calculateBillCharges, createBillObject } from '../utils/tariff';
import { validatePhone, validateCNIC } from '../utils/validation';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  technicians: Technician[];
  bills: Bill[];
  payments: Payment[];
  complaints: Complaint[];
  notifications: AppNotification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  confirmDialog: ConfirmDialogOptions | null;
  showConfirmDialog: (options: ConfirmDialogOptions) => void;
  closeConfirmDialog: () => void;
  
  // Auth
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => void;
  registerConsumer: (data: Partial<User> & { password: string }) => boolean;
  updateUserProfile: (data: Partial<User>) => void;
  changePassword: (oldPass: string, newPass: string) => boolean;
  
  // Consumer Actions
  fileComplaint: (data: {
    category: ComplaintCategory;
    priority: ComplaintPriority;
    subject: string;
    description: string;
    area: string;
    imageAttachmentUrl?: string;
  }) => string;
  rateComplaint: (complaintId: string, rating: number, feedback: string) => void;
  payBill: (billId: string, method: Payment['paymentMethod'], accountRef: string) => Payment | null;
  
  // Admin Actions
  adminReviewComplaint: (complaintId: string, action: 'accept' | 'reject', reason?: string) => void;
  adminAssignComplaint: (complaintId: string, technicianId: string, remarks?: string) => void;
  adminCloseComplaint: (complaintId: string, remarks?: string) => void;
  generateBill: (consumerId: string, currentReading: number, customMonth?: string) => Bill | null;
  generateBillsForAll: () => number;
  addConsumer: (data: Omit<User, 'id' | 'role'>) => void;
  updateConsumer: (consumer: User) => void;
  toggleConsumerActive: (consumerId: string) => void;
  addTechnician: (tech: Omit<Technician, 'id' | 'activeJobsCount' | 'completedJobsCount'>) => void;
  updateTechnician: (tech: Technician) => void;
  deleteTechnician: (techId: string) => void;

  // Technician Actions
  techUpdateComplaintStatus: (
    complaintId: string,
    status: 'In Progress' | 'Resolved',
    notes: string,
    materialsUsed?: string
  ) => void;
  
  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Reset demo
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'voltcare_current_user',
  USERS: 'voltcare_users',
  TECHNICIANS: 'voltcare_technicians',
  BILLS: 'voltcare_bills',
  PAYMENTS: 'voltcare_payments',
  COMPLAINTS: 'voltcare_complaints',
  NOTIFICATIONS: 'voltcare_notifications',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial dummy data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [...INITIAL_CONSUMERS, ...INITIAL_ADMINS];
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TECHNICIANS;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BILLS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PAYMENTS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_COMPLAINTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default to Tariq Mahmood for seamless demo preview if desired, or null for login page
    // Let's set default null so login page is shown, with quick 1-click role logins!
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  // Auto-set Overdue bills
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setBills(prevBills => prevBills.map(bill => {
        if (bill.status === 'Unpaid' && bill.dueDate < today) {
            return { ...bill, status: 'Overdue' };
        }
        return bill;
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Keep technician active jobs count synchronized with assigned/in-progress complaints
  useEffect(() => {
    setTechnicians(prevTechs =>
      prevTechs.map(tech => {
        const activeCount = complaints.filter(
          c => c.assignedTechnicianId === tech.id && (c.status === 'Assigned' || c.status === 'In Progress')
        ).length;
        const resolvedCount = complaints.filter(
          c => c.assignedTechnicianId === tech.id && (c.status === 'Resolved' || c.status === 'Closed')
        ).length;
        return {
          ...tech,
          activeJobsCount: activeCount,
          completedJobsCount: resolvedCount,
        };
      })
    );
  }, [complaints]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showConfirmDialog = (options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

  // Auth Operations
  const login = (email: string, password = '1234'): boolean => {
    const cleanEmail = email.trim().toLowerCase();

    // Check in users (consumers and admins)
    let matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    // If not found in users, check if technician is logging in
    if (!matchedUser && (cleanEmail.includes('tech') || technicians.some(t => t.email.toLowerCase() === cleanEmail))) {
      const tech = technicians.find(t => t.email.toLowerCase() === cleanEmail) || technicians[0];
      if (tech) {
        matchedUser = {
          id: tech.id,
          name: tech.name,
          email: tech.email,
          role: 'technician',
          phone: tech.phone,
          cnic: '35201-9871234-9',
          address: tech.area,
          city: 'Islamabad / Regional Sub-Division',
          active: tech.active,
        };
      }
    }

    if (!matchedUser) {
      addToast('No account found with this email. Please check your credentials.', 'error');
      return false;
    }

    if (!matchedUser.active) {
      addToast('This account is currently deactivated by the utility administration.', 'error');
      return false;
    }

    if (password && matchedUser.password && matchedUser.password !== password) {
      addToast('Incorrect password.', 'error');
      return false;
    }

    setCurrentUser(matchedUser);
    setActiveTab('dashboard');
    addToast(`Welcome back, ${matchedUser.name}!`, 'success');
    return true;
  };

  const quickDemoLogin = (role: UserRole) => {
    if (role === 'consumer') {
      const user = users.find(u => u.role === 'consumer') || INITIAL_CONSUMERS[0];
      setCurrentUser(user);
    } else if (role === 'admin') {
      const user = users.find(u => u.role === 'admin') || INITIAL_ADMINS[0];
      setCurrentUser(user);
    } else if (role === 'technician') {
      const tech = technicians[0] || INITIAL_TECHNICIANS[0];
      setCurrentUser({
        id: tech.id,
        name: tech.name,
        email: tech.email,
        role: 'technician',
        phone: tech.phone,
        cnic: '35201-9871234-9',
        address: tech.area,
        city: 'Islamabad / Regional Sub-Division',
        active: tech.active,
      });
    }
    setActiveTab('dashboard');
    addToast(`Logged in with Demo ${role.toUpperCase()} account`, 'info');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    addToast('You have been securely logged out.', 'info');
  };

  const registerConsumer = (data: Partial<User> & { password: string }): boolean => {
    if (!data.email || !data.name || !data.cnic || !data.phone) {
      addToast('Please fill all required registration fields.', 'error');
      return false;
    }

    if (!validatePhone(data.phone)) {
      addToast('Invalid phone format. Use 03XX-XXXXXXX.', 'error');
      return false;
    }

    if (!validateCNIC(data.cnic)) {
      addToast('Invalid CNIC format. Enter 13 digits.', 'error');
      return false;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === data.email?.toLowerCase().trim());
    if (emailExists) {
      addToast('An account with this email already exists.', 'error');
      return false;
    }

    const cnicExists = users.some(u => u.cnic === data.cnic?.trim());
    if (cnicExists) {
      addToast('An account with this CNIC already exists.', 'error');
      return false;
    }

    if (data.meterNumber) {
      const meterExists = users.some(u => u.meterNumber === data.meterNumber?.trim());
      if (meterExists) {
        addToast('A consumer with this meter number already exists.', 'error');
        return false;
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newConsumerId = `c-${Date.now()}`;
    const newConsumer: User = {
      id: newConsumerId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: 'consumer',
      password: data.password || '1234',
      phone: data.phone.trim(),
      cnic: data.cnic.trim(),
      address: data.address || 'Street 1, Main Boulevard',
      city: data.city || 'Islamabad',
      meterNumber: data.meterNumber || `MTR-${randomSuffix}`,
      consumerNumber: `04-${randomSuffix}-101`,
      tariffCategory: 'A-1 Residential (Single Phase)',
      connectionDate: new Date().toISOString().split('T')[0],
      active: true,
    };

    setUsers(prev => [...prev, newConsumer]);

    // Generate an initial starter bill so they have immediate functionality
    const initialBill = createBillObject(
      `bill-${randomSuffix}`,
      newConsumer,
      'October 2026',
      1200,
      1420,
      '2026-10-02',
      '2026-10-16',
      'Unpaid'
    );
    setBills(prev => [initialBill, ...prev]);

    // Send welcome notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: newConsumerId,
        title: 'Welcome to VoltCare!',
        message: `Your consumer connection (#${newConsumer.consumerNumber}) is active. Your October bill has been generated.`,
        type: 'system',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        read: false,
      },
      ...prev,
    ]);

    setCurrentUser(newConsumer);
    setActiveTab('dashboard');
    addToast(`Account created successfully! Welcome, ${newConsumer.name}.`, 'success');
    return true;
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));

    // If technician, sync to technicians table too
    if (currentUser.role === 'technician') {
      setTechnicians(prev =>
        prev.map(t =>
          t.id === currentUser.id
            ? { ...t, name: updated.name, phone: updated.phone, area: updated.address }
            : t
        )
      );
    }
    addToast('Profile details updated successfully.', 'success');
  };

  const changePassword = (oldPass: string, newPass: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.password && currentUser.password !== oldPass) {
      addToast('Current password does not match.', 'error');
      return false;
    }
    if (newPass.length < 4) {
      addToast('Password must be at least 4 characters long.', 'error');
      return false;
    }
    const updated = { ...currentUser, password: newPass };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    addToast('Password changed successfully!', 'success');
    return true;
  };

  // Consumer Complaint Filing
  const fileComplaint = (data: {
    category: ComplaintCategory;
    priority: ComplaintPriority;
    subject: string;
    description: string;
    area: string;
    imageAttachmentUrl?: string;
  }): string => {
    if (!currentUser) return '';
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const idNumber = 1000 + complaints.length + 1;
    const complaintId = `CMP-${idNumber}`;

    const newComplaint: Complaint = {
      id: complaintId,
      consumerId: currentUser.id,
      consumerName: currentUser.name,
      consumerPhone: currentUser.phone,
      consumerAddress: currentUser.address,
      meterNumber: currentUser.meterNumber || 'MTR-0000',
      category: data.category,
      priority: data.priority,
      subject: data.subject.trim(),
      description: data.description.trim(),
      area: data.area || currentUser.city,
      imageAttachmentUrl: data.imageAttachmentUrl,
      status: 'Pending',
      createdAt: nowStr,
      updatedAt: nowStr,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          status: 'Pending',
          title: 'Complaint Submitted',
          timestamp: nowStr,
          updatedBy: currentUser.name,
          role: 'Consumer',
          remarks: 'Complaint filed via consumer portal.',
        },
      ],
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Admin Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: 'admin',
        title: `New Complaint: ${complaintId} (${data.priority})`,
        message: `${currentUser.name} reported: "${data.subject}" in ${data.area}`,
        type: 'complaint',
        timestamp: nowStr,
        read: false,
        linkTab: 'complaints',
      },
      ...prev,
    ]);

    addToast(`Complaint #${complaintId} submitted successfully. Tracking initiated.`, 'success');
    return complaintId;
  };

  const rateComplaint = (complaintId: string, rating: number, feedback: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            consumerRating: rating,
            consumerFeedback: feedback,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return c;
      })
    );
    addToast('Thank you for rating our field resolution service!', 'success');
  };

  // Bill Payment
  const payBill = (
    billId: string,
    method: Payment['paymentMethod'],
    accountRef: string
  ): Payment | null => {
    const targetBill = bills.find(b => b.id === billId);
    if (!targetBill) {
      addToast('Bill not found.', 'error');
      return null;
    }

    if (targetBill.status === 'Paid') {
      addToast('This bill has already been paid.', 'info');
      return null;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const txnId = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      transactionId: txnId,
      billId: targetBill.id,
      billNumber: targetBill.billNumber,
      consumerId: targetBill.consumerId,
      consumerName: targetBill.consumerName,
      amount: targetBill.totalCurrentBill,
      paymentMethod: method,
      paymentDate: nowStr,
      accountReference: accountRef,
      status: 'Successful',
    };

    // Update bill to paid
    setBills(prev =>
      prev.map(b => {
        if (b.id === billId) {
          return {
            ...b,
            status: 'Paid',
            paidDate: nowStr,
            paymentMethod: method,
            transactionId: txnId,
          };
        }
        return b;
      })
    );

    // Add to payments
    setPayments(prev => [payment, ...prev]);

    // Consumer notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: targetBill.consumerId,
        title: `Payment Received: ${targetBill.billNumber}`,
        message: `Payment of Rs. ${targetBill.totalCurrentBill.toLocaleString()} received via ${method}. Transaction ID: ${txnId}`,
        type: 'payment',
        timestamp: nowStr,
        read: false,
        linkTab: 'payments',
      },
      ...prev,
    ]);

    addToast(`Payment of Rs. ${targetBill.totalCurrentBill.toLocaleString()} successful! Transaction ID: ${txnId}`, 'success');
    return payment;
  };

  // Admin Actions
  const adminReviewComplaint = (complaintId: string, action: 'accept' | 'reject', reason?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const adminName = currentUser?.name || 'Engr. Asif Raza (SDO)';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const newStatus: ComplaintStatus = action === 'accept' ? 'Accepted' : 'Rejected';
          const newTimelineEvent = {
            id: `t-${Date.now()}`,
            status: newStatus,
            title: action === 'accept' ? 'Complaint Accepted by Admin' : 'Complaint Rejected',
            timestamp: nowStr,
            updatedBy: adminName,
            role: 'Admin',
            remarks: action === 'reject' ? reason : 'Verified and accepted for field dispatch.',
          };

          return {
            ...c,
            status: newStatus,
            rejectionReason: action === 'reject' ? reason : undefined,
            updatedAt: nowStr,
            timeline: [...c.timeline, newTimelineEvent],
          };
        }
        return c;
      })
    );

    const targetComplaint = complaints.find(c => c.id === complaintId);
    if (targetComplaint) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          recipientId: targetComplaint.consumerId,
          title: `Complaint #${complaintId} ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
          message: action === 'accept'
            ? 'Your complaint was accepted by administration and is being routed for technician assignment.'
            : `Your complaint was rejected. Reason: ${reason || 'Does not qualify for standard dispatch.'}`,
          type: 'complaint',
          timestamp: nowStr,
          read: false,
          linkTab: 'track-complaints',
        },
        ...prev,
      ]);
    }

    addToast(`Complaint #${complaintId} marked as ${action === 'accept' ? 'Accepted' : 'Rejected'}.`, 'success');
  };

  const adminAssignComplaint = (complaintId: string, technicianId: string, remarks?: string) => {
    const tech = technicians.find(t => t.id === technicianId);
    if (!tech) {
      addToast('Technician not found.', 'error');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const adminName = currentUser?.name || 'Engr. Asif Raza (SDO)';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const newTimelineEvent = {
            id: `t-${Date.now()}`,
            status: 'Assigned' as ComplaintStatus,
            title: `Assigned to ${tech.name}`,
            timestamp: nowStr,
            updatedBy: adminName,
            role: 'Admin',
            remarks: remarks || `Field assignment to ${tech.name} (${tech.area})`,
          };

          return {
            ...c,
            status: 'Assigned',
            assignedTechnicianId: tech.id,
            assignedTechnicianName: tech.name,
            updatedAt: nowStr,
            timeline: [...c.timeline, newTimelineEvent],
          };
        }
        return c;
      })
    );

    const targetComplaint = complaints.find(c => c.id === complaintId);
    if (targetComplaint) {
      // Notify consumer
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}-c`,
          recipientId: targetComplaint.consumerId,
          title: `Technician Assigned to #${complaintId}`,
          message: `${tech.name} (${tech.phone}) has been assigned to address: "${targetComplaint.subject}".`,
          type: 'complaint',
          timestamp: nowStr,
          read: false,
          linkTab: 'track-complaints',
        },
        // Notify technician
        {
          id: `notif-${Date.now()}-t`,
          recipientId: tech.id,
          title: `New Task Assigned: #${complaintId}`,
          message: `${targetComplaint.priority} Priority: ${targetComplaint.subject} at ${targetComplaint.consumerAddress}`,
          type: 'complaint',
          timestamp: nowStr,
          read: false,
          linkTab: 'assigned',
        },
        ...prev,
      ]);
    }

    addToast(`Assigned #${complaintId} to Lineman ${tech.name}. Consumer & Technician notified.`, 'success');
  };

  const adminCloseComplaint = (complaintId: string, remarks?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const adminName = currentUser?.name || 'Engr. Asif Raza (SDO)';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          return {
            ...c,
            status: 'Closed',
            updatedAt: nowStr,
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}`,
                status: 'Closed',
                title: 'Complaint Officially Closed',
                timestamp: nowStr,
                updatedBy: adminName,
                role: 'Admin',
                remarks: remarks || 'Consumer acknowledged resolution. Case closed.',
              },
            ],
          };
        }
        return c;
      })
    );

    addToast(`Complaint #${complaintId} has been officially closed.`, 'info');
  };

  // Technician Work Updates
  const techUpdateComplaintStatus = (
    complaintId: string,
    status: 'In Progress' | 'Resolved',
    notes: string,
    materialsUsed?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const techName = currentUser?.name || 'Kamran Akram (Technician)';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const newEvent = {
            id: `t-${Date.now()}`,
            status,
            title: status === 'In Progress' ? 'Work Started on Site' : 'Issue Resolved & Tested',
            timestamp: nowStr,
            updatedBy: techName,
            role: 'Technician',
            remarks: notes,
          };

          return {
            ...c,
            status,
            resolutionNotes: status === 'Resolved' ? notes : c.resolutionNotes,
            materialsUsed: materialsUsed || c.materialsUsed,
            updatedAt: nowStr,
            timeline: [...c.timeline, newEvent],
          };
        }
        return c;
      })
    );

    const target = complaints.find(c => c.id === complaintId);
    if (target) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}-consumer`,
          recipientId: target.consumerId,
          title: `Update on #${complaintId}: ${status}`,
          message: `${techName}: "${notes}"`,
          type: 'complaint',
          timestamp: nowStr,
          read: false,
          linkTab: 'track-complaints',
        },
        ...(status === 'Resolved' ? [{
          id: `notif-${Date.now()}-admin`,
          recipientId: 'admin',
          title: `Job Resolved: #${complaintId}`,
          message: `Technician ${techName} marked complaint #${complaintId} as resolved.`,
          type: 'complaint',
          timestamp: nowStr,
          read: false,
          linkTab: 'complaints',
        }] : []),
        ...prev,
      ]);
    }

    addToast(`Status updated to ${status}. Details recorded.`, 'success');
  };

  // Generate Bill for single consumer
  const generateBill = (
    consumerId: string,
    currentReading: number,
    customMonth?: string
  ): Bill | null => {
    const consumer = users.find(u => u.id === consumerId);
    if (!consumer) {
      addToast('Consumer not found.', 'error');
      return null;
    }

    // Find the latest reading for this consumer
    const consumerBills = bills
      .filter(b => b.consumerId === consumerId)
      .sort((a, b) => b.currentReading - a.currentReading);
    const prevReading = consumerBills.length > 0 ? consumerBills[0].currentReading : 1200;

    if (currentReading < prevReading) {
      addToast(`Current reading (${currentReading}) cannot be less than previous reading (${prevReading})!`, 'error');
      return null;
    }

    const monthStr = customMonth || 'November 2026';
    const newBillId = `bill-${Date.now().toString().slice(-5)}`;
    const bill = createBillObject(newBillId, consumer, monthStr, prevReading, currentReading);

    setBills(prev => [bill, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        recipientId: consumer.id,
        title: `New Bill Generated: ${monthStr}`,
        message: `Your electricity bill for ${monthStr} of Rs. ${bill.totalCurrentBill.toLocaleString()} is now available.`,
        type: 'bill',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        read: false,
        linkTab: 'bills',
      },
      ...prev,
    ]);

    addToast(`Bill #${bill.billNumber} generated successfully for ${consumer.name}.`, 'success');
    return bill;
  };

  // Generate Bills for all consumers (Batch generation)
  const generateBillsForAll = (): number => {
    const consumers = users.filter(u => u.role === 'consumer' && u.active);
    const monthStr = 'November 2026';
    const newBillsList: Bill[] = [];

    consumers.forEach(consumer => {
      const consumerBills = bills
        .filter(b => b.consumerId === consumer.id)
        .sort((a, b) => b.currentReading - a.currentReading);
      const prevReading = consumerBills.length > 0 ? consumerBills[0].currentReading : 1500;
      // Add realistic 180 to 420 units
      const addedUnits = Math.floor(180 + Math.random() * 240);
      const currentReading = prevReading + addedUnits;

      const newBill = createBillObject(
        `bill-${Date.now().toString().slice(-4)}-${consumer.id}`,
        consumer,
        monthStr,
        prevReading,
        currentReading
      );
      newBillsList.push(newBill);
    });

    setBills(prev => [...newBillsList, ...prev]);
    addToast(`Batch generation complete! Generated ${newBillsList.length} bills for ${monthStr}.`, 'success');
    return newBillsList.length;
  };

  // Consumer management
  const addConsumer = (data: Omit<User, 'id' | 'role'>) => {
    const newId = `c-${Date.now()}`;
    const newConsumer: User = {
      ...data,
      id: newId,
      role: 'consumer',
      active: true,
      connectionDate: data.connectionDate || new Date().toISOString().split('T')[0],
      consumerNumber: data.consumerNumber || `04-${Math.floor(10000 + Math.random() * 90000)}-01`,
      meterNumber: data.meterNumber || `MTR-${Math.floor(1000 + Math.random() * 9000)}`,
      tariffCategory: data.tariffCategory || 'A-1 Residential (Single Phase)',
    };
    setUsers(prev => [...prev, newConsumer]);
    addToast(`Consumer ${newConsumer.name} added successfully.`, 'success');
  };

  const updateConsumer = (updated: User) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
    }
    addToast(`Consumer ${updated.name} updated successfully.`, 'success');
  };

  const toggleConsumerActive = (consumerId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === consumerId) {
          const nextActive = !u.active;
          addToast(`Consumer account ${nextActive ? 'activated' : 'deactivated'}.`, 'info');
          return { ...u, active: nextActive };
        }
        return u;
      })
    );
  };

  // Technician management
  const addTechnician = (tech: Omit<Technician, 'id' | 'activeJobsCount' | 'completedJobsCount'>) => {
    const newTech: Technician = {
      ...tech,
      id: `t-${Date.now()}`,
      activeJobsCount: 0,
      completedJobsCount: 0,
    };
    setTechnicians(prev => [...prev, newTech]);
    addToast(`Technician ${tech.name} added to roster.`, 'success');
  };

  const updateTechnician = (tech: Technician) => {
    setTechnicians(prev => prev.map(t => (t.id === tech.id ? tech : t)));
    addToast(`Technician ${tech.name} profile updated.`, 'success');
  };

  const deleteTechnician = (techId: string) => {
    const target = technicians.find(t => t.id === techId);
    setTechnicians(prev => prev.filter(t => t.id !== techId));
    addToast(`Technician ${target?.name || ''} removed.`, 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev =>
      prev.map(n => {
        if (currentUser.role === 'admin' && n.recipientId === 'admin') {
          return { ...n, read: true };
        }
        if (n.recipientId === currentUser.id) {
          return { ...n, read: true };
        }
        return n;
      })
    );
    addToast('All notifications marked as read.', 'info');
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    localStorage.clear();
    setUsers([...INITIAL_CONSUMERS, ...INITIAL_ADMINS]);
    setTechnicians(INITIAL_TECHNICIANS);
    setBills(INITIAL_BILLS);
    setPayments(INITIAL_PAYMENTS);
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_CONSUMERS[0]);
    setActiveTab('dashboard');
    addToast('Demo database successfully reloaded to initial state.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        technicians,
        bills,
        payments,
        complaints,
        notifications,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast,
        confirmDialog,
        showConfirmDialog,
        closeConfirmDialog,
        login,
        logout,
        quickDemoLogin,
        registerConsumer,
        updateUserProfile,
        changePassword,
        fileComplaint,
        rateComplaint,
        payBill,
        adminReviewComplaint,
        adminAssignComplaint,
        adminCloseComplaint,
        generateBill,
        generateBillsForAll,
        addConsumer,
        updateConsumer,
        toggleConsumerActive,
        addTechnician,
        updateTechnician,
        deleteTechnician,
        techUpdateComplaintStatus,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
