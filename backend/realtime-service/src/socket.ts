import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { logger } from "./logger";

export let io: SocketIOServer;

export function initializeSocket(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    logger.info({ socketId: socket.id }, "Cliente conectado via Socket.io");

    // Cliente se inscreve em atualizações de um pedido específico
    socket.on("subscribe-order", (orderId: string) => {
      socket.join(`order-${orderId}`);
      logger.info(
        { socketId: socket.id, orderId },
        "Cliente inscrito em pedido",
      );
    });

    // Cliente se desinscreve de atualizações de um pedido
    socket.on("unsubscribe-order", (orderId: string) => {
      socket.leave(`order-${orderId}`);
      logger.info(
        { socketId: socket.id, orderId },
        "Cliente desinscrito de pedido",
      );
    });

    // Cliente se inscreve em atualizações de um restaurante
    socket.on("subscribe-restaurant", (restaurantId: string) => {
      socket.join(`restaurant-${restaurantId}`);
      logger.info(
        { socketId: socket.id, restaurantId },
        "Cliente inscrito em restaurante",
      );
    });

    // Cliente se desinscreve de atualizações de um restaurante
    socket.on("unsubscribe-restaurant", (restaurantId: string) => {
      socket.leave(`restaurant-${restaurantId}`);
      logger.info(
        { socketId: socket.id, restaurantId },
        "Cliente desinscrito de restaurante",
      );
    });

    socket.on("disconnect", () => {
      logger.info({ socketId: socket.id }, "Cliente desconectado do Socket.io");
    });

    socket.on("error", (error) => {
      logger.error({ err: error, socketId: socket.id }, "Erro no socket");
    });
  });

  return io;
}
