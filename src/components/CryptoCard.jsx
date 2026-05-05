import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './CryptoCard.css';

export default function CryptoCard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const symbols = '["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","ADAUSDT","DOGEUSDT","AVAXUSDT","LINKUSDT","DOTUSDT"]';
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`);
        if (!res.ok) throw new Error('Crypto fetch failed');
        const data = await res.json();
        
        const symbolMap = {
          'BTCUSDT': 'BTC',
          'ETHUSDT': 'ETH',
          'SOLUSDT': 'SOL',
          'BNBUSDT': 'BNB',
          'XRPUSDT': 'XRP',
          'ADAUSDT': 'ADA',
          'DOGEUSDT': 'DOGE',
          'AVAXUSDT': 'AVAX',
          'LINKUSDT': 'LINK',
          'DOTUSDT': 'DOT'
        };

        const formattedCoins = data.map(coin => {
          const price = parseFloat(coin.lastPrice);
          const change = parseFloat(coin.priceChangePercent);
          return {
            id: coin.symbol,
            symbol: symbolMap[coin.symbol],
            price: price >= 1000 ? `$${price.toLocaleString(undefined, {maximumFractionDigits: 0})}` : `$${price >= 1 ? price.toFixed(2) : price.toFixed(4)}`,
            change: `${change > 0 ? '+' : ''}${change.toFixed(2)}%`,
            isUp: change >= 0
          };
        });
        
        // Sort to maintain specific order
        const order = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX', 'LINK', 'DOT'];
        formattedCoins.sort((a, b) => order.indexOf(a.symbol) - order.indexOf(b.symbol));

        setCoins(formattedCoins);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 10000); // Update every 10 seconds for real-time feel
    return () => clearInterval(interval);
  }, []);

  const displayedCoins = isExpanded ? coins : coins.slice(0, 3);

  return (
    <div className="i96-card glass-panel crypto-card">
      <div className="card-header">
        <h2 className="card-title">
          <Bitcoin size={14} color="#F7931A" />
          Markets
        </h2>
        <button 
          className="crypto-expand-btn" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <><ChevronUp size={14} /> Less</>
          ) : (
            <><ChevronDown size={14} /> More</>
          )}
        </button>
      </div>

      <div className="crypto-list">
        {loading && coins.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.8rem', opacity: 0.7 }}>Loading Live Rates...</div>
        ) : (
          <AnimatePresence>
            {displayedCoins.map(coin => (
              <motion.div 
                key={coin.id} 
                className="crypto-item"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="crypto-info">
                  <span className="crypto-name">{coin.symbol}</span>
                  <span className="crypto-price">{coin.price}</span>
                </div>
                
                {/* Fake Sparkline */}
                <div className="crypto-sparkline">
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path 
                      d={coin.isUp ? "M0,25 Q25,10 50,20 T100,5" : "M0,5 Q25,20 50,10 T100,25"} 
                      fill="none" 
                      stroke={coin.isUp ? "#00E5FF" : "#FF3366"} 
                      strokeWidth="2" 
                    />
                    {coin.isUp && (
                      <path 
                        d="M0,25 Q25,10 50,20 T100,5 L100,30 L0,30 Z" 
                        fill={`url(#upGradient-${coin.id})`} 
                        opacity="0.2"
                      />
                    )}
                    <defs>
                      <linearGradient id={`upGradient-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className={`crypto-change ${coin.isUp ? 'change-up' : 'change-down'}`}>
                  {coin.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{coin.change}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
