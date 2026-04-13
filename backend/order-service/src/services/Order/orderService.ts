import { Prisma } from '@prisma/client';
import type { Order, OrderItem, OrderStatus } from '@prisma/client';
import { canTransitionOrderStatus } from '../../domain/order-status';
import { prisma } from '../../database/prisma';
import {
  assertRestaurantExists,
  fetchProductsForRestaurant,
} from '../restaurant-service-client';
import { assertCustomerExists } from '../user-service-client';

export class OrderNotFoundError extends Error {
  readonly name = 'OrderNotFoundError';
  constructor(message = 'Pedido nao encontrado') {
    super(message);
  }
}

export class InvalidStatusTransitionError extends Error {
  readonly name = 'InvalidStatusTransitionError';
  constructor(
    message = 'Transicao de status invalida',
    readonly current?: OrderStatus,
    readonly requested?: OrderStatus
  ) {
    super(message);
  }
}

export class OrderItemsInvalidError extends Error {
  readonly name = 'OrderItemsInvalidError';
  constructor(message = 'Itens do pedido invalidos') {
    super(message);
  }
}

export type OrderWithItems = Order & { items: OrderItem[] };

const mergeQuantitiesByProduct = (
  items: readonly { productId: number; quantity: number }[]
): Map<number, number> => {
  const map = new Map<number, number>();
  for (const row of items) {
    map.set(row.productId, (map.get(row.productId) ?? 0) + row.quantity);
  }
  return map;
};

export const createOrder = async (input: {
  restaurantId: number;
  customerId: number;
  items: readonly { productId: number; quantity: number }[];
  deliveryAddressSnapshot?: string | null;
}): Promise<OrderWithItems> => {
  const { restaurantId, customerId, items, deliveryAddressSnapshot } = input;
  await assertCustomerExists(customerId);
  await assertRestaurantExists(restaurantId);
  const merged = mergeQuantitiesByProduct(items);
  const productIds = [...merged.keys()];
  const snapshots = await fetchProductsForRestaurant({ restaurantId, productIds });
  const byId = new Map(snapshots.map((p) => [p.id, p]));
  for (const pid of productIds) {
    if (!byId.has(pid)) {
      throw new OrderItemsInvalidError(`Produto ${pid} nao encontrado neste restaurante`);
    }
  }
  let total = new Prisma.Decimal(0);
  const lines: {
    productId: number;
    name: string;
    quantity: number;
    unitPrice: Prisma.Decimal;
  }[] = [];
  for (const [productId, quantity] of merged) {
    const product = byId.get(productId)!;
    const lineAmount = product.price.mul(quantity);
    total = total.add(lineAmount);
    lines.push({
      productId,
      name: product.name,
      quantity,
      unitPrice: product.price,
    });
  }
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        restaurantId,
        customerId,
        total,
        status: 'PENDING',
        deliveryAddressSnapshot: deliveryAddressSnapshot ?? null,
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            productNameSnapshot: l.name,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
    return order;
  });
};

export const getById = async (orderId: number): Promise<OrderWithItems | null> => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
};

export type PaginatedOrdersResult = {
  data: OrderWithItems[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const getPaginated = async (params: {
  page: number;
  pageSize: number;
  customerId?: number;
  restaurantId?: number;
  status?: OrderStatus;
}): Promise<PaginatedOrdersResult> => {
  const { page, pageSize, customerId, restaurantId, status } = params;
  const skip = (page - 1) * pageSize;
  const where: Prisma.OrderWhereInput = {
    ...(customerId !== undefined ? { customerId } : {}),
    ...(restaurantId !== undefined ? { restaurantId } : {}),
    ...(status !== undefined ? { status } : {}),
  };
  const [data, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { id: 'desc' },
      include: { items: true },
    }),
    prisma.order.count({ where }),
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

export const updateStatus = async (
  orderId: number,
  nextStatus: OrderStatus
): Promise<OrderWithItems> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) {
    throw new OrderNotFoundError();
  }
  if (order.status === nextStatus) {
    return order;
  }
  if (!canTransitionOrderStatus(order.status, nextStatus)) {
    throw new InvalidStatusTransitionError(
      'Transicao de status nao permitida',
      order.status,
      nextStatus
    );
  }
  return prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
    include: { items: true },
  });
};

export const cancelOrder = async (orderId: number): Promise<OrderWithItems> => {
  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!existing) {
    throw new OrderNotFoundError();
  }
  if (existing.status === 'CANCELLED') {
    return existing;
  }
  return updateStatus(orderId, 'CANCELLED');
};
