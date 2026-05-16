import amqp, { type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib';
import {
  NOTIFICATIONS_QUEUE_NAME,
  ORDER_CREATED_EXCHANGE_NAME,
  type OrderCreatedEvent,
} from './order-created-event';

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? 'amqp://admin:admin@127.0.0.1:5672';
const ORDER_CREATED_ROUTING_KEY = '';
const processedEventIds = new Set<string>();

const parseEvent = (message: ConsumeMessage): OrderCreatedEvent => {
  const body = message.content.toString('utf-8');
  const payload = JSON.parse(body) as OrderCreatedEvent;
  return payload;
};

const isEventAlreadyProcessed = (eventId: string): boolean => {
  return processedEventIds.has(eventId);
};

const markEventAsProcessed = (eventId: string): void => {
  processedEventIds.add(eventId);
};

const executeSimulatedEmailLog = (payload: OrderCreatedEvent): void => {
  console.log(
    `[E-MAIL SIMULADO] Para: ${payload.customerEmail} | Pedido: ${payload.orderId} | Total: R$ ${payload.totalAmount}`
  );
};

const setupBindings = async (channel: Channel): Promise<void> => {
  await channel.assertExchange(ORDER_CREATED_EXCHANGE_NAME, 'fanout', {
    durable: true,
  });
  await channel.assertQueue(NOTIFICATIONS_QUEUE_NAME, {
    durable: true,
  });
  await channel.bindQueue(
    NOTIFICATIONS_QUEUE_NAME,
    ORDER_CREATED_EXCHANGE_NAME,
    ORDER_CREATED_ROUTING_KEY
  );
};

const executeConsume = async (channel: Channel): Promise<void> => {
  await channel.consume(
    NOTIFICATIONS_QUEUE_NAME,
    async (message) => {
      if (!message) {
        return;
      }
      try {
        const payload = parseEvent(message);
        if (isEventAlreadyProcessed(payload.eventId)) {
          channel.ack(message);
          return;
        }
        executeSimulatedEmailLog(payload);
        markEventAsProcessed(payload.eventId);
        channel.ack(message);
      } catch (error: unknown) {
        console.error('Erro ao processar evento PedidoCriadoEvent', error);
        channel.nack(message, false, false);
      }
    },
    { noAck: false }
  );
};

export const startOrderCreatedConsumer = async (): Promise<void> => {
  const connection: ChannelModel = await amqp.connect(RABBITMQ_URL);
  const channel: Channel = await connection.createChannel();
  await setupBindings(channel);
  await executeConsume(channel);
};
