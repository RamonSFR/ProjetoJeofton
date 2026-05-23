import "dotenv/config";
import app from "./app";
import { startOrderCreatedConsumer } from "./messaging/start-order-created-consumer";
import { logger } from "./logger";

const PORT = Number(process.env.PORT ?? "3004");

const executeStart = async (): Promise<void> => {
  await startOrderCreatedConsumer();
  app.listen(PORT, "0.0.0.0", () => {
    logger.info({ port: PORT }, "notification-service iniciado");
  });
};

executeStart().catch((error: unknown) => {
  logger.error({ err: error }, "Falha ao iniciar notification-service");
  process.exit(1);
});
