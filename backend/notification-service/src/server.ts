import 'dotenv/config';
import app from './app';
import { startOrderCreatedConsumer } from './messaging/start-order-created-consumer';

const PORT = Number(process.env.PORT ?? '3004');

const executeStart = async (): Promise<void> => {
  await startOrderCreatedConsumer();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`notification-service na porta ${PORT}`);
  });
};

executeStart().catch((error: unknown) => {
  console.error('Falha ao iniciar notification-service', error);
  process.exit(1);
});
