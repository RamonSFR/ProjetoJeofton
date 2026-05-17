import { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma';
import type { Product as ProductModel } from '@prisma/client';
import {
  getProductByIdFromCache,
  getProductListFromCache,
  invalidateProductCache,
  invalidateRestaurantProductListCache,
  setProductByIdInCache,
  setProductListInCache,
} from '../../cache/product-cache-service';

type ProductCreateInput = {
  name: string;
  price: number;
};

type ProductUpdateInput = Partial<ProductCreateInput>;

export type PaginatedProductsResult = {
  data: ProductModel[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const create = async (restaurantId: number, data: ProductCreateInput): Promise<ProductModel> => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: new Prisma.Decimal(data.price),
      restaurantId,
    },
  });
  await invalidateRestaurantProductListCache(restaurantId);
  return product;
};

export const getPaginatedByRestaurant = async (params: {
  restaurantId: number;
  page: number;
  pageSize: number;
  productIds?: readonly number[];
}): Promise<PaginatedProductsResult> => {
  const { restaurantId, page, pageSize, productIds } = params;
  const cached = await getProductListFromCache({
    restaurantId,
    page,
    pageSize,
    productIds,
  });
  if (cached) {
    return cached;
  }
  const skip = (page - 1) * pageSize;
  const where: Prisma.ProductWhereInput = {
    restaurantId,
    ...(productIds !== undefined && productIds.length > 0
      ? { id: { in: [...productIds] } }
      : {}),
  };
  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { id: 'asc' },
    }),
    prisma.product.count({ where }),
  ]);
  const result = buildPaginatedProductsResult({
    page,
    pageSize,
    total,
    data,
  });
  await setProductListInCache(
    {
      restaurantId,
      page,
      pageSize,
      productIds,
    },
    result
  );
  return result;
};

export const getById = async (
  restaurantId: number,
  productId: number
): Promise<ProductModel | null> => {
  const cached = await getProductByIdFromCache(restaurantId, productId);
  if (cached) {
    return cached;
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, restaurantId },
  });

  if (product) {
    await setProductByIdInCache(product);
  }

  return product;
};

export const update = async (
  restaurantId: number,
  productId: number,
  data: ProductUpdateInput
): Promise<ProductModel> => {
  const existing = await prisma.product.findFirst({
    where: { id: productId, restaurantId },
  });
  if (!existing) {
    throw Object.assign(new Error('Produto nao encontrado'), { code: 'P2025' as const });
  }
  const payload: { name?: string; price?: Prisma.Decimal } = {};
  if (data.name !== undefined) {
    payload.name = data.name;
  }
  if (data.price !== undefined) {
    payload.price = new Prisma.Decimal(data.price);
  }
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: payload,
  });
  await invalidateProductCache(restaurantId, productId);
  return updatedProduct;
};

export const remove = async (restaurantId: number, productId: number): Promise<ProductModel> => {
  const existing = await prisma.product.findFirst({
    where: { id: productId, restaurantId },
  });
  if (!existing) {
    throw Object.assign(new Error('Produto nao encontrado'), { code: 'P2025' as const });
  }
  const deletedProduct = await prisma.product.delete({
    where: { id: productId },
  });
  await invalidateProductCache(restaurantId, productId);
  return deletedProduct;
};

const buildPaginatedProductsResult = (params: {
  page: number;
  pageSize: number;
  total: number;
  data: ProductModel[];
}): PaginatedProductsResult => {
  const totalPages = params.total === 0 ? 0 : Math.ceil(params.total / params.pageSize);
  return {
    data: params.data,
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      total: params.total,
      totalPages,
    },
  };
};
