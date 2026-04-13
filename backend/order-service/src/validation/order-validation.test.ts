import { OrderStatus } from '@prisma/client';
import {
  createOrderBodySchema,
  getOrdersQuerySchema,
  orderIdParamSchema,
  patchOrderStatusBodySchema,
} from './order-validation';

describe('createOrderBodySchema', () => {
  it('accepts minimal valid body', () => {
    const inputBody = {
      restaurantId: 1,
      customerId: 2,
      items: [{ productId: 3, quantity: 1 }],
    };
    const parsed = createOrderBodySchema.safeParse(inputBody);
    expect(parsed.success).toBe(true);
  });
  it('rejects empty items', () => {
    const parsed = createOrderBodySchema.safeParse({
      restaurantId: 1,
      customerId: 1,
      items: [],
    });
    expect(parsed.success).toBe(false);
  });
  it('accepts optional deliveryAddress', () => {
    const parsed = createOrderBodySchema.safeParse({
      restaurantId: 1,
      customerId: 1,
      items: [{ productId: 1, quantity: 2 }],
      deliveryAddress: ' Rua A, 10 ',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.deliveryAddress).toBe('Rua A, 10');
    }
  });
});

describe('getOrdersQuerySchema', () => {
  it('applies defaults for page and pageSize', () => {
    const parsed = getOrdersQuerySchema.safeParse({});
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.page).toBe(1);
      expect(parsed.data.pageSize).toBe(20);
    }
  });
  it('rejects pageSize above 100', () => {
    const parsed = getOrdersQuerySchema.safeParse({ pageSize: 101 });
    expect(parsed.success).toBe(false);
  });
  it('parses status enum', () => {
    const parsed = getOrdersQuerySchema.safeParse({ status: OrderStatus.PENDING });
    expect(parsed.success).toBe(true);
  });
});

describe('orderIdParamSchema', () => {
  it('coerces string id to number', () => {
    const parsed = orderIdParamSchema.safeParse({ id: '5' });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.id).toBe(5);
    }
  });
});

describe('patchOrderStatusBodySchema', () => {
  it('accepts CONFIRMED', () => {
    const parsed = patchOrderStatusBodySchema.safeParse({ status: 'CONFIRMED' });
    expect(parsed.success).toBe(true);
  });
});
