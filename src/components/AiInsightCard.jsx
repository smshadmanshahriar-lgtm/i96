import { BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';
import './AiInsightCard.css';

const insights = [
  "Good afternoon. You have a team sync at 10:00 AM. Based on your recent focus sessions, you are on track to finish the architecture doc today.",
  "Market update: Volatility in the crypto sector is slightly higher today. Solana is outperforming major assets.",
  "Your fitness goals are 75% complete for today. A short 15-minute walk this evening will help you close your rings.",
  "News analysis: Tech sector remains focused on AI infrastructure improvements. SpaceX launch was successful.",
  "Productivity Insight: You've had fewer interruptions today compared to yesterday. Focus mode has been highly effective."
];

export default function AiInsightCard({ isRefreshing }) {
  const [glow, setGlow] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);

  const triggerUpdate = () => {
    setGlow(true);
    setInsightIndex(prev => (prev + 1) % insights.length);
    setTimeout(() => setGlow(false), 2000);
  };

  useEffect(() => {
    if (isRefreshing) {
      triggerUpdate();
    }
  }, [isRefreshing]);

  // Update automatically every 5 minutes (300,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      triggerUpdate();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`i96-card glass-panel ai-insight-card ${glow ? 'insight-glow' : ''}`}>
      <div className="card-header">
        <h2 className="card-title text-gradient">
          <BrainCircuit size={16} color="#00E5FF" />
          i96 Insight
        </h2>
      </div>
      
      <div className="insight-content">
        <p>
          "{insights[insightIndex]}"
        </p>
      </div>
    </div>
  );
}
