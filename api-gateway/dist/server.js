require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const app = express();
console.log('USER_SERVICE_URL:', process.env.USER_SERVICE_URL);
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
    '^/users': '/users', // можна змінити маршрут при потребі
  },
  onProxyReq(proxyReq, req, res) {
    console.log(`[PROXY] Forwarding request to: ${proxyReq.protocol}//${proxyReq.getHeader('host')}${req.url}`);
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