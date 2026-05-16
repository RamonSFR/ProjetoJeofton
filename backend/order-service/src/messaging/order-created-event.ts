export type OrderCreatedEventItem = {
  readonly productId: number;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: string;
};

export type OrderCreatedEvent = {
  readonly eventId: string;
  readonly orderId: number;
  readonly restaurantId: number;
  readonly customerId: number;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly totalAmount: string;
  readonly deliveryAddressSnapshot: string | null;
  readonly createdAt: string;
  readonly items: readonly OrderCreatedEventItem[];
};

export const ORDER_CREATED_EXCHANGE_NAME = 'gestao-pedidos.events';
export const ORDER_CREATED_ROUTING_KEY = 'pedido.criado';
