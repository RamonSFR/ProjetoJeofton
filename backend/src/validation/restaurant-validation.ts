import { z } from 'zod';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export const createRestaurantSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  managerId: z.coerce
    .number()
    .int('managerId deve ser inteiro')
    .positive('managerId deve ser positivo'),
});

export const updateRestaurantSchema = createRestaurantSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export const restaurantIdParamSchema = z.object({
  id: z.coerce.number().int('ID invalido').positive('ID deve ser positivo'),
});

export const getRestaurantsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'page deve ser >= 1').default(DEFAULT_PAGE),
  pageSize: z
    .coerce.number()
    .int()
    .min(1, 'pageSize deve ser >= 1')
    .max(MAX_PAGE_SIZE, `pageSize deve ser <= ${MAX_PAGE_SIZE}`)
    .default(DEFAULT_PAGE_SIZE),
});

export type CreateRestaurantBody = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantBody = z.infer<typeof updateRestaurantSchema>;
export type RestaurantIdParam = z.infer<typeof restaurantIdParamSchema>;
export type GetRestaurantsQuery = z.infer<typeof getRestaurantsQuerySchema>;
