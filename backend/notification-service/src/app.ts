import express from 'express';

const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/test', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
