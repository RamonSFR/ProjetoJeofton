import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT ?? '3003';

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`order-service na porta ${PORT}`);
});
