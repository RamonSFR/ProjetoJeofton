import type { Request, Response } from 'express';
import * as userService from '../../services/User/userService';
import type {
  CreateUserBody,
  GetUserByEmailQuery,
  UpdateUserBody,
  UserIdParam,
} from '../../validation/user-validation';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (err){
    console.log(err);
    res.status(500).json({ message: 'Erro ao buscar usuarios.' });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as UserIdParam;
  try {
    const user = await userService.getById(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario nao encontrado.' });
      return;
    }
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar usuario.' });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const body = req.validatedBody as CreateUserBody;
  try {
    const newUser = await userService.create(body);
    res.status(201).json(newUser);
  } catch {
    res.status(500).json({ message: 'Erro ao criar usuario.' });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as UserIdParam;
  const body = req.validatedBody as UpdateUserBody;
  try {
    const updatedUser = await userService.update(id, body);
    res.status(200).json(updatedUser);
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar usuario.' });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as UserIdParam;
  try {
    const deletedUser = await userService.remove(id);
    res.status(200).json(deletedUser);
  } catch {
    res.status(500).json({ message: 'Erro ao remover usuario.' });
  }
};

export const getByEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.validatedQuery as GetUserByEmailQuery;
  try {
    const user = await userService.getByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'Usuario nao encontrado.' });
      return;
    }
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar usuario por email.' });
  }
};
