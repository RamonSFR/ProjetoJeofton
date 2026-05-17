import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductsByRestaurant,
  updateProduct,
} from '../controllers/Product/productController';
import { validateRequest } from '../middleware/validate-request';
import {
  createProductBodySchema,
  getProductsQuerySchema,
  restaurantAndProductIdParamSchema,
  restaurantIdForProductsParamSchema,
  updateProductBodySchema,
} from '../validation/product-validation';
import { publicResponseCache } from '../middleware/http-cache';

const router = Router();

router.post(
  '/:restaurantId/products',
  validateRequest(restaurantIdForProductsParamSchema, 'params'),
  validateRequest(createProductBodySchema, 'body'),
  createProduct
);

router.get(
  '/:restaurantId/products',
  validateRequest(restaurantIdForProductsParamSchema, 'params'),
  validateRequest(getProductsQuerySchema, 'query'),
  publicResponseCache(30),
  getProductsByRestaurant
);

router.get(
  '/:restaurantId/products/:productId',
  validateRequest(restaurantAndProductIdParamSchema, 'params'),
  publicResponseCache(60),
  getProductById
);

router.put(
  '/:restaurantId/products/:productId',
  validateRequest(restaurantAndProductIdParamSchema, 'params'),
  validateRequest(updateProductBodySchema, 'body'),
  updateProduct
);

router.delete(
  '/:restaurantId/products/:productId',
  validateRequest(restaurantAndProductIdParamSchema, 'params'),
  deleteProduct
);

export default router;
