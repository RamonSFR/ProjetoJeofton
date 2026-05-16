import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { initializeSocket } from "./socket";
import { connectRabbitMQ } from "./rabbitmq";

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
    console.log("[RabbitMQ] Conectado com sucesso");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`[Realtime-Service] Rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("[Error] Falha ao iniciar realtime-service:", error);
    process.exit(1);
  }
};

startServer();
