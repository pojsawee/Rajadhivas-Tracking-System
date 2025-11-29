import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Bell, 
  Menu,
  ShieldAlert,
  Settings,
  Users,
  List
} from 'lucide-react';
import { THEME } from '../constants';

export default function Layout({ children }: React.PropsWithChildren) {
  const { currentUser, setCurrentUser, notifications, markNotificationRead } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showNotif, setShowNotif] = React.useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  // Filter notifications for current user
  const myNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const NavItem = ({ to, icon: Icon, label, subItem = false }: { to: string; icon: any; label: string; subItem?: boolean }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center space-x-3 ${subItem ? 'pl-11 pr-4 py-2 text-sm' : 'px-4 py-3'} rounded-lg transition-colors mb-1 ${
          isActive 
            ? 'bg-pink-600 text-white shadow-lg' 
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <Icon size={subItem ? 18 : 20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 ${THEME.sidebar} text-white transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-slate-700 bg-blue-950">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="text-pink-500" size={28} />
            <h1 className="text-xl font-bold tracking-wide">
              Rajadhivas <span className="text-pink-500">Track</span>
            </h1>
          </div>
        </div>

        <nav className="p-4 mt-4 overflow-y-auto max-h-[calc(100vh-9rem)]">
          <div className="mb-1">
             <NavItem to="/" icon={LayoutDashboard} label="ภาพรวม (Dashboard)" />
          </div>

          <div className="mt-6">
             <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
               การจัดการคำขอ
             </div>
             <NavItem to="/requests" icon={List} label="รายการคำขอทั้งหมด" />
             <NavItem to="/requests/create" icon={PlusCircle} label="สร้างคำขอใหม่" subItem={true} />
          </div>

          {currentUser?.role === 'ADMIN' && (
             <div className="mt-6">
               <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                 สำหรับเจ้าหน้าที่
               </div>
               <NavItem to="/users" icon={Users} label="จัดการระบบ/ผู้ใช้" />
             </div>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name} 
              className="w-10 h-10 rounded-full border-2 border-pink-500"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.role === 'ADMIN' ? 'เจ้าหน้าที่พัสดุ/การเงิน' : 'ผู้ใช้งานหน่วยงาน'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 px-4">
            <h2 className="text-lg font-semibold text-slate-800 hidden md:block">
              ระบบติดตามการจัดทำเอกสารตั้งเบิก
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
                onClick={() => setShowNotif(!showNotif)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-3 border-b bg-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-slate-700">การแจ้งเตือน</h3>
                    {unreadCount > 0 && (
                      <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full">{unreadCount} ใหม่</span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {myNotifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-400">ไม่มีการแจ้งเตือน</div>
                    ) : (
                      myNotifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-3 border-b hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                          onClick={() => {
                             markNotificationRead(n.id);
                             setShowNotif(false);
                          }}
                        >
                          <p className={`text-sm ${!n.read ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                            {n.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(n.date).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}