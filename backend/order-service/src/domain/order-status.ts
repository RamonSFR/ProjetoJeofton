import type { OrderStatus } from '@prisma/client';

const ALLOWED_TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
} as const;

export const canTransitionOrderStatus = (current: OrderStatus, next: OrderStatus): boolean => {
  const allowed = ALLOWED_TRANSITIONS[current];
  return allowed.includes(next);
};

export const getAllowedNextStatuses = (current: OrderStatus): readonly OrderStatus[] => {
  return ALLOWED_TRANSITIONS[current];
};
