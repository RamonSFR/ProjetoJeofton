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
  getProductsByRestaurant
);

router.get(
  '/:restaurantId/products/:productId',
  validateRequest(restaurantAndProductIdParamSchema, 'params'),
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
