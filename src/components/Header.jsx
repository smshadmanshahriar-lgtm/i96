import { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className={`header ${scrolled ? 'header-scrolled glass-panel' : ''}`}>
      <div className="header-logo">
        <h1 className="text-gradient">i96</h1>
      </div>
      
      <div className="header-time">
        <div className="time">{timeString}</div>
        <div className="date">{dateString}</div>
      </div>
      
      <div className="header-user">
        <div className="avatar-placeholder" onClick={handleLogout} title="Sign Out">
          <LogOut size={16} color="#00E5FF" style={{ marginLeft: '-2px' }} />
        </div>
      </div>
    </header>
  );
}
