import type { Request, Response } from 'express';
import { RestaurantNotFoundError } from '../../services/restaurant-service-client';
import * as orderService from '../../services/Order/orderService';
import { CustomerNotFoundError } from '../../services/user-service-client';
import type {
  CreateOrderBody,
  GetOrdersQuery,
  OrderIdParam,
  PatchOrderStatusBody,
} from '../../validation/order-validation';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const body = req.validatedBody as CreateOrderBody;
  try {
    const order = await orderService.createOrder({
      restaurantId: body.restaurantId,
      customerId: body.customerId,
      items: body.items,
      deliveryAddressSnapshot: body.deliveryAddress ?? null,
    });
    res.status(201).json(order);
  } catch (error: unknown) {
    if (error instanceof CustomerNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof RestaurantNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof orderService.OrderItemsInvalidError) {
      res.status(422).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Erro ao criar pedido.' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as OrderIdParam;
  try {
    const order = await orderService.getById(id);
    if (!order) {
      res.status(404).json({ message: 'Pedido nao encontrado.' });
      return;
    }
    res.status(200).json(order);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar pedido.' });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const query = req.validatedQuery as GetOrdersQuery;
  try {
    const result = await orderService.getPaginated({
      page: query.page,
      pageSize: query.pageSize,
      customerId: query.customerId,
      restaurantId: query.restaurantId,
      status: query.status,
    });
    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: 'Erro ao listar pedidos.' });
  }
};

export const patchOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as OrderIdParam;
  const body = req.validatedBody as PatchOrderStatusBody;
  try {
    const order = await orderService.updateStatus(id, body.status);
    res.status(200).json(order);
  } catch (error: unknown) {
    if (error instanceof orderService.OrderNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof orderService.InvalidStatusTransitionError) {
      res.status(409).json({
        message: error.message,
        current: error.current,
        requested: error.requested,
      });
      return;
    }
    res.status(500).json({ message: 'Erro ao atualizar status do pedido.' });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.validatedParams as OrderIdParam;
  try {
    const order = await orderService.cancelOrder(id);
    res.status(200).json(order);
  } catch (error: unknown) {
    if (error instanceof orderService.OrderNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error instanceof orderService.InvalidStatusTransitionError) {
      res.status(409).json({
        message: 'Nao e possivel cancelar o pedido neste status.',
        current: error.current,
        requested: error.requested,
      });
      return;
    }
    res.status(500).json({ message: 'Erro ao cancelar pedido.' });
  }
};
