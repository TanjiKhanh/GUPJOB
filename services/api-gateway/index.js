const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://auth:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_dev_key';

// public routes that don't need token check
const PUBLIC_PREFIXES = ['/api/auth', '/health'];

// simple middleware: validate JWT for routes not public, and attach x-user-* headers
app.use('/api', (req, res, next) => {
  // If route is public, skip verification
  if (PUBLIC_PREFIXES.some(p => req.path.startsWith(p))) {
    return next();
  }

  // Expect Authorization header: Bearer <token>
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Attach minimal headers for downstream services if they trust the gateway:
    req.headers['x-user-id'] = String(payload.sub || payload.userId || payload.id || '');
    req.headers['x-user-email'] = payload.email || '';
    req.headers['x-user-role'] = payload.role || '';
    // also attach req.user for any gateway handlers
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verify failed', err?.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
});

// Proxy rules
app.use('/api/auth', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: {'^/api/auth': '/auth'} }));
app.use('/api/user', createProxyMiddleware({ target: AUTH_SERVICE, changeOrigin: true, pathRewrite: {'^/api/user': '/user'} }));

// Fallback for other paths to avoid 404 for SPA (optional)
app.get('/', (req, res) => res.send('API Gateway is running'));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API Gateway listening on ${port}`));