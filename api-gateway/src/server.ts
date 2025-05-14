const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Options } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// Завантаження .env файлу
dotenv.config();

const app = express();

// Middleware для логування
app.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.url}`);
  next();
});

// Проксі для User Service
app.use('/users', createProxyMiddleware({
  target: userServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/users': '/users',
  },
  onProxyReq(proxyReq, req, res) {
    console.log(`[PROXY] Forwarding to User Service: ${proxyReq.protocol}//${proxyReq.getHeader('host')}${req.url}`);
  },
  onError(err, req, res) {
    console.error(`[PROXY] Error with User Service: ${err.message}`);
    res.status(500).json({ error: 'Failed to reach User Service' });
  }
}));

// Обробка невідомих маршрутів
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
});