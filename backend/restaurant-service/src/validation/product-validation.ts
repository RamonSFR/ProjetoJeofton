import { z } from 'zod';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export const restaurantIdForProductsParamSchema = z.object({
  restaurantId: z.coerce.number().int().positive('restaurantId invalido'),
});

export const restaurantAndProductIdParamSchema = z.object({
  restaurantId: z.coerce.number().int().positive('restaurantId invalido'),
  productId: z.coerce.number().int().positive('productId invalido'),
});

export const createProductBodySchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  price: z.coerce
    .number()
    .positive('Preco deve ser positivo')
    .refine((v) => Number.isFinite(v), 'Preco invalido'),
});

export const updateProductBodySchema = createProductBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE, `pageSize deve ser no maximo ${MAX_PAGE_SIZE}`)
    .default(DEFAULT_PAGE_SIZE),
  ids: z.preprocess((val: unknown) => {
    if (val === undefined || val === '') {
      return undefined;
    }
    const raw = Array.isArray(val) ? String(val[0]) : String(val);
    if (raw.trim() === '') {
      return undefined;
    }
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => Number.parseInt(s, 10))
      .filter((n) => !Number.isNaN(n) && n > 0);
  }, z.array(z.number().int().positive()).max(100).optional()),
});

export type RestaurantIdForProductsParam = z.infer<typeof restaurantIdForProductsParamSchema>;
export type RestaurantAndProductIdParam = z.infer<typeof restaurantAndProductIdParamSchema>;
export type CreateProductBody = z.infer<typeof createProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
