import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-fitness-orange/20">
      <div className="glass-card p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 gradient-text">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input type="text" placeholder="Full Name" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-4">
            <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-primary-500">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
