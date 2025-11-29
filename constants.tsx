import { RequestStatus } from './types';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Briefcase, 
  Play, 
  DollarSign, 
  UserCheck, 
  Truck
} from 'lucide-react';
import React from 'react';

export const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  'DRAFT': { label: 'ร่าง', color: 'bg-gray-100 text-gray-800', icon: <FileText size={16} /> },
  'PROPOSED': { label: 'เสนอขออนุมัติ', color: 'bg-blue-100 text-blue-800', icon: <FileText size={16} /> },
  'RETURNED': { label: 'ส่งคืนแก้ไข', color: 'bg-red-100 text-red-800', icon: <XCircle size={16} /> },
  'BUDGET_APPROVED': { label: 'อนุมัติงบประมาณ', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
  'IN_PROGRESS': { label: 'ดำเนินกิจกรรม', color: 'bg-purple-100 text-purple-800', icon: <Play size={16} /> },
  'REQ_DISBURSEMENT': { label: 'ขอเบิกจ่าย', color: 'bg-orange-100 text-orange-800', icon: <DollarSign size={16} /> },
  'EXEC_REVIEW': { label: 'เสนอผู้บริหาร', color: 'bg-indigo-100 text-indigo-800', icon: <UserCheck size={16} /> },
  'DISBURSE_APPROVED': { label: 'อนุมัติเบิกจ่าย', color: 'bg-teal-100 text-teal-800', icon: <CheckCircle size={16} /> },
  'COMPLETED': { label: 'จ่ายเงินเสร็จสิ้น', color: 'bg-slate-800 text-white', icon: <Truck size={16} /> },
};

// Colors based on user request (Blue-Pink)
export const THEME = {
  primary: 'bg-blue-900', // Deep Blue
  secondary: 'bg-pink-600', // Pink
  accent: 'text-pink-600',
  hover: 'hover:bg-blue-800',
  sidebar: 'bg-slate-900',
};
