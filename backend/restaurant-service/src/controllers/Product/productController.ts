import type { Request, Response } from 'express';
import * as productService from '../../services/Product/productService';
import type {
  CreateProductBody,
  GetProductsQuery,
  RestaurantAndProductIdParam,
  RestaurantIdForProductsParam,
  UpdateProductBody,
} from '../../validation/product-validation';

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { restaurantId } = req.validatedParams as RestaurantIdForProductsParam;
  const body = req.validatedBody as CreateProductBody;
  try {
    const product = await productService.create(restaurantId, {
      name: body.name,
      price: body.price,
    });
    res.status(201).json(product);
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2003') {
      res.status(404).json({ message: 'Restaurante nao encontrado.' });
      return;
    }
    res.status(500).json({ message: 'Erro ao criar produto.' });
  }
};

export const getProductsByRestaurant = async (req: Request, res: Response): Promise<void> => {
  const { restaurantId } = req.validatedParams as RestaurantIdForProductsParam;
  const query = req.validatedQuery as GetProductsQuery;
  try {
    const result = await productService.getPaginatedByRestaurant({
      restaurantId,
      page: query.page,
      pageSize: query.pageSize,
      productIds: query.ids,
    });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar produtos.' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const { restaurantId, productId } = req.validatedParams as RestaurantAndProductIdParam;
  try {
    const product = await productService.getById(restaurantId, productId);
    if (!product) {
      res.status(404).json({ message: 'Produto nao encontrado.' });
      return;
    }
    res.status(200).json(product);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar produto.' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { restaurantId, productId } = req.validatedParams as RestaurantAndProductIdParam;
  const body = req.validatedBody as UpdateProductBody;
  try {
    const product = await productService.update(restaurantId, productId, body);
    res.status(200).json(product);
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') {
      res.status(404).json({ message: 'Produto nao encontrado.' });
      return;
    }
    res.status(500).json({ message: 'Erro ao atualizar produto.' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { restaurantId, productId } = req.validatedParams as RestaurantAndProductIdParam;
  try {
    const product = await productService.remove(restaurantId, productId);
    res.status(200).json(product);
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') {
      res.status(404).json({ message: 'Produto nao encontrado.' });
      return;
    }
    res.status(500).json({ message: 'Erro ao remover produto.' });
  }
};
