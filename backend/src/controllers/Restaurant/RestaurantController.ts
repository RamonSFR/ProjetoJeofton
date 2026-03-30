import { Request, Response } from "express";
import * as restaurantService from '../../services/Restaurant/restaurantService';

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await restaurantService.create(req.body);
    return res.status(201).json(restaurant);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ message: 'Unique field already exists: ${error.meta.target}' });
    return res.status(500).json({ message: error.message });
  }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await restaurantService.getAll();
    return res.json(restaurants);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const restaurant = await restaurantService.getById(Number(req.params.id));
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    return res.json(restaurant);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await restaurantService.update(Number(req.params.id), req.body);
    return res.json(restaurant);
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Restaurant not found' });
    if (error.code === 'P2002') return res.status(409).json({ message: `Unique field alredy exists ${error.meta.target}` });
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    await restaurantService.remove(Number(req.params.id));
    return res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Restaurant not found' });
    return res.status(500).json({ message: error.message });
  }
};