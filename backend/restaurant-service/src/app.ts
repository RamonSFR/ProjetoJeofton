import express from 'express';
import restaurantRouter from './routes/restaurantRoutes';

const app = express();
app.use(express.json());
app.use(restaurantRouter);

app.get('/test', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
