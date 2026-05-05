import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NewsFeed.css';

export default function NewsFeed() {
  const [expandedId, setExpandedId] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/rss.xml');
        if (!res.ok) throw new Error('News fetch failed');
        const data = await res.json();
        
        if (data.status === 'ok') {
          const formattedNews = data.items.map((item, index) => {
            // Calculate time ago
            const pubDate = new Date(item.pubDate);
            const now = new Date();
            const diffHours = Math.floor((now - pubDate) / (1000 * 60 * 60));
            const timeStr = diffHours > 0 ? `${diffHours}h ago` : 'Just now';

            // Clean description (remove HTML tags)
            const cleanDesc = item.description.replace(/<[^>]+>/g, '');

            return {
              id: index,
              source: 'BBC News',
              title: item.title,
              summary: cleanDesc,
              time: timeStr
            };
          });
          setNews(formattedNews);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30 * 60 * 1000); // 30 mins
    return () => clearInterval(interval);
  }, []);

  const displayedNews = isExpanded ? news.slice(0, 10) : news.slice(0, 3);

  return (
    <div className="i96-card glass-panel news-feed">
      <div className="card-header">
        <h2 className="card-title">
          <Globe size={14} color="#00E5FF" />
          World News
        </h2>
        <button 
          className="news-expand-btn" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <><ChevronUp size={14} /> Less</>
          ) : (
            <><ChevronDown size={14} /> More</>
          )}
        </button>
      </div>

      <div className="news-list">
        {loading && news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.8rem', opacity: 0.7 }}>Loading Live News...</div>
        ) : (
          <AnimatePresence>
            {displayedNews.map(item => (
              <motion.div 
                key={item.id} 
                className="news-item"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="news-item-header">
                  <span className="news-source">{item.source}</span>
                  <span className="news-time">{item.time}</span>
                </div>
                
                <h3 className="news-title">{item.title}</h3>
                
                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="news-summary"
                    >
                      <p>{item.summary}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="news-expand-icon">
                  <ChevronDown 
                    size={14} 
                    style={{ 
                      transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
