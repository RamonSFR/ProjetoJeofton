import 'dotenv/config';
import app from './app';
import { startOrderCreatedProjector } from './messaging/start-order-created-projector';

const PORT = process.env.PORT ?? '3003';

const executeStart = async (): Promise<void> => {
  await startOrderCreatedProjector();
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`order-service na porta ${PORT}`);
  });
};

executeStart().catch((error: unknown) => {
  console.error('Falha ao iniciar order-service', error);
  process.exit(1);
});
