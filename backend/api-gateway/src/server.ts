import 'dotenv/config';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = Number(process.env.PORT ?? 3000);
const USER_SERVICE_URL = process.env.USER_SERVICE_URL ?? 'http://127.0.0.1:3001';
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL ?? 'http://127.0.0.1:3002';

const app = express();

app.get('/test', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  '/users',
  createProxyMiddleware({ //middleware nativo do ts que pega a requisição e repassa pra outro servidor
    target: USER_SERVICE_URL,
    changeOrigin: true, //parametro que muda a origem do host atual para o targeted host 
  })
);

app.use(
  '/restaurants',
  createProxyMiddleware({
    target: RESTAURANT_SERVICE_URL,
    changeOrigin: true,
  })
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`api-gateway na porta ${PORT}`);
});
