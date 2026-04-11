import type { Request, Response } from 'express';
import * as restaurantService from '../../services/Restaurant/restaurantService';
import { ManagerNotFoundError } from '../../services/user-service-client';
import type {
  CreateRestaurantBody,
  GetRestaurantsQuery,
  RestaurantIdParam,
  UpdateRestaurantBody,
} from '../../validation/restaurant-validation';

export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  const body = req.validatedBody as CreateRestaurantBody;
  try {
    const restaurant = await restaurantService.create(body);
    res.status(201).json(restaurant);
  } catch (error: unknown) {
    if (error instanceof ManagerNotFoundError) {
      res.status(500).json({ message: 'Erro ao criar restaurante.' });
      return;
    }
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2002') {
      res.status(409).json({ message: 'Campo unico ja existe.' });
      return;
    }
    res.status(500).json({ message: 'Erro ao criar restaurante.' });
  }
};

export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  const { page, pageSize } = req.validatedQuery as GetRestaurantsQuery;
  try {
    const restaurants = await restaurantService.getPaginated({ page, pageSize });
    res.status(200).json(restaurants);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar restaurantes.' });
  }
};

export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as RestaurantIdParam;
  try {
    const restaurant = await restaurantService.getById(id);
    if (!restaurant) {
      res.status(404).json({ message: 'Restaurante nao encontrado.' });
      return;
    }
    res.status(200).json(restaurant);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar restaurante.' });
  }
};

export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as RestaurantIdParam;
  const body = req.validatedBody as UpdateRestaurantBody;
  try {
    const restaurant = await restaurantService.update(id, body);
    res.status(200).json(restaurant);
  } catch (error: unknown) {
    if (error instanceof ManagerNotFoundError) {
      res.status(500).json({ message: 'Erro ao atualizar restaurante.' });
      return;
    }
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') {
      res.status(404).json({ message: 'Restaurante nao encontrado.' });
      return;
    }
    if (prismaError.code === 'P2002') {
      res.status(409).json({ message: 'Campo unico ja existe.' });
      return;
    }
    res.status(500).json({ message: 'Erro ao atualizar restaurante.' });
  }
};

export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as RestaurantIdParam;
  try {
    const restaurant = await restaurantService.remove(id);
    res.status(200).json(restaurant);
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') {
      res.status(404).json({ message: 'Restaurante nao encontrado.' });
      return;
    }
    res.status(500).json({ message: 'Erro ao remover restaurante.' });
  }
};
