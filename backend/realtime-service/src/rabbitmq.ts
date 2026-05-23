import * as amqp from "amqplib";
import { io } from "./socket";
import { logger } from "./logger";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672";

let connection: amqp.ChannelModel | amqp.RecoveringChannelModel;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    connection = (await amqp.connect(RABBITMQ_URL)) as amqp.ChannelModel;
    channel = await connection.createChannel();

    logger.info("Conectado ao RabbitMQ");

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

    logger.info("Queue configurada para eventos de pedidos");

    // Consume order messages
    channel.consume(orderQueue.queue, (msg) => {
      if (!msg) return;

      try {
        const eventData = JSON.parse(msg.content.toString());
        logger.info(
          {
            eventId: eventData.eventId,
            orderId: eventData.orderId,
            restaurantId: eventData.restaurantId,
          },
          "Evento de pedido recebido",
        );

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
        logger.error({ err: error }, "Erro ao processar mensagem");
        channel.nack(msg, false, true); // Requeue message
      }
    });

    // Handle connection errors
    connection.on("error", (err: any) => {
      logger.error({ err }, "Erro de conexão com RabbitMQ");
    });

    connection.on("close", () => {
      logger.info("Conexão RabbitMQ fechada");
    });
  } catch (error) {
    logger.error({ err: error }, "Erro ao conectar ao RabbitMQ");
    throw error;
  }
}

export async function closeRabbitMQ() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    logger.info("Conexão RabbitMQ fechada com sucesso");
  } catch (error) {
    logger.error({ err: error }, "Erro ao fechar conexão com RabbitMQ");
  }
}
