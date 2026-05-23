import "dotenv/config";
import app from "./app";
import { logger } from "./logger";

const PORT = process.env.PORT ?? "3001";

app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info({ port: PORT }, "user-service iniciado");
});
