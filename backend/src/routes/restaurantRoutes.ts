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

router.post("/restaurants", validateRequest(createRestaurantSchema, 'body'), createRestaurant);

router.get('/restaurants', validateRequest(getRestaurantsQuerySchema, 'query'), getAllRestaurants);

router.get('/restaurants/:id', validateRequest(restaurantIdParamSchema, 'params'), getRestaurantById);

router.put(
  '/restaurants/:id',
  validateRequest(restaurantIdParamSchema, 'params'),
  validateRequest(updateRestaurantSchema, 'body'),
  updateRestaurant
);

router.delete('/restaurants/:id', validateRequest(restaurantIdParamSchema, 'params'), deleteRestaurant);

export default router;
