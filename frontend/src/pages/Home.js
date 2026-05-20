import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-fitness-orange/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">FitLife Pro</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">Your Complete Fitness Tracking Platform</p>
          <div className="space-x-4">
            <Link to="/login" className="btn-primary">Get Started</Link>
            <Link to="/register" className="btn-secondary">Sign Up</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
