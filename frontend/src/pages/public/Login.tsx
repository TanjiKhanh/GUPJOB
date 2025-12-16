import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/auth.css';
import { useAuth } from '../../auth/AuthContext'; // Ensure this points to Context, not Provider

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.group('🔐 Login Debugger');
    console.log('1. Submitting form with:', email);

    try {
      // Await the login. If AuthProvider doesn't return 'user', this will be undefined.
      const user = await login(email.trim(), password) as any;

      // console.log('2. Login function finished.');
      // console.log('3. User object received:', user);

      // Check Intended Destination (e.g., user tried to visit /profile before logging in)
      const intended = (location.state as any)?.from?.pathname;
      // console.log('4. Intended destination (from state):', intended);

      if (intended) {
        // console.log('🚀 Redirecting to intended:', intended);
        navigate(intended, { replace: true });
        return;
      }

      // Role-Based Redirect
      // WARNING: If 'user' is undefined, this check fails and goes to 'else'
      if (user?.role === 'ADMIN') {
        console.log('👑 User is ADMIN -> Going to /admin/dashboard');
        navigate('/admin/dashboard', { replace: true }); // Ensure this matches your route path
      } else {
        console.log('👤 User is STUDENT/MENTOR -> Going to /dashboard');
        navigate('/dashboard', { replace: true });
      }

    } catch (err: any) {
      console.error('❌ Login Error:', err);
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-sub">Welcome back! Please enter your details.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <label>
            Email Address
            <input
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </label>

          {/* Password Input */}
          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </label>

          <div className="auth-row">
            <Link className="link-muted" to="/forgot">Forgot Password?</Link>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}