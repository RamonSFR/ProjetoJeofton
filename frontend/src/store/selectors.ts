import type { RootState } from './index'

export const selectCartItems = (state: RootState) => state.cart.items

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )

export const selectCartRestaurantId = (state: RootState) =>
  state.cart.restaurantId

export const selectCartRestaurantName = (state: RootState) =>
  state.cart.restaurantName
