const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('../../routes/Routes');

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
    res.status(500).json({ erro: err.message });
});

module.exports = app;
