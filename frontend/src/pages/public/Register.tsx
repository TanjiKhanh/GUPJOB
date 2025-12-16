import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const API = (import.meta as any).env?.VITE_API_URL || '';


export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('LEARNER');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Registration failed');
      }
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Register error');
    }
  }

  return (
    <div className="auth-page container">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="LEARNER">Learner</option>
            <option value="MENTOR">Mentor</option>
            <option value="COMPANY">Company</option>
          </select>
        </label>
        <div className="auth-actions">
          <button className="btn btn--primary" type="submit">Create account</button>
          <a className="link" href="/login">Sign in</a>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}