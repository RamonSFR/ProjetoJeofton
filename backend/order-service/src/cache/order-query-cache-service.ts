import type { OrderStatus } from '@prisma/client';
import type { OrderRead, PaginatedOrderReadsResult } from '../read-model/read-model-types';
import {
  deleteCacheKey,
  deleteCachePattern,
  getCacheJson,
  setCacheJson,
} from './redis-cache';

const ORDER_ITEM_TTL_IN_SECONDS = 30;
const ORDER_LIST_TTL_IN_SECONDS = 30;

const getCachePrefix = (): string => {
  return process.env.REDIS_PREFIX?.trim() || 'ProjetoJeofton:order-service';
};

const getOrderReadCacheKey = (orderId: number): string => {
  return `${getCachePrefix()}:order-read:item:o${orderId}`;
};

const getOrderListCacheKey = (params: {
  page: number;
  pageSize: number;
  customerId?: number;
  restaurantId?: number;
  status?: OrderStatus;
}): string => {
  return `${getCachePrefix()}:order-read:list:page:${params.page}:size:${params.pageSize}:customer:${params.customerId ?? 'all'}:restaurant:${params.restaurantId ?? 'all'}:status:${params.status ?? 'all'}`;
};

const getOrderListPattern = (): string => {
  return `${getCachePrefix()}:order-read:list:*`;
};

export const getOrderReadFromCache = async (orderId: number): Promise<OrderRead | null> => {
  const key = getOrderReadCacheKey(orderId);
  const cached = await getCacheJson<OrderRead>(key);
  if (!cached) {
    console.info(`[order-query-cache] MISS ${key}`);
    return null;
  }
  console.info(`[order-query-cache] HIT ${key}`);
  return cached;
};

export const setOrderReadInCache = async (order: OrderRead): Promise<void> => {
  const key = getOrderReadCacheKey(order.orderId);
  await setCacheJson(key, order, ORDER_ITEM_TTL_IN_SECONDS);
  console.info(`[order-query-cache] SET ${key}`);
};

export const getOrderListFromCache = async (params: {
  page: number;
  pageSize: number;
  customerId?: number;
  restaurantId?: number;
  status?: OrderStatus;
}): Promise<PaginatedOrderReadsResult | null> => {
  const key = getOrderListCacheKey(params);
  const cached = await getCacheJson<PaginatedOrderReadsResult>(key);
  if (!cached) {
    console.info(`[order-query-cache] MISS ${key}`);
    return null;
  }
  console.info(`[order-query-cache] HIT ${key}`);
  return cached;
};

export const setOrderListInCache = async (
  params: {
    page: number;
    pageSize: number;
    customerId?: number;
    restaurantId?: number;
    status?: OrderStatus;
  },
  result: PaginatedOrderReadsResult
): Promise<void> => {
  const key = getOrderListCacheKey(params);
  await setCacheJson(key, result, ORDER_LIST_TTL_IN_SECONDS);
  console.info(`[order-query-cache] SET ${key}`);
};

export const invalidateOrderReadCache = async (orderId: number): Promise<void> => {
  const key = getOrderReadCacheKey(orderId);
  await deleteCacheKey(key);
  console.info(`[order-query-cache] INVALIDATE ${key}`);
};

export const invalidateOrderListCache = async (): Promise<void> => {
  const pattern = getOrderListPattern();
  const removedCount = await deleteCachePattern(pattern);
  console.info(`[order-query-cache] INVALIDATE ${pattern} (${removedCount} chaves)`);
};

export const invalidateOrderQueryCache = async (orderId: number): Promise<void> => {
  await invalidateOrderReadCache(orderId);
  await invalidateOrderListCache();
};
