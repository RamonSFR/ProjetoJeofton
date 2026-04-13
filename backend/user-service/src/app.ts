import express from 'express';
import userRouter from './routes/user';

const app = express();
app.use(express.json());
app.get('/test', (_req, res) => {
  res.json({ status: 'ok' });
});
app.use(userRouter);

export default app;
