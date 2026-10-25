require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const securityHeaders = require('./middleware/securityHeaders');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');

const allowedOrigins = (
  process.env.CORS_ORIGIN || 'http://localhost,http://localhost:8080,http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(securityHeaders);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
    maxAge: 600,
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    name: 'Dashboard API',
    health: '/api/health',
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;