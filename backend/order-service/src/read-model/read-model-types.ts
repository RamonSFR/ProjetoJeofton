/**
 * Contratos de leitura usados pelo query model de pedidos.
 */
export type OrderReadItem = {
  readonly id: number;
  readonly orderId: number;
  readonly productId: number;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: string;
};

/**
 * Representacao denormalizada de pedido para consultas.
 */
export type OrderRead = {
  readonly orderId: number;
  readonly restaurantId: number;
  readonly customerId: number;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly totalAmount: string;
  readonly status: string;
  readonly deliveryAddressSnapshot: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly items: readonly OrderReadItem[];
};

/**
 * Resultado paginado para listagem de pedidos no query model.
 */
export type PaginatedOrderReadsResult = {
  readonly data: readonly OrderRead[];
  readonly meta: {
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly totalPages: number;
  };
};
