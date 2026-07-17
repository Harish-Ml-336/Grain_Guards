import React, { useState, useEffect } from 'react';
import { Search, Shield, ShieldAlert, MoreVertical, XCircle, AlertTriangle } from 'lucide-react';
import './UserManagement.css';

const API = 'http://localhost:5000/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBlock = async (id, isBlocked) => {
    try {
      await fetch(`${API}/users/${id}/block`, { method: 'PUT' });
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const handleReport = async (id) => {
    if (!window.confirm("Are you sure you want to report this user?")) return;
    try {
      await fetch(`${API}/users/${id}/report`, { method: 'PUT' });
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${API}/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to update role');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-management-page">
      <div className="um-header">
        <div className="um-search">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="um-table-container">
        {loading ? (
          <div className="um-empty">Loading users...</div>
        ) : (
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Reports</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={user.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <td>
                    <div className="um-user-cell">
                      <div className="um-avatar">{user.name.substring(0, 2).toUpperCase()}</div>
                      <div className="um-user-info">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className={`um-role-badge role-${user.role}`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{
                        background: 'var(--surface-hover)',
                        color: 'var(--text)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="admin" style={{ background: '#1a1a2e', color: '#fff' }}>Admin</option>
                      <option value="worker" style={{ background: '#1a1a2e', color: '#fff' }}>Worker</option>
                      <option value="public" style={{ background: '#1a1a2e', color: '#fff' }}>Public</option>
                    </select>
                  </td>
                  <td>
                    <span className={`um-status-badge ${user.is_blocked ? 'blocked' : 'active'}`}>
                      {user.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <span className={`um-reports ${user.reports_count > 0 ? 'has-reports' : ''}`}>
                      {user.reports_count} {user.reports_count === 1 ? 'Report' : 'Reports'}
                    </span>
                  </td>
                  <td>
                    <div className="um-actions">
                      <button 
                        className={`um-action-btn ${user.is_blocked ? 'unblock-btn' : 'block-btn'}`}
                        onClick={() => handleBlock(user.id, user.is_blocked)}
                      >
                        <XCircle size={14} /> {user.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button className="um-action-btn report-btn" onClick={() => handleReport(user.id)}>
                        <AlertTriangle size={14} /> Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="um-empty">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
