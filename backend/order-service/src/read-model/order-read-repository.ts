import type { PoolClient } from 'pg';
import type { OrderCreatedEvent } from '../messaging/order-created-event';
import { executeReadModelQuery } from './read-model-db';
import type { OrderRead, OrderReadItem, PaginatedOrderReadsResult } from './read-model-types';

type OrderReadRow = {
  order_id: number;
  restaurant_id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  total_amount: string;
  status: string;
  delivery_address_snapshot: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type OrderReadItemRow = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
};

const mapItemRow = (row: OrderReadItemRow): OrderReadItem => {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    unitPrice: row.unit_price,
  };
};

const toIsoString = (value: Date | string): string => {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
};

const mapOrderRow = (row: OrderReadRow, items: readonly OrderReadItem[]): OrderRead => {
  return {
    orderId: row.order_id,
    restaurantId: row.restaurant_id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    totalAmount: row.total_amount,
    status: row.status,
    deliveryAddressSnapshot: row.delivery_address_snapshot,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    items,
  };
};

const fetchItemsByOrderIds = async (
  orderIds: readonly number[]
): Promise<Map<number, readonly OrderReadItem[]>> => {
  if (orderIds.length === 0) {
    return new Map<number, readonly OrderReadItem[]>();
  }
  const itemRows = await executeReadModelQuery<OrderReadItemRow>(
    `
      SELECT id, order_id, product_id, product_name, quantity, unit_price
      FROM order_items_read
      WHERE order_id = ANY($1::int[])
      ORDER BY id ASC
    `,
    [orderIds]
  );
  const groupedItems = new Map<number, OrderReadItem[]>();
  for (const row of itemRows) {
    const orderItems = groupedItems.get(row.order_id) ?? [];
    orderItems.push(mapItemRow(row));
    groupedItems.set(row.order_id, orderItems);
  }
  return groupedItems;
};

export const saveOrderProjection = async (
  client: PoolClient,
  payload: OrderCreatedEvent
): Promise<void> => {
  await client.query(
    `
      INSERT INTO orders_read (
        order_id,
        restaurant_id,
        customer_id,
        customer_name,
        customer_email,
        total_amount,
        status,
        delivery_address_snapshot,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
      ON CONFLICT (order_id) DO UPDATE SET
        restaurant_id = EXCLUDED.restaurant_id,
        customer_id = EXCLUDED.customer_id,
        customer_name = EXCLUDED.customer_name,
        customer_email = EXCLUDED.customer_email,
        total_amount = EXCLUDED.total_amount,
        delivery_address_snapshot = EXCLUDED.delivery_address_snapshot,
        updated_at = EXCLUDED.updated_at
    `,
    [
      payload.orderId,
      payload.restaurantId,
      payload.customerId,
      payload.customerName,
      payload.customerEmail,
      payload.totalAmount,
      'PENDING',
      payload.deliveryAddressSnapshot,
      payload.createdAt,
    ]
  );
  await client.query('DELETE FROM order_items_read WHERE order_id = $1', [payload.orderId]);
  const insertItemSql = `
    INSERT INTO order_items_read (order_id, product_id, product_name, quantity, unit_price)
    VALUES ($1, $2, $3, $4, $5)
  `;
  for (const item of payload.items) {
    await client.query(insertItemSql, [
      payload.orderId,
      item.productId,
      item.productName,
      item.quantity,
      item.unitPrice,
    ]);
  }
};

export const getOrderReadById = async (orderId: number): Promise<OrderRead | null> => {
  const orders = await executeReadModelQuery<OrderReadRow>(
    `
      SELECT
        order_id,
        restaurant_id,
        customer_id,
        customer_name,
        customer_email,
        total_amount,
        status,
        delivery_address_snapshot,
        created_at,
        updated_at
      FROM orders_read
      WHERE order_id = $1
    `,
    [orderId]
  );
  const orderRow = orders[0];
  if (!orderRow) {
    return null;
  }
  const itemsByOrder = await fetchItemsByOrderIds([orderId]);
  return mapOrderRow(orderRow, itemsByOrder.get(orderId) ?? []);
};

export const getOrderReadsPaginated = async (params: {
  page: number;
  pageSize: number;
  customerId?: number;
  restaurantId?: number;
  status?: string;
}): Promise<PaginatedOrderReadsResult> => {
  const { page, pageSize, customerId, restaurantId, status } = params;
  const offset = (page - 1) * pageSize;
  const clauses: string[] = [];
  const values: unknown[] = [];
  if (customerId !== undefined) {
    values.push(customerId);
    clauses.push(`customer_id = $${values.length}`);
  }
  if (restaurantId !== undefined) {
    values.push(restaurantId);
    clauses.push(`restaurant_id = $${values.length}`);
  }
  if (status !== undefined) {
    values.push(status);
    clauses.push(`status = $${values.length}`);
  }
  const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  const listValues = [...values, pageSize, offset];
  const rows = await executeReadModelQuery<OrderReadRow>(
    `
      SELECT
        order_id,
        restaurant_id,
        customer_id,
        customer_name,
        customer_email,
        total_amount,
        status,
        delivery_address_snapshot,
        created_at,
        updated_at
      FROM orders_read
      ${whereSql}
      ORDER BY order_id DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `,
    listValues
  );
  const totalRows = await executeReadModelQuery<{ total: string }>(
    `SELECT COUNT(*)::text AS total FROM orders_read ${whereSql}`,
    values
  );
  const total = Number(totalRows[0]?.total ?? '0');
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const orderIds = rows.map((row) => row.order_id);
  const itemsByOrder = await fetchItemsByOrderIds(orderIds);
  const data = rows.map((row) => mapOrderRow(row, itemsByOrder.get(row.order_id) ?? []));
  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

export const updateOrderReadStatus = async (params: {
  orderId: number;
  status: string;
  updatedAt: Date;
}): Promise<void> => {
  await executeReadModelQuery<{ order_id: number }>(
    `
      UPDATE orders_read
      SET status = $2, updated_at = $3
      WHERE order_id = $1
      RETURNING order_id
    `,
    [params.orderId, params.status, params.updatedAt.toISOString()]
  );
};
