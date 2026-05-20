import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FireIcon, ClockIcon, CalendarIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newWorkout, setNewWorkout] = useState({
    type: 'strength',
    name: '',
    duration: '',
    calories: '',
    difficulty: 'intermediate',
    date: new Date().toISOString().split('T')[0]
  });

  const workoutCategories = [
    { id: 'strength', name: 'Strength', icon: '💪', color: 'bg-red-500', workouts: [
      { name: 'Full Body Strength', duration: 45, calories: 350, difficulty: 'Intermediate' },
      { name: 'Upper Body Focus', duration: 40, calories: 320, difficulty: 'Intermediate' },
      { name: 'Lower Body Power', duration: 50, calories: 400, difficulty: 'Advanced' },
      { name: 'Push Day', duration: 35, calories: 280, difficulty: 'Beginner' },
      { name: 'Pull Day', duration: 35, calories: 290, difficulty: 'Beginner' }
    ]},
    { id: 'cardio', name: 'Cardio', icon: '🏃', color: 'bg-green-500', workouts: [
      { name: 'Running 5K', duration: 30, calories: 350, difficulty: 'Intermediate' },
      { name: 'HIIT Sprint', duration: 20, calories: 400, difficulty: 'Advanced' },
      { name: 'Cycling', duration: 45, calories: 380, difficulty: 'Intermediate' },
      { name: 'Jump Rope', duration: 15, calories: 250, difficulty: 'Beginner' },
      { name: 'Swimming', duration: 40, calories: 420, difficulty: 'Advanced' }
    ]},
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'bg-purple-500', workouts: [
      { name: 'Morning Flow', duration: 30, calories: 150, difficulty: 'Beginner' },
      { name: 'Power Yoga', duration: 45, calories: 250, difficulty: 'Intermediate' },
      { name: 'Evening Stretch', duration: 25, calories: 100, difficulty: 'Beginner' },
      { name: 'Yoga for Strength', duration: 50, calories: 280, difficulty: 'Advanced' }
    ]},
    { id: 'hiit', name: 'HIIT', icon: '⚡', color: 'bg-orange-500', workouts: [
      { name: '20 Min HIIT', duration: 20, calories: 300, difficulty: 'Intermediate' },
      { name: 'Tabata Training', duration: 16, calories: 280, difficulty: 'Advanced' },
      { name: 'Bodyweight HIIT', duration: 25, calories: 350, difficulty: 'Intermediate' },
      { name: 'Cardio Blast', duration: 30, calories: 380, difficulty: 'Advanced' }
    ]},
    { id: 'stretching', name: 'Stretching', icon: '🤸', color: 'bg-blue-500', workouts: [
      { name: 'Full Body Stretch', duration: 15, calories: 80, difficulty: 'Beginner' },
      { name: 'Post-Workout Stretch', duration: 10, calories: 50, difficulty: 'Beginner' },
      { name: 'Mobility Routine', duration: 20, calories: 120, difficulty: 'Intermediate' }
    ]}
  ];

  useEffect(() => {
    // Load workouts from localStorage
    const savedWorkouts = localStorage.getItem('fitlife_workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    } else {
      // Add sample workouts
      const sampleWorkouts = [
        { id: 1, type: 'strength', name: 'Full Body Strength', duration: 45, calories: 350, difficulty: 'Intermediate', date: '2024-01-15' },
        { id: 2, type: 'cardio', name: 'Running 5K', duration: 30, calories: 350, difficulty: 'Intermediate', date: '2024-01-14' },
        { id: 3, type: 'yoga', name: 'Morning Flow', duration: 30, calories: 150, difficulty: 'Beginner', date: '2024-01-13' },
      ];
      setWorkouts(sampleWorkouts);
      localStorage.setItem('fitlife_workouts', JSON.stringify(sampleWorkouts));
    }
  }, []);

  const addWorkout = () => {
    if (!newWorkout.name || !newWorkout.duration || !newWorkout.calories) {
      toast.error('Please fill all fields');
      return;
    }

    const workout = {
      id: Date.now(),
      ...newWorkout,
      duration: parseInt(newWorkout.duration),
      calories: parseInt(newWorkout.calories)
    };

    const updatedWorkouts = [workout, ...workouts];
    setWorkouts(updatedWorkouts);
    localStorage.setItem('fitlife_workouts', JSON.stringify(updatedWorkouts));
    
    setShowModal(false);
    setNewWorkout({
      type: 'strength',
      name: '',
      duration: '',
      calories: '',
      difficulty: 'intermediate',
      date: new Date().toISOString().split('T')[0]
    });
    toast.success('Workout logged successfully!');
  };

  const deleteWorkout = (id) => {
    const updatedWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(updatedWorkouts);
    localStorage.setItem('fitlife_workouts', JSON.stringify(updatedWorkouts));
    toast.success('Workout deleted');
  };

  const filteredWorkouts = selectedCategory === 'all' 
    ? workouts 
    : workouts.filter(w => w.type === selectedCategory);

  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalWorkouts = workouts.length;
  const weeklyWorkouts = workouts.filter(w => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(w.date) > weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Workout Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Log and track your fitness journey</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Log Workout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <FireIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalCalories}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Calories Burned</p>
        </div>
        <div className="stat-card">
          <CalendarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalWorkouts}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Workouts</p>
        </div>
        <div className="stat-card">
          <ClockIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{weeklyWorkouts}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
        </div>
        <div className="stat-card">
          <div className="text-2xl font-bold text-purple-500">🏆</div>
          <p className="text-2xl font-bold mt-2">{Math.floor(totalWorkouts / 5)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition-all ${selectedCategory === 'all' ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          All
        </button>
        {workoutCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'btn-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Workout Categories Display */}
      {selectedCategory === 'all' ? (
        // Show all categories
        <div className="space-y-6">
          {workoutCategories.map(category => (
            <div key={category.id} className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>{category.icon}</span> {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.workouts.map((workout, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="fitness-card cursor-pointer hover:scale-105"
                    onClick={() => {
                      setNewWorkout({
                        ...newWorkout,
                        type: category.id,
                        name: workout.name,
                        duration: workout.duration,
                        calories: workout.calories,
                        difficulty: workout.difficulty.toLowerCase()
                      });
                      setShowModal(true);
                    }}
                  >
                    <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-2xl mb-3`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{workout.name}</h3>
                    <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>⏱️ {workout.duration} min</span>
                      <span>🔥 {workout.calories} cal</span>
                    </div>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                      workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {workout.difficulty}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Show selected category only
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutCategories.find(c => c.id === selectedCategory)?.workouts.map((workout, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="fitness-card cursor-pointer hover:scale-105"
              onClick={() => {
                setNewWorkout({
                  ...newWorkout,
                  type: selectedCategory,
                  name: workout.name,
                  duration: workout.duration,
                  calories: workout.calories,
                  difficulty: workout.difficulty.toLowerCase()
                });
                setShowModal(true);
              }}
            >
              <div className={`w-12 h-12 ${workoutCategories.find(c => c.id === selectedCategory)?.color} rounded-full flex items-center justify-center text-2xl mb-3`}>
                {workoutCategories.find(c => c.id === selectedCategory)?.icon}
              </div>
              <h3 className="font-semibold text-lg">{workout.name}</h3>
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>⏱️ {workout.duration} min</span>
                <span>🔥 {workout.calories} cal</span>
              </div>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {workout.difficulty}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Workout History */}
      {filteredWorkouts.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
          <div className="space-y-3">
            {filteredWorkouts.slice(0, 5).map(workout => (
              <div key={workout.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-semibold">{workout.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workout.duration} min • {workout.calories} cal • {workout.date}
                  </p>
                </div>
                <button
                  onClick={() => deleteWorkout(workout.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Workout Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold gradient-text">Log Workout</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Workout Type</label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    {workoutCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Workout Name</label>
                  <input
                    type="text"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                    placeholder="e.g., Full Body Strength"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                    placeholder="45"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Calories Burned</label>
                  <input
                    type="number"
                    value={newWorkout.calories}
                    onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                    placeholder="350"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={newWorkout.difficulty}
                    onChange={(e) => setNewWorkout({...newWorkout, difficulty: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={newWorkout.date}
                    onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>

                <button onClick={addWorkout} className="btn-primary w-full">
                  Log Workout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutTracker;