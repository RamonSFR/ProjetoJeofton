export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'

export type UserRole = 'client' | 'manager'

export interface UserRecord {
  id: number
  cpf: string
  name: string
  email: string
  role?: UserRole
  createdAt?: string
  updatedAt?: string
}

export interface RestaurantRecord {
  id: number
  name: string
  managerId: number
}

export interface ProductRecord {
  id: number
  restaurantId: number
  name: string
  price: string
}

export interface OrderItemRecord {
  id?: number
  productId: number
  productNameSnapshot?: string
  productName?: string
  quantity: number
  unitPrice: string | number
}

export interface OrderRecord {
  id: number
  orderId?: number
  restaurantId: number
  customerId: number
  customerName?: string
  customerEmail?: string
  total?: string | number
  totalAmount?: string | number
  status: OrderStatus
  deliveryAddressSnapshot?: string | null
  items?: OrderItemRecord[]
  createdAt?: string
  updatedAt?: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
  formErrors?: string[]
  current?: string
  requested?: string
}
