import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeft, FileText, Clock, User, CheckCircle, XCircle, ChevronRight, AlertTriangle, Save, RefreshCw, DollarSign, Send, Edit2 } from 'lucide-react';
import { RequestStatus, ReturnNote } from '../types';
import { returnReasons } from '../mockData';

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests, setRequests, currentUser, addNotification } = useAppContext();
  
  const [showReturnModal, setShowReturnModal] = useState(false);
  
  // Return Modal State
  const [selectedReturnReasons, setSelectedReturnReasons] = useState<string[]>([]);
  const [returnComment, setReturnComment] = useState('');

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    amount: 0,
    description: ''
  });

  // Admin ID Edit State
  const [isEditingId, setIsEditingId] = useState(false);
  const [newId, setNewId] = useState('');

  const request = requests.find(r => r.id === id);

  // Initialize form data when request is loaded
  useEffect(() => {
    if (request) {
        setEditFormData({
            amount: request.amount,
            description: request.description
        });
        setNewId(request.id);
    }
  }, [request]);

  if (!request) return <div className="p-8 text-center">ไม่พบข้อมูลคำขอ</div>;

  const isAdmin = currentUser?.role === 'ADMIN';
  const isOwner = currentUser?.id === request.requesterId;
  
  // Check if the request has passed the budget approval stage (meaning it's in the disbursement phase)
  const hasPassedBudgetApproval = request.history.some(h => h.status === 'BUDGET_APPROVED');

  // --- Actions ---

  const handleUpdateId = () => {
    if (newId !== request.id) {
        setRequests(prev => prev.map(r => r.id === request.id ? { ...r, id: newId } : r));
        addNotification(currentUser?.id || '', `เปลี่ยนเลขที่เอกสารจาก ${request.id} เป็น ${newId}`, 'SUCCESS');
        navigate(`/requests/${newId}`, { replace: true });
    }
    setIsEditingId(false);
  };

  const handleUpdateStatus = (newStatus: RequestStatus) => {
    if (!currentUser) return;
    
    // Update Request
    const updatedReq = {
        ...request,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        history: [
            ...request.history,
            {
                status: newStatus,
                date: new Date().toISOString(),
                actorName: currentUser.name,
                action: `เปลี่ยนสถานะเป็น: ${newStatus}`
            }
        ]
    };

    setRequests(prev => prev.map(r => r.id === r.id && r.id === id ? updatedReq : r));
    
    // Notify Logic (Dependent on who performs the action)
    if (currentUser.role === 'ADMIN') {
        // Admin performs action -> Notify Requester
        addNotification(
            request.requesterId, 
            `คำขอ ${request.id} เปลี่ยนสถานะเป็น ${newStatus}`, 
            'SUCCESS'
        );
    } else {
        // User performs action -> Notify Admin (Mock sending to U001 or general Admin pool)
        addNotification(
            'U001', 
            `คำขอ ${request.id} มีการอัปเดตสถานะเป็น ${newStatus} โดย ${currentUser.name}`, 
            'INFO'
        );
    }
  };

  const handleReturn = () => {
    if (!currentUser) return;

    const returnNote: ReturnNote = {
        id: `RN-${Date.now()}`,
        requestId: request.id,
        adminName: currentUser.name,
        date: new Date().toISOString(),
        reasons: selectedReturnReasons,
        comment: returnComment
    };

    const updatedReq = {
        ...request,
        status: 'RETURNED' as RequestStatus,
        updatedAt: new Date().toISOString(),
        returnNote,
        history: [
            ...request.history,
            {
                status: 'RETURNED' as RequestStatus,
                date: new Date().toISOString(),
                actorName: currentUser.name,
                action: 'ส่งคืนแก้ไข'
            }
        ]
    };

    setRequests(prev => prev.map(r => r.id === id ? updatedReq : r));
    
    // Notify User
    addNotification(
        request.requesterId, 
        `คำขอ ${request.id} ถูกส่งคืนแก้ไข. กรุณาตรวจสอบเหตุผล.`, 
        'WARNING'
    );
    
    setShowReturnModal(false);
  };

  const handleResubmit = () => {
      if (!currentUser) return;

      // Determine next status based on phase
      // If it was already approved for budget (Disbursement phase), resubmit to REQ_DISBURSEMENT
      // If it was still in proposal phase, resubmit to PROPOSED
      const nextStatus: RequestStatus = hasPassedBudgetApproval ? 'REQ_DISBURSEMENT' : 'PROPOSED';
      const actionText = hasPassedBudgetApproval ? 'แก้ไขและขอเบิกจ่ายใหม่' : 'แก้ไขและส่งเรื่องใหม่';

      const updatedReq = {
          ...request,
          amount: editFormData.amount,
          description: editFormData.description,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
          history: [
              ...request.history,
              {
                  status: nextStatus,
                  date: new Date().toISOString(),
                  actorName: currentUser.name,
                  action: actionText
              }
          ]
      };

      setRequests(prev => prev.map(r => r.id === id ? updatedReq : r));
      
      // Notify Admin
      addNotification(
          'U001', 
          `คำขอ ${request.id} ถูกแก้ไขและส่งสถานะเป็น ${nextStatus} โดย ${currentUser.name}`, 
          'INFO'
      );

      setIsEditing(false);
  };

  const toggleReason = (reason: string) => {
      if (selectedReturnReasons.includes(reason)) {
          setSelectedReturnReasons(prev => prev.filter(r => r !== reason));
      } else {
          setSelectedReturnReasons(prev => [...prev, reason]);
      }
  };

  // --- UI Helpers ---

  const ActionButtons = () => {
    
    // 1. Handling Returned State (Priority)
    if (request.status === 'RETURNED') {
        // If currently editing
        if (isEditing) {
            return (
                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setIsEditing(false);
                            setEditFormData({ amount: request.amount, description: request.description }); // Reset
                        }}
                        className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button 
                        onClick={handleResubmit}
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 shadow-md flex items-center gap-2 transition-colors"
                    >
                        <Save size={18} />
                        {hasPassedBudgetApproval ? 'บันทึกและขอเบิกจ่าย' : 'บันทึกและส่งใหม่'}
                    </button>
                </div>
            );
        }

        // Logic for "Request Disbursement After Correction"
        // Available to Owner AND Admin if it's in disbursement phase
        if (hasPassedBudgetApproval) {
            if (isOwner || isAdmin) {
                return (
                    <div className="flex gap-3">
                        {/* Allow Edit before resubmit */}
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 shadow-md flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw size={18} />
                            แก้ไขข้อมูล
                        </button>
                        
                        {/* Direct Resubmit to Disbursement */}
                        <button 
                            onClick={() => handleUpdateStatus('REQ_DISBURSEMENT')}
                            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 shadow-md flex items-center gap-2 transition-colors"
                        >
                            <DollarSign size={18} />
                            ขอเบิกจ่ายหลังแก้ไข
                        </button>
                    </div>
                );
            }
        } else {
            // Proposal Phase Return - Only Owner usually fixes this
            if (isOwner) {
                return (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 shadow-md flex items-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                        แก้ไขเอกสารตามคำแนะนำ
                    </button>
                );
            }
        }
    }

    // 2. Admin Actions (Normal Flow)
    if (isAdmin) {
      return (
        <div className="flex flex-wrap gap-3">
          {/* Proposal Phase */}
          {request.status === 'PROPOSED' && (
              <>
                  <button 
                      onClick={() => handleUpdateStatus('BUDGET_APPROVED')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                      <CheckCircle size={18} />
                      <span>อนุมัติงบประมาณ</span>
                  </button>
                  <button 
                      onClick={() => setShowReturnModal(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                      <XCircle size={18} />
                      <span>ส่งคืนแก้ไข</span>
                  </button>
              </>
          )}
          
          {request.status === 'BUDGET_APPROVED' && (
              <button 
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                  เริ่มดำเนินกิจกรรม
              </button>
          )}

          {/* Disbursement Phase Actions for Admin */}
          {request.status === 'IN_PROGRESS' && (
              <button 
                  onClick={() => handleUpdateStatus('REQ_DISBURSEMENT')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              >
                  ขอเบิกจ่าย (แทนผู้ใช้)
              </button>
          )}

          {/* Review & Approve Disbursement */}
          {(request.status === 'REQ_DISBURSEMENT' || request.status === 'EXEC_REVIEW') && (
              <>
                {request.status === 'REQ_DISBURSEMENT' && (
                     <button 
                        onClick={() => handleUpdateStatus('EXEC_REVIEW')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                        เสนอผู้บริหาร
                    </button>
                )}

                {request.status === 'EXEC_REVIEW' && (
                     <button 
                        onClick={() => handleUpdateStatus('DISBURSE_APPROVED')}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                    >
                        อนุมัติจ่าย
                    </button>
                )}

                {/* Return Button is available during Disbursement Review */}
                <button 
                    onClick={() => setShowReturnModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <XCircle size={18} />
                    <span>ส่งคืนแก้ไข</span>
                </button>
              </>
          )}
           
          {request.status === 'DISBURSE_APPROVED' && (
             <>
                <button 
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg"
                >
                    จ่ายเงินเสร็จสิ้น/โอนเงินแล้ว
                </button>
                 {/* Can still return if mistake found before final payment */}
                <button 
                    onClick={() => setShowReturnModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                    <XCircle size={18} />
                    <span>ส่งคืนแก้ไข</span>
                </button>
             </>
          )}
        </div>
      );
    }

    // 3. User (Owner) Actions (Normal Flow)
    if (isOwner && !isAdmin) {
         if (request.status === 'IN_PROGRESS') {
            return (
                <button 
                    onClick={() => handleUpdateStatus('REQ_DISBURSEMENT')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
                >
                    <DollarSign size={18} />
                    ขอเบิกจ่าย
                </button>
            );
        }
    }

    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
             {isAdmin && isEditingId ? (
                 <div className="flex items-center gap-2">
                     <input 
                        className="border border-slate-300 rounded px-2 py-1 text-xl font-bold"
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                     />
                     <button onClick={handleUpdateId} className="p-1 bg-green-100 text-green-700 rounded"><CheckCircle size={18} /></button>
                     <button onClick={() => setIsEditingId(false)} className="p-1 bg-red-100 text-red-700 rounded"><XCircle size={18} /></button>
                 </div>
             ) : (
                 <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {request.id}
                    {isAdmin && (
                        <button onClick={() => setIsEditingId(true)} className="text-slate-400 hover:text-blue-500">
                            <Edit2 size={16} />
                        </button>
                    )}
                 </h1>
             )}
             <StatusBadge status={request.status} />
          </div>
          <p className="text-slate-500 text-sm">สร้างเมื่อ {new Date(request.createdAt).toLocaleDateString('th-TH')}</p>
        </div>
      </div>

      {/* Return Alert */}
      {request.status === 'RETURNED' && request.returnNote && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-red-800 font-bold flex items-center gap-2 mb-3">
                  <AlertTriangle size={20} />
                  เอกสารถูกส่งคืนแก้ไข
              </h3>
              <div className="bg-white p-4 rounded-lg border border-red-100">
                  <p className="text-sm font-semibold text-slate-700 mb-2">เหตุผลการส่งคืน:</p>
                  <ul className="list-disc list-inside text-sm text-slate-600 mb-3 space-y-1">
                      {request.returnNote.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                  {request.returnNote.comment && (
                      <div>
                          <p className="text-sm font-semibold text-slate-700">หมายเหตุเพิ่มเติม:</p>
                          <p className="text-sm text-slate-600 italic">"{request.returnNote.comment}"</p>
                      </div>
                  )}
                  <div className="mt-3 text-xs text-slate-400">
                      ตรวจสอบโดย: {request.returnNote.adminName} เมื่อ {new Date(request.returnNote.date).toLocaleDateString('th-TH')}
                  </div>
              </div>
          </div>
      )}

      {/* Editing Mode Alert */}
      {isEditing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center text-yellow-800">
              <RefreshCw className="mr-2 animate-spin-slow" size={20} />
              <span className="font-medium">คุณกำลังอยู่ในโหมดแก้ไขข้อมูล กรุณาปรับปรุงข้อมูลแล้วกด "{hasPassedBudgetApproval ? 'บันทึกและขอเบิกจ่าย' : 'บันทึกและส่งใหม่'}" ด้านล่าง</span>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`bg-white rounded-xl shadow-sm border p-6 ${isEditing ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-slate-100'}`}>
             <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b flex justify-between items-center">
                 รายละเอียดคำขอ
                 {isEditing && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">กำลังแก้ไข</span>}
             </h2>
             <div className="space-y-4">
               <div>
                 <label className="text-xs font-semibold text-slate-400 uppercase">โครงการ</label>
                 <p className="text-slate-800 font-medium">{request.title}</p>
                 <p className="text-sm text-slate-500">{request.projectId}</p>
               </div>
               <div>
                 <label className="text-xs font-semibold text-slate-400 uppercase">จำนวนเงิน</label>
                 {isEditing ? (
                     <input 
                        type="number" 
                        value={editFormData.amount}
                        onChange={(e) => setEditFormData({...editFormData, amount: parseFloat(e.target.value)})}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-lg text-slate-800"
                     />
                 ) : (
                    <p className="text-2xl font-bold text-pink-600">฿{request.amount.toLocaleString()}</p>
                 )}
               </div>
               <div>
                 <label className="text-xs font-semibold text-slate-400 uppercase">รายละเอียด</label>
                 {isEditing ? (
                     <textarea 
                        rows={5}
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-slate-700 leading-relaxed"
                     />
                 ) : (
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{request.description}</p>
                 )}
               </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">เอกสารแนบ</h2>
             <div className="space-y-2">
                {request.documents.length === 0 ? (
                    <p className="text-slate-400 text-sm">ไม่มีเอกสารแนบ</p>
                ) : (
                    request.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
                             <FileText className="text-blue-500 mr-3" size={20} />
                             <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{doc}</span>
                             {isEditing && (
                                 <button className="ml-auto text-red-400 hover:text-red-600 text-xs">ลบ</button>
                             )}
                        </div>
                    ))
                )}
                {/* Upload for edit */}
                {(request.status === 'DRAFT' || request.status === 'RETURNED' || isAdmin) && (
                    <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm hover:border-blue-400 hover:text-blue-500 transition-colors flex justify-center items-center gap-2">
                        <span>+ เพิ่มเอกสารแนบ {isEditing ? '(โหมดแก้ไข)' : ''}</span>
                    </button>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">ผู้ขออนุมัติ</h3>
              <div className="flex items-center space-x-3">
                 <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <User size={24} />
                 </div>
                 <div>
                    <p className="font-medium text-slate-800">{request.requesterName}</p>
                    <p className="text-xs text-slate-500">ID: {request.requesterId}</p>
                    <p className="text-xs text-slate-500">{request.departmentId}</p>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">ประวัติการดำเนินการ</h3>
              <div className="space-y-6 relative border-l-2 border-slate-100 ml-3 pl-6 py-2">
                {request.history.map((h, i) => (
                    <div key={i} className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <p className="text-sm font-semibold text-slate-800">{h.status}</p>
                        <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit'})}</p>
                        <p className="text-xs text-slate-600 mt-1">โดย: {h.actorName}</p>
                        <p className="text-xs text-slate-500 italic">"{h.action}"</p>
                    </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-slate-200 p-4 shadow-lg flex justify-end items-center z-10">
         <ActionButtons />
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
                <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                    <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <AlertTriangle size={20} /> ส่งคืนแก้ไขเอกสาร
                    </h3>
                    <button onClick={() => setShowReturnModal(false)} className="text-red-400 hover:text-red-600">
                        <XCircle size={24} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4">กรุณาระบุเหตุผลในการส่งคืน เพื่อแจ้งให้ผู้ขอทราบ</p>
                    
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {returnReasons.map((reason) => (
                            <label key={reason} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                                    checked={selectedReturnReasons.includes(reason)}
                                    onChange={() => toggleReason(reason)}
                                />
                                <span className="text-sm text-slate-700">{reason}</span>
                            </label>
                        ))}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">รายละเอียดเพิ่มเติม (อื่นๆ)</label>
                        <textarea 
                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            rows={3}
                            placeholder="ระบุข้อความ..."
                            value={returnComment}
                            onChange={(e) => setReturnComment(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={() => setShowReturnModal(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            ยกเลิก
                        </button>
                        <button 
                            onClick={handleReturn}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                            ยืนยันส่งคืน
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}