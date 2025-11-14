import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function LoginPage() {
  const { login, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/games', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(form.username.trim(), form.password);
    if (!result.success) {
      setError(result.message ?? 'Login failed, please try again.');
      return;
    }
    navigate('/');
  };

  return (
    <div className="panel">
      <h1 className="page-title">Sign In</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="username">
          Username
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            required
            minLength={3}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            minLength={4}
          />
        </label>
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <button type="submit" style={{ width: '100%' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}
