import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

const orderItemLineSchema = z.object({
  productId: z.coerce.number().int().positive('productId invalido'),
  quantity: z.coerce.number().int().positive('quantity invalida'),
});

export const createOrderBodySchema = z.object({
  restaurantId: z.coerce.number().int().positive('restaurantId invalido'),
  customerId: z.coerce.number().int().positive('customerId invalido'),
  items: z.array(orderItemLineSchema).min(1, 'Pedido deve ter ao menos um item'),
  deliveryAddress: z.string().trim().min(1).optional(),
});

export const orderIdParamSchema = z.object({
  id: z.coerce.number().int().positive('id invalido'),
});

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE, `pageSize deve ser no maximo ${MAX_PAGE_SIZE}`)
    .default(DEFAULT_PAGE_SIZE),
  customerId: z.coerce.number().int().positive().optional(),
  restaurantId: z.coerce.number().int().positive().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

export const patchOrderStatusBodySchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
export type PatchOrderStatusBody = z.infer<typeof patchOrderStatusBodySchema>;
