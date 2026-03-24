import { z } from 'zod';

const cpfSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ''))
  .pipe(z.string().length(11, 'CPF deve conter 11 digitos'));

export const createUserBodySchema = z.object({
  cpf: cpfSchema,
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().trim().email('E-mail invalido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export const updateUserBodySchema = createUserBodySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive('ID invalido'),
});

export const getUserByEmailQuerySchema = z.object({
  email: z.string().trim().email('E-mail invalido'),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type GetUserByEmailQuery = z.infer<typeof getUserByEmailQuerySchema>;
