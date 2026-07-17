import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Loader, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './Login.css';

const demoUsers = [
  { role: 'Admin', email: 'admin@grainguards.com', password: 'admin123', color: '#1B5E20', icon: '👨‍💼' },
  { role: 'Worker', email: 'worker@grainguards.com', password: 'worker123', color: '#1565C0', icon: '👷' },
  { role: 'Viewer', email: 'user@grainguards.com', password: 'user123', color: '#7B1FA2', icon: '👁️' },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isSignUp) {
        await register(name, email, password);
        setSuccess('Registration successful! Please sign in with your credentials.');
        setIsSignUp(false);
        setPassword('');
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Shield size={32} />
          </div>
          <h1>Grain Guards</h1>
          <p>Smart Storage Monitor</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success" style={{
            background: 'var(--safe-bg)',
            color: 'var(--safe)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            fontWeight: '500',
            marginBottom: '10px'
          }}>{success}</div>}

          {isSignUp && (
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={email.toLowerCase().includes('admin') ? "Enter Admin Passcode" : (isSignUp ? "Create Password" : "Password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <Loader size={18} className="spin-icon" /> : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem' }}>
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'New User? Create an Account'}
          </button>
        </div>

        <div className="demo-section">
          <span className="demo-label">Demo Credentials</span>
          <div className="demo-cards">
            {demoUsers.map((user) => (
              <button
                key={user.role}
                className="demo-card"
                onClick={() => fillDemo(user)}
                style={{ borderColor: user.color }}
              >
                <span className="demo-icon">{user.icon}</span>
                <strong>{user.role}</strong>
                <span className="demo-email">{user.email}</span>
                <span className="demo-pass">
                  {user.role === 'Admin' ? 'Passcode: ' : 'Pass: '}{user.password}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
