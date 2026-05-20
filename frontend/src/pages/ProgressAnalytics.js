import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FireIcon, CalendarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProgressAnalytics = () => {
  const [weightData, setWeightData] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadWeightData();
    loadWorkoutData();
    loadCalorieData();
  }, []);

  const loadWeightData = () => {
    const saved = localStorage.getItem('fitlife_weight_history');
    if (saved) {
      setWeightData(JSON.parse(saved));
    } else {
      const demo = [
        { date: 'Week 1', weight: 82, bmi: 26.5 },
        { date: 'Week 2', weight: 81.5, bmi: 26.3 },
        { date: 'Week 3', weight: 81, bmi: 26.1 },
        { date: 'Week 4', weight: 80.5, bmi: 26.0 },
        { date: 'Week 5', weight: 80, bmi: 25.8 },
        { date: 'Week 6', weight: 79.5, bmi: 25.6 },
        { date: 'Week 7', weight: 79, bmi: 25.5 },
        { date: 'Week 8', weight: 78.5, bmi: 25.3 },
      ];
      setWeightData(demo);
      localStorage.setItem('fitlife_weight_history', JSON.stringify(demo));
    }
  };

  const loadWorkoutData = () => {
    const saved = localStorage.getItem('fitlife_workout_stats');
    if (saved) {
      setWorkoutData(JSON.parse(saved));
    } else {
      const demo = [
        { day: 'Mon', workouts: 1, calories: 350, duration: 45 },
        { day: 'Tue', workouts: 1, calories: 280, duration: 30 },
        { day: 'Wed', workouts: 1, calories: 400, duration: 50 },
        { day: 'Thu', workouts: 0, calories: 0, duration: 0 },
        { day: 'Fri', workouts: 1, calories: 320, duration: 40 },
        { day: 'Sat', workouts: 1, calories: 450, duration: 55 },
        { day: 'Sun', workouts: 0, calories: 0, duration: 0 },
      ];
      setWorkoutData(demo);
      localStorage.setItem('fitlife_workout_stats', JSON.stringify(demo));
    }
  };

  const loadCalorieData = () => {
    const saved = localStorage.getItem('fitlife_calorie_stats');
    if (saved) {
      setCalorieData(JSON.parse(saved));
    } else {
      const demo = [
        { date: 'Mon', consumed: 1850, burned: 450, net: 1400 },
        { date: 'Tue', consumed: 1900, burned: 380, net: 1520 },
        { date: 'Wed', consumed: 1750, burned: 520, net: 1230 },
        { date: 'Thu', consumed: 2000, burned: 410, net: 1590 },
        { date: 'Fri', consumed: 1950, burned: 490, net: 1460 },
        { date: 'Sat', consumed: 2100, burned: 350, net: 1750 },
        { date: 'Sun', consumed: 1800, burned: 300, net: 1500 },
      ];
      setCalorieData(demo);
      localStorage.setItem('fitlife_calorie_stats', JSON.stringify(demo));
    }
  };

  const totalWorkouts = workoutData.reduce((sum, d) => sum + d.workouts, 0);
  const totalCalories = workoutData.reduce((sum, d) => sum + d.calories, 0);
  const avgWeight = weightData.reduce((sum, d) => sum + d.weight, 0) / weightData.length;
  const weightLoss = weightData[0]?.weight - weightData[weightData.length - 1]?.weight;
  
  const workoutTypes = [
    { name: 'Strength', value: 35, color: '#f97316' },
    { name: 'Cardio', value: 30, color: '#22c55e' },
    { name: 'HIIT', value: 20, color: '#ef4444' },
    { name: 'Yoga', value: 15, color: '#a855f7' },
  ];

  const generateReport = () => {
    const report = {
      totalWorkouts,
      totalCalories,
      weightLoss,
      avgWeight,
      period: selectedPeriod,
      generatedAt: new Date().toISOString()
    };
    localStorage.setItem('fitlife_last_report', JSON.stringify(report));
    toast.success('Report generated!');
    
    // Create and download CSV
    const csv = [
      ['Metric', 'Value'],
      ['Total Workouts', totalWorkouts],
      ['Total Calories Burned', totalCalories],
      ['Weight Loss', `${weightLoss.toFixed(1)} kg`],
      ['Average Weight', `${avgWeight.toFixed(1)} kg`],
      ['Report Date', new Date().toLocaleDateString()]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitness-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Progress Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your fitness journey with detailed analytics</p>
        </div>
        <button onClick={generateReport} className="btn-primary flex items-center gap-2">
          📊 Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <div className="text-3xl mb-2">💪</div>
          <p className="text-2xl font-bold">{totalWorkouts}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Workouts</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalCalories}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Calories Burned</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <div className="text-3xl mb-2">⚖️</div>
          <p className="text-2xl font-bold">{Math.abs(weightLoss).toFixed(1)} kg</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{weightLoss > 0 ? 'Weight Lost' : 'Weight Gained'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <CalendarIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{Math.floor(totalWorkouts / 4)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Workouts/Week</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="weight" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Workout Consistency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="workouts" fill="#f97316" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;