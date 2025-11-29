import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, Filter } from 'lucide-react';
import { RequestStatus } from '../types';

export default function RequestList() {
  const { requests, currentUser } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter Logic
  // Admins see all requests. Users see only their own department's requests (or just their own).
  const visibleRequests = requests.filter(req => {
    // Role Check
    if (currentUser?.role === 'USER_DEPARTMENT' && req.requesterId !== currentUser.id) {
      return false; 
    }
    
    // Status Filter
    if (filterStatus !== 'ALL' && req.status !== filterStatus) return false;

    // Search
    const searchLower = searchTerm.toLowerCase();
    return (
      req.title.toLowerCase().includes(searchLower) ||
      req.requesterName.toLowerCase().includes(searchLower) ||
      req.id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">รายการคำขอใช้งบประมาณ</h1>
          <p className="text-slate-500 text-sm">จัดการและติดตามสถานะเอกสาร</p>
        </div>
        
        <Link 
          to="/requests/create" 
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>สร้างคำขอใหม่</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาตามเลขที่, ชื่อโครงการ, ผู้ขอ..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-slate-400" size={18} />
            <select 
              className="border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value="PROPOSED">เสนอขออนุมัติ</option>
              <option value="RETURNED">ส่งคืนแก้ไข</option>
              <option value="BUDGET_APPROVED">อนุมัติงบประมาณ</option>
              <option value="IN_PROGRESS">ดำเนินกิจกรรม</option>
              <option value="REQ_DISBURSEMENT">ขอเบิกจ่าย</option>
              <option value="COMPLETED">จ่ายเงินเสร็จสิ้น</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">เลขที่เอกสาร</th>
                <th className="px-6 py-4">หัวข้อโครงการ</th>
                <th className="px-6 py-4">ผู้ขออนุมัติ</th>
                <th className="px-6 py-4 text-right">จำนวนเงิน</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
                <th className="px-6 py-4">วันที่</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    ไม่พบรายการคำขอ
                  </td>
                </tr>
              ) : (
                visibleRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600">{req.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{req.title}</p>
                      <p className="text-xs text-slate-400">{req.projectId}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                            {req.requesterName.charAt(0)}
                        </div>
                        <span>{req.requesterName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      ฿{req.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(req.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        to={`/requests/${req.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        รายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
