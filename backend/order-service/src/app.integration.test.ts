import { Prisma } from '@prisma/client';
import request from 'supertest';

jest.mock('./database/prisma', () => ({
  prisma: {
    $transaction: jest.fn(),
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import app from './app';
import { prisma } from './database/prisma';

describe('order-service HTTP (prisma mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /test', () => {
    it('returns health payload', async () => {
      const response = await request(app).get('/test');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /orders', () => {
    it('returns paginated result when transaction resolves', async () => {
      (prisma.$transaction as jest.Mock).mockResolvedValue([[], 0]);
      const response = await request(app).get('/orders').query({ page: 1, pageSize: 10 });
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.meta).toMatchObject({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      });
    });
  });

  describe('GET /orders/:id', () => {
    it('returns 404 when order is missing', async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);
      const response = await request(app).get('/orders/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('PATCH /orders/:id/status', () => {
    it('returns 200 when transition is valid', async () => {
      const existingOrder = {
        id: 1,
        restaurantId: 1,
        customerId: 1,
        total: new Prisma.Decimal('10'),
        status: 'PENDING' as const,
        deliveryAddressSnapshot: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };
      const updatedOrder = { ...existingOrder, status: 'CONFIRMED' as const };
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
      (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);
      const response = await request(app)
        .patch('/orders/1/status')
        .send({ status: 'CONFIRMED' });
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('CONFIRMED');
    });
    it('returns 409 when transition is invalid', async () => {
      const existingOrder = {
        id: 2,
        restaurantId: 1,
        customerId: 1,
        total: new Prisma.Decimal('10'),
        status: 'PENDING' as const,
        deliveryAddressSnapshot: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
      const response = await request(app)
        .patch('/orders/2/status')
        .send({ status: 'DELIVERED' });
      expect(response.status).toBe(409);
      expect(response.body.current).toBe('PENDING');
    });
  });
});
