import type { OrderStatus } from '@prisma/client';
import type { OrderRead, PaginatedOrderReadsResult } from '../read-model/read-model-types';
import { getOrderReadById, getOrderReadsPaginated } from '../read-model/order-read-repository';

export const findOrderReadById = async (orderId: number): Promise<OrderRead | null> => {
  return getOrderReadById(orderId);
};

export const listOrderReadsPaginated = async (params: {
  page: number;
  pageSize: number;
  customerId?: number;
  restaurantId?: number;
  status?: OrderStatus;
}): Promise<PaginatedOrderReadsResult> => {
  return getOrderReadsPaginated({
    page: params.page,
    pageSize: params.pageSize,
    customerId: params.customerId,
    restaurantId: params.restaurantId,
    status: params.status,
  });
};
