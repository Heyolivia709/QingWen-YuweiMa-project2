import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function RegisterPage() {
  const { register, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/selection', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) {
      setError('password not match!');
      return;
    }
    const result = register(form.username.trim(), form.password);
    if (!result.success) {
      setError(result.message ?? 'Failed, try again');
      return;
    }
    navigate('/');
  };

  return (
    <div className="panel">
      <h1 className="page-title">Register</h1>
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
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            minLength={4}
          />
        </label>
        <label htmlFor="confirm">
          Confirm Password
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={(event) => setForm((prev) => ({ ...prev, confirm: event.target.value }))}
            required
            minLength={4}
          />
        </label>
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <button type="submit">Register and start game</button>
      </form>
    </div>
  );
}
