const express = require('express');
const cors = require('cors');

function createBaseApp() {
  const app = express();
  const apiRoutes = require('./routes/Routes');

  const corsOrigin = process.env.CORS_ORIGIN;
  app.use(
    cors({
      origin: corsOrigin || true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json());
  app.use(apiRoutes);

  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ erro: err.message || 'Erro interno no servidor' });
  });

  return app;
}

function createApp(version = process.env.APP_VERSION || 'v1') {
  const normalizedVersion = String(version).toLowerCase();

  if (['v1', 'v2', 'v3'].includes(normalizedVersion)) {
    return require(`./versions/${normalizedVersion}/app`);
  }

  return createBaseApp();
}

module.exports = {
  createApp,
  createBaseApp,
};
