import type { OrderStatus } from '@prisma/client';
import { canTransitionOrderStatus, getAllowedNextStatuses } from './order-status';

describe('canTransitionOrderStatus', () => {
  const casesAllowed: readonly [OrderStatus, OrderStatus][] = [
    ['PENDING', 'CONFIRMED'],
    ['PENDING', 'CANCELLED'],
    ['CONFIRMED', 'PREPARING'],
    ['CONFIRMED', 'CANCELLED'],
    ['PREPARING', 'OUT_FOR_DELIVERY'],
    ['OUT_FOR_DELIVERY', 'DELIVERED'],
  ];
  it.each(casesAllowed)('allows %s -> %s', (current, next) => {
    expect(canTransitionOrderStatus(current, next)).toBe(true);
  });

  const casesDenied: readonly [OrderStatus, OrderStatus][] = [
    ['PENDING', 'PREPARING'],
    ['PENDING', 'DELIVERED'],
    ['CONFIRMED', 'DELIVERED'],
    ['PREPARING', 'DELIVERED'],
    ['PREPARING', 'CANCELLED'],
    ['OUT_FOR_DELIVERY', 'CANCELLED'],
    ['DELIVERED', 'CANCELLED'],
    ['CANCELLED', 'CONFIRMED'],
    ['DELIVERED', 'PENDING'],
  ];
  it.each(casesDenied)('denies %s -> %s', (current, next) => {
    expect(canTransitionOrderStatus(current, next)).toBe(false);
  });
});

describe('getAllowedNextStatuses', () => {
  it('returns allowed targets for PENDING', () => {
    const actualAllowed = getAllowedNextStatuses('PENDING');
    expect(actualAllowed).toEqual(['CONFIRMED', 'CANCELLED']);
  });
  it('returns empty for terminal DELIVERED', () => {
    expect(getAllowedNextStatuses('DELIVERED').length).toBe(0);
  });
});
