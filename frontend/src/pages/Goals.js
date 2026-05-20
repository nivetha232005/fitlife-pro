import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, FireIcon, CheckCircleIcon, PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    type: 'weight',
    name: '',
    target: '',
    current: '',
    unit: '',
    deadline: '',
    color: 'blue'
  });

  const goalTypes = [
    { id: 'weight', name: 'Weight Goal', icon: '⚖️', unit: 'kg', placeholder: 'e.g., 75' },
    { id: 'steps', name: 'Daily Steps', icon: '👟', unit: 'steps', placeholder: 'e.g., 10000' },
    { id: 'workouts', name: 'Weekly Workouts', icon: '💪', unit: 'workouts', placeholder: 'e.g., 5' },
    { id: 'water', name: 'Water Intake', icon: '💧', unit: 'cups', placeholder: 'e.g., 8' },
    { id: 'sleep', name: 'Sleep Hours', icon: '😴', unit: 'hours', placeholder: 'e.g., 8' },
    { id: 'calories', name: 'Daily Calories', icon: '🔥', unit: 'kcal', placeholder: 'e.g., 2000' }
  ];

  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    indigo: 'from-indigo-500 to-purple-500'
  };

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('fitlife_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Sample goals
      const sampleGoals = [
        {
          id: 1,
          type: 'weight',
          name: 'Target Weight',
          target: 75,
          current: 82,
          unit: 'kg',
          deadline: '2024-03-01',
          color: 'green',
          progress: 45
        },
        {
          id: 2,
          type: 'steps',
          name: 'Daily Steps',
          target: 10000,
          current: 7500,
          unit: 'steps',
          deadline: '2024-02-01',
          color: 'blue',
          progress: 75
        },
        {
          id: 3,
          type: 'workouts',
          name: 'Weekly Workouts',
          target: 5,
          current: 3,
          unit: 'workouts',
          deadline: '2024-01-28',
          color: 'orange',
          progress: 60
        }
      ];
      setGoals(sampleGoals);
      localStorage.setItem('fitlife_goals', JSON.stringify(sampleGoals));
    }
  }, []);

  // Update progress for a goal
  const updateProgress = (goalId, newCurrent) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const progress = Math.min((newCurrent / goal.target) * 100, 100);
        return { ...goal, current: newCurrent, progress: progress };
      }
      return goal;
    });
    setGoals(updatedGoals);
    localStorage.setItem('fitlife_goals', JSON.stringify(updatedGoals));
    toast.success('Progress updated!');
  };

  // Add new goal
  const addGoal = () => {
    if (!newGoal.name || !newGoal.target || !newGoal.current) {
      toast.error('Please fill all fields');
      return;
    }

    const goalType = goalTypes.find(t => t.id === newGoal.type);
    const progress = (newGoal.current / newGoal.target) * 100;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current),
      unit: goalType.unit,
      progress: Math.min(progress, 100),
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [goal, ...goals];
    setGoals(updatedGoals);
    localStorage.setItem('fitlife_goals', JSON.stringify(updatedGoals));
    
    setShowModal(false);
    setNewGoal({
      type: 'weight',
      name: '',
      target: '',
      current: '',
      unit: '',
      deadline: '',
      color: 'blue'
    });
    toast.success('Goal created successfully!');
  };

  // Edit goal
  const editGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      type: goal.type,
      name: goal.name,
      target: goal.target,
      current: goal.current,
      deadline: goal.deadline,
      color: goal.color
    });
    setShowModal(true);
  };

  // Update goal
  const updateGoal = () => {
    const progress = (newGoal.current / newGoal.target) * 100;
    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal.id 
        ? { ...goal, ...newGoal, target: parseFloat(newGoal.target), current: parseFloat(newGoal.current), progress: Math.min(progress, 100) }
        : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('fitlife_goals', JSON.stringify(updatedGoals));
    setShowModal(false);
    setEditingGoal(null);
    toast.success('Goal updated!');
  };

  // Delete goal
  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('fitlife_goals', JSON.stringify(updatedGoals));
    toast.success('Goal deleted');
  };

  // Calculate overall progress
  const overallProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
    : 0;

  const completedGoals = goals.filter(goal => goal.progress >= 100).length;
  const activeGoals = goals.filter(goal => goal.progress < 100).length;

  // Get motivational message
  const getMotivationalMessage = () => {
    if (overallProgress >= 80) return "Amazing! You're crushing your goals! 🏆";
    if (overallProgress >= 50) return "Great progress! Keep pushing forward! 💪";
    if (overallProgress >= 25) return "Good start! Consistency is key! 🌟";
    return "Every journey begins with a single step. Let's go! 🚀";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Goals & Achievements</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Set, track, and achieve your fitness goals</p>
        </div>
        <button onClick={() => {
          setEditingGoal(null);
          setNewGoal({
            type: 'weight',
            name: '',
            target: '',
            current: '',
            deadline: '',
            color: 'blue'
          });
          setShowModal(true);
        }} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Set New Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{completedGoals}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Goals Achieved</p>
        </div>
        <div className="stat-card">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-2xl font-bold">{activeGoals}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
        </div>
        <div className="stat-card">
          <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
        </div>
        <div className="stat-card">
          <div className="text-3xl mb-2">🏆</div>
          <p className="text-2xl font-bold">{Math.floor(completedGoals * 100)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="glass-card p-6 text-center bg-gradient-to-r from-primary-500/10 to-fitness-orange/10">
        <p className="text-lg font-semibold">{getMotivationalMessage()}</p>
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal, index) => {
          const goalType = goalTypes.find(t => t.id === goal.type);
          const daysLeft = goal.deadline 
            ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
            : null;
          const isCompleted = goal.progress >= 100;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`text-3xl bg-gradient-to-r ${colors[goal.color]} w-12 h-12 rounded-full flex items-center justify-center`}>
                    {goalType?.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{goal.name}</h3>
                    <p className="text-sm text-gray-500">{goalType?.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editGoal(goal)} className="text-gray-500 hover:text-blue-500">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteGoal(goal.id)} className="text-gray-500 hover:text-red-500">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current: {goal.current} {goal.unit}</span>
                  <span className="text-sm font-semibold">Target: {goal.target} {goal.unit}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill bg-gradient-to-r ${colors[goal.color]}`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-2 font-semibold">{Math.round(goal.progress)}% Complete</p>
              </div>

              {!isCompleted && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Update Progress</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={goal.current}
                      onChange={(e) => updateProgress(goal.id, parseFloat(e.target.value))}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                      step={goal.type === 'steps' ? 100 : 1}
                    />
                    <span className="text-sm text-gray-500 self-center">{goal.unit}</span>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 inline-block mr-2" />
                  <span className="font-semibold text-green-700 dark:text-green-400">Goal Achieved! 🎉</span>
                </div>
              )}

              {daysLeft !== null && daysLeft > 0 && !isCompleted && (
                <p className="text-sm text-orange-500 mt-2">
                  ⏰ {daysLeft} days remaining
                </p>
              )}

              {/* Quick tips based on goal type */}
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 Tip: {goal.type === 'weight' && 'Track your weight weekly for best results'}
                  {goal.type === 'steps' && 'Take stairs instead of elevator to increase steps'}
                  {goal.type === 'workouts' && 'Schedule workouts like appointments'}
                  {goal.type === 'water' && 'Keep a water bottle at your desk'}
                  {goal.type === 'sleep' && 'Maintain consistent sleep schedule'}
                  {goal.type === 'calories' && 'Use a food diary to track calories'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Set your first fitness goal to start tracking!</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Add/Edit Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold gradient-text">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Type</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => {
                    const type = goalTypes.find(t => t.id === e.target.value);
                    setNewGoal({...newGoal, type: e.target.value, unit: type.unit});
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  {goalTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="e.g., Lose Weight, Run 5K"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target {newGoal.unit}</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  placeholder={goalTypes.find(t => t.id === newGoal.type)?.placeholder}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current {newGoal.unit}</label>
                <input
                  type="number"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color Theme</label>
                <div className="flex gap-2">
                  {Object.keys(colors).map(color => (
                    <button
                      key={color}
                      onClick={() => setNewGoal({...newGoal, color})}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${colors[color]} ${newGoal.color === color ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={editingGoal ? updateGoal : addGoal} 
                className="btn-primary w-full mt-4"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Goals;