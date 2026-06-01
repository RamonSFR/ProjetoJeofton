import type { Request, Response } from "express";
import * as userService from "../../services/User/userService";
import { logger } from "../../logger";
import type {
  CreateUserBody,
  GetUserByEmailQuery,
  GetUsersQuery,
  LoginBody,
  UpdateUserBody,
  UserIdParam,
} from "../../validation/user-validation";

const serializeRole = (role: string | undefined) =>
  (role || "").toString().toUpperCase() === "GERENTE" ? "manager" : "client";

const serializeUser = <T extends { password?: unknown; role?: string }>(
  user: T,
) => {
  const { password: _password, ...rest } = user;
  return {
    ...rest,
    role: serializeRole(rest.role),
  };
};

const serializeUserList = <T extends { password?: unknown; role?: string }>(
  users: readonly T[],
) => users.map((user) => serializeUser(user));

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const { page, pageSize } = req.validatedQuery as GetUsersQuery;
  try {
    const result = await userService.getPaginated({ page, pageSize });
    res.status(200).json({
      ...result,
      data: serializeUserList(result.data),
    });
  } catch (err: any) {
    logger.error({ err }, "Erro ao buscar usuarios");
    res
      .status(500)
      .json({ message: "Erro ao buscar usuarios.", error: err?.message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as UserIdParam;
  try {
    const user = await userService.getById(id);
    if (!user) {
      res.status(404).json({ message: "Usuario nao encontrado." });
      return;
    }
    res.status(200).json(serializeUser(user));
  } catch (err: any) {
    logger.error({ err, id }, "Erro ao buscar usuario");
    res
      .status(500)
      .json({ message: "Erro ao buscar usuario.", error: err?.message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const body = req.validatedBody as CreateUserBody;
  let createPayload: any = { ...body };
  try {
    if (createPayload.role) {
      createPayload.role = createPayload.role.toString().toUpperCase();
    }
    const newUser = await userService.create(createPayload);
    res.status(201).json(serializeUser(newUser));
  } catch (err: any) {
    logger.error({ err, body: createPayload }, "Erro ao criar usuario");
    res
      .status(500)
      .json({ message: "Erro ao criar usuario.", error: err?.message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as UserIdParam;
  const body = req.validatedBody as UpdateUserBody;
  let updatePayload: any = { ...body };
  try {
    if (updatePayload.role) {
      updatePayload.role = updatePayload.role.toString().toUpperCase();
    }
    const updatedUser = await userService.update(id, updatePayload);
    res.status(200).json(serializeUser(updatedUser));
  } catch (err: any) {
    logger.error({ err, id, body: updatePayload }, "Erro ao atualizar usuario");
    res
      .status(500)
      .json({ message: "Erro ao atualizar usuario.", error: err?.message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as UserIdParam;
  try {
    const deletedUser = await userService.remove(id);
    res.status(200).json(deletedUser);
  } catch (err: any) {
    logger.error({ err, id }, "Erro ao remover usuario");
    res
      .status(500)
      .json({ message: "Erro ao remover usuario.", error: err?.message });
  }
};

export const getByEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email } = req.validatedQuery as GetUserByEmailQuery;
  try {
    const user = await userService.getByEmail(email);
    if (!user) {
      res.status(404).json({ message: "Usuario nao encontrado." });
      return;
    }
    res.status(200).json(serializeUser(user));
  } catch (err: any) {
    logger.error({ err, email }, "Erro ao buscar usuario por email");
    res
      .status(500)
      .json({
        message: "Erro ao buscar usuario por email.",
        error: err?.message,
      });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const body = req.validatedBody as LoginBody;
  try {
    const user = await userService.login({
      email: body.email,
      password: body.password,
      role: body.role,
    });

    if (!user) {
      res.status(401).json({ message: "Email ou senha invalidos." });
      return;
    }

    res.status(200).json(serializeUser(user));
  } catch (err: any) {
    logger.error({ err, body }, "Erro ao autenticar usuario");
    res
      .status(500)
      .json({ message: "Erro ao autenticar usuario.", error: err?.message });
  }
};
