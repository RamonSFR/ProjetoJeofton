import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { initializeSocket } from "./socket";
import { connectRabbitMQ } from "./rabbitmq";
import { logger } from "./logger";

const PORT = Number(process.env.PORT ?? 3006);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "realtime-service" });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Start server with RabbitMQ connection
const startServer = async () => {
  try {
    // Connect to RabbitMQ for consuming events
    await connectRabbitMQ();
    logger.info("RabbitMQ conectado com sucesso");

    server.listen(PORT, "0.0.0.0", () => {
      logger.info({ port: PORT }, "realtime-service iniciado");
    });
  } catch (error) {
    logger.error({ err: error }, "Falha ao iniciar realtime-service");
    process.exit(1);
  }
};

startServer();
