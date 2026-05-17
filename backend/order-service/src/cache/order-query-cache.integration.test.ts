import { GenericContainer, Wait } from 'testcontainers';
import type { StartedTestContainer } from 'testcontainers';
import { closeOrderQueryRedisCache, deleteCachePattern } from './redis-cache';
import {
  getOrderListFromCache,
  getOrderReadFromCache,
  invalidateOrderQueryCache,
  setOrderListInCache,
  setOrderReadInCache,
} from './order-query-cache-service';
import type { OrderRead, PaginatedOrderReadsResult } from '../read-model/read-model-types';

describe('order-query-cache integration', () => {
  let redisContainer: StartedTestContainer | null = null;

  beforeAll(async () => {
    redisContainer = await new GenericContainer('redis:7-alpine')
      .withCommand(['redis-server', '--requirepass', 'test-pass'])
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .start();

    process.env.REDIS_URL = `redis://default:test-pass@127.0.0.1:${redisContainer.getMappedPort(6379)}`;
    process.env.REDIS_PREFIX = 'Teste:order-service';
  }, 120000);

  afterEach(async () => {
    await deleteCachePattern('Teste:order-service:*');
  });

  afterAll(async () => {
    await closeOrderQueryRedisCache();
    if (redisContainer) {
      await redisContainer.stop();
    }
  }, 120000);

  it('deve fazer hit na segunda leitura do pedido', async () => {
    const order: OrderRead = {
      orderId: 77,
      restaurantId: 5,
      customerId: 8,
      customerName: 'Cliente Cache',
      customerEmail: 'cliente.cache@teste.com',
      totalAmount: '88.70',
      status: 'PENDING',
      deliveryAddressSnapshot: 'Rua Cache, 77',
      createdAt: '2026-05-16T12:00:00.000Z',
      updatedAt: '2026-05-16T12:00:00.000Z',
      items: [
        {
          id: 1,
          orderId: 77,
          productId: 10,
          productName: 'Pizza',
          quantity: 2,
          unitPrice: '44.35',
        },
      ],
    };

    expect(await getOrderReadFromCache(order.orderId)).toBeNull();

    await setOrderReadInCache(order);

    const cached = await getOrderReadFromCache(order.orderId);
    expect(cached).not.toBeNull();
    expect(cached?.customerName).toBe('Cliente Cache');
  });

  it('deve invalidar cache do item e da listagem', async () => {
    const order: OrderRead = {
      orderId: 88,
      restaurantId: 6,
      customerId: 9,
      customerName: 'Cliente Invalida',
      customerEmail: 'cliente.invalida@teste.com',
      totalAmount: '35.00',
      status: 'PENDING',
      deliveryAddressSnapshot: null,
      createdAt: '2026-05-16T12:00:00.000Z',
      updatedAt: '2026-05-16T12:00:00.000Z',
      items: [],
    };
    const paginatedResult: PaginatedOrderReadsResult = {
      data: [order],
      meta: {
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1,
      },
    };

    await setOrderReadInCache(order);
    await setOrderListInCache({ page: 1, pageSize: 20 }, paginatedResult);

    await invalidateOrderQueryCache(order.orderId);

    expect(await getOrderReadFromCache(order.orderId)).toBeNull();
    expect(await getOrderListFromCache({ page: 1, pageSize: 20 })).toBeNull();
  });
});
