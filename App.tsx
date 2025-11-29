import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, BudgetRequest, Notification } from './types';
import { users as initialUsers, initialRequests, notifications as initialNotifications } from './mockData';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestList from './pages/RequestList';
import CreateRequest from './pages/CreateRequest';
import RequestDetail from './pages/RequestDetail';
import UserManagement from './pages/UserManagement';
import Layout from './components/Layout';

// Context
interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  requests: BudgetRequest[];
  setRequests: React.Dispatch<React.SetStateAction<BudgetRequest[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  addNotification: (userId: string, message: string, type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<BudgetRequest[]>(initialRequests);
  const [appUsers, setAppUsers] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (userId: string, message: string, type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR') => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      userId,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      requests, 
      setRequests,
      users: appUsers,
      setUsers: setAppUsers,
      notifications,
      markNotificationRead,
      addNotification
    }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><RequestList /></ProtectedRoute>} />
          <Route path="/requests/create" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
          <Route path="/requests/:id" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
}