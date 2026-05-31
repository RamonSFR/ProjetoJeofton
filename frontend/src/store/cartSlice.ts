import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  productId: number
  restaurantId: number
  restaurantName: string
  name: string
  price: string
  quantity: number
}

export interface CartState {
  restaurantId: number | null
  restaurantName: string | null
  items: CartItem[]
}

export const initialCartState: CartState = {
  restaurantId: null,
  restaurantName: null,
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    hydrateCart: (_state, action: PayloadAction<CartState>) => action.payload,
    addToCart: (
      state,
      action: PayloadAction<{
        restaurantId: number
        restaurantName: string
        product: Omit<CartItem, 'restaurantId' | 'restaurantName' | 'quantity'>
        quantity?: number
      }>
    ) => {
      const quantity = action.payload.quantity ?? 1

      if (
        state.restaurantId !== null &&
        state.restaurantId !== action.payload.restaurantId
      ) {
        state.items = []
      }

      state.restaurantId = action.payload.restaurantId
      state.restaurantName = action.payload.restaurantName

      const existing = state.items.find(
        (item) => item.productId === action.payload.product.productId
      )

      if (existing) {
        existing.quantity += quantity
        return
      }

      state.items.push({
        ...action.payload.product,
        restaurantId: action.payload.restaurantId,
        restaurantName: action.payload.restaurantName,
        quantity
      })
    },
    setQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (cartItem) => cartItem.productId === action.payload.productId
      )

      if (!item) return

      item.quantity = Math.max(0, action.payload.quantity)
      state.items = state.items.filter((cartItem) => cartItem.quantity > 0)

      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = null
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (cartItem) => cartItem.productId !== action.payload
      )

      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = null
      }
    },
    clearCart: () => initialCartState
  }
})

export const { hydrateCart, addToCart, setQuantity, removeItem, clearCart } =
  cartSlice.actions

export default cartSlice.reducer
