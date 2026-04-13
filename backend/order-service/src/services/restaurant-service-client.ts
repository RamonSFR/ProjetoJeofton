import { Prisma } from '@prisma/client';

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL ?? 'http://127.0.0.1:3002';

export class RestaurantNotFoundError extends Error {
  readonly name = 'RestaurantNotFoundError';
  constructor(message = 'Restaurante nao encontrado') {
    super(message);
  }
}

export type RestaurantProductSnapshot = {
  readonly id: number;
  readonly name: string;
  readonly price: Prisma.Decimal;
};

type ProductsApiRow = {
  id: number;
  name: string;
  price: unknown;
};

type ProductsApiResponse = {
  data: ProductsApiRow[];
};

const parsePriceToDecimal = (raw: unknown): Prisma.Decimal => {
  if (typeof raw === 'string' || typeof raw === 'number') {
    return new Prisma.Decimal(raw);
  }
  throw new Error('Formato de preco invalido');
};

export const assertRestaurantExists = async (restaurantId: number): Promise<void> => {
  const url = `${RESTAURANT_SERVICE_URL.replace(/\/$/, '')}/${restaurantId}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.status === 404) {
      throw new RestaurantNotFoundError();
    }
    if (!response.ok) {
      throw new RestaurantNotFoundError('Falha ao consultar servico de restaurantes');
    }
  } catch (err) {
    if (err instanceof RestaurantNotFoundError) {
      throw err;
    }
    throw new RestaurantNotFoundError('Nao foi possivel contatar o servico de restaurantes');
  }
};

export const fetchProductsForRestaurant = async (params: {
  restaurantId: number;
  productIds: readonly number[];
}): Promise<readonly RestaurantProductSnapshot[]> => {
  const { restaurantId, productIds } = params;
  if (productIds.length === 0) {
    return [];
  }
  const uniqueSorted = [...new Set(productIds)].sort((a, b) => a - b);
  const query = new URLSearchParams({
    page: '1',
    pageSize: '100',
    ids: uniqueSorted.join(','),
  });
  const url = `${RESTAURANT_SERVICE_URL.replace(/\/$/, '')}/${restaurantId}/products?${query.toString()}`;
  try {
    const response = await fetch(url, { method: 'GET' });
    if (response.status === 404) {
      throw new RestaurantNotFoundError();
    }
    if (!response.ok) {
      throw new Error('Falha ao buscar produtos');
    }
    const body = (await response.json()) as ProductsApiResponse;
    if (!Array.isArray(body.data)) {
      throw new Error('Resposta de produtos invalida');
    }
    return body.data.map((row) => ({
      id: row.id,
      name: row.name,
      price: parsePriceToDecimal(row.price),
    }));
  } catch (err) {
    if (err instanceof RestaurantNotFoundError) {
      throw err;
    }
    throw new RestaurantNotFoundError('Nao foi possivel obter produtos do restaurante');
  }
};
