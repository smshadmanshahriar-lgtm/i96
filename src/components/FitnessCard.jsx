import { Activity, Flame, Moon, Footprints } from 'lucide-react';
import './FitnessCard.css';

const ProgressRing = ({ radius, stroke, progress, color, icon: Icon }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring-container">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="ring-circle"
        />
      </svg>
      <div className="ring-icon">
        <Icon size={16} color={color} />
      </div>
    </div>
  );
};

export default function FitnessCard() {
  return (
    <div className="i96-card glass-panel fitness-card">
      <div className="card-header">
        <h2 className="card-title">
          <Activity size={14} color="#00E5FF" />
          Vitals
        </h2>
      </div>

      <div className="fitness-metrics">
        <div className="metric-item">
          <ProgressRing radius={35} stroke={4} progress={75} color="#00E5FF" icon={Footprints} />
          <div className="metric-info">
            <span className="metric-val">8,432</span>
            <span className="metric-label">Steps</span>
          </div>
        </div>

        <div className="metric-item">
          <ProgressRing radius={35} stroke={4} progress={60} color="#FFB020" icon={Flame} />
          <div className="metric-info">
            <span className="metric-val">450</span>
            <span className="metric-label">kcal</span>
          </div>
        </div>

        <div className="metric-item">
          <ProgressRing radius={35} stroke={4} progress={90} color="#4D9FFF" icon={Moon} />
          <div className="metric-info">
            <span className="metric-val">7h 20m</span>
            <span className="metric-label">Sleep</span>
          </div>
        </div>
      </div>
    </div>
  );
}
