import { prisma } from '../../database/prisma';
import type { User as UserModel } from '@prisma/client';
import bcrypt from 'bcrypt';

type UserCreateData = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>; // esse omit é um tipo userModel só que sem os 3 parametros definidos ali
type UserUpdateData = Partial<UserCreateData>; // partial transforma todas propriedades de UserCreateData em opcionais

export type PaginatedUsersResult = {
  data: Omit<UserModel, 'password'>[];
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
}): Promise<PaginatedUsersResult> => {
  const { page, pageSize } = params;
  const skip = (page - 1) * pageSize;
  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      skip, // quantos registros pular
      take: pageSize, // quantos registros trazer
      orderBy: { id: 'asc' }, 
      omit: {password: true},
    }),
    prisma.user.count(),
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

export const update = async (userId: number, data: UserUpdateData): Promise<Omit<UserModel, 'password'>> => {
    const dataComSenhaHash = data.password
        ? { ...data, password: await bcrypt.hash(data.password, 10) }
        : data;
    const user = await prisma.user.update({ where: { id: userId }, data: dataComSenhaHash });
    const {password, ...userWithoutPassword} = user; // desestruturação com rest, remove password do obj user e copia o conteudo
    //que sobrou pro obj userWithoutPassword, para ser retornado para o controller
    return userWithoutPassword;

};

export const create = async (data: UserCreateData): Promise<Omit<UserModel, 'password'>> => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({ data: { ...data, password: hashedPassword } });
    const {password, ...userWithoutPassword} = user; // desestruturação com rest, remove password do obj user e copia o conteudo
    //que sobrou pro obj userWithoutPassword, para ser retornado para o controller
    return userWithoutPassword;
};

export const getById = async (userId: number): Promise<Omit<UserModel, 'password'> | null> => {
    return prisma.user.findUnique({ where: { id: userId }, omit: {password: true} });
};

export const remove = async (userId: number): Promise<Omit<UserModel, 'password'>> => {
    return prisma.user.delete({ where: { id: userId },  omit: {password: true} });
};

export const getByEmail = async (emailAddress: string): Promise<Omit<UserModel, 'password'> | null> => {
    return prisma.user.findUnique({ where: { email: emailAddress },  omit: {password: true} });
};
