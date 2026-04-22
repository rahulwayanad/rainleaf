import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError('Invalid username or password.');
        return;
      }
      const data = await res.json();
      login(data.access_token);
      navigate('/admin/dashboard');
    } catch {
      setError('Could not connect to server. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <Helmet>
        <title>Admin Login | Rainleaf Family Retreat</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="admin-login-box">
        <div className="admin-login-logo">
          <span className="logo-icon">&#127807;</span>
          <span className="admin-login-brand">RAINLEAF<br /><small>Admin Panel</small></span>
        </div>

        <h2 className="admin-login-title">Sign In</h2>

        {error && <div className="form-alert form-alert--error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
