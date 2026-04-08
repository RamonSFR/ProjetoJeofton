import { prisma } from '../../database/prisma';
import type { Restaurant as RestaurantModel } from '@prisma/client';

type RestaurantCreateData = Omit<RestaurantModel, 'id' | 'createdAt' | 'updatedAt'>;
type RestaurantUpdateData = Partial<RestaurantCreateData>;

export type PaginatedRestaurantsResult = {
  data: RestaurantModel[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const create = async (data: RestaurantCreateData): Promise<RestaurantModel> => {
  return prisma.restaurant.create({ data });
};

export const getPaginated = async (params: {
  page: number;
  pageSize: number;
}): Promise<PaginatedRestaurantsResult> => {
  const { page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const [data, total] = await prisma.$transaction([
    prisma.restaurant.findMany({
      skip,
      take: pageSize,
      orderBy: { id: 'asc' },
    }),
    prisma.restaurant.count(),
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

export const getById = async (id: number): Promise<RestaurantModel | null> => {
  return prisma.restaurant.findUnique({ where: { id } });
};

export const update = async (id: number, data: RestaurantUpdateData): Promise<RestaurantModel> => {
  return prisma.restaurant.update({ where: { id }, data });
};

export const remove = async (id: number): Promise<RestaurantModel> => {
  return prisma.restaurant.delete({ where: { id } });
};

export const searchRestaurant = async (searchTerm: string): Promise<RestaurantModel[]> => {
  return prisma.restaurant.findMany({
    where: { name: { contains: searchTerm, mode: 'insensitive' } },
    orderBy: { name: 'asc' },
  });
};