import type {
  ApiErrorPayload,
  OrderRecord,
  OrderStatus,
  PaginatedResponse,
  ProductRecord,
  RestaurantRecord,
  UserRecord
} from '../types/api'

const USER_SERVICE_BASE_URL = (
  import.meta.env.VITE_USER_SERVICE_URL ?? '/api/users'
).replace(/\/$/, '')

const RESTAURANT_SERVICE_BASE_URL = (
  import.meta.env.VITE_RESTAURANT_SERVICE_URL ?? '/api/restaurants'
).replace(/\/$/, '')

const ORDER_SERVICE_BASE_URL = (
  import.meta.env.VITE_ORDER_SERVICE_URL ?? '/api/orders'
).replace(/\/$/, '')

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

const extractMessage = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return 'Falha ao comunicar com a API.'
  }

  const errorPayload = payload as ApiErrorPayload

  return errorPayload.message ?? 'Falha ao comunicar com a API.'
}

async function request<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  })

  const contentType = response.headers.get('content-type') ?? ''
  const responseBody = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(extractMessage(responseBody))
  }

  return responseBody as T
}

export const getUsers = (page = 1, pageSize = 20) =>
  request<PaginatedResponse<UserRecord>>(
    USER_SERVICE_BASE_URL,
    `${buildQuery({ page, pageSize })}`
  )

export const getUserByEmail = (email: string) =>
  request<UserRecord>(USER_SERVICE_BASE_URL, `/email${buildQuery({ email })}`)

export const loginUser = (payload: {
  email: string
  password: string
  role: 'client' | 'manager'
}) =>
  request<UserRecord>(USER_SERVICE_BASE_URL, '/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const getRestaurants = (page = 1, pageSize = 20) =>
  request<PaginatedResponse<RestaurantRecord>>(
    RESTAURANT_SERVICE_BASE_URL,
    `${buildQuery({ page, pageSize })}`
  )

export const getRestaurant = (restaurantId: number) =>
  request<RestaurantRecord>(RESTAURANT_SERVICE_BASE_URL, `/${restaurantId}`)

export const createRestaurant = (
  payload: Pick<RestaurantRecord, 'name' | 'managerId'>
) =>
  request<RestaurantRecord>(RESTAURANT_SERVICE_BASE_URL, '/', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const getRestaurantProducts = (
  restaurantId: number,
  params: { page?: number; pageSize?: number; ids?: string } = {}
) =>
  request<PaginatedResponse<ProductRecord>>(
    RESTAURANT_SERVICE_BASE_URL,
    `/${restaurantId}/products${buildQuery({
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      ids: params.ids
    })}`
  )

export const getProduct = (restaurantId: number, productId: number) =>
  request<ProductRecord>(
    RESTAURANT_SERVICE_BASE_URL,
    `/${restaurantId}/products/${productId}`
  )

export const createProduct = (
  restaurantId: number,
  payload: Pick<ProductRecord, 'name'> & { price: number | string }
) =>
  request<ProductRecord>(
    RESTAURANT_SERVICE_BASE_URL,
    `/${restaurantId}/products`,
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )

export const updateProduct = (
  restaurantId: number,
  productId: number,
  payload: Partial<Pick<ProductRecord, 'name'>> & { price?: number | string }
) =>
  request<ProductRecord>(
    RESTAURANT_SERVICE_BASE_URL,
    `/${restaurantId}/products/${productId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload)
    }
  )

export const deleteProduct = (restaurantId: number, productId: number) =>
  request<ProductRecord>(
    RESTAURANT_SERVICE_BASE_URL,
    `/${restaurantId}/products/${productId}`,
    {
      method: 'DELETE'
    }
  )

export const getOrders = (
  params: {
    page?: number
    pageSize?: number
    customerId?: number
    restaurantId?: number
    status?: OrderStatus | ''
  } = {}
) =>
  request<PaginatedResponse<OrderRecord>>(
    ORDER_SERVICE_BASE_URL,
    `${buildQuery({
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      customerId: params.customerId,
      restaurantId: params.restaurantId,
      status: params.status || undefined
    })}`
  )

export const getUserById = (userId: number) =>
  request<UserRecord>(USER_SERVICE_BASE_URL, `/${userId}`)

export const getOrderById = (orderId: number) =>
  request<OrderRecord>(ORDER_SERVICE_BASE_URL, `/${orderId}`)

export const createOrder = (payload: {
  restaurantId: number
  customerId: number
  items: Array<{ productId: number; quantity: number }>
  deliveryAddress?: string
}) =>
  request<OrderRecord>(ORDER_SERVICE_BASE_URL, '/', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateOrderStatus = (orderId: number, status: OrderStatus) =>
  request<OrderRecord>(ORDER_SERVICE_BASE_URL, `/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })

export const cancelOrder = (orderId: number) =>
  request<OrderRecord>(ORDER_SERVICE_BASE_URL, `/${orderId}`, {
    method: 'DELETE'
  })
