import { GenericContainer, Wait } from 'testcontainers';
import type { StartedTestContainer } from 'testcontainers';
import { Prisma } from '@prisma/client';
import type { Product as ProductModel } from '@prisma/client';
import {
  closeRestaurantRedisCache,
  deleteCachePattern,
} from './redis-cache';
import {
  getProductByIdFromCache,
  invalidateProductCache,
  setProductByIdInCache,
} from './product-cache-service';

describe('product-cache-service integration', () => {
  let redisContainer: StartedTestContainer | null = null;

  beforeAll(async () => {
    redisContainer = await new GenericContainer('redis:7-alpine')
      .withCommand(['redis-server', '--requirepass', 'test-pass'])
      .withExposedPorts(6379)
      .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
      .start();

    process.env.REDIS_URL = `redis://default:test-pass@127.0.0.1:${redisContainer.getMappedPort(6379)}`;
    process.env.REDIS_PREFIX = 'Teste:restaurant-service';
  }, 120000);

  afterEach(async () => {
    await deleteCachePattern('Teste:restaurant-service:*');
  });

  afterAll(async () => {
    await closeRestaurantRedisCache();
    if (redisContainer) {
      await redisContainer.stop();
    }
  }, 120000);

  it('deve fazer hit na segunda leitura apos gravar no cache', async () => {
    const product: ProductModel = {
      id: 10,
      restaurantId: 5,
      name: 'Pizza de Pepperoni',
      price: new Prisma.Decimal('49.90'),
      createdAt: new Date('2026-05-16T12:00:00.000Z'),
      updatedAt: new Date('2026-05-16T12:00:00.000Z'),
    };

    const firstRead = await getProductByIdFromCache(product.restaurantId, product.id);
    expect(firstRead).toBeNull();

    await setProductByIdInCache(product);

    const secondRead = await getProductByIdFromCache(product.restaurantId, product.id);
    expect(secondRead).not.toBeNull();
    expect(secondRead?.name).toBe('Pizza de Pepperoni');
    expect(secondRead?.price.eq(new Prisma.Decimal('49.90'))).toBe(true);
  });

  it('deve invalidar a chave do produto apos escrita', async () => {
    const product: ProductModel = {
      id: 11,
      restaurantId: 8,
      name: 'Hamburguer Artesanal',
      price: new Prisma.Decimal('29.90'),
      createdAt: new Date('2026-05-16T12:00:00.000Z'),
      updatedAt: new Date('2026-05-16T12:00:00.000Z'),
    };

    await setProductByIdInCache(product);
    await invalidateProductCache(product.restaurantId, product.id);

    const afterInvalidation = await getProductByIdFromCache(product.restaurantId, product.id);
    expect(afterInvalidation).toBeNull();
  });
});
