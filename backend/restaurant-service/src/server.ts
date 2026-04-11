import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT ?? '3002';

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`restaurant-service na porta ${PORT}`);
});
