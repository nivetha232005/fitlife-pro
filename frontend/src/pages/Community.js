import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, UserGroupIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    loadPosts();
    loadLeaderboard();
    loadChallenges();
  }, []);

  const loadPosts = () => {
    const saved = localStorage.getItem('fitlife_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const demoPosts = [
        {
          id: 1,
          userName: 'Sarah Johnson',
          userAvatar: 'SJ',
          userLevel: 'Advanced',
          content: 'Just completed my 30-day challenge! Feeling stronger than ever! 💪🎉',
          image: null,
          likes: 45,
          likedBy: [],
          comments: [
            { id: 1, userName: 'Mike Chen', comment: 'Amazing work! Keep it up! 🔥' },
            { id: 2, userName: 'Emma Davis', comment: 'You inspire me! ✨' }
          ],
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'achievement'
        },
        {
          id: 2,
          userName: 'Mike Chen',
          userAvatar: 'MC',
          userLevel: 'Intermediate',
          content: 'New personal best: 5km in 22 minutes! 🏃‍♂️ So proud of this progress!',
          image: null,
          likes: 32,
          likedBy: [],
          comments: [{ id: 1, userName: 'Sarah Johnson', comment: 'That\'s incredible speed! 🏃‍♂️' }],
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'achievement'
        },
        {
          id: 3,
          userName: 'Emma Davis',
          userAvatar: 'ED',
          userLevel: 'Beginner',
          content: 'Day 1 of my fitness journey! Any tips for a beginner? 🌟',
          image: null,
          likes: 28,
          likedBy: [],
          comments: [
            { id: 1, userName: 'John Smith', comment: 'Consistency is key! You got this!' },
            { id: 2, userName: 'Lisa Wong', comment: 'Start slow and enjoy the process! 💪' }
          ],
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'question'
        }
      ];
      setPosts(demoPosts);
      localStorage.setItem('fitlife_posts', JSON.stringify(demoPosts));
    }
  };

  const loadLeaderboard = () => {
    const saved = localStorage.getItem('fitlife_leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    } else {
      const demo = [
        { rank: 1, name: 'Alex Thompson', points: 2850, workouts: 45, avatar: 'AT', streak: 30 },
        { rank: 2, name: 'Maria Garcia', points: 2720, workouts: 42, avatar: 'MG', streak: 28 },
        { rank: 3, name: 'James Wilson', points: 2680, workouts: 41, avatar: 'JW', streak: 25 },
        { rank: 4, name: 'Emma Davis', points: 2590, workouts: 39, avatar: 'ED', streak: 22 },
        { rank: 5, name: 'Daniel Lee', points: 2510, workouts: 38, avatar: 'DL', streak: 20 },
      ];
      setLeaderboard(demo);
      localStorage.setItem('fitlife_leaderboard', JSON.stringify(demo));
    }
  };

  const loadChallenges = () => {
    const saved = localStorage.getItem('fitlife_challenges');
    if (saved) {
      setChallenges(JSON.parse(saved));
    } else {
      const demo = [
        { id: 1, name: '30-Day Pushup Challenge', participants: 234, daysLeft: 15, difficulty: 'Intermediate', prize: '🏆 Gold Badge' },
        { id: 2, name: '10K Steps Daily', participants: 567, daysLeft: 22, difficulty: 'Beginner', prize: '⭐ Silver Badge' },
        { id: 3, name: 'Weight Loss Journey', participants: 189, daysLeft: 28, difficulty: 'Advanced', prize: '💎 Diamond Badge' },
        { id: 4, name: 'Yoga Month', participants: 312, daysLeft: 18, difficulty: 'Beginner', prize: '🧘 Bronze Badge' },
      ];
      setChallenges(demo);
      localStorage.setItem('fitlife_challenges', JSON.stringify(demo));
    }
  };

  const createPost = () => {
    if (!newPost.trim()) {
      toast.error('Please write something to post');
      return;
    }

    const post = {
      id: Date.now(),
      userName: 'You',
      userAvatar: 'ME',
      userLevel: 'Active Member',
      content: newPost,
      image: null,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: new Date().toISOString(),
      type: 'general'
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('fitlife_posts', JSON.stringify(updatedPosts));
    setNewPost('');
    toast.success('Post shared with the community!');
  };

  const likePost = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy.includes('currentUser');
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked ? post.likedBy.filter(id => id !== 'currentUser') : [...post.likedBy, 'currentUser']
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('fitlife_posts', JSON.stringify(updatedPosts));
  };

  const addComment = (postId, comment) => {
    if (!comment.trim()) return;
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), userName: 'You', comment }]
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('fitlife_posts', JSON.stringify(updatedPosts));
    toast.success('Comment added!');
  };

  const joinChallenge = (challengeId) => {
    toast.success('You joined the challenge! Good luck! 🎯');
  };

  const formatTime = (timestamp) => {
    const diff = new Date() - new Date(timestamp);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h ago`;
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Community</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Connect, share, and grow together</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 font-semibold transition-all ${activeTab === 'feed' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 font-semibold transition-all ${activeTab === 'leaderboard' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 font-semibold transition-all ${activeTab === 'challenges' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Challenges
        </button>
      </div>

      {activeTab === 'feed' && (
        <>
          {/* Create Post */}
          <div className="glass-card p-6">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your fitness achievement, question, or motivation..."
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 resize-none"
              rows="3"
            />
            <div className="flex justify-end mt-3">
              <button onClick={createPost} className="btn-primary">
                Post to Community
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-fitness-orange rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {post.userAvatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.userName}</p>
                      <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                        {post.userLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(post.timestamp)}</p>
                  </div>
                </div>
                
                <p className="mb-4 text-gray-700 dark:text-gray-300">{post.content}</p>
                
                <div className="flex gap-4">
                  <button onClick={() => likePost(post.id)} className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
                    {post.likedBy.includes('currentUser') ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5" />
                    )}
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span>{post.comments.length}</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition">
                    <ShareIcon className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comments Section */}
                {post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-2 mb-2 text-sm">
                        <span className="font-semibold">{comment.userName}:</span>
                        <span className="text-gray-600 dark:text-gray-400">{comment.comment}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'leaderboard' && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrophyIcon className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Top Performers</h2>
          </div>
          <div className="space-y-3">
            {leaderboard.map(user => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-4 rounded-lg ${user.rank === 1 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl font-bold w-10 ${user.rank === 1 ? 'text-yellow-500' : user.rank === 2 ? 'text-gray-400' : user.rank === 3 ? 'text-orange-500' : 'text-gray-500'}`}>
                    #{user.rank}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-fitness-orange rounded-full flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">🔥 {user.streak} day streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-500">{user.points}</p>
                  <p className="text-xs text-gray-500">{user.workouts} workouts</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map(challenge => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{challenge.name}</h3>
                  <p className="text-sm text-gray-500">🎯 {challenge.difficulty}</p>
                </div>
                <div className="text-3xl">🏆</div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm flex items-center gap-2">
                  <UserGroupIcon className="w-4 h-4" />
                  {challenge.participants} participants
                </p>
                <p className="text-sm">⏰ {challenge.daysLeft} days left</p>
                <p className="text-sm">🎁 Prize: {challenge.prize}</p>
              </div>
              <button onClick={() => joinChallenge(challenge.id)} className="btn-primary w-full">
                Join Challenge
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;