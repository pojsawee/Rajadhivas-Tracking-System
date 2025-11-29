import React, { useState } from 'react';
import { useAppContext } from '../App';
import { departments } from '../mockData';
import { User, Role } from '../types';
import { Plus, Edit, Trash2, Save, X, Search, Shield, User as UserIcon } from 'lucide-react';

export default function UserManagement() {
  const { users, setUsers, currentUser } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    name: '',
    email: '',
    role: 'USER_DEPARTMENT',
    departmentId: '',
    password: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  if (currentUser?.role !== 'ADMIN') {
    return <div className="text-center text-red-500 p-8">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;
  }

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        password: user.password || '1234'
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        role: 'USER_DEPARTMENT',
        departmentId: departments[0].id,
        password: '1234'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update
      setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...formData } as User : u));
    } else {
      // Create
      const newUser: User = {
        id: `U${Date.now()}`, // Simple ID generation
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random`,
        name: formData.name!,
        email: formData.email!,
        role: formData.role as Role,
        departmentId: formData.departmentId!,
        password: formData.password
      };
      setUsers(prev => [...prev, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการผู้ใช้งานระบบ</h1>
          <p className="text-slate-500 text-sm">เพิ่ม ลด แก้ไข สิทธิ์การใช้งานและรหัสผ่าน</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>เพิ่มผู้ใช้งาน</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
           <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ อีเมล..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">ผู้ใช้งาน</th>
                <th className="px-6 py-4">บทบาท</th>
                <th className="px-6 py-4">สังกัด/แผนก</th>
                <th className="px-6 py-4">รหัสผ่าน</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield size={12} className="mr-1" /> เจ้าหน้าที่ (Admin)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        <UserIcon size={12} className="mr-1" /> ผู้ใช้งาน
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {departments.find(d => d.id === user.departmentId)?.name || user.departmentId}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                    {user.password || '1234'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      {user.id !== currentUser.id && ( // Prevent deleting self
                        <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
             <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
               <h3 className="font-bold">{editingId ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}</h3>
               <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
             </div>
             <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล</label>
                   <input 
                     required
                     className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                   <input 
                     type="email"
                     required
                     className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
                   <input 
                     type="text"
                     required
                     className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={formData.password}
                     onChange={e => setFormData({...formData, password: e.target.value})}
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">บทบาท</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value as Role})}
                        >
                            <option value="USER_DEPARTMENT">ผู้ใช้งานทั่วไป</option>
                            <option value="ADMIN">เจ้าหน้าที่ (Admin)</option>
                        </select>
                   </div>
                   <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">สังกัด</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.departmentId}
                            onChange={e => setFormData({...formData, departmentId: e.target.value})}
                        >
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.id}</option>
                            ))}
                        </select>
                   </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        ยกเลิก
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium flex items-center gap-2"
                    >
                        <Save size={18} /> บันทึก
                    </button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}