import { createClient } from 'redis';

type RedisCacheClient = ReturnType<typeof createClient>;

let redisClient: RedisCacheClient | null = null;
let redisClientPromise: Promise<RedisCacheClient | null> | null = null;

const createRedisConnection = async (): Promise<RedisCacheClient | null> => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  const client = createClient({
    url: redisUrl,
  });

  client.on('error', (error: unknown) => {
    console.error('[restaurant-cache] Redis error', error);
  });

  try {
    await client.connect();
    redisClient = client;
    return client;
  } catch (error: unknown) {
    console.error('[restaurant-cache] Falha ao conectar no Redis', error);
    try {
      await client.disconnect();
    } catch {
      // Ignore cleanup errors after a failed connection attempt.
    }
    return null;
  }
};

const getRedisClient = async (): Promise<RedisCacheClient | null> => {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (!redisClientPromise) {
    redisClientPromise = createRedisConnection().finally(() => {
      redisClientPromise = null;
    });
  }

  return redisClientPromise;
};

export const getCacheJson = async <TValue>(key: string): Promise<TValue | null> => {
  try {
    const client = await getRedisClient();
    if (!client) {
      return null;
    }
    const raw = await client.get(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as TValue;
  } catch (error: unknown) {
    console.error(`[restaurant-cache] Falha ao ler chave ${key}`, error);
    return null;
  }
};

export const setCacheJson = async <TValue>(
  key: string,
  value: TValue,
  ttlInSeconds: number
): Promise<void> => {
  try {
    const client = await getRedisClient();
    if (!client) {
      return;
    }
    await client.set(key, JSON.stringify(value), {
      EX: ttlInSeconds,
    });
  } catch (error: unknown) {
    console.error(`[restaurant-cache] Falha ao gravar chave ${key}`, error);
  }
};

export const deleteCacheKey = async (key: string): Promise<void> => {
  try {
    const client = await getRedisClient();
    if (!client) {
      return;
    }
    await client.del(key);
  } catch (error: unknown) {
    console.error(`[restaurant-cache] Falha ao remover chave ${key}`, error);
  }
};

export const deleteCachePattern = async (pattern: string): Promise<number> => {
  try {
    const client = await getRedisClient();
    if (!client) {
      return 0;
    }

    let removedCount = 0;
    const batch: string[] = [];

    for await (const key of client.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      batch.push(key);
      if (batch.length >= 100) {
        removedCount += await client.del(batch);
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      removedCount += await client.del(batch);
    }

    return removedCount;
  } catch (error: unknown) {
    console.error(`[restaurant-cache] Falha ao invalidar padrao ${pattern}`, error);
    return 0;
  }
};

export const closeRestaurantRedisCache = async (): Promise<void> => {
  if (!redisClient) {
    return;
  }
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } finally {
    redisClient = null;
    redisClientPromise = null;
  }
};
