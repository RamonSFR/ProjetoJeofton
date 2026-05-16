import amqp from 'amqplib';
import { RabbitMQContainer, StartedRabbitMQContainer } from '@testcontainers/rabbitmq';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import {
  ORDER_CREATED_EXCHANGE_NAME,
  type OrderCreatedEvent,
} from './order-created-event';
import { startOrderCreatedProjector } from './start-order-created-projector';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { closeReadModelPool } from '../read-model/read-model-db';

describe('PedidoCriadoEvent_DeveAtualizarReadModel', () => {
  let postgresContainer: PostgreSqlContainer | null = null;
  let rabbitContainer: StartedRabbitMQContainer | null = null;
  let pgClient: Client | null = null;

  const executeApplyMigration = async (client: Client): Promise<void> => {
    const migrations = [
      '20260412120000_init_orders/migration.sql',
      '20260516184500_add_read_model_projection/migration.sql',
    ];
    for (const migrationPath of migrations) {
      const absoluteMigrationPath = path.resolve(
        __dirname,
        '../../prisma/migrations',
        migrationPath
      );
      const sql = readFileSync(absoluteMigrationPath, 'utf-8');
      await client.query(sql);
    }
  };

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('db_orders')
      .withUsername('postgres')
      .withPassword('postgres')
      .start();
    rabbitContainer = await new RabbitMQContainer('rabbitmq:3.13-management').start();
    process.env.DATABASE_URL = postgresContainer.getConnectionUri();
    process.env.RABBITMQ_URL = rabbitContainer.getAmqpUrl().replace('amqp://', 'amqp://guest:guest@');
    pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await pgClient.connect();
    await executeApplyMigration(pgClient);
    await startOrderCreatedProjector();
  }, 120000);

  afterAll(async () => {
    await closeReadModelPool();
    if (pgClient) {
      await pgClient.end();
    }
    if (rabbitContainer) {
      await rabbitContainer.stop();
    }
    if (postgresContainer) {
      await postgresContainer.stop();
    }
  }, 120000);

  it('deve projetar evento nas tabelas de leitura e registrar idempotencia', async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    await channel.assertExchange(ORDER_CREATED_EXCHANGE_NAME, 'fanout', {
      durable: true,
    });
    const eventId = randomUUID();
    const payload: OrderCreatedEvent = {
      eventId,
      orderId: 999,
      restaurantId: 10,
      customerId: 20,
      customerName: 'Cliente Teste',
      customerEmail: 'cliente@teste.com',
      totalAmount: '88.70',
      deliveryAddressSnapshot: 'Rua X, 100',
      createdAt: new Date().toISOString(),
      items: [
        { productId: 1, productName: 'Pizza', quantity: 2, unitPrice: '30.00' },
        { productId: 2, productName: 'Suco', quantity: 1, unitPrice: '28.70' },
      ],
    };
    channel.publish(ORDER_CREATED_EXCHANGE_NAME, '', Buffer.from(JSON.stringify(payload), 'utf-8'), {
      contentType: 'application/json',
      persistent: true,
      messageId: payload.eventId,
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
    const orderResult = await pgClient!.query<{
      order_id: number;
      customer_name: string;
      total_amount: string;
    }>(
      'SELECT order_id, customer_name, total_amount::text FROM orders_read WHERE order_id = $1',
      [payload.orderId]
    );
    expect(orderResult.rows).toHaveLength(1);
    expect(orderResult.rows[0].customer_name).toBe('Cliente Teste');
    expect(orderResult.rows[0].total_amount).toBe('88.70');
    const itemResult = await pgClient!.query<{ quantity: number }>(
      'SELECT quantity FROM order_items_read WHERE order_id = $1 ORDER BY id ASC',
      [payload.orderId]
    );
    expect(itemResult.rows).toHaveLength(2);
    const processedResult = await pgClient!.query<{ event_id: string }>(
      'SELECT event_id FROM processed_events WHERE event_id = $1',
      [payload.eventId]
    );
    expect(processedResult.rows).toHaveLength(1);
    await channel.close();
    await connection.close();
  }, 60000);
});
