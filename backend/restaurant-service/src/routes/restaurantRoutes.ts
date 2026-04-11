import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/Restaurant/RestaurantController';
import { validateRequest } from '../middleware/validate-request';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  restaurantIdParamSchema,
  getRestaurantsQuerySchema,
} from '../validation/restaurant-validation';

const router = Router();

router.post('/', validateRequest(createRestaurantSchema, 'body'), createRestaurant);

router.get('/', validateRequest(getRestaurantsQuerySchema, 'query'), getAllRestaurants);

router.get('/:id', validateRequest(restaurantIdParamSchema, 'params'), getRestaurantById);

router.put(
  '/:id',
  validateRequest(restaurantIdParamSchema, 'params'),
  validateRequest(updateRestaurantSchema, 'body'),
  updateRestaurant
);

router.delete('/:id', validateRequest(restaurantIdParamSchema, 'params'), deleteRestaurant);

export default router;
