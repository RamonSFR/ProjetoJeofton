import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  patchOrderStatus,
} from "../controllers/Order/orderController";
import { validateRequest } from "../middleware/validate-request";
import {
  createOrderBodySchema,
  getOrdersQuerySchema,
  orderIdParamSchema,
  patchOrderStatusBodySchema,
} from "../validation/order-validation";

const router = Router();

// Commands (write model)
router.post("/", validateRequest(createOrderBodySchema, "body"), createOrder);
router.patch(
  "/:id/status",
  validateRequest(orderIdParamSchema, "params"),
  validateRequest(patchOrderStatusBodySchema, "body"),
  patchOrderStatus,
);

router.delete(
  "/:id",
  validateRequest(orderIdParamSchema, "params"),
  deleteOrder,
);

// Queries (read model)
router.get("/", validateRequest(getOrdersQuerySchema, "query"), getOrders);
router.get("/:id", validateRequest(orderIdParamSchema, "params"), getOrderById);

export default router;
