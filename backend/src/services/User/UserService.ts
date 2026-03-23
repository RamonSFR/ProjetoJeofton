import { prisma } from '../../database/prisma';
import { UserModel } from '../../generated/prisma/models/User';
import bcrypt from 'bcrypt';

type UserCreateData = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>;
type UserUpdateData = Partial<UserCreateData>; // partial transforma todas propriedades de UserCreateData em opcionais
export const getAll = async (): Promise<UserModel[]> => {
    return prisma.UserModel.findMany();
};

export const update = async (id: number, data: UserUpdateData): Promise<UserModel> => {

    const dataComSenhaHash = data.password
        ? { ...data, password: await bcrypt.hash(data.password, 10) }
        : data;
    return prisma.UserModel.update({ where: { id }, data: dataComSenhaHash });
};

export const create = async (data: UserCreateData): Promise<UserModel> => {
    // Hash da senha se fornecida
    const dataComSenhaHash = data.password
        ? { ...data, password: await bcrypt.hash(data.password, 10) }
        : data;

    return prisma.UserModel.create({ data: dataComSenhaHash });
};


export const getById = async (id: number): Promise<UserModel | null> => {
    return prisma.UserModel.findUnique({ where: { id } });
};


export const remove = async (id: number): Promise<UserModel> => {
    return prisma.UserModel.delete({ where: { id } });
};

export const getByEmail = async (email: string): Promise<UserModel | null> => {
    return prisma.UserModel.findUnique({ where: { email } });
};
