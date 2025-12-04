import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Demo: replace with real fetch to /auth/login
    // const res = await fetch('/auth/login', ...)
    // on success save token then navigate
    navigate('/dashboard');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-sub">Welcome back! Please enter your details.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>

          <label>
            Password
            <input name="password" type="password" placeholder="Enter your password" required />
          </label>

          <div className="auth-row">
            <a className="link-muted" href="/forgot">Forgot Password?</a>
          </div>

          <button className="btn btn--primary" type="submit">Sign In</button>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}