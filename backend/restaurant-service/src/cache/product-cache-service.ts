import { Prisma } from '@prisma/client';
import type { Product as ProductModel } from '@prisma/client';
import type { PaginatedProductsResult } from '../services/Product/productService';
import {
  deleteCacheKey,
  deleteCachePattern,
  getCacheJson,
  setCacheJson,
} from './redis-cache';

type CachedProduct = {
  readonly id: number;
  readonly restaurantId: number;
  readonly name: string;
  readonly price: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

type CachedPaginatedProductsResult = {
  readonly data: readonly CachedProduct[];
  readonly meta: PaginatedProductsResult['meta'];
};

const PRODUCT_ITEM_TTL_IN_SECONDS = 300;
const PRODUCT_LIST_TTL_IN_SECONDS = 120;

const getCachePrefix = (): string => {
  return process.env.REDIS_PREFIX?.trim() || 'ProjetoJeofton:restaurant-service';
};

const normalizeProductIds = (productIds?: readonly number[]): string => {
  if (!productIds || productIds.length === 0) {
    return 'all';
  }
  return [...productIds].sort((a, b) => a - b).join(',');
};

const getProductItemCacheKey = (restaurantId: number, productId: number): string => {
  return `${getCachePrefix()}:product:item:r${restaurantId}:p${productId}`;
};

const getProductListCacheKey = (params: {
  restaurantId: number;
  page: number;
  pageSize: number;
  productIds?: readonly number[];
}): string => {
  return `${getCachePrefix()}:product:list:r${params.restaurantId}:page:${params.page}:size:${params.pageSize}:ids:${normalizeProductIds(
    params.productIds
  )}`;
};

const getRestaurantListPattern = (restaurantId: number): string => {
  return `${getCachePrefix()}:product:list:r${restaurantId}:*`;
};

const toCachedProduct = (product: ProductModel): CachedProduct => {
  return {
    id: product.id,
    restaurantId: product.restaurantId,
    name: product.name,
    price: product.price.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
};

const fromCachedProduct = (product: CachedProduct): ProductModel => {
  return {
    id: product.id,
    restaurantId: product.restaurantId,
    name: product.name,
    price: new Prisma.Decimal(product.price),
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
  };
};

export const getProductByIdFromCache = async (
  restaurantId: number,
  productId: number
): Promise<ProductModel | null> => {
  const key = getProductItemCacheKey(restaurantId, productId);
  const cached = await getCacheJson<CachedProduct>(key);
  if (!cached) {
    console.info(`[product-cache] MISS ${key}`);
    return null;
  }
  console.info(`[product-cache] HIT ${key}`);
  return fromCachedProduct(cached);
};

export const setProductByIdInCache = async (product: ProductModel): Promise<void> => {
  const key = getProductItemCacheKey(product.restaurantId, product.id);
  await setCacheJson(key, toCachedProduct(product), PRODUCT_ITEM_TTL_IN_SECONDS);
  console.info(`[product-cache] SET ${key}`);
};

export const getProductListFromCache = async (params: {
  restaurantId: number;
  page: number;
  pageSize: number;
  productIds?: readonly number[];
}): Promise<PaginatedProductsResult | null> => {
  const key = getProductListCacheKey(params);
  const cached = await getCacheJson<CachedPaginatedProductsResult>(key);
  if (!cached) {
    console.info(`[product-cache] MISS ${key}`);
    return null;
  }
  console.info(`[product-cache] HIT ${key}`);
  return {
    data: cached.data.map(fromCachedProduct),
    meta: cached.meta,
  };
};

export const setProductListInCache = async (
  params: {
    restaurantId: number;
    page: number;
    pageSize: number;
    productIds?: readonly number[];
  },
  result: PaginatedProductsResult
): Promise<void> => {
  const key = getProductListCacheKey(params);
  await setCacheJson(
    key,
    {
      data: result.data.map(toCachedProduct),
      meta: result.meta,
    },
    PRODUCT_LIST_TTL_IN_SECONDS
  );
  console.info(`[product-cache] SET ${key}`);
};

export const invalidateRestaurantProductListCache = async (
  restaurantId: number
): Promise<void> => {
  const pattern = getRestaurantListPattern(restaurantId);
  const removedCount = await deleteCachePattern(pattern);
  console.info(`[product-cache] INVALIDATE ${pattern} (${removedCount} chaves)`);
};

export const invalidateProductCache = async (
  restaurantId: number,
  productId: number
): Promise<void> => {
  const itemKey = getProductItemCacheKey(restaurantId, productId);
  await deleteCacheKey(itemKey);
  console.info(`[product-cache] INVALIDATE ${itemKey}`);
  await invalidateRestaurantProductListCache(restaurantId);
};
