export type Role = 'ADMIN' | 'USER_DEPARTMENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string;
  avatar: string;
  password?: string; // Added password field
}

export interface Department {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  budget: number;
  ownerDepartmentId: string;
}

export type RequestStatus = 
  | 'DRAFT'             // ร่าง
  | 'PROPOSED'          // เสนอขออนุมัติ
  | 'RETURNED'          // ส่งคืนแก้ไข
  | 'BUDGET_APPROVED'   // อนุมัติงบประมาณ
  | 'IN_PROGRESS'       // ดำเนินกิจกรรม
  | 'REQ_DISBURSEMENT'  // ขอเบิกจ่าย
  | 'EXEC_REVIEW'       // เสนอผู้บริหาร
  | 'DISBURSE_APPROVED' // อนุมัติเบิกจ่าย
  | 'COMPLETED';        // จ่ายเงินเสร็จสิ้น/เสร็จสมบูรณ์

export interface ReturnNote {
  id: string;
  requestId: string;
  adminName: string;
  date: string;
  reasons: string[]; // List of checked reasons
  comment: string;   // "Other" detail
}

export interface BudgetRequest {
  id: string;
  title: string;
  projectId: string;
  requesterId: string;
  requesterName: string;
  departmentId: string;
  amount: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  description: string;
  documents: string[]; // filenames
  history: {
    status: RequestStatus;
    date: string;
    actorName: string;
    action: string;
  }[];
  returnNote?: ReturnNote;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
}

export interface AnomalyLog {
  id: string;
  requestId: string;
  type: 'DUPLICATE_RECEIPT' | 'HIGH_COST' | 'SUSPICIOUS_TIMING' | 'FREQUENCY_SPIKE';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  detectedAt: string;
}