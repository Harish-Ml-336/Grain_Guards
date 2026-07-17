import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Moon, Sun, Bell, LogOut, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './TopBar.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'bn', label: 'Bengali' },
  { code: 'mr', label: 'Marathi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'pa', label: 'Punjabi' },
];

function triggerGoogleTranslate(langCode) {
  // Set the Google Translate cookie to force translation
  const googLangMap = {
    en: 'en', hi: 'hi', ta: 'ta', te: 'te', bn: 'bn',
    mr: 'mr', gu: 'gu', kn: 'kn', ml: 'ml', pa: 'pa',
  };
  const target = googLangMap[langCode] || 'en';

  // Set the googtrans cookie
  document.cookie = `googtrans=/en/${target}; path=/; domain=${window.location.hostname}`;
  document.cookie = `googtrans=/en/${target}; path=/`;

  // Try to find and use the Google Translate select element
  const sel = document.querySelector('.goog-te-combo');
  if (sel) {
    sel.value = target;
    sel.dispatchEvent(new Event('change'));
  } else {
    // Fallback: reload to apply cookie
    window.location.reload();
  }
}

export default function TopBar({ title }) {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('gg-theme') !== 'light';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('gg-lang') || 'en';
  });
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const langRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Apply theme on mount and change
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('gg-theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('gg-theme', 'light');
    }
  }, [darkMode]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLangMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLangSelect = (code) => {
    setCurrentLang(code);
    localStorage.setItem('gg-lang', code);
    setShowLangMenu(false);
    triggerGoogleTranslate(code);
  };

  const formatDate = (d) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[d.getDay()];
    const date = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const h = hours % 12 || 12;
    const mins = d.getMinutes().toString().padStart(2, '0');
    const secs = d.getSeconds().toString().padStart(2, '0');
    return `${day}, ${date} ${month}, ${year}, ${h.toString().padStart(2, '0')}:${mins}:${secs} ${ampm}`;
  };

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const notifications = [
    { severity: 'var(--danger)', msg: 'Pest detected in Bin 2 (Wheat) — Immediate action required!', time: '2 min ago' },
    { severity: 'var(--danger)', msg: 'Humidity at 72% in Bin 2. Exceeds safe threshold.', time: '15 min ago' },
    { severity: 'var(--warning)', msg: 'Moisture rising in Bin 3 (Ragi). Currently 13%.', time: '30 min ago' },
    { severity: 'var(--warning)', msg: 'Temperature rising in Bin 5 (Millets). 33°C.', time: '1 hr ago' },
    { severity: 'var(--info)', msg: 'Daily sensor backup completed successfully.', time: '3 hr ago' },
  ];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
        <span className="topbar-date">{formatDate(time)}</span>
      </div>
      <div className="topbar-right">
        <form className="search-box" onSubmit={(e) => { e.preventDefault(); }}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* ===== Language Dropdown ===== */}
        <div className="lang-dropdown-wrapper notranslate" ref={langRef}>
          <button 
            className="topbar-btn lang-btn" 
            title="Change Language"
            onClick={() => setShowLangMenu(!showLangMenu)}
          >
            <Globe size={18} />
            <span className="btn-label">{currentLangObj.label}</span>
            <ChevronDown size={14} className={`lang-chevron ${showLangMenu ? 'open' : ''}`} />
          </button>
          {showLangMenu && (
            <div className="lang-dropdown-menu">
              <div className="lang-dropdown-title">Select Language</div>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`lang-dropdown-item ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => handleLangSelect(lang.code)}
                >
                  <span className="lang-item-native">{lang.label}</span>
                  {currentLang === lang.code && <Check size={14} className="lang-check" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== Theme Toggle ===== */}
        <button className="topbar-btn theme-toggle-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span className="btn-label">{darkMode ? 'Light' : 'Dark'}</span>
        </button>

        {/* ===== Notifications ===== */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            className="topbar-btn notification-btn" 
            title="Notifications"
            onClick={() => setShowNotif(!showNotif)}
          >
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>
          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h4>Notifications <span className="notif-count">5</span></h4>
                <button className="notif-mark-read">Mark all read</button>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="notif-item">
                  <div className="notif-dot" style={{ background: n.severity }}></div>
                  <div className="notif-content">
                    <p className="notif-msg">{n.msg}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== User Profile ===== */}
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Farmer'}</span>
          </div>
          <button className="topbar-btn logout-btn" onClick={logout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
