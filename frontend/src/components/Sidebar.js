import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon, ChartBarIcon, FireIcon, CakeIcon, TrophyIcon,
  UsersIcon, BellIcon, DevicePhoneMobileIcon, ShieldCheckIcon, UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/workouts', name: 'Workouts', icon: FireIcon },
    { path: '/nutrition', name: 'Nutrition', icon: CakeIcon },
    { path: '/progress', name: 'Progress', icon: ChartBarIcon },
    { path: '/goals', name: 'Goals', icon: TrophyIcon },
    { path: '/community', name: 'Community', icon: UsersIcon },
    { path: '/notifications', name: 'Notifications', icon: BellIcon },
    { path: '/wearable', name: 'Wearable Sync', icon: DevicePhoneMobileIcon },
    { path: '/profile', name: 'Profile', icon: UserCircleIcon },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', name: 'Admin Panel', icon: ShieldCheckIcon });
  }

  return (
    <motion.aside initial={{ x: -100 }} animate={{ x: 0 }}
      className="w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text">FitLife Pro</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your fitness journey</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="glass-card p-3 text-center">
          <p className="text-sm font-semibold">ðŸ”¥ Streak: 7 days</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Keep going!</p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
