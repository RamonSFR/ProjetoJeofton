import "dotenv/config";
import app from "./app";
import { logger } from "./logger";

const PORT = process.env.PORT ?? "3002";

app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info({ port: PORT }, "restaurant-service iniciado");
});
