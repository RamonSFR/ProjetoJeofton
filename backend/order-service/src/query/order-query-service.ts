import type { OrderStatus } from '@prisma/client';
import type { OrderRead, PaginatedOrderReadsResult } from '../read-model/read-model-types';
import { getOrderReadById, getOrderReadsPaginated } from '../read-model/order-read-repository';
import {
  getOrderListFromCache,
  getOrderReadFromCache,
  setOrderListInCache,
  setOrderReadInCache,
} from '../cache/order-query-cache-service';

export const findOrderReadById = async (orderId: number): Promise<OrderRead | null> => {
  const cached = await getOrderReadFromCache(orderId);
  if (cached) {
    return cached;
  }

  const order = await getOrderReadById(orderId);
  if (order) {
    await setOrderReadInCache(order);
  }
  return order;
};

export const listOrderReadsPaginated = async (params: {
  page: number;
  pageSize: number;
  customerId?: number;
  restaurantId?: number;
  status?: OrderStatus;
}): Promise<PaginatedOrderReadsResult> => {
  const cached = await getOrderListFromCache({
    page: params.page,
    pageSize: params.pageSize,
    customerId: params.customerId,
    restaurantId: params.restaurantId,
    status: params.status,
  });
  if (cached) {
    return cached;
  }

  const result = await getOrderReadsPaginated({
    page: params.page,
    pageSize: params.pageSize,
    customerId: params.customerId,
    restaurantId: params.restaurantId,
    status: params.status,
  });
  await setOrderListInCache(
    {
      page: params.page,
      pageSize: params.pageSize,
      customerId: params.customerId,
      restaurantId: params.restaurantId,
      status: params.status,
    },
    result
  );
  return result;
};
