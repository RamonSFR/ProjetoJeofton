import { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma';
import type { Product as ProductModel } from '@prisma/client';

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
  return prisma.product.create({
    data: {
      name: data.name,
      price: new Prisma.Decimal(data.price),
      restaurantId,
    },
  });
};

export const getPaginatedByRestaurant = async (params: {
  restaurantId: number;
  page: number;
  pageSize: number;
  productIds?: readonly number[];
}): Promise<PaginatedProductsResult> => {
  const { restaurantId, page, pageSize, productIds } = params;
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
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

export const getById = async (
  restaurantId: number,
  productId: number
): Promise<ProductModel | null> => {
  return prisma.product.findFirst({
    where: { id: productId, restaurantId },
  });
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
  return prisma.product.update({
    where: { id: productId },
    data: payload,
  });
};

export const remove = async (restaurantId: number, productId: number): Promise<ProductModel> => {
  const existing = await prisma.product.findFirst({
    where: { id: productId, restaurantId },
  });
  if (!existing) {
    throw Object.assign(new Error('Produto nao encontrado'), { code: 'P2025' as const });
  }
  return prisma.product.delete({
    where: { id: productId },
  });
};
