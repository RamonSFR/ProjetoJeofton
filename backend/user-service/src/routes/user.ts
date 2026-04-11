import { Router } from 'express';
import * as userController from '../controllers/User/UserController';
import { validateRequest } from '../middleware/validate-request';
import {
  createUserBodySchema,
  getUserByEmailQuerySchema,
  getUsersQuerySchema,
  updateUserBodySchema,
  userIdParamSchema,
} from '../validation/user-validation';

const router = Router();

router.get('/', validateRequest(getUsersQuerySchema, 'query'), userController.getAll);
router.get(
  '/email',
  validateRequest(getUserByEmailQuerySchema, 'query'),
  userController.getByEmail
);
router.get('/:id', validateRequest(userIdParamSchema, 'params'), userController.getById);
router.post('/', validateRequest(createUserBodySchema, 'body'), userController.create);
router.put(
  '/:id',
  validateRequest(userIdParamSchema, 'params'),
  validateRequest(updateUserBodySchema, 'body'),
  userController.update
);
router.delete('/:id', validateRequest(userIdParamSchema, 'params'), userController.remove);

export default router;
