import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FireIcon, HeartIcon, TrophyIcon, BoltIcon, ScaleIcon, MoonIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    calories: 1850,
    water: 6,
    streak: 7,
    steps: 8423,
    sleep: 7.5,
    bmi: 22.5
  });
  const [workoutData, setWorkoutData] = useState([]);

  useEffect(() => {
    // Load saved stats from localStorage
    const savedStats = localStorage.getItem('fitlife_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    // Mock workout data
    const data = [
      { day: 'Mon', calories: 450, duration: 45 },
      { day: 'Tue', calories: 380, duration: 35 },
      { day: 'Wed', calories: 520, duration: 55 },
      { day: 'Thu', calories: 410, duration: 40 },
      { day: 'Fri', calories: 490, duration: 50 },
      { day: 'Sat', calories: 350, duration: 30 },
      { day: 'Sun', calories: 300, duration: 25 },
    ];
    setWorkoutData(data);
    
    // Calculate BMI if height and weight are available
    if (user?.profile?.height && user?.profile?.weight) {
      const heightInMeters = user.profile.height / 100;
      const bmi = user.profile.weight / (heightInMeters * heightInMeters);
      setStats(prev => ({ ...prev, bmi: bmi.toFixed(1) }));
    }
  }, [user]);

  const statCards = [
    { title: 'Daily Calories', value: `${stats.calories} kcal`, target: '2,200', icon: FireIcon, color: 'from-orange-500 to-red-500', progress: (stats.calories / 2200) * 100 },
    { title: 'Water Intake', value: `${stats.water} cups`, target: '8 cups', icon: BeakerIcon, color: 'from-blue-500 to-cyan-500', progress: (stats.water / 8) * 100 },
    { title: 'Workout Streak', value: `${stats.streak} days`, target: 'Keep going!', icon: TrophyIcon, color: 'from-yellow-500 to-orange-500', progress: (stats.streak / 30) * 100 },
    { title: 'Steps Today', value: `${stats.steps.toLocaleString()}`, target: '10,000', icon: BoltIcon, color: 'from-green-500 to-emerald-500', progress: (stats.steps / 10000) * 100 },
    { title: 'Sleep', value: `${stats.sleep} hrs`, target: '8 hrs', icon: MoonIcon, color: 'from-purple-500 to-pink-500', progress: (stats.sleep / 8) * 100 },
    { title: 'BMI', value: stats.bmi, target: '18.5-24.9', icon: ScaleIcon, color: 'from-teal-500 to-cyan-500', progress: stats.bmi < 25 ? 80 : 50 },
  ];

  const pieData = [
    { name: 'Protein', value: 30, color: '#f97316' },
    { name: 'Carbs', value: 50, color: '#22c55e' },
    { name: 'Fats', value: 20, color: '#a855f7' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Target: {stat.target}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.title}</p>
            <div className="mt-3">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stat.progress, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Weekly Calories Burned</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="calories" fill="#0ea5e9" radius={[10, 10, 0, 0]}>
                {workoutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${200 + index * 10}, 70%, 50%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Macronutrient Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Today's Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full inline-block mb-2">
              <FireIcon className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-2xl font-bold">{stats.calories}</p>
            <p className="text-sm text-gray-500">Calories Burned</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full inline-block mb-2">
              <HeartIcon className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">72</p>
            <p className="text-sm text-gray-500">Avg Heart Rate</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full inline-block mb-2">
              <BoltIcon className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{stats.steps.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Steps</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full inline-block mb-2">
              <TrophyIcon className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{stats.streak}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;