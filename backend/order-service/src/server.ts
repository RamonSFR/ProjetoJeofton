import "dotenv/config";
import app from "./app";
import { startOrderCreatedProjector } from "./messaging/start-order-created-projector";
import { logger } from "./logger";

const PORT = process.env.PORT ?? "3003";

const executeStart = async (): Promise<void> => {
  await startOrderCreatedProjector();
  app.listen(Number(PORT), "0.0.0.0", () => {
    logger.info({ port: PORT }, "order-service iniciado");
  });
};

executeStart().catch((error: unknown) => {
  logger.error({ err: error }, "Falha ao iniciar order-service");
  process.exit(1);
});
