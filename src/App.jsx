import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Loader2 } from 'lucide-react';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import TodayOverviewCard from './components/TodayOverviewCard';
import AiInsightCard from './components/AiInsightCard';
import CryptoCard from './components/CryptoCard';
import FitnessCard from './components/FitnessCard';
import NewsFeed from './components/NewsFeed';
import AuthPage from './components/AuthPage';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && startY.current > 0 && !isRefreshing) {
      const y = e.touches[0].clientY;
      const diff = y - startY.current;
      if (diff > 0) {
        // Simple resistance
        const progress = Math.min(diff / 2, 80);
        setPullProgress(progress);
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullProgress > 60 && !isRefreshing) {
      triggerRefresh();
    }
    setPullProgress(0);
    startY.current = 0;
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    // Simulate n8n data sync
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0F1A', color: '#00E5FF' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div 
      className="app-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Header />
      
      {/* Pull to refresh visual */}
      <div 
        className="pull-indicator" 
        style={{ 
          height: isRefreshing ? '60px' : `${pullProgress}px`,
          opacity: isRefreshing ? 1 : pullProgress / 80,
          transition: isRefreshing ? 'height 0.3s ease, opacity 0.3s ease' : 'none'
        }}
      >
        <RefreshCcw 
          size={20} 
          className={isRefreshing ? 'animate-spin' : ''} 
          style={{ transform: `rotate(${pullProgress * 3}deg)` }}
        />
        <span style={{ marginLeft: '10px' }}>
          {isRefreshing ? 'Syncing n8n...' : 'Pull to refresh'}
        </span>
      </div>

      <motion.div 
        className="content-stack"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}><AiInsightCard isRefreshing={isRefreshing} /></motion.div>
        <motion.div variants={itemVariants}><WeatherCard /></motion.div>
        <motion.div variants={itemVariants}><TodayOverviewCard /></motion.div>
        <motion.div variants={itemVariants}><CryptoCard /></motion.div>
        <motion.div variants={itemVariants}><FitnessCard /></motion.div>
        <motion.div variants={itemVariants}><NewsFeed /></motion.div>
      </motion.div>
    </div>
  );
}

export default App;
