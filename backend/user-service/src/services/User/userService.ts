import { prisma } from "../../database/prisma";
import type { User as UserModel } from "@prisma/client";
import bcrypt from "bcrypt";
import { logger } from "../../logger";

type UserCreateData = Omit<UserModel, "id" | "createdAt" | "updatedAt">;
type UserUpdateData = Partial<UserCreateData>;

const frontendRoleToDbRole = (role: "client" | "manager") =>
  role === "manager" ? "GERENTE" : "CLIENTE";

const lowerDbRoleToDbEnum = (roleLower: "cliente" | "gerente") =>
  roleLower === "gerente" ? "GERENTE" : "CLIENTE";

export type PaginatedUsersResult = {
  data: Omit<UserModel, "password">[];
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
  try {
    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { id: "asc" },
        omit: { password: true },
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
  } catch (err) {
    logger.error({ err, params }, "getPaginated failed");
    throw err;
  }
};

export const update = async (
  userId: number,
  data: UserUpdateData,
): Promise<Omit<UserModel, "password">> => {
  const dataComSenhaHash = data.password
    ? { ...data, password: await bcrypt.hash(data.password, 10) }
    : data;
  if ("role" in dataComSenhaHash && dataComSenhaHash.role) {
    // normalize lower-case role to DB enum
    // @ts-ignore
    dataComSenhaHash.role = lowerDbRoleToDbEnum(dataComSenhaHash.role as any);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: dataComSenhaHash,
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const create = async (
  data: UserCreateData,
): Promise<Omit<UserModel, "password">> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const createData = { ...data, password: hashedPassword } as any;
  if (createData.role) {
    createData.role = lowerDbRoleToDbEnum(createData.role);
  }

  const user = await prisma.user.create({
    data: createData,
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getById = async (
  userId: number,
): Promise<Omit<UserModel, "password"> | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });
  } catch (err) {
    logger.error({ err, userId }, "getById failed");
    throw err;
  }
};

export const remove = async (
  userId: number,
): Promise<Omit<UserModel, "password">> => {
  try {
    return await prisma.user.delete({
      where: { id: userId },
      omit: { password: true },
    });
  } catch (err) {
    logger.error({ err, userId }, "remove failed");
    throw err;
  }
};

export const getByEmail = async (
  emailAddress: string,
): Promise<Omit<UserModel, "password"> | null> => {
  try {
    return await prisma.user.findUnique({
      where: { email: emailAddress },
      omit: { password: true },
    });
  } catch (err) {
    logger.error({ err, emailAddress }, "getByEmail failed");
    throw err;
  }
};

export const login = async (params: {
  email: string;
  password: string;
  role: "client" | "manager";
}): Promise<Omit<UserModel, "password"> | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: params.email },
    });
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      params.password,
      user.password,
    );
    if (!isValidPassword) {
      return null;
    }

    // normalize DB role to uppercase for comparison to handle legacy values
    const dbRole = (user.role || "").toString().toUpperCase();
    if (dbRole !== frontendRoleToDbRole(params.role)) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (err) {
    logger.error({ err, params }, "login failed");
    throw err;
  }
};
