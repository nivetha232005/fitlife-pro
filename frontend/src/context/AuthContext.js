import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user
    const storedUser = localStorage.getItem('fitlife_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('fitlife_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('fitlife_user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('fitlife_users') || '[]');
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        toast.error('User already exists with this email');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
        profile: {
          age: null,
          height: null,
          weight: null,
          gender: 'male',
          activityLevel: 'moderate',
          fitnessGoal: 'stay fit'
        }
      };
      
      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('fitlife_users', JSON.stringify(users));
      
      // Auto login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('fitlife_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error('Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('fitlife_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updatedUserData) => {
    try {
      // Get current users
      const users = JSON.parse(localStorage.getItem('fitlife_users') || '[]');
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1) {
        // Update user in users array
        users[userIndex] = { ...users[userIndex], ...updatedUserData };
        localStorage.setItem('fitlife_users', JSON.stringify(users));
        
        // Update current user (remove password)
        const { password, ...userWithoutPassword } = users[userIndex];
        localStorage.setItem('fitlife_user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        
        toast.success('Profile updated successfully!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update profile');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateProfile, 
      loading, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
