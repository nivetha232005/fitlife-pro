import React from 'react';
import { useAuth } from '../context/AuthContext';
const AdminPanel = () => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <div className="text-center py-12"><h1 className="text-3xl font-bold text-red-500">Access Denied</h1></div>;
  return <div className="space-y-6"><h1 className="text-3xl font-bold gradient-text">Admin Panel</h1><div className="glass-card p-6"><p>Admin controls here!</p></div></div>;
};
export default AdminPanel;
