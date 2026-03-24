import { prisma } from '../../database/prisma';
import type { User as UserModel } from '@prisma/client';
import bcrypt from 'bcrypt';

type UserCreateData = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>;
type UserUpdateData = Partial<UserCreateData>; // partial transforma todas propriedades de UserCreateData em opcionais

export const getAll = async (): Promise<UserModel[]> => {
    return prisma.user.findMany();
};

export const update = async (userId: number, data: UserUpdateData): Promise<UserModel> => {
    const dataComSenhaHash = data.password
        ? { ...data, password: await bcrypt.hash(data.password, 10) }
        : data;
    return prisma.user.update({ where: { id: userId }, data: dataComSenhaHash });
};

export const create = async (data: UserCreateData): Promise<UserModel> => {
    const dataComSenhaHash = data.password
        ? { ...data, password: await bcrypt.hash(data.password, 10) }
        : data;

    return prisma.user.create({ data: dataComSenhaHash });
};

export const getById = async (userId: number): Promise<UserModel | null> => {
    return prisma.user.findUnique({ where: { id: userId } });
};

export const remove = async (userId: number): Promise<UserModel> => {
    return prisma.user.delete({ where: { id: userId } });
};

export const getByEmail = async (emailAddress: string): Promise<UserModel | null> => {
    return prisma.user.findUnique({ where: { email: emailAddress } });
};
