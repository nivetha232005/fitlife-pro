import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    activityLevel: 'moderate',
    fitnessGoal: 'stay fit',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.profile?.age || '',
        height: user.profile?.height || '',
        weight: user.profile?.weight || '',
        gender: user.profile?.gender || 'male',
        activityLevel: user.profile?.activityLevel || 'moderate',
        fitnessGoal: user.profile?.fitnessGoal || 'stay fit',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Update profile with new data
    const updatedProfile = {
      ...user,
      name: formData.name,
      profile: {
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        fitnessGoal: formData.fitnessGoal,
      }
    };
    
    // Save to localStorage via auth context
    const success = await updateProfile(updatedProfile);
    
    if (success) {
      setIsEditing(false);
      // Also update the user in localStorage directly
      const users = JSON.parse(localStorage.getItem('fitlife_users') || '[]');
      const userIndex = users.findIndex(u => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedProfile };
        localStorage.setItem('fitlife_users', JSON.stringify(users));
      }
    }
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return null;
  };

  const bmi = calculateBMI();
  
  let bmiCategory = '';
  let bmiColor = '';
  if (bmi) {
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-blue-500';
    } else if (bmi < 25) {
      bmiCategory = 'Normal weight';
      bmiColor = 'text-green-500';
    } else if (bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-orange-500';
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'text-red-500';
    }
  }

  // Calculate daily calorie needs (Mifflin-St Jeor Equation)
  const calculateCalories = () => {
    if (!formData.weight || !formData.height || !formData.age) return null;
    
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
    } else {
      bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very active': 1.9
    };
    
    const multiplier = activityMultipliers[formData.activityLevel] || 1.55;
    const maintenance = Math.round(bmr * multiplier);
    
    let goalCalories = maintenance;
    if (formData.fitnessGoal === 'lose weight') {
      goalCalories = maintenance - 500;
    } else if (formData.fitnessGoal === 'gain muscle') {
      goalCalories = maintenance + 300;
    }
    
    return {
      maintenance,
      goal: goalCalories,
      bmr: Math.round(bmr)
    };
  };

  const calories = calculateCalories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-fitness-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-white">
              {formData.name?.charAt(0) || 'U'}
            </span>
          </div>
          <h2 className="text-2xl font-semibold">{formData.name || 'Not set'}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-3">BMI Information</h3>
          {bmi ? (
            <>
              <p className="text-3xl font-bold">{bmi}</p>
              <p className={`${bmiColor} font-semibold mt-1`}>{bmiCategory}</p>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                  style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-500">Enter height and weight to calculate BMI</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-3">Daily Calorie Needs</h3>
          {calories ? (
            <>
              <p className="text-2xl font-bold text-primary-500">{calories.goal} kcal</p>
              <p className="text-sm text-gray-500 mt-1">
                Target for {formData.fitnessGoal === 'lose weight' ? 'weight loss' : 
                          formData.fitnessGoal === 'gain muscle' ? 'muscle gain' : 'maintenance'}
              </p>
              <div className="mt-2 text-xs text-gray-400">
                <p>Maintenance: {calories.maintenance} kcal</p>
                <p>BMR: {calories.bmr} kcal</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Enter details to calculate calories</p>
          )}
        </motion.div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <h2 className="text-2xl font-semibold mb-6 gradient-text">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  placeholder="Years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  placeholder="cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  placeholder="kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Activity Level</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="very active">Very Active (hard exercise daily)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fitness Goal</label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="lose weight">Lose Weight</option>
                  <option value="gain muscle">Gain Muscle</option>
                  <option value="stay fit">Stay Fit</option>
                  <option value="improve endurance">Improve Endurance</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Fitness Tips Section */}
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">💪 Personalized Fitness Tips</h3>
          <div className="space-y-3">
            {formData.fitnessGoal === 'lose weight' && (
              <p className="text-gray-600 dark:text-gray-300">• Focus on calorie deficit of 300-500 calories per day</p>
            )}
            {formData.fitnessGoal === 'gain muscle' && (
              <p className="text-gray-600 dark:text-gray-300">• Ensure adequate protein intake (1.6-2.2g per kg of body weight)</p>
            )}
            {formData.fitnessGoal === 'improve endurance' && (
              <p className="text-gray-600 dark:text-gray-300">• Incorporate interval training and gradually increase workout duration</p>
            )}
            <p className="text-gray-600 dark:text-gray-300">• Stay hydrated - aim for 2-3 liters of water daily</p>
            <p className="text-gray-600 dark:text-gray-300">• Get 7-9 hours of quality sleep for optimal recovery</p>
            {formData.age && formData.age > 50 && (
              <p className="text-gray-600 dark:text-gray-300">• Include low-impact exercises to protect your joints</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileSettings;