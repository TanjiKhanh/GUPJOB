require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_dev_key';

const PUBLIC_PREFIXES = ['/api/auth', '/health'];

console.log(`Gateway proxying /api/auth -> ${AUTH_SERVICE}/auth`);

// --- 1. Global Auth Middleware (Fixed) ---
app.use((req, res, next) => {
  // Only protect routes starting with /api
  if (!req.path.startsWith('/api')) {
    return next();
  }

  // Skip verification for Login/Register (The Fix!)
  if (PUBLIC_PREFIXES.some(prefix => req.path.startsWith(prefix))) {
    console.log(`Public route accessed: ${req.path}`);
    return next();
  }

  // Check Token for everything else
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log(`Blocked unauthorized request: ${req.path}`);
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.headers['x-user-id'] = String(payload.sub || payload.userId || payload.id || '');
    req.headers['x-user-email'] = payload.email || '';
    req.headers['x-user-role'] = payload.role || '';
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

// --- 2. Proxy Rules ---

// Auth Service Proxy
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '/auth' // Rewrites /api/auth/login -> /auth/login
    },
    onError: (err, req, res) => {
      console.error('Proxy Error (Auth):', err.message);
      res.status(500).json({ message: 'Gateway Error: Could not connect to Auth Service' });
    },
  })
);

// User Service Proxy (Assuming it shares the same backend for now)
app.use(
  '/api/user',
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      '^/api/user': '/user' // Rewrites /api/user/profile -> /user/profile
    },
    onError: (err, req, res) => {
      console.error('Proxy Error (User):', err.message);
      res.status(500).json({ message: 'Gateway Error: Could not connect to User Service' });  
    },
  })
);

app.get('/', (req, res) => res.send('API Gateway Running'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API Gateway listening on http://localhost:${port}`);
});