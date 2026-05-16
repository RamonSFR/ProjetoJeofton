import * as amqp from "amqplib";
import { io } from "./socket";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672";

let connection: amqp.ChannelModel | amqp.RecoveringChannelModel;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    connection = (await amqp.connect(RABBITMQ_URL)) as amqp.ChannelModel;
    channel = await connection.createChannel();

    console.log("[RabbitMQ] Conectado ao RabbitMQ");

    // Setup exchange for orders
    // Setup exchange for order events (order-service publishes here)
    await channel.assertExchange("gestao-pedidos.events", "fanout", {
      durable: true,
    });

    // Setup queue for realtime service
    const orderQueue = await channel.assertQueue("realtime-service-orders", {
      durable: true,
    });

    // Bind to order events
    await channel.bindQueue(orderQueue.queue, "gestao-pedidos.events", "#");

    console.log("[RabbitMQ] Queue configurada para eventos de pedidos");

    // Consume order messages
    channel.consume(orderQueue.queue, (msg) => {
      if (!msg) return;

      try {
        const eventData = JSON.parse(msg.content.toString());
        console.log("[RabbitMQ] Evento de pedido recebido:", {
          eventId: eventData.eventId,
          orderId: eventData.orderId,
          restaurantId: eventData.restaurantId,
        });

        // Emit to specific order room
        if (eventData.orderId) {
          io.to(`order-${eventData.orderId}`).emit("order:created", eventData);
        }

        // Emit to restaurant room if applicable
        if (eventData.restaurantId) {
          io.to(`restaurant-${eventData.restaurantId}`).emit(
            "order:created",
            eventData,
          );
        }

        channel.ack(msg);
      } catch (error) {
        console.error("[RabbitMQ] Erro ao processar mensagem:", error);
        channel.nack(msg, false, true); // Requeue message
      }
    });

    // Handle connection errors
    connection.on("error", (err: any) => {
      console.error("[RabbitMQ] Erro de conexão:", err);
    });

    connection.on("close", () => {
      console.log("[RabbitMQ] Conexão fechada");
    });
  } catch (error) {
    console.error("[RabbitMQ] Erro ao conectar:", error);
    throw error;
  }
}

export async function closeRabbitMQ() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("[RabbitMQ] Conexão fechada com sucesso");
  } catch (error) {
    console.error("[RabbitMQ] Erro ao fechar conexão:", error);
  }
}
