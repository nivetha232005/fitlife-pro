import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, BoltIcon, MoonIcon, FireIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const WearableSync = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [syncData, setSyncData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const devices = [
    { id: 'fitbit', name: 'Fitbit', icon: '⌚', color: 'from-green-500 to-teal-500', connected: true },
    { id: 'apple', name: 'Apple Health', icon: '🍎', color: 'from-gray-600 to-gray-800', connected: false },
    { id: 'google', name: 'Google Fit', icon: '🔵', color: 'from-blue-500 to-indigo-500', connected: false },
    { id: 'garmin', name: 'Garmin', icon: '🏃', color: 'from-red-500 to-orange-500', connected: false },
  ];

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        steps: Math.floor(Math.random() * 5000) + 5000,
        heartRate: Math.floor(Math.random() * 40) + 60,
        sleep: (Math.random() * 4 + 5).toFixed(1),
        calories: Math.floor(Math.random() * 500) + 1500
      });
    }
    setHistoryData(data);
  };

  const syncDevice = async (device) => {
    setIsSyncing(true);
    setSelectedDevice(device.id);
    
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        device: device.name,
        steps: Math.floor(Math.random() * 10000) + 2000,
        heartRate: Math.floor(Math.random() * 40) + 60,
        sleep: (Math.random() * 4 + 5).toFixed(1),
        calories: Math.floor(Math.random() * 500) + 1500,
        activeMinutes: Math.floor(Math.random() * 60) + 20,
        distance: (Math.random() * 8 + 2).toFixed(1),
        syncedAt: new Date().toLocaleString()
      };
      
      setSyncData(mockData);
      setIsSyncing(false);
      toast.success(`Successfully synced with ${device.name}!`);
      
      // Update connection status
      const updatedDevices = devices.map(d => 
        d.id === device.id ? { ...d, connected: true } : d
      );
      Object.assign(devices, updatedDevices);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Wearable Sync</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Connect and sync your fitness devices</p>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {devices.map(device => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 text-center"
          >
            <div className={`text-5xl mb-4 bg-gradient-to-r ${device.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto`}>
              {device.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{device.name}</h3>
            <p className={`text-sm mb-4 ${device.connected ? 'text-green-500' : 'text-gray-500'}`}>
              {device.connected ? '● Connected' : '○ Not Connected'}
            </p>
            <button
              onClick={() => syncDevice(device)}
              disabled={isSyncing && selectedDevice === device.id}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSyncing && selectedDevice === device.id ? 'Syncing...' : 'Sync Now'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Synced Data Display */}
      {syncData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-6 h-6" />
            Latest Sync from {syncData.device}
          </h2>
          <p className="text-sm text-gray-500 mb-4">Synced at: {syncData.syncedAt}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <BoltIcon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{syncData.steps.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Steps</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <HeartIcon className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{syncData.heartRate}</p>
              <p className="text-xs text-gray-500">Heart Rate (bpm)</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <MoonIcon className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{syncData.sleep}</p>
              <p className="text-xs text-gray-500">Sleep (hours)</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FireIcon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{syncData.calories}</p>
              <p className="text-xs text-gray-500">Calories</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">🏃</div>
              <p className="text-2xl font-bold">{syncData.distance}</p>
              <p className="text-xs text-gray-500">Distance (km)</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Historical Data Chart */}
      {historyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold mb-4">7-Day Activity History</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#0ea5e9" strokeWidth={2} name="Steps" />
              <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Tips Section */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <h3 className="text-lg font-semibold mb-3">💡 Tips for Better Sync</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Ensure Bluetooth is enabled on your device</li>
          <li>• Keep your fitness tracker close to your phone during sync</li>
          <li>• Update your wearable device's firmware regularly</li>
          <li>• Check battery levels before syncing</li>
        </ul>
      </div>
    </div>
  );
};

export default WearableSync;