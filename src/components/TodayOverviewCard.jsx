import { Calendar, Target, Clock } from 'lucide-react';
import './TodayOverviewCard.css';

export default function TodayOverviewCard() {
  return (
    <div className="i96-card glass-panel">
      <div className="card-header">
        <h2 className="card-title">
          <Calendar size={14} color="#4D9FFF" />
          Today
        </h2>
      </div>
      
      <div className="today-content">
        <div className="daily-focus glow-cyan">
          <Target size={16} color="#00E5FF" />
          <span>Focus: Complete project architecture</span>
        </div>
        
        <div className="events-list">
          <div className="event-item">
            <div className="event-time">10:00 AM</div>
            <div className="event-detail">
              <div className="event-name">Sync Team</div>
              <div className="event-duration">30m</div>
            </div>
          </div>
          <div className="event-item">
            <div className="event-time">02:30 PM</div>
            <div className="event-detail">
              <div className="event-name">Design Review</div>
              <div className="event-duration">1h</div>
            </div>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-label">
            <span>Day Progress</span>
            <span>65%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
