import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login, initData, getCurrentUser } from '../utils/bank';

export default function LoginPage() {
  const router   = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    initData();
    if (getCurrentUser()) router.push('/dashboard');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(username.trim(), password);
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏦</div>
        <h1>SecureBank</h1>
        <p className="auth-subtitle">Online Banking Portal</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="msg-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="demo-creds">
          <strong>Demo Accounts</strong>
          <p>Username: <b>alice</b> &nbsp;|&nbsp; Password: <b>1234</b></p>
          <p>Username: <b>bob</b> &nbsp;&nbsp;&nbsp;|&nbsp; Password: <b>1234</b></p>
        </div>
      </div>
    </div>
  );
}
