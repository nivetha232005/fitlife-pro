import React, { useState } from 'react';

const Notifications = () => {
  const [settings, setSettings] = useState({
    workoutReminders: true,
    waterReminders: true,
    goalAchievements: true,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Workout Reminders</label>
            <input 
              type="checkbox" 
              checked={settings.workoutReminders}
              onChange={(e) => setSettings({...settings, workoutReminders: e.target.checked})}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Water Reminders</label>
            <input 
              type="checkbox" 
              checked={settings.waterReminders}
              onChange={(e) => setSettings({...settings, waterReminders: e.target.checked})}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 dark:text-gray-300">Goal Achievements</label>
            <input 
              type="checkbox" 
              checked={settings.goalAchievements}
              onChange={(e) => setSettings({...settings, goalAchievements: e.target.checked})}
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;