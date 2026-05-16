import amqp, { type ChannelModel, type ConfirmChannel } from 'amqplib';
import {
  ORDER_CREATED_EXCHANGE_NAME,
  ORDER_CREATED_ROUTING_KEY,
  type OrderCreatedEvent,
} from './order-created-event';

const PUBLISH_TIMEOUT_IN_MILLISECONDS = 5000;

let rabbitConnection: ChannelModel | null = null;
let rabbitChannel: ConfirmChannel | null = null;

const waitForMilliseconds = async (milliseconds: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const getRabbitMqUrl = (): string => {
  return process.env.RABBITMQ_URL ?? 'amqp://admin:admin@127.0.0.1:5672';
};

const openChannel = async (): Promise<ConfirmChannel> => {
  if (rabbitChannel) {
    return rabbitChannel;
  }
  if (!rabbitConnection) {
    rabbitConnection = await amqp.connect(getRabbitMqUrl());
    rabbitConnection.on('error', () => {
      rabbitConnection = null;
      rabbitChannel = null;
    });
    rabbitConnection.on('close', () => {
      rabbitConnection = null;
      rabbitChannel = null;
    });
  }
  rabbitChannel = await rabbitConnection.createConfirmChannel();
  await rabbitChannel.assertExchange(ORDER_CREATED_EXCHANGE_NAME, 'fanout', {
    durable: true,
  });
  return rabbitChannel;
};

const runWithTimeout = async <T>(operation: Promise<T>): Promise<T> => {
  let timeoutId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Tempo limite ao publicar evento no RabbitMQ'));
    }, PUBLISH_TIMEOUT_IN_MILLISECONDS);
  });
  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const serializeEvent = (payload: OrderCreatedEvent): Buffer => {
  return Buffer.from(JSON.stringify(payload), 'utf-8');
};

const executePublishWithRetry = async (payload: OrderCreatedEvent): Promise<void> => {
  const retries = [0, 500, 1000];
  let lastError: unknown = null;
  for (const delay of retries) {
    if (delay > 0) {
      await waitForMilliseconds(delay);
    }
    try {
      const channel = await openChannel();
      channel.publish(
        ORDER_CREATED_EXCHANGE_NAME,
        ORDER_CREATED_ROUTING_KEY,
        serializeEvent(payload),
        { contentType: 'application/json', persistent: true, messageId: payload.eventId }
      );
      await channel.waitForConfirms();
      return;
    } catch (error: unknown) {
      lastError = error;
      rabbitChannel = null;
      rabbitConnection = null;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Falha ao publicar evento PedidoCriado');
};

export const publishOrderCreatedEvent = async (payload: OrderCreatedEvent): Promise<void> => {
  await runWithTimeout(executePublishWithRetry(payload));
};

export const closeOrderMessagingConnection = async (): Promise<void> => {
  if (rabbitChannel) {
    await rabbitChannel.close();
    rabbitChannel = null;
  }
  if (rabbitConnection) {
    await rabbitConnection.close();
    rabbitConnection = null;
  }
};
