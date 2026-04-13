import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  patchOrderStatus,
} from '../controllers/Order/orderController';
import { validateRequest } from '../middleware/validate-request';
import {
  createOrderBodySchema,
  getOrdersQuerySchema,
  orderIdParamSchema,
  patchOrderStatusBodySchema,
} from '../validation/order-validation';

const router = Router();

router.post('/', validateRequest(createOrderBodySchema, 'body'), createOrder);

router.get('/', validateRequest(getOrdersQuerySchema, 'query'), getOrders);

router.patch(
  '/:id/status',
  validateRequest(orderIdParamSchema, 'params'),
  validateRequest(patchOrderStatusBodySchema, 'body'),
  patchOrderStatus
);

router.delete('/:id', validateRequest(orderIdParamSchema, 'params'), deleteOrder);

router.get('/:id', validateRequest(orderIdParamSchema, 'params'), getOrderById);

export default router;
