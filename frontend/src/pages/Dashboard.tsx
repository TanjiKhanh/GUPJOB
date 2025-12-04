import React, { useEffect, useState } from 'react';
import '../styles/styles.css';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const token = localStorage.getItem('gupjob_token');

  useEffect(() => {
    if (!token) return;
    (async () => {
      const res = await fetch('/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        setData({ error: 'Could not fetch dashboard' });
      }
    })();
  }, [token]);

  if (!token) return <div className="container">Not logged in. <a href="/login">Login</a></div>;

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}