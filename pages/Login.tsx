import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { ShieldAlert, Lock, User as UserIcon, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function Login() {
  const { setCurrentUser, users } = useAppContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check against users in Context (includes newly added users)
    const user = users.find(u => u.email === email);
    
    // Check against user password (if set) or fallback to '1234'
    const validPassword = user?.password || '1234';

    if (user && password === validPassword) {
      setCurrentUser(user);
      navigate('/');
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง (รหัสผ่านเริ่มต้น: 1234)');
    }
  };

  const autoFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('1234');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 text-pink-600">
               <ShieldAlert size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบ</h1>
            <p className="text-slate-500 text-sm mt-1">Rajadhivas Track</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">อีเมลผู้ใช้งาน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  placeholder="name@rajadhivas.ac.th"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center">
                <ShieldAlert size={16} className="mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg mt-2"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; 2024 Rajadhivas School. All rights reserved.
          </div>
        </div>

        {/* Right Side: Mock Data Info */}
        <div className="w-full md:w-1/2 bg-slate-50 border-l border-slate-200 p-8 overflow-y-auto max-h-[600px]">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded mr-2">DEMO</span>
            บัญชีผู้ใช้ทดสอบ (Mock Users)
          </h3>
          <p className="text-xs text-slate-500 mb-4">คลิกที่บัญชีเพื่อกรอกข้อมูลอัตโนมัติ (Password: 1234)</p>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">เจ้าหน้าที่ (Admin)</h4>
              <div className="grid gap-2">
                {users.filter(u => u.role === 'ADMIN').map(user => (
                  <button
                    key={user.id}
                    onClick={() => autoFill(user.email)}
                    className="flex items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-pink-500 hover:shadow-sm transition-all text-left w-full group"
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3 border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate group-hover:text-pink-700">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <CheckCircle className="text-slate-200 group-hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">ผู้ใช้ตามหน่วยงาน (User)</h4>
              <div className="grid gap-2">
                {users.filter(u => u.role === 'USER_DEPARTMENT').slice(0, 4).map(user => (
                  <button
                    key={user.id}
                    onClick={() => autoFill(user.email)}
                    className="flex items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all text-left w-full group"
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-3 border border-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.departmentId}</p>
                    </div>
                     <CheckCircle className="text-slate-200 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}