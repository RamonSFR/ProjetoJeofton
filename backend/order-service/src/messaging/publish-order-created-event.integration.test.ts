import { randomUUID } from 'node:crypto';
import amqp from 'amqplib';
import { RabbitMQContainer } from '@testcontainers/rabbitmq';
import {
  ORDER_CREATED_EXCHANGE_NAME,
  type OrderCreatedEvent,
} from './order-created-event';
import {
  closeOrderMessagingConnection,
  publishOrderCreatedEvent,
} from './publish-order-created-event';

describe('publishOrderCreatedEvent integration', () => {
  const testQueueName = 'GestaoPedidos.Notificacoes:PedidoCriadoEvent';
  let rabbitContainer: RabbitMQContainer | null = null;
  beforeAll(async () => {
    rabbitContainer = await new RabbitMQContainer('rabbitmq:3.13-management').start();
    process.env.RABBITMQ_URL = rabbitContainer.getAmqpUrl().replace(
      'amqp://',
      'amqp://guest:guest@'
    );
  }, 120000);

  afterAll(async () => {
    await closeOrderMessagingConnection();
    if (rabbitContainer) {
      await rabbitContainer.stop();
    }
  }, 120000);

  it('deve publicar PedidoCriadoEvent para a fila de notificacoes', async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    await channel.assertExchange(ORDER_CREATED_EXCHANGE_NAME, 'fanout', {
      durable: true,
    });
    await channel.assertQueue(testQueueName, { durable: true });
    await channel.bindQueue(testQueueName, ORDER_CREATED_EXCHANGE_NAME, '');
    const expectedEventId = randomUUID();
    const payload: OrderCreatedEvent = {
      eventId: expectedEventId,
      orderId: 123,
      customerId: 321,
      customerName: 'Teste',
      customerEmail: 'teste@exemplo.com',
      totalAmount: '100.00',
      createdAt: new Date().toISOString(),
      items: [],
    };
    await publishOrderCreatedEvent(payload);
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
    const received = await channel.get(testQueueName, { noAck: false });
    expect(received).toBeTruthy();
    const receivedPayload = JSON.parse(
      (received as amqp.GetMessage).content.toString('utf-8')
    ) as OrderCreatedEvent;
    expect(receivedPayload.eventId).toBe(expectedEventId);
    channel.ack(received as amqp.GetMessage);
    await channel.close();
    await connection.close();
  }, 30000);
});
