export type UserRole = 'consumer' | 'admin' | 'technician';

export type ComplaintCategory =
  | 'Power outage'
  | 'Wrong bill'
  | 'Meter fault'
  | 'Voltage fluctuation'
  | 'Damaged pole/wire'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export type ComplaintStatus =
  | 'Pending'
  | 'Accepted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Rejected';

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  timestamp: string;
  updatedBy: string;
  role: string;
  remarks?: string;
}

export interface Complaint {
  id: string; // e.g. CMP-1001
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  consumerAddress: string;
  meterNumber: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  subject: string;
  description: string;
  area: string;
  imageAttachmentUrl?: string;
  status: ComplaintStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  rejectionReason?: string;
  resolutionNotes?: string;
  materialsUsed?: string;
  consumerRating?: number;
  consumerFeedback?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface SlabDetail {
  slab: string;
  units: number;
  rate: number;
  amount: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  consumerId: string;
  consumerName: string;
  consumerNumber: string;
  meterNumber: string;
  billingMonth: string; // e.g. "October 2026"
  issueDate: string;
  dueDate: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  slabBreakdown: SlabDetail[];
  energyCharges: number;
  fuelPriceAdjustment: number;
  electricityDuty: number;
  tvFee: number;
  gst: number;
  totalCurrentBill: number;
  lateFeeSurcharge: number;
  payableAfterDueDate: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  billId: string;
  billNumber: string;
  consumerId: string;
  consumerName: string;
  amount: number;
  paymentMethod: 'JazzCash' | 'Easypaisa' | 'Debit/Credit Card' | 'Bank Transfer';
  paymentDate: string;
  accountReference: string;
  status: 'Successful';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  phone: string;
  cnic: string;
  address: string;
  city: string;
  meterNumber?: string;
  consumerNumber?: string;
  tariffCategory?: string; // e.g. "A-1 Residential"
  connectionDate?: string;
  active: boolean;
  avatar?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  specialization: string;
  activeJobsCount: number;
  completedJobsCount: number;
  active: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string; // user id or 'admin' or 'technician'
  title: string;
  message: string;
  type: 'bill' | 'complaint' | 'payment' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}
