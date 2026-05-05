import { useState } from 'react';
import { Mail, Lock, User, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './AuthPage.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-glass-panel">
        <div className="auth-header">
          <h1 className="auth-logo">i96.</h1>
          <p className="auth-subtitle">{isLogin ? 'Welcome back, operator.' : 'Initialize your dashboard.'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        <form className="auth-form" onSubmit={handleAuth}>
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={18} /> : (isLogin ? 'Initialize Session' : 'Create Access')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="google-auth-btn" onClick={handleGoogleLogin}>
          <Globe size={18} />
          Continue with Google
        </button>

        <div className="auth-toggle">
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have access? Request now." : "Already have access? Initialize."}
          </button>
        </div>
      </div>
    </div>
  );
}
