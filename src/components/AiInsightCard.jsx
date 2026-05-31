import { BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AiInsightCard.css';

export default function AiInsightCard({ isRefreshing }) {
  const [glow, setGlow] = useState(false);
  const [user, setUser] = useState(null);
  const [dynamicInsight, setDynamicInsight] = useState("Initializing system telemetry...");

  // 1. Fetch user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Generate premium personalized dynamic insight
  const generateInsight = () => {
    if (!user) {
      setDynamicInsight("Welcome to i96. Please establish operator session to load live system parameters.");
      return;
    }

    const emailPart = user.email.split('@')[0];
    const firstName = emailPart.split(/[\._-]/)[0];
    const welcomeName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // Retrieve connection status
    const cachedApps = localStorage.getItem(`i96_connected_apps_${user.id}`);
    const parsedApps = cachedApps ? JSON.parse(cachedApps) : {};
    const customConnected = JSON.parse(localStorage.getItem(`i96_custom_connected_${user.id}`) || 'false');
    const isConnected = Object.values(parsedApps).some(val => val === true) || customConnected;

    // Retrieve live vitals
    const vitalsStr = localStorage.getItem(`i96_vitals_${user.id}`);
    const vitals = (isConnected && vitalsStr) ? JSON.parse(vitalsStr) : { steps: 0, kcal: 0, sleepHours: 0, sleepMinutes: 0 };

    // Retrieve live tasks and calendar
    const tasksStr = localStorage.getItem(`i96_tasks_${user.id}`);
    const tasks = tasksStr ? JSON.parse(tasksStr) : [];
    const calendarStr = localStorage.getItem(`i96_cal_${user.id}`);
    const calEvents = calendarStr ? JSON.parse(calendarStr) : [];
    
    const allItems = [...tasks, ...calEvents];
    const completedItems = allItems.filter(item => item.completed).length;
    const progress = allItems.length > 0 ? Math.round((completedItems / allItems.length) * 100) : 0;
    
    let insightText = `Welcome back, Operator ${welcomeName}. `;
    
    if (allItems.length > 0) {
      insightText += `Your daily timeline is ${progress}% complete with ${completedItems} of ${allItems.length} schedule nodes closed. `;
    } else {
      insightText += `Your task queue is fully clear. Excellent opportunity to initiate secondary targets. `;
    }

    if (!isConnected) {
      insightText += `Physical telemetry is unestablished. Link a health provider to synchronize live vitals.`;
    } else {
      insightText += `Current physical telemetry registers ${vitals.steps.toLocaleString()} steps and ${vitals.kcal} kcal output. Sleep cycle logged at ${vitals.sleepHours}h ${vitals.sleepMinutes}m. `;

      // Custom behavioral feedback based on vitals
      if (vitals.steps >= 12000) {
        insightText += `Exceptional kinetic performance today. You are outperforming standard expectations.`;
      } else if (vitals.steps > 8000) {
        insightText += `Your activity metrics remain stable. A light walk later will lock in your steps goal completely.`;
      } else {
        insightText += `Physical activation is currently suboptimal. Recommend initiating focus breaks to increase steps output.`;
      }
    }

    setDynamicInsight(insightText);
  };

  // Re-generate when user is loaded
  useEffect(() => {
    generateInsight();
  }, [user]);

  // Pull-to-refresh hook
  useEffect(() => {
    if (isRefreshing) {
      setGlow(true);
      generateInsight();
      setTimeout(() => setGlow(false), 2000);
    }
  }, [isRefreshing]);

  // Automatic state loop update every 30 minutes (1,800,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      generateInsight();
    }, 1800000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className={`i96-card glass-panel ai-insight-card ${glow ? 'insight-glow' : ''}`}>
      <div className="card-header">
        <h2 className="card-title text-gradient">
          <BrainCircuit size={16} color="#00E5FF" />
          i96 Intelligence Telemetry
        </h2>
      </div>
      
      <div className="insight-content">
        <p>
          "{dynamicInsight}"
        </p>
      </div>
    </div>
  );
}

