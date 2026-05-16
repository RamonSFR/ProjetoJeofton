import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export let io: SocketIOServer;

export function initializeSocket(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.io] Cliente conectado: ${socket.id}`);

    // Cliente se inscreve em atualizações de um pedido específico
    socket.on("subscribe-order", (orderId: string) => {
      socket.join(`order-${orderId}`);
      console.log(`[Socket.io] ${socket.id} inscrito em order-${orderId}`);
    });

    // Cliente se desinscreve de atualizações de um pedido
    socket.on("unsubscribe-order", (orderId: string) => {
      socket.leave(`order-${orderId}`);
      console.log(`[Socket.io] ${socket.id} desinscrito de order-${orderId}`);
    });

    // Cliente se inscreve em atualizações de um restaurante
    socket.on("subscribe-restaurant", (restaurantId: string) => {
      socket.join(`restaurant-${restaurantId}`);
      console.log(
        `[Socket.io] ${socket.id} inscrito em restaurant-${restaurantId}`,
      );
    });

    // Cliente se desinscreve de atualizações de um restaurante
    socket.on("unsubscribe-restaurant", (restaurantId: string) => {
      socket.leave(`restaurant-${restaurantId}`);
      console.log(
        `[Socket.io] ${socket.id} desinscrito de restaurant-${restaurantId}`,
      );
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Cliente desconectado: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`[Socket.io] Erro no socket ${socket.id}:`, error);
    });
  });

  return io;
}
