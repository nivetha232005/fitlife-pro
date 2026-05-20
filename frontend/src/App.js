import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutTracker from './pages/WorkoutTracker';
import NutritionTracker from './pages/NutritionTracker';
import ProgressAnalytics from './pages/ProgressAnalytics';
import Goals from './pages/Goals';
import Community from './pages/Community';
import Notifications from './pages/Notifications';
import WearableSync from './pages/WearableSync';
import AdminPanel from './pages/AdminPanel';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workouts" element={<WorkoutTracker />} />
                <Route path="/nutrition" element={<NutritionTracker />} />
                <Route path="/progress" element={<ProgressAnalytics />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/community" element={<Community />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/wearable" element={<WearableSync />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/profile" element={<ProfileSettings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
