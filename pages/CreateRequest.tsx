import React, { useState } from 'react';
import { useAppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { projects } from '../mockData';
import { Save, Upload } from 'lucide-react';
import { BudgetRequest } from '../types';

export default function CreateRequest() {
  const { currentUser, setRequests, addNotification, requests } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    amount: '',
    description: ''
  });

  const generateRequestId = () => {
    // Logic to generate REQ-000X sequentially
    const maxId = requests.reduce((max, req) => {
      // Extract number from REQ-XXXX or REQ-2023-XXXX if possible
      // Let's assume the new format is simple REQ-0001
      const parts = req.id.split('-');
      const num = parseInt(parts[parts.length - 1]);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    const nextNum = maxId + 1;
    return `REQ-${String(nextNum).padStart(4, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newId = generateRequestId();

    const newRequest: BudgetRequest = {
      id: newId,
      title: formData.title,
      projectId: formData.projectId,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      departmentId: currentUser.departmentId,
      amount: parseFloat(formData.amount),
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: formData.description,
      documents: ['เอกสารแนบ.pdf'], // Mock
      history: [{
        status: 'PROPOSED',
        date: new Date().toISOString(),
        actorName: currentUser.name,
        action: 'สร้างคำขอใหม่'
      }]
    };

    setRequests(prev => [newRequest, ...prev]);
    
    // Simulate notification to Admin
    addNotification('U001', `มีคำขอใหม่: ${newRequest.title} (${newRequest.id}) จาก ${currentUser.name}`, 'INFO');

    navigate('/requests');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">สร้างคำขออนุมัติใช้งบประมาณ</h1>
        <p className="text-slate-500 text-sm">ระบบจะสร้างเลขที่เอกสารอัตโนมัติเมื่อบันทึก</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">โครงการ</label>
            <select 
              required
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.projectId}
              onChange={e => setFormData({...formData, projectId: e.target.value})}
            >
              <option value="">-- เลือกโครงการ --</option>
              {projects
                .filter(p => currentUser?.role === 'ADMIN' || p.ownerDepartmentId === currentUser?.departmentId)
                .map(p => (
                <option key={p.id} value={p.id}>{p.name} (งบ {p.budget.toLocaleString()})</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">จำนวนเงิน (บาท)</label>
             <input 
               type="number"
               required
               min="1"
               className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
               value={formData.amount}
               onChange={e => setFormData({...formData, amount: e.target.value})}
               placeholder="0.00"
             />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">หัวข้อเรื่อง</label>
            <input 
              type="text"
              required
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="เช่น ขอจัดซื้อวัสดุอุปกรณ์สำหรับการจัดกิจกรรม..."
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">รายละเอียด/เหตุผลความจำเป็น</label>
            <textarea 
              rows={4}
              required
              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center bg-slate-50">
           <Upload className="mx-auto text-slate-400 mb-2" size={32} />
           <p className="text-sm text-slate-600 font-medium">อัปโหลดเอกสารประกอบ</p>
           <p className="text-xs text-slate-400 mt-1">ใบเสนอราคา, โครงการที่อนุมัติแล้ว, ฯลฯ</p>
           <button type="button" className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 text-slate-700">
             เลือกไฟล์
           </button>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/requests')}
            className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium shadow-md transition-colors flex items-center space-x-2"
          >
            <Save size={18} />
            <span>บันทึกและส่งคำขอ</span>
          </button>
        </div>
      </form>
    </div>
  );
}