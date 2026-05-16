import amqp, { type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib';
import type { OrderCreatedEvent } from './order-created-event';
import { ORDER_CREATED_EXCHANGE_NAME } from './order-created-event';
import {
  type IProcessedEventsRepository,
  ProcessedEventsRepository,
} from '../read-model/processed-events-repository';
import { saveOrderProjection } from '../read-model/order-read-repository';
import { withReadModelTransaction } from '../read-model/read-model-db';

const ORDER_PROJECTOR_QUEUE_NAME = 'GestaoPedidos.OrderService:PedidoCriadoProjection';
const ORDER_CREATED_ROUTING_KEY = '';
const RABBITMQ_URL = process.env.RABBITMQ_URL ?? 'amqp://admin:admin@127.0.0.1:5672';

const parseEventMessage = (message: ConsumeMessage): OrderCreatedEvent => {
  return JSON.parse(message.content.toString('utf-8')) as OrderCreatedEvent;
};

const setupProjectionBindings = async (channel: Channel): Promise<void> => {
  await channel.assertExchange(ORDER_CREATED_EXCHANGE_NAME, 'fanout', {
    durable: true,
  });
  await channel.assertQueue(ORDER_PROJECTOR_QUEUE_NAME, {
    durable: true,
  });
  await channel.bindQueue(
    ORDER_PROJECTOR_QUEUE_NAME,
    ORDER_CREATED_EXCHANGE_NAME,
    ORDER_CREATED_ROUTING_KEY
  );
};

const executeProjectionFlow = async (
  payload: OrderCreatedEvent,
  processedEventsRepository: IProcessedEventsRepository
): Promise<boolean> => {
  return withReadModelTransaction<boolean>(async (client) => {
    const hasProcessed = await processedEventsRepository.hasEventBeenProcessed(
      client,
      payload.eventId
    );
    if (hasProcessed) {
      return true;
    }
    await saveOrderProjection(client, payload);
    await processedEventsRepository.registerProcessedEvent(client, payload.eventId);
    return false;
  });
};

const executeConsume = async (
  channel: Channel,
  processedEventsRepository: IProcessedEventsRepository
): Promise<void> => {
  await channel.consume(
    ORDER_PROJECTOR_QUEUE_NAME,
    async (message) => {
      if (!message) {
        return;
      }
      try {
        const payload = parseEventMessage(message);
        const hasProcessed = await executeProjectionFlow(payload, processedEventsRepository);
        if (hasProcessed) {
          console.warn(
            `[order-projector] Evento ${payload.eventId} ja foi processado. Ack sem reprojecao.`
          );
        }
        channel.ack(message);
      } catch (error: unknown) {
        console.error('[order-projector] Falha ao projetar PedidoCriadoEvent', error);
        channel.nack(message, false, true);
      }
    },
    { noAck: false }
  );
};

export const startOrderCreatedProjector = async (): Promise<void> => {
  const connection: ChannelModel = await amqp.connect(RABBITMQ_URL);
  const channel: Channel = await connection.createChannel();
  const processedEventsRepository: IProcessedEventsRepository = new ProcessedEventsRepository();
  await setupProjectionBindings(channel);
  await executeConsume(channel, processedEventsRepository);
};
